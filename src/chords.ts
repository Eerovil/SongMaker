import {
    buildTables,
    Scale,
    ScaleTemplates,
    Note,
    Semitone,
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


const chordTemplates: { [key: string]: Array<number> } = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
}


class Chord {
    public notes: Array<Note>;
    public chordType: string;
    public toString() {
        // Find correct Semitone key
        let semitoneKey = Object.keys(Semitone).find(key => Semitone[key] === this.notes[0].semitone);
        if (semitoneKey == undefined) {
            return this.notes.map(note => note.toString()).join(", ");
        }
        return semitoneKey + this.chordType;
    }
    constructor(semitoneOrName: number | string, chordType: string | undefined = undefined) {
        let semitone;
        if (typeof semitoneOrName === "string") {
            semitone = semitoneOrName.match(/^\d+/);
            const parsedType = semitoneOrName.match(/^\d+(.*)/);
            if (semitone == null) {
                throw "Invalid chord name " + semitoneOrName;
            }
            if (parsedType == null) {
                throw "Invalid chord name " + semitoneOrName;
            }
            semitone = parseInt(semitone[0]);
            chordType = chordType || parsedType[1];
        } else {
            semitone = semitoneOrName;
        }
        this.chordType = chordType;
        const template = chordTemplates[chordType];
        if (template == undefined) {
            throw "Unknown chord type: " + chordType;
        }
        this.notes = [];
        for (let note of template) {
            this.notes.push(new Note({semitone: (semitone + note) % 12, octave: 1}));
        }
    }
}


type Nullable<T> = T | null

export class MusicParams {
    beatsPerBar?: number = 4;
    baseTension?: number = 0.3;
    cadenceCount?: number = 2
    barsPerCadence?: number = 4
    chords?: Array<string> = ["maj", "min"];
    tempo?: number = 40;
    halfNotes?: boolean = true;
    sixteenthNotes?: number = 0.5;
    parts: Array<{
        voice: string,
        note: string,
    }> = [];
    beatSettings: Array<{
        tension: number,
    }> = [];
    testMode?: boolean = false;
    chordSettings: Array<{
        weight: number
    }> = [];

