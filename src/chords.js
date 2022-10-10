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


const getTension = (fromChord, toChord, currentScale) => {
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    // console.log("getTension: ", fromChord.toString(), toChord.toString(), currentScale.toString())
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

    // If the fromChord base is a fifth of toChord, decrease tension (if it exists!)
    if (fromSemitones[0] === (toSemitones[0] + 7) % 12 && tension > 0) {
        tension -= tension * 0.5;
        // Additionally, if the fromchord is a 7th chord (three intervals, last one 3 semitones),
        // decrease tension even more
        if (fromIntervals.length == 3 && fromIntervals[2] === 3) {
            tension -= tension * 0.5;
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
    const chordTypes = ["maj", "min", "7", "6", "aug", "dim"] //, "dim", "aug", "maj7", "min7", "7", "dim7", "maj6", "min6", "6"]//, "sus2", "sus4"];
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
            const closestNoteOctave = closestNote.octave;
            let fixedNote = note.copy();
            if (note.semitone != chord.root && note.semitone > 6 && closestNote.semitone < 5) {
                // note octave should be closestNoteOctave - 1
                fixedNote.octave = closestNoteOctave - 1;
            } else if (note.semitone < 5 && closestNote.semitone > 6 && closestNoteOctave < 4) {
                // note octave should be closestNoteOctave + 1
                fixedNote.octave = closestNoteOctave + 1;
            } else {
                // note octave should be closestNoteOctave
                fixedNote.octave = closestNoteOctave;
            }


            fixedNotes.push(fixedNote);
        }
        console.log("fixedNotes: ", fixedNotes.map(note => note.toString()));
        ret.push(fixedNotes);
    }
    return ret;
}


const randomChordNote = (chord, scale, criteriaLevel) => {
    let notes = chord.notes;
    if (scale) {
        // Try to choose a note that is not in the scale
        const newNotes = notes.filter(note => !scale.notes.map(note => note.semitone).includes(note.semitone));
        if (newNotes.length > 0) {
            notes = newNotes;
        }
    }

    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
}


const melody = (chords, scale) => {
    // Initial melody, just half beats

    // Return value will be an object kwyed by "ticks", containing
    // an array of objects {note, length} for each tick

    // Lets just say a beat is 12 ticks
    const ret = {};
    const maxDistance = 2;
    let prevNote = null;

    const instrument = new Instrument();

    for (let i=0; i<chords.length; i+= 0.5) {
        let noteIsGood = false;
        let randomNote;
        let iterations = 0;
        while (!noteIsGood) {
            iterations++;
            const criteriaLevel = Math.floor(iterations / 33);
            randomNote = randomChordNote(chords[Math.floor(i)], scale, criteriaLevel);
            if (iterations > 100) {
                console.log("too many iterations");
                break;
            }
            if (prevNote) {
                const distance = semitoneDistance(prevNote.semitone, randomNote.semitone);
                if (distance == 0 && criteriaLevel == 0) {
                    continue;
                }
                if (distance > (maxDistance + criteriaLevel)) {
                    continue;
                }
                if (distance > 6) {
                    if (prevNote.octave > randomNote.octave) {
                        randomNote.octave += 1;
                    } else {
                        randomNote.octave -= 1;
                    }
                }
            }
            noteIsGood = true;
            // if (prevNote == null) {
            //     noteisGood = true;
            // } else {

            // }
        }
        ret[i * 12] = {
            note: randomNote,
            freq: instrument.getFrequency(randomNote),
            duration: 6
        }
        prevNote = randomNote;
    }
    return ret;
}


const chords = () => {

    // generate a progression
    const maxBeats = 4 * 4;
    const maxTensions = 1
    const baseTension = 0.1;
    const highTension = 0.3;
    let currentBeat = 0;
    let currentScale = new Scale("C5(major)");
    let result = [];
    let tensionBeats = []
    let currentTension = 0;
    let chordCounts = {};

    for (let i=0; i<maxTensions; i++) {
        tensionBeats.push(Math.floor(Math.random() * (maxBeats - 5)) + 4);
    }

    while (currentBeat < maxBeats - 2) {
        let chordIsGood = false;
        let randomChords = [];
        let newChord = null;
        const prevChord = result[result.length - 1];
        let iterations = 0;
        while (!chordIsGood) {
            iterations++;
            newChord = randomChord(currentScale, randomChords);
            randomChords.push(newChord.toString());
            if (prevChord == null) {
                chordIsGood = true;
            } else if (currentBeat % 4 == 1) {
                newChord = prevChord.copy();
                chordIsGood = true;
            } else {
                if ((chordCounts[newChord.toString()] || 0) > (maxBeats / 4)) {
                    console.log("Chord already used too much: ", newChord.toString(), chordCounts[newChord.toString()]);
                    continue;
                }
                const tension = getTension(prevChord, newChord, currentScale);
                let wantedTension = baseTension;
                if (tensionBeats.includes(currentBeat)) {
                    wantedTension = highTension;
                } else {
                    wantedTension -= currentTension;
                }
                if (Math.abs(tension - wantedTension) < 0.2 || (wantedTension <= 0.2 && tension <= 0.0)) {
                    chordIsGood = true;
                    currentTension += tension;
                    console.log(`${wantedTension.toFixed(1)} - ${currentTension.toFixed(1)} - ${newChord.toString()}`)
                } else {
                    if (iterations > 12 * 12) {
                        console.log("Too many iterations, breaking");
                        return null;
                    }
                }
            }
        }
        result.push(newChord)
        chordCounts[newChord.toString()] = (chordCounts[newChord.toString()] || 0) + 1;
        currentBeat += 1;
    }
    result.push(new Chord("(G4)maj"));
    result.push(new Chord("(C4)maj"));
    console.log(result.map(chord => chord.toString()));
    window.result = result;

    const instrument = new Instrument();
    window.chords = chordsToVoiceLeadingNotes(result).map(notes => (notes.map(note => instrument.getFrequency(note))))

    window.melody = melody(result, currentScale);

    return window.result;
}
export { chords }

