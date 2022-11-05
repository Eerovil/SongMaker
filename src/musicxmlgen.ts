import { Note, Scale, ScaleTemplates } from 'musictheoryjs';
import { RichNote, DivisionedRichnotes, MusicParams, globalSemitone } from "./chords"

type Nullable<T>  = T | null

import builder from 'xmlbuilder';

const BEAT_LENGTH = 12
const BEATS_PER_MEASURE = 4


function semitoneToPitch(semitone: number, scale: Scale, direction: string="sharp"): { noteName: string, alter: number } {
  for (const note of scale.notes) {
    if (note.semitone === semitone) {
      return {
        noteName: note.toString().substring(0, 1),
        alter: 0,
      };
    }
  }
  for (const note of scale.notes) {
    if (direction == "flat" && note.semitone === semitone + 1) {
      return {
        noteName: note.toString().substring(0, 1),
        alter: -1,
      };
    }
    if (direction == "sharp" && note.semitone === semitone - 1) {
      return {
        noteName: note.toString().substring(0, 1),
        alter: 1,
      };
    }
  }
  throw new Error("Could not find note for semitone " + semitone);
}


function richNoteDuration(richNote: RichNote) {
  const duration = richNote.duration;
  let type: string = 'quarter';
  if (duration === BEAT_LENGTH * 4) {
    type = 'whole';
  }
  else if (duration === BEAT_LENGTH * 2) {
    type = 'half';
  }
  else if (duration === BEAT_LENGTH) {
    type = 'quarter';
  }
  else if (duration == BEAT_LENGTH / 2) {
    type = 'eighth';
  }
  else if (duration == BEAT_LENGTH / 4) {
    type = '16th';
  }

  return {
    'duration': duration,
    'type': type,
  }
}

const flatScaleSemitones: Set<number> = new Set([
  (new Note('F')).semitone,
  (new Note('Bb')).semitone,
  (new Note('Eb')).semitone,
  (new Note('Ab')).semitone,
  (new Note('Db')).semitone,
  (new Note('Gb')).semitone,
]);

function noteToPitch(richNote: RichNote) {
  const note = richNote.note;
  const noteScale = richNote.scale;
  const scoreScale = new Scale({key: 0, octave: note.octave, template: ScaleTemplates.major})
  let direction = 'sharp';
  if (noteScale) {
    const base = noteScale.notes[0].semitone;
    if (flatScaleSemitones.has(base)) {
      direction = 'flat';
    }
  }
  const pitch = semitoneToPitch(note.semitone, scoreScale, direction);
  return {
    'step': { '#text': pitch.noteName },
    'alter': pitch.alter,
    'octave': { '#text': note.octave }
  };
}


type KeyChange = {
  fifths: number,
  cancel: number,
  mode: string,
}


function addRichNoteToMeasure(richNote: RichNote, measure: builder.XMLElement, staff: number, voice: number, firstNoteInChord: boolean, writeChord: boolean, keychange: KeyChange | undefined = undefined) {
  if (richNote.duration == 0) {
    return;
  }
  const duration = richNoteDuration(richNote);
  let beamNumber = 1;

  let notations = undefined;
  if (richNote.tie) {
    notations = {
      tied: {
        '@type': richNote.tie,
      }
    }
  }

  const attrs =  {
    'chord': !firstNoteInChord ? {} : undefined,
    'pitch': noteToPitch(richNote),
    'duration': duration.duration,
    'voice': voice,
    'type': duration.type,
    'staff': staff,
    'beam': richNote.beam ? { '@number': beamNumber, '#text': richNote.beam } : undefined,
    'tie': richNote.tie ? { '@type': richNote.tie } : undefined,
    'lyric': richNote.tension && staff == 0 ? { 'text': { '#text': richNote.tension.toFixed(2) } } : undefined,
    'notations': notations,
  };
  if (writeChord && richNote.chord && staff == 1) {
    let chordType: string = 'major';
    const chordTemplateKey = richNote.chord.chordType;

    let kindText = chordTemplateKey;
    console.log("Chord template key: " + chordTemplateKey);
    if (chordTemplateKey == "maj") {
      chordType = 'major';
      kindText = '';
    }
    else if (chordTemplateKey == "min") {
      chordType = 'minor';
      kindText = 'm';
    }
    else if (chordTemplateKey == "dim") {
      chordType = 'diminished';
    }
    else if (chordTemplateKey == "aug") {
      chordType = 'augmented';
    }
    else if (chordTemplateKey == "dom7") {
      chordType = 'dominant';
      kindText = "7";
    }
    else if (chordTemplateKey == "maj7") {
      chordType = 'major-seventh';
    }
    else if (chordTemplateKey == "min7") {
      chordType = 'minor-seventh';
      kindText = "m7";
    }
    else if (chordTemplateKey == "sus2") {
      chordType = 'suspended-second';
      kindText = "sus2";
    }
    else if (chordTemplateKey == "sus4") {
      chordType = 'suspended-fourth';
      kindText = "sus4";
    }

    const scoreScale = new Scale({key: 0, octave: 4, template: ScaleTemplates.major})
    let direction = 'sharp';
    if (richNote.scale) {
      const base = richNote.scale.notes[0].semitone;
      if (flatScaleSemitones.has(base)) {
        direction = 'flat';
      }
    }
    const pitch = semitoneToPitch(richNote.chord.notes[0].semitone, scoreScale, direction);

    measure.ele({ 'harmony': {
        'root': {
          'root-step': { '#text': pitch.noteName },
          'root-alter': pitch.alter,
        },
        'kind': {
          '@halign': 'center',
          '@text': kindText,
          '#text': chordType,
        }
      }
    })
  }
  if (keychange) {
    const attributes = measure.ele('attributes');
    attributes.ele({ 'key': {
        'cancel': { '#text': keychange.cancel },
        'fifths': { '#text': keychange.fifths },
        'mode': { '#text': keychange.mode },
    }})
  }
  measure.ele({ 'note': attrs });
}

function firstMeasureInit(voicePartIndex: number, measure: builder.XMLElement, params: MusicParams) {
  let clef;
  const semitones = [
    globalSemitone(new Note(params.parts[0].note || "F4")),
    globalSemitone(new Note(params.parts[1].note || "C4")),
    globalSemitone(new Note(params.parts[2].note || "A3")),
    globalSemitone(new Note(params.parts[3].note || "C3")),
  ]

  const mySemitone = semitones[voicePartIndex];
  if (mySemitone < 40) {
    clef = {
      '@number': 1,
      'sign': 'F',
      'line': 4,
    };
  } else if (mySemitone < 50) {
    clef = {
      '@number': 1,
      'sign': 'G',
      'line': 2,
      'clef-octave-change': {
        '#text': '-1'
      }
    };
  } else {
    clef = {
      '@number': 1,
      'sign': 'G',
      'line': 2,
    };
  }

  measure.ele({ 'attributes': {
    'divisions': { '#text': `${BEAT_LENGTH}` },
    'key': {
      'fifths': { '#text': '0' }
    },
    'time': {
      'beats': { '#text': '4' },
      'beat-type': { '#text': '4' }
    },
    'staves': 1,
    clef: [
      clef
    ]
  },
  'direction': {
    '@placement': 'above',
    'direction-type': {
      'metronome': {
        'beat-unit': 'quarter',
        'per-minute': '40'
      }
    },
    'sound': {
      '@tempo': `${params.tempo || 40}`
    }
  }
});
}


const getScaleSharpCount = (scale: Scale) => {
  let sharpCount = 0;
  const semitone = scale.key;
  const baseTones = [0, 2, 4, 5, 7, 9, 11];
  if (semitone == 0 || semitone == 2 || semitone == 4 || semitone == 7 || semitone == 9 || semitone == 11) {
    // Add sharps to the scale
    for (const note of scale.notes) {
      if (!baseTones.includes(note.semitone)) {
        sharpCount++;
      }
    }
    return sharpCount;
  } else {
    // Add flats to the scale
    for (const note of scale.notes) {
      if (!baseTones.includes(note.semitone)) {
        sharpCount--;
      }
    }
    return sharpCount;
  }
}

export function toXml(divisionedNotes: DivisionedRichnotes, params: MusicParams): string {
  const root = builder.create({ 'score-partwise' : { '@version': 3.1 }},
    { version: '1.0', encoding: 'UTF-8', standalone: false},
    {
      pubID: '-//Recordare//DTD MusicXML 3.1 Partwise//EN',
      sysID: 'http://www.musicxml.org/dtds/partwise.dtd'
    }
  );
  root.ele({ 'work': { 'work-title': "My song" }});
  const partList = root.ele({ 'part-list': {}});
  partList.ele({
    'score-part': {
      '@id': 'P1',
      'group': {
        '#text': 'score'
      },
      'part-name': {
        '#text': 'P1'
      },
      'score-instrument': {
        '@id': 'P1-I1',
        'instrument-name': {
          '#text': `${params.parts[0].voice}`
        },
      },
      'midi-instrument': {
        '@id': 'P1-I1',
        'midi-channel': 1,
        'midi-program': params.parts[0].voice,
        'volume': 90,
        'pan': 0
      }
    }
  });
  partList.ele({
    'score-part': {
      '@id': 'P2',
      'group': {
        '#text': 'score'
      },
      'part-name': {
        '#text': 'P2'
      },
      'score-instrument': {
        '@id': 'P2-I1',
        'instrument-name': {
          '#text': `${params.parts[1].voice}`
        },
      },
      'midi-instrument': {
        '@id': 'P2-I1',
        'midi-channel': 1,
        'midi-program': params.parts[1].voice,
        'volume': 70,
        'pan': 0
      }
    }
  });
  partList.ele({
    'score-part': {
      '@id': 'P3',
      'group': {
        '#text': 'score'
      },
      'part-name': {
        '#text': 'P3'
      },
      'score-instrument': {
        '@id': 'P3-I1',
        'instrument-name': {
          '#text': `${params.parts[2].voice}`
        },
      },
      'midi-instrument': {
        '@id': 'P3-I1',
        'midi-channel': 1,
        'midi-program': params.parts[2].voice,
        'volume': 70,
        'pan': 0
      }
    }
  });
  partList.ele({
    'score-part': {
      '@id': 'P4',
      'group': {
        '#text': 'score'
      },
      'part-name': {
        '#text': 'P4'
      },
      'score-instrument': {
        '@id': 'P4-I1',
        'instrument-name': {
          '#text': `${params.parts[3].voice}`
        },
      },
      'midi-instrument': {
        '@id': 'P4-I1',
        'midi-channel': 1,
        'midi-program': params.parts[3].voice,
        'volume': 90,
        'pan': 0
      }
    }
  });


  const parts = [
    root.ele({ 'part': { '@id': 'P1' }}),
    root.ele({ 'part': { '@id': 'P2' }}),
    root.ele({ 'part': { '@id': 'P3' }}),
    root.ele({ 'part': { '@id': 'P4' }}),
  ];

  const measures: Array<Array<builder.XMLElement>> = [
    [],
    [],
    [],
    []
  ]

  // (0 + 1) + ((0 + 1) * 2) = 1 + 2 = 3
  // 0 + 0 = 0
  // 0 + 1 = 1
  // 1 + 0 = 2
  // 1 + 1 = 3


  for (let partIndex=0; partIndex<parts.length; partIndex++) {
    for (let voiceIndex=0; voiceIndex<1; voiceIndex++) {
      const part = parts[partIndex];
      const voice = voiceIndex;
      // const voicePartIndex = ((partIndex * 2) + voiceIndex) + 1;
      const voicePartIndex = partIndex;
      if (voiceIndex == 0) {
        measures[partIndex].push(part.ele({ 'measure': { '@number': 1 }}));
        firstMeasureInit(voicePartIndex, measures[partIndex][measures[partIndex].length - 1], params);
      }
      let currentScale = new Scale({ key: 0 });
      for (const division in divisionedNotes) {
        const divisionNumber = parseInt(division);
        let measureIndex = Math.floor(divisionNumber / (BEATS_PER_MEASURE * BEAT_LENGTH))
        let currentMeasure = measures[partIndex][measureIndex]
        if (currentMeasure == undefined) {
          measures[partIndex].push(
            part.ele({ 'measure': { '@number': `${(measureIndex) + 1}` } })
          );
        }
        const richNotes = divisionedNotes[division];

        for (const richNote of richNotes) {
          if (richNote.partIndex != voicePartIndex) {
            continue;
          }
          let staff = partIndex;
          let keyChange: KeyChange | undefined = undefined
          if (divisionNumber % (BEATS_PER_MEASURE * BEAT_LENGTH) == 0 && richNote.scale.key != currentScale.key) {
            const prevSharpCount = getScaleSharpCount(currentScale);
            const newSharpCount = getScaleSharpCount(richNote.scale);
            let fifths = 0;
            let cancel = 0;
            if (prevSharpCount >= 0 && newSharpCount > prevSharpCount) {
              // There were sharps, and now there are more sharps
              fifths = newSharpCount - prevSharpCount;
            } else if (prevSharpCount <= 0 && newSharpCount < prevSharpCount) {
              // There were flats, and now there are more flats
              fifths = newSharpCount - prevSharpCount;
            } else if (prevSharpCount >= 0 && newSharpCount < prevSharpCount) {
              // There were sharps, and now there are fewer sharps (maybe even flats)
              for (let i=prevSharpCount; i>newSharpCount; i--) {
                if (i > 0) {
                  // Turn these fifths into cancels
                  cancel++;
                  fifths--;
                }
                if (i < 0) {
                  fifths--;
                }
              }
              //TODO
            }else if (prevSharpCount <= 0 && newSharpCount > prevSharpCount) {
              // There were flats, and now there are fewer flats (maybe even sharps)
              //TODO
              for (let i=prevSharpCount; i>newSharpCount; i++) {
                if (i < 0) {
                  // Turn these flats into cancels
                  cancel++;
                  fifths--;
                }
                if (i < 0) {
                  fifths++;
                }
              }
            }
            console.log(`prevSharpCount: ${prevSharpCount}, newSharpCount: ${newSharpCount}, fifths: ${fifths}, cancel: ${cancel}`);
            keyChange = {
              fifths: fifths,
              cancel: cancel,
            } as KeyChange
          }
          addRichNoteToMeasure(richNote, measures[partIndex][measures[partIndex].length - 1], staff, voice, true, divisionNumber % BEAT_LENGTH == 0, keyChange);
        }
      }
    }
  }

  const ret = root.end({ pretty: true});
  console.log(ret)
  return ret;
}