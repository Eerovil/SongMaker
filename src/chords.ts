import {
    buildTables,
    Scale,    
    Note,
    Semitone,
} from "musictheoryjs";
import { Logger } from "./mylogger";
import { Chord, MusicParams, Nullable, DivisionedRichnotes, RichNote, globalSemitone, BEAT_LENGTH } from "./utils";
import { moonlightsonata } from "./moonlightsonata";
import { RandomChordGenerator } from "./randomchords";
import { partialVoiceLeading } from "./voiceleading";
import { getTension } from "./chordtension";
import { melodyTension } from "./melodytension";
import { buildTopMelody } from "./topmelody";
import { addHalfNotes } from "./halfnotes";
import { getAvailableScales } from "./availablescales";


const NOTES_PER_MELODY_PART = 8



const sleepMS = async (ms: number): Promise<null> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const makeChords = async (params: MusicParams, progressCallback: Nullable<Function> = null): Promise<DivisionedRichnotes> => {
    // generate a progression
    const beatsPerBar = params.beatsPerBar || 4;
    const barsPerCadenceEnd = params.barsPerCadence || 4;
    const cadences = params.cadenceCount || 2

    const baseTension = params.baseTension || 0.4;

    const maxBeats = cadences * barsPerCadenceEnd * beatsPerBar;
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
        console.groupCollapsed("division", division, prevChord ? prevChord.toString() : "null", " scale ", currentScale.toString());
        const currentBeat = Math.floor(division / BEAT_LENGTH);
        const beatsUntilLastChordInCadence = (barsPerCadenceEnd * beatsPerBar) - ((currentBeat - 1) % (barsPerCadenceEnd * beatsPerBar)) - 1;
        console.log("beatsUntilLastChordInCadence", beatsUntilLastChordInCadence);

        const beatSetting = params.beatSettings[currentBeat];
        let tensionOverride = null;
        if (beatSetting) {
            tensionOverride = parseFloat(beatSetting.tension as unknown as string);
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
            const voiceLeadingResults = partialVoiceLeading(newChord, prevNotes, currentBeat, params, new Logger(chordLogger), maxBeats - currentBeat)
                
            if (beatsUntilLastChordInCadence == 1) {
                // Force same chord twice
                chordIsGood = true;
                randomNotes.splice(0, randomNotes.length);
                randomNotes.push(...prevNotes);
                newChord = prevChord;
            }

            for (const voiceLeading of voiceLeadingResults) {
                if (chordIsGood) {
                    break;
                }
                const inversionLogger = new Logger(chordLogger);
                inversionLogger.title = ["Inversion ", `${voiceLeading.inversionName}`, " tension: ", `${voiceLeading.tension}`];
                randomNotes.splice(0, randomNotes.length);  // Empty this and replace contents
                randomNotes.push(...voiceLeading.notes);
                for (const availableScale of availableScales) {
                    const scaleLogger = new Logger(inversionLogger)
                    const chordTensionLogger = new Logger(scaleLogger);
                    scaleLogger.title = ["Scale ", `${availableScale.scale.toString()}`];
                    if (chordIsGood) {
                        break;
                    }
                    const tensionResult = getTension(
                        prevNotes,
                        randomNotes,
                        availableScale.scale,
                        beatsUntilLastChordInCadence,
                        params,
                        chordTensionLogger,
                        maxBeats - currentBeat
                    );
                    chordTensionLogger.title = [
                        prevChord ? prevChord.toString() : "", " -> ", newChord.toString(), ": ", tensionResult.tension
                    ]
                    for (let i = 0; i < params.chords.length; i++) {
                        const chord = params.chords[i];
                        const chordWeight = parseFloat(`${params.chordSettings[i].weight}` || '0');
                        if (newChord.chordType == chord) {
                            tensionResult.tension += ((chordWeight * 10) ** 2) / 10;
                            chordTensionLogger.log("Chord ", chord, " weight: ", chordWeight, " tension: ", tensionResult.tension);
                        }
                    }
                    if (prevMelody.length > 0) {
                        tensionResult.tension += melodyTension(randomNotes[0], prevMelody, params, new Logger(scaleLogger));
                        chordTensionLogger.log("Melody tension: ", tensionResult.tension);
                        tensionResult.tension += voiceLeading.tension;
                        chordTensionLogger.log("VoiceLeading tension: ", tensionResult.tension);
                        tensionResult.tension += availableScale.tension / params.modulationWeight;
                        chordTensionLogger.log("Scale tension: ", tensionResult.tension);
                        if (!availableScale.scale.equals(currentScale)) {
                            tensionResult.tension += 1 / params.modulationWeight;
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

                    wantedTension = baseTension;
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
                        wantedTension = tensionOverride;
                        wantedTension += (0.1 * criteriaLevel);
                    }

                    let minTension = -999;
                    if (wantedTension > 0.5) {
                        minTension = wantedTension - 0.3 - (0.2 * criteriaLevel);
                    }
                    if (beatsUntilLastChordInCadence < 5) {
                        minTension = -999;
                    }
                    if (!prevChord) {
                        minTension = -999;
                    }

                    if (tension < wantedTension && tension > minTension) {
                        chordIsGood = true;
                        newScale = availableScale.scale.copy();
                        chordTensionLogger.log("Chord is good: ", tension, " wanted: ", wantedTension, " min: ", minTension);
                        break;  // Skip checking other voice leading inversions
                    } else {
                        chordTensionLogger.log("Chord is bad: ", tension, " wanted: ", wantedTension, " min: ", minTension);
                        if (Math.abs(tension - wantedTension) < Math.abs(closestTension - wantedTension)) {
                            closestTension = tension;
                        }
                        if (progressCallback) {
                            const giveUP = progressCallback(null, null);
                            if (giveUP) {
                                // Reduce cadence count to fix errors later
                                params.cadenceCount = Math.floor((currentBeat / (barsPerCadenceEnd * beatsPerBar)));
                                return result;
                            }
                        }
                    }
                    inversionLogger.print();
                }  // For available scales end
            }  // For voiceleading results end
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

export async function makeMusic(params: MusicParams, progressCallback: Nullable<Function> = null) {
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

export function makeMelody(divisionedNotes: DivisionedRichnotes, params: MusicParams) {
    // Remove old melody and make a new one
    const beatsPerBar = params.beatsPerBar || 4;
    const barsPerCadenceEnd = params.barsPerCadence || 4;
    const cadences = params.cadenceCount || 2

    const maxBeats = cadences * barsPerCadenceEnd * beatsPerBar;

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
    buildTopMelody(divisionedNotes, params);
    // addEighthNotes(divisionedNotes, params)
    addHalfNotes(divisionedNotes, params)
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