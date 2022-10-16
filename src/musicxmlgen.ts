import { Note, Scale, ScaleTemplates } from 'musictheoryjs';
import { RichNote, DivisionedRichnotes, MusicParams } from "./chords"

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


function addRichNoteToMeasure(richNote: RichNote, measure: builder.XMLElement, staff: number, voice: number, firstNoteInChord: boolean) {
  const duration = richNoteDuration(richNote);
  const attrs =  {
    'chord': !firstNoteInChord ? {} : undefined,
    'pitch': noteToPitch(richNote),
    'duration': duration.duration,
    'voice': voice,
    'type': duration.type,
    'staff': staff,
  };
  measure.ele({ 'note': attrs });
  if (richNote.chord && staff == 1) {
    let chordType: string;
    if (richNote.chord.isMajor()) {
      chordType = 'major';
    }
    else if (richNote.chord.isMinor()) {
      chordType = 'minor';
    }
    measure.ele({ 'harmony': {
        'root': {
          'root-step': { '#text': richNote.chord.notes[0].toString().substring(0, 1) },
        },
        'kind': {
          '@halign': 'center',
          '@text': richNote.chord.toString(),
          '#text': chordType,
        }
      }
    })
  }
}

function firstMeasureInit(partIndex: number, measure: builder.XMLElement, params: MusicParams) {
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
      {
        '@number': 1,
        'sign': { '#text': partIndex > 1 ? 'F' : 'G' },
        'line': { '#text': partIndex > 1 ? '4' : '2' },
        'clef-octave-change': {
          '#text': partIndex <= 1 ? '-1' : '0'
        }
      },
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
      const voice = voiceIndex + 1;
      // const voicePartIndex = ((partIndex * 2) + voiceIndex) + 1;
      const voicePartIndex = partIndex + 1;
      if (voiceIndex == 0) {
        measures[partIndex].push(part.ele({ 'measure': { '@number': 1 }}));
        firstMeasureInit(partIndex, measures[partIndex][measures[partIndex].length - 1], params);
      }
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
          let staff = partIndex + 1;
          addRichNoteToMeasure(richNote, measures[partIndex][measures[partIndex].length - 1], staff, voice, true);
        }
      }
    }
  }

  const ret = root.end({ pretty: true});
  console.log(ret)
  return ret;
}