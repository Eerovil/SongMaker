import { BEAT_LENGTH, DivisionedRichnotes, MusicParams } from "./utils";

export const addHalfNotes = (divisionedNotes: DivisionedRichnotes, params: MusicParams) => {

    const beatsPerCadence = 4 * params.barsPerCadence;
    const beatsPerBar = 4;
    const lastDivision = BEAT_LENGTH * beatsPerCadence * params.cadenceCount;

    for (let division = 0; division < lastDivision - BEAT_LENGTH; division += BEAT_LENGTH) {
        const lastBeat = Math.floor(division / BEAT_LENGTH) * BEAT_LENGTH;
        let beatsUntilLastChordInCadence = Math.floor(division) % beatsPerCadence
        let cadenceEnding = beatsUntilLastChordInCadence >= beatsPerCadence - 1 || beatsUntilLastChordInCadence == 0
        if (params.halfNotes && !cadenceEnding) {
            // Add a tie start to the previous note to double length, and tie stop to this
            // if it's continuing with the same
            const previousNotes = divisionedNotes[division - 12]
            const currentNotes = divisionedNotes[division]
            for (let i=0; i<4; i++) {
                const previousNote = previousNotes.filter((n) => n.partIndex == i)[0];
                const currentNote = currentNotes.filter((n) => n.partIndex == i)[0];
                if (previousNote && currentNote && previousNote.note.equals(currentNote.note)) {
                    if (previousNote.duration != BEAT_LENGTH) {
                        continue;
                    }
                    if (currentNote.duration != BEAT_LENGTH) {
                        continue;
                    }
                    if (previousNote.tie != null) {
                        continue;
                    }
                    previousNote.tie = "start";
                    currentNote.tie = "stop";
                }
            }
            console.log("previousNotes: ", previousNotes);
        }
    }
}
