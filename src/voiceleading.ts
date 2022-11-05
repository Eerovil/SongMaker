import { Note } from "musictheoryjs";
import { Logger } from "./mylogger";
import { Chord, globalSemitone, MusicParams, semitoneDistance } from "./utils";

export const partialVoiceLeading = (chord: Chord, prevNotes: Array<Note>, beat: number, params: MusicParams, logger: Logger): Array<{tension: number, notes: Array<Note>, inversionName: string}> => {
    // Return Notes in the Chord that are closest to the previous notes
    // For each part
    const beatsPerCadence = 4 * params.barsPerCadence;
    const ret = [];

    const p1Note = params.parts[0].note || "F4";
    const p2Note = params.parts[1].note || "C4";
    const p3Note = params.parts[2].note || "A3";
    const p4Note = params.parts[3].note || "C3";

    const startingGlobalSemitones = [
        globalSemitone(new Note(p1Note)),
        globalSemitone(new Note(p2Note)),
        globalSemitone(new Note(p3Note)),
        globalSemitone(new Note(p4Note)),
    ]

    const semitoneLimits = [
        [startingGlobalSemitones[0] + -12, startingGlobalSemitones[0] + 12],
        [startingGlobalSemitones[1] + -12, startingGlobalSemitones[1] + 12],
        [startingGlobalSemitones[2] + -12, startingGlobalSemitones[2] + 12],
        [startingGlobalSemitones[3] + -12, startingGlobalSemitones[3] + 12],
    ]
    logger.log(semitoneLimits)

    let lastBeatGlobalSemitones = [...startingGlobalSemitones]
    if (prevNotes) {
        lastBeatGlobalSemitones = prevNotes.map(note => globalSemitone(note));
    }

    if (!chord) {
        return [];
    }

    let tension = 0;

    if (chord) {
        let beatsUntilLastChordInCadence = (beatsPerCadence - beat) % beatsPerCadence
        let cadenceEnding = beatsUntilLastChordInCadence >= beatsPerCadence - 1 || beatsUntilLastChordInCadence == 0
        logger.log("cadenceEnding: ", cadenceEnding, "beatsUntilLastChordInCadence", beatsUntilLastChordInCadence)

        // For each beat, we try to find a good matching semitone for each part.

        // Rules:
        // With	root position triads: double the root. 

        // With first inversion triads: double the root or 5th, in general. If one needs to double 
        // the 3rd, that is acceptable, but avoid doubling the leading tone.

        // With second inversion triads: double the fifth. 

        // With  seventh  chords:  there  is  one voice  for  each  note,  so  distribute as  fits. If  one 
        // must omit a note from the chord, then omit the 5th.

        const firstInterval = semitoneDistance(chord.notes[0].semitone, chord.notes[1].semitone)
        const thirdIsGood = firstInterval == 3 || firstInterval == 4;
        logger.log("notes: ", chord.notes.map(n => n.toString()));

        // Depending on the inversion and chord type, we're doing different things

        type Direction = "up" | "down" | "same";

        let inversionNames = ["root", "first-root", "first-root-lower", "first-third", "first-fifth", "first-fifth-lower", "second"];
        if (chord.notes.length > 3) {
            inversionNames = ["root", "first", "second", "third"];
        }

        // Add a result for each possible inversion
        type InversionResult = {
            notes: {[key: number]: Note},
            rating: number,
            inversionName: string,
        }
        const inversionResults: Array<InversionResult> = [];

        for (let skipFifthIndex = 0; skipFifthIndex < 2; skipFifthIndex++) {
        for (let octaveOffset=0; octaveOffset<2; octaveOffset++) {
        for (let inversionIndex=0; inversionIndex<inversionNames.length; inversionIndex++) {
            const skipFifth = skipFifthIndex == 1;
            const directions: { [key: number ]: Direction} = {};
            const directionIsGood = (direction: Direction) => {
                const downCount = Object.values(directions).filter(d => d == "down").length;
                const upCount = Object.values(directions).filter(d => d == "up").length;

                // 3 here because the "direction" we're checking is not an unknown
                const unknownCount = 3 - Object.values(directions).length;
                if (direction == "same") {
                    // Same is not good if it was "supposed" to be an up or down
                    // to balance things out
                    if (downCount - upCount > 1) {
                        // Too many downs, this should have been an up.
                        return false;
                    }
                    if (upCount - downCount > 1) {
                        // Too many ups, this should have been a down.
                        return false;
                    }
                    if (upCount == 0 && downCount == 0) {
                        // Can't have all of them be same
                        return false;
                    }
                    // Otherwise, all is probably fine
                    return true;
                }
                if (direction == "down") {
                    if (downCount == 0) {
                        // First down is always good
                        return true;
                    }
                    if (downCount == 1) {
                        if (upCount > 0 || unknownCount > 0) {
                            // Two downs is allowed if there is at least 1 up OR unknown
                            return true;
                        }
                    }
                    // More than two is not good
                    return false;
                }
                if (direction == "up") {
                    if (upCount == 0) {
                        return true;
                    }
                    if (upCount == 1) {
                        if (downCount > 0 || unknownCount > 0) {
                            // Two ups is allowed if there is at least 1 down OR unknown
                            return true;
                        }
                    }
                    // More than two is not good
                    return false;
                }
            }
            const inversionResult: InversionResult = {
                notes: {},
                rating: 0,
                inversionName: inversionNames[inversionIndex],
            };
            if (octaveOffset != 0) {
                inversionResult.inversionName += "-octave" + octaveOffset;
            }
            if (skipFifth) {
                inversionResult.inversionName += "-skipFifth";
            }

            const addPartNote = (partIndex: number, note: Note) => {
                inversionResult.notes[partIndex] = new Note({
                    semitone: note.semitone,
                    octave: 1  // dummy
                });
            }

            // We try each inversion. Which is best?
            const inversion = inversionNames[inversionIndex];

            logger.log("inversion: ", inversion, "octaveOffset: ", octaveOffset, "skipFifth: ", skipFifth);
            let partToIndex: { [key: number]: number } = {};
            if (chord.notes.length == 3) {
                if (inversion == 'root') {
                    partToIndex[0] = 2;
                    partToIndex[1] = 1;
                    partToIndex[2] = 0;
                    partToIndex[3] = 0;  // Root is doubled
                } else if (inversion == 'first-root') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 0;  // Root is doubled
                } else if (inversion == 'first-root-lower') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 0;
                    partToIndex[2] = 2;
                    partToIndex[3] = 1;
                    if (!thirdIsGood) {
                        logger.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'first-third') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 1;  // Third is doubled
                    if (!thirdIsGood) {
                        logger.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'first-fifth') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 2;  // Fifth is doubled
                } else if (inversion == 'first-fifth-lower') {
                    partToIndex[0] = 2;
                    partToIndex[1] = 0;
                    partToIndex[2] = 2;
                    partToIndex[3] = 1;
                    if (!thirdIsGood) {
                        logger.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'second') {
                    partToIndex[0] = 1;
                    partToIndex[1] = 0;
                    partToIndex[2] = 2;
                    partToIndex[3] = 2;  // Fifth is doubled
                } else {
                    throw "No inversion?"
                }
            } else {
                if (inversion == 'root') {
                    partToIndex[0] = 3;
                    partToIndex[1] = 2;
                    partToIndex[2] = 1;
                    partToIndex[3] = 0;
                } else if (inversion == 'first') {
                    partToIndex[0] = 0;
                    partToIndex[1] = 3;
                    partToIndex[2] = 2;
                    partToIndex[3] = 1;
                    if (!thirdIsGood) {
                        logger.log("thirdIsGood is false, skipping ", inversion);
                        continue;
                    }
                } else if (inversion == 'second') {
                    partToIndex[0] = 1;
                    partToIndex[1] = 0;
                    partToIndex[2] = 3;
                    partToIndex[3] = 2;
                } else if (inversion == 'third') {
                    partToIndex[0] = 2;
                    partToIndex[1] = 1;
                    partToIndex[2] = 0;
                    partToIndex[3] = 3;
                }
            }

            const indexCounts: {[key: number]: number} = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
            };
            for (let partIndex=0; partIndex<4; partIndex++) {
                indexCounts[partToIndex[partIndex]]++;
            }
            let convertFifthTo;
            if (indexCounts[0] == 1) {
                convertFifthTo = 0;
            } else if (indexCounts[1] == 1) {
                convertFifthTo = 1;
            }

            for (let partIndex=0; partIndex<4; partIndex++) {
                if (skipFifth && partToIndex[partIndex] == 2 && convertFifthTo) {
                    partToIndex[partIndex] = convertFifthTo;
                } 
                if (inversionResult.notes[partIndex]) {
                    // This part is already set
                    continue;
                }
                addPartNote(partIndex, chord.notes[partToIndex[partIndex]]);
            }
            // Lastly, we select the octaves
            let minSemitone = 0;
            for (let partIndex=3; partIndex>=0; partIndex--) {
                const note = inversionResult.notes[partIndex];
                let gTone = globalSemitone(note);

                let i=0;
                while (gTone < semitoneLimits[partIndex][0] || gTone < minSemitone) {
                    i++;
                    if (i > 1000) {
                        debugger;
                        throw "Too many iterations"
                    }
                    note.octave += 1;
                    gTone = globalSemitone(note);
                    if (gTone >= semitoneLimits[partIndex][0] && gTone >= minSemitone) {
                        // We're about to break. Check if we should go up one more
                        if (gTone + 12 <= semitoneLimits[partIndex][1]) {
                            let distance = Math.abs(gTone - lastBeatGlobalSemitones[partIndex])
                            let octaveUpDistance = Math.abs(gTone + 12 - lastBeatGlobalSemitones[partIndex])
                            if (octaveUpDistance < distance) {
                                note.octave += 1;
                            }
                        } else {
                            logger.log("Can't go up one more: ", gTone, semitoneLimits[partIndex][1]);
                            if (partIndex == 3 && octaveOffset > 0) {
                                note.octave += octaveOffset;
                            }
                        }
                        gTone = globalSemitone(note);
                        minSemitone = gTone;
                    }
                }

                // Finally, rate the result.

                // Check the direction for a selected gTone, (is it allowed)
                let distance = gTone - lastBeatGlobalSemitones[partIndex]
                let direction: Direction;

                if (distance > 0) {
                    direction = "up";
                    if (!directionIsGood("up")) {
                        logger.log("note ", note.toString(), "is not good because direction is up from ", new Note({semitone: lastBeatGlobalSemitones[partIndex] % 12}).toString())
                        inversionResult.rating -= 1;
                    }
                } else if (distance < 0) {
                    direction = "down";
                    if (!directionIsGood("down")) {
                        logger.log("note ", note.toString(), "is not good because direction is down from", new Note({semitone: lastBeatGlobalSemitones[partIndex] % 12}).toString())
                        inversionResult.rating -= 1;
                    }
                } else {
                    direction = "same";
                    if (!directionIsGood("same")) {
                        logger.log("note ", note.toString(), "is not good because direction is same from", new Note({semitone: lastBeatGlobalSemitones[partIndex] % 12}).toString())
                        inversionResult.rating -= 1;
                    }
                }
                directions[partIndex] = direction

                minSemitone = gTone;
            }
            inversionResults.push(inversionResult);

            // Check for parallel motion (if this note had a 1st, 5th or 8th with another note
            // and it still has it, then it's parallel motion)
            for (let partIndex=0; partIndex<4; partIndex++) {
                const prevNote: number = lastBeatGlobalSemitones[partIndex];
                const currentNote: number = globalSemitone(inversionResult.notes[partIndex]);
                if (prevNote == currentNote) {
                    continue;
                }
                for (let partIndex2=0; partIndex2<4; partIndex2++) {
                    if (partIndex == partIndex2) {
                        continue;
                    }
                    const prevNote2 = lastBeatGlobalSemitones[partIndex2];
                    const currentNote2 = globalSemitone(inversionResult.notes[partIndex2]);
                    if (prevNote2 == currentNote2) {
                        continue;
                    }
                    let interval;
                    if (prevNote == prevNote2) {
                        interval = 0;
                    }
                    if (Math.abs(prevNote - prevNote2) == 5) {
                        interval = 5;
                    }
                    if (Math.abs(prevNote - prevNote2) == 7) {
                        interval = 7;
                    }
                    if (Math.abs(prevNote - prevNote2) == 12) {
                        interval = 12;
                    }
                    if (interval != undefined) {
                        if (Math.abs(currentNote - currentNote2) == interval) {
                            logger.log("parallel motion from ", new Note({semitone: prevNote % 12}).toString(), " to ", new Note({semitone: currentNote % 12}).toString(), " and from ", new Note({semitone: prevNote2 % 12}).toString(), " to ", new Note({semitone: currentNote2 % 12}).toString())
                            inversionResult.rating -= 1;
                        }
                    }
                }
            }

            logger.log(directions);
        }
        }
        }

        // Sort the results by rating
        inversionResults.sort((a, b) => b.rating - a.rating);

        const bestInversions = inversionResults.slice(0, 7);
        for (let bestInversion of bestInversions) {
            tension = bestInversion.rating * -1;
            const notes = []
            notes[0] = bestInversion.notes[0];
            notes[1] = bestInversion.notes[1];
            notes[2] = bestInversion.notes[2];
            notes[3] = bestInversion.notes[3];
            ret.push({
                tension: tension,
                notes: notes,
                inversionName: bestInversion.inversionName,
            })
        }

    }
    logger.print("newVoiceLeadingNotes: ", chord.toString(), " beat: ", beat);

    return ret;
}
