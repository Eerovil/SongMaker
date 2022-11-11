import { Note, Scale, Semitone } from "musictheoryjs";
import { Logger } from "./mylogger";
import { Tension } from "./tension";

export const BEAT_LENGTH = 12;


export const semitoneScaleIndex = (scale: Scale): { [key: number]: number } => ({
    [scale.notes[0].semitone]: 0,
    [scale.notes[1].semitone]: 1,
    [scale.notes[2].semitone]: 2,
    [scale.notes[3].semitone]: 3,
    [scale.notes[4].semitone]: 4,
    [scale.notes[5].semitone]: 5,
    [scale.notes[6].semitone]: 6,
})


export const gToneString = (gTone: number): string => {
    return new Note({
        semitone: gTone % 12,
        octave: Math.floor(gTone / 12),
    }).toString()
}


export const arrayOrderBy = function (array: Array<any>, selector: CallableFunction, desc = false) {
    return [...array].sort((a, b) => {
        a = selector(a);
        b = selector(b);

        if (a == b) return 0;
        return (desc ? a > b : a < b) ? -1 : 1;
    });
}


export const chordTemplates: { [key: string]: Array<number> } = {
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


export class Chord {
    public notes: Array<Note>;
    public chordType: string;
    public toString() {
        // Find correct Semitone key
        const semitoneKeys = Object.keys(Semitone).filter(key => (Semitone as any)[key] as number === this.notes[0].semitone);
        if (semitoneKeys.length == 0) {
            return this.notes.map(note => note.toString()).join(", ");
        }
        let semitoneKey = semitoneKeys.filter(key => key.indexOf('b') == -1 && key.indexOf('s') == -1)[0] || semitoneKeys[0];
        semitoneKey = semitoneKey.replace('s', '#');
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


export type Nullable<T> = T | null

export class MainMusicParams {
    beatsPerBar?: number = 4;
    cadenceCount?: number = 2
    cadences: Array<MusicParams> = [];
    testMode?: boolean = false;

    constructor(params: Partial<MainMusicParams> | undefined = undefined) {
        if (params) {
            for (let key in params) {
                (this as any)[key] = (params as any)[key];
            }
        }
    }

    currentCadenceParams(division: number): MusicParams {
        const beat = Math.floor(division / BEAT_LENGTH);
        const bar = Math.floor(beat / this.beatsPerBar);
        let counter = 0;
        for (const cadenceParams of this.cadences) {
            counter += cadenceParams.barsPerCadence;
            if (bar < counter) {
                cadenceParams.beatsUntilCadenceEnd = counter * this.beatsPerBar - beat;
                cadenceParams.beatsUntilSongEnd = this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar - beat;
                cadenceParams.beatsPerBar = this.beatsPerBar;
                return cadenceParams;
            }
        }
    }

    getMaxBeats() {
        return this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar;
    }
}

export class MusicParams {
    beatsUntilCadenceEnd: number = 0;
    beatsUntilSongEnd: number = 0;
    beatsPerBar: number = 4;

    baseTension?: number = 0.3;
    barsPerCadence?: number = 2
    tempo?: number = 40;
    halfNotes?: boolean = true;
    sixteenthNotes?: number = 0.2;
    eighthNotes?: number = 0.4;
    modulationWeight?: number = 0.2;
    leadingWeight?: number = 2;
    parts: Array<{
        voice: string,
        note: string,
    }> = [
        {
            voice: "1",
            note: "C5",
        },
        {
            voice: "1",
            note: "A4",
        },
        {
            voice: "1",
            note: "C4",
        },
        {
            voice: "1",
            note: "E3",
        }
    ];
    beatSettings: Array<{
        tension: number,
    }> = [];
    chordSettings: {[key: string]: {
        enabled: boolean,
        weight: number,
    }} = {
        maj: {
            enabled: true,
            weight: 0,
        },
        min: {
            enabled: true,
            weight: 0,
        },
        dim: {
            enabled: true,
            weight: 0
        },
        aug: {
            enabled: true,
            weight: 0,
        },
        maj7: {
            enabled: true,
            weight: 0,
        },
        dom7: {
            enabled: true,
            weight: 0,
        },
    }
    scaleSettings: {
        [key: string]: {
            enabled: boolean,
            weight: number
        }
    } = {
        major: {
            enabled: true,
            weight: 0,
        },
        minor: {
            enabled: true,
            weight: 0,
        },
    };
    selectedCadence: string = "HC";
    constructor(params: Partial<MusicParams> | undefined = undefined) {
        if (params) {
            for (let key in params) {
                (this as any)[key] = (params as any)[key];
            }
        }
        this.updateBeatSettings();
    }

    updateBeatSettings() {
        const beatCount = this.beatsPerBar * this.barsPerCadence;
        if (this.beatSettings.length < beatCount) {
            for (let i = this.beatSettings.length; i < beatCount; i++) {
                this.beatSettings.push({
                    tension: this.baseTension
                });
            }
        } else if (this.beatSettings.length > beatCount) {
            this.beatSettings = this.beatSettings.slice(0, beatCount);
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
    tie?: string,
    tension?: Tension,
    inversionName?: string,
}

export type DivisionedRichnotes = {
    [key: number]: Array<RichNote>,
}

export const globalSemitone = (note: Note) => {
    return note.semitone + ((note.octave) * 12);
}

export const getClosestOctave = (note: Note, targetNote: Nullable<Note> = null, targetSemitone: Nullable<number> = null) => {
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

export const majScaleCircle: { [key: number]: Array<number> } = {}
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


export const majScaleDifference = (semitone1: number, semitone2: number) => {
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


export const semitoneDistance = (tone1: number, tone2: number) => {
    // distance from 0 to 11 should be 1
    // 0 - 11 + 12 => 1
    // 11 - 0 + 12 => 23 => 11

    // 0 - 6 + 12 => 6
    // 6 - 0 + 12 => 18 => 6

    // 0 + 6 - 3 + 6 = 6 - 9 = -3
    // 6 + 6 - 9 + 6 = 12 - 15 = 0 - 3 = -3
    // 11 + 6 - 0 + 6 = 17 - 6 = 5 - 6 = -1
    // 0 + 6 - 11 + 6 = 6 - 17 = 6 - 5 = 1

    // (6 + 6) % 12 = 0
    // (5 + 6) % 12 = 11
    // Result = 11!!!!

    return Math.min(
        Math.abs(tone1 - tone2),
        Math.abs((tone1 + 6) % 12 - (tone2 + 6) % 12)
    );
}
