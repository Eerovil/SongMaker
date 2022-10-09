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
    if (currentScale) {
        const scaleSemitones = currentScale.notes.map(note => note.semitone);
        const differingNotesNotInScale = differingNotes.filter(semitone => !scaleSemitones.includes(semitone));
        if (differingNotesNotInScale.length > 0) {
            // console.log("differingNotesNotInScale: ", differingNotesNotInScale)
            tension += differingNotesNotInScale.length * (1 / noteCount) * 0.5;
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
        tension -= 0.5;
    }

    return tension;
}


const randomChord = (scale, prevChords) => {
    const chordTypes = ["maj", "min", "dim", "aug", "maj7", "min7", "7", "dim7", "maj6", "min6", "6"]//, "sus2", "sus4"];
    while (true) {
        const randomIndex = Math.floor(Math.random() * scale.notes.length);
        const randomNote = scale.notes[randomIndex];
        const randomChordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
        const randomChord = `(${randomNote.toString().replace(/\d/, '')})${randomChordType}`;
        if (prevChords && prevChords.includes(randomChord)) {
            continue;
        }
        return new Chord(randomChord);
    }
}


const chords = () => {
    // build the string tables
    buildTables();

    // generate a progression
    const maxBeats = 4 * 4;
    const maxTensions = 1
    const baseTension = 0.1;
    const highTension = 0.5;
    let currentBeat = 0;
    let currentScale = new Scale("C5(major)");
    let result = [];
    let tensionBeats = []
    let currentTension = 0;

    for (let i=0; i<maxTensions; i++) {
        tensionBeats.push(Math.floor(Math.random() * (maxBeats - 4)) + 4);
    }

    while (currentBeat < maxBeats) {
        let chordIsGood = false;
        let randomChords = [];
        let newChord = null;
        const prevChord = result[result.length - 1];
        let iterations = 0;
        while (!chordIsGood) {
            iterations++;
            if (iterations > 12 * 12) {
                console.log("Not found!")
                a += 1;
                break;
            }
            newChord = randomChord(currentScale, randomChords);
            randomChords.push(newChord.toString());
            if (prevChord == null) {
                chordIsGood = true;
            } else {
                const tension = getTension(prevChord, newChord, currentScale);
                let wantedTension = baseTension;
                if (tensionBeats.includes(currentBeat)) {
                    wantedTension = highTension;
                } else {
                    wantedTension -= currentTension;
                }
                if (Math.abs(tension - wantedTension) < 0.1) {
                    chordIsGood = true;
                    currentTension += tension;
                    console.log(`Tension: ${tension} (wanted ${wantedTension})`);
                }
            }
        }
        result.push(newChord)
        currentBeat += 1;
    }
    console.log(result.map(chord => chord.toString()));
    window.result = result;

    const instrument = new Instrument();
    window.chords = result.map(chord => (chord.notes.map(note => instrument.getFrequency(note))))
}
export { chords }

