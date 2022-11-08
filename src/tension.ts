import { Note, Scale } from "musictheoryjs";
import { Logger } from "./mylogger";
import { BEAT_LENGTH, DivisionedRichnotes, globalSemitone, gToneString, majScaleDifference, MusicParams, Nullable, semitoneDistance } from "./utils";

export const getTension = (divisionedNotes: DivisionedRichnotes, toNotes: Array<Note>, currentScale: Scale, beatsUntilLastChordInCadence: number, params: MusicParams, logger: Logger, beatsUntilLastChordInSong: number, inversionName: string) => {
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    let wantedFunction = null;
    if (beatsUntilLastChordInCadence == 4) {
        wantedFunction = "sub-dominant";
    }
    if (beatsUntilLastChordInCadence == 3) {
        wantedFunction = "dominant";
    }
    if (beatsUntilLastChordInCadence < 3) {
        wantedFunction = "tonic";
        if (!inversionName.startsWith('root')) {
            return {tension: 100, wantedFunction};
        }
    }

    const latestDivision = Math.max(...Object.keys(divisionedNotes).map((x) => parseInt(x, 10)));
    let tmp : Array<Note | null> = [null, null, null, null];
    for (const richNote of (divisionedNotes[latestDivision] || [])) {
        tmp[richNote.partIndex] = richNote.note;
    }
    const passedFromNotes = [...tmp].filter(Boolean);
    tmp = [null, null, null, null];
    for (const richNote of (divisionedNotes[latestDivision - BEAT_LENGTH] || [])) {
        tmp[richNote.partIndex] = richNote.note;
    }
    const prevPassedFromNotes = [...tmp].filter(Boolean);

    let fromNotes;
    if (passedFromNotes.length < 4) {
        fromNotes = toNotes;
    } else {
        fromNotes = passedFromNotes;
    }
    const toChordString = toNotes.map(n => n.toString()).join(', ');
    const fromChordString = fromNotes.map(n => n.toString()).join(', ');

    const noteCount = Math.max(fromNotes.length, toNotes.length);
    // Compare the notes. Each differing note increases the tension a bit
    let tension = 0;
    const fromSemitones = fromNotes.map(note => note.semitone);
    const toSemitones = toNotes.map(note => note.semitone);
    const fromGlobalSemitones = fromNotes.map(note => globalSemitone(note));
    const toGlobalSemitones = toNotes.map(note => globalSemitone(note));
    const differingNotes = toSemitones.filter(semitone => !fromSemitones.includes(semitone));
    const sameNotes = toSemitones.filter(semitone => fromSemitones.includes(semitone));

    logger.log("fromGlobalSemitones: ", fromGlobalSemitones.map(s => gToneString(s)));
    logger.log("toGlobalSemitones: ", toGlobalSemitones.map(s => gToneString(s)));

    if (differingNotes.length > 0) {
        tension += 0.1;
        if (differingNotes.length > 1) {
            tension += 0.3;
            if (differingNotes.length > 2) {
                tension += 0.5;
                if (differingNotes.length > 3) {
                    tension += 0.5;
                }
            }
        }
    }

    tension += differingNotes.length * (1 / noteCount) * 0.5;
    // tension += sameNotes.length * (1 / noteCount) * -0.5;
    logger.log("Differing notes: ", tension);
    logger.log("tension: ", tension);

    // If the notes are not in the current scale, increase the tension
    let notesNotInScale: Array<number> = []
    let newScale: Nullable<Scale> = null;
    if (currentScale) {
        const scaleSemitones = currentScale.notes.map(note => note.semitone);
        notesNotInScale = toSemitones.filter(semitone => !scaleSemitones.includes(semitone));
        if (notesNotInScale.length > 0) {
            // Quick return, this chord sucks
            return { tension, newScale };
        }
    }
    logger.log("tension: ", tension);

    // Figure out where the fromChord resolves to. If it resolves to the toChord, decrease the tension
    // const fromIntervals = fromSemitones.map((semitone, index) => {
    //     if (index < fromSemitones.length - 1) {
    //         const nextSemitone = fromSemitones[(index + 1)];
    //         return ((nextSemitone - semitone) + 24) % 12;
    //     } else {
    //         return null;
    //     }
    // }).filter(Boolean);
    // Does fromChord have any tensioning intervals?
    // for (let i = 0; i < fromIntervals.length; i++) {
    //     // Seconds want to "grow" by one semitone
    //     if (fromIntervals[i] === 2) {
    //         const goodTones = [fromSemitones[i] - 1, fromSemitones[i + 1] + 1].map(semitone => (semitone + 12) % 12);
    //         if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
    //             tension -= 0.5;
    //         }
    //     }
    //     // Perfect Fourths want to "shrink" by one semitones
    //     if (fromIntervals[i] === 5) {
    //         const goodTones = [fromSemitones[i] + 1, fromSemitones[i + 1] - 1].map(semitone => (semitone + 12) % 12);
    //         if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
    //             tension -= 0.5;
    //         }
    //     }
    // }
    for (let i = 0; i < toGlobalSemitones.length; i++) {
        for (let j = i; j < toGlobalSemitones.length; j++) {
            const interval = Math.abs(toGlobalSemitones[i] - toGlobalSemitones[j]);
            if (interval === 1) {
                tension += 2;
                logger.log("interval 1 causing tension")
            }
            if (interval === 2) {
                tension += 0.5;
                logger.log("interval 2 causing tension")
            }
            if (interval === 6) {
                tension += 1.5;
                logger.log("interval 6 causing tension")
            }
        }
    }
    logger.log("tension: ", tension);

    if (passedFromNotes.length == 0) {
        return { tension, newScale };
    }

    // // If chord has not 5th with base, increase tension
    // if (toIntervals.length > 1 && toIntervals[0] + toIntervals[1] !== 7) {
    //     tension += 0.5;
    // }

    const semitoneScaleIndex: { [key: number]: number } = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6,
    }


    // Major / Minor
    // C 0: Tonic
    // D 1: SubDominant
    // E 2: Tonic
    // F 3: SubDominant
    // G 4: Dominant
    // A 5: Tonic
    // B 6: Dominant

    // I notes:
    // 0, 2, 4
    // ii notes:
    // 1, 3, 5
    // iii notes:
    // 2, 4, 6
    // IV notes:
    // 3, 5, 0
    // V notes:
    // 4, 6, 1
    // vi notes:
    // 5, 0, 2
    // viio notes:
    // 6, 1, 3

    // -> Tonic notes =       0,    2,    4
    // -> SubDominant notes = 0, 1,    3,    5
    // -> Dominant notes =       1,    3, 4,   6

    // Use relative diffs here for easy comparison
    let chordLeads: { [key: number]: { [key: number]: number } } = {
        0: {  // C
            [-1]: 0,
            0: 1,
            1: 0,
        },
        1: {  // D
            [-1]: 1,
            0: -0.5,
            1: 0.5,
        },
        2: {  // E
            [-1]: 0,
            0: 1,
            1: 0,
        },
        3: {  // F
            [-1]: 1,
            0: -0.5,
            1: 0.5,
        },
        4: {  // G
            [-1]: 0,
            0: 1,
            1: 0,
        },
        5: {  // A
            [-1]: 1,
            0: -0.5,
            1: 0,
        },
        6: {  // B
            [-1]: 0,
            0: -1,
            1: 2,
        },
    }

    let tensionBeforelead = tension;
    const resolvedLeads: { [key: number]: number } = {};
    let availableLeads: { [key: number]: { [key: number]: number } } = {};

    for (const fromGlobalSemitone of fromGlobalSemitones) {
        // Each note may be "leading" somewhere.
        const fromSemitone = (fromGlobalSemitone + 12) % 12;
        const scaleIndex: number = semitoneScaleIndex[fromSemitone];
        if (scaleIndex == undefined) {
            // Out of scale. This note leads to 1 semitone up or down
            resolvedLeads[fromGlobalSemitone + 1] = 1;
            resolvedLeads[fromGlobalSemitone - 1] = 1;
            continue;
        }
        const leadsTo: { [key: number]: number } =  chordLeads[scaleIndex];
        availableLeads[scaleIndex] = chordLeads[scaleIndex];

        for (const relativeDiff in leadsTo) {
            const relativeDiffNum = parseInt(relativeDiff);
            const nextScaleIndex = (scaleIndex + relativeDiffNum + 7) % 7;
            let semitoneDiff = semitoneDistance(currentScale.notes[nextScaleIndex].semitone, fromSemitone);
            if (relativeDiffNum < 0) {
                semitoneDiff = -semitoneDiff;
            }
            const nextGTone = fromGlobalSemitone + semitoneDiff
            resolvedLeads[nextGTone] = resolvedLeads[nextGTone] || 0
            resolvedLeads[nextGTone] += leadsTo[relativeDiff];

            // // Add leads to all octaves
            // for (let i=-12*5; i<12*5; i+=12) {
            //     resolvedLeads[nextGTone+i] = resolvedLeads[nextGTone+i] || 0
            //     resolvedLeads[nextGTone+i] += leadsTo[relativeDiff];
            // }
        }
    }

    logger.log(
        "availableLeads: ", availableLeads,
        "chords: ", fromSemitones.map(s => semitoneScaleIndex[s]), " - ",
        toSemitones.map(s => semitoneScaleIndex[s]),
        " - resolvedLeads: ", resolvedLeads,
    )

    const handledSemitones: number[] = []
    for (const toGlobalSemitone of toGlobalSemitones) {
        const toSemitone = (toGlobalSemitone + 12) % 12;
        if (handledSemitones.includes(toSemitone)) {
            continue;
        }
        handledSemitones.push(toSemitone);

        const scaleIndex: number = semitoneScaleIndex[toSemitone];

        if (wantedFunction) {
            let wantedScaleIndexes;
            if (wantedFunction == "sub-dominant") {
                // Modify weights so that all lead to subdominants (0, 1, 3, 5)
                wantedScaleIndexes = [0, 1, 3, 5];
            }
            if (wantedFunction == "dominant") {
                // Modify weights so that all lead to dominants (1, 3, 4, 6)
                wantedScaleIndexes = [1, 3, 4, 6];
            }
            if (wantedFunction == "tonic") {
                // Modify weights so that all lead to tonic (0, 2, 4)
                wantedScaleIndexes = [0, 2, 4];
            }
            
            if (wantedScaleIndexes.indexOf(parseInt(scaleIndex as any)) === -1) {
                tension += 2;
                logger.log("Tension from wanted function: ", scaleIndex, " : ", wantedFunction);
                if (beatsUntilLastChordInSong < 3) {
                    tension += 5;
                }
                continue;
            } else {
                tension -= 1;
                logger.log("Reduced tension from wanted function: ", scaleIndex, " : ", wantedFunction);
            }
        }

        const leadsTo: { [key: number]: number } = availableLeads[scaleIndex];
        if (leadsTo && leadsTo[0]) {
            // This note is leading to itself, with some tension.
            tension -= leadsTo[0];
            logger.log("Tension from lead to itself: ", scaleIndex, -leadsTo[0], " : ", wantedFunction);
            continue;
        }

        if (resolvedLeads[toGlobalSemitone] !== undefined) {
            tension -= resolvedLeads[toGlobalSemitone] * params.leadingWeight;
            logger.log("Tension from lead: ", toGlobalSemitone, -resolvedLeads[toGlobalSemitone], " : ", wantedFunction);
            continue;
        }

    }
    logger.log("tension: ", tension);
    const leadingToneSemitone = currentScale.notes[0].semitone + 11;
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const fromGlobalSemitone = fromGlobalSemitones[i];
        if (fromGlobalSemitone % 12 == leadingToneSemitone) {
            if (toGlobalSemitones[i] != fromGlobalSemitone + 1) {
                tension += 10;
                if (i == 1 || i == 2) {
                    // not as bad
                    tension -= 7;
                }
                logger.log("Leading tone not handled, increasing tension: part ", i);
            }
        }
    }
    logger.log("tension: ", tension);

    let leadingToneCount = 0;
    for (const toGlobalSemitone of toGlobalSemitones) {
        const scaleIndex: number = semitoneScaleIndex[(toGlobalSemitone + 12) % 12];
        if (scaleIndex == 6) {
            leadingToneCount++;
        }
    }
    if (leadingToneCount > 1) {
        logger.log("Multiple leading tones, increasing tension: ", leadingToneCount);
        tension += 10;
    }

    if (tension > 10) {
        return {tension, currentScale}
    }

    const directionTensionWeight = wantedFunction == null ? 1: 0.1;
    // Check directions
    const directionCounts = {
        "up": 0,
        "down": 0,
        "same": 0,
    }
    let rootBassDirection = null;
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const fromSemitone = fromGlobalSemitones[i];
        const toSemitone = toGlobalSemitones[i];
        const diff = toSemitone - fromSemitone;
        if (diff > 0) {
            directionCounts.up += 1;
        }
        if (diff < 0) {
            directionCounts.down += 1;
        }
        if (diff == 0) {
            directionCounts.same += 1;
        }
        if (diff != 0 && inversionName.startsWith('root')) {
            rootBassDirection = diff > 0 ? 'up' : 'down';
        }
    }
    // Root bass makes up for one up/down
    if (rootBassDirection == "up" && directionCounts.down > 0) {
        directionCounts.down -= 1;
    }
    if (rootBassDirection == "down" && directionCounts.up > 0) {
        directionCounts.up -= 1;
    }
    logger.log("rootBassDirection: ", rootBassDirection, " - directionCounts: ", directionCounts);
    if (directionCounts.up > 2 && directionCounts.down < 1) {
        tension += 10 * directionTensionWeight;
        logger.log("Tension from direction up: ", directionCounts);
        logger.log("tension: ", tension);
    }
    if (directionCounts.down > 2 && directionCounts.up < 1) {
        tension += 10 * directionTensionWeight;
        logger.log("Tension from direction down: ", directionCounts);
        logger.log("tension: ", tension);
    }

    if (tension > 10) {
        return {tension, currentScale}
    }


    // Parallel motion and hidden fifths
    for (let i=0; i<toGlobalSemitones.length; i++) {
        for (let j=i+1; j<toGlobalSemitones.length; j++) {
            if (fromGlobalSemitones[i] == toGlobalSemitones[i] && fromGlobalSemitones[j] == toGlobalSemitones[j]) {
                continue;
            }
            const interval = Math.abs(toGlobalSemitones[i] - toGlobalSemitones[j]);
            const intervalFrom = Math.abs(fromGlobalSemitones[i] - fromGlobalSemitones[j]);
            if (interval < 20 && interval % 12 == 7 || interval % 12 == 0) {
                // Possibly a parallel, contrary or hidden fifth/octave
                if (interval == intervalFrom) {
                    tension += 10;
                    logger.log("Tension from parallel motion: ", interval, " part ", i, " and ", j);
                    logger.log("tension: ", tension);
                    continue;
                }
                // Check if the interval is hidden
                const partIDirection = fromGlobalSemitones[i] - toGlobalSemitones[i];
                const partJDirection = fromGlobalSemitones[j] - toGlobalSemitones[j];
                if (Math.abs(partJDirection) > 2) {
                    // Upper part is making a jump
                    if (partIDirection < 0 && partJDirection < 0 || partIDirection > 0 && partJDirection > 0) {
                        tension += 10;
                        logger.log("Tension from hidden fifth: ", interval, " part ", i, " and ", j);
                        logger.log("tension: ", tension);
                        continue;
                    }
                }
            }
        }
    }
    if (tension > 10) {
        return {tension, currentScale}
    }


    // Spacing errors
    const part0ToPart1 = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[1]);
    const part1ToPart2 = Math.abs(toGlobalSemitones[1] - toGlobalSemitones[2]);
    const part2ToPart3 = Math.abs(toGlobalSemitones[2] - toGlobalSemitones[3]);
    if (part1ToPart2 > 12 || part0ToPart1 > 12 || part2ToPart3 > (12 + 7)) {
        tension += 10;
        logger.log("Tension from spacing error: ", part0ToPart1, part1ToPart2, part2ToPart3);
        logger.log("tension: ", tension);
    }
    if (tension > 10) {
        return {tension, currentScale}
    }

    // Overlapping error
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const fromGlobalSemitone = fromGlobalSemitones[i];
        const upperPartToGlobalSemitone = toGlobalSemitones[i-1];
        const lowerPartToGlobalSemitone = toGlobalSemitones[i+1];
        if (upperPartToGlobalSemitone != undefined && fromGlobalSemitone > upperPartToGlobalSemitone) {
            // Upper part is moving lower than where lower part used to be
            tension += 10;
            logger.log("Tension from overlapping error: ", gToneString(fromGlobalSemitone), gToneString(upperPartToGlobalSemitone));
            logger.log("tension: ", tension);
        }
        if (lowerPartToGlobalSemitone != undefined && fromGlobalSemitone < lowerPartToGlobalSemitone) {
            // Lower part is moving higher than where upper part used to be
            tension += 10;
            logger.log("Tension from overlapping error: ", gToneString(fromGlobalSemitone), gToneString(lowerPartToGlobalSemitone));
            logger.log("tension: ", tension);
        }
    }


    // Melody tension
    // Avoid jumps that are aug or 7th or higher
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const interval = Math.abs(fromGlobalSemitones[i] - toGlobalSemitones[i]);
        if (interval >= 10) {  // 7th == 10
            tension += 10;
            logger.log("Tension from melody interval: ", interval);
            logger.log("tension: ", tension);
            continue;
        }
        if (interval == 6 || interval == 8) // tritone (aug 4th) or aug 5th
        {
            tension += 5;
            logger.log("Tension from melody interval: ", interval);
            logger.log("tension: ", tension);
            continue;
        }
        if (interval == 7) {
            tension += 1;
            logger.log("Tension from melody interval: ", interval);
            logger.log("tension: ", tension);
            continue;
        }
        if (interval == 9) {
            tension += 2;
            logger.log("Tension from melody interval: ", interval);
            logger.log("tension: ", tension);
            continue;
        }
    }
    if (tension > 10) {
        return {tension, currentScale}
    }


    // 0 priimi
    // 1 pieni sekunti
    // 2 suuri sekunti
    // 3 pieni terssi
    // 4 suuri terssi
    // 5 kvartti
    // 6 tritonus
    // 7 kvintti
    // 8 pieni seksti
    // 9 suuri seksti
    // 10 pieni septimi
    // 11 suuri septimi
    // 12 oktaavi

    // Was there a jump before?
    if (prevPassedFromNotes && prevPassedFromNotes.length == 4) {
        const prevFromGlobalSemitones = prevPassedFromNotes.map((n) => globalSemitone(n));
        logger.log("prevFromGlobalSemitones:", prevFromGlobalSemitones.map((s) => gToneString(s)));
        for (let i=0; i<fromGlobalSemitones.length; i++) {
            const interval = Math.abs(prevFromGlobalSemitones[i] - fromGlobalSemitones[i]);
            if (interval >= 3) {
                // There was a jump. WE MUST GO BACK!
                // Basically the toGlobalSemitone must be between the prevFromGlobalSemitone and the fromGlobalSemitone
                // UNLESS we're outlining a triad.
                // This would mean that after a 4th up, we need to go up another 3rd
                const prevFromSemitone = prevFromGlobalSemitones[i];
                const fromSemitone = fromGlobalSemitones[i];
                const toSemitone = toGlobalSemitones[i];
    
                const directionMultiplier = fromSemitone > prevFromSemitone ? 1 : -1;
                const nextInterval = directionMultiplier * (toSemitone - fromSemitone);

                if (interval == 3) {
                    if (nextInterval == 4) {
                        // minor 3rd up, then maj third up. That's a root inversion minor chord!
                        continue;
                    }
                    if (nextInterval == 5) {
                        // minor 3rd up, then perfect 4th up. That's a first inversion major chord!
                        continue;
                    }
                }
                if (interval == 4) {
                    if (nextInterval == 3) {
                        // major 3rd up, then minor 3rd up. That's a root inversion major chord!
                        continue;
                    }
                    if (nextInterval == 5) {
                        // major 3rd up, then perfect 4th up. That's a first inversion minor chord!
                        continue;
                    }
                }
                if (interval == 5) {
                    if (nextInterval == 3) {
                        // perfect 4th up, then minor 3rd up. That's a second inversion minor chord!
                        continue;
                    }
                    if (nextInterval == 4) {
                        // perfect 4th up, then major 3rd up. That's a second inversion major chord!
                        continue;
                    }
                }

                // Higher than that, no triad is possible.
                if ((fromSemitone >= prevFromSemitone && toSemitone >= fromSemitone) || (fromSemitone <= prevFromSemitone && toSemitone <= fromSemitone)) {
                    // Not goinf back down/up...
                    if (interval <= 5) {
                        tension += 1;  // Not as bad
                    } else {
                        tension += 10;  // Terrible
                    }
                    logger.log("Tension from jump and no back: ", interval, " part ", i);
                    logger.log("tension: ", tension);
                } else {
                    // Going back down/up...
                    const backInterval = Math.abs(toSemitone - fromSemitone);
                    if (backInterval >= interval) {
                        // Going back too far...
                        if (interval <= 5) {
                            tension += 1;  // Not as bad
                        } else {
                            tension += 10;  // Terrible
                        }
                        logger.log("Tension from jump and too far back: ", interval, " part ", i);
                        logger.log("tension: ", tension);
                    }
                }
            }
        }
    }
    if (tension > 10) {
        return {tension, currentScale}
    }


    for (let i=0; i<toGlobalSemitones.length; i++) {
        const fromGlobalSemitone = fromGlobalSemitones[i];
        const toGlobalSemitone = toGlobalSemitones[i];
        let direction = toGlobalSemitone - fromGlobalSemitone;
        const baseNote = params.parts[i].note || "F4";
        const startingGlobalSemitone = globalSemitone(new Note(baseNote))
        const semitoneLimit = [startingGlobalSemitone + -12, startingGlobalSemitone + 12]

        let targetNote = semitoneLimit[1] - 4;
        targetNote -= i * 2;

        let targetNoteReached = false;
        for (const division in divisionedNotes) {
            const notes = divisionedNotes[division];
            for (const prevNote of notes.filter(richNote => richNote.partIndex == i)) {
                if (globalSemitone(prevNote.note) == targetNote) {
                    targetNoteReached = true;
                }
            }
        }
        if (targetNoteReached) {
            if (Math.abs(toGlobalSemitone - targetNote) < 2) {
                // We're close to the target note, let's NOT go there any more
                if (direction > 0) {
                    tension += 10;
                    logger.log("Tension from already reaching target note: ", direction, " part ", i);
                    logger.log("tension: ", tension);
                }
            }
        }
        break;
    }

    logger.log("tension: ", tension);
    if (tension > 100) {
        // Don't even log this crappy inversion
        logger.clear();
    }

    return { tension, newScale };
}
