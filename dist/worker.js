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
/* harmony import */ var _topmelody__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./topmelody */ "./src/topmelody.ts");
/* harmony import */ var _halfnotes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./halfnotes */ "./src/halfnotes.ts");
/* harmony import */ var _availablescales__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./availablescales */ "./src/availablescales.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









const GOOD_CHORD_LIMIT = 12;
const GOOD_CHORDS_PER_CHORD = 3;
const BAD_CHORD_LIMIT = 20;
const sleepMS = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(resolve, ms));
});
const makeChords = (mainParams, progressCallback = null) => __awaiter(void 0, void 0, void 0, function* () {
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
        const params = mainParams.currentCadenceParams(division);
        const beatsUntilLastChordInCadence = params.beatsUntilCadenceEnd;
        console.groupCollapsed("division", division, prevChord ? prevChord.toString() : "null", " scale ", currentScale ? currentScale.toString() : "null");
        const currentBeat = Math.floor(division / _utils__WEBPACK_IMPORTED_MODULE_2__.BEAT_LENGTH);
        console.log("beatsUntilLastChordInCadence", beatsUntilLastChordInCadence);
        const randomGenerator = new _randomchords__WEBPACK_IMPORTED_MODULE_3__.RandomChordGenerator(params, currentScale);
        let newChord = null;
        let goodChords = [];
        const badChords = [];
        const randomNotes = [];
        let iterations = 0;
        let skipLoop = false;
        if (beatsUntilLastChordInCadence == 1) {
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
        while (!skipLoop && goodChords.length < GOOD_CHORD_LIMIT) {
            iterations++;
            newChord = randomGenerator.getChord();
            const chordLogger = new _mylogger__WEBPACK_IMPORTED_MODULE_1__.Logger();
            if (iterations > 1000 || !newChord) {
                console.log("Too many iterations, going back");
                break;
            }
            let allInversions;
            let availableScales;
            availableScales = (0,_availablescales__WEBPACK_IMPORTED_MODULE_8__.getAvailableScales)({
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
                    const tensionResult = (0,_tension__WEBPACK_IMPORTED_MODULE_5__.getTension)({
                        divisionedNotes: result,
                        toNotes: randomNotes,
                        currentScale: availableScale.scale,
                        beatsUntilLastChordInCadence,
                        beatsUntilLastChordInSong: maxBeats - currentBeat,
                        params,
                        inversionName: inversionResult.inversionName,
                        prevInversionName,
                    });
                    tensionResult.modulation += availableScale.tension / Math.max(0.01, params.modulationWeight);
                    if (currentScale && !availableScale.scale.equals(currentScale)) {
                        tensionResult.modulation += 1 / Math.max(0.01, params.modulationWeight);
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
                    if (tension < 10) {
                        inversionLogger.parent = null;
                        let thisChordCount = 0;
                        for (const goodChord of goodChords) {
                            if (goodChord[0].chord.toString() == newChord.toString()) {
                                thisChordCount++;
                            }
                        }
                        if (thisChordCount >= GOOD_CHORDS_PER_CHORD) {
                            // Replace the worst previous goodChord if this has less tension
                            let worstChord = null;
                            let worstChordTension = 0;
                            for (let i = 0; i < goodChords.length; i++) {
                                const goodChord = goodChords[i];
                                if (goodChord[0].chord.toString() == newChord.toString()) {
                                    if (goodChord[0].tension.totalTension < worstChordTension) {
                                        worstChord = i;
                                    }
                                }
                            }
                            if (worstChord != null) {
                                if (goodChords[worstChord][0].tension.totalTension > tension) {
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
                    else if (badChords.length < BAD_CHORD_LIMIT) {
                        let chordCountInBadChords = 0;
                        for (const badChord of badChords) {
                            if (badChord.chord == newChord.toString()) {
                                chordCountInBadChords++;
                            }
                        }
                        if (chordCountInBadChords < 3) {
                            badChords.push({
                                chord: newChord.toString(),
                                tension: tensionResult
                            });
                        }
                    }
                } // For available scales end
            } // For voiceleading results end
        } // While end
        if (goodChords.length == 0) {
            for (const badChord of badChords) {
                badChord.tension.print("Bad chord ", badChord.chord);
            }
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
            }
            else {
                // We failed right at the start.
                console.groupEnd();
                return result;
            }
            randomGenerator.cleanUp();
            console.groupEnd();
            if (progressCallback) {
                progressCallback(currentBeat - 1, result);
            }
            continue;
        }
        // Choose the best chord from goodChords
        let bestChord = goodChords[0];
        for (const chord of goodChords) {
            if (chord[0]) {
                chord[0].tension.print(chord[0].chord ? chord[0].chord.toString() : "?Chord?", ": ");
            }
            if (chord[0].tension < bestChord[0].tension) {
                bestChord = chord;
            }
        }
        result[division] = bestChord;
        if (progressCallback) {
            progressCallback(currentBeat, result);
        }
        randomGenerator.cleanUp();
        console.groupEnd();
    }
    return result;
});
function makeMusic(params, progressCallback = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let divisionedNotes = {};
        let iterations = 0;
        while (true) {
            iterations++;
            if (iterations > 5) {
                console.log("Too many iterations, breaking");
                return {
                    divisionedNotes: {},
                };
            }
            divisionedNotes = yield makeChords(params, progressCallback);
            if (Object.keys(divisionedNotes).length != 0) {
                break;
            }
            yield new Promise((resolve) => setTimeout(resolve, 1000));
        }
        // const divisionedNotes: DivisionedRichnotes = newVoiceLeadingNotes(chords, params);
        (0,_topmelody__WEBPACK_IMPORTED_MODULE_6__.buildTopMelody)(divisionedNotes, params);
        // addEighthNotes(divisionedNotes, params)
        (0,_halfnotes__WEBPACK_IMPORTED_MODULE_7__.addHalfNotes)(divisionedNotes, params);
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
    (0,_topmelody__WEBPACK_IMPORTED_MODULE_6__.buildTopMelody)(divisionedNotes, mainParams);
    // addEighthNotes(divisionedNotes, params)
    (0,_halfnotes__WEBPACK_IMPORTED_MODULE_7__.addHalfNotes)(divisionedNotes, mainParams);
}



/***/ }),

/***/ "./src/halfnotes.ts":
/*!**************************!*\
  !*** ./src/halfnotes.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addHalfNotes": () => (/* binding */ addHalfNotes)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

const addHalfNotes = (divisionedNotes, mainParams) => {
    const beatsPerBar = mainParams.beatsPerBar || 4;
    const lastDivision = mainParams.getMaxBeats() * _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
    for (let division = 0; division < lastDivision - _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH; division += _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH) {
        const params = mainParams.currentCadenceParams(division);
        const lastBeat = Math.floor(division / _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH) * _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH;
        let beatsUntilLastChordInCadence = params.beatsUntilCadenceEnd;
        let cadenceEnding = beatsUntilLastChordInCadence < 2;
        if (params.halfNotes && !cadenceEnding) {
            // Add a tie start to the previous note to double length, and tie stop to this
            // if it's continuing with the same
            const previousNotes = divisionedNotes[division - 12] || [];
            const currentNotes = divisionedNotes[division] || [];
            for (let i = 0; i < 4; i++) {
                const previousNote = previousNotes.filter((n) => n.partIndex == i)[0];
                const currentNote = currentNotes.filter((n) => n.partIndex == i)[0];
                if (previousNote && currentNote && previousNote.note.equals(currentNote.note)) {
                    if (previousNote.duration != _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH) {
                        continue;
                    }
                    if (currentNote.duration != _utils__WEBPACK_IMPORTED_MODULE_0__.BEAT_LENGTH) {
                        continue;
                    }
                    if (previousNote.tie != null) {
                        continue;
                    }
                    previousNote.tie = "start";
                    currentNote.tie = "stop";
                }
            }
            console.log("previousNotes: ", previousNotes);
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
        let inversionNames = ["root", "first-root", "first-third", "first-fifth", "second"];
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
                                        inversionName: inversionResult.inversionName,
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
    constructor(params, scale) {
        const chordTypes = [];
        for (const chordType in params.chordSettings) {
            if (params.chordSettings[chordType].enabled) {
                chordTypes.push(chordType);
            }
        }
        this.chordTypes = chordTypes;
        this.usedChords = new Set();
        this.currentScale = scale;
        this.buildAvailableChords();
    }
    ;
    buildAvailableChords() {
        if (!this.usedChords) {
            this.usedChords = new Set();
        }
        this.availableChords = (this.availableChords || []).filter(chord => !this.usedChords.has(chord));
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
            while (this.availableChords.length - 3 > 0) {
                const chordType = this.availableChords[Math.floor(Math.random() * this.availableChords.length)];
                if (!this.usedChords.has(chordType)) {
                    this.usedChords.add(chordType);
                    this.availableChords = this.availableChords.filter(chord => chord !== chordType);
                    return new _utils__WEBPACK_IMPORTED_MODULE_0__.Chord(chordType);
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
        this.fourthDownChordProgression = 0;
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
        this.totalTension = 0;
    }
    getTotalTension(values) {
        const { params, beatsUntilLastChordInCadence } = values;
        let tension = 0;
        tension += this.notInScale * 100;
        tension += this.modulation;
        tension += this.allNotesSame;
        tension += this.chordProgression * 2;
        tension += this.parallelFifths;
        tension += this.spacingError;
        tension += this.cadence;
        tension += this.tensioningInterval;
        tension += this.secondInversion;
        tension += this.doubleLeadingTone;
        tension += this.leadingToneUp;
        if (beatsUntilLastChordInCadence > 2) {
            tension += this.fourthDownChordProgression;
            tension += this.melodyTarget;
            tension += this.melodyJump * 0.5;
        }
        else {
            tension += this.melodyJump;
        }
        tension += this.voiceDirections;
        tension += this.overlapping;
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
        console.log(...args, toPrint);
    }
}
const getTension = (values) => {
    const { divisionedNotes, toNotes, currentScale, beatsUntilLastChordInCadence, beatsUntilLastChordInSong, inversionName, prevInversionName, params, } = values;
    /*
    *   Get the tension between two chords
    *   @param fromChord: Chord
    *   @param toChord: Chord
    *   @return: tension value between -1 and 1
    */
    const tension = new Tension();
    let wantedFunction = null;
    if (params.selectedCadence == "PAC") {
        if (beatsUntilLastChordInCadence == 5) {
            wantedFunction = "not-dominant";
        }
        if (beatsUntilLastChordInCadence == 4) {
            wantedFunction = "sub-dominant";
        }
        if (beatsUntilLastChordInCadence == 3) {
            wantedFunction = "dominant";
        }
        if (beatsUntilLastChordInCadence < 3) {
            wantedFunction = "tonic";
        }
        if (beatsUntilLastChordInCadence <= 3 && !inversionName.startsWith('root')) {
            tension.cadence += 100;
        }
    }
    else if (params.selectedCadence == "IAC") {
        if (beatsUntilLastChordInCadence == 5) {
            wantedFunction = "not-dominant";
        }
        if (beatsUntilLastChordInCadence == 4) {
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
            tension.cadence += 100;
        }
    }
    else if (params.selectedCadence == "HC") {
        if (beatsUntilLastChordInCadence == 4) {
            wantedFunction = "not-dominant";
        }
        if (beatsUntilLastChordInCadence == 3) {
            wantedFunction = "sub-dominant";
        }
        if (beatsUntilLastChordInCadence < 3) {
            wantedFunction = "dominant";
        }
    }
    let prevChord;
    let prevPrevChord;
    const latestDivision = Math.max(...Object.keys(divisionedNotes).map((x) => parseInt(x, 10)));
    let tmp = [null, null, null, null];
    for (const richNote of (divisionedNotes[latestDivision] || [])) {
        tmp[richNote.partIndex] = richNote.note;
        prevChord = richNote.chord;
    }
    const passedFromNotes = [...tmp].filter(Boolean);
    tmp = [null, null, null, null];
    for (const richNote of (divisionedNotes[latestDivision - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH] || [])) {
        tmp[richNote.partIndex] = richNote.note;
        prevPrevChord = richNote.chord;
    }
    const prevPassedFromNotes = [...tmp].filter(Boolean);
    if (!prevChord) {
        wantedFunction = "tonic";
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
    if (inversionName.startsWith('second') || (prevInversionName || "").startsWith('second')) {
        for (let i = 0; i < fromGlobalSemitones.length; i++) {
            const fromSemitone = fromGlobalSemitones[i];
            const toSemitone = toGlobalSemitones[i];
            if (Math.abs(fromSemitone - toSemitone) > 2) {
                tension.secondInversion += 100;
            }
        }
    }
    const semitoneScaleIndex = {
        [currentScale.notes[0].semitone]: 0,
        [currentScale.notes[1].semitone]: 1,
        [currentScale.notes[2].semitone]: 2,
        [currentScale.notes[3].semitone]: 3,
        [currentScale.notes[4].semitone]: 4,
        [currentScale.notes[5].semitone]: 5,
        [currentScale.notes[6].semitone]: 6,
    };
    let possibleToFunctions = {
        'tonic': true,
        'sub-dominant': true,
        'dominant': true,
    };
    const toScaleIndexes = toNotes.map(note => semitoneScaleIndex[note.semitone]);
    for (const scaleIndex of toScaleIndexes) {
        if (scaleIndex == undefined) {
            possibleToFunctions.tonic = false;
            possibleToFunctions['sub-dominant'] = false;
            possibleToFunctions.dominant = false;
            break;
        }
        if (![0, 1, 3, 5].includes(scaleIndex)) {
            possibleToFunctions["sub-dominant"] = false;
        }
        if (![1, 3, 4, 6].includes(scaleIndex)) {
            possibleToFunctions.dominant = false;
        }
        if (![0, 2, 4].includes(scaleIndex)) {
            possibleToFunctions.tonic = false;
        }
    }
    let possibleFromFunctions = {
        'tonic': true,
        'sub-dominant': true,
        'dominant': true,
    };
    const fromScaleIndexes = fromNotes.map(note => semitoneScaleIndex[note.semitone]);
    for (const scaleIndex of fromScaleIndexes) {
        if (scaleIndex == undefined) {
            possibleFromFunctions.tonic = false;
            possibleFromFunctions['sub-dominant'] = false;
            possibleFromFunctions.dominant = false;
            break;
        }
        if (!([0, 1, 3, 5].includes(scaleIndex))) {
            possibleFromFunctions["sub-dominant"] = false;
        }
        if (!([1, 3, 4, 6].includes(scaleIndex))) {
            possibleFromFunctions.dominant = false;
        }
        if (!([0, 2, 4].includes(scaleIndex))) {
            possibleFromFunctions.tonic = false;
        }
    }
    if (wantedFunction) {
        if (wantedFunction == "sub-dominant") {
            if (!possibleToFunctions["sub-dominant"]) { // && !possibleToFunctions.dominant) {
                tension.cadence += 100;
            }
        }
        if (wantedFunction == "dominant") {
            if (!possibleToFunctions.dominant) {
                tension.cadence += 100;
            }
        }
        if (wantedFunction == "tonic") {
            if (!possibleToFunctions.tonic) {
                tension.cadence += 100;
            }
        }
        if (wantedFunction == "not-dominant") {
            if (possibleToFunctions.dominant) {
                tension.cadence += 100;
            }
        }
    }
    if (possibleFromFunctions.tonic == false && wantedFunction != "tonic" && prevChord) {
        let prevIndex1 = semitoneScaleIndex[prevChord.notes[0].semitone];
        let prevIndex2 = semitoneScaleIndex[prevChord.notes[1].semitone];
        let prevIndex3 = semitoneScaleIndex[prevChord.notes[2].semitone];
        let prevIndex4 = semitoneScaleIndex[(prevChord.notes[3] || {}).semitone];
        // Choices: 4 moves up, 3 and 4 move up, 2, 3, and 4 move up, 1, 2, 3, and 4 move up
        // Check all
        let isGood = false;
        while (isGood == false) {
            const toScaleIndexes = toSemitones.map(semitone => semitoneScaleIndex[semitone]);
            let allowedIndexes;
            if (prevIndex4) {
                allowedIndexes = [prevIndex1, prevIndex2, prevIndex3, prevIndex4];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    tension.chordProgression += 1;
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7, (prevIndex4 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [(prevIndex1 + 1) % 7, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7, (prevIndex4 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, prevIndex2, (prevIndex3 + 1) % 7, (prevIndex4 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, prevIndex2, prevIndex3, (prevIndex4 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
            }
            else {
                allowedIndexes = [prevIndex1, prevIndex2, prevIndex3];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    isGood = true;
                    break;
                }
                allowedIndexes = [(prevIndex1 + 1) % 7, (prevIndex2 + 1) % 7, (prevIndex3 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    tension.chordProgression += 1;
                    isGood = true;
                    break;
                }
                allowedIndexes = [prevIndex1, prevIndex2, (prevIndex3 + 1) % 7];
                if (toScaleIndexes.every(index => allowedIndexes.includes(index))) {
                    tension.fourthDownChordProgression += 100; // FIXME sometimes ok
                    isGood = true;
                    break;
                }
            }
            break;
        }
        if (!isGood) {
            tension.chordProgression += 100;
        }
    }
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
    let rootBassDirection = null;
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
        const fromSemitone = fromGlobalSemitones[i];
        const toSemitone = toGlobalSemitones[i];
        const diff = toSemitone - fromSemitone;
        if (diff > 0) {
            directionCounts.up += 1;
        }
        if (diff < 0) {
            directionCounts.down += 1;
        }
        if (diff == 0) {
            directionCounts.same += 1;
        }
        if (diff != 0 && inversionName.startsWith('root')) {
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
        tension.voiceDirections += 10;
    }
    if (directionCounts.down > 2 && directionCounts.up < 1) {
        tension.voiceDirections += 10;
    }
    // Parallel motion and hidden fifths
    for (let i = 0; i < toGlobalSemitones.length; i++) {
        for (let j = i + 1; j < toGlobalSemitones.length; j++) {
            if (fromGlobalSemitones[i] == toGlobalSemitones[i] && fromGlobalSemitones[j] == toGlobalSemitones[j]) {
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
                const partIDirection = fromGlobalSemitones[i] - toGlobalSemitones[i];
                const partJDirection = fromGlobalSemitones[j] - toGlobalSemitones[j];
                if (Math.abs(partJDirection) > 2) {
                    // Upper part is making a jump
                    if (partIDirection < 0 && partJDirection < 0 || partIDirection > 0 && partJDirection > 0) {
                        tension.parallelFifths += 10;
                        continue;
                    }
                }
            }
        }
    }
    // Spacing errors
    const part0ToPart1 = Math.abs(toGlobalSemitones[0] - toGlobalSemitones[1]);
    const part1ToPart2 = Math.abs(toGlobalSemitones[1] - toGlobalSemitones[2]);
    const part2ToPart3 = Math.abs(toGlobalSemitones[2] - toGlobalSemitones[3]);
    if (part1ToPart2 > 12 || part0ToPart1 > 12 || part2ToPart3 > (12 + 7)) {
        tension.spacingError += 10;
    }
    // Overlapping error
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
        const fromGlobalSemitone = fromGlobalSemitones[i];
        const upperPartToGlobalSemitone = toGlobalSemitones[i - 1];
        const lowerPartToGlobalSemitone = toGlobalSemitones[i + 1];
        if (upperPartToGlobalSemitone != undefined && fromGlobalSemitone > upperPartToGlobalSemitone) {
            // Upper part is moving lower than where lower part used to be
            tension.overlapping += 10;
        }
        if (lowerPartToGlobalSemitone != undefined && fromGlobalSemitone < lowerPartToGlobalSemitone) {
            // Lower part is moving higher than where upper part used to be
            tension.overlapping += 10;
        }
    }
    // Melody tension
    // Avoid jumps that are aug or 7th or higher
    for (let i = 0; i < fromGlobalSemitones.length; i++) {
        const interval = Math.abs(fromGlobalSemitones[i] - toGlobalSemitones[i]);
        if (interval >= 3) {
            tension.melodyJump += 0.2;
        }
        if (interval >= 10) { // 7th == 10
            tension.melodyJump += 10;
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
    if (prevPassedFromNotes && prevPassedFromNotes.length == 4) {
        const prevFromGlobalSemitones = prevPassedFromNotes.map((n) => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(n));
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
                        tension.melodyJump += 1; // Not as bad
                    }
                    else {
                        tension.melodyJump += 10; // Terrible
                    }
                }
                else {
                    // Going back down/up...
                    const backInterval = Math.abs(toSemitone - fromSemitone);
                    if (backInterval > 2) {
                        // Going back too far...
                        if (interval <= 3) {
                            tension.melodyJump += 0.5;
                        }
                        else if (interval <= 4) {
                            tension.melodyJump += 1; // Not as bad
                        }
                        else {
                            tension.melodyJump += 10; // Terrible
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
            for (const division in divisionedNotes) {
                const notes = divisionedNotes[division];
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

/***/ "./src/topmelody.ts":
/*!**************************!*\
  !*** ./src/topmelody.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildTopMelody": () => (/* binding */ buildTopMelody)
/* harmony export */ });
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! musictheoryjs */ "./node_modules/musictheoryjs/dist/musictheory.js");
/* harmony import */ var musictheoryjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(musictheoryjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


const addNoteBetween = (nac, division, nextDivision, partIndex, divisionedNotes) => {
    const divisionDiff = nextDivision - division;
    const beatRichNote = (divisionedNotes[division] || []).filter(note => note.partIndex == partIndex)[0];
    if (!beatRichNote || !beatRichNote.note) {
        return;
    }
    const prevScaleTones = beatRichNote.scale.notes.map(n => n.semitone);
    const nextBeatRichNote = (divisionedNotes[nextDivision] || []).filter(note => note.partIndex == partIndex)[0];
    if (!nextBeatRichNote || !nextBeatRichNote.note) {
        return;
    }
    const newNote = nac.note;
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
const neighborTone = (values) => {
    const { gTone0, gTone1, gTone2, scale, gToneLimits } = values;
    // Step, then step back. This is on Weak beat
    if (gTone1 != gTone2) {
        return null;
    }
    const scaleIndex = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.semitoneScaleIndex)(scale)[gTone1 % 12];
    if (!scaleIndex) {
        return null;
    }
    const upOrDownChoices = Math.random() < 0.5 ? [1, -1] : [-1, 1];
    for (const upOrDown of upOrDownChoices) {
        const newGtone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nextGToneInScale)(gTone1, upOrDown, scale);
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
    const gTone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nextGToneInScale)(gTone1, upOrDown, scale);
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
    const gTone = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nextGToneInScale)(gTone0, upOrDown, scale);
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
    return null;
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
const buildTopMelody = (divisionedNotes, mainParams) => {
    // Convert two 4th notes, if possible, to two 8th notes.
    const lastDivision = _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH * mainParams.getMaxBeats();
    const firstParams = mainParams.currentCadenceParams(0);
    const { startingGlobalSemitones, semitoneLimits } = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.startingNotes)(firstParams);
    for (let i = 0; i < lastDivision - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH; i += _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH) {
        let gToneLimitsForThisBeat = [
            [...semitoneLimits[0]],
            [...semitoneLimits[1]],
            [...semitoneLimits[2]],
            [...semitoneLimits[3]],
        ];
        const params = mainParams.currentCadenceParams(i);
        const lastBeatInCadence = params.beatsUntilCadenceEnd < 2;
        if (lastBeatInCadence) {
            continue;
        }
        for (let partIndex = 0; partIndex < 4; partIndex++) {
            // Change limits, new notes must also be betweeen the other part notes
            // ( Overlapping )
            const richNote = divisionedNotes[i].filter(note => note.partIndex == partIndex)[0];
            const nextRichNote = divisionedNotes[i + _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH].filter(note => note.partIndex == partIndex)[0];
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            const gTone1 = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(richNote.note);
            const gTone2 = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(nextRichNote.note);
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
            // Is this a good part to add eighths?
            const richNote = divisionedNotes[i].filter(note => note.partIndex == partIndex)[0];
            const nextRichNote = divisionedNotes[i + _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH].filter(note => note.partIndex == partIndex)[0];
            if (!richNote || !richNote.note || !nextRichNote || !nextRichNote.note) {
                continue;
            }
            let prevRichNote = (divisionedNotes[i - _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH] || []).filter(note => note.partIndex == partIndex)[0];
            if (!prevRichNote || !prevRichNote.note) {
                prevRichNote = null;
            }
            const gTone1 = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(richNote.note);
            const gTone2 = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(nextRichNote.note);
            let gTone0 = prevRichNote ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.globalSemitone)(prevRichNote.note) : null;
            if (gTone0 && prevRichNote.duration != _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH) {
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
            const nonChordToneChoiceFuncs = {
                passingTone: () => passingTone(nacParams),
                neighborTone: () => neighborTone(nacParams),
                suspension: () => suspension(nacParams),
                retardation: () => retardation(nacParams),
                appogiatura: () => appogiatura(nacParams),
                escapeTone: () => escapeTone(nacParams),
                anticipation: () => anticipation(nacParams),
                neighborGroup: () => neighborGroup(nacParams),
                pedalPoint: () => pedalPoint(nacParams),
            };
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
                nonChordToneChoices.pedalPoint = null;
            }
            let nonChordTone = null;
            for (let key in nonChordToneChoices) {
                if (nonChordToneChoices[key]) {
                    nonChordTone = nonChordToneChoices[key];
                    break;
                }
            }
            if (!nonChordTone) {
                continue;
            }
            const result = addNoteBetween(nonChordTone, i, i + _utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH, partIndex, divisionedNotes);
            if (!result) {
                continue;
            }
            break;
        }
    }
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
/* harmony export */   "MainMusicParams": () => (/* binding */ MainMusicParams),
/* harmony export */   "MusicParams": () => (/* binding */ MusicParams),
/* harmony export */   "arrayOrderBy": () => (/* binding */ arrayOrderBy),
/* harmony export */   "chordTemplates": () => (/* binding */ chordTemplates),
/* harmony export */   "gToneString": () => (/* binding */ gToneString),
/* harmony export */   "getClosestOctave": () => (/* binding */ getClosestOctave),
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
const gToneString = (gTone) => {
    return new musictheoryjs__WEBPACK_IMPORTED_MODULE_0__.Note({
        semitone: gTone % 12,
        octave: Math.floor(gTone / 12),
    }).toString();
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
        this.chordType = chordType;
        const template = chordTemplates[chordType];
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
class MainMusicParams {
    constructor(params = undefined) {
        this.beatsPerBar = 4;
        this.cadenceCount = 4;
        this.cadences = [];
        this.testMode = false;
        if (params) {
            for (let key in params) {
                this[key] = params[key];
            }
        }
    }
    currentCadenceParams(division) {
        const beat = Math.floor(division / BEAT_LENGTH);
        const bar = Math.floor(beat / this.beatsPerBar);
        let counter = 0;
        for (const cadenceParams of this.cadences) {
            counter += cadenceParams.barsPerCadence;
            if (bar < counter) {
                cadenceParams.beatsUntilCadenceEnd = counter * this.beatsPerBar - beat;
                cadenceParams.beatsUntilSongEnd = this.cadences.reduce((a, b) => a + b.barsPerCadence, 0) * this.beatsPerBar - beat;
                cadenceParams.beatsPerBar = this.beatsPerBar;
                return cadenceParams;
            }
        }
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
                voice: "42",
                note: "C5",
                volume: "10",
            },
            {
                voice: "42",
                note: "A4",
                volume: "7",
            },
            {
                voice: "42",
                note: "C4",
                volume: "7",
            },
            {
                voice: "42",
                note: "E3",
                volume: "10",
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
                enabled: false,
                weight: 0,
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
                enabled: false,
                weight: 0,
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
                    tension: this.baseTension
                });
            }
        }
        else if (this.beatSettings.length > beatCount) {
            this.beatSettings = this.beatSettings.slice(0, beatCount);
        }
    }
}
const globalSemitone = (note) => {
    return note.semitone + ((note.octave) * 12);
};
const getClosestOctave = (note, targetNote = null, targetSemitone = null) => {
    // 
    let semitone = globalSemitone(note);
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
/* harmony import */ var _src_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/utils */ "./src/utils.ts");


(0,_src_chords__WEBPACK_IMPORTED_MODULE_0__.buildTables)();
self.onmessage = (event) => {
    const params = new _src_utils__WEBPACK_IMPORTED_MODULE_1__.MainMusicParams(JSON.parse(event.data.params || "{}"));
    if (event.data.newMelody) {
        (0,_src_chords__WEBPACK_IMPORTED_MODULE_0__.makeMelody)(self.divisionedNotes, params);
        self.postMessage({ divisionedNotes: JSON.parse(JSON.stringify(self.divisionedNotes)) });
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
        const richNotes = divisionedRichNotes[currentBeat * _src_utils__WEBPACK_IMPORTED_MODULE_1__.BEAT_LENGTH];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0IscUJBQXFCO3dCQUNyQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMs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QW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDdkUsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBQ0Qsc0RBQVMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNoRCxNQUFNLGVBQWUsR0FBd0IsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUNwRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQyxPQUFPO1NBQ1Y7UUFDQSxJQUFZLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3pGLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL211c2ljdGhlb3J5anMvZGlzdC9tdXNpY3RoZW9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXZhaWxhYmxlc2NhbGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hhbGZub3Rlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW52ZXJzaW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbXlsb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhbmRvbWNob3Jkcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVuc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdG9wbWVsb2R5LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwuTXVzaWNUaGVvcnkgPSB7fSkpO1xufSkodGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgLyoqXHJcbiAgICAqIE5vdGVzIHN0YXJ0aW5nIGF0IEMwIC0gemVybyBpbmRleCAtIDEyIHRvdGFsXHJcbiAgICAqIE1hcHMgbm90ZSBuYW1lcyB0byBzZW1pdG9uZSB2YWx1ZXMgc3RhcnRpbmcgYXQgQz0wXHJcbiAgICAqIEBlbnVtXHJcbiAgICAqL1xyXG4gICB2YXIgU2VtaXRvbmU7XHJcbiAgIChmdW5jdGlvbiAoU2VtaXRvbmUpIHtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQVwiXSA9IDldID0gXCJBXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFzXCJdID0gMTBdID0gXCJBc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCYlwiXSA9IDEwXSA9IFwiQmJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQlwiXSA9IDExXSA9IFwiQlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCc1wiXSA9IDBdID0gXCJCc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDYlwiXSA9IDExXSA9IFwiQ2JcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ1wiXSA9IDBdID0gXCJDXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNzXCJdID0gMV0gPSBcIkNzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRiXCJdID0gMV0gPSBcIkRiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRcIl0gPSAyXSA9IFwiRFwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEc1wiXSA9IDNdID0gXCJEc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFYlwiXSA9IDNdID0gXCJFYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFXCJdID0gNF0gPSBcIkVcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRXNcIl0gPSA1XSA9IFwiRXNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRmJcIl0gPSA0XSA9IFwiRmJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRlwiXSA9IDVdID0gXCJGXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZzXCJdID0gNl0gPSBcIkZzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdiXCJdID0gNl0gPSBcIkdiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdcIl0gPSA3XSA9IFwiR1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHc1wiXSA9IDhdID0gXCJHc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBYlwiXSA9IDhdID0gXCJBYlwiO1xyXG4gICB9KShTZW1pdG9uZSB8fCAoU2VtaXRvbmUgPSB7fSkpO1xyXG4gICAvKipcclxuICAgICogUmV0dXJucyB0aGUgd2hvbGUgbm90ZSBuYW1lIChlLmcuIEMsIEQsIEUsIEYsIEcsIEEsIEIpIGZvclxyXG4gICAgKiB0aGUgZ2l2ZW4gc3RyaW5nXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgZ2V0V2hvbGVUb25lRnJvbU5hbWUgPSAobmFtZSkgPT4ge1xyXG4gICAgICAgaWYgKCFuYW1lIHx8IG5hbWUubGVuZ3RoID09PSAwIHx8IG5hbWUubGVuZ3RoID4gMSlcclxuICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG5hbWVcIik7XHJcbiAgICAgICBjb25zdCBrZXkgPSBuYW1lWzBdLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICByZXR1cm4gU2VtaXRvbmVba2V5XTtcclxuICAgfTtcclxuICAgdmFyIFNlbWl0b25lJDEgPSBTZW1pdG9uZTtcblxuICAgLyoqXHJcbiAgICAqIFdyYXBzIGEgbnVtYmVyIGJldHdlZW4gYSBtaW4gYW5kIG1heCB2YWx1ZS5cclxuICAgICogQHBhcmFtIHZhbHVlIC0gdGhlIG51bWJlciB0byB3cmFwXHJcbiAgICAqIEBwYXJhbSBsb3dlciAgLSB0aGUgbG93ZXIgYm91bmRcclxuICAgICogQHBhcmFtIHVwcGVyIC0gdGhlIHVwcGVyIGJvdW5kXHJcbiAgICAqIEByZXR1cm5zIHdyYXBwZWROdW1iZXIgLSB0aGUgd3JhcHBlZCBudW1iZXJcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCB3cmFwID0gKHZhbHVlLCBsb3dlciwgdXBwZXIpID0+IHtcclxuICAgICAgIC8vIGNvcGllc1xyXG4gICAgICAgbGV0IHZhbCA9IHZhbHVlO1xyXG4gICAgICAgbGV0IGxib3VuZCA9IGxvd2VyO1xyXG4gICAgICAgbGV0IHVib3VuZCA9IHVwcGVyO1xyXG4gICAgICAgLy8gaWYgdGhlIGJvdW5kcyBhcmUgaW52ZXJ0ZWQsIHN3YXAgdGhlbSBoZXJlXHJcbiAgICAgICBpZiAodXBwZXIgPCBsb3dlcikge1xyXG4gICAgICAgICAgIGxib3VuZCA9IHVwcGVyO1xyXG4gICAgICAgICAgIHVib3VuZCA9IGxvd2VyO1xyXG4gICAgICAgfVxyXG4gICAgICAgLy8gdGhlIGFtb3VudCBuZWVkZWQgdG8gbW92ZSB0aGUgcmFuZ2UgYW5kIHZhbHVlIHRvIHplcm9cclxuICAgICAgIGNvbnN0IHplcm9PZmZzZXQgPSAwIC0gbGJvdW5kO1xyXG4gICAgICAgLy8gb2Zmc2V0IHRoZSB2YWx1ZXMgc28gdGhhdCB0aGUgbG93ZXIgYm91bmQgaXMgemVyb1xyXG4gICAgICAgbGJvdW5kICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICB1Ym91bmQgKz0gemVyb09mZnNldDtcclxuICAgICAgIHZhbCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgLy8gY29tcHV0ZSB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSB2YWx1ZSB3aWxsIHdyYXBcclxuICAgICAgIGxldCB3cmFwcyA9IE1hdGgudHJ1bmModmFsIC8gdWJvdW5kKTtcclxuICAgICAgIC8vIGNhc2U6IC0xIC8gdWJvdW5kKD4wKSB3aWxsIGVxdWFsIDAgYWx0aG91Z2ggaXQgd3JhcHMgb25jZVxyXG4gICAgICAgaWYgKHdyYXBzID09PSAwICYmIHZhbCA8IGxib3VuZClcclxuICAgICAgICAgICB3cmFwcyA9IC0xO1xyXG4gICAgICAgLy8gY2FzZTogdWJvdW5kIGFuZCB2YWx1ZSBhcmUgdGhlIHNhbWUgdmFsL3Vib3VuZCA9IDEgYnV0IGFjdHVhbGx5IGRvZXNudCB3cmFwXHJcbiAgICAgICBpZiAod3JhcHMgPT09IDEgJiYgdmFsID09PSB1Ym91bmQpXHJcbiAgICAgICAgICAgd3JhcHMgPSAwO1xyXG4gICAgICAgLy8gbmVlZGVkIHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgbnVtIG9mIHdyYXBzIGlzIDAgb3IgMSBvciAtMVxyXG4gICAgICAgbGV0IHZhbE9mZnNldCA9IDA7XHJcbiAgICAgICBsZXQgd3JhcE9mZnNldCA9IDA7XHJcbiAgICAgICBpZiAod3JhcHMgPj0gLTEgJiYgd3JhcHMgPD0gMSlcclxuICAgICAgICAgICB3cmFwT2Zmc2V0ID0gMTtcclxuICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBpcyBiZWxvdyB0aGUgcmFuZ2VcclxuICAgICAgIGlmICh2YWwgPCBsYm91bmQpIHtcclxuICAgICAgICAgICB2YWxPZmZzZXQgPSAodmFsICUgdWJvdW5kKSArIHdyYXBPZmZzZXQ7XHJcbiAgICAgICAgICAgdmFsID0gdWJvdW5kICsgdmFsT2Zmc2V0O1xyXG4gICAgICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBpcyBhYm92ZSB0aGUgcmFuZ2VcclxuICAgICAgIH1cclxuICAgICAgIGVsc2UgaWYgKHZhbCA+IHVib3VuZCkge1xyXG4gICAgICAgICAgIHZhbE9mZnNldCA9ICh2YWwgJSB1Ym91bmQpIC0gd3JhcE9mZnNldDtcclxuICAgICAgICAgICB2YWwgPSBsYm91bmQgKyB2YWxPZmZzZXQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvLyBhZGQgdGhlIG9mZnNldCBmcm9tIHplcm8gYmFjayB0byB0aGUgdmFsdWVcclxuICAgICAgIHZhbCAtPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICB2YWx1ZTogdmFsLFxyXG4gICAgICAgICAgIG51bVdyYXBzOiB3cmFwcyxcclxuICAgICAgIH07XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTaW1wbGUgdXRpbCB0byBjbGFtcCBhIG51bWJlciB0byBhIHJhbmdlXHJcbiAgICAqIEBwYXJhbSBwTnVtIC0gdGhlIG51bWJlciB0byBjbGFtcFxyXG4gICAgKiBAcGFyYW0gcExvd2VyIC0gdGhlIGxvd2VyIGJvdW5kXHJcbiAgICAqIEBwYXJhbSBwVXBwZXIgLSB0aGUgdXBwZXIgYm91bmRcclxuICAgICogQHJldHVybnMgTnVtYmVyIC0gdGhlIGNsYW1wZWQgbnVtYmVyXHJcbiAgICAqXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2xhbXAgPSAocE51bSwgcExvd2VyLCBwVXBwZXIpID0+IE1hdGgubWF4KE1hdGgubWluKHBOdW0sIE1hdGgubWF4KHBMb3dlciwgcFVwcGVyKSksIE1hdGgubWluKHBMb3dlciwgcFVwcGVyKSk7XG5cbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvLyBDb25zdGFudHNcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IE1PRElGSUVEX1NFTUlUT05FUyA9IFsxLCAzLCA0LCA2LCA4LCAxMF07XHJcbiAgIGNvbnN0IFRPTkVTX01BWCA9IDExO1xyXG4gICBjb25zdCBUT05FU19NSU4gPSAwO1xyXG4gICBjb25zdCBPQ1RBVkVfTUFYID0gOTtcclxuICAgY29uc3QgT0NUQVZFX01JTiA9IDA7XHJcbiAgIGNvbnN0IERFRkFVTFRfT0NUQVZFID0gNDtcclxuICAgY29uc3QgREVGQVVMVF9TRU1JVE9ORSA9IDA7XG5cbiAgIC8qKlxyXG4gICAgKiBNYXBzIG5vdGUgYWx0ZXJhdGlvbnMgdG8gIHRoZWlyIHJlbGF0aXZlIG1hdGhtYXRpY2FsIHZhbHVlXHJcbiAgICAqQGVudW1cclxuICAgICovXHJcbiAgIHZhciBNb2RpZmllcjtcclxuICAgKGZ1bmN0aW9uIChNb2RpZmllcikge1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJGTEFUXCJdID0gLTFdID0gXCJGTEFUXCI7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIk5BVFVSQUxcIl0gPSAwXSA9IFwiTkFUVVJBTFwiO1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJTSEFSUFwiXSA9IDFdID0gXCJTSEFSUFwiO1xyXG4gICB9KShNb2RpZmllciB8fCAoTW9kaWZpZXIgPSB7fSkpO1xyXG4gICAvKipcclxuICAgICogUGFyc2VzIG1vZGlmaWVyIGZyb20gc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBlbnVtIHZhbHVlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VNb2RpZmllciA9IChtb2RpZmllcikgPT4ge1xyXG4gICAgICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICAgICAgIGNhc2UgXCJiXCI6XHJcbiAgICAgICAgICAgY2FzZSBcImZsYXRcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLkZMQVQ7XHJcbiAgICAgICAgICAgY2FzZSBcIiNcIjpcclxuICAgICAgICAgICBjYXNlIFwic1wiOlxyXG4gICAgICAgICAgIGNhc2UgXCJzaGFycFwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuU0hBUlA7XHJcbiAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLk5BVFVSQUw7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIHZhciBNb2RpZmllciQxID0gTW9kaWZpZXI7XG5cbiAgIC8vIGltcG9ydCB7IHJlZ2lzdGVySW5pdGlhbGl6ZXIgfSBmcm9tIFwiLi4vSW5pdGlhbGl6ZXIvSW5pdGlhbGl6ZXJcIjtcclxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVMb29rdXAuanNvblwiO1xyXG4gICAvLyBpbXBvcnQgZnMgZnJvbSBcImZzXCI7XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBuYW1lUmVnZXgkMiA9IC8oW0EtR10pL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXgkMiA9IC8oI3xzfGIpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4JDIgPSAvKFswLTldKykvZztcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBwYXJzZSBhIG5vdGUgZnJvbSBhIHN0cmluZ1xyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IHBhcnNlTm90ZSA9IChub3RlLCBzdXByZXNzV2FybmluZyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5vdGVMb29rdXAobm90ZSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IG5vdGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke25vdGV9LiBHZXQgYSBwZXJmb3JtYW5jZSBpbmNyZWFzZSBieSB1c2luZyB0aGUgZm9ybWF0IFtBLUddWyN8c3xiXVswLTldIGFuZCB1c2luZyBidWlsZFRhYmxlcyBtZXRob2Qoc2VlIGRvY3VtZW50YXRpb24pYCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBub3RlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtub3RlfS4gR2V0IGEgcGVyZm9ybWFuY2UgaW5jcmVhc2UgYnkgdXNpbmcgdGhlIGZvcm1hdCBbQS1HXVsjfHN8Yl1bMC05XSBhbmQgdXNpbmcgYnVpbGRUYWJsZXMgbWV0aG9kKHNlZSBkb2N1bWVudGF0aW9uKWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBub3RlLm1hdGNoKG5hbWVSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG1vZGlmaWVyTWF0Y2ggPSBub3RlLm1hdGNoKG1vZGlmaWVyUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IG5vdGUubWF0Y2gob2N0YXZlUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG5vdGU6ICR7bm90ZX1gKTtcclxuICAgfTtcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgY3JlYXRlVGFibGUkNCA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IG5vdGVUYWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGZvciAoY29uc3Qgbm90ZUxhYmVsIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgbm90ZVRhYmxlW25vdGVMYWJlbF0gPSBwYXJzZU5vdGUobm90ZUxhYmVsLCB0cnVlKTsgLy8gJ0MnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgZm9yIChsZXQgaU1vZGlmaWVyT3V0ZXIgPSAwOyBpTW9kaWZpZXJPdXRlciA8IG5vdGVNb2RpZmllcnMubGVuZ3RoOyArK2lNb2RpZmllck91dGVyKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke25vdGVNb2RpZmllcnNbaU1vZGlmaWVyT3V0ZXJdfWA7XHJcbiAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDIycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPCBPQ1RBVkVfTUFYOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7aU9jdGF2ZX1gO1xyXG4gICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIGZvciAobGV0IGlNb2RpZmllciA9IDA7IGlNb2RpZmllciA8IG5vdGVNb2RpZmllcnMubGVuZ3RoOyArK2lNb2RpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bm90ZU1vZGlmaWVyc1tpTW9kaWZpZXJdfSR7aU9jdGF2ZX1gO1xyXG4gICAgICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0MjNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBub3RlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBUaGUgbG9va3VwIHRhYmxlXHJcbiAgICAqL1xyXG4gICBsZXQgX25vdGVMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZUxvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkTm90ZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfSk7XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IHRhYmxlO1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGROb3RlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlJDQoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBub3RlIHRhYmxlXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlTG9va3VwO1xyXG4gICB9O1xuXG4gICAvLyBpbXBvcnQgeyByZWdpc3RlckluaXRpYWxpemVyIH0gZnJvbSBcIi4uL0luaXRpYWxpemVyL0luaXRpYWxpemVyXCI7XHJcbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlU3RyaW5nTG9va3VwLmpzb25cIjtcclxuICAgY29uc3QgVU5LTk9XTl9NT0RJRklFUl9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiQyMvRGJcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJEIy9FYlwiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiRiMvR2JcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJHIy9BYlwiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkEjL0JiXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgU0hBUlBfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkMjXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRCNcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkYjXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiRyNcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJBI1wiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IEZMQVRfTU9ESUZJRVJfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkRiXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRWJcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkdiXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiQWJcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJCYlwiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDMgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChsZXQgaVRvbmUgPSBUT05FU19NSU47IGlUb25lIDw9IFRPTkVTX01BWDsgKytpVG9uZSkge1xyXG4gICAgICAgICAgIGZvciAobGV0IGlQcmV2ID0gVE9ORVNfTUlOOyBpUHJldiA8PSBUT05FU19NQVg7ICsraVByZXYpIHtcclxuICAgICAgICAgICAgICAgLy8gZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPD0gT0NUQVZFX01BWDsgaU9jdGF2ZSsrKSB7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2RpZmllciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgIGlmIChNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXMoaVRvbmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiLVwiOyAvLyBoYXMgYW4gdW5rbm93biBtb2RpZmllclxyXG4gICAgICAgICAgICAgICAgICAgLy8gaWYgaXMgZmxhdFxyXG4gICAgICAgICAgICAgICAgICAgaWYgKHdyYXAoaVRvbmUgKyAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09IGlQcmV2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCJiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBpcyBzaGFycFxyXG4gICAgICAgICAgICAgICAgICAgaWYgKHdyYXAoaVRvbmUgLSAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09IGlQcmV2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCIjXCI7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy8gZ2V0IG5vdGUgbmFtZSBmcm9tIHRhYmxlXHJcbiAgICAgICAgICAgICAgIHRhYmxlW2Ake2lUb25lfS0ke2lQcmV2fWBdID0gZ2V0Tm90ZUxhYmVsKGlUb25lLCBtb2RpZmllcik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgY29uc3QgZ2V0Tm90ZUxhYmVsID0gKHRvbmUsIG1vZGlmaWVyKSA9PiB7XHJcbiAgICAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgY2FzZSBcIiNcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIFNIQVJQX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgICAgICBjYXNlIFwiYlwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gRkxBVF9NT0RJRklFUl9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICAgICAgY2FzZSBcIi1cIjpcclxuICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICByZXR1cm4gVU5LTk9XTl9NT0RJRklFUl9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIGxldCBfbm90ZVN0cmluZ0xvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3RlU3RyaW5nTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIGlmIChPYmplY3Qua2V5cyhfbm90ZVN0cmluZ0xvb2t1cCkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVTdHJpbmdMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfSk7XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IHRhYmxlO1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGROb3RlU3RyaW5nVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmtleXMoX25vdGVTdHJpbmdMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cDtcclxuICAgICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUkMygpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZVN0cmluZ0xvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIk5vdGUgc3RyaW5nIHRhYmxlIGJ1aWx0LlwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cDtcclxuICAgfTtcblxuICAgdmFyIElEWD0yNTYsIEhFWD1bXSwgU0laRT0yNTYsIEJVRkZFUjtcbiAgIHdoaWxlIChJRFgtLSkgSEVYW0lEWF0gPSAoSURYICsgMjU2KS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xuXG4gICBmdW5jdGlvbiB1aWQobGVuKSB7XG4gICBcdHZhciBpPTAsIHRtcD0obGVuIHx8IDExKTtcbiAgIFx0aWYgKCFCVUZGRVIgfHwgKChJRFggKyB0bXApID4gU0laRSoyKSkge1xuICAgXHRcdGZvciAoQlVGRkVSPScnLElEWD0wOyBpIDwgU0laRTsgaSsrKSB7XG4gICBcdFx0XHRCVUZGRVIgKz0gSEVYW01hdGgucmFuZG9tKCkgKiAyNTYgfCAwXTtcbiAgIFx0XHR9XG4gICBcdH1cblxuICAgXHRyZXR1cm4gQlVGRkVSLnN1YnN0cmluZyhJRFgsIElEWCsrICsgdG1wKTtcbiAgIH1cblxuICAgLy8gaW1wb3J0IElkZW50aWZpYWJsZSBmcm9tIFwiLi4vY29tcG9zYWJsZXMvSWRlbnRpZmlhYmxlXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBBIG5vdGUgY29uc2lzdCBvZiBhIHNlbWl0b25lIGFuZCBhbiBvY3RhdmUuPGJyPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQgeyBOb3RlSW5pdGlhbGl6ZXIgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiOyAvLyB0eXBlc2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgTm90ZSB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgd2l0aCBkZWZhdWx0IHZhbHVlcyBzZW1pdG9uZSAwKEMpIGFuZCBvY3RhdmUgNFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHVzaW5nIGFuIGluaXRpYWxpemVyIG9iamVjdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtzZW1pdG9uZTogNCwgb2N0YXZlOiA1fSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiBub3RlLW5hbWVbbW9kaWZpZXJdW29jdGF2ZV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB1c2luZyBhIHN0cmluZ1xyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKFwiQzVcIik7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgdmFsdWVzID0gcGFyc2VOb3RlKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB2YWx1ZXM/LnNlbWl0b25lID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAvLyBpbXBvcnRhbnQgdGhhdCBvY3RhdmUgaXMgc2V0IGZpcnN0IHNvIHRoYXRcclxuICAgICAgICAgICAgICAgLy8gc2V0dGluZyB0aGUgc2VtaXRvbmUgY2FuIGNoYW5nZSB0aGUgb2N0YXZlXHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB2YWx1ZXM/LnNlbWl0b25lID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgdW5pcXVlIGlkIGZvciB0aGlzIG5vdGUoYXV0byBnZW5lcmF0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlkKTsgLy8gczI4OThzbmxvalxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNlbWl0b25lXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIF9wcmV2U2VtaXRvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gMFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBzZW1pdG9uZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9uZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2V0dGluZyB0aGUgc2VtaXRvbmUgd2l0aCBhIG51bWJlciBvdXRzaWRlIHRoZVxyXG4gICAgICAgICogcmFuZ2Ugb2YgMC0xMSB3aWxsIHdyYXAgdGhlIHZhbHVlIGFyb3VuZCBhbmRcclxuICAgICAgICAqIGNoYW5nZSB0aGUgb2N0YXZlIGFjY29yZGluZ2x5XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBub3RlLnNlbWl0b25lID0gNDsvLyBFXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gNChFKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBzZW1pdG9uZShzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHNlbWl0b25lLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB0aGlzLl90b25lID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSB0aGlzLl9vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLm9jdGF2ZSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogbm90ZS5vY3RhdmUgPSAxMDtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUub2N0YXZlKTsgLy8gOShiZWNhdXNlIG9mIGNsYW1waW5nKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUob2N0YXZlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAob2N0YXZlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgc2hhcnBlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5zaGFycCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZTIuc2VtaXRvbmUpOyAvLyAxKEMjKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoYXJwKCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pLnNoYXJwZW4oKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2hhcnBlbnMgdGhlIG5vdGUgaW4gcGxhY2UuXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogbm90ZS5zaGFycGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gMShDIylcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hhcnBlbigpIHtcclxuICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdGhpcy5zZW1pdG9uZSArIDE7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBhdHRlbXB0cyB0byBkZXRlcm1pbmUgaWYgdGhlIG5vdGUgaXMgc2hhcnBcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG5vdGUgaXMgc2hhcnBcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzU2hhcnAoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBub3RlLnNoYXJwZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNTaGFycCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzU2hhcnAoKSB7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyB3aG9sZSwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBjb25zdCBtb2RpZmllZCA9IE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyh0aGlzLnNlbWl0b25lKTtcclxuICAgICAgICAgICBpZiAoIW1vZGlmaWVkKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyBmbGF0LCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGlmICh3cmFwKHRoaXMuc2VtaXRvbmUgKyAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSlcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL2lzIGZsYXRcclxuICAgICAgICAgICAvLyBEb2Vzbid0IG5lY2NlY2FyaWx5IG1lYW4gaXQncyBzaGFycCwgYnV0IGl0J3MgYSBnb29kIGd1ZXNzIGF0IHRoaXMgcG9pbnRcclxuICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBmbGF0dGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBmbGF0dGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLmZsYXQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUyLnNlbWl0b25lKTsgLy8gMyhFYilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBmbGF0KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pLmZsYXR0ZW4oKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogRmxhdHRlbnMgdGhlIG5vdGUgaW4gcGxhY2UuXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtzZW1pdG9uZTogNH0pOyAvLyAgc2VtaXRvbmUgaXMgNChFKVxyXG4gICAgICAgICogbm90ZS5mbGF0dGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnNlbWl0b25lKTsgLy8gMyhFYilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBmbGF0dGVuKCkge1xyXG4gICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lIC0gMTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIGF0dGVtcHRzIHRvIGRldGVybWluZSBpZiB0aGUgbm90ZSBpcyBmbGF0XHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBub3RlIGlzIGZsYXRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzRmxhdCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIG5vdGUuZmxhdHRlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc0ZsYXQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0ZsYXQoKSB7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyB3aG9sZSwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBjb25zdCBtb2RpZmllZCA9IE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyh0aGlzLnNlbWl0b25lKTtcclxuICAgICAgICAgICBpZiAoIW1vZGlmaWVkKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgLy8gaWYgbm90ZSBpcyBzaGFycCwgaXQgY2FuJ3QgYmUgZmxhdFxyXG4gICAgICAgICAgIGlmICh3cmFwKHRoaXMuc2VtaXRvbmUgLSAxLCBUT05FU19NSU4sIFRPTkVTX01BWCkudmFsdWUgPT09XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSlcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL2lzIHNoYXJwXHJcbiAgICAgICAgICAgLy8gRG9lc24ndCBuZWNjZWNhcmlseSBtZWFuIGl0J3MgZmxhdCwgYnV0IGl0J3MgYSBnb29kIGd1ZXNzIGF0IHRoaXMgcG9pbnRcclxuICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGlzIG5vdGUgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuZXF1YWxzKG5vdGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnNlbWl0b25lID09PSBub3RlLnNlbWl0b25lICYmIHRoaXMub2N0YXZlID09PSBub3RlLm9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmVxdWFscyhub3RlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIHN0cmluZyB2ZXJzaW9uIG9mIHRoaXMgbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEM0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5vdGVTdHJpbmdMb29rdXApO1xyXG4gICAgICAgICAgIHJldHVybiAobm90ZVN0cmluZ0xvb2t1cChgJHt0aGlzLl90b25lfS0ke3RoaXMuX3ByZXZTZW1pdG9uZX1gKSArXHJcbiAgICAgICAgICAgICAgIGAke3RoaXMuX29jdGF2ZX1gKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU3RhdGljIG1ldGhvZHMgdG8gY3JlYXRlIHdob2xlIG5vdGVzIGVhc2lseS5cclxuICAgICAgICAqIHRoZSBkZWZhdWx0IG9jdGF2ZSBpcyA0XHJcbiAgICAgICAgKi9cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gQVtvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuQSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQTRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgQShvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuQSxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gQltvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuQigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQjRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgQihvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuQixcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gQ1tvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuQygpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgQyhvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuQyxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gRFtvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRChvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRCxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gRVtvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRTRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRShvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRSxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gRltvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRjRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRihvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRixcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgICogQHBhcmFtIG9jdGF2ZVxyXG4gICAgICAgICogQHJldHVybnMgbm90ZSBzZXQgdG8gR1tvY3RhdmVdXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IE5vdGUuRygpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gRzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzdGF0aWMgRyhvY3RhdmUgPSA0KSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IFNlbWl0b25lJDEuRyxcclxuICAgICAgICAgICAgICAgb2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBDb25zdGFudHNcclxuICAgICovXHJcbiAgIGNvbnN0IE1JRElLRVlfU1RBUlQgPSAxMjtcclxuICAgY29uc3QgTlVNX09DVEFWRVMgPSAxMDtcclxuICAgY29uc3QgTlVNX1NFTUlUT05FUyA9IDEyO1xyXG4gICAvKipcclxuICAgICogQ2FsY3VsYXRlcyB0aGUgbWlkaSBrZXkgZm9yIGEgZ2l2ZW4gb2N0YXZlIGFuZCBzZW1pdG9uZS5cclxuICAgICovXHJcbiAgIGNvbnN0IGNhbGNNaWRpS2V5ID0gKG9jdGF2ZSwgc2VtaXRvbmUpID0+IE1JRElLRVlfU1RBUlQgKyBvY3RhdmUgKiBOVU1fU0VNSVRPTkVTICsgc2VtaXRvbmU7XHJcbiAgIC8qKlxyXG4gICAgKiBDYWxjdWxhdGVzIHRoZSBmcmVxdWVuY3kgZm9yIGEgZ2l2ZW4gb2N0YXZlIGFuZCBzZW1pdG9uZSBnaXZlblxyXG4gICAgKiBhIHR1bmluZyBmb3IgYTQuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjYWxjRnJlcXVlbmN5ID0gKG1pZGlLZXksIGE0VHVuaW5nKSA9PiAyICoqICgobWlkaUtleSAtIDY5KSAvIDEyKSAqIGE0VHVuaW5nO1xyXG4gICAvKipcclxuICAgICogQ3JlYXRlcyBhbmQgcmV0dXJuIGxvb2t1cCB0YWJsZXMgZm9yIG1pZGlrZXkgYW5kIGZyZXF1ZW5jeS5cclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlcyA9IChhNFR1bmluZyA9IDQ0MCkgPT4ge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNYXBzIG9jdGF2ZSBhbmQgc2VtaXRvbmUgdG8gbm90ZSBmcmVxdWVuY3koaGVydHopLlxyXG4gICAgICAgICogcmVxdWlyZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2YgYDxvY3RhdmU+LTxzZW1pdG9uZT5gXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0IGZyZXFUYWJsZSA9IHt9O1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNYXBzIG9jdGF2ZSBhbmQgc2VtaXRvbmUgdG8gbWlkaSBrZXkuXHJcbiAgICAgICAgKiByZXF1aXJlcyBhIGtleSBpbiB0aGUgZm9ybSBvZiBgPG9jdGF2ZT4tPHNlbWl0b25lPmBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3QgbWlkaVRhYmxlID0ge307XHJcbiAgICAgICBsZXQgaU9jdGF2ZSA9IDA7XHJcbiAgICAgICBsZXQgaVNlbWl0b25lID0gMDtcclxuICAgICAgIGZvciAoaU9jdGF2ZSA9IDA7IGlPY3RhdmUgPCBOVU1fT0NUQVZFUzsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgZm9yIChpU2VtaXRvbmUgPSAwOyBpU2VtaXRvbmUgPCBOVU1fU0VNSVRPTkVTOyArK2lTZW1pdG9uZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtpT2N0YXZlfS0ke2lTZW1pdG9uZX1gO1xyXG4gICAgICAgICAgICAgICBjb25zdCBta2V5ID0gY2FsY01pZGlLZXkoaU9jdGF2ZSwgaVNlbWl0b25lKTtcclxuICAgICAgICAgICAgICAgY29uc3QgZnJlcSA9IGNhbGNGcmVxdWVuY3kobWtleSwgYTRUdW5pbmcpO1xyXG4gICAgICAgICAgICAgICBtaWRpVGFibGVba2V5XSA9IG1rZXk7XHJcbiAgICAgICAgICAgICAgIGZyZXFUYWJsZVtrZXldID0gZnJlcTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgIGZyZXFMb29rdXA6IGZyZXFUYWJsZSxcclxuICAgICAgICAgICBtaWRpTG9va3VwOiBtaWRpVGFibGUsXHJcbiAgICAgICB9O1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogVHVuaW5nIGNvbXBvbmVudCB1c2VkIGJ5IEluc3RydW1lbnQgY2xhc3M8YnI+XHJcbiAgICAqIGNvbnRhaW5lcyB0aGUgYTQgdHVuaW5nIC0gZGVmYXVsdCBpcyA0NDBIejxicj5cclxuICAgICogYnVpbGRzIGxvb2t1cCB0YWJsZXMgZm9yIG1pZGkga2V5IGFuZCBmcmVxdWVuY3k8YnI+XHJcbiAgICAqIGJhc2VkIG9uIHRoZSB0dW5pbmdcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjbGFzcyBUdW5pbmcge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBDcmVhdGVzIHRoZSBvYmplY3QgYW5kIGJ1aWxkcyB0aGUgbG9va3VwIHRhYmxlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IoYTRGcmVxID0gNDQwKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYTQgPSBhNEZyZXE7XHJcbiAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlcygpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBUdW5pbmcodGhpcy5fYTQpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2E0ID09PSBvdGhlci5fYTQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGE0IFR1bmluZ1xyXG4gICAgICAgICovXHJcbiAgICAgICBfYTQgPSA0NDA7XHJcbiAgICAgICBnZXQgYTQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2E0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZXR0aW5nIHRoZSB0dW5pbmcgd2lsbCByZWJ1aWxkIHRoZSBsb29rdXAgdGFibGVzXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBhNCh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX2E0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlcygpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBsb29rdXAgdGFibGUgZm9yIG1pZGkga2V5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9taWRpS2V5VGFibGUgPSB7fTtcclxuICAgICAgIG1pZGlLZXlMb29rdXAob2N0YXZlLCBzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke29jdGF2ZX0tJHtzZW1pdG9uZX1gO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9taWRpS2V5VGFibGVba2V5XTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbG9va3VwIHRhYmxlIGZvciBmcmVxdWVuY3lcclxuICAgICAgICAqL1xyXG4gICAgICAgX2ZyZXFUYWJsZSA9IHt9O1xyXG4gICAgICAgZnJlcUxvb2t1cChvY3RhdmUsIHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7b2N0YXZlfS0ke3NlbWl0b25lfWA7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZXFUYWJsZVtrZXldO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBCdWlsZHMgdGhlIGxvb2t1cCB0YWJsZXMgZm9yIG1pZGkga2V5IGFuZCBmcmVxdWVuY3lcclxuICAgICAgICAqL1xyXG4gICAgICAgYnVpbGRUYWJsZXMoKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGFibGVzID0gY3JlYXRlVGFibGVzKHRoaXMuX2E0KTtcclxuICAgICAgICAgICB0aGlzLl9taWRpS2V5VGFibGUgPSB0YWJsZXMubWlkaUxvb2t1cDtcclxuICAgICAgICAgICB0aGlzLl9mcmVxVGFibGUgPSB0YWJsZXMuZnJlcUxvb2t1cDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgdHVuaW5nIGFzIGEgc3RyaW5nXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIHJldHVybiBgVHVuaW5nKCR7dGhpcy5fYTR9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIEluc3RydW1lbnQgYXJlIHVzZWQgdG8gZW5jYXBzdWxhdGUgdGhlIHR1bmluZyBhbmQgcmV0cmlldmluZyBvZiBtaWRpIGtleXNcclxuICAgICogYW5kIGZyZXF1ZW5jaWVzIGZvciBub3Rlc1xyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IEluc3RydW1lbnQgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKi9cclxuICAgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgICAgICB0dW5pbmc7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSB0dW5pbmcgQTQgZnJlcXVlbmN5IC0gZGVmYXVsdHMgdG8gNDQwXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7IC8vIGRlZmF1bHQgNDQwIHR1bmluZ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKGE0RnJlcSA9IDQ0MCkge1xyXG4gICAgICAgICAgIHRoaXMudHVuaW5nID0gbmV3IFR1bmluZyhhNEZyZXEpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5pZDsgLy8gcmV0dXJucyBhIHVuaXF1ZSBpZFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gaW5zdHJ1bWVudC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgSW5zdHJ1bWVudCh0aGlzLnR1bmluZy5hNCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSBvdGhlciB0aGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmVcclxuICAgICAgICAqIEByZXR1cm5zICB0cnVlIGlmIHRoZSBvdGhlciBvYmplY3QgaXMgZXF1YWwgdG8gdGhpcyBvbmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBpbnN0cnVtZW50LmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5lcXVhbHMob3RoZXIudHVuaW5nKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGZyZXF1ZW5jeSBvZiB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5nZXRGcmVxdWVuY3kobmV3IE5vdGUoXCJDNFwiKSk7IC8vIHJldHVybnMgMjYxLjYyNTU2NTMwMDU5ODZcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXRGcmVxdWVuY3kobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5mcmVxTG9va3VwKG5vdGUub2N0YXZlLCBub3RlLnNlbWl0b25lKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIG1pZGkga2V5IG9mIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmdldE1pZGlLZXkobmV3IE5vdGUoXCJDNFwiKSk7IC8vIHJldHVybnMgNjBcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXRNaWRpS2V5KG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcubWlkaUtleUxvb2t1cChub3RlLm9jdGF2ZSwgbm90ZS5zZW1pdG9uZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSB0dW5pbmcgYXMgYSBzdHJpbmdcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQudG9TdHJpbmcoKSk7IC8vIHJldHVybnMgXCJJbnN0cnVtZW50IFR1bmluZyg0NDApXCJcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICByZXR1cm4gYEluc3RydW1lbnQgVHVuaW5nKCR7dGhpcy50dW5pbmcuYTR9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgY29uc3QgREVGQVVMVF9TQ0FMRV9URU1QTEFURSA9IFswLCAyLCAyLCAxLCAyLCAyLCAyXTsgLy8gbWFqb3JcclxuICAgT2JqZWN0LmZyZWV6ZShERUZBVUxUX1NDQUxFX1RFTVBMQVRFKTtcblxuICAgLyoqXHJcbiAgICAqIE1hcHMgcHJlZGVmaW5lZCBzY2FsZXMgdG8gdGhlaXIgbmFtZXMuXHJcbiAgICAqL1xyXG4gICBjb25zdCBTY2FsZVRlbXBsYXRlcyA9IHtcclxuICAgICAgIHdob2xlVG9uZTogWzAsIDIsIDIsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgLy8gbWFqb3JcclxuICAgICAgIG1ham9yOiBbMCwgMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICBtYWpvcjdzNHM1OiBbMCwgMiwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBtb2Rlc1xyXG4gICAgICAgLy8gaW9uaWFuOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtYWpvclxyXG4gICAgICAgLy8gYWVvbGlhbjogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWlub3JcclxuICAgICAgIGRvcmlhbjogWzAsIDIsIDEsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgcGhyeWdpYW46IFswLCAxLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIGx5ZGlhbjogWzAsIDIsIDIsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgbHlkaWFuRG9taW5hbnQ6IFswLCAyLCAyLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIC8vIGFjb3VzdGljOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBseWRpYW5Eb21pbmFudFxyXG4gICAgICAgbWl4b2x5ZGlhbjogWzAsIDIsIDIsIDEsIDIsIDIsIDFdLFxyXG4gICAgICAgbWl4b2x5ZGlhbkZsYXQ2OiBbMCwgMiwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBsb2NyaWFuOiBbMCwgMSwgMiwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICBzdXBlckxvY3JpYW46IFswLCAxLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIC8vIG1pbm9yXHJcbiAgICAgICBtaW5vcjogWzAsIDIsIDEsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgbWlub3I3Yjk6IFswLCAxLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIG1pbm9yN2I1OiBbMCwgMiwgMSwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICAvLyBoYWxmRGltaW5pc2hlZDogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWlub3I3YjVcclxuICAgICAgIC8vIGhhcm1vbmljXHJcbiAgICAgICBoYXJtb25pY01ham9yOiBbMCwgMiwgMiwgMSwgMiwgMSwgM10sXHJcbiAgICAgICBoYXJtb25pY01pbm9yOiBbMCwgMiwgMSwgMiwgMiwgMSwgM10sXHJcbiAgICAgICBkb3VibGVIYXJtb25pYzogWzAsIDEsIDMsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gYnl6YW50aW5lOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBkb3VibGVIYXJtb25pY1xyXG4gICAgICAgLy8gbWVsb2RpY1xyXG4gICAgICAgbWVsb2RpY01pbm9yQXNjZW5kaW5nOiBbMCwgMiwgMSwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICBtZWxvZGljTWlub3JEZXNjZW5kaW5nOiBbMCwgMiwgMiwgMSwgMiwgMiwgMV0sXHJcbiAgICAgICAvLyBwZW50YXRvbmljXHJcbiAgICAgICBtYWpvclBlbnRhdG9uaWM6IFswLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIG1ham9yUGVudGF0b25pY0JsdWVzOiBbMCwgMiwgMSwgMSwgMywgMl0sXHJcbiAgICAgICBtaW5vclBlbnRhdG9uaWM6IFswLCAzLCAyLCAyLCAzXSxcclxuICAgICAgIG1pbm9yUGVudGF0b25pY0JsdWVzOiBbMCwgMywgMiwgMSwgMSwgM10sXHJcbiAgICAgICBiNVBlbnRhdG9uaWM6IFswLCAzLCAyLCAxLCA0LCAyXSxcclxuICAgICAgIG1pbm9yNlBlbnRhdG9uaWM6IFswLCAzLCAyLCAyLCAyLCAzXSxcclxuICAgICAgIC8vIGVuaWdtYXRpY1xyXG4gICAgICAgZW5pZ21hdGljTWFqb3I6IFswLCAxLCAzLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIGVuaWdtYXRpY01pbm9yOiBbMCwgMSwgMiwgMywgMSwgMywgMV0sXHJcbiAgICAgICAvLyA4VG9uZVxyXG4gICAgICAgZGltOFRvbmU6IFswLCAyLCAxLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGRvbThUb25lOiBbMCwgMSwgMiwgMSwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICAvLyBuZWFwb2xpdGFuXHJcbiAgICAgICBuZWFwb2xpdGFuTWFqb3I6IFswLCAxLCAyLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIG5lYXBvbGl0YW5NaW5vcjogWzAsIDEsIDIsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gaHVuZ2FyaWFuXHJcbiAgICAgICBodW5nYXJpYW5NYWpvcjogWzAsIDMsIDEsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgaHVuZ2FyaWFuTWlub3I6IFswLCAyLCAxLCAzLCAxLCAxLCAzXSxcclxuICAgICAgIGh1bmdhcmlhbkd5cHN5OiBbMCwgMSwgMywgMSwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBzcGFuaXNoXHJcbiAgICAgICBzcGFuaXNoOiBbMCwgMSwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICBzcGFuaXNoOFRvbmU6IFswLCAxLCAyLCAxLCAxLCAxLCAyLCAyXSxcclxuICAgICAgIC8vIGpld2lzaDogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgc3BhbmlzaDhUb25lXHJcbiAgICAgICBzcGFuaXNoR3lwc3k6IFswLCAxLCAzLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIGF1ZyBkb21cclxuICAgICAgIGF1Z21lbnRlZDogWzAsIDMsIDEsIDMsIDEsIDMsIDFdLFxyXG4gICAgICAgZG9taW5hbnRTdXNwZW5kZWQ6IFswLCAyLCAzLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIGJlYm9wXHJcbiAgICAgICBiZWJvcE1ham9yOiBbMCwgMiwgMiwgMSwgMiwgMSwgMSwgMl0sXHJcbiAgICAgICBiZWJvcERvbWluYW50OiBbMCwgMiwgMiwgMSwgMiwgMiwgMSwgMV0sXHJcbiAgICAgICBteXN0aWM6IFswLCAyLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIG92ZXJ0b25lOiBbMCwgMiwgMiwgMiwgMSwgMSwgMl0sXHJcbiAgICAgICBsZWFkaW5nVG9uZTogWzAsIDIsIDIsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgLy8gamFwYW5lc2VcclxuICAgICAgIGhpcm9qb3NoaTogWzAsIDIsIDEsIDQsIDFdLFxyXG4gICAgICAgamFwYW5lc2VBOiBbMCwgMSwgNCwgMSwgM10sXHJcbiAgICAgICBqYXBhbmVzZUI6IFswLCAyLCAzLCAxLCAzXSxcclxuICAgICAgIC8vIGN1bHR1cmVzXHJcbiAgICAgICBvcmllbnRhbDogWzAsIDEsIDMsIDEsIDEsIDMsIDFdLFxyXG4gICAgICAgcGVyc2lhbjogWzAsIDEsIDQsIDEsIDIsIDNdLFxyXG4gICAgICAgYXJhYmlhbjogWzAsIDIsIDIsIDEsIDEsIDIsIDJdLFxyXG4gICAgICAgYmFsaW5lc2U6IFswLCAxLCAyLCA0LCAxXSxcclxuICAgICAgIGt1bW9pOiBbMCwgMiwgMSwgNCwgMiwgMl0sXHJcbiAgICAgICBwZWxvZzogWzAsIDEsIDIsIDMsIDEsIDFdLFxyXG4gICAgICAgYWxnZXJpYW46IFswLCAyLCAxLCAyLCAxLCAxLCAxLCAzXSxcclxuICAgICAgIGNoaW5lc2U6IFswLCA0LCAyLCAxLCA0XSxcclxuICAgICAgIG1vbmdvbGlhbjogWzAsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgZWd5cHRpYW46IFswLCAyLCAzLCAyLCAzXSxcclxuICAgICAgIHJvbWFpbmlhbjogWzAsIDIsIDEsIDMsIDEsIDIsIDFdLFxyXG4gICAgICAgaGluZHU6IFswLCAyLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGluc2VuOiBbMCwgMSwgNCwgMiwgM10sXHJcbiAgICAgICBpd2F0bzogWzAsIDEsIDQsIDEsIDRdLFxyXG4gICAgICAgc2NvdHRpc2g6IFswLCAyLCAzLCAyLCAyXSxcclxuICAgICAgIHlvOiBbMCwgMywgMiwgMiwgM10sXHJcbiAgICAgICBpc3RyaWFuOiBbMCwgMSwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICB1a3JhbmlhbkRvcmlhbjogWzAsIDIsIDEsIDMsIDEsIDIsIDFdLFxyXG4gICAgICAgcGV0cnVzaGthOiBbMCwgMSwgMywgMiwgMSwgM10sXHJcbiAgICAgICBhaGF2YXJhYmE6IFswLCAxLCAzLCAxLCAyLCAxLCAyXSxcclxuICAgfTtcclxuICAgLy8gZHVwbGljYXRlcyB3aXRoIGFsaWFzZXNcclxuICAgU2NhbGVUZW1wbGF0ZXMuaGFsZkRpbWluaXNoZWQgPSBTY2FsZVRlbXBsYXRlcy5taW5vcjdiNTtcclxuICAgU2NhbGVUZW1wbGF0ZXMuamV3aXNoID0gU2NhbGVUZW1wbGF0ZXMuc3BhbmlzaDhUb25lO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5ieXphbnRpbmUgPSBTY2FsZVRlbXBsYXRlcy5kb3VibGVIYXJtb25pYztcclxuICAgU2NhbGVUZW1wbGF0ZXMuYWNvdXN0aWMgPSBTY2FsZVRlbXBsYXRlcy5seWRpYW5Eb21pbmFudDtcclxuICAgU2NhbGVUZW1wbGF0ZXMuYWVvbGlhbiA9IFNjYWxlVGVtcGxhdGVzLm1pbm9yO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5pb25pYW4gPSBTY2FsZVRlbXBsYXRlcy5tYWpvcjtcclxuICAgT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpLmZvckVhY2goKGVsZW1lbnQpID0+IE9iamVjdC5mcmVlemUoU2NhbGVUZW1wbGF0ZXNbZWxlbWVudF0pKTtcblxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICBjb25zdCBuYW1lUmVnZXgkMSA9IC8oW0EtR10pKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXgkMSA9IC8oI3xzfGIpKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4JDEgPSAvKFswLTldKykoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3Qgc2NhbGVOYW1lUmVnZXggPSAvKFxcKFthLXpBLVpdezIsfVxcKSkvZztcclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIHBhcnNlIGEgbm90ZSBmcm9tIGEgc3RyaW5nXHJcbiAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzdHJpbmcgdG8gcGFyc2VcclxuICAgICogQHBhcmFtIHN1cHJlc3NXYXJuaW5nIC0gc3VwcmVzcyB0aGUgd2FybmluZyBmb3IgaW5lZmZlY2llbmN5IGlmIHRydWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZVNjYWxlID0gKHNjYWxlLCBzdXByZXNzV2FybmluZyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHNjYWxlTG9va3VwKHNjYWxlKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgc2NhbGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke3NjYWxlfS4gR2V0IGEgcGVyZm9ybWFuYyBpbmNyZWFzZSBieSB1c2luZyBhIHZhbGlkIGZvcm1hdGApO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgc2NhbGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke3NjYWxlfS4gR2V0IGEgcGVyZm9ybWFuYyBpbmNyZWFzZSBieSB1c2luZyBhIHZhbGlkIGZvcm1hdGApO1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBsZXQgc2NhbGVOYW1lID0gXCJcIjtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IHNjYWxlLm1hdGNoKG5hbWVSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG1vZGlmaWVyTWF0Y2ggPSBzY2FsZS5tYXRjaChtb2RpZmllclJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBzY2FsZS5tYXRjaChvY3RhdmVSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZU1hdGNoID0gc2NhbGUubWF0Y2goc2NhbGVOYW1lUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKHNjYWxlTmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc05hbWUgPSBzY2FsZU5hbWVNYXRjaC5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNOYW1lKTtcclxuICAgICAgICAgICBzY2FsZU5hbWUgPSBzTmFtZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICBsZXQgdGVtcGxhdGVJbmRleCA9IDE7IC8vIGRlZmF1bHQgbWFqb3Igc2NhbGVcclxuICAgICAgICAgICBpZiAoc2NhbGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlSW5kZXggPSBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcykuZmluZEluZGV4KCh0ZW1wbGF0ZSkgPT4gdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgICAgICAgICAuaW5jbHVkZXMoc2NhbGVOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFwofFxcKS9nLCBcIlwiKSkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcylbdGVtcGxhdGVJbmRleF0pO1xyXG4gICAgICAgICAgIGlmICh0ZW1wbGF0ZUluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVOS05PV04gVEVNUExBVEVcIiwgc2NhbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCB0ZW1wbGF0ZSBmb3Igc2NhbGUgJHtzY2FsZU5hbWV9YCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXNbT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpW3RlbXBsYXRlSW5kZXhdXTtcclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICBrZXk6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgU2NhbGU6ICR7c2NhbGV9YCk7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGUkMiA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHNjYWxlVGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBjb25zdCB0ZW1wbGF0ZXMgPSBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIHRlbXBsYXRlcykge1xyXG4gICAgICAgICAgIGZvciAoY29uc3Qgbm90ZUxhYmVsIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgIC8vZXggQShtaW5vcilcclxuICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtgJHtub3RlTGFiZWx9KCR7dGVtcGxhdGV9KWBdID0gcGFyc2VTY2FsZShub3RlTGFiZWwsIHRydWUpOyAvLyAnQycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCBtb2Qgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bW9kfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gZXggQSMobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDIycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8IE9DVEFWRV9NQVg7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7aU9jdGF2ZX0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgIC8vIGV4IEE0KG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bW9kfSR7aU9jdGF2ZX0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAvLyBleCBBIzQobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQyM0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHNjYWxlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIHRoZSBsb29rdXAgdGFibGUgYXMgc29vbiBhcyB0aGUgbW9kdWxlIGlzIGxvYWRlZFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGxldCBfc2NhbGVMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgc2NhbGVMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfc2NhbGVMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9zY2FsZUxvb2t1cCA9IHRhYmxlIGFzIHsgW2tleTogc3RyaW5nXTogU2NhbGVJbml0aWFsaXplciB9O1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfc2NhbGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfc2NhbGVMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfc2NhbGVMb29rdXA7XHJcbiAgICAgICBfc2NhbGVMb29rdXAgPSBjcmVhdGVUYWJsZSQyKCk7XHJcbiAgICAgICAvLyBPYmplY3QuZnJlZXplKF9zY2FsZUxvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIlNjYWxlIFRhYmxlIEJ1aWx0XCIpO1xyXG4gICAgICAgcmV0dXJuIF9zY2FsZUxvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIHNoaWZ0cyBhbiBhcnJheSBieSBhIGdpdmVuIGRpc3RhbmNlXHJcbiAgICAqIEBwYXJhbSBhcnIgdGhlIGFycmF5IHRvIHNoaWZ0XHJcbiAgICAqIEBwYXJhbSBkaXN0YW5jZSB0aGUgZGlzdGFuY2UgdG8gc2hpZnRcclxuICAgICogQHJldHVybnMgdGhlIHNoaWZ0ZWQgYXJyYXlcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzaGlmdCA9IChhcnIsIGRpc3QgPSAxKSA9PiB7XHJcbiAgICAgICBhcnIgPSBbLi4uYXJyXTsgLy8gY29weVxyXG4gICAgICAgaWYgKGRpc3QgPiBhcnIubGVuZ3RoIHx8IGRpc3QgPCAwIC0gYXJyLmxlbmd0aClcclxuICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaGlmdDogZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIGFycmF5IGxlbmd0aFwiKTtcclxuICAgICAgIGlmIChkaXN0ID4gMCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnIuc3BsaWNlKGFyci5sZW5ndGggLSBkaXN0LCBJbmZpbml0eSk7XHJcbiAgICAgICAgICAgYXJyLnVuc2hpZnQoLi4udGVtcCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoZGlzdCA8IDApIHtcclxuICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyLnNwbGljZSgwLCBkaXN0KTtcclxuICAgICAgICAgICBhcnIucHVzaCguLi50ZW1wKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBhcnI7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiAgU2ltcGxlIHV0aWwgdG8gbGF6eSBjbG9uZSBhbiBvYmplY3RcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjbG9uZSA9IChvYmopID0+IHtcclxuICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogc2ltcGxlIHV0aWwgdG8gbGF6eSBjaGVjayBlcXVhbGl0eSBvZiBvYmplY3RzIGFuZCBhcnJheXNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBpc0VxdWFsID0gKGEsIGIpID0+IHtcclxuICAgICAgIGNvbnN0IHN0cmluZ0EgPSBKU09OLnN0cmluZ2lmeShhKTtcclxuICAgICAgIGNvbnN0IHN0cmluZ0IgPSBKU09OLnN0cmluZ2lmeShiKTtcclxuICAgICAgIHJldHVybiBzdHJpbmdBID09PSBzdHJpbmdCO1xyXG4gICB9O1xuXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZVN0cmluZ0xvb2t1cC5qc29uXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBXaWxsIGxvb2t1cCBhIHNjYWxlIG5hbWUgYmFzZWQgb24gdGhlIHRlbXBsYXRlLlxyXG4gICAgKiBAcGFyYW0gdGVtcGxhdGUgLSB0aGUgdGVtcGxhdGUgdG8gbG9va3VwXHJcbiAgICAqIEBwYXJhbSBzdXByZXNzV2FybmluZyAtIHN1cHJlc3MgdGhlIHdhcm5pbmcgZm9yIGluZWZmZWNpZW5jeSBpZiB0cnVlXHJcbiAgICAqIEByZXR1cm5zIHRoZSBzY2FsZSBuYW1lXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2NhbGVOYW1lTG9va3VwID0gKHRlbXBsYXRlLCBzdXByZXNzV2FybmluZyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5hbWVUYWJsZShKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZXMgPSBbXTtcclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgIGlmIChpc0VxdWFsKHZhbHVlc1tpXSwgdGVtcGxhdGUpKSB7XHJcbiAgICAgICAgICAgICAgIHNjYWxlTmFtZXMucHVzaChrZXlzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5c1tpXS5zbGljZSgxKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lc1N0cmluZyA9IHNjYWxlTmFtZXMuam9pbihcIiBBS0EgXCIpO1xyXG4gICAgICAgcmV0dXJuIHNjYWxlTmFtZXNTdHJpbmc7XHJcbiAgIH07XHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDEgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiBPYmplY3QudmFsdWVzKFNjYWxlVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgIHRhYmxlW0pTT04uc3RyaW5naWZ5KHRlbXBsYXRlKV0gPSBzY2FsZU5hbWVMb29rdXAodGVtcGxhdGUsIHRydWUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBsZXQgX25hbWVUYWJsZSA9IHt9O1xyXG4gICBjb25zdCBuYW1lVGFibGUgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlTmFtZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25hbWVUYWJsZVtrZXldO1xyXG4gICB9O1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25hbWVUYWJsZSA9IHRhYmxlO1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfbmFtZVRhYmxlID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZFNjYWxlTmFtZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9uYW1lVGFibGUpLmxlbmd0aCA+IDApIHJldHVybiBfbmFtZVRhYmxlO1xyXG4gICAgICAgX25hbWVUYWJsZSA9IGNyZWF0ZVRhYmxlJDEoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25hbWVUYWJsZSk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIlNjYWxlIG5hbWUgdGFibGUgYnVpbHRcIik7XHJcbiAgICAgICByZXR1cm4gX25hbWVUYWJsZTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNjYWxlcyBjb25zaXN0IG9mIGEga2V5KHRvbmljIG9yIHJvb3QpIGFuZCBhIHRlbXBsYXRlKGFycmF5IG9mIGludGVnZXJzKSB0aGF0XHJcbiAgICAqIDxicj4gcmVwcmVzZW50cyB0aGUgaW50ZXJ2YWwgb2Ygc3RlcHMgYmV0d2VlbiBlYWNoIG5vdGUuXHJcbiAgICAqIDxicj48YnI+U2NhbGUgaW50ZXJ2YWxzIGFyZSByZXByZXNlbnRlZCBieSBhbiBpbnRlZ2VyXHJcbiAgICAqIDxicj50aGF0IGlzIHRoZSBudW1iZXIgb2Ygc2VtaXRvbmVzIGJldHdlZW4gZWFjaCBub3RlLlxyXG4gICAgKiA8YnI+MCA9IGtleSAtIHdpbGwgYWx3YXlzIHJlcHJlc2VudCB0aGUgdG9uaWNcclxuICAgICogPGJyPjEgPSBoYWxmIHN0ZXBcclxuICAgICogPGJyPjIgPSB3aG9sZSBzdGVwXHJcbiAgICAqIDxicj4zID0gb25lIGFuZCBvbmUgaGFsZiBzdGVwc1xyXG4gICAgKiA8YnI+NCA9IGRvdWJsZSBzdGVwXHJcbiAgICAqIDxicj5bMCwgMiwgMiwgMSwgMiwgMiwgMl0gcmVwcmVzZW50cyB0aGUgbWFqb3Igc2NhbGVcclxuICAgICogPGJyPjxicj4gU2NhbGUgdGVtcGxhdGVzIG1heSBoYXZlIGFyYml0cmF5IGxlbmd0aHNcclxuICAgICpcclxuICAgICogVGhlIGZvbGxvd2luZyBQcmUtZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTpcclxuICAgICogPHRhYmxlPlxyXG4gICAgKiA8dHI+XHJcbiAgICAqIDx0ZD5tYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5pb25pYW48L3RkPlxyXG4gICAgKiA8dGQ+ZG9yaWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5waHJ5Z2lhbjwvdGQ+XHJcbiAgICAqIDx0ZD5seWRpYW48L3RkPlxyXG4gICAgKiA8dGQ+bWl4b2x5ZGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5hZW9saWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5sb2NyaWFuPC90ZD5cclxuICAgICogPHRkPmVuaWdtYXRpY01ham9yPC90ZD5cclxuICAgICogPHRkPmVuaWdtYXRpY01pbm9yPC90ZD5cclxuICAgICogPHRkPm1pbm9yN2I1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWpvcjdzNHM1PC90ZD5cclxuICAgICogPHRkPmhhcm1vbmljTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+aGFybW9uaWNNaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5kb3VibGVIYXJtb25pYzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWVsb2RpY01pbm9yQXNjZW5kaW5nPC90ZD5cclxuICAgICogPHRkPm1lbG9kaWNNaW5vckRlc2NlbmRpbmc8L3RkPlxyXG4gICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1ham9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgKiA8dGQ+YjVQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1pbm9yNlBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRpbThUb25lPC90ZD5cclxuICAgICogPHRkPmRvbThUb25lPC90ZD5cclxuICAgICogPHRkPm5lb3BvbGl0YW5NYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5uZW9wb2xpdGFuTWlub3I8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmh1bmdhcmlhbk1ham9yPC90ZD5cclxuICAgICogPHRkPmh1bmdhcmlhbk1pbm9yPC90ZD5cclxuICAgICogPHRkPmh1bmdhcmlhbkd5cHN5PC90ZD5cclxuICAgICogPHRkPnNwYW5pc2g8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnNwYW5pc2g4VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5zcGFuaXNoR3lwc3k8L3RkPlxyXG4gICAgKiA8dGQ+YXVnbWVudGVkPC90ZD5cclxuICAgICogPHRkPmRvbWluYW50U3VzcGVuZGVkPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5iZWJvcE1ham9yPC90ZD5cclxuICAgICogPHRkPmJlYm9wRG9taW5hbnQ8L3RkPlxyXG4gICAgKiA8dGQ+bXlzdGljPC90ZD5cclxuICAgICogPHRkPm92ZXJ0b25lPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5sZWFkaW5nVG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5oaXJvam9zaGk8L3RkPlxyXG4gICAgKiA8dGQ+amFwYW5lc2VBPC90ZD5cclxuICAgICogPHRkPmphcGFuZXNlQjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+b3JpZW50YWw8L3RkPlxyXG4gICAgKiA8dGQ+YXJhYmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5wZXJzaWFuPC90ZD5cclxuICAgICogPHRkPmJhbGluZXNlPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5rdW1vaTwvdGQ+XHJcbiAgICAqIDx0ZD5wZWxvZzwvdGQ+XHJcbiAgICAqIDx0ZD5hbGdlcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5jaGluZXNlPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tb25nb2xpYW48L3RkPlxyXG4gICAgKiA8dGQ+ZWd5cHRpYW48L3RkPlxyXG4gICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgKiA8dGQ+cm9tYW5pYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICogPHRkPmluc2VuPC90ZD5cclxuICAgICogPHRkPml3YXRvPC90ZD5cclxuICAgICogPHRkPnNjb3R0aXNoPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD55bzwvdGQ+XHJcbiAgICAqIDx0ZD5pc3RyaWFuPC90ZD5cclxuICAgICogPHRkPnVrcmFuaWFuRG9yaWFuPC90ZD5cclxuICAgICogPHRkPnBldHJ1c2hrYTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YWhhdmFyYWJhPC90ZD5cclxuICAgICogPHRkPmhhbGZEaW1pbmlzaGVkPC90ZD5cclxuICAgICogPHRkPmpld2lzaDwvdGQ+XHJcbiAgICAqIDx0ZD5ieXphbnRpbmU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmFjb3VzdGljPC90ZD5cclxuICAgICogPC90YWJsZT5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQge1NjYWxlfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICogaW1wb3J0IHtTY2FsZVRlbXBsYXRlc30gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAqIGltcG9ydCB7U2NhbGVJbml0aWFsaXplcn0gZnJvbSAnbXVzaWN0aGVvcnlqcyc7IC8vIFR5cGVTY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBTY2FsZSB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQge1NjYWxlLCBTY2FsZVRlbXBsYXRlc30gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIGRlZmF1bHQgdGVtcGxhdGUsIGtleSAwZiAwKEMpIGFuZCBhbiBvY3RhdmUgb2YgNFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgdGVtcGxhdGUgWzAsIDIsIDIsIDEsIDIsIDIsIDJdIGFuZCBrZXkgNChFKSBhbmQgb2N0YXZlIDVcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IG5ldyBTY2FsZSh7a2V5OiA0LCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5tYWpvcn0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IG5vdGUtbmFtZVthbHRlcmF0aW9uXVtvY3RhdmVdWyhzY2FsZS1uYW1lKV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSBtaW5vciB0ZW1wbGF0ZSwga2V5IEdiIGFuZCBhbiBvY3RhdmUgb2YgN1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUzID0gbmV3IFNjYWxlKCdHYjcobWlub3IpJyk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IERFRkFVTFRfU0NBTEVfVEVNUExBVEU7XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICB2YWx1ZXMgPSBwYXJzZVNjYWxlKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBbLi4uKHZhbHVlcz8udGVtcGxhdGUgPz8gREVGQVVMVF9TQ0FMRV9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IHZhbHVlcy5rZXkgfHwgREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlIHx8IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRoYXQgb2N0YXZlIGlzIHNldCBmaXJzdCBzbyB0aGF0XHJcbiAgICAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIHNlbWl0b25lIGNhbiBjaGFuZ2UgdGhlIG9jdGF2ZVxyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gWy4uLih2YWx1ZXM/LnRlbXBsYXRlID8/IERFRkFVTFRfU0NBTEVfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSB2YWx1ZXMua2V5IHx8IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSB8fCBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICB1bmlxdWUgaWQgZm9yIHRoaXMgc2NhbGUoYXV0byBnZW5lcmF0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmlkKTsgLy8gZGhsa2o1ajMyMlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHNjYWxlIGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBzY2FsZVxyXG4gICAgICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHNjYWxlIHRvIGNvbXBhcmUgdG9cclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHNjYWxlcyBhcmUgZXF1YWxcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5lcXVhbHMoc2NhbGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMoc2NhbGUpIHtcclxuICAgICAgICAgICByZXR1cm4gKHRoaXMuX2tleSA9PT0gc2NhbGUuX2tleSAmJlxyXG4gICAgICAgICAgICAgICB0aGlzLl9vY3RhdmUgPT09IHNjYWxlLl9vY3RhdmUgJiZcclxuICAgICAgICAgICAgICAgaXNFcXVhbCh0aGlzLl90ZW1wbGF0ZSwgc2NhbGUuX3RlbXBsYXRlKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBjb3B5IG9mIHRoaXMgU2NhbGVcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIFNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IHNjYWxlLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmVxdWFscyhzY2FsZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMua2V5LFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogY2xvbmUodGhpcy50ZW1wbGF0ZSksXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAhPT0gMClcclxuICAgICAgICAgICAgICAgc2NhbGUuc2hpZnQodGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGtleVxyXG4gICAgICAgICovXHJcbiAgICAgICBfa2V5ID0gMDtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5rZXkpOyAvLyAwKHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBrZXkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2V0dGluZyB0aGUgc2VtaXRvbmUgdG8gYSB2YWx1ZSBvdXRzaWRlIG9mIHRoZSByYW5nZSBbMCwgMTFdKHNlbWl0b25lKSB3aWxsPGJyLz5cclxuICAgICAgICAqIHdyYXAgdGhlIHNlbWl0b25lIHRvIHRoZSByYW5nZSBbMCwgMTFdIGFuZCBjaGFuZ2UgdGhlIG9jdGF2ZSBkZXBlbmRpbmc8YnIvPlxyXG4gICAgICAgICogb24gaG93IG1hbnkgdGltZXMgdGhlIHNlbWl0b25lIGhhcyBiZWVuIHdyYXBwZWQuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLmtleSA9IDQ7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5rZXkpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGtleSh2YWx1ZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHZhbHVlLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB0aGlzLm9jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgdGhpcy5fa2V5ID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm9jdGF2ZSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUub2N0YXZlID0gNTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm9jdGF2ZSk7IC8vIDVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAodmFsdWUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB0ZW1wbGF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50ZW1wbGF0ZSk7IC8vIFswLCAyLCAyLCAxLCAyLCAyLCAyXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gY2xvbmUodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgZm9sbG93aW5nIFByZS1kZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOlxyXG4gICAgICAgICogPHRhYmxlPlxyXG4gICAgICAgICogPHRyPlxyXG4gICAgICAgICogPHRkPm1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aW9uaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb3JpYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+cGhyeWdpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmx5ZGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWl4b2x5ZGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YWVvbGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5sb2NyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5lbmlnbWF0aWNNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZW5pZ21hdGljTWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yN2I1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1ham9yN3M0czU8L3RkPlxyXG4gICAgICAgICogPHRkPmhhcm1vbmljTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmhhcm1vbmljTWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmRvdWJsZUhhcm1vbmljPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1lbG9kaWNNaW5vckFzY2VuZGluZzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWVsb2RpY01pbm9yRGVzY2VuZGluZzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICAgICAqIDx0ZD5iNVBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yNlBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZGltOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbThUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5uZW9wb2xpdGFuTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPm5lb3BvbGl0YW5NaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5NYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuTWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbkd5cHN5PC90ZD5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2g4VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaEd5cHN5PC90ZD5cclxuICAgICAgICAqIDx0ZD5hdWdtZW50ZWQ8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbWluYW50U3VzcGVuZGVkPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmJlYm9wTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmJlYm9wRG9taW5hbnQ8L3RkPlxyXG4gICAgICAgICogPHRkPm15c3RpYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+b3ZlcnRvbmU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bGVhZGluZ1RvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPmhpcm9qb3NoaTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amFwYW5lc2VBPC90ZD5cclxuICAgICAgICAqIDx0ZD5qYXBhbmVzZUI8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+b3JpZW50YWw8L3RkPlxyXG4gICAgICAgICogPHRkPmFyYWJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnBlcnNpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmJhbGluZXNlPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmt1bW9pPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZWxvZzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YWxnZXJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmNoaW5lc2U8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bW9uZ29saWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5lZ3lwdGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgICAgICogPHRkPnJvbWFuaWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICAgICAqIDx0ZD5pbnNlbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aXdhdG88L3RkPlxyXG4gICAgICAgICogPHRkPnNjb3R0aXNoPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnlvPC90ZD5cclxuICAgICAgICAqIDx0ZD5pc3RyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD51a3JhbmlhbkRvcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGV0cnVzaGthPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmFoYXZhcmFiYTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFsZkRpbWluaXNoZWQ8L3RkPlxyXG4gICAgICAgICogPHRkPmpld2lzaDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+Ynl6YW50aW5lPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmFjb3VzdGljPC90ZD5cclxuICAgICAgICAqIDwvdGFibGU+XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLnRlbXBsYXRlID0gWzAsIDIsIDIsIDEsIDIsIDIsIDJdO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudGVtcGxhdGUpOyAvLyBbMCwgMiwgMiwgMSwgMiwgMiwgMl1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IGNsb25lKHZhbHVlKTtcclxuICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBub3Rlc1xyXG4gICAgICAgICogbm90ZXMgYXJlIGdlbmVyYXRlZCBhbmQgY2FjaGVkIGFzIG5lZWRlZFxyXG4gICAgICAgICovXHJcbiAgICAgICBfbm90ZXMgPSBbXTtcclxuICAgICAgIF9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogd2lsbCBnZW5lcmF0ZSB0aGUgbm90ZXMgaWYgbmVlZGVkIG9yIHJldHVybiB0aGUgY2FjaGVkIG5vdGVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm5vdGVzKTsgLy8gTGlzdCBvZiBub3Rlc1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBub3RlcygpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fbm90ZXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGdlbmVyYXRlIG5vdGVzKGludGVybmFsKVxyXG4gICAgICAgICogZ2VuZXJhdGVzIHRoZSBub3RlcyBmb3IgdGhpcyBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBnZW5lcmF0ZU5vdGVzKCkge1xyXG4gICAgICAgICAgIC8vIHVzZSB0aGUgdGVtcGxhdGUgdW5zaGlmdGVkIGZvciBzaW1wbGljaXR5XHJcbiAgICAgICAgICAgY29uc3QgdW5zaGlmdGVkVGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgLXRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgLy8gaWYgYWxsb3dpbmcgdGhpcyB0byBjaGFuZ2UgdGhlIG9jdGF2ZSBpcyB1bmRlc2lyYWJsZVxyXG4gICAgICAgICAgIC8vIHRoZW4gbWF5IG5lZWQgdG8gcHJlIHdyYXAgdGhlIHRvbmUgYW5kIHVzZVxyXG4gICAgICAgICAgIC8vIHRoZSBmaW5hbCB2YWx1ZVxyXG4gICAgICAgICAgIGNvbnN0IG5vdGVzID0gW107XHJcbiAgICAgICAgICAgbGV0IGFjY3VtdWxhdG9yID0gdGhpcy5rZXk7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB1bnNoaWZ0ZWRUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0b25lID0gaW50ZXJ2YWwgPT09IDBcclxuICAgICAgICAgICAgICAgICAgID8gKGFjY3VtdWxhdG9yID0gdGhpcy5rZXkpXHJcbiAgICAgICAgICAgICAgICAgICA6IChhY2N1bXVsYXRvciArPSBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogdG9uZSxcclxuICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICBub3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyBzaGlmdCBub3RlcyBiYWNrIHRvIG9yaWdpbmFsIHBvc2l0aW9uXHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA+IDApIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5vdGVzLnNwbGljZShub3Rlcy5sZW5ndGggLSAodGhpcy5fc2hpZnRlZEludGVydmFsICsgMSksIEluZmluaXR5KTtcclxuICAgICAgICAgICAgICAgbm90ZXMudW5zaGlmdCguLi50ZW1wKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA8IDApIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5vdGVzLnNwbGljZSgwLCB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICBub3Rlcy5wdXNoKC4uLnRlbXApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3RlcyA9IG5vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgbm90ZXMgaW4gdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcGFyYW0gcHJlZmVyU2hhcnBLZXlzIC0gaWYgdHJ1ZSB0aGVuIHNoYXJwcyB3aWxsIGJlIHByZWZlcnJlZCBvdmVyIGZsYXRzIHdoZW4gc2VtaXRvbmVzIGNvdWxkIGJlIGVpdGhlciAtIGV4OiBCYi9BI1xyXG4gICAgICAgICogQHJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBub3RlcyBpbiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubmFtZXMpOyAvLyBbJ0M0JywgJ0Q0JywgJ0U0JywgJ0Y0JywgJ0c0JywgJ0E0JywgJ0I0J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXROb3RlTmFtZXMocHJlZmVyU2hhcnBLZXkgPSB0cnVlKSB7XHJcbiAgICAgICAgICAgY29uc3QgbmFtZXMgPSBzY2FsZU5vdGVOYW1lTG9va3VwKHRoaXMsIHByZWZlclNoYXJwS2V5KTtcclxuICAgICAgICAgICByZXR1cm4gbmFtZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGRlZ3JlZVxyXG4gICAgICAgICogcmV0dXJucyBhIG5vdGUgdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBkZWdyZWVcclxuICAgICAgICAqIEBwYXJhbSBkZWdyZWUgLSB0aGUgZGVncmVlIHRvIHJldHVyblxyXG4gICAgICAgICogQHJldHVybnMgYSBub3RlIHRoYXQgcmVwcmVzZW50cyB0aGUgZ2l2ZW4gZGVncmVlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRlZ3JlZSgwKSk7IC8vIEM0KE5vdGUpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kZWdyZWUoMSkpOyAvLyBENChOb3RlKSBldGNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkZWdyZWUoZGVncmVlKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAoZGVncmVlIC0gMSAvKnplcm8gaW5kZXggKi8sIDAsIHRoaXMubm90ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMubm90ZXNbd3JhcHBlZC52YWx1ZV0uY29weSgpO1xyXG4gICAgICAgICAgIG5vdGUub2N0YXZlID0gdGhpcy5vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHJldHVybiBub3RlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZWxhdGl2ZSBtYWpvclxyXG4gICAgICAgICogcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtYWpvciBvZiB0aGlzIHNjYWxlIC0gdGFrZXMgdGhlIDNyZCBkZWdyZWUgYXMgaXQncyBrZXlcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1ham9yIG9mIHRoaXMgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucmVsYXRpdmVNYWpvcigpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICByZWxhdGl2ZU1ham9yKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG1ham9yID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1ham9yLFxyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMuZGVncmVlKDMpLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIHJldHVybiBtYWpvcjtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmVsYXRpdmUgbWlub3JcclxuICAgICAgICAqIHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWlub3Igb2YgdGhpcyBzY2FsZSAtIHRha2VzIHRoZSA2dGggZGVncmVlIGFzIGl0J3Mga2V5XHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtaW5vciBvZiB0aGlzIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnJlbGF0aXZlTWlub3IoKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcmVsYXRpdmVNaW5vcigpIHtcclxuICAgICAgICAgICBjb25zdCBtaW5vciA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5taW5vcixcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmRlZ3JlZSg2KS5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICByZXR1cm4gbWlub3I7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9zaGlmdGVkSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgX29yaWdpbmFsVGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRcclxuICAgICAgICAqIHNoaWZ0cyB0aGUgc2NhbGUgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcGFyYW0gc2hpZnQgLSB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgdG8gc2hpZnQgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSBzaGlmdGVkIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdChkZWdyZWVzID0gMSkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPT09IDApIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZSA9IGNsb25lKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgZGVncmVlcyk7XHJcbiAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsICs9IGRlZ3JlZXM7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0ZWRcclxuICAgICAgICAqIHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBwYXJhbSBkZWdyZWVzIC0gdGhlIG51bWJlciBvZiBkZWdyZWVzIHRvIHNoaWZ0IHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnRlZCgxKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnRlZChkZWdyZWVzID0gMSkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUuc2hpZnQoZGVncmVlcyk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bnNoaWZ0XHJcbiAgICAgICAgKiBzaGlmdHMgdGhlIG9yaWdpbmFsIHJvb3QgYmFjayB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhpcyBzY2FsZSBhZnRlciB1bnNoaWZ0aW5nIGl0IGJhY2sgdG8gdGhlIG9yaWdpbmFsIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudW5zaGlmdCgpKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB1bnNoaWZ0KCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgIT09IDApIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX29yaWdpbmFsVGVtcGxhdGUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vIHRoaXMuc2hpZnQodGhpcy5fc2hpZnRlZEludGVydmFsICogLTEpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlID0gW107XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5zaGlmdGVkXHJcbiAgICAgICAgKiByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHdpdGggdGhlIHRvbmljIHNoaWZ0ZWQgYmFja1xyXG4gICAgICAgICogdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHdpdGggdGhlIHRvbmljIHNoaWZ0ZWQgYmFja1xyXG4gICAgICAgICogdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudW5zaGlmdGVkKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHVuc2hpZnRlZCgpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFRlbXBsYXRlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlO1xyXG4gICAgICAgICAgIHNjYWxlLnVuc2hpZnQoKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIGFtb3VudCB0aGF0IHRoZSBzY2FsZSBoYXMgc2hpZnRlZFxyXG4gICAgICAgICogKDAgaWYgbm90IHNoaWZ0ZWQpXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgYW1vdW50IHRoYXQgdGhlIHNjYWxlIGhhcyBzaGlmdGVkXHJcbiAgICAgICAgKiAoMCBpZiBub3Qgc2hpZnRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnRlZCgpKTsgLy8gMVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0ZWRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hpZnRlZEludGVydmFsO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTY2FsZSBtb2Rlc1xyXG4gICAgICAgICovXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBJb25pYW4obWFqb3IpIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuaW9uaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlvbmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuaW9uaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIERvcmlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRvcmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkb3JpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmRvcmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBQaHJ5Z2lhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnBocnlnaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHBocnlnaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5waHJ5Z2lhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBMeWRpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5seWRpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbHlkaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5seWRpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTWl4b2x5ZGlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm1peG9seWRpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWl4b2x5ZGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubWl4b2x5ZGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBBZW9saWFuKG1pbm9yKSBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmFlb2xpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYWVvbGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuYWVvbGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBMb2NyaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubG9jcmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBsb2NyaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5sb2NyaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyBzdHJpbmcgdmVyc2lvbiBvZiB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50b1N0cmluZygpKTsgLy8gJ0MnXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgbGV0IHNjYWxlTmFtZXMgPSBzY2FsZU5hbWVMb29rdXAodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgICAgIGlmICghc2NhbGVOYW1lcylcclxuICAgICAgICAgICAgICAgc2NhbGVOYW1lcyA9IHRoaXMuZ2V0Tm90ZU5hbWVzKCkuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgIHJldHVybiBgJHtTZW1pdG9uZSQxW3RoaXMuX2tleV19JHt0aGlzLl9vY3RhdmV9KCR7c2NhbGVOYW1lc30pYDtcclxuICAgICAgIH1cclxuICAgfVxyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gbG9va3VwIHRoZSBub3RlIG5hbWUgZm9yIGEgc2NhbGUgZWZmaWNpZW50bHlcclxuICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHNjYWxlIHRvIGxvb2t1cFxyXG4gICAgKiBAcGFyYW0gcHJlZmVyU2hhcnBLZXkgLSBpZiB0cnVlLCB3aWxsIHByZWZlciBzaGFycCBrZXlzIG92ZXIgZmxhdCBrZXlzXHJcbiAgICAqIEByZXR1cm5zIHRoZSBub3RlIG5hbWVzIGZvciB0aGUgc2NhbGVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzY2FsZU5vdGVOYW1lTG9va3VwID0gKHNjYWxlLCBwcmVmZXJTaGFycEtleSA9IHRydWUpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7c2NhbGUua2V5fS0ke3NjYWxlLm9jdGF2ZX0tJHtKU09OLnN0cmluZ2lmeShzY2FsZS50ZW1wbGF0ZSl9YDtcclxuICAgICAgICAgICBjb25zdCBub3RlcyA9IG5vdGVzTG9va3VwKGtleSk7XHJcbiAgICAgICAgICAgaWYgKG5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiBub3RlcztcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlcyA9IFsuLi5zY2FsZS5ub3Rlc107XHJcbiAgICAgICBub3RlcyA9IHNoaWZ0KG5vdGVzLCAtc2NhbGUuc2hpZnRlZEludGVydmFsKCkpOyAvL3Vuc2hpZnQgYmFjayB0byBrZXkgPSAwIGluZGV4XHJcbiAgICAgICBjb25zdCBub3Rlc1BhcnRzID0gbm90ZXMubWFwKChub3RlKSA9PiBub3RlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZXMgPSBub3Rlcy5tYXAoKG5vdGUpID0+IG5vdGUub2N0YXZlKTtcclxuICAgICAgIGNvbnN0IHJlbW92YWJsZXMgPSBbXCJCI1wiLCBcIkJzXCIsIFwiQ2JcIiwgXCJFI1wiLCBcIkVzXCIsIFwiRmJcIl07XHJcbiAgICAgICBjb25zdCBub3RlTmFtZXMgPSBbXTtcclxuICAgICAgIGZvciAoY29uc3QgW2ksIG5vdGVQYXJ0c10gb2Ygbm90ZXNQYXJ0cy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAvL3JlbW92ZSBDYiBCIyBldGNcclxuICAgICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2Ygbm90ZVBhcnRzKSB7XHJcbiAgICAgICAgICAgICAgIC8vIHJlbW92ZSBhbnkgbnVtYmVycyBmcm9tIHRoZSBub3RlIG5hbWUob2N0YXZlKVxyXG4gICAgICAgICAgICAgICAvLyBwYXJ0LnJlcGxhY2UoL1xcZC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgaWYgKHJlbW92YWJsZXMuaW5jbHVkZXMocGFydCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbm90ZU5hbWVzLmluZGV4T2YocGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICBub3RlTmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAobm90ZU5hbWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChwcmVmZXJTaGFycEtleSA/IG5vdGVQYXJ0c1swXSA6IG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0pO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKG5vdGVQYXJ0cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzWzBdKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IHdob2xlTm90ZXMgPSBbXHJcbiAgICAgICAgICAgICAgIFwiQVwiLFxyXG4gICAgICAgICAgICAgICBcIkJcIixcclxuICAgICAgICAgICAgICAgXCJDXCIsXHJcbiAgICAgICAgICAgICAgIFwiRFwiLFxyXG4gICAgICAgICAgICAgICBcIkVcIixcclxuICAgICAgICAgICAgICAgXCJGXCIsXHJcbiAgICAgICAgICAgICAgIFwiR1wiLFxyXG4gICAgICAgICAgICAgICBcIkFcIixcclxuICAgICAgICAgICAgICAgXCJCXCIsXHJcbiAgICAgICAgICAgICAgIFwiQ1wiLFxyXG4gICAgICAgICAgICAgICBcIkRcIixcclxuICAgICAgICAgICAgICAgXCJFXCIsXHJcbiAgICAgICAgICAgICAgIFwiRlwiLFxyXG4gICAgICAgICAgICAgICBcIkdcIixcclxuICAgICAgICAgICBdO1xyXG4gICAgICAgICAgIGNvbnN0IGxhc3RXaG9sZU5vdGUgPSBub3RlTmFtZXNbbm90ZU5hbWVzLmxlbmd0aCAtIDFdWzBdO1xyXG4gICAgICAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHdob2xlTm90ZXMuaW5kZXhPZihsYXN0V2hvbGVOb3RlKTtcclxuICAgICAgICAgICBjb25zdCBuZXh0Tm90ZSA9IHdob2xlTm90ZXNbbGFzdEluZGV4ICsgMV07XHJcbiAgICAgICAgICAgaWYgKG5vdGVQYXJ0c1swXS5pbmNsdWRlcyhuZXh0Tm90ZSkpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgaGFzT2N0YXZlID0gbm90ZVBhcnRzWzBdLm1hdGNoKC9cXGQvZyk7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1swXSArIChoYXNPY3RhdmUgPyBcIlwiIDogb2N0YXZlc1tpXSkpO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgaGFzT2N0YXZlID0gbm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXS5tYXRjaCgvXFxkL2cpO1xyXG4gICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0gKyAoaGFzT2N0YXZlID8gXCJcIiA6IG9jdGF2ZXNbaV0pKTtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IHNoaWZ0ZWROb3RlTmFtZXMgPSBzaGlmdChub3RlTmFtZXMsIHNjYWxlLnNoaWZ0ZWRJbnRlcnZhbCgpKTtcclxuICAgICAgIHJldHVybiBzaGlmdGVkTm90ZU5hbWVzO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlTm90ZXNMb29rdXBUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHNjYWxlVGFibGUgPSB7fTtcclxuICAgICAgIGZvciAobGV0IGl0b25lID0gVE9ORVNfTUlOOyBpdG9uZSA8IFRPTkVTX01JTiArIE9DVEFWRV9NQVg7IGl0b25lKyspIHtcclxuICAgICAgICAgICBmb3IgKGxldCBpb2N0YXZlID0gT0NUQVZFX01JTjsgaW9jdGF2ZSA8PSBPQ1RBVkVfTUFYOyBpb2N0YXZlKyspIHtcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiBPYmplY3QudmFsdWVzKFNjYWxlVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGtleTogaXRvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogaW9jdGF2ZSxcclxuICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtgJHtpdG9uZX0tJHtpb2N0YXZlfS0ke0pTT04uc3RyaW5naWZ5KHRlbXBsYXRlKX1gXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVOb3RlTmFtZUxvb2t1cChzY2FsZSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gc2NhbGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgdGhlIGxvb2t1cCB0YWJsZSBhcyBzb29uIGFzIHRoZSBtb2R1bGUgaXMgbG9hZGVkXHJcbiAgICAqL1xyXG4gICBsZXQgX25vdGVzTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVzTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZU5vdGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3Rlc0xvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICBjb25zdCBidWlsZFNjYWxlTm90ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9ub3Rlc0xvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9ub3Rlc0xvb2t1cDtcclxuICAgICAgIF9ub3Rlc0xvb2t1cCA9IGNyZWF0ZU5vdGVzTG9va3VwVGFibGUoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVzTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgc2NhbGUgbm90ZSB0YWJsZVwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZXNMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTaG9ydGN1dCBmb3IgbW9kaWZpZXJzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgZmxhdCA9IC0xO1xyXG4gICBjb25zdCBmbGF0X2ZsYXQgPSAtMjtcclxuICAgY29uc3Qgc2hhcnAgPSAxO1xyXG4gICAvKipcclxuICAgICogQ2hvcmQgdGVtcGxhdGVzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgQ2hvcmRUZW1wbGF0ZXMgPSB7XHJcbiAgICAgICBtYWo6IFsxLCAzLCA1XSxcclxuICAgICAgIG1hajQ6IFsxLCAzLCA0LCA1XSxcclxuICAgICAgIG1hajY6IFsxLCAzLCA1LCA2XSxcclxuICAgICAgIG1hajY5OiBbMSwgMywgNSwgNiwgOV0sXHJcbiAgICAgICBtYWo3OiBbMSwgMywgNSwgN10sXHJcbiAgICAgICBtYWo5OiBbMSwgMywgNSwgNywgOV0sXHJcbiAgICAgICBtYWoxMTogWzEsIDMsIDUsIDcsIDksIDExXSxcclxuICAgICAgIG1hajEzOiBbMSwgMywgNSwgNywgOSwgMTEsIDEzXSxcclxuICAgICAgIG1hajdzMTE6IFsxLCAzLCA1LCA3LCBbMTEsIHNoYXJwXV0sXHJcbiAgICAgICBtYWpiNTogWzEsIDMsIFs1LCBmbGF0XV0sXHJcbiAgICAgICBtaW46IFsxLCBbMywgZmxhdF0sIDVdLFxyXG4gICAgICAgbWluNDogWzEsIFszLCBmbGF0XSwgNCwgNV0sXHJcbiAgICAgICBtaW42OiBbMSwgWzMsIGZsYXRdLCA1LCA2XSxcclxuICAgICAgIG1pbjc6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XV0sXHJcbiAgICAgICBtaW5BZGQ5OiBbMSwgWzMsIGZsYXRdLCA1LCA5XSxcclxuICAgICAgIG1pbjY5OiBbMSwgWzMsIGZsYXRdLCA1LCA2LCA5XSxcclxuICAgICAgIG1pbjk6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBtaW4xMTogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5LCAxMV0sXHJcbiAgICAgICBtaW4xMzogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5LCAxMSwgMTNdLFxyXG4gICAgICAgbWluN2I1OiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203OiBbMSwgMywgNSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgZG9tMTE6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDksIDExXSxcclxuICAgICAgIGRvbTEzOiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5LCAxMSwgMTNdLFxyXG4gICAgICAgZG9tN3M1OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTdiNTogWzEsIDMsIFs1LCBmbGF0XSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTdiOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzksIGZsYXRdXSxcclxuICAgICAgIGRvbTdzOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzksIHNoYXJwXV0sXHJcbiAgICAgICBkb205czU6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgZG9tOWI1OiBbMSwgMywgWzUsIGZsYXRdLCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgZG9tN3M1czk6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF0sIFs5LCBzaGFycF1dLFxyXG4gICAgICAgZG9tN3M1Yjk6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF0sIFs5LCBmbGF0XV0sXHJcbiAgICAgICBkb203czExOiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbMTEsIHNoYXJwXV0sXHJcbiAgICAgICBkaW06IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XV0sXHJcbiAgICAgICBkaW03OiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF0sIFs3LCBmbGF0X2ZsYXRdXSxcclxuICAgICAgIGF1ZzogWzEsIDMsIFs1LCBzaGFycF1dLFxyXG4gICAgICAgc3VzMjogWzEsIDIsIDVdLFxyXG4gICAgICAgc3VzNDogWzEsIFs0LCBmbGF0XSwgNV0sXHJcbiAgICAgICBmaWZ0aDogWzEsIDVdLFxyXG4gICAgICAgYjU6IFsxLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgczExOiBbMSwgNSwgWzExLCBzaGFycF1dLFxyXG4gICB9O1xyXG4gICBPYmplY3Qua2V5cyhDaG9yZFRlbXBsYXRlcykuZm9yRWFjaCgoZWxlbWVudCkgPT4gT2JqZWN0LmZyZWV6ZShDaG9yZFRlbXBsYXRlc1tlbGVtZW50XSkpO1xuXG4gICBjb25zdCBERUZBVUxUX0NIT1JEX1RFTVBMQVRFID0gWzEsIDMsIDVdO1xyXG4gICBjb25zdCBERUZBVUxUX1NDQUxFID0gbmV3IFNjYWxlKCk7XG5cbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlTG9va3VwLmpzb25cIjtcclxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICBjb25zdCBuYW1lUmVnZXggPSAvKFtBLUddKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4ID0gLygjfHN8YikoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXggPSAvKFswLTldKykoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3QgY2hvcmROYW1lUmVnZXggPSAvKG1pbnxtYWp8ZGltfGF1ZykoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3QgYWRkaXRpb25zUmVnZXggPSAvKFsjfHN8Yl0/WzAtOV0rKSg/IVteKF0qXFwpKS9nO1xyXG4gICAvKipcclxuICAgICogQHBhcmFtIGNob3JkIHRoZSBzdHJpbmcgdG8gcGFyc2VcclxuICAgICogQHJldHVybnMgYSB2YWxpZCBDaG9yZEluaXRpYWxpemVyXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VDaG9yZCA9IChjaG9yZCkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjaG9yZExvb2t1cChjaG9yZCk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGxldCBjaG9yZE5hbWUgPSBcIm1halwiO1xyXG4gICAgICAgbGV0IGFkZGl0aW9ucyA9IFtdO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gY2hvcmQubWF0Y2gobmFtZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG1vZGlmaWVyTWF0Y2ggPSBjaG9yZC5tYXRjaChtb2RpZmllclJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gY2hvcmQubWF0Y2gob2N0YXZlUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgY2hvcmROYW1lTWF0Y2ggPSBjaG9yZC5tYXRjaChjaG9yZE5hbWVSZWdleCk/LmpvaW4oXCJcIik7XHJcbiAgICAgICBjb25zdCBhZGRpdGlvbnNNYXRjaCA9IGNob3JkLm1hdGNoKGFkZGl0aW9uc1JlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChjaG9yZE5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIC8vIGNvbnN0IFtuYW1lXSA9IGNob3JkTmFtZU1hdGNoO1xyXG4gICAgICAgICAgIGNob3JkTmFtZSA9IGNob3JkTmFtZU1hdGNoO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGFkZGl0aW9uc01hdGNoKSB7XHJcbiAgICAgICAgICAgYWRkaXRpb25zID0gYWRkaXRpb25zTWF0Y2g7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBpbnRlcnZhbHMgPSBbXTtcclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICBpbnRlcnZhbHMucHVzaCguLi5DaG9yZFRlbXBsYXRlc1tjaG9yZE5hbWVdKTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGl0aW9uIG9mIGFkZGl0aW9ucykge1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kID0gMDtcclxuICAgICAgICAgICAgICAgaWYgKGFkZGl0aW9uWzBdID09PSBcIiNcIiB8fCBhZGRpdGlvblswXSA9PT0gXCJzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIGlmIChhZGRpdGlvblswXSA9PT0gXCJiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgYWRkaXRpb25zLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgYWRkaXRpb25OdW0gPSBwYXJzZUludChhZGRpdGlvbiwgMTApO1xyXG4gICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWxzLmluY2x1ZGVzKGFkZGl0aW9uTnVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpbnRlcnZhbHMuaW5kZXhPZihhZGRpdGlvbk51bSk7XHJcbiAgICAgICAgICAgICAgICAgICBpbnRlcnZhbHNbaW5kZXhdID0gW2FkZGl0aW9uTnVtLCBtb2RdO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxzLnB1c2goW2FkZGl0aW9uTnVtLCBtb2RdKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICByb290OiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBpbnRlcnZhbHMsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY2hvcmQgbmFtZVwiKTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIEByZXR1cm5zIGEgbG9va3VwIHRhYmxlIG9mIGNob3JkIG5hbWVzIGFuZCB0aGVpciBpbml0aWFsaXplcnNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgY29uc3QgcXVhbGl0aWVzID0gW1wibWFqXCIsIFwibWluXCIsIFwiZGltXCIsIFwiYXVnXCIsIFwic3VzXCJdO1xyXG4gICAgICAgY29uc3QgYWRkaXRpb25zID0gW1xyXG4gICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgXCIyXCIsXHJcbiAgICAgICAgICAgXCIzXCIsXHJcbiAgICAgICAgICAgXCI0XCIsXHJcbiAgICAgICAgICAgXCI1XCIsXHJcbiAgICAgICAgICAgXCI2XCIsXHJcbiAgICAgICAgICAgXCI3XCIsXHJcbiAgICAgICAgICAgXCI5XCIsXHJcbiAgICAgICAgICAgXCIxMVwiLFxyXG4gICAgICAgICAgIFwiMTNcIixcclxuICAgICAgICAgICBcImIyXCIsXHJcbiAgICAgICAgICAgXCJiM1wiLFxyXG4gICAgICAgICAgIFwiYjRcIixcclxuICAgICAgICAgICBcImI1XCIsXHJcbiAgICAgICAgICAgXCJiNlwiLFxyXG4gICAgICAgICAgIFwiYjdcIixcclxuICAgICAgICAgICBcImI5XCIsXHJcbiAgICAgICAgICAgXCJiMTFcIixcclxuICAgICAgICAgICBcImIxM1wiLFxyXG4gICAgICAgICAgIFwiczJcIixcclxuICAgICAgICAgICBcInMzXCIsXHJcbiAgICAgICAgICAgXCJzNFwiLFxyXG4gICAgICAgICAgIFwiczVcIixcclxuICAgICAgICAgICBcInM2XCIsXHJcbiAgICAgICAgICAgXCJzN1wiLFxyXG4gICAgICAgICAgIFwiczlcIixcclxuICAgICAgICAgICBcInMxMVwiLFxyXG4gICAgICAgICAgIFwiczEzXCIsXHJcbiAgICAgICAgICAgXCIjMlwiLFxyXG4gICAgICAgICAgIFwiIzNcIixcclxuICAgICAgICAgICBcIiM0XCIsXHJcbiAgICAgICAgICAgXCIjNVwiLFxyXG4gICAgICAgICAgIFwiIzZcIixcclxuICAgICAgICAgICBcIiM3XCIsXHJcbiAgICAgICAgICAgXCIjOVwiLFxyXG4gICAgICAgICAgIFwiIzExXCIsXHJcbiAgICAgICAgICAgXCIjMTNcIixcclxuICAgICAgICAgICBcIjdzMTFcIixcclxuICAgICAgICAgICBcIjcjMTFcIixcclxuICAgICAgICAgICBcIjdiOVwiLFxyXG4gICAgICAgICAgIFwiNyM5XCIsXHJcbiAgICAgICAgICAgXCI3YjVcIixcclxuICAgICAgICAgICBcIjcjNVwiLFxyXG4gICAgICAgICAgIFwiN2I5YjVcIixcclxuICAgICAgICAgICBcIjcjOSM1XCIsXHJcbiAgICAgICAgICAgXCI3YjEzXCIsXHJcbiAgICAgICAgICAgXCI3IzEzXCIsXHJcbiAgICAgICAgICAgXCI5IzVcIixcclxuICAgICAgICAgICBcIjliNVwiLFxyXG4gICAgICAgICAgIFwiOSMxMVwiLFxyXG4gICAgICAgICAgIFwiOWIxMVwiLFxyXG4gICAgICAgICAgIFwiOSMxM1wiLFxyXG4gICAgICAgICAgIFwiOWIxM1wiLFxyXG4gICAgICAgICAgIFwiMTEjNVwiLFxyXG4gICAgICAgICAgIFwiMTFiNVwiLFxyXG4gICAgICAgICAgIFwiMTEjOVwiLFxyXG4gICAgICAgICAgIFwiMTFiOVwiLFxyXG4gICAgICAgICAgIFwiMTEjMTNcIixcclxuICAgICAgICAgICBcIjExYjEzXCIsXHJcbiAgICAgICBdO1xyXG4gICAgICAgZm9yIChjb25zdCBxdWFsaXR5IG9mIHF1YWxpdGllcykge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgYWRkaXRpb24gb2YgYWRkaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZUxldHRlciBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlTW9kaWZpZXIgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSR7bm90ZU1vZGlmaWVyfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IE9DVEFWRV9NSU47IGkgPD0gT0NUQVZFX01BWDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSR7bm90ZU1vZGlmaWVyfSR7aX0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGxldCBfY2hvcmRMb29rdXAgPSB7fTtcclxuICAgLyoqXHJcbiAgICAqIEBwYXJhbSBrZXkgdGhlIHN0cmluZyB0byBsb29rdXBcclxuICAgICogQHJldHVybnMgYSB2YWxpZCBjaG9yZCBpbml0aWFsaXplclxyXG4gICAgKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBrZXkgaXMgbm90IGEgdmFsaWQgY2hvcmRcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjaG9yZExvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkQ2hvcmRUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9jaG9yZExvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfSk7XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSB0YWJsZSBhcyB7IFtrZXk6IHN0cmluZ106IENob3JkSW5pdGlhbGl6ZXIgfTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZENob3JkVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX2Nob3JkTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX2Nob3JkTG9va3VwO1xyXG4gICAgICAgX2Nob3JkTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX2Nob3JkTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgY2hvcmQgdGFibGVcIik7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3QuZW50cmllcyhfY2hvcmRMb29rdXApLmxlbmd0aCk7XHJcbiAgICAgICByZXR1cm4gX2Nob3JkTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogQ2hvcmRzIGNvbnNpc3Qgb2YgYSByb290IG5vdGUsIG9jdGF2ZSwgY2hvcmQgdGVtcGxhdGUsIGFuZCBhIGJhc2Ugc2NhbGUuPGJyPjxicj5cclxuICAgICogVGhlIGNob3JkIHRlbXBsYXRlIGlzIGFuIGFycmF5IG9mIGludGVnZXJzLCBlYWNoIGludGVnZXIgcmVwcmVzZW50aW5nPGJyPlxyXG4gICAgKiAgYSBzY2FsZSBkZWdyZWUgZnJvbSB0aGUgYmFzZSBzY2FsZShkZWZhdWx0cyB0byBtYWpvcikuPGJyPlxyXG4gICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSBpcyB0aGUgSSxJSUksViBkZW5vdGVkIGFzIFsxLDMsNV08YnI+XHJcbiAgICAqIENob3JkSW50ZXJ2YWxzIHVzZWQgaW4gdGVtcGxhdGVzIGNhbiBhbHNvIGNvbnRhaW4gYSBtb2RpZmllciw8YnI+XHJcbiAgICAqIGZvciBhIHBhcnRpY3VsYXIgc2NhbGUgZGVncmVlLCBzdWNoIGFzIFsxLDMsWzUsIC0xXV08YnI+XHJcbiAgICAqIHdoZXJlIC0xIGlzIGZsYXQsIDAgaXMgbmF0dXJhbCwgYW5kIDEgaXMgc2hhcnAuPGJyPlxyXG4gICAgKiBJdCBjb3VsZCBhbHNvIGJlIHdyaXR0ZW4gYXMgWzEsMyxbNSwgbW9kaWZpZXIuZmxhdF1dPGJyPlxyXG4gICAgKiBpZiB5b3UgaW1wb3J0IG1vZGlmaWVyLlxyXG4gICAgKlxyXG4gICAgKiBUaGUgZm9sbG93aW5nIHByZWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6PGJyPlxyXG4gICAgKiA8dGFibGU+XHJcbiAgICAqIDx0cj5cclxuICAgICogPHRkPm1hajwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo0PC90ZD5cclxuICAgICogPHRkPm1hajY8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1hajc8L3RkPlxyXG4gICAgKiA8dGQ+bWFqOTwvdGQ+XHJcbiAgICAqIDx0ZD5tYWoxMTwvdGQ+XHJcbiAgICAqIDx0ZD5tYWoxMzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqN3MxMTwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpiNTwvdGQ+XHJcbiAgICAqIDx0ZD5taW48L3RkPlxyXG4gICAgKiA8dGQ+bWluNDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWluNjwvdGQ+XHJcbiAgICAqIDx0ZD5taW43PC90ZD5cclxuICAgICogPHRkPm1pbkFkZDk8L3RkPlxyXG4gICAgKiA8dGQ+bWluNjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbjk8L3RkPlxyXG4gICAgKiA8dGQ+bWluMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWluMTM8L3RkPlxyXG4gICAgKiA8dGQ+bWluN2I1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203PC90ZD5cclxuICAgICogPHRkPmRvbTk8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tMTE8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tMTM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTdzNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203YjU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3M5PC90ZD5cclxuICAgICogPHRkPmRvbTdiOTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tOWI1PC90ZD5cclxuICAgICogPHRkPmRvbTlzNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czExPC90ZD5cclxuICAgICogPHRkPmRvbTdzNXM5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203czViOTwvdGQ+XHJcbiAgICAqIDx0ZD5kaW08L3RkPlxyXG4gICAgKiA8dGQ+ZGltNzwvdGQ+XHJcbiAgICAqIDx0ZD5hdWc8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnN1czI8L3RkPlxyXG4gICAgKiA8dGQ+c3VzNDwvdGQ+XHJcbiAgICAqIDx0ZD5maWZ0aDwvdGQ+XHJcbiAgICAqIDx0ZD5iNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+czExPC90ZD5cclxuICAgICogPC90cj5cclxuICAgICogPC90YWJsZT5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBDaG9yZCB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRUZW1wbGF0ZX0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZEludGVydmFsfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge01vZGlmaWVyfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkSW5pdGlhbGl6ZXJ9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7Ly8gVHlwZXNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIENob3JkIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7IENob3JkLCBDaG9yZFRlbXBsYXRlcywgTW9kaWZpZXIgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vY3JlYXRlcyBhIGNob3JkIHdpdGggdGhlIGRlZmF1bHQoMSwzLDUpIHRlbXBsYXRlLCByb290IG9mIEMsIGluIHRoZSA0dGggb2N0YXZlXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBjaG9yZCB3aXRoIHRoZSBwcmUtZGVmaW5lZCBkaW1pbmlzaGVkIHRlbXBsYXRlLCByb290IG9mIEViLCBpbiB0aGUgNXRoIG9jdGF2ZVxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoe3Jvb3Q6IDMsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IENob3JkVGVtcGxhdGVzLmRpbX0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogKHJvb3Qtbm90ZS1uYW1lW3MsIyxiXVtvY3RhdmVdKVtjaG9yZC10ZW1wbGF0ZS1uYW1lfFtjaG9yZC1xdWFsaXR5XVttb2RpZmllcnNdXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIGNob3JkIGZyb20gYSBzdHJpbmdcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCcoRDQpbWluNCcpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLkRFRkFVTFRfQ0hPUkRfVEVNUExBVEVdO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlQ2hvcmQodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uKHBhcnNlZD8udGVtcGxhdGUgPz8gREVGQVVMVF9DSE9SRF9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHBhcnNlZD8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSBwYXJzZWQ/LnJvb3QgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLih2YWx1ZXMudGVtcGxhdGUgPz8gREVGQVVMVF9DSE9SRF9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHZhbHVlcy5yb290ID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZSA9IG5ldyBTY2FsZSh7IGtleTogdGhpcy5fcm9vdCwgb2N0YXZlOiB0aGlzLl9vY3RhdmUgfSk7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pZCk7IC8vIGhhbDg5MzRobGxcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByb290XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9yb290ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5yb290KTsgLy8gMChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgcm9vdCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2V0dGluZyB0aGUgcm9vdCB0byBhIHZhbHVlIG91dHNpZGUgb2YgdGhlIHJhbmdlIFswLCAxMV0oc2VtaXRvbmUpIHdpbGw8YnIvPlxyXG4gICAgICAgICogd3JhcCB0aGUgc2VtaXRvbmUgdG8gdGhlIHJhbmdlIFswLCAxMV0gYW5kIGNoYW5nZSB0aGUgb2N0YXZlIGRlcGVuZGluZzxici8+XHJcbiAgICAgICAgKiBvbiBob3cgbWFueSB0aW1lcyB0aGUgc2VtaXRvbmUgaGFzIGJlZW4gd3JhcHBlZC5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQucm9vdCA9IDQ7IC8vIHNldHMgdGhlIHJvb3QgdG8gNHRoIHNlbWl0b25lKEUpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5yb290KTsgLy8gNChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgcm9vdCh2YWx1ZSkge1xyXG4gICAgICAgICAgIC8vIHRoaXMuX3Jvb3QgPSB2YWx1ZTtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcCh2YWx1ZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX3Jvb3QgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IHRoaXMuX29jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGJhc2Ugc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX2Jhc2VTY2FsZSA9IERFRkFVTFRfU0NBTEU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuYmFzZVNjYWxlKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IHNjYWxlKG1ham9yKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBiYXNlU2NhbGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VTY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTm90IGEgbG90IG9mIGdvb2QgcmVhc29ucyB0byBjaGFuZ2UgdGhpcyBleGNlcHQgZm9yIGV4cGVyaW1lbnRhdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5iYXNlU2NhbGUgPSBuZXcgU2NhbGUoeyBrZXk6IDMsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIDVdIH0pO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuYmFzZVNjYWxlKTsgLy8gcHJpbnRzIHRoZSBtaW5vciBzY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBiYXNlU2NhbGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUgPSB2YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUub2N0YXZlID0gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQub2N0YXZlKTsgLy8gNChvY3RhdmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm9jdGF2ZSA9IDU7IC8vIHNldHMgdGhlIG9jdGF2ZSB0byA1dGhcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm9jdGF2ZSk7IC8vIDUob2N0YXZlKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcCh2YWx1ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlLm9jdGF2ZSA9IHRoaXMuX29jdGF2ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdGVtcGxhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgdGVtcGxhdGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIFsuLi50aGlzLl90ZW1wbGF0ZV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBmb2xsb3dpbmcgcHJlZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTo8YnI+XHJcbiAgICAgICAgKiA8dGFibGU+XHJcbiAgICAgICAgKiA8dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo0PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo2PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo2OTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo3PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWo5PC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWoxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqMTM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqN3MxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqYjU8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5taW42PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW43PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5BZGQ5PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW42OTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5taW45PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW4xMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluMTM8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjdiNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb205PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb20xMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tMTM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203YjU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN2I5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTliNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOXM1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czExPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czVzOTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203czViOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZGltPC90ZD5cclxuICAgICAgICAqIDx0ZD5kaW03PC90ZD5cclxuICAgICAgICAqIDx0ZD5hdWc8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+c3VzMjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3VzNDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZmlmdGg8L3RkPlxyXG4gICAgICAgICogPHRkPmI1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnMxMTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPlxyXG4gICAgICAgICogPC90YWJsZT5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQudGVtcGxhdGUgPSBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCA1XTsgLy8gc2V0cyB0aGUgdGVtcGxhdGUgdG8gYSBtaW5vciBjaG9yZFxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBwcmludHMgdGhlIG5ldyB0ZW1wbGF0ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLnZhbHVlXTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbm90ZXNcclxuICAgICAgICAqIG5vdGVzIGFyZSBnZW5lcmF0ZWQgYW5kIGNhY2hlZCBhcyBuZWVkZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgX25vdGVzID0gW107XHJcbiAgICAgICBfbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHdpbGwgZ2VuZXJhdGUgbm90ZXMgaWYgbmVlZGVkIG9yIHJldHVybiB0aGUgY2FjaGVkIG5vdGVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm5vdGVzKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IG5vdGVzXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG5vdGVzKCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9ub3Rlc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOb3RlcygpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZ2VuZXJhdGUgbm90ZXMoaW50ZXJuYWwpXHJcbiAgICAgICAgKiBnZW5lcmF0ZXMgdGhlIG5vdGVzIGZvciB0aGlzIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdlbmVyYXRlTm90ZXMoKSB7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXMgPSBbXTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGxldCB0b25lID0gMDtcclxuICAgICAgICAgICAgICAgbGV0IG1vZCA9IDA7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgdG9uZSA9IGludGVydmFsWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gaW50ZXJ2YWxbMV07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICB0b25lID0gaW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdG9uZTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMuX2Jhc2VTY2FsZS5kZWdyZWUob2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZVRvbmUgPSBub3RlLnNlbWl0b25lO1xyXG4gICAgICAgICAgICAgICBub3RlLnNlbWl0b25lID0gbm90ZVRvbmUgKyBtb2Q7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzLnB1c2gobm90ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIG5vdGUgbmFtZXMgLT4gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0Tm90ZU5hbWVzKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGVOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiB0aGlzLm5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBub3RlTmFtZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgQ2hvcmQoe1xyXG4gICAgICAgICAgICAgICByb290OiB0aGlzLnJvb3QsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBbLi4udGhpcy5fdGVtcGxhdGVdLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gb3RoZXIgdGhlIG90aGVyIGNob3JkIHRvIGNvbXBhcmUgdG9cclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHR3byBjaG9yZHMgYXJlIGVxdWFsXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuICh0aGlzLnJvb3QgPT09IG90aGVyLnJvb3QgJiZcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPT09IG90aGVyLm9jdGF2ZSAmJlxyXG4gICAgICAgICAgICAgICBpc0VxdWFsKHRoaXMuX3RlbXBsYXRlLCBvdGhlci50ZW1wbGF0ZSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBtdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBuYXRydWFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY2hvcmQubWFqb3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1ham9yKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKDMpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gMztcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIG5hdHVyYWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQubWFqb3JlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtYWpvcmVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5tYWpvcigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBuYXR1cmFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01ham9yKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNNYWpvcigpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIG11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLFszLC0xXSw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1pbm9yKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFszLCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzMsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5taW5vcmVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsWzMsLTFdLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWlub3JlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkubWlub3IoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNaW5vcigpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01pbm9yKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNNaW5vcigpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBzaGFycCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuYXVnbWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLnNoYXJwXV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhdWdtZW50KCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs1LCAxXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNSwgMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBzaGFycCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmF1Z21lbnRlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuc2hhcnBdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGF1Z21lbnRlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuYXVnbWVudCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBzaGFycCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNBdWdtZW50ZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5hdWdtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0F1Z21lbnRlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzQXVnbWVudGVkKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuZGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkaW1pbmlzaCgpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNSwgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs1LCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuZGltaW5pc2hlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuZGltaW5pc2goKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNEaW1pbmlzaGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuZGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzRGltaW5pc2hlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5oYWxmRGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIFszLCBNb2RpZmllci5mbGF0XSwgWzUsIE1vZGlmaWVyLmZsYXRdLCBbNywgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKlxyXG4gICAgICAgICovXHJcbiAgICAgICBoYWxmRGltaW5pc2goKSB7XHJcbiAgICAgICAgICAgdGhpcy5taW5vcigpOyAvLyBnZXQgZmxhdCAzcmRcclxuICAgICAgICAgICB0aGlzLmRpbWluaXNoKCk7IC8vIGdldCBmbGF0IDV0aFxyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs3LCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzcsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5oYWxmRGltaW5pc2hlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF0sIFs3LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqL1xyXG4gICAgICAgaGFsZkRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0hhbGZEaW1pbmlzaGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0hhbGZEaW1pbmlzaGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzSGFsZkRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgbGV0IHRoaXJkID0gZmFsc2U7XHJcbiAgICAgICAgICAgbGV0IGZpZnRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgbGV0IHNldmVudGggPSBmYWxzZTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgc2V2ZW50aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGZpZnRoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMyAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlyZCAmJiBmaWZ0aCAmJiBzZXZlbnRoO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggd2l0aCB0aGUgZmlyc3Qgbm90ZSBtb3ZlZCB0byB0aGUgZW5kIHVwIG9uZSBvY3RhdmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogY2hvcmQuaW52ZXJ0KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFszLDUsMV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydFNCcsICdHNCcsICdDNSddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW52ZXJ0KCkge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3RlbXBsYXRlWzBdKTtcclxuICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl90ZW1wbGF0ZVswXSkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbMF1bMF0gKz0gdGhpcy5fYmFzZVNjYWxlLnRlbXBsYXRlLmxlbmd0aDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlWzBdICs9IHRoaXMuX2Jhc2VTY2FsZS50ZW1wbGF0ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIHRoaXMuX3RlbXBsYXRlLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gbmV3VGVtcGxhdGU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCB3aXRoIHRoZSBmaXJzdCBub3RlIG1vdmVkIHRvIHRoZSBlbmQgdXAgb25lIG9jdGF2ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuaW52ZXJ0ZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMyw1LDFdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LmdldE5vdGVOYW1lcygpKTsgLy8gWydFNCcsICdHNCcsICdDNSddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW52ZXJ0ZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmludmVydCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgc3RyaW5nIGZvcm0gb2YgdGhlIGNob3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRvU3RyaW5nKCkpOyAvLyAnKEM0KW1haidcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoQ2hvcmRUZW1wbGF0ZXMpO1xyXG4gICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoQ2hvcmRUZW1wbGF0ZXMpLm1hcCgodGVtcGxhdGUpID0+IEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgY29uc3QgaW5kZXggPSB2YWx1ZXMuaW5kZXhPZihKU09OLnN0cmluZ2lmeSh0aGlzLl90ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGNvbnN0IHByZWZpeCA9IGAoJHtTZW1pdG9uZSQxW3RoaXMuX3Jvb3RdfSR7dGhpcy5fb2N0YXZlfSlgO1xyXG4gICAgICAgICAgIGNvbnN0IHN0ciA9IGluZGV4ID4gLTEgPyBwcmVmaXggKyBrZXlzW2luZGV4XSA6IHRoaXMuZ2V0Tm90ZU5hbWVzKCkuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogQnVpbGRzIGxvb2t1cCB0YWJsZXMgZm9yIG1vcmUgcGVyZm9ybWFudCBzdHJpbmcgcGFyc2luZy48YnIvPlxyXG4gICAgKiBTaG91bGQgb25seShvcHRpb25hbGx5KSBiZSBjYWxsZWQgb25jZSBzb29uIGFmdGVyIHRoZSBsaWJyYXJ5IGlzIGxvYWRlZCBhbmQ8YnIvPlxyXG4gICAgKiBvbmx5IGlmIHlvdSBhcmUgdXNpbmcgc3RyaW5nIGluaXRpYWxpemVycy5cclxuICAgICovXHJcbiAgIGNvbnN0IGJ1aWxkVGFibGVzID0gKCkgPT4ge1xyXG4gICAgICAgYnVpbGROb3RlVGFibGUoKTtcclxuICAgICAgIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVOb3RlVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVOYW1lVGFibGUoKTtcclxuICAgICAgIGJ1aWxkQ2hvcmRUYWJsZSgpO1xyXG4gICB9O1xuXG4gICBleHBvcnRzLkNob3JkID0gQ2hvcmQ7XG4gICBleHBvcnRzLkNob3JkVGVtcGxhdGVzID0gQ2hvcmRUZW1wbGF0ZXM7XG4gICBleHBvcnRzLkluc3RydW1lbnQgPSBJbnN0cnVtZW50O1xuICAgZXhwb3J0cy5Nb2RpZmllciA9IE1vZGlmaWVyJDE7XG4gICBleHBvcnRzLk5vdGUgPSBOb3RlO1xuICAgZXhwb3J0cy5TY2FsZSA9IFNjYWxlO1xuICAgZXhwb3J0cy5TY2FsZVRlbXBsYXRlcyA9IFNjYWxlVGVtcGxhdGVzO1xuICAgZXhwb3J0cy5TZW1pdG9uZSA9IFNlbWl0b25lJDE7XG4gICBleHBvcnRzLmJ1aWxkVGFibGVzID0gYnVpbGRUYWJsZXM7XG5cbiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKTtcbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlLCBTY2FsZVRlbXBsYXRlcyB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgRGl2aXNpb25lZFJpY2hub3RlcywgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi91dGlsc1wiXG5cblxudHlwZSBMaWdodFNjYWxlID0ge1xuICAgIGtleTogbnVtYmVyLFxuICAgIHRlbXBsYXRlU2x1Zzogc3RyaW5nLFxuICAgIHNlbWl0b25lczogbnVtYmVyW10sXG59O1xuXG5cbmNvbnN0IHNjYWxlc0Zvck5vdGVzID0gKG5vdGVzOiBOb3RlW10sIHBhcmFtczogTXVzaWNQYXJhbXMpOiBTY2FsZVtdID0+IHtcbiAgICBjb25zdCBzY2FsZXMgPSBuZXcgU2V0PExpZ2h0U2NhbGU+KClcbiAgICAvLyBGaXJzdCBhZGQgYWxsIHNjYWxlc1xuICAgIGZvciAoY29uc3Qgc2NhbGVTbHVnIGluIHBhcmFtcy5zY2FsZVNldHRpbmdzKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gcGFyYW1zLnNjYWxlU2V0dGluZ3Nbc2NhbGVTbHVnXTtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHNlbWl0b25lPTA7IHNlbWl0b25lIDwgMTI7IHNlbWl0b25lKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7a2V5OiBzZW1pdG9uZSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzW3NjYWxlU2x1Z119KVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbWl0b25lcyA9IHNjYWxlLm5vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKHNjYWxlLmtleSAtIDEgKyAyNCkgJSAxMjtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbWl0b25lcy5pbmNsdWRlcyhsZWFkaW5nVG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmVzLnB1c2gobGVhZGluZ1RvbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY2FsZXMuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBzZW1pdG9uZSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVTbHVnOiBzY2FsZVNsdWcsXG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lczogc2VtaXRvbmVzLFxuICAgICAgICAgICAgICAgIH0gYXMgTGlnaHRTY2FsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gbm90ZS5zZW1pdG9uZVxuICAgICAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIHNjYWxlcykge1xuICAgICAgICAgICAgaWYgKCFzY2FsZS5zZW1pdG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgc2NhbGVzLmRlbGV0ZShzY2FsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2NhbGUgb2Ygc2NhbGVzKSB7XG4gICAgICAgIHJldC5wdXNoKG5ldyBTY2FsZSh7a2V5OiBzY2FsZS5rZXksIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlc1tzY2FsZS50ZW1wbGF0ZVNsdWddfSkpXG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cblxuZXhwb3J0IGNvbnN0IGdldEF2YWlsYWJsZVNjYWxlcyA9ICh2YWx1ZXM6IHtcbiAgICBsYXRlc3REaXZpc2lvbjogbnVtYmVyLFxuICAgIGRpdmlzaW9uZWRSaWNoTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsXG4gICAgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICByYW5kb21Ob3RlczogQXJyYXk8Tm90ZT4sXG4gICAgbG9nZ2VyOiBMb2dnZXIsXG59KTogQXJyYXk8e1xuICAgIHNjYWxlOiBTY2FsZSxcbiAgICB0ZW5zaW9uOiBudW1iZXIsXG59PiA9PiB7XG4gICAgY29uc3Qge2xhdGVzdERpdmlzaW9uLCBkaXZpc2lvbmVkUmljaE5vdGVzLCBwYXJhbXMsIHJhbmRvbU5vdGVzLCBsb2dnZXJ9ID0gdmFsdWVzO1xuICAgIC8vIEdpdmVuIGEgbmV3IGNob3JkLCBmaW5kIGF2YWlsYWJsZSBzY2FsZXMgYmFzZSBvbiB0aGUgcHJldmlvdXMgbm90ZXNcbiAgICBjb25zdCBjdXJyZW50QXZhaWxhYmxlU2NhbGVzID0gc2NhbGVzRm9yTm90ZXMocmFuZG9tTm90ZXMsIHBhcmFtcylcblxuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2NhbGUgb2YgY3VycmVudEF2YWlsYWJsZVNjYWxlcykge1xuICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgIHRlbnNpb246IDAsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbG9nZ2VyLmxvZyhcImN1cnJlbnRBdmFpbGFibGVTY2FsZXNcIiwgY3VycmVudEF2YWlsYWJsZVNjYWxlcylcblxuICAgIC8vIEdvIGJhY2sgYSBmZXcgY2hvcmRzIGFuZCBmaW5kIHRoZSBzY2FsZXMgdGhhdCBhcmUgYXZhaWxhYmxlLlxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRpdmlzaW9uID0gbGF0ZXN0RGl2aXNpb24gLSAoaSAqIEJFQVRfTEVOR1RIKVxuICAgICAgICBpZiAoIWRpdmlzaW9uZWRSaWNoTm90ZXNbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3RlcyA9IGRpdmlzaW9uZWRSaWNoTm90ZXNbZGl2aXNpb25dLm1hcChyaWNoTm90ZSA9PiByaWNoTm90ZS5ub3RlKVxuICAgICAgICBjb25zdCBhdmFpbGFibGVTY2FsZXMgPSBzY2FsZXNGb3JOb3Rlcyhub3RlcywgcGFyYW1zKVxuICAgICAgICBmb3IgKGNvbnN0IHBvdGVudGlhbFNjYWxlIG9mIHJldCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhdmFpbGFibGVTY2FsZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5lcXVhbHMocG90ZW50aWFsU2NhbGUuc2NhbGUpKVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gU2NhbGUgd2Fzbid0IGF2YWlsYWJsZSwgaW5jcmVhc2UgdGVuc2lvblxuICAgICAgICAgICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSAyMCAgLy8gQmFzZSBvZiBob3cgbG9uZyBhZ28gaXQgd2FzXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSAxMFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbFNjYWxlLnRlbnNpb24gKz0gNVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbFNjYWxlLnRlbnNpb24gKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2dnZXIubG9nKFwiU2NhbGUgXCIsIHBvdGVudGlhbFNjYWxlLnNjYWxlLnRvU3RyaW5nKCksXCIgd2Fzbid0IGF2YWlsYWJsZSBhdCBkaXZpc2lvbiBcIiwgZGl2aXNpb24sIFwiLCBpbmNyZWFzZSB0ZW5zaW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxvZ2dlci5wcmludChcIkF2YWlsYWJsZSBzY2FsZXNcIiwgcmV0KVxuXG4gICAgcmV0dXJuIHJldC5maWx0ZXIoaXRlbSA9PiBpdGVtLnRlbnNpb24gPCAxMCk7XG59IiwiaW1wb3J0IHtcbiAgICBidWlsZFRhYmxlcyxcbiAgICBTY2FsZSxcbiAgICBOb3RlLFxufSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IENob3JkLCBOdWxsYWJsZSwgRGl2aXNpb25lZFJpY2hub3RlcywgUmljaE5vdGUsIEJFQVRfTEVOR1RILCBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgUmFuZG9tQ2hvcmRHZW5lcmF0b3IgfSBmcm9tIFwiLi9yYW5kb21jaG9yZHNcIjtcbmltcG9ydCB7IGdldEludmVyc2lvbnMgfSBmcm9tIFwiLi9pbnZlcnNpb25zXCI7XG5pbXBvcnQgeyBnZXRUZW5zaW9uLCBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgYnVpbGRUb3BNZWxvZHkgfSBmcm9tIFwiLi90b3BtZWxvZHlcIjtcbmltcG9ydCB7IGFkZEhhbGZOb3RlcyB9IGZyb20gXCIuL2hhbGZub3Rlc1wiO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlU2NhbGVzIH0gZnJvbSBcIi4vYXZhaWxhYmxlc2NhbGVzXCI7XG5pbXBvcnQgKiBhcyB0aW1lIGZyb20gXCIuL3RpbWVyXCI7IFxuXG5jb25zdCBHT09EX0NIT1JEX0xJTUlUID0gMTI7XG5jb25zdCBHT09EX0NIT1JEU19QRVJfQ0hPUkQgPSAzO1xuY29uc3QgQkFEX0NIT1JEX0xJTUlUID0gMjA7XG5cblxuY29uc3Qgc2xlZXBNUyA9IGFzeW5jIChtczogbnVtYmVyKTogUHJvbWlzZTxudWxsPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5jb25zdCBtYWtlQ2hvcmRzID0gYXN5bmMgKG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjazogTnVsbGFibGU8RnVuY3Rpb24+ID0gbnVsbCk6IFByb21pc2U8RGl2aXNpb25lZFJpY2hub3Rlcz4gPT4ge1xuICAgIC8vIGdlbmVyYXRlIGEgcHJvZ3Jlc3Npb25cbiAgICBjb25zdCBtYXhCZWF0cyA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcblxuICAgIGxldCByZXN1bHQ6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcblxuICAgIGxldCBkaXZpc2lvbkJhbm5lZE5vdGVzOiB7W2tleTogbnVtYmVyXTogQXJyYXk8QXJyYXk8Tm90ZT4+fSA9IHt9XG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IHByZXZSZXN1bHQgPSByZXN1bHRbZGl2aXNpb24gLSBCRUFUX0xFTkdUSF07XG4gICAgICAgIGxldCBwcmV2Q2hvcmQgPSBwcmV2UmVzdWx0ID8gcHJldlJlc3VsdFswXS5jaG9yZCA6IG51bGw7XG4gICAgICAgIGxldCBwcmV2Tm90ZXM6IE5vdGVbXTtcbiAgICAgICAgbGV0IHByZXZJbnZlcnNpb25OYW1lOiBzdHJpbmc7XG4gICAgICAgIGxldCBjdXJyZW50U2NhbGU6IFNjYWxlO1xuICAgICAgICBsZXQgYmFubmVkTm90ZXNzID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbl07XG4gICAgICAgIGlmIChwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICBwcmV2Tm90ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgcHJldlJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSA9IHJpY2hOb3RlLmludmVyc2lvbk5hbWU7XG4gICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZDtcblxuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKFwiZGl2aXNpb25cIiwgZGl2aXNpb24sIHByZXZDaG9yZCA/IHByZXZDaG9yZC50b1N0cmluZygpIDogXCJudWxsXCIsIFwiIHNjYWxlIFwiLCBjdXJyZW50U2NhbGUgPyBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA6IFwibnVsbFwiKTtcbiAgICAgICAgY29uc3QgY3VycmVudEJlYXQgPSBNYXRoLmZsb29yKGRpdmlzaW9uIC8gQkVBVF9MRU5HVEgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcIiwgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSk7XG5cbiAgICAgICAgY29uc3QgcmFuZG9tR2VuZXJhdG9yID0gbmV3IFJhbmRvbUNob3JkR2VuZXJhdG9yKHBhcmFtcywgY3VycmVudFNjYWxlKVxuICAgICAgICBsZXQgbmV3Q2hvcmQ6IE51bGxhYmxlPENob3JkPiA9IG51bGw7XG5cbiAgICAgICAgbGV0IGdvb2RDaG9yZHM6IFJpY2hOb3RlW11bXSA9IFtdXG4gICAgICAgIGNvbnN0IGJhZENob3Jkczoge3RlbnNpb246IFRlbnNpb24sIGNob3JkOiBzdHJpbmd9W10gPSBbXVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbU5vdGVzOiBBcnJheTxOb3RlPiA9IFtdO1xuXG4gICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgbGV0IHNraXBMb29wID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gMSkge1xuICAgICAgICAgICAgLy8gRm9yY2Ugc2FtZSBjaG9yZCB0d2ljZVxuICAgICAgICAgICAgZ29vZENob3Jkcy5zcGxpY2UoMCwgZ29vZENob3Jkcy5sZW5ndGgpO1xuICAgICAgICAgICAgZ29vZENob3Jkcy5wdXNoKHByZXZOb3Rlcy5tYXAoKG5vdGUsIGluZGV4KSA9PiAoe1xuICAgICAgICAgICAgICAgIG5vdGU6IG5vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IEJFQVRfTEVOR1RILFxuICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZCxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgIH0gYXMgUmljaE5vdGUpKSk7XG4gICAgICAgICAgICBza2lwTG9vcCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoIXNraXBMb29wICYmIGdvb2RDaG9yZHMubGVuZ3RoIDwgR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgICAgbmV3Q2hvcmQgPSByYW5kb21HZW5lcmF0b3IuZ2V0Q2hvcmQoKTtcbiAgICAgICAgICAgIGNvbnN0IGNob3JkTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwIHx8ICFuZXdDaG9yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9vIG1hbnkgaXRlcmF0aW9ucywgZ29pbmcgYmFja1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBhbGxJbnZlcnNpb25zO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZVNjYWxlcztcblxuICAgICAgICAgICAgYXZhaWxhYmxlU2NhbGVzID0gZ2V0QXZhaWxhYmxlU2NhbGVzKHtcbiAgICAgICAgICAgICAgICBsYXRlc3REaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzOiBuZXdDaG9yZC5ub3RlcyxcbiAgICAgICAgICAgICAgICBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2NhbGUgJiYgKG1heEJlYXRzIC0gY3VycmVudEJlYXQgPCAzIHx8IGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzIHx8IGN1cnJlbnRCZWF0IDwgNSkpIHtcbiAgICAgICAgICAgICAgICAvLyBEb24ndCBhbGxvdyBvdGhlciBzY2FsZXMgdGhhbiB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBhdmFpbGFibGVTY2FsZXMuZmlsdGVyKHMgPT4gcy5zY2FsZS5lcXVhbHMoY3VycmVudFNjYWxlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXZhaWxhYmxlU2NhbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGxJbnZlcnNpb25zID0gZ2V0SW52ZXJzaW9ucyh7XG4gICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLCBwcmV2Tm90ZXM6IHByZXZOb3RlcywgYmVhdDogY3VycmVudEJlYXQsIHBhcmFtcywgbG9nZ2VyOiBuZXcgTG9nZ2VyKGNob3JkTG9nZ2VyKSxcbiAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBtYXhCZWF0cyAtIGN1cnJlbnRCZWF0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGludmVyc2lvblJlc3VsdCBvZiBhbGxJbnZlcnNpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZHMubGVuZ3RoID49IEdPT0RfQ0hPUkRfTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVyc2lvbkxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIudGl0bGUgPSBbXCJJbnZlcnNpb24gXCIsIGAke2ludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lfWBdO1xuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzLnNwbGljZSgwLCByYW5kb21Ob3Rlcy5sZW5ndGgpOyAgLy8gRW1wdHkgdGhpcyBhbmQgcmVwbGFjZSBjb250ZW50c1xuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzLnB1c2goLi4uaW52ZXJzaW9uUmVzdWx0Lm5vdGVzKTtcbiAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXNzICYmIGJhbm5lZE5vdGVzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiYW5uZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJhbm5lZE5vdGVzIG9mIGJhbm5lZE5vdGVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZE5vdGVzLmxlbmd0aCAhPSByYW5kb21Ob3Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbU5vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmRvbU5vdGVzW2ldLnRvU3RyaW5nKCkgIT0gYmFubmVkTm90ZXNbaV0udG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFubmVkIG5vdGVzXCIsIHJhbmRvbU5vdGVzLm1hcChuID0+IG4udG9TdHJpbmcoKSksIFwiYmFubmVkTm90ZXNzXCIsIGJhbm5lZE5vdGVzcy5tYXAobiA9PiBuLm1hcChuID0+IG4udG9TdHJpbmcoKSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXZhaWxhYmxlU2NhbGUgb2YgYXZhaWxhYmxlU2NhbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA+PSBHT09EX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUmVzdWx0ID0gZ2V0VGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXM6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTm90ZXM6IHJhbmRvbU5vdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBtYXhCZWF0cyAtIGN1cnJlbnRCZWF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IGF2YWlsYWJsZVNjYWxlLnRlbnNpb24gLyBNYXRoLm1heCgwLjAxLCBwYXJhbXMubW9kdWxhdGlvbldlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2NhbGUgJiYgIWF2YWlsYWJsZVNjYWxlLnNjYWxlLmVxdWFscyhjdXJyZW50U2NhbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMSAvIE1hdGgubWF4KDAuMDEsIHBhcmFtcy5tb2R1bGF0aW9uV2VpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhCZWF0cyAtIGN1cnJlbnRCZWF0IDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExhc3QgMiBiYXJzLCBkb24ndCBjaGFuZ2Ugc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgY2hhbmdlIHNjYWxlIGluIGxhc3QgMiBiZWF0cyBvZiBjYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmVhdCA8IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBjaGFuZ2Ugc2NhbGUgaW4gZmlyc3QgNSBiZWF0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbnNpb24gPSB0ZW5zaW9uUmVzdWx0LmdldFRvdGFsVGVuc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnaXZlVVAgPSBwcm9ncmVzc0NhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVVUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aGlzQ2hvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdvb2RDaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS5jaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0Nob3JkQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0Nob3JkQ291bnQgPj0gR09PRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgd29yc3QgcHJldmlvdXMgZ29vZENob3JkIGlmIHRoaXMgaGFzIGxlc3MgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JzdENob3JkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RDaG9yZFRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ29vZENob3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kQ2hvcmQgPSBnb29kQ2hvcmRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZFswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbiA8IHdvcnN0Q2hvcmRUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yc3RDaG9yZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcnN0Q2hvcmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkc1t3b3JzdENob3JkXVswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbiA+IHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcmVtb3ZlIHRoYXQgaW5kZXgsIGFkZCBhIG5ldyBvbmUgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RDaG9yZHMuc3BsaWNlKHdvcnN0Q2hvcmQsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0Nob3JkQ291bnQgPCBHT09EX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocmFuZG9tTm90ZXMubWFwKChub3RlLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IEJFQVRfTEVOR1RILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogYXZhaWxhYmxlU2NhbGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiYWRDaG9yZHMubGVuZ3RoIDwgQkFEX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hvcmRDb3VudEluQmFkQ2hvcmRzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFkQ2hvcmQgb2YgYmFkQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhZENob3JkLmNob3JkID09IG5ld0Nob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmRDb3VudEluQmFkQ2hvcmRzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNob3JkQ291bnRJbkJhZENob3JkcyA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRDaG9yZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAvLyBGb3IgYXZhaWxhYmxlIHNjYWxlcyBlbmRcbiAgICAgICAgICAgIH0gIC8vIEZvciB2b2ljZWxlYWRpbmcgcmVzdWx0cyBlbmRcbiAgICAgICAgfSAgLy8gV2hpbGUgZW5kXG4gICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhZENob3JkIG9mIGJhZENob3Jkcykge1xuICAgICAgICAgICAgICAgIGJhZENob3JkLnRlbnNpb24ucHJpbnQoXCJCYWQgY2hvcmQgXCIsIGJhZENob3JkLmNob3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdvIGJhY2sgdG8gcHJldmlvdXMgY2hvcmQsIGFuZCBtYWtlIGl0IGFnYWluXG4gICAgICAgICAgICBpZiAoZGl2aXNpb24gPj0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbiAtPSBCRUFUX0xFTkdUSCAqIDI7XG4gICAgICAgICAgICAgICAgLy8gTWFyayB0aGUgcHJldmlvdXMgY2hvcmQgYXMgYmFubmVkXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3QmFubmVkTm90ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0Jhbm5lZE5vdGVzW25vdGUucGFydEluZGV4XSA9IG5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIHRoZSBwcmV2aW91cyBjaG9yZCAod2hlcmUgd2UgYXJlIGdvaW5nIHRvKVxuICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0ucHVzaChuZXdCYW5uZWROb3Rlcyk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZmFpbGVkIHJpZ2h0IGF0IHRoZSBzdGFydC5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQgLSAxLCByZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaG9vc2UgdGhlIGJlc3QgY2hvcmQgZnJvbSBnb29kQ2hvcmRzXG4gICAgICAgIGxldCBiZXN0Q2hvcmQgPSBnb29kQ2hvcmRzWzBdO1xuICAgICAgICBmb3IgKGNvbnN0IGNob3JkIG9mIGdvb2RDaG9yZHMpIHtcbiAgICAgICAgICAgIGlmIChjaG9yZFswXSkge1xuICAgICAgICAgICAgICAgIGNob3JkWzBdLnRlbnNpb24ucHJpbnQoY2hvcmRbMF0uY2hvcmQgPyBjaG9yZFswXS5jaG9yZC50b1N0cmluZygpIDogXCI/Q2hvcmQ/XCIsIFwiOiBcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaG9yZFswXS50ZW5zaW9uIDwgYmVzdENob3JkWzBdLnRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICBiZXN0Q2hvcmQgPSBjaG9yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtkaXZpc2lvbl0gPSBiZXN0Q2hvcmQ7XG5cbiAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQsIHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICByYW5kb21HZW5lcmF0b3IuY2xlYW5VcCgpO1xuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZU11c2ljKHBhcmFtczogTWFpbk11c2ljUGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrOiBOdWxsYWJsZTxGdW5jdGlvbj4gPSBudWxsKSB7XG4gICAgbGV0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IHt9O1xuICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgIGlmIChpdGVyYXRpb25zID4gNSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb28gbWFueSBpdGVyYXRpb25zLCBicmVha2luZ1wiKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzOiB7fSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkaXZpc2lvbmVkTm90ZXMgPSBhd2FpdCBtYWtlQ2hvcmRzKHBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjayk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkaXZpc2lvbmVkTm90ZXMpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgICB9XG5cbiAgICAvLyBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSBuZXdWb2ljZUxlYWRpbmdOb3RlcyhjaG9yZHMsIHBhcmFtcyk7XG4gICAgYnVpbGRUb3BNZWxvZHkoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzOiBkaXZpc2lvbmVkTm90ZXMsXG4gICAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTWVsb2R5KGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgLy8gUmVtb3ZlIG9sZCBtZWxvZHkgYW5kIG1ha2UgYSBuZXcgb25lXG4gICAgY29uc3QgbWF4QmVhdHMgPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKClcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbisrKSB7XG4gICAgICAgIGNvbnN0IG9uQmVhdCA9IGRpdmlzaW9uICUgQkVBVF9MRU5HVEggPT0gMDtcbiAgICAgICAgaWYgKCFvbkJlYXQpIHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBbXVxuICAgICAgICB9IGVsc2UgaWYgKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gJiYgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZvckVhY2gocmljaE5vdGUgPT4ge1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLmR1cmF0aW9uID0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmljaE5vdGUudGllID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcyk7XG4gICAgLy8gYWRkRWlnaHRoTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG4gICAgYWRkSGFsZk5vdGVzKGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcylcbn1cblxuZXhwb3J0IHsgYnVpbGRUYWJsZXMgfSIsImltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzLCBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY29uc3QgYWRkSGFsZk5vdGVzID0gKGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSA9PiB7XG5cbiAgICBjb25zdCBiZWF0c1BlckJhciA9IG1haW5QYXJhbXMuYmVhdHNQZXJCYXIgfHwgNDtcbiAgICBjb25zdCBsYXN0RGl2aXNpb24gPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKCkgKiBCRUFUX0xFTkdUSDtcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBsYXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbWFpblBhcmFtcy5jdXJyZW50Q2FkZW5jZVBhcmFtcyhkaXZpc2lvbik7XG4gICAgICAgIGNvbnN0IGxhc3RCZWF0ID0gTWF0aC5mbG9vcihkaXZpc2lvbiAvIEJFQVRfTEVOR1RIKSAqIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZDtcbiAgICAgICAgbGV0IGNhZGVuY2VFbmRpbmcgPSBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMlxuICAgICAgICBpZiAocGFyYW1zLmhhbGZOb3RlcyAmJiAhY2FkZW5jZUVuZGluZykge1xuICAgICAgICAgICAgLy8gQWRkIGEgdGllIHN0YXJ0IHRvIHRoZSBwcmV2aW91cyBub3RlIHRvIGRvdWJsZSBsZW5ndGgsIGFuZCB0aWUgc3RvcCB0byB0aGlzXG4gICAgICAgICAgICAvLyBpZiBpdCdzIGNvbnRpbnVpbmcgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNOb3RlcyA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiAtIDEyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb3RlcyA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gfHwgW107XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8NDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNOb3RlID0gcHJldmlvdXNOb3Rlcy5maWx0ZXIoKG4pID0+IG4ucGFydEluZGV4ID09IGkpWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb3RlID0gY3VycmVudE5vdGVzLmZpbHRlcigobikgPT4gbi5wYXJ0SW5kZXggPT0gaSlbMF07XG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzTm90ZSAmJiBjdXJyZW50Tm90ZSAmJiBwcmV2aW91c05vdGUubm90ZS5lcXVhbHMoY3VycmVudE5vdGUubm90ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzTm90ZS5kdXJhdGlvbiAhPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb3RlLmR1cmF0aW9uICE9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNOb3RlLnRpZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c05vdGUudGllID0gXCJzdGFydFwiO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Tm90ZS50aWUgPSBcInN0b3BcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInByZXZpb3VzTm90ZXM6IFwiLCBwcmV2aW91c05vdGVzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IENob3JkLCBnbG9iYWxTZW1pdG9uZSwgTXVzaWNQYXJhbXMsIHNlbWl0b25lRGlzdGFuY2UsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgdHlwZSBJbnZlcnNpb25SZXN1bHQgPSB7XG4gICAgZ1RvbmVEaWZmczogQXJyYXk8QXJyYXk8bnVtYmVyPj4sXG4gICAgbm90ZXM6IHtba2V5OiBudW1iZXJdOiBOb3RlfSxcbiAgICByYXRpbmc6IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lOiBzdHJpbmcsXG59XG5cbmV4cG9ydCB0eXBlIFNpbXBsZUludmVyc2lvblJlc3VsdCA9IHtcbiAgICBub3RlczogQXJyYXk8Tm90ZT4sXG4gICAgcmF0aW5nOiBudW1iZXIsXG4gICAgaW52ZXJzaW9uTmFtZTogc3RyaW5nLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzaW9ucyA9ICh2YWx1ZXM6IHtcbiAgICAgICAgY2hvcmQ6IENob3JkLCBwcmV2Tm90ZXM6IEFycmF5PE5vdGU+LCBiZWF0OiBudW1iZXIsIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgICAgIGxvZ2dlcjogTG9nZ2VyLCBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBudW1iZXJcbiAgICB9KTogQXJyYXk8U2ltcGxlSW52ZXJzaW9uUmVzdWx0PiA9PiB7XG4gICAgY29uc3Qge2Nob3JkLCBwcmV2Tm90ZXMsIGJlYXQsIHBhcmFtcywgbG9nZ2VyLCBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nfSA9IHZhbHVlcztcbiAgICAvLyBSZXR1cm4gTm90ZXMgaW4gdGhlIENob3JkIHRoYXQgYXJlIGNsb3Nlc3QgdG8gdGhlIHByZXZpb3VzIG5vdGVzXG4gICAgLy8gRm9yIGVhY2ggcGFydFxuXG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKHBhcmFtcyk7XG5cbiAgICAvLyBBZGQgYSByZXN1bHQgZm9yIGVhY2ggcG9zc2libGUgaW52ZXJzaW9uXG4gICAgY29uc3QgcmV0OiBBcnJheTxTaW1wbGVJbnZlcnNpb25SZXN1bHQ+ID0gW107XG5cbiAgICBsZXQgbGFzdEJlYXRHbG9iYWxTZW1pdG9uZXMgPSBbLi4uc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNdXG4gICAgaWYgKHByZXZOb3Rlcykge1xuICAgICAgICBsYXN0QmVhdEdsb2JhbFNlbWl0b25lcyA9IHByZXZOb3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjaG9yZCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgaWYgKGNob3JkKSB7XG4gICAgICAgIC8vIEZvciBlYWNoIGJlYXQsIHdlIHRyeSB0byBmaW5kIGEgZ29vZCBtYXRjaGluZyBzZW1pdG9uZSBmb3IgZWFjaCBwYXJ0LlxuXG4gICAgICAgIC8vIFJ1bGVzOlxuICAgICAgICAvLyBXaXRoXHRyb290IHBvc2l0aW9uIHRyaWFkczogZG91YmxlIHRoZSByb290LiBcblxuICAgICAgICAvLyBXaXRoIGZpcnN0IGludmVyc2lvbiB0cmlhZHM6IGRvdWJsZSB0aGUgcm9vdCBvciA1dGgsIGluIGdlbmVyYWwuIElmIG9uZSBuZWVkcyB0byBkb3VibGUgXG4gICAgICAgIC8vIHRoZSAzcmQsIHRoYXQgaXMgYWNjZXB0YWJsZSwgYnV0IGF2b2lkIGRvdWJsaW5nIHRoZSBsZWFkaW5nIHRvbmUuXG5cbiAgICAgICAgLy8gV2l0aCBzZWNvbmQgaW52ZXJzaW9uIHRyaWFkczogZG91YmxlIHRoZSBmaWZ0aC4gXG5cbiAgICAgICAgLy8gV2l0aCAgc2V2ZW50aCAgY2hvcmRzOiAgdGhlcmUgIGlzICBvbmUgdm9pY2UgIGZvciAgZWFjaCAgbm90ZSwgIHNvICBkaXN0cmlidXRlIGFzICBmaXRzLiBJZiAgb25lIFxuICAgICAgICAvLyBtdXN0IG9taXQgYSBub3RlIGZyb20gdGhlIGNob3JkLCB0aGVuIG9taXQgdGhlIDV0aC5cblxuICAgICAgICBjb25zdCBmaXJzdEludGVydmFsID0gc2VtaXRvbmVEaXN0YW5jZShjaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSwgY2hvcmQubm90ZXNbMV0uc2VtaXRvbmUpXG4gICAgICAgIGNvbnN0IHRoaXJkSXNHb29kID0gZmlyc3RJbnRlcnZhbCA9PSAzIHx8IGZpcnN0SW50ZXJ2YWwgPT0gNDtcbiAgICAgICAgbG9nZ2VyLmxvZyhcIm5vdGVzOiBcIiwgY2hvcmQubm90ZXMubWFwKG4gPT4gbi50b1N0cmluZygpKSk7XG5cbiAgICAgICAgLy8gRGVwZW5kaW5nIG9uIHRoZSBpbnZlcnNpb24gYW5kIGNob3JkIHR5cGUsIHdlJ3JlIGRvaW5nIGRpZmZlcmVudCB0aGluZ3NcblxuICAgICAgICBsZXQgaW52ZXJzaW9uTmFtZXMgPSBbXCJyb290XCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwiZmlyc3QtZmlmdGhcIiwgXCJzZWNvbmRcIl07XG4gICAgICAgIGxldCBjb21iaW5hdGlvbkNvdW50ID0gMyAqIDIgKiAxO1xuICAgICAgICBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZXMgPSBbXCJyb290XCIsIFwiZmlyc3RcIiwgXCJzZWNvbmRcIiwgXCJ0aGlyZFwiXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHNraXBGaWZ0aEluZGV4ID0gMDsgc2tpcEZpZnRoSW5kZXggPCAyOyBza2lwRmlmdGhJbmRleCsrKSB7XG4gICAgICAgIGZvciAobGV0IGludmVyc2lvbkluZGV4PTA7IGludmVyc2lvbkluZGV4PGludmVyc2lvbk5hbWVzLmxlbmd0aDsgaW52ZXJzaW9uSW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBjb21iaW5hdGlvbkluZGV4PTA7IGNvbWJpbmF0aW9uSW5kZXg8Y29tYmluYXRpb25Db3VudDsgY29tYmluYXRpb25JbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBza2lwRmlmdGggPSBza2lwRmlmdGhJbmRleCA9PSAxO1xuXG4gICAgICAgICAgICAvLyBXZSB0cnkgZWFjaCBpbnZlcnNpb24uIFdoaWNoIGlzIGJlc3Q/XG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb24gPSBpbnZlcnNpb25OYW1lc1tpbnZlcnNpb25JbmRleF07XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyA8IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIERvbid0IGRvIGFueXRoaW5nIGJ1dCByb290IHBvc2l0aW9uIG9uIHRoZSBsYXN0IGNob3JkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb25SZXN1bHQ6IEludmVyc2lvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZURpZmZzOiBbXSxcbiAgICAgICAgICAgICAgICBub3Rlczoge30sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiAwLFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc2tpcEZpZnRoKSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUgKz0gXCItc2tpcEZpZnRoXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGFkZFBhcnROb3RlID0gKHBhcnRJbmRleDogbnVtYmVyLCBub3RlOiBOb3RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBub3RlLnNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IDEgIC8vIGR1bW15XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlci5sb2coXCJpbnZlcnNpb246IFwiLCBpbnZlcnNpb24sIFwic2tpcEZpZnRoOiBcIiwgc2tpcEZpZnRoKTtcbiAgICAgICAgICAgIGxldCBwYXJ0VG9JbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBzZWxlY3QgYm90dG9tIG5vdGVcbiAgICAgICAgICAgIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnZmlyc3QnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgndGhpcmQnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGlzdCBub3RlcyB3ZSBoYXZlIGxlZnQgb3ZlclxuICAgICAgICAgICAgbGV0IGxlZnRPdmVySW5kZXhlczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb24gPT0gXCJyb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3QgLT4gV2UgYWxyZWFkeSBoYXZlIDFcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAyXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LWZpZnRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDIsIDJdOyAgLy8gRG91YmxlIHRoZSBmaWZ0aFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwic2Vjb25kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2Vjb25kIC0+IFdlIGFscmVhZHkgaGF2ZSAyXG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAwLCAxXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMiwgM10uZmlsdGVyKGkgPT4gaSAhPSBwYXJ0VG9JbmRleFszXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChza2lwRmlmdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydFRvSW5kZXhbM10gPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYW4ndCBza2lwIGZpZnRoIGluIHNlY29uZCBpbnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsZWZ0T3ZlckluZGV4ZXMuZmlsdGVyKGkgPT4gaSA9PSAyKS5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYW4ndCBza2lwIGZpZnRoIGlmIHdlIGhhdmUgdHdvXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBsZWZ0T3ZlckluZGV4ZXMuZmlsdGVyKGkgPT4gaSAhPSAyKTtcbiAgICAgICAgICAgICAgICAvLyBBZGQgZWl0aGVyIGEgMCBvciAxIHRvIHJlcGxhY2UgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDApLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcy5wdXNoKDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcy5wdXNoKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGVwZW5kaW5nIG9uIGNvbWJpbmF0aW9uSW5kZXgsIHdlIHNlbGVjdCB0aGUgbm90ZXMgZm9yIHBhcnRJbmRleGVzIDAsIDEsIDJcbiAgICAgICAgICAgIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlyc3QgcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIC8vIFNlY29uZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcmQgcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gMykge1xuICAgICAgICAgICAgICAgIC8vIEZvdXJ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA0KSB7XG4gICAgICAgICAgICAgICAgLy8gRmlmdGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gNSkge1xuICAgICAgICAgICAgICAgIC8vIFNpeHRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0wOyBwYXJ0SW5kZXg8NDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBwYXJ0IGlzIGFscmVhZHkgc2V0XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRQYXJ0Tm90ZShwYXJ0SW5kZXgsIGNob3JkLm5vdGVzW3BhcnRUb0luZGV4W3BhcnRJbmRleF1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIExhc3RseSwgd2Ugc2VsZWN0IHRoZSBsb3dlc3QgcG9zc2libGUgb2N0YXZlIGZvciBlYWNoIHBhcnRcbiAgICAgICAgICAgIGxldCBtaW5TZW1pdG9uZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXg9MzsgcGFydEluZGV4Pj0wOyBwYXJ0SW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSBpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XTtcbiAgICAgICAgICAgICAgICBsZXQgZ1RvbmUgPSBnbG9iYWxTZW1pdG9uZShub3RlKTtcblxuICAgICAgICAgICAgICAgIGxldCBpPTA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGdUb25lIDwgc2VtaXRvbmVMaW1pdHNbcGFydEluZGV4XVswXSB8fCBnVG9uZSA8IG1pblNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUgKz0gMTI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdID0gbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIGEgY29weSBpbnZlcnNpb25yZXN1bHQgZm9yIGVhY2ggcG9zc2libGUgb2N0YXZlIGNvbWJpbmF0aW9uXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDBOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzBdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0MU5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMV0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQyTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1syXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDNOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzNdKTtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnQwT2N0YXZlPTA7IHBhcnQwT2N0YXZlPDM7IHBhcnQwT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0ME5vdGUgPSBpbml0aWFsUGFydDBOb3RlICsgcGFydDBPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICBpZiAocGFydDBOb3RlID4gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBhcnQxT2N0YXZlPTA7IHBhcnQxT2N0YXZlPDM7IHBhcnQxT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydDFOb3RlID0gaW5pdGlhbFBhcnQxTm90ZSArIHBhcnQxT2N0YXZlICogMTI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0MU5vdGUgPiBwYXJ0ME5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0MU5vdGUgPiBzZW1pdG9uZUxpbWl0c1sxXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDJPY3RhdmU9MDsgcGFydDJPY3RhdmU8MzsgcGFydDJPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydDJOb3RlID0gaW5pdGlhbFBhcnQyTm90ZSArIHBhcnQyT2N0YXZlICogMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDJOb3RlID4gcGFydDFOb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDJOb3RlID4gc2VtaXRvbmVMaW1pdHNbMl1bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHBhcnQzT2N0YXZlPTA7IHBhcnQzT2N0YXZlPDM7IHBhcnQzT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0M05vdGUgPSBpbml0aWFsUGFydDNOb3RlICsgcGFydDNPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDNOb3RlID4gcGFydDJOb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydDNOb3RlID4gc2VtaXRvbmVMaW1pdHNbM11bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDBOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQwTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0MU5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDFOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQyTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0Mk5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDNOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQzTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2dnZXIucHJpbnQoXCJuZXdWb2ljZUxlYWRpbmdOb3RlczogXCIsIGNob3JkLnRvU3RyaW5nKCksIFwiIGJlYXQ6IFwiLCBiZWF0KTtcblxuICAgIC8vIFJhbmRvbWl6ZSBvcmRlciBvZiByZXRcbiAgICBmb3IgKGxldCBpPTA7IGk8cmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZXQubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgdG1wID0gcmV0W2ldO1xuICAgICAgICByZXRbaV0gPSByZXRbal07XG4gICAgICAgIHJldFtqXSA9IHRtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuIiwiY29uc3QgcHJpbnRDaGlsZE1lc3NhZ2VzID0gKGNoaWxkTG9nZ2VyOiBMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkTG9nZ2VyLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uY2hpbGQudGl0bGUpO1xuICAgICAgICBwcmludENoaWxkTWVzc2FnZXMoY2hpbGQpO1xuICAgICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgY2hpbGQubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAgIHRpdGxlOiBhbnlbXSA9IFtdO1xuICAgIG1lc3NhZ2VzOiBBcnJheTxhbnlbXT4gPSBbXTtcbiAgICBwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBjaGlsZHJlbjogTG9nZ2VyW10gPSBbXTtcbiAgICBjbGVhcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2coLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKGFyZ3MpO1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIExldCBwYXJlbnQgaGFuZGxlIG1lXG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGFyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5hcmdzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi50aGlzLnRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSB0b3AgbG9nZ2VyLiBQcmludCBldmVyeXRoaW5nLlxuICAgICAgICBwcmludENoaWxkTWVzc2FnZXModGhpcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4udGhpcy5tZXNzYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbiA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhcmVkID0gdHJ1ZTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IENob3JkLCBjaG9yZFRlbXBsYXRlcywgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgUmFuZG9tQ2hvcmRHZW5lcmF0b3Ige1xuICAgIHByaXZhdGUgY2hvcmRUeXBlczogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBhdmFpbGFibGVDaG9yZHM6IEFycmF5PHN0cmluZz47XG4gICAgcHJpdmF0ZSB1c2VkQ2hvcmRzOiBTZXQ8c3RyaW5nPjtcbiAgICBwcml2YXRlIGN1cnJlbnRTY2FsZTogU2NhbGU7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IE11c2ljUGFyYW1zLCBzY2FsZTogU2NhbGUpIHtcbiAgICAgICAgY29uc3QgY2hvcmRUeXBlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNob3JkVHlwZSBpbiBwYXJhbXMuY2hvcmRTZXR0aW5ncykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5jaG9yZFNldHRpbmdzW2Nob3JkVHlwZV0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNob3JkVHlwZXMucHVzaChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hvcmRUeXBlcyA9IGNob3JkVHlwZXM7XG4gICAgICAgIHRoaXMudXNlZENob3JkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSBzY2FsZTtcbiAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCkge1xuICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gKHRoaXMuYXZhaWxhYmxlQ2hvcmRzIHx8IFtdKS5maWx0ZXIoY2hvcmQgPT4gIXRoaXMudXNlZENob3Jkcy5oYXMoY2hvcmQpKTtcbiAgICAgICAgLy8gRmlyc3QgdHJ5IHRvIGFkZCB0aGUgc2ltcGxlc3QgY2hvcmRzXG4gICAgICAgIGZvciAoY29uc3Qgc2ltcGxlQ2hvcmRUeXBlIG9mIHRoaXMuY2hvcmRUeXBlcy5maWx0ZXIoY2hvcmRUeXBlID0+IFtcIm1halwiLCBcIm1pblwiXS5pbmNsdWRlcyhjaG9yZFR5cGUpKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgcmFuZG9tUm9vdD0wOyByYW5kb21Sb290PDEyOyByYW5kb21Sb290KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHNpbXBsZUNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21UeXBlID0gdGhpcy5jaG9yZFR5cGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2hvcmRUeXBlcy5sZW5ndGgpXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVJvb3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMik7XG4gICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHJhbmRvbVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgcmFuZG9tVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGNsZWFuVXAoKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVzZWRDaG9yZHM7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmF2YWlsYWJsZUNob3JkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2hvcmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuYXZhaWxhYmxlQ2hvcmRzLmxlbmd0aCAtIDMgPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hvcmRUeXBlID0gdGhpcy5hdmFpbGFibGVDaG9yZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoKV07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKGNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzLmFkZChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3JkcyA9IHRoaXMuYXZhaWxhYmxlQ2hvcmRzLmZpbHRlcihjaG9yZCA9PiBjaG9yZCAhPT0gY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTXVzaWNQYXJhbXMsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgY2xhc3MgVGVuc2lvbiB7XG4gICAgbm90SW5TY2FsZTogbnVtYmVyID0gMDtcbiAgICBtb2R1bGF0aW9uOiBudW1iZXIgPSAwO1xuICAgIGFsbE5vdGVzU2FtZTogbnVtYmVyID0gMDtcbiAgICBjaG9yZFByb2dyZXNzaW9uOiBudW1iZXIgPSAwO1xuICAgIGZvdXJ0aERvd25DaG9yZFByb2dyZXNzaW9uOiBudW1iZXIgPSAwO1xuICAgIHBhcmFsbGVsRmlmdGhzOiBudW1iZXIgPSAwO1xuICAgIHNwYWNpbmdFcnJvcjogbnVtYmVyID0gMDtcbiAgICBjYWRlbmNlOiBudW1iZXIgPSAwO1xuICAgIHRlbnNpb25pbmdJbnRlcnZhbDogbnVtYmVyID0gMDtcbiAgICBzZWNvbmRJbnZlcnNpb246IG51bWJlciA9IDA7XG4gICAgZG91YmxlTGVhZGluZ1RvbmU6IG51bWJlciA9IDA7XG4gICAgbGVhZGluZ1RvbmVVcDogbnVtYmVyID0gMDtcbiAgICBtZWxvZHlKdW1wOiBudW1iZXIgPSAwO1xuICAgIG1lbG9keVRhcmdldDogbnVtYmVyID0gMDtcbiAgICB2b2ljZURpcmVjdGlvbnM6IG51bWJlciA9IDA7XG4gICAgb3ZlcmxhcHBpbmc6IG51bWJlciA9IDA7XG5cbiAgICB0b3RhbFRlbnNpb246IG51bWJlciA9IDA7XG5cbiAgICBnZXRUb3RhbFRlbnNpb24odmFsdWVzOiB7cGFyYW1zOiBNdXNpY1BhcmFtcywgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZTogbnVtYmVyfSkge1xuICAgICAgICBjb25zdCB7cGFyYW1zLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlfSA9IHZhbHVlcztcbiAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubm90SW5TY2FsZSAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1vZHVsYXRpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5hbGxOb3Rlc1NhbWU7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5jaG9yZFByb2dyZXNzaW9uICogMjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnBhcmFsbGVsRmlmdGhzO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuc3BhY2luZ0Vycm9yO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuY2FkZW5jZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnRlbnNpb25pbmdJbnRlcnZhbDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNlY29uZEludmVyc2lvbjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmRvdWJsZUxlYWRpbmdUb25lO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubGVhZGluZ1RvbmVVcDtcbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPiAyKSB7XG4gICAgICAgICAgICB0ZW5zaW9uICs9IHRoaXMuZm91cnRoRG93bkNob3JkUHJvZ3Jlc3Npb247XG4gICAgICAgICAgICB0ZW5zaW9uICs9IHRoaXMubWVsb2R5VGFyZ2V0O1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keUp1bXAgKiAwLjU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW5zaW9uICs9IHRoaXMubWVsb2R5SnVtcDtcbiAgICAgICAgfVxuICAgICAgICB0ZW5zaW9uICs9IHRoaXMudm9pY2VEaXJlY3Rpb25zO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMub3ZlcmxhcHBpbmc7XG5cbiAgICAgICAgdGhpcy50b3RhbFRlbnNpb24gPSB0ZW5zaW9uO1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG5cbiAgICBwcmludCguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAvLyBQcmludCBvbmx5IHBvc2l0aXZlIHZhbHVlc1xuICAgICAgICBjb25zdCB0b1ByaW50OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpc1trZXldICYmIHR5cGVvZiB0aGlzW2tleV0gPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRvUHJpbnRba2V5XSA9ICh0aGlzW2tleV0gYXMgdW5rbm93biBhcyBudW1iZXIpLnRvRml4ZWQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coLi4uYXJncywgdG9QcmludClcbiAgICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbnNpb24gPSAodmFsdWVzOiB7XG4gICAgICAgIGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgdG9Ob3RlczogQXJyYXk8Tm90ZT4sIGN1cnJlbnRTY2FsZTogU2NhbGUsXG4gICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2U6IG51bWJlciwgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbnVtYmVyLCBpbnZlcnNpb25OYW1lOiBzdHJpbmcsIHByZXZJbnZlcnNpb25OYW1lOiBTdHJpbmdcbiAgICB9KTogVGVuc2lvbiA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIHRvTm90ZXMsXG4gICAgICAgICAgICBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyxcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgfSA9IHZhbHVlcztcbiAgICAvKlxuICAgICogICBHZXQgdGhlIHRlbnNpb24gYmV0d2VlbiB0d28gY2hvcmRzXG4gICAgKiAgIEBwYXJhbSBmcm9tQ2hvcmQ6IENob3JkXG4gICAgKiAgIEBwYXJhbSB0b0Nob3JkOiBDaG9yZFxuICAgICogICBAcmV0dXJuOiB0ZW5zaW9uIHZhbHVlIGJldHdlZW4gLTEgYW5kIDFcbiAgICAqL1xuICAgIGNvbnN0IHRlbnNpb24gPSBuZXcgVGVuc2lvbigpO1xuICAgIGxldCB3YW50ZWRGdW5jdGlvbiA9IG51bGw7XG4gICAgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJQQUNcIikge1xuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSA1KSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwibm90LWRvbWluYW50XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gNCkge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMykge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gMyAmJiAhaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJJQUNcIikge1xuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSA1KSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwibm90LWRvbWluYW50XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gNCkge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMykge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gMyAmJiBpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgLy8gTm90IHJvb3QgaW52ZXJzaW9uXG4gICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiSENcIikge1xuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSA0KSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwibm90LWRvbWluYW50XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gMykge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInN1Yi1kb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMykge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJldkNob3JkO1xuICAgIGxldCBwcmV2UHJldkNob3JkO1xuICAgIGNvbnN0IGxhdGVzdERpdmlzaW9uID0gTWF0aC5tYXgoLi4uT2JqZWN0LmtleXMoZGl2aXNpb25lZE5vdGVzKS5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSkpO1xuICAgIGxldCB0bXAgOiBBcnJheTxOb3RlIHwgbnVsbD4gPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG4gICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICB9XG4gICAgY29uc3QgcGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuICAgIHRtcCA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsXTtcbiAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgIH1cbiAgICBjb25zdCBwcmV2UGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKCFwcmV2Q2hvcmQpIHtcbiAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcInRvbmljXCI7XG4gICAgfVxuXG4gICAgbGV0IGFsbHNhbWUgPSB0cnVlO1xuICAgIGZvciAobGV0IGk9MDsgaTx0b05vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghcGFzc2VkRnJvbU5vdGVzW2ldKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZQYXNzZWRGcm9tTm90ZXNbaV0pIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFzc2VkRnJvbU5vdGVzW2ldLmVxdWFscyh0b05vdGVzW2ldKSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2UGFzc2VkRnJvbU5vdGVzW2ldLmVxdWFscyh0b05vdGVzW2ldKSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFsbHNhbWUpIHtcbiAgICAgICAgdGVuc2lvbi5hbGxOb3Rlc1NhbWUgPSAxMDA7XG4gICAgfVxuXG4gICAgbGV0IGZyb21Ob3RlcztcbiAgICBpZiAocGFzc2VkRnJvbU5vdGVzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgZnJvbU5vdGVzID0gdG9Ob3RlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tTm90ZXMgPSBwYXNzZWRGcm9tTm90ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgdG9TZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZXMgPSBmcm9tTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG5cbiAgICAvLyBJZiB0aGUgbm90ZXMgYXJlIG5vdCBpbiB0aGUgY3VycmVudCBzY2FsZSwgaW5jcmVhc2UgdGhlIHRlbnNpb25cbiAgICBsZXQgbm90ZXNOb3RJblNjYWxlOiBBcnJheTxudW1iZXI+ID0gW11cbiAgICBsZXQgbmV3U2NhbGU6IE51bGxhYmxlPFNjYWxlPiA9IG51bGw7XG4gICAgY29uc3QgbGVhZGluZ1RvbmUgPSAoY3VycmVudFNjYWxlLmtleSAtIDEgKyAyNCkgJSAxMlxuICAgIGlmIChjdXJyZW50U2NhbGUpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVTZW1pdG9uZXMgPSBjdXJyZW50U2NhbGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgICAgIG5vdGVzTm90SW5TY2FsZSA9IHRvU2VtaXRvbmVzLmZpbHRlcihzZW1pdG9uZSA9PiAhc2NhbGVTZW1pdG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKTtcbiAgICAgICAgbm90ZXNOb3RJblNjYWxlID0gbm90ZXNOb3RJblNjYWxlLmZpbHRlcihzZW1pdG9uZSA9PiBzZW1pdG9uZSAhPSBsZWFkaW5nVG9uZSk7XG4gICAgICAgIGlmIChub3Rlc05vdEluU2NhbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gUXVpY2sgcmV0dXJuLCB0aGlzIGNob3JkIHN1Y2tzXG4gICAgICAgICAgICB0ZW5zaW9uLm5vdEluU2NhbGUgKz0gMTAwXG4gICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCB0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDYpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAxLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSB8fCAocHJldkludmVyc2lvbk5hbWUgfHwgXCJcIikuc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZnJvbVNlbWl0b25lIC0gdG9TZW1pdG9uZSkgPiAyKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5zZWNvbmRJbnZlcnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCxcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMyxcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNixcbiAgICB9XG5cbiAgICBsZXQgcG9zc2libGVUb0Z1bmN0aW9ucyA9IHtcbiAgICAgICAgJ3RvbmljJzogdHJ1ZSxcbiAgICAgICAgJ3N1Yi1kb21pbmFudCc6IHRydWUsXG4gICAgICAgICdkb21pbmFudCc6IHRydWUsXG4gICAgfVxuICAgIGNvbnN0IHRvU2NhbGVJbmRleGVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0pO1xuICAgIGZvciAoY29uc3Qgc2NhbGVJbmRleCBvZiB0b1NjYWxlSW5kZXhlcykge1xuICAgICAgICBpZiAoc2NhbGVJbmRleCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSBmYWxzZTtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnNbJ3N1Yi1kb21pbmFudCddID0gZmFsc2U7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVswLCAxLCAzLCA1XS5pbmNsdWRlcyhzY2FsZUluZGV4KSkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghWzEsIDMsIDQsIDZdLmluY2x1ZGVzKHNjYWxlSW5kZXgpKSB7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFbMCwgMiwgNF0uaW5jbHVkZXMoc2NhbGVJbmRleCkpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgcG9zc2libGVGcm9tRnVuY3Rpb25zID0ge1xuICAgICAgICAndG9uaWMnOiB0cnVlLFxuICAgICAgICAnc3ViLWRvbWluYW50JzogdHJ1ZSxcbiAgICAgICAgJ2RvbWluYW50JzogdHJ1ZSxcbiAgICB9XG4gICAgY29uc3QgZnJvbVNjYWxlSW5kZXhlcyA9IGZyb21Ob3Rlcy5tYXAobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0pO1xuICAgIGZvciAoY29uc3Qgc2NhbGVJbmRleCBvZiBmcm9tU2NhbGVJbmRleGVzKSB7XG4gICAgICAgIGlmIChzY2FsZUluZGV4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9zc2libGVGcm9tRnVuY3Rpb25zLnRvbmljID0gZmFsc2U7XG4gICAgICAgICAgICBwb3NzaWJsZUZyb21GdW5jdGlvbnNbJ3N1Yi1kb21pbmFudCddID0gZmFsc2U7XG4gICAgICAgICAgICBwb3NzaWJsZUZyb21GdW5jdGlvbnMuZG9taW5hbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKFswLCAxLCAzLCA1XS5pbmNsdWRlcyhzY2FsZUluZGV4KSkpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlRnJvbUZ1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKFsxLCAzLCA0LCA2XS5pbmNsdWRlcyhzY2FsZUluZGV4KSkpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlRnJvbUZ1bmN0aW9ucy5kb21pbmFudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKFswLCAyLCA0XS5pbmNsdWRlcyhzY2FsZUluZGV4KSkpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlRnJvbUZ1bmN0aW9ucy50b25pYyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBpZiAod2FudGVkRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwic3ViLWRvbWluYW50XCIpIHtcbiAgICAgICAgICAgIGlmICghcG9zc2libGVUb0Z1bmN0aW9uc1tcInN1Yi1kb21pbmFudFwiXSkgey8vICYmICFwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50KSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJkb21pbmFudFwiKSB7XG4gICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcInRvbmljXCIpIHtcbiAgICAgICAgICAgIGlmICghcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYykge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwibm90LWRvbWluYW50XCIpIHtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50KSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NzaWJsZUZyb21GdW5jdGlvbnMudG9uaWMgPT0gZmFsc2UgJiYgd2FudGVkRnVuY3Rpb24gIT0gXCJ0b25pY1wiICYmIHByZXZDaG9yZCkge1xuICAgICAgICBsZXQgcHJldkluZGV4MSA9IHNlbWl0b25lU2NhbGVJbmRleFtwcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmVdO1xuICAgICAgICBsZXQgcHJldkluZGV4MiA9IHNlbWl0b25lU2NhbGVJbmRleFtwcmV2Q2hvcmQubm90ZXNbMV0uc2VtaXRvbmVdO1xuICAgICAgICBsZXQgcHJldkluZGV4MyA9IHNlbWl0b25lU2NhbGVJbmRleFtwcmV2Q2hvcmQubm90ZXNbMl0uc2VtaXRvbmVdO1xuICAgICAgICBsZXQgcHJldkluZGV4NCA9IHNlbWl0b25lU2NhbGVJbmRleFsocHJldkNob3JkLm5vdGVzWzNdIHx8IHt9KS5zZW1pdG9uZV07XG5cbiAgICAgICAgLy8gQ2hvaWNlczogNCBtb3ZlcyB1cCwgMyBhbmQgNCBtb3ZlIHVwLCAyLCAzLCBhbmQgNCBtb3ZlIHVwLCAxLCAyLCAzLCBhbmQgNCBtb3ZlIHVwXG4gICAgICAgIC8vIENoZWNrIGFsbFxuICAgICAgICBsZXQgaXNHb29kID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChpc0dvb2QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvU2NhbGVJbmRleGVzID0gdG9TZW1pdG9uZXMubWFwKHNlbWl0b25lID0+IHNlbWl0b25lU2NhbGVJbmRleFtzZW1pdG9uZV0pO1xuICAgICAgICAgICAgbGV0IGFsbG93ZWRJbmRleGVzOiBudW1iZXJbXTtcbiAgICAgICAgICAgIGlmIChwcmV2SW5kZXg0KSB7XG4gICAgICAgICAgICAgICAgYWxsb3dlZEluZGV4ZXMgPSBbcHJldkluZGV4MSwgcHJldkluZGV4MiwgcHJldkluZGV4MywgcHJldkluZGV4NF1cbiAgICAgICAgICAgICAgICBpZiAodG9TY2FsZUluZGV4ZXMuZXZlcnkoaW5kZXggPT4gYWxsb3dlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaXNHb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gW3ByZXZJbmRleDEsIChwcmV2SW5kZXgyICsgMSkgJSA3LCAocHJldkluZGV4MyArIDEpICUgNywgKHByZXZJbmRleDQgKyAxKSAlIDddXG4gICAgICAgICAgICAgICAgaWYgKHRvU2NhbGVJbmRleGVzLmV2ZXJ5KGluZGV4ID0+IGFsbG93ZWRJbmRleGVzLmluY2x1ZGVzKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNHb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gWyhwcmV2SW5kZXgxICsgMSkgJSA3LCAocHJldkluZGV4MiArIDEpICUgNywgKHByZXZJbmRleDMgKyAxKSAlIDcsIChwcmV2SW5kZXg0ICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxvd2VkSW5kZXhlcyA9IFtwcmV2SW5kZXgxLCBwcmV2SW5kZXgyLCAocHJldkluZGV4MyArIDEpICUgNywgKHByZXZJbmRleDQgKyAxKSAlIDddXG4gICAgICAgICAgICAgICAgaWYgKHRvU2NhbGVJbmRleGVzLmV2ZXJ5KGluZGV4ID0+IGFsbG93ZWRJbmRleGVzLmluY2x1ZGVzKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNHb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gW3ByZXZJbmRleDEsIHByZXZJbmRleDIsIHByZXZJbmRleDMsIChwcmV2SW5kZXg0ICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxsb3dlZEluZGV4ZXMgPSBbcHJldkluZGV4MSwgcHJldkluZGV4MiwgcHJldkluZGV4M11cbiAgICAgICAgICAgICAgICBpZiAodG9TY2FsZUluZGV4ZXMuZXZlcnkoaW5kZXggPT4gYWxsb3dlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgICAgICBpc0dvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsb3dlZEluZGV4ZXMgPSBbcHJldkluZGV4MSwgKHByZXZJbmRleDIgKyAxKSAlIDcsIChwcmV2SW5kZXgzICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxvd2VkSW5kZXhlcyA9IFsocHJldkluZGV4MSArIDEpICUgNywgKHByZXZJbmRleDIgKyAxKSAlIDcsIChwcmV2SW5kZXgzICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpc0dvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsb3dlZEluZGV4ZXMgPSBbcHJldkluZGV4MSwgcHJldkluZGV4MiwgKHByZXZJbmRleDMgKyAxKSAlIDddXG4gICAgICAgICAgICAgICAgaWYgKHRvU2NhbGVJbmRleGVzLmV2ZXJ5KGluZGV4ID0+IGFsbG93ZWRJbmRleGVzLmluY2x1ZGVzKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5mb3VydGhEb3duQ2hvcmRQcm9ncmVzc2lvbiArPSAxMDA7ICAvLyBGSVhNRSBzb21ldGltZXMgb2tcbiAgICAgICAgICAgICAgICAgICAgaXNHb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0dvb2QpIHtcbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsZWFkaW5nVG9uZVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lICsgMTE7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZSAlIDEyID09IGxlYWRpbmdUb25lU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmUgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwICs9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEgfHwgaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhcyBiYWRcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwIC09IDc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxlYWRpbmdUb25lQ291bnQgPSAwO1xuICAgIGZvciAoY29uc3QgdG9HbG9iYWxTZW1pdG9uZSBvZiB0b0dsb2JhbFNlbWl0b25lcykge1xuICAgICAgICBjb25zdCBzY2FsZUluZGV4OiBudW1iZXIgPSBzZW1pdG9uZVNjYWxlSW5kZXhbKHRvR2xvYmFsU2VtaXRvbmUgKyAxMikgJSAxMl07XG4gICAgICAgIGlmIChzY2FsZUluZGV4ID09IDYpIHtcbiAgICAgICAgICAgIGxlYWRpbmdUb25lQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobGVhZGluZ1RvbmVDb3VudCA+IDEpIHtcbiAgICAgICAgdGVuc2lvbi5kb3VibGVMZWFkaW5nVG9uZSArPSAxMDtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBkaXJlY3Rpb25zXG4gICAgY29uc3QgZGlyZWN0aW9uQ291bnRzID0ge1xuICAgICAgICBcInVwXCI6IDAsXG4gICAgICAgIFwiZG93blwiOiAwLFxuICAgICAgICBcInNhbWVcIjogMCxcbiAgICB9XG4gICAgbGV0IHJvb3RCYXNzRGlyZWN0aW9uID0gbnVsbDtcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmcm9tU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lO1xuICAgICAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLmRvd24gKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA9PSAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMuc2FtZSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmICE9IDAgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIHJvb3RCYXNzRGlyZWN0aW9uID0gZGlmZiA+IDAgPyAndXAnIDogJ2Rvd24nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUm9vdCBiYXNzIG1ha2VzIHVwIGZvciBvbmUgdXAvZG93blxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcInVwXCIgJiYgZGlyZWN0aW9uQ291bnRzLmRvd24gPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duIC09IDE7XG4gICAgfVxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcImRvd25cIiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCAtPSAxO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLnVwID4gMiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMTA7XG4gICAgfVxuICAgIGlmIChkaXJlY3Rpb25Db3VudHMuZG93biA+IDIgJiYgZGlyZWN0aW9uQ291bnRzLnVwIDwgMSkge1xuICAgICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSAxMDtcbiAgICB9XG5cbiAgICAvLyBQYXJhbGxlbCBtb3Rpb24gYW5kIGhpZGRlbiBmaWZ0aHNcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmVzW2ldID09IHRvR2xvYmFsU2VtaXRvbmVzW2ldICYmIGZyb21HbG9iYWxTZW1pdG9uZXNbal0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbal0pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tqXSk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbEZyb20gPSBNYXRoLmFicyhmcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1tqXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPCAyMCAmJiBpbnRlcnZhbCAlIDEyID09IDcgfHwgaW50ZXJ2YWwgJSAxMiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gUG9zc2libHkgYSBwYXJhbGxlbCwgY29udHJhcnkgb3IgaGlkZGVuIGZpZnRoL29jdGF2ZVxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSBpbnRlcnZhbEZyb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5wYXJhbGxlbEZpZnRocyArPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBpbnRlcnZhbCBpcyBoaWRkZW5cbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0SURpcmVjdGlvbiA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0SkRpcmVjdGlvbiA9IGZyb21HbG9iYWxTZW1pdG9uZXNbal0gLSB0b0dsb2JhbFNlbWl0b25lc1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMocGFydEpEaXJlY3Rpb24pID4gMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBVcHBlciBwYXJ0IGlzIG1ha2luZyBhIGp1bXBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRJRGlyZWN0aW9uIDwgMCAmJiBwYXJ0SkRpcmVjdGlvbiA8IDAgfHwgcGFydElEaXJlY3Rpb24gPiAwICYmIHBhcnRKRGlyZWN0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5wYXJhbGxlbEZpZnRocyArPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3BhY2luZyBlcnJvcnNcbiAgICBjb25zdCBwYXJ0MFRvUGFydDEgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzFdKTtcbiAgICBjb25zdCBwYXJ0MVRvUGFydDIgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1sxXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzJdKTtcbiAgICBjb25zdCBwYXJ0MlRvUGFydDMgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1syXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzNdKTtcbiAgICBpZiAocGFydDFUb1BhcnQyID4gMTIgfHwgcGFydDBUb1BhcnQxID4gMTIgfHwgcGFydDJUb1BhcnQzID4gKDEyICsgNykpIHtcbiAgICAgICAgdGVuc2lvbi5zcGFjaW5nRXJyb3IgKz0gMTA7XG4gICAgfVxuXG4gICAgLy8gT3ZlcmxhcHBpbmcgZXJyb3JcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBjb25zdCB1cHBlclBhcnRUb0dsb2JhbFNlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaS0xXTtcbiAgICAgICAgY29uc3QgbG93ZXJQYXJ0VG9HbG9iYWxTZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2krMV07XG4gICAgICAgIGlmICh1cHBlclBhcnRUb0dsb2JhbFNlbWl0b25lICE9IHVuZGVmaW5lZCAmJiBmcm9tR2xvYmFsU2VtaXRvbmUgPiB1cHBlclBhcnRUb0dsb2JhbFNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBVcHBlciBwYXJ0IGlzIG1vdmluZyBsb3dlciB0aGFuIHdoZXJlIGxvd2VyIHBhcnQgdXNlZCB0byBiZVxuICAgICAgICAgICAgdGVuc2lvbi5vdmVybGFwcGluZyArPSAxMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG93ZXJQYXJ0VG9HbG9iYWxTZW1pdG9uZSAhPSB1bmRlZmluZWQgJiYgZnJvbUdsb2JhbFNlbWl0b25lIDwgbG93ZXJQYXJ0VG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gTG93ZXIgcGFydCBpcyBtb3ZpbmcgaGlnaGVyIHRoYW4gd2hlcmUgdXBwZXIgcGFydCB1c2VkIHRvIGJlXG4gICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWVsb2R5IHRlbnNpb25cbiAgICAvLyBBdm9pZCBqdW1wcyB0aGF0IGFyZSBhdWcgb3IgN3RoIG9yIGhpZ2hlclxuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgaWYgKGludGVydmFsID49IDMpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID49IDEwKSB7ICAvLyA3dGggPT0gMTBcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSA2IHx8IGludGVydmFsID09IDgpIC8vIHRyaXRvbmUgKGF1ZyA0dGgpIG9yIGF1ZyA1dGhcbiAgICAgICAge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNykge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gOSkge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDI7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDAgcHJpaW1pXG4gICAgLy8gMSBwaWVuaSBzZWt1bnRpXG4gICAgLy8gMiBzdXVyaSBzZWt1bnRpXG4gICAgLy8gMyBwaWVuaSB0ZXJzc2lcbiAgICAvLyA0IHN1dXJpIHRlcnNzaVxuICAgIC8vIDUga3ZhcnR0aVxuICAgIC8vIDYgdHJpdG9udXNcbiAgICAvLyA3IGt2aW50dGlcbiAgICAvLyA4IHBpZW5pIHNla3N0aVxuICAgIC8vIDkgc3V1cmkgc2Vrc3RpXG4gICAgLy8gMTAgcGllbmkgc2VwdGltaVxuICAgIC8vIDExIHN1dXJpIHNlcHRpbWlcbiAgICAvLyAxMiBva3RhYXZpXG5cbiAgICAvLyBXYXMgdGhlcmUgYSBqdW1wIGJlZm9yZT9cbiAgICBpZiAocHJldlBhc3NlZEZyb21Ob3RlcyAmJiBwcmV2UGFzc2VkRnJvbU5vdGVzLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgIGNvbnN0IHByZXZGcm9tR2xvYmFsU2VtaXRvbmVzID0gcHJldlBhc3NlZEZyb21Ob3Rlcy5tYXAoKG4pID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnMocHJldkZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlcmUgd2FzIGEganVtcC4gV0UgTVVTVCBHTyBCQUNLIVxuICAgICAgICAgICAgICAgIC8vIEJhc2ljYWxseSB0aGUgdG9HbG9iYWxTZW1pdG9uZSBtdXN0IGJlIGJldHdlZW4gdGhlIHByZXZGcm9tR2xvYmFsU2VtaXRvbmUgYW5kIHRoZSBmcm9tR2xvYmFsU2VtaXRvbmVcbiAgICAgICAgICAgICAgICAvLyBVTkxFU1Mgd2UncmUgb3V0bGluaW5nIGEgdHJpYWQuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3b3VsZCBtZWFuIHRoYXQgYWZ0ZXIgYSA0dGggdXAsIHdlIG5lZWQgdG8gZ28gdXAgYW5vdGhlciAzcmRcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2RnJvbVNlbWl0b25lID0gcHJldkZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uTXVsdGlwbGllciA9IGZyb21TZW1pdG9uZSA+IHByZXZGcm9tU2VtaXRvbmUgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEludGVydmFsID0gZGlyZWN0aW9uTXVsdGlwbGllciAqICh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlub3IgM3JkIHVwLCB0aGVuIG1haiB0aGlyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWpvciAzcmQgdXAsIHRoZW4gbWlub3IgM3JkIHVwLiBUaGF0J3MgYSByb290IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIHBlcmZlY3QgNHRoIHVwLiBUaGF0J3MgYSBmaXJzdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtaW5vciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyZmVjdCA0dGggdXAsIHRoZW4gbWFqb3IgM3JkIHVwLiBUaGF0J3MgYSBzZWNvbmQgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBIaWdoZXIgdGhhbiB0aGF0LCBubyB0cmlhZCBpcyBwb3NzaWJsZS5cbiAgICAgICAgICAgICAgICBpZiAoKGZyb21TZW1pdG9uZSA+PSBwcmV2RnJvbVNlbWl0b25lICYmIHRvU2VtaXRvbmUgPj0gZnJvbVNlbWl0b25lKSB8fCAoZnJvbVNlbWl0b25lIDw9IHByZXZGcm9tU2VtaXRvbmUgJiYgdG9TZW1pdG9uZSA8PSBmcm9tU2VtaXRvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdCBnb2luZiBiYWNrIGRvd24vdXAuLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGludGVydmFsIDw9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPD0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDE7ICAvLyBOb3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTA7ICAvLyBUZXJyaWJsZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR29pbmcgYmFjayBkb3duL3VwLi4uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tJbnRlcnZhbCA9IE1hdGguYWJzKHRvU2VtaXRvbmUgLSBmcm9tU2VtaXRvbmUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFja0ludGVydmFsID4gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29pbmcgYmFjayB0b28gZmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgIGlmIChpbnRlcnZhbCA8PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDE7ICAvLyBOb3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDsgIC8vIFRlcnJpYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gdG9HbG9iYWxTZW1pdG9uZSAtIGZyb21HbG9iYWxTZW1pdG9uZTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VOb3RlID0gcGFyYW1zLnBhcnRzW2ldLm5vdGUgfHwgXCJGNFwiO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZSA9IGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKGJhc2VOb3RlKSlcbiAgICAgICAgICAgIGNvbnN0IHNlbWl0b25lTGltaXQgPSBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZSArIDEyXVxuXG4gICAgICAgICAgICBsZXQgdGFyZ2V0Tm90ZSA9IHNlbWl0b25lTGltaXRbMV0gLSA0O1xuICAgICAgICAgICAgdGFyZ2V0Tm90ZSAtPSBpICogMjtcblxuICAgICAgICAgICAgbGV0IHRhcmdldE5vdGVSZWFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRpdmlzaW9uIGluIGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdGVzID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByZXZOb3RlIG9mIG5vdGVzLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbFNlbWl0b25lKHByZXZOb3RlLm5vdGUpID09IHRhcmdldE5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE5vdGVSZWFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXJnZXROb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lIC0gdGFyZ2V0Tm90ZSkgPCAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGNsb3NlIHRvIHRoZSB0YXJnZXQgbm90ZSwgbGV0J3MgTk9UIGdvIHRoZXJlIGFueSBtb3JlXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbnNpb247XG59XG4iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2xvYmFsU2VtaXRvbmUsIE1haW5NdXNpY1BhcmFtcywgTXVzaWNQYXJhbXMsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbnR5cGUgTm9uQ2hvcmRUb25lID0ge1xuICAgIG5vdGU6IE5vdGUsXG4gICAgc3Ryb25nQmVhdDogYm9vbGVhbixcbiAgICByZXBsYWNlbWVudD86IGJvb2xlYW4sXG59XG5cbnR5cGUgTm9uQ2hvcmRUb25lUGFyYW1zID0ge1xuICAgIGdUb25lMDogbnVtYmVyLFxuICAgIGdUb25lMTogbnVtYmVyLFxuICAgIGdUb25lMjogbnVtYmVyLFxuICAgIHNjYWxlOiBTY2FsZSxcbiAgICBnVG9uZUxpbWl0czogbnVtYmVyW10sXG59XG5cblxuY29uc3QgYWRkTm90ZUJldHdlZW4gPSAobmFjOiBOb25DaG9yZFRvbmUsIGRpdmlzaW9uOiBudW1iZXIsIG5leHREaXZpc2lvbjogbnVtYmVyLCBwYXJ0SW5kZXg6IG51bWJlciwgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZGl2aXNpb25EaWZmID0gbmV4dERpdmlzaW9uIC0gZGl2aXNpb247XG4gICAgY29uc3QgYmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gfHwgW10pLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgaWYgKCFiZWF0UmljaE5vdGUgfHwgIWJlYXRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2U2NhbGVUb25lcyA9IGJlYXRSaWNoTm90ZS5zY2FsZS5ub3Rlcy5tYXAobiA9PiBuLnNlbWl0b25lKTtcbiAgICBjb25zdCBuZXh0QmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tuZXh0RGl2aXNpb25dIHx8IFtdKS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgIGlmICghbmV4dEJlYXRSaWNoTm90ZSB8fCAhbmV4dEJlYXRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdOb3RlID0gbmFjLm5vdGU7XG4gICAgY29uc3Qgc3Ryb25nQmVhdCA9IG5hYy5zdHJvbmdCZWF0O1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gbmFjLnJlcGxhY2VtZW50IHx8IGZhbHNlO1xuXG4gICAgLy8gSWYgc3Ryb25nIGJlYXQsIHdlIGFkZCBuZXdOb3RlIEJFRk9SRSBiZWF0UmljaE5vdGVcbiAgICAvLyBPdGhlcndpc2Ugd2UgYWRkIG5ld05vdGUgQUZURVIgYmVhdFJpY2hOb3RlXG5cbiAgICBpZiAoc3Ryb25nQmVhdCkge1xuICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdIHx8IFtdO1xuICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZSA9IHtcbiAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gMixcbiAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIG5ldyB0b25lIHRvIGRpdmlzaW9uXG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIC8vIFJlbW92ZSBiZWF0UmljaE5vdGUgZnJvbSBkaXZpc2lvblxuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5maWx0ZXIobm90ZSA9PiBub3RlICE9IGJlYXRSaWNoTm90ZSk7XG4gICAgICAgIGlmICghcmVwbGFjZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIEFkZCBiZWF0UmljaE5vdGUgdG8gZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKGJlYXRSaWNoTm90ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBZGQgbmV3IHRvbmUgYWxzbyB0byBkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDIsXG4gICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICB9XG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5jb25zdCBwYXNzaW5nVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gUmV0dXJuIGEgbmV3IGdUb25lIG9yIG51bGwsIGJhc2VkIG9uIHdoZXRoZXIgYWRkaW5nIGEgcGFzc2luZyB0b25lIGlzIGEgZ29vZCBpZGVhLlxuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoZ1RvbmUxIC0gZ1RvbmUyKTtcbiAgICBpZiAoZGlzdGFuY2UgPCAzIHx8IGRpc3RhbmNlID4gNCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVUb25lcyA9IHNjYWxlLm5vdGVzLm1hcChuID0+IG4uc2VtaXRvbmUpO1xuICAgIGZvciAobGV0IGdUb25lPWdUb25lMTsgZ1RvbmUgIT0gZ1RvbmUyOyBnVG9uZSArPSAoZ1RvbmUxIDwgZ1RvbmUyID8gMSA6IC0xKSkge1xuICAgICAgICBpZiAoZ1RvbmUgPT0gZ1RvbmUxKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IGdUb25lICUgMTI7XG4gICAgICAgIGlmIChzY2FsZVRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgc3Ryb25nQmVhdDogZmFsc2UsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuY29uc3QgbmVpZ2hib3JUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwLCB0aGVuIHN0ZXAgYmFjay4gVGhpcyBpcyBvbiBXZWFrIGJlYXRcbiAgICBpZiAoZ1RvbmUxICE9IGdUb25lMikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVJbmRleCA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgdXBPckRvd25DaG9pY2VzID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFsxLCAtMV0gOiBbLTEsIDFdO1xuICAgIGZvciAoY29uc3QgdXBPckRvd24gb2YgdXBPckRvd25DaG9pY2VzKSB7XG4gICAgICAgIGNvbnN0IG5ld0d0b25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgICAgIGlmICghbmV3R3RvbmUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdHdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IG5ld0d0b25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IG5ld0d0b25lICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IobmV3R3RvbmUgLyAxMiksXG4gICAgICAgIH0pLCBzdHJvbmdCZWF0OiBmYWxzZX07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmNvbnN0IHN1c3BlbnNpb24gPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBET1dOIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdC5cbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMCAtIGdUb25lMTtcbiAgICBpZiAoZGlzdGFuY2UgPCAxIHx8IGRpc3RhbmNlID4gMikge1xuICAgICAgICAvLyBNdXN0IGJlIGhhbGYgb3Igd2hvbGUgc3RlcCBkb3duLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGdUb25lMSB0byBnVG9uZTAgZm9yIHRoZSBsZW5ndGggb2YgdGhlIHN1c3BlbnNpb24uXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cm9uZ0JlYXQ6IHRydWUsXG4gICAgfVxufVxuXG5cbmNvbnN0IHJldGFyZGF0aW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGF5IG9uIHByZXZpb3VzLCB0aGVuIHN0ZXAgVVAgaW50byBjaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgLy8gVXN1YWxseSBkb3R0ZWQhXG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChkaXN0YW5jZSA8IDEgfHwgZGlzdGFuY2UgPiAyKSB7XG4gICAgICAgIC8vIE11c3QgYmUgaGFsZiBvciB3aG9sZSBzdGVwIHVwLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGdUb25lMSB0byBnVG9uZTAgZm9yIHRoZSBsZW5ndGggb2YgdGhlIHN1c3BlbnNpb24uXG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07fVxuXG5cbmNvbnN0IGFwcG9naWF0dXJhID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBMZWFwLCB0aGVuIHN0ZXAgYmFjayBpbnRvIENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gLTE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXBwb2dpYXR1cmFcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCB1cCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBhcHBvZ2lhdHVyYVxuICAgICAgICB1cE9yRG93biA9IDE7XG4gICAgfVxuICAgIGNvbnN0IGdUb25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgaWYgKCFnVG9uZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O1xufVxuXG5jb25zdCBlc2NhcGVUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIGF3YXksIHRoZW4gTGVhcCBpbiB0byBuZXh0IENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gMTtcbiAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgdXAgZnJvbSBnVG9uZTAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZXNjYXBlVG9uZVxuICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZnJvbSBnVG9uZTAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZXNjYXBlVG9uZVxuICAgICAgICB1cE9yRG93biA9IC0xO1xuICAgIH1cbiAgICBjb25zdCBnVG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUwLCB1cE9yRG93biwgc2NhbGUpO1xuICAgIGlmICghZ1RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTtcbn1cblxuY29uc3QgYW50aWNpcGF0aW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIG9yIGxlYXAgZWFybHkgaW4gdG8gbmV4dCBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIHdlYWsgYmVhdC5cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMiAtIGdUb25lMTtcbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2UpIDwgMSkge1xuICAgICAgICAvLyBUb28gY2xvc2UgdG8gYmUgYW4gYW50aWNpcGF0aW9uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEVhc3kuIEp1c3QgbWFrZSBhIG5ldyBub3RlIHRoYXRzIHRoZSBzYW1lIGFzIGdUb25lMi5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMiAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUyIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiBmYWxzZX07XG59XG5cbmNvbnN0IG5laWdoYm9yR3JvdXAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgYXdheSwgdGhlbiBsZWFwIGludG8gdGhlIFwib3RoZXIgcG9zc2libGVcIiBuZWlnaGJvciB0b25lLiBUaGlzIHVzZXMgMTZ0aHMgKHR3byBub3RlcykuXG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuY29uc3QgcGVkYWxQb2ludCA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIG5vdGUgd2l0aCB0aGUgbm90ZSB0aGF0IGlzIGJlZm9yZSBpdCBBTkQgYWZ0ZXIgaXQuXG4gICAgaWYgKGdUb25lMCAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZTAgPT0gZ1RvbmUxKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gQWxyZWFkeSBleGlzdHNcbiAgICB9XG4gICAgaWYgKGdUb25lMSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lMSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlLCByZXBsYWNlbWVudDogdHJ1ZX07XG59XG5cblxuZXhwb3J0IGNvbnN0IGJ1aWxkVG9wTWVsb2R5ID0gKGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSA9PiB7XG4gICAgLy8gQ29udmVydCB0d28gNHRoIG5vdGVzLCBpZiBwb3NzaWJsZSwgdG8gdHdvIDh0aCBub3Rlcy5cbiAgICBjb25zdCBsYXN0RGl2aXNpb24gPSBCRUFUX0xFTkdUSCAqIG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcbiAgICBjb25zdCBmaXJzdFBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoMCk7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKGZpcnN0UGFyYW1zKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdERpdmlzaW9uIC0gQkVBVF9MRU5HVEg7IGkgKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IGdUb25lTGltaXRzRm9yVGhpc0JlYXQgPSBbXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMF1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzFdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1syXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbM11dLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGkpO1xuXG4gICAgICAgIGNvbnN0IGxhc3RCZWF0SW5DYWRlbmNlID0gcGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kIDwgMlxuICAgICAgICBpZiAobGFzdEJlYXRJbkNhZGVuY2UpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIC8vIENoYW5nZSBsaW1pdHMsIG5ldyBub3RlcyBtdXN0IGFsc28gYmUgYmV0d2VlZW4gdGhlIG90aGVyIHBhcnQgbm90ZXNcbiAgICAgICAgICAgIC8vICggT3ZlcmxhcHBpbmcgKVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBkaXZpc2lvbmVkTm90ZXNbaV0uZmlsdGVyKG5vdGUgPT4gbm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KVswXTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGRpdmlzaW9uZWROb3Rlc1tpICsgQkVBVF9MRU5HVEhdLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnVG9uZTEgPSBnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lMiA9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IG1pbkdUb25lID0gTWF0aC5taW4oZ1RvbmUxLCBnVG9uZTIpO1xuICAgICAgICAgICAgY29uc3QgbWF4R1RvbmUgPSBNYXRoLm1heChnVG9uZTEsIGdUb25lMik7XG4gICAgICAgICAgICBpZiAoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXSkge1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHRoZSBoaWdoZXIgcGFydCwgaXQgY2FuJ3QgZ28gbG93ZXIgdGhhbiBtYXhHVG9uZVxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV1bMF0gPSBNYXRoLm1heChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdWzBdLCBtYXhHVG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXSkge1xuICAgICAgICAgICAgICAgIC8vIExpbWl0IHRoZSBsb3dlciBwYXJ0LCBpdCBjYW4ndCBnbyBoaWdoZXIgdGhhbiBtaW5HVG9uZVxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV1bMV0gPSBNYXRoLm1pbihnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdWzFdLCBtaW5HVG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgLy8gSXMgdGhpcyBhIGdvb2QgcGFydCB0byBhZGQgZWlnaHRocz9cbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZGl2aXNpb25lZE5vdGVzW2ldLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBkaXZpc2lvbmVkTm90ZXNbaSArIEJFQVRfTEVOR1RIXS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHByZXZSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbaSAtIEJFQVRfTEVOR1RIXSB8fCBbXSkuZmlsdGVyKG5vdGUgPT4gbm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KVswXTtcbiAgICAgICAgICAgIGlmICghcHJldlJpY2hOb3RlIHx8ICFwcmV2UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIHByZXZSaWNoTm90ZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnVG9uZTEgPSBnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lMiA9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGxldCBnVG9uZTAgPSBwcmV2UmljaE5vdGUgPyBnbG9iYWxTZW1pdG9uZShwcmV2UmljaE5vdGUubm90ZSkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGdUb25lMCAmJiBwcmV2UmljaE5vdGUuZHVyYXRpb24gIT0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAvLyBGSVhNRTogcHJldlJpY2hOb3RlIGlzIG5vdCB0aGUgcHJldmlvdXMgbm90ZS4gV2UgY2Fubm90IHVzZSBpdCB0byBkZXRlcm1pbmUgdGhlIHByZXZpb3VzIG5vdGUuXG4gICAgICAgICAgICAgICAgZ1RvbmUwID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5hY1BhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZTAsXG4gICAgICAgICAgICAgICAgZ1RvbmUxLFxuICAgICAgICAgICAgICAgIGdUb25lMixcbiAgICAgICAgICAgICAgICBzY2FsZTogcmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHM6IGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4XSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAgICAgICAgIHBhc3NpbmdUb25lOiAoKSA9PiBwYXNzaW5nVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yVG9uZTogKCkgPT4gbmVpZ2hib3JUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgc3VzcGVuc2lvbjogKCkgPT4gc3VzcGVuc2lvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHJldGFyZGF0aW9uOiAoKSA9PiByZXRhcmRhdGlvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIGFwcG9naWF0dXJhOiAoKSA9PiBhcHBvZ2lhdHVyYShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIGVzY2FwZVRvbmU6ICgpID0+IGVzY2FwZVRvbmUobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBhbnRpY2lwYXRpb246ICgpID0+IGFudGljaXBhdGlvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yR3JvdXA6ICgpID0+IG5laWdoYm9yR3JvdXAobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBwZWRhbFBvaW50OiAoKSA9PiBwZWRhbFBvaW50KG5hY1BhcmFtcyksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbm9uQ2hvcmRUb25lQ2hvaWNlczoge1trZXk6IHN0cmluZ106IE5vbkNob3JkVG9uZX0gPSB7fVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3MpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IHBhcmFtcy5ub25DaG9yZFRvbmVzW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5nIHx8ICFzZXR0aW5nLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZSA9IG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzW2tleV0oKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hvaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSA9IGNob2ljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYXJ0SW5kZXggIT0gMykge1xuICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZUNob2ljZXMucGVkYWxQb2ludCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmUgPSBudWxsO1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG5vbkNob3JkVG9uZUNob2ljZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZSA9IG5vbkNob3JkVG9uZUNob2ljZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYWRkTm90ZUJldHdlZW4obm9uQ2hvcmRUb25lLCBpLCBpICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCwgZGl2aXNpb25lZE5vdGVzKTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNlbWl0b25lIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuXG5leHBvcnQgY29uc3QgQkVBVF9MRU5HVEggPSAxMjtcblxuXG5leHBvcnQgY29uc3Qgc2VtaXRvbmVEaXN0YW5jZSA9ICh0b25lMTogbnVtYmVyLCB0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gZGlzdGFuY2UgZnJvbSAwIHRvIDExIHNob3VsZCBiZSAxXG4gICAgLy8gMCAtIDExICsgMTIgPT4gMVxuICAgIC8vIDExIC0gMCArIDEyID0+IDIzID0+IDExXG5cbiAgICAvLyAwIC0gNiArIDEyID0+IDZcbiAgICAvLyA2IC0gMCArIDEyID0+IDE4ID0+IDZcblxuICAgIC8vIDAgKyA2IC0gMyArIDYgPSA2IC0gOSA9IC0zXG4gICAgLy8gNiArIDYgLSA5ICsgNiA9IDEyIC0gMTUgPSAwIC0gMyA9IC0zXG4gICAgLy8gMTEgKyA2IC0gMCArIDYgPSAxNyAtIDYgPSA1IC0gNiA9IC0xXG4gICAgLy8gMCArIDYgLSAxMSArIDYgPSA2IC0gMTcgPSA2IC0gNSA9IDFcblxuICAgIC8vICg2ICsgNikgJSAxMiA9IDBcbiAgICAvLyAoNSArIDYpICUgMTIgPSAxMVxuICAgIC8vIFJlc3VsdCA9IDExISEhIVxuXG4gICAgcmV0dXJuIE1hdGgubWluKFxuICAgICAgICBNYXRoLmFicyh0b25lMSAtIHRvbmUyKSxcbiAgICAgICAgTWF0aC5hYnMoKHRvbmUxICsgNikgJSAxMiAtICh0b25lMiArIDYpICUgMTIpXG4gICAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleCA9IChzY2FsZTogU2NhbGUpOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0+ICh7XG4gICAgW3NjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCxcbiAgICBbc2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLFxuICAgIFtzY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsXG4gICAgW3NjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMyxcbiAgICBbc2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LFxuICAgIFtzY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsXG4gICAgW3NjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNixcbn0pXG5cblxuZXhwb3J0IGNvbnN0IG5leHRHVG9uZUluU2NhbGUgPSAoZ1RvbmU6IFNlbWl0b25lLCBpbmRleERpZmY6IG51bWJlciwgc2NhbGU6IFNjYWxlKTogTnVsbGFibGU8bnVtYmVyPiA9PiB7XG4gICAgbGV0IGdUb25lMSA9IGdUb25lO1xuICAgIGNvbnN0IHNjYWxlSW5kZXhlcyA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlcbiAgICBsZXQgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIGdUb25lMSA9IGdUb25lICsgMTtcbiAgICAgICAgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgfVxuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSAtIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5ld1NjYWxlSW5kZXggPSAoc2NhbGVJbmRleCArIGluZGV4RGlmZikgJSA3O1xuICAgIGNvbnN0IG5ld1NlbWl0b25lID0gc2NhbGUubm90ZXNbbmV3U2NhbGVJbmRleF0uc2VtaXRvbmU7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBzZW1pdG9uZURpc3RhbmNlKGdUb25lMSAlIDEyLCBuZXdTZW1pdG9uZSk7XG4gICAgY29uc3QgbmV3R3RvbmUgPSBnVG9uZTEgKyAoZGlzdGFuY2UgKiAoaW5kZXhEaWZmID4gMCA/IDEgOiAtMSkpO1xuXG4gICAgcmV0dXJuIG5ld0d0b25lO1xufVxuXG5cbmV4cG9ydCBjb25zdCBzdGFydGluZ05vdGVzID0gKHBhcmFtczogTXVzaWNQYXJhbXMpID0+IHsgIFxuICAgIGNvbnN0IHAxTm90ZSA9IHBhcmFtcy5wYXJ0c1swXS5ub3RlIHx8IFwiRjRcIjtcbiAgICBjb25zdCBwMk5vdGUgPSBwYXJhbXMucGFydHNbMV0ubm90ZSB8fCBcIkM0XCI7XG4gICAgY29uc3QgcDNOb3RlID0gcGFyYW1zLnBhcnRzWzJdLm5vdGUgfHwgXCJBM1wiO1xuICAgIGNvbnN0IHA0Tm90ZSA9IHBhcmFtcy5wYXJ0c1szXS5ub3RlIHx8IFwiQzNcIjtcblxuICAgIGNvbnN0IHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzID0gW1xuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwMU5vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDJOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAzTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwNE5vdGUpKSxcbiAgICBdXG5cbiAgICBjb25zdCBzZW1pdG9uZUxpbWl0cyA9IFtcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzBdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1swXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1sxXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMl0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzNdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIDEyIC0gNV0sXG4gICAgXVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLFxuICAgICAgICBzZW1pdG9uZUxpbWl0cyxcbiAgICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGdUb25lU3RyaW5nID0gKGdUb25lOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgfSkudG9TdHJpbmcoKVxufVxuXG5cbmV4cG9ydCBjb25zdCBhcnJheU9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXk6IEFycmF5PGFueT4sIHNlbGVjdG9yOiBDYWxsYWJsZUZ1bmN0aW9uLCBkZXNjID0gZmFsc2UpIHtcbiAgICByZXR1cm4gWy4uLmFycmF5XS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSBzZWxlY3RvcihhKTtcbiAgICAgICAgYiA9IHNlbGVjdG9yKGIpO1xuXG4gICAgICAgIGlmIChhID09IGIpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gKGRlc2MgPyBhID4gYiA6IGEgPCBiKSA/IC0xIDogMTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRUZW1wbGF0ZXM6IHsgW2tleTogc3RyaW5nXTogQXJyYXk8bnVtYmVyPiB9ID0ge1xuICAgIG1hajogWzAsIDQsIDddLFxuICAgIG1pbjogWzAsIDMsIDddLFxuICAgIGRpbTogWzAsIDMsIDZdLFxuICAgIGF1ZzogWzAsIDQsIDhdLFxuICAgIG1hajc6IFswLCA0LCA3LCAxMV0sXG4gICAgbWluNzogWzAsIDMsIDcsIDEwXSxcbiAgICBkb203OiBbMCwgNCwgNywgMTBdLFxuICAgIHN1czI6IFswLCAyLCA3XSxcbiAgICBzdXM0OiBbMCwgNSwgN10sXG59XG5cblxuZXhwb3J0IGNsYXNzIENob3JkIHtcbiAgICBwdWJsaWMgbm90ZXM6IEFycmF5PE5vdGU+O1xuICAgIHB1YmxpYyByb290OiBudW1iZXI7XG4gICAgcHVibGljIGNob3JkVHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgLy8gRmluZCBjb3JyZWN0IFNlbWl0b25lIGtleVxuICAgICAgICBjb25zdCBzZW1pdG9uZUtleXMgPSBPYmplY3Qua2V5cyhTZW1pdG9uZSkuZmlsdGVyKGtleSA9PiAoU2VtaXRvbmUgYXMgYW55KVtrZXldIGFzIG51bWJlciA9PT0gdGhpcy5ub3Rlc1swXS5zZW1pdG9uZSk7XG4gICAgICAgIGlmIChzZW1pdG9uZUtleXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vdGVzLm1hcChub3RlID0+IG5vdGUudG9TdHJpbmcoKSkuam9pbihcIiwgXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZW1pdG9uZUtleSA9IHNlbWl0b25lS2V5cy5maWx0ZXIoa2V5ID0+IGtleS5pbmRleE9mKCdiJykgPT0gLTEgJiYga2V5LmluZGV4T2YoJ3MnKSA9PSAtMSlbMF0gfHwgc2VtaXRvbmVLZXlzWzBdO1xuICAgICAgICBzZW1pdG9uZUtleSA9IHNlbWl0b25lS2V5LnJlcGxhY2UoJ3MnLCAnIycpO1xuICAgICAgICByZXR1cm4gc2VtaXRvbmVLZXkgKyB0aGlzLmNob3JkVHlwZTtcbiAgICB9XG4gICAgY29uc3RydWN0b3Ioc2VtaXRvbmVPck5hbWU6IG51bWJlciB8IHN0cmluZywgY2hvcmRUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHNlbWl0b25lO1xuICAgICAgICBpZiAodHlwZW9mIHNlbWl0b25lT3JOYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHNlbWl0b25lT3JOYW1lLm1hdGNoKC9eXFxkKy8pO1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHNlbWl0b25lT3JOYW1lLm1hdGNoKC9eXFxkKyguKikvKTtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGNob3JkIG5hbWUgXCIgKyBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJzZWRUeXBlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkludmFsaWQgY2hvcmQgbmFtZSBcIiArIHNlbWl0b25lT3JOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VtaXRvbmUgPSBwYXJzZUludChzZW1pdG9uZVswXSk7XG4gICAgICAgICAgICBjaG9yZFR5cGUgPSBjaG9yZFR5cGUgfHwgcGFyc2VkVHlwZVsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbWl0b25lID0gc2VtaXRvbmVPck5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290ID0gcGFyc2VJbnQoYCR7c2VtaXRvbmV9YCk7XG4gICAgICAgIHRoaXMuY2hvcmRUeXBlID0gY2hvcmRUeXBlO1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGNob3JkVGVtcGxhdGVzW2Nob3JkVHlwZV07XG4gICAgICAgIGlmICh0ZW1wbGF0ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IFwiVW5rbm93biBjaG9yZCB0eXBlOiBcIiArIGNob3JkVHlwZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vdGVzID0gW107XG4gICAgICAgIGZvciAobGV0IG5vdGUgb2YgdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMubm90ZXMucHVzaChuZXcgTm90ZSh7c2VtaXRvbmU6IChzZW1pdG9uZSArIG5vdGUpICUgMTIsIG9jdGF2ZTogMX0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgdHlwZSBOdWxsYWJsZTxUPiA9IFQgfCBudWxsXG5cbmV4cG9ydCBjbGFzcyBNYWluTXVzaWNQYXJhbXMge1xuICAgIGJlYXRzUGVyQmFyPzogbnVtYmVyID0gNDtcbiAgICBjYWRlbmNlQ291bnQ/OiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VzOiBBcnJheTxNdXNpY1BhcmFtcz4gPSBbXTtcbiAgICB0ZXN0TW9kZT86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNYWluTXVzaWNQYXJhbXM+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSAocGFyYW1zIGFzIGFueSlba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uOiBudW1iZXIpOiBNdXNpY1BhcmFtcyB7XG4gICAgICAgIGNvbnN0IGJlYXQgPSBNYXRoLmZsb29yKGRpdmlzaW9uIC8gQkVBVF9MRU5HVEgpO1xuICAgICAgICBjb25zdCBiYXIgPSBNYXRoLmZsb29yKGJlYXQgLyB0aGlzLmJlYXRzUGVyQmFyKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNhZGVuY2VQYXJhbXMgb2YgdGhpcy5jYWRlbmNlcykge1xuICAgICAgICAgICAgY291bnRlciArPSBjYWRlbmNlUGFyYW1zLmJhcnNQZXJDYWRlbmNlO1xuICAgICAgICAgICAgaWYgKGJhciA8IGNvdW50ZXIpIHtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kID0gY291bnRlciAqIHRoaXMuYmVhdHNQZXJCYXIgLSBiZWF0O1xuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbFNvbmdFbmQgPSB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhciAtIGJlYXQ7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1BlckJhciA9IHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhZGVuY2VQYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNYXhCZWF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FkZW5jZXMucmVkdWNlKChhLCBiKSA9PiBhICsgYi5iYXJzUGVyQ2FkZW5jZSwgMCkgKiB0aGlzLmJlYXRzUGVyQmFyO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE11c2ljUGFyYW1zIHtcbiAgICBiZWF0c1VudGlsQ2FkZW5jZUVuZDogbnVtYmVyID0gMDtcbiAgICBiZWF0c1VudGlsU29uZ0VuZDogbnVtYmVyID0gMDtcbiAgICBiZWF0c1BlckJhcjogbnVtYmVyID0gNDtcblxuICAgIGJhc2VUZW5zaW9uPzogbnVtYmVyID0gMC4zO1xuICAgIGJhcnNQZXJDYWRlbmNlPzogbnVtYmVyID0gMlxuICAgIHRlbXBvPzogbnVtYmVyID0gNDA7XG4gICAgaGFsZk5vdGVzPzogYm9vbGVhbiA9IHRydWU7XG4gICAgc2l4dGVlbnRoTm90ZXM/OiBudW1iZXIgPSAwLjI7XG4gICAgZWlnaHRoTm90ZXM/OiBudW1iZXIgPSAwLjQ7XG4gICAgbW9kdWxhdGlvbldlaWdodD86IG51bWJlciA9IDA7XG4gICAgbGVhZGluZ1dlaWdodD86IG51bWJlciA9IDI7XG4gICAgcGFydHM6IEFycmF5PHtcbiAgICAgICAgdm9pY2U6IHN0cmluZyxcbiAgICAgICAgbm90ZTogc3RyaW5nLFxuICAgICAgICB2b2x1bWU6IHN0cmluZyxcbiAgICB9PiA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdm9pY2U6IFwiNDJcIixcbiAgICAgICAgICAgIG5vdGU6IFwiQzVcIixcbiAgICAgICAgICAgIHZvbHVtZTogXCIxMFwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB2b2ljZTogXCI0MlwiLFxuICAgICAgICAgICAgbm90ZTogXCJBNFwiLFxuICAgICAgICAgICAgdm9sdW1lOiBcIjdcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdm9pY2U6IFwiNDJcIixcbiAgICAgICAgICAgIG5vdGU6IFwiQzRcIixcbiAgICAgICAgICAgIHZvbHVtZTogXCI3XCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZvaWNlOiBcIjQyXCIsXG4gICAgICAgICAgICBub3RlOiBcIkUzXCIsXG4gICAgICAgICAgICB2b2x1bWU6IFwiMTBcIixcbiAgICAgICAgfVxuICAgIF07XG4gICAgYmVhdFNldHRpbmdzOiBBcnJheTx7XG4gICAgICAgIHRlbnNpb246IG51bWJlcixcbiAgICB9PiA9IFtdO1xuICAgIGNob3JkU2V0dGluZ3M6IHtba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgIH19ID0ge1xuICAgICAgICBtYWo6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIG1pbjoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZGltOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGF1Zzoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbWFqNzoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZG9tNzoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICB9XG4gICAgc2NhbGVTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXJcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgIG1ham9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBtaW5vcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHNlbGVjdGVkQ2FkZW5jZTogc3RyaW5nID0gXCJIQ1wiO1xuICAgIG5vbkNob3JkVG9uZXM6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgcGFzc2luZ1RvbmU6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIG5laWdoYm9yVG9uZToge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHN1c3BlbnNpb246IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHJldGFyZGF0aW9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICB9LFxuICAgICAgICBhcHBvZ2lhdHVyYToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBlVG9uZToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgYW50aWNpcGF0aW9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbmVpZ2hib3JHcm91cDoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgcGVkYWxQb2ludDoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICB9XG5cblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNdXNpY1BhcmFtcz4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IChwYXJhbXMgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQmVhdFNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQmVhdFNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBiZWF0Q291bnQgPSB0aGlzLmJlYXRzUGVyQmFyICogdGhpcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA8IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aDsgaSA8IGJlYXRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRoaXMuYmFzZVRlbnNpb25cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJlYXRTZXR0aW5ncy5sZW5ndGggPiBiZWF0Q291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuYmVhdFNldHRpbmdzID0gdGhpcy5iZWF0U2V0dGluZ3Muc2xpY2UoMCwgYmVhdENvdW50KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgdHlwZSBNdXNpY1Jlc3VsdCA9IHtcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIHNjYWxlOiBTY2FsZSxcbn1cblxuZXhwb3J0IHR5cGUgUmljaE5vdGUgPSB7XG4gICAgbm90ZTogTm90ZSxcbiAgICBkdXJhdGlvbjogbnVtYmVyLFxuICAgIGZyZXE/OiBudW1iZXIsXG4gICAgY2hvcmQ/OiBDaG9yZCxcbiAgICBwYXJ0SW5kZXg/OiBudW1iZXIsXG4gICAgc2NhbGU/OiBTY2FsZSxcbiAgICBiZWFtPzogc3RyaW5nLFxuICAgIHRpZT86IHN0cmluZyxcbiAgICB0ZW5zaW9uPzogVGVuc2lvbixcbiAgICBpbnZlcnNpb25OYW1lPzogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBEaXZpc2lvbmVkUmljaG5vdGVzID0ge1xuICAgIFtrZXk6IG51bWJlcl06IEFycmF5PFJpY2hOb3RlPixcbn1cblxuZXhwb3J0IGNvbnN0IGdsb2JhbFNlbWl0b25lID0gKG5vdGU6IE5vdGUpID0+IHtcbiAgICByZXR1cm4gbm90ZS5zZW1pdG9uZSArICgobm90ZS5vY3RhdmUpICogMTIpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0Q2xvc2VzdE9jdGF2ZSA9IChub3RlOiBOb3RlLCB0YXJnZXROb3RlOiBOdWxsYWJsZTxOb3RlPiA9IG51bGwsIHRhcmdldFNlbWl0b25lOiBOdWxsYWJsZTxudW1iZXI+ID0gbnVsbCkgPT4ge1xuICAgIC8vIFxuICAgIGxldCBzZW1pdG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuICAgIHRhcmdldFNlbWl0b25lID0gdGFyZ2V0U2VtaXRvbmUgfHwgZ2xvYmFsU2VtaXRvbmUodGFyZ2V0Tm90ZSk7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZTogXCIsIHNlbWl0b25lLCB0YXJnZXRTZW1pdG9uZSk7XG4gICAgLy8gVXNpbmcgbW9kdWxvIGhlcmUgLT4gLTcgJSAxMiA9IC03XG4gICAgLy8gLTEzICUgMTIgPSAtMVxuICAgIGlmIChzZW1pdG9uZSA9PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICByZXR1cm4gbm90ZS5vY3RhdmU7XG4gICAgfVxuICAgIGNvbnN0IGRlbHRhOiBudW1iZXIgPSB0YXJnZXRTZW1pdG9uZSA+IHNlbWl0b25lID8gMTIgOiAtMTI7XG4gICAgbGV0IHJldCA9IDA7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGNsZWFuT2N0YXZlID0gKG9jdGF2ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChvY3RhdmUsIDIpLCA2KTtcbiAgICB9XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZmluaXRlIGxvb3BcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VtaXRvbmUgKz0gZGVsdGE7XG4gICAgICAgIHJldCArPSBkZWx0YSAvIDEyOyAgLy8gSG93IG1hbnkgb2N0YXZlcyB3ZSBjaGFuZ2VkXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA+PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lIC0gMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA8PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lICsgMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlQ2lyY2xlOiB7IFtrZXk6IG51bWJlcl06IEFycmF5PG51bWJlcj4gfSA9IHt9XG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DXSA9IFtTZW1pdG9uZS5HLCBTZW1pdG9uZS5GXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR10gPSBbU2VtaXRvbmUuRCwgU2VtaXRvbmUuQ11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkRdID0gW1NlbWl0b25lLkEsIFNlbWl0b25lLkddXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BXSA9IFtTZW1pdG9uZS5FLCBTZW1pdG9uZS5EXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRV0gPSBbU2VtaXRvbmUuQiwgU2VtaXRvbmUuQV1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJdID0gW1NlbWl0b25lLkZzLCBTZW1pdG9uZS5FXVxuXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5GXSA9IFtTZW1pdG9uZS5DLCBTZW1pdG9uZS5CYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJiXSA9IFtTZW1pdG9uZS5GLCBTZW1pdG9uZS5FYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkViXSA9IFtTZW1pdG9uZS5CYiwgU2VtaXRvbmUuQWJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BYl0gPSBbU2VtaXRvbmUuRWIsIFNlbWl0b25lLkRiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRGJdID0gW1NlbWl0b25lLkFiLCBTZW1pdG9uZS5HYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkdiXSA9IFtTZW1pdG9uZS5EYiwgU2VtaXRvbmUuQ2JdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DYl0gPSBbU2VtaXRvbmUuR2IsIFNlbWl0b25lLkZiXVxuXG5cbmV4cG9ydCBjb25zdCBtYWpTY2FsZURpZmZlcmVuY2UgPSAoc2VtaXRvbmUxOiBudW1iZXIsIHNlbWl0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gR2l2ZW4gdHdvIG1ham9yIHNjYWxlcywgcmV0dXJuIGhvdyBjbG9zZWx5IHJlbGF0ZWQgdGhleSBhcmVcbiAgICAvLyAwID0gc2FtZSBzY2FsZVxuICAgIC8vIDEgPSBFLkcuIEMgYW5kIEYgb3IgQyBhbmQgR1xuICAgIGxldCBjdXJyZW50VmFsID0gbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmUxXTtcbiAgICBpZiAoc2VtaXRvbmUxID09IHNlbWl0b25lMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsLmluY2x1ZGVzKHNlbWl0b25lMikpIHtcbiAgICAgICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdDdXJyZW50VmFsID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbWl0b25lIG9mIGN1cnJlbnRWYWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3U2VtaXRvbmUgb2YgbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmVdKSB7XG4gICAgICAgICAgICAgICAgbmV3Q3VycmVudFZhbC5hZGQobmV3U2VtaXRvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRWYWwgPSBbLi4ubmV3Q3VycmVudFZhbF0gYXMgQXJyYXk8bnVtYmVyPjtcbiAgICB9XG4gICAgcmV0dXJuIDEyO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IG1ha2VNdXNpYywgYnVpbGRUYWJsZXMsIG1ha2VNZWxvZHkgfSBmcm9tIFwiLi9zcmMvY2hvcmRzXCJcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzLCBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmJ1aWxkVGFibGVzKClcblxuc2VsZi5vbm1lc3NhZ2UgPSAoZXZlbnQ6IHsgZGF0YTogeyBwYXJhbXM6IHN0cmluZywgbmV3TWVsb2R5OiB1bmRlZmluZWQgfCBib29sZWFuLCBnaXZlVXA6IHVuZGVmaW5lZCB8IGJvb2xlYW4gfSB9KSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IE1haW5NdXNpY1BhcmFtcyhKU09OLnBhcnNlKGV2ZW50LmRhdGEucGFyYW1zIHx8IFwie31cIikpO1xuXG4gICAgaWYgKGV2ZW50LmRhdGEubmV3TWVsb2R5KSB7XG4gICAgICAgIG1ha2VNZWxvZHkoKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMsIHBhcmFtcyk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWROb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSgoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcykpfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuZGF0YS5naXZlVXApIHtcbiAgICAgICAgKHNlbGYgYXMgYW55KS5naXZlVVAgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2U6IFByb21pc2U8YW55PjtcbiAgICBjb25zdCBwcm9ncmVzc0NhbGxiYWNrID0gKGN1cnJlbnRCZWF0OiBudW1iZXIsIGRpdmlzaW9uZWRSaWNoTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMpID0+IHtcbiAgICAgICAgaWYgKChzZWxmIGFzIGFueSkuZ2l2ZVVQKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJnaXZlVVBcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRpdmlzaW9uZWRSaWNoTm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByaWNoTm90ZXMgPSBkaXZpc2lvbmVkUmljaE5vdGVzW2N1cnJlbnRCZWF0ICogQkVBVF9MRU5HVEhdO1xuICAgICAgICBpZiAoY3VycmVudEJlYXQgIT0gbnVsbCAmJiByaWNoTm90ZXMgJiYgcmljaE5vdGVzWzBdICYmIHJpY2hOb3Rlc1swXS5jaG9yZCkge1xuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkOiByaWNoTm90ZXNbMF0uY2hvcmQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGl2aXNpb25lZFJpY2hOb3RlcykpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtYWtlTXVzaWMocGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gcmVzdWx0LmRpdmlzaW9uZWROb3RlcztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRpdmlzaW9uZWROb3RlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMgPSBkaXZpc2lvbmVkTm90ZXM7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGl2aXNpb25lZE5vdGVzKSl9KTtcblxuXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2Vycm9yOiBlcnJ9KTtcbiAgICB9KTtcblxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==