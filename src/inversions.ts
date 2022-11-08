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
            if (skipFifth) {
                inversionResult.inversionName += "-skipFifth";
            }

            const addPartNote = (partIndex: number, note: Note) => {
                inversionResult.notes[partIndex] = new Note({
                    semitone: note.semitone,
                    octave: 1  // dummy
                });
            }

            logger.log("inversion: ", inversion, "skipFifth: ", skipFifth);
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
            // Lastly, we select the lowest possible octave for each part
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
                    gTone += 12;
                }
                inversionResult.notes[partIndex] = new Note({
                    semitone: gTone % 12,
                    octave: Math.floor(gTone / 12),
                });
            }

            // Make a copy inversionresult for each possible octave combination
            const initialPart0Note = globalSemitone(inversionResult.notes[0]);
            const initialPart1Note = globalSemitone(inversionResult.notes[1]);
            const initialPart2Note = globalSemitone(inversionResult.notes[2]);
            const initialPart3Note = globalSemitone(inversionResult.notes[3]);
            for (let part0Octave=0; part0Octave<3; part0Octave++) {
                const part0Note = initialPart0Note + part0Octave * 12;
                if (part0Note > semitoneLimits[0][1]) {
                    continue;
                }
                for (let part1Octave=0; part1Octave<3; part1Octave++) {
                    const part1Note = initialPart1Note + part1Octave * 12;
                    if (part1Note > part0Note) {
                        continue;
                    }
                    if (part1Note > semitoneLimits[1][1]) {
                        continue;
                    }
                    for (let part2Octave=0; part2Octave<3; part2Octave++) {
                        const part2Note = initialPart2Note + part2Octave * 12;
                        if (part2Note > part1Note) {
                            continue;
                        }
                        if (part2Note > semitoneLimits[2][1]) {
                            continue;
                        }
                        for (let part3Octave=0; part3Octave<3; part3Octave++) {
                            const part3Note = initialPart3Note + part3Octave * 12;
                            if (part3Note > part2Note) {
                                continue;
                            }
                            if (part3Note > semitoneLimits[3][1]) {
                                continue;
                            }
                            ret.push({
                                notes: [
                                    new Note({
                                        semitone: part0Note % 12,
                                        octave: Math.floor(part0Note / 12),
                                    }),
                                    new Note({
                                        semitone: part1Note % 12,
                                        octave: Math.floor(part1Note / 12),
                                    }),
                                    new Note({
                                        semitone: part2Note % 12,
                                        octave: Math.floor(part2Note / 12),
                                    }),
                                    new Note({
                                        semitone: part3Note % 12,
                                        octave: Math.floor(part3Note / 12),
                                    }),
                                ],
                                inversionName: inversionResult.inversionName,
                                rating: 0,
                            });
                        }
                    }
                }
            }
        }
        }
    }
    logger.print("newVoiceLeadingNotes: ", chord.toString(), " beat: ", beat);

    return ret;
}
