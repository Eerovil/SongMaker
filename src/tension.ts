import { Note, Scale } from "musictheoryjs";
import { addForcedMelody } from "./forcedmelody";
import { NonChordTone } from "./nonchordtones";
import { BEAT_LENGTH, Chord, DivisionedRichnotes, globalSemitone, gToneString, MainMusicParams, majScaleDifference, MusicParams, Nullable, semitoneDistance } from "./utils";


export class Tension {
    notInScale: number = 0;
    modulation: number = 0;
    allNotesSame: number = 0;
    chordProgression: number = 0;
    keepDominantTones: number = 0;
    parallelFifths: number = 0;
    spacingError: number = 0;
    cadence: number = 0;
    tensioningInterval: number = 0;
    secondInversion: number = 0;
    doubleLeadingTone: number = 0;
    leadingToneUp: number = 0;
    melodyJump: number = 0;
    melodyTarget: number = 0;
    voiceDirections: number = 0;
    overlapping: number = 0;

    forcedMelody: number = 0;
    nac?: NonChordTone;

    totalTension: number = 0;

    comment: string = "";

    getTotalTension(values: {params: MusicParams, beatsUntilLastChordInCadence: number}) {
        const {params, beatsUntilLastChordInCadence} = values;
        let tension = 0;
        tension += this.notInScale * 100;
        tension += this.modulation;
        tension += this.allNotesSame;
        // tension += this.chordProgression * 0.5;
        tension += this.keepDominantTones;
        tension += this.parallelFifths * 100;
        tension += this.spacingError;
        tension += this.cadence;
        tension += this.tensioningInterval;
        tension += this.secondInversion;
        tension += this.doubleLeadingTone;
        tension += this.leadingToneUp;
        if (beatsUntilLastChordInCadence > 4) {
            tension += this.melodyTarget;
            tension += this.melodyJump;
        } else {
            tension += this.melodyJump;
        }
        tension += this.voiceDirections;
        tension += this.overlapping;

        tension += this.forcedMelody;

        this.totalTension = tension;
        return tension;
    }

    print(...args: any[]) {
        // Print only positive values
        const toPrint: {[key: string]: string} = {};
        for (const key in this) {
            if (this[key] && typeof this[key] == "number") {
                toPrint[key] = (this[key] as unknown as number).toFixed(1);
            }
        }
        if (this.comment) {
            console.log(this.comment, ...args, toPrint);
        } else {
            console.log(...args, toPrint)
        }
    }
}


export type TensionParams = {
    divisionedNotes?: DivisionedRichnotes,
    beatDivision: number,
    fromNotesOverride?: Array<Note>,
    toNotes: Array<Note>,
    currentScale: Scale,
    beatsUntilLastChordInCadence?: number,
    params: MusicParams,
    mainParams: MainMusicParams,
    beatsUntilLastChordInSong?: number,
    inversionName?: string,
    prevInversionName?: String,
    newChord?: Chord,
}


