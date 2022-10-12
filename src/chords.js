import {
    buildTables,
    Chord,
    Scale,
    ScaleTemplates,
    Note,
    Instrument,
    Semitone,
    Modifier,
} from "musictheoryjs";


const globalSemitone = (note) => {
    return note.semitone + ((note.octave) * 12);
}


const getTension = (fromChord, toChord, currentScale) => {
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    // console.log("getTension: ", fromChord.toString(), toChord.toString(), currentScale.toString())
    if (!fromChord) {
        fromChord = toChord;
    }
    const noteCount = Math.max(fromChord.notes.length, toChord.notes.length);
    const fromNotes = fromChord.notes;
    const toNotes = toChord.notes;
    // Compare the notes. Each differing note increases the tension a bit
    let tension = 0;
    const fromSemitones = fromNotes.map(note => note.semitone);
    const toSemitones = toNotes.map(note => note.semitone);
    const differingNotes = toSemitones.filter(semitone => !fromSemitones.includes(semitone));
    tension += differingNotes.length * (1 / noteCount) * 0.5;

    // If the differing notes are not in the current scale, increase the tension
    let differingNotesNotInScale = []
    if (currentScale) {
        const scaleSemitones = currentScale.notes.map(note => note.semitone);
        differingNotesNotInScale = differingNotes.filter(semitone => !scaleSemitones.includes(semitone));
        if (differingNotesNotInScale.length > 0) {
            // console.log("differingNotesNotInScale: ", differingNotesNotInScale)
            tension += differingNotesNotInScale.length * (1 / noteCount) * 1.5;
        }
    }

    // Figure out where the fromChord resolves to. If it resolves to the toChord, decrease the tension
    const fromIntervals = fromSemitones.map((semitone, index) => {
        if (index < fromSemitones.length - 1) {
            const nextSemitone = fromSemitones[(index + 1)];
            return ((nextSemitone - semitone) + 24) % 12;
        } else {
            return null;
        }
    }).filter(Boolean);
    // Does fromChord have any tensioning intervals?
    for (let i=0; i<fromIntervals.length; i++) {
        // Seconds want to "grow" by one semitone
        if (fromIntervals[i] === 2) {
            const goodTones = [fromSemitones[i] - 1, fromSemitones[i+1] + 1].map(semitone => semitone % 12);
            if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
                tension -= 0.5;
            }
        }
        // Perfect Fourths want to "shrink" by one semitones
        if (fromIntervals[i] === 5) {
            const goodTones = [fromSemitones[i] + 1, fromSemitones[i+1] - 1].map(semitone => semitone % 12);
            if (toSemitones.filter(semitone => goodTones.includes(semitone)).length === 1) {
                tension -= 0.5;
            }
        }
    }
    const toIntervals = toSemitones.map((semitone, index) => {
        if (index < toSemitones.length - 1) {
            const nextSemitone = toSemitones[(index + 1)];
            return ((nextSemitone - semitone) + 24) % 12;
        } else {
            return null;
        }
    }).filter(Boolean)
    // Does toChord have any tensioning intervals?
    for (let i=0; i<toIntervals.length; i++) {
        if (toIntervals[i] === 1) {
            tension += (1/noteCount) * 2.0;
        }
        if (toIntervals[i] === 2) {
            tension += (1/noteCount) * 1.0;
        }
        if (toIntervals[i] === 5) {
            tension += (1/noteCount) * 1.0;
        }
        if (toIntervals[i] === 6) {
            tension += (1/noteCount) * 1.0;
        }
    }

    // If chord has not 5th with base, increase tension
    if (toIntervals[0] + toIntervals[1] !== 7) {
        tension += 0.5;
    }

    const semitoneScaleIndex = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6,
    }

    const noteTensionsForward = {
        0: 0.1,  // Tonic (1st, 3rd, 6th) are leading softly
        1: 0.3,  // Subdominant (2nd, 4th) are leading a bitmore
        2: 0.1,
        3: 0.3,
        4: 0.6,  // Dominant (5th, 7th) is leading strongly
        5: 0.1,
        6: 0.6,
    }

    for (const fromSemitone of fromSemitones) {
        // We mark each note as "leading" to the next note. If that happens, reduce tension
        const scaleIndex = semitoneScaleIndex[fromSemitone] || null;
        const forwardTension = noteTensionsForward[scaleIndex];
        if (forwardTension) {
            if (toSemitones.includes(semitoneScaleIndex[scaleIndex + 1])) {
                tension -= forwardTension;
            }
        }
    }


    // if toChord is the tonic, the tension is much resolved
    if (toChord.notes[0].semitone === currentScale.notes[0].semitone) {
        if (differingNotesNotInScale.length == 0) {
            tension -= 0.5;
        }
    }

    return tension;
}