    constructor(params: Partial<MusicParams> | undefined = undefined) {
        if (params) {
            for (let key in params) {
                this[key] = params[key];
            }
        }
    }
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
    tension?: number,
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


const getTension = (passedFromNotes: Array<Note>, toNotes: Array<Note>, currentScale: Scale, beatsUntilLastChordInCadence: number) => {
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */

    let fromNotes;
    if (passedFromNotes.length == 0) {
        fromNotes = toNotes;
    } else {
        fromNotes = passedFromNotes;
    }
    const toChordString = toNotes.map(n => n.toString()).join(', ');
    const fromChordString = fromNotes.map(n => n.toString()).join(', ');

    console.groupCollapsed("getTension: ", fromChordString, "to: ", toChordString, currentScale.toString())
    const noteCount = Math.max(fromNotes.length, toNotes.length);
    // Compare the notes. Each differing note increases the tension a bit
    let tension = 0;
    const fromSemitones = fromNotes.map(note => note.semitone);
    const toSemitones = toNotes.map(note => note.semitone);
    const differingNotes = toSemitones.filter(semitone => !fromSemitones.includes(semitone));

    tension += differingNotes.length * (1 / noteCount) * 0.5;
    console.log("Differing notes: ", tension);

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
            let multiplier = 0.5;
            if (closestScaleDistance > 1) {
                multiplier = 1;
                if (closestScaleDistance > 2) {
                    multiplier = 2;
                    if (closestScaleDistance > 3) {
                        multiplier = 1000;
                    }
                }
            }
            if (beatsUntilLastChordInCadence <= 3) {
                // No scale change in the last 4 beats
                multiplier = 2000;
            }
            console.log("Scale: ", closestScale, "d: ", closestScaleDistance, "c: ", toChordString);
            console.log("differingNotesNotInScale: ", differingNotesNotInScale)
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
    // const fromIntervals = fromSemitones.map((semitone, index) => {
    //     if (index < fromSemitones.length - 1) {
    //         const nextSemitone = fromSemitones[(index + 1)];
    //         return ((nextSemitone - semitone) + 24) % 12;
    //     } else {
    //         return null;
    //     }
    // }).filter(Boolean);
    // Does fromChord have any tensioning intervals?
    // for (let i = 0; i < fromIntervals.length; i++) {
    //     // Seconds want to "grow" by one semitone
    //     if (fromIntervals[i] === 2) {
    //         const goodTones = [fromSemitones[i] - 1, fromSemitones[i + 1] + 1].map(semitone => (semitone + 12) % 12);
    //         if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
    //             tension -= 0.5;
    //         }
    //     }
    //     // Perfect Fourths want to "shrink" by one semitones
    //     if (fromIntervals[i] === 5) {
    //         const goodTones = [fromSemitones[i] + 1, fromSemitones[i + 1] - 1].map(semitone => (semitone + 12) % 12);
    //         if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
    //             tension -= 0.5;
    //         }
    //     }
    // }
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
            tension += 2;
            console.log("interval 1 causing tension")
        }
        if (toIntervals[i] === 2) {
            tension += 1;
            console.log("interval 2 causing tension")
        }
        if (toIntervals[i] === 5) {
            tension += 0.5;
            console.log("interval 5 causing tension")
        }
        if (toIntervals[i] === 6) {
            tension += 1;
            console.log("interval 6 causing tension")
        }
    }

    // // If chord has not 5th with base, increase tension
    // if (toIntervals.length > 1 && toIntervals[0] + toIntervals[1] !== 7) {
    //     tension += 0.5;
    // }

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
                console.log("leading ", fromSemitone, " to next note, ", nextSemitone, " causing tension reduction")
            } else {
                // Not resolving these leads causes more tension
                tension += forwardTension / 2;
                console.log("not leading ", fromSemitone, " to next note, ", nextSemitone, " causing tension increase")
            }

            // Each note is also laeding to itself
            const tensionToItself = (0.6 - forwardTension) * 0.7;
            if (tensionToItself > 0) {
                if (toSemitones.includes(fromSemitone)) {
                    tension -= tensionToItself;
                    console.log("leading ", fromSemitone, " to itself causing tension reduction")
                } else {
                    // Not resolving these leads causes more tension
                    tension += tensionToItself / 2;
                    console.log("not leading ", fromSemitone, " to itself causing tension increase")
                }
            }
        }
    }

    // if (toNotes[0].semitone == currentScale.notes[0].semitone) {
    //     console.log("Lead tension from ", fromChordString, " to ", toChordString, "(", currentScale.toString(), ")", " is ", (tensionBeforelead + tension).toFixed(2));
    // }

    // if (fromChord.chordType == "sus4") {
    //     console.log("Lead tension from ", fromChordString, " to ", toChordString, "(", currentScale.toString(), ")", " is ", (tensionBeforelead + tension).toFixed(2));
    // }

    console.log("Tension from ", fromChordString, " to ", toChordString, "(", currentScale.toString(), ")", " is ", (tensionBeforelead + tension).toFixed(2));

    console.groupEnd()
    return { tension, newScale };
}


class RandomChordGenerator {
    private chordTypes: string[];
    private availableChords: Array<string>;
    private usedChords: Set<string>;

    constructor(params: MusicParams) {
        this.chordTypes = params.chords.filter(chordType => Object.keys(chordTemplates).includes(chordType)) || ["maj", "min"]
        this.usedChords = new Set();
        this.buildAvailableChords();
    };

    private buildAvailableChords() {
        if (!this.usedChords) {
            this.usedChords = new Set();
        }
        this.availableChords = (this.availableChords || []).filter(chord => !this.usedChords.has(chord));
        for (let i=0; i<100; i++) {
            const randomType = this.chordTypes[Math.floor(Math.random() * this.chordTypes.length)];
            const randomRoot = Math.floor(Math.random() * 12);
            if (!this.usedChords.has(randomRoot + randomType)) {
                this.availableChords.push(randomRoot + randomType);
            }
        }
    };

    public cleanUp() {
        if (this.usedChords) {
            this.usedChords.clear();
        }
        this.availableChords = [];
        delete this.usedChords;
        delete this.availableChords;
    }

