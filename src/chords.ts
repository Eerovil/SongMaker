import {
    buildTables,
    Chord,
    Scale,
    ScaleTemplates,
    Note,
    Instrument,
    Semitone,
    ChordTemplates,
} from "musictheoryjs";

const BEAT_LENGTH = 12;

const arrayOrderBy = function (array: Array<any>, selector: CallableFunction, desc = false) {
    return [...array].sort((a, b) => {
        a = selector(a);
        b = selector(b);

        if (a == b) return 0;
        return (desc ? a > b : a < b) ? -1 : 1;
    });
}

type Nullable<T> = T | null

export type MusicParams = {
    beatsPerBar?: number,
    baseTension?: number,
    cadenceCount?: number,
    barsPerCadence?: number,
    chords?: Array<string>,
    tempo?: number,
    halfNotes?: boolean,
    sixteenthNotes?: number,
    voiceP1?: string,
    voiceP2?: string,
    voiceP3?: string,
    voiceP4?: string,
    noteP1?: string,
    noteP2?: string,
    noteP3?: string,
    noteP4?: string,
}

export type MusicResult = {
    chord: Chord,
    tension: number,
    scale: Scale,
}

export type RichNote = {
    note: Note,
    duration: number,
    freq?: number,
    chord?: Chord,
    partIndex?: number,
    scale?: Scale,
    beam?: string,
}

export type DivisionedRichnotes = {
    [key: number]: Array<RichNote>,
}

export const globalSemitone = (note: Note) => {
    return note.semitone + ((note.octave) * 12);
}

const getClosestOctave = (note: Note, targetNote: Nullable<Note> = null, targetSemitone: Nullable<number> = null) => {
    // 
    let semitone = globalSemitone(note);
    targetSemitone = targetSemitone || globalSemitone(targetNote);
    console.log("Closest octave: ", semitone, targetSemitone);
    // Using modulo here -> -7 % 12 = -7
    // -13 % 12 = -1
    if (semitone == targetSemitone) {
        return note.octave;
    }
    const delta: number = targetSemitone > semitone ? 12 : -12;
    let ret = 0;
    let i = 0;
    const cleanOctave = (octave: number) => {
        return Math.min(Math.max(octave, 2), 6);
    }
    while (true) {
        i++;
        if (i > 1000) {
            throw new Error("Infinite loop");
        }
        semitone += delta;
        ret += delta / 12;  // How many octaves we changed
        if (delta > 0) {
            if (semitone >= targetSemitone) {
                if (Math.abs(semitone - targetSemitone) > Math.abs(semitone - 12 - targetSemitone)) {
                    // We went too far, go one back
                    ret -= 1;
                }
                console.log("Closest octave res: ", cleanOctave(note.octave + ret), ret);
                return cleanOctave(note.octave + ret);
            }
        }
        else {
            if (semitone <= targetSemitone) {
                if (Math.abs(semitone - targetSemitone) > Math.abs(semitone + 12 - targetSemitone)) {
                    // We went too far, go one back
                    ret += 1;
                }
                console.log("Closest octave res: ", cleanOctave(note.octave + ret), ret);
                return cleanOctave(note.octave + ret);
            }
        }
    }
}

const majScaleCircle: { [key: number]: Array<number> } = {}
majScaleCircle[Semitone.C] = [Semitone.G, Semitone.F]
majScaleCircle[Semitone.G] = [Semitone.D, Semitone.C]
majScaleCircle[Semitone.D] = [Semitone.A, Semitone.G]
majScaleCircle[Semitone.A] = [Semitone.E, Semitone.D]
majScaleCircle[Semitone.E] = [Semitone.B, Semitone.A]
majScaleCircle[Semitone.B] = [Semitone.Fs, Semitone.E]

majScaleCircle[Semitone.F] = [Semitone.C, Semitone.Bb]
majScaleCircle[Semitone.Bb] = [Semitone.F, Semitone.Eb]
majScaleCircle[Semitone.Eb] = [Semitone.Bb, Semitone.Ab]
majScaleCircle[Semitone.Ab] = [Semitone.Eb, Semitone.Db]
majScaleCircle[Semitone.Db] = [Semitone.Ab, Semitone.Gb]
majScaleCircle[Semitone.Gb] = [Semitone.Db, Semitone.Cb]
majScaleCircle[Semitone.Cb] = [Semitone.Gb, Semitone.Fb]


const majScaleDifference = (semitone1: number, semitone2: number) => {
    // Given two major scales, return how closely related they are
    // 0 = same scale
    // 1 = E.G. C and F or C and G
    let currentVal = majScaleCircle[semitone1];
    if (semitone1 == semitone2) {
        return 0;
    }
    for (let i = 0; i < 12; i++) {
        if (currentVal.includes(semitone2)) {
            return i + 1;
        }
        const newCurrentVal = new Set();
        for (const semitone of currentVal) {
            for (const newSemitone of majScaleCircle[semitone]) {
                newCurrentVal.add(newSemitone);
            }
        }
        currentVal = [...newCurrentVal] as Array<number>;
    }
    return 12;
}


