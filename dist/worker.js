/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/musictheoryjs/dist/musictheory.js":
/*!********************************************************!*\
  !*** ./node_modules/musictheoryjs/dist/musictheory.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
    true ? factory(exports) :
   0;
})(this, (function (exports) { 'use strict';

   /**
    * Notes starting at C0 - zero index - 12 total
    * Maps note names to semitone values starting at C=0
    * @enum
    */
   var Semitone;
   (function (Semitone) {
       Semitone[Semitone["A"] = 9] = "A";
       Semitone[Semitone["As"] = 10] = "As";
       Semitone[Semitone["Bb"] = 10] = "Bb";
       Semitone[Semitone["B"] = 11] = "B";
       Semitone[Semitone["Bs"] = 0] = "Bs";
       Semitone[Semitone["Cb"] = 11] = "Cb";
       Semitone[Semitone["C"] = 0] = "C";
       Semitone[Semitone["Cs"] = 1] = "Cs";
       Semitone[Semitone["Db"] = 1] = "Db";
       Semitone[Semitone["D"] = 2] = "D";
       Semitone[Semitone["Ds"] = 3] = "Ds";
       Semitone[Semitone["Eb"] = 3] = "Eb";
       Semitone[Semitone["E"] = 4] = "E";
       Semitone[Semitone["Es"] = 5] = "Es";
       Semitone[Semitone["Fb"] = 4] = "Fb";
       Semitone[Semitone["F"] = 5] = "F";
       Semitone[Semitone["Fs"] = 6] = "Fs";
       Semitone[Semitone["Gb"] = 6] = "Gb";
       Semitone[Semitone["G"] = 7] = "G";
       Semitone[Semitone["Gs"] = 8] = "Gs";
       Semitone[Semitone["Ab"] = 8] = "Ab";
   })(Semitone || (Semitone = {}));
   /**
    * Returns the whole note name (e.g. C, D, E, F, G, A, B) for
    * the given string
    * @internal
    */
   const getWholeToneFromName = (name) => {
       if (!name || name.length === 0 || name.length > 1)
           throw new Error("Invalid name");
       const key = name[0].toUpperCase();
       return Semitone[key];
   };
   var Semitone$1 = Semitone;

   /**
    * Wraps a number between a min and max value.
    * @param value - the number to wrap
    * @param lower  - the lower bound
    * @param upper - the upper bound
    * @returns wrappedNumber - the wrapped number
    * @internal
    */
   const wrap = (value, lower, upper) => {
       // copies
       let val = value;
       let lbound = lower;
       let ubound = upper;
       // if the bounds are inverted, swap them here
       if (upper < lower) {
           lbound = upper;
           ubound = lower;
       }
       // the amount needed to move the range and value to zero
       const zeroOffset = 0 - lbound;
       // offset the values so that the lower bound is zero
       lbound += zeroOffset;
       ubound += zeroOffset;
       val += zeroOffset;
       // compute the number of times the value will wrap
       let wraps = Math.trunc(val / ubound);
       // case: -1 / ubound(>0) will equal 0 although it wraps once
       if (wraps === 0 && val < lbound)
           wraps = -1;
       // case: ubound and value are the same val/ubound = 1 but actually doesnt wrap
       if (wraps === 1 && val === ubound)
           wraps = 0;
       // needed to handle the case where the num of wraps is 0 or 1 or -1
       let valOffset = 0;
       let wrapOffset = 0;
       if (wraps >= -1 && wraps <= 1)
           wrapOffset = 1;
       // if the value is below the range
       if (val < lbound) {
           valOffset = (val % ubound) + wrapOffset;
           val = ubound + valOffset;
           // if the value is above the range
       }
       else if (val > ubound) {
           valOffset = (val % ubound) - wrapOffset;
           val = lbound + valOffset;
       }
       // add the offset from zero back to the value
       val -= zeroOffset;
       return {
           value: val,
           numWraps: wraps,
       };
   };

   /**
    * Simple util to clamp a number to a range
    * @param pNum - the number to clamp
    * @param pLower - the lower bound
    * @param pUpper - the upper bound
    * @returns Number - the clamped number
    *
    * @internal
    */
   const clamp = (pNum, pLower, pUpper) => Math.max(Math.min(pNum, Math.max(pLower, pUpper)), Math.min(pLower, pUpper));

   //**********************************************************
   // Constants
   //**********************************************************
   const MODIFIED_SEMITONES = [1, 3, 4, 6, 8, 10];
   const TONES_MAX = 11;
   const TONES_MIN = 0;
   const OCTAVE_MAX = 9;
   const OCTAVE_MIN = 0;
   const DEFAULT_OCTAVE = 4;
   const DEFAULT_SEMITONE = 0;

   /**
    * Maps note alterations to  their relative mathmatical value
    *@enum
    */
   var Modifier;
   (function (Modifier) {
       Modifier[Modifier["FLAT"] = -1] = "FLAT";
       Modifier[Modifier["NATURAL"] = 0] = "NATURAL";
       Modifier[Modifier["SHARP"] = 1] = "SHARP";
   })(Modifier || (Modifier = {}));
   /**
    * Parses modifier from string and returns the enum value
    * @internal
    */
   const parseModifier = (modifier) => {
       switch (modifier) {
           case "b":
           case "flat":
               return Modifier.FLAT;
           case "#":
           case "s":
           case "sharp":
               return Modifier.SHARP;
           default:
               return Modifier.NATURAL;
       }
   };
   var Modifier$1 = Modifier;

   // import { registerInitializer } from "../Initializer/Initializer";
   // import table from "./noteLookup.json";
   // import fs from "fs";
   //**********************************************************
   /**
    * Regex for matching note name, modifier, and octave
    */
   //**********************************************************
   const nameRegex$2 = /([A-G])/g;
   const modifierRegex$2 = /(#|s|b)/g;
   const octaveRegex$2 = /([0-9]+)/g;
   //**********************************************************
   /**
    * attempts to parse a note from a string
    */
   //**********************************************************
   const parseNote = (note, supressWarning = false) => {
       try {
           const result = noteLookup(note);
           if (result) {
               return result;
           }
           if (!supressWarning)
               console.warn(`Ineffecient note string formatting - ${note}. Get a performance increase by using the format [A-G][#|s|b][0-9] and using buildTables method(see documentation)`);
       }
       catch (err) {
           if (!supressWarning)
               console.warn(`Ineffecient note string formatting - ${note}. Get a performance increase by using the format [A-G][#|s|b][0-9] and using buildTables method(see documentation)`);
       }
       let noteIdenifier = "";
       let noteModifier = 0;
       let noteOctave = "";
       const nameMatch = note.match(nameRegex$2)?.join("").split("");
       const modifierMatch = note.match(modifierRegex$2)?.join("").split("");
       const octaveMatch = note.match(octaveRegex$2)?.join("").split("");
       // combine all modifiers
       if (modifierMatch) {
           if (modifierMatch.length > 1) {
               // combine all modifiers into an offeset value to be added to the semitone
               noteModifier = modifierMatch
                   .map((item) => parseModifier(item))
                   .reduce((a, b) => a + b);
           }
           else {
               noteModifier = parseModifier(modifierMatch[0]);
           }
       }
       if (octaveMatch) {
           const [octave] = octaveMatch;
           noteOctave = octave;
       }
       if (nameMatch) {
           const [noteName] = nameMatch;
           noteIdenifier = noteName;
           let modifier = 0;
           if (noteModifier)
               modifier = noteModifier;
           const wrappedTone = wrap(getWholeToneFromName(noteIdenifier) + modifier, TONES_MIN, TONES_MAX);
           const semitone = wrappedTone.value;
           let octave = 4;
           if (noteOctave)
               octave = clamp(parseInt(noteOctave, 10), OCTAVE_MIN, OCTAVE_MAX);
           return {
               semitone: semitone,
               octave: octave,
           };
       }
       throw new Error(`Invalid note: ${note}`);
   };
   //**********************************************************
   /**
    * creates a lookup table for all notes formatted as [A-G][#|b|s][0-9]
    */
   //**********************************************************
   const createTable$4 = () => {
       const noteTable = {};
       const noteLetters = ["A", "B", "C", "D", "E", "F", "G"];
       const noteModifiers = ["b", "#", "s"];
       for (const noteLabel of noteLetters) {
           noteTable[noteLabel] = parseNote(noteLabel, true); // 'C' for example
           for (let iModifierOuter = 0; iModifierOuter < noteModifiers.length; ++iModifierOuter) {
               const key = `${noteLabel}${noteModifiers[iModifierOuter]}`;
               noteTable[key] = parseNote(key, true); // 'C#' for example
           }
           for (let iOctave = OCTAVE_MIN; iOctave < OCTAVE_MAX; ++iOctave) {
               const key = `${noteLabel}${iOctave}`;
               noteTable[key] = parseNote(key, true); // 'C4' for example
               for (let iModifier = 0; iModifier < noteModifiers.length; ++iModifier) {
                   const key = `${noteLabel}${noteModifiers[iModifier]}${iOctave}`;
                   noteTable[key] = parseNote(key, true); // 'C#4' for example
               }
           }
       }
       return noteTable;
   };
   /**
    * The lookup table
    */
   let _noteLookup = {};
   const noteLookup = (key) => {
       // buildNoteTable();
       return _noteLookup[key];
   };
   // registerInitializer(() => {
   //    _noteLookup = createTable();
   // });
   // if (table && Object.keys(table).length > 0) {
   //    _noteLookup = table;
   // } else {
   //    _noteLookup = createTable();
   // }
   const buildNoteTable = () => {
       _noteLookup = createTable$4();
       Object.freeze(_noteLookup);
       console.log("built note table");
       return _noteLookup;
   };

   // import { registerInitializer } from "../Initializer/Initializer";
   // import table from "./noteStringLookup.json";
   const UNKNOWN_MODIFIER_NOTE_STRINGS = [
       "C",
       "C#/Db",
       "D",
       "D#/Eb",
       "E",
       "F",
       "F#/Gb",
       "G",
       "G#/Ab",
       "A",
       "A#/Bb",
       "B",
   ];
   const SHARP_NOTE_STRINGS = [
       "C",
       "C#",
       "D",
       "D#",
       "E",
       "F",
       "F#",
       "G",
       "G#",
       "A",
       "A#",
       "B",
   ];
   const FLAT_MODIFIER_NOTE_STRINGS = [
       "C",
       "Db",
       "D",
       "Eb",
       "E",
       "F",
       "Gb",
       "G",
       "Ab",
       "A",
       "Bb",
       "B",
   ];
   const createTable$3 = () => {
       const table = {};
       for (let iTone = TONES_MIN; iTone <= TONES_MAX; ++iTone) {
           for (let iPrev = TONES_MIN; iPrev <= TONES_MAX; ++iPrev) {
               // for (let iOctave = OCTAVE_MIN; iOctave <= OCTAVE_MAX; iOctave++) {
               let modifier = "";
               if (MODIFIED_SEMITONES.includes(iTone)) {
                   modifier = "-"; // has an unknown modifier
                   // if is flat
                   if (wrap(iTone + 1, TONES_MIN, TONES_MAX).value === iPrev)
                       modifier = "b";
                   // is sharp
                   if (wrap(iTone - 1, TONES_MIN, TONES_MAX).value === iPrev)
                       modifier = "#";
               }
               // get note name from table
               table[`${iTone}-${iPrev}`] = getNoteLabel(iTone, modifier);
           }
           // }
       }
       return table;
   };
   const getNoteLabel = (tone, modifier) => {
       switch (modifier) {
           case "#":
               return SHARP_NOTE_STRINGS[tone];
           case "b":
               return FLAT_MODIFIER_NOTE_STRINGS[tone];
           case "-":
           default:
               return UNKNOWN_MODIFIER_NOTE_STRINGS[tone];
       }
   };
   let _noteStringLookup = {};
   const noteStringLookup = (key) => {
       // buildNoteStringTable();
       if (Object.keys(_noteStringLookup).length === 0)
           buildNoteStringTable();
       return _noteStringLookup[key];
   };
   // registerInitializer(() => {
   //    _noteStringLookup = createTable();
   // });
   // if (table && Object.keys(table).length > 0) {
   //    _noteStringLookup = table;
   // } else {
   //    _noteStringLookup = createTable();
   // }
   const buildNoteStringTable = () => {
       // if (Object.keys(_noteStringLookup).length > 0) return _noteStringLookup;
       _noteStringLookup = createTable$3();
       Object.freeze(_noteStringLookup);
       console.log("Note string table built.");
       return _noteStringLookup;
   };

   var IDX=256, HEX=[], SIZE=256, BUFFER;
   while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

   function uid(len) {
   	var i=0, tmp=(len || 11);
   	if (!BUFFER || ((IDX + tmp) > SIZE*2)) {
   		for (BUFFER='',IDX=0; i < SIZE; i++) {
   			BUFFER += HEX[Math.random() * 256 | 0];
   		}
   	}

   	return BUFFER.substring(IDX, IDX++ + tmp);
   }

   // import Identifiable from "../composables/Identifiable";
   /**
    * A note consist of a semitone and an octave.<br>
    *
    * @example
    * ```javascript
    * import { Note } from "musictheoryjs";
    * import { NoteInitializer } from "musictheoryjs"; // typescript only if needed
    * ```
    */
   class Note {
       /**
        * @example
        * ```javascript
        * import { Note } from "musictheoryjs";
        *
        * // creates a new note with default values semitone 0(C) and octave 4
        * const note = new Note();
        *
        * // creates a new note using an initializer object
        * const note = new Note({semitone: 4, octave: 5});
        *
        * // String parsing should follow the format: note-name[modifier][octave]
        * // creates a new note using a string
        * const note = new Note("C5");
        * ```
        */
       constructor(values) {
           if (!values) {
               this.octave = DEFAULT_OCTAVE;
               this.semitone = DEFAULT_SEMITONE;
           }
           else if (typeof values === "string") {
               values = parseNote(values);
               this.octave = values?.octave ?? DEFAULT_OCTAVE;
               this.semitone = values?.semitone ?? DEFAULT_SEMITONE;
               this._prevSemitone = this._tone;
           }
           else {
               // important that octave is set first so that
               // setting the semitone can change the octave
               this.octave = values?.octave ?? DEFAULT_OCTAVE;
               this.semitone = values?.semitone ?? DEFAULT_SEMITONE;
               this._prevSemitone = this._tone;
           }
       }
       /**
        *  unique id for this note(auto generated)
        * @example
        * ```javascript
        * const note = new Note();
        * console.log(note.id); // s2898snloj
        * ```
        */
       id = uid();
       /**
        * semitone
        */
       _tone = DEFAULT_SEMITONE;
       _prevSemitone = DEFAULT_SEMITONE;
       /**
        * @example
        * ```javascript
        * const note = new Note();
        * console.log(note.semitone); // 0
        * ```
        */
       get semitone() {
           return this._tone;
       }
       /**
        * setting the semitone with a number outside the
        * range of 0-11 will wrap the value around and
        * change the octave accordingly
        * @example
        * ```javascript
        * const note = new Note();
        * note.semitone = 4;// E
        * console.log(note.semitone); // 4(E)
        * ```
        */
       set semitone(semitone) {
           const wrapped = wrap(semitone, TONES_MIN, TONES_MAX);
           this._prevSemitone = this._tone;
           this._tone = wrapped.value;
           this._octave = this._octave + wrapped.numWraps;
       }
       /**
        * octave
        */
       _octave = DEFAULT_OCTAVE;
       /**
        * @example
        * ```javascript
        * const note = new Note();
        * console.log(note.octave); // 4
        * ```
        */
       get octave() {
           return this._octave;
       }
       /**
        * The octave is clamped to the range [0, 9].
        * @example
        * ```javascript
        * const note = new Note();
        * note.octave = 10;
        * console.log(note.octave); // 9(because of clamping)
        * ```
        */
       set octave(octave) {
           this._octave = clamp(octave, OCTAVE_MIN, OCTAVE_MAX);
       }
       /**
        * @chainable
        * @returns a new note that is a sharpened version of this note.
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * const note2 = note.sharp();
        * console.log(note2.semitone); // 1(C#)
        * ```
        */
       sharp() {
           return new Note({
               semitone: this.semitone,
               octave: this.octave,
           }).sharpen();
       }
       /**
        * Sharpens the note in place.
        * @chainable
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * note.sharpen();
        * console.log(note.semitone); // 1(C#)
        */
       sharpen() {
           this.semitone = this.semitone + 1;
           return this;
       }
       /**
        *  attempts to determine if the note is sharp
        * @returns true if the note is sharp
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * console.log(note.isSharp()); // false
        * note.sharpen();
        * console.log(note.isSharp()); // true
        * ```
        */
       isSharp() {
           // if note is whole, it can't be sharp
           const modified = MODIFIED_SEMITONES.includes(this.semitone);
           if (!modified)
               return false;
           // if note is flat, it can't be sharp
           if (wrap(this.semitone + 1, TONES_MIN, TONES_MAX).value ===
               this._prevSemitone)
               return false; //is flat
           // Doesn't neccecarily mean it's sharp, but it's a good guess at this point
           return true;
       }
       /**
        * Returns a new note that is a flattened version of this note.
        * @chainable
        * @returns a new note that is a flattened version of this note.
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * const note2 = note.flat();
        * console.log(note2.semitone); // 3(Eb)
        * ```
        */
       flat() {
           return new Note({
               semitone: this.semitone,
               octave: this.octave,
           }).flatten();
       }
       /**
        * Flattens the note in place.
        * @chainable
        * @example
        * ```javascript
        * const note = new Note({semitone: 4}); //  semitone is 4(E)
        * note.flatten();
        * console.log(note.semitone); // 3(Eb)
        * ```
        */
       flatten() {
           this.semitone = this.semitone - 1;
           return this;
       }
       /**
        *  attempts to determine if the note is flat
        * @returns true if the note is flat
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * console.log(note.isFlat()); // false
        * note.flatten();
        * console.log(note.isFlat()); // true
        * ```
        */
       isFlat() {
           // if note is whole, it can't be sharp
           const modified = MODIFIED_SEMITONES.includes(this.semitone);
           if (!modified)
               return false;
           // if note is sharp, it can't be flat
           if (wrap(this.semitone - 1, TONES_MIN, TONES_MAX).value ===
               this._prevSemitone)
               return false; //is sharp
           // Doesn't neccecarily mean it's flat, but it's a good guess at this point
           return true;
       }
       /**
        * @returns true if this note is equal to the given note
        * @example
        * ```javascript
        * const note = new Note();
        * const note2 = new Note();
        * console.log(note.equals(note2)); // true
        * ```
        */
       equals(note) {
           return this.semitone === note.semitone && this.octave === note.octave;
       }
       /**
        * @returns a copy of this note
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * const note2 = note.copy();
        * console.log(note.equals(note2)); // true
        * ```
        */
       copy() {
           return new Note({
               semitone: this.semitone,
               octave: this.octave,
           });
       }
       /**
        * Returns a string version of this note
        * @example
        * ```javascript
        * const note = new Note(); // default semitone is 0(C)
        * console.log(note.toString()); // C4
        * ```
        *
        */
       toString() {
           // console.log(noteStringLookup);
           return (noteStringLookup(`${this._tone}-${this._prevSemitone}`) +
               `${this._octave}`);
       }
       /**
        * Static methods to create whole notes easily.
        * the default octave is 4
        */
       /**
        * @static
        * @param octave
        * @returns note set to A[octave]
        * @example
        * ```javascript
        * const note = Note.A();
        * console.log(note.toString()); // A4
        * ```
        */
       static A(octave = 4) {
           return new Note({
               semitone: Semitone$1.A,
               octave,
           });
       }
       /**
        *
        * @static
        * @param octave
        * @returns note set to B[octave]
        * @example
        * ```javascript
        * const note = Note.B();
        * console.log(note.toString()); // B4
        * ```
        */
       static B(octave = 4) {
           return new Note({
               semitone: Semitone$1.B,
               octave,
           });
       }
       /**
        *
        * @static
        * @param octave
        * @returns note set to C[octave]
        * @example
        * ```javascript
        * const note = Note.C();
        * console.log(note.toString()); // C4
        * ```
        */
       static C(octave = 4) {
           return new Note({
               semitone: Semitone$1.C,
               octave,
           });
       }
       /**
        *
        * @static
        * @param octave
        * @returns note set to D[octave]
        * @example
        * ```javascript
        * const note = Note.D();
        * console.log(note.toString()); // D4
        * ```
        */
       static D(octave = 4) {
           return new Note({
               semitone: Semitone$1.D,
               octave,
           });
       }
       /**
        *
        * @static
        * @param octave
        * @returns note set to E[octave]
        * @example
        * ```javascript
        * const note = Note.E();
        * console.log(note.toString()); // E4
        * ```
        */
       static E(octave = 4) {
           return new Note({
               semitone: Semitone$1.E,
               octave,
           });
       }
       /**
        *
        * @static
        * @param octave
        * @returns note set to F[octave]
        * @example
        * ```javascript
        * const note = Note.F();
        * console.log(note.toString()); // F4
        * ```
        */
       static F(octave = 4) {
           return new Note({
               semitone: Semitone$1.F,
               octave,
           });
       }
       /**
        *
        * @static
        * @param octave
        * @returns note set to G[octave]
        * @example
        * ```javascript
        * const note = Note.G();
        * console.log(note.toString()); // G4
        * ```
        */
       static G(octave = 4) {
           return new Note({
               semitone: Semitone$1.G,
               octave,
           });
       }
   }

   /**
    * Constants
    */
   const MIDIKEY_START = 12;
   const NUM_OCTAVES = 10;
   const NUM_SEMITONES = 12;
   /**
    * Calculates the midi key for a given octave and semitone.
    */
   const calcMidiKey = (octave, semitone) => MIDIKEY_START + octave * NUM_SEMITONES + semitone;
   /**
    * Calculates the frequency for a given octave and semitone given
    * a tuning for a4.
    */
   const calcFrequency = (midiKey, a4Tuning) => 2 ** ((midiKey - 69) / 12) * a4Tuning;
   /**
    * Creates and return lookup tables for midikey and frequency.
    */
   const createTables = (a4Tuning = 440) => {
       /**
        * Maps octave and semitone to note frequency(hertz).
        * requires a key in the form of `<octave>-<semitone>`
        */
       const freqTable = {};
       /**
        * Maps octave and semitone to midi key.
        * requires a key in the form of `<octave>-<semitone>`
        */
       const midiTable = {};
       let iOctave = 0;
       let iSemitone = 0;
       for (iOctave = 0; iOctave < NUM_OCTAVES; ++iOctave) {
           for (iSemitone = 0; iSemitone < NUM_SEMITONES; ++iSemitone) {
               const key = `${iOctave}-${iSemitone}`;
               const mkey = calcMidiKey(iOctave, iSemitone);
               const freq = calcFrequency(mkey, a4Tuning);
               midiTable[key] = mkey;
               freqTable[key] = freq;
           }
       }
       return {
           freqLookup: freqTable,
           midiLookup: midiTable,
       };
   };

   /**
    * Tuning component used by Instrument class<br>
    * containes the a4 tuning - default is 440Hz<br>
    * builds lookup tables for midi key and frequency<br>
    * based on the tuning
    * @internal
    */
   class Tuning {
       /**
        * Creates the object and builds the lookup tables.
        */
       constructor(a4Freq = 440) {
           this._a4 = a4Freq;
           this.buildTables();
       }
       /**
        * unique id for this instance
        */
       id = uid();
       copy() {
           return new Tuning(this._a4);
       }
       equals(other) {
           return this._a4 === other._a4;
       }
       /**
        * a4 Tuning
        */
       _a4 = 440;
       get a4() {
           return this._a4;
       }
       /**
        * setting the tuning will rebuild the lookup tables
        */
       set a4(value) {
           this._a4 = value;
           this.buildTables();
       }
       /**
        * lookup table for midi key
        */
       _midiKeyTable = {};
       midiKeyLookup(octave, semitone) {
           const key = `${octave}-${semitone}`;
           return this._midiKeyTable[key];
       }
       /**
        * lookup table for frequency
        */
       _freqTable = {};
       freqLookup(octave, semitone) {
           const key = `${octave}-${semitone}`;
           return this._freqTable[key];
       }
       /**
        * Builds the lookup tables for midi key and frequency
        */
       buildTables() {
           const tables = createTables(this._a4);
           this._midiKeyTable = tables.midiLookup;
           this._freqTable = tables.freqLookup;
       }
       /**
        * returns the tuning as a string
        */
       toString() {
           return `Tuning(${this._a4})`;
       }
   }

   /**
    * Instrument are used to encapsulate the tuning and retrieving of midi keys
    * and frequencies for notes
    *
    * @example
    * ```javascript
    * import { Instrument } from "musictheoryjs";
    */
   class Instrument {
       tuning;
       /**
        * @param tuning A4 frequency - defaults to 440
        * @example
        * ```javascript
        * const instrument = new Instrument(); // default 440 tuning
        * ```
        */
       constructor(a4Freq = 440) {
           this.tuning = new Tuning(a4Freq);
       }
       /**
        * @returns a unique id for this instance
        * @example
        * ```javascript
        * const instrument = new Instrument();
        * instrument.id; // returns a unique id
        * ```
        */
       id = uid();
       /**
        * @chainable
        * @returns a copy of this instance
        * @example
        * ```javascript
        * const instrument = new Instrument();
        * const copy = instrument.copy();
        * console.log(instrument.equals(copy)); // true
        * ```
        */
       copy() {
           return new Instrument(this.tuning.a4);
       }
       /**
        * @param other the other object to compare
        * @returns  true if the other object is equal to this one
        * @example
        * ```javascript
        * const instrument = new Instrument();
        * const copy = instrument.copy();
        * console.log(instrument.equals(copy)); // true
        * ```
        */
       equals(other) {
           return this.tuning.equals(other.tuning);
       }
       /**
        * @returns the frequency of the given note
        * @example
        * ```javascript
        * const instrument = new Instrument();
        * instrument.getFrequency(new Note("C4")); // returns 261.6255653005986
        * ```
        */
       getFrequency(note) {
           return this.tuning.freqLookup(note.octave, note.semitone);
       }
       /**
        * @returns the midi key of the given note
        * @example
        * ```javascript
        * const instrument = new Instrument();
        * instrument.getMidiKey(new Note("C4")); // returns 60
        * ```
        */
       getMidiKey(note) {
           return this.tuning.midiKeyLookup(note.octave, note.semitone);
       }
       /**
        * @returns the tuning as a string
        * @example
        * ```javascript
        * const instrument = new Instrument();
        * console.log(instrument.toString()); // returns "Instrument Tuning(440)"
        * ```
        */
       toString() {
           return `Instrument Tuning(${this.tuning.a4})`;
       }
   }

   const DEFAULT_SCALE_TEMPLATE = [0, 2, 2, 1, 2, 2, 2]; // major
   Object.freeze(DEFAULT_SCALE_TEMPLATE);

   /**
    * Maps predefined scales to their names.
    */
   const ScaleTemplates = {
       wholeTone: [0, 2, 2, 2, 2, 2, 2],
       // major
       major: [0, 2, 2, 1, 2, 2, 2],
       major7s4s5: [0, 2, 2, 2, 2, 1, 2],
       // modes
       // ionian: [], // set below - same as major
       // aeolian: [], // set below - same as minor
       dorian: [0, 2, 1, 2, 2, 2, 1],
       phrygian: [0, 1, 2, 2, 2, 1, 2],
       lydian: [0, 2, 2, 2, 1, 2, 2],
       lydianDominant: [0, 2, 2, 2, 1, 2, 1],
       // acoustic: [], // set below - same as lydianDominant
       mixolydian: [0, 2, 2, 1, 2, 2, 1],
       mixolydianFlat6: [0, 2, 2, 1, 2, 1, 2],
       locrian: [0, 1, 2, 2, 1, 2, 2],
       superLocrian: [0, 1, 2, 1, 2, 2, 2],
       // minor
       minor: [0, 2, 1, 2, 2, 1, 2],
       minor7b9: [0, 1, 2, 2, 2, 2, 1],
       minor7b5: [0, 2, 1, 2, 1, 2, 2],
       // halfDiminished: [], // set below - same as minor7b5
       // harmonic
       harmonicMajor: [0, 2, 2, 1, 2, 1, 3],
       harmonicMinor: [0, 2, 1, 2, 2, 1, 3],
       doubleHarmonic: [0, 1, 3, 1, 2, 1, 3],
       // byzantine: [], // set below - same as doubleHarmonic
       // melodic
       melodicMinorAscending: [0, 2, 1, 2, 2, 2, 2],
       melodicMinorDescending: [0, 2, 2, 1, 2, 2, 1],
       // pentatonic
       majorPentatonic: [0, 2, 2, 3, 2],
       majorPentatonicBlues: [0, 2, 1, 1, 3, 2],
       minorPentatonic: [0, 3, 2, 2, 3],
       minorPentatonicBlues: [0, 3, 2, 1, 1, 3],
       b5Pentatonic: [0, 3, 2, 1, 4, 2],
       minor6Pentatonic: [0, 3, 2, 2, 2, 3],
       // enigmatic
       enigmaticMajor: [0, 1, 3, 2, 2, 2, 1],
       enigmaticMinor: [0, 1, 2, 3, 1, 3, 1],
       // 8Tone
       dim8Tone: [0, 2, 1, 2, 1, 2, 1, 2],
       dom8Tone: [0, 1, 2, 1, 2, 1, 2, 1],
       // neapolitan
       neapolitanMajor: [0, 1, 2, 2, 2, 2, 2],
       neapolitanMinor: [0, 1, 2, 2, 2, 1, 3],
       // hungarian
       hungarianMajor: [0, 3, 1, 2, 1, 2, 1],
       hungarianMinor: [0, 2, 1, 3, 1, 1, 3],
       hungarianGypsy: [0, 1, 3, 1, 2, 1, 3],
       // spanish
       spanish: [0, 1, 2, 1, 2, 2, 2],
       spanish8Tone: [0, 1, 2, 1, 1, 1, 2, 2],
       // jewish: [], // set below - same as spanish8Tone
       spanishGypsy: [0, 1, 3, 1, 2, 1, 2],
       // aug dom
       augmented: [0, 3, 1, 3, 1, 3, 1],
       dominantSuspended: [0, 2, 3, 2, 2, 1, 2],
       // bebop
       bebopMajor: [0, 2, 2, 1, 2, 1, 1, 2],
       bebopDominant: [0, 2, 2, 1, 2, 2, 1, 1],
       mystic: [0, 2, 2, 2, 3, 2],
       overtone: [0, 2, 2, 2, 1, 1, 2],
       leadingTone: [0, 2, 2, 2, 2, 2, 1],
       // japanese
       hirojoshi: [0, 2, 1, 4, 1],
       japaneseA: [0, 1, 4, 1, 3],
       japaneseB: [0, 2, 3, 1, 3],
       // cultures
       oriental: [0, 1, 3, 1, 1, 3, 1],
       persian: [0, 1, 4, 1, 2, 3],
       arabian: [0, 2, 2, 1, 1, 2, 2],
       balinese: [0, 1, 2, 4, 1],
       kumoi: [0, 2, 1, 4, 2, 2],
       pelog: [0, 1, 2, 3, 1, 1],
       algerian: [0, 2, 1, 2, 1, 1, 1, 3],
       chinese: [0, 4, 2, 1, 4],
       mongolian: [0, 2, 2, 3, 2],
       egyptian: [0, 2, 3, 2, 3],
       romainian: [0, 2, 1, 3, 1, 2, 1],
       hindu: [0, 2, 2, 1, 2, 1, 2],
       insen: [0, 1, 4, 2, 3],
       iwato: [0, 1, 4, 1, 4],
       scottish: [0, 2, 3, 2, 2],
       yo: [0, 3, 2, 2, 3],
       istrian: [0, 1, 2, 2, 2, 1, 2],
       ukranianDorian: [0, 2, 1, 3, 1, 2, 1],
       petrushka: [0, 1, 3, 2, 1, 3],
       ahavaraba: [0, 1, 3, 1, 2, 1, 2],
   };
   // duplicates with aliases
   ScaleTemplates.halfDiminished = ScaleTemplates.minor7b5;
   ScaleTemplates.jewish = ScaleTemplates.spanish8Tone;
   ScaleTemplates.byzantine = ScaleTemplates.doubleHarmonic;
   ScaleTemplates.acoustic = ScaleTemplates.lydianDominant;
   ScaleTemplates.aeolian = ScaleTemplates.minor;
   ScaleTemplates.ionian = ScaleTemplates.major;
   Object.keys(ScaleTemplates).forEach((element) => Object.freeze(ScaleTemplates[element]));

   /**
    * Regex for matching note name, modifier, and octave
    */
   const nameRegex$1 = /([A-G])(?![^(]*\))/g;
   const modifierRegex$1 = /(#|s|b)(?![^(]*\))/g;
   const octaveRegex$1 = /([0-9]+)(?![^(]*\))/g;
   const scaleNameRegex = /(\([a-zA-Z]{2,}\))/g;
   /**
    * attempts to parse a note from a string
    * @param scale - the string to parse
    * @param supressWarning - supress the warning for ineffeciency if true
    * @internal
    */
   const parseScale = (scale, supressWarning = false) => {
       try {
           const result = scaleLookup(scale);
           if (result) {
               return result;
           }
           if (!supressWarning)
               console.warn(`Ineffecient scale string formatting - ${scale}. Get a performanc increase by using a valid format`);
       }
       catch (err) {
           if (!supressWarning)
               console.warn(`Ineffecient scale string formatting - ${scale}. Get a performanc increase by using a valid format`);
       }
       let noteIdenifier = "";
       let noteModifier = 0;
       let noteOctave = "";
       let scaleName = "";
       const nameMatch = scale.match(nameRegex$1)?.join("").split("");
       const modifierMatch = scale.match(modifierRegex$1)?.join("").split("");
       const octaveMatch = scale.match(octaveRegex$1)?.join("").split("");
       const scaleNameMatch = scale.match(scaleNameRegex)?.join("").split("");
       // combine all modifiers
       if (modifierMatch) {
           if (modifierMatch.length > 1) {
               // combine all modifiers into an offeset value to be added to the semitone
               noteModifier = modifierMatch
                   .map((item) => parseModifier(item))
                   .reduce((a, b) => a + b);
           }
           else {
               noteModifier = parseModifier(modifierMatch[0]);
           }
       }
       if (octaveMatch) {
           const [octave] = octaveMatch;
           noteOctave = octave;
       }
       if (scaleNameMatch) {
           const sName = scaleNameMatch.join("");
           // console.log(sName);
           scaleName = sName;
       }
       if (nameMatch) {
           const [noteName] = nameMatch;
           noteIdenifier = noteName;
           let modifier = 0;
           if (noteModifier)
               modifier = noteModifier;
           const wrappedTone = wrap(getWholeToneFromName(noteIdenifier) + modifier, TONES_MIN, TONES_MAX);
           const semitone = wrappedTone.value;
           let octave = 4;
           if (noteOctave)
               octave = clamp(parseInt(noteOctave, 10), OCTAVE_MIN, OCTAVE_MAX);
           let templateIndex = 1; // default major scale
           if (scaleName) {
               templateIndex = Object.keys(ScaleTemplates).findIndex((template) => template
                   .toLowerCase()
                   .includes(scaleName.toLowerCase().replace(/\(|\)/g, "")));
           }
           // console.log(Object.keys(ScaleTemplates)[templateIndex]);
           if (templateIndex === -1) {
               console.log("UNKNOWN TEMPLATE", scaleName);
               throw new Error(`Unable to find template for scale ${scaleName}`);
           }
           const template = ScaleTemplates[Object.keys(ScaleTemplates)[templateIndex]];
           return {
               key: semitone,
               octave: octave,
               template: template,
           };
       }
       throw new Error(`Invalid Scale: ${scale}`);
   };
   /**
    * creates a lookup table for all notes formatted as [A-G][#|b|s][0-9]
    * @internal
    */
   const createTable$2 = () => {
       const scaleTable = {};
       const noteLetters = ["A", "B", "C", "D", "E", "F", "G"];
       const noteModifiers = ["b", "#", "s"];
       const templates = Object.keys(ScaleTemplates);
       for (const template of templates) {
           for (const noteLabel of noteLetters) {
               //ex A(minor)
               scaleTable[`${noteLabel}(${template})`] = parseScale(noteLabel, true); // 'C' for example
               for (const mod of noteModifiers) {
                   const key = `${noteLabel}${mod}(${template})`;
                   // ex A#(minor)
                   scaleTable[key] = parseScale(key, true); // 'C#' for example
               }
               for (let iOctave = OCTAVE_MIN; iOctave < OCTAVE_MAX; ++iOctave) {
                   const key = `${noteLabel}${iOctave}(${template})`;
                   // ex A4(minor)
                   scaleTable[key] = parseScale(key, true); // 'C4' for example
                   for (const mod of noteModifiers) {
                       const key = `${noteLabel}${mod}${iOctave}(${template})`;
                       // ex A#4(minor)
                       scaleTable[key] = parseScale(key, true); // 'C#4' for example
                   }
               }
           }
       }
       return scaleTable;
   };
   /**
    * creates the lookup table as soon as the module is loaded
    * @internal
    */
   let _scaleLookup = {};
   const scaleLookup = (key) => {
       // buildScaleTable();
       return _scaleLookup[key];
   };
   // if (table && Object.keys(table).length > 0) {
   //    _scaleLookup = table as { [key: string]: ScaleInitializer };
   // } else {
   //    _scaleLookup = createTable();
   // }
   const buildScaleTable = () => {
       // if (Object.entries(_scaleLookup).length > 0) return _scaleLookup;
       _scaleLookup = createTable$2();
       // Object.freeze(_scaleLookup);
       console.log("Scale Table Built");
       return _scaleLookup;
   };

   /**
    * shifts an array by a given distance
    * @param arr the array to shift
    * @param distance the distance to shift
    * @returns the shifted array
    * @internal
    */
   const shift = (arr, dist = 1) => {
       arr = [...arr]; // copy
       if (dist > arr.length || dist < 0 - arr.length)
           throw new Error("shift: distance is greater than array length");
       if (dist > 0) {
           const temp = arr.splice(arr.length - dist, Infinity);
           arr.unshift(...temp);
       }
       if (dist < 0) {
           const temp = arr.splice(0, dist);
           arr.push(...temp);
       }
       return arr;
   };

   /**
    *  Simple util to lazy clone an object
    * @internal
    */
   const clone = (obj) => {
       return JSON.parse(JSON.stringify(obj));
   };

   /**
    * simple util to lazy check equality of objects and arrays
    * @internal
    */
   const isEqual = (a, b) => {
       const stringA = JSON.stringify(a);
       const stringB = JSON.stringify(b);
       return stringA === stringB;
   };

   // import table from "./noteStringLookup.json";
   /**
    * Will lookup a scale name based on the template.
    * @param template - the template to lookup
    * @param supressWarning - supress the warning for ineffeciency if true
    * @returns the scale name
    * @internal
    */
   const scaleNameLookup = (template, supressWarning = false) => {
       try {
           const result = nameTable(JSON.stringify(template));
           if (result)
               return result;
       }
       catch (e) {
           if (!supressWarning)
               console.warn(e);
       }
       const keys = Object.keys(ScaleTemplates);
       const values = Object.values(ScaleTemplates);
       const scaleNames = [];
       for (let i = 0; i < keys.length; ++i) {
           if (isEqual(values[i], template)) {
               scaleNames.push(keys[i].charAt(0).toUpperCase() + keys[i].slice(1));
           }
       }
       const scaleNamesString = scaleNames.join(" AKA ");
       return scaleNamesString;
   };
   const createTable$1 = () => {
       const table = {};
       for (const template of Object.values(ScaleTemplates)) {
           table[JSON.stringify(template)] = scaleNameLookup(template, true);
       }
       return table;
   };
   let _nameTable = {};
   const nameTable = (key) => {
       // buildScaleNameTable();
       return _nameTable[key];
   };
   // if (table && Object.keys(table).length > 0) {
   //    _nameTable = table;
   // } else {
   //    _nameTable = createTable();
   // }
   const buildScaleNameTable = () => {
       // if (Object.entries(_nameTable).length > 0) return _nameTable;
       _nameTable = createTable$1();
       Object.freeze(_nameTable);
       console.log("Scale name table built");
       return _nameTable;
   };

   /**
    * Scales consist of a key(tonic or root) and a template(array of integers) that
    * <br> represents the interval of steps between each note.
    * <br><br>Scale intervals are represented by an integer
    * <br>that is the number of semitones between each note.
    * <br>0 = key - will always represent the tonic
    * <br>1 = half step
    * <br>2 = whole step
    * <br>3 = one and one half steps
    * <br>4 = double step
    * <br>[0, 2, 2, 1, 2, 2, 2] represents the major scale
    * <br><br> Scale templates may have arbitray lengths
    *
    * The following Pre-defined templates are available:
    * <table>
    * <tr>
    * <td>major</td>
    * <td>minor</td>
    * <td>ionian</td>
    * <td>dorian</td>
    * </tr><tr>
    * <td>phrygian</td>
    * <td>lydian</td>
    * <td>mixolydian</td>
    * <td>aeolian</td>
    * </tr><tr>
    * <td>locrian</td>
    * <td>enigmaticMajor</td>
    * <td>enigmaticMinor</td>
    * <td>minor7b5</td>
    * </tr><tr>
    * <td>major7s4s5</td>
    * <td>harmonicMajor</td>
    * <td>harmonicMinor</td>
    * <td>doubleHarmonic</td>
    * </tr><tr>
    * <td>melodicMinorAscending</td>
    * <td>melodicMinorDescending</td>
    * <td>majorPentatonic</td>
    * <td>majorPentatonicBlues</td>
    * </tr><tr>
    * <td>minorPentatonic</td>
    * <td>minorPentatonicBlues</td>
    * <td>b5Pentatonic</td>
    * <td>minor6Pentatonic</td>
    * </tr><tr>
    * <td>dim8Tone</td>
    * <td>dom8Tone</td>
    * <td>neopolitanMajor</td>
    * <td>neopolitanMinor</td>
    * </tr><tr>
    * <td>hungarianMajor</td>
    * <td>hungarianMinor</td>
    * <td>hungarianGypsy</td>
    * <td>spanish</td>
    * </tr><tr>
    * <td>spanish8Tone</td>
    * <td>spanishGypsy</td>
    * <td>augmented</td>
    * <td>dominantSuspended</td>
    * </tr><tr>
    * <td>bebopMajor</td>
    * <td>bebopDominant</td>
    * <td>mystic</td>
    * <td>overtone</td>
    * </tr><tr>
    * <td>leadingTone</td>
    * <td>hirojoshi</td>
    * <td>japaneseA</td>
    * <td>japaneseB</td>
    * </tr><tr>
    * <td>oriental</td>
    * <td>arabian</td>
    * <td>persian</td>
    * <td>balinese</td>
    * </tr><tr>
    * <td>kumoi</td>
    * <td>pelog</td>
    * <td>algerian</td>
    * <td>chinese</td>
    * </tr><tr>
    * <td>mongolian</td>
    * <td>egyptian</td>
    * <td>hindu</td>
    * <td>romanian</td>
    * </tr><tr>
    * <td>hindu</td>
    * <td>insen</td>
    * <td>iwato</td>
    * <td>scottish</td>
    * </tr><tr>
    * <td>yo</td>
    * <td>istrian</td>
    * <td>ukranianDorian</td>
    * <td>petrushka</td>
    * </tr><tr>
    * <td>ahavaraba</td>
    * <td>halfDiminished</td>
    * <td>jewish</td>
    * <td>byzantine</td>
    * </tr><tr>
    * <td>acoustic</td>
    * </table>
    *
    * @example
    * ```javascript
    * import {Scale} from 'musictheoryjs';
    * import {ScaleTemplates} from 'musictheoryjs';
    * import {ScaleInitializer} from 'musictheoryjs'; // TypeScript only if needed
    * ```
    */
   class Scale {
       /**
        * @example
        * ```javascript
        * import {Scale, ScaleTemplates} from 'musictheoryjs';
        *
        * // creates a scale with the default template, key 0f 0(C) and an octave of 4
        * const scale = new Scale();
        *
        * // creates a scale with the template [0, 2, 2, 1, 2, 2, 2] and key 4(E) and octave 5
        * const scale2 = new Scale({key: 4, octave: 5, template: ScaleTemplates.major});
        *
        *
        * // String parsing should follow the format: note-name[alteration][octave][(scale-name)]
        * // creates a scale with the minor template, key Gb and an octave of 7
        * const scale3 = new Scale('Gb7(minor)');
        * ```
        */
       constructor(values) {
           if (!values) {
               this.template = DEFAULT_SCALE_TEMPLATE;
               this.key = DEFAULT_SEMITONE;
               this.octave = DEFAULT_OCTAVE;
           }
           else if (typeof values === "string") {
               values = parseScale(values);
               this.template = [...(values?.template ?? DEFAULT_SCALE_TEMPLATE)];
               this.key = values.key || DEFAULT_SEMITONE;
               this.octave = values.octave || DEFAULT_OCTAVE;
           }
           else {
               // important that octave is set first so that
               // setting the semitone can change the octave
               this.template = [...(values?.template ?? DEFAULT_SCALE_TEMPLATE)];
               this.key = values.key || DEFAULT_SEMITONE;
               this.octave = values.octave || DEFAULT_OCTAVE;
           }
           this._notesDirty = true;
       }
       /**
        *  unique id for this scale(auto generated)
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.id); // dhlkj5j322
        * ```
        */
       id = uid();
       /**
        * Returns true if this scale is equal to the given scale
        * @param scale - the scale to compare to
        * @returns true if the scales are equal
        * @example
        * ```javascript
        * const scale = new Scale();
        * const scale2 = new Scale();
        * console.log(scale.equals(scale2)); // true
        * ```
        */
       equals(scale) {
           return (this._key === scale._key &&
               this._octave === scale._octave &&
               isEqual(this._template, scale._template));
       }
       /**
        * Returns a copy of this Scale
        * @chainable
        * @returns a copy of this Scale
        * @example
        * ```javascript
        * const scale = new Scale();
        * const scale2 = scale.copy();
        * console.log(scale.equals(scale2)); // true
        * ```
        */
       copy() {
           const scale = new Scale({
               key: this.key,
               octave: this.octave,
               template: clone(this.template),
           });
           if (this._shiftedInterval !== 0)
               scale.shift(this._shiftedInterval);
           return scale;
       }
       /**
        * key
        */
       _key = 0;
       /**
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.key); // 0(semitone)
        * ```
        */
       get key() {
           return this._key;
       }
       /**
        * Setting the semitone to a value outside of the range [0, 11](semitone) will<br/>
        * wrap the semitone to the range [0, 11] and change the octave depending<br/>
        * on how many times the semitone has been wrapped.
        * @example
        * ```javascript
        * const scale = new Scale();
        * scale.key = 4;
        * console.log(scale.key); // 4
        * ```
        */
       set key(value) {
           const wrapped = wrap(value, TONES_MIN, TONES_MAX);
           this.octave = this.octave + wrapped.numWraps;
           this._key = wrapped.value;
           this._notesDirty = true;
       }
       /**
        * octave
        */
       _octave = DEFAULT_OCTAVE;
       /**
        * The octave is clamped to the range [0, 9].
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.octave); // 4
        * ```
        */
       get octave() {
           return this._octave;
       }
       /**
        * @example
        * ```javascript
        * const scale = new Scale();
        * scale.octave = 5;
        * console.log(scale.octave); // 5
        * ```
        */
       set octave(value) {
           this._octave = clamp(value, OCTAVE_MIN, OCTAVE_MAX);
           this._notesDirty = true;
       }
       /**
        * template
        */
       _template = [];
       /**
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.template); // [0, 2, 2, 1, 2, 2, 2]
        * ```
        */
       get template() {
           return clone(this._template);
       }
       /**
        * The following Pre-defined templates are available:
        * <table>
        * <tr>
        * <td>major</td>
        * <td>minor</td>
        * <td>ionian</td>
        * <td>dorian</td>
        * </tr><tr>
        * <td>phrygian</td>
        * <td>lydian</td>
        * <td>mixolydian</td>
        * <td>aeolian</td>
        * </tr><tr>
        * <td>locrian</td>
        * <td>enigmaticMajor</td>
        * <td>enigmaticMinor</td>
        * <td>minor7b5</td>
        * </tr><tr>
        * <td>major7s4s5</td>
        * <td>harmonicMajor</td>
        * <td>harmonicMinor</td>
        * <td>doubleHarmonic</td>
        * </tr><tr>
        * <td>melodicMinorAscending</td>
        * <td>melodicMinorDescending</td>
        * <td>majorPentatonic</td>
        * <td>majorPentatonicBlues</td>
        * </tr><tr>
        * <td>minorPentatonic</td>
        * <td>minorPentatonicBlues</td>
        * <td>b5Pentatonic</td>
        * <td>minor6Pentatonic</td>
        * </tr><tr>
        * <td>dim8Tone</td>
        * <td>dom8Tone</td>
        * <td>neopolitanMajor</td>
        * <td>neopolitanMinor</td>
        * </tr><tr>
        * <td>hungarianMajor</td>
        * <td>hungarianMinor</td>
        * <td>hungarianGypsy</td>
        * <td>spanish</td>
        * </tr><tr>
        * <td>spanish8Tone</td>
        * <td>spanishGypsy</td>
        * <td>augmented</td>
        * <td>dominantSuspended</td>
        * </tr><tr>
        * <td>bebopMajor</td>
        * <td>bebopDominant</td>
        * <td>mystic</td>
        * <td>overtone</td>
        * </tr><tr>
        * <td>leadingTone</td>
        * <td>hirojoshi</td>
        * <td>japaneseA</td>
        * <td>japaneseB</td>
        * </tr><tr>
        * <td>oriental</td>
        * <td>arabian</td>
        * <td>persian</td>
        * <td>balinese</td>
        * </tr><tr>
        * <td>kumoi</td>
        * <td>pelog</td>
        * <td>algerian</td>
        * <td>chinese</td>
        * </tr><tr>
        * <td>mongolian</td>
        * <td>egyptian</td>
        * <td>hindu</td>
        * <td>romanian</td>
        * </tr><tr>
        * <td>hindu</td>
        * <td>insen</td>
        * <td>iwato</td>
        * <td>scottish</td>
        * </tr><tr>
        * <td>yo</td>
        * <td>istrian</td>
        * <td>ukranianDorian</td>
        * <td>petrushka</td>
        * </tr><tr>
        * <td>ahavaraba</td>
        * <td>halfDiminished</td>
        * <td>jewish</td>
        * <td>byzantine</td>
        * </tr><tr>
        * <td>acoustic</td>
        * </table>
        * @example
        * ```javascript
        * const scale = new Scale();
        * scale.template = [0, 2, 2, 1, 2, 2, 2];
        * console.log(scale.template); // [0, 2, 2, 1, 2, 2, 2]
        * ```
        */
       set template(value) {
           this._template = clone(value);
           this._shiftedInterval = 0;
           this._notesDirty = true;
       }
       /**
        * notes
        * notes are generated and cached as needed
        */
       _notes = [];
       _notesDirty = true;
       /**
        * will generate the notes if needed or return the cached notes
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.notes); // List of notes
        * ```
        */
       get notes() {
           if (this._notesDirty) {
               this.generateNotes();
               this._notesDirty = false;
           }
           return this._notes;
       }
       /**
        * generate notes(internal)
        * generates the notes for this scale
        */
       generateNotes() {
           // use the template unshifted for simplicity
           const unshiftedTemplate = shift(this._template, -this._shiftedInterval);
           // if allowing this to change the octave is undesirable
           // then may need to pre wrap the tone and use
           // the final value
           const notes = [];
           let accumulator = this.key;
           for (const interval of unshiftedTemplate) {
               const tone = interval === 0
                   ? (accumulator = this.key)
                   : (accumulator += interval);
               const note = new Note({
                   semitone: tone,
                   octave: this.octave,
               });
               notes.push(note);
           }
           // shift notes back to original position
           if (this._shiftedInterval > 0) {
               const temp = notes.splice(notes.length - (this._shiftedInterval + 1), Infinity);
               notes.unshift(...temp);
           }
           if (this._shiftedInterval < 0) {
               const temp = notes.splice(0, this._shiftedInterval);
               notes.push(...temp);
           }
           this._notes = notes;
       }
       /**
        * returns the names of the notes in the scale
        * @param preferSharpKeys - if true then sharps will be preferred over flats when semitones could be either - ex: Bb/A#
        * @returns the names of the notes in the scale
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.names); // ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
        * ```
        */
       getNoteNames(preferSharpKey = true) {
           const names = scaleNoteNameLookup(this, preferSharpKey);
           return names;
       }
       /**
        * degree
        * returns a note that represents the given degree
        * @param degree - the degree to return
        * @returns a note that represents the given degree
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.degree(0)); // C4(Note)
        * console.log(scale.degree(1)); // D4(Note) etc
        * ```
        */
       degree(degree) {
           const wrapped = wrap(degree - 1 /*zero index */, 0, this.notes.length - 1);
           const note = this.notes[wrapped.value].copy();
           note.octave = this.octave + wrapped.numWraps;
           return note;
       }
       /**
        * relative major
        * returns a new scale that is the relative major of this scale - takes the 3rd degree as it's key
        * @chainable
        * @returns a new scale that is the relative major of this scale
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.relativeMajor()); // Scale
        * ```
        */
       relativeMajor() {
           const major = new Scale({
               template: ScaleTemplates.major,
               key: this.degree(3).semitone,
               octave: this.octave,
           });
           return major;
       }
       /**
        * relative minor
        * returns a new scale that is the relative minor of this scale - takes the 6th degree as it's key
        * @chainable
        * @returns a new scale that is the relative minor of this scale
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.relativeMinor()); // Scale
        * ```
        */
       relativeMinor() {
           const minor = new Scale({
               template: ScaleTemplates.minor,
               key: this.degree(6).semitone,
               octave: this.octave,
           });
           return minor;
       }
       /**
        * shift
        */
       _shiftedInterval = 0;
       _originalTemplate = [];
       /**
        * shift
        * shifts the scale by the given number of degrees
        * @chainable
        * @param shift - the number of degrees to shift the scale
        * @returns a new scale that is the shifted scale
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.shift(1)); // Scale
        * ```
        */
       shift(degrees = 1) {
           if (this._shiftedInterval === 0) {
               this._originalTemplate = clone(this._template);
           }
           this._template = shift(this._template, degrees);
           this._shiftedInterval += degrees;
           this._notesDirty = true;
           return this;
       }
       /**
        * shifted
        * returns a copy of this scale shifted by the given number of degrees
        * @chainable
        * @param degrees - the number of degrees to shift the scale
        * @returns a copy of this scale shifted by the given number of degrees
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.shifted(1)); // Scale(copy)
        * ```
        */
       shifted(degrees = 1) {
           const scale = this.copy();
           scale.shift(degrees);
           return scale;
       }
       /**
        * unshift
        * shifts the original root back to the root position
        * @chainable
        * @returns this scale after unshifting it back to the original root position
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.shift(1));
        * console.log(scale.unshift());
        * ```
        */
       unshift() {
           if (this._shiftedInterval !== 0) {
               if (this._originalTemplate.length > 0) {
                   this._template = this._originalTemplate;
               }
               // this.shift(this._shiftedInterval * -1);
               this._shiftedInterval = 0;
               this._originalTemplate = [];
               this._notesDirty = true;
           }
           return this;
       }
       /**
        * unshifted
        * returns a copy of this scale with the tonic shifted back
        * to the root position
        * @chainable
        * @returns a copy of this scale with the tonic shifted back
        * to the root position
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.shift(1));
        * console.log(scale.unshifted()); // Scale(copy)
        * ```
        */
       unshifted() {
           const scale = this.copy();
           if (this._originalTemplate.length)
               scale.template = this._originalTemplate;
           scale.unshift();
           return scale;
       }
       /**
        * returns the amount that the scale has shifted
        * (0 if not shifted)
        * @returns the amount that the scale has shifted
        * (0 if not shifted)
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.shift(1));
        * console.log(scale.shifted()); // 1
        * ```
        */
       shiftedInterval() {
           return this._shiftedInterval;
       }
       /**
        * Scale modes
        */
       /**
        * @chainable
        * @returns a copy of this scale in the Ionian(major) mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.ionian()); // Scale(copy)
        * ```
        */
       ionian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.ionian;
           return scale;
       }
       /**
        * @chainable
        * @returns a copy of this scale in the Dorian mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.dorian()); // Scale(copy)
        * ```
        */
       dorian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.dorian;
           return scale;
       }
       /**
        * @chainable
        * @returns a copy of this scale in the Phrygian mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.phrygian()); // Scale(copy)
        * ```
        */
       phrygian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.phrygian;
           return scale;
       }
       /**
        * @chainable
        * @returns a copy of this scale in the Lydian mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.lydian()); // Scale(copy)
        * ```
        */
       lydian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.lydian;
           return scale;
       }
       /**
        * @chainable
        * @returns a copy of this scale in the Mixolydian mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.mixolydian()); // Scale(copy)
        * ```
        */
       mixolydian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.mixolydian;
           return scale;
       }
       /**
        * @chainable
        * @returns a copy of this scale in the Aeolian(minor) mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.aeolian()); // Scale(copy)
        * ```
        */
       aeolian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.aeolian;
           return scale;
       }
       /**
        * @chainable
        * @returns a copy of this scale in the Locrian mode
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.locrian()); // Scale(copy)
        * ```
        */
       locrian() {
           const scale = this.copy();
           scale.template = ScaleTemplates.locrian;
           return scale;
       }
       /**
        * returns string version of the scale
        * @returns string version of the scale
        * @example
        * ```javascript
        * const scale = new Scale();
        * console.log(scale.toString()); // 'C'
        * ```
        */
       toString() {
           let scaleNames = scaleNameLookup(this._template);
           if (!scaleNames)
               scaleNames = this.getNoteNames().join(", ");
           return `${Semitone$1[this._key]}${this._octave}(${scaleNames})`;
       }
   }
   /**
    * attempts to lookup the note name for a scale efficiently
    * @param scale - the scale to lookup
    * @param preferSharpKey - if true, will prefer sharp keys over flat keys
    * @returns the note names for the scale
    * @internal
    */
   const scaleNoteNameLookup = (scale, preferSharpKey = true) => {
       try {
           const key = `${scale.key}-${scale.octave}-${JSON.stringify(scale.template)}`;
           const notes = notesLookup(key);
           if (notes) {
               return notes;
           }
       }
       catch (e) {
           // do nothing
       }
       let notes = [...scale.notes];
       notes = shift(notes, -scale.shiftedInterval()); //unshift back to key = 0 index
       const notesParts = notes.map((note) => note.toString().split("/"));
       const octaves = notes.map((note) => note.octave);
       const removables = ["B#", "Bs", "Cb", "E#", "Es", "Fb"];
       const noteNames = [];
       for (const [i, noteParts] of notesParts.entries()) {
           //remove Cb B# etc
           for (const part of noteParts) {
               // remove any numbers from the note name(octave)
               // part.replace(/\d/g, "");
               if (removables.includes(part)) {
                   const index = noteNames.indexOf(part);
                   noteNames.splice(index, 1);
               }
           }
           if (noteNames.length === 0) {
               noteNames.push(preferSharpKey ? noteParts[0] : noteParts[noteParts.length - 1]);
               continue;
           }
           if (noteParts.length === 1) {
               noteNames.push(noteParts[0]);
               continue;
           }
           const wholeNotes = [
               "A",
               "B",
               "C",
               "D",
               "E",
               "F",
               "G",
               "A",
               "B",
               "C",
               "D",
               "E",
               "F",
               "G",
           ];
           const lastWholeNote = noteNames[noteNames.length - 1][0];
           const lastIndex = wholeNotes.indexOf(lastWholeNote);
           const nextNote = wholeNotes[lastIndex + 1];
           if (noteParts[0].includes(nextNote)) {
               const hasOctave = noteParts[0].match(/\d/g);
               noteNames.push(noteParts[0] + (hasOctave ? "" : octaves[i]));
               continue;
           }
           const hasOctave = noteParts[noteParts.length - 1].match(/\d/g);
           noteNames.push(noteParts[noteParts.length - 1] + (hasOctave ? "" : octaves[i]));
       }
       const shiftedNoteNames = shift(noteNames, scale.shiftedInterval());
       return shiftedNoteNames;
   };
   /**
    * creates a lookup table for all notes formatted as [A-G][#|b|s][0-9]
    */
   const createNotesLookupTable = () => {
       const scaleTable = {};
       for (let itone = TONES_MIN; itone < TONES_MIN + OCTAVE_MAX; itone++) {
           for (let ioctave = OCTAVE_MIN; ioctave <= OCTAVE_MAX; ioctave++) {
               for (const template of Object.values(ScaleTemplates)) {
                   const scale = new Scale({
                       key: itone,
                       template: template,
                       octave: ioctave,
                   });
                   scaleTable[`${itone}-${ioctave}-${JSON.stringify(template)}`] =
                       scaleNoteNameLookup(scale);
               }
           }
       }
       return scaleTable;
   };
   /**
    * creates the lookup table as soon as the module is loaded
    */
   let _notesLookup = {};
   const notesLookup = (key) => {
       // buildScaleNoteTable();
       return _notesLookup[key];
   };
   const buildScaleNoteTable = () => {
       // if (Object.entries(_notesLookup).length > 0) return _notesLookup;
       _notesLookup = createNotesLookupTable();
       Object.freeze(_notesLookup);
       console.log("built scale note table");
       return _notesLookup;
   };

   /**
    * Shortcut for modifiers
    * @internal
    */
   const flat = -1;
   const flat_flat = -2;
   const sharp = 1;
   /**
    * Chord templates
    * @internal
    */
   const ChordTemplates = {
       maj: [1, 3, 5],
       maj4: [1, 3, 4, 5],
       maj6: [1, 3, 5, 6],
       maj69: [1, 3, 5, 6, 9],
       maj7: [1, 3, 5, 7],
       maj9: [1, 3, 5, 7, 9],
       maj11: [1, 3, 5, 7, 9, 11],
       maj13: [1, 3, 5, 7, 9, 11, 13],
       maj7s11: [1, 3, 5, 7, [11, sharp]],
       majb5: [1, 3, [5, flat]],
       min: [1, [3, flat], 5],
       min4: [1, [3, flat], 4, 5],
       min6: [1, [3, flat], 5, 6],
       min7: [1, [3, flat], 5, [7, flat]],
       minAdd9: [1, [3, flat], 5, 9],
       min69: [1, [3, flat], 5, 6, 9],
       min9: [1, [3, flat], 5, [7, flat], 9],
       min11: [1, [3, flat], 5, [7, flat], 9, 11],
       min13: [1, [3, flat], 5, [7, flat], 9, 11, 13],
       min7b5: [1, [3, flat], [5, flat], [7, flat]],
       dom7: [1, 3, 5, [7, flat]],
       dom9: [1, 3, 5, [7, flat], 9],
       dom11: [1, 3, 5, [7, flat], 9, 11],
       dom13: [1, 3, 5, [7, flat], 9, 11, 13],
       dom7s5: [1, 3, [5, sharp], [7, flat]],
       dom7b5: [1, 3, [5, flat], [7, flat]],
       dom7b9: [1, 3, 5, [7, flat], [9, flat]],
       dom7s9: [1, 3, 5, [7, flat], [9, sharp]],
       dom9s5: [1, 3, [5, sharp], [7, flat], 9],
       dom9b5: [1, 3, [5, flat], [7, flat], 9],
       dom7s5s9: [1, 3, [5, sharp], [7, flat], [9, sharp]],
       dom7s5b9: [1, 3, [5, sharp], [7, flat], [9, flat]],
       dom7s11: [1, 3, 5, [7, flat], [11, sharp]],
       dim: [1, [3, flat], [5, flat]],
       dim7: [1, [3, flat], [5, flat], [7, flat_flat]],
       aug: [1, 3, [5, sharp]],
       sus2: [1, 2, 5],
       sus4: [1, [4, flat], 5],
       fifth: [1, 5],
       b5: [1, [5, flat]],
       s11: [1, 5, [11, sharp]],
   };
   Object.keys(ChordTemplates).forEach((element) => Object.freeze(ChordTemplates[element]));

   const DEFAULT_CHORD_TEMPLATE = [1, 3, 5];
   const DEFAULT_SCALE = new Scale();

   // import table from "./noteLookup.json";
   /**
    * Regex for matching note name, modifier, and octave
    */
   const nameRegex = /([A-G])(?=[^(]*\))/g;
   const modifierRegex = /(#|s|b)(?=[^(]*\))/g;
   const octaveRegex = /([0-9]+)(?=[^(]*\))/g;
   const chordNameRegex = /(min|maj|dim|aug)(?![^(]*\))/g;
   const additionsRegex = /([#|s|b]?[0-9]+)(?![^(]*\))/g;
   /**
    * @param chord the string to parse
    * @returns a valid ChordInitializer
    * @internal
    */
   const parseChord = (chord) => {
       try {
           const result = chordLookup(chord);
           if (result) {
               return result;
           }
       }
       catch {
           // do nothing
       }
       let noteIdenifier = "";
       let noteModifier = 0;
       let noteOctave = "";
       let chordName = "maj";
       let additions = [];
       const nameMatch = chord.match(nameRegex)?.join("").split("");
       const modifierMatch = chord.match(modifierRegex)?.join("").split("");
       const octaveMatch = chord.match(octaveRegex)?.join("").split("");
       const chordNameMatch = chord.match(chordNameRegex)?.join("");
       const additionsMatch = chord.match(additionsRegex)?.join("").split("");
       // combine all modifiers
       if (modifierMatch) {
           if (modifierMatch.length > 1) {
               // combine all modifiers into an offeset value to be added to the semitone
               noteModifier = modifierMatch
                   .map((item) => parseModifier(item))
                   .reduce((a, b) => a + b);
           }
           else {
               noteModifier = parseModifier(modifierMatch[0]);
           }
       }
       if (octaveMatch) {
           const [octave] = octaveMatch;
           noteOctave = octave;
       }
       if (chordNameMatch) {
           // const [name] = chordNameMatch;
           chordName = chordNameMatch;
       }
       if (additionsMatch) {
           additions = additionsMatch;
       }
       const intervals = [];
       if (nameMatch) {
           const [noteName] = nameMatch;
           noteIdenifier = noteName;
           let modifier = 0;
           if (noteModifier)
               modifier = noteModifier;
           const wrappedTone = wrap(getWholeToneFromName(noteIdenifier) + modifier, TONES_MIN, TONES_MAX);
           const semitone = wrappedTone.value;
           let octave = 4;
           if (noteOctave)
               octave = clamp(parseInt(noteOctave, 10), OCTAVE_MIN, OCTAVE_MAX);
           intervals.push(...ChordTemplates[chordName]);
           for (const addition of additions) {
               let mod = 0;
               if (addition[0] === "#" || addition[0] === "s") {
                   mod = 1;
                   additions.shift();
               }
               else if (addition[0] === "b") {
                   mod = -1;
                   additions.shift();
               }
               const additionNum = parseInt(addition, 10);
               if (intervals.includes(additionNum)) {
                   const index = intervals.indexOf(additionNum);
                   intervals[index] = [additionNum, mod];
               }
               else {
                   intervals.push([additionNum, mod]);
               }
           }
           return {
               root: semitone,
               octave: octave,
               template: intervals,
           };
       }
       throw new Error("Invalid chord name");
   };
   /**
    * @returns a lookup table of chord names and their initializers
    * @internal
    */
   const createTable = () => {
       const table = {};
       const noteLetters = ["A", "B", "C", "D", "E", "F", "G"];
       const noteModifiers = ["b", "#", "s"];
       const qualities = ["maj", "min", "dim", "aug", "sus"];
       const additions = [
           "",
           "2",
           "3",
           "4",
           "5",
           "6",
           "7",
           "9",
           "11",
           "13",
           "b2",
           "b3",
           "b4",
           "b5",
           "b6",
           "b7",
           "b9",
           "b11",
           "b13",
           "s2",
           "s3",
           "s4",
           "s5",
           "s6",
           "s7",
           "s9",
           "s11",
           "s13",
           "#2",
           "#3",
           "#4",
           "#5",
           "#6",
           "#7",
           "#9",
           "#11",
           "#13",
           "7s11",
           "7#11",
           "7b9",
           "7#9",
           "7b5",
           "7#5",
           "7b9b5",
           "7#9#5",
           "7b13",
           "7#13",
           "9#5",
           "9b5",
           "9#11",
           "9b11",
           "9#13",
           "9b13",
           "11#5",
           "11b5",
           "11#9",
           "11b9",
           "11#13",
           "11b13",
       ];
       for (const quality of qualities) {
           for (const addition of additions) {
               for (const noteLetter of noteLetters) {
                   const key = `(${noteLetter})${quality}${addition}`;
                   table[key] = parseChord(key);
                   for (const noteModifier of noteModifiers) {
                       const key = `(${noteLetter}${noteModifier})${quality}${addition}`;
                       table[key] = parseChord(key);
                       for (let i = OCTAVE_MIN; i <= OCTAVE_MAX; i++) {
                           const key = `(${noteLetter}${noteModifier}${i})${quality}${addition}`;
                           table[key] = parseChord(key);
                       }
                   }
               }
           }
       }
       return table;
   };
   let _chordLookup = {};
   /**
    * @param key the string to lookup
    * @returns a valid chord initializer
    * @throws an error if the key is not a valid chord
    * @internal
    */
   const chordLookup = (key) => {
       // buildChordTable();
       return _chordLookup[key];
   };
   // registerInitializer(() => {
   //    _chordLookup = createTable();
   // });
   // if (table && Object.keys(table).length > 0) {
   //    _chordLookup = table as { [key: string]: ChordInitializer };
   // } else {
   //    _chordLookup = createTable();
   // }
   const buildChordTable = () => {
       // if (Object.entries(_chordLookup).length > 0) return _chordLookup;
       _chordLookup = createTable();
       Object.freeze(_chordLookup);
       console.log("built chord table");
       // console.log(Object.entries(_chordLookup).length);
       return _chordLookup;
   };

   /**
    * Chords consist of a root note, octave, chord template, and a base scale.<br><br>
    * The chord template is an array of integers, each integer representing<br>
    *  a scale degree from the base scale(defaults to major).<br>
    * The default template is the I,III,V denoted as [1,3,5]<br>
    * ChordIntervals used in templates can also contain a modifier,<br>
    * for a particular scale degree, such as [1,3,[5, -1]]<br>
    * where -1 is flat, 0 is natural, and 1 is sharp.<br>
    * It could also be written as [1,3,[5, modifier.flat]]<br>
    * if you import modifier.
    *
    * The following predefined templates are available:<br>
    * <table>
    * <tr>
    * <td>maj</td>
    * <td>maj4</td>
    * <td>maj6</td>
    * <td>maj69</td>
    * </tr><tr>
    * <td>maj7</td>
    * <td>maj9</td>
    * <td>maj11</td>
    * <td>maj13</td>
    * </tr><tr>
    * <td>maj7s11</td>
    * <td>majb5</td>
    * <td>min</td>
    * <td>min4</td>
    * </tr><tr>
    * <td>min6</td>
    * <td>min7</td>
    * <td>minAdd9</td>
    * <td>min69</td>
    * </tr><tr>
    * <td>min9</td>
    * <td>min11</td>
    * <td>min13</td>
    * <td>min7b5</td>
    * </tr><tr>
    * <td>dom7</td>
    * <td>dom9</td>
    * <td>dom11</td>
    * <td>dom13</td>
    * </tr><tr>
    * <td>dom7s5</td>
    * <td>dom7b5</td>
    * <td>dom7s9</td>
    * <td>dom7b9</td>
    * </tr><tr>
    * <td>dom9b5</td>
    * <td>dom9s5</td>
    * <td>dom7s11</td>
    * <td>dom7s5s9</td>
    * </tr><tr>
    * <td>dom7s5b9</td>
    * <td>dim</td>
    * <td>dim7</td>
    * <td>aug</td>
    * </tr><tr>
    * <td>sus2</td>
    * <td>sus4</td>
    * <td>fifth</td>
    * <td>b5</td>
    * </tr><tr>
    * <td>s11</td>
    * </tr>
    * </table>
    *
    * @example
    * ```javascript
    * import { Chord } from "musictheoryjs";
    * import {ChordTemplate} from "musictheoryjs";
    * import {ChordInterval} from "musictheoryjs";
    * import {Modifier} from "musictheoryjs";
    * import {ChordInitializer} from "musictheoryjs";// Typescript only if needed
    * ```
    */
   class Chord {
       /**
        * @example
        * ```javascript
        * import { Chord, ChordTemplates, Modifier } from "musictheoryjs";
        *
        * //creates a chord with the default(1,3,5) template, root of C, in the 4th octave
        * const chord = new Chord();
        *
        * // creates a chord with the pre-defined diminished template, root of Eb, in the 5th octave
        * const chord = new Chord({root: 3, octave: 5, template: ChordTemplates.dim});
        *
        * // String parsing should follow the format: (root-note-name[s,#,b][octave])[chord-template-name|[chord-quality][modifiers]]
        * // creates a chord from a string
        * const chord = new Chord('(D4)min4');
        * ```
        */
       constructor(values) {
           if (!values) {
               this._template = [...DEFAULT_CHORD_TEMPLATE];
               this.octave = DEFAULT_OCTAVE;
               this.root = DEFAULT_SEMITONE;
           }
           else if (typeof values === "string") {
               const parsed = parseChord(values);
               this._template = [...(parsed?.template ?? DEFAULT_CHORD_TEMPLATE)];
               this.octave = parsed?.octave ?? DEFAULT_OCTAVE;
               this.root = parsed?.root ?? DEFAULT_SEMITONE;
           }
           else {
               this._template = [...(values.template ?? DEFAULT_CHORD_TEMPLATE)];
               this.octave = values.octave ?? DEFAULT_OCTAVE;
               this.root = values.root ?? DEFAULT_SEMITONE;
           }
           this._baseScale = new Scale({ key: this._root, octave: this._octave });
           this._notesDirty = true;
       }
       /**
        * unique id for this instance
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.id); // hal8934hll
        * ```
        */
       id = uid();
       /**
        * root
        */
       _root = DEFAULT_SEMITONE;
       /**
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.root); // 0(semitone)
        * ```
        */
       get root() {
           return this._root;
       }
       /**
        * Setting the root to a value outside of the range [0, 11](semitone) will<br/>
        * wrap the semitone to the range [0, 11] and change the octave depending<br/>
        * on how many times the semitone has been wrapped.
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.root = 4; // sets the root to 4th semitone(E)
        * console.log(chord.root); // 4(semitone)
        * ```
        */
       set root(value) {
           // this._root = value;
           const wrapped = wrap(value, TONES_MIN, TONES_MAX);
           this._root = wrapped.value;
           this._octave = this._octave + wrapped.numWraps;
           this._notesDirty = true;
       }
       /**
        * base scale
        */
       _baseScale = DEFAULT_SCALE;
       /**
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.baseScale); // prints the default scale(major)
        * ```
        */
       get baseScale() {
           return this._baseScale;
       }
       /**
        * Not a lot of good reasons to change this except for experimentation
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.baseScale = new Scale({ key: 3, octave: 5, template: [1, [3, Modifier.flat], 5] });
        * console.log(chord.baseScale); // prints the minor scale
        * ```
        */
       set baseScale(value) {
           this._baseScale = value;
           this._baseScale.octave = this._octave;
           this._notesDirty = true;
       }
       /**
        * octave
        */
       _octave = DEFAULT_OCTAVE;
       /**
        * The octave is clamped to the range [0, 9].
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.octave); // 4(octave)
        * ```
        */
       get octave() {
           return this._octave;
       }
       /**
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.octave = 5; // sets the octave to 5th
        * console.log(chord.octave); // 5(octave)
        * ```
        */
       set octave(value) {
           this._octave = clamp(value, OCTAVE_MIN, OCTAVE_MAX);
           this._baseScale.octave = this._octave;
           this._notesDirty = true;
       }
       /**
        * template
        */
       _template = [];
       /**
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.template); // prints the default template
        * ```
        */
       get template() {
           return [...this._template];
       }
       /**
        * The following predefined templates are available:<br>
        * <table>
        * <tr>
        * <td>maj</td>
        * <td>maj4</td>
        * <td>maj6</td>
        * <td>maj69</td>
        * </tr><tr>
        * <td>maj7</td>
        * <td>maj9</td>
        * <td>maj11</td>
        * <td>maj13</td>
        * </tr><tr>
        * <td>maj7s11</td>
        * <td>majb5</td>
        * <td>min</td>
        * <td>min4</td>
        * </tr><tr>
        * <td>min6</td>
        * <td>min7</td>
        * <td>minAdd9</td>
        * <td>min69</td>
        * </tr><tr>
        * <td>min9</td>
        * <td>min11</td>
        * <td>min13</td>
        * <td>min7b5</td>
        * </tr><tr>
        * <td>dom7</td>
        * <td>dom9</td>
        * <td>dom11</td>
        * <td>dom13</td>
        * </tr><tr>
        * <td>dom7s5</td>
        * <td>dom7b5</td>
        * <td>dom7s9</td>
        * <td>dom7b9</td>
        * </tr><tr>
        * <td>dom9b5</td>
        * <td>dom9s5</td>
        * <td>dom7s11</td>
        * <td>dom7s5s9</td>
        * </tr><tr>
        * <td>dom7s5b9</td>
        * <td>dim</td>
        * <td>dim7</td>
        * <td>aug</td>
        * </tr><tr>
        * <td>sus2</td>
        * <td>sus4</td>
        * <td>fifth</td>
        * <td>b5</td>
        * </tr><tr>
        * <td>s11</td>
        * </tr>
        * </table>
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.template = [1, [3, Modifier.flat], 5]; // sets the template to a minor chord
        * console.log(chord.template); // prints the new template
        * ```
        */
       set template(value) {
           this._template = [...value];
           this._notesDirty = true;
       }
       /**
        * notes
        * notes are generated and cached as needed
        */
       _notes = [];
       _notesDirty = true;
       /**
        * will generate notes if needed or return the cached notes
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.notes); // prints the default notes
        * ```
        */
       get notes() {
           if (this._notesDirty) {
               this.generateNotes();
               this._notesDirty = false;
           }
           return this._notes;
       }
       /**
        * generate notes(internal)
        * generates the notes for this scale
        */
       generateNotes() {
           this._notes = [];
           for (const interval of this._template) {
               let tone = 0;
               let mod = 0;
               if (Array.isArray(interval)) {
                   tone = interval[0];
                   mod = interval[1];
               }
               else {
                   tone = interval;
               }
               const offset = tone;
               const note = this._baseScale.degree(offset);
               const noteTone = note.semitone;
               note.semitone = noteTone + mod;
               this._notes.push(note);
           }
           return this._notes;
       }
       /**
        * @returns the note names -> ['C4', 'E4', 'G4']
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.getNoteNames()); // ['C4', 'E4', 'G4']
        * ```
        */
       getNoteNames() {
           const noteNames = [];
           for (const note of this.notes) {
               noteNames.push(note.toString());
           }
           return noteNames;
       }
       /**
        * @chainable
        * @returns a copy of the chord
        * @example
        * ```javascript
        * const chord = new Chord();
        * const copy = chord.copy();
        * console.log(chord.equals(copy)); // true
        * ```
        */
       copy() {
           return new Chord({
               root: this.root,
               octave: this.octave,
               template: [...this._template],
           });
       }
       /**
        * @param other the other chord to compare to
        * @returns true if the two chords are equal
        * @example
        * ```javascript
        * const chord = new Chord();
        * const copy = chord.copy();
        * console.log(chord.equals(copy)); // true
        * ```
        */
       equals(other) {
           return (this.root === other.root &&
               this.octave === other.octave &&
               isEqual(this._template, other.template));
       }
       /**
        * mutates the chord in place
        * @chainable
        * @returns the chord with a natrual 3rd
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.minor();
        * chord.major();
        * console.log(chord.template); // [1,3,5]
        * ```
        */
       major() {
           let index = -1;
           for (let i = 0; i < this._template.length; ++i) {
               if (this._template[i] === 3) {
                   index = i;
                   break;
               }
               const interval = this._template[i];
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 3) {
                       index = i;
                       break;
                   }
               }
           }
           if (index === -1) {
               this._template.push(3);
           }
           else {
               this._template[index] = 3;
           }
           this._notesDirty = true;
           return this;
       }
       /**
        * @chainable
        * @returns a copy of the chord with a natural 3rd
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.minor();
        * const copy = chord.majored();
        * console.log(copy.template); // [1,3,5]
        * ```
        */
       majored() {
           return this.copy().major();
       }
       /**
        * @returns true if the chord has a natural 3rd
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.isMajor()); // true
        * ```
        */
       isMajor() {
           for (const interval of this._template) {
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 3 && (interval[1] ?? 0) === 0) {
                       return true;
                   }
               }
               else {
                   if (interval === 3) {
                       return true;
                   }
               }
           }
           return false;
       }
       /**
        *  mutates the chord in place
        * @chainable
        * @returns the chord with a flat 3rd
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.minor();
        * console.log(chord.template); // [1,[3,-1],5]
        * ```
        */
       minor() {
           let index = -1;
           for (let i = 0; i < this._template.length; ++i) {
               if (this._template[i] === 3) {
                   index = i;
                   break;
               }
               const interval = this._template[i];
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 3) {
                       index = i;
                       break;
                   }
               }
           }
           if (index === -1) {
               this._template.push([3, -1]);
           }
           else {
               this._template[index] = [3, -1];
           }
           this._notesDirty = true;
           return this;
       }
       /**
        * @chainable
        * @returns a copy of the chord with a flat 3rd
        * @example
        * ```javascript
        * const chord = new Chord();
        * const copy = chord.minored();
        * console.log(copy.template); // [1,[3,-1],5]
        * ```
        */
       minored() {
           return this.copy().minor();
       }
       /**
        * @returns true if the chord has a flat 3rd
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.isMinor()); // false
        * chord.minor();
        * console.log(chord.isMinor()); // true
        * ```
        */
       isMinor() {
           for (const interval of this._template) {
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 3 && (interval[1] ?? 0) === -1) {
                       return true;
                   }
               }
           }
           return false;
       }
       /**
        * Mutates the chord in place
        * @chainable
        * @returns the chord with a sharp 5th
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.augment();
        * console.log(chord.template); // [1, 3, [5, Modifier.sharp]]
        * ```
        */
       augment() {
           let index = -1;
           for (let i = 0; i < this._template.length; ++i) {
               if (this._template[i] === 5) {
                   index = i;
                   break;
               }
               const interval = this._template[i];
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 5) {
                       index = i;
                       break;
                   }
               }
           }
           if (index === -1) {
               this._template.push([5, 1]);
           }
           else {
               this._template[index] = [5, 1];
           }
           this._notesDirty = true;
           return this;
       }
       /**
        * @chainable
        * @returns a copy of the chord with a sharp 5th
        * @example
        * ```javascript
        * const chord = new Chord();
        * const copy = chord.augmented();
        * console.log(copy.template); // [1, 3, [5, Modifier.sharp]]
        * ```
        */
       augmented() {
           return this.copy().augment();
       }
       /**
        * @returns true if the chord has a sharp 5th
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.isAugmented()); // false
        * chord.augment();
        * console.log(chord.isAugmented()); // true
        * ```
        */
       isAugmented() {
           for (const interval of this._template) {
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 5 && (interval[1] ?? 0) === 1) {
                       return true;
                   }
               }
           }
           return false;
       }
       /**
        * Mutates the chord in place
        * @chainable
        * @returns the chord with a flat 5th
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.diminish();
        * console.log(chord.template); // [1, 3, [5, Modifier.flat]]
        * ```
        */
       diminish() {
           let index = -1;
           for (let i = 0; i < this._template.length; ++i) {
               if (this._template[i] === 5) {
                   index = i;
                   break;
               }
               const interval = this._template[i];
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 5) {
                       index = i;
                       break;
                   }
               }
           }
           if (index === -1) {
               this._template.push([5, -1]);
           }
           else {
               this._template[index] = [5, -1];
           }
           this._notesDirty = true;
           return this;
       }
       /**
        * @chainable
        * @returns a copy of the chord with a flat 5th
        * @example
        * ```javascript
        * const chord = new Chord();
        * const copy = chord.diminished();
        * console.log(copy.template); // [1, 3, [5, Modifier.flat]]
        * ```
        */
       diminished() {
           return this.copy().diminish();
       }
       /**
        * @returns true if the chord has a flat 5th
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.isDiminished()); // false
        * chord.diminish();
        * console.log(chord.isDiminished()); // true
        * ```
        */
       isDiminished() {
           for (const interval of this._template) {
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 5 && (interval[1] ?? 0) === -1) {
                       return true;
                   }
               }
           }
           return false;
       }
       /**
        * Mutates the chord in place
        * @chainable
        * @returns the chord with a flat 3,5, and 7th
        * @example
        * ```javascript
        * const chord = new Chord();
        * chord.halfDiminish();
        * console.log(chord.template); // [1, [3, Modifier.flat], [5, Modifier.flat], [7, Modifier.flat]]
        *
        */
       halfDiminish() {
           this.minor(); // get flat 3rd
           this.diminish(); // get flat 5th
           let index = -1;
           for (let i = 0; i < this._template.length; ++i) {
               if (this._template[i] === 7) {
                   index = i;
                   break;
               }
               const interval = this._template[i];
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 7) {
                       index = i;
                       break;
                   }
               }
           }
           if (index === -1) {
               this._template.push([7, -1]);
           }
           else {
               this._template[index] = [7, -1];
           }
           this._notesDirty = true;
           return this;
       }
       /**
        * @chainable
        * @returns a copy of the chord with a flat 3,5, and 7th
        * @example
        * ```javascript
        * const chord = new Chord();
        * const copy = chord.halfDiminished();
        * console.log(copy.template); // [1, 3, [5, Modifier.flat], [7, Modifier.flat]]
        */
       halfDiminished() {
           return this.copy().halfDiminish();
       }
       /**
        * @returns true if the chord has a flat 3,5, and 7th
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.isHalfDiminished()); // false
        * chord.halfDiminish();
        * console.log(chord.isHalfDiminished()); // true
        */
       isHalfDiminished() {
           let third = false;
           let fifth = false;
           let seventh = false;
           for (const interval of this._template) {
               if (Array.isArray(interval)) {
                   if ((interval[0] ?? 0) === 7 && (interval[1] ?? 0) === -1) {
                       seventh = true;
                   }
                   else if ((interval[0] ?? 0) === 5 && (interval[1] ?? 0) === -1) {
                       fifth = true;
                   }
                   else if ((interval[0] ?? 0) === 3 && (interval[1] ?? 0) === -1) {
                       third = true;
                   }
               }
           }
           return third && fifth && seventh;
       }
       /**
        * Mutates the chord in place
        * @chainable
        * @returns the chord with with the first note moved to the end up one octave
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.template); // [1,3,5]
        * console.log(chord.getNoteNames()); // ['C4', 'E4', 'G4']
        * chord.invert();
        * console.log(chord.template); // [3,5,1]
        * console.log(chord.getNoteNames()); // ['E4', 'G4', 'C5']
        * ```
        */
       invert() {
           console.log(this._template[0]);
           if (Array.isArray(this._template[0])) {
               this._template[0][0] += this._baseScale.template.length;
           }
           else {
               this._template[0] += this._baseScale.template.length;
           }
           const newTemplate = shift(this._template, this._template.length - 1);
           this._template = newTemplate;
           this._notesDirty = true;
           return this;
       }
       /**
        * @chainable
        * @returns a copy of the chord with with the first note moved to the end up one octave
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.template); // [1,3,5]
        * console.log(chord.getNoteNames()); // ['C4', 'E4', 'G4']
        * const copy = chord.inverted();
        * console.log(copy.template); // [3,5,1]
        * console.log(copy.getNoteNames()); // ['E4', 'G4', 'C5']
        * ```
        */
       inverted() {
           return this.copy().invert();
       }
       /**
        * @returns the string form of the chord
        * @example
        * ```javascript
        * const chord = new Chord();
        * console.log(chord.toString()); // '(C4)maj'
        * ```
        */
       toString() {
           const keys = Object.keys(ChordTemplates);
           const values = Object.values(ChordTemplates).map((template) => JSON.stringify(template));
           const index = values.indexOf(JSON.stringify(this._template));
           const prefix = `(${Semitone$1[this._root]}${this._octave})`;
           const str = index > -1 ? prefix + keys[index] : this.getNoteNames().join(",");
           return str;
       }
   }

   /**
    * Builds lookup tables for more performant string parsing.<br/>
    * Should only(optionally) be called once soon after the library is loaded and<br/>
    * only if you are using string initializers.
    */
   const buildTables = () => {
       buildNoteTable();
       buildNoteStringTable();
       buildScaleTable();
       buildScaleNoteTable();
       buildScaleNameTable();
       buildChordTable();
   };

   exports.Chord = Chord;
   exports.ChordTemplates = ChordTemplates;
   exports.Instrument = Instrument;
   exports.Modifier = Modifier$1;
   exports.Note = Note;
   exports.Scale = Scale;
   exports.ScaleTemplates = ScaleTemplates;
   exports.Semitone = Semitone$1;
   exports.buildTables = buildTables;

   Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ }),

/***/ "./src/availablescales.ts":
/*!********************************!*\
  !*** ./src/availablescales.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAvailableScales": () => (/* binding */ getAvailableScales)
/* harmony export */ });
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


const scalesForNotes = (notes, params) => {
    const scales = new Set();
    // First add all scales
    for (const scaleSlug in params.scaleSettings) {
        const template = params.scaleSettings[scaleSlug];
        if (template.enabled) {
            for (let semitone = 0; semitone < 12; semitone++) {
                const scale = new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Scale({ key: semitone, template: musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.ScaleTemplates[scaleSlug] });
                const semitones = scale.notes.map(note => note.semitone);
                const leadingTone = (scale.key - 1 + 24) % 12;
                if (!semitones.includes(leadingTone)) {
                    semitones.push(leadingTone);
                }
                scales.add({
                    key: semitone,
                    templateSlug: scaleSlug,
                    semitones: semitones,
                });
            }
        }
    }
    for (let note of notes) {
        const semitone = note.semitone;
        for (const scale of scales) {
            if (!scale.semitones.includes(semitone)) {
                scales.delete(scale);
            }
        }
    }
    const ret = [];
    for (const scale of scales) {
        ret.push(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Scale({ key: scale.key, template: musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.ScaleTemplates[scale.templateSlug] }));
    }
    return ret;
};
const getAvailableScales = (values) => {
    const { latestDivision, divisionedRichNotes, params, randomNotes, logger } = values;
    // Given a new chord, find available scales base on the previous notes
    const currentAvailableScales = scalesForNotes(randomNotes, params);
    const ret = [];
    for (const scale of currentAvailableScales) {
        ret.push({
            scale,
            tension: 0,
        });
    }
    logger.log("currentAvailableScales", currentAvailableScales);
    // Go back a few chords and find the scales that are available.
    for (let i = 1; i < 4; i++) {
        const division = latestDivision - (i * _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH);
        if (!divisionedRichNotes[division]) {
            continue;
        }
        const notes = divisionedRichNotes[division].map(richNote => richNote.note);
        const availableScales = scalesForNotes(notes, params);
        for (const potentialScale of ret) {
            const index = availableScales.findIndex(item => item.equals(potentialScale.scale));
            if (index == -1) {
                // Scale wasn't available, increase tension
                if (i == 1) {
                    potentialScale.tension += 20; // Base of how long ago it was
                }
                else if (i == 2) {
                    potentialScale.tension += 10;
                }
                else if (i == 3) {
                    potentialScale.tension += 5;
                }
                else if (i == 4) {
                    potentialScale.tension += 1;
                }
                logger.log("Scale ", potentialScale.scale.toString(), " wasn't available at division ", division, ", increase tension");
            }
        }
    }
    logger.print("Available scales", ret);
    return ret.filter(item => item.tension < 10);
};


/***/ }),

/***/ "./src/chordprogression.ts":
/*!*********************************!*\
  !*** ./src/chordprogression.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "chordProgressionTension": () => (/* binding */ chordProgressionTension)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

const chordProgressionTension = (tension, values) => {
    const { divisionedNotes, fromNotesOverride, toNotes, newChord, currentScale, beatsUntilLastChordInCadence, beatsUntilLastChordInSong, inversionName, prevInversionName, params, mainParams, beatDivision, } = values;
    /*
    
    Basic circle of 5ths progression:

    iii
    vi         (Deceptive tonic)
    ii <- IV   (Subdominant function)
    V  -> vii  (Dominant function)
    I          (Tonic function)

    Additionally:
    V -> vi is the deceptive cadence
    IV -> I is the plagal cadence
    iii -> IV is allowed.

    Once we have subdominant or dominant chords, there's no going back to iii or vi.

    I want to check pachelbel canon progression:
      OK   deceptive?   maybe since no function     OK    OK if its i64   Ok because its tonic. OK   OK
    I -> V    ->     vi         ->              iii -> IV     ->        I         ->        IV  -> V -> I

    */
    const progressionChoices = {
        0: null,
        1: ['dominant',],
        2: [5, 3],
        3: [1, 2, 'dominant'],
        4: [0, 6, 'dominant', 5],
        5: ['sub-dominant', 2],
        6: [0], // vii can go to I
    };
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
        }
        else if (params.selectedCadence == "IAC") {
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
        }
        else if (params.selectedCadence == "HC") {
            if (beatsUntilLastChordInCadence <= 3) {
                wantedFunction = "sub-dominant";
            }
            if (beatsUntilLastChordInCadence < 2) {
                wantedFunction = "dominant";
            }
        }
    }
    let prevChord;
    let prevPrevChord;
    let passedFromNotes = [];
    let prevPassedFromNotes = [];
    let latestNotes = [];
    if (divisionedNotes) {
        const latestDivision = beatDivision - _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
        let tmp = [];
        for (const richNote of (divisionedNotes[latestDivision] || [])) {
            // Use original notes, not the ones that have been turned into NACs
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevChord = richNote.chord;
        }
        passedFromNotes = [...tmp].filter(Boolean);
        tmp = [];
        for (const richNote of (divisionedNotes[latestDivision - _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH] || [])) {
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevPrevChord = richNote.chord;
        }
        prevPassedFromNotes = [...tmp].filter(Boolean);
        for (let i = beatDivision; i >= 0; i--) {
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
    }
    else if (fromNotesOverride) {
        passedFromNotes = fromNotesOverride;
    }
    let fromNotes;
    if (passedFromNotes.length < 4) {
        fromNotes = toNotes;
    }
    else {
        fromNotes = passedFromNotes;
    }
    const toSemitones = toNotes.map(note => note.semitone);
    const fromGlobalSemitones = fromNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(note));
    const toGlobalSemitones = toNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(note));
    // If the notes are not in the current scale, increase the tension
    const leadingTone = (currentScale.key - 1 + 24) % 12;
    if (tryToGetLeadingToneInPart0 && toGlobalSemitones[0] % 12 != leadingTone) {
        // in PAC, we want the leading tone in part 0 in the dominant
        tension.cadence += 5;
    }
    const semitoneScaleIndex = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6,
        [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6 // Force add leading tone
    };
    const toScaleIndexes = toNotes.map(note => semitoneScaleIndex[note.semitone]);
    if (part0MustBeTonic && toScaleIndexes[0] != 0) {
        tension.cadence += 10;
    }
    const getPossibleFunctions = (chord) => {
        const rootSemitone = chord.notes[0].semitone;
        const rootScaleIndex = semitoneScaleIndex[rootSemitone];
        const possibleToFunctions = {
            'tonic': true,
            'sub-dominant': true,
            'dominant': true,
        };
        if (rootScaleIndex == undefined) {
            possibleToFunctions.tonic = false;
            possibleToFunctions['sub-dominant'] = false;
            possibleToFunctions.dominant = false;
        }
        if (![1, 3].includes(rootScaleIndex)) { // ii, IV
            possibleToFunctions["sub-dominant"] = false;
        }
        if (![0, 4, 6].includes(rootScaleIndex)) { // V, vii, I64
            possibleToFunctions.dominant = false;
        }
        else if (rootScaleIndex == 0) {
            // If I is not second inversion, it's not dominant
            if (!inversionName || !inversionName.startsWith('second')) {
                possibleToFunctions.dominant = false;
            }
        }
        if (![0].includes(rootScaleIndex)) { // I
            possibleToFunctions.tonic = false;
        }
        return {
            rootScaleIndex,
            possibleToFunctions: Object.keys(possibleToFunctions).filter(key => possibleToFunctions[key]),
        };
    };
    if (newChord && prevChord && prevPrevChord) {
        if (newChord.notes[0].semitone == prevChord.notes[0].semitone) {
            // Same root
            tension.chordProgression += 1;
            if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
                // Same root as previous chord
                tension.chordProgression += 100;
            }
        }
        if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
            // Same root as previous chord (Don't go back)
            tension.chordProgression += 5;
        }
    }
    if (newChord && prevChord) {
        const fromFunctions = getPossibleFunctions(prevChord);
        const toFunctions = getPossibleFunctions(newChord);
        const possibleToFunctions = toFunctions.possibleToFunctions;
        const progressions = progressionChoices[fromFunctions.rootScaleIndex];
        if (progressions) {
            let good = false;
            for (const progression of progressions) {
                if (`${progression}` == `${toFunctions.rootScaleIndex}`) {
                    // Perfect progression
                    good = true;
                    break;
                }
                if (typeof progression == "string" && toFunctions.possibleToFunctions && toFunctions.possibleToFunctions.includes(progression)) {
                    good = true;
                    break;
                }
            }
            if (!good) {
                tension.chordProgression += 100;
            }
        }
        if (wantedFunction) {
            if (wantedFunction == "sub-dominant") {
                if (!possibleToFunctions.includes("sub-dominant")) { // && !possibleToFunctions.dominant) {
                    if (!possibleToFunctions.includes("dominant")) {
                        tension.comment += `Wanted ${wantedFunction}`;
                        tension.cadence += 100;
                    }
                    else {
                        tension.cadence += 5; // Dominant is
                    }
                }
            }
            if (wantedFunction == "dominant") {
                if (!possibleToFunctions.includes("dominant")) {
                    tension.comment += `Wanted ${wantedFunction}`;
                    tension.cadence += 100;
                }
            }
            if (wantedFunction == "tonic") {
                if (!possibleToFunctions.includes("tonic")) {
                    tension.comment += `Wanted ${wantedFunction}`;
                    tension.cadence += 100;
                }
            }
        }
    }
};


/***/ }),

/***/ "./src/chords.ts":
/*!***********************!*\
  !*** ./src/chords.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildTables": () => (/* reexport safe */ musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.buildTables),
/* harmony export */   "makeMelody": () => (/* binding */ makeMelody),
/* harmony export */   "makeMusic": () => (/* binding */ makeMusic)
/* harmony export */ });
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mylogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mylogger */ "./src/mylogger.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _randomchords__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./randomchords */ "./src/randomchords.ts");
/* harmony import */ var _inversions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inversions */ "./src/inversions.ts");
/* harmony import */ var _tension__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tension */ "./src/tension.ts");
/* harmony import */ var _nonchordtones__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./nonchordtones */ "./src/nonchordtones.ts");
/* harmony import */ var _availablescales__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./availablescales */ "./src/availablescales.ts");
/* harmony import */ var _forcedmelody__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./forcedmelody */ "./src/forcedmelody.ts");
/* harmony import */ var _chordprogression__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./chordprogression */ "./src/chordprogression.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










const GOOD_CHORD_LIMIT = 200;
const GOOD_CHORDS_PER_CHORD = 10;
const BAD_CHORD_LIMIT = 500;
const BAD_CHORDS_PER_CHORD = 20;
const sleepMS = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(resolve, ms));
});
const makeChords = (mainParams, progressCallback = null) => __awaiter(void 0, void 0, void 0, function* () {
    // generate a progression
    // This is the main function that generates the entire song.
    // The basic idea is that 
    var _a, _b, _c, _d;
    // Until the first IAC or PAC, melody and rhytm is random. (Though each cadence has it's own melodic high point.)
    // This melody and rhytm is partially saved and repeated in the next cadences.
    const maxBeats = mainParams.getMaxBeats();
    let result = {};
    let divisionBannedNotes = {};
    for (let division = 0; division < maxBeats * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; division += _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH) {
        let prevResult = result[division - _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH];
        let prevChord = prevResult ? prevResult[0].chord : null;
        let prevNotes;
        let prevInversionName;
        let currentScale;
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
        const currentBeat = Math.floor(division / _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH);
        console.log("beatsUntilLastChordInCadence", beatsUntilLastChordInCadence);
        const randomGenerator = new _randomchords__WEBPACK_IMPORTED_MODULE_3__.RandomChordGenerator(params);
        let newChord = null;
        let goodChords = [];
        const badChords = [];
        const randomNotes = [];
        let iterations = 0;
        let skipLoop = false;
        if (params.beatsUntilAuthenticCadenceEnd == 1 && prevNotes) {
            // Force same chord twice
            goodChords.splice(0, goodChords.length);
            goodChords.push(prevNotes.map((note, index) => ({
                note: note,
                duration: _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH,
                chord: newChord,
                partIndex: index,
                inversionName: prevInversionName,
                tension: new _tension__WEBPACK_IMPORTED_MODULE_5__.Tension(),
                scale: currentScale,
            })));
            skipLoop = true;
        }
        while (!skipLoop && goodChords.length < (currentBeat != 0 ? GOOD_CHORD_LIMIT : 5)) {
            iterations++;
            newChord = randomGenerator.getChord();
            const chordLogger = new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger();
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
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.semitoneScaleIndex)(currentScale)[newChord.notes[0].semitone] != (forcedChordNum - 1)) {
                        continue;
                    }
                }
            }
            let allInversions;
            let availableScales;
            availableScales = (0,_availablescales__WEBPACK_IMPORTED_MODULE_7__.getAvailableScales)({
                latestDivision: division,
                divisionedRichNotes: result,
                params: params,
                randomNotes: newChord.notes,
                logger: new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger(chordLogger),
            });
            if (currentScale && (maxBeats - currentBeat < 3 || beatsUntilLastChordInCadence < 3 || currentBeat < 5)) {
                // Don't allow other scales than the current one
                availableScales = availableScales.filter(s => s.scale.equals(currentScale));
            }
            if (availableScales.length == 0) {
                continue;
            }
            allInversions = (0,_inversions__WEBPACK_IMPORTED_MODULE_4__.getInversions)({
                chord: newChord, prevNotes: prevNotes, beat: currentBeat, params, logger: new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger(chordLogger),
                beatsUntilLastChordInSong: maxBeats - currentBeat
            });
            for (const inversionResult of allInversions) {
                if (goodChords.length >= GOOD_CHORD_LIMIT) {
                    break;
                }
                const inversionLogger = new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger();
                inversionLogger.title = ["Inversion ", `${inversionResult.inversionName}`];
                randomNotes.splice(0, randomNotes.length); // Empty this and replace contents
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
                    };
                    const tensionResult = new _tension__WEBPACK_IMPORTED_MODULE_5__.Tension();
                    (0,_chordprogression__WEBPACK_IMPORTED_MODULE_9__.chordProgressionTension)(tensionResult, tensionParams);
                    if (tensionResult.getTotalTension({
                        params,
                        beatsUntilLastChordInCadence
                    }) < 10) {
                        (0,_tension__WEBPACK_IMPORTED_MODULE_5__.getTension)(tensionResult, tensionParams);
                    }
                    const modulationWeight = parseFloat((`${params.modulationWeight || "0"}`));
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
                    let melodyResult;
                    if (tension < 10) {
                        // Is this possible to work with the melody?
                        // If so, add melody notes and NACs.
                        melodyResult = (0,_forcedmelody__WEBPACK_IMPORTED_MODULE_8__.addForcedMelody)(tensionParams);
                        tensionResult.forcedMelody += melodyResult.tension;
                        if (melodyResult.nac) {
                            tensionResult.nac = melodyResult.nac;
                        }
                        if (melodyResult.comment) {
                            tensionResult.comment = melodyResult.comment;
                        }
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
                                    if ((((_a = goodChord[0].tension) === null || _a === void 0 ? void 0 : _a.totalTension) || 999) < worstChordTension) {
                                        worstChord = i;
                                    }
                                }
                            }
                            if (worstChord != null) {
                                if ((((_b = goodChords[worstChord][0].tension) === null || _b === void 0 ? void 0 : _b.totalTension) || 999) > tension) {
                                    // Just remove that index, add a new one later
                                    goodChords.splice(worstChord, 1);
                                }
                            }
                        }
                        if (thisChordCount < GOOD_CHORDS_PER_CHORD) {
                            goodChords.push(randomNotes.map((note, index) => ({
                                note: note,
                                duration: _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH,
                                chord: newChord,
                                partIndex: index,
                                inversionName: inversionResult.inversionName,
                                tension: tensionResult,
                                scale: availableScale.scale,
                            })));
                        }
                    }
                    else if (tensionResult.totalTension < 100 && badChords.length < BAD_CHORD_LIMIT) {
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
                } // For available scales end
            } // For voiceleading results end
        } // While end
        if (goodChords.length == 0) {
            for (const badChord of badChords) {
                badChord.tension.print("Bad chord ", badChord.chord, " - ");
            }
            yield sleepMS(1);
            // Go back to previous chord, and make it again
            if (division >= _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH) {
                division -= _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH * 2;
                // Mark the previous chord as banned
                const newBannedNotes = [];
                for (const note of result[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH]) {
                    newBannedNotes[note.partIndex] = note.note;
                }
                // Delete the previous chord (where we are going to)
                divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] = divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] || [];
                divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH].push(newBannedNotes);
                delete result[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH];
                // Delete any notes after that also
                for (let i = division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; i < maxBeats * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; i += 1) {
                    delete result[i];
                }
                if (divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH].length > 10 && result[division]) {
                    // Too many bans, go back further. Remove these bans so they don't hinder later progress.
                    divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] = [];
                    division -= _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH;
                    const newBannedNotes = [];
                    for (const note of result[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH]) {
                        newBannedNotes[note.partIndex] = note.note;
                    }
                    divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] = divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] || [];
                    divisionBannedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH].push(newBannedNotes);
                    delete result[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH];
                    for (let i = division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; i < maxBeats * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; i += 1) {
                        delete result[i];
                    }
                }
            }
            else {
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
                chord[0].tension.print(chord[0].chord ? chord[0].chord.toString() : "?Chord?", chord[0].inversionName, "best tension: ", bestTension, ": ", bestChord);
            }
        }
        result[division] = bestChord;
        if ((_d = (_c = bestChord[0]) === null || _c === void 0 ? void 0 : _c.tension) === null || _d === void 0 ? void 0 : _d.nac) {
            // Add the required Non Chord Tone
            (0,_nonchordtones__WEBPACK_IMPORTED_MODULE_6__.addNoteBetween)(bestChord[0].tension.nac, division, division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH, 0, result);
        }
        if (progressCallback) {
            if (progressCallback(currentBeat, result)) {
                return result;
            }
        }
        randomGenerator.cleanUp();
        console.groupEnd();
    }
    return result;
});
function makeMusic(params, progressCallback = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let divisionedNotes = {};
        divisionedNotes = yield makeChords(params, progressCallback);
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
        // buildTopMelody(divisionedNotes, params);
        // addEighthNotes(divisionedNotes, params)
        // addHalfNotes(divisionedNotes, params)
        return {
            divisionedNotes: divisionedNotes,
        };
    });
}
function makeMelody(divisionedNotes, mainParams) {
    // Remove old melody and make a new one
    const maxBeats = mainParams.getMaxBeats();
    for (let division = 0; division < maxBeats * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; division++) {
        const onBeat = division % _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH == 0;
        if (!onBeat) {
            divisionedNotes[division] = [];
        }
        else if (divisionedNotes[division] && divisionedNotes[division].length > 0) {
            divisionedNotes[division].forEach(richNote => {
                richNote.duration = _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH;
                richNote.tie = undefined;
            });
        }
    }
    // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
    // buildTopMelody(divisionedNotes, mainParams);
    // addEighthNotes(divisionedNotes, params)
    // addHalfNotes(divisionedNotes, mainParams)
}



/***/ }),

/***/ "./src/forcedmelody.ts":
/*!*****************************!*\
  !*** ./src/forcedmelody.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addForcedMelody": () => (/* binding */ addForcedMelody)
/* harmony export */ });
/* harmony import */ var _nonchordtones__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nonchordtones */ "./src/nonchordtones.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


const addForcedMelody = (values) => {
    /*
    
    */
    const { toNotes, currentScale, params, mainParams, beatDivision } = values;
    const { startingGlobalSemitones, semitoneLimits } = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.startingNotes)(params);
    const chord = values.newChord;
    const divisionedNotes = values.divisionedNotes || {};
    const maxDivision = mainParams.getMaxBeats() * _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH;
    const tension = {
        comment: "",
        tension: 0,
        nac: null,
    };
    const melodyTonesAndDurations = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getMelodyNeededTones)(mainParams);
    const melodyExists = (mainParams.forcedMelody || []).length > 0;
    if (!melodyExists) {
        return tension;
    }
    const currentDivision = beatDivision;
    const cadenceDivision = currentDivision - params.cadenceStartDivision;
    // Strong beat note is supposed to be this
    let newMelodyToneAndDuration = melodyTonesAndDurations[cadenceDivision];
    let newMelodyToneDivision = cadenceDivision;
    if (!newMelodyToneAndDuration) {
        // No melody tone for this division, the previous tone must be lengthy. Use it.
        for (let i = cadenceDivision - 1; i >= cadenceDivision - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH * 2; i--) {
            newMelodyToneAndDuration = melodyTonesAndDurations[i];
            if (newMelodyToneAndDuration) {
                newMelodyToneDivision = i;
                break;
            }
        }
    }
    if (!newMelodyToneAndDuration || newMelodyToneAndDuration.tone == undefined) {
        // No melody found at all. Give up.
        tension.comment = "No melody found at all. Give up.";
        return tension;
    }
    const newMelodySemitone = currentScale.notes[newMelodyToneAndDuration.tone].semitone + 1 - 1; // Convert to number
    const toSemitones = toNotes.map((x) => x.semitone);
    // Can we turn this note into a non-chord tone? Check the previous and next note.
    let nextMelodyToneAndDuration;
    let nextMelodyToneDivision;
    for (let i = newMelodyToneDivision + 1; i <= maxDivision; i++) {
        nextMelodyToneAndDuration = melodyTonesAndDurations[i];
        if (nextMelodyToneAndDuration) {
            nextMelodyToneDivision = i;
            break;
        }
    }
    if (!nextMelodyToneAndDuration || nextMelodyToneAndDuration.tone == undefined) {
        // No melody found at all. Give up.
        tension.comment = "No melody found at all. Give up.";
        return tension;
    }
    // Let's not care that much if the weak beat note is not correct. It just adds tension to the result.
    // UNLESS it's in the melody also.
    // What NAC could work?
    // Convert all values to globalSemitones
    const toGlobalSemitone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(toNotes[0]);
    const toGlobalSemitones = toNotes.map((x) => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(x));
    let prevRichNote;
    for (let i = currentDivision - 1; i >= 0; i--) {
        prevRichNote = (divisionedNotes[i] || []).filter(richNote => richNote.partIndex == 0)[0];
        if (prevRichNote) {
            break;
        }
    }
    let prevBeatRichNote = (divisionedNotes[currentDivision - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH] || []).filter(richNote => richNote.partIndex == 0)[0];
    let prevBeatGlobalSemitone = prevBeatRichNote ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(prevBeatRichNote.note) : null;
    let prevPart1RichNote;
    for (let i = currentDivision - 1; i >= 0; i--) {
        prevPart1RichNote = (divisionedNotes[i] || []).filter(richNote => richNote.partIndex == 1)[0];
        if (prevPart1RichNote) {
            break;
        }
    }
    // If previous note doesn't exist, this is actually easier.
    const fromGlobalSemitone = prevRichNote ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(prevRichNote.note) : null;
    // Trying to figure out the melody direction... We should put octaves in the forced melody string...
    const closestCorrectGToneBasedOn = prevBeatGlobalSemitone || fromGlobalSemitone || toGlobalSemitone;
    let closestCorrectGTone = newMelodySemitone;
    let iterations = 0;
    while (Math.abs(closestCorrectGTone - closestCorrectGToneBasedOn) > 6 && closestCorrectGTone <= semitoneLimits[0][1]) {
        iterations++;
        if (iterations > 100) {
            debugger;
            throw new Error("Too many iterations");
        }
        closestCorrectGTone += 12 * Math.sign(closestCorrectGToneBasedOn - closestCorrectGTone);
    }
    let nextCorrectGtone;
    if (nextMelodyToneAndDuration) {
        nextCorrectGtone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(currentScale.notes[nextMelodyToneAndDuration.tone]) % 12;
        iterations = 0;
        while (Math.abs(nextCorrectGtone - closestCorrectGTone) > 6 && nextCorrectGtone <= semitoneLimits[0][1]) {
            iterations++;
            if (iterations > 100) {
                debugger;
                throw new Error("Too many iterations");
            }
            nextCorrectGtone += 12 * Math.sign(closestCorrectGTone - nextCorrectGtone);
        }
    }
    if (!nextCorrectGtone || !nextMelodyToneAndDuration) {
        // If melody has ended, use current melody tone.
        nextCorrectGtone = closestCorrectGTone;
        nextMelodyToneAndDuration = newMelodyToneAndDuration;
    }
    let nextBeatMelodyToneAndDuration = melodyTonesAndDurations[cadenceDivision + _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH];
    if (!nextBeatMelodyToneAndDuration) {
        nextBeatMelodyToneAndDuration = nextMelodyToneAndDuration;
    }
    let nextBeatCorrectGTone;
    if (nextBeatMelodyToneAndDuration) {
        nextBeatCorrectGTone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(currentScale.notes[nextBeatMelodyToneAndDuration.tone]) % 12;
        iterations = 0;
        while (Math.abs(nextBeatCorrectGTone - nextCorrectGtone) > 6 && nextBeatCorrectGTone <= semitoneLimits[0][1]) {
            if (iterations++ > 100) {
                throw new Error("Too many iterations");
            }
            nextBeatCorrectGTone += 12 * Math.sign(nextCorrectGtone - nextBeatCorrectGTone);
        }
    }
    // Now we have 1: the previous note, 2: what the current note should be, 3: what the next note should be.
    // Based on the required durations, we have some choices:
    // 1. Beat melody is a quarter. This is the easiest case.
    // Here we can at the most use a 8th/8th NAC on the strong beat.
    // Though, tension is added.
    // 2. Current beat melody is 8th and 8th. Both notes MUST be correct.
    // Base on the next note we can use some NACs. This is where the weak beat NACs come in.
    // 3. Current beat melody is a half note. We can use a strong beat NAC.
    // Tension is added.
    // Harder cases, such as syncopation, are not handled. yet.
    let part1MaxGTone = Math.max(toGlobalSemitones[1], prevPart1RichNote ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(prevPart1RichNote.note) : 0);
    const nacParams = {
        fromGTone: fromGlobalSemitone || closestCorrectGTone,
        thisBeatGTone: toGlobalSemitone,
        nextBeatGTone: nextBeatCorrectGTone,
        scale: currentScale,
        chord: chord,
        gToneLimits: [part1MaxGTone, 127],
        wantedGTones: [],
    };
    const eeStrongMode = (newMelodyToneAndDuration.duration == _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH ||
        ((newMelodyToneAndDuration.duration == _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH / 2 && nextMelodyToneAndDuration.duration == _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH / 2) &&
            closestCorrectGTone != toGlobalSemitone));
    if (eeStrongMode) {
        if (closestCorrectGTone == toGlobalSemitone) {
            // This is the correct note. No tension.
            tension.comment = "Correct quarter note";
            return tension;
        }
        // Try to find a way to add a right NAC on the strong beat.
        nacParams.wantedGTones[0] = closestCorrectGTone;
        if (newMelodyToneAndDuration.duration == _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH / 2) {
            nacParams.wantedGTones[1] = nextCorrectGtone;
            if (toGlobalSemitone != nextCorrectGtone) {
                tension.comment = `InCorrect 8th/8th note, ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(toGlobalSemitone)} != ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(nextCorrectGtone)}`;
                tension.tension += 100;
                return tension;
            }
        }
        nacParams.splitMode = "EE";
        const nac = (0,_nonchordtones__WEBPACK_IMPORTED_MODULE_0__.findNACs)(nacParams);
        if (!nac) {
            tension.comment = `No NAC found: wantedTones: ${nacParams.wantedGTones.map(tone => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(tone))}` + `${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(nacParams.thisBeatGTone)}, ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(nextCorrectGtone)}, ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(nacParams.nextBeatGTone)}`;
            tension.tension += 100;
            return tension;
        }
        const newNoteGTone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(nac.note);
        // Great... We can add a correct 8th on the strong beat!
        // Add it
        // tension.comment = `Adding NAC on strong beat: ${gToneString(globalSemitone(nac.note))} to division ${currentDivision}, wantedGtones: ${nacParams.wantedGTones.map(gToneString)}`;
        tension.nac = nac;
        tension.tension += 5; // Not that great, but it's better than nothing.
    }
    else if (newMelodyToneAndDuration.duration == _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH / 2 && nextMelodyToneAndDuration.duration == _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH / 2) {
        // Try to find a way to add a right NAC on the strong beat. and a right nac on weak beat
        if (closestCorrectGTone == toGlobalSemitone) {
            // Strong beat is already correct. Need a note on weak beat
            nacParams.wantedGTones[1] = nextCorrectGtone;
            nacParams.splitMode = "EE";
            const nac = (0,_nonchordtones__WEBPACK_IMPORTED_MODULE_0__.findNACs)(nacParams);
            if (!nac) {
                tension.comment = "No NAC found for quarter note";
                tension.tension += 100;
                return tension;
            }
            const newNoteGTone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(nac.note);
            // Great... We can add a correct 8th on the strong beat!
            // Add it
            // tension.comment = `Adding weak EE NAC ${gToneString(globalSemitone(nac.note))} to division ${currentDivision}, wantedGtones: ${nacParams.wantedGTones.map(gToneString)}`;
            tension.nac = nac;
            // This is absolutely perfect, both notes are correct. (no tension!)
        }
        else {
            // Well, no can do then I guess.
            tension.comment = "closestCorrectGTone != toGlobalSemitone";
            tension.tension += 100;
            return tension;
        }
    }
    else {
        tension.comment = `${newMelodyToneAndDuration.duration} != ${_utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH}`;
    }
    tension.tension = 0;
    return tension;
};


/***/ }),

/***/ "./src/inversions.ts":
/*!***************************!*\
  !*** ./src/inversions.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getInversions": () => (/* binding */ getInversions)
/* harmony export */ });
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


const getInversions = (values) => {
    const { chord, prevNotes, beat, params, logger, beatsUntilLastChordInSong } = values;
    // Return Notes in the Chord that are closest to the previous notes
    // For each part
    const { startingGlobalSemitones, semitoneLimits } = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.startingNotes)(params);
    // Add a result for each possible inversion
    const ret = [];
    let lastBeatGlobalSemitones = [...startingGlobalSemitones];
    if (prevNotes) {
        lastBeatGlobalSemitones = prevNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(note));
    }
    if (!chord) {
        return [];
    }
    if (chord) {
        // For each beat, we try to find a good matching semitone for each part.
        // Rules:
        // With	root position triads: double the root. 
        // With first inversion triads: double the root or 5th, in general. If one needs to double 
        // the 3rd, that is acceptable, but avoid doubling the leading tone.
        // With second inversion triads: double the fifth. 
        // With  seventh  chords:  there  is  one voice  for  each  note,  so  distribute as  fits. If  one 
        // must omit a note from the chord, then omit the 5th.
        const firstInterval = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.semitoneDistance)(chord.notes[0].semitone, chord.notes[1].semitone);
        const thirdIsGood = firstInterval == 3 || firstInterval == 4;
        logger.log("notes: ", chord.notes.map(n => n.toString()));
        // Depending on the inversion and chord type, we're doing different things
        let inversionNames = ["root", "root-fifth", "first-root", "first-third", "first-fifth", "second"];
        let combinationCount = 3 * 2 * 1;
        if (chord.notes.length > 3) {
            inversionNames = ["root", "first", "second", "third"];
        }
        for (let skipFifthIndex = 0; skipFifthIndex < 2; skipFifthIndex++) {
            for (let inversionIndex = 0; inversionIndex < inversionNames.length; inversionIndex++) {
                for (let combinationIndex = 0; combinationIndex < combinationCount; combinationIndex++) {
                    const skipFifth = skipFifthIndex == 1;
                    // We try each inversion. Which is best?
                    const inversion = inversionNames[inversionIndex];
                    if (beatsUntilLastChordInSong < 2) {
                        if (!inversion.startsWith('root')) {
                            continue; // Don't do anything but root position on the last chord
                        }
                    }
                    const inversionResult = {
                        gToneDiffs: [],
                        notes: {},
                        rating: 0,
                        inversionName: inversionNames[inversionIndex],
                    };
                    if (skipFifth) {
                        inversionResult.inversionName += "-skipFifth";
                    }
                    inversionResult.inversionName += "-" + combinationIndex;
                    const addPartNote = (partIndex, note) => {
                        inversionResult.notes[partIndex] = new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                            semitone: note.semitone,
                            octave: 1 // dummy
                        });
                    };
                    logger.log("inversion: ", inversion, "skipFifth: ", skipFifth);
                    let partToIndex = {};
                    // First select bottom note
                    if (inversion.startsWith('root')) {
                        partToIndex[3] = 0;
                    }
                    else if (inversion.startsWith('first')) {
                        partToIndex[3] = 1;
                    }
                    else if (inversion.startsWith('second')) {
                        partToIndex[3] = 2;
                    }
                    else if (inversion.startsWith('third')) {
                        partToIndex[3] = 3;
                    }
                    // List notes we have left over
                    let leftOverIndexes = [];
                    if (chord.notes.length == 3) {
                        if (inversion == "root") {
                            leftOverIndexes = [0, 1, 2]; // Double the root
                        }
                        else if (inversion == "root-fifth") {
                            leftOverIndexes = [1, 2, 2]; // Double the fifth
                        }
                        else if (inversion == "first-root") {
                            // First -> We already have 1
                            leftOverIndexes = [0, 0, 2]; // Double the root
                        }
                        else if (inversion == "first-third") {
                            leftOverIndexes = [0, 1, 2]; // Double the third
                        }
                        else if (inversion == "first-fifth") {
                            leftOverIndexes = [0, 2, 2]; // Double the fifth
                        }
                        else if (inversion == "second") {
                            // Second -> We already have 2
                            leftOverIndexes = [0, 0, 1]; // Double the root
                        }
                    }
                    else if (chord.notes.length == 4) {
                        leftOverIndexes = [0, 1, 2, 3].filter(i => i != partToIndex[3]);
                    }
                    if (skipFifth) {
                        if (partToIndex[3] == 2) {
                            // Can't skip fifth in second inversion
                            continue;
                        }
                        if (leftOverIndexes.filter(i => i == 2).length != 0) {
                            // Can't skip fifth if we have two
                            continue;
                        }
                        leftOverIndexes = leftOverIndexes.filter(i => i != 2);
                        // Add either a 0 or 1 to replace the fifth
                        if (leftOverIndexes.filter(i => i == 0).length == 1) {
                            leftOverIndexes.push(0);
                        }
                        else {
                            leftOverIndexes.push(1);
                        }
                    }
                    // Depending on combinationIndex, we select the notes for partIndexes 0, 1, 2
                    if (combinationIndex === 0) {
                        // First permutation
                        partToIndex[0] = leftOverIndexes[0];
                        partToIndex[1] = leftOverIndexes[1];
                        partToIndex[2] = leftOverIndexes[2];
                    }
                    else if (combinationIndex === 1) {
                        // Second permutation
                        partToIndex[0] = leftOverIndexes[0];
                        partToIndex[1] = leftOverIndexes[2];
                        partToIndex[2] = leftOverIndexes[1];
                    }
                    else if (combinationIndex === 2) {
                        // Third permutation
                        partToIndex[0] = leftOverIndexes[1];
                        partToIndex[1] = leftOverIndexes[0];
                        partToIndex[2] = leftOverIndexes[2];
                    }
                    else if (combinationIndex === 3) {
                        // Fourth permutation
                        partToIndex[0] = leftOverIndexes[1];
                        partToIndex[1] = leftOverIndexes[2];
                        partToIndex[2] = leftOverIndexes[0];
                    }
                    else if (combinationIndex === 4) {
                        // Fifth permutation
                        partToIndex[0] = leftOverIndexes[2];
                        partToIndex[1] = leftOverIndexes[0];
                        partToIndex[2] = leftOverIndexes[1];
                    }
                    else if (combinationIndex === 5) {
                        // Sixth permutation
                        partToIndex[0] = leftOverIndexes[2];
                        partToIndex[1] = leftOverIndexes[1];
                        partToIndex[2] = leftOverIndexes[0];
                    }
                    for (let partIndex = 0; partIndex < 4; partIndex++) {
                        if (inversionResult.notes[partIndex]) {
                            // This part is already set
                            continue;
                        }
                        addPartNote(partIndex, chord.notes[partToIndex[partIndex]]);
                    }
                    // Lastly, we select the lowest possible octave for each part
                    let minSemitone = 0;
                    for (let partIndex = 3; partIndex >= 0; partIndex--) {
                        const note = inversionResult.notes[partIndex];
                        let gTone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(note);
                        let i = 0;
                        while (gTone < semitoneLimits[partIndex][0] || gTone < minSemitone) {
                            i++;
                            if (i > 1000) {
                                debugger;
                                throw "Too many iterations";
                            }
                            gTone += 12;
                        }
                        inversionResult.notes[partIndex] = new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                            semitone: gTone % 12,
                            octave: Math.floor(gTone / 12),
                        });
                    }
                    // Make a copy inversionresult for each possible octave combination
                    const initialPart0Note = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(inversionResult.notes[0]);
                    const initialPart1Note = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(inversionResult.notes[1]);
                    const initialPart2Note = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(inversionResult.notes[2]);
                    const initialPart3Note = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(inversionResult.notes[3]);
                    for (let part0Octave = 0; part0Octave < 3; part0Octave++) {
                        const part0Note = initialPart0Note + part0Octave * 12;
                        if (part0Note > semitoneLimits[0][1]) {
                            continue;
                        }
                        for (let part1Octave = 0; part1Octave < 3; part1Octave++) {
                            const part1Note = initialPart1Note + part1Octave * 12;
                            if (part1Note > part0Note) {
                                continue;
                            }
                            if (part1Note > semitoneLimits[1][1]) {
                                continue;
                            }
                            for (let part2Octave = 0; part2Octave < 3; part2Octave++) {
                                const part2Note = initialPart2Note + part2Octave * 12;
                                if (part2Note > part1Note) {
                                    continue;
                                }
                                if (part2Note > semitoneLimits[2][1]) {
                                    continue;
                                }
                                for (let part3Octave = 0; part3Octave < 3; part3Octave++) {
                                    const part3Note = initialPart3Note + part3Octave * 12;
                                    if (part3Note > part2Note) {
                                        continue;
                                    }
                                    if (part3Note > semitoneLimits[3][1]) {
                                        continue;
                                    }
                                    ret.push({
                                        notes: [
                                            new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                                                semitone: part0Note % 12,
                                                octave: Math.floor(part0Note / 12),
                                            }),
                                            new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                                                semitone: part1Note % 12,
                                                octave: Math.floor(part1Note / 12),
                                            }),
                                            new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                                                semitone: part2Note % 12,
                                                octave: Math.floor(part2Note / 12),
                                            }),
                                            new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                                                semitone: part3Note % 12,
                                                octave: Math.floor(part3Note / 12),
                                            }),
                                        ],
                                        inversionName: inversionResult.inversionName + ` ${part0Octave}${part1Octave}${part2Octave}${part3Octave}` + " " + (0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(part0Note) + " " + (0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(part1Note) + " " + (0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(part2Note) + " " + (0,_utils__WEBPACK_IMPORTED_MODULE_1__.gToneString)(part3Note),
                                        rating: 0,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    logger.print("newVoiceLeadingNotes: ", chord.toString(), " beat: ", beat);
    // Randomize order of ret
    for (let i = 0; i < ret.length; i++) {
        const j = Math.floor(Math.random() * ret.length);
        const tmp = ret[i];
        ret[i] = ret[j];
        ret[j] = tmp;
    }
    return ret;
};


/***/ }),

/***/ "./src/mylogger.ts":
/*!*************************!*\
  !*** ./src/mylogger.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Logger": () => (/* binding */ Logger)
/* harmony export */ });
const printChildMessages = (childLogger) => {
    for (const child of childLogger.children) {
        console.groupCollapsed(...child.title);
        printChildMessages(child);
        for (const message of child.messages) {
            console.log(...message);
        }
        console.groupEnd();
    }
};
class Logger {
    constructor(parent = undefined) {
        this.title = [];
        this.messages = [];
        this.parent = undefined;
        this.children = [];
        this.cleared = false;
        this.parent = parent;
        if (parent) {
            parent.children.push(this);
        }
    }
    log(...args) {
        this.messages.push(args);
    }
    print(...args) {
        if (this.cleared) {
            return;
        }
        if (this.parent) {
            // Let parent handle me
            if (args.length > 0) {
                this.title = args;
            }
            return;
        }
        if (args.length > 0) {
            console.groupCollapsed(...args);
        }
        else {
            console.groupCollapsed(...this.title);
        }
        // This is the top logger. Print everything.
        printChildMessages(this);
        for (let i = 0; i < this.messages.length; i++) {
            console.log(...this.messages[i]);
        }
        console.groupEnd();
    }
    clear() {
        this.messages = [];
        this.children = [];
        if (this.parent) {
            this.parent.children = this.parent.children.filter(child => child !== this);
        }
        this.cleared = true;
    }
}


/***/ }),

/***/ "./src/nonchordtones.ts":
/*!******************************!*\
  !*** ./src/nonchordtones.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addNoteBetween": () => (/* binding */ addNoteBetween),
/* harmony export */   "buildTopMelody": () => (/* binding */ buildTopMelody),
/* harmony export */   "findNACs": () => (/* binding */ findNACs)
/* harmony export */ });
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tension */ "./src/tension.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



const addNoteBetween = (nac, division, nextDivision, partIndex, divisionedNotes) => {
    const divisionDiff = nextDivision - division;
    const beatRichNote = (divisionedNotes[division] || []).filter(note => note.partIndex == partIndex)[0];
    if (!beatRichNote || !beatRichNote.note) {
        console.log("Faield to add note between", division, nextDivision, partIndex, divisionedNotes);
        return false;
    }
    const newNote = nac.note;
    const newNote2 = nac.note2;
    const strongBeat = nac.strongBeat;
    const replacement = nac.replacement || false;
    // If strong beat, we add newNote BEFORE beatRichNote
    // Otherwise we add newNote AFTER beatRichNote
    if (strongBeat) {
        beatRichNote.duration = divisionDiff / 2;
        divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
        const newRandomRichNote = {
            note: newNote,
            duration: divisionDiff / 2,
            chord: beatRichNote.chord,
            scale: beatRichNote.scale,
            partIndex: partIndex,
        };
        // Add new tone to division
        divisionedNotes[division].push(newRandomRichNote);
        // Remove beatRichNote from division
        divisionedNotes[division] = divisionedNotes[division].filter(note => note != beatRichNote);
        if (!replacement) {
            // Add beatRichNote to division + divisionDiff / 2
            divisionedNotes[division + divisionDiff / 2].push(beatRichNote);
        }
        else {
            // Add new tone also to division + divisionDiff / 2
            divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
        }
    }
    else {
        if (!newNote2) {
            // adding 1 8th note
            beatRichNote.duration = divisionDiff / 2;
            divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
            const newRandomRichNote = {
                note: newNote,
                duration: divisionDiff / 2,
                chord: beatRichNote.chord,
                scale: beatRichNote.scale,
                partIndex: partIndex,
            };
            divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
        }
        else {
            // adding 2 16th notes
            beatRichNote.duration = divisionDiff / 2;
            divisionedNotes[division + divisionDiff / 2] = divisionedNotes[division + divisionDiff / 2] || [];
            const newRandomRichNote = {
                note: newNote,
                duration: divisionDiff / 4,
                chord: beatRichNote.chord,
                scale: beatRichNote.scale,
                partIndex: partIndex,
            };
            divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
            divisionedNotes[division + divisionDiff * 0.75] = divisionedNotes[division + divisionDiff * 0.75] || [];
            const newRandomRichNote2 = {
                note: newNote2,
                duration: divisionDiff / 4,
                chord: beatRichNote.chord,
                scale: beatRichNote.scale,
                partIndex: partIndex,
            };
            divisionedNotes[division + divisionDiff * 0.75].push(newRandomRichNote2);
        }
    }
    return true;
};
const passingTone = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Return a new gTone or null, based on whether adding a passing tone is a good idea.
    const distance = Math.abs(gTone1 - gTone2);
    if (distance < 3 || distance > 4) {
        return null;
    }
    const scaleTones = scale.notes.map(n => n.semitone);
    for (let gTone = gTone1; gTone != gTone2; gTone += (gTone1 < gTone2 ? 1 : -1)) {
        if (gTone == gTone1) {
            continue;
        }
        if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
            continue;
        }
        const semitone = gTone % 12;
        if (scaleTones.includes(semitone)) {
            return {
                note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                    semitone: gTone % 12,
                    octave: Math.floor(gTone / 12),
                }),
                strongBeat: false,
            };
        }
    }
    return null;
};
const accentedPassingTone = (values) => {
    // Same as passing tone but on strong beat
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    if (!gTone0) {
        return null;
    }
    const distance = Math.abs(gTone0 - gTone1);
    if (distance < 3 || distance > 4) {
        return null;
    }
    const scaleTones = scale.notes.map(n => n.semitone);
    for (let gTone = gTone0; gTone != gTone1; gTone += (gTone0 < gTone1 ? 1 : -1)) {
        if (gTone == gTone0) {
            continue;
        }
        if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
            continue;
        }
        const semitone = gTone % 12;
        if (scaleTones.includes(semitone)) {
            return {
                note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                    semitone: gTone % 12,
                    octave: Math.floor(gTone / 12),
                }),
                strongBeat: true,
            };
        }
    }
    return null;
};
const neighborTone = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Step, then step back. This is on Weak beat
    if (gTone1 != gTone2) {
        return null;
    }
    const scaleIndex = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.semitoneScaleIndex)(scale)[gTone1 % 12];
    if (!scaleIndex) {
        return null;
    }
    const upOrDownChoices = Math.random() < 0.5 ? [1, -1] : [-1, 1];
    for (const upOrDown of upOrDownChoices) {
        const newGtone = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.nextGToneInScale)(gTone1, upOrDown, scale);
        if (!newGtone) {
            continue;
        }
        if (newGtone < gToneLimits[0] || newGtone > gToneLimits[1]) {
            continue;
        }
        return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
                semitone: newGtone % 12,
                octave: Math.floor(newGtone / 12),
            }), strongBeat: false };
    }
    return null;
};
const suspension = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Stay on previous, then step DOWN into chord tone. This is on Strong beat.
    // Usually dotted!
    if (!gTone0) {
        return null;
    }
    const distance = gTone0 - gTone1;
    if (distance < 1 || distance > 2) {
        // Must be half or whole step down.
        return null;
    }
    // Convert gTone1 to gTone0 for the length of the suspension.
    return {
        note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: gTone0 % 12,
            octave: Math.floor(gTone0 / 12),
        }),
        strongBeat: true,
    };
};
const retardation = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Stay on previous, then step UP into chord tone. This is on Strong beat
    // Usually dotted!
    if (!gTone0) {
        return null;
    }
    const distance = gTone1 - gTone0;
    if (distance < 1 || distance > 2) {
        // Must be half or whole step up.
        return null;
    }
    // Convert gTone1 to gTone0 for the length of the suspension.
    return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: gTone0 % 12,
            octave: Math.floor(gTone0 / 12),
        }), strongBeat: true };
};
const appogiatura = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Leap, then step back into Chord tone. This is on Strong beat
    if (!gTone0) {
        return null;
    }
    const distance = gTone1 - gTone0;
    if (Math.abs(distance) < 3) {
        return null;
    }
    let upOrDown = -1;
    // convert gTone1 to a step down for the duration of the appogiatura
    if (distance > 0) {
        // convert gTone1 to a step up for the duration of the appogiatura
        upOrDown = 1;
    }
    const gTone = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.nextGToneInScale)(gTone1, upOrDown, scale);
    if (!gTone) {
        return null;
    }
    if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
        return null;
    }
    return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: gTone % 12,
            octave: Math.floor(gTone / 12),
        }), strongBeat: true };
};
const escapeTone = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Step away, then Leap in to next Chord tone. This is on Strong beat
    if (!gTone0) {
        return null;
    }
    const distance = gTone1 - gTone0;
    if (Math.abs(distance) < 3) {
        return null;
    }
    let upOrDown = 1;
    // convert gTone1 to a step up from gTone0 for the duration of the escapeTone
    if (distance > 0) {
        // convert gTone1 to a step down from gTone0 for the duration of the escapeTone
        upOrDown = -1;
    }
    const gTone = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.nextGToneInScale)(gTone0, upOrDown, scale);
    if (!gTone) {
        return null;
    }
    if (gTone < gToneLimits[0] || gTone > gToneLimits[1]) {
        return null;
    }
    return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: gTone % 12,
            octave: Math.floor(gTone / 12),
        }), strongBeat: true };
};
const anticipation = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Step or leap early in to next Chord tone. This is on weak beat.
    const distance = gTone2 - gTone1;
    if (Math.abs(distance) < 1) {
        // Too close to be an anticipation
        return null;
    }
    // Easy. Just make a new note thats the same as gTone2.
    return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: gTone2 % 12,
            octave: Math.floor(gTone2 / 12),
        }), strongBeat: false };
};
const neighborGroup = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Step away, then leap into the "other possible" neighbor tone. This uses 16ths (two notes).
    // Weak beat
    if (gTone1 != gTone2) {
        return null;
    }
    const scaleIndex = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.semitoneScaleIndex)(scale)[gTone1 % 12];
    if (!scaleIndex) {
        return null;
    }
    const upGtone = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.nextGToneInScale)(gTone1, 1, scale);
    const downGtone = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.nextGToneInScale)(gTone1, -1, scale);
    if (!upGtone || !downGtone) {
        return null;
    }
    if (upGtone < gToneLimits[0] || upGtone > gToneLimits[1]) {
        return null;
    }
    if (downGtone < gToneLimits[0] || downGtone > gToneLimits[1]) {
        return null;
    }
    return {
        note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: upGtone % 12,
            octave: Math.floor(upGtone / 12),
        }),
        note2: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: downGtone % 12,
            octave: Math.floor(downGtone / 12),
        }),
        strongBeat: false
    };
};
const pedalPoint = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Replace the entire note with the note that is before it AND after it.
    if (gTone0 != gTone2) {
        return null;
    }
    if (gTone0 == gTone1) {
        return null; // Already exists
    }
    if (gTone1 < gToneLimits[0] || gTone1 > gToneLimits[1]) {
        return null;
    }
    return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: gTone0 % 12,
            octave: Math.floor(gTone0 / 12),
        }), strongBeat: true, replacement: true };
};
const chordNote = (values) => {
    // Just use a chord tone. Weak OR strong beat
    const { gTone1, chord } = values;
    let strongBeat = values.strongBeat;
    if (!strongBeat) {
        strongBeat = Math.random() > 0.8;
    }
    if (!chord) {
        return null;
    }
    let wantedTone = values.wantedTone;
    if (!wantedTone) {
        // Random from chord.notes
        const note = chord.notes[Math.floor(Math.random() * chord.notes.length)];
        wantedTone = note.semitone;
        // Select closest octave to gTone1
        let iterations = 0;
        while (Math.abs(wantedTone - gTone1) >= 6) {
            if (iterations++ > 1000) {
                throw new Error("Too many iterations");
            }
            wantedTone += 12;
        }
    }
    let good = false;
    for (const note of chord.notes) {
        if (note.semitone == wantedTone % 12) {
            good = true;
            break;
        }
    }
    if (!good) {
        // WantedTone is not a chord tone
        return null;
    }
    return { note: new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
            semitone: wantedTone % 12,
            octave: Math.floor(wantedTone / 12),
        }), strongBeat: strongBeat };
};
const weakBeatChordTone = (values) => {
    return chordNote(Object.assign(Object.assign({}, values), { strongBeat: false }));
};
const strongBeatChordTone = (values) => {
    return chordNote(Object.assign(Object.assign({}, values), { strongBeat: true }));
};
const findNACs = (values) => {
    const { fromGTone, thisBeatGTone, nextBeatGTone, splitMode, wantedGTones, scale, gToneLimits, chord } = values;
    const strongBeatFuncs = {
        'strongBeatChordTone': strongBeatChordTone,
        'appogiatura': appogiatura,
        'escapeTone': escapeTone,
        'pedalPoint': pedalPoint,
        'suspension': suspension,
        'retardation': retardation,
        'accentedPassingTone': accentedPassingTone,
    };
    const weakBeatFuncs = {
        'weakBeatChordTone': weakBeatChordTone,
        'anticipation': anticipation,
        'neighborGroup': neighborGroup,
        'passingTone': passingTone,
    };
    if (splitMode == 'EE') {
        // This case only has 2 choices: strong or weak beat
        let strongBeat = false;
        // Find the wanted notes
        // Check if we need a change on strong beat or on some other beat
        if (wantedGTones[0] && wantedGTones[0] != thisBeatGTone) {
            strongBeat = true;
        }
        if (strongBeat) {
            for (const funcName in strongBeatFuncs) {
                const func = strongBeatFuncs[funcName];
                const result = func({
                    gTone0: fromGTone,
                    gTone1: thisBeatGTone,
                    gTone2: nextBeatGTone,
                    wantedTone: wantedGTones[0],
                    scale,
                    gToneLimits,
                    chord,
                });
                if (result) {
                    if (!wantedGTones[0] || (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(result.note) == wantedGTones[0]) {
                        return result;
                    }
                }
            }
        }
        else {
            for (const funcName in weakBeatFuncs) {
                const func = weakBeatFuncs[funcName];
                const result = func({
                    gTone0: fromGTone,
                    gTone1: thisBeatGTone,
                    gTone2: nextBeatGTone,
                    wantedTone: wantedGTones[1],
                    scale,
                    gToneLimits,
                    chord,
                });
                if (result) {
                    if (!wantedGTones[1] || (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(result.note) == wantedGTones[1]) {
                        return result;
                    }
                }
            }
        }
    }
    return null;
};
const buildTopMelody = (divisionedNotes, mainParams) => {
    // Follow the pre given melody rhythm
    const rhythmNeededDurations = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRhythmNeededDurations)(mainParams);
    const lastDivision = _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH * mainParams.getMaxBeats();
    const firstParams = mainParams.currentCadenceParams(0);
    const { startingGlobalSemitones, semitoneLimits } = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.startingNotes)(firstParams);
    for (let division = 0; division < lastDivision - _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; division += _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH) {
        let gToneLimitsForThisBeat = [
            [...semitoneLimits[0]],
            [...semitoneLimits[1]],
            [...semitoneLimits[2]],
            [...semitoneLimits[3]],
        ];
        const params = mainParams.currentCadenceParams(division);
        const cadenceDivision = division - params.authenticCadenceStartDivision;
        const neededRhythm = rhythmNeededDurations[cadenceDivision] || 100;
        const lastBeatInCadence = params.beatsUntilCadenceEnd < 2;
        if (lastBeatInCadence) {
            continue;
        }
        const prevNotes = [];
        const thisNotes = [];
        const nextNotes = [];
        let currentScale;
        for (const richNote of divisionedNotes[division - _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] || []) {
            if (richNote.note) {
                prevNotes[richNote.partIndex] = richNote.note;
            }
        }
        for (const richNote of divisionedNotes[division] || []) {
            if (richNote.note) {
                prevNotes[richNote.partIndex] = richNote.note;
                if (richNote.scale) {
                    currentScale = richNote.scale;
                }
            }
        }
        for (const richNote of divisionedNotes[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH] || []) {
            if (richNote.note) {
                nextNotes[richNote.partIndex] = richNote.note;
            }
        }
        // @ts-ignore
        currentScale = currentScale;
        for (let partIndex = 0; partIndex < 4; partIndex++) {
            // Change limits, new notes must also be betweeen the other part notes
            // ( Overlapping )
            const richNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division, partIndex);
            const nextRichNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH, partIndex);
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            const gTone1 = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(richNote.note);
            const gTone2 = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(nextRichNote.note);
            const minGTone = Math.min(gTone1, gTone2);
            const maxGTone = Math.max(gTone1, gTone2);
            if (gToneLimitsForThisBeat[partIndex - 1]) {
                // Limit the higher part, it can't go lower than maxGTone
                gToneLimitsForThisBeat[partIndex - 1][0] = Math.max(gToneLimitsForThisBeat[partIndex - 1][0], maxGTone);
            }
            if (gToneLimitsForThisBeat[partIndex + 1]) {
                // Limit the lower part, it can't go higher than minGTone
                gToneLimitsForThisBeat[partIndex + 1][1] = Math.min(gToneLimitsForThisBeat[partIndex + 1][1], minGTone);
            }
        }
        for (let partIndex = 0; partIndex < 4; partIndex++) {
            if (neededRhythm != 2 * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH) {
                // No need for half notes
                continue;
            }
            // Add a tie to the next note
            const richNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division, partIndex);
            const nextRichNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH, partIndex);
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(richNote.note) != (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(nextRichNote.note)) {
                continue;
            }
            richNote.tie = "start";
            nextRichNote.tie = "stop";
        }
        for (let partIndex = 0; partIndex < 4; partIndex++) {
            if (neededRhythm != _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH / 2) {
                // No need for 8ths.
                continue;
            }
            const richNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division, partIndex);
            const nextRichNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH, partIndex);
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            if (!richNote.scale) {
                console.error("No scale for richNote", richNote);
                continue;
            }
            const prevRichNote = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getRichNote)(divisionedNotes, division - _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH, partIndex);
            const gTone1 = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(richNote.note);
            const gTone2 = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(nextRichNote.note);
            let gTone0 = prevRichNote ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.globalSemitone)(prevRichNote.note) : null;
            if (gTone0 && prevRichNote && prevRichNote.duration != _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH) {
                // FIXME: prevRichNote is not the previous note. We cannot use it to determine the previous note.
                gTone0 = null;
            }
            const nacParams = {
                gTone0,
                gTone1,
                gTone2,
                scale: richNote.scale,
                gToneLimits: gToneLimitsForThisBeat[partIndex],
            };
            // Try to find a way to ad 8th notes this beat.
            const nonChordToneChoiceFuncs = {
                appogiatura: () => appogiatura(nacParams),
                neighborGroup: () => neighborGroup(nacParams),
                suspension: () => suspension(nacParams),
                escapeTone: () => escapeTone(nacParams),
                passingTone: () => passingTone(nacParams),
                neighborTone: () => neighborTone(nacParams),
                retardation: () => retardation(nacParams),
                anticipation: () => anticipation(nacParams),
                pedalPoint: () => pedalPoint(nacParams),
            };
            let iterations = 0;
            let nonChordTone = null;
            const usedChoices = new Set();
            while (true) {
                iterations++;
                if (iterations > 1000) {
                    throw new Error("Too many iterations in 8th note generation");
                }
                let nonChordToneChoices = {};
                for (const key of Object.keys(nonChordToneChoiceFuncs)) {
                    const setting = params.nonChordTones[key];
                    if (!setting || !setting.enabled) {
                        continue;
                    }
                    const choice = nonChordToneChoiceFuncs[key]();
                    if (choice) {
                        nonChordToneChoices[key] = choice;
                    }
                }
                if (partIndex != 3) {
                    delete nonChordToneChoices.pedalPoint;
                }
                let usingKey = null;
                const availableKeys = Object.keys(nonChordToneChoices).filter(key => !usedChoices.has(key));
                if (availableKeys.length == 0) {
                    break;
                }
                for (let key in nonChordToneChoices) {
                    if (usedChoices.has(key)) {
                        continue;
                    }
                    if (nonChordToneChoices[key]) {
                        nonChordTone = nonChordToneChoices[key];
                        usingKey = key;
                        break;
                    }
                    if (!nonChordTone) {
                        continue;
                    }
                }
                if (!nonChordTone) {
                    break;
                }
                // We found a possible non chord tone
                // Now we need to check voice leading from before and after
                const nonChordToneNotes = [...thisNotes];
                if (nonChordTone.strongBeat) {
                    nonChordToneNotes[partIndex] = nonChordTone.note;
                }
                const tensionResult = new _tension__WEBPACK_IMPORTED_MODULE_1__.Tension();
                (0,_tension__WEBPACK_IMPORTED_MODULE_1__.getTension)(tensionResult, {
                    fromNotesOverride: prevNotes,
                    beatDivision: division,
                    toNotes: nonChordToneNotes,
                    currentScale: currentScale,
                    params: params,
                    mainParams: mainParams,
                });
                let tension = 0;
                tension += tensionResult.doubleLeadingTone;
                tension += tensionResult.parallelFifths;
                tension += tensionResult.spacingError;
                if (tension < 10) {
                    break;
                }
                console.log("Tension too high for non chord tone", tension, nonChordTone, tensionResult, usingKey);
                usedChoices.add(usingKey);
            }
            if (!nonChordTone) {
                continue;
            }
            const result = addNoteBetween(nonChordTone, division, division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH, partIndex, divisionedNotes);
            if (!result) {
                continue;
            }
            break;
        }
    }
};


/***/ }),

/***/ "./src/params.ts":
/*!***********************!*\
  !*** ./src/params.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainMusicParams": () => (/* binding */ MainMusicParams),
/* harmony export */   "MusicParams": () => (/* binding */ MusicParams)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class MainMusicParams {
    constructor(params = undefined) {
        this.beatsPerBar = 4;
        this.cadenceCount = 4;
        this.cadences = [];
        this.testMode = false;
        this.melodyRhythm = ""; // hidden from user for now
        this.forcedChords = "";
        if (params) {
            for (let key in params) {
                this[key] = params[key];
            }
        }
        // this.melodyRhythm = "QQQQQQQQQQQQQQQQQQQQQQ"
        this.melodyRhythm = "";
        // for (let i=0; i<20; i++) {
        //     const random = Math.random();
        //     if (random < 0.2) {
        //         this.melodyRhythm += "H";
        //         i += 1;
        //     } else if (random < 0.7) {
        //         this.melodyRhythm += "Q";
        //     } else {
        //         this.melodyRhythm += "EE";
        //     }
        // }
        // this.forcedMelody = [0, 1, 2, 3, 3, 3 ]
        //                   12 3 41 2 34 two bars
        // Do Re Mi Fa So La Ti Do
        // this.forcedMelody = "RRRRRRRRRRRRRRRRRRRR";
        this.forcedMelody = [];
        // let melody = [0];
        // for (let i=0; i<20; i++) {
        //     const upOrDown = Math.random() < 0.5 ? -1 : 1;
        //     const prevMelody = melody[melody.length - 1];
        //     melody.push(prevMelody + (1 * upOrDown));
        // }
        // this.forcedMelody = melody.map(m => (m + 7 * 100) % 7);
        // Example melody
        // C maj - C
        //         D pt
        // C maj   E
        //         F pt
        // A min   G pt
        //         A
        // A min   B pt
        //         C
        // F maj   B pt
        //         A
        // F maj   G pt
        //         F
        // G maj   E pt
        //         D
        // G maj   C pt
        //         D
        // C maj   E
        //         F pt
        // C maj   G
        //         A pt
        // this.forcedChords = "11664455116655111166445511665511"
    }
    currentCadenceParams(division) {
        const beat = Math.floor(division / _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH);
        const bar = Math.floor(beat / this.beatsPerBar);
        let counter = 0; // The beat we're at in the loop
        let authenticCadenceStartBar = 0;
        for (const cadenceParams of this.cadences) {
            // Loop cadences in orders
            counter += cadenceParams.barsPerCadence;
            if (["PAC", "IAC"].includes(cadenceParams.selectedCadence)) {
                authenticCadenceStartBar = counter;
            }
            if (bar < counter) { // We have passed the given division. The previous cadence is the one we want
                cadenceParams.beatsUntilCadenceEnd = counter * this.beatsPerBar - beat;
                if (["PAC", "IAC"].includes(cadenceParams.selectedCadence)) {
                    cadenceParams.beatsUntilAuthenticCadenceEnd = cadenceParams.beatsUntilCadenceEnd;
                }
                else {
                    cadenceParams.beatsUntilAuthenticCadenceEnd = 999;
                }
                cadenceParams.beatsUntilSongEnd = this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar - beat;
                cadenceParams.beatsPerBar = this.beatsPerBar;
                cadenceParams.cadenceStartDivision = ((counter - cadenceParams.barsPerCadence) * this.beatsPerBar) * _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
                cadenceParams.authenticCadenceStartDivision = authenticCadenceStartBar * this.beatsPerBar * _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
                return cadenceParams;
            }
        }
        return this.cadences[0];
    }
    getMaxBeats() {
        return this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar;
    }
}
class MusicParams {
    constructor(params = undefined) {
        this.beatsUntilCadenceEnd = 0;
        this.beatsUntilAuthenticCadenceEnd = 0;
        this.beatsUntilSongEnd = 0;
        this.beatsPerBar = 4;
        this.cadenceStartDivision = 0;
        this.authenticCadenceStartDivision = 0;
        this.baseTension = 0.3;
        this.barsPerCadence = 2;
        this.tempo = 40;
        this.halfNotes = true;
        this.sixteenthNotes = 0.2;
        this.eighthNotes = 0.4;
        this.modulationWeight = 0;
        this.leadingWeight = 2;
        this.parts = [
            {
                voice: "41",
                note: "C5",
                volume: 10,
            },
            {
                voice: "41",
                note: "A4",
                volume: 7,
            },
            {
                voice: "42",
                note: "C4",
                volume: 7,
            },
            {
                voice: "43",
                note: "E3",
                volume: 10,
            }
        ];
        this.beatSettings = [];
        this.chordSettings = {
            maj: {
                enabled: true,
                weight: 0,
            },
            min: {
                enabled: true,
                weight: 0,
            },
            dim: {
                enabled: true,
                weight: 0
            },
            aug: {
                enabled: true,
                weight: 0,
            },
            maj7: {
                enabled: true,
                weight: 0,
            },
            dom7: {
                enabled: true,
                weight: 0,
            },
        };
        this.scaleSettings = {
            major: {
                enabled: true,
                weight: 0,
            },
            minor: {
                enabled: true,
                weight: 0,
            },
        };
        this.selectedCadence = "HC";
        this.nonChordTones = {
            passingTone: {
                enabled: true,
                weight: 1,
            },
            neighborTone: {
                enabled: true,
                weight: 1,
            },
            suspension: {
                enabled: true,
                weight: 1,
            },
            retardation: {
                enabled: true,
                weight: 1,
            },
            appogiatura: {
                enabled: true,
                weight: 1,
            },
            escapeTone: {
                enabled: true,
                weight: 1,
            },
            anticipation: {
                enabled: true,
                weight: 1,
            },
            neighborGroup: {
                enabled: true,
                weight: 1,
            },
            pedalPoint: {
                enabled: true,
                weight: 1,
            },
        };
        if (params) {
            for (let key in params) {
                this[key] = params[key];
            }
        }
        this.updateBeatSettings();
    }
    updateBeatSettings() {
        const beatCount = this.beatsPerBar * this.barsPerCadence;
        if (this.beatSettings.length < beatCount) {
            for (let i = this.beatSettings.length; i < beatCount; i++) {
                this.beatSettings.push({
                    tension: this.baseTension || 0.3,
                });
            }
        }
        else if (this.beatSettings.length > beatCount) {
            this.beatSettings = this.beatSettings.slice(0, beatCount);
        }
    }
}


/***/ }),

/***/ "./src/randomchords.ts":
/*!*****************************!*\
  !*** ./src/randomchords.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RandomChordGenerator": () => (/* binding */ RandomChordGenerator)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class RandomChordGenerator {
    constructor(params) {
        const chordTypes = [];
        for (const chordType in params.chordSettings) {
            if (params.chordSettings[chordType].enabled) {
                chordTypes.push(chordType);
            }
        }
        this.chordTypes = chordTypes;
        this.usedChords = new Set();
        this.buildAvailableChords();
    }
    ;
    buildAvailableChords() {
        if (!this.usedChords) {
            this.usedChords = new Set();
        }
        this.availableChords = (this.availableChords || []).filter(chord => !(this.usedChords || new Set()).has(chord));
        // First try to add the simplest chords
        for (const simpleChordType of this.chordTypes.filter(chordType => ["maj", "min"].includes(chordType))) {
            for (let randomRoot = 0; randomRoot < 12; randomRoot++) {
                if (!this.usedChords.has(randomRoot + simpleChordType)) {
                    this.availableChords.push(randomRoot + simpleChordType);
                }
            }
        }
        if (this.availableChords.length > 0) {
            return;
        }
        for (let i = 0; i < 100; i++) {
            const randomType = this.chordTypes[Math.floor(Math.random() * this.chordTypes.length)];
            const randomRoot = Math.floor(Math.random() * 12);
            if (!this.usedChords.has(randomRoot + randomType)) {
                this.availableChords.push(randomRoot + randomType);
            }
        }
    }
    ;
    cleanUp() {
        if (this.usedChords) {
            this.usedChords.clear();
        }
        this.availableChords = [];
        delete this.usedChords;
        delete this.availableChords;
    }
    getChord() {
        if (!this.availableChords || this.availableChords.length === 0) {
            this.buildAvailableChords();
        }
        let iterations = 0;
        while (true) {
            if (iterations++ > 100) {
                return null;
            }
            if (this.availableChords && this.usedChords) {
                while (this.availableChords.length - 3 > 0) {
                    const chordType = this.availableChords[Math.floor(Math.random() * this.availableChords.length)];
                    if (!this.usedChords.has(chordType)) {
                        this.usedChords.add(chordType);
                        this.availableChords = this.availableChords.filter(chord => chord !== chordType);
                        return new _utils__WEBPACK_IMPORTED_MODULE_0__.Chord(chordType);
                    }
                }
            }
            this.buildAvailableChords();
        }
    }
}


/***/ }),

/***/ "./src/tension.ts":
/*!************************!*\
  !*** ./src/tension.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tension": () => (/* binding */ Tension),
/* harmony export */   "getTension": () => (/* binding */ getTension)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class Tension {
    constructor() {
        this.notInScale = 0;
        this.modulation = 0;
        this.allNotesSame = 0;
        this.chordProgression = 0;
        this.keepDominantTones = 0;
        this.parallelFifths = 0;
        this.spacingError = 0;
        this.cadence = 0;
        this.tensioningInterval = 0;
        this.secondInversion = 0;
        this.doubleLeadingTone = 0;
        this.leadingToneUp = 0;
        this.melodyJump = 0;
        this.melodyTarget = 0;
        this.voiceDirections = 0;
        this.overlapping = 0;
        this.forcedMelody = 0;
        this.totalTension = 0;
        this.comment = "";
    }
    getTotalTension(values) {
        const { params, beatsUntilLastChordInCadence } = values;
        let tension = 0;
        tension += this.notInScale * 100;
        tension += this.modulation;
        tension += this.allNotesSame;
        tension += this.chordProgression;
        tension += this.keepDominantTones;
        tension += this.parallelFifths * 100;
        tension += this.spacingError;
        tension += this.cadence;
        tension += this.tensioningInterval;
        tension += this.secondInversion;
        tension += this.doubleLeadingTone;
        tension += this.leadingToneUp;
        tension += this.melodyTarget;
        if (beatsUntilLastChordInCadence > 4) {
            tension += this.melodyJump;
        }
        else {
            tension += this.melodyJump;
        }
        tension += this.voiceDirections;
        tension += this.overlapping;
        tension += this.forcedMelody;
        this.totalTension = tension;
        return tension;
    }
    print(...args) {
        // Print only positive values
        const toPrint = {};
        for (const key in this) {
            if (this[key] && typeof this[key] == "number") {
                toPrint[key] = this[key].toFixed(1);
            }
        }
        if (this.comment) {
            console.log(this.comment, ...args, toPrint);
        }
        else {
            console.log(...args, toPrint);
        }
    }
}
const getTension = (tension, values) => {
    const { divisionedNotes, fromNotesOverride, toNotes, newChord, currentScale, beatsUntilLastChordInCadence, beatsUntilLastChordInSong, inversionName, prevInversionName, params, mainParams, beatDivision, } = values;
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    let prevChord;
    let prevPrevChord;
    let passedFromNotes = [];
    let prevPassedFromNotes = [];
    let latestNotes = [];
    if (divisionedNotes) {
        const latestDivision = beatDivision - _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
        let tmp = [];
        for (const richNote of (divisionedNotes[latestDivision] || [])) {
            // Use original notes, not the ones that have been turned into NACs
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevChord = richNote.chord;
        }
        passedFromNotes = [...tmp].filter(Boolean);
        tmp = [];
        for (const richNote of (divisionedNotes[latestDivision - _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH] || [])) {
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevPrevChord = richNote.chord;
        }
        prevPassedFromNotes = [...tmp].filter(Boolean);
        for (let i = beatDivision; i >= 0; i--) {
            for (const richNote of (divisionedNotes[i] || [])) {
                if (latestNotes[richNote.partIndex]) {
                    continue;
                }
                latestNotes[richNote.partIndex] = richNote.originalNote || richNote.note;
            }
            if (latestNotes.filter(note => note).length == 4) {
                break;
            }
        }
    }
    else if (fromNotesOverride) {
        passedFromNotes = fromNotesOverride;
    }
    let allsame = true;
    for (let i = 0; i < toNotes.length; i++) {
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
    }
    else {
        fromNotes = passedFromNotes;
    }
    const toSemitones = toNotes.map(note => note.semitone);
    const fromGlobalSemitones = fromNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(note));
    const toGlobalSemitones = toNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(note));
    // If the notes are not in the current scale, increase the tension
    let notesNotInScale = [];
    let newScale = null;
    const leadingTone = (currentScale.key - 1 + 24) % 12;
    if (currentScale) {
        const scaleSemitones = currentScale.notes.map(note => note.semitone);
        notesNotInScale = toSemitones.filter(semitone => !scaleSemitones.includes(semitone));
        notesNotInScale = notesNotInScale.filter(semitone => semitone != leadingTone);
        if (notesNotInScale.length > 0) {
            // Quick return, this chord sucks
            tension.notInScale += 100;
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
        for (let i = 0; i < fromGlobalSemitones.length; i++) {
            const fromSemitone = fromGlobalSemitones[i];
            const toSemitone = toGlobalSemitones[i];
            if (Math.abs(fromSemitone - toSemitone) > 2) {
                tension.secondInversion += 100;
            }
        }
    }
    if (inversionName && inversionName.startsWith('root')) {
        tension.secondInversion -= 0.1; // Root inversions are great
    }
    const semitoneScaleIndex = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6,
        [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6 // Force add leading tone
    };
    const leadingToneSemitone = currentScale.notes[0].semitone + 11;
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
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
        const scaleIndex = semitoneScaleIndex[(toGlobalSemitone + 12) % 12];
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
    };
    const partDirection = [];
    let rootBassDirection = null;
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
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
    for (let i = 0; i < toGlobalSemitones.length; i++) {
        for (let j = i + 1; j < toGlobalSemitones.length; j++) {
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
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
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
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
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
        if (interval >= 10) { // 7th == 10
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
        const latestFromGlobalSemitones = latestNotes.map((n) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n));
        for (let i = 0; i < fromGlobalSemitones.length; i++) {
            const interval = Math.abs(latestFromGlobalSemitones[i] - fromGlobalSemitones[i]);
            if (interval >= 3) {
                // There was a jump. WE MUST GO BACK!
                // Basically the toGlobalSemitone must be between the prevFromGlobalSemitone and the fromGlobalSemitone
                // UNLESS we're outlining a triad.
                // This would mean that after a 4th up, we need to go up another 3rd
                const prevFromSemitone = latestFromGlobalSemitones[i];
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
                    }
                    else if (interval <= 4) {
                        tension.melodyJump += 4; // Not as bad
                    }
                    else {
                        tension.melodyJump += 100; // Terrible
                    }
                }
                else {
                    // Going back down/up...
                    const backInterval = Math.abs(toSemitone - fromSemitone);
                    if (backInterval > 2) {
                        // Going back too much
                        if (interval <= 3) {
                            tension.melodyJump += 5;
                        }
                        else {
                            tension.melodyJump += 100;
                        }
                    }
                }
            }
        }
        const prevPassedFromGTones = prevPassedFromNotes ? prevPassedFromNotes.map((n) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n)) : [];
        for (let i = 0; i < 1; i++) {
            const gTonesForThisPart = [];
            if (prevPassedFromGTones[i]) {
                gTonesForThisPart.push(prevPassedFromGTones[i]);
            }
            gTonesForThisPart.push(fromGlobalSemitones[i]);
            if (latestFromGlobalSemitones[i]) {
                gTonesForThisPart.push(latestFromGlobalSemitones[i]);
            }
            gTonesForThisPart.push(toGlobalSemitones[i]);
            let generalDirection = 0;
            // Get directions before latest notes
            // E.g. if the note values have been 0, 1, 4, 0
            // the generalDirection would be 1 + 4 == 5, which means that even though the
            // global direction is "same", the general direction is "up"
            for (let j = 0; j < gTonesForThisPart.length - 2; j++) {
                generalDirection += gTonesForThisPart[j + 1] - gTonesForThisPart[j];
            }
            const globalDirection = gTonesForThisPart[gTonesForThisPart.length - 1] - gTonesForThisPart[0];
            const finalDirection = gTonesForThisPart[gTonesForThisPart.length - 1] - gTonesForThisPart[gTonesForThisPart.length - 2];
            tension.comment = "finalDirection: " + finalDirection + ", globalDirection: " + globalDirection + ", generalDirection: " + generalDirection;
            if (finalDirection == 0) {
                tension.melodyTarget += 0.5;
            }
            const semitoneLimit = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.startingNotes)(params).semitoneLimits[i];
            let targetNote = semitoneLimit[1] - 4;
            targetNote -= i * 2;
            let targetNoteReached = false;
            const authenticCadenceStartDivision = params.authenticCadenceStartDivision;
            for (let div = beatDivision; div > authenticCadenceStartDivision; div--) {
                const notes = (divisionedNotes || {})[div] || [];
                for (const prevNote of notes.filter(richNote => richNote.partIndex == i)) {
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(prevNote.note) == targetNote) {
                        targetNoteReached = true;
                    }
                }
            }
            if (targetNoteReached) {
                tension.comment = "Target note reached ";
                if (Math.abs(toGlobalSemitones[i] - targetNote) <= 2) {
                    // We're close to the target note, let's NOT go up
                    if (finalDirection > 0) {
                        tension.melodyTarget += 10;
                    }
                }
                if (Math.abs(toGlobalSemitones[i] - targetNote) <= 8) {
                    // We're close to the target note, let's NOT a lot up
                    if (generalDirection > 0) {
                        tension.melodyTarget += generalDirection;
                    }
                }
            }
            else {
                if (globalDirection < 0 && finalDirection < 0) {
                    // We're goin down, not good
                    tension.melodyTarget += -1 * globalDirection;
                }
            }
            break;
        }
    }
    return tension;
};


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BEAT_LENGTH": () => (/* binding */ BEAT_LENGTH),
/* harmony export */   "Chord": () => (/* binding */ Chord),
/* harmony export */   "arrayOrderBy": () => (/* binding */ arrayOrderBy),
/* harmony export */   "chordTemplates": () => (/* binding */ chordTemplates),
/* harmony export */   "gToneString": () => (/* binding */ gToneString),
/* harmony export */   "getClosestOctave": () => (/* binding */ getClosestOctave),
/* harmony export */   "getMelodyNeededTones": () => (/* binding */ getMelodyNeededTones),
/* harmony export */   "getRhythmNeededDurations": () => (/* binding */ getRhythmNeededDurations),
/* harmony export */   "getRichNote": () => (/* binding */ getRichNote),
/* harmony export */   "globalSemitone": () => (/* binding */ globalSemitone),
/* harmony export */   "majScaleCircle": () => (/* binding */ majScaleCircle),
/* harmony export */   "majScaleDifference": () => (/* binding */ majScaleDifference),
/* harmony export */   "nextGToneInScale": () => (/* binding */ nextGToneInScale),
/* harmony export */   "semitoneDistance": () => (/* binding */ semitoneDistance),
/* harmony export */   "semitoneScaleIndex": () => (/* binding */ semitoneScaleIndex),
/* harmony export */   "startingNotes": () => (/* binding */ startingNotes)
/* harmony export */ });
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);

const BEAT_LENGTH = 12;
const semitoneDistance = (tone1, tone2) => {
    // distance from 0 to 11 should be 1
    // 0 - 11 + 12 => 1
    // 11 - 0 + 12 => 23 => 11
    // 0 - 6 + 12 => 6
    // 6 - 0 + 12 => 18 => 6
    // 0 + 6 - 3 + 6 = 6 - 9 = -3
    // 6 + 6 - 9 + 6 = 12 - 15 = 0 - 3 = -3
    // 11 + 6 - 0 + 6 = 17 - 6 = 5 - 6 = -1
    // 0 + 6 - 11 + 6 = 6 - 17 = 6 - 5 = 1
    // (6 + 6) % 12 = 0
    // (5 + 6) % 12 = 11
    // Result = 11!!!!
    return Math.min(Math.abs(tone1 - tone2), Math.abs((tone1 + 6) % 12 - (tone2 + 6) % 12));
};
const semitoneScaleIndex = (scale) => ({
    [scale.notes[0].semitone]: 0,
    [scale.notes[1].semitone]: 1,
    [scale.notes[2].semitone]: 2,
    [scale.notes[3].semitone]: 3,
    [scale.notes[4].semitone]: 4,
    [scale.notes[5].semitone]: 5,
    [scale.notes[6].semitone]: 6,
});
const nextGToneInScale = (gTone, indexDiff, scale) => {
    let gTone1 = gTone;
    const scaleIndexes = semitoneScaleIndex(scale);
    let scaleIndex = scaleIndexes[gTone1 % 12];
    if (!scaleIndex) {
        gTone1 = gTone + 1;
        scaleIndex = scaleIndexes[gTone1 % 12];
    }
    if (!scaleIndex) {
        gTone1 = gTone - 1;
        scaleIndex = scaleIndexes[gTone1 % 12];
    }
    if (!scaleIndex) {
        return null;
    }
    const newScaleIndex = (scaleIndex + indexDiff) % 7;
    const newSemitone = scale.notes[newScaleIndex].semitone;
    const distance = semitoneDistance(gTone1 % 12, newSemitone);
    const newGtone = gTone1 + (distance * (indexDiff > 0 ? 1 : -1));
    return newGtone;
};
const startingNotes = (params) => {
    const p1Note = params.parts[0].note || "F4";
    const p2Note = params.parts[1].note || "C4";
    const p3Note = params.parts[2].note || "A3";
    const p4Note = params.parts[3].note || "C3";
    const startingGlobalSemitones = [
        globalSemitone(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note(p1Note)),
        globalSemitone(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note(p2Note)),
        globalSemitone(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note(p3Note)),
        globalSemitone(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note(p4Note)),
    ];
    const semitoneLimits = [
        [startingGlobalSemitones[0] + -12, startingGlobalSemitones[0] + 12 - 5],
        [startingGlobalSemitones[1] + -12, startingGlobalSemitones[1] + 12 - 5],
        [startingGlobalSemitones[2] + -12, startingGlobalSemitones[2] + 12 - 5],
        [startingGlobalSemitones[3] + -12, startingGlobalSemitones[3] + 12 - 5],
    ];
    return {
        startingGlobalSemitones,
        semitoneLimits,
    };
};
const mySemitoneStrings = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B",
};
const gToneString = (gTone) => {
    if (!gTone) {
        return "null";
    }
    return `${mySemitoneStrings[gTone % 12]}${Math.floor(gTone / 12)}`;
};
const arrayOrderBy = function (array, selector, desc = false) {
    return [...array].sort((a, b) => {
        a = selector(a);
        b = selector(b);
        if (a == b)
            return 0;
        return (desc ? a > b : a < b) ? -1 : 1;
    });
};
const chordTemplates = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
};
class Chord {
    constructor(semitoneOrName, chordType = undefined) {
        let semitone;
        if (typeof semitoneOrName === "string") {
            semitone = semitoneOrName.match(/^\d+/);
            const parsedType = semitoneOrName.match(/^\d+(.*)/);
            if (semitone == null) {
                throw "Invalid chord name " + semitoneOrName;
            }
            if (parsedType == null) {
                throw "Invalid chord name " + semitoneOrName;
            }
            semitone = parseInt(semitone[0]);
            chordType = chordType || parsedType[1];
        }
        else {
            semitone = semitoneOrName;
        }
        this.root = parseInt(`${semitone}`);
        this.chordType = chordType || "?";
        const template = chordTemplates[this.chordType];
        if (template == undefined) {
            throw "Unknown chord type: " + chordType;
        }
        this.notes = [];
        for (let note of template) {
            this.notes.push(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({ semitone: (semitone + note) % 12, octave: 1 }));
        }
    }
    toString() {
        // Find correct Semitone key
        const semitoneKeys = Object.keys(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone).filter(key => musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone[key] === this.notes[0].semitone);
        if (semitoneKeys.length == 0) {
            return this.notes.map(note => note.toString()).join(", ");
        }
        let semitoneKey = semitoneKeys.filter(key => key.indexOf('b') == -1 && key.indexOf('s') == -1)[0] || semitoneKeys[0];
        semitoneKey = semitoneKey.replace('s', '#');
        return semitoneKey + this.chordType;
    }
}
const globalSemitone = (note) => {
    return note.semitone + ((note.octave) * 12);
};
const getClosestOctave = (note, targetNote = null, targetSemitone = null) => {
    let semitone = globalSemitone(note);
    if (!targetNote && !targetSemitone) {
        throw new Error("No target note or semitone provided");
    }
    targetSemitone = targetSemitone || globalSemitone(targetNote);
    console.log("Closest octave: ", semitone, targetSemitone);
    // Using modulo here -> -7 % 12 = -7
    // -13 % 12 = -1
    if (semitone == targetSemitone) {
        return note.octave;
    }
    const delta = targetSemitone > semitone ? 12 : -12;
    let ret = 0;
    let i = 0;
    const cleanOctave = (octave) => {
        return Math.min(Math.max(octave, 2), 6);
    };
    while (true) {
        i++;
        if (i > 1000) {
            throw new Error("Infinite loop");
        }
        semitone += delta;
        ret += delta / 12; // How many octaves we changed
        if (delta > 0) {
            if (semitone >= targetSemitone) {
                if (Math.abs(semitone - targetSemitone) > Math.abs(semitone - 12 - targetSemitone)) {
                    // We went too far, go one back
                    ret -= 1;
                }
                console.log("Closest octave res: ", cleanOctave(note.octave + ret), ret);
                return cleanOctave(note.octave + ret);
            }
        }
        else {
            if (semitone <= targetSemitone) {
                if (Math.abs(semitone - targetSemitone) > Math.abs(semitone + 12 - targetSemitone)) {
                    // We went too far, go one back
                    ret += 1;
                }
                console.log("Closest octave res: ", cleanOctave(note.octave + ret), ret);
                return cleanOctave(note.octave + ret);
            }
        }
    }
};
const majScaleCircle = {};
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.C] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.G, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.F];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.G] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.D, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.C];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.D] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.A, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.G];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.A] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.E, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.D];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.E] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.B, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.A];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.B] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Fs, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.E];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.F] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.C, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Bb];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Bb] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.F, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Eb];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Eb] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Bb, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Ab];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Ab] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Eb, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Db];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Db] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Ab, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Gb];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Gb] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Db, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Cb];
majScaleCircle[musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Cb] = [musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Gb, musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Semitone.Fb];
const majScaleDifference = (semitone1, semitone2) => {
    // Given two major scales, return how closely related they are
    // 0 = same scale
    // 1 = E.G. C and F or C and G
    let currentVal = majScaleCircle[semitone1];
    if (semitone1 == semitone2) {
        return 0;
    }
    for (let i = 0; i < 12; i++) {
        if (currentVal.includes(semitone2)) {
            return i + 1;
        }
        const newCurrentVal = new Set();
        for (const semitone of currentVal) {
            for (const newSemitone of majScaleCircle[semitone]) {
                newCurrentVal.add(newSemitone);
            }
        }
        currentVal = [...newCurrentVal];
    }
    return 12;
};
const getRichNote = (divisionedNotes, division, partIndex) => {
    if (division in divisionedNotes) {
        for (const note of divisionedNotes[division]) {
            if (note.partIndex == partIndex) {
                return note;
            }
        }
    }
    return null;
};
function getRhythmNeededDurations(mainParams) {
    const melodyRhythmString = mainParams.melodyRhythm;
    // Figure out what needs to happen each beat to get our melody
    let rhythmDivision = 0;
    const rhythmNeededDurations = {};
    for (let i = 0; i < melodyRhythmString.length; i++) {
        const rhythm = melodyRhythmString[i];
        if (rhythm == "W") {
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH * 4;
            rhythmDivision += BEAT_LENGTH * 4;
            // TODO
        }
        else if (rhythm == "H") {
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH * 2;
            rhythmDivision += BEAT_LENGTH * 2;
            // TODO
        }
        else if (rhythm == "Q") {
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH;
            rhythmDivision += BEAT_LENGTH;
            continue; // Nothing to do
        }
        else if (rhythm == "E") {
            // This division needs to be converted to Eighth
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH / 2;
            rhythmDivision += BEAT_LENGTH / 2;
        }
        else if (rhythm == "S") {
            // This division needs to be converted to Sixteenth
            rhythmNeededDurations[rhythmDivision] = BEAT_LENGTH / 4;
            rhythmDivision += BEAT_LENGTH / 4;
        }
    }
    return rhythmNeededDurations;
}
function getMelodyNeededTones(mainParams) {
    const rhythmNeededDurations = getRhythmNeededDurations(mainParams);
    const forcedMelodyArray = mainParams.forcedMelody || "";
    const ret = {};
    // Figure out what needs to happen each beat to get our melody
    let counter = -1;
    for (const division in rhythmNeededDurations) {
        counter++;
        const divisionNum = parseInt(division);
        ret[divisionNum] = {
            "duration": rhythmNeededDurations[divisionNum],
            "tone": forcedMelodyArray[counter],
        };
    }
    return ret;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************!*\
  !*** ./worker.ts ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_chords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/chords */ "./src/chords.ts");
/* harmony import */ var _src_params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/params */ "./src/params.ts");
/* harmony import */ var _src_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/utils */ "./src/utils.ts");



(0,_src_chords__WEBPACK_IMPORTED_MODULE_0__.buildTables)();
self.onmessage = (event) => {
    console.log("Got message", event.data);
    const params = new _src_params__WEBPACK_IMPORTED_MODULE_1__.MainMusicParams(JSON.parse(event.data.params || "{}"));
    if (event.data.newMelody) {
        (0,_src_chords__WEBPACK_IMPORTED_MODULE_0__.makeMelody)(self.divisionedNotes, params);
        self.postMessage({ divisionedRichNotes: JSON.parse(JSON.stringify(self.divisionedNotes)) });
        return;
    }
    if (event.data.giveUp) {
        self.giveUP = true;
        return;
    }
    let promise;
    const progressCallback = (currentBeat, divisionedRichNotes) => {
        if (self.giveUP) {
            return "giveUP";
        }
        if (!divisionedRichNotes) {
            return;
        }
        const richNotes = divisionedRichNotes[currentBeat * _src_utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH];
        if (currentBeat != null && richNotes && richNotes[0] && richNotes[0].chord) {
            self.postMessage({
                progress: {
                    currentBeat,
                    chord: richNotes[0].chord.toString(),
                },
                divisionedRichNotes: JSON.parse(JSON.stringify(divisionedRichNotes))
            });
        }
    };
    (0,_src_chords__WEBPACK_IMPORTED_MODULE_0__.makeMusic)(params, progressCallback).then((result) => {
        const divisionedNotes = result.divisionedNotes;
        if (Object.keys(divisionedNotes).length === 0) {
            return;
        }
        self.divisionedNotes = divisionedNotes;
        self.postMessage({ divisionedRichNotes: JSON.parse(JSON.stringify(divisionedNotes)) });
    }).catch((err) => {
        console.error(err);
        self.postMessage({ error: err });
    });
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0IscUJBQXFCO3dCQUNyQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdB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QUFXO29CQUNYLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtpQkFDdkM7Z0JBQ0QsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDdkUsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBQ0Qsc0RBQVMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNoRCxNQUFNLGVBQWUsR0FBd0IsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUNwRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQyxPQUFPO1NBQ1Y7UUFDQSxJQUFZLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3pGLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL211c2ljdGhlb3J5anMvZGlzdC9tdXNpY3RoZW9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXZhaWxhYmxlc2NhbGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHByb2dyZXNzaW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZvcmNlZG1lbG9keS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW52ZXJzaW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbXlsb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vbmNob3JkdG9uZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcmFtcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFuZG9tY2hvcmRzLnRzIiwid2VicGFjazovLy8uL3NyYy90ZW5zaW9uLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwuTXVzaWNUaGVvcnkgPSB7fSkpO1xufSkodGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgLyoqXHJcbiAgICAqIE5vdGVzIHN0YXJ0aW5nIGF0IEMwIC0gemVybyBpbmRleCAtIDEyIHRvdGFsXHJcbiAgICAqIE1hcHMgbm90ZSBuYW1lcyB0byBzZW1pdG9uZSB2YWx1ZXMgc3RhcnRpbmcgYXQgQz0wXHJcbiAgICAqIEBlbnVtXHJcbiAgICAqL1xyXG4gICB2YXIgU2VtaXRvbmU7XHJcbiAgIChmdW5jdGlvbiAoU2VtaXRvbmUpIHtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQVwiXSA9IDldID0gXCJBXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFzXCJdID0gMTBdID0gXCJBc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCYlwiXSA9IDEwXSA9IFwiQmJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQlwiXSA9IDExXSA9IFwiQlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCc1wiXSA9IDBdID0gXCJCc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDYlwiXSA9IDExXSA9IFwiQ2JcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ1wiXSA9IDBdID0gXCJDXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNzXCJdID0gMV0gPSBcIkNzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRiXCJdID0gMV0gPSBcIkRiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRcIl0gPSAyXSA9IFwiRFwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEc1wiXSA9IDNdID0gXCJEc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFYlwiXSA9IDNdID0gXCJFYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFXCJdID0gNF0gPSBcIkVcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRXNcIl0gPSA1XSA9IFwiRXNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRmJcIl0gPSA0XSA9IFwiRmJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRlwiXSA9IDVdID0gXCJGXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZzXCJdID0gNl0gPSBcIkZzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdiXCJdID0gNl0gPSBcIkdiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdcIl0gPSA3XSA9IFwiR1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHc1wiXSA9IDhdID0gXCJHc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBYlwiXSA9IDhdID0gXCJBYlwiO1xyXG4gICB9KShTZW1pdG9uZSB8fCAoU2VtaXRvbmUgPSB7fSkpO1xyXG4gICAvKipcclxuICAgICogUmV0dXJucyB0aGUgd2hvbGUgbm90ZSBuYW1lIChlLmcuIEMsIEQsIEUsIEYsIEcsIEEsIEIpIGZvclxyXG4gICAgKiB0aGUgZ2l2ZW4gc3RyaW5nXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgZ2V0V2hvbGVUb25lRnJvbU5hbWUgPSAobmFtZSkgPT4ge1xyXG4gICAgICAgaWYgKCFuYW1lIHx8IG5hbWUubGVuZ3RoID09PSAwIHx8IG5hbWUubGVuZ3RoID4gMSlcclxuICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG5hbWVcIik7XHJcbiAgICAgICBjb25zdCBrZXkgPSBuYW1lWzBdLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICByZXR1cm4gU2VtaXRvbmVba2V5XTtcclxuICAgfTtcclxuICAgdmFyIFNlbWl0b25lJDEgPSBTZW1pdG9uZTtcblxuICAgLyoqXHJcbiAgICAqIFdyYXBzIGEgbnVtYmVyIGJldHdlZW4gYSBtaW4gYW5kIG1heCB2YWx1ZS5cclxuICAgICogQHBhcmFtIHZhbHVlIC0gdGhlIG51bWJlciB0byB3cmFwXHJcbiAgICAqIEBwYXJhbSBsb3dlciAgLSB0aGUgbG93ZXIgYm91bmRcclxuICAgICogQHBhcmFtIHVwcGVyIC0gdGhlIHVwcGVyIGJvdW5kXHJcbiAgICAqIEByZXR1cm5zIHdyYXBwZWROdW1iZXIgLSB0aGUgd3JhcHBlZCBudW1iZXJcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCB3cmFwID0gKHZhbHVlLCBsb3dlciwgdXBwZXIpID0+IHtcclxuICAgICAgIC8vIGNvcGllc1xyXG4gICAgICAgbGV0IHZhbCA9IHZhbHVlO1xyXG4gICAgICAgbGV0IGxib3VuZCA9IGxvd2VyO1xyXG4gICAgICAgbGV0IHVib3VuZCA9IHVwcGVyO1xyXG4gICAgICAgLy8gaWYgdGhlIGJvdW5kcyBhcmUgaW52ZXJ0ZWQsIHN3YXAgdGhlbSBoZXJlXHJcbiAgICAgICBpZiAodXBwZXIgPCBsb3dlcikge1xyXG4gICAgICAgICAgIGxib3VuZCA9IHVwcGVyO1xyXG4gICAgICAgICAgIHVib3VuZCA9IGxvd2VyO1xyXG4gICAgICAgfVxyXG4gICAgICAgLy8gdGhlIGFtb3VudCBuZWVkZWQgdG8gbW92ZSB0aGUgcmFuZ2UgYW5kIHZhbHVlIHRvIHplcm9cclxuICAgICAgIGNvbnN0IHplcm9PZmZzZXQgPSAwIC0gbGJvdW5kO1xyXG4gICAgICAgLy8gb2Zmc2V0IHRoZSB2YWx1ZXMgc28gdGhhdCB0aGUgbG93ZXIgYm91bmQgaXMgemVyb1xyXG4gICAgICAgbGJvdW5kICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICB1Ym91bmQgKz0gemVyb09mZnNldDtcclxuICAgICAgIHZhbCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgLy8gY29tcHV0ZSB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSB2YWx1ZSB3aWxsIHdyYXBcclxuICAgICAgIGxldCB3cmFwcyA9IE1hdGgudHJ1bmModmFsIC8gdWJvdW5kKTtcclxuICAgICAgIC8vIGNhc2U6IC0xIC8gdWJvdW5kKD4wKSB3aWxsIGVxdWFsIDAgYWx0aG91Z2ggaXQgd3JhcHMgb25jZVxyXG4gICAgICAgaWYgKHdyYXBzID09PSAwICYmIHZhbCA8IGxib3VuZClcclxuICAgICAgICAgICB3cmFwcyA9IC0xO1xyXG4gICAgICAgLy8gY2FzZTogdWJvdW5kIGFuZCB2YWx1ZSBhcmUgdGhlIHNhbWUgdmFsL3Vib3VuZCA9IDEgYnV0IGFjdHVhbGx5IGRvZXNudCB3cmFwXHJcbiAgICAgICBpZiAod3JhcHMgPT09IDEgJiYgdmFsID09PSB1Ym91bmQpXHJcbiAgICAgICAgICAgd3JhcHMgPSAwO1xyXG4gICAgICAgLy8gbmVlZGVkIHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgbnVtIG9mIHdyYXBzIGlzIDAgb3IgMSBvciAtMVxyXG4gICAgICAgbGV0IHZhbE9mZnNldCA9IDA7XHJcbiAgICAgICBsZXQgd3JhcE9mZnNldCA9IDA7XHJcbiAgICAgICBpZiAod3JhcHMgPj0gLTEgJiYgd3JhcHMgPD0gMSlcclxuICAgICAgICAgICB3cmFwT2Zmc2V0ID0gMTtcclxuICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBpcyBiZWxvdyB0aGUgcmFuZ2VcclxuICAgICAgIGlmICh2YWwgPCBsYm91bmQpIHtcclxuICAgICAgICAgICB2YWxPZmZzZXQgPSAodmFsICUgdWJvdW5kKSArIHdyYXBPZmZzZXQ7XHJcbiAgICAgICAgICAgdmFsID0gdWJvdW5kICsgdmFsT2Zmc2V0O1xyXG4gICAgICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBpcyBhYm92ZSB0aGUgcmFuZ2VcclxuICAgICAgIH1cclxuICAgICAgIGVsc2UgaWYgKHZhbCA+IHVib3VuZCkge1xyXG4gICAgICAgICAgIHZhbE9mZnNldCA9ICh2YWwgJSB1Ym91bmQpIC0gd3JhcE9mZnNldDtcclxuICAgICAgICAgICB2YWwgPSBsYm91bmQgKyB2YWxPZmZzZXQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvLyBhZGQgdGhlIG9mZnNldCBmcm9tIHplcm8gYmFjayB0byB0aGUgdmFsdWVcclxuICAgICAgIHZhbCAtPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICB2YWx1ZTogdmFsLFxyXG4gICAgICAgICAgIG51bVdyYXBzOiB3cmFwcyxcclxuICAgICAgIH07XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTaW1wbGUgdXRpbCB0byBjbGFtcCBhIG51bWJlciB0byBhIHJhbmdlXHJcbiAgICAqIEBwYXJhbSBwTnVtIC0gdGhlIG51bWJlciB0byBjbGFtcFxyXG4gICAgKiBAcGFyYW0gcExvd2VyIC0gdGhlIGxvd2VyIGJvdW5kXHJcbiAgICAqIEBwYXJhbSBwVXBwZXIgLSB0aGUgdXBwZXIgYm91bmRcclxuICAgICogQHJldHVybnMgTnVtYmVyIC0gdGhlIGNsYW1wZWQgbnVtYmVyXHJcbiAgICAqXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2xhbXAgPSAocE51bSwgcExvd2VyLCBwVXBwZXIpID0+IE1hdGgubWF4KE1hdGgubWluKHBOdW0sIE1hdGgubWF4KHBMb3dlciwgcFVwcGVyKSksIE1hdGgubWluKHBMb3dlciwgcFVwcGVyKSk7XG5cbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvLyBDb25zdGFudHNcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IE1PRElGSUVEX1NFTUlUT05FUyA9IFsxLCAzLCA0LCA2LCA4LCAxMF07XHJcbiAgIGNvbnN0IFRPTkVTX01BWCA9IDExO1xyXG4gICBjb25zdCBUT05FU19NSU4gPSAwO1xyXG4gICBjb25zdCBPQ1RBVkVfTUFYID0gOTtcclxuICAgY29uc3QgT0NUQVZFX01JTiA9IDA7XHJcbiAgIGNvbnN0IERFRkFVTFRfT0NUQVZFID0gNDtcclxuICAgY29uc3QgREVGQVVMVF9TRU1JVE9ORSA9IDA7XG5cbiAgIC8qKlxyXG4gICAgKiBNYXBzIG5vdGUgYWx0ZXJhdGlvbnMgdG8gIHRoZWlyIHJlbGF0aXZlIG1hdGhtYXRpY2FsIHZhbHVlXHJcbiAgICAqQGVudW1cclxuICAgICovXHJcbiAgIHZhciBNb2RpZmllcjtcclxuICAgKGZ1bmN0aW9uIChNb2RpZmllcikge1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJGTEFUXCJdID0gLTFdID0gXCJGTEFUXCI7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIk5BVFVSQUxcIl0gPSAwXSA9IFwiTkFUVVJBTFwiO1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJTSEFSUFwiXSA9IDFdID0gXCJTSEFSUFwiO1xyXG4gICB9KShNb2RpZmllciB8fCAoTW9kaWZpZXIgPSB7fSkpO1xyXG4gICAvKipcclxuICAgICogUGFyc2VzIG1vZGlmaWVyIGZyb20gc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBlbnVtIHZhbHVlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VNb2RpZmllciA9IChtb2RpZmllcikgPT4ge1xyXG4gICAgICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICAgICAgIGNhc2UgXCJiXCI6XHJcbiAgICAgICAgICAgY2FzZSBcImZsYXRcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLkZMQVQ7XHJcbiAgICAgICAgICAgY2FzZSBcIiNcIjpcclxuICAgICAgICAgICBjYXNlIFwic1wiOlxyXG4gICAgICAgICAgIGNhc2UgXCJzaGFycFwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuU0hBUlA7XHJcbiAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLk5BVFVSQUw7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIHZhciBNb2RpZmllciQxID0gTW9kaWZpZXI7XG5cbiAgIC8vIGltcG9ydCB7IHJlZ2lzdGVySW5pdGlhbGl6ZXIgfSBmcm9tIFwiLi4vSW5pdGlhbGl6ZXIvSW5pdGlhbGl6ZXJcIjtcclxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVMb29rdXAuanNvblwiO1xyXG4gICAvLyBpbXBvcnQgZnMgZnJvbSBcImZzXCI7XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBuYW1lUmVnZXgkMiA9IC8oW0EtR10pL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXgkMiA9IC8oI3xzfGIpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4JDIgPSAvKFswLTldKykvZztcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBwYXJzZSBhIG5vdGUgZnJvbSBhIHN0cmluZ1xyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IHBhcnNlTm90ZSA9IChub3RlLCBzdXByZXNzV2FybmluZyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5vdGVMb29rdXAobm90ZSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IG5vdGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke25vdGV9LiBHZXQgYSBwZXJmb3JtYW5jZSBpbmNyZWFzZSBieSB1c2luZyB0aGUgZm9ybWF0IFtBLUddWyN8c3xiXVswLTldIGFuZCB1c2luZyBidWlsZFRhYmxlcyBtZXRob2Qoc2VlIGRvY3VtZW50YXRpb24pYCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBub3RlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtub3RlfS4gR2V0IGEgcGVyZm9ybWFuY2UgaW5jcmVhc2UgYnkgdXNpbmcgdGhlIGZvcm1hdCBbQS1HXVsjfHN8Yl1bMC05XSBhbmQgdXNpbmcgYnVpbGRUYWJsZXMgbWV0aG9kKHNlZSBkb2N1bWVudGF0aW9uKWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBub3RlLm1hdGNoKG5hbWVSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG1vZGlmaWVyTWF0Y2ggPSBub3RlLm1hdGNoKG1vZGlmaWVyUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IG5vdGUubWF0Y2gob2N0YXZlUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG5vdGU6ICR7bm90ZX1gKTtcclxuICAgfTtcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgY3JlYXRlVGFibGUkNCA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IG5vdGVUYWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGZvciAoY29uc3Qgbm90ZUxhYmVsIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgbm90ZVRhYmxlW25vdGVMYWJlbF0gPSBwYXJzZU5vdGUobm90ZUxhYmVsLCB0cnVlKTsgLy8gJ0MnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgZm9yIChsZXQgaU1vZGlmaWVyT3V0ZXIgPSAwOyBpTW9kaWZpZXJPdXRlciA8IG5vdGVNb2RpZmllcnMubGVuZ3RoOyArK2lNb2RpZmllck91dGVyKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke25vdGVNb2RpZmllcnNbaU1vZGlmaWVyT3V0ZXJdfWA7XHJcbiAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDIycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPCBPQ1RBVkVfTUFYOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7aU9jdGF2ZX1gO1xyXG4gICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIGZvciAobGV0IGlNb2RpZmllciA9IDA7IGlNb2RpZmllciA8IG5vdGVNb2RpZmllcnMubGVuZ3RoOyArK2lNb2RpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bm90ZU1vZGlmaWVyc1tpTW9kaWZpZXJdfSR7aU9jdGF2ZX1gO1xyXG4gICAgICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0MjNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBub3RlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBUaGUgbG9va3VwIHRhYmxlXHJcbiAgICAqL1xyXG4gICBsZXQgX25vdGVMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZUxvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkTm90ZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfSk7XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IHRhYmxlO1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGROb3RlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlJDQoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBub3RlIHRhYmxlXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlTG9va3VwO1xyXG4gICB9O1xuXG4gICAvLyBpbXBvcnQgeyByZWdpc3RlckluaXRpYWxpemVyIH0gZnJvbSBcIi4uL0luaXRpYWxpemVyL0luaXRpYWxpemVyXCI7XHJcbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlU3RyaW5nTG9va3VwLmpzb25cIjtcclxuICAgY29uc3QgVU5LTk9XTl9NT0RJRklFUl9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiQyMvRGJcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJEIy9FYlwiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiRiMvR2JcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJHIy9BYlwiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkEjL0JiXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgU0hBUlBfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkMjXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRCNcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkYjXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiRyNcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJBI1wiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IEZMQVRfTU9ESUZJRVJfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkRiXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRWJcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkdiXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiQWJcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJCYlwiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDMgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChsZXQgaVRvbmUgPSBUT05FU19NSU47IGlUb25lIDw9IFRPTkVTX01BWDsgKytpVG9uZSkge1xyXG4gICAgICAgICAgIGZvciAobGV0IGlQcmV2ID0gVE9ORVNfTUlOOyBpUHJldiA8PSBUT05FU19NQVg7ICsraVByZXYpIHtcclxuICAgICAgICAgICAgICAgLy8gZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPD0gT0NUQVZFX01BWDsgaU9jdGF2ZSsrKSB7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2RpZmllciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgIGlmIChNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXMoaVRvbmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiLVwiOyAvLyBoYXMgYW4gdW5rbm93biBtb2RpZmllclxyXG4gICAgICAgICAgICAgICAgICAgLy8gaWYgaXMgZmxhdFxyXG4gICAgICAgICAgICAgICAgICAgaWYgKHdyYXAoaVRvbmUgKyAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09IGlQcmV2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCJiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBpcyBzaGFycFxyXG4gICAgICAgICAgICAgICAgICAgaWYgKHdyYXAoaVRvbmUgLSAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09IGlQcmV2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCIjXCI7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy8gZ2V0IG5vdGUgbmFtZSBmcm9tIHRhYmxlXHJcbiAgICAgICAgICAgICAgIHRhYmxlW2Ake2lUb25lfS0ke2lQcmV2fWBdID0gZ2V0Tm90ZUxhYmVsKGlUb25lLCBtb2RpZmllcik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgY29uc3QgZ2V0Tm90ZUxhYmVsID0gKHRvbmUsIG1vZGlmaWVyKSA9PiB7XHJcbiAgICAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgY2FzZSBcIiNcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIFNIQVJQX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgICAgICBjYXNlIFwiYlwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gRkxBVF9NT0RJRklFUl9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICAgICAgY2FzZSBcIi1cIjpcclxuICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICByZXR1cm4gVU5LTk9XTl9NT0RJRklFUl9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIGxldCBfbm90ZVN0cmluZ0xvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3RlU3RyaW5nTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIGlmIChPYmplY3Qua2V5cyhfbm90ZVN0cmluZ0xvb2t1cCkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVTdHJpbmdMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfSk7XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IHRhYmxlO1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGROb3RlU3RyaW5nVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmtleXMoX25vdGVTdHJpbmdMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cDtcclxuICAgICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUkMygpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZVN0cmluZ0xvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIk5vdGUgc3RyaW5nIHRhYmxlIGJ1aWx0LlwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cDtcclxuICAgfTtcblxuICAgdmFyIElEWD0yNTYsIEhFWD1bXSwgU0laRT0yNTYsIEJVRkZFUjtcbiAgIHdoaWxlIChJRFgtLSkgSEVYW0lEWF0gPSAoSURYICsgMjU2KS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xuXG4gICBmdW5jdGlvbiB1aWQobGVuKSB7XG4gICBcdHZhciBpPTAsIHRtcD0obGVuIHx8IDExKTtcbiAgIFx0aWYgKCFCVUZGRVIgfHwgKChJRFggKyB0bXApID4gU0laRSoyKSkge1xuICAgXHRcdGZvciAoQlVGRkVSPScnLElEWD0wOyBpIDwgU0laRTsgaSsrKSB7XG4gICBcdFx0XHRCVUZGRVIgKz0gSEVYW01hdGgucmFuZG9tKCkgKiAyNTYgfCAwXTtcbiAgIFx0XHR9XG4gICBcdH1cblxuICAgXHRyZXR1cm4gQlVGRkVSLnN1YnN0cmluZyhJRFgsIElEWCsrICsgdG1wKTtcbiAgIH1cblxuICAgLy8gaW1wb3J0IElkZW50aWZpYWJsZSBmcm9tIFwiLi4vY29tcG9zYWJsZXMvSWRlbnRpZmlhYmxlXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBBIG5vdGUgY29uc2lzdCBvZiBhIHNlbWl0b25lIGFuZCBhbiBvY3RhdmUuPGJyPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQgeyBOb3RlSW5pdGlhbGl6ZXIgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiOyAvLyB0eXBlc2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgTm90ZSB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgd2l0aCBkZWZhdWx0IHZhbHVlcyBzZW1pdG9uZSAwKEMpIGFuZCBvY3RhdmUgNFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHVzaW5nIGFuIGluaXRpYWxpemVyIG9iamVjdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtzZW1pdG9uZTogNCwgb2N0YXZlOiA1fSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiBub3RlLW5hbWVbbW9kaWZpZXJdW29jdGF2ZV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB1c2luZyBhIHN0cmluZ1xyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKFwiQzVcIik7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgdmFsdWVzID0gcGFyc2VOb3RlKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB2YWx1ZXM/LnNlbWl0b25lID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAvLyBpbXBvcnRhbnQgdGhhdCBvY3RhdmUgaXMgc2V0IGZpcnN0IHNvIHRoYXRcclxuICAgICAgICAgICAgICAgLy8gc2V0dGluZyB0aGUgc2VtaXRvbmUgY2FuIGNoYW5nZSB0aGUgb2N0YXZlXHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB2YWx1ZXM/LnNlbWl0b25lID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgdW5pcXVlIGlkIGZvciB0aGlzIG5vdGUoYXV0byBnZW5lcmF0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlkKTsgLy8gczI4OThzbmxvalxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNlbWl0b25lXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIF9wcmV2U2VtaXRvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gMFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBzZW1pdG9uZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9uZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2V0dGluZyB0aGUgc2VtaXRvbmUgd2l0aCBhIG51bWJlciBvdXRzaWRlIHRoZVxyXG4gICAgICAgICogcmFuZ2Ugb2YgMC0xMSB3aWxsIHdyYXAgdGhlIHZhbHVlIGFyb3VuZCBhbmRcclxuICAgICAgICAqIGNoYW5nZSB0aGUgb2N0YXZlIGFjY29yZGluZ2x5XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBub3RlLnNlbWl0b25lID0gNDsvLyBFXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gNChFKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBzZW1pdG9uZShzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHNlbWl0b25lLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB0aGlzLl90b25lID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSB0aGlzLl9vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLm9jdGF2ZSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogbm90ZS5vY3RhdmUgPSAxMDtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUub2N0YXZlKTsgLy8gOShiZWNhdXNlIG9mIGNsYW1waW5nKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUob2N0YXZlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAob2N0YXZlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgc2hhcnBlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5zaGFycCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZTIuc2VtaXRvbmUpOyAvLyAxKEMjKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoYXJwKCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pLnNoYXJwZW4oKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2hhcnBlbnMgdGhlIG5vdGUgaW4gcGxhY2UuXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogbm90ZS5zaGFycGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gMShDIylcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hhcnBlbigpIHtcclxuICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdGhpcy5zZW1pdG9uZSArIDE7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBhdHRlbXB0cyB0byBkZXRlcm1pbmUgaWYgdGhlIG5vdGUgaXMgc2hhcnBcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG5vdGUgaXMgc2hhcnBcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzU2hhcnAoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBub3RlLnNoYXJwZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNTaGFycCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzU2hhcnAoKSB7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyB3aG9sZSwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBjb25zdCBtb2RpZmllZCA9IE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyh0aGlzLnNlbWl0b25lKTtcclxuICAgICAgICAgICBpZiAoIW1vZGlmaWVkKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyBmbGF0LCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGlmICh3cmFwKHRoaXMuc2VtaXRvbmUgKyAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSlcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL2lzIGZsYXRcclxuICAgICAgICAgICAvLyBEb2Vzbid0IG5lY2NlY2FyaWx5IG1lYW4gaXQncyBzaGFycCwgYnV0IGl0J3MgYSBnb29kIGd1ZXNzIGF0IHRoaXMgcG9pbnRcclxuICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBmbGF0dGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBmbGF0dGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLmZsYXQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUyLnNlbWl0b25lKTsgLy8gMyhFYilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBmbGF0KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pLmZsYXR0ZW4oKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogRmxhdHRlbnMgdGhlIG5vdGUgaW4gcGxhY2UuXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtzZW1pdG9uZTogNH0pOyAvLyAgc2VtaXRvbmUgaXMgNChFKVxyXG4gICAgICAgICogbm90ZS5mbGF0dGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gMyhFYilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBmbGF0dGVuKCkge1xyXG4gICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lIC0gMTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIGF0dGVtcHRzIHRvIGRldGVybWluZSBpZiB0aGUgbm90ZSBpcyBmbGF0XHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBub3RlIGlzIGZsYXRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzRmxhdCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIG5vdGUuZmxhdHRlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc0ZsYXQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0ZsYXQoKSB7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyB3aG9sZSwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBjb25zdCBtb2RpZmllZCA9IE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyh0aGlzLnNlbWl0b25lKTtcclxuICAgICAgICAgICBpZiAoIW1vZGlmaWVkKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyBzaGFycCwgaXQgY2FuJ3QgYmUgZmxhdFxyXG4gICAgICAgICAgIGlmICh3cmFwKHRoaXMuc2VtaXRvbmUgLSAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSlcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL2lzIHNoYXJwXHJcbiAgICAgICAgICAgLy8gRG9lc24ndCBuZWNjZWNhcmlseSBtZWFuIGl0J3MgZmxhdCwgYnV0IGl0J3MgYSBnb29kIGd1ZXNzIGF0IHRoaXMgcG9pbnRcclxuICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGlzIG5vdGUgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuZXF1YWxzKG5vdGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnNlbWl0b25lID09PSBub3RlLnNlbWl0b25lICYmIHRoaXMub2N0YXZlID09PSBub3RlLm9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmVxdWFscyhub3RlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIHN0cmluZyB2ZXJzaW9uIG9mIHRoaXMgbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEM0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5vdGVTdHJpbmdMb29rdXApO1xyXG4gICAgICAgICAgIHJldHVybiAobm90ZVN0cmluZ0xvb2t1cChgJHt0aGlzLl90b25lfS0ke3RoaXMuX3ByZXZTZW1pdG9uZX1gKSArXHJcbiAgICAgICAgICAgICAgIGAke3RoaXMuX29jdGF2ZX1gKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU3RhdGljIG1ldGhvZHMgdG8gY3JlYXRlIHdob2xlIG5vdGVzIGVhc2lseS5cclxuICAgICAgICAqIHRoZSBkZWZhdWx0IG9jdGF2ZSBpcyA0XHJcbiAgICAgICAgKi9cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gQVtvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuQSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQTRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgQShvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuQSxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gQltvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuQigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQjRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgQihvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuQixcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gQ1tvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuQygpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgQyhvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuQyxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gRFtvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRChvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRCxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gRVtvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRTRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRShvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRSxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gRltvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRjRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRihvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRixcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gR1tvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRygpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRyhvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRyxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBDb25zdGFudHNcclxuICAgICovXHJcbiAgIGNvbnN0IE1JRElLRVlfU1RBUlQgPSAxMjtcclxuICAgY29uc3QgTlVNX09DVEFWRVMgPSAxMDtcclxuICAgY29uc3QgTlVNX1NFTUlUT05FUyA9IDEyO1xyXG4gICAvKipcclxuICAgICogQ2FsY3VsYXRlcyB0aGUgbWlkaSBrZXkgZm9yIGEgZ2l2ZW4gb2N0YXZlIGFuZCBzZW1pdG9uZS5cclxuICAgICovXHJcbiAgIGNvbnN0IGNhbGNNaWRpS2V5ID0gKG9jdGF2ZSwgc2VtaXRvbmUpID0+IE1JRElLRVlfU1RBUlQgKyBvY3RhdmUgKiBOVU1fU0VNSVRPTkVTICsgc2VtaXRvbmU7XHJcbiAgIC8qKlxyXG4gICAgKiBDYWxjdWxhdGVzIHRoZSBmcmVxdWVuY3kgZm9yIGEgZ2l2ZW4gb2N0YXZlIGFuZCBzZW1pdG9uZSBnaXZlblxyXG4gICAgKiBhIHR1bmluZyBmb3IgYTQuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjYWxjRnJlcXVlbmN5ID0gKG1pZGlLZXksIGE0VHVuaW5nKSA9PiAyICoqICgobWlkaUtleSAtIDY5KSAvIDEyKSAqIGE0VHVuaW5nO1xyXG4gICAvKipcclxuICAgICogQ3JlYXRlcyBhbmQgcmV0dXJuIGxvb2t1cCB0YWJsZXMgZm9yIG1pZGlrZXkgYW5kIGZyZXF1ZW5jeS5cclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlcyA9IChhNFR1bmluZyA9IDQ0MCkgPT4ge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNYXBzIG9jdGF2ZSBhbmQgc2VtaXRvbmUgdG8gbm90ZSBmcmVxdWVuY3koaGVydHopLlxyXG4gICAgICAgICogcmVxdWlyZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2YgYDxvY3RhdmU+LTxzZW1pdG9uZT5gXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0IGZyZXFUYWJsZSA9IHt9O1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNYXBzIG9jdGF2ZSBhbmQgc2VtaXRvbmUgdG8gbWlkaSBrZXkuXHJcbiAgICAgICAgKiByZXF1aXJlcyBhIGtleSBpbiB0aGUgZm9ybSBvZiBgPG9jdGF2ZT4tPHNlbWl0b25lPmBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3QgbWlkaVRhYmxlID0ge307XHJcbiAgICAgICBsZXQgaU9jdGF2ZSA9IDA7XHJcbiAgICAgICBsZXQgaVNlbWl0b25lID0gMDtcclxuICAgICAgIGZvciAoaU9jdGF2ZSA9IDA7IGlPY3RhdmUgPCBOVU1fT0NUQVZFUzsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgZm9yIChpU2VtaXRvbmUgPSAwOyBpU2VtaXRvbmUgPCBOVU1fU0VNSVRPTkVTOyArK2lTZW1pdG9uZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtpT2N0YXZlfS0ke2lTZW1pdG9uZX1gO1xyXG4gICAgICAgICAgICAgICBjb25zdCBta2V5ID0gY2FsY01pZGlLZXkoaU9jdGF2ZSwgaVNlbWl0b25lKTtcclxuICAgICAgICAgICAgICAgY29uc3QgZnJlcSA9IGNhbGNGcmVxdWVuY3kobWtleSwgYTRUdW5pbmcpO1xyXG4gICAgICAgICAgICAgICBtaWRpVGFibGVba2V5XSA9IG1rZXk7XHJcbiAgICAgICAgICAgICAgIGZyZXFUYWJsZVtrZXldID0gZnJlcTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgIGZyZXFMb29rdXA6IGZyZXFUYWJsZSxcclxuICAgICAgICAgICBtaWRpTG9va3VwOiBtaWRpVGFibGUsXHJcbiAgICAgICB9O1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogVHVuaW5nIGNvbXBvbmVudCB1c2VkIGJ5IEluc3RydW1lbnQgY2xhc3M8YnI+XHJcbiAgICAqIGNvbnRhaW5lcyB0aGUgYTQgdHVuaW5nIC0gZGVmYXVsdCBpcyA0NDBIejxicj5cclxuICAgICogYnVpbGRzIGxvb2t1cCB0YWJsZXMgZm9yIG1pZGkga2V5IGFuZCBmcmVxdWVuY3k8YnI+XHJcbiAgICAqIGJhc2VkIG9uIHRoZSB0dW5pbmdcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjbGFzcyBUdW5pbmcge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBDcmVhdGVzIHRoZSBvYmplY3QgYW5kIGJ1aWxkcyB0aGUgbG9va3VwIHRhYmxlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IoYTRGcmVxID0gNDQwKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYTQgPSBhNEZyZXE7XHJcbiAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlcygpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBUdW5pbmcodGhpcy5fYTQpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2E0ID09PSBvdGhlci5fYTQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGE0IFR1bmluZ1xyXG4gICAgICAgICovXHJcbiAgICAgICBfYTQgPSA0NDA7XHJcbiAgICAgICBnZXQgYTQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2E0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZXR0aW5nIHRoZSB0dW5pbmcgd2lsbCByZWJ1aWxkIHRoZSBsb29rdXAgdGFibGVzXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBhNCh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX2E0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlcygpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBsb29rdXAgdGFibGUgZm9yIG1pZGkga2V5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9taWRpS2V5VGFibGUgPSB7fTtcclxuICAgICAgIG1pZGlLZXlMb29rdXAob2N0YXZlLCBzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke29jdGF2ZX0tJHtzZW1pdG9uZX1gO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9taWRpS2V5VGFibGVba2V5XTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbG9va3VwIHRhYmxlIGZvciBmcmVxdWVuY3lcclxuICAgICAgICAqL1xyXG4gICAgICAgX2ZyZXFUYWJsZSA9IHt9O1xyXG4gICAgICAgZnJlcUxvb2t1cChvY3RhdmUsIHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7b2N0YXZlfS0ke3NlbWl0b25lfWA7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZXFUYWJsZVtrZXldO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBCdWlsZHMgdGhlIGxvb2t1cCB0YWJsZXMgZm9yIG1pZGkga2V5IGFuZCBmcmVxdWVuY3lcclxuICAgICAgICAqL1xyXG4gICAgICAgYnVpbGRUYWJsZXMoKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGFibGVzID0gY3JlYXRlVGFibGVzKHRoaXMuX2E0KTtcclxuICAgICAgICAgICB0aGlzLl9taWRpS2V5VGFibGUgPSB0YWJsZXMubWlkaUxvb2t1cDtcclxuICAgICAgICAgICB0aGlzLl9mcmVxVGFibGUgPSB0YWJsZXMuZnJlcUxvb2t1cDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgdHVuaW5nIGFzIGEgc3RyaW5nXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIHJldHVybiBgVHVuaW5nKCR7dGhpcy5fYTR9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIEluc3RydW1lbnQgYXJlIHVzZWQgdG8gZW5jYXBzdWxhdGUgdGhlIHR1bmluZyBhbmQgcmV0cmlldmluZyBvZiBtaWRpIGtleXNcclxuICAgICogYW5kIGZyZXF1ZW5jaWVzIGZvciBub3Rlc1xyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IEluc3RydW1lbnQgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKi9cclxuICAgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgICAgICB0dW5pbmc7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSB0dW5pbmcgQTQgZnJlcXVlbmN5IC0gZGVmYXVsdHMgdG8gNDQwXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7IC8vIGRlZmF1bHQgNDQwIHR1bmluZ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKGE0RnJlcSA9IDQ0MCkge1xyXG4gICAgICAgICAgIHRoaXMudHVuaW5nID0gbmV3IFR1bmluZyhhNEZyZXEpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5pZDsgLy8gcmV0dXJucyBhIHVuaXF1ZSBpZFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gaW5zdHJ1bWVudC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgSW5zdHJ1bWVudCh0aGlzLnR1bmluZy5hNCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSBvdGhlciB0aGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmVcclxuICAgICAgICAqIEByZXR1cm5zICB0cnVlIGlmIHRoZSBvdGhlciBvYmplY3QgaXMgZXF1YWwgdG8gdGhpcyBvbmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBpbnN0cnVtZW50LmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5lcXVhbHMob3RoZXIudHVuaW5nKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGZyZXF1ZW5jeSBvZiB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5nZXRGcmVxdWVuY3kobmV3IE5vdGUoXCJDNFwiKSk7IC8vIHJldHVybnMgMjYxLjYyNTU2NTMwMDU5ODZcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXRGcmVxdWVuY3kobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5mcmVxTG9va3VwKG5vdGUub2N0YXZlLCBub3RlLnNlbWl0b25lKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIG1pZGkga2V5IG9mIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmdldE1pZGlLZXkobmV3IE5vdGUoXCJDNFwiKSk7IC8vIHJldHVybnMgNjBcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXRNaWRpS2V5KG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcubWlkaUtleUxvb2t1cChub3RlLm9jdGF2ZSwgbm90ZS5zZW1pdG9uZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSB0dW5pbmcgYXMgYSBzdHJpbmdcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQudG9TdHJpbmcoKSk7IC8vIHJldHVybnMgXCJJbnN0cnVtZW50IFR1bmluZyg0NDApXCJcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICByZXR1cm4gYEluc3RydW1lbnQgVHVuaW5nKCR7dGhpcy50dW5pbmcuYTR9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgY29uc3QgREVGQVVMVF9TQ0FMRV9URU1QTEFURSA9IFswLCAyLCAyLCAxLCAyLCAyLCAyXTsgLy8gbWFqb3JcclxuICAgT2JqZWN0LmZyZWV6ZShERUZBVUxUX1NDQUxFX1RFTVBMQVRFKTtcblxuICAgLyoqXHJcbiAgICAqIE1hcHMgcHJlZGVmaW5lZCBzY2FsZXMgdG8gdGhlaXIgbmFtZXMuXHJcbiAgICAqL1xyXG4gICBjb25zdCBTY2FsZVRlbXBsYXRlcyA9IHtcclxuICAgICAgIHdob2xlVG9uZTogWzAsIDIsIDIsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgLy8gbWFqb3JcclxuICAgICAgIG1ham9yOiBbMCwgMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICBtYWpvcjdzNHM1OiBbMCwgMiwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBtb2Rlc1xyXG4gICAgICAgLy8gaW9uaWFuOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtYWpvclxyXG4gICAgICAgLy8gYWVvbGlhbjogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWlub3JcclxuICAgICAgIGRvcmlhbjogWzAsIDIsIDEsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgcGhyeWdpYW46IFswLCAxLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIGx5ZGlhbjogWzAsIDIsIDIsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgbHlkaWFuRG9taW5hbnQ6IFswLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIC8vIGFjb3VzdGljOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBseWRpYW5Eb21pbmFudFxyXG4gICAgICAgbWl4b2x5ZGlhbjogWzAsIDIsIDIsIDEsIDIsIDIsIDFdLFxyXG4gICAgICAgbWl4b2x5ZGlhbkZsYXQ2OiBbMCwgMiwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBsb2NyaWFuOiBbMCwgMSwgMiwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICBzdXBlckxvY3JpYW46IFswLCAxLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIC8vIG1pbm9yXHJcbiAgICAgICBtaW5vcjogWzAsIDIsIDEsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgbWlub3I3Yjk6IFswLCAxLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIG1pbm9yN2I1OiBbMCwgMiwgMSwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICAvLyBoYWxmRGltaW5pc2hlZDogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWlub3I3YjVcclxuICAgICAgIC8vIGhhcm1vbmljXHJcbiAgICAgICBoYXJtb25pY01ham9yOiBbMCwgMiwgMiwgMSwgMiwgMSwgM10sXHJcbiAgICAgICBoYXJtb25pY01pbm9yOiBbMCwgMiwgMSwgMiwgMiwgMSwgM10sXHJcbiAgICAgICBkb3VibGVIYXJtb25pYzogWzAsIDEsIDMsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gYnl6YW50aW5lOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBkb3VibGVIYXJtb25pY1xyXG4gICAgICAgLy8gbWVsb2RpY1xyXG4gICAgICAgbWVsb2RpY01pbm9yQXNjZW5kaW5nOiBbMCwgMiwgMSwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICBtZWxvZGljTWlub3JEZXNjZW5kaW5nOiBbMCwgMiwgMiwgMSwgMiwgMiwgMV0sXHJcbiAgICAgICAvLyBwZW50YXRvbmljXHJcbiAgICAgICBtYWpvclBlbnRhdG9uaWM6IFswLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIG1ham9yUGVudGF0b25pY0JsdWVzOiBbMCwgMiwgMSwgMSwgMywgMl0sXHJcbiAgICAgICBtaW5vclBlbnRhdG9uaWM6IFswLCAzLCAyLCAyLCAzXSxcclxuICAgICAgIG1pbm9yUGVudGF0b25pY0JsdWVzOiBbMCwgMywgMiwgMSwgMSwgM10sXHJcbiAgICAgICBiNVBlbnRhdG9uaWM6IFswLCAzLCAyLCAxLCA0LCAyXSxcclxuICAgICAgIG1pbm9yNlBlbnRhdG9uaWM6IFswLCAzLCAyLCAyLCAyLCAzXSxcclxuICAgICAgIC8vIGVuaWdtYXRpY1xyXG4gICAgICAgZW5pZ21hdGljTWFqb3I6IFswLCAxLCAzLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIGVuaWdtYXRpY01pbm9yOiBbMCwgMSwgMiwgMywgMSwgMywgMV0sXHJcbiAgICAgICAvLyA4VG9uZVxyXG4gICAgICAgZGltOFRvbmU6IFswLCAyLCAxLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGRvbThUb25lOiBbMCwgMSwgMiwgMSwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICAvLyBuZWFwb2xpdGFuXHJcbiAgICAgICBuZWFwb2xpdGFuTWFqb3I6IFswLCAxLCAyLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIG5lYXBvbGl0YW5NaW5vcjogWzAsIDEsIDIsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gaHVuZ2FyaWFuXHJcbiAgICAgICBodW5nYXJpYW5NYWpvcjogWzAsIDMsIDEsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgaHVuZ2FyaWFuTWlub3I6IFswLCAyLCAxLCAzLCAxLCAxLCAzXSxcclxuICAgICAgIGh1bmdhcmlhbkd5cHN5OiBbMCwgMSwgMywgMSwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBzcGFuaXNoXHJcbiAgICAgICBzcGFuaXNoOiBbMCwgMSwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICBzcGFuaXNoOFRvbmU6IFswLCAxLCAyLCAxLCAxLCAxLCAyLCAyXSxcclxuICAgICAgIC8vIGpld2lzaDogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgc3BhbmlzaDhUb25lXHJcbiAgICAgICBzcGFuaXNoR3lwc3k6IFswLCAxLCAzLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIGF1ZyBkb21cclxuICAgICAgIGF1Z21lbnRlZDogWzAsIDMsIDEsIDMsIDEsIDMsIDFdLFxyXG4gICAgICAgZG9taW5hbnRTdXNwZW5kZWQ6IFswLCAyLCAzLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIGJlYm9wXHJcbiAgICAgICBiZWJvcE1ham9yOiBbMCwgMiwgMiwgMSwgMiwgMSwgMSwgMl0sXHJcbiAgICAgICBiZWJvcERvbWluYW50OiBbMCwgMiwgMiwgMSwgMiwgMiwgMSwgMV0sXHJcbiAgICAgICBteXN0aWM6IFswLCAyLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIG92ZXJ0b25lOiBbMCwgMiwgMiwgMiwgMSwgMSwgMl0sXHJcbiAgICAgICBsZWFkaW5nVG9uZTogWzAsIDIsIDIsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgLy8gamFwYW5lc2VcclxuICAgICAgIGhpcm9qb3NoaTogWzAsIDIsIDEsIDQsIDFdLFxyXG4gICAgICAgamFwYW5lc2VBOiBbMCwgMSwgNCwgMSwgM10sXHJcbiAgICAgICBqYXBhbmVzZUI6IFswLCAyLCAzLCAxLCAzXSxcclxuICAgICAgIC8vIGN1bHR1cmVzXHJcbiAgICAgICBvcmllbnRhbDogWzAsIDEsIDMsIDEsIDEsIDMsIDFdLFxyXG4gICAgICAgcGVyc2lhbjogWzAsIDEsIDQsIDEsIDIsIDNdLFxyXG4gICAgICAgYXJhYmlhbjogWzAsIDIsIDIsIDEsIDEsIDIsIDJdLFxyXG4gICAgICAgYmFsaW5lc2U6IFswLCAxLCAyLCA0LCAxXSxcclxuICAgICAgIGt1bW9pOiBbMCwgMiwgMSwgNCwgMiwgMl0sXHJcbiAgICAgICBwZWxvZzogWzAsIDEsIDIsIDMsIDEsIDFdLFxyXG4gICAgICAgYWxnZXJpYW46IFswLCAyLCAxLCAyLCAxLCAxLCAxLCAzXSxcclxuICAgICAgIGNoaW5lc2U6IFswLCA0LCAyLCAxLCA0XSxcclxuICAgICAgIG1vbmdvbGlhbjogWzAsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgZWd5cHRpYW46IFswLCAyLCAzLCAyLCAzXSxcclxuICAgICAgIHJvbWFpbmlhbjogWzAsIDIsIDEsIDMsIDEsIDIsIDFdLFxyXG4gICAgICAgaGluZHU6IFswLCAyLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGluc2VuOiBbMCwgMSwgNCwgMiwgM10sXHJcbiAgICAgICBpd2F0bzogWzAsIDEsIDQsIDEsIDRdLFxyXG4gICAgICAgc2NvdHRpc2g6IFswLCAyLCAzLCAyLCAyXSxcclxuICAgICAgIHlvOiBbMCwgMywgMiwgMiwgM10sXHJcbiAgICAgICBpc3RyaWFuOiBbMCwgMSwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICB1a3JhbmlhbkRvcmlhbjogWzAsIDIsIDEsIDMsIDEsIDIsIDFdLFxyXG4gICAgICAgcGV0cnVzaGthOiBbMCwgMSwgMywgMiwgMSwgM10sXHJcbiAgICAgICBhaGF2YXJhYmE6IFswLCAxLCAzLCAxLCAyLCAxLCAyXSxcclxuICAgfTtcclxuICAgLy8gZHVwbGljYXRlcyB3aXRoIGFsaWFzZXNcclxuICAgU2NhbGVUZW1wbGF0ZXMuaGFsZkRpbWluaXNoZWQgPSBTY2FsZVRlbXBsYXRlcy5taW5vcjdiNTtcclxuICAgU2NhbGVUZW1wbGF0ZXMuamV3aXNoID0gU2NhbGVUZW1wbGF0ZXMuc3BhbmlzaDhUb25lO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5ieXphbnRpbmUgPSBTY2FsZVRlbXBsYXRlcy5kb3VibGVIYXJtb25pYztcclxuICAgU2NhbGVUZW1wbGF0ZXMuYWNvdXN0aWMgPSBTY2FsZVRlbXBsYXRlcy5seWRpYW5Eb21pbmFudDtcclxuICAgU2NhbGVUZW1wbGF0ZXMuYWVvbGlhbiA9IFNjYWxlVGVtcGxhdGVzLm1pbm9yO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5pb25pYW4gPSBTY2FsZVRlbXBsYXRlcy5tYWpvcjtcclxuICAgT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpLmZvckVhY2goKGVsZW1lbnQpID0+IE9iamVjdC5mcmVlemUoU2NhbGVUZW1wbGF0ZXNbZWxlbWVudF0pKTtcblxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICBjb25zdCBuYW1lUmVnZXgkMSA9IC8oW0EtR10pKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXgkMSA9IC8oI3xzfGIpKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4JDEgPSAvKFswLTldKykoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3Qgc2NhbGVOYW1lUmVnZXggPSAvKFxcKFthLXpBLVpdezIsfVxcKSkvZztcclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIHBhcnNlIGEgbm90ZSBmcm9tIGEgc3RyaW5nXHJcbiAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzdHJpbmcgdG8gcGFyc2VcclxuICAgICogQHBhcmFtIHN1cHJlc3NXYXJuaW5nIC0gc3VwcmVzcyB0aGUgd2FybmluZyBmb3IgaW5lZmZlY2llbmN5IGlmIHRydWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZVNjYWxlID0gKHNjYWxlLCBzdXByZXNzV2FybmluZyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHNjYWxlTG9va3VwKHNjYWxlKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgc2NhbGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke3NjYWxlfS4gR2V0IGEgcGVyZm9ybWFuYyBpbmNyZWFzZSBieSB1c2luZyBhIHZhbGlkIGZvcm1hdGApO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgc2NhbGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke3NjYWxlfS4gR2V0IGEgcGVyZm9ybWFuYyBpbmNyZWFzZSBieSB1c2luZyBhIHZhbGlkIGZvcm1hdGApO1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBsZXQgc2NhbGVOYW1lID0gXCJcIjtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IHNjYWxlLm1hdGNoKG5hbWVSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG1vZGlmaWVyTWF0Y2ggPSBzY2FsZS5tYXRjaChtb2RpZmllclJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBzY2FsZS5tYXRjaChvY3RhdmVSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZU1hdGNoID0gc2NhbGUubWF0Y2goc2NhbGVOYW1lUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKHNjYWxlTmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc05hbWUgPSBzY2FsZU5hbWVNYXRjaC5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNOYW1lKTtcclxuICAgICAgICAgICBzY2FsZU5hbWUgPSBzTmFtZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICBsZXQgdGVtcGxhdGVJbmRleCA9IDE7IC8vIGRlZmF1bHQgbWFqb3Igc2NhbGVcclxuICAgICAgICAgICBpZiAoc2NhbGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlSW5kZXggPSBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcykuZmluZEluZGV4KCh0ZW1wbGF0ZSkgPT4gdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgICAgICAgICAuaW5jbHVkZXMoc2NhbGVOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFwofFxcKS9nLCBcIlwiKSkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcylbdGVtcGxhdGVJbmRleF0pO1xyXG4gICAgICAgICAgIGlmICh0ZW1wbGF0ZUluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVOS05PV04gVEVNUExBVEVcIiwgc2NhbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCB0ZW1wbGF0ZSBmb3Igc2NhbGUgJHtzY2FsZU5hbWV9YCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXNbT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpW3RlbXBsYXRlSW5kZXhdXTtcclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICBrZXk6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgU2NhbGU6ICR7c2NhbGV9YCk7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGUkMiA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHNjYWxlVGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBjb25zdCB0ZW1wbGF0ZXMgPSBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIHRlbXBsYXRlcykge1xyXG4gICAgICAgICAgIGZvciAoY29uc3Qgbm90ZUxhYmVsIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgIC8vZXggQShtaW5vcilcclxuICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtgJHtub3RlTGFiZWx9KCR7dGVtcGxhdGV9KWBdID0gcGFyc2VTY2FsZShub3RlTGFiZWwsIHRydWUpOyAvLyAnQycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCBtb2Qgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bW9kfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gZXggQSMobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDIycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8IE9DVEFWRV9NQVg7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7aU9jdGF2ZX0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgIC8vIGV4IEE0KG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bW9kfSR7aU9jdGF2ZX0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAvLyBleCBBIzQobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQyM0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHNjYWxlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIHRoZSBsb29rdXAgdGFibGUgYXMgc29vbiBhcyB0aGUgbW9kdWxlIGlzIGxvYWRlZFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGxldCBfc2NhbGVMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgc2NhbGVMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfc2NhbGVMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9zY2FsZUxvb2t1cCA9IHRhYmxlIGFzIHsgW2tleTogc3RyaW5nXTogU2NhbGVJbml0aWFsaXplciB9O1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfc2NhbGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfc2NhbGVMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfc2NhbGVMb29rdXA7XHJcbiAgICAgICBfc2NhbGVMb29rdXAgPSBjcmVhdGVUYWJsZSQyKCk7XHJcbiAgICAgICAvLyBPYmplY3QuZnJlZXplKF9zY2FsZUxvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIlNjYWxlIFRhYmxlIEJ1aWx0XCIpO1xyXG4gICAgICAgcmV0dXJuIF9zY2FsZUxvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIHNoaWZ0cyBhbiBhcnJheSBieSBhIGdpdmVuIGRpc3RhbmNlXHJcbiAgICAqIEBwYXJhbSBhcnIgdGhlIGFycmF5IHRvIHNoaWZ0XHJcbiAgICAqIEBwYXJhbSBkaXN0YW5jZSB0aGUgZGlzdGFuY2UgdG8gc2hpZnRcclxuICAgICogQHJldHVybnMgdGhlIHNoaWZ0ZWQgYXJyYXlcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzaGlmdCA9IChhcnIsIGRpc3QgPSAxKSA9PiB7XHJcbiAgICAgICBhcnIgPSBbLi4uYXJyXTsgLy8gY29weVxyXG4gICAgICAgaWYgKGRpc3QgPiBhcnIubGVuZ3RoIHx8IGRpc3QgPCAwIC0gYXJyLmxlbmd0aClcclxuICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaGlmdDogZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIGFycmF5IGxlbmd0aFwiKTtcclxuICAgICAgIGlmIChkaXN0ID4gMCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnIuc3BsaWNlKGFyci5sZW5ndGggLSBkaXN0LCBJbmZpbml0eSk7XHJcbiAgICAgICAgICAgYXJyLnVuc2hpZnQoLi4udGVtcCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoZGlzdCA8IDApIHtcclxuICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyLnNwbGljZSgwLCBkaXN0KTtcclxuICAgICAgICAgICBhcnIucHVzaCguLi50ZW1wKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBhcnI7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiAgU2ltcGxlIHV0aWwgdG8gbGF6eSBjbG9uZSBhbiBvYmplY3RcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjbG9uZSA9IChvYmopID0+IHtcclxuICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogc2ltcGxlIHV0aWwgdG8gbGF6eSBjaGVjayBlcXVhbGl0eSBvZiBvYmplY3RzIGFuZCBhcnJheXNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBpc0VxdWFsID0gKGEsIGIpID0+IHtcclxuICAgICAgIGNvbnN0IHN0cmluZ0EgPSBKU09OLnN0cmluZ2lmeShhKTtcclxuICAgICAgIGNvbnN0IHN0cmluZ0IgPSBKU09OLnN0cmluZ2lmeShiKTtcclxuICAgICAgIHJldHVybiBzdHJpbmdBID09PSBzdHJpbmdCO1xyXG4gICB9O1xuXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZVN0cmluZ0xvb2t1cC5qc29uXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBXaWxsIGxvb2t1cCBhIHNjYWxlIG5hbWUgYmFzZWQgb24gdGhlIHRlbXBsYXRlLlxyXG4gICAgKiBAcGFyYW0gdGVtcGxhdGUgLSB0aGUgdGVtcGxhdGUgdG8gbG9va3VwXHJcbiAgICAqIEBwYXJhbSBzdXByZXNzV2FybmluZyAtIHN1cHJlc3MgdGhlIHdhcm5pbmcgZm9yIGluZWZmZWNpZW5jeSBpZiB0cnVlXHJcbiAgICAqIEByZXR1cm5zIHRoZSBzY2FsZSBuYW1lXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2NhbGVOYW1lTG9va3VwID0gKHRlbXBsYXRlLCBzdXByZXNzV2FybmluZyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5hbWVUYWJsZShKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZXMgPSBbXTtcclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgIGlmIChpc0VxdWFsKHZhbHVlc1tpXSwgdGVtcGxhdGUpKSB7XHJcbiAgICAgICAgICAgICAgIHNjYWxlTmFtZXMucHVzaChrZXlzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5c1tpXS5zbGljZSgxKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lc1N0cmluZyA9IHNjYWxlTmFtZXMuam9pbihcIiBBS0EgXCIpO1xyXG4gICAgICAgcmV0dXJuIHNjYWxlTmFtZXNTdHJpbmc7XHJcbiAgIH07XHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDEgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiBPYmplY3QudmFsdWVzKFNjYWxlVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgIHRhYmxlW0pTT04uc3RyaW5naWZ5KHRlbXBsYXRlKV0gPSBzY2FsZU5hbWVMb29rdXAodGVtcGxhdGUsIHRydWUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBsZXQgX25hbWVUYWJsZSA9IHt9O1xyXG4gICBjb25zdCBuYW1lVGFibGUgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlTmFtZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25hbWVUYWJsZVtrZXldO1xyXG4gICB9O1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25hbWVUYWJsZSA9IHRhYmxlO1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfbmFtZVRhYmxlID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZFNjYWxlTmFtZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9uYW1lVGFibGUpLmxlbmd0aCA+IDApIHJldHVybiBfbmFtZVRhYmxlO1xyXG4gICAgICAgX25hbWVUYWJsZSA9IGNyZWF0ZVRhYmxlJDEoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25hbWVUYWJsZSk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIlNjYWxlIG5hbWUgdGFibGUgYnVpbHRcIik7XHJcbiAgICAgICByZXR1cm4gX25hbWVUYWJsZTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNjYWxlcyBjb25zaXN0IG9mIGEga2V5KHRvbmljIG9yIHJvb3QpIGFuZCBhIHRlbXBsYXRlKGFycmF5IG9mIGludGVnZXJzKSB0aGF0XHJcbiAgICAqIDxicj4gcmVwcmVzZW50cyB0aGUgaW50ZXJ2YWwgb2Ygc3RlcHMgYmV0d2VlbiBlYWNoIG5vdGUuXHJcbiAgICAqIDxicj48YnI+U2NhbGUgaW50ZXJ2YWxzIGFyZSByZXByZXNlbnRlZCBieSBhbiBpbnRlZ2VyXHJcbiAgICAqIDxicj50aGF0IGlzIHRoZSBudW1iZXIgb2Ygc2VtaXRvbmVzIGJldHdlZW4gZWFjaCBub3RlLlxyXG4gICAgKiA8YnI+MCA9IGtleSAtIHdpbGwgYWx3YXlzIHJlcHJlc2VudCB0aGUgdG9uaWNcclxuICAgICogPGJyPjEgPSBoYWxmIHN0ZXBcclxuICAgICogPGJyPjIgPSB3aG9sZSBzdGVwXHJcbiAgICAqIDxicj4zID0gb25lIGFuZCBvbmUgaGFsZiBzdGVwc1xyXG4gICAgKiA8YnI+NCA9IGRvdWJsZSBzdGVwXHJcbiAgICAqIDxicj5bMCwgMiwgMiwgMSwgMiwgMiwgMl0gcmVwcmVzZW50cyB0aGUgbWFqb3Igc2NhbGVcclxuICAgICogPGJyPjxicj4gU2NhbGUgdGVtcGxhdGVzIG1heSBoYXZlIGFyYml0cmF5IGxlbmd0aHNcclxuICAgICpcclxuICAgICogVGhlIGZvbGxvd2luZyBQcmUtZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTpcclxuICAgICogPHRhYmxlPlxyXG4gICAgKiA8dHI+XHJcbiAgICAqIDx0ZD5tYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5pb25pYW48L3RkPlxyXG4gICAgKiA8dGQ+ZG9yaWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5waHJ5Z2lhbjwvdGQ+XHJcbiAgICAqIDx0ZD5seWRpYW48L3RkPlxyXG4gICAgKiA8dGQ+bWl4b2x5ZGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5hZW9saWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5sb2NyaWFuPC90ZD5cclxuICAgICogPHRkPmVuaWdtYXRpY01ham9yPC90ZD5cclxuICAgICogPHRkPmVuaWdtYXRpY01pbm9yPC90ZD5cclxuICAgICogPHRkPm1pbm9yN2I1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWpvcjdzNHM1PC90ZD5cclxuICAgICogPHRkPmhhcm1vbmljTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+aGFybW9uaWNNaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5kb3VibGVIYXJtb25pYzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWVsb2RpY01pbm9yQXNjZW5kaW5nPC90ZD5cclxuICAgICogPHRkPm1lbG9kaWNNaW5vckRlc2NlbmRpbmc8L3RkPlxyXG4gICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1ham9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgKiA8dGQ+YjVQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1pbm9yNlBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRpbThUb25lPC90ZD5cclxuICAgICogPHRkPmRvbThUb25lPC90ZD5cclxuICAgICogPHRkPm5lb3BvbGl0YW5NYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5uZW9wb2xpdGFuTWlub3I8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmh1bmdhcmlhbk1ham9yPC90ZD5cclxuICAgICogPHRkPmh1bmdhcmlhbk1pbm9yPC90ZD5cclxuICAgICogPHRkPmh1bmdhcmlhbkd5cHN5PC90ZD5cclxuICAgICogPHRkPnNwYW5pc2g8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnNwYW5pc2g4VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5zcGFuaXNoR3lwc3k8L3RkPlxyXG4gICAgKiA8dGQ+YXVnbWVudGVkPC90ZD5cclxuICAgICogPHRkPmRvbWluYW50U3VzcGVuZGVkPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5iZWJvcE1ham9yPC90ZD5cclxuICAgICogPHRkPmJlYm9wRG9taW5hbnQ8L3RkPlxyXG4gICAgKiA8dGQ+bXlzdGljPC90ZD5cclxuICAgICogPHRkPm92ZXJ0b25lPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5sZWFkaW5nVG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5oaXJvam9zaGk8L3RkPlxyXG4gICAgKiA8dGQ+amFwYW5lc2VBPC90ZD5cclxuICAgICogPHRkPmphcGFuZXNlQjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+b3JpZW50YWw8L3RkPlxyXG4gICAgKiA8dGQ+YXJhYmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5wZXJzaWFuPC90ZD5cclxuICAgICogPHRkPmJhbGluZXNlPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5rdW1vaTwvdGQ+XHJcbiAgICAqIDx0ZD5wZWxvZzwvdGQ+XHJcbiAgICAqIDx0ZD5hbGdlcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5jaGluZXNlPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tb25nb2xpYW48L3RkPlxyXG4gICAgKiA8dGQ+ZWd5cHRpYW48L3RkPlxyXG4gICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgKiA8dGQ+cm9tYW5pYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICogPHRkPmluc2VuPC90ZD5cclxuICAgICogPHRkPml3YXRvPC90ZD5cclxuICAgICogPHRkPnNjb3R0aXNoPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD55bzwvdGQ+XHJcbiAgICAqIDx0ZD5pc3RyaWFuPC90ZD5cclxuICAgICogPHRkPnVrcmFuaWFuRG9yaWFuPC90ZD5cclxuICAgICogPHRkPnBldHJ1c2hrYTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YWhhdmFyYWJhPC90ZD5cclxuICAgICogPHRkPmhhbGZEaW1pbmlzaGVkPC90ZD5cclxuICAgICogPHRkPmpld2lzaDwvdGQ+XHJcbiAgICAqIDx0ZD5ieXphbnRpbmU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmFjb3VzdGljPC90ZD5cclxuICAgICogPC90YWJsZT5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQge1NjYWxlfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICogaW1wb3J0IHtTY2FsZVRlbXBsYXRlc30gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAqIGltcG9ydCB7U2NhbGVJbml0aWFsaXplcn0gZnJvbSAnbXVzaWN0aGVvcnlqcyc7IC8vIFR5cGVTY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBTY2FsZSB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQge1NjYWxlLCBTY2FsZVRlbXBsYXRlc30gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIGRlZmF1bHQgdGVtcGxhdGUsIGtleSAwZiAwKEMpIGFuZCBhbiBvY3RhdmUgb2YgNFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgdGVtcGxhdGUgWzAsIDIsIDIsIDEsIDIsIDIsIDJdIGFuZCBrZXkgNChFKSBhbmQgb2N0YXZlIDVcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IG5ldyBTY2FsZSh7a2V5OiA0LCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5tYWpvcn0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IG5vdGUtbmFtZVthbHRlcmF0aW9uXVtvY3RhdmVdWyhzY2FsZS1uYW1lKV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSBtaW5vciB0ZW1wbGF0ZSwga2V5IEdiIGFuZCBhbiBvY3RhdmUgb2YgN1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUzID0gbmV3IFNjYWxlKCdHYjcobWlub3IpJyk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IERFRkFVTFRfU0NBTEVfVEVNUExBVEU7XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICB2YWx1ZXMgPSBwYXJzZVNjYWxlKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBbLi4uKHZhbHVlcz8udGVtcGxhdGUgPz8gREVGQVVMVF9TQ0FMRV9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IHZhbHVlcy5rZXkgfHwgREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlIHx8IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRoYXQgb2N0YXZlIGlzIHNldCBmaXJzdCBzbyB0aGF0XHJcbiAgICAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIHNlbWl0b25lIGNhbiBjaGFuZ2UgdGhlIG9jdGF2ZVxyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gWy4uLih2YWx1ZXM/LnRlbXBsYXRlID8/IERFRkFVTFRfU0NBTEVfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSB2YWx1ZXMua2V5IHx8IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSB8fCBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICB1bmlxdWUgaWQgZm9yIHRoaXMgc2NhbGUoYXV0byBnZW5lcmF0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmlkKTsgLy8gZGhsa2o1ajMyMlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHNjYWxlIGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBzY2FsZVxyXG4gICAgICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHNjYWxlIHRvIGNvbXBhcmUgdG9cclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHNjYWxlcyBhcmUgZXF1YWxcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5lcXVhbHMoc2NhbGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMoc2NhbGUpIHtcclxuICAgICAgICAgICByZXR1cm4gKHRoaXMuX2tleSA9PT0gc2NhbGUuX2tleSAmJlxyXG4gICAgICAgICAgICAgICB0aGlzLl9vY3RhdmUgPT09IHNjYWxlLl9vY3RhdmUgJiZcclxuICAgICAgICAgICAgICAgaXNFcXVhbCh0aGlzLl90ZW1wbGF0ZSwgc2NhbGUuX3RlbXBsYXRlKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBjb3B5IG9mIHRoaXMgU2NhbGVcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIFNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IHNjYWxlLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmVxdWFscyhzY2FsZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMua2V5LFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogY2xvbmUodGhpcy50ZW1wbGF0ZSksXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAhPT0gMClcclxuICAgICAgICAgICAgICAgc2NhbGUuc2hpZnQodGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGtleVxyXG4gICAgICAgICovXHJcbiAgICAgICBfa2V5ID0gMDtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5rZXkpOyAvLyAwKHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBrZXkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2V0dGluZyB0aGUgc2VtaXRvbmUgdG8gYSB2YWx1ZSBvdXRzaWRlIG9mIHRoZSByYW5nZSBbMCwgMTFdKHNlbWl0b25lKSB3aWxsPGJyLz5cclxuICAgICAgICAqIHdyYXAgdGhlIHNlbWl0b25lIHRvIHRoZSByYW5nZSBbMCwgMTFdIGFuZCBjaGFuZ2UgdGhlIG9jdGF2ZSBkZXBlbmRpbmc8YnIvPlxyXG4gICAgICAgICogb24gaG93IG1hbnkgdGltZXMgdGhlIHNlbWl0b25lIGhhcyBiZWVuIHdyYXBwZWQuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLmtleSA9IDQ7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5rZXkpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGtleSh2YWx1ZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHZhbHVlLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB0aGlzLm9jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgdGhpcy5fa2V5ID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm9jdGF2ZSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUub2N0YXZlID0gNTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm9jdGF2ZSk7IC8vIDVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAodmFsdWUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB0ZW1wbGF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50ZW1wbGF0ZSk7IC8vIFswLCAyLCAyLCAxLCAyLCAyLCAyXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gY2xvbmUodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgZm9sbG93aW5nIFByZS1kZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOlxyXG4gICAgICAgICogPHRhYmxlPlxyXG4gICAgICAgICogPHRyPlxyXG4gICAgICAgICogPHRkPm1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aW9uaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb3JpYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+cGhyeWdpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmx5ZGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWl4b2x5ZGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YWVvbGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5sb2NyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5lbmlnbWF0aWNNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZW5pZ21hdGljTWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yN2I1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1ham9yN3M0czU8L3RkPlxyXG4gICAgICAgICogPHRkPmhhcm1vbmljTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmhhcm1vbmljTWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmRvdWJsZUhhcm1vbmljPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1lbG9kaWNNaW5vckFzY2VuZGluZzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWVsb2RpY01pbm9yRGVzY2VuZGluZzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICAgICAqIDx0ZD5iNVBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yNlBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZGltOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbThUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5uZW9wb2xpdGFuTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPm5lb3BvbGl0YW5NaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5NYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuTWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbkd5cHN5PC90ZD5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2g4VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaEd5cHN5PC90ZD5cclxuICAgICAgICAqIDx0ZD5hdWdtZW50ZWQ8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbWluYW50U3VzcGVuZGVkPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmJlYm9wTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmJlYm9wRG9taW5hbnQ8L3RkPlxyXG4gICAgICAgICogPHRkPm15c3RpYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+b3ZlcnRvbmU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bGVhZGluZ1RvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPmhpcm9qb3NoaTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amFwYW5lc2VBPC90ZD5cclxuICAgICAgICAqIDx0ZD5qYXBhbmVzZUI8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+b3JpZW50YWw8L3RkPlxyXG4gICAgICAgICogPHRkPmFyYWJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnBlcnNpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmJhbGluZXNlPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmt1bW9pPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZWxvZzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YWxnZXJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmNoaW5lc2U8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bW9uZ29saWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5lZ3lwdGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgICAgICogPHRkPnJvbWFuaWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICAgICAqIDx0ZD5pbnNlbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aXdhdG88L3RkPlxyXG4gICAgICAgICogPHRkPnNjb3R0aXNoPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnlvPC90ZD5cclxuICAgICAgICAqIDx0ZD5pc3RyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD51a3JhbmlhbkRvcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGV0cnVzaGthPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmFoYXZhcmFiYTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFsZkRpbWluaXNoZWQ8L3RkPlxyXG4gICAgICAgICogPHRkPmpld2lzaDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+Ynl6YW50aW5lPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmFjb3VzdGljPC90ZD5cclxuICAgICAgICAqIDwvdGFibGU+XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLnRlbXBsYXRlID0gWzAsIDIsIDIsIDEsIDIsIDIsIDJdO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudGVtcGxhdGUpOyAvLyBbMCwgMiwgMiwgMSwgMiwgMiwgMl1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IGNsb25lKHZhbHVlKTtcclxuICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBub3Rlc1xyXG4gICAgICAgICogbm90ZXMgYXJlIGdlbmVyYXRlZCBhbmQgY2FjaGVkIGFzIG5lZWRlZFxyXG4gICAgICAgICovXHJcbiAgICAgICBfbm90ZXMgPSBbXTtcclxuICAgICAgIF9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogd2lsbCBnZW5lcmF0ZSB0aGUgbm90ZXMgaWYgbmVlZGVkIG9yIHJldHVybiB0aGUgY2FjaGVkIG5vdGVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm5vdGVzKTsgLy8gTGlzdCBvZiBub3Rlc1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBub3RlcygpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fbm90ZXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGdlbmVyYXRlIG5vdGVzKGludGVybmFsKVxyXG4gICAgICAgICogZ2VuZXJhdGVzIHRoZSBub3RlcyBmb3IgdGhpcyBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBnZW5lcmF0ZU5vdGVzKCkge1xyXG4gICAgICAgICAgIC8vIHVzZSB0aGUgdGVtcGxhdGUgdW5zaGlmdGVkIGZvciBzaW1wbGljaXR5XHJcbiAgICAgICAgICAgY29uc3QgdW5zaGlmdGVkVGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgLXRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgLy8gaWYgYWxsb3dpbmcgdGhpcyB0byBjaGFuZ2UgdGhlIG9jdGF2ZSBpcyB1bmRlc2lyYWJsZVxyXG4gICAgICAgICAgIC8vIHRoZW4gbWF5IG5lZWQgdG8gcHJlIHdyYXAgdGhlIHRvbmUgYW5kIHVzZVxyXG4gICAgICAgICAgIC8vIHRoZSBmaW5hbCB2YWx1ZVxyXG4gICAgICAgICAgIGNvbnN0IG5vdGVzID0gW107XHJcbiAgICAgICAgICAgbGV0IGFjY3VtdWxhdG9yID0gdGhpcy5rZXk7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB1bnNoaWZ0ZWRUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0b25lID0gaW50ZXJ2YWwgPT09IDBcclxuICAgICAgICAgICAgICAgICAgID8gKGFjY3VtdWxhdG9yID0gdGhpcy5rZXkpXHJcbiAgICAgICAgICAgICAgICAgICA6IChhY2N1bXVsYXRvciArPSBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogdG9uZSxcclxuICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICBub3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyBzaGlmdCBub3RlcyBiYWNrIHRvIG9yaWdpbmFsIHBvc2l0aW9uXHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA+IDApIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5vdGVzLnNwbGljZShub3Rlcy5sZW5ndGggLSAodGhpcy5fc2hpZnRlZEludGVydmFsICsgMSksIEluZmluaXR5KTtcclxuICAgICAgICAgICAgICAgbm90ZXMudW5zaGlmdCguLi50ZW1wKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA8IDApIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5vdGVzLnNwbGljZSgwLCB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICBub3Rlcy5wdXNoKC4uLnRlbXApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3RlcyA9IG5vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgbm90ZXMgaW4gdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcGFyYW0gcHJlZmVyU2hhcnBLZXlzIC0gaWYgdHJ1ZSB0aGVuIHNoYXJwcyB3aWxsIGJlIHByZWZlcnJlZCBvdmVyIGZsYXRzIHdoZW4gc2VtaXRvbmVzIGNvdWxkIGJlIGVpdGhlciAtIGV4OiBCYi9BI1xyXG4gICAgICAgICogQHJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBub3RlcyBpbiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubmFtZXMpOyAvLyBbJ0M0JywgJ0Q0JywgJ0U0JywgJ0Y0JywgJ0c0JywgJ0E0JywgJ0I0J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXROb3RlTmFtZXMocHJlZmVyU2hhcnBLZXkgPSB0cnVlKSB7XHJcbiAgICAgICAgICAgY29uc3QgbmFtZXMgPSBzY2FsZU5vdGVOYW1lTG9va3VwKHRoaXMsIHByZWZlclNoYXJwS2V5KTtcclxuICAgICAgICAgICByZXR1cm4gbmFtZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGRlZ3JlZVxyXG4gICAgICAgICogcmV0dXJucyBhIG5vdGUgdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBkZWdyZWVcclxuICAgICAgICAqIEBwYXJhbSBkZWdyZWUgLSB0aGUgZGVncmVlIHRvIHJldHVyblxyXG4gICAgICAgICogQHJldHVybnMgYSBub3RlIHRoYXQgcmVwcmVzZW50cyB0aGUgZ2l2ZW4gZGVncmVlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRlZ3JlZSgwKSk7IC8vIEM0KE5vdGUpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kZWdyZWUoMSkpOyAvLyBENChOb3RlKSBldGNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkZWdyZWUoZGVncmVlKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAoZGVncmVlIC0gMSAvKnplcm8gaW5kZXggKi8sIDAsIHRoaXMubm90ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMubm90ZXNbd3JhcHBlZC52YWx1ZV0uY29weSgpO1xyXG4gICAgICAgICAgIG5vdGUub2N0YXZlID0gdGhpcy5vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHJldHVybiBub3RlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZWxhdGl2ZSBtYWpvclxyXG4gICAgICAgICogcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtYWpvciBvZiB0aGlzIHNjYWxlIC0gdGFrZXMgdGhlIDNyZCBkZWdyZWUgYXMgaXQncyBrZXlcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1ham9yIG9mIHRoaXMgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucmVsYXRpdmVNYWpvcigpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICByZWxhdGl2ZU1ham9yKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG1ham9yID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1ham9yLFxyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMuZGVncmVlKDMpLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIHJldHVybiBtYWpvcjtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmVsYXRpdmUgbWlub3JcclxuICAgICAgICAqIHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWlub3Igb2YgdGhpcyBzY2FsZSAtIHRha2VzIHRoZSA2dGggZGVncmVlIGFzIGl0J3Mga2V5XHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtaW5vciBvZiB0aGlzIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnJlbGF0aXZlTWlub3IoKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcmVsYXRpdmVNaW5vcigpIHtcclxuICAgICAgICAgICBjb25zdCBtaW5vciA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5taW5vcixcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmRlZ3JlZSg2KS5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICByZXR1cm4gbWlub3I7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9zaGlmdGVkSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgX29yaWdpbmFsVGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRcclxuICAgICAgICAqIHNoaWZ0cyB0aGUgc2NhbGUgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcGFyYW0gc2hpZnQgLSB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgdG8gc2hpZnQgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSBzaGlmdGVkIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdChkZWdyZWVzID0gMSkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPT09IDApIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZSA9IGNsb25lKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgZGVncmVlcyk7XHJcbiAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsICs9IGRlZ3JlZXM7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0ZWRcclxuICAgICAgICAqIHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBwYXJhbSBkZWdyZWVzIC0gdGhlIG51bWJlciBvZiBkZWdyZWVzIHRvIHNoaWZ0IHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnRlZCgxKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnRlZChkZWdyZWVzID0gMSkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUuc2hpZnQoZGVncmVlcyk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bnNoaWZ0XHJcbiAgICAgICAgKiBzaGlmdHMgdGhlIG9yaWdpbmFsIHJvb3QgYmFjayB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhpcyBzY2FsZSBhZnRlciB1bnNoaWZ0aW5nIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudW5zaGlmdCgpKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB1bnNoaWZ0KCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgIT09IDApIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX29yaWdpbmFsVGVtcGxhdGUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vIHRoaXMuc2hpZnQodGhpcy5fc2hpZnRlZEludGVydmFsICogLTEpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlID0gW107XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5zaGlmdGVkXHJcbiAgICAgICAgKiByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHdpdGggdGhlIHRvbmljIHNoaWZ0ZWQgYmFja1xyXG4gICAgICAgICogdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHdpdGggdGhlIHRvbmljIHNoaWZ0ZWQgYmFja1xyXG4gICAgICAgICogdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudW5zaGlmdGVkKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHVuc2hpZnRlZCgpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFRlbXBsYXRlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlO1xyXG4gICAgICAgICAgIHNjYWxlLnVuc2hpZnQoKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIGFtb3VudCB0aGF0IHRoZSBzY2FsZSBoYXMgc2hpZnRlZFxyXG4gICAgICAgICogKDAgaWYgbm90IHNoaWZ0ZWQpXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgYW1vdW50IHRoYXQgdGhlIHNjYWxlIGhhcyBzaGlmdGVkXHJcbiAgICAgICAgKiAoMCBpZiBub3Qgc2hpZnRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnRlZCgpKTsgLy8gMVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0ZWRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hpZnRlZEludGVydmFsO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTY2FsZSBtb2Rlc1xyXG4gICAgICAgICovXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBJb25pYW4obWFqb3IpIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuaW9uaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlvbmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuaW9uaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIERvcmlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRvcmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkb3JpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmRvcmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBQaHJ5Z2lhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnBocnlnaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHBocnlnaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5waHJ5Z2lhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBMeWRpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5seWRpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbHlkaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5seWRpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTWl4b2x5ZGlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm1peG9seWRpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWl4b2x5ZGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubWl4b2x5ZGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBBZW9saWFuKG1pbm9yKSBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmFlb2xpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYWVvbGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuYWVvbGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBMb2NyaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubG9jcmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBsb2NyaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5sb2NyaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyBzdHJpbmcgdmVyc2lvbiBvZiB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50b1N0cmluZygpKTsgLy8gJ0MnXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgbGV0IHNjYWxlTmFtZXMgPSBzY2FsZU5hbWVMb29rdXAodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgICAgIGlmICghc2NhbGVOYW1lcylcclxuICAgICAgICAgICAgICAgc2NhbGVOYW1lcyA9IHRoaXMuZ2V0Tm90ZU5hbWVzKCkuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgIHJldHVybiBgJHtTZW1pdG9uZSQxW3RoaXMuX2tleV19JHt0aGlzLl9vY3RhdmV9KCR7c2NhbGVOYW1lc30pYDtcclxuICAgICAgIH1cclxuICAgfVxyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gbG9va3VwIHRoZSBub3RlIG5hbWUgZm9yIGEgc2NhbGUgZWZmaWNpZW50bHlcclxuICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHNjYWxlIHRvIGxvb2t1cFxyXG4gICAgKiBAcGFyYW0gcHJlZmVyU2hhcnBLZXkgLSBpZiB0cnVlLCB3aWxsIHByZWZlciBzaGFycCBrZXlzIG92ZXIgZmxhdCBrZXlzXHJcbiAgICAqIEByZXR1cm5zIHRoZSBub3RlIG5hbWVzIGZvciB0aGUgc2NhbGVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzY2FsZU5vdGVOYW1lTG9va3VwID0gKHNjYWxlLCBwcmVmZXJTaGFycEtleSA9IHRydWUpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7c2NhbGUua2V5fS0ke3NjYWxlLm9jdGF2ZX0tJHtKU09OLnN0cmluZ2lmeShzY2FsZS50ZW1wbGF0ZSl9YDtcclxuICAgICAgICAgICBjb25zdCBub3RlcyA9IG5vdGVzTG9va3VwKGtleSk7XHJcbiAgICAgICAgICAgaWYgKG5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiBub3RlcztcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlcyA9IFsuLi5zY2FsZS5ub3Rlc107XHJcbiAgICAgICBub3RlcyA9IHNoaWZ0KG5vdGVzLCAtc2NhbGUuc2hpZnRlZEludGVydmFsKCkpOyAvL3Vuc2hpZnQgYmFjayB0byBrZXkgPSAwIGluZGV4XHJcbiAgICAgICBjb25zdCBub3Rlc1BhcnRzID0gbm90ZXMubWFwKChub3RlKSA9PiBub3RlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZXMgPSBub3Rlcy5tYXAoKG5vdGUpID0+IG5vdGUub2N0YXZlKTtcclxuICAgICAgIGNvbnN0IHJlbW92YWJsZXMgPSBbXCJCI1wiLCBcIkJzXCIsIFwiQ2JcIiwgXCJFI1wiLCBcIkVzXCIsIFwiRmJcIl07XHJcbiAgICAgICBjb25zdCBub3RlTmFtZXMgPSBbXTtcclxuICAgICAgIGZvciAoY29uc3QgW2ksIG5vdGVQYXJ0c10gb2Ygbm90ZXNQYXJ0cy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAvL3JlbW92ZSBDYiBCIyBldGNcclxuICAgICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2Ygbm90ZVBhcnRzKSB7XHJcbiAgICAgICAgICAgICAgIC8vIHJlbW92ZSBhbnkgbnVtYmVycyBmcm9tIHRoZSBub3RlIG5hbWUob2N0YXZlKVxyXG4gICAgICAgICAgICAgICAvLyBwYXJ0LnJlcGxhY2UoL1xcZC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgaWYgKHJlbW92YWJsZXMuaW5jbHVkZXMocGFydCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbm90ZU5hbWVzLmluZGV4T2YocGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICBub3RlTmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAobm90ZU5hbWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChwcmVmZXJTaGFycEtleSA/IG5vdGVQYXJ0c1swXSA6IG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0pO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKG5vdGVQYXJ0cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzWzBdKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IHdob2xlTm90ZXMgPSBbXHJcbiAgICAgICAgICAgICAgIFwiQVwiLFxyXG4gICAgICAgICAgICAgICBcIkJcIixcclxuICAgICAgICAgICAgICAgXCJDXCIsXHJcbiAgICAgICAgICAgICAgIFwiRFwiLFxyXG4gICAgICAgICAgICAgICBcIkVcIixcclxuICAgICAgICAgICAgICAgXCJGXCIsXHJcbiAgICAgICAgICAgICAgIFwiR1wiLFxyXG4gICAgICAgICAgICAgICBcIkFcIixcclxuICAgICAgICAgICAgICAgXCJCXCIsXHJcbiAgICAgICAgICAgICAgIFwiQ1wiLFxyXG4gICAgICAgICAgICAgICBcIkRcIixcclxuICAgICAgICAgICAgICAgXCJFXCIsXHJcbiAgICAgICAgICAgICAgIFwiRlwiLFxyXG4gICAgICAgICAgICAgICBcIkdcIixcclxuICAgICAgICAgICBdO1xyXG4gICAgICAgICAgIGNvbnN0IGxhc3RXaG9sZU5vdGUgPSBub3RlTmFtZXNbbm90ZU5hbWVzLmxlbmd0aCAtIDFdWzBdO1xyXG4gICAgICAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHdob2xlTm90ZXMuaW5kZXhPZihsYXN0V2hvbGVOb3RlKTtcclxuICAgICAgICAgICBjb25zdCBuZXh0Tm90ZSA9IHdob2xlTm90ZXNbbGFzdEluZGV4ICsgMV07XHJcbiAgICAgICAgICAgaWYgKG5vdGVQYXJ0c1swXS5pbmNsdWRlcyhuZXh0Tm90ZSkpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgaGFzT2N0YXZlID0gbm90ZVBhcnRzWzBdLm1hdGNoKC9cXGQvZyk7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1swXSArIChoYXNPY3RhdmUgPyBcIlwiIDogb2N0YXZlc1tpXSkpO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgaGFzT2N0YXZlID0gbm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXS5tYXRjaCgvXFxkL2cpO1xyXG4gICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0gKyAoaGFzT2N0YXZlID8gXCJcIiA6IG9jdGF2ZXNbaV0pKTtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IHNoaWZ0ZWROb3RlTmFtZXMgPSBzaGlmdChub3RlTmFtZXMsIHNjYWxlLnNoaWZ0ZWRJbnRlcnZhbCgpKTtcclxuICAgICAgIHJldHVybiBzaGlmdGVkTm90ZU5hbWVzO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlTm90ZXNMb29rdXBUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHNjYWxlVGFibGUgPSB7fTtcclxuICAgICAgIGZvciAobGV0IGl0b25lID0gVE9ORVNfTUlOOyBpdG9uZSA8IFRPTkVTX01JTiArIE9DVEFWRV9NQVg7IGl0b25lKyspIHtcclxuICAgICAgICAgICBmb3IgKGxldCBpb2N0YXZlID0gT0NUQVZFX01JTjsgaW9jdGF2ZSA8PSBPQ1RBVkVfTUFYOyBpb2N0YXZlKyspIHtcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiBPYmplY3QudmFsdWVzKFNjYWxlVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGtleTogaXRvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogaW9jdGF2ZSxcclxuICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtgJHtpdG9uZX0tJHtpb2N0YXZlfS0ke0pTT04uc3RyaW5naWZ5KHRlbXBsYXRlKX1gXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVOb3RlTmFtZUxvb2t1cChzY2FsZSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gc2NhbGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgdGhlIGxvb2t1cCB0YWJsZSBhcyBzb29uIGFzIHRoZSBtb2R1bGUgaXMgbG9hZGVkXHJcbiAgICAqL1xyXG4gICBsZXQgX25vdGVzTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVzTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZU5vdGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3Rlc0xvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICBjb25zdCBidWlsZFNjYWxlTm90ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9ub3Rlc0xvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9ub3Rlc0xvb2t1cDtcclxuICAgICAgIF9ub3Rlc0xvb2t1cCA9IGNyZWF0ZU5vdGVzTG9va3VwVGFibGUoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVzTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgc2NhbGUgbm90ZSB0YWJsZVwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZXNMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTaG9ydGN1dCBmb3IgbW9kaWZpZXJzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgZmxhdCA9IC0xO1xyXG4gICBjb25zdCBmbGF0X2ZsYXQgPSAtMjtcclxuICAgY29uc3Qgc2hhcnAgPSAxO1xyXG4gICAvKipcclxuICAgICogQ2hvcmQgdGVtcGxhdGVzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgQ2hvcmRUZW1wbGF0ZXMgPSB7XHJcbiAgICAgICBtYWo6IFsxLCAzLCA1XSxcclxuICAgICAgIG1hajQ6IFsxLCAzLCA0LCA1XSxcclxuICAgICAgIG1hajY6IFsxLCAzLCA1LCA2XSxcclxuICAgICAgIG1hajY5OiBbMSwgMywgNSwgNiwgOV0sXHJcbiAgICAgICBtYWo3OiBbMSwgMywgNSwgN10sXHJcbiAgICAgICBtYWo5OiBbMSwgMywgNSwgNywgOV0sXHJcbiAgICAgICBtYWoxMTogWzEsIDMsIDUsIDcsIDksIDExXSxcclxuICAgICAgIG1hajEzOiBbMSwgMywgNSwgNywgOSwgMTEsIDEzXSxcclxuICAgICAgIG1hajdzMTE6IFsxLCAzLCA1LCA3LCBbMTEsIHNoYXJwXV0sXHJcbiAgICAgICBtYWpiNTogWzEsIDMsIFs1LCBmbGF0XV0sXHJcbiAgICAgICBtaW46IFsxLCBbMywgZmxhdF0sIDVdLFxyXG4gICAgICAgbWluNDogWzEsIFszLCBmbGF0XSwgNCwgNV0sXHJcbiAgICAgICBtaW42OiBbMSwgWzMsIGZsYXRdLCA1LCA2XSxcclxuICAgICAgIG1pbjc6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XV0sXHJcbiAgICAgICBtaW5BZGQ5OiBbMSwgWzMsIGZsYXRdLCA1LCA5XSxcclxuICAgICAgIG1pbjY5OiBbMSwgWzMsIGZsYXRdLCA1LCA2LCA5XSxcclxuICAgICAgIG1pbjk6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBtaW4xMTogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5LCAxMV0sXHJcbiAgICAgICBtaW4xMzogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5LCAxMSwgMTNdLFxyXG4gICAgICAgbWluN2I1OiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203OiBbMSwgMywgNSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgZG9tMTE6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDksIDExXSxcclxuICAgICAgIGRvbTEzOiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5LCAxMSwgMTNdLFxyXG4gICAgICAgZG9tN3M1OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTdiNTogWzEsIDMsIFs1LCBmbGF0XSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTdiOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzksIGZsYXRdXSxcclxuICAgICAgIGRvbTdzOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzksIHNoYXJwXV0sXHJcbiAgICAgICBkb205czU6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgZG9tOWI1OiBbMSwgMywgWzUsIGZsYXRdLCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgZG9tN3M1czk6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF0sIFs5LCBzaGFycF1dLFxyXG4gICAgICAgZG9tN3M1Yjk6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF0sIFs5LCBmbGF0XV0sXHJcbiAgICAgICBkb203czExOiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbMTEsIHNoYXJwXV0sXHJcbiAgICAgICBkaW06IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XV0sXHJcbiAgICAgICBkaW03OiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF0sIFs3LCBmbGF0X2ZsYXRdXSxcclxuICAgICAgIGF1ZzogWzEsIDMsIFs1LCBzaGFycF1dLFxyXG4gICAgICAgc3VzMjogWzEsIDIsIDVdLFxyXG4gICAgICAgc3VzNDogWzEsIFs0LCBmbGF0XSwgNV0sXHJcbiAgICAgICBmaWZ0aDogWzEsIDVdLFxyXG4gICAgICAgYjU6IFsxLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgczExOiBbMSwgNSwgWzExLCBzaGFycF1dLFxyXG4gICB9O1xyXG4gICBPYmplY3Qua2V5cyhDaG9yZFRlbXBsYXRlcykuZm9yRWFjaCgoZWxlbWVudCkgPT4gT2JqZWN0LmZyZWV6ZShDaG9yZFRlbXBsYXRlc1tlbGVtZW50XSkpO1xuXG4gICBjb25zdCBERUZBVUxUX0NIT1JEX1RFTVBMQVRFID0gWzEsIDMsIDVdO1xyXG4gICBjb25zdCBERUZBVUxUX1NDQUxFID0gbmV3IFNjYWxlKCk7XG5cbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlTG9va3VwLmpzb25cIjtcclxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICBjb25zdCBuYW1lUmVnZXggPSAvKFtBLUddKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4ID0gLygjfHN8YikoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXggPSAvKFswLTldKykoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3QgY2hvcmROYW1lUmVnZXggPSAvKG1pbnxtYWp8ZGltfGF1ZykoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3QgYWRkaXRpb25zUmVnZXggPSAvKFsjfHN8Yl0/WzAtOV0rKSg/IVteKF0qXFwpKS9nO1xyXG4gICAvKipcclxuICAgICogQHBhcmFtIGNob3JkIHRoZSBzdHJpbmcgdG8gcGFyc2VcclxuICAgICogQHJldHVybnMgYSB2YWxpZCBDaG9yZEluaXRpYWxpemVyXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VDaG9yZCA9IChjaG9yZCkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjaG9yZExvb2t1cChjaG9yZCk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGxldCBjaG9yZE5hbWUgPSBcIm1halwiO1xyXG4gICAgICAgbGV0IGFkZGl0aW9ucyA9IFtdO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gY2hvcmQubWF0Y2gobmFtZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG1vZGlmaWVyTWF0Y2ggPSBjaG9yZC5tYXRjaChtb2RpZmllclJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gY2hvcmQubWF0Y2gob2N0YXZlUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgY2hvcmROYW1lTWF0Y2ggPSBjaG9yZC5tYXRjaChjaG9yZE5hbWVSZWdleCk/LmpvaW4oXCJcIik7XHJcbiAgICAgICBjb25zdCBhZGRpdGlvbnNNYXRjaCA9IGNob3JkLm1hdGNoKGFkZGl0aW9uc1JlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChjaG9yZE5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIC8vIGNvbnN0IFtuYW1lXSA9IGNob3JkTmFtZU1hdGNoO1xyXG4gICAgICAgICAgIGNob3JkTmFtZSA9IGNob3JkTmFtZU1hdGNoO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGFkZGl0aW9uc01hdGNoKSB7XHJcbiAgICAgICAgICAgYWRkaXRpb25zID0gYWRkaXRpb25zTWF0Y2g7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBpbnRlcnZhbHMgPSBbXTtcclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICBpbnRlcnZhbHMucHVzaCguLi5DaG9yZFRlbXBsYXRlc1tjaG9yZE5hbWVdKTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGl0aW9uIG9mIGFkZGl0aW9ucykge1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kID0gMDtcclxuICAgICAgICAgICAgICAgaWYgKGFkZGl0aW9uWzBdID09PSBcIiNcIiB8fCBhZGRpdGlvblswXSA9PT0gXCJzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIGlmIChhZGRpdGlvblswXSA9PT0gXCJiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgYWRkaXRpb25zLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgYWRkaXRpb25OdW0gPSBwYXJzZUludChhZGRpdGlvbiwgMTApO1xyXG4gICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWxzLmluY2x1ZGVzKGFkZGl0aW9uTnVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpbnRlcnZhbHMuaW5kZXhPZihhZGRpdGlvbk51bSk7XHJcbiAgICAgICAgICAgICAgICAgICBpbnRlcnZhbHNbaW5kZXhdID0gW2FkZGl0aW9uTnVtLCBtb2RdO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxzLnB1c2goW2FkZGl0aW9uTnVtLCBtb2RdKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICByb290OiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBpbnRlcnZhbHMsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY2hvcmQgbmFtZVwiKTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIEByZXR1cm5zIGEgbG9va3VwIHRhYmxlIG9mIGNob3JkIG5hbWVzIGFuZCB0aGVpciBpbml0aWFsaXplcnNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgY29uc3QgcXVhbGl0aWVzID0gW1wibWFqXCIsIFwibWluXCIsIFwiZGltXCIsIFwiYXVnXCIsIFwic3VzXCJdO1xyXG4gICAgICAgY29uc3QgYWRkaXRpb25zID0gW1xyXG4gICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgXCIyXCIsXHJcbiAgICAgICAgICAgXCIzXCIsXHJcbiAgICAgICAgICAgXCI0XCIsXHJcbiAgICAgICAgICAgXCI1XCIsXHJcbiAgICAgICAgICAgXCI2XCIsXHJcbiAgICAgICAgICAgXCI3XCIsXHJcbiAgICAgICAgICAgXCI5XCIsXHJcbiAgICAgICAgICAgXCIxMVwiLFxyXG4gICAgICAgICAgIFwiMTNcIixcclxuICAgICAgICAgICBcImIyXCIsXHJcbiAgICAgICAgICAgXCJiM1wiLFxyXG4gICAgICAgICAgIFwiYjRcIixcclxuICAgICAgICAgICBcImI1XCIsXHJcbiAgICAgICAgICAgXCJiNlwiLFxyXG4gICAgICAgICAgIFwiYjdcIixcclxuICAgICAgICAgICBcImI5XCIsXHJcbiAgICAgICAgICAgXCJiMTFcIixcclxuICAgICAgICAgICBcImIxM1wiLFxyXG4gICAgICAgICAgIFwiczJcIixcclxuICAgICAgICAgICBcInMzXCIsXHJcbiAgICAgICAgICAgXCJzNFwiLFxyXG4gICAgICAgICAgIFwiczVcIixcclxuICAgICAgICAgICBcInM2XCIsXHJcbiAgICAgICAgICAgXCJzN1wiLFxyXG4gICAgICAgICAgIFwiczlcIixcclxuICAgICAgICAgICBcInMxMVwiLFxyXG4gICAgICAgICAgIFwiczEzXCIsXHJcbiAgICAgICAgICAgXCIjMlwiLFxyXG4gICAgICAgICAgIFwiIzNcIixcclxuICAgICAgICAgICBcIiM0XCIsXHJcbiAgICAgICAgICAgXCIjNVwiLFxyXG4gICAgICAgICAgIFwiIzZcIixcclxuICAgICAgICAgICBcIiM3XCIsXHJcbiAgICAgICAgICAgXCIjOVwiLFxyXG4gICAgICAgICAgIFwiIzExXCIsXHJcbiAgICAgICAgICAgXCIjMTNcIixcclxuICAgICAgICAgICBcIjdzMTFcIixcclxuICAgICAgICAgICBcIjcjMTFcIixcclxuICAgICAgICAgICBcIjdiOVwiLFxyXG4gICAgICAgICAgIFwiNyM5XCIsXHJcbiAgICAgICAgICAgXCI3YjVcIixcclxuICAgICAgICAgICBcIjcjNVwiLFxyXG4gICAgICAgICAgIFwiN2I5YjVcIixcclxuICAgICAgICAgICBcIjcjOSM1XCIsXHJcbiAgICAgICAgICAgXCI3YjEzXCIsXHJcbiAgICAgICAgICAgXCI3IzEzXCIsXHJcbiAgICAgICAgICAgXCI5IzVcIixcclxuICAgICAgICAgICBcIjliNVwiLFxyXG4gICAgICAgICAgIFwiOSMxMVwiLFxyXG4gICAgICAgICAgIFwiOWIxMVwiLFxyXG4gICAgICAgICAgIFwiOSMxM1wiLFxyXG4gICAgICAgICAgIFwiOWIxM1wiLFxyXG4gICAgICAgICAgIFwiMTEjNVwiLFxyXG4gICAgICAgICAgIFwiMTFiNVwiLFxyXG4gICAgICAgICAgIFwiMTEjOVwiLFxyXG4gICAgICAgICAgIFwiMTFiOVwiLFxyXG4gICAgICAgICAgIFwiMTEjMTNcIixcclxuICAgICAgICAgICBcIjExYjEzXCIsXHJcbiAgICAgICBdO1xyXG4gICAgICAgZm9yIChjb25zdCBxdWFsaXR5IG9mIHF1YWxpdGllcykge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgYWRkaXRpb24gb2YgYWRkaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZUxldHRlciBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlTW9kaWZpZXIgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSR7bm90ZU1vZGlmaWVyfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IE9DVEFWRV9NSU47IGkgPD0gT0NUQVZFX01BWDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSR7bm90ZU1vZGlmaWVyfSR7aX0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGxldCBfY2hvcmRMb29rdXAgPSB7fTtcclxuICAgLyoqXHJcbiAgICAqIEBwYXJhbSBrZXkgdGhlIHN0cmluZyB0byBsb29rdXBcclxuICAgICogQHJldHVybnMgYSB2YWxpZCBjaG9yZCBpbml0aWFsaXplclxyXG4gICAgKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBrZXkgaXMgbm90IGEgdmFsaWQgY2hvcmRcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjaG9yZExvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkQ2hvcmRUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9jaG9yZExvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfSk7XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSB0YWJsZSBhcyB7IFtrZXk6IHN0cmluZ106IENob3JkSW5pdGlhbGl6ZXIgfTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZENob3JkVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX2Nob3JkTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX2Nob3JkTG9va3VwO1xyXG4gICAgICAgX2Nob3JkTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX2Nob3JkTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgY2hvcmQgdGFibGVcIik7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3QuZW50cmllcyhfY2hvcmRMb29rdXApLmxlbmd0aCk7XHJcbiAgICAgICByZXR1cm4gX2Nob3JkTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogQ2hvcmRzIGNvbnNpc3Qgb2YgYSByb290IG5vdGUsIG9jdGF2ZSwgY2hvcmQgdGVtcGxhdGUsIGFuZCBhIGJhc2Ugc2NhbGUuPGJyPjxicj5cclxuICAgICogVGhlIGNob3JkIHRlbXBsYXRlIGlzIGFuIGFycmF5IG9mIGludGVnZXJzLCBlYWNoIGludGVnZXIgcmVwcmVzZW50aW5nPGJyPlxyXG4gICAgKiAgYSBzY2FsZSBkZWdyZWUgZnJvbSB0aGUgYmFzZSBzY2FsZShkZWZhdWx0cyB0byBtYWpvcikuPGJyPlxyXG4gICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSBpcyB0aGUgSSxJSUksViBkZW5vdGVkIGFzIFsxLDMsNV08YnI+XHJcbiAgICAqIENob3JkSW50ZXJ2YWxzIHVzZWQgaW4gdGVtcGxhdGVzIGNhbiBhbHNvIGNvbnRhaW4gYSBtb2RpZmllciw8YnI+XHJcbiAgICAqIGZvciBhIHBhcnRpY3VsYXIgc2NhbGUgZGVncmVlLCBzdWNoIGFzIFsxLDMsWzUsIC0xXV08YnI+XHJcbiAgICAqIHdoZXJlIC0xIGlzIGZsYXQsIDAgaXMgbmF0dXJhbCwgYW5kIDEgaXMgc2hhcnAuPGJyPlxyXG4gICAgKiBJdCBjb3VsZCBhbHNvIGJlIHdyaXR0ZW4gYXMgWzEsMyxbNSwgbW9kaWZpZXIuZmxhdF1dPGJyPlxyXG4gICAgKiBpZiB5b3UgaW1wb3J0IG1vZGlmaWVyLlxyXG4gICAgKlxyXG4gICAgKiBUaGUgZm9sbG93aW5nIHByZWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6PGJyPlxyXG4gICAgKiA8dGFibGU+XHJcbiAgICAqIDx0cj5cclxuICAgICogPHRkPm1hajwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo0PC90ZD5cclxuICAgICogPHRkPm1hajY8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1hajc8L3RkPlxyXG4gICAgKiA8dGQ+bWFqOTwvdGQ+XHJcbiAgICAqIDx0ZD5tYWoxMTwvdGQ+XHJcbiAgICAqIDx0ZD5tYWoxMzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqN3MxMTwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpiNTwvdGQ+XHJcbiAgICAqIDx0ZD5taW48L3RkPlxyXG4gICAgKiA8dGQ+bWluNDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWluNjwvdGQ+XHJcbiAgICAqIDx0ZD5taW43PC90ZD5cclxuICAgICogPHRkPm1pbkFkZDk8L3RkPlxyXG4gICAgKiA8dGQ+bWluNjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbjk8L3RkPlxyXG4gICAgKiA8dGQ+bWluMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWluMTM8L3RkPlxyXG4gICAgKiA8dGQ+bWluN2I1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203PC90ZD5cclxuICAgICogPHRkPmRvbTk8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tMTE8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tMTM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTdzNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203YjU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3M5PC90ZD5cclxuICAgICogPHRkPmRvbTdiOTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tOWI1PC90ZD5cclxuICAgICogPHRkPmRvbTlzNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czExPC90ZD5cclxuICAgICogPHRkPmRvbTdzNXM5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203czViOTwvdGQ+XHJcbiAgICAqIDx0ZD5kaW08L3RkPlxyXG4gICAgKiA8dGQ+ZGltNzwvdGQ+XHJcbiAgICAqIDx0ZD5hdWc8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnN1czI8L3RkPlxyXG4gICAgKiA8dGQ+c3VzNDwvdGQ+XHJcbiAgICAqIDx0ZD5maWZ0aDwvdGQ+XHJcbiAgICAqIDx0ZD5iNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+czExPC90ZD5cclxuICAgICogPC90cj5cclxuICAgICogPC90YWJsZT5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBDaG9yZCB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRUZW1wbGF0ZX0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZEludGVydmFsfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge01vZGlmaWVyfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkSW5pdGlhbGl6ZXJ9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7Ly8gVHlwZXNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIENob3JkIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7IENob3JkLCBDaG9yZFRlbXBsYXRlcywgTW9kaWZpZXIgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vY3JlYXRlcyBhIGNob3JkIHdpdGggdGhlIGRlZmF1bHQoMSwzLDUpIHRlbXBsYXRlLCByb290IG9mIEMsIGluIHRoZSA0dGggb2N0YXZlXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBjaG9yZCB3aXRoIHRoZSBwcmUtZGVmaW5lZCBkaW1pbmlzaGVkIHRlbXBsYXRlLCByb290IG9mIEViLCBpbiB0aGUgNXRoIG9jdGF2ZVxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoe3Jvb3Q6IDMsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IENob3JkVGVtcGxhdGVzLmRpbX0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogKHJvb3Qtbm90ZS1uYW1lW3MsIyxiXVtvY3RhdmVdKVtjaG9yZC10ZW1wbGF0ZS1uYW1lfFtjaG9yZC1xdWFsaXR5XVttb2RpZmllcnNdXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIGNob3JkIGZyb20gYSBzdHJpbmdcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCcoRDQpbWluNCcpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLkRFRkFVTFRfQ0hPUkRfVEVNUExBVEVdO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlQ2hvcmQodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uKHBhcnNlZD8udGVtcGxhdGUgPz8gREVGQVVMVF9DSE9SRF9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHBhcnNlZD8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBwYXJzZWQ/LnJvb3QgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLih2YWx1ZXMudGVtcGxhdGUgPz8gREVGQVVMVF9DSE9SRF9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHZhbHVlcy5yb290ID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZSA9IG5ldyBTY2FsZSh7IGtleTogdGhpcy5fcm9vdCwgb2N0YXZlOiB0aGlzLl9vY3RhdmUgfSk7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pZCk7IC8vIGhhbDg5MzRobGxcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByb290XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9yb290ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5yb290KTsgLy8gMChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgcm9vdCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2V0dGluZyB0aGUgcm9vdCB0byBhIHZhbHVlIG91dHNpZGUgb2YgdGhlIHJhbmdlIFswLCAxMV0oc2VtaXRvbmUpIHdpbGw8YnIvPlxyXG4gICAgICAgICogd3JhcCB0aGUgc2VtaXRvbmUgdG8gdGhlIHJhbmdlIFswLCAxMV0gYW5kIGNoYW5nZSB0aGUgb2N0YXZlIGRlcGVuZGluZzxici8+XHJcbiAgICAgICAgKiBvbiBob3cgbWFueSB0aW1lcyB0aGUgc2VtaXRvbmUgaGFzIGJlZW4gd3JhcHBlZC5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQucm9vdCA9IDQ7IC8vIHNldHMgdGhlIHJvb3QgdG8gNHRoIHNlbWl0b25lKEUpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5yb290KTsgLy8gNChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgcm9vdCh2YWx1ZSkge1xyXG4gICAgICAgICAgIC8vIHRoaXMuX3Jvb3QgPSB2YWx1ZTtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcCh2YWx1ZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX3Jvb3QgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IHRoaXMuX29jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGJhc2Ugc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX2Jhc2VTY2FsZSA9IERFRkFVTFRfU0NBTEU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuYmFzZVNjYWxlKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IHNjYWxlKG1ham9yKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBiYXNlU2NhbGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VTY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTm90IGEgbG90IG9mIGdvb2QgcmVhc29ucyB0byBjaGFuZ2UgdGhpcyBleGNlcHQgZm9yIGV4cGVyaW1lbnRhdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5iYXNlU2NhbGUgPSBuZXcgU2NhbGUoeyBrZXk6IDMsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIDVdIH0pO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuYmFzZVNjYWxlKTsgLy8gcHJpbnRzIHRoZSBtaW5vciBzY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBiYXNlU2NhbGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUgPSB2YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUub2N0YXZlID0gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQub2N0YXZlKTsgLy8gNChvY3RhdmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm9jdGF2ZSA9IDU7IC8vIHNldHMgdGhlIG9jdGF2ZSB0byA1dGhcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm9jdGF2ZSk7IC8vIDUob2N0YXZlKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcCh2YWx1ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlLm9jdGF2ZSA9IHRoaXMuX29jdGF2ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdGVtcGxhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgdGVtcGxhdGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIFsuLi50aGlzLl90ZW1wbGF0ZV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBmb2xsb3dpbmcgcHJlZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTo8YnI+XHJcbiAgICAgICAgKiA8dGFibGU+XHJcbiAgICAgICAgKiA8dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo0PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo2PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo2OTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo3PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo5PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWoxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqMTM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqN3MxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqYjU8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5taW42PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW43PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5BZGQ5PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW42OTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5taW45PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW4xMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluMTM8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjdiNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb205PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb20xMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tMTM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203YjU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN2I5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTliNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOXM1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czExPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czVzOTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203czViOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZGltPC90ZD5cclxuICAgICAgICAqIDx0ZD5kaW03PC90ZD5cclxuICAgICAgICAqIDx0ZD5hdWc8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+c3VzMjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3VzNDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZmlmdGg8L3RkPlxyXG4gICAgICAgICogPHRkPmI1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnMxMTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPlxyXG4gICAgICAgICogPC90YWJsZT5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQudGVtcGxhdGUgPSBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCA1XTsgLy8gc2V0cyB0aGUgdGVtcGxhdGUgdG8gYSBtaW5vciBjaG9yZFxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBwcmludHMgdGhlIG5ldyB0ZW1wbGF0ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLnZhbHVlXTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbm90ZXNcclxuICAgICAgICAqIG5vdGVzIGFyZSBnZW5lcmF0ZWQgYW5kIGNhY2hlZCBhcyBuZWVkZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgX25vdGVzID0gW107XHJcbiAgICAgICBfbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHdpbGwgZ2VuZXJhdGUgbm90ZXMgaWYgbmVlZGVkIG9yIHJldHVybiB0aGUgY2FjaGVkIG5vdGVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm5vdGVzKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IG5vdGVzXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG5vdGVzKCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9ub3Rlc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOb3RlcygpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZ2VuZXJhdGUgbm90ZXMoaW50ZXJuYWwpXHJcbiAgICAgICAgKiBnZW5lcmF0ZXMgdGhlIG5vdGVzIGZvciB0aGlzIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdlbmVyYXRlTm90ZXMoKSB7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXMgPSBbXTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGxldCB0b25lID0gMDtcclxuICAgICAgICAgICAgICAgbGV0IG1vZCA9IDA7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgdG9uZSA9IGludGVydmFsWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gaW50ZXJ2YWxbMV07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICB0b25lID0gaW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdG9uZTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMuX2Jhc2VTY2FsZS5kZWdyZWUob2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZVRvbmUgPSBub3RlLnNlbWl0b25lO1xyXG4gICAgICAgICAgICAgICBub3RlLnNlbWl0b25lID0gbm90ZVRvbmUgKyBtb2Q7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzLnB1c2gobm90ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIG5vdGUgbmFtZXMgLT4gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0Tm90ZU5hbWVzKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGVOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiB0aGlzLm5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBub3RlTmFtZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgQ2hvcmQoe1xyXG4gICAgICAgICAgICAgICByb290OiB0aGlzLnJvb3QsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBbLi4udGhpcy5fdGVtcGxhdGVdLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gb3RoZXIgdGhlIG90aGVyIGNob3JkIHRvIGNvbXBhcmUgdG9cclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHR3byBjaG9yZHMgYXJlIGVxdWFsXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuICh0aGlzLnJvb3QgPT09IG90aGVyLnJvb3QgJiZcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPT09IG90aGVyLm9jdGF2ZSAmJlxyXG4gICAgICAgICAgICAgICBpc0VxdWFsKHRoaXMuX3RlbXBsYXRlLCBvdGhlci50ZW1wbGF0ZSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBtdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBuYXRydWFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY2hvcmQubWFqb3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1ham9yKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKDMpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gMztcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIG5hdHVyYWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQubWFqb3JlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtYWpvcmVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5tYWpvcigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBuYXR1cmFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01ham9yKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNNYWpvcigpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIG11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLFszLC0xXSw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1pbm9yKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFszLCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzMsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5taW5vcmVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsWzMsLTFdLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWlub3JlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkubWlub3IoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNaW5vcigpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01pbm9yKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNNaW5vcigpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBzaGFycCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuYXVnbWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLnNoYXJwXV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhdWdtZW50KCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs1LCAxXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNSwgMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBzaGFycCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmF1Z21lbnRlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuc2hhcnBdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGF1Z21lbnRlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuYXVnbWVudCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBzaGFycCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNBdWdtZW50ZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5hdWdtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0F1Z21lbnRlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzQXVnbWVudGVkKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuZGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkaW1pbmlzaCgpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNSwgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs1LCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuZGltaW5pc2hlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuZGltaW5pc2goKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNEaW1pbmlzaGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuZGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzRGltaW5pc2hlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5oYWxmRGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIFszLCBNb2RpZmllci5mbGF0XSwgWzUsIE1vZGlmaWVyLmZsYXRdLCBbNywgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKlxyXG4gICAgICAgICovXHJcbiAgICAgICBoYWxmRGltaW5pc2goKSB7XHJcbiAgICAgICAgICAgdGhpcy5taW5vcigpOyAvLyBnZXQgZmxhdCAzcmRcclxuICAgICAgICAgICB0aGlzLmRpbWluaXNoKCk7IC8vIGdldCBmbGF0IDV0aFxyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs3LCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzcsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5oYWxmRGltaW5pc2hlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF0sIFs3LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqL1xyXG4gICAgICAgaGFsZkRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0hhbGZEaW1pbmlzaGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0hhbGZEaW1pbmlzaGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzSGFsZkRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgbGV0IHRoaXJkID0gZmFsc2U7XHJcbiAgICAgICAgICAgbGV0IGZpZnRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgbGV0IHNldmVudGggPSBmYWxzZTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgc2V2ZW50aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGZpZnRoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlyZCAmJiBmaWZ0aCAmJiBzZXZlbnRoO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggd2l0aCB0aGUgZmlyc3Qgbm90ZSBtb3ZlZCB0byB0aGUgZW5kIHVwIG9uZSBvY3RhdmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogY2hvcmQuaW52ZXJ0KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFszLDUsMV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydFNCcsICdHNCcsICdDNSddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW52ZXJ0KCkge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3RlbXBsYXRlWzBdKTtcclxuICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl90ZW1wbGF0ZVswXSkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbMF1bMF0gKz0gdGhpcy5fYmFzZVNjYWxlLnRlbXBsYXRlLmxlbmd0aDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlWzBdICs9IHRoaXMuX2Jhc2VTY2FsZS50ZW1wbGF0ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIHRoaXMuX3RlbXBsYXRlLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gbmV3VGVtcGxhdGU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCB3aXRoIHRoZSBmaXJzdCBub3RlIG1vdmVkIHRvIHRoZSBlbmQgdXAgb25lIG9jdGF2ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuaW52ZXJ0ZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMyw1LDFdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LmdldE5vdGVOYW1lcygpKTsgLy8gWydFNCcsICdHNCcsICdDNSddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW52ZXJ0ZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmludmVydCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgc3RyaW5nIGZvcm0gb2YgdGhlIGNob3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRvU3RyaW5nKCkpOyAvLyAnKEM0KW1haidcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoQ2hvcmRUZW1wbGF0ZXMpO1xyXG4gICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoQ2hvcmRUZW1wbGF0ZXMpLm1hcCgodGVtcGxhdGUpID0+IEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgY29uc3QgaW5kZXggPSB2YWx1ZXMuaW5kZXhPZihKU09OLnN0cmluZ2lmeSh0aGlzLl90ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGNvbnN0IHByZWZpeCA9IGAoJHtTZW1pdG9uZSQxW3RoaXMuX3Jvb3RdfSR7dGhpcy5fb2N0YXZlfSlgO1xyXG4gICAgICAgICAgIGNvbnN0IHN0ciA9IGluZGV4ID4gLTEgPyBwcmVmaXggKyBrZXlzW2luZGV4XSA6IHRoaXMuZ2V0Tm90ZU5hbWVzKCkuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogQnVpbGRzIGxvb2t1cCB0YWJsZXMgZm9yIG1vcmUgcGVyZm9ybWFudCBzdHJpbmcgcGFyc2luZy48YnIvPlxyXG4gICAgKiBTaG91bGQgb25seShvcHRpb25hbGx5KSBiZSBjYWxsZWQgb25jZSBzb29uIGFmdGVyIHRoZSBsaWJyYXJ5IGlzIGxvYWRlZCBhbmQ8YnIvPlxyXG4gICAgKiBvbmx5IGlmIHlvdSBhcmUgdXNpbmcgc3RyaW5nIGluaXRpYWxpemVycy5cclxuICAgICovXHJcbiAgIGNvbnN0IGJ1aWxkVGFibGVzID0gKCkgPT4ge1xyXG4gICAgICAgYnVpbGROb3RlVGFibGUoKTtcclxuICAgICAgIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVOb3RlVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVOYW1lVGFibGUoKTtcclxuICAgICAgIGJ1aWxkQ2hvcmRUYWJsZSgpO1xyXG4gICB9O1xuXG4gICBleHBvcnRzLkNob3JkID0gQ2hvcmQ7XG4gICBleHBvcnRzLkNob3JkVGVtcGxhdGVzID0gQ2hvcmRUZW1wbGF0ZXM7XG4gICBleHBvcnRzLkluc3RydW1lbnQgPSBJbnN0cnVtZW50O1xuICAgZXhwb3J0cy5Nb2RpZmllciA9IE1vZGlmaWVyJDE7XG4gICBleHBvcnRzLk5vdGUgPSBOb3RlO1xuICAgZXhwb3J0cy5TY2FsZSA9IFNjYWxlO1xuICAgZXhwb3J0cy5TY2FsZVRlbXBsYXRlcyA9IFNjYWxlVGVtcGxhdGVzO1xuICAgZXhwb3J0cy5TZW1pdG9uZSA9IFNlbWl0b25lJDE7XG4gICBleHBvcnRzLmJ1aWxkVGFibGVzID0gYnVpbGRUYWJsZXM7XG5cbiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKTtcbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlLCBTY2FsZVRlbXBsYXRlcyB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiXG5cblxudHlwZSBMaWdodFNjYWxlID0ge1xuICAgIGtleTogbnVtYmVyLFxuICAgIHRlbXBsYXRlU2x1Zzogc3RyaW5nLFxuICAgIHNlbWl0b25lczogbnVtYmVyW10sXG59O1xuXG5cbmNvbnN0IHNjYWxlc0Zvck5vdGVzID0gKG5vdGVzOiBOb3RlW10sIHBhcmFtczogTXVzaWNQYXJhbXMpOiBTY2FsZVtdID0+IHtcbiAgICBjb25zdCBzY2FsZXMgPSBuZXcgU2V0PExpZ2h0U2NhbGU+KClcbiAgICAvLyBGaXJzdCBhZGQgYWxsIHNjYWxlc1xuICAgIGZvciAoY29uc3Qgc2NhbGVTbHVnIGluIHBhcmFtcy5zY2FsZVNldHRpbmdzKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gcGFyYW1zLnNjYWxlU2V0dGluZ3Nbc2NhbGVTbHVnXTtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHNlbWl0b25lPTA7IHNlbWl0b25lIDwgMTI7IHNlbWl0b25lKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7a2V5OiBzZW1pdG9uZSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzW3NjYWxlU2x1Z119KVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbWl0b25lcyA9IHNjYWxlLm5vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKHNjYWxlLmtleSAtIDEgKyAyNCkgJSAxMjtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbWl0b25lcy5pbmNsdWRlcyhsZWFkaW5nVG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmVzLnB1c2gobGVhZGluZ1RvbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY2FsZXMuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBzZW1pdG9uZSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVTbHVnOiBzY2FsZVNsdWcsXG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lczogc2VtaXRvbmVzLFxuICAgICAgICAgICAgICAgIH0gYXMgTGlnaHRTY2FsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gbm90ZS5zZW1pdG9uZVxuICAgICAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIHNjYWxlcykge1xuICAgICAgICAgICAgaWYgKCFzY2FsZS5zZW1pdG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgc2NhbGVzLmRlbGV0ZShzY2FsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2NhbGUgb2Ygc2NhbGVzKSB7XG4gICAgICAgIHJldC5wdXNoKG5ldyBTY2FsZSh7a2V5OiBzY2FsZS5rZXksIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlc1tzY2FsZS50ZW1wbGF0ZVNsdWddfSkpXG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cblxuZXhwb3J0IGNvbnN0IGdldEF2YWlsYWJsZVNjYWxlcyA9ICh2YWx1ZXM6IHtcbiAgICBsYXRlc3REaXZpc2lvbjogbnVtYmVyLFxuICAgIGRpdmlzaW9uZWRSaWNoTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsXG4gICAgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICByYW5kb21Ob3RlczogQXJyYXk8Tm90ZT4sXG4gICAgbG9nZ2VyOiBMb2dnZXIsXG59KTogQXJyYXk8e1xuICAgIHNjYWxlOiBTY2FsZSxcbiAgICB0ZW5zaW9uOiBudW1iZXIsXG59PiA9PiB7XG4gICAgY29uc3Qge2xhdGVzdERpdmlzaW9uLCBkaXZpc2lvbmVkUmljaE5vdGVzLCBwYXJhbXMsIHJhbmRvbU5vdGVzLCBsb2dnZXJ9ID0gdmFsdWVzO1xuICAgIC8vIEdpdmVuIGEgbmV3IGNob3JkLCBmaW5kIGF2YWlsYWJsZSBzY2FsZXMgYmFzZSBvbiB0aGUgcHJldmlvdXMgbm90ZXNcbiAgICBjb25zdCBjdXJyZW50QXZhaWxhYmxlU2NhbGVzID0gc2NhbGVzRm9yTm90ZXMocmFuZG9tTm90ZXMsIHBhcmFtcylcblxuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2NhbGUgb2YgY3VycmVudEF2YWlsYWJsZVNjYWxlcykge1xuICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgIHRlbnNpb246IDAsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbG9nZ2VyLmxvZyhcImN1cnJlbnRBdmFpbGFibGVTY2FsZXNcIiwgY3VycmVudEF2YWlsYWJsZVNjYWxlcylcblxuICAgIC8vIEdvIGJhY2sgYSBmZXcgY2hvcmRzIGFuZCBmaW5kIHRoZSBzY2FsZXMgdGhhdCBhcmUgYXZhaWxhYmxlLlxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRpdmlzaW9uID0gbGF0ZXN0RGl2aXNpb24gLSAoaSAqIEJFQVRfTEVOR1RIKVxuICAgICAgICBpZiAoIWRpdmlzaW9uZWRSaWNoTm90ZXNbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3RlcyA9IGRpdmlzaW9uZWRSaWNoTm90ZXNbZGl2aXNpb25dLm1hcChyaWNoTm90ZSA9PiByaWNoTm90ZS5ub3RlKVxuICAgICAgICBjb25zdCBhdmFpbGFibGVTY2FsZXMgPSBzY2FsZXNGb3JOb3Rlcyhub3RlcywgcGFyYW1zKVxuICAgICAgICBmb3IgKGNvbnN0IHBvdGVudGlhbFNjYWxlIG9mIHJldCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhdmFpbGFibGVTY2FsZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5lcXVhbHMocG90ZW50aWFsU2NhbGUuc2NhbGUpKVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gU2NhbGUgd2Fzbid0IGF2YWlsYWJsZSwgaW5jcmVhc2UgdGVuc2lvblxuICAgICAgICAgICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSAyMCAgLy8gQmFzZSBvZiBob3cgbG9uZyBhZ28gaXQgd2FzXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSAxMFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbFNjYWxlLnRlbnNpb24gKz0gNVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbFNjYWxlLnRlbnNpb24gKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2dnZXIubG9nKFwiU2NhbGUgXCIsIHBvdGVudGlhbFNjYWxlLnNjYWxlLnRvU3RyaW5nKCksXCIgd2Fzbid0IGF2YWlsYWJsZSBhdCBkaXZpc2lvbiBcIiwgZGl2aXNpb24sIFwiLCBpbmNyZWFzZSB0ZW5zaW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxvZ2dlci5wcmludChcIkF2YWlsYWJsZSBzY2FsZXNcIiwgcmV0KVxuXG4gICAgcmV0dXJuIHJldC5maWx0ZXIoaXRlbSA9PiBpdGVtLnRlbnNpb24gPCAxMCk7XG59IiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgVGVuc2lvbiwgVGVuc2lvblBhcmFtcyB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2xvYmFsU2VtaXRvbmUsIGdUb25lU3RyaW5nLCBtYWpTY2FsZURpZmZlcmVuY2UsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgY29uc3QgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcsXG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgYmVhdERpdmlzaW9uLFxuICAgICAgICB9ID0gdmFsdWVzO1xuICAgIC8qXG4gICAgXG4gICAgQmFzaWMgY2lyY2xlIG9mIDV0aHMgcHJvZ3Jlc3Npb246XG5cbiAgICBpaWkgICAgICBcbiAgICB2aSAgICAgICAgIChEZWNlcHRpdmUgdG9uaWMpXG4gICAgaWkgPC0gSVYgICAoU3ViZG9taW5hbnQgZnVuY3Rpb24pXG4gICAgViAgLT4gdmlpICAoRG9taW5hbnQgZnVuY3Rpb24pXG4gICAgSSAgICAgICAgICAoVG9uaWMgZnVuY3Rpb24pXG5cbiAgICBBZGRpdGlvbmFsbHk6XG4gICAgViAtPiB2aSBpcyB0aGUgZGVjZXB0aXZlIGNhZGVuY2VcbiAgICBJViAtPiBJIGlzIHRoZSBwbGFnYWwgY2FkZW5jZVxuICAgIGlpaSAtPiBJViBpcyBhbGxvd2VkLlxuXG4gICAgT25jZSB3ZSBoYXZlIHN1YmRvbWluYW50IG9yIGRvbWluYW50IGNob3JkcywgdGhlcmUncyBubyBnb2luZyBiYWNrIHRvIGlpaSBvciB2aS5cblxuICAgIEkgd2FudCB0byBjaGVjayBwYWNoZWxiZWwgY2Fub24gcHJvZ3Jlc3Npb246XG4gICAgICBPSyAgIGRlY2VwdGl2ZT8gICBtYXliZSBzaW5jZSBubyBmdW5jdGlvbiAgICAgT0sgICAgT0sgaWYgaXRzIGk2NCAgIE9rIGJlY2F1c2UgaXRzIHRvbmljLiBPSyAgIE9LXG4gICAgSSAtPiBWICAgIC0+ICAgICB2aSAgICAgICAgIC0+ICAgICAgICAgICAgICBpaWkgLT4gSVYgICAgIC0+ICAgICAgICBJICAgICAgICAgLT4gICAgICAgIElWICAtPiBWIC0+IElcblxuICAgICovXG4gICAgY29uc3QgcHJvZ3Jlc3Npb25DaG9pY2VzOiB7IFtrZXk6IHN0cmluZ106IChudW1iZXIgfCBzdHJpbmcpW10gfCBudWxsIH0gPSB7XG4gICAgICAgIDA6IG51bGwsICAgICAgICAgICAgICAgICAgLy8gSSBjYW4gZ28gYW55d2hlcmVcbiAgICAgICAgMTogWydkb21pbmFudCcsIF0sICAgICAgICAvLyBpaSBjYW4gZ28gdG8gViBvciB2aWkgb3IgZG9taW5hbnRcbiAgICAgICAgMjogWzUsIDNdLCAgICAgICAgICAgICAgICAvLyBpaWkgY2FuIGdvIHRvIHZpIG9yIElWXG4gICAgICAgIDM6IFsxLCAyLCAnZG9taW5hbnQnXSwgICAgLy8gSVYgY2FuIGdvIHRvIEksIGlpIG9yIGRvbWluYW50XG4gICAgICAgIDQ6IFswLCA2LCAnZG9taW5hbnQnLCA1XSwgLy8gViBjYW4gZ28gdG8gSSwgdmlpIG9yIGRvbWluYW50IG9yIHZpXG4gICAgICAgIDU6IFsnc3ViLWRvbWluYW50JywgMl0sICAgICAgLy8gdmkgY2FuIGdvIHRvIGlpLCBJViwgKG9yIGlpaSlcbiAgICAgICAgNjogWzBdLCAgICAgICAgICAgICAgICAgICAvLyB2aWkgY2FuIGdvIHRvIElcbiAgICB9XG4gICAgbGV0IHdhbnRlZEZ1bmN0aW9uID0gbnVsbDtcbiAgICBsZXQgdHJ5VG9HZXRMZWFkaW5nVG9uZUluUGFydDAgPSBmYWxzZTtcbiAgICBsZXQgcGFydDBNdXN0QmVUb25pYyA9IGZhbHNlO1xuXG4gICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgJiYgaW52ZXJzaW9uTmFtZSkge1xuICAgICAgICBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIlBBQ1wiKSB7XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSA1KSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gMykge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICAgICAgICAgIHRyeVRvR2V0TGVhZGluZ1RvbmVJblBhcnQwID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMykge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICAgICAgICAgIHBhcnQwTXVzdEJlVG9uaWMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gMyAmJiAhaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gXCJjYWRlbmNlIFBBQzogTk9UIHJvb3QgaW52ZXJzaW9uISBcIjtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJJQUNcIikge1xuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gNSkge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMykge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gMyAmJiBpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgIC8vIE5vdCByb290IGludmVyc2lvblxuICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBcImNhZGVuY2UgSUFDOiByb290IGludmVyc2lvbiEgXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiSENcIikge1xuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gMykge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMikge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHByZXZDaG9yZDtcbiAgICBsZXQgcHJldlByZXZDaG9yZDtcbiAgICBsZXQgcGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgcHJldlBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IGxhdGVzdE5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBpZiAoZGl2aXNpb25lZE5vdGVzKSB7XG4gICAgICAgIGNvbnN0IGxhdGVzdERpdmlzaW9uID0gYmVhdERpdmlzaW9uIC0gQkVBVF9MRU5HVEg7XG4gICAgICAgIGxldCB0bXAgOiBBcnJheTxOb3RlPiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb25dIHx8IFtdKSkge1xuICAgICAgICAgICAgLy8gVXNlIG9yaWdpbmFsIG5vdGVzLCBub3QgdGhlIG9uZXMgdGhhdCBoYXZlIGJlZW4gdHVybmVkIGludG8gTkFDc1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2UHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBmb3IgKGxldCBpPWJlYXREaXZpc2lvbjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlcy5ldmVyeShCb29sZWFuKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwcmV2Q2hvcmQpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmcm9tTm90ZXNPdmVycmlkZSkge1xuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBmcm9tTm90ZXNPdmVycmlkZTtcbiAgICB9XG5cbiAgICBsZXQgZnJvbU5vdGVzO1xuICAgIGlmIChwYXNzZWRGcm9tTm90ZXMubGVuZ3RoIDwgNCkge1xuICAgICAgICBmcm9tTm90ZXMgPSB0b05vdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHBhc3NlZEZyb21Ob3RlcztcbiAgICB9XG5cbiAgICBjb25zdCB0b1NlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lcyA9IGZyb21Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG4gICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcblxuICAgIC8vIElmIHRoZSBub3RlcyBhcmUgbm90IGluIHRoZSBjdXJyZW50IHNjYWxlLCBpbmNyZWFzZSB0aGUgdGVuc2lvblxuICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTJcblxuICAgIGlmICh0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCAmJiB0b0dsb2JhbFNlbWl0b25lc1swXSAlIDEyICE9IGxlYWRpbmdUb25lKSB7XG4gICAgICAgIC8vIGluIFBBQywgd2Ugd2FudCB0aGUgbGVhZGluZyB0b25lIGluIHBhcnQgMCBpbiB0aGUgZG9taW5hbnRcbiAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsICAvLyBEXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLCAgLy8gRVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsICAvLyBHXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LCAgLy8gQVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgWyhjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgLSAxICsgMjQpICUgMTJdOiA2ICAvLyBGb3JjZSBhZGQgbGVhZGluZyB0b25lXG4gICAgfVxuXG4gICAgY29uc3QgdG9TY2FsZUluZGV4ZXMgPSB0b05vdGVzLm1hcChub3RlID0+IHNlbWl0b25lU2NhbGVJbmRleFtub3RlLnNlbWl0b25lXSk7XG5cbiAgICBpZiAocGFydDBNdXN0QmVUb25pYyAmJiB0b1NjYWxlSW5kZXhlc1swXSAhPSAwKSB7XG4gICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRQb3NzaWJsZUZ1bmN0aW9ucyA9IChjaG9yZDogQ2hvcmQpID0+IHtcbiAgICAgICAgY29uc3Qgcm9vdFNlbWl0b25lID0gY2hvcmQubm90ZXNbMF0uc2VtaXRvbmU7XG4gICAgICAgIGNvbnN0IHJvb3RTY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4W3Jvb3RTZW1pdG9uZV07XG5cbiAgICAgICAgY29uc3QgcG9zc2libGVUb0Z1bmN0aW9uczoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge1xuICAgICAgICAgICAgJ3RvbmljJzogdHJ1ZSxcbiAgICAgICAgICAgICdzdWItZG9taW5hbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ2RvbWluYW50JzogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgICBpZiAocm9vdFNjYWxlSW5kZXggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gZmFsc2U7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zWydzdWItZG9taW5hbnQnXSA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghWzEsIDNdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBpaSwgSVZcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnNbXCJzdWItZG9taW5hbnRcIl0gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVswLCA0LCA2XS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHsgLy8gViwgdmlpLCBJNjRcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChyb290U2NhbGVJbmRleCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiBJIGlzIG5vdCBzZWNvbmQgaW52ZXJzaW9uLCBpdCdzIG5vdCBkb21pbmFudFxuICAgICAgICAgICAgaWYgKCFpbnZlcnNpb25OYW1lIHx8ICFpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghWzBdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBJXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvb3RTY2FsZUluZGV4LFxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9uczogT2JqZWN0LmtleXMocG9zc2libGVUb0Z1bmN0aW9ucykuZmlsdGVyKGtleSA9PiBwb3NzaWJsZVRvRnVuY3Rpb25zW2tleV0pLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmIChuZXdDaG9yZCAmJiBwcmV2Q2hvcmQgJiYgcHJldlByZXZDaG9yZCkge1xuICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgPT0gcHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTYW1lIHJvb3RcbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxO1xuICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBTYW1lIHJvb3QgYXMgcHJldmlvdXMgY2hvcmRcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2UHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTYW1lIHJvb3QgYXMgcHJldmlvdXMgY2hvcmQgKERvbid0IGdvIGJhY2spXG4gICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZXdDaG9yZCAmJiBwcmV2Q2hvcmQpIHtcbiAgICAgICAgY29uc3QgZnJvbUZ1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKHByZXZDaG9yZCk7XG4gICAgICAgIGNvbnN0IHRvRnVuY3Rpb25zID0gZ2V0UG9zc2libGVGdW5jdGlvbnMobmV3Q2hvcmQpO1xuICAgICAgICBjb25zdCBwb3NzaWJsZVRvRnVuY3Rpb25zID0gdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9ucztcblxuICAgICAgICBjb25zdCBwcm9ncmVzc2lvbnMgPSBwcm9ncmVzc2lvbkNob2ljZXNbZnJvbUZ1bmN0aW9ucy5yb290U2NhbGVJbmRleF07XG4gICAgICAgIGlmIChwcm9ncmVzc2lvbnMpIHtcbiAgICAgICAgICAgIGxldCBnb29kID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb2dyZXNzaW9uIG9mIHByb2dyZXNzaW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChgJHtwcm9ncmVzc2lvbn1gID09IGAke3RvRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4fWApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGVyZmVjdCBwcm9ncmVzc2lvblxuICAgICAgICAgICAgICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvZ3Jlc3Npb24gPT0gXCJzdHJpbmdcIiAmJiB0b0Z1bmN0aW9ucy5wb3NzaWJsZVRvRnVuY3Rpb25zICYmIHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnMuaW5jbHVkZXMocHJvZ3Jlc3Npb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWdvb2QpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJzdWItZG9taW5hbnRcIikge1xuICAgICAgICAgICAgICAgIGlmICghcG9zc2libGVUb0Z1bmN0aW9ucy5pbmNsdWRlcyhcInN1Yi1kb21pbmFudFwiKSkgey8vICYmICFwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcG9zc2libGVUb0Z1bmN0aW9ucy5pbmNsdWRlcyhcImRvbWluYW50XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gYFdhbnRlZCAke3dhbnRlZEZ1bmN0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gNTsgIC8vIERvbWluYW50IGlzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJkb21pbmFudFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwb3NzaWJsZVRvRnVuY3Rpb25zLmluY2x1ZGVzKFwiZG9taW5hbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IGBXYW50ZWQgJHt3YW50ZWRGdW5jdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwidG9uaWNcIikge1xuICAgICAgICAgICAgICAgIGlmICghcG9zc2libGVUb0Z1bmN0aW9ucy5pbmNsdWRlcyhcInRvbmljXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBgV2FudGVkICR7d2FudGVkRnVuY3Rpb259YFxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgYnVpbGRUYWJsZXMsXG4gICAgU2NhbGUsXG4gICAgTm90ZSxcbn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBDaG9yZCwgTnVsbGFibGUsIERpdmlzaW9uZWRSaWNobm90ZXMsIFJpY2hOb3RlLCBCRUFUX0xFTkdUSCwgc2VtaXRvbmVTY2FsZUluZGV4IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFJhbmRvbUNob3JkR2VuZXJhdG9yIH0gZnJvbSBcIi4vcmFuZG9tY2hvcmRzXCI7XG5pbXBvcnQgeyBnZXRJbnZlcnNpb25zIH0gZnJvbSBcIi4vaW52ZXJzaW9uc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IGFkZE5vdGVCZXR3ZWVuLCBidWlsZFRvcE1lbG9keSB9IGZyb20gXCIuL25vbmNob3JkdG9uZXNcIjtcbmltcG9ydCB7IGFkZEhhbGZOb3RlcyB9IGZyb20gXCIuL2hhbGZub3Rlc1wiO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlU2NhbGVzIH0gZnJvbSBcIi4vYXZhaWxhYmxlc2NhbGVzXCI7XG5pbXBvcnQgeyBhZGRGb3JjZWRNZWxvZHksIEZvcmNlZE1lbG9keVJlc3VsdCB9IGZyb20gXCIuL2ZvcmNlZG1lbG9keVwiO1xuaW1wb3J0ICogYXMgdGltZSBmcm9tIFwiLi90aW1lclwiOyBcbmltcG9ydCB7IGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uIH0gZnJvbSBcIi4vY2hvcmRwcm9ncmVzc2lvblwiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5cbmNvbnN0IEdPT0RfQ0hPUkRfTElNSVQgPSAyMDA7XG5jb25zdCBHT09EX0NIT1JEU19QRVJfQ0hPUkQgPSAxMDtcbmNvbnN0IEJBRF9DSE9SRF9MSU1JVCA9IDUwMDtcbmNvbnN0IEJBRF9DSE9SRFNfUEVSX0NIT1JEID0gMjA7XG5cblxuY29uc3Qgc2xlZXBNUyA9IGFzeW5jIChtczogbnVtYmVyKTogUHJvbWlzZTxudWxsPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5jb25zdCBtYWtlQ2hvcmRzID0gYXN5bmMgKG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjazogTnVsbGFibGU8RnVuY3Rpb24+ID0gbnVsbCk6IFByb21pc2U8RGl2aXNpb25lZFJpY2hub3Rlcz4gPT4ge1xuICAgIC8vIGdlbmVyYXRlIGEgcHJvZ3Jlc3Npb25cbiAgICAvLyBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgZ2VuZXJhdGVzIHRoZSBlbnRpcmUgc29uZy5cbiAgICAvLyBUaGUgYmFzaWMgaWRlYSBpcyB0aGF0IFxuXG4gICAgLy8gVW50aWwgdGhlIGZpcnN0IElBQyBvciBQQUMsIG1lbG9keSBhbmQgcmh5dG0gaXMgcmFuZG9tLiAoVGhvdWdoIGVhY2ggY2FkZW5jZSBoYXMgaXQncyBvd24gbWVsb2RpYyBoaWdoIHBvaW50LilcblxuICAgIC8vIFRoaXMgbWVsb2R5IGFuZCByaHl0bSBpcyBwYXJ0aWFsbHkgc2F2ZWQgYW5kIHJlcGVhdGVkIGluIHRoZSBuZXh0IGNhZGVuY2VzLlxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpO1xuXG4gICAgbGV0IHJlc3VsdDogRGl2aXNpb25lZFJpY2hub3RlcyA9IHt9O1xuXG4gICAgbGV0IGRpdmlzaW9uQmFubmVkTm90ZXM6IHtba2V5OiBudW1iZXJdOiBBcnJheTxBcnJheTxOb3RlPj59ID0ge31cblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBsZXQgcHJldlJlc3VsdCA9IHJlc3VsdFtkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgbGV0IHByZXZDaG9yZCA9IHByZXZSZXN1bHQgPyBwcmV2UmVzdWx0WzBdLmNob3JkIDogbnVsbDtcbiAgICAgICAgbGV0IHByZXZOb3RlczogTm90ZVtdO1xuICAgICAgICBsZXQgcHJldkludmVyc2lvbk5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGN1cnJlbnRTY2FsZTogU2NhbGUgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBiYW5uZWROb3Rlc3MgPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uXTtcbiAgICAgICAgaWYgKHByZXZSZXN1bHQpIHtcbiAgICAgICAgICAgIHByZXZOb3RlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lID0gcmljaE5vdGUuaW52ZXJzaW9uTmFtZTtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHByZXZOb3RlcyA9IHByZXZOb3RlcztcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZDtcblxuXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoXCJkaXZpc2lvblwiLCBkaXZpc2lvbiwgcHJldkNob3JkID8gcHJldkNob3JkLnRvU3RyaW5nKCkgOiBcIm51bGxcIiwgXCIgc2NhbGUgXCIsIGN1cnJlbnRTY2FsZSA/IGN1cnJlbnRTY2FsZS50b1N0cmluZygpIDogXCJudWxsXCIpO1xuICAgICAgICBjb25zdCBjdXJyZW50QmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVwiLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlKTtcblxuICAgICAgICBjb25zdCByYW5kb21HZW5lcmF0b3IgPSBuZXcgUmFuZG9tQ2hvcmRHZW5lcmF0b3IocGFyYW1zKVxuICAgICAgICBsZXQgbmV3Q2hvcmQ6IE51bGxhYmxlPENob3JkPiA9IG51bGw7XG5cbiAgICAgICAgbGV0IGdvb2RDaG9yZHM6IFJpY2hOb3RlW11bXSA9IFtdXG4gICAgICAgIGNvbnN0IGJhZENob3Jkczoge3RlbnNpb246IFRlbnNpb24sIGNob3JkOiBzdHJpbmd9W10gPSBbXVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbU5vdGVzOiBBcnJheTxOb3RlPiA9IFtdO1xuXG4gICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgbGV0IHNraXBMb29wID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA9PSAxICYmIHByZXZOb3Rlcykge1xuICAgICAgICAgICAgLy8gRm9yY2Ugc2FtZSBjaG9yZCB0d2ljZVxuICAgICAgICAgICAgZ29vZENob3Jkcy5zcGxpY2UoMCwgZ29vZENob3Jkcy5sZW5ndGgpO1xuICAgICAgICAgICAgZ29vZENob3Jkcy5wdXNoKHByZXZOb3Rlcy5tYXAoKG5vdGUsIGluZGV4KSA9PiAoe1xuICAgICAgICAgICAgICAgIG5vdGU6IG5vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IEJFQVRfTEVOR1RILFxuICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZCxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgIH0gYXMgUmljaE5vdGUpKSk7XG4gICAgICAgICAgICBza2lwTG9vcCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIXNraXBMb29wICYmIGdvb2RDaG9yZHMubGVuZ3RoIDwgKGN1cnJlbnRCZWF0ICE9IDAgPyBHT09EX0NIT1JEX0xJTUlUIDogNSkpIHtcbiAgICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICAgIG5ld0Nob3JkID0gcmFuZG9tR2VuZXJhdG9yLmdldENob3JkKCk7XG4gICAgICAgICAgICBjb25zdCBjaG9yZExvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25zID4gMTAwMDAwIHx8ICFuZXdDaG9yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9vIG1hbnkgaXRlcmF0aW9ucywgZ29pbmcgYmFja1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYWluUGFyYW1zLmZvcmNlZENob3Jkcykge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmVhdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSAhPSAwIHx8ICFuZXdDaG9yZC50b1N0cmluZygpLmluY2x1ZGVzKCdtYWonKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgQyBtYWpvciBzY2FsZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFpblBhcmFtcy5mb3JjZWRDaG9yZHMgJiYgY3VycmVudFNjYWxlICYmIG5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9yY2VkQ2hvcmROdW0gPSBwYXJzZUludChtYWluUGFyYW1zLmZvcmNlZENob3Jkc1tjdXJyZW50QmVhdF0pO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4oZm9yY2VkQ2hvcmROdW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZW1pdG9uZVNjYWxlSW5kZXgoY3VycmVudFNjYWxlKVtuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZV0gIT0gKGZvcmNlZENob3JkTnVtIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGFsbEludmVyc2lvbnM7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlU2NhbGVzO1xuXG4gICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBnZXRBdmFpbGFibGVTY2FsZXMoe1xuICAgICAgICAgICAgICAgIGxhdGVzdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXM6IG5ld0Nob3JkLm5vdGVzLFxuICAgICAgICAgICAgICAgIGxvZ2dlcjogbmV3IExvZ2dlcihjaG9yZExvZ2dlciksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSAmJiAobWF4QmVhdHMgLSBjdXJyZW50QmVhdCA8IDMgfHwgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMgfHwgY3VycmVudEJlYXQgPCA1KSkge1xuICAgICAgICAgICAgICAgIC8vIERvbid0IGFsbG93IG90aGVyIHNjYWxlcyB0aGFuIHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVNjYWxlcyA9IGF2YWlsYWJsZVNjYWxlcy5maWx0ZXIocyA9PiBzLnNjYWxlLmVxdWFscyhjdXJyZW50U2NhbGUgYXMgU2NhbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdmFpbGFibGVTY2FsZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsbEludmVyc2lvbnMgPSBnZXRJbnZlcnNpb25zKHtcbiAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsIHByZXZOb3RlczogcHJldk5vdGVzLCBiZWF0OiBjdXJyZW50QmVhdCwgcGFyYW1zLCBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG1heEJlYXRzIC0gY3VycmVudEJlYXRcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaW52ZXJzaW9uUmVzdWx0IG9mIGFsbEludmVyc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgaW52ZXJzaW9uTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgICAgIGludmVyc2lvbkxvZ2dlci50aXRsZSA9IFtcIkludmVyc2lvbiBcIiwgYCR7aW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWV9YF07XG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXMuc3BsaWNlKDAsIHJhbmRvbU5vdGVzLmxlbmd0aCk7ICAvLyBFbXB0eSB0aGlzIGFuZCByZXBsYWNlIGNvbnRlbnRzXG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXMucHVzaCguLi5pbnZlcnNpb25SZXN1bHQubm90ZXMpO1xuICAgICAgICAgICAgICAgIGlmIChiYW5uZWROb3Rlc3MgJiYgYmFubmVkTm90ZXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJhbm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFubmVkTm90ZXMgb2YgYmFubmVkTm90ZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXMubGVuZ3RoICE9IHJhbmRvbU5vdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZG9tTm90ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tTm90ZXNbaV0udG9TdHJpbmcoKSAhPSBiYW5uZWROb3Rlc1tpXS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYW5uZWQgbm90ZXNcIiwgcmFuZG9tTm90ZXMubWFwKG4gPT4gbi50b1N0cmluZygpKSwgXCJiYW5uZWROb3Rlc3NcIiwgYmFubmVkTm90ZXNzLm1hcChuID0+IG4ubWFwKG4gPT4gbi50b1N0cmluZygpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdmFpbGFibGVTY2FsZSBvZiBhdmFpbGFibGVTY2FsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZHMubGVuZ3RoID49IEdPT0RfQ0hPUkRfTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbnNpb25QYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXM6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXREaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b05vdGVzOiByYW5kb21Ob3RlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY2FsZTogYXZhaWxhYmxlU2NhbGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbWF4QmVhdHMgLSBjdXJyZW50QmVhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2hvcmQsXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUmVzdWx0ID0gbmV3IFRlbnNpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24odGVuc2lvblJlc3VsdCwgdGVuc2lvblBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uUmVzdWx0LmdldFRvdGFsVGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgfSkgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VGVuc2lvbih0ZW5zaW9uUmVzdWx0LCB0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsYXRpb25XZWlnaHQgPSBwYXJzZUZsb2F0KChgJHtwYXJhbXMubW9kdWxhdGlvbldlaWdodCB8fCBcIjBcIn1gKSlcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IGF2YWlsYWJsZVNjYWxlLnRlbnNpb24gLyBNYXRoLm1heCgwLjAxLCBtb2R1bGF0aW9uV2VpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSAmJiAhYXZhaWxhYmxlU2NhbGUuc2NhbGUuZXF1YWxzKGN1cnJlbnRTY2FsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxIC8gTWF0aC5tYXgoMC4wMSwgbW9kdWxhdGlvbldlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kdWxhdGlvbldlaWdodCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhCZWF0cyAtIGN1cnJlbnRCZWF0IDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExhc3QgMiBiYXJzLCBkb24ndCBjaGFuZ2Ugc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgY2hhbmdlIHNjYWxlIGluIGxhc3QgMiBiZWF0cyBvZiBjYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmVhdCA8IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBjaGFuZ2Ugc2NhbGUgaW4gZmlyc3QgNSBiZWF0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbnNpb24gPSB0ZW5zaW9uUmVzdWx0LmdldFRvdGFsVGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnaXZlVVAgPSBwcm9ncmVzc0NhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVVUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVsb2R5UmVzdWx0OiBGb3JjZWRNZWxvZHlSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIHRoaXMgcG9zc2libGUgdG8gd29yayB3aXRoIHRoZSBtZWxvZHk/XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgYWRkIG1lbG9keSBub3RlcyBhbmQgTkFDcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbG9keVJlc3VsdCA9IGFkZEZvcmNlZE1lbG9keSh0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQuZm9yY2VkTWVsb2R5ICs9IG1lbG9keVJlc3VsdC50ZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lbG9keVJlc3VsdC5uYWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm5hYyA9IG1lbG9keVJlc3VsdC5uYWM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVsb2R5UmVzdWx0LmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0LmNvbW1lbnQgPSBtZWxvZHlSZXN1bHQuY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24gPSB0ZW5zaW9uUmVzdWx0LmdldFRvdGFsVGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTG9nZ2VyLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aGlzQ2hvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdvb2RDaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZCAmJiBnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNDaG9yZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9yZENvdW50ID49IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHdvcnN0IHByZXZpb3VzIGdvb2RDaG9yZCBpZiB0aGlzIGhhcyBsZXNzIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RDaG9yZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcnN0Q2hvcmRUZW5zaW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdvb2RDaG9yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZENob3JkID0gZ29vZENob3Jkc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZCAmJiBnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGdvb2RDaG9yZFswXS50ZW5zaW9uPy50b3RhbFRlbnNpb24gfHwgOTk5KSA8IHdvcnN0Q2hvcmRUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yc3RDaG9yZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcnN0Q2hvcmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGdvb2RDaG9yZHNbd29yc3RDaG9yZF1bMF0udGVuc2lvbj8udG90YWxUZW5zaW9uIHx8IDk5OSkgPiB0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHJlbW92ZSB0aGF0IGluZGV4LCBhZGQgYSBuZXcgb25lIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSh3b3JzdENob3JkLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9yZENvdW50IDwgR09PRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZENob3Jkcy5wdXNoKHJhbmRvbU5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IG5vdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBCRUFUX0xFTkdUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGVuc2lvblJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmljaE5vdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGVuc2lvblJlc3VsdC50b3RhbFRlbnNpb24gPCAxMDAgJiYgYmFkQ2hvcmRzLmxlbmd0aCA8IEJBRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNob3JkQ291bnRJbkJhZENob3JkcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJhZENob3JkIG9mIGJhZENob3Jkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWRDaG9yZC5jaG9yZCA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkQ291bnRJbkJhZENob3JkcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaG9yZENvdW50SW5CYWRDaG9yZHMgPCBCQURfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZENob3Jkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLnRvU3RyaW5nKCkgKyBcIixcIiArIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAvLyBGb3IgYXZhaWxhYmxlIHNjYWxlcyBlbmRcbiAgICAgICAgICAgIH0gIC8vIEZvciB2b2ljZWxlYWRpbmcgcmVzdWx0cyBlbmRcbiAgICAgICAgfSAgLy8gV2hpbGUgZW5kXG4gICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhZENob3JkIG9mIGJhZENob3Jkcykge1xuICAgICAgICAgICAgICAgIGJhZENob3JkLnRlbnNpb24ucHJpbnQoXCJCYWQgY2hvcmQgXCIsIGJhZENob3JkLmNob3JkLCBcIiAtIFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHNsZWVwTVMoMSk7XG4gICAgICAgICAgICAvLyBHbyBiYWNrIHRvIHByZXZpb3VzIGNob3JkLCBhbmQgbWFrZSBpdCBhZ2FpblxuICAgICAgICAgICAgaWYgKGRpdmlzaW9uID49IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgICAgIC8vIE1hcmsgdGhlIHByZXZpb3VzIGNob3JkIGFzIGJhbm5lZFxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Jhbm5lZE5vdGVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdCYW5uZWROb3Rlc1tub3RlLnBhcnRJbmRleF0gPSBub3RlLm5vdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgcHJldmlvdXMgY2hvcmQgKHdoZXJlIHdlIGFyZSBnb2luZyB0bylcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGFueSBub3RlcyBhZnRlciB0aGF0IGFsc29cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSDsgaSA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5sZW5ndGggPiAxMCAmJiByZXN1bHRbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRvbyBtYW55IGJhbnMsIGdvIGJhY2sgZnVydGhlci4gUmVtb3ZlIHRoZXNlIGJhbnMgc28gdGhleSBkb24ndCBoaW5kZXIgbGF0ZXIgcHJvZ3Jlc3MuXG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEhcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3QmFubmVkTm90ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmFubmVkTm90ZXNbbm90ZS5wYXJ0SW5kZXhdID0gbm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSDsgaSA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZmFpbGVkIHJpZ2h0IGF0IHRoZSBzdGFydC5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQgLSAxLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChnaXZlVVApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENob29zZSB0aGUgYmVzdCBjaG9yZCBmcm9tIGdvb2RDaG9yZHNcbiAgICAgICAgbGV0IGJlc3RDaG9yZCA9IGdvb2RDaG9yZHNbMF07XG4gICAgICAgIGxldCBiZXN0VGVuc2lvbiA9IDk5OTtcbiAgICAgICAgZm9yIChjb25zdCBjaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICBpZiAoY2hvcmRbMF0udGVuc2lvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hvcmRbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPCBiZXN0VGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBiZXN0Q2hvcmQgPSBjaG9yZDtcbiAgICAgICAgICAgICAgICAgICAgYmVzdFRlbnNpb24gPSBjaG9yZFswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hvcmRbMF0udGVuc2lvbi5wcmludChjaG9yZFswXS5jaG9yZCA/IGNob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgOiBcIj9DaG9yZD9cIiwgY2hvcmRbMF0uaW52ZXJzaW9uTmFtZSwgXCJiZXN0IHRlbnNpb246IFwiLCBiZXN0VGVuc2lvbiwgXCI6IFwiLCBiZXN0Q2hvcmQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbZGl2aXNpb25dID0gYmVzdENob3JkO1xuICAgICAgICBpZiAoYmVzdENob3JkWzBdPy50ZW5zaW9uPy5uYWMpIHtcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVxdWlyZWQgTm9uIENob3JkIFRvbmVcbiAgICAgICAgICAgIGFkZE5vdGVCZXR3ZWVuKGJlc3RDaG9yZFswXS50ZW5zaW9uLm5hYywgZGl2aXNpb24sIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIDAsIHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQsIHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmFuZG9tR2VuZXJhdG9yLmNsZWFuVXAoKTtcbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VNdXNpYyhwYXJhbXM6IE1haW5NdXNpY1BhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjazogTnVsbGFibGU8RnVuY3Rpb24+ID0gbnVsbCkge1xuICAgIGxldCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcbiAgICBkaXZpc2lvbmVkTm90ZXMgPSBhd2FpdCBtYWtlQ2hvcmRzKHBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjayk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG5cbiAgICAvLyBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSBuZXdWb2ljZUxlYWRpbmdOb3RlcyhjaG9yZHMsIHBhcmFtcyk7XG4gICAgLy8gYnVpbGRUb3BNZWxvZHkoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIC8vIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzOiBkaXZpc2lvbmVkTm90ZXMsXG4gICAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTWVsb2R5KGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgLy8gUmVtb3ZlIG9sZCBtZWxvZHkgYW5kIG1ha2UgYSBuZXcgb25lXG4gICAgY29uc3QgbWF4QmVhdHMgPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKClcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbisrKSB7XG4gICAgICAgIGNvbnN0IG9uQmVhdCA9IGRpdmlzaW9uICUgQkVBVF9MRU5HVEggPT0gMDtcbiAgICAgICAgaWYgKCFvbkJlYXQpIHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBbXVxuICAgICAgICB9IGVsc2UgaWYgKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gJiYgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZvckVhY2gocmljaE5vdGUgPT4ge1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLmR1cmF0aW9uID0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmljaE5vdGUudGllID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIC8vIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcyk7XG4gICAgLy8gYWRkRWlnaHRoTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG4gICAgLy8gYWRkSGFsZk5vdGVzKGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcylcbn1cblxuZXhwb3J0IHsgYnVpbGRUYWJsZXMgfSIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IGFkZE5vdGVCZXR3ZWVuLCBmaW5kTkFDcywgRmluZE5vbkNob3JkVG9uZVBhcmFtcywgTm9uQ2hvcmRUb25lIH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiwgVGVuc2lvblBhcmFtcyB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2V0TWVsb2R5TmVlZGVkVG9uZXMsIGdldFJpY2hOb3RlLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIEZvcmNlZE1lbG9keVJlc3VsdCA9IHtcbiAgICBjb21tZW50OiBzdHJpbmcsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIG5hYzogTm9uQ2hvcmRUb25lIHwgbnVsbCxcbn1cblxuXG5cbmV4cG9ydCBjb25zdCBhZGRGb3JjZWRNZWxvZHkgPSAodmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogRm9yY2VkTWVsb2R5UmVzdWx0ID0+IHtcbiAgICAvKlxuICAgIFxuICAgICovXG4gICAgY29uc3QgeyB0b05vdGVzLCBjdXJyZW50U2NhbGUsIHBhcmFtcywgbWFpblBhcmFtcywgYmVhdERpdmlzaW9uIH0gPSB2YWx1ZXM7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKHBhcmFtcyk7XG4gICAgY29uc3QgY2hvcmQgPSB2YWx1ZXMubmV3Q2hvcmQ7XG4gICAgY29uc3QgZGl2aXNpb25lZE5vdGVzID0gdmFsdWVzLmRpdmlzaW9uZWROb3RlcyB8fCB7fTtcbiAgICBjb25zdCBtYXhEaXZpc2lvbiA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKSAqIEJFQVRfTEVOR1RIO1xuICAgIGNvbnN0IHRlbnNpb246IEZvcmNlZE1lbG9keVJlc3VsdCA9IHtcbiAgICAgICAgY29tbWVudDogXCJcIixcbiAgICAgICAgdGVuc2lvbjogMCxcbiAgICAgICAgbmFjOiBudWxsLFxuICAgIH1cblxuICAgIGNvbnN0IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zID0gZ2V0TWVsb2R5TmVlZGVkVG9uZXMobWFpblBhcmFtcyk7XG4gICAgY29uc3QgbWVsb2R5RXhpc3RzID0gKG1haW5QYXJhbXMuZm9yY2VkTWVsb2R5IHx8IFtdKS5sZW5ndGggPiAwO1xuICAgIGlmICghbWVsb2R5RXhpc3RzKSB7XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnREaXZpc2lvbiA9IGJlYXREaXZpc2lvbjtcbiAgICBjb25zdCBjYWRlbmNlRGl2aXNpb24gPSBjdXJyZW50RGl2aXNpb24gLSBwYXJhbXMuY2FkZW5jZVN0YXJ0RGl2aXNpb247XG5cbiAgICAvLyBTdHJvbmcgYmVhdCBub3RlIGlzIHN1cHBvc2VkIHRvIGJlIHRoaXNcbiAgICBsZXQgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uXTtcbiAgICBsZXQgbmV3TWVsb2R5VG9uZURpdmlzaW9uID0gY2FkZW5jZURpdmlzaW9uO1xuICAgIGlmICghbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSB0b25lIGZvciB0aGlzIGRpdmlzaW9uLCB0aGUgcHJldmlvdXMgdG9uZSBtdXN0IGJlIGxlbmd0aHkuIFVzZSBpdC5cbiAgICAgICAgZm9yIChsZXQgaSA9IGNhZGVuY2VEaXZpc2lvbiAtIDE7IGkgPj0gY2FkZW5jZURpdmlzaW9uIC0gQkVBVF9MRU5HVEggKiAyOyBpLS0pIHtcbiAgICAgICAgICAgIG5ld01lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2ldO1xuICAgICAgICAgICAgaWYgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIG5ld01lbG9keVRvbmVEaXZpc2lvbiA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24gfHwgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cIjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgY29uc3QgbmV3TWVsb2R5U2VtaXRvbmUgPSBjdXJyZW50U2NhbGUubm90ZXNbbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdLnNlbWl0b25lICsgMSAtIDE7ICAvLyBDb252ZXJ0IHRvIG51bWJlclxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAoKHgpID0+IHguc2VtaXRvbmUpO1xuXG4gICAgLy8gQ2FuIHdlIHR1cm4gdGhpcyBub3RlIGludG8gYSBub24tY2hvcmQgdG9uZT8gQ2hlY2sgdGhlIHByZXZpb3VzIGFuZCBuZXh0IG5vdGUuXG4gICAgbGV0IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgbGV0IG5leHRNZWxvZHlUb25lRGl2aXNpb247XG4gICAgZm9yIChsZXQgaSA9IG5ld01lbG9keVRvbmVEaXZpc2lvbiArIDE7IGkgPD0gbWF4RGl2aXNpb247IGkrKykge1xuICAgICAgICBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbaV07XG4gICAgICAgIGlmIChuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgICAgICBuZXh0TWVsb2R5VG9uZURpdmlzaW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uIHx8IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24udG9uZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cbiAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJObyBtZWxvZHkgZm91bmQgYXQgYWxsLiBHaXZlIHVwLlwiO1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG5cbiAgICAvLyBMZXQncyBub3QgY2FyZSB0aGF0IG11Y2ggaWYgdGhlIHdlYWsgYmVhdCBub3RlIGlzIG5vdCBjb3JyZWN0LiBJdCBqdXN0IGFkZHMgdGVuc2lvbiB0byB0aGUgcmVzdWx0LlxuICAgIC8vIFVOTEVTUyBpdCdzIGluIHRoZSBtZWxvZHkgYWxzby5cblxuICAgIC8vIFdoYXQgTkFDIGNvdWxkIHdvcms/XG4gICAgLy8gQ29udmVydCBhbGwgdmFsdWVzIHRvIGdsb2JhbFNlbWl0b25lc1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZSh0b05vdGVzWzBdKVxuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAoKHgpID0+IGdsb2JhbFNlbWl0b25lKHgpKTtcbiAgICBsZXQgcHJldlJpY2hOb3RlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50RGl2aXNpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBwcmV2UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKS5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IDApWzBdO1xuICAgICAgICBpZiAocHJldlJpY2hOb3RlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmV2QmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tjdXJyZW50RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gMClbMF07XG4gICAgbGV0IHByZXZCZWF0R2xvYmFsU2VtaXRvbmUgPSBwcmV2QmVhdFJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldkJlYXRSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG5cbiAgICBsZXQgcHJldlBhcnQxUmljaE5vdGU7XG4gICAgZm9yIChsZXQgaSA9IGN1cnJlbnREaXZpc2lvbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHByZXZQYXJ0MVJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSAxKVswXTtcbiAgICAgICAgaWYgKHByZXZQYXJ0MVJpY2hOb3RlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHByZXZpb3VzIG5vdGUgZG9lc24ndCBleGlzdCwgdGhpcyBpcyBhY3R1YWxseSBlYXNpZXIuXG4gICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gcHJldlJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldlJpY2hOb3RlLm5vdGUpIDogbnVsbDtcblxuICAgIC8vIFRyeWluZyB0byBmaWd1cmUgb3V0IHRoZSBtZWxvZHkgZGlyZWN0aW9uLi4uIFdlIHNob3VsZCBwdXQgb2N0YXZlcyBpbiB0aGUgZm9yY2VkIG1lbG9keSBzdHJpbmcuLi5cbiAgICBjb25zdCBjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbiA9IHByZXZCZWF0R2xvYmFsU2VtaXRvbmUgfHwgZnJvbUdsb2JhbFNlbWl0b25lIHx8IHRvR2xvYmFsU2VtaXRvbmU7XG5cbiAgICBsZXQgY2xvc2VzdENvcnJlY3RHVG9uZSA9IG5ld01lbG9keVNlbWl0b25lO1xuICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAoTWF0aC5hYnMoY2xvc2VzdENvcnJlY3RHVG9uZSAtIGNsb3Nlc3RDb3JyZWN0R1RvbmVCYXNlZE9uKSA+IDYgJiYgY2xvc2VzdENvcnJlY3RHVG9uZSA8PSBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICBpdGVyYXRpb25zKys7IGlmIChpdGVyYXRpb25zID4gMTAwKSB7IGRlYnVnZ2VyOyAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICBjbG9zZXN0Q29ycmVjdEdUb25lICs9IDEyICogTWF0aC5zaWduKGNsb3Nlc3RDb3JyZWN0R1RvbmVCYXNlZE9uIC0gY2xvc2VzdENvcnJlY3RHVG9uZSk7XG4gICAgfVxuXG4gICAgbGV0IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgaWYgKG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dENvcnJlY3RHdG9uZSA9IGdsb2JhbFNlbWl0b25lKGN1cnJlbnRTY2FsZS5ub3Rlc1tuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdKSAlIDEyO1xuICAgICAgICBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKG5leHRDb3JyZWN0R3RvbmUgLSBjbG9zZXN0Q29ycmVjdEdUb25lKSA+IDYgJiYgbmV4dENvcnJlY3RHdG9uZSA8PSBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrOyBpZiAoaXRlcmF0aW9ucyA+IDEwMCkgeyBkZWJ1Z2dlcjsgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICAgICAgbmV4dENvcnJlY3RHdG9uZSArPSAxMiAqIE1hdGguc2lnbihjbG9zZXN0Q29ycmVjdEdUb25lIC0gbmV4dENvcnJlY3RHdG9uZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXh0Q29ycmVjdEd0b25lIHx8ICFuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIC8vIElmIG1lbG9keSBoYXMgZW5kZWQsIHVzZSBjdXJyZW50IG1lbG9keSB0b25lLlxuICAgICAgICBuZXh0Q29ycmVjdEd0b25lID0gY2xvc2VzdENvcnJlY3RHVG9uZTtcbiAgICAgICAgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbjtcbiAgICB9XG5cbiAgICBsZXQgbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBtZWxvZHlUb25lc0FuZER1cmF0aW9uc1tjYWRlbmNlRGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgaWYgKCFuZXh0QmVhdE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICBuZXh0QmVhdE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgfVxuICAgIGxldCBuZXh0QmVhdENvcnJlY3RHVG9uZTtcbiAgICBpZiAobmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dEJlYXRDb3JyZWN0R1RvbmUgPSBnbG9iYWxTZW1pdG9uZShjdXJyZW50U2NhbGUubm90ZXNbbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24udG9uZV0pICUgMTI7XG4gICAgICAgIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAoTWF0aC5hYnMobmV4dEJlYXRDb3JyZWN0R1RvbmUgLSBuZXh0Q29ycmVjdEd0b25lKSA+IDYgJiYgbmV4dEJlYXRDb3JyZWN0R1RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25zKysgPiAxMDApIHsgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICAgICAgbmV4dEJlYXRDb3JyZWN0R1RvbmUgKz0gMTIgKiBNYXRoLnNpZ24obmV4dENvcnJlY3RHdG9uZSAtIG5leHRCZWF0Q29ycmVjdEdUb25lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIDE6IHRoZSBwcmV2aW91cyBub3RlLCAyOiB3aGF0IHRoZSBjdXJyZW50IG5vdGUgc2hvdWxkIGJlLCAzOiB3aGF0IHRoZSBuZXh0IG5vdGUgc2hvdWxkIGJlLlxuICAgIC8vIEJhc2VkIG9uIHRoZSByZXF1aXJlZCBkdXJhdGlvbnMsIHdlIGhhdmUgc29tZSBjaG9pY2VzOlxuXG4gICAgLy8gMS4gQmVhdCBtZWxvZHkgaXMgYSBxdWFydGVyLiBUaGlzIGlzIHRoZSBlYXNpZXN0IGNhc2UuXG4gICAgLy8gSGVyZSB3ZSBjYW4gYXQgdGhlIG1vc3QgdXNlIGEgOHRoLzh0aCBOQUMgb24gdGhlIHN0cm9uZyBiZWF0LlxuICAgIC8vIFRob3VnaCwgdGVuc2lvbiBpcyBhZGRlZC5cblxuICAgIC8vIDIuIEN1cnJlbnQgYmVhdCBtZWxvZHkgaXMgOHRoIGFuZCA4dGguIEJvdGggbm90ZXMgTVVTVCBiZSBjb3JyZWN0LlxuICAgIC8vIEJhc2Ugb24gdGhlIG5leHQgbm90ZSB3ZSBjYW4gdXNlIHNvbWUgTkFDcy4gVGhpcyBpcyB3aGVyZSB0aGUgd2VhayBiZWF0IE5BQ3MgY29tZSBpbi5cblxuICAgIC8vIDMuIEN1cnJlbnQgYmVhdCBtZWxvZHkgaXMgYSBoYWxmIG5vdGUuIFdlIGNhbiB1c2UgYSBzdHJvbmcgYmVhdCBOQUMuXG4gICAgLy8gVGVuc2lvbiBpcyBhZGRlZC5cblxuICAgIC8vIEhhcmRlciBjYXNlcywgc3VjaCBhcyBzeW5jb3BhdGlvbiwgYXJlIG5vdCBoYW5kbGVkLiB5ZXQuXG5cbiAgICBsZXQgcGFydDFNYXhHVG9uZSA9IE1hdGgubWF4KHRvR2xvYmFsU2VtaXRvbmVzWzFdLCBwcmV2UGFydDFSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZQYXJ0MVJpY2hOb3RlLm5vdGUpIDogMCk7XG5cbiAgICBjb25zdCBuYWNQYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge1xuICAgICAgICBmcm9tR1RvbmU6IGZyb21HbG9iYWxTZW1pdG9uZSB8fCBjbG9zZXN0Q29ycmVjdEdUb25lLFxuICAgICAgICB0aGlzQmVhdEdUb25lOiB0b0dsb2JhbFNlbWl0b25lLFxuICAgICAgICBuZXh0QmVhdEdUb25lOiBuZXh0QmVhdENvcnJlY3RHVG9uZSxcbiAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgY2hvcmQ6IGNob3JkLFxuICAgICAgICBnVG9uZUxpbWl0czogW3BhcnQxTWF4R1RvbmUsIDEyN10sICAvLyBUT0RPXG4gICAgICAgIHdhbnRlZEdUb25lczogW10sXG4gICAgfVxuXG4gICAgY29uc3QgZWVTdHJvbmdNb2RlID0gKFxuICAgICAgICBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggfHxcbiAgICAgICAgKFxuICAgICAgICAgICAgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIgJiYgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIpICYmXG4gICAgICAgICAgICBjbG9zZXN0Q29ycmVjdEdUb25lICE9IHRvR2xvYmFsU2VtaXRvbmVcbiAgICAgICAgKVxuICAgIClcblxuICAgIGlmIChlZVN0cm9uZ01vZGUpIHtcbiAgICAgICAgaWYgKGNsb3Nlc3RDb3JyZWN0R1RvbmUgPT0gdG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29ycmVjdCBub3RlLiBObyB0ZW5zaW9uLlxuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJDb3JyZWN0IHF1YXJ0ZXIgbm90ZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWRkIGEgcmlnaHQgTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC5cbiAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1swXSA9IGNsb3Nlc3RDb3JyZWN0R1RvbmU7XG4gICAgICAgIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgICAgICBuYWNQYXJhbXMud2FudGVkR1RvbmVzWzFdID0gbmV4dENvcnJlY3RHdG9uZTtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lICE9IG5leHRDb3JyZWN0R3RvbmUpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgSW5Db3JyZWN0IDh0aC84dGggbm90ZSwgJHtnVG9uZVN0cmluZyh0b0dsb2JhbFNlbWl0b25lKX0gIT0gJHtnVG9uZVN0cmluZyhuZXh0Q29ycmVjdEd0b25lKX1gO1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmFjUGFyYW1zLnNwbGl0TW9kZSA9IFwiRUVcIlxuICAgICAgICBjb25zdCBuYWMgPSBmaW5kTkFDcyhuYWNQYXJhbXMgYXMgRmluZE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgIGlmICghbmFjKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgTm8gTkFDIGZvdW5kOiB3YW50ZWRUb25lczogJHsobmFjUGFyYW1zLndhbnRlZEdUb25lcyBhcyBudW1iZXJbXSkubWFwKHRvbmUgPT4gZ1RvbmVTdHJpbmcodG9uZSkpfWAgKyBgJHtnVG9uZVN0cmluZyhuYWNQYXJhbXMudGhpc0JlYXRHVG9uZSl9LCAke2dUb25lU3RyaW5nKG5leHRDb3JyZWN0R3RvbmUpfSwgJHtnVG9uZVN0cmluZyhuYWNQYXJhbXMubmV4dEJlYXRHVG9uZSl9YDtcbiAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbiArPSAxMDA7XG4gICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdOb3RlR1RvbmUgPSBnbG9iYWxTZW1pdG9uZShuYWMubm90ZSk7XG4gICAgICAgIC8vIEdyZWF0Li4uIFdlIGNhbiBhZGQgYSBjb3JyZWN0IDh0aCBvbiB0aGUgc3Ryb25nIGJlYXQhXG4gICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAvLyB0ZW5zaW9uLmNvbW1lbnQgPSBgQWRkaW5nIE5BQyBvbiBzdHJvbmcgYmVhdDogJHtnVG9uZVN0cmluZyhnbG9iYWxTZW1pdG9uZShuYWMubm90ZSkpfSB0byBkaXZpc2lvbiAke2N1cnJlbnREaXZpc2lvbn0sIHdhbnRlZEd0b25lczogJHtuYWNQYXJhbXMud2FudGVkR1RvbmVzLm1hcChnVG9uZVN0cmluZyl9YDtcbiAgICAgICAgdGVuc2lvbi5uYWMgPSBuYWM7XG4gICAgICAgIHRlbnNpb24udGVuc2lvbiArPSA1OyAvLyBOb3QgdGhhdCBncmVhdCwgYnV0IGl0J3MgYmV0dGVyIHRoYW4gbm90aGluZy5cbiAgICB9IGVsc2UgaWYgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIgJiYgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWRkIGEgcmlnaHQgTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC4gYW5kIGEgcmlnaHQgbmFjIG9uIHdlYWsgYmVhdFxuICAgICAgICBpZiAoY2xvc2VzdENvcnJlY3RHVG9uZSA9PSB0b0dsb2JhbFNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTdHJvbmcgYmVhdCBpcyBhbHJlYWR5IGNvcnJlY3QuIE5lZWQgYSBub3RlIG9uIHdlYWsgYmVhdFxuICAgICAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1sxXSA9IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgICAgICAgICBuYWNQYXJhbXMuc3BsaXRNb2RlID0gXCJFRVwiXG4gICAgICAgICAgICBjb25zdCBuYWMgPSBmaW5kTkFDcyhuYWNQYXJhbXMgYXMgRmluZE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgICAgICBpZiAoIW5hYykge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gTkFDIGZvdW5kIGZvciBxdWFydGVyIG5vdGVcIjtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3Tm90ZUdUb25lID0gZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpO1xuICAgICAgICAgICAgLy8gR3JlYXQuLi4gV2UgY2FuIGFkZCBhIGNvcnJlY3QgOHRoIG9uIHRoZSBzdHJvbmcgYmVhdCFcbiAgICAgICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAgICAgLy8gdGVuc2lvbi5jb21tZW50ID0gYEFkZGluZyB3ZWFrIEVFIE5BQyAke2dUb25lU3RyaW5nKGdsb2JhbFNlbWl0b25lKG5hYy5ub3RlKSl9IHRvIGRpdmlzaW9uICR7Y3VycmVudERpdmlzaW9ufSwgd2FudGVkR3RvbmVzOiAke25hY1BhcmFtcy53YW50ZWRHVG9uZXMubWFwKGdUb25lU3RyaW5nKX1gO1xuICAgICAgICAgICAgdGVuc2lvbi5uYWMgPSBuYWM7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGFic29sdXRlbHkgcGVyZmVjdCwgYm90aCBub3RlcyBhcmUgY29ycmVjdC4gKG5vIHRlbnNpb24hKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2VsbCwgbm8gY2FuIGRvIHRoZW4gSSBndWVzcy5cbiAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiY2xvc2VzdENvcnJlY3RHVG9uZSAhPSB0b0dsb2JhbFNlbWl0b25lXCI7XG4gICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG5cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IGAke25ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbn0gIT0gJHtCRUFUX0xFTkdUSH1gO1xuICAgIH1cbiAgICBcbiAgICB0ZW5zaW9uLnRlbnNpb24gPSAwO1xuICAgIHJldHVybiB0ZW5zaW9uO1xufSIsImltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBDaG9yZCwgZ2xvYmFsU2VtaXRvbmUsIGdUb25lU3RyaW5nLCBzZW1pdG9uZURpc3RhbmNlLCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgIGdUb25lRGlmZnM6IEFycmF5PEFycmF5PG51bWJlcj4+LFxuICAgIG5vdGVzOiB7W2tleTogbnVtYmVyXTogTm90ZX0sXG4gICAgcmF0aW5nOiBudW1iZXIsXG4gICAgaW52ZXJzaW9uTmFtZTogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBTaW1wbGVJbnZlcnNpb25SZXN1bHQgPSB7XG4gICAgbm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIHJhdGluZzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU6IHN0cmluZyxcbn1cblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2lvbnMgPSAodmFsdWVzOiB7XG4gICAgICAgIGNob3JkOiBDaG9yZCwgcHJldk5vdGVzOiBBcnJheTxOb3RlPiwgYmVhdDogbnVtYmVyLCBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgICAgICBsb2dnZXI6IExvZ2dlciwgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbnVtYmVyXG4gICAgfSk6IEFycmF5PFNpbXBsZUludmVyc2lvblJlc3VsdD4gPT4ge1xuICAgIGNvbnN0IHtjaG9yZCwgcHJldk5vdGVzLCBiZWF0LCBwYXJhbXMsIGxvZ2dlciwgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZ30gPSB2YWx1ZXM7XG4gICAgLy8gUmV0dXJuIE5vdGVzIGluIHRoZSBDaG9yZCB0aGF0IGFyZSBjbG9zZXN0IHRvIHRoZSBwcmV2aW91cyBub3Rlc1xuICAgIC8vIEZvciBlYWNoIHBhcnRcblxuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhwYXJhbXMpO1xuXG4gICAgLy8gQWRkIGEgcmVzdWx0IGZvciBlYWNoIHBvc3NpYmxlIGludmVyc2lvblxuICAgIGNvbnN0IHJldDogQXJyYXk8U2ltcGxlSW52ZXJzaW9uUmVzdWx0PiA9IFtdO1xuXG4gICAgbGV0IGxhc3RCZWF0R2xvYmFsU2VtaXRvbmVzID0gWy4uLnN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzXVxuICAgIGlmIChwcmV2Tm90ZXMpIHtcbiAgICAgICAgbGFzdEJlYXRHbG9iYWxTZW1pdG9uZXMgPSBwcmV2Tm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuICAgIH1cblxuICAgIGlmICghY2hvcmQpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChjaG9yZCkge1xuICAgICAgICAvLyBGb3IgZWFjaCBiZWF0LCB3ZSB0cnkgdG8gZmluZCBhIGdvb2QgbWF0Y2hpbmcgc2VtaXRvbmUgZm9yIGVhY2ggcGFydC5cblxuICAgICAgICAvLyBSdWxlczpcbiAgICAgICAgLy8gV2l0aFx0cm9vdCBwb3NpdGlvbiB0cmlhZHM6IGRvdWJsZSB0aGUgcm9vdC4gXG5cbiAgICAgICAgLy8gV2l0aCBmaXJzdCBpbnZlcnNpb24gdHJpYWRzOiBkb3VibGUgdGhlIHJvb3Qgb3IgNXRoLCBpbiBnZW5lcmFsLiBJZiBvbmUgbmVlZHMgdG8gZG91YmxlIFxuICAgICAgICAvLyB0aGUgM3JkLCB0aGF0IGlzIGFjY2VwdGFibGUsIGJ1dCBhdm9pZCBkb3VibGluZyB0aGUgbGVhZGluZyB0b25lLlxuXG4gICAgICAgIC8vIFdpdGggc2Vjb25kIGludmVyc2lvbiB0cmlhZHM6IGRvdWJsZSB0aGUgZmlmdGguIFxuXG4gICAgICAgIC8vIFdpdGggIHNldmVudGggIGNob3JkczogIHRoZXJlICBpcyAgb25lIHZvaWNlICBmb3IgIGVhY2ggIG5vdGUsICBzbyAgZGlzdHJpYnV0ZSBhcyAgZml0cy4gSWYgIG9uZSBcbiAgICAgICAgLy8gbXVzdCBvbWl0IGEgbm90ZSBmcm9tIHRoZSBjaG9yZCwgdGhlbiBvbWl0IHRoZSA1dGguXG5cbiAgICAgICAgY29uc3QgZmlyc3RJbnRlcnZhbCA9IHNlbWl0b25lRGlzdGFuY2UoY2hvcmQubm90ZXNbMF0uc2VtaXRvbmUsIGNob3JkLm5vdGVzWzFdLnNlbWl0b25lKVxuICAgICAgICBjb25zdCB0aGlyZElzR29vZCA9IGZpcnN0SW50ZXJ2YWwgPT0gMyB8fCBmaXJzdEludGVydmFsID09IDQ7XG4gICAgICAgIGxvZ2dlci5sb2coXCJub3RlczogXCIsIGNob3JkLm5vdGVzLm1hcChuID0+IG4udG9TdHJpbmcoKSkpO1xuXG4gICAgICAgIC8vIERlcGVuZGluZyBvbiB0aGUgaW52ZXJzaW9uIGFuZCBjaG9yZCB0eXBlLCB3ZSdyZSBkb2luZyBkaWZmZXJlbnQgdGhpbmdzXG5cbiAgICAgICAgbGV0IGludmVyc2lvbk5hbWVzID0gW1wicm9vdFwiLCBcInJvb3QtZmlmdGhcIiwgXCJmaXJzdC1yb290XCIsIFwiZmlyc3QtdGhpcmRcIiwgXCJmaXJzdC1maWZ0aFwiLCBcInNlY29uZFwiXTtcbiAgICAgICAgbGV0IGNvbWJpbmF0aW9uQ291bnQgPSAzICogMiAqIDE7XG4gICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgc2tpcEZpZnRoSW5kZXggPSAwOyBza2lwRmlmdGhJbmRleCA8IDI7IHNraXBGaWZ0aEluZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgaW52ZXJzaW9uSW5kZXg9MDsgaW52ZXJzaW9uSW5kZXg8aW52ZXJzaW9uTmFtZXMubGVuZ3RoOyBpbnZlcnNpb25JbmRleCsrKSB7XG4gICAgICAgIGZvciAobGV0IGNvbWJpbmF0aW9uSW5kZXg9MDsgY29tYmluYXRpb25JbmRleDxjb21iaW5hdGlvbkNvdW50OyBjb21iaW5hdGlvbkluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNraXBGaWZ0aCA9IHNraXBGaWZ0aEluZGV4ID09IDE7XG5cbiAgICAgICAgICAgIC8vIFdlIHRyeSBlYWNoIGludmVyc2lvbi4gV2hpY2ggaXMgYmVzdD9cbiAgICAgICAgICAgIGNvbnN0IGludmVyc2lvbiA9IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XTtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nIDwgMikge1xuICAgICAgICAgICAgICAgIGlmICghaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gRG9uJ3QgZG8gYW55dGhpbmcgYnV0IHJvb3QgcG9zaXRpb24gb24gdGhlIGxhc3QgY2hvcmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGludmVyc2lvblJlc3VsdDogSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIGdUb25lRGlmZnM6IFtdLFxuICAgICAgICAgICAgICAgIG5vdGVzOiB7fSxcbiAgICAgICAgICAgICAgICByYXRpbmc6IDAsXG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uTmFtZXNbaW52ZXJzaW9uSW5kZXhdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChza2lwRmlmdGgpIHtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArPSBcIi1za2lwRmlmdGhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICs9IFwiLVwiICsgY29tYmluYXRpb25JbmRleDtcblxuICAgICAgICAgICAgY29uc3QgYWRkUGFydE5vdGUgPSAocGFydEluZGV4OiBudW1iZXIsIG5vdGU6IE5vdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSA9IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IG5vdGUuc2VtaXRvbmUsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogMSAgLy8gZHVtbXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyLmxvZyhcImludmVyc2lvbjogXCIsIGludmVyc2lvbiwgXCJza2lwRmlmdGg6IFwiLCBza2lwRmlmdGgpO1xuICAgICAgICAgICAgbGV0IHBhcnRUb0luZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge307XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHNlbGVjdCBib3R0b20gbm90ZVxuICAgICAgICAgICAgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdmaXJzdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCd0aGlyZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMaXN0IG5vdGVzIHdlIGhhdmUgbGVmdCBvdmVyXG4gICAgICAgICAgICBsZXQgbGVmdE92ZXJJbmRleGVzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKGNob3JkLm5vdGVzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvbiA9PSBcInJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMl07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcInJvb3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMSwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3QgLT4gV2UgYWxyZWFkeSBoYXZlIDFcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAyXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LWZpZnRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDIsIDJdOyAgLy8gRG91YmxlIHRoZSBmaWZ0aFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwic2Vjb25kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2Vjb25kIC0+IFdlIGFscmVhZHkgaGF2ZSAyXG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAwLCAxXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMiwgM10uZmlsdGVyKGkgPT4gaSAhPSBwYXJ0VG9JbmRleFszXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChza2lwRmlmdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydFRvSW5kZXhbM10gPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYW4ndCBza2lwIGZpZnRoIGluIHNlY29uZCBpbnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsZWZ0T3ZlckluZGV4ZXMuZmlsdGVyKGkgPT4gaSA9PSAyKS5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYW4ndCBza2lwIGZpZnRoIGlmIHdlIGhhdmUgdHdvXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBsZWZ0T3ZlckluZGV4ZXMuZmlsdGVyKGkgPT4gaSAhPSAyKTtcbiAgICAgICAgICAgICAgICAvLyBBZGQgZWl0aGVyIGEgMCBvciAxIHRvIHJlcGxhY2UgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDApLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcy5wdXNoKDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcy5wdXNoKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGVwZW5kaW5nIG9uIGNvbWJpbmF0aW9uSW5kZXgsIHdlIHNlbGVjdCB0aGUgbm90ZXMgZm9yIHBhcnRJbmRleGVzIDAsIDEsIDJcbiAgICAgICAgICAgIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlyc3QgcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIC8vIFNlY29uZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcmQgcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gMykge1xuICAgICAgICAgICAgICAgIC8vIEZvdXJ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA0KSB7XG4gICAgICAgICAgICAgICAgLy8gRmlmdGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gNSkge1xuICAgICAgICAgICAgICAgIC8vIFNpeHRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0wOyBwYXJ0SW5kZXg8NDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBwYXJ0IGlzIGFscmVhZHkgc2V0XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRQYXJ0Tm90ZShwYXJ0SW5kZXgsIGNob3JkLm5vdGVzW3BhcnRUb0luZGV4W3BhcnRJbmRleF1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIExhc3RseSwgd2Ugc2VsZWN0IHRoZSBsb3dlc3QgcG9zc2libGUgb2N0YXZlIGZvciBlYWNoIHBhcnRcbiAgICAgICAgICAgIGxldCBtaW5TZW1pdG9uZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXg9MzsgcGFydEluZGV4Pj0wOyBwYXJ0SW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSBpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XTtcbiAgICAgICAgICAgICAgICBsZXQgZ1RvbmUgPSBnbG9iYWxTZW1pdG9uZShub3RlKTtcblxuICAgICAgICAgICAgICAgIGxldCBpPTA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGdUb25lIDwgc2VtaXRvbmVMaW1pdHNbcGFydEluZGV4XVswXSB8fCBnVG9uZSA8IG1pblNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUgKz0gMTI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdID0gbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIGEgY29weSBpbnZlcnNpb25yZXN1bHQgZm9yIGVhY2ggcG9zc2libGUgb2N0YXZlIGNvbWJpbmF0aW9uXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDBOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzBdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0MU5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMV0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQyTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1syXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDNOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzNdKTtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnQwT2N0YXZlPTA7IHBhcnQwT2N0YXZlPDM7IHBhcnQwT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0ME5vdGUgPSBpbml0aWFsUGFydDBOb3RlICsgcGFydDBPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICBpZiAocGFydDBOb3RlID4gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBhcnQxT2N0YXZlPTA7IHBhcnQxT2N0YXZlPDM7IHBhcnQxT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydDFOb3RlID0gaW5pdGlhbFBhcnQxTm90ZSArIHBhcnQxT2N0YXZlICogMTI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0MU5vdGUgPiBwYXJ0ME5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0MU5vdGUgPiBzZW1pdG9uZUxpbWl0c1sxXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDJPY3RhdmU9MDsgcGFydDJPY3RhdmU8MzsgcGFydDJPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydDJOb3RlID0gaW5pdGlhbFBhcnQyTm90ZSArIHBhcnQyT2N0YXZlICogMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDJOb3RlID4gcGFydDFOb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDJOb3RlID4gc2VtaXRvbmVMaW1pdHNbMl1bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHBhcnQzT2N0YXZlPTA7IHBhcnQzT2N0YXZlPDM7IHBhcnQzT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0M05vdGUgPSBpbml0aWFsUGFydDNOb3RlICsgcGFydDNPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDNOb3RlID4gcGFydDJOb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDNOb3RlID4gc2VtaXRvbmVMaW1pdHNbM11bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDBOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQwTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0MU5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDFOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQyTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0Mk5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDNOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQzTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArIGAgJHtwYXJ0ME9jdGF2ZX0ke3BhcnQxT2N0YXZlfSR7cGFydDJPY3RhdmV9JHtwYXJ0M09jdGF2ZX1gICsgXCIgXCIgKyBnVG9uZVN0cmluZyhwYXJ0ME5vdGUpICsgXCIgXCIgKyBnVG9uZVN0cmluZyhwYXJ0MU5vdGUpICsgXCIgXCIgKyBnVG9uZVN0cmluZyhwYXJ0Mk5vdGUpICsgXCIgXCIgKyBnVG9uZVN0cmluZyhwYXJ0M05vdGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbmc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxvZ2dlci5wcmludChcIm5ld1ZvaWNlTGVhZGluZ05vdGVzOiBcIiwgY2hvcmQudG9TdHJpbmcoKSwgXCIgYmVhdDogXCIsIGJlYXQpO1xuXG4gICAgLy8gUmFuZG9taXplIG9yZGVyIG9mIHJldFxuICAgIGZvciAobGV0IGk9MDsgaTxyZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJldC5sZW5ndGgpO1xuICAgICAgICBjb25zdCB0bXAgPSByZXRbaV07XG4gICAgICAgIHJldFtpXSA9IHJldFtqXTtcbiAgICAgICAgcmV0W2pdID0gdG1wO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG4iLCJjb25zdCBwcmludENoaWxkTWVzc2FnZXMgPSAoY2hpbGRMb2dnZXI6IExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRMb2dnZXIuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5jaGlsZC50aXRsZSk7XG4gICAgICAgIHByaW50Q2hpbGRNZXNzYWdlcyhjaGlsZCk7XG4gICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBjaGlsZC5tZXNzYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4ubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgdGl0bGU6IGFueVtdID0gW107XG4gICAgbWVzc2FnZXM6IEFycmF5PGFueVtdPiA9IFtdO1xuICAgIHBhcmVudDogTG9nZ2VyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGNoaWxkcmVuOiBMb2dnZXJbXSA9IFtdO1xuICAgIGNsZWFyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogTG9nZ2VyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goYXJncyk7XG4gICAgfVxuXG4gICAgcHJpbnQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgLy8gTGV0IHBhcmVudCBoYW5kbGUgbWVcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLmFyZ3MpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLnRoaXMudGl0bGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHRvcCBsb2dnZXIuIFByaW50IGV2ZXJ5dGhpbmcuXG4gICAgICAgIHByaW50Q2hpbGRNZXNzYWdlcyh0aGlzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi50aGlzLm1lc3NhZ2VzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsZWFyZWQgPSB0cnVlO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBnZXRUZW5zaW9uLCBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMsIGdldFJpY2hOb3RlLCBnbG9iYWxTZW1pdG9uZSwgbmV4dEdUb25lSW5TY2FsZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UsIHNlbWl0b25lU2NhbGVJbmRleCwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IHR5cGUgTm9uQ2hvcmRUb25lID0ge1xuICAgIG5vdGU6IE5vdGUsXG4gICAgbm90ZTI/IDogTm90ZSwgIC8vIFRoaXMgbWFrZXMgdGhlIG5vdGVzIDE2dGhzXG4gICAgc3Ryb25nQmVhdDogYm9vbGVhbixcbiAgICByZXBsYWNlbWVudD86IGJvb2xlYW4sXG59XG5cbmV4cG9ydCB0eXBlIE5vbkNob3JkVG9uZVBhcmFtcyA9IHtcbiAgICBnVG9uZTA6IG51bWJlciB8IG51bGwsXG4gICAgZ1RvbmUxOiBudW1iZXIsXG4gICAgZ1RvbmUyOiBudW1iZXIsXG4gICAgd2FudGVkVG9uZT8gOiBudW1iZXIsXG4gICAgc3Ryb25nQmVhdD86IGJvb2xlYW4sXG4gICAgY2hvcmQ/IDogQ2hvcmQsXG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIGdUb25lTGltaXRzOiBudW1iZXJbXSxcbn1cblxudHlwZSBTcGxpdE1vZGUgPSBcIkVFXCIgfCBcIlNTRVwiIHwgXCJFU1NcIiB8IFwiU1NTU1wiXG5cbmV4cG9ydCB0eXBlIEZpbmROb25DaG9yZFRvbmVQYXJhbXMgPSB7XG4gICAgZnJvbUdUb25lOiBudW1iZXIsXG4gICAgdGhpc0JlYXRHVG9uZTogbnVtYmVyLFxuICAgIG5leHRCZWF0R1RvbmU6IG51bWJlcixcbiAgICBzcGxpdE1vZGU6IFNwbGl0TW9kZSxcbiAgICB3YW50ZWRHVG9uZXM6IG51bWJlcltdLCAgLy8gUHJvdmlkZSBndG9uZXMgZm9yIGVhY2ggd2FudGVkIGluZGV4IG9mIHNwbGl0bW9kZVxuICAgIHNjYWxlOiBTY2FsZSxcbiAgICBnVG9uZUxpbWl0czogbnVtYmVyW10sXG4gICAgY2hvcmQ/OiBDaG9yZCxcbn1cblxuXG5leHBvcnQgY29uc3QgYWRkTm90ZUJldHdlZW4gPSAobmFjOiBOb25DaG9yZFRvbmUsIGRpdmlzaW9uOiBudW1iZXIsIG5leHREaXZpc2lvbjogbnVtYmVyLCBwYXJ0SW5kZXg6IG51bWJlciwgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZGl2aXNpb25EaWZmID0gbmV4dERpdmlzaW9uIC0gZGl2aXNpb247XG4gICAgY29uc3QgYmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gfHwgW10pLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgaWYgKCFiZWF0UmljaE5vdGUgfHwgIWJlYXRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmFpZWxkIHRvIGFkZCBub3RlIGJldHdlZW5cIiwgZGl2aXNpb24sIG5leHREaXZpc2lvbiwgcGFydEluZGV4LCBkaXZpc2lvbmVkTm90ZXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Tm90ZSA9IG5hYy5ub3RlO1xuICAgIGNvbnN0IG5ld05vdGUyID0gbmFjLm5vdGUyO1xuICAgIGNvbnN0IHN0cm9uZ0JlYXQgPSBuYWMuc3Ryb25nQmVhdDtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG5hYy5yZXBsYWNlbWVudCB8fCBmYWxzZTtcblxuICAgIC8vIElmIHN0cm9uZyBiZWF0LCB3ZSBhZGQgbmV3Tm90ZSBCRUZPUkUgYmVhdFJpY2hOb3RlXG4gICAgLy8gT3RoZXJ3aXNlIHdlIGFkZCBuZXdOb3RlIEFGVEVSIGJlYXRSaWNoTm90ZVxuXG4gICAgaWYgKHN0cm9uZ0JlYXQpIHtcbiAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDIsXG4gICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBuZXcgdG9uZSB0byBkaXZpc2lvblxuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICAvLyBSZW1vdmUgYmVhdFJpY2hOb3RlIGZyb20gZGl2aXNpb25cbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0uZmlsdGVyKG5vdGUgPT4gbm90ZSAhPSBiZWF0UmljaE5vdGUpO1xuICAgICAgICBpZiAoIXJlcGxhY2VtZW50KSB7XG4gICAgICAgICAgICAvLyBBZGQgYmVhdFJpY2hOb3RlIHRvIGRpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMlxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChiZWF0UmljaE5vdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWRkIG5ldyB0b25lIGFsc28gdG8gZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbmV3Tm90ZTIpIHtcbiAgICAgICAgICAgIC8vIGFkZGluZyAxIDh0aCBub3RlXG4gICAgICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDIsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhZGRpbmcgMiAxNnRoIG5vdGVzXG4gICAgICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDQsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgKiAwLjc1XSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAqIDAuNzVdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUyID0ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ld05vdGUyLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyA0LFxuICAgICAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAqIDAuNzVdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5jb25zdCBwYXNzaW5nVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBhIG5ldyBnVG9uZSBvciBudWxsLCBiYXNlZCBvbiB3aGV0aGVyIGFkZGluZyBhIHBhc3NpbmcgdG9uZSBpcyBhIGdvb2QgaWRlYS5cbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKGdUb25lMSAtIGdUb25lMik7XG4gICAgaWYgKGRpc3RhbmNlIDwgMyB8fCBkaXN0YW5jZSA+IDQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlVG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobiA9PiBuLnNlbWl0b25lKTtcbiAgICBmb3IgKGxldCBnVG9uZT1nVG9uZTE7IGdUb25lICE9IGdUb25lMjsgZ1RvbmUgKz0gKGdUb25lMSA8IGdUb25lMiA/IDEgOiAtMSkpIHtcbiAgICAgICAgaWYgKGdUb25lID09IGdUb25lMSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBnVG9uZSAlIDEyO1xuICAgICAgICBpZiAoc2NhbGVUb25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmNvbnN0IGFjY2VudGVkUGFzc2luZ1RvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICAvLyBTYW1lIGFzIHBhc3NpbmcgdG9uZSBidXQgb24gc3Ryb25nIGJlYXRcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhnVG9uZTAgLSBnVG9uZTEpO1xuICAgIGlmIChkaXN0YW5jZSA8IDMgfHwgZGlzdGFuY2UgPiA0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZVRvbmVzID0gc2NhbGUubm90ZXMubWFwKG4gPT4gbi5zZW1pdG9uZSk7XG4gICAgZm9yIChsZXQgZ1RvbmU9Z1RvbmUwOyBnVG9uZSAhPSBnVG9uZTE7IGdUb25lICs9IChnVG9uZTAgPCBnVG9uZTEgPyAxIDogLTEpKSB7XG4gICAgICAgIGlmIChnVG9uZSA9PSBnVG9uZTApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gZ1RvbmUgJSAxMjtcbiAgICAgICAgaWYgKHNjYWxlVG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cblxuY29uc3QgbmVpZ2hib3JUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCwgdGhlbiBzdGVwIGJhY2suIFRoaXMgaXMgb24gV2VhayBiZWF0XG4gICAgaWYgKGdUb25lMSAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHVwT3JEb3duQ2hvaWNlcyA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBbMSwgLTFdIDogWy0xLCAxXTtcbiAgICBmb3IgKGNvbnN0IHVwT3JEb3duIG9mIHVwT3JEb3duQ2hvaWNlcykge1xuICAgICAgICBjb25zdCBuZXdHdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCB1cE9yRG93biwgc2NhbGUpO1xuICAgICAgICBpZiAoIW5ld0d0b25lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3R3RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBuZXdHdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBuZXdHdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKG5ld0d0b25lIC8gMTIpLFxuICAgICAgICB9KSwgc3Ryb25nQmVhdDogZmFsc2V9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5jb25zdCBzdXNwZW5zaW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RheSBvbiBwcmV2aW91cywgdGhlbiBzdGVwIERPV04gaW50byBjaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0LlxuICAgIC8vIFVzdWFsbHkgZG90dGVkIVxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMCAtIGdUb25lMTtcbiAgICBpZiAoZGlzdGFuY2UgPCAxIHx8IGRpc3RhbmNlID4gMikge1xuICAgICAgICAvLyBNdXN0IGJlIGhhbGYgb3Igd2hvbGUgc3RlcCBkb3duLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGdUb25lMSB0byBnVG9uZTAgZm9yIHRoZSBsZW5ndGggb2YgdGhlIHN1c3BlbnNpb24uXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cm9uZ0JlYXQ6IHRydWUsXG4gICAgfVxufVxuXG5cbmNvbnN0IHJldGFyZGF0aW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RheSBvbiBwcmV2aW91cywgdGhlbiBzdGVwIFVQIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdFxuICAgIC8vIFVzdWFsbHkgZG90dGVkIVxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMSAtIGdUb25lMDtcbiAgICBpZiAoZGlzdGFuY2UgPCAxIHx8IGRpc3RhbmNlID4gMikge1xuICAgICAgICAvLyBNdXN0IGJlIGhhbGYgb3Igd2hvbGUgc3RlcCB1cC5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUwICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O31cblxuXG5jb25zdCBhcHBvZ2lhdHVyYSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIExlYXAsIHRoZW4gc3RlcCBiYWNrIGludG8gQ2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdFxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMSAtIGdUb25lMDtcbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2UpIDwgMykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgdXBPckRvd24gPSAtMTtcbiAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgZG93biBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBhcHBvZ2lhdHVyYVxuICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIHVwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGFwcG9naWF0dXJhXG4gICAgICAgIHVwT3JEb3duID0gMTtcbiAgICB9XG4gICAgY29uc3QgZ1RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgdXBPckRvd24sIHNjYWxlKTtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07XG59XG5cbmNvbnN0IGVzY2FwZVRvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIGF3YXksIHRoZW4gTGVhcCBpbiB0byBuZXh0IENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gMTtcbiAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgdXAgZnJvbSBnVG9uZTAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZXNjYXBlVG9uZVxuICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZnJvbSBnVG9uZTAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZXNjYXBlVG9uZVxuICAgICAgICB1cE9yRG93biA9IC0xO1xuICAgIH1cbiAgICBjb25zdCBnVG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUwLCB1cE9yRG93biwgc2NhbGUpO1xuICAgIGlmICghZ1RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTtcbn1cblxuY29uc3QgYW50aWNpcGF0aW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBvciBsZWFwIGVhcmx5IGluIHRvIG5leHQgQ2hvcmQgdG9uZS4gVGhpcyBpcyBvbiB3ZWFrIGJlYXQuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTIgLSBnVG9uZTE7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDEpIHtcbiAgICAgICAgLy8gVG9vIGNsb3NlIHRvIGJlIGFuIGFudGljaXBhdGlvblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBFYXN5LiBKdXN0IG1ha2UgYSBuZXcgbm90ZSB0aGF0cyB0aGUgc2FtZSBhcyBnVG9uZTIuXG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTIgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMiAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogZmFsc2V9O1xufVxuXG5jb25zdCBuZWlnaGJvckdyb3VwID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBhd2F5LCB0aGVuIGxlYXAgaW50byB0aGUgXCJvdGhlciBwb3NzaWJsZVwiIG5laWdoYm9yIHRvbmUuIFRoaXMgdXNlcyAxNnRocyAodHdvIG5vdGVzKS5cbiAgICAvLyBXZWFrIGJlYXRcbiAgICBpZiAoZ1RvbmUxICE9IGdUb25lMikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVJbmRleCA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgdXBHdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCAxLCBzY2FsZSk7XG4gICAgY29uc3QgZG93bkd0b25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIC0xLCBzY2FsZSk7XG4gICAgaWYgKCF1cEd0b25lIHx8ICFkb3duR3RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICh1cEd0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgdXBHdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZG93bkd0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZG93bkd0b25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiB1cEd0b25lICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IodXBHdG9uZSAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIG5vdGUyOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogZG93bkd0b25lICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZG93bkd0b25lIC8gMTIpLFxuICAgICAgICB9KSxcbiAgICAgICAgc3Ryb25nQmVhdDogZmFsc2VcbiAgICB9O1xufVxuXG5cbmNvbnN0IHBlZGFsUG9pbnQgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBSZXBsYWNlIHRoZSBlbnRpcmUgbm90ZSB3aXRoIHRoZSBub3RlIHRoYXQgaXMgYmVmb3JlIGl0IEFORCBhZnRlciBpdC5cbiAgICBpZiAoZ1RvbmUwICE9IGdUb25lMikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lMCA9PSBnVG9uZTEpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7ICAvLyBBbHJlYWR5IGV4aXN0c1xuICAgIH1cbiAgICBpZiAoZ1RvbmUxIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUxID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUwICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWUsIHJlcGxhY2VtZW50OiB0cnVlfTtcbn1cblxuXG5jb25zdCBjaG9yZE5vdGUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICAvLyBKdXN0IHVzZSBhIGNob3JkIHRvbmUuIFdlYWsgT1Igc3Ryb25nIGJlYXRcbiAgICBjb25zdCB7IGdUb25lMSwgY2hvcmQgfSA9IHZhbHVlcztcbiAgICBsZXQgc3Ryb25nQmVhdCA9IHZhbHVlcy5zdHJvbmdCZWF0O1xuICAgIGlmICghc3Ryb25nQmVhdCkge1xuICAgICAgICBzdHJvbmdCZWF0ID0gTWF0aC5yYW5kb20oKSA+IDAuODtcbiAgICB9XG4gICAgaWYgKCFjaG9yZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IHdhbnRlZFRvbmUgPSB2YWx1ZXMud2FudGVkVG9uZTtcbiAgICBpZiAoIXdhbnRlZFRvbmUpIHtcbiAgICAgICAgLy8gUmFuZG9tIGZyb20gY2hvcmQubm90ZXNcbiAgICAgICAgY29uc3Qgbm90ZSA9IGNob3JkLm5vdGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNob3JkLm5vdGVzLmxlbmd0aCldO1xuICAgICAgICB3YW50ZWRUb25lID0gbm90ZS5zZW1pdG9uZTtcbiAgICAgICAgLy8gU2VsZWN0IGNsb3Nlc3Qgb2N0YXZlIHRvIGdUb25lMVxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlIChNYXRoLmFicyh3YW50ZWRUb25lIC0gZ1RvbmUxKSA+PSA2KSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YW50ZWRUb25lICs9IDEyO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBnb29kID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBub3RlIG9mIGNob3JkLm5vdGVzKSB7XG4gICAgICAgIGlmIChub3RlLnNlbWl0b25lID09IHdhbnRlZFRvbmUgJSAxMikge1xuICAgICAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWdvb2QpIHtcbiAgICAgICAgLy8gV2FudGVkVG9uZSBpcyBub3QgYSBjaG9yZCB0b25lXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogd2FudGVkVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3Iod2FudGVkVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogc3Ryb25nQmVhdH07XG59XG5cbmNvbnN0IHdlYWtCZWF0Q2hvcmRUb25lICA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIHJldHVybiBjaG9yZE5vdGUoe1xuICAgICAgICAuLi52YWx1ZXMsXG4gICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlLFxuICAgIH0pO1xufVxuXG5jb25zdCBzdHJvbmdCZWF0Q2hvcmRUb25lICA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIHJldHVybiBjaG9yZE5vdGUoe1xuICAgICAgICAuLi52YWx1ZXMsXG4gICAgICAgIHN0cm9uZ0JlYXQ6IHRydWUsXG4gICAgfSlcbn1cblxuXG5leHBvcnQgY29uc3QgZmluZE5BQ3MgPSAodmFsdWVzOiBGaW5kTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2Zyb21HVG9uZSwgdGhpc0JlYXRHVG9uZSwgbmV4dEJlYXRHVG9uZSwgc3BsaXRNb2RlLCB3YW50ZWRHVG9uZXMsIHNjYWxlLCBnVG9uZUxpbWl0cywgY2hvcmR9ID0gdmFsdWVzO1xuXG4gICAgY29uc3Qgc3Ryb25nQmVhdEZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAnc3Ryb25nQmVhdENob3JkVG9uZSc6IHN0cm9uZ0JlYXRDaG9yZFRvbmUsXG4gICAgICAgICdhcHBvZ2lhdHVyYSc6IGFwcG9naWF0dXJhLFxuICAgICAgICAnZXNjYXBlVG9uZSc6IGVzY2FwZVRvbmUsXG4gICAgICAgICdwZWRhbFBvaW50JzogcGVkYWxQb2ludCxcbiAgICAgICAgJ3N1c3BlbnNpb24nOiBzdXNwZW5zaW9uLFxuICAgICAgICAncmV0YXJkYXRpb24nOiByZXRhcmRhdGlvbixcbiAgICAgICAgJ2FjY2VudGVkUGFzc2luZ1RvbmUnOiBhY2NlbnRlZFBhc3NpbmdUb25lLFxuICAgIH1cblxuICAgIGNvbnN0IHdlYWtCZWF0RnVuY3M6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7XG4gICAgICAgICd3ZWFrQmVhdENob3JkVG9uZSc6IHdlYWtCZWF0Q2hvcmRUb25lLFxuICAgICAgICAnYW50aWNpcGF0aW9uJzogYW50aWNpcGF0aW9uLFxuICAgICAgICAnbmVpZ2hib3JHcm91cCc6IG5laWdoYm9yR3JvdXAsXG4gICAgICAgICdwYXNzaW5nVG9uZSc6IHBhc3NpbmdUb25lLFxuICAgIH1cblxuICAgIGlmIChzcGxpdE1vZGUgPT0gJ0VFJykge1xuICAgICAgICAvLyBUaGlzIGNhc2Ugb25seSBoYXMgMiBjaG9pY2VzOiBzdHJvbmcgb3Igd2VhayBiZWF0XG4gICAgICAgIGxldCBzdHJvbmdCZWF0ID0gZmFsc2U7XG4gICAgICAgIC8vIEZpbmQgdGhlIHdhbnRlZCBub3Rlc1xuICAgICAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIGEgY2hhbmdlIG9uIHN0cm9uZyBiZWF0IG9yIG9uIHNvbWUgb3RoZXIgYmVhdFxuICAgICAgICBpZiAod2FudGVkR1RvbmVzWzBdICYmIHdhbnRlZEdUb25lc1swXSAhPSB0aGlzQmVhdEdUb25lKSB7XG4gICAgICAgICAgICBzdHJvbmdCZWF0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3Ryb25nQmVhdCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jTmFtZSBpbiBzdHJvbmdCZWF0RnVuY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gc3Ryb25nQmVhdEZ1bmNzW2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmdW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUwOiBmcm9tR1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMTogdGhpc0JlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUyOiBuZXh0QmVhdEdUb25lLFxuICAgICAgICAgICAgICAgICAgICB3YW50ZWRUb25lOiB3YW50ZWRHVG9uZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZUxpbWl0cyxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQsXG4gICAgICAgICAgICAgICAgfSBhcyBOb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3YW50ZWRHVG9uZXNbMF0gfHwgZ2xvYmFsU2VtaXRvbmUocmVzdWx0Lm5vdGUpID09IHdhbnRlZEdUb25lc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuY05hbWUgaW4gd2Vha0JlYXRGdW5jcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSB3ZWFrQmVhdEZ1bmNzW2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmdW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUwOiBmcm9tR1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMTogdGhpc0JlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUyOiBuZXh0QmVhdEdUb25lLFxuICAgICAgICAgICAgICAgICAgICB3YW50ZWRUb25lOiB3YW50ZWRHVG9uZXNbMV0sXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZUxpbWl0cyxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQsXG4gICAgICAgICAgICAgICAgfSBhcyBOb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3YW50ZWRHVG9uZXNbMV0gfHwgZ2xvYmFsU2VtaXRvbmUocmVzdWx0Lm5vdGUpID09IHdhbnRlZEdUb25lc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5leHBvcnQgY29uc3QgYnVpbGRUb3BNZWxvZHkgPSAoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpID0+IHtcbiAgICAvLyBGb2xsb3cgdGhlIHByZSBnaXZlbiBtZWxvZHkgcmh5dGhtXG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zOiB7IFtrZXk6IG51bWJlcl06IG51bWJlcjsgfSA9IGdldFJoeXRobU5lZWRlZER1cmF0aW9ucyhtYWluUGFyYW1zKTtcblxuICAgIGNvbnN0IGxhc3REaXZpc2lvbiA9IEJFQVRfTEVOR1RIICogbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpO1xuICAgIGNvbnN0IGZpcnN0UGFyYW1zID0gbWFpblBhcmFtcy5jdXJyZW50Q2FkZW5jZVBhcmFtcygwKTtcbiAgICBjb25zdCB7c3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsIHNlbWl0b25lTGltaXRzfSA9IHN0YXJ0aW5nTm90ZXMoZmlyc3RQYXJhbXMpO1xuXG4gICAgZm9yIChsZXQgZGl2aXNpb24gPSAwOyBkaXZpc2lvbiA8IGxhc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBsZXQgZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdCA9IFtcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1swXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMV1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzJdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1szXV0sXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb24pO1xuICAgICAgICBjb25zdCBjYWRlbmNlRGl2aXNpb24gPSBkaXZpc2lvbiAtIHBhcmFtcy5hdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvbjtcbiAgICAgICAgY29uc3QgbmVlZGVkUmh5dGhtID0gcmh5dGhtTmVlZGVkRHVyYXRpb25zW2NhZGVuY2VEaXZpc2lvbl0gfHwgMTAwO1xuXG4gICAgICAgIGNvbnN0IGxhc3RCZWF0SW5DYWRlbmNlID0gcGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kIDwgMlxuICAgICAgICBpZiAobGFzdEJlYXRJbkNhZGVuY2UpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJldk5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICAgICAgY29uc3QgdGhpc05vdGVzOiBOb3RlW10gPSBbXTtcbiAgICAgICAgY29uc3QgbmV4dE5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbnRTY2FsZTogU2NhbGU7XG5cbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pIHtcbiAgICAgICAgICAgIGlmIChyaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKHJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICAgICAgaWYgKHJpY2hOb3RlLnNjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY2FsZSA9IHJpY2hOb3RlLnNjYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKHJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBuZXh0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnJlbnRTY2FsZSA9IGN1cnJlbnRTY2FsZTtcblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGxpbWl0cywgbmV3IG5vdGVzIG11c3QgYWxzbyBiZSBiZXR3ZWVlbiB0aGUgb3RoZXIgcGFydCBub3Rlc1xuICAgICAgICAgICAgLy8gKCBPdmVybGFwcGluZyApXG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24sIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnVG9uZTEgPSBnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lMiA9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IG1pbkdUb25lID0gTWF0aC5taW4oZ1RvbmUxLCBnVG9uZTIpO1xuICAgICAgICAgICAgY29uc3QgbWF4R1RvbmUgPSBNYXRoLm1heChnVG9uZTEsIGdUb25lMik7XG4gICAgICAgICAgICBpZiAoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXSkge1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHRoZSBoaWdoZXIgcGFydCwgaXQgY2FuJ3QgZ28gbG93ZXIgdGhhbiBtYXhHVG9uZVxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV1bMF0gPSBNYXRoLm1heChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdWzBdLCBtYXhHVG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXSkge1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHRoZSBsb3dlciBwYXJ0LCBpdCBjYW4ndCBnbyBoaWdoZXIgdGhhbiBtaW5HVG9uZVxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV1bMV0gPSBNYXRoLm1pbihnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdWzFdLCBtaW5HVG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKG5lZWRlZFJoeXRobSAhPSAyICogQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBuZWVkIGZvciBoYWxmIG5vdGVzXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBZGQgYSB0aWUgdG8gdGhlIG5leHQgbm90ZVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uLCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdsb2JhbFNlbWl0b25lKHJpY2hOb3RlLm5vdGUpICE9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmljaE5vdGUudGllID0gXCJzdGFydFwiO1xuICAgICAgICAgICAgbmV4dFJpY2hOb3RlLnRpZSA9IFwic3RvcFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIGlmIChuZWVkZWRSaHl0aG0gIT0gIEJFQVRfTEVOR1RIIC8gMikge1xuICAgICAgICAgICAgICAgIC8vIE5vIG5lZWQgZm9yIDh0aHMuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24sIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlLnNjYWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHNjYWxlIGZvciByaWNoTm90ZVwiLCByaWNoTm90ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByZXZSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gLSBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcblxuICAgICAgICAgICAgY29uc3QgZ1RvbmUxID0gZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBnVG9uZTIgPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBsZXQgZ1RvbmUwID0gcHJldlJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldlJpY2hOb3RlLm5vdGUpIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChnVG9uZTAgJiYgcHJldlJpY2hOb3RlICYmIHByZXZSaWNoTm90ZS5kdXJhdGlvbiAhPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIC8vIEZJWE1FOiBwcmV2UmljaE5vdGUgaXMgbm90IHRoZSBwcmV2aW91cyBub3RlLiBXZSBjYW5ub3QgdXNlIGl0IHRvIGRldGVybWluZSB0aGUgcHJldmlvdXMgbm90ZS5cbiAgICAgICAgICAgICAgICBnVG9uZTAgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmFjUGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGdUb25lMCxcbiAgICAgICAgICAgICAgICBnVG9uZTEsXG4gICAgICAgICAgICAgICAgZ1RvbmUyLFxuICAgICAgICAgICAgICAgIHNjYWxlOiByaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0czogZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXhdLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUcnkgdG8gZmluZCBhIHdheSB0byBhZCA4dGggbm90ZXMgdGhpcyBiZWF0LlxuXG4gICAgICAgICAgICBjb25zdCBub25DaG9yZFRvbmVDaG9pY2VGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgICAgICAgICBhcHBvZ2lhdHVyYTogKCkgPT4gYXBwb2dpYXR1cmEobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBuZWlnaGJvckdyb3VwOiAoKSA9PiBuZWlnaGJvckdyb3VwKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgc3VzcGVuc2lvbjogKCkgPT4gc3VzcGVuc2lvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIGVzY2FwZVRvbmU6ICgpID0+IGVzY2FwZVRvbmUobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBwYXNzaW5nVG9uZTogKCkgPT4gcGFzc2luZ1RvbmUobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBuZWlnaGJvclRvbmU6ICgpID0+IG5laWdoYm9yVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHJldGFyZGF0aW9uOiAoKSA9PiByZXRhcmRhdGlvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIGFudGljaXBhdGlvbjogKCkgPT4gYW50aWNpcGF0aW9uKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcGVkYWxQb2ludDogKCkgPT4gcGVkYWxQb2ludChuYWNQYXJhbXMpLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgICAgICBsZXQgbm9uQ2hvcmRUb25lID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHVzZWRDaG9pY2VzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnMgaW4gOHRoIG5vdGUgZ2VuZXJhdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgbm9uQ2hvcmRUb25lQ2hvaWNlczoge1trZXk6IHN0cmluZ106IE5vbkNob3JkVG9uZX0gPSB7fVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXR0aW5nID0gcGFyYW1zLm5vbkNob3JkVG9uZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5nIHx8ICFzZXR0aW5nLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZSA9IG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzW2tleV0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNob2ljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldID0gY2hvaWNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnRJbmRleCAhPSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub25DaG9yZFRvbmVDaG9pY2VzLnBlZGFsUG9pbnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHVzaW5nS2V5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb25zdCBhdmFpbGFibGVLZXlzID0gT2JqZWN0LmtleXMobm9uQ2hvcmRUb25lQ2hvaWNlcykuZmlsdGVyKGtleSA9PiAhdXNlZENob2ljZXMuaGFzKGtleSkpO1xuICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVLZXlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbm9uQ2hvcmRUb25lQ2hvaWNlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlZENob2ljZXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChub25DaG9yZFRvbmVDaG9pY2VzW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZSA9IG5vbkNob3JkVG9uZUNob2ljZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzaW5nS2V5ID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbm9uQ2hvcmRUb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBhIHBvc3NpYmxlIG5vbiBjaG9yZCB0b25lXG4gICAgICAgICAgICAgICAgLy8gTm93IHdlIG5lZWQgdG8gY2hlY2sgdm9pY2UgbGVhZGluZyBmcm9tIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBub25DaG9yZFRvbmVOb3RlczogTm90ZVtdID0gWy4uLnRoaXNOb3Rlc107XG5cbiAgICAgICAgICAgICAgICBpZiAobm9uQ2hvcmRUb25lLnN0cm9uZ0JlYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9uQ2hvcmRUb25lTm90ZXNbcGFydEluZGV4XSA9IG5vbkNob3JkVG9uZS5ub3RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUmVzdWx0ID0gbmV3IFRlbnNpb24oKTtcbiAgICAgICAgICAgICAgICBnZXRUZW5zaW9uKHRlbnNpb25SZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vdGVzT3ZlcnJpZGU6IHByZXZOb3RlcyxcbiAgICAgICAgICAgICAgICAgICAgYmVhdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdG9Ob3Rlczogbm9uQ2hvcmRUb25lTm90ZXMsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY2FsZTogY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgbWFpblBhcmFtczogbWFpblBhcmFtcyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGxldCB0ZW5zaW9uID0gMDtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uICs9IHRlbnNpb25SZXN1bHQuZG91YmxlTGVhZGluZ1RvbmU7XG4gICAgICAgICAgICAgICAgdGVuc2lvbiArPSB0ZW5zaW9uUmVzdWx0LnBhcmFsbGVsRmlmdGhzO1xuICAgICAgICAgICAgICAgIHRlbnNpb24gKz0gdGVuc2lvblJlc3VsdC5zcGFjaW5nRXJyb3I7XG4gICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZW5zaW9uIHRvbyBoaWdoIGZvciBub24gY2hvcmQgdG9uZVwiLCB0ZW5zaW9uLCBub25DaG9yZFRvbmUsIHRlbnNpb25SZXN1bHQsIHVzaW5nS2V5KTtcbiAgICAgICAgICAgICAgICB1c2VkQ2hvaWNlcy5hZGQodXNpbmdLZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhZGROb3RlQmV0d2Vlbihub25DaG9yZFRvbmUsIGRpdmlzaW9uLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgsIGRpdmlzaW9uZWROb3Rlcyk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgQkVBVF9MRU5HVEggfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgTWFpbk11c2ljUGFyYW1zIHtcbiAgICBiZWF0c1BlckJhcjogbnVtYmVyID0gNDtcbiAgICBjYWRlbmNlQ291bnQ6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZXM6IEFycmF5PE11c2ljUGFyYW1zPiA9IFtdO1xuICAgIHRlc3RNb2RlPzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIG1lbG9keVJoeXRobTogc3RyaW5nID0gXCJcIjsgIC8vIGhpZGRlbiBmcm9tIHVzZXIgZm9yIG5vd1xuICAgIGZvcmNlZE1lbG9keTogbnVtYmVyW107ICAvLyBoaWRkZW4gZnJvbSB1c2VyIGZvciBub3dcbiAgICBmb3JjZWRDaG9yZHM6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFBhcnRpYWw8TWFpbk11c2ljUGFyYW1zPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gKHBhcmFtcyBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5tZWxvZHlSaHl0aG0gPSBcIlFRUVFRUVFRUVFRUVFRUVFRUVFRUVFcIlxuICAgICAgICB0aGlzLm1lbG9keVJoeXRobSA9IFwiXCI7XG4gICAgICAgIC8vIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAvLyAgICAgaWYgKHJhbmRvbSA8IDAuMikge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiSFwiO1xuICAgICAgICAvLyAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgLy8gICAgIH0gZWxzZSBpZiAocmFuZG9tIDwgMC43KSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJRXCI7XG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiRUVcIjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLmZvcmNlZE1lbG9keSA9IFswLCAxLCAyLCAzLCAzLCAzIF1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgMTIgMyA0MSAyIDM0IHR3byBiYXJzXG5cbiAgICAgICAgLy8gRG8gUmUgTWkgRmEgU28gTGEgVGkgRG9cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBcIlJSUlJSUlJSUlJSUlJSUlJSUlJSXCI7XG4gICAgICAgIHRoaXMuZm9yY2VkTWVsb2R5ID0gW107XG4gICAgICAgIC8vIGxldCBtZWxvZHkgPSBbMF07XG4gICAgICAgIC8vIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBjb25zdCB1cE9yRG93biA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XG4gICAgICAgIC8vICAgICBjb25zdCBwcmV2TWVsb2R5ID0gbWVsb2R5W21lbG9keS5sZW5ndGggLSAxXTtcbiAgICAgICAgLy8gICAgIG1lbG9keS5wdXNoKHByZXZNZWxvZHkgKyAoMSAqIHVwT3JEb3duKSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBtZWxvZHkubWFwKG0gPT4gKG0gKyA3ICogMTAwKSAlIDcpO1xuXG4gICAgICAgIC8vIEV4YW1wbGUgbWVsb2R5XG4gICAgICAgIC8vIEMgbWFqIC0gQ1xuICAgICAgICAvLyAgICAgICAgIEQgcHRcbiAgICAgICAgLy8gQyBtYWogICBFXG4gICAgICAgIC8vICAgICAgICAgRiBwdFxuICAgICAgICAvLyBBIG1pbiAgIEcgcHRcbiAgICAgICAgLy8gICAgICAgICBBXG4gICAgICAgIC8vIEEgbWluICAgQiBwdFxuICAgICAgICAvLyAgICAgICAgIENcbiAgICAgICAgLy8gRiBtYWogICBCIHB0XG4gICAgICAgIC8vICAgICAgICAgQVxuICAgICAgICAvLyBGIG1haiAgIEcgcHRcbiAgICAgICAgLy8gICAgICAgICBGXG4gICAgICAgIC8vIEcgbWFqICAgRSBwdFxuICAgICAgICAvLyAgICAgICAgIERcbiAgICAgICAgLy8gRyBtYWogICBDIHB0XG4gICAgICAgIC8vICAgICAgICAgRFxuICAgICAgICAvLyBDIG1haiAgIEVcbiAgICAgICAgLy8gICAgICAgICBGIHB0XG4gICAgICAgIC8vIEMgbWFqICAgR1xuICAgICAgICAvLyAgICAgICAgIEEgcHRcbiAgICAgICAgLy8gdGhpcy5mb3JjZWRDaG9yZHMgPSBcIjExNjY0NDU1MTE2NjU1MTExMTY2NDQ1NTExNjY1NTExXCJcbiAgICB9XG5cbiAgICBjdXJyZW50Q2FkZW5jZVBhcmFtcyhkaXZpc2lvbjogbnVtYmVyKTogTXVzaWNQYXJhbXMge1xuICAgICAgICBjb25zdCBiZWF0ID0gTWF0aC5mbG9vcihkaXZpc2lvbiAvIEJFQVRfTEVOR1RIKTtcbiAgICAgICAgY29uc3QgYmFyID0gTWF0aC5mbG9vcihiZWF0IC8gdGhpcy5iZWF0c1BlckJhcik7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDsgIC8vIFRoZSBiZWF0IHdlJ3JlIGF0IGluIHRoZSBsb29wXG4gICAgICAgIGxldCBhdXRoZW50aWNDYWRlbmNlU3RhcnRCYXIgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNhZGVuY2VQYXJhbXMgb2YgdGhpcy5jYWRlbmNlcykge1xuICAgICAgICAgICAgLy8gTG9vcCBjYWRlbmNlcyBpbiBvcmRlcnNcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gY2FkZW5jZVBhcmFtcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgICAgIGlmIChbXCJQQUNcIiwgXCJJQUNcIl0uaW5jbHVkZXMoY2FkZW5jZVBhcmFtcy5zZWxlY3RlZENhZGVuY2UpKSB7XG4gICAgICAgICAgICAgICAgYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyID0gY291bnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYXIgPCBjb3VudGVyKSB7ICAvLyBXZSBoYXZlIHBhc3NlZCB0aGUgZ2l2ZW4gZGl2aXNpb24uIFRoZSBwcmV2aW91cyBjYWRlbmNlIGlzIHRoZSBvbmUgd2Ugd2FudFxuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbENhZGVuY2VFbmQgPSBjb3VudGVyICogdGhpcy5iZWF0c1BlckJhciAtIGJlYXQ7XG4gICAgICAgICAgICAgICAgaWYgKFtcIlBBQ1wiLCBcIklBQ1wiXS5pbmNsdWRlcyhjYWRlbmNlUGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA9IGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbENhZGVuY2VFbmQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA9IDk5OTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsU29uZ0VuZCA9IHRoaXMuY2FkZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhICsgYi5iYXJzUGVyQ2FkZW5jZSwgMCkgKiB0aGlzLmJlYXRzUGVyQmFyIC0gYmVhdDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzUGVyQmFyID0gdGhpcy5iZWF0c1BlckJhcjtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmNhZGVuY2VTdGFydERpdmlzaW9uID0gKChjb3VudGVyIC0gY2FkZW5jZVBhcmFtcy5iYXJzUGVyQ2FkZW5jZSkgKiB0aGlzLmJlYXRzUGVyQmFyKSAqIEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb24gPSBhdXRoZW50aWNDYWRlbmNlU3RhcnRCYXIgKiB0aGlzLmJlYXRzUGVyQmFyICogQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhZGVuY2VQYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FkZW5jZXNbMF07XG4gICAgfVxuXG4gICAgZ2V0TWF4QmVhdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNVbnRpbENhZGVuY2VFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNVbnRpbFNvbmdFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZVN0YXJ0RGl2aXNpb246IG51bWJlciA9IDA7XG4gICAgYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb246IG51bWJlciA9IDA7XG5cbiAgICBiYXNlVGVuc2lvbj86IG51bWJlciA9IDAuMztcbiAgICBiYXJzUGVyQ2FkZW5jZTogbnVtYmVyID0gMlxuICAgIHRlbXBvPzogbnVtYmVyID0gNDA7XG4gICAgaGFsZk5vdGVzPzogYm9vbGVhbiA9IHRydWU7XG4gICAgc2l4dGVlbnRoTm90ZXM/OiBudW1iZXIgPSAwLjI7XG4gICAgZWlnaHRoTm90ZXM/OiBudW1iZXIgPSAwLjQ7XG4gICAgbW9kdWxhdGlvbldlaWdodD86IG51bWJlciA9IDA7XG4gICAgbGVhZGluZ1dlaWdodD86IG51bWJlciA9IDI7XG4gICAgcGFydHM6IEFycmF5PHtcbiAgICAgICAgdm9pY2U6IHN0cmluZyxcbiAgICAgICAgbm90ZTogc3RyaW5nLFxuICAgICAgICB2b2x1bWU6IG51bWJlcixcbiAgICB9PiA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MVwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQzVcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDEwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MVwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQTRcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZvaWNlOiBcIjQyXCIsXG4gICAgICAgICAgICAgICAgbm90ZTogXCJDNFwiLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogNyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDNcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkUzXCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiAxMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICBiZWF0U2V0dGluZ3M6IEFycmF5PHtcbiAgICAgICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIH0+ID0gW107XG4gICAgY2hvcmRTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXIsXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgbWFqOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWluOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGltOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdWc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYWo3OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9tNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIHNjYWxlU2V0dGluZ3M6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgbWFqb3I6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaW5vcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICBzZWxlY3RlZENhZGVuY2U6IHN0cmluZyA9IFwiSENcIjtcbiAgICBub25DaG9yZFRvbmVzOiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICB3ZWlnaHQ6IG51bWJlcixcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgICAgICBwYXNzaW5nVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5laWdoYm9yVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1c3BlbnNpb246IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXRhcmRhdGlvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFwcG9naWF0dXJhOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXNjYXBlVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFudGljaXBhdGlvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5laWdoYm9yR3JvdXA6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwZWRhbFBvaW50OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG5cblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNdXNpY1BhcmFtcz4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IChwYXJhbXMgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQmVhdFNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQmVhdFNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBiZWF0Q291bnQgPSB0aGlzLmJlYXRzUGVyQmFyICogdGhpcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA8IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aDsgaSA8IGJlYXRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRoaXMuYmFzZVRlbnNpb24gfHwgMC4zLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA+IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MgPSB0aGlzLmJlYXRTZXR0aW5ncy5zbGljZSgwLCBiZWF0Q291bnQpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGNob3JkVGVtcGxhdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJhbmRvbUNob3JkR2VuZXJhdG9yIHtcbiAgICBwcml2YXRlIGNob3JkVHlwZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgYXZhaWxhYmxlQ2hvcmRzPzogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHVzZWRDaG9yZHM/OiBTZXQ8c3RyaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogTXVzaWNQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY2hvcmRUeXBlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNob3JkVHlwZSBpbiBwYXJhbXMuY2hvcmRTZXR0aW5ncykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5jaG9yZFNldHRpbmdzW2Nob3JkVHlwZV0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNob3JkVHlwZXMucHVzaChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hvcmRUeXBlcyA9IGNob3JkVHlwZXM7XG4gICAgICAgIHRoaXMudXNlZENob3JkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCkge1xuICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gKHRoaXMuYXZhaWxhYmxlQ2hvcmRzIHx8IFtdKS5maWx0ZXIoY2hvcmQgPT4gISh0aGlzLnVzZWRDaG9yZHMgfHwgbmV3IFNldCgpKS5oYXMoY2hvcmQpKTtcbiAgICAgICAgLy8gRmlyc3QgdHJ5IHRvIGFkZCB0aGUgc2ltcGxlc3QgY2hvcmRzXG4gICAgICAgIGZvciAoY29uc3Qgc2ltcGxlQ2hvcmRUeXBlIG9mIHRoaXMuY2hvcmRUeXBlcy5maWx0ZXIoY2hvcmRUeXBlID0+IFtcIm1halwiLCBcIm1pblwiXS5pbmNsdWRlcyhjaG9yZFR5cGUpKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgcmFuZG9tUm9vdD0wOyByYW5kb21Sb290PDEyOyByYW5kb21Sb290KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHNpbXBsZUNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21UeXBlID0gdGhpcy5jaG9yZFR5cGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2hvcmRUeXBlcy5sZW5ndGgpXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVJvb3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMik7XG4gICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHJhbmRvbVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgcmFuZG9tVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGNsZWFuVXAoKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVzZWRDaG9yZHM7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmF2YWlsYWJsZUNob3JkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2hvcmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlQ2hvcmRzICYmIHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggLSAzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9yZFR5cGUgPSB0aGlzLmF2YWlsYWJsZUNob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKGNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5hZGQoY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gdGhpcy5hdmFpbGFibGVDaG9yZHMuZmlsdGVyKGNob3JkID0+IGNob3JkICE9PSBjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgYWRkRm9yY2VkTWVsb2R5IH0gZnJvbSBcIi4vZm9yY2VkbWVsb2R5XCI7XG5pbXBvcnQgeyBOb25DaG9yZFRvbmUgfSBmcm9tIFwiLi9ub25jaG9yZHRvbmVzXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IGNsYXNzIFRlbnNpb24ge1xuICAgIG5vdEluU2NhbGU6IG51bWJlciA9IDA7XG4gICAgbW9kdWxhdGlvbjogbnVtYmVyID0gMDtcbiAgICBhbGxOb3Rlc1NhbWU6IG51bWJlciA9IDA7XG4gICAgY2hvcmRQcm9ncmVzc2lvbjogbnVtYmVyID0gMDtcbiAgICBrZWVwRG9taW5hbnRUb25lczogbnVtYmVyID0gMDtcbiAgICBwYXJhbGxlbEZpZnRoczogbnVtYmVyID0gMDtcbiAgICBzcGFjaW5nRXJyb3I6IG51bWJlciA9IDA7XG4gICAgY2FkZW5jZTogbnVtYmVyID0gMDtcbiAgICB0ZW5zaW9uaW5nSW50ZXJ2YWw6IG51bWJlciA9IDA7XG4gICAgc2Vjb25kSW52ZXJzaW9uOiBudW1iZXIgPSAwO1xuICAgIGRvdWJsZUxlYWRpbmdUb25lOiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdUb25lVXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5SnVtcDogbnVtYmVyID0gMDtcbiAgICBtZWxvZHlUYXJnZXQ6IG51bWJlciA9IDA7XG4gICAgdm9pY2VEaXJlY3Rpb25zOiBudW1iZXIgPSAwO1xuICAgIG92ZXJsYXBwaW5nOiBudW1iZXIgPSAwO1xuXG4gICAgZm9yY2VkTWVsb2R5OiBudW1iZXIgPSAwO1xuICAgIG5hYz86IE5vbkNob3JkVG9uZTtcblxuICAgIHRvdGFsVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGNvbW1lbnQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBnZXRUb3RhbFRlbnNpb24odmFsdWVzOiB7cGFyYW1zOiBNdXNpY1BhcmFtcywgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZTogbnVtYmVyfSkge1xuICAgICAgICBjb25zdCB7cGFyYW1zLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlfSA9IHZhbHVlcztcbiAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubm90SW5TY2FsZSAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1vZHVsYXRpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5hbGxOb3Rlc1NhbWU7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5jaG9yZFByb2dyZXNzaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMua2VlcERvbWluYW50VG9uZXM7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5wYXJhbGxlbEZpZnRocyAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNwYWNpbmdFcnJvcjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNhZGVuY2U7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy50ZW5zaW9uaW5nSW50ZXJ2YWw7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5zZWNvbmRJbnZlcnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmxlYWRpbmdUb25lVXA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlUYXJnZXQ7XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID4gNCkge1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keUp1bXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW5zaW9uICs9IHRoaXMubWVsb2R5SnVtcDtcbiAgICAgICAgfVxuICAgICAgICB0ZW5zaW9uICs9IHRoaXMudm9pY2VEaXJlY3Rpb25zO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMub3ZlcmxhcHBpbmc7XG5cbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmZvcmNlZE1lbG9keTtcblxuICAgICAgICB0aGlzLnRvdGFsVGVuc2lvbiA9IHRlbnNpb247XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIC8vIFByaW50IG9ubHkgcG9zaXRpdmUgdmFsdWVzXG4gICAgICAgIGNvbnN0IHRvUHJpbnQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzW2tleV0gJiYgdHlwZW9mIHRoaXNba2V5XSA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdG9QcmludFtrZXldID0gKHRoaXNba2V5XSBhcyB1bmtub3duIGFzIG51bWJlcikudG9GaXhlZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbW1lbnQsIC4uLmFyZ3MsIHRvUHJpbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4uYXJncywgdG9QcmludClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgdHlwZSBUZW5zaW9uUGFyYW1zID0ge1xuICAgIGRpdmlzaW9uZWROb3Rlcz86IERpdmlzaW9uZWRSaWNobm90ZXMsXG4gICAgYmVhdERpdmlzaW9uOiBudW1iZXIsXG4gICAgZnJvbU5vdGVzT3ZlcnJpZGU/OiBBcnJheTxOb3RlPixcbiAgICB0b05vdGVzOiBBcnJheTxOb3RlPixcbiAgICBjdXJyZW50U2NhbGU6IFNjYWxlLFxuICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2U/OiBudW1iZXIsXG4gICAgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICBtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsXG4gICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZz86IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lPzogc3RyaW5nLFxuICAgIHByZXZJbnZlcnNpb25OYW1lPzogU3RyaW5nLFxuICAgIG5ld0Nob3JkPzogQ2hvcmQsXG59XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogVGVuc2lvbiA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcsXG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgYmVhdERpdmlzaW9uLFxuICAgICAgICB9ID0gdmFsdWVzO1xuICAgIC8qXG4gICAgKiAgIEdldCB0aGUgdGVuc2lvbiBiZXR3ZWVuIHR3byBjaG9yZHNcbiAgICAqICAgQHBhcmFtIGZyb21DaG9yZDogQ2hvcmRcbiAgICAqICAgQHBhcmFtIHRvQ2hvcmQ6IENob3JkXG4gICAgKiAgIEByZXR1cm46IHRlbnNpb24gdmFsdWUgYmV0d2VlbiAtMSBhbmQgMVxuICAgICovXG5cbiAgICBsZXQgcHJldkNob3JkO1xuICAgIGxldCBwcmV2UHJldkNob3JkO1xuICAgIGxldCBwYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBwcmV2UGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgbGF0ZXN0Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGlmIChkaXZpc2lvbmVkTm90ZXMpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RGl2aXNpb24gPSBiZWF0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDtcbiAgICAgICAgbGV0IHRtcCA6IEFycmF5PE5vdGU+ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbl0gfHwgW10pKSB7XG4gICAgICAgICAgICAvLyBVc2Ugb3JpZ2luYWwgbm90ZXMsIG5vdCB0aGUgb25lcyB0aGF0IGhhdmUgYmVlbiB0dXJuZWQgaW50byBOQUNzXG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICB0bXAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKSkge1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZQcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2UGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgICAgIGZvciAobGV0IGk9YmVhdERpdmlzaW9uOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGF0ZXN0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzLmZpbHRlcihub3RlID0+IG5vdGUpLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZyb21Ob3Rlc092ZXJyaWRlKSB7XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IGZyb21Ob3Rlc092ZXJyaWRlO1xuICAgIH1cblxuICAgIGxldCBhbGxzYW1lID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIXBhc3NlZEZyb21Ob3Rlc1tpXSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2UGFzc2VkRnJvbU5vdGVzW2ldKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBhc3NlZEZyb21Ob3Rlc1tpXS5lcXVhbHModG9Ob3Rlc1tpXSkpIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldlBhc3NlZEZyb21Ob3Rlc1tpXS5lcXVhbHModG9Ob3Rlc1tpXSkpIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2Q2hvcmQgJiYgcHJldlByZXZDaG9yZCAmJiBuZXdDaG9yZCAmJiBwcmV2Q2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpICYmIHByZXZQcmV2Q2hvcmQudG9TdHJpbmcoKSA9PSBwcmV2Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBhbGxzYW1lID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGFsbHNhbWUpIHtcbiAgICAgICAgdGVuc2lvbi5hbGxOb3Rlc1NhbWUgPSAxMDA7XG4gICAgfVxuXG4gICAgbGV0IGZyb21Ob3RlcztcbiAgICBpZiAocGFzc2VkRnJvbU5vdGVzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgZnJvbU5vdGVzID0gdG9Ob3RlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tTm90ZXMgPSBwYXNzZWRGcm9tTm90ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgdG9TZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZXMgPSBmcm9tTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG5cbiAgICAvLyBJZiB0aGUgbm90ZXMgYXJlIG5vdCBpbiB0aGUgY3VycmVudCBzY2FsZSwgaW5jcmVhc2UgdGhlIHRlbnNpb25cbiAgICBsZXQgbm90ZXNOb3RJblNjYWxlOiBBcnJheTxudW1iZXI+ID0gW11cbiAgICBsZXQgbmV3U2NhbGU6IE51bGxhYmxlPFNjYWxlPiA9IG51bGw7XG4gICAgY29uc3QgbGVhZGluZ1RvbmUgPSAoY3VycmVudFNjYWxlLmtleSAtIDEgKyAyNCkgJSAxMlxuXG4gICAgaWYgKGN1cnJlbnRTY2FsZSkge1xuICAgICAgICBjb25zdCBzY2FsZVNlbWl0b25lcyA9IGN1cnJlbnRTY2FsZS5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICAgICAgbm90ZXNOb3RJblNjYWxlID0gdG9TZW1pdG9uZXMuZmlsdGVyKHNlbWl0b25lID0+ICFzY2FsZVNlbWl0b25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpO1xuICAgICAgICBub3Rlc05vdEluU2NhbGUgPSBub3Rlc05vdEluU2NhbGUuZmlsdGVyKHNlbWl0b25lID0+IHNlbWl0b25lICE9IGxlYWRpbmdUb25lKTtcbiAgICAgICAgaWYgKG5vdGVzTm90SW5TY2FsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBRdWljayByZXR1cm4sIHRoaXMgY2hvcmQgc3Vja3NcbiAgICAgICAgICAgIHRlbnNpb24ubm90SW5TY2FsZSArPSAxMDBcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDEuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgnc2Vjb25kJykgfHwgKHByZXZJbnZlcnNpb25OYW1lIHx8IFwiXCIpLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGZyb21TZW1pdG9uZSAtIHRvU2VtaXRvbmUpID4gMikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uIC09IDAuMTsgIC8vIFJvb3QgaW52ZXJzaW9ucyBhcmUgZ3JlYXRcbiAgICB9XG5cbiAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLCAgLy8gQ1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLCAgLy8gRlxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LCAgLy8gSFxuICAgICAgICBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICB9XG5cbiAgICBjb25zdCBsZWFkaW5nVG9uZVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lICsgMTE7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZSAlIDEyID09IGxlYWRpbmdUb25lU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmUgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwICs9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEgfHwgaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhcyBiYWRcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwIC09IDc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxlYWRpbmdUb25lQ291bnQgPSAwO1xuICAgIGZvciAoY29uc3QgdG9HbG9iYWxTZW1pdG9uZSBvZiB0b0dsb2JhbFNlbWl0b25lcykge1xuICAgICAgICBjb25zdCBzY2FsZUluZGV4OiBudW1iZXIgPSBzZW1pdG9uZVNjYWxlSW5kZXhbKHRvR2xvYmFsU2VtaXRvbmUgKyAxMikgJSAxMl07XG4gICAgICAgIGlmIChzY2FsZUluZGV4ID09IDYpIHtcbiAgICAgICAgICAgIGxlYWRpbmdUb25lQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobGVhZGluZ1RvbmVDb3VudCA+IDEpIHtcbiAgICAgICAgdGVuc2lvbi5kb3VibGVMZWFkaW5nVG9uZSArPSAxMDtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBkaXJlY3Rpb25zXG4gICAgY29uc3QgZGlyZWN0aW9uQ291bnRzID0ge1xuICAgICAgICBcInVwXCI6IDAsXG4gICAgICAgIFwiZG93blwiOiAwLFxuICAgICAgICBcInNhbWVcIjogMCxcbiAgICB9XG4gICAgY29uc3QgcGFydERpcmVjdGlvbiA9IFtdO1xuICAgIGxldCByb290QmFzc0RpcmVjdGlvbiA9IG51bGw7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBjb25zdCBkaWZmID0gdG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZTtcbiAgICAgICAgcGFydERpcmVjdGlvbltpXSA9IGRpZmYgPCAwID8gXCJkb3duXCIgOiBkaWZmID4gMCA/IFwidXBcIiA6IFwic2FtZVwiO1xuICAgICAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLmRvd24gKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA9PSAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMuc2FtZSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmICE9IDAgJiYgKGludmVyc2lvbk5hbWUgfHwgJycpLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgcm9vdEJhc3NEaXJlY3Rpb24gPSBkaWZmID4gMCA/ICd1cCcgOiAnZG93bic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSb290IGJhc3MgbWFrZXMgdXAgZm9yIG9uZSB1cC9kb3duXG4gICAgaWYgKHJvb3RCYXNzRGlyZWN0aW9uID09IFwidXBcIiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA+IDApIHtcbiAgICAgICAgZGlyZWN0aW9uQ291bnRzLmRvd24gLT0gMTtcbiAgICB9XG4gICAgaWYgKHJvb3RCYXNzRGlyZWN0aW9uID09IFwiZG93blwiICYmIGRpcmVjdGlvbkNvdW50cy51cCA+IDApIHtcbiAgICAgICAgZGlyZWN0aW9uQ291bnRzLnVwIC09IDE7XG4gICAgfVxuICAgIGlmIChkaXJlY3Rpb25Db3VudHMudXAgPiAyICYmIGRpcmVjdGlvbkNvdW50cy5kb3duIDwgMSkge1xuICAgICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSAzO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLmRvd24gPiAyICYmIGRpcmVjdGlvbkNvdW50cy51cCA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMztcbiAgICB9XG4gICAgaWYgKHBhcnREaXJlY3Rpb25bMF0gPT0gcGFydERpcmVjdGlvblszXSAmJiBwYXJ0RGlyZWN0aW9uWzBdICE9IFwic2FtZVwiKSB7XG4gICAgICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDU7XG4gICAgICAgIC8vIHJvb3QgYW5kIHNvcHJhbm9zIG1vdmluZyBpbiBzYW1lIGRpcmVjdGlvblxuICAgIH1cblxuICAgIC8vIFBhcmFsbGVsIG1vdGlvbiBhbmQgaGlkZGVuIGZpZnRoc1xuICAgIGZvciAobGV0IGk9MDsgaTx0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqPWkrMTsgajx0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbaV0gJiYgZnJvbUdsb2JhbFNlbWl0b25lc1tqXSA9PSB0b0dsb2JhbFNlbWl0b25lc1tqXSkge1xuICAgICAgICAgICAgICAgIC8vIFBhcnQgaSBhbmQgaiBhcmUgc3RheWluZyBzYW1lXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWxGcm9tID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgaWYgKGludGVydmFsIDwgMjAgJiYgaW50ZXJ2YWwgJSAxMiA9PSA3IHx8IGludGVydmFsICUgMTIgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFBvc3NpYmx5IGEgcGFyYWxsZWwsIGNvbnRyYXJ5IG9yIGhpZGRlbiBmaWZ0aC9vY3RhdmVcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gaW50ZXJ2YWxGcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgaW50ZXJ2YWwgaXMgaGlkZGVuXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgcGFydElEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgcGFydEpEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1tqXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbal07XG4gICAgICAgICAgICAgICAgLy8gaWYgKE1hdGguYWJzKHBhcnRJRGlyZWN0aW9uKSA+IDIpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gVXBwZXIgcGFydCBpcyBtYWtpbmcgYSBqdW1wXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmIChwYXJ0SkRpcmVjdGlvbiA8IDAgJiYgcGFydElEaXJlY3Rpb24gPCAwIHx8IHBhcnRKRGlyZWN0aW9uID4gMCAmJiBwYXJ0SURpcmVjdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTE7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNwYWNpbmcgZXJyb3JzXG4gICAgY29uc3QgcGFydDBUb1BhcnQxID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1sxXSk7XG4gICAgY29uc3QgcGFydDFUb1BhcnQyID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMV0gLSB0b0dsb2JhbFNlbWl0b25lc1syXSk7XG4gICAgY29uc3QgcGFydDJUb1BhcnQzID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMl0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSk7XG4gICAgaWYgKHBhcnQxVG9QYXJ0MiA+IDEyIHx8IHBhcnQwVG9QYXJ0MSA+IDEyIHx8IHBhcnQyVG9QYXJ0MyA+ICgxMiArIDcpKSB7XG4gICAgICAgIHRlbnNpb24uc3BhY2luZ0Vycm9yICs9IDU7XG4gICAgfVxuXG4gICAgLy8gT3ZlcmxhcHBpbmcgZXJyb3JcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBsb3dlckZyb21HVG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaSArIDFdO1xuICAgICAgICBjb25zdCBsb3dlclRvR1RvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpICsgMV07XG4gICAgICAgIGNvbnN0IHVwcGVyRnJvbUdUb25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHVwcGVyVG9HVG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2kgLSAxXTtcbiAgICAgICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBpZiAodXBwZXJUb0dUb25lIHx8IHVwcGVyRnJvbUdUb25lKSB7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZSA+IE1hdGgubWluKHVwcGVyVG9HVG9uZSB8fCAwLCB1cHBlckZyb21HVG9uZSB8fCAwKSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24ub3ZlcmxhcHBpbmcgKz0gMTA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvd2VyVG9HVG9uZSB8fCBsb3dlckZyb21HVG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmUgPCBNYXRoLm1heChsb3dlclRvR1RvbmUgfHwgMCwgbG93ZXJGcm9tR1RvbmUgfHwgMCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWVsb2R5IHRlbnNpb25cbiAgICAvLyBBdm9pZCBqdW1wcyB0aGF0IGFyZSBhdWcgb3IgN3RoIG9yIGhpZ2hlclxuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgaWYgKGludGVydmFsID49IDMpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID49IDUpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSA3KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMTApIHsgIC8vIDd0aCA9PSAxMFxuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSA2IHx8IGludGVydmFsID09IDgpIC8vIHRyaXRvbmUgKGF1ZyA0dGgpIG9yIGF1ZyA1dGhcbiAgICAgICAge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNykge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gOSkge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDI7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDAgcHJpaW1pXG4gICAgLy8gMSBwaWVuaSBzZWt1bnRpXG4gICAgLy8gMiBzdXVyaSBzZWt1bnRpXG4gICAgLy8gMyBwaWVuaSB0ZXJzc2lcbiAgICAvLyA0IHN1dXJpIHRlcnNzaVxuICAgIC8vIDUga3ZhcnR0aVxuICAgIC8vIDYgdHJpdG9udXNcbiAgICAvLyA3IGt2aW50dGlcbiAgICAvLyA4IHBpZW5pIHNla3N0aVxuICAgIC8vIDkgc3V1cmkgc2Vrc3RpXG4gICAgLy8gMTAgcGllbmkgc2VwdGltaVxuICAgIC8vIDExIHN1dXJpIHNlcHRpbWlcbiAgICAvLyAxMiBva3RhYXZpXG5cbiAgICAvLyBXYXMgdGhlcmUgYSBqdW1wIGJlZm9yZT9cbiAgICBpZiAobGF0ZXN0Tm90ZXMgJiYgbGF0ZXN0Tm90ZXMubGVuZ3RoID09IDQpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lcyA9IGxhdGVzdE5vdGVzLm1hcCgobikgPT4gZ2xvYmFsU2VtaXRvbmUobikpO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyhsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMykge1xuICAgICAgICAgICAgICAgIC8vIFRoZXJlIHdhcyBhIGp1bXAuIFdFIE1VU1QgR08gQkFDSyFcbiAgICAgICAgICAgICAgICAvLyBCYXNpY2FsbHkgdGhlIHRvR2xvYmFsU2VtaXRvbmUgbXVzdCBiZSBiZXR3ZWVuIHRoZSBwcmV2RnJvbUdsb2JhbFNlbWl0b25lIGFuZCB0aGUgZnJvbUdsb2JhbFNlbWl0b25lXG4gICAgICAgICAgICAgICAgLy8gVU5MRVNTIHdlJ3JlIG91dGxpbmluZyBhIHRyaWFkLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd291bGQgbWVhbiB0aGF0IGFmdGVyIGEgNHRoIHVwLCB3ZSBuZWVkIHRvIGdvIHVwIGFub3RoZXIgM3JkXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldkZyb21TZW1pdG9uZSA9IGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uTXVsdGlwbGllciA9IGZyb21TZW1pdG9uZSA+IHByZXZGcm9tU2VtaXRvbmUgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEludGVydmFsID0gZGlyZWN0aW9uTXVsdGlwbGllciAqICh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlub3IgM3JkIHVwLCB0aGVuIG1haiB0aGlyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWpvciAzcmQgdXAsIHRoZW4gbWlub3IgM3JkIHVwLiBUaGF0J3MgYSByb290IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIHBlcmZlY3QgNHRoIHVwLiBUaGF0J3MgYSBmaXJzdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtaW5vciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyZmVjdCA0dGggdXAsIHRoZW4gbWFqb3IgM3JkIHVwLiBUaGF0J3MgYSBzZWNvbmQgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBIaWdoZXIgdGhhbiB0aGF0LCBubyB0cmlhZCBpcyBwb3NzaWJsZS5cbiAgICAgICAgICAgICAgICBpZiAoKGZyb21TZW1pdG9uZSA+PSBwcmV2RnJvbVNlbWl0b25lICYmIHRvU2VtaXRvbmUgPj0gZnJvbVNlbWl0b25lKSB8fCAoZnJvbVNlbWl0b25lIDw9IHByZXZGcm9tU2VtaXRvbmUgJiYgdG9TZW1pdG9uZSA8PSBmcm9tU2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdCBnb2luZiBiYWNrIGRvd24vdXAuLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGludGVydmFsIDw9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPD0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDQ7ICAvLyBOb3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTAwOyAgLy8gVGVycmlibGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGJhY2sgZG93bi91cC4uLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrSW50ZXJ2YWwgPSBNYXRoLmFicyh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhY2tJbnRlcnZhbCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGJhY2sgdG9vIG11Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcmV2UGFzc2VkRnJvbUdUb25lcyA9IHByZXZQYXNzZWRGcm9tTm90ZXMgPyBwcmV2UGFzc2VkRnJvbU5vdGVzLm1hcCgobikgPT4gZ2xvYmFsU2VtaXRvbmUobikpIDogW107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTwxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lc0ZvclRoaXNQYXJ0ID0gW107XG4gICAgICAgICAgICBpZiAocHJldlBhc3NlZEZyb21HVG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKHByZXZQYXNzZWRGcm9tR1RvbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdUb25lc0ZvclRoaXNQYXJ0LnB1c2goZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAobGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXSkge1xuICAgICAgICAgICAgICAgIGdUb25lc0ZvclRoaXNQYXJ0LnB1c2gobGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKHRvR2xvYmFsU2VtaXRvbmVzW2ldKTtcblxuICAgICAgICAgICAgbGV0IGdlbmVyYWxEaXJlY3Rpb24gPSAwO1xuICAgICAgICAgICAgLy8gR2V0IGRpcmVjdGlvbnMgYmVmb3JlIGxhdGVzdCBub3Rlc1xuICAgICAgICAgICAgLy8gRS5nLiBpZiB0aGUgbm90ZSB2YWx1ZXMgaGF2ZSBiZWVuIDAsIDEsIDQsIDBcbiAgICAgICAgICAgIC8vIHRoZSBnZW5lcmFsRGlyZWN0aW9uIHdvdWxkIGJlIDEgKyA0ID09IDUsIHdoaWNoIG1lYW5zIHRoYXQgZXZlbiB0aG91Z2ggdGhlXG4gICAgICAgICAgICAvLyBnbG9iYWwgZGlyZWN0aW9uIGlzIFwic2FtZVwiLCB0aGUgZ2VuZXJhbCBkaXJlY3Rpb24gaXMgXCJ1cFwiXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8Z1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhbERpcmVjdGlvbiArPSBnVG9uZXNGb3JUaGlzUGFydFtqKzFdIC0gZ1RvbmVzRm9yVGhpc1BhcnRbal07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbERpcmVjdGlvbiA9IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdIC0gZ1RvbmVzRm9yVGhpc1BhcnRbMF07XG4gICAgICAgICAgICBjb25zdCBmaW5hbERpcmVjdGlvbiA9IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdIC0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcImZpbmFsRGlyZWN0aW9uOiBcIiArIGZpbmFsRGlyZWN0aW9uICsgXCIsIGdsb2JhbERpcmVjdGlvbjogXCIgKyBnbG9iYWxEaXJlY3Rpb24gKyBcIiwgZ2VuZXJhbERpcmVjdGlvbjogXCIgKyBnZW5lcmFsRGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPT0gMCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDAuNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVMaW1pdCA9IHN0YXJ0aW5nTm90ZXMocGFyYW1zKS5zZW1pdG9uZUxpbWl0c1tpXTtcblxuICAgICAgICAgICAgbGV0IHRhcmdldE5vdGUgPSBzZW1pdG9uZUxpbWl0WzFdIC0gNDtcbiAgICAgICAgICAgIHRhcmdldE5vdGUgLT0gaSAqIDI7XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXROb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb24gPSBwYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247XG4gICAgICAgICAgICBmb3IgKGxldCBkaXY9YmVhdERpdmlzaW9uOyBkaXY+YXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247IGRpdi0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90ZXMgPSAoZGl2aXNpb25lZE5vdGVzIHx8IHt9KVtkaXZdIHx8IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJldk5vdGUgb2Ygbm90ZXMuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSBpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsU2VtaXRvbmUocHJldk5vdGUubm90ZSkgPT0gdGFyZ2V0Tm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm90ZVJlYWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0Tm90ZVJlYWNoZWQpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIlRhcmdldCBub3RlIHJlYWNoZWQgXCI7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdGFyZ2V0Tm90ZSkgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyB1cFxuICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0YXJnZXROb3RlKSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGNsb3NlIHRvIHRoZSB0YXJnZXQgbm90ZSwgbGV0J3MgTk9UIGEgbG90IHVwXG4gICAgICAgICAgICAgICAgICAgIGlmIChnZW5lcmFsRGlyZWN0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gZ2VuZXJhbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA8IDAgJiYgZmluYWxEaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW4gZG93biwgbm90IGdvb2RcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gLTEgKiBnbG9iYWxEaXJlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVuc2lvbjtcbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlLCBTZW1pdG9uZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zLCBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcblxuZXhwb3J0IGNvbnN0IEJFQVRfTEVOR1RIID0gMTI7XG5cbnR5cGUgUGlja051bGxhYmxlPFQ+ID0ge1xuICAgIFtQIGluIGtleW9mIFQgYXMgbnVsbCBleHRlbmRzIFRbUF0gPyBQIDogbmV2ZXJdOiBUW1BdXG59XG5cbnR5cGUgUGlja05vdE51bGxhYmxlPFQ+ID0ge1xuICAgIFtQIGluIGtleW9mIFQgYXMgbnVsbCBleHRlbmRzIFRbUF0gPyBuZXZlciA6IFBdOiBUW1BdXG59XG5cbmV4cG9ydCB0eXBlIE9wdGlvbmFsTnVsbGFibGU8VD4gPSB7XG4gICAgW0sgaW4ga2V5b2YgUGlja051bGxhYmxlPFQ+XT86IEV4Y2x1ZGU8VFtLXSwgbnVsbD5cbn0gJiB7XG4gICAgICAgIFtLIGluIGtleW9mIFBpY2tOb3ROdWxsYWJsZTxUPl06IFRbS11cbiAgICB9XG5cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lRGlzdGFuY2UgPSAodG9uZTE6IG51bWJlciwgdG9uZTI6IG51bWJlcikgPT4ge1xuICAgIC8vIGRpc3RhbmNlIGZyb20gMCB0byAxMSBzaG91bGQgYmUgMVxuICAgIC8vIDAgLSAxMSArIDEyID0+IDFcbiAgICAvLyAxMSAtIDAgKyAxMiA9PiAyMyA9PiAxMVxuXG4gICAgLy8gMCAtIDYgKyAxMiA9PiA2XG4gICAgLy8gNiAtIDAgKyAxMiA9PiAxOCA9PiA2XG5cbiAgICAvLyAwICsgNiAtIDMgKyA2ID0gNiAtIDkgPSAtM1xuICAgIC8vIDYgKyA2IC0gOSArIDYgPSAxMiAtIDE1ID0gMCAtIDMgPSAtM1xuICAgIC8vIDExICsgNiAtIDAgKyA2ID0gMTcgLSA2ID0gNSAtIDYgPSAtMVxuICAgIC8vIDAgKyA2IC0gMTEgKyA2ID0gNiAtIDE3ID0gNiAtIDUgPSAxXG5cbiAgICAvLyAoNiArIDYpICUgMTIgPSAwXG4gICAgLy8gKDUgKyA2KSAlIDEyID0gMTFcbiAgICAvLyBSZXN1bHQgPSAxMSEhISFcblxuICAgIHJldHVybiBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5hYnModG9uZTEgLSB0b25lMiksXG4gICAgICAgIE1hdGguYWJzKCh0b25lMSArIDYpICUgMTIgLSAodG9uZTIgKyA2KSAlIDEyKVxuICAgICk7XG59XG5cbmV4cG9ydCBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXggPSAoc2NhbGU6IFNjYWxlKTogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9PiAoe1xuICAgIFtzY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsXG4gICAgW3NjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSxcbiAgICBbc2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLFxuICAgIFtzY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsXG4gICAgW3NjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCxcbiAgICBbc2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LFxuICAgIFtzY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsXG59KVxuXG5cbmV4cG9ydCBjb25zdCBuZXh0R1RvbmVJblNjYWxlID0gKGdUb25lOiBTZW1pdG9uZSwgaW5kZXhEaWZmOiBudW1iZXIsIHNjYWxlOiBTY2FsZSk6IE51bGxhYmxlPG51bWJlcj4gPT4ge1xuICAgIGxldCBnVG9uZTEgPSBnVG9uZTtcbiAgICBjb25zdCBzY2FsZUluZGV4ZXMgPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpXG4gICAgbGV0IHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSArIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgZ1RvbmUxID0gZ1RvbmUgLSAxO1xuICAgICAgICBzY2FsZUluZGV4ID0gc2NhbGVJbmRleGVzW2dUb25lMSAlIDEyXTtcbiAgICB9XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuZXdTY2FsZUluZGV4ID0gKHNjYWxlSW5kZXggKyBpbmRleERpZmYpICUgNztcbiAgICBjb25zdCBuZXdTZW1pdG9uZSA9IHNjYWxlLm5vdGVzW25ld1NjYWxlSW5kZXhdLnNlbWl0b25lO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gc2VtaXRvbmVEaXN0YW5jZShnVG9uZTEgJSAxMiwgbmV3U2VtaXRvbmUpO1xuICAgIGNvbnN0IG5ld0d0b25lID0gZ1RvbmUxICsgKGRpc3RhbmNlICogKGluZGV4RGlmZiA+IDAgPyAxIDogLTEpKTtcblxuICAgIHJldHVybiBuZXdHdG9uZTtcbn1cblxuXG5leHBvcnQgY29uc3Qgc3RhcnRpbmdOb3RlcyA9IChwYXJhbXM6IE11c2ljUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcDFOb3RlID0gcGFyYW1zLnBhcnRzWzBdLm5vdGUgfHwgXCJGNFwiO1xuICAgIGNvbnN0IHAyTm90ZSA9IHBhcmFtcy5wYXJ0c1sxXS5ub3RlIHx8IFwiQzRcIjtcbiAgICBjb25zdCBwM05vdGUgPSBwYXJhbXMucGFydHNbMl0ubm90ZSB8fCBcIkEzXCI7XG4gICAgY29uc3QgcDROb3RlID0gcGFyYW1zLnBhcnRzWzNdLm5vdGUgfHwgXCJDM1wiO1xuXG4gICAgY29uc3Qgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMgPSBbXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAxTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwMk5vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDNOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHA0Tm90ZSkpLFxuICAgIF1cblxuICAgIGNvbnN0IHNlbWl0b25lTGltaXRzID0gW1xuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMF0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzBdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzFdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1sxXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1syXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMl0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbM10gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzNdICsgMTIgLSA1XSxcbiAgICBdXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsXG4gICAgICAgIHNlbWl0b25lTGltaXRzLFxuICAgIH1cbn1cblxuXG5jb25zdCBteVNlbWl0b25lU3RyaW5nczoge1trZXk6IG51bWJlcl06IHN0cmluZ30gPSB7XG4gICAgMDogXCJDXCIsXG4gICAgMTogXCJDI1wiLFxuICAgIDI6IFwiRFwiLFxuICAgIDM6IFwiRCNcIixcbiAgICA0OiBcIkVcIixcbiAgICA1OiBcIkZcIixcbiAgICA2OiBcIkYjXCIsXG4gICAgNzogXCJHXCIsXG4gICAgODogXCJHI1wiLFxuICAgIDk6IFwiQVwiLFxuICAgIDEwOiBcIkEjXCIsXG4gICAgMTE6IFwiQlwiLFxufVxuXG5cbmV4cG9ydCBjb25zdCBnVG9uZVN0cmluZyA9IChnVG9uZTogbnVtYmVyIHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFnVG9uZSkge1xuICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgfVxuICAgIHJldHVybiBgJHtteVNlbWl0b25lU3RyaW5nc1tnVG9uZSAlIDEyXX0ke01hdGguZmxvb3IoZ1RvbmUgLyAxMil9YDtcbn1cblxuXG5leHBvcnQgY29uc3QgYXJyYXlPcmRlckJ5ID0gZnVuY3Rpb24gKGFycmF5OiBBcnJheTxhbnk+LCBzZWxlY3RvcjogQ2FsbGFibGVGdW5jdGlvbiwgZGVzYyA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIFsuLi5hcnJheV0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBhID0gc2VsZWN0b3IoYSk7XG4gICAgICAgIGIgPSBzZWxlY3RvcihiKTtcblxuICAgICAgICBpZiAoYSA9PSBiKSByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIChkZXNjID8gYSA+IGIgOiBhIDwgYikgPyAtMSA6IDE7XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGNob3JkVGVtcGxhdGVzOiB7IFtrZXk6IHN0cmluZ106IEFycmF5PG51bWJlcj4gfSA9IHtcbiAgICBtYWo6IFswLCA0LCA3XSxcbiAgICBtaW46IFswLCAzLCA3XSxcbiAgICBkaW06IFswLCAzLCA2XSxcbiAgICBhdWc6IFswLCA0LCA4XSxcbiAgICBtYWo3OiBbMCwgNCwgNywgMTFdLFxuICAgIG1pbjc6IFswLCAzLCA3LCAxMF0sXG4gICAgZG9tNzogWzAsIDQsIDcsIDEwXSxcbiAgICBzdXMyOiBbMCwgMiwgN10sXG4gICAgc3VzNDogWzAsIDUsIDddLFxufVxuXG5cbmV4cG9ydCBjbGFzcyBDaG9yZCB7XG4gICAgcHVibGljIG5vdGVzOiBBcnJheTxOb3RlPjtcbiAgICBwdWJsaWMgcm9vdDogbnVtYmVyO1xuICAgIHB1YmxpYyBjaG9yZFR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIC8vIEZpbmQgY29ycmVjdCBTZW1pdG9uZSBrZXlcbiAgICAgICAgY29uc3Qgc2VtaXRvbmVLZXlzID0gT2JqZWN0LmtleXMoU2VtaXRvbmUpLmZpbHRlcihrZXkgPT4gKFNlbWl0b25lIGFzIGFueSlba2V5XSBhcyBudW1iZXIgPT09IHRoaXMubm90ZXNbMF0uc2VtaXRvbmUpO1xuICAgICAgICBpZiAoc2VtaXRvbmVLZXlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnRvU3RyaW5nKCkpLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VtaXRvbmVLZXkgPSBzZW1pdG9uZUtleXMuZmlsdGVyKGtleSA9PiBrZXkuaW5kZXhPZignYicpID09IC0xICYmIGtleS5pbmRleE9mKCdzJykgPT0gLTEpWzBdIHx8IHNlbWl0b25lS2V5c1swXTtcbiAgICAgICAgc2VtaXRvbmVLZXkgPSBzZW1pdG9uZUtleS5yZXBsYWNlKCdzJywgJyMnKTtcbiAgICAgICAgcmV0dXJuIHNlbWl0b25lS2V5ICsgdGhpcy5jaG9yZFR5cGU7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHNlbWl0b25lT3JOYW1lOiBudW1iZXIgfCBzdHJpbmcsIGNob3JkVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBzZW1pdG9uZTtcbiAgICAgICAgaWYgKHR5cGVvZiBzZW1pdG9uZU9yTmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgc2VtaXRvbmUgPSBzZW1pdG9uZU9yTmFtZS5tYXRjaCgvXlxcZCsvKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSBzZW1pdG9uZU9yTmFtZS5tYXRjaCgvXlxcZCsoLiopLyk7XG4gICAgICAgICAgICBpZiAoc2VtaXRvbmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBjaG9yZCBuYW1lIFwiICsgc2VtaXRvbmVPck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyc2VkVHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGNob3JkIG5hbWUgXCIgKyBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbWl0b25lID0gcGFyc2VJbnQoc2VtaXRvbmVbMF0pO1xuICAgICAgICAgICAgY2hvcmRUeXBlID0gY2hvcmRUeXBlIHx8IHBhcnNlZFR5cGVbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHNlbWl0b25lT3JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdCA9IHBhcnNlSW50KGAke3NlbWl0b25lfWApO1xuICAgICAgICB0aGlzLmNob3JkVHlwZSA9IGNob3JkVHlwZSB8fCBcIj9cIjtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBjaG9yZFRlbXBsYXRlc1t0aGlzLmNob3JkVHlwZV07XG4gICAgICAgIGlmICh0ZW1wbGF0ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IFwiVW5rbm93biBjaG9yZCB0eXBlOiBcIiArIGNob3JkVHlwZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vdGVzID0gW107XG4gICAgICAgIGZvciAobGV0IG5vdGUgb2YgdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMubm90ZXMucHVzaChuZXcgTm90ZSh7IHNlbWl0b25lOiAoc2VtaXRvbmUgKyBub3RlKSAlIDEyLCBvY3RhdmU6IDEgfSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCB0eXBlIE51bGxhYmxlPFQ+ID0gVCB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIE11c2ljUmVzdWx0ID0ge1xuICAgIGNob3JkOiBDaG9yZCxcbiAgICB0ZW5zaW9uOiBudW1iZXIsXG4gICAgc2NhbGU6IFNjYWxlLFxufVxuXG5leHBvcnQgdHlwZSBSaWNoTm90ZSA9IHtcbiAgICBub3RlOiBOb3RlLFxuICAgIG9yaWdpbmFsTm90ZT86IE5vdGUsXG4gICAgZHVyYXRpb246IG51bWJlcixcbiAgICBmcmVxPzogbnVtYmVyLFxuICAgIGNob3JkPzogQ2hvcmQsXG4gICAgcGFydEluZGV4OiBudW1iZXIsXG4gICAgc2NhbGU/OiBTY2FsZSxcbiAgICBiZWFtPzogc3RyaW5nLFxuICAgIHRpZT86IHN0cmluZyxcbiAgICB0ZW5zaW9uPzogVGVuc2lvbixcbiAgICBpbnZlcnNpb25OYW1lPzogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBEaXZpc2lvbmVkUmljaG5vdGVzID0ge1xuICAgIFtrZXk6IG51bWJlcl06IEFycmF5PFJpY2hOb3RlPixcbn1cblxuZXhwb3J0IGNvbnN0IGdsb2JhbFNlbWl0b25lID0gKG5vdGU6IE5vdGUpID0+IHtcbiAgICByZXR1cm4gbm90ZS5zZW1pdG9uZSArICgobm90ZS5vY3RhdmUpICogMTIpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0Q2xvc2VzdE9jdGF2ZSA9IChub3RlOiBOb3RlLCB0YXJnZXROb3RlOiBOdWxsYWJsZTxOb3RlPiA9IG51bGwsIHRhcmdldFNlbWl0b25lOiBOdWxsYWJsZTxudW1iZXI+ID0gbnVsbCkgPT4ge1xuICAgIGxldCBzZW1pdG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuICAgIGlmICghdGFyZ2V0Tm90ZSAmJiAhdGFyZ2V0U2VtaXRvbmUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFyZ2V0IG5vdGUgb3Igc2VtaXRvbmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRhcmdldFNlbWl0b25lID0gdGFyZ2V0U2VtaXRvbmUgfHwgZ2xvYmFsU2VtaXRvbmUodGFyZ2V0Tm90ZSBhcyBOb3RlKTtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3Nlc3Qgb2N0YXZlOiBcIiwgc2VtaXRvbmUsIHRhcmdldFNlbWl0b25lKTtcbiAgICAvLyBVc2luZyBtb2R1bG8gaGVyZSAtPiAtNyAlIDEyID0gLTdcbiAgICAvLyAtMTMgJSAxMiA9IC0xXG4gICAgaWYgKHNlbWl0b25lID09IHRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgIHJldHVybiBub3RlLm9jdGF2ZTtcbiAgICB9XG4gICAgY29uc3QgZGVsdGE6IG51bWJlciA9IHRhcmdldFNlbWl0b25lID4gc2VtaXRvbmUgPyAxMiA6IC0xMjtcbiAgICBsZXQgcmV0ID0gMDtcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3QgY2xlYW5PY3RhdmUgPSAob2N0YXZlOiBudW1iZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG9jdGF2ZSwgMiksIDYpO1xuICAgIH1cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpKys7XG4gICAgICAgIGlmIChpID4gMTAwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5maW5pdGUgbG9vcFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzZW1pdG9uZSArPSBkZWx0YTtcbiAgICAgICAgcmV0ICs9IGRlbHRhIC8gMTI7ICAvLyBIb3cgbWFueSBvY3RhdmVzIHdlIGNoYW5nZWRcbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lID49IHRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNlbWl0b25lIC0gdGFyZ2V0U2VtaXRvbmUpID4gTWF0aC5hYnMoc2VtaXRvbmUgLSAxMiAtIHRhcmdldFNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSB3ZW50IHRvbyBmYXIsIGdvIG9uZSBiYWNrXG4gICAgICAgICAgICAgICAgICAgIHJldCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3Nlc3Qgb2N0YXZlIHJlczogXCIsIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KSwgcmV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW5PY3RhdmUobm90ZS5vY3RhdmUgKyByZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lIDw9IHRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNlbWl0b25lIC0gdGFyZ2V0U2VtaXRvbmUpID4gTWF0aC5hYnMoc2VtaXRvbmUgKyAxMiAtIHRhcmdldFNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSB3ZW50IHRvbyBmYXIsIGdvIG9uZSBiYWNrXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3Nlc3Qgb2N0YXZlIHJlczogXCIsIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KSwgcmV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW5PY3RhdmUobm90ZS5vY3RhdmUgKyByZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgbWFqU2NhbGVDaXJjbGU6IHsgW2tleTogbnVtYmVyXTogQXJyYXk8bnVtYmVyPiB9ID0ge31cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkNdID0gW1NlbWl0b25lLkcsIFNlbWl0b25lLkZdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5HXSA9IFtTZW1pdG9uZS5ELCBTZW1pdG9uZS5DXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRF0gPSBbU2VtaXRvbmUuQSwgU2VtaXRvbmUuR11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkFdID0gW1NlbWl0b25lLkUsIFNlbWl0b25lLkRdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5FXSA9IFtTZW1pdG9uZS5CLCBTZW1pdG9uZS5BXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQl0gPSBbU2VtaXRvbmUuRnMsIFNlbWl0b25lLkVdXG5cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkZdID0gW1NlbWl0b25lLkMsIFNlbWl0b25lLkJiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQmJdID0gW1NlbWl0b25lLkYsIFNlbWl0b25lLkViXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRWJdID0gW1NlbWl0b25lLkJiLCBTZW1pdG9uZS5BYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkFiXSA9IFtTZW1pdG9uZS5FYiwgU2VtaXRvbmUuRGJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5EYl0gPSBbU2VtaXRvbmUuQWIsIFNlbWl0b25lLkdiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR2JdID0gW1NlbWl0b25lLkRiLCBTZW1pdG9uZS5DYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkNiXSA9IFtTZW1pdG9uZS5HYiwgU2VtaXRvbmUuRmJdXG5cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlRGlmZmVyZW5jZSA9IChzZW1pdG9uZTE6IG51bWJlciwgc2VtaXRvbmUyOiBudW1iZXIpID0+IHtcbiAgICAvLyBHaXZlbiB0d28gbWFqb3Igc2NhbGVzLCByZXR1cm4gaG93IGNsb3NlbHkgcmVsYXRlZCB0aGV5IGFyZVxuICAgIC8vIDAgPSBzYW1lIHNjYWxlXG4gICAgLy8gMSA9IEUuRy4gQyBhbmQgRiBvciBDIGFuZCBHXG4gICAgbGV0IGN1cnJlbnRWYWwgPSBtYWpTY2FsZUNpcmNsZVtzZW1pdG9uZTFdO1xuICAgIGlmIChzZW1pdG9uZTEgPT0gc2VtaXRvbmUyKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRWYWwuaW5jbHVkZXMoc2VtaXRvbmUyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0N1cnJlbnRWYWwgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3Qgc2VtaXRvbmUgb2YgY3VycmVudFZhbCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBuZXdTZW1pdG9uZSBvZiBtYWpTY2FsZUNpcmNsZVtzZW1pdG9uZV0pIHtcbiAgICAgICAgICAgICAgICBuZXdDdXJyZW50VmFsLmFkZChuZXdTZW1pdG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFZhbCA9IFsuLi5uZXdDdXJyZW50VmFsXSBhcyBBcnJheTxudW1iZXI+O1xuICAgIH1cbiAgICByZXR1cm4gMTI7XG59XG5cbmV4cG9ydCBjb25zdCBnZXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIGRpdmlzaW9uOiBudW1iZXIsIHBhcnRJbmRleDogbnVtYmVyKTogUmljaE5vdGUgfCBudWxsID0+IHtcbiAgICBpZiAoZGl2aXNpb24gaW4gZGl2aXNpb25lZE5vdGVzKSB7XG4gICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICBpZiAobm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJoeXRobU5lZWRlZER1cmF0aW9ucyhtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpIHtcbiAgICBjb25zdCBtZWxvZHlSaHl0aG1TdHJpbmcgPSBtYWluUGFyYW1zLm1lbG9keVJoeXRobTtcbiAgICAvLyBGaWd1cmUgb3V0IHdoYXQgbmVlZHMgdG8gaGFwcGVuIGVhY2ggYmVhdCB0byBnZXQgb3VyIG1lbG9keVxuICAgIGxldCByaHl0aG1EaXZpc2lvbiA9IDA7XG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zOiB7IFtrZXk6IG51bWJlcl06IG51bWJlcjsgfSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVsb2R5Umh5dGhtU3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJoeXRobSA9IG1lbG9keVJoeXRobVN0cmluZ1tpXTtcbiAgICAgICAgaWYgKHJoeXRobSA9PSBcIldcIikge1xuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIICogNDtcbiAgICAgICAgICAgIHJoeXRobURpdmlzaW9uICs9IEJFQVRfTEVOR1RIICogNDtcbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfSBlbHNlIGlmIChyaHl0aG0gPT0gXCJIXCIpIHtcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAqIDI7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAqIDI7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiUVwiKSB7XG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiRVwiKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGRpdmlzaW9uIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBFaWdodGhcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAvIDI7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAvIDI7XG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiU1wiKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGRpdmlzaW9uIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBTaXh0ZWVudGhcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAvIDQ7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAvIDQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJoeXRobU5lZWRlZER1cmF0aW9ucztcbn1cblxuXG5leHBvcnQgdHlwZSBNZWxvZHlOZWVkZWRUb25lID0ge1xuICAgIFtrZXk6IG51bWJlcl06IHtcbiAgICAgICAgdG9uZTogbnVtYmVyLFxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyLFxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZWxvZHlOZWVkZWRUb25lcyhtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpOiBNZWxvZHlOZWVkZWRUb25lIHtcbiAgICBjb25zdCByaHl0aG1OZWVkZWREdXJhdGlvbnMgPSBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtcyk7XG4gICAgY29uc3QgZm9yY2VkTWVsb2R5QXJyYXkgPSBtYWluUGFyYW1zLmZvcmNlZE1lbG9keSB8fCBcIlwiO1xuICAgIGNvbnN0IHJldDogTWVsb2R5TmVlZGVkVG9uZSA9IHt9O1xuICAgIC8vIEZpZ3VyZSBvdXQgd2hhdCBuZWVkcyB0byBoYXBwZW4gZWFjaCBiZWF0IHRvIGdldCBvdXIgbWVsb2R5XG4gICAgbGV0IGNvdW50ZXIgPSAtMTtcbiAgICBmb3IgKGNvbnN0IGRpdmlzaW9uIGluIHJoeXRobU5lZWRlZER1cmF0aW9ucykge1xuICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIGNvbnN0IGRpdmlzaW9uTnVtID0gcGFyc2VJbnQoZGl2aXNpb24pO1xuICAgICAgICByZXRbZGl2aXNpb25OdW1dID0ge1xuICAgICAgICAgICAgXCJkdXJhdGlvblwiOiByaHl0aG1OZWVkZWREdXJhdGlvbnNbZGl2aXNpb25OdW1dLFxuICAgICAgICAgICAgXCJ0b25lXCI6IGZvcmNlZE1lbG9keUFycmF5W2NvdW50ZXJdLFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBtYWtlTXVzaWMsIGJ1aWxkVGFibGVzLCBtYWtlTWVsb2R5IH0gZnJvbSBcIi4vc3JjL2Nob3Jkc1wiXG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9zcmMvcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgRGl2aXNpb25lZFJpY2hub3RlcyB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5idWlsZFRhYmxlcygpXG5cbnNlbGYub25tZXNzYWdlID0gKGV2ZW50OiB7IGRhdGE6IHsgcGFyYW1zOiBzdHJpbmcsIG5ld01lbG9keTogdW5kZWZpbmVkIHwgYm9vbGVhbiwgZ2l2ZVVwOiB1bmRlZmluZWQgfCBib29sZWFuIH0gfSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiR290IG1lc3NhZ2VcIiwgZXZlbnQuZGF0YSk7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IE1haW5NdXNpY1BhcmFtcyhKU09OLnBhcnNlKGV2ZW50LmRhdGEucGFyYW1zIHx8IFwie31cIikpO1xuXG4gICAgaWYgKGV2ZW50LmRhdGEubmV3TWVsb2R5KSB7XG4gICAgICAgIG1ha2VNZWxvZHkoKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMsIHBhcmFtcyk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMpKX0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmRhdGEuZ2l2ZVVwKSB7XG4gICAgICAgIChzZWxmIGFzIGFueSkuZ2l2ZVVQID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGFueT47XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IChjdXJyZW50QmVhdDogbnVtYmVyLCBkaXZpc2lvbmVkUmljaE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzKSA9PiB7XG4gICAgICAgIGlmICgoc2VsZiBhcyBhbnkpLmdpdmVVUCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZ2l2ZVVQXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkaXZpc2lvbmVkUmljaE5vdGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmljaE5vdGVzID0gZGl2aXNpb25lZFJpY2hOb3Rlc1tjdXJyZW50QmVhdCAqIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgaWYgKGN1cnJlbnRCZWF0ICE9IG51bGwgJiYgcmljaE5vdGVzICYmIHJpY2hOb3Rlc1swXSAmJiByaWNoTm90ZXNbMF0uY2hvcmQpIHtcbiAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCZWF0LFxuICAgICAgICAgICAgICAgICAgICBjaG9yZDogcmljaE5vdGVzWzBdLmNob3JkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRpdmlzaW9uZWRSaWNoTm90ZXMpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWFrZU11c2ljKHBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjaykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IHJlc3VsdC5kaXZpc2lvbmVkTm90ZXM7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkaXZpc2lvbmVkTm90ZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzID0gZGl2aXNpb25lZE5vdGVzO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRpdmlzaW9uZWROb3RlcykpfSk7XG5cblxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtlcnJvcjogZXJyfSk7XG4gICAgfSk7XG5cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=