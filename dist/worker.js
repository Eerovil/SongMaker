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

const scalesForNotes = (notes, params) => {
    const scales = new Set();
    // First add all scales
    for (const scaleSlug in params.scaleSettings) {
        const template = params.scaleSettings[scaleSlug];
        if (template.enabled) {
            for (let semitone = 0; semitone < 12; semitone++) {
                const scale = new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Scale({ key: semitone, template: musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.ScaleTemplates[scaleSlug] });
                const semitones = scale.notes.map(note => note.semitone);
                // const leadingTone = (scale.key - 1 + 24) % 12;
                // if (!semitones.includes(leadingTone)) {
                //     semitones.push(leadingTone);
                // }
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

const buildTriadOn = (semitone, scale) => {
    const scaleIndex = scale.notes.findIndex(note => note.semitone === semitone);
    if (!scaleIndex || scaleIndex < 0) {
        return null;
    }
    const note0Semitone = scale.notes[(scaleIndex + 0) % 7].semitone;
    const note1Semitone = scale.notes[(scaleIndex + 2) % 7].semitone;
    const note2Semitone = scale.notes[(scaleIndex + 4) % 7].semitone;
    let chordType = '';
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.semitoneDistance)(note0Semitone, note1Semitone) === 4) {
        chordType = 'maj';
    }
    else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.semitoneDistance)(note0Semitone, note1Semitone) === 3) {
        chordType = 'min';
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.semitoneDistance)(note1Semitone, note2Semitone) === 3) {
            chordType = 'dim';
        }
    }
    if (!chordType) {
        return null;
    }
    const chord = new _utils__WEBPACK_IMPORTED_MODULE_0__.Chord(note0Semitone, chordType);
    return chord;
};
const chordProgressionTension = (tension, values) => {
    const { divisionedNotes, fromNotesOverride, toNotes, newChord, currentScale, originalScale, beatsUntilLastChordInCadence, beatsUntilLastChordInSong, inversionName, prevInversionName, params, mainParams, beatDivision, } = values;
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
        4: ['tonic', 6, 'dominant'],
        5: ['sub-dominant', 2],
        6: ['tonic'], // vii can go to I
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
    let prevScale = undefined;
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
            prevScale = richNote.scale;
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
    const getPossibleFunctions = (chord, scale) => {
        const semitoneScaleIndex = {
            [scale.notes[0].semitone]: 0,
            [scale.notes[1].semitone]: 1,
            [scale.notes[2].semitone]: 2,
            [scale.notes[3].semitone]: 3,
            [scale.notes[4].semitone]: 4,
            [scale.notes[5].semitone]: 5,
            [scale.notes[6].semitone]: 6, // H
            // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
        };
        const rootSemitone = chord.notes[0].semitone;
        const rootScaleIndex = semitoneScaleIndex[rootSemitone];
        const possibleToFunctions = {
            'tonic': 0,
            'sub-dominant': 0,
            'dominant': 0,
        };
        if (rootScaleIndex == undefined) {
            possibleToFunctions.tonic = 100;
            possibleToFunctions['sub-dominant'] = 100;
            possibleToFunctions.dominant = 100;
        }
        if (![1, 3].includes(rootScaleIndex)) { // ii, IV
            possibleToFunctions["sub-dominant"] = 100;
        }
        if (![0, 4, 6].includes(rootScaleIndex)) { // V, vii, I64
            possibleToFunctions.dominant = 100;
        }
        else if (rootScaleIndex == 0) {
            // If I is not second inversion, it's not dominant
            if (!inversionName || !inversionName.startsWith('second')) {
                possibleToFunctions.dominant = 100;
            }
            tension.chordProgression += 6; // Try to avoid I64
        }
        if (![0].includes(rootScaleIndex)) { // I
            possibleToFunctions.tonic = 100;
        }
        // Can't have tonic with non-scale notes
        if (chord.notes.some(note => semitoneScaleIndex[note.semitone] == undefined)) {
            possibleToFunctions.tonic = 100;
        }
        // Cant have tonic in second inversion.
        if (inversionName && inversionName.startsWith('second')) {
            possibleToFunctions.tonic = 10;
        }
        return {
            rootScaleIndex,
            possibleToFunctions: possibleToFunctions,
        };
    };
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
        [currentScale.notes[6].semitone]: 6, // H
        // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
    };
    const toScaleIndexes = toNotes.map(note => semitoneScaleIndex[note.semitone]);
    if (part0MustBeTonic && toScaleIndexes[0] != 0) {
        tension.comment += "part 0 must be tonic! ";
        tension.cadence += 10;
    }
    const getChordsTension = (newChord, prevChord, prevPrevChord, currentScale) => {
        const tension = {
            cadence: 0,
            comment: "",
            chordProgression: 0,
        };
        const semitoneScaleIndex = {
            [currentScale.notes[0].semitone]: 0,
            [currentScale.notes[1].semitone]: 1,
            [currentScale.notes[2].semitone]: 2,
            [currentScale.notes[3].semitone]: 3,
            [currentScale.notes[4].semitone]: 4,
            [currentScale.notes[5].semitone]: 5,
            [currentScale.notes[6].semitone]: 6, // H
            // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
        };
        if (newChord && prevChord && prevPrevChord) {
            if (newChord.notes[0].semitone == prevChord.notes[0].semitone) {
                // Same root
                tension.chordProgression += 1;
                if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
                    // Same root as previous chord
                    tension.chordProgression += 113;
                }
            }
            if (newChord.notes[0].semitone == prevPrevChord.notes[0].semitone) {
                // Same root as previous chord (Don't go back)
                tension.chordProgression += 5;
            }
        }
        if (newChord) {
            const rootSemitone = newChord.notes[0].semitone;
            const rootScaleIndex = semitoneScaleIndex[rootSemitone];
            if (newChord.chordType.includes('dom7')) {
                // Only allow index ii and V for now.
                if (![1, 4].includes(rootScaleIndex)) {
                    tension.chordProgression += 13;
                }
            }
        }
        if (newChord && prevChord) {
            const fromFunctions = getPossibleFunctions(prevChord, currentScale);
            const toFunctions = getPossibleFunctions(newChord, currentScale);
            const possibleToFunctions = toFunctions.possibleToFunctions;
            const progressions = progressionChoices[fromFunctions.rootScaleIndex];
            if (progressions) {
                let good = false;
                if (fromFunctions.rootScaleIndex == toFunctions.rootScaleIndex) {
                    good = true;
                    tension.chordProgression += 1;
                }
                let dominantToDominant = false;
                for (const progression of progressions) {
                    if (`${progression}` == `${toFunctions.rootScaleIndex}`) {
                        // Perfect progression
                        good = true;
                        break;
                    }
                    if (typeof progression == "string" && toFunctions.possibleToFunctions && toFunctions.possibleToFunctions[progression] != 100) {
                        good = true;
                        tension.chordProgression += toFunctions.possibleToFunctions[progression];
                        if (progression == "dominant") {
                            dominantToDominant = true;
                        }
                        break;
                    }
                }
                if (!good) {
                    tension.chordProgression += 114;
                }
                else {
                    // If we're moving from "dominant" to "dominant", we need to prevent "lessening the tension"
                    if (dominantToDominant) {
                        let prevChordTension = 0;
                        let newChordTension = 0;
                        const leadingTone = (currentScale.key - 1 + 24) % 12;
                        const tonicNotes = [currentScale.notes[0], currentScale.notes[2], currentScale.notes[4]];
                        for (const note of prevChord.notes) {
                            // Each note not in tonic notes adds tension
                            // Leading tone adds more tension
                            if (!tonicNotes.some(tonicNote => tonicNote.semitone == note.semitone)) {
                                prevChordTension += 1;
                            }
                            if (note.semitone == leadingTone) {
                                prevChordTension += 1;
                            }
                        }
                        for (const note of newChord.notes) {
                            // Each note not in tonic notes adds tension
                            // Leading tone adds more tension
                            if (!tonicNotes.some(tonicNote => tonicNote.semitone == note.semitone)) {
                                newChordTension += 1;
                            }
                            if (note.semitone == leadingTone) {
                                newChordTension += 1;
                            }
                        }
                        if (newChordTension < prevChordTension) {
                            tension.chordProgression += 17;
                        }
                    }
                }
            }
            else if (progressions != null) {
                tension.chordProgression += 111;
            }
            if (wantedFunction) {
                if (wantedFunction == "sub-dominant") {
                    if (possibleToFunctions["sub-dominant"] == 100) {
                        if (possibleToFunctions["dominant"] == 100) {
                            tension.comment += `Wanted ${wantedFunction}`;
                            tension.cadence += 100;
                        }
                        else {
                            tension.cadence += 1; // Dominant is
                        }
                    }
                }
                if (wantedFunction == "dominant") {
                    if (possibleToFunctions["dominant"] == 100) {
                        tension.comment += `Wanted ${wantedFunction}`;
                        tension.cadence += 100;
                    }
                }
                if (wantedFunction == "tonic") {
                    if (possibleToFunctions["tonic"] > 0) {
                        tension.comment += `Wanted ${wantedFunction}`;
                        tension.cadence += 100;
                    }
                }
            }
        }
        if (params.selectedCadence == "PAC") {
            // Since PAC is so hard, lets loosen up the rules a bit
            if (tension.cadence == 0) {
                tension.cadence = -3;
            }
        }
        return tension;
    };
    let tensionResult = {
        chordProgression: 112,
        cadence: 0,
        comment: ""
    };
    let prevChordIsTonicized = false;
    let newChordIsSecondaryDominant = false;
    const cadenceIsNear = wantedFunction || (beatsUntilLastChordInCadence || 0) < 5;
    if (prevChord && prevScale) {
        if (prevChord.notes[0].semitone == prevScale.notes[0].semitone) {
            prevChordIsTonicized = true;
        }
    }
    if (newChord && currentScale && originalScale) {
        // Chord must have at least one note not in the original scale
        if (newChord.notes.some(note => !originalScale.notes.some(scaleNote => scaleNote.semitone == note.semitone))) {
            const newChordFunctions = getPossibleFunctions(newChord, currentScale);
            if (newChordFunctions.possibleToFunctions.dominant < 100 || newChordFunctions.rootScaleIndex == 1) {
                newChordIsSecondaryDominant = true;
            }
        }
    }
    if (prevScale && currentScale.toString() != originalScale.toString() && originalScale.toString() != prevScale.toString() && currentScale.toString() != prevScale.toString()) {
        // Can't modulate during a modulation
    }
    else if (newChord && prevScale && currentScale.toString() != originalScale.toString() && originalScale.toString() == prevScale.toString()) {
        if (!cadenceIsNear && newChordIsSecondaryDominant && !prevChordIsTonicized) {
            // Check if this chord would allow moving to a new scale temporarily (a dominant function at most)
            // The tension is now actually between the tonicized chord and the previous chord, *in the previous scale*!
            let handled = false;
            if (['dom7'].includes(newChord.chordType)) {
                const fifthDownFromNewChordRoot = (newChord.notes[0].semitone - 7 + 24) % 12;
                const tonicizedChord = buildTriadOn(fifthDownFromNewChordRoot, prevScale);
                const tonicizedChordIsIOfCurrentScale = (tonicizedChord === null || tonicizedChord === void 0 ? void 0 : tonicizedChord.notes[0].semitone) == currentScale.notes[0].semitone;
                if (tonicizedChord && tonicizedChordIsIOfCurrentScale && ['maj', 'min'].includes(tonicizedChord.chordType)) {
                    handled = true;
                    tensionResult = getChordsTension(tonicizedChord, prevChord, prevPrevChord, prevScale);
                    //console.log("Tension from tonicized chord", tensionResult, "to", tonicizedChord.toString(), "from", prevChord?.toString(), "in", prevScale.toString());
                }
            }
            if (!handled) {
                if (['dim7'].includes(newChord.chordType)) {
                    const semitoneUpFromNewChordRoot = (newChord.notes[0].semitone + 1 + 24) % 12;
                    const tonicizedChord = buildTriadOn(semitoneUpFromNewChordRoot, prevScale);
                    const tonicizedChordIsIOfCurrentScale = (tonicizedChord === null || tonicizedChord === void 0 ? void 0 : tonicizedChord.notes[0].semitone) == currentScale.notes[0].semitone;
                    if (tonicizedChord && tonicizedChordIsIOfCurrentScale && ['maj', 'min'].includes(tonicizedChord.chordType)) {
                        handled = true;
                        tensionResult = getChordsTension(tonicizedChord, prevChord, prevPrevChord, prevScale);
                        //console.log("Tension from tonicized chord", tensionResult, "to", tonicizedChord.toString(), "from", prevChord?.toString(), "in", prevScale.toString());
                    }
                }
            }
            if (!handled) {
                if (['min7'].includes(newChord.chordType)) {
                    const twoSemitonesDownFromNewChordRoot = (newChord.notes[0].semitone - 2 + 24) % 12;
                    const tonicizedChord = buildTriadOn(twoSemitonesDownFromNewChordRoot, prevScale);
                    const tonicizedChordIsIOfCurrentScale = (tonicizedChord === null || tonicizedChord === void 0 ? void 0 : tonicizedChord.notes[0].semitone) == currentScale.notes[0].semitone;
                    if (tonicizedChord && tonicizedChordIsIOfCurrentScale && ['maj', 'min'].includes(tonicizedChord.chordType)) {
                        handled = true;
                        tensionResult = getChordsTension(tonicizedChord, prevChord, prevPrevChord, prevScale);
                        //console.log("Tension from tonicized chord", tensionResult, "to", tonicizedChord.toString(), "from", prevChord?.toString(), "in", prevScale.toString());
                    }
                }
            }
        }
    }
    else if (newChord && prevScale && currentScale.toString() != originalScale.toString() && currentScale.toString() == prevScale.toString()) {
        // If we are here, the modulated progression is going on still. If prevChord is a tonic, we can't allow anything in this new scale.
        if (prevChordIsTonicized || cadenceIsNear) {
            tensionResult = {
                chordProgression: 101,
                comment: "Tonicized chord reached, can't allow anything in this new scale",
                cadence: 0,
            };
        }
        else {
            tensionResult = getChordsTension(newChord, prevChord, prevPrevChord, prevScale);
        }
    }
    else if (!wantedFunction && newChord && prevScale && currentScale.toString() == originalScale.toString() && currentScale.toString() != prevScale.toString()) {
        // If we are here, the modulated progression is over. If prevChord is a tonic in the previous scale, we can continue in the original scale.
        if (prevChordIsTonicized && newChord.notes.every(note => currentScale.notes.some(scaleNote => scaleNote.semitone == note.semitone))) {
            tensionResult = getChordsTension(newChord, prevChord, prevPrevChord, currentScale);
        }
        else {
            tensionResult = {
                chordProgression: 102,
                comment: "Modulated progression has not ended, can't allow anything in the original scale",
                cadence: 0,
            };
        }
    }
    else if (wantedFunction && prevScale && (prevScale.toString() != originalScale.toString())) {
        // Oh noes, we are in a modulated progression and the cadence started. This will not do
    }
    else {
        tensionResult = getChordsTension(newChord, prevChord, prevPrevChord, currentScale);
    }
    tension.chordProgression = tensionResult.chordProgression;
    tension.comment += tensionResult.comment;
    tension.cadence += tensionResult.cadence;
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
/* harmony import */ var _goodsoundingscale__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./goodsoundingscale */ "./src/goodsoundingscale.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











const GOOD_CHORD_LIMIT = 1000;
const GOOD_CHORDS_PER_CHORD = 100;
const BAD_CHORD_LIMIT = 200;
const BAD_CHORDS_PER_CHORD = 10;
const sleepMS = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(resolve, ms));
});
const makeChords = (mainParams, progressCallback = null) => __awaiter(void 0, void 0, void 0, function* () {
    // generate a progression
    // This is the main function that generates the entire song.
    // The basic idea is that 
    var _a, _b, _c, _d, _e;
    // Until the first IAC or PAC, melody and rhytm is random. (Though each cadence has it's own melodic high point.)
    // This melody and rhytm is partially saved and repeated in the next cadences.
    const maxBeats = mainParams.getMaxBeats();
    let result = {};
    let originalScale;
    let divisionBannedNotes = {};
    let divisionBanCount = {};
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
        if (currentScale) {
            try {
                // @ts-ignore
                if (!originalScale) {
                    originalScale = currentScale;
                }
            }
            catch (e) {
                originalScale = currentScale;
            }
        }
        else {
            if (mainParams.forcedOriginalScale) {
                currentScale = mainParams.forcedOriginalScale;
            }
        }
        // @ts-ignore
        originalScale = originalScale;
        // @ts-expect-error
        prevNotes = prevNotes;
        const params = mainParams.currentCadenceParams(division);
        const beatsUntilLastChordInCadence = params.beatsUntilCadenceEnd;
        const currentBeat = Math.floor(division / _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH);
        console.groupCollapsed("division", division, "beat", currentBeat, prevChord ? prevChord.toString() : "null", " scale ", currentScale ? currentScale.toString() : "null", prevResult && ((_a = prevResult[0]) === null || _a === void 0 ? void 0 : _a.tension) ? prevResult[0].tension.toPrint() : "");
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
                chord: prevChord,
                partIndex: index,
                inversionName: prevInversionName,
                tension: new _tension__WEBPACK_IMPORTED_MODULE_5__.Tension(),
                scale: currentScale,
                originalScale: originalScale,
            })));
            skipLoop = true;
        }
        while (!skipLoop && goodChords.length < (currentBeat != 0 ? GOOD_CHORD_LIMIT : 5)) {
            iterations++;
            newChord = randomGenerator.getChord();
            const chordLogger = new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger();
            if (iterations > 100000 || !newChord) {
                console.log(`Too many iterations: ${iterations}, going back`);
                break;
            }
            if (mainParams.forcedChords && originalScale && newChord) {
                const forcedChordNum = parseInt(mainParams.forcedChords[currentBeat]);
                if (!isNaN(forcedChordNum)) {
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.semitoneScaleIndex)(originalScale)[newChord.notes[0].semitone] != (forcedChordNum - 1)) {
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
            for (const availableScale of availableScales) {
                allInversions = (0,_inversions__WEBPACK_IMPORTED_MODULE_4__.getInversions)({
                    chord: newChord, prevNotes: prevNotes, beat: currentBeat, params, logger: new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger(chordLogger),
                    beatsUntilLastChordInSong: maxBeats - currentBeat
                });
                let stopInversionLoop = false;
                for (const inversionResult of allInversions) {
                    if (stopInversionLoop) {
                        break;
                    }
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
                    if (goodChords.length >= GOOD_CHORD_LIMIT) {
                        break;
                    }
                    const tensionParams = {
                        divisionedNotes: result,
                        beatDivision: division,
                        toNotes: randomNotes,
                        currentScale: availableScale.scale,
                        originalScale: originalScale,
                        beatsUntilLastChordInCadence,
                        beatsUntilLastChordInSong: maxBeats - currentBeat,
                        params,
                        mainParams,
                        inversionName: inversionResult.inversionName,
                        prevInversionName,
                        newChord,
                    };
                    const tensionResult = (0,_tension__WEBPACK_IMPORTED_MODULE_5__.makeTension)();
                    let tension;
                    try {
                        tensionResult.inversionTension = inversionResult.rating;
                        (0,_chordprogression__WEBPACK_IMPORTED_MODULE_9__.chordProgressionTension)(tensionResult, tensionParams);
                        (0,_goodsoundingscale__WEBPACK_IMPORTED_MODULE_10__.goodSoundingScaleTension)(tensionResult, tensionParams);
                        if (tensionResult.getTotalTension({
                            params,
                            beatsUntilLastChordInCadence
                        }) < 10) {
                            (0,_tension__WEBPACK_IMPORTED_MODULE_5__.getTension)(tensionResult, tensionParams);
                        }
                        tension = tensionResult.getTotalTension({
                            params,
                            beatsUntilLastChordInCadence
                        });
                    }
                    catch (e) {
                        if (e instanceof _tension__WEBPACK_IMPORTED_MODULE_5__.TensionError) {
                            // No worries, this chord/scale/inversion combination is just bad
                            tension = 100;
                        }
                        else {
                            throw e;
                        }
                    }
                    if (tensionResult.chordProgression >= 100) {
                        // No point checking other inversions for this chord
                        stopInversionLoop = true;
                    }
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
                                    if ((((_b = goodChord[0].tension) === null || _b === void 0 ? void 0 : _b.totalTension) || 999) < worstChordTension) {
                                        worstChord = i;
                                    }
                                }
                            }
                            if (worstChord != null) {
                                if ((((_c = goodChords[worstChord][0].tension) === null || _c === void 0 ? void 0 : _c.totalTension) || 999) > tension) {
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
                                originalScale: originalScale,
                            })));
                        }
                    }
                    else if (tensionResult.totalTension < 100000 && badChords.length < BAD_CHORD_LIMIT) {
                        let chordCountInBadChords = 0;
                        let worstBadChord = null;
                        for (const badChord of badChords) {
                            if (badChord.chord.includes(newChord.toString())) {
                                chordCountInBadChords++;
                                if (!worstBadChord || badChord.tension.totalTension > (worstBadChord === null || worstBadChord === void 0 ? void 0 : worstBadChord.tension.totalTension)) {
                                    worstBadChord = badChord;
                                }
                            }
                        }
                        if (chordCountInBadChords < BAD_CHORDS_PER_CHORD) {
                            badChords.push({
                                chord: newChord.toString() + "," + inversionResult.inversionName,
                                tension: tensionResult,
                                scale: availableScale.scale,
                            });
                        }
                        else if (worstBadChord != null && worstBadChord.tension.totalTension > tension) {
                            // @ts-ignore
                            const indexToReplace = badChords.findIndex(b => b.chord == worstBadChord.chord);
                            badChords[indexToReplace] = {
                                chord: newChord.toString() + "," + inversionResult.inversionName,
                                tension: tensionResult,
                                scale: availableScale.scale,
                            };
                        }
                    }
                } // For available scales end
            } // For voiceleading results end
        } // While end
        let bestOfBadChords = null;
        for (const badChord of badChords) {
            badChord.tension.print("Bad chord ", badChord.chord, " - ", badChord.scale.toString(), " - ");
            if (bestOfBadChords == null || badChord.tension.totalTension < bestOfBadChords.tension.totalTension) {
                bestOfBadChords = badChord;
            }
        }
        if (goodChords.length == 0) {
            console.groupEnd();
            console.groupCollapsed("No good chords found: ", ((bestOfBadChords && bestOfBadChords.tension) ? ([bestOfBadChords.chord, bestOfBadChords.tension.comment, bestOfBadChords.tension.toPrint()]) : ""));
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
                }
                divisionBanCount[division] = divisionBanCount[division] || 0;
                divisionBanCount[division]++;
                if (divisionBanCount[division] > 10) {
                    // We're stuck. Go back 8 beats and try again.
                    division -= _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH * 8;
                    divisionBanCount[division] = divisionBanCount[division] || 0;
                }
                if (division < -1 * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH) {
                    division = -1 * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH;
                }
                console.log("Too many bans, going back to division " + division + " ban count " + divisionBanCount[division]);
                // Delete the result where we are going to and anything after it
                delete result[division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH];
                for (let i = division + _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH + 1; i < maxBeats * _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH; i += 1) {
                    delete result[i];
                    delete divisionBannedNotes[i];
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
        let bestChords = [];
        let worstBestTension = 999;
        let bestTension = 999;
        for (const chord of goodChords) {
            if (chord[0].tension != undefined) {
                if (chord[0].tension.totalTension < worstBestTension) {
                    if (bestChords.length > 10) {
                        const indexToReplace = bestChords.findIndex(b => b[0].tension.totalTension == worstBestTension);
                        bestChords[indexToReplace] = chord;
                    }
                    else {
                        bestChords.push(chord);
                    }
                    bestTension = chord[0].tension.totalTension;
                    worstBestTension = bestChords.reduce((a, b) => a[0].tension.totalTension > b[0].tension.totalTension ? a : b)[0].tension.totalTension;
                }
                chord[0].tension.print(chord[0].chord ? chord[0].chord.toString() : "?Chord?", chord[0].inversionName, "best tension: ", bestTension);
            }
        }
        const bestChord = bestChords[Math.floor(Math.random() * bestChords.length)];
        console.log("Best chord: ", bestChord[0].chord.toString(), bestChord[0].inversionName, bestChord[0].tension.totalTension);
        result[division] = bestChord;
        if ((_e = (_d = bestChord[0]) === null || _d === void 0 ? void 0 : _d.tension) === null || _e === void 0 ? void 0 : _e.nac) {
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
        (0,_nonchordtones__WEBPACK_IMPORTED_MODULE_6__.buildTopMelody)(divisionedNotes, params);
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
    (0,_nonchordtones__WEBPACK_IMPORTED_MODULE_6__.buildTopMelody)(divisionedNotes, mainParams);
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
    debugger;
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

/***/ "./src/goodsoundingscale.ts":
/*!**********************************!*\
  !*** ./src/goodsoundingscale.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "goodSoundingScaleTension": () => (/* binding */ goodSoundingScaleTension)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

const goodSoundingScaleTension = (tension, values) => {
    const { divisionedNotes, fromNotesOverride, toNotes, newChord, currentScale, beatsUntilLastChordInCadence, beatsUntilLastChordInSong, inversionName, prevInversionName, params, mainParams, beatDivision, } = values;
    const semitoneScaleIndex = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6, // H
        // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
    };
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
    }
    else if (fromNotesOverride) {
        passedFromNotes = fromNotesOverride;
    }
    // Check the bass, is it gound up or down a scale?
    if (prevPassedFromNotes) {
        const prevGlobalSemitones = prevPassedFromNotes.map(n => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n));
        const fromGlobalSemitones = passedFromNotes.map(n => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n));
        const latestGlobalSemitones = latestNotes.map(n => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n));
        const toGlobalSemitones = toNotes.map(n => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n));
        const notesByPart = [];
        for (let i = 0; i < passedFromNotes.length; i++) {
            notesByPart[i] = [toGlobalSemitones[i]];
            if (latestGlobalSemitones[i] && latestGlobalSemitones[i] !== fromGlobalSemitones[i]) {
                notesByPart[i].push(latestGlobalSemitones[i]);
            }
            notesByPart[i].push(fromGlobalSemitones[i]);
            if (prevGlobalSemitones[i]) {
                notesByPart[i].push(prevGlobalSemitones[i]);
            }
            const partScaleIndexes = notesByPart[i].map(n => semitoneScaleIndex[n % 12]);
            let goingUpOrDownAScale = false;
            if (partScaleIndexes[0] - partScaleIndexes[1] == 1) {
                if (partScaleIndexes[1] - partScaleIndexes[2] == 1) {
                    // Last 3 notes are going up a scale
                    goingUpOrDownAScale = true;
                }
            }
            if (partScaleIndexes[0] - partScaleIndexes[1] == -1) {
                if (partScaleIndexes[1] - partScaleIndexes[2] == -1) {
                    // Last 3 notes are going down a scale
                    goingUpOrDownAScale = true;
                }
            }
            if (goingUpOrDownAScale) {
                if (i == 3) {
                    tension.bassScale += 3;
                }
                else if (i == 0) {
                    tension.sopranoScale += 3;
                }
                else {
                    tension.otherScale += 1;
                }
            }
        }
        if (tension.bassScale > 0 && tension.sopranoScale > 0) {
            const interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[3]) % 12;
            if (interval == 4 || interval == 8) {
                // 3rds and 6ths are good
                tension.bassSopranoScale += 3; // Override bass and soprano same direction also
            }
        }
        if (tension.otherScale > 0 && tension.sopranoScale > 0) {
            let interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[2]) % 12;
            if (interval == 4 || interval == 8) {
                // 3rds and 6ths are good
                tension.bassSopranoScale += 2; // Same thing for alto or tenor + soprano
            }
            interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[1]) % 12;
            if (interval == 4 || interval == 8) {
                // 3rds and 6ths are good
                tension.bassSopranoScale += 2; // Same thing for alto or tenor + soprano
            }
        }
    }
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
            inversionNames = ["root", "root-root", "root-third", "first", "first-root", "first-third", "second", "third", "third-root", "third-third"];
        }
        for (let skipFifthIndex = 0; skipFifthIndex < 2; skipFifthIndex++) {
            for (let inversionIndex = 0; inversionIndex < inversionNames.length; inversionIndex++) {
                for (let combinationIndex = 0; combinationIndex < combinationCount; combinationIndex++) {
                    let rating = 0;
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
                            rating += 1;
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
                        // Leave out the fifth, possibly
                        if (inversion == "root-root") {
                            leftOverIndexes = [0, 1, 3]; // Double the root
                        }
                        else if (inversion == "root-third") {
                            leftOverIndexes = [1, 1, 3]; // Double the third
                            rating += 1;
                        }
                        else if (inversion == "first-root") {
                            leftOverIndexes = [0, 0, 3]; // Double the root
                        }
                        else if (inversion == "first-third") {
                            leftOverIndexes = [0, 1, 3]; // Double the third
                            rating += 1;
                        }
                        else if (inversion == "third-root") {
                            leftOverIndexes = [0, 0, 1]; // Double the root
                        }
                        else if (inversion == "third-third") {
                            leftOverIndexes = [0, 1, 1]; // Double the third
                            rating += 1;
                        }
                        else {
                            leftOverIndexes = [0, 1, 2, 3].filter(i => i != partToIndex[3]);
                        }
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
                                        rating: rating,
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
            originalScale: beatRichNote.originalScale,
            tension: new _tension__WEBPACK_IMPORTED_MODULE_1__.Tension(),
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
                originalScale: beatRichNote.originalScale,
                tension: new _tension__WEBPACK_IMPORTED_MODULE_1__.Tension(),
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
                originalScale: beatRichNote.originalScale,
                tension: new _tension__WEBPACK_IMPORTED_MODULE_1__.Tension(),
                partIndex: partIndex,
            };
            divisionedNotes[division + divisionDiff / 2].push(newRandomRichNote);
            divisionedNotes[division + divisionDiff * 0.75] = divisionedNotes[division + divisionDiff * 0.75] || [];
            const newRandomRichNote2 = {
                note: newNote2,
                duration: divisionDiff / 4,
                chord: beatRichNote.chord,
                scale: beatRichNote.scale,
                originalScale: beatRichNote.originalScale,
                tension: new _tension__WEBPACK_IMPORTED_MODULE_1__.Tension(),
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
        console.log("Cadence division", cadenceDivision, "division", division, "authenticCadenceStartDivision", params.authenticCadenceStartDivision);
        const neededRhythm = rhythmNeededDurations[cadenceDivision] || 100;
        const lastBeatInCadence = params.beatsUntilAuthenticCadenceEnd < 2;
        if (lastBeatInCadence) {
            continue;
        }
        const prevNotes = [];
        const thisNotes = [];
        const nextNotes = [];
        let currentScale;
        let originalScale;
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
                    originalScale = richNote.originalScale;
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
        // @ts-ignore
        originalScale = originalScale;
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
                chordNote: () => { chordNote(nacParams); },
                appogiatura: () => appogiatura(nacParams),
                neighborGroup: () => neighborGroup(nacParams),
                suspension: () => suspension(nacParams),
                escapeTone: () => escapeTone(nacParams),
                passingTone: () => passingTone(nacParams),
                accentedPassingTone: () => accentedPassingTone(nacParams),
                neighborTone: () => neighborTone(nacParams),
                retardation: () => retardation(nacParams),
                anticipation: () => anticipation(nacParams),
                pedalPoint: () => pedalPoint(nacParams),
            };
            let iterations = 0;
            let nonChordTone = null;
            const usedChoices = new Set();
            const goodChoices = [];
            while (true) {
                iterations++;
                if (iterations > 1000) {
                    break;
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
                nonChordToneNotes[partIndex] = nonChordTone.note;
                if (originalScale && nonChordTone.note) {
                    // @ts-ignore
                    if (originalScale.notes.every(note => note.semitone != nonChordTone.note.semitone)) {
                        // The non chord tone is not in the original scale
                        // We can't use it
                        nonChordTone = null;
                        continue;
                    }
                }
                const tensionResult = new _tension__WEBPACK_IMPORTED_MODULE_1__.Tension();
                (0,_tension__WEBPACK_IMPORTED_MODULE_1__.getTension)(tensionResult, {
                    fromNotesOverride: prevNotes,
                    beatDivision: division,
                    toNotes: nonChordToneNotes,
                    currentScale: currentScale,
                    originalScale: currentScale,
                    params: params,
                    mainParams: mainParams,
                });
                let tension = 0;
                tension += tensionResult.doubleLeadingTone;
                tension += tensionResult.parallelFifths;
                tension += tensionResult.spacingError;
                if (tension < 10) {
                    goodChoices.push({
                        nac: nonChordTone,
                        tension,
                    });
                }
                console.log("Tension too high for non chord tone", tension, nonChordTone, tensionResult, usingKey);
                usedChoices.add(usingKey);
            }
            if (goodChoices.length > 0) {
                // Select the best choice
                goodChoices.sort((a, b) => a.tension - b.tension);
                nonChordTone = goodChoices[0].nac;
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
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


class MainMusicParams {
    constructor(params = undefined) {
        this.beatsPerBar = 4;
        this.cadenceCount = 4;
        this.cadences = [];
        this.testMode = false;
        this.melodyRhythm = ""; // hidden from user for now
        this.forcedMelody = []; // hidden from user for now
        this.forcedChords = "";
        this.forcedOriginalScale = null;
        if (params) {
            for (let key in params) {
                this[key] = params[key];
            }
        }
        // this.melodyRhythm = "QQQQQQQQQQQQQQQQQQQQQQ"
        // this.melodyRhythm = "EEEEQQEEEEQQEEQEEQEEQEEQ";
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
        // this.forcedMelody = [
        //     0,
        //     1,
        //     2,
        //     3,
        //     4,
        //     5,
        //     4,
        //     3,
        //     2,
        //     1,
        //     0,
        // ];
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
        // this.forcedChords = "362516662"
        this.forcedOriginalScale = new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Scale({ key: 0, template: musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.ScaleTemplates.major });
    }
    currentCadenceParams(division) {
        const beat = Math.floor(division / _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH);
        const bar = Math.floor(beat / this.beatsPerBar);
        let counter = 0; // The beat we're at in the loop
        let authenticCadenceStartBar = 0;
        let prevCadence = "";
        for (const cadenceParams of this.cadences) {
            // Loop cadences in order
            if (["PAC", "IAC"].includes(prevCadence)) {
                authenticCadenceStartBar = counter;
            }
            prevCadence = cadenceParams.selectedCadence;
            counter += cadenceParams.barsPerCadence;
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
                cadenceParams.cadenceStartDivision = ((counter - cadenceParams.barsPerCadence) * this.beatsPerBar) * _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH;
                cadenceParams.authenticCadenceStartDivision = authenticCadenceStartBar * this.beatsPerBar * _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH;
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
        this.tempo = 30;
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
            dim7: {
                enabled: true,
                weight: 0,
            },
            maj7: {
                enabled: false,
                weight: -1,
            },
            dom7: {
                enabled: true,
                weight: 0,
            },
            min7: {
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
        // // First try to add the simplest chords
        // for (const simpleChordType of this.chordTypes.filter(chordType => ["maj", "min"].includes(chordType))) {
        //     for (let randomRoot=0; randomRoot<12; randomRoot++) {
        //         if (!this.usedChords.has(randomRoot + simpleChordType)) {
        //             this.availableChords.push(randomRoot + simpleChordType);
        //         }
        //     }
        // }
        // if (this.availableChords.length > 0) {
        //     return;
        // }
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
            if (iterations++ > 10000) {
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
/* harmony export */   "TensionError": () => (/* binding */ TensionError),
/* harmony export */   "getTension": () => (/* binding */ getTension),
/* harmony export */   "makeTension": () => (/* binding */ makeTension)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class TensionError extends Error {
}
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
        this.seventhTension = 0;
        this.inversionTension = 0;
        this.forcedMelody = 0;
        this.bassScale = 0;
        this.sopranoScale = 0;
        this.otherScale = 0;
        this.bassSopranoScale = 0;
        this.totalTension = 0;
        this.comment = "";
    }
    getTotalTension(values) {
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
        tension += this.melodyJump;
        tension += this.voiceDirections;
        tension += this.overlapping;
        tension += this.forcedMelody;
        tension += this.seventhTension;
        tension += this.inversionTension;
        tension -= this.bassScale;
        tension -= this.bassSopranoScale;
        this.totalTension = tension;
        return tension;
    }
    toPrint() {
        const toPrint = {};
        for (const key in this) {
            if (`${this[key]}` != "0" && typeof this[key] == "number") {
                toPrint[key] = this[key].toFixed(1);
            }
        }
        return toPrint;
    }
    print(...args) {
        const toPrint = this.toPrint();
        // Print only positive values
        if (this.comment) {
            console.log(this.comment, ...args, toPrint);
        }
        else {
            console.log(...args, toPrint);
        }
    }
}
function wrapWithProxyCallback(obj, callback) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            // wraps nested data with Proxy
            if (typeof result === 'object' && result !== null) {
                return wrapWithProxyCallback(result, callback);
            }
            return result;
        },
        set(target, key, value, receiver) {
            // calls callback on every set operation
            callback(target, key, value /* and whatever else you need */);
            return Reflect.set(target, key, value, receiver);
        }
    });
}
function makeTension() {
    return wrapWithProxyCallback(new Tension(), (target, key, value) => {
        if (target.getTotalTension() > 20) {
            throw new TensionError("Tension too high");
        }
    });
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
    if (inversionName && inversionName.startsWith('third') || (prevInversionName || "").startsWith('third')) {
        for (let i = 0; i < fromGlobalSemitones.length; i++) {
            const fromSemitone = fromGlobalSemitones[i];
            const toSemitone = toGlobalSemitones[i];
            if (Math.abs(fromSemitone - toSemitone) > 2) {
                tension.secondInversion += 101;
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
        [currentScale.notes[6].semitone]: 6, // H
        // [(currentScale.notes[0].semitone - 1 + 24) % 12]: 6  // Force add leading tone
    };
    const leadingToneSemitone = currentScale.notes[0].semitone + 11;
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
        const fromGlobalSemitone = fromGlobalSemitones[i];
        if (fromGlobalSemitone % 12 == leadingToneSemitone) {
            if (toGlobalSemitones[i] == fromGlobalSemitone) {
                // Staying at the leading tone is not bad
                tension.leadingToneUp += 1;
            }
            else if (toGlobalSemitones[i] != fromGlobalSemitone + 1) {
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
    // dominant 7th chord stuff
    if (newChord === null || newChord === void 0 ? void 0 : newChord.chordType.includes('7')) {
        // Never double the 7th
        const seventhSemitone = newChord.notes[3].semitone;
        const seventhCount = toSemitones.filter(semitone => semitone == seventhSemitone).length;
        if (seventhCount > 1) {
            tension.seventhTension += 10;
        }
        for (let i = 0; i < toGlobalSemitones.length; i++) {
            if (toGlobalSemitones[i] % 12 == seventhSemitone) {
                if (Math.abs(fromGlobalSemitones[i] - toGlobalSemitones[i]) > 2) {
                    // 7th is approached by leap!
                    tension.seventhTension += 10;
                }
            }
        }
    }
    if (prevChord === null || prevChord === void 0 ? void 0 : prevChord.chordType.includes('7')) {
        if (!(newChord === null || newChord === void 0 ? void 0 : newChord.chordType.includes('7'))) {
            // 7th must resolve down
            const seventhSemitone = prevChord.notes[3].semitone;
            const seventGTone = fromGlobalSemitones.filter(gTone => gTone % 12 == seventhSemitone)[0];
            const seventhResolvesTo = [seventGTone - 1, seventGTone - 2];
            const seventhResolvesToCount = toGlobalSemitones.filter(gTone => seventhResolvesTo.includes(gTone)).length;
            if (seventhResolvesToCount == 0) {
                tension.seventhTension += 11;
            }
        }
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
    // if (partDirection[0] == partDirection[3] && partDirection[0] != "same") {
    //     tension.voiceDirections += 5;
    //     // root and sopranos moving in same direction
    // }
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
            }
        }
    }
    // Check if the soprano-bass interval is hidden
    // i.e. parts 0 and 3 are moving in same direction
    // And part 0 is making a jump
    // And the resulting interval is a fifth/octave
    const part0Direction = toGlobalSemitones[0] - fromGlobalSemitones[0];
    const part3Direction = toGlobalSemitones[3] - fromGlobalSemitones[3];
    if (Math.abs(part0Direction) > 2) {
        // Upper part is making a jump
        const interval = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[3]) % 12;
        if ((interval == 7 || interval == 0) && Math.sign(part0Direction) == Math.sign(part3Direction)) {
            // Same direction and resulting interval is a fifth/octave
            tension.parallelFifths += 11;
        }
    }
    for (let i = 0; i < 3; i++) {
        const toIntervalWithBass = Math.abs(toGlobalSemitones[i] - toGlobalSemitones[3]) % 12;
        const fromInterValWithBass = Math.abs(fromGlobalSemitones[i] - fromGlobalSemitones[3]) % 12;
        if (fromInterValWithBass == 6) {
            if (toIntervalWithBass == 7) {
                // Unequal fifths (diminished 5th to perfect 5th) with bass
                tension.parallelFifths += 12;
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
        let melodyJumpMultiplier = 1;
        if (i == 0) {
            melodyJumpMultiplier = 0.1;
        }
        if (i == 3) {
            melodyJumpMultiplier = 0.3;
        }
        const interval = Math.abs(fromGlobalSemitones[i] - toGlobalSemitones[i]);
        if (interval >= 3) {
            tension.melodyJump += 0.5 * melodyJumpMultiplier;
        }
        if (interval == 12) {
            tension.melodyJump += 0.5 * melodyJumpMultiplier;
            continue;
        }
        if (interval >= 5) {
            tension.melodyJump += 1 * melodyJumpMultiplier;
        }
        if (interval > 7) {
            tension.melodyJump += 2 * melodyJumpMultiplier;
        }
        if (interval >= 10) { // 7th == 10
            tension.melodyJump += 100;
            continue;
        }
        if (interval == 6 || interval == 8) // tritone (aug 4th) or aug 5th
         {
            tension.melodyJump += 100 * melodyJumpMultiplier;
            continue;
        }
        if (interval == 7) {
            tension.melodyJump += 1 * melodyJumpMultiplier;
            continue;
        }
        if (interval == 9) {
            tension.melodyJump += 2 * melodyJumpMultiplier;
            continue;
        }
    }
    // Prevent zig zaggin
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
                if (interval == 12) {
                    continue;
                }
                // Higher than that, no triad is possible.
                const multiplier = (i == 0 || i == 3) ? 0.2 : 1;
                if ((fromSemitone >= prevFromSemitone && toSemitone >= fromSemitone) || (fromSemitone <= prevFromSemitone && toSemitone <= fromSemitone)) {
                    // Not goinf back down/up...
                    if (interval <= 3) {
                        tension.melodyJump += 0.5 * multiplier;
                    }
                    else if (interval <= 7) {
                        tension.melodyJump += 2 * multiplier; // Not as bad
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
                            tension.melodyJump += 0.5 * multiplier;
                        }
                        else if (interval <= 7) {
                            tension.melodyJump += 2 * multiplier; // Not as bad
                        }
                        else {
                            tension.melodyJump += 100;
                        }
                    }
                }
            }
        }
        const prevPassedFromGTones = prevPassedFromNotes ? prevPassedFromNotes.map((n) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(n)) : [];
        for (let i = 0; i < 4; i++) {
            const gTonesForThisPart = [];
            if (prevPassedFromGTones[i]) {
                gTonesForThisPart.push(prevPassedFromGTones[i]);
            }
            gTonesForThisPart.push(fromGlobalSemitones[i]);
            if (latestFromGlobalSemitones[i] && latestFromGlobalSemitones[i] != fromGlobalSemitones[i]) {
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
            if (gTonesForThisPart.length >= 3) {
                if (gTonesForThisPart[gTonesForThisPart.length - 1] != gTonesForThisPart[gTonesForThisPart.length - 2] && gTonesForThisPart[gTonesForThisPart.length - 1] == gTonesForThisPart[gTonesForThisPart.length - 3]) {
                    // We're going to the same note as before. That's bad.
                    // Zig zagging
                    tension.melodyTarget += 5;
                }
            }
            if (gTonesForThisPart.length >= 4) {
                if (gTonesForThisPart[0] == gTonesForThisPart[2] && gTonesForThisPart[1] == gTonesForThisPart[3] && gTonesForThisPart[0] != gTonesForThisPart[1]) {
                    // Even worse zig zag
                    tension.melodyTarget += 10;
                }
            }
            if (i == 0) {
                if (finalDirection == 0) {
                    tension.melodyTarget += 2;
                    if (globalDirection == 0) {
                        tension.melodyTarget += 2;
                    }
                }
                const semitoneLimit = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.startingNotes)(params).semitoneLimits[i];
                let targetNote = semitoneLimit[1] - 4;
                targetNote -= i * 2;
                let targetLowNote = semitoneLimit[0] + 10;
                targetLowNote += i * 2;
                let targetNoteReached = false;
                let targetLowNoteReached = false;
                const authenticCadenceStartDivision = params.authenticCadenceStartDivision;
                for (let div = beatDivision; div > authenticCadenceStartDivision; div--) {
                    const notes = (divisionedNotes || {})[div] || [];
                    for (const prevNote of notes.filter(richNote => richNote.partIndex == i)) {
                        if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(prevNote.note) >= targetNote) {
                            targetNoteReached = true;
                        }
                        if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.globalSemitone)(prevNote.note) <= targetLowNote) {
                            targetLowNoteReached = true;
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
                        if (generalDirection >= 0) {
                            tension.melodyTarget += generalDirection;
                        }
                        if (finalDirection > 0) {
                            tension.melodyTarget += finalDirection;
                        }
                    }
                }
                else {
                    if (globalDirection <= 0 && finalDirection <= 0) {
                        // We're goin down, not good
                        tension.melodyTarget += -1 * globalDirection * 2;
                    }
                }
                if (targetLowNoteReached) {
                    tension.comment = "Target low note reached ";
                    if (Math.abs(toGlobalSemitones[i] - targetLowNote) <= 2) {
                        // We're close to the target note, let's NOT go down
                        if (finalDirection < 0) {
                            tension.melodyTarget += 10;
                        }
                    }
                    if (Math.abs(toGlobalSemitones[i] - targetLowNote) <= 8) {
                        // We're close to the target note, let's NOT a lot down
                        if (generalDirection <= 0) {
                            tension.melodyTarget += -1 * generalDirection;
                        }
                        if (finalDirection < 0) {
                            tension.melodyTarget += -1 * finalDirection;
                        }
                    }
                }
                else {
                    if (globalDirection >= 0 && finalDirection >= 0) {
                        if (targetNoteReached) {
                            // We're goin up, not good
                            tension.melodyTarget += globalDirection * 2;
                        }
                    }
                }
                if (generalDirection == 0) {
                    tension.melodyTarget += 1;
                }
                break;
            }
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
    dim7: [0, 3, 6, 10],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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S0FBSyxDQUFDLEVBQUU7d0JBQy9CLG9CQUFvQjt3QkFDcEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLHFCQUFxQjt3QkFDckIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLG9CQUFvQjt3QkFDcEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLG9CQUFvQjt3QkFDcEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBRUQsS0FBSyxJQUFJLFNBQVMsR0FBQyxDQUFDLEVBQUUsU0FBUyxHQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTt3QkFDNUMsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFOzRCQUNsQywyQkFBMkI7NEJBQzNCLFNBQVM7eUJBQ1o7d0JBQ0QsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQy9EO29CQUNELDZEQUE2RDtvQkFDN0QsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixLQUFLLElBQUksU0FBUyxHQUFDLENBQUMsRUFBRSxTQUFTLElBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFO3dCQUM3QyxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLEtBQUssR0FBRyxzREFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUVqQyxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUM7d0JBQ1IsT0FBTyxLQUFLLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxXQUFXLEVBQUU7NEJBQ2hFLENBQUMsRUFBRSxDQUFDOzRCQUNKLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtnQ0FDVixRQUFRLENBQUM7Z0NBQ1QsTUFBTSxxQkFBcUI7NkJBQzlCOzRCQUNELEtBQUssSUFBSSxFQUFFLENBQUM7eUJBQ2Y7d0JBQ0QsZUFBZSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLCtDQUFJLENBQUM7NEJBQ3hDLFFBQVEsRUFBRSxLQUFLLEdBQUcsRUFBRTs0QkFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzt5QkFDakMsQ0FBQyxDQUFDO3FCQUNOO29CQUVELG1FQUFtRTtvQkFDbkUsTUFBTSxnQkFBZ0IsR0FBRyxzREFBYyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxnQkFBZ0IsR0FBRyxzREFBYyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxnQkFBZ0IsR0FBRyxzREFBYyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxnQkFBZ0IsR0FBRyxzREFBYyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsS0FBSyxJQUFJLFdBQVcsR0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRTt3QkFDbEQsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQzt3QkFDdEQsSUFBSSxTQUFTLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNsQyxTQUFTO3lCQUNaO3dCQUNELEtBQUssSUFBSSxXQUFXLEdBQUMsQ0FBQyxFQUFFLFdBQVcsR0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUU7NEJBQ2xELE1BQU0sU0FBUyxHQUFHLGdCQUFnQixHQUFHLFdBQVcsR0FBRyxFQUFFLENBQUM7NEJBQ3RELElBQUksU0FBUyxHQUFHLFNBQVMsRUFBRTtnQ0FDdkIsU0FBUzs2QkFDWjs0QkFDRCxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ2xDLFNBQVM7NkJBQ1o7NEJBQ0QsS0FBSyxJQUFJLFdBQVcsR0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRTtnQ0FDbEQsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQztnQ0FDdEQsSUFBSSxTQUFTLEdBQUcsU0FBUyxFQUFFO29DQUN2QixTQUFTO2lDQUNaO2dDQUNELElBQUksU0FBUyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQ0FDbEMsU0FBUztpQ0FDWjtnQ0FDRCxLQUFLLElBQUksV0FBVyxHQUFDLENBQUMsRUFBRSxXQUFXLEdBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFO29DQUNsRCxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsRUFBRSxDQUFDO29DQUN0RCxJQUFJLFNBQVMsR0FBRyxTQUFTLEVBQUU7d0NBQ3ZCLFNBQVM7cUNBQ1o7b0NBQ0QsSUFBSSxTQUFTLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dDQUNsQyxTQUFTO3FDQUNaO29DQUNELEdBQUcsQ0FBQyxJQUFJLENBQUM7d0NBQ0wsS0FBSyxFQUFFOzRDQUNILElBQUksK0NBQUksQ0FBQztnREFDTCxRQUFRLEVBQUUsU0FBUyxHQUFHLEVBQUU7Z0RBQ3hCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7NkNBQ3JDLENBQUM7NENBQ0YsSUFBSSwrQ0FBSSxDQUFDO2dEQUNMLFFBQVEsRUFBRSxTQUFTLEdBQUcsRUFBRTtnREFDeEIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs2Q0FDckMsQ0FBQzs0Q0FDRixJQUFJLCtDQUFJLENBQUM7Z0RBQ0wsUUFBUSxFQUFFLFNBQVMsR0FBRyxFQUFFO2dEQUN4QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOzZDQUNyQyxDQUFDOzRDQUNGLElBQUksK0NBQUksQ0FBQztnREFDTCxRQUFRLEVBQUUsU0FBUyxHQUFHLEVBQUU7Z0RBQ3hCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7NkNBQ3JDLENBQUM7eUNBQ0w7d0NBQ0QsYUFBYSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxXQUFXLEdBQUcsV0FBVyxHQUFHLFdBQVcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLEdBQUcsbURBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsbURBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsbURBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsbURBQVcsQ0FBQyxTQUFTLENBQUM7d0NBQ3RPLE1BQU0sRUFBRSxNQUFNO3FDQUNqQixDQUFDLENBQUM7aUNBQ047NkJBQ0o7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDQTtTQUNBO0tBQ0o7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFMUUseUJBQXlCO0lBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQ2hCO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDblRELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxXQUFtQixFQUFFLEVBQUU7SUFDL0MsS0FBSyxNQUFNLEtBQUssSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO1FBQ3RDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsS0FBSyxNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztTQUMzQjtRQUNELE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN0QjtBQUNMLENBQUM7QUFFTSxNQUFNLE1BQU07SUFPZixZQUFZLFNBQTZCLFNBQVM7UUFObEQsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQUM1QixXQUFNLEdBQXVCLFNBQVMsQ0FBQztRQUN2QyxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFHckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxNQUFNLEVBQUU7WUFDUixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtJQUNMLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBRyxJQUFXO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLElBQVc7UUFDaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsT0FBTztTQUNWO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsdUJBQXVCO1lBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO1lBQ0QsT0FBTztTQUNWO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQixPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ2xDO2FBQU07WUFDSCxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsNENBQTRDO1FBQzVDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDO1NBQy9FO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUQyQztBQUVJO0FBQzBKO0FBbUNuTSxNQUFNLGNBQWMsR0FBRyxDQUFDLEdBQWlCLEVBQUUsUUFBZ0IsRUFBRSxZQUFvQixFQUFFLFNBQWlCLEVBQUUsZUFBb0MsRUFBVyxFQUFFO0lBQzFKLE1BQU0sWUFBWSxHQUFHLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDN0MsTUFBTSxZQUFZLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzlGLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztJQUN6QixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQzNCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDbEMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUM7SUFFN0MscURBQXFEO0lBQ3JELDhDQUE4QztJQUU5QyxJQUFJLFVBQVUsRUFBRTtRQUNaLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN6QyxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEcsTUFBTSxpQkFBaUIsR0FBRztZQUN0QixJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRSxZQUFZLEdBQUcsQ0FBQztZQUMxQixLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUs7WUFDekIsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO1lBQ3pCLGFBQWEsRUFBRSxZQUFZLENBQUMsYUFBYTtZQUN6QyxPQUFPLEVBQUUsSUFBSSw2Q0FBTyxFQUFFO1lBQ3RCLFNBQVMsRUFBRSxTQUFTO1NBQ3ZCO1FBQ0QsMkJBQTJCO1FBQzNCLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNsRCxvQ0FBb0M7UUFDcEMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksWUFBWSxDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNkLGtEQUFrRDtZQUNsRCxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbkU7YUFBTTtZQUNILG1EQUFtRDtZQUNuRCxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN4RTtLQUNKO1NBQU07UUFDSCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsb0JBQW9CO1lBQ3BCLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUN6QyxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEcsTUFBTSxpQkFBaUIsR0FBRztnQkFDdEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLFlBQVksR0FBRyxDQUFDO2dCQUMxQixLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUs7Z0JBQ3pCLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSztnQkFDekIsYUFBYSxFQUFFLFlBQVksQ0FBQyxhQUFhO2dCQUN6QyxPQUFPLEVBQUUsSUFBSSw2Q0FBTyxFQUFFO2dCQUN0QixTQUFTLEVBQUUsU0FBUzthQUN2QjtZQUNELGVBQWUsQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3hFO2FBQU07WUFDSCxzQkFBc0I7WUFDdEIsWUFBWSxDQUFDLFFBQVEsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRyxNQUFNLGlCQUFpQixHQUFHO2dCQUN0QixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsWUFBWSxHQUFHLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSztnQkFDekIsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO2dCQUN6QixhQUFhLEVBQUUsWUFBWSxDQUFDLGFBQWE7Z0JBQ3pDLE9BQU8sRUFBRSxJQUFJLDZDQUFPLEVBQUU7Z0JBQ3RCLFNBQVMsRUFBRSxTQUFTO2FBQ3ZCO1lBQ0QsZUFBZSxDQUFDLFFBQVEsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDckUsZUFBZSxDQUFDLFFBQVEsR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsZUFBZSxDQUFDLFFBQVEsR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hHLE1BQU0sa0JBQWtCLEdBQUc7Z0JBQ3ZCLElBQUksRUFBRSxRQUFRO2dCQUNkLFFBQVEsRUFBRSxZQUFZLEdBQUcsQ0FBQztnQkFDMUIsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO2dCQUN6QixLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUs7Z0JBQ3pCLGFBQWEsRUFBRSxZQUFZLENBQUMsYUFBYTtnQkFDekMsT0FBTyxFQUFFLElBQUksNkNBQU8sRUFBRTtnQkFDdEIsU0FBUyxFQUFFLFNBQVM7YUFDdkI7WUFDRCxlQUFlLENBQUMsUUFBUSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM1RTtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUdELE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBMEIsRUFBdUIsRUFBRTtJQUNwRSxNQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUM1RCxxRkFBcUY7SUFDckYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDM0MsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7UUFDOUIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELEtBQUssSUFBSSxLQUFLLEdBQUMsTUFBTSxFQUFFLEtBQUssSUFBSSxNQUFNLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3pFLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtZQUNqQixTQUFTO1NBQ1o7UUFDRCxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsRCxTQUFTO1NBQ1o7UUFDRCxNQUFNLFFBQVEsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMvQixPQUFPO2dCQUNILElBQUksRUFBRSxJQUFJLCtDQUFJLENBQUM7b0JBQ1gsUUFBUSxFQUFFLEtBQUssR0FBRyxFQUFFO29CQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2lCQUNqQyxDQUFDO2dCQUNGLFVBQVUsRUFBRSxLQUFLO2FBQ3BCO1NBQ0o7S0FDSjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFHRCxNQUFNLG1CQUFtQixHQUFHLENBQUMsTUFBMEIsRUFBdUIsRUFBRTtJQUM1RSwwQ0FBMEM7SUFDMUMsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztJQUMzQyxJQUFJLFFBQVEsR0FBRyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtRQUM5QixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEQsS0FBSyxJQUFJLEtBQUssR0FBQyxNQUFNLEVBQUUsS0FBSyxJQUFJLE1BQU0sRUFBRSxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDekUsSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ2pCLFNBQVM7U0FDWjtRQUNELElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xELFNBQVM7U0FDWjtRQUNELE1BQU0sUUFBUSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLE9BQU87Z0JBQ0gsSUFBSSxFQUFFLElBQUksK0NBQUksQ0FBQztvQkFDWCxRQUFRLEVBQUUsS0FBSyxHQUFHLEVBQUU7b0JBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7aUJBQ2pDLENBQUM7Z0JBQ0YsVUFBVSxFQUFFLElBQUk7YUFDbkI7U0FDSjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUlELE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBMEIsRUFBdUIsRUFBRTtJQUNyRSxNQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUM1RCw2Q0FBNkM7SUFDN0MsSUFBSSxNQUFNLElBQUksTUFBTSxFQUFFO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLFVBQVUsR0FBRywwREFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNiLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLEtBQUssTUFBTSxRQUFRLElBQUksZUFBZSxFQUFFO1FBQ3BDLE1BQU0sUUFBUSxHQUFHLHdEQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLFNBQVM7U0FDWjtRQUNELElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFNBQVM7U0FDWjtRQUNELE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSwrQ0FBSSxDQUFDO2dCQUNuQixRQUFRLEVBQUUsUUFBUSxHQUFHLEVBQUU7Z0JBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDcEMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQztLQUMxQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFHRCxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQTBCLEVBQXVCLEVBQUU7SUFDbkUsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUQsNEVBQTRFO0lBQzVFLGtCQUFrQjtJQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1QsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDakMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7UUFDOUIsbUNBQW1DO1FBQ25DLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCw2REFBNkQ7SUFDN0QsT0FBTztRQUNILElBQUksRUFBRSxJQUFJLCtDQUFJLENBQUM7WUFDWCxRQUFRLEVBQUUsTUFBTSxHQUFHLEVBQUU7WUFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztTQUNsQyxDQUFDO1FBQ0YsVUFBVSxFQUFFLElBQUk7S0FDbkI7QUFDTCxDQUFDO0FBR0QsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUEwQixFQUF1QixFQUFFO0lBQ3BFLE1BQU0sRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQzVELHlFQUF5RTtJQUN6RSxrQkFBa0I7SUFDbEIsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2pDLElBQUksUUFBUSxHQUFHLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLGlDQUFpQztRQUNqQyxPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsNkRBQTZEO0lBQzdELE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSwrQ0FBSSxDQUFDO1lBQ25CLFFBQVEsRUFBRSxNQUFNLEdBQUcsRUFBRTtZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2xDLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7QUFBQSxDQUFDO0FBRzNCLE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBMEIsRUFBdUIsRUFBRTtJQUNwRSxNQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUM1RCwrREFBK0Q7SUFDL0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2pDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLG9FQUFvRTtJQUNwRSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7UUFDZCxrRUFBa0U7UUFDbEUsUUFBUSxHQUFHLENBQUMsQ0FBQztLQUNoQjtJQUNELE1BQU0sS0FBSyxHQUFHLHdEQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNSLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsRCxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLCtDQUFJLENBQUM7WUFDbkIsUUFBUSxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDakMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUEwQixFQUF1QixFQUFFO0lBQ25FLE1BQU0sRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQzVELHFFQUFxRTtJQUNyRSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1QsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDakMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLDZFQUE2RTtJQUM3RSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7UUFDZCwrRUFBK0U7UUFDL0UsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO0lBQ0QsTUFBTSxLQUFLLEdBQUcsd0RBQWdCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksK0NBQUksQ0FBQztZQUNuQixRQUFRLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO0FBQzFCLENBQUM7QUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQTBCLEVBQXVCLEVBQUU7SUFDckUsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUQsa0VBQWtFO0lBQ2xFLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDakMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixrQ0FBa0M7UUFDbEMsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELHVEQUF1RDtJQUN2RCxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksK0NBQUksQ0FBQztZQUNuQixRQUFRLEVBQUUsTUFBTSxHQUFHLEVBQUU7WUFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztTQUNsQyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDO0FBQzNCLENBQUM7QUFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLE1BQTBCLEVBQXVCLEVBQUU7SUFDdEUsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUQsNkZBQTZGO0lBQzdGLFlBQVk7SUFDWixJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUU7UUFDbEIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sVUFBVSxHQUFHLDBEQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxRCxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sT0FBTyxHQUFHLHdEQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsTUFBTSxTQUFTLEdBQUcsd0RBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDeEIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMxRCxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsT0FBTztRQUNILElBQUksRUFBRSxJQUFJLCtDQUFJLENBQUM7WUFDWCxRQUFRLEVBQUUsT0FBTyxHQUFHLEVBQUU7WUFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNuQyxDQUFDO1FBQ0YsS0FBSyxFQUFFLElBQUksK0NBQUksQ0FBQztZQUNaLFFBQVEsRUFBRSxTQUFTLEdBQUcsRUFBRTtZQUN4QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ3JDLENBQUM7UUFDRixVQUFVLEVBQUUsS0FBSztLQUNwQixDQUFDO0FBQ04sQ0FBQztBQUdELE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBMEIsRUFBdUIsRUFBRTtJQUNuRSxNQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUM1RCx3RUFBd0U7SUFDeEUsSUFBSSxNQUFNLElBQUksTUFBTSxFQUFFO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUU7UUFDbEIsT0FBTyxJQUFJLENBQUMsQ0FBRSxpQkFBaUI7S0FDbEM7SUFDRCxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNwRCxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLCtDQUFJLENBQUM7WUFDbkIsUUFBUSxFQUFFLE1BQU0sR0FBRyxFQUFFO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDbEMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDO0FBQzdDLENBQUM7QUFHRCxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQTBCLEVBQXVCLEVBQUU7SUFDbEUsNkNBQTZDO0lBQzdDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQ2pDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNiLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO0tBQ3BDO0lBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNSLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ25DLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDYiwwQkFBMEI7UUFDMUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekUsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDM0Isa0NBQWtDO1FBQ2xDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2QyxJQUFJLFVBQVUsRUFBRSxHQUFHLElBQUksRUFBRTtnQkFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzFDO1lBQ0QsVUFBVSxJQUFJLEVBQUUsQ0FBQztTQUNwQjtLQUNKO0lBQ0QsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtRQUM1QixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksVUFBVSxHQUFHLEVBQUUsRUFBRTtZQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ1osTUFBTTtTQUNUO0tBQ0o7SUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsaUNBQWlDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksK0NBQUksQ0FBQztZQUNuQixRQUFRLEVBQUUsVUFBVSxHQUFHLEVBQUU7WUFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztTQUN0QyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxNQUFNLGlCQUFpQixHQUFJLENBQUMsTUFBMEIsRUFBdUIsRUFBRTtJQUMzRSxPQUFPLFNBQVMsaUNBQ1QsTUFBTSxLQUNULFVBQVUsRUFBRSxLQUFLLElBQ25CLENBQUM7QUFDUCxDQUFDO0FBRUQsTUFBTSxtQkFBbUIsR0FBSSxDQUFDLE1BQTBCLEVBQXVCLEVBQUU7SUFDN0UsT0FBTyxTQUFTLGlDQUNULE1BQU0sS0FDVCxVQUFVLEVBQUUsSUFBSSxJQUNsQjtBQUNOLENBQUM7QUFHTSxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQThCLEVBQXVCLEVBQUU7SUFDNUUsTUFBTSxFQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFN0csTUFBTSxlQUFlLEdBQThCO1FBQy9DLHFCQUFxQixFQUFFLG1CQUFtQjtRQUMxQyxhQUFhLEVBQUUsV0FBVztRQUMxQixZQUFZLEVBQUUsVUFBVTtRQUN4QixZQUFZLEVBQUUsVUFBVTtRQUN4QixZQUFZLEVBQUUsVUFBVTtRQUN4QixhQUFhLEVBQUUsV0FBVztRQUMxQixxQkFBcUIsRUFBRSxtQkFBbUI7S0FDN0M7SUFFRCxNQUFNLGFBQWEsR0FBOEI7UUFDN0MsbUJBQW1CLEVBQUUsaUJBQWlCO1FBQ3RDLGNBQWMsRUFBRSxZQUFZO1FBQzVCLGVBQWUsRUFBRSxhQUFhO1FBQzlCLGFBQWEsRUFBRSxXQUFXO0tBQzdCO0lBRUQsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO1FBQ25CLG9EQUFvRDtRQUNwRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDdkIsd0JBQXdCO1FBQ3hCLGlFQUFpRTtRQUNqRSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxFQUFFO1lBQ3JELFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDckI7UUFDRCxJQUFJLFVBQVUsRUFBRTtZQUNaLEtBQUssTUFBTSxRQUFRLElBQUksZUFBZSxFQUFFO2dCQUNwQyxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDaEIsTUFBTSxFQUFFLFNBQVM7b0JBQ2pCLE1BQU0sRUFBRSxhQUFhO29CQUNyQixNQUFNLEVBQUUsYUFBYTtvQkFDckIsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUs7b0JBQ0wsV0FBVztvQkFDWCxLQUFLO2lCQUNjLENBQUMsQ0FBQztnQkFDekIsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxzREFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3BFLE9BQU8sTUFBTSxDQUFDO3FCQUNqQjtpQkFDSjthQUNKO1NBQ0o7YUFBTTtZQUNILEtBQUssTUFBTSxRQUFRLElBQUksYUFBYSxFQUFFO2dCQUNsQyxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDaEIsTUFBTSxFQUFFLFNBQVM7b0JBQ2pCLE1BQU0sRUFBRSxhQUFhO29CQUNyQixNQUFNLEVBQUUsYUFBYTtvQkFDckIsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUs7b0JBQ0wsV0FBVztvQkFDWCxLQUFLO2lCQUNjLENBQUMsQ0FBQztnQkFDekIsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxzREFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3BFLE9BQU8sTUFBTSxDQUFDO3FCQUNqQjtpQkFDSjthQUNKO1NBQ0o7S0FDSjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFHTSxNQUFNLGNBQWMsR0FBRyxDQUFDLGVBQW9DLEVBQUUsVUFBMkIsRUFBRSxFQUFFO0lBQ2hHLHFDQUFxQztJQUNyQyxNQUFNLHFCQUFxQixHQUErQixnRUFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUvRixNQUFNLFlBQVksR0FBRywrQ0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM1RCxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxFQUFDLHVCQUF1QixFQUFFLGNBQWMsRUFBQyxHQUFHLHFEQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFN0UsS0FBSyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLFlBQVksR0FBRywrQ0FBVyxFQUFFLFFBQVEsSUFBSSwrQ0FBVyxFQUFFO1FBQ25GLElBQUksc0JBQXNCLEdBQUc7WUFDekIsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6QixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sZUFBZSxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUMsNkJBQTZCLENBQUM7UUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSwrQkFBK0IsRUFBRSxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUM5SSxNQUFNLFlBQVksR0FBRyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUM7UUFFbkUsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsNkJBQTZCLEdBQUcsQ0FBQztRQUNsRSxJQUFJLGlCQUFpQixFQUFFO1lBQ25CLFNBQVM7U0FDWjtRQUVELE1BQU0sU0FBUyxHQUFXLEVBQUUsQ0FBQztRQUM3QixNQUFNLFNBQVMsR0FBVyxFQUFFLENBQUM7UUFDN0IsTUFBTSxTQUFTLEdBQVcsRUFBRSxDQUFDO1FBQzdCLElBQUksWUFBbUIsQ0FBQztRQUN4QixJQUFJLGFBQW9CLENBQUM7UUFFekIsS0FBSyxNQUFNLFFBQVEsSUFBSSxlQUFlLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbEUsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNmLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzthQUNqRDtTQUNKO1FBQ0QsS0FBSyxNQUFNLFFBQVEsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3BELElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtnQkFDZixTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQzlDLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtvQkFDaEIsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQzlCLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO2lCQUMxQzthQUNKO1NBQ0o7UUFDRCxLQUFLLE1BQU0sUUFBUSxJQUFJLGVBQWUsQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2YsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO2FBQ2pEO1NBQ0o7UUFFRCxhQUFhO1FBQ2IsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUM1QixhQUFhO1FBQ2IsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUU5QixLQUFLLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQ2hELHNFQUFzRTtZQUN0RSxrQkFBa0I7WUFDbEIsTUFBTSxRQUFRLEdBQUcsbURBQVcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sWUFBWSxHQUFHLG1EQUFXLENBQUMsZUFBZSxFQUFFLFFBQVEsR0FBRywrQ0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JGLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtnQkFDcEUsU0FBUzthQUNaO1lBQ0QsTUFBTSxNQUFNLEdBQUcsc0RBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsTUFBTSxNQUFNLEdBQUcsc0RBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDMUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDMUMsSUFBSSxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZDLHlEQUF5RDtnQkFDekQsc0JBQXNCLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzNHO1lBQ0QsSUFBSSxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZDLHlEQUF5RDtnQkFDekQsc0JBQXNCLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzNHO1NBQ0o7UUFFRCxLQUFLLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQ2hELElBQUksWUFBWSxJQUFJLENBQUMsR0FBRywrQ0FBVyxFQUFFO2dCQUNqQyx5QkFBeUI7Z0JBQ3pCLFNBQVM7YUFDWjtZQUNELDZCQUE2QjtZQUM3QixNQUFNLFFBQVEsR0FBRyxtREFBVyxDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbkUsTUFBTSxZQUFZLEdBQUcsbURBQVcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxHQUFHLCtDQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO2dCQUNwRSxTQUFTO2FBQ1o7WUFDRCxJQUFJLHNEQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLHNEQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNwRSxTQUFTO2FBQ1o7WUFDRCxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztZQUN2QixZQUFZLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztTQUM3QjtRQUVELEtBQUssSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxZQUFZLElBQUssK0NBQVcsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xDLG9CQUFvQjtnQkFDcEIsU0FBUzthQUNaO1lBQ0QsTUFBTSxRQUFRLEdBQUcsbURBQVcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sWUFBWSxHQUFHLG1EQUFXLENBQUMsZUFBZSxFQUFFLFFBQVEsR0FBRywrQ0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JGLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtnQkFDcEUsU0FBUzthQUNaO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2pELFNBQVM7YUFDWjtZQUVELE1BQU0sWUFBWSxHQUFHLG1EQUFXLENBQUMsZUFBZSxFQUFFLFFBQVEsR0FBRywrQ0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXJGLE1BQU0sTUFBTSxHQUFHLHNEQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLE1BQU0sTUFBTSxHQUFHLHNEQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsc0RBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNyRSxJQUFJLE1BQU0sSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSwrQ0FBVyxFQUFFO2dCQUNoRSxpR0FBaUc7Z0JBQ2pHLE1BQU0sR0FBRyxJQUFJLENBQUM7YUFDakI7WUFDRCxNQUFNLFNBQVMsR0FBRztnQkFDZCxNQUFNO2dCQUNOLE1BQU07Z0JBQ04sTUFBTTtnQkFDTixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxzQkFBc0IsQ0FBQyxTQUFTLENBQUM7YUFDakQ7WUFFRCwrQ0FBK0M7WUFFL0MsTUFBTSx1QkFBdUIsR0FBOEI7Z0JBQ3ZELFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUM7Z0JBQ3ZDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUN6QyxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztnQkFDN0MsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3ZDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO2dCQUN2QyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDekMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDO2dCQUN6RCxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQkFDM0MsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3pDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dCQUMzQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQzthQUMxQztZQUVELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNuQixJQUFJLFlBQVksR0FBd0IsSUFBSSxDQUFDO1lBQzdDLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7WUFDOUIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxFQUFFO2dCQUNULFVBQVUsRUFBRSxDQUFDO2dCQUNiLElBQUksVUFBVSxHQUFHLElBQUksRUFBRTtvQkFDbkIsTUFBTTtpQkFDVDtnQkFFRCxJQUFJLG1CQUFtQixHQUFrQyxFQUFFO2dCQUMzRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRTtvQkFDcEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7d0JBQzlCLFNBQVM7cUJBQ1o7b0JBQ0QsTUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDOUMsSUFBSSxNQUFNLEVBQUU7d0JBQ1IsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO3FCQUNyQztpQkFDSjtnQkFFRCxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUU7b0JBQ2hCLE9BQU8sbUJBQW1CLENBQUMsVUFBVSxDQUFDO2lCQUN6QztnQkFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDM0IsTUFBTTtpQkFDVDtnQkFDRCxLQUFLLElBQUksR0FBRyxJQUFJLG1CQUFtQixFQUFFO29CQUNqQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ3RCLFNBQVM7cUJBQ1o7b0JBQ0QsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDMUIsWUFBWSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN4QyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUNmLE1BQU07cUJBQ1Q7b0JBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRTt3QkFDZixTQUFTO3FCQUNaO2lCQUNKO2dCQUNELElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2YsTUFBTTtpQkFDVDtnQkFDRCxxQ0FBcUM7Z0JBQ3JDLDJEQUEyRDtnQkFDM0QsTUFBTSxpQkFBaUIsR0FBVyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7Z0JBRWpELGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pELElBQUksYUFBYSxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUU7b0JBQ3BDLGFBQWE7b0JBQ2IsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDaEYsa0RBQWtEO3dCQUNsRCxrQkFBa0I7d0JBQ2xCLFlBQVksR0FBRyxJQUFJLENBQUM7d0JBQ3BCLFNBQVM7cUJBQ1o7aUJBQ0o7Z0JBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSw2Q0FBTyxFQUFFLENBQUM7Z0JBQ3BDLG9EQUFVLENBQUMsYUFBYSxFQUFFO29CQUN0QixpQkFBaUIsRUFBRSxTQUFTO29CQUM1QixZQUFZLEVBQUUsUUFBUTtvQkFDdEIsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsWUFBWSxFQUFFLFlBQVk7b0JBQzFCLGFBQWEsRUFBRSxZQUFZO29CQUMzQixNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUUsVUFBVTtpQkFDekIsQ0FBQztnQkFDRixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sSUFBSSxhQUFhLENBQUMsaUJBQWlCLENBQUM7Z0JBQzNDLE9BQU8sSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDO2dCQUN4QyxPQUFPLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQztnQkFDdEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxFQUFFO29CQUNkLFdBQVcsQ0FBQyxJQUFJLENBQUM7d0JBQ2IsR0FBRyxFQUFFLFlBQVk7d0JBQ2pCLE9BQU87cUJBQ1YsQ0FBQztpQkFDTDtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzdCO1lBRUQsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDeEIseUJBQXlCO2dCQUN6QixXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2xELFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2FBQ3JDO1lBRUQsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDZixTQUFTO2FBQ1o7WUFFRCxNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRLEdBQUcsK0NBQVcsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDMUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDVCxTQUFTO2FBQ1o7WUFDRCxNQUFNO1NBQ1Q7S0FDSjtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM3ZCcUQ7QUFDaEI7QUFFL0IsTUFBTSxlQUFlO0lBVXhCLFlBQVksU0FBK0MsU0FBUztRQVRwRSxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixhQUFRLEdBQXVCLEVBQUUsQ0FBQztRQUNsQyxhQUFRLEdBQWEsS0FBSyxDQUFDO1FBQzNCLGlCQUFZLEdBQVcsRUFBRSxDQUFDLENBQUUsMkJBQTJCO1FBQ3ZELGlCQUFZLEdBQWEsRUFBRSxDQUFDLENBQUUsMkJBQTJCO1FBQ3pELGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLHdCQUFtQixHQUFpQixJQUFJLENBQUM7UUFHckMsSUFBSSxNQUFNLEVBQUU7WUFDUixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsSUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFJLE1BQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM3QztTQUNKO1FBQ0QsK0NBQStDO1FBQy9DLGtEQUFrRDtRQUNsRCw2QkFBNkI7UUFDN0Isb0NBQW9DO1FBQ3BDLDBCQUEwQjtRQUMxQixvQ0FBb0M7UUFDcEMsa0JBQWtCO1FBQ2xCLGlDQUFpQztRQUNqQyxvQ0FBb0M7UUFDcEMsZUFBZTtRQUNmLHFDQUFxQztRQUNyQyxRQUFRO1FBQ1IsSUFBSTtRQUNKLDBDQUEwQztRQUMxQywwQ0FBMEM7UUFFMUMsMEJBQTBCO1FBQzFCLDhDQUE4QztRQUM5Qyx3QkFBd0I7UUFDeEIsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxLQUFLO1FBQ0wsb0JBQW9CO1FBQ3BCLDZCQUE2QjtRQUM3QixxREFBcUQ7UUFDckQsb0RBQW9EO1FBQ3BELGdEQUFnRDtRQUNoRCxJQUFJO1FBQ0osMERBQTBEO1FBRTFELGlCQUFpQjtRQUNqQixZQUFZO1FBQ1osZUFBZTtRQUNmLFlBQVk7UUFDWixlQUFlO1FBQ2YsZUFBZTtRQUNmLFlBQVk7UUFDWixlQUFlO1FBQ2YsWUFBWTtRQUNaLGVBQWU7UUFDZixZQUFZO1FBQ1osZUFBZTtRQUNmLFlBQVk7UUFDWixlQUFlO1FBQ2YsWUFBWTtRQUNaLGVBQWU7UUFDZixZQUFZO1FBQ1osWUFBWTtRQUNaLGVBQWU7UUFDZixZQUFZO1FBQ1osZUFBZTtRQUNmLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxnREFBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsK0RBQW9CLEVBQUUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxRQUFnQjtRQUNqQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLENBQUM7UUFDaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFFLGdDQUFnQztRQUNsRCxJQUFJLHdCQUF3QixHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFckIsS0FBSyxNQUFNLGFBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDdEMsd0JBQXdCLEdBQUcsT0FBTyxDQUFDO2FBQ3RDO1lBQ0QsV0FBVyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUM7WUFDNUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxjQUFjLENBQUM7WUFDeEMsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLEVBQUcsNkVBQTZFO2dCQUMvRixhQUFhLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN2RSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUU7b0JBQ3hELGFBQWEsQ0FBQyw2QkFBNkIsR0FBRyxhQUFhLENBQUMsb0JBQW9CLENBQUM7aUJBQ3BGO3FCQUFNO29CQUNILGFBQWEsQ0FBQyw2QkFBNkIsR0FBRyxHQUFHLENBQUM7aUJBQ3JEO2dCQUNELGFBQWEsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUNwSCxhQUFhLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzdDLGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsK0NBQVcsQ0FBQztnQkFDakgsYUFBYSxDQUFDLDZCQUE2QixHQUFHLHdCQUF3QixHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsK0NBQVcsQ0FBQztnQkFDeEcsT0FBTyxhQUFhLENBQUM7YUFDeEI7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsV0FBVztRQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3RGLENBQUM7Q0FDSjtBQUVNLE1BQU0sV0FBVztJQTZJcEIsWUFBWSxTQUEyQyxTQUFTO1FBNUloRSx5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFDakMsa0NBQTZCLEdBQVcsQ0FBQyxDQUFDO1FBQzFDLHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUM5QixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4Qix5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFDakMsa0NBQTZCLEdBQVcsQ0FBQyxDQUFDO1FBRTFDLGdCQUFXLEdBQVksR0FBRyxDQUFDO1FBQzNCLG1CQUFjLEdBQVcsQ0FBQztRQUMxQixVQUFLLEdBQVksRUFBRSxDQUFDO1FBQ3BCLGNBQVMsR0FBYSxJQUFJLENBQUM7UUFDM0IsbUJBQWMsR0FBWSxHQUFHLENBQUM7UUFDOUIsZ0JBQVcsR0FBWSxHQUFHLENBQUM7UUFDM0IscUJBQWdCLEdBQVksQ0FBQyxDQUFDO1FBQzlCLGtCQUFhLEdBQVksQ0FBQyxDQUFDO1FBQzNCLFVBQUssR0FJQTtZQUNHO2dCQUNJLEtBQUssRUFBRSxJQUFJO2dCQUNYLElBQUksRUFBRSxJQUFJO2dCQUNWLE1BQU0sRUFBRSxFQUFFO2FBQ2I7WUFDRDtnQkFDSSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNLEVBQUUsQ0FBQzthQUNaO1lBQ0Q7Z0JBQ0ksS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLENBQUM7YUFDWjtZQUNEO2dCQUNJLEtBQUssRUFBRSxJQUFJO2dCQUNYLElBQUksRUFBRSxJQUFJO2dCQUNWLE1BQU0sRUFBRSxFQUFFO2FBQ2I7U0FDSixDQUFDO1FBQ04saUJBQVksR0FFUCxFQUFFLENBQUM7UUFDUixrQkFBYSxHQUtUO1lBQ0ksR0FBRyxFQUFFO2dCQUNELE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLENBQUM7YUFDWjtZQUNELEdBQUcsRUFBRTtnQkFDRCxPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsQ0FBQzthQUNaO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUNiO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLENBQUM7YUFDWjtTQUNKO1FBQ0wsa0JBQWEsR0FLVDtZQUNJLEtBQUssRUFBRTtnQkFDSCxPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsQ0FBQzthQUNaO1lBQ0QsS0FBSyxFQUFFO2dCQUNILE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7U0FDSixDQUFDO1FBQ04sb0JBQWUsR0FBVyxJQUFJLENBQUM7UUFDL0Isa0JBQWEsR0FLVDtZQUNJLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsQ0FBQzthQUNaO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLENBQUM7YUFDWjtZQUNELFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsQ0FBQzthQUNaO1lBQ0QsV0FBVyxFQUFFO2dCQUNULE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLENBQUM7YUFDWjtZQUNELFlBQVksRUFBRTtnQkFDVixPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsQ0FBQzthQUNaO1lBQ0QsYUFBYSxFQUFFO2dCQUNYLE9BQU8sRUFBRSxJQUFJO2dCQUNiLE1BQU0sRUFBRSxDQUFDO2FBQ1o7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLENBQUM7YUFDWjtTQUNKO1FBSUQsSUFBSSxNQUFNLEVBQUU7WUFDUixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsSUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFJLE1BQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM3QztTQUNKO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELGtCQUFrQjtRQUNkLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUN6RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtZQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO29CQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHO2lCQUNuQyxDQUFDLENBQUM7YUFDTjtTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDN0Q7SUFDTCxDQUFDO0NBRUo7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeFIrQztBQUV6QyxNQUFNLG9CQUFvQjtJQUs3QixZQUFZLE1BQW1CO1FBQzNCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUU7WUFDMUMsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDekMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM5QjtTQUNKO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFBQSxDQUFDO0lBRU0sb0JBQW9CO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztTQUMvQjtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNoSCwwQ0FBMEM7UUFDMUMsMkdBQTJHO1FBQzNHLDREQUE0RDtRQUM1RCxvRUFBb0U7UUFDcEUsdUVBQXVFO1FBQ3ZFLFlBQVk7UUFDWixRQUFRO1FBQ1IsSUFBSTtRQUVKLHlDQUF5QztRQUN6QyxjQUFjO1FBQ2QsSUFBSTtRQUVKLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2FBQ3REO1NBQ0o7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVLLE9BQU87UUFDVixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUMzQjtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDaEMsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDL0I7UUFDRCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTyxJQUFJLEVBQUU7WUFDVCxJQUFJLFVBQVUsRUFBRSxHQUFHLEtBQUssRUFBRTtnQkFDdEIsT0FBTyxJQUFJLENBQUM7YUFDZjtZQUNELElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN6QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNoRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDO3dCQUNqRixPQUFPLElBQUkseUNBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDL0I7aUJBQ0o7YUFDSjtZQUNELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNFNko7QUFHdkosTUFBTSxZQUFhLFNBQVEsS0FBSztDQUFHO0FBR25DLE1BQU0sT0FBTztJQUFwQjtRQUNJLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDN0Isc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO1FBQzNCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsdUJBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBQy9CLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUM5QixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRXhCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO1FBRTNCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUU3QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUd6QixjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBRTdCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBRXpCLFlBQU8sR0FBVyxFQUFFLENBQUM7SUFtRHpCLENBQUM7SUFqREcsZUFBZSxDQUFDLE1BQW9FO1FBQ2hGLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDakMsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDM0IsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDN0IsT0FBTyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUNqQyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUNyQyxPQUFPLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixPQUFPLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ25DLE9BQU8sSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbEMsT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDOUIsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDN0IsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDM0IsT0FBTyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDaEMsT0FBTyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFNUIsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDN0IsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDL0IsT0FBTyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUVqQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixPQUFPLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBRWpDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDO1FBQzVCLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRCxPQUFPO1FBQ0gsTUFBTSxPQUFPLEdBQTRCLEVBQUUsQ0FBQztRQUM1QyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsRUFBRTtnQkFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFJLElBQUksQ0FBQyxHQUFHLENBQXVCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1NBQ0o7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsSUFBVztRQUNoQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsNkJBQTZCO1FBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMvQzthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxPQUFPLENBQUM7U0FDaEM7SUFDTCxDQUFDO0NBQ0o7QUFFRCxTQUFTLHFCQUFxQixDQUFDLEdBQVEsRUFBRSxRQUFrQjtJQUN2RCxPQUFPLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUNwQixHQUFHLENBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRO1lBQ3hCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7WUFDakQsK0JBQStCO1lBQy9CLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7Z0JBQ2pELE9BQU8scUJBQXFCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQzthQUMvQztZQUNELE9BQU8sTUFBTTtRQUNmLENBQUM7UUFDRCxHQUFHLENBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUTtZQUMvQix3Q0FBd0M7WUFDeEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLGdDQUFnQyxDQUFDO1lBQzdELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7UUFDbEQsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUksU0FBUyxXQUFXO0lBQ3ZCLE9BQU8scUJBQXFCLENBQUMsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLE1BQWUsRUFBRSxHQUFXLEVBQUUsS0FBVSxFQUFFLEVBQUU7UUFDckYsSUFBSSxNQUFNLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM5QztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQW1CTSxNQUFNLFVBQVUsR0FBRyxDQUFDLE9BQWdCLEVBQUUsTUFBcUIsRUFBVyxFQUFFO0lBQ3ZFLE1BQU0sRUFDRixlQUFlLEVBQ2YsaUJBQWlCLEVBQ2pCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsWUFBWSxFQUNaLDRCQUE0QixFQUM1Qix5QkFBeUIsRUFDekIsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sVUFBVSxFQUNWLFlBQVksR0FDZixHQUFHLE1BQU0sQ0FBQztJQUNmOzs7OztNQUtFO0lBRUYsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJLGFBQWEsQ0FBQztJQUNsQixJQUFJLGVBQWUsR0FBVyxFQUFFLENBQUM7SUFDakMsSUFBSSxtQkFBbUIsR0FBVyxFQUFFLENBQUM7SUFDckMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO0lBQzdCLElBQUksZUFBZSxFQUFFO1FBQ2pCLE1BQU0sY0FBYyxHQUFHLFlBQVksR0FBRywrQ0FBVyxDQUFDO1FBQ2xELElBQUksR0FBRyxHQUFpQixFQUFFLENBQUM7UUFDM0IsS0FBSyxNQUFNLFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUM1RCxtRUFBbUU7WUFDbkUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDakUsU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDOUI7UUFDRCxlQUFlLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsS0FBSyxNQUFNLFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsK0NBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQzFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ2pFLGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1NBQ2xDO1FBQ0QsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQyxLQUFLLElBQUksQ0FBQyxHQUFDLFlBQVksRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLEtBQUssTUFBTSxRQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7Z0JBQy9DLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDakMsU0FBUztpQkFDWjtnQkFDRCxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQzthQUM1RTtZQUNELElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQzlDLE1BQU07YUFDVDtTQUNKO0tBQ0o7U0FBTSxJQUFJLGlCQUFpQixFQUFFO1FBQzFCLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztLQUN2QztJQUVELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztJQUNuQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDaEIsTUFBTTtTQUNUO1FBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDaEIsTUFBTTtTQUNUO1FBQ0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNoQixNQUFNO1NBQ1Q7UUFDRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDaEIsTUFBTTtTQUNUO0tBQ0o7SUFDRCxJQUFJLFNBQVMsSUFBSSxhQUFhLElBQUksUUFBUSxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUMzSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxPQUFPLEVBQUU7UUFDVCxPQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztLQUM5QjtJQUVELElBQUksU0FBUyxDQUFDO0lBQ2QsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM1QixTQUFTLEdBQUcsT0FBTyxDQUFDO0tBQ3ZCO1NBQU07UUFDSCxTQUFTLEdBQUcsZUFBZSxDQUFDO0tBQy9CO0lBRUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxzREFBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsc0RBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLGtFQUFrRTtJQUNsRSxJQUFJLGVBQWUsR0FBa0IsRUFBRTtJQUN2QyxJQUFJLFFBQVEsR0FBb0IsSUFBSSxDQUFDO0lBQ3JDLE1BQU0sV0FBVyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUVwRCxJQUFJLFlBQVksRUFBRTtRQUNkLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLGVBQWUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckYsZUFBZSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLENBQUM7UUFDOUUsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixpQ0FBaUM7WUFDakMsT0FBTyxDQUFDLFVBQVUsSUFBSSxHQUFHO1lBQ3pCLE9BQU8sT0FBTyxDQUFDO1NBQ2xCO0tBQ0o7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxDQUFDLGtCQUFrQixJQUFJLENBQUMsQ0FBQzthQUNuQztZQUNELElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxDQUFDLGtCQUFrQixJQUFJLEdBQUcsQ0FBQzthQUNyQztZQUNELElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxDQUFDLGtCQUFrQixJQUFJLEdBQUcsQ0FBQzthQUNyQztTQUNKO0tBQ0o7SUFFRCxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3ZHLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pDLE9BQU8sQ0FBQyxlQUFlLElBQUksR0FBRyxDQUFDO2FBQ2xDO1NBQ0o7S0FDSjtJQUNELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDckcsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxNQUFNLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDekMsT0FBTyxDQUFDLGVBQWUsSUFBSSxHQUFHLENBQUM7YUFDbEM7U0FDSjtLQUNKO0lBR0QsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNuRCxPQUFPLENBQUMsZUFBZSxJQUFJLEdBQUcsQ0FBQyxDQUFFLDRCQUE0QjtLQUNoRTtJQUVELE1BQU0sa0JBQWtCLEdBQThCO1FBQ2xELENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUcsSUFBSTtRQUMxQyxpRkFBaUY7S0FDcEY7SUFFRCxNQUFNLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNoRSxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdDLE1BQU0sa0JBQWtCLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLElBQUksbUJBQW1CLEVBQUU7WUFDaEQsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBa0IsRUFBRTtnQkFDNUMseUNBQXlDO2dCQUN6QyxPQUFPLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQzthQUM5QjtpQkFBTSxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLGtCQUFrQixHQUFHLENBQUMsRUFBRTtnQkFDdkQsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNsQixhQUFhO29CQUNiLE9BQU8sQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDO2lCQUM5QjthQUNKO1NBQ0o7S0FDSjtJQUVELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLEtBQUssTUFBTSxnQkFBZ0IsSUFBSSxpQkFBaUIsRUFBRTtRQUM5QyxNQUFNLFVBQVUsR0FBVyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtZQUNqQixnQkFBZ0IsRUFBRSxDQUFDO1NBQ3RCO0tBQ0o7SUFDRCxJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBRTtRQUN0QixPQUFPLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDO0tBQ25DO0lBRUQsMkJBQTJCO0lBQzNCLElBQUksUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkMsdUJBQXVCO1FBQ3ZCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ25ELE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQUksZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hGLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtZQUNsQixPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztTQUNoQztRQUNELEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksZUFBZSxFQUFFO2dCQUM5QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzdELDZCQUE2QjtvQkFDN0IsT0FBTyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7aUJBQ2hDO2FBQ0o7U0FDSjtLQUNKO0lBQ0QsSUFBSSxTQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQyxJQUFJLENBQUMsU0FBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUU7WUFDcEMsd0JBQXdCO1lBQ3hCLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQ3BELE1BQU0sV0FBVyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdELE1BQU0sc0JBQXNCLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzNHLElBQUksc0JBQXNCLElBQUksQ0FBQyxFQUFFO2dCQUM3QixPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQzthQUNoQztTQUNKO0tBQ0o7SUFFRCxtQkFBbUI7SUFDbkIsTUFBTSxlQUFlLEdBQUc7UUFDcEIsSUFBSSxFQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsQ0FBQztRQUNULE1BQU0sRUFBRSxDQUFDO0tBQ1o7SUFDRCxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDekIsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QyxNQUFNLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLElBQUksR0FBRyxVQUFVLEdBQUcsWUFBWSxDQUFDO1FBQ3ZDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2hFLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNWLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7U0FDN0I7UUFDRCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7WUFDWCxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkQsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7U0FDaEQ7S0FDSjtJQUVELHFDQUFxQztJQUNyQyxJQUFJLGlCQUFpQixJQUFJLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtRQUN2RCxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztLQUM3QjtJQUNELElBQUksaUJBQWlCLElBQUksTUFBTSxJQUFJLGVBQWUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZELGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsSUFBSSxlQUFlLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtRQUNwRCxPQUFPLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQztLQUNoQztJQUNELElBQUksZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksZUFBZSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDcEQsT0FBTyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUFDRCw0RUFBNEU7SUFDNUUsb0NBQW9DO0lBQ3BDLG9EQUFvRDtJQUNwRCxJQUFJO0lBRUosb0NBQW9DO0lBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEcsZ0NBQWdDO2dCQUNoQyxTQUFTO2FBQ1o7WUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9FLElBQUksUUFBUSxHQUFHLEVBQUUsSUFBSSxRQUFRLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxRQUFRLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDM0QsdURBQXVEO2dCQUN2RCxJQUFJLFFBQVEsSUFBSSxZQUFZLEVBQUU7b0JBQzFCLE9BQU8sQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO29CQUM3QixTQUFTO2lCQUNaO2FBQ0o7U0FDSjtLQUNKO0lBQ0QsK0NBQStDO0lBQy9DLGtEQUFrRDtJQUNsRCw4QkFBOEI7SUFDOUIsK0NBQStDO0lBQy9DLE1BQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUIsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDNUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM1RiwwREFBMEQ7WUFDMUQsT0FBTyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7U0FDaEM7S0FDSjtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEIsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RGLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1RixJQUFJLG9CQUFvQixJQUFJLENBQUMsRUFBRTtZQUMzQixJQUFJLGtCQUFrQixJQUFJLENBQUMsRUFBRTtnQkFDekIsMkRBQTJEO2dCQUMzRCxPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQzthQUNoQztTQUNKO0tBQ0o7SUFFRCxpQkFBaUI7SUFDakIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsSUFBSSxZQUFZLEdBQUcsRUFBRSxJQUFJLFlBQVksR0FBRyxFQUFFLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ25FLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO0tBQzdCO0lBRUQsb0JBQW9CO0lBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0MsTUFBTSxjQUFjLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxZQUFZLElBQUksY0FBYyxFQUFFO1lBQ2hDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksQ0FBQyxFQUFFLGNBQWMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDckUsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7YUFDN0I7U0FDSjtRQUNELElBQUksWUFBWSxJQUFJLGNBQWMsRUFBRTtZQUNoQyxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLENBQUMsRUFBRSxjQUFjLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JFLE9BQU8sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO2FBQzdCO1NBQ0o7S0FDSjtJQUVELGlCQUFpQjtJQUNqQiw0Q0FBNEM7SUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QyxJQUFJLG9CQUFvQixHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDUixvQkFBb0IsR0FBRyxHQUFHLENBQUM7U0FDOUI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDUixvQkFBb0IsR0FBRyxHQUFHLENBQUM7U0FDOUI7UUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2YsT0FBTyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsb0JBQW9CLENBQUM7U0FDcEQ7UUFDRCxJQUFJLFFBQVEsSUFBSSxFQUFFLEVBQUU7WUFDaEIsT0FBTyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsb0JBQW9CLENBQUM7WUFDakQsU0FBUztTQUNaO1FBQ0QsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2YsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsb0JBQW9CLENBQUM7U0FDbEQ7UUFDRCxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDZCxPQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztTQUNsRDtRQUNELElBQUksUUFBUSxJQUFJLEVBQUUsRUFBRSxFQUFHLFlBQVk7WUFDL0IsT0FBTyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUM7WUFDMUIsU0FBUztTQUNaO1FBQ0QsSUFBSSxRQUFRLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUUsK0JBQStCO1NBQ25FO1lBQ0ksT0FBTyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsb0JBQW9CLENBQUM7WUFDakQsU0FBUztTQUNaO1FBQ0QsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2YsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsb0JBQW9CLENBQUM7WUFDL0MsU0FBUztTQUNaO1FBQ0QsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2YsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsb0JBQW9CLENBQUM7WUFDL0MsU0FBUztTQUNaO0tBQ0o7SUFFRCxxQkFBcUI7SUFFckIsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixZQUFZO0lBQ1osYUFBYTtJQUNiLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsYUFBYTtJQUViLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3hDLE1BQU0seUJBQXlCLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsc0RBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTtnQkFDZixxQ0FBcUM7Z0JBQ3JDLHVHQUF1RztnQkFDdkcsa0NBQWtDO2dCQUNsQyxvRUFBb0U7Z0JBQ3BFLE1BQU0sZ0JBQWdCLEdBQUcseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFeEMsTUFBTSxtQkFBbUIsR0FBRyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sWUFBWSxHQUFHLG1CQUFtQixHQUFHLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDO2dCQUV2RSxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsSUFBSSxZQUFZLElBQUksQ0FBQyxFQUFFO3dCQUNuQix3RUFBd0U7d0JBQ3hFLFNBQVM7cUJBQ1o7b0JBQ0QsSUFBSSxZQUFZLElBQUksQ0FBQyxFQUFFO3dCQUNuQiwyRUFBMkU7d0JBQzNFLFNBQVM7cUJBQ1o7aUJBQ0o7Z0JBQ0QsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO29CQUNmLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTt3QkFDbkIsd0VBQXdFO3dCQUN4RSxTQUFTO3FCQUNaO29CQUNELElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTt3QkFDbkIsMkVBQTJFO3dCQUMzRSxTQUFTO3FCQUNaO2lCQUNKO2dCQUNELElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTtvQkFDZixJQUFJLFlBQVksSUFBSSxDQUFDLEVBQUU7d0JBQ25CLDRFQUE0RTt3QkFDNUUsU0FBUztxQkFDWjtvQkFDRCxJQUFJLFlBQVksSUFBSSxDQUFDLEVBQUU7d0JBQ25CLDRFQUE0RTt3QkFDNUUsU0FBUztxQkFDWjtpQkFDSjtnQkFDRCxJQUFJLFFBQVEsSUFBSSxFQUFFLEVBQUU7b0JBQ2hCLFNBQVM7aUJBQ1o7Z0JBRUQsMENBQTBDO2dCQUMxQyxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFlBQVksSUFBSSxnQkFBZ0IsSUFBSSxVQUFVLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksZ0JBQWdCLElBQUksVUFBVSxJQUFJLFlBQVksQ0FBQyxFQUFFO29CQUN0SSw0QkFBNEI7b0JBQzVCLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTt3QkFDZixPQUFPLENBQUMsVUFBVSxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUM7cUJBQzFDO3lCQUFNLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTt3QkFDdEIsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUUsYUFBYTtxQkFDdkQ7eUJBQU07d0JBQ0gsT0FBTyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBRSxXQUFXO3FCQUMxQztpQkFDSjtxQkFBTTtvQkFDSCx3QkFBd0I7b0JBQ3hCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDO29CQUN6RCxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7d0JBQ2xCLHNCQUFzQjt3QkFDdEIsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFOzRCQUNmLE9BQU8sQ0FBQyxVQUFVLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQzt5QkFDMUM7NkJBQU0sSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFOzRCQUN0QixPQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBRSxhQUFhO3lCQUN2RDs2QkFBTTs0QkFDSCxPQUFPLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQzt5QkFDN0I7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO1FBRUQsTUFBTSxvQkFBb0IsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxzREFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRyxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BCLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDO1lBQzdCLElBQUksb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pCLGlCQUFpQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsaUJBQWlCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsSUFBSSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEYsaUJBQWlCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7WUFDRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3QyxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztZQUN6QixxQ0FBcUM7WUFDckMsK0NBQStDO1lBQy9DLDZFQUE2RTtZQUM3RSw0REFBNEQ7WUFDNUQsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLGdCQUFnQixJQUFJLGlCQUFpQixDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyRTtZQUVELE1BQU0sZUFBZSxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRixNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRXpILElBQUksaUJBQWlCLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQzFNLHNEQUFzRDtvQkFDdEQsY0FBYztvQkFDZCxPQUFPLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQztpQkFDN0I7YUFDSjtZQUNELElBQUksaUJBQWlCLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDOUkscUJBQXFCO29CQUNyQixPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztpQkFDOUI7YUFDSjtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDUixJQUFJLGNBQWMsSUFBSSxDQUFDLEVBQUU7b0JBQ3JCLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO29CQUMxQixJQUFJLGVBQWUsSUFBSSxDQUFDLEVBQUU7d0JBQ3RCLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO3FCQUM3QjtpQkFDSjtnQkFFRCxNQUFNLGFBQWEsR0FBRyxxREFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFOUQsSUFBSSxVQUFVLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEMsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksYUFBYSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFDLGFBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUV2QixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztnQkFDOUIsSUFBSSxvQkFBb0IsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDO2dCQUMzRSxLQUFLLElBQUksR0FBRyxHQUFDLFlBQVksRUFBRSxHQUFHLEdBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLEVBQUU7b0JBQ2pFLE1BQU0sS0FBSyxHQUFHLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDakQsS0FBSyxNQUFNLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTt3QkFDdEUsSUFBSSxzREFBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLEVBQUU7NEJBQzdDLGlCQUFpQixHQUFHLElBQUksQ0FBQzt5QkFDNUI7d0JBQ0QsSUFBSSxzREFBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLEVBQUU7NEJBQ2hELG9CQUFvQixHQUFHLElBQUksQ0FBQzt5QkFDL0I7cUJBQ0o7aUJBQ0o7Z0JBRUQsSUFBSSxpQkFBaUIsRUFBRTtvQkFDbkIsT0FBTyxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztvQkFDekMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDbEQsa0RBQWtEO3dCQUNsRCxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7NEJBQ3BCLE9BQU8sQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO3lCQUM5QjtxQkFDSjtvQkFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNsRCxxREFBcUQ7d0JBQ3JELElBQUksZ0JBQWdCLElBQUksQ0FBQyxFQUFFOzRCQUN2QixPQUFPLENBQUMsWUFBWSxJQUFJLGdCQUFnQixDQUFDO3lCQUM1Qzt3QkFDRCxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7NEJBQ3BCLE9BQU8sQ0FBQyxZQUFZLElBQUksY0FBYyxDQUFDO3lCQUMxQztxQkFDSjtpQkFDSjtxQkFBTTtvQkFDSCxJQUFJLGVBQWUsSUFBSSxDQUFDLElBQUksY0FBYyxJQUFJLENBQUMsRUFBRTt3QkFDN0MsNEJBQTRCO3dCQUM1QixPQUFPLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLGVBQWUsR0FBRyxDQUFDO3FCQUNuRDtpQkFDSjtnQkFDRCxJQUFJLG9CQUFvQixFQUFFO29CQUN0QixPQUFPLENBQUMsT0FBTyxHQUFHLDBCQUEwQixDQUFDO29CQUM3QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNyRCxvREFBb0Q7d0JBQ3BELElBQUksY0FBYyxHQUFHLENBQUMsRUFBRTs0QkFDcEIsT0FBTyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7eUJBQzlCO3FCQUNKO29CQUNELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3JELHVEQUF1RDt3QkFDdkQsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLEVBQUU7NEJBQ3ZCLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7eUJBQ2pEO3dCQUNELElBQUksY0FBYyxHQUFHLENBQUMsRUFBRTs0QkFDcEIsT0FBTyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUM7eUJBQy9DO3FCQUNKO2lCQUNKO3FCQUFNO29CQUNILElBQUksZUFBZSxJQUFJLENBQUMsSUFBSSxjQUFjLElBQUksQ0FBQyxFQUFFO3dCQUM3QyxJQUFJLGlCQUFpQixFQUFFOzRCQUNuQiwwQkFBMEI7NEJBQzFCLE9BQU8sQ0FBQyxZQUFZLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQzt5QkFDL0M7cUJBQ0o7aUJBQ0o7Z0JBQ0QsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLEVBQUU7b0JBQ3ZCLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO2lCQUM3QjtnQkFDRCxNQUFNO2FBQ1Q7U0FDSjtLQUNKO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN3RCcUQ7QUFLL0MsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBaUJ2QixNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxFQUFFO0lBQzdELG9DQUFvQztJQUNwQyxtQkFBbUI7SUFDbkIsMEJBQTBCO0lBRTFCLGtCQUFrQjtJQUNsQix3QkFBd0I7SUFFeEIsNkJBQTZCO0lBQzdCLHVDQUF1QztJQUN2Qyx1Q0FBdUM7SUFDdkMsc0NBQXNDO0lBRXRDLG1CQUFtQjtJQUNuQixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBRWxCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FDWCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsRUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQ2hELENBQUM7QUFDTixDQUFDO0FBRU0sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQVksRUFBNkIsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7Q0FDL0IsQ0FBQztBQUdLLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFlLEVBQUUsU0FBaUIsRUFBRSxLQUFZLEVBQW9CLEVBQUU7SUFDbkcsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ25CLE1BQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztJQUM5QyxJQUFJLFVBQVUsR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDYixNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNuQixVQUFVLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztLQUMxQztJQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDYixNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNuQixVQUFVLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztLQUMxQztJQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDYixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsTUFBTSxhQUFhLEdBQUcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ3hELE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDNUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEUsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQUdNLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBbUIsRUFBRSxFQUFFO0lBQ2pELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztJQUM1QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0lBQzVDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztJQUU1QyxNQUFNLHVCQUF1QixHQUFHO1FBQzVCLGNBQWMsQ0FBQyxJQUFJLCtDQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsY0FBYyxDQUFDLElBQUksK0NBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxjQUFjLENBQUMsSUFBSSwrQ0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLGNBQWMsQ0FBQyxJQUFJLCtDQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbkM7SUFFRCxNQUFNLGNBQWMsR0FBRztRQUNuQixDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2RSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDMUU7SUFDRCxPQUFPO1FBQ0gsdUJBQXVCO1FBQ3ZCLGNBQWM7S0FDakI7QUFDTCxDQUFDO0FBR0QsTUFBTSxpQkFBaUIsR0FBNEI7SUFDL0MsQ0FBQyxFQUFFLEdBQUc7SUFDTixDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxHQUFHO0lBQ04sQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxHQUFHO0lBQ04sQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsR0FBRztJQUNOLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLEdBQUc7SUFDTixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxHQUFHO0NBQ1Y7QUFHTSxNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQW9CLEVBQVUsRUFBRTtJQUN4RCxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsT0FBTyxNQUFNLENBQUM7S0FDakI7SUFDRCxPQUFPLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDdkUsQ0FBQztBQUdNLE1BQU0sWUFBWSxHQUFHLFVBQVUsS0FBaUIsRUFBRSxRQUEwQixFQUFFLElBQUksR0FBRyxLQUFLO0lBQzdGLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM1QixDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEIsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFHTSxNQUFNLGNBQWMsR0FBcUM7SUFDNUQsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZCxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNkLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ25CLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ25CLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNuQixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDbkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNsQjtBQUdNLE1BQU0sS0FBSztJQWNkLFlBQVksY0FBK0IsRUFBRSxZQUFnQyxTQUFTO1FBQ2xGLElBQUksUUFBUSxDQUFDO1FBQ2IsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUU7WUFDcEMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwRCxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7Z0JBQ2xCLE1BQU0scUJBQXFCLEdBQUcsY0FBYyxDQUFDO2FBQ2hEO1lBQ0QsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO2dCQUNwQixNQUFNLHFCQUFxQixHQUFHLGNBQWMsQ0FBQzthQUNoRDtZQUNELFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsU0FBUyxHQUFHLFNBQVMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNILFFBQVEsR0FBRyxjQUFjLENBQUM7U0FDN0I7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLElBQUksR0FBRyxDQUFDO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sc0JBQXNCLEdBQUcsU0FBUyxDQUFDO1NBQzVDO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSwrQ0FBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlFO0lBQ0wsQ0FBQztJQXBDTSxRQUFRO1FBQ1gsNEJBQTRCO1FBQzVCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsbURBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLG1EQUFnQixDQUFDLEdBQUcsQ0FBVyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEgsSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNySCxXQUFXLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsT0FBTyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QyxDQUFDO0NBNEJKO0FBOEJNLE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBVSxFQUFFLEVBQUU7SUFDekMsT0FBTyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVNLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFVLEVBQUUsYUFBNkIsSUFBSSxFQUFFLGlCQUFtQyxJQUFJLEVBQUUsRUFBRTtJQUN2SCxJQUFJLFFBQVEsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FDMUQ7SUFDRCxjQUFjLEdBQUcsY0FBYyxJQUFJLGNBQWMsQ0FBQyxVQUFrQixDQUFDLENBQUM7SUFDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDMUQsb0NBQW9DO0lBQ3BDLGdCQUFnQjtJQUNoQixJQUFJLFFBQVEsSUFBSSxjQUFjLEVBQUU7UUFDNUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3RCO0lBQ0QsTUFBTSxLQUFLLEdBQVcsY0FBYyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMzRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixNQUFNLFdBQVcsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsT0FBTyxJQUFJLEVBQUU7UUFDVCxDQUFDLEVBQUUsQ0FBQztRQUNKLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDcEM7UUFDRCxRQUFRLElBQUksS0FBSyxDQUFDO1FBQ2xCLEdBQUcsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUUsOEJBQThCO1FBQ2xELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNYLElBQUksUUFBUSxJQUFJLGNBQWMsRUFBRTtnQkFDNUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxFQUFFLEdBQUcsY0FBYyxDQUFDLEVBQUU7b0JBQ2hGLCtCQUErQjtvQkFDL0IsR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFDWjtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0o7YUFDSTtZQUNELElBQUksUUFBUSxJQUFJLGNBQWMsRUFBRTtnQkFDNUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxFQUFFLEdBQUcsY0FBYyxDQUFDLEVBQUU7b0JBQ2hGLCtCQUErQjtvQkFDL0IsR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFDWjtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0o7S0FDSjtBQUNMLENBQUM7QUFFTSxNQUFNLGNBQWMsR0FBcUMsRUFBRTtBQUNsRSxjQUFjLENBQUMscURBQVUsQ0FBQyxHQUFHLENBQUMscURBQVUsRUFBRSxxREFBVSxDQUFDO0FBQ3JELGNBQWMsQ0FBQyxxREFBVSxDQUFDLEdBQUcsQ0FBQyxxREFBVSxFQUFFLHFEQUFVLENBQUM7QUFDckQsY0FBYyxDQUFDLHFEQUFVLENBQUMsR0FBRyxDQUFDLHFEQUFVLEVBQUUscURBQVUsQ0FBQztBQUNyRCxjQUFjLENBQUMscURBQVUsQ0FBQyxHQUFHLENBQUMscURBQVUsRUFBRSxxREFBVSxDQUFDO0FBQ3JELGNBQWMsQ0FBQyxxREFBVSxDQUFDLEdBQUcsQ0FBQyxxREFBVSxFQUFFLHFEQUFVLENBQUM7QUFDckQsY0FBYyxDQUFDLHFEQUFVLENBQUMsR0FBRyxDQUFDLHNEQUFXLEVBQUUscURBQVUsQ0FBQztBQUV0RCxjQUFjLENBQUMscURBQVUsQ0FBQyxHQUFHLENBQUMscURBQVUsRUFBRSxzREFBVyxDQUFDO0FBQ3RELGNBQWMsQ0FBQyxzREFBVyxDQUFDLEdBQUcsQ0FBQyxxREFBVSxFQUFFLHNEQUFXLENBQUM7QUFDdkQsY0FBYyxDQUFDLHNEQUFXLENBQUMsR0FBRyxDQUFDLHNEQUFXLEVBQUUsc0RBQVcsQ0FBQztBQUN4RCxjQUFjLENBQUMsc0RBQVcsQ0FBQyxHQUFHLENBQUMsc0RBQVcsRUFBRSxzREFBVyxDQUFDO0FBQ3hELGNBQWMsQ0FBQyxzREFBVyxDQUFDLEdBQUcsQ0FBQyxzREFBVyxFQUFFLHNEQUFXLENBQUM7QUFDeEQsY0FBYyxDQUFDLHNEQUFXLENBQUMsR0FBRyxDQUFDLHNEQUFXLEVBQUUsc0RBQVcsQ0FBQztBQUN4RCxjQUFjLENBQUMsc0RBQVcsQ0FBQyxHQUFHLENBQUMsc0RBQVcsRUFBRSxzREFBVyxDQUFDO0FBR2pELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsRUFBRTtJQUN2RSw4REFBOEQ7SUFDOUQsaUJBQWlCO0lBQ2pCLDhCQUE4QjtJQUM5QixJQUFJLFVBQVUsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxTQUFTLElBQUksU0FBUyxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxDQUFDO0tBQ1o7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pCLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEI7UUFDRCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hDLEtBQUssTUFBTSxRQUFRLElBQUksVUFBVSxFQUFFO1lBQy9CLEtBQUssTUFBTSxXQUFXLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNoRCxhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7UUFDRCxVQUFVLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBa0IsQ0FBQztLQUNwRDtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUVNLE1BQU0sV0FBVyxHQUFHLENBQUMsZUFBb0MsRUFBRSxRQUFnQixFQUFFLFNBQWlCLEVBQW1CLEVBQUU7SUFDdEgsSUFBSSxRQUFRLElBQUksZUFBZSxFQUFFO1FBQzdCLEtBQUssTUFBTSxJQUFJLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzFDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUU7Z0JBQzdCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUdNLFNBQVMsd0JBQXdCLENBQUMsVUFBMkI7SUFDaEUsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO0lBQ25ELDhEQUE4RDtJQUM5RCxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7SUFDdkIsTUFBTSxxQkFBcUIsR0FBK0IsRUFBRSxDQUFDO0lBQzdELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDaEQsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxNQUFNLElBQUksR0FBRyxFQUFFO1lBQ2YscUJBQXFCLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUN4RCxjQUFjLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztZQUNsQyxPQUFPO1NBQ1Y7YUFBTSxJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDdEIscUJBQXFCLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUN4RCxjQUFjLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztZQUNsQyxPQUFPO1NBQ1Y7YUFBTSxJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDdEIscUJBQXFCLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBQ3BELGNBQWMsSUFBSSxXQUFXLENBQUM7WUFDOUIsU0FBUyxDQUFDLGdCQUFnQjtTQUM3QjthQUFNLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtZQUN0QixnREFBZ0Q7WUFDaEQscUJBQXFCLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUN4RCxjQUFjLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztTQUNyQzthQUFNLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtZQUN0QixtREFBbUQ7WUFDbkQscUJBQXFCLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUN4RCxjQUFjLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztTQUNyQztLQUNKO0lBQ0QsT0FBTyxxQkFBcUIsQ0FBQztBQUNqQyxDQUFDO0FBWU0sU0FBUyxvQkFBb0IsQ0FBQyxVQUEyQjtJQUM1RCxNQUFNLHFCQUFxQixHQUFHLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25FLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7SUFDeEQsTUFBTSxHQUFHLEdBQXFCLEVBQUUsQ0FBQztJQUNqQyw4REFBOEQ7SUFDOUQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakIsS0FBSyxNQUFNLFFBQVEsSUFBSSxxQkFBcUIsRUFBRTtRQUMxQyxPQUFPLEVBQUUsQ0FBQztRQUNWLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUc7WUFDZixVQUFVLEVBQUUscUJBQXFCLENBQUMsV0FBVyxDQUFDO1lBQzlDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7U0FDckM7S0FDSjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQzs7Ozs7OztVQ25ZRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTmlFO0FBQ2xCO0FBQ2dCO0FBRS9ELHdEQUFXLEVBQUU7QUFFYixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBZ0csRUFBRSxFQUFFO0lBQ2xILE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHdEQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTFFLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDdEIsdURBQVUsQ0FBRSxJQUFZLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ25HLE9BQU87S0FDVjtJQUVELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDbEIsSUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDNUIsT0FBTztLQUNWO0lBRUQsSUFBSSxPQUFxQixDQUFDO0lBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxXQUFtQixFQUFFLG1CQUF3QyxFQUFFLEVBQUU7UUFDdkYsSUFBSyxJQUFZLENBQUMsTUFBTSxFQUFFO1lBQ3RCLE9BQU8sUUFBUSxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ3RCLE9BQU87U0FDVjtRQUNELE1BQU0sU0FBUyxHQUFHLG1CQUFtQixDQUFDLFdBQVcsR0FBRyxtREFBVyxDQUFDLENBQUM7UUFDakUsSUFBSSxXQUFXLElBQUksSUFBSSxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUN4RSxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNiLFFBQVEsRUFBRTtvQkFDTixXQUFXO29CQUNYLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtpQkFDdkM7Z0JBQ0QsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDdkUsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBQ0Qsc0RBQVMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNoRCxNQUFNLGVBQWUsR0FBd0IsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUNwRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQyxPQUFPO1NBQ1Y7UUFDQSxJQUFZLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3pGLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL211c2ljdGhlb3J5anMvZGlzdC9tdXNpY3RoZW9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXZhaWxhYmxlc2NhbGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHByb2dyZXNzaW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZvcmNlZG1lbG9keS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ29vZHNvdW5kaW5nc2NhbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ludmVyc2lvbnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL215bG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9ub25jaG9yZHRvbmVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhbmRvbWNob3Jkcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVuc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3dvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLk11c2ljVGhlb3J5ID0ge30pKTtcbn0pKHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgIC8qKlxyXG4gICAgKiBOb3RlcyBzdGFydGluZyBhdCBDMCAtIHplcm8gaW5kZXggLSAxMiB0b3RhbFxyXG4gICAgKiBNYXBzIG5vdGUgbmFtZXMgdG8gc2VtaXRvbmUgdmFsdWVzIHN0YXJ0aW5nIGF0IEM9MFxyXG4gICAgKiBAZW51bVxyXG4gICAgKi9cclxuICAgdmFyIFNlbWl0b25lO1xyXG4gICAoZnVuY3Rpb24gKFNlbWl0b25lKSB7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFcIl0gPSA5XSA9IFwiQVwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBc1wiXSA9IDEwXSA9IFwiQXNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQmJcIl0gPSAxMF0gPSBcIkJiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJcIl0gPSAxMV0gPSBcIkJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQnNcIl0gPSAwXSA9IFwiQnNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ2JcIl0gPSAxMV0gPSBcIkNiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNcIl0gPSAwXSA9IFwiQ1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDc1wiXSA9IDFdID0gXCJDc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEYlwiXSA9IDFdID0gXCJEYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEXCJdID0gMl0gPSBcIkRcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRHNcIl0gPSAzXSA9IFwiRHNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRWJcIl0gPSAzXSA9IFwiRWJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRVwiXSA9IDRdID0gXCJFXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkVzXCJdID0gNV0gPSBcIkVzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZiXCJdID0gNF0gPSBcIkZiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZcIl0gPSA1XSA9IFwiRlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGc1wiXSA9IDZdID0gXCJGc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHYlwiXSA9IDZdID0gXCJHYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHXCJdID0gN10gPSBcIkdcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR3NcIl0gPSA4XSA9IFwiR3NcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQWJcIl0gPSA4XSA9IFwiQWJcIjtcclxuICAgfSkoU2VtaXRvbmUgfHwgKFNlbWl0b25lID0ge30pKTtcclxuICAgLyoqXHJcbiAgICAqIFJldHVybnMgdGhlIHdob2xlIG5vdGUgbmFtZSAoZS5nLiBDLCBELCBFLCBGLCBHLCBBLCBCKSBmb3JcclxuICAgICogdGhlIGdpdmVuIHN0cmluZ1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGdldFdob2xlVG9uZUZyb21OYW1lID0gKG5hbWUpID0+IHtcclxuICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PT0gMCB8fCBuYW1lLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBuYW1lXCIpO1xyXG4gICAgICAgY29uc3Qga2V5ID0gbmFtZVswXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgcmV0dXJuIFNlbWl0b25lW2tleV07XHJcbiAgIH07XHJcbiAgIHZhciBTZW1pdG9uZSQxID0gU2VtaXRvbmU7XG5cbiAgIC8qKlxyXG4gICAgKiBXcmFwcyBhIG51bWJlciBiZXR3ZWVuIGEgbWluIGFuZCBtYXggdmFsdWUuXHJcbiAgICAqIEBwYXJhbSB2YWx1ZSAtIHRoZSBudW1iZXIgdG8gd3JhcFxyXG4gICAgKiBAcGFyYW0gbG93ZXIgIC0gdGhlIGxvd2VyIGJvdW5kXHJcbiAgICAqIEBwYXJhbSB1cHBlciAtIHRoZSB1cHBlciBib3VuZFxyXG4gICAgKiBAcmV0dXJucyB3cmFwcGVkTnVtYmVyIC0gdGhlIHdyYXBwZWQgbnVtYmVyXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgd3JhcCA9ICh2YWx1ZSwgbG93ZXIsIHVwcGVyKSA9PiB7XHJcbiAgICAgICAvLyBjb3BpZXNcclxuICAgICAgIGxldCB2YWwgPSB2YWx1ZTtcclxuICAgICAgIGxldCBsYm91bmQgPSBsb3dlcjtcclxuICAgICAgIGxldCB1Ym91bmQgPSB1cHBlcjtcclxuICAgICAgIC8vIGlmIHRoZSBib3VuZHMgYXJlIGludmVydGVkLCBzd2FwIHRoZW0gaGVyZVxyXG4gICAgICAgaWYgKHVwcGVyIDwgbG93ZXIpIHtcclxuICAgICAgICAgICBsYm91bmQgPSB1cHBlcjtcclxuICAgICAgICAgICB1Ym91bmQgPSBsb3dlcjtcclxuICAgICAgIH1cclxuICAgICAgIC8vIHRoZSBhbW91bnQgbmVlZGVkIHRvIG1vdmUgdGhlIHJhbmdlIGFuZCB2YWx1ZSB0byB6ZXJvXHJcbiAgICAgICBjb25zdCB6ZXJvT2Zmc2V0ID0gMCAtIGxib3VuZDtcclxuICAgICAgIC8vIG9mZnNldCB0aGUgdmFsdWVzIHNvIHRoYXQgdGhlIGxvd2VyIGJvdW5kIGlzIHplcm9cclxuICAgICAgIGxib3VuZCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgdWJvdW5kICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICB2YWwgKz0gemVyb09mZnNldDtcclxuICAgICAgIC8vIGNvbXB1dGUgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgdmFsdWUgd2lsbCB3cmFwXHJcbiAgICAgICBsZXQgd3JhcHMgPSBNYXRoLnRydW5jKHZhbCAvIHVib3VuZCk7XHJcbiAgICAgICAvLyBjYXNlOiAtMSAvIHVib3VuZCg+MCkgd2lsbCBlcXVhbCAwIGFsdGhvdWdoIGl0IHdyYXBzIG9uY2VcclxuICAgICAgIGlmICh3cmFwcyA9PT0gMCAmJiB2YWwgPCBsYm91bmQpXHJcbiAgICAgICAgICAgd3JhcHMgPSAtMTtcclxuICAgICAgIC8vIGNhc2U6IHVib3VuZCBhbmQgdmFsdWUgYXJlIHRoZSBzYW1lIHZhbC91Ym91bmQgPSAxIGJ1dCBhY3R1YWxseSBkb2VzbnQgd3JhcFxyXG4gICAgICAgaWYgKHdyYXBzID09PSAxICYmIHZhbCA9PT0gdWJvdW5kKVxyXG4gICAgICAgICAgIHdyYXBzID0gMDtcclxuICAgICAgIC8vIG5lZWRlZCB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIG51bSBvZiB3cmFwcyBpcyAwIG9yIDEgb3IgLTFcclxuICAgICAgIGxldCB2YWxPZmZzZXQgPSAwO1xyXG4gICAgICAgbGV0IHdyYXBPZmZzZXQgPSAwO1xyXG4gICAgICAgaWYgKHdyYXBzID49IC0xICYmIHdyYXBzIDw9IDEpXHJcbiAgICAgICAgICAgd3JhcE9mZnNldCA9IDE7XHJcbiAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYmVsb3cgdGhlIHJhbmdlXHJcbiAgICAgICBpZiAodmFsIDwgbGJvdW5kKSB7XHJcbiAgICAgICAgICAgdmFsT2Zmc2V0ID0gKHZhbCAlIHVib3VuZCkgKyB3cmFwT2Zmc2V0O1xyXG4gICAgICAgICAgIHZhbCA9IHVib3VuZCArIHZhbE9mZnNldDtcclxuICAgICAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYWJvdmUgdGhlIHJhbmdlXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlIGlmICh2YWwgPiB1Ym91bmQpIHtcclxuICAgICAgICAgICB2YWxPZmZzZXQgPSAodmFsICUgdWJvdW5kKSAtIHdyYXBPZmZzZXQ7XHJcbiAgICAgICAgICAgdmFsID0gbGJvdW5kICsgdmFsT2Zmc2V0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLy8gYWRkIHRoZSBvZmZzZXQgZnJvbSB6ZXJvIGJhY2sgdG8gdGhlIHZhbHVlXHJcbiAgICAgICB2YWwgLT0gemVyb09mZnNldDtcclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgICBudW1XcmFwczogd3JhcHMsXHJcbiAgICAgICB9O1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2ltcGxlIHV0aWwgdG8gY2xhbXAgYSBudW1iZXIgdG8gYSByYW5nZVxyXG4gICAgKiBAcGFyYW0gcE51bSAtIHRoZSBudW1iZXIgdG8gY2xhbXBcclxuICAgICogQHBhcmFtIHBMb3dlciAtIHRoZSBsb3dlciBib3VuZFxyXG4gICAgKiBAcGFyYW0gcFVwcGVyIC0gdGhlIHVwcGVyIGJvdW5kXHJcbiAgICAqIEByZXR1cm5zIE51bWJlciAtIHRoZSBjbGFtcGVkIG51bWJlclxyXG4gICAgKlxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNsYW1wID0gKHBOdW0sIHBMb3dlciwgcFVwcGVyKSA9PiBNYXRoLm1heChNYXRoLm1pbihwTnVtLCBNYXRoLm1heChwTG93ZXIsIHBVcHBlcikpLCBNYXRoLm1pbihwTG93ZXIsIHBVcHBlcikpO1xuXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLy8gQ29uc3RhbnRzXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBNT0RJRklFRF9TRU1JVE9ORVMgPSBbMSwgMywgNCwgNiwgOCwgMTBdO1xyXG4gICBjb25zdCBUT05FU19NQVggPSAxMTtcclxuICAgY29uc3QgVE9ORVNfTUlOID0gMDtcclxuICAgY29uc3QgT0NUQVZFX01BWCA9IDk7XHJcbiAgIGNvbnN0IE9DVEFWRV9NSU4gPSAwO1xyXG4gICBjb25zdCBERUZBVUxUX09DVEFWRSA9IDQ7XHJcbiAgIGNvbnN0IERFRkFVTFRfU0VNSVRPTkUgPSAwO1xuXG4gICAvKipcclxuICAgICogTWFwcyBub3RlIGFsdGVyYXRpb25zIHRvICB0aGVpciByZWxhdGl2ZSBtYXRobWF0aWNhbCB2YWx1ZVxyXG4gICAgKkBlbnVtXHJcbiAgICAqL1xyXG4gICB2YXIgTW9kaWZpZXI7XHJcbiAgIChmdW5jdGlvbiAoTW9kaWZpZXIpIHtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiRkxBVFwiXSA9IC0xXSA9IFwiRkxBVFwiO1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJOQVRVUkFMXCJdID0gMF0gPSBcIk5BVFVSQUxcIjtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiU0hBUlBcIl0gPSAxXSA9IFwiU0hBUlBcIjtcclxuICAgfSkoTW9kaWZpZXIgfHwgKE1vZGlmaWVyID0ge30pKTtcclxuICAgLyoqXHJcbiAgICAqIFBhcnNlcyBtb2RpZmllciBmcm9tIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgZW51bSB2YWx1ZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlTW9kaWZpZXIgPSAobW9kaWZpZXIpID0+IHtcclxuICAgICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgICAgICBjYXNlIFwiYlwiOlxyXG4gICAgICAgICAgIGNhc2UgXCJmbGF0XCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5GTEFUO1xyXG4gICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgY2FzZSBcInNcIjpcclxuICAgICAgICAgICBjYXNlIFwic2hhcnBcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLlNIQVJQO1xyXG4gICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5OQVRVUkFMO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICB2YXIgTW9kaWZpZXIkMSA9IE1vZGlmaWVyO1xuXG4gICAvLyBpbXBvcnQgeyByZWdpc3RlckluaXRpYWxpemVyIH0gZnJvbSBcIi4uL0luaXRpYWxpemVyL0luaXRpYWxpemVyXCI7XHJcbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlTG9va3VwLmpzb25cIjtcclxuICAgLy8gaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgbmFtZVJlZ2V4JDIgPSAvKFtBLUddKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4JDIgPSAvKCN8c3xiKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCQyID0gLyhbMC05XSspL2c7XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gcGFyc2UgYSBub3RlIGZyb20gYSBzdHJpbmdcclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBwYXJzZU5vdGUgPSAobm90ZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBub3RlTG9va3VwKG5vdGUpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBub3RlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtub3RlfS4gR2V0IGEgcGVyZm9ybWFuY2UgaW5jcmVhc2UgYnkgdXNpbmcgdGhlIGZvcm1hdCBbQS1HXVsjfHN8Yl1bMC05XSBhbmQgdXNpbmcgYnVpbGRUYWJsZXMgbWV0aG9kKHNlZSBkb2N1bWVudGF0aW9uKWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgbm90ZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7bm90ZX0uIEdldCBhIHBlcmZvcm1hbmNlIGluY3JlYXNlIGJ5IHVzaW5nIHRoZSBmb3JtYXQgW0EtR11bI3xzfGJdWzAtOV0gYW5kIHVzaW5nIGJ1aWxkVGFibGVzIG1ldGhvZChzZWUgZG9jdW1lbnRhdGlvbilgKTtcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gbm90ZS5tYXRjaChuYW1lUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gbm90ZS5tYXRjaChtb2RpZmllclJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBub3RlLm1hdGNoKG9jdGF2ZVJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBub3RlOiAke25vdGV9YCk7XHJcbiAgIH07XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDQgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBub3RlVGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBmb3IgKGNvbnN0IG5vdGVMYWJlbCBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgIG5vdGVUYWJsZVtub3RlTGFiZWxdID0gcGFyc2VOb3RlKG5vdGVMYWJlbCwgdHJ1ZSk7IC8vICdDJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgIGZvciAobGV0IGlNb2RpZmllck91dGVyID0gMDsgaU1vZGlmaWVyT3V0ZXIgPCBub3RlTW9kaWZpZXJzLmxlbmd0aDsgKytpTW9kaWZpZXJPdXRlcikge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtub3RlTW9kaWZpZXJzW2lNb2RpZmllck91dGVyXX1gO1xyXG4gICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQyMnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDwgT0NUQVZFX01BWDsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke2lPY3RhdmV9YDtcclxuICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0M0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICBmb3IgKGxldCBpTW9kaWZpZXIgPSAwOyBpTW9kaWZpZXIgPCBub3RlTW9kaWZpZXJzLmxlbmd0aDsgKytpTW9kaWZpZXIpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke25vdGVNb2RpZmllcnNbaU1vZGlmaWVyXX0ke2lPY3RhdmV9YDtcclxuICAgICAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDIzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gbm90ZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogVGhlIGxvb2t1cCB0YWJsZVxyXG4gICAgKi9cclxuICAgbGV0IF9ub3RlTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZE5vdGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkTm90ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSQ0KCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3RlTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgbm90ZSB0YWJsZVwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZUxvb2t1cDtcclxuICAgfTtcblxuICAgLy8gaW1wb3J0IHsgcmVnaXN0ZXJJbml0aWFsaXplciB9IGZyb20gXCIuLi9Jbml0aWFsaXplci9Jbml0aWFsaXplclwiO1xyXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZVN0cmluZ0xvb2t1cC5qc29uXCI7XHJcbiAgIGNvbnN0IFVOS05PV05fTU9ESUZJRVJfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkMjL0RiXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRCMvRWJcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkYjL0diXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiRyMvQWJcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJBIy9CYlwiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IFNIQVJQX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJDI1wiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkQjXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJGI1wiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkcjXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQSNcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBGTEFUX01PRElGSUVSX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJEYlwiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkViXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJHYlwiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkFiXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQmJcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQzID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGZvciAobGV0IGlUb25lID0gVE9ORVNfTUlOOyBpVG9uZSA8PSBUT05FU19NQVg7ICsraVRvbmUpIHtcclxuICAgICAgICAgICBmb3IgKGxldCBpUHJldiA9IFRPTkVTX01JTjsgaVByZXYgPD0gVE9ORVNfTUFYOyArK2lQcmV2KSB7XHJcbiAgICAgICAgICAgICAgIC8vIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDw9IE9DVEFWRV9NQVg7IGlPY3RhdmUrKykge1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICBpZiAoTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKGlUb25lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcIi1cIjsgLy8gaGFzIGFuIHVua25vd24gbW9kaWZpZXJcclxuICAgICAgICAgICAgICAgICAgIC8vIGlmIGlzIGZsYXRcclxuICAgICAgICAgICAgICAgICAgIGlmICh3cmFwKGlUb25lICsgMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PSBpUHJldilcclxuICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gaXMgc2hhcnBcclxuICAgICAgICAgICAgICAgICAgIGlmICh3cmFwKGlUb25lIC0gMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PSBpUHJldilcclxuICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiI1wiO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vIGdldCBub3RlIG5hbWUgZnJvbSB0YWJsZVxyXG4gICAgICAgICAgICAgICB0YWJsZVtgJHtpVG9uZX0tJHtpUHJldn1gXSA9IGdldE5vdGVMYWJlbChpVG9uZSwgbW9kaWZpZXIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGNvbnN0IGdldE5vdGVMYWJlbCA9ICh0b25lLCBtb2RpZmllcikgPT4ge1xyXG4gICAgICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBTSEFSUF9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICAgICAgY2FzZSBcImJcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIEZMQVRfTU9ESUZJRVJfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgICAgIGNhc2UgXCItXCI6XHJcbiAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgcmV0dXJuIFVOS05PV05fTU9ESUZJRVJfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICBsZXQgX25vdGVTdHJpbmdMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZVN0cmluZ0xvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICBpZiAoT2JqZWN0LmtleXMoX25vdGVTdHJpbmdMb29rdXApLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkTm90ZVN0cmluZ1RhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5rZXlzKF9ub3RlU3RyaW5nTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX25vdGVTdHJpbmdMb29rdXA7XHJcbiAgICAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlJDMoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVTdHJpbmdMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJOb3RlIHN0cmluZyB0YWJsZSBidWlsdC5cIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVTdHJpbmdMb29rdXA7XHJcbiAgIH07XG5cbiAgIHZhciBJRFg9MjU2LCBIRVg9W10sIFNJWkU9MjU2LCBCVUZGRVI7XG4gICB3aGlsZSAoSURYLS0pIEhFWFtJRFhdID0gKElEWCArIDI1NikudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcblxuICAgZnVuY3Rpb24gdWlkKGxlbikge1xuICAgXHR2YXIgaT0wLCB0bXA9KGxlbiB8fCAxMSk7XG4gICBcdGlmICghQlVGRkVSIHx8ICgoSURYICsgdG1wKSA+IFNJWkUqMikpIHtcbiAgIFx0XHRmb3IgKEJVRkZFUj0nJyxJRFg9MDsgaSA8IFNJWkU7IGkrKykge1xuICAgXHRcdFx0QlVGRkVSICs9IEhFWFtNYXRoLnJhbmRvbSgpICogMjU2IHwgMF07XG4gICBcdFx0fVxuICAgXHR9XG5cbiAgIFx0cmV0dXJuIEJVRkZFUi5zdWJzdHJpbmcoSURYLCBJRFgrKyArIHRtcCk7XG4gICB9XG5cbiAgIC8vIGltcG9ydCBJZGVudGlmaWFibGUgZnJvbSBcIi4uL2NvbXBvc2FibGVzL0lkZW50aWZpYWJsZVwiO1xyXG4gICAvKipcclxuICAgICogQSBub3RlIGNvbnNpc3Qgb2YgYSBzZW1pdG9uZSBhbmQgYW4gb2N0YXZlLjxicj5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHsgTm90ZUluaXRpYWxpemVyIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjsgLy8gdHlwZXNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIE5vdGUge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHdpdGggZGVmYXVsdCB2YWx1ZXMgc2VtaXRvbmUgMChDKSBhbmQgb2N0YXZlIDRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB1c2luZyBhbiBpbml0aWFsaXplciBvYmplY3RcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7c2VtaXRvbmU6IDQsIG9jdGF2ZTogNX0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogbm90ZS1uYW1lW21vZGlmaWVyXVtvY3RhdmVdXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgdXNpbmcgYSBzdHJpbmdcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZShcIkM1XCIpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlcyA9IHBhcnNlTm90ZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcz8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdmFsdWVzPy5zZW1pdG9uZSA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRoYXQgb2N0YXZlIGlzIHNldCBmaXJzdCBzbyB0aGF0XHJcbiAgICAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIHNlbWl0b25lIGNhbiBjaGFuZ2UgdGhlIG9jdGF2ZVxyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcz8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdmFsdWVzPy5zZW1pdG9uZSA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIHVuaXF1ZSBpZCBmb3IgdGhpcyBub3RlKGF1dG8gZ2VuZXJhdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pZCk7IC8vIHMyODk4c25sb2pcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZW1pdG9uZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICBfcHJldlNlbWl0b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDBcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgc2VtaXRvbmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvbmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNldHRpbmcgdGhlIHNlbWl0b25lIHdpdGggYSBudW1iZXIgb3V0c2lkZSB0aGVcclxuICAgICAgICAqIHJhbmdlIG9mIDAtMTEgd2lsbCB3cmFwIHRoZSB2YWx1ZSBhcm91bmQgYW5kXHJcbiAgICAgICAgKiBjaGFuZ2UgdGhlIG9jdGF2ZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogbm90ZS5zZW1pdG9uZSA9IDQ7Ly8gRVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDQoRSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgc2VtaXRvbmUoc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcChzZW1pdG9uZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgdGhpcy5fdG9uZSA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gdGhpcy5fb2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5vY3RhdmUpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIG5vdGUub2N0YXZlID0gMTA7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLm9jdGF2ZSk7IC8vIDkoYmVjYXVzZSBvZiBjbGFtcGluZylcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKG9jdGF2ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKG9jdGF2ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIHNoYXJwZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuc2hhcnAoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUyLnNlbWl0b25lKTsgLy8gMShDIylcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGFycCgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KS5zaGFycGVuKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNoYXJwZW5zIHRoZSBub3RlIGluIHBsYWNlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIG5vdGUuc2hhcnBlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDEoQyMpXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoYXJwZW4oKSB7XHJcbiAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmUgKyAxO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgYXR0ZW1wdHMgdG8gZGV0ZXJtaW5lIGlmIHRoZSBub3RlIGlzIHNoYXJwXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBub3RlIGlzIHNoYXJwXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc1NoYXJwKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogbm90ZS5zaGFycGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzU2hhcnAoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc1NoYXJwKCkge1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgd2hvbGUsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXModGhpcy5zZW1pdG9uZSk7XHJcbiAgICAgICAgICAgaWYgKCFtb2RpZmllZClcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgZmxhdCwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBpZiAod3JhcCh0aGlzLnNlbWl0b25lICsgMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PVxyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9pcyBmbGF0XHJcbiAgICAgICAgICAgLy8gRG9lc24ndCBuZWNjZWNhcmlseSBtZWFuIGl0J3Mgc2hhcnAsIGJ1dCBpdCdzIGEgZ29vZCBndWVzcyBhdCB0aGlzIHBvaW50XHJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgZmxhdHRlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgZmxhdHRlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5mbGF0KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlMi5zZW1pdG9uZSk7IC8vIDMoRWIpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZmxhdCgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KS5mbGF0dGVuKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEZsYXR0ZW5zIHRoZSBub3RlIGluIHBsYWNlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7c2VtaXRvbmU6IDR9KTsgLy8gIHNlbWl0b25lIGlzIDQoRSlcclxuICAgICAgICAqIG5vdGUuZmxhdHRlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDMoRWIpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZmxhdHRlbigpIHtcclxuICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdGhpcy5zZW1pdG9uZSAtIDE7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBhdHRlbXB0cyB0byBkZXRlcm1pbmUgaWYgdGhlIG5vdGUgaXMgZmxhdFxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbm90ZSBpcyBmbGF0XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc0ZsYXQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBub3RlLmZsYXR0ZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNGbGF0KCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNGbGF0KCkge1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgd2hvbGUsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXModGhpcy5zZW1pdG9uZSk7XHJcbiAgICAgICAgICAgaWYgKCFtb2RpZmllZClcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgc2hhcnAsIGl0IGNhbid0IGJlIGZsYXRcclxuICAgICAgICAgICBpZiAod3JhcCh0aGlzLnNlbWl0b25lIC0gMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PVxyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9pcyBzaGFycFxyXG4gICAgICAgICAgIC8vIERvZXNuJ3QgbmVjY2VjYXJpbHkgbWVhbiBpdCdzIGZsYXQsIGJ1dCBpdCdzIGEgZ29vZCBndWVzcyBhdCB0aGlzIHBvaW50XHJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhpcyBub3RlIGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmVxdWFscyhub3RlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5zZW1pdG9uZSA9PT0gbm90ZS5zZW1pdG9uZSAmJiB0aGlzLm9jdGF2ZSA9PT0gbm90ZS5vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5lcXVhbHMobm90ZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdmVyc2lvbiBvZiB0aGlzIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBDNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKlxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlU3RyaW5nTG9va3VwKTtcclxuICAgICAgICAgICByZXR1cm4gKG5vdGVTdHJpbmdMb29rdXAoYCR7dGhpcy5fdG9uZX0tJHt0aGlzLl9wcmV2U2VtaXRvbmV9YCkgK1xyXG4gICAgICAgICAgICAgICBgJHt0aGlzLl9vY3RhdmV9YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFN0YXRpYyBtZXRob2RzIHRvIGNyZWF0ZSB3aG9sZSBub3RlcyBlYXNpbHkuXHJcbiAgICAgICAgKiB0aGUgZGVmYXVsdCBvY3RhdmUgaXMgNFxyXG4gICAgICAgICovXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEFbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkEoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEE0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEEob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkEsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEJbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkIoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEI0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEIob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkIsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIENbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkMoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEM0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEMob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkMsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIERbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEQ0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEQob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkQsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEVbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEU0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEUob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEZbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkYoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEY0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEYob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkYsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEdbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkcoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEc0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEcob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkcsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogQ29uc3RhbnRzXHJcbiAgICAqL1xyXG4gICBjb25zdCBNSURJS0VZX1NUQVJUID0gMTI7XHJcbiAgIGNvbnN0IE5VTV9PQ1RBVkVTID0gMTA7XHJcbiAgIGNvbnN0IE5VTV9TRU1JVE9ORVMgPSAxMjtcclxuICAgLyoqXHJcbiAgICAqIENhbGN1bGF0ZXMgdGhlIG1pZGkga2V5IGZvciBhIGdpdmVuIG9jdGF2ZSBhbmQgc2VtaXRvbmUuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjYWxjTWlkaUtleSA9IChvY3RhdmUsIHNlbWl0b25lKSA9PiBNSURJS0VZX1NUQVJUICsgb2N0YXZlICogTlVNX1NFTUlUT05FUyArIHNlbWl0b25lO1xyXG4gICAvKipcclxuICAgICogQ2FsY3VsYXRlcyB0aGUgZnJlcXVlbmN5IGZvciBhIGdpdmVuIG9jdGF2ZSBhbmQgc2VtaXRvbmUgZ2l2ZW5cclxuICAgICogYSB0dW5pbmcgZm9yIGE0LlxyXG4gICAgKi9cclxuICAgY29uc3QgY2FsY0ZyZXF1ZW5jeSA9IChtaWRpS2V5LCBhNFR1bmluZykgPT4gMiAqKiAoKG1pZGlLZXkgLSA2OSkgLyAxMikgKiBhNFR1bmluZztcclxuICAgLyoqXHJcbiAgICAqIENyZWF0ZXMgYW5kIHJldHVybiBsb29rdXAgdGFibGVzIGZvciBtaWRpa2V5IGFuZCBmcmVxdWVuY3kuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZXMgPSAoYTRUdW5pbmcgPSA0NDApID0+IHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTWFwcyBvY3RhdmUgYW5kIHNlbWl0b25lIHRvIG5vdGUgZnJlcXVlbmN5KGhlcnR6KS5cclxuICAgICAgICAqIHJlcXVpcmVzIGEga2V5IGluIHRoZSBmb3JtIG9mIGA8b2N0YXZlPi08c2VtaXRvbmU+YFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdCBmcmVxVGFibGUgPSB7fTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTWFwcyBvY3RhdmUgYW5kIHNlbWl0b25lIHRvIG1pZGkga2V5LlxyXG4gICAgICAgICogcmVxdWlyZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2YgYDxvY3RhdmU+LTxzZW1pdG9uZT5gXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0IG1pZGlUYWJsZSA9IHt9O1xyXG4gICAgICAgbGV0IGlPY3RhdmUgPSAwO1xyXG4gICAgICAgbGV0IGlTZW1pdG9uZSA9IDA7XHJcbiAgICAgICBmb3IgKGlPY3RhdmUgPSAwOyBpT2N0YXZlIDwgTlVNX09DVEFWRVM7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgIGZvciAoaVNlbWl0b25lID0gMDsgaVNlbWl0b25lIDwgTlVNX1NFTUlUT05FUzsgKytpU2VtaXRvbmUpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7aU9jdGF2ZX0tJHtpU2VtaXRvbmV9YDtcclxuICAgICAgICAgICAgICAgY29uc3QgbWtleSA9IGNhbGNNaWRpS2V5KGlPY3RhdmUsIGlTZW1pdG9uZSk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGZyZXEgPSBjYWxjRnJlcXVlbmN5KG1rZXksIGE0VHVuaW5nKTtcclxuICAgICAgICAgICAgICAgbWlkaVRhYmxlW2tleV0gPSBta2V5O1xyXG4gICAgICAgICAgICAgICBmcmVxVGFibGVba2V5XSA9IGZyZXE7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICBmcmVxTG9va3VwOiBmcmVxVGFibGUsXHJcbiAgICAgICAgICAgbWlkaUxvb2t1cDogbWlkaVRhYmxlLFxyXG4gICAgICAgfTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFR1bmluZyBjb21wb25lbnQgdXNlZCBieSBJbnN0cnVtZW50IGNsYXNzPGJyPlxyXG4gICAgKiBjb250YWluZXMgdGhlIGE0IHR1bmluZyAtIGRlZmF1bHQgaXMgNDQwSHo8YnI+XHJcbiAgICAqIGJ1aWxkcyBsb29rdXAgdGFibGVzIGZvciBtaWRpIGtleSBhbmQgZnJlcXVlbmN5PGJyPlxyXG4gICAgKiBiYXNlZCBvbiB0aGUgdHVuaW5nXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY2xhc3MgVHVuaW5nIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQ3JlYXRlcyB0aGUgb2JqZWN0IGFuZCBidWlsZHMgdGhlIGxvb2t1cCB0YWJsZXMuXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKGE0RnJlcSA9IDQ0MCkge1xyXG4gICAgICAgICAgIHRoaXMuX2E0ID0gYTRGcmVxO1xyXG4gICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZXMoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgVHVuaW5nKHRoaXMuX2E0KTtcclxuICAgICAgIH1cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9hNCA9PT0gb3RoZXIuX2E0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBhNCBUdW5pbmdcclxuICAgICAgICAqL1xyXG4gICAgICAgX2E0ID0gNDQwO1xyXG4gICAgICAgZ2V0IGE0KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9hNDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2V0dGluZyB0aGUgdHVuaW5nIHdpbGwgcmVidWlsZCB0aGUgbG9va3VwIHRhYmxlc1xyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgYTQodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9hNCA9IHZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZXMoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbG9va3VwIHRhYmxlIGZvciBtaWRpIGtleVxyXG4gICAgICAgICovXHJcbiAgICAgICBfbWlkaUtleVRhYmxlID0ge307XHJcbiAgICAgICBtaWRpS2V5TG9va3VwKG9jdGF2ZSwgc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtvY3RhdmV9LSR7c2VtaXRvbmV9YDtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbWlkaUtleVRhYmxlW2tleV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGxvb2t1cCB0YWJsZSBmb3IgZnJlcXVlbmN5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9mcmVxVGFibGUgPSB7fTtcclxuICAgICAgIGZyZXFMb29rdXAob2N0YXZlLCBzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke29jdGF2ZX0tJHtzZW1pdG9uZX1gO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVxVGFibGVba2V5XTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQnVpbGRzIHRoZSBsb29rdXAgdGFibGVzIGZvciBtaWRpIGtleSBhbmQgZnJlcXVlbmN5XHJcbiAgICAgICAgKi9cclxuICAgICAgIGJ1aWxkVGFibGVzKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRhYmxlcyA9IGNyZWF0ZVRhYmxlcyh0aGlzLl9hNCk7XHJcbiAgICAgICAgICAgdGhpcy5fbWlkaUtleVRhYmxlID0gdGFibGVzLm1pZGlMb29rdXA7XHJcbiAgICAgICAgICAgdGhpcy5fZnJlcVRhYmxlID0gdGFibGVzLmZyZXFMb29rdXA7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIHR1bmluZyBhcyBhIHN0cmluZ1xyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICByZXR1cm4gYFR1bmluZygke3RoaXMuX2E0fSlgO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBJbnN0cnVtZW50IGFyZSB1c2VkIHRvIGVuY2Fwc3VsYXRlIHRoZSB0dW5pbmcgYW5kIHJldHJpZXZpbmcgb2YgbWlkaSBrZXlzXHJcbiAgICAqIGFuZCBmcmVxdWVuY2llcyBmb3Igbm90ZXNcclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBJbnN0cnVtZW50IH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICovXHJcbiAgIGNsYXNzIEluc3RydW1lbnQge1xyXG4gICAgICAgdHVuaW5nO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gdHVuaW5nIEE0IGZyZXF1ZW5jeSAtIGRlZmF1bHRzIHRvIDQ0MFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpOyAvLyBkZWZhdWx0IDQ0MCB0dW5pbmdcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3RvcihhNEZyZXEgPSA0NDApIHtcclxuICAgICAgICAgICB0aGlzLnR1bmluZyA9IG5ldyBUdW5pbmcoYTRGcmVxKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgYSB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuaWQ7IC8vIHJldHVybnMgYSB1bmlxdWUgaWRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGluc3RydW1lbnQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IEluc3RydW1lbnQodGhpcy50dW5pbmcuYTQpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gb3RoZXIgdGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlXHJcbiAgICAgICAgKiBAcmV0dXJucyAgdHJ1ZSBpZiB0aGUgb3RoZXIgb2JqZWN0IGlzIGVxdWFsIHRvIHRoaXMgb25lXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gaW5zdHJ1bWVudC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcuZXF1YWxzKG90aGVyLnR1bmluZyk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBmcmVxdWVuY3kgb2YgdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuZ2V0RnJlcXVlbmN5KG5ldyBOb3RlKFwiQzRcIikpOyAvLyByZXR1cm5zIDI2MS42MjU1NjUzMDA1OTg2XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0RnJlcXVlbmN5KG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcuZnJlcUxvb2t1cChub3RlLm9jdGF2ZSwgbm90ZS5zZW1pdG9uZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBtaWRpIGtleSBvZiB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5nZXRNaWRpS2V5KG5ldyBOb3RlKFwiQzRcIikpOyAvLyByZXR1cm5zIDYwXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0TWlkaUtleShub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLm1pZGlLZXlMb29rdXAobm90ZS5vY3RhdmUsIG5vdGUuc2VtaXRvbmUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgdHVuaW5nIGFzIGEgc3RyaW5nXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LnRvU3RyaW5nKCkpOyAvLyByZXR1cm5zIFwiSW5zdHJ1bWVudCBUdW5pbmcoNDQwKVwiXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGBJbnN0cnVtZW50IFR1bmluZygke3RoaXMudHVuaW5nLmE0fSlgO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIGNvbnN0IERFRkFVTFRfU0NBTEVfVEVNUExBVEUgPSBbMCwgMiwgMiwgMSwgMiwgMiwgMl07IC8vIG1ham9yXHJcbiAgIE9iamVjdC5mcmVlemUoREVGQVVMVF9TQ0FMRV9URU1QTEFURSk7XG5cbiAgIC8qKlxyXG4gICAgKiBNYXBzIHByZWRlZmluZWQgc2NhbGVzIHRvIHRoZWlyIG5hbWVzLlxyXG4gICAgKi9cclxuICAgY29uc3QgU2NhbGVUZW1wbGF0ZXMgPSB7XHJcbiAgICAgICB3aG9sZVRvbmU6IFswLCAyLCAyLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIC8vIG1ham9yXHJcbiAgICAgICBtYWpvcjogWzAsIDIsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgbWFqb3I3czRzNTogWzAsIDIsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gbW9kZXNcclxuICAgICAgIC8vIGlvbmlhbjogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWFqb3JcclxuICAgICAgIC8vIGFlb2xpYW46IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1pbm9yXHJcbiAgICAgICBkb3JpYW46IFswLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIHBocnlnaWFuOiBbMCwgMSwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICBseWRpYW46IFswLCAyLCAyLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIGx5ZGlhbkRvbWluYW50OiBbMCwgMiwgMiwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICAvLyBhY291c3RpYzogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbHlkaWFuRG9taW5hbnRcclxuICAgICAgIG1peG9seWRpYW46IFswLCAyLCAyLCAxLCAyLCAyLCAxXSxcclxuICAgICAgIG1peG9seWRpYW5GbGF0NjogWzAsIDIsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgbG9jcmlhbjogWzAsIDEsIDIsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgc3VwZXJMb2NyaWFuOiBbMCwgMSwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICAvLyBtaW5vclxyXG4gICAgICAgbWlub3I6IFswLCAyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIG1pbm9yN2I5OiBbMCwgMSwgMiwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBtaW5vcjdiNTogWzAsIDIsIDEsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgLy8gaGFsZkRpbWluaXNoZWQ6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1pbm9yN2I1XHJcbiAgICAgICAvLyBoYXJtb25pY1xyXG4gICAgICAgaGFybW9uaWNNYWpvcjogWzAsIDIsIDIsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgaGFybW9uaWNNaW5vcjogWzAsIDIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAgZG91YmxlSGFybW9uaWM6IFswLCAxLCAzLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIGJ5emFudGluZTogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgZG91YmxlSGFybW9uaWNcclxuICAgICAgIC8vIG1lbG9kaWNcclxuICAgICAgIG1lbG9kaWNNaW5vckFzY2VuZGluZzogWzAsIDIsIDEsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgbWVsb2RpY01pbm9yRGVzY2VuZGluZzogWzAsIDIsIDIsIDEsIDIsIDIsIDFdLFxyXG4gICAgICAgLy8gcGVudGF0b25pY1xyXG4gICAgICAgbWFqb3JQZW50YXRvbmljOiBbMCwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBtYWpvclBlbnRhdG9uaWNCbHVlczogWzAsIDIsIDEsIDEsIDMsIDJdLFxyXG4gICAgICAgbWlub3JQZW50YXRvbmljOiBbMCwgMywgMiwgMiwgM10sXHJcbiAgICAgICBtaW5vclBlbnRhdG9uaWNCbHVlczogWzAsIDMsIDIsIDEsIDEsIDNdLFxyXG4gICAgICAgYjVQZW50YXRvbmljOiBbMCwgMywgMiwgMSwgNCwgMl0sXHJcbiAgICAgICBtaW5vcjZQZW50YXRvbmljOiBbMCwgMywgMiwgMiwgMiwgM10sXHJcbiAgICAgICAvLyBlbmlnbWF0aWNcclxuICAgICAgIGVuaWdtYXRpY01ham9yOiBbMCwgMSwgMywgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBlbmlnbWF0aWNNaW5vcjogWzAsIDEsIDIsIDMsIDEsIDMsIDFdLFxyXG4gICAgICAgLy8gOFRvbmVcclxuICAgICAgIGRpbThUb25lOiBbMCwgMiwgMSwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBkb204VG9uZTogWzAsIDEsIDIsIDEsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgLy8gbmVhcG9saXRhblxyXG4gICAgICAgbmVhcG9saXRhbk1ham9yOiBbMCwgMSwgMiwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICBuZWFwb2xpdGFuTWlub3I6IFswLCAxLCAyLCAyLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIGh1bmdhcmlhblxyXG4gICAgICAgaHVuZ2FyaWFuTWFqb3I6IFswLCAzLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIGh1bmdhcmlhbk1pbm9yOiBbMCwgMiwgMSwgMywgMSwgMSwgM10sXHJcbiAgICAgICBodW5nYXJpYW5HeXBzeTogWzAsIDEsIDMsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gc3BhbmlzaFxyXG4gICAgICAgc3BhbmlzaDogWzAsIDEsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgc3BhbmlzaDhUb25lOiBbMCwgMSwgMiwgMSwgMSwgMSwgMiwgMl0sXHJcbiAgICAgICAvLyBqZXdpc2g6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIHNwYW5pc2g4VG9uZVxyXG4gICAgICAgc3BhbmlzaEd5cHN5OiBbMCwgMSwgMywgMSwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBhdWcgZG9tXHJcbiAgICAgICBhdWdtZW50ZWQ6IFswLCAzLCAxLCAzLCAxLCAzLCAxXSxcclxuICAgICAgIGRvbWluYW50U3VzcGVuZGVkOiBbMCwgMiwgMywgMiwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBiZWJvcFxyXG4gICAgICAgYmVib3BNYWpvcjogWzAsIDIsIDIsIDEsIDIsIDEsIDEsIDJdLFxyXG4gICAgICAgYmVib3BEb21pbmFudDogWzAsIDIsIDIsIDEsIDIsIDIsIDEsIDFdLFxyXG4gICAgICAgbXlzdGljOiBbMCwgMiwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBvdmVydG9uZTogWzAsIDIsIDIsIDIsIDEsIDEsIDJdLFxyXG4gICAgICAgbGVhZGluZ1RvbmU6IFswLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIC8vIGphcGFuZXNlXHJcbiAgICAgICBoaXJvam9zaGk6IFswLCAyLCAxLCA0LCAxXSxcclxuICAgICAgIGphcGFuZXNlQTogWzAsIDEsIDQsIDEsIDNdLFxyXG4gICAgICAgamFwYW5lc2VCOiBbMCwgMiwgMywgMSwgM10sXHJcbiAgICAgICAvLyBjdWx0dXJlc1xyXG4gICAgICAgb3JpZW50YWw6IFswLCAxLCAzLCAxLCAxLCAzLCAxXSxcclxuICAgICAgIHBlcnNpYW46IFswLCAxLCA0LCAxLCAyLCAzXSxcclxuICAgICAgIGFyYWJpYW46IFswLCAyLCAyLCAxLCAxLCAyLCAyXSxcclxuICAgICAgIGJhbGluZXNlOiBbMCwgMSwgMiwgNCwgMV0sXHJcbiAgICAgICBrdW1vaTogWzAsIDIsIDEsIDQsIDIsIDJdLFxyXG4gICAgICAgcGVsb2c6IFswLCAxLCAyLCAzLCAxLCAxXSxcclxuICAgICAgIGFsZ2VyaWFuOiBbMCwgMiwgMSwgMiwgMSwgMSwgMSwgM10sXHJcbiAgICAgICBjaGluZXNlOiBbMCwgNCwgMiwgMSwgNF0sXHJcbiAgICAgICBtb25nb2xpYW46IFswLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIGVneXB0aWFuOiBbMCwgMiwgMywgMiwgM10sXHJcbiAgICAgICByb21haW5pYW46IFswLCAyLCAxLCAzLCAxLCAyLCAxXSxcclxuICAgICAgIGhpbmR1OiBbMCwgMiwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBpbnNlbjogWzAsIDEsIDQsIDIsIDNdLFxyXG4gICAgICAgaXdhdG86IFswLCAxLCA0LCAxLCA0XSxcclxuICAgICAgIHNjb3R0aXNoOiBbMCwgMiwgMywgMiwgMl0sXHJcbiAgICAgICB5bzogWzAsIDMsIDIsIDIsIDNdLFxyXG4gICAgICAgaXN0cmlhbjogWzAsIDEsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgdWtyYW5pYW5Eb3JpYW46IFswLCAyLCAxLCAzLCAxLCAyLCAxXSxcclxuICAgICAgIHBldHJ1c2hrYTogWzAsIDEsIDMsIDIsIDEsIDNdLFxyXG4gICAgICAgYWhhdmFyYWJhOiBbMCwgMSwgMywgMSwgMiwgMSwgMl0sXHJcbiAgIH07XHJcbiAgIC8vIGR1cGxpY2F0ZXMgd2l0aCBhbGlhc2VzXHJcbiAgIFNjYWxlVGVtcGxhdGVzLmhhbGZEaW1pbmlzaGVkID0gU2NhbGVUZW1wbGF0ZXMubWlub3I3YjU7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmpld2lzaCA9IFNjYWxlVGVtcGxhdGVzLnNwYW5pc2g4VG9uZTtcclxuICAgU2NhbGVUZW1wbGF0ZXMuYnl6YW50aW5lID0gU2NhbGVUZW1wbGF0ZXMuZG91YmxlSGFybW9uaWM7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmFjb3VzdGljID0gU2NhbGVUZW1wbGF0ZXMubHlkaWFuRG9taW5hbnQ7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmFlb2xpYW4gPSBTY2FsZVRlbXBsYXRlcy5taW5vcjtcclxuICAgU2NhbGVUZW1wbGF0ZXMuaW9uaWFuID0gU2NhbGVUZW1wbGF0ZXMubWFqb3I7XHJcbiAgIE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKS5mb3JFYWNoKChlbGVtZW50KSA9PiBPYmplY3QuZnJlZXplKFNjYWxlVGVtcGxhdGVzW2VsZW1lbnRdKSk7XG5cbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgY29uc3QgbmFtZVJlZ2V4JDEgPSAvKFtBLUddKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4JDEgPSAvKCN8c3xiKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCQxID0gLyhbMC05XSspKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IHNjYWxlTmFtZVJlZ2V4ID0gLyhcXChbYS16QS1aXXsyLH1cXCkpL2c7XHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBwYXJzZSBhIG5vdGUgZnJvbSBhIHN0cmluZ1xyXG4gICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICAqIEBwYXJhbSBzdXByZXNzV2FybmluZyAtIHN1cHJlc3MgdGhlIHdhcm5pbmcgZm9yIGluZWZmZWNpZW5jeSBpZiB0cnVlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VTY2FsZSA9IChzY2FsZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzY2FsZUxvb2t1cChzY2FsZSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IHNjYWxlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtzY2FsZX0uIEdldCBhIHBlcmZvcm1hbmMgaW5jcmVhc2UgYnkgdXNpbmcgYSB2YWxpZCBmb3JtYXRgKTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IHNjYWxlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtzY2FsZX0uIEdldCBhIHBlcmZvcm1hbmMgaW5jcmVhc2UgYnkgdXNpbmcgYSB2YWxpZCBmb3JtYXRgKTtcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgbGV0IHNjYWxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBzY2FsZS5tYXRjaChuYW1lUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gc2NhbGUubWF0Y2gobW9kaWZpZXJSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gc2NhbGUubWF0Y2gob2N0YXZlUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVNYXRjaCA9IHNjYWxlLm1hdGNoKHNjYWxlTmFtZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChzY2FsZU5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNOYW1lID0gc2NhbGVOYW1lTWF0Y2guam9pbihcIlwiKTtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzTmFtZSk7XHJcbiAgICAgICAgICAgc2NhbGVOYW1lID0gc05hbWU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgbGV0IHRlbXBsYXRlSW5kZXggPSAxOyAvLyBkZWZhdWx0IG1ham9yIHNjYWxlXHJcbiAgICAgICAgICAgaWYgKHNjYWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZUluZGV4ID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpLmZpbmRJbmRleCgodGVtcGxhdGUpID0+IHRlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICAgICAgICAgLmluY2x1ZGVzKHNjYWxlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xcKHxcXCkvZywgXCJcIikpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpW3RlbXBsYXRlSW5kZXhdKTtcclxuICAgICAgICAgICBpZiAodGVtcGxhdGVJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTktOT1dOIFRFTVBMQVRFXCIsIHNjYWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgdGVtcGxhdGUgZm9yIHNjYWxlICR7c2NhbGVOYW1lfWApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzW09iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKVt0ZW1wbGF0ZUluZGV4XV07XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAga2V5OiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFNjYWxlOiAke3NjYWxlfWApO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDIgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBzY2FsZVRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgY29uc3QgdGVtcGxhdGVzID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiB0ZW1wbGF0ZXMpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVMYWJlbCBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgICAgICAvL2V4IEEobWlub3IpXHJcbiAgICAgICAgICAgICAgIHNjYWxlVGFibGVbYCR7bm90ZUxhYmVsfSgke3RlbXBsYXRlfSlgXSA9IHBhcnNlU2NhbGUobm90ZUxhYmVsLCB0cnVlKTsgLy8gJ0MnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9kIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke21vZH0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgIC8vIGV4IEEjKG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQyMnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPCBPQ1RBVkVfTUFYOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke2lPY3RhdmV9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBleCBBNChtaW5vcilcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0M0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBtb2Qgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke21vZH0ke2lPY3RhdmV9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gZXggQSM0KG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0MjNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBzY2FsZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyB0aGUgbG9va3VwIHRhYmxlIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBpcyBsb2FkZWRcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBsZXQgX3NjYWxlTG9va3VwID0ge307XHJcbiAgIGNvbnN0IHNjYWxlTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX3NjYWxlTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfc2NhbGVMb29rdXAgPSB0YWJsZSBhcyB7IFtrZXk6IHN0cmluZ106IFNjYWxlSW5pdGlhbGl6ZXIgfTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX3NjYWxlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZFNjYWxlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX3NjYWxlTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX3NjYWxlTG9va3VwO1xyXG4gICAgICAgX3NjYWxlTG9va3VwID0gY3JlYXRlVGFibGUkMigpO1xyXG4gICAgICAgLy8gT2JqZWN0LmZyZWV6ZShfc2NhbGVMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBUYWJsZSBCdWlsdFwiKTtcclxuICAgICAgIHJldHVybiBfc2NhbGVMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBzaGlmdHMgYW4gYXJyYXkgYnkgYSBnaXZlbiBkaXN0YW5jZVxyXG4gICAgKiBAcGFyYW0gYXJyIHRoZSBhcnJheSB0byBzaGlmdFxyXG4gICAgKiBAcGFyYW0gZGlzdGFuY2UgdGhlIGRpc3RhbmNlIHRvIHNoaWZ0XHJcbiAgICAqIEByZXR1cm5zIHRoZSBzaGlmdGVkIGFycmF5XHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2hpZnQgPSAoYXJyLCBkaXN0ID0gMSkgPT4ge1xyXG4gICAgICAgYXJyID0gWy4uLmFycl07IC8vIGNvcHlcclxuICAgICAgIGlmIChkaXN0ID4gYXJyLmxlbmd0aCB8fCBkaXN0IDwgMCAtIGFyci5sZW5ndGgpXHJcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hpZnQ6IGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiBhcnJheSBsZW5ndGhcIik7XHJcbiAgICAgICBpZiAoZGlzdCA+IDApIHtcclxuICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyLnNwbGljZShhcnIubGVuZ3RoIC0gZGlzdCwgSW5maW5pdHkpO1xyXG4gICAgICAgICAgIGFyci51bnNoaWZ0KC4uLnRlbXApO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGRpc3QgPCAwKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGVtcCA9IGFyci5zcGxpY2UoMCwgZGlzdCk7XHJcbiAgICAgICAgICAgYXJyLnB1c2goLi4udGVtcCk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gYXJyO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogIFNpbXBsZSB1dGlsIHRvIGxhenkgY2xvbmUgYW4gb2JqZWN0XHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2xvbmUgPSAob2JqKSA9PiB7XHJcbiAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIHNpbXBsZSB1dGlsIHRvIGxhenkgY2hlY2sgZXF1YWxpdHkgb2Ygb2JqZWN0cyBhbmQgYXJyYXlzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgaXNFcXVhbCA9IChhLCBiKSA9PiB7XHJcbiAgICAgICBjb25zdCBzdHJpbmdBID0gSlNPTi5zdHJpbmdpZnkoYSk7XHJcbiAgICAgICBjb25zdCBzdHJpbmdCID0gSlNPTi5zdHJpbmdpZnkoYik7XHJcbiAgICAgICByZXR1cm4gc3RyaW5nQSA9PT0gc3RyaW5nQjtcclxuICAgfTtcblxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVTdHJpbmdMb29rdXAuanNvblwiO1xyXG4gICAvKipcclxuICAgICogV2lsbCBsb29rdXAgYSBzY2FsZSBuYW1lIGJhc2VkIG9uIHRoZSB0ZW1wbGF0ZS5cclxuICAgICogQHBhcmFtIHRlbXBsYXRlIC0gdGhlIHRlbXBsYXRlIHRvIGxvb2t1cFxyXG4gICAgKiBAcGFyYW0gc3VwcmVzc1dhcm5pbmcgLSBzdXByZXNzIHRoZSB3YXJuaW5nIGZvciBpbmVmZmVjaWVuY3kgaWYgdHJ1ZVxyXG4gICAgKiBAcmV0dXJucyB0aGUgc2NhbGUgbmFtZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNjYWxlTmFtZUxvb2t1cCA9ICh0ZW1wbGF0ZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuYW1lVGFibGUoSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KVxyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVzID0gW107XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICBpZiAoaXNFcXVhbCh2YWx1ZXNbaV0sIHRlbXBsYXRlKSkge1xyXG4gICAgICAgICAgICAgICBzY2FsZU5hbWVzLnB1c2goa2V5c1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleXNbaV0uc2xpY2UoMSkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZXNTdHJpbmcgPSBzY2FsZU5hbWVzLmpvaW4oXCIgQUtBIFwiKTtcclxuICAgICAgIHJldHVybiBzY2FsZU5hbWVzU3RyaW5nO1xyXG4gICB9O1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQxID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICB0YWJsZVtKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSldID0gc2NhbGVOYW1lTG9va3VwKHRlbXBsYXRlLCB0cnVlKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgbGV0IF9uYW1lVGFibGUgPSB7fTtcclxuICAgY29uc3QgbmFtZVRhYmxlID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZU5hbWVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9uYW1lVGFibGVba2V5XTtcclxuICAgfTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9uYW1lVGFibGUgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25hbWVUYWJsZSA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRTY2FsZU5hbWVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfbmFtZVRhYmxlKS5sZW5ndGggPiAwKSByZXR1cm4gX25hbWVUYWJsZTtcclxuICAgICAgIF9uYW1lVGFibGUgPSBjcmVhdGVUYWJsZSQxKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9uYW1lVGFibGUpO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBuYW1lIHRhYmxlIGJ1aWx0XCIpO1xyXG4gICAgICAgcmV0dXJuIF9uYW1lVGFibGU7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTY2FsZXMgY29uc2lzdCBvZiBhIGtleSh0b25pYyBvciByb290KSBhbmQgYSB0ZW1wbGF0ZShhcnJheSBvZiBpbnRlZ2VycykgdGhhdFxyXG4gICAgKiA8YnI+IHJlcHJlc2VudHMgdGhlIGludGVydmFsIG9mIHN0ZXBzIGJldHdlZW4gZWFjaCBub3RlLlxyXG4gICAgKiA8YnI+PGJyPlNjYWxlIGludGVydmFscyBhcmUgcmVwcmVzZW50ZWQgYnkgYW4gaW50ZWdlclxyXG4gICAgKiA8YnI+dGhhdCBpcyB0aGUgbnVtYmVyIG9mIHNlbWl0b25lcyBiZXR3ZWVuIGVhY2ggbm90ZS5cclxuICAgICogPGJyPjAgPSBrZXkgLSB3aWxsIGFsd2F5cyByZXByZXNlbnQgdGhlIHRvbmljXHJcbiAgICAqIDxicj4xID0gaGFsZiBzdGVwXHJcbiAgICAqIDxicj4yID0gd2hvbGUgc3RlcFxyXG4gICAgKiA8YnI+MyA9IG9uZSBhbmQgb25lIGhhbGYgc3RlcHNcclxuICAgICogPGJyPjQgPSBkb3VibGUgc3RlcFxyXG4gICAgKiA8YnI+WzAsIDIsIDIsIDEsIDIsIDIsIDJdIHJlcHJlc2VudHMgdGhlIG1ham9yIHNjYWxlXHJcbiAgICAqIDxicj48YnI+IFNjYWxlIHRlbXBsYXRlcyBtYXkgaGF2ZSBhcmJpdHJheSBsZW5ndGhzXHJcbiAgICAqXHJcbiAgICAqIFRoZSBmb2xsb3dpbmcgUHJlLWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6XHJcbiAgICAqIDx0YWJsZT5cclxuICAgICogPHRyPlxyXG4gICAgKiA8dGQ+bWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+aW9uaWFuPC90ZD5cclxuICAgICogPHRkPmRvcmlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+cGhyeWdpYW48L3RkPlxyXG4gICAgKiA8dGQ+bHlkaWFuPC90ZD5cclxuICAgICogPHRkPm1peG9seWRpYW48L3RkPlxyXG4gICAgKiA8dGQ+YWVvbGlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bG9jcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5lbmlnbWF0aWNNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5lbmlnbWF0aWNNaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjdiNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqb3I3czRzNTwvdGQ+XHJcbiAgICAqIDx0ZD5oYXJtb25pY01ham9yPC90ZD5cclxuICAgICogPHRkPmhhcm1vbmljTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+ZG91YmxlSGFybW9uaWM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1lbG9kaWNNaW5vckFzY2VuZGluZzwvdGQ+XHJcbiAgICAqIDx0ZD5tZWxvZGljTWlub3JEZXNjZW5kaW5nPC90ZD5cclxuICAgICogPHRkPm1ham9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWlub3JQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1pbm9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICogPHRkPmI1UGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjZQZW50YXRvbmljPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kaW04VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5kb204VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5uZW9wb2xpdGFuTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+bmVvcG9saXRhbk1pbm9yPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5NYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5NaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5HeXBzeTwvdGQ+XHJcbiAgICAqIDx0ZD5zcGFuaXNoPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zcGFuaXNoOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+c3BhbmlzaEd5cHN5PC90ZD5cclxuICAgICogPHRkPmF1Z21lbnRlZDwvdGQ+XHJcbiAgICAqIDx0ZD5kb21pbmFudFN1c3BlbmRlZDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YmVib3BNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5iZWJvcERvbWluYW50PC90ZD5cclxuICAgICogPHRkPm15c3RpYzwvdGQ+XHJcbiAgICAqIDx0ZD5vdmVydG9uZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bGVhZGluZ1RvbmU8L3RkPlxyXG4gICAgKiA8dGQ+aGlyb2pvc2hpPC90ZD5cclxuICAgICogPHRkPmphcGFuZXNlQTwvdGQ+XHJcbiAgICAqIDx0ZD5qYXBhbmVzZUI8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm9yaWVudGFsPC90ZD5cclxuICAgICogPHRkPmFyYWJpYW48L3RkPlxyXG4gICAgKiA8dGQ+cGVyc2lhbjwvdGQ+XHJcbiAgICAqIDx0ZD5iYWxpbmVzZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+a3Vtb2k8L3RkPlxyXG4gICAgKiA8dGQ+cGVsb2c8L3RkPlxyXG4gICAgKiA8dGQ+YWxnZXJpYW48L3RkPlxyXG4gICAgKiA8dGQ+Y2hpbmVzZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bW9uZ29saWFuPC90ZD5cclxuICAgICogPHRkPmVneXB0aWFuPC90ZD5cclxuICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICogPHRkPnJvbWFuaWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAqIDx0ZD5pbnNlbjwvdGQ+XHJcbiAgICAqIDx0ZD5pd2F0bzwvdGQ+XHJcbiAgICAqIDx0ZD5zY290dGlzaDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+eW88L3RkPlxyXG4gICAgKiA8dGQ+aXN0cmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD51a3JhbmlhbkRvcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5wZXRydXNoa2E8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmFoYXZhcmFiYTwvdGQ+XHJcbiAgICAqIDx0ZD5oYWxmRGltaW5pc2hlZDwvdGQ+XHJcbiAgICAqIDx0ZD5qZXdpc2g8L3RkPlxyXG4gICAgKiA8dGQ+Ynl6YW50aW5lPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5hY291c3RpYzwvdGQ+XHJcbiAgICAqIDwvdGFibGU+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHtTY2FsZX0gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAqIGltcG9ydCB7U2NhbGVUZW1wbGF0ZXN9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgKiBpbXBvcnQge1NjYWxlSW5pdGlhbGl6ZXJ9IGZyb20gJ211c2ljdGhlb3J5anMnOyAvLyBUeXBlU2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgU2NhbGUge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHtTY2FsZSwgU2NhbGVUZW1wbGF0ZXN9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSBkZWZhdWx0IHRlbXBsYXRlLCBrZXkgMGYgMChDKSBhbmQgYW4gb2N0YXZlIG9mIDRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIHRlbXBsYXRlIFswLCAyLCAyLCAxLCAyLCAyLCAyXSBhbmQga2V5IDQoRSkgYW5kIG9jdGF2ZSA1XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBuZXcgU2NhbGUoe2tleTogNCwgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3J9KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiBub3RlLW5hbWVbYWx0ZXJhdGlvbl1bb2N0YXZlXVsoc2NhbGUtbmFtZSldXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgbWlub3IgdGVtcGxhdGUsIGtleSBHYiBhbmQgYW4gb2N0YXZlIG9mIDdcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMyA9IG5ldyBTY2FsZSgnR2I3KG1pbm9yKScpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBERUZBVUxUX1NDQUxFX1RFTVBMQVRFO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgdmFsdWVzID0gcGFyc2VTY2FsZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gWy4uLih2YWx1ZXM/LnRlbXBsYXRlID8/IERFRkFVTFRfU0NBTEVfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSB2YWx1ZXMua2V5IHx8IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSB8fCBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0aGF0IG9jdGF2ZSBpcyBzZXQgZmlyc3Qgc28gdGhhdFxyXG4gICAgICAgICAgICAgICAvLyBzZXR0aW5nIHRoZSBzZW1pdG9uZSBjYW4gY2hhbmdlIHRoZSBvY3RhdmVcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFsuLi4odmFsdWVzPy50ZW1wbGF0ZSA/PyBERUZBVUxUX1NDQUxFX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gdmFsdWVzLmtleSB8fCBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgfHwgREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgdW5pcXVlIGlkIGZvciB0aGlzIHNjYWxlKGF1dG8gZ2VuZXJhdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5pZCk7IC8vIGRobGtqNWozMjJcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzY2FsZSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gc2NhbGVcclxuICAgICAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzY2FsZSB0byBjb21wYXJlIHRvXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzY2FsZXMgYXJlIGVxdWFsXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZXF1YWxzKHNjYWxlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKHNjYWxlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuICh0aGlzLl9rZXkgPT09IHNjYWxlLl9rZXkgJiZcclxuICAgICAgICAgICAgICAgdGhpcy5fb2N0YXZlID09PSBzY2FsZS5fb2N0YXZlICYmXHJcbiAgICAgICAgICAgICAgIGlzRXF1YWwodGhpcy5fdGVtcGxhdGUsIHNjYWxlLl90ZW1wbGF0ZSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGlzIFNjYWxlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBTY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBzY2FsZS5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5lcXVhbHMoc2NhbGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmtleSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IGNsb25lKHRoaXMudGVtcGxhdGUpLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgIT09IDApXHJcbiAgICAgICAgICAgICAgIHNjYWxlLnNoaWZ0KHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgX2tleSA9IDA7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUua2V5KTsgLy8gMChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQga2V5KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9rZXk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNldHRpbmcgdGhlIHNlbWl0b25lIHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIDExXShzZW1pdG9uZSkgd2lsbDxici8+XHJcbiAgICAgICAgKiB3cmFwIHRoZSBzZW1pdG9uZSB0byB0aGUgcmFuZ2UgWzAsIDExXSBhbmQgY2hhbmdlIHRoZSBvY3RhdmUgZGVwZW5kaW5nPGJyLz5cclxuICAgICAgICAqIG9uIGhvdyBtYW55IHRpbWVzIHRoZSBzZW1pdG9uZSBoYXMgYmVlbiB3cmFwcGVkLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS5rZXkgPSA0O1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUua2V5KTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBrZXkodmFsdWUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcCh2YWx1ZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMub2N0YXZlID0gdGhpcy5vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHRoaXMuX2tleSA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5vY3RhdmUpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLm9jdGF2ZSA9IDU7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5vY3RhdmUpOyAvLyA1XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKHZhbHVlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdGVtcGxhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudGVtcGxhdGUpOyAvLyBbMCwgMiwgMiwgMSwgMiwgMiwgMl1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGNsb25lKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIGZvbGxvd2luZyBQcmUtZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTpcclxuICAgICAgICAqIDx0YWJsZT5cclxuICAgICAgICAqIDx0cj5cclxuICAgICAgICAqIDx0ZD5tYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmlvbmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9yaWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnBocnlnaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5seWRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPm1peG9seWRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmFlb2xpYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bG9jcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZW5pZ21hdGljTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmVuaWdtYXRpY01pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjdiNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWpvcjdzNHM1PC90ZD5cclxuICAgICAgICAqIDx0ZD5oYXJtb25pY01ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5oYXJtb25pY01pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb3VibGVIYXJtb25pYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tZWxvZGljTWlub3JBc2NlbmRpbmc8L3RkPlxyXG4gICAgICAgICogPHRkPm1lbG9kaWNNaW5vckRlc2NlbmRpbmc8L3RkPlxyXG4gICAgICAgICogPHRkPm1ham9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWlub3JQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YjVQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjZQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRpbThUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb204VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bmVvcG9saXRhbk1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5uZW9wb2xpdGFuTWlub3I8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbk1pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5HeXBzeTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2hHeXBzeTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXVnbWVudGVkPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb21pbmFudFN1c3BlbmRlZDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5iZWJvcE1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5iZWJvcERvbWluYW50PC90ZD5cclxuICAgICAgICAqIDx0ZD5teXN0aWM8L3RkPlxyXG4gICAgICAgICogPHRkPm92ZXJ0b25lPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmxlYWRpbmdUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5oaXJvam9zaGk8L3RkPlxyXG4gICAgICAgICogPHRkPmphcGFuZXNlQTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amFwYW5lc2VCPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm9yaWVudGFsPC90ZD5cclxuICAgICAgICAqIDx0ZD5hcmFiaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZXJzaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5iYWxpbmVzZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5rdW1vaTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGVsb2c8L3RkPlxyXG4gICAgICAgICogPHRkPmFsZ2VyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5jaGluZXNlPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1vbmdvbGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZWd5cHRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICAgICAqIDx0ZD5yb21hbmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aW5zZW48L3RkPlxyXG4gICAgICAgICogPHRkPml3YXRvPC90ZD5cclxuICAgICAgICAqIDx0ZD5zY290dGlzaDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD55bzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aXN0cmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+dWtyYW5pYW5Eb3JpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnBldHJ1c2hrYTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5haGF2YXJhYmE8L3RkPlxyXG4gICAgICAgICogPHRkPmhhbGZEaW1pbmlzaGVkPC90ZD5cclxuICAgICAgICAqIDx0ZD5qZXdpc2g8L3RkPlxyXG4gICAgICAgICogPHRkPmJ5emFudGluZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5hY291c3RpYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RhYmxlPlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS50ZW1wbGF0ZSA9IFswLCAyLCAyLCAxLCAyLCAyLCAyXTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRlbXBsYXRlKTsgLy8gWzAsIDIsIDIsIDEsIDIsIDIsIDJdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBjbG9uZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbm90ZXNcclxuICAgICAgICAqIG5vdGVzIGFyZSBnZW5lcmF0ZWQgYW5kIGNhY2hlZCBhcyBuZWVkZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgX25vdGVzID0gW107XHJcbiAgICAgICBfbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHdpbGwgZ2VuZXJhdGUgdGhlIG5vdGVzIGlmIG5lZWRlZCBvciByZXR1cm4gdGhlIGNhY2hlZCBub3Rlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5ub3Rlcyk7IC8vIExpc3Qgb2Ygbm90ZXNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgbm90ZXMoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX25vdGVzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBnZW5lcmF0ZSBub3RlcyhpbnRlcm5hbClcclxuICAgICAgICAqIGdlbmVyYXRlcyB0aGUgbm90ZXMgZm9yIHRoaXMgc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2VuZXJhdGVOb3RlcygpIHtcclxuICAgICAgICAgICAvLyB1c2UgdGhlIHRlbXBsYXRlIHVuc2hpZnRlZCBmb3Igc2ltcGxpY2l0eVxyXG4gICAgICAgICAgIGNvbnN0IHVuc2hpZnRlZFRlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIC10aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgIC8vIGlmIGFsbG93aW5nIHRoaXMgdG8gY2hhbmdlIHRoZSBvY3RhdmUgaXMgdW5kZXNpcmFibGVcclxuICAgICAgICAgICAvLyB0aGVuIG1heSBuZWVkIHRvIHByZSB3cmFwIHRoZSB0b25lIGFuZCB1c2VcclxuICAgICAgICAgICAvLyB0aGUgZmluYWwgdmFsdWVcclxuICAgICAgICAgICBjb25zdCBub3RlcyA9IFtdO1xyXG4gICAgICAgICAgIGxldCBhY2N1bXVsYXRvciA9IHRoaXMua2V5O1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdW5zaGlmdGVkVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdG9uZSA9IGludGVydmFsID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICA/IChhY2N1bXVsYXRvciA9IHRoaXMua2V5KVxyXG4gICAgICAgICAgICAgICAgICAgOiAoYWNjdW11bGF0b3IgKz0gaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlID0gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRvbmUsXHJcbiAgICAgICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgbm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gc2hpZnQgbm90ZXMgYmFjayB0byBvcmlnaW5hbCBwb3NpdGlvblxyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPiAwKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBub3Rlcy5zcGxpY2Uobm90ZXMubGVuZ3RoIC0gKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCArIDEpLCBJbmZpbml0eSk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnVuc2hpZnQoLi4udGVtcCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPCAwKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBub3Rlcy5zcGxpY2UoMCwgdGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgbm90ZXMucHVzaCguLi50ZW1wKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXMgPSBub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG5vdGVzIGluIHRoZSBzY2FsZVxyXG4gICAgICAgICogQHBhcmFtIHByZWZlclNoYXJwS2V5cyAtIGlmIHRydWUgdGhlbiBzaGFycHMgd2lsbCBiZSBwcmVmZXJyZWQgb3ZlciBmbGF0cyB3aGVuIHNlbWl0b25lcyBjb3VsZCBiZSBlaXRoZXIgLSBleDogQmIvQSNcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgbm90ZXMgaW4gdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm5hbWVzKTsgLy8gWydDNCcsICdENCcsICdFNCcsICdGNCcsICdHNCcsICdBNCcsICdCNCddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0Tm90ZU5hbWVzKHByZWZlclNoYXJwS2V5ID0gdHJ1ZSkge1xyXG4gICAgICAgICAgIGNvbnN0IG5hbWVzID0gc2NhbGVOb3RlTmFtZUxvb2t1cCh0aGlzLCBwcmVmZXJTaGFycEtleSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG5hbWVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBkZWdyZWVcclxuICAgICAgICAqIHJldHVybnMgYSBub3RlIHRoYXQgcmVwcmVzZW50cyB0aGUgZ2l2ZW4gZGVncmVlXHJcbiAgICAgICAgKiBAcGFyYW0gZGVncmVlIC0gdGhlIGRlZ3JlZSB0byByZXR1cm5cclxuICAgICAgICAqIEByZXR1cm5zIGEgbm90ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGRlZ3JlZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kZWdyZWUoMCkpOyAvLyBDNChOb3RlKVxyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZGVncmVlKDEpKTsgLy8gRDQoTm90ZSkgZXRjXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGVncmVlKGRlZ3JlZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKGRlZ3JlZSAtIDEgLyp6ZXJvIGluZGV4ICovLCAwLCB0aGlzLm5vdGVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLm5vdGVzW3dyYXBwZWQudmFsdWVdLmNvcHkoKTtcclxuICAgICAgICAgICBub3RlLm9jdGF2ZSA9IHRoaXMub2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICByZXR1cm4gbm90ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmVsYXRpdmUgbWFqb3JcclxuICAgICAgICAqIHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWFqb3Igb2YgdGhpcyBzY2FsZSAtIHRha2VzIHRoZSAzcmQgZGVncmVlIGFzIGl0J3Mga2V5XHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtYWpvciBvZiB0aGlzIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnJlbGF0aXZlTWFqb3IoKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcmVsYXRpdmVNYWpvcigpIHtcclxuICAgICAgICAgICBjb25zdCBtYWpvciA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5tYWpvcixcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmRlZ3JlZSgzKS5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICByZXR1cm4gbWFqb3I7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJlbGF0aXZlIG1pbm9yXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1pbm9yIG9mIHRoaXMgc2NhbGUgLSB0YWtlcyB0aGUgNnRoIGRlZ3JlZSBhcyBpdCdzIGtleVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWlub3Igb2YgdGhpcyBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5yZWxhdGl2ZU1pbm9yKCkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHJlbGF0aXZlTWlub3IoKSB7XHJcbiAgICAgICAgICAgY29uc3QgbWlub3IgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWlub3IsXHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5kZWdyZWUoNikuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG1pbm9yO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdFxyXG4gICAgICAgICovXHJcbiAgICAgICBfc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgIF9vcmlnaW5hbFRlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0XHJcbiAgICAgICAgKiBzaGlmdHMgdGhlIHNjYWxlIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHBhcmFtIHNoaWZ0IC0gdGhlIG51bWJlciBvZiBkZWdyZWVzIHRvIHNoaWZ0IHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgc2hpZnRlZCBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnQoZGVncmVlcyA9IDEpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsVGVtcGxhdGUgPSBjbG9uZSh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIGRlZ3JlZXMpO1xyXG4gICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCArPSBkZWdyZWVzO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdGVkXHJcbiAgICAgICAgKiByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcGFyYW0gZGVncmVlcyAtIHRoZSBudW1iZXIgb2YgZGVncmVlcyB0byBzaGlmdCB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0ZWQoMSkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0ZWQoZGVncmVlcyA9IDEpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnNoaWZ0KGRlZ3JlZXMpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5zaGlmdFxyXG4gICAgICAgICogc2hpZnRzIHRoZSBvcmlnaW5hbCByb290IGJhY2sgdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoaXMgc2NhbGUgYWZ0ZXIgdW5zaGlmdGluZyBpdCBiYWNrIHRvIHRoZSBvcmlnaW5hbCByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnVuc2hpZnQoKSk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdW5zaGlmdCgpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFRlbXBsYXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvLyB0aGlzLnNoaWZ0KHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAqIC0xKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuc2hpZnRlZFxyXG4gICAgICAgICogcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSB3aXRoIHRoZSB0b25pYyBzaGlmdGVkIGJhY2tcclxuICAgICAgICAqIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSB3aXRoIHRoZSB0b25pYyBzaGlmdGVkIGJhY2tcclxuICAgICAgICAqIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnVuc2hpZnRlZCgpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB1bnNoaWZ0ZWQoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxUZW1wbGF0ZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZTtcclxuICAgICAgICAgICBzY2FsZS51bnNoaWZ0KCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSBhbW91bnQgdGhhdCB0aGUgc2NhbGUgaGFzIHNoaWZ0ZWRcclxuICAgICAgICAqICgwIGlmIG5vdCBzaGlmdGVkKVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGFtb3VudCB0aGF0IHRoZSBzY2FsZSBoYXMgc2hpZnRlZFxyXG4gICAgICAgICogKDAgaWYgbm90IHNoaWZ0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0ZWQoKSk7IC8vIDFcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdGVkSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2NhbGUgbW9kZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgSW9uaWFuKG1ham9yKSBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmlvbmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpb25pYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmlvbmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBEb3JpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kb3JpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZG9yaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5kb3JpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgUGhyeWdpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5waHJ5Z2lhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBwaHJ5Z2lhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMucGhyeWdpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTHlkaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubHlkaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGx5ZGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubHlkaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIE1peG9seWRpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5taXhvbHlkaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1peG9seWRpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLm1peG9seWRpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgQWVvbGlhbihtaW5vcikgbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5hZW9saWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGFlb2xpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmFlb2xpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTG9jcmlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmxvY3JpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbG9jcmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubG9jcmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgc3RyaW5nIHZlcnNpb24gb2YgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBzdHJpbmcgdmVyc2lvbiBvZiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudG9TdHJpbmcoKSk7IC8vICdDJ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIGxldCBzY2FsZU5hbWVzID0gc2NhbGVOYW1lTG9va3VwKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgICAgICBpZiAoIXNjYWxlTmFtZXMpXHJcbiAgICAgICAgICAgICAgIHNjYWxlTmFtZXMgPSB0aGlzLmdldE5vdGVOYW1lcygpLmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICByZXR1cm4gYCR7U2VtaXRvbmUkMVt0aGlzLl9rZXldfSR7dGhpcy5fb2N0YXZlfSgke3NjYWxlTmFtZXN9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIGxvb2t1cCB0aGUgbm90ZSBuYW1lIGZvciBhIHNjYWxlIGVmZmljaWVudGx5XHJcbiAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzY2FsZSB0byBsb29rdXBcclxuICAgICogQHBhcmFtIHByZWZlclNoYXJwS2V5IC0gaWYgdHJ1ZSwgd2lsbCBwcmVmZXIgc2hhcnAga2V5cyBvdmVyIGZsYXQga2V5c1xyXG4gICAgKiBAcmV0dXJucyB0aGUgbm90ZSBuYW1lcyBmb3IgdGhlIHNjYWxlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2NhbGVOb3RlTmFtZUxvb2t1cCA9IChzY2FsZSwgcHJlZmVyU2hhcnBLZXkgPSB0cnVlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke3NjYWxlLmtleX0tJHtzY2FsZS5vY3RhdmV9LSR7SlNPTi5zdHJpbmdpZnkoc2NhbGUudGVtcGxhdGUpfWA7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZXMgPSBub3Rlc0xvb2t1cChrZXkpO1xyXG4gICAgICAgICAgIGlmIChub3Rlcykge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZXMgPSBbLi4uc2NhbGUubm90ZXNdO1xyXG4gICAgICAgbm90ZXMgPSBzaGlmdChub3RlcywgLXNjYWxlLnNoaWZ0ZWRJbnRlcnZhbCgpKTsgLy91bnNoaWZ0IGJhY2sgdG8ga2V5ID0gMCBpbmRleFxyXG4gICAgICAgY29uc3Qgbm90ZXNQYXJ0cyA9IG5vdGVzLm1hcCgobm90ZSkgPT4gbm90ZS50b1N0cmluZygpLnNwbGl0KFwiL1wiKSk7XHJcbiAgICAgICBjb25zdCBvY3RhdmVzID0gbm90ZXMubWFwKChub3RlKSA9PiBub3RlLm9jdGF2ZSk7XHJcbiAgICAgICBjb25zdCByZW1vdmFibGVzID0gW1wiQiNcIiwgXCJCc1wiLCBcIkNiXCIsIFwiRSNcIiwgXCJFc1wiLCBcIkZiXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU5hbWVzID0gW107XHJcbiAgICAgICBmb3IgKGNvbnN0IFtpLCBub3RlUGFydHNdIG9mIG5vdGVzUGFydHMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgLy9yZW1vdmUgQ2IgQiMgZXRjXHJcbiAgICAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIG5vdGVQYXJ0cykge1xyXG4gICAgICAgICAgICAgICAvLyByZW1vdmUgYW55IG51bWJlcnMgZnJvbSB0aGUgbm90ZSBuYW1lKG9jdGF2ZSlcclxuICAgICAgICAgICAgICAgLy8gcGFydC5yZXBsYWNlKC9cXGQvZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgIGlmIChyZW1vdmFibGVzLmluY2x1ZGVzKHBhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IG5vdGVOYW1lcy5pbmRleE9mKHBhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgbm90ZU5hbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKG5vdGVOYW1lcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gocHJlZmVyU2hhcnBLZXkgPyBub3RlUGFydHNbMF0gOiBub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChub3RlUGFydHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCB3aG9sZU5vdGVzID0gW1xyXG4gICAgICAgICAgICAgICBcIkFcIixcclxuICAgICAgICAgICAgICAgXCJCXCIsXHJcbiAgICAgICAgICAgICAgIFwiQ1wiLFxyXG4gICAgICAgICAgICAgICBcIkRcIixcclxuICAgICAgICAgICAgICAgXCJFXCIsXHJcbiAgICAgICAgICAgICAgIFwiRlwiLFxyXG4gICAgICAgICAgICAgICBcIkdcIixcclxuICAgICAgICAgICAgICAgXCJBXCIsXHJcbiAgICAgICAgICAgICAgIFwiQlwiLFxyXG4gICAgICAgICAgICAgICBcIkNcIixcclxuICAgICAgICAgICAgICAgXCJEXCIsXHJcbiAgICAgICAgICAgICAgIFwiRVwiLFxyXG4gICAgICAgICAgICAgICBcIkZcIixcclxuICAgICAgICAgICAgICAgXCJHXCIsXHJcbiAgICAgICAgICAgXTtcclxuICAgICAgICAgICBjb25zdCBsYXN0V2hvbGVOb3RlID0gbm90ZU5hbWVzW25vdGVOYW1lcy5sZW5ndGggLSAxXVswXTtcclxuICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSB3aG9sZU5vdGVzLmluZGV4T2YobGFzdFdob2xlTm90ZSk7XHJcbiAgICAgICAgICAgY29uc3QgbmV4dE5vdGUgPSB3aG9sZU5vdGVzW2xhc3RJbmRleCArIDFdO1xyXG4gICAgICAgICAgIGlmIChub3RlUGFydHNbMF0uaW5jbHVkZXMobmV4dE5vdGUpKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGhhc09jdGF2ZSA9IG5vdGVQYXJ0c1swXS5tYXRjaCgvXFxkL2cpO1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbMF0gKyAoaGFzT2N0YXZlID8gXCJcIiA6IG9jdGF2ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IGhhc09jdGF2ZSA9IG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0ubWF0Y2goL1xcZC9nKTtcclxuICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdICsgKGhhc09jdGF2ZSA/IFwiXCIgOiBvY3RhdmVzW2ldKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBzaGlmdGVkTm90ZU5hbWVzID0gc2hpZnQobm90ZU5hbWVzLCBzY2FsZS5zaGlmdGVkSW50ZXJ2YWwoKSk7XHJcbiAgICAgICByZXR1cm4gc2hpZnRlZE5vdGVOYW1lcztcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZU5vdGVzTG9va3VwVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBzY2FsZVRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpdG9uZSA9IFRPTkVTX01JTjsgaXRvbmUgPCBUT05FU19NSU4gKyBPQ1RBVkVfTUFYOyBpdG9uZSsrKSB7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaW9jdGF2ZSA9IE9DVEFWRV9NSU47IGlvY3RhdmUgPD0gT0NUQVZFX01BWDsgaW9jdGF2ZSsrKSB7XHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGl0b25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IGlvY3RhdmUsXHJcbiAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVbYCR7aXRvbmV9LSR7aW9jdGF2ZX0tJHtKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSl9YF0gPVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTm90ZU5hbWVMb29rdXAoc2NhbGUpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHNjYWxlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIHRoZSBsb29rdXAgdGFibGUgYXMgc29vbiBhcyB0aGUgbW9kdWxlIGlzIGxvYWRlZFxyXG4gICAgKi9cclxuICAgbGV0IF9ub3Rlc0xvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3Rlc0xvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVOb3RlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZXNMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgY29uc3QgYnVpbGRTY2FsZU5vdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfbm90ZXNMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfbm90ZXNMb29rdXA7XHJcbiAgICAgICBfbm90ZXNMb29rdXAgPSBjcmVhdGVOb3Rlc0xvb2t1cFRhYmxlKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3Rlc0xvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IHNjYWxlIG5vdGUgdGFibGVcIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVzTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2hvcnRjdXQgZm9yIG1vZGlmaWVyc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGZsYXQgPSAtMTtcclxuICAgY29uc3QgZmxhdF9mbGF0ID0gLTI7XHJcbiAgIGNvbnN0IHNoYXJwID0gMTtcclxuICAgLyoqXHJcbiAgICAqIENob3JkIHRlbXBsYXRlc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IENob3JkVGVtcGxhdGVzID0ge1xyXG4gICAgICAgbWFqOiBbMSwgMywgNV0sXHJcbiAgICAgICBtYWo0OiBbMSwgMywgNCwgNV0sXHJcbiAgICAgICBtYWo2OiBbMSwgMywgNSwgNl0sXHJcbiAgICAgICBtYWo2OTogWzEsIDMsIDUsIDYsIDldLFxyXG4gICAgICAgbWFqNzogWzEsIDMsIDUsIDddLFxyXG4gICAgICAgbWFqOTogWzEsIDMsIDUsIDcsIDldLFxyXG4gICAgICAgbWFqMTE6IFsxLCAzLCA1LCA3LCA5LCAxMV0sXHJcbiAgICAgICBtYWoxMzogWzEsIDMsIDUsIDcsIDksIDExLCAxM10sXHJcbiAgICAgICBtYWo3czExOiBbMSwgMywgNSwgNywgWzExLCBzaGFycF1dLFxyXG4gICAgICAgbWFqYjU6IFsxLCAzLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgbWluOiBbMSwgWzMsIGZsYXRdLCA1XSxcclxuICAgICAgIG1pbjQ6IFsxLCBbMywgZmxhdF0sIDQsIDVdLFxyXG4gICAgICAgbWluNjogWzEsIFszLCBmbGF0XSwgNSwgNl0sXHJcbiAgICAgICBtaW43OiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF1dLFxyXG4gICAgICAgbWluQWRkOTogWzEsIFszLCBmbGF0XSwgNSwgOV0sXHJcbiAgICAgICBtaW42OTogWzEsIFszLCBmbGF0XSwgNSwgNiwgOV0sXHJcbiAgICAgICBtaW45OiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgbWluMTE6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOSwgMTFdLFxyXG4gICAgICAgbWluMTM6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOSwgMTEsIDEzXSxcclxuICAgICAgIG1pbjdiNTogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tNzogWzEsIDMsIDUsIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb205OiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTExOiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5LCAxMV0sXHJcbiAgICAgICBkb20xMzogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOSwgMTEsIDEzXSxcclxuICAgICAgIGRvbTdzNTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203YjU6IFsxLCAzLCBbNSwgZmxhdF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203Yjk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFs5LCBmbGF0XV0sXHJcbiAgICAgICBkb203czk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFs5LCBzaGFycF1dLFxyXG4gICAgICAgZG9tOXM1OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTliNTogWzEsIDMsIFs1LCBmbGF0XSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTdzNXM5OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCBbOSwgc2hhcnBdXSxcclxuICAgICAgIGRvbTdzNWI5OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCBbOSwgZmxhdF1dLFxyXG4gICAgICAgZG9tN3MxMTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzExLCBzaGFycF1dLFxyXG4gICAgICAgZGltOiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgZGltNzogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdLCBbNywgZmxhdF9mbGF0XV0sXHJcbiAgICAgICBhdWc6IFsxLCAzLCBbNSwgc2hhcnBdXSxcclxuICAgICAgIHN1czI6IFsxLCAyLCA1XSxcclxuICAgICAgIHN1czQ6IFsxLCBbNCwgZmxhdF0sIDVdLFxyXG4gICAgICAgZmlmdGg6IFsxLCA1XSxcclxuICAgICAgIGI1OiBbMSwgWzUsIGZsYXRdXSxcclxuICAgICAgIHMxMTogWzEsIDUsIFsxMSwgc2hhcnBdXSxcclxuICAgfTtcclxuICAgT2JqZWN0LmtleXMoQ2hvcmRUZW1wbGF0ZXMpLmZvckVhY2goKGVsZW1lbnQpID0+IE9iamVjdC5mcmVlemUoQ2hvcmRUZW1wbGF0ZXNbZWxlbWVudF0pKTtcblxuICAgY29uc3QgREVGQVVMVF9DSE9SRF9URU1QTEFURSA9IFsxLCAzLCA1XTtcclxuICAgY29uc3QgREVGQVVMVF9TQ0FMRSA9IG5ldyBTY2FsZSgpO1xuXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZUxvb2t1cC5qc29uXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgY29uc3QgbmFtZVJlZ2V4ID0gLyhbQS1HXSkoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCA9IC8oI3xzfGIpKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4ID0gLyhbMC05XSspKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IGNob3JkTmFtZVJlZ2V4ID0gLyhtaW58bWFqfGRpbXxhdWcpKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IGFkZGl0aW9uc1JlZ2V4ID0gLyhbI3xzfGJdP1swLTldKykoPyFbXihdKlxcKSkvZztcclxuICAgLyoqXHJcbiAgICAqIEBwYXJhbSBjaG9yZCB0aGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICAqIEByZXR1cm5zIGEgdmFsaWQgQ2hvcmRJbml0aWFsaXplclxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlQ2hvcmQgPSAoY2hvcmQpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hvcmRMb29rdXAoY2hvcmQpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBsZXQgY2hvcmROYW1lID0gXCJtYWpcIjtcclxuICAgICAgIGxldCBhZGRpdGlvbnMgPSBbXTtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IGNob3JkLm1hdGNoKG5hbWVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gY2hvcmQubWF0Y2gobW9kaWZpZXJSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IGNob3JkLm1hdGNoKG9jdGF2ZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IGNob3JkTmFtZU1hdGNoID0gY2hvcmQubWF0Y2goY2hvcmROYW1lUmVnZXgpPy5qb2luKFwiXCIpO1xyXG4gICAgICAgY29uc3QgYWRkaXRpb25zTWF0Y2ggPSBjaG9yZC5tYXRjaChhZGRpdGlvbnNSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoY2hvcmROYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICAvLyBjb25zdCBbbmFtZV0gPSBjaG9yZE5hbWVNYXRjaDtcclxuICAgICAgICAgICBjaG9yZE5hbWUgPSBjaG9yZE5hbWVNYXRjaDtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChhZGRpdGlvbnNNYXRjaCkge1xyXG4gICAgICAgICAgIGFkZGl0aW9ucyA9IGFkZGl0aW9uc01hdGNoO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3QgaW50ZXJ2YWxzID0gW107XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgaW50ZXJ2YWxzLnB1c2goLi4uQ2hvcmRUZW1wbGF0ZXNbY2hvcmROYW1lXSk7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBhZGRpdGlvbiBvZiBhZGRpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgbGV0IG1vZCA9IDA7XHJcbiAgICAgICAgICAgICAgIGlmIChhZGRpdGlvblswXSA9PT0gXCIjXCIgfHwgYWRkaXRpb25bMF0gPT09IFwic1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgYWRkaXRpb25zLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSBpZiAoYWRkaXRpb25bMF0gPT09IFwiYlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uTnVtID0gcGFyc2VJbnQoYWRkaXRpb24sIDEwKTtcclxuICAgICAgICAgICAgICAgaWYgKGludGVydmFscy5pbmNsdWRlcyhhZGRpdGlvbk51bSkpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaW50ZXJ2YWxzLmluZGV4T2YoYWRkaXRpb25OdW0pO1xyXG4gICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxzW2luZGV4XSA9IFthZGRpdGlvbk51bSwgbW9kXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIGludGVydmFscy5wdXNoKFthZGRpdGlvbk51bSwgbW9kXSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgcm9vdDogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogaW50ZXJ2YWxzLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNob3JkIG5hbWVcIik7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBAcmV0dXJucyBhIGxvb2t1cCB0YWJsZSBvZiBjaG9yZCBuYW1lcyBhbmQgdGhlaXIgaW5pdGlhbGl6ZXJzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGNvbnN0IHF1YWxpdGllcyA9IFtcIm1halwiLCBcIm1pblwiLCBcImRpbVwiLCBcImF1Z1wiLCBcInN1c1wiXTtcclxuICAgICAgIGNvbnN0IGFkZGl0aW9ucyA9IFtcclxuICAgICAgICAgICBcIlwiLFxyXG4gICAgICAgICAgIFwiMlwiLFxyXG4gICAgICAgICAgIFwiM1wiLFxyXG4gICAgICAgICAgIFwiNFwiLFxyXG4gICAgICAgICAgIFwiNVwiLFxyXG4gICAgICAgICAgIFwiNlwiLFxyXG4gICAgICAgICAgIFwiN1wiLFxyXG4gICAgICAgICAgIFwiOVwiLFxyXG4gICAgICAgICAgIFwiMTFcIixcclxuICAgICAgICAgICBcIjEzXCIsXHJcbiAgICAgICAgICAgXCJiMlwiLFxyXG4gICAgICAgICAgIFwiYjNcIixcclxuICAgICAgICAgICBcImI0XCIsXHJcbiAgICAgICAgICAgXCJiNVwiLFxyXG4gICAgICAgICAgIFwiYjZcIixcclxuICAgICAgICAgICBcImI3XCIsXHJcbiAgICAgICAgICAgXCJiOVwiLFxyXG4gICAgICAgICAgIFwiYjExXCIsXHJcbiAgICAgICAgICAgXCJiMTNcIixcclxuICAgICAgICAgICBcInMyXCIsXHJcbiAgICAgICAgICAgXCJzM1wiLFxyXG4gICAgICAgICAgIFwiczRcIixcclxuICAgICAgICAgICBcInM1XCIsXHJcbiAgICAgICAgICAgXCJzNlwiLFxyXG4gICAgICAgICAgIFwiczdcIixcclxuICAgICAgICAgICBcInM5XCIsXHJcbiAgICAgICAgICAgXCJzMTFcIixcclxuICAgICAgICAgICBcInMxM1wiLFxyXG4gICAgICAgICAgIFwiIzJcIixcclxuICAgICAgICAgICBcIiMzXCIsXHJcbiAgICAgICAgICAgXCIjNFwiLFxyXG4gICAgICAgICAgIFwiIzVcIixcclxuICAgICAgICAgICBcIiM2XCIsXHJcbiAgICAgICAgICAgXCIjN1wiLFxyXG4gICAgICAgICAgIFwiIzlcIixcclxuICAgICAgICAgICBcIiMxMVwiLFxyXG4gICAgICAgICAgIFwiIzEzXCIsXHJcbiAgICAgICAgICAgXCI3czExXCIsXHJcbiAgICAgICAgICAgXCI3IzExXCIsXHJcbiAgICAgICAgICAgXCI3YjlcIixcclxuICAgICAgICAgICBcIjcjOVwiLFxyXG4gICAgICAgICAgIFwiN2I1XCIsXHJcbiAgICAgICAgICAgXCI3IzVcIixcclxuICAgICAgICAgICBcIjdiOWI1XCIsXHJcbiAgICAgICAgICAgXCI3IzkjNVwiLFxyXG4gICAgICAgICAgIFwiN2IxM1wiLFxyXG4gICAgICAgICAgIFwiNyMxM1wiLFxyXG4gICAgICAgICAgIFwiOSM1XCIsXHJcbiAgICAgICAgICAgXCI5YjVcIixcclxuICAgICAgICAgICBcIjkjMTFcIixcclxuICAgICAgICAgICBcIjliMTFcIixcclxuICAgICAgICAgICBcIjkjMTNcIixcclxuICAgICAgICAgICBcIjliMTNcIixcclxuICAgICAgICAgICBcIjExIzVcIixcclxuICAgICAgICAgICBcIjExYjVcIixcclxuICAgICAgICAgICBcIjExIzlcIixcclxuICAgICAgICAgICBcIjExYjlcIixcclxuICAgICAgICAgICBcIjExIzEzXCIsXHJcbiAgICAgICAgICAgXCIxMWIxM1wiLFxyXG4gICAgICAgXTtcclxuICAgICAgIGZvciAoY29uc3QgcXVhbGl0eSBvZiBxdWFsaXRpZXMpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGl0aW9uIG9mIGFkZGl0aW9ucykge1xyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVMZXR0ZXIgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZU1vZGlmaWVyIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0ke25vdGVNb2RpZmllcn0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBPQ1RBVkVfTUlOOyBpIDw9IE9DVEFWRV9NQVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0ke25vdGVNb2RpZmllcn0ke2l9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBsZXQgX2Nob3JkTG9va3VwID0ge307XHJcbiAgIC8qKlxyXG4gICAgKiBAcGFyYW0ga2V5IHRoZSBzdHJpbmcgdG8gbG9va3VwXHJcbiAgICAqIEByZXR1cm5zIGEgdmFsaWQgY2hvcmQgaW5pdGlhbGl6ZXJcclxuICAgICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUga2V5IGlzIG5vdCBhIHZhbGlkIGNob3JkXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2hvcmRMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZENob3JkVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfY2hvcmRMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gdGFibGUgYXMgeyBba2V5OiBzdHJpbmddOiBDaG9yZEluaXRpYWxpemVyIH07XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRDaG9yZFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9jaG9yZExvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9jaG9yZExvb2t1cDtcclxuICAgICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9jaG9yZExvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IGNob3JkIHRhYmxlXCIpO1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmVudHJpZXMoX2Nob3JkTG9va3VwKS5sZW5ndGgpO1xyXG4gICAgICAgcmV0dXJuIF9jaG9yZExvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIENob3JkcyBjb25zaXN0IG9mIGEgcm9vdCBub3RlLCBvY3RhdmUsIGNob3JkIHRlbXBsYXRlLCBhbmQgYSBiYXNlIHNjYWxlLjxicj48YnI+XHJcbiAgICAqIFRoZSBjaG9yZCB0ZW1wbGF0ZSBpcyBhbiBhcnJheSBvZiBpbnRlZ2VycywgZWFjaCBpbnRlZ2VyIHJlcHJlc2VudGluZzxicj5cclxuICAgICogIGEgc2NhbGUgZGVncmVlIGZyb20gdGhlIGJhc2Ugc2NhbGUoZGVmYXVsdHMgdG8gbWFqb3IpLjxicj5cclxuICAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgaXMgdGhlIEksSUlJLFYgZGVub3RlZCBhcyBbMSwzLDVdPGJyPlxyXG4gICAgKiBDaG9yZEludGVydmFscyB1c2VkIGluIHRlbXBsYXRlcyBjYW4gYWxzbyBjb250YWluIGEgbW9kaWZpZXIsPGJyPlxyXG4gICAgKiBmb3IgYSBwYXJ0aWN1bGFyIHNjYWxlIGRlZ3JlZSwgc3VjaCBhcyBbMSwzLFs1LCAtMV1dPGJyPlxyXG4gICAgKiB3aGVyZSAtMSBpcyBmbGF0LCAwIGlzIG5hdHVyYWwsIGFuZCAxIGlzIHNoYXJwLjxicj5cclxuICAgICogSXQgY291bGQgYWxzbyBiZSB3cml0dGVuIGFzIFsxLDMsWzUsIG1vZGlmaWVyLmZsYXRdXTxicj5cclxuICAgICogaWYgeW91IGltcG9ydCBtb2RpZmllci5cclxuICAgICpcclxuICAgICogVGhlIGZvbGxvd2luZyBwcmVkZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOjxicj5cclxuICAgICogPHRhYmxlPlxyXG4gICAgKiA8dHI+XHJcbiAgICAqIDx0ZD5tYWo8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNDwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo2PC90ZD5cclxuICAgICogPHRkPm1hajY5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWo3PC90ZD5cclxuICAgICogPHRkPm1hajk8L3RkPlxyXG4gICAgKiA8dGQ+bWFqMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWFqMTM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1hajdzMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWFqYjU8L3RkPlxyXG4gICAgKiA8dGQ+bWluPC90ZD5cclxuICAgICogPHRkPm1pbjQ8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbjY8L3RkPlxyXG4gICAgKiA8dGQ+bWluNzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5BZGQ5PC90ZD5cclxuICAgICogPHRkPm1pbjY5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW45PC90ZD5cclxuICAgICogPHRkPm1pbjExPC90ZD5cclxuICAgICogPHRkPm1pbjEzPC90ZD5cclxuICAgICogPHRkPm1pbjdiNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tNzwvdGQ+XHJcbiAgICAqIDx0ZD5kb205PC90ZD5cclxuICAgICogPHRkPmRvbTExPC90ZD5cclxuICAgICogPHRkPmRvbTEzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203czU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN2I1PC90ZD5cclxuICAgICogPHRkPmRvbTdzOTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203Yjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTliNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb205czU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3MxMTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czVzOTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tN3M1Yjk8L3RkPlxyXG4gICAgKiA8dGQ+ZGltPC90ZD5cclxuICAgICogPHRkPmRpbTc8L3RkPlxyXG4gICAgKiA8dGQ+YXVnPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zdXMyPC90ZD5cclxuICAgICogPHRkPnN1czQ8L3RkPlxyXG4gICAgKiA8dGQ+ZmlmdGg8L3RkPlxyXG4gICAgKiA8dGQ+YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnMxMTwvdGQ+XHJcbiAgICAqIDwvdHI+XHJcbiAgICAqIDwvdGFibGU+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgQ2hvcmQgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkVGVtcGxhdGV9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRJbnRlcnZhbH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtNb2RpZmllcn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZEluaXRpYWxpemVyfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiOy8vIFR5cGVzY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBDaG9yZCB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQgeyBDaG9yZCwgQ2hvcmRUZW1wbGF0ZXMsIE1vZGlmaWVyIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvL2NyZWF0ZXMgYSBjaG9yZCB3aXRoIHRoZSBkZWZhdWx0KDEsMyw1KSB0ZW1wbGF0ZSwgcm9vdCBvZiBDLCBpbiB0aGUgNHRoIG9jdGF2ZVxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgY2hvcmQgd2l0aCB0aGUgcHJlLWRlZmluZWQgZGltaW5pc2hlZCB0ZW1wbGF0ZSwgcm9vdCBvZiBFYiwgaW4gdGhlIDV0aCBvY3RhdmVcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKHtyb290OiAzLCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBDaG9yZFRlbXBsYXRlcy5kaW19KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IChyb290LW5vdGUtbmFtZVtzLCMsYl1bb2N0YXZlXSlbY2hvcmQtdGVtcGxhdGUtbmFtZXxbY2hvcmQtcXVhbGl0eV1bbW9kaWZpZXJzXV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBjaG9yZCBmcm9tIGEgc3RyaW5nXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgnKEQ0KW1pbjQnKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi5ERUZBVUxUX0NIT1JEX1RFTVBMQVRFXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUNob3JkKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLihwYXJzZWQ/LnRlbXBsYXRlID8/IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBwYXJzZWQ/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gcGFyc2VkPy5yb290ID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi4odmFsdWVzLnRlbXBsYXRlID8/IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSB2YWx1ZXMucm9vdCA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUgPSBuZXcgU2NhbGUoeyBrZXk6IHRoaXMuX3Jvb3QsIG9jdGF2ZTogdGhpcy5fb2N0YXZlIH0pO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaWQpOyAvLyBoYWw4OTM0aGxsXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcm9vdFxyXG4gICAgICAgICovXHJcbiAgICAgICBfcm9vdCA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQucm9vdCk7IC8vIDAoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHJvb3QoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNldHRpbmcgdGhlIHJvb3QgdG8gYSB2YWx1ZSBvdXRzaWRlIG9mIHRoZSByYW5nZSBbMCwgMTFdKHNlbWl0b25lKSB3aWxsPGJyLz5cclxuICAgICAgICAqIHdyYXAgdGhlIHNlbWl0b25lIHRvIHRoZSByYW5nZSBbMCwgMTFdIGFuZCBjaGFuZ2UgdGhlIG9jdGF2ZSBkZXBlbmRpbmc8YnIvPlxyXG4gICAgICAgICogb24gaG93IG1hbnkgdGltZXMgdGhlIHNlbWl0b25lIGhhcyBiZWVuIHdyYXBwZWQuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLnJvb3QgPSA0OyAvLyBzZXRzIHRoZSByb290IHRvIDR0aCBzZW1pdG9uZShFKVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQucm9vdCk7IC8vIDQoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHJvb3QodmFsdWUpIHtcclxuICAgICAgICAgICAvLyB0aGlzLl9yb290ID0gdmFsdWU7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAodmFsdWUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9yb290ID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSB0aGlzLl9vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBiYXNlIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9iYXNlU2NhbGUgPSBERUZBVUxUX1NDQUxFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmJhc2VTY2FsZSk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCBzY2FsZShtYWpvcilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgYmFzZVNjYWxlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9iYXNlU2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE5vdCBhIGxvdCBvZiBnb29kIHJlYXNvbnMgdG8gY2hhbmdlIHRoaXMgZXhjZXB0IGZvciBleHBlcmltZW50YXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuYmFzZVNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiAzLCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCA1XSB9KTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmJhc2VTY2FsZSk7IC8vIHByaW50cyB0aGUgbWlub3Igc2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgYmFzZVNjYWxlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlLm9jdGF2ZSA9IHRoaXMuX29jdGF2ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm9jdGF2ZSk7IC8vIDQob2N0YXZlKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5vY3RhdmUgPSA1OyAvLyBzZXRzIHRoZSBvY3RhdmUgdG8gNXRoXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5vY3RhdmUpOyAvLyA1KG9jdGF2ZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAodmFsdWUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZS5vY3RhdmUgPSB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHRlbXBsYXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90ZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IHRlbXBsYXRlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgIHJldHVybiBbLi4udGhpcy5fdGVtcGxhdGVdO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgZm9sbG93aW5nIHByZWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6PGJyPlxyXG4gICAgICAgICogPHRhYmxlPlxyXG4gICAgICAgICogPHRyPlxyXG4gICAgICAgICogPHRkPm1hajwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajEzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1hajdzMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1hamI1PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW48L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjQ8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWluNjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluQWRkOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWluOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjEzPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW43YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tMTE8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTEzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTdzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN2I1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czk8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdiOTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb205YjU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTlzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3MxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1czk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1Yjk8L3RkPlxyXG4gICAgICAgICogPHRkPmRpbTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZGltNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXVnPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnN1czI8L3RkPlxyXG4gICAgICAgICogPHRkPnN1czQ8L3RkPlxyXG4gICAgICAgICogPHRkPmZpZnRoPC90ZD5cclxuICAgICAgICAqIDx0ZD5iNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zMTE8L3RkPlxyXG4gICAgICAgICogPC90cj5cclxuICAgICAgICAqIDwvdGFibGU+XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLnRlbXBsYXRlID0gWzEsIFszLCBNb2RpZmllci5mbGF0XSwgNV07IC8vIHNldHMgdGhlIHRlbXBsYXRlIHRvIGEgbWlub3IgY2hvcmRcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gcHJpbnRzIHRoZSBuZXcgdGVtcGxhdGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi52YWx1ZV07XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG5vdGVzXHJcbiAgICAgICAgKiBub3RlcyBhcmUgZ2VuZXJhdGVkIGFuZCBjYWNoZWQgYXMgbmVlZGVkXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9ub3RlcyA9IFtdO1xyXG4gICAgICAgX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB3aWxsIGdlbmVyYXRlIG5vdGVzIGlmIG5lZWRlZCBvciByZXR1cm4gdGhlIGNhY2hlZCBub3Rlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5ub3Rlcyk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCBub3Rlc1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBub3RlcygpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fbm90ZXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGdlbmVyYXRlIG5vdGVzKGludGVybmFsKVxyXG4gICAgICAgICogZ2VuZXJhdGVzIHRoZSBub3RlcyBmb3IgdGhpcyBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBnZW5lcmF0ZU5vdGVzKCkge1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzID0gW107XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBsZXQgdG9uZSA9IDA7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2QgPSAwO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIHRvbmUgPSBpbnRlcnZhbFswXTtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IGludGVydmFsWzFdO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgdG9uZSA9IGludGVydmFsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHRvbmU7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLl9iYXNlU2NhbGUuZGVncmVlKG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGVUb25lID0gbm90ZS5zZW1pdG9uZTtcclxuICAgICAgICAgICAgICAgbm90ZS5zZW1pdG9uZSA9IG5vdGVUb25lICsgbW9kO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBub3RlIG5hbWVzIC0+IFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE5vdGVOYW1lcygpIHtcclxuICAgICAgICAgICBjb25zdCBub3RlTmFtZXMgPSBbXTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgdGhpcy5ub3Rlcykge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gbm90ZU5hbWVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IENob3JkKHtcclxuICAgICAgICAgICAgICAgcm9vdDogdGhpcy5yb290LFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogWy4uLnRoaXMuX3RlbXBsYXRlXSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIG90aGVyIHRoZSBvdGhlciBjaG9yZCB0byBjb21wYXJlIHRvXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSB0d28gY2hvcmRzIGFyZSBlcXVhbFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiAodGhpcy5yb290ID09PSBvdGhlci5yb290ICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID09PSBvdGhlci5vY3RhdmUgJiZcclxuICAgICAgICAgICAgICAgaXNFcXVhbCh0aGlzLl90ZW1wbGF0ZSwgb3RoZXIudGVtcGxhdGUpKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgbmF0cnVhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNob3JkLm1ham9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtYWpvcigpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaCgzKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IDM7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBuYXR1cmFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLm1ham9yZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWFqb3JlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkubWFqb3IoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgbmF0dXJhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNYWpvcigpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzTWFqb3IoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBtdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSxbMywtMV0sNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaW5vcigpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbMywgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFszLCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQubWlub3JlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLFszLC0xXSw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1pbm9yZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLm1pbm9yKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWlub3IoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNaW5vcigpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzTWlub3IoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmF1Z21lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5zaGFycF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYXVnbWVudCgpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNSwgMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzUsIDFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5hdWdtZW50ZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLnNoYXJwXV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhdWdtZW50ZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmF1Z21lbnQoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzQXVnbWVudGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuYXVnbWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNBdWdtZW50ZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0F1Z21lbnRlZCgpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGltaW5pc2goKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzUsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNSwgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmRpbWluaXNoZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmRpbWluaXNoKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzRGltaW5pc2hlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0RpbWluaXNoZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0RpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIFs1LCBNb2RpZmllci5mbGF0XSwgWzcsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICpcclxuICAgICAgICAqL1xyXG4gICAgICAgaGFsZkRpbWluaXNoKCkge1xyXG4gICAgICAgICAgIHRoaXMubWlub3IoKTsgLy8gZ2V0IGZsYXQgM3JkXHJcbiAgICAgICAgICAgdGhpcy5kaW1pbmlzaCgpOyAvLyBnZXQgZmxhdCA1dGhcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNywgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs3LCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuaGFsZkRpbWluaXNoZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdLCBbNywgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKi9cclxuICAgICAgIGhhbGZEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5oYWxmRGltaW5pc2goKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNIYWxmRGltaW5pc2hlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNIYWxmRGltaW5pc2hlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0hhbGZEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIGxldCB0aGlyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGxldCBmaWZ0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGxldCBzZXZlbnRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDcgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHNldmVudGggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBmaWZ0aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcmQgJiYgZmlmdGggJiYgc2V2ZW50aDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIHdpdGggdGhlIGZpcnN0IG5vdGUgbW92ZWQgdG8gdGhlIGVuZCB1cCBvbmUgb2N0YXZlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGNob3JkLmludmVydCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMyw1LDFdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnRTQnLCAnRzQnLCAnQzUnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGludmVydCgpIHtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl90ZW1wbGF0ZVswXSk7XHJcbiAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5fdGVtcGxhdGVbMF0pKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlWzBdWzBdICs9IHRoaXMuX2Jhc2VTY2FsZS50ZW1wbGF0ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVswXSArPSB0aGlzLl9iYXNlU2NhbGUudGVtcGxhdGUubGVuZ3RoO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IG5ld1RlbXBsYXRlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggd2l0aCB0aGUgZmlyc3Qgbm90ZSBtb3ZlZCB0byB0aGUgZW5kIHVwIG9uZSBvY3RhdmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmludmVydGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzMsNSwxXVxyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS5nZXROb3RlTmFtZXMoKSk7IC8vIFsnRTQnLCAnRzQnLCAnQzUnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGludmVydGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5pbnZlcnQoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIHN0cmluZyBmb3JtIG9mIHRoZSBjaG9yZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50b1N0cmluZygpKTsgLy8gJyhDNCltYWonXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKENob3JkVGVtcGxhdGVzKTtcclxuICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKENob3JkVGVtcGxhdGVzKS5tYXAoKHRlbXBsYXRlKSA9PiBKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGNvbnN0IGluZGV4ID0gdmFsdWVzLmluZGV4T2YoSlNPTi5zdHJpbmdpZnkodGhpcy5fdGVtcGxhdGUpKTtcclxuICAgICAgICAgICBjb25zdCBwcmVmaXggPSBgKCR7U2VtaXRvbmUkMVt0aGlzLl9yb290XX0ke3RoaXMuX29jdGF2ZX0pYDtcclxuICAgICAgICAgICBjb25zdCBzdHIgPSBpbmRleCA+IC0xID8gcHJlZml4ICsga2V5c1tpbmRleF0gOiB0aGlzLmdldE5vdGVOYW1lcygpLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIEJ1aWxkcyBsb29rdXAgdGFibGVzIGZvciBtb3JlIHBlcmZvcm1hbnQgc3RyaW5nIHBhcnNpbmcuPGJyLz5cclxuICAgICogU2hvdWxkIG9ubHkob3B0aW9uYWxseSkgYmUgY2FsbGVkIG9uY2Ugc29vbiBhZnRlciB0aGUgbGlicmFyeSBpcyBsb2FkZWQgYW5kPGJyLz5cclxuICAgICogb25seSBpZiB5b3UgYXJlIHVzaW5nIHN0cmluZyBpbml0aWFsaXplcnMuXHJcbiAgICAqL1xyXG4gICBjb25zdCBidWlsZFRhYmxlcyA9ICgpID0+IHtcclxuICAgICAgIGJ1aWxkTm90ZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlTm90ZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlTmFtZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZENob3JkVGFibGUoKTtcclxuICAgfTtcblxuICAgZXhwb3J0cy5DaG9yZCA9IENob3JkO1xuICAgZXhwb3J0cy5DaG9yZFRlbXBsYXRlcyA9IENob3JkVGVtcGxhdGVzO1xuICAgZXhwb3J0cy5JbnN0cnVtZW50ID0gSW5zdHJ1bWVudDtcbiAgIGV4cG9ydHMuTW9kaWZpZXIgPSBNb2RpZmllciQxO1xuICAgZXhwb3J0cy5Ob3RlID0gTm90ZTtcbiAgIGV4cG9ydHMuU2NhbGUgPSBTY2FsZTtcbiAgIGV4cG9ydHMuU2NhbGVUZW1wbGF0ZXMgPSBTY2FsZVRlbXBsYXRlcztcbiAgIGV4cG9ydHMuU2VtaXRvbmUgPSBTZW1pdG9uZSQxO1xuICAgZXhwb3J0cy5idWlsZFRhYmxlcyA9IGJ1aWxkVGFibGVzO1xuXG4gICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSwgU2NhbGVUZW1wbGF0ZXMgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5cbnR5cGUgTGlnaHRTY2FsZSA9IHtcbiAgICBrZXk6IG51bWJlcixcbiAgICB0ZW1wbGF0ZVNsdWc6IHN0cmluZyxcbiAgICBzZW1pdG9uZXM6IG51bWJlcltdLFxufTtcblxuXG5jb25zdCBzY2FsZXNGb3JOb3RlcyA9IChub3RlczogTm90ZVtdLCBwYXJhbXM6IE11c2ljUGFyYW1zKTogU2NhbGVbXSA9PiB7XG4gICAgY29uc3Qgc2NhbGVzID0gbmV3IFNldDxMaWdodFNjYWxlPigpXG4gICAgLy8gRmlyc3QgYWRkIGFsbCBzY2FsZXNcbiAgICBmb3IgKGNvbnN0IHNjYWxlU2x1ZyBpbiBwYXJhbXMuc2NhbGVTZXR0aW5ncykge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHBhcmFtcy5zY2FsZVNldHRpbmdzW3NjYWxlU2x1Z107XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5lbmFibGVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzZW1pdG9uZT0wOyBzZW1pdG9uZSA8IDEyOyBzZW1pdG9uZSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe2tleTogc2VtaXRvbmUsIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlc1tzY2FsZVNsdWddfSlcbiAgICAgICAgICAgICAgICBjb25zdCBzZW1pdG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBsZWFkaW5nVG9uZSA9IChzY2FsZS5rZXkgLSAxICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFzZW1pdG9uZXMuaW5jbHVkZXMobGVhZGluZ1RvbmUpKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHNlbWl0b25lcy5wdXNoKGxlYWRpbmdUb25lKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgc2NhbGVzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogc2VtaXRvbmUsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlU2x1Zzogc2NhbGVTbHVnLFxuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZXM6IHNlbWl0b25lcyxcbiAgICAgICAgICAgICAgICB9IGFzIExpZ2h0U2NhbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IG5vdGUuc2VtaXRvbmVcbiAgICAgICAgZm9yIChjb25zdCBzY2FsZSBvZiBzY2FsZXMpIHtcbiAgICAgICAgICAgIGlmICghc2NhbGUuc2VtaXRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgIHNjYWxlcy5kZWxldGUoc2NhbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIHNjYWxlcykge1xuICAgICAgICByZXQucHVzaChuZXcgU2NhbGUoe2tleTogc2NhbGUua2V5LCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXNbc2NhbGUudGVtcGxhdGVTbHVnXX0pKVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5cbmV4cG9ydCBjb25zdCBnZXRBdmFpbGFibGVTY2FsZXMgPSAodmFsdWVzOiB7XG4gICAgbGF0ZXN0RGl2aXNpb246IG51bWJlcixcbiAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLFxuICAgIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgcmFuZG9tTm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIGxvZ2dlcjogTG9nZ2VyLFxufSk6IEFycmF5PHtcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxufT4gPT4ge1xuICAgIGNvbnN0IHtsYXRlc3REaXZpc2lvbiwgZGl2aXNpb25lZFJpY2hOb3RlcywgcGFyYW1zLCByYW5kb21Ob3RlcywgbG9nZ2VyfSA9IHZhbHVlcztcbiAgICAvLyBHaXZlbiBhIG5ldyBjaG9yZCwgZmluZCBhdmFpbGFibGUgc2NhbGVzIGJhc2Ugb24gdGhlIHByZXZpb3VzIG5vdGVzXG4gICAgY29uc3QgY3VycmVudEF2YWlsYWJsZVNjYWxlcyA9IHNjYWxlc0Zvck5vdGVzKHJhbmRvbU5vdGVzLCBwYXJhbXMpXG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIGN1cnJlbnRBdmFpbGFibGVTY2FsZXMpIHtcbiAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgc2NhbGUsXG4gICAgICAgICAgICB0ZW5zaW9uOiAwLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxvZ2dlci5sb2coXCJjdXJyZW50QXZhaWxhYmxlU2NhbGVzXCIsIGN1cnJlbnRBdmFpbGFibGVTY2FsZXMpXG5cbiAgICByZXR1cm4gcmV0LmZpbHRlcihpdGVtID0+IGl0ZW0udGVuc2lvbiA8IDEwKTtcbn0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSwgU2NhbGVUZW1wbGF0ZXMgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgU291cmNlTWVhc3VyZSB9IGZyb20gXCJvcGVuc2hlZXRtdXNpY2Rpc3BsYXlcIjtcbmltcG9ydCB7IFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuY29uc3QgYnVpbGRUcmlhZE9uID0gKHNlbWl0b25lOiBudW1iZXIsIHNjYWxlOiBTY2FsZSk6IENob3JkIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc2NhbGVJbmRleCA9IHNjYWxlLm5vdGVzLmZpbmRJbmRleChub3RlID0+IG5vdGUuc2VtaXRvbmUgPT09IHNlbWl0b25lKTtcbiAgICBpZiAoIXNjYWxlSW5kZXggfHwgc2NhbGVJbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5vdGUwU2VtaXRvbmUgPSBzY2FsZS5ub3Rlc1soc2NhbGVJbmRleCArIDApICUgN10uc2VtaXRvbmU7XG4gICAgY29uc3Qgbm90ZTFTZW1pdG9uZSA9IHNjYWxlLm5vdGVzWyhzY2FsZUluZGV4ICsgMikgJSA3XS5zZW1pdG9uZTtcbiAgICBjb25zdCBub3RlMlNlbWl0b25lID0gc2NhbGUubm90ZXNbKHNjYWxlSW5kZXggKyA0KSAlIDddLnNlbWl0b25lO1xuXG4gICAgbGV0IGNob3JkVHlwZSA9ICcnO1xuICAgIGlmIChzZW1pdG9uZURpc3RhbmNlKG5vdGUwU2VtaXRvbmUsIG5vdGUxU2VtaXRvbmUpID09PSA0KSB7XG4gICAgICAgIGNob3JkVHlwZSA9ICdtYWonO1xuICAgIH0gZWxzZSBpZiAoc2VtaXRvbmVEaXN0YW5jZShub3RlMFNlbWl0b25lLCBub3RlMVNlbWl0b25lKSA9PT0gMykge1xuICAgICAgICBjaG9yZFR5cGUgPSAnbWluJztcbiAgICAgICAgaWYgKHNlbWl0b25lRGlzdGFuY2Uobm90ZTFTZW1pdG9uZSwgbm90ZTJTZW1pdG9uZSkgPT09IDMpIHtcbiAgICAgICAgICAgIGNob3JkVHlwZSA9ICdkaW0nO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghY2hvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZChub3RlMFNlbWl0b25lLCBjaG9yZFR5cGUpO1xuICAgIHJldHVybiBjaG9yZDtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgb3JpZ2luYWxTY2FsZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nLFxuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgbWFpblBhcmFtcyxcbiAgICAgICAgICAgIGJlYXREaXZpc2lvbixcbiAgICAgICAgfSA9IHZhbHVlcztcbiAgICAvKlxuICAgIFxuICAgIEJhc2ljIGNpcmNsZSBvZiA1dGhzIHByb2dyZXNzaW9uOlxuXG4gICAgaWlpICAgICAgXG4gICAgdmkgICAgICAgICAoRGVjZXB0aXZlIHRvbmljKVxuICAgIGlpIDwtIElWICAgKFN1YmRvbWluYW50IGZ1bmN0aW9uKVxuICAgIFYgIC0+IHZpaSAgKERvbWluYW50IGZ1bmN0aW9uKVxuICAgIEkgICAgICAgICAgKFRvbmljIGZ1bmN0aW9uKVxuXG4gICAgQWRkaXRpb25hbGx5OlxuICAgIFYgLT4gdmkgaXMgdGhlIGRlY2VwdGl2ZSBjYWRlbmNlXG4gICAgSVYgLT4gSSBpcyB0aGUgcGxhZ2FsIGNhZGVuY2VcbiAgICBpaWkgLT4gSVYgaXMgYWxsb3dlZC5cblxuICAgIE9uY2Ugd2UgaGF2ZSBzdWJkb21pbmFudCBvciBkb21pbmFudCBjaG9yZHMsIHRoZXJlJ3Mgbm8gZ29pbmcgYmFjayB0byBpaWkgb3IgdmkuXG5cbiAgICBJIHdhbnQgdG8gY2hlY2sgcGFjaGVsYmVsIGNhbm9uIHByb2dyZXNzaW9uOlxuICAgICAgT0sgICBkZWNlcHRpdmU/ICAgbWF5YmUgc2luY2Ugbm8gZnVuY3Rpb24gICAgIE9LICAgIE9LIGlmIGl0cyBpNjQgICBPayBiZWNhdXNlIGl0cyB0b25pYy4gT0sgICBPS1xuICAgIEkgLT4gViAgICAtPiAgICAgdmkgICAgICAgICAtPiAgICAgICAgICAgICAgaWlpIC0+IElWICAgICAtPiAgICAgICAgSSAgICAgICAgIC0+ICAgICAgICBJViAgLT4gViAtPiBJXG5cbiAgICAqL1xuICAgIGNvbnN0IHByb2dyZXNzaW9uQ2hvaWNlczogeyBba2V5OiBzdHJpbmddOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgbnVsbCB9ID0ge1xuICAgICAgICAwOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIC8vIEkgY2FuIGdvIGFueXdoZXJlXG4gICAgICAgIDE6IFsnZG9taW5hbnQnLCBdLCAgICAgICAgICAgLy8gaWkgY2FuIGdvIHRvIFYgb3IgdmlpIG9yIGRvbWluYW50XG4gICAgICAgIDI6IFs1LCAzXSwgICAgICAgICAgICAgICAgICAgLy8gaWlpIGNhbiBnbyB0byB2aSBvciBJVlxuICAgICAgICAzOiBbMSwgMiwgJ2RvbWluYW50J10sICAgICAgIC8vIElWIGNhbiBnbyB0byBJLCBpaSBvciBkb21pbmFudFxuICAgICAgICA0OiBbJ3RvbmljJywgNiwgJ2RvbWluYW50J10sIC8vLCA1XSwgLy8gViBjYW4gZ28gdG8gSSwgdmlpIG9yIGRvbWluYW50IG9yIHZpICBERUNFUFRJVkUgSVMgRElTQUJMRUQgRk9SIE5PV1xuICAgICAgICA1OiBbJ3N1Yi1kb21pbmFudCcsIDJdLCAgICAgIC8vIHZpIGNhbiBnbyB0byBpaSwgSVYsIChvciBpaWkpXG4gICAgICAgIDY6IFsndG9uaWMnXSwgICAgICAgICAgICAgICAgLy8gdmlpIGNhbiBnbyB0byBJXG4gICAgfVxuICAgIGxldCB3YW50ZWRGdW5jdGlvbjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHRyeVRvR2V0TGVhZGluZ1RvbmVJblBhcnQwID0gZmFsc2U7XG4gICAgbGV0IHBhcnQwTXVzdEJlVG9uaWMgPSBmYWxzZTtcblxuICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlICYmIGludmVyc2lvbk5hbWUpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJQQUNcIikge1xuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gNSkge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgICAgICB0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgICAgICAgICBwYXJ0ME11c3RCZVRvbmljID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgIWludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IFwiY2FkZW5jZSBQQUM6IE5PVCByb290IGludmVyc2lvbiEgXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiSUFDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDUpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAvLyBOb3Qgcm9vdCBpbnZlcnNpb25cbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gXCJjYWRlbmNlIElBQzogcm9vdCBpbnZlcnNpb24hIFwiO1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIkhDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDIpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZTY2FsZTogU2NhbGUgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgICAgIHByZXZTY2FsZSA9IHJpY2hOb3RlLnNjYWxlO1xuICAgICAgICB9XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2UHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBmb3IgKGxldCBpPWJlYXREaXZpc2lvbjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlcy5ldmVyeShCb29sZWFuKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwcmV2Q2hvcmQpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmcm9tTm90ZXNPdmVycmlkZSkge1xuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBmcm9tTm90ZXNPdmVycmlkZTtcbiAgICB9XG5cbiAgICBsZXQgZnJvbU5vdGVzO1xuICAgIGlmIChwYXNzZWRGcm9tTm90ZXMubGVuZ3RoIDwgNCkge1xuICAgICAgICBmcm9tTm90ZXMgPSB0b05vdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHBhc3NlZEZyb21Ob3RlcztcbiAgICB9XG5cbiAgICBjb25zdCBnZXRQb3NzaWJsZUZ1bmN0aW9ucyA9IChjaG9yZDogQ2hvcmQsIHNjYWxlOiBTY2FsZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICAgICAgW3NjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICAgICAgW3NjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgICAgICAvLyBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb290U2VtaXRvbmUgPSBjaG9yZC5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgY29uc3Qgcm9vdFNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXhbcm9vdFNlbWl0b25lXTtcblxuICAgICAgICBjb25zdCBwb3NzaWJsZVRvRnVuY3Rpb25zOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHtcbiAgICAgICAgICAgICd0b25pYyc6IDAsXG4gICAgICAgICAgICAnc3ViLWRvbWluYW50JzogMCxcbiAgICAgICAgICAgICdkb21pbmFudCc6IDAsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvb3RTY2FsZUluZGV4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwMDtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnNbJ3N1Yi1kb21pbmFudCddID0gMTAwO1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVsxLCAzXS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHsgLy8gaWksIElWXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zW1wic3ViLWRvbWluYW50XCJdID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghWzAsIDQsIDZdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBWLCB2aWksIEk2NFxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IDEwMDtcbiAgICAgICAgfSBlbHNlIGlmIChyb290U2NhbGVJbmRleCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiBJIGlzIG5vdCBzZWNvbmQgaW52ZXJzaW9uLCBpdCdzIG5vdCBkb21pbmFudFxuICAgICAgICAgICAgaWYgKCFpbnZlcnNpb25OYW1lIHx8ICFpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSA2OyAgLy8gVHJ5IHRvIGF2b2lkIEk2NFxuICAgICAgICB9XG4gICAgICAgIGlmICghWzBdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBJXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhbid0IGhhdmUgdG9uaWMgd2l0aCBub24tc2NhbGUgbm90ZXNcbiAgICAgICAgaWYgKGNob3JkLm5vdGVzLnNvbWUobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0gPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYW50IGhhdmUgdG9uaWMgaW4gc2Vjb25kIGludmVyc2lvbi5cbiAgICAgICAgaWYgKGludmVyc2lvbk5hbWUgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb290U2NhbGVJbmRleCxcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnM6IHBvc3NpYmxlVG9GdW5jdGlvbnMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcblxuICAgIC8vIElmIHRoZSBub3RlcyBhcmUgbm90IGluIHRoZSBjdXJyZW50IHNjYWxlLCBpbmNyZWFzZSB0aGUgdGVuc2lvblxuICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTJcblxuICAgIGlmICh0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCAmJiB0b0dsb2JhbFNlbWl0b25lc1swXSAlIDEyICE9IGxlYWRpbmdUb25lKSB7XG4gICAgICAgIC8vIGluIFBBQywgd2Ugd2FudCB0aGUgbGVhZGluZyB0b25lIGluIHBhcnQgMCBpbiB0aGUgZG9taW5hbnRcbiAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsICAvLyBEXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLCAgLy8gRVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsICAvLyBHXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LCAgLy8gQVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgLy8gWyhjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgLSAxICsgMjQpICUgMTJdOiA2ICAvLyBGb3JjZSBhZGQgbGVhZGluZyB0b25lXG4gICAgfVxuICAgIGNvbnN0IHRvU2NhbGVJbmRleGVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0pO1xuXG4gICAgaWYgKHBhcnQwTXVzdEJlVG9uaWMgJiYgdG9TY2FsZUluZGV4ZXNbMF0gIT0gMCkge1xuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gXCJwYXJ0IDAgbXVzdCBiZSB0b25pYyEgXCI7XG4gICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRDaG9yZHNUZW5zaW9uID0gKG5ld0Nob3JkOiBDaG9yZCB8IHVuZGVmaW5lZCwgcHJldkNob3JkOiBDaG9yZCB8IHVuZGVmaW5lZCwgcHJldlByZXZDaG9yZDogQ2hvcmQgfCB1bmRlZmluZWQsIGN1cnJlbnRTY2FsZTogU2NhbGUpID0+IHtcbiAgICAgICAgY29uc3QgdGVuc2lvbiA9IHtcbiAgICAgICAgICAgIGNhZGVuY2U6IDAsXG4gICAgICAgICAgICBjb21tZW50OiBcIlwiLFxuICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvbjogMCxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgICAgIC8vIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0Nob3JkICYmIHByZXZDaG9yZCAmJiBwcmV2UHJldkNob3JkKSB7XG4gICAgICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgPT0gcHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgLy8gU2FtZSByb290XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FtZSByb290IGFzIHByZXZpb3VzIGNob3JkXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBTYW1lIHJvb3QgYXMgcHJldmlvdXMgY2hvcmQgKERvbid0IGdvIGJhY2spXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3Q2hvcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3RTZW1pdG9uZSA9IG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lO1xuICAgICAgICAgICAgY29uc3Qgcm9vdFNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXhbcm9vdFNlbWl0b25lXTtcbiAgICAgICAgICAgIGlmIChuZXdDaG9yZC5jaG9yZFR5cGUuaW5jbHVkZXMoJ2RvbTcnKSkge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgYWxsb3cgaW5kZXggaWkgYW5kIFYgZm9yIG5vdy5cbiAgICAgICAgICAgICAgICBpZiAoIVsxLCA0XS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdDaG9yZCAmJiBwcmV2Q2hvcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21GdW5jdGlvbnMgPSBnZXRQb3NzaWJsZUZ1bmN0aW9ucyhwcmV2Q2hvcmQsIGN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBjb25zdCB0b0Z1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKG5ld0Nob3JkLCBjdXJyZW50U2NhbGUpO1xuICAgICAgICAgICAgY29uc3QgcG9zc2libGVUb0Z1bmN0aW9ucyA9IHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnM7XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzaW9ucyA9IHByb2dyZXNzaW9uQ2hvaWNlc1tmcm9tRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4XTtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZ29vZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4ID09IHRvRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGRvbWluYW50VG9Eb21pbmFudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvZ3Jlc3Npb24gb2YgcHJvZ3Jlc3Npb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChgJHtwcm9ncmVzc2lvbn1gID09IGAke3RvRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4fWApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZlY3QgcHJvZ3Jlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9ncmVzc2lvbiA9PSBcInN0cmluZ1wiICYmIHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnMgJiYgdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9uc1twcm9ncmVzc2lvbl0gIT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSB0b0Z1bmN0aW9ucy5wb3NzaWJsZVRvRnVuY3Rpb25zW3Byb2dyZXNzaW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc2lvbiA9PSBcImRvbWluYW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21pbmFudFRvRG9taW5hbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFnb29kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMTQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UncmUgbW92aW5nIGZyb20gXCJkb21pbmFudFwiIHRvIFwiZG9taW5hbnRcIiwgd2UgbmVlZCB0byBwcmV2ZW50IFwibGVzc2VuaW5nIHRoZSB0ZW5zaW9uXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbWluYW50VG9Eb21pbmFudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZDaG9yZFRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0Nob3JkVGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChjdXJyZW50U2NhbGUua2V5IC0gMSArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9uaWNOb3RlcyA9IFtjdXJyZW50U2NhbGUubm90ZXNbMF0sIGN1cnJlbnRTY2FsZS5ub3Rlc1syXSwgY3VycmVudFNjYWxlLm5vdGVzWzRdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiBwcmV2Q2hvcmQubm90ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFYWNoIG5vdGUgbm90IGluIHRvbmljIG5vdGVzIGFkZHMgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlYWRpbmcgdG9uZSBhZGRzIG1vcmUgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9uaWNOb3Rlcy5zb21lKHRvbmljTm90ZSA9PiB0b25pY05vdGUuc2VtaXRvbmUgPT0gbm90ZS5zZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNob3JkVGVuc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSBsZWFkaW5nVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2hvcmRUZW5zaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIG5ld0Nob3JkLm5vdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWFjaCBub3RlIG5vdCBpbiB0b25pYyBub3RlcyBhZGRzIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZWFkaW5nIHRvbmUgYWRkcyBtb3JlIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvbmljTm90ZXMuc29tZSh0b25pY05vdGUgPT4gdG9uaWNOb3RlLnNlbWl0b25lID09IG5vdGUuc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nob3JkVGVuc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSBsZWFkaW5nVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDaG9yZFRlbnNpb24gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hvcmRUZW5zaW9uIDwgcHJldkNob3JkVGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxNztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZ3Jlc3Npb25zICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJzdWItZG9taW5hbnRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVUb0Z1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSA9PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZVRvRnVuY3Rpb25zW1wiZG9taW5hbnRcIl0gPT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IGBXYW50ZWQgJHt3YW50ZWRGdW5jdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDE7ICAvLyBEb21pbmFudCBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcImRvbWluYW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlVG9GdW5jdGlvbnNbXCJkb21pbmFudFwiXSA9PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBgV2FudGVkICR7d2FudGVkRnVuY3Rpb259YFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJ0b25pY1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZVRvRnVuY3Rpb25zW1widG9uaWNcIl0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gYFdhbnRlZCAke3dhbnRlZEZ1bmN0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIlBBQ1wiKSB7XG4gICAgICAgICAgICAvLyBTaW5jZSBQQUMgaXMgc28gaGFyZCwgbGV0cyBsb29zZW4gdXAgdGhlIHJ1bGVzIGEgYml0XG4gICAgICAgICAgICBpZiAodGVuc2lvbi5jYWRlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgPSAtMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG4gICAgbGV0IHRlbnNpb25SZXN1bHQgPSB7XG4gICAgICAgIGNob3JkUHJvZ3Jlc3Npb246IDExMixcbiAgICAgICAgY2FkZW5jZTogMCxcbiAgICAgICAgY29tbWVudDogXCJcIlxuICAgIH07XG4gICAgbGV0IHByZXZDaG9yZElzVG9uaWNpemVkID0gZmFsc2U7XG4gICAgbGV0IG5ld0Nob3JkSXNTZWNvbmRhcnlEb21pbmFudCA9IGZhbHNlO1xuICAgIGNvbnN0IGNhZGVuY2VJc05lYXIgPSB3YW50ZWRGdW5jdGlvbiB8fCAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSB8fCAwKSA8IDU7XG4gICAgaWYgKHByZXZDaG9yZCAmJiBwcmV2U2NhbGUpIHtcbiAgICAgICAgaWYgKHByZXZDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgIHByZXZDaG9yZElzVG9uaWNpemVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobmV3Q2hvcmQgJiYgY3VycmVudFNjYWxlICYmIG9yaWdpbmFsU2NhbGUpIHtcbiAgICAgICAgLy8gQ2hvcmQgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBub3RlIG5vdCBpbiB0aGUgb3JpZ2luYWwgc2NhbGVcbiAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzLnNvbWUobm90ZSA9PiAhb3JpZ2luYWxTY2FsZS5ub3Rlcy5zb21lKHNjYWxlTm90ZSA9PiBzY2FsZU5vdGUuc2VtaXRvbmUgPT0gbm90ZS5zZW1pdG9uZSkpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdDaG9yZEZ1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKG5ld0Nob3JkLCBjdXJyZW50U2NhbGUpO1xuICAgICAgICAgICAgaWYgKG5ld0Nob3JkRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPCAxMDAgfHwgbmV3Q2hvcmRGdW5jdGlvbnMucm9vdFNjYWxlSW5kZXggPT0gMSkge1xuICAgICAgICAgICAgICAgIG5ld0Nob3JkSXNTZWNvbmRhcnlEb21pbmFudCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJldlNjYWxlICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSAmJiBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgIT0gcHJldlNjYWxlLnRvU3RyaW5nKCkgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgIT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gQ2FuJ3QgbW9kdWxhdGUgZHVyaW5nIGEgbW9kdWxhdGlvblxuICAgIH0gZWxzZSBpZiAobmV3Q2hvcmQgJiYgcHJldlNjYWxlICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSAmJiBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgPT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgaWYgKCFjYWRlbmNlSXNOZWFyICYmIG5ld0Nob3JkSXNTZWNvbmRhcnlEb21pbmFudCAmJiAhcHJldkNob3JkSXNUb25pY2l6ZWQpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgY2hvcmQgd291bGQgYWxsb3cgbW92aW5nIHRvIGEgbmV3IHNjYWxlIHRlbXBvcmFyaWx5IChhIGRvbWluYW50IGZ1bmN0aW9uIGF0IG1vc3QpXG4gICAgICAgICAgICAvLyBUaGUgdGVuc2lvbiBpcyBub3cgYWN0dWFsbHkgYmV0d2VlbiB0aGUgdG9uaWNpemVkIGNob3JkIGFuZCB0aGUgcHJldmlvdXMgY2hvcmQsICppbiB0aGUgcHJldmlvdXMgc2NhbGUqIVxuICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChbJ2RvbTcnXS5pbmNsdWRlcyhuZXdDaG9yZC5jaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlmdGhEb3duRnJvbU5ld0Nob3JkUm9vdCA9IChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSAtIDcgKyAyNCkgJSAxMjtcbiAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZCA9IGJ1aWxkVHJpYWRPbihmaWZ0aERvd25Gcm9tTmV3Q2hvcmRSb290LCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgPSB0b25pY2l6ZWRDaG9yZD8ubm90ZXNbMF0uc2VtaXRvbmUgPT0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lO1xuICAgICAgICAgICAgICAgIGlmICh0b25pY2l6ZWRDaG9yZCAmJiB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlICYmIFsnbWFqJywgJ21pbiddLmluY2x1ZGVzKHRvbmljaXplZENob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKHRvbmljaXplZENob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIHByZXZTY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUZW5zaW9uIGZyb20gdG9uaWNpemVkIGNob3JkXCIsIHRlbnNpb25SZXN1bHQsIFwidG9cIiwgdG9uaWNpemVkQ2hvcmQudG9TdHJpbmcoKSwgXCJmcm9tXCIsIHByZXZDaG9yZD8udG9TdHJpbmcoKSwgXCJpblwiLCBwcmV2U2NhbGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFsnZGltNyddLmluY2x1ZGVzKG5ld0Nob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVVcEZyb21OZXdDaG9yZFJvb3QgPSAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgKyAxICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkID0gYnVpbGRUcmlhZE9uKHNlbWl0b25lVXBGcm9tTmV3Q2hvcmRSb290LCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlID0gdG9uaWNpemVkQ2hvcmQ/Lm5vdGVzWzBdLnNlbWl0b25lID09IGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvbmljaXplZENob3JkICYmIHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgJiYgWydtYWonLCAnbWluJ10uaW5jbHVkZXModG9uaWNpemVkQ2hvcmQuY2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0ID0gZ2V0Q2hvcmRzVGVuc2lvbih0b25pY2l6ZWRDaG9yZCwgcHJldkNob3JkLCBwcmV2UHJldkNob3JkLCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRlbnNpb24gZnJvbSB0b25pY2l6ZWQgY2hvcmRcIiwgdGVuc2lvblJlc3VsdCwgXCJ0b1wiLCB0b25pY2l6ZWRDaG9yZC50b1N0cmluZygpLCBcImZyb21cIiwgcHJldkNob3JkPy50b1N0cmluZygpLCBcImluXCIsIHByZXZTY2FsZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICAgICAgICAgIGlmIChbJ21pbjcnXS5pbmNsdWRlcyhuZXdDaG9yZC5jaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR3b1NlbWl0b25lc0Rvd25Gcm9tTmV3Q2hvcmRSb290ID0gKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lIC0gMiArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZCA9IGJ1aWxkVHJpYWRPbih0d29TZW1pdG9uZXNEb3duRnJvbU5ld0Nob3JkUm9vdCwgcHJldlNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9uaWNpemVkQ2hvcmRJc0lPZkN1cnJlbnRTY2FsZSA9IHRvbmljaXplZENob3JkPy5ub3Rlc1swXS5zZW1pdG9uZSA9PSBjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b25pY2l6ZWRDaG9yZCAmJiB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlICYmIFsnbWFqJywgJ21pbiddLmluY2x1ZGVzKHRvbmljaXplZENob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24odG9uaWNpemVkQ2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgcHJldlNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUZW5zaW9uIGZyb20gdG9uaWNpemVkIGNob3JkXCIsIHRlbnNpb25SZXN1bHQsIFwidG9cIiwgdG9uaWNpemVkQ2hvcmQudG9TdHJpbmcoKSwgXCJmcm9tXCIsIHByZXZDaG9yZD8udG9TdHJpbmcoKSwgXCJpblwiLCBwcmV2U2NhbGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5ld0Nob3JkICYmIHByZXZTY2FsZSAmJiBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSAhPSBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgPT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gSWYgd2UgYXJlIGhlcmUsIHRoZSBtb2R1bGF0ZWQgcHJvZ3Jlc3Npb24gaXMgZ29pbmcgb24gc3RpbGwuIElmIHByZXZDaG9yZCBpcyBhIHRvbmljLCB3ZSBjYW4ndCBhbGxvdyBhbnl0aGluZyBpbiB0aGlzIG5ldyBzY2FsZS5cbiAgICAgICAgaWYgKHByZXZDaG9yZElzVG9uaWNpemVkIHx8IGNhZGVuY2VJc05lYXIpIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvbjogMTAxLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IFwiVG9uaWNpemVkIGNob3JkIHJlYWNoZWQsIGNhbid0IGFsbG93IGFueXRoaW5nIGluIHRoaXMgbmV3IHNjYWxlXCIsXG4gICAgICAgICAgICAgICAgY2FkZW5jZTogMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKG5ld0Nob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIHByZXZTY2FsZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCF3YW50ZWRGdW5jdGlvbiAmJiBuZXdDaG9yZCAmJiBwcmV2U2NhbGUgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgPT0gb3JpZ2luYWxTY2FsZS50b1N0cmluZygpICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IHByZXZTY2FsZS50b1N0cmluZygpKSB7XG4gICAgICAgIC8vIElmIHdlIGFyZSBoZXJlLCB0aGUgbW9kdWxhdGVkIHByb2dyZXNzaW9uIGlzIG92ZXIuIElmIHByZXZDaG9yZCBpcyBhIHRvbmljIGluIHRoZSBwcmV2aW91cyBzY2FsZSwgd2UgY2FuIGNvbnRpbnVlIGluIHRoZSBvcmlnaW5hbCBzY2FsZS5cbiAgICAgICAgaWYgKHByZXZDaG9yZElzVG9uaWNpemVkICYmIG5ld0Nob3JkLm5vdGVzLmV2ZXJ5KG5vdGUgPT4gY3VycmVudFNjYWxlLm5vdGVzLnNvbWUoc2NhbGVOb3RlID0+IHNjYWxlTm90ZS5zZW1pdG9uZSA9PSBub3RlLnNlbWl0b25lKSkpIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKG5ld0Nob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIGN1cnJlbnRTY2FsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW5zaW9uUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIGNob3JkUHJvZ3Jlc3Npb246IDEwMixcbiAgICAgICAgICAgICAgICBjb21tZW50OiBcIk1vZHVsYXRlZCBwcm9ncmVzc2lvbiBoYXMgbm90IGVuZGVkLCBjYW4ndCBhbGxvdyBhbnl0aGluZyBpbiB0aGUgb3JpZ2luYWwgc2NhbGVcIixcbiAgICAgICAgICAgICAgICBjYWRlbmNlOiAwLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh3YW50ZWRGdW5jdGlvbiAmJiBwcmV2U2NhbGUgJiYgKHByZXZTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgLy8gT2ggbm9lcywgd2UgYXJlIGluIGEgbW9kdWxhdGVkIHByb2dyZXNzaW9uIGFuZCB0aGUgY2FkZW5jZSBzdGFydGVkLiBUaGlzIHdpbGwgbm90IGRvXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24obmV3Q2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgY3VycmVudFNjYWxlKTtcbiAgICB9XG4gICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uID0gdGVuc2lvblJlc3VsdC5jaG9yZFByb2dyZXNzaW9uO1xuICAgIHRlbnNpb24uY29tbWVudCArPSB0ZW5zaW9uUmVzdWx0LmNvbW1lbnQ7XG4gICAgdGVuc2lvbi5jYWRlbmNlICs9IHRlbnNpb25SZXN1bHQuY2FkZW5jZTtcbn1cbiIsImltcG9ydCB7XG4gICAgYnVpbGRUYWJsZXMsXG4gICAgU2NhbGUsXG4gICAgTm90ZSxcbn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBDaG9yZCwgTnVsbGFibGUsIERpdmlzaW9uZWRSaWNobm90ZXMsIFJpY2hOb3RlLCBCRUFUX0xFTkdUSCwgc2VtaXRvbmVTY2FsZUluZGV4IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFJhbmRvbUNob3JkR2VuZXJhdG9yIH0gZnJvbSBcIi4vcmFuZG9tY2hvcmRzXCI7XG5pbXBvcnQgeyBnZXRJbnZlcnNpb25zIH0gZnJvbSBcIi4vaW52ZXJzaW9uc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgbWFrZVRlbnNpb24sIFRlbnNpb24sIFRlbnNpb25FcnJvciB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IGFkZE5vdGVCZXR3ZWVuLCBidWlsZFRvcE1lbG9keSB9IGZyb20gXCIuL25vbmNob3JkdG9uZXNcIjtcbmltcG9ydCB7IGFkZEhhbGZOb3RlcyB9IGZyb20gXCIuL2hhbGZub3Rlc1wiO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlU2NhbGVzIH0gZnJvbSBcIi4vYXZhaWxhYmxlc2NhbGVzXCI7XG5pbXBvcnQgeyBhZGRGb3JjZWRNZWxvZHksIEZvcmNlZE1lbG9keVJlc3VsdCB9IGZyb20gXCIuL2ZvcmNlZG1lbG9keVwiO1xuaW1wb3J0ICogYXMgdGltZSBmcm9tIFwiLi90aW1lclwiOyBcbmltcG9ydCB7IGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uIH0gZnJvbSBcIi4vY2hvcmRwcm9ncmVzc2lvblwiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBnb29kU291bmRpbmdTY2FsZVRlbnNpb24gfSBmcm9tIFwiLi9nb29kc291bmRpbmdzY2FsZVwiO1xuXG5jb25zdCBHT09EX0NIT1JEX0xJTUlUID0gMTAwMDtcbmNvbnN0IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCA9IDEwMDtcbmNvbnN0IEJBRF9DSE9SRF9MSU1JVCA9IDIwMDtcbmNvbnN0IEJBRF9DSE9SRFNfUEVSX0NIT1JEID0gMTA7XG5cbnR5cGUgQmFkQ2hvcmQgPSB7XG4gICAgdGVuc2lvbjogVGVuc2lvbiwgY2hvcmQ6IHN0cmluZywgc2NhbGU6IFNjYWxlXG59XG5cbmNvbnN0IHNsZWVwTVMgPSBhc3luYyAobXM6IG51bWJlcik6IFByb21pc2U8bnVsbD4gPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuY29uc3QgbWFrZUNob3JkcyA9IGFzeW5jIChtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpOiBQcm9taXNlPERpdmlzaW9uZWRSaWNobm90ZXM+ID0+IHtcbiAgICAvLyBnZW5lcmF0ZSBhIHByb2dyZXNzaW9uXG4gICAgLy8gVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyB0aGUgZW50aXJlIHNvbmcuXG4gICAgLy8gVGhlIGJhc2ljIGlkZWEgaXMgdGhhdCBcblxuICAgIC8vIFVudGlsIHRoZSBmaXJzdCBJQUMgb3IgUEFDLCBtZWxvZHkgYW5kIHJoeXRtIGlzIHJhbmRvbS4gKFRob3VnaCBlYWNoIGNhZGVuY2UgaGFzIGl0J3Mgb3duIG1lbG9kaWMgaGlnaCBwb2ludC4pXG5cbiAgICAvLyBUaGlzIG1lbG9keSBhbmQgcmh5dG0gaXMgcGFydGlhbGx5IHNhdmVkIGFuZCByZXBlYXRlZCBpbiB0aGUgbmV4dCBjYWRlbmNlcy5cbiAgICBjb25zdCBtYXhCZWF0cyA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcblxuICAgIGxldCByZXN1bHQ6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcbiAgICBsZXQgb3JpZ2luYWxTY2FsZTogU2NhbGU7XG5cbiAgICBsZXQgZGl2aXNpb25CYW5uZWROb3Rlczoge1trZXk6IG51bWJlcl06IEFycmF5PEFycmF5PE5vdGU+Pn0gPSB7fVxuICAgIGxldCBkaXZpc2lvbkJhbkNvdW50OiB7W2tleTogbnVtYmVyXTogbnVtYmVyfSA9IHt9XG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IHByZXZSZXN1bHQgPSByZXN1bHRbZGl2aXNpb24gLSBCRUFUX0xFTkdUSF07XG4gICAgICAgIGxldCBwcmV2Q2hvcmQgPSBwcmV2UmVzdWx0ID8gcHJldlJlc3VsdFswXS5jaG9yZCA6IG51bGw7XG4gICAgICAgIGxldCBwcmV2Tm90ZXM6IE5vdGVbXTtcbiAgICAgICAgbGV0IHByZXZJbnZlcnNpb25OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBjdXJyZW50U2NhbGU6IFNjYWxlIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgYmFubmVkTm90ZXNzID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbl07XG4gICAgICAgIGlmIChwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICBwcmV2Tm90ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgcHJldlJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSA9IHJpY2hOb3RlLmludmVyc2lvbk5hbWU7XG4gICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKCFvcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGUgPSBjdXJyZW50U2NhbGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZSA9IGN1cnJlbnRTY2FsZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1haW5QYXJhbXMuZm9yY2VkT3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTY2FsZSA9IG1haW5QYXJhbXMuZm9yY2VkT3JpZ2luYWxTY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG9yaWdpbmFsU2NhbGUgPSBvcmlnaW5hbFNjYWxlIGFzIFNjYWxlO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHByZXZOb3RlcyA9IHByZXZOb3RlcztcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZDtcblxuICAgICAgICBjb25zdCBjdXJyZW50QmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG5cbiAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZChcImRpdmlzaW9uXCIsIGRpdmlzaW9uLCBcImJlYXRcIiwgY3VycmVudEJlYXQsIHByZXZDaG9yZCA/IHByZXZDaG9yZC50b1N0cmluZygpIDogXCJudWxsXCIsIFwiIHNjYWxlIFwiLCBjdXJyZW50U2NhbGUgPyBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA6IFwibnVsbFwiLCBwcmV2UmVzdWx0ICYmIHByZXZSZXN1bHRbMF0/LnRlbnNpb24gPyBwcmV2UmVzdWx0WzBdLnRlbnNpb24udG9QcmludCgpIDogXCJcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVwiLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlKTtcblxuICAgICAgICBjb25zdCByYW5kb21HZW5lcmF0b3IgPSBuZXcgUmFuZG9tQ2hvcmRHZW5lcmF0b3IocGFyYW1zKVxuICAgICAgICBsZXQgbmV3Q2hvcmQ6IE51bGxhYmxlPENob3JkPiA9IG51bGw7XG5cbiAgICAgICAgbGV0IGdvb2RDaG9yZHM6IFJpY2hOb3RlW11bXSA9IFtdXG4gICAgICAgIGNvbnN0IGJhZENob3JkczogQmFkQ2hvcmRbXSA9IFtdXG5cbiAgICAgICAgY29uc3QgcmFuZG9tTm90ZXM6IEFycmF5PE5vdGU+ID0gW107XG5cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICBsZXQgc2tpcExvb3AgPSBmYWxzZTtcblxuICAgICAgICBpZiAocGFyYW1zLmJlYXRzVW50aWxBdXRoZW50aWNDYWRlbmNlRW5kID09IDEgJiYgcHJldk5vdGVzKSB7XG4gICAgICAgICAgICAvLyBGb3JjZSBzYW1lIGNob3JkIHR3aWNlXG4gICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSgwLCBnb29kQ2hvcmRzLmxlbmd0aCk7XG4gICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocHJldk5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogQkVBVF9MRU5HVEgsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IHByZXZDaG9yZCxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBvcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSkpKTtcbiAgICAgICAgICAgIHNraXBMb29wID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghc2tpcExvb3AgJiYgZ29vZENob3Jkcy5sZW5ndGggPCAoY3VycmVudEJlYXQgIT0gMCA/IEdPT0RfQ0hPUkRfTElNSVQgOiA1KSkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgICAgbmV3Q2hvcmQgPSByYW5kb21HZW5lcmF0b3IuZ2V0Q2hvcmQoKTtcbiAgICAgICAgICAgIGNvbnN0IGNob3JkTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwMDAgfHwgIW5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRvbyBtYW55IGl0ZXJhdGlvbnM6ICR7aXRlcmF0aW9uc30sIGdvaW5nIGJhY2tgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYWluUGFyYW1zLmZvcmNlZENob3JkcyAmJiBvcmlnaW5hbFNjYWxlICYmIG5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9yY2VkQ2hvcmROdW0gPSBwYXJzZUludChtYWluUGFyYW1zLmZvcmNlZENob3Jkc1tjdXJyZW50QmVhdF0pO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4oZm9yY2VkQ2hvcmROdW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZW1pdG9uZVNjYWxlSW5kZXgob3JpZ2luYWxTY2FsZSlbbmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmVdICE9IChmb3JjZWRDaG9yZE51bSAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBhbGxJbnZlcnNpb25zO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZVNjYWxlcztcblxuICAgICAgICAgICAgYXZhaWxhYmxlU2NhbGVzID0gZ2V0QXZhaWxhYmxlU2NhbGVzKHtcbiAgICAgICAgICAgICAgICBsYXRlc3REaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzOiBuZXdDaG9yZC5ub3RlcyxcbiAgICAgICAgICAgICAgICBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2NhbGUgJiYgKG1heEJlYXRzIC0gY3VycmVudEJlYXQgPCAzIHx8IGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzIHx8IGN1cnJlbnRCZWF0IDwgNSkpIHtcbiAgICAgICAgICAgICAgICAvLyBEb24ndCBhbGxvdyBvdGhlciBzY2FsZXMgdGhhbiB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBhdmFpbGFibGVTY2FsZXMuZmlsdGVyKHMgPT4gcy5zY2FsZS5lcXVhbHMoY3VycmVudFNjYWxlIGFzIFNjYWxlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXZhaWxhYmxlU2NhbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGF2YWlsYWJsZVNjYWxlIG9mIGF2YWlsYWJsZVNjYWxlcykge1xuICAgICAgICAgICAgICAgIGFsbEludmVyc2lvbnMgPSBnZXRJbnZlcnNpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLCBwcmV2Tm90ZXM6IHByZXZOb3RlcywgYmVhdDogY3VycmVudEJlYXQsIHBhcmFtcywgbG9nZ2VyOiBuZXcgTG9nZ2VyKGNob3JkTG9nZ2VyKSxcbiAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbWF4QmVhdHMgLSBjdXJyZW50QmVhdFxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBsZXQgc3RvcEludmVyc2lvbkxvb3AgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW52ZXJzaW9uUmVzdWx0IG9mIGFsbEludmVyc2lvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3BJbnZlcnNpb25Mb29wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52ZXJzaW9uTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIudGl0bGUgPSBbXCJJbnZlcnNpb24gXCIsIGAke2ludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lfWBdO1xuICAgICAgICAgICAgICAgICAgICByYW5kb21Ob3Rlcy5zcGxpY2UoMCwgcmFuZG9tTm90ZXMubGVuZ3RoKTsgIC8vIEVtcHR5IHRoaXMgYW5kIHJlcGxhY2UgY29udGVudHNcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tTm90ZXMucHVzaCguLi5pbnZlcnNpb25SZXN1bHQubm90ZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXNzICYmIGJhbm5lZE5vdGVzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFubmVkTm90ZXMgb2YgYmFubmVkTm90ZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZE5vdGVzLmxlbmd0aCAhPSByYW5kb21Ob3Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kb21Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tTm90ZXNbaV0udG9TdHJpbmcoKSAhPSBiYW5uZWROb3Rlc1tpXS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFubmVkIG5vdGVzXCIsIHJhbmRvbU5vdGVzLm1hcChuID0+IG4udG9TdHJpbmcoKSksIFwiYmFubmVkTm90ZXNzXCIsIGJhbm5lZE5vdGVzcy5tYXAobiA9PiBuLm1hcChuID0+IG4udG9TdHJpbmcoKSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTm90ZXM6IHJhbmRvbU5vdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IG9yaWdpbmFsU2NhbGUsIFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG1heEJlYXRzIC0gY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblJlc3VsdCA9IG1ha2VUZW5zaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5pbnZlcnNpb25UZW5zaW9uID0gaW52ZXJzaW9uUmVzdWx0LnJhdGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZFNvdW5kaW5nU2NhbGVUZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VGVuc2lvbih0ZW5zaW9uUmVzdWx0LCB0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbiA9IHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVGVuc2lvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gd29ycmllcywgdGhpcyBjaG9yZC9zY2FsZS9pbnZlcnNpb24gY29tYmluYXRpb24gaXMganVzdCBiYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb25SZXN1bHQuY2hvcmRQcm9ncmVzc2lvbiA+PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHBvaW50IGNoZWNraW5nIG90aGVyIGludmVyc2lvbnMgZm9yIHRoaXMgY2hvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BJbnZlcnNpb25Mb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnaXZlVVAgPSBwcm9ncmVzc0NhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVVUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVsb2R5UmVzdWx0OiBGb3JjZWRNZWxvZHlSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIHRoaXMgcG9zc2libGUgdG8gd29yayB3aXRoIHRoZSBtZWxvZHk/XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgYWRkIG1lbG9keSBub3RlcyBhbmQgTkFDcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbG9keVJlc3VsdCA9IGFkZEZvcmNlZE1lbG9keSh0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQuZm9yY2VkTWVsb2R5ICs9IG1lbG9keVJlc3VsdC50ZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lbG9keVJlc3VsdC5uYWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm5hYyA9IG1lbG9keVJlc3VsdC5uYWM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVsb2R5UmVzdWx0LmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0LmNvbW1lbnQgPSBtZWxvZHlSZXN1bHQuY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24gPSB0ZW5zaW9uUmVzdWx0LmdldFRvdGFsVGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTG9nZ2VyLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aGlzQ2hvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdvb2RDaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZCAmJiBnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNDaG9yZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9yZENvdW50ID49IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHdvcnN0IHByZXZpb3VzIGdvb2RDaG9yZCBpZiB0aGlzIGhhcyBsZXNzIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RDaG9yZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcnN0Q2hvcmRUZW5zaW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdvb2RDaG9yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZENob3JkID0gZ29vZENob3Jkc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZCAmJiBnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGdvb2RDaG9yZFswXS50ZW5zaW9uPy50b3RhbFRlbnNpb24gfHwgOTk5KSA8IHdvcnN0Q2hvcmRUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yc3RDaG9yZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcnN0Q2hvcmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGdvb2RDaG9yZHNbd29yc3RDaG9yZF1bMF0udGVuc2lvbj8udG90YWxUZW5zaW9uIHx8IDk5OSkgPiB0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHJlbW92ZSB0aGF0IGluZGV4LCBhZGQgYSBuZXcgb25lIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSh3b3JzdENob3JkLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9yZENvdW50IDwgR09PRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZENob3Jkcy5wdXNoKHJhbmRvbU5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IG5vdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBCRUFUX0xFTkdUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGVuc2lvblJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBvcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmljaE5vdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGVuc2lvblJlc3VsdC50b3RhbFRlbnNpb24gPCAxMDAwMDAgJiYgYmFkQ2hvcmRzLmxlbmd0aCA8IEJBRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNob3JkQ291bnRJbkJhZENob3JkcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RCYWRDaG9yZDogQmFkQ2hvcmQgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFkQ2hvcmQgb2YgYmFkQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhZENob3JkLmNob3JkLmluY2x1ZGVzKG5ld0Nob3JkLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkQ291bnRJbkJhZENob3JkcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXdvcnN0QmFkQ2hvcmQgfHwgYmFkQ2hvcmQudGVuc2lvbi50b3RhbFRlbnNpb24gPiB3b3JzdEJhZENob3JkPy50ZW5zaW9uLnRvdGFsVGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yc3RCYWRDaG9yZCA9IGJhZENob3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNob3JkQ291bnRJbkJhZENob3JkcyA8IEJBRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkQ2hvcmRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQudG9TdHJpbmcoKSArIFwiLFwiICsgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRlbnNpb25SZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod29yc3RCYWRDaG9yZCAhPSBudWxsICYmIHdvcnN0QmFkQ2hvcmQudGVuc2lvbi50b3RhbFRlbnNpb24gPiB0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4VG9SZXBsYWNlID0gYmFkQ2hvcmRzLmZpbmRJbmRleChiID0+IGIuY2hvcmQgPT0gd29yc3RCYWRDaG9yZC5jaG9yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkQ2hvcmRzW2luZGV4VG9SZXBsYWNlXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLnRvU3RyaW5nKCkgKyBcIixcIiArIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogYXZhaWxhYmxlU2NhbGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gIC8vIEZvciBhdmFpbGFibGUgc2NhbGVzIGVuZFxuICAgICAgICAgICAgfSAgLy8gRm9yIHZvaWNlbGVhZGluZyByZXN1bHRzIGVuZFxuICAgICAgICB9ICAvLyBXaGlsZSBlbmRcbiAgICAgICAgbGV0IGJlc3RPZkJhZENob3JkcyA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgYmFkQ2hvcmQgb2YgYmFkQ2hvcmRzKSB7XG4gICAgICAgICAgICBiYWRDaG9yZC50ZW5zaW9uLnByaW50KFwiQmFkIGNob3JkIFwiLCBiYWRDaG9yZC5jaG9yZCwgXCIgLSBcIiwgYmFkQ2hvcmQuc2NhbGUudG9TdHJpbmcoKSwgXCIgLSBcIik7XG4gICAgICAgICAgICBpZiAoYmVzdE9mQmFkQ2hvcmRzID09IG51bGwgfHwgYmFkQ2hvcmQudGVuc2lvbi50b3RhbFRlbnNpb24gPCBiZXN0T2ZCYWRDaG9yZHMudGVuc2lvbi50b3RhbFRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICBiZXN0T2ZCYWRDaG9yZHMgPSBiYWRDaG9yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZChcbiAgICAgICAgICAgICAgICBcIk5vIGdvb2QgY2hvcmRzIGZvdW5kOiBcIixcbiAgICAgICAgICAgICAgICAoKGJlc3RPZkJhZENob3JkcyAmJiBiZXN0T2ZCYWRDaG9yZHMudGVuc2lvbikgPyAoW2Jlc3RPZkJhZENob3Jkcy5jaG9yZCwgYmVzdE9mQmFkQ2hvcmRzLnRlbnNpb24uY29tbWVudCwgYmVzdE9mQmFkQ2hvcmRzLnRlbnNpb24udG9QcmludCgpXSkgOiBcIlwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGF3YWl0IHNsZWVwTVMoMSk7XG4gICAgICAgICAgICAvLyBHbyBiYWNrIHRvIHByZXZpb3VzIGNob3JkLCBhbmQgbWFrZSBpdCBhZ2FpblxuICAgICAgICAgICAgaWYgKGRpdmlzaW9uID49IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgICAgIC8vIE1hcmsgdGhlIHByZXZpb3VzIGNob3JkIGFzIGJhbm5lZFxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Jhbm5lZE5vdGVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdCYW5uZWROb3Rlc1tub3RlLnBhcnRJbmRleF0gPSBub3RlLm5vdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgcHJldmlvdXMgY2hvcmQgKHdoZXJlIHdlIGFyZSBnb2luZyB0bylcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGFueSBub3RlcyBhZnRlciB0aGF0IGFsc29cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSDsgaSA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5sZW5ndGggPiAxMCAmJiByZXN1bHRbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRvbyBtYW55IGJhbnMsIGdvIGJhY2sgZnVydGhlci4gUmVtb3ZlIHRoZXNlIGJhbnMgc28gdGhleSBkb24ndCBoaW5kZXIgbGF0ZXIgcHJvZ3Jlc3MuXG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEhcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3QmFubmVkTm90ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmFubmVkTm90ZXNbbm90ZS5wYXJ0SW5kZXhdID0gbm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSA9IGRpdmlzaW9uQmFuQ291bnRbZGl2aXNpb25dIHx8IDA7XG4gICAgICAgICAgICAgICAgZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0rKztcbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0gPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBzdHVjay4gR28gYmFjayA4IGJlYXRzIGFuZCB0cnkgYWdhaW4uXG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uIC09IEJFQVRfTEVOR1RIICogODtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0gPSBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb24gPCAtMSAqIEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uID0gLTEgKiBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb28gbWFueSBiYW5zLCBnb2luZyBiYWNrIHRvIGRpdmlzaW9uIFwiICsgZGl2aXNpb24gKyBcIiBiYW4gY291bnQgXCIgKyBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSk7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIHRoZSByZXN1bHQgd2hlcmUgd2UgYXJlIGdvaW5nIHRvIGFuZCBhbnl0aGluZyBhZnRlciBpdFxuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGRpdmlzaW9uICsgQkVBVF9MRU5HVEggKyAxOyBpIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbaV07XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkaXZpc2lvbkJhbm5lZE5vdGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZmFpbGVkIHJpZ2h0IGF0IHRoZSBzdGFydC5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQgLSAxLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChnaXZlVVApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENob29zZSB0aGUgYmVzdCBjaG9yZCBmcm9tIGdvb2RDaG9yZHNcbiAgICAgICAgbGV0IGJlc3RDaG9yZHM6IFJpY2hOb3RlW11bXSA9IFtdO1xuICAgICAgICBsZXQgd29yc3RCZXN0VGVuc2lvbjogbnVtYmVyID0gOTk5O1xuICAgICAgICBsZXQgYmVzdFRlbnNpb24gPSA5OTk7XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmQgb2YgZ29vZENob3Jkcykge1xuICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uIDwgd29yc3RCZXN0VGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmVzdENob3Jkcy5sZW5ndGggPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXhUb1JlcGxhY2UgPSBiZXN0Q2hvcmRzLmZpbmRJbmRleChiID0+IGJbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPT0gd29yc3RCZXN0VGVuc2lvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0Q2hvcmRzW2luZGV4VG9SZXBsYWNlXSA9IGNob3JkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdENob3Jkcy5wdXNoKGNob3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiZXN0VGVuc2lvbiA9IGNob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICB3b3JzdEJlc3RUZW5zaW9uID0gYmVzdENob3Jkcy5yZWR1Y2UoKGEsIGIpID0+IGFbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPiBiWzBdLnRlbnNpb24udG90YWxUZW5zaW9uID8gYSA6IGIpWzBdLnRlbnNpb24udG90YWxUZW5zaW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaG9yZFswXS50ZW5zaW9uLnByaW50KGNob3JkWzBdLmNob3JkID8gY2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA6IFwiP0Nob3JkP1wiLCBjaG9yZFswXS5pbnZlcnNpb25OYW1lLCBcImJlc3QgdGVuc2lvbjogXCIsIGJlc3RUZW5zaW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmVzdENob3JkID0gYmVzdENob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBiZXN0Q2hvcmRzLmxlbmd0aCldO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJlc3QgY2hvcmQ6IFwiLCBiZXN0Q2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSwgYmVzdENob3JkWzBdLmludmVyc2lvbk5hbWUsIGJlc3RDaG9yZFswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbik7XG5cbiAgICAgICAgcmVzdWx0W2RpdmlzaW9uXSA9IGJlc3RDaG9yZDtcbiAgICAgICAgaWYgKGJlc3RDaG9yZFswXT8udGVuc2lvbj8ubmFjKSB7XG4gICAgICAgICAgICAvLyBBZGQgdGhlIHJlcXVpcmVkIE5vbiBDaG9yZCBUb25lXG4gICAgICAgICAgICBhZGROb3RlQmV0d2VlbihiZXN0Q2hvcmRbMF0udGVuc2lvbi5uYWMsIGRpdmlzaW9uLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCAwLCByZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKGN1cnJlbnRCZWF0LCByZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlTXVzaWMocGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpIHtcbiAgICBsZXQgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0ge307XG4gICAgZGl2aXNpb25lZE5vdGVzID0gYXdhaXQgbWFrZUNob3JkcyhwYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2spO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKTtcbiAgICAvLyBhZGRFaWdodGhOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcbiAgICAvLyBhZGRIYWxmTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGRpdmlzaW9uZWROb3RlczogZGl2aXNpb25lZE5vdGVzLFxuICAgIH1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU1lbG9keShkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcykge1xuICAgIC8vIFJlbW92ZSBvbGQgbWVsb2R5IGFuZCBtYWtlIGEgbmV3IG9uZVxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpXG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24rKykge1xuICAgICAgICBjb25zdCBvbkJlYXQgPSBkaXZpc2lvbiAlIEJFQVRfTEVOR1RIID09IDA7XG4gICAgICAgIGlmICghb25CZWF0KSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dID0gW11cbiAgICAgICAgfSBlbHNlIGlmIChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dICYmIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5mb3JFYWNoKHJpY2hOb3RlID0+IHtcbiAgICAgICAgICAgICAgICByaWNoTm90ZS5kdXJhdGlvbiA9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLnRpZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIGNvbnN0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IG5ld1ZvaWNlTGVhZGluZ05vdGVzKGNob3JkcywgcGFyYW1zKTtcbiAgICBidWlsZFRvcE1lbG9keShkaXZpc2lvbmVkTm90ZXMsIG1haW5QYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIC8vIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIG1haW5QYXJhbXMpXG59XG5cbmV4cG9ydCB7IGJ1aWxkVGFibGVzIH0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBhZGROb3RlQmV0d2VlbiwgZmluZE5BQ3MsIEZpbmROb25DaG9yZFRvbmVQYXJhbXMsIE5vbkNob3JkVG9uZSB9IGZyb20gXCIuL25vbmNob3JkdG9uZXNcIjtcbmltcG9ydCB7IGdldFRlbnNpb24sIFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdldE1lbG9keU5lZWRlZFRvbmVzLCBnZXRSaWNoTm90ZSwgZ2xvYmFsU2VtaXRvbmUsIGdUb25lU3RyaW5nLCBuZXh0R1RvbmVJblNjYWxlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc2VtaXRvbmVTY2FsZUluZGV4LCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgdHlwZSBGb3JjZWRNZWxvZHlSZXN1bHQgPSB7XG4gICAgY29tbWVudDogc3RyaW5nLFxuICAgIHRlbnNpb246IG51bWJlcixcbiAgICBuYWM6IE5vbkNob3JkVG9uZSB8IG51bGwsXG59XG5cblxuXG5leHBvcnQgY29uc3QgYWRkRm9yY2VkTWVsb2R5ID0gKHZhbHVlczogVGVuc2lvblBhcmFtcyk6IEZvcmNlZE1lbG9keVJlc3VsdCA9PiB7XG4gICAgLypcbiAgICBcbiAgICAqL1xuICAgIGNvbnN0IHsgdG9Ob3RlcywgY3VycmVudFNjYWxlLCBwYXJhbXMsIG1haW5QYXJhbXMsIGJlYXREaXZpc2lvbiB9ID0gdmFsdWVzO1xuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhwYXJhbXMpO1xuICAgIGNvbnN0IGNob3JkID0gdmFsdWVzLm5ld0Nob3JkO1xuICAgIGNvbnN0IGRpdmlzaW9uZWROb3RlcyA9IHZhbHVlcy5kaXZpc2lvbmVkTm90ZXMgfHwge307XG4gICAgY29uc3QgbWF4RGl2aXNpb24gPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKCkgKiBCRUFUX0xFTkdUSDtcbiAgICBjb25zdCB0ZW5zaW9uOiBGb3JjZWRNZWxvZHlSZXN1bHQgPSB7XG4gICAgICAgIGNvbW1lbnQ6IFwiXCIsXG4gICAgICAgIHRlbnNpb246IDAsXG4gICAgICAgIG5hYzogbnVsbCxcbiAgICB9XG5cbiAgICBjb25zdCBtZWxvZHlUb25lc0FuZER1cmF0aW9ucyA9IGdldE1lbG9keU5lZWRlZFRvbmVzKG1haW5QYXJhbXMpO1xuICAgIGNvbnN0IG1lbG9keUV4aXN0cyA9IChtYWluUGFyYW1zLmZvcmNlZE1lbG9keSB8fCBbXSkubGVuZ3RoID4gMDtcbiAgICBpZiAoIW1lbG9keUV4aXN0cykge1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG4gICAgZGVidWdnZXI7XG5cbiAgICBjb25zdCBjdXJyZW50RGl2aXNpb24gPSBiZWF0RGl2aXNpb247XG4gICAgY29uc3QgY2FkZW5jZURpdmlzaW9uID0gY3VycmVudERpdmlzaW9uIC0gcGFyYW1zLmNhZGVuY2VTdGFydERpdmlzaW9uO1xuXG4gICAgLy8gU3Ryb25nIGJlYXQgbm90ZSBpcyBzdXBwb3NlZCB0byBiZSB0aGlzXG4gICAgbGV0IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2NhZGVuY2VEaXZpc2lvbl07XG4gICAgbGV0IG5ld01lbG9keVRvbmVEaXZpc2lvbiA9IGNhZGVuY2VEaXZpc2lvbjtcbiAgICBpZiAoIW5ld01lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAvLyBObyBtZWxvZHkgdG9uZSBmb3IgdGhpcyBkaXZpc2lvbiwgdGhlIHByZXZpb3VzIHRvbmUgbXVzdCBiZSBsZW5ndGh5LiBVc2UgaXQuXG4gICAgICAgIGZvciAobGV0IGkgPSBjYWRlbmNlRGl2aXNpb24gLSAxOyBpID49IGNhZGVuY2VEaXZpc2lvbiAtIEJFQVRfTEVOR1RIICogMjsgaS0tKSB7XG4gICAgICAgICAgICBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBtZWxvZHlUb25lc0FuZER1cmF0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBuZXdNZWxvZHlUb25lRGl2aXNpb24gPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uIHx8IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi50b25lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBObyBtZWxvZHkgZm91bmQgYXQgYWxsLiBHaXZlIHVwLlxuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIk5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXCI7XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld01lbG9keVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzW25ld01lbG9keVRvbmVBbmREdXJhdGlvbi50b25lXS5zZW1pdG9uZSArIDEgLSAxOyAgLy8gQ29udmVydCB0byBudW1iZXJcbiAgICBjb25zdCB0b1NlbWl0b25lcyA9IHRvTm90ZXMubWFwKCh4KSA9PiB4LnNlbWl0b25lKTtcblxuICAgIC8vIENhbiB3ZSB0dXJuIHRoaXMgbm90ZSBpbnRvIGEgbm9uLWNob3JkIHRvbmU/IENoZWNrIHRoZSBwcmV2aW91cyBhbmQgbmV4dCBub3RlLlxuICAgIGxldCBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uO1xuICAgIGxldCBuZXh0TWVsb2R5VG9uZURpdmlzaW9uO1xuICAgIGZvciAobGV0IGkgPSBuZXdNZWxvZHlUb25lRGl2aXNpb24gKyAxOyBpIDw9IG1heERpdmlzaW9uOyBpKyspIHtcbiAgICAgICAgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2ldO1xuICAgICAgICBpZiAobmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAgICAgbmV4dE1lbG9keVRvbmVEaXZpc2lvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiB8fCBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cIjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgLy8gTGV0J3Mgbm90IGNhcmUgdGhhdCBtdWNoIGlmIHRoZSB3ZWFrIGJlYXQgbm90ZSBpcyBub3QgY29ycmVjdC4gSXQganVzdCBhZGRzIHRlbnNpb24gdG8gdGhlIHJlc3VsdC5cbiAgICAvLyBVTkxFU1MgaXQncyBpbiB0aGUgbWVsb2R5IGFsc28uXG5cbiAgICAvLyBXaGF0IE5BQyBjb3VsZCB3b3JrP1xuICAgIC8vIENvbnZlcnQgYWxsIHZhbHVlcyB0byBnbG9iYWxTZW1pdG9uZXNcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lID0gZ2xvYmFsU2VtaXRvbmUodG9Ob3Rlc1swXSlcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKCh4KSA9PiBnbG9iYWxTZW1pdG9uZSh4KSk7XG4gICAgbGV0IHByZXZSaWNoTm90ZTtcbiAgICBmb3IgKGxldCBpID0gY3VycmVudERpdmlzaW9uIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgcHJldlJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSAwKVswXTtcbiAgICAgICAgaWYgKHByZXZSaWNoTm90ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJldkJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbY3VycmVudERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKS5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IDApWzBdO1xuICAgIGxldCBwcmV2QmVhdEdsb2JhbFNlbWl0b25lID0gcHJldkJlYXRSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZCZWF0UmljaE5vdGUubm90ZSkgOiBudWxsO1xuXG4gICAgbGV0IHByZXZQYXJ0MVJpY2hOb3RlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50RGl2aXNpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBwcmV2UGFydDFSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gMSlbMF07XG4gICAgICAgIGlmIChwcmV2UGFydDFSaWNoTm90ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBwcmV2aW91cyBub3RlIGRvZXNuJ3QgZXhpc3QsIHRoaXMgaXMgYWN0dWFsbHkgZWFzaWVyLlxuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZSA9IHByZXZSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG5cbiAgICAvLyBUcnlpbmcgdG8gZmlndXJlIG91dCB0aGUgbWVsb2R5IGRpcmVjdGlvbi4uLiBXZSBzaG91bGQgcHV0IG9jdGF2ZXMgaW4gdGhlIGZvcmNlZCBtZWxvZHkgc3RyaW5nLi4uXG4gICAgY29uc3QgY2xvc2VzdENvcnJlY3RHVG9uZUJhc2VkT24gPSBwcmV2QmVhdEdsb2JhbFNlbWl0b25lIHx8IGZyb21HbG9iYWxTZW1pdG9uZSB8fCB0b0dsb2JhbFNlbWl0b25lO1xuXG4gICAgbGV0IGNsb3Nlc3RDb3JyZWN0R1RvbmUgPSBuZXdNZWxvZHlTZW1pdG9uZTtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgd2hpbGUgKE1hdGguYWJzKGNsb3Nlc3RDb3JyZWN0R1RvbmUgLSBjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbikgPiA2ICYmIGNsb3Nlc3RDb3JyZWN0R1RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgaXRlcmF0aW9ucysrOyBpZiAoaXRlcmF0aW9ucyA+IDEwMCkgeyBkZWJ1Z2dlcjsgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgY2xvc2VzdENvcnJlY3RHVG9uZSArPSAxMiAqIE1hdGguc2lnbihjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbiAtIGNsb3Nlc3RDb3JyZWN0R1RvbmUpO1xuICAgIH1cblxuICAgIGxldCBuZXh0Q29ycmVjdEd0b25lO1xuICAgIGlmIChuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIG5leHRDb3JyZWN0R3RvbmUgPSBnbG9iYWxTZW1pdG9uZShjdXJyZW50U2NhbGUubm90ZXNbbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi50b25lXSkgJSAxMjtcbiAgICAgICAgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlIChNYXRoLmFicyhuZXh0Q29ycmVjdEd0b25lIC0gY2xvc2VzdENvcnJlY3RHVG9uZSkgPiA2ICYmIG5leHRDb3JyZWN0R3RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgIGl0ZXJhdGlvbnMrKzsgaWYgKGl0ZXJhdGlvbnMgPiAxMDApIHsgZGVidWdnZXI7IHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgICAgIG5leHRDb3JyZWN0R3RvbmUgKz0gMTIgKiBNYXRoLnNpZ24oY2xvc2VzdENvcnJlY3RHVG9uZSAtIG5leHRDb3JyZWN0R3RvbmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbmV4dENvcnJlY3RHdG9uZSB8fCAhbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAvLyBJZiBtZWxvZHkgaGFzIGVuZGVkLCB1c2UgY3VycmVudCBtZWxvZHkgdG9uZS5cbiAgICAgICAgbmV4dENvcnJlY3RHdG9uZSA9IGNsb3Nlc3RDb3JyZWN0R1RvbmU7XG4gICAgICAgIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgfVxuXG4gICAgbGV0IG5leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgIGlmICghbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uO1xuICAgIH1cbiAgICBsZXQgbmV4dEJlYXRDb3JyZWN0R1RvbmU7XG4gICAgaWYgKG5leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIG5leHRCZWF0Q29ycmVjdEdUb25lID0gZ2xvYmFsU2VtaXRvbmUoY3VycmVudFNjYWxlLm5vdGVzW25leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdKSAlIDEyO1xuICAgICAgICBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKG5leHRCZWF0Q29ycmVjdEdUb25lIC0gbmV4dENvcnJlY3RHdG9uZSkgPiA2ICYmIG5leHRCZWF0Q29ycmVjdEdUb25lIDw9IHNlbWl0b25lTGltaXRzWzBdWzFdKSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwKSB7IHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgICAgIG5leHRCZWF0Q29ycmVjdEdUb25lICs9IDEyICogTWF0aC5zaWduKG5leHRDb3JyZWN0R3RvbmUgLSBuZXh0QmVhdENvcnJlY3RHVG9uZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSAxOiB0aGUgcHJldmlvdXMgbm90ZSwgMjogd2hhdCB0aGUgY3VycmVudCBub3RlIHNob3VsZCBiZSwgMzogd2hhdCB0aGUgbmV4dCBub3RlIHNob3VsZCBiZS5cbiAgICAvLyBCYXNlZCBvbiB0aGUgcmVxdWlyZWQgZHVyYXRpb25zLCB3ZSBoYXZlIHNvbWUgY2hvaWNlczpcblxuICAgIC8vIDEuIEJlYXQgbWVsb2R5IGlzIGEgcXVhcnRlci4gVGhpcyBpcyB0aGUgZWFzaWVzdCBjYXNlLlxuICAgIC8vIEhlcmUgd2UgY2FuIGF0IHRoZSBtb3N0IHVzZSBhIDh0aC84dGggTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC5cbiAgICAvLyBUaG91Z2gsIHRlbnNpb24gaXMgYWRkZWQuXG5cbiAgICAvLyAyLiBDdXJyZW50IGJlYXQgbWVsb2R5IGlzIDh0aCBhbmQgOHRoLiBCb3RoIG5vdGVzIE1VU1QgYmUgY29ycmVjdC5cbiAgICAvLyBCYXNlIG9uIHRoZSBuZXh0IG5vdGUgd2UgY2FuIHVzZSBzb21lIE5BQ3MuIFRoaXMgaXMgd2hlcmUgdGhlIHdlYWsgYmVhdCBOQUNzIGNvbWUgaW4uXG5cbiAgICAvLyAzLiBDdXJyZW50IGJlYXQgbWVsb2R5IGlzIGEgaGFsZiBub3RlLiBXZSBjYW4gdXNlIGEgc3Ryb25nIGJlYXQgTkFDLlxuICAgIC8vIFRlbnNpb24gaXMgYWRkZWQuXG5cbiAgICAvLyBIYXJkZXIgY2FzZXMsIHN1Y2ggYXMgc3luY29wYXRpb24sIGFyZSBub3QgaGFuZGxlZC4geWV0LlxuXG4gICAgbGV0IHBhcnQxTWF4R1RvbmUgPSBNYXRoLm1heCh0b0dsb2JhbFNlbWl0b25lc1sxXSwgcHJldlBhcnQxUmljaE5vdGUgPyBnbG9iYWxTZW1pdG9uZShwcmV2UGFydDFSaWNoTm90ZS5ub3RlKSA6IDApO1xuXG4gICAgY29uc3QgbmFjUGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHtcbiAgICAgICAgZnJvbUdUb25lOiBmcm9tR2xvYmFsU2VtaXRvbmUgfHwgY2xvc2VzdENvcnJlY3RHVG9uZSxcbiAgICAgICAgdGhpc0JlYXRHVG9uZTogdG9HbG9iYWxTZW1pdG9uZSxcbiAgICAgICAgbmV4dEJlYXRHVG9uZTogbmV4dEJlYXRDb3JyZWN0R1RvbmUsXG4gICAgICAgIHNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgIGNob3JkOiBjaG9yZCxcbiAgICAgICAgZ1RvbmVMaW1pdHM6IFtwYXJ0MU1heEdUb25lLCAxMjddLCAgLy8gVE9ET1xuICAgICAgICB3YW50ZWRHVG9uZXM6IFtdLFxuICAgIH1cblxuICAgIGNvbnN0IGVlU3Ryb25nTW9kZSA9IChcbiAgICAgICAgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9uID09IEJFQVRfTEVOR1RIIHx8XG4gICAgICAgIChcbiAgICAgICAgICAgIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyICYmIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSAmJlxuICAgICAgICAgICAgY2xvc2VzdENvcnJlY3RHVG9uZSAhPSB0b0dsb2JhbFNlbWl0b25lXG4gICAgICAgIClcbiAgICApXG5cbiAgICBpZiAoZWVTdHJvbmdNb2RlKSB7XG4gICAgICAgIGlmIChjbG9zZXN0Q29ycmVjdEdUb25lID09IHRvR2xvYmFsU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGNvcnJlY3Qgbm90ZS4gTm8gdGVuc2lvbi5cbiAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiQ29ycmVjdCBxdWFydGVyIG5vdGVcIjtcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkZCBhIHJpZ2h0IE5BQyBvbiB0aGUgc3Ryb25nIGJlYXQuXG4gICAgICAgIG5hY1BhcmFtcy53YW50ZWRHVG9uZXNbMF0gPSBjbG9zZXN0Q29ycmVjdEdUb25lO1xuICAgICAgICBpZiAobmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9uID09IEJFQVRfTEVOR1RIIC8gMikge1xuICAgICAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1sxXSA9IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZSAhPSBuZXh0Q29ycmVjdEd0b25lKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYEluQ29ycmVjdCA4dGgvOHRoIG5vdGUsICR7Z1RvbmVTdHJpbmcodG9HbG9iYWxTZW1pdG9uZSl9ICE9ICR7Z1RvbmVTdHJpbmcobmV4dENvcnJlY3RHdG9uZSl9YDtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5hY1BhcmFtcy5zcGxpdE1vZGUgPSBcIkVFXCJcbiAgICAgICAgY29uc3QgbmFjID0gZmluZE5BQ3MobmFjUGFyYW1zIGFzIEZpbmROb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICBpZiAoIW5hYykge1xuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYE5vIE5BQyBmb3VuZDogd2FudGVkVG9uZXM6ICR7KG5hY1BhcmFtcy53YW50ZWRHVG9uZXMgYXMgbnVtYmVyW10pLm1hcCh0b25lID0+IGdUb25lU3RyaW5nKHRvbmUpKX1gICsgYCR7Z1RvbmVTdHJpbmcobmFjUGFyYW1zLnRoaXNCZWF0R1RvbmUpfSwgJHtnVG9uZVN0cmluZyhuZXh0Q29ycmVjdEd0b25lKX0sICR7Z1RvbmVTdHJpbmcobmFjUGFyYW1zLm5leHRCZWF0R1RvbmUpfWA7XG4gICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm90ZUdUb25lID0gZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpO1xuICAgICAgICAvLyBHcmVhdC4uLiBXZSBjYW4gYWRkIGEgY29ycmVjdCA4dGggb24gdGhlIHN0cm9uZyBiZWF0IVxuICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgLy8gdGVuc2lvbi5jb21tZW50ID0gYEFkZGluZyBOQUMgb24gc3Ryb25nIGJlYXQ6ICR7Z1RvbmVTdHJpbmcoZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpKX0gdG8gZGl2aXNpb24gJHtjdXJyZW50RGl2aXNpb259LCB3YW50ZWRHdG9uZXM6ICR7bmFjUGFyYW1zLndhbnRlZEdUb25lcy5tYXAoZ1RvbmVTdHJpbmcpfWA7XG4gICAgICAgIHRlbnNpb24ubmFjID0gbmFjO1xuICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gNTsgLy8gTm90IHRoYXQgZ3JlYXQsIGJ1dCBpdCdzIGJldHRlciB0aGFuIG5vdGhpbmcuXG4gICAgfSBlbHNlIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyICYmIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkZCBhIHJpZ2h0IE5BQyBvbiB0aGUgc3Ryb25nIGJlYXQuIGFuZCBhIHJpZ2h0IG5hYyBvbiB3ZWFrIGJlYXRcbiAgICAgICAgaWYgKGNsb3Nlc3RDb3JyZWN0R1RvbmUgPT0gdG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gU3Ryb25nIGJlYXQgaXMgYWxyZWFkeSBjb3JyZWN0LiBOZWVkIGEgbm90ZSBvbiB3ZWFrIGJlYXRcbiAgICAgICAgICAgIG5hY1BhcmFtcy53YW50ZWRHVG9uZXNbMV0gPSBuZXh0Q29ycmVjdEd0b25lO1xuICAgICAgICAgICAgbmFjUGFyYW1zLnNwbGl0TW9kZSA9IFwiRUVcIlxuICAgICAgICAgICAgY29uc3QgbmFjID0gZmluZE5BQ3MobmFjUGFyYW1zIGFzIEZpbmROb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgaWYgKCFuYWMpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIk5vIE5BQyBmb3VuZCBmb3IgcXVhcnRlciBub3RlXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld05vdGVHVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5hYy5ub3RlKTtcbiAgICAgICAgICAgIC8vIEdyZWF0Li4uIFdlIGNhbiBhZGQgYSBjb3JyZWN0IDh0aCBvbiB0aGUgc3Ryb25nIGJlYXQhXG4gICAgICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgICAgIC8vIHRlbnNpb24uY29tbWVudCA9IGBBZGRpbmcgd2VhayBFRSBOQUMgJHtnVG9uZVN0cmluZyhnbG9iYWxTZW1pdG9uZShuYWMubm90ZSkpfSB0byBkaXZpc2lvbiAke2N1cnJlbnREaXZpc2lvbn0sIHdhbnRlZEd0b25lczogJHtuYWNQYXJhbXMud2FudGVkR1RvbmVzLm1hcChnVG9uZVN0cmluZyl9YDtcbiAgICAgICAgICAgIHRlbnNpb24ubmFjID0gbmFjO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhYnNvbHV0ZWx5IHBlcmZlY3QsIGJvdGggbm90ZXMgYXJlIGNvcnJlY3QuIChubyB0ZW5zaW9uISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlbGwsIG5vIGNhbiBkbyB0aGVuIEkgZ3Vlc3MuXG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcImNsb3Nlc3RDb3JyZWN0R1RvbmUgIT0gdG9HbG9iYWxTZW1pdG9uZVwiO1xuICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uICs9IDEwMDtcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgJHtuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb259ICE9ICR7QkVBVF9MRU5HVEh9YDtcbiAgICB9XG4gICAgXG4gICAgdGVuc2lvbi50ZW5zaW9uID0gMDtcbiAgICByZXR1cm4gdGVuc2lvbjtcbn0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBUZW5zaW9uLCBUZW5zaW9uUGFyYW1zIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjb25zdCBnb29kU291bmRpbmdTY2FsZVRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcsXG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgYmVhdERpdmlzaW9uLFxuICAgICAgICB9ID0gdmFsdWVzO1xuICAgIFxuICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgIC8vIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgIH1cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZm9yIChsZXQgaT1iZWF0RGl2aXNpb247IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXMuZXZlcnkoQm9vbGVhbikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbU5vdGVzT3ZlcnJpZGUpIHtcbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gZnJvbU5vdGVzT3ZlcnJpZGU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGhlIGJhc3MsIGlzIGl0IGdvdW5kIHVwIG9yIGRvd24gYSBzY2FsZT9cblxuICAgIGlmIChwcmV2UGFzc2VkRnJvbU5vdGVzKSB7XG4gICAgICAgIGNvbnN0IHByZXZHbG9iYWxTZW1pdG9uZXMgPSBwcmV2UGFzc2VkRnJvbU5vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lcyA9IHBhc3NlZEZyb21Ob3Rlcy5tYXAobiA9PiBnbG9iYWxTZW1pdG9uZShuKSk7XG4gICAgICAgIGNvbnN0IGxhdGVzdEdsb2JhbFNlbWl0b25lcyA9IGxhdGVzdE5vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3Qgbm90ZXNCeVBhcnQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhc3NlZEZyb21Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbm90ZXNCeVBhcnRbaV0gPSBbdG9HbG9iYWxTZW1pdG9uZXNbaV1dO1xuICAgICAgICAgICAgaWYgKGxhdGVzdEdsb2JhbFNlbWl0b25lc1tpXSAmJiBsYXRlc3RHbG9iYWxTZW1pdG9uZXNbaV0gIT09IGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBub3Rlc0J5UGFydFtpXS5wdXNoKGxhdGVzdEdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub3Rlc0J5UGFydFtpXS5wdXNoKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgaWYgKHByZXZHbG9iYWxTZW1pdG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBub3Rlc0J5UGFydFtpXS5wdXNoKHByZXZHbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXJ0U2NhbGVJbmRleGVzID0gbm90ZXNCeVBhcnRbaV0ubWFwKG4gPT4gc2VtaXRvbmVTY2FsZUluZGV4W24gJSAxMl0pO1xuXG4gICAgICAgICAgICBsZXQgZ29pbmdVcE9yRG93bkFTY2FsZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHBhcnRTY2FsZUluZGV4ZXNbMF0gLSBwYXJ0U2NhbGVJbmRleGVzWzFdID09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydFNjYWxlSW5kZXhlc1sxXSAtIHBhcnRTY2FsZUluZGV4ZXNbMl0gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBMYXN0IDMgbm90ZXMgYXJlIGdvaW5nIHVwIGEgc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgZ29pbmdVcE9yRG93bkFTY2FsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnRTY2FsZUluZGV4ZXNbMF0gLSBwYXJ0U2NhbGVJbmRleGVzWzFdID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRTY2FsZUluZGV4ZXNbMV0gLSBwYXJ0U2NhbGVJbmRleGVzWzJdID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExhc3QgMyBub3RlcyBhcmUgZ29pbmcgZG93biBhIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGdvaW5nVXBPckRvd25BU2NhbGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGdvaW5nVXBPckRvd25BU2NhbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NjYWxlICs9IDM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5zb3ByYW5vU2NhbGUgKz0gMztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm90aGVyU2NhbGUgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVuc2lvbi5iYXNzU2NhbGUgPiAwICYmIHRlbnNpb24uc29wcmFub1NjYWxlID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzNdKSAlIDEyXG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNCB8fCBpbnRlcnZhbCA9PSA4KSB7XG4gICAgICAgICAgICAgICAgLy8gM3JkcyBhbmQgNnRocyBhcmUgZ29vZFxuICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NvcHJhbm9TY2FsZSArPSAzOyAgLy8gT3ZlcnJpZGUgYmFzcyBhbmQgc29wcmFubyBzYW1lIGRpcmVjdGlvbiBhbHNvXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRlbnNpb24ub3RoZXJTY2FsZSA+IDAgJiYgdGVuc2lvbi5zb3ByYW5vU2NhbGUgPiAwKSB7XG4gICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzJdKSAlIDEyXG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNCB8fCBpbnRlcnZhbCA9PSA4KSB7XG4gICAgICAgICAgICAgICAgLy8gM3JkcyBhbmQgNnRocyBhcmUgZ29vZFxuICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NvcHJhbm9TY2FsZSArPSAyOyAgLy8gU2FtZSB0aGluZyBmb3IgYWx0byBvciB0ZW5vciArIHNvcHJhbm9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1sxXSkgJSAxMlxuICAgICAgICAgICAgaWYgKGludGVydmFsID09IDQgfHwgaW50ZXJ2YWwgPT0gOCkge1xuICAgICAgICAgICAgICAgIC8vIDNyZHMgYW5kIDZ0aHMgYXJlIGdvb2RcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmJhc3NTb3ByYW5vU2NhbGUgKz0gMjsgIC8vIFNhbWUgdGhpbmcgZm9yIGFsdG8gb3IgdGVub3IgKyBzb3ByYW5vXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIEludmVyc2lvblJlc3VsdCA9IHtcbiAgICBnVG9uZURpZmZzOiBBcnJheTxBcnJheTxudW1iZXI+PixcbiAgICBub3Rlczoge1trZXk6IG51bWJlcl06IE5vdGV9LFxuICAgIHJhdGluZzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU6IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgU2ltcGxlSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgIG5vdGVzOiBBcnJheTxOb3RlPixcbiAgICByYXRpbmc6IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lOiBzdHJpbmcsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNpb25zID0gKHZhbHVlczoge1xuICAgICAgICBjaG9yZDogQ2hvcmQsIHByZXZOb3RlczogQXJyYXk8Tm90ZT4sIGJlYXQ6IG51bWJlciwgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICAgICAgbG9nZ2VyOiBMb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG51bWJlclxuICAgIH0pOiBBcnJheTxTaW1wbGVJbnZlcnNpb25SZXN1bHQ+ID0+IHtcbiAgICBjb25zdCB7Y2hvcmQsIHByZXZOb3RlcywgYmVhdCwgcGFyYW1zLCBsb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmd9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBOb3RlcyBpbiB0aGUgQ2hvcmQgdGhhdCBhcmUgY2xvc2VzdCB0byB0aGUgcHJldmlvdXMgbm90ZXNcbiAgICAvLyBGb3IgZWFjaCBwYXJ0XG5cbiAgICBjb25zdCB7c3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsIHNlbWl0b25lTGltaXRzfSA9IHN0YXJ0aW5nTm90ZXMocGFyYW1zKTtcblxuICAgIC8vIEFkZCBhIHJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBpbnZlcnNpb25cbiAgICBjb25zdCByZXQ6IEFycmF5PFNpbXBsZUludmVyc2lvblJlc3VsdD4gPSBbXTtcblxuICAgIGxldCBsYXN0QmVhdEdsb2JhbFNlbWl0b25lcyA9IFsuLi5zdGFydGluZ0dsb2JhbFNlbWl0b25lc11cbiAgICBpZiAocHJldk5vdGVzKSB7XG4gICAgICAgIGxhc3RCZWF0R2xvYmFsU2VtaXRvbmVzID0gcHJldk5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICB9XG5cbiAgICBpZiAoIWNob3JkKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAoY2hvcmQpIHtcbiAgICAgICAgLy8gRm9yIGVhY2ggYmVhdCwgd2UgdHJ5IHRvIGZpbmQgYSBnb29kIG1hdGNoaW5nIHNlbWl0b25lIGZvciBlYWNoIHBhcnQuXG5cbiAgICAgICAgLy8gUnVsZXM6XG4gICAgICAgIC8vIFdpdGhcdHJvb3QgcG9zaXRpb24gdHJpYWRzOiBkb3VibGUgdGhlIHJvb3QuIFxuXG4gICAgICAgIC8vIFdpdGggZmlyc3QgaW52ZXJzaW9uIHRyaWFkczogZG91YmxlIHRoZSByb290IG9yIDV0aCwgaW4gZ2VuZXJhbC4gSWYgb25lIG5lZWRzIHRvIGRvdWJsZSBcbiAgICAgICAgLy8gdGhlIDNyZCwgdGhhdCBpcyBhY2NlcHRhYmxlLCBidXQgYXZvaWQgZG91YmxpbmcgdGhlIGxlYWRpbmcgdG9uZS5cblxuICAgICAgICAvLyBXaXRoIHNlY29uZCBpbnZlcnNpb24gdHJpYWRzOiBkb3VibGUgdGhlIGZpZnRoLiBcblxuICAgICAgICAvLyBXaXRoICBzZXZlbnRoICBjaG9yZHM6ICB0aGVyZSAgaXMgIG9uZSB2b2ljZSAgZm9yICBlYWNoICBub3RlLCAgc28gIGRpc3RyaWJ1dGUgYXMgIGZpdHMuIElmICBvbmUgXG4gICAgICAgIC8vIG11c3Qgb21pdCBhIG5vdGUgZnJvbSB0aGUgY2hvcmQsIHRoZW4gb21pdCB0aGUgNXRoLlxuXG4gICAgICAgIGNvbnN0IGZpcnN0SW50ZXJ2YWwgPSBzZW1pdG9uZURpc3RhbmNlKGNob3JkLm5vdGVzWzBdLnNlbWl0b25lLCBjaG9yZC5ub3Rlc1sxXS5zZW1pdG9uZSlcbiAgICAgICAgY29uc3QgdGhpcmRJc0dvb2QgPSBmaXJzdEludGVydmFsID09IDMgfHwgZmlyc3RJbnRlcnZhbCA9PSA0O1xuICAgICAgICBsb2dnZXIubG9nKFwibm90ZXM6IFwiLCBjaG9yZC5ub3Rlcy5tYXAobiA9PiBuLnRvU3RyaW5nKCkpKTtcblxuICAgICAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGludmVyc2lvbiBhbmQgY2hvcmQgdHlwZSwgd2UncmUgZG9pbmcgZGlmZmVyZW50IHRoaW5nc1xuXG4gICAgICAgIGxldCBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJyb290LWZpZnRoXCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwiZmlyc3QtZmlmdGhcIiwgXCJzZWNvbmRcIl07XG4gICAgICAgIGxldCBjb21iaW5hdGlvbkNvdW50ID0gMyAqIDIgKiAxO1xuICAgICAgICBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZXMgPSBbXCJyb290XCIsIFwicm9vdC1yb290XCIsIFwicm9vdC10aGlyZFwiLCBcImZpcnN0XCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwic2Vjb25kXCIsIFwidGhpcmRcIiwgXCJ0aGlyZC1yb290XCIsIFwidGhpcmQtdGhpcmRcIl07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBza2lwRmlmdGhJbmRleCA9IDA7IHNraXBGaWZ0aEluZGV4IDwgMjsgc2tpcEZpZnRoSW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBpbnZlcnNpb25JbmRleD0wOyBpbnZlcnNpb25JbmRleDxpbnZlcnNpb25OYW1lcy5sZW5ndGg7IGludmVyc2lvbkluZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgY29tYmluYXRpb25JbmRleD0wOyBjb21iaW5hdGlvbkluZGV4PGNvbWJpbmF0aW9uQ291bnQ7IGNvbWJpbmF0aW9uSW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IHJhdGluZyA9IDA7XG4gICAgICAgICAgICBjb25zdCBza2lwRmlmdGggPSBza2lwRmlmdGhJbmRleCA9PSAxO1xuXG4gICAgICAgICAgICAvLyBXZSB0cnkgZWFjaCBpbnZlcnNpb24uIFdoaWNoIGlzIGJlc3Q/XG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb24gPSBpbnZlcnNpb25OYW1lc1tpbnZlcnNpb25JbmRleF07XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyA8IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIERvbid0IGRvIGFueXRoaW5nIGJ1dCByb290IHBvc2l0aW9uIG9uIHRoZSBsYXN0IGNob3JkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb25SZXN1bHQ6IEludmVyc2lvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZURpZmZzOiBbXSxcbiAgICAgICAgICAgICAgICBub3Rlczoge30sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiAwLFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc2tpcEZpZnRoKSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUgKz0gXCItc2tpcEZpZnRoXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArPSBcIi1cIiArIGNvbWJpbmF0aW9uSW5kZXg7XG5cbiAgICAgICAgICAgIGNvbnN0IGFkZFBhcnROb3RlID0gKHBhcnRJbmRleDogbnVtYmVyLCBub3RlOiBOb3RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBub3RlLnNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IDEgIC8vIGR1bW15XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlci5sb2coXCJpbnZlcnNpb246IFwiLCBpbnZlcnNpb24sIFwic2tpcEZpZnRoOiBcIiwgc2tpcEZpZnRoKTtcbiAgICAgICAgICAgIGxldCBwYXJ0VG9JbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBzZWxlY3QgYm90dG9tIG5vdGVcbiAgICAgICAgICAgIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnZmlyc3QnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgndGhpcmQnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGlzdCBub3RlcyB3ZSBoYXZlIGxlZnQgb3ZlclxuICAgICAgICAgICAgbGV0IGxlZnRPdmVySW5kZXhlczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb24gPT0gXCJyb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJyb290LWZpZnRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzEsIDIsIDJdOyAgLy8gRG91YmxlIHRoZSBmaWZ0aFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3Qtcm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcnN0IC0+IFdlIGFscmVhZHkgaGF2ZSAxXG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAwLCAyXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtdGhpcmRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMl07ICAvLyBEb3VibGUgdGhlIHRoaXJkXG4gICAgICAgICAgICAgICAgICAgIHJhdGluZyArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmQgLT4gV2UgYWxyZWFkeSBoYXZlIDJcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIExlYXZlIG91dCB0aGUgZmlmdGgsIHBvc3NpYmx5XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvbiA9PSBcInJvb3Qtcm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwicm9vdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFsxLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDNdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJ0aGlyZC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJ0aGlyZC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAxXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDIsIDNdLmZpbHRlcihpID0+IGkgIT0gcGFydFRvSW5kZXhbM10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNraXBGaWZ0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0VG9JbmRleFszXSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaW4gc2Vjb25kIGludmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDIpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaWYgd2UgaGF2ZSB0d29cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpICE9IDIpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBlaXRoZXIgYSAwIG9yIDEgdG8gcmVwbGFjZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICBpZiAobGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgPT0gMCkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZXBlbmRpbmcgb24gY29tYmluYXRpb25JbmRleCwgd2Ugc2VsZWN0IHRoZSBub3RlcyBmb3IgcGFydEluZGV4ZXMgMCwgMSwgMlxuICAgICAgICAgICAgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlyZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gRm91cnRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBGaWZ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgLy8gU2l4dGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgcGFydEluZGV4PTA7IHBhcnRJbmRleDw0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHBhcnQgaXMgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFBhcnROb3RlKHBhcnRJbmRleCwgY2hvcmQubm90ZXNbcGFydFRvSW5kZXhbcGFydEluZGV4XV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGFzdGx5LCB3ZSBzZWxlY3QgdGhlIGxvd2VzdCBwb3NzaWJsZSBvY3RhdmUgZm9yIGVhY2ggcGFydFxuICAgICAgICAgICAgbGV0IG1pblNlbWl0b25lID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0zOyBwYXJ0SW5kZXg+PTA7IHBhcnRJbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBnVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGk9MDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZ1RvbmUgPCBzZW1pdG9uZUxpbWl0c1twYXJ0SW5kZXhdWzBdIHx8IGdUb25lIDwgbWluU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUb28gbWFueSBpdGVyYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnVG9uZSArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IGludmVyc2lvbnJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBvY3RhdmUgY29tYmluYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0ME5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMF0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQxTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1sxXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDJOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzJdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0M05vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbM10pO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydDBPY3RhdmU9MDsgcGFydDBPY3RhdmU8MzsgcGFydDBPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQwTm90ZSA9IGluaXRpYWxQYXJ0ME5vdGUgKyBwYXJ0ME9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ME5vdGUgPiBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDFPY3RhdmU9MDsgcGFydDFPY3RhdmU8MzsgcGFydDFPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0MU5vdGUgPSBpbml0aWFsUGFydDFOb3RlICsgcGFydDFPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHBhcnQwTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHNlbWl0b25lTGltaXRzWzFdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0Mk9jdGF2ZT0wOyBwYXJ0Mk9jdGF2ZTwzOyBwYXJ0Mk9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0Mk5vdGUgPSBpbml0aWFsUGFydDJOb3RlICsgcGFydDJPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBwYXJ0MU5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBzZW1pdG9uZUxpbWl0c1syXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDNPY3RhdmU9MDsgcGFydDNPY3RhdmU8MzsgcGFydDNPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQzTm90ZSA9IGluaXRpYWxQYXJ0M05vdGUgKyBwYXJ0M09jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBwYXJ0Mk5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBzZW1pdG9uZUxpbWl0c1szXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0ME5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDBOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQxTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0MU5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDJOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQyTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0M05vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDNOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICsgYCAke3BhcnQwT2N0YXZlfSR7cGFydDFPY3RhdmV9JHtwYXJ0Mk9jdGF2ZX0ke3BhcnQzT2N0YXZlfWAgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQwTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQxTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQyTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQzTm90ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZzogcmF0aW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2dnZXIucHJpbnQoXCJuZXdWb2ljZUxlYWRpbmdOb3RlczogXCIsIGNob3JkLnRvU3RyaW5nKCksIFwiIGJlYXQ6IFwiLCBiZWF0KTtcblxuICAgIC8vIFJhbmRvbWl6ZSBvcmRlciBvZiByZXRcbiAgICBmb3IgKGxldCBpPTA7IGk8cmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZXQubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgdG1wID0gcmV0W2ldO1xuICAgICAgICByZXRbaV0gPSByZXRbal07XG4gICAgICAgIHJldFtqXSA9IHRtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuIiwiY29uc3QgcHJpbnRDaGlsZE1lc3NhZ2VzID0gKGNoaWxkTG9nZ2VyOiBMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkTG9nZ2VyLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uY2hpbGQudGl0bGUpO1xuICAgICAgICBwcmludENoaWxkTWVzc2FnZXMoY2hpbGQpO1xuICAgICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgY2hpbGQubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAgIHRpdGxlOiBhbnlbXSA9IFtdO1xuICAgIG1lc3NhZ2VzOiBBcnJheTxhbnlbXT4gPSBbXTtcbiAgICBwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBjaGlsZHJlbjogTG9nZ2VyW10gPSBbXTtcbiAgICBjbGVhcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2coLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKGFyZ3MpO1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIExldCBwYXJlbnQgaGFuZGxlIG1lXG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGFyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5hcmdzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi50aGlzLnRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSB0b3AgbG9nZ2VyLiBQcmludCBldmVyeXRoaW5nLlxuICAgICAgICBwcmludENoaWxkTWVzc2FnZXModGhpcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4udGhpcy5tZXNzYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbiA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhcmVkID0gdHJ1ZTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zLCBnZXRSaWNoTm90ZSwgZ2xvYmFsU2VtaXRvbmUsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIE5vbkNob3JkVG9uZSA9IHtcbiAgICBub3RlOiBOb3RlLFxuICAgIG5vdGUyPyA6IE5vdGUsICAvLyBUaGlzIG1ha2VzIHRoZSBub3RlcyAxNnRoc1xuICAgIHN0cm9uZ0JlYXQ6IGJvb2xlYW4sXG4gICAgcmVwbGFjZW1lbnQ/OiBib29sZWFuLFxufVxuXG5leHBvcnQgdHlwZSBOb25DaG9yZFRvbmVQYXJhbXMgPSB7XG4gICAgZ1RvbmUwOiBudW1iZXIgfCBudWxsLFxuICAgIGdUb25lMTogbnVtYmVyLFxuICAgIGdUb25lMjogbnVtYmVyLFxuICAgIHdhbnRlZFRvbmU/IDogbnVtYmVyLFxuICAgIHN0cm9uZ0JlYXQ/OiBib29sZWFuLFxuICAgIGNob3JkPyA6IENob3JkLFxuICAgIHNjYWxlOiBTY2FsZSxcbiAgICBnVG9uZUxpbWl0czogbnVtYmVyW10sXG59XG5cbnR5cGUgU3BsaXRNb2RlID0gXCJFRVwiIHwgXCJTU0VcIiB8IFwiRVNTXCIgfCBcIlNTU1NcIlxuXG5leHBvcnQgdHlwZSBGaW5kTm9uQ2hvcmRUb25lUGFyYW1zID0ge1xuICAgIGZyb21HVG9uZTogbnVtYmVyLFxuICAgIHRoaXNCZWF0R1RvbmU6IG51bWJlcixcbiAgICBuZXh0QmVhdEdUb25lOiBudW1iZXIsXG4gICAgc3BsaXRNb2RlOiBTcGxpdE1vZGUsXG4gICAgd2FudGVkR1RvbmVzOiBudW1iZXJbXSwgIC8vIFByb3ZpZGUgZ3RvbmVzIGZvciBlYWNoIHdhbnRlZCBpbmRleCBvZiBzcGxpdG1vZGVcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgZ1RvbmVMaW1pdHM6IG51bWJlcltdLFxuICAgIGNob3JkPzogQ2hvcmQsXG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZE5vdGVCZXR3ZWVuID0gKG5hYzogTm9uQ2hvcmRUb25lLCBkaXZpc2lvbjogbnVtYmVyLCBuZXh0RGl2aXNpb246IG51bWJlciwgcGFydEluZGV4OiBudW1iZXIsIGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3Rlcyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGRpdmlzaW9uRGlmZiA9IG5leHREaXZpc2lvbiAtIGRpdmlzaW9uO1xuICAgIGNvbnN0IGJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgIGlmICghYmVhdFJpY2hOb3RlIHx8ICFiZWF0UmljaE5vdGUubm90ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWVsZCB0byBhZGQgbm90ZSBiZXR3ZWVuXCIsIGRpdmlzaW9uLCBuZXh0RGl2aXNpb24sIHBhcnRJbmRleCwgZGl2aXNpb25lZE5vdGVzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld05vdGUgPSBuYWMubm90ZTtcbiAgICBjb25zdCBuZXdOb3RlMiA9IG5hYy5ub3RlMjtcbiAgICBjb25zdCBzdHJvbmdCZWF0ID0gbmFjLnN0cm9uZ0JlYXQ7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBuYWMucmVwbGFjZW1lbnQgfHwgZmFsc2U7XG5cbiAgICAvLyBJZiBzdHJvbmcgYmVhdCwgd2UgYWRkIG5ld05vdGUgQkVGT1JFIGJlYXRSaWNoTm90ZVxuICAgIC8vIE90aGVyd2lzZSB3ZSBhZGQgbmV3Tm90ZSBBRlRFUiBiZWF0UmljaE5vdGVcblxuICAgIGlmIChzdHJvbmdCZWF0KSB7XG4gICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBiZWF0UmljaE5vdGUub3JpZ2luYWxTY2FsZSxcbiAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgbmV3IHRvbmUgdG8gZGl2aXNpb25cbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgLy8gUmVtb3ZlIGJlYXRSaWNoTm90ZSBmcm9tIGRpdmlzaW9uXG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZpbHRlcihub3RlID0+IG5vdGUgIT0gYmVhdFJpY2hOb3RlKTtcbiAgICAgICAgaWYgKCFyZXBsYWNlbWVudCkge1xuICAgICAgICAgICAgLy8gQWRkIGJlYXRSaWNoTm90ZSB0byBkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2goYmVhdFJpY2hOb3RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFkZCBuZXcgdG9uZSBhbHNvIHRvIGRpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMlxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW5ld05vdGUyKSB7XG4gICAgICAgICAgICAvLyBhZGRpbmcgMSA4dGggbm90ZVxuICAgICAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZSA9IHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBiZWF0UmljaE5vdGUub3JpZ2luYWxTY2FsZSxcbiAgICAgICAgICAgICAgICB0ZW5zaW9uOiBuZXcgVGVuc2lvbigpLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhZGRpbmcgMiAxNnRoIG5vdGVzXG4gICAgICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDQsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGJlYXRSaWNoTm90ZS5vcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAqIDAuNzVdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmICogMC43NV0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZTIgPSB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3Tm90ZTIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDQsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGJlYXRSaWNoTm90ZS5vcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgKiAwLjc1XS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuY29uc3QgcGFzc2luZ1RvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBSZXR1cm4gYSBuZXcgZ1RvbmUgb3IgbnVsbCwgYmFzZWQgb24gd2hldGhlciBhZGRpbmcgYSBwYXNzaW5nIHRvbmUgaXMgYSBnb29kIGlkZWEuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhnVG9uZTEgLSBnVG9uZTIpO1xuICAgIGlmIChkaXN0YW5jZSA8IDMgfHwgZGlzdGFuY2UgPiA0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZVRvbmVzID0gc2NhbGUubm90ZXMubWFwKG4gPT4gbi5zZW1pdG9uZSk7XG4gICAgZm9yIChsZXQgZ1RvbmU9Z1RvbmUxOyBnVG9uZSAhPSBnVG9uZTI7IGdUb25lICs9IChnVG9uZTEgPCBnVG9uZTIgPyAxIDogLTEpKSB7XG4gICAgICAgIGlmIChnVG9uZSA9PSBnVG9uZTEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gZ1RvbmUgJSAxMjtcbiAgICAgICAgaWYgKHNjYWxlVG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5jb25zdCBhY2NlbnRlZFBhc3NpbmdUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgLy8gU2FtZSBhcyBwYXNzaW5nIHRvbmUgYnV0IG9uIHN0cm9uZyBiZWF0XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoZ1RvbmUwIC0gZ1RvbmUxKTtcbiAgICBpZiAoZGlzdGFuY2UgPCAzIHx8IGRpc3RhbmNlID4gNCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVUb25lcyA9IHNjYWxlLm5vdGVzLm1hcChuID0+IG4uc2VtaXRvbmUpO1xuICAgIGZvciAobGV0IGdUb25lPWdUb25lMDsgZ1RvbmUgIT0gZ1RvbmUxOyBnVG9uZSArPSAoZ1RvbmUwIDwgZ1RvbmUxID8gMSA6IC0xKSkge1xuICAgICAgICBpZiAoZ1RvbmUgPT0gZ1RvbmUwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IGdUb25lICUgMTI7XG4gICAgICAgIGlmIChzY2FsZVRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgc3Ryb25nQmVhdDogdHJ1ZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5cbmNvbnN0IG5laWdoYm9yVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAsIHRoZW4gc3RlcCBiYWNrLiBUaGlzIGlzIG9uIFdlYWsgYmVhdFxuICAgIGlmIChnVG9uZTEgIT0gZ1RvbmUyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4KHNjYWxlKVtnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB1cE9yRG93bkNob2ljZXMgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gWzEsIC0xXSA6IFstMSwgMV07XG4gICAgZm9yIChjb25zdCB1cE9yRG93biBvZiB1cE9yRG93bkNob2ljZXMpIHtcbiAgICAgICAgY29uc3QgbmV3R3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgdXBPckRvd24sIHNjYWxlKTtcbiAgICAgICAgaWYgKCFuZXdHdG9uZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld0d0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgbmV3R3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogbmV3R3RvbmUgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihuZXdHdG9uZSAvIDEyKSxcbiAgICAgICAgfSksIHN0cm9uZ0JlYXQ6IGZhbHNlfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuY29uc3Qgc3VzcGVuc2lvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBET1dOIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdC5cbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTAgLSBnVG9uZTE7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgZG93bi5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7XG4gICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH1cbn1cblxuXG5jb25zdCByZXRhcmRhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBVUCBpbnRvIGNob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgdXAuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgZ1RvbmUxIHRvIGdUb25lMCBmb3IgdGhlIGxlbmd0aCBvZiB0aGUgc3VzcGVuc2lvbi5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTt9XG5cblxuY29uc3QgYXBwb2dpYXR1cmEgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBMZWFwLCB0aGVuIHN0ZXAgYmFjayBpbnRvIENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gLTE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXBwb2dpYXR1cmFcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCB1cCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBhcHBvZ2lhdHVyYVxuICAgICAgICB1cE9yRG93biA9IDE7XG4gICAgfVxuICAgIGNvbnN0IGdUb25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgaWYgKCFnVG9uZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O1xufVxuXG5jb25zdCBlc2NhcGVUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBhd2F5LCB0aGVuIExlYXAgaW4gdG8gbmV4dCBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB1cE9yRG93biA9IDE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIHVwIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCBkb3duIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICAgICAgdXBPckRvd24gPSAtMTtcbiAgICB9XG4gICAgY29uc3QgZ1RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMCwgdXBPckRvd24sIHNjYWxlKTtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07XG59XG5cbmNvbnN0IGFudGljaXBhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgb3IgbGVhcCBlYXJseSBpbiB0byBuZXh0IENob3JkIHRvbmUuIFRoaXMgaXMgb24gd2VhayBiZWF0LlxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUyIC0gZ1RvbmUxO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAxKSB7XG4gICAgICAgIC8vIFRvbyBjbG9zZSB0byBiZSBhbiBhbnRpY2lwYXRpb25cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gRWFzeS4gSnVzdCBtYWtlIGEgbmV3IG5vdGUgdGhhdHMgdGhlIHNhbWUgYXMgZ1RvbmUyLlxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUyICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTIgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IGZhbHNlfTtcbn1cblxuY29uc3QgbmVpZ2hib3JHcm91cCA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgYXdheSwgdGhlbiBsZWFwIGludG8gdGhlIFwib3RoZXIgcG9zc2libGVcIiBuZWlnaGJvciB0b25lLiBUaGlzIHVzZXMgMTZ0aHMgKHR3byBub3RlcykuXG4gICAgLy8gV2VhayBiZWF0XG4gICAgaWYgKGdUb25lMSAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHVwR3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgMSwgc2NhbGUpO1xuICAgIGNvbnN0IGRvd25HdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCAtMSwgc2NhbGUpO1xuICAgIGlmICghdXBHdG9uZSB8fCAhZG93bkd0b25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodXBHdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IHVwR3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGRvd25HdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGRvd25HdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogdXBHdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHVwR3RvbmUgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBub3RlMjogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IGRvd25HdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGRvd25HdG9uZSAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlXG4gICAgfTtcbn1cblxuXG5jb25zdCBwZWRhbFBvaW50ID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIG5vdGUgd2l0aCB0aGUgbm90ZSB0aGF0IGlzIGJlZm9yZSBpdCBBTkQgYWZ0ZXIgaXQuXG4gICAgaWYgKGdUb25lMCAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZTAgPT0gZ1RvbmUxKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gQWxyZWFkeSBleGlzdHNcbiAgICB9XG4gICAgaWYgKGdUb25lMSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lMSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlLCByZXBsYWNlbWVudDogdHJ1ZX07XG59XG5cblxuY29uc3QgY2hvcmROb3RlID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgLy8gSnVzdCB1c2UgYSBjaG9yZCB0b25lLiBXZWFrIE9SIHN0cm9uZyBiZWF0XG4gICAgY29uc3QgeyBnVG9uZTEsIGNob3JkIH0gPSB2YWx1ZXM7XG4gICAgbGV0IHN0cm9uZ0JlYXQgPSB2YWx1ZXMuc3Ryb25nQmVhdDtcbiAgICBpZiAoIXN0cm9uZ0JlYXQpIHtcbiAgICAgICAgc3Ryb25nQmVhdCA9IE1hdGgucmFuZG9tKCkgPiAwLjg7XG4gICAgfVxuICAgIGlmICghY2hvcmQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGxldCB3YW50ZWRUb25lID0gdmFsdWVzLndhbnRlZFRvbmU7XG4gICAgaWYgKCF3YW50ZWRUb25lKSB7XG4gICAgICAgIC8vIFJhbmRvbSBmcm9tIGNob3JkLm5vdGVzXG4gICAgICAgIGNvbnN0IG5vdGUgPSBjaG9yZC5ub3Rlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaG9yZC5ub3Rlcy5sZW5ndGgpXTtcbiAgICAgICAgd2FudGVkVG9uZSA9IG5vdGUuc2VtaXRvbmU7XG4gICAgICAgIC8vIFNlbGVjdCBjbG9zZXN0IG9jdGF2ZSB0byBnVG9uZTFcbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAoTWF0aC5hYnMod2FudGVkVG9uZSAtIGdUb25lMSkgPj0gNikge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSBpdGVyYXRpb25zXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2FudGVkVG9uZSArPSAxMjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgZ29vZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3Qgbm90ZSBvZiBjaG9yZC5ub3Rlcykge1xuICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSB3YW50ZWRUb25lICUgMTIpIHtcbiAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnb29kKSB7XG4gICAgICAgIC8vIFdhbnRlZFRvbmUgaXMgbm90IGEgY2hvcmQgdG9uZVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IHdhbnRlZFRvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHdhbnRlZFRvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHN0cm9uZ0JlYXR9O1xufVxuXG5jb25zdCB3ZWFrQmVhdENob3JkVG9uZSAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICByZXR1cm4gY2hvcmROb3RlKHtcbiAgICAgICAgLi4udmFsdWVzLFxuICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZSxcbiAgICB9KTtcbn1cblxuY29uc3Qgc3Ryb25nQmVhdENob3JkVG9uZSAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICByZXR1cm4gY2hvcmROb3RlKHtcbiAgICAgICAgLi4udmFsdWVzLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH0pXG59XG5cblxuZXhwb3J0IGNvbnN0IGZpbmROQUNzID0gKHZhbHVlczogRmluZE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtmcm9tR1RvbmUsIHRoaXNCZWF0R1RvbmUsIG5leHRCZWF0R1RvbmUsIHNwbGl0TW9kZSwgd2FudGVkR1RvbmVzLCBzY2FsZSwgZ1RvbmVMaW1pdHMsIGNob3JkfSA9IHZhbHVlcztcblxuICAgIGNvbnN0IHN0cm9uZ0JlYXRGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgJ3N0cm9uZ0JlYXRDaG9yZFRvbmUnOiBzdHJvbmdCZWF0Q2hvcmRUb25lLFxuICAgICAgICAnYXBwb2dpYXR1cmEnOiBhcHBvZ2lhdHVyYSxcbiAgICAgICAgJ2VzY2FwZVRvbmUnOiBlc2NhcGVUb25lLFxuICAgICAgICAncGVkYWxQb2ludCc6IHBlZGFsUG9pbnQsXG4gICAgICAgICdzdXNwZW5zaW9uJzogc3VzcGVuc2lvbixcbiAgICAgICAgJ3JldGFyZGF0aW9uJzogcmV0YXJkYXRpb24sXG4gICAgICAgICdhY2NlbnRlZFBhc3NpbmdUb25lJzogYWNjZW50ZWRQYXNzaW5nVG9uZSxcbiAgICB9XG5cbiAgICBjb25zdCB3ZWFrQmVhdEZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAnd2Vha0JlYXRDaG9yZFRvbmUnOiB3ZWFrQmVhdENob3JkVG9uZSxcbiAgICAgICAgJ2FudGljaXBhdGlvbic6IGFudGljaXBhdGlvbixcbiAgICAgICAgJ25laWdoYm9yR3JvdXAnOiBuZWlnaGJvckdyb3VwLFxuICAgICAgICAncGFzc2luZ1RvbmUnOiBwYXNzaW5nVG9uZSxcbiAgICB9XG5cbiAgICBpZiAoc3BsaXRNb2RlID09ICdFRScpIHtcbiAgICAgICAgLy8gVGhpcyBjYXNlIG9ubHkgaGFzIDIgY2hvaWNlczogc3Ryb25nIG9yIHdlYWsgYmVhdFxuICAgICAgICBsZXQgc3Ryb25nQmVhdCA9IGZhbHNlO1xuICAgICAgICAvLyBGaW5kIHRoZSB3YW50ZWQgbm90ZXNcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCBhIGNoYW5nZSBvbiBzdHJvbmcgYmVhdCBvciBvbiBzb21lIG90aGVyIGJlYXRcbiAgICAgICAgaWYgKHdhbnRlZEdUb25lc1swXSAmJiB3YW50ZWRHVG9uZXNbMF0gIT0gdGhpc0JlYXRHVG9uZSkge1xuICAgICAgICAgICAgc3Ryb25nQmVhdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cm9uZ0JlYXQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuY05hbWUgaW4gc3Ryb25nQmVhdEZ1bmNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IHN0cm9uZ0JlYXRGdW5jc1tmdW5jTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZnVuYyh7XG4gICAgICAgICAgICAgICAgICAgIGdUb25lMDogZnJvbUdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTE6IHRoaXNCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMjogbmV4dEJlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgd2FudGVkVG9uZTogd2FudGVkR1RvbmVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkLFxuICAgICAgICAgICAgICAgIH0gYXMgTm9uQ2hvcmRUb25lUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FudGVkR1RvbmVzWzBdIHx8IGdsb2JhbFNlbWl0b25lKHJlc3VsdC5ub3RlKSA9PSB3YW50ZWRHVG9uZXNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmNOYW1lIGluIHdlYWtCZWF0RnVuY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gd2Vha0JlYXRGdW5jc1tmdW5jTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZnVuYyh7XG4gICAgICAgICAgICAgICAgICAgIGdUb25lMDogZnJvbUdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTE6IHRoaXNCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMjogbmV4dEJlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgd2FudGVkVG9uZTogd2FudGVkR1RvbmVzWzFdLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkLFxuICAgICAgICAgICAgICAgIH0gYXMgTm9uQ2hvcmRUb25lUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FudGVkR1RvbmVzWzFdIHx8IGdsb2JhbFNlbWl0b25lKHJlc3VsdC5ub3RlKSA9PSB3YW50ZWRHVG9uZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuZXhwb3J0IGNvbnN0IGJ1aWxkVG9wTWVsb2R5ID0gKGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSA9PiB7XG4gICAgLy8gRm9sbG93IHRoZSBwcmUgZ2l2ZW4gbWVsb2R5IHJoeXRobVxuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9uczogeyBba2V5OiBudW1iZXJdOiBudW1iZXI7IH0gPSBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtcyk7XG5cbiAgICBjb25zdCBsYXN0RGl2aXNpb24gPSBCRUFUX0xFTkdUSCAqIG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcbiAgICBjb25zdCBmaXJzdFBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoMCk7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKGZpcnN0UGFyYW1zKTtcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBsYXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IGdUb25lTGltaXRzRm9yVGhpc0JlYXQgPSBbXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMF1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzFdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1syXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbM11dLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgY2FkZW5jZURpdmlzaW9uID0gZGl2aXNpb24gLSBwYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2FkZW5jZSBkaXZpc2lvblwiLCBjYWRlbmNlRGl2aXNpb24sIFwiZGl2aXNpb25cIiwgZGl2aXNpb24sIFwiYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb25cIiwgcGFyYW1zLmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgbmVlZGVkUmh5dGhtID0gcmh5dGhtTmVlZGVkRHVyYXRpb25zW2NhZGVuY2VEaXZpc2lvbl0gfHwgMTAwO1xuXG4gICAgICAgIGNvbnN0IGxhc3RCZWF0SW5DYWRlbmNlID0gcGFyYW1zLmJlYXRzVW50aWxBdXRoZW50aWNDYWRlbmNlRW5kIDwgMlxuICAgICAgICBpZiAobGFzdEJlYXRJbkNhZGVuY2UpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJldk5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICAgICAgY29uc3QgdGhpc05vdGVzOiBOb3RlW10gPSBbXTtcbiAgICAgICAgY29uc3QgbmV4dE5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbnRTY2FsZTogU2NhbGU7XG4gICAgICAgIGxldCBvcmlnaW5hbFNjYWxlOiBTY2FsZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKHJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBpZiAocmljaE5vdGUuc2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGUgPSByaWNoTm90ZS5vcmlnaW5hbFNjYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKHJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBuZXh0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnJlbnRTY2FsZSA9IGN1cnJlbnRTY2FsZTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBvcmlnaW5hbFNjYWxlID0gb3JpZ2luYWxTY2FsZTtcblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGxpbWl0cywgbmV3IG5vdGVzIG11c3QgYWxzbyBiZSBiZXR3ZWVlbiB0aGUgb3RoZXIgcGFydCBub3Rlc1xuICAgICAgICAgICAgLy8gKCBPdmVybGFwcGluZyApXG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24sIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnVG9uZTEgPSBnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lMiA9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IG1pbkdUb25lID0gTWF0aC5taW4oZ1RvbmUxLCBnVG9uZTIpO1xuICAgICAgICAgICAgY29uc3QgbWF4R1RvbmUgPSBNYXRoLm1heChnVG9uZTEsIGdUb25lMik7XG4gICAgICAgICAgICBpZiAoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXSkge1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHRoZSBoaWdoZXIgcGFydCwgaXQgY2FuJ3QgZ28gbG93ZXIgdGhhbiBtYXhHVG9uZVxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV1bMF0gPSBNYXRoLm1heChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdWzBdLCBtYXhHVG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXSkge1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHRoZSBsb3dlciBwYXJ0LCBpdCBjYW4ndCBnbyBoaWdoZXIgdGhhbiBtaW5HVG9uZVxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV1bMV0gPSBNYXRoLm1pbihnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdWzFdLCBtaW5HVG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKG5lZWRlZFJoeXRobSAhPSAyICogQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBuZWVkIGZvciBoYWxmIG5vdGVzXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBZGQgYSB0aWUgdG8gdGhlIG5leHQgbm90ZVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uLCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdsb2JhbFNlbWl0b25lKHJpY2hOb3RlLm5vdGUpICE9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmljaE5vdGUudGllID0gXCJzdGFydFwiO1xuICAgICAgICAgICAgbmV4dFJpY2hOb3RlLnRpZSA9IFwic3RvcFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIGlmIChuZWVkZWRSaHl0aG0gIT0gIEJFQVRfTEVOR1RIIC8gMikge1xuICAgICAgICAgICAgICAgIC8vIE5vIG5lZWQgZm9yIDh0aHMuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24sIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlLnNjYWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHNjYWxlIGZvciByaWNoTm90ZVwiLCByaWNoTm90ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByZXZSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gLSBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcblxuICAgICAgICAgICAgY29uc3QgZ1RvbmUxID0gZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBnVG9uZTIgPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBsZXQgZ1RvbmUwID0gcHJldlJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldlJpY2hOb3RlLm5vdGUpIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChnVG9uZTAgJiYgcHJldlJpY2hOb3RlICYmIHByZXZSaWNoTm90ZS5kdXJhdGlvbiAhPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIC8vIEZJWE1FOiBwcmV2UmljaE5vdGUgaXMgbm90IHRoZSBwcmV2aW91cyBub3RlLiBXZSBjYW5ub3QgdXNlIGl0IHRvIGRldGVybWluZSB0aGUgcHJldmlvdXMgbm90ZS5cbiAgICAgICAgICAgICAgICBnVG9uZTAgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmFjUGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGdUb25lMCxcbiAgICAgICAgICAgICAgICBnVG9uZTEsXG4gICAgICAgICAgICAgICAgZ1RvbmUyLFxuICAgICAgICAgICAgICAgIHNjYWxlOiByaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0czogZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXhdLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUcnkgdG8gZmluZCBhIHdheSB0byBhZCA4dGggbm90ZXMgdGhpcyBiZWF0LlxuXG4gICAgICAgICAgICBjb25zdCBub25DaG9yZFRvbmVDaG9pY2VGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgICAgICAgICBjaG9yZE5vdGU6ICgpID0+IHtjaG9yZE5vdGUobmFjUGFyYW1zKX0sXG4gICAgICAgICAgICAgICAgYXBwb2dpYXR1cmE6ICgpID0+IGFwcG9naWF0dXJhKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgbmVpZ2hib3JHcm91cDogKCkgPT4gbmVpZ2hib3JHcm91cChuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHN1c3BlbnNpb246ICgpID0+IHN1c3BlbnNpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBlc2NhcGVUb25lOiAoKSA9PiBlc2NhcGVUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcGFzc2luZ1RvbmU6ICgpID0+IHBhc3NpbmdUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgYWNjZW50ZWRQYXNzaW5nVG9uZTogKCkgPT4gYWNjZW50ZWRQYXNzaW5nVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yVG9uZTogKCkgPT4gbmVpZ2hib3JUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcmV0YXJkYXRpb246ICgpID0+IHJldGFyZGF0aW9uKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgYW50aWNpcGF0aW9uOiAoKSA9PiBhbnRpY2lwYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBwZWRhbFBvaW50OiAoKSA9PiBwZWRhbFBvaW50KG5hY1BhcmFtcyksXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmU6IE5vbkNob3JkVG9uZSB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgdXNlZENob2ljZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICBjb25zdCBnb29kQ2hvaWNlcyA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmVDaG9pY2VzOiB7W2tleTogc3RyaW5nXTogTm9uQ2hvcmRUb25lfSA9IHt9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmcgPSBwYXJhbXMubm9uQ2hvcmRUb25lc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmcgfHwgIXNldHRpbmcuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlID0gbm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3Nba2V5XSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hvaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVDaG9pY2VzW2tleV0gPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFydEluZGV4ICE9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vbkNob3JkVG9uZUNob2ljZXMucGVkYWxQb2ludDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdXNpbmdLZXkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZUtleXMgPSBPYmplY3Qua2V5cyhub25DaG9yZFRvbmVDaG9pY2VzKS5maWx0ZXIoa2V5ID0+ICF1c2VkQ2hvaWNlcy5oYXMoa2V5KSk7XG4gICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZUtleXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBub25DaG9yZFRvbmVDaG9pY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VkQ2hvaWNlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9uQ2hvcmRUb25lID0gbm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNpbmdLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgcG9zc2libGUgbm9uIGNob3JkIHRvbmVcbiAgICAgICAgICAgICAgICAvLyBOb3cgd2UgbmVlZCB0byBjaGVjayB2b2ljZSBsZWFkaW5nIGZyb20gYmVmb3JlIGFuZCBhZnRlclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vbkNob3JkVG9uZU5vdGVzOiBOb3RlW10gPSBbLi4udGhpc05vdGVzXTtcblxuICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZU5vdGVzW3BhcnRJbmRleF0gPSBub25DaG9yZFRvbmUubm90ZTtcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxTY2FsZSAmJiBub25DaG9yZFRvbmUubm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbFNjYWxlLm5vdGVzLmV2ZXJ5KG5vdGUgPT4gbm90ZS5zZW1pdG9uZSAhPSBub25DaG9yZFRvbmUubm90ZS5zZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBub24gY2hvcmQgdG9uZSBpcyBub3QgaW4gdGhlIG9yaWdpbmFsIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW4ndCB1c2UgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUmVzdWx0ID0gbmV3IFRlbnNpb24oKTtcbiAgICAgICAgICAgICAgICBnZXRUZW5zaW9uKHRlbnNpb25SZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbU5vdGVzT3ZlcnJpZGU6IHByZXZOb3RlcyxcbiAgICAgICAgICAgICAgICAgICAgYmVhdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdG9Ob3Rlczogbm9uQ2hvcmRUb25lTm90ZXMsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY2FsZTogY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICBtYWluUGFyYW1zOiBtYWluUGFyYW1zLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgIHRlbnNpb24gKz0gdGVuc2lvblJlc3VsdC5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uICs9IHRlbnNpb25SZXN1bHQucGFyYWxsZWxGaWZ0aHM7XG4gICAgICAgICAgICAgICAgdGVuc2lvbiArPSB0ZW5zaW9uUmVzdWx0LnNwYWNpbmdFcnJvcjtcbiAgICAgICAgICAgICAgICBpZiAodGVuc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RDaG9pY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFjOiBub25DaG9yZFRvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRlbnNpb24gdG9vIGhpZ2ggZm9yIG5vbiBjaG9yZCB0b25lXCIsIHRlbnNpb24sIG5vbkNob3JkVG9uZSwgdGVuc2lvblJlc3VsdCwgdXNpbmdLZXkpO1xuICAgICAgICAgICAgICAgIHVzZWRDaG9pY2VzLmFkZCh1c2luZ0tleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChnb29kQ2hvaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0IHRoZSBiZXN0IGNob2ljZVxuICAgICAgICAgICAgICAgIGdvb2RDaG9pY2VzLnNvcnQoKGEsIGIpID0+IGEudGVuc2lvbiAtIGIudGVuc2lvbik7XG4gICAgICAgICAgICAgICAgbm9uQ2hvcmRUb25lID0gZ29vZENob2ljZXNbMF0ubmFjO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhZGROb3RlQmV0d2Vlbihub25DaG9yZFRvbmUsIGRpdmlzaW9uLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgsIGRpdmlzaW9uZWROb3Rlcyk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgU2NhbGUsIFNjYWxlVGVtcGxhdGVzIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RIIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIE1haW5NdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZUNvdW50OiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VzOiBBcnJheTxNdXNpY1BhcmFtcz4gPSBbXTtcbiAgICB0ZXN0TW9kZT86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBtZWxvZHlSaHl0aG06IHN0cmluZyA9IFwiXCI7ICAvLyBoaWRkZW4gZnJvbSB1c2VyIGZvciBub3dcbiAgICBmb3JjZWRNZWxvZHk6IG51bWJlcltdID0gW107ICAvLyBoaWRkZW4gZnJvbSB1c2VyIGZvciBub3dcbiAgICBmb3JjZWRDaG9yZHM6IHN0cmluZyA9IFwiXCI7XG4gICAgZm9yY2VkT3JpZ2luYWxTY2FsZTogU2NhbGUgfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNYWluTXVzaWNQYXJhbXM+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSAocGFyYW1zIGFzIGFueSlba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLm1lbG9keVJoeXRobSA9IFwiUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVwiXG4gICAgICAgIC8vIHRoaXMubWVsb2R5Umh5dGhtID0gXCJFRUVFUVFFRUVFUVFFRVFFRVFFRVFFRVFcIjtcbiAgICAgICAgLy8gZm9yIChsZXQgaT0wOyBpPDIwOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIC8vICAgICBpZiAocmFuZG9tIDwgMC4yKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJIXCI7XG4gICAgICAgIC8vICAgICAgICAgaSArPSAxO1xuICAgICAgICAvLyAgICAgfSBlbHNlIGlmIChyYW5kb20gPCAwLjcpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1lbG9keVJoeXRobSArPSBcIlFcIjtcbiAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJFRVwiO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMuZm9yY2VkTWVsb2R5ID0gWzAsIDEsIDIsIDMsIDMsIDMgXVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAxMiAzIDQxIDIgMzQgdHdvIGJhcnNcblxuICAgICAgICAvLyBEbyBSZSBNaSBGYSBTbyBMYSBUaSBEb1xuICAgICAgICAvLyB0aGlzLmZvcmNlZE1lbG9keSA9IFwiUlJSUlJSUlJSUlJSUlJSUlJSUlJcIjtcbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBbXG4gICAgICAgIC8vICAgICAwLFxuICAgICAgICAvLyAgICAgMSxcbiAgICAgICAgLy8gICAgIDIsXG4gICAgICAgIC8vICAgICAzLFxuICAgICAgICAvLyAgICAgNCxcbiAgICAgICAgLy8gICAgIDUsXG4gICAgICAgIC8vICAgICA0LFxuICAgICAgICAvLyAgICAgMyxcbiAgICAgICAgLy8gICAgIDIsXG4gICAgICAgIC8vICAgICAxLFxuICAgICAgICAvLyAgICAgMCxcbiAgICAgICAgLy8gXTtcbiAgICAgICAgLy8gbGV0IG1lbG9keSA9IFswXTtcbiAgICAgICAgLy8gZm9yIChsZXQgaT0wOyBpPDIwOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHVwT3JEb3duID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IC0xIDogMTtcbiAgICAgICAgLy8gICAgIGNvbnN0IHByZXZNZWxvZHkgPSBtZWxvZHlbbWVsb2R5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAvLyAgICAgbWVsb2R5LnB1c2gocHJldk1lbG9keSArICgxICogdXBPckRvd24pKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLmZvcmNlZE1lbG9keSA9IG1lbG9keS5tYXAobSA9PiAobSArIDcgKiAxMDApICUgNyk7XG5cbiAgICAgICAgLy8gRXhhbXBsZSBtZWxvZHlcbiAgICAgICAgLy8gQyBtYWogLSBDXG4gICAgICAgIC8vICAgICAgICAgRCBwdFxuICAgICAgICAvLyBDIG1haiAgIEVcbiAgICAgICAgLy8gICAgICAgICBGIHB0XG4gICAgICAgIC8vIEEgbWluICAgRyBwdFxuICAgICAgICAvLyAgICAgICAgIEFcbiAgICAgICAgLy8gQSBtaW4gICBCIHB0XG4gICAgICAgIC8vICAgICAgICAgQ1xuICAgICAgICAvLyBGIG1haiAgIEIgcHRcbiAgICAgICAgLy8gICAgICAgICBBXG4gICAgICAgIC8vIEYgbWFqICAgRyBwdFxuICAgICAgICAvLyAgICAgICAgIEZcbiAgICAgICAgLy8gRyBtYWogICBFIHB0XG4gICAgICAgIC8vICAgICAgICAgRFxuICAgICAgICAvLyBHIG1haiAgIEMgcHRcbiAgICAgICAgLy8gICAgICAgICBEXG4gICAgICAgIC8vIEMgbWFqICAgRVxuICAgICAgICAvLyAgICAgICAgIEYgcHRcbiAgICAgICAgLy8gQyBtYWogICBHXG4gICAgICAgIC8vICAgICAgICAgQSBwdFxuICAgICAgICAvLyB0aGlzLmZvcmNlZENob3JkcyA9IFwiMzYyNTE2NjYyXCJcbiAgICAgICAgdGhpcy5mb3JjZWRPcmlnaW5hbFNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiAwLCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3IgfSk7XG4gICAgfVxuXG4gICAgY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb246IG51bWJlcik6IE11c2ljUGFyYW1zIHtcbiAgICAgICAgY29uc3QgYmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG4gICAgICAgIGNvbnN0IGJhciA9IE1hdGguZmxvb3IoYmVhdCAvIHRoaXMuYmVhdHNQZXJCYXIpO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7ICAvLyBUaGUgYmVhdCB3ZSdyZSBhdCBpbiB0aGUgbG9vcFxuICAgICAgICBsZXQgYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyID0gMDtcbiAgICAgICAgbGV0IHByZXZDYWRlbmNlID0gXCJcIjtcblxuICAgICAgICBmb3IgKGNvbnN0IGNhZGVuY2VQYXJhbXMgb2YgdGhpcy5jYWRlbmNlcykge1xuICAgICAgICAgICAgLy8gTG9vcCBjYWRlbmNlcyBpbiBvcmRlclxuICAgICAgICAgICAgaWYgKFtcIlBBQ1wiLCBcIklBQ1wiXS5pbmNsdWRlcyhwcmV2Q2FkZW5jZSkpIHtcbiAgICAgICAgICAgICAgICBhdXRoZW50aWNDYWRlbmNlU3RhcnRCYXIgPSBjb3VudGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldkNhZGVuY2UgPSBjYWRlbmNlUGFyYW1zLnNlbGVjdGVkQ2FkZW5jZTtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gY2FkZW5jZVBhcmFtcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgICAgIGlmIChiYXIgPCBjb3VudGVyKSB7ICAvLyBXZSBoYXZlIHBhc3NlZCB0aGUgZ2l2ZW4gZGl2aXNpb24uIFRoZSBwcmV2aW91cyBjYWRlbmNlIGlzIHRoZSBvbmUgd2Ugd2FudFxuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbENhZGVuY2VFbmQgPSBjb3VudGVyICogdGhpcy5iZWF0c1BlckJhciAtIGJlYXQ7XG4gICAgICAgICAgICAgICAgaWYgKFtcIlBBQ1wiLCBcIklBQ1wiXS5pbmNsdWRlcyhjYWRlbmNlUGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA9IGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbENhZGVuY2VFbmQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA9IDk5OTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsU29uZ0VuZCA9IHRoaXMuY2FkZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhICsgYi5iYXJzUGVyQ2FkZW5jZSwgMCkgKiB0aGlzLmJlYXRzUGVyQmFyIC0gYmVhdDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzUGVyQmFyID0gdGhpcy5iZWF0c1BlckJhcjtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmNhZGVuY2VTdGFydERpdmlzaW9uID0gKChjb3VudGVyIC0gY2FkZW5jZVBhcmFtcy5iYXJzUGVyQ2FkZW5jZSkgKiB0aGlzLmJlYXRzUGVyQmFyKSAqIEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb24gPSBhdXRoZW50aWNDYWRlbmNlU3RhcnRCYXIgKiB0aGlzLmJlYXRzUGVyQmFyICogQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhZGVuY2VQYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FkZW5jZXNbMF07XG4gICAgfVxuXG4gICAgZ2V0TWF4QmVhdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNVbnRpbENhZGVuY2VFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNVbnRpbFNvbmdFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZVN0YXJ0RGl2aXNpb246IG51bWJlciA9IDA7XG4gICAgYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb246IG51bWJlciA9IDA7XG5cbiAgICBiYXNlVGVuc2lvbj86IG51bWJlciA9IDAuMztcbiAgICBiYXJzUGVyQ2FkZW5jZTogbnVtYmVyID0gMlxuICAgIHRlbXBvPzogbnVtYmVyID0gMzA7XG4gICAgaGFsZk5vdGVzPzogYm9vbGVhbiA9IHRydWU7XG4gICAgc2l4dGVlbnRoTm90ZXM/OiBudW1iZXIgPSAwLjI7XG4gICAgZWlnaHRoTm90ZXM/OiBudW1iZXIgPSAwLjQ7XG4gICAgbW9kdWxhdGlvbldlaWdodD86IG51bWJlciA9IDA7XG4gICAgbGVhZGluZ1dlaWdodD86IG51bWJlciA9IDI7XG4gICAgcGFydHM6IEFycmF5PHtcbiAgICAgICAgdm9pY2U6IHN0cmluZyxcbiAgICAgICAgbm90ZTogc3RyaW5nLFxuICAgICAgICB2b2x1bWU6IG51bWJlcixcbiAgICB9PiA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MVwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQzVcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDEwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MVwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQTRcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZvaWNlOiBcIjQyXCIsXG4gICAgICAgICAgICAgICAgbm90ZTogXCJDNFwiLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogNyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDNcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkUzXCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiAxMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICBiZWF0U2V0dGluZ3M6IEFycmF5PHtcbiAgICAgICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIH0+ID0gW107XG4gICAgY2hvcmRTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXIsXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgbWFqOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWluOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGltOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaW03OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFqNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogLTEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9tNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbjc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICBzY2FsZVNldHRpbmdzOiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICB3ZWlnaHQ6IG51bWJlclxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgICAgIG1ham9yOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWlub3I6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgc2VsZWN0ZWRDYWRlbmNlOiBzdHJpbmcgPSBcIkhDXCI7XG4gICAgbm9uQ2hvcmRUb25lczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXIsXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgcGFzc2luZ1RvbmU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZWlnaGJvclRvbmU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdXNwZW5zaW9uOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmV0YXJkYXRpb246IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcHBvZ2lhdHVyYToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVzY2FwZVRvbmU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbnRpY2lwYXRpb246IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZWlnaGJvckdyb3VwOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGVkYWxQb2ludDoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuXG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFBhcnRpYWw8TXVzaWNQYXJhbXM+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSAocGFyYW1zIGFzIGFueSlba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUJlYXRTZXR0aW5ncygpO1xuICAgIH1cblxuICAgIHVwZGF0ZUJlYXRTZXR0aW5ncygpIHtcbiAgICAgICAgY29uc3QgYmVhdENvdW50ID0gdGhpcy5iZWF0c1BlckJhciAqIHRoaXMuYmFyc1BlckNhZGVuY2U7XG4gICAgICAgIGlmICh0aGlzLmJlYXRTZXR0aW5ncy5sZW5ndGggPCBiZWF0Q291bnQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSB0aGlzLmJlYXRTZXR0aW5ncy5sZW5ndGg7IGkgPCBiZWF0Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmVhdFNldHRpbmdzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0aGlzLmJhc2VUZW5zaW9uIHx8IDAuMyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJlYXRTZXR0aW5ncy5sZW5ndGggPiBiZWF0Q291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuYmVhdFNldHRpbmdzID0gdGhpcy5iZWF0U2V0dGluZ3Muc2xpY2UoMCwgYmVhdENvdW50KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IENob3JkLCBjaG9yZFRlbXBsYXRlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBSYW5kb21DaG9yZEdlbmVyYXRvciB7XG4gICAgcHJpdmF0ZSBjaG9yZFR5cGVzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIGF2YWlsYWJsZUNob3Jkcz86IEFycmF5PHN0cmluZz47XG4gICAgcHJpdmF0ZSB1c2VkQ2hvcmRzPzogU2V0PHN0cmluZz47XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IE11c2ljUGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGNob3JkVHlwZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjaG9yZFR5cGUgaW4gcGFyYW1zLmNob3JkU2V0dGluZ3MpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuY2hvcmRTZXR0aW5nc1tjaG9yZFR5cGVdLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjaG9yZFR5cGVzLnB1c2goY2hvcmRUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNob3JkVHlwZXMgPSBjaG9yZFR5cGVzO1xuICAgICAgICB0aGlzLnVzZWRDaG9yZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBidWlsZEF2YWlsYWJsZUNob3JkcygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgIHRoaXMudXNlZENob3JkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3JkcyA9ICh0aGlzLmF2YWlsYWJsZUNob3JkcyB8fCBbXSkuZmlsdGVyKGNob3JkID0+ICEodGhpcy51c2VkQ2hvcmRzIHx8IG5ldyBTZXQoKSkuaGFzKGNob3JkKSk7XG4gICAgICAgIC8vIC8vIEZpcnN0IHRyeSB0byBhZGQgdGhlIHNpbXBsZXN0IGNob3Jkc1xuICAgICAgICAvLyBmb3IgKGNvbnN0IHNpbXBsZUNob3JkVHlwZSBvZiB0aGlzLmNob3JkVHlwZXMuZmlsdGVyKGNob3JkVHlwZSA9PiBbXCJtYWpcIiwgXCJtaW5cIl0uaW5jbHVkZXMoY2hvcmRUeXBlKSkpIHtcbiAgICAgICAgLy8gICAgIGZvciAobGV0IHJhbmRvbVJvb3Q9MDsgcmFuZG9tUm9vdDwxMjsgcmFuZG9tUm9vdCsrKSB7XG4gICAgICAgIC8vICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKHJhbmRvbVJvb3QgKyBzaW1wbGVDaG9yZFR5cGUpKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzLnB1c2gocmFuZG9tUm9vdCArIHNpbXBsZUNob3JkVHlwZSk7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuYXZhaWxhYmxlQ2hvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTwxMDA7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tVHlwZSA9IHRoaXMuY2hvcmRUeXBlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNob3JkVHlwZXMubGVuZ3RoKV07XG4gICAgICAgICAgICBjb25zdCByYW5kb21Sb290ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTIpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKHJhbmRvbVJvb3QgKyByYW5kb21UeXBlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzLnB1c2gocmFuZG9tUm9vdCArIHJhbmRvbVR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBjbGVhblVwKCkge1xuICAgICAgICBpZiAodGhpcy51c2VkQ2hvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3JkcyA9IFtdO1xuICAgICAgICBkZWxldGUgdGhpcy51c2VkQ2hvcmRzO1xuICAgICAgICBkZWxldGUgdGhpcy5hdmFpbGFibGVDaG9yZHM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENob3JkKCkge1xuICAgICAgICBpZiAoIXRoaXMuYXZhaWxhYmxlQ2hvcmRzIHx8IHRoaXMuYXZhaWxhYmxlQ2hvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25zKysgPiAxMDAwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlQ2hvcmRzICYmIHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggLSAzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9yZFR5cGUgPSB0aGlzLmF2YWlsYWJsZUNob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKGNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5hZGQoY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gdGhpcy5hdmFpbGFibGVDaG9yZHMuZmlsdGVyKGNob3JkID0+IGNob3JkICE9PSBjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgYWRkRm9yY2VkTWVsb2R5IH0gZnJvbSBcIi4vZm9yY2VkbWVsb2R5XCI7XG5pbXBvcnQgeyBOb25DaG9yZFRvbmUgfSBmcm9tIFwiLi9ub25jaG9yZHRvbmVzXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IGNsYXNzIFRlbnNpb25FcnJvciBleHRlbmRzIEVycm9yIHt9XG5cblxuZXhwb3J0IGNsYXNzIFRlbnNpb24ge1xuICAgIG5vdEluU2NhbGU6IG51bWJlciA9IDA7XG4gICAgbW9kdWxhdGlvbjogbnVtYmVyID0gMDtcbiAgICBhbGxOb3Rlc1NhbWU6IG51bWJlciA9IDA7XG4gICAgY2hvcmRQcm9ncmVzc2lvbjogbnVtYmVyID0gMDtcbiAgICBrZWVwRG9taW5hbnRUb25lczogbnVtYmVyID0gMDtcbiAgICBwYXJhbGxlbEZpZnRoczogbnVtYmVyID0gMDtcbiAgICBzcGFjaW5nRXJyb3I6IG51bWJlciA9IDA7XG4gICAgY2FkZW5jZTogbnVtYmVyID0gMDtcbiAgICB0ZW5zaW9uaW5nSW50ZXJ2YWw6IG51bWJlciA9IDA7XG4gICAgc2Vjb25kSW52ZXJzaW9uOiBudW1iZXIgPSAwO1xuICAgIGRvdWJsZUxlYWRpbmdUb25lOiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdUb25lVXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5SnVtcDogbnVtYmVyID0gMDtcbiAgICBtZWxvZHlUYXJnZXQ6IG51bWJlciA9IDA7XG4gICAgdm9pY2VEaXJlY3Rpb25zOiBudW1iZXIgPSAwO1xuICAgIG92ZXJsYXBwaW5nOiBudW1iZXIgPSAwO1xuXG4gICAgc2V2ZW50aFRlbnNpb246IG51bWJlciA9IDA7XG5cbiAgICBpbnZlcnNpb25UZW5zaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgZm9yY2VkTWVsb2R5OiBudW1iZXIgPSAwO1xuICAgIG5hYz86IE5vbkNob3JkVG9uZTtcblxuICAgIGJhc3NTY2FsZTogbnVtYmVyID0gMDtcbiAgICBzb3ByYW5vU2NhbGU6IG51bWJlciA9IDA7XG4gICAgb3RoZXJTY2FsZTogbnVtYmVyID0gMDtcbiAgICBiYXNzU29wcmFub1NjYWxlOiBudW1iZXIgPSAwO1xuXG4gICAgdG90YWxUZW5zaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgY29tbWVudDogc3RyaW5nID0gXCJcIjtcblxuICAgIGdldFRvdGFsVGVuc2lvbih2YWx1ZXM/OiB7cGFyYW1zOiBNdXNpY1BhcmFtcywgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZTogbnVtYmVyfSkge1xuICAgICAgICBsZXQgdGVuc2lvbiA9IDA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5ub3RJblNjYWxlICogMTAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubW9kdWxhdGlvbjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmFsbE5vdGVzU2FtZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNob3JkUHJvZ3Jlc3Npb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5rZWVwRG9taW5hbnRUb25lcztcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnBhcmFsbGVsRmlmdGhzICogMTAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuc3BhY2luZ0Vycm9yO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuY2FkZW5jZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnRlbnNpb25pbmdJbnRlcnZhbDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNlY29uZEludmVyc2lvbjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmRvdWJsZUxlYWRpbmdUb25lO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubGVhZGluZ1RvbmVVcDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keVRhcmdldDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keUp1bXA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy52b2ljZURpcmVjdGlvbnM7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5vdmVybGFwcGluZztcblxuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuZm9yY2VkTWVsb2R5O1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuc2V2ZW50aFRlbnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5pbnZlcnNpb25UZW5zaW9uO1xuXG4gICAgICAgIHRlbnNpb24gLT0gdGhpcy5iYXNzU2NhbGU7XG4gICAgICAgIHRlbnNpb24gLT0gdGhpcy5iYXNzU29wcmFub1NjYWxlO1xuXG4gICAgICAgIHRoaXMudG90YWxUZW5zaW9uID0gdGVuc2lvbjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgdG9QcmludCgpIHtcbiAgICAgICAgY29uc3QgdG9QcmludDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcykge1xuICAgICAgICAgICAgaWYgKGAke3RoaXNba2V5XX1gICE9IFwiMFwiICYmIHR5cGVvZiB0aGlzW2tleV0gPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRvUHJpbnRba2V5XSA9ICh0aGlzW2tleV0gYXMgdW5rbm93biBhcyBudW1iZXIpLnRvRml4ZWQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvUHJpbnQ7XG4gICAgfVxuXG4gICAgcHJpbnQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgdG9QcmludCA9IHRoaXMudG9QcmludCgpO1xuICAgICAgICAvLyBQcmludCBvbmx5IHBvc2l0aXZlIHZhbHVlc1xuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbW1lbnQsIC4uLmFyZ3MsIHRvUHJpbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4uYXJncywgdG9QcmludClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gd3JhcFdpdGhQcm94eUNhbGxiYWNrKG9iajogYW55LCBjYWxsYmFjazogRnVuY3Rpb24pOiBhbnkge1xuICAgIHJldHVybiBuZXcgUHJveHkob2JqLCB7XG4gICAgICBnZXQgKHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpXG4gICAgICAgIC8vIHdyYXBzIG5lc3RlZCBkYXRhIHdpdGggUHJveHlcbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB3cmFwV2l0aFByb3h5Q2FsbGJhY2socmVzdWx0LCBjYWxsYmFjaylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9LFxuICAgICAgc2V0ICh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgIC8vIGNhbGxzIGNhbGxiYWNrIG9uIGV2ZXJ5IHNldCBvcGVyYXRpb25cbiAgICAgICAgY2FsbGJhY2sodGFyZ2V0LCBrZXksIHZhbHVlIC8qIGFuZCB3aGF0ZXZlciBlbHNlIHlvdSBuZWVkICovKVxuICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVGVuc2lvbigpOiBUZW5zaW9uIHtcbiAgICByZXR1cm4gd3JhcFdpdGhQcm94eUNhbGxiYWNrKG5ldyBUZW5zaW9uKCksICh0YXJnZXQ6IFRlbnNpb24sIGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIGlmICh0YXJnZXQuZ2V0VG90YWxUZW5zaW9uKCkgPiAyMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRlbnNpb25FcnJvcihcIlRlbnNpb24gdG9vIGhpZ2hcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IHR5cGUgVGVuc2lvblBhcmFtcyA9IHtcbiAgICBkaXZpc2lvbmVkTm90ZXM/OiBEaXZpc2lvbmVkUmljaG5vdGVzLFxuICAgIGJlYXREaXZpc2lvbjogbnVtYmVyLFxuICAgIGZyb21Ob3Rlc092ZXJyaWRlPzogQXJyYXk8Tm90ZT4sXG4gICAgdG9Ob3RlczogQXJyYXk8Tm90ZT4sXG4gICAgY3VycmVudFNjYWxlOiBTY2FsZSxcbiAgICBvcmlnaW5hbFNjYWxlOiBTY2FsZSxcbiAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlPzogbnVtYmVyLFxuICAgIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zLFxuICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc/OiBudW1iZXIsXG4gICAgaW52ZXJzaW9uTmFtZT86IHN0cmluZyxcbiAgICBwcmV2SW52ZXJzaW9uTmFtZT86IFN0cmluZyxcbiAgICBuZXdDaG9yZD86IENob3JkLFxufVxuXG5cbmV4cG9ydCBjb25zdCBnZXRUZW5zaW9uID0gKHRlbnNpb246IFRlbnNpb24sIHZhbHVlczogVGVuc2lvblBhcmFtcyk6IFRlbnNpb24gPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXMsXG4gICAgICAgICAgICBmcm9tTm90ZXNPdmVycmlkZSxcbiAgICAgICAgICAgIHRvTm90ZXMsXG4gICAgICAgICAgICBuZXdDaG9yZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nLFxuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgbWFpblBhcmFtcyxcbiAgICAgICAgICAgIGJlYXREaXZpc2lvbixcbiAgICAgICAgfSA9IHZhbHVlcztcbiAgICAvKlxuICAgICogICBHZXQgdGhlIHRlbnNpb24gYmV0d2VlbiB0d28gY2hvcmRzXG4gICAgKiAgIEBwYXJhbSBmcm9tQ2hvcmQ6IENob3JkXG4gICAgKiAgIEBwYXJhbSB0b0Nob3JkOiBDaG9yZFxuICAgICogICBAcmV0dXJuOiB0ZW5zaW9uIHZhbHVlIGJldHdlZW4gLTEgYW5kIDFcbiAgICAqL1xuXG4gICAgbGV0IHByZXZDaG9yZDtcbiAgICBsZXQgcHJldlByZXZDaG9yZDtcbiAgICBsZXQgcGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgcHJldlBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IGxhdGVzdE5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBpZiAoZGl2aXNpb25lZE5vdGVzKSB7XG4gICAgICAgIGNvbnN0IGxhdGVzdERpdmlzaW9uID0gYmVhdERpdmlzaW9uIC0gQkVBVF9MRU5HVEg7XG4gICAgICAgIGxldCB0bXAgOiBBcnJheTxOb3RlPiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb25dIHx8IFtdKSkge1xuICAgICAgICAgICAgLy8gVXNlIG9yaWdpbmFsIG5vdGVzLCBub3QgdGhlIG9uZXMgdGhhdCBoYXZlIGJlZW4gdHVybmVkIGludG8gTkFDc1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2UHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBmb3IgKGxldCBpPWJlYXREaXZpc2lvbjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlcy5maWx0ZXIobm90ZSA9PiBub3RlKS5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmcm9tTm90ZXNPdmVycmlkZSkge1xuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBmcm9tTm90ZXNPdmVycmlkZTtcbiAgICB9XG5cbiAgICBsZXQgYWxsc2FtZSA9IHRydWU7XG4gICAgZm9yIChsZXQgaT0wOyBpPHRvTm90ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFwYXNzZWRGcm9tTm90ZXNbaV0pIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldlBhc3NlZEZyb21Ob3Rlc1tpXSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXNzZWRGcm9tTm90ZXNbaV0uZXF1YWxzKHRvTm90ZXNbaV0pKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZQYXNzZWRGcm9tTm90ZXNbaV0uZXF1YWxzKHRvTm90ZXNbaV0pKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJldkNob3JkICYmIHByZXZQcmV2Q2hvcmQgJiYgbmV3Q2hvcmQgJiYgcHJldkNob3JkLnRvU3RyaW5nKCkgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSAmJiBwcmV2UHJldkNob3JkLnRvU3RyaW5nKCkgPT0gcHJldkNob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgYWxsc2FtZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChhbGxzYW1lKSB7XG4gICAgICAgIHRlbnNpb24uYWxsTm90ZXNTYW1lID0gMTAwO1xuICAgIH1cblxuICAgIGxldCBmcm9tTm90ZXM7XG4gICAgaWYgKHBhc3NlZEZyb21Ob3Rlcy5sZW5ndGggPCA0KSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHRvTm90ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbU5vdGVzID0gcGFzc2VkRnJvbU5vdGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmVzID0gZnJvbU5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuXG4gICAgLy8gSWYgdGhlIG5vdGVzIGFyZSBub3QgaW4gdGhlIGN1cnJlbnQgc2NhbGUsIGluY3JlYXNlIHRoZSB0ZW5zaW9uXG4gICAgbGV0IG5vdGVzTm90SW5TY2FsZTogQXJyYXk8bnVtYmVyPiA9IFtdXG4gICAgbGV0IG5ld1NjYWxlOiBOdWxsYWJsZTxTY2FsZT4gPSBudWxsO1xuICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTJcblxuICAgIGlmIChjdXJyZW50U2NhbGUpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVTZW1pdG9uZXMgPSBjdXJyZW50U2NhbGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgICAgIG5vdGVzTm90SW5TY2FsZSA9IHRvU2VtaXRvbmVzLmZpbHRlcihzZW1pdG9uZSA9PiAhc2NhbGVTZW1pdG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKTtcbiAgICAgICAgbm90ZXNOb3RJblNjYWxlID0gbm90ZXNOb3RJblNjYWxlLmZpbHRlcihzZW1pdG9uZSA9PiBzZW1pdG9uZSAhPSBsZWFkaW5nVG9uZSk7XG4gICAgICAgIGlmIChub3Rlc05vdEluU2NhbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gUXVpY2sgcmV0dXJuLCB0aGlzIGNob3JkIHN1Y2tzXG4gICAgICAgICAgICB0ZW5zaW9uLm5vdEluU2NhbGUgKz0gMTAwXG4gICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCB0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDYpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAxLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW52ZXJzaW9uTmFtZSAmJiBpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3NlY29uZCcpIHx8IChwcmV2SW52ZXJzaW9uTmFtZSB8fCBcIlwiKS5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhmcm9tU2VtaXRvbmUgLSB0b1NlbWl0b25lKSA+IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNlY29uZEludmVyc2lvbiArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGludmVyc2lvbk5hbWUgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCd0aGlyZCcpIHx8IChwcmV2SW52ZXJzaW9uTmFtZSB8fCBcIlwiKS5zdGFydHNXaXRoKCd0aGlyZCcpKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGZyb21TZW1pdG9uZSAtIHRvU2VtaXRvbmUpID4gMikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uICs9IDEwMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgaWYgKGludmVyc2lvbk5hbWUgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgdGVuc2lvbi5zZWNvbmRJbnZlcnNpb24gLT0gMC4xOyAgLy8gUm9vdCBpbnZlcnNpb25zIGFyZSBncmVhdFxuICAgIH1cblxuICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgIC8vIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgIH1cblxuICAgIGNvbnN0IGxlYWRpbmdUb25lU2VtaXRvbmUgPSBjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgKyAxMTtcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBpZiAoZnJvbUdsb2JhbFNlbWl0b25lICUgMTIgPT0gbGVhZGluZ1RvbmVTZW1pdG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmVzW2ldID09IGZyb21HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIC8vIFN0YXlpbmcgYXQgdGhlIGxlYWRpbmcgdG9uZSBpcyBub3QgYmFkXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwICs9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRvR2xvYmFsU2VtaXRvbmVzW2ldICE9IGZyb21HbG9iYWxTZW1pdG9uZSArIDEpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmxlYWRpbmdUb25lVXAgKz0gMTA7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMSB8fCBpID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmxlYWRpbmdUb25lVXAgLT0gNztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbGVhZGluZ1RvbmVDb3VudCA9IDA7XG4gICAgZm9yIChjb25zdCB0b0dsb2JhbFNlbWl0b25lIG9mIHRvR2xvYmFsU2VtaXRvbmVzKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlSW5kZXg6IG51bWJlciA9IHNlbWl0b25lU2NhbGVJbmRleFsodG9HbG9iYWxTZW1pdG9uZSArIDEyKSAlIDEyXTtcbiAgICAgICAgaWYgKHNjYWxlSW5kZXggPT0gNikge1xuICAgICAgICAgICAgbGVhZGluZ1RvbmVDb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChsZWFkaW5nVG9uZUNvdW50ID4gMSkge1xuICAgICAgICB0ZW5zaW9uLmRvdWJsZUxlYWRpbmdUb25lICs9IDEwO1xuICAgIH1cblxuICAgIC8vIGRvbWluYW50IDd0aCBjaG9yZCBzdHVmZlxuICAgIGlmIChuZXdDaG9yZD8uY2hvcmRUeXBlLmluY2x1ZGVzKCc3JykpIHtcbiAgICAgICAgLy8gTmV2ZXIgZG91YmxlIHRoZSA3dGhcbiAgICAgICAgY29uc3Qgc2V2ZW50aFNlbWl0b25lID0gbmV3Q2hvcmQubm90ZXNbM10uc2VtaXRvbmU7XG4gICAgICAgIGNvbnN0IHNldmVudGhDb3VudCA9IHRvU2VtaXRvbmVzLmZpbHRlcihzZW1pdG9uZSA9PiBzZW1pdG9uZSA9PSBzZXZlbnRoU2VtaXRvbmUpLmxlbmd0aDtcbiAgICAgICAgaWYgKHNldmVudGhDb3VudCA+IDEpIHtcbiAgICAgICAgICAgIHRlbnNpb24uc2V2ZW50aFRlbnNpb24gKz0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZXNbaV0gJSAxMiA9PSBzZXZlbnRoU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2ldKSA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gN3RoIGlzIGFwcHJvYWNoZWQgYnkgbGVhcCFcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5zZXZlbnRoVGVuc2lvbiArPSAxMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZXZDaG9yZD8uY2hvcmRUeXBlLmluY2x1ZGVzKCc3JykpIHtcbiAgICAgICAgaWYgKCFuZXdDaG9yZD8uY2hvcmRUeXBlLmluY2x1ZGVzKCc3JykpIHtcbiAgICAgICAgICAgIC8vIDd0aCBtdXN0IHJlc29sdmUgZG93blxuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFNlbWl0b25lID0gcHJldkNob3JkLm5vdGVzWzNdLnNlbWl0b25lO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50R1RvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzLmZpbHRlcihnVG9uZSA9PiBnVG9uZSAlIDEyID09IHNldmVudGhTZW1pdG9uZSlbMF07XG4gICAgICAgICAgICBjb25zdCBzZXZlbnRoUmVzb2x2ZXNUbyA9IFtzZXZlbnRHVG9uZSAtIDEsIHNldmVudEdUb25lIC0gMl07XG4gICAgICAgICAgICBjb25zdCBzZXZlbnRoUmVzb2x2ZXNUb0NvdW50ID0gdG9HbG9iYWxTZW1pdG9uZXMuZmlsdGVyKGdUb25lID0+IHNldmVudGhSZXNvbHZlc1RvLmluY2x1ZGVzKGdUb25lKSkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHNldmVudGhSZXNvbHZlc1RvQ291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uc2V2ZW50aFRlbnNpb24gKz0gMTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBkaXJlY3Rpb25zXG4gICAgY29uc3QgZGlyZWN0aW9uQ291bnRzID0ge1xuICAgICAgICBcInVwXCI6IDAsXG4gICAgICAgIFwiZG93blwiOiAwLFxuICAgICAgICBcInNhbWVcIjogMCxcbiAgICB9XG4gICAgY29uc3QgcGFydERpcmVjdGlvbiA9IFtdO1xuICAgIGxldCByb290QmFzc0RpcmVjdGlvbiA9IG51bGw7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBjb25zdCBkaWZmID0gdG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZTtcbiAgICAgICAgcGFydERpcmVjdGlvbltpXSA9IGRpZmYgPCAwID8gXCJkb3duXCIgOiBkaWZmID4gMCA/IFwidXBcIiA6IFwic2FtZVwiO1xuICAgICAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLmRvd24gKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA9PSAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMuc2FtZSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmICE9IDAgJiYgKGludmVyc2lvbk5hbWUgfHwgJycpLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgcm9vdEJhc3NEaXJlY3Rpb24gPSBkaWZmID4gMCA/ICd1cCcgOiAnZG93bic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSb290IGJhc3MgbWFrZXMgdXAgZm9yIG9uZSB1cC9kb3duXG4gICAgaWYgKHJvb3RCYXNzRGlyZWN0aW9uID09IFwidXBcIiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA+IDApIHtcbiAgICAgICAgZGlyZWN0aW9uQ291bnRzLmRvd24gLT0gMTtcbiAgICB9XG4gICAgaWYgKHJvb3RCYXNzRGlyZWN0aW9uID09IFwiZG93blwiICYmIGRpcmVjdGlvbkNvdW50cy51cCA+IDApIHtcbiAgICAgICAgZGlyZWN0aW9uQ291bnRzLnVwIC09IDE7XG4gICAgfVxuICAgIGlmIChkaXJlY3Rpb25Db3VudHMudXAgPiAyICYmIGRpcmVjdGlvbkNvdW50cy5kb3duIDwgMSkge1xuICAgICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSAzO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLmRvd24gPiAyICYmIGRpcmVjdGlvbkNvdW50cy51cCA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMztcbiAgICB9XG4gICAgLy8gaWYgKHBhcnREaXJlY3Rpb25bMF0gPT0gcGFydERpcmVjdGlvblszXSAmJiBwYXJ0RGlyZWN0aW9uWzBdICE9IFwic2FtZVwiKSB7XG4gICAgLy8gICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDU7XG4gICAgLy8gICAgIC8vIHJvb3QgYW5kIHNvcHJhbm9zIG1vdmluZyBpbiBzYW1lIGRpcmVjdGlvblxuICAgIC8vIH1cblxuICAgIC8vIFBhcmFsbGVsIG1vdGlvbiBhbmQgaGlkZGVuIGZpZnRoc1xuICAgIGZvciAobGV0IGk9MDsgaTx0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqPWkrMTsgajx0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbaV0gJiYgZnJvbUdsb2JhbFNlbWl0b25lc1tqXSA9PSB0b0dsb2JhbFNlbWl0b25lc1tqXSkge1xuICAgICAgICAgICAgICAgIC8vIFBhcnQgaSBhbmQgaiBhcmUgc3RheWluZyBzYW1lXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWxGcm9tID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgaWYgKGludGVydmFsIDwgMjAgJiYgaW50ZXJ2YWwgJSAxMiA9PSA3IHx8IGludGVydmFsICUgMTIgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFBvc3NpYmx5IGEgcGFyYWxsZWwsIGNvbnRyYXJ5IG9yIGhpZGRlbiBmaWZ0aC9vY3RhdmVcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gaW50ZXJ2YWxGcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgc29wcmFuby1iYXNzIGludGVydmFsIGlzIGhpZGRlblxuICAgIC8vIGkuZS4gcGFydHMgMCBhbmQgMyBhcmUgbW92aW5nIGluIHNhbWUgZGlyZWN0aW9uXG4gICAgLy8gQW5kIHBhcnQgMCBpcyBtYWtpbmcgYSBqdW1wXG4gICAgLy8gQW5kIHRoZSByZXN1bHRpbmcgaW50ZXJ2YWwgaXMgYSBmaWZ0aC9vY3RhdmVcbiAgICBjb25zdCBwYXJ0MERpcmVjdGlvbiA9IHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gZnJvbUdsb2JhbFNlbWl0b25lc1swXTtcbiAgICBjb25zdCBwYXJ0M0RpcmVjdGlvbiA9IHRvR2xvYmFsU2VtaXRvbmVzWzNdIC0gZnJvbUdsb2JhbFNlbWl0b25lc1szXTtcbiAgICBpZiAoTWF0aC5hYnMocGFydDBEaXJlY3Rpb24pID4gMikge1xuICAgICAgICAvLyBVcHBlciBwYXJ0IGlzIG1ha2luZyBhIGp1bXBcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzNdKSAlIDEyO1xuICAgICAgICBpZiAoKGludGVydmFsID09IDcgfHwgaW50ZXJ2YWwgPT0gMCkgJiYgTWF0aC5zaWduKHBhcnQwRGlyZWN0aW9uKSA9PSBNYXRoLnNpZ24ocGFydDNEaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICAvLyBTYW1lIGRpcmVjdGlvbiBhbmQgcmVzdWx0aW5nIGludGVydmFsIGlzIGEgZmlmdGgvb2N0YXZlXG4gICAgICAgICAgICB0ZW5zaW9uLnBhcmFsbGVsRmlmdGhzICs9IDExO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGk9MDsgaTwzOyBpKyspIHtcbiAgICAgICAgY29uc3QgdG9JbnRlcnZhbFdpdGhCYXNzID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSkgJSAxMjtcbiAgICAgICAgY29uc3QgZnJvbUludGVyVmFsV2l0aEJhc3MgPSBNYXRoLmFicyhmcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1szXSkgJSAxMjtcbiAgICAgICAgaWYgKGZyb21JbnRlclZhbFdpdGhCYXNzID09IDYpIHtcbiAgICAgICAgICAgIGlmICh0b0ludGVydmFsV2l0aEJhc3MgPT0gNykge1xuICAgICAgICAgICAgICAgIC8vIFVuZXF1YWwgZmlmdGhzIChkaW1pbmlzaGVkIDV0aCB0byBwZXJmZWN0IDV0aCkgd2l0aCBiYXNzXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5wYXJhbGxlbEZpZnRocyArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNwYWNpbmcgZXJyb3JzXG4gICAgY29uc3QgcGFydDBUb1BhcnQxID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1sxXSk7XG4gICAgY29uc3QgcGFydDFUb1BhcnQyID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMV0gLSB0b0dsb2JhbFNlbWl0b25lc1syXSk7XG4gICAgY29uc3QgcGFydDJUb1BhcnQzID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMl0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSk7XG4gICAgaWYgKHBhcnQxVG9QYXJ0MiA+IDEyIHx8IHBhcnQwVG9QYXJ0MSA+IDEyIHx8IHBhcnQyVG9QYXJ0MyA+ICgxMiArIDcpKSB7XG4gICAgICAgIHRlbnNpb24uc3BhY2luZ0Vycm9yICs9IDU7XG4gICAgfVxuXG4gICAgLy8gT3ZlcmxhcHBpbmcgZXJyb3JcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBsb3dlckZyb21HVG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaSArIDFdO1xuICAgICAgICBjb25zdCBsb3dlclRvR1RvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpICsgMV07XG4gICAgICAgIGNvbnN0IHVwcGVyRnJvbUdUb25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHVwcGVyVG9HVG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2kgLSAxXTtcbiAgICAgICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBpZiAodXBwZXJUb0dUb25lIHx8IHVwcGVyRnJvbUdUb25lKSB7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZSA+IE1hdGgubWluKHVwcGVyVG9HVG9uZSB8fCAwLCB1cHBlckZyb21HVG9uZSB8fCAwKSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24ub3ZlcmxhcHBpbmcgKz0gMTA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvd2VyVG9HVG9uZSB8fCBsb3dlckZyb21HVG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmUgPCBNYXRoLm1heChsb3dlclRvR1RvbmUgfHwgMCwgbG93ZXJGcm9tR1RvbmUgfHwgMCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWVsb2R5IHRlbnNpb25cbiAgICAvLyBBdm9pZCBqdW1wcyB0aGF0IGFyZSBhdWcgb3IgN3RoIG9yIGhpZ2hlclxuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBtZWxvZHlKdW1wTXVsdGlwbGllciA9IDE7XG4gICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgIG1lbG9keUp1bXBNdWx0aXBsaWVyID0gMC4xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09IDMpIHtcbiAgICAgICAgICAgIG1lbG9keUp1bXBNdWx0aXBsaWVyID0gMC4zO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgaWYgKGludGVydmFsID49IDMpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjUgKiBtZWxvZHlKdW1wTXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gMTIpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjUgKiBtZWxvZHlKdW1wTXVsdGlwbGllcjtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSA1KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMSAqIG1lbG9keUp1bXBNdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+IDcpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyICogbWVsb2R5SnVtcE11bHRpcGxpZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID49IDEwKSB7ICAvLyA3dGggPT0gMTBcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDA7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNiB8fCBpbnRlcnZhbCA9PSA4KSAvLyB0cml0b25lIChhdWcgNHRoKSBvciBhdWcgNXRoXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDAgKiBtZWxvZHlKdW1wTXVsdGlwbGllcjtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSA3KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMSAqIG1lbG9keUp1bXBNdWx0aXBsaWVyO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDkpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyICogbWVsb2R5SnVtcE11bHRpcGxpZXI7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFByZXZlbnQgemlnIHphZ2dpblxuXG4gICAgLy8gMCBwcmlpbWlcbiAgICAvLyAxIHBpZW5pIHNla3VudGlcbiAgICAvLyAyIHN1dXJpIHNla3VudGlcbiAgICAvLyAzIHBpZW5pIHRlcnNzaVxuICAgIC8vIDQgc3V1cmkgdGVyc3NpXG4gICAgLy8gNSBrdmFydHRpXG4gICAgLy8gNiB0cml0b251c1xuICAgIC8vIDcga3ZpbnR0aVxuICAgIC8vIDggcGllbmkgc2Vrc3RpXG4gICAgLy8gOSBzdXVyaSBzZWtzdGlcbiAgICAvLyAxMCBwaWVuaSBzZXB0aW1pXG4gICAgLy8gMTEgc3V1cmkgc2VwdGltaVxuICAgIC8vIDEyIG9rdGFhdmlcblxuICAgIGlmIChsYXRlc3ROb3RlcyAmJiBsYXRlc3ROb3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICBjb25zdCBsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzID0gbGF0ZXN0Tm90ZXMubWFwKChuKSA9PiBnbG9iYWxTZW1pdG9uZShuKSk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlcmUgd2FzIGEganVtcC4gV0UgTVVTVCBHTyBCQUNLIVxuICAgICAgICAgICAgICAgIC8vIEJhc2ljYWxseSB0aGUgdG9HbG9iYWxTZW1pdG9uZSBtdXN0IGJlIGJldHdlZW4gdGhlIHByZXZGcm9tR2xvYmFsU2VtaXRvbmUgYW5kIHRoZSBmcm9tR2xvYmFsU2VtaXRvbmVcbiAgICAgICAgICAgICAgICAvLyBVTkxFU1Mgd2UncmUgb3V0bGluaW5nIGEgdHJpYWQuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3b3VsZCBtZWFuIHRoYXQgYWZ0ZXIgYSA0dGggdXAsIHdlIG5lZWQgdG8gZ28gdXAgYW5vdGhlciAzcmRcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2RnJvbVNlbWl0b25lID0gbGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25NdWx0aXBsaWVyID0gZnJvbVNlbWl0b25lID4gcHJldkZyb21TZW1pdG9uZSA/IDEgOiAtMTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0SW50ZXJ2YWwgPSBkaXJlY3Rpb25NdWx0aXBsaWVyICogKHRvU2VtaXRvbmUgLSBmcm9tU2VtaXRvbmUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtaW5vciAzcmQgdXAsIHRoZW4gbWFqIHRoaXJkIHVwLiBUaGF0J3MgYSByb290IGludmVyc2lvbiBtaW5vciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlub3IgM3JkIHVwLCB0aGVuIHBlcmZlY3QgNHRoIHVwLiBUaGF0J3MgYSBmaXJzdCBpbnZlcnNpb24gbWFqb3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ham9yIDNyZCB1cCwgdGhlbiBtaW5vciAzcmQgdXAuIFRoYXQncyBhIHJvb3QgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWpvciAzcmQgdXAsIHRoZW4gcGVyZmVjdCA0dGggdXAuIFRoYXQncyBhIGZpcnN0IGludmVyc2lvbiBtaW5vciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyZmVjdCA0dGggdXAsIHRoZW4gbWlub3IgM3JkIHVwLiBUaGF0J3MgYSBzZWNvbmQgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwZXJmZWN0IDR0aCB1cCwgdGhlbiBtYWpvciAzcmQgdXAuIFRoYXQncyBhIHNlY29uZCBpbnZlcnNpb24gbWFqb3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGlnaGVyIHRoYW4gdGhhdCwgbm8gdHJpYWQgaXMgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IChpID09IDAgfHwgaSA9PSAzKSA/IDAuMiA6IDE7XG4gICAgICAgICAgICAgICAgaWYgKChmcm9tU2VtaXRvbmUgPj0gcHJldkZyb21TZW1pdG9uZSAmJiB0b1NlbWl0b25lID49IGZyb21TZW1pdG9uZSkgfHwgKGZyb21TZW1pdG9uZSA8PSBwcmV2RnJvbVNlbWl0b25lICYmIHRvU2VtaXRvbmUgPD0gZnJvbVNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3QgZ29pbmYgYmFjayBkb3duL3VwLi4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41ICogbXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA8PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMiAqIG11bHRpcGxpZXI7ICAvLyBOb3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTAwOyAgLy8gVGVycmlibGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGJhY2sgZG93bi91cC4uLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrSW50ZXJ2YWwgPSBNYXRoLmFicyh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhY2tJbnRlcnZhbCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGJhY2sgdG9vIG11Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDAuNSAqIG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludGVydmFsIDw9IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMiAqIG11bHRpcGxpZXI7ICAvLyBOb3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcmV2UGFzc2VkRnJvbUdUb25lcyA9IHByZXZQYXNzZWRGcm9tTm90ZXMgPyBwcmV2UGFzc2VkRnJvbU5vdGVzLm1hcCgobikgPT4gZ2xvYmFsU2VtaXRvbmUobikpIDogW107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTw0OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lc0ZvclRoaXNQYXJ0ID0gW107XG4gICAgICAgICAgICBpZiAocHJldlBhc3NlZEZyb21HVG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKHByZXZQYXNzZWRGcm9tR1RvbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdUb25lc0ZvclRoaXNQYXJ0LnB1c2goZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAobGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXSAmJiBsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldICE9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaCh0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG5cbiAgICAgICAgICAgIGxldCBnZW5lcmFsRGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgIC8vIEdldCBkaXJlY3Rpb25zIGJlZm9yZSBsYXRlc3Qgbm90ZXNcbiAgICAgICAgICAgIC8vIEUuZy4gaWYgdGhlIG5vdGUgdmFsdWVzIGhhdmUgYmVlbiAwLCAxLCA0LCAwXG4gICAgICAgICAgICAvLyB0aGUgZ2VuZXJhbERpcmVjdGlvbiB3b3VsZCBiZSAxICsgNCA9PSA1LCB3aGljaCBtZWFucyB0aGF0IGV2ZW4gdGhvdWdoIHRoZVxuICAgICAgICAgICAgLy8gZ2xvYmFsIGRpcmVjdGlvbiBpcyBcInNhbWVcIiwgdGhlIGdlbmVyYWwgZGlyZWN0aW9uIGlzIFwidXBcIlxuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPGdUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDI7IGorKykge1xuICAgICAgICAgICAgICAgIGdlbmVyYWxEaXJlY3Rpb24gKz0gZ1RvbmVzRm9yVGhpc1BhcnRbaisxXSAtIGdUb25lc0ZvclRoaXNQYXJ0W2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBnbG9iYWxEaXJlY3Rpb24gPSBnVG9uZXNGb3JUaGlzUGFydFtnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAxXSAtIGdUb25lc0ZvclRoaXNQYXJ0WzBdO1xuICAgICAgICAgICAgY29uc3QgZmluYWxEaXJlY3Rpb24gPSBnVG9uZXNGb3JUaGlzUGFydFtnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAxXSAtIGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDJdO1xuXG4gICAgICAgICAgICBpZiAoZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMV0gIT0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMl0gJiYgZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMV0gPT0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gM10pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8gdGhlIHNhbWUgbm90ZSBhcyBiZWZvcmUuIFRoYXQncyBiYWQuXG4gICAgICAgICAgICAgICAgICAgIC8vIFppZyB6YWdnaW5nXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCA+PSA0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGdUb25lc0ZvclRoaXNQYXJ0WzBdID09IGdUb25lc0ZvclRoaXNQYXJ0WzJdICYmIGdUb25lc0ZvclRoaXNQYXJ0WzFdID09IGdUb25lc0ZvclRoaXNQYXJ0WzNdICYmIGdUb25lc0ZvclRoaXNQYXJ0WzBdICE9IGdUb25lc0ZvclRoaXNQYXJ0WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEV2ZW4gd29yc2UgemlnIHphZ1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAxMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsRGlyZWN0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVMaW1pdCA9IHN0YXJ0aW5nTm90ZXMocGFyYW1zKS5zZW1pdG9uZUxpbWl0c1tpXTtcblxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXROb3RlID0gc2VtaXRvbmVMaW1pdFsxXSAtIDQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm90ZSAtPSBpICogMjtcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0TG93Tm90ZSA9IHNlbWl0b25lTGltaXRbMF0gKyAxMDtcbiAgICAgICAgICAgICAgICB0YXJnZXRMb3dOb3RlICs9IGkgKiAyO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldE5vdGVSZWFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldExvd05vdGVSZWFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb24gPSBwYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZGl2PWJlYXREaXZpc2lvbjsgZGl2PmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uOyBkaXYtLSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub3RlcyA9IChkaXZpc2lvbmVkTm90ZXMgfHwge30pW2Rpdl0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJldk5vdGUgb2Ygbm90ZXMuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbFNlbWl0b25lKHByZXZOb3RlLm5vdGUpID49IHRhcmdldE5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb3RlUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsU2VtaXRvbmUocHJldk5vdGUubm90ZSkgPD0gdGFyZ2V0TG93Tm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExvd05vdGVSZWFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXROb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIlRhcmdldCBub3RlIHJlYWNoZWQgXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRhcmdldE5vdGUpIDw9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGNsb3NlIHRvIHRoZSB0YXJnZXQgbm90ZSwgbGV0J3MgTk9UIGdvIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdGFyZ2V0Tm90ZSkgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY2xvc2UgdG8gdGhlIHRhcmdldCBub3RlLCBsZXQncyBOT1QgYSBsb3QgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZW5lcmFsRGlyZWN0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSBnZW5lcmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRGlyZWN0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IGZpbmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA8PSAwICYmIGZpbmFsRGlyZWN0aW9uIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW4gZG93biwgbm90IGdvb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IC0xICogZ2xvYmFsRGlyZWN0aW9uICogMlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRMb3dOb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIlRhcmdldCBsb3cgbm90ZSByZWFjaGVkIFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0YXJnZXRMb3dOb3RlKSA8PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyBkb3duXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdGFyZ2V0TG93Tm90ZSkgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY2xvc2UgdG8gdGhlIHRhcmdldCBub3RlLCBsZXQncyBOT1QgYSBsb3QgZG93blxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdlbmVyYWxEaXJlY3Rpb24gPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IC0xICogZ2VuZXJhbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAtMSAqIGZpbmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA+PSAwICYmIGZpbmFsRGlyZWN0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXROb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW4gdXAsIG5vdCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gZ2xvYmFsRGlyZWN0aW9uICogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2VuZXJhbERpcmVjdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW5zaW9uO1xufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNlbWl0b25lIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuXG5leHBvcnQgY29uc3QgQkVBVF9MRU5HVEggPSAxMjtcblxudHlwZSBQaWNrTnVsbGFibGU8VD4gPSB7XG4gICAgW1AgaW4ga2V5b2YgVCBhcyBudWxsIGV4dGVuZHMgVFtQXSA/IFAgOiBuZXZlcl06IFRbUF1cbn1cblxudHlwZSBQaWNrTm90TnVsbGFibGU8VD4gPSB7XG4gICAgW1AgaW4ga2V5b2YgVCBhcyBudWxsIGV4dGVuZHMgVFtQXSA/IG5ldmVyIDogUF06IFRbUF1cbn1cblxuZXhwb3J0IHR5cGUgT3B0aW9uYWxOdWxsYWJsZTxUPiA9IHtcbiAgICBbSyBpbiBrZXlvZiBQaWNrTnVsbGFibGU8VD5dPzogRXhjbHVkZTxUW0tdLCBudWxsPlxufSAmIHtcbiAgICAgICAgW0sgaW4ga2V5b2YgUGlja05vdE51bGxhYmxlPFQ+XTogVFtLXVxuICAgIH1cblxuXG5leHBvcnQgY29uc3Qgc2VtaXRvbmVEaXN0YW5jZSA9ICh0b25lMTogbnVtYmVyLCB0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gZGlzdGFuY2UgZnJvbSAwIHRvIDExIHNob3VsZCBiZSAxXG4gICAgLy8gMCAtIDExICsgMTIgPT4gMVxuICAgIC8vIDExIC0gMCArIDEyID0+IDIzID0+IDExXG5cbiAgICAvLyAwIC0gNiArIDEyID0+IDZcbiAgICAvLyA2IC0gMCArIDEyID0+IDE4ID0+IDZcblxuICAgIC8vIDAgKyA2IC0gMyArIDYgPSA2IC0gOSA9IC0zXG4gICAgLy8gNiArIDYgLSA5ICsgNiA9IDEyIC0gMTUgPSAwIC0gMyA9IC0zXG4gICAgLy8gMTEgKyA2IC0gMCArIDYgPSAxNyAtIDYgPSA1IC0gNiA9IC0xXG4gICAgLy8gMCArIDYgLSAxMSArIDYgPSA2IC0gMTcgPSA2IC0gNSA9IDFcblxuICAgIC8vICg2ICsgNikgJSAxMiA9IDBcbiAgICAvLyAoNSArIDYpICUgMTIgPSAxMVxuICAgIC8vIFJlc3VsdCA9IDExISEhIVxuXG4gICAgcmV0dXJuIE1hdGgubWluKFxuICAgICAgICBNYXRoLmFicyh0b25lMSAtIHRvbmUyKSxcbiAgICAgICAgTWF0aC5hYnMoKHRvbmUxICsgNikgJSAxMiAtICh0b25lMiArIDYpICUgMTIpXG4gICAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleCA9IChzY2FsZTogU2NhbGUpOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0+ICh7XG4gICAgW3NjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCxcbiAgICBbc2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLFxuICAgIFtzY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsXG4gICAgW3NjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMyxcbiAgICBbc2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LFxuICAgIFtzY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsXG4gICAgW3NjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNixcbn0pXG5cblxuZXhwb3J0IGNvbnN0IG5leHRHVG9uZUluU2NhbGUgPSAoZ1RvbmU6IFNlbWl0b25lLCBpbmRleERpZmY6IG51bWJlciwgc2NhbGU6IFNjYWxlKTogTnVsbGFibGU8bnVtYmVyPiA9PiB7XG4gICAgbGV0IGdUb25lMSA9IGdUb25lO1xuICAgIGNvbnN0IHNjYWxlSW5kZXhlcyA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlcbiAgICBsZXQgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIGdUb25lMSA9IGdUb25lICsgMTtcbiAgICAgICAgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgfVxuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSAtIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5ld1NjYWxlSW5kZXggPSAoc2NhbGVJbmRleCArIGluZGV4RGlmZikgJSA3O1xuICAgIGNvbnN0IG5ld1NlbWl0b25lID0gc2NhbGUubm90ZXNbbmV3U2NhbGVJbmRleF0uc2VtaXRvbmU7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBzZW1pdG9uZURpc3RhbmNlKGdUb25lMSAlIDEyLCBuZXdTZW1pdG9uZSk7XG4gICAgY29uc3QgbmV3R3RvbmUgPSBnVG9uZTEgKyAoZGlzdGFuY2UgKiAoaW5kZXhEaWZmID4gMCA/IDEgOiAtMSkpO1xuXG4gICAgcmV0dXJuIG5ld0d0b25lO1xufVxuXG5cbmV4cG9ydCBjb25zdCBzdGFydGluZ05vdGVzID0gKHBhcmFtczogTXVzaWNQYXJhbXMpID0+IHtcbiAgICBjb25zdCBwMU5vdGUgPSBwYXJhbXMucGFydHNbMF0ubm90ZSB8fCBcIkY0XCI7XG4gICAgY29uc3QgcDJOb3RlID0gcGFyYW1zLnBhcnRzWzFdLm5vdGUgfHwgXCJDNFwiO1xuICAgIGNvbnN0IHAzTm90ZSA9IHBhcmFtcy5wYXJ0c1syXS5ub3RlIHx8IFwiQTNcIjtcbiAgICBjb25zdCBwNE5vdGUgPSBwYXJhbXMucGFydHNbM10ubm90ZSB8fCBcIkMzXCI7XG5cbiAgICBjb25zdCBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyA9IFtcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDFOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAyTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwM05vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDROb3RlKSksXG4gICAgXVxuXG4gICAgY29uc3Qgc2VtaXRvbmVMaW1pdHMgPSBbXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1swXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMF0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzFdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1syXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbM10gKyAxMiAtIDVdLFxuICAgIF1cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyxcbiAgICAgICAgc2VtaXRvbmVMaW1pdHMsXG4gICAgfVxufVxuXG5cbmNvbnN0IG15U2VtaXRvbmVTdHJpbmdzOiB7W2tleTogbnVtYmVyXTogc3RyaW5nfSA9IHtcbiAgICAwOiBcIkNcIixcbiAgICAxOiBcIkMjXCIsXG4gICAgMjogXCJEXCIsXG4gICAgMzogXCJEI1wiLFxuICAgIDQ6IFwiRVwiLFxuICAgIDU6IFwiRlwiLFxuICAgIDY6IFwiRiNcIixcbiAgICA3OiBcIkdcIixcbiAgICA4OiBcIkcjXCIsXG4gICAgOTogXCJBXCIsXG4gICAgMTA6IFwiQSNcIixcbiAgICAxMTogXCJCXCIsXG59XG5cblxuZXhwb3J0IGNvbnN0IGdUb25lU3RyaW5nID0gKGdUb25lOiBudW1iZXIgfCBudWxsKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICB9XG4gICAgcmV0dXJuIGAke215U2VtaXRvbmVTdHJpbmdzW2dUb25lICUgMTJdfSR7TWF0aC5mbG9vcihnVG9uZSAvIDEyKX1gO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhcnJheU9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXk6IEFycmF5PGFueT4sIHNlbGVjdG9yOiBDYWxsYWJsZUZ1bmN0aW9uLCBkZXNjID0gZmFsc2UpIHtcbiAgICByZXR1cm4gWy4uLmFycmF5XS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSBzZWxlY3RvcihhKTtcbiAgICAgICAgYiA9IHNlbGVjdG9yKGIpO1xuXG4gICAgICAgIGlmIChhID09IGIpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gKGRlc2MgPyBhID4gYiA6IGEgPCBiKSA/IC0xIDogMTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRUZW1wbGF0ZXM6IHsgW2tleTogc3RyaW5nXTogQXJyYXk8bnVtYmVyPiB9ID0ge1xuICAgIG1hajogWzAsIDQsIDddLFxuICAgIG1pbjogWzAsIDMsIDddLFxuICAgIGRpbTogWzAsIDMsIDZdLFxuICAgIGRpbTc6IFswLCAzLCA2LCAxMF0sXG4gICAgYXVnOiBbMCwgNCwgOF0sXG4gICAgbWFqNzogWzAsIDQsIDcsIDExXSxcbiAgICBtaW43OiBbMCwgMywgNywgMTBdLFxuICAgIGRvbTc6IFswLCA0LCA3LCAxMF0sXG4gICAgc3VzMjogWzAsIDIsIDddLFxuICAgIHN1czQ6IFswLCA1LCA3XSxcbn1cblxuXG5leHBvcnQgY2xhc3MgQ2hvcmQge1xuICAgIHB1YmxpYyBub3RlczogQXJyYXk8Tm90ZT47XG4gICAgcHVibGljIHJvb3Q6IG51bWJlcjtcbiAgICBwdWJsaWMgY2hvcmRUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICAvLyBGaW5kIGNvcnJlY3QgU2VtaXRvbmUga2V5XG4gICAgICAgIGNvbnN0IHNlbWl0b25lS2V5cyA9IE9iamVjdC5rZXlzKFNlbWl0b25lKS5maWx0ZXIoa2V5ID0+IChTZW1pdG9uZSBhcyBhbnkpW2tleV0gYXMgbnVtYmVyID09PSB0aGlzLm5vdGVzWzBdLnNlbWl0b25lKTtcbiAgICAgICAgaWYgKHNlbWl0b25lS2V5cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm90ZXMubWFwKG5vdGUgPT4gbm90ZS50b1N0cmluZygpKS5qb2luKFwiLCBcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbWl0b25lS2V5ID0gc2VtaXRvbmVLZXlzLmZpbHRlcihrZXkgPT4ga2V5LmluZGV4T2YoJ2InKSA9PSAtMSAmJiBrZXkuaW5kZXhPZigncycpID09IC0xKVswXSB8fCBzZW1pdG9uZUtleXNbMF07XG4gICAgICAgIHNlbWl0b25lS2V5ID0gc2VtaXRvbmVLZXkucmVwbGFjZSgncycsICcjJyk7XG4gICAgICAgIHJldHVybiBzZW1pdG9uZUtleSArIHRoaXMuY2hvcmRUeXBlO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihzZW1pdG9uZU9yTmFtZTogbnVtYmVyIHwgc3RyaW5nLCBjaG9yZFR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgc2VtaXRvbmU7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VtaXRvbmVPck5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHNlbWl0b25lID0gc2VtaXRvbmVPck5hbWUubWF0Y2goL15cXGQrLyk7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gc2VtaXRvbmVPck5hbWUubWF0Y2goL15cXGQrKC4qKS8pO1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkludmFsaWQgY2hvcmQgbmFtZSBcIiArIHNlbWl0b25lT3JOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnNlZFR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBjaG9yZCBuYW1lIFwiICsgc2VtaXRvbmVPck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHBhcnNlSW50KHNlbWl0b25lWzBdKTtcbiAgICAgICAgICAgIGNob3JkVHlwZSA9IGNob3JkVHlwZSB8fCBwYXJzZWRUeXBlWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VtaXRvbmUgPSBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QgPSBwYXJzZUludChgJHtzZW1pdG9uZX1gKTtcbiAgICAgICAgdGhpcy5jaG9yZFR5cGUgPSBjaG9yZFR5cGUgfHwgXCI/XCI7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gY2hvcmRUZW1wbGF0ZXNbdGhpcy5jaG9yZFR5cGVdO1xuICAgICAgICBpZiAodGVtcGxhdGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVua25vd24gY2hvcmQgdHlwZTogXCIgKyBjaG9yZFR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBub3RlIG9mIHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGVzLnB1c2gobmV3IE5vdGUoeyBzZW1pdG9uZTogKHNlbWl0b25lICsgbm90ZSkgJSAxMiwgb2N0YXZlOiAxIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgdHlwZSBOdWxsYWJsZTxUPiA9IFQgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBNdXNpY1Jlc3VsdCA9IHtcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIHNjYWxlOiBTY2FsZSxcbn1cblxuZXhwb3J0IHR5cGUgUmljaE5vdGUgPSB7XG4gICAgbm90ZTogTm90ZSxcbiAgICBvcmlnaW5hbE5vdGU/OiBOb3RlLFxuICAgIGR1cmF0aW9uOiBudW1iZXIsXG4gICAgZnJlcT86IG51bWJlcixcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgcGFydEluZGV4OiBudW1iZXIsXG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIG9yaWdpbmFsU2NhbGU6IFNjYWxlLFxuICAgIGJlYW0/OiBzdHJpbmcsXG4gICAgdGllPzogc3RyaW5nLFxuICAgIHRlbnNpb246IFRlbnNpb24sXG4gICAgaW52ZXJzaW9uTmFtZT86IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgRGl2aXNpb25lZFJpY2hub3RlcyA9IHtcbiAgICBba2V5OiBudW1iZXJdOiBBcnJheTxSaWNoTm90ZT4sXG59XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxTZW1pdG9uZSA9IChub3RlOiBOb3RlKSA9PiB7XG4gICAgcmV0dXJuIG5vdGUuc2VtaXRvbmUgKyAoKG5vdGUub2N0YXZlKSAqIDEyKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldENsb3Nlc3RPY3RhdmUgPSAobm90ZTogTm90ZSwgdGFyZ2V0Tm90ZTogTnVsbGFibGU8Tm90ZT4gPSBudWxsLCB0YXJnZXRTZW1pdG9uZTogTnVsbGFibGU8bnVtYmVyPiA9IG51bGwpID0+IHtcbiAgICBsZXQgc2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZShub3RlKTtcbiAgICBpZiAoIXRhcmdldE5vdGUgJiYgIXRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRhcmdldCBub3RlIG9yIHNlbWl0b25lIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0YXJnZXRTZW1pdG9uZSA9IHRhcmdldFNlbWl0b25lIHx8IGdsb2JhbFNlbWl0b25lKHRhcmdldE5vdGUgYXMgTm90ZSk7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZTogXCIsIHNlbWl0b25lLCB0YXJnZXRTZW1pdG9uZSk7XG4gICAgLy8gVXNpbmcgbW9kdWxvIGhlcmUgLT4gLTcgJSAxMiA9IC03XG4gICAgLy8gLTEzICUgMTIgPSAtMVxuICAgIGlmIChzZW1pdG9uZSA9PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICByZXR1cm4gbm90ZS5vY3RhdmU7XG4gICAgfVxuICAgIGNvbnN0IGRlbHRhOiBudW1iZXIgPSB0YXJnZXRTZW1pdG9uZSA+IHNlbWl0b25lID8gMTIgOiAtMTI7XG4gICAgbGV0IHJldCA9IDA7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGNsZWFuT2N0YXZlID0gKG9jdGF2ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChvY3RhdmUsIDIpLCA2KTtcbiAgICB9XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZmluaXRlIGxvb3BcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VtaXRvbmUgKz0gZGVsdGE7XG4gICAgICAgIHJldCArPSBkZWx0YSAvIDEyOyAgLy8gSG93IG1hbnkgb2N0YXZlcyB3ZSBjaGFuZ2VkXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA+PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lIC0gMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA8PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lICsgMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlQ2lyY2xlOiB7IFtrZXk6IG51bWJlcl06IEFycmF5PG51bWJlcj4gfSA9IHt9XG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DXSA9IFtTZW1pdG9uZS5HLCBTZW1pdG9uZS5GXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR10gPSBbU2VtaXRvbmUuRCwgU2VtaXRvbmUuQ11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkRdID0gW1NlbWl0b25lLkEsIFNlbWl0b25lLkddXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BXSA9IFtTZW1pdG9uZS5FLCBTZW1pdG9uZS5EXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRV0gPSBbU2VtaXRvbmUuQiwgU2VtaXRvbmUuQV1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJdID0gW1NlbWl0b25lLkZzLCBTZW1pdG9uZS5FXVxuXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5GXSA9IFtTZW1pdG9uZS5DLCBTZW1pdG9uZS5CYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJiXSA9IFtTZW1pdG9uZS5GLCBTZW1pdG9uZS5FYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkViXSA9IFtTZW1pdG9uZS5CYiwgU2VtaXRvbmUuQWJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BYl0gPSBbU2VtaXRvbmUuRWIsIFNlbWl0b25lLkRiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRGJdID0gW1NlbWl0b25lLkFiLCBTZW1pdG9uZS5HYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkdiXSA9IFtTZW1pdG9uZS5EYiwgU2VtaXRvbmUuQ2JdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DYl0gPSBbU2VtaXRvbmUuR2IsIFNlbWl0b25lLkZiXVxuXG5cbmV4cG9ydCBjb25zdCBtYWpTY2FsZURpZmZlcmVuY2UgPSAoc2VtaXRvbmUxOiBudW1iZXIsIHNlbWl0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gR2l2ZW4gdHdvIG1ham9yIHNjYWxlcywgcmV0dXJuIGhvdyBjbG9zZWx5IHJlbGF0ZWQgdGhleSBhcmVcbiAgICAvLyAwID0gc2FtZSBzY2FsZVxuICAgIC8vIDEgPSBFLkcuIEMgYW5kIEYgb3IgQyBhbmQgR1xuICAgIGxldCBjdXJyZW50VmFsID0gbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmUxXTtcbiAgICBpZiAoc2VtaXRvbmUxID09IHNlbWl0b25lMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsLmluY2x1ZGVzKHNlbWl0b25lMikpIHtcbiAgICAgICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdDdXJyZW50VmFsID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbWl0b25lIG9mIGN1cnJlbnRWYWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3U2VtaXRvbmUgb2YgbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmVdKSB7XG4gICAgICAgICAgICAgICAgbmV3Q3VycmVudFZhbC5hZGQobmV3U2VtaXRvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRWYWwgPSBbLi4ubmV3Q3VycmVudFZhbF0gYXMgQXJyYXk8bnVtYmVyPjtcbiAgICB9XG4gICAgcmV0dXJuIDEyO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBkaXZpc2lvbjogbnVtYmVyLCBwYXJ0SW5kZXg6IG51bWJlcik6IFJpY2hOb3RlIHwgbnVsbCA9PiB7XG4gICAgaWYgKGRpdmlzaW9uIGluIGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSkge1xuICAgICAgICAgICAgaWYgKG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgY29uc3QgbWVsb2R5Umh5dGhtU3RyaW5nID0gbWFpblBhcmFtcy5tZWxvZHlSaHl0aG07XG4gICAgLy8gRmlndXJlIG91dCB3aGF0IG5lZWRzIHRvIGhhcHBlbiBlYWNoIGJlYXQgdG8gZ2V0IG91ciBtZWxvZHlcbiAgICBsZXQgcmh5dGhtRGl2aXNpb24gPSAwO1xuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9uczogeyBba2V5OiBudW1iZXJdOiBudW1iZXI7IH0gPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lbG9keVJoeXRobVN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByaHl0aG0gPSBtZWxvZHlSaHl0aG1TdHJpbmdbaV07XG4gICAgICAgIGlmIChyaHl0aG0gPT0gXCJXXCIpIHtcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAqIDQ7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAqIDQ7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiSFwiKSB7XG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIlFcIikge1xuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gTm90aGluZyB0byBkb1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIkVcIikge1xuICAgICAgICAgICAgLy8gVGhpcyBkaXZpc2lvbiBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gRWlnaHRoXG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggLyAyO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIlNcIikge1xuICAgICAgICAgICAgLy8gVGhpcyBkaXZpc2lvbiBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gU2l4dGVlbnRoXG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggLyA0O1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggLyA0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByaHl0aG1OZWVkZWREdXJhdGlvbnM7XG59XG5cblxuZXhwb3J0IHR5cGUgTWVsb2R5TmVlZGVkVG9uZSA9IHtcbiAgICBba2V5OiBudW1iZXJdOiB7XG4gICAgICAgIHRvbmU6IG51bWJlcixcbiAgICAgICAgZHVyYXRpb246IG51bWJlcixcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVsb2R5TmVlZGVkVG9uZXMobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKTogTWVsb2R5TmVlZGVkVG9uZSB7XG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zID0gZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zKG1haW5QYXJhbXMpO1xuICAgIGNvbnN0IGZvcmNlZE1lbG9keUFycmF5ID0gbWFpblBhcmFtcy5mb3JjZWRNZWxvZHkgfHwgXCJcIjtcbiAgICBjb25zdCByZXQ6IE1lbG9keU5lZWRlZFRvbmUgPSB7fTtcbiAgICAvLyBGaWd1cmUgb3V0IHdoYXQgbmVlZHMgdG8gaGFwcGVuIGVhY2ggYmVhdCB0byBnZXQgb3VyIG1lbG9keVxuICAgIGxldCBjb3VudGVyID0gLTE7XG4gICAgZm9yIChjb25zdCBkaXZpc2lvbiBpbiByaHl0aG1OZWVkZWREdXJhdGlvbnMpIHtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgICBjb25zdCBkaXZpc2lvbk51bSA9IHBhcnNlSW50KGRpdmlzaW9uKTtcbiAgICAgICAgcmV0W2RpdmlzaW9uTnVtXSA9IHtcbiAgICAgICAgICAgIFwiZHVyYXRpb25cIjogcmh5dGhtTmVlZGVkRHVyYXRpb25zW2RpdmlzaW9uTnVtXSxcbiAgICAgICAgICAgIFwidG9uZVwiOiBmb3JjZWRNZWxvZHlBcnJheVtjb3VudGVyXSxcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbWFrZU11c2ljLCBidWlsZFRhYmxlcywgbWFrZU1lbG9keSB9IGZyb20gXCIuL3NyYy9jaG9yZHNcIlxuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vc3JjL3BhcmFtc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMgfSBmcm9tIFwiLi9zcmMvdXRpbHNcIjtcblxuYnVpbGRUYWJsZXMoKVxuXG5zZWxmLm9ubWVzc2FnZSA9IChldmVudDogeyBkYXRhOiB7IHBhcmFtczogc3RyaW5nLCBuZXdNZWxvZHk6IHVuZGVmaW5lZCB8IGJvb2xlYW4sIGdpdmVVcDogdW5kZWZpbmVkIHwgYm9vbGVhbiB9IH0pID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCBtZXNzYWdlXCIsIGV2ZW50LmRhdGEpO1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBNYWluTXVzaWNQYXJhbXMoSlNPTi5wYXJzZShldmVudC5kYXRhLnBhcmFtcyB8fCBcInt9XCIpKTtcblxuICAgIGlmIChldmVudC5kYXRhLm5ld01lbG9keSkge1xuICAgICAgICBtYWtlTWVsb2R5KChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzKSl9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5kYXRhLmdpdmVVcCkge1xuICAgICAgICAoc2VsZiBhcyBhbnkpLmdpdmVVUCA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSAoY3VycmVudEJlYXQ6IG51bWJlciwgZGl2aXNpb25lZFJpY2hOb3RlczogRGl2aXNpb25lZFJpY2hub3RlcykgPT4ge1xuICAgICAgICBpZiAoKHNlbGYgYXMgYW55KS5naXZlVVApIHtcbiAgICAgICAgICAgIHJldHVybiBcImdpdmVVUFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGl2aXNpb25lZFJpY2hOb3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJpY2hOb3RlcyA9IGRpdmlzaW9uZWRSaWNoTm90ZXNbY3VycmVudEJlYXQgKiBCRUFUX0xFTkdUSF07XG4gICAgICAgIGlmIChjdXJyZW50QmVhdCAhPSBudWxsICYmIHJpY2hOb3RlcyAmJiByaWNoTm90ZXNbMF0gJiYgcmljaE5vdGVzWzBdLmNob3JkKSB7XG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmVhdCxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IHJpY2hOb3Rlc1swXS5jaG9yZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkaXZpc2lvbmVkUmljaE5vdGVzKSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1ha2VNdXNpYyhwYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2spLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSByZXN1bHQuZGl2aXNpb25lZE5vdGVzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGl2aXNpb25lZE5vdGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcyA9IGRpdmlzaW9uZWROb3RlcztcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkaXZpc2lvbmVkTm90ZXMpKX0pO1xuXG5cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZXJyb3I6IGVycn0pO1xuICAgIH0pO1xuXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9