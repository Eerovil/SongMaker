import { Note } from "musictheoryjs";
import { BEAT_LENGTH, DivisionedRichnotes, globalSemitone, MusicParams, Nullable } from "./utils";

export const buildTopMelody = (divisionedNotes: DivisionedRichnotes, params: MusicParams) => {
    // Convert 4th notes in part 1 to 8th notes. Add random 8th and 16th notes between them. (and pauses?)

    const beatsPerCadence = 4 * params.barsPerCadence;
    const lastDivision = BEAT_LENGTH * beatsPerCadence * params.cadenceCount;
    const sixteenthChance = params.sixteenthNotes;
    const part1BaseNote = globalSemitone(new Note(params.parts[0].note));
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

        const beatRichNote = divisionedNotes[i].filter(note => note.duration == BEAT_LENGTH && note.partIndex == 0)[0];
        if (!beatRichNote || !beatRichNote.note) {
            continue;
        }
        const scaleTones = beatRichNote.scale.notes.map(n => n.semitone);

        const nextBeatRichNote = divisionedNotes[i + BEAT_LENGTH].filter(note => note.duration == BEAT_LENGTH && note.partIndex == 0)[0];
        if (!nextBeatRichNote || !nextBeatRichNote.note) {
            continue;
        }

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

        beatRichNote.duration = BEAT_LENGTH / 2;
        divisionedNotes[i + BEAT_LENGTH / 2] = divisionedNotes[i + BEAT_LENGTH / 2] || [];
        const newRandomRichNote = {
            note: randomNote,
            duration: BEAT_LENGTH / 2,
            chord: beatRichNote.chord,
            scale: beatRichNote.scale,
            partIndex: 0,
        }
        divisionedNotes[i + BEAT_LENGTH / 2].push(newRandomRichNote);

        // if (!lastBeatInCadence && (Math.random() < sixteenthChance)) {
        //     // Convert the 8th notes to 16th notes
        //     const scaleSemitones = scale.notes.map(note => note.semitone);
        //     for (let j=0; j<2; j++) {
        //         let note;
        //         if (j == 0) {
        //             note = beatRichNote.note;
        //         } else if (j == 1) {
        //             note = randomNote;
        //         }
        //         const minGSemitone = globalSemitone(note) - 2;
        //         const maxGSemitone = globalSemitone(note) + 2;
        //         const choices = [];
        //         for (let semitone=minGSemitone; semitone<=maxGSemitone; semitone++) {
        //             if (scaleSemitones.includes(semitone % 12)) {
        //                 choices.push(semitone);
        //             }
        //         }
        //         const randomSemitone = choices[Math.floor(Math.random() * choices.length)];
        //         const newNote = note.copy()
        //         newNote.semitone = randomSemitone % 12;
        //         newNote.octave = getClosestOctave(newNote, note);

        //         if (j == 0) {
        //             beatRichNote.duration = BEAT_LENGTH / 4;
        //             divisionedNotes[i + BEAT_LENGTH / 4] = divisionedNotes[i + BEAT_LENGTH / 4] || [];
        //             divisionedNotes[i + BEAT_LENGTH / 4].push({
        //                 note: newNote,
        //                 duration: BEAT_LENGTH / 4,
        //                 chord: beatRichNote.chord,
        //                 scale: beatRichNote.scale,
        //                 partIndex: 0,
        //             });
        //         } else if (j == 1) {
        //             newRandomRichNote.duration = BEAT_LENGTH / 4;
        //             divisionedNotes[i + BEAT_LENGTH / 2 + BEAT_LENGTH / 4] = divisionedNotes[i + BEAT_LENGTH / 2 + BEAT_LENGTH / 4] || [];
        //             divisionedNotes[i + BEAT_LENGTH / 2 + BEAT_LENGTH / 4].push({
        //                 note: newNote,
        //                 duration: BEAT_LENGTH / 4,
        //                 chord: beatRichNote.chord,
        //                 scale: beatRichNote.scale,
        //                 partIndex: 0,
        //             });
        //         }
        //     }
        // }

    }
}

