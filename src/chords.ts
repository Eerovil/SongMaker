import {
    buildTables,
    Scale,
    Note,
} from "musictheoryjs";
import { Logger } from "./mylogger";
import { Chord, Nullable, DivisionedRichnotes, RichNote, BEAT_LENGTH, semitoneScaleIndex } from "./utils";
import { RandomChordGenerator } from "./randomchords";
import { getInversions } from "./inversions";
import { getTension, Tension } from "./tension";
import { addNoteBetween, buildTopMelody } from "./nonchordtones";
import { addHalfNotes } from "./halfnotes";
import { getAvailableScales } from "./availablescales";
import { addForcedMelody, ForcedMelodyResult } from "./forcedmelody";
import * as time from "./timer"; 
import { chordProgressionTension } from "./chordprogression";
import { MainMusicParams } from "./params";

const GOOD_CHORD_LIMIT = 200;
const GOOD_CHORDS_PER_CHORD = 10;
const BAD_CHORD_LIMIT = 500;
const BAD_CHORDS_PER_CHORD = 20;


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
        let prevInversionName: string | undefined;
        let currentScale: Scale | undefined;
        let bannedNotess = divisionBannedNotes[division];
        if (prevResult) {
            prevNotes = [];
            for (const richNote of prevResult) {
                prevNotes[richNote.partIndex] = richNote.note;
                prevInversionName = richNote.inversionName;
                currentScale = richNote.scale;
            }
        }
        // @ts-expect-error
        prevNotes = prevNotes;

        const params = mainParams.currentCadenceParams(division);
        const beatsUntilLastChordInCadence = params.beatsUntilCadenceEnd;

        console.groupCollapsed("division", division, prevChord ? prevChord.toString() : "null", " scale ", currentScale ? currentScale.toString() : "null");
        const currentBeat = Math.floor(division / BEAT_LENGTH);
        console.log("beatsUntilLastChordInCadence", beatsUntilLastChordInCadence);

        const randomGenerator = new RandomChordGenerator(params)
        let newChord: Nullable<Chord> = null;

        let goodChords: RichNote[][] = []
        const badChords: {tension: Tension, chord: string}[] = []

        const randomNotes: Array<Note> = [];

        let iterations = 0;
        let skipLoop = false;

        if (beatsUntilLastChordInCadence == 1 && prevNotes) {
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

        while (!skipLoop && goodChords.length < (currentBeat != 0 ? GOOD_CHORD_LIMIT : 5)) {
            iterations++;
            newChord = randomGenerator.getChord();
            const chordLogger = new Logger();
            if (iterations > 100000 || !newChord) {
                console.log("Too many iterations, going back");
                break;
            }
            if (mainParams.forcedChords) {
                if (currentBeat == 0) {
                    if (newChord.notes[0].semitone != 0 || !newChord.toString().includes('maj')) {
                        // Force C major scale
                        continue;
                    }
                }
            }
            if (mainParams.forcedChords && currentScale && newChord) {
                const forcedChordNum = parseInt(mainParams.forcedChords[currentBeat]);
                if (!isNaN(forcedChordNum)) {
                    if (semitoneScaleIndex(currentScale)[newChord.notes[0].semitone] != (forcedChordNum - 1)) {
                        continue;
                    }
                }
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
                availableScales = availableScales.filter(s => s.scale.equals(currentScale as Scale));
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
                    const tensionParams = {
                        divisionedNotes: result,
                        beatDivision: division,
                        toNotes: randomNotes,
                        currentScale: availableScale.scale,
                        beatsUntilLastChordInCadence,
                        beatsUntilLastChordInSong: maxBeats - currentBeat,
                        params,
                        mainParams,
                        inversionName: inversionResult.inversionName,
                        prevInversionName,
                        newChord,
                    }

                    const tensionResult = new Tension();
                    chordProgressionTension(tensionResult, tensionParams);
                    if (tensionResult.getTotalTension({
                            params,
                            beatsUntilLastChordInCadence
                    }) < 10) {
                        getTension(tensionResult, tensionParams);
                    }

                    const modulationWeight = parseFloat((`${params.modulationWeight || "0"}`))
                    tensionResult.modulation += availableScale.tension / Math.max(0.01, modulationWeight);
                    if (currentScale && !availableScale.scale.equals(currentScale)) {
                        tensionResult.modulation += 1 / Math.max(0.01, modulationWeight);
                        if (modulationWeight == 0) {
                            tensionResult.modulation += 100;
                        }
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
                    let tension = tensionResult.getTotalTension({
                        params,
                        beatsUntilLastChordInCadence
                    });

                    if (progressCallback) {
                        const giveUP = progressCallback(null, null);
                        if (giveUP) {
                            return result;
                        }
                    }

                    let melodyResult: ForcedMelodyResult;
                    if (tension < 10) {
                        // Is this possible to work with the melody?
                        // If so, add melody notes and NACs.
                        melodyResult = addForcedMelody(tensionParams);
                        tensionResult.forcedMelody += melodyResult.tension;
                        if (melodyResult.nac) {
                            tensionResult.nac = melodyResult.nac;
                        }
                        tensionResult.comment = melodyResult.comment;
                        tension = tensionResult.getTotalTension({
                            params,
                            beatsUntilLastChordInCadence
                        });
                    }

                    if (tension < 10) {
                        inversionLogger.parent = undefined;
                        let thisChordCount = 0;
                        for (const goodChord of goodChords) {
                            if (goodChord[0].chord && goodChord[0].chord.toString() == newChord.toString()) {
                                thisChordCount++;
                            }
                        }
                        if (thisChordCount >= GOOD_CHORDS_PER_CHORD) {
                            // Replace the worst previous goodChord if this has less tension
                            let worstChord = null;
                            let worstChordTension = 0;
                            for (let i = 0; i < goodChords.length; i++) {
                                const goodChord = goodChords[i];
                                if (goodChord[0].chord && goodChord[0].chord.toString() == newChord.toString()) {
                                    if ((goodChord[0].tension?.totalTension || 999) < worstChordTension) {
                                        worstChord = i;
                                    }
                                }
                            }
                            if (worstChord != null) {
                                if ((goodChords[worstChord][0].tension?.totalTension || 999) > tension) {
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
                    } else if (tensionResult.modulation < 100 && badChords.length < BAD_CHORD_LIMIT) {
                        let chordCountInBadChords = 0;
                        for (const badChord of badChords) {
                            if (badChord.chord == newChord.toString()) {
                                chordCountInBadChords++;
                            }
                        }
                        if (chordCountInBadChords < BAD_CHORDS_PER_CHORD) {
                            badChords.push({
                                chord: newChord.toString() + "," + inversionResult.inversionName,
                                tension: tensionResult
                            });
                        }
                    }
                }  // For available scales end
            }  // For voiceleading results end
        }  // While end
        if (goodChords.length == 0) {
            for (const badChord of badChords) {
                badChord.tension.print("Bad chord ", badChord.chord, " - ");
            }
            await sleepMS(1);
            // Go back to previous chord, and make it again
            if (division >= BEAT_LENGTH) {
                division -= BEAT_LENGTH * 2;
                // Mark the previous chord as banned
                const newBannedNotes = [];
                for (const note of result[division + BEAT_LENGTH]) {
                    newBannedNotes[note.partIndex] = note.note;
                }
                // Delete the previous chord (where we are going to)
                divisionBannedNotes[division + BEAT_LENGTH] = divisionBannedNotes[division + BEAT_LENGTH] || [];
                divisionBannedNotes[division + BEAT_LENGTH].push(newBannedNotes);
                delete result[division + BEAT_LENGTH];
                // Delete any notes after that also
                for (let i = division + BEAT_LENGTH; i < maxBeats * BEAT_LENGTH; i += 1) {
                    delete result[i];
                }
                if (divisionBannedNotes[division + BEAT_LENGTH].length > 10 && result[division]) {
                    // Too many bans, go back further. Remove these bans so they don't hinder later progress.
                    divisionBannedNotes[division + BEAT_LENGTH] = [];
                    division -= BEAT_LENGTH
                    const newBannedNotes = [];
                    for (const note of result[division + BEAT_LENGTH]) {
                        newBannedNotes[note.partIndex] = note.note;
                    }
                    divisionBannedNotes[division + BEAT_LENGTH] = divisionBannedNotes[division + BEAT_LENGTH] || [];
                    divisionBannedNotes[division + BEAT_LENGTH].push(newBannedNotes);
                    delete result[division + BEAT_LENGTH];
                    for (let i = division + BEAT_LENGTH; i < maxBeats * BEAT_LENGTH; i += 1) {
                        delete result[i];
                    }
                }
            } else {
                // We failed right at the start.
                console.groupEnd();
                return result;
            }
            randomGenerator.cleanUp();
            console.groupEnd();
            if (progressCallback) {
                const giveUP = progressCallback(currentBeat - 1, result);
                if (giveUP) {
                    return result;
                }
            }
            continue;
        }

        // Choose the best chord from goodChords
        let bestChord = goodChords[0];
        let bestTension = 999;
        for (const chord of goodChords) {
            if (chord[0].tension != undefined) {
                if (chord[0].tension.totalTension < bestTension) {
                    bestChord = chord;
                    bestTension = chord[0].tension.totalTension;
                }
                chord[0].tension.print(chord[0].chord ? chord[0].chord.toString() : "?Chord?", chord[0].inversionName, "best tension: ", bestTension, ": ", bestChord)
            }
        }

        result[division] = bestChord;
        if (bestChord[0]?.tension?.nac) {
            // Add the required Non Chord Tone
            addNoteBetween(bestChord[0].tension.nac, division, division + BEAT_LENGTH, 0, result);
        }

        if (progressCallback) {
            if (progressCallback(currentBeat, result)) {
                return result;
            }
        }

        randomGenerator.cleanUp();
        console.groupEnd();
    }

    return result
}

export async function makeMusic(params: MainMusicParams, progressCallback: Nullable<Function> = null) {
    let divisionedNotes: DivisionedRichnotes = {};
    divisionedNotes = await makeChords(params, progressCallback);
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
    // buildTopMelody(divisionedNotes, params);
    // addEighthNotes(divisionedNotes, params)
    // addHalfNotes(divisionedNotes, params)


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
    // buildTopMelody(divisionedNotes, mainParams);
    // addEighthNotes(divisionedNotes, params)
    // addHalfNotes(divisionedNotes, mainParams)
}

export { buildTables }