import { Note, Scale } from "musictheoryjs";
import { addNoteBetween, findNACs, FindNonChordToneParams, NonChordTone } from "./nonchordtones";
import { getTension, Tension, TensionParams } from "./tension";
import { BEAT_LENGTH, Chord, DivisionedRichnotes, getMelodyNeededTones, getRichNote, globalSemitone, gToneString, nextGToneInScale, Nullable, semitoneDistance, semitoneScaleIndex, startingNotes } from "./utils";


export type ForcedMelodyResult = {
    comment: string,
    tension: number,
    nac: NonChordTone | null,
}



export const addForcedMelody = (values: TensionParams): ForcedMelodyResult => {
    /*
    
    */
    const { toNotes, currentScale, params, mainParams, beatDivision } = values;
    const {startingGlobalSemitones, semitoneLimits} = startingNotes(params);
    const chord = values.newChord;
    const divisionedNotes = values.divisionedNotes || {};
    const maxDivision = mainParams.getMaxBeats() * BEAT_LENGTH;
    const tension: ForcedMelodyResult = {
        comment: "",
        tension: 0,
        nac: null,
    }

    const melodyTonesAndDurations = getMelodyNeededTones(mainParams);
    const melodyExists = (mainParams.forcedMelody || []).length > 0;
    if (!melodyExists) {
        return tension;
    }

    const currentDivision = beatDivision;
    const cadenceDivision = currentDivision - params.cadenceStartDivision;

    // Strong beat note is supposed to be this
    let newMelodyToneAndDuration = melodyTonesAndDurations[cadenceDivision];
    let newMelodyToneDivision = cadenceDivision;
    if (!newMelodyToneAndDuration) {
        // No melody tone for this division, the previous tone must be lengthy. Use it.
        for (let i = cadenceDivision - 1; i >= cadenceDivision - BEAT_LENGTH * 2; i--) {
            newMelodyToneAndDuration = melodyTonesAndDurations[i];
            if (newMelodyToneAndDuration) {
                newMelodyToneDivision = i;
                break;
            }
        }
    }
    if (!newMelodyToneAndDuration || newMelodyToneAndDuration.tone == undefined) {
        // No melody found at all. Give up.
        tension.comment = "No melody found at all. Give up.";
        return tension;
    }

    const newMelodySemitone = currentScale.notes[newMelodyToneAndDuration.tone].semitone + 1 - 1;  // Convert to number
    const toSemitones = toNotes.map((x) => x.semitone);

    // Can we turn this note into a non-chord tone? Check the previous and next note.
    let nextMelodyToneAndDuration;
    let nextMelodyToneDivision;
    for (let i = newMelodyToneDivision + 1; i <= maxDivision; i++) {
        nextMelodyToneAndDuration = melodyTonesAndDurations[i];
        if (nextMelodyToneAndDuration) {
            nextMelodyToneDivision = i;
            break;
        }
    }

    if (!nextMelodyToneAndDuration || nextMelodyToneAndDuration.tone == undefined) {
        // No melody found at all. Give up.
        tension.comment = "No melody found at all. Give up.";
        return tension;
    }

    // Let's not care that much if the weak beat note is not correct. It just adds tension to the result.
    // UNLESS it's in the melody also.

    // What NAC could work?
    // Convert all values to globalSemitones
    const toGlobalSemitone = globalSemitone(toNotes[0])
    const toGlobalSemitones = toNotes.map((x) => globalSemitone(x));
    let prevRichNote;
    for (let i = currentDivision - 1; i >= 0; i--) {
        prevRichNote = (divisionedNotes[i] || []).filter(richNote => richNote.partIndex == 0)[0];
        if (prevRichNote) {
            break;
        }
    }

    let prevBeatRichNote = (divisionedNotes[currentDivision - BEAT_LENGTH] || []).filter(richNote => richNote.partIndex == 0)[0];
    let prevBeatGlobalSemitone = prevBeatRichNote ? globalSemitone(prevBeatRichNote.note) : null;

    let prevPart1RichNote;
    for (let i = currentDivision - 1; i >= 0; i--) {
        prevPart1RichNote = (divisionedNotes[i] || []).filter(richNote => richNote.partIndex == 1)[0];
        if (prevPart1RichNote) {
            break;
        }
    }

    // If previous note doesn't exist, this is actually easier.
    const fromGlobalSemitone = prevRichNote ? globalSemitone(prevRichNote.note) : null;

    // Trying to figure out the melody direction... We should put octaves in the forced melody string...
    const closestCorrectGToneBasedOn = prevBeatGlobalSemitone || fromGlobalSemitone || toGlobalSemitone;

    let closestCorrectGTone = newMelodySemitone;
    let iterations = 0;
    while (Math.abs(closestCorrectGTone - closestCorrectGToneBasedOn) > 6 && closestCorrectGTone <= semitoneLimits[0][1]) {
        iterations++; if (iterations > 100) { debugger;  throw new Error("Too many iterations"); }
        closestCorrectGTone += 12 * Math.sign(closestCorrectGToneBasedOn - closestCorrectGTone);
    }

    let nextCorrectGtone;
    if (nextMelodyToneAndDuration) {
        nextCorrectGtone = globalSemitone(currentScale.notes[nextMelodyToneAndDuration.tone]) % 12;
        iterations = 0;
        while (Math.abs(nextCorrectGtone - closestCorrectGTone) > 6 && nextCorrectGtone <= semitoneLimits[0][1]) {
            iterations++; if (iterations > 100) { debugger; throw new Error("Too many iterations"); }
            nextCorrectGtone += 12 * Math.sign(closestCorrectGTone - nextCorrectGtone);
        }
    }
    if (!nextCorrectGtone || !nextMelodyToneAndDuration) {
        // If melody has ended, use current melody tone.
        nextCorrectGtone = closestCorrectGTone;
        nextMelodyToneAndDuration = newMelodyToneAndDuration;
    }

    let nextBeatMelodyToneAndDuration = melodyTonesAndDurations[cadenceDivision + BEAT_LENGTH];
    if (!nextBeatMelodyToneAndDuration) {
        nextBeatMelodyToneAndDuration = nextMelodyToneAndDuration;
    }
    let nextBeatCorrectGTone;
    if (nextBeatMelodyToneAndDuration) {
        nextBeatCorrectGTone = globalSemitone(currentScale.notes[nextBeatMelodyToneAndDuration.tone]) % 12;
        iterations = 0;
        while (Math.abs(nextBeatCorrectGTone - nextCorrectGtone) > 6 && nextBeatCorrectGTone <= semitoneLimits[0][1]) {
            if (iterations++ > 100) { throw new Error("Too many iterations"); }
            nextBeatCorrectGTone += 12 * Math.sign(nextCorrectGtone - nextBeatCorrectGTone);
        }
    }

    // Now we have 1: the previous note, 2: what the current note should be, 3: what the next note should be.
    // Based on the required durations, we have some choices:

    // 1. Beat melody is a quarter. This is the easiest case.
    // Here we can at the most use a 8th/8th NAC on the strong beat.
    // Though, tension is added.

    // 2. Current beat melody is 8th and 8th. Both notes MUST be correct.
    // Base on the next note we can use some NACs. This is where the weak beat NACs come in.

    // 3. Current beat melody is a half note. We can use a strong beat NAC.
    // Tension is added.

    // Harder cases, such as syncopation, are not handled. yet.

    let part1MaxGTone = Math.max(toGlobalSemitones[1], prevPart1RichNote ? globalSemitone(prevPart1RichNote.note) : 0);

    const nacParams: {[key: string]: any} = {
        fromGTone: fromGlobalSemitone || closestCorrectGTone,
        thisBeatGTone: toGlobalSemitone,
        nextBeatGTone: nextBeatCorrectGTone,
        scale: currentScale,
        chord: chord,
        gToneLimits: [part1MaxGTone, 127],  // TODO
        wantedGTones: [],
    }

    const eeStrongMode = (
        newMelodyToneAndDuration.duration == BEAT_LENGTH ||
        (
            (newMelodyToneAndDuration.duration == BEAT_LENGTH / 2 && nextMelodyToneAndDuration.duration == BEAT_LENGTH / 2) &&
            closestCorrectGTone != toGlobalSemitone
        )
    )

    if (eeStrongMode) {
        if (closestCorrectGTone == toGlobalSemitone) {
            // This is the correct note. No tension.
            tension.comment = "Correct quarter note";
            return tension;
        }
        // Try to find a way to add a right NAC on the strong beat.
        nacParams.wantedGTones[0] = closestCorrectGTone;
        if (newMelodyToneAndDuration.duration == BEAT_LENGTH / 2) {
            nacParams.wantedGTones[1] = nextCorrectGtone;
            if (toGlobalSemitone != nextCorrectGtone) {
                tension.comment = `InCorrect 8th/8th note, ${gToneString(toGlobalSemitone)} != ${gToneString(nextCorrectGtone)}`;
                tension.tension += 100;
                return tension;
            }
        }
        nacParams.splitMode = "EE"
        const nac = findNACs(nacParams as FindNonChordToneParams);
        if (!nac) {
            tension.comment = `No NAC found: wantedTones: ${(nacParams.wantedGTones as number[]).map(tone => gToneString(tone))}` + `${gToneString(nacParams.thisBeatGTone)}, ${gToneString(nextCorrectGtone)}, ${gToneString(nacParams.nextBeatGTone)}`;
            tension.tension += 100;
            return tension;
        }
        const newNoteGTone = globalSemitone(nac.note);
        // Great... We can add a correct 8th on the strong beat!
        // Add it
        // tension.comment = `Adding NAC on strong beat: ${gToneString(globalSemitone(nac.note))} to division ${currentDivision}, wantedGtones: ${nacParams.wantedGTones.map(gToneString)}`;
        tension.nac = nac;
        tension.tension += 5; // Not that great, but it's better than nothing.
    } else if (newMelodyToneAndDuration.duration == BEAT_LENGTH / 2 && nextMelodyToneAndDuration.duration == BEAT_LENGTH / 2) {
        // Try to find a way to add a right NAC on the strong beat. and a right nac on weak beat
        if (closestCorrectGTone == toGlobalSemitone) {
            // Strong beat is already correct. Need a note on weak beat
            nacParams.wantedGTones[1] = nextCorrectGtone;
            nacParams.splitMode = "EE"
            const nac = findNACs(nacParams as FindNonChordToneParams);
            if (!nac) {
                tension.comment = "No NAC found for quarter note";
                tension.tension += 100;
                return tension;
            }
            const newNoteGTone = globalSemitone(nac.note);
            // Great... We can add a correct 8th on the strong beat!
            // Add it
            // tension.comment = `Adding weak EE NAC ${gToneString(globalSemitone(nac.note))} to division ${currentDivision}, wantedGtones: ${nacParams.wantedGTones.map(gToneString)}`;
            tension.nac = nac;
            // This is absolutely perfect, both notes are correct. (no tension!)
        } else {
            // Well, no can do then I guess.
            tension.comment = "closestCorrectGTone != toGlobalSemitone";
            tension.tension += 100;
            return tension;

        }
    } else {
        tension.comment = `${newMelodyToneAndDuration.duration} != ${BEAT_LENGTH}`;
    }
    
    tension.tension = 0;
    return tension;
}