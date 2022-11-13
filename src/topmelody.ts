import { Note, Scale } from "musictheoryjs";
import { getTension } from "./tension";
import { BEAT_LENGTH, DivisionedRichnotes, getRichNote, globalSemitone, MainMusicParams, MusicParams, nextGToneInScale, Nullable, semitoneDistance, semitoneScaleIndex, startingNotes } from "./utils";


type NonChordTone = {
    note: Note,
    note2? : Note,  // This makes the notes 16ths
    strongBeat: boolean,
    replacement?: boolean,
}

type NonChordToneParams = {
    gTone0: number | null,
    gTone1: number,
    gTone2: number,
    scale: Scale,
    gToneLimits: number[],
}


const addNoteBetween = (nac: NonChordTone, division: number, nextDivision: number, partIndex: number, divisionedNotes: DivisionedRichnotes): boolean => {
    const divisionDiff = nextDivision - division;
    const beatRichNote = (divisionedNotes[division] || []).filter(note => note.partIndex == partIndex)[0];
    if (!beatRichNote || !beatRichNote.note) {
        return false;
    }

    // @ts-ignore
    const prevScaleTones = beatRichNote.scale.notes.map(n => n.semitone);
    const nextBeatRichNote = (divisionedNotes[nextDivision] || []).filter(note => note.partIndex == partIndex)[0];
    if (!nextBeatRichNote || !nextBeatRichNote.note) {
        return false;
    }

    const newNote = nac.note;
    const newNote2 = nac.note2;
    const strongBeat = nac.strongBeat;
    const replacement = nac.replacement || false;

    // If strong beat, we add newNote BEFORE beatRichNote
    // Otherwise we add newNote AFTER beatRichNote

    if (strongBeat) {
        beatRichNote.duration = divisionDiff / 2;
        divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
        const newRandomRichNote = {
            note: newNote,
            duration: divisionDiff / 2,
            chord: beatRichNote.chord,
            scale: beatRichNote.scale,
            partIndex: partIndex,
        }
        // Add new tone to division
        divisionedNotes[division].push(newRandomRichNote);
        // Remove beatRichNote from division
        divisionedNotes[division] = divisionedNotes[division].filter(note => note != beatRichNote);
        if (!replacement) {
            // Add beatRichNote to division + divisionDiff / 2
            divisionedNotes[division + divisionDiff / 2].push(beatRichNote);
        } else {
            // Add new tone also to division + divisionDiff / 2
            divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
        }
    } else {
        if (!newNote2) {
            // adding 1 8th note
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
        } else {
            // adding 2 16th notes
            beatRichNote.duration = divisionDiff / 2;
            divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
            const newRandomRichNote = {
                note: newNote,
                duration: divisionDiff / 4,
                chord: beatRichNote.chord,
                scale: beatRichNote.scale,
                partIndex: partIndex,
            }
            divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
            divisionedNotes[division + divisionDiff * 0.75] = divisionedNotes[division + divisionDiff * 0.75] || [];
            const newRandomRichNote2 = {
                note: newNote2,
                duration: divisionDiff / 4,
                chord: beatRichNote.chord,
                scale: beatRichNote.scale,
                partIndex: partIndex,
            }
            divisionedNotes[division + divisionDiff * 0.75].push(newRandomRichNote2);
        }
    }
    return true;
}


const passingTone = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
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
            return {
                note: new Note({
                    semitone: gTone % 12,
                    octave: Math.floor(gTone / 12),
                }),
                strongBeat: false,
            }
        }
    }
    return null;
}


const neighborTone = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
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
        const newGtone = nextGToneInScale(gTone1, upOrDown, scale);
        if (!newGtone) {
            continue;
        }
        if (newGtone < gToneLimits[0] || newGtone > gToneLimits[1]) {
            continue;
        }
        return {note: new Note({
            semitone: newGtone % 12,
            octave: Math.floor(newGtone / 12),
        }), strongBeat: false};
    }
    return null;
}


const suspension = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Stay on previous, then step DOWN into chord tone. This is on Strong beat.
    // Usually dotted!
    if (!gTone0) {
        return null;
    }
    const distance = gTone0 - gTone1;
    if (distance < 1 || distance > 2) {
        // Must be half or whole step down.
        return null;
    }

    // Convert gTone1 to gTone0 for the length of the suspension.
    return {
        note: new Note({
            semitone: gTone0 % 12,
            octave: Math.floor(gTone0 / 12),
        }),
        strongBeat: true,
    }
}


const retardation = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Stay on previous, then step UP into chord tone. This is on Strong beat
    // Usually dotted!
    if (!gTone0) {
        return null;
    }
    const distance = gTone1 - gTone0;
    if (distance < 1 || distance > 2) {
        // Must be half or whole step up.
        return null;
    }

    // Convert gTone1 to gTone0 for the length of the suspension.
    return {note: new Note({
        semitone: gTone0 % 12,
        octave: Math.floor(gTone0 / 12),
    }), strongBeat: true};}


const appogiatura = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Leap, then step back into Chord tone. This is on Strong beat
    if (!gTone0) {
        return null;
    }
    const distance = gTone1 - gTone0;
    if (Math.abs(distance) < 3) {
        return null;
    }

    let upOrDown = -1;
    // convert gTone1 to a step down for the duration of the appogiatura
    if (distance > 0) {
        // convert gTone1 to a step up for the duration of the appogiatura
        upOrDown = 1;
    }
    const gTone = nextGToneInScale(gTone1, upOrDown, scale);
    if (!gTone) {
        return null;
    }
    if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
        return null;
    }
    return {note: new Note({
        semitone: gTone % 12,
        octave: Math.floor(gTone / 12),
    }), strongBeat: true};
}

const escapeTone = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Step away, then Leap in to next Chord tone. This is on Strong beat
    if (!gTone0) {
        return null;
    }
    const distance = gTone1 - gTone0;
    if (Math.abs(distance) < 3) {
        return null;
    }

    let upOrDown = 1;
    // convert gTone1 to a step up from gTone0 for the duration of the escapeTone
    if (distance > 0) {
        // convert gTone1 to a step down from gTone0 for the duration of the escapeTone
        upOrDown = -1;
    }
    const gTone = nextGToneInScale(gTone0, upOrDown, scale);
    if (!gTone) {
        return null;
    }
    if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
        return null;
    }
    return {note: new Note({
        semitone: gTone % 12,
        octave: Math.floor(gTone / 12),
    }), strongBeat: true};
}

const anticipation = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Step or leap early in to next Chord tone. This is on weak beat.
    const distance = gTone2 - gTone1;
    if (Math.abs(distance) < 1) {
        // Too close to be an anticipation
        return null;
    }

    // Easy. Just make a new note thats the same as gTone2.
    return {note: new Note({
        semitone: gTone2 % 12,
        octave: Math.floor(gTone2 / 12),
    }), strongBeat: false};
}

const neighborGroup = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Step away, then leap into the "other possible" neighbor tone. This uses 16ths (two notes).
    // Weak beat
    if (gTone1 != gTone2) {
        return null;
    }
    const scaleIndex = semitoneScaleIndex(scale)[gTone1 % 12];
    if (!scaleIndex) {
        return null;
    }
    const upGtone = nextGToneInScale(gTone1, 1, scale);
    const downGtone = nextGToneInScale(gTone1, -1, scale);
    if (!upGtone || !downGtone) {
        return null;
    }
    if (upGtone < gToneLimits[0] || upGtone > gToneLimits[1]) {
        return null;
    }
    if (downGtone < gToneLimits[0] || downGtone > gToneLimits[1]) {
        return null;
    }
    return {
        note: new Note({
            semitone: upGtone % 12,
            octave: Math.floor(upGtone / 12),
        }),
        note2: new Note({
            semitone: downGtone % 12,
            octave: Math.floor(downGtone / 12),
        }),
        strongBeat: false
    };
}


const pedalPoint = (values: NonChordToneParams): NonChordTone | null => {
    const {gTone0, gTone1, gTone2, scale, gToneLimits} = values;
    // Replace the entire note with the note that is before it AND after it.
    if (gTone0 != gTone2) {
        return null;
    }
    if (gTone0 == gTone1) {
        return null;  // Already exists
    }
    if (gTone1 < gToneLimits[0] || gTone1 > gToneLimits[1]) {
        return null;
    }
    return {note: new Note({
        semitone: gTone0 % 12,
        octave: Math.floor(gTone0 / 12),
    }), strongBeat: true, replacement: true};
}


export const buildTopMelody = (divisionedNotes: DivisionedRichnotes, mainParams: MainMusicParams) => {
    // Follow the pre given melody rhythm
    const melodyRhythmString = mainParams.melodyRhythm;
    // Figure out what needs to happen each beat to get our melody
    let rhythmDivision = 0;
    const rhythmNeededDurations: {[key: number]: number} = {};
    for (let i=0; i<melodyRhythmString.length; i++) {
        const rhythm = melodyRhythmString[i];
        if (rhythm == "W") {
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH * 4;
            rhythmDivision += BEAT_LENGTH * 4
            // TODO
        } else if (rhythm == "H") {
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH * 2;
            rhythmDivision += BEAT_LENGTH * 2
            // TODO
        } else if (rhythm == "Q") {
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH;
            rhythmDivision += BEAT_LENGTH;
            continue;  // Nothing to do
        } else if (rhythm == "E") {
            // This division needs to be converted to Eighth
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH / 2;
            rhythmDivision += BEAT_LENGTH / 2;
        } else if (rhythm == "S") {
            // This division needs to be converted to Sixteenth
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH / 4;
            rhythmDivision += BEAT_LENGTH / 4;
        }
    }

    const lastDivision = BEAT_LENGTH * mainParams.getMaxBeats();
    const firstParams = mainParams.currentCadenceParams(0);
    const {startingGlobalSemitones, semitoneLimits} = startingNotes(firstParams);

    for (let division = 0; division < lastDivision - BEAT_LENGTH; division += BEAT_LENGTH) {
        let gToneLimitsForThisBeat = [
            [...semitoneLimits[0]],
            [...semitoneLimits[1]],
            [...semitoneLimits[2]],
            [...semitoneLimits[3]],
        ];
        const params = mainParams.currentCadenceParams(division);
        const cadenceDivision = division - params.cadenceStartDivision;
        const neededRhythm = rhythmNeededDurations[cadenceDivision] || 100;

        const lastBeatInCadence = params.beatsUntilCadenceEnd < 2
        if (lastBeatInCadence) {
            continue;
        }

        const prevNotes: Note[] = [];
        const thisNotes: Note[] = [];
        const nextNotes: Note[] = [];
        let currentScale: Scale;

        for (const richNote of divisionedNotes[division - BEAT_LENGTH] || []) {
            if (richNote.note) {
                prevNotes[richNote.partIndex] = richNote.note;
            }
        }
        for (const richNote of divisionedNotes[division] || []) {
            if (richNote.note) {
                prevNotes[richNote.partIndex] = richNote.note;
                if (richNote.scale) {
                    currentScale = richNote.scale;
                }
            }
        }
        for (const richNote of divisionedNotes[division + BEAT_LENGTH] || []) {
            if (richNote.note) {
                nextNotes[richNote.partIndex] = richNote.note;
            }
        }

        // @ts-ignore
        currentScale = currentScale;

        for (let partIndex = 0; partIndex < 4; partIndex++) {
            // Change limits, new notes must also be betweeen the other part notes
            // ( Overlapping )
            const richNote = getRichNote(divisionedNotes, division, partIndex);
            const nextRichNote = getRichNote(divisionedNotes, division + BEAT_LENGTH, partIndex);
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            const gTone1 = globalSemitone(richNote.note);
            const gTone2 = globalSemitone(nextRichNote.note);
            const minGTone = Math.min(gTone1, gTone2);
            const maxGTone = Math.max(gTone1, gTone2);
            if (gToneLimitsForThisBeat[partIndex - 1]) {
                // Limit the higher part, it can't go lower than maxGTone
                gToneLimitsForThisBeat[partIndex - 1][0] = Math.max(gToneLimitsForThisBeat[partIndex - 1][0], maxGTone);
            }
            if (gToneLimitsForThisBeat[partIndex + 1]) {
                // Limit the lower part, it can't go higher than minGTone
                gToneLimitsForThisBeat[partIndex + 1][1] = Math.min(gToneLimitsForThisBeat[partIndex + 1][1], minGTone);
            }
        }

        for (let partIndex = 0; partIndex < 4; partIndex++) {
            if (neededRhythm != 2 * BEAT_LENGTH) {
                // No need for half notes
                continue;
            }
            // Add a tie to the next note
            const richNote = getRichNote(divisionedNotes, division, partIndex);
            const nextRichNote = getRichNote(divisionedNotes, division + BEAT_LENGTH, partIndex);
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            if (globalSemitone(richNote.note) != globalSemitone(nextRichNote.note)) {
                continue;
            }
            richNote.tie = "start";
            nextRichNote.tie = "stop";
        }

        for (let partIndex = 0; partIndex < 4; partIndex++) {
            if (neededRhythm !=  BEAT_LENGTH / 2) {
                // No need for 8ths.
                continue;
            }
            const richNote = getRichNote(divisionedNotes, division, partIndex);
            const nextRichNote = getRichNote(divisionedNotes, division + BEAT_LENGTH, partIndex);
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            if (!richNote.scale) {
                console.error("No scale for richNote", richNote);
                continue;
            }

            const prevRichNote = getRichNote(divisionedNotes, division - BEAT_LENGTH, partIndex);

            const gTone1 = globalSemitone(richNote.note);
            const gTone2 = globalSemitone(nextRichNote.note);
            let gTone0 = prevRichNote ? globalSemitone(prevRichNote.note) : null;
            if (gTone0 && prevRichNote && prevRichNote.duration != BEAT_LENGTH) {
                // FIXME: prevRichNote is not the previous note. We cannot use it to determine the previous note.
                gTone0 = null;
            }
            const nacParams = {
                gTone0,
                gTone1,
                gTone2,
                scale: richNote.scale,
                gToneLimits: gToneLimitsForThisBeat[partIndex],
            }

            // Try to find a way to ad 8th notes this beat.

            const nonChordToneChoiceFuncs: {[key: string]: Function} = {
                passingTone: () => passingTone(nacParams),
                neighborTone: () => neighborTone(nacParams),
                suspension: () => suspension(nacParams),
                retardation: () => retardation(nacParams),
                appogiatura: () => appogiatura(nacParams),
                escapeTone: () => escapeTone(nacParams),
                anticipation: () => anticipation(nacParams),
                neighborGroup: () => neighborGroup(nacParams),
                pedalPoint: () => pedalPoint(nacParams),
            }

            let iterations = 0;
            let nonChordTone = null;
            const usedChoices = new Set();
            while (true) {
                iterations++;
                if (iterations > 1000) {
                    throw new Error("Too many iterations in 8th note generation");
                }

                let nonChordToneChoices: {[key: string]: NonChordTone} = {}
                for (const key of Object.keys(nonChordToneChoiceFuncs)) {
                    const setting = params.nonChordTones[key];
                    if (!setting || !setting.enabled) {
                        continue;
                    }
                    const choice = nonChordToneChoiceFuncs[key]();
                    if (choice) {
                        nonChordToneChoices[key] = choice;
                    }
                }

                if (partIndex != 3) {
                    delete nonChordToneChoices.pedalPoint;
                }

                let usingKey = null;
                const availableKeys = Object.keys(nonChordToneChoices).filter(key => !usedChoices.has(key));
                if (availableKeys.length == 0) {
                    break;
                }
                for (let key in nonChordToneChoices) {
                    if (usedChoices.has(key)) {
                        continue;
                    }
                    if (nonChordToneChoices[key]) {
                        nonChordTone = nonChordToneChoices[key];
                        usingKey = key;
                        break;
                    }
                    if (!nonChordTone) {
                        continue;
                    }
                }
                if (!nonChordTone) {
                    break;
                }
                // We found a possible non chord tone
                // Now we need to check voice leading from before and after
                const nonChordToneNotes: Note[] = [...thisNotes];

                if (nonChordTone.strongBeat) {
                    nonChordToneNotes[partIndex] = nonChordTone.note;
                }
                const tensionResult = getTension({
                    fromNotesOverride: prevNotes,
                    toNotes: nonChordToneNotes,
                    currentScale: currentScale,
                    params: params,
                })
                let tension = 0;
                tension += tensionResult.doubleLeadingTone;
                tension += tensionResult.parallelFifths;
                tension += tensionResult.spacingError;
                if (tension < 10) {
                    break;
                }
                console.log("Tension too high for non chord tone", tension, nonChordTone, tensionResult, usingKey);
                usedChoices.add(usingKey);
            }

            if (!nonChordTone) {
                continue;
            }

            const result = addNoteBetween(nonChordTone, division, division + BEAT_LENGTH, partIndex, divisionedNotes);
            if (!result) {
                continue;
            }
            break;
        }
    }
}