const getTension = (fromChord: Nullable<Chord>, toChord: Chord, currentScale: Scale, beatsUntilLastChordInCadence: number, rememberedChords: Array<string>) => {
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    // console.log("getTension: ", fromChord.toString(), toChord.toString(), currentScale.toString())
    if (!fromChord) {
        fromChord = toChord;
    }
    const noteCount = Math.max(fromChord.notes.length, toChord.notes.length);
    const fromNotes = fromChord.notes;
    const toNotes = toChord.notes;
    // Compare the notes. Each differing note increases the tension a bit
    let tension = 0;
    const fromSemitones = fromNotes.map(note => note.semitone);
    const toSemitones = toNotes.map(note => note.semitone);
    const differingNotes = toSemitones.filter(semitone => !fromSemitones.includes(semitone));

    const toChordString = toChord.toString();
    const fromChordString = fromChord.toString();
    tension += differingNotes.length * (1 / noteCount) * 0.5;

    // If the differing notes are not in the current scale, increase the tension
    let differingNotesNotInScale: Array<number> = []
    let newScale: Nullable<Scale> = null;
    if (currentScale) {
        const scaleSemitones = currentScale.notes.map(note => note.semitone);
        differingNotesNotInScale = differingNotes.filter(semitone => !scaleSemitones.includes(semitone));
        if (differingNotesNotInScale.length > 0) {
            // How bad is the scale difference?
            const majorSemitones = [0, 2, 4, 5, 7, 9, 11];
            const candidateScales: Array<number> = []
            for (let scaleCandidate = 0; scaleCandidate < 12; scaleCandidate++) {
                const scaleSemitones = majorSemitones.map(semitone => (semitone + scaleCandidate) % 12);
                if (toSemitones.every(semitone => scaleSemitones.includes(semitone))) {
                    candidateScales.push(scaleCandidate);
                }
            }
            let closestScale = candidateScales[0];
            let closestScaleDistance = 100;
            if (closestScale) {
                closestScaleDistance = majScaleDifference(closestScale, currentScale.notes[0].semitone);
                for (const scaleCandidate of candidateScales) {
                    const scaleDistance = majScaleDifference(scaleCandidate, currentScale.notes[0].semitone);
                    if (scaleDistance < closestScaleDistance) {
                        closestScale = scaleCandidate;
                        closestScaleDistance = scaleDistance;
                    }
                }
            }
            let multiplier = 0.1;
            if (closestScaleDistance > 1) {
                multiplier = 0.5;
                if (closestScaleDistance > 2) {
                    multiplier = 1;
                    if (closestScaleDistance > 3) {
                        multiplier = 5;
                        if (closestScaleDistance > 4) {
                            multiplier = 10;
                            if (closestScaleDistance > 5) {
                                multiplier = 20;
                            }
                        }
                    }
                }
            }
            if (beatsUntilLastChordInCadence <= 3) {
                // No scale change in the last 4 beats
                multiplier = 2000;
            }
            // console.log("Scale: ", closestScale, "d: ", closestScaleDistance, "c: ", toChord.toString());
            // console.log("differingNotesNotInScale: ", differingNotesNotInScale)
            tension += differingNotesNotInScale.length * multiplier;

            // Scale change
            newScale = new Scale({
                key: closestScale,
                octave: 5,
                template: ScaleTemplates.major
            });

        }
    }

    // Figure out where the fromChord resolves to. If it resolves to the toChord, decrease the tension
    const fromIntervals = fromSemitones.map((semitone, index) => {
        if (index < fromSemitones.length - 1) {
            const nextSemitone = fromSemitones[(index + 1)];
            return ((nextSemitone - semitone) + 24) % 12;
        } else {
            return null;
        }
    }).filter(Boolean);
    // Does fromChord have any tensioning intervals?
    for (let i = 0; i < fromIntervals.length; i++) {
        // Seconds want to "grow" by one semitone
        if (fromIntervals[i] === 2) {
            const goodTones = [fromSemitones[i] - 1, fromSemitones[i + 1] + 1].map(semitone => semitone % 12);
            if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
                tension -= 0.5;
            }
        }
        // Perfect Fourths want to "shrink" by one semitones
        if (fromIntervals[i] === 5) {
            const goodTones = [fromSemitones[i] + 1, fromSemitones[i + 1] - 1].map(semitone => semitone % 12);
            if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
                tension -= 0.5;
            }
        }
    }
    const toIntervals: Array<number> = (toSemitones.map((semitone, index) => {
        if (index < toSemitones.length - 1) {
            const nextSemitone = toSemitones[(index + 1)];
            return ((nextSemitone - semitone) + 24) % 12;
        } else {
            return null;
        }
    }).filter(semitone => semitone != null)) as Array<number>;
    // Does toChord have any tensioning intervals?
    for (let i = 0; i < toIntervals.length; i++) {
        if (toIntervals[i] === 1) {
            tension += (1 / noteCount) * 2.0;
        }
        if (toIntervals[i] === 2) {
            tension += (1 / noteCount) * 1.0;
        }
        if (toIntervals[i] === 5) {
            tension += (1 / noteCount) * 1.0;
        }
        if (toIntervals[i] === 6) {
            tension += (1 / noteCount) * 1.0;
        }
    }

    // If chord has not 5th with base, increase tension
    if (toIntervals.length > 1 && toIntervals[0] + toIntervals[1] !== 7) {
        tension += 0.5;
    }

    const semitoneScaleIndex: { [key: number]: number } = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6,
    }

    let noteTensionsForward: { [key: number]: number } = {
        0: 0.1,  // Tonic (1st, 3rd, 6th) are leading softly (strongly to itself)
        1: 0.3,  // Subdominant (2nd, 4th) are leading a bitmore
        2: 0.1,
        3: 0.3,
        4: 0.6,  // Dominant (5th, 7th) is leading strongly
        5: 0.1,
        6: 0.6,
    }

    if (beatsUntilLastChordInCadence < 4 && beatsUntilLastChordInCadence >= 2) {
        // Try to get a chord with as much "leading" to tonic notes as possible
        // we change the tensions...
        noteTensionsForward = {
            0: 1.6,
            1: 0,
            2: 0.1,
            3: 1.6,
            4: 0,
            5: 1.6,
            6: 0,
        }
    } else if (beatsUntilLastChordInCadence < 2) {
        // Try to get a chord with as much tonic notes as possible
        noteTensionsForward = {
            0: 0,
            1: 1.6,
            2: 0,
            3: 1.6,
            4: 0,
            5: 0,  // 6th is good also for minor
            6: 1.6,
        }
    }

    let tensionBeforelead = tension;

    for (const fromSemitone of fromSemitones) {
        // We mark each note as "leading" to the next note. If that happens, reduce tension
        const scaleIndex: number = semitoneScaleIndex[fromSemitone];
        const forwardTension: number = noteTensionsForward[scaleIndex];
        if (forwardTension != undefined) {
            const nextSemitoneKey = Object.keys(semitoneScaleIndex).find(k => semitoneScaleIndex[k] === (scaleIndex + 1) % 7) as string;
            const nextSemitone = parseInt((isNaN(parseInt(nextSemitoneKey)) ? -1 : nextSemitoneKey) as string);
            if (toSemitones.includes(nextSemitone)) {
                tension -= forwardTension;
            } else {
                // Not resolving these leads causes more tension
                tension += forwardTension / 2;
            }

            // Each note is also laeding to itself
            const tensionToItself = (0.6 - forwardTension) * 0.7;
            if (tensionToItself > 0) {
                if (toSemitones.includes(fromSemitone)) {
                    tension -= tensionToItself;
                } else {
                    // Not resolving these leads causes more tension
                    tension += tensionToItself / 2;
                }
            }
        }
    }

    // if (toChord.notes[0].semitone == currentScale.notes[0].semitone) {
    //     console.log("Lead tension from ", fromChord.toString(), " to ", toChord.toString(), "(", currentScale.toString(), ")", " is ", (tensionBeforelead + tension).toFixed(2));
    // }

    for (let i=0; i<rememberedChords.length; i++) {
        if (toChordString == rememberedChords[i]) {
            console.log("Chord ", toChordString, " was already used ", i, " chords ago");
            tension -= (0.1 * i);
            if (rememberedChords[i - 1]) {
                if (rememberedChords[i - 1] == fromChordString) {
                    tension -= (0.1 * i);
                }
            }
        }
    }

    return { tension, newScale };
}


