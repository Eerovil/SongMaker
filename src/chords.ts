import {
    buildTables,
    Scale,
    Note,
} from "musictheoryjs";
import { Logger } from "./mylogger";
import { Chord, Nullable, DivisionedRichnotes, RichNote, BEAT_LENGTH, MainMusicParams } from "./utils";
import { RandomChordGenerator } from "./randomchords";
import { getInversions } from "./inversions";
import { getTension, Tension } from "./tension";
import { buildTopMelody } from "./topmelody";
import { addHalfNotes } from "./halfnotes";
import { getAvailableScales } from "./availablescales";


const GOOD_CHORD_LIMIT = 12;
const GOOD_CHORDS_PER_CHORD = 3;
const BAD_CHORD_LIMIT = 20;


const sleepMS = async (ms: number): Promise<null> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const makeChords = async (mainParams: MainMusicParams, progressCallback: Nullable<Function> = null): Promise<DivisionedRichnotes> => {
    // generate a progression
    const maxBeats = mainParams.getMaxBeats();

    let result: DivisionedRichnotes = {};

    let divisionBannedNotes: {[key: number]: Array<Array<Note>>} = {}

    for (let division = 0; division < maxBeats * BEAT_LENGTH; division += BEAT_LENGTH) {
        let prevResult = result[division - BEAT_LENGTH];
        let prevChord = prevResult ? prevResult[0].chord : null;
        let prevNotes: Note[];
        let prevInversionName: string;
        let currentScale: Scale;
        let bannedNotess = divisionBannedNotes[division];
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
        const badChords: {tension: Tension, chord: string}[] = []

        const randomNotes: Array<Note> = [];

        let iterations = 0;
        let skipLoop = false;

        if (beatsUntilLastChordInCadence == 1) {
            // Force same chord twice
            goodChords.splice(0, goodChords.length);
            goodChords.push(prevNotes.map((note, index) => ({
                note: note,
                duration: BEAT_LENGTH,
                chord: newChord,
                partIndex: index,
                inversionName: prevInversionName,
                tension: new Tension(),
                scale: currentScale,
            } as RichNote)));
            skipLoop = true;
        }

        while (!skipLoop && goodChords.length < GOOD_CHORD_LIMIT) {
            iterations++;
            if (iterations % 100) {
                await sleepMS(100);
            }
            newChord = randomGenerator.getChord();
            const chordLogger = new Logger();
            if (iterations > 1000 || !newChord) {
                console.log("Too many iterations, going back");
                break;
            }
            let allInversions;
            let availableScales;

            availableScales = getAvailableScales({
                latestDivision: division,
                divisionedRichNotes: result,
                params: params,
                randomNotes: newChord.notes,
                logger: new Logger(chordLogger),
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
                if (bannedNotess && bannedNotess.length > 0) {
                    let banned = true;
                    for (const bannedNotes of bannedNotess) {
                        if (bannedNotes.length != randomNotes.length) {
                            continue;
                        }
                        banned = true;
                        for (let i = 0; i < randomNotes.length; i++) {
                            if (randomNotes[i].toString() != bannedNotes[i].toString()) {
                                banned = false;
                                break;
                            }
                        }
                        if (banned) {
                            break;
                        }
                    }
                    if (banned) {
                        console.log("Banned notes", randomNotes.map(n => n.toString()), "bannedNotess", bannedNotess.map(n => n.map(n => n.toString())));
                        continue;
                    }
                }
                for (const availableScale of availableScales) {
                    if (goodChords.length >= GOOD_CHORD_LIMIT) {
                        break;
                    }
                    const tensionResult = getTension({
                        divisionedNotes: result,
                        toNotes: randomNotes,
                        currentScale: availableScale.scale,
                        beatsUntilLastChordInCadence,
                        beatsUntilLastChordInSong: maxBeats - currentBeat,
                        params,
                        inversionName: inversionResult.inversionName,
                        prevInversionName,
                    });

                    tensionResult.modulation += availableScale.tension / Math.max(0.01, params.modulationWeight);
                    if (currentScale && !availableScale.scale.equals(currentScale)) {
                        tensionResult.modulation += 1 / Math.max(0.01, params.modulationWeight);
                        if (maxBeats - currentBeat < 3) {
                            // Last 2 bars, don't change scale
                            tensionResult.modulation += 100;
                        }
                        if (beatsUntilLastChordInCadence < 3) {
                            // Don't change scale in last 2 beats of cadence
                            tensionResult.modulation += 100;
                        }
                        if (currentBeat < 5) {
                            // Don't change scale in first 5 beats
                            tensionResult.modulation += 100;
                        }
                    }
                    let tension = tensionResult.getTotalTension(params);

                    if (progressCallback) {
                        const giveUP = progressCallback(null, null);
                        if (giveUP) {
                            return result;
                        }
                    }

                    if (tension < 10) {
                        inversionLogger.parent = null;
                        let thisChordCount = 0;
                        for (const goodChord of goodChords) {
                            if (goodChord[0].chord.toString() == newChord.toString()) {
                                thisChordCount++;
                            }
                        }
                        if (thisChordCount >= GOOD_CHORDS_PER_CHORD) {
                            // Replace the worst previous goodChord if this has less tension
                            let worstChord = null;
                            let worstChordTension = 0;
                            for (let i = 0; i < goodChords.length; i++) {
                                const goodChord = goodChords[i];
                                if (goodChord[0].chord.toString() == newChord.toString()) {
                                    if (goodChord[0].tension.totalTension < worstChordTension) {
                                        worstChord = i;
                                    }
                                }
                            }
                            if (worstChord != null) {
                                if (goodChords[worstChord][0].tension.totalTension > tension) {
                                    // Just remove that index, add a new one later
                                    goodChords.splice(worstChord, 1);
                                }
                            }

                        }
                        if (thisChordCount < GOOD_CHORDS_PER_CHORD) {
                            goodChords.push(randomNotes.map((note, index) => ({
                                note: note,
                                duration: BEAT_LENGTH,
                                chord: newChord,
                                partIndex: index,
                                inversionName: inversionResult.inversionName,
                                tension: tensionResult,
                                scale: availableScale.scale,
                            } as RichNote)
                            ));
                        }
                    } else if (badChords.length < BAD_CHORD_LIMIT) {
                        let chordCountInBadChords = 0;
                        for (const badChord of badChords) {
                            if (badChord.chord == newChord.toString()) {
                                chordCountInBadChords++;
                            }
                        }
                        if (chordCountInBadChords < 3) {
                            badChords.push({
                                chord: newChord.toString(),
                                tension: tensionResult
                            });
                        }
                    }
                }  // For available scales end
            }  // For voiceleading results end
        }  // While end
        if (goodChords.length == 0) {
            for (const badChord of badChords) {
                badChord.tension.print("Bad chord ", badChord.chord);
            }
            // Go back to previous chord, and make it again
            if (division >= BEAT_LENGTH) {
                division -= BEAT_LENGTH * 2;
                // Mark the previous chord as banned
                const newBannedNotes = [];
                for (const note of result[division]) {
                    newBannedNotes[note.partIndex] = note.note;
                }
                // Delete the previous chord (where we are going to)
                divisionBannedNotes[division + BEAT_LENGTH] = divisionBannedNotes[division + BEAT_LENGTH] || [];
                divisionBannedNotes[division + BEAT_LENGTH].push(newBannedNotes);
                delete result[division + BEAT_LENGTH];
            } else {
                // We failed right at the start.
                console.groupEnd();
                return result;
            }
            randomGenerator.cleanUp();
            console.groupEnd();
            if (progressCallback) {
                progressCallback(currentBeat - 1, result);
            }
            continue;
        }

        // Choose the best chord from goodChords
        let bestChord = goodChords[0];
        for (const chord of goodChords) {
            if (chord[0]) {
                chord[0].tension.print(chord[0].chord ? chord[0].chord.toString() : "?Chord?", ": ")
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

export { buildTables }