import { Note, Scale } from "musictheoryjs";
import { getTension, Tension, TensionParams } from "./tension";
import { BEAT_LENGTH, DivisionedRichnotes, getMelodyNeededTones, getRichNote, globalSemitone, MainMusicParams, MusicParams, nextGToneInScale, Nullable, semitoneDistance, semitoneScaleIndex, startingNotes } from "./utils";

export const getForcedMelodyMatch = (tension: Tension, values: TensionParams, mainParams: MainMusicParams) => {
    /*
    * Return tension based on how well the new notes match to params.forcedMelody
    * current division is assumed to be latestDivision + BEAT_LENGTH (of current phrase!)
    */
    const { toNotes, currentScale, params, divisionedNotes } = values;

    if (!divisionedNotes) {
        tension.comment = "No notes";
        tension.forcedMelody = 0;
        return;
    }

    const melodyTonesAndDurations = getMelodyNeededTones(mainParams);

    let latestDivision = Math.max(...Object.keys(divisionedNotes).map((x) => parseInt(x, 10)));
    if (!latestDivision) {
        latestDivision = -BEAT_LENGTH;
    }
    latestDivision -= params.cadenceStartDivision;
    const newDivision = latestDivision + BEAT_LENGTH;

    // New note is supposed to be this
    let newMelodyToneAndDuration = melodyTonesAndDurations[newDivision];
    if (!newMelodyToneAndDuration) {
        tension.comment = `No melody tone for division ${newDivision}`;
        tension.forcedMelody = 0;
        return;
    }

    const newMelodySemitone = currentScale.notes[newMelodyToneAndDuration.tone].semitone;
    const toSemitones = toNotes.map((x) => x.semitone);

    if (newMelodySemitone != toSemitones[0]) {
        tension.forcedMelody = 100;
        return;
    }
    tension.comment = "No comment"
    tension.forcedMelody = 0;
    return;
}