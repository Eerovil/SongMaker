import { Note } from "musictheoryjs";
import { BEAT_LENGTH, DivisionedRichnotes, globalSemitone, MainMusicParams, MusicParams, Nullable } from "./utils";


const addNoteBetween = (division: number, nextDivision: number, partIndex: number, divisionedNotes: DivisionedRichnotes): boolean => {
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
    const scaleTones = nextBeatRichNote.scale.notes.map(n => n.semitone).filter(n => prevScaleTones.includes(n));
    const currentGTone = globalSemitone(beatRichNote.note)
    const nextGTone = globalSemitone(nextBeatRichNote.note);
    const randomNote = beatRichNote.note.copy();

    const diff = Math.abs(currentGTone - nextGTone);
    if (diff < 2) {
        return false;
    }

    if (currentGTone != nextGTone) {
        const availableGTones = []
        for (let gTone=currentGTone; gTone != nextGTone; gTone += (currentGTone < nextGTone ? 1 : -1)) {
            if (gTone == currentGTone) {
                continue;
            }
            const semitone = gTone % 12;
            if (!scaleTones.includes(semitone)) {
                continue;
            }
            availableGTones.push(gTone);
        }
        if (availableGTones.length == 0) {
            availableGTones.push(currentGTone);
        }
        console.log(currentGTone, " -> ", nextGTone, ", availableGTones: ", availableGTones, ", scaleTones: ", scaleTones);
        const randomGTone = availableGTones[Math.floor(Math.random() * availableGTones.length)];
        randomNote.semitone = randomGTone % 12;
        randomNote.octave = Math.floor(randomGTone / 12);
    }

    beatRichNote.duration = divisionDiff / 2;
    divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
    const newRandomRichNote = {
        note: randomNote,
        duration: divisionDiff / 2,
        chord: beatRichNote.chord,
        scale: beatRichNote.scale,
        partIndex: partIndex,
    }
    divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
    return true;
}


export const buildTopMelody = (divisionedNotes: DivisionedRichnotes, mainParams: MainMusicParams) => {
    // Convert 4th notes in part 1 to 8th notes. Add random 8th and 16th notes between them. (and pauses?)
    const lastDivision = BEAT_LENGTH * mainParams.getMaxBeats();

    for (let i = 0; i < lastDivision - BEAT_LENGTH; i += BEAT_LENGTH) {
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
            // Is this a good part to add eighths?
            const result = addNoteBetween(i, i + BEAT_LENGTH, partIndex, divisionedNotes);
            if (!result) {
                continue;
            }
            if (Math.random() < params.sixteenthNotes) {
                addNoteBetween(i, i + BEAT_LENGTH / 2, partIndex, divisionedNotes);
            }
            if (Math.random() < params.sixteenthNotes) {
                addNoteBetween(i + BEAT_LENGTH / 2, i + BEAT_LENGTH, partIndex, divisionedNotes);
            }
            break;
        }
    }
}

