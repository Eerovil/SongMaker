import { Note } from 'musictheoryjs';
import { RichNote, DivisionedRichnotes } from "./chords"

type Nullable<T>  = T | null

import builder from 'xmlbuilder';

const BEAT_LENGTH = 12
const BEATS_PER_MEASURE = 4

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

function buildPartlist(id: string, name: string) {
  return {
    'score-part': {
      '@id': id,
      'part-name': {
        '#text': name
      }
    }
  };
}

function noteToPitch(note: Note) {
  return {
    'step': { '#text': note.toString().substring(0, 1) },
    'alter': (note.isSharp() ? 1 : note.isFlat() ? - 1 : 0),
    'octave': { '#text': note.octave }
  };
}


function addRichNoteToMeasure(richNote: RichNote, measure: builder.XMLElement, staff: number, firstNoteInChord: boolean) {
  const duration = richNoteDuration(richNote);
  const attrs =  {
    'chord': !firstNoteInChord ? {} : undefined,
    'pitch': noteToPitch(richNote.note),
    'duration': duration.duration,
    'voice': 1,
    'type': duration.type,
    'staff': staff,
  };
  measure.ele({ 'note': attrs });
}

function firstMeasureInit(measure: builder.XMLElement) {
  measure.ele({ 'attributes': {
    'divisions': { '#text': `${BEAT_LENGTH}` },
    'key': {
      'fifths': { '#text': '0' }
    },
    'time': {
      'beats': { '#text': '4' },
      'beat-type': { '#text': '4' }
    },
    'staves': 2,
    clef: [
      {
        '@number': 1,
        'sign': { '#text': 'G' },
        'line': { '#text': '2' }
      },
      {
        '@number': 2,
        'sign': { '#text': 'F' },
        'line': { '#text': '4' }
      }
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
      '@tempo': '40'
    }
  }
});
}


export function toXml(divisionedNotes: DivisionedRichnotes): string {
  const root = builder.create({ 'score-partwise' : { '@version': 3.1 }},
    { version: '1.0', encoding: 'UTF-8', standalone: false},
    {
      pubID: '-//Recordare//DTD MusicXML 3.1 Partwise//EN',
      sysID: 'http://www.musicxml.org/dtds/partwise.dtd'
    }
  );
  root.ele({ 'work': { 'work-title': "My song" }});
  root.ele({ 'part-list': buildPartlist('P1', 'Music' )});
  const part = root.ele({ 'part': { '@id': 'P1' }});

  let measureNumber = 1;
  let currentMeasure: builder.XMLElement = part.ele({ 'measure': { '@number': `${measureNumber}` } });
  firstMeasureInit(currentMeasure);
  for (const division in divisionedNotes) {
    console.log("division", division);
    const divisionNumber = parseInt(division);
    const richNotes = divisionedNotes[division];
    let firstNoteInChord = true;

    for (const richNote of richNotes) {
      addRichNoteToMeasure(richNote, currentMeasure, 2, firstNoteInChord);
      firstNoteInChord = false;
    }
    if (divisionNumber != 0 && divisionNumber % (BEATS_PER_MEASURE * BEAT_LENGTH) === 0) {
      measureNumber++;
      currentMeasure =  part.ele({ 'measure': { '@number': `${measureNumber}` } });
    }
  }

  const ret = root.end({ pretty: true});
  return ret;
}