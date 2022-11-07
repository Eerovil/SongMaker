import { Note } from "musictheoryjs";
import { Logger } from "./mylogger";
import { Chord, globalSemitone, MusicParams, semitoneDistance } from "./utils";

export type InversionResult = {
    gToneDiffs: Array<Array<number>>,
    notes: {[key: number]: Note},
    rating: number,
    inversionName: string,
}

export type SimpleInversionResult = {
    notes: Array<Note>,
    rating: number,
    inversionName: string,
}

export const getInversions = (chord: Chord, prevNotes: Array<Note>, beat: number, params: MusicParams, logger: Logger, beatsUntilLastChordInSong: number): Array<SimpleInversionResult> => {
    // Return Notes in the Chord that are closest to the previous notes
    // For each part

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

    // Add a result for each possible inversion
    const ret: Array<SimpleInversionResult> = [];

    let lastBeatGlobalSemitones = [...startingGlobalSemitones]
    if (prevNotes) {
        lastBeatGlobalSemitones = prevNotes.map(note => globalSemitone(note));
    }

    if (!chord) {
        return [];
    }

    if (chord) {
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

        let inversionNames = ["root", "first-root", "first-root-lower", "first-third", "first-fifth", "first-fifth-lower", "second"];
        if (chord.notes.length > 3) {
            inversionNames = ["root", "first", "second", "third"];
        }

        for (let skipFifthIndex = 0; skipFifthIndex < 2; skipFifthIndex++) {
        for (let octaveOffset=0; octaveOffset<2; octaveOffset++) {
        for (let inversionIndex=0; inversionIndex<inversionNames.length; inversionIndex++) {
            const skipFifth = skipFifthIndex == 1;

            // We try each inversion. Which is best?
            const inversion = inversionNames[inversionIndex];
            if (beatsUntilLastChordInSong < 2) {
                if (!inversion.startsWith('root')) {
                    continue; // Don't do anything but root position on the last chord
                }
            }

            const inversionResult: InversionResult = {
                gToneDiffs: [],
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

                // Store values for next step
                inversionResult.gToneDiffs[partIndex] = [lastBeatGlobalSemitones[partIndex], gTone];
                minSemitone = gTone;
            }
            const notes = [];
            if (inversionResult.notes[0]) {
                notes.push(inversionResult.notes[0]);
            }
            if (inversionResult.notes[1]) {
                notes.push(inversionResult.notes[1]);
            }
            if (inversionResult.notes[2]) {
                notes.push(inversionResult.notes[2]);
            }
            if (inversionResult.notes[3]) {
                notes.push(inversionResult.notes[3]);
            }
            ret.push({
                notes: notes,
                inversionName: inversion,
                rating: 0,
            });
        }
        }
        }
    }
    logger.print("newVoiceLeadingNotes: ", chord.toString(), " beat: ", beat);

    return ret;
}
