import { Note, Scale } from "musictheoryjs";
import { Tension, TensionParams } from "./tension";
import { BEAT_LENGTH, Chord, DivisionedRichnotes, globalSemitone, gToneString, majScaleDifference, Nullable, semitoneDistance } from "./utils";


export const chordProgressionTension = (tension: Tension, values: TensionParams): void => {
        const {
            divisionedNotes,
            fromNotesOverride,
            toNotes,
            newChord,
            currentScale,
            beatsUntilLastChordInCadence,
            beatsUntilLastChordInSong,
            inversionName,
            prevInversionName,
            params,
            mainParams,
            beatDivision,
        } = values;
    /*
    
    Basic circle of 5ths progression:

    iii      
    vi         (Deceptive tonic)
    ii <- IV   (Subdominant function)
    V  -> vii  (Dominant function)
    I          (Tonic function)

    Additionally:
    V -> vi is the deceptive cadence
    IV -> I is the plagal cadence
    iii -> IV is allowed.

    Once we have subdominant or dominant chords, there's no going back to iii or vi.

    I want to check pachelbel canon progression:
      OK   deceptive?   maybe since no function     OK    OK if its i64   Ok because its tonic. OK   OK
    I -> V    ->     vi         ->              iii -> IV     ->        I         ->        IV  -> V -> I

    */
    const progressionChoices: { [key: string]: (number | string)[] | null } = {
        0: null,                  // I can go anywhere
        1: ['dominant', ],        // ii can go to V or vii or dominant
        2: [5, 3],                // iii can go to vi or IV
        3: [1, 2, 'dominant'],    // IV can go to I, ii or dominant
        4: [0, 6, 'dominant', 5], // V can go to I, vii or dominant or vi
        5: ['sub-dominant', 2],      // vi can go to ii, IV, (or iii)
        6: [0],                   // vii can go to I
    }
    let wantedFunction = null;
    let tryToGetLeadingToneInPart0 = false;
    let part0MustBeTonic = false;

    if (beatsUntilLastChordInCadence && inversionName) {
        if (params.selectedCadence == "PAC") {
            if (beatsUntilLastChordInCadence <= 5) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence == 3) {
                wantedFunction = "dominant";
                tryToGetLeadingToneInPart0 = true;
            }
            if (beatsUntilLastChordInCadence < 3) {
                wantedFunction = "tonic";
                part0MustBeTonic = true;
            }
            if (beatsUntilLastChordInCadence <= 3 && !inversionName.startsWith('root')) {
                tension.comment += "cadence PAC: NOT root inversion! ";
                tension.cadence += 100;
            }
        } else if (params.selectedCadence == "IAC") {
            if (beatsUntilLastChordInCadence <= 5) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence == 3) {
                wantedFunction = "dominant";
            }
            if (beatsUntilLastChordInCadence < 3) {
                wantedFunction = "tonic";
            }
            if (beatsUntilLastChordInCadence <= 3 && inversionName.startsWith('root')) {
                // Not root inversion
                tension.comment += "cadence IAC: root inversion! ";
                tension.cadence += 100;
            }
        } else if (params.selectedCadence == "HC") {
            if (beatsUntilLastChordInCadence <= 4) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence < 3) {
                wantedFunction = "dominant";
            }
        }
    }

    let prevChord;
    let prevPrevChord;
    let passedFromNotes: Note[] = [];
    let prevPassedFromNotes: Note[] = [];
    let latestNotes: Note[] = [];
    if (divisionedNotes) {
        const latestDivision = beatDivision - BEAT_LENGTH;
        let tmp : Array<Note> = [];
        for (const richNote of (divisionedNotes[latestDivision] || [])) {
            // Use original notes, not the ones that have been turned into NACs
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevChord = richNote.chord;
        }
        passedFromNotes = [...tmp].filter(Boolean);
        tmp = [];
        for (const richNote of (divisionedNotes[latestDivision - BEAT_LENGTH] || [])) {
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevPrevChord = richNote.chord;
        }
        prevPassedFromNotes = [...tmp].filter(Boolean);

        for (let i=beatDivision; i>=0; i--) {
            for (const richNote of (divisionedNotes[i] || [])) {
                if (latestNotes[richNote.partIndex]) {
                    continue;
                }
                latestNotes[richNote.partIndex] = richNote.originalNote || richNote.note;
            }
            if (latestNotes.every(Boolean)) {
                break;
            }
        }

        if (!prevChord) {
            wantedFunction = "tonic";
        }
    } else if (fromNotesOverride) {
        passedFromNotes = fromNotesOverride;
    }

    let fromNotes;
    if (passedFromNotes.length < 4) {
        fromNotes = toNotes;
    } else {
        fromNotes = passedFromNotes;
    }

    const toSemitones = toNotes.map(note => note.semitone);
    const fromGlobalSemitones = fromNotes.map(note => globalSemitone(note));
    const toGlobalSemitones = toNotes.map(note => globalSemitone(note));

    // If the notes are not in the current scale, increase the tension
    const leadingTone = (currentScale.key - 1 + 24) % 12

    if (tryToGetLeadingToneInPart0 && toGlobalSemitones[0] % 12 != leadingTone) {
        // in PAC, we want the leading tone in part 0 in the dominant
        tension.cadence += 5;
    }

    const semitoneScaleIndex: { [key: number]: number } = {
        [currentScale.notes[0].semitone]: 0,  // C
        [currentScale.notes[1].semitone]: 1,  // D
        [currentScale.notes[2].semitone]: 2,  // E
        [currentScale.notes[3].semitone]: 3,  // F
        [currentScale.notes[4].semitone]: 4,  // G
        [currentScale.notes[5].semitone]: 5,  // A
        [currentScale.notes[6].semitone]: 6,  // H
        [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
    }

    const toScaleIndexes = toNotes.map(note => semitoneScaleIndex[note.semitone]);

    if (part0MustBeTonic && toScaleIndexes[0] != 0) {
        tension.cadence += 10;
    }

    const getPossibleFunctions = (chord: Chord) => {
        const rootSemitone = chord.notes[0].semitone;
        const rootScaleIndex = semitoneScaleIndex[rootSemitone];

        const possibleToFunctions: {[key: string]: boolean} = {
            'tonic': true,
            'sub-dominant': true,
            'dominant': true,
        }
        if (rootScaleIndex == undefined) {
            possibleToFunctions.tonic = false;
            possibleToFunctions['sub-dominant'] = false;
            possibleToFunctions.dominant = false;
        }
        if (![1, 3].includes(rootScaleIndex)) { // ii, IV
            possibleToFunctions["sub-dominant"] = false;
        }
        if (![0, 4, 6].includes(rootScaleIndex)) { // V, vii, I64
            possibleToFunctions.dominant = false;
        } else if (rootScaleIndex == 0) {
            // If I is not second inversion, it's not dominant
            if (!inversionName || !inversionName.startsWith('second')) {
                possibleToFunctions.dominant = false;
            }
        }
        if (![0].includes(rootScaleIndex)) { // I
            possibleToFunctions.tonic = false;
        }
        return {
            rootScaleIndex,
            possibleToFunctions: Object.keys(possibleToFunctions).filter(key => possibleToFunctions[key]),
        };
    }

    if (newChord && prevChord && prevPrevChord) {
        if (newChord.notes[0].semitone == prevChord.notes[0].semitone) {
            // Same root
            tension.chordProgression += 1;
            if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
                // Same root as previous chord
                tension.chordProgression += 100;
            }
        }
        if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
            // Same root as previous chord (Don't go back)
            tension.chordProgression += 5;
        }
    }

    if (newChord && prevChord) {
        const fromFunctions = getPossibleFunctions(prevChord);
        const toFunctions = getPossibleFunctions(newChord);
        const possibleToFunctions = toFunctions.possibleToFunctions;

        const progressions = progressionChoices[fromFunctions.rootScaleIndex];
        if (progressions) {
            let good = false;
            for (const progression of progressions) {
                if (`${progression}` == `${toFunctions.rootScaleIndex}`) {
                    // Perfect progression
                    good = true;
                    break;
                }
                if (typeof progression == "string" && toFunctions.possibleToFunctions && toFunctions.possibleToFunctions.includes(progression)) {
                    good = true;
                    break;
                }
            }
            if (!good) {
                tension.chordProgression += 100;
            }
        }

        if (wantedFunction) {
            if (wantedFunction == "sub-dominant") {
                if (!possibleToFunctions.includes("sub-dominant")) {// && !possibleToFunctions.dominant) {
                    if (!possibleToFunctions.includes("dominant")) {
                        tension.comment += `Wanted ${wantedFunction}`
                        tension.cadence += 100;
                    } else {
                        tension.cadence += 5;  // Dominant is
                    }
                }
            }
            if (wantedFunction == "dominant") {
                if (!possibleToFunctions.includes("dominant")) {
                    tension.comment += `Wanted ${wantedFunction}`
                    tension.cadence += 100;
                }
            }
            if (wantedFunction == "tonic") {
                if (!possibleToFunctions.includes("tonic")) {
                    tension.comment += `Wanted ${wantedFunction}`
                    tension.cadence += 100;
                }
            }
        }
    }
}
