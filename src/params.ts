import { Scale, ScaleTemplates } from "musictheoryjs";
import { BEAT_LENGTH } from "./utils";

export class MainMusicParams {
    beatsPerBar: number = 4;
    cadenceCount: number = 4;
    cadences: Array<MusicParams> = [];
    testMode?: boolean = false;
    melodyRhythm: string = "";  // hidden from user for now
    forcedMelody: number[] = [];  // hidden from user for now
    forcedChords: string = "";
    forcedOriginalScale: Scale | null = null;

    constructor(params: Partial<MainMusicParams> | undefined = undefined) {
        if (params) {
            for (let key in params) {
                (this as any)[key] = (params as any)[key];
            }
        }
        // this.melodyRhythm = "QQQQQQQQQQQQQQQQQQQQQQ"
        // this.melodyRhythm = "EEEEQQEEEEQQEEQEEQEEQEEQ";
        // for (let i=0; i<20; i++) {
        //     const random = Math.random();
        //     if (random < 0.2) {
        //         this.melodyRhythm += "H";
        //         i += 1;
        //     } else if (random < 0.7) {
        //         this.melodyRhythm += "Q";
        //     } else {
        //         this.melodyRhythm += "EE";
        //     }
        // }
        // this.forcedMelody = [0, 1, 2, 3, 3, 3 ]
        //                   12 3 41 2 34 two bars

        // Do Re Mi Fa So La Ti Do
        // this.forcedMelody = "RRRRRRRRRRRRRRRRRRRR";
        // this.forcedMelody = [
        //     0,
        //     1,
        //     2,
        //     3,
        //     4,
        //     5,
        //     4,
        //     3,
        //     2,
        //     1,
        //     0,
        // ];
        // let melody = [0];
        // for (let i=0; i<20; i++) {
        //     const upOrDown = Math.random() < 0.5 ? -1 : 1;
        //     const prevMelody = melody[melody.length - 1];
        //     melody.push(prevMelody + (1 * upOrDown));
        // }
        // this.forcedMelody = melody.map(m => (m + 7 * 100) % 7);

        // Example melody
        // C maj - C
        //         D pt
        // C maj   E
        //         F pt
        // A min   G pt
        //         A
        // A min   B pt
        //         C
        // F maj   B pt
        //         A
        // F maj   G pt
        //         F
        // G maj   E pt
        //         D
        // G maj   C pt
        //         D
        // C maj   E
        //         F pt
        // C maj   G
        //         A pt
        // this.forcedChords = "362516662"
        this.forcedOriginalScale = new Scale({ key: 0, template: ScaleTemplates.major });
    }

    currentCadenceParams(division: number): MusicParams {
        const beat = Math.floor(division / BEAT_LENGTH);
        const bar = Math.floor(beat / this.beatsPerBar);
        let counter = 0;  // The beat we're at in the loop
        let authenticCadenceStartBar = 0;
        let prevCadence = "";

        for (const cadenceParams of this.cadences) {
            // Loop cadences in order
            if (["PAC", "IAC"].includes(prevCadence)) {
                authenticCadenceStartBar = counter;
            }
            prevCadence = cadenceParams.selectedCadence;
            counter += cadenceParams.barsPerCadence;
            if (bar < counter) {  // We have passed the given division. The previous cadence is the one we want
                cadenceParams.beatsUntilCadenceEnd = counter * this.beatsPerBar - beat;
                if (["PAC", "IAC"].includes(cadenceParams.selectedCadence)) {
                    cadenceParams.beatsUntilAuthenticCadenceEnd = cadenceParams.beatsUntilCadenceEnd;
                } else {
                    cadenceParams.beatsUntilAuthenticCadenceEnd = 999;
                }
                cadenceParams.beatsUntilSongEnd = this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar - beat;
                cadenceParams.beatsPerBar = this.beatsPerBar;
                cadenceParams.cadenceStartDivision = ((counter - cadenceParams.barsPerCadence) * this.beatsPerBar) * BEAT_LENGTH;
                cadenceParams.authenticCadenceStartDivision = authenticCadenceStartBar * this.beatsPerBar * BEAT_LENGTH;
                return cadenceParams;
            }
        }
        return this.cadences[0];
    }

    getMaxBeats() {
        return this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar;
    }
}

export class MusicParams {
    beatsUntilCadenceEnd: number = 0;
    beatsUntilAuthenticCadenceEnd: number = 0;
    beatsUntilSongEnd: number = 0;
    beatsPerBar: number = 4;
    cadenceStartDivision: number = 0;
    authenticCadenceStartDivision: number = 0;

    baseTension?: number = 0.3;
    barsPerCadence: number = 2
    tempo?: number = 30;
    halfNotes?: boolean = true;
    sixteenthNotes?: number = 0.2;
    eighthNotes?: number = 0.4;
    modulationWeight?: number = 0;
    leadingWeight?: number = 2;
    parts: Array<{
        voice: string,
        note: string,
        volume: number,
    }> = [
            {
                voice: "41",
                note: "C5",
                volume: 10,
            },
            {
                voice: "41",
                note: "A4",
                volume: 7,
            },
            {
                voice: "42",
                note: "C4",
                volume: 7,
            },
            {
                voice: "43",
                note: "E3",
                volume: 10,
            }
        ];
    beatSettings: Array<{
        tension: number,
    }> = [];
    chordSettings: {
        [key: string]: {
            enabled: boolean,
            weight: number,
        }
    } = {
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
            dim7: {
                enabled: true,
                weight: 0,
            },
            maj7: {
                enabled: false,
                weight: -1,
            },
            dom7: {
                enabled: true,
                weight: 0,
            },
            min7: {
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
    nonChordTones: {
        [key: string]: {
            enabled: boolean,
            weight: number,
        }
    } = {
            passingTone: {
                enabled: true,
                weight: 1,
            },
            neighborTone: {
                enabled: true,
                weight: 1,
            },
            suspension: {
                enabled: true,
                weight: 1,
            },
            retardation: {
                enabled: true,
                weight: 1,
            },
            appogiatura: {
                enabled: true,
                weight: 1,
            },
            escapeTone: {
                enabled: true,
                weight: 1,
            },
            anticipation: {
                enabled: true,
                weight: 1,
            },
            neighborGroup: {
                enabled: true,
                weight: 1,
            },
            pedalPoint: {
                enabled: true,
                weight: 1,
            },
        }


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
                    tension: this.baseTension || 0.3,
                });
            }
        } else if (this.beatSettings.length > beatCount) {
            this.beatSettings = this.beatSettings.slice(0, beatCount);
        }
    }

}