    public getChord() {
        if (!this.availableChords || this.availableChords.length === 0) {
            this.buildAvailableChords();
        }
        let iterations = 0;
        while (true) {
            if (iterations++ > 100) {
                return null;
            }
            while (this.availableChords.length - 3 > 0) {
                const chordType = this.availableChords[Math.floor(Math.random() * this.availableChords.length)];
                if (!this.usedChords.has(chordType)) {
                    this.usedChords.add(chordType);
                    this.availableChords = this.availableChords.filter(chord => chord !== chordType);
                    return new Chord(chordType);
                }
            }
            this.buildAvailableChords();
        }
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

const partialVoiceLeading = (chord: Chord, prevNotes: Array<Note>, beat: number, params: MusicParams): Array<Note> => {
    // Return Notes in the Chord that are closest to the previous notes
    // For each part
    console.groupCollapsed("newVoiceLeadingNotes: ", chord.toString(), " beat: ", beat);
    const beatsPerCadence = 4 * params.barsPerCadence;
    const ret = [];

    const p1Note = params.parts[0].note || "F4";
    const p2Note = params.parts[1].note || "C4";
    const p3Note = params.parts[2].note || "A3";
    const p4Note = params.parts[3].note || "C3";

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
    if (prevNotes) {
        lastBeatGlobalSemitones = prevNotes.map(note => globalSemitone(note));
    }

    if (!chord) {
        return [];
    }

    if (chord) {
        let beatsUntilLastChordInCadence = (beatsPerCadence - beat) % beatsPerCadence
        let cadenceEnding = beatsUntilLastChordInCadence >= beatsPerCadence - 1 || beatsUntilLastChordInCadence == 0
        console.log("cadenceEnding: ", cadenceEnding, "beatsUntilLastChordInCadence", beatsUntilLastChordInCadence)

        // For each beat, we try to find a good matching semitone for each part.

        // Rules:
        // With	root position triads: double the root. 

        // With first inversion triads: double the root or 5th, in general. If one needs to double 
        // the 3rd, that is acceptable, but avoid doubling the leading tone.

        // With second inversion triads: double the fifth. 

        // With  seventh  chords:  there  is  one voice  for  each  note,  so  distribute as  fits. If  one 
        // must omit a note from the chord, then omit the 5th.

        const firstInterval = semitoneDistance(chord.notes[0].semitone, chord.notes[1].semitone)
        const thirdIsGood = firstInterval == 3 || firstInterval == 4;
        console.log("notes: ", chord.notes.map(n => n.toString()));

        // Depending on the inversion and chord type, we're doing different things

        type Direction = "up" | "down" | "same";

        let inversionNames = ["root", "first-root", "first-root-lower", "first-third", "first-fifth", "first-fifth-lower", "second"];
        if (chord.notes.length > 3) {
            inversionNames = ["root", "first", "second", "third"];
        }

        // Add a result for each possible inversion
        type InversionResult = {
            notes: {[key: number]: Note},
            rating: number,
            inversionName: string,
        }
        const inversionResults: Array<InversionResult> = [];

        for (let inversionIndex=0; inversionIndex<inversionNames.length; inversionIndex++) {

            const directions: { [key: number ]: Direction} = {};
            const directionIsGood = (direction: Direction) => {
                const downCount = Object.values(directions).filter(d => d == "down").length;
                const upCount = Object.values(directions).filter(d => d == "up").length;

                // 3 here because the "direction" we're checking is not an unknown
                const unknownCount = 3 - Object.values(directions).length;
                if (direction == "same") {
                    // Same is not good if it was "supposed" to be an up or down
                    // to balance things out
                    if (downCount - upCount > 1) {
                        // Too many downs, this should have been an up.
                        return false;
                    }
                    if (upCount - downCount > 1) {
                        // Too many ups, this should have been a down.
                        return false;
                    }
                    // Otherwise, all is probably fine
                    return true;
                }
                if (direction == "down") {
                    if (downCount == 0) {
                        // First down is always good
                        return true;
                    }
                    if (downCount == 1) {
                        if (upCount > 0 || unknownCount > 0) {
                            // Two downs is allowed if there is at least 1 up OR unknown
                            return true;
                        }
                    }
                    // More than two is not good
                    return false;
                }
                if (direction == "up") {
                    if (upCount == 0) {
                        return true;
                    }
                    if (upCount == 1) {
                        if (downCount > 0 || unknownCount > 0) {
                            // Two ups is allowed if there is at least 1 down OR unknown
                            return true;
                        }
                    }
                    // More than two is not good
                    return false;
                }
            }
            const inversionResult: InversionResult = {
                notes: {},
                rating: 0,
                inversionName: inversionNames[inversionIndex],
            };

            const addPartNote = (partIndex: number, note: Note) => {
                inversionResult.notes[partIndex] = new Note({
                    semitone: note.semitone,
                    octave: 1  // dummy
                });
            }

            // We try each inversion. Which is best?
            const inversion = inversionNames[inversionIndex];

            console.log("inversion: ", inversion);
            let partToIndex: { [key: number]: number } = {};
            if (chord.notes.length == 3) {
                if (inversion == 'root') {
                    partToIndex[0] = 2;
                    partToIndex[1] = 1;
                    partToIndex[2] = 0;
                    partToIndex[3] = 0;  // Root is doubled
                } else if (inversion == 'first-root') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 0;  // Root is doubled
                } else if (inversion == 'first-root-lower') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 0;
                    partToIndex[2] = 2;
                    partToIndex[3] = 1;
                    if (!thirdIsGood) {
                        console.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'first-third') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 1;  // Third is doubled
                    if (!thirdIsGood) {
                        console.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'first-fifth') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 2;  // Fifth is doubled
                } else if (inversion == 'first-fifth-lower') {
                    partToIndex[0] = 2;
                    partToIndex[1] = 0;
                    partToIndex[2] = 2;
                    partToIndex[3] = 1;
                    if (!thirdIsGood) {
                        console.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'second') {
                    partToIndex[0] = 1;
                    partToIndex[1] = 0;
                    partToIndex[2] = 2;
                    partToIndex[3] = 2;  // Fifth is doubled
                } else {
                    throw "No inversion?"
                }
            } else {
                if (inversion == 'root') {
                    partToIndex[0] = 3;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 0;
                } else if (inversion == 'first') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 3;
                    partToIndex[2] = 2;
                    partToIndex[3] = 1;
                    if (!thirdIsGood) {
                        console.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'second') {
                    partToIndex[0] = 1;
                    partToIndex[1] = 0;
                    partToIndex[2] = 3;
                    partToIndex[3] = 2;
                } else if (inversion == 'third') {
                    partToIndex[0] = 2;
                    partToIndex[1] = 1;
                    partToIndex[2] = 0;
                    partToIndex[3] = 3;
                }
            }

            for (let partIndex=0; partIndex<4; partIndex++) {
                if (inversionResult.notes[partIndex]) {
                    // This part is already set
                    continue;
                }
                addPartNote(partIndex, chord.notes[partToIndex[partIndex]]);
            }
            // Lastly, we select the octaves
            let minSemitone = 0;
            for (let partIndex=3; partIndex>=0; partIndex--) {
                const note = inversionResult.notes[partIndex];
                let gTone = globalSemitone(note);

                let i=0;
                while (gTone < semitoneLimits[partIndex][0] || gTone < minSemitone) {
                    i++;
                    if (i > 1000) {
                        debugger;
                        throw "Too many iterations"
                    }
                    note.octave += 1;
                    gTone = globalSemitone(note);
                    if (gTone >= semitoneLimits[partIndex][0] && gTone >= minSemitone) {
                        // We're about to break. Check if we should go up one more
                        if (gTone + 12 <= semitoneLimits[partIndex][1]) {
                            let distance = Math.abs(gTone - lastBeatGlobalSemitones[partIndex])
                            let octaveUpDistance = Math.abs(gTone + 12 - lastBeatGlobalSemitones[partIndex])

                            let distanceToStartingTone = Math.abs(gTone - startingGlobalSemitones[partIndex])
                            let octaveUpDistanceToStartingTone = Math.abs(gTone + 12 - startingGlobalSemitones[partIndex])

                            // Is it worth it to go up one more octave?
                            let upDiff = distance - octaveUpDistance;
                            let startingDiff = Math.max(distanceToStartingTone - octaveUpDistanceToStartingTone - 4, 0);

                            console.log(partIndex, "upDiff: ", upDiff, "startingDiff: ", startingDiff, "octaveUpDistanceToStartingTone", octaveUpDistanceToStartingTone, "distanceToStartingTone", distanceToStartingTone);

                            if (upDiff > 0 && upDiff > startingDiff) {
                                note.octave += 1;
                                gTone = globalSemitone(note);

                                // Is it worth it to go up still one more octave? 
                                distance = Math.abs(gTone - lastBeatGlobalSemitones[partIndex])
                                octaveUpDistance = Math.abs(gTone + 12 - lastBeatGlobalSemitones[partIndex])
    
                                distanceToStartingTone = Math.abs(gTone - startingGlobalSemitones[partIndex])
                                octaveUpDistanceToStartingTone = Math.abs(gTone + 12 - startingGlobalSemitones[partIndex])
    
                                // Is it worth it to go up one more octave?
                                upDiff = distance - octaveUpDistance;
                                startingDiff = Math.max(distanceToStartingTone - octaveUpDistanceToStartingTone - 4, 0);

                                console.log(partIndex, "2 upDiff: ", upDiff, "startingDiff: ", startingDiff);
    
                                if (upDiff > 0 && upDiff > startingDiff) {
                                    note.octave += 1;
                                    gTone = globalSemitone(note);
                                }
                            }
                            
                        }
                        minSemitone = gTone;
                    }
                }

                // Finally, rate the result.

                // Check the direction for a selected gTone, (is it allowed)
                let distance = gTone - lastBeatGlobalSemitones[partIndex]
                let direction: Direction;

                if (distance > 0) {
                    direction = "up";
                    if (!directionIsGood("up")) {
                        console.log("note ", note.toString(), "is not good because direction is up from ", new Note({semitone: lastBeatGlobalSemitones[partIndex] % 12}).toString())
                        inversionResult.rating -= 1;
                    }
                } else if (distance < 0) {
                    direction = "down";
                    if (!directionIsGood("down")) {
                        console.log("note ", note.toString(), "is not good because direction is down from", new Note({semitone: lastBeatGlobalSemitones[partIndex] % 12}).toString())
                        inversionResult.rating -= 1;
                    }
                } else {
                    direction = "same";
                    if (!directionIsGood("same")) {
                        console.log("note ", note.toString(), "is not good because direction is same from", new Note({semitone: lastBeatGlobalSemitones[partIndex] % 12}).toString())
                        inversionResult.rating -= 1;
                    }
                }
                directions[partIndex] = direction

                minSemitone = gTone;
                inversionResults.push(inversionResult);
            }

            // Check for parallel motion (if this note had a 1st, 5th or 8th with another note
            // and it still has it, then it's parallel motion)
            for (let partIndex=0; partIndex<4; partIndex++) {
                const prevNote: number = lastBeatGlobalSemitones[partIndex];
                const currentNote: number = globalSemitone(inversionResult.notes[partIndex]);
                if (prevNote == currentNote) {
                    continue;
                }
                for (let partIndex2=0; partIndex2<4; partIndex2++) {
                    if (partIndex == partIndex2) {
                        continue;
                    }
                    const prevNote2 = lastBeatGlobalSemitones[partIndex];
                    const currentNote2 = globalSemitone(inversionResult.notes[partIndex2]);
                    if (prevNote2 == currentNote2) {
                        continue;
                    }
                    let interval;
                    if (prevNote == prevNote2) {
                        interval = 0;
                    }
                    if (Math.abs(prevNote - prevNote2) == 7) {
                        interval = 7;
                    }
                    if (Math.abs(prevNote - prevNote2) == 12) {
                        interval = 12;
                    }
                    if (interval != undefined) {
                        if (Math.abs(currentNote - currentNote2) == interval) {
                            console.log("parallel motion from ", new Note({semitone: prevNote % 12}).toString(), " to ", new Note({semitone: currentNote % 12}).toString(), " and from ", new Note({semitone: prevNote2 % 12}).toString(), " to ", new Note({semitone: currentNote2 % 12}).toString())
                            inversionResult.rating -= 1;
                        }
                    }
                }
            }

            console.log(directions);
        }

        // Select the best result
        const bestInversion = inversionResults.reduce((best, current) => {
            if (current.rating > best.rating) {
                return current;
            }
            return best;
        }, inversionResults[0]);
        console.log("best inversion: ", bestInversion.inversionName);

        ret[0] = bestInversion.notes[0];
        ret[1] = bestInversion.notes[1];
        ret[2] = bestInversion.notes[2];
        ret[3] = bestInversion.notes[3];

        const beatsPerBar = params.beatsPerBar || 4;
        // if (params.halfNotes && !cadenceEnding) {
        //     // If this is beat 2, 3 or 4, convert the previous note to double length
        //     // if it's continuing with the same
        //     if (((division / BEAT_LENGTH) % (beatsPerBar)) > 0) {
        //         const previousNotes = ret[division - 12]
        //         for (let i=0; i<4; i++) {
        //             const previousNote = previousNotes.filter((n) => n.partIndex == i)[0];
        //             if (previousNote && previousNote.note.equals(bestInversion.notes[i].note)) {
        //                 previousNote.duration = BEAT_LENGTH * 2;
        //                 ret[division] = ret[division].filter(note => note.partIndex != i)
        //             }
        //         }
        //         console.log("previousNotes: ", previousNotes);
        //     }
        // }

        // for (let i=0; i<4; i++) {
        //     if (ret[division][i]) {
        //         lastBeatGlobalSemitones[i] = globalSemitone(ret[division][i].note);
        //     }
        // }
        // console.log(ret[division]);
    }
    console.groupEnd();

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


const buildMelody = (divisionedNotes: DivisionedRichnotes, params: MusicParams) => {
    // Initial melody, just half beats

    // Return value will be an object kwyed by "ticks", containing
    // an array of objects {note, length} for each tick

    // Lets just say a beat is 12 ticks
    const beatsPerCadence = 4 * params.barsPerCadence;
    const lastDivision = BEAT_LENGTH * 4 * beatsPerCadence * params.cadenceCount;
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
    let counter = -1;

    for (let i = 0; i < lastDivision; i += BEAT_LENGTH / 2) {
        counter++;
        const division = i;
        const lastBeat = Math.floor(division / BEAT_LENGTH) * BEAT_LENGTH;
        let beatsUntilLastChordInCadence = Math.floor(i) % beatsPerCadence
        let cadenceEnding = beatsUntilLastChordInCadence >= beatsPerCadence - 1 || beatsUntilLastChordInCadence == 0
        console.log("cadenceEnding: ", cadenceEnding, "beatsUntilLastChordInCadence", beatsUntilLastChordInCadence)
        let noteIsGood = false;
        let randomNote: Nullable<Note> = null;
        let iterations = 0;
        const chord = divisionedNotes[lastBeat][0].chord
        const prevChord = divisionedNotes[lastBeat - BEAT_LENGTH] ? divisionedNotes[lastBeat - BEAT_LENGTH][0].chord : null;
        const scale = divisionedNotes[lastBeat][0].scale
        if (counter % NOTES_PER_MELODY_PART == 0 && notesInThisBar.length > 0) {
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
        // find the note in the chord, and reduce its duration
        let foundRichNote;
        for (const richNote of divisionedNotes[lastBeat]) {
            if (richNote.note.semitone == randomNote.semitone) {
                richNote.duration = BEAT_LENGTH / 2;
                foundRichNote = richNote;
                break;
            }
        }
        if (!foundRichNote) {
            debugger;
            throw "Failed to find note in chord";
        }

        if (i % BEAT_LENGTH != 0) {
            // we're on off-beat, so additionally we need to add a new note
            const newRichNote = {
                note: foundRichNote.note.copy(),
                duration: BEAT_LENGTH / 2,
                chord: foundRichNote.chord,
                scale: foundRichNote.scale,
            }
            divisionedNotes[i] = [newRichNote];
        } 

        prevPrevNote = prevNote;
        prevNote = randomNote;

        // if ((i * 12 - 6) % BEAT_LENGTH == 0 && ret[i * 12 - 6].duration == 6 && ret[i * 12].duration == 6) {
        //     // Add beam info if previous melody note was on beat
        //     ret[i * 12 - 6].beam = 'begin';
        //     ret[i * 12].beam = 'end';
        // }

        // if (!cadenceEnding && (ret[(i - 1) * 12] || {}).duration == 6 && i > 1 && (Math.random() < sixteenthChance || barDirection == 'repeat') && prevPrevNote && prevNote) {
        //     // Add a note between prev and prevprev
        //     let randomBetweenNote;
        //     for (const note of scale.notes) {
        //         if (note.semitone > prevPrevNote.semitone && note.semitone < prevNote.semitone) {
        //             randomBetweenNote = note;
        //             randomBetweenNote.octave = prevPrevNote.octave;
        //             break;
        //         }
        //         if (note.semitone < prevPrevNote.semitone && note.semitone > prevNote.semitone) {
        //             randomBetweenNote = note;
        //             randomBetweenNote.octave = prevPrevNote.octave;
        //             break;
        //         }
        //     }
        //     if (randomBetweenNote) {
        //         console.log("Adding note ", randomBetweenNote.toString(), " before ", prevPrevNote.toString());
        //         ret[(i - 1) * 12].duration -= (3);
        //         const noteBefore = ret[(i - 1) * 12 - 6];
        //         if (noteBefore && noteBefore.duration == 6 && noteBefore.beam == "begin") {
        //             noteBefore.beam = undefined;
        //         }
        //         ret[(i - 1) * 12].beam = 'begin';
        //         ret[((i - 1) * 12) + (3)] = {
        //             note: randomBetweenNote,
        //             duration: (3),
        //             beam: "end",
        //         }
        //     } else {
        //         console.log("no note between", prevPrevNote.semitone, prevNote.semitone);
        //     }
        // }
        // if (cadenceEnding && i == Math.floor(i)) {
        //     i += 0.5;
        // }
    }
    return ret;
}


const addEighthNotes = (divisionedNotes: DivisionedRichnotes, params: MusicParams) => {
    console.groupCollapsed("addEighthNotes");
    // For each part, add 8th notes between two beats, depending on things...
    const beatsPerCadence = 4 * params.barsPerCadence;
    const lastDivision = BEAT_LENGTH * 4 * beatsPerCadence * params.cadenceCount;

    for (let partIndex=0; partIndex<4; partIndex++) {
        for (let division=0; division<lastDivision; division += BEAT_LENGTH) {
            console.groupCollapsed("partIndex: ", partIndex, "division: ", division);
            const note = (divisionedNotes[division] || []).filter(n => n.partIndex == partIndex)[0];
            const nextNote = (divisionedNotes[division + BEAT_LENGTH] || []).filter(n => n.partIndex == partIndex)[0];
            if (!note || !nextNote || note.duration != BEAT_LENGTH || nextNote.duration != BEAT_LENGTH) {
                console.log("Not adding 8th notes between ", note, " and ", nextNote);
                console.groupEnd();
                continue;
            }
            const noteGTone = globalSemitone(note.note);
            const nextNoteGTone = globalSemitone(nextNote.note);
            const distance = noteGTone - nextNoteGTone;
            const scale = note.scale;
            const scaleIndex = scale.notes.findIndex(n => n.semitone == note.note.semitone);
            const nextNoteInScale = scale.notes[(scaleIndex + 1) % scale.notes.length];
            const prevNoteInScale = scale.notes[(scaleIndex - 1 + scale.notes.length) % scale.notes.length];
            const addNote = (newNote: Note) => {
                const newRichNote = {
                    note: new Note({
                        semitone: newNote.semitone,
                        octave: getClosestOctave(newNote, nextNote.note),
                    }),
                    duration: BEAT_LENGTH / 2,
                    partIndex: partIndex,
                }
                note.duration = BEAT_LENGTH / 2;
                divisionedNotes[division + BEAT_LENGTH / 2] = divisionedNotes[division + BEAT_LENGTH / 2] || [];
                divisionedNotes[division + BEAT_LENGTH / 2].push(newRichNote);
                console.log("Added note ", newNote.toString(), " between ", note.note.toString(), " and ", nextNote.note.toString());
            }
            if (distance == -3 || distance == -4) {
                // We're going up by a minor third or a major third
                // Add a note between them, that's in scale
                addNote(nextNoteInScale);
            }
            if (distance == 3 || distance == 4) {
                // We're going down by a minor third or a major third
                // Add a note between them, that's in scale
                addNote(prevNoteInScale);
            }
            console.groupEnd();
        }
    }
    console.groupEnd();
}


const makeChords = (params: MusicParams): DivisionedRichnotes => {
    // generate a progression
    const beatsPerBar = params.beatsPerBar || 4;
    const barsPerCadenceEnd = params.barsPerCadence || 4;
    const cadences = params.cadenceCount || 2

    const maxTensions = 1
    const baseTension = params.baseTension || 0.4;
    const highTension = 0.6;

    const maxBeats = cadences * barsPerCadenceEnd * beatsPerBar;
    let currentBeat = 0;
    let currentScale = new Scale({ key: Math.floor(Math.random() * 12) , octave: 5, template: ScaleTemplates.major});

    let result: DivisionedRichnotes = {};
    let tensions: Array<number> = [];
    let tensionBeats = []
    let chordCounts = {};
    const prevNotes: Array<Note> = [];

    // for (let i=0; i<maxTensions; i++) {
    //     // tensionBeats.push(Math.floor(Math.random() * (maxBeats - 10)) + 6);
    // }

    while (currentBeat < maxBeats) {
        console.groupCollapsed("currentBeat: ", currentBeat);
        const beatSetting = params.beatSettings[currentBeat];
        let tensionOverride = null;
        if (beatSetting) {
            tensionOverride = parseFloat(beatSetting.tension as string);
        }
        let chordIsGood = false;
        const randomGenerator = new RandomChordGenerator(params)
        let newChord: Nullable<Chord> = null;
        let tension = 0;
        let newScale: Nullable<Scale> = null;

        const randomNotes: Array<Note> = [];

        let iterations = 0;
        let currentScaleSemitones = currentScale.notes.map(note => note.semitone);

        let closestTension = -100;

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
            if (iterations > 500) {
                console.log("Too many iterations, breaking, closestTension: ", closestTension);
                console.groupEnd();
                return {};
            }
            const criteriaLevel = Math.floor(iterations / (50));
            if (iterations % 100 == 0) {
                // Try previous chords again with different criteriaLevel...
                randomGenerator.cleanUp();
            }
            newChord = randomGenerator.getChord();
            if (!newChord) {
                console.log("Failed to get a new chord (all used)");
                // Try again
                randomGenerator.cleanUp();
                continue;
            }
            randomNotes.splice(0, randomNotes.length);
            randomNotes.push(...partialVoiceLeading(newChord, prevNotes, currentBeat, params));
            const tensionResult = getTension(prevNotes, randomNotes, currentScale, beatsUntilLastChordInCadence);
            for (let i=0; i<params.chords.length; i++) {
                const chord = params.chords[i];
                const chordWeight = parseFloat(params.chordSettings[i].weight || 0);
                if (newChord.chordType == chord) {
                    tensionResult.tension += ((chordWeight * 10) ** 2) / 10;
                }
            }
            tension = tensionResult.tension;
            newScale = tensionResult.newScale;

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

            if (tensionOverride != null) {
                wantedTension = tensionOverride;
                wantedTension += (0.1 * criteriaLevel);
            }

            const minTension = wantedTension - 0.3 - (0.2 * criteriaLevel);

            if (tension < wantedTension && tension > minTension) {
                chordIsGood = true;
            } else {
                //console.log("Tension too high: ", tension, wantedTension);
                if (Math.abs(tension - wantedTension) < Math.abs(closestTension - wantedTension)) {
                    closestTension = tension;
                }
            }
        }
        if (newChord == null) {
            console.groupEnd();
            return {};
        }
        tensions.push(tension);
        const newChordString = newChord.toString();
        if (newScale) {
            currentScale = newScale;
            console.log("new scale: ", currentScale.toString());
        }
        console.log(`${beatsUntilLastChordInCadence}: ${tension.toFixed(1)} - ${newChordString} (${currentScale.toString()})`);
        result[currentBeat * BEAT_LENGTH] = randomNotes.map((note, index) => ({
            note: note,
            partIndex: index,
            duration: BEAT_LENGTH,
            chord: newChord,
            scale: currentScale,
        }) as RichNote);

        prevNotes.splice(0, prevNotes.length);
        prevNotes.push(...randomNotes);

        chordCounts[newChordString] = (chordCounts[newChordString] || 0) + 1;
        randomGenerator.cleanUp();
        currentBeat += 1;
        console.groupEnd();
    }

    return result
}

export async function makeMusic(params: MusicParams) {
    console.log(params)
    let divisionedNotes: DivisionedRichnotes = {};
    let iterations = 0;
    while (true) {
        iterations++;
        if (iterations > 5) {
            console.log("Too many iterations, breaking");
            return {
                divisionedNotes: {},
            }
        }
        console.groupCollapsed("makeChords");
        divisionedNotes = makeChords(params);
        console.groupEnd();
        console.log("divisionedNotes: ", divisionedNotes);
        if (Object.keys(divisionedNotes).length != 0) {
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

    // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
    addEighthNotes(divisionedNotes, params)

    return {
        divisionedNotes: divisionedNotes,
    }

}

export async function testFunc(params: MusicParams) {
    console.log(params)
    let chords: Array<MusicResult> = [];

    chords.push({
        chord: new Chord('5maj'),
        tension: 0,
        scale: new Scale({ key: 0, octave: 5, template: ScaleTemplates.major}),
    })

    chords.push({
        chord: new Chord('2sus4'),
        tension: 0,
        scale: new Scale({ key: 0, octave: 5, template: ScaleTemplates.major}),
    })

    console.log(getTension(chords[0].chord, chords[1].chord, chords[1].scale, 0));

    chords.push({
        chord: new Chord('7maj'),
        tension: 0,
        scale: new Scale({ key: 0, octave: 5, template: ScaleTemplates.major}),
    })


    chords.push({
        chord: new Chord('5sus4'),
        tension: 0,
        scale: new Scale({ key: 0, octave: 5, template: ScaleTemplates.major}),
    })


    const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);

    return {
        chords: chords,
        divisionedNotes: divisionedNotes,
    }
}

export { buildTables }
