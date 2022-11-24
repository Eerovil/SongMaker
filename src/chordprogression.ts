import { Note, Scale, ScaleTemplates } from "musictheoryjs";
import { SourceMeasure } from "opensheetmusicdisplay";
import { Tension, TensionParams } from "./tension";
import { BEAT_LENGTH, Chord, DivisionedRichnotes, globalSemitone, gToneString, majScaleDifference, Nullable, semitoneDistance } from "./utils";


const buildTriadOn = (semitone: number, scale: Scale): Chord | null => {
    const scaleIndex = scale.notes.findIndex(note => note.semitone === semitone);
    if (!scaleIndex || scaleIndex < 0) {
        return null;
    }
    const note0Semitone = scale.notes[(scaleIndex + 0) % 7].semitone;
    const note1Semitone = scale.notes[(scaleIndex + 2) % 7].semitone;
    const note2Semitone = scale.notes[(scaleIndex + 4) % 7].semitone;

    let chordType = '';
    if (semitoneDistance(note0Semitone, note1Semitone) === 4) {
        chordType = 'maj';
    } else if (semitoneDistance(note0Semitone, note1Semitone) === 3) {
        chordType = 'min';
        if (semitoneDistance(note1Semitone, note2Semitone) === 3) {
            chordType = 'dim';
        }
    }
    if (!chordType) {
        return null;
    }
    const chord = new Chord(note0Semitone, chordType);
    return chord;
}


export const chordProgressionTension = (tension: Tension, values: TensionParams): void => {
        const {
            divisionedNotes,
            fromNotesOverride,
            toNotes,
            newChord,
            currentScale,
            originalScale,
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
        0: null,                     // I can go anywhere
        1: ['dominant', ],           // ii can go to V or vii or dominant
        2: [5, 3],                   // iii can go to vi or IV
        3: [1, 2, 'dominant'],       // IV can go to I, ii or dominant
        4: ['tonic', 6, 'dominant'], //, 5], // V can go to I, vii or dominant or vi  DECEPTIVE IS DISABLED FOR NOW
        5: ['sub-dominant', 2],      // vi can go to ii, IV, (or iii)
        6: ['tonic'],                // vii can go to I
    }
    let wantedFunction: string | null = null;
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
            if (beatsUntilLastChordInCadence <= 3) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence < 2) {
                wantedFunction = "dominant";
            }
        }
    }

    let prevChord;
    let prevScale: Scale | undefined = undefined;
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
            prevScale = richNote.scale;
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

    const getPossibleFunctions = (chord: Chord, scale: Scale) => {

        const semitoneScaleIndex: { [key: number]: number } = {
            [scale.notes[0].semitone]: 0,  // C
            [scale.notes[1].semitone]: 1,  // D
            [scale.notes[2].semitone]: 2,  // E
            [scale.notes[3].semitone]: 3,  // F
            [scale.notes[4].semitone]: 4,  // G
            [scale.notes[5].semitone]: 5,  // A
            [scale.notes[6].semitone]: 6,  // H
            // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
        }
        const rootSemitone = chord.notes[0].semitone;
        const rootScaleIndex = semitoneScaleIndex[rootSemitone];

        const possibleToFunctions: {[key: string]: number} = {
            'tonic': 0,
            'sub-dominant': 0,
            'dominant': 0,
        }
        if (rootScaleIndex == undefined) {
            possibleToFunctions.tonic = 100;
            possibleToFunctions['sub-dominant'] = 100;
            possibleToFunctions.dominant = 100;
        }
        if (![1, 3].includes(rootScaleIndex)) { // ii, IV
            possibleToFunctions["sub-dominant"] = 100;
        }
        if (![0, 4, 6].includes(rootScaleIndex)) { // V, vii, I64
            possibleToFunctions.dominant = 100;
        } else if (rootScaleIndex == 0) {
            // If I is not second inversion, it's not dominant
            if (!inversionName || !inversionName.startsWith('second')) {
                possibleToFunctions.dominant = 100;
            }
            tension.chordProgression += 6;  // Try to avoid I64
        }
        if (![0].includes(rootScaleIndex)) { // I
            possibleToFunctions.tonic = 100;
        }
        // Can't have tonic with non-scale notes
        if (chord.notes.some(note => semitoneScaleIndex[note.semitone] == undefined)) {
            possibleToFunctions.tonic = 100;
        }
        // Cant have tonic in second inversion.
        if (inversionName && inversionName.startsWith('second')) {
            possibleToFunctions.tonic = 10;
        }
        return {
            rootScaleIndex,
            possibleToFunctions: possibleToFunctions,
        };
    }

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
        // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
    }
    const toScaleIndexes = toNotes.map(note => semitoneScaleIndex[note.semitone]);

    if (part0MustBeTonic && toScaleIndexes[0] != 0) {
        tension.comment += "part 0 must be tonic! ";
        tension.cadence += 10;
    }

    const getChordsTension = (newChord: Chord | undefined, prevChord: Chord | undefined, prevPrevChord: Chord | undefined, currentScale: Scale) => {
        const tension = {
            cadence: 0,
            comment: "",
            chordProgression: 0,
        }
        const semitoneScaleIndex: { [key: number]: number } = {
            [currentScale.notes[0].semitone]: 0,  // C
            [currentScale.notes[1].semitone]: 1,  // D
            [currentScale.notes[2].semitone]: 2,  // E
            [currentScale.notes[3].semitone]: 3,  // F
            [currentScale.notes[4].semitone]: 4,  // G
            [currentScale.notes[5].semitone]: 5,  // A
            [currentScale.notes[6].semitone]: 6,  // H
            // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
        }

        if (newChord && prevChord && prevPrevChord) {
            if (newChord.notes[0].semitone == prevChord.notes[0].semitone) {
                // Same root
                tension.chordProgression += 1;
                if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
                    // Same root as previous chord
                    tension.chordProgression += 113;
                }
            }
            if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
                // Same root as previous chord (Don't go back)
                tension.chordProgression += 5;
            }
        }

        if (newChord) {
            const rootSemitone = newChord.notes[0].semitone;
            const rootScaleIndex = semitoneScaleIndex[rootSemitone];
            if (newChord.chordType.includes('dom7')) {
                // Only allow index ii and V for now.
                if (![1, 4].includes(rootScaleIndex)) {
                    tension.chordProgression += 13;
                }
            }
        }

        if (newChord && prevChord) {
            const fromFunctions = getPossibleFunctions(prevChord, currentScale);
            const toFunctions = getPossibleFunctions(newChord, currentScale);
            const possibleToFunctions = toFunctions.possibleToFunctions;

            const progressions = progressionChoices[fromFunctions.rootScaleIndex];
            if (progressions) {
                let good = false;
                if (fromFunctions.rootScaleIndex == toFunctions.rootScaleIndex) {
                    good = true;
                    tension.chordProgression += 1;
                }
                let dominantToDominant = false;
                for (const progression of progressions) {
                    if (`${progression}` == `${toFunctions.rootScaleIndex}`) {
                        // Perfect progression
                        good = true;
                        break;
                    }
                    if (typeof progression == "string" && toFunctions.possibleToFunctions && toFunctions.possibleToFunctions[progression] != 100) {
                        good = true;
                        tension.chordProgression += toFunctions.possibleToFunctions[progression];
                        if (progression == "dominant") {
                            dominantToDominant = true;
                        }
                        break;
                    }
                }
                if (!good) {
                    tension.chordProgression += 114;
                } else {
                    // If we're moving from "dominant" to "dominant", we need to prevent "lessening the tension"
                    if (dominantToDominant) {
                        let prevChordTension = 0;
                        let newChordTension = 0;
                        const leadingTone = (currentScale.key - 1 + 24) % 12;
                        const tonicNotes = [currentScale.notes[0], currentScale.notes[2], currentScale.notes[4]];
                        for (const note of prevChord.notes) {
                            // Each note not in tonic notes adds tension
                            // Leading tone adds more tension
                            if (!tonicNotes.some(tonicNote => tonicNote.semitone == note.semitone)) {
                                prevChordTension += 1;
                            }
                            if (note.semitone == leadingTone) {
                                prevChordTension += 1;
                            }
                        }
                        for (const note of newChord.notes) {
                            // Each note not in tonic notes adds tension
                            // Leading tone adds more tension
                            if (!tonicNotes.some(tonicNote => tonicNote.semitone == note.semitone)) {
                                newChordTension += 1;
                            }
                            if (note.semitone == leadingTone) {
                                newChordTension += 1;
                            }
                        }
                        if (newChordTension < prevChordTension) {
                            tension.chordProgression += 17;
                        }
                    }
                }
            } else if (progressions != null) {
                tension.chordProgression += 111;
            }

            if (wantedFunction) {
                if (wantedFunction == "sub-dominant") {
                    if (possibleToFunctions["sub-dominant"] == 100) {
                        if (possibleToFunctions["dominant"] == 100) {
                            tension.comment += `Wanted ${wantedFunction}`
                            tension.cadence += 100;
                        } else {
                            tension.cadence += 1;  // Dominant is
                        }
                    }
                }
                if (wantedFunction == "dominant") {
                    if (possibleToFunctions["dominant"] == 100) {
                        tension.comment += `Wanted ${wantedFunction}`
                        tension.cadence += 100;
                    }
                }
                if (wantedFunction == "tonic") {
                    if (possibleToFunctions["tonic"] > 0) {
                        tension.comment += `Wanted ${wantedFunction}`
                        tension.cadence += 100;
                    }
                }
            }
        }

        if (params.selectedCadence == "PAC") {
            // Since PAC is so hard, lets loosen up the rules a bit
            if (tension.cadence == 0) {
                tension.cadence = -3;
            }
        }
        return tension;
    }
    let tensionResult = {
        chordProgression: 112,
        cadence: 0,
        comment: ""
    };
    let prevChordIsTonicized = false;
    let newChordIsSecondaryDominant = false;
    const cadenceIsNear = wantedFunction || (beatsUntilLastChordInCadence || 0) < 5;
    if (prevChord && prevScale) {
        if (prevChord.notes[0].semitone == prevScale.notes[0].semitone) {
            prevChordIsTonicized = true;
        }
    }
    if (newChord && currentScale && originalScale) {
        // Chord must have at least one note not in the original scale
        if (newChord.notes.some(note => !originalScale.notes.some(scaleNote => scaleNote.semitone == note.semitone))) {
            const newChordFunctions = getPossibleFunctions(newChord, currentScale);
            if (newChordFunctions.possibleToFunctions.dominant < 100 || newChordFunctions.rootScaleIndex == 1) {
                newChordIsSecondaryDominant = true;
            }
        }
    }

    if (prevScale && currentScale.toString() != originalScale.toString() && originalScale.toString() != prevScale.toString() && currentScale.toString() != prevScale.toString()) {
        // Can't modulate during a modulation
    } else if (newChord && prevScale && currentScale.toString() != originalScale.toString() && originalScale.toString() == prevScale.toString()) {
        if (!cadenceIsNear && newChordIsSecondaryDominant && !prevChordIsTonicized) {
            // Check if this chord would allow moving to a new scale temporarily (a dominant function at most)
            // The tension is now actually between the tonicized chord and the previous chord, *in the previous scale*!
            let handled = false;
            if (['dom7'].includes(newChord.chordType)) {
                const fifthDownFromNewChordRoot = (newChord.notes[0].semitone - 7 + 24) % 12;
                const tonicizedChord = buildTriadOn(fifthDownFromNewChordRoot, prevScale);
                const tonicizedChordIsIOfCurrentScale = tonicizedChord?.notes[0].semitone == currentScale.notes[0].semitone;
                if (tonicizedChord && tonicizedChordIsIOfCurrentScale && ['maj', 'min'].includes(tonicizedChord.chordType)) {
                    handled = true;
                    tensionResult = getChordsTension(tonicizedChord, prevChord, prevPrevChord, prevScale);
                    //console.log("Tension from tonicized chord", tensionResult, "to", tonicizedChord.toString(), "from", prevChord?.toString(), "in", prevScale.toString());
                }
            }
            if (!handled) {
                if (['dim7'].includes(newChord.chordType)) {
                    const semitoneUpFromNewChordRoot = (newChord.notes[0].semitone + 1 + 24) % 12;
                    const tonicizedChord = buildTriadOn(semitoneUpFromNewChordRoot, prevScale);
                    const tonicizedChordIsIOfCurrentScale = tonicizedChord?.notes[0].semitone == currentScale.notes[0].semitone;
                    if (tonicizedChord && tonicizedChordIsIOfCurrentScale && ['maj', 'min'].includes(tonicizedChord.chordType)) {
                        handled = true;
                        tensionResult = getChordsTension(tonicizedChord, prevChord, prevPrevChord, prevScale);
                        //console.log("Tension from tonicized chord", tensionResult, "to", tonicizedChord.toString(), "from", prevChord?.toString(), "in", prevScale.toString());
                    }
                }
            }
            if (!handled) {
                if (['min7'].includes(newChord.chordType)) {
                    const twoSemitonesDownFromNewChordRoot = (newChord.notes[0].semitone - 2 + 24) % 12;
                    const tonicizedChord = buildTriadOn(twoSemitonesDownFromNewChordRoot, prevScale);
                    const tonicizedChordIsIOfCurrentScale = tonicizedChord?.notes[0].semitone == currentScale.notes[0].semitone;
                    if (tonicizedChord && tonicizedChordIsIOfCurrentScale && ['maj', 'min'].includes(tonicizedChord.chordType)) {
                        handled = true;
                        tensionResult = getChordsTension(tonicizedChord, prevChord, prevPrevChord, prevScale);
                        //console.log("Tension from tonicized chord", tensionResult, "to", tonicizedChord.toString(), "from", prevChord?.toString(), "in", prevScale.toString());
                    }
                }
            }
        }
    } else if (newChord && prevScale && currentScale.toString() != originalScale.toString() && currentScale.toString() == prevScale.toString()) {
        // If we are here, the modulated progression is going on still. If prevChord is a tonic, we can't allow anything in this new scale.
        if (prevChordIsTonicized || cadenceIsNear) {
            tensionResult = {
                chordProgression: 101,
                comment: "Tonicized chord reached, can't allow anything in this new scale",
                cadence: 0,
            }
        } else {
            tensionResult = getChordsTension(newChord, prevChord, prevPrevChord, prevScale);
        }
    } else if (!wantedFunction && newChord && prevScale && currentScale.toString() == originalScale.toString() && currentScale.toString() != prevScale.toString()) {
        // If we are here, the modulated progression is over. If prevChord is a tonic in the previous scale, we can continue in the original scale.
        if (prevChordIsTonicized && newChord.notes.every(note => currentScale.notes.some(scaleNote => scaleNote.semitone == note.semitone))) {
            tensionResult = getChordsTension(newChord, prevChord, prevPrevChord, currentScale);
        } else {
            tensionResult = {
                chordProgression: 102,
                comment: "Modulated progression has not ended, can't allow anything in the original scale",
                cadence: 0,
            }
        }
    } else if (wantedFunction && prevScale && (prevScale.toString() != originalScale.toString())) {
        // Oh noes, we are in a modulated progression and the cadence started. This will not do
    } else {
        tensionResult = getChordsTension(newChord, prevChord, prevPrevChord, currentScale);
    }
    tension.chordProgression = tensionResult.chordProgression;
    tension.comment += tensionResult.comment;
    tension.cadence += tensionResult.cadence;
}
