import { Note, Scale } from "musictheoryjs";
import { BEAT_LENGTH, DivisionedRichnotes, globalSemitone, MainMusicParams, MusicParams, Nullable, semitoneDistance, semitoneScaleIndex, startingNotes } from "./utils";


const addNoteBetween = (newNote: Note, division: number, nextDivision: number, partIndex: number, divisionedNotes: DivisionedRichnotes): boolean => {
    const divisionDiff = nextDivision - division;
    const beatRichNote = (divisionedNotes[division] || []).filter(note => note.partIndex == partIndex)[0];
    if (!beatRichNote || !beatRichNote.note) {
        return;
    }

    const prevScaleTones = beatRichNote.scale.notes.map(n => n.semitone);
    const nextBeatRichNote = (divisionedNotes[nextDivision] || []).filter(note => note.partIndex == partIndex)[0];
    if (!nextBeatRichNote || !nextBeatRichNote.note) {
        return;
    }

    beatRichNote.duration = divisionDiff / 2;
    divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
    const newRandomRichNote = {
        note: newNote,
        duration: divisionDiff / 2,
        chord: beatRichNote.chord,
        scale: beatRichNote.scale,
        partIndex: partIndex,
    }
    divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
    return true;
}


const passingTone = (gTone1: number, gTone2: number, scale: Scale, gToneLimits: number[]): Nullable<Note> => {
    // Return a new gTone or null, based on whether adding a passing tone is a good idea.
    const distance = Math.abs(gTone1 - gTone2);
    if (distance < 3 || distance > 4) {
        return null;
    }
    const scaleTones = scale.notes.map(n => n.semitone);
    for (let gTone=gTone1; gTone != gTone2; gTone += (gTone1 < gTone2 ? 1 : -1)) {
        if (gTone == gTone1) {
            continue;
        }
        if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
            continue;
        }
        const semitone = gTone % 12;
        if (scaleTones.includes(semitone)) {
            return new Note({
                semitone: gTone % 12,
                octave: Math.floor(gTone / 12),
            });
        }
    }
    return null;
}


const neighborTone = (gTone1: number, gTone2: number, scale: Scale, gToneLimits: number[]): Nullable<Note> => {
    // Step, then step back. This is on Weak beat
    if (gTone1 != gTone2) {
        return null;
    }
    const scaleIndex = semitoneScaleIndex(scale)[gTone1 % 12];
    if (!scaleIndex) {
        return null;
    }
    const upOrDownChoices = Math.random() < 0.5 ? [1, -1] : [-1, 1];
    for (const upOrDown of upOrDownChoices) {
        const newScaleIndex = (scaleIndex + upOrDown) % 7;
        const newSemitone = scale.notes[newScaleIndex].semitone;
        const distance = semitoneDistance(gTone1 % 12, newSemitone);
        const newGtone = gTone1 + (distance * upOrDown);
        if (newGtone < gToneLimits[0] || newGtone > gToneLimits[1]) {
            continue;
        }
        return new Note({
            semitone: newGtone % 12,
            octave: Math.floor(newGtone / 12),
        })
    }
    return null;
}


const appogiatura = (gTone1: number, gTone2: number, scale: Scale): Nullable<Note> => {
    // Leap, then step back. This is on Strong beat
    return null;
}


export const buildTopMelody = (divisionedNotes: DivisionedRichnotes, mainParams: MainMusicParams) => {
    // Convert 4th notes in part 1 to 8th notes. Add random 8th and 16th notes between them. (and pauses?)
    const lastDivision = BEAT_LENGTH * mainParams.getMaxBeats();
    const firstParams = mainParams.currentCadenceParams(0);
    const {startingGlobalSemitones, semitoneLimits} = startingNotes(firstParams);

    for (let i = 0; i < lastDivision - BEAT_LENGTH; i += BEAT_LENGTH) {
        let gToneLimitsForThisBeat = [
            [...semitoneLimits[0]],
            [...semitoneLimits[1]],
            [...semitoneLimits[2]],
            [...semitoneLimits[3]],
        ];
        const params = mainParams.currentCadenceParams(i);

        const eightsThisBeat = Math.random() < params.eighthNotes;
        const sixteenthsThisBeat = Math.random() < params.sixteenthNotes;

        if (!eightsThisBeat) {
            continue;
        }

        const lastBeatInCadence = params.beatsUntilCadenceEnd < 2
        if (lastBeatInCadence) {
            continue;
        }

        for (let partIndex = 0; partIndex < 4; partIndex++) {
            // Change limits, new notes must also be betweeen the other part notes
            // ( Overlapping )
            const richNote = divisionedNotes[i].filter(note => note.partIndex == partIndex)[0];
            const nextRichNote = divisionedNotes[i + BEAT_LENGTH].filter(note => note.partIndex == partIndex)[0];
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            const gTone1 = globalSemitone(richNote.note);
            const gTone2 = globalSemitone(nextRichNote.note);
            const minGTone = Math.min(gTone1, gTone2);
            const maxGTone = Math.max(gTone1, gTone2);
            if (gToneLimitsForThisBeat[partIndex - 1]) {
                // Limit the higher part, it can't go lower than maxGTone
                gToneLimitsForThisBeat[partIndex - 1][0] = Math.min(gToneLimitsForThisBeat[partIndex - 1][0], maxGTone);
            }
            if (gToneLimitsForThisBeat[partIndex + 1]) {
                // Limit the lower part, it can't go higher than minGTone
                gToneLimitsForThisBeat[partIndex + 1][1] = Math.max(gToneLimitsForThisBeat[partIndex + 1][1], minGTone);
            }
        }

        for (let partIndex = 0; partIndex < 4; partIndex++) {
            // Is this a good part to add eighths?
            const richNote = divisionedNotes[i].filter(note => note.partIndex == partIndex)[0];
            const nextRichNote = divisionedNotes[i + BEAT_LENGTH].filter(note => note.partIndex == partIndex)[0];
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            const gTone1 = globalSemitone(richNote.note);
            const gTone2 = globalSemitone(nextRichNote.note);
            let nonChordTone = passingTone(gTone1, gTone2, richNote.scale, gToneLimitsForThisBeat[partIndex]);
            if (!nonChordTone) {
                nonChordTone = neighborTone(gTone1, gTone2, richNote.scale, gToneLimitsForThisBeat[partIndex]);
            }
            if (!nonChordTone) {
                continue;
            }

            const result = addNoteBetween(nonChordTone, i, i + BEAT_LENGTH, partIndex, divisionedNotes);
            if (!result) {
                continue;
            }
            break;
        }
    }
}