const randomChord = (scale: Scale, prevChords: Array<string>, params: MusicParams) => {
    const chordTypes = params.chords || ["maj", "min"] //, "dim", "aug", "maj7", "min7", "7", "dim7", "maj6", "min6", "6"]//, "sus2", "sus4"];
    //const chordTypes = ["min"]
    const notes = Object.keys(Semitone).filter(key => isNaN((key as any)))
    while (true) {

        const randomIndex = Math.floor(Math.random() * notes.length);
        const randomNote = notes[randomIndex];
        const randomChordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
        const randomChord = `(${randomNote.toString().replace(/\d/, '')})${randomChordType}`;
        if (prevChords && prevChords.includes(randomChord)) {
            continue;
        }
        return new Chord(randomChord);
    }
}


const semitoneDistance = (tone1: number, tone2: number) => {
    // distance from 0 to 11 should be 1
    // 0 - 11 + 12 => 1
    // 11 - 0 + 12 => 23 => 11

    // 0 - 6 + 12 => 6
    // 6 - 0 + 12 => 18 => 6

    // 0 + 6 - 3 + 6 = 6 - 9 = -3
    // 6 + 6 - 9 + 6 = 12 - 15 = 0 - 3 = -3
    // 11 + 6 - 0 + 6 = 17 - 6 = 5 - 6 = -1
    // 0 + 6 - 11 + 6 = 6 - 17 = 6 - 5 = 1

    return Math.abs((tone1 + 6) % 12 - (tone2 + 6) % 12);
}

