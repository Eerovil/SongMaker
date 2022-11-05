import { Note, Scale, ScaleTemplates } from "musictheoryjs";
import { Logger } from "./mylogger";
import { globalSemitone, majScaleDifference, MusicParams, Nullable } from "./utils";

export const getTension = (passedFromNotes: Array<Note>, toNotes: Array<Note>, currentScale: Scale, beatsUntilLastChordInCadence: number, params: MusicParams, logger: Logger) => {
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    let wantedFunction = null;
    if (beatsUntilLastChordInCadence == 3) {
        wantedFunction = "sub-dominant";
    }
    if (beatsUntilLastChordInCadence == 2) {
        wantedFunction = "dominant";
    }
    if (beatsUntilLastChordInCadence == 1) {
        wantedFunction = "tonic";
    }

    let fromNotes;
    if (passedFromNotes.length == 0) {
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
            // How bad is the scale difference?
            const goodSemitones = [];
            let start = 0;
            for (const interval of currentScale.template) {
                goodSemitones.push(start + interval);
                start += interval;
            }
            const candidateScales: Array<number> = []
            for (let scaleCandidate = 0; scaleCandidate < 12; scaleCandidate++) {
                const scaleSemitones = goodSemitones.map(semitone => (semitone + scaleCandidate) % 12);
                if (toSemitones.every(semitone => scaleSemitones.includes(semitone))) {
                    candidateScales.push(scaleCandidate);
                }
            }
            let closestScale = candidateScales[0];
            let closestScaleDistance = 100;
            if (closestScale) {
                closestScaleDistance = majScaleDifference(closestScale, currentScale.notes[0].semitone);
                for (const scaleCandidate of candidateScales) {
                    const scaleDistance = majScaleDifference(scaleCandidate, currentScale.notes[0].semitone);
                    if (scaleDistance < closestScaleDistance) {
                        closestScale = scaleCandidate;
                        closestScaleDistance = scaleDistance;
                    }
                }
            }
            let multiplier = 1;
            if (closestScaleDistance > 1) {
                multiplier = 4;
            }
            if (beatsUntilLastChordInCadence < 4) {
                // No scale change in the last 4 beats
                multiplier = 2000;
            }
            if (passedFromNotes.length == 0) {
                // No scale change in the first chord
                multiplier = 2000;
            }

            // TODO TEMP
            // multiplier = 2000;
            logger.log("Scale: ", closestScale, "d: ", closestScaleDistance, "c: ", toChordString);
            logger.log("differingNotesNotInScale: ", notesNotInScale)
            tension += notesNotInScale.length * multiplier;

            // Scale change
            newScale = new Scale({
                key: closestScale,
                octave: 5,
                template: ScaleTemplates[params.scaleTemplate]
            });

            if (tension > 100) {
                // Quick return, this chord sucks
                return { tension, newScale };
            }
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
        0: {
            0: 1,
            1: 1,  // As subdominant leading ahead 1
        },
        1: {
            // D: Leading to closest T notes (also is SD that leads to itself...)
            [-1]: 1,
            1: 1,
        },
        2: {
            [-1]: 1,
            0: 1,
            1: 1,
        },
        3: {
            // SD: Leading to closest D notes
            [-1]: 0.5,
            1: 1,
        },
        4: {
            // D: Leading to closest T notes
            [-1]: 0.5,
            0: 1,
            1: 0.5,
        },  // Dominant (5th, 7th) is leading strongly
        5: {
            // SD: Leading to closest D notes
            [-1]: 1,
            1: 1,
        },
        6: {
            // D: Leading to closest T notes
            [-2]: 1,
            [-1]: 0.5,
            0: -1,  // This D DOES NOT LIKE TO STAY
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
            const nextGTone = fromGlobalSemitone + parseInt(relativeDiff)
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
            tension -= resolvedLeads[toGlobalSemitone] * 1.5;
            logger.log("Tension from lead: ", toGlobalSemitone, -resolvedLeads[toGlobalSemitone], " : ", wantedFunction);
            continue;
        }

    }
    logger.log("tension: ", tension);

    // if (toNotes[0].semitone == currentScale.notes[0].semitone) {
    //     logger.log("Lead tension from ", fromChordString, " to ", toChordString, "(", currentScale.toString(), ")", " is ", (tensionBeforelead + tension).toFixed(2));
    // }

    // if (fromChord.chordType == "sus4") {
    //     logger.log("Lead tension from ", fromChordString, " to ", toChordString, "(", currentScale.toString(), ")", " is ", (tensionBeforelead + tension).toFixed(2));
    // }

    const prevWideness = Math.max(...fromGlobalSemitones) - Math.min(...fromGlobalSemitones);
    const nextWideness = Math.max(...toGlobalSemitones) - Math.min(...toGlobalSemitones);

    logger.log("tension: ", tension);

    // For each part, check the interval
    const intervalWeights = [
        0,
        0.2,
        0.2,
        0,
    ]
    for (let i=0; i<fromNotes.length; i++) {
        const fromNote = fromNotes[i];
        const toNote = toNotes[i];
        const interval = Math.abs(
            globalSemitone(fromNote) - globalSemitone(toNote)
        );
        if (interval >= 6) {
            tension += 0.2
        }
        logger.log("Tension from interval: ", interval, intervalWeights[i]);
    }
    logger.log("tension: ", tension);

    return { tension, newScale };
}