export const getTension = (values: TensionParams): Tension => {
        const {
            divisionedNotes,
            fromNotesOverride,
            toNotes,
            newChord,
            currentScale,
            beatsUntilLastChordInCadence,
            beatsUntilLastChordInSong,
            inversionName,
            prevInversionName,
            params,
            mainParams,
            beatDivision,
        } = values;
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    const tension = new Tension();
    let wantedFunction = null;
    let tryToGetLeadingToneInPart0 = false;
    let part0MustBeTonic = false;

    if (beatsUntilLastChordInCadence && inversionName) {
        if (params.selectedCadence == "PAC") {
            if (beatsUntilLastChordInCadence <= 5) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence == 3) {
                wantedFunction = "dominant";
                tryToGetLeadingToneInPart0 = true;
            }
            if (beatsUntilLastChordInCadence < 3) {
                wantedFunction = "tonic";
                part0MustBeTonic = true;
            }
            if (beatsUntilLastChordInCadence <= 3 && !inversionName.startsWith('root')) {
                tension.comment += "cadence PAC: NOT root inversion! ";
                tension.cadence += 100;
            }
        } else if (params.selectedCadence == "IAC") {
            if (beatsUntilLastChordInCadence <= 5) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence == 3) {
                wantedFunction = "dominant";
            }
            if (beatsUntilLastChordInCadence < 3) {
                wantedFunction = "tonic";
            }
            if (beatsUntilLastChordInCadence <= 3 && inversionName.startsWith('root')) {
                // Not root inversion
                tension.comment += "cadence IAC: root inversion! ";
                tension.cadence += 100;
            }
        } else if (params.selectedCadence == "HC") {
            if (beatsUntilLastChordInCadence <= 4) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence < 3) {
                wantedFunction = "dominant";
            }
        }
    }

    let prevChord;
    let prevPrevChord;
    let passedFromNotes: Note[] = [];
    let prevPassedFromNotes: Note[] = [];
    let latestNotes: Note[] = [];
    if (divisionedNotes) {
        const latestDivision = beatDivision - BEAT_LENGTH;
        let tmp : Array<Note> = [];
        for (const richNote of (divisionedNotes[latestDivision] || [])) {
            // Use original notes, not the ones that have been turned into NACs
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevChord = richNote.chord;
        }
        passedFromNotes = [...tmp].filter(Boolean);
        tmp = [];
        for (const richNote of (divisionedNotes[latestDivision - BEAT_LENGTH] || [])) {
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevPrevChord = richNote.chord;
        }
        prevPassedFromNotes = [...tmp].filter(Boolean);

        for (let i=beatDivision; i>=0; i--) {
            for (const richNote of (divisionedNotes[i] || [])) {
                if (latestNotes[richNote.partIndex]) {
                    continue;
                }
                latestNotes[richNote.partIndex] = richNote.originalNote || richNote.note;
            }
            if (latestNotes.every(Boolean)) {
                break;
            }
        }

        if (!prevChord) {
            wantedFunction = "tonic";
        }
    } else if (fromNotesOverride) {
        passedFromNotes = fromNotesOverride;
    }

    let allsame = true;
    for (let i=0; i<toNotes.length; i++) {
        if (!passedFromNotes[i]) {
            allsame = false;
            break;
        }
        if (!prevPassedFromNotes[i]) {
            allsame = false;
            break;
        }
        if (!passedFromNotes[i].equals(toNotes[i])) {
            allsame = false;
            break;
        }
        if (!prevPassedFromNotes[i].equals(toNotes[i])) {
            allsame = false;
            break;
        }
    }
    if (prevChord && prevPrevChord && newChord && prevChord.toString() == newChord.toString() && prevPrevChord.toString() == prevChord.toString()) {
        allsame = true;
    }
    if (allsame) {
        tension.allNotesSame = 100;
    }

    let fromNotes;
    if (passedFromNotes.length < 4) {
        fromNotes = toNotes;
    } else {
        fromNotes = passedFromNotes;
    }

    const toSemitones = toNotes.map(note => note.semitone);
    const fromGlobalSemitones = fromNotes.map(note => globalSemitone(note));
    const toGlobalSemitones = toNotes.map(note => globalSemitone(note));

    // If the notes are not in the current scale, increase the tension
    let notesNotInScale: Array<number> = []
    let newScale: Nullable<Scale> = null;
    const leadingTone = (currentScale.key - 1 + 24) % 12

    if (tryToGetLeadingToneInPart0 && toGlobalSemitones[0] % 12 != leadingTone) {
        // in PAC, we want the leading tone in part 0 in the dominant
        tension.cadence += 5;
    }

    if (currentScale) {
        const scaleSemitones = currentScale.notes.map(note => note.semitone);
        notesNotInScale = toSemitones.filter(semitone => !scaleSemitones.includes(semitone));
        notesNotInScale = notesNotInScale.filter(semitone => semitone != leadingTone);
        if (notesNotInScale.length > 0) {
            // Quick return, this chord sucks
            tension.notInScale += 100
            return tension;
        }
    }

    for (let i = 0; i < toGlobalSemitones.length; i++) {
        for (let j = i; j < toGlobalSemitones.length; j++) {
            const interval = Math.abs(toGlobalSemitones[i] - toGlobalSemitones[j]);
            if (interval === 1) {
                tension.tensioningInterval += 2;
            }
            if (interval === 2) {
                tension.tensioningInterval += 0.5;
            }
            if (interval === 6) {
                tension.tensioningInterval += 1.5;
            }
        }
    }

    if (inversionName && inversionName.startsWith('second') || (prevInversionName || "").startsWith('second')) {
        for (let i=0; i<fromGlobalSemitones.length; i++) {
            const fromSemitone = fromGlobalSemitones[i];
            const toSemitone = toGlobalSemitones[i];
            if (Math.abs(fromSemitone - toSemitone) > 2) {
                tension.secondInversion += 100;
            }
        }
    }

    if (inversionName && inversionName.startsWith('root')) {
        tension.secondInversion -= 0.1;  // Root inversions are great
    }

    const semitoneScaleIndex: { [key: number]: number } = {
        [currentScale.notes[0].semitone]: 0,  // C
        [currentScale.notes[1].semitone]: 1,  // D
        [currentScale.notes[2].semitone]: 2,  // E
        [currentScale.notes[3].semitone]: 3,  // F
        [currentScale.notes[4].semitone]: 4,  // G
        [currentScale.notes[5].semitone]: 5,  // A
        [currentScale.notes[6].semitone]: 6,  // H
        [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
    }

    let possibleToFunctions = {
        'tonic': true,
        'sub-dominant': true,
        'dominant': true,
    }
    const toScaleIndexes = toNotes.map(note => semitoneScaleIndex[note.semitone]);

    if (part0MustBeTonic && toScaleIndexes[0] != 0) {
        tension.cadence += 10;
    }

    for (const scaleIndex of toScaleIndexes) {
        if (scaleIndex == undefined) {
            possibleToFunctions.tonic = false;
            possibleToFunctions['sub-dominant'] = false;
            possibleToFunctions.dominant = false;
            break;
        }
        if (![0, 1, 3, 5].includes(scaleIndex)) {
            possibleToFunctions["sub-dominant"] = false;
        }
        if (![1, 3, 4, 6].includes(scaleIndex)) {
            possibleToFunctions.dominant = false;
        }
        if (![0, 2, 4].includes(scaleIndex)) {
            possibleToFunctions.tonic = false;
        }
    }
    let possibleFromFunctions = {
        'tonic': true,
        'sub-dominant': true,
        'dominant': true,
    }
    const fromScaleIndexes = fromNotes.map(note => semitoneScaleIndex[note.semitone]);
    for (const scaleIndex of fromScaleIndexes) {
        if (scaleIndex == undefined) {
            possibleFromFunctions.tonic = false;
            possibleFromFunctions['sub-dominant'] = false;
            possibleFromFunctions.dominant = false;
            break;
        }
        if (!([0, 1, 3, 5].includes(scaleIndex))) {
            possibleFromFunctions["sub-dominant"] = false;
        }
        if (!([1, 3, 4, 6].includes(scaleIndex))) {
            possibleFromFunctions.dominant = false;
        }
        if (!([0, 2, 4].includes(scaleIndex))) {
            possibleFromFunctions.tonic = false;
        }
    }

    let fromDominantTones = 0;
    for (const scaleIndex of fromScaleIndexes) {
        if (([1, 3, 5, 6].includes(scaleIndex))) {
            fromDominantTones++;
        }
        if (scaleIndex == 6) {
            // Leading tone is a better dominant
            fromDominantTones += 1.5;
        }
        if (scaleIndex == 4) {
            // degree 6 is a weak dominant
            fromDominantTones -= 0.5;
        }
    }
    if (!wantedFunction) {
        let toDominantTones = 0;
        for (const scaleIndex of toScaleIndexes) {
            if (([1, 3, 5, 6].includes(scaleIndex))) {
                toDominantTones++;
            }
            if (scaleIndex == 6) {
                toDominantTones += 1.5;
            }
            if (scaleIndex == 4) {
                toDominantTones -= 0.5;
            }
        }
        if (fromDominantTones > toDominantTones) {
            tension.keepDominantTones += 5;
        }
        if (fromDominantTones > (toDominantTones + 1)) {
            tension.keepDominantTones += 100;
        }

        // if (beatsUntilLastChordInCadence && beatsUntilLastChordInCadence < 8) {
        //     // We should have at least 1 dominant tone by now.
        //     if (toDominantTones == 0) {
        //         tension.keepDominantTones += 5;
        //     }
        // }
    }

    if (wantedFunction) {
        if (wantedFunction == "sub-dominant") {
            if (!possibleToFunctions["sub-dominant"]) {// && !possibleToFunctions.dominant) {
                if (!possibleToFunctions["dominant"]) {
                    tension.comment += `Wanted ${wantedFunction}`
                    tension.cadence += 100;
                } else {
                    tension.cadence += 5;  // Dominant is
                }
            }
        }
        if (wantedFunction == "dominant") {
            if (!possibleToFunctions.dominant) {
                tension.comment += `Wanted ${wantedFunction}`
                tension.cadence += 100;
            }
        }
        if (wantedFunction == "tonic") {
            if (!possibleToFunctions.tonic) {
                tension.comment += `Wanted ${wantedFunction}`
                tension.cadence += 100;
            }
        }
    }

    if (possibleFromFunctions.tonic == false && wantedFunction != "tonic" && prevChord) {
        let prevIndex1 = semitoneScaleIndex[prevChord.notes[0].semitone];
        let prevIndex2 = semitoneScaleIndex[prevChord.notes[1].semitone];
        let prevIndex3 = semitoneScaleIndex[prevChord.notes[2].semitone];
        let prevIndex4 = semitoneScaleIndex[(prevChord.notes[3] || {}).semitone];

        // Choices: 4 moves up, 3 and 4 move up, 2, 3, and 4 move up, 1, 2, 3, and 4 move up
        // Check all
        let isGood = false;
        while (isGood == false) {
            const toScaleIndexes = toSemitones.map(semitone => semitoneScaleIndex[semitone]);
            let allowedIndexes: number[];
            if (prevIndex4) {
                allowedIndexes = [prevIndex1, prevIndex2, prevIndex3, prevIndex4]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    tension.chordProgression += 1;
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7, (prevIndex4 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [(prevIndex1 + 1) % 7, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7, (prevIndex4 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, prevIndex2, (prevIndex3 + 1) % 7, (prevIndex4 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, prevIndex2, prevIndex3, (prevIndex4 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
            } else {
                allowedIndexes = [prevIndex1, prevIndex2, prevIndex3]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    tension.chordProgression += -1;  // The best
                    isGood = true;
                    break;
                }
                allowedIndexes = [(prevIndex1 - 1) % 7, (prevIndex2 - 1) % 7, prevIndex3]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [(prevIndex1 + 1) % 7, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    tension.chordProgression += 1;
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, prevIndex2, (prevIndex3 + 1) % 7]
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
            }
            break;
        }
        if (!isGood) {
            tension.chordProgression += 3;
        }
    }

    const leadingToneSemitone = currentScale.notes[0].semitone + 11;
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const fromGlobalSemitone = fromGlobalSemitones[i];
        if (fromGlobalSemitone % 12 == leadingToneSemitone) {
            if (toGlobalSemitones[i] != fromGlobalSemitone + 1) {
                tension.leadingToneUp += 10;
                if (i == 1 || i == 2) {
                    // not as bad
                    tension.leadingToneUp -= 7;
                }
            }
        }
    }

    let leadingToneCount = 0;
    for (const toGlobalSemitone of toGlobalSemitones) {
        const scaleIndex: number = semitoneScaleIndex[(toGlobalSemitone + 12) % 12];
        if (scaleIndex == 6) {
            leadingToneCount++;
        }
    }
    if (leadingToneCount > 1) {
        tension.doubleLeadingTone += 10;
    }

    // Check directions
    const directionCounts = {
        "up": 0,
        "down": 0,
        "same": 0,
    }
    const partDirection = [];
    let rootBassDirection = null;
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const fromSemitone = fromGlobalSemitones[i];
        const toSemitone = toGlobalSemitones[i];
        const diff = toSemitone - fromSemitone;
        partDirection[i] = diff < 0 ? "down" : diff > 0 ? "up" : "same";
        if (diff > 0) {
            directionCounts.up += 1;
        }
        if (diff < 0) {
            directionCounts.down += 1;
        }
        if (diff == 0) {
            directionCounts.same += 1;
        }
        if (diff != 0 && (inversionName || '').startsWith('root')) {
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
    if (directionCounts.up > 2 && directionCounts.down < 1) {
        tension.voiceDirections += 3;
    }
    if (directionCounts.down > 2 && directionCounts.up < 1) {
        tension.voiceDirections += 3;
    }
    if (partDirection[0] == partDirection[3] && partDirection[0] != "same") {
        tension.voiceDirections += 5;
        // root and sopranos moving in same direction
    }

    // Parallel motion and hidden fifths
    for (let i=0; i<toGlobalSemitones.length; i++) {
        for (let j=i+1; j<toGlobalSemitones.length; j++) {
            if (fromGlobalSemitones[i] == toGlobalSemitones[i] && fromGlobalSemitones[j] == toGlobalSemitones[j]) {
                // Part i and j are staying same
                continue;
            }
            const interval = Math.abs(toGlobalSemitones[i] - toGlobalSemitones[j]);
            const intervalFrom = Math.abs(fromGlobalSemitones[i] - fromGlobalSemitones[j]);
            if (interval < 20 && interval % 12 == 7 || interval % 12 == 0) {
                // Possibly a parallel, contrary or hidden fifth/octave
                if (interval == intervalFrom) {
                    tension.parallelFifths += 10;
                    continue;
                }
                // Check if the interval is hidden
                // const partIDirection = toGlobalSemitones[i] - fromGlobalSemitones[i];
                // const partJDirection = toGlobalSemitones[j] - fromGlobalSemitones[j];
                // if (Math.abs(partIDirection) > 2) {
                //     // Upper part is making a jump
                //     if (partJDirection < 0 && partIDirection < 0 || partJDirection > 0 && partIDirection > 0) {
                //         tension.parallelFifths += 11;
                //         continue;
                //     }
                // }
            }
        }
    }

    // Spacing errors
    const part0ToPart1 = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[1]);
    const part1ToPart2 = Math.abs(toGlobalSemitones[1] - toGlobalSemitones[2]);
    const part2ToPart3 = Math.abs(toGlobalSemitones[2] - toGlobalSemitones[3]);
    if (part1ToPart2 > 12 || part0ToPart1 > 12 || part2ToPart3 > (12 + 7)) {
        tension.spacingError += 5;
    }

    // Overlapping error
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const lowerFromGTone = fromGlobalSemitones[i + 1];
        const lowerToGTone = toGlobalSemitones[i + 1];
        const upperFromGTone = fromGlobalSemitones[i - 1];
        const upperToGTone = toGlobalSemitones[i - 1];
        const toGlobalSemitone = toGlobalSemitones[i];
        if (upperToGTone || upperFromGTone) {
            if (toGlobalSemitone > Math.min(upperToGTone || 0, upperFromGTone || 0)) {
                tension.overlapping += 10;
            }
        }
        if (lowerToGTone || lowerFromGTone) {
            if (toGlobalSemitone < Math.max(lowerToGTone || 0, lowerFromGTone || 0)) {
                tension.overlapping += 10;
            }
        }
    }

    // Melody tension
    // Avoid jumps that are aug or 7th or higher
    for (let i=0; i<fromGlobalSemitones.length; i++) {
        const interval = Math.abs(fromGlobalSemitones[i] - toGlobalSemitones[i]);
        if (interval >= 3) {
            tension.melodyJump += 0.5;
        }
        if (interval >= 5) {
            tension.melodyJump += 2;
        }
        if (interval >= 7) {
            tension.melodyJump += 2;
        }
        if (interval >= 10) {  // 7th == 10
            tension.melodyJump += 100;
            continue;
        }
        if (interval == 6 || interval == 8) // tritone (aug 4th) or aug 5th
        {
            tension.melodyJump += 5;
            continue;
        }
        if (interval == 7) {
            tension.melodyJump += 1;
            continue;
        }
        if (interval == 9) {
            tension.melodyJump += 2;
            continue;
        }
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
    if (latestNotes && latestNotes.length == 4) {
        const prevFromGlobalSemitones = latestNotes.map((n) => globalSemitone(n));
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
                    if (interval <= 3) {
                        tension.melodyJump += 0.5;
                    } else if (interval <= 4) {
                        tension.melodyJump += 4;  // Not as bad
                    } else {
                        tension.melodyJump += 100;  // Terrible
                    }
                } else {
                    // Going back down/up...
                    const backInterval = Math.abs(toSemitone - fromSemitone);
                    if (backInterval > 2) {
                        // Going back too much
                        if (interval <= 3) {
                            tension.melodyJump += 5;
                        } else {
                            tension.melodyJump += 100;
                        }
                    }
                }
            }
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
            for (const division in (divisionedNotes || {})) {
                const notes = (divisionedNotes || {})[division];
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
                        tension.melodyTarget += 10;
                    }
                }
            }
            break;
        }
    }

    return tension;
}