const newVoiceLeadingNotes = (chords: Array<MusicResult>, params: MusicParams): DivisionedRichnotes => {
    // New voice leading algorithm, only for the initial chords (no melody yet)
    const ret: DivisionedRichnotes = {};

    const p1Note = params.noteP1 || "F4";
    const p2Note = params.noteP2 || "C4";
    const p3Note = params.noteP3 || "A3";
    const p4Note = params.noteP4 || "C3";

    const startingGlobalSemitones = [
        globalSemitone(new Note(p1Note)),
        globalSemitone(new Note(p2Note)),
        globalSemitone(new Note(p3Note)),
        globalSemitone(new Note(p4Note)),
    ]

    const semitoneLimits = [
        [startingGlobalSemitones[0] + -12, startingGlobalSemitones[0] + 12],
        [startingGlobalSemitones[1] + -12, startingGlobalSemitones[1] + 12],
        [startingGlobalSemitones[2] + -12, startingGlobalSemitones[2] + 12],
        [startingGlobalSemitones[3] + -12, startingGlobalSemitones[3] + 12],
    ]
    console.log(semitoneLimits)

    let lastBeatGlobalSemitones = [...startingGlobalSemitones]

    if (chords.length == 0) {
        return [];
    }

    for (let division = 0; division < chords.length * BEAT_LENGTH; division += BEAT_LENGTH) {
        // For each beat, we try to find a good matching semitone for each part.

        // Rules:
        // With	root position triads: double the root. 

        // With first inversion triads: double the root or 5th, in general. If one needs to double 
        // the 3rd, that is acceptable, but avoid doubling the leading tone.

        // With second inversion triads: double the fifth. 

        // With  seventh  chords:  there  is  one voice  for  each  note,  so  distribute as  fits. If  one 
        // must omit a note from the chord, then omit the 5th.

        const chord = chords[division / BEAT_LENGTH].chord;
        const scale = chords[division / BEAT_LENGTH].scale;

        ret[division] = [];
        // Depending on the inversion and chord type, we're doing different things

        if (chord.notes.length == 3) {
            const rootNote = chord.notes[0];
            const thirdNote = chord.notes[1];
            const fifthNote = chord.notes[2];
            // Triad stuff. Figure out the inversion.

            let loopDistance = 0;
            let loopNotes: { [key: number]: Note } = {};
            let usedNotes: Array<number> = [];
            let i=0;
            while (true) {
                i++;
                if (i > 1000) {
                    debugger;
                    throw new Error("Infinite loop");
                }
                // Do passes until we can figure out the inversion
                for (let partIndex=0; partIndex<4; partIndex++) {
                    if (loopNotes[partIndex]) {
                        continue;
                    }
                    const lastBeatGlobalSemitone = lastBeatGlobalSemitones[partIndex];
                    for (let noteIndex=0; noteIndex<chord.notes.length; noteIndex++) {
                        const note = chord.notes[noteIndex];
                        if (note.semitone == thirdNote.semitone && partIndex == 3) {
                            // Never put the third to part 4
                            continue;
                        }
                        if (usedNotes.includes(note.semitone)) {
                            continue;
                        }
                        const distance = semitoneDistance(lastBeatGlobalSemitone, note.semitone);
                        if (distance <= loopDistance) {
                            loopNotes[partIndex] = new Note({
                                semitone: note.semitone,
                                octave: 1,
                            })
                            usedNotes.push(note.semitone);
                            break;
                        }
                    }
                }
                if (Object.keys(loopNotes).length > 1) {
                    break;
                }
                loopDistance++;
            }

            let inversion;
            i=0;
            while (true) {
                i++;
                if (i > 1000) {
                    throw new Error("Infinite loop");
                }
                // Now we got at least two notes. Try to figure out our inversion.
                let inversionChoices = ['root', 'first', 'second'];
                if (loopNotes[0]) {
                    if (loopNotes[0] == rootNote) {
                        // highest note is root -> first inversion
                        inversionChoices = inversionChoices.filter(choice => choice == 'first');
                    }
                    if (loopNotes[0] == thirdNote) {
                        inversionChoices = inversionChoices.filter(choice => choice == 'second');
                    }
                    if (loopNotes[0] == fifthNote) {
                        inversionChoices = inversionChoices.filter(choice => choice == 'root');
                    }
                }
                if (loopNotes[1]) {
                    if (loopNotes[1] == rootNote) {
                        // Second highest note is root -> second inversion
                        inversionChoices = inversionChoices.filter(choice => choice == 'second');
                    }
                    if (loopNotes[1] == thirdNote) {
                        inversionChoices = inversionChoices.filter(choice => choice == 'root');
                    }
                    if (loopNotes[1] == fifthNote) {
                        inversionChoices = inversionChoices.filter(choice => choice == 'first');
                    }
                }
                if (loopNotes[2]) {
                    if (loopNotes[2] == rootNote) {
                        // third hightest note is root -> root inversion
                        inversionChoices = inversionChoices.filter(choice => choice == 'root');
                    }
                    if (loopNotes[2] == thirdNote) {
                        inversionChoices = inversionChoices.filter(choice => choice == 'first');
                    }
                    if (loopNotes[2] == fifthNote) {
                        inversionChoices = inversionChoices.filter(choice => choice == 'second');
                    }
                }
                if (loopNotes[3]) {
                    // The "doubled note"
                    // Here we have some options
                    if (loopNotes[3] == rootNote) {
                        // root is doubled -> root or first inversion
                        inversionChoices = inversionChoices.filter(choice => choice == 'root' || choice == 'first');
                    }
                    if (loopNotes[3] == thirdNote) {
                        // third is doubled -> this should never happen...
                        inversionChoices = [];
                    }
                    if (loopNotes[3] == fifthNote) {
                        // fifth is doubled -> first or second inversion
                        inversionChoices = inversionChoices.filter(choice => choice == 'first' || choice == 'second');
                    }
                }
                if (inversionChoices.length == 0) {
                    // Uh oh, no possible inversions. Remove a note
                    for (let key in loopNotes) {
                        delete loopNotes[key];
                        break;
                    }
                } else {
                    // We have an inversion!
                    inversion = inversionChoices[Math.floor(Math.random() * inversionChoices.length)];
                    break;
                }
            }
            // Now that we know the inversion, the rest is easy. Just follow the rules.

            const addPartNote = (partIndex: number, note: Note) => {
                ret[division][partIndex] = {
                    note: new Note({
                        semitone: note.semitone,
                        octave: 1  // dummy
                    }),
                    duration: BEAT_LENGTH,
                    partIndex: partIndex + 1,
                    chord: chord,
                    scale: scale,
                };
            }

            for (let partIndex=0; partIndex<4; partIndex++) {
                if (loopNotes[partIndex]) {
                    // Add out selected notes
                    ret[division][partIndex] = {
                        note: loopNotes[partIndex],
                        duration: BEAT_LENGTH,
                        partIndex: partIndex + 1,
                        chord: chord,
                        scale: scale,
                    }
                }
            }
            if (inversion == 'root') {
                // Root inversion
                for (let partIndex=0; partIndex<4; partIndex++) {
                    if (ret[division][partIndex]) {
                        // This part is already set
                        continue;
                    }
                    if (partIndex == 3) {
                        addPartNote(partIndex, rootNote);
                    }
                    if (partIndex == 2) {
                        addPartNote(partIndex, rootNote);
                    }
                    if (partIndex == 1) {
                        addPartNote(partIndex, thirdNote);
                    }
                    if (partIndex == 0) {
                        addPartNote(partIndex, fifthNote);
                    }
                }
            }
            if (inversion == 'first') {
                // First inversion
                for (let partIndex=0; partIndex<4; partIndex++) {
                    if (ret[division][partIndex]) {
                        // This part is already set
                        continue;
                    }
                    if (partIndex == 3) {
                        addPartNote(partIndex, rootNote);
                    }
                    if (partIndex == 2) {
                        addPartNote(partIndex, thirdNote);
                    }
                    if (partIndex == 1) {
                        addPartNote(partIndex, fifthNote);
                    }
                    if (partIndex == 0) {
                        addPartNote(partIndex, rootNote);
                    }
                }
            }
            if (inversion == 'second') {
                // Second inversion
                for (let partIndex=0; partIndex<4; partIndex++) {
                    if (ret[division][partIndex]) {
                        // This part is already set
                        continue;
                    }
                    if (partIndex == 3) {
                        addPartNote(partIndex, fifthNote);
                    }
                    if (partIndex == 2) {
                        addPartNote(partIndex, fifthNote);
                    }
                    if (partIndex == 1) {
                        addPartNote(partIndex, rootNote);
                    }
                    if (partIndex == 0) {
                        addPartNote(partIndex, thirdNote);
                    }
                }
            }
        }

        // Lastly, we select the octaves

        // Get part 4 first
        ret[division][3].note.octave = getClosestOctave(ret[division][3].note, null, lastBeatGlobalSemitones[3]);
        const part4GlobalSemitone = globalSemitone(ret[division][3].note)
        if (part4GlobalSemitone < semitoneLimits[3][0]) {
            ret[division][3].note.octave += 1;
        }
        if (part4GlobalSemitone > semitoneLimits[3][1]) {
            ret[division][3].note.octave -= 1;
        }

        // Build the rest on top
        let minSemitone = globalSemitone(ret[division][3].note);
        for (let partIndex=2; partIndex>=0; partIndex--) {
            const note = ret[division][partIndex].note
            let gTone = globalSemitone(note);

            while (gTone < semitoneLimits[partIndex][0] || gTone < minSemitone) {
                note.octave += 1;
                gTone = globalSemitone(note);
                if (gTone < semitoneLimits[partIndex][0] || gTone < minSemitone) {
                    // We're about to break. Check if we should go up one more
                    const distance = Math.abs(gTone - lastBeatGlobalSemitones[partIndex])
                    const octaveUpDistance = Math.abs(gTone + 12 - lastBeatGlobalSemitones[partIndex])
                    if (octaveUpDistance < distance) {
                        note.octave += 1;
                        gTone = globalSemitone(note);
                    }
                }
            }
            minSemitone = gTone;
        }

        lastBeatGlobalSemitones = [
            globalSemitone(ret[division][0].note),
            globalSemitone(ret[division][1].note),
            globalSemitone(ret[division][2].note),
            globalSemitone(ret[division][3].note),
        ];

    }

    return ret;
}

const makeVoiceLeadingNotes = (chords: Array<MusicResult>, melody: { [key: number]: RichNote }, params: MusicParams) => {
    // return value will be an object ,keyed by division. It can contain an array of RichNotes with each note 
    // Marked with "partIndex" to indicate which voice it belongs to.
    // NOTE: For each partIndex, the durations should match, so that at any division, if we add "duration"
    // To any given part note in, we will get something at "division + duration" (empty spaces not allowed)
    const ret: DivisionedRichnotes = {};

    const p1Note = params.noteP1 || "F4";
    const p2Note = params.noteP2 || "C4";
    const p3Note = params.noteP3 || "A3";
    const p4Note = params.noteP4 || "C3";

    const startingGlobalSemitones = [
        globalSemitone(new Note(p1Note)),
        globalSemitone(new Note(p2Note)),
        globalSemitone(new Note(p3Note)),
        globalSemitone(new Note(p4Note)),
    ]

    const semitoneLimits = [
        [startingGlobalSemitones[0] + -12, startingGlobalSemitones[0] + 12],
        [startingGlobalSemitones[1] + -12, startingGlobalSemitones[1] + 12],
        [startingGlobalSemitones[2] + -12, startingGlobalSemitones[2] + 12],
        [startingGlobalSemitones[3] + -12, startingGlobalSemitones[3] + 12],
    ]
    console.log(semitoneLimits)

    let lastBeatGlobalSemitones = [...startingGlobalSemitones]

    if (chords.length == 0) {
        return [];
    }

    // Initial note spread.
    ret[0] = [];

    const firstMelodyNote = melody[0].note;
    firstMelodyNote.octave = getClosestOctave(firstMelodyNote, null, startingGlobalSemitones[0])
    const firstBeatNotes: Array<RichNote> = chords[0].chord.notes.map(n => ({ note: n, duration: BEAT_LENGTH }));
    const firstChord: Chord = chords[0].chord
    const firstScale: Scale = chords[0].scale;

    ret[0].push({
        note: firstMelodyNote,
        duration: melody[0].duration,
        chord: firstChord,
        scale: firstScale,
        partIndex: 1,
        beam: melody[0].beam,
    });

    let tmpPartIndex = 2
    for (const richNote of firstBeatNotes) {
        const note: Note = richNote.note;
        const fixedNote: Note = note.copy();
        fixedNote.octave = getClosestOctave(fixedNote, firstMelodyNote, startingGlobalSemitones[tmpPartIndex - 1]);
        ret[0].push({
            note: fixedNote,
            duration: BEAT_LENGTH,
            chord: firstChord,
            scale: firstScale,
            partIndex: tmpPartIndex,
        });
        tmpPartIndex++;
    }
    ret[0] = arrayOrderBy(ret[0], (richNote: { freq: number; }) => richNote.freq);

    console.log("fixedNotes: ", ret[0].map(res => res.note.toString()))

    console.log("lastBeatGlobalSemitones:", lastBeatGlobalSemitones)

    const weighedAvailableSort = (partIndex: number, richNote: RichNote) => {
        const partLastSemitone = lastBeatGlobalSemitones[partIndex];
        const minSemitone = semitoneLimits[partIndex][0];
        const maxSemitone = semitoneLimits[partIndex][1];
        let direction = 'all';
        if (partLastSemitone >= maxSemitone) {
            direction = 'down';
        } else if (partLastSemitone <= minSemitone) {
            direction = 'up';
        }
        let ret = semitoneDistance(richNote.note.semitone, partLastSemitone % 12);
        if (richNote.chord && richNote.chord.notes[0].semitone == richNote.note.semitone) {
            // Try to keep the root note in part 4
            if (partIndex == 3) {
                if (ret > 0) {
                    ret -= 2;
                }
            } else {
                ret += 2;
            }
        }
        if (richNote.duration < BEAT_LENGTH) {
            // Try to keep the melody in part 1
            if (partIndex == 0) {
                if (ret > 0) {
                    ret -= 2;
                }
            } else {
                ret += 2;
                if (partIndex == 3) {
                    ret += 2;
                }
            }
        }
        const newGlobalSemitone = globalSemitone(richNote.note)
        if (direction == 'up') {
            // Trick: Try to add 1 semitone to richNote. If the distance is smaller after adding 1, it means that it's closer to lower side
            if (semitoneDistance(richNote.note.semitone, partLastSemitone) > semitoneDistance(richNote.note.semitone + 1, partLastSemitone)) {
                ret += 5
            }
        }
        if (direction == 'up') {
            // Trick: Try to add 1 semitone to richNote. If the distance is bigger after adding 1, it means that it's closer from the up side
            if (semitoneDistance(richNote.note.semitone, partLastSemitone) < semitoneDistance(richNote.note.semitone + 1, partLastSemitone)) {
                ret += 5
            }
        }
        // const distanceFromOriginal = Math.abs(
        //     globalSemitone(richNote.note) - startingGlobalSemitones[partIndex]
        // );
        // ret += Math.floor(distanceFromOriginal / 6);
        return ret;
    }

    for (let division = BEAT_LENGTH; division < chords.length * BEAT_LENGTH; division += BEAT_LENGTH) {
        // For each beat, we try to find a good matching semitone for each part.
        const firstBeatOfBar = division % (BEAT_LENGTH * 4) == 0;
        const musicalResult = chords[division / BEAT_LENGTH]
        let availableBeatNotes: Array<RichNote> = musicalResult.chord.notes.map(n => ({
            note: n,
            duration: BEAT_LENGTH,
            chord: musicalResult.chord,
            scale: musicalResult.scale,
        }));
        availableBeatNotes.push(melody[division]);
        ret[division] = [];
        for (let partIndex = 0; partIndex < 4; partIndex++) {
            const partLastSemitone = lastBeatGlobalSemitones[partIndex];
            const availableNotesByDistance: Array<RichNote> = arrayOrderBy(
                availableBeatNotes, (richNote: RichNote) => weighedAvailableSort(partIndex, richNote)
            )
            const closestNote: RichNote = availableNotesByDistance[0];
            if (!closestNote) {
                throw "No closest note found";
            }
            const closestNoteIndex = availableBeatNotes.findIndex(richNote => richNote.note.equals(closestNote.note) && richNote.duration == closestNote.duration);
            availableBeatNotes.splice(closestNoteIndex, 1);
            console.log("Available notes for part ", partIndex, " at division ", division, ": ", availableNotesByDistance.map(richNote => richNote.note.toString()), partLastSemitone)

            // move the available note to the right octave
            let fixedNote = closestNote.note.copy();
            let oldOctave = fixedNote.octave;
            fixedNote.octave = getClosestOctave(closestNote.note, null, partLastSemitone)
            const fixedGlobalSemitone = globalSemitone(fixedNote);
            if (semitoneLimits[partIndex][0] - 2 > fixedGlobalSemitone) {
                fixedNote.octave += 1;
            } else if (semitoneLimits[partIndex][1] + 2 < fixedGlobalSemitone) {
                fixedNote.octave -= 1;
            }

            let octaveDiff = fixedNote.octave - oldOctave;
            console.log("octaveDiff: ", octaveDiff)
            lastBeatGlobalSemitones[partIndex] = globalSemitone(fixedNote);

            // TODO: Use closestNote.duration instead of BEAT_LENGTH
            ret[division].push({
                note: fixedNote,
                chord: musicalResult.chord,
                duration: closestNote.duration,
                partIndex: partIndex + 1,
                scale: musicalResult.scale,
                beam: closestNote.beam,
            });

            // Check if the previous beat note is the same for this part
            if (!firstBeatOfBar && params.halfNotes && closestNote.duration == BEAT_LENGTH && ret[division - BEAT_LENGTH]) {
                const previousBeatNote = ret[division - BEAT_LENGTH].findIndex(richNote => richNote.partIndex == partIndex + 1);
                if (previousBeatNote != -1) {
                    if (ret[division - BEAT_LENGTH][previousBeatNote].note.equals(fixedNote) && ret[division - BEAT_LENGTH][previousBeatNote].duration == BEAT_LENGTH) {
                        // If it is the same, we add duration to it
                        ret[division - BEAT_LENGTH][previousBeatNote].duration += BEAT_LENGTH;
                        // And remove the note we just added
                        ret[division].splice(ret[division].length - 1, 1);
                    }
                }
            }


            if (closestNote.duration < BEAT_LENGTH) {
                // Add any notes between this and the next beat to this part
                for (let i = division + closestNote.duration; i < division + BEAT_LENGTH; i += 1) {
                    if (melody.hasOwnProperty(i)) {
                        ret[i] = ret[i] || [];
                        let fixedNote = melody[i].note.copy();
                        fixedNote.octave += octaveDiff;
                        ret[i].push({
                            note: fixedNote,
                            duration: melody[i].duration,
                            partIndex: partIndex + 1,
                            scale: musicalResult.scale,
                            beam: melody[i].beam,
                        });
                        i += melody[i].duration - 1;  // Just for fool-proofing and we shouldn't have to check the next
                    }
                }
            }
        }
    }
    return ret;

}
const NOTES_PER_MELODY_PART = 8

const randomChordNote = (chord: Chord, notesInThisBar: Array<Note>, scale: Scale, criteriaLevel: number, barDirection: string) => {
    let notes = chord.notes;
    // if (scale && criteriaLevel < 3) {
    //     // Try to choose a note that is not in the scale
    //     const newNotes = notes.filter(note => !scale.notes.map(note => note.semitone).includes(note.semitone));
    //     if (newNotes.length > 0) {
    //         notes = newNotes;
    //     }
    // }

    let gChoices: Array<number> = [];
    for (const note of notes) {
        const gSemitone: number = globalSemitone(note);
        gChoices.push(gSemitone - 12);
        gChoices.push(gSemitone);
        gChoices.push(gSemitone + 12);
    }
    // Remove duplicates
    gChoices = [...new Set(gChoices)];
    gChoices = gChoices.filter(gSemitone => gSemitone >= 30 && gSemitone <= 40);
    if (criteriaLevel < 4) {
        gChoices = gChoices.filter(gSemitone => gSemitone >= 12 * 2 && gSemitone <= 12 * 4);
    }

    //console.log("Before ", gChoices, notesInThisBar.map(note => globalSemitone(note)));

    if (criteriaLevel < 5 && notesInThisBar.length > 0) {
        // Additionally filter notes so that they are close enough to previous note
        const gPrevNote = globalSemitone(notesInThisBar[notesInThisBar.length - 1]);
        gChoices = gChoices.filter(gSemitone => Math.abs(gSemitone - gPrevNote) <= 8);
    }
    //console.log("After ", gChoices)

    if (criteriaLevel < 4 && (notesInThisBar || []).length > 0) {
        const lowestPoint = Math.min(...notesInThisBar.map(note => globalSemitone(note)));
        const highestPoint = Math.max(...notesInThisBar.map(note => globalSemitone(note)));
        const middlePoint = (lowestPoint + highestPoint) / 2;
        // Choose a note in correct direction
        if (barDirection == 'up') {
            gChoices = gChoices.filter(gTone => gTone >= lowestPoint);
        } else if (barDirection == 'down') {
            gChoices = gChoices.filter(gTone => gTone <= highestPoint);
        } else if (barDirection == 'same') {
            gChoices = gChoices.filter(gTone => gTone >= middlePoint - 3 && gTone <= middlePoint + 3);
        } else if (barDirection == 'repeat') {
            // Figure out which note this one should "copy"
            const noteToCopy = notesInThisBar[(notesInThisBar.length - 1) % NOTES_PER_MELODY_PART];
            const gNoteToCopy = globalSemitone(noteToCopy);
            if (criteriaLevel < 2) {
                gChoices = gChoices.filter(gTone => gTone >= gNoteToCopy - 1 && gTone <= gNoteToCopy + 1);
            } else {
                gChoices = gChoices.filter(gTone => gTone >= gNoteToCopy - 2 && gTone <= gNoteToCopy + 2);
            }
        }
    } else {
        console.log("Skipped direction ", barDirection, gChoices);
    }

    if (gChoices.length == 0) {
        return null;
    }
    if (criteriaLevel < 4) {
        console.log("kept direction", barDirection)
    }

    const randomIndex = Math.floor(Math.random() * gChoices.length);
    const semitone = gChoices[randomIndex] % 12;
    const octave = Math.floor(gChoices[randomIndex] / 12);

    const ret = new Note()
    ret.semitone = semitone;
    ret.octave = octave;
    return ret;
}


const buildMelody = (chordList: Array<MusicResult>, params: MusicParams) => {
    // Initial melody, just half beats

    // Return value will be an object kwyed by "ticks", containing
    // an array of objects {note, length} for each tick

    // Lets just say a beat is 12 ticks
    const beatsPerCadence = 4 * params.barsPerCadence;
    const sixteenthChance = params.sixteenthNotes;
    const ret: { [key: number]: RichNote } = {};
    const maxDistance = 2;
    let prevNote: Nullable<Note> = null;
    let prevPrevNote: Nullable<Note> = null;
    const directions = [
        'up',
        'same',
        'down',
        'repeat',
        'repeat',
    ]

    let barDirection = 'same'
    let notesInThisBar: Array<Note> = []

    for (let i = 0; i < chordList.length - 0.5; i += 0.5) {
        let beatsUntilLastChordInCadence = Math.floor(i) % beatsPerCadence
        let cadenceEnding = beatsUntilLastChordInCadence >= beatsPerCadence - 1 || beatsUntilLastChordInCadence == 0
        console.log("cadenceEnding: ", cadenceEnding, "beatsUntilLastChordInCadence", beatsUntilLastChordInCadence)
        let noteIsGood = false;
        let randomNote: Nullable<Note> = null;
        let iterations = 0;
        const chord = chordList[Math.floor(i)].chord
        const scale = chordList[Math.floor(i)].scale
        if (i % NOTES_PER_MELODY_PART == 0 && notesInThisBar.length > 0) {
            barDirection = directions[Math.floor(Math.random() * directions.length)];
            if (notesInThisBar[notesInThisBar.length - 1].octave >= 5) {
                barDirection = 'down';
            }
            if (notesInThisBar[notesInThisBar.length - 1].octave <= 3) {
                barDirection = 'up';
            }
            if (barDirection == 'repeat') {
                console.log("keeping the notes")
                notesInThisBar.splice(0, notesInThisBar.length - NOTES_PER_MELODY_PART);  // Keep last 4
            } else {
                notesInThisBar.splice(0, notesInThisBar.length - 1);  // Keep the last
            }
        }
        while (!noteIsGood) {
            iterations++;
            const criteriaLevel = Math.floor(iterations / 40);
            randomNote = randomChordNote(chord, notesInThisBar, scale, criteriaLevel, barDirection);
            if (iterations > 300) {
                console.log("too many iterations in melody");
                break;
            }
            if (!randomNote) {
                continue
            }
            const prevChord = (chordList[Math.floor(i - 0.5)] || {}).chord;
            const prevNote = notesInThisBar[notesInThisBar.length - 1];
            if (prevNote && prevChord && prevChord.toString() == chord.toString()) {
                if (criteriaLevel < 4) {
                    if (prevNote.semitone == randomNote.semitone) {
                        continue;
                    }
                }
            }
            noteIsGood = true;
            // if (prevNote == null) {
            //     noteisGood = true;
            // } else {

            // }
        }
        if (!randomNote) {
            console.log("Failed to build melody")
            return ret;
        }
        console.log("randomNote: ", randomNote.toString());
        notesInThisBar.push(randomNote);
        ret[i * 12] = {
            note: randomNote,
            duration: cadenceEnding ? 12 : 6
        }
        prevPrevNote = prevNote;
        prevNote = randomNote;

        if ((i * 12 - 6) % BEAT_LENGTH == 0 && ret[i * 12 - 6].duration == 6 && ret[i * 12].duration == 6) {
            // Add beam info if previous melody note was on beat
            ret[i * 12 - 6].beam = 'begin';
            ret[i * 12].beam = 'end';
        }

        if (!cadenceEnding && (ret[(i - 1) * 12] || {}).duration == 6 && i > 1 && (Math.random() < sixteenthChance || barDirection == 'repeat') && prevPrevNote && prevNote) {
            // Add a note between prev and prevprev
            let randomBetweenNote;
            for (const note of scale.notes) {
                if (note.semitone > prevPrevNote.semitone && note.semitone < prevNote.semitone) {
                    randomBetweenNote = note;
                    randomBetweenNote.octave = prevPrevNote.octave;
                    break;
                }
                if (note.semitone < prevPrevNote.semitone && note.semitone > prevNote.semitone) {
                    randomBetweenNote = note;
                    randomBetweenNote.octave = prevPrevNote.octave;
                    break;
                }
            }
            if (randomBetweenNote) {
                console.log("Adding note ", randomBetweenNote.toString(), " before ", prevPrevNote.toString());
                ret[(i - 1) * 12].duration -= (3);
                const noteBefore = ret[(i - 1) * 12 - 6];
                if (noteBefore && noteBefore.duration == 6 && noteBefore.beam == "begin") {
                    noteBefore.beam = undefined;
                }
                ret[(i - 1) * 12].beam = 'begin';
                ret[((i - 1) * 12) + (3)] = {
                    note: randomBetweenNote,
                    duration: (3),
                    beam: "end",
                }
            } else {
                console.log("no note between", prevPrevNote.semitone, prevNote.semitone);
            }
        }
        if (cadenceEnding && i == Math.floor(i)) {
            i += 0.5;
        }
    }
    return ret;
}


const makeChords = (params: MusicParams): Array<MusicResult> => {
    // generate a progression
    const beatsPerBar = params.beatsPerBar || 4;
    const barsPerCadenceEnd = params.barsPerCadence || 4;
    const cadences = params.cadenceCount || 2

    const maxTensions = 1
    const baseTension = params.baseTension || 0.4;
    const highTension = 0.6;

    const maxBeats = cadences * barsPerCadenceEnd * beatsPerBar;
    let currentBeat = 0;
    let currentScale = new Scale({ key: Math.floor((Math.random() * 12)), octave: 5, template: ScaleTemplates.major});

    let result: Array<MusicResult> = [];
    let tensions: Array<number> = [];
    let tensionBeats = []
    let chordCounts = {};
    let rememberedChords = [];

    // for (let i=0; i<maxTensions; i++) {
    //     // tensionBeats.push(Math.floor(Math.random() * (maxBeats - 10)) + 6);
    // }

    while (currentBeat < maxBeats) {
        let chordIsGood = false;
        let randomChords: Array<string> = [];
        let newChord: Nullable<Chord> = null;
        let tension = 0;
        let newScale: Nullable<Scale> = null;
        const prevChord: Nullable<Chord> = (result[result.length - 1] || {} as any).chord || null;
        let iterations = 0;
        let currentScaleSemitones = currentScale.notes.map(note => note.semitone);

        let lowestTension = 100;

        // currentBeat == 0 -> 7
        // currentBeat == 7 -> 0
        // currentBeat == 8 -> 7
        // currentBeat == 4 -> 7-4 = 3
        // currentBeat == 9 -> 9 % 8 = 1 -> 7-1 = 6
        // currentBeat == 8 -> 8 % 8 = 0 -> 7-0 = 7
        const beatsUntilLastChordInCadence = (barsPerCadenceEnd * beatsPerBar) - currentBeat % (barsPerCadenceEnd * beatsPerBar) - 1;
        // console.log("beatsUntilLastChordInCadence: ", beatsUntilLastChordInCadence);

        while (!chordIsGood) {
            iterations++;
            if (iterations > 12 * 12) {
                console.log("Too many iterations, breaking, lowestTension: ", lowestTension);
                return [];
            }
            const criteriaLevel = Math.floor(iterations / (12 * 3));
            newChord = randomChord(currentScale, randomChords, params);
            randomChords.push(newChord.toString());
            const tensionResult = getTension(prevChord, newChord, currentScale, beatsUntilLastChordInCadence, rememberedChords);
            tension = tensionResult.tension;
            newScale = tensionResult.newScale;

            if (tension < lowestTension) {
                lowestTension = tension;
            }

            if (prevChord == null) {
                if (tension > 0 || newChord.notes.filter(note => !currentScaleSemitones.includes(note.semitone)).length > 0) {
                    continue;
                }
                chordIsGood = true;
                // } else if (currentBeat % 4 == 1 && tension <= 0) {
                //     newChord = prevChord.copy();
                //     chordIsGood = true;
            } else {

                let wantedTension = baseTension;
                // if (tensionBeats.includes(currentBeat)) {
                //     wantedTension = highTension;
                // }
                if (maxBeats - currentBeat < 4) {
                    // Final bar
                    wantedTension = -0.5
                }
                if (beatsUntilLastChordInCadence < 3) {
                    wantedTension = -0.7;
                } else {
                    wantedTension += (0.1 * criteriaLevel);
                }

                if (tension < wantedTension) {
                    chordIsGood = true;
                } else {
                    //console.log("Tension too high: ", tension, wantedTension);
                }
            }
        }
        if (newChord == null) {
            return [];
        }
        tensions.push(tension);
        const newChordString = newChord.toString();
        if (newScale) {
            currentScale = newScale;
            console.log("new scale: ", currentScale.toString());
        }
        console.log(`${beatsUntilLastChordInCadence}: ${tension.toFixed(1)} - ${newChordString}`)
        result.push({
            chord: newChord,
            tension: tension,
            scale: currentScale,
        } as MusicResult)
        rememberedChords.push(newChordString);
        if (rememberedChords.length > 6) {
            rememberedChords.shift();
        }
        chordCounts[newChordString] = (chordCounts[newChordString] || 0) + 1;
        currentBeat += 1;
    }

    return result
}

const testFunc = () => {
    let currentScale = new Scale("C5(major)");
    let chords = [
        new Chord("(C5)maj"),
        new Chord("(D5)maj"),
        new Chord("(E5)maj"),
        new Chord("(G5)maj"),
        new Chord("(G5)maj"),
        new Chord("(G5)maj"),
        new Chord("(C5)maj"),
        new Chord("(C5)maj"),
    ]
    chords = chords.reverse();
    for (let i = 1; i >= 0; i--) {
        if (i == 7) {
            continue
        }
        const tension = getTension(chords[i + 1], chords[i], currentScale, i);
        console.log(i, chords[i].toString(), tension.tension);
    }
}

export async function makeMusic(params: MusicParams) {
    console.log(params)
    let chords: Array<MusicResult> = [];
    while (true) {
        console.groupCollapsed("makeChords");
        chords = makeChords(params);
        console.groupEnd();
        if (chords.length != 0) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    // console.groupCollapsed("buildMelody")
    // const melody: { [key: number]: RichNote } = buildMelody(chords, params);
    // console.groupEnd();

    // console.groupCollapsed("makeVoiceLeadingNotes")
    // const divisionedNotes: DivisionedRichnotes = makeVoiceLeadingNotes(chords, melody, params)
    // console.groupEnd();

    const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);

    return {
        chords: chords,
        divisionedNotes: divisionedNotes,
    }

}

export { buildTables, testFunc }
