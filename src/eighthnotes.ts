import { Note } from "musictheoryjs";
import { BEAT_LENGTH, DivisionedRichnotes, getClosestOctave, globalSemitone, MusicParams } from "./utils";

export const addEighthNotes = (divisionedNotes: DivisionedRichnotes, params: MusicParams) => {
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
                try {
                    console.log("Not adding 8th notes between ", note.note.toString(), " and ", nextNote.note.toString());
                } catch (e) {
                    console.log("Not adding 8th notes between ", note, " and ", nextNote);
                }
                console.groupEnd();
                continue;
            }
            const noteGTone = globalSemitone(note.note);
            const nextNoteGTone = globalSemitone(nextNote.note);
            const distance = noteGTone - nextNoteGTone;
            const scale = note.scale;
            const scaleIndex = scale.notes.findIndex(n => n.semitone == note.note.semitone);
            if (scaleIndex == -1) {
                console.log("Failed to find note in scale");
                console.groupEnd();
                continue;
            }
            const nextNoteInScale = scale.notes[(scaleIndex + 1) % scale.notes.length];
            const prevNoteInScale = scale.notes[(scaleIndex - 1 + scale.notes.length) % scale.notes.length];
            if (globalSemitone(nextNoteInScale) < noteGTone) {
                console.log("Next note in scale is lower than this note, so we can't add 8th notes");
                console.groupEnd();
                continue;
            }
            if (globalSemitone(prevNoteInScale) > noteGTone) {
                console.log("Prev note in scale is higher than this note, so we can't add 8th notes");
                console.groupEnd();
                continue;
            }
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
