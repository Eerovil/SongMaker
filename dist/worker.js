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
            if (!wantedFunction || wantedFunction != 'dominant') {
                if (newChord.chordType.includes('dom7')) {
                    tension.chordProgression += 15;
                }
                if (newChord.chordType.includes('dim7')) {
                    tension.chordProgression += 14;
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
        const neededRhythm = rhythmNeededDurations[cadenceDivision] || 100;
        const lastBeatInCadence = params.beatsUntilAuthenticCadenceEnd < 2;
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
                    originalScale: currentScale,
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
        // this.melodyRhythm = "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE";
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
        const interval = Math.abs(fromGlobalSemitones[i] - toGlobalSemitones[i]);
        if (interval >= 3) {
            tension.melodyJump += 0.5;
        }
        if (interval == 12) {
            tension.melodyJump += 0.5;
            continue;
        }
        if (interval >= 5) {
            tension.melodyJump += 1;
        }
        if (interval > 7) {
            tension.melodyJump += 2;
        }
        if (interval >= 10) { // 7th == 10
            tension.melodyJump += 100;
            continue;
        }
        if (interval == 6 || interval == 8) // tritone (aug 4th) or aug 5th
         {
            tension.melodyJump += 10;
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
            if (gTonesForThisPart[gTonesForThisPart.length - 1] != gTonesForThisPart[gTonesForThisPart.length - 2] && gTonesForThisPart[gTonesForThisPart.length - 1] == gTonesForThisPart[gTonesForThisPart.length - 3]) {
                // We're going to the same note as before. That's bad.
                // Zig zagging
                tension.melodyTarget += 2;
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
                        tension.melodyTarget += -1 * globalDirection;
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
                            tension.melodyTarget += globalDirection;
                        }
                    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LEtBQUssQ0FBQyxFQUFFO3dCQUMvQixxQkFBcUI7d0JBQ3JCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixxQkFBcUI7d0JBQ3JCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdC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QUFHLEVBQUUsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9tdXNpY3RoZW9yeWpzL2Rpc3QvbXVzaWN0aGVvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2F2YWlsYWJsZXNjYWxlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2hvcmRwcm9ncmVzc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2hvcmRzLnRzIiwid2VicGFjazovLy8uL3NyYy9mb3JjZWRtZWxvZHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dvb2Rzb3VuZGluZ3NjYWxlLnRzIiwid2VicGFjazovLy8uL3NyYy9pbnZlcnNpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9teWxvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbm9uY2hvcmR0b25lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyYW1zLnRzIiwid2VicGFjazovLy8uL3NyYy9yYW5kb21jaG9yZHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbnNpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi93b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5NdXNpY1RoZW9yeSA9IHt9KSk7XG59KSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAvKipcclxuICAgICogTm90ZXMgc3RhcnRpbmcgYXQgQzAgLSB6ZXJvIGluZGV4IC0gMTIgdG90YWxcclxuICAgICogTWFwcyBub3RlIG5hbWVzIHRvIHNlbWl0b25lIHZhbHVlcyBzdGFydGluZyBhdCBDPTBcclxuICAgICogQGVudW1cclxuICAgICovXHJcbiAgIHZhciBTZW1pdG9uZTtcclxuICAgKGZ1bmN0aW9uIChTZW1pdG9uZSkge1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBXCJdID0gOV0gPSBcIkFcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQXNcIl0gPSAxMF0gPSBcIkFzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJiXCJdID0gMTBdID0gXCJCYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCXCJdID0gMTFdID0gXCJCXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJzXCJdID0gMF0gPSBcIkJzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNiXCJdID0gMTFdID0gXCJDYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDXCJdID0gMF0gPSBcIkNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ3NcIl0gPSAxXSA9IFwiQ3NcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRGJcIl0gPSAxXSA9IFwiRGJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRFwiXSA9IDJdID0gXCJEXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRzXCJdID0gM10gPSBcIkRzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkViXCJdID0gM10gPSBcIkViXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkVcIl0gPSA0XSA9IFwiRVwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFc1wiXSA9IDVdID0gXCJFc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGYlwiXSA9IDRdID0gXCJGYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGXCJdID0gNV0gPSBcIkZcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRnNcIl0gPSA2XSA9IFwiRnNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR2JcIl0gPSA2XSA9IFwiR2JcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR1wiXSA9IDddID0gXCJHXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdzXCJdID0gOF0gPSBcIkdzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFiXCJdID0gOF0gPSBcIkFiXCI7XHJcbiAgIH0pKFNlbWl0b25lIHx8IChTZW1pdG9uZSA9IHt9KSk7XHJcbiAgIC8qKlxyXG4gICAgKiBSZXR1cm5zIHRoZSB3aG9sZSBub3RlIG5hbWUgKGUuZy4gQywgRCwgRSwgRiwgRywgQSwgQikgZm9yXHJcbiAgICAqIHRoZSBnaXZlbiBzdHJpbmdcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBnZXRXaG9sZVRvbmVGcm9tTmFtZSA9IChuYW1lKSA9PiB7XHJcbiAgICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggPT09IDAgfHwgbmFtZS5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbmFtZVwiKTtcclxuICAgICAgIGNvbnN0IGtleSA9IG5hbWVbMF0udG9VcHBlckNhc2UoKTtcclxuICAgICAgIHJldHVybiBTZW1pdG9uZVtrZXldO1xyXG4gICB9O1xyXG4gICB2YXIgU2VtaXRvbmUkMSA9IFNlbWl0b25lO1xuXG4gICAvKipcclxuICAgICogV3JhcHMgYSBudW1iZXIgYmV0d2VlbiBhIG1pbiBhbmQgbWF4IHZhbHVlLlxyXG4gICAgKiBAcGFyYW0gdmFsdWUgLSB0aGUgbnVtYmVyIHRvIHdyYXBcclxuICAgICogQHBhcmFtIGxvd2VyICAtIHRoZSBsb3dlciBib3VuZFxyXG4gICAgKiBAcGFyYW0gdXBwZXIgLSB0aGUgdXBwZXIgYm91bmRcclxuICAgICogQHJldHVybnMgd3JhcHBlZE51bWJlciAtIHRoZSB3cmFwcGVkIG51bWJlclxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHdyYXAgPSAodmFsdWUsIGxvd2VyLCB1cHBlcikgPT4ge1xyXG4gICAgICAgLy8gY29waWVzXHJcbiAgICAgICBsZXQgdmFsID0gdmFsdWU7XHJcbiAgICAgICBsZXQgbGJvdW5kID0gbG93ZXI7XHJcbiAgICAgICBsZXQgdWJvdW5kID0gdXBwZXI7XHJcbiAgICAgICAvLyBpZiB0aGUgYm91bmRzIGFyZSBpbnZlcnRlZCwgc3dhcCB0aGVtIGhlcmVcclxuICAgICAgIGlmICh1cHBlciA8IGxvd2VyKSB7XHJcbiAgICAgICAgICAgbGJvdW5kID0gdXBwZXI7XHJcbiAgICAgICAgICAgdWJvdW5kID0gbG93ZXI7XHJcbiAgICAgICB9XHJcbiAgICAgICAvLyB0aGUgYW1vdW50IG5lZWRlZCB0byBtb3ZlIHRoZSByYW5nZSBhbmQgdmFsdWUgdG8gemVyb1xyXG4gICAgICAgY29uc3QgemVyb09mZnNldCA9IDAgLSBsYm91bmQ7XHJcbiAgICAgICAvLyBvZmZzZXQgdGhlIHZhbHVlcyBzbyB0aGF0IHRoZSBsb3dlciBib3VuZCBpcyB6ZXJvXHJcbiAgICAgICBsYm91bmQgKz0gemVyb09mZnNldDtcclxuICAgICAgIHVib3VuZCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgdmFsICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICAvLyBjb21wdXRlIHRoZSBudW1iZXIgb2YgdGltZXMgdGhlIHZhbHVlIHdpbGwgd3JhcFxyXG4gICAgICAgbGV0IHdyYXBzID0gTWF0aC50cnVuYyh2YWwgLyB1Ym91bmQpO1xyXG4gICAgICAgLy8gY2FzZTogLTEgLyB1Ym91bmQoPjApIHdpbGwgZXF1YWwgMCBhbHRob3VnaCBpdCB3cmFwcyBvbmNlXHJcbiAgICAgICBpZiAod3JhcHMgPT09IDAgJiYgdmFsIDwgbGJvdW5kKVxyXG4gICAgICAgICAgIHdyYXBzID0gLTE7XHJcbiAgICAgICAvLyBjYXNlOiB1Ym91bmQgYW5kIHZhbHVlIGFyZSB0aGUgc2FtZSB2YWwvdWJvdW5kID0gMSBidXQgYWN0dWFsbHkgZG9lc250IHdyYXBcclxuICAgICAgIGlmICh3cmFwcyA9PT0gMSAmJiB2YWwgPT09IHVib3VuZClcclxuICAgICAgICAgICB3cmFwcyA9IDA7XHJcbiAgICAgICAvLyBuZWVkZWQgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBudW0gb2Ygd3JhcHMgaXMgMCBvciAxIG9yIC0xXHJcbiAgICAgICBsZXQgdmFsT2Zmc2V0ID0gMDtcclxuICAgICAgIGxldCB3cmFwT2Zmc2V0ID0gMDtcclxuICAgICAgIGlmICh3cmFwcyA+PSAtMSAmJiB3cmFwcyA8PSAxKVxyXG4gICAgICAgICAgIHdyYXBPZmZzZXQgPSAxO1xyXG4gICAgICAgLy8gaWYgdGhlIHZhbHVlIGlzIGJlbG93IHRoZSByYW5nZVxyXG4gICAgICAgaWYgKHZhbCA8IGxib3VuZCkge1xyXG4gICAgICAgICAgIHZhbE9mZnNldCA9ICh2YWwgJSB1Ym91bmQpICsgd3JhcE9mZnNldDtcclxuICAgICAgICAgICB2YWwgPSB1Ym91bmQgKyB2YWxPZmZzZXQ7XHJcbiAgICAgICAgICAgLy8gaWYgdGhlIHZhbHVlIGlzIGFib3ZlIHRoZSByYW5nZVxyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZSBpZiAodmFsID4gdWJvdW5kKSB7XHJcbiAgICAgICAgICAgdmFsT2Zmc2V0ID0gKHZhbCAlIHVib3VuZCkgLSB3cmFwT2Zmc2V0O1xyXG4gICAgICAgICAgIHZhbCA9IGxib3VuZCArIHZhbE9mZnNldDtcclxuICAgICAgIH1cclxuICAgICAgIC8vIGFkZCB0aGUgb2Zmc2V0IGZyb20gemVybyBiYWNrIHRvIHRoZSB2YWx1ZVxyXG4gICAgICAgdmFsIC09IHplcm9PZmZzZXQ7XHJcbiAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgIHZhbHVlOiB2YWwsXHJcbiAgICAgICAgICAgbnVtV3JhcHM6IHdyYXBzLFxyXG4gICAgICAgfTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNpbXBsZSB1dGlsIHRvIGNsYW1wIGEgbnVtYmVyIHRvIGEgcmFuZ2VcclxuICAgICogQHBhcmFtIHBOdW0gLSB0aGUgbnVtYmVyIHRvIGNsYW1wXHJcbiAgICAqIEBwYXJhbSBwTG93ZXIgLSB0aGUgbG93ZXIgYm91bmRcclxuICAgICogQHBhcmFtIHBVcHBlciAtIHRoZSB1cHBlciBib3VuZFxyXG4gICAgKiBAcmV0dXJucyBOdW1iZXIgLSB0aGUgY2xhbXBlZCBudW1iZXJcclxuICAgICpcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjbGFtcCA9IChwTnVtLCBwTG93ZXIsIHBVcHBlcikgPT4gTWF0aC5tYXgoTWF0aC5taW4ocE51bSwgTWF0aC5tYXgocExvd2VyLCBwVXBwZXIpKSwgTWF0aC5taW4ocExvd2VyLCBwVXBwZXIpKTtcblxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8vIENvbnN0YW50c1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgTU9ESUZJRURfU0VNSVRPTkVTID0gWzEsIDMsIDQsIDYsIDgsIDEwXTtcclxuICAgY29uc3QgVE9ORVNfTUFYID0gMTE7XHJcbiAgIGNvbnN0IFRPTkVTX01JTiA9IDA7XHJcbiAgIGNvbnN0IE9DVEFWRV9NQVggPSA5O1xyXG4gICBjb25zdCBPQ1RBVkVfTUlOID0gMDtcclxuICAgY29uc3QgREVGQVVMVF9PQ1RBVkUgPSA0O1xyXG4gICBjb25zdCBERUZBVUxUX1NFTUlUT05FID0gMDtcblxuICAgLyoqXHJcbiAgICAqIE1hcHMgbm90ZSBhbHRlcmF0aW9ucyB0byAgdGhlaXIgcmVsYXRpdmUgbWF0aG1hdGljYWwgdmFsdWVcclxuICAgICpAZW51bVxyXG4gICAgKi9cclxuICAgdmFyIE1vZGlmaWVyO1xyXG4gICAoZnVuY3Rpb24gKE1vZGlmaWVyKSB7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIkZMQVRcIl0gPSAtMV0gPSBcIkZMQVRcIjtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiTkFUVVJBTFwiXSA9IDBdID0gXCJOQVRVUkFMXCI7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIlNIQVJQXCJdID0gMV0gPSBcIlNIQVJQXCI7XHJcbiAgIH0pKE1vZGlmaWVyIHx8IChNb2RpZmllciA9IHt9KSk7XHJcbiAgIC8qKlxyXG4gICAgKiBQYXJzZXMgbW9kaWZpZXIgZnJvbSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGVudW0gdmFsdWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZU1vZGlmaWVyID0gKG1vZGlmaWVyKSA9PiB7XHJcbiAgICAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgY2FzZSBcImJcIjpcclxuICAgICAgICAgICBjYXNlIFwiZmxhdFwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuRkxBVDtcclxuICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgY2FzZSBcInNoYXJwXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5TSEFSUDtcclxuICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuTkFUVVJBTDtcclxuICAgICAgIH1cclxuICAgfTtcclxuICAgdmFyIE1vZGlmaWVyJDEgPSBNb2RpZmllcjtcblxuICAgLy8gaW1wb3J0IHsgcmVnaXN0ZXJJbml0aWFsaXplciB9IGZyb20gXCIuLi9Jbml0aWFsaXplci9Jbml0aWFsaXplclwiO1xyXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZUxvb2t1cC5qc29uXCI7XHJcbiAgIC8vIGltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IG5hbWVSZWdleCQyID0gLyhbQS1HXSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCQyID0gLygjfHN8YikvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXgkMiA9IC8oWzAtOV0rKS9nO1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIHBhcnNlIGEgbm90ZSBmcm9tIGEgc3RyaW5nXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgcGFyc2VOb3RlID0gKG5vdGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbm90ZUxvb2t1cChub3RlKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgbm90ZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7bm90ZX0uIEdldCBhIHBlcmZvcm1hbmNlIGluY3JlYXNlIGJ5IHVzaW5nIHRoZSBmb3JtYXQgW0EtR11bI3xzfGJdWzAtOV0gYW5kIHVzaW5nIGJ1aWxkVGFibGVzIG1ldGhvZChzZWUgZG9jdW1lbnRhdGlvbilgKTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IG5vdGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke25vdGV9LiBHZXQgYSBwZXJmb3JtYW5jZSBpbmNyZWFzZSBieSB1c2luZyB0aGUgZm9ybWF0IFtBLUddWyN8c3xiXVswLTldIGFuZCB1c2luZyBidWlsZFRhYmxlcyBtZXRob2Qoc2VlIGRvY3VtZW50YXRpb24pYCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IG5vdGUubWF0Y2gobmFtZVJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IG5vdGUubWF0Y2gobW9kaWZpZXJSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gbm90ZS5tYXRjaChvY3RhdmVSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbm90ZTogJHtub3RlfWApO1xyXG4gICB9O1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQ0ID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgbm90ZVRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgZm9yIChjb25zdCBub3RlTGFiZWwgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICBub3RlVGFibGVbbm90ZUxhYmVsXSA9IHBhcnNlTm90ZShub3RlTGFiZWwsIHRydWUpOyAvLyAnQycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICBmb3IgKGxldCBpTW9kaWZpZXJPdXRlciA9IDA7IGlNb2RpZmllck91dGVyIDwgbm90ZU1vZGlmaWVycy5sZW5ndGg7ICsraU1vZGlmaWVyT3V0ZXIpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bm90ZU1vZGlmaWVyc1tpTW9kaWZpZXJPdXRlcl19YDtcclxuICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0MjJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8IE9DVEFWRV9NQVg7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtpT2N0YXZlfWA7XHJcbiAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgZm9yIChsZXQgaU1vZGlmaWVyID0gMDsgaU1vZGlmaWVyIDwgbm90ZU1vZGlmaWVycy5sZW5ndGg7ICsraU1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtub3RlTW9kaWZpZXJzW2lNb2RpZmllcl19JHtpT2N0YXZlfWA7XHJcbiAgICAgICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQyM0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIG5vdGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIFRoZSBsb29rdXAgdGFibGVcclxuICAgICovXHJcbiAgIGxldCBfbm90ZUxvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3RlTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGROb3RlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZUxvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZE5vdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUkNCgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZUxvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IG5vdGUgdGFibGVcIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8vIGltcG9ydCB7IHJlZ2lzdGVySW5pdGlhbGl6ZXIgfSBmcm9tIFwiLi4vSW5pdGlhbGl6ZXIvSW5pdGlhbGl6ZXJcIjtcclxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVTdHJpbmdMb29rdXAuanNvblwiO1xyXG4gICBjb25zdCBVTktOT1dOX01PRElGSUVSX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJDIy9EYlwiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkQjL0ViXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJGIy9HYlwiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkcjL0FiXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQSMvQmJcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBTSEFSUF9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiQyNcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJEI1wiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiRiNcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJHI1wiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkEjXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgRkxBVF9NT0RJRklFUl9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiRGJcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJFYlwiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiR2JcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJBYlwiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkJiXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgY3JlYXRlVGFibGUkMyA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpVG9uZSA9IFRPTkVTX01JTjsgaVRvbmUgPD0gVE9ORVNfTUFYOyArK2lUb25lKSB7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaVByZXYgPSBUT05FU19NSU47IGlQcmV2IDw9IFRPTkVTX01BWDsgKytpUHJldikge1xyXG4gICAgICAgICAgICAgICAvLyBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8PSBPQ1RBVkVfTUFYOyBpT2N0YXZlKyspIHtcclxuICAgICAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgaWYgKE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyhpVG9uZSkpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCItXCI7IC8vIGhhcyBhbiB1bmtub3duIG1vZGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAvLyBpZiBpcyBmbGF0XHJcbiAgICAgICAgICAgICAgICAgICBpZiAod3JhcChpVG9uZSArIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT0gaVByZXYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcImJcIjtcclxuICAgICAgICAgICAgICAgICAgIC8vIGlzIHNoYXJwXHJcbiAgICAgICAgICAgICAgICAgICBpZiAod3JhcChpVG9uZSAtIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT0gaVByZXYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcIiNcIjtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvLyBnZXQgbm90ZSBuYW1lIGZyb20gdGFibGVcclxuICAgICAgICAgICAgICAgdGFibGVbYCR7aVRvbmV9LSR7aVByZXZ9YF0gPSBnZXROb3RlTGFiZWwoaVRvbmUsIG1vZGlmaWVyKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBjb25zdCBnZXROb3RlTGFiZWwgPSAodG9uZSwgbW9kaWZpZXIpID0+IHtcclxuICAgICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gU0hBUlBfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgICAgIGNhc2UgXCJiXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBGTEFUX01PRElGSUVSX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBVTktOT1dOX01PRElGSUVSX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgIH1cclxuICAgfTtcclxuICAgbGV0IF9ub3RlU3RyaW5nTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVTdHJpbmdMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgaWYgKE9iamVjdC5rZXlzKF9ub3RlU3RyaW5nTG9va3VwKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZE5vdGVTdHJpbmdUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3Qua2V5cyhfbm90ZVN0cmluZ0xvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwO1xyXG4gICAgICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSQzKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3RlU3RyaW5nTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiTm90ZSBzdHJpbmcgdGFibGUgYnVpbHQuXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwO1xyXG4gICB9O1xuXG4gICB2YXIgSURYPTI1NiwgSEVYPVtdLCBTSVpFPTI1NiwgQlVGRkVSO1xuICAgd2hpbGUgKElEWC0tKSBIRVhbSURYXSA9IChJRFggKyAyNTYpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG5cbiAgIGZ1bmN0aW9uIHVpZChsZW4pIHtcbiAgIFx0dmFyIGk9MCwgdG1wPShsZW4gfHwgMTEpO1xuICAgXHRpZiAoIUJVRkZFUiB8fCAoKElEWCArIHRtcCkgPiBTSVpFKjIpKSB7XG4gICBcdFx0Zm9yIChCVUZGRVI9JycsSURYPTA7IGkgPCBTSVpFOyBpKyspIHtcbiAgIFx0XHRcdEJVRkZFUiArPSBIRVhbTWF0aC5yYW5kb20oKSAqIDI1NiB8IDBdO1xuICAgXHRcdH1cbiAgIFx0fVxuXG4gICBcdHJldHVybiBCVUZGRVIuc3Vic3RyaW5nKElEWCwgSURYKysgKyB0bXApO1xuICAgfVxuXG4gICAvLyBpbXBvcnQgSWRlbnRpZmlhYmxlIGZyb20gXCIuLi9jb21wb3NhYmxlcy9JZGVudGlmaWFibGVcIjtcclxuICAgLyoqXHJcbiAgICAqIEEgbm90ZSBjb25zaXN0IG9mIGEgc2VtaXRvbmUgYW5kIGFuIG9jdGF2ZS48YnI+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7IE5vdGVJbml0aWFsaXplciB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7IC8vIHR5cGVzY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBOb3RlIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB3aXRoIGRlZmF1bHQgdmFsdWVzIHNlbWl0b25lIDAoQykgYW5kIG9jdGF2ZSA0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgdXNpbmcgYW4gaW5pdGlhbGl6ZXIgb2JqZWN0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoe3NlbWl0b25lOiA0LCBvY3RhdmU6IDV9KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IG5vdGUtbmFtZVttb2RpZmllcl1bb2N0YXZlXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHVzaW5nIGEgc3RyaW5nXHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoXCJDNVwiKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICB2YWx1ZXMgPSBwYXJzZU5vdGUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXM/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHZhbHVlcz8uc2VtaXRvbmUgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0aGF0IG9jdGF2ZSBpcyBzZXQgZmlyc3Qgc28gdGhhdFxyXG4gICAgICAgICAgICAgICAvLyBzZXR0aW5nIHRoZSBzZW1pdG9uZSBjYW4gY2hhbmdlIHRoZSBvY3RhdmVcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXM/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHZhbHVlcz8uc2VtaXRvbmUgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICB1bmlxdWUgaWQgZm9yIHRoaXMgbm90ZShhdXRvIGdlbmVyYXRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaWQpOyAvLyBzMjg5OHNubG9qXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2VtaXRvbmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgX3ByZXZTZW1pdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAwXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHNlbWl0b25lKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl90b25lO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZXR0aW5nIHRoZSBzZW1pdG9uZSB3aXRoIGEgbnVtYmVyIG91dHNpZGUgdGhlXHJcbiAgICAgICAgKiByYW5nZSBvZiAwLTExIHdpbGwgd3JhcCB0aGUgdmFsdWUgYXJvdW5kIGFuZFxyXG4gICAgICAgICogY2hhbmdlIHRoZSBvY3RhdmUgYWNjb3JkaW5nbHlcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIG5vdGUuc2VtaXRvbmUgPSA0Oy8vIEVcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyA0KEUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHNlbWl0b25lKHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAoc2VtaXRvbmUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIHRoaXMuX3RvbmUgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IHRoaXMuX29jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUub2N0YXZlKTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBub3RlLm9jdGF2ZSA9IDEwO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5vY3RhdmUpOyAvLyA5KGJlY2F1c2Ugb2YgY2xhbXBpbmcpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZShvY3RhdmUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcChvY3RhdmUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBzaGFycGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLnNoYXJwKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlMi5zZW1pdG9uZSk7IC8vIDEoQyMpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hhcnAoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSkuc2hhcnBlbigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTaGFycGVucyB0aGUgbm90ZSBpbiBwbGFjZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBub3RlLnNoYXJwZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAxKEMjKVxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGFycGVuKCkge1xyXG4gICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lICsgMTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIGF0dGVtcHRzIHRvIGRldGVybWluZSBpZiB0aGUgbm90ZSBpcyBzaGFycFxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbm90ZSBpcyBzaGFycFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNTaGFycCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIG5vdGUuc2hhcnBlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc1NoYXJwKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNTaGFycCgpIHtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHdob2xlLCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGNvbnN0IG1vZGlmaWVkID0gTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKHRoaXMuc2VtaXRvbmUpO1xyXG4gICAgICAgICAgIGlmICghbW9kaWZpZWQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIGZsYXQsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgaWYgKHdyYXAodGhpcy5zZW1pdG9uZSArIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT1cclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vaXMgZmxhdFxyXG4gICAgICAgICAgIC8vIERvZXNuJ3QgbmVjY2VjYXJpbHkgbWVhbiBpdCdzIHNoYXJwLCBidXQgaXQncyBhIGdvb2QgZ3Vlc3MgYXQgdGhpcyBwb2ludFxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuZmxhdCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZTIuc2VtaXRvbmUpOyAvLyAzKEViKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGZsYXQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSkuZmxhdHRlbigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBGbGF0dGVucyB0aGUgbm90ZSBpbiBwbGFjZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoe3NlbWl0b25lOiA0fSk7IC8vICBzZW1pdG9uZSBpcyA0KEUpXHJcbiAgICAgICAgKiBub3RlLmZsYXR0ZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAzKEViKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGZsYXR0ZW4oKSB7XHJcbiAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmUgLSAxO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgYXR0ZW1wdHMgdG8gZGV0ZXJtaW5lIGlmIHRoZSBub3RlIGlzIGZsYXRcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG5vdGUgaXMgZmxhdFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNGbGF0KCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogbm90ZS5mbGF0dGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzRmxhdCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzRmxhdCgpIHtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHdob2xlLCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGNvbnN0IG1vZGlmaWVkID0gTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKHRoaXMuc2VtaXRvbmUpO1xyXG4gICAgICAgICAgIGlmICghbW9kaWZpZWQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHNoYXJwLCBpdCBjYW4ndCBiZSBmbGF0XHJcbiAgICAgICAgICAgaWYgKHdyYXAodGhpcy5zZW1pdG9uZSAtIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT1cclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vaXMgc2hhcnBcclxuICAgICAgICAgICAvLyBEb2Vzbid0IG5lY2NlY2FyaWx5IG1lYW4gaXQncyBmbGF0LCBidXQgaXQncyBhIGdvb2QgZ3Vlc3MgYXQgdGhpcyBwb2ludFxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoaXMgbm90ZSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5lcXVhbHMobm90ZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VtaXRvbmUgPT09IG5vdGUuc2VtaXRvbmUgJiYgdGhpcy5vY3RhdmUgPT09IG5vdGUub2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuZXF1YWxzKG5vdGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHZlcnNpb24gb2YgdGhpcyBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICpcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZVN0cmluZ0xvb2t1cCk7XHJcbiAgICAgICAgICAgcmV0dXJuIChub3RlU3RyaW5nTG9va3VwKGAke3RoaXMuX3RvbmV9LSR7dGhpcy5fcHJldlNlbWl0b25lfWApICtcclxuICAgICAgICAgICAgICAgYCR7dGhpcy5fb2N0YXZlfWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTdGF0aWMgbWV0aG9kcyB0byBjcmVhdGUgd2hvbGUgbm90ZXMgZWFzaWx5LlxyXG4gICAgICAgICogdGhlIGRlZmF1bHQgb2N0YXZlIGlzIDRcclxuICAgICAgICAqL1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBBW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5BKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBBNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBBKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5BLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBCW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5CKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBCNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBCKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5CLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBDW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5DKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBDNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBDKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5DLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBEW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5EKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBENFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBEKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5ELFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBFW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5FKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBFNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBFKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5FLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBGW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5GKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBGNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBGKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5GLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBHW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5HKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBHNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBHKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5HLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIENvbnN0YW50c1xyXG4gICAgKi9cclxuICAgY29uc3QgTUlESUtFWV9TVEFSVCA9IDEyO1xyXG4gICBjb25zdCBOVU1fT0NUQVZFUyA9IDEwO1xyXG4gICBjb25zdCBOVU1fU0VNSVRPTkVTID0gMTI7XHJcbiAgIC8qKlxyXG4gICAgKiBDYWxjdWxhdGVzIHRoZSBtaWRpIGtleSBmb3IgYSBnaXZlbiBvY3RhdmUgYW5kIHNlbWl0b25lLlxyXG4gICAgKi9cclxuICAgY29uc3QgY2FsY01pZGlLZXkgPSAob2N0YXZlLCBzZW1pdG9uZSkgPT4gTUlESUtFWV9TVEFSVCArIG9jdGF2ZSAqIE5VTV9TRU1JVE9ORVMgKyBzZW1pdG9uZTtcclxuICAgLyoqXHJcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGZyZXF1ZW5jeSBmb3IgYSBnaXZlbiBvY3RhdmUgYW5kIHNlbWl0b25lIGdpdmVuXHJcbiAgICAqIGEgdHVuaW5nIGZvciBhNC5cclxuICAgICovXHJcbiAgIGNvbnN0IGNhbGNGcmVxdWVuY3kgPSAobWlkaUtleSwgYTRUdW5pbmcpID0+IDIgKiogKChtaWRpS2V5IC0gNjkpIC8gMTIpICogYTRUdW5pbmc7XHJcbiAgIC8qKlxyXG4gICAgKiBDcmVhdGVzIGFuZCByZXR1cm4gbG9va3VwIHRhYmxlcyBmb3IgbWlkaWtleSBhbmQgZnJlcXVlbmN5LlxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGVzID0gKGE0VHVuaW5nID0gNDQwKSA9PiB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE1hcHMgb2N0YXZlIGFuZCBzZW1pdG9uZSB0byBub3RlIGZyZXF1ZW5jeShoZXJ0eikuXHJcbiAgICAgICAgKiByZXF1aXJlcyBhIGtleSBpbiB0aGUgZm9ybSBvZiBgPG9jdGF2ZT4tPHNlbWl0b25lPmBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3QgZnJlcVRhYmxlID0ge307XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE1hcHMgb2N0YXZlIGFuZCBzZW1pdG9uZSB0byBtaWRpIGtleS5cclxuICAgICAgICAqIHJlcXVpcmVzIGEga2V5IGluIHRoZSBmb3JtIG9mIGA8b2N0YXZlPi08c2VtaXRvbmU+YFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdCBtaWRpVGFibGUgPSB7fTtcclxuICAgICAgIGxldCBpT2N0YXZlID0gMDtcclxuICAgICAgIGxldCBpU2VtaXRvbmUgPSAwO1xyXG4gICAgICAgZm9yIChpT2N0YXZlID0gMDsgaU9jdGF2ZSA8IE5VTV9PQ1RBVkVTOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICBmb3IgKGlTZW1pdG9uZSA9IDA7IGlTZW1pdG9uZSA8IE5VTV9TRU1JVE9ORVM7ICsraVNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke2lPY3RhdmV9LSR7aVNlbWl0b25lfWA7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG1rZXkgPSBjYWxjTWlkaUtleShpT2N0YXZlLCBpU2VtaXRvbmUpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBmcmVxID0gY2FsY0ZyZXF1ZW5jeShta2V5LCBhNFR1bmluZyk7XHJcbiAgICAgICAgICAgICAgIG1pZGlUYWJsZVtrZXldID0gbWtleTtcclxuICAgICAgICAgICAgICAgZnJlcVRhYmxlW2tleV0gPSBmcmVxO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgZnJlcUxvb2t1cDogZnJlcVRhYmxlLFxyXG4gICAgICAgICAgIG1pZGlMb29rdXA6IG1pZGlUYWJsZSxcclxuICAgICAgIH07XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBUdW5pbmcgY29tcG9uZW50IHVzZWQgYnkgSW5zdHJ1bWVudCBjbGFzczxicj5cclxuICAgICogY29udGFpbmVzIHRoZSBhNCB0dW5pbmcgLSBkZWZhdWx0IGlzIDQ0MEh6PGJyPlxyXG4gICAgKiBidWlsZHMgbG9va3VwIHRhYmxlcyBmb3IgbWlkaSBrZXkgYW5kIGZyZXF1ZW5jeTxicj5cclxuICAgICogYmFzZWQgb24gdGhlIHR1bmluZ1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNsYXNzIFR1bmluZyB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIENyZWF0ZXMgdGhlIG9iamVjdCBhbmQgYnVpbGRzIHRoZSBsb29rdXAgdGFibGVzLlxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3RvcihhNEZyZXEgPSA0NDApIHtcclxuICAgICAgICAgICB0aGlzLl9hNCA9IGE0RnJlcTtcclxuICAgICAgICAgICB0aGlzLmJ1aWxkVGFibGVzKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IFR1bmluZyh0aGlzLl9hNCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYTQgPT09IG90aGVyLl9hNDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogYTQgVHVuaW5nXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9hNCA9IDQ0MDtcclxuICAgICAgIGdldCBhNCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYTQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNldHRpbmcgdGhlIHR1bmluZyB3aWxsIHJlYnVpbGQgdGhlIGxvb2t1cCB0YWJsZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGE0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYTQgPSB2YWx1ZTtcclxuICAgICAgICAgICB0aGlzLmJ1aWxkVGFibGVzKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGxvb2t1cCB0YWJsZSBmb3IgbWlkaSBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgX21pZGlLZXlUYWJsZSA9IHt9O1xyXG4gICAgICAgbWlkaUtleUxvb2t1cChvY3RhdmUsIHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7b2N0YXZlfS0ke3NlbWl0b25lfWA7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pZGlLZXlUYWJsZVtrZXldO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBsb29rdXAgdGFibGUgZm9yIGZyZXF1ZW5jeVxyXG4gICAgICAgICovXHJcbiAgICAgICBfZnJlcVRhYmxlID0ge307XHJcbiAgICAgICBmcmVxTG9va3VwKG9jdGF2ZSwgc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtvY3RhdmV9LSR7c2VtaXRvbmV9YDtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlcVRhYmxlW2tleV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEJ1aWxkcyB0aGUgbG9va3VwIHRhYmxlcyBmb3IgbWlkaSBrZXkgYW5kIGZyZXF1ZW5jeVxyXG4gICAgICAgICovXHJcbiAgICAgICBidWlsZFRhYmxlcygpIHtcclxuICAgICAgICAgICBjb25zdCB0YWJsZXMgPSBjcmVhdGVUYWJsZXModGhpcy5fYTQpO1xyXG4gICAgICAgICAgIHRoaXMuX21pZGlLZXlUYWJsZSA9IHRhYmxlcy5taWRpTG9va3VwO1xyXG4gICAgICAgICAgIHRoaXMuX2ZyZXFUYWJsZSA9IHRhYmxlcy5mcmVxTG9va3VwO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSB0dW5pbmcgYXMgYSBzdHJpbmdcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGBUdW5pbmcoJHt0aGlzLl9hNH0pYDtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogSW5zdHJ1bWVudCBhcmUgdXNlZCB0byBlbmNhcHN1bGF0ZSB0aGUgdHVuaW5nIGFuZCByZXRyaWV2aW5nIG9mIG1pZGkga2V5c1xyXG4gICAgKiBhbmQgZnJlcXVlbmNpZXMgZm9yIG5vdGVzXHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgSW5zdHJ1bWVudCB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqL1xyXG4gICBjbGFzcyBJbnN0cnVtZW50IHtcclxuICAgICAgIHR1bmluZztcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIHR1bmluZyBBNCBmcmVxdWVuY3kgLSBkZWZhdWx0cyB0byA0NDBcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTsgLy8gZGVmYXVsdCA0NDAgdHVuaW5nXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IoYTRGcmVxID0gNDQwKSB7XHJcbiAgICAgICAgICAgdGhpcy50dW5pbmcgPSBuZXcgVHVuaW5nKGE0RnJlcSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIGEgdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmlkOyAvLyByZXR1cm5zIGEgdW5pcXVlIGlkXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBpbnN0cnVtZW50LmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVtZW50KHRoaXMudHVuaW5nLmE0KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIG90aGVyIHRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZVxyXG4gICAgICAgICogQHJldHVybnMgIHRydWUgaWYgdGhlIG90aGVyIG9iamVjdCBpcyBlcXVhbCB0byB0aGlzIG9uZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGluc3RydW1lbnQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLmVxdWFscyhvdGhlci50dW5pbmcpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgZnJlcXVlbmN5IG9mIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmdldEZyZXF1ZW5jeShuZXcgTm90ZShcIkM0XCIpKTsgLy8gcmV0dXJucyAyNjEuNjI1NTY1MzAwNTk4NlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldEZyZXF1ZW5jeShub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLmZyZXFMb29rdXAobm90ZS5vY3RhdmUsIG5vdGUuc2VtaXRvbmUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbWlkaSBrZXkgb2YgdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuZ2V0TWlkaUtleShuZXcgTm90ZShcIkM0XCIpKTsgLy8gcmV0dXJucyA2MFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE1pZGlLZXkobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5taWRpS2V5TG9va3VwKG5vdGUub2N0YXZlLCBub3RlLnNlbWl0b25lKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIHR1bmluZyBhcyBhIHN0cmluZ1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC50b1N0cmluZygpKTsgLy8gcmV0dXJucyBcIkluc3RydW1lbnQgVHVuaW5nKDQ0MClcIlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIHJldHVybiBgSW5zdHJ1bWVudCBUdW5pbmcoJHt0aGlzLnR1bmluZy5hNH0pYDtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICBjb25zdCBERUZBVUxUX1NDQUxFX1RFTVBMQVRFID0gWzAsIDIsIDIsIDEsIDIsIDIsIDJdOyAvLyBtYWpvclxyXG4gICBPYmplY3QuZnJlZXplKERFRkFVTFRfU0NBTEVfVEVNUExBVEUpO1xuXG4gICAvKipcclxuICAgICogTWFwcyBwcmVkZWZpbmVkIHNjYWxlcyB0byB0aGVpciBuYW1lcy5cclxuICAgICovXHJcbiAgIGNvbnN0IFNjYWxlVGVtcGxhdGVzID0ge1xyXG4gICAgICAgd2hvbGVUb25lOiBbMCwgMiwgMiwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICAvLyBtYWpvclxyXG4gICAgICAgbWFqb3I6IFswLCAyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIG1ham9yN3M0czU6IFswLCAyLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIG1vZGVzXHJcbiAgICAgICAvLyBpb25pYW46IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1ham9yXHJcbiAgICAgICAvLyBhZW9saWFuOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtaW5vclxyXG4gICAgICAgZG9yaWFuOiBbMCwgMiwgMSwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBwaHJ5Z2lhbjogWzAsIDEsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgbHlkaWFuOiBbMCwgMiwgMiwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICBseWRpYW5Eb21pbmFudDogWzAsIDIsIDIsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgLy8gYWNvdXN0aWM6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIGx5ZGlhbkRvbWluYW50XHJcbiAgICAgICBtaXhvbHlkaWFuOiBbMCwgMiwgMiwgMSwgMiwgMiwgMV0sXHJcbiAgICAgICBtaXhvbHlkaWFuRmxhdDY6IFswLCAyLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGxvY3JpYW46IFswLCAxLCAyLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIHN1cGVyTG9jcmlhbjogWzAsIDEsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgLy8gbWlub3JcclxuICAgICAgIG1pbm9yOiBbMCwgMiwgMSwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICBtaW5vcjdiOTogWzAsIDEsIDIsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgbWlub3I3YjU6IFswLCAyLCAxLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIC8vIGhhbGZEaW1pbmlzaGVkOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtaW5vcjdiNVxyXG4gICAgICAgLy8gaGFybW9uaWNcclxuICAgICAgIGhhcm1vbmljTWFqb3I6IFswLCAyLCAyLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIGhhcm1vbmljTWlub3I6IFswLCAyLCAxLCAyLCAyLCAxLCAzXSxcclxuICAgICAgIGRvdWJsZUhhcm1vbmljOiBbMCwgMSwgMywgMSwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBieXphbnRpbmU6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIGRvdWJsZUhhcm1vbmljXHJcbiAgICAgICAvLyBtZWxvZGljXHJcbiAgICAgICBtZWxvZGljTWlub3JBc2NlbmRpbmc6IFswLCAyLCAxLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIG1lbG9kaWNNaW5vckRlc2NlbmRpbmc6IFswLCAyLCAyLCAxLCAyLCAyLCAxXSxcclxuICAgICAgIC8vIHBlbnRhdG9uaWNcclxuICAgICAgIG1ham9yUGVudGF0b25pYzogWzAsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgbWFqb3JQZW50YXRvbmljQmx1ZXM6IFswLCAyLCAxLCAxLCAzLCAyXSxcclxuICAgICAgIG1pbm9yUGVudGF0b25pYzogWzAsIDMsIDIsIDIsIDNdLFxyXG4gICAgICAgbWlub3JQZW50YXRvbmljQmx1ZXM6IFswLCAzLCAyLCAxLCAxLCAzXSxcclxuICAgICAgIGI1UGVudGF0b25pYzogWzAsIDMsIDIsIDEsIDQsIDJdLFxyXG4gICAgICAgbWlub3I2UGVudGF0b25pYzogWzAsIDMsIDIsIDIsIDIsIDNdLFxyXG4gICAgICAgLy8gZW5pZ21hdGljXHJcbiAgICAgICBlbmlnbWF0aWNNYWpvcjogWzAsIDEsIDMsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgZW5pZ21hdGljTWlub3I6IFswLCAxLCAyLCAzLCAxLCAzLCAxXSxcclxuICAgICAgIC8vIDhUb25lXHJcbiAgICAgICBkaW04VG9uZTogWzAsIDIsIDEsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgZG9tOFRvbmU6IFswLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIC8vIG5lYXBvbGl0YW5cclxuICAgICAgIG5lYXBvbGl0YW5NYWpvcjogWzAsIDEsIDIsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgbmVhcG9saXRhbk1pbm9yOiBbMCwgMSwgMiwgMiwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBodW5nYXJpYW5cclxuICAgICAgIGh1bmdhcmlhbk1ham9yOiBbMCwgMywgMSwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICBodW5nYXJpYW5NaW5vcjogWzAsIDIsIDEsIDMsIDEsIDEsIDNdLFxyXG4gICAgICAgaHVuZ2FyaWFuR3lwc3k6IFswLCAxLCAzLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIHNwYW5pc2hcclxuICAgICAgIHNwYW5pc2g6IFswLCAxLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIHNwYW5pc2g4VG9uZTogWzAsIDEsIDIsIDEsIDEsIDEsIDIsIDJdLFxyXG4gICAgICAgLy8gamV3aXNoOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBzcGFuaXNoOFRvbmVcclxuICAgICAgIHNwYW5pc2hHeXBzeTogWzAsIDEsIDMsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gYXVnIGRvbVxyXG4gICAgICAgYXVnbWVudGVkOiBbMCwgMywgMSwgMywgMSwgMywgMV0sXHJcbiAgICAgICBkb21pbmFudFN1c3BlbmRlZDogWzAsIDIsIDMsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gYmVib3BcclxuICAgICAgIGJlYm9wTWFqb3I6IFswLCAyLCAyLCAxLCAyLCAxLCAxLCAyXSxcclxuICAgICAgIGJlYm9wRG9taW5hbnQ6IFswLCAyLCAyLCAxLCAyLCAyLCAxLCAxXSxcclxuICAgICAgIG15c3RpYzogWzAsIDIsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgb3ZlcnRvbmU6IFswLCAyLCAyLCAyLCAxLCAxLCAyXSxcclxuICAgICAgIGxlYWRpbmdUb25lOiBbMCwgMiwgMiwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICAvLyBqYXBhbmVzZVxyXG4gICAgICAgaGlyb2pvc2hpOiBbMCwgMiwgMSwgNCwgMV0sXHJcbiAgICAgICBqYXBhbmVzZUE6IFswLCAxLCA0LCAxLCAzXSxcclxuICAgICAgIGphcGFuZXNlQjogWzAsIDIsIDMsIDEsIDNdLFxyXG4gICAgICAgLy8gY3VsdHVyZXNcclxuICAgICAgIG9yaWVudGFsOiBbMCwgMSwgMywgMSwgMSwgMywgMV0sXHJcbiAgICAgICBwZXJzaWFuOiBbMCwgMSwgNCwgMSwgMiwgM10sXHJcbiAgICAgICBhcmFiaWFuOiBbMCwgMiwgMiwgMSwgMSwgMiwgMl0sXHJcbiAgICAgICBiYWxpbmVzZTogWzAsIDEsIDIsIDQsIDFdLFxyXG4gICAgICAga3Vtb2k6IFswLCAyLCAxLCA0LCAyLCAyXSxcclxuICAgICAgIHBlbG9nOiBbMCwgMSwgMiwgMywgMSwgMV0sXHJcbiAgICAgICBhbGdlcmlhbjogWzAsIDIsIDEsIDIsIDEsIDEsIDEsIDNdLFxyXG4gICAgICAgY2hpbmVzZTogWzAsIDQsIDIsIDEsIDRdLFxyXG4gICAgICAgbW9uZ29saWFuOiBbMCwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBlZ3lwdGlhbjogWzAsIDIsIDMsIDIsIDNdLFxyXG4gICAgICAgcm9tYWluaWFuOiBbMCwgMiwgMSwgMywgMSwgMiwgMV0sXHJcbiAgICAgICBoaW5kdTogWzAsIDIsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgaW5zZW46IFswLCAxLCA0LCAyLCAzXSxcclxuICAgICAgIGl3YXRvOiBbMCwgMSwgNCwgMSwgNF0sXHJcbiAgICAgICBzY290dGlzaDogWzAsIDIsIDMsIDIsIDJdLFxyXG4gICAgICAgeW86IFswLCAzLCAyLCAyLCAzXSxcclxuICAgICAgIGlzdHJpYW46IFswLCAxLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIHVrcmFuaWFuRG9yaWFuOiBbMCwgMiwgMSwgMywgMSwgMiwgMV0sXHJcbiAgICAgICBwZXRydXNoa2E6IFswLCAxLCAzLCAyLCAxLCAzXSxcclxuICAgICAgIGFoYXZhcmFiYTogWzAsIDEsIDMsIDEsIDIsIDEsIDJdLFxyXG4gICB9O1xyXG4gICAvLyBkdXBsaWNhdGVzIHdpdGggYWxpYXNlc1xyXG4gICBTY2FsZVRlbXBsYXRlcy5oYWxmRGltaW5pc2hlZCA9IFNjYWxlVGVtcGxhdGVzLm1pbm9yN2I1O1xyXG4gICBTY2FsZVRlbXBsYXRlcy5qZXdpc2ggPSBTY2FsZVRlbXBsYXRlcy5zcGFuaXNoOFRvbmU7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmJ5emFudGluZSA9IFNjYWxlVGVtcGxhdGVzLmRvdWJsZUhhcm1vbmljO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5hY291c3RpYyA9IFNjYWxlVGVtcGxhdGVzLmx5ZGlhbkRvbWluYW50O1xyXG4gICBTY2FsZVRlbXBsYXRlcy5hZW9saWFuID0gU2NhbGVUZW1wbGF0ZXMubWlub3I7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmlvbmlhbiA9IFNjYWxlVGVtcGxhdGVzLm1ham9yO1xyXG4gICBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcykuZm9yRWFjaCgoZWxlbWVudCkgPT4gT2JqZWN0LmZyZWV6ZShTY2FsZVRlbXBsYXRlc1tlbGVtZW50XSkpO1xuXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIGNvbnN0IG5hbWVSZWdleCQxID0gLyhbQS1HXSkoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCQxID0gLygjfHN8YikoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXgkMSA9IC8oWzAtOV0rKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBzY2FsZU5hbWVSZWdleCA9IC8oXFwoW2EtekEtWl17Mix9XFwpKS9nO1xyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gcGFyc2UgYSBub3RlIGZyb20gYSBzdHJpbmdcclxuICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHN0cmluZyB0byBwYXJzZVxyXG4gICAgKiBAcGFyYW0gc3VwcmVzc1dhcm5pbmcgLSBzdXByZXNzIHRoZSB3YXJuaW5nIGZvciBpbmVmZmVjaWVuY3kgaWYgdHJ1ZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlU2NhbGUgPSAoc2NhbGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2NhbGVMb29rdXAoc2NhbGUpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBzY2FsZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7c2NhbGV9LiBHZXQgYSBwZXJmb3JtYW5jIGluY3JlYXNlIGJ5IHVzaW5nIGEgdmFsaWQgZm9ybWF0YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBzY2FsZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7c2NhbGV9LiBHZXQgYSBwZXJmb3JtYW5jIGluY3JlYXNlIGJ5IHVzaW5nIGEgdmFsaWQgZm9ybWF0YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGxldCBzY2FsZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gc2NhbGUubWF0Y2gobmFtZVJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IHNjYWxlLm1hdGNoKG1vZGlmaWVyUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IHNjYWxlLm1hdGNoKG9jdGF2ZVJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lTWF0Y2ggPSBzY2FsZS5tYXRjaChzY2FsZU5hbWVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoc2NhbGVOYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBzTmFtZSA9IHNjYWxlTmFtZU1hdGNoLmpvaW4oXCJcIik7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coc05hbWUpO1xyXG4gICAgICAgICAgIHNjYWxlTmFtZSA9IHNOYW1lO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIGxldCB0ZW1wbGF0ZUluZGV4ID0gMTsgLy8gZGVmYXVsdCBtYWpvciBzY2FsZVxyXG4gICAgICAgICAgIGlmIChzY2FsZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGVJbmRleCA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKS5maW5kSW5kZXgoKHRlbXBsYXRlKSA9PiB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgICAgICAgIC5pbmNsdWRlcyhzY2FsZU5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKVt0ZW1wbGF0ZUluZGV4XSk7XHJcbiAgICAgICAgICAgaWYgKHRlbXBsYXRlSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5LTk9XTiBURU1QTEFURVwiLCBzY2FsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHRlbXBsYXRlIGZvciBzY2FsZSAke3NjYWxlTmFtZX1gKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlc1tPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcylbdGVtcGxhdGVJbmRleF1dO1xyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIGtleTogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBTY2FsZTogJHtzY2FsZX1gKTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQyID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgc2NhbGVUYWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGNvbnN0IHRlbXBsYXRlcyA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgdGVtcGxhdGVzKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBub3RlTGFiZWwgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICAgICAgLy9leCBBKG1pbm9yKVxyXG4gICAgICAgICAgICAgICBzY2FsZVRhYmxlW2Ake25vdGVMYWJlbH0oJHt0ZW1wbGF0ZX0pYF0gPSBwYXJzZVNjYWxlKG5vdGVMYWJlbCwgdHJ1ZSk7IC8vICdDJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHttb2R9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBleCBBIyhtaW5vcilcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0MjJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDwgT0NUQVZFX01BWDsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtpT2N0YXZlfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gZXggQTQobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9kIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHttb2R9JHtpT2N0YXZlfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGV4IEEjNChtaW5vcilcclxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDIzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gc2NhbGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgdGhlIGxvb2t1cCB0YWJsZSBhcyBzb29uIGFzIHRoZSBtb2R1bGUgaXMgbG9hZGVkXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgbGV0IF9zY2FsZUxvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBzY2FsZUxvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9zY2FsZUxvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX3NjYWxlTG9va3VwID0gdGFibGUgYXMgeyBba2V5OiBzdHJpbmddOiBTY2FsZUluaXRpYWxpemVyIH07XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9zY2FsZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRTY2FsZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9zY2FsZUxvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9zY2FsZUxvb2t1cDtcclxuICAgICAgIF9zY2FsZUxvb2t1cCA9IGNyZWF0ZVRhYmxlJDIoKTtcclxuICAgICAgIC8vIE9iamVjdC5mcmVlemUoX3NjYWxlTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiU2NhbGUgVGFibGUgQnVpbHRcIik7XHJcbiAgICAgICByZXR1cm4gX3NjYWxlTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogc2hpZnRzIGFuIGFycmF5IGJ5IGEgZ2l2ZW4gZGlzdGFuY2VcclxuICAgICogQHBhcmFtIGFyciB0aGUgYXJyYXkgdG8gc2hpZnRcclxuICAgICogQHBhcmFtIGRpc3RhbmNlIHRoZSBkaXN0YW5jZSB0byBzaGlmdFxyXG4gICAgKiBAcmV0dXJucyB0aGUgc2hpZnRlZCBhcnJheVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNoaWZ0ID0gKGFyciwgZGlzdCA9IDEpID0+IHtcclxuICAgICAgIGFyciA9IFsuLi5hcnJdOyAvLyBjb3B5XHJcbiAgICAgICBpZiAoZGlzdCA+IGFyci5sZW5ndGggfHwgZGlzdCA8IDAgLSBhcnIubGVuZ3RoKVxyXG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNoaWZ0OiBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gYXJyYXkgbGVuZ3RoXCIpO1xyXG4gICAgICAgaWYgKGRpc3QgPiAwKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGVtcCA9IGFyci5zcGxpY2UoYXJyLmxlbmd0aCAtIGRpc3QsIEluZmluaXR5KTtcclxuICAgICAgICAgICBhcnIudW5zaGlmdCguLi50ZW1wKTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChkaXN0IDwgMCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnIuc3BsaWNlKDAsIGRpc3QpO1xyXG4gICAgICAgICAgIGFyci5wdXNoKC4uLnRlbXApO1xyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGFycjtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqICBTaW1wbGUgdXRpbCB0byBsYXp5IGNsb25lIGFuIG9iamVjdFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNsb25lID0gKG9iaikgPT4ge1xyXG4gICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBzaW1wbGUgdXRpbCB0byBsYXp5IGNoZWNrIGVxdWFsaXR5IG9mIG9iamVjdHMgYW5kIGFycmF5c1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGlzRXF1YWwgPSAoYSwgYikgPT4ge1xyXG4gICAgICAgY29uc3Qgc3RyaW5nQSA9IEpTT04uc3RyaW5naWZ5KGEpO1xyXG4gICAgICAgY29uc3Qgc3RyaW5nQiA9IEpTT04uc3RyaW5naWZ5KGIpO1xyXG4gICAgICAgcmV0dXJuIHN0cmluZ0EgPT09IHN0cmluZ0I7XHJcbiAgIH07XG5cbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlU3RyaW5nTG9va3VwLmpzb25cIjtcclxuICAgLyoqXHJcbiAgICAqIFdpbGwgbG9va3VwIGEgc2NhbGUgbmFtZSBiYXNlZCBvbiB0aGUgdGVtcGxhdGUuXHJcbiAgICAqIEBwYXJhbSB0ZW1wbGF0ZSAtIHRoZSB0ZW1wbGF0ZSB0byBsb29rdXBcclxuICAgICogQHBhcmFtIHN1cHJlc3NXYXJuaW5nIC0gc3VwcmVzcyB0aGUgd2FybmluZyBmb3IgaW5lZmZlY2llbmN5IGlmIHRydWVcclxuICAgICogQHJldHVybnMgdGhlIHNjYWxlIG5hbWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzY2FsZU5hbWVMb29rdXAgPSAodGVtcGxhdGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmFtZVRhYmxlKEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdClcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lcyA9IFtdO1xyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgaWYgKGlzRXF1YWwodmFsdWVzW2ldLCB0ZW1wbGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgc2NhbGVOYW1lcy5wdXNoKGtleXNbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXlzW2ldLnNsaWNlKDEpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVzU3RyaW5nID0gc2NhbGVOYW1lcy5qb2luKFwiIEFLQSBcIik7XHJcbiAgICAgICByZXR1cm4gc2NhbGVOYW1lc1N0cmluZztcclxuICAgfTtcclxuICAgY29uc3QgY3JlYXRlVGFibGUkMSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgdGFibGVbSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpXSA9IHNjYWxlTmFtZUxvb2t1cCh0ZW1wbGF0ZSwgdHJ1ZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGxldCBfbmFtZVRhYmxlID0ge307XHJcbiAgIGNvbnN0IG5hbWVUYWJsZSA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVOYW1lVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbmFtZVRhYmxlW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbmFtZVRhYmxlID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9uYW1lVGFibGUgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVOYW1lVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX25hbWVUYWJsZSkubGVuZ3RoID4gMCkgcmV0dXJuIF9uYW1lVGFibGU7XHJcbiAgICAgICBfbmFtZVRhYmxlID0gY3JlYXRlVGFibGUkMSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbmFtZVRhYmxlKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiU2NhbGUgbmFtZSB0YWJsZSBidWlsdFwiKTtcclxuICAgICAgIHJldHVybiBfbmFtZVRhYmxlO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2NhbGVzIGNvbnNpc3Qgb2YgYSBrZXkodG9uaWMgb3Igcm9vdCkgYW5kIGEgdGVtcGxhdGUoYXJyYXkgb2YgaW50ZWdlcnMpIHRoYXRcclxuICAgICogPGJyPiByZXByZXNlbnRzIHRoZSBpbnRlcnZhbCBvZiBzdGVwcyBiZXR3ZWVuIGVhY2ggbm90ZS5cclxuICAgICogPGJyPjxicj5TY2FsZSBpbnRlcnZhbHMgYXJlIHJlcHJlc2VudGVkIGJ5IGFuIGludGVnZXJcclxuICAgICogPGJyPnRoYXQgaXMgdGhlIG51bWJlciBvZiBzZW1pdG9uZXMgYmV0d2VlbiBlYWNoIG5vdGUuXHJcbiAgICAqIDxicj4wID0ga2V5IC0gd2lsbCBhbHdheXMgcmVwcmVzZW50IHRoZSB0b25pY1xyXG4gICAgKiA8YnI+MSA9IGhhbGYgc3RlcFxyXG4gICAgKiA8YnI+MiA9IHdob2xlIHN0ZXBcclxuICAgICogPGJyPjMgPSBvbmUgYW5kIG9uZSBoYWxmIHN0ZXBzXHJcbiAgICAqIDxicj40ID0gZG91YmxlIHN0ZXBcclxuICAgICogPGJyPlswLCAyLCAyLCAxLCAyLCAyLCAyXSByZXByZXNlbnRzIHRoZSBtYWpvciBzY2FsZVxyXG4gICAgKiA8YnI+PGJyPiBTY2FsZSB0ZW1wbGF0ZXMgbWF5IGhhdmUgYXJiaXRyYXkgbGVuZ3Roc1xyXG4gICAgKlxyXG4gICAgKiBUaGUgZm9sbG93aW5nIFByZS1kZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOlxyXG4gICAgKiA8dGFibGU+XHJcbiAgICAqIDx0cj5cclxuICAgICogPHRkPm1ham9yPC90ZD5cclxuICAgICogPHRkPm1pbm9yPC90ZD5cclxuICAgICogPHRkPmlvbmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5kb3JpYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnBocnlnaWFuPC90ZD5cclxuICAgICogPHRkPmx5ZGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5taXhvbHlkaWFuPC90ZD5cclxuICAgICogPHRkPmFlb2xpYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmxvY3JpYW48L3RkPlxyXG4gICAgKiA8dGQ+ZW5pZ21hdGljTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+ZW5pZ21hdGljTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I3YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1ham9yN3M0czU8L3RkPlxyXG4gICAgKiA8dGQ+aGFybW9uaWNNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5oYXJtb25pY01pbm9yPC90ZD5cclxuICAgICogPHRkPmRvdWJsZUhhcm1vbmljPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tZWxvZGljTWlub3JBc2NlbmRpbmc8L3RkPlxyXG4gICAgKiA8dGQ+bWVsb2RpY01pbm9yRGVzY2VuZGluZzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbm9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAqIDx0ZD5iNVBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I2UGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZGltOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+bmVvcG9saXRhbk1ham9yPC90ZD5cclxuICAgICogPHRkPm5lb3BvbGl0YW5NaW5vcjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuR3lwc3k8L3RkPlxyXG4gICAgKiA8dGQ+c3BhbmlzaDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+c3BhbmlzaDhUb25lPC90ZD5cclxuICAgICogPHRkPnNwYW5pc2hHeXBzeTwvdGQ+XHJcbiAgICAqIDx0ZD5hdWdtZW50ZWQ8L3RkPlxyXG4gICAgKiA8dGQ+ZG9taW5hbnRTdXNwZW5kZWQ8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmJlYm9wTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+YmVib3BEb21pbmFudDwvdGQ+XHJcbiAgICAqIDx0ZD5teXN0aWM8L3RkPlxyXG4gICAgKiA8dGQ+b3ZlcnRvbmU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmxlYWRpbmdUb25lPC90ZD5cclxuICAgICogPHRkPmhpcm9qb3NoaTwvdGQ+XHJcbiAgICAqIDx0ZD5qYXBhbmVzZUE8L3RkPlxyXG4gICAgKiA8dGQ+amFwYW5lc2VCPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5vcmllbnRhbDwvdGQ+XHJcbiAgICAqIDx0ZD5hcmFiaWFuPC90ZD5cclxuICAgICogPHRkPnBlcnNpYW48L3RkPlxyXG4gICAgKiA8dGQ+YmFsaW5lc2U8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmt1bW9pPC90ZD5cclxuICAgICogPHRkPnBlbG9nPC90ZD5cclxuICAgICogPHRkPmFsZ2VyaWFuPC90ZD5cclxuICAgICogPHRkPmNoaW5lc2U8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1vbmdvbGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5lZ3lwdGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAqIDx0ZD5yb21hbmlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgKiA8dGQ+aW5zZW48L3RkPlxyXG4gICAgKiA8dGQ+aXdhdG88L3RkPlxyXG4gICAgKiA8dGQ+c2NvdHRpc2g8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnlvPC90ZD5cclxuICAgICogPHRkPmlzdHJpYW48L3RkPlxyXG4gICAgKiA8dGQ+dWtyYW5pYW5Eb3JpYW48L3RkPlxyXG4gICAgKiA8dGQ+cGV0cnVzaGthPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5haGF2YXJhYmE8L3RkPlxyXG4gICAgKiA8dGQ+aGFsZkRpbWluaXNoZWQ8L3RkPlxyXG4gICAgKiA8dGQ+amV3aXNoPC90ZD5cclxuICAgICogPHRkPmJ5emFudGluZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YWNvdXN0aWM8L3RkPlxyXG4gICAgKiA8L3RhYmxlPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7U2NhbGV9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgKiBpbXBvcnQge1NjYWxlVGVtcGxhdGVzfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICogaW1wb3J0IHtTY2FsZUluaXRpYWxpemVyfSBmcm9tICdtdXNpY3RoZW9yeWpzJzsgLy8gVHlwZVNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIFNjYWxlIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7U2NhbGUsIFNjYWxlVGVtcGxhdGVzfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgZGVmYXVsdCB0ZW1wbGF0ZSwga2V5IDBmIDAoQykgYW5kIGFuIG9jdGF2ZSBvZiA0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSB0ZW1wbGF0ZSBbMCwgMiwgMiwgMSwgMiwgMiwgMl0gYW5kIGtleSA0KEUpIGFuZCBvY3RhdmUgNVxyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gbmV3IFNjYWxlKHtrZXk6IDQsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1ham9yfSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogbm90ZS1uYW1lW2FsdGVyYXRpb25dW29jdGF2ZV1bKHNjYWxlLW5hbWUpXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIG1pbm9yIHRlbXBsYXRlLCBrZXkgR2IgYW5kIGFuIG9jdGF2ZSBvZiA3XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTMgPSBuZXcgU2NhbGUoJ0diNyhtaW5vciknKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gREVGQVVMVF9TQ0FMRV9URU1QTEFURTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlcyA9IHBhcnNlU2NhbGUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFsuLi4odmFsdWVzPy50ZW1wbGF0ZSA/PyBERUZBVUxUX1NDQUxFX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gdmFsdWVzLmtleSB8fCBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgfHwgREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAvLyBpbXBvcnRhbnQgdGhhdCBvY3RhdmUgaXMgc2V0IGZpcnN0IHNvIHRoYXRcclxuICAgICAgICAgICAgICAgLy8gc2V0dGluZyB0aGUgc2VtaXRvbmUgY2FuIGNoYW5nZSB0aGUgb2N0YXZlXHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBbLi4uKHZhbHVlcz8udGVtcGxhdGUgPz8gREVGQVVMVF9TQ0FMRV9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IHZhbHVlcy5rZXkgfHwgREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlIHx8IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIHVuaXF1ZSBpZCBmb3IgdGhpcyBzY2FsZShhdXRvIGdlbmVyYXRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuaWQpOyAvLyBkaGxrajVqMzIyXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgc2NhbGUgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIHNjYWxlXHJcbiAgICAgICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc2NhbGUgdG8gY29tcGFyZSB0b1xyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgc2NhbGVzIGFyZSBlcXVhbFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmVxdWFscyhzY2FsZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhzY2FsZSkge1xyXG4gICAgICAgICAgIHJldHVybiAodGhpcy5fa2V5ID09PSBzY2FsZS5fa2V5ICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMuX29jdGF2ZSA9PT0gc2NhbGUuX29jdGF2ZSAmJlxyXG4gICAgICAgICAgICAgICBpc0VxdWFsKHRoaXMuX3RlbXBsYXRlLCBzY2FsZS5fdGVtcGxhdGUpKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhpcyBTY2FsZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgU2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gc2NhbGUuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZXF1YWxzKHNjYWxlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5rZXksXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBjbG9uZSh0aGlzLnRlbXBsYXRlKSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsICE9PSAwKVxyXG4gICAgICAgICAgICAgICBzY2FsZS5zaGlmdCh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICoga2V5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9rZXkgPSAwO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmtleSk7IC8vIDAoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IGtleSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIHRoZSBzZW1pdG9uZSB0byBhIHZhbHVlIG91dHNpZGUgb2YgdGhlIHJhbmdlIFswLCAxMV0oc2VtaXRvbmUpIHdpbGw8YnIvPlxyXG4gICAgICAgICogd3JhcCB0aGUgc2VtaXRvbmUgdG8gdGhlIHJhbmdlIFswLCAxMV0gYW5kIGNoYW5nZSB0aGUgb2N0YXZlIGRlcGVuZGluZzxici8+XHJcbiAgICAgICAgKiBvbiBob3cgbWFueSB0aW1lcyB0aGUgc2VtaXRvbmUgaGFzIGJlZW4gd3JhcHBlZC5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUua2V5ID0gNDtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmtleSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQga2V5KHZhbHVlKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAodmFsdWUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHRoaXMub2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICB0aGlzLl9rZXkgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUub2N0YXZlKTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS5vY3RhdmUgPSA1O1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUub2N0YXZlKTsgLy8gNVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcCh2YWx1ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHRlbXBsYXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90ZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRlbXBsYXRlKTsgLy8gWzAsIDIsIDIsIDEsIDIsIDIsIDJdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgIHJldHVybiBjbG9uZSh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBmb2xsb3dpbmcgUHJlLWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6XHJcbiAgICAgICAgKiA8dGFibGU+XHJcbiAgICAgICAgKiA8dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5pb25pYW48L3RkPlxyXG4gICAgICAgICogPHRkPmRvcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5waHJ5Z2lhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bHlkaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5taXhvbHlkaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5hZW9saWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmxvY3JpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmVuaWdtYXRpY01ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5lbmlnbWF0aWNNaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I3YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3I3czRzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFybW9uaWNNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFybW9uaWNNaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG91YmxlSGFybW9uaWM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWVsb2RpY01pbm9yQXNjZW5kaW5nPC90ZD5cclxuICAgICAgICAqIDx0ZD5tZWxvZGljTWlub3JEZXNjZW5kaW5nPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1ham9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbm9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgICAgICogPHRkPmI1UGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I2UGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kaW04VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPm5lb3BvbGl0YW5NYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bmVvcG9saXRhbk1pbm9yPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbk1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5NaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuR3lwc3k8L3RkPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2g8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaDhUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoR3lwc3k8L3RkPlxyXG4gICAgICAgICogPHRkPmF1Z21lbnRlZDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9taW5hbnRTdXNwZW5kZWQ8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YmVib3BNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YmVib3BEb21pbmFudDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bXlzdGljPC90ZD5cclxuICAgICAgICAqIDx0ZD5vdmVydG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5sZWFkaW5nVG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGlyb2pvc2hpPC90ZD5cclxuICAgICAgICAqIDx0ZD5qYXBhbmVzZUE8L3RkPlxyXG4gICAgICAgICogPHRkPmphcGFuZXNlQjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5vcmllbnRhbDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXJhYmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGVyc2lhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YmFsaW5lc2U8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+a3Vtb2k8L3RkPlxyXG4gICAgICAgICogPHRkPnBlbG9nPC90ZD5cclxuICAgICAgICAqIDx0ZD5hbGdlcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+Y2hpbmVzZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tb25nb2xpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmVneXB0aWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cm9tYW5pYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgICAgICogPHRkPmluc2VuPC90ZD5cclxuICAgICAgICAqIDx0ZD5pd2F0bzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c2NvdHRpc2g8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+eW88L3RkPlxyXG4gICAgICAgICogPHRkPmlzdHJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnVrcmFuaWFuRG9yaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZXRydXNoa2E8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YWhhdmFyYWJhPC90ZD5cclxuICAgICAgICAqIDx0ZD5oYWxmRGltaW5pc2hlZDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amV3aXNoPC90ZD5cclxuICAgICAgICAqIDx0ZD5ieXphbnRpbmU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YWNvdXN0aWM8L3RkPlxyXG4gICAgICAgICogPC90YWJsZT5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUudGVtcGxhdGUgPSBbMCwgMiwgMiwgMSwgMiwgMiwgMl07XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50ZW1wbGF0ZSk7IC8vIFswLCAyLCAyLCAxLCAyLCAyLCAyXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gY2xvbmUodmFsdWUpO1xyXG4gICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG5vdGVzXHJcbiAgICAgICAgKiBub3RlcyBhcmUgZ2VuZXJhdGVkIGFuZCBjYWNoZWQgYXMgbmVlZGVkXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9ub3RlcyA9IFtdO1xyXG4gICAgICAgX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB3aWxsIGdlbmVyYXRlIHRoZSBub3RlcyBpZiBuZWVkZWQgb3IgcmV0dXJuIHRoZSBjYWNoZWQgbm90ZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubm90ZXMpOyAvLyBMaXN0IG9mIG5vdGVzXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG5vdGVzKCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9ub3Rlc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOb3RlcygpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZ2VuZXJhdGUgbm90ZXMoaW50ZXJuYWwpXHJcbiAgICAgICAgKiBnZW5lcmF0ZXMgdGhlIG5vdGVzIGZvciB0aGlzIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdlbmVyYXRlTm90ZXMoKSB7XHJcbiAgICAgICAgICAgLy8gdXNlIHRoZSB0ZW1wbGF0ZSB1bnNoaWZ0ZWQgZm9yIHNpbXBsaWNpdHlcclxuICAgICAgICAgICBjb25zdCB1bnNoaWZ0ZWRUZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCAtdGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICAvLyBpZiBhbGxvd2luZyB0aGlzIHRvIGNoYW5nZSB0aGUgb2N0YXZlIGlzIHVuZGVzaXJhYmxlXHJcbiAgICAgICAgICAgLy8gdGhlbiBtYXkgbmVlZCB0byBwcmUgd3JhcCB0aGUgdG9uZSBhbmQgdXNlXHJcbiAgICAgICAgICAgLy8gdGhlIGZpbmFsIHZhbHVlXHJcbiAgICAgICAgICAgY29uc3Qgbm90ZXMgPSBbXTtcclxuICAgICAgICAgICBsZXQgYWNjdW11bGF0b3IgPSB0aGlzLmtleTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHVuc2hpZnRlZFRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRvbmUgPSBpbnRlcnZhbCA9PT0gMFxyXG4gICAgICAgICAgICAgICAgICAgPyAoYWNjdW11bGF0b3IgPSB0aGlzLmtleSlcclxuICAgICAgICAgICAgICAgICAgIDogKGFjY3VtdWxhdG9yICs9IGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiB0b25lLFxyXG4gICAgICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnB1c2gobm90ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIHNoaWZ0IG5vdGVzIGJhY2sgdG8gb3JpZ2luYWwgcG9zaXRpb25cclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsID4gMCkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gbm90ZXMuc3BsaWNlKG5vdGVzLmxlbmd0aCAtICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKyAxKSwgSW5maW5pdHkpO1xyXG4gICAgICAgICAgICAgICBub3Rlcy51bnNoaWZ0KC4uLnRlbXApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsIDwgMCkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gbm90ZXMuc3BsaWNlKDAsIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnB1c2goLi4udGVtcCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzID0gbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBub3RlcyBpbiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBwYXJhbSBwcmVmZXJTaGFycEtleXMgLSBpZiB0cnVlIHRoZW4gc2hhcnBzIHdpbGwgYmUgcHJlZmVycmVkIG92ZXIgZmxhdHMgd2hlbiBzZW1pdG9uZXMgY291bGQgYmUgZWl0aGVyIC0gZXg6IEJiL0EjXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG5vdGVzIGluIHRoZSBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5uYW1lcyk7IC8vIFsnQzQnLCAnRDQnLCAnRTQnLCAnRjQnLCAnRzQnLCAnQTQnLCAnQjQnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE5vdGVOYW1lcyhwcmVmZXJTaGFycEtleSA9IHRydWUpIHtcclxuICAgICAgICAgICBjb25zdCBuYW1lcyA9IHNjYWxlTm90ZU5hbWVMb29rdXAodGhpcywgcHJlZmVyU2hhcnBLZXkpO1xyXG4gICAgICAgICAgIHJldHVybiBuYW1lcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZGVncmVlXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbm90ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGRlZ3JlZVxyXG4gICAgICAgICogQHBhcmFtIGRlZ3JlZSAtIHRoZSBkZWdyZWUgdG8gcmV0dXJuXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5vdGUgdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBkZWdyZWVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZGVncmVlKDApKTsgLy8gQzQoTm90ZSlcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRlZ3JlZSgxKSk7IC8vIEQ0KE5vdGUpIGV0Y1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRlZ3JlZShkZWdyZWUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcChkZWdyZWUgLSAxIC8qemVybyBpbmRleCAqLywgMCwgdGhpcy5ub3Rlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICBjb25zdCBub3RlID0gdGhpcy5ub3Rlc1t3cmFwcGVkLnZhbHVlXS5jb3B5KCk7XHJcbiAgICAgICAgICAgbm90ZS5vY3RhdmUgPSB0aGlzLm9jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgcmV0dXJuIG5vdGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJlbGF0aXZlIG1ham9yXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1ham9yIG9mIHRoaXMgc2NhbGUgLSB0YWtlcyB0aGUgM3JkIGRlZ3JlZSBhcyBpdCdzIGtleVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWFqb3Igb2YgdGhpcyBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5yZWxhdGl2ZU1ham9yKCkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHJlbGF0aXZlTWFqb3IoKSB7XHJcbiAgICAgICAgICAgY29uc3QgbWFqb3IgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3IsXHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5kZWdyZWUoMykuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG1ham9yO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZWxhdGl2ZSBtaW5vclxyXG4gICAgICAgICogcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtaW5vciBvZiB0aGlzIHNjYWxlIC0gdGFrZXMgdGhlIDZ0aCBkZWdyZWUgYXMgaXQncyBrZXlcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1pbm9yIG9mIHRoaXMgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucmVsYXRpdmVNaW5vcigpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICByZWxhdGl2ZU1pbm9yKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG1pbm9yID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1pbm9yLFxyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMuZGVncmVlKDYpLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIHJldHVybiBtaW5vcjtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRcclxuICAgICAgICAqL1xyXG4gICAgICAgX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICBfb3JpZ2luYWxUZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdFxyXG4gICAgICAgICogc2hpZnRzIHRoZSBzY2FsZSBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBwYXJhbSBzaGlmdCAtIHRoZSBudW1iZXIgb2YgZGVncmVlcyB0byBzaGlmdCB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHNoaWZ0ZWQgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0KGRlZ3JlZXMgPSAxKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlID0gY2xvbmUodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCBkZWdyZWVzKTtcclxuICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKz0gZGVncmVlcztcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRlZFxyXG4gICAgICAgICogcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHBhcmFtIGRlZ3JlZXMgLSB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgdG8gc2hpZnQgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdGVkKDEpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdGVkKGRlZ3JlZXMgPSAxKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS5zaGlmdChkZWdyZWVzKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuc2hpZnRcclxuICAgICAgICAqIHNoaWZ0cyB0aGUgb3JpZ2luYWwgcm9vdCBiYWNrIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGlzIHNjYWxlIGFmdGVyIHVuc2hpZnRpbmcgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS51bnNoaWZ0KCkpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHVuc2hpZnQoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHRoaXMuX29yaWdpbmFsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy8gdGhpcy5zaGlmdCh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKiAtMSk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsVGVtcGxhdGUgPSBbXTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bnNoaWZ0ZWRcclxuICAgICAgICAqIHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgd2l0aCB0aGUgdG9uaWMgc2hpZnRlZCBiYWNrXHJcbiAgICAgICAgKiB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgd2l0aCB0aGUgdG9uaWMgc2hpZnRlZCBiYWNrXHJcbiAgICAgICAgKiB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS51bnNoaWZ0ZWQoKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdW5zaGlmdGVkKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX29yaWdpbmFsVGVtcGxhdGUubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IHRoaXMuX29yaWdpbmFsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgc2NhbGUudW5zaGlmdCgpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgYW1vdW50IHRoYXQgdGhlIHNjYWxlIGhhcyBzaGlmdGVkXHJcbiAgICAgICAgKiAoMCBpZiBub3Qgc2hpZnRlZClcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBhbW91bnQgdGhhdCB0aGUgc2NhbGUgaGFzIHNoaWZ0ZWRcclxuICAgICAgICAqICgwIGlmIG5vdCBzaGlmdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdGVkKCkpOyAvLyAxXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnRlZEludGVydmFsKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9zaGlmdGVkSW50ZXJ2YWw7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNjYWxlIG1vZGVzXHJcbiAgICAgICAgKi9cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIElvbmlhbihtYWpvcikgbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5pb25pYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW9uaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5pb25pYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgRG9yaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZG9yaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRvcmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuZG9yaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIFBocnlnaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucGhyeWdpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcGhyeWdpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLnBocnlnaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIEx5ZGlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmx5ZGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBseWRpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmx5ZGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBNaXhvbHlkaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubWl4b2x5ZGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaXhvbHlkaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5taXhvbHlkaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIEFlb2xpYW4obWlub3IpIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuYWVvbGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhZW9saWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5hZW9saWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIExvY3JpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5sb2NyaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGxvY3JpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmxvY3JpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgc3RyaW5nIHZlcnNpb24gb2YgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRvU3RyaW5nKCkpOyAvLyAnQydcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICBsZXQgc2NhbGVOYW1lcyA9IHNjYWxlTmFtZUxvb2t1cCh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgaWYgKCFzY2FsZU5hbWVzKVxyXG4gICAgICAgICAgICAgICBzY2FsZU5hbWVzID0gdGhpcy5nZXROb3RlTmFtZXMoKS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgcmV0dXJuIGAke1NlbWl0b25lJDFbdGhpcy5fa2V5XX0ke3RoaXMuX29jdGF2ZX0oJHtzY2FsZU5hbWVzfSlgO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBsb29rdXAgdGhlIG5vdGUgbmFtZSBmb3IgYSBzY2FsZSBlZmZpY2llbnRseVxyXG4gICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc2NhbGUgdG8gbG9va3VwXHJcbiAgICAqIEBwYXJhbSBwcmVmZXJTaGFycEtleSAtIGlmIHRydWUsIHdpbGwgcHJlZmVyIHNoYXJwIGtleXMgb3ZlciBmbGF0IGtleXNcclxuICAgICogQHJldHVybnMgdGhlIG5vdGUgbmFtZXMgZm9yIHRoZSBzY2FsZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNjYWxlTm90ZU5hbWVMb29rdXAgPSAoc2NhbGUsIHByZWZlclNoYXJwS2V5ID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtzY2FsZS5rZXl9LSR7c2NhbGUub2N0YXZlfS0ke0pTT04uc3RyaW5naWZ5KHNjYWxlLnRlbXBsYXRlKX1gO1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGVzID0gbm90ZXNMb29rdXAoa2V5KTtcclxuICAgICAgICAgICBpZiAobm90ZXMpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIG5vdGVzO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVzID0gWy4uLnNjYWxlLm5vdGVzXTtcclxuICAgICAgIG5vdGVzID0gc2hpZnQobm90ZXMsIC1zY2FsZS5zaGlmdGVkSW50ZXJ2YWwoKSk7IC8vdW5zaGlmdCBiYWNrIHRvIGtleSA9IDAgaW5kZXhcclxuICAgICAgIGNvbnN0IG5vdGVzUGFydHMgPSBub3Rlcy5tYXAoKG5vdGUpID0+IG5vdGUudG9TdHJpbmcoKS5zcGxpdChcIi9cIikpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlcyA9IG5vdGVzLm1hcCgobm90ZSkgPT4gbm90ZS5vY3RhdmUpO1xyXG4gICAgICAgY29uc3QgcmVtb3ZhYmxlcyA9IFtcIkIjXCIsIFwiQnNcIiwgXCJDYlwiLCBcIkUjXCIsIFwiRXNcIiwgXCJGYlwiXTtcclxuICAgICAgIGNvbnN0IG5vdGVOYW1lcyA9IFtdO1xyXG4gICAgICAgZm9yIChjb25zdCBbaSwgbm90ZVBhcnRzXSBvZiBub3Rlc1BhcnRzLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgIC8vcmVtb3ZlIENiIEIjIGV0Y1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBub3RlUGFydHMpIHtcclxuICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBudW1iZXJzIGZyb20gdGhlIG5vdGUgbmFtZShvY3RhdmUpXHJcbiAgICAgICAgICAgICAgIC8vIHBhcnQucmVwbGFjZSgvXFxkL2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICBpZiAocmVtb3ZhYmxlcy5pbmNsdWRlcyhwYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBub3RlTmFtZXMuaW5kZXhPZihwYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgIG5vdGVOYW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChub3RlTmFtZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKHByZWZlclNoYXJwS2V5ID8gbm90ZVBhcnRzWzBdIDogbm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAobm90ZVBhcnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbMF0pO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3Qgd2hvbGVOb3RlcyA9IFtcclxuICAgICAgICAgICAgICAgXCJBXCIsXHJcbiAgICAgICAgICAgICAgIFwiQlwiLFxyXG4gICAgICAgICAgICAgICBcIkNcIixcclxuICAgICAgICAgICAgICAgXCJEXCIsXHJcbiAgICAgICAgICAgICAgIFwiRVwiLFxyXG4gICAgICAgICAgICAgICBcIkZcIixcclxuICAgICAgICAgICAgICAgXCJHXCIsXHJcbiAgICAgICAgICAgICAgIFwiQVwiLFxyXG4gICAgICAgICAgICAgICBcIkJcIixcclxuICAgICAgICAgICAgICAgXCJDXCIsXHJcbiAgICAgICAgICAgICAgIFwiRFwiLFxyXG4gICAgICAgICAgICAgICBcIkVcIixcclxuICAgICAgICAgICAgICAgXCJGXCIsXHJcbiAgICAgICAgICAgICAgIFwiR1wiLFxyXG4gICAgICAgICAgIF07XHJcbiAgICAgICAgICAgY29uc3QgbGFzdFdob2xlTm90ZSA9IG5vdGVOYW1lc1tub3RlTmFtZXMubGVuZ3RoIC0gMV1bMF07XHJcbiAgICAgICAgICAgY29uc3QgbGFzdEluZGV4ID0gd2hvbGVOb3Rlcy5pbmRleE9mKGxhc3RXaG9sZU5vdGUpO1xyXG4gICAgICAgICAgIGNvbnN0IG5leHROb3RlID0gd2hvbGVOb3Rlc1tsYXN0SW5kZXggKyAxXTtcclxuICAgICAgICAgICBpZiAobm90ZVBhcnRzWzBdLmluY2x1ZGVzKG5leHROb3RlKSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBoYXNPY3RhdmUgPSBub3RlUGFydHNbMF0ubWF0Y2goL1xcZC9nKTtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzWzBdICsgKGhhc09jdGF2ZSA/IFwiXCIgOiBvY3RhdmVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCBoYXNPY3RhdmUgPSBub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdLm1hdGNoKC9cXGQvZyk7XHJcbiAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXSArIChoYXNPY3RhdmUgPyBcIlwiIDogb2N0YXZlc1tpXSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qgc2hpZnRlZE5vdGVOYW1lcyA9IHNoaWZ0KG5vdGVOYW1lcywgc2NhbGUuc2hpZnRlZEludGVydmFsKCkpO1xyXG4gICAgICAgcmV0dXJuIHNoaWZ0ZWROb3RlTmFtZXM7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVOb3Rlc0xvb2t1cFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgc2NhbGVUYWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChsZXQgaXRvbmUgPSBUT05FU19NSU47IGl0b25lIDwgVE9ORVNfTUlOICsgT0NUQVZFX01BWDsgaXRvbmUrKykge1xyXG4gICAgICAgICAgIGZvciAobGV0IGlvY3RhdmUgPSBPQ1RBVkVfTUlOOyBpb2N0YXZlIDw9IE9DVEFWRV9NQVg7IGlvY3RhdmUrKykge1xyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAga2V5OiBpdG9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBpb2N0YXZlLFxyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2Ake2l0b25lfS0ke2lvY3RhdmV9LSR7SlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpfWBdID1cclxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZU5vdGVOYW1lTG9va3VwKHNjYWxlKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBzY2FsZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyB0aGUgbG9va3VwIHRhYmxlIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBpcyBsb2FkZWRcclxuICAgICovXHJcbiAgIGxldCBfbm90ZXNMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZXNMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlTm90ZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVzTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVOb3RlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX25vdGVzTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX25vdGVzTG9va3VwO1xyXG4gICAgICAgX25vdGVzTG9va3VwID0gY3JlYXRlTm90ZXNMb29rdXBUYWJsZSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZXNMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBzY2FsZSBub3RlIHRhYmxlXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3Rlc0xvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNob3J0Y3V0IGZvciBtb2RpZmllcnNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBmbGF0ID0gLTE7XHJcbiAgIGNvbnN0IGZsYXRfZmxhdCA9IC0yO1xyXG4gICBjb25zdCBzaGFycCA9IDE7XHJcbiAgIC8qKlxyXG4gICAgKiBDaG9yZCB0ZW1wbGF0ZXNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBDaG9yZFRlbXBsYXRlcyA9IHtcclxuICAgICAgIG1hajogWzEsIDMsIDVdLFxyXG4gICAgICAgbWFqNDogWzEsIDMsIDQsIDVdLFxyXG4gICAgICAgbWFqNjogWzEsIDMsIDUsIDZdLFxyXG4gICAgICAgbWFqNjk6IFsxLCAzLCA1LCA2LCA5XSxcclxuICAgICAgIG1hajc6IFsxLCAzLCA1LCA3XSxcclxuICAgICAgIG1hajk6IFsxLCAzLCA1LCA3LCA5XSxcclxuICAgICAgIG1hajExOiBbMSwgMywgNSwgNywgOSwgMTFdLFxyXG4gICAgICAgbWFqMTM6IFsxLCAzLCA1LCA3LCA5LCAxMSwgMTNdLFxyXG4gICAgICAgbWFqN3MxMTogWzEsIDMsIDUsIDcsIFsxMSwgc2hhcnBdXSxcclxuICAgICAgIG1hamI1OiBbMSwgMywgWzUsIGZsYXRdXSxcclxuICAgICAgIG1pbjogWzEsIFszLCBmbGF0XSwgNV0sXHJcbiAgICAgICBtaW40OiBbMSwgWzMsIGZsYXRdLCA0LCA1XSxcclxuICAgICAgIG1pbjY6IFsxLCBbMywgZmxhdF0sIDUsIDZdLFxyXG4gICAgICAgbWluNzogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdXSxcclxuICAgICAgIG1pbkFkZDk6IFsxLCBbMywgZmxhdF0sIDUsIDldLFxyXG4gICAgICAgbWluNjk6IFsxLCBbMywgZmxhdF0sIDUsIDYsIDldLFxyXG4gICAgICAgbWluOTogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIG1pbjExOiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDksIDExXSxcclxuICAgICAgIG1pbjEzOiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDksIDExLCAxM10sXHJcbiAgICAgICBtaW43YjU6IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTc6IFsxLCAzLCA1LCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb20xMTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOSwgMTFdLFxyXG4gICAgICAgZG9tMTM6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDksIDExLCAxM10sXHJcbiAgICAgICBkb203czU6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tN2I1OiBbMSwgMywgWzUsIGZsYXRdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tN2I5OiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbOSwgZmxhdF1dLFxyXG4gICAgICAgZG9tN3M5OiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbOSwgc2hhcnBdXSxcclxuICAgICAgIGRvbTlzNTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb205YjU6IFsxLCAzLCBbNSwgZmxhdF0sIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb203czVzOTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgWzksIHNoYXJwXV0sXHJcbiAgICAgICBkb203czViOTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgWzksIGZsYXRdXSxcclxuICAgICAgIGRvbTdzMTE6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFsxMSwgc2hhcnBdXSxcclxuICAgICAgIGRpbTogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdXSxcclxuICAgICAgIGRpbTc6IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XSwgWzcsIGZsYXRfZmxhdF1dLFxyXG4gICAgICAgYXVnOiBbMSwgMywgWzUsIHNoYXJwXV0sXHJcbiAgICAgICBzdXMyOiBbMSwgMiwgNV0sXHJcbiAgICAgICBzdXM0OiBbMSwgWzQsIGZsYXRdLCA1XSxcclxuICAgICAgIGZpZnRoOiBbMSwgNV0sXHJcbiAgICAgICBiNTogWzEsIFs1LCBmbGF0XV0sXHJcbiAgICAgICBzMTE6IFsxLCA1LCBbMTEsIHNoYXJwXV0sXHJcbiAgIH07XHJcbiAgIE9iamVjdC5rZXlzKENob3JkVGVtcGxhdGVzKS5mb3JFYWNoKChlbGVtZW50KSA9PiBPYmplY3QuZnJlZXplKENob3JkVGVtcGxhdGVzW2VsZW1lbnRdKSk7XG5cbiAgIGNvbnN0IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUgPSBbMSwgMywgNV07XHJcbiAgIGNvbnN0IERFRkFVTFRfU0NBTEUgPSBuZXcgU2NhbGUoKTtcblxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVMb29rdXAuanNvblwiO1xyXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIGNvbnN0IG5hbWVSZWdleCA9IC8oW0EtR10pKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXggPSAvKCN8c3xiKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCA9IC8oWzAtOV0rKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBjaG9yZE5hbWVSZWdleCA9IC8obWlufG1hanxkaW18YXVnKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBhZGRpdGlvbnNSZWdleCA9IC8oWyN8c3xiXT9bMC05XSspKD8hW14oXSpcXCkpL2c7XHJcbiAgIC8qKlxyXG4gICAgKiBAcGFyYW0gY2hvcmQgdGhlIHN0cmluZyB0byBwYXJzZVxyXG4gICAgKiBAcmV0dXJucyBhIHZhbGlkIENob3JkSW5pdGlhbGl6ZXJcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZUNob3JkID0gKGNob3JkKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNob3JkTG9va3VwKGNob3JkKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgbGV0IGNob3JkTmFtZSA9IFwibWFqXCI7XHJcbiAgICAgICBsZXQgYWRkaXRpb25zID0gW107XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBjaG9yZC5tYXRjaChuYW1lUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IGNob3JkLm1hdGNoKG1vZGlmaWVyUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBjaG9yZC5tYXRjaChvY3RhdmVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBjaG9yZE5hbWVNYXRjaCA9IGNob3JkLm1hdGNoKGNob3JkTmFtZVJlZ2V4KT8uam9pbihcIlwiKTtcclxuICAgICAgIGNvbnN0IGFkZGl0aW9uc01hdGNoID0gY2hvcmQubWF0Y2goYWRkaXRpb25zUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGNob3JkTmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgLy8gY29uc3QgW25hbWVdID0gY2hvcmROYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgY2hvcmROYW1lID0gY2hvcmROYW1lTWF0Y2g7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoYWRkaXRpb25zTWF0Y2gpIHtcclxuICAgICAgICAgICBhZGRpdGlvbnMgPSBhZGRpdGlvbnNNYXRjaDtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IGludGVydmFscyA9IFtdO1xyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIGludGVydmFscy5wdXNoKC4uLkNob3JkVGVtcGxhdGVzW2Nob3JkTmFtZV0pO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgYWRkaXRpb24gb2YgYWRkaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2QgPSAwO1xyXG4gICAgICAgICAgICAgICBpZiAoYWRkaXRpb25bMF0gPT09IFwiI1wiIHx8IGFkZGl0aW9uWzBdID09PSBcInNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gMTtcclxuICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2UgaWYgKGFkZGl0aW9uWzBdID09PSBcImJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBhZGRpdGlvbk51bSA9IHBhcnNlSW50KGFkZGl0aW9uLCAxMCk7XHJcbiAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbHMuaW5jbHVkZXMoYWRkaXRpb25OdW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGludGVydmFscy5pbmRleE9mKGFkZGl0aW9uTnVtKTtcclxuICAgICAgICAgICAgICAgICAgIGludGVydmFsc1tpbmRleF0gPSBbYWRkaXRpb25OdW0sIG1vZF07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbnRlcnZhbHMucHVzaChbYWRkaXRpb25OdW0sIG1vZF0pO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIHJvb3Q6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IGludGVydmFscyxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjaG9yZCBuYW1lXCIpO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogQHJldHVybnMgYSBsb29rdXAgdGFibGUgb2YgY2hvcmQgbmFtZXMgYW5kIHRoZWlyIGluaXRpYWxpemVyc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBjb25zdCBxdWFsaXRpZXMgPSBbXCJtYWpcIiwgXCJtaW5cIiwgXCJkaW1cIiwgXCJhdWdcIiwgXCJzdXNcIl07XHJcbiAgICAgICBjb25zdCBhZGRpdGlvbnMgPSBbXHJcbiAgICAgICAgICAgXCJcIixcclxuICAgICAgICAgICBcIjJcIixcclxuICAgICAgICAgICBcIjNcIixcclxuICAgICAgICAgICBcIjRcIixcclxuICAgICAgICAgICBcIjVcIixcclxuICAgICAgICAgICBcIjZcIixcclxuICAgICAgICAgICBcIjdcIixcclxuICAgICAgICAgICBcIjlcIixcclxuICAgICAgICAgICBcIjExXCIsXHJcbiAgICAgICAgICAgXCIxM1wiLFxyXG4gICAgICAgICAgIFwiYjJcIixcclxuICAgICAgICAgICBcImIzXCIsXHJcbiAgICAgICAgICAgXCJiNFwiLFxyXG4gICAgICAgICAgIFwiYjVcIixcclxuICAgICAgICAgICBcImI2XCIsXHJcbiAgICAgICAgICAgXCJiN1wiLFxyXG4gICAgICAgICAgIFwiYjlcIixcclxuICAgICAgICAgICBcImIxMVwiLFxyXG4gICAgICAgICAgIFwiYjEzXCIsXHJcbiAgICAgICAgICAgXCJzMlwiLFxyXG4gICAgICAgICAgIFwiczNcIixcclxuICAgICAgICAgICBcInM0XCIsXHJcbiAgICAgICAgICAgXCJzNVwiLFxyXG4gICAgICAgICAgIFwiczZcIixcclxuICAgICAgICAgICBcInM3XCIsXHJcbiAgICAgICAgICAgXCJzOVwiLFxyXG4gICAgICAgICAgIFwiczExXCIsXHJcbiAgICAgICAgICAgXCJzMTNcIixcclxuICAgICAgICAgICBcIiMyXCIsXHJcbiAgICAgICAgICAgXCIjM1wiLFxyXG4gICAgICAgICAgIFwiIzRcIixcclxuICAgICAgICAgICBcIiM1XCIsXHJcbiAgICAgICAgICAgXCIjNlwiLFxyXG4gICAgICAgICAgIFwiIzdcIixcclxuICAgICAgICAgICBcIiM5XCIsXHJcbiAgICAgICAgICAgXCIjMTFcIixcclxuICAgICAgICAgICBcIiMxM1wiLFxyXG4gICAgICAgICAgIFwiN3MxMVwiLFxyXG4gICAgICAgICAgIFwiNyMxMVwiLFxyXG4gICAgICAgICAgIFwiN2I5XCIsXHJcbiAgICAgICAgICAgXCI3IzlcIixcclxuICAgICAgICAgICBcIjdiNVwiLFxyXG4gICAgICAgICAgIFwiNyM1XCIsXHJcbiAgICAgICAgICAgXCI3YjliNVwiLFxyXG4gICAgICAgICAgIFwiNyM5IzVcIixcclxuICAgICAgICAgICBcIjdiMTNcIixcclxuICAgICAgICAgICBcIjcjMTNcIixcclxuICAgICAgICAgICBcIjkjNVwiLFxyXG4gICAgICAgICAgIFwiOWI1XCIsXHJcbiAgICAgICAgICAgXCI5IzExXCIsXHJcbiAgICAgICAgICAgXCI5YjExXCIsXHJcbiAgICAgICAgICAgXCI5IzEzXCIsXHJcbiAgICAgICAgICAgXCI5YjEzXCIsXHJcbiAgICAgICAgICAgXCIxMSM1XCIsXHJcbiAgICAgICAgICAgXCIxMWI1XCIsXHJcbiAgICAgICAgICAgXCIxMSM5XCIsXHJcbiAgICAgICAgICAgXCIxMWI5XCIsXHJcbiAgICAgICAgICAgXCIxMSMxM1wiLFxyXG4gICAgICAgICAgIFwiMTFiMTNcIixcclxuICAgICAgIF07XHJcbiAgICAgICBmb3IgKGNvbnN0IHF1YWxpdHkgb2YgcXVhbGl0aWVzKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBhZGRpdGlvbiBvZiBhZGRpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlTGV0dGVyIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVNb2RpZmllciBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9JHtub3RlTW9kaWZpZXJ9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gT0NUQVZFX01JTjsgaSA8PSBPQ1RBVkVfTUFYOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9JHtub3RlTW9kaWZpZXJ9JHtpfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgbGV0IF9jaG9yZExvb2t1cCA9IHt9O1xyXG4gICAvKipcclxuICAgICogQHBhcmFtIGtleSB0aGUgc3RyaW5nIHRvIGxvb2t1cFxyXG4gICAgKiBAcmV0dXJucyBhIHZhbGlkIGNob3JkIGluaXRpYWxpemVyXHJcbiAgICAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGtleSBpcyBub3QgYSB2YWxpZCBjaG9yZFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNob3JkTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRDaG9yZFRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX2Nob3JkTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IHRhYmxlIGFzIHsgW2tleTogc3RyaW5nXTogQ2hvcmRJbml0aWFsaXplciB9O1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkQ2hvcmRUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfY2hvcmRMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfY2hvcmRMb29rdXA7XHJcbiAgICAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfY2hvcmRMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBjaG9yZCB0YWJsZVwiKTtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5lbnRyaWVzKF9jaG9yZExvb2t1cCkubGVuZ3RoKTtcclxuICAgICAgIHJldHVybiBfY2hvcmRMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBDaG9yZHMgY29uc2lzdCBvZiBhIHJvb3Qgbm90ZSwgb2N0YXZlLCBjaG9yZCB0ZW1wbGF0ZSwgYW5kIGEgYmFzZSBzY2FsZS48YnI+PGJyPlxyXG4gICAgKiBUaGUgY2hvcmQgdGVtcGxhdGUgaXMgYW4gYXJyYXkgb2YgaW50ZWdlcnMsIGVhY2ggaW50ZWdlciByZXByZXNlbnRpbmc8YnI+XHJcbiAgICAqICBhIHNjYWxlIGRlZ3JlZSBmcm9tIHRoZSBiYXNlIHNjYWxlKGRlZmF1bHRzIHRvIG1ham9yKS48YnI+XHJcbiAgICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGlzIHRoZSBJLElJSSxWIGRlbm90ZWQgYXMgWzEsMyw1XTxicj5cclxuICAgICogQ2hvcmRJbnRlcnZhbHMgdXNlZCBpbiB0ZW1wbGF0ZXMgY2FuIGFsc28gY29udGFpbiBhIG1vZGlmaWVyLDxicj5cclxuICAgICogZm9yIGEgcGFydGljdWxhciBzY2FsZSBkZWdyZWUsIHN1Y2ggYXMgWzEsMyxbNSwgLTFdXTxicj5cclxuICAgICogd2hlcmUgLTEgaXMgZmxhdCwgMCBpcyBuYXR1cmFsLCBhbmQgMSBpcyBzaGFycC48YnI+XHJcbiAgICAqIEl0IGNvdWxkIGFsc28gYmUgd3JpdHRlbiBhcyBbMSwzLFs1LCBtb2RpZmllci5mbGF0XV08YnI+XHJcbiAgICAqIGlmIHlvdSBpbXBvcnQgbW9kaWZpZXIuXHJcbiAgICAqXHJcbiAgICAqIFRoZSBmb2xsb3dpbmcgcHJlZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTo8YnI+XHJcbiAgICAqIDx0YWJsZT5cclxuICAgICogPHRyPlxyXG4gICAgKiA8dGQ+bWFqPC90ZD5cclxuICAgICogPHRkPm1hajQ8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNjwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo2OTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqNzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo5PC90ZD5cclxuICAgICogPHRkPm1hajExPC90ZD5cclxuICAgICogPHRkPm1hajEzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWo3czExPC90ZD5cclxuICAgICogPHRkPm1hamI1PC90ZD5cclxuICAgICogPHRkPm1pbjwvdGQ+XHJcbiAgICAqIDx0ZD5taW40PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW42PC90ZD5cclxuICAgICogPHRkPm1pbjc8L3RkPlxyXG4gICAgKiA8dGQ+bWluQWRkOTwvdGQ+XHJcbiAgICAqIDx0ZD5taW42OTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWluOTwvdGQ+XHJcbiAgICAqIDx0ZD5taW4xMTwvdGQ+XHJcbiAgICAqIDx0ZD5taW4xMzwvdGQ+XHJcbiAgICAqIDx0ZD5taW43YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTc8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOTwvdGQ+XHJcbiAgICAqIDx0ZD5kb20xMTwvdGQ+XHJcbiAgICAqIDx0ZD5kb20xMzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tN3M1PC90ZD5cclxuICAgICogPHRkPmRvbTdiNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czk8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN2I5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb205YjU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOXM1PC90ZD5cclxuICAgICogPHRkPmRvbTdzMTE8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3M1czk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTdzNWI5PC90ZD5cclxuICAgICogPHRkPmRpbTwvdGQ+XHJcbiAgICAqIDx0ZD5kaW03PC90ZD5cclxuICAgICogPHRkPmF1ZzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+c3VzMjwvdGQ+XHJcbiAgICAqIDx0ZD5zdXM0PC90ZD5cclxuICAgICogPHRkPmZpZnRoPC90ZD5cclxuICAgICogPHRkPmI1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zMTE8L3RkPlxyXG4gICAgKiA8L3RyPlxyXG4gICAgKiA8L3RhYmxlPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IENob3JkIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZFRlbXBsYXRlfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkSW50ZXJ2YWx9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7TW9kaWZpZXJ9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRJbml0aWFsaXplcn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjsvLyBUeXBlc2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgQ2hvcmQge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHsgQ2hvcmQsIENob3JkVGVtcGxhdGVzLCBNb2RpZmllciB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy9jcmVhdGVzIGEgY2hvcmQgd2l0aCB0aGUgZGVmYXVsdCgxLDMsNSkgdGVtcGxhdGUsIHJvb3Qgb2YgQywgaW4gdGhlIDR0aCBvY3RhdmVcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIGNob3JkIHdpdGggdGhlIHByZS1kZWZpbmVkIGRpbWluaXNoZWQgdGVtcGxhdGUsIHJvb3Qgb2YgRWIsIGluIHRoZSA1dGggb2N0YXZlXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCh7cm9vdDogMywgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogQ2hvcmRUZW1wbGF0ZXMuZGltfSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiAocm9vdC1ub3RlLW5hbWVbcywjLGJdW29jdGF2ZV0pW2Nob3JkLXRlbXBsYXRlLW5hbWV8W2Nob3JkLXF1YWxpdHldW21vZGlmaWVyc11dXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgY2hvcmQgZnJvbSBhIHN0cmluZ1xyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoJyhENCltaW40Jyk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uREVGQVVMVF9DSE9SRF9URU1QTEFURV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VDaG9yZCh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi4ocGFyc2VkPy50ZW1wbGF0ZSA/PyBERUZBVUxUX0NIT1JEX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gcGFyc2VkPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHBhcnNlZD8ucm9vdCA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uKHZhbHVlcy50ZW1wbGF0ZSA/PyBERUZBVUxUX0NIT1JEX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gdmFsdWVzLnJvb3QgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiB0aGlzLl9yb290LCBvY3RhdmU6IHRoaXMuX29jdGF2ZSB9KTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlkKTsgLy8gaGFsODkzNGhsbFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJvb3RcclxuICAgICAgICAqL1xyXG4gICAgICAgX3Jvb3QgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnJvb3QpOyAvLyAwKHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCByb290KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIHRoZSByb290IHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIDExXShzZW1pdG9uZSkgd2lsbDxici8+XHJcbiAgICAgICAgKiB3cmFwIHRoZSBzZW1pdG9uZSB0byB0aGUgcmFuZ2UgWzAsIDExXSBhbmQgY2hhbmdlIHRoZSBvY3RhdmUgZGVwZW5kaW5nPGJyLz5cclxuICAgICAgICAqIG9uIGhvdyBtYW55IHRpbWVzIHRoZSBzZW1pdG9uZSBoYXMgYmVlbiB3cmFwcGVkLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5yb290ID0gNDsgLy8gc2V0cyB0aGUgcm9vdCB0byA0dGggc2VtaXRvbmUoRSlcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnJvb3QpOyAvLyA0KHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCByb290KHZhbHVlKSB7XHJcbiAgICAgICAgICAgLy8gdGhpcy5fcm9vdCA9IHZhbHVlO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHZhbHVlLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fcm9vdCA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gdGhpcy5fb2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogYmFzZSBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfYmFzZVNjYWxlID0gREVGQVVMVF9TQ0FMRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5iYXNlU2NhbGUpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgc2NhbGUobWFqb3IpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IGJhc2VTY2FsZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFzZVNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBOb3QgYSBsb3Qgb2YgZ29vZCByZWFzb25zIHRvIGNoYW5nZSB0aGlzIGV4Y2VwdCBmb3IgZXhwZXJpbWVudGF0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmJhc2VTY2FsZSA9IG5ldyBTY2FsZSh7IGtleTogMywgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogWzEsIFszLCBNb2RpZmllci5mbGF0XSwgNV0gfSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5iYXNlU2NhbGUpOyAvLyBwcmludHMgdGhlIG1pbm9yIHNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGJhc2VTY2FsZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZS5vY3RhdmUgPSB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5vY3RhdmUpOyAvLyA0KG9jdGF2ZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQub2N0YXZlID0gNTsgLy8gc2V0cyB0aGUgb2N0YXZlIHRvIDV0aFxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQub2N0YXZlKTsgLy8gNShvY3RhdmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKHZhbHVlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUub2N0YXZlID0gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB0ZW1wbGF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCB0ZW1wbGF0ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gWy4uLnRoaXMuX3RlbXBsYXRlXTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIGZvbGxvd2luZyBwcmVkZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOjxicj5cclxuICAgICAgICAqIDx0YWJsZT5cclxuICAgICAgICAqIDx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajQ8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajY8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajY5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1hajc8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajk8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajExPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWoxMzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo3czExPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpiNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW40PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbjY8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjc8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbkFkZDk8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjY5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbjk8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjExPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW4xMzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluN2I1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTc8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTk8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTExPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb20xMzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203czU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdiNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M5PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203Yjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOWI1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb205czU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzMTE8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzNXM5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTdzNWI5PC90ZD5cclxuICAgICAgICAqIDx0ZD5kaW08L3RkPlxyXG4gICAgICAgICogPHRkPmRpbTc8L3RkPlxyXG4gICAgICAgICogPHRkPmF1ZzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zdXMyPC90ZD5cclxuICAgICAgICAqIDx0ZD5zdXM0PC90ZD5cclxuICAgICAgICAqIDx0ZD5maWZ0aDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+czExPC90ZD5cclxuICAgICAgICAqIDwvdHI+XHJcbiAgICAgICAgKiA8L3RhYmxlPlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC50ZW1wbGF0ZSA9IFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIDVdOyAvLyBzZXRzIHRoZSB0ZW1wbGF0ZSB0byBhIG1pbm9yIGNob3JkXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIHByaW50cyB0aGUgbmV3IHRlbXBsYXRlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4udmFsdWVdO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBub3Rlc1xyXG4gICAgICAgICogbm90ZXMgYXJlIGdlbmVyYXRlZCBhbmQgY2FjaGVkIGFzIG5lZWRlZFxyXG4gICAgICAgICovXHJcbiAgICAgICBfbm90ZXMgPSBbXTtcclxuICAgICAgIF9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogd2lsbCBnZW5lcmF0ZSBub3RlcyBpZiBuZWVkZWQgb3IgcmV0dXJuIHRoZSBjYWNoZWQgbm90ZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQubm90ZXMpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgbm90ZXNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgbm90ZXMoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX25vdGVzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBnZW5lcmF0ZSBub3RlcyhpbnRlcm5hbClcclxuICAgICAgICAqIGdlbmVyYXRlcyB0aGUgbm90ZXMgZm9yIHRoaXMgc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2VuZXJhdGVOb3RlcygpIHtcclxuICAgICAgICAgICB0aGlzLl9ub3RlcyA9IFtdO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgbGV0IHRvbmUgPSAwO1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kID0gMDtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICB0b25lID0gaW50ZXJ2YWxbMF07XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSBpbnRlcnZhbFsxXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIHRvbmUgPSBpbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB0b25lO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlID0gdGhpcy5fYmFzZVNjYWxlLmRlZ3JlZShvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlVG9uZSA9IG5vdGUuc2VtaXRvbmU7XHJcbiAgICAgICAgICAgICAgIG5vdGUuc2VtaXRvbmUgPSBub3RlVG9uZSArIG1vZDtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbm90ZSBuYW1lcyAtPiBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXROb3RlTmFtZXMoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZU5hbWVzID0gW107XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHRoaXMubm90ZXMpIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIG5vdGVOYW1lcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZCh7XHJcbiAgICAgICAgICAgICAgIHJvb3Q6IHRoaXMucm9vdCxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFsuLi50aGlzLl90ZW1wbGF0ZV0sXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSBvdGhlciB0aGUgb3RoZXIgY2hvcmQgdG8gY29tcGFyZSB0b1xyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIGNob3JkcyBhcmUgZXF1YWxcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gKHRoaXMucm9vdCA9PT0gb3RoZXIucm9vdCAmJlxyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9PT0gb3RoZXIub2N0YXZlICYmXHJcbiAgICAgICAgICAgICAgIGlzRXF1YWwodGhpcy5fdGVtcGxhdGUsIG90aGVyLnRlbXBsYXRlKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIG5hdHJ1YWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjaG9yZC5tYWpvcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWFqb3IoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goMyk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSAzO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgbmF0dXJhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5tYWpvcmVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1ham9yZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLm1ham9yKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIG5hdHVyYWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWFqb3IoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc01ham9yKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgbXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsWzMsLTFdLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWlub3IoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzMsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbMywgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLm1pbm9yZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSxbMywtMV0sNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaW5vcmVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5taW5vcigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01pbm9yKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWlub3IoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc01pbm9yKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5hdWdtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuc2hhcnBdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGF1Z21lbnQoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzUsIDFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs1LCAxXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuYXVnbWVudGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5zaGFycF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYXVnbWVudGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5hdWdtZW50KCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0F1Z21lbnRlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmF1Z21lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzQXVnbWVudGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNBdWdtZW50ZWQoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5kaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRpbWluaXNoKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs1LCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzUsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5kaW1pbmlzaGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5kaW1pbmlzaCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0RpbWluaXNoZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5kaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNEaW1pbmlzaGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCBbNSwgTW9kaWZpZXIuZmxhdF0sIFs3LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqXHJcbiAgICAgICAgKi9cclxuICAgICAgIGhhbGZEaW1pbmlzaCgpIHtcclxuICAgICAgICAgICB0aGlzLm1pbm9yKCk7IC8vIGdldCBmbGF0IDNyZFxyXG4gICAgICAgICAgIHRoaXMuZGltaW5pc2goKTsgLy8gZ2V0IGZsYXQgNXRoXHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDcpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzcsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNywgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmhhbGZEaW1pbmlzaGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XSwgWzcsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICovXHJcbiAgICAgICBoYWxmRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzSGFsZkRpbWluaXNoZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5oYWxmRGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzSGFsZkRpbWluaXNoZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNIYWxmRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICBsZXQgdGhpcmQgPSBmYWxzZTtcclxuICAgICAgICAgICBsZXQgZmlmdGggPSBmYWxzZTtcclxuICAgICAgICAgICBsZXQgc2V2ZW50aCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA3ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBzZXZlbnRoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZmlmdGggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXJkICYmIGZpZnRoICYmIHNldmVudGg7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCB3aXRoIHRoZSBmaXJzdCBub3RlIG1vdmVkIHRvIHRoZSBlbmQgdXAgb25lIG9jdGF2ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBjaG9yZC5pbnZlcnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzMsNSwxXVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0U0JywgJ0c0JywgJ0M1J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpbnZlcnQoKSB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5fdGVtcGxhdGVbMF0pO1xyXG4gICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuX3RlbXBsYXRlWzBdKSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVswXVswXSArPSB0aGlzLl9iYXNlU2NhbGUudGVtcGxhdGUubGVuZ3RoO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbMF0gKz0gdGhpcy5fYmFzZVNjYWxlLnRlbXBsYXRlLmxlbmd0aDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBuZXdUZW1wbGF0ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIHdpdGggdGhlIGZpcnN0IG5vdGUgbW92ZWQgdG8gdGhlIGVuZCB1cCBvbmUgb2N0YXZlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5pbnZlcnRlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFszLDUsMV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0U0JywgJ0c0JywgJ0M1J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpbnZlcnRlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuaW52ZXJ0KCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBzdHJpbmcgZm9ybSBvZiB0aGUgY2hvcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudG9TdHJpbmcoKSk7IC8vICcoQzQpbWFqJ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhDaG9yZFRlbXBsYXRlcyk7XHJcbiAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhDaG9yZFRlbXBsYXRlcykubWFwKCh0ZW1wbGF0ZSkgPT4gSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcclxuICAgICAgICAgICBjb25zdCBpbmRleCA9IHZhbHVlcy5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRoaXMuX3RlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgY29uc3QgcHJlZml4ID0gYCgke1NlbWl0b25lJDFbdGhpcy5fcm9vdF19JHt0aGlzLl9vY3RhdmV9KWA7XHJcbiAgICAgICAgICAgY29uc3Qgc3RyID0gaW5kZXggPiAtMSA/IHByZWZpeCArIGtleXNbaW5kZXhdIDogdGhpcy5nZXROb3RlTmFtZXMoKS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBCdWlsZHMgbG9va3VwIHRhYmxlcyBmb3IgbW9yZSBwZXJmb3JtYW50IHN0cmluZyBwYXJzaW5nLjxici8+XHJcbiAgICAqIFNob3VsZCBvbmx5KG9wdGlvbmFsbHkpIGJlIGNhbGxlZCBvbmNlIHNvb24gYWZ0ZXIgdGhlIGxpYnJhcnkgaXMgbG9hZGVkIGFuZDxici8+XHJcbiAgICAqIG9ubHkgaWYgeW91IGFyZSB1c2luZyBzdHJpbmcgaW5pdGlhbGl6ZXJzLlxyXG4gICAgKi9cclxuICAgY29uc3QgYnVpbGRUYWJsZXMgPSAoKSA9PiB7XHJcbiAgICAgICBidWlsZE5vdGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZU5vdGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZU5hbWVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRDaG9yZFRhYmxlKCk7XHJcbiAgIH07XG5cbiAgIGV4cG9ydHMuQ2hvcmQgPSBDaG9yZDtcbiAgIGV4cG9ydHMuQ2hvcmRUZW1wbGF0ZXMgPSBDaG9yZFRlbXBsYXRlcztcbiAgIGV4cG9ydHMuSW5zdHJ1bWVudCA9IEluc3RydW1lbnQ7XG4gICBleHBvcnRzLk1vZGlmaWVyID0gTW9kaWZpZXIkMTtcbiAgIGV4cG9ydHMuTm90ZSA9IE5vdGU7XG4gICBleHBvcnRzLlNjYWxlID0gU2NhbGU7XG4gICBleHBvcnRzLlNjYWxlVGVtcGxhdGVzID0gU2NhbGVUZW1wbGF0ZXM7XG4gICBleHBvcnRzLlNlbWl0b25lID0gU2VtaXRvbmUkMTtcbiAgIGV4cG9ydHMuYnVpbGRUYWJsZXMgPSBidWlsZFRhYmxlcztcblxuICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpO1xuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNjYWxlVGVtcGxhdGVzIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIlxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgRGl2aXNpb25lZFJpY2hub3RlcyB9IGZyb20gXCIuL3V0aWxzXCJcblxuXG50eXBlIExpZ2h0U2NhbGUgPSB7XG4gICAga2V5OiBudW1iZXIsXG4gICAgdGVtcGxhdGVTbHVnOiBzdHJpbmcsXG4gICAgc2VtaXRvbmVzOiBudW1iZXJbXSxcbn07XG5cblxuY29uc3Qgc2NhbGVzRm9yTm90ZXMgPSAobm90ZXM6IE5vdGVbXSwgcGFyYW1zOiBNdXNpY1BhcmFtcyk6IFNjYWxlW10gPT4ge1xuICAgIGNvbnN0IHNjYWxlcyA9IG5ldyBTZXQ8TGlnaHRTY2FsZT4oKVxuICAgIC8vIEZpcnN0IGFkZCBhbGwgc2NhbGVzXG4gICAgZm9yIChjb25zdCBzY2FsZVNsdWcgaW4gcGFyYW1zLnNjYWxlU2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBwYXJhbXMuc2NhbGVTZXR0aW5nc1tzY2FsZVNsdWddO1xuICAgICAgICBpZiAodGVtcGxhdGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgc2VtaXRvbmU9MDsgc2VtaXRvbmUgPCAxMjsgc2VtaXRvbmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtrZXk6IHNlbWl0b25lLCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXNbc2NhbGVTbHVnXX0pXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVzID0gc2NhbGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgbGVhZGluZ1RvbmUgPSAoc2NhbGUua2V5IC0gMSArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgIC8vIGlmICghc2VtaXRvbmVzLmluY2x1ZGVzKGxlYWRpbmdUb25lKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICBzZW1pdG9uZXMucHVzaChsZWFkaW5nVG9uZSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHNjYWxlcy5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNsdWc6IHNjYWxlU2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmVzOiBzZW1pdG9uZXMsXG4gICAgICAgICAgICAgICAgfSBhcyBMaWdodFNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBub3RlLnNlbWl0b25lXG4gICAgICAgIGZvciAoY29uc3Qgc2NhbGUgb2Ygc2NhbGVzKSB7XG4gICAgICAgICAgICBpZiAoIXNjYWxlLnNlbWl0b25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICBzY2FsZXMuZGVsZXRlKHNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChjb25zdCBzY2FsZSBvZiBzY2FsZXMpIHtcbiAgICAgICAgcmV0LnB1c2gobmV3IFNjYWxlKHtrZXk6IHNjYWxlLmtleSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzW3NjYWxlLnRlbXBsYXRlU2x1Z119KSlcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0QXZhaWxhYmxlU2NhbGVzID0gKHZhbHVlczoge1xuICAgIGxhdGVzdERpdmlzaW9uOiBudW1iZXIsXG4gICAgZGl2aXNpb25lZFJpY2hOb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyxcbiAgICBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgIHJhbmRvbU5vdGVzOiBBcnJheTxOb3RlPixcbiAgICBsb2dnZXI6IExvZ2dlcixcbn0pOiBBcnJheTx7XG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIHRlbnNpb246IG51bWJlcixcbn0+ID0+IHtcbiAgICBjb25zdCB7bGF0ZXN0RGl2aXNpb24sIGRpdmlzaW9uZWRSaWNoTm90ZXMsIHBhcmFtcywgcmFuZG9tTm90ZXMsIGxvZ2dlcn0gPSB2YWx1ZXM7XG4gICAgLy8gR2l2ZW4gYSBuZXcgY2hvcmQsIGZpbmQgYXZhaWxhYmxlIHNjYWxlcyBiYXNlIG9uIHRoZSBwcmV2aW91cyBub3Rlc1xuICAgIGNvbnN0IGN1cnJlbnRBdmFpbGFibGVTY2FsZXMgPSBzY2FsZXNGb3JOb3RlcyhyYW5kb21Ob3RlcywgcGFyYW1zKVxuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChjb25zdCBzY2FsZSBvZiBjdXJyZW50QXZhaWxhYmxlU2NhbGVzKSB7XG4gICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgdGVuc2lvbjogMCxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsb2dnZXIubG9nKFwiY3VycmVudEF2YWlsYWJsZVNjYWxlc1wiLCBjdXJyZW50QXZhaWxhYmxlU2NhbGVzKVxuXG4gICAgcmV0dXJuIHJldC5maWx0ZXIoaXRlbSA9PiBpdGVtLnRlbnNpb24gPCAxMCk7XG59IiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNjYWxlVGVtcGxhdGVzIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IFNvdXJjZU1lYXN1cmUgfSBmcm9tIFwib3BlbnNoZWV0bXVzaWNkaXNwbGF5XCI7XG5pbXBvcnQgeyBUZW5zaW9uLCBUZW5zaW9uUGFyYW1zIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmNvbnN0IGJ1aWxkVHJpYWRPbiA9IChzZW1pdG9uZTogbnVtYmVyLCBzY2FsZTogU2NhbGUpOiBDaG9yZCB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzY2FsZS5ub3Rlcy5maW5kSW5kZXgobm90ZSA9PiBub3RlLnNlbWl0b25lID09PSBzZW1pdG9uZSk7XG4gICAgaWYgKCFzY2FsZUluZGV4IHx8IHNjYWxlSW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBub3RlMFNlbWl0b25lID0gc2NhbGUubm90ZXNbKHNjYWxlSW5kZXggKyAwKSAlIDddLnNlbWl0b25lO1xuICAgIGNvbnN0IG5vdGUxU2VtaXRvbmUgPSBzY2FsZS5ub3Rlc1soc2NhbGVJbmRleCArIDIpICUgN10uc2VtaXRvbmU7XG4gICAgY29uc3Qgbm90ZTJTZW1pdG9uZSA9IHNjYWxlLm5vdGVzWyhzY2FsZUluZGV4ICsgNCkgJSA3XS5zZW1pdG9uZTtcblxuICAgIGxldCBjaG9yZFR5cGUgPSAnJztcbiAgICBpZiAoc2VtaXRvbmVEaXN0YW5jZShub3RlMFNlbWl0b25lLCBub3RlMVNlbWl0b25lKSA9PT0gNCkge1xuICAgICAgICBjaG9yZFR5cGUgPSAnbWFqJztcbiAgICB9IGVsc2UgaWYgKHNlbWl0b25lRGlzdGFuY2Uobm90ZTBTZW1pdG9uZSwgbm90ZTFTZW1pdG9uZSkgPT09IDMpIHtcbiAgICAgICAgY2hvcmRUeXBlID0gJ21pbic7XG4gICAgICAgIGlmIChzZW1pdG9uZURpc3RhbmNlKG5vdGUxU2VtaXRvbmUsIG5vdGUyU2VtaXRvbmUpID09PSAzKSB7XG4gICAgICAgICAgICBjaG9yZFR5cGUgPSAnZGltJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNob3JkVHlwZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQobm90ZTBTZW1pdG9uZSwgY2hvcmRUeXBlKTtcbiAgICByZXR1cm4gY2hvcmQ7XG59XG5cblxuZXhwb3J0IGNvbnN0IGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uID0gKHRlbnNpb246IFRlbnNpb24sIHZhbHVlczogVGVuc2lvblBhcmFtcyk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXMsXG4gICAgICAgICAgICBmcm9tTm90ZXNPdmVycmlkZSxcbiAgICAgICAgICAgIHRvTm90ZXMsXG4gICAgICAgICAgICBuZXdDaG9yZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgIG9yaWdpbmFsU2NhbGUsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyxcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICBiZWF0RGl2aXNpb24sXG4gICAgICAgIH0gPSB2YWx1ZXM7XG4gICAgLypcbiAgICBcbiAgICBCYXNpYyBjaXJjbGUgb2YgNXRocyBwcm9ncmVzc2lvbjpcblxuICAgIGlpaSAgICAgIFxuICAgIHZpICAgICAgICAgKERlY2VwdGl2ZSB0b25pYylcbiAgICBpaSA8LSBJViAgIChTdWJkb21pbmFudCBmdW5jdGlvbilcbiAgICBWICAtPiB2aWkgIChEb21pbmFudCBmdW5jdGlvbilcbiAgICBJICAgICAgICAgIChUb25pYyBmdW5jdGlvbilcblxuICAgIEFkZGl0aW9uYWxseTpcbiAgICBWIC0+IHZpIGlzIHRoZSBkZWNlcHRpdmUgY2FkZW5jZVxuICAgIElWIC0+IEkgaXMgdGhlIHBsYWdhbCBjYWRlbmNlXG4gICAgaWlpIC0+IElWIGlzIGFsbG93ZWQuXG5cbiAgICBPbmNlIHdlIGhhdmUgc3ViZG9taW5hbnQgb3IgZG9taW5hbnQgY2hvcmRzLCB0aGVyZSdzIG5vIGdvaW5nIGJhY2sgdG8gaWlpIG9yIHZpLlxuXG4gICAgSSB3YW50IHRvIGNoZWNrIHBhY2hlbGJlbCBjYW5vbiBwcm9ncmVzc2lvbjpcbiAgICAgIE9LICAgZGVjZXB0aXZlPyAgIG1heWJlIHNpbmNlIG5vIGZ1bmN0aW9uICAgICBPSyAgICBPSyBpZiBpdHMgaTY0ICAgT2sgYmVjYXVzZSBpdHMgdG9uaWMuIE9LICAgT0tcbiAgICBJIC0+IFYgICAgLT4gICAgIHZpICAgICAgICAgLT4gICAgICAgICAgICAgIGlpaSAtPiBJViAgICAgLT4gICAgICAgIEkgICAgICAgICAtPiAgICAgICAgSVYgIC0+IFYgLT4gSVxuXG4gICAgKi9cbiAgICBjb25zdCBwcm9ncmVzc2lvbkNob2ljZXM6IHsgW2tleTogc3RyaW5nXTogKG51bWJlciB8IHN0cmluZylbXSB8IG51bGwgfSA9IHtcbiAgICAgICAgMDogbnVsbCwgICAgICAgICAgICAgICAgICAgICAvLyBJIGNhbiBnbyBhbnl3aGVyZVxuICAgICAgICAxOiBbJ2RvbWluYW50JywgXSwgICAgICAgICAgIC8vIGlpIGNhbiBnbyB0byBWIG9yIHZpaSBvciBkb21pbmFudFxuICAgICAgICAyOiBbNSwgM10sICAgICAgICAgICAgICAgICAgIC8vIGlpaSBjYW4gZ28gdG8gdmkgb3IgSVZcbiAgICAgICAgMzogWzEsIDIsICdkb21pbmFudCddLCAgICAgICAvLyBJViBjYW4gZ28gdG8gSSwgaWkgb3IgZG9taW5hbnRcbiAgICAgICAgNDogWyd0b25pYycsIDYsICdkb21pbmFudCddLCAvLywgNV0sIC8vIFYgY2FuIGdvIHRvIEksIHZpaSBvciBkb21pbmFudCBvciB2aSAgREVDRVBUSVZFIElTIERJU0FCTEVEIEZPUiBOT1dcbiAgICAgICAgNTogWydzdWItZG9taW5hbnQnLCAyXSwgICAgICAvLyB2aSBjYW4gZ28gdG8gaWksIElWLCAob3IgaWlpKVxuICAgICAgICA2OiBbJ3RvbmljJ10sICAgICAgICAgICAgICAgIC8vIHZpaSBjYW4gZ28gdG8gSVxuICAgIH1cbiAgICBsZXQgd2FudGVkRnVuY3Rpb246IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCB0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCA9IGZhbHNlO1xuICAgIGxldCBwYXJ0ME11c3RCZVRvbmljID0gZmFsc2U7XG5cbiAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSAmJiBpbnZlcnNpb25OYW1lKSB7XG4gICAgICAgIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiUEFDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDUpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICAgICAgdHJ5VG9HZXRMZWFkaW5nVG9uZUluUGFydDAgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgICAgICAgICAgcGFydDBNdXN0QmVUb25pYyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSAzICYmICFpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBcImNhZGVuY2UgUEFDOiBOT1Qgcm9vdCBpbnZlcnNpb24hIFwiO1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIklBQ1wiKSB7XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSA1KSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gMykge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSAzICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90IHJvb3QgaW52ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IFwiY2FkZW5jZSBJQUM6IHJvb3QgaW52ZXJzaW9uISBcIjtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJIQ1wiKSB7XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAyKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJldkNob3JkO1xuICAgIGxldCBwcmV2U2NhbGU6IFNjYWxlIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGxldCBwcmV2UHJldkNob3JkO1xuICAgIGxldCBwYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBwcmV2UGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgbGF0ZXN0Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGlmIChkaXZpc2lvbmVkTm90ZXMpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RGl2aXNpb24gPSBiZWF0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDtcbiAgICAgICAgbGV0IHRtcCA6IEFycmF5PE5vdGU+ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbl0gfHwgW10pKSB7XG4gICAgICAgICAgICAvLyBVc2Ugb3JpZ2luYWwgbm90ZXMsIG5vdCB0aGUgb25lcyB0aGF0IGhhdmUgYmVlbiB0dXJuZWQgaW50byBOQUNzXG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgICAgICBwcmV2U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgfVxuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZm9yIChsZXQgaT1iZWF0RGl2aXNpb247IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXMuZXZlcnkoQm9vbGVhbikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcHJldkNob3JkKSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbU5vdGVzT3ZlcnJpZGUpIHtcbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gZnJvbU5vdGVzT3ZlcnJpZGU7XG4gICAgfVxuXG4gICAgbGV0IGZyb21Ob3RlcztcbiAgICBpZiAocGFzc2VkRnJvbU5vdGVzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgZnJvbU5vdGVzID0gdG9Ob3RlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tTm90ZXMgPSBwYXNzZWRGcm9tTm90ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UG9zc2libGVGdW5jdGlvbnMgPSAoY2hvcmQ6IENob3JkLCBzY2FsZTogU2NhbGUpID0+IHtcblxuICAgICAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLCAgLy8gQ1xuICAgICAgICAgICAgW3NjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLCAgLy8gRlxuICAgICAgICAgICAgW3NjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LCAgLy8gSFxuICAgICAgICAgICAgLy8gWyhjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgLSAxICsgMjQpICUgMTJdOiA2ICAvLyBGb3JjZSBhZGQgbGVhZGluZyB0b25lXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm9vdFNlbWl0b25lID0gY2hvcmQubm90ZXNbMF0uc2VtaXRvbmU7XG4gICAgICAgIGNvbnN0IHJvb3RTY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4W3Jvb3RTZW1pdG9uZV07XG5cbiAgICAgICAgY29uc3QgcG9zc2libGVUb0Z1bmN0aW9uczoge1trZXk6IHN0cmluZ106IG51bWJlcn0gPSB7XG4gICAgICAgICAgICAndG9uaWMnOiAwLFxuICAgICAgICAgICAgJ3N1Yi1kb21pbmFudCc6IDAsXG4gICAgICAgICAgICAnZG9taW5hbnQnOiAwLFxuICAgICAgICB9XG4gICAgICAgIGlmIChyb290U2NhbGVJbmRleCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSAxMDA7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zWydzdWItZG9taW5hbnQnXSA9IDEwMDtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFbMSwgM10uaW5jbHVkZXMocm9vdFNjYWxlSW5kZXgpKSB7IC8vIGlpLCBJVlxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVswLCA0LCA2XS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHsgLy8gViwgdmlpLCBJNjRcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPSAxMDA7XG4gICAgICAgIH0gZWxzZSBpZiAocm9vdFNjYWxlSW5kZXggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgSSBpcyBub3Qgc2Vjb25kIGludmVyc2lvbiwgaXQncyBub3QgZG9taW5hbnRcbiAgICAgICAgICAgIGlmICghaW52ZXJzaW9uTmFtZSB8fCAhaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gNjsgIC8vIFRyeSB0byBhdm9pZCBJNjRcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVswXS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHsgLy8gSVxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYW4ndCBoYXZlIHRvbmljIHdpdGggbm9uLXNjYWxlIG5vdGVzXG4gICAgICAgIGlmIChjaG9yZC5ub3Rlcy5zb21lKG5vdGUgPT4gc2VtaXRvbmVTY2FsZUluZGV4W25vdGUuc2VtaXRvbmVdID09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FudCBoYXZlIHRvbmljIGluIHNlY29uZCBpbnZlcnNpb24uXG4gICAgICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSAxMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm9vdFNjYWxlSW5kZXgsXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zOiBwb3NzaWJsZVRvRnVuY3Rpb25zLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG5cbiAgICAvLyBJZiB0aGUgbm90ZXMgYXJlIG5vdCBpbiB0aGUgY3VycmVudCBzY2FsZSwgaW5jcmVhc2UgdGhlIHRlbnNpb25cbiAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChjdXJyZW50U2NhbGUua2V5IC0gMSArIDI0KSAlIDEyXG5cbiAgICBpZiAodHJ5VG9HZXRMZWFkaW5nVG9uZUluUGFydDAgJiYgdG9HbG9iYWxTZW1pdG9uZXNbMF0gJSAxMiAhPSBsZWFkaW5nVG9uZSkge1xuICAgICAgICAvLyBpbiBQQUMsIHdlIHdhbnQgdGhlIGxlYWRpbmcgdG9uZSBpbiBwYXJ0IDAgaW4gdGhlIGRvbWluYW50XG4gICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSA1O1xuICAgIH1cblxuICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgIC8vIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgIH1cbiAgICBjb25zdCB0b1NjYWxlSW5kZXhlcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gc2VtaXRvbmVTY2FsZUluZGV4W25vdGUuc2VtaXRvbmVdKTtcblxuICAgIGlmIChwYXJ0ME11c3RCZVRvbmljICYmIHRvU2NhbGVJbmRleGVzWzBdICE9IDApIHtcbiAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IFwicGFydCAwIG11c3QgYmUgdG9uaWMhIFwiO1xuICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTA7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0Q2hvcmRzVGVuc2lvbiA9IChuZXdDaG9yZDogQ2hvcmQgfCB1bmRlZmluZWQsIHByZXZDaG9yZDogQ2hvcmQgfCB1bmRlZmluZWQsIHByZXZQcmV2Q2hvcmQ6IENob3JkIHwgdW5kZWZpbmVkLCBjdXJyZW50U2NhbGU6IFNjYWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IHRlbnNpb24gPSB7XG4gICAgICAgICAgICBjYWRlbmNlOiAwLFxuICAgICAgICAgICAgY29tbWVudDogXCJcIixcbiAgICAgICAgICAgIGNob3JkUHJvZ3Jlc3Npb246IDAsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLCAgLy8gRVxuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LCAgLy8gQVxuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgICAgICAvLyBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdDaG9yZCAmJiBwcmV2Q2hvcmQgJiYgcHJldlByZXZDaG9yZCkge1xuICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIC8vIFNhbWUgcm9vdFxuICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgIGlmIChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2UHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhbWUgcm9vdCBhcyBwcmV2aW91cyBjaG9yZFxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2UHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgLy8gU2FtZSByb290IGFzIHByZXZpb3VzIGNob3JkIChEb24ndCBnbyBiYWNrKVxuICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSA1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0Nob3JkKSB7XG4gICAgICAgICAgICBjb25zdCByb290U2VtaXRvbmUgPSBuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgICAgIGNvbnN0IHJvb3RTY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4W3Jvb3RTZW1pdG9uZV07XG4gICAgICAgICAgICBpZiAobmV3Q2hvcmQuY2hvcmRUeXBlLmluY2x1ZGVzKCdkb203JykpIHtcbiAgICAgICAgICAgICAgICAvLyBPbmx5IGFsbG93IGluZGV4IGlpIGFuZCBWIGZvciBub3cuXG4gICAgICAgICAgICAgICAgaWYgKCFbMSwgNF0uaW5jbHVkZXMocm9vdFNjYWxlSW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXdhbnRlZEZ1bmN0aW9uIHx8IHdhbnRlZEZ1bmN0aW9uICE9ICdkb21pbmFudCcpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3Q2hvcmQuY2hvcmRUeXBlLmluY2x1ZGVzKCdkb203JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV3Q2hvcmQuY2hvcmRUeXBlLmluY2x1ZGVzKCdkaW03JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdDaG9yZCAmJiBwcmV2Q2hvcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21GdW5jdGlvbnMgPSBnZXRQb3NzaWJsZUZ1bmN0aW9ucyhwcmV2Q2hvcmQsIGN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBjb25zdCB0b0Z1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKG5ld0Nob3JkLCBjdXJyZW50U2NhbGUpO1xuICAgICAgICAgICAgY29uc3QgcG9zc2libGVUb0Z1bmN0aW9ucyA9IHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnM7XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzaW9ucyA9IHByb2dyZXNzaW9uQ2hvaWNlc1tmcm9tRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4XTtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZ29vZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4ID09IHRvRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGRvbWluYW50VG9Eb21pbmFudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvZ3Jlc3Npb24gb2YgcHJvZ3Jlc3Npb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChgJHtwcm9ncmVzc2lvbn1gID09IGAke3RvRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4fWApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZlY3QgcHJvZ3Jlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9ncmVzc2lvbiA9PSBcInN0cmluZ1wiICYmIHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnMgJiYgdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9uc1twcm9ncmVzc2lvbl0gIT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSB0b0Z1bmN0aW9ucy5wb3NzaWJsZVRvRnVuY3Rpb25zW3Byb2dyZXNzaW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc2lvbiA9PSBcImRvbWluYW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21pbmFudFRvRG9taW5hbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFnb29kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMTQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UncmUgbW92aW5nIGZyb20gXCJkb21pbmFudFwiIHRvIFwiZG9taW5hbnRcIiwgd2UgbmVlZCB0byBwcmV2ZW50IFwibGVzc2VuaW5nIHRoZSB0ZW5zaW9uXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbWluYW50VG9Eb21pbmFudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZDaG9yZFRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0Nob3JkVGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChjdXJyZW50U2NhbGUua2V5IC0gMSArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9uaWNOb3RlcyA9IFtjdXJyZW50U2NhbGUubm90ZXNbMF0sIGN1cnJlbnRTY2FsZS5ub3Rlc1syXSwgY3VycmVudFNjYWxlLm5vdGVzWzRdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiBwcmV2Q2hvcmQubm90ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFYWNoIG5vdGUgbm90IGluIHRvbmljIG5vdGVzIGFkZHMgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlYWRpbmcgdG9uZSBhZGRzIG1vcmUgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9uaWNOb3Rlcy5zb21lKHRvbmljTm90ZSA9PiB0b25pY05vdGUuc2VtaXRvbmUgPT0gbm90ZS5zZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNob3JkVGVuc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSBsZWFkaW5nVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2hvcmRUZW5zaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIG5ld0Nob3JkLm5vdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWFjaCBub3RlIG5vdCBpbiB0b25pYyBub3RlcyBhZGRzIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZWFkaW5nIHRvbmUgYWRkcyBtb3JlIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvbmljTm90ZXMuc29tZSh0b25pY05vdGUgPT4gdG9uaWNOb3RlLnNlbWl0b25lID09IG5vdGUuc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nob3JkVGVuc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSBsZWFkaW5nVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDaG9yZFRlbnNpb24gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hvcmRUZW5zaW9uIDwgcHJldkNob3JkVGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxNztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZ3Jlc3Npb25zICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJzdWItZG9taW5hbnRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVUb0Z1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSA9PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZVRvRnVuY3Rpb25zW1wiZG9taW5hbnRcIl0gPT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IGBXYW50ZWQgJHt3YW50ZWRGdW5jdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDE7ICAvLyBEb21pbmFudCBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcImRvbWluYW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlVG9GdW5jdGlvbnNbXCJkb21pbmFudFwiXSA9PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBgV2FudGVkICR7d2FudGVkRnVuY3Rpb259YFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJ0b25pY1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZVRvRnVuY3Rpb25zW1widG9uaWNcIl0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gYFdhbnRlZCAke3dhbnRlZEZ1bmN0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIlBBQ1wiKSB7XG4gICAgICAgICAgICAvLyBTaW5jZSBQQUMgaXMgc28gaGFyZCwgbGV0cyBsb29zZW4gdXAgdGhlIHJ1bGVzIGEgYml0XG4gICAgICAgICAgICBpZiAodGVuc2lvbi5jYWRlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgPSAtMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG4gICAgbGV0IHRlbnNpb25SZXN1bHQgPSB7XG4gICAgICAgIGNob3JkUHJvZ3Jlc3Npb246IDExMixcbiAgICAgICAgY2FkZW5jZTogMCxcbiAgICAgICAgY29tbWVudDogXCJcIlxuICAgIH07XG4gICAgbGV0IHByZXZDaG9yZElzVG9uaWNpemVkID0gZmFsc2U7XG4gICAgbGV0IG5ld0Nob3JkSXNTZWNvbmRhcnlEb21pbmFudCA9IGZhbHNlO1xuICAgIGNvbnN0IGNhZGVuY2VJc05lYXIgPSB3YW50ZWRGdW5jdGlvbiB8fCAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSB8fCAwKSA8IDU7XG4gICAgaWYgKHByZXZDaG9yZCAmJiBwcmV2U2NhbGUpIHtcbiAgICAgICAgaWYgKHByZXZDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgIHByZXZDaG9yZElzVG9uaWNpemVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobmV3Q2hvcmQgJiYgY3VycmVudFNjYWxlICYmIG9yaWdpbmFsU2NhbGUpIHtcbiAgICAgICAgLy8gQ2hvcmQgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBub3RlIG5vdCBpbiB0aGUgb3JpZ2luYWwgc2NhbGVcbiAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzLnNvbWUobm90ZSA9PiAhb3JpZ2luYWxTY2FsZS5ub3Rlcy5zb21lKHNjYWxlTm90ZSA9PiBzY2FsZU5vdGUuc2VtaXRvbmUgPT0gbm90ZS5zZW1pdG9uZSkpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdDaG9yZEZ1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKG5ld0Nob3JkLCBjdXJyZW50U2NhbGUpO1xuICAgICAgICAgICAgaWYgKG5ld0Nob3JkRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPCAxMDAgfHwgbmV3Q2hvcmRGdW5jdGlvbnMucm9vdFNjYWxlSW5kZXggPT0gMSkge1xuICAgICAgICAgICAgICAgIG5ld0Nob3JkSXNTZWNvbmRhcnlEb21pbmFudCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJldlNjYWxlICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSAmJiBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgIT0gcHJldlNjYWxlLnRvU3RyaW5nKCkgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgIT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gQ2FuJ3QgbW9kdWxhdGUgZHVyaW5nIGEgbW9kdWxhdGlvblxuICAgIH0gZWxzZSBpZiAobmV3Q2hvcmQgJiYgcHJldlNjYWxlICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSAmJiBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgPT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgaWYgKCFjYWRlbmNlSXNOZWFyICYmIG5ld0Nob3JkSXNTZWNvbmRhcnlEb21pbmFudCAmJiAhcHJldkNob3JkSXNUb25pY2l6ZWQpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgY2hvcmQgd291bGQgYWxsb3cgbW92aW5nIHRvIGEgbmV3IHNjYWxlIHRlbXBvcmFyaWx5IChhIGRvbWluYW50IGZ1bmN0aW9uIGF0IG1vc3QpXG4gICAgICAgICAgICAvLyBUaGUgdGVuc2lvbiBpcyBub3cgYWN0dWFsbHkgYmV0d2VlbiB0aGUgdG9uaWNpemVkIGNob3JkIGFuZCB0aGUgcHJldmlvdXMgY2hvcmQsICppbiB0aGUgcHJldmlvdXMgc2NhbGUqIVxuICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChbJ2RvbTcnXS5pbmNsdWRlcyhuZXdDaG9yZC5jaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlmdGhEb3duRnJvbU5ld0Nob3JkUm9vdCA9IChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSAtIDcgKyAyNCkgJSAxMjtcbiAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZCA9IGJ1aWxkVHJpYWRPbihmaWZ0aERvd25Gcm9tTmV3Q2hvcmRSb290LCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgPSB0b25pY2l6ZWRDaG9yZD8ubm90ZXNbMF0uc2VtaXRvbmUgPT0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lO1xuICAgICAgICAgICAgICAgIGlmICh0b25pY2l6ZWRDaG9yZCAmJiB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlICYmIFsnbWFqJywgJ21pbiddLmluY2x1ZGVzKHRvbmljaXplZENob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKHRvbmljaXplZENob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIHByZXZTY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUZW5zaW9uIGZyb20gdG9uaWNpemVkIGNob3JkXCIsIHRlbnNpb25SZXN1bHQsIFwidG9cIiwgdG9uaWNpemVkQ2hvcmQudG9TdHJpbmcoKSwgXCJmcm9tXCIsIHByZXZDaG9yZD8udG9TdHJpbmcoKSwgXCJpblwiLCBwcmV2U2NhbGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFsnZGltNyddLmluY2x1ZGVzKG5ld0Nob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVVcEZyb21OZXdDaG9yZFJvb3QgPSAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgKyAxICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkID0gYnVpbGRUcmlhZE9uKHNlbWl0b25lVXBGcm9tTmV3Q2hvcmRSb290LCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlID0gdG9uaWNpemVkQ2hvcmQ/Lm5vdGVzWzBdLnNlbWl0b25lID09IGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvbmljaXplZENob3JkICYmIHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgJiYgWydtYWonLCAnbWluJ10uaW5jbHVkZXModG9uaWNpemVkQ2hvcmQuY2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0ID0gZ2V0Q2hvcmRzVGVuc2lvbih0b25pY2l6ZWRDaG9yZCwgcHJldkNob3JkLCBwcmV2UHJldkNob3JkLCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRlbnNpb24gZnJvbSB0b25pY2l6ZWQgY2hvcmRcIiwgdGVuc2lvblJlc3VsdCwgXCJ0b1wiLCB0b25pY2l6ZWRDaG9yZC50b1N0cmluZygpLCBcImZyb21cIiwgcHJldkNob3JkPy50b1N0cmluZygpLCBcImluXCIsIHByZXZTY2FsZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICAgICAgICAgIGlmIChbJ21pbjcnXS5pbmNsdWRlcyhuZXdDaG9yZC5jaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR3b1NlbWl0b25lc0Rvd25Gcm9tTmV3Q2hvcmRSb290ID0gKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lIC0gMiArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZCA9IGJ1aWxkVHJpYWRPbih0d29TZW1pdG9uZXNEb3duRnJvbU5ld0Nob3JkUm9vdCwgcHJldlNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9uaWNpemVkQ2hvcmRJc0lPZkN1cnJlbnRTY2FsZSA9IHRvbmljaXplZENob3JkPy5ub3Rlc1swXS5zZW1pdG9uZSA9PSBjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b25pY2l6ZWRDaG9yZCAmJiB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlICYmIFsnbWFqJywgJ21pbiddLmluY2x1ZGVzKHRvbmljaXplZENob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24odG9uaWNpemVkQ2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgcHJldlNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUZW5zaW9uIGZyb20gdG9uaWNpemVkIGNob3JkXCIsIHRlbnNpb25SZXN1bHQsIFwidG9cIiwgdG9uaWNpemVkQ2hvcmQudG9TdHJpbmcoKSwgXCJmcm9tXCIsIHByZXZDaG9yZD8udG9TdHJpbmcoKSwgXCJpblwiLCBwcmV2U2NhbGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5ld0Nob3JkICYmIHByZXZTY2FsZSAmJiBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSAhPSBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgPT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gSWYgd2UgYXJlIGhlcmUsIHRoZSBtb2R1bGF0ZWQgcHJvZ3Jlc3Npb24gaXMgZ29pbmcgb24gc3RpbGwuIElmIHByZXZDaG9yZCBpcyBhIHRvbmljLCB3ZSBjYW4ndCBhbGxvdyBhbnl0aGluZyBpbiB0aGlzIG5ldyBzY2FsZS5cbiAgICAgICAgaWYgKHByZXZDaG9yZElzVG9uaWNpemVkIHx8IGNhZGVuY2VJc05lYXIpIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvbjogMTAxLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IFwiVG9uaWNpemVkIGNob3JkIHJlYWNoZWQsIGNhbid0IGFsbG93IGFueXRoaW5nIGluIHRoaXMgbmV3IHNjYWxlXCIsXG4gICAgICAgICAgICAgICAgY2FkZW5jZTogMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKG5ld0Nob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIHByZXZTY2FsZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCF3YW50ZWRGdW5jdGlvbiAmJiBuZXdDaG9yZCAmJiBwcmV2U2NhbGUgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgPT0gb3JpZ2luYWxTY2FsZS50b1N0cmluZygpICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IHByZXZTY2FsZS50b1N0cmluZygpKSB7XG4gICAgICAgIC8vIElmIHdlIGFyZSBoZXJlLCB0aGUgbW9kdWxhdGVkIHByb2dyZXNzaW9uIGlzIG92ZXIuIElmIHByZXZDaG9yZCBpcyBhIHRvbmljIGluIHRoZSBwcmV2aW91cyBzY2FsZSwgd2UgY2FuIGNvbnRpbnVlIGluIHRoZSBvcmlnaW5hbCBzY2FsZS5cbiAgICAgICAgaWYgKHByZXZDaG9yZElzVG9uaWNpemVkICYmIG5ld0Nob3JkLm5vdGVzLmV2ZXJ5KG5vdGUgPT4gY3VycmVudFNjYWxlLm5vdGVzLnNvbWUoc2NhbGVOb3RlID0+IHNjYWxlTm90ZS5zZW1pdG9uZSA9PSBub3RlLnNlbWl0b25lKSkpIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKG5ld0Nob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIGN1cnJlbnRTY2FsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW5zaW9uUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIGNob3JkUHJvZ3Jlc3Npb246IDEwMixcbiAgICAgICAgICAgICAgICBjb21tZW50OiBcIk1vZHVsYXRlZCBwcm9ncmVzc2lvbiBoYXMgbm90IGVuZGVkLCBjYW4ndCBhbGxvdyBhbnl0aGluZyBpbiB0aGUgb3JpZ2luYWwgc2NhbGVcIixcbiAgICAgICAgICAgICAgICBjYWRlbmNlOiAwLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh3YW50ZWRGdW5jdGlvbiAmJiBwcmV2U2NhbGUgJiYgKHByZXZTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgLy8gT2ggbm9lcywgd2UgYXJlIGluIGEgbW9kdWxhdGVkIHByb2dyZXNzaW9uIGFuZCB0aGUgY2FkZW5jZSBzdGFydGVkLiBUaGlzIHdpbGwgbm90IGRvXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24obmV3Q2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgY3VycmVudFNjYWxlKTtcbiAgICB9XG4gICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uID0gdGVuc2lvblJlc3VsdC5jaG9yZFByb2dyZXNzaW9uO1xuICAgIHRlbnNpb24uY29tbWVudCArPSB0ZW5zaW9uUmVzdWx0LmNvbW1lbnQ7XG4gICAgdGVuc2lvbi5jYWRlbmNlICs9IHRlbnNpb25SZXN1bHQuY2FkZW5jZTtcbn1cbiIsImltcG9ydCB7XG4gICAgYnVpbGRUYWJsZXMsXG4gICAgU2NhbGUsXG4gICAgTm90ZSxcbn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBDaG9yZCwgTnVsbGFibGUsIERpdmlzaW9uZWRSaWNobm90ZXMsIFJpY2hOb3RlLCBCRUFUX0xFTkdUSCwgc2VtaXRvbmVTY2FsZUluZGV4IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFJhbmRvbUNob3JkR2VuZXJhdG9yIH0gZnJvbSBcIi4vcmFuZG9tY2hvcmRzXCI7XG5pbXBvcnQgeyBnZXRJbnZlcnNpb25zIH0gZnJvbSBcIi4vaW52ZXJzaW9uc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgbWFrZVRlbnNpb24sIFRlbnNpb24sIFRlbnNpb25FcnJvciB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IGFkZE5vdGVCZXR3ZWVuLCBidWlsZFRvcE1lbG9keSB9IGZyb20gXCIuL25vbmNob3JkdG9uZXNcIjtcbmltcG9ydCB7IGFkZEhhbGZOb3RlcyB9IGZyb20gXCIuL2hhbGZub3Rlc1wiO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlU2NhbGVzIH0gZnJvbSBcIi4vYXZhaWxhYmxlc2NhbGVzXCI7XG5pbXBvcnQgeyBhZGRGb3JjZWRNZWxvZHksIEZvcmNlZE1lbG9keVJlc3VsdCB9IGZyb20gXCIuL2ZvcmNlZG1lbG9keVwiO1xuaW1wb3J0ICogYXMgdGltZSBmcm9tIFwiLi90aW1lclwiOyBcbmltcG9ydCB7IGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uIH0gZnJvbSBcIi4vY2hvcmRwcm9ncmVzc2lvblwiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBnb29kU291bmRpbmdTY2FsZVRlbnNpb24gfSBmcm9tIFwiLi9nb29kc291bmRpbmdzY2FsZVwiO1xuXG5jb25zdCBHT09EX0NIT1JEX0xJTUlUID0gMTAwMDtcbmNvbnN0IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCA9IDEwMDtcbmNvbnN0IEJBRF9DSE9SRF9MSU1JVCA9IDIwMDtcbmNvbnN0IEJBRF9DSE9SRFNfUEVSX0NIT1JEID0gMTA7XG5cbnR5cGUgQmFkQ2hvcmQgPSB7XG4gICAgdGVuc2lvbjogVGVuc2lvbiwgY2hvcmQ6IHN0cmluZywgc2NhbGU6IFNjYWxlXG59XG5cbmNvbnN0IHNsZWVwTVMgPSBhc3luYyAobXM6IG51bWJlcik6IFByb21pc2U8bnVsbD4gPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuY29uc3QgbWFrZUNob3JkcyA9IGFzeW5jIChtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpOiBQcm9taXNlPERpdmlzaW9uZWRSaWNobm90ZXM+ID0+IHtcbiAgICAvLyBnZW5lcmF0ZSBhIHByb2dyZXNzaW9uXG4gICAgLy8gVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyB0aGUgZW50aXJlIHNvbmcuXG4gICAgLy8gVGhlIGJhc2ljIGlkZWEgaXMgdGhhdCBcblxuICAgIC8vIFVudGlsIHRoZSBmaXJzdCBJQUMgb3IgUEFDLCBtZWxvZHkgYW5kIHJoeXRtIGlzIHJhbmRvbS4gKFRob3VnaCBlYWNoIGNhZGVuY2UgaGFzIGl0J3Mgb3duIG1lbG9kaWMgaGlnaCBwb2ludC4pXG5cbiAgICAvLyBUaGlzIG1lbG9keSBhbmQgcmh5dG0gaXMgcGFydGlhbGx5IHNhdmVkIGFuZCByZXBlYXRlZCBpbiB0aGUgbmV4dCBjYWRlbmNlcy5cbiAgICBjb25zdCBtYXhCZWF0cyA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcblxuICAgIGxldCByZXN1bHQ6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcbiAgICBsZXQgb3JpZ2luYWxTY2FsZTogU2NhbGU7XG5cbiAgICBsZXQgZGl2aXNpb25CYW5uZWROb3Rlczoge1trZXk6IG51bWJlcl06IEFycmF5PEFycmF5PE5vdGU+Pn0gPSB7fVxuICAgIGxldCBkaXZpc2lvbkJhbkNvdW50OiB7W2tleTogbnVtYmVyXTogbnVtYmVyfSA9IHt9XG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IHByZXZSZXN1bHQgPSByZXN1bHRbZGl2aXNpb24gLSBCRUFUX0xFTkdUSF07XG4gICAgICAgIGxldCBwcmV2Q2hvcmQgPSBwcmV2UmVzdWx0ID8gcHJldlJlc3VsdFswXS5jaG9yZCA6IG51bGw7XG4gICAgICAgIGxldCBwcmV2Tm90ZXM6IE5vdGVbXTtcbiAgICAgICAgbGV0IHByZXZJbnZlcnNpb25OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBjdXJyZW50U2NhbGU6IFNjYWxlIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgYmFubmVkTm90ZXNzID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbl07XG4gICAgICAgIGlmIChwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICBwcmV2Tm90ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgcHJldlJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSA9IHJpY2hOb3RlLmludmVyc2lvbk5hbWU7XG4gICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKCFvcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGUgPSBjdXJyZW50U2NhbGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZSA9IGN1cnJlbnRTY2FsZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1haW5QYXJhbXMuZm9yY2VkT3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTY2FsZSA9IG1haW5QYXJhbXMuZm9yY2VkT3JpZ2luYWxTY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG9yaWdpbmFsU2NhbGUgPSBvcmlnaW5hbFNjYWxlIGFzIFNjYWxlO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHByZXZOb3RlcyA9IHByZXZOb3RlcztcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZDtcblxuICAgICAgICBjb25zdCBjdXJyZW50QmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG5cbiAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZChcImRpdmlzaW9uXCIsIGRpdmlzaW9uLCBcImJlYXRcIiwgY3VycmVudEJlYXQsIHByZXZDaG9yZCA/IHByZXZDaG9yZC50b1N0cmluZygpIDogXCJudWxsXCIsIFwiIHNjYWxlIFwiLCBjdXJyZW50U2NhbGUgPyBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA6IFwibnVsbFwiLCBwcmV2UmVzdWx0ICYmIHByZXZSZXN1bHRbMF0/LnRlbnNpb24gPyBwcmV2UmVzdWx0WzBdLnRlbnNpb24udG9QcmludCgpIDogXCJcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVwiLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlKTtcblxuICAgICAgICBjb25zdCByYW5kb21HZW5lcmF0b3IgPSBuZXcgUmFuZG9tQ2hvcmRHZW5lcmF0b3IocGFyYW1zKVxuICAgICAgICBsZXQgbmV3Q2hvcmQ6IE51bGxhYmxlPENob3JkPiA9IG51bGw7XG5cbiAgICAgICAgbGV0IGdvb2RDaG9yZHM6IFJpY2hOb3RlW11bXSA9IFtdXG4gICAgICAgIGNvbnN0IGJhZENob3JkczogQmFkQ2hvcmRbXSA9IFtdXG5cbiAgICAgICAgY29uc3QgcmFuZG9tTm90ZXM6IEFycmF5PE5vdGU+ID0gW107XG5cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICBsZXQgc2tpcExvb3AgPSBmYWxzZTtcblxuICAgICAgICBpZiAocGFyYW1zLmJlYXRzVW50aWxBdXRoZW50aWNDYWRlbmNlRW5kID09IDEgJiYgcHJldk5vdGVzKSB7XG4gICAgICAgICAgICAvLyBGb3JjZSBzYW1lIGNob3JkIHR3aWNlXG4gICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSgwLCBnb29kQ2hvcmRzLmxlbmd0aCk7XG4gICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocHJldk5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogQkVBVF9MRU5HVEgsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IHByZXZDaG9yZCxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBvcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSkpKTtcbiAgICAgICAgICAgIHNraXBMb29wID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghc2tpcExvb3AgJiYgZ29vZENob3Jkcy5sZW5ndGggPCAoY3VycmVudEJlYXQgIT0gMCA/IEdPT0RfQ0hPUkRfTElNSVQgOiA1KSkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgICAgbmV3Q2hvcmQgPSByYW5kb21HZW5lcmF0b3IuZ2V0Q2hvcmQoKTtcbiAgICAgICAgICAgIGNvbnN0IGNob3JkTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwMDAgfHwgIW5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRvbyBtYW55IGl0ZXJhdGlvbnM6ICR7aXRlcmF0aW9uc30sIGdvaW5nIGJhY2tgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYWluUGFyYW1zLmZvcmNlZENob3JkcyAmJiBvcmlnaW5hbFNjYWxlICYmIG5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9yY2VkQ2hvcmROdW0gPSBwYXJzZUludChtYWluUGFyYW1zLmZvcmNlZENob3Jkc1tjdXJyZW50QmVhdF0pO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4oZm9yY2VkQ2hvcmROdW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZW1pdG9uZVNjYWxlSW5kZXgob3JpZ2luYWxTY2FsZSlbbmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmVdICE9IChmb3JjZWRDaG9yZE51bSAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBhbGxJbnZlcnNpb25zO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZVNjYWxlcztcblxuICAgICAgICAgICAgYXZhaWxhYmxlU2NhbGVzID0gZ2V0QXZhaWxhYmxlU2NhbGVzKHtcbiAgICAgICAgICAgICAgICBsYXRlc3REaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzOiBuZXdDaG9yZC5ub3RlcyxcbiAgICAgICAgICAgICAgICBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2NhbGUgJiYgKG1heEJlYXRzIC0gY3VycmVudEJlYXQgPCAzIHx8IGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzIHx8IGN1cnJlbnRCZWF0IDwgNSkpIHtcbiAgICAgICAgICAgICAgICAvLyBEb24ndCBhbGxvdyBvdGhlciBzY2FsZXMgdGhhbiB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBhdmFpbGFibGVTY2FsZXMuZmlsdGVyKHMgPT4gcy5zY2FsZS5lcXVhbHMoY3VycmVudFNjYWxlIGFzIFNjYWxlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXZhaWxhYmxlU2NhbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGF2YWlsYWJsZVNjYWxlIG9mIGF2YWlsYWJsZVNjYWxlcykge1xuICAgICAgICAgICAgICAgIGFsbEludmVyc2lvbnMgPSBnZXRJbnZlcnNpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLCBwcmV2Tm90ZXM6IHByZXZOb3RlcywgYmVhdDogY3VycmVudEJlYXQsIHBhcmFtcywgbG9nZ2VyOiBuZXcgTG9nZ2VyKGNob3JkTG9nZ2VyKSxcbiAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbWF4QmVhdHMgLSBjdXJyZW50QmVhdFxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBsZXQgc3RvcEludmVyc2lvbkxvb3AgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW52ZXJzaW9uUmVzdWx0IG9mIGFsbEludmVyc2lvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3BJbnZlcnNpb25Mb29wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52ZXJzaW9uTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIudGl0bGUgPSBbXCJJbnZlcnNpb24gXCIsIGAke2ludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lfWBdO1xuICAgICAgICAgICAgICAgICAgICByYW5kb21Ob3Rlcy5zcGxpY2UoMCwgcmFuZG9tTm90ZXMubGVuZ3RoKTsgIC8vIEVtcHR5IHRoaXMgYW5kIHJlcGxhY2UgY29udGVudHNcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tTm90ZXMucHVzaCguLi5pbnZlcnNpb25SZXN1bHQubm90ZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXNzICYmIGJhbm5lZE5vdGVzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFubmVkTm90ZXMgb2YgYmFubmVkTm90ZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZE5vdGVzLmxlbmd0aCAhPSByYW5kb21Ob3Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kb21Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tTm90ZXNbaV0udG9TdHJpbmcoKSAhPSBiYW5uZWROb3Rlc1tpXS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFubmVkIG5vdGVzXCIsIHJhbmRvbU5vdGVzLm1hcChuID0+IG4udG9TdHJpbmcoKSksIFwiYmFubmVkTm90ZXNzXCIsIGJhbm5lZE5vdGVzcy5tYXAobiA9PiBuLm1hcChuID0+IG4udG9TdHJpbmcoKSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTm90ZXM6IHJhbmRvbU5vdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IG9yaWdpbmFsU2NhbGUsIFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG1heEJlYXRzIC0gY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblJlc3VsdCA9IG1ha2VUZW5zaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5pbnZlcnNpb25UZW5zaW9uID0gaW52ZXJzaW9uUmVzdWx0LnJhdGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZFNvdW5kaW5nU2NhbGVUZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VGVuc2lvbih0ZW5zaW9uUmVzdWx0LCB0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbiA9IHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVGVuc2lvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gd29ycmllcywgdGhpcyBjaG9yZC9zY2FsZS9pbnZlcnNpb24gY29tYmluYXRpb24gaXMganVzdCBiYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb25SZXN1bHQuY2hvcmRQcm9ncmVzc2lvbiA+PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHBvaW50IGNoZWNraW5nIG90aGVyIGludmVyc2lvbnMgZm9yIHRoaXMgY2hvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BJbnZlcnNpb25Mb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnaXZlVVAgPSBwcm9ncmVzc0NhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVVUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVsb2R5UmVzdWx0OiBGb3JjZWRNZWxvZHlSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIHRoaXMgcG9zc2libGUgdG8gd29yayB3aXRoIHRoZSBtZWxvZHk/XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgYWRkIG1lbG9keSBub3RlcyBhbmQgTkFDcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbG9keVJlc3VsdCA9IGFkZEZvcmNlZE1lbG9keSh0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQuZm9yY2VkTWVsb2R5ICs9IG1lbG9keVJlc3VsdC50ZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lbG9keVJlc3VsdC5uYWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm5hYyA9IG1lbG9keVJlc3VsdC5uYWM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVsb2R5UmVzdWx0LmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0LmNvbW1lbnQgPSBtZWxvZHlSZXN1bHQuY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24gPSB0ZW5zaW9uUmVzdWx0LmdldFRvdGFsVGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTG9nZ2VyLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aGlzQ2hvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdvb2RDaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZCAmJiBnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNDaG9yZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9yZENvdW50ID49IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHdvcnN0IHByZXZpb3VzIGdvb2RDaG9yZCBpZiB0aGlzIGhhcyBsZXNzIHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RDaG9yZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcnN0Q2hvcmRUZW5zaW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdvb2RDaG9yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZENob3JkID0gZ29vZENob3Jkc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZCAmJiBnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGdvb2RDaG9yZFswXS50ZW5zaW9uPy50b3RhbFRlbnNpb24gfHwgOTk5KSA8IHdvcnN0Q2hvcmRUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yc3RDaG9yZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcnN0Q2hvcmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGdvb2RDaG9yZHNbd29yc3RDaG9yZF1bMF0udGVuc2lvbj8udG90YWxUZW5zaW9uIHx8IDk5OSkgPiB0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHJlbW92ZSB0aGF0IGluZGV4LCBhZGQgYSBuZXcgb25lIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSh3b3JzdENob3JkLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9yZENvdW50IDwgR09PRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZENob3Jkcy5wdXNoKHJhbmRvbU5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IG5vdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBCRUFUX0xFTkdUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGVuc2lvblJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBvcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmljaE5vdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGVuc2lvblJlc3VsdC50b3RhbFRlbnNpb24gPCAxMDAwMDAgJiYgYmFkQ2hvcmRzLmxlbmd0aCA8IEJBRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNob3JkQ291bnRJbkJhZENob3JkcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RCYWRDaG9yZDogQmFkQ2hvcmQgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFkQ2hvcmQgb2YgYmFkQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhZENob3JkLmNob3JkLmluY2x1ZGVzKG5ld0Nob3JkLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkQ291bnRJbkJhZENob3JkcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXdvcnN0QmFkQ2hvcmQgfHwgYmFkQ2hvcmQudGVuc2lvbi50b3RhbFRlbnNpb24gPiB3b3JzdEJhZENob3JkPy50ZW5zaW9uLnRvdGFsVGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yc3RCYWRDaG9yZCA9IGJhZENob3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNob3JkQ291bnRJbkJhZENob3JkcyA8IEJBRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkQ2hvcmRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQudG9TdHJpbmcoKSArIFwiLFwiICsgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRlbnNpb25SZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod29yc3RCYWRDaG9yZCAhPSBudWxsICYmIHdvcnN0QmFkQ2hvcmQudGVuc2lvbi50b3RhbFRlbnNpb24gPiB0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4VG9SZXBsYWNlID0gYmFkQ2hvcmRzLmZpbmRJbmRleChiID0+IGIuY2hvcmQgPT0gd29yc3RCYWRDaG9yZC5jaG9yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkQ2hvcmRzW2luZGV4VG9SZXBsYWNlXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLnRvU3RyaW5nKCkgKyBcIixcIiArIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogYXZhaWxhYmxlU2NhbGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gIC8vIEZvciBhdmFpbGFibGUgc2NhbGVzIGVuZFxuICAgICAgICAgICAgfSAgLy8gRm9yIHZvaWNlbGVhZGluZyByZXN1bHRzIGVuZFxuICAgICAgICB9ICAvLyBXaGlsZSBlbmRcbiAgICAgICAgbGV0IGJlc3RPZkJhZENob3JkcyA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgYmFkQ2hvcmQgb2YgYmFkQ2hvcmRzKSB7XG4gICAgICAgICAgICBiYWRDaG9yZC50ZW5zaW9uLnByaW50KFwiQmFkIGNob3JkIFwiLCBiYWRDaG9yZC5jaG9yZCwgXCIgLSBcIiwgYmFkQ2hvcmQuc2NhbGUudG9TdHJpbmcoKSwgXCIgLSBcIik7XG4gICAgICAgICAgICBpZiAoYmVzdE9mQmFkQ2hvcmRzID09IG51bGwgfHwgYmFkQ2hvcmQudGVuc2lvbi50b3RhbFRlbnNpb24gPCBiZXN0T2ZCYWRDaG9yZHMudGVuc2lvbi50b3RhbFRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICBiZXN0T2ZCYWRDaG9yZHMgPSBiYWRDaG9yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZChcbiAgICAgICAgICAgICAgICBcIk5vIGdvb2QgY2hvcmRzIGZvdW5kOiBcIixcbiAgICAgICAgICAgICAgICAoKGJlc3RPZkJhZENob3JkcyAmJiBiZXN0T2ZCYWRDaG9yZHMudGVuc2lvbikgPyAoW2Jlc3RPZkJhZENob3Jkcy5jaG9yZCwgYmVzdE9mQmFkQ2hvcmRzLnRlbnNpb24uY29tbWVudCwgYmVzdE9mQmFkQ2hvcmRzLnRlbnNpb24udG9QcmludCgpXSkgOiBcIlwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGF3YWl0IHNsZWVwTVMoMSk7XG4gICAgICAgICAgICAvLyBHbyBiYWNrIHRvIHByZXZpb3VzIGNob3JkLCBhbmQgbWFrZSBpdCBhZ2FpblxuICAgICAgICAgICAgaWYgKGRpdmlzaW9uID49IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgICAgIC8vIE1hcmsgdGhlIHByZXZpb3VzIGNob3JkIGFzIGJhbm5lZFxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Jhbm5lZE5vdGVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdCYW5uZWROb3Rlc1tub3RlLnBhcnRJbmRleF0gPSBub3RlLm5vdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgcHJldmlvdXMgY2hvcmQgKHdoZXJlIHdlIGFyZSBnb2luZyB0bylcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGFueSBub3RlcyBhZnRlciB0aGF0IGFsc29cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSDsgaSA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5sZW5ndGggPiAxMCAmJiByZXN1bHRbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRvbyBtYW55IGJhbnMsIGdvIGJhY2sgZnVydGhlci4gUmVtb3ZlIHRoZXNlIGJhbnMgc28gdGhleSBkb24ndCBoaW5kZXIgbGF0ZXIgcHJvZ3Jlc3MuXG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEhcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3QmFubmVkTm90ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmFubmVkTm90ZXNbbm90ZS5wYXJ0SW5kZXhdID0gbm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSA9IGRpdmlzaW9uQmFuQ291bnRbZGl2aXNpb25dIHx8IDA7XG4gICAgICAgICAgICAgICAgZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0rKztcbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0gPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBzdHVjay4gR28gYmFjayA4IGJlYXRzIGFuZCB0cnkgYWdhaW4uXG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uIC09IEJFQVRfTEVOR1RIICogODtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0gPSBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb24gPCAtMSAqIEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uID0gLTEgKiBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb28gbWFueSBiYW5zLCBnb2luZyBiYWNrIHRvIGRpdmlzaW9uIFwiICsgZGl2aXNpb24gKyBcIiBiYW4gY291bnQgXCIgKyBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSk7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIHRoZSByZXN1bHQgd2hlcmUgd2UgYXJlIGdvaW5nIHRvIGFuZCBhbnl0aGluZyBhZnRlciBpdFxuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGRpdmlzaW9uICsgQkVBVF9MRU5HVEggKyAxOyBpIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbaV07XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkaXZpc2lvbkJhbm5lZE5vdGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZmFpbGVkIHJpZ2h0IGF0IHRoZSBzdGFydC5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQgLSAxLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChnaXZlVVApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENob29zZSB0aGUgYmVzdCBjaG9yZCBmcm9tIGdvb2RDaG9yZHNcbiAgICAgICAgbGV0IGJlc3RDaG9yZHM6IFJpY2hOb3RlW11bXSA9IFtdO1xuICAgICAgICBsZXQgd29yc3RCZXN0VGVuc2lvbjogbnVtYmVyID0gOTk5O1xuICAgICAgICBsZXQgYmVzdFRlbnNpb24gPSA5OTk7XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmQgb2YgZ29vZENob3Jkcykge1xuICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uIDwgd29yc3RCZXN0VGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmVzdENob3Jkcy5sZW5ndGggPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXhUb1JlcGxhY2UgPSBiZXN0Q2hvcmRzLmZpbmRJbmRleChiID0+IGJbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPT0gd29yc3RCZXN0VGVuc2lvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0Q2hvcmRzW2luZGV4VG9SZXBsYWNlXSA9IGNob3JkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdENob3Jkcy5wdXNoKGNob3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiZXN0VGVuc2lvbiA9IGNob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICB3b3JzdEJlc3RUZW5zaW9uID0gYmVzdENob3Jkcy5yZWR1Y2UoKGEsIGIpID0+IGFbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPiBiWzBdLnRlbnNpb24udG90YWxUZW5zaW9uID8gYSA6IGIpWzBdLnRlbnNpb24udG90YWxUZW5zaW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaG9yZFswXS50ZW5zaW9uLnByaW50KGNob3JkWzBdLmNob3JkID8gY2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA6IFwiP0Nob3JkP1wiLCBjaG9yZFswXS5pbnZlcnNpb25OYW1lLCBcImJlc3QgdGVuc2lvbjogXCIsIGJlc3RUZW5zaW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmVzdENob3JkID0gYmVzdENob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBiZXN0Q2hvcmRzLmxlbmd0aCldO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJlc3QgY2hvcmQ6IFwiLCBiZXN0Q2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSwgYmVzdENob3JkWzBdLmludmVyc2lvbk5hbWUsIGJlc3RDaG9yZFswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbik7XG5cbiAgICAgICAgcmVzdWx0W2RpdmlzaW9uXSA9IGJlc3RDaG9yZDtcbiAgICAgICAgaWYgKGJlc3RDaG9yZFswXT8udGVuc2lvbj8ubmFjKSB7XG4gICAgICAgICAgICAvLyBBZGQgdGhlIHJlcXVpcmVkIE5vbiBDaG9yZCBUb25lXG4gICAgICAgICAgICBhZGROb3RlQmV0d2VlbihiZXN0Q2hvcmRbMF0udGVuc2lvbi5uYWMsIGRpdmlzaW9uLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCAwLCByZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKGN1cnJlbnRCZWF0LCByZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlTXVzaWMocGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpIHtcbiAgICBsZXQgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0ge307XG4gICAgZGl2aXNpb25lZE5vdGVzID0gYXdhaXQgbWFrZUNob3JkcyhwYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2spO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKTtcbiAgICAvLyBhZGRFaWdodGhOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcbiAgICAvLyBhZGRIYWxmTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGRpdmlzaW9uZWROb3RlczogZGl2aXNpb25lZE5vdGVzLFxuICAgIH1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU1lbG9keShkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcykge1xuICAgIC8vIFJlbW92ZSBvbGQgbWVsb2R5IGFuZCBtYWtlIGEgbmV3IG9uZVxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpXG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24rKykge1xuICAgICAgICBjb25zdCBvbkJlYXQgPSBkaXZpc2lvbiAlIEJFQVRfTEVOR1RIID09IDA7XG4gICAgICAgIGlmICghb25CZWF0KSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dID0gW11cbiAgICAgICAgfSBlbHNlIGlmIChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dICYmIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5mb3JFYWNoKHJpY2hOb3RlID0+IHtcbiAgICAgICAgICAgICAgICByaWNoTm90ZS5kdXJhdGlvbiA9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLnRpZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIGNvbnN0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IG5ld1ZvaWNlTGVhZGluZ05vdGVzKGNob3JkcywgcGFyYW1zKTtcbiAgICAvLyBidWlsZFRvcE1lbG9keShkaXZpc2lvbmVkTm90ZXMsIG1haW5QYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIC8vIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIG1haW5QYXJhbXMpXG59XG5cbmV4cG9ydCB7IGJ1aWxkVGFibGVzIH0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBhZGROb3RlQmV0d2VlbiwgZmluZE5BQ3MsIEZpbmROb25DaG9yZFRvbmVQYXJhbXMsIE5vbkNob3JkVG9uZSB9IGZyb20gXCIuL25vbmNob3JkdG9uZXNcIjtcbmltcG9ydCB7IGdldFRlbnNpb24sIFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdldE1lbG9keU5lZWRlZFRvbmVzLCBnZXRSaWNoTm90ZSwgZ2xvYmFsU2VtaXRvbmUsIGdUb25lU3RyaW5nLCBuZXh0R1RvbmVJblNjYWxlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc2VtaXRvbmVTY2FsZUluZGV4LCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgdHlwZSBGb3JjZWRNZWxvZHlSZXN1bHQgPSB7XG4gICAgY29tbWVudDogc3RyaW5nLFxuICAgIHRlbnNpb246IG51bWJlcixcbiAgICBuYWM6IE5vbkNob3JkVG9uZSB8IG51bGwsXG59XG5cblxuXG5leHBvcnQgY29uc3QgYWRkRm9yY2VkTWVsb2R5ID0gKHZhbHVlczogVGVuc2lvblBhcmFtcyk6IEZvcmNlZE1lbG9keVJlc3VsdCA9PiB7XG4gICAgLypcbiAgICBcbiAgICAqL1xuICAgIGNvbnN0IHsgdG9Ob3RlcywgY3VycmVudFNjYWxlLCBwYXJhbXMsIG1haW5QYXJhbXMsIGJlYXREaXZpc2lvbiB9ID0gdmFsdWVzO1xuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhwYXJhbXMpO1xuICAgIGNvbnN0IGNob3JkID0gdmFsdWVzLm5ld0Nob3JkO1xuICAgIGNvbnN0IGRpdmlzaW9uZWROb3RlcyA9IHZhbHVlcy5kaXZpc2lvbmVkTm90ZXMgfHwge307XG4gICAgY29uc3QgbWF4RGl2aXNpb24gPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKCkgKiBCRUFUX0xFTkdUSDtcbiAgICBjb25zdCB0ZW5zaW9uOiBGb3JjZWRNZWxvZHlSZXN1bHQgPSB7XG4gICAgICAgIGNvbW1lbnQ6IFwiXCIsXG4gICAgICAgIHRlbnNpb246IDAsXG4gICAgICAgIG5hYzogbnVsbCxcbiAgICB9XG5cbiAgICBjb25zdCBtZWxvZHlUb25lc0FuZER1cmF0aW9ucyA9IGdldE1lbG9keU5lZWRlZFRvbmVzKG1haW5QYXJhbXMpO1xuICAgIGNvbnN0IG1lbG9keUV4aXN0cyA9IChtYWluUGFyYW1zLmZvcmNlZE1lbG9keSB8fCBbXSkubGVuZ3RoID4gMDtcbiAgICBpZiAoIW1lbG9keUV4aXN0cykge1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG4gICAgZGVidWdnZXI7XG5cbiAgICBjb25zdCBjdXJyZW50RGl2aXNpb24gPSBiZWF0RGl2aXNpb247XG4gICAgY29uc3QgY2FkZW5jZURpdmlzaW9uID0gY3VycmVudERpdmlzaW9uIC0gcGFyYW1zLmNhZGVuY2VTdGFydERpdmlzaW9uO1xuXG4gICAgLy8gU3Ryb25nIGJlYXQgbm90ZSBpcyBzdXBwb3NlZCB0byBiZSB0aGlzXG4gICAgbGV0IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2NhZGVuY2VEaXZpc2lvbl07XG4gICAgbGV0IG5ld01lbG9keVRvbmVEaXZpc2lvbiA9IGNhZGVuY2VEaXZpc2lvbjtcbiAgICBpZiAoIW5ld01lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAvLyBObyBtZWxvZHkgdG9uZSBmb3IgdGhpcyBkaXZpc2lvbiwgdGhlIHByZXZpb3VzIHRvbmUgbXVzdCBiZSBsZW5ndGh5LiBVc2UgaXQuXG4gICAgICAgIGZvciAobGV0IGkgPSBjYWRlbmNlRGl2aXNpb24gLSAxOyBpID49IGNhZGVuY2VEaXZpc2lvbiAtIEJFQVRfTEVOR1RIICogMjsgaS0tKSB7XG4gICAgICAgICAgICBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBtZWxvZHlUb25lc0FuZER1cmF0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBuZXdNZWxvZHlUb25lRGl2aXNpb24gPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uIHx8IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi50b25lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBObyBtZWxvZHkgZm91bmQgYXQgYWxsLiBHaXZlIHVwLlxuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIk5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXCI7XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld01lbG9keVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzW25ld01lbG9keVRvbmVBbmREdXJhdGlvbi50b25lXS5zZW1pdG9uZSArIDEgLSAxOyAgLy8gQ29udmVydCB0byBudW1iZXJcbiAgICBjb25zdCB0b1NlbWl0b25lcyA9IHRvTm90ZXMubWFwKCh4KSA9PiB4LnNlbWl0b25lKTtcblxuICAgIC8vIENhbiB3ZSB0dXJuIHRoaXMgbm90ZSBpbnRvIGEgbm9uLWNob3JkIHRvbmU/IENoZWNrIHRoZSBwcmV2aW91cyBhbmQgbmV4dCBub3RlLlxuICAgIGxldCBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uO1xuICAgIGxldCBuZXh0TWVsb2R5VG9uZURpdmlzaW9uO1xuICAgIGZvciAobGV0IGkgPSBuZXdNZWxvZHlUb25lRGl2aXNpb24gKyAxOyBpIDw9IG1heERpdmlzaW9uOyBpKyspIHtcbiAgICAgICAgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2ldO1xuICAgICAgICBpZiAobmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAgICAgbmV4dE1lbG9keVRvbmVEaXZpc2lvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiB8fCBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cIjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgLy8gTGV0J3Mgbm90IGNhcmUgdGhhdCBtdWNoIGlmIHRoZSB3ZWFrIGJlYXQgbm90ZSBpcyBub3QgY29ycmVjdC4gSXQganVzdCBhZGRzIHRlbnNpb24gdG8gdGhlIHJlc3VsdC5cbiAgICAvLyBVTkxFU1MgaXQncyBpbiB0aGUgbWVsb2R5IGFsc28uXG5cbiAgICAvLyBXaGF0IE5BQyBjb3VsZCB3b3JrP1xuICAgIC8vIENvbnZlcnQgYWxsIHZhbHVlcyB0byBnbG9iYWxTZW1pdG9uZXNcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lID0gZ2xvYmFsU2VtaXRvbmUodG9Ob3Rlc1swXSlcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKCh4KSA9PiBnbG9iYWxTZW1pdG9uZSh4KSk7XG4gICAgbGV0IHByZXZSaWNoTm90ZTtcbiAgICBmb3IgKGxldCBpID0gY3VycmVudERpdmlzaW9uIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgcHJldlJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSAwKVswXTtcbiAgICAgICAgaWYgKHByZXZSaWNoTm90ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJldkJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbY3VycmVudERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKS5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IDApWzBdO1xuICAgIGxldCBwcmV2QmVhdEdsb2JhbFNlbWl0b25lID0gcHJldkJlYXRSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZCZWF0UmljaE5vdGUubm90ZSkgOiBudWxsO1xuXG4gICAgbGV0IHByZXZQYXJ0MVJpY2hOb3RlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50RGl2aXNpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBwcmV2UGFydDFSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gMSlbMF07XG4gICAgICAgIGlmIChwcmV2UGFydDFSaWNoTm90ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBwcmV2aW91cyBub3RlIGRvZXNuJ3QgZXhpc3QsIHRoaXMgaXMgYWN0dWFsbHkgZWFzaWVyLlxuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZSA9IHByZXZSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG5cbiAgICAvLyBUcnlpbmcgdG8gZmlndXJlIG91dCB0aGUgbWVsb2R5IGRpcmVjdGlvbi4uLiBXZSBzaG91bGQgcHV0IG9jdGF2ZXMgaW4gdGhlIGZvcmNlZCBtZWxvZHkgc3RyaW5nLi4uXG4gICAgY29uc3QgY2xvc2VzdENvcnJlY3RHVG9uZUJhc2VkT24gPSBwcmV2QmVhdEdsb2JhbFNlbWl0b25lIHx8IGZyb21HbG9iYWxTZW1pdG9uZSB8fCB0b0dsb2JhbFNlbWl0b25lO1xuXG4gICAgbGV0IGNsb3Nlc3RDb3JyZWN0R1RvbmUgPSBuZXdNZWxvZHlTZW1pdG9uZTtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgd2hpbGUgKE1hdGguYWJzKGNsb3Nlc3RDb3JyZWN0R1RvbmUgLSBjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbikgPiA2ICYmIGNsb3Nlc3RDb3JyZWN0R1RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgaXRlcmF0aW9ucysrOyBpZiAoaXRlcmF0aW9ucyA+IDEwMCkgeyBkZWJ1Z2dlcjsgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgY2xvc2VzdENvcnJlY3RHVG9uZSArPSAxMiAqIE1hdGguc2lnbihjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbiAtIGNsb3Nlc3RDb3JyZWN0R1RvbmUpO1xuICAgIH1cblxuICAgIGxldCBuZXh0Q29ycmVjdEd0b25lO1xuICAgIGlmIChuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIG5leHRDb3JyZWN0R3RvbmUgPSBnbG9iYWxTZW1pdG9uZShjdXJyZW50U2NhbGUubm90ZXNbbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi50b25lXSkgJSAxMjtcbiAgICAgICAgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlIChNYXRoLmFicyhuZXh0Q29ycmVjdEd0b25lIC0gY2xvc2VzdENvcnJlY3RHVG9uZSkgPiA2ICYmIG5leHRDb3JyZWN0R3RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgIGl0ZXJhdGlvbnMrKzsgaWYgKGl0ZXJhdGlvbnMgPiAxMDApIHsgZGVidWdnZXI7IHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgICAgIG5leHRDb3JyZWN0R3RvbmUgKz0gMTIgKiBNYXRoLnNpZ24oY2xvc2VzdENvcnJlY3RHVG9uZSAtIG5leHRDb3JyZWN0R3RvbmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbmV4dENvcnJlY3RHdG9uZSB8fCAhbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAvLyBJZiBtZWxvZHkgaGFzIGVuZGVkLCB1c2UgY3VycmVudCBtZWxvZHkgdG9uZS5cbiAgICAgICAgbmV4dENvcnJlY3RHdG9uZSA9IGNsb3Nlc3RDb3JyZWN0R1RvbmU7XG4gICAgICAgIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgfVxuXG4gICAgbGV0IG5leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgIGlmICghbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uO1xuICAgIH1cbiAgICBsZXQgbmV4dEJlYXRDb3JyZWN0R1RvbmU7XG4gICAgaWYgKG5leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIG5leHRCZWF0Q29ycmVjdEdUb25lID0gZ2xvYmFsU2VtaXRvbmUoY3VycmVudFNjYWxlLm5vdGVzW25leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdKSAlIDEyO1xuICAgICAgICBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKG5leHRCZWF0Q29ycmVjdEdUb25lIC0gbmV4dENvcnJlY3RHdG9uZSkgPiA2ICYmIG5leHRCZWF0Q29ycmVjdEdUb25lIDw9IHNlbWl0b25lTGltaXRzWzBdWzFdKSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwKSB7IHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgICAgIG5leHRCZWF0Q29ycmVjdEdUb25lICs9IDEyICogTWF0aC5zaWduKG5leHRDb3JyZWN0R3RvbmUgLSBuZXh0QmVhdENvcnJlY3RHVG9uZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSAxOiB0aGUgcHJldmlvdXMgbm90ZSwgMjogd2hhdCB0aGUgY3VycmVudCBub3RlIHNob3VsZCBiZSwgMzogd2hhdCB0aGUgbmV4dCBub3RlIHNob3VsZCBiZS5cbiAgICAvLyBCYXNlZCBvbiB0aGUgcmVxdWlyZWQgZHVyYXRpb25zLCB3ZSBoYXZlIHNvbWUgY2hvaWNlczpcblxuICAgIC8vIDEuIEJlYXQgbWVsb2R5IGlzIGEgcXVhcnRlci4gVGhpcyBpcyB0aGUgZWFzaWVzdCBjYXNlLlxuICAgIC8vIEhlcmUgd2UgY2FuIGF0IHRoZSBtb3N0IHVzZSBhIDh0aC84dGggTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC5cbiAgICAvLyBUaG91Z2gsIHRlbnNpb24gaXMgYWRkZWQuXG5cbiAgICAvLyAyLiBDdXJyZW50IGJlYXQgbWVsb2R5IGlzIDh0aCBhbmQgOHRoLiBCb3RoIG5vdGVzIE1VU1QgYmUgY29ycmVjdC5cbiAgICAvLyBCYXNlIG9uIHRoZSBuZXh0IG5vdGUgd2UgY2FuIHVzZSBzb21lIE5BQ3MuIFRoaXMgaXMgd2hlcmUgdGhlIHdlYWsgYmVhdCBOQUNzIGNvbWUgaW4uXG5cbiAgICAvLyAzLiBDdXJyZW50IGJlYXQgbWVsb2R5IGlzIGEgaGFsZiBub3RlLiBXZSBjYW4gdXNlIGEgc3Ryb25nIGJlYXQgTkFDLlxuICAgIC8vIFRlbnNpb24gaXMgYWRkZWQuXG5cbiAgICAvLyBIYXJkZXIgY2FzZXMsIHN1Y2ggYXMgc3luY29wYXRpb24sIGFyZSBub3QgaGFuZGxlZC4geWV0LlxuXG4gICAgbGV0IHBhcnQxTWF4R1RvbmUgPSBNYXRoLm1heCh0b0dsb2JhbFNlbWl0b25lc1sxXSwgcHJldlBhcnQxUmljaE5vdGUgPyBnbG9iYWxTZW1pdG9uZShwcmV2UGFydDFSaWNoTm90ZS5ub3RlKSA6IDApO1xuXG4gICAgY29uc3QgbmFjUGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHtcbiAgICAgICAgZnJvbUdUb25lOiBmcm9tR2xvYmFsU2VtaXRvbmUgfHwgY2xvc2VzdENvcnJlY3RHVG9uZSxcbiAgICAgICAgdGhpc0JlYXRHVG9uZTogdG9HbG9iYWxTZW1pdG9uZSxcbiAgICAgICAgbmV4dEJlYXRHVG9uZTogbmV4dEJlYXRDb3JyZWN0R1RvbmUsXG4gICAgICAgIHNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgIGNob3JkOiBjaG9yZCxcbiAgICAgICAgZ1RvbmVMaW1pdHM6IFtwYXJ0MU1heEdUb25lLCAxMjddLCAgLy8gVE9ET1xuICAgICAgICB3YW50ZWRHVG9uZXM6IFtdLFxuICAgIH1cblxuICAgIGNvbnN0IGVlU3Ryb25nTW9kZSA9IChcbiAgICAgICAgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9uID09IEJFQVRfTEVOR1RIIHx8XG4gICAgICAgIChcbiAgICAgICAgICAgIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyICYmIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSAmJlxuICAgICAgICAgICAgY2xvc2VzdENvcnJlY3RHVG9uZSAhPSB0b0dsb2JhbFNlbWl0b25lXG4gICAgICAgIClcbiAgICApXG5cbiAgICBpZiAoZWVTdHJvbmdNb2RlKSB7XG4gICAgICAgIGlmIChjbG9zZXN0Q29ycmVjdEdUb25lID09IHRvR2xvYmFsU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGNvcnJlY3Qgbm90ZS4gTm8gdGVuc2lvbi5cbiAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiQ29ycmVjdCBxdWFydGVyIG5vdGVcIjtcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkZCBhIHJpZ2h0IE5BQyBvbiB0aGUgc3Ryb25nIGJlYXQuXG4gICAgICAgIG5hY1BhcmFtcy53YW50ZWRHVG9uZXNbMF0gPSBjbG9zZXN0Q29ycmVjdEdUb25lO1xuICAgICAgICBpZiAobmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9uID09IEJFQVRfTEVOR1RIIC8gMikge1xuICAgICAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1sxXSA9IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZSAhPSBuZXh0Q29ycmVjdEd0b25lKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYEluQ29ycmVjdCA4dGgvOHRoIG5vdGUsICR7Z1RvbmVTdHJpbmcodG9HbG9iYWxTZW1pdG9uZSl9ICE9ICR7Z1RvbmVTdHJpbmcobmV4dENvcnJlY3RHdG9uZSl9YDtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5hY1BhcmFtcy5zcGxpdE1vZGUgPSBcIkVFXCJcbiAgICAgICAgY29uc3QgbmFjID0gZmluZE5BQ3MobmFjUGFyYW1zIGFzIEZpbmROb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICBpZiAoIW5hYykge1xuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYE5vIE5BQyBmb3VuZDogd2FudGVkVG9uZXM6ICR7KG5hY1BhcmFtcy53YW50ZWRHVG9uZXMgYXMgbnVtYmVyW10pLm1hcCh0b25lID0+IGdUb25lU3RyaW5nKHRvbmUpKX1gICsgYCR7Z1RvbmVTdHJpbmcobmFjUGFyYW1zLnRoaXNCZWF0R1RvbmUpfSwgJHtnVG9uZVN0cmluZyhuZXh0Q29ycmVjdEd0b25lKX0sICR7Z1RvbmVTdHJpbmcobmFjUGFyYW1zLm5leHRCZWF0R1RvbmUpfWA7XG4gICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm90ZUdUb25lID0gZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpO1xuICAgICAgICAvLyBHcmVhdC4uLiBXZSBjYW4gYWRkIGEgY29ycmVjdCA4dGggb24gdGhlIHN0cm9uZyBiZWF0IVxuICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgLy8gdGVuc2lvbi5jb21tZW50ID0gYEFkZGluZyBOQUMgb24gc3Ryb25nIGJlYXQ6ICR7Z1RvbmVTdHJpbmcoZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpKX0gdG8gZGl2aXNpb24gJHtjdXJyZW50RGl2aXNpb259LCB3YW50ZWRHdG9uZXM6ICR7bmFjUGFyYW1zLndhbnRlZEdUb25lcy5tYXAoZ1RvbmVTdHJpbmcpfWA7XG4gICAgICAgIHRlbnNpb24ubmFjID0gbmFjO1xuICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gNTsgLy8gTm90IHRoYXQgZ3JlYXQsIGJ1dCBpdCdzIGJldHRlciB0aGFuIG5vdGhpbmcuXG4gICAgfSBlbHNlIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyICYmIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkZCBhIHJpZ2h0IE5BQyBvbiB0aGUgc3Ryb25nIGJlYXQuIGFuZCBhIHJpZ2h0IG5hYyBvbiB3ZWFrIGJlYXRcbiAgICAgICAgaWYgKGNsb3Nlc3RDb3JyZWN0R1RvbmUgPT0gdG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gU3Ryb25nIGJlYXQgaXMgYWxyZWFkeSBjb3JyZWN0LiBOZWVkIGEgbm90ZSBvbiB3ZWFrIGJlYXRcbiAgICAgICAgICAgIG5hY1BhcmFtcy53YW50ZWRHVG9uZXNbMV0gPSBuZXh0Q29ycmVjdEd0b25lO1xuICAgICAgICAgICAgbmFjUGFyYW1zLnNwbGl0TW9kZSA9IFwiRUVcIlxuICAgICAgICAgICAgY29uc3QgbmFjID0gZmluZE5BQ3MobmFjUGFyYW1zIGFzIEZpbmROb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgaWYgKCFuYWMpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIk5vIE5BQyBmb3VuZCBmb3IgcXVhcnRlciBub3RlXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld05vdGVHVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5hYy5ub3RlKTtcbiAgICAgICAgICAgIC8vIEdyZWF0Li4uIFdlIGNhbiBhZGQgYSBjb3JyZWN0IDh0aCBvbiB0aGUgc3Ryb25nIGJlYXQhXG4gICAgICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgICAgIC8vIHRlbnNpb24uY29tbWVudCA9IGBBZGRpbmcgd2VhayBFRSBOQUMgJHtnVG9uZVN0cmluZyhnbG9iYWxTZW1pdG9uZShuYWMubm90ZSkpfSB0byBkaXZpc2lvbiAke2N1cnJlbnREaXZpc2lvbn0sIHdhbnRlZEd0b25lczogJHtuYWNQYXJhbXMud2FudGVkR1RvbmVzLm1hcChnVG9uZVN0cmluZyl9YDtcbiAgICAgICAgICAgIHRlbnNpb24ubmFjID0gbmFjO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhYnNvbHV0ZWx5IHBlcmZlY3QsIGJvdGggbm90ZXMgYXJlIGNvcnJlY3QuIChubyB0ZW5zaW9uISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlbGwsIG5vIGNhbiBkbyB0aGVuIEkgZ3Vlc3MuXG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcImNsb3Nlc3RDb3JyZWN0R1RvbmUgIT0gdG9HbG9iYWxTZW1pdG9uZVwiO1xuICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uICs9IDEwMDtcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgJHtuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb259ICE9ICR7QkVBVF9MRU5HVEh9YDtcbiAgICB9XG4gICAgXG4gICAgdGVuc2lvbi50ZW5zaW9uID0gMDtcbiAgICByZXR1cm4gdGVuc2lvbjtcbn0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBUZW5zaW9uLCBUZW5zaW9uUGFyYW1zIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjb25zdCBnb29kU291bmRpbmdTY2FsZVRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcsXG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgYmVhdERpdmlzaW9uLFxuICAgICAgICB9ID0gdmFsdWVzO1xuICAgIFxuICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgIC8vIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgIH1cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZm9yIChsZXQgaT1iZWF0RGl2aXNpb247IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXMuZXZlcnkoQm9vbGVhbikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbU5vdGVzT3ZlcnJpZGUpIHtcbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gZnJvbU5vdGVzT3ZlcnJpZGU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGhlIGJhc3MsIGlzIGl0IGdvdW5kIHVwIG9yIGRvd24gYSBzY2FsZT9cblxuICAgIGlmIChwcmV2UGFzc2VkRnJvbU5vdGVzKSB7XG4gICAgICAgIGNvbnN0IHByZXZHbG9iYWxTZW1pdG9uZXMgPSBwcmV2UGFzc2VkRnJvbU5vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lcyA9IHBhc3NlZEZyb21Ob3Rlcy5tYXAobiA9PiBnbG9iYWxTZW1pdG9uZShuKSk7XG4gICAgICAgIGNvbnN0IGxhdGVzdEdsb2JhbFNlbWl0b25lcyA9IGxhdGVzdE5vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3Qgbm90ZXNCeVBhcnQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHBhc3NlZEZyb21Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbm90ZXNCeVBhcnRbaV0gPSBbdG9HbG9iYWxTZW1pdG9uZXNbaV1dO1xuICAgICAgICAgICAgaWYgKGxhdGVzdEdsb2JhbFNlbWl0b25lc1tpXSAmJiBsYXRlc3RHbG9iYWxTZW1pdG9uZXNbaV0gIT09IGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBub3Rlc0J5UGFydFtpXS5wdXNoKGxhdGVzdEdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub3Rlc0J5UGFydFtpXS5wdXNoKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgaWYgKHByZXZHbG9iYWxTZW1pdG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBub3Rlc0J5UGFydFtpXS5wdXNoKHByZXZHbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXJ0U2NhbGVJbmRleGVzID0gbm90ZXNCeVBhcnRbaV0ubWFwKG4gPT4gc2VtaXRvbmVTY2FsZUluZGV4W24gJSAxMl0pO1xuXG4gICAgICAgICAgICBsZXQgZ29pbmdVcE9yRG93bkFTY2FsZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHBhcnRTY2FsZUluZGV4ZXNbMF0gLSBwYXJ0U2NhbGVJbmRleGVzWzFdID09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydFNjYWxlSW5kZXhlc1sxXSAtIHBhcnRTY2FsZUluZGV4ZXNbMl0gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBMYXN0IDMgbm90ZXMgYXJlIGdvaW5nIHVwIGEgc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgZ29pbmdVcE9yRG93bkFTY2FsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnRTY2FsZUluZGV4ZXNbMF0gLSBwYXJ0U2NhbGVJbmRleGVzWzFdID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRTY2FsZUluZGV4ZXNbMV0gLSBwYXJ0U2NhbGVJbmRleGVzWzJdID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExhc3QgMyBub3RlcyBhcmUgZ29pbmcgZG93biBhIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGdvaW5nVXBPckRvd25BU2NhbGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGdvaW5nVXBPckRvd25BU2NhbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NjYWxlICs9IDM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5zb3ByYW5vU2NhbGUgKz0gMztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm90aGVyU2NhbGUgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVuc2lvbi5iYXNzU2NhbGUgPiAwICYmIHRlbnNpb24uc29wcmFub1NjYWxlID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzNdKSAlIDEyXG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNCB8fCBpbnRlcnZhbCA9PSA4KSB7XG4gICAgICAgICAgICAgICAgLy8gM3JkcyBhbmQgNnRocyBhcmUgZ29vZFxuICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NvcHJhbm9TY2FsZSArPSAzOyAgLy8gT3ZlcnJpZGUgYmFzcyBhbmQgc29wcmFubyBzYW1lIGRpcmVjdGlvbiBhbHNvXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRlbnNpb24ub3RoZXJTY2FsZSA+IDAgJiYgdGVuc2lvbi5zb3ByYW5vU2NhbGUgPiAwKSB7XG4gICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzJdKSAlIDEyXG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNCB8fCBpbnRlcnZhbCA9PSA4KSB7XG4gICAgICAgICAgICAgICAgLy8gM3JkcyBhbmQgNnRocyBhcmUgZ29vZFxuICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NvcHJhbm9TY2FsZSArPSAyOyAgLy8gU2FtZSB0aGluZyBmb3IgYWx0byBvciB0ZW5vciArIHNvcHJhbm9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1sxXSkgJSAxMlxuICAgICAgICAgICAgaWYgKGludGVydmFsID09IDQgfHwgaW50ZXJ2YWwgPT0gOCkge1xuICAgICAgICAgICAgICAgIC8vIDNyZHMgYW5kIDZ0aHMgYXJlIGdvb2RcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmJhc3NTb3ByYW5vU2NhbGUgKz0gMjsgIC8vIFNhbWUgdGhpbmcgZm9yIGFsdG8gb3IgdGVub3IgKyBzb3ByYW5vXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIEludmVyc2lvblJlc3VsdCA9IHtcbiAgICBnVG9uZURpZmZzOiBBcnJheTxBcnJheTxudW1iZXI+PixcbiAgICBub3Rlczoge1trZXk6IG51bWJlcl06IE5vdGV9LFxuICAgIHJhdGluZzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU6IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgU2ltcGxlSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgIG5vdGVzOiBBcnJheTxOb3RlPixcbiAgICByYXRpbmc6IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lOiBzdHJpbmcsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNpb25zID0gKHZhbHVlczoge1xuICAgICAgICBjaG9yZDogQ2hvcmQsIHByZXZOb3RlczogQXJyYXk8Tm90ZT4sIGJlYXQ6IG51bWJlciwgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICAgICAgbG9nZ2VyOiBMb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG51bWJlclxuICAgIH0pOiBBcnJheTxTaW1wbGVJbnZlcnNpb25SZXN1bHQ+ID0+IHtcbiAgICBjb25zdCB7Y2hvcmQsIHByZXZOb3RlcywgYmVhdCwgcGFyYW1zLCBsb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmd9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBOb3RlcyBpbiB0aGUgQ2hvcmQgdGhhdCBhcmUgY2xvc2VzdCB0byB0aGUgcHJldmlvdXMgbm90ZXNcbiAgICAvLyBGb3IgZWFjaCBwYXJ0XG5cbiAgICBjb25zdCB7c3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsIHNlbWl0b25lTGltaXRzfSA9IHN0YXJ0aW5nTm90ZXMocGFyYW1zKTtcblxuICAgIC8vIEFkZCBhIHJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBpbnZlcnNpb25cbiAgICBjb25zdCByZXQ6IEFycmF5PFNpbXBsZUludmVyc2lvblJlc3VsdD4gPSBbXTtcblxuICAgIGxldCBsYXN0QmVhdEdsb2JhbFNlbWl0b25lcyA9IFsuLi5zdGFydGluZ0dsb2JhbFNlbWl0b25lc11cbiAgICBpZiAocHJldk5vdGVzKSB7XG4gICAgICAgIGxhc3RCZWF0R2xvYmFsU2VtaXRvbmVzID0gcHJldk5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICB9XG5cbiAgICBpZiAoIWNob3JkKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAoY2hvcmQpIHtcbiAgICAgICAgLy8gRm9yIGVhY2ggYmVhdCwgd2UgdHJ5IHRvIGZpbmQgYSBnb29kIG1hdGNoaW5nIHNlbWl0b25lIGZvciBlYWNoIHBhcnQuXG5cbiAgICAgICAgLy8gUnVsZXM6XG4gICAgICAgIC8vIFdpdGhcdHJvb3QgcG9zaXRpb24gdHJpYWRzOiBkb3VibGUgdGhlIHJvb3QuIFxuXG4gICAgICAgIC8vIFdpdGggZmlyc3QgaW52ZXJzaW9uIHRyaWFkczogZG91YmxlIHRoZSByb290IG9yIDV0aCwgaW4gZ2VuZXJhbC4gSWYgb25lIG5lZWRzIHRvIGRvdWJsZSBcbiAgICAgICAgLy8gdGhlIDNyZCwgdGhhdCBpcyBhY2NlcHRhYmxlLCBidXQgYXZvaWQgZG91YmxpbmcgdGhlIGxlYWRpbmcgdG9uZS5cblxuICAgICAgICAvLyBXaXRoIHNlY29uZCBpbnZlcnNpb24gdHJpYWRzOiBkb3VibGUgdGhlIGZpZnRoLiBcblxuICAgICAgICAvLyBXaXRoICBzZXZlbnRoICBjaG9yZHM6ICB0aGVyZSAgaXMgIG9uZSB2b2ljZSAgZm9yICBlYWNoICBub3RlLCAgc28gIGRpc3RyaWJ1dGUgYXMgIGZpdHMuIElmICBvbmUgXG4gICAgICAgIC8vIG11c3Qgb21pdCBhIG5vdGUgZnJvbSB0aGUgY2hvcmQsIHRoZW4gb21pdCB0aGUgNXRoLlxuXG4gICAgICAgIGNvbnN0IGZpcnN0SW50ZXJ2YWwgPSBzZW1pdG9uZURpc3RhbmNlKGNob3JkLm5vdGVzWzBdLnNlbWl0b25lLCBjaG9yZC5ub3Rlc1sxXS5zZW1pdG9uZSlcbiAgICAgICAgY29uc3QgdGhpcmRJc0dvb2QgPSBmaXJzdEludGVydmFsID09IDMgfHwgZmlyc3RJbnRlcnZhbCA9PSA0O1xuICAgICAgICBsb2dnZXIubG9nKFwibm90ZXM6IFwiLCBjaG9yZC5ub3Rlcy5tYXAobiA9PiBuLnRvU3RyaW5nKCkpKTtcblxuICAgICAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGludmVyc2lvbiBhbmQgY2hvcmQgdHlwZSwgd2UncmUgZG9pbmcgZGlmZmVyZW50IHRoaW5nc1xuXG4gICAgICAgIGxldCBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJyb290LWZpZnRoXCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwiZmlyc3QtZmlmdGhcIiwgXCJzZWNvbmRcIl07XG4gICAgICAgIGxldCBjb21iaW5hdGlvbkNvdW50ID0gMyAqIDIgKiAxO1xuICAgICAgICBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZXMgPSBbXCJyb290XCIsIFwicm9vdC1yb290XCIsIFwicm9vdC10aGlyZFwiLCBcImZpcnN0XCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwic2Vjb25kXCIsIFwidGhpcmRcIiwgXCJ0aGlyZC1yb290XCIsIFwidGhpcmQtdGhpcmRcIl07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBza2lwRmlmdGhJbmRleCA9IDA7IHNraXBGaWZ0aEluZGV4IDwgMjsgc2tpcEZpZnRoSW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBpbnZlcnNpb25JbmRleD0wOyBpbnZlcnNpb25JbmRleDxpbnZlcnNpb25OYW1lcy5sZW5ndGg7IGludmVyc2lvbkluZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgY29tYmluYXRpb25JbmRleD0wOyBjb21iaW5hdGlvbkluZGV4PGNvbWJpbmF0aW9uQ291bnQ7IGNvbWJpbmF0aW9uSW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IHJhdGluZyA9IDA7XG4gICAgICAgICAgICBjb25zdCBza2lwRmlmdGggPSBza2lwRmlmdGhJbmRleCA9PSAxO1xuXG4gICAgICAgICAgICAvLyBXZSB0cnkgZWFjaCBpbnZlcnNpb24uIFdoaWNoIGlzIGJlc3Q/XG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb24gPSBpbnZlcnNpb25OYW1lc1tpbnZlcnNpb25JbmRleF07XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyA8IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIERvbid0IGRvIGFueXRoaW5nIGJ1dCByb290IHBvc2l0aW9uIG9uIHRoZSBsYXN0IGNob3JkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb25SZXN1bHQ6IEludmVyc2lvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZURpZmZzOiBbXSxcbiAgICAgICAgICAgICAgICBub3Rlczoge30sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiAwLFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc2tpcEZpZnRoKSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUgKz0gXCItc2tpcEZpZnRoXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArPSBcIi1cIiArIGNvbWJpbmF0aW9uSW5kZXg7XG5cbiAgICAgICAgICAgIGNvbnN0IGFkZFBhcnROb3RlID0gKHBhcnRJbmRleDogbnVtYmVyLCBub3RlOiBOb3RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBub3RlLnNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IDEgIC8vIGR1bW15XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlci5sb2coXCJpbnZlcnNpb246IFwiLCBpbnZlcnNpb24sIFwic2tpcEZpZnRoOiBcIiwgc2tpcEZpZnRoKTtcbiAgICAgICAgICAgIGxldCBwYXJ0VG9JbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBzZWxlY3QgYm90dG9tIG5vdGVcbiAgICAgICAgICAgIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnZmlyc3QnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgndGhpcmQnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGlzdCBub3RlcyB3ZSBoYXZlIGxlZnQgb3ZlclxuICAgICAgICAgICAgbGV0IGxlZnRPdmVySW5kZXhlczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb24gPT0gXCJyb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJyb290LWZpZnRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzEsIDIsIDJdOyAgLy8gRG91YmxlIHRoZSBmaWZ0aFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3Qtcm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcnN0IC0+IFdlIGFscmVhZHkgaGF2ZSAxXG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAwLCAyXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtdGhpcmRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMl07ICAvLyBEb3VibGUgdGhlIHRoaXJkXG4gICAgICAgICAgICAgICAgICAgIHJhdGluZyArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmQgLT4gV2UgYWxyZWFkeSBoYXZlIDJcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIExlYXZlIG91dCB0aGUgZmlmdGgsIHBvc3NpYmx5XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvbiA9PSBcInJvb3Qtcm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwicm9vdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFsxLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDNdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJ0aGlyZC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJ0aGlyZC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAxXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDIsIDNdLmZpbHRlcihpID0+IGkgIT0gcGFydFRvSW5kZXhbM10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNraXBGaWZ0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0VG9JbmRleFszXSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaW4gc2Vjb25kIGludmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDIpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaWYgd2UgaGF2ZSB0d29cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpICE9IDIpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBlaXRoZXIgYSAwIG9yIDEgdG8gcmVwbGFjZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICBpZiAobGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgPT0gMCkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZXBlbmRpbmcgb24gY29tYmluYXRpb25JbmRleCwgd2Ugc2VsZWN0IHRoZSBub3RlcyBmb3IgcGFydEluZGV4ZXMgMCwgMSwgMlxuICAgICAgICAgICAgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlyZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gRm91cnRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBGaWZ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgLy8gU2l4dGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgcGFydEluZGV4PTA7IHBhcnRJbmRleDw0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHBhcnQgaXMgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFBhcnROb3RlKHBhcnRJbmRleCwgY2hvcmQubm90ZXNbcGFydFRvSW5kZXhbcGFydEluZGV4XV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGFzdGx5LCB3ZSBzZWxlY3QgdGhlIGxvd2VzdCBwb3NzaWJsZSBvY3RhdmUgZm9yIGVhY2ggcGFydFxuICAgICAgICAgICAgbGV0IG1pblNlbWl0b25lID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0zOyBwYXJ0SW5kZXg+PTA7IHBhcnRJbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBnVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGk9MDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZ1RvbmUgPCBzZW1pdG9uZUxpbWl0c1twYXJ0SW5kZXhdWzBdIHx8IGdUb25lIDwgbWluU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUb28gbWFueSBpdGVyYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnVG9uZSArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IGludmVyc2lvbnJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBvY3RhdmUgY29tYmluYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0ME5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMF0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQxTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1sxXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDJOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzJdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0M05vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbM10pO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydDBPY3RhdmU9MDsgcGFydDBPY3RhdmU8MzsgcGFydDBPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQwTm90ZSA9IGluaXRpYWxQYXJ0ME5vdGUgKyBwYXJ0ME9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ME5vdGUgPiBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDFPY3RhdmU9MDsgcGFydDFPY3RhdmU8MzsgcGFydDFPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0MU5vdGUgPSBpbml0aWFsUGFydDFOb3RlICsgcGFydDFPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHBhcnQwTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHNlbWl0b25lTGltaXRzWzFdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0Mk9jdGF2ZT0wOyBwYXJ0Mk9jdGF2ZTwzOyBwYXJ0Mk9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0Mk5vdGUgPSBpbml0aWFsUGFydDJOb3RlICsgcGFydDJPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBwYXJ0MU5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBzZW1pdG9uZUxpbWl0c1syXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDNPY3RhdmU9MDsgcGFydDNPY3RhdmU8MzsgcGFydDNPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQzTm90ZSA9IGluaXRpYWxQYXJ0M05vdGUgKyBwYXJ0M09jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBwYXJ0Mk5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBzZW1pdG9uZUxpbWl0c1szXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0ME5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDBOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQxTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0MU5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDJOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQyTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0M05vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDNOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICsgYCAke3BhcnQwT2N0YXZlfSR7cGFydDFPY3RhdmV9JHtwYXJ0Mk9jdGF2ZX0ke3BhcnQzT2N0YXZlfWAgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQwTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQxTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQyTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQzTm90ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZzogcmF0aW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2dnZXIucHJpbnQoXCJuZXdWb2ljZUxlYWRpbmdOb3RlczogXCIsIGNob3JkLnRvU3RyaW5nKCksIFwiIGJlYXQ6IFwiLCBiZWF0KTtcblxuICAgIC8vIFJhbmRvbWl6ZSBvcmRlciBvZiByZXRcbiAgICBmb3IgKGxldCBpPTA7IGk8cmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZXQubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgdG1wID0gcmV0W2ldO1xuICAgICAgICByZXRbaV0gPSByZXRbal07XG4gICAgICAgIHJldFtqXSA9IHRtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuIiwiY29uc3QgcHJpbnRDaGlsZE1lc3NhZ2VzID0gKGNoaWxkTG9nZ2VyOiBMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkTG9nZ2VyLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uY2hpbGQudGl0bGUpO1xuICAgICAgICBwcmludENoaWxkTWVzc2FnZXMoY2hpbGQpO1xuICAgICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgY2hpbGQubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAgIHRpdGxlOiBhbnlbXSA9IFtdO1xuICAgIG1lc3NhZ2VzOiBBcnJheTxhbnlbXT4gPSBbXTtcbiAgICBwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBjaGlsZHJlbjogTG9nZ2VyW10gPSBbXTtcbiAgICBjbGVhcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2coLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKGFyZ3MpO1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIExldCBwYXJlbnQgaGFuZGxlIG1lXG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGFyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5hcmdzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi50aGlzLnRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSB0b3AgbG9nZ2VyLiBQcmludCBldmVyeXRoaW5nLlxuICAgICAgICBwcmludENoaWxkTWVzc2FnZXModGhpcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4udGhpcy5tZXNzYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbiA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhcmVkID0gdHJ1ZTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zLCBnZXRSaWNoTm90ZSwgZ2xvYmFsU2VtaXRvbmUsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIE5vbkNob3JkVG9uZSA9IHtcbiAgICBub3RlOiBOb3RlLFxuICAgIG5vdGUyPyA6IE5vdGUsICAvLyBUaGlzIG1ha2VzIHRoZSBub3RlcyAxNnRoc1xuICAgIHN0cm9uZ0JlYXQ6IGJvb2xlYW4sXG4gICAgcmVwbGFjZW1lbnQ/OiBib29sZWFuLFxufVxuXG5leHBvcnQgdHlwZSBOb25DaG9yZFRvbmVQYXJhbXMgPSB7XG4gICAgZ1RvbmUwOiBudW1iZXIgfCBudWxsLFxuICAgIGdUb25lMTogbnVtYmVyLFxuICAgIGdUb25lMjogbnVtYmVyLFxuICAgIHdhbnRlZFRvbmU/IDogbnVtYmVyLFxuICAgIHN0cm9uZ0JlYXQ/OiBib29sZWFuLFxuICAgIGNob3JkPyA6IENob3JkLFxuICAgIHNjYWxlOiBTY2FsZSxcbiAgICBnVG9uZUxpbWl0czogbnVtYmVyW10sXG59XG5cbnR5cGUgU3BsaXRNb2RlID0gXCJFRVwiIHwgXCJTU0VcIiB8IFwiRVNTXCIgfCBcIlNTU1NcIlxuXG5leHBvcnQgdHlwZSBGaW5kTm9uQ2hvcmRUb25lUGFyYW1zID0ge1xuICAgIGZyb21HVG9uZTogbnVtYmVyLFxuICAgIHRoaXNCZWF0R1RvbmU6IG51bWJlcixcbiAgICBuZXh0QmVhdEdUb25lOiBudW1iZXIsXG4gICAgc3BsaXRNb2RlOiBTcGxpdE1vZGUsXG4gICAgd2FudGVkR1RvbmVzOiBudW1iZXJbXSwgIC8vIFByb3ZpZGUgZ3RvbmVzIGZvciBlYWNoIHdhbnRlZCBpbmRleCBvZiBzcGxpdG1vZGVcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgZ1RvbmVMaW1pdHM6IG51bWJlcltdLFxuICAgIGNob3JkPzogQ2hvcmQsXG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZE5vdGVCZXR3ZWVuID0gKG5hYzogTm9uQ2hvcmRUb25lLCBkaXZpc2lvbjogbnVtYmVyLCBuZXh0RGl2aXNpb246IG51bWJlciwgcGFydEluZGV4OiBudW1iZXIsIGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3Rlcyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGRpdmlzaW9uRGlmZiA9IG5leHREaXZpc2lvbiAtIGRpdmlzaW9uO1xuICAgIGNvbnN0IGJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgIGlmICghYmVhdFJpY2hOb3RlIHx8ICFiZWF0UmljaE5vdGUubm90ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWVsZCB0byBhZGQgbm90ZSBiZXR3ZWVuXCIsIGRpdmlzaW9uLCBuZXh0RGl2aXNpb24sIHBhcnRJbmRleCwgZGl2aXNpb25lZE5vdGVzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld05vdGUgPSBuYWMubm90ZTtcbiAgICBjb25zdCBuZXdOb3RlMiA9IG5hYy5ub3RlMjtcbiAgICBjb25zdCBzdHJvbmdCZWF0ID0gbmFjLnN0cm9uZ0JlYXQ7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBuYWMucmVwbGFjZW1lbnQgfHwgZmFsc2U7XG5cbiAgICAvLyBJZiBzdHJvbmcgYmVhdCwgd2UgYWRkIG5ld05vdGUgQkVGT1JFIGJlYXRSaWNoTm90ZVxuICAgIC8vIE90aGVyd2lzZSB3ZSBhZGQgbmV3Tm90ZSBBRlRFUiBiZWF0UmljaE5vdGVcblxuICAgIGlmIChzdHJvbmdCZWF0KSB7XG4gICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBiZWF0UmljaE5vdGUub3JpZ2luYWxTY2FsZSxcbiAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgbmV3IHRvbmUgdG8gZGl2aXNpb25cbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgLy8gUmVtb3ZlIGJlYXRSaWNoTm90ZSBmcm9tIGRpdmlzaW9uXG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZpbHRlcihub3RlID0+IG5vdGUgIT0gYmVhdFJpY2hOb3RlKTtcbiAgICAgICAgaWYgKCFyZXBsYWNlbWVudCkge1xuICAgICAgICAgICAgLy8gQWRkIGJlYXRSaWNoTm90ZSB0byBkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2goYmVhdFJpY2hOb3RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFkZCBuZXcgdG9uZSBhbHNvIHRvIGRpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMlxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW5ld05vdGUyKSB7XG4gICAgICAgICAgICAvLyBhZGRpbmcgMSA4dGggbm90ZVxuICAgICAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZSA9IHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlOiBiZWF0UmljaE5vdGUub3JpZ2luYWxTY2FsZSxcbiAgICAgICAgICAgICAgICB0ZW5zaW9uOiBuZXcgVGVuc2lvbigpLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhZGRpbmcgMiAxNnRoIG5vdGVzXG4gICAgICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDQsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGJlYXRSaWNoTm90ZS5vcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAqIDAuNzVdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmICogMC43NV0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZTIgPSB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3Tm90ZTIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDQsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGJlYXRSaWNoTm90ZS5vcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgKiAwLjc1XS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuY29uc3QgcGFzc2luZ1RvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBSZXR1cm4gYSBuZXcgZ1RvbmUgb3IgbnVsbCwgYmFzZWQgb24gd2hldGhlciBhZGRpbmcgYSBwYXNzaW5nIHRvbmUgaXMgYSBnb29kIGlkZWEuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhnVG9uZTEgLSBnVG9uZTIpO1xuICAgIGlmIChkaXN0YW5jZSA8IDMgfHwgZGlzdGFuY2UgPiA0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZVRvbmVzID0gc2NhbGUubm90ZXMubWFwKG4gPT4gbi5zZW1pdG9uZSk7XG4gICAgZm9yIChsZXQgZ1RvbmU9Z1RvbmUxOyBnVG9uZSAhPSBnVG9uZTI7IGdUb25lICs9IChnVG9uZTEgPCBnVG9uZTIgPyAxIDogLTEpKSB7XG4gICAgICAgIGlmIChnVG9uZSA9PSBnVG9uZTEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gZ1RvbmUgJSAxMjtcbiAgICAgICAgaWYgKHNjYWxlVG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5jb25zdCBhY2NlbnRlZFBhc3NpbmdUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgLy8gU2FtZSBhcyBwYXNzaW5nIHRvbmUgYnV0IG9uIHN0cm9uZyBiZWF0XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoZ1RvbmUwIC0gZ1RvbmUxKTtcbiAgICBpZiAoZGlzdGFuY2UgPCAzIHx8IGRpc3RhbmNlID4gNCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVUb25lcyA9IHNjYWxlLm5vdGVzLm1hcChuID0+IG4uc2VtaXRvbmUpO1xuICAgIGZvciAobGV0IGdUb25lPWdUb25lMDsgZ1RvbmUgIT0gZ1RvbmUxOyBnVG9uZSArPSAoZ1RvbmUwIDwgZ1RvbmUxID8gMSA6IC0xKSkge1xuICAgICAgICBpZiAoZ1RvbmUgPT0gZ1RvbmUwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IGdUb25lICUgMTI7XG4gICAgICAgIGlmIChzY2FsZVRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgc3Ryb25nQmVhdDogdHJ1ZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5cbmNvbnN0IG5laWdoYm9yVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAsIHRoZW4gc3RlcCBiYWNrLiBUaGlzIGlzIG9uIFdlYWsgYmVhdFxuICAgIGlmIChnVG9uZTEgIT0gZ1RvbmUyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4KHNjYWxlKVtnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB1cE9yRG93bkNob2ljZXMgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gWzEsIC0xXSA6IFstMSwgMV07XG4gICAgZm9yIChjb25zdCB1cE9yRG93biBvZiB1cE9yRG93bkNob2ljZXMpIHtcbiAgICAgICAgY29uc3QgbmV3R3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgdXBPckRvd24sIHNjYWxlKTtcbiAgICAgICAgaWYgKCFuZXdHdG9uZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld0d0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgbmV3R3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogbmV3R3RvbmUgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihuZXdHdG9uZSAvIDEyKSxcbiAgICAgICAgfSksIHN0cm9uZ0JlYXQ6IGZhbHNlfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuY29uc3Qgc3VzcGVuc2lvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBET1dOIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdC5cbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTAgLSBnVG9uZTE7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgZG93bi5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7XG4gICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH1cbn1cblxuXG5jb25zdCByZXRhcmRhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBVUCBpbnRvIGNob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgdXAuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgZ1RvbmUxIHRvIGdUb25lMCBmb3IgdGhlIGxlbmd0aCBvZiB0aGUgc3VzcGVuc2lvbi5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTt9XG5cblxuY29uc3QgYXBwb2dpYXR1cmEgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBMZWFwLCB0aGVuIHN0ZXAgYmFjayBpbnRvIENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gLTE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXBwb2dpYXR1cmFcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCB1cCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBhcHBvZ2lhdHVyYVxuICAgICAgICB1cE9yRG93biA9IDE7XG4gICAgfVxuICAgIGNvbnN0IGdUb25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgaWYgKCFnVG9uZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O1xufVxuXG5jb25zdCBlc2NhcGVUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBhd2F5LCB0aGVuIExlYXAgaW4gdG8gbmV4dCBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB1cE9yRG93biA9IDE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIHVwIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCBkb3duIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICAgICAgdXBPckRvd24gPSAtMTtcbiAgICB9XG4gICAgY29uc3QgZ1RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMCwgdXBPckRvd24sIHNjYWxlKTtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07XG59XG5cbmNvbnN0IGFudGljaXBhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgb3IgbGVhcCBlYXJseSBpbiB0byBuZXh0IENob3JkIHRvbmUuIFRoaXMgaXMgb24gd2VhayBiZWF0LlxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUyIC0gZ1RvbmUxO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAxKSB7XG4gICAgICAgIC8vIFRvbyBjbG9zZSB0byBiZSBhbiBhbnRpY2lwYXRpb25cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gRWFzeS4gSnVzdCBtYWtlIGEgbmV3IG5vdGUgdGhhdHMgdGhlIHNhbWUgYXMgZ1RvbmUyLlxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUyICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTIgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IGZhbHNlfTtcbn1cblxuY29uc3QgbmVpZ2hib3JHcm91cCA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgYXdheSwgdGhlbiBsZWFwIGludG8gdGhlIFwib3RoZXIgcG9zc2libGVcIiBuZWlnaGJvciB0b25lLiBUaGlzIHVzZXMgMTZ0aHMgKHR3byBub3RlcykuXG4gICAgLy8gV2VhayBiZWF0XG4gICAgaWYgKGdUb25lMSAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHVwR3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgMSwgc2NhbGUpO1xuICAgIGNvbnN0IGRvd25HdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCAtMSwgc2NhbGUpO1xuICAgIGlmICghdXBHdG9uZSB8fCAhZG93bkd0b25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodXBHdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IHVwR3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGRvd25HdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGRvd25HdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogdXBHdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHVwR3RvbmUgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBub3RlMjogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IGRvd25HdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGRvd25HdG9uZSAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlXG4gICAgfTtcbn1cblxuXG5jb25zdCBwZWRhbFBvaW50ID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIG5vdGUgd2l0aCB0aGUgbm90ZSB0aGF0IGlzIGJlZm9yZSBpdCBBTkQgYWZ0ZXIgaXQuXG4gICAgaWYgKGdUb25lMCAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZTAgPT0gZ1RvbmUxKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gQWxyZWFkeSBleGlzdHNcbiAgICB9XG4gICAgaWYgKGdUb25lMSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lMSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlLCByZXBsYWNlbWVudDogdHJ1ZX07XG59XG5cblxuY29uc3QgY2hvcmROb3RlID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgLy8gSnVzdCB1c2UgYSBjaG9yZCB0b25lLiBXZWFrIE9SIHN0cm9uZyBiZWF0XG4gICAgY29uc3QgeyBnVG9uZTEsIGNob3JkIH0gPSB2YWx1ZXM7XG4gICAgbGV0IHN0cm9uZ0JlYXQgPSB2YWx1ZXMuc3Ryb25nQmVhdDtcbiAgICBpZiAoIXN0cm9uZ0JlYXQpIHtcbiAgICAgICAgc3Ryb25nQmVhdCA9IE1hdGgucmFuZG9tKCkgPiAwLjg7XG4gICAgfVxuICAgIGlmICghY2hvcmQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGxldCB3YW50ZWRUb25lID0gdmFsdWVzLndhbnRlZFRvbmU7XG4gICAgaWYgKCF3YW50ZWRUb25lKSB7XG4gICAgICAgIC8vIFJhbmRvbSBmcm9tIGNob3JkLm5vdGVzXG4gICAgICAgIGNvbnN0IG5vdGUgPSBjaG9yZC5ub3Rlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaG9yZC5ub3Rlcy5sZW5ndGgpXTtcbiAgICAgICAgd2FudGVkVG9uZSA9IG5vdGUuc2VtaXRvbmU7XG4gICAgICAgIC8vIFNlbGVjdCBjbG9zZXN0IG9jdGF2ZSB0byBnVG9uZTFcbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAoTWF0aC5hYnMod2FudGVkVG9uZSAtIGdUb25lMSkgPj0gNikge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSBpdGVyYXRpb25zXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2FudGVkVG9uZSArPSAxMjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgZ29vZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3Qgbm90ZSBvZiBjaG9yZC5ub3Rlcykge1xuICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSB3YW50ZWRUb25lICUgMTIpIHtcbiAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnb29kKSB7XG4gICAgICAgIC8vIFdhbnRlZFRvbmUgaXMgbm90IGEgY2hvcmQgdG9uZVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IHdhbnRlZFRvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHdhbnRlZFRvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHN0cm9uZ0JlYXR9O1xufVxuXG5jb25zdCB3ZWFrQmVhdENob3JkVG9uZSAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICByZXR1cm4gY2hvcmROb3RlKHtcbiAgICAgICAgLi4udmFsdWVzLFxuICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZSxcbiAgICB9KTtcbn1cblxuY29uc3Qgc3Ryb25nQmVhdENob3JkVG9uZSAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICByZXR1cm4gY2hvcmROb3RlKHtcbiAgICAgICAgLi4udmFsdWVzLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH0pXG59XG5cblxuZXhwb3J0IGNvbnN0IGZpbmROQUNzID0gKHZhbHVlczogRmluZE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtmcm9tR1RvbmUsIHRoaXNCZWF0R1RvbmUsIG5leHRCZWF0R1RvbmUsIHNwbGl0TW9kZSwgd2FudGVkR1RvbmVzLCBzY2FsZSwgZ1RvbmVMaW1pdHMsIGNob3JkfSA9IHZhbHVlcztcblxuICAgIGNvbnN0IHN0cm9uZ0JlYXRGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgJ3N0cm9uZ0JlYXRDaG9yZFRvbmUnOiBzdHJvbmdCZWF0Q2hvcmRUb25lLFxuICAgICAgICAnYXBwb2dpYXR1cmEnOiBhcHBvZ2lhdHVyYSxcbiAgICAgICAgJ2VzY2FwZVRvbmUnOiBlc2NhcGVUb25lLFxuICAgICAgICAncGVkYWxQb2ludCc6IHBlZGFsUG9pbnQsXG4gICAgICAgICdzdXNwZW5zaW9uJzogc3VzcGVuc2lvbixcbiAgICAgICAgJ3JldGFyZGF0aW9uJzogcmV0YXJkYXRpb24sXG4gICAgICAgICdhY2NlbnRlZFBhc3NpbmdUb25lJzogYWNjZW50ZWRQYXNzaW5nVG9uZSxcbiAgICB9XG5cbiAgICBjb25zdCB3ZWFrQmVhdEZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAnd2Vha0JlYXRDaG9yZFRvbmUnOiB3ZWFrQmVhdENob3JkVG9uZSxcbiAgICAgICAgJ2FudGljaXBhdGlvbic6IGFudGljaXBhdGlvbixcbiAgICAgICAgJ25laWdoYm9yR3JvdXAnOiBuZWlnaGJvckdyb3VwLFxuICAgICAgICAncGFzc2luZ1RvbmUnOiBwYXNzaW5nVG9uZSxcbiAgICB9XG5cbiAgICBpZiAoc3BsaXRNb2RlID09ICdFRScpIHtcbiAgICAgICAgLy8gVGhpcyBjYXNlIG9ubHkgaGFzIDIgY2hvaWNlczogc3Ryb25nIG9yIHdlYWsgYmVhdFxuICAgICAgICBsZXQgc3Ryb25nQmVhdCA9IGZhbHNlO1xuICAgICAgICAvLyBGaW5kIHRoZSB3YW50ZWQgbm90ZXNcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCBhIGNoYW5nZSBvbiBzdHJvbmcgYmVhdCBvciBvbiBzb21lIG90aGVyIGJlYXRcbiAgICAgICAgaWYgKHdhbnRlZEdUb25lc1swXSAmJiB3YW50ZWRHVG9uZXNbMF0gIT0gdGhpc0JlYXRHVG9uZSkge1xuICAgICAgICAgICAgc3Ryb25nQmVhdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cm9uZ0JlYXQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuY05hbWUgaW4gc3Ryb25nQmVhdEZ1bmNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IHN0cm9uZ0JlYXRGdW5jc1tmdW5jTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZnVuYyh7XG4gICAgICAgICAgICAgICAgICAgIGdUb25lMDogZnJvbUdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTE6IHRoaXNCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMjogbmV4dEJlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgd2FudGVkVG9uZTogd2FudGVkR1RvbmVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkLFxuICAgICAgICAgICAgICAgIH0gYXMgTm9uQ2hvcmRUb25lUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FudGVkR1RvbmVzWzBdIHx8IGdsb2JhbFNlbWl0b25lKHJlc3VsdC5ub3RlKSA9PSB3YW50ZWRHVG9uZXNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmNOYW1lIGluIHdlYWtCZWF0RnVuY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gd2Vha0JlYXRGdW5jc1tmdW5jTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZnVuYyh7XG4gICAgICAgICAgICAgICAgICAgIGdUb25lMDogZnJvbUdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTE6IHRoaXNCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMjogbmV4dEJlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgd2FudGVkVG9uZTogd2FudGVkR1RvbmVzWzFdLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkLFxuICAgICAgICAgICAgICAgIH0gYXMgTm9uQ2hvcmRUb25lUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FudGVkR1RvbmVzWzFdIHx8IGdsb2JhbFNlbWl0b25lKHJlc3VsdC5ub3RlKSA9PSB3YW50ZWRHVG9uZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuZXhwb3J0IGNvbnN0IGJ1aWxkVG9wTWVsb2R5ID0gKGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSA9PiB7XG4gICAgLy8gRm9sbG93IHRoZSBwcmUgZ2l2ZW4gbWVsb2R5IHJoeXRobVxuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9uczogeyBba2V5OiBudW1iZXJdOiBudW1iZXI7IH0gPSBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtcyk7XG5cbiAgICBjb25zdCBsYXN0RGl2aXNpb24gPSBCRUFUX0xFTkdUSCAqIG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcbiAgICBjb25zdCBmaXJzdFBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoMCk7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKGZpcnN0UGFyYW1zKTtcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBsYXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IGdUb25lTGltaXRzRm9yVGhpc0JlYXQgPSBbXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMF1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzFdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1syXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbM11dLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgY2FkZW5jZURpdmlzaW9uID0gZGl2aXNpb24gLSBwYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247XG4gICAgICAgIGNvbnN0IG5lZWRlZFJoeXRobSA9IHJoeXRobU5lZWRlZER1cmF0aW9uc1tjYWRlbmNlRGl2aXNpb25dIHx8IDEwMDtcblxuICAgICAgICBjb25zdCBsYXN0QmVhdEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA8IDJcbiAgICAgICAgaWYgKGxhc3RCZWF0SW5DYWRlbmNlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByZXZOb3RlczogTm90ZVtdID0gW107XG4gICAgICAgIGNvbnN0IHRoaXNOb3RlczogTm90ZVtdID0gW107XG4gICAgICAgIGNvbnN0IG5leHROb3RlczogTm90ZVtdID0gW107XG4gICAgICAgIGxldCBjdXJyZW50U2NhbGU6IFNjYWxlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gfHwgW10pIHtcbiAgICAgICAgICAgIGlmIChyaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIGlmIChyaWNoTm90ZS5zY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gfHwgW10pIHtcbiAgICAgICAgICAgIGlmIChyaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgbmV4dE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJyZW50U2NhbGUgPSBjdXJyZW50U2NhbGU7XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIC8vIENoYW5nZSBsaW1pdHMsIG5ldyBub3RlcyBtdXN0IGFsc28gYmUgYmV0d2VlZW4gdGhlIG90aGVyIHBhcnQgbm90ZXNcbiAgICAgICAgICAgIC8vICggT3ZlcmxhcHBpbmcgKVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uLCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZ1RvbmUxID0gZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBnVG9uZTIgPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBtaW5HVG9uZSA9IE1hdGgubWluKGdUb25lMSwgZ1RvbmUyKTtcbiAgICAgICAgICAgIGNvbnN0IG1heEdUb25lID0gTWF0aC5tYXgoZ1RvbmUxLCBnVG9uZTIpO1xuICAgICAgICAgICAgaWYgKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV0pIHtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgaGlnaGVyIHBhcnQsIGl0IGNhbid0IGdvIGxvd2VyIHRoYW4gbWF4R1RvbmVcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdWzBdID0gTWF0aC5tYXgoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXVswXSwgbWF4R1RvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgbG93ZXIgcGFydCwgaXQgY2FuJ3QgZ28gaGlnaGVyIHRoYW4gbWluR1RvbmVcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdWzFdID0gTWF0aC5taW4oZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXVsxXSwgbWluR1RvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIGlmIChuZWVkZWRSaHl0aG0gIT0gMiAqIEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gbmVlZCBmb3IgaGFsZiBub3Rlc1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIGEgdGllIHRvIHRoZSBuZXh0IG5vdGVcbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKSAhPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpY2hOb3RlLnRpZSA9IFwic3RhcnRcIjtcbiAgICAgICAgICAgIG5leHRSaWNoTm90ZS50aWUgPSBcInN0b3BcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICBpZiAobmVlZGVkUmh5dGhtICE9ICBCRUFUX0xFTkdUSCAvIDIpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBuZWVkIGZvciA4dGhzLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uLCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZS5zY2FsZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyBzY2FsZSBmb3IgcmljaE5vdGVcIiwgcmljaE5vdGUpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwcmV2UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uIC0gQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdUb25lMSA9IGdsb2JhbFNlbWl0b25lKHJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgY29uc3QgZ1RvbmUyID0gZ2xvYmFsU2VtaXRvbmUobmV4dFJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgbGV0IGdUb25lMCA9IHByZXZSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoZ1RvbmUwICYmIHByZXZSaWNoTm90ZSAmJiBwcmV2UmljaE5vdGUuZHVyYXRpb24gIT0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAvLyBGSVhNRTogcHJldlJpY2hOb3RlIGlzIG5vdCB0aGUgcHJldmlvdXMgbm90ZS4gV2UgY2Fubm90IHVzZSBpdCB0byBkZXRlcm1pbmUgdGhlIHByZXZpb3VzIG5vdGUuXG4gICAgICAgICAgICAgICAgZ1RvbmUwID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5hY1BhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZTAsXG4gICAgICAgICAgICAgICAgZ1RvbmUxLFxuICAgICAgICAgICAgICAgIGdUb25lMixcbiAgICAgICAgICAgICAgICBzY2FsZTogcmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHM6IGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4XSxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWQgOHRoIG5vdGVzIHRoaXMgYmVhdC5cblxuICAgICAgICAgICAgY29uc3Qgbm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3M6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7XG4gICAgICAgICAgICAgICAgYXBwb2dpYXR1cmE6ICgpID0+IGFwcG9naWF0dXJhKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgbmVpZ2hib3JHcm91cDogKCkgPT4gbmVpZ2hib3JHcm91cChuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHN1c3BlbnNpb246ICgpID0+IHN1c3BlbnNpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBlc2NhcGVUb25lOiAoKSA9PiBlc2NhcGVUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcGFzc2luZ1RvbmU6ICgpID0+IHBhc3NpbmdUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgbmVpZ2hib3JUb25lOiAoKSA9PiBuZWlnaGJvclRvbmUobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICByZXRhcmRhdGlvbjogKCkgPT4gcmV0YXJkYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBhbnRpY2lwYXRpb246ICgpID0+IGFudGljaXBhdGlvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHBlZGFsUG9pbnQ6ICgpID0+IHBlZGFsUG9pbnQobmFjUGFyYW1zKSxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICAgICAgbGV0IG5vbkNob3JkVG9uZSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB1c2VkQ2hvaWNlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRpb25zID4gMTAwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSBpdGVyYXRpb25zIGluIDh0aCBub3RlIGdlbmVyYXRpb25cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IG5vbkNob3JkVG9uZUNob2ljZXM6IHtba2V5OiBzdHJpbmddOiBOb25DaG9yZFRvbmV9ID0ge31cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhub25DaG9yZFRvbmVDaG9pY2VGdW5jcykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IHBhcmFtcy5ub25DaG9yZFRvbmVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGluZyB8fCAhc2V0dGluZy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2UgPSBub25DaG9yZFRvbmVDaG9pY2VGdW5jc1trZXldKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaG9pY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSA9IGNob2ljZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJ0SW5kZXggIT0gMykge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9uQ2hvcmRUb25lQ2hvaWNlcy5wZWRhbFBvaW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB1c2luZ0tleSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZhaWxhYmxlS2V5cyA9IE9iamVjdC5rZXlzKG5vbkNob3JkVG9uZUNob2ljZXMpLmZpbHRlcihrZXkgPT4gIXVzZWRDaG9pY2VzLmhhcyhrZXkpKTtcbiAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlS2V5cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG5vbkNob3JkVG9uZUNob2ljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZWRDaG9pY2VzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmUgPSBub25DaG9yZFRvbmVDaG9pY2VzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2luZ0tleSA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9uQ2hvcmRUb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBwb3NzaWJsZSBub24gY2hvcmQgdG9uZVxuICAgICAgICAgICAgICAgIC8vIE5vdyB3ZSBuZWVkIHRvIGNoZWNrIHZvaWNlIGxlYWRpbmcgZnJvbSBiZWZvcmUgYW5kIGFmdGVyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9uQ2hvcmRUb25lTm90ZXM6IE5vdGVbXSA9IFsuLi50aGlzTm90ZXNdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vbkNob3JkVG9uZS5zdHJvbmdCZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZU5vdGVzW3BhcnRJbmRleF0gPSBub25DaG9yZFRvbmUubm90ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblJlc3VsdCA9IG5ldyBUZW5zaW9uKCk7XG4gICAgICAgICAgICAgICAgZ2V0VGVuc2lvbih0ZW5zaW9uUmVzdWx0LCB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlOiBwcmV2Tm90ZXMsXG4gICAgICAgICAgICAgICAgICAgIGJlYXREaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgICAgIHRvTm90ZXM6IG5vbkNob3JkVG9uZU5vdGVzLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZTogY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgbWFpblBhcmFtczogbWFpblBhcmFtcyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGxldCB0ZW5zaW9uID0gMDtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uICs9IHRlbnNpb25SZXN1bHQuZG91YmxlTGVhZGluZ1RvbmU7XG4gICAgICAgICAgICAgICAgdGVuc2lvbiArPSB0ZW5zaW9uUmVzdWx0LnBhcmFsbGVsRmlmdGhzO1xuICAgICAgICAgICAgICAgIHRlbnNpb24gKz0gdGVuc2lvblJlc3VsdC5zcGFjaW5nRXJyb3I7XG4gICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZW5zaW9uIHRvbyBoaWdoIGZvciBub24gY2hvcmQgdG9uZVwiLCB0ZW5zaW9uLCBub25DaG9yZFRvbmUsIHRlbnNpb25SZXN1bHQsIHVzaW5nS2V5KTtcbiAgICAgICAgICAgICAgICB1c2VkQ2hvaWNlcy5hZGQodXNpbmdLZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhZGROb3RlQmV0d2Vlbihub25DaG9yZFRvbmUsIGRpdmlzaW9uLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgsIGRpdmlzaW9uZWROb3Rlcyk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgU2NhbGUsIFNjYWxlVGVtcGxhdGVzIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RIIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIE1haW5NdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZUNvdW50OiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VzOiBBcnJheTxNdXNpY1BhcmFtcz4gPSBbXTtcbiAgICB0ZXN0TW9kZT86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBtZWxvZHlSaHl0aG06IHN0cmluZyA9IFwiXCI7ICAvLyBoaWRkZW4gZnJvbSB1c2VyIGZvciBub3dcbiAgICBmb3JjZWRNZWxvZHk6IG51bWJlcltdID0gW107ICAvLyBoaWRkZW4gZnJvbSB1c2VyIGZvciBub3dcbiAgICBmb3JjZWRDaG9yZHM6IHN0cmluZyA9IFwiXCI7XG4gICAgZm9yY2VkT3JpZ2luYWxTY2FsZTogU2NhbGUgfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNYWluTXVzaWNQYXJhbXM+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSAocGFyYW1zIGFzIGFueSlba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLm1lbG9keVJoeXRobSA9IFwiUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVwiXG4gICAgICAgIC8vIHRoaXMubWVsb2R5Umh5dGhtID0gXCJFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVcIjtcbiAgICAgICAgLy8gZm9yIChsZXQgaT0wOyBpPDIwOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIC8vICAgICBpZiAocmFuZG9tIDwgMC4yKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJIXCI7XG4gICAgICAgIC8vICAgICAgICAgaSArPSAxO1xuICAgICAgICAvLyAgICAgfSBlbHNlIGlmIChyYW5kb20gPCAwLjcpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1lbG9keVJoeXRobSArPSBcIlFcIjtcbiAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJFRVwiO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMuZm9yY2VkTWVsb2R5ID0gWzAsIDEsIDIsIDMsIDMsIDMgXVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAxMiAzIDQxIDIgMzQgdHdvIGJhcnNcblxuICAgICAgICAvLyBEbyBSZSBNaSBGYSBTbyBMYSBUaSBEb1xuICAgICAgICAvLyB0aGlzLmZvcmNlZE1lbG9keSA9IFwiUlJSUlJSUlJSUlJSUlJSUlJSUlJcIjtcbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBbXG4gICAgICAgIC8vICAgICAwLFxuICAgICAgICAvLyAgICAgMSxcbiAgICAgICAgLy8gICAgIDIsXG4gICAgICAgIC8vICAgICAzLFxuICAgICAgICAvLyAgICAgNCxcbiAgICAgICAgLy8gICAgIDUsXG4gICAgICAgIC8vICAgICA0LFxuICAgICAgICAvLyAgICAgMyxcbiAgICAgICAgLy8gICAgIDIsXG4gICAgICAgIC8vICAgICAxLFxuICAgICAgICAvLyAgICAgMCxcbiAgICAgICAgLy8gXTtcbiAgICAgICAgLy8gbGV0IG1lbG9keSA9IFswXTtcbiAgICAgICAgLy8gZm9yIChsZXQgaT0wOyBpPDIwOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHVwT3JEb3duID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IC0xIDogMTtcbiAgICAgICAgLy8gICAgIGNvbnN0IHByZXZNZWxvZHkgPSBtZWxvZHlbbWVsb2R5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAvLyAgICAgbWVsb2R5LnB1c2gocHJldk1lbG9keSArICgxICogdXBPckRvd24pKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLmZvcmNlZE1lbG9keSA9IG1lbG9keS5tYXAobSA9PiAobSArIDcgKiAxMDApICUgNyk7XG5cbiAgICAgICAgLy8gRXhhbXBsZSBtZWxvZHlcbiAgICAgICAgLy8gQyBtYWogLSBDXG4gICAgICAgIC8vICAgICAgICAgRCBwdFxuICAgICAgICAvLyBDIG1haiAgIEVcbiAgICAgICAgLy8gICAgICAgICBGIHB0XG4gICAgICAgIC8vIEEgbWluICAgRyBwdFxuICAgICAgICAvLyAgICAgICAgIEFcbiAgICAgICAgLy8gQSBtaW4gICBCIHB0XG4gICAgICAgIC8vICAgICAgICAgQ1xuICAgICAgICAvLyBGIG1haiAgIEIgcHRcbiAgICAgICAgLy8gICAgICAgICBBXG4gICAgICAgIC8vIEYgbWFqICAgRyBwdFxuICAgICAgICAvLyAgICAgICAgIEZcbiAgICAgICAgLy8gRyBtYWogICBFIHB0XG4gICAgICAgIC8vICAgICAgICAgRFxuICAgICAgICAvLyBHIG1haiAgIEMgcHRcbiAgICAgICAgLy8gICAgICAgICBEXG4gICAgICAgIC8vIEMgbWFqICAgRVxuICAgICAgICAvLyAgICAgICAgIEYgcHRcbiAgICAgICAgLy8gQyBtYWogICBHXG4gICAgICAgIC8vICAgICAgICAgQSBwdFxuICAgICAgICAvLyB0aGlzLmZvcmNlZENob3JkcyA9IFwiMzYyNTE2NjYyXCJcbiAgICAgICAgdGhpcy5mb3JjZWRPcmlnaW5hbFNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiAwLCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3IgfSk7XG4gICAgfVxuXG4gICAgY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb246IG51bWJlcik6IE11c2ljUGFyYW1zIHtcbiAgICAgICAgY29uc3QgYmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG4gICAgICAgIGNvbnN0IGJhciA9IE1hdGguZmxvb3IoYmVhdCAvIHRoaXMuYmVhdHNQZXJCYXIpO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7ICAvLyBUaGUgYmVhdCB3ZSdyZSBhdCBpbiB0aGUgbG9vcFxuICAgICAgICBsZXQgYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjYWRlbmNlUGFyYW1zIG9mIHRoaXMuY2FkZW5jZXMpIHtcbiAgICAgICAgICAgIC8vIExvb3AgY2FkZW5jZXMgaW4gb3JkZXJzXG4gICAgICAgICAgICBjb3VudGVyICs9IGNhZGVuY2VQYXJhbXMuYmFyc1BlckNhZGVuY2U7XG4gICAgICAgICAgICBpZiAoW1wiUEFDXCIsIFwiSUFDXCJdLmluY2x1ZGVzKGNhZGVuY2VQYXJhbXMuc2VsZWN0ZWRDYWRlbmNlKSkge1xuICAgICAgICAgICAgICAgIGF1dGhlbnRpY0NhZGVuY2VTdGFydEJhciA9IGNvdW50ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmFyIDwgY291bnRlcikgeyAgLy8gV2UgaGF2ZSBwYXNzZWQgdGhlIGdpdmVuIGRpdmlzaW9uLiBUaGUgcHJldmlvdXMgY2FkZW5jZSBpcyB0aGUgb25lIHdlIHdhbnRcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kID0gY291bnRlciAqIHRoaXMuYmVhdHNQZXJCYXIgLSBiZWF0O1xuICAgICAgICAgICAgICAgIGlmIChbXCJQQUNcIiwgXCJJQUNcIl0uaW5jbHVkZXMoY2FkZW5jZVBhcmFtcy5zZWxlY3RlZENhZGVuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPSBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPSA5OTk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbFNvbmdFbmQgPSB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhciAtIGJlYXQ7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1BlckJhciA9IHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5jYWRlbmNlU3RhcnREaXZpc2lvbiA9ICgoY291bnRlciAtIGNhZGVuY2VQYXJhbXMuYmFyc1BlckNhZGVuY2UpICogdGhpcy5iZWF0c1BlckJhcikgKiBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uID0gYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyICogdGhpcy5iZWF0c1BlckJhciAqIEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWRlbmNlUGFyYW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzWzBdO1xuICAgIH1cblxuICAgIGdldE1heEJlYXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmJhcnNQZXJDYWRlbmNlLCAwKSAqIHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTXVzaWNQYXJhbXMge1xuICAgIGJlYXRzVW50aWxDYWRlbmNlRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzVW50aWxBdXRoZW50aWNDYWRlbmNlRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzVW50aWxTb25nRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzUGVyQmFyOiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VTdGFydERpdmlzaW9uOiBudW1iZXIgPSAwO1xuICAgIGF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgYmFzZVRlbnNpb24/OiBudW1iZXIgPSAwLjM7XG4gICAgYmFyc1BlckNhZGVuY2U6IG51bWJlciA9IDJcbiAgICB0ZW1wbz86IG51bWJlciA9IDMwO1xuICAgIGhhbGZOb3Rlcz86IGJvb2xlYW4gPSB0cnVlO1xuICAgIHNpeHRlZW50aE5vdGVzPzogbnVtYmVyID0gMC4yO1xuICAgIGVpZ2h0aE5vdGVzPzogbnVtYmVyID0gMC40O1xuICAgIG1vZHVsYXRpb25XZWlnaHQ/OiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdXZWlnaHQ/OiBudW1iZXIgPSAyO1xuICAgIHBhcnRzOiBBcnJheTx7XG4gICAgICAgIHZvaWNlOiBzdHJpbmcsXG4gICAgICAgIG5vdGU6IHN0cmluZyxcbiAgICAgICAgdm9sdW1lOiBudW1iZXIsXG4gICAgfT4gPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDFcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkM1XCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiAxMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDFcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkE0XCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiA3LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MlwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQzRcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZvaWNlOiBcIjQzXCIsXG4gICAgICAgICAgICAgICAgbm90ZTogXCJFM1wiLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogMTAsXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgYmVhdFNldHRpbmdzOiBBcnJheTx7XG4gICAgICAgIHRlbnNpb246IG51bWJlcixcbiAgICB9PiA9IFtdO1xuICAgIGNob3JkU2V0dGluZ3M6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgICAgIG1hajoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpbToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGltNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hajc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IC0xLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbTc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaW43OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgc2NhbGVTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXJcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgICAgICBtYWpvcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbm9yOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIHNlbGVjdGVkQ2FkZW5jZTogc3RyaW5nID0gXCJIQ1wiO1xuICAgIG5vbkNob3JkVG9uZXM6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgICAgIHBhc3NpbmdUb25lOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmVpZ2hib3JUb25lOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VzcGVuc2lvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJldGFyZGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXBwb2dpYXR1cmE6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlc2NhcGVUb25lOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW50aWNpcGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmVpZ2hib3JHcm91cDoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBlZGFsUG9pbnQ6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cblxuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBQYXJ0aWFsPE11c2ljUGFyYW1zPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gKHBhcmFtcyBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVCZWF0U2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCZWF0U2V0dGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IGJlYXRDb3VudCA9IHRoaXMuYmVhdHNQZXJCYXIgKiB0aGlzLmJhcnNQZXJDYWRlbmNlO1xuICAgICAgICBpZiAodGhpcy5iZWF0U2V0dGluZ3MubGVuZ3RoIDwgYmVhdENvdW50KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5iZWF0U2V0dGluZ3MubGVuZ3RoOyBpIDwgYmVhdENvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJlYXRTZXR0aW5ncy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGhpcy5iYXNlVGVuc2lvbiB8fCAwLjMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5iZWF0U2V0dGluZ3MubGVuZ3RoID4gYmVhdENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmJlYXRTZXR0aW5ncyA9IHRoaXMuYmVhdFNldHRpbmdzLnNsaWNlKDAsIGJlYXRDb3VudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBDaG9yZCwgY2hvcmRUZW1wbGF0ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgUmFuZG9tQ2hvcmRHZW5lcmF0b3Ige1xuICAgIHByaXZhdGUgY2hvcmRUeXBlczogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBhdmFpbGFibGVDaG9yZHM/OiBBcnJheTxzdHJpbmc+O1xuICAgIHByaXZhdGUgdXNlZENob3Jkcz86IFNldDxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBNdXNpY1BhcmFtcykge1xuICAgICAgICBjb25zdCBjaG9yZFR5cGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmRUeXBlIGluIHBhcmFtcy5jaG9yZFNldHRpbmdzKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmNob3JkU2V0dGluZ3NbY2hvcmRUeXBlXS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgY2hvcmRUeXBlcy5wdXNoKGNob3JkVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaG9yZFR5cGVzID0gY2hvcmRUeXBlcztcbiAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYnVpbGRBdmFpbGFibGVDaG9yZHMoKSB7XG4gICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMgPSAodGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgW10pLmZpbHRlcihjaG9yZCA9PiAhKHRoaXMudXNlZENob3JkcyB8fCBuZXcgU2V0KCkpLmhhcyhjaG9yZCkpO1xuICAgICAgICAvLyAvLyBGaXJzdCB0cnkgdG8gYWRkIHRoZSBzaW1wbGVzdCBjaG9yZHNcbiAgICAgICAgLy8gZm9yIChjb25zdCBzaW1wbGVDaG9yZFR5cGUgb2YgdGhpcy5jaG9yZFR5cGVzLmZpbHRlcihjaG9yZFR5cGUgPT4gW1wibWFqXCIsIFwibWluXCJdLmluY2x1ZGVzKGNob3JkVHlwZSkpKSB7XG4gICAgICAgIC8vICAgICBmb3IgKGxldCByYW5kb21Sb290PTA7IHJhbmRvbVJvb3Q8MTI7IHJhbmRvbVJvb3QrKykge1xuICAgICAgICAvLyAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKSkge1xuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3Jkcy5wdXNoKHJhbmRvbVJvb3QgKyBzaW1wbGVDaG9yZFR5cGUpO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGlmICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cblxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTAwOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0aGlzLmNob3JkVHlwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jaG9yZFR5cGVzLmxlbmd0aCldO1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tUm9vdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyKTtcbiAgICAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhyYW5kb21Sb290ICsgcmFuZG9tVHlwZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3Jkcy5wdXNoKHJhbmRvbVJvb3QgKyByYW5kb21UeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgY2xlYW5VcCgpIHtcbiAgICAgICAgaWYgKHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMgPSBbXTtcbiAgICAgICAgZGVsZXRlIHRoaXMudXNlZENob3JkcztcbiAgICAgICAgZGVsZXRlIHRoaXMuYXZhaWxhYmxlQ2hvcmRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDaG9yZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmF2YWlsYWJsZUNob3JkcyB8fCB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZUNob3JkcyAmJiB0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoIC0gMyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvcmRUeXBlID0gdGhpcy5hdmFpbGFibGVDaG9yZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoKV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhjaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMuYWRkKGNob3JkVHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3JkcyA9IHRoaXMuYXZhaWxhYmxlQ2hvcmRzLmZpbHRlcihjaG9yZCA9PiBjaG9yZCAhPT0gY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2hvcmQoY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IGFkZEZvcmNlZE1lbG9keSB9IGZyb20gXCIuL2ZvcmNlZG1lbG9keVwiO1xuaW1wb3J0IHsgTm9uQ2hvcmRUb25lIH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zLCBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjbGFzcyBUZW5zaW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7fVxuXG5cbmV4cG9ydCBjbGFzcyBUZW5zaW9uIHtcbiAgICBub3RJblNjYWxlOiBudW1iZXIgPSAwO1xuICAgIG1vZHVsYXRpb246IG51bWJlciA9IDA7XG4gICAgYWxsTm90ZXNTYW1lOiBudW1iZXIgPSAwO1xuICAgIGNob3JkUHJvZ3Jlc3Npb246IG51bWJlciA9IDA7XG4gICAga2VlcERvbWluYW50VG9uZXM6IG51bWJlciA9IDA7XG4gICAgcGFyYWxsZWxGaWZ0aHM6IG51bWJlciA9IDA7XG4gICAgc3BhY2luZ0Vycm9yOiBudW1iZXIgPSAwO1xuICAgIGNhZGVuY2U6IG51bWJlciA9IDA7XG4gICAgdGVuc2lvbmluZ0ludGVydmFsOiBudW1iZXIgPSAwO1xuICAgIHNlY29uZEludmVyc2lvbjogbnVtYmVyID0gMDtcbiAgICBkb3VibGVMZWFkaW5nVG9uZTogbnVtYmVyID0gMDtcbiAgICBsZWFkaW5nVG9uZVVwOiBudW1iZXIgPSAwO1xuICAgIG1lbG9keUp1bXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5VGFyZ2V0OiBudW1iZXIgPSAwO1xuICAgIHZvaWNlRGlyZWN0aW9uczogbnVtYmVyID0gMDtcbiAgICBvdmVybGFwcGluZzogbnVtYmVyID0gMDtcblxuICAgIHNldmVudGhUZW5zaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgaW52ZXJzaW9uVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGZvcmNlZE1lbG9keTogbnVtYmVyID0gMDtcbiAgICBuYWM/OiBOb25DaG9yZFRvbmU7XG5cbiAgICBiYXNzU2NhbGU6IG51bWJlciA9IDA7XG4gICAgc29wcmFub1NjYWxlOiBudW1iZXIgPSAwO1xuICAgIG90aGVyU2NhbGU6IG51bWJlciA9IDA7XG4gICAgYmFzc1NvcHJhbm9TY2FsZTogbnVtYmVyID0gMDtcblxuICAgIHRvdGFsVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGNvbW1lbnQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBnZXRUb3RhbFRlbnNpb24odmFsdWVzPzoge3BhcmFtczogTXVzaWNQYXJhbXMsIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2U6IG51bWJlcn0pIHtcbiAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubm90SW5TY2FsZSAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1vZHVsYXRpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5hbGxOb3Rlc1NhbWU7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5jaG9yZFByb2dyZXNzaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMua2VlcERvbWluYW50VG9uZXM7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5wYXJhbGxlbEZpZnRocyAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNwYWNpbmdFcnJvcjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNhZGVuY2U7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy50ZW5zaW9uaW5nSW50ZXJ2YWw7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5zZWNvbmRJbnZlcnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmxlYWRpbmdUb25lVXA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlUYXJnZXQ7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlKdW1wO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMudm9pY2VEaXJlY3Rpb25zO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMub3ZlcmxhcHBpbmc7XG5cbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmZvcmNlZE1lbG9keTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNldmVudGhUZW5zaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuaW52ZXJzaW9uVGVuc2lvbjtcblxuICAgICAgICB0ZW5zaW9uIC09IHRoaXMuYmFzc1NjYWxlO1xuICAgICAgICB0ZW5zaW9uIC09IHRoaXMuYmFzc1NvcHJhbm9TY2FsZTtcblxuICAgICAgICB0aGlzLnRvdGFsVGVuc2lvbiA9IHRlbnNpb247XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIHRvUHJpbnQoKSB7XG4gICAgICAgIGNvbnN0IHRvUHJpbnQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmIChgJHt0aGlzW2tleV19YCAhPSBcIjBcIiAmJiB0eXBlb2YgdGhpc1trZXldID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0b1ByaW50W2tleV0gPSAodGhpc1trZXldIGFzIHVua25vd24gYXMgbnVtYmVyKS50b0ZpeGVkKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b1ByaW50O1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHRvUHJpbnQgPSB0aGlzLnRvUHJpbnQoKTtcbiAgICAgICAgLy8gUHJpbnQgb25seSBwb3NpdGl2ZSB2YWx1ZXNcbiAgICAgICAgaWYgKHRoaXMuY29tbWVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb21tZW50LCAuLi5hcmdzLCB0b1ByaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MsIHRvUHJpbnQpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBXaXRoUHJveHlDYWxsYmFjayhvYmo6IGFueSwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogYW55IHtcbiAgICByZXR1cm4gbmV3IFByb3h5KG9iaiwge1xuICAgICAgZ2V0ICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKVxuICAgICAgICAvLyB3cmFwcyBuZXN0ZWQgZGF0YSB3aXRoIFByb3h5XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gd3JhcFdpdGhQcm94eUNhbGxiYWNrKHJlc3VsdCwgY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSxcbiAgICAgIHNldCAodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAvLyBjYWxscyBjYWxsYmFjayBvbiBldmVyeSBzZXQgb3BlcmF0aW9uXG4gICAgICAgIGNhbGxiYWNrKHRhcmdldCwga2V5LCB2YWx1ZSAvKiBhbmQgd2hhdGV2ZXIgZWxzZSB5b3UgbmVlZCAqLylcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVRlbnNpb24oKTogVGVuc2lvbiB7XG4gICAgcmV0dXJuIHdyYXBXaXRoUHJveHlDYWxsYmFjayhuZXcgVGVuc2lvbigpLCAodGFyZ2V0OiBUZW5zaW9uLCBrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LmdldFRvdGFsVGVuc2lvbigpID4gMjApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW5zaW9uRXJyb3IoXCJUZW5zaW9uIHRvbyBoaWdoXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCB0eXBlIFRlbnNpb25QYXJhbXMgPSB7XG4gICAgZGl2aXNpb25lZE5vdGVzPzogRGl2aXNpb25lZFJpY2hub3RlcyxcbiAgICBiZWF0RGl2aXNpb246IG51bWJlcixcbiAgICBmcm9tTm90ZXNPdmVycmlkZT86IEFycmF5PE5vdGU+LFxuICAgIHRvTm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIGN1cnJlbnRTY2FsZTogU2NhbGUsXG4gICAgb3JpZ2luYWxTY2FsZTogU2NhbGUsXG4gICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZT86IG51bWJlcixcbiAgICBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcyxcbiAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nPzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU/OiBzdHJpbmcsXG4gICAgcHJldkludmVyc2lvbk5hbWU/OiBTdHJpbmcsXG4gICAgbmV3Q2hvcmQ/OiBDaG9yZCxcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0VGVuc2lvbiA9ICh0ZW5zaW9uOiBUZW5zaW9uLCB2YWx1ZXM6IFRlbnNpb25QYXJhbXMpOiBUZW5zaW9uID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzLFxuICAgICAgICAgICAgZnJvbU5vdGVzT3ZlcnJpZGUsXG4gICAgICAgICAgICB0b05vdGVzLFxuICAgICAgICAgICAgbmV3Q2hvcmQsXG4gICAgICAgICAgICBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyxcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICBiZWF0RGl2aXNpb24sXG4gICAgICAgIH0gPSB2YWx1ZXM7XG4gICAgLypcbiAgICAqICAgR2V0IHRoZSB0ZW5zaW9uIGJldHdlZW4gdHdvIGNob3Jkc1xuICAgICogICBAcGFyYW0gZnJvbUNob3JkOiBDaG9yZFxuICAgICogICBAcGFyYW0gdG9DaG9yZDogQ2hvcmRcbiAgICAqICAgQHJldHVybjogdGVuc2lvbiB2YWx1ZSBiZXR3ZWVuIC0xIGFuZCAxXG4gICAgKi9cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZm9yIChsZXQgaT1iZWF0RGl2aXNpb247IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXMuZmlsdGVyKG5vdGUgPT4gbm90ZSkubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbU5vdGVzT3ZlcnJpZGUpIHtcbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gZnJvbU5vdGVzT3ZlcnJpZGU7XG4gICAgfVxuXG4gICAgbGV0IGFsbHNhbWUgPSB0cnVlO1xuICAgIGZvciAobGV0IGk9MDsgaTx0b05vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghcGFzc2VkRnJvbU5vdGVzW2ldKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZQYXNzZWRGcm9tTm90ZXNbaV0pIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFzc2VkRnJvbU5vdGVzW2ldLmVxdWFscyh0b05vdGVzW2ldKSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2UGFzc2VkRnJvbU5vdGVzW2ldLmVxdWFscyh0b05vdGVzW2ldKSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZXZDaG9yZCAmJiBwcmV2UHJldkNob3JkICYmIG5ld0Nob3JkICYmIHByZXZDaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkgJiYgcHJldlByZXZDaG9yZC50b1N0cmluZygpID09IHByZXZDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGFsbHNhbWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoYWxsc2FtZSkge1xuICAgICAgICB0ZW5zaW9uLmFsbE5vdGVzU2FtZSA9IDEwMDtcbiAgICB9XG5cbiAgICBsZXQgZnJvbU5vdGVzO1xuICAgIGlmIChwYXNzZWRGcm9tTm90ZXMubGVuZ3RoIDwgNCkge1xuICAgICAgICBmcm9tTm90ZXMgPSB0b05vdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHBhc3NlZEZyb21Ob3RlcztcbiAgICB9XG5cbiAgICBjb25zdCB0b1NlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lcyA9IGZyb21Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG4gICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcblxuICAgIC8vIElmIHRoZSBub3RlcyBhcmUgbm90IGluIHRoZSBjdXJyZW50IHNjYWxlLCBpbmNyZWFzZSB0aGUgdGVuc2lvblxuICAgIGxldCBub3Rlc05vdEluU2NhbGU6IEFycmF5PG51bWJlcj4gPSBbXVxuICAgIGxldCBuZXdTY2FsZTogTnVsbGFibGU8U2NhbGU+ID0gbnVsbDtcbiAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChjdXJyZW50U2NhbGUua2V5IC0gMSArIDI0KSAlIDEyXG5cbiAgICBpZiAoY3VycmVudFNjYWxlKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlU2VtaXRvbmVzID0gY3VycmVudFNjYWxlLm5vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgICAgICBub3Rlc05vdEluU2NhbGUgPSB0b1NlbWl0b25lcy5maWx0ZXIoc2VtaXRvbmUgPT4gIXNjYWxlU2VtaXRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSk7XG4gICAgICAgIG5vdGVzTm90SW5TY2FsZSA9IG5vdGVzTm90SW5TY2FsZS5maWx0ZXIoc2VtaXRvbmUgPT4gc2VtaXRvbmUgIT0gbGVhZGluZ1RvbmUpO1xuICAgICAgICBpZiAobm90ZXNOb3RJblNjYWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFF1aWNrIHJldHVybiwgdGhpcyBjaG9yZCBzdWNrc1xuICAgICAgICAgICAgdGVuc2lvbi5ub3RJblNjYWxlICs9IDEwMFxuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgdG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tqXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAyKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMC41O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSA2KSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMS41O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGludmVyc2lvbk5hbWUgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSB8fCAocHJldkludmVyc2lvbk5hbWUgfHwgXCJcIikuc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZnJvbVNlbWl0b25lIC0gdG9TZW1pdG9uZSkgPiAyKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5zZWNvbmRJbnZlcnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgndGhpcmQnKSB8fCAocHJldkludmVyc2lvbk5hbWUgfHwgXCJcIikuc3RhcnRzV2l0aCgndGhpcmQnKSkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhmcm9tU2VtaXRvbmUgLSB0b1NlbWl0b25lKSA+IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNlY29uZEludmVyc2lvbiArPSAxMDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uIC09IDAuMTsgIC8vIFJvb3QgaW52ZXJzaW9ucyBhcmUgZ3JlYXRcbiAgICB9XG5cbiAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLCAgLy8gQ1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLCAgLy8gRlxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LCAgLy8gSFxuICAgICAgICAvLyBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICB9XG5cbiAgICBjb25zdCBsZWFkaW5nVG9uZVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lICsgMTE7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZSAlIDEyID09IGxlYWRpbmdUb25lU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSA9PSBmcm9tR2xvYmFsU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBTdGF5aW5nIGF0IHRoZSBsZWFkaW5nIHRvbmUgaXMgbm90IGJhZFxuICAgICAgICAgICAgICAgIHRlbnNpb24ubGVhZGluZ1RvbmVVcCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmUgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwICs9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEgfHwgaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhcyBiYWRcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwIC09IDc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxlYWRpbmdUb25lQ291bnQgPSAwO1xuICAgIGZvciAoY29uc3QgdG9HbG9iYWxTZW1pdG9uZSBvZiB0b0dsb2JhbFNlbWl0b25lcykge1xuICAgICAgICBjb25zdCBzY2FsZUluZGV4OiBudW1iZXIgPSBzZW1pdG9uZVNjYWxlSW5kZXhbKHRvR2xvYmFsU2VtaXRvbmUgKyAxMikgJSAxMl07XG4gICAgICAgIGlmIChzY2FsZUluZGV4ID09IDYpIHtcbiAgICAgICAgICAgIGxlYWRpbmdUb25lQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobGVhZGluZ1RvbmVDb3VudCA+IDEpIHtcbiAgICAgICAgdGVuc2lvbi5kb3VibGVMZWFkaW5nVG9uZSArPSAxMDtcbiAgICB9XG5cbiAgICAvLyBkb21pbmFudCA3dGggY2hvcmQgc3R1ZmZcbiAgICBpZiAobmV3Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgIC8vIE5ldmVyIGRvdWJsZSB0aGUgN3RoXG4gICAgICAgIGNvbnN0IHNldmVudGhTZW1pdG9uZSA9IG5ld0Nob3JkLm5vdGVzWzNdLnNlbWl0b25lO1xuICAgICAgICBjb25zdCBzZXZlbnRoQ291bnQgPSB0b1NlbWl0b25lcy5maWx0ZXIoc2VtaXRvbmUgPT4gc2VtaXRvbmUgPT0gc2V2ZW50aFNlbWl0b25lKS5sZW5ndGg7XG4gICAgICAgIGlmIChzZXZlbnRoQ291bnQgPiAxKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLnNldmVudGhUZW5zaW9uICs9IDEwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmVzW2ldICUgMTIgPT0gc2V2ZW50aFNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSkgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDd0aCBpcyBhcHByb2FjaGVkIGJ5IGxlYXAhXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uc2V2ZW50aFRlbnNpb24gKz0gMTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgIGlmICghbmV3Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgICAgICAvLyA3dGggbXVzdCByZXNvbHZlIGRvd25cbiAgICAgICAgICAgIGNvbnN0IHNldmVudGhTZW1pdG9uZSA9IHByZXZDaG9yZC5ub3Rlc1szXS5zZW1pdG9uZTtcbiAgICAgICAgICAgIGNvbnN0IHNldmVudEdUb25lID0gZnJvbUdsb2JhbFNlbWl0b25lcy5maWx0ZXIoZ1RvbmUgPT4gZ1RvbmUgJSAxMiA9PSBzZXZlbnRoU2VtaXRvbmUpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFJlc29sdmVzVG8gPSBbc2V2ZW50R1RvbmUgLSAxLCBzZXZlbnRHVG9uZSAtIDJdO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFJlc29sdmVzVG9Db3VudCA9IHRvR2xvYmFsU2VtaXRvbmVzLmZpbHRlcihnVG9uZSA9PiBzZXZlbnRoUmVzb2x2ZXNUby5pbmNsdWRlcyhnVG9uZSkpLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChzZXZlbnRoUmVzb2x2ZXNUb0NvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNldmVudGhUZW5zaW9uICs9IDExO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZGlyZWN0aW9uc1xuICAgIGNvbnN0IGRpcmVjdGlvbkNvdW50cyA9IHtcbiAgICAgICAgXCJ1cFwiOiAwLFxuICAgICAgICBcImRvd25cIjogMCxcbiAgICAgICAgXCJzYW1lXCI6IDAsXG4gICAgfVxuICAgIGNvbnN0IHBhcnREaXJlY3Rpb24gPSBbXTtcbiAgICBsZXQgcm9vdEJhc3NEaXJlY3Rpb24gPSBudWxsO1xuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRvU2VtaXRvbmUgLSBmcm9tU2VtaXRvbmU7XG4gICAgICAgIHBhcnREaXJlY3Rpb25baV0gPSBkaWZmIDwgMCA/IFwiZG93blwiIDogZGlmZiA+IDAgPyBcInVwXCIgOiBcInNhbWVcIjtcbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMudXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLnNhbWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiAhPSAwICYmIChpbnZlcnNpb25OYW1lIHx8ICcnKS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIHJvb3RCYXNzRGlyZWN0aW9uID0gZGlmZiA+IDAgPyAndXAnIDogJ2Rvd24nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUm9vdCBiYXNzIG1ha2VzIHVwIGZvciBvbmUgdXAvZG93blxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcInVwXCIgJiYgZGlyZWN0aW9uQ291bnRzLmRvd24gPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duIC09IDE7XG4gICAgfVxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcImRvd25cIiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCAtPSAxO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLnVwID4gMiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMztcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbkNvdW50cy5kb3duID4gMiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPCAxKSB7XG4gICAgICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDM7XG4gICAgfVxuICAgIC8vIGlmIChwYXJ0RGlyZWN0aW9uWzBdID09IHBhcnREaXJlY3Rpb25bM10gJiYgcGFydERpcmVjdGlvblswXSAhPSBcInNhbWVcIikge1xuICAgIC8vICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSA1O1xuICAgIC8vICAgICAvLyByb290IGFuZCBzb3ByYW5vcyBtb3ZpbmcgaW4gc2FtZSBkaXJlY3Rpb25cbiAgICAvLyB9XG5cbiAgICAvLyBQYXJhbGxlbCBtb3Rpb24gYW5kIGhpZGRlbiBmaWZ0aHNcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmVzW2ldID09IHRvR2xvYmFsU2VtaXRvbmVzW2ldICYmIGZyb21HbG9iYWxTZW1pdG9uZXNbal0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbal0pIHtcbiAgICAgICAgICAgICAgICAvLyBQYXJ0IGkgYW5kIGogYXJlIHN0YXlpbmcgc2FtZVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsRnJvbSA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8IDIwICYmIGludGVydmFsICUgMTIgPT0gNyB8fCBpbnRlcnZhbCAlIDEyID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBQb3NzaWJseSBhIHBhcmFsbGVsLCBjb250cmFyeSBvciBoaWRkZW4gZmlmdGgvb2N0YXZlXG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IGludGVydmFsRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLnBhcmFsbGVsRmlmdGhzICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHNvcHJhbm8tYmFzcyBpbnRlcnZhbCBpcyBoaWRkZW5cbiAgICAvLyBpLmUuIHBhcnRzIDAgYW5kIDMgYXJlIG1vdmluZyBpbiBzYW1lIGRpcmVjdGlvblxuICAgIC8vIEFuZCBwYXJ0IDAgaXMgbWFraW5nIGEganVtcFxuICAgIC8vIEFuZCB0aGUgcmVzdWx0aW5nIGludGVydmFsIGlzIGEgZmlmdGgvb2N0YXZlXG4gICAgY29uc3QgcGFydDBEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1swXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbMF07XG4gICAgY29uc3QgcGFydDNEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1szXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbM107XG4gICAgaWYgKE1hdGguYWJzKHBhcnQwRGlyZWN0aW9uKSA+IDIpIHtcbiAgICAgICAgLy8gVXBwZXIgcGFydCBpcyBtYWtpbmcgYSBqdW1wXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSkgJSAxMjtcbiAgICAgICAgaWYgKChpbnRlcnZhbCA9PSA3IHx8IGludGVydmFsID09IDApICYmIE1hdGguc2lnbihwYXJ0MERpcmVjdGlvbikgPT0gTWF0aC5zaWduKHBhcnQzRGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgLy8gU2FtZSBkaXJlY3Rpb24gYW5kIHJlc3VsdGluZyBpbnRlcnZhbCBpcyBhIGZpZnRoL29jdGF2ZVxuICAgICAgICAgICAgdGVuc2lvbi5wYXJhbGxlbEZpZnRocyArPSAxMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpPTA7IGk8MzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvSW50ZXJ2YWxXaXRoQmFzcyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pICUgMTI7XG4gICAgICAgIGNvbnN0IGZyb21JbnRlclZhbFdpdGhCYXNzID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbM10pICUgMTI7XG4gICAgICAgIGlmIChmcm9tSW50ZXJWYWxXaXRoQmFzcyA9PSA2KSB7XG4gICAgICAgICAgICBpZiAodG9JbnRlcnZhbFdpdGhCYXNzID09IDcpIHtcbiAgICAgICAgICAgICAgICAvLyBVbmVxdWFsIGZpZnRocyAoZGltaW5pc2hlZCA1dGggdG8gcGVyZmVjdCA1dGgpIHdpdGggYmFzc1xuICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTcGFjaW5nIGVycm9yc1xuICAgIGNvbnN0IHBhcnQwVG9QYXJ0MSA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMV0pO1xuICAgIGNvbnN0IHBhcnQxVG9QYXJ0MiA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzFdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMl0pO1xuICAgIGNvbnN0IHBhcnQyVG9QYXJ0MyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzJdIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pO1xuICAgIGlmIChwYXJ0MVRvUGFydDIgPiAxMiB8fCBwYXJ0MFRvUGFydDEgPiAxMiB8fCBwYXJ0MlRvUGFydDMgPiAoMTIgKyA3KSkge1xuICAgICAgICB0ZW5zaW9uLnNwYWNpbmdFcnJvciArPSA1O1xuICAgIH1cblxuICAgIC8vIE92ZXJsYXBwaW5nIGVycm9yXG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbG93ZXJGcm9tR1RvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2kgKyAxXTtcbiAgICAgICAgY29uc3QgbG93ZXJUb0dUb25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaSArIDFdO1xuICAgICAgICBjb25zdCB1cHBlckZyb21HVG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaSAtIDFdO1xuICAgICAgICBjb25zdCB1cHBlclRvR1RvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKHVwcGVyVG9HVG9uZSB8fCB1cHBlckZyb21HVG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmUgPiBNYXRoLm1pbih1cHBlclRvR1RvbmUgfHwgMCwgdXBwZXJGcm9tR1RvbmUgfHwgMCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlclRvR1RvbmUgfHwgbG93ZXJGcm9tR1RvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lIDwgTWF0aC5tYXgobG93ZXJUb0dUb25lIHx8IDAsIGxvd2VyRnJvbUdUb25lIHx8IDApKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5vdmVybGFwcGluZyArPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lbG9keSB0ZW5zaW9uXG4gICAgLy8gQXZvaWQganVtcHMgdGhhdCBhcmUgYXVnIG9yIDd0aCBvciBoaWdoZXJcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSAxMikge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDAuNTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSA1KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPiA3KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMTApIHsgIC8vIDd0aCA9PSAxMFxuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSA2IHx8IGludGVydmFsID09IDgpIC8vIHRyaXRvbmUgKGF1ZyA0dGgpIG9yIGF1ZyA1dGhcbiAgICAgICAge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDcpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDkpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHppZyB6YWdnaW5cblxuICAgIC8vIDAgcHJpaW1pXG4gICAgLy8gMSBwaWVuaSBzZWt1bnRpXG4gICAgLy8gMiBzdXVyaSBzZWt1bnRpXG4gICAgLy8gMyBwaWVuaSB0ZXJzc2lcbiAgICAvLyA0IHN1dXJpIHRlcnNzaVxuICAgIC8vIDUga3ZhcnR0aVxuICAgIC8vIDYgdHJpdG9udXNcbiAgICAvLyA3IGt2aW50dGlcbiAgICAvLyA4IHBpZW5pIHNla3N0aVxuICAgIC8vIDkgc3V1cmkgc2Vrc3RpXG4gICAgLy8gMTAgcGllbmkgc2VwdGltaVxuICAgIC8vIDExIHN1dXJpIHNlcHRpbWlcbiAgICAvLyAxMiBva3RhYXZpXG5cbiAgICAvLyBXYXMgdGhlcmUgYSBqdW1wIGJlZm9yZT9cbiAgICBpZiAobGF0ZXN0Tm90ZXMgJiYgbGF0ZXN0Tm90ZXMubGVuZ3RoID09IDQpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lcyA9IGxhdGVzdE5vdGVzLm1hcCgobikgPT4gZ2xvYmFsU2VtaXRvbmUobikpO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyhsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMykge1xuICAgICAgICAgICAgICAgIC8vIFRoZXJlIHdhcyBhIGp1bXAuIFdFIE1VU1QgR08gQkFDSyFcbiAgICAgICAgICAgICAgICAvLyBCYXNpY2FsbHkgdGhlIHRvR2xvYmFsU2VtaXRvbmUgbXVzdCBiZSBiZXR3ZWVuIHRoZSBwcmV2RnJvbUdsb2JhbFNlbWl0b25lIGFuZCB0aGUgZnJvbUdsb2JhbFNlbWl0b25lXG4gICAgICAgICAgICAgICAgLy8gVU5MRVNTIHdlJ3JlIG91dGxpbmluZyBhIHRyaWFkLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd291bGQgbWVhbiB0aGF0IGFmdGVyIGEgNHRoIHVwLCB3ZSBuZWVkIHRvIGdvIHVwIGFub3RoZXIgM3JkXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldkZyb21TZW1pdG9uZSA9IGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uTXVsdGlwbGllciA9IGZyb21TZW1pdG9uZSA+IHByZXZGcm9tU2VtaXRvbmUgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEludGVydmFsID0gZGlyZWN0aW9uTXVsdGlwbGllciAqICh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlub3IgM3JkIHVwLCB0aGVuIG1haiB0aGlyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWpvciAzcmQgdXAsIHRoZW4gbWlub3IgM3JkIHVwLiBUaGF0J3MgYSByb290IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIHBlcmZlY3QgNHRoIHVwLiBUaGF0J3MgYSBmaXJzdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtaW5vciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyZmVjdCA0dGggdXAsIHRoZW4gbWFqb3IgM3JkIHVwLiBUaGF0J3MgYSBzZWNvbmQgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEhpZ2hlciB0aGFuIHRoYXQsIG5vIHRyaWFkIGlzIHBvc3NpYmxlLlxuICAgICAgICAgICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSAoaSA9PSAwIHx8IGkgPT0gMykgPyAwLjIgOiAxO1xuICAgICAgICAgICAgICAgIGlmICgoZnJvbVNlbWl0b25lID49IHByZXZGcm9tU2VtaXRvbmUgJiYgdG9TZW1pdG9uZSA+PSBmcm9tU2VtaXRvbmUpIHx8IChmcm9tU2VtaXRvbmUgPD0gcHJldkZyb21TZW1pdG9uZSAmJiB0b1NlbWl0b25lIDw9IGZyb21TZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IGdvaW5mIGJhY2sgZG93bi91cC4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDAuNSAqIG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPD0gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDIgKiBtdWx0aXBsaWVyOyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDsgIC8vIFRlcnJpYmxlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIGRvd24vdXAuLi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja0ludGVydmFsID0gTWF0aC5hYnModG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYWNrSW50ZXJ2YWwgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIHRvbyBtdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjUgKiBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA8PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDIgKiBtdWx0aXBsaWVyOyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJldlBhc3NlZEZyb21HVG9uZXMgPSBwcmV2UGFzc2VkRnJvbU5vdGVzID8gcHJldlBhc3NlZEZyb21Ob3Rlcy5tYXAoKG4pID0+IGdsb2JhbFNlbWl0b25lKG4pKSA6IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8NDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBnVG9uZXNGb3JUaGlzUGFydCA9IFtdO1xuICAgICAgICAgICAgaWYgKHByZXZQYXNzZWRGcm9tR1RvbmVzW2ldKSB7XG4gICAgICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaChwcmV2UGFzc2VkRnJvbUdUb25lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgaWYgKGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV0gJiYgbGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldKSB7XG4gICAgICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaChsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdUb25lc0ZvclRoaXNQYXJ0LnB1c2godG9HbG9iYWxTZW1pdG9uZXNbaV0pO1xuXG4gICAgICAgICAgICBsZXQgZ2VuZXJhbERpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAvLyBHZXQgZGlyZWN0aW9ucyBiZWZvcmUgbGF0ZXN0IG5vdGVzXG4gICAgICAgICAgICAvLyBFLmcuIGlmIHRoZSBub3RlIHZhbHVlcyBoYXZlIGJlZW4gMCwgMSwgNCwgMFxuICAgICAgICAgICAgLy8gdGhlIGdlbmVyYWxEaXJlY3Rpb24gd291bGQgYmUgMSArIDQgPT0gNSwgd2hpY2ggbWVhbnMgdGhhdCBldmVuIHRob3VnaCB0aGVcbiAgICAgICAgICAgIC8vIGdsb2JhbCBkaXJlY3Rpb24gaXMgXCJzYW1lXCIsIHRoZSBnZW5lcmFsIGRpcmVjdGlvbiBpcyBcInVwXCJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAyOyBqKyspIHtcbiAgICAgICAgICAgICAgICBnZW5lcmFsRGlyZWN0aW9uICs9IGdUb25lc0ZvclRoaXNQYXJ0W2orMV0gLSBnVG9uZXNGb3JUaGlzUGFydFtqXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ2xvYmFsRGlyZWN0aW9uID0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMV0gLSBnVG9uZXNGb3JUaGlzUGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsRGlyZWN0aW9uID0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMV0gLSBnVG9uZXNGb3JUaGlzUGFydFtnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAyXTtcblxuICAgICAgICAgICAgaWYgKGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdICE9IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDJdICYmIGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdID09IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDNdKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8gdGhlIHNhbWUgbm90ZSBhcyBiZWZvcmUuIFRoYXQncyBiYWQuXG4gICAgICAgICAgICAgICAgLy8gWmlnIHphZ2dpbmdcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbmFsRGlyZWN0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbWl0b25lTGltaXQgPSBzdGFydGluZ05vdGVzKHBhcmFtcykuc2VtaXRvbmVMaW1pdHNbaV07XG5cbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Tm90ZSA9IHNlbWl0b25lTGltaXRbMV0gLSA0O1xuICAgICAgICAgICAgICAgIHRhcmdldE5vdGUgLT0gaSAqIDI7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldExvd05vdGUgPSBzZW1pdG9uZUxpbWl0WzBdICsgMTA7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TG93Tm90ZSArPSBpICogMjtcblxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXROb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRMb3dOb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uID0gcGFyYW1zLmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGRpdj1iZWF0RGl2aXNpb247IGRpdj5hdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvbjsgZGl2LS0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm90ZXMgPSAoZGl2aXNpb25lZE5vdGVzIHx8IHt9KVtkaXZdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByZXZOb3RlIG9mIG5vdGVzLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTZW1pdG9uZShwcmV2Tm90ZS5ub3RlKSA+PSB0YXJnZXROb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm90ZVJlYWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbFNlbWl0b25lKHByZXZOb3RlLm5vdGUpIDw9IHRhcmdldExvd05vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMb3dOb3RlUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Tm90ZVJlYWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJUYXJnZXQgbm90ZSByZWFjaGVkIFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0YXJnZXROb3RlKSA8PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRGlyZWN0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRhcmdldE5vdGUpIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGNsb3NlIHRvIHRoZSB0YXJnZXQgbm90ZSwgbGV0J3MgTk9UIGEgbG90IHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2VuZXJhbERpcmVjdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gZ2VuZXJhbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERpcmVjdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSBmaW5hbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxEaXJlY3Rpb24gPD0gMCAmJiBmaW5hbERpcmVjdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBnb2luIGRvd24sIG5vdCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAtMSAqIGdsb2JhbERpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRMb3dOb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIlRhcmdldCBsb3cgbm90ZSByZWFjaGVkIFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0YXJnZXRMb3dOb3RlKSA8PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyBkb3duXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdGFyZ2V0TG93Tm90ZSkgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY2xvc2UgdG8gdGhlIHRhcmdldCBub3RlLCBsZXQncyBOT1QgYSBsb3QgZG93blxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdlbmVyYWxEaXJlY3Rpb24gPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IC0xICogZ2VuZXJhbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAtMSAqIGZpbmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA+PSAwICYmIGZpbmFsRGlyZWN0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXROb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW4gdXAsIG5vdCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gZ2xvYmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW5zaW9uO1xufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNlbWl0b25lIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuXG5leHBvcnQgY29uc3QgQkVBVF9MRU5HVEggPSAxMjtcblxudHlwZSBQaWNrTnVsbGFibGU8VD4gPSB7XG4gICAgW1AgaW4ga2V5b2YgVCBhcyBudWxsIGV4dGVuZHMgVFtQXSA/IFAgOiBuZXZlcl06IFRbUF1cbn1cblxudHlwZSBQaWNrTm90TnVsbGFibGU8VD4gPSB7XG4gICAgW1AgaW4ga2V5b2YgVCBhcyBudWxsIGV4dGVuZHMgVFtQXSA/IG5ldmVyIDogUF06IFRbUF1cbn1cblxuZXhwb3J0IHR5cGUgT3B0aW9uYWxOdWxsYWJsZTxUPiA9IHtcbiAgICBbSyBpbiBrZXlvZiBQaWNrTnVsbGFibGU8VD5dPzogRXhjbHVkZTxUW0tdLCBudWxsPlxufSAmIHtcbiAgICAgICAgW0sgaW4ga2V5b2YgUGlja05vdE51bGxhYmxlPFQ+XTogVFtLXVxuICAgIH1cblxuXG5leHBvcnQgY29uc3Qgc2VtaXRvbmVEaXN0YW5jZSA9ICh0b25lMTogbnVtYmVyLCB0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gZGlzdGFuY2UgZnJvbSAwIHRvIDExIHNob3VsZCBiZSAxXG4gICAgLy8gMCAtIDExICsgMTIgPT4gMVxuICAgIC8vIDExIC0gMCArIDEyID0+IDIzID0+IDExXG5cbiAgICAvLyAwIC0gNiArIDEyID0+IDZcbiAgICAvLyA2IC0gMCArIDEyID0+IDE4ID0+IDZcblxuICAgIC8vIDAgKyA2IC0gMyArIDYgPSA2IC0gOSA9IC0zXG4gICAgLy8gNiArIDYgLSA5ICsgNiA9IDEyIC0gMTUgPSAwIC0gMyA9IC0zXG4gICAgLy8gMTEgKyA2IC0gMCArIDYgPSAxNyAtIDYgPSA1IC0gNiA9IC0xXG4gICAgLy8gMCArIDYgLSAxMSArIDYgPSA2IC0gMTcgPSA2IC0gNSA9IDFcblxuICAgIC8vICg2ICsgNikgJSAxMiA9IDBcbiAgICAvLyAoNSArIDYpICUgMTIgPSAxMVxuICAgIC8vIFJlc3VsdCA9IDExISEhIVxuXG4gICAgcmV0dXJuIE1hdGgubWluKFxuICAgICAgICBNYXRoLmFicyh0b25lMSAtIHRvbmUyKSxcbiAgICAgICAgTWF0aC5hYnMoKHRvbmUxICsgNikgJSAxMiAtICh0b25lMiArIDYpICUgMTIpXG4gICAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleCA9IChzY2FsZTogU2NhbGUpOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0+ICh7XG4gICAgW3NjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCxcbiAgICBbc2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLFxuICAgIFtzY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsXG4gICAgW3NjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMyxcbiAgICBbc2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LFxuICAgIFtzY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsXG4gICAgW3NjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNixcbn0pXG5cblxuZXhwb3J0IGNvbnN0IG5leHRHVG9uZUluU2NhbGUgPSAoZ1RvbmU6IFNlbWl0b25lLCBpbmRleERpZmY6IG51bWJlciwgc2NhbGU6IFNjYWxlKTogTnVsbGFibGU8bnVtYmVyPiA9PiB7XG4gICAgbGV0IGdUb25lMSA9IGdUb25lO1xuICAgIGNvbnN0IHNjYWxlSW5kZXhlcyA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlcbiAgICBsZXQgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIGdUb25lMSA9IGdUb25lICsgMTtcbiAgICAgICAgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgfVxuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSAtIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5ld1NjYWxlSW5kZXggPSAoc2NhbGVJbmRleCArIGluZGV4RGlmZikgJSA3O1xuICAgIGNvbnN0IG5ld1NlbWl0b25lID0gc2NhbGUubm90ZXNbbmV3U2NhbGVJbmRleF0uc2VtaXRvbmU7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBzZW1pdG9uZURpc3RhbmNlKGdUb25lMSAlIDEyLCBuZXdTZW1pdG9uZSk7XG4gICAgY29uc3QgbmV3R3RvbmUgPSBnVG9uZTEgKyAoZGlzdGFuY2UgKiAoaW5kZXhEaWZmID4gMCA/IDEgOiAtMSkpO1xuXG4gICAgcmV0dXJuIG5ld0d0b25lO1xufVxuXG5cbmV4cG9ydCBjb25zdCBzdGFydGluZ05vdGVzID0gKHBhcmFtczogTXVzaWNQYXJhbXMpID0+IHtcbiAgICBjb25zdCBwMU5vdGUgPSBwYXJhbXMucGFydHNbMF0ubm90ZSB8fCBcIkY0XCI7XG4gICAgY29uc3QgcDJOb3RlID0gcGFyYW1zLnBhcnRzWzFdLm5vdGUgfHwgXCJDNFwiO1xuICAgIGNvbnN0IHAzTm90ZSA9IHBhcmFtcy5wYXJ0c1syXS5ub3RlIHx8IFwiQTNcIjtcbiAgICBjb25zdCBwNE5vdGUgPSBwYXJhbXMucGFydHNbM10ubm90ZSB8fCBcIkMzXCI7XG5cbiAgICBjb25zdCBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyA9IFtcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDFOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAyTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwM05vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDROb3RlKSksXG4gICAgXVxuXG4gICAgY29uc3Qgc2VtaXRvbmVMaW1pdHMgPSBbXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1swXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMF0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzFdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1syXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbM10gKyAxMiAtIDVdLFxuICAgIF1cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyxcbiAgICAgICAgc2VtaXRvbmVMaW1pdHMsXG4gICAgfVxufVxuXG5cbmNvbnN0IG15U2VtaXRvbmVTdHJpbmdzOiB7W2tleTogbnVtYmVyXTogc3RyaW5nfSA9IHtcbiAgICAwOiBcIkNcIixcbiAgICAxOiBcIkMjXCIsXG4gICAgMjogXCJEXCIsXG4gICAgMzogXCJEI1wiLFxuICAgIDQ6IFwiRVwiLFxuICAgIDU6IFwiRlwiLFxuICAgIDY6IFwiRiNcIixcbiAgICA3OiBcIkdcIixcbiAgICA4OiBcIkcjXCIsXG4gICAgOTogXCJBXCIsXG4gICAgMTA6IFwiQSNcIixcbiAgICAxMTogXCJCXCIsXG59XG5cblxuZXhwb3J0IGNvbnN0IGdUb25lU3RyaW5nID0gKGdUb25lOiBudW1iZXIgfCBudWxsKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICB9XG4gICAgcmV0dXJuIGAke215U2VtaXRvbmVTdHJpbmdzW2dUb25lICUgMTJdfSR7TWF0aC5mbG9vcihnVG9uZSAvIDEyKX1gO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhcnJheU9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXk6IEFycmF5PGFueT4sIHNlbGVjdG9yOiBDYWxsYWJsZUZ1bmN0aW9uLCBkZXNjID0gZmFsc2UpIHtcbiAgICByZXR1cm4gWy4uLmFycmF5XS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSBzZWxlY3RvcihhKTtcbiAgICAgICAgYiA9IHNlbGVjdG9yKGIpO1xuXG4gICAgICAgIGlmIChhID09IGIpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gKGRlc2MgPyBhID4gYiA6IGEgPCBiKSA/IC0xIDogMTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRUZW1wbGF0ZXM6IHsgW2tleTogc3RyaW5nXTogQXJyYXk8bnVtYmVyPiB9ID0ge1xuICAgIG1hajogWzAsIDQsIDddLFxuICAgIG1pbjogWzAsIDMsIDddLFxuICAgIGRpbTogWzAsIDMsIDZdLFxuICAgIGRpbTc6IFswLCAzLCA2LCAxMF0sXG4gICAgYXVnOiBbMCwgNCwgOF0sXG4gICAgbWFqNzogWzAsIDQsIDcsIDExXSxcbiAgICBtaW43OiBbMCwgMywgNywgMTBdLFxuICAgIGRvbTc6IFswLCA0LCA3LCAxMF0sXG4gICAgc3VzMjogWzAsIDIsIDddLFxuICAgIHN1czQ6IFswLCA1LCA3XSxcbn1cblxuXG5leHBvcnQgY2xhc3MgQ2hvcmQge1xuICAgIHB1YmxpYyBub3RlczogQXJyYXk8Tm90ZT47XG4gICAgcHVibGljIHJvb3Q6IG51bWJlcjtcbiAgICBwdWJsaWMgY2hvcmRUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICAvLyBGaW5kIGNvcnJlY3QgU2VtaXRvbmUga2V5XG4gICAgICAgIGNvbnN0IHNlbWl0b25lS2V5cyA9IE9iamVjdC5rZXlzKFNlbWl0b25lKS5maWx0ZXIoa2V5ID0+IChTZW1pdG9uZSBhcyBhbnkpW2tleV0gYXMgbnVtYmVyID09PSB0aGlzLm5vdGVzWzBdLnNlbWl0b25lKTtcbiAgICAgICAgaWYgKHNlbWl0b25lS2V5cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm90ZXMubWFwKG5vdGUgPT4gbm90ZS50b1N0cmluZygpKS5qb2luKFwiLCBcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbWl0b25lS2V5ID0gc2VtaXRvbmVLZXlzLmZpbHRlcihrZXkgPT4ga2V5LmluZGV4T2YoJ2InKSA9PSAtMSAmJiBrZXkuaW5kZXhPZigncycpID09IC0xKVswXSB8fCBzZW1pdG9uZUtleXNbMF07XG4gICAgICAgIHNlbWl0b25lS2V5ID0gc2VtaXRvbmVLZXkucmVwbGFjZSgncycsICcjJyk7XG4gICAgICAgIHJldHVybiBzZW1pdG9uZUtleSArIHRoaXMuY2hvcmRUeXBlO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihzZW1pdG9uZU9yTmFtZTogbnVtYmVyIHwgc3RyaW5nLCBjaG9yZFR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgc2VtaXRvbmU7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VtaXRvbmVPck5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHNlbWl0b25lID0gc2VtaXRvbmVPck5hbWUubWF0Y2goL15cXGQrLyk7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gc2VtaXRvbmVPck5hbWUubWF0Y2goL15cXGQrKC4qKS8pO1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkludmFsaWQgY2hvcmQgbmFtZSBcIiArIHNlbWl0b25lT3JOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnNlZFR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBjaG9yZCBuYW1lIFwiICsgc2VtaXRvbmVPck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHBhcnNlSW50KHNlbWl0b25lWzBdKTtcbiAgICAgICAgICAgIGNob3JkVHlwZSA9IGNob3JkVHlwZSB8fCBwYXJzZWRUeXBlWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VtaXRvbmUgPSBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QgPSBwYXJzZUludChgJHtzZW1pdG9uZX1gKTtcbiAgICAgICAgdGhpcy5jaG9yZFR5cGUgPSBjaG9yZFR5cGUgfHwgXCI/XCI7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gY2hvcmRUZW1wbGF0ZXNbdGhpcy5jaG9yZFR5cGVdO1xuICAgICAgICBpZiAodGVtcGxhdGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVua25vd24gY2hvcmQgdHlwZTogXCIgKyBjaG9yZFR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBub3RlIG9mIHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGVzLnB1c2gobmV3IE5vdGUoeyBzZW1pdG9uZTogKHNlbWl0b25lICsgbm90ZSkgJSAxMiwgb2N0YXZlOiAxIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgdHlwZSBOdWxsYWJsZTxUPiA9IFQgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBNdXNpY1Jlc3VsdCA9IHtcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIHNjYWxlOiBTY2FsZSxcbn1cblxuZXhwb3J0IHR5cGUgUmljaE5vdGUgPSB7XG4gICAgbm90ZTogTm90ZSxcbiAgICBvcmlnaW5hbE5vdGU/OiBOb3RlLFxuICAgIGR1cmF0aW9uOiBudW1iZXIsXG4gICAgZnJlcT86IG51bWJlcixcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgcGFydEluZGV4OiBudW1iZXIsXG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIG9yaWdpbmFsU2NhbGU6IFNjYWxlLFxuICAgIGJlYW0/OiBzdHJpbmcsXG4gICAgdGllPzogc3RyaW5nLFxuICAgIHRlbnNpb246IFRlbnNpb24sXG4gICAgaW52ZXJzaW9uTmFtZT86IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgRGl2aXNpb25lZFJpY2hub3RlcyA9IHtcbiAgICBba2V5OiBudW1iZXJdOiBBcnJheTxSaWNoTm90ZT4sXG59XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxTZW1pdG9uZSA9IChub3RlOiBOb3RlKSA9PiB7XG4gICAgcmV0dXJuIG5vdGUuc2VtaXRvbmUgKyAoKG5vdGUub2N0YXZlKSAqIDEyKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldENsb3Nlc3RPY3RhdmUgPSAobm90ZTogTm90ZSwgdGFyZ2V0Tm90ZTogTnVsbGFibGU8Tm90ZT4gPSBudWxsLCB0YXJnZXRTZW1pdG9uZTogTnVsbGFibGU8bnVtYmVyPiA9IG51bGwpID0+IHtcbiAgICBsZXQgc2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZShub3RlKTtcbiAgICBpZiAoIXRhcmdldE5vdGUgJiYgIXRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRhcmdldCBub3RlIG9yIHNlbWl0b25lIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0YXJnZXRTZW1pdG9uZSA9IHRhcmdldFNlbWl0b25lIHx8IGdsb2JhbFNlbWl0b25lKHRhcmdldE5vdGUgYXMgTm90ZSk7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZTogXCIsIHNlbWl0b25lLCB0YXJnZXRTZW1pdG9uZSk7XG4gICAgLy8gVXNpbmcgbW9kdWxvIGhlcmUgLT4gLTcgJSAxMiA9IC03XG4gICAgLy8gLTEzICUgMTIgPSAtMVxuICAgIGlmIChzZW1pdG9uZSA9PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICByZXR1cm4gbm90ZS5vY3RhdmU7XG4gICAgfVxuICAgIGNvbnN0IGRlbHRhOiBudW1iZXIgPSB0YXJnZXRTZW1pdG9uZSA+IHNlbWl0b25lID8gMTIgOiAtMTI7XG4gICAgbGV0IHJldCA9IDA7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGNsZWFuT2N0YXZlID0gKG9jdGF2ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChvY3RhdmUsIDIpLCA2KTtcbiAgICB9XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZmluaXRlIGxvb3BcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VtaXRvbmUgKz0gZGVsdGE7XG4gICAgICAgIHJldCArPSBkZWx0YSAvIDEyOyAgLy8gSG93IG1hbnkgb2N0YXZlcyB3ZSBjaGFuZ2VkXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA+PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lIC0gMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA8PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lICsgMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlQ2lyY2xlOiB7IFtrZXk6IG51bWJlcl06IEFycmF5PG51bWJlcj4gfSA9IHt9XG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DXSA9IFtTZW1pdG9uZS5HLCBTZW1pdG9uZS5GXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR10gPSBbU2VtaXRvbmUuRCwgU2VtaXRvbmUuQ11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkRdID0gW1NlbWl0b25lLkEsIFNlbWl0b25lLkddXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BXSA9IFtTZW1pdG9uZS5FLCBTZW1pdG9uZS5EXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRV0gPSBbU2VtaXRvbmUuQiwgU2VtaXRvbmUuQV1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJdID0gW1NlbWl0b25lLkZzLCBTZW1pdG9uZS5FXVxuXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5GXSA9IFtTZW1pdG9uZS5DLCBTZW1pdG9uZS5CYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJiXSA9IFtTZW1pdG9uZS5GLCBTZW1pdG9uZS5FYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkViXSA9IFtTZW1pdG9uZS5CYiwgU2VtaXRvbmUuQWJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BYl0gPSBbU2VtaXRvbmUuRWIsIFNlbWl0b25lLkRiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRGJdID0gW1NlbWl0b25lLkFiLCBTZW1pdG9uZS5HYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkdiXSA9IFtTZW1pdG9uZS5EYiwgU2VtaXRvbmUuQ2JdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DYl0gPSBbU2VtaXRvbmUuR2IsIFNlbWl0b25lLkZiXVxuXG5cbmV4cG9ydCBjb25zdCBtYWpTY2FsZURpZmZlcmVuY2UgPSAoc2VtaXRvbmUxOiBudW1iZXIsIHNlbWl0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gR2l2ZW4gdHdvIG1ham9yIHNjYWxlcywgcmV0dXJuIGhvdyBjbG9zZWx5IHJlbGF0ZWQgdGhleSBhcmVcbiAgICAvLyAwID0gc2FtZSBzY2FsZVxuICAgIC8vIDEgPSBFLkcuIEMgYW5kIEYgb3IgQyBhbmQgR1xuICAgIGxldCBjdXJyZW50VmFsID0gbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmUxXTtcbiAgICBpZiAoc2VtaXRvbmUxID09IHNlbWl0b25lMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsLmluY2x1ZGVzKHNlbWl0b25lMikpIHtcbiAgICAgICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdDdXJyZW50VmFsID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbWl0b25lIG9mIGN1cnJlbnRWYWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3U2VtaXRvbmUgb2YgbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmVdKSB7XG4gICAgICAgICAgICAgICAgbmV3Q3VycmVudFZhbC5hZGQobmV3U2VtaXRvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRWYWwgPSBbLi4ubmV3Q3VycmVudFZhbF0gYXMgQXJyYXk8bnVtYmVyPjtcbiAgICB9XG4gICAgcmV0dXJuIDEyO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBkaXZpc2lvbjogbnVtYmVyLCBwYXJ0SW5kZXg6IG51bWJlcik6IFJpY2hOb3RlIHwgbnVsbCA9PiB7XG4gICAgaWYgKGRpdmlzaW9uIGluIGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSkge1xuICAgICAgICAgICAgaWYgKG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgY29uc3QgbWVsb2R5Umh5dGhtU3RyaW5nID0gbWFpblBhcmFtcy5tZWxvZHlSaHl0aG07XG4gICAgLy8gRmlndXJlIG91dCB3aGF0IG5lZWRzIHRvIGhhcHBlbiBlYWNoIGJlYXQgdG8gZ2V0IG91ciBtZWxvZHlcbiAgICBsZXQgcmh5dGhtRGl2aXNpb24gPSAwO1xuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9uczogeyBba2V5OiBudW1iZXJdOiBudW1iZXI7IH0gPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lbG9keVJoeXRobVN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByaHl0aG0gPSBtZWxvZHlSaHl0aG1TdHJpbmdbaV07XG4gICAgICAgIGlmIChyaHl0aG0gPT0gXCJXXCIpIHtcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAqIDQ7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAqIDQ7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiSFwiKSB7XG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIlFcIikge1xuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gTm90aGluZyB0byBkb1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIkVcIikge1xuICAgICAgICAgICAgLy8gVGhpcyBkaXZpc2lvbiBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gRWlnaHRoXG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggLyAyO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIlNcIikge1xuICAgICAgICAgICAgLy8gVGhpcyBkaXZpc2lvbiBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gU2l4dGVlbnRoXG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggLyA0O1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggLyA0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByaHl0aG1OZWVkZWREdXJhdGlvbnM7XG59XG5cblxuZXhwb3J0IHR5cGUgTWVsb2R5TmVlZGVkVG9uZSA9IHtcbiAgICBba2V5OiBudW1iZXJdOiB7XG4gICAgICAgIHRvbmU6IG51bWJlcixcbiAgICAgICAgZHVyYXRpb246IG51bWJlcixcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVsb2R5TmVlZGVkVG9uZXMobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKTogTWVsb2R5TmVlZGVkVG9uZSB7XG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zID0gZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zKG1haW5QYXJhbXMpO1xuICAgIGNvbnN0IGZvcmNlZE1lbG9keUFycmF5ID0gbWFpblBhcmFtcy5mb3JjZWRNZWxvZHkgfHwgXCJcIjtcbiAgICBjb25zdCByZXQ6IE1lbG9keU5lZWRlZFRvbmUgPSB7fTtcbiAgICAvLyBGaWd1cmUgb3V0IHdoYXQgbmVlZHMgdG8gaGFwcGVuIGVhY2ggYmVhdCB0byBnZXQgb3VyIG1lbG9keVxuICAgIGxldCBjb3VudGVyID0gLTE7XG4gICAgZm9yIChjb25zdCBkaXZpc2lvbiBpbiByaHl0aG1OZWVkZWREdXJhdGlvbnMpIHtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgICBjb25zdCBkaXZpc2lvbk51bSA9IHBhcnNlSW50KGRpdmlzaW9uKTtcbiAgICAgICAgcmV0W2RpdmlzaW9uTnVtXSA9IHtcbiAgICAgICAgICAgIFwiZHVyYXRpb25cIjogcmh5dGhtTmVlZGVkRHVyYXRpb25zW2RpdmlzaW9uTnVtXSxcbiAgICAgICAgICAgIFwidG9uZVwiOiBmb3JjZWRNZWxvZHlBcnJheVtjb3VudGVyXSxcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbWFrZU11c2ljLCBidWlsZFRhYmxlcywgbWFrZU1lbG9keSB9IGZyb20gXCIuL3NyYy9jaG9yZHNcIlxuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vc3JjL3BhcmFtc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMgfSBmcm9tIFwiLi9zcmMvdXRpbHNcIjtcblxuYnVpbGRUYWJsZXMoKVxuXG5zZWxmLm9ubWVzc2FnZSA9IChldmVudDogeyBkYXRhOiB7IHBhcmFtczogc3RyaW5nLCBuZXdNZWxvZHk6IHVuZGVmaW5lZCB8IGJvb2xlYW4sIGdpdmVVcDogdW5kZWZpbmVkIHwgYm9vbGVhbiB9IH0pID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCBtZXNzYWdlXCIsIGV2ZW50LmRhdGEpO1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBNYWluTXVzaWNQYXJhbXMoSlNPTi5wYXJzZShldmVudC5kYXRhLnBhcmFtcyB8fCBcInt9XCIpKTtcblxuICAgIGlmIChldmVudC5kYXRhLm5ld01lbG9keSkge1xuICAgICAgICBtYWtlTWVsb2R5KChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzKSl9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5kYXRhLmdpdmVVcCkge1xuICAgICAgICAoc2VsZiBhcyBhbnkpLmdpdmVVUCA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSAoY3VycmVudEJlYXQ6IG51bWJlciwgZGl2aXNpb25lZFJpY2hOb3RlczogRGl2aXNpb25lZFJpY2hub3RlcykgPT4ge1xuICAgICAgICBpZiAoKHNlbGYgYXMgYW55KS5naXZlVVApIHtcbiAgICAgICAgICAgIHJldHVybiBcImdpdmVVUFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGl2aXNpb25lZFJpY2hOb3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJpY2hOb3RlcyA9IGRpdmlzaW9uZWRSaWNoTm90ZXNbY3VycmVudEJlYXQgKiBCRUFUX0xFTkdUSF07XG4gICAgICAgIGlmIChjdXJyZW50QmVhdCAhPSBudWxsICYmIHJpY2hOb3RlcyAmJiByaWNoTm90ZXNbMF0gJiYgcmljaE5vdGVzWzBdLmNob3JkKSB7XG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmVhdCxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IHJpY2hOb3Rlc1swXS5jaG9yZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkaXZpc2lvbmVkUmljaE5vdGVzKSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1ha2VNdXNpYyhwYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2spLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSByZXN1bHQuZGl2aXNpb25lZE5vdGVzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGl2aXNpb25lZE5vdGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcyA9IGRpdmlzaW9uZWROb3RlcztcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkaXZpc2lvbmVkTm90ZXMpKX0pO1xuXG5cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZXJyb3I6IGVycn0pO1xuICAgIH0pO1xuXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9