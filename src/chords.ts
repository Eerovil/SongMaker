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


const sleepMS = async (ms: number): Promise<null> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const makeChords = async (mainParams: MainMusicParams, progressCallback: Nullable<Function> = null): Promise<DivisionedRichnotes> => {
    // generate a progression

    const beatsPerBar = mainParams.beatsPerBar || 4;

    const maxBeats = mainParams.getMaxBeats();
    //let currentScale = new Scale({ key: Math.floor(Math.random() * 12) , octave: 5, template: ScaleTemplates[params.scaleTemplate]});
    let currentScale = new Scale({ key: 0, octave: 5 });

    let result: DivisionedRichnotes = {};
    let tensions: Array<number> = [];
    let prevChord = null;
    const prevNotes: Array<Note> = [];
    const prevMelody: Note[] = [];

    // for (let i=0; i<maxTensions; i++) {
    //     // tensionBeats.push(Math.floor(Math.random() * (maxBeats - 10)) + 6);
    // }

    for (let division = 0; division < maxBeats * BEAT_LENGTH; division += BEAT_LENGTH) {
        const params = mainParams.currentCadenceParams(division);
        const beatsUntilLastChordInCadence = params.beatsUntilCadenceEnd;
        console.groupCollapsed("division", division, prevChord ? prevChord.toString() : "null", " scale ", currentScale.toString());
        const currentBeat = Math.floor(division / BEAT_LENGTH);
        console.log("beatsUntilLastChordInCadence", beatsUntilLastChordInCadence);

        const beatSetting = params.beatSettings[currentBeat];
        let tensionOverride = null;
        if (beatSetting) {
            tensionOverride = parseFloat(beatSetting.tension as unknown as string);
        } else {
            tensionOverride = params.baseTension;
        }
        let chordIsGood = false;
        const randomGenerator = new RandomChordGenerator(params, currentScale)
        let newChord: Nullable<Chord> = null;
        let tension = 0;
        let newScale: Nullable<Scale> = null;
        let oldNewScale: Nullable<Scale> = null;

        const randomNotes: Array<Note> = [];

        let iterations = 0;

        let closestTension = -100;
        let wantedTension = 0;

        while (!chordIsGood) {
            iterations++;
            if (iterations % 100) {
                await sleepMS(100);
            }
            if (iterations > 1000) {
                console.log("Too many iterations, breaking, closestTension: ", closestTension);
                return {};
            }
            let criteriaLevel = Math.floor(iterations / (50));
            if (iterations % 100 == 0) {
                // Try previous chords again with different criteriaLevel...
                randomGenerator.cleanUp();
            }
            newChord = randomGenerator.getChord();
            const chordLogger = new Logger();
            if (!newChord) {
                chordLogger.log("Failed to get a new chord (all used)");
                // Try again
                randomGenerator.cleanUp();
                continue;
            }
            const availableScaleLogger = new Logger(chordLogger)
            const availableScales = getAvailableScales({
                latestDivision: division,
                divisionedRichNotes: result,
                params: params,
                randomNotes: newChord.notes,
                logger: availableScaleLogger,
            })
            const allInversions = getInversions(newChord, prevNotes, currentBeat, params, new Logger(chordLogger), maxBeats - currentBeat)
                
            if (beatsUntilLastChordInCadence == 1) {
                // Force same chord twice
                chordIsGood = true;
                randomNotes.splice(0, randomNotes.length);
                randomNotes.push(...prevNotes);
                newChord = prevChord;
            }

            for (const inversionResult of allInversions) {
                if (chordIsGood) {
                    break;
                }
                const inversionLogger = new Logger(chordLogger);
                inversionLogger.title = ["Inversion ", `${inversionResult.inversionName}`];
                randomNotes.splice(0, randomNotes.length);  // Empty this and replace contents
                randomNotes.push(...inversionResult.notes);
                let bestTension = 999;
                for (const availableScale of availableScales) {
                    const scaleLogger = new Logger(inversionLogger)
                    const chordTensionLogger = new Logger(scaleLogger);
                    scaleLogger.title = ["Scale ", `${availableScale.scale.toString()}`];
                    if (chordIsGood) {
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
                    if (prevMelody.length > 0) {
                        if (!availableScale.scale.equals(currentScale)) {
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
                    }
                    tension = tensionResult.tension;

                    wantedTension = 0.4;
                    // if (tensionBeats.includes(currentBeat)) {
                    //     wantedTension = highTension;
                    // }
                    if (maxBeats - currentBeat < 4) {
                        // Final bar
                        wantedTension = -0.5
                    }
                    if (beatsUntilLastChordInCadence < 3) {
                        wantedTension = -0.7;
                    } else {
                        wantedTension += (0.1 * criteriaLevel);
                    }

                    if (tensionOverride != null) {
                        wantedTension = parseFloat(tensionOverride as any);
                        wantedTension += (0.1 * criteriaLevel);
                    }

                    if (tension < bestTension) {
                        bestTension = tension;
                    }

                    if (tension < wantedTension) {
                        chordIsGood = true;
                        newScale = availableScale.scale.copy();
                        chordTensionLogger.log("Chord is good: ", tension, " wanted: ", wantedTension);
                        break;  // Skip checking other voice leading inversions
                    } else {
                        chordTensionLogger.log("Chord is bad: ", tension, " wanted: ", wantedTension);
                        if (Math.abs(tension - wantedTension) < Math.abs(closestTension - wantedTension)) {
                            closestTension = tension;
                        }
                        if (progressCallback) {
                            const giveUP = progressCallback(null, null);
                            if (giveUP) {
                                // Reduce cadence count to fix errors later
                                // FIXME
                                // params.cadenceCount = Math.floor((currentBeat / (barsPerCadenceEnd * beatsPerBar)));
                                return result;
                            }
                        }
                    }
                    scaleLogger.title.push("tension: ");
                    scaleLogger.title.push(`${tension}`);
                }  // For available scales end
                inversionLogger.title.push("tension: ");
                inversionLogger.title.push(`${bestTension}`);
                inversionLogger.print();
            }  // For voiceleading results end
            if (tension > 1000) {
                chordLogger.clear();
            }
            chordLogger.print(prevChord ? prevChord.toString() : "", " -> ", newChord.toString(), ": ", tension.toFixed(1), " (" + wantedTension + ")");
        }  // While end
        if (newChord == null) {
            return {};
        }
        tensions.push(tension);
        const newChordString = newChord.toString();
        if (newScale) {
            currentScale = newScale;
            //console.log("new scale: ", currentScale.toString());
        }
        if (newScale) {
            oldNewScale = newScale;
        }
        prevMelody.push(randomNotes[0]);
        //console.log(`${beatsUntilLastChordInCadence}: ${tension.toFixed(1)} - ${newChordString} (${currentScale.toString()})`);
        result[currentBeat * BEAT_LENGTH] = randomNotes.map((note, index) => ({
            note: note,
            partIndex: index,
            duration: BEAT_LENGTH,
            chord: newChord,
            scale: currentScale,
        }) as RichNote);

        if (progressCallback) {
            progressCallback(currentBeat, result[currentBeat * BEAT_LENGTH]);
        }

        prevChord = newChord;

        prevNotes.splice(0, prevNotes.length);
        prevNotes.push(...randomNotes);

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

    for (let division=0; division < maxBeats * BEAT_LENGTH; division++) {
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