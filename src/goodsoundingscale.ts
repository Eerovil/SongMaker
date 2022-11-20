import { Note, Scale } from "musictheoryjs";
import { Tension, TensionParams } from "./tension";
import { BEAT_LENGTH, Chord, DivisionedRichnotes, globalSemitone, gToneString, majScaleDifference, Nullable, semitoneDistance } from "./utils";


export const goodSoundingScaleTension = (tension: Tension, values: TensionParams): void => {
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
    } else if (fromNotesOverride) {
        passedFromNotes = fromNotesOverride;
    }

    // Check the bass, is it gound up or down a scale?

    if (prevPassedFromNotes) {
        const prevGlobalSemitones = prevPassedFromNotes.map(n => globalSemitone(n));
        const fromGlobalSemitones = passedFromNotes.map(n => globalSemitone(n));
        const latestGlobalSemitones = latestNotes.map(n => globalSemitone(n));
        const toGlobalSemitones = toNotes.map(n => globalSemitone(n));
        const notesByPart = [];
        for (let i=0; i<passedFromNotes.length; i++) {
            notesByPart[i] = [toGlobalSemitones[i]];
            if (latestGlobalSemitones[i] && latestGlobalSemitones[i] !== fromGlobalSemitones[i]) {
                notesByPart[i].push(latestGlobalSemitones[i]);
            }
            notesByPart[i].push(fromGlobalSemitones[i]);
            if (prevGlobalSemitones[i]) {
                notesByPart[i].push(prevGlobalSemitones[i]);
            }

            const partScaleIndexes = notesByPart[i].map(n => semitoneScaleIndex[n % 12]);

            let goingUpOrDownAScale = false;
            if (partScaleIndexes[0] - partScaleIndexes[1] == 1) {
                if (partScaleIndexes[1] - partScaleIndexes[2] == 1) {
                    // Last 3 notes are going up a scale
                    goingUpOrDownAScale = true;
                }
            }
            if (partScaleIndexes[0] - partScaleIndexes[1] == -1) {
                if (partScaleIndexes[1] - partScaleIndexes[2] == -1) {
                    // Last 3 notes are going down a scale
                    goingUpOrDownAScale = true;
                }
            }

            if (goingUpOrDownAScale) {
                if (i == 3) {
                    tension.bassScale += 3;
                } else if (i == 0) {
                    tension.sopranoScale += 3;
                } else {
                    tension.otherScale += 1;
                }
            }
        }

        if (tension.bassScale > 0 && tension.sopranoScale > 0) {
            const interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[3]) % 12
            if (interval == 4 || interval == 8) {
                // 3rds and 6ths are good
                tension.bassSopranoScale += 3;  // Override bass and soprano same direction also
            }
        }
        if (tension.otherScale > 0 && tension.sopranoScale > 0) {
            let interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[2]) % 12
            if (interval == 4 || interval == 8) {
                // 3rds and 6ths are good
                tension.bassSopranoScale += 2;  // Same thing for alto or tenor + soprano
            }
            interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[1]) % 12
            if (interval == 4 || interval == 8) {
                // 3rds and 6ths are good
                tension.bassSopranoScale += 2;  // Same thing for alto or tenor + soprano
            }
        }
    }
}
