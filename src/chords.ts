import {
    buildTables,
    Scale,
    Note,
} from "musictheoryjs";
import { Logger } from "./mylogger";
import { Chord, Nullable, DivisionedRichnotes, RichNote, BEAT_LENGTH, MainMusicParams } from "./utils";
import { RandomChordGenerator } from "./randomchords";
import { getInversions } from "./inversions";
import { getTension } from "./tension";
import { buildTopMelody } from "./topmelody";
import { addHalfNotes } from "./halfnotes";
import { getAvailableScales } from "./availablescales";


const GOOD_CHORD_LIMIT = 10;


const sleepMS = async (ms: number): Promise<null> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const makeChords = async (mainParams: MainMusicParams, progressCallback: Nullable<Function> = null): Promise<DivisionedRichnotes> => {
    // generate a progression
    const maxBeats = mainParams.getMaxBeats();
    //let currentScale = new Scale({ key: Math.floor(Math.random() * 12) , octave: 5, template: ScaleTemplates[params.scaleTemplate]});

    let result: DivisionedRichnotes = {};
    let lastLogger: Logger;

    // for (let i=0; i<maxTensions; i++) {
    //     // tensionBeats.push(Math.floor(Math.random() * (maxBeats - 10)) + 6);
    // }

    for (let division = 0; division < maxBeats * BEAT_LENGTH; division += BEAT_LENGTH) {
        let prevResult = result[division - BEAT_LENGTH];
        let prevChord = prevResult ? prevResult[0].chord : null;
        let prevNotes: Note[];
        let prevInversionName: string;
        let currentScale: Scale;
        if (prevResult) {
            prevNotes = [];
            for (const richNote of prevResult) {
                prevNotes[richNote.partIndex] = richNote.note;
                prevInversionName = richNote.inversionName;
                currentScale = richNote.scale;
            }
        }

        const params = mainParams.currentCadenceParams(division);
        const beatsUntilLastChordInCadence = params.beatsUntilCadenceEnd;

        console.groupCollapsed("division", division, prevChord ? prevChord.toString() : "null", " scale ", currentScale ? currentScale.toString() : "null");
        const currentBeat = Math.floor(division / BEAT_LENGTH);
        console.log("beatsUntilLastChordInCadence", beatsUntilLastChordInCadence);

        const randomGenerator = new RandomChordGenerator(params, currentScale)
        let newChord: Nullable<Chord> = null;

        let goodChords: RichNote[][] = []

        const randomNotes: Array<Note> = [];

        let iterations = 0;

        while (goodChords.length < GOOD_CHORD_LIMIT) {
            iterations++;
            if (iterations % 100) {
                await sleepMS(100);
            }
            newChord = randomGenerator.getChord();
            if (iterations > 1000 || !newChord) {
                console.log("Too many iterations, going back");
                if (lastLogger) {
                    lastLogger.print();
                }
                break;
            }
            const chordLogger = new Logger();
            chordLogger.log("Chord ", newChord.toString());

            let allInversions;
            let availableScales;

            if (beatsUntilLastChordInCadence == 1) {
                // Force same chord twice
                if (prevChord && newChord.toString() != prevChord.toString()) {
                    continue;
                }
            } else {
                // Force different chord
                if (prevChord && newChord.toString() == prevChord.toString()) {
                    continue;
                }
            }
            const availableScaleLogger = new Logger(chordLogger)
            availableScales = getAvailableScales({
                latestDivision: division,
                divisionedRichNotes: result,
                params: params,
                randomNotes: newChord.notes,
                logger: availableScaleLogger,
            })
            if (currentScale && (maxBeats - currentBeat < 3 || beatsUntilLastChordInCadence < 3 || currentBeat < 5)) {
                // Don't allow other scales than the current one
                availableScales = availableScales.filter(s => s.scale.equals(currentScale));
            }
            if (availableScales.length == 0) {
                continue;
            }
            allInversions = getInversions({
                chord: newChord, prevNotes: prevNotes, beat: currentBeat, params, logger: new Logger(chordLogger),
                beatsUntilLastChordInSong: maxBeats - currentBeat
            })

            for (const inversionResult of allInversions) {
                if (goodChords.length >= GOOD_CHORD_LIMIT) {
                    break;
                }
                const inversionLogger = new Logger();
                inversionLogger.title = ["Inversion ", `${inversionResult.inversionName}`];
                randomNotes.splice(0, randomNotes.length);  // Empty this and replace contents
                randomNotes.push(...inversionResult.notes);
                let bestTension = 999;
                for (const availableScale of availableScales) {
                    const scaleLogger = new Logger(inversionLogger)
                    const chordTensionLogger = new Logger(scaleLogger);
                    scaleLogger.title = ["Scale ", `${availableScale.scale.toString()}`];
                    if (goodChords.length >= GOOD_CHORD_LIMIT) {
                        break;
                    }
                    const tensionResult = getTension(
                        result,
                        randomNotes,
                        availableScale.scale,
                        beatsUntilLastChordInCadence,
                        params,
                        chordTensionLogger,
                        maxBeats - currentBeat,
                        inversionResult.inversionName,
                        prevInversionName,
                    );
                    chordTensionLogger.title = [
                        prevChord ? prevChord.toString() : "", " -> ", newChord.toString(), ": ", tensionResult.tension
                    ]
                    for (const chord in params.chordSettings) {
                        const chordSetting = params.chordSettings[chord];
                        const chordWeight = parseFloat(`${chordSetting.weight}` || '0');
                        if (newChord.chordType == chord) {
                            tensionResult.tension -= ((chordWeight * 10) ** 3) / 10;
                            chordTensionLogger.log("Chord ", chord, " weight: ", chordWeight, " tension: ", tensionResult.tension);
                        }
                    }
                    tensionResult.tension += availableScale.tension / Math.max(0.01, params.modulationWeight);
                    chordTensionLogger.log("Scale tension: ", tensionResult.tension);
                    if (currentScale && !availableScale.scale.equals(currentScale)) {
                        tensionResult.tension += 1 / Math.max(0.01, params.modulationWeight);
                        chordTensionLogger.log("Scale change tension: ", tensionResult.tension);
                        if (maxBeats - currentBeat < 3) {
                            // Last 2 bars, don't change scale
                            tensionResult.tension += 100;
                        }
                        if (beatsUntilLastChordInCadence < 3) {
                            // Don't change scale in last 2 beats of cadence
                            tensionResult.tension += 100;
                        }
                        if (currentBeat < 5) {
                            // Don't change scale in first 5 beats
                            tensionResult.tension += 100;
                        }
                    }
                    let tension = tensionResult.tension;

                    if (progressCallback) {
                        const giveUP = progressCallback(null, null);
                        if (giveUP) {
                            return result;
                        }
                    }

                    inversionLogger.title.push("chord: ");
                    inversionLogger.title.push(`${newChord.toString()}`);
                    inversionLogger.title.push("tension: ");
                    inversionLogger.title.push(`${tension}`);
                    if (tension > 10000) {
                        inversionLogger.print();
                    }
                    else if (tension < 10) {
                        inversionLogger.parent = null;
                        goodChords.push(randomNotes.map((note, index) => ({
                            note: note,
                            duration: BEAT_LENGTH,
                            chord: newChord,
                            partIndex: index,
                            inversionName: inversionResult.inversionName,
                            tension: tension,
                            scale: availableScale.scale,
                            logger: inversionLogger,
                        } as RichNote)
                        ));
                        chordTensionLogger.log("Chord is good: ", tension)
                    } else {
                        chordTensionLogger.log("Chord is bad: ", tension)
                        lastLogger = inversionLogger;
                    }
                    scaleLogger.title.push("tension: ");
                    scaleLogger.title.push(`${tension}`);
                }  // For available scales end
            }  // For voiceleading results end
        }  // While end
        if (goodChords.length == 0) {
            // Go back to previous chord, and make it again
            if (division >= BEAT_LENGTH) {
                division -= BEAT_LENGTH * 2;
                // Delete the previous chord (where we are going to)
                delete result[division + BEAT_LENGTH];
            } else {
                // We failed right at the start.
                console.groupEnd();
                return result;
            }
            randomGenerator.cleanUp();
            console.groupEnd();
            continue;
        }

        // Choose the best chord from goodChords
        let bestChord = goodChords[0];
        for (const chord of goodChords) {
            if (chord[0].logger) {
                chord[0].logger.print();  
            }
            if (chord[0].tension < bestChord[0].tension) {
                bestChord = chord;
            }
        }

        result[division] = bestChord;

        if (progressCallback) {
            progressCallback(currentBeat, result);
        }

        randomGenerator.cleanUp();
        console.groupEnd();
    }

    return result
}

export async function makeMusic(params: MainMusicParams, progressCallback: Nullable<Function> = null) {
    let divisionedNotes: DivisionedRichnotes = {};
    let iterations = 0;
    while (true) {
        iterations++;
        if (iterations > 5) {
            console.log("Too many iterations, breaking");
            return {
                divisionedNotes: {},
            }
        }
        divisionedNotes = await makeChords(params, progressCallback);
        if (Object.keys(divisionedNotes).length != 0) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
    buildTopMelody(divisionedNotes, params);
    // addEighthNotes(divisionedNotes, params)
    addHalfNotes(divisionedNotes, params)


    return {
        divisionedNotes: divisionedNotes,
    }

}

export function makeMelody(divisionedNotes: DivisionedRichnotes, mainParams: MainMusicParams) {
    // Remove old melody and make a new one
    const maxBeats = mainParams.getMaxBeats()

    for (let division = 0; division < maxBeats * BEAT_LENGTH; division++) {
        const onBeat = division % BEAT_LENGTH == 0;
        if (!onBeat) {
            divisionedNotes[division] = []
        } else if (divisionedNotes[division] && divisionedNotes[division].length > 0) {
            divisionedNotes[division].forEach(richNote => {
                richNote.duration = BEAT_LENGTH;
                richNote.tie = undefined;
            })
        }

    }

    // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
    buildTopMelody(divisionedNotes, mainParams);
    // addEighthNotes(divisionedNotes, params)
    addHalfNotes(divisionedNotes, mainParams)
}

// export async function testFunc(params: MusicParams) {
//     console.log(params)
//     let chords: Array<Array<RichNote>> = [];

//     chords = moonlightsonata
//         .map((noteNames) => (
//             noteNames.map(
//                 (noteName) => ({
//                     note: new Note(noteName),
//                     duration: BEAT_LENGTH,
//                 }) as RichNote
//             )
//         ));

//     const divisionedNotes: DivisionedRichnotes = {};

//     // Lower all semitones by 4
//     chords.forEach(richNoteList => richNoteList.forEach(richNote => {
//         const gTone = globalSemitone(richNote.note) - 4;
//         richNote.note.semitone = gTone % 12;
//         richNote.note.octave = Math.floor(gTone / 12);
//     }))


//     let prevChord = chords[0];
//     for (let i=0; i<chords.length; i++) {
//         const chord = chords[i];
//         const scale = new Scale({key: 0, template: ScaleTemplates.major});
//         console.log(getTension(prevChord.map(richNote => richNote.note), chord.map(richNote => richNote.note), scale, 10, params));
//         prevChord = chord;
//         divisionedNotes[i * BEAT_LENGTH] = chord.map((note, index) => ({
//             note: note.note,
//             partIndex: index,
//             duration: BEAT_LENGTH,
//             scale: scale,
//         }) as RichNote);
//     }

//     return {
//         chords: chords,
//         divisionedNotes: divisionedNotes,
//     }
// }

export { buildTables }