const randomChord = (scale, prevChords) => {
    const chordTypes = ["maj", "min", "dim"] //, "dim", "aug", "maj7", "min7", "7", "dim7", "maj6", "min6", "6"]//, "sus2", "sus4"];
    const notes = Object.keys(Semitone).filter(key => isNaN(key))
    while (true) {
        
        const randomIndex = Math.floor(Math.random() * notes.length);
        const randomNote = notes[randomIndex];
        const randomChordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
        const randomChord = `(${randomNote.toString().replace(/\d/, '')})${randomChordType}`;
        if (prevChords && prevChords.includes(randomChord)) {
            continue;
        }
        return new Chord(randomChord);
    }
}


const semitoneDistance = (tone1, tone2) => {
    // distance from 0 to 11 should be 1
    // 0 - 11 + 12 => 1
    // 11 - 0 + 12 => 23 => 11

    // 0 - 6 + 12 => 6
    // 6 - 0 + 12 => 18 => 6
    return Math.min((tone1 - tone2 + 12) % 12, (tone2 - tone1 + 12) % 12)
}


const chordsToVoiceLeadingNotes = (chords) => {
    const ret = [];
    ret.push([...chords[0].notes]);
    for (const chord of chords.slice(1)) {
        // Match each note of prev chord to closest note of `chord`
        const notes = chord.notes;
        const fixedNotes = [];
        console.log("notes: ", notes.map(note => note.toString()));
        for (const note of notes) {
            const semitone = note.semitone;
            const prevNotesByDistance = [...ret[ret.length - 1]].orderBy((note) => semitoneDistance(note.semitone, semitone));
            const closestNote = prevNotesByDistance[0];

            // Fix the note, if it's not already fixed
            let gSemitone = globalSemitone(note);
            const closestGSemitone = globalSemitone(closestNote);
            let fixedNote = note.copy();
            if (closestGSemitone < gSemitone) {
                const difference = gSemitone - closestGSemitone;
                const octavesBetween = Math.floor(difference / 12);
                fixedNote.octave -= octavesBetween;
                if (difference % 12 > 6) {
                    fixedNote.octave -= 1;
                }
            }
            fixedNotes.push(fixedNote);
        }
        console.log("fixedNotes: ", fixedNotes.map(note => note.toString()));
        ret.push(fixedNotes);
    }
    return ret;
}


const NOTES_PER_MELODY_PART = 4

const randomChordNote = (chord, notesInThisBar, scale, criteriaLevel, barDirection) => {
    let notes = chord.notes;
    // if (scale && criteriaLevel < 3) {
    //     // Try to choose a note that is not in the scale
    //     const newNotes = notes.filter(note => !scale.notes.map(note => note.semitone).includes(note.semitone));
    //     if (newNotes.length > 0) {
    //         notes = newNotes;
    //     }
    // }

    let gChoices = [];
    for (const note of notes) {
        const gSemitone = globalSemitone(note);
        gChoices.push(gSemitone - 12);
        gChoices.push(gSemitone);
        gChoices.push(gSemitone + 12);
    }
    // Remove duplicates
    gChoices = [...new Set(gChoices)];
    gChoices = gChoices.filter(gSemitone => gSemitone >= 12 * 3 && gSemitone <= 12 * 6);
    if (criteriaLevel < 4) {
        gChoices = gChoices.filter(gSemitone => gSemitone >= 12 * 3 && gSemitone <= 12 * 5);
    }

    //console.log("Before ", gChoices, notesInThisBar.map(note => globalSemitone(note)));

    if (criteriaLevel < 5 && notesInThisBar.length > 0) {
        // Additionally filter notes so that they are close enough to previous note
        const gPrevNote = globalSemitone(notesInThisBar[notesInThisBar.length - 1]);
        gChoices = gChoices.filter(gSemitone => Math.abs(gSemitone - gPrevNote) <= 8);
    }
    //console.log("After ", gChoices)

    if (criteriaLevel < 4 && (notesInThisBar || []).length > 0) {
        const lowestPoint = Math.min(...notesInThisBar.map(note => globalSemitone(note)));
        const highestPoint = Math.max(...notesInThisBar.map(note => globalSemitone(note)));
        const middlePoint = (lowestPoint + highestPoint) / 2;
        // Choose a note in correct direction
        if (barDirection == 'up') {
            gChoices = gChoices.filter(gTone => gTone >= lowestPoint);
        } else if (barDirection == 'down') {
            gChoices = gChoices.filter(gTone => gTone <= highestPoint);
        } else if (barDirection == 'same') {
            gChoices = gChoices.filter(gTone => gTone >= middlePoint - 3 && gTone <= middlePoint + 3);
        } else if (barDirection == 'repeat') {
            // Figure out which note this one should "copy"
            const noteToCopy = notesInThisBar[(notesInThisBar.length - 1) % NOTES_PER_MELODY_PART];
            const gNoteToCopy = globalSemitone(noteToCopy);
            if (criteriaLevel < 2) {
                gChoices = gChoices.filter(gTone => gTone >= gNoteToCopy - 1 && gTone <= gNoteToCopy + 1);
            } else {
                gChoices = gChoices.filter(gTone => gTone >= gNoteToCopy - 2 && gTone <= gNoteToCopy + 2);
            }
        }
    } else {
        console.log("Skipped direction ", barDirection, gChoices);
    }

    if (gChoices.length == 0) {
        return null;
    }
    if (criteriaLevel < 4) {
        console.log("kept direction", barDirection)
    }

    const randomIndex = Math.floor(Math.random() * gChoices.length);
    const semitone = gChoices[randomIndex] % 12;
    const octave = Math.floor(gChoices[randomIndex] / 12);

    const ret = new Note()
    ret.semitone = semitone;
    ret.octave = octave;
    return ret;
}


const melody = (chords, scale) => {
    // Initial melody, just half beats

    // Return value will be an object kwyed by "ticks", containing
    // an array of objects {note, length} for each tick

    // Lets just say a beat is 12 ticks
    const ret = {};
    const maxDistance = 2;
    let prevNote = null;
    let prevPrevNote = null;
    const directions = [
        'up',
        'same',
        'down',
        'repeat',
        'repeat',
    ]

    let barDirection = 'same'
    let notesInThisBar = []

    const instrument = new Instrument();

    for (let i=0; i<chords.length; i+= 0.5) {
        let noteIsGood = false;
        let randomNote;
        let iterations = 0;
        if (i % NOTES_PER_MELODY_PART == 0 && notesInThisBar.length > 0) {
            barDirection = directions[Math.floor(Math.random() * directions.length)];
            if (notesInThisBar[notesInThisBar.length - 1].octave >= 5) {
                barDirection = 'down';
            }
            if (notesInThisBar[notesInThisBar.length - 1].octave <= 3) {
                barDirection = 'up';
            }
            if (barDirection == 'repeat') {
                console.log("keeping the notes")
                notesInThisBar.splice(0, notesInThisBar.length - NOTES_PER_MELODY_PART);  // Keep last 4
            } else {
                notesInThisBar.splice(0, notesInThisBar.length - 1);  // Keep the last
            }
        }
        while (!noteIsGood) {
            iterations++;
            const criteriaLevel = Math.floor(iterations / 40);
            randomNote = randomChordNote(chords[Math.floor(i)], notesInThisBar, scale, criteriaLevel, barDirection);
            if (iterations > 300) {
                console.log("too many iterations");
                break;
            }
            if (!randomNote) {
                continue
            }
            noteIsGood = true;
            // if (prevNote == null) {
            //     noteisGood = true;
            // } else {

            // }
        }
        console.log("randomNote: ", randomNote.toString());
        notesInThisBar.push(randomNote);
        ret[i * 12] = {
            note: randomNote,
            freq: instrument.getFrequency(randomNote),
            duration: 6
        }
        prevPrevNote = prevNote;
        prevNote = randomNote;
        if (i > 1 && (Math.random() < 0.5 || barDirection == 'repeat') && prevPrevNote && prevNote) {
            // Add a note between prev and prevprev
            let randomBetweenNote;
            for (const note of scale.notes) {
                if (note.semitone > prevPrevNote.semitone && note.semitone < prevNote.semitone) {
                    randomBetweenNote = note;
                    randomBetweenNote.octave = prevPrevNote.octave;
                    break;
                }
                if (note.semitone < prevPrevNote.semitone && note.semitone > prevNote.semitone) {
                    randomBetweenNote = note;
                    randomBetweenNote.octave = prevPrevNote.octave;
                    break;
                }
            }
            if (randomBetweenNote) {
                console.log("Adding note ", randomBetweenNote.toString(), " between ", prevPrevNote.toString(), " and ", prevNote.toString());
                ret[(i-1) * 12].duration = 3;
                ret[((i-1) * 12) + 3] = {
                    note: randomBetweenNote,
                    freq: instrument.getFrequency(randomBetweenNote),
                    duration: 3,
                }
            } else {
                console.log("no note between", prevPrevNote.semitone, prevNote.semitone);
            }
        }
    }
    return ret;
}


const chords = () => {

    // generate a progression
    const maxBeats = 4 * 4;
    const maxTensions = 1
    const baseTension = 0.0;
    const highTension = 0.6;
    let currentBeat = 0;
    let currentScale = new Scale("C5(major)");
    let result = [];
    let tensions = [];
    let tensionBeats = []
    let currentTension = 0;
    let chordCounts = {};

    for (let i=0; i<maxTensions; i++) {
        tensionBeats.push(Math.floor(Math.random() * (maxBeats - 8)) + 6);
    }

    while (currentBeat < maxBeats - 2) {
        let chordIsGood = false;
        let randomChords = [];
        let newChord = null;
        const prevChord = result[result.length - 1];
        let iterations = 0;
        let currentScaleSemitones = currentScale.notes.map(note => note.semitone);
        while (!chordIsGood) {
            iterations++;
            if (iterations > 12 * 12) {
                console.log("Too many iterations, breaking");
                return null;
            }
            const criteriaLevel = Math.floor(iterations / (12 * 3));
            newChord = randomChord(currentScale, randomChords);
            randomChords.push(newChord.toString());
            const tension = getTension(prevChord, newChord, currentScale);
            if (prevChord == null) {
                if (tension > 0 || newChord.notes.filter(note => !currentScaleSemitones.includes(note.semitone)).length > 0) {
                    continue;
                }
                chordIsGood = true;
            } else if (currentBeat % 4 == 1 && tension <= 0) {
                newChord = prevChord.copy();
                chordIsGood = true;
            } else {
                if (criteriaLevel < 4 && (chordCounts[newChord.toString()] || 0) > (maxBeats / 4)) {
                    console.log("Chord already used too much: ", newChord.toString(), chordCounts[newChord.toString()]);
                    continue;
                }
                let wantedTension = baseTension;
                if (tensionBeats.includes(currentBeat)) {
                    wantedTension = highTension;
                } else {
                    wantedTension -= currentTension;
                }
                if (criteriaLevel < 2 && tension < -0.1) {
                    continue;
                }
                if (criteriaLevel < 3 && prevChord && newChord.toString() == prevChord.toString()) {
                    continue;
                }
                wantedTension += (0.1 * criteriaLevel);

                if (tension < wantedTension || (wantedTension <= 0.2 && tension <= 0.0)) {
                    chordIsGood = true;
                    console.log(`${wantedTension.toFixed(1)} - ${currentTension.toFixed(1)} - ${newChord.toString()}`)
                } else {
                    console.log("Tension too high: ", tension, wantedTension);
                }
            }
        }
        result.push(newChord)
        tensions.push(currentTension);
        chordCounts[newChord.toString()] = (chordCounts[newChord.toString()] || 0) + 1;
        currentBeat += 1;
    }
    result.push(new Chord("(G4)maj"));
    tensions.push(currentTension);
    result.push(new Chord("(C4)maj"));
    tensions.push(currentTension);
    console.log(result.map(chord => chord.toString()));
    window.result = result;
    window.tensions = tensions;

    const instrument = new Instrument();
    window.chords = chordsToVoiceLeadingNotes(result).map(notes => (notes.map(note => instrument.getFrequency(note))))

    window.melody = melody(result, currentScale);

    return window.result;
}

export { chords, buildTables }
