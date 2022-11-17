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
    var _a, _b, _c, _d;
    // generate a progression
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
        if (beatsUntilLastChordInCadence == 1 && prevNotes) {
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
                        tensionResult.comment = melodyResult.comment;
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
                    else if (tensionResult.modulation < 100 && badChords.length < BAD_CHORD_LIMIT) {
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
        const cadenceDivision = division - params.cadenceStartDivision;
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
        this.melodyRhythm = "QQQQQQQQQQQQQQQQQQQQQQ";
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
        this.forcedMelody = [0, 1, 2, 0, 1, 2];
        //                   12 3 41 2 34 two bars
        // Do Re Mi Fa So La Ti Do
        // this.forcedMelody = "RRRRRRRRRRRRRRRRRRRR";
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
        for (const cadenceParams of this.cadences) {
            // Loop cadences in orders
            counter += cadenceParams.barsPerCadence;
            if (bar < counter) { // We have passed the given division. The previous cadence is the one we want
                cadenceParams.beatsUntilCadenceEnd = counter * this.beatsPerBar - beat;
                cadenceParams.beatsUntilSongEnd = this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar - beat;
                cadenceParams.beatsPerBar = this.beatsPerBar;
                cadenceParams.cadenceStartDivision = ((counter - cadenceParams.barsPerCadence) * this.beatsPerBar) * _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
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
        this.beatsUntilSongEnd = 0;
        this.beatsPerBar = 4;
        this.cadenceStartDivision = 0;
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
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


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
        if (beatsUntilLastChordInCadence > 4) {
            tension += this.melodyTarget;
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
        const latestDivision = beatDivision - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH;
        let tmp = [];
        for (const richNote of (divisionedNotes[latestDivision] || [])) {
            // Use original notes, not the ones that have been turned into NACs
            tmp[richNote.partIndex] = richNote.originalNote || richNote.note;
            prevChord = richNote.chord;
        }
        passedFromNotes = [...tmp].filter(Boolean);
        tmp = [];
        for (const richNote of (divisionedNotes[latestDivision - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH] || [])) {
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
    const fromGlobalSemitones = fromNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(note));
    const toGlobalSemitones = toNotes.map(note => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(note));
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
        const prevFromGlobalSemitones = latestNotes.map((n) => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(n));
        for (let i = 0; i < fromGlobalSemitones.length; i++) {
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
        for (let i = 0; i < toGlobalSemitones.length; i++) {
            const fromGlobalSemitone = fromGlobalSemitones[i];
            const toGlobalSemitone = toGlobalSemitones[i];
            let direction = toGlobalSemitone - fromGlobalSemitone;
            const baseNote = params.parts[i].note || "F4";
            const startingGlobalSemitone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note(baseNote));
            const semitoneLimit = [startingGlobalSemitone + -12, startingGlobalSemitone + 12];
            let targetNote = semitoneLimit[1] - 4;
            targetNote -= i * 2;
            let targetNoteReached = false;
            for (const division in (divisionedNotes || {})) {
                const notes = (divisionedNotes || {})[division];
                for (const prevNote of notes.filter(richNote => richNote.partIndex == i)) {
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(prevNote.note) == targetNote) {
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
        [startingGlobalSemitones[0] + -12, startingGlobalSemitones[0] + 12],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixxQkFBcUI7d0JBQ3JCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO29CQUVELEtB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O2lCQUN2QztnQkFDRCxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUN2RSxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFDRCxzREFBUyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ2hELE1BQU0sZUFBZSxHQUF3QixNQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3BFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzNDLE9BQU87U0FDVjtRQUNBLElBQVksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFHekYsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbXVzaWN0aGVvcnlqcy9kaXN0L211c2ljdGhlb3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9hdmFpbGFibGVzY2FsZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nob3JkcHJvZ3Jlc3Npb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nob3Jkcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZm9yY2VkbWVsb2R5LnRzIiwid2VicGFjazovLy8uL3NyYy9pbnZlcnNpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9teWxvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbm9uY2hvcmR0b25lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyYW1zLnRzIiwid2VicGFjazovLy8uL3NyYy9yYW5kb21jaG9yZHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbnNpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi93b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5NdXNpY1RoZW9yeSA9IHt9KSk7XG59KSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAvKipcclxuICAgICogTm90ZXMgc3RhcnRpbmcgYXQgQzAgLSB6ZXJvIGluZGV4IC0gMTIgdG90YWxcclxuICAgICogTWFwcyBub3RlIG5hbWVzIHRvIHNlbWl0b25lIHZhbHVlcyBzdGFydGluZyBhdCBDPTBcclxuICAgICogQGVudW1cclxuICAgICovXHJcbiAgIHZhciBTZW1pdG9uZTtcclxuICAgKGZ1bmN0aW9uIChTZW1pdG9uZSkge1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBXCJdID0gOV0gPSBcIkFcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQXNcIl0gPSAxMF0gPSBcIkFzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJiXCJdID0gMTBdID0gXCJCYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCXCJdID0gMTFdID0gXCJCXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJzXCJdID0gMF0gPSBcIkJzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNiXCJdID0gMTFdID0gXCJDYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDXCJdID0gMF0gPSBcIkNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ3NcIl0gPSAxXSA9IFwiQ3NcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRGJcIl0gPSAxXSA9IFwiRGJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRFwiXSA9IDJdID0gXCJEXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRzXCJdID0gM10gPSBcIkRzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkViXCJdID0gM10gPSBcIkViXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkVcIl0gPSA0XSA9IFwiRVwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFc1wiXSA9IDVdID0gXCJFc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGYlwiXSA9IDRdID0gXCJGYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGXCJdID0gNV0gPSBcIkZcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRnNcIl0gPSA2XSA9IFwiRnNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR2JcIl0gPSA2XSA9IFwiR2JcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR1wiXSA9IDddID0gXCJHXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdzXCJdID0gOF0gPSBcIkdzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFiXCJdID0gOF0gPSBcIkFiXCI7XHJcbiAgIH0pKFNlbWl0b25lIHx8IChTZW1pdG9uZSA9IHt9KSk7XHJcbiAgIC8qKlxyXG4gICAgKiBSZXR1cm5zIHRoZSB3aG9sZSBub3RlIG5hbWUgKGUuZy4gQywgRCwgRSwgRiwgRywgQSwgQikgZm9yXHJcbiAgICAqIHRoZSBnaXZlbiBzdHJpbmdcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBnZXRXaG9sZVRvbmVGcm9tTmFtZSA9IChuYW1lKSA9PiB7XHJcbiAgICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggPT09IDAgfHwgbmFtZS5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbmFtZVwiKTtcclxuICAgICAgIGNvbnN0IGtleSA9IG5hbWVbMF0udG9VcHBlckNhc2UoKTtcclxuICAgICAgIHJldHVybiBTZW1pdG9uZVtrZXldO1xyXG4gICB9O1xyXG4gICB2YXIgU2VtaXRvbmUkMSA9IFNlbWl0b25lO1xuXG4gICAvKipcclxuICAgICogV3JhcHMgYSBudW1iZXIgYmV0d2VlbiBhIG1pbiBhbmQgbWF4IHZhbHVlLlxyXG4gICAgKiBAcGFyYW0gdmFsdWUgLSB0aGUgbnVtYmVyIHRvIHdyYXBcclxuICAgICogQHBhcmFtIGxvd2VyICAtIHRoZSBsb3dlciBib3VuZFxyXG4gICAgKiBAcGFyYW0gdXBwZXIgLSB0aGUgdXBwZXIgYm91bmRcclxuICAgICogQHJldHVybnMgd3JhcHBlZE51bWJlciAtIHRoZSB3cmFwcGVkIG51bWJlclxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHdyYXAgPSAodmFsdWUsIGxvd2VyLCB1cHBlcikgPT4ge1xyXG4gICAgICAgLy8gY29waWVzXHJcbiAgICAgICBsZXQgdmFsID0gdmFsdWU7XHJcbiAgICAgICBsZXQgbGJvdW5kID0gbG93ZXI7XHJcbiAgICAgICBsZXQgdWJvdW5kID0gdXBwZXI7XHJcbiAgICAgICAvLyBpZiB0aGUgYm91bmRzIGFyZSBpbnZlcnRlZCwgc3dhcCB0aGVtIGhlcmVcclxuICAgICAgIGlmICh1cHBlciA8IGxvd2VyKSB7XHJcbiAgICAgICAgICAgbGJvdW5kID0gdXBwZXI7XHJcbiAgICAgICAgICAgdWJvdW5kID0gbG93ZXI7XHJcbiAgICAgICB9XHJcbiAgICAgICAvLyB0aGUgYW1vdW50IG5lZWRlZCB0byBtb3ZlIHRoZSByYW5nZSBhbmQgdmFsdWUgdG8gemVyb1xyXG4gICAgICAgY29uc3QgemVyb09mZnNldCA9IDAgLSBsYm91bmQ7XHJcbiAgICAgICAvLyBvZmZzZXQgdGhlIHZhbHVlcyBzbyB0aGF0IHRoZSBsb3dlciBib3VuZCBpcyB6ZXJvXHJcbiAgICAgICBsYm91bmQgKz0gemVyb09mZnNldDtcclxuICAgICAgIHVib3VuZCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgdmFsICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICAvLyBjb21wdXRlIHRoZSBudW1iZXIgb2YgdGltZXMgdGhlIHZhbHVlIHdpbGwgd3JhcFxyXG4gICAgICAgbGV0IHdyYXBzID0gTWF0aC50cnVuYyh2YWwgLyB1Ym91bmQpO1xyXG4gICAgICAgLy8gY2FzZTogLTEgLyB1Ym91bmQoPjApIHdpbGwgZXF1YWwgMCBhbHRob3VnaCBpdCB3cmFwcyBvbmNlXHJcbiAgICAgICBpZiAod3JhcHMgPT09IDAgJiYgdmFsIDwgbGJvdW5kKVxyXG4gICAgICAgICAgIHdyYXBzID0gLTE7XHJcbiAgICAgICAvLyBjYXNlOiB1Ym91bmQgYW5kIHZhbHVlIGFyZSB0aGUgc2FtZSB2YWwvdWJvdW5kID0gMSBidXQgYWN0dWFsbHkgZG9lc250IHdyYXBcclxuICAgICAgIGlmICh3cmFwcyA9PT0gMSAmJiB2YWwgPT09IHVib3VuZClcclxuICAgICAgICAgICB3cmFwcyA9IDA7XHJcbiAgICAgICAvLyBuZWVkZWQgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBudW0gb2Ygd3JhcHMgaXMgMCBvciAxIG9yIC0xXHJcbiAgICAgICBsZXQgdmFsT2Zmc2V0ID0gMDtcclxuICAgICAgIGxldCB3cmFwT2Zmc2V0ID0gMDtcclxuICAgICAgIGlmICh3cmFwcyA+PSAtMSAmJiB3cmFwcyA8PSAxKVxyXG4gICAgICAgICAgIHdyYXBPZmZzZXQgPSAxO1xyXG4gICAgICAgLy8gaWYgdGhlIHZhbHVlIGlzIGJlbG93IHRoZSByYW5nZVxyXG4gICAgICAgaWYgKHZhbCA8IGxib3VuZCkge1xyXG4gICAgICAgICAgIHZhbE9mZnNldCA9ICh2YWwgJSB1Ym91bmQpICsgd3JhcE9mZnNldDtcclxuICAgICAgICAgICB2YWwgPSB1Ym91bmQgKyB2YWxPZmZzZXQ7XHJcbiAgICAgICAgICAgLy8gaWYgdGhlIHZhbHVlIGlzIGFib3ZlIHRoZSByYW5nZVxyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZSBpZiAodmFsID4gdWJvdW5kKSB7XHJcbiAgICAgICAgICAgdmFsT2Zmc2V0ID0gKHZhbCAlIHVib3VuZCkgLSB3cmFwT2Zmc2V0O1xyXG4gICAgICAgICAgIHZhbCA9IGxib3VuZCArIHZhbE9mZnNldDtcclxuICAgICAgIH1cclxuICAgICAgIC8vIGFkZCB0aGUgb2Zmc2V0IGZyb20gemVybyBiYWNrIHRvIHRoZSB2YWx1ZVxyXG4gICAgICAgdmFsIC09IHplcm9PZmZzZXQ7XHJcbiAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgIHZhbHVlOiB2YWwsXHJcbiAgICAgICAgICAgbnVtV3JhcHM6IHdyYXBzLFxyXG4gICAgICAgfTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNpbXBsZSB1dGlsIHRvIGNsYW1wIGEgbnVtYmVyIHRvIGEgcmFuZ2VcclxuICAgICogQHBhcmFtIHBOdW0gLSB0aGUgbnVtYmVyIHRvIGNsYW1wXHJcbiAgICAqIEBwYXJhbSBwTG93ZXIgLSB0aGUgbG93ZXIgYm91bmRcclxuICAgICogQHBhcmFtIHBVcHBlciAtIHRoZSB1cHBlciBib3VuZFxyXG4gICAgKiBAcmV0dXJucyBOdW1iZXIgLSB0aGUgY2xhbXBlZCBudW1iZXJcclxuICAgICpcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjbGFtcCA9IChwTnVtLCBwTG93ZXIsIHBVcHBlcikgPT4gTWF0aC5tYXgoTWF0aC5taW4ocE51bSwgTWF0aC5tYXgocExvd2VyLCBwVXBwZXIpKSwgTWF0aC5taW4ocExvd2VyLCBwVXBwZXIpKTtcblxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8vIENvbnN0YW50c1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgTU9ESUZJRURfU0VNSVRPTkVTID0gWzEsIDMsIDQsIDYsIDgsIDEwXTtcclxuICAgY29uc3QgVE9ORVNfTUFYID0gMTE7XHJcbiAgIGNvbnN0IFRPTkVTX01JTiA9IDA7XHJcbiAgIGNvbnN0IE9DVEFWRV9NQVggPSA5O1xyXG4gICBjb25zdCBPQ1RBVkVfTUlOID0gMDtcclxuICAgY29uc3QgREVGQVVMVF9PQ1RBVkUgPSA0O1xyXG4gICBjb25zdCBERUZBVUxUX1NFTUlUT05FID0gMDtcblxuICAgLyoqXHJcbiAgICAqIE1hcHMgbm90ZSBhbHRlcmF0aW9ucyB0byAgdGhlaXIgcmVsYXRpdmUgbWF0aG1hdGljYWwgdmFsdWVcclxuICAgICpAZW51bVxyXG4gICAgKi9cclxuICAgdmFyIE1vZGlmaWVyO1xyXG4gICAoZnVuY3Rpb24gKE1vZGlmaWVyKSB7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIkZMQVRcIl0gPSAtMV0gPSBcIkZMQVRcIjtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiTkFUVVJBTFwiXSA9IDBdID0gXCJOQVRVUkFMXCI7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIlNIQVJQXCJdID0gMV0gPSBcIlNIQVJQXCI7XHJcbiAgIH0pKE1vZGlmaWVyIHx8IChNb2RpZmllciA9IHt9KSk7XHJcbiAgIC8qKlxyXG4gICAgKiBQYXJzZXMgbW9kaWZpZXIgZnJvbSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGVudW0gdmFsdWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZU1vZGlmaWVyID0gKG1vZGlmaWVyKSA9PiB7XHJcbiAgICAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgY2FzZSBcImJcIjpcclxuICAgICAgICAgICBjYXNlIFwiZmxhdFwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuRkxBVDtcclxuICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgY2FzZSBcInNoYXJwXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5TSEFSUDtcclxuICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuTkFUVVJBTDtcclxuICAgICAgIH1cclxuICAgfTtcclxuICAgdmFyIE1vZGlmaWVyJDEgPSBNb2RpZmllcjtcblxuICAgLy8gaW1wb3J0IHsgcmVnaXN0ZXJJbml0aWFsaXplciB9IGZyb20gXCIuLi9Jbml0aWFsaXplci9Jbml0aWFsaXplclwiO1xyXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZUxvb2t1cC5qc29uXCI7XHJcbiAgIC8vIGltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IG5hbWVSZWdleCQyID0gLyhbQS1HXSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCQyID0gLygjfHN8YikvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXgkMiA9IC8oWzAtOV0rKS9nO1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIHBhcnNlIGEgbm90ZSBmcm9tIGEgc3RyaW5nXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgcGFyc2VOb3RlID0gKG5vdGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbm90ZUxvb2t1cChub3RlKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgbm90ZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7bm90ZX0uIEdldCBhIHBlcmZvcm1hbmNlIGluY3JlYXNlIGJ5IHVzaW5nIHRoZSBmb3JtYXQgW0EtR11bI3xzfGJdWzAtOV0gYW5kIHVzaW5nIGJ1aWxkVGFibGVzIG1ldGhvZChzZWUgZG9jdW1lbnRhdGlvbilgKTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IG5vdGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke25vdGV9LiBHZXQgYSBwZXJmb3JtYW5jZSBpbmNyZWFzZSBieSB1c2luZyB0aGUgZm9ybWF0IFtBLUddWyN8c3xiXVswLTldIGFuZCB1c2luZyBidWlsZFRhYmxlcyBtZXRob2Qoc2VlIGRvY3VtZW50YXRpb24pYCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IG5vdGUubWF0Y2gobmFtZVJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IG5vdGUubWF0Y2gobW9kaWZpZXJSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gbm90ZS5tYXRjaChvY3RhdmVSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbm90ZTogJHtub3RlfWApO1xyXG4gICB9O1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQ0ID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgbm90ZVRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgZm9yIChjb25zdCBub3RlTGFiZWwgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICBub3RlVGFibGVbbm90ZUxhYmVsXSA9IHBhcnNlTm90ZShub3RlTGFiZWwsIHRydWUpOyAvLyAnQycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICBmb3IgKGxldCBpTW9kaWZpZXJPdXRlciA9IDA7IGlNb2RpZmllck91dGVyIDwgbm90ZU1vZGlmaWVycy5sZW5ndGg7ICsraU1vZGlmaWVyT3V0ZXIpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bm90ZU1vZGlmaWVyc1tpTW9kaWZpZXJPdXRlcl19YDtcclxuICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0MjJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8IE9DVEFWRV9NQVg7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtpT2N0YXZlfWA7XHJcbiAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgZm9yIChsZXQgaU1vZGlmaWVyID0gMDsgaU1vZGlmaWVyIDwgbm90ZU1vZGlmaWVycy5sZW5ndGg7ICsraU1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtub3RlTW9kaWZpZXJzW2lNb2RpZmllcl19JHtpT2N0YXZlfWA7XHJcbiAgICAgICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQyM0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIG5vdGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIFRoZSBsb29rdXAgdGFibGVcclxuICAgICovXHJcbiAgIGxldCBfbm90ZUxvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3RlTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGROb3RlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZUxvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZE5vdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUkNCgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZUxvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IG5vdGUgdGFibGVcIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8vIGltcG9ydCB7IHJlZ2lzdGVySW5pdGlhbGl6ZXIgfSBmcm9tIFwiLi4vSW5pdGlhbGl6ZXIvSW5pdGlhbGl6ZXJcIjtcclxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVTdHJpbmdMb29rdXAuanNvblwiO1xyXG4gICBjb25zdCBVTktOT1dOX01PRElGSUVSX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJDIy9EYlwiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkQjL0ViXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJGIy9HYlwiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkcjL0FiXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQSMvQmJcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBTSEFSUF9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiQyNcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJEI1wiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiRiNcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJHI1wiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkEjXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgRkxBVF9NT0RJRklFUl9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiRGJcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJFYlwiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiR2JcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJBYlwiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkJiXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgY3JlYXRlVGFibGUkMyA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpVG9uZSA9IFRPTkVTX01JTjsgaVRvbmUgPD0gVE9ORVNfTUFYOyArK2lUb25lKSB7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaVByZXYgPSBUT05FU19NSU47IGlQcmV2IDw9IFRPTkVTX01BWDsgKytpUHJldikge1xyXG4gICAgICAgICAgICAgICAvLyBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8PSBPQ1RBVkVfTUFYOyBpT2N0YXZlKyspIHtcclxuICAgICAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgaWYgKE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyhpVG9uZSkpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCItXCI7IC8vIGhhcyBhbiB1bmtub3duIG1vZGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAvLyBpZiBpcyBmbGF0XHJcbiAgICAgICAgICAgICAgICAgICBpZiAod3JhcChpVG9uZSArIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT0gaVByZXYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcImJcIjtcclxuICAgICAgICAgICAgICAgICAgIC8vIGlzIHNoYXJwXHJcbiAgICAgICAgICAgICAgICAgICBpZiAod3JhcChpVG9uZSAtIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT0gaVByZXYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcIiNcIjtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvLyBnZXQgbm90ZSBuYW1lIGZyb20gdGFibGVcclxuICAgICAgICAgICAgICAgdGFibGVbYCR7aVRvbmV9LSR7aVByZXZ9YF0gPSBnZXROb3RlTGFiZWwoaVRvbmUsIG1vZGlmaWVyKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBjb25zdCBnZXROb3RlTGFiZWwgPSAodG9uZSwgbW9kaWZpZXIpID0+IHtcclxuICAgICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gU0hBUlBfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgICAgIGNhc2UgXCJiXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBGTEFUX01PRElGSUVSX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBVTktOT1dOX01PRElGSUVSX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgIH1cclxuICAgfTtcclxuICAgbGV0IF9ub3RlU3RyaW5nTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVTdHJpbmdMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgaWYgKE9iamVjdC5rZXlzKF9ub3RlU3RyaW5nTG9va3VwKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZE5vdGVTdHJpbmdUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3Qua2V5cyhfbm90ZVN0cmluZ0xvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwO1xyXG4gICAgICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSQzKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3RlU3RyaW5nTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiTm90ZSBzdHJpbmcgdGFibGUgYnVpbHQuXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwO1xyXG4gICB9O1xuXG4gICB2YXIgSURYPTI1NiwgSEVYPVtdLCBTSVpFPTI1NiwgQlVGRkVSO1xuICAgd2hpbGUgKElEWC0tKSBIRVhbSURYXSA9IChJRFggKyAyNTYpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG5cbiAgIGZ1bmN0aW9uIHVpZChsZW4pIHtcbiAgIFx0dmFyIGk9MCwgdG1wPShsZW4gfHwgMTEpO1xuICAgXHRpZiAoIUJVRkZFUiB8fCAoKElEWCArIHRtcCkgPiBTSVpFKjIpKSB7XG4gICBcdFx0Zm9yIChCVUZGRVI9JycsSURYPTA7IGkgPCBTSVpFOyBpKyspIHtcbiAgIFx0XHRcdEJVRkZFUiArPSBIRVhbTWF0aC5yYW5kb20oKSAqIDI1NiB8IDBdO1xuICAgXHRcdH1cbiAgIFx0fVxuXG4gICBcdHJldHVybiBCVUZGRVIuc3Vic3RyaW5nKElEWCwgSURYKysgKyB0bXApO1xuICAgfVxuXG4gICAvLyBpbXBvcnQgSWRlbnRpZmlhYmxlIGZyb20gXCIuLi9jb21wb3NhYmxlcy9JZGVudGlmaWFibGVcIjtcclxuICAgLyoqXHJcbiAgICAqIEEgbm90ZSBjb25zaXN0IG9mIGEgc2VtaXRvbmUgYW5kIGFuIG9jdGF2ZS48YnI+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7IE5vdGVJbml0aWFsaXplciB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7IC8vIHR5cGVzY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBOb3RlIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB3aXRoIGRlZmF1bHQgdmFsdWVzIHNlbWl0b25lIDAoQykgYW5kIG9jdGF2ZSA0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgdXNpbmcgYW4gaW5pdGlhbGl6ZXIgb2JqZWN0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoe3NlbWl0b25lOiA0LCBvY3RhdmU6IDV9KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IG5vdGUtbmFtZVttb2RpZmllcl1bb2N0YXZlXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHVzaW5nIGEgc3RyaW5nXHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoXCJDNVwiKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICB2YWx1ZXMgPSBwYXJzZU5vdGUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXM/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHZhbHVlcz8uc2VtaXRvbmUgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0aGF0IG9jdGF2ZSBpcyBzZXQgZmlyc3Qgc28gdGhhdFxyXG4gICAgICAgICAgICAgICAvLyBzZXR0aW5nIHRoZSBzZW1pdG9uZSBjYW4gY2hhbmdlIHRoZSBvY3RhdmVcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXM/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHZhbHVlcz8uc2VtaXRvbmUgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICB1bmlxdWUgaWQgZm9yIHRoaXMgbm90ZShhdXRvIGdlbmVyYXRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaWQpOyAvLyBzMjg5OHNubG9qXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2VtaXRvbmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgX3ByZXZTZW1pdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAwXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHNlbWl0b25lKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl90b25lO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZXR0aW5nIHRoZSBzZW1pdG9uZSB3aXRoIGEgbnVtYmVyIG91dHNpZGUgdGhlXHJcbiAgICAgICAgKiByYW5nZSBvZiAwLTExIHdpbGwgd3JhcCB0aGUgdmFsdWUgYXJvdW5kIGFuZFxyXG4gICAgICAgICogY2hhbmdlIHRoZSBvY3RhdmUgYWNjb3JkaW5nbHlcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIG5vdGUuc2VtaXRvbmUgPSA0Oy8vIEVcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyA0KEUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHNlbWl0b25lKHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAoc2VtaXRvbmUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIHRoaXMuX3RvbmUgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IHRoaXMuX29jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUub2N0YXZlKTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBub3RlLm9jdGF2ZSA9IDEwO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5vY3RhdmUpOyAvLyA5KGJlY2F1c2Ugb2YgY2xhbXBpbmcpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZShvY3RhdmUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcChvY3RhdmUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBzaGFycGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLnNoYXJwKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlMi5zZW1pdG9uZSk7IC8vIDEoQyMpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hhcnAoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSkuc2hhcnBlbigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTaGFycGVucyB0aGUgbm90ZSBpbiBwbGFjZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBub3RlLnNoYXJwZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAxKEMjKVxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGFycGVuKCkge1xyXG4gICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lICsgMTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIGF0dGVtcHRzIHRvIGRldGVybWluZSBpZiB0aGUgbm90ZSBpcyBzaGFycFxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbm90ZSBpcyBzaGFycFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNTaGFycCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIG5vdGUuc2hhcnBlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc1NoYXJwKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNTaGFycCgpIHtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHdob2xlLCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGNvbnN0IG1vZGlmaWVkID0gTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKHRoaXMuc2VtaXRvbmUpO1xyXG4gICAgICAgICAgIGlmICghbW9kaWZpZWQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIGZsYXQsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgaWYgKHdyYXAodGhpcy5zZW1pdG9uZSArIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT1cclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vaXMgZmxhdFxyXG4gICAgICAgICAgIC8vIERvZXNuJ3QgbmVjY2VjYXJpbHkgbWVhbiBpdCdzIHNoYXJwLCBidXQgaXQncyBhIGdvb2QgZ3Vlc3MgYXQgdGhpcyBwb2ludFxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuZmxhdCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZTIuc2VtaXRvbmUpOyAvLyAzKEViKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGZsYXQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSkuZmxhdHRlbigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBGbGF0dGVucyB0aGUgbm90ZSBpbiBwbGFjZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoe3NlbWl0b25lOiA0fSk7IC8vICBzZW1pdG9uZSBpcyA0KEUpXHJcbiAgICAgICAgKiBub3RlLmZsYXR0ZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAzKEViKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGZsYXR0ZW4oKSB7XHJcbiAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmUgLSAxO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgYXR0ZW1wdHMgdG8gZGV0ZXJtaW5lIGlmIHRoZSBub3RlIGlzIGZsYXRcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG5vdGUgaXMgZmxhdFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNGbGF0KCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogbm90ZS5mbGF0dGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzRmxhdCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzRmxhdCgpIHtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHdob2xlLCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGNvbnN0IG1vZGlmaWVkID0gTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKHRoaXMuc2VtaXRvbmUpO1xyXG4gICAgICAgICAgIGlmICghbW9kaWZpZWQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHNoYXJwLCBpdCBjYW4ndCBiZSBmbGF0XHJcbiAgICAgICAgICAgaWYgKHdyYXAodGhpcy5zZW1pdG9uZSAtIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT1cclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vaXMgc2hhcnBcclxuICAgICAgICAgICAvLyBEb2Vzbid0IG5lY2NlY2FyaWx5IG1lYW4gaXQncyBmbGF0LCBidXQgaXQncyBhIGdvb2QgZ3Vlc3MgYXQgdGhpcyBwb2ludFxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoaXMgbm90ZSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5lcXVhbHMobm90ZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VtaXRvbmUgPT09IG5vdGUuc2VtaXRvbmUgJiYgdGhpcy5vY3RhdmUgPT09IG5vdGUub2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuZXF1YWxzKG5vdGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHZlcnNpb24gb2YgdGhpcyBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICpcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZVN0cmluZ0xvb2t1cCk7XHJcbiAgICAgICAgICAgcmV0dXJuIChub3RlU3RyaW5nTG9va3VwKGAke3RoaXMuX3RvbmV9LSR7dGhpcy5fcHJldlNlbWl0b25lfWApICtcclxuICAgICAgICAgICAgICAgYCR7dGhpcy5fb2N0YXZlfWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTdGF0aWMgbWV0aG9kcyB0byBjcmVhdGUgd2hvbGUgbm90ZXMgZWFzaWx5LlxyXG4gICAgICAgICogdGhlIGRlZmF1bHQgb2N0YXZlIGlzIDRcclxuICAgICAgICAqL1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBBW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5BKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBBNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBBKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5BLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBCW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5CKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBCNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBCKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5CLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBDW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5DKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBDNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBDKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5DLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBEW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5EKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBENFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBEKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5ELFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBFW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5FKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBFNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBFKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5FLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBGW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5GKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBGNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBGKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5GLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBHW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5HKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBHNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBHKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5HLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIENvbnN0YW50c1xyXG4gICAgKi9cclxuICAgY29uc3QgTUlESUtFWV9TVEFSVCA9IDEyO1xyXG4gICBjb25zdCBOVU1fT0NUQVZFUyA9IDEwO1xyXG4gICBjb25zdCBOVU1fU0VNSVRPTkVTID0gMTI7XHJcbiAgIC8qKlxyXG4gICAgKiBDYWxjdWxhdGVzIHRoZSBtaWRpIGtleSBmb3IgYSBnaXZlbiBvY3RhdmUgYW5kIHNlbWl0b25lLlxyXG4gICAgKi9cclxuICAgY29uc3QgY2FsY01pZGlLZXkgPSAob2N0YXZlLCBzZW1pdG9uZSkgPT4gTUlESUtFWV9TVEFSVCArIG9jdGF2ZSAqIE5VTV9TRU1JVE9ORVMgKyBzZW1pdG9uZTtcclxuICAgLyoqXHJcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGZyZXF1ZW5jeSBmb3IgYSBnaXZlbiBvY3RhdmUgYW5kIHNlbWl0b25lIGdpdmVuXHJcbiAgICAqIGEgdHVuaW5nIGZvciBhNC5cclxuICAgICovXHJcbiAgIGNvbnN0IGNhbGNGcmVxdWVuY3kgPSAobWlkaUtleSwgYTRUdW5pbmcpID0+IDIgKiogKChtaWRpS2V5IC0gNjkpIC8gMTIpICogYTRUdW5pbmc7XHJcbiAgIC8qKlxyXG4gICAgKiBDcmVhdGVzIGFuZCByZXR1cm4gbG9va3VwIHRhYmxlcyBmb3IgbWlkaWtleSBhbmQgZnJlcXVlbmN5LlxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGVzID0gKGE0VHVuaW5nID0gNDQwKSA9PiB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE1hcHMgb2N0YXZlIGFuZCBzZW1pdG9uZSB0byBub3RlIGZyZXF1ZW5jeShoZXJ0eikuXHJcbiAgICAgICAgKiByZXF1aXJlcyBhIGtleSBpbiB0aGUgZm9ybSBvZiBgPG9jdGF2ZT4tPHNlbWl0b25lPmBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3QgZnJlcVRhYmxlID0ge307XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE1hcHMgb2N0YXZlIGFuZCBzZW1pdG9uZSB0byBtaWRpIGtleS5cclxuICAgICAgICAqIHJlcXVpcmVzIGEga2V5IGluIHRoZSBmb3JtIG9mIGA8b2N0YXZlPi08c2VtaXRvbmU+YFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdCBtaWRpVGFibGUgPSB7fTtcclxuICAgICAgIGxldCBpT2N0YXZlID0gMDtcclxuICAgICAgIGxldCBpU2VtaXRvbmUgPSAwO1xyXG4gICAgICAgZm9yIChpT2N0YXZlID0gMDsgaU9jdGF2ZSA8IE5VTV9PQ1RBVkVTOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICBmb3IgKGlTZW1pdG9uZSA9IDA7IGlTZW1pdG9uZSA8IE5VTV9TRU1JVE9ORVM7ICsraVNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke2lPY3RhdmV9LSR7aVNlbWl0b25lfWA7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG1rZXkgPSBjYWxjTWlkaUtleShpT2N0YXZlLCBpU2VtaXRvbmUpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBmcmVxID0gY2FsY0ZyZXF1ZW5jeShta2V5LCBhNFR1bmluZyk7XHJcbiAgICAgICAgICAgICAgIG1pZGlUYWJsZVtrZXldID0gbWtleTtcclxuICAgICAgICAgICAgICAgZnJlcVRhYmxlW2tleV0gPSBmcmVxO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgZnJlcUxvb2t1cDogZnJlcVRhYmxlLFxyXG4gICAgICAgICAgIG1pZGlMb29rdXA6IG1pZGlUYWJsZSxcclxuICAgICAgIH07XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBUdW5pbmcgY29tcG9uZW50IHVzZWQgYnkgSW5zdHJ1bWVudCBjbGFzczxicj5cclxuICAgICogY29udGFpbmVzIHRoZSBhNCB0dW5pbmcgLSBkZWZhdWx0IGlzIDQ0MEh6PGJyPlxyXG4gICAgKiBidWlsZHMgbG9va3VwIHRhYmxlcyBmb3IgbWlkaSBrZXkgYW5kIGZyZXF1ZW5jeTxicj5cclxuICAgICogYmFzZWQgb24gdGhlIHR1bmluZ1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNsYXNzIFR1bmluZyB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIENyZWF0ZXMgdGhlIG9iamVjdCBhbmQgYnVpbGRzIHRoZSBsb29rdXAgdGFibGVzLlxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3RvcihhNEZyZXEgPSA0NDApIHtcclxuICAgICAgICAgICB0aGlzLl9hNCA9IGE0RnJlcTtcclxuICAgICAgICAgICB0aGlzLmJ1aWxkVGFibGVzKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IFR1bmluZyh0aGlzLl9hNCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYTQgPT09IG90aGVyLl9hNDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogYTQgVHVuaW5nXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9hNCA9IDQ0MDtcclxuICAgICAgIGdldCBhNCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYTQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNldHRpbmcgdGhlIHR1bmluZyB3aWxsIHJlYnVpbGQgdGhlIGxvb2t1cCB0YWJsZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGE0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYTQgPSB2YWx1ZTtcclxuICAgICAgICAgICB0aGlzLmJ1aWxkVGFibGVzKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGxvb2t1cCB0YWJsZSBmb3IgbWlkaSBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgX21pZGlLZXlUYWJsZSA9IHt9O1xyXG4gICAgICAgbWlkaUtleUxvb2t1cChvY3RhdmUsIHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7b2N0YXZlfS0ke3NlbWl0b25lfWA7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pZGlLZXlUYWJsZVtrZXldO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBsb29rdXAgdGFibGUgZm9yIGZyZXF1ZW5jeVxyXG4gICAgICAgICovXHJcbiAgICAgICBfZnJlcVRhYmxlID0ge307XHJcbiAgICAgICBmcmVxTG9va3VwKG9jdGF2ZSwgc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtvY3RhdmV9LSR7c2VtaXRvbmV9YDtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlcVRhYmxlW2tleV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEJ1aWxkcyB0aGUgbG9va3VwIHRhYmxlcyBmb3IgbWlkaSBrZXkgYW5kIGZyZXF1ZW5jeVxyXG4gICAgICAgICovXHJcbiAgICAgICBidWlsZFRhYmxlcygpIHtcclxuICAgICAgICAgICBjb25zdCB0YWJsZXMgPSBjcmVhdGVUYWJsZXModGhpcy5fYTQpO1xyXG4gICAgICAgICAgIHRoaXMuX21pZGlLZXlUYWJsZSA9IHRhYmxlcy5taWRpTG9va3VwO1xyXG4gICAgICAgICAgIHRoaXMuX2ZyZXFUYWJsZSA9IHRhYmxlcy5mcmVxTG9va3VwO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSB0dW5pbmcgYXMgYSBzdHJpbmdcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGBUdW5pbmcoJHt0aGlzLl9hNH0pYDtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogSW5zdHJ1bWVudCBhcmUgdXNlZCB0byBlbmNhcHN1bGF0ZSB0aGUgdHVuaW5nIGFuZCByZXRyaWV2aW5nIG9mIG1pZGkga2V5c1xyXG4gICAgKiBhbmQgZnJlcXVlbmNpZXMgZm9yIG5vdGVzXHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgSW5zdHJ1bWVudCB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqL1xyXG4gICBjbGFzcyBJbnN0cnVtZW50IHtcclxuICAgICAgIHR1bmluZztcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIHR1bmluZyBBNCBmcmVxdWVuY3kgLSBkZWZhdWx0cyB0byA0NDBcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTsgLy8gZGVmYXVsdCA0NDAgdHVuaW5nXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IoYTRGcmVxID0gNDQwKSB7XHJcbiAgICAgICAgICAgdGhpcy50dW5pbmcgPSBuZXcgVHVuaW5nKGE0RnJlcSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIGEgdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmlkOyAvLyByZXR1cm5zIGEgdW5pcXVlIGlkXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBpbnN0cnVtZW50LmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVtZW50KHRoaXMudHVuaW5nLmE0KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIG90aGVyIHRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZVxyXG4gICAgICAgICogQHJldHVybnMgIHRydWUgaWYgdGhlIG90aGVyIG9iamVjdCBpcyBlcXVhbCB0byB0aGlzIG9uZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGluc3RydW1lbnQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLmVxdWFscyhvdGhlci50dW5pbmcpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgZnJlcXVlbmN5IG9mIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmdldEZyZXF1ZW5jeShuZXcgTm90ZShcIkM0XCIpKTsgLy8gcmV0dXJucyAyNjEuNjI1NTY1MzAwNTk4NlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldEZyZXF1ZW5jeShub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLmZyZXFMb29rdXAobm90ZS5vY3RhdmUsIG5vdGUuc2VtaXRvbmUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbWlkaSBrZXkgb2YgdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuZ2V0TWlkaUtleShuZXcgTm90ZShcIkM0XCIpKTsgLy8gcmV0dXJucyA2MFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE1pZGlLZXkobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5taWRpS2V5TG9va3VwKG5vdGUub2N0YXZlLCBub3RlLnNlbWl0b25lKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIHR1bmluZyBhcyBhIHN0cmluZ1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC50b1N0cmluZygpKTsgLy8gcmV0dXJucyBcIkluc3RydW1lbnQgVHVuaW5nKDQ0MClcIlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIHJldHVybiBgSW5zdHJ1bWVudCBUdW5pbmcoJHt0aGlzLnR1bmluZy5hNH0pYDtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICBjb25zdCBERUZBVUxUX1NDQUxFX1RFTVBMQVRFID0gWzAsIDIsIDIsIDEsIDIsIDIsIDJdOyAvLyBtYWpvclxyXG4gICBPYmplY3QuZnJlZXplKERFRkFVTFRfU0NBTEVfVEVNUExBVEUpO1xuXG4gICAvKipcclxuICAgICogTWFwcyBwcmVkZWZpbmVkIHNjYWxlcyB0byB0aGVpciBuYW1lcy5cclxuICAgICovXHJcbiAgIGNvbnN0IFNjYWxlVGVtcGxhdGVzID0ge1xyXG4gICAgICAgd2hvbGVUb25lOiBbMCwgMiwgMiwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICAvLyBtYWpvclxyXG4gICAgICAgbWFqb3I6IFswLCAyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIG1ham9yN3M0czU6IFswLCAyLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIG1vZGVzXHJcbiAgICAgICAvLyBpb25pYW46IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1ham9yXHJcbiAgICAgICAvLyBhZW9saWFuOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtaW5vclxyXG4gICAgICAgZG9yaWFuOiBbMCwgMiwgMSwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBwaHJ5Z2lhbjogWzAsIDEsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgbHlkaWFuOiBbMCwgMiwgMiwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICBseWRpYW5Eb21pbmFudDogWzAsIDIsIDIsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgLy8gYWNvdXN0aWM6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIGx5ZGlhbkRvbWluYW50XHJcbiAgICAgICBtaXhvbHlkaWFuOiBbMCwgMiwgMiwgMSwgMiwgMiwgMV0sXHJcbiAgICAgICBtaXhvbHlkaWFuRmxhdDY6IFswLCAyLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGxvY3JpYW46IFswLCAxLCAyLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIHN1cGVyTG9jcmlhbjogWzAsIDEsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgLy8gbWlub3JcclxuICAgICAgIG1pbm9yOiBbMCwgMiwgMSwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICBtaW5vcjdiOTogWzAsIDEsIDIsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgbWlub3I3YjU6IFswLCAyLCAxLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIC8vIGhhbGZEaW1pbmlzaGVkOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtaW5vcjdiNVxyXG4gICAgICAgLy8gaGFybW9uaWNcclxuICAgICAgIGhhcm1vbmljTWFqb3I6IFswLCAyLCAyLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIGhhcm1vbmljTWlub3I6IFswLCAyLCAxLCAyLCAyLCAxLCAzXSxcclxuICAgICAgIGRvdWJsZUhhcm1vbmljOiBbMCwgMSwgMywgMSwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBieXphbnRpbmU6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIGRvdWJsZUhhcm1vbmljXHJcbiAgICAgICAvLyBtZWxvZGljXHJcbiAgICAgICBtZWxvZGljTWlub3JBc2NlbmRpbmc6IFswLCAyLCAxLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIG1lbG9kaWNNaW5vckRlc2NlbmRpbmc6IFswLCAyLCAyLCAxLCAyLCAyLCAxXSxcclxuICAgICAgIC8vIHBlbnRhdG9uaWNcclxuICAgICAgIG1ham9yUGVudGF0b25pYzogWzAsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgbWFqb3JQZW50YXRvbmljQmx1ZXM6IFswLCAyLCAxLCAxLCAzLCAyXSxcclxuICAgICAgIG1pbm9yUGVudGF0b25pYzogWzAsIDMsIDIsIDIsIDNdLFxyXG4gICAgICAgbWlub3JQZW50YXRvbmljQmx1ZXM6IFswLCAzLCAyLCAxLCAxLCAzXSxcclxuICAgICAgIGI1UGVudGF0b25pYzogWzAsIDMsIDIsIDEsIDQsIDJdLFxyXG4gICAgICAgbWlub3I2UGVudGF0b25pYzogWzAsIDMsIDIsIDIsIDIsIDNdLFxyXG4gICAgICAgLy8gZW5pZ21hdGljXHJcbiAgICAgICBlbmlnbWF0aWNNYWpvcjogWzAsIDEsIDMsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgZW5pZ21hdGljTWlub3I6IFswLCAxLCAyLCAzLCAxLCAzLCAxXSxcclxuICAgICAgIC8vIDhUb25lXHJcbiAgICAgICBkaW04VG9uZTogWzAsIDIsIDEsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgZG9tOFRvbmU6IFswLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIC8vIG5lYXBvbGl0YW5cclxuICAgICAgIG5lYXBvbGl0YW5NYWpvcjogWzAsIDEsIDIsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgbmVhcG9saXRhbk1pbm9yOiBbMCwgMSwgMiwgMiwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBodW5nYXJpYW5cclxuICAgICAgIGh1bmdhcmlhbk1ham9yOiBbMCwgMywgMSwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICBodW5nYXJpYW5NaW5vcjogWzAsIDIsIDEsIDMsIDEsIDEsIDNdLFxyXG4gICAgICAgaHVuZ2FyaWFuR3lwc3k6IFswLCAxLCAzLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIHNwYW5pc2hcclxuICAgICAgIHNwYW5pc2g6IFswLCAxLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIHNwYW5pc2g4VG9uZTogWzAsIDEsIDIsIDEsIDEsIDEsIDIsIDJdLFxyXG4gICAgICAgLy8gamV3aXNoOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBzcGFuaXNoOFRvbmVcclxuICAgICAgIHNwYW5pc2hHeXBzeTogWzAsIDEsIDMsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gYXVnIGRvbVxyXG4gICAgICAgYXVnbWVudGVkOiBbMCwgMywgMSwgMywgMSwgMywgMV0sXHJcbiAgICAgICBkb21pbmFudFN1c3BlbmRlZDogWzAsIDIsIDMsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gYmVib3BcclxuICAgICAgIGJlYm9wTWFqb3I6IFswLCAyLCAyLCAxLCAyLCAxLCAxLCAyXSxcclxuICAgICAgIGJlYm9wRG9taW5hbnQ6IFswLCAyLCAyLCAxLCAyLCAyLCAxLCAxXSxcclxuICAgICAgIG15c3RpYzogWzAsIDIsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgb3ZlcnRvbmU6IFswLCAyLCAyLCAyLCAxLCAxLCAyXSxcclxuICAgICAgIGxlYWRpbmdUb25lOiBbMCwgMiwgMiwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICAvLyBqYXBhbmVzZVxyXG4gICAgICAgaGlyb2pvc2hpOiBbMCwgMiwgMSwgNCwgMV0sXHJcbiAgICAgICBqYXBhbmVzZUE6IFswLCAxLCA0LCAxLCAzXSxcclxuICAgICAgIGphcGFuZXNlQjogWzAsIDIsIDMsIDEsIDNdLFxyXG4gICAgICAgLy8gY3VsdHVyZXNcclxuICAgICAgIG9yaWVudGFsOiBbMCwgMSwgMywgMSwgMSwgMywgMV0sXHJcbiAgICAgICBwZXJzaWFuOiBbMCwgMSwgNCwgMSwgMiwgM10sXHJcbiAgICAgICBhcmFiaWFuOiBbMCwgMiwgMiwgMSwgMSwgMiwgMl0sXHJcbiAgICAgICBiYWxpbmVzZTogWzAsIDEsIDIsIDQsIDFdLFxyXG4gICAgICAga3Vtb2k6IFswLCAyLCAxLCA0LCAyLCAyXSxcclxuICAgICAgIHBlbG9nOiBbMCwgMSwgMiwgMywgMSwgMV0sXHJcbiAgICAgICBhbGdlcmlhbjogWzAsIDIsIDEsIDIsIDEsIDEsIDEsIDNdLFxyXG4gICAgICAgY2hpbmVzZTogWzAsIDQsIDIsIDEsIDRdLFxyXG4gICAgICAgbW9uZ29saWFuOiBbMCwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBlZ3lwdGlhbjogWzAsIDIsIDMsIDIsIDNdLFxyXG4gICAgICAgcm9tYWluaWFuOiBbMCwgMiwgMSwgMywgMSwgMiwgMV0sXHJcbiAgICAgICBoaW5kdTogWzAsIDIsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgaW5zZW46IFswLCAxLCA0LCAyLCAzXSxcclxuICAgICAgIGl3YXRvOiBbMCwgMSwgNCwgMSwgNF0sXHJcbiAgICAgICBzY290dGlzaDogWzAsIDIsIDMsIDIsIDJdLFxyXG4gICAgICAgeW86IFswLCAzLCAyLCAyLCAzXSxcclxuICAgICAgIGlzdHJpYW46IFswLCAxLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIHVrcmFuaWFuRG9yaWFuOiBbMCwgMiwgMSwgMywgMSwgMiwgMV0sXHJcbiAgICAgICBwZXRydXNoa2E6IFswLCAxLCAzLCAyLCAxLCAzXSxcclxuICAgICAgIGFoYXZhcmFiYTogWzAsIDEsIDMsIDEsIDIsIDEsIDJdLFxyXG4gICB9O1xyXG4gICAvLyBkdXBsaWNhdGVzIHdpdGggYWxpYXNlc1xyXG4gICBTY2FsZVRlbXBsYXRlcy5oYWxmRGltaW5pc2hlZCA9IFNjYWxlVGVtcGxhdGVzLm1pbm9yN2I1O1xyXG4gICBTY2FsZVRlbXBsYXRlcy5qZXdpc2ggPSBTY2FsZVRlbXBsYXRlcy5zcGFuaXNoOFRvbmU7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmJ5emFudGluZSA9IFNjYWxlVGVtcGxhdGVzLmRvdWJsZUhhcm1vbmljO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5hY291c3RpYyA9IFNjYWxlVGVtcGxhdGVzLmx5ZGlhbkRvbWluYW50O1xyXG4gICBTY2FsZVRlbXBsYXRlcy5hZW9saWFuID0gU2NhbGVUZW1wbGF0ZXMubWlub3I7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmlvbmlhbiA9IFNjYWxlVGVtcGxhdGVzLm1ham9yO1xyXG4gICBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcykuZm9yRWFjaCgoZWxlbWVudCkgPT4gT2JqZWN0LmZyZWV6ZShTY2FsZVRlbXBsYXRlc1tlbGVtZW50XSkpO1xuXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIGNvbnN0IG5hbWVSZWdleCQxID0gLyhbQS1HXSkoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCQxID0gLygjfHN8YikoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXgkMSA9IC8oWzAtOV0rKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBzY2FsZU5hbWVSZWdleCA9IC8oXFwoW2EtekEtWl17Mix9XFwpKS9nO1xyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gcGFyc2UgYSBub3RlIGZyb20gYSBzdHJpbmdcclxuICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHN0cmluZyB0byBwYXJzZVxyXG4gICAgKiBAcGFyYW0gc3VwcmVzc1dhcm5pbmcgLSBzdXByZXNzIHRoZSB3YXJuaW5nIGZvciBpbmVmZmVjaWVuY3kgaWYgdHJ1ZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlU2NhbGUgPSAoc2NhbGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2NhbGVMb29rdXAoc2NhbGUpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBzY2FsZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7c2NhbGV9LiBHZXQgYSBwZXJmb3JtYW5jIGluY3JlYXNlIGJ5IHVzaW5nIGEgdmFsaWQgZm9ybWF0YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBzY2FsZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7c2NhbGV9LiBHZXQgYSBwZXJmb3JtYW5jIGluY3JlYXNlIGJ5IHVzaW5nIGEgdmFsaWQgZm9ybWF0YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGxldCBzY2FsZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gc2NhbGUubWF0Y2gobmFtZVJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IHNjYWxlLm1hdGNoKG1vZGlmaWVyUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IHNjYWxlLm1hdGNoKG9jdGF2ZVJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lTWF0Y2ggPSBzY2FsZS5tYXRjaChzY2FsZU5hbWVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoc2NhbGVOYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBzTmFtZSA9IHNjYWxlTmFtZU1hdGNoLmpvaW4oXCJcIik7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coc05hbWUpO1xyXG4gICAgICAgICAgIHNjYWxlTmFtZSA9IHNOYW1lO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIGxldCB0ZW1wbGF0ZUluZGV4ID0gMTsgLy8gZGVmYXVsdCBtYWpvciBzY2FsZVxyXG4gICAgICAgICAgIGlmIChzY2FsZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGVJbmRleCA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKS5maW5kSW5kZXgoKHRlbXBsYXRlKSA9PiB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgICAgICAgIC5pbmNsdWRlcyhzY2FsZU5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKVt0ZW1wbGF0ZUluZGV4XSk7XHJcbiAgICAgICAgICAgaWYgKHRlbXBsYXRlSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5LTk9XTiBURU1QTEFURVwiLCBzY2FsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHRlbXBsYXRlIGZvciBzY2FsZSAke3NjYWxlTmFtZX1gKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlc1tPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcylbdGVtcGxhdGVJbmRleF1dO1xyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIGtleTogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBTY2FsZTogJHtzY2FsZX1gKTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQyID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgc2NhbGVUYWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGNvbnN0IHRlbXBsYXRlcyA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgdGVtcGxhdGVzKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBub3RlTGFiZWwgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICAgICAgLy9leCBBKG1pbm9yKVxyXG4gICAgICAgICAgICAgICBzY2FsZVRhYmxlW2Ake25vdGVMYWJlbH0oJHt0ZW1wbGF0ZX0pYF0gPSBwYXJzZVNjYWxlKG5vdGVMYWJlbCwgdHJ1ZSk7IC8vICdDJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHttb2R9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBleCBBIyhtaW5vcilcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0MjJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDwgT0NUQVZFX01BWDsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtpT2N0YXZlfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gZXggQTQobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9kIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHttb2R9JHtpT2N0YXZlfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGV4IEEjNChtaW5vcilcclxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDIzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gc2NhbGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgdGhlIGxvb2t1cCB0YWJsZSBhcyBzb29uIGFzIHRoZSBtb2R1bGUgaXMgbG9hZGVkXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgbGV0IF9zY2FsZUxvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBzY2FsZUxvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9zY2FsZUxvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX3NjYWxlTG9va3VwID0gdGFibGUgYXMgeyBba2V5OiBzdHJpbmddOiBTY2FsZUluaXRpYWxpemVyIH07XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9zY2FsZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRTY2FsZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9zY2FsZUxvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9zY2FsZUxvb2t1cDtcclxuICAgICAgIF9zY2FsZUxvb2t1cCA9IGNyZWF0ZVRhYmxlJDIoKTtcclxuICAgICAgIC8vIE9iamVjdC5mcmVlemUoX3NjYWxlTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiU2NhbGUgVGFibGUgQnVpbHRcIik7XHJcbiAgICAgICByZXR1cm4gX3NjYWxlTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogc2hpZnRzIGFuIGFycmF5IGJ5IGEgZ2l2ZW4gZGlzdGFuY2VcclxuICAgICogQHBhcmFtIGFyciB0aGUgYXJyYXkgdG8gc2hpZnRcclxuICAgICogQHBhcmFtIGRpc3RhbmNlIHRoZSBkaXN0YW5jZSB0byBzaGlmdFxyXG4gICAgKiBAcmV0dXJucyB0aGUgc2hpZnRlZCBhcnJheVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNoaWZ0ID0gKGFyciwgZGlzdCA9IDEpID0+IHtcclxuICAgICAgIGFyciA9IFsuLi5hcnJdOyAvLyBjb3B5XHJcbiAgICAgICBpZiAoZGlzdCA+IGFyci5sZW5ndGggfHwgZGlzdCA8IDAgLSBhcnIubGVuZ3RoKVxyXG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNoaWZ0OiBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gYXJyYXkgbGVuZ3RoXCIpO1xyXG4gICAgICAgaWYgKGRpc3QgPiAwKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGVtcCA9IGFyci5zcGxpY2UoYXJyLmxlbmd0aCAtIGRpc3QsIEluZmluaXR5KTtcclxuICAgICAgICAgICBhcnIudW5zaGlmdCguLi50ZW1wKTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChkaXN0IDwgMCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnIuc3BsaWNlKDAsIGRpc3QpO1xyXG4gICAgICAgICAgIGFyci5wdXNoKC4uLnRlbXApO1xyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGFycjtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqICBTaW1wbGUgdXRpbCB0byBsYXp5IGNsb25lIGFuIG9iamVjdFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNsb25lID0gKG9iaikgPT4ge1xyXG4gICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBzaW1wbGUgdXRpbCB0byBsYXp5IGNoZWNrIGVxdWFsaXR5IG9mIG9iamVjdHMgYW5kIGFycmF5c1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGlzRXF1YWwgPSAoYSwgYikgPT4ge1xyXG4gICAgICAgY29uc3Qgc3RyaW5nQSA9IEpTT04uc3RyaW5naWZ5KGEpO1xyXG4gICAgICAgY29uc3Qgc3RyaW5nQiA9IEpTT04uc3RyaW5naWZ5KGIpO1xyXG4gICAgICAgcmV0dXJuIHN0cmluZ0EgPT09IHN0cmluZ0I7XHJcbiAgIH07XG5cbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlU3RyaW5nTG9va3VwLmpzb25cIjtcclxuICAgLyoqXHJcbiAgICAqIFdpbGwgbG9va3VwIGEgc2NhbGUgbmFtZSBiYXNlZCBvbiB0aGUgdGVtcGxhdGUuXHJcbiAgICAqIEBwYXJhbSB0ZW1wbGF0ZSAtIHRoZSB0ZW1wbGF0ZSB0byBsb29rdXBcclxuICAgICogQHBhcmFtIHN1cHJlc3NXYXJuaW5nIC0gc3VwcmVzcyB0aGUgd2FybmluZyBmb3IgaW5lZmZlY2llbmN5IGlmIHRydWVcclxuICAgICogQHJldHVybnMgdGhlIHNjYWxlIG5hbWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzY2FsZU5hbWVMb29rdXAgPSAodGVtcGxhdGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmFtZVRhYmxlKEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdClcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lcyA9IFtdO1xyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgaWYgKGlzRXF1YWwodmFsdWVzW2ldLCB0ZW1wbGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgc2NhbGVOYW1lcy5wdXNoKGtleXNbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXlzW2ldLnNsaWNlKDEpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVzU3RyaW5nID0gc2NhbGVOYW1lcy5qb2luKFwiIEFLQSBcIik7XHJcbiAgICAgICByZXR1cm4gc2NhbGVOYW1lc1N0cmluZztcclxuICAgfTtcclxuICAgY29uc3QgY3JlYXRlVGFibGUkMSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgdGFibGVbSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpXSA9IHNjYWxlTmFtZUxvb2t1cCh0ZW1wbGF0ZSwgdHJ1ZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGxldCBfbmFtZVRhYmxlID0ge307XHJcbiAgIGNvbnN0IG5hbWVUYWJsZSA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVOYW1lVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbmFtZVRhYmxlW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbmFtZVRhYmxlID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9uYW1lVGFibGUgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVOYW1lVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX25hbWVUYWJsZSkubGVuZ3RoID4gMCkgcmV0dXJuIF9uYW1lVGFibGU7XHJcbiAgICAgICBfbmFtZVRhYmxlID0gY3JlYXRlVGFibGUkMSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbmFtZVRhYmxlKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiU2NhbGUgbmFtZSB0YWJsZSBidWlsdFwiKTtcclxuICAgICAgIHJldHVybiBfbmFtZVRhYmxlO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2NhbGVzIGNvbnNpc3Qgb2YgYSBrZXkodG9uaWMgb3Igcm9vdCkgYW5kIGEgdGVtcGxhdGUoYXJyYXkgb2YgaW50ZWdlcnMpIHRoYXRcclxuICAgICogPGJyPiByZXByZXNlbnRzIHRoZSBpbnRlcnZhbCBvZiBzdGVwcyBiZXR3ZWVuIGVhY2ggbm90ZS5cclxuICAgICogPGJyPjxicj5TY2FsZSBpbnRlcnZhbHMgYXJlIHJlcHJlc2VudGVkIGJ5IGFuIGludGVnZXJcclxuICAgICogPGJyPnRoYXQgaXMgdGhlIG51bWJlciBvZiBzZW1pdG9uZXMgYmV0d2VlbiBlYWNoIG5vdGUuXHJcbiAgICAqIDxicj4wID0ga2V5IC0gd2lsbCBhbHdheXMgcmVwcmVzZW50IHRoZSB0b25pY1xyXG4gICAgKiA8YnI+MSA9IGhhbGYgc3RlcFxyXG4gICAgKiA8YnI+MiA9IHdob2xlIHN0ZXBcclxuICAgICogPGJyPjMgPSBvbmUgYW5kIG9uZSBoYWxmIHN0ZXBzXHJcbiAgICAqIDxicj40ID0gZG91YmxlIHN0ZXBcclxuICAgICogPGJyPlswLCAyLCAyLCAxLCAyLCAyLCAyXSByZXByZXNlbnRzIHRoZSBtYWpvciBzY2FsZVxyXG4gICAgKiA8YnI+PGJyPiBTY2FsZSB0ZW1wbGF0ZXMgbWF5IGhhdmUgYXJiaXRyYXkgbGVuZ3Roc1xyXG4gICAgKlxyXG4gICAgKiBUaGUgZm9sbG93aW5nIFByZS1kZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOlxyXG4gICAgKiA8dGFibGU+XHJcbiAgICAqIDx0cj5cclxuICAgICogPHRkPm1ham9yPC90ZD5cclxuICAgICogPHRkPm1pbm9yPC90ZD5cclxuICAgICogPHRkPmlvbmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5kb3JpYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnBocnlnaWFuPC90ZD5cclxuICAgICogPHRkPmx5ZGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5taXhvbHlkaWFuPC90ZD5cclxuICAgICogPHRkPmFlb2xpYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmxvY3JpYW48L3RkPlxyXG4gICAgKiA8dGQ+ZW5pZ21hdGljTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+ZW5pZ21hdGljTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I3YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1ham9yN3M0czU8L3RkPlxyXG4gICAgKiA8dGQ+aGFybW9uaWNNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5oYXJtb25pY01pbm9yPC90ZD5cclxuICAgICogPHRkPmRvdWJsZUhhcm1vbmljPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tZWxvZGljTWlub3JBc2NlbmRpbmc8L3RkPlxyXG4gICAgKiA8dGQ+bWVsb2RpY01pbm9yRGVzY2VuZGluZzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbm9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAqIDx0ZD5iNVBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I2UGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZGltOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+bmVvcG9saXRhbk1ham9yPC90ZD5cclxuICAgICogPHRkPm5lb3BvbGl0YW5NaW5vcjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuR3lwc3k8L3RkPlxyXG4gICAgKiA8dGQ+c3BhbmlzaDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+c3BhbmlzaDhUb25lPC90ZD5cclxuICAgICogPHRkPnNwYW5pc2hHeXBzeTwvdGQ+XHJcbiAgICAqIDx0ZD5hdWdtZW50ZWQ8L3RkPlxyXG4gICAgKiA8dGQ+ZG9taW5hbnRTdXNwZW5kZWQ8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmJlYm9wTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+YmVib3BEb21pbmFudDwvdGQ+XHJcbiAgICAqIDx0ZD5teXN0aWM8L3RkPlxyXG4gICAgKiA8dGQ+b3ZlcnRvbmU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmxlYWRpbmdUb25lPC90ZD5cclxuICAgICogPHRkPmhpcm9qb3NoaTwvdGQ+XHJcbiAgICAqIDx0ZD5qYXBhbmVzZUE8L3RkPlxyXG4gICAgKiA8dGQ+amFwYW5lc2VCPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5vcmllbnRhbDwvdGQ+XHJcbiAgICAqIDx0ZD5hcmFiaWFuPC90ZD5cclxuICAgICogPHRkPnBlcnNpYW48L3RkPlxyXG4gICAgKiA8dGQ+YmFsaW5lc2U8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmt1bW9pPC90ZD5cclxuICAgICogPHRkPnBlbG9nPC90ZD5cclxuICAgICogPHRkPmFsZ2VyaWFuPC90ZD5cclxuICAgICogPHRkPmNoaW5lc2U8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1vbmdvbGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5lZ3lwdGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAqIDx0ZD5yb21hbmlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgKiA8dGQ+aW5zZW48L3RkPlxyXG4gICAgKiA8dGQ+aXdhdG88L3RkPlxyXG4gICAgKiA8dGQ+c2NvdHRpc2g8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnlvPC90ZD5cclxuICAgICogPHRkPmlzdHJpYW48L3RkPlxyXG4gICAgKiA8dGQ+dWtyYW5pYW5Eb3JpYW48L3RkPlxyXG4gICAgKiA8dGQ+cGV0cnVzaGthPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5haGF2YXJhYmE8L3RkPlxyXG4gICAgKiA8dGQ+aGFsZkRpbWluaXNoZWQ8L3RkPlxyXG4gICAgKiA8dGQ+amV3aXNoPC90ZD5cclxuICAgICogPHRkPmJ5emFudGluZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YWNvdXN0aWM8L3RkPlxyXG4gICAgKiA8L3RhYmxlPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7U2NhbGV9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgKiBpbXBvcnQge1NjYWxlVGVtcGxhdGVzfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICogaW1wb3J0IHtTY2FsZUluaXRpYWxpemVyfSBmcm9tICdtdXNpY3RoZW9yeWpzJzsgLy8gVHlwZVNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIFNjYWxlIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7U2NhbGUsIFNjYWxlVGVtcGxhdGVzfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgZGVmYXVsdCB0ZW1wbGF0ZSwga2V5IDBmIDAoQykgYW5kIGFuIG9jdGF2ZSBvZiA0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSB0ZW1wbGF0ZSBbMCwgMiwgMiwgMSwgMiwgMiwgMl0gYW5kIGtleSA0KEUpIGFuZCBvY3RhdmUgNVxyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gbmV3IFNjYWxlKHtrZXk6IDQsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1ham9yfSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogbm90ZS1uYW1lW2FsdGVyYXRpb25dW29jdGF2ZV1bKHNjYWxlLW5hbWUpXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIG1pbm9yIHRlbXBsYXRlLCBrZXkgR2IgYW5kIGFuIG9jdGF2ZSBvZiA3XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTMgPSBuZXcgU2NhbGUoJ0diNyhtaW5vciknKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gREVGQVVMVF9TQ0FMRV9URU1QTEFURTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlcyA9IHBhcnNlU2NhbGUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFsuLi4odmFsdWVzPy50ZW1wbGF0ZSA/PyBERUZBVUxUX1NDQUxFX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gdmFsdWVzLmtleSB8fCBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgfHwgREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAvLyBpbXBvcnRhbnQgdGhhdCBvY3RhdmUgaXMgc2V0IGZpcnN0IHNvIHRoYXRcclxuICAgICAgICAgICAgICAgLy8gc2V0dGluZyB0aGUgc2VtaXRvbmUgY2FuIGNoYW5nZSB0aGUgb2N0YXZlXHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBbLi4uKHZhbHVlcz8udGVtcGxhdGUgPz8gREVGQVVMVF9TQ0FMRV9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IHZhbHVlcy5rZXkgfHwgREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlIHx8IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIHVuaXF1ZSBpZCBmb3IgdGhpcyBzY2FsZShhdXRvIGdlbmVyYXRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuaWQpOyAvLyBkaGxrajVqMzIyXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgc2NhbGUgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIHNjYWxlXHJcbiAgICAgICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc2NhbGUgdG8gY29tcGFyZSB0b1xyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgc2NhbGVzIGFyZSBlcXVhbFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmVxdWFscyhzY2FsZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhzY2FsZSkge1xyXG4gICAgICAgICAgIHJldHVybiAodGhpcy5fa2V5ID09PSBzY2FsZS5fa2V5ICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMuX29jdGF2ZSA9PT0gc2NhbGUuX29jdGF2ZSAmJlxyXG4gICAgICAgICAgICAgICBpc0VxdWFsKHRoaXMuX3RlbXBsYXRlLCBzY2FsZS5fdGVtcGxhdGUpKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhpcyBTY2FsZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgU2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gc2NhbGUuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZXF1YWxzKHNjYWxlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5rZXksXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBjbG9uZSh0aGlzLnRlbXBsYXRlKSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsICE9PSAwKVxyXG4gICAgICAgICAgICAgICBzY2FsZS5zaGlmdCh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICoga2V5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9rZXkgPSAwO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmtleSk7IC8vIDAoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IGtleSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIHRoZSBzZW1pdG9uZSB0byBhIHZhbHVlIG91dHNpZGUgb2YgdGhlIHJhbmdlIFswLCAxMV0oc2VtaXRvbmUpIHdpbGw8YnIvPlxyXG4gICAgICAgICogd3JhcCB0aGUgc2VtaXRvbmUgdG8gdGhlIHJhbmdlIFswLCAxMV0gYW5kIGNoYW5nZSB0aGUgb2N0YXZlIGRlcGVuZGluZzxici8+XHJcbiAgICAgICAgKiBvbiBob3cgbWFueSB0aW1lcyB0aGUgc2VtaXRvbmUgaGFzIGJlZW4gd3JhcHBlZC5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUua2V5ID0gNDtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmtleSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQga2V5KHZhbHVlKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAodmFsdWUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHRoaXMub2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICB0aGlzLl9rZXkgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUub2N0YXZlKTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS5vY3RhdmUgPSA1O1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUub2N0YXZlKTsgLy8gNVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcCh2YWx1ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHRlbXBsYXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90ZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRlbXBsYXRlKTsgLy8gWzAsIDIsIDIsIDEsIDIsIDIsIDJdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgIHJldHVybiBjbG9uZSh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBmb2xsb3dpbmcgUHJlLWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6XHJcbiAgICAgICAgKiA8dGFibGU+XHJcbiAgICAgICAgKiA8dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5pb25pYW48L3RkPlxyXG4gICAgICAgICogPHRkPmRvcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5waHJ5Z2lhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bHlkaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5taXhvbHlkaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5hZW9saWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmxvY3JpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmVuaWdtYXRpY01ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5lbmlnbWF0aWNNaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I3YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3I3czRzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFybW9uaWNNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFybW9uaWNNaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG91YmxlSGFybW9uaWM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWVsb2RpY01pbm9yQXNjZW5kaW5nPC90ZD5cclxuICAgICAgICAqIDx0ZD5tZWxvZGljTWlub3JEZXNjZW5kaW5nPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1ham9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbm9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgICAgICogPHRkPmI1UGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I2UGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kaW04VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPm5lb3BvbGl0YW5NYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bmVvcG9saXRhbk1pbm9yPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbk1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5NaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuR3lwc3k8L3RkPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2g8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaDhUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoR3lwc3k8L3RkPlxyXG4gICAgICAgICogPHRkPmF1Z21lbnRlZDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9taW5hbnRTdXNwZW5kZWQ8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YmVib3BNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YmVib3BEb21pbmFudDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bXlzdGljPC90ZD5cclxuICAgICAgICAqIDx0ZD5vdmVydG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5sZWFkaW5nVG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGlyb2pvc2hpPC90ZD5cclxuICAgICAgICAqIDx0ZD5qYXBhbmVzZUE8L3RkPlxyXG4gICAgICAgICogPHRkPmphcGFuZXNlQjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5vcmllbnRhbDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXJhYmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGVyc2lhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YmFsaW5lc2U8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+a3Vtb2k8L3RkPlxyXG4gICAgICAgICogPHRkPnBlbG9nPC90ZD5cclxuICAgICAgICAqIDx0ZD5hbGdlcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+Y2hpbmVzZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tb25nb2xpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmVneXB0aWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cm9tYW5pYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgICAgICogPHRkPmluc2VuPC90ZD5cclxuICAgICAgICAqIDx0ZD5pd2F0bzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c2NvdHRpc2g8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+eW88L3RkPlxyXG4gICAgICAgICogPHRkPmlzdHJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnVrcmFuaWFuRG9yaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZXRydXNoa2E8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YWhhdmFyYWJhPC90ZD5cclxuICAgICAgICAqIDx0ZD5oYWxmRGltaW5pc2hlZDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amV3aXNoPC90ZD5cclxuICAgICAgICAqIDx0ZD5ieXphbnRpbmU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YWNvdXN0aWM8L3RkPlxyXG4gICAgICAgICogPC90YWJsZT5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUudGVtcGxhdGUgPSBbMCwgMiwgMiwgMSwgMiwgMiwgMl07XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50ZW1wbGF0ZSk7IC8vIFswLCAyLCAyLCAxLCAyLCAyLCAyXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gY2xvbmUodmFsdWUpO1xyXG4gICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG5vdGVzXHJcbiAgICAgICAgKiBub3RlcyBhcmUgZ2VuZXJhdGVkIGFuZCBjYWNoZWQgYXMgbmVlZGVkXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9ub3RlcyA9IFtdO1xyXG4gICAgICAgX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB3aWxsIGdlbmVyYXRlIHRoZSBub3RlcyBpZiBuZWVkZWQgb3IgcmV0dXJuIHRoZSBjYWNoZWQgbm90ZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubm90ZXMpOyAvLyBMaXN0IG9mIG5vdGVzXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG5vdGVzKCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9ub3Rlc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOb3RlcygpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZ2VuZXJhdGUgbm90ZXMoaW50ZXJuYWwpXHJcbiAgICAgICAgKiBnZW5lcmF0ZXMgdGhlIG5vdGVzIGZvciB0aGlzIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdlbmVyYXRlTm90ZXMoKSB7XHJcbiAgICAgICAgICAgLy8gdXNlIHRoZSB0ZW1wbGF0ZSB1bnNoaWZ0ZWQgZm9yIHNpbXBsaWNpdHlcclxuICAgICAgICAgICBjb25zdCB1bnNoaWZ0ZWRUZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCAtdGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICAvLyBpZiBhbGxvd2luZyB0aGlzIHRvIGNoYW5nZSB0aGUgb2N0YXZlIGlzIHVuZGVzaXJhYmxlXHJcbiAgICAgICAgICAgLy8gdGhlbiBtYXkgbmVlZCB0byBwcmUgd3JhcCB0aGUgdG9uZSBhbmQgdXNlXHJcbiAgICAgICAgICAgLy8gdGhlIGZpbmFsIHZhbHVlXHJcbiAgICAgICAgICAgY29uc3Qgbm90ZXMgPSBbXTtcclxuICAgICAgICAgICBsZXQgYWNjdW11bGF0b3IgPSB0aGlzLmtleTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHVuc2hpZnRlZFRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRvbmUgPSBpbnRlcnZhbCA9PT0gMFxyXG4gICAgICAgICAgICAgICAgICAgPyAoYWNjdW11bGF0b3IgPSB0aGlzLmtleSlcclxuICAgICAgICAgICAgICAgICAgIDogKGFjY3VtdWxhdG9yICs9IGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiB0b25lLFxyXG4gICAgICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnB1c2gobm90ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIHNoaWZ0IG5vdGVzIGJhY2sgdG8gb3JpZ2luYWwgcG9zaXRpb25cclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsID4gMCkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gbm90ZXMuc3BsaWNlKG5vdGVzLmxlbmd0aCAtICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKyAxKSwgSW5maW5pdHkpO1xyXG4gICAgICAgICAgICAgICBub3Rlcy51bnNoaWZ0KC4uLnRlbXApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsIDwgMCkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gbm90ZXMuc3BsaWNlKDAsIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnB1c2goLi4udGVtcCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzID0gbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBub3RlcyBpbiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBwYXJhbSBwcmVmZXJTaGFycEtleXMgLSBpZiB0cnVlIHRoZW4gc2hhcnBzIHdpbGwgYmUgcHJlZmVycmVkIG92ZXIgZmxhdHMgd2hlbiBzZW1pdG9uZXMgY291bGQgYmUgZWl0aGVyIC0gZXg6IEJiL0EjXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG5vdGVzIGluIHRoZSBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5uYW1lcyk7IC8vIFsnQzQnLCAnRDQnLCAnRTQnLCAnRjQnLCAnRzQnLCAnQTQnLCAnQjQnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE5vdGVOYW1lcyhwcmVmZXJTaGFycEtleSA9IHRydWUpIHtcclxuICAgICAgICAgICBjb25zdCBuYW1lcyA9IHNjYWxlTm90ZU5hbWVMb29rdXAodGhpcywgcHJlZmVyU2hhcnBLZXkpO1xyXG4gICAgICAgICAgIHJldHVybiBuYW1lcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZGVncmVlXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbm90ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGRlZ3JlZVxyXG4gICAgICAgICogQHBhcmFtIGRlZ3JlZSAtIHRoZSBkZWdyZWUgdG8gcmV0dXJuXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5vdGUgdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBkZWdyZWVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZGVncmVlKDApKTsgLy8gQzQoTm90ZSlcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRlZ3JlZSgxKSk7IC8vIEQ0KE5vdGUpIGV0Y1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRlZ3JlZShkZWdyZWUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcChkZWdyZWUgLSAxIC8qemVybyBpbmRleCAqLywgMCwgdGhpcy5ub3Rlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICBjb25zdCBub3RlID0gdGhpcy5ub3Rlc1t3cmFwcGVkLnZhbHVlXS5jb3B5KCk7XHJcbiAgICAgICAgICAgbm90ZS5vY3RhdmUgPSB0aGlzLm9jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgcmV0dXJuIG5vdGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJlbGF0aXZlIG1ham9yXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1ham9yIG9mIHRoaXMgc2NhbGUgLSB0YWtlcyB0aGUgM3JkIGRlZ3JlZSBhcyBpdCdzIGtleVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWFqb3Igb2YgdGhpcyBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5yZWxhdGl2ZU1ham9yKCkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHJlbGF0aXZlTWFqb3IoKSB7XHJcbiAgICAgICAgICAgY29uc3QgbWFqb3IgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3IsXHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5kZWdyZWUoMykuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG1ham9yO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZWxhdGl2ZSBtaW5vclxyXG4gICAgICAgICogcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtaW5vciBvZiB0aGlzIHNjYWxlIC0gdGFrZXMgdGhlIDZ0aCBkZWdyZWUgYXMgaXQncyBrZXlcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1pbm9yIG9mIHRoaXMgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucmVsYXRpdmVNaW5vcigpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICByZWxhdGl2ZU1pbm9yKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG1pbm9yID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1pbm9yLFxyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMuZGVncmVlKDYpLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIHJldHVybiBtaW5vcjtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRcclxuICAgICAgICAqL1xyXG4gICAgICAgX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICBfb3JpZ2luYWxUZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdFxyXG4gICAgICAgICogc2hpZnRzIHRoZSBzY2FsZSBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBwYXJhbSBzaGlmdCAtIHRoZSBudW1iZXIgb2YgZGVncmVlcyB0byBzaGlmdCB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHNoaWZ0ZWQgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0KGRlZ3JlZXMgPSAxKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlID0gY2xvbmUodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCBkZWdyZWVzKTtcclxuICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKz0gZGVncmVlcztcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRlZFxyXG4gICAgICAgICogcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHBhcmFtIGRlZ3JlZXMgLSB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgdG8gc2hpZnQgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdGVkKDEpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdGVkKGRlZ3JlZXMgPSAxKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS5zaGlmdChkZWdyZWVzKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuc2hpZnRcclxuICAgICAgICAqIHNoaWZ0cyB0aGUgb3JpZ2luYWwgcm9vdCBiYWNrIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGlzIHNjYWxlIGFmdGVyIHVuc2hpZnRpbmcgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS51bnNoaWZ0KCkpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHVuc2hpZnQoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHRoaXMuX29yaWdpbmFsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy8gdGhpcy5zaGlmdCh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKiAtMSk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsVGVtcGxhdGUgPSBbXTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bnNoaWZ0ZWRcclxuICAgICAgICAqIHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgd2l0aCB0aGUgdG9uaWMgc2hpZnRlZCBiYWNrXHJcbiAgICAgICAgKiB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgd2l0aCB0aGUgdG9uaWMgc2hpZnRlZCBiYWNrXHJcbiAgICAgICAgKiB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS51bnNoaWZ0ZWQoKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdW5zaGlmdGVkKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX29yaWdpbmFsVGVtcGxhdGUubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IHRoaXMuX29yaWdpbmFsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgc2NhbGUudW5zaGlmdCgpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgYW1vdW50IHRoYXQgdGhlIHNjYWxlIGhhcyBzaGlmdGVkXHJcbiAgICAgICAgKiAoMCBpZiBub3Qgc2hpZnRlZClcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBhbW91bnQgdGhhdCB0aGUgc2NhbGUgaGFzIHNoaWZ0ZWRcclxuICAgICAgICAqICgwIGlmIG5vdCBzaGlmdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdGVkKCkpOyAvLyAxXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnRlZEludGVydmFsKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9zaGlmdGVkSW50ZXJ2YWw7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNjYWxlIG1vZGVzXHJcbiAgICAgICAgKi9cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIElvbmlhbihtYWpvcikgbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5pb25pYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW9uaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5pb25pYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgRG9yaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZG9yaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRvcmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuZG9yaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIFBocnlnaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucGhyeWdpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcGhyeWdpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLnBocnlnaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIEx5ZGlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmx5ZGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBseWRpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmx5ZGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBNaXhvbHlkaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubWl4b2x5ZGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaXhvbHlkaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5taXhvbHlkaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIEFlb2xpYW4obWlub3IpIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuYWVvbGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhZW9saWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5hZW9saWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIExvY3JpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5sb2NyaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGxvY3JpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmxvY3JpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgc3RyaW5nIHZlcnNpb24gb2YgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRvU3RyaW5nKCkpOyAvLyAnQydcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICBsZXQgc2NhbGVOYW1lcyA9IHNjYWxlTmFtZUxvb2t1cCh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgaWYgKCFzY2FsZU5hbWVzKVxyXG4gICAgICAgICAgICAgICBzY2FsZU5hbWVzID0gdGhpcy5nZXROb3RlTmFtZXMoKS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgcmV0dXJuIGAke1NlbWl0b25lJDFbdGhpcy5fa2V5XX0ke3RoaXMuX29jdGF2ZX0oJHtzY2FsZU5hbWVzfSlgO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBsb29rdXAgdGhlIG5vdGUgbmFtZSBmb3IgYSBzY2FsZSBlZmZpY2llbnRseVxyXG4gICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc2NhbGUgdG8gbG9va3VwXHJcbiAgICAqIEBwYXJhbSBwcmVmZXJTaGFycEtleSAtIGlmIHRydWUsIHdpbGwgcHJlZmVyIHNoYXJwIGtleXMgb3ZlciBmbGF0IGtleXNcclxuICAgICogQHJldHVybnMgdGhlIG5vdGUgbmFtZXMgZm9yIHRoZSBzY2FsZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNjYWxlTm90ZU5hbWVMb29rdXAgPSAoc2NhbGUsIHByZWZlclNoYXJwS2V5ID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtzY2FsZS5rZXl9LSR7c2NhbGUub2N0YXZlfS0ke0pTT04uc3RyaW5naWZ5KHNjYWxlLnRlbXBsYXRlKX1gO1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGVzID0gbm90ZXNMb29rdXAoa2V5KTtcclxuICAgICAgICAgICBpZiAobm90ZXMpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIG5vdGVzO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVzID0gWy4uLnNjYWxlLm5vdGVzXTtcclxuICAgICAgIG5vdGVzID0gc2hpZnQobm90ZXMsIC1zY2FsZS5zaGlmdGVkSW50ZXJ2YWwoKSk7IC8vdW5zaGlmdCBiYWNrIHRvIGtleSA9IDAgaW5kZXhcclxuICAgICAgIGNvbnN0IG5vdGVzUGFydHMgPSBub3Rlcy5tYXAoKG5vdGUpID0+IG5vdGUudG9TdHJpbmcoKS5zcGxpdChcIi9cIikpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlcyA9IG5vdGVzLm1hcCgobm90ZSkgPT4gbm90ZS5vY3RhdmUpO1xyXG4gICAgICAgY29uc3QgcmVtb3ZhYmxlcyA9IFtcIkIjXCIsIFwiQnNcIiwgXCJDYlwiLCBcIkUjXCIsIFwiRXNcIiwgXCJGYlwiXTtcclxuICAgICAgIGNvbnN0IG5vdGVOYW1lcyA9IFtdO1xyXG4gICAgICAgZm9yIChjb25zdCBbaSwgbm90ZVBhcnRzXSBvZiBub3Rlc1BhcnRzLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgIC8vcmVtb3ZlIENiIEIjIGV0Y1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBub3RlUGFydHMpIHtcclxuICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBudW1iZXJzIGZyb20gdGhlIG5vdGUgbmFtZShvY3RhdmUpXHJcbiAgICAgICAgICAgICAgIC8vIHBhcnQucmVwbGFjZSgvXFxkL2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICBpZiAocmVtb3ZhYmxlcy5pbmNsdWRlcyhwYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBub3RlTmFtZXMuaW5kZXhPZihwYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgIG5vdGVOYW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChub3RlTmFtZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKHByZWZlclNoYXJwS2V5ID8gbm90ZVBhcnRzWzBdIDogbm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAobm90ZVBhcnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbMF0pO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3Qgd2hvbGVOb3RlcyA9IFtcclxuICAgICAgICAgICAgICAgXCJBXCIsXHJcbiAgICAgICAgICAgICAgIFwiQlwiLFxyXG4gICAgICAgICAgICAgICBcIkNcIixcclxuICAgICAgICAgICAgICAgXCJEXCIsXHJcbiAgICAgICAgICAgICAgIFwiRVwiLFxyXG4gICAgICAgICAgICAgICBcIkZcIixcclxuICAgICAgICAgICAgICAgXCJHXCIsXHJcbiAgICAgICAgICAgICAgIFwiQVwiLFxyXG4gICAgICAgICAgICAgICBcIkJcIixcclxuICAgICAgICAgICAgICAgXCJDXCIsXHJcbiAgICAgICAgICAgICAgIFwiRFwiLFxyXG4gICAgICAgICAgICAgICBcIkVcIixcclxuICAgICAgICAgICAgICAgXCJGXCIsXHJcbiAgICAgICAgICAgICAgIFwiR1wiLFxyXG4gICAgICAgICAgIF07XHJcbiAgICAgICAgICAgY29uc3QgbGFzdFdob2xlTm90ZSA9IG5vdGVOYW1lc1tub3RlTmFtZXMubGVuZ3RoIC0gMV1bMF07XHJcbiAgICAgICAgICAgY29uc3QgbGFzdEluZGV4ID0gd2hvbGVOb3Rlcy5pbmRleE9mKGxhc3RXaG9sZU5vdGUpO1xyXG4gICAgICAgICAgIGNvbnN0IG5leHROb3RlID0gd2hvbGVOb3Rlc1tsYXN0SW5kZXggKyAxXTtcclxuICAgICAgICAgICBpZiAobm90ZVBhcnRzWzBdLmluY2x1ZGVzKG5leHROb3RlKSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBoYXNPY3RhdmUgPSBub3RlUGFydHNbMF0ubWF0Y2goL1xcZC9nKTtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzWzBdICsgKGhhc09jdGF2ZSA/IFwiXCIgOiBvY3RhdmVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCBoYXNPY3RhdmUgPSBub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdLm1hdGNoKC9cXGQvZyk7XHJcbiAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXSArIChoYXNPY3RhdmUgPyBcIlwiIDogb2N0YXZlc1tpXSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qgc2hpZnRlZE5vdGVOYW1lcyA9IHNoaWZ0KG5vdGVOYW1lcywgc2NhbGUuc2hpZnRlZEludGVydmFsKCkpO1xyXG4gICAgICAgcmV0dXJuIHNoaWZ0ZWROb3RlTmFtZXM7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVOb3Rlc0xvb2t1cFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgc2NhbGVUYWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChsZXQgaXRvbmUgPSBUT05FU19NSU47IGl0b25lIDwgVE9ORVNfTUlOICsgT0NUQVZFX01BWDsgaXRvbmUrKykge1xyXG4gICAgICAgICAgIGZvciAobGV0IGlvY3RhdmUgPSBPQ1RBVkVfTUlOOyBpb2N0YXZlIDw9IE9DVEFWRV9NQVg7IGlvY3RhdmUrKykge1xyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAga2V5OiBpdG9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBpb2N0YXZlLFxyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2Ake2l0b25lfS0ke2lvY3RhdmV9LSR7SlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpfWBdID1cclxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZU5vdGVOYW1lTG9va3VwKHNjYWxlKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBzY2FsZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyB0aGUgbG9va3VwIHRhYmxlIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBpcyBsb2FkZWRcclxuICAgICovXHJcbiAgIGxldCBfbm90ZXNMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZXNMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlTm90ZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVzTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVOb3RlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX25vdGVzTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX25vdGVzTG9va3VwO1xyXG4gICAgICAgX25vdGVzTG9va3VwID0gY3JlYXRlTm90ZXNMb29rdXBUYWJsZSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZXNMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBzY2FsZSBub3RlIHRhYmxlXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3Rlc0xvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNob3J0Y3V0IGZvciBtb2RpZmllcnNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBmbGF0ID0gLTE7XHJcbiAgIGNvbnN0IGZsYXRfZmxhdCA9IC0yO1xyXG4gICBjb25zdCBzaGFycCA9IDE7XHJcbiAgIC8qKlxyXG4gICAgKiBDaG9yZCB0ZW1wbGF0ZXNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBDaG9yZFRlbXBsYXRlcyA9IHtcclxuICAgICAgIG1hajogWzEsIDMsIDVdLFxyXG4gICAgICAgbWFqNDogWzEsIDMsIDQsIDVdLFxyXG4gICAgICAgbWFqNjogWzEsIDMsIDUsIDZdLFxyXG4gICAgICAgbWFqNjk6IFsxLCAzLCA1LCA2LCA5XSxcclxuICAgICAgIG1hajc6IFsxLCAzLCA1LCA3XSxcclxuICAgICAgIG1hajk6IFsxLCAzLCA1LCA3LCA5XSxcclxuICAgICAgIG1hajExOiBbMSwgMywgNSwgNywgOSwgMTFdLFxyXG4gICAgICAgbWFqMTM6IFsxLCAzLCA1LCA3LCA5LCAxMSwgMTNdLFxyXG4gICAgICAgbWFqN3MxMTogWzEsIDMsIDUsIDcsIFsxMSwgc2hhcnBdXSxcclxuICAgICAgIG1hamI1OiBbMSwgMywgWzUsIGZsYXRdXSxcclxuICAgICAgIG1pbjogWzEsIFszLCBmbGF0XSwgNV0sXHJcbiAgICAgICBtaW40OiBbMSwgWzMsIGZsYXRdLCA0LCA1XSxcclxuICAgICAgIG1pbjY6IFsxLCBbMywgZmxhdF0sIDUsIDZdLFxyXG4gICAgICAgbWluNzogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdXSxcclxuICAgICAgIG1pbkFkZDk6IFsxLCBbMywgZmxhdF0sIDUsIDldLFxyXG4gICAgICAgbWluNjk6IFsxLCBbMywgZmxhdF0sIDUsIDYsIDldLFxyXG4gICAgICAgbWluOTogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIG1pbjExOiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDksIDExXSxcclxuICAgICAgIG1pbjEzOiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDksIDExLCAxM10sXHJcbiAgICAgICBtaW43YjU6IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTc6IFsxLCAzLCA1LCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb20xMTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOSwgMTFdLFxyXG4gICAgICAgZG9tMTM6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDksIDExLCAxM10sXHJcbiAgICAgICBkb203czU6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tN2I1OiBbMSwgMywgWzUsIGZsYXRdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tN2I5OiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbOSwgZmxhdF1dLFxyXG4gICAgICAgZG9tN3M5OiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbOSwgc2hhcnBdXSxcclxuICAgICAgIGRvbTlzNTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb205YjU6IFsxLCAzLCBbNSwgZmxhdF0sIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb203czVzOTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgWzksIHNoYXJwXV0sXHJcbiAgICAgICBkb203czViOTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgWzksIGZsYXRdXSxcclxuICAgICAgIGRvbTdzMTE6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFsxMSwgc2hhcnBdXSxcclxuICAgICAgIGRpbTogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdXSxcclxuICAgICAgIGRpbTc6IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XSwgWzcsIGZsYXRfZmxhdF1dLFxyXG4gICAgICAgYXVnOiBbMSwgMywgWzUsIHNoYXJwXV0sXHJcbiAgICAgICBzdXMyOiBbMSwgMiwgNV0sXHJcbiAgICAgICBzdXM0OiBbMSwgWzQsIGZsYXRdLCA1XSxcclxuICAgICAgIGZpZnRoOiBbMSwgNV0sXHJcbiAgICAgICBiNTogWzEsIFs1LCBmbGF0XV0sXHJcbiAgICAgICBzMTE6IFsxLCA1LCBbMTEsIHNoYXJwXV0sXHJcbiAgIH07XHJcbiAgIE9iamVjdC5rZXlzKENob3JkVGVtcGxhdGVzKS5mb3JFYWNoKChlbGVtZW50KSA9PiBPYmplY3QuZnJlZXplKENob3JkVGVtcGxhdGVzW2VsZW1lbnRdKSk7XG5cbiAgIGNvbnN0IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUgPSBbMSwgMywgNV07XHJcbiAgIGNvbnN0IERFRkFVTFRfU0NBTEUgPSBuZXcgU2NhbGUoKTtcblxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVMb29rdXAuanNvblwiO1xyXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIGNvbnN0IG5hbWVSZWdleCA9IC8oW0EtR10pKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXggPSAvKCN8c3xiKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCA9IC8oWzAtOV0rKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBjaG9yZE5hbWVSZWdleCA9IC8obWlufG1hanxkaW18YXVnKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBhZGRpdGlvbnNSZWdleCA9IC8oWyN8c3xiXT9bMC05XSspKD8hW14oXSpcXCkpL2c7XHJcbiAgIC8qKlxyXG4gICAgKiBAcGFyYW0gY2hvcmQgdGhlIHN0cmluZyB0byBwYXJzZVxyXG4gICAgKiBAcmV0dXJucyBhIHZhbGlkIENob3JkSW5pdGlhbGl6ZXJcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZUNob3JkID0gKGNob3JkKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNob3JkTG9va3VwKGNob3JkKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgbGV0IGNob3JkTmFtZSA9IFwibWFqXCI7XHJcbiAgICAgICBsZXQgYWRkaXRpb25zID0gW107XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBjaG9yZC5tYXRjaChuYW1lUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IGNob3JkLm1hdGNoKG1vZGlmaWVyUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBjaG9yZC5tYXRjaChvY3RhdmVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBjaG9yZE5hbWVNYXRjaCA9IGNob3JkLm1hdGNoKGNob3JkTmFtZVJlZ2V4KT8uam9pbihcIlwiKTtcclxuICAgICAgIGNvbnN0IGFkZGl0aW9uc01hdGNoID0gY2hvcmQubWF0Y2goYWRkaXRpb25zUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGNob3JkTmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgLy8gY29uc3QgW25hbWVdID0gY2hvcmROYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgY2hvcmROYW1lID0gY2hvcmROYW1lTWF0Y2g7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoYWRkaXRpb25zTWF0Y2gpIHtcclxuICAgICAgICAgICBhZGRpdGlvbnMgPSBhZGRpdGlvbnNNYXRjaDtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IGludGVydmFscyA9IFtdO1xyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIGludGVydmFscy5wdXNoKC4uLkNob3JkVGVtcGxhdGVzW2Nob3JkTmFtZV0pO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgYWRkaXRpb24gb2YgYWRkaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2QgPSAwO1xyXG4gICAgICAgICAgICAgICBpZiAoYWRkaXRpb25bMF0gPT09IFwiI1wiIHx8IGFkZGl0aW9uWzBdID09PSBcInNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gMTtcclxuICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2UgaWYgKGFkZGl0aW9uWzBdID09PSBcImJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBhZGRpdGlvbk51bSA9IHBhcnNlSW50KGFkZGl0aW9uLCAxMCk7XHJcbiAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbHMuaW5jbHVkZXMoYWRkaXRpb25OdW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGludGVydmFscy5pbmRleE9mKGFkZGl0aW9uTnVtKTtcclxuICAgICAgICAgICAgICAgICAgIGludGVydmFsc1tpbmRleF0gPSBbYWRkaXRpb25OdW0sIG1vZF07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbnRlcnZhbHMucHVzaChbYWRkaXRpb25OdW0sIG1vZF0pO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIHJvb3Q6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IGludGVydmFscyxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjaG9yZCBuYW1lXCIpO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogQHJldHVybnMgYSBsb29rdXAgdGFibGUgb2YgY2hvcmQgbmFtZXMgYW5kIHRoZWlyIGluaXRpYWxpemVyc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBjb25zdCBxdWFsaXRpZXMgPSBbXCJtYWpcIiwgXCJtaW5cIiwgXCJkaW1cIiwgXCJhdWdcIiwgXCJzdXNcIl07XHJcbiAgICAgICBjb25zdCBhZGRpdGlvbnMgPSBbXHJcbiAgICAgICAgICAgXCJcIixcclxuICAgICAgICAgICBcIjJcIixcclxuICAgICAgICAgICBcIjNcIixcclxuICAgICAgICAgICBcIjRcIixcclxuICAgICAgICAgICBcIjVcIixcclxuICAgICAgICAgICBcIjZcIixcclxuICAgICAgICAgICBcIjdcIixcclxuICAgICAgICAgICBcIjlcIixcclxuICAgICAgICAgICBcIjExXCIsXHJcbiAgICAgICAgICAgXCIxM1wiLFxyXG4gICAgICAgICAgIFwiYjJcIixcclxuICAgICAgICAgICBcImIzXCIsXHJcbiAgICAgICAgICAgXCJiNFwiLFxyXG4gICAgICAgICAgIFwiYjVcIixcclxuICAgICAgICAgICBcImI2XCIsXHJcbiAgICAgICAgICAgXCJiN1wiLFxyXG4gICAgICAgICAgIFwiYjlcIixcclxuICAgICAgICAgICBcImIxMVwiLFxyXG4gICAgICAgICAgIFwiYjEzXCIsXHJcbiAgICAgICAgICAgXCJzMlwiLFxyXG4gICAgICAgICAgIFwiczNcIixcclxuICAgICAgICAgICBcInM0XCIsXHJcbiAgICAgICAgICAgXCJzNVwiLFxyXG4gICAgICAgICAgIFwiczZcIixcclxuICAgICAgICAgICBcInM3XCIsXHJcbiAgICAgICAgICAgXCJzOVwiLFxyXG4gICAgICAgICAgIFwiczExXCIsXHJcbiAgICAgICAgICAgXCJzMTNcIixcclxuICAgICAgICAgICBcIiMyXCIsXHJcbiAgICAgICAgICAgXCIjM1wiLFxyXG4gICAgICAgICAgIFwiIzRcIixcclxuICAgICAgICAgICBcIiM1XCIsXHJcbiAgICAgICAgICAgXCIjNlwiLFxyXG4gICAgICAgICAgIFwiIzdcIixcclxuICAgICAgICAgICBcIiM5XCIsXHJcbiAgICAgICAgICAgXCIjMTFcIixcclxuICAgICAgICAgICBcIiMxM1wiLFxyXG4gICAgICAgICAgIFwiN3MxMVwiLFxyXG4gICAgICAgICAgIFwiNyMxMVwiLFxyXG4gICAgICAgICAgIFwiN2I5XCIsXHJcbiAgICAgICAgICAgXCI3IzlcIixcclxuICAgICAgICAgICBcIjdiNVwiLFxyXG4gICAgICAgICAgIFwiNyM1XCIsXHJcbiAgICAgICAgICAgXCI3YjliNVwiLFxyXG4gICAgICAgICAgIFwiNyM5IzVcIixcclxuICAgICAgICAgICBcIjdiMTNcIixcclxuICAgICAgICAgICBcIjcjMTNcIixcclxuICAgICAgICAgICBcIjkjNVwiLFxyXG4gICAgICAgICAgIFwiOWI1XCIsXHJcbiAgICAgICAgICAgXCI5IzExXCIsXHJcbiAgICAgICAgICAgXCI5YjExXCIsXHJcbiAgICAgICAgICAgXCI5IzEzXCIsXHJcbiAgICAgICAgICAgXCI5YjEzXCIsXHJcbiAgICAgICAgICAgXCIxMSM1XCIsXHJcbiAgICAgICAgICAgXCIxMWI1XCIsXHJcbiAgICAgICAgICAgXCIxMSM5XCIsXHJcbiAgICAgICAgICAgXCIxMWI5XCIsXHJcbiAgICAgICAgICAgXCIxMSMxM1wiLFxyXG4gICAgICAgICAgIFwiMTFiMTNcIixcclxuICAgICAgIF07XHJcbiAgICAgICBmb3IgKGNvbnN0IHF1YWxpdHkgb2YgcXVhbGl0aWVzKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBhZGRpdGlvbiBvZiBhZGRpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlTGV0dGVyIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVNb2RpZmllciBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9JHtub3RlTW9kaWZpZXJ9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gT0NUQVZFX01JTjsgaSA8PSBPQ1RBVkVfTUFYOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9JHtub3RlTW9kaWZpZXJ9JHtpfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgbGV0IF9jaG9yZExvb2t1cCA9IHt9O1xyXG4gICAvKipcclxuICAgICogQHBhcmFtIGtleSB0aGUgc3RyaW5nIHRvIGxvb2t1cFxyXG4gICAgKiBAcmV0dXJucyBhIHZhbGlkIGNob3JkIGluaXRpYWxpemVyXHJcbiAgICAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGtleSBpcyBub3QgYSB2YWxpZCBjaG9yZFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNob3JkTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRDaG9yZFRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX2Nob3JkTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IHRhYmxlIGFzIHsgW2tleTogc3RyaW5nXTogQ2hvcmRJbml0aWFsaXplciB9O1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkQ2hvcmRUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfY2hvcmRMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfY2hvcmRMb29rdXA7XHJcbiAgICAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfY2hvcmRMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBjaG9yZCB0YWJsZVwiKTtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5lbnRyaWVzKF9jaG9yZExvb2t1cCkubGVuZ3RoKTtcclxuICAgICAgIHJldHVybiBfY2hvcmRMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBDaG9yZHMgY29uc2lzdCBvZiBhIHJvb3Qgbm90ZSwgb2N0YXZlLCBjaG9yZCB0ZW1wbGF0ZSwgYW5kIGEgYmFzZSBzY2FsZS48YnI+PGJyPlxyXG4gICAgKiBUaGUgY2hvcmQgdGVtcGxhdGUgaXMgYW4gYXJyYXkgb2YgaW50ZWdlcnMsIGVhY2ggaW50ZWdlciByZXByZXNlbnRpbmc8YnI+XHJcbiAgICAqICBhIHNjYWxlIGRlZ3JlZSBmcm9tIHRoZSBiYXNlIHNjYWxlKGRlZmF1bHRzIHRvIG1ham9yKS48YnI+XHJcbiAgICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGlzIHRoZSBJLElJSSxWIGRlbm90ZWQgYXMgWzEsMyw1XTxicj5cclxuICAgICogQ2hvcmRJbnRlcnZhbHMgdXNlZCBpbiB0ZW1wbGF0ZXMgY2FuIGFsc28gY29udGFpbiBhIG1vZGlmaWVyLDxicj5cclxuICAgICogZm9yIGEgcGFydGljdWxhciBzY2FsZSBkZWdyZWUsIHN1Y2ggYXMgWzEsMyxbNSwgLTFdXTxicj5cclxuICAgICogd2hlcmUgLTEgaXMgZmxhdCwgMCBpcyBuYXR1cmFsLCBhbmQgMSBpcyBzaGFycC48YnI+XHJcbiAgICAqIEl0IGNvdWxkIGFsc28gYmUgd3JpdHRlbiBhcyBbMSwzLFs1LCBtb2RpZmllci5mbGF0XV08YnI+XHJcbiAgICAqIGlmIHlvdSBpbXBvcnQgbW9kaWZpZXIuXHJcbiAgICAqXHJcbiAgICAqIFRoZSBmb2xsb3dpbmcgcHJlZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTo8YnI+XHJcbiAgICAqIDx0YWJsZT5cclxuICAgICogPHRyPlxyXG4gICAgKiA8dGQ+bWFqPC90ZD5cclxuICAgICogPHRkPm1hajQ8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNjwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo2OTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqNzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo5PC90ZD5cclxuICAgICogPHRkPm1hajExPC90ZD5cclxuICAgICogPHRkPm1hajEzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWo3czExPC90ZD5cclxuICAgICogPHRkPm1hamI1PC90ZD5cclxuICAgICogPHRkPm1pbjwvdGQ+XHJcbiAgICAqIDx0ZD5taW40PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW42PC90ZD5cclxuICAgICogPHRkPm1pbjc8L3RkPlxyXG4gICAgKiA8dGQ+bWluQWRkOTwvdGQ+XHJcbiAgICAqIDx0ZD5taW42OTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWluOTwvdGQ+XHJcbiAgICAqIDx0ZD5taW4xMTwvdGQ+XHJcbiAgICAqIDx0ZD5taW4xMzwvdGQ+XHJcbiAgICAqIDx0ZD5taW43YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTc8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOTwvdGQ+XHJcbiAgICAqIDx0ZD5kb20xMTwvdGQ+XHJcbiAgICAqIDx0ZD5kb20xMzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tN3M1PC90ZD5cclxuICAgICogPHRkPmRvbTdiNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czk8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN2I5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb205YjU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOXM1PC90ZD5cclxuICAgICogPHRkPmRvbTdzMTE8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3M1czk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTdzNWI5PC90ZD5cclxuICAgICogPHRkPmRpbTwvdGQ+XHJcbiAgICAqIDx0ZD5kaW03PC90ZD5cclxuICAgICogPHRkPmF1ZzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+c3VzMjwvdGQ+XHJcbiAgICAqIDx0ZD5zdXM0PC90ZD5cclxuICAgICogPHRkPmZpZnRoPC90ZD5cclxuICAgICogPHRkPmI1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zMTE8L3RkPlxyXG4gICAgKiA8L3RyPlxyXG4gICAgKiA8L3RhYmxlPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IENob3JkIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZFRlbXBsYXRlfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkSW50ZXJ2YWx9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7TW9kaWZpZXJ9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRJbml0aWFsaXplcn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjsvLyBUeXBlc2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgQ2hvcmQge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHsgQ2hvcmQsIENob3JkVGVtcGxhdGVzLCBNb2RpZmllciB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy9jcmVhdGVzIGEgY2hvcmQgd2l0aCB0aGUgZGVmYXVsdCgxLDMsNSkgdGVtcGxhdGUsIHJvb3Qgb2YgQywgaW4gdGhlIDR0aCBvY3RhdmVcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIGNob3JkIHdpdGggdGhlIHByZS1kZWZpbmVkIGRpbWluaXNoZWQgdGVtcGxhdGUsIHJvb3Qgb2YgRWIsIGluIHRoZSA1dGggb2N0YXZlXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCh7cm9vdDogMywgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogQ2hvcmRUZW1wbGF0ZXMuZGltfSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiAocm9vdC1ub3RlLW5hbWVbcywjLGJdW29jdGF2ZV0pW2Nob3JkLXRlbXBsYXRlLW5hbWV8W2Nob3JkLXF1YWxpdHldW21vZGlmaWVyc11dXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgY2hvcmQgZnJvbSBhIHN0cmluZ1xyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoJyhENCltaW40Jyk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uREVGQVVMVF9DSE9SRF9URU1QTEFURV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VDaG9yZCh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi4ocGFyc2VkPy50ZW1wbGF0ZSA/PyBERUZBVUxUX0NIT1JEX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gcGFyc2VkPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHBhcnNlZD8ucm9vdCA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uKHZhbHVlcy50ZW1wbGF0ZSA/PyBERUZBVUxUX0NIT1JEX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gdmFsdWVzLnJvb3QgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiB0aGlzLl9yb290LCBvY3RhdmU6IHRoaXMuX29jdGF2ZSB9KTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlkKTsgLy8gaGFsODkzNGhsbFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJvb3RcclxuICAgICAgICAqL1xyXG4gICAgICAgX3Jvb3QgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnJvb3QpOyAvLyAwKHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCByb290KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIHRoZSByb290IHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIDExXShzZW1pdG9uZSkgd2lsbDxici8+XHJcbiAgICAgICAgKiB3cmFwIHRoZSBzZW1pdG9uZSB0byB0aGUgcmFuZ2UgWzAsIDExXSBhbmQgY2hhbmdlIHRoZSBvY3RhdmUgZGVwZW5kaW5nPGJyLz5cclxuICAgICAgICAqIG9uIGhvdyBtYW55IHRpbWVzIHRoZSBzZW1pdG9uZSBoYXMgYmVlbiB3cmFwcGVkLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5yb290ID0gNDsgLy8gc2V0cyB0aGUgcm9vdCB0byA0dGggc2VtaXRvbmUoRSlcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnJvb3QpOyAvLyA0KHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCByb290KHZhbHVlKSB7XHJcbiAgICAgICAgICAgLy8gdGhpcy5fcm9vdCA9IHZhbHVlO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHZhbHVlLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fcm9vdCA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gdGhpcy5fb2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogYmFzZSBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfYmFzZVNjYWxlID0gREVGQVVMVF9TQ0FMRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5iYXNlU2NhbGUpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgc2NhbGUobWFqb3IpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IGJhc2VTY2FsZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFzZVNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBOb3QgYSBsb3Qgb2YgZ29vZCByZWFzb25zIHRvIGNoYW5nZSB0aGlzIGV4Y2VwdCBmb3IgZXhwZXJpbWVudGF0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmJhc2VTY2FsZSA9IG5ldyBTY2FsZSh7IGtleTogMywgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogWzEsIFszLCBNb2RpZmllci5mbGF0XSwgNV0gfSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5iYXNlU2NhbGUpOyAvLyBwcmludHMgdGhlIG1pbm9yIHNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGJhc2VTY2FsZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZS5vY3RhdmUgPSB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5vY3RhdmUpOyAvLyA0KG9jdGF2ZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQub2N0YXZlID0gNTsgLy8gc2V0cyB0aGUgb2N0YXZlIHRvIDV0aFxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQub2N0YXZlKTsgLy8gNShvY3RhdmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKHZhbHVlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUub2N0YXZlID0gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB0ZW1wbGF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCB0ZW1wbGF0ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gWy4uLnRoaXMuX3RlbXBsYXRlXTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIGZvbGxvd2luZyBwcmVkZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOjxicj5cclxuICAgICAgICAqIDx0YWJsZT5cclxuICAgICAgICAqIDx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajQ8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajY8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajY5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1hajc8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajk8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajExPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWoxMzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo3czExPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpiNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW40PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbjY8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjc8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbkFkZDk8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjY5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbjk8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjExPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW4xMzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluN2I1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTc8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTk8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTExPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb20xMzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203czU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdiNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M5PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203Yjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOWI1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb205czU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzMTE8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzNXM5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTdzNWI5PC90ZD5cclxuICAgICAgICAqIDx0ZD5kaW08L3RkPlxyXG4gICAgICAgICogPHRkPmRpbTc8L3RkPlxyXG4gICAgICAgICogPHRkPmF1ZzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zdXMyPC90ZD5cclxuICAgICAgICAqIDx0ZD5zdXM0PC90ZD5cclxuICAgICAgICAqIDx0ZD5maWZ0aDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+czExPC90ZD5cclxuICAgICAgICAqIDwvdHI+XHJcbiAgICAgICAgKiA8L3RhYmxlPlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC50ZW1wbGF0ZSA9IFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIDVdOyAvLyBzZXRzIHRoZSB0ZW1wbGF0ZSB0byBhIG1pbm9yIGNob3JkXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIHByaW50cyB0aGUgbmV3IHRlbXBsYXRlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4udmFsdWVdO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBub3Rlc1xyXG4gICAgICAgICogbm90ZXMgYXJlIGdlbmVyYXRlZCBhbmQgY2FjaGVkIGFzIG5lZWRlZFxyXG4gICAgICAgICovXHJcbiAgICAgICBfbm90ZXMgPSBbXTtcclxuICAgICAgIF9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogd2lsbCBnZW5lcmF0ZSBub3RlcyBpZiBuZWVkZWQgb3IgcmV0dXJuIHRoZSBjYWNoZWQgbm90ZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQubm90ZXMpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgbm90ZXNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgbm90ZXMoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX25vdGVzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBnZW5lcmF0ZSBub3RlcyhpbnRlcm5hbClcclxuICAgICAgICAqIGdlbmVyYXRlcyB0aGUgbm90ZXMgZm9yIHRoaXMgc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2VuZXJhdGVOb3RlcygpIHtcclxuICAgICAgICAgICB0aGlzLl9ub3RlcyA9IFtdO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgbGV0IHRvbmUgPSAwO1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kID0gMDtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICB0b25lID0gaW50ZXJ2YWxbMF07XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSBpbnRlcnZhbFsxXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIHRvbmUgPSBpbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB0b25lO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlID0gdGhpcy5fYmFzZVNjYWxlLmRlZ3JlZShvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlVG9uZSA9IG5vdGUuc2VtaXRvbmU7XHJcbiAgICAgICAgICAgICAgIG5vdGUuc2VtaXRvbmUgPSBub3RlVG9uZSArIG1vZDtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbm90ZSBuYW1lcyAtPiBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXROb3RlTmFtZXMoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZU5hbWVzID0gW107XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHRoaXMubm90ZXMpIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIG5vdGVOYW1lcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZCh7XHJcbiAgICAgICAgICAgICAgIHJvb3Q6IHRoaXMucm9vdCxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFsuLi50aGlzLl90ZW1wbGF0ZV0sXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSBvdGhlciB0aGUgb3RoZXIgY2hvcmQgdG8gY29tcGFyZSB0b1xyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIGNob3JkcyBhcmUgZXF1YWxcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gKHRoaXMucm9vdCA9PT0gb3RoZXIucm9vdCAmJlxyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9PT0gb3RoZXIub2N0YXZlICYmXHJcbiAgICAgICAgICAgICAgIGlzRXF1YWwodGhpcy5fdGVtcGxhdGUsIG90aGVyLnRlbXBsYXRlKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIG5hdHJ1YWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjaG9yZC5tYWpvcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWFqb3IoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goMyk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSAzO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgbmF0dXJhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5tYWpvcmVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1ham9yZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLm1ham9yKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIG5hdHVyYWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWFqb3IoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc01ham9yKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgbXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsWzMsLTFdLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWlub3IoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzMsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbMywgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLm1pbm9yZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSxbMywtMV0sNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaW5vcmVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5taW5vcigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01pbm9yKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWlub3IoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc01pbm9yKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5hdWdtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuc2hhcnBdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGF1Z21lbnQoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzUsIDFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs1LCAxXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuYXVnbWVudGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5zaGFycF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYXVnbWVudGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5hdWdtZW50KCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0F1Z21lbnRlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmF1Z21lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzQXVnbWVudGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNBdWdtZW50ZWQoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5kaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRpbWluaXNoKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs1LCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzUsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5kaW1pbmlzaGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5kaW1pbmlzaCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0RpbWluaXNoZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5kaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNEaW1pbmlzaGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCBbNSwgTW9kaWZpZXIuZmxhdF0sIFs3LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqXHJcbiAgICAgICAgKi9cclxuICAgICAgIGhhbGZEaW1pbmlzaCgpIHtcclxuICAgICAgICAgICB0aGlzLm1pbm9yKCk7IC8vIGdldCBmbGF0IDNyZFxyXG4gICAgICAgICAgIHRoaXMuZGltaW5pc2goKTsgLy8gZ2V0IGZsYXQgNXRoXHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDcpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzcsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNywgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmhhbGZEaW1pbmlzaGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XSwgWzcsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICovXHJcbiAgICAgICBoYWxmRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzSGFsZkRpbWluaXNoZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5oYWxmRGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzSGFsZkRpbWluaXNoZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNIYWxmRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICBsZXQgdGhpcmQgPSBmYWxzZTtcclxuICAgICAgICAgICBsZXQgZmlmdGggPSBmYWxzZTtcclxuICAgICAgICAgICBsZXQgc2V2ZW50aCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA3ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBzZXZlbnRoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZmlmdGggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXJkICYmIGZpZnRoICYmIHNldmVudGg7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCB3aXRoIHRoZSBmaXJzdCBub3RlIG1vdmVkIHRvIHRoZSBlbmQgdXAgb25lIG9jdGF2ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBjaG9yZC5pbnZlcnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzMsNSwxXVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0U0JywgJ0c0JywgJ0M1J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpbnZlcnQoKSB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5fdGVtcGxhdGVbMF0pO1xyXG4gICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuX3RlbXBsYXRlWzBdKSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVswXVswXSArPSB0aGlzLl9iYXNlU2NhbGUudGVtcGxhdGUubGVuZ3RoO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbMF0gKz0gdGhpcy5fYmFzZVNjYWxlLnRlbXBsYXRlLmxlbmd0aDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBuZXdUZW1wbGF0ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIHdpdGggdGhlIGZpcnN0IG5vdGUgbW92ZWQgdG8gdGhlIGVuZCB1cCBvbmUgb2N0YXZlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5pbnZlcnRlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFszLDUsMV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0U0JywgJ0c0JywgJ0M1J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpbnZlcnRlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuaW52ZXJ0KCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBzdHJpbmcgZm9ybSBvZiB0aGUgY2hvcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudG9TdHJpbmcoKSk7IC8vICcoQzQpbWFqJ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhDaG9yZFRlbXBsYXRlcyk7XHJcbiAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhDaG9yZFRlbXBsYXRlcykubWFwKCh0ZW1wbGF0ZSkgPT4gSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcclxuICAgICAgICAgICBjb25zdCBpbmRleCA9IHZhbHVlcy5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRoaXMuX3RlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgY29uc3QgcHJlZml4ID0gYCgke1NlbWl0b25lJDFbdGhpcy5fcm9vdF19JHt0aGlzLl9vY3RhdmV9KWA7XHJcbiAgICAgICAgICAgY29uc3Qgc3RyID0gaW5kZXggPiAtMSA/IHByZWZpeCArIGtleXNbaW5kZXhdIDogdGhpcy5nZXROb3RlTmFtZXMoKS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBCdWlsZHMgbG9va3VwIHRhYmxlcyBmb3IgbW9yZSBwZXJmb3JtYW50IHN0cmluZyBwYXJzaW5nLjxici8+XHJcbiAgICAqIFNob3VsZCBvbmx5KG9wdGlvbmFsbHkpIGJlIGNhbGxlZCBvbmNlIHNvb24gYWZ0ZXIgdGhlIGxpYnJhcnkgaXMgbG9hZGVkIGFuZDxici8+XHJcbiAgICAqIG9ubHkgaWYgeW91IGFyZSB1c2luZyBzdHJpbmcgaW5pdGlhbGl6ZXJzLlxyXG4gICAgKi9cclxuICAgY29uc3QgYnVpbGRUYWJsZXMgPSAoKSA9PiB7XHJcbiAgICAgICBidWlsZE5vdGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZU5vdGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZU5hbWVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRDaG9yZFRhYmxlKCk7XHJcbiAgIH07XG5cbiAgIGV4cG9ydHMuQ2hvcmQgPSBDaG9yZDtcbiAgIGV4cG9ydHMuQ2hvcmRUZW1wbGF0ZXMgPSBDaG9yZFRlbXBsYXRlcztcbiAgIGV4cG9ydHMuSW5zdHJ1bWVudCA9IEluc3RydW1lbnQ7XG4gICBleHBvcnRzLk1vZGlmaWVyID0gTW9kaWZpZXIkMTtcbiAgIGV4cG9ydHMuTm90ZSA9IE5vdGU7XG4gICBleHBvcnRzLlNjYWxlID0gU2NhbGU7XG4gICBleHBvcnRzLlNjYWxlVGVtcGxhdGVzID0gU2NhbGVUZW1wbGF0ZXM7XG4gICBleHBvcnRzLlNlbWl0b25lID0gU2VtaXRvbmUkMTtcbiAgIGV4cG9ydHMuYnVpbGRUYWJsZXMgPSBidWlsZFRhYmxlcztcblxuICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpO1xuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNjYWxlVGVtcGxhdGVzIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIlxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgRGl2aXNpb25lZFJpY2hub3RlcyB9IGZyb20gXCIuL3V0aWxzXCJcblxuXG50eXBlIExpZ2h0U2NhbGUgPSB7XG4gICAga2V5OiBudW1iZXIsXG4gICAgdGVtcGxhdGVTbHVnOiBzdHJpbmcsXG4gICAgc2VtaXRvbmVzOiBudW1iZXJbXSxcbn07XG5cblxuY29uc3Qgc2NhbGVzRm9yTm90ZXMgPSAobm90ZXM6IE5vdGVbXSwgcGFyYW1zOiBNdXNpY1BhcmFtcyk6IFNjYWxlW10gPT4ge1xuICAgIGNvbnN0IHNjYWxlcyA9IG5ldyBTZXQ8TGlnaHRTY2FsZT4oKVxuICAgIC8vIEZpcnN0IGFkZCBhbGwgc2NhbGVzXG4gICAgZm9yIChjb25zdCBzY2FsZVNsdWcgaW4gcGFyYW1zLnNjYWxlU2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBwYXJhbXMuc2NhbGVTZXR0aW5nc1tzY2FsZVNsdWddO1xuICAgICAgICBpZiAodGVtcGxhdGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgc2VtaXRvbmU9MDsgc2VtaXRvbmUgPCAxMjsgc2VtaXRvbmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtrZXk6IHNlbWl0b25lLCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXNbc2NhbGVTbHVnXX0pXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVzID0gc2NhbGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZGluZ1RvbmUgPSAoc2NhbGUua2V5IC0gMSArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgIGlmICghc2VtaXRvbmVzLmluY2x1ZGVzKGxlYWRpbmdUb25lKSkge1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZXMucHVzaChsZWFkaW5nVG9uZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNjYWxlcy5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNsdWc6IHNjYWxlU2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmVzOiBzZW1pdG9uZXMsXG4gICAgICAgICAgICAgICAgfSBhcyBMaWdodFNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBub3RlLnNlbWl0b25lXG4gICAgICAgIGZvciAoY29uc3Qgc2NhbGUgb2Ygc2NhbGVzKSB7XG4gICAgICAgICAgICBpZiAoIXNjYWxlLnNlbWl0b25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICBzY2FsZXMuZGVsZXRlKHNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChjb25zdCBzY2FsZSBvZiBzY2FsZXMpIHtcbiAgICAgICAgcmV0LnB1c2gobmV3IFNjYWxlKHtrZXk6IHNjYWxlLmtleSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzW3NjYWxlLnRlbXBsYXRlU2x1Z119KSlcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0QXZhaWxhYmxlU2NhbGVzID0gKHZhbHVlczoge1xuICAgIGxhdGVzdERpdmlzaW9uOiBudW1iZXIsXG4gICAgZGl2aXNpb25lZFJpY2hOb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyxcbiAgICBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgIHJhbmRvbU5vdGVzOiBBcnJheTxOb3RlPixcbiAgICBsb2dnZXI6IExvZ2dlcixcbn0pOiBBcnJheTx7XG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIHRlbnNpb246IG51bWJlcixcbn0+ID0+IHtcbiAgICBjb25zdCB7bGF0ZXN0RGl2aXNpb24sIGRpdmlzaW9uZWRSaWNoTm90ZXMsIHBhcmFtcywgcmFuZG9tTm90ZXMsIGxvZ2dlcn0gPSB2YWx1ZXM7XG4gICAgLy8gR2l2ZW4gYSBuZXcgY2hvcmQsIGZpbmQgYXZhaWxhYmxlIHNjYWxlcyBiYXNlIG9uIHRoZSBwcmV2aW91cyBub3Rlc1xuICAgIGNvbnN0IGN1cnJlbnRBdmFpbGFibGVTY2FsZXMgPSBzY2FsZXNGb3JOb3RlcyhyYW5kb21Ob3RlcywgcGFyYW1zKVxuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChjb25zdCBzY2FsZSBvZiBjdXJyZW50QXZhaWxhYmxlU2NhbGVzKSB7XG4gICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgdGVuc2lvbjogMCxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsb2dnZXIubG9nKFwiY3VycmVudEF2YWlsYWJsZVNjYWxlc1wiLCBjdXJyZW50QXZhaWxhYmxlU2NhbGVzKVxuXG4gICAgLy8gR28gYmFjayBhIGZldyBjaG9yZHMgYW5kIGZpbmQgdGhlIHNjYWxlcyB0aGF0IGFyZSBhdmFpbGFibGUuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgY29uc3QgZGl2aXNpb24gPSBsYXRlc3REaXZpc2lvbiAtIChpICogQkVBVF9MRU5HVEgpXG4gICAgICAgIGlmICghZGl2aXNpb25lZFJpY2hOb3Rlc1tkaXZpc2lvbl0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vdGVzID0gZGl2aXNpb25lZFJpY2hOb3Rlc1tkaXZpc2lvbl0ubWFwKHJpY2hOb3RlID0+IHJpY2hOb3RlLm5vdGUpXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZVNjYWxlcyA9IHNjYWxlc0Zvck5vdGVzKG5vdGVzLCBwYXJhbXMpXG4gICAgICAgIGZvciAoY29uc3QgcG90ZW50aWFsU2NhbGUgb2YgcmV0KSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGF2YWlsYWJsZVNjYWxlcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmVxdWFscyhwb3RlbnRpYWxTY2FsZS5zY2FsZSkpXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBTY2FsZSB3YXNuJ3QgYXZhaWxhYmxlLCBpbmNyZWFzZSB0ZW5zaW9uXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxTY2FsZS50ZW5zaW9uICs9IDIwICAvLyBCYXNlIG9mIGhvdyBsb25nIGFnbyBpdCB3YXNcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMikge1xuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxTY2FsZS50ZW5zaW9uICs9IDEwXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSA1XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coXCJTY2FsZSBcIiwgcG90ZW50aWFsU2NhbGUuc2NhbGUudG9TdHJpbmcoKSxcIiB3YXNuJ3QgYXZhaWxhYmxlIGF0IGRpdmlzaW9uIFwiLCBkaXZpc2lvbiwgXCIsIGluY3JlYXNlIHRlbnNpb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbG9nZ2VyLnByaW50KFwiQXZhaWxhYmxlIHNjYWxlc1wiLCByZXQpXG5cbiAgICByZXR1cm4gcmV0LmZpbHRlcihpdGVtID0+IGl0ZW0udGVuc2lvbiA8IDEwKTtcbn0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBUZW5zaW9uLCBUZW5zaW9uUGFyYW1zIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjb25zdCBjaG9yZFByb2dyZXNzaW9uVGVuc2lvbiA9ICh0ZW5zaW9uOiBUZW5zaW9uLCB2YWx1ZXM6IFRlbnNpb25QYXJhbXMpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzLFxuICAgICAgICAgICAgZnJvbU5vdGVzT3ZlcnJpZGUsXG4gICAgICAgICAgICB0b05vdGVzLFxuICAgICAgICAgICAgbmV3Q2hvcmQsXG4gICAgICAgICAgICBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyxcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICBiZWF0RGl2aXNpb24sXG4gICAgICAgIH0gPSB2YWx1ZXM7XG4gICAgLypcbiAgICBcbiAgICBCYXNpYyBjaXJjbGUgb2YgNXRocyBwcm9ncmVzc2lvbjpcblxuICAgIGlpaSAgICAgIFxuICAgIHZpICAgICAgICAgKERlY2VwdGl2ZSB0b25pYylcbiAgICBpaSA8LSBJViAgIChTdWJkb21pbmFudCBmdW5jdGlvbilcbiAgICBWICAtPiB2aWkgIChEb21pbmFudCBmdW5jdGlvbilcbiAgICBJICAgICAgICAgIChUb25pYyBmdW5jdGlvbilcblxuICAgIEFkZGl0aW9uYWxseTpcbiAgICBWIC0+IHZpIGlzIHRoZSBkZWNlcHRpdmUgY2FkZW5jZVxuICAgIElWIC0+IEkgaXMgdGhlIHBsYWdhbCBjYWRlbmNlXG4gICAgaWlpIC0+IElWIGlzIGFsbG93ZWQuXG5cbiAgICBPbmNlIHdlIGhhdmUgc3ViZG9taW5hbnQgb3IgZG9taW5hbnQgY2hvcmRzLCB0aGVyZSdzIG5vIGdvaW5nIGJhY2sgdG8gaWlpIG9yIHZpLlxuXG4gICAgSSB3YW50IHRvIGNoZWNrIHBhY2hlbGJlbCBjYW5vbiBwcm9ncmVzc2lvbjpcbiAgICAgIE9LICAgZGVjZXB0aXZlPyAgIG1heWJlIHNpbmNlIG5vIGZ1bmN0aW9uICAgICBPSyAgICBPSyBpZiBpdHMgaTY0ICAgT2sgYmVjYXVzZSBpdHMgdG9uaWMuIE9LICAgT0tcbiAgICBJIC0+IFYgICAgLT4gICAgIHZpICAgICAgICAgLT4gICAgICAgICAgICAgIGlpaSAtPiBJViAgICAgLT4gICAgICAgIEkgICAgICAgICAtPiAgICAgICAgSVYgIC0+IFYgLT4gSVxuXG4gICAgKi9cbiAgICBjb25zdCBwcm9ncmVzc2lvbkNob2ljZXM6IHsgW2tleTogc3RyaW5nXTogKG51bWJlciB8IHN0cmluZylbXSB8IG51bGwgfSA9IHtcbiAgICAgICAgMDogbnVsbCwgICAgICAgICAgICAgICAgICAvLyBJIGNhbiBnbyBhbnl3aGVyZVxuICAgICAgICAxOiBbJ2RvbWluYW50JywgXSwgICAgICAgIC8vIGlpIGNhbiBnbyB0byBWIG9yIHZpaSBvciBkb21pbmFudFxuICAgICAgICAyOiBbNSwgM10sICAgICAgICAgICAgICAgIC8vIGlpaSBjYW4gZ28gdG8gdmkgb3IgSVZcbiAgICAgICAgMzogWzEsIDIsICdkb21pbmFudCddLCAgICAvLyBJViBjYW4gZ28gdG8gSSwgaWkgb3IgZG9taW5hbnRcbiAgICAgICAgNDogWzAsIDYsICdkb21pbmFudCcsIDVdLCAvLyBWIGNhbiBnbyB0byBJLCB2aWkgb3IgZG9taW5hbnQgb3IgdmlcbiAgICAgICAgNTogWydzdWItZG9taW5hbnQnLCAyXSwgICAgICAvLyB2aSBjYW4gZ28gdG8gaWksIElWLCAob3IgaWlpKVxuICAgICAgICA2OiBbMF0sICAgICAgICAgICAgICAgICAgIC8vIHZpaSBjYW4gZ28gdG8gSVxuICAgIH1cbiAgICBsZXQgd2FudGVkRnVuY3Rpb24gPSBudWxsO1xuICAgIGxldCB0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCA9IGZhbHNlO1xuICAgIGxldCBwYXJ0ME11c3RCZVRvbmljID0gZmFsc2U7XG5cbiAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSAmJiBpbnZlcnNpb25OYW1lKSB7XG4gICAgICAgIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiUEFDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDUpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICAgICAgdHJ5VG9HZXRMZWFkaW5nVG9uZUluUGFydDAgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgICAgICAgICAgcGFydDBNdXN0QmVUb25pYyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSAzICYmICFpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBcImNhZGVuY2UgUEFDOiBOT1Qgcm9vdCBpbnZlcnNpb24hIFwiO1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIklBQ1wiKSB7XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSA1KSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gMykge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSAzICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90IHJvb3QgaW52ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IFwiY2FkZW5jZSBJQUM6IHJvb3QgaW52ZXJzaW9uISBcIjtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJIQ1wiKSB7XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8PSA0KSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJldkNob3JkO1xuICAgIGxldCBwcmV2UHJldkNob3JkO1xuICAgIGxldCBwYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBwcmV2UGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgbGF0ZXN0Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGlmIChkaXZpc2lvbmVkTm90ZXMpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RGl2aXNpb24gPSBiZWF0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDtcbiAgICAgICAgbGV0IHRtcCA6IEFycmF5PE5vdGU+ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbl0gfHwgW10pKSB7XG4gICAgICAgICAgICAvLyBVc2Ugb3JpZ2luYWwgbm90ZXMsIG5vdCB0aGUgb25lcyB0aGF0IGhhdmUgYmVlbiB0dXJuZWQgaW50byBOQUNzXG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICB0bXAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKSkge1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZQcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2UGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgICAgIGZvciAobGV0IGk9YmVhdERpdmlzaW9uOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGF0ZXN0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXByZXZDaG9yZCkge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZyb21Ob3Rlc092ZXJyaWRlKSB7XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IGZyb21Ob3Rlc092ZXJyaWRlO1xuICAgIH1cblxuICAgIGxldCBmcm9tTm90ZXM7XG4gICAgaWYgKHBhc3NlZEZyb21Ob3Rlcy5sZW5ndGggPCA0KSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHRvTm90ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbU5vdGVzID0gcGFzc2VkRnJvbU5vdGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmVzID0gZnJvbU5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuXG4gICAgLy8gSWYgdGhlIG5vdGVzIGFyZSBub3QgaW4gdGhlIGN1cnJlbnQgc2NhbGUsIGluY3JlYXNlIHRoZSB0ZW5zaW9uXG4gICAgY29uc3QgbGVhZGluZ1RvbmUgPSAoY3VycmVudFNjYWxlLmtleSAtIDEgKyAyNCkgJSAxMlxuXG4gICAgaWYgKHRyeVRvR2V0TGVhZGluZ1RvbmVJblBhcnQwICYmIHRvR2xvYmFsU2VtaXRvbmVzWzBdICUgMTIgIT0gbGVhZGluZ1RvbmUpIHtcbiAgICAgICAgLy8gaW4gUEFDLCB3ZSB3YW50IHRoZSBsZWFkaW5nIHRvbmUgaW4gcGFydCAwIGluIHRoZSBkb21pbmFudFxuICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gNTtcbiAgICB9XG5cbiAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLCAgLy8gQ1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLCAgLy8gRlxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LCAgLy8gSFxuICAgICAgICBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICB9XG5cbiAgICBjb25zdCB0b1NjYWxlSW5kZXhlcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gc2VtaXRvbmVTY2FsZUluZGV4W25vdGUuc2VtaXRvbmVdKTtcblxuICAgIGlmIChwYXJ0ME11c3RCZVRvbmljICYmIHRvU2NhbGVJbmRleGVzWzBdICE9IDApIHtcbiAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFBvc3NpYmxlRnVuY3Rpb25zID0gKGNob3JkOiBDaG9yZCkgPT4ge1xuICAgICAgICBjb25zdCByb290U2VtaXRvbmUgPSBjaG9yZC5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgY29uc3Qgcm9vdFNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXhbcm9vdFNlbWl0b25lXTtcblxuICAgICAgICBjb25zdCBwb3NzaWJsZVRvRnVuY3Rpb25zOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7XG4gICAgICAgICAgICAndG9uaWMnOiB0cnVlLFxuICAgICAgICAgICAgJ3N1Yi1kb21pbmFudCc6IHRydWUsXG4gICAgICAgICAgICAnZG9taW5hbnQnOiB0cnVlLFxuICAgICAgICB9XG4gICAgICAgIGlmIChyb290U2NhbGVJbmRleCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSBmYWxzZTtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnNbJ3N1Yi1kb21pbmFudCddID0gZmFsc2U7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFbMSwgM10uaW5jbHVkZXMocm9vdFNjYWxlSW5kZXgpKSB7IC8vIGlpLCBJVlxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghWzAsIDQsIDZdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBWLCB2aWksIEk2NFxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHJvb3RTY2FsZUluZGV4ID09IDApIHtcbiAgICAgICAgICAgIC8vIElmIEkgaXMgbm90IHNlY29uZCBpbnZlcnNpb24sIGl0J3Mgbm90IGRvbWluYW50XG4gICAgICAgICAgICBpZiAoIWludmVyc2lvbk5hbWUgfHwgIWludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFbMF0uaW5jbHVkZXMocm9vdFNjYWxlSW5kZXgpKSB7IC8vIElcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm9vdFNjYWxlSW5kZXgsXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zOiBPYmplY3Qua2V5cyhwb3NzaWJsZVRvRnVuY3Rpb25zKS5maWx0ZXIoa2V5ID0+IHBvc3NpYmxlVG9GdW5jdGlvbnNba2V5XSksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKG5ld0Nob3JkICYmIHByZXZDaG9yZCAmJiBwcmV2UHJldkNob3JkKSB7XG4gICAgICAgIGlmIChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgIC8vIFNhbWUgcm9vdFxuICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE7XG4gICAgICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgPT0gcHJldlByZXZDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIC8vIFNhbWUgcm9vdCBhcyBwcmV2aW91cyBjaG9yZFxuICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgIC8vIFNhbWUgcm9vdCBhcyBwcmV2aW91cyBjaG9yZCAoRG9uJ3QgZ28gYmFjaylcbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSA1O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5ld0Nob3JkICYmIHByZXZDaG9yZCkge1xuICAgICAgICBjb25zdCBmcm9tRnVuY3Rpb25zID0gZ2V0UG9zc2libGVGdW5jdGlvbnMocHJldkNob3JkKTtcbiAgICAgICAgY29uc3QgdG9GdW5jdGlvbnMgPSBnZXRQb3NzaWJsZUZ1bmN0aW9ucyhuZXdDaG9yZCk7XG4gICAgICAgIGNvbnN0IHBvc3NpYmxlVG9GdW5jdGlvbnMgPSB0b0Z1bmN0aW9ucy5wb3NzaWJsZVRvRnVuY3Rpb25zO1xuXG4gICAgICAgIGNvbnN0IHByb2dyZXNzaW9ucyA9IHByb2dyZXNzaW9uQ2hvaWNlc1tmcm9tRnVuY3Rpb25zLnJvb3RTY2FsZUluZGV4XTtcbiAgICAgICAgaWYgKHByb2dyZXNzaW9ucykge1xuICAgICAgICAgICAgbGV0IGdvb2QgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcHJvZ3Jlc3Npb24gb2YgcHJvZ3Jlc3Npb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGAke3Byb2dyZXNzaW9ufWAgPT0gYCR7dG9GdW5jdGlvbnMucm9vdFNjYWxlSW5kZXh9YCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQZXJmZWN0IHByb2dyZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9ncmVzc2lvbiA9PSBcInN0cmluZ1wiICYmIHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnMgJiYgdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9ucy5pbmNsdWRlcyhwcm9ncmVzc2lvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZ29vZCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcInN1Yi1kb21pbmFudFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwb3NzaWJsZVRvRnVuY3Rpb25zLmluY2x1ZGVzKFwic3ViLWRvbWluYW50XCIpKSB7Ly8gJiYgIXBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwb3NzaWJsZVRvRnVuY3Rpb25zLmluY2x1ZGVzKFwiZG9taW5hbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBgV2FudGVkICR7d2FudGVkRnVuY3Rpb259YFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSA1OyAgLy8gRG9taW5hbnQgaXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcImRvbWluYW50XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnMuaW5jbHVkZXMoXCJkb21pbmFudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gYFdhbnRlZCAke3dhbnRlZEZ1bmN0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJ0b25pY1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwb3NzaWJsZVRvRnVuY3Rpb25zLmluY2x1ZGVzKFwidG9uaWNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IGBXYW50ZWQgJHt3YW50ZWRGdW5jdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBidWlsZFRhYmxlcyxcbiAgICBTY2FsZSxcbiAgICBOb3RlLFxufSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IENob3JkLCBOdWxsYWJsZSwgRGl2aXNpb25lZFJpY2hub3RlcywgUmljaE5vdGUsIEJFQVRfTEVOR1RILCBzZW1pdG9uZVNjYWxlSW5kZXggfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgUmFuZG9tQ2hvcmRHZW5lcmF0b3IgfSBmcm9tIFwiLi9yYW5kb21jaG9yZHNcIjtcbmltcG9ydCB7IGdldEludmVyc2lvbnMgfSBmcm9tIFwiLi9pbnZlcnNpb25zXCI7XG5pbXBvcnQgeyBnZXRUZW5zaW9uLCBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgYWRkTm90ZUJldHdlZW4sIGJ1aWxkVG9wTWVsb2R5IH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgYWRkSGFsZk5vdGVzIH0gZnJvbSBcIi4vaGFsZm5vdGVzXCI7XG5pbXBvcnQgeyBnZXRBdmFpbGFibGVTY2FsZXMgfSBmcm9tIFwiLi9hdmFpbGFibGVzY2FsZXNcIjtcbmltcG9ydCB7IGFkZEZvcmNlZE1lbG9keSwgRm9yY2VkTWVsb2R5UmVzdWx0IH0gZnJvbSBcIi4vZm9yY2VkbWVsb2R5XCI7XG5pbXBvcnQgKiBhcyB0aW1lIGZyb20gXCIuL3RpbWVyXCI7IFxuaW1wb3J0IHsgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24gfSBmcm9tIFwiLi9jaG9yZHByb2dyZXNzaW9uXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcblxuY29uc3QgR09PRF9DSE9SRF9MSU1JVCA9IDIwMDtcbmNvbnN0IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCA9IDEwO1xuY29uc3QgQkFEX0NIT1JEX0xJTUlUID0gNTAwO1xuY29uc3QgQkFEX0NIT1JEU19QRVJfQ0hPUkQgPSAyMDtcblxuXG5jb25zdCBzbGVlcE1TID0gYXN5bmMgKG1zOiBudW1iZXIpOiBQcm9taXNlPG51bGw+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmNvbnN0IG1ha2VDaG9yZHMgPSBhc3luYyAobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrOiBOdWxsYWJsZTxGdW5jdGlvbj4gPSBudWxsKTogUHJvbWlzZTxEaXZpc2lvbmVkUmljaG5vdGVzPiA9PiB7XG4gICAgLy8gZ2VuZXJhdGUgYSBwcm9ncmVzc2lvblxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpO1xuXG4gICAgbGV0IHJlc3VsdDogRGl2aXNpb25lZFJpY2hub3RlcyA9IHt9O1xuXG4gICAgbGV0IGRpdmlzaW9uQmFubmVkTm90ZXM6IHtba2V5OiBudW1iZXJdOiBBcnJheTxBcnJheTxOb3RlPj59ID0ge31cblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBsZXQgcHJldlJlc3VsdCA9IHJlc3VsdFtkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgbGV0IHByZXZDaG9yZCA9IHByZXZSZXN1bHQgPyBwcmV2UmVzdWx0WzBdLmNob3JkIDogbnVsbDtcbiAgICAgICAgbGV0IHByZXZOb3RlczogTm90ZVtdO1xuICAgICAgICBsZXQgcHJldkludmVyc2lvbk5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGN1cnJlbnRTY2FsZTogU2NhbGUgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBiYW5uZWROb3Rlc3MgPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uXTtcbiAgICAgICAgaWYgKHByZXZSZXN1bHQpIHtcbiAgICAgICAgICAgIHByZXZOb3RlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lID0gcmljaE5vdGUuaW52ZXJzaW9uTmFtZTtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHByZXZOb3RlcyA9IHByZXZOb3RlcztcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZDtcblxuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKFwiZGl2aXNpb25cIiwgZGl2aXNpb24sIHByZXZDaG9yZCA/IHByZXZDaG9yZC50b1N0cmluZygpIDogXCJudWxsXCIsIFwiIHNjYWxlIFwiLCBjdXJyZW50U2NhbGUgPyBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA6IFwibnVsbFwiKTtcbiAgICAgICAgY29uc3QgY3VycmVudEJlYXQgPSBNYXRoLmZsb29yKGRpdmlzaW9uIC8gQkVBVF9MRU5HVEgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcIiwgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSk7XG5cbiAgICAgICAgY29uc3QgcmFuZG9tR2VuZXJhdG9yID0gbmV3IFJhbmRvbUNob3JkR2VuZXJhdG9yKHBhcmFtcylcbiAgICAgICAgbGV0IG5ld0Nob3JkOiBOdWxsYWJsZTxDaG9yZD4gPSBudWxsO1xuXG4gICAgICAgIGxldCBnb29kQ2hvcmRzOiBSaWNoTm90ZVtdW10gPSBbXVxuICAgICAgICBjb25zdCBiYWRDaG9yZHM6IHt0ZW5zaW9uOiBUZW5zaW9uLCBjaG9yZDogc3RyaW5nfVtdID0gW11cblxuICAgICAgICBjb25zdCByYW5kb21Ob3RlczogQXJyYXk8Tm90ZT4gPSBbXTtcblxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIGxldCBza2lwTG9vcCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDEgJiYgcHJldk5vdGVzKSB7XG4gICAgICAgICAgICAvLyBGb3JjZSBzYW1lIGNob3JkIHR3aWNlXG4gICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSgwLCBnb29kQ2hvcmRzLmxlbmd0aCk7XG4gICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocHJldk5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogQkVBVF9MRU5HVEgsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgdGVuc2lvbjogbmV3IFRlbnNpb24oKSxcbiAgICAgICAgICAgICAgICBzY2FsZTogY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSkpKTtcbiAgICAgICAgICAgIHNraXBMb29wID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghc2tpcExvb3AgJiYgZ29vZENob3Jkcy5sZW5ndGggPCAoY3VycmVudEJlYXQgIT0gMCA/IEdPT0RfQ0hPUkRfTElNSVQgOiA1KSkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgICAgbmV3Q2hvcmQgPSByYW5kb21HZW5lcmF0b3IuZ2V0Q2hvcmQoKTtcbiAgICAgICAgICAgIGNvbnN0IGNob3JkTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwMDAgfHwgIW5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb28gbWFueSBpdGVyYXRpb25zLCBnb2luZyBiYWNrXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1haW5QYXJhbXMuZm9yY2VkQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCZWF0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lICE9IDAgfHwgIW5ld0Nob3JkLnRvU3RyaW5nKCkuaW5jbHVkZXMoJ21haicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSBDIG1ham9yIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYWluUGFyYW1zLmZvcmNlZENob3JkcyAmJiBjdXJyZW50U2NhbGUgJiYgbmV3Q2hvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JjZWRDaG9yZE51bSA9IHBhcnNlSW50KG1haW5QYXJhbXMuZm9yY2VkQ2hvcmRzW2N1cnJlbnRCZWF0XSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihmb3JjZWRDaG9yZE51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbWl0b25lU2NhbGVJbmRleChjdXJyZW50U2NhbGUpW25ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lXSAhPSAoZm9yY2VkQ2hvcmROdW0gLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYWxsSW52ZXJzaW9ucztcbiAgICAgICAgICAgIGxldCBhdmFpbGFibGVTY2FsZXM7XG5cbiAgICAgICAgICAgIGF2YWlsYWJsZVNjYWxlcyA9IGdldEF2YWlsYWJsZVNjYWxlcyh7XG4gICAgICAgICAgICAgICAgbGF0ZXN0RGl2aXNpb246IGRpdmlzaW9uLFxuICAgICAgICAgICAgICAgIGRpdmlzaW9uZWRSaWNoTm90ZXM6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICByYW5kb21Ob3RlczogbmV3Q2hvcmQubm90ZXMsXG4gICAgICAgICAgICAgICAgbG9nZ2VyOiBuZXcgTG9nZ2VyKGNob3JkTG9nZ2VyKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoY3VycmVudFNjYWxlICYmIChtYXhCZWF0cyAtIGN1cnJlbnRCZWF0IDwgMyB8fCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMyB8fCBjdXJyZW50QmVhdCA8IDUpKSB7XG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgYWxsb3cgb3RoZXIgc2NhbGVzIHRoYW4gdGhlIGN1cnJlbnQgb25lXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlU2NhbGVzID0gYXZhaWxhYmxlU2NhbGVzLmZpbHRlcihzID0+IHMuc2NhbGUuZXF1YWxzKGN1cnJlbnRTY2FsZSBhcyBTY2FsZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF2YWlsYWJsZVNjYWxlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsSW52ZXJzaW9ucyA9IGdldEludmVyc2lvbnMoe1xuICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZCwgcHJldk5vdGVzOiBwcmV2Tm90ZXMsIGJlYXQ6IGN1cnJlbnRCZWF0LCBwYXJhbXMsIGxvZ2dlcjogbmV3IExvZ2dlcihjaG9yZExvZ2dlciksXG4gICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbWF4QmVhdHMgLSBjdXJyZW50QmVhdFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpbnZlcnNpb25SZXN1bHQgb2YgYWxsSW52ZXJzaW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA+PSBHT09EX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBpbnZlcnNpb25Mb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTG9nZ2VyLnRpdGxlID0gW1wiSW52ZXJzaW9uIFwiLCBgJHtpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZX1gXTtcbiAgICAgICAgICAgICAgICByYW5kb21Ob3Rlcy5zcGxpY2UoMCwgcmFuZG9tTm90ZXMubGVuZ3RoKTsgIC8vIEVtcHR5IHRoaXMgYW5kIHJlcGxhY2UgY29udGVudHNcbiAgICAgICAgICAgICAgICByYW5kb21Ob3Rlcy5wdXNoKC4uLmludmVyc2lvblJlc3VsdC5ub3Rlcyk7XG4gICAgICAgICAgICAgICAgaWYgKGJhbm5lZE5vdGVzcyAmJiBiYW5uZWROb3Rlc3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiYW5uZWROb3RlcyBvZiBiYW5uZWROb3Rlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWROb3Rlcy5sZW5ndGggIT0gcmFuZG9tTm90ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBiYW5uZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kb21Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW5kb21Ob3Rlc1tpXS50b1N0cmluZygpICE9IGJhbm5lZE5vdGVzW2ldLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFubmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhbm5lZCBub3Rlc1wiLCByYW5kb21Ob3Rlcy5tYXAobiA9PiBuLnRvU3RyaW5nKCkpLCBcImJhbm5lZE5vdGVzc1wiLCBiYW5uZWROb3Rlc3MubWFwKG4gPT4gbi5tYXAobiA9PiBuLnRvU3RyaW5nKCkpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGF2YWlsYWJsZVNjYWxlIG9mIGF2YWlsYWJsZVNjYWxlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTm90ZXM6IHJhbmRvbU5vdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBtYXhCZWF0cyAtIGN1cnJlbnRCZWF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFpblBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDaG9yZCxcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbnNpb25SZXN1bHQgPSBuZXcgVGVuc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBjaG9yZFByb2dyZXNzaW9uVGVuc2lvbih0ZW5zaW9uUmVzdWx0LCB0ZW5zaW9uUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICB9KSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRUZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxhdGlvbldlaWdodCA9IHBhcnNlRmxvYXQoKGAke3BhcmFtcy5tb2R1bGF0aW9uV2VpZ2h0IHx8IFwiMFwifWApKVxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gYXZhaWxhYmxlU2NhbGUudGVuc2lvbiAvIE1hdGgubWF4KDAuMDEsIG1vZHVsYXRpb25XZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNjYWxlICYmICFhdmFpbGFibGVTY2FsZS5zY2FsZS5lcXVhbHMoY3VycmVudFNjYWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEgLyBNYXRoLm1heCgwLjAxLCBtb2R1bGF0aW9uV2VpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2R1bGF0aW9uV2VpZ2h0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1heEJlYXRzIC0gY3VycmVudEJlYXQgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGFzdCAyIGJhcnMsIGRvbid0IGNoYW5nZSBzY2FsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBjaGFuZ2Ugc2NhbGUgaW4gbGFzdCAyIGJlYXRzIG9mIGNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCZWF0IDwgNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGNoYW5nZSBzY2FsZSBpbiBmaXJzdCA1IGJlYXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVuc2lvbiA9IHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2l2ZVVQKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZWxvZHlSZXN1bHQ6IEZvcmNlZE1lbG9keVJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXMgdGhpcyBwb3NzaWJsZSB0byB3b3JrIHdpdGggdGhlIG1lbG9keT9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHNvLCBhZGQgbWVsb2R5IG5vdGVzIGFuZCBOQUNzLlxuICAgICAgICAgICAgICAgICAgICAgICAgbWVsb2R5UmVzdWx0ID0gYWRkRm9yY2VkTWVsb2R5KHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5mb3JjZWRNZWxvZHkgKz0gbWVsb2R5UmVzdWx0LnRlbnNpb247XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVsb2R5UmVzdWx0Lm5hYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubmFjID0gbWVsb2R5UmVzdWx0Lm5hYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQuY29tbWVudCA9IG1lbG9keVJlc3VsdC5jb21tZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbiA9IHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRoaXNDaG9yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZ29vZENob3JkIG9mIGdvb2RDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLmNob3JkICYmIGdvb2RDaG9yZFswXS5jaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0Nob3JkQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0Nob3JkQ291bnQgPj0gR09PRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgd29yc3QgcHJldmlvdXMgZ29vZENob3JkIGlmIHRoaXMgaGFzIGxlc3MgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JzdENob3JkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RDaG9yZFRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ29vZENob3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kQ2hvcmQgPSBnb29kQ2hvcmRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLmNob3JkICYmIGdvb2RDaG9yZFswXS5jaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZ29vZENob3JkWzBdLnRlbnNpb24/LnRvdGFsVGVuc2lvbiB8fCA5OTkpIDwgd29yc3RDaG9yZFRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JzdENob3JkID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yc3RDaG9yZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZ29vZENob3Jkc1t3b3JzdENob3JkXVswXS50ZW5zaW9uPy50b3RhbFRlbnNpb24gfHwgOTk5KSA+IHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcmVtb3ZlIHRoYXQgaW5kZXgsIGFkZCBhIG5ldyBvbmUgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RDaG9yZHMuc3BsaWNlKHdvcnN0Q2hvcmQsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0Nob3JkQ291bnQgPCBHT09EX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocmFuZG9tTm90ZXMubWFwKChub3RlLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IEJFQVRfTEVOR1RILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogYXZhaWxhYmxlU2NhbGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gPCAxMDAgJiYgYmFkQ2hvcmRzLmxlbmd0aCA8IEJBRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNob3JkQ291bnRJbkJhZENob3JkcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJhZENob3JkIG9mIGJhZENob3Jkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWRDaG9yZC5jaG9yZCA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkQ291bnRJbkJhZENob3JkcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaG9yZENvdW50SW5CYWRDaG9yZHMgPCBCQURfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZENob3Jkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLnRvU3RyaW5nKCkgKyBcIixcIiArIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAvLyBGb3IgYXZhaWxhYmxlIHNjYWxlcyBlbmRcbiAgICAgICAgICAgIH0gIC8vIEZvciB2b2ljZWxlYWRpbmcgcmVzdWx0cyBlbmRcbiAgICAgICAgfSAgLy8gV2hpbGUgZW5kXG4gICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhZENob3JkIG9mIGJhZENob3Jkcykge1xuICAgICAgICAgICAgICAgIGJhZENob3JkLnRlbnNpb24ucHJpbnQoXCJCYWQgY2hvcmQgXCIsIGJhZENob3JkLmNob3JkLCBcIiAtIFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHNsZWVwTVMoMSk7XG4gICAgICAgICAgICAvLyBHbyBiYWNrIHRvIHByZXZpb3VzIGNob3JkLCBhbmQgbWFrZSBpdCBhZ2FpblxuICAgICAgICAgICAgaWYgKGRpdmlzaW9uID49IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgICAgIC8vIE1hcmsgdGhlIHByZXZpb3VzIGNob3JkIGFzIGJhbm5lZFxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Jhbm5lZE5vdGVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdCYW5uZWROb3Rlc1tub3RlLnBhcnRJbmRleF0gPSBub3RlLm5vdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgcHJldmlvdXMgY2hvcmQgKHdoZXJlIHdlIGFyZSBnb2luZyB0bylcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGFueSBub3RlcyBhZnRlciB0aGF0IGFsc29cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSDsgaSA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5sZW5ndGggPiAxMCAmJiByZXN1bHRbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRvbyBtYW55IGJhbnMsIGdvIGJhY2sgZnVydGhlci4gUmVtb3ZlIHRoZXNlIGJhbnMgc28gdGhleSBkb24ndCBoaW5kZXIgbGF0ZXIgcHJvZ3Jlc3MuXG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEhcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3QmFubmVkTm90ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmFubmVkTm90ZXNbbm90ZS5wYXJ0SW5kZXhdID0gbm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLnB1c2gobmV3QmFubmVkTm90ZXMpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSDsgaSA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZmFpbGVkIHJpZ2h0IGF0IHRoZSBzdGFydC5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQgLSAxLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChnaXZlVVApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENob29zZSB0aGUgYmVzdCBjaG9yZCBmcm9tIGdvb2RDaG9yZHNcbiAgICAgICAgbGV0IGJlc3RDaG9yZCA9IGdvb2RDaG9yZHNbMF07XG4gICAgICAgIGxldCBiZXN0VGVuc2lvbiA9IDk5OTtcbiAgICAgICAgZm9yIChjb25zdCBjaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICBpZiAoY2hvcmRbMF0udGVuc2lvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hvcmRbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPCBiZXN0VGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBiZXN0Q2hvcmQgPSBjaG9yZDtcbiAgICAgICAgICAgICAgICAgICAgYmVzdFRlbnNpb24gPSBjaG9yZFswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hvcmRbMF0udGVuc2lvbi5wcmludChjaG9yZFswXS5jaG9yZCA/IGNob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgOiBcIj9DaG9yZD9cIiwgY2hvcmRbMF0uaW52ZXJzaW9uTmFtZSwgXCJiZXN0IHRlbnNpb246IFwiLCBiZXN0VGVuc2lvbiwgXCI6IFwiLCBiZXN0Q2hvcmQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbZGl2aXNpb25dID0gYmVzdENob3JkO1xuICAgICAgICBpZiAoYmVzdENob3JkWzBdPy50ZW5zaW9uPy5uYWMpIHtcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVxdWlyZWQgTm9uIENob3JkIFRvbmVcbiAgICAgICAgICAgIGFkZE5vdGVCZXR3ZWVuKGJlc3RDaG9yZFswXS50ZW5zaW9uLm5hYywgZGl2aXNpb24sIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIDAsIHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQsIHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmFuZG9tR2VuZXJhdG9yLmNsZWFuVXAoKTtcbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VNdXNpYyhwYXJhbXM6IE1haW5NdXNpY1BhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjazogTnVsbGFibGU8RnVuY3Rpb24+ID0gbnVsbCkge1xuICAgIGxldCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcbiAgICBkaXZpc2lvbmVkTm90ZXMgPSBhd2FpdCBtYWtlQ2hvcmRzKHBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjayk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG5cbiAgICAvLyBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSBuZXdWb2ljZUxlYWRpbmdOb3RlcyhjaG9yZHMsIHBhcmFtcyk7XG4gICAgLy8gYnVpbGRUb3BNZWxvZHkoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIC8vIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzOiBkaXZpc2lvbmVkTm90ZXMsXG4gICAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTWVsb2R5KGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgLy8gUmVtb3ZlIG9sZCBtZWxvZHkgYW5kIG1ha2UgYSBuZXcgb25lXG4gICAgY29uc3QgbWF4QmVhdHMgPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKClcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbisrKSB7XG4gICAgICAgIGNvbnN0IG9uQmVhdCA9IGRpdmlzaW9uICUgQkVBVF9MRU5HVEggPT0gMDtcbiAgICAgICAgaWYgKCFvbkJlYXQpIHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBbXVxuICAgICAgICB9IGVsc2UgaWYgKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gJiYgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZvckVhY2gocmljaE5vdGUgPT4ge1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLmR1cmF0aW9uID0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmljaE5vdGUudGllID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIC8vIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcyk7XG4gICAgLy8gYWRkRWlnaHRoTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG4gICAgLy8gYWRkSGFsZk5vdGVzKGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcylcbn1cblxuZXhwb3J0IHsgYnVpbGRUYWJsZXMgfSIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IGFkZE5vdGVCZXR3ZWVuLCBmaW5kTkFDcywgRmluZE5vbkNob3JkVG9uZVBhcmFtcywgTm9uQ2hvcmRUb25lIH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiwgVGVuc2lvblBhcmFtcyB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2V0TWVsb2R5TmVlZGVkVG9uZXMsIGdldFJpY2hOb3RlLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIEZvcmNlZE1lbG9keVJlc3VsdCA9IHtcbiAgICBjb21tZW50OiBzdHJpbmcsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIG5hYzogTm9uQ2hvcmRUb25lIHwgbnVsbCxcbn1cblxuXG5cbmV4cG9ydCBjb25zdCBhZGRGb3JjZWRNZWxvZHkgPSAodmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogRm9yY2VkTWVsb2R5UmVzdWx0ID0+IHtcbiAgICAvKlxuICAgIFxuICAgICovXG4gICAgY29uc3QgeyB0b05vdGVzLCBjdXJyZW50U2NhbGUsIHBhcmFtcywgbWFpblBhcmFtcywgYmVhdERpdmlzaW9uIH0gPSB2YWx1ZXM7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKHBhcmFtcyk7XG4gICAgY29uc3QgY2hvcmQgPSB2YWx1ZXMubmV3Q2hvcmQ7XG4gICAgY29uc3QgZGl2aXNpb25lZE5vdGVzID0gdmFsdWVzLmRpdmlzaW9uZWROb3RlcyB8fCB7fTtcbiAgICBjb25zdCBtYXhEaXZpc2lvbiA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKSAqIEJFQVRfTEVOR1RIO1xuICAgIGNvbnN0IHRlbnNpb246IEZvcmNlZE1lbG9keVJlc3VsdCA9IHtcbiAgICAgICAgY29tbWVudDogXCJcIixcbiAgICAgICAgdGVuc2lvbjogMCxcbiAgICAgICAgbmFjOiBudWxsLFxuICAgIH1cblxuICAgIGNvbnN0IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zID0gZ2V0TWVsb2R5TmVlZGVkVG9uZXMobWFpblBhcmFtcyk7XG4gICAgY29uc3QgbWVsb2R5RXhpc3RzID0gKG1haW5QYXJhbXMuZm9yY2VkTWVsb2R5IHx8IFtdKS5sZW5ndGggPiAwO1xuICAgIGlmICghbWVsb2R5RXhpc3RzKSB7XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnREaXZpc2lvbiA9IGJlYXREaXZpc2lvbjtcbiAgICBjb25zdCBjYWRlbmNlRGl2aXNpb24gPSBjdXJyZW50RGl2aXNpb24gLSBwYXJhbXMuY2FkZW5jZVN0YXJ0RGl2aXNpb247XG5cbiAgICAvLyBTdHJvbmcgYmVhdCBub3RlIGlzIHN1cHBvc2VkIHRvIGJlIHRoaXNcbiAgICBsZXQgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uXTtcbiAgICBsZXQgbmV3TWVsb2R5VG9uZURpdmlzaW9uID0gY2FkZW5jZURpdmlzaW9uO1xuICAgIGlmICghbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSB0b25lIGZvciB0aGlzIGRpdmlzaW9uLCB0aGUgcHJldmlvdXMgdG9uZSBtdXN0IGJlIGxlbmd0aHkuIFVzZSBpdC5cbiAgICAgICAgZm9yIChsZXQgaSA9IGNhZGVuY2VEaXZpc2lvbiAtIDE7IGkgPj0gY2FkZW5jZURpdmlzaW9uIC0gQkVBVF9MRU5HVEggKiAyOyBpLS0pIHtcbiAgICAgICAgICAgIG5ld01lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2ldO1xuICAgICAgICAgICAgaWYgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIG5ld01lbG9keVRvbmVEaXZpc2lvbiA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24gfHwgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cIjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgY29uc3QgbmV3TWVsb2R5U2VtaXRvbmUgPSBjdXJyZW50U2NhbGUubm90ZXNbbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdLnNlbWl0b25lICsgMSAtIDE7ICAvLyBDb252ZXJ0IHRvIG51bWJlclxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAoKHgpID0+IHguc2VtaXRvbmUpO1xuXG4gICAgLy8gQ2FuIHdlIHR1cm4gdGhpcyBub3RlIGludG8gYSBub24tY2hvcmQgdG9uZT8gQ2hlY2sgdGhlIHByZXZpb3VzIGFuZCBuZXh0IG5vdGUuXG4gICAgbGV0IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgbGV0IG5leHRNZWxvZHlUb25lRGl2aXNpb247XG4gICAgZm9yIChsZXQgaSA9IG5ld01lbG9keVRvbmVEaXZpc2lvbiArIDE7IGkgPD0gbWF4RGl2aXNpb247IGkrKykge1xuICAgICAgICBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbaV07XG4gICAgICAgIGlmIChuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgICAgICBuZXh0TWVsb2R5VG9uZURpdmlzaW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uIHx8IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24udG9uZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cbiAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJObyBtZWxvZHkgZm91bmQgYXQgYWxsLiBHaXZlIHVwLlwiO1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG5cbiAgICAvLyBMZXQncyBub3QgY2FyZSB0aGF0IG11Y2ggaWYgdGhlIHdlYWsgYmVhdCBub3RlIGlzIG5vdCBjb3JyZWN0LiBJdCBqdXN0IGFkZHMgdGVuc2lvbiB0byB0aGUgcmVzdWx0LlxuICAgIC8vIFVOTEVTUyBpdCdzIGluIHRoZSBtZWxvZHkgYWxzby5cblxuICAgIC8vIFdoYXQgTkFDIGNvdWxkIHdvcms/XG4gICAgLy8gQ29udmVydCBhbGwgdmFsdWVzIHRvIGdsb2JhbFNlbWl0b25lc1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZSh0b05vdGVzWzBdKVxuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAoKHgpID0+IGdsb2JhbFNlbWl0b25lKHgpKTtcbiAgICBsZXQgcHJldlJpY2hOb3RlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50RGl2aXNpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBwcmV2UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKS5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IDApWzBdO1xuICAgICAgICBpZiAocHJldlJpY2hOb3RlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmV2QmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tjdXJyZW50RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gMClbMF07XG4gICAgbGV0IHByZXZCZWF0R2xvYmFsU2VtaXRvbmUgPSBwcmV2QmVhdFJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldkJlYXRSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG5cbiAgICBsZXQgcHJldlBhcnQxUmljaE5vdGU7XG4gICAgZm9yIChsZXQgaSA9IGN1cnJlbnREaXZpc2lvbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHByZXZQYXJ0MVJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSAxKVswXTtcbiAgICAgICAgaWYgKHByZXZQYXJ0MVJpY2hOb3RlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHByZXZpb3VzIG5vdGUgZG9lc24ndCBleGlzdCwgdGhpcyBpcyBhY3R1YWxseSBlYXNpZXIuXG4gICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gcHJldlJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldlJpY2hOb3RlLm5vdGUpIDogbnVsbDtcblxuICAgIC8vIFRyeWluZyB0byBmaWd1cmUgb3V0IHRoZSBtZWxvZHkgZGlyZWN0aW9uLi4uIFdlIHNob3VsZCBwdXQgb2N0YXZlcyBpbiB0aGUgZm9yY2VkIG1lbG9keSBzdHJpbmcuLi5cbiAgICBjb25zdCBjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbiA9IHByZXZCZWF0R2xvYmFsU2VtaXRvbmUgfHwgZnJvbUdsb2JhbFNlbWl0b25lIHx8IHRvR2xvYmFsU2VtaXRvbmU7XG5cbiAgICBsZXQgY2xvc2VzdENvcnJlY3RHVG9uZSA9IG5ld01lbG9keVNlbWl0b25lO1xuICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAoTWF0aC5hYnMoY2xvc2VzdENvcnJlY3RHVG9uZSAtIGNsb3Nlc3RDb3JyZWN0R1RvbmVCYXNlZE9uKSA+IDYgJiYgY2xvc2VzdENvcnJlY3RHVG9uZSA8PSBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICBpdGVyYXRpb25zKys7IGlmIChpdGVyYXRpb25zID4gMTAwKSB7IGRlYnVnZ2VyOyAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICBjbG9zZXN0Q29ycmVjdEdUb25lICs9IDEyICogTWF0aC5zaWduKGNsb3Nlc3RDb3JyZWN0R1RvbmVCYXNlZE9uIC0gY2xvc2VzdENvcnJlY3RHVG9uZSk7XG4gICAgfVxuXG4gICAgbGV0IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgaWYgKG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dENvcnJlY3RHdG9uZSA9IGdsb2JhbFNlbWl0b25lKGN1cnJlbnRTY2FsZS5ub3Rlc1tuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdKSAlIDEyO1xuICAgICAgICBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKG5leHRDb3JyZWN0R3RvbmUgLSBjbG9zZXN0Q29ycmVjdEdUb25lKSA+IDYgJiYgbmV4dENvcnJlY3RHdG9uZSA8PSBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrOyBpZiAoaXRlcmF0aW9ucyA+IDEwMCkgeyBkZWJ1Z2dlcjsgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICAgICAgbmV4dENvcnJlY3RHdG9uZSArPSAxMiAqIE1hdGguc2lnbihjbG9zZXN0Q29ycmVjdEdUb25lIC0gbmV4dENvcnJlY3RHdG9uZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXh0Q29ycmVjdEd0b25lIHx8ICFuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIC8vIElmIG1lbG9keSBoYXMgZW5kZWQsIHVzZSBjdXJyZW50IG1lbG9keSB0b25lLlxuICAgICAgICBuZXh0Q29ycmVjdEd0b25lID0gY2xvc2VzdENvcnJlY3RHVG9uZTtcbiAgICAgICAgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbjtcbiAgICB9XG5cbiAgICBsZXQgbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBtZWxvZHlUb25lc0FuZER1cmF0aW9uc1tjYWRlbmNlRGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgaWYgKCFuZXh0QmVhdE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICBuZXh0QmVhdE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgfVxuICAgIGxldCBuZXh0QmVhdENvcnJlY3RHVG9uZTtcbiAgICBpZiAobmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dEJlYXRDb3JyZWN0R1RvbmUgPSBnbG9iYWxTZW1pdG9uZShjdXJyZW50U2NhbGUubm90ZXNbbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24udG9uZV0pICUgMTI7XG4gICAgICAgIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAoTWF0aC5hYnMobmV4dEJlYXRDb3JyZWN0R1RvbmUgLSBuZXh0Q29ycmVjdEd0b25lKSA+IDYgJiYgbmV4dEJlYXRDb3JyZWN0R1RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25zKysgPiAxMDApIHsgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICAgICAgbmV4dEJlYXRDb3JyZWN0R1RvbmUgKz0gMTIgKiBNYXRoLnNpZ24obmV4dENvcnJlY3RHdG9uZSAtIG5leHRCZWF0Q29ycmVjdEdUb25lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIDE6IHRoZSBwcmV2aW91cyBub3RlLCAyOiB3aGF0IHRoZSBjdXJyZW50IG5vdGUgc2hvdWxkIGJlLCAzOiB3aGF0IHRoZSBuZXh0IG5vdGUgc2hvdWxkIGJlLlxuICAgIC8vIEJhc2VkIG9uIHRoZSByZXF1aXJlZCBkdXJhdGlvbnMsIHdlIGhhdmUgc29tZSBjaG9pY2VzOlxuXG4gICAgLy8gMS4gQmVhdCBtZWxvZHkgaXMgYSBxdWFydGVyLiBUaGlzIGlzIHRoZSBlYXNpZXN0IGNhc2UuXG4gICAgLy8gSGVyZSB3ZSBjYW4gYXQgdGhlIG1vc3QgdXNlIGEgOHRoLzh0aCBOQUMgb24gdGhlIHN0cm9uZyBiZWF0LlxuICAgIC8vIFRob3VnaCwgdGVuc2lvbiBpcyBhZGRlZC5cblxuICAgIC8vIDIuIEN1cnJlbnQgYmVhdCBtZWxvZHkgaXMgOHRoIGFuZCA4dGguIEJvdGggbm90ZXMgTVVTVCBiZSBjb3JyZWN0LlxuICAgIC8vIEJhc2Ugb24gdGhlIG5leHQgbm90ZSB3ZSBjYW4gdXNlIHNvbWUgTkFDcy4gVGhpcyBpcyB3aGVyZSB0aGUgd2VhayBiZWF0IE5BQ3MgY29tZSBpbi5cblxuICAgIC8vIDMuIEN1cnJlbnQgYmVhdCBtZWxvZHkgaXMgYSBoYWxmIG5vdGUuIFdlIGNhbiB1c2UgYSBzdHJvbmcgYmVhdCBOQUMuXG4gICAgLy8gVGVuc2lvbiBpcyBhZGRlZC5cblxuICAgIC8vIEhhcmRlciBjYXNlcywgc3VjaCBhcyBzeW5jb3BhdGlvbiwgYXJlIG5vdCBoYW5kbGVkLiB5ZXQuXG5cbiAgICBsZXQgcGFydDFNYXhHVG9uZSA9IE1hdGgubWF4KHRvR2xvYmFsU2VtaXRvbmVzWzFdLCBwcmV2UGFydDFSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZQYXJ0MVJpY2hOb3RlLm5vdGUpIDogMCk7XG5cbiAgICBjb25zdCBuYWNQYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge1xuICAgICAgICBmcm9tR1RvbmU6IGZyb21HbG9iYWxTZW1pdG9uZSB8fCBjbG9zZXN0Q29ycmVjdEdUb25lLFxuICAgICAgICB0aGlzQmVhdEdUb25lOiB0b0dsb2JhbFNlbWl0b25lLFxuICAgICAgICBuZXh0QmVhdEdUb25lOiBuZXh0QmVhdENvcnJlY3RHVG9uZSxcbiAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgY2hvcmQ6IGNob3JkLFxuICAgICAgICBnVG9uZUxpbWl0czogW3BhcnQxTWF4R1RvbmUsIDEyN10sICAvLyBUT0RPXG4gICAgICAgIHdhbnRlZEdUb25lczogW10sXG4gICAgfVxuXG4gICAgY29uc3QgZWVTdHJvbmdNb2RlID0gKFxuICAgICAgICBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggfHxcbiAgICAgICAgKFxuICAgICAgICAgICAgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIgJiYgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIpICYmXG4gICAgICAgICAgICBjbG9zZXN0Q29ycmVjdEdUb25lICE9IHRvR2xvYmFsU2VtaXRvbmVcbiAgICAgICAgKVxuICAgIClcblxuICAgIGlmIChlZVN0cm9uZ01vZGUpIHtcbiAgICAgICAgaWYgKGNsb3Nlc3RDb3JyZWN0R1RvbmUgPT0gdG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29ycmVjdCBub3RlLiBObyB0ZW5zaW9uLlxuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJDb3JyZWN0IHF1YXJ0ZXIgbm90ZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWRkIGEgcmlnaHQgTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC5cbiAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1swXSA9IGNsb3Nlc3RDb3JyZWN0R1RvbmU7XG4gICAgICAgIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgICAgICBuYWNQYXJhbXMud2FudGVkR1RvbmVzWzFdID0gbmV4dENvcnJlY3RHdG9uZTtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lICE9IG5leHRDb3JyZWN0R3RvbmUpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgSW5Db3JyZWN0IDh0aC84dGggbm90ZSwgJHtnVG9uZVN0cmluZyh0b0dsb2JhbFNlbWl0b25lKX0gIT0gJHtnVG9uZVN0cmluZyhuZXh0Q29ycmVjdEd0b25lKX1gO1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmFjUGFyYW1zLnNwbGl0TW9kZSA9IFwiRUVcIlxuICAgICAgICBjb25zdCBuYWMgPSBmaW5kTkFDcyhuYWNQYXJhbXMgYXMgRmluZE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgIGlmICghbmFjKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgTm8gTkFDIGZvdW5kOiB3YW50ZWRUb25lczogJHsobmFjUGFyYW1zLndhbnRlZEdUb25lcyBhcyBudW1iZXJbXSkubWFwKHRvbmUgPT4gZ1RvbmVTdHJpbmcodG9uZSkpfWAgKyBgJHtnVG9uZVN0cmluZyhuYWNQYXJhbXMudGhpc0JlYXRHVG9uZSl9LCAke2dUb25lU3RyaW5nKG5leHRDb3JyZWN0R3RvbmUpfSwgJHtnVG9uZVN0cmluZyhuYWNQYXJhbXMubmV4dEJlYXRHVG9uZSl9YDtcbiAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbiArPSAxMDA7XG4gICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdOb3RlR1RvbmUgPSBnbG9iYWxTZW1pdG9uZShuYWMubm90ZSk7XG4gICAgICAgIC8vIEdyZWF0Li4uIFdlIGNhbiBhZGQgYSBjb3JyZWN0IDh0aCBvbiB0aGUgc3Ryb25nIGJlYXQhXG4gICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAvLyB0ZW5zaW9uLmNvbW1lbnQgPSBgQWRkaW5nIE5BQyBvbiBzdHJvbmcgYmVhdDogJHtnVG9uZVN0cmluZyhnbG9iYWxTZW1pdG9uZShuYWMubm90ZSkpfSB0byBkaXZpc2lvbiAke2N1cnJlbnREaXZpc2lvbn0sIHdhbnRlZEd0b25lczogJHtuYWNQYXJhbXMud2FudGVkR1RvbmVzLm1hcChnVG9uZVN0cmluZyl9YDtcbiAgICAgICAgdGVuc2lvbi5uYWMgPSBuYWM7XG4gICAgICAgIHRlbnNpb24udGVuc2lvbiArPSA1OyAvLyBOb3QgdGhhdCBncmVhdCwgYnV0IGl0J3MgYmV0dGVyIHRoYW4gbm90aGluZy5cbiAgICB9IGVsc2UgaWYgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIgJiYgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWRkIGEgcmlnaHQgTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC4gYW5kIGEgcmlnaHQgbmFjIG9uIHdlYWsgYmVhdFxuICAgICAgICBpZiAoY2xvc2VzdENvcnJlY3RHVG9uZSA9PSB0b0dsb2JhbFNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTdHJvbmcgYmVhdCBpcyBhbHJlYWR5IGNvcnJlY3QuIE5lZWQgYSBub3RlIG9uIHdlYWsgYmVhdFxuICAgICAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1sxXSA9IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgICAgICAgICBuYWNQYXJhbXMuc3BsaXRNb2RlID0gXCJFRVwiXG4gICAgICAgICAgICBjb25zdCBuYWMgPSBmaW5kTkFDcyhuYWNQYXJhbXMgYXMgRmluZE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgICAgICBpZiAoIW5hYykge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gTkFDIGZvdW5kIGZvciBxdWFydGVyIG5vdGVcIjtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3Tm90ZUdUb25lID0gZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpO1xuICAgICAgICAgICAgLy8gR3JlYXQuLi4gV2UgY2FuIGFkZCBhIGNvcnJlY3QgOHRoIG9uIHRoZSBzdHJvbmcgYmVhdCFcbiAgICAgICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAgICAgLy8gdGVuc2lvbi5jb21tZW50ID0gYEFkZGluZyB3ZWFrIEVFIE5BQyAke2dUb25lU3RyaW5nKGdsb2JhbFNlbWl0b25lKG5hYy5ub3RlKSl9IHRvIGRpdmlzaW9uICR7Y3VycmVudERpdmlzaW9ufSwgd2FudGVkR3RvbmVzOiAke25hY1BhcmFtcy53YW50ZWRHVG9uZXMubWFwKGdUb25lU3RyaW5nKX1gO1xuICAgICAgICAgICAgdGVuc2lvbi5uYWMgPSBuYWM7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGFic29sdXRlbHkgcGVyZmVjdCwgYm90aCBub3RlcyBhcmUgY29ycmVjdC4gKG5vIHRlbnNpb24hKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2VsbCwgbm8gY2FuIGRvIHRoZW4gSSBndWVzcy5cbiAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiY2xvc2VzdENvcnJlY3RHVG9uZSAhPSB0b0dsb2JhbFNlbWl0b25lXCI7XG4gICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBlbHNlIHtcbiAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYCR7bmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9ufSAhPSAke0JFQVRfTEVOR1RIfWA7XG4gICAgfVxuICAgIFxuICAgIHRlbnNpb24udGVuc2lvbiA9IDA7XG4gICAgcmV0dXJuIHRlbnNpb247XG59IiwiaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IENob3JkLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIHNlbWl0b25lRGlzdGFuY2UsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgdHlwZSBJbnZlcnNpb25SZXN1bHQgPSB7XG4gICAgZ1RvbmVEaWZmczogQXJyYXk8QXJyYXk8bnVtYmVyPj4sXG4gICAgbm90ZXM6IHtba2V5OiBudW1iZXJdOiBOb3RlfSxcbiAgICByYXRpbmc6IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lOiBzdHJpbmcsXG59XG5cbmV4cG9ydCB0eXBlIFNpbXBsZUludmVyc2lvblJlc3VsdCA9IHtcbiAgICBub3RlczogQXJyYXk8Tm90ZT4sXG4gICAgcmF0aW5nOiBudW1iZXIsXG4gICAgaW52ZXJzaW9uTmFtZTogc3RyaW5nLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzaW9ucyA9ICh2YWx1ZXM6IHtcbiAgICAgICAgY2hvcmQ6IENob3JkLCBwcmV2Tm90ZXM6IEFycmF5PE5vdGU+LCBiZWF0OiBudW1iZXIsIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgICAgIGxvZ2dlcjogTG9nZ2VyLCBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBudW1iZXJcbiAgICB9KTogQXJyYXk8U2ltcGxlSW52ZXJzaW9uUmVzdWx0PiA9PiB7XG4gICAgY29uc3Qge2Nob3JkLCBwcmV2Tm90ZXMsIGJlYXQsIHBhcmFtcywgbG9nZ2VyLCBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nfSA9IHZhbHVlcztcbiAgICAvLyBSZXR1cm4gTm90ZXMgaW4gdGhlIENob3JkIHRoYXQgYXJlIGNsb3Nlc3QgdG8gdGhlIHByZXZpb3VzIG5vdGVzXG4gICAgLy8gRm9yIGVhY2ggcGFydFxuXG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKHBhcmFtcyk7XG5cbiAgICAvLyBBZGQgYSByZXN1bHQgZm9yIGVhY2ggcG9zc2libGUgaW52ZXJzaW9uXG4gICAgY29uc3QgcmV0OiBBcnJheTxTaW1wbGVJbnZlcnNpb25SZXN1bHQ+ID0gW107XG5cbiAgICBsZXQgbGFzdEJlYXRHbG9iYWxTZW1pdG9uZXMgPSBbLi4uc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNdXG4gICAgaWYgKHByZXZOb3Rlcykge1xuICAgICAgICBsYXN0QmVhdEdsb2JhbFNlbWl0b25lcyA9IHByZXZOb3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjaG9yZCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgaWYgKGNob3JkKSB7XG4gICAgICAgIC8vIEZvciBlYWNoIGJlYXQsIHdlIHRyeSB0byBmaW5kIGEgZ29vZCBtYXRjaGluZyBzZW1pdG9uZSBmb3IgZWFjaCBwYXJ0LlxuXG4gICAgICAgIC8vIFJ1bGVzOlxuICAgICAgICAvLyBXaXRoXHRyb290IHBvc2l0aW9uIHRyaWFkczogZG91YmxlIHRoZSByb290LiBcblxuICAgICAgICAvLyBXaXRoIGZpcnN0IGludmVyc2lvbiB0cmlhZHM6IGRvdWJsZSB0aGUgcm9vdCBvciA1dGgsIGluIGdlbmVyYWwuIElmIG9uZSBuZWVkcyB0byBkb3VibGUgXG4gICAgICAgIC8vIHRoZSAzcmQsIHRoYXQgaXMgYWNjZXB0YWJsZSwgYnV0IGF2b2lkIGRvdWJsaW5nIHRoZSBsZWFkaW5nIHRvbmUuXG5cbiAgICAgICAgLy8gV2l0aCBzZWNvbmQgaW52ZXJzaW9uIHRyaWFkczogZG91YmxlIHRoZSBmaWZ0aC4gXG5cbiAgICAgICAgLy8gV2l0aCAgc2V2ZW50aCAgY2hvcmRzOiAgdGhlcmUgIGlzICBvbmUgdm9pY2UgIGZvciAgZWFjaCAgbm90ZSwgIHNvICBkaXN0cmlidXRlIGFzICBmaXRzLiBJZiAgb25lIFxuICAgICAgICAvLyBtdXN0IG9taXQgYSBub3RlIGZyb20gdGhlIGNob3JkLCB0aGVuIG9taXQgdGhlIDV0aC5cblxuICAgICAgICBjb25zdCBmaXJzdEludGVydmFsID0gc2VtaXRvbmVEaXN0YW5jZShjaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSwgY2hvcmQubm90ZXNbMV0uc2VtaXRvbmUpXG4gICAgICAgIGNvbnN0IHRoaXJkSXNHb29kID0gZmlyc3RJbnRlcnZhbCA9PSAzIHx8IGZpcnN0SW50ZXJ2YWwgPT0gNDtcbiAgICAgICAgbG9nZ2VyLmxvZyhcIm5vdGVzOiBcIiwgY2hvcmQubm90ZXMubWFwKG4gPT4gbi50b1N0cmluZygpKSk7XG5cbiAgICAgICAgLy8gRGVwZW5kaW5nIG9uIHRoZSBpbnZlcnNpb24gYW5kIGNob3JkIHR5cGUsIHdlJ3JlIGRvaW5nIGRpZmZlcmVudCB0aGluZ3NcblxuICAgICAgICBsZXQgaW52ZXJzaW9uTmFtZXMgPSBbXCJyb290XCIsIFwicm9vdC1maWZ0aFwiLCBcImZpcnN0LXJvb3RcIiwgXCJmaXJzdC10aGlyZFwiLCBcImZpcnN0LWZpZnRoXCIsIFwic2Vjb25kXCJdO1xuICAgICAgICBsZXQgY29tYmluYXRpb25Db3VudCA9IDMgKiAyICogMTtcbiAgICAgICAgaWYgKGNob3JkLm5vdGVzLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWVzID0gW1wicm9vdFwiLCBcImZpcnN0XCIsIFwic2Vjb25kXCIsIFwidGhpcmRcIl07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBza2lwRmlmdGhJbmRleCA9IDA7IHNraXBGaWZ0aEluZGV4IDwgMjsgc2tpcEZpZnRoSW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBpbnZlcnNpb25JbmRleD0wOyBpbnZlcnNpb25JbmRleDxpbnZlcnNpb25OYW1lcy5sZW5ndGg7IGludmVyc2lvbkluZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgY29tYmluYXRpb25JbmRleD0wOyBjb21iaW5hdGlvbkluZGV4PGNvbWJpbmF0aW9uQ291bnQ7IGNvbWJpbmF0aW9uSW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3Qgc2tpcEZpZnRoID0gc2tpcEZpZnRoSW5kZXggPT0gMTtcblxuICAgICAgICAgICAgLy8gV2UgdHJ5IGVhY2ggaW52ZXJzaW9uLiBXaGljaCBpcyBiZXN0P1xuICAgICAgICAgICAgY29uc3QgaW52ZXJzaW9uID0gaW52ZXJzaW9uTmFtZXNbaW52ZXJzaW9uSW5kZXhdO1xuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcgPCAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnZlcnNpb24uc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBEb24ndCBkbyBhbnl0aGluZyBidXQgcm9vdCBwb3NpdGlvbiBvbiB0aGUgbGFzdCBjaG9yZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaW52ZXJzaW9uUmVzdWx0OiBJbnZlcnNpb25SZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgZ1RvbmVEaWZmczogW10sXG4gICAgICAgICAgICAgICAgbm90ZXM6IHt9LFxuICAgICAgICAgICAgICAgIHJhdGluZzogMCxcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25OYW1lc1tpbnZlcnNpb25JbmRleF0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHNraXBGaWZ0aCkge1xuICAgICAgICAgICAgICAgIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICs9IFwiLXNraXBGaWZ0aFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUgKz0gXCItXCIgKyBjb21iaW5hdGlvbkluZGV4O1xuXG4gICAgICAgICAgICBjb25zdCBhZGRQYXJ0Tm90ZSA9IChwYXJ0SW5kZXg6IG51bWJlciwgbm90ZTogTm90ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdID0gbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogbm90ZS5zZW1pdG9uZSxcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiAxICAvLyBkdW1teVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2dnZXIubG9nKFwiaW52ZXJzaW9uOiBcIiwgaW52ZXJzaW9uLCBcInNraXBGaWZ0aDogXCIsIHNraXBGaWZ0aCk7XG4gICAgICAgICAgICBsZXQgcGFydFRvSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcblxuICAgICAgICAgICAgLy8gRmlyc3Qgc2VsZWN0IGJvdHRvbSBub3RlXG4gICAgICAgICAgICBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ2ZpcnN0JykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3RoaXJkJykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExpc3Qgbm90ZXMgd2UgaGF2ZSBsZWZ0IG92ZXJcbiAgICAgICAgICAgIGxldCBsZWZ0T3ZlckluZGV4ZXM6IG51bWJlcltdID0gW107XG4gICAgICAgICAgICBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzaW9uID09IFwicm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAyXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwicm9vdC1maWZ0aFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFsxLCAyLCAyXTsgIC8vIERvdWJsZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LXJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXJzdCAtPiBXZSBhbHJlYWR5IGhhdmUgMVxuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMCwgMl07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LXRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDJdOyAgLy8gRG91YmxlIHRoZSB0aGlyZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmQgLT4gV2UgYWxyZWFkeSBoYXZlIDJcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAyLCAzXS5maWx0ZXIoaSA9PiBpICE9IHBhcnRUb0luZGV4WzNdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNraXBGaWZ0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0VG9JbmRleFszXSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaW4gc2Vjb25kIGludmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDIpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaWYgd2UgaGF2ZSB0d29cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpICE9IDIpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBlaXRoZXIgYSAwIG9yIDEgdG8gcmVwbGFjZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICBpZiAobGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgPT0gMCkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZXBlbmRpbmcgb24gY29tYmluYXRpb25JbmRleCwgd2Ugc2VsZWN0IHRoZSBub3RlcyBmb3IgcGFydEluZGV4ZXMgMCwgMSwgMlxuICAgICAgICAgICAgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlyZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gRm91cnRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBGaWZ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgLy8gU2l4dGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgcGFydEluZGV4PTA7IHBhcnRJbmRleDw0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHBhcnQgaXMgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFBhcnROb3RlKHBhcnRJbmRleCwgY2hvcmQubm90ZXNbcGFydFRvSW5kZXhbcGFydEluZGV4XV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGFzdGx5LCB3ZSBzZWxlY3QgdGhlIGxvd2VzdCBwb3NzaWJsZSBvY3RhdmUgZm9yIGVhY2ggcGFydFxuICAgICAgICAgICAgbGV0IG1pblNlbWl0b25lID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0zOyBwYXJ0SW5kZXg+PTA7IHBhcnRJbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBnVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGk9MDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZ1RvbmUgPCBzZW1pdG9uZUxpbWl0c1twYXJ0SW5kZXhdWzBdIHx8IGdUb25lIDwgbWluU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUb28gbWFueSBpdGVyYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnVG9uZSArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IGludmVyc2lvbnJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBvY3RhdmUgY29tYmluYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0ME5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMF0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQxTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1sxXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDJOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzJdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0M05vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbM10pO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydDBPY3RhdmU9MDsgcGFydDBPY3RhdmU8MzsgcGFydDBPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQwTm90ZSA9IGluaXRpYWxQYXJ0ME5vdGUgKyBwYXJ0ME9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ME5vdGUgPiBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDFPY3RhdmU9MDsgcGFydDFPY3RhdmU8MzsgcGFydDFPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0MU5vdGUgPSBpbml0aWFsUGFydDFOb3RlICsgcGFydDFPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHBhcnQwTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHNlbWl0b25lTGltaXRzWzFdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0Mk9jdGF2ZT0wOyBwYXJ0Mk9jdGF2ZTwzOyBwYXJ0Mk9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0Mk5vdGUgPSBpbml0aWFsUGFydDJOb3RlICsgcGFydDJPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBwYXJ0MU5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBzZW1pdG9uZUxpbWl0c1syXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDNPY3RhdmU9MDsgcGFydDNPY3RhdmU8MzsgcGFydDNPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQzTm90ZSA9IGluaXRpYWxQYXJ0M05vdGUgKyBwYXJ0M09jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBwYXJ0Mk5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBzZW1pdG9uZUxpbWl0c1szXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0ME5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDBOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQxTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0MU5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDJOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQyTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0M05vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDNOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICsgYCAke3BhcnQwT2N0YXZlfSR7cGFydDFPY3RhdmV9JHtwYXJ0Mk9jdGF2ZX0ke3BhcnQzT2N0YXZlfWAgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQwTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQxTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQyTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQzTm90ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbG9nZ2VyLnByaW50KFwibmV3Vm9pY2VMZWFkaW5nTm90ZXM6IFwiLCBjaG9yZC50b1N0cmluZygpLCBcIiBiZWF0OiBcIiwgYmVhdCk7XG5cbiAgICAvLyBSYW5kb21pemUgb3JkZXIgb2YgcmV0XG4gICAgZm9yIChsZXQgaT0wOyBpPHJldC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmV0Lmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IHRtcCA9IHJldFtpXTtcbiAgICAgICAgcmV0W2ldID0gcmV0W2pdO1xuICAgICAgICByZXRbal0gPSB0bXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cbiIsImNvbnN0IHByaW50Q2hpbGRNZXNzYWdlcyA9IChjaGlsZExvZ2dlcjogTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZExvZ2dlci5jaGlsZHJlbikge1xuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLmNoaWxkLnRpdGxlKTtcbiAgICAgICAgcHJpbnRDaGlsZE1lc3NhZ2VzKGNoaWxkKTtcbiAgICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIGNoaWxkLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcbiAgICB0aXRsZTogYW55W10gPSBbXTtcbiAgICBtZXNzYWdlczogQXJyYXk8YW55W10+ID0gW107XG4gICAgcGFyZW50OiBMb2dnZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgY2hpbGRyZW46IExvZ2dlcltdID0gW107XG4gICAgY2xlYXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBMb2dnZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9nKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChhcmdzKTtcbiAgICB9XG5cbiAgICBwcmludCguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5jbGVhcmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICAvLyBMZXQgcGFyZW50IGhhbmRsZSBtZVxuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUgPSBhcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uYXJncylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4udGhpcy50aXRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgdG9wIGxvZ2dlci4gUHJpbnQgZXZlcnl0aGluZy5cbiAgICAgICAgcHJpbnRDaGlsZE1lc3NhZ2VzKHRoaXMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLnRoaXMubWVzc2FnZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4gPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJlZCA9IHRydWU7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IGdldFRlbnNpb24sIFRlbnNpb24gfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdldFJoeXRobU5lZWRlZER1cmF0aW9ucywgZ2V0UmljaE5vdGUsIGdsb2JhbFNlbWl0b25lLCBuZXh0R1RvbmVJblNjYWxlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc2VtaXRvbmVTY2FsZUluZGV4LCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgdHlwZSBOb25DaG9yZFRvbmUgPSB7XG4gICAgbm90ZTogTm90ZSxcbiAgICBub3RlMj8gOiBOb3RlLCAgLy8gVGhpcyBtYWtlcyB0aGUgbm90ZXMgMTZ0aHNcbiAgICBzdHJvbmdCZWF0OiBib29sZWFuLFxuICAgIHJlcGxhY2VtZW50PzogYm9vbGVhbixcbn1cblxuZXhwb3J0IHR5cGUgTm9uQ2hvcmRUb25lUGFyYW1zID0ge1xuICAgIGdUb25lMDogbnVtYmVyIHwgbnVsbCxcbiAgICBnVG9uZTE6IG51bWJlcixcbiAgICBnVG9uZTI6IG51bWJlcixcbiAgICB3YW50ZWRUb25lPyA6IG51bWJlcixcbiAgICBzdHJvbmdCZWF0PzogYm9vbGVhbixcbiAgICBjaG9yZD8gOiBDaG9yZCxcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgZ1RvbmVMaW1pdHM6IG51bWJlcltdLFxufVxuXG50eXBlIFNwbGl0TW9kZSA9IFwiRUVcIiB8IFwiU1NFXCIgfCBcIkVTU1wiIHwgXCJTU1NTXCJcblxuZXhwb3J0IHR5cGUgRmluZE5vbkNob3JkVG9uZVBhcmFtcyA9IHtcbiAgICBmcm9tR1RvbmU6IG51bWJlcixcbiAgICB0aGlzQmVhdEdUb25lOiBudW1iZXIsXG4gICAgbmV4dEJlYXRHVG9uZTogbnVtYmVyLFxuICAgIHNwbGl0TW9kZTogU3BsaXRNb2RlLFxuICAgIHdhbnRlZEdUb25lczogbnVtYmVyW10sICAvLyBQcm92aWRlIGd0b25lcyBmb3IgZWFjaCB3YW50ZWQgaW5kZXggb2Ygc3BsaXRtb2RlXG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIGdUb25lTGltaXRzOiBudW1iZXJbXSxcbiAgICBjaG9yZD86IENob3JkLFxufVxuXG5cbmV4cG9ydCBjb25zdCBhZGROb3RlQmV0d2VlbiA9IChuYWM6IE5vbkNob3JkVG9uZSwgZGl2aXNpb246IG51bWJlciwgbmV4dERpdmlzaW9uOiBudW1iZXIsIHBhcnRJbmRleDogbnVtYmVyLCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBkaXZpc2lvbkRpZmYgPSBuZXh0RGl2aXNpb24gLSBkaXZpc2lvbjtcbiAgICBjb25zdCBiZWF0UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSB8fCBbXSkuZmlsdGVyKG5vdGUgPT4gbm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KVswXTtcbiAgICBpZiAoIWJlYXRSaWNoTm90ZSB8fCAhYmVhdFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJGYWllbGQgdG8gYWRkIG5vdGUgYmV0d2VlblwiLCBkaXZpc2lvbiwgbmV4dERpdmlzaW9uLCBwYXJ0SW5kZXgsIGRpdmlzaW9uZWROb3Rlcyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdOb3RlID0gbmFjLm5vdGU7XG4gICAgY29uc3QgbmV3Tm90ZTIgPSBuYWMubm90ZTI7XG4gICAgY29uc3Qgc3Ryb25nQmVhdCA9IG5hYy5zdHJvbmdCZWF0O1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gbmFjLnJlcGxhY2VtZW50IHx8IGZhbHNlO1xuXG4gICAgLy8gSWYgc3Ryb25nIGJlYXQsIHdlIGFkZCBuZXdOb3RlIEJFRk9SRSBiZWF0UmljaE5vdGVcbiAgICAvLyBPdGhlcndpc2Ugd2UgYWRkIG5ld05vdGUgQUZURVIgYmVhdFJpY2hOb3RlXG5cbiAgICBpZiAoc3Ryb25nQmVhdCkge1xuICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdIHx8IFtdO1xuICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZSA9IHtcbiAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gMixcbiAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIG5ldyB0b25lIHRvIGRpdmlzaW9uXG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIC8vIFJlbW92ZSBiZWF0UmljaE5vdGUgZnJvbSBkaXZpc2lvblxuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5maWx0ZXIobm90ZSA9PiBub3RlICE9IGJlYXRSaWNoTm90ZSk7XG4gICAgICAgIGlmICghcmVwbGFjZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIEFkZCBiZWF0UmljaE5vdGUgdG8gZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKGJlYXRSaWNoTm90ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBZGQgbmV3IHRvbmUgYWxzbyB0byBkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuZXdOb3RlMikge1xuICAgICAgICAgICAgLy8gYWRkaW5nIDEgOHRoIG5vdGVcbiAgICAgICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gMixcbiAgICAgICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFkZGluZyAyIDE2dGggbm90ZXNcbiAgICAgICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gNCxcbiAgICAgICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAqIDAuNzVdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmICogMC43NV0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZTIgPSB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3Tm90ZTIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDQsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmICogMC43NV0ucHVzaChuZXdSYW5kb21SaWNoTm90ZTIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbmNvbnN0IHBhc3NpbmdUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gUmV0dXJuIGEgbmV3IGdUb25lIG9yIG51bGwsIGJhc2VkIG9uIHdoZXRoZXIgYWRkaW5nIGEgcGFzc2luZyB0b25lIGlzIGEgZ29vZCBpZGVhLlxuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoZ1RvbmUxIC0gZ1RvbmUyKTtcbiAgICBpZiAoZGlzdGFuY2UgPCAzIHx8IGRpc3RhbmNlID4gNCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVUb25lcyA9IHNjYWxlLm5vdGVzLm1hcChuID0+IG4uc2VtaXRvbmUpO1xuICAgIGZvciAobGV0IGdUb25lPWdUb25lMTsgZ1RvbmUgIT0gZ1RvbmUyOyBnVG9uZSArPSAoZ1RvbmUxIDwgZ1RvbmUyID8gMSA6IC0xKSkge1xuICAgICAgICBpZiAoZ1RvbmUgPT0gZ1RvbmUxKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IGdUb25lICUgMTI7XG4gICAgICAgIGlmIChzY2FsZVRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgc3Ryb25nQmVhdDogZmFsc2UsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuY29uc3QgYWNjZW50ZWRQYXNzaW5nVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIC8vIFNhbWUgYXMgcGFzc2luZyB0b25lIGJ1dCBvbiBzdHJvbmcgYmVhdFxuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKGdUb25lMCAtIGdUb25lMSk7XG4gICAgaWYgKGRpc3RhbmNlIDwgMyB8fCBkaXN0YW5jZSA+IDQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlVG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobiA9PiBuLnNlbWl0b25lKTtcbiAgICBmb3IgKGxldCBnVG9uZT1nVG9uZTA7IGdUb25lICE9IGdUb25lMTsgZ1RvbmUgKz0gKGdUb25lMCA8IGdUb25lMSA/IDEgOiAtMSkpIHtcbiAgICAgICAgaWYgKGdUb25lID09IGdUb25lMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBnVG9uZSAlIDEyO1xuICAgICAgICBpZiAoc2NhbGVUb25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHN0cm9uZ0JlYXQ6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuXG5jb25zdCBuZWlnaGJvclRvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwLCB0aGVuIHN0ZXAgYmFjay4gVGhpcyBpcyBvbiBXZWFrIGJlYXRcbiAgICBpZiAoZ1RvbmUxICE9IGdUb25lMikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVJbmRleCA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgdXBPckRvd25DaG9pY2VzID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFsxLCAtMV0gOiBbLTEsIDFdO1xuICAgIGZvciAoY29uc3QgdXBPckRvd24gb2YgdXBPckRvd25DaG9pY2VzKSB7XG4gICAgICAgIGNvbnN0IG5ld0d0b25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgICAgIGlmICghbmV3R3RvbmUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdHdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IG5ld0d0b25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IG5ld0d0b25lICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IobmV3R3RvbmUgLyAxMiksXG4gICAgICAgIH0pLCBzdHJvbmdCZWF0OiBmYWxzZX07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmNvbnN0IHN1c3BlbnNpb24gPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGF5IG9uIHByZXZpb3VzLCB0aGVuIHN0ZXAgRE9XTiBpbnRvIGNob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXQuXG4gICAgLy8gVXN1YWxseSBkb3R0ZWQhXG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUwIC0gZ1RvbmUxO1xuICAgIGlmIChkaXN0YW5jZSA8IDEgfHwgZGlzdGFuY2UgPiAyKSB7XG4gICAgICAgIC8vIE11c3QgYmUgaGFsZiBvciB3aG9sZSBzdGVwIGRvd24uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgZ1RvbmUxIHRvIGdUb25lMCBmb3IgdGhlIGxlbmd0aCBvZiB0aGUgc3VzcGVuc2lvbi5cbiAgICByZXR1cm4ge1xuICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUwICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgICAgICB9KSxcbiAgICAgICAgc3Ryb25nQmVhdDogdHJ1ZSxcbiAgICB9XG59XG5cblxuY29uc3QgcmV0YXJkYXRpb24gPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGF5IG9uIHByZXZpb3VzLCB0aGVuIHN0ZXAgVVAgaW50byBjaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgLy8gVXN1YWxseSBkb3R0ZWQhXG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChkaXN0YW5jZSA8IDEgfHwgZGlzdGFuY2UgPiAyKSB7XG4gICAgICAgIC8vIE11c3QgYmUgaGFsZiBvciB3aG9sZSBzdGVwIHVwLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGdUb25lMSB0byBnVG9uZTAgZm9yIHRoZSBsZW5ndGggb2YgdGhlIHN1c3BlbnNpb24uXG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07fVxuXG5cbmNvbnN0IGFwcG9naWF0dXJhID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gTGVhcCwgdGhlbiBzdGVwIGJhY2sgaW50byBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB1cE9yRG93biA9IC0xO1xuICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCBkb3duIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGFwcG9naWF0dXJhXG4gICAgaWYgKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgdXAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXBwb2dpYXR1cmFcbiAgICAgICAgdXBPckRvd24gPSAxO1xuICAgIH1cbiAgICBjb25zdCBnVG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCB1cE9yRG93biwgc2NhbGUpO1xuICAgIGlmICghZ1RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTtcbn1cblxuY29uc3QgZXNjYXBlVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgYXdheSwgdGhlbiBMZWFwIGluIHRvIG5leHQgQ2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdFxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMSAtIGdUb25lMDtcbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2UpIDwgMykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgdXBPckRvd24gPSAxO1xuICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCB1cCBmcm9tIGdUb25lMCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBlc2NhcGVUb25lXG4gICAgaWYgKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgZG93biBmcm9tIGdUb25lMCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBlc2NhcGVUb25lXG4gICAgICAgIHVwT3JEb3duID0gLTE7XG4gICAgfVxuICAgIGNvbnN0IGdUb25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTAsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgaWYgKCFnVG9uZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O1xufVxuXG5jb25zdCBhbnRpY2lwYXRpb24gPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIG9yIGxlYXAgZWFybHkgaW4gdG8gbmV4dCBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIHdlYWsgYmVhdC5cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMiAtIGdUb25lMTtcbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2UpIDwgMSkge1xuICAgICAgICAvLyBUb28gY2xvc2UgdG8gYmUgYW4gYW50aWNpcGF0aW9uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEVhc3kuIEp1c3QgbWFrZSBhIG5ldyBub3RlIHRoYXRzIHRoZSBzYW1lIGFzIGdUb25lMi5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMiAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUyIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiBmYWxzZX07XG59XG5cbmNvbnN0IG5laWdoYm9yR3JvdXAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIGF3YXksIHRoZW4gbGVhcCBpbnRvIHRoZSBcIm90aGVyIHBvc3NpYmxlXCIgbmVpZ2hib3IgdG9uZS4gVGhpcyB1c2VzIDE2dGhzICh0d28gbm90ZXMpLlxuICAgIC8vIFdlYWsgYmVhdFxuICAgIGlmIChnVG9uZTEgIT0gZ1RvbmUyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4KHNjYWxlKVtnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB1cEd0b25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIDEsIHNjYWxlKTtcbiAgICBjb25zdCBkb3duR3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgLTEsIHNjYWxlKTtcbiAgICBpZiAoIXVwR3RvbmUgfHwgIWRvd25HdG9uZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHVwR3RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCB1cEd0b25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChkb3duR3RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBkb3duR3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IHVwR3RvbmUgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcih1cEd0b25lIC8gMTIpLFxuICAgICAgICB9KSxcbiAgICAgICAgbm90ZTI6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBkb3duR3RvbmUgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihkb3duR3RvbmUgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZVxuICAgIH07XG59XG5cblxuY29uc3QgcGVkYWxQb2ludCA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFJlcGxhY2UgdGhlIGVudGlyZSBub3RlIHdpdGggdGhlIG5vdGUgdGhhdCBpcyBiZWZvcmUgaXQgQU5EIGFmdGVyIGl0LlxuICAgIGlmIChnVG9uZTAgIT0gZ1RvbmUyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUwID09IGdUb25lMSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgIC8vIEFscmVhZHkgZXhpc3RzXG4gICAgfVxuICAgIGlmIChnVG9uZTEgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZTEgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZSwgcmVwbGFjZW1lbnQ6IHRydWV9O1xufVxuXG5cbmNvbnN0IGNob3JkTm90ZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIC8vIEp1c3QgdXNlIGEgY2hvcmQgdG9uZS4gV2VhayBPUiBzdHJvbmcgYmVhdFxuICAgIGNvbnN0IHsgZ1RvbmUxLCBjaG9yZCB9ID0gdmFsdWVzO1xuICAgIGxldCBzdHJvbmdCZWF0ID0gdmFsdWVzLnN0cm9uZ0JlYXQ7XG4gICAgaWYgKCFzdHJvbmdCZWF0KSB7XG4gICAgICAgIHN0cm9uZ0JlYXQgPSBNYXRoLnJhbmRvbSgpID4gMC44O1xuICAgIH1cbiAgICBpZiAoIWNob3JkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgd2FudGVkVG9uZSA9IHZhbHVlcy53YW50ZWRUb25lO1xuICAgIGlmICghd2FudGVkVG9uZSkge1xuICAgICAgICAvLyBSYW5kb20gZnJvbSBjaG9yZC5ub3Rlc1xuICAgICAgICBjb25zdCBub3RlID0gY2hvcmQubm90ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hvcmQubm90ZXMubGVuZ3RoKV07XG4gICAgICAgIHdhbnRlZFRvbmUgPSBub3RlLnNlbWl0b25lO1xuICAgICAgICAvLyBTZWxlY3QgY2xvc2VzdCBvY3RhdmUgdG8gZ1RvbmUxXG4gICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKHdhbnRlZFRvbmUgLSBnVG9uZTEpID49IDYpIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25zKysgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdhbnRlZFRvbmUgKz0gMTI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGdvb2QgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG5vdGUgb2YgY2hvcmQubm90ZXMpIHtcbiAgICAgICAgaWYgKG5vdGUuc2VtaXRvbmUgPT0gd2FudGVkVG9uZSAlIDEyKSB7XG4gICAgICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghZ29vZCkge1xuICAgICAgICAvLyBXYW50ZWRUb25lIGlzIG5vdCBhIGNob3JkIHRvbmVcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiB3YW50ZWRUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcih3YW50ZWRUb25lIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiBzdHJvbmdCZWF0fTtcbn1cblxuY29uc3Qgd2Vha0JlYXRDaG9yZFRvbmUgID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgcmV0dXJuIGNob3JkTm90ZSh7XG4gICAgICAgIC4uLnZhbHVlcyxcbiAgICAgICAgc3Ryb25nQmVhdDogZmFsc2UsXG4gICAgfSk7XG59XG5cbmNvbnN0IHN0cm9uZ0JlYXRDaG9yZFRvbmUgID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgcmV0dXJuIGNob3JkTm90ZSh7XG4gICAgICAgIC4uLnZhbHVlcyxcbiAgICAgICAgc3Ryb25nQmVhdDogdHJ1ZSxcbiAgICB9KVxufVxuXG5cbmV4cG9ydCBjb25zdCBmaW5kTkFDcyA9ICh2YWx1ZXM6IEZpbmROb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7ZnJvbUdUb25lLCB0aGlzQmVhdEdUb25lLCBuZXh0QmVhdEdUb25lLCBzcGxpdE1vZGUsIHdhbnRlZEdUb25lcywgc2NhbGUsIGdUb25lTGltaXRzLCBjaG9yZH0gPSB2YWx1ZXM7XG5cbiAgICBjb25zdCBzdHJvbmdCZWF0RnVuY3M6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7XG4gICAgICAgICdzdHJvbmdCZWF0Q2hvcmRUb25lJzogc3Ryb25nQmVhdENob3JkVG9uZSxcbiAgICAgICAgJ2FwcG9naWF0dXJhJzogYXBwb2dpYXR1cmEsXG4gICAgICAgICdlc2NhcGVUb25lJzogZXNjYXBlVG9uZSxcbiAgICAgICAgJ3BlZGFsUG9pbnQnOiBwZWRhbFBvaW50LFxuICAgICAgICAnc3VzcGVuc2lvbic6IHN1c3BlbnNpb24sXG4gICAgICAgICdyZXRhcmRhdGlvbic6IHJldGFyZGF0aW9uLFxuICAgICAgICAnYWNjZW50ZWRQYXNzaW5nVG9uZSc6IGFjY2VudGVkUGFzc2luZ1RvbmUsXG4gICAgfVxuXG4gICAgY29uc3Qgd2Vha0JlYXRGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgJ3dlYWtCZWF0Q2hvcmRUb25lJzogd2Vha0JlYXRDaG9yZFRvbmUsXG4gICAgICAgICdhbnRpY2lwYXRpb24nOiBhbnRpY2lwYXRpb24sXG4gICAgICAgICduZWlnaGJvckdyb3VwJzogbmVpZ2hib3JHcm91cCxcbiAgICAgICAgJ3Bhc3NpbmdUb25lJzogcGFzc2luZ1RvbmUsXG4gICAgfVxuXG4gICAgaWYgKHNwbGl0TW9kZSA9PSAnRUUnKSB7XG4gICAgICAgIC8vIFRoaXMgY2FzZSBvbmx5IGhhcyAyIGNob2ljZXM6IHN0cm9uZyBvciB3ZWFrIGJlYXRcbiAgICAgICAgbGV0IHN0cm9uZ0JlYXQgPSBmYWxzZTtcbiAgICAgICAgLy8gRmluZCB0aGUgd2FudGVkIG5vdGVzXG4gICAgICAgIC8vIENoZWNrIGlmIHdlIG5lZWQgYSBjaGFuZ2Ugb24gc3Ryb25nIGJlYXQgb3Igb24gc29tZSBvdGhlciBiZWF0XG4gICAgICAgIGlmICh3YW50ZWRHVG9uZXNbMF0gJiYgd2FudGVkR1RvbmVzWzBdICE9IHRoaXNCZWF0R1RvbmUpIHtcbiAgICAgICAgICAgIHN0cm9uZ0JlYXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdHJvbmdCZWF0KSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmNOYW1lIGluIHN0cm9uZ0JlYXRGdW5jcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBzdHJvbmdCZWF0RnVuY3NbZnVuY05hbWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZ1bmMoe1xuICAgICAgICAgICAgICAgICAgICBnVG9uZTA6IGZyb21HVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUxOiB0aGlzQmVhdEdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTI6IG5leHRCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIHdhbnRlZFRvbmU6IHdhbnRlZEdUb25lc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lTGltaXRzLFxuICAgICAgICAgICAgICAgICAgICBjaG9yZCxcbiAgICAgICAgICAgICAgICB9IGFzIE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXdhbnRlZEdUb25lc1swXSB8fCBnbG9iYWxTZW1pdG9uZShyZXN1bHQubm90ZSkgPT0gd2FudGVkR1RvbmVzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jTmFtZSBpbiB3ZWFrQmVhdEZ1bmNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IHdlYWtCZWF0RnVuY3NbZnVuY05hbWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZ1bmMoe1xuICAgICAgICAgICAgICAgICAgICBnVG9uZTA6IGZyb21HVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUxOiB0aGlzQmVhdEdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTI6IG5leHRCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIHdhbnRlZFRvbmU6IHdhbnRlZEdUb25lc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lTGltaXRzLFxuICAgICAgICAgICAgICAgICAgICBjaG9yZCxcbiAgICAgICAgICAgICAgICB9IGFzIE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXdhbnRlZEdUb25lc1sxXSB8fCBnbG9iYWxTZW1pdG9uZShyZXN1bHQubm90ZSkgPT0gd2FudGVkR1RvbmVzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmV4cG9ydCBjb25zdCBidWlsZFRvcE1lbG9keSA9IChkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcykgPT4ge1xuICAgIC8vIEZvbGxvdyB0aGUgcHJlIGdpdmVuIG1lbG9keSByaHl0aG1cbiAgICBjb25zdCByaHl0aG1OZWVkZWREdXJhdGlvbnM6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyOyB9ID0gZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zKG1haW5QYXJhbXMpO1xuXG4gICAgY29uc3QgbGFzdERpdmlzaW9uID0gQkVBVF9MRU5HVEggKiBtYWluUGFyYW1zLmdldE1heEJlYXRzKCk7XG4gICAgY29uc3QgZmlyc3RQYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKDApO1xuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhmaXJzdFBhcmFtcyk7XG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbGFzdERpdmlzaW9uIC0gQkVBVF9MRU5HVEg7IGRpdmlzaW9uICs9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgIGxldCBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0ID0gW1xuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzBdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1sxXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMl1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzNdXSxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbWFpblBhcmFtcy5jdXJyZW50Q2FkZW5jZVBhcmFtcyhkaXZpc2lvbik7XG4gICAgICAgIGNvbnN0IGNhZGVuY2VEaXZpc2lvbiA9IGRpdmlzaW9uIC0gcGFyYW1zLmNhZGVuY2VTdGFydERpdmlzaW9uO1xuICAgICAgICBjb25zdCBuZWVkZWRSaHl0aG0gPSByaHl0aG1OZWVkZWREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uXSB8fCAxMDA7XG5cbiAgICAgICAgY29uc3QgbGFzdEJlYXRJbkNhZGVuY2UgPSBwYXJhbXMuYmVhdHNVbnRpbENhZGVuY2VFbmQgPCAyXG4gICAgICAgIGlmIChsYXN0QmVhdEluQ2FkZW5jZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcmV2Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgICAgICBjb25zdCB0aGlzTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgICAgICBjb25zdCBuZXh0Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgICAgICBsZXQgY3VycmVudFNjYWxlOiBTY2FsZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKHJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBpZiAocmljaE5vdGUuc2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIG5leHROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY3VycmVudFNjYWxlID0gY3VycmVudFNjYWxlO1xuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgbGltaXRzLCBuZXcgbm90ZXMgbXVzdCBhbHNvIGJlIGJldHdlZWVuIHRoZSBvdGhlciBwYXJ0IG5vdGVzXG4gICAgICAgICAgICAvLyAoIE92ZXJsYXBwaW5nIClcbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGdUb25lMSA9IGdsb2JhbFNlbWl0b25lKHJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgY29uc3QgZ1RvbmUyID0gZ2xvYmFsU2VtaXRvbmUobmV4dFJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgY29uc3QgbWluR1RvbmUgPSBNYXRoLm1pbihnVG9uZTEsIGdUb25lMik7XG4gICAgICAgICAgICBjb25zdCBtYXhHVG9uZSA9IE1hdGgubWF4KGdUb25lMSwgZ1RvbmUyKTtcbiAgICAgICAgICAgIGlmIChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgLy8gTGltaXQgdGhlIGhpZ2hlciBwYXJ0LCBpdCBjYW4ndCBnbyBsb3dlciB0aGFuIG1heEdUb25lXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXVswXSA9IE1hdGgubWF4KGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV1bMF0sIG1heEdUb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdKSB7XG4gICAgICAgICAgICAgICAgLy8gTGltaXQgdGhlIGxvd2VyIHBhcnQsIGl0IGNhbid0IGdvIGhpZ2hlciB0aGFuIG1pbkdUb25lXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXVsxXSA9IE1hdGgubWluKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV1bMV0sIG1pbkdUb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICBpZiAobmVlZGVkUmh5dGhtICE9IDIgKiBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIG5lZWQgZm9yIGhhbGYgbm90ZXNcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCBhIHRpZSB0byB0aGUgbmV4dCBub3RlXG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24sIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSkgIT0gZ2xvYmFsU2VtaXRvbmUobmV4dFJpY2hOb3RlLm5vdGUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWNoTm90ZS50aWUgPSBcInN0YXJ0XCI7XG4gICAgICAgICAgICBuZXh0UmljaE5vdGUudGllID0gXCJzdG9wXCI7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKG5lZWRlZFJoeXRobSAhPSAgQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gbmVlZCBmb3IgOHRocy5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcmljaE5vdGUuc2NhbGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gc2NhbGUgZm9yIHJpY2hOb3RlXCIsIHJpY2hOb3RlKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcHJldlJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiAtIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuXG4gICAgICAgICAgICBjb25zdCBnVG9uZTEgPSBnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lMiA9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGxldCBnVG9uZTAgPSBwcmV2UmljaE5vdGUgPyBnbG9iYWxTZW1pdG9uZShwcmV2UmljaE5vdGUubm90ZSkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGdUb25lMCAmJiBwcmV2UmljaE5vdGUgJiYgcHJldlJpY2hOb3RlLmR1cmF0aW9uICE9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgLy8gRklYTUU6IHByZXZSaWNoTm90ZSBpcyBub3QgdGhlIHByZXZpb3VzIG5vdGUuIFdlIGNhbm5vdCB1c2UgaXQgdG8gZGV0ZXJtaW5lIHRoZSBwcmV2aW91cyBub3RlLlxuICAgICAgICAgICAgICAgIGdUb25lMCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuYWNQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgZ1RvbmUwLFxuICAgICAgICAgICAgICAgIGdUb25lMSxcbiAgICAgICAgICAgICAgICBnVG9uZTIsXG4gICAgICAgICAgICAgICAgc2NhbGU6IHJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzOiBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleF0sXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkIDh0aCBub3RlcyB0aGlzIGJlYXQuXG5cbiAgICAgICAgICAgIGNvbnN0IG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAgICAgICAgIGFwcG9naWF0dXJhOiAoKSA9PiBhcHBvZ2lhdHVyYShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yR3JvdXA6ICgpID0+IG5laWdoYm9yR3JvdXAobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBzdXNwZW5zaW9uOiAoKSA9PiBzdXNwZW5zaW9uKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgZXNjYXBlVG9uZTogKCkgPT4gZXNjYXBlVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHBhc3NpbmdUb25lOiAoKSA9PiBwYXNzaW5nVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yVG9uZTogKCkgPT4gbmVpZ2hib3JUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcmV0YXJkYXRpb246ICgpID0+IHJldGFyZGF0aW9uKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgYW50aWNpcGF0aW9uOiAoKSA9PiBhbnRpY2lwYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBwZWRhbFBvaW50OiAoKSA9PiBwZWRhbFBvaW50KG5hY1BhcmFtcyksXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmUgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgdXNlZENob2ljZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9ucyA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9ucyBpbiA4dGggbm90ZSBnZW5lcmF0aW9uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmVDaG9pY2VzOiB7W2tleTogc3RyaW5nXTogTm9uQ2hvcmRUb25lfSA9IHt9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmcgPSBwYXJhbXMubm9uQ2hvcmRUb25lc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmcgfHwgIXNldHRpbmcuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlID0gbm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3Nba2V5XSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hvaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVDaG9pY2VzW2tleV0gPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFydEluZGV4ICE9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vbkNob3JkVG9uZUNob2ljZXMucGVkYWxQb2ludDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdXNpbmdLZXkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZUtleXMgPSBPYmplY3Qua2V5cyhub25DaG9yZFRvbmVDaG9pY2VzKS5maWx0ZXIoa2V5ID0+ICF1c2VkQ2hvaWNlcy5oYXMoa2V5KSk7XG4gICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZUtleXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBub25DaG9yZFRvbmVDaG9pY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VkQ2hvaWNlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9uQ2hvcmRUb25lID0gbm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNpbmdLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgcG9zc2libGUgbm9uIGNob3JkIHRvbmVcbiAgICAgICAgICAgICAgICAvLyBOb3cgd2UgbmVlZCB0byBjaGVjayB2b2ljZSBsZWFkaW5nIGZyb20gYmVmb3JlIGFuZCBhZnRlclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vbkNob3JkVG9uZU5vdGVzOiBOb3RlW10gPSBbLi4udGhpc05vdGVzXTtcblxuICAgICAgICAgICAgICAgIGlmIChub25DaG9yZFRvbmUuc3Ryb25nQmVhdCkge1xuICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVOb3Rlc1twYXJ0SW5kZXhdID0gbm9uQ2hvcmRUb25lLm5vdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbnNpb25SZXN1bHQgPSBuZXcgVGVuc2lvbigpO1xuICAgICAgICAgICAgICAgIGdldFRlbnNpb24odGVuc2lvblJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICBmcm9tTm90ZXNPdmVycmlkZTogcHJldk5vdGVzLFxuICAgICAgICAgICAgICAgICAgICBiZWF0RGl2aXNpb246IGRpdmlzaW9uLFxuICAgICAgICAgICAgICAgICAgICB0b05vdGVzOiBub25DaG9yZFRvbmVOb3RlcyxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICBtYWluUGFyYW1zOiBtYWluUGFyYW1zLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgIHRlbnNpb24gKz0gdGVuc2lvblJlc3VsdC5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uICs9IHRlbnNpb25SZXN1bHQucGFyYWxsZWxGaWZ0aHM7XG4gICAgICAgICAgICAgICAgdGVuc2lvbiArPSB0ZW5zaW9uUmVzdWx0LnNwYWNpbmdFcnJvcjtcbiAgICAgICAgICAgICAgICBpZiAodGVuc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRlbnNpb24gdG9vIGhpZ2ggZm9yIG5vbiBjaG9yZCB0b25lXCIsIHRlbnNpb24sIG5vbkNob3JkVG9uZSwgdGVuc2lvblJlc3VsdCwgdXNpbmdLZXkpO1xuICAgICAgICAgICAgICAgIHVzZWRDaG9pY2VzLmFkZCh1c2luZ0tleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbm9uQ2hvcmRUb25lKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGFkZE5vdGVCZXR3ZWVuKG5vbkNob3JkVG9uZSwgZGl2aXNpb24sIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCwgZGl2aXNpb25lZE5vdGVzKTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBCRUFUX0xFTkdUSCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBNYWluTXVzaWNQYXJhbXMge1xuICAgIGJlYXRzUGVyQmFyOiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VDb3VudDogbnVtYmVyID0gNDtcbiAgICBjYWRlbmNlczogQXJyYXk8TXVzaWNQYXJhbXM+ID0gW107XG4gICAgdGVzdE1vZGU/OiBib29sZWFuID0gZmFsc2U7XG4gICAgbWVsb2R5Umh5dGhtOiBzdHJpbmcgPSBcIlwiOyAgLy8gaGlkZGVuIGZyb20gdXNlciBmb3Igbm93XG4gICAgZm9yY2VkTWVsb2R5OiBudW1iZXJbXTsgIC8vIGhpZGRlbiBmcm9tIHVzZXIgZm9yIG5vd1xuICAgIGZvcmNlZENob3Jkczogc3RyaW5nID0gXCJcIjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNYWluTXVzaWNQYXJhbXM+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSAocGFyYW1zIGFzIGFueSlba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1lbG9keVJoeXRobSA9IFwiUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVwiXG4gICAgICAgIC8vIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAvLyAgICAgaWYgKHJhbmRvbSA8IDAuMikge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiSFwiO1xuICAgICAgICAvLyAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgLy8gICAgIH0gZWxzZSBpZiAocmFuZG9tIDwgMC43KSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJRXCI7XG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiRUVcIjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICB0aGlzLmZvcmNlZE1lbG9keSA9IFswLCAxLCAyLCAwLCAxLCAyIF1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgMTIgMyA0MSAyIDM0IHR3byBiYXJzXG5cbiAgICAgICAgLy8gRG8gUmUgTWkgRmEgU28gTGEgVGkgRG9cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBcIlJSUlJSUlJSUlJSUlJSUlJSUlJSXCI7XG4gICAgICAgIC8vIGxldCBtZWxvZHkgPSBbMF07XG4gICAgICAgIC8vIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBjb25zdCB1cE9yRG93biA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XG4gICAgICAgIC8vICAgICBjb25zdCBwcmV2TWVsb2R5ID0gbWVsb2R5W21lbG9keS5sZW5ndGggLSAxXTtcbiAgICAgICAgLy8gICAgIG1lbG9keS5wdXNoKHByZXZNZWxvZHkgKyAoMSAqIHVwT3JEb3duKSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBtZWxvZHkubWFwKG0gPT4gKG0gKyA3ICogMTAwKSAlIDcpO1xuXG4gICAgICAgIC8vIEV4YW1wbGUgbWVsb2R5XG4gICAgICAgIC8vIEMgbWFqIC0gQ1xuICAgICAgICAvLyAgICAgICAgIEQgcHRcbiAgICAgICAgLy8gQyBtYWogICBFXG4gICAgICAgIC8vICAgICAgICAgRiBwdFxuICAgICAgICAvLyBBIG1pbiAgIEcgcHRcbiAgICAgICAgLy8gICAgICAgICBBXG4gICAgICAgIC8vIEEgbWluICAgQiBwdFxuICAgICAgICAvLyAgICAgICAgIENcbiAgICAgICAgLy8gRiBtYWogICBCIHB0XG4gICAgICAgIC8vICAgICAgICAgQVxuICAgICAgICAvLyBGIG1haiAgIEcgcHRcbiAgICAgICAgLy8gICAgICAgICBGXG4gICAgICAgIC8vIEcgbWFqICAgRSBwdFxuICAgICAgICAvLyAgICAgICAgIERcbiAgICAgICAgLy8gRyBtYWogICBDIHB0XG4gICAgICAgIC8vICAgICAgICAgRFxuICAgICAgICAvLyBDIG1haiAgIEVcbiAgICAgICAgLy8gICAgICAgICBGIHB0XG4gICAgICAgIC8vIEMgbWFqICAgR1xuICAgICAgICAvLyAgICAgICAgIEEgcHRcbiAgICAgICAgLy8gdGhpcy5mb3JjZWRDaG9yZHMgPSBcIjExNjY0NDU1MTE2NjU1MTExMTY2NDQ1NTExNjY1NTExXCJcbiAgICB9XG5cbiAgICBjdXJyZW50Q2FkZW5jZVBhcmFtcyhkaXZpc2lvbjogbnVtYmVyKTogTXVzaWNQYXJhbXMge1xuICAgICAgICBjb25zdCBiZWF0ID0gTWF0aC5mbG9vcihkaXZpc2lvbiAvIEJFQVRfTEVOR1RIKTtcbiAgICAgICAgY29uc3QgYmFyID0gTWF0aC5mbG9vcihiZWF0IC8gdGhpcy5iZWF0c1BlckJhcik7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDsgIC8vIFRoZSBiZWF0IHdlJ3JlIGF0IGluIHRoZSBsb29wXG4gICAgICAgIGZvciAoY29uc3QgY2FkZW5jZVBhcmFtcyBvZiB0aGlzLmNhZGVuY2VzKSB7XG4gICAgICAgICAgICAvLyBMb29wIGNhZGVuY2VzIGluIG9yZGVyc1xuICAgICAgICAgICAgY291bnRlciArPSBjYWRlbmNlUGFyYW1zLmJhcnNQZXJDYWRlbmNlO1xuICAgICAgICAgICAgaWYgKGJhciA8IGNvdW50ZXIpIHsgIC8vIFdlIGhhdmUgcGFzc2VkIHRoZSBnaXZlbiBkaXZpc2lvbi4gVGhlIHByZXZpb3VzIGNhZGVuY2UgaXMgdGhlIG9uZSB3ZSB3YW50XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZCA9IGNvdW50ZXIgKiB0aGlzLmJlYXRzUGVyQmFyIC0gYmVhdDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxTb25nRW5kID0gdGhpcy5jYWRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmJhcnNQZXJDYWRlbmNlLCAwKSAqIHRoaXMuYmVhdHNQZXJCYXIgLSBiZWF0O1xuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNQZXJCYXIgPSB0aGlzLmJlYXRzUGVyQmFyO1xuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuY2FkZW5jZVN0YXJ0RGl2aXNpb24gPSAoKGNvdW50ZXIgLSBjYWRlbmNlUGFyYW1zLmJhcnNQZXJDYWRlbmNlKSAqIHRoaXMuYmVhdHNQZXJCYXIpICogQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhZGVuY2VQYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FkZW5jZXNbMF07XG4gICAgfVxuXG4gICAgZ2V0TWF4QmVhdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNVbnRpbENhZGVuY2VFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNVbnRpbFNvbmdFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZVN0YXJ0RGl2aXNpb246IG51bWJlciA9IDA7XG5cbiAgICBiYXNlVGVuc2lvbj86IG51bWJlciA9IDAuMztcbiAgICBiYXJzUGVyQ2FkZW5jZTogbnVtYmVyID0gMlxuICAgIHRlbXBvPzogbnVtYmVyID0gNDA7XG4gICAgaGFsZk5vdGVzPzogYm9vbGVhbiA9IHRydWU7XG4gICAgc2l4dGVlbnRoTm90ZXM/OiBudW1iZXIgPSAwLjI7XG4gICAgZWlnaHRoTm90ZXM/OiBudW1iZXIgPSAwLjQ7XG4gICAgbW9kdWxhdGlvbldlaWdodD86IG51bWJlciA9IDA7XG4gICAgbGVhZGluZ1dlaWdodD86IG51bWJlciA9IDI7XG4gICAgcGFydHM6IEFycmF5PHtcbiAgICAgICAgdm9pY2U6IHN0cmluZyxcbiAgICAgICAgbm90ZTogc3RyaW5nLFxuICAgICAgICB2b2x1bWU6IG51bWJlcixcbiAgICB9PiA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MVwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQzVcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDEwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MVwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQTRcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZvaWNlOiBcIjQyXCIsXG4gICAgICAgICAgICAgICAgbm90ZTogXCJDNFwiLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogNyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDNcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkUzXCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiAxMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICBiZWF0U2V0dGluZ3M6IEFycmF5PHtcbiAgICAgICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIH0+ID0gW107XG4gICAgY2hvcmRTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXIsXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgbWFqOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWluOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGltOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdWc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYWo3OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9tNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIHNjYWxlU2V0dGluZ3M6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgbWFqb3I6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaW5vcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICBzZWxlY3RlZENhZGVuY2U6IHN0cmluZyA9IFwiSENcIjtcbiAgICBub25DaG9yZFRvbmVzOiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICB3ZWlnaHQ6IG51bWJlcixcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgICAgICBwYXNzaW5nVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5laWdoYm9yVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1c3BlbnNpb246IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXRhcmRhdGlvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFwcG9naWF0dXJhOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXNjYXBlVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFudGljaXBhdGlvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5laWdoYm9yR3JvdXA6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwZWRhbFBvaW50OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG5cblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNdXNpY1BhcmFtcz4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IChwYXJhbXMgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQmVhdFNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQmVhdFNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBiZWF0Q291bnQgPSB0aGlzLmJlYXRzUGVyQmFyICogdGhpcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA8IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aDsgaSA8IGJlYXRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRoaXMuYmFzZVRlbnNpb24gfHwgMC4zLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA+IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MgPSB0aGlzLmJlYXRTZXR0aW5ncy5zbGljZSgwLCBiZWF0Q291bnQpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGNob3JkVGVtcGxhdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJhbmRvbUNob3JkR2VuZXJhdG9yIHtcbiAgICBwcml2YXRlIGNob3JkVHlwZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgYXZhaWxhYmxlQ2hvcmRzPzogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHVzZWRDaG9yZHM/OiBTZXQ8c3RyaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogTXVzaWNQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY2hvcmRUeXBlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNob3JkVHlwZSBpbiBwYXJhbXMuY2hvcmRTZXR0aW5ncykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5jaG9yZFNldHRpbmdzW2Nob3JkVHlwZV0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNob3JkVHlwZXMucHVzaChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hvcmRUeXBlcyA9IGNob3JkVHlwZXM7XG4gICAgICAgIHRoaXMudXNlZENob3JkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCkge1xuICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gKHRoaXMuYXZhaWxhYmxlQ2hvcmRzIHx8IFtdKS5maWx0ZXIoY2hvcmQgPT4gISh0aGlzLnVzZWRDaG9yZHMgfHwgbmV3IFNldCgpKS5oYXMoY2hvcmQpKTtcbiAgICAgICAgLy8gRmlyc3QgdHJ5IHRvIGFkZCB0aGUgc2ltcGxlc3QgY2hvcmRzXG4gICAgICAgIGZvciAoY29uc3Qgc2ltcGxlQ2hvcmRUeXBlIG9mIHRoaXMuY2hvcmRUeXBlcy5maWx0ZXIoY2hvcmRUeXBlID0+IFtcIm1halwiLCBcIm1pblwiXS5pbmNsdWRlcyhjaG9yZFR5cGUpKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgcmFuZG9tUm9vdD0wOyByYW5kb21Sb290PDEyOyByYW5kb21Sb290KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHNpbXBsZUNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21UeXBlID0gdGhpcy5jaG9yZFR5cGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2hvcmRUeXBlcy5sZW5ndGgpXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVJvb3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMik7XG4gICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHJhbmRvbVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgcmFuZG9tVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGNsZWFuVXAoKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVzZWRDaG9yZHM7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmF2YWlsYWJsZUNob3JkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2hvcmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlQ2hvcmRzICYmIHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggLSAzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9yZFR5cGUgPSB0aGlzLmF2YWlsYWJsZUNob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKGNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5hZGQoY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gdGhpcy5hdmFpbGFibGVDaG9yZHMuZmlsdGVyKGNob3JkID0+IGNob3JkICE9PSBjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgYWRkRm9yY2VkTWVsb2R5IH0gZnJvbSBcIi4vZm9yY2VkbWVsb2R5XCI7XG5pbXBvcnQgeyBOb25DaG9yZFRvbmUgfSBmcm9tIFwiLi9ub25jaG9yZHRvbmVzXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IGNsYXNzIFRlbnNpb24ge1xuICAgIG5vdEluU2NhbGU6IG51bWJlciA9IDA7XG4gICAgbW9kdWxhdGlvbjogbnVtYmVyID0gMDtcbiAgICBhbGxOb3Rlc1NhbWU6IG51bWJlciA9IDA7XG4gICAgY2hvcmRQcm9ncmVzc2lvbjogbnVtYmVyID0gMDtcbiAgICBrZWVwRG9taW5hbnRUb25lczogbnVtYmVyID0gMDtcbiAgICBwYXJhbGxlbEZpZnRoczogbnVtYmVyID0gMDtcbiAgICBzcGFjaW5nRXJyb3I6IG51bWJlciA9IDA7XG4gICAgY2FkZW5jZTogbnVtYmVyID0gMDtcbiAgICB0ZW5zaW9uaW5nSW50ZXJ2YWw6IG51bWJlciA9IDA7XG4gICAgc2Vjb25kSW52ZXJzaW9uOiBudW1iZXIgPSAwO1xuICAgIGRvdWJsZUxlYWRpbmdUb25lOiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdUb25lVXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5SnVtcDogbnVtYmVyID0gMDtcbiAgICBtZWxvZHlUYXJnZXQ6IG51bWJlciA9IDA7XG4gICAgdm9pY2VEaXJlY3Rpb25zOiBudW1iZXIgPSAwO1xuICAgIG92ZXJsYXBwaW5nOiBudW1iZXIgPSAwO1xuXG4gICAgZm9yY2VkTWVsb2R5OiBudW1iZXIgPSAwO1xuICAgIG5hYz86IE5vbkNob3JkVG9uZTtcblxuICAgIHRvdGFsVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGNvbW1lbnQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBnZXRUb3RhbFRlbnNpb24odmFsdWVzOiB7cGFyYW1zOiBNdXNpY1BhcmFtcywgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZTogbnVtYmVyfSkge1xuICAgICAgICBjb25zdCB7cGFyYW1zLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlfSA9IHZhbHVlcztcbiAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubm90SW5TY2FsZSAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1vZHVsYXRpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5hbGxOb3Rlc1NhbWU7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5jaG9yZFByb2dyZXNzaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMua2VlcERvbWluYW50VG9uZXM7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5wYXJhbGxlbEZpZnRocyAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNwYWNpbmdFcnJvcjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNhZGVuY2U7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy50ZW5zaW9uaW5nSW50ZXJ2YWw7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5zZWNvbmRJbnZlcnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmxlYWRpbmdUb25lVXA7XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID4gNCkge1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keVRhcmdldDtcbiAgICAgICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlKdW1wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keUp1bXA7XG4gICAgICAgIH1cbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnZvaWNlRGlyZWN0aW9ucztcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm92ZXJsYXBwaW5nO1xuXG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5mb3JjZWRNZWxvZHk7XG5cbiAgICAgICAgdGhpcy50b3RhbFRlbnNpb24gPSB0ZW5zaW9uO1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG5cbiAgICBwcmludCguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAvLyBQcmludCBvbmx5IHBvc2l0aXZlIHZhbHVlc1xuICAgICAgICBjb25zdCB0b1ByaW50OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpc1trZXldICYmIHR5cGVvZiB0aGlzW2tleV0gPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRvUHJpbnRba2V5XSA9ICh0aGlzW2tleV0gYXMgdW5rbm93biBhcyBudW1iZXIpLnRvRml4ZWQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29tbWVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb21tZW50LCAuLi5hcmdzLCB0b1ByaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MsIHRvUHJpbnQpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IHR5cGUgVGVuc2lvblBhcmFtcyA9IHtcbiAgICBkaXZpc2lvbmVkTm90ZXM/OiBEaXZpc2lvbmVkUmljaG5vdGVzLFxuICAgIGJlYXREaXZpc2lvbjogbnVtYmVyLFxuICAgIGZyb21Ob3Rlc092ZXJyaWRlPzogQXJyYXk8Tm90ZT4sXG4gICAgdG9Ob3RlczogQXJyYXk8Tm90ZT4sXG4gICAgY3VycmVudFNjYWxlOiBTY2FsZSxcbiAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlPzogbnVtYmVyLFxuICAgIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zLFxuICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc/OiBudW1iZXIsXG4gICAgaW52ZXJzaW9uTmFtZT86IHN0cmluZyxcbiAgICBwcmV2SW52ZXJzaW9uTmFtZT86IFN0cmluZyxcbiAgICBuZXdDaG9yZD86IENob3JkLFxufVxuXG5cbmV4cG9ydCBjb25zdCBnZXRUZW5zaW9uID0gKHRlbnNpb246IFRlbnNpb24sIHZhbHVlczogVGVuc2lvblBhcmFtcyk6IFRlbnNpb24gPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXMsXG4gICAgICAgICAgICBmcm9tTm90ZXNPdmVycmlkZSxcbiAgICAgICAgICAgIHRvTm90ZXMsXG4gICAgICAgICAgICBuZXdDaG9yZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nLFxuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgbWFpblBhcmFtcyxcbiAgICAgICAgICAgIGJlYXREaXZpc2lvbixcbiAgICAgICAgfSA9IHZhbHVlcztcbiAgICAvKlxuICAgICogICBHZXQgdGhlIHRlbnNpb24gYmV0d2VlbiB0d28gY2hvcmRzXG4gICAgKiAgIEBwYXJhbSBmcm9tQ2hvcmQ6IENob3JkXG4gICAgKiAgIEBwYXJhbSB0b0Nob3JkOiBDaG9yZFxuICAgICogICBAcmV0dXJuOiB0ZW5zaW9uIHZhbHVlIGJldHdlZW4gLTEgYW5kIDFcbiAgICAqL1xuXG4gICAgbGV0IHByZXZDaG9yZDtcbiAgICBsZXQgcHJldlByZXZDaG9yZDtcbiAgICBsZXQgcGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgcHJldlBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IGxhdGVzdE5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBpZiAoZGl2aXNpb25lZE5vdGVzKSB7XG4gICAgICAgIGNvbnN0IGxhdGVzdERpdmlzaW9uID0gYmVhdERpdmlzaW9uIC0gQkVBVF9MRU5HVEg7XG4gICAgICAgIGxldCB0bXAgOiBBcnJheTxOb3RlPiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb25dIHx8IFtdKSkge1xuICAgICAgICAgICAgLy8gVXNlIG9yaWdpbmFsIG5vdGVzLCBub3QgdGhlIG9uZXMgdGhhdCBoYXZlIGJlZW4gdHVybmVkIGludG8gTkFDc1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2UHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBmb3IgKGxldCBpPWJlYXREaXZpc2lvbjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlcy5ldmVyeShCb29sZWFuKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmcm9tTm90ZXNPdmVycmlkZSkge1xuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBmcm9tTm90ZXNPdmVycmlkZTtcbiAgICB9XG5cbiAgICBsZXQgYWxsc2FtZSA9IHRydWU7XG4gICAgZm9yIChsZXQgaT0wOyBpPHRvTm90ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFwYXNzZWRGcm9tTm90ZXNbaV0pIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldlBhc3NlZEZyb21Ob3Rlc1tpXSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXNzZWRGcm9tTm90ZXNbaV0uZXF1YWxzKHRvTm90ZXNbaV0pKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZQYXNzZWRGcm9tTm90ZXNbaV0uZXF1YWxzKHRvTm90ZXNbaV0pKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJldkNob3JkICYmIHByZXZQcmV2Q2hvcmQgJiYgbmV3Q2hvcmQgJiYgcHJldkNob3JkLnRvU3RyaW5nKCkgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSAmJiBwcmV2UHJldkNob3JkLnRvU3RyaW5nKCkgPT0gcHJldkNob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgYWxsc2FtZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChhbGxzYW1lKSB7XG4gICAgICAgIHRlbnNpb24uYWxsTm90ZXNTYW1lID0gMTAwO1xuICAgIH1cblxuICAgIGxldCBmcm9tTm90ZXM7XG4gICAgaWYgKHBhc3NlZEZyb21Ob3Rlcy5sZW5ndGggPCA0KSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHRvTm90ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbU5vdGVzID0gcGFzc2VkRnJvbU5vdGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmVzID0gZnJvbU5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuXG4gICAgLy8gSWYgdGhlIG5vdGVzIGFyZSBub3QgaW4gdGhlIGN1cnJlbnQgc2NhbGUsIGluY3JlYXNlIHRoZSB0ZW5zaW9uXG4gICAgbGV0IG5vdGVzTm90SW5TY2FsZTogQXJyYXk8bnVtYmVyPiA9IFtdXG4gICAgbGV0IG5ld1NjYWxlOiBOdWxsYWJsZTxTY2FsZT4gPSBudWxsO1xuICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTJcblxuICAgIGlmIChjdXJyZW50U2NhbGUpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVTZW1pdG9uZXMgPSBjdXJyZW50U2NhbGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgICAgIG5vdGVzTm90SW5TY2FsZSA9IHRvU2VtaXRvbmVzLmZpbHRlcihzZW1pdG9uZSA9PiAhc2NhbGVTZW1pdG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKTtcbiAgICAgICAgbm90ZXNOb3RJblNjYWxlID0gbm90ZXNOb3RJblNjYWxlLmZpbHRlcihzZW1pdG9uZSA9PiBzZW1pdG9uZSAhPSBsZWFkaW5nVG9uZSk7XG4gICAgICAgIGlmIChub3Rlc05vdEluU2NhbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gUXVpY2sgcmV0dXJuLCB0aGlzIGNob3JkIHN1Y2tzXG4gICAgICAgICAgICB0ZW5zaW9uLm5vdEluU2NhbGUgKz0gMTAwXG4gICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCB0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDYpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAxLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW52ZXJzaW9uTmFtZSAmJiBpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3NlY29uZCcpIHx8IChwcmV2SW52ZXJzaW9uTmFtZSB8fCBcIlwiKS5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhmcm9tU2VtaXRvbmUgLSB0b1NlbWl0b25lKSA+IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNlY29uZEludmVyc2lvbiArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW52ZXJzaW9uTmFtZSAmJiBpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICB0ZW5zaW9uLnNlY29uZEludmVyc2lvbiAtPSAwLjE7ICAvLyBSb290IGludmVyc2lvbnMgYXJlIGdyZWF0XG4gICAgfVxuXG4gICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsICAvLyBEXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLCAgLy8gRVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsICAvLyBHXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LCAgLy8gQVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgWyhjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgLSAxICsgMjQpICUgMTJdOiA2ICAvLyBGb3JjZSBhZGQgbGVhZGluZyB0b25lXG4gICAgfVxuXG4gICAgY29uc3QgbGVhZGluZ1RvbmVTZW1pdG9uZSA9IGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSArIDExO1xuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmUgJSAxMiA9PSBsZWFkaW5nVG9uZVNlbWl0b25lKSB7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZXNbaV0gIT0gZnJvbUdsb2JhbFNlbWl0b25lICsgMSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24ubGVhZGluZ1RvbmVVcCArPSAxMDtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAxIHx8IGkgPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBub3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubGVhZGluZ1RvbmVVcCAtPSA3O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBsZWFkaW5nVG9uZUNvdW50ID0gMDtcbiAgICBmb3IgKGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgb2YgdG9HbG9iYWxTZW1pdG9uZXMpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVJbmRleDogbnVtYmVyID0gc2VtaXRvbmVTY2FsZUluZGV4Wyh0b0dsb2JhbFNlbWl0b25lICsgMTIpICUgMTJdO1xuICAgICAgICBpZiAoc2NhbGVJbmRleCA9PSA2KSB7XG4gICAgICAgICAgICBsZWFkaW5nVG9uZUNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxlYWRpbmdUb25lQ291bnQgPiAxKSB7XG4gICAgICAgIHRlbnNpb24uZG91YmxlTGVhZGluZ1RvbmUgKz0gMTA7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZGlyZWN0aW9uc1xuICAgIGNvbnN0IGRpcmVjdGlvbkNvdW50cyA9IHtcbiAgICAgICAgXCJ1cFwiOiAwLFxuICAgICAgICBcImRvd25cIjogMCxcbiAgICAgICAgXCJzYW1lXCI6IDAsXG4gICAgfVxuICAgIGNvbnN0IHBhcnREaXJlY3Rpb24gPSBbXTtcbiAgICBsZXQgcm9vdEJhc3NEaXJlY3Rpb24gPSBudWxsO1xuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRvU2VtaXRvbmUgLSBmcm9tU2VtaXRvbmU7XG4gICAgICAgIHBhcnREaXJlY3Rpb25baV0gPSBkaWZmIDwgMCA/IFwiZG93blwiIDogZGlmZiA+IDAgPyBcInVwXCIgOiBcInNhbWVcIjtcbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMudXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLnNhbWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiAhPSAwICYmIChpbnZlcnNpb25OYW1lIHx8ICcnKS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIHJvb3RCYXNzRGlyZWN0aW9uID0gZGlmZiA+IDAgPyAndXAnIDogJ2Rvd24nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUm9vdCBiYXNzIG1ha2VzIHVwIGZvciBvbmUgdXAvZG93blxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcInVwXCIgJiYgZGlyZWN0aW9uQ291bnRzLmRvd24gPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duIC09IDE7XG4gICAgfVxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcImRvd25cIiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCAtPSAxO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLnVwID4gMiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMztcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbkNvdW50cy5kb3duID4gMiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPCAxKSB7XG4gICAgICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDM7XG4gICAgfVxuICAgIGlmIChwYXJ0RGlyZWN0aW9uWzBdID09IHBhcnREaXJlY3Rpb25bM10gJiYgcGFydERpcmVjdGlvblswXSAhPSBcInNhbWVcIikge1xuICAgICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSA1O1xuICAgICAgICAvLyByb290IGFuZCBzb3ByYW5vcyBtb3ZpbmcgaW4gc2FtZSBkaXJlY3Rpb25cbiAgICB9XG5cbiAgICAvLyBQYXJhbGxlbCBtb3Rpb24gYW5kIGhpZGRlbiBmaWZ0aHNcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmVzW2ldID09IHRvR2xvYmFsU2VtaXRvbmVzW2ldICYmIGZyb21HbG9iYWxTZW1pdG9uZXNbal0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbal0pIHtcbiAgICAgICAgICAgICAgICAvLyBQYXJ0IGkgYW5kIGogYXJlIHN0YXlpbmcgc2FtZVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsRnJvbSA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8IDIwICYmIGludGVydmFsICUgMTIgPT0gNyB8fCBpbnRlcnZhbCAlIDEyID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBQb3NzaWJseSBhIHBhcmFsbGVsLCBjb250cmFyeSBvciBoaWRkZW4gZmlmdGgvb2N0YXZlXG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IGludGVydmFsRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLnBhcmFsbGVsRmlmdGhzICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGludGVydmFsIGlzIGhpZGRlblxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHBhcnRJRGlyZWN0aW9uID0gdG9HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHBhcnRKRGlyZWN0aW9uID0gdG9HbG9iYWxTZW1pdG9uZXNbal0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdO1xuICAgICAgICAgICAgICAgIC8vIGlmIChNYXRoLmFicyhwYXJ0SURpcmVjdGlvbikgPiAyKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIFVwcGVyIHBhcnQgaXMgbWFraW5nIGEganVtcFxuICAgICAgICAgICAgICAgIC8vICAgICBpZiAocGFydEpEaXJlY3Rpb24gPCAwICYmIHBhcnRJRGlyZWN0aW9uIDwgMCB8fCBwYXJ0SkRpcmVjdGlvbiA+IDAgJiYgcGFydElEaXJlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB0ZW5zaW9uLnBhcmFsbGVsRmlmdGhzICs9IDExO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTcGFjaW5nIGVycm9yc1xuICAgIGNvbnN0IHBhcnQwVG9QYXJ0MSA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMV0pO1xuICAgIGNvbnN0IHBhcnQxVG9QYXJ0MiA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzFdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMl0pO1xuICAgIGNvbnN0IHBhcnQyVG9QYXJ0MyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzJdIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pO1xuICAgIGlmIChwYXJ0MVRvUGFydDIgPiAxMiB8fCBwYXJ0MFRvUGFydDEgPiAxMiB8fCBwYXJ0MlRvUGFydDMgPiAoMTIgKyA3KSkge1xuICAgICAgICB0ZW5zaW9uLnNwYWNpbmdFcnJvciArPSA1O1xuICAgIH1cblxuICAgIC8vIE92ZXJsYXBwaW5nIGVycm9yXG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbG93ZXJGcm9tR1RvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2kgKyAxXTtcbiAgICAgICAgY29uc3QgbG93ZXJUb0dUb25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaSArIDFdO1xuICAgICAgICBjb25zdCB1cHBlckZyb21HVG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaSAtIDFdO1xuICAgICAgICBjb25zdCB1cHBlclRvR1RvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKHVwcGVyVG9HVG9uZSB8fCB1cHBlckZyb21HVG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmUgPiBNYXRoLm1pbih1cHBlclRvR1RvbmUgfHwgMCwgdXBwZXJGcm9tR1RvbmUgfHwgMCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlclRvR1RvbmUgfHwgbG93ZXJGcm9tR1RvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lIDwgTWF0aC5tYXgobG93ZXJUb0dUb25lIHx8IDAsIGxvd2VyRnJvbUdUb25lIHx8IDApKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5vdmVybGFwcGluZyArPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lbG9keSB0ZW5zaW9uXG4gICAgLy8gQXZvaWQganVtcHMgdGhhdCBhcmUgYXVnIG9yIDd0aCBvciBoaWdoZXJcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSA1KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gNykge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID49IDEwKSB7ICAvLyA3dGggPT0gMTBcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDA7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNiB8fCBpbnRlcnZhbCA9PSA4KSAvLyB0cml0b25lIChhdWcgNHRoKSBvciBhdWcgNXRoXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA1O1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDcpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDkpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAwIHByaWltaVxuICAgIC8vIDEgcGllbmkgc2VrdW50aVxuICAgIC8vIDIgc3V1cmkgc2VrdW50aVxuICAgIC8vIDMgcGllbmkgdGVyc3NpXG4gICAgLy8gNCBzdXVyaSB0ZXJzc2lcbiAgICAvLyA1IGt2YXJ0dGlcbiAgICAvLyA2IHRyaXRvbnVzXG4gICAgLy8gNyBrdmludHRpXG4gICAgLy8gOCBwaWVuaSBzZWtzdGlcbiAgICAvLyA5IHN1dXJpIHNla3N0aVxuICAgIC8vIDEwIHBpZW5pIHNlcHRpbWlcbiAgICAvLyAxMSBzdXVyaSBzZXB0aW1pXG4gICAgLy8gMTIgb2t0YWF2aVxuXG4gICAgLy8gV2FzIHRoZXJlIGEganVtcCBiZWZvcmU/XG4gICAgaWYgKGxhdGVzdE5vdGVzICYmIGxhdGVzdE5vdGVzLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgIGNvbnN0IHByZXZGcm9tR2xvYmFsU2VtaXRvbmVzID0gbGF0ZXN0Tm90ZXMubWFwKChuKSA9PiBnbG9iYWxTZW1pdG9uZShuKSk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHByZXZGcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMykge1xuICAgICAgICAgICAgICAgIC8vIFRoZXJlIHdhcyBhIGp1bXAuIFdFIE1VU1QgR08gQkFDSyFcbiAgICAgICAgICAgICAgICAvLyBCYXNpY2FsbHkgdGhlIHRvR2xvYmFsU2VtaXRvbmUgbXVzdCBiZSBiZXR3ZWVuIHRoZSBwcmV2RnJvbUdsb2JhbFNlbWl0b25lIGFuZCB0aGUgZnJvbUdsb2JhbFNlbWl0b25lXG4gICAgICAgICAgICAgICAgLy8gVU5MRVNTIHdlJ3JlIG91dGxpbmluZyBhIHRyaWFkLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd291bGQgbWVhbiB0aGF0IGFmdGVyIGEgNHRoIHVwLCB3ZSBuZWVkIHRvIGdvIHVwIGFub3RoZXIgM3JkXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldkZyb21TZW1pdG9uZSA9IHByZXZGcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbk11bHRpcGxpZXIgPSBmcm9tU2VtaXRvbmUgPiBwcmV2RnJvbVNlbWl0b25lID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRJbnRlcnZhbCA9IGRpcmVjdGlvbk11bHRpcGxpZXIgKiAodG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBtYWogdGhpcmQgdXAuIFRoYXQncyBhIHJvb3QgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtaW5vciAzcmQgdXAsIHRoZW4gcGVyZmVjdCA0dGggdXAuIFRoYXQncyBhIGZpcnN0IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWFqb3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ham9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwZXJmZWN0IDR0aCB1cCwgdGhlbiBtaW5vciAzcmQgdXAuIFRoYXQncyBhIHNlY29uZCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1ham9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGlnaGVyIHRoYW4gdGhhdCwgbm8gdHJpYWQgaXMgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgaWYgKChmcm9tU2VtaXRvbmUgPj0gcHJldkZyb21TZW1pdG9uZSAmJiB0b1NlbWl0b25lID49IGZyb21TZW1pdG9uZSkgfHwgKGZyb21TZW1pdG9uZSA8PSBwcmV2RnJvbVNlbWl0b25lICYmIHRvU2VtaXRvbmUgPD0gZnJvbVNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3QgZ29pbmYgYmFjayBkb3duL3VwLi4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludGVydmFsIDw9IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA0OyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDsgIC8vIFRlcnJpYmxlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIGRvd24vdXAuLi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja0ludGVydmFsID0gTWF0aC5hYnModG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYWNrSW50ZXJ2YWwgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIHRvbyBtdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IHRvR2xvYmFsU2VtaXRvbmUgLSBmcm9tR2xvYmFsU2VtaXRvbmU7XG4gICAgICAgICAgICBjb25zdCBiYXNlTm90ZSA9IHBhcmFtcy5wYXJ0c1tpXS5ub3RlIHx8IFwiRjRcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShiYXNlTm90ZSkpXG4gICAgICAgICAgICBjb25zdCBzZW1pdG9uZUxpbWl0ID0gW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmUgKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmUgKyAxMl1cblxuICAgICAgICAgICAgbGV0IHRhcmdldE5vdGUgPSBzZW1pdG9uZUxpbWl0WzFdIC0gNDtcbiAgICAgICAgICAgIHRhcmdldE5vdGUgLT0gaSAqIDI7XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXROb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChjb25zdCBkaXZpc2lvbiBpbiAoZGl2aXNpb25lZE5vdGVzIHx8IHt9KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdGVzID0gKGRpdmlzaW9uZWROb3RlcyB8fCB7fSlbZGl2aXNpb25dO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJldk5vdGUgb2Ygbm90ZXMuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSBpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsU2VtaXRvbmUocHJldk5vdGUubm90ZSkgPT0gdGFyZ2V0Tm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm90ZVJlYWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhcmdldE5vdGVSZWFjaGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmUgLSB0YXJnZXROb3RlKSA8IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY2xvc2UgdG8gdGhlIHRhcmdldCBub3RlLCBsZXQncyBOT1QgZ28gdGhlcmUgYW55IG1vcmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGVuc2lvbjtcbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlLCBTZW1pdG9uZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zLCBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcblxuZXhwb3J0IGNvbnN0IEJFQVRfTEVOR1RIID0gMTI7XG5cbnR5cGUgUGlja051bGxhYmxlPFQ+ID0ge1xuICAgIFtQIGluIGtleW9mIFQgYXMgbnVsbCBleHRlbmRzIFRbUF0gPyBQIDogbmV2ZXJdOiBUW1BdXG59XG5cbnR5cGUgUGlja05vdE51bGxhYmxlPFQ+ID0ge1xuICAgIFtQIGluIGtleW9mIFQgYXMgbnVsbCBleHRlbmRzIFRbUF0gPyBuZXZlciA6IFBdOiBUW1BdXG59XG5cbmV4cG9ydCB0eXBlIE9wdGlvbmFsTnVsbGFibGU8VD4gPSB7XG4gICAgW0sgaW4ga2V5b2YgUGlja051bGxhYmxlPFQ+XT86IEV4Y2x1ZGU8VFtLXSwgbnVsbD5cbn0gJiB7XG4gICAgICAgIFtLIGluIGtleW9mIFBpY2tOb3ROdWxsYWJsZTxUPl06IFRbS11cbiAgICB9XG5cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lRGlzdGFuY2UgPSAodG9uZTE6IG51bWJlciwgdG9uZTI6IG51bWJlcikgPT4ge1xuICAgIC8vIGRpc3RhbmNlIGZyb20gMCB0byAxMSBzaG91bGQgYmUgMVxuICAgIC8vIDAgLSAxMSArIDEyID0+IDFcbiAgICAvLyAxMSAtIDAgKyAxMiA9PiAyMyA9PiAxMVxuXG4gICAgLy8gMCAtIDYgKyAxMiA9PiA2XG4gICAgLy8gNiAtIDAgKyAxMiA9PiAxOCA9PiA2XG5cbiAgICAvLyAwICsgNiAtIDMgKyA2ID0gNiAtIDkgPSAtM1xuICAgIC8vIDYgKyA2IC0gOSArIDYgPSAxMiAtIDE1ID0gMCAtIDMgPSAtM1xuICAgIC8vIDExICsgNiAtIDAgKyA2ID0gMTcgLSA2ID0gNSAtIDYgPSAtMVxuICAgIC8vIDAgKyA2IC0gMTEgKyA2ID0gNiAtIDE3ID0gNiAtIDUgPSAxXG5cbiAgICAvLyAoNiArIDYpICUgMTIgPSAwXG4gICAgLy8gKDUgKyA2KSAlIDEyID0gMTFcbiAgICAvLyBSZXN1bHQgPSAxMSEhISFcblxuICAgIHJldHVybiBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5hYnModG9uZTEgLSB0b25lMiksXG4gICAgICAgIE1hdGguYWJzKCh0b25lMSArIDYpICUgMTIgLSAodG9uZTIgKyA2KSAlIDEyKVxuICAgICk7XG59XG5cbmV4cG9ydCBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXggPSAoc2NhbGU6IFNjYWxlKTogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9PiAoe1xuICAgIFtzY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsXG4gICAgW3NjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSxcbiAgICBbc2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLFxuICAgIFtzY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsXG4gICAgW3NjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCxcbiAgICBbc2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LFxuICAgIFtzY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsXG59KVxuXG5cbmV4cG9ydCBjb25zdCBuZXh0R1RvbmVJblNjYWxlID0gKGdUb25lOiBTZW1pdG9uZSwgaW5kZXhEaWZmOiBudW1iZXIsIHNjYWxlOiBTY2FsZSk6IE51bGxhYmxlPG51bWJlcj4gPT4ge1xuICAgIGxldCBnVG9uZTEgPSBnVG9uZTtcbiAgICBjb25zdCBzY2FsZUluZGV4ZXMgPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpXG4gICAgbGV0IHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSArIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgZ1RvbmUxID0gZ1RvbmUgLSAxO1xuICAgICAgICBzY2FsZUluZGV4ID0gc2NhbGVJbmRleGVzW2dUb25lMSAlIDEyXTtcbiAgICB9XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuZXdTY2FsZUluZGV4ID0gKHNjYWxlSW5kZXggKyBpbmRleERpZmYpICUgNztcbiAgICBjb25zdCBuZXdTZW1pdG9uZSA9IHNjYWxlLm5vdGVzW25ld1NjYWxlSW5kZXhdLnNlbWl0b25lO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gc2VtaXRvbmVEaXN0YW5jZShnVG9uZTEgJSAxMiwgbmV3U2VtaXRvbmUpO1xuICAgIGNvbnN0IG5ld0d0b25lID0gZ1RvbmUxICsgKGRpc3RhbmNlICogKGluZGV4RGlmZiA+IDAgPyAxIDogLTEpKTtcblxuICAgIHJldHVybiBuZXdHdG9uZTtcbn1cblxuXG5leHBvcnQgY29uc3Qgc3RhcnRpbmdOb3RlcyA9IChwYXJhbXM6IE11c2ljUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcDFOb3RlID0gcGFyYW1zLnBhcnRzWzBdLm5vdGUgfHwgXCJGNFwiO1xuICAgIGNvbnN0IHAyTm90ZSA9IHBhcmFtcy5wYXJ0c1sxXS5ub3RlIHx8IFwiQzRcIjtcbiAgICBjb25zdCBwM05vdGUgPSBwYXJhbXMucGFydHNbMl0ubm90ZSB8fCBcIkEzXCI7XG4gICAgY29uc3QgcDROb3RlID0gcGFyYW1zLnBhcnRzWzNdLm5vdGUgfHwgXCJDM1wiO1xuXG4gICAgY29uc3Qgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMgPSBbXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAxTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwMk5vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDNOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHA0Tm90ZSkpLFxuICAgIF1cblxuICAgIGNvbnN0IHNlbWl0b25lTGltaXRzID0gW1xuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMF0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzBdICsgMTJdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzFdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1syXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbM10gKyAxMiAtIDVdLFxuICAgIF1cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyxcbiAgICAgICAgc2VtaXRvbmVMaW1pdHMsXG4gICAgfVxufVxuXG5cbmNvbnN0IG15U2VtaXRvbmVTdHJpbmdzOiB7W2tleTogbnVtYmVyXTogc3RyaW5nfSA9IHtcbiAgICAwOiBcIkNcIixcbiAgICAxOiBcIkMjXCIsXG4gICAgMjogXCJEXCIsXG4gICAgMzogXCJEI1wiLFxuICAgIDQ6IFwiRVwiLFxuICAgIDU6IFwiRlwiLFxuICAgIDY6IFwiRiNcIixcbiAgICA3OiBcIkdcIixcbiAgICA4OiBcIkcjXCIsXG4gICAgOTogXCJBXCIsXG4gICAgMTA6IFwiQSNcIixcbiAgICAxMTogXCJCXCIsXG59XG5cblxuZXhwb3J0IGNvbnN0IGdUb25lU3RyaW5nID0gKGdUb25lOiBudW1iZXIgfCBudWxsKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICB9XG4gICAgcmV0dXJuIGAke215U2VtaXRvbmVTdHJpbmdzW2dUb25lICUgMTJdfSR7TWF0aC5mbG9vcihnVG9uZSAvIDEyKX1gO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhcnJheU9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXk6IEFycmF5PGFueT4sIHNlbGVjdG9yOiBDYWxsYWJsZUZ1bmN0aW9uLCBkZXNjID0gZmFsc2UpIHtcbiAgICByZXR1cm4gWy4uLmFycmF5XS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSBzZWxlY3RvcihhKTtcbiAgICAgICAgYiA9IHNlbGVjdG9yKGIpO1xuXG4gICAgICAgIGlmIChhID09IGIpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gKGRlc2MgPyBhID4gYiA6IGEgPCBiKSA/IC0xIDogMTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRUZW1wbGF0ZXM6IHsgW2tleTogc3RyaW5nXTogQXJyYXk8bnVtYmVyPiB9ID0ge1xuICAgIG1hajogWzAsIDQsIDddLFxuICAgIG1pbjogWzAsIDMsIDddLFxuICAgIGRpbTogWzAsIDMsIDZdLFxuICAgIGF1ZzogWzAsIDQsIDhdLFxuICAgIG1hajc6IFswLCA0LCA3LCAxMV0sXG4gICAgbWluNzogWzAsIDMsIDcsIDEwXSxcbiAgICBkb203OiBbMCwgNCwgNywgMTBdLFxuICAgIHN1czI6IFswLCAyLCA3XSxcbiAgICBzdXM0OiBbMCwgNSwgN10sXG59XG5cblxuZXhwb3J0IGNsYXNzIENob3JkIHtcbiAgICBwdWJsaWMgbm90ZXM6IEFycmF5PE5vdGU+O1xuICAgIHB1YmxpYyByb290OiBudW1iZXI7XG4gICAgcHVibGljIGNob3JkVHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgLy8gRmluZCBjb3JyZWN0IFNlbWl0b25lIGtleVxuICAgICAgICBjb25zdCBzZW1pdG9uZUtleXMgPSBPYmplY3Qua2V5cyhTZW1pdG9uZSkuZmlsdGVyKGtleSA9PiAoU2VtaXRvbmUgYXMgYW55KVtrZXldIGFzIG51bWJlciA9PT0gdGhpcy5ub3Rlc1swXS5zZW1pdG9uZSk7XG4gICAgICAgIGlmIChzZW1pdG9uZUtleXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vdGVzLm1hcChub3RlID0+IG5vdGUudG9TdHJpbmcoKSkuam9pbihcIiwgXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZW1pdG9uZUtleSA9IHNlbWl0b25lS2V5cy5maWx0ZXIoa2V5ID0+IGtleS5pbmRleE9mKCdiJykgPT0gLTEgJiYga2V5LmluZGV4T2YoJ3MnKSA9PSAtMSlbMF0gfHwgc2VtaXRvbmVLZXlzWzBdO1xuICAgICAgICBzZW1pdG9uZUtleSA9IHNlbWl0b25lS2V5LnJlcGxhY2UoJ3MnLCAnIycpO1xuICAgICAgICByZXR1cm4gc2VtaXRvbmVLZXkgKyB0aGlzLmNob3JkVHlwZTtcbiAgICB9XG4gICAgY29uc3RydWN0b3Ioc2VtaXRvbmVPck5hbWU6IG51bWJlciB8IHN0cmluZywgY2hvcmRUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHNlbWl0b25lO1xuICAgICAgICBpZiAodHlwZW9mIHNlbWl0b25lT3JOYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHNlbWl0b25lT3JOYW1lLm1hdGNoKC9eXFxkKy8pO1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHNlbWl0b25lT3JOYW1lLm1hdGNoKC9eXFxkKyguKikvKTtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGNob3JkIG5hbWUgXCIgKyBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJzZWRUeXBlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkludmFsaWQgY2hvcmQgbmFtZSBcIiArIHNlbWl0b25lT3JOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VtaXRvbmUgPSBwYXJzZUludChzZW1pdG9uZVswXSk7XG4gICAgICAgICAgICBjaG9yZFR5cGUgPSBjaG9yZFR5cGUgfHwgcGFyc2VkVHlwZVsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbWl0b25lID0gc2VtaXRvbmVPck5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290ID0gcGFyc2VJbnQoYCR7c2VtaXRvbmV9YCk7XG4gICAgICAgIHRoaXMuY2hvcmRUeXBlID0gY2hvcmRUeXBlIHx8IFwiP1wiO1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGNob3JkVGVtcGxhdGVzW3RoaXMuY2hvcmRUeXBlXTtcbiAgICAgICAgaWYgKHRlbXBsYXRlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgXCJVbmtub3duIGNob3JkIHR5cGU6IFwiICsgY2hvcmRUeXBlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm90ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbm90ZSBvZiB0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ub3Rlcy5wdXNoKG5ldyBOb3RlKHsgc2VtaXRvbmU6IChzZW1pdG9uZSArIG5vdGUpICUgMTIsIG9jdGF2ZTogMSB9KSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IHR5cGUgTnVsbGFibGU8VD4gPSBUIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgTXVzaWNSZXN1bHQgPSB7XG4gICAgY2hvcmQ6IENob3JkLFxuICAgIHRlbnNpb246IG51bWJlcixcbiAgICBzY2FsZTogU2NhbGUsXG59XG5cbmV4cG9ydCB0eXBlIFJpY2hOb3RlID0ge1xuICAgIG5vdGU6IE5vdGUsXG4gICAgb3JpZ2luYWxOb3RlPzogTm90ZSxcbiAgICBkdXJhdGlvbjogbnVtYmVyLFxuICAgIGZyZXE/OiBudW1iZXIsXG4gICAgY2hvcmQ/OiBDaG9yZCxcbiAgICBwYXJ0SW5kZXg6IG51bWJlcixcbiAgICBzY2FsZT86IFNjYWxlLFxuICAgIGJlYW0/OiBzdHJpbmcsXG4gICAgdGllPzogc3RyaW5nLFxuICAgIHRlbnNpb24/OiBUZW5zaW9uLFxuICAgIGludmVyc2lvbk5hbWU/OiBzdHJpbmcsXG59XG5cbmV4cG9ydCB0eXBlIERpdmlzaW9uZWRSaWNobm90ZXMgPSB7XG4gICAgW2tleTogbnVtYmVyXTogQXJyYXk8UmljaE5vdGU+LFxufVxuXG5leHBvcnQgY29uc3QgZ2xvYmFsU2VtaXRvbmUgPSAobm90ZTogTm90ZSkgPT4ge1xuICAgIHJldHVybiBub3RlLnNlbWl0b25lICsgKChub3RlLm9jdGF2ZSkgKiAxMik7XG59XG5cbmV4cG9ydCBjb25zdCBnZXRDbG9zZXN0T2N0YXZlID0gKG5vdGU6IE5vdGUsIHRhcmdldE5vdGU6IE51bGxhYmxlPE5vdGU+ID0gbnVsbCwgdGFyZ2V0U2VtaXRvbmU6IE51bGxhYmxlPG51bWJlcj4gPSBudWxsKSA9PiB7XG4gICAgbGV0IHNlbWl0b25lID0gZ2xvYmFsU2VtaXRvbmUobm90ZSk7XG4gICAgaWYgKCF0YXJnZXROb3RlICYmICF0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB0YXJnZXQgbm90ZSBvciBzZW1pdG9uZSBwcm92aWRlZFwiKTtcbiAgICB9XG4gICAgdGFyZ2V0U2VtaXRvbmUgPSB0YXJnZXRTZW1pdG9uZSB8fCBnbG9iYWxTZW1pdG9uZSh0YXJnZXROb3RlIGFzIE5vdGUpO1xuICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VzdCBvY3RhdmU6IFwiLCBzZW1pdG9uZSwgdGFyZ2V0U2VtaXRvbmUpO1xuICAgIC8vIFVzaW5nIG1vZHVsbyBoZXJlIC0+IC03ICUgMTIgPSAtN1xuICAgIC8vIC0xMyAlIDEyID0gLTFcbiAgICBpZiAoc2VtaXRvbmUgPT0gdGFyZ2V0U2VtaXRvbmUpIHtcbiAgICAgICAgcmV0dXJuIG5vdGUub2N0YXZlO1xuICAgIH1cbiAgICBjb25zdCBkZWx0YTogbnVtYmVyID0gdGFyZ2V0U2VtaXRvbmUgPiBzZW1pdG9uZSA/IDEyIDogLTEyO1xuICAgIGxldCByZXQgPSAwO1xuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCBjbGVhbk9jdGF2ZSA9IChvY3RhdmU6IG51bWJlcikgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgob2N0YXZlLCAyKSwgNik7XG4gICAgfVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGkrKztcbiAgICAgICAgaWYgKGkgPiAxMDAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmZpbml0ZSBsb29wXCIpO1xuICAgICAgICB9XG4gICAgICAgIHNlbWl0b25lICs9IGRlbHRhO1xuICAgICAgICByZXQgKz0gZGVsdGEgLyAxMjsgIC8vIEhvdyBtYW55IG9jdGF2ZXMgd2UgY2hhbmdlZFxuICAgICAgICBpZiAoZGVsdGEgPiAwKSB7XG4gICAgICAgICAgICBpZiAoc2VtaXRvbmUgPj0gdGFyZ2V0U2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2VtaXRvbmUgLSB0YXJnZXRTZW1pdG9uZSkgPiBNYXRoLmFicyhzZW1pdG9uZSAtIDEyIC0gdGFyZ2V0U2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHdlbnQgdG9vIGZhciwgZ28gb25lIGJhY2tcbiAgICAgICAgICAgICAgICAgICAgcmV0IC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VzdCBvY3RhdmUgcmVzOiBcIiwgY2xlYW5PY3RhdmUobm90ZS5vY3RhdmUgKyByZXQpLCByZXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VtaXRvbmUgPD0gdGFyZ2V0U2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2VtaXRvbmUgLSB0YXJnZXRTZW1pdG9uZSkgPiBNYXRoLmFicyhzZW1pdG9uZSArIDEyIC0gdGFyZ2V0U2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHdlbnQgdG9vIGZhciwgZ28gb25lIGJhY2tcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xvc2VzdCBvY3RhdmUgcmVzOiBcIiwgY2xlYW5PY3RhdmUobm90ZS5vY3RhdmUgKyByZXQpLCByZXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBtYWpTY2FsZUNpcmNsZTogeyBba2V5OiBudW1iZXJdOiBBcnJheTxudW1iZXI+IH0gPSB7fVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQ10gPSBbU2VtaXRvbmUuRywgU2VtaXRvbmUuRl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkddID0gW1NlbWl0b25lLkQsIFNlbWl0b25lLkNdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5EXSA9IFtTZW1pdG9uZS5BLCBTZW1pdG9uZS5HXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQV0gPSBbU2VtaXRvbmUuRSwgU2VtaXRvbmUuRF1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkVdID0gW1NlbWl0b25lLkIsIFNlbWl0b25lLkFdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5CXSA9IFtTZW1pdG9uZS5GcywgU2VtaXRvbmUuRV1cblxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRl0gPSBbU2VtaXRvbmUuQywgU2VtaXRvbmUuQmJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5CYl0gPSBbU2VtaXRvbmUuRiwgU2VtaXRvbmUuRWJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5FYl0gPSBbU2VtaXRvbmUuQmIsIFNlbWl0b25lLkFiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQWJdID0gW1NlbWl0b25lLkViLCBTZW1pdG9uZS5EYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkRiXSA9IFtTZW1pdG9uZS5BYiwgU2VtaXRvbmUuR2JdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5HYl0gPSBbU2VtaXRvbmUuRGIsIFNlbWl0b25lLkNiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQ2JdID0gW1NlbWl0b25lLkdiLCBTZW1pdG9uZS5GYl1cblxuXG5leHBvcnQgY29uc3QgbWFqU2NhbGVEaWZmZXJlbmNlID0gKHNlbWl0b25lMTogbnVtYmVyLCBzZW1pdG9uZTI6IG51bWJlcikgPT4ge1xuICAgIC8vIEdpdmVuIHR3byBtYWpvciBzY2FsZXMsIHJldHVybiBob3cgY2xvc2VseSByZWxhdGVkIHRoZXkgYXJlXG4gICAgLy8gMCA9IHNhbWUgc2NhbGVcbiAgICAvLyAxID0gRS5HLiBDIGFuZCBGIG9yIEMgYW5kIEdcbiAgICBsZXQgY3VycmVudFZhbCA9IG1halNjYWxlQ2lyY2xlW3NlbWl0b25lMV07XG4gICAgaWYgKHNlbWl0b25lMSA9PSBzZW1pdG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICBpZiAoY3VycmVudFZhbC5pbmNsdWRlcyhzZW1pdG9uZTIpKSB7XG4gICAgICAgICAgICByZXR1cm4gaSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Q3VycmVudFZhbCA9IG5ldyBTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBzZW1pdG9uZSBvZiBjdXJyZW50VmFsKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5ld1NlbWl0b25lIG9mIG1halNjYWxlQ2lyY2xlW3NlbWl0b25lXSkge1xuICAgICAgICAgICAgICAgIG5ld0N1cnJlbnRWYWwuYWRkKG5ld1NlbWl0b25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50VmFsID0gWy4uLm5ld0N1cnJlbnRWYWxdIGFzIEFycmF5PG51bWJlcj47XG4gICAgfVxuICAgIHJldHVybiAxMjtcbn1cblxuZXhwb3J0IGNvbnN0IGdldFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgZGl2aXNpb246IG51bWJlciwgcGFydEluZGV4OiBudW1iZXIpOiBSaWNoTm90ZSB8IG51bGwgPT4ge1xuICAgIGlmIChkaXZpc2lvbiBpbiBkaXZpc2lvbmVkTm90ZXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0pIHtcbiAgICAgICAgICAgIGlmIChub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zKG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcykge1xuICAgIGNvbnN0IG1lbG9keVJoeXRobVN0cmluZyA9IG1haW5QYXJhbXMubWVsb2R5Umh5dGhtO1xuICAgIC8vIEZpZ3VyZSBvdXQgd2hhdCBuZWVkcyB0byBoYXBwZW4gZWFjaCBiZWF0IHRvIGdldCBvdXIgbWVsb2R5XG4gICAgbGV0IHJoeXRobURpdmlzaW9uID0gMDtcbiAgICBjb25zdCByaHl0aG1OZWVkZWREdXJhdGlvbnM6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyOyB9ID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZWxvZHlSaHl0aG1TdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgcmh5dGhtID0gbWVsb2R5Umh5dGhtU3RyaW5nW2ldO1xuICAgICAgICBpZiAocmh5dGhtID09IFwiV1wiKSB7XG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggKiA0O1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggKiA0O1xuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIkhcIikge1xuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIICogMjtcbiAgICAgICAgICAgIHJoeXRobURpdmlzaW9uICs9IEJFQVRfTEVOR1RIICogMjtcbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfSBlbHNlIGlmIChyaHl0aG0gPT0gXCJRXCIpIHtcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgIHJoeXRobURpdmlzaW9uICs9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgY29udGludWU7IC8vIE5vdGhpbmcgdG8gZG9cbiAgICAgICAgfSBlbHNlIGlmIChyaHl0aG0gPT0gXCJFXCIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgZGl2aXNpb24gbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIEVpZ2h0aFxuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIIC8gMjtcbiAgICAgICAgICAgIHJoeXRobURpdmlzaW9uICs9IEJFQVRfTEVOR1RIIC8gMjtcbiAgICAgICAgfSBlbHNlIGlmIChyaHl0aG0gPT0gXCJTXCIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgZGl2aXNpb24gbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIFNpeHRlZW50aFxuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIIC8gNDtcbiAgICAgICAgICAgIHJoeXRobURpdmlzaW9uICs9IEJFQVRfTEVOR1RIIC8gNDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmh5dGhtTmVlZGVkRHVyYXRpb25zO1xufVxuXG5cbmV4cG9ydCB0eXBlIE1lbG9keU5lZWRlZFRvbmUgPSB7XG4gICAgW2tleTogbnVtYmVyXToge1xuICAgICAgICB0b25lOiBudW1iZXIsXG4gICAgICAgIGR1cmF0aW9uOiBudW1iZXIsXG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lbG9keU5lZWRlZFRvbmVzKG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcyk6IE1lbG9keU5lZWRlZFRvbmUge1xuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9ucyA9IGdldFJoeXRobU5lZWRlZER1cmF0aW9ucyhtYWluUGFyYW1zKTtcbiAgICBjb25zdCBmb3JjZWRNZWxvZHlBcnJheSA9IG1haW5QYXJhbXMuZm9yY2VkTWVsb2R5IHx8IFwiXCI7XG4gICAgY29uc3QgcmV0OiBNZWxvZHlOZWVkZWRUb25lID0ge307XG4gICAgLy8gRmlndXJlIG91dCB3aGF0IG5lZWRzIHRvIGhhcHBlbiBlYWNoIGJlYXQgdG8gZ2V0IG91ciBtZWxvZHlcbiAgICBsZXQgY291bnRlciA9IC0xO1xuICAgIGZvciAoY29uc3QgZGl2aXNpb24gaW4gcmh5dGhtTmVlZGVkRHVyYXRpb25zKSB7XG4gICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgY29uc3QgZGl2aXNpb25OdW0gPSBwYXJzZUludChkaXZpc2lvbik7XG4gICAgICAgIHJldFtkaXZpc2lvbk51bV0gPSB7XG4gICAgICAgICAgICBcImR1cmF0aW9uXCI6IHJoeXRobU5lZWRlZER1cmF0aW9uc1tkaXZpc2lvbk51bV0sXG4gICAgICAgICAgICBcInRvbmVcIjogZm9yY2VkTWVsb2R5QXJyYXlbY291bnRlcl0sXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IG1ha2VNdXNpYywgYnVpbGRUYWJsZXMsIG1ha2VNZWxvZHkgfSBmcm9tIFwiLi9zcmMvY2hvcmRzXCJcbmltcG9ydCB7IE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3NyYy9wYXJhbXNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmJ1aWxkVGFibGVzKClcblxuc2VsZi5vbm1lc3NhZ2UgPSAoZXZlbnQ6IHsgZGF0YTogeyBwYXJhbXM6IHN0cmluZywgbmV3TWVsb2R5OiB1bmRlZmluZWQgfCBib29sZWFuLCBnaXZlVXA6IHVuZGVmaW5lZCB8IGJvb2xlYW4gfSB9KSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJHb3QgbWVzc2FnZVwiLCBldmVudC5kYXRhKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgTWFpbk11c2ljUGFyYW1zKEpTT04ucGFyc2UoZXZlbnQuZGF0YS5wYXJhbXMgfHwgXCJ7fVwiKSk7XG5cbiAgICBpZiAoZXZlbnQuZGF0YS5uZXdNZWxvZHkpIHtcbiAgICAgICAgbWFrZU1lbG9keSgoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcywgcGFyYW1zKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSgoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcykpfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuZGF0YS5naXZlVXApIHtcbiAgICAgICAgKHNlbGYgYXMgYW55KS5naXZlVVAgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2U6IFByb21pc2U8YW55PjtcbiAgICBjb25zdCBwcm9ncmVzc0NhbGxiYWNrID0gKGN1cnJlbnRCZWF0OiBudW1iZXIsIGRpdmlzaW9uZWRSaWNoTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMpID0+IHtcbiAgICAgICAgaWYgKChzZWxmIGFzIGFueSkuZ2l2ZVVQKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJnaXZlVVBcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRpdmlzaW9uZWRSaWNoTm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByaWNoTm90ZXMgPSBkaXZpc2lvbmVkUmljaE5vdGVzW2N1cnJlbnRCZWF0ICogQkVBVF9MRU5HVEhdO1xuICAgICAgICBpZiAoY3VycmVudEJlYXQgIT0gbnVsbCAmJiByaWNoTm90ZXMgJiYgcmljaE5vdGVzWzBdICYmIHJpY2hOb3Rlc1swXS5jaG9yZCkge1xuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkOiByaWNoTm90ZXNbMF0uY2hvcmQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGl2aXNpb25lZFJpY2hOb3RlcykpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtYWtlTXVzaWMocGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gcmVzdWx0LmRpdmlzaW9uZWROb3RlcztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRpdmlzaW9uZWROb3RlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMgPSBkaXZpc2lvbmVkTm90ZXM7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGl2aXNpb25lZE5vdGVzKSl9KTtcblxuXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2Vycm9yOiBlcnJ9KTtcbiAgICB9KTtcblxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==