import { Note } from "musictheoryjs";
import { BEAT_LENGTH, DivisionedRichnotes, globalSemitone, MusicParams, Nullable } from "./utils";


const addNoteBetween = (division: number, nextDivision: number, partIndex: number, divisionedNotes: DivisionedRichnotes) => {
    const divisionDiff = nextDivision - division;
    const beatRichNote = divisionedNotes[division].filter(note => note.partIndex == partIndex)[0];
    if (!beatRichNote || !beatRichNote.note) {
        return;
    }

    const prevScaleTones = beatRichNote.scale.notes.map(n => n.semitone);
    const nextBeatRichNote = divisionedNotes[nextDivision].filter(note => note.partIndex == partIndex)[0];
    if (!nextBeatRichNote || !nextBeatRichNote.note) {
        return;
    }
    const scaleTones = nextBeatRichNote.scale.notes.map(n => n.semitone).filter(n => prevScaleTones.indexOf(n) !== -1);
    const currentGTone = globalSemitone(beatRichNote.note)
    const nextGTone = globalSemitone(nextBeatRichNote.note);
    const randomNote = beatRichNote.note.copy();

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
        console.log(currentGTone, " -> ", nextGTone, ", availableGTones: ", availableGTones);
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

}


export const buildTopMelody = (divisionedNotes: DivisionedRichnotes, params: MusicParams) => {
    // Convert 4th notes in part 1 to 8th notes. Add random 8th and 16th notes between them. (and pauses?)

    const beatsPerCadence = 4 * params.barsPerCadence;
    const lastDivision = BEAT_LENGTH * beatsPerCadence * params.cadenceCount;
    for (let partIndex = 0; partIndex < 4; partIndex++) {
        let sixteenthChance;
        let eighthChance;
        if (partIndex == 0) {
            sixteenthChance= params.sixteenthNotes;
            eighthChance = params.eighthNotes;
        } else if (partIndex == 3) {
            sixteenthChance = params.sixteenthNotes / 4;
            eighthChance = params.eighthNotes / 2;
        } else {
            sixteenthChance = 0;
            eighthChance = params.eighthNotes / 4;
        }
        const part1BaseNote = globalSemitone(new Note(params.parts[partIndex].note));
        const part1MaxNote = part1BaseNote + 12;

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

        for (let i = 0; i < lastDivision - BEAT_LENGTH; i += BEAT_LENGTH) {
            const beatNumber = i / BEAT_LENGTH;
            const lastBeatInCadence = (beatNumber % beatsPerCadence) == beatsPerCadence - 1;
            if (lastBeatInCadence) {
                continue;
            }


            if (Math.random() < eighthChance) {
                addNoteBetween(i, i + BEAT_LENGTH, partIndex, divisionedNotes);
                if (Math.random() < sixteenthChance) {
                    addNoteBetween(i, i + BEAT_LENGTH / 2, partIndex, divisionedNotes);
                }
                if (Math.random() < sixteenthChance) {
                    addNoteBetween(i + BEAT_LENGTH / 2, i + BEAT_LENGTH, partIndex, divisionedNotes);
                }
            }

        }
    }
}

