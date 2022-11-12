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
        tension += this.chordProgression;
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
            },
            {
                voice: "42",
                note: "A4",
            },
            {
                voice: "42",
                note: "C4",
            },
            {
                voice: "42",
                note: "E3",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0M7QUFDQSx1Q0FBdUM7QUFDdkMsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0M7QUFDQSxzQ0FBc0M7QUFDdEMsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix1QkFBdUIsRUFBRSxhQUFhO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrREFBa0QsYUFBYTs7QUFFL0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JxRzBEO0FBRVk7QUFVdkUsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBbUIsRUFBVyxFQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFjO0lBQ3BDLHVCQUF1QjtJQUN2QixLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDbEIsS0FBSyxJQUFJLFFBQVEsR0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxnREFBSyxDQUFDLEVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUseURBQWMsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDO2dCQUM3RSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUNsQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO29CQUNQLEdBQUcsRUFBRSxRQUFRO29CQUNiLFlBQVksRUFBRSxTQUFTO29CQUN2QixTQUFTLEVBQUUsU0FBUztpQkFDVCxDQUFDO2FBQ25CO1NBQ0o7S0FDSjtJQUNELEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRO1FBQzlCLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDdkI7U0FDSjtLQUNKO0lBRUQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFDeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLGdEQUFLLENBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUseURBQWMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ3RGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBR00sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BTWxDLEVBR0UsRUFBRTtJQUNELE1BQU0sRUFBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDbEYsc0VBQXNFO0lBQ3RFLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7SUFFbEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxNQUFNLEtBQUssSUFBSSxzQkFBc0IsRUFBRTtRQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ0wsS0FBSztZQUNMLE9BQU8sRUFBRSxDQUFDO1NBQ2IsQ0FBQztLQUNMO0lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxzQkFBc0IsQ0FBQztJQUU1RCwrREFBK0Q7SUFDL0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QixNQUFNLFFBQVEsR0FBRyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsK0NBQVcsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDaEMsU0FBUztTQUNaO1FBQ0QsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMxRSxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUNyRCxLQUFLLE1BQU0sY0FBYyxJQUFJLEdBQUcsRUFBRTtZQUM5QixNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEYsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsMkNBQTJDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ1IsY0FBYyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsOEJBQThCO2lCQUMvRDtxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsY0FBYyxDQUFDLE9BQU8sSUFBSSxFQUFFO2lCQUMvQjtxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsY0FBYyxDQUFDLE9BQU8sSUFBSSxDQUFDO2lCQUM5QjtxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsY0FBYyxDQUFDLE9BQU8sSUFBSSxDQUFDO2lCQUM5QjtnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLGdDQUFnQyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2FBQzFIO1NBQ0o7S0FDSjtJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDO0lBRXJDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDakQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xHc0I7QUFDYTtBQUNtRTtBQUNqRDtBQUNUO0FBQ0c7QUFDSDtBQUNGO0FBQ1k7QUFHdkQsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDNUIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBRzNCLE1BQU0sT0FBTyxHQUFHLENBQU8sRUFBVSxFQUFpQixFQUFFO0lBQ2hELE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVELE1BQU0sVUFBVSxHQUFHLENBQU8sVUFBMkIsRUFBRSxtQkFBdUMsSUFBSSxFQUFnQyxFQUFFO0lBQ2hJLHlCQUF5QjtJQUN6QixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFMUMsSUFBSSxNQUFNLEdBQXdCLEVBQUUsQ0FBQztJQUVyQyxJQUFJLG1CQUFtQixHQUF3QyxFQUFFO0lBRWpFLEtBQUssSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxRQUFRLEdBQUcsK0NBQVcsRUFBRSxRQUFRLElBQUksK0NBQVcsRUFBRTtRQUMvRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsQ0FBQztRQUNoRCxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4RCxJQUFJLFNBQWlCLENBQUM7UUFDdEIsSUFBSSxpQkFBeUIsQ0FBQztRQUM5QixJQUFJLFlBQW1CLENBQUM7UUFDeEIsSUFBSSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxVQUFVLEVBQUU7WUFDWixTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ2YsS0FBSyxNQUFNLFFBQVEsSUFBSSxVQUFVLEVBQUU7Z0JBQy9CLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDOUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztnQkFDM0MsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7YUFDakM7U0FDSjtRQUVELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxNQUFNLDRCQUE0QixHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztRQUVqRSxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BKLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLDRCQUE0QixDQUFDLENBQUM7UUFFMUUsTUFBTSxlQUFlLEdBQUcsSUFBSSwrREFBb0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO1FBQ3RFLElBQUksUUFBUSxHQUFvQixJQUFJLENBQUM7UUFFckMsSUFBSSxVQUFVLEdBQWlCLEVBQUU7UUFDakMsTUFBTSxTQUFTLEdBQXdDLEVBQUU7UUFFekQsTUFBTSxXQUFXLEdBQWdCLEVBQUUsQ0FBQztRQUVwQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXJCLElBQUksNEJBQTRCLElBQUksQ0FBQyxFQUFFO1lBQ25DLHlCQUF5QjtZQUN6QixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsUUFBUSxFQUFFLCtDQUFXO2dCQUNyQixLQUFLLEVBQUUsUUFBUTtnQkFDZixTQUFTLEVBQUUsS0FBSztnQkFDaEIsYUFBYSxFQUFFLGlCQUFpQjtnQkFDaEMsT0FBTyxFQUFFLElBQUksNkNBQU8sRUFBRTtnQkFDdEIsS0FBSyxFQUFFLFlBQVk7YUFDVCxFQUFDLENBQUMsQ0FBQztZQUNqQixRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ25CO1FBRUQsT0FBTyxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLGdCQUFnQixFQUFFO1lBQ3RELFVBQVUsRUFBRSxDQUFDO1lBQ2IsUUFBUSxHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QyxNQUFNLFdBQVcsR0FBRyxJQUFJLDZDQUFNLEVBQUUsQ0FBQztZQUNqQyxJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDL0MsTUFBTTthQUNUO1lBQ0QsSUFBSSxhQUFhLENBQUM7WUFDbEIsSUFBSSxlQUFlLENBQUM7WUFFcEIsZUFBZSxHQUFHLG9FQUFrQixDQUFDO2dCQUNqQyxjQUFjLEVBQUUsUUFBUTtnQkFDeEIsbUJBQW1CLEVBQUUsTUFBTTtnQkFDM0IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFLFFBQVEsQ0FBQyxLQUFLO2dCQUMzQixNQUFNLEVBQUUsSUFBSSw2Q0FBTSxDQUFDLFdBQVcsQ0FBQzthQUNsQyxDQUFDO1lBQ0YsSUFBSSxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxHQUFHLENBQUMsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNyRyxnREFBZ0Q7Z0JBQ2hELGVBQWUsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzthQUMvRTtZQUNELElBQUksZUFBZSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLFNBQVM7YUFDWjtZQUNELGFBQWEsR0FBRywwREFBYSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksNkNBQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ2pHLHlCQUF5QixFQUFFLFFBQVEsR0FBRyxXQUFXO2FBQ3BELENBQUM7WUFFRixLQUFLLE1BQU0sZUFBZSxJQUFJLGFBQWEsRUFBRTtnQkFDekMsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLGdCQUFnQixFQUFFO29CQUN2QyxNQUFNO2lCQUNUO2dCQUNELE1BQU0sZUFBZSxHQUFHLElBQUksNkNBQU0sRUFBRSxDQUFDO2dCQUNyQyxlQUFlLENBQUMsS0FBSyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQzNFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFFLGtDQUFrQztnQkFDOUUsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3pDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDbEIsS0FBSyxNQUFNLFdBQVcsSUFBSSxZQUFZLEVBQUU7d0JBQ3BDLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFOzRCQUMxQyxTQUFTO3lCQUNaO3dCQUNELE1BQU0sR0FBRyxJQUFJLENBQUM7d0JBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3pDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQ0FDeEQsTUFBTSxHQUFHLEtBQUssQ0FBQztnQ0FDZixNQUFNOzZCQUNUO3lCQUNKO3dCQUNELElBQUksTUFBTSxFQUFFOzRCQUNSLE1BQU07eUJBQ1Q7cUJBQ0o7b0JBQ0QsSUFBSSxNQUFNLEVBQUU7d0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakksU0FBUztxQkFDWjtpQkFDSjtnQkFDRCxLQUFLLE1BQU0sY0FBYyxJQUFJLGVBQWUsRUFBRTtvQkFDMUMsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLGdCQUFnQixFQUFFO3dCQUN2QyxNQUFNO3FCQUNUO29CQUNELE1BQU0sYUFBYSxHQUFHLG9EQUFVLENBQUM7d0JBQzdCLGVBQWUsRUFBRSxNQUFNO3dCQUN2QixPQUFPLEVBQUUsV0FBVzt3QkFDcEIsWUFBWSxFQUFFLGNBQWMsQ0FBQyxLQUFLO3dCQUNsQyw0QkFBNEI7d0JBQzVCLHlCQUF5QixFQUFFLFFBQVEsR0FBRyxXQUFXO3dCQUNqRCxNQUFNO3dCQUNOLGFBQWEsRUFBRSxlQUFlLENBQUMsYUFBYTt3QkFDNUMsaUJBQWlCO3FCQUNwQixDQUFDLENBQUM7b0JBRUgsYUFBYSxDQUFDLFVBQVUsSUFBSSxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUM3RixJQUFJLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFO3dCQUM1RCxhQUFhLENBQUMsVUFBVSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzt3QkFDeEUsSUFBSSxRQUFRLEdBQUcsV0FBVyxHQUFHLENBQUMsRUFBRTs0QkFDNUIsa0NBQWtDOzRCQUNsQyxhQUFhLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQzt5QkFDbkM7d0JBQ0QsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLEVBQUU7NEJBQ2xDLGdEQUFnRDs0QkFDaEQsYUFBYSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUM7eUJBQ25DO3dCQUNELElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTs0QkFDakIsc0NBQXNDOzRCQUN0QyxhQUFhLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQzt5QkFDbkM7cUJBQ0o7b0JBQ0QsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLGVBQWUsQ0FBQzt3QkFDeEMsTUFBTTt3QkFDTiw0QkFBNEI7cUJBQy9CLENBQUMsQ0FBQztvQkFFSCxJQUFJLGdCQUFnQixFQUFFO3dCQUNsQixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzVDLElBQUksTUFBTSxFQUFFOzRCQUNSLE9BQU8sTUFBTSxDQUFDO3lCQUNqQjtxQkFDSjtvQkFFRCxJQUFJLE9BQU8sR0FBRyxFQUFFLEVBQUU7d0JBQ2QsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7d0JBQzlCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQzt3QkFDdkIsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUU7NEJBQ2hDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0NBQ3RELGNBQWMsRUFBRSxDQUFDOzZCQUNwQjt5QkFDSjt3QkFDRCxJQUFJLGNBQWMsSUFBSSxxQkFBcUIsRUFBRTs0QkFDekMsZ0VBQWdFOzRCQUNoRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7NEJBQ3RCLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDOzRCQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDeEMsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNoQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFO29DQUN0RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLGlCQUFpQixFQUFFO3dDQUN2RCxVQUFVLEdBQUcsQ0FBQyxDQUFDO3FDQUNsQjtpQ0FDSjs2QkFDSjs0QkFDRCxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7Z0NBQ3BCLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsT0FBTyxFQUFFO29DQUMxRCw4Q0FBOEM7b0NBQzlDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lDQUNwQzs2QkFDSjt5QkFFSjt3QkFDRCxJQUFJLGNBQWMsR0FBRyxxQkFBcUIsRUFBRTs0QkFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztnQ0FDOUMsSUFBSSxFQUFFLElBQUk7Z0NBQ1YsUUFBUSxFQUFFLCtDQUFXO2dDQUNyQixLQUFLLEVBQUUsUUFBUTtnQ0FDZixTQUFTLEVBQUUsS0FBSztnQ0FDaEIsYUFBYSxFQUFFLGVBQWUsQ0FBQyxhQUFhO2dDQUM1QyxPQUFPLEVBQUUsYUFBYTtnQ0FDdEIsS0FBSyxFQUFFLGNBQWMsQ0FBQyxLQUFLOzZCQUNqQixFQUNiLENBQUMsQ0FBQzt5QkFDTjtxQkFDSjt5QkFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsZUFBZSxFQUFFO3dCQUMzQyxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQzt3QkFDOUIsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7NEJBQzlCLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0NBQ3ZDLHFCQUFxQixFQUFFLENBQUM7NkJBQzNCO3lCQUNKO3dCQUNELElBQUkscUJBQXFCLEdBQUcsQ0FBQyxFQUFFOzRCQUMzQixTQUFTLENBQUMsSUFBSSxDQUFDO2dDQUNYLEtBQUssRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFO2dDQUMxQixPQUFPLEVBQUUsYUFBYTs2QkFDekIsQ0FBQyxDQUFDO3lCQUNOO3FCQUNKO2lCQUNKLENBQUUsMkJBQTJCO2FBQ2pDLENBQUUsK0JBQStCO1NBQ3JDLENBQUUsWUFBWTtRQUNmLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDeEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7Z0JBQzlCLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDeEQ7WUFDRCwrQ0FBK0M7WUFDL0MsSUFBSSxRQUFRLElBQUksK0NBQVcsRUFBRTtnQkFDekIsUUFBUSxJQUFJLCtDQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixvQ0FBb0M7Z0JBQ3BDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztnQkFDMUIsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsRUFBRTtvQkFDL0MsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUM5QztnQkFDRCxvREFBb0Q7Z0JBQ3BELG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hHLG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNILGdDQUFnQztnQkFDaEMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQixPQUFPLE1BQU0sQ0FBQzthQUNqQjtZQUNELGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMxQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbEIsZ0JBQWdCLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUM3QztZQUNELFNBQVM7U0FDWjtRQUVELHdDQUF3QztRQUN4QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsS0FBSyxNQUFNLEtBQUssSUFBSSxVQUFVLEVBQUU7WUFDNUIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQzthQUN2RjtZQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUN6QyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3JCO1NBQ0o7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBRTdCLElBQUksZ0JBQWdCLEVBQUU7WUFDbEIsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3pDO1FBRUQsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN0QjtJQUVELE9BQU8sTUFBTTtBQUNqQixDQUFDO0FBRU0sU0FBZSxTQUFTLENBQUMsTUFBdUIsRUFBRSxtQkFBdUMsSUFBSTs7UUFDaEcsSUFBSSxlQUFlLEdBQXdCLEVBQUUsQ0FBQztRQUM5QyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTyxJQUFJLEVBQUU7WUFDVCxVQUFVLEVBQUUsQ0FBQztZQUNiLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPO29CQUNILGVBQWUsRUFBRSxFQUFFO2lCQUN0QjthQUNKO1lBQ0QsZUFBZSxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzdELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUMxQyxNQUFNO2FBQ1Q7WUFDRCxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzVEO1FBRUQscUZBQXFGO1FBQ3JGLDBEQUFjLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLDBDQUEwQztRQUMxQyx3REFBWSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7UUFHckMsT0FBTztZQUNILGVBQWUsRUFBRSxlQUFlO1NBQ25DO0lBRUwsQ0FBQztDQUFBO0FBRU0sU0FBUyxVQUFVLENBQUMsZUFBb0MsRUFBRSxVQUEyQjtJQUN4Rix1Q0FBdUM7SUFDdkMsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRTtJQUV6QyxLQUFLLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsUUFBUSxHQUFHLCtDQUFXLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDbEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLCtDQUFXLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtTQUNqQzthQUFNLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3pDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQztnQkFDaEMsUUFBUSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7WUFDN0IsQ0FBQyxDQUFDO1NBQ0w7S0FFSjtJQUVELHFGQUFxRjtJQUNyRiwwREFBYyxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM1QywwQ0FBMEM7SUFDMUMsd0RBQVksQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDO0FBQzdDLENBQUM7QUFFcUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM1ZzRDtBQUVyRSxNQUFNLFlBQVksR0FBRyxDQUFDLGVBQW9DLEVBQUUsVUFBMkIsRUFBRSxFQUFFO0lBRTlGLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO0lBQ2hELE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsR0FBRywrQ0FBVyxDQUFDO0lBRTVELEtBQUssSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxZQUFZLEdBQUcsK0NBQVcsRUFBRSxRQUFRLElBQUksK0NBQVcsRUFBRTtRQUNuRixNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQyxHQUFHLCtDQUFXLENBQUM7UUFDbEUsSUFBSSw0QkFBNEIsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUM7UUFDL0QsSUFBSSxhQUFhLEdBQUcsNEJBQTRCLEdBQUcsQ0FBQztRQUNwRCxJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEMsOEVBQThFO1lBQzlFLG1DQUFtQztZQUNuQyxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BCLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLElBQUksWUFBWSxJQUFJLFdBQVcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNFLElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSwrQ0FBVyxFQUFFO3dCQUN0QyxTQUFTO3FCQUNaO29CQUNELElBQUksV0FBVyxDQUFDLFFBQVEsSUFBSSwrQ0FBVyxFQUFFO3dCQUNyQyxTQUFTO3FCQUNaO29CQUNELElBQUksWUFBWSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUU7d0JBQzFCLFNBQVM7cUJBQ1o7b0JBQ0QsWUFBWSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7b0JBQzNCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2lCQUM1QjthQUNKO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNqRDtLQUNKO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDb0M7QUFFeUQ7QUFldkYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUd6QixFQUFnQyxFQUFFO0lBQ25DLE1BQU0sRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ25GLG1FQUFtRTtJQUNuRSxnQkFBZ0I7SUFFaEIsTUFBTSxFQUFDLHVCQUF1QixFQUFFLGNBQWMsRUFBQyxHQUFHLHFEQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFeEUsMkNBQTJDO0lBQzNDLE1BQU0sR0FBRyxHQUFpQyxFQUFFLENBQUM7SUFFN0MsSUFBSSx1QkFBdUIsR0FBRyxDQUFDLEdBQUcsdUJBQXVCLENBQUM7SUFDMUQsSUFBSSxTQUFTLEVBQUU7UUFDWCx1QkFBdUIsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsc0RBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3pFO0lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNSLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFFRCxJQUFJLEtBQUssRUFBRTtRQUNQLHdFQUF3RTtRQUV4RSxTQUFTO1FBQ1QsK0NBQStDO1FBRS9DLDJGQUEyRjtRQUMzRixvRUFBb0U7UUFFcEUsbURBQW1EO1FBRW5ELG9HQUFvRztRQUNwRyxzREFBc0Q7UUFFdEQsTUFBTSxhQUFhLEdBQUcsd0RBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDeEYsTUFBTSxXQUFXLEdBQUcsYUFBYSxJQUFJLENBQUMsSUFBSSxhQUFhLElBQUksQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxRCwwRUFBMEU7UUFFMUUsSUFBSSxjQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEYsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixjQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN6RDtRQUVELEtBQUssSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFLGNBQWMsR0FBRyxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUU7WUFDbkUsS0FBSyxJQUFJLGNBQWMsR0FBQyxDQUFDLEVBQUUsY0FBYyxHQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUU7Z0JBQ25GLEtBQUssSUFBSSxnQkFBZ0IsR0FBQyxDQUFDLEVBQUUsZ0JBQWdCLEdBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRTtvQkFDaEYsTUFBTSxTQUFTLEdBQUcsY0FBYyxJQUFJLENBQUMsQ0FBQztvQkFFdEMsd0NBQXdDO29CQUN4QyxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ2pELElBQUkseUJBQXlCLEdBQUcsQ0FBQyxFQUFFO3dCQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTs0QkFDL0IsU0FBUyxDQUFDLHdEQUF3RDt5QkFDckU7cUJBQ0o7b0JBRUQsTUFBTSxlQUFlLEdBQW9CO3dCQUNyQyxVQUFVLEVBQUUsRUFBRTt3QkFDZCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxhQUFhLEVBQUUsY0FBYyxDQUFDLGNBQWMsQ0FBQztxQkFDaEQsQ0FBQztvQkFDRixJQUFJLFNBQVMsRUFBRTt3QkFDWCxlQUFlLENBQUMsYUFBYSxJQUFJLFlBQVksQ0FBQztxQkFDakQ7b0JBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFpQixFQUFFLElBQVUsRUFBRSxFQUFFO3dCQUNsRCxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksK0NBQUksQ0FBQzs0QkFDeEMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFROzRCQUN2QixNQUFNLEVBQUUsQ0FBQyxDQUFFLFFBQVE7eUJBQ3RCLENBQUMsQ0FBQztvQkFDUCxDQUFDO29CQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQy9ELElBQUksV0FBVyxHQUE4QixFQUFFLENBQUM7b0JBRWhELDJCQUEyQjtvQkFDM0IsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUM5QixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0Qjt5QkFBTSxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3RDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3RCO3lCQUFNLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDdkMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDdEI7eUJBQU0sSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUN0QyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtvQkFFRCwrQkFBK0I7b0JBQy9CLElBQUksZUFBZSxHQUFhLEVBQUUsQ0FBQztvQkFDbkMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ3pCLElBQUksU0FBUyxJQUFJLE1BQU0sRUFBRTs0QkFDckIsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLGtCQUFrQjt5QkFDbkQ7NkJBQU0sSUFBSSxTQUFTLElBQUksWUFBWSxFQUFFOzRCQUNsQyw2QkFBNkI7NEJBQzdCLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxrQkFBa0I7eUJBQ25EOzZCQUFNLElBQUksU0FBUyxJQUFJLGFBQWEsRUFBRTs0QkFDbkMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLG1CQUFtQjt5QkFDcEQ7NkJBQU0sSUFBSSxTQUFTLElBQUksYUFBYSxFQUFFOzRCQUNuQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsbUJBQW1CO3lCQUNwRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxRQUFRLEVBQUU7NEJBQzlCLDhCQUE4Qjs0QkFDOUIsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLGtCQUFrQjt5QkFDbkQ7cUJBQ0o7eUJBQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ2hDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkU7b0JBRUQsSUFBSSxTQUFTLEVBQUU7d0JBQ1gsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFOzRCQUNyQix1Q0FBdUM7NEJBQ3ZDLFNBQVM7eUJBQ1o7d0JBQ0QsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7NEJBQ2pELGtDQUFrQzs0QkFDbEMsU0FBUzt5QkFDWjt3QkFDRCxlQUFlLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsMkNBQTJDO3dCQUMzQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTs0QkFDakQsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDM0I7NkJBQU07NEJBQ0gsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDM0I7cUJBQ0o7b0JBRUQsNkVBQTZFO29CQUM3RSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDeEIsb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0IscUJBQXFCO3dCQUNyQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0IscUJBQXFCO3dCQUNyQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTSxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTt3QkFDL0Isb0JBQW9CO3dCQUNwQixXQUFXLENBQUMs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QUM7SUFDRCxzREFBUyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ2hELE1BQU0sZUFBZSxHQUF3QixNQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3BFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzNDLE9BQU87U0FDVjtRQUNBLElBQVksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7SUFHekYsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbXVzaWN0aGVvcnlqcy9kaXN0L211c2ljdGhlb3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9hdmFpbGFibGVzY2FsZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nob3Jkcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaGFsZm5vdGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9pbnZlcnNpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9teWxvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFuZG9tY2hvcmRzLnRzIiwid2VicGFjazovLy8uL3NyYy90ZW5zaW9uLnRzIiwid2VicGFjazovLy8uL3NyYy90b3BtZWxvZHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi93b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5NdXNpY1RoZW9yeSA9IHt9KSk7XG59KSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAvKipcclxuICAgICogTm90ZXMgc3RhcnRpbmcgYXQgQzAgLSB6ZXJvIGluZGV4IC0gMTIgdG90YWxcclxuICAgICogTWFwcyBub3RlIG5hbWVzIHRvIHNlbWl0b25lIHZhbHVlcyBzdGFydGluZyBhdCBDPTBcclxuICAgICogQGVudW1cclxuICAgICovXHJcbiAgIHZhciBTZW1pdG9uZTtcclxuICAgKGZ1bmN0aW9uIChTZW1pdG9uZSkge1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBXCJdID0gOV0gPSBcIkFcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQXNcIl0gPSAxMF0gPSBcIkFzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJiXCJdID0gMTBdID0gXCJCYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJCXCJdID0gMTFdID0gXCJCXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJzXCJdID0gMF0gPSBcIkJzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNiXCJdID0gMTFdID0gXCJDYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDXCJdID0gMF0gPSBcIkNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ3NcIl0gPSAxXSA9IFwiQ3NcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRGJcIl0gPSAxXSA9IFwiRGJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRFwiXSA9IDJdID0gXCJEXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkRzXCJdID0gM10gPSBcIkRzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkViXCJdID0gM10gPSBcIkViXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkVcIl0gPSA0XSA9IFwiRVwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJFc1wiXSA9IDVdID0gXCJFc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGYlwiXSA9IDRdID0gXCJGYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGXCJdID0gNV0gPSBcIkZcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRnNcIl0gPSA2XSA9IFwiRnNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR2JcIl0gPSA2XSA9IFwiR2JcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR1wiXSA9IDddID0gXCJHXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkdzXCJdID0gOF0gPSBcIkdzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFiXCJdID0gOF0gPSBcIkFiXCI7XHJcbiAgIH0pKFNlbWl0b25lIHx8IChTZW1pdG9uZSA9IHt9KSk7XHJcbiAgIC8qKlxyXG4gICAgKiBSZXR1cm5zIHRoZSB3aG9sZSBub3RlIG5hbWUgKGUuZy4gQywgRCwgRSwgRiwgRywgQSwgQikgZm9yXHJcbiAgICAqIHRoZSBnaXZlbiBzdHJpbmdcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBnZXRXaG9sZVRvbmVGcm9tTmFtZSA9IChuYW1lKSA9PiB7XHJcbiAgICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggPT09IDAgfHwgbmFtZS5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbmFtZVwiKTtcclxuICAgICAgIGNvbnN0IGtleSA9IG5hbWVbMF0udG9VcHBlckNhc2UoKTtcclxuICAgICAgIHJldHVybiBTZW1pdG9uZVtrZXldO1xyXG4gICB9O1xyXG4gICB2YXIgU2VtaXRvbmUkMSA9IFNlbWl0b25lO1xuXG4gICAvKipcclxuICAgICogV3JhcHMgYSBudW1iZXIgYmV0d2VlbiBhIG1pbiBhbmQgbWF4IHZhbHVlLlxyXG4gICAgKiBAcGFyYW0gdmFsdWUgLSB0aGUgbnVtYmVyIHRvIHdyYXBcclxuICAgICogQHBhcmFtIGxvd2VyICAtIHRoZSBsb3dlciBib3VuZFxyXG4gICAgKiBAcGFyYW0gdXBwZXIgLSB0aGUgdXBwZXIgYm91bmRcclxuICAgICogQHJldHVybnMgd3JhcHBlZE51bWJlciAtIHRoZSB3cmFwcGVkIG51bWJlclxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHdyYXAgPSAodmFsdWUsIGxvd2VyLCB1cHBlcikgPT4ge1xyXG4gICAgICAgLy8gY29waWVzXHJcbiAgICAgICBsZXQgdmFsID0gdmFsdWU7XHJcbiAgICAgICBsZXQgbGJvdW5kID0gbG93ZXI7XHJcbiAgICAgICBsZXQgdWJvdW5kID0gdXBwZXI7XHJcbiAgICAgICAvLyBpZiB0aGUgYm91bmRzIGFyZSBpbnZlcnRlZCwgc3dhcCB0aGVtIGhlcmVcclxuICAgICAgIGlmICh1cHBlciA8IGxvd2VyKSB7XHJcbiAgICAgICAgICAgbGJvdW5kID0gdXBwZXI7XHJcbiAgICAgICAgICAgdWJvdW5kID0gbG93ZXI7XHJcbiAgICAgICB9XHJcbiAgICAgICAvLyB0aGUgYW1vdW50IG5lZWRlZCB0byBtb3ZlIHRoZSByYW5nZSBhbmQgdmFsdWUgdG8gemVyb1xyXG4gICAgICAgY29uc3QgemVyb09mZnNldCA9IDAgLSBsYm91bmQ7XHJcbiAgICAgICAvLyBvZmZzZXQgdGhlIHZhbHVlcyBzbyB0aGF0IHRoZSBsb3dlciBib3VuZCBpcyB6ZXJvXHJcbiAgICAgICBsYm91bmQgKz0gemVyb09mZnNldDtcclxuICAgICAgIHVib3VuZCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgdmFsICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICAvLyBjb21wdXRlIHRoZSBudW1iZXIgb2YgdGltZXMgdGhlIHZhbHVlIHdpbGwgd3JhcFxyXG4gICAgICAgbGV0IHdyYXBzID0gTWF0aC50cnVuYyh2YWwgLyB1Ym91bmQpO1xyXG4gICAgICAgLy8gY2FzZTogLTEgLyB1Ym91bmQoPjApIHdpbGwgZXF1YWwgMCBhbHRob3VnaCBpdCB3cmFwcyBvbmNlXHJcbiAgICAgICBpZiAod3JhcHMgPT09IDAgJiYgdmFsIDwgbGJvdW5kKVxyXG4gICAgICAgICAgIHdyYXBzID0gLTE7XHJcbiAgICAgICAvLyBjYXNlOiB1Ym91bmQgYW5kIHZhbHVlIGFyZSB0aGUgc2FtZSB2YWwvdWJvdW5kID0gMSBidXQgYWN0dWFsbHkgZG9lc250IHdyYXBcclxuICAgICAgIGlmICh3cmFwcyA9PT0gMSAmJiB2YWwgPT09IHVib3VuZClcclxuICAgICAgICAgICB3cmFwcyA9IDA7XHJcbiAgICAgICAvLyBuZWVkZWQgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBudW0gb2Ygd3JhcHMgaXMgMCBvciAxIG9yIC0xXHJcbiAgICAgICBsZXQgdmFsT2Zmc2V0ID0gMDtcclxuICAgICAgIGxldCB3cmFwT2Zmc2V0ID0gMDtcclxuICAgICAgIGlmICh3cmFwcyA+PSAtMSAmJiB3cmFwcyA8PSAxKVxyXG4gICAgICAgICAgIHdyYXBPZmZzZXQgPSAxO1xyXG4gICAgICAgLy8gaWYgdGhlIHZhbHVlIGlzIGJlbG93IHRoZSByYW5nZVxyXG4gICAgICAgaWYgKHZhbCA8IGxib3VuZCkge1xyXG4gICAgICAgICAgIHZhbE9mZnNldCA9ICh2YWwgJSB1Ym91bmQpICsgd3JhcE9mZnNldDtcclxuICAgICAgICAgICB2YWwgPSB1Ym91bmQgKyB2YWxPZmZzZXQ7XHJcbiAgICAgICAgICAgLy8gaWYgdGhlIHZhbHVlIGlzIGFib3ZlIHRoZSByYW5nZVxyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZSBpZiAodmFsID4gdWJvdW5kKSB7XHJcbiAgICAgICAgICAgdmFsT2Zmc2V0ID0gKHZhbCAlIHVib3VuZCkgLSB3cmFwT2Zmc2V0O1xyXG4gICAgICAgICAgIHZhbCA9IGxib3VuZCArIHZhbE9mZnNldDtcclxuICAgICAgIH1cclxuICAgICAgIC8vIGFkZCB0aGUgb2Zmc2V0IGZyb20gemVybyBiYWNrIHRvIHRoZSB2YWx1ZVxyXG4gICAgICAgdmFsIC09IHplcm9PZmZzZXQ7XHJcbiAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgIHZhbHVlOiB2YWwsXHJcbiAgICAgICAgICAgbnVtV3JhcHM6IHdyYXBzLFxyXG4gICAgICAgfTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNpbXBsZSB1dGlsIHRvIGNsYW1wIGEgbnVtYmVyIHRvIGEgcmFuZ2VcclxuICAgICogQHBhcmFtIHBOdW0gLSB0aGUgbnVtYmVyIHRvIGNsYW1wXHJcbiAgICAqIEBwYXJhbSBwTG93ZXIgLSB0aGUgbG93ZXIgYm91bmRcclxuICAgICogQHBhcmFtIHBVcHBlciAtIHRoZSB1cHBlciBib3VuZFxyXG4gICAgKiBAcmV0dXJucyBOdW1iZXIgLSB0aGUgY2xhbXBlZCBudW1iZXJcclxuICAgICpcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjbGFtcCA9IChwTnVtLCBwTG93ZXIsIHBVcHBlcikgPT4gTWF0aC5tYXgoTWF0aC5taW4ocE51bSwgTWF0aC5tYXgocExvd2VyLCBwVXBwZXIpKSwgTWF0aC5taW4ocExvd2VyLCBwVXBwZXIpKTtcblxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8vIENvbnN0YW50c1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgTU9ESUZJRURfU0VNSVRPTkVTID0gWzEsIDMsIDQsIDYsIDgsIDEwXTtcclxuICAgY29uc3QgVE9ORVNfTUFYID0gMTE7XHJcbiAgIGNvbnN0IFRPTkVTX01JTiA9IDA7XHJcbiAgIGNvbnN0IE9DVEFWRV9NQVggPSA5O1xyXG4gICBjb25zdCBPQ1RBVkVfTUlOID0gMDtcclxuICAgY29uc3QgREVGQVVMVF9PQ1RBVkUgPSA0O1xyXG4gICBjb25zdCBERUZBVUxUX1NFTUlUT05FID0gMDtcblxuICAgLyoqXHJcbiAgICAqIE1hcHMgbm90ZSBhbHRlcmF0aW9ucyB0byAgdGhlaXIgcmVsYXRpdmUgbWF0aG1hdGljYWwgdmFsdWVcclxuICAgICpAZW51bVxyXG4gICAgKi9cclxuICAgdmFyIE1vZGlmaWVyO1xyXG4gICAoZnVuY3Rpb24gKE1vZGlmaWVyKSB7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIkZMQVRcIl0gPSAtMV0gPSBcIkZMQVRcIjtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiTkFUVVJBTFwiXSA9IDBdID0gXCJOQVRVUkFMXCI7XHJcbiAgICAgICBNb2RpZmllcltNb2RpZmllcltcIlNIQVJQXCJdID0gMV0gPSBcIlNIQVJQXCI7XHJcbiAgIH0pKE1vZGlmaWVyIHx8IChNb2RpZmllciA9IHt9KSk7XHJcbiAgIC8qKlxyXG4gICAgKiBQYXJzZXMgbW9kaWZpZXIgZnJvbSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGVudW0gdmFsdWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZU1vZGlmaWVyID0gKG1vZGlmaWVyKSA9PiB7XHJcbiAgICAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgY2FzZSBcImJcIjpcclxuICAgICAgICAgICBjYXNlIFwiZmxhdFwiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuRkxBVDtcclxuICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgY2FzZSBcInNoYXJwXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5TSEFSUDtcclxuICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICByZXR1cm4gTW9kaWZpZXIuTkFUVVJBTDtcclxuICAgICAgIH1cclxuICAgfTtcclxuICAgdmFyIE1vZGlmaWVyJDEgPSBNb2RpZmllcjtcblxuICAgLy8gaW1wb3J0IHsgcmVnaXN0ZXJJbml0aWFsaXplciB9IGZyb20gXCIuLi9Jbml0aWFsaXplci9Jbml0aWFsaXplclwiO1xyXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZUxvb2t1cC5qc29uXCI7XHJcbiAgIC8vIGltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IG5hbWVSZWdleCQyID0gLyhbQS1HXSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCQyID0gLygjfHN8YikvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXgkMiA9IC8oWzAtOV0rKS9nO1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIHBhcnNlIGEgbm90ZSBmcm9tIGEgc3RyaW5nXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgcGFyc2VOb3RlID0gKG5vdGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbm90ZUxvb2t1cChub3RlKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgbm90ZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7bm90ZX0uIEdldCBhIHBlcmZvcm1hbmNlIGluY3JlYXNlIGJ5IHVzaW5nIHRoZSBmb3JtYXQgW0EtR11bI3xzfGJdWzAtOV0gYW5kIHVzaW5nIGJ1aWxkVGFibGVzIG1ldGhvZChzZWUgZG9jdW1lbnRhdGlvbilgKTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IG5vdGUgc3RyaW5nIGZvcm1hdHRpbmcgLSAke25vdGV9LiBHZXQgYSBwZXJmb3JtYW5jZSBpbmNyZWFzZSBieSB1c2luZyB0aGUgZm9ybWF0IFtBLUddWyN8c3xiXVswLTldIGFuZCB1c2luZyBidWlsZFRhYmxlcyBtZXRob2Qoc2VlIGRvY3VtZW50YXRpb24pYCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IG5vdGUubWF0Y2gobmFtZVJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IG5vdGUubWF0Y2gobW9kaWZpZXJSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gbm90ZS5tYXRjaChvY3RhdmVSZWdleCQyKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbbm90ZU5hbWVdID0gbmFtZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVJZGVuaWZpZXIgPSBub3RlTmFtZTtcclxuICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSAwO1xyXG4gICAgICAgICAgIGlmIChub3RlTW9kaWZpZXIpXHJcbiAgICAgICAgICAgICAgIG1vZGlmaWVyID0gbm90ZU1vZGlmaWVyO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWRUb25lID0gd3JhcChnZXRXaG9sZVRvbmVGcm9tTmFtZShub3RlSWRlbmlmaWVyKSArIG1vZGlmaWVyLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSB3cmFwcGVkVG9uZS52YWx1ZTtcclxuICAgICAgICAgICBsZXQgb2N0YXZlID0gNDtcclxuICAgICAgICAgICBpZiAobm90ZU9jdGF2ZSlcclxuICAgICAgICAgICAgICAgb2N0YXZlID0gY2xhbXAocGFyc2VJbnQobm90ZU9jdGF2ZSwgMTApLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbm90ZTogJHtub3RlfWApO1xyXG4gICB9O1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQ0ID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgbm90ZVRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgZm9yIChjb25zdCBub3RlTGFiZWwgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICBub3RlVGFibGVbbm90ZUxhYmVsXSA9IHBhcnNlTm90ZShub3RlTGFiZWwsIHRydWUpOyAvLyAnQycgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICBmb3IgKGxldCBpTW9kaWZpZXJPdXRlciA9IDA7IGlNb2RpZmllck91dGVyIDwgbm90ZU1vZGlmaWVycy5sZW5ndGg7ICsraU1vZGlmaWVyT3V0ZXIpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7bm90ZUxhYmVsfSR7bm90ZU1vZGlmaWVyc1tpTW9kaWZpZXJPdXRlcl19YDtcclxuICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0MjJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8IE9DVEFWRV9NQVg7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtpT2N0YXZlfWA7XHJcbiAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgZm9yIChsZXQgaU1vZGlmaWVyID0gMDsgaU1vZGlmaWVyIDwgbm90ZU1vZGlmaWVycy5sZW5ndGg7ICsraU1vZGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtub3RlTW9kaWZpZXJzW2lNb2RpZmllcl19JHtpT2N0YXZlfWA7XHJcbiAgICAgICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQyM0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIG5vdGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIFRoZSBsb29rdXAgdGFibGVcclxuICAgICovXHJcbiAgIGxldCBfbm90ZUxvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3RlTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGROb3RlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZUxvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZE5vdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIF9ub3RlTG9va3VwID0gY3JlYXRlVGFibGUkNCgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZUxvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IG5vdGUgdGFibGVcIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8vIGltcG9ydCB7IHJlZ2lzdGVySW5pdGlhbGl6ZXIgfSBmcm9tIFwiLi4vSW5pdGlhbGl6ZXIvSW5pdGlhbGl6ZXJcIjtcclxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVTdHJpbmdMb29rdXAuanNvblwiO1xyXG4gICBjb25zdCBVTktOT1dOX01PRElGSUVSX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJDIy9EYlwiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkQjL0ViXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJGIy9HYlwiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkcjL0FiXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQSMvQmJcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBTSEFSUF9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiQyNcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJEI1wiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiRiNcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJHI1wiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkEjXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgRkxBVF9NT0RJRklFUl9OT1RFX1NUUklOR1MgPSBbXHJcbiAgICAgICBcIkNcIixcclxuICAgICAgIFwiRGJcIixcclxuICAgICAgIFwiRFwiLFxyXG4gICAgICAgXCJFYlwiLFxyXG4gICAgICAgXCJFXCIsXHJcbiAgICAgICBcIkZcIixcclxuICAgICAgIFwiR2JcIixcclxuICAgICAgIFwiR1wiLFxyXG4gICAgICAgXCJBYlwiLFxyXG4gICAgICAgXCJBXCIsXHJcbiAgICAgICBcIkJiXCIsXHJcbiAgICAgICBcIkJcIixcclxuICAgXTtcclxuICAgY29uc3QgY3JlYXRlVGFibGUkMyA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpVG9uZSA9IFRPTkVTX01JTjsgaVRvbmUgPD0gVE9ORVNfTUFYOyArK2lUb25lKSB7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaVByZXYgPSBUT05FU19NSU47IGlQcmV2IDw9IFRPTkVTX01BWDsgKytpUHJldikge1xyXG4gICAgICAgICAgICAgICAvLyBmb3IgKGxldCBpT2N0YXZlID0gT0NUQVZFX01JTjsgaU9jdGF2ZSA8PSBPQ1RBVkVfTUFYOyBpT2N0YXZlKyspIHtcclxuICAgICAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgaWYgKE1PRElGSUVEX1NFTUlUT05FUy5pbmNsdWRlcyhpVG9uZSkpIHtcclxuICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyID0gXCItXCI7IC8vIGhhcyBhbiB1bmtub3duIG1vZGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAvLyBpZiBpcyBmbGF0XHJcbiAgICAgICAgICAgICAgICAgICBpZiAod3JhcChpVG9uZSArIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT0gaVByZXYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcImJcIjtcclxuICAgICAgICAgICAgICAgICAgIC8vIGlzIHNoYXJwXHJcbiAgICAgICAgICAgICAgICAgICBpZiAod3JhcChpVG9uZSAtIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT0gaVByZXYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcIiNcIjtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvLyBnZXQgbm90ZSBuYW1lIGZyb20gdGFibGVcclxuICAgICAgICAgICAgICAgdGFibGVbYCR7aVRvbmV9LSR7aVByZXZ9YF0gPSBnZXROb3RlTGFiZWwoaVRvbmUsIG1vZGlmaWVyKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBjb25zdCBnZXROb3RlTGFiZWwgPSAodG9uZSwgbW9kaWZpZXIpID0+IHtcclxuICAgICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgICAgICByZXR1cm4gU0hBUlBfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgICAgIGNhc2UgXCJiXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBGTEFUX01PRElGSUVSX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBVTktOT1dOX01PRElGSUVSX05PVEVfU1RSSU5HU1t0b25lXTtcclxuICAgICAgIH1cclxuICAgfTtcclxuICAgbGV0IF9ub3RlU3RyaW5nTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVTdHJpbmdMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgaWYgKE9iamVjdC5rZXlzKF9ub3RlU3RyaW5nTG9va3VwKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZVN0cmluZ0xvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyByZWdpc3RlckluaXRpYWxpemVyKCgpID0+IHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9ub3RlU3RyaW5nTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZE5vdGVTdHJpbmdUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3Qua2V5cyhfbm90ZVN0cmluZ0xvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwO1xyXG4gICAgICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSQzKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3RlU3RyaW5nTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiTm90ZSBzdHJpbmcgdGFibGUgYnVpbHQuXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwO1xyXG4gICB9O1xuXG4gICB2YXIgSURYPTI1NiwgSEVYPVtdLCBTSVpFPTI1NiwgQlVGRkVSO1xuICAgd2hpbGUgKElEWC0tKSBIRVhbSURYXSA9IChJRFggKyAyNTYpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG5cbiAgIGZ1bmN0aW9uIHVpZChsZW4pIHtcbiAgIFx0dmFyIGk9MCwgdG1wPShsZW4gfHwgMTEpO1xuICAgXHRpZiAoIUJVRkZFUiB8fCAoKElEWCArIHRtcCkgPiBTSVpFKjIpKSB7XG4gICBcdFx0Zm9yIChCVUZGRVI9JycsSURYPTA7IGkgPCBTSVpFOyBpKyspIHtcbiAgIFx0XHRcdEJVRkZFUiArPSBIRVhbTWF0aC5yYW5kb20oKSAqIDI1NiB8IDBdO1xuICAgXHRcdH1cbiAgIFx0fVxuXG4gICBcdHJldHVybiBCVUZGRVIuc3Vic3RyaW5nKElEWCwgSURYKysgKyB0bXApO1xuICAgfVxuXG4gICAvLyBpbXBvcnQgSWRlbnRpZmlhYmxlIGZyb20gXCIuLi9jb21wb3NhYmxlcy9JZGVudGlmaWFibGVcIjtcclxuICAgLyoqXHJcbiAgICAqIEEgbm90ZSBjb25zaXN0IG9mIGEgc2VtaXRvbmUgYW5kIGFuIG9jdGF2ZS48YnI+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7IE5vdGVJbml0aWFsaXplciB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7IC8vIHR5cGVzY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBOb3RlIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB3aXRoIGRlZmF1bHQgdmFsdWVzIHNlbWl0b25lIDAoQykgYW5kIG9jdGF2ZSA0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgdXNpbmcgYW4gaW5pdGlhbGl6ZXIgb2JqZWN0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoe3NlbWl0b25lOiA0LCBvY3RhdmU6IDV9KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IG5vdGUtbmFtZVttb2RpZmllcl1bb2N0YXZlXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHVzaW5nIGEgc3RyaW5nXHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoXCJDNVwiKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICB2YWx1ZXMgPSBwYXJzZU5vdGUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXM/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHZhbHVlcz8uc2VtaXRvbmUgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0aGF0IG9jdGF2ZSBpcyBzZXQgZmlyc3Qgc28gdGhhdFxyXG4gICAgICAgICAgICAgICAvLyBzZXR0aW5nIHRoZSBzZW1pdG9uZSBjYW4gY2hhbmdlIHRoZSBvY3RhdmVcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXM/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHZhbHVlcz8uc2VtaXRvbmUgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lID0gdGhpcy5fdG9uZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICB1bmlxdWUgaWQgZm9yIHRoaXMgbm90ZShhdXRvIGdlbmVyYXRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaWQpOyAvLyBzMjg5OHNubG9qXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2VtaXRvbmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgX3ByZXZTZW1pdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAwXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHNlbWl0b25lKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl90b25lO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZXR0aW5nIHRoZSBzZW1pdG9uZSB3aXRoIGEgbnVtYmVyIG91dHNpZGUgdGhlXHJcbiAgICAgICAgKiByYW5nZSBvZiAwLTExIHdpbGwgd3JhcCB0aGUgdmFsdWUgYXJvdW5kIGFuZFxyXG4gICAgICAgICogY2hhbmdlIHRoZSBvY3RhdmUgYWNjb3JkaW5nbHlcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIG5vdGUuc2VtaXRvbmUgPSA0Oy8vIEVcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyA0KEUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHNlbWl0b25lKHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAoc2VtaXRvbmUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIHRoaXMuX3RvbmUgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IHRoaXMuX29jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUub2N0YXZlKTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBub3RlLm9jdGF2ZSA9IDEwO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5vY3RhdmUpOyAvLyA5KGJlY2F1c2Ugb2YgY2xhbXBpbmcpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZShvY3RhdmUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcChvY3RhdmUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBub3RlIHRoYXQgaXMgYSBzaGFycGVuZWQgdmVyc2lvbiBvZiB0aGlzIG5vdGUuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLnNoYXJwKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlMi5zZW1pdG9uZSk7IC8vIDEoQyMpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hhcnAoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSkuc2hhcnBlbigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTaGFycGVucyB0aGUgbm90ZSBpbiBwbGFjZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBub3RlLnNoYXJwZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAxKEMjKVxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGFycGVuKCkge1xyXG4gICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lICsgMTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIGF0dGVtcHRzIHRvIGRldGVybWluZSBpZiB0aGUgbm90ZSBpcyBzaGFycFxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbm90ZSBpcyBzaGFycFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNTaGFycCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIG5vdGUuc2hhcnBlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc1NoYXJwKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNTaGFycCgpIHtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHdob2xlLCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGNvbnN0IG1vZGlmaWVkID0gTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKHRoaXMuc2VtaXRvbmUpO1xyXG4gICAgICAgICAgIGlmICghbW9kaWZpZWQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIGZsYXQsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgaWYgKHdyYXAodGhpcy5zZW1pdG9uZSArIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT1cclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vaXMgZmxhdFxyXG4gICAgICAgICAgIC8vIERvZXNuJ3QgbmVjY2VjYXJpbHkgbWVhbiBpdCdzIHNoYXJwLCBidXQgaXQncyBhIGdvb2QgZ3Vlc3MgYXQgdGhpcyBwb2ludFxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuZmxhdCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZTIuc2VtaXRvbmUpOyAvLyAzKEViKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGZsYXQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSkuZmxhdHRlbigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBGbGF0dGVucyB0aGUgbm90ZSBpbiBwbGFjZS5cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoe3NlbWl0b25lOiA0fSk7IC8vICBzZW1pdG9uZSBpcyA0KEUpXHJcbiAgICAgICAgKiBub3RlLmZsYXR0ZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuc2VtaXRvbmUpOyAvLyAzKEViKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGZsYXR0ZW4oKSB7XHJcbiAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmUgLSAxO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgYXR0ZW1wdHMgdG8gZGV0ZXJtaW5lIGlmIHRoZSBub3RlIGlzIGZsYXRcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG5vdGUgaXMgZmxhdFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNGbGF0KCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogbm90ZS5mbGF0dGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzRmxhdCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzRmxhdCgpIHtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHdob2xlLCBpdCBjYW4ndCBiZSBzaGFycFxyXG4gICAgICAgICAgIGNvbnN0IG1vZGlmaWVkID0gTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKHRoaXMuc2VtaXRvbmUpO1xyXG4gICAgICAgICAgIGlmICghbW9kaWZpZWQpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAvLyBpZiBub3RlIGlzIHNoYXJwLCBpdCBjYW4ndCBiZSBmbGF0XHJcbiAgICAgICAgICAgaWYgKHdyYXAodGhpcy5zZW1pdG9uZSAtIDEsIFRPTkVTX01JTiwgVE9ORVNfTUFYKS52YWx1ZSA9PT1cclxuICAgICAgICAgICAgICAgdGhpcy5fcHJldlNlbWl0b25lKVxyXG4gICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vaXMgc2hhcnBcclxuICAgICAgICAgICAvLyBEb2Vzbid0IG5lY2NlY2FyaWx5IG1lYW4gaXQncyBmbGF0LCBidXQgaXQncyBhIGdvb2QgZ3Vlc3MgYXQgdGhpcyBwb2ludFxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoaXMgbm90ZSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5lcXVhbHMobm90ZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VtaXRvbmUgPT09IG5vdGUuc2VtaXRvbmUgJiYgdGhpcy5vY3RhdmUgPT09IG5vdGUub2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc3Qgbm90ZTIgPSBub3RlLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuZXF1YWxzKG5vdGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiB0aGlzLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHZlcnNpb24gb2YgdGhpcyBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS50b1N0cmluZygpKTsgLy8gQzRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICpcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZVN0cmluZ0xvb2t1cCk7XHJcbiAgICAgICAgICAgcmV0dXJuIChub3RlU3RyaW5nTG9va3VwKGAke3RoaXMuX3RvbmV9LSR7dGhpcy5fcHJldlNlbWl0b25lfWApICtcclxuICAgICAgICAgICAgICAgYCR7dGhpcy5fb2N0YXZlfWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTdGF0aWMgbWV0aG9kcyB0byBjcmVhdGUgd2hvbGUgbm90ZXMgZWFzaWx5LlxyXG4gICAgICAgICogdGhlIGRlZmF1bHQgb2N0YXZlIGlzIDRcclxuICAgICAgICAqL1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBBW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5BKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBBNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBBKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5BLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBCW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5CKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBCNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBCKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5CLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBDW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5DKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBDNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBDKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5DLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBEW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5EKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBENFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBEKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5ELFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBFW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5FKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBFNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBFKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5FLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBGW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5GKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBGNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBGKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5GLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAgKiBAcGFyYW0gb2N0YXZlXHJcbiAgICAgICAgKiBAcmV0dXJucyBub3RlIHNldCB0byBHW29jdGF2ZV1cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gTm90ZS5HKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBHNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHN0YXRpYyBHKG9jdGF2ZSA9IDQpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogU2VtaXRvbmUkMS5HLFxyXG4gICAgICAgICAgICAgICBvY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIENvbnN0YW50c1xyXG4gICAgKi9cclxuICAgY29uc3QgTUlESUtFWV9TVEFSVCA9IDEyO1xyXG4gICBjb25zdCBOVU1fT0NUQVZFUyA9IDEwO1xyXG4gICBjb25zdCBOVU1fU0VNSVRPTkVTID0gMTI7XHJcbiAgIC8qKlxyXG4gICAgKiBDYWxjdWxhdGVzIHRoZSBtaWRpIGtleSBmb3IgYSBnaXZlbiBvY3RhdmUgYW5kIHNlbWl0b25lLlxyXG4gICAgKi9cclxuICAgY29uc3QgY2FsY01pZGlLZXkgPSAob2N0YXZlLCBzZW1pdG9uZSkgPT4gTUlESUtFWV9TVEFSVCArIG9jdGF2ZSAqIE5VTV9TRU1JVE9ORVMgKyBzZW1pdG9uZTtcclxuICAgLyoqXHJcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGZyZXF1ZW5jeSBmb3IgYSBnaXZlbiBvY3RhdmUgYW5kIHNlbWl0b25lIGdpdmVuXHJcbiAgICAqIGEgdHVuaW5nIGZvciBhNC5cclxuICAgICovXHJcbiAgIGNvbnN0IGNhbGNGcmVxdWVuY3kgPSAobWlkaUtleSwgYTRUdW5pbmcpID0+IDIgKiogKChtaWRpS2V5IC0gNjkpIC8gMTIpICogYTRUdW5pbmc7XHJcbiAgIC8qKlxyXG4gICAgKiBDcmVhdGVzIGFuZCByZXR1cm4gbG9va3VwIHRhYmxlcyBmb3IgbWlkaWtleSBhbmQgZnJlcXVlbmN5LlxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGVzID0gKGE0VHVuaW5nID0gNDQwKSA9PiB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE1hcHMgb2N0YXZlIGFuZCBzZW1pdG9uZSB0byBub3RlIGZyZXF1ZW5jeShoZXJ0eikuXHJcbiAgICAgICAgKiByZXF1aXJlcyBhIGtleSBpbiB0aGUgZm9ybSBvZiBgPG9jdGF2ZT4tPHNlbWl0b25lPmBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3QgZnJlcVRhYmxlID0ge307XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE1hcHMgb2N0YXZlIGFuZCBzZW1pdG9uZSB0byBtaWRpIGtleS5cclxuICAgICAgICAqIHJlcXVpcmVzIGEga2V5IGluIHRoZSBmb3JtIG9mIGA8b2N0YXZlPi08c2VtaXRvbmU+YFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdCBtaWRpVGFibGUgPSB7fTtcclxuICAgICAgIGxldCBpT2N0YXZlID0gMDtcclxuICAgICAgIGxldCBpU2VtaXRvbmUgPSAwO1xyXG4gICAgICAgZm9yIChpT2N0YXZlID0gMDsgaU9jdGF2ZSA8IE5VTV9PQ1RBVkVTOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICBmb3IgKGlTZW1pdG9uZSA9IDA7IGlTZW1pdG9uZSA8IE5VTV9TRU1JVE9ORVM7ICsraVNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke2lPY3RhdmV9LSR7aVNlbWl0b25lfWA7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG1rZXkgPSBjYWxjTWlkaUtleShpT2N0YXZlLCBpU2VtaXRvbmUpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBmcmVxID0gY2FsY0ZyZXF1ZW5jeShta2V5LCBhNFR1bmluZyk7XHJcbiAgICAgICAgICAgICAgIG1pZGlUYWJsZVtrZXldID0gbWtleTtcclxuICAgICAgICAgICAgICAgZnJlcVRhYmxlW2tleV0gPSBmcmVxO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgZnJlcUxvb2t1cDogZnJlcVRhYmxlLFxyXG4gICAgICAgICAgIG1pZGlMb29rdXA6IG1pZGlUYWJsZSxcclxuICAgICAgIH07XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBUdW5pbmcgY29tcG9uZW50IHVzZWQgYnkgSW5zdHJ1bWVudCBjbGFzczxicj5cclxuICAgICogY29udGFpbmVzIHRoZSBhNCB0dW5pbmcgLSBkZWZhdWx0IGlzIDQ0MEh6PGJyPlxyXG4gICAgKiBidWlsZHMgbG9va3VwIHRhYmxlcyBmb3IgbWlkaSBrZXkgYW5kIGZyZXF1ZW5jeTxicj5cclxuICAgICogYmFzZWQgb24gdGhlIHR1bmluZ1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNsYXNzIFR1bmluZyB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIENyZWF0ZXMgdGhlIG9iamVjdCBhbmQgYnVpbGRzIHRoZSBsb29rdXAgdGFibGVzLlxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3RvcihhNEZyZXEgPSA0NDApIHtcclxuICAgICAgICAgICB0aGlzLl9hNCA9IGE0RnJlcTtcclxuICAgICAgICAgICB0aGlzLmJ1aWxkVGFibGVzKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuaXF1ZSBpZCBmb3IgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IFR1bmluZyh0aGlzLl9hNCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYTQgPT09IG90aGVyLl9hNDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogYTQgVHVuaW5nXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9hNCA9IDQ0MDtcclxuICAgICAgIGdldCBhNCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYTQ7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNldHRpbmcgdGhlIHR1bmluZyB3aWxsIHJlYnVpbGQgdGhlIGxvb2t1cCB0YWJsZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGE0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYTQgPSB2YWx1ZTtcclxuICAgICAgICAgICB0aGlzLmJ1aWxkVGFibGVzKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGxvb2t1cCB0YWJsZSBmb3IgbWlkaSBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgX21pZGlLZXlUYWJsZSA9IHt9O1xyXG4gICAgICAgbWlkaUtleUxvb2t1cChvY3RhdmUsIHNlbWl0b25lKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7b2N0YXZlfS0ke3NlbWl0b25lfWA7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pZGlLZXlUYWJsZVtrZXldO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBsb29rdXAgdGFibGUgZm9yIGZyZXF1ZW5jeVxyXG4gICAgICAgICovXHJcbiAgICAgICBfZnJlcVRhYmxlID0ge307XHJcbiAgICAgICBmcmVxTG9va3VwKG9jdGF2ZSwgc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtvY3RhdmV9LSR7c2VtaXRvbmV9YDtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlcVRhYmxlW2tleV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEJ1aWxkcyB0aGUgbG9va3VwIHRhYmxlcyBmb3IgbWlkaSBrZXkgYW5kIGZyZXF1ZW5jeVxyXG4gICAgICAgICovXHJcbiAgICAgICBidWlsZFRhYmxlcygpIHtcclxuICAgICAgICAgICBjb25zdCB0YWJsZXMgPSBjcmVhdGVUYWJsZXModGhpcy5fYTQpO1xyXG4gICAgICAgICAgIHRoaXMuX21pZGlLZXlUYWJsZSA9IHRhYmxlcy5taWRpTG9va3VwO1xyXG4gICAgICAgICAgIHRoaXMuX2ZyZXFUYWJsZSA9IHRhYmxlcy5mcmVxTG9va3VwO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSB0dW5pbmcgYXMgYSBzdHJpbmdcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGBUdW5pbmcoJHt0aGlzLl9hNH0pYDtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogSW5zdHJ1bWVudCBhcmUgdXNlZCB0byBlbmNhcHN1bGF0ZSB0aGUgdHVuaW5nIGFuZCByZXRyaWV2aW5nIG9mIG1pZGkga2V5c1xyXG4gICAgKiBhbmQgZnJlcXVlbmNpZXMgZm9yIG5vdGVzXHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgSW5zdHJ1bWVudCB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqL1xyXG4gICBjbGFzcyBJbnN0cnVtZW50IHtcclxuICAgICAgIHR1bmluZztcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIHR1bmluZyBBNCBmcmVxdWVuY3kgLSBkZWZhdWx0cyB0byA0NDBcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTsgLy8gZGVmYXVsdCA0NDAgdHVuaW5nXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IoYTRGcmVxID0gNDQwKSB7XHJcbiAgICAgICAgICAgdGhpcy50dW5pbmcgPSBuZXcgVHVuaW5nKGE0RnJlcSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIGEgdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmlkOyAvLyByZXR1cm5zIGEgdW5pcXVlIGlkXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBpbnN0cnVtZW50LmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGluc3RydW1lbnQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVtZW50KHRoaXMudHVuaW5nLmE0KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIG90aGVyIHRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZVxyXG4gICAgICAgICogQHJldHVybnMgIHRydWUgaWYgdGhlIG90aGVyIG9iamVjdCBpcyBlcXVhbCB0byB0aGlzIG9uZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGluc3RydW1lbnQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLmVxdWFscyhvdGhlci50dW5pbmcpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgZnJlcXVlbmN5IG9mIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBpbnN0cnVtZW50LmdldEZyZXF1ZW5jeShuZXcgTm90ZShcIkM0XCIpKTsgLy8gcmV0dXJucyAyNjEuNjI1NTY1MzAwNTk4NlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldEZyZXF1ZW5jeShub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLmZyZXFMb29rdXAobm90ZS5vY3RhdmUsIG5vdGUuc2VtaXRvbmUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbWlkaSBrZXkgb2YgdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuZ2V0TWlkaUtleShuZXcgTm90ZShcIkM0XCIpKTsgLy8gcmV0dXJucyA2MFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE1pZGlLZXkobm90ZSkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLnR1bmluZy5taWRpS2V5TG9va3VwKG5vdGUub2N0YXZlLCBub3RlLnNlbWl0b25lKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIHR1bmluZyBhcyBhIHN0cmluZ1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC50b1N0cmluZygpKTsgLy8gcmV0dXJucyBcIkluc3RydW1lbnQgVHVuaW5nKDQ0MClcIlxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIHJldHVybiBgSW5zdHJ1bWVudCBUdW5pbmcoJHt0aGlzLnR1bmluZy5hNH0pYDtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICBjb25zdCBERUZBVUxUX1NDQUxFX1RFTVBMQVRFID0gWzAsIDIsIDIsIDEsIDIsIDIsIDJdOyAvLyBtYWpvclxyXG4gICBPYmplY3QuZnJlZXplKERFRkFVTFRfU0NBTEVfVEVNUExBVEUpO1xuXG4gICAvKipcclxuICAgICogTWFwcyBwcmVkZWZpbmVkIHNjYWxlcyB0byB0aGVpciBuYW1lcy5cclxuICAgICovXHJcbiAgIGNvbnN0IFNjYWxlVGVtcGxhdGVzID0ge1xyXG4gICAgICAgd2hvbGVUb25lOiBbMCwgMiwgMiwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICAvLyBtYWpvclxyXG4gICAgICAgbWFqb3I6IFswLCAyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIG1ham9yN3M0czU6IFswLCAyLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIC8vIG1vZGVzXHJcbiAgICAgICAvLyBpb25pYW46IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1ham9yXHJcbiAgICAgICAvLyBhZW9saWFuOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtaW5vclxyXG4gICAgICAgZG9yaWFuOiBbMCwgMiwgMSwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBwaHJ5Z2lhbjogWzAsIDEsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgbHlkaWFuOiBbMCwgMiwgMiwgMiwgMSwgMiwgMl0sXHJcbiAgICAgICBseWRpYW5Eb21pbmFudDogWzAsIDIsIDIsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgLy8gYWNvdXN0aWM6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIGx5ZGlhbkRvbWluYW50XHJcbiAgICAgICBtaXhvbHlkaWFuOiBbMCwgMiwgMiwgMSwgMiwgMiwgMV0sXHJcbiAgICAgICBtaXhvbHlkaWFuRmxhdDY6IFswLCAyLCAyLCAxLCAyLCAxLCAyXSxcclxuICAgICAgIGxvY3JpYW46IFswLCAxLCAyLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIHN1cGVyTG9jcmlhbjogWzAsIDEsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgLy8gbWlub3JcclxuICAgICAgIG1pbm9yOiBbMCwgMiwgMSwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICBtaW5vcjdiOTogWzAsIDEsIDIsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgbWlub3I3YjU6IFswLCAyLCAxLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIC8vIGhhbGZEaW1pbmlzaGVkOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBtaW5vcjdiNVxyXG4gICAgICAgLy8gaGFybW9uaWNcclxuICAgICAgIGhhcm1vbmljTWFqb3I6IFswLCAyLCAyLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIGhhcm1vbmljTWlub3I6IFswLCAyLCAxLCAyLCAyLCAxLCAzXSxcclxuICAgICAgIGRvdWJsZUhhcm1vbmljOiBbMCwgMSwgMywgMSwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBieXphbnRpbmU6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIGRvdWJsZUhhcm1vbmljXHJcbiAgICAgICAvLyBtZWxvZGljXHJcbiAgICAgICBtZWxvZGljTWlub3JBc2NlbmRpbmc6IFswLCAyLCAxLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIG1lbG9kaWNNaW5vckRlc2NlbmRpbmc6IFswLCAyLCAyLCAxLCAyLCAyLCAxXSxcclxuICAgICAgIC8vIHBlbnRhdG9uaWNcclxuICAgICAgIG1ham9yUGVudGF0b25pYzogWzAsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgbWFqb3JQZW50YXRvbmljQmx1ZXM6IFswLCAyLCAxLCAxLCAzLCAyXSxcclxuICAgICAgIG1pbm9yUGVudGF0b25pYzogWzAsIDMsIDIsIDIsIDNdLFxyXG4gICAgICAgbWlub3JQZW50YXRvbmljQmx1ZXM6IFswLCAzLCAyLCAxLCAxLCAzXSxcclxuICAgICAgIGI1UGVudGF0b25pYzogWzAsIDMsIDIsIDEsIDQsIDJdLFxyXG4gICAgICAgbWlub3I2UGVudGF0b25pYzogWzAsIDMsIDIsIDIsIDIsIDNdLFxyXG4gICAgICAgLy8gZW5pZ21hdGljXHJcbiAgICAgICBlbmlnbWF0aWNNYWpvcjogWzAsIDEsIDMsIDIsIDIsIDIsIDFdLFxyXG4gICAgICAgZW5pZ21hdGljTWlub3I6IFswLCAxLCAyLCAzLCAxLCAzLCAxXSxcclxuICAgICAgIC8vIDhUb25lXHJcbiAgICAgICBkaW04VG9uZTogWzAsIDIsIDEsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgZG9tOFRvbmU6IFswLCAxLCAyLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIC8vIG5lYXBvbGl0YW5cclxuICAgICAgIG5lYXBvbGl0YW5NYWpvcjogWzAsIDEsIDIsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgbmVhcG9saXRhbk1pbm9yOiBbMCwgMSwgMiwgMiwgMiwgMSwgM10sXHJcbiAgICAgICAvLyBodW5nYXJpYW5cclxuICAgICAgIGh1bmdhcmlhbk1ham9yOiBbMCwgMywgMSwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICBodW5nYXJpYW5NaW5vcjogWzAsIDIsIDEsIDMsIDEsIDEsIDNdLFxyXG4gICAgICAgaHVuZ2FyaWFuR3lwc3k6IFswLCAxLCAzLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIHNwYW5pc2hcclxuICAgICAgIHNwYW5pc2g6IFswLCAxLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgIHNwYW5pc2g4VG9uZTogWzAsIDEsIDIsIDEsIDEsIDEsIDIsIDJdLFxyXG4gICAgICAgLy8gamV3aXNoOiBbXSwgLy8gc2V0IGJlbG93IC0gc2FtZSBhcyBzcGFuaXNoOFRvbmVcclxuICAgICAgIHNwYW5pc2hHeXBzeTogWzAsIDEsIDMsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gYXVnIGRvbVxyXG4gICAgICAgYXVnbWVudGVkOiBbMCwgMywgMSwgMywgMSwgMywgMV0sXHJcbiAgICAgICBkb21pbmFudFN1c3BlbmRlZDogWzAsIDIsIDMsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gYmVib3BcclxuICAgICAgIGJlYm9wTWFqb3I6IFswLCAyLCAyLCAxLCAyLCAxLCAxLCAyXSxcclxuICAgICAgIGJlYm9wRG9taW5hbnQ6IFswLCAyLCAyLCAxLCAyLCAyLCAxLCAxXSxcclxuICAgICAgIG15c3RpYzogWzAsIDIsIDIsIDIsIDMsIDJdLFxyXG4gICAgICAgb3ZlcnRvbmU6IFswLCAyLCAyLCAyLCAxLCAxLCAyXSxcclxuICAgICAgIGxlYWRpbmdUb25lOiBbMCwgMiwgMiwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICAvLyBqYXBhbmVzZVxyXG4gICAgICAgaGlyb2pvc2hpOiBbMCwgMiwgMSwgNCwgMV0sXHJcbiAgICAgICBqYXBhbmVzZUE6IFswLCAxLCA0LCAxLCAzXSxcclxuICAgICAgIGphcGFuZXNlQjogWzAsIDIsIDMsIDEsIDNdLFxyXG4gICAgICAgLy8gY3VsdHVyZXNcclxuICAgICAgIG9yaWVudGFsOiBbMCwgMSwgMywgMSwgMSwgMywgMV0sXHJcbiAgICAgICBwZXJzaWFuOiBbMCwgMSwgNCwgMSwgMiwgM10sXHJcbiAgICAgICBhcmFiaWFuOiBbMCwgMiwgMiwgMSwgMSwgMiwgMl0sXHJcbiAgICAgICBiYWxpbmVzZTogWzAsIDEsIDIsIDQsIDFdLFxyXG4gICAgICAga3Vtb2k6IFswLCAyLCAxLCA0LCAyLCAyXSxcclxuICAgICAgIHBlbG9nOiBbMCwgMSwgMiwgMywgMSwgMV0sXHJcbiAgICAgICBhbGdlcmlhbjogWzAsIDIsIDEsIDIsIDEsIDEsIDEsIDNdLFxyXG4gICAgICAgY2hpbmVzZTogWzAsIDQsIDIsIDEsIDRdLFxyXG4gICAgICAgbW9uZ29saWFuOiBbMCwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBlZ3lwdGlhbjogWzAsIDIsIDMsIDIsIDNdLFxyXG4gICAgICAgcm9tYWluaWFuOiBbMCwgMiwgMSwgMywgMSwgMiwgMV0sXHJcbiAgICAgICBoaW5kdTogWzAsIDIsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgaW5zZW46IFswLCAxLCA0LCAyLCAzXSxcclxuICAgICAgIGl3YXRvOiBbMCwgMSwgNCwgMSwgNF0sXHJcbiAgICAgICBzY290dGlzaDogWzAsIDIsIDMsIDIsIDJdLFxyXG4gICAgICAgeW86IFswLCAzLCAyLCAyLCAzXSxcclxuICAgICAgIGlzdHJpYW46IFswLCAxLCAyLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIHVrcmFuaWFuRG9yaWFuOiBbMCwgMiwgMSwgMywgMSwgMiwgMV0sXHJcbiAgICAgICBwZXRydXNoa2E6IFswLCAxLCAzLCAyLCAxLCAzXSxcclxuICAgICAgIGFoYXZhcmFiYTogWzAsIDEsIDMsIDEsIDIsIDEsIDJdLFxyXG4gICB9O1xyXG4gICAvLyBkdXBsaWNhdGVzIHdpdGggYWxpYXNlc1xyXG4gICBTY2FsZVRlbXBsYXRlcy5oYWxmRGltaW5pc2hlZCA9IFNjYWxlVGVtcGxhdGVzLm1pbm9yN2I1O1xyXG4gICBTY2FsZVRlbXBsYXRlcy5qZXdpc2ggPSBTY2FsZVRlbXBsYXRlcy5zcGFuaXNoOFRvbmU7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmJ5emFudGluZSA9IFNjYWxlVGVtcGxhdGVzLmRvdWJsZUhhcm1vbmljO1xyXG4gICBTY2FsZVRlbXBsYXRlcy5hY291c3RpYyA9IFNjYWxlVGVtcGxhdGVzLmx5ZGlhbkRvbWluYW50O1xyXG4gICBTY2FsZVRlbXBsYXRlcy5hZW9saWFuID0gU2NhbGVUZW1wbGF0ZXMubWlub3I7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmlvbmlhbiA9IFNjYWxlVGVtcGxhdGVzLm1ham9yO1xyXG4gICBPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcykuZm9yRWFjaCgoZWxlbWVudCkgPT4gT2JqZWN0LmZyZWV6ZShTY2FsZVRlbXBsYXRlc1tlbGVtZW50XSkpO1xuXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIGNvbnN0IG5hbWVSZWdleCQxID0gLyhbQS1HXSkoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCQxID0gLygjfHN8YikoPyFbXihdKlxcKSkvZztcclxuICAgY29uc3Qgb2N0YXZlUmVnZXgkMSA9IC8oWzAtOV0rKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBzY2FsZU5hbWVSZWdleCA9IC8oXFwoW2EtekEtWl17Mix9XFwpKS9nO1xyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gcGFyc2UgYSBub3RlIGZyb20gYSBzdHJpbmdcclxuICAgICogQHBhcmFtIHNjYWxlIC0gdGhlIHN0cmluZyB0byBwYXJzZVxyXG4gICAgKiBAcGFyYW0gc3VwcmVzc1dhcm5pbmcgLSBzdXByZXNzIHRoZSB3YXJuaW5nIGZvciBpbmVmZmVjaWVuY3kgaWYgdHJ1ZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlU2NhbGUgPSAoc2NhbGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2NhbGVMb29rdXAoc2NhbGUpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBzY2FsZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7c2NhbGV9LiBHZXQgYSBwZXJmb3JtYW5jIGluY3JlYXNlIGJ5IHVzaW5nIGEgdmFsaWQgZm9ybWF0YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBzY2FsZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7c2NhbGV9LiBHZXQgYSBwZXJmb3JtYW5jIGluY3JlYXNlIGJ5IHVzaW5nIGEgdmFsaWQgZm9ybWF0YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZUlkZW5pZmllciA9IFwiXCI7XHJcbiAgICAgICBsZXQgbm90ZU1vZGlmaWVyID0gMDtcclxuICAgICAgIGxldCBub3RlT2N0YXZlID0gXCJcIjtcclxuICAgICAgIGxldCBzY2FsZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gc2NhbGUubWF0Y2gobmFtZVJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IHNjYWxlLm1hdGNoKG1vZGlmaWVyUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IHNjYWxlLm1hdGNoKG9jdGF2ZVJlZ2V4JDEpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lTWF0Y2ggPSBzY2FsZS5tYXRjaChzY2FsZU5hbWVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoc2NhbGVOYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBzTmFtZSA9IHNjYWxlTmFtZU1hdGNoLmpvaW4oXCJcIik7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coc05hbWUpO1xyXG4gICAgICAgICAgIHNjYWxlTmFtZSA9IHNOYW1lO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIGxldCB0ZW1wbGF0ZUluZGV4ID0gMTsgLy8gZGVmYXVsdCBtYWpvciBzY2FsZVxyXG4gICAgICAgICAgIGlmIChzY2FsZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGVJbmRleCA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKS5maW5kSW5kZXgoKHRlbXBsYXRlKSA9PiB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgICAgICAgIC5pbmNsdWRlcyhzY2FsZU5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpKSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKVt0ZW1wbGF0ZUluZGV4XSk7XHJcbiAgICAgICAgICAgaWYgKHRlbXBsYXRlSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5LTk9XTiBURU1QTEFURVwiLCBzY2FsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHRlbXBsYXRlIGZvciBzY2FsZSAke3NjYWxlTmFtZX1gKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlc1tPYmplY3Qua2V5cyhTY2FsZVRlbXBsYXRlcylbdGVtcGxhdGVJbmRleF1dO1xyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIGtleTogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBTY2FsZTogJHtzY2FsZX1gKTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQyID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgc2NhbGVUYWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGNvbnN0IHRlbXBsYXRlcyA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgdGVtcGxhdGVzKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBub3RlTGFiZWwgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICAgICAgLy9leCBBKG1pbm9yKVxyXG4gICAgICAgICAgICAgICBzY2FsZVRhYmxlW2Ake25vdGVMYWJlbH0oJHt0ZW1wbGF0ZX0pYF0gPSBwYXJzZVNjYWxlKG5vdGVMYWJlbCwgdHJ1ZSk7IC8vICdDJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHttb2R9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBleCBBIyhtaW5vcilcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0MjJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDwgT0NUQVZFX01BWDsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtpT2N0YXZlfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gZXggQTQobWlub3IpXHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9kIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHttb2R9JHtpT2N0YXZlfSgke3RlbXBsYXRlfSlgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGV4IEEjNChtaW5vcilcclxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2tleV0gPSBwYXJzZVNjYWxlKGtleSwgdHJ1ZSk7IC8vICdDIzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gc2NhbGVUYWJsZTtcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgdGhlIGxvb2t1cCB0YWJsZSBhcyBzb29uIGFzIHRoZSBtb2R1bGUgaXMgbG9hZGVkXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgbGV0IF9zY2FsZUxvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBzY2FsZUxvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9zY2FsZUxvb2t1cFtrZXldO1xyXG4gICB9O1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX3NjYWxlTG9va3VwID0gdGFibGUgYXMgeyBba2V5OiBzdHJpbmddOiBTY2FsZUluaXRpYWxpemVyIH07XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9zY2FsZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRTY2FsZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9zY2FsZUxvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9zY2FsZUxvb2t1cDtcclxuICAgICAgIF9zY2FsZUxvb2t1cCA9IGNyZWF0ZVRhYmxlJDIoKTtcclxuICAgICAgIC8vIE9iamVjdC5mcmVlemUoX3NjYWxlTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiU2NhbGUgVGFibGUgQnVpbHRcIik7XHJcbiAgICAgICByZXR1cm4gX3NjYWxlTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogc2hpZnRzIGFuIGFycmF5IGJ5IGEgZ2l2ZW4gZGlzdGFuY2VcclxuICAgICogQHBhcmFtIGFyciB0aGUgYXJyYXkgdG8gc2hpZnRcclxuICAgICogQHBhcmFtIGRpc3RhbmNlIHRoZSBkaXN0YW5jZSB0byBzaGlmdFxyXG4gICAgKiBAcmV0dXJucyB0aGUgc2hpZnRlZCBhcnJheVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNoaWZ0ID0gKGFyciwgZGlzdCA9IDEpID0+IHtcclxuICAgICAgIGFyciA9IFsuLi5hcnJdOyAvLyBjb3B5XHJcbiAgICAgICBpZiAoZGlzdCA+IGFyci5sZW5ndGggfHwgZGlzdCA8IDAgLSBhcnIubGVuZ3RoKVxyXG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNoaWZ0OiBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gYXJyYXkgbGVuZ3RoXCIpO1xyXG4gICAgICAgaWYgKGRpc3QgPiAwKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGVtcCA9IGFyci5zcGxpY2UoYXJyLmxlbmd0aCAtIGRpc3QsIEluZmluaXR5KTtcclxuICAgICAgICAgICBhcnIudW5zaGlmdCguLi50ZW1wKTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChkaXN0IDwgMCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnIuc3BsaWNlKDAsIGRpc3QpO1xyXG4gICAgICAgICAgIGFyci5wdXNoKC4uLnRlbXApO1xyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGFycjtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqICBTaW1wbGUgdXRpbCB0byBsYXp5IGNsb25lIGFuIG9iamVjdFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNsb25lID0gKG9iaikgPT4ge1xyXG4gICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBzaW1wbGUgdXRpbCB0byBsYXp5IGNoZWNrIGVxdWFsaXR5IG9mIG9iamVjdHMgYW5kIGFycmF5c1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGlzRXF1YWwgPSAoYSwgYikgPT4ge1xyXG4gICAgICAgY29uc3Qgc3RyaW5nQSA9IEpTT04uc3RyaW5naWZ5KGEpO1xyXG4gICAgICAgY29uc3Qgc3RyaW5nQiA9IEpTT04uc3RyaW5naWZ5KGIpO1xyXG4gICAgICAgcmV0dXJuIHN0cmluZ0EgPT09IHN0cmluZ0I7XHJcbiAgIH07XG5cbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlU3RyaW5nTG9va3VwLmpzb25cIjtcclxuICAgLyoqXHJcbiAgICAqIFdpbGwgbG9va3VwIGEgc2NhbGUgbmFtZSBiYXNlZCBvbiB0aGUgdGVtcGxhdGUuXHJcbiAgICAqIEBwYXJhbSB0ZW1wbGF0ZSAtIHRoZSB0ZW1wbGF0ZSB0byBsb29rdXBcclxuICAgICogQHBhcmFtIHN1cHJlc3NXYXJuaW5nIC0gc3VwcmVzcyB0aGUgd2FybmluZyBmb3IgaW5lZmZlY2llbmN5IGlmIHRydWVcclxuICAgICogQHJldHVybnMgdGhlIHNjYWxlIG5hbWVcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBzY2FsZU5hbWVMb29rdXAgPSAodGVtcGxhdGUsIHN1cHJlc3NXYXJuaW5nID0gZmFsc2UpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmFtZVRhYmxlKEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdClcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKTtcclxuICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgY29uc3Qgc2NhbGVOYW1lcyA9IFtdO1xyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgaWYgKGlzRXF1YWwodmFsdWVzW2ldLCB0ZW1wbGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgc2NhbGVOYW1lcy5wdXNoKGtleXNbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXlzW2ldLnNsaWNlKDEpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVzU3RyaW5nID0gc2NhbGVOYW1lcy5qb2luKFwiIEFLQSBcIik7XHJcbiAgICAgICByZXR1cm4gc2NhbGVOYW1lc1N0cmluZztcclxuICAgfTtcclxuICAgY29uc3QgY3JlYXRlVGFibGUkMSA9ICgpID0+IHtcclxuICAgICAgIGNvbnN0IHRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgdGFibGVbSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpXSA9IHNjYWxlTmFtZUxvb2t1cCh0ZW1wbGF0ZSwgdHJ1ZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGxldCBfbmFtZVRhYmxlID0ge307XHJcbiAgIGNvbnN0IG5hbWVUYWJsZSA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVOYW1lVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbmFtZVRhYmxlW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfbmFtZVRhYmxlID0gdGFibGU7XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9uYW1lVGFibGUgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVOYW1lVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX25hbWVUYWJsZSkubGVuZ3RoID4gMCkgcmV0dXJuIF9uYW1lVGFibGU7XHJcbiAgICAgICBfbmFtZVRhYmxlID0gY3JlYXRlVGFibGUkMSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbmFtZVRhYmxlKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiU2NhbGUgbmFtZSB0YWJsZSBidWlsdFwiKTtcclxuICAgICAgIHJldHVybiBfbmFtZVRhYmxlO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2NhbGVzIGNvbnNpc3Qgb2YgYSBrZXkodG9uaWMgb3Igcm9vdCkgYW5kIGEgdGVtcGxhdGUoYXJyYXkgb2YgaW50ZWdlcnMpIHRoYXRcclxuICAgICogPGJyPiByZXByZXNlbnRzIHRoZSBpbnRlcnZhbCBvZiBzdGVwcyBiZXR3ZWVuIGVhY2ggbm90ZS5cclxuICAgICogPGJyPjxicj5TY2FsZSBpbnRlcnZhbHMgYXJlIHJlcHJlc2VudGVkIGJ5IGFuIGludGVnZXJcclxuICAgICogPGJyPnRoYXQgaXMgdGhlIG51bWJlciBvZiBzZW1pdG9uZXMgYmV0d2VlbiBlYWNoIG5vdGUuXHJcbiAgICAqIDxicj4wID0ga2V5IC0gd2lsbCBhbHdheXMgcmVwcmVzZW50IHRoZSB0b25pY1xyXG4gICAgKiA8YnI+MSA9IGhhbGYgc3RlcFxyXG4gICAgKiA8YnI+MiA9IHdob2xlIHN0ZXBcclxuICAgICogPGJyPjMgPSBvbmUgYW5kIG9uZSBoYWxmIHN0ZXBzXHJcbiAgICAqIDxicj40ID0gZG91YmxlIHN0ZXBcclxuICAgICogPGJyPlswLCAyLCAyLCAxLCAyLCAyLCAyXSByZXByZXNlbnRzIHRoZSBtYWpvciBzY2FsZVxyXG4gICAgKiA8YnI+PGJyPiBTY2FsZSB0ZW1wbGF0ZXMgbWF5IGhhdmUgYXJiaXRyYXkgbGVuZ3Roc1xyXG4gICAgKlxyXG4gICAgKiBUaGUgZm9sbG93aW5nIFByZS1kZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOlxyXG4gICAgKiA8dGFibGU+XHJcbiAgICAqIDx0cj5cclxuICAgICogPHRkPm1ham9yPC90ZD5cclxuICAgICogPHRkPm1pbm9yPC90ZD5cclxuICAgICogPHRkPmlvbmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5kb3JpYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnBocnlnaWFuPC90ZD5cclxuICAgICogPHRkPmx5ZGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5taXhvbHlkaWFuPC90ZD5cclxuICAgICogPHRkPmFlb2xpYW48L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmxvY3JpYW48L3RkPlxyXG4gICAgKiA8dGQ+ZW5pZ21hdGljTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+ZW5pZ21hdGljTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I3YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1ham9yN3M0czU8L3RkPlxyXG4gICAgKiA8dGQ+aGFybW9uaWNNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5oYXJtb25pY01pbm9yPC90ZD5cclxuICAgICogPHRkPmRvdWJsZUhhcm1vbmljPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tZWxvZGljTWlub3JBc2NlbmRpbmc8L3RkPlxyXG4gICAgKiA8dGQ+bWVsb2RpY01pbm9yRGVzY2VuZGluZzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbm9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAqIDx0ZD5iNVBlbnRhdG9uaWM8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I2UGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZGltOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+bmVvcG9saXRhbk1ham9yPC90ZD5cclxuICAgICogPHRkPm5lb3BvbGl0YW5NaW5vcjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+aHVuZ2FyaWFuR3lwc3k8L3RkPlxyXG4gICAgKiA8dGQ+c3BhbmlzaDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+c3BhbmlzaDhUb25lPC90ZD5cclxuICAgICogPHRkPnNwYW5pc2hHeXBzeTwvdGQ+XHJcbiAgICAqIDx0ZD5hdWdtZW50ZWQ8L3RkPlxyXG4gICAgKiA8dGQ+ZG9taW5hbnRTdXNwZW5kZWQ8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmJlYm9wTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+YmVib3BEb21pbmFudDwvdGQ+XHJcbiAgICAqIDx0ZD5teXN0aWM8L3RkPlxyXG4gICAgKiA8dGQ+b3ZlcnRvbmU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmxlYWRpbmdUb25lPC90ZD5cclxuICAgICogPHRkPmhpcm9qb3NoaTwvdGQ+XHJcbiAgICAqIDx0ZD5qYXBhbmVzZUE8L3RkPlxyXG4gICAgKiA8dGQ+amFwYW5lc2VCPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5vcmllbnRhbDwvdGQ+XHJcbiAgICAqIDx0ZD5hcmFiaWFuPC90ZD5cclxuICAgICogPHRkPnBlcnNpYW48L3RkPlxyXG4gICAgKiA8dGQ+YmFsaW5lc2U8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmt1bW9pPC90ZD5cclxuICAgICogPHRkPnBlbG9nPC90ZD5cclxuICAgICogPHRkPmFsZ2VyaWFuPC90ZD5cclxuICAgICogPHRkPmNoaW5lc2U8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1vbmdvbGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5lZ3lwdGlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAqIDx0ZD5yb21hbmlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgKiA8dGQ+aW5zZW48L3RkPlxyXG4gICAgKiA8dGQ+aXdhdG88L3RkPlxyXG4gICAgKiA8dGQ+c2NvdHRpc2g8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnlvPC90ZD5cclxuICAgICogPHRkPmlzdHJpYW48L3RkPlxyXG4gICAgKiA8dGQ+dWtyYW5pYW5Eb3JpYW48L3RkPlxyXG4gICAgKiA8dGQ+cGV0cnVzaGthPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5haGF2YXJhYmE8L3RkPlxyXG4gICAgKiA8dGQ+aGFsZkRpbWluaXNoZWQ8L3RkPlxyXG4gICAgKiA8dGQ+amV3aXNoPC90ZD5cclxuICAgICogPHRkPmJ5emFudGluZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YWNvdXN0aWM8L3RkPlxyXG4gICAgKiA8L3RhYmxlPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7U2NhbGV9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgKiBpbXBvcnQge1NjYWxlVGVtcGxhdGVzfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICogaW1wb3J0IHtTY2FsZUluaXRpYWxpemVyfSBmcm9tICdtdXNpY3RoZW9yeWpzJzsgLy8gVHlwZVNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIFNjYWxlIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGltcG9ydCB7U2NhbGUsIFNjYWxlVGVtcGxhdGVzfSBmcm9tICdtdXNpY3RoZW9yeWpzJztcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgZGVmYXVsdCB0ZW1wbGF0ZSwga2V5IDBmIDAoQykgYW5kIGFuIG9jdGF2ZSBvZiA0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSB0ZW1wbGF0ZSBbMCwgMiwgMiwgMSwgMiwgMiwgMl0gYW5kIGtleSA0KEUpIGFuZCBvY3RhdmUgNVxyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gbmV3IFNjYWxlKHtrZXk6IDQsIG9jdGF2ZTogNSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1ham9yfSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogbm90ZS1uYW1lW2FsdGVyYXRpb25dW29jdGF2ZV1bKHNjYWxlLW5hbWUpXVxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIG1pbm9yIHRlbXBsYXRlLCBrZXkgR2IgYW5kIGFuIG9jdGF2ZSBvZiA3XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTMgPSBuZXcgU2NhbGUoJ0diNyhtaW5vciknKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gREVGQVVMVF9TQ0FMRV9URU1QTEFURTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlcyA9IHBhcnNlU2NhbGUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFsuLi4odmFsdWVzPy50ZW1wbGF0ZSA/PyBERUZBVUxUX1NDQUxFX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gdmFsdWVzLmtleSB8fCBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgfHwgREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAvLyBpbXBvcnRhbnQgdGhhdCBvY3RhdmUgaXMgc2V0IGZpcnN0IHNvIHRoYXRcclxuICAgICAgICAgICAgICAgLy8gc2V0dGluZyB0aGUgc2VtaXRvbmUgY2FuIGNoYW5nZSB0aGUgb2N0YXZlXHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBbLi4uKHZhbHVlcz8udGVtcGxhdGUgPz8gREVGQVVMVF9TQ0FMRV9URU1QTEFURSldO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IHZhbHVlcy5rZXkgfHwgREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlIHx8IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIHVuaXF1ZSBpZCBmb3IgdGhpcyBzY2FsZShhdXRvIGdlbmVyYXRlZClcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuaWQpOyAvLyBkaGxrajVqMzIyXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgc2NhbGUgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIHNjYWxlXHJcbiAgICAgICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc2NhbGUgdG8gY29tcGFyZSB0b1xyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgc2NhbGVzIGFyZSBlcXVhbFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmVxdWFscyhzY2FsZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhzY2FsZSkge1xyXG4gICAgICAgICAgIHJldHVybiAodGhpcy5fa2V5ID09PSBzY2FsZS5fa2V5ICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMuX29jdGF2ZSA9PT0gc2NhbGUuX29jdGF2ZSAmJlxyXG4gICAgICAgICAgICAgICBpc0VxdWFsKHRoaXMuX3RlbXBsYXRlLCBzY2FsZS5fdGVtcGxhdGUpKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhpcyBTY2FsZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgU2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc3Qgc2NhbGUyID0gc2NhbGUuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZXF1YWxzKHNjYWxlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5rZXksXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBjbG9uZSh0aGlzLnRlbXBsYXRlKSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsICE9PSAwKVxyXG4gICAgICAgICAgICAgICBzY2FsZS5zaGlmdCh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICoga2V5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9rZXkgPSAwO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmtleSk7IC8vIDAoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IGtleSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIHRoZSBzZW1pdG9uZSB0byBhIHZhbHVlIG91dHNpZGUgb2YgdGhlIHJhbmdlIFswLCAxMV0oc2VtaXRvbmUpIHdpbGw8YnIvPlxyXG4gICAgICAgICogd3JhcCB0aGUgc2VtaXRvbmUgdG8gdGhlIHJhbmdlIFswLCAxMV0gYW5kIGNoYW5nZSB0aGUgb2N0YXZlIGRlcGVuZGluZzxici8+XHJcbiAgICAgICAgKiBvbiBob3cgbWFueSB0aW1lcyB0aGUgc2VtaXRvbmUgaGFzIGJlZW4gd3JhcHBlZC5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUua2V5ID0gNDtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmtleSk7IC8vIDRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQga2V5KHZhbHVlKSB7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAodmFsdWUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHRoaXMub2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICB0aGlzLl9rZXkgPSB3cmFwcGVkLnZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBvY3RhdmVcclxuICAgICAgICAqL1xyXG4gICAgICAgX29jdGF2ZSA9IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUub2N0YXZlKTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS5vY3RhdmUgPSA1O1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUub2N0YXZlKTsgLy8gNVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBvY3RhdmUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSBjbGFtcCh2YWx1ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHRlbXBsYXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90ZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRlbXBsYXRlKTsgLy8gWzAsIDIsIDIsIDEsIDIsIDIsIDJdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgIHJldHVybiBjbG9uZSh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBmb2xsb3dpbmcgUHJlLWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6XHJcbiAgICAgICAgKiA8dGFibGU+XHJcbiAgICAgICAgKiA8dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5pb25pYW48L3RkPlxyXG4gICAgICAgICogPHRkPmRvcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5waHJ5Z2lhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bHlkaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5taXhvbHlkaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5hZW9saWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmxvY3JpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmVuaWdtYXRpY01ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5lbmlnbWF0aWNNaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I3YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3I3czRzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFybW9uaWNNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGFybW9uaWNNaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG91YmxlSGFybW9uaWM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWVsb2RpY01pbm9yQXNjZW5kaW5nPC90ZD5cclxuICAgICAgICAqIDx0ZD5tZWxvZGljTWlub3JEZXNjZW5kaW5nPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWM8L3RkPlxyXG4gICAgICAgICogPHRkPm1ham9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbm9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgICAgICogPHRkPmI1UGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I2UGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kaW04VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPm5lb3BvbGl0YW5NYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bmVvcG9saXRhbk1pbm9yPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbk1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5NaW5vcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuR3lwc3k8L3RkPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2g8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaDhUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoR3lwc3k8L3RkPlxyXG4gICAgICAgICogPHRkPmF1Z21lbnRlZDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9taW5hbnRTdXNwZW5kZWQ8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YmVib3BNYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YmVib3BEb21pbmFudDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bXlzdGljPC90ZD5cclxuICAgICAgICAqIDx0ZD5vdmVydG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5sZWFkaW5nVG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aGlyb2pvc2hpPC90ZD5cclxuICAgICAgICAqIDx0ZD5qYXBhbmVzZUE8L3RkPlxyXG4gICAgICAgICogPHRkPmphcGFuZXNlQjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5vcmllbnRhbDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXJhYmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGVyc2lhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YmFsaW5lc2U8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+a3Vtb2k8L3RkPlxyXG4gICAgICAgICogPHRkPnBlbG9nPC90ZD5cclxuICAgICAgICAqIDx0ZD5hbGdlcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+Y2hpbmVzZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tb25nb2xpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmVneXB0aWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cm9tYW5pYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+aGluZHU8L3RkPlxyXG4gICAgICAgICogPHRkPmluc2VuPC90ZD5cclxuICAgICAgICAqIDx0ZD5pd2F0bzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c2NvdHRpc2g8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+eW88L3RkPlxyXG4gICAgICAgICogPHRkPmlzdHJpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnVrcmFuaWFuRG9yaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZXRydXNoa2E8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YWhhdmFyYWJhPC90ZD5cclxuICAgICAgICAqIDx0ZD5oYWxmRGltaW5pc2hlZDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amV3aXNoPC90ZD5cclxuICAgICAgICAqIDx0ZD5ieXphbnRpbmU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+YWNvdXN0aWM8L3RkPlxyXG4gICAgICAgICogPC90YWJsZT5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogc2NhbGUudGVtcGxhdGUgPSBbMCwgMiwgMiwgMSwgMiwgMiwgMl07XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS50ZW1wbGF0ZSk7IC8vIFswLCAyLCAyLCAxLCAyLCAyLCAyXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gY2xvbmUodmFsdWUpO1xyXG4gICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG5vdGVzXHJcbiAgICAgICAgKiBub3RlcyBhcmUgZ2VuZXJhdGVkIGFuZCBjYWNoZWQgYXMgbmVlZGVkXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9ub3RlcyA9IFtdO1xyXG4gICAgICAgX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB3aWxsIGdlbmVyYXRlIHRoZSBub3RlcyBpZiBuZWVkZWQgb3IgcmV0dXJuIHRoZSBjYWNoZWQgbm90ZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubm90ZXMpOyAvLyBMaXN0IG9mIG5vdGVzXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG5vdGVzKCkge1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9ub3Rlc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOb3RlcygpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9ub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZ2VuZXJhdGUgbm90ZXMoaW50ZXJuYWwpXHJcbiAgICAgICAgKiBnZW5lcmF0ZXMgdGhlIG5vdGVzIGZvciB0aGlzIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdlbmVyYXRlTm90ZXMoKSB7XHJcbiAgICAgICAgICAgLy8gdXNlIHRoZSB0ZW1wbGF0ZSB1bnNoaWZ0ZWQgZm9yIHNpbXBsaWNpdHlcclxuICAgICAgICAgICBjb25zdCB1bnNoaWZ0ZWRUZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCAtdGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICAvLyBpZiBhbGxvd2luZyB0aGlzIHRvIGNoYW5nZSB0aGUgb2N0YXZlIGlzIHVuZGVzaXJhYmxlXHJcbiAgICAgICAgICAgLy8gdGhlbiBtYXkgbmVlZCB0byBwcmUgd3JhcCB0aGUgdG9uZSBhbmQgdXNlXHJcbiAgICAgICAgICAgLy8gdGhlIGZpbmFsIHZhbHVlXHJcbiAgICAgICAgICAgY29uc3Qgbm90ZXMgPSBbXTtcclxuICAgICAgICAgICBsZXQgYWNjdW11bGF0b3IgPSB0aGlzLmtleTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHVuc2hpZnRlZFRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRvbmUgPSBpbnRlcnZhbCA9PT0gMFxyXG4gICAgICAgICAgICAgICAgICAgPyAoYWNjdW11bGF0b3IgPSB0aGlzLmtleSlcclxuICAgICAgICAgICAgICAgICAgIDogKGFjY3VtdWxhdG9yICs9IGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiB0b25lLFxyXG4gICAgICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnB1c2gobm90ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIHNoaWZ0IG5vdGVzIGJhY2sgdG8gb3JpZ2luYWwgcG9zaXRpb25cclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsID4gMCkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gbm90ZXMuc3BsaWNlKG5vdGVzLmxlbmd0aCAtICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKyAxKSwgSW5maW5pdHkpO1xyXG4gICAgICAgICAgICAgICBub3Rlcy51bnNoaWZ0KC4uLnRlbXApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsIDwgMCkge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gbm90ZXMuc3BsaWNlKDAsIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnB1c2goLi4udGVtcCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzID0gbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBub3RlcyBpbiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBwYXJhbSBwcmVmZXJTaGFycEtleXMgLSBpZiB0cnVlIHRoZW4gc2hhcnBzIHdpbGwgYmUgcHJlZmVycmVkIG92ZXIgZmxhdHMgd2hlbiBzZW1pdG9uZXMgY291bGQgYmUgZWl0aGVyIC0gZXg6IEJiL0EjXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG5vdGVzIGluIHRoZSBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5uYW1lcyk7IC8vIFsnQzQnLCAnRDQnLCAnRTQnLCAnRjQnLCAnRzQnLCAnQTQnLCAnQjQnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE5vdGVOYW1lcyhwcmVmZXJTaGFycEtleSA9IHRydWUpIHtcclxuICAgICAgICAgICBjb25zdCBuYW1lcyA9IHNjYWxlTm90ZU5hbWVMb29rdXAodGhpcywgcHJlZmVyU2hhcnBLZXkpO1xyXG4gICAgICAgICAgIHJldHVybiBuYW1lcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogZGVncmVlXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbm90ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGRlZ3JlZVxyXG4gICAgICAgICogQHBhcmFtIGRlZ3JlZSAtIHRoZSBkZWdyZWUgdG8gcmV0dXJuXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5vdGUgdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBkZWdyZWVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZGVncmVlKDApKTsgLy8gQzQoTm90ZSlcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmRlZ3JlZSgxKSk7IC8vIEQ0KE5vdGUpIGV0Y1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRlZ3JlZShkZWdyZWUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcChkZWdyZWUgLSAxIC8qemVybyBpbmRleCAqLywgMCwgdGhpcy5ub3Rlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICBjb25zdCBub3RlID0gdGhpcy5ub3Rlc1t3cmFwcGVkLnZhbHVlXS5jb3B5KCk7XHJcbiAgICAgICAgICAgbm90ZS5vY3RhdmUgPSB0aGlzLm9jdGF2ZSArIHdyYXBwZWQubnVtV3JhcHM7XHJcbiAgICAgICAgICAgcmV0dXJuIG5vdGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJlbGF0aXZlIG1ham9yXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1ham9yIG9mIHRoaXMgc2NhbGUgLSB0YWtlcyB0aGUgM3JkIGRlZ3JlZSBhcyBpdCdzIGtleVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWFqb3Igb2YgdGhpcyBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5yZWxhdGl2ZU1ham9yKCkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHJlbGF0aXZlTWFqb3IoKSB7XHJcbiAgICAgICAgICAgY29uc3QgbWFqb3IgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3IsXHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5kZWdyZWUoMykuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG1ham9yO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZWxhdGl2ZSBtaW5vclxyXG4gICAgICAgICogcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtaW5vciBvZiB0aGlzIHNjYWxlIC0gdGFrZXMgdGhlIDZ0aCBkZWdyZWUgYXMgaXQncyBrZXlcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1pbm9yIG9mIHRoaXMgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucmVsYXRpdmVNaW5vcigpKTsgLy8gU2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICByZWxhdGl2ZU1pbm9yKCkge1xyXG4gICAgICAgICAgIGNvbnN0IG1pbm9yID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1pbm9yLFxyXG4gICAgICAgICAgICAgICBrZXk6IHRoaXMuZGVncmVlKDYpLnNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIHJldHVybiBtaW5vcjtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRcclxuICAgICAgICAqL1xyXG4gICAgICAgX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICBfb3JpZ2luYWxUZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdFxyXG4gICAgICAgICogc2hpZnRzIHRoZSBzY2FsZSBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGRlZ3JlZXNcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEBwYXJhbSBzaGlmdCAtIHRoZSBudW1iZXIgb2YgZGVncmVlcyB0byBzaGlmdCB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHNoaWZ0ZWQgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuc2hpZnQoMSkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0KGRlZ3JlZXMgPSAxKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFRlbXBsYXRlID0gY2xvbmUodGhpcy5fdGVtcGxhdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCBkZWdyZWVzKTtcclxuICAgICAgICAgICB0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKz0gZGVncmVlcztcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2hpZnRlZFxyXG4gICAgICAgICogcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHBhcmFtIGRlZ3JlZXMgLSB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgdG8gc2hpZnQgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdGVkKDEpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdGVkKGRlZ3JlZXMgPSAxKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS5zaGlmdChkZWdyZWVzKTtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuc2hpZnRcclxuICAgICAgICAqIHNoaWZ0cyB0aGUgb3JpZ2luYWwgcm9vdCBiYWNrIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGlzIHNjYWxlIGFmdGVyIHVuc2hpZnRpbmcgaXQgYmFjayB0byB0aGUgb3JpZ2luYWwgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS51bnNoaWZ0KCkpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHVuc2hpZnQoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHRoaXMuX29yaWdpbmFsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy8gdGhpcy5zaGlmdCh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgKiAtMSk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsVGVtcGxhdGUgPSBbXTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bnNoaWZ0ZWRcclxuICAgICAgICAqIHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgd2l0aCB0aGUgdG9uaWMgc2hpZnRlZCBiYWNrXHJcbiAgICAgICAgKiB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgd2l0aCB0aGUgdG9uaWMgc2hpZnRlZCBiYWNrXHJcbiAgICAgICAgKiB0byB0aGUgcm9vdCBwb3NpdGlvblxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS51bnNoaWZ0ZWQoKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdW5zaGlmdGVkKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX29yaWdpbmFsVGVtcGxhdGUubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IHRoaXMuX29yaWdpbmFsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgc2NhbGUudW5zaGlmdCgpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgYW1vdW50IHRoYXQgdGhlIHNjYWxlIGhhcyBzaGlmdGVkXHJcbiAgICAgICAgKiAoMCBpZiBub3Qgc2hpZnRlZClcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBhbW91bnQgdGhhdCB0aGUgc2NhbGUgaGFzIHNoaWZ0ZWRcclxuICAgICAgICAqICgwIGlmIG5vdCBzaGlmdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdGVkKCkpOyAvLyAxXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnRlZEludGVydmFsKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9zaGlmdGVkSW50ZXJ2YWw7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNjYWxlIG1vZGVzXHJcbiAgICAgICAgKi9cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIElvbmlhbihtYWpvcikgbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5pb25pYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaW9uaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5pb25pYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgRG9yaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZG9yaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRvcmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMuZG9yaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIFBocnlnaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUucGhyeWdpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcGhyeWdpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLnBocnlnaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIEx5ZGlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmx5ZGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBseWRpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmx5ZGlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBNaXhvbHlkaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubWl4b2x5ZGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaXhvbHlkaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5taXhvbHlkaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIEFlb2xpYW4obWlub3IpIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuYWVvbGlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhZW9saWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5hZW9saWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIExvY3JpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5sb2NyaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGxvY3JpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmxvY3JpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgc3RyaW5nIHZlcnNpb24gb2YgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRvU3RyaW5nKCkpOyAvLyAnQydcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICBsZXQgc2NhbGVOYW1lcyA9IHNjYWxlTmFtZUxvb2t1cCh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgaWYgKCFzY2FsZU5hbWVzKVxyXG4gICAgICAgICAgICAgICBzY2FsZU5hbWVzID0gdGhpcy5nZXROb3RlTmFtZXMoKS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgcmV0dXJuIGAke1NlbWl0b25lJDFbdGhpcy5fa2V5XX0ke3RoaXMuX29jdGF2ZX0oJHtzY2FsZU5hbWVzfSlgO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBsb29rdXAgdGhlIG5vdGUgbmFtZSBmb3IgYSBzY2FsZSBlZmZpY2llbnRseVxyXG4gICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc2NhbGUgdG8gbG9va3VwXHJcbiAgICAqIEBwYXJhbSBwcmVmZXJTaGFycEtleSAtIGlmIHRydWUsIHdpbGwgcHJlZmVyIHNoYXJwIGtleXMgb3ZlciBmbGF0IGtleXNcclxuICAgICogQHJldHVybnMgdGhlIG5vdGUgbmFtZXMgZm9yIHRoZSBzY2FsZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNjYWxlTm90ZU5hbWVMb29rdXAgPSAoc2NhbGUsIHByZWZlclNoYXJwS2V5ID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtzY2FsZS5rZXl9LSR7c2NhbGUub2N0YXZlfS0ke0pTT04uc3RyaW5naWZ5KHNjYWxlLnRlbXBsYXRlKX1gO1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGVzID0gbm90ZXNMb29rdXAoa2V5KTtcclxuICAgICAgICAgICBpZiAobm90ZXMpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIG5vdGVzO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVzID0gWy4uLnNjYWxlLm5vdGVzXTtcclxuICAgICAgIG5vdGVzID0gc2hpZnQobm90ZXMsIC1zY2FsZS5zaGlmdGVkSW50ZXJ2YWwoKSk7IC8vdW5zaGlmdCBiYWNrIHRvIGtleSA9IDAgaW5kZXhcclxuICAgICAgIGNvbnN0IG5vdGVzUGFydHMgPSBub3Rlcy5tYXAoKG5vdGUpID0+IG5vdGUudG9TdHJpbmcoKS5zcGxpdChcIi9cIikpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlcyA9IG5vdGVzLm1hcCgobm90ZSkgPT4gbm90ZS5vY3RhdmUpO1xyXG4gICAgICAgY29uc3QgcmVtb3ZhYmxlcyA9IFtcIkIjXCIsIFwiQnNcIiwgXCJDYlwiLCBcIkUjXCIsIFwiRXNcIiwgXCJGYlwiXTtcclxuICAgICAgIGNvbnN0IG5vdGVOYW1lcyA9IFtdO1xyXG4gICAgICAgZm9yIChjb25zdCBbaSwgbm90ZVBhcnRzXSBvZiBub3Rlc1BhcnRzLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgIC8vcmVtb3ZlIENiIEIjIGV0Y1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBub3RlUGFydHMpIHtcclxuICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBudW1iZXJzIGZyb20gdGhlIG5vdGUgbmFtZShvY3RhdmUpXHJcbiAgICAgICAgICAgICAgIC8vIHBhcnQucmVwbGFjZSgvXFxkL2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICBpZiAocmVtb3ZhYmxlcy5pbmNsdWRlcyhwYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBub3RlTmFtZXMuaW5kZXhPZihwYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgIG5vdGVOYW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChub3RlTmFtZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKHByZWZlclNoYXJwS2V5ID8gbm90ZVBhcnRzWzBdIDogbm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAobm90ZVBhcnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbMF0pO1xyXG4gICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3Qgd2hvbGVOb3RlcyA9IFtcclxuICAgICAgICAgICAgICAgXCJBXCIsXHJcbiAgICAgICAgICAgICAgIFwiQlwiLFxyXG4gICAgICAgICAgICAgICBcIkNcIixcclxuICAgICAgICAgICAgICAgXCJEXCIsXHJcbiAgICAgICAgICAgICAgIFwiRVwiLFxyXG4gICAgICAgICAgICAgICBcIkZcIixcclxuICAgICAgICAgICAgICAgXCJHXCIsXHJcbiAgICAgICAgICAgICAgIFwiQVwiLFxyXG4gICAgICAgICAgICAgICBcIkJcIixcclxuICAgICAgICAgICAgICAgXCJDXCIsXHJcbiAgICAgICAgICAgICAgIFwiRFwiLFxyXG4gICAgICAgICAgICAgICBcIkVcIixcclxuICAgICAgICAgICAgICAgXCJGXCIsXHJcbiAgICAgICAgICAgICAgIFwiR1wiLFxyXG4gICAgICAgICAgIF07XHJcbiAgICAgICAgICAgY29uc3QgbGFzdFdob2xlTm90ZSA9IG5vdGVOYW1lc1tub3RlTmFtZXMubGVuZ3RoIC0gMV1bMF07XHJcbiAgICAgICAgICAgY29uc3QgbGFzdEluZGV4ID0gd2hvbGVOb3Rlcy5pbmRleE9mKGxhc3RXaG9sZU5vdGUpO1xyXG4gICAgICAgICAgIGNvbnN0IG5leHROb3RlID0gd2hvbGVOb3Rlc1tsYXN0SW5kZXggKyAxXTtcclxuICAgICAgICAgICBpZiAobm90ZVBhcnRzWzBdLmluY2x1ZGVzKG5leHROb3RlKSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCBoYXNPY3RhdmUgPSBub3RlUGFydHNbMF0ubWF0Y2goL1xcZC9nKTtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzWzBdICsgKGhhc09jdGF2ZSA/IFwiXCIgOiBvY3RhdmVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCBoYXNPY3RhdmUgPSBub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdLm1hdGNoKC9cXGQvZyk7XHJcbiAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZVBhcnRzW25vdGVQYXJ0cy5sZW5ndGggLSAxXSArIChoYXNPY3RhdmUgPyBcIlwiIDogb2N0YXZlc1tpXSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3Qgc2hpZnRlZE5vdGVOYW1lcyA9IHNoaWZ0KG5vdGVOYW1lcywgc2NhbGUuc2hpZnRlZEludGVydmFsKCkpO1xyXG4gICAgICAgcmV0dXJuIHNoaWZ0ZWROb3RlTmFtZXM7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgbG9va3VwIHRhYmxlIGZvciBhbGwgbm90ZXMgZm9ybWF0dGVkIGFzIFtBLUddWyN8YnxzXVswLTldXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVOb3Rlc0xvb2t1cFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3Qgc2NhbGVUYWJsZSA9IHt9O1xyXG4gICAgICAgZm9yIChsZXQgaXRvbmUgPSBUT05FU19NSU47IGl0b25lIDwgVE9ORVNfTUlOICsgT0NUQVZFX01BWDsgaXRvbmUrKykge1xyXG4gICAgICAgICAgIGZvciAobGV0IGlvY3RhdmUgPSBPQ1RBVkVfTUlOOyBpb2N0YXZlIDw9IE9DVEFWRV9NQVg7IGlvY3RhdmUrKykge1xyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIE9iamVjdC52YWx1ZXMoU2NhbGVUZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAga2V5OiBpdG9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBpb2N0YXZlLFxyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICBzY2FsZVRhYmxlW2Ake2l0b25lfS0ke2lvY3RhdmV9LSR7SlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpfWBdID1cclxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZU5vdGVOYW1lTG9va3VwKHNjYWxlKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBzY2FsZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyB0aGUgbG9va3VwIHRhYmxlIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBpcyBsb2FkZWRcclxuICAgICovXHJcbiAgIGxldCBfbm90ZXNMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZXNMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZFNjYWxlTm90ZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX25vdGVzTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIGNvbnN0IGJ1aWxkU2NhbGVOb3RlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX25vdGVzTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX25vdGVzTG9va3VwO1xyXG4gICAgICAgX25vdGVzTG9va3VwID0gY3JlYXRlTm90ZXNMb29rdXBUYWJsZSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfbm90ZXNMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBzY2FsZSBub3RlIHRhYmxlXCIpO1xyXG4gICAgICAgcmV0dXJuIF9ub3Rlc0xvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFNob3J0Y3V0IGZvciBtb2RpZmllcnNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBmbGF0ID0gLTE7XHJcbiAgIGNvbnN0IGZsYXRfZmxhdCA9IC0yO1xyXG4gICBjb25zdCBzaGFycCA9IDE7XHJcbiAgIC8qKlxyXG4gICAgKiBDaG9yZCB0ZW1wbGF0ZXNcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBDaG9yZFRlbXBsYXRlcyA9IHtcclxuICAgICAgIG1hajogWzEsIDMsIDVdLFxyXG4gICAgICAgbWFqNDogWzEsIDMsIDQsIDVdLFxyXG4gICAgICAgbWFqNjogWzEsIDMsIDUsIDZdLFxyXG4gICAgICAgbWFqNjk6IFsxLCAzLCA1LCA2LCA5XSxcclxuICAgICAgIG1hajc6IFsxLCAzLCA1LCA3XSxcclxuICAgICAgIG1hajk6IFsxLCAzLCA1LCA3LCA5XSxcclxuICAgICAgIG1hajExOiBbMSwgMywgNSwgNywgOSwgMTFdLFxyXG4gICAgICAgbWFqMTM6IFsxLCAzLCA1LCA3LCA5LCAxMSwgMTNdLFxyXG4gICAgICAgbWFqN3MxMTogWzEsIDMsIDUsIDcsIFsxMSwgc2hhcnBdXSxcclxuICAgICAgIG1hamI1OiBbMSwgMywgWzUsIGZsYXRdXSxcclxuICAgICAgIG1pbjogWzEsIFszLCBmbGF0XSwgNV0sXHJcbiAgICAgICBtaW40OiBbMSwgWzMsIGZsYXRdLCA0LCA1XSxcclxuICAgICAgIG1pbjY6IFsxLCBbMywgZmxhdF0sIDUsIDZdLFxyXG4gICAgICAgbWluNzogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdXSxcclxuICAgICAgIG1pbkFkZDk6IFsxLCBbMywgZmxhdF0sIDUsIDldLFxyXG4gICAgICAgbWluNjk6IFsxLCBbMywgZmxhdF0sIDUsIDYsIDldLFxyXG4gICAgICAgbWluOTogWzEsIFszLCBmbGF0XSwgNSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIG1pbjExOiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDksIDExXSxcclxuICAgICAgIG1pbjEzOiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDksIDExLCAxM10sXHJcbiAgICAgICBtaW43YjU6IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XSwgWzcsIGZsYXRdXSxcclxuICAgICAgIGRvbTc6IFsxLCAzLCA1LCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tOTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb20xMTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOSwgMTFdLFxyXG4gICAgICAgZG9tMTM6IFsxLCAzLCA1LCBbNywgZmxhdF0sIDksIDExLCAxM10sXHJcbiAgICAgICBkb203czU6IFsxLCAzLCBbNSwgc2hhcnBdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tN2I1OiBbMSwgMywgWzUsIGZsYXRdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tN2I5OiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbOSwgZmxhdF1dLFxyXG4gICAgICAgZG9tN3M5OiBbMSwgMywgNSwgWzcsIGZsYXRdLCBbOSwgc2hhcnBdXSxcclxuICAgICAgIGRvbTlzNTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb205YjU6IFsxLCAzLCBbNSwgZmxhdF0sIFs3LCBmbGF0XSwgOV0sXHJcbiAgICAgICBkb203czVzOTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgWzksIHNoYXJwXV0sXHJcbiAgICAgICBkb203czViOTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XSwgWzksIGZsYXRdXSxcclxuICAgICAgIGRvbTdzMTE6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFsxMSwgc2hhcnBdXSxcclxuICAgICAgIGRpbTogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdXSxcclxuICAgICAgIGRpbTc6IFsxLCBbMywgZmxhdF0sIFs1LCBmbGF0XSwgWzcsIGZsYXRfZmxhdF1dLFxyXG4gICAgICAgYXVnOiBbMSwgMywgWzUsIHNoYXJwXV0sXHJcbiAgICAgICBzdXMyOiBbMSwgMiwgNV0sXHJcbiAgICAgICBzdXM0OiBbMSwgWzQsIGZsYXRdLCA1XSxcclxuICAgICAgIGZpZnRoOiBbMSwgNV0sXHJcbiAgICAgICBiNTogWzEsIFs1LCBmbGF0XV0sXHJcbiAgICAgICBzMTE6IFsxLCA1LCBbMTEsIHNoYXJwXV0sXHJcbiAgIH07XHJcbiAgIE9iamVjdC5rZXlzKENob3JkVGVtcGxhdGVzKS5mb3JFYWNoKChlbGVtZW50KSA9PiBPYmplY3QuZnJlZXplKENob3JkVGVtcGxhdGVzW2VsZW1lbnRdKSk7XG5cbiAgIGNvbnN0IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUgPSBbMSwgMywgNV07XHJcbiAgIGNvbnN0IERFRkFVTFRfU0NBTEUgPSBuZXcgU2NhbGUoKTtcblxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVMb29rdXAuanNvblwiO1xyXG4gICAvKipcclxuICAgICogUmVnZXggZm9yIG1hdGNoaW5nIG5vdGUgbmFtZSwgbW9kaWZpZXIsIGFuZCBvY3RhdmVcclxuICAgICovXHJcbiAgIGNvbnN0IG5hbWVSZWdleCA9IC8oW0EtR10pKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG1vZGlmaWVyUmVnZXggPSAvKCN8c3xiKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCA9IC8oWzAtOV0rKSg/PVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBjaG9yZE5hbWVSZWdleCA9IC8obWlufG1hanxkaW18YXVnKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBhZGRpdGlvbnNSZWdleCA9IC8oWyN8c3xiXT9bMC05XSspKD8hW14oXSpcXCkpL2c7XHJcbiAgIC8qKlxyXG4gICAgKiBAcGFyYW0gY2hvcmQgdGhlIHN0cmluZyB0byBwYXJzZVxyXG4gICAgKiBAcmV0dXJucyBhIHZhbGlkIENob3JkSW5pdGlhbGl6ZXJcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBjb25zdCBwYXJzZUNob3JkID0gKGNob3JkKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNob3JkTG9va3VwKGNob3JkKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgbGV0IGNob3JkTmFtZSA9IFwibWFqXCI7XHJcbiAgICAgICBsZXQgYWRkaXRpb25zID0gW107XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBjaG9yZC5tYXRjaChuYW1lUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3QgbW9kaWZpZXJNYXRjaCA9IGNob3JkLm1hdGNoKG1vZGlmaWVyUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBjaG9yZC5tYXRjaChvY3RhdmVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBjaG9yZE5hbWVNYXRjaCA9IGNob3JkLm1hdGNoKGNob3JkTmFtZVJlZ2V4KT8uam9pbihcIlwiKTtcclxuICAgICAgIGNvbnN0IGFkZGl0aW9uc01hdGNoID0gY2hvcmQubWF0Y2goYWRkaXRpb25zUmVnZXgpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGNob3JkTmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgLy8gY29uc3QgW25hbWVdID0gY2hvcmROYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgY2hvcmROYW1lID0gY2hvcmROYW1lTWF0Y2g7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoYWRkaXRpb25zTWF0Y2gpIHtcclxuICAgICAgICAgICBhZGRpdGlvbnMgPSBhZGRpdGlvbnNNYXRjaDtcclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IGludGVydmFscyA9IFtdO1xyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIGludGVydmFscy5wdXNoKC4uLkNob3JkVGVtcGxhdGVzW2Nob3JkTmFtZV0pO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgYWRkaXRpb24gb2YgYWRkaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2QgPSAwO1xyXG4gICAgICAgICAgICAgICBpZiAoYWRkaXRpb25bMF0gPT09IFwiI1wiIHx8IGFkZGl0aW9uWzBdID09PSBcInNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gMTtcclxuICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2UgaWYgKGFkZGl0aW9uWzBdID09PSBcImJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBhZGRpdGlvbk51bSA9IHBhcnNlSW50KGFkZGl0aW9uLCAxMCk7XHJcbiAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbHMuaW5jbHVkZXMoYWRkaXRpb25OdW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGludGVydmFscy5pbmRleE9mKGFkZGl0aW9uTnVtKTtcclxuICAgICAgICAgICAgICAgICAgIGludGVydmFsc1tpbmRleF0gPSBbYWRkaXRpb25OdW0sIG1vZF07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbnRlcnZhbHMucHVzaChbYWRkaXRpb25OdW0sIG1vZF0pO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIHJvb3Q6IHNlbWl0b25lLFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IGludGVydmFscyxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjaG9yZCBuYW1lXCIpO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogQHJldHVybnMgYSBsb29rdXAgdGFibGUgb2YgY2hvcmQgbmFtZXMgYW5kIHRoZWlyIGluaXRpYWxpemVyc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBjb25zdCBxdWFsaXRpZXMgPSBbXCJtYWpcIiwgXCJtaW5cIiwgXCJkaW1cIiwgXCJhdWdcIiwgXCJzdXNcIl07XHJcbiAgICAgICBjb25zdCBhZGRpdGlvbnMgPSBbXHJcbiAgICAgICAgICAgXCJcIixcclxuICAgICAgICAgICBcIjJcIixcclxuICAgICAgICAgICBcIjNcIixcclxuICAgICAgICAgICBcIjRcIixcclxuICAgICAgICAgICBcIjVcIixcclxuICAgICAgICAgICBcIjZcIixcclxuICAgICAgICAgICBcIjdcIixcclxuICAgICAgICAgICBcIjlcIixcclxuICAgICAgICAgICBcIjExXCIsXHJcbiAgICAgICAgICAgXCIxM1wiLFxyXG4gICAgICAgICAgIFwiYjJcIixcclxuICAgICAgICAgICBcImIzXCIsXHJcbiAgICAgICAgICAgXCJiNFwiLFxyXG4gICAgICAgICAgIFwiYjVcIixcclxuICAgICAgICAgICBcImI2XCIsXHJcbiAgICAgICAgICAgXCJiN1wiLFxyXG4gICAgICAgICAgIFwiYjlcIixcclxuICAgICAgICAgICBcImIxMVwiLFxyXG4gICAgICAgICAgIFwiYjEzXCIsXHJcbiAgICAgICAgICAgXCJzMlwiLFxyXG4gICAgICAgICAgIFwiczNcIixcclxuICAgICAgICAgICBcInM0XCIsXHJcbiAgICAgICAgICAgXCJzNVwiLFxyXG4gICAgICAgICAgIFwiczZcIixcclxuICAgICAgICAgICBcInM3XCIsXHJcbiAgICAgICAgICAgXCJzOVwiLFxyXG4gICAgICAgICAgIFwiczExXCIsXHJcbiAgICAgICAgICAgXCJzMTNcIixcclxuICAgICAgICAgICBcIiMyXCIsXHJcbiAgICAgICAgICAgXCIjM1wiLFxyXG4gICAgICAgICAgIFwiIzRcIixcclxuICAgICAgICAgICBcIiM1XCIsXHJcbiAgICAgICAgICAgXCIjNlwiLFxyXG4gICAgICAgICAgIFwiIzdcIixcclxuICAgICAgICAgICBcIiM5XCIsXHJcbiAgICAgICAgICAgXCIjMTFcIixcclxuICAgICAgICAgICBcIiMxM1wiLFxyXG4gICAgICAgICAgIFwiN3MxMVwiLFxyXG4gICAgICAgICAgIFwiNyMxMVwiLFxyXG4gICAgICAgICAgIFwiN2I5XCIsXHJcbiAgICAgICAgICAgXCI3IzlcIixcclxuICAgICAgICAgICBcIjdiNVwiLFxyXG4gICAgICAgICAgIFwiNyM1XCIsXHJcbiAgICAgICAgICAgXCI3YjliNVwiLFxyXG4gICAgICAgICAgIFwiNyM5IzVcIixcclxuICAgICAgICAgICBcIjdiMTNcIixcclxuICAgICAgICAgICBcIjcjMTNcIixcclxuICAgICAgICAgICBcIjkjNVwiLFxyXG4gICAgICAgICAgIFwiOWI1XCIsXHJcbiAgICAgICAgICAgXCI5IzExXCIsXHJcbiAgICAgICAgICAgXCI5YjExXCIsXHJcbiAgICAgICAgICAgXCI5IzEzXCIsXHJcbiAgICAgICAgICAgXCI5YjEzXCIsXHJcbiAgICAgICAgICAgXCIxMSM1XCIsXHJcbiAgICAgICAgICAgXCIxMWI1XCIsXHJcbiAgICAgICAgICAgXCIxMSM5XCIsXHJcbiAgICAgICAgICAgXCIxMWI5XCIsXHJcbiAgICAgICAgICAgXCIxMSMxM1wiLFxyXG4gICAgICAgICAgIFwiMTFiMTNcIixcclxuICAgICAgIF07XHJcbiAgICAgICBmb3IgKGNvbnN0IHF1YWxpdHkgb2YgcXVhbGl0aWVzKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBhZGRpdGlvbiBvZiBhZGRpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlTGV0dGVyIG9mIG5vdGVMZXR0ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVNb2RpZmllciBvZiBub3RlTW9kaWZpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9JHtub3RlTW9kaWZpZXJ9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gT0NUQVZFX01JTjsgaSA8PSBPQ1RBVkVfTUFYOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCgke25vdGVMZXR0ZXJ9JHtub3RlTW9kaWZpZXJ9JHtpfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgbGV0IF9jaG9yZExvb2t1cCA9IHt9O1xyXG4gICAvKipcclxuICAgICogQHBhcmFtIGtleSB0aGUgc3RyaW5nIHRvIGxvb2t1cFxyXG4gICAgKiBAcmV0dXJucyBhIHZhbGlkIGNob3JkIGluaXRpYWxpemVyXHJcbiAgICAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGtleSBpcyBub3QgYSB2YWxpZCBjaG9yZFxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNob3JkTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRDaG9yZFRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX2Nob3JkTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9KTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IHRhYmxlIGFzIHsgW2tleTogc3RyaW5nXTogQ2hvcmRJbml0aWFsaXplciB9O1xyXG4gICAvLyB9IGVsc2Uge1xyXG4gICAvLyAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkQ2hvcmRUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfY2hvcmRMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfY2hvcmRMb29rdXA7XHJcbiAgICAgICBfY2hvcmRMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAgICAgT2JqZWN0LmZyZWV6ZShfY2hvcmRMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJidWlsdCBjaG9yZCB0YWJsZVwiKTtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5lbnRyaWVzKF9jaG9yZExvb2t1cCkubGVuZ3RoKTtcclxuICAgICAgIHJldHVybiBfY2hvcmRMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBDaG9yZHMgY29uc2lzdCBvZiBhIHJvb3Qgbm90ZSwgb2N0YXZlLCBjaG9yZCB0ZW1wbGF0ZSwgYW5kIGEgYmFzZSBzY2FsZS48YnI+PGJyPlxyXG4gICAgKiBUaGUgY2hvcmQgdGVtcGxhdGUgaXMgYW4gYXJyYXkgb2YgaW50ZWdlcnMsIGVhY2ggaW50ZWdlciByZXByZXNlbnRpbmc8YnI+XHJcbiAgICAqICBhIHNjYWxlIGRlZ3JlZSBmcm9tIHRoZSBiYXNlIHNjYWxlKGRlZmF1bHRzIHRvIG1ham9yKS48YnI+XHJcbiAgICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGlzIHRoZSBJLElJSSxWIGRlbm90ZWQgYXMgWzEsMyw1XTxicj5cclxuICAgICogQ2hvcmRJbnRlcnZhbHMgdXNlZCBpbiB0ZW1wbGF0ZXMgY2FuIGFsc28gY29udGFpbiBhIG1vZGlmaWVyLDxicj5cclxuICAgICogZm9yIGEgcGFydGljdWxhciBzY2FsZSBkZWdyZWUsIHN1Y2ggYXMgWzEsMyxbNSwgLTFdXTxicj5cclxuICAgICogd2hlcmUgLTEgaXMgZmxhdCwgMCBpcyBuYXR1cmFsLCBhbmQgMSBpcyBzaGFycC48YnI+XHJcbiAgICAqIEl0IGNvdWxkIGFsc28gYmUgd3JpdHRlbiBhcyBbMSwzLFs1LCBtb2RpZmllci5mbGF0XV08YnI+XHJcbiAgICAqIGlmIHlvdSBpbXBvcnQgbW9kaWZpZXIuXHJcbiAgICAqXHJcbiAgICAqIFRoZSBmb2xsb3dpbmcgcHJlZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTo8YnI+XHJcbiAgICAqIDx0YWJsZT5cclxuICAgICogPHRyPlxyXG4gICAgKiA8dGQ+bWFqPC90ZD5cclxuICAgICogPHRkPm1hajQ8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNjwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo2OTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqNzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo5PC90ZD5cclxuICAgICogPHRkPm1hajExPC90ZD5cclxuICAgICogPHRkPm1hajEzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWo3czExPC90ZD5cclxuICAgICogPHRkPm1hamI1PC90ZD5cclxuICAgICogPHRkPm1pbjwvdGQ+XHJcbiAgICAqIDx0ZD5taW40PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW42PC90ZD5cclxuICAgICogPHRkPm1pbjc8L3RkPlxyXG4gICAgKiA8dGQ+bWluQWRkOTwvdGQ+XHJcbiAgICAqIDx0ZD5taW42OTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWluOTwvdGQ+XHJcbiAgICAqIDx0ZD5taW4xMTwvdGQ+XHJcbiAgICAqIDx0ZD5taW4xMzwvdGQ+XHJcbiAgICAqIDx0ZD5taW43YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTc8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOTwvdGQ+XHJcbiAgICAqIDx0ZD5kb20xMTwvdGQ+XHJcbiAgICAqIDx0ZD5kb20xMzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tN3M1PC90ZD5cclxuICAgICogPHRkPmRvbTdiNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czk8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN2I5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb205YjU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tOXM1PC90ZD5cclxuICAgICogPHRkPmRvbTdzMTE8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3M1czk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTdzNWI5PC90ZD5cclxuICAgICogPHRkPmRpbTwvdGQ+XHJcbiAgICAqIDx0ZD5kaW03PC90ZD5cclxuICAgICogPHRkPmF1ZzwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+c3VzMjwvdGQ+XHJcbiAgICAqIDx0ZD5zdXM0PC90ZD5cclxuICAgICogPHRkPmZpZnRoPC90ZD5cclxuICAgICogPHRkPmI1PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zMTE8L3RkPlxyXG4gICAgKiA8L3RyPlxyXG4gICAgKiA8L3RhYmxlPlxyXG4gICAgKlxyXG4gICAgKiBAZXhhbXBsZVxyXG4gICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAqIGltcG9ydCB7IENob3JkIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZFRlbXBsYXRlfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkSW50ZXJ2YWx9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7TW9kaWZpZXJ9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRJbml0aWFsaXplcn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjsvLyBUeXBlc2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgQ2hvcmQge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHsgQ2hvcmQsIENob3JkVGVtcGxhdGVzLCBNb2RpZmllciB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy9jcmVhdGVzIGEgY2hvcmQgd2l0aCB0aGUgZGVmYXVsdCgxLDMsNSkgdGVtcGxhdGUsIHJvb3Qgb2YgQywgaW4gdGhlIDR0aCBvY3RhdmVcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIGNob3JkIHdpdGggdGhlIHByZS1kZWZpbmVkIGRpbWluaXNoZWQgdGVtcGxhdGUsIHJvb3Qgb2YgRWIsIGluIHRoZSA1dGggb2N0YXZlXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCh7cm9vdDogMywgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogQ2hvcmRUZW1wbGF0ZXMuZGltfSk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiAocm9vdC1ub3RlLW5hbWVbcywjLGJdW29jdGF2ZV0pW2Nob3JkLXRlbXBsYXRlLW5hbWV8W2Nob3JkLXF1YWxpdHldW21vZGlmaWVyc11dXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgY2hvcmQgZnJvbSBhIHN0cmluZ1xyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoJyhENCltaW40Jyk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uREVGQVVMVF9DSE9SRF9URU1QTEFURV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VDaG9yZCh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi4ocGFyc2VkPy50ZW1wbGF0ZSA/PyBERUZBVUxUX0NIT1JEX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gcGFyc2VkPy5vY3RhdmUgPz8gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHBhcnNlZD8ucm9vdCA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4uKHZhbHVlcy50ZW1wbGF0ZSA/PyBERUZBVUxUX0NIT1JEX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gdmFsdWVzLnJvb3QgPz8gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiB0aGlzLl9yb290LCBvY3RhdmU6IHRoaXMuX29jdGF2ZSB9KTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlkKTsgLy8gaGFsODkzNGhsbFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJvb3RcclxuICAgICAgICAqL1xyXG4gICAgICAgX3Jvb3QgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnJvb3QpOyAvLyAwKHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCByb290KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIHRoZSByb290IHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIDExXShzZW1pdG9uZSkgd2lsbDxici8+XHJcbiAgICAgICAgKiB3cmFwIHRoZSBzZW1pdG9uZSB0byB0aGUgcmFuZ2UgWzAsIDExXSBhbmQgY2hhbmdlIHRoZSBvY3RhdmUgZGVwZW5kaW5nPGJyLz5cclxuICAgICAgICAqIG9uIGhvdyBtYW55IHRpbWVzIHRoZSBzZW1pdG9uZSBoYXMgYmVlbiB3cmFwcGVkLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5yb290ID0gNDsgLy8gc2V0cyB0aGUgcm9vdCB0byA0dGggc2VtaXRvbmUoRSlcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnJvb3QpOyAvLyA0KHNlbWl0b25lKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCByb290KHZhbHVlKSB7XHJcbiAgICAgICAgICAgLy8gdGhpcy5fcm9vdCA9IHZhbHVlO1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKHZhbHVlLCBUT05FU19NSU4sIFRPTkVTX01BWCk7XHJcbiAgICAgICAgICAgdGhpcy5fcm9vdCA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gdGhpcy5fb2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogYmFzZSBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfYmFzZVNjYWxlID0gREVGQVVMVF9TQ0FMRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5iYXNlU2NhbGUpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgc2NhbGUobWFqb3IpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IGJhc2VTY2FsZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFzZVNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBOb3QgYSBsb3Qgb2YgZ29vZCByZWFzb25zIHRvIGNoYW5nZSB0aGlzIGV4Y2VwdCBmb3IgZXhwZXJpbWVudGF0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmJhc2VTY2FsZSA9IG5ldyBTY2FsZSh7IGtleTogMywgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogWzEsIFszLCBNb2RpZmllci5mbGF0XSwgNV0gfSk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5iYXNlU2NhbGUpOyAvLyBwcmludHMgdGhlIG1pbm9yIHNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IGJhc2VTY2FsZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZS5vY3RhdmUgPSB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5vY3RhdmUpOyAvLyA0KG9jdGF2ZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgb2N0YXZlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQub2N0YXZlID0gNTsgLy8gc2V0cyB0aGUgb2N0YXZlIHRvIDV0aFxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQub2N0YXZlKTsgLy8gNShvY3RhdmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKHZhbHVlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUub2N0YXZlID0gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB0ZW1wbGF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdGVtcGxhdGUgPSBbXTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCB0ZW1wbGF0ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gWy4uLnRoaXMuX3RlbXBsYXRlXTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIGZvbGxvd2luZyBwcmVkZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOjxicj5cclxuICAgICAgICAqIDx0YWJsZT5cclxuICAgICAgICAqIDx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajQ8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajY8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajY5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1hajc8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajk8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajExPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWoxMzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWo3czExPC90ZD5cclxuICAgICAgICAqIDx0ZD5tYWpiNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW40PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbjY8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjc8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbkFkZDk8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjY5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1pbjk8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjExPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW4xMzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluN2I1PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTc8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTk8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTExPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb20xMzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb203czU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdiNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M5PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203Yjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOWI1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb205czU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzMTE8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdzNXM5PC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTdzNWI5PC90ZD5cclxuICAgICAgICAqIDx0ZD5kaW08L3RkPlxyXG4gICAgICAgICogPHRkPmRpbTc8L3RkPlxyXG4gICAgICAgICogPHRkPmF1ZzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zdXMyPC90ZD5cclxuICAgICAgICAqIDx0ZD5zdXM0PC90ZD5cclxuICAgICAgICAqIDx0ZD5maWZ0aDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+czExPC90ZD5cclxuICAgICAgICAqIDwvdHI+XHJcbiAgICAgICAgKiA8L3RhYmxlPlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC50ZW1wbGF0ZSA9IFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIDVdOyAvLyBzZXRzIHRoZSB0ZW1wbGF0ZSB0byBhIG1pbm9yIGNob3JkXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIHByaW50cyB0aGUgbmV3IHRlbXBsYXRlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBbLi4udmFsdWVdO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBub3Rlc1xyXG4gICAgICAgICogbm90ZXMgYXJlIGdlbmVyYXRlZCBhbmQgY2FjaGVkIGFzIG5lZWRlZFxyXG4gICAgICAgICovXHJcbiAgICAgICBfbm90ZXMgPSBbXTtcclxuICAgICAgIF9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogd2lsbCBnZW5lcmF0ZSBub3RlcyBpZiBuZWVkZWQgb3IgcmV0dXJuIHRoZSBjYWNoZWQgbm90ZXNcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQubm90ZXMpOyAvLyBwcmludHMgdGhlIGRlZmF1bHQgbm90ZXNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgbm90ZXMoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX25vdGVzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBnZW5lcmF0ZSBub3RlcyhpbnRlcm5hbClcclxuICAgICAgICAqIGdlbmVyYXRlcyB0aGUgbm90ZXMgZm9yIHRoaXMgc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2VuZXJhdGVOb3RlcygpIHtcclxuICAgICAgICAgICB0aGlzLl9ub3RlcyA9IFtdO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgbGV0IHRvbmUgPSAwO1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kID0gMDtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICB0b25lID0gaW50ZXJ2YWxbMF07XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSBpbnRlcnZhbFsxXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIHRvbmUgPSBpbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB0b25lO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlID0gdGhpcy5fYmFzZVNjYWxlLmRlZ3JlZShvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlVG9uZSA9IG5vdGUuc2VtaXRvbmU7XHJcbiAgICAgICAgICAgICAgIG5vdGUuc2VtaXRvbmUgPSBub3RlVG9uZSArIG1vZDtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgbm90ZSBuYW1lcyAtPiBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXROb3RlTmFtZXMoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZU5hbWVzID0gW107XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHRoaXMubm90ZXMpIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gobm90ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIG5vdGVOYW1lcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZCh7XHJcbiAgICAgICAgICAgICAgIHJvb3Q6IHRoaXMucm9vdCxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IFsuLi50aGlzLl90ZW1wbGF0ZV0sXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBwYXJhbSBvdGhlciB0aGUgb3RoZXIgY2hvcmQgdG8gY29tcGFyZSB0b1xyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIGNob3JkcyBhcmUgZXF1YWxcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmNvcHkoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gKHRoaXMucm9vdCA9PT0gb3RoZXIucm9vdCAmJlxyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9PT0gb3RoZXIub2N0YXZlICYmXHJcbiAgICAgICAgICAgICAgIGlzRXF1YWwodGhpcy5fdGVtcGxhdGUsIG90aGVyLnRlbXBsYXRlKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIG5hdHJ1YWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLm1pbm9yKCk7XHJcbiAgICAgICAgKiBjaG9yZC5tYWpvcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWFqb3IoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goMyk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSAzO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgbmF0dXJhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5tYWpvcmVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1ham9yZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLm1ham9yKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIG5hdHVyYWwgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWFqb3IoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc01ham9yKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgbXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsWzMsLTFdLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWlub3IoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzMsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbMywgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLm1pbm9yZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSxbMywtMV0sNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaW5vcmVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5taW5vcigpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc01pbm9yKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWlub3IoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc01pbm9yKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5hdWdtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuc2hhcnBdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGF1Z21lbnQoKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzUsIDFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs1LCAxXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuYXVnbWVudGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5zaGFycF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYXVnbWVudGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5hdWdtZW50KCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIHNoYXJwIDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0F1Z21lbnRlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmF1Z21lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzQXVnbWVudGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNBdWdtZW50ZWQoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBNdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5kaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRpbWluaXNoKCkge1xyXG4gICAgICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlW2ldID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHRoaXMuX3RlbXBsYXRlW2ldO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZS5wdXNoKFs1LCAtMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzUsIC0xXTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5kaW1pbmlzaGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBkaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5kaW1pbmlzaCgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjaG9yZCBoYXMgYSBmbGF0IDV0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0RpbWluaXNoZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5kaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNEaW1pbmlzaGVkKCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCBbNSwgTW9kaWZpZXIuZmxhdF0sIFs3LCBNb2RpZmllci5mbGF0XV1cclxuICAgICAgICAqXHJcbiAgICAgICAgKi9cclxuICAgICAgIGhhbGZEaW1pbmlzaCgpIHtcclxuICAgICAgICAgICB0aGlzLm1pbm9yKCk7IC8vIGdldCBmbGF0IDNyZFxyXG4gICAgICAgICAgIHRoaXMuZGltaW5pc2goKTsgLy8gZ2V0IGZsYXQgNXRoXHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDcpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzcsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNywgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmhhbGZEaW1pbmlzaGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5mbGF0XSwgWzcsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICovXHJcbiAgICAgICBoYWxmRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgMyw1LCBhbmQgN3RoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzSGFsZkRpbWluaXNoZWQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5oYWxmRGltaW5pc2goKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzSGFsZkRpbWluaXNoZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNIYWxmRGltaW5pc2hlZCgpIHtcclxuICAgICAgICAgICBsZXQgdGhpcmQgPSBmYWxzZTtcclxuICAgICAgICAgICBsZXQgZmlmdGggPSBmYWxzZTtcclxuICAgICAgICAgICBsZXQgc2V2ZW50aCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5fdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA3ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBzZXZlbnRoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZmlmdGggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXJkICYmIGZpZnRoICYmIHNldmVudGg7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCB3aXRoIHRoZSBmaXJzdCBub3RlIG1vdmVkIHRvIHRoZSBlbmQgdXAgb25lIG9jdGF2ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmdldE5vdGVOYW1lcygpKTsgLy8gWydDNCcsICdFNCcsICdHNCddXHJcbiAgICAgICAgKiBjaG9yZC5pbnZlcnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzMsNSwxXVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0U0JywgJ0c0JywgJ0M1J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpbnZlcnQoKSB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5fdGVtcGxhdGVbMF0pO1xyXG4gICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuX3RlbXBsYXRlWzBdKSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVswXVswXSArPSB0aGlzLl9iYXNlU2NhbGUudGVtcGxhdGUubGVuZ3RoO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbMF0gKz0gdGhpcy5fYmFzZVNjYWxlLnRlbXBsYXRlLmxlbmd0aDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSBzaGlmdCh0aGlzLl90ZW1wbGF0ZSwgdGhpcy5fdGVtcGxhdGUubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBuZXdUZW1wbGF0ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIHdpdGggdGhlIGZpcnN0IG5vdGUgbW92ZWQgdG8gdGhlIGVuZCB1cCBvbmUgb2N0YXZlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5pbnZlcnRlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFszLDUsMV1cclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0U0JywgJ0c0JywgJ0M1J11cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpbnZlcnRlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkuaW52ZXJ0KCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBzdHJpbmcgZm9ybSBvZiB0aGUgY2hvcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudG9TdHJpbmcoKSk7IC8vICcoQzQpbWFqJ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhDaG9yZFRlbXBsYXRlcyk7XHJcbiAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhDaG9yZFRlbXBsYXRlcykubWFwKCh0ZW1wbGF0ZSkgPT4gSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcclxuICAgICAgICAgICBjb25zdCBpbmRleCA9IHZhbHVlcy5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRoaXMuX3RlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgY29uc3QgcHJlZml4ID0gYCgke1NlbWl0b25lJDFbdGhpcy5fcm9vdF19JHt0aGlzLl9vY3RhdmV9KWA7XHJcbiAgICAgICAgICAgY29uc3Qgc3RyID0gaW5kZXggPiAtMSA/IHByZWZpeCArIGtleXNbaW5kZXhdIDogdGhpcy5nZXROb3RlTmFtZXMoKS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBCdWlsZHMgbG9va3VwIHRhYmxlcyBmb3IgbW9yZSBwZXJmb3JtYW50IHN0cmluZyBwYXJzaW5nLjxici8+XHJcbiAgICAqIFNob3VsZCBvbmx5KG9wdGlvbmFsbHkpIGJlIGNhbGxlZCBvbmNlIHNvb24gYWZ0ZXIgdGhlIGxpYnJhcnkgaXMgbG9hZGVkIGFuZDxici8+XHJcbiAgICAqIG9ubHkgaWYgeW91IGFyZSB1c2luZyBzdHJpbmcgaW5pdGlhbGl6ZXJzLlxyXG4gICAgKi9cclxuICAgY29uc3QgYnVpbGRUYWJsZXMgPSAoKSA9PiB7XHJcbiAgICAgICBidWlsZE5vdGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGROb3RlU3RyaW5nVGFibGUoKTtcclxuICAgICAgIGJ1aWxkU2NhbGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZU5vdGVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZU5hbWVUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRDaG9yZFRhYmxlKCk7XHJcbiAgIH07XG5cbiAgIGV4cG9ydHMuQ2hvcmQgPSBDaG9yZDtcbiAgIGV4cG9ydHMuQ2hvcmRUZW1wbGF0ZXMgPSBDaG9yZFRlbXBsYXRlcztcbiAgIGV4cG9ydHMuSW5zdHJ1bWVudCA9IEluc3RydW1lbnQ7XG4gICBleHBvcnRzLk1vZGlmaWVyID0gTW9kaWZpZXIkMTtcbiAgIGV4cG9ydHMuTm90ZSA9IE5vdGU7XG4gICBleHBvcnRzLlNjYWxlID0gU2NhbGU7XG4gICBleHBvcnRzLlNjYWxlVGVtcGxhdGVzID0gU2NhbGVUZW1wbGF0ZXM7XG4gICBleHBvcnRzLlNlbWl0b25lID0gU2VtaXRvbmUkMTtcbiAgIGV4cG9ydHMuYnVpbGRUYWJsZXMgPSBidWlsZFRhYmxlcztcblxuICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpO1xuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNjYWxlVGVtcGxhdGVzIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIlxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzLCBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3V0aWxzXCJcblxuXG50eXBlIExpZ2h0U2NhbGUgPSB7XG4gICAga2V5OiBudW1iZXIsXG4gICAgdGVtcGxhdGVTbHVnOiBzdHJpbmcsXG4gICAgc2VtaXRvbmVzOiBudW1iZXJbXSxcbn07XG5cblxuY29uc3Qgc2NhbGVzRm9yTm90ZXMgPSAobm90ZXM6IE5vdGVbXSwgcGFyYW1zOiBNdXNpY1BhcmFtcyk6IFNjYWxlW10gPT4ge1xuICAgIGNvbnN0IHNjYWxlcyA9IG5ldyBTZXQ8TGlnaHRTY2FsZT4oKVxuICAgIC8vIEZpcnN0IGFkZCBhbGwgc2NhbGVzXG4gICAgZm9yIChjb25zdCBzY2FsZVNsdWcgaW4gcGFyYW1zLnNjYWxlU2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBwYXJhbXMuc2NhbGVTZXR0aW5nc1tzY2FsZVNsdWddO1xuICAgICAgICBpZiAodGVtcGxhdGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgc2VtaXRvbmU9MDsgc2VtaXRvbmUgPCAxMjsgc2VtaXRvbmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtrZXk6IHNlbWl0b25lLCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXNbc2NhbGVTbHVnXX0pXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VtaXRvbmVzID0gc2NhbGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZGluZ1RvbmUgPSAoc2NhbGUua2V5IC0gMSArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgIGlmICghc2VtaXRvbmVzLmluY2x1ZGVzKGxlYWRpbmdUb25lKSkge1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZXMucHVzaChsZWFkaW5nVG9uZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNjYWxlcy5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNsdWc6IHNjYWxlU2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmVzOiBzZW1pdG9uZXMsXG4gICAgICAgICAgICAgICAgfSBhcyBMaWdodFNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IG5vdGUgb2Ygbm90ZXMpIHtcbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBub3RlLnNlbWl0b25lXG4gICAgICAgIGZvciAoY29uc3Qgc2NhbGUgb2Ygc2NhbGVzKSB7XG4gICAgICAgICAgICBpZiAoIXNjYWxlLnNlbWl0b25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICBzY2FsZXMuZGVsZXRlKHNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChjb25zdCBzY2FsZSBvZiBzY2FsZXMpIHtcbiAgICAgICAgcmV0LnB1c2gobmV3IFNjYWxlKHtrZXk6IHNjYWxlLmtleSwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzW3NjYWxlLnRlbXBsYXRlU2x1Z119KSlcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0QXZhaWxhYmxlU2NhbGVzID0gKHZhbHVlczoge1xuICAgIGxhdGVzdERpdmlzaW9uOiBudW1iZXIsXG4gICAgZGl2aXNpb25lZFJpY2hOb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyxcbiAgICBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgIHJhbmRvbU5vdGVzOiBBcnJheTxOb3RlPixcbiAgICBsb2dnZXI6IExvZ2dlcixcbn0pOiBBcnJheTx7XG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIHRlbnNpb246IG51bWJlcixcbn0+ID0+IHtcbiAgICBjb25zdCB7bGF0ZXN0RGl2aXNpb24sIGRpdmlzaW9uZWRSaWNoTm90ZXMsIHBhcmFtcywgcmFuZG9tTm90ZXMsIGxvZ2dlcn0gPSB2YWx1ZXM7XG4gICAgLy8gR2l2ZW4gYSBuZXcgY2hvcmQsIGZpbmQgYXZhaWxhYmxlIHNjYWxlcyBiYXNlIG9uIHRoZSBwcmV2aW91cyBub3Rlc1xuICAgIGNvbnN0IGN1cnJlbnRBdmFpbGFibGVTY2FsZXMgPSBzY2FsZXNGb3JOb3RlcyhyYW5kb21Ob3RlcywgcGFyYW1zKVxuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChjb25zdCBzY2FsZSBvZiBjdXJyZW50QXZhaWxhYmxlU2NhbGVzKSB7XG4gICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgdGVuc2lvbjogMCxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsb2dnZXIubG9nKFwiY3VycmVudEF2YWlsYWJsZVNjYWxlc1wiLCBjdXJyZW50QXZhaWxhYmxlU2NhbGVzKVxuXG4gICAgLy8gR28gYmFjayBhIGZldyBjaG9yZHMgYW5kIGZpbmQgdGhlIHNjYWxlcyB0aGF0IGFyZSBhdmFpbGFibGUuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgY29uc3QgZGl2aXNpb24gPSBsYXRlc3REaXZpc2lvbiAtIChpICogQkVBVF9MRU5HVEgpXG4gICAgICAgIGlmICghZGl2aXNpb25lZFJpY2hOb3Rlc1tkaXZpc2lvbl0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vdGVzID0gZGl2aXNpb25lZFJpY2hOb3Rlc1tkaXZpc2lvbl0ubWFwKHJpY2hOb3RlID0+IHJpY2hOb3RlLm5vdGUpXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZVNjYWxlcyA9IHNjYWxlc0Zvck5vdGVzKG5vdGVzLCBwYXJhbXMpXG4gICAgICAgIGZvciAoY29uc3QgcG90ZW50aWFsU2NhbGUgb2YgcmV0KSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGF2YWlsYWJsZVNjYWxlcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmVxdWFscyhwb3RlbnRpYWxTY2FsZS5zY2FsZSkpXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBTY2FsZSB3YXNuJ3QgYXZhaWxhYmxlLCBpbmNyZWFzZSB0ZW5zaW9uXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxTY2FsZS50ZW5zaW9uICs9IDIwICAvLyBCYXNlIG9mIGhvdyBsb25nIGFnbyBpdCB3YXNcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMikge1xuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxTY2FsZS50ZW5zaW9uICs9IDEwXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSA1XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsU2NhbGUudGVuc2lvbiArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coXCJTY2FsZSBcIiwgcG90ZW50aWFsU2NhbGUuc2NhbGUudG9TdHJpbmcoKSxcIiB3YXNuJ3QgYXZhaWxhYmxlIGF0IGRpdmlzaW9uIFwiLCBkaXZpc2lvbiwgXCIsIGluY3JlYXNlIHRlbnNpb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbG9nZ2VyLnByaW50KFwiQXZhaWxhYmxlIHNjYWxlc1wiLCByZXQpXG5cbiAgICByZXR1cm4gcmV0LmZpbHRlcihpdGVtID0+IGl0ZW0udGVuc2lvbiA8IDEwKTtcbn0iLCJpbXBvcnQge1xuICAgIGJ1aWxkVGFibGVzLFxuICAgIFNjYWxlLFxuICAgIE5vdGUsXG59IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgQ2hvcmQsIE51bGxhYmxlLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBSaWNoTm90ZSwgQkVBVF9MRU5HVEgsIE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBSYW5kb21DaG9yZEdlbmVyYXRvciB9IGZyb20gXCIuL3JhbmRvbWNob3Jkc1wiO1xuaW1wb3J0IHsgZ2V0SW52ZXJzaW9ucyB9IGZyb20gXCIuL2ludmVyc2lvbnNcIjtcbmltcG9ydCB7IGdldFRlbnNpb24sIFRlbnNpb24gfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBidWlsZFRvcE1lbG9keSB9IGZyb20gXCIuL3RvcG1lbG9keVwiO1xuaW1wb3J0IHsgYWRkSGFsZk5vdGVzIH0gZnJvbSBcIi4vaGFsZm5vdGVzXCI7XG5pbXBvcnQgeyBnZXRBdmFpbGFibGVTY2FsZXMgfSBmcm9tIFwiLi9hdmFpbGFibGVzY2FsZXNcIjtcbmltcG9ydCAqIGFzIHRpbWUgZnJvbSBcIi4vdGltZXJcIjsgXG5cbmNvbnN0IEdPT0RfQ0hPUkRfTElNSVQgPSAxMjtcbmNvbnN0IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCA9IDM7XG5jb25zdCBCQURfQ0hPUkRfTElNSVQgPSAyMDtcblxuXG5jb25zdCBzbGVlcE1TID0gYXN5bmMgKG1zOiBudW1iZXIpOiBQcm9taXNlPG51bGw+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmNvbnN0IG1ha2VDaG9yZHMgPSBhc3luYyAobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrOiBOdWxsYWJsZTxGdW5jdGlvbj4gPSBudWxsKTogUHJvbWlzZTxEaXZpc2lvbmVkUmljaG5vdGVzPiA9PiB7XG4gICAgLy8gZ2VuZXJhdGUgYSBwcm9ncmVzc2lvblxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpO1xuXG4gICAgbGV0IHJlc3VsdDogRGl2aXNpb25lZFJpY2hub3RlcyA9IHt9O1xuXG4gICAgbGV0IGRpdmlzaW9uQmFubmVkTm90ZXM6IHtba2V5OiBudW1iZXJdOiBBcnJheTxBcnJheTxOb3RlPj59ID0ge31cblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBsZXQgcHJldlJlc3VsdCA9IHJlc3VsdFtkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgbGV0IHByZXZDaG9yZCA9IHByZXZSZXN1bHQgPyBwcmV2UmVzdWx0WzBdLmNob3JkIDogbnVsbDtcbiAgICAgICAgbGV0IHByZXZOb3RlczogTm90ZVtdO1xuICAgICAgICBsZXQgcHJldkludmVyc2lvbk5hbWU6IHN0cmluZztcbiAgICAgICAgbGV0IGN1cnJlbnRTY2FsZTogU2NhbGU7XG4gICAgICAgIGxldCBiYW5uZWROb3Rlc3MgPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uXTtcbiAgICAgICAgaWYgKHByZXZSZXN1bHQpIHtcbiAgICAgICAgICAgIHByZXZOb3RlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lID0gcmljaE5vdGUuaW52ZXJzaW9uTmFtZTtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb24pO1xuICAgICAgICBjb25zdCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID0gcGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kO1xuXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoXCJkaXZpc2lvblwiLCBkaXZpc2lvbiwgcHJldkNob3JkID8gcHJldkNob3JkLnRvU3RyaW5nKCkgOiBcIm51bGxcIiwgXCIgc2NhbGUgXCIsIGN1cnJlbnRTY2FsZSA/IGN1cnJlbnRTY2FsZS50b1N0cmluZygpIDogXCJudWxsXCIpO1xuICAgICAgICBjb25zdCBjdXJyZW50QmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVwiLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlKTtcblxuICAgICAgICBjb25zdCByYW5kb21HZW5lcmF0b3IgPSBuZXcgUmFuZG9tQ2hvcmRHZW5lcmF0b3IocGFyYW1zLCBjdXJyZW50U2NhbGUpXG4gICAgICAgIGxldCBuZXdDaG9yZDogTnVsbGFibGU8Q2hvcmQ+ID0gbnVsbDtcblxuICAgICAgICBsZXQgZ29vZENob3JkczogUmljaE5vdGVbXVtdID0gW11cbiAgICAgICAgY29uc3QgYmFkQ2hvcmRzOiB7dGVuc2lvbjogVGVuc2lvbiwgY2hvcmQ6IHN0cmluZ31bXSA9IFtdXG5cbiAgICAgICAgY29uc3QgcmFuZG9tTm90ZXM6IEFycmF5PE5vdGU+ID0gW107XG5cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICBsZXQgc2tpcExvb3AgPSBmYWxzZTtcblxuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAxKSB7XG4gICAgICAgICAgICAvLyBGb3JjZSBzYW1lIGNob3JkIHR3aWNlXG4gICAgICAgICAgICBnb29kQ2hvcmRzLnNwbGljZSgwLCBnb29kQ2hvcmRzLmxlbmd0aCk7XG4gICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocHJldk5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogQkVBVF9MRU5HVEgsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgdGVuc2lvbjogbmV3IFRlbnNpb24oKSxcbiAgICAgICAgICAgICAgICBzY2FsZTogY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSkpKTtcbiAgICAgICAgICAgIHNraXBMb29wID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghc2tpcExvb3AgJiYgZ29vZENob3Jkcy5sZW5ndGggPCBHT09EX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgICBuZXdDaG9yZCA9IHJhbmRvbUdlbmVyYXRvci5nZXRDaG9yZCgpO1xuICAgICAgICAgICAgY29uc3QgY2hvcmRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucyA+IDEwMDAgfHwgIW5ld0Nob3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb28gbWFueSBpdGVyYXRpb25zLCBnb2luZyBiYWNrXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGFsbEludmVyc2lvbnM7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlU2NhbGVzO1xuXG4gICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBnZXRBdmFpbGFibGVTY2FsZXMoe1xuICAgICAgICAgICAgICAgIGxhdGVzdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXM6IG5ld0Nob3JkLm5vdGVzLFxuICAgICAgICAgICAgICAgIGxvZ2dlcjogbmV3IExvZ2dlcihjaG9yZExvZ2dlciksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSAmJiAobWF4QmVhdHMgLSBjdXJyZW50QmVhdCA8IDMgfHwgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMgfHwgY3VycmVudEJlYXQgPCA1KSkge1xuICAgICAgICAgICAgICAgIC8vIERvbid0IGFsbG93IG90aGVyIHNjYWxlcyB0aGFuIHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVNjYWxlcyA9IGF2YWlsYWJsZVNjYWxlcy5maWx0ZXIocyA9PiBzLnNjYWxlLmVxdWFscyhjdXJyZW50U2NhbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdmFpbGFibGVTY2FsZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsbEludmVyc2lvbnMgPSBnZXRJbnZlcnNpb25zKHtcbiAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsIHByZXZOb3RlczogcHJldk5vdGVzLCBiZWF0OiBjdXJyZW50QmVhdCwgcGFyYW1zLCBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG1heEJlYXRzIC0gY3VycmVudEJlYXRcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaW52ZXJzaW9uUmVzdWx0IG9mIGFsbEludmVyc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPj0gR09PRF9DSE9SRF9MSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgaW52ZXJzaW9uTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgICAgICAgICAgIGludmVyc2lvbkxvZ2dlci50aXRsZSA9IFtcIkludmVyc2lvbiBcIiwgYCR7aW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWV9YF07XG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXMuc3BsaWNlKDAsIHJhbmRvbU5vdGVzLmxlbmd0aCk7ICAvLyBFbXB0eSB0aGlzIGFuZCByZXBsYWNlIGNvbnRlbnRzXG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXMucHVzaCguLi5pbnZlcnNpb25SZXN1bHQubm90ZXMpO1xuICAgICAgICAgICAgICAgIGlmIChiYW5uZWROb3Rlc3MgJiYgYmFubmVkTm90ZXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJhbm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmFubmVkTm90ZXMgb2YgYmFubmVkTm90ZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXMubGVuZ3RoICE9IHJhbmRvbU5vdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZG9tTm90ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tTm90ZXNbaV0udG9TdHJpbmcoKSAhPSBiYW5uZWROb3Rlc1tpXS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYW5uZWQgbm90ZXNcIiwgcmFuZG9tTm90ZXMubWFwKG4gPT4gbi50b1N0cmluZygpKSwgXCJiYW5uZWROb3Rlc3NcIiwgYmFubmVkTm90ZXNzLm1hcChuID0+IG4ubWFwKG4gPT4gbi50b1N0cmluZygpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhdmFpbGFibGVTY2FsZSBvZiBhdmFpbGFibGVTY2FsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZHMubGVuZ3RoID49IEdPT0RfQ0hPUkRfTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbnNpb25SZXN1bHQgPSBnZXRUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RlczogcmFuZG9tTm90ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG1heEJlYXRzIC0gY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gYXZhaWxhYmxlU2NhbGUudGVuc2lvbiAvIE1hdGgubWF4KDAuMDEsIHBhcmFtcy5tb2R1bGF0aW9uV2VpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSAmJiAhYXZhaWxhYmxlU2NhbGUuc2NhbGUuZXF1YWxzKGN1cnJlbnRTY2FsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxIC8gTWF0aC5tYXgoMC4wMSwgcGFyYW1zLm1vZHVsYXRpb25XZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1heEJlYXRzIC0gY3VycmVudEJlYXQgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGFzdCAyIGJhcnMsIGRvbid0IGNoYW5nZSBzY2FsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBjaGFuZ2Ugc2NhbGUgaW4gbGFzdCAyIGJlYXRzIG9mIGNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCZWF0IDwgNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGNoYW5nZSBzY2FsZSBpbiBmaXJzdCA1IGJlYXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVuc2lvbiA9IHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2l2ZVVQKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbkxvZ2dlci5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRoaXNDaG9yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZ29vZENob3JkIG9mIGdvb2RDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQ2hvcmRDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hvcmRDb3VudCA+PSBHT09EX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB3b3JzdCBwcmV2aW91cyBnb29kQ2hvcmQgaWYgdGhpcyBoYXMgbGVzcyB0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcnN0Q2hvcmQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JzdENob3JkVGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnb29kQ2hvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RDaG9yZCA9IGdvb2RDaG9yZHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRbMF0uY2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uIDwgd29yc3RDaG9yZFRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JzdENob3JkID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yc3RDaG9yZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRzW3dvcnN0Q2hvcmRdWzBdLnRlbnNpb24udG90YWxUZW5zaW9uID4gdGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCByZW1vdmUgdGhhdCBpbmRleCwgYWRkIGEgbmV3IG9uZSBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZENob3Jkcy5zcGxpY2Uod29yc3RDaG9yZCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hvcmRDb3VudCA8IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RDaG9yZHMucHVzaChyYW5kb21Ob3Rlcy5tYXAoKG5vdGUsIGluZGV4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlOiBub3RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogQkVBVF9MRU5HVEgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRlbnNpb25SZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJpY2hOb3RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJhZENob3Jkcy5sZW5ndGggPCBCQURfQ0hPUkRfTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaG9yZENvdW50SW5CYWRDaG9yZHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiYWRDaG9yZCBvZiBiYWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFkQ2hvcmQuY2hvcmQgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZENvdW50SW5CYWRDaG9yZHMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hvcmRDb3VudEluQmFkQ2hvcmRzIDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZENob3Jkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRlbnNpb25SZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gIC8vIEZvciBhdmFpbGFibGUgc2NhbGVzIGVuZFxuICAgICAgICAgICAgfSAgLy8gRm9yIHZvaWNlbGVhZGluZyByZXN1bHRzIGVuZFxuICAgICAgICB9ICAvLyBXaGlsZSBlbmRcbiAgICAgICAgaWYgKGdvb2RDaG9yZHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFkQ2hvcmQgb2YgYmFkQ2hvcmRzKSB7XG4gICAgICAgICAgICAgICAgYmFkQ2hvcmQudGVuc2lvbi5wcmludChcIkJhZCBjaG9yZCBcIiwgYmFkQ2hvcmQuY2hvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gR28gYmFjayB0byBwcmV2aW91cyBjaG9yZCwgYW5kIG1ha2UgaXQgYWdhaW5cbiAgICAgICAgICAgIGlmIChkaXZpc2lvbiA+PSBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIGRpdmlzaW9uIC09IEJFQVRfTEVOR1RIICogMjtcbiAgICAgICAgICAgICAgICAvLyBNYXJrIHRoZSBwcmV2aW91cyBjaG9yZCBhcyBiYW5uZWRcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdCYW5uZWROb3RlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3QmFubmVkTm90ZXNbbm90ZS5wYXJ0SW5kZXhdID0gbm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgdGhlIHByZXZpb3VzIGNob3JkICh3aGVyZSB3ZSBhcmUgZ29pbmcgdG8pXG4gICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSA9IGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gfHwgW107XG4gICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5wdXNoKG5ld0Jhbm5lZE5vdGVzKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBmYWlsZWQgcmlnaHQgYXQgdGhlIHN0YXJ0LlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmFuZG9tR2VuZXJhdG9yLmNsZWFuVXAoKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhjdXJyZW50QmVhdCAtIDEsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENob29zZSB0aGUgYmVzdCBjaG9yZCBmcm9tIGdvb2RDaG9yZHNcbiAgICAgICAgbGV0IGJlc3RDaG9yZCA9IGdvb2RDaG9yZHNbMF07XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmQgb2YgZ29vZENob3Jkcykge1xuICAgICAgICAgICAgaWYgKGNob3JkWzBdKSB7XG4gICAgICAgICAgICAgICAgY2hvcmRbMF0udGVuc2lvbi5wcmludChjaG9yZFswXS5jaG9yZCA/IGNob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgOiBcIj9DaG9yZD9cIiwgXCI6IFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24gPCBiZXN0Q2hvcmRbMF0udGVuc2lvbikge1xuICAgICAgICAgICAgICAgIGJlc3RDaG9yZCA9IGNob3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W2RpdmlzaW9uXSA9IGJlc3RDaG9yZDtcblxuICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhjdXJyZW50QmVhdCwgcmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlTXVzaWMocGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpIHtcbiAgICBsZXQgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0ge307XG4gICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPiA1KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvbyBtYW55IGl0ZXJhdGlvbnMsIGJyZWFraW5nXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXM6IHt9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpdmlzaW9uZWROb3RlcyA9IGF3YWl0IG1ha2VDaG9yZHMocGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrKTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRpdmlzaW9uZWROb3RlcykubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIH1cblxuICAgIC8vIGNvbnN0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IG5ld1ZvaWNlTGVhZGluZ05vdGVzKGNob3JkcywgcGFyYW1zKTtcbiAgICBidWlsZFRvcE1lbG9keShkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcyk7XG4gICAgLy8gYWRkRWlnaHRoTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG4gICAgYWRkSGFsZk5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkaXZpc2lvbmVkTm90ZXM6IGRpdmlzaW9uZWROb3RlcyxcbiAgICB9XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VNZWxvZHkoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpIHtcbiAgICAvLyBSZW1vdmUgb2xkIG1lbG9keSBhbmQgbWFrZSBhIG5ldyBvbmVcbiAgICBjb25zdCBtYXhCZWF0cyA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKVxuXG4gICAgZm9yIChsZXQgZGl2aXNpb24gPSAwOyBkaXZpc2lvbiA8IG1heEJlYXRzICogQkVBVF9MRU5HVEg7IGRpdmlzaW9uKyspIHtcbiAgICAgICAgY29uc3Qgb25CZWF0ID0gZGl2aXNpb24gJSBCRUFUX0xFTkdUSCA9PSAwO1xuICAgICAgICBpZiAoIW9uQmVhdCkge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSA9IFtdXG4gICAgICAgIH0gZWxzZSBpZiAoZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSAmJiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0uZm9yRWFjaChyaWNoTm90ZSA9PiB7XG4gICAgICAgICAgICAgICAgcmljaE5vdGUuZHVyYXRpb24gPSBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgICAgICByaWNoTm90ZS50aWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSBuZXdWb2ljZUxlYWRpbmdOb3RlcyhjaG9yZHMsIHBhcmFtcyk7XG4gICAgYnVpbGRUb3BNZWxvZHkoZGl2aXNpb25lZE5vdGVzLCBtYWluUGFyYW1zKTtcbiAgICAvLyBhZGRFaWdodGhOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcbiAgICBhZGRIYWxmTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBtYWluUGFyYW1zKVxufVxuXG5leHBvcnQgeyBidWlsZFRhYmxlcyB9IiwiaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMsIE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjb25zdCBhZGRIYWxmTm90ZXMgPSAoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpID0+IHtcblxuICAgIGNvbnN0IGJlYXRzUGVyQmFyID0gbWFpblBhcmFtcy5iZWF0c1BlckJhciB8fCA0O1xuICAgIGNvbnN0IGxhc3REaXZpc2lvbiA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKSAqIEJFQVRfTEVOR1RIO1xuXG4gICAgZm9yIChsZXQgZGl2aXNpb24gPSAwOyBkaXZpc2lvbiA8IGxhc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgbGFzdEJlYXQgPSBNYXRoLmZsb29yKGRpdmlzaW9uIC8gQkVBVF9MRU5HVEgpICogQkVBVF9MRU5HVEg7XG4gICAgICAgIGxldCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID0gcGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kO1xuICAgICAgICBsZXQgY2FkZW5jZUVuZGluZyA9IGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAyXG4gICAgICAgIGlmIChwYXJhbXMuaGFsZk5vdGVzICYmICFjYWRlbmNlRW5kaW5nKSB7XG4gICAgICAgICAgICAvLyBBZGQgYSB0aWUgc3RhcnQgdG8gdGhlIHByZXZpb3VzIG5vdGUgdG8gZG91YmxlIGxlbmd0aCwgYW5kIHRpZSBzdG9wIHRvIHRoaXNcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgY29udGludWluZyB3aXRoIHRoZSBzYW1lXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c05vdGVzID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uIC0gMTJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudE5vdGVzID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSB8fCBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTw0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c05vdGUgPSBwcmV2aW91c05vdGVzLmZpbHRlcigobikgPT4gbi5wYXJ0SW5kZXggPT0gaSlbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudE5vdGUgPSBjdXJyZW50Tm90ZXMuZmlsdGVyKChuKSA9PiBuLnBhcnRJbmRleCA9PSBpKVswXTtcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNOb3RlICYmIGN1cnJlbnROb3RlICYmIHByZXZpb3VzTm90ZS5ub3RlLmVxdWFscyhjdXJyZW50Tm90ZS5ub3RlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNOb3RlLmR1cmF0aW9uICE9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vdGUuZHVyYXRpb24gIT0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c05vdGUudGllICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzTm90ZS50aWUgPSBcInN0YXJ0XCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb3RlLnRpZSA9IFwic3RvcFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJldmlvdXNOb3RlczogXCIsIHByZXZpb3VzTm90ZXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgQ2hvcmQsIGdsb2JhbFNlbWl0b25lLCBNdXNpY1BhcmFtcywgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIEludmVyc2lvblJlc3VsdCA9IHtcbiAgICBnVG9uZURpZmZzOiBBcnJheTxBcnJheTxudW1iZXI+PixcbiAgICBub3Rlczoge1trZXk6IG51bWJlcl06IE5vdGV9LFxuICAgIHJhdGluZzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU6IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgU2ltcGxlSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgIG5vdGVzOiBBcnJheTxOb3RlPixcbiAgICByYXRpbmc6IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lOiBzdHJpbmcsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNpb25zID0gKHZhbHVlczoge1xuICAgICAgICBjaG9yZDogQ2hvcmQsIHByZXZOb3RlczogQXJyYXk8Tm90ZT4sIGJlYXQ6IG51bWJlciwgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICAgICAgbG9nZ2VyOiBMb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG51bWJlclxuICAgIH0pOiBBcnJheTxTaW1wbGVJbnZlcnNpb25SZXN1bHQ+ID0+IHtcbiAgICBjb25zdCB7Y2hvcmQsIHByZXZOb3RlcywgYmVhdCwgcGFyYW1zLCBsb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmd9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBOb3RlcyBpbiB0aGUgQ2hvcmQgdGhhdCBhcmUgY2xvc2VzdCB0byB0aGUgcHJldmlvdXMgbm90ZXNcbiAgICAvLyBGb3IgZWFjaCBwYXJ0XG5cbiAgICBjb25zdCB7c3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsIHNlbWl0b25lTGltaXRzfSA9IHN0YXJ0aW5nTm90ZXMocGFyYW1zKTtcblxuICAgIC8vIEFkZCBhIHJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBpbnZlcnNpb25cbiAgICBjb25zdCByZXQ6IEFycmF5PFNpbXBsZUludmVyc2lvblJlc3VsdD4gPSBbXTtcblxuICAgIGxldCBsYXN0QmVhdEdsb2JhbFNlbWl0b25lcyA9IFsuLi5zdGFydGluZ0dsb2JhbFNlbWl0b25lc11cbiAgICBpZiAocHJldk5vdGVzKSB7XG4gICAgICAgIGxhc3RCZWF0R2xvYmFsU2VtaXRvbmVzID0gcHJldk5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICB9XG5cbiAgICBpZiAoIWNob3JkKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAoY2hvcmQpIHtcbiAgICAgICAgLy8gRm9yIGVhY2ggYmVhdCwgd2UgdHJ5IHRvIGZpbmQgYSBnb29kIG1hdGNoaW5nIHNlbWl0b25lIGZvciBlYWNoIHBhcnQuXG5cbiAgICAgICAgLy8gUnVsZXM6XG4gICAgICAgIC8vIFdpdGhcdHJvb3QgcG9zaXRpb24gdHJpYWRzOiBkb3VibGUgdGhlIHJvb3QuIFxuXG4gICAgICAgIC8vIFdpdGggZmlyc3QgaW52ZXJzaW9uIHRyaWFkczogZG91YmxlIHRoZSByb290IG9yIDV0aCwgaW4gZ2VuZXJhbC4gSWYgb25lIG5lZWRzIHRvIGRvdWJsZSBcbiAgICAgICAgLy8gdGhlIDNyZCwgdGhhdCBpcyBhY2NlcHRhYmxlLCBidXQgYXZvaWQgZG91YmxpbmcgdGhlIGxlYWRpbmcgdG9uZS5cblxuICAgICAgICAvLyBXaXRoIHNlY29uZCBpbnZlcnNpb24gdHJpYWRzOiBkb3VibGUgdGhlIGZpZnRoLiBcblxuICAgICAgICAvLyBXaXRoICBzZXZlbnRoICBjaG9yZHM6ICB0aGVyZSAgaXMgIG9uZSB2b2ljZSAgZm9yICBlYWNoICBub3RlLCAgc28gIGRpc3RyaWJ1dGUgYXMgIGZpdHMuIElmICBvbmUgXG4gICAgICAgIC8vIG11c3Qgb21pdCBhIG5vdGUgZnJvbSB0aGUgY2hvcmQsIHRoZW4gb21pdCB0aGUgNXRoLlxuXG4gICAgICAgIGNvbnN0IGZpcnN0SW50ZXJ2YWwgPSBzZW1pdG9uZURpc3RhbmNlKGNob3JkLm5vdGVzWzBdLnNlbWl0b25lLCBjaG9yZC5ub3Rlc1sxXS5zZW1pdG9uZSlcbiAgICAgICAgY29uc3QgdGhpcmRJc0dvb2QgPSBmaXJzdEludGVydmFsID09IDMgfHwgZmlyc3RJbnRlcnZhbCA9PSA0O1xuICAgICAgICBsb2dnZXIubG9nKFwibm90ZXM6IFwiLCBjaG9yZC5ub3Rlcy5tYXAobiA9PiBuLnRvU3RyaW5nKCkpKTtcblxuICAgICAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGludmVyc2lvbiBhbmQgY2hvcmQgdHlwZSwgd2UncmUgZG9pbmcgZGlmZmVyZW50IHRoaW5nc1xuXG4gICAgICAgIGxldCBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJmaXJzdC1yb290XCIsIFwiZmlyc3QtdGhpcmRcIiwgXCJmaXJzdC1maWZ0aFwiLCBcInNlY29uZFwiXTtcbiAgICAgICAgbGV0IGNvbWJpbmF0aW9uQ291bnQgPSAzICogMiAqIDE7XG4gICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgc2tpcEZpZnRoSW5kZXggPSAwOyBza2lwRmlmdGhJbmRleCA8IDI7IHNraXBGaWZ0aEluZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgaW52ZXJzaW9uSW5kZXg9MDsgaW52ZXJzaW9uSW5kZXg8aW52ZXJzaW9uTmFtZXMubGVuZ3RoOyBpbnZlcnNpb25JbmRleCsrKSB7XG4gICAgICAgIGZvciAobGV0IGNvbWJpbmF0aW9uSW5kZXg9MDsgY29tYmluYXRpb25JbmRleDxjb21iaW5hdGlvbkNvdW50OyBjb21iaW5hdGlvbkluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNraXBGaWZ0aCA9IHNraXBGaWZ0aEluZGV4ID09IDE7XG5cbiAgICAgICAgICAgIC8vIFdlIHRyeSBlYWNoIGludmVyc2lvbi4gV2hpY2ggaXMgYmVzdD9cbiAgICAgICAgICAgIGNvbnN0IGludmVyc2lvbiA9IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XTtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nIDwgMikge1xuICAgICAgICAgICAgICAgIGlmICghaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gRG9uJ3QgZG8gYW55dGhpbmcgYnV0IHJvb3QgcG9zaXRpb24gb24gdGhlIGxhc3QgY2hvcmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGludmVyc2lvblJlc3VsdDogSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIGdUb25lRGlmZnM6IFtdLFxuICAgICAgICAgICAgICAgIG5vdGVzOiB7fSxcbiAgICAgICAgICAgICAgICByYXRpbmc6IDAsXG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uTmFtZXNbaW52ZXJzaW9uSW5kZXhdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChza2lwRmlmdGgpIHtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArPSBcIi1za2lwRmlmdGhcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWRkUGFydE5vdGUgPSAocGFydEluZGV4OiBudW1iZXIsIG5vdGU6IE5vdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSA9IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IG5vdGUuc2VtaXRvbmUsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogMSAgLy8gZHVtbXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyLmxvZyhcImludmVyc2lvbjogXCIsIGludmVyc2lvbiwgXCJza2lwRmlmdGg6IFwiLCBza2lwRmlmdGgpO1xuICAgICAgICAgICAgbGV0IHBhcnRUb0luZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge307XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHNlbGVjdCBib3R0b20gbm90ZVxuICAgICAgICAgICAgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdmaXJzdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCd0aGlyZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMaXN0IG5vdGVzIHdlIGhhdmUgbGVmdCBvdmVyXG4gICAgICAgICAgICBsZXQgbGVmdE92ZXJJbmRleGVzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKGNob3JkLm5vdGVzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvbiA9PSBcInJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMl07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LXJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXJzdCAtPiBXZSBhbHJlYWR5IGhhdmUgMVxuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMCwgMl07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LXRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDJdOyAgLy8gRG91YmxlIHRoZSB0aGlyZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmQgLT4gV2UgYWxyZWFkeSBoYXZlIDJcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAyLCAzXS5maWx0ZXIoaSA9PiBpICE9IHBhcnRUb0luZGV4WzNdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNraXBGaWZ0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0VG9JbmRleFszXSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaW4gc2Vjb25kIGludmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDIpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaWYgd2UgaGF2ZSB0d29cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpICE9IDIpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBlaXRoZXIgYSAwIG9yIDEgdG8gcmVwbGFjZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICBpZiAobGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgPT0gMCkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZXBlbmRpbmcgb24gY29tYmluYXRpb25JbmRleCwgd2Ugc2VsZWN0IHRoZSBub3RlcyBmb3IgcGFydEluZGV4ZXMgMCwgMSwgMlxuICAgICAgICAgICAgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlyZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gRm91cnRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBGaWZ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgLy8gU2l4dGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgcGFydEluZGV4PTA7IHBhcnRJbmRleDw0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHBhcnQgaXMgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFBhcnROb3RlKHBhcnRJbmRleCwgY2hvcmQubm90ZXNbcGFydFRvSW5kZXhbcGFydEluZGV4XV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGFzdGx5LCB3ZSBzZWxlY3QgdGhlIGxvd2VzdCBwb3NzaWJsZSBvY3RhdmUgZm9yIGVhY2ggcGFydFxuICAgICAgICAgICAgbGV0IG1pblNlbWl0b25lID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0zOyBwYXJ0SW5kZXg+PTA7IHBhcnRJbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBnVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGk9MDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZ1RvbmUgPCBzZW1pdG9uZUxpbWl0c1twYXJ0SW5kZXhdWzBdIHx8IGdUb25lIDwgbWluU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUb28gbWFueSBpdGVyYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnVG9uZSArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IGludmVyc2lvbnJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBvY3RhdmUgY29tYmluYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0ME5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMF0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQxTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1sxXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDJOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzJdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0M05vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbM10pO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydDBPY3RhdmU9MDsgcGFydDBPY3RhdmU8MzsgcGFydDBPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQwTm90ZSA9IGluaXRpYWxQYXJ0ME5vdGUgKyBwYXJ0ME9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ME5vdGUgPiBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDFPY3RhdmU9MDsgcGFydDFPY3RhdmU8MzsgcGFydDFPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0MU5vdGUgPSBpbml0aWFsUGFydDFOb3RlICsgcGFydDFPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHBhcnQwTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHNlbWl0b25lTGltaXRzWzFdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0Mk9jdGF2ZT0wOyBwYXJ0Mk9jdGF2ZTwzOyBwYXJ0Mk9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0Mk5vdGUgPSBpbml0aWFsUGFydDJOb3RlICsgcGFydDJPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBwYXJ0MU5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBzZW1pdG9uZUxpbWl0c1syXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDNPY3RhdmU9MDsgcGFydDNPY3RhdmU8MzsgcGFydDNPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQzTm90ZSA9IGluaXRpYWxQYXJ0M05vdGUgKyBwYXJ0M09jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBwYXJ0Mk5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBzZW1pdG9uZUxpbWl0c1szXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0ME5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDBOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQxTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0MU5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDJOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQyTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0M05vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDNOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbmc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxvZ2dlci5wcmludChcIm5ld1ZvaWNlTGVhZGluZ05vdGVzOiBcIiwgY2hvcmQudG9TdHJpbmcoKSwgXCIgYmVhdDogXCIsIGJlYXQpO1xuXG4gICAgLy8gUmFuZG9taXplIG9yZGVyIG9mIHJldFxuICAgIGZvciAobGV0IGk9MDsgaTxyZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJldC5sZW5ndGgpO1xuICAgICAgICBjb25zdCB0bXAgPSByZXRbaV07XG4gICAgICAgIHJldFtpXSA9IHJldFtqXTtcbiAgICAgICAgcmV0W2pdID0gdG1wO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG4iLCJjb25zdCBwcmludENoaWxkTWVzc2FnZXMgPSAoY2hpbGRMb2dnZXI6IExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRMb2dnZXIuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5jaGlsZC50aXRsZSk7XG4gICAgICAgIHByaW50Q2hpbGRNZXNzYWdlcyhjaGlsZCk7XG4gICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBjaGlsZC5tZXNzYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4ubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgdGl0bGU6IGFueVtdID0gW107XG4gICAgbWVzc2FnZXM6IEFycmF5PGFueVtdPiA9IFtdO1xuICAgIHBhcmVudDogTG9nZ2VyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGNoaWxkcmVuOiBMb2dnZXJbXSA9IFtdO1xuICAgIGNsZWFyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogTG9nZ2VyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goYXJncyk7XG4gICAgfVxuXG4gICAgcHJpbnQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgLy8gTGV0IHBhcmVudCBoYW5kbGUgbWVcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLmFyZ3MpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLnRoaXMudGl0bGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHRvcCBsb2dnZXIuIFByaW50IGV2ZXJ5dGhpbmcuXG4gICAgICAgIHByaW50Q2hpbGRNZXNzYWdlcyh0aGlzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi50aGlzLm1lc3NhZ2VzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsZWFyZWQgPSB0cnVlO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGNob3JkVGVtcGxhdGVzLCBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBSYW5kb21DaG9yZEdlbmVyYXRvciB7XG4gICAgcHJpdmF0ZSBjaG9yZFR5cGVzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIGF2YWlsYWJsZUNob3JkczogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHVzZWRDaG9yZHM6IFNldDxzdHJpbmc+O1xuICAgIHByaXZhdGUgY3VycmVudFNjYWxlOiBTY2FsZTtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogTXVzaWNQYXJhbXMsIHNjYWxlOiBTY2FsZSkge1xuICAgICAgICBjb25zdCBjaG9yZFR5cGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmRUeXBlIGluIHBhcmFtcy5jaG9yZFNldHRpbmdzKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmNob3JkU2V0dGluZ3NbY2hvcmRUeXBlXS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgY2hvcmRUeXBlcy5wdXNoKGNob3JkVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaG9yZFR5cGVzID0gY2hvcmRUeXBlcztcbiAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IHNjYWxlO1xuICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYnVpbGRBdmFpbGFibGVDaG9yZHMoKSB7XG4gICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMgPSAodGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgW10pLmZpbHRlcihjaG9yZCA9PiAhdGhpcy51c2VkQ2hvcmRzLmhhcyhjaG9yZCkpO1xuICAgICAgICAvLyBGaXJzdCB0cnkgdG8gYWRkIHRoZSBzaW1wbGVzdCBjaG9yZHNcbiAgICAgICAgZm9yIChjb25zdCBzaW1wbGVDaG9yZFR5cGUgb2YgdGhpcy5jaG9yZFR5cGVzLmZpbHRlcihjaG9yZFR5cGUgPT4gW1wibWFqXCIsIFwibWluXCJdLmluY2x1ZGVzKGNob3JkVHlwZSkpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCByYW5kb21Sb290PTA7IHJhbmRvbVJvb3Q8MTI7IHJhbmRvbVJvb3QrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3Jkcy5wdXNoKHJhbmRvbVJvb3QgKyBzaW1wbGVDaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTAwOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0aGlzLmNob3JkVHlwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jaG9yZFR5cGVzLmxlbmd0aCldO1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tUm9vdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyKTtcbiAgICAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhyYW5kb21Sb290ICsgcmFuZG9tVHlwZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3Jkcy5wdXNoKHJhbmRvbVJvb3QgKyByYW5kb21UeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgY2xlYW5VcCgpIHtcbiAgICAgICAgaWYgKHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMgPSBbXTtcbiAgICAgICAgZGVsZXRlIHRoaXMudXNlZENob3JkcztcbiAgICAgICAgZGVsZXRlIHRoaXMuYXZhaWxhYmxlQ2hvcmRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDaG9yZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmF2YWlsYWJsZUNob3JkcyB8fCB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoIC0gMyA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaG9yZFR5cGUgPSB0aGlzLmF2YWlsYWJsZUNob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMoY2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMuYWRkKGNob3JkVHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gdGhpcy5hdmFpbGFibGVDaG9yZHMuZmlsdGVyKGNob3JkID0+IGNob3JkICE9PSBjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENob3JkKGNob3JkVHlwZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBNdXNpY1BhcmFtcywgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjbGFzcyBUZW5zaW9uIHtcbiAgICBub3RJblNjYWxlOiBudW1iZXIgPSAwO1xuICAgIG1vZHVsYXRpb246IG51bWJlciA9IDA7XG4gICAgYWxsTm90ZXNTYW1lOiBudW1iZXIgPSAwO1xuICAgIGNob3JkUHJvZ3Jlc3Npb246IG51bWJlciA9IDA7XG4gICAgZm91cnRoRG93bkNob3JkUHJvZ3Jlc3Npb246IG51bWJlciA9IDA7XG4gICAgcGFyYWxsZWxGaWZ0aHM6IG51bWJlciA9IDA7XG4gICAgc3BhY2luZ0Vycm9yOiBudW1iZXIgPSAwO1xuICAgIGNhZGVuY2U6IG51bWJlciA9IDA7XG4gICAgdGVuc2lvbmluZ0ludGVydmFsOiBudW1iZXIgPSAwO1xuICAgIHNlY29uZEludmVyc2lvbjogbnVtYmVyID0gMDtcbiAgICBkb3VibGVMZWFkaW5nVG9uZTogbnVtYmVyID0gMDtcbiAgICBsZWFkaW5nVG9uZVVwOiBudW1iZXIgPSAwO1xuICAgIG1lbG9keUp1bXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5VGFyZ2V0OiBudW1iZXIgPSAwO1xuICAgIHZvaWNlRGlyZWN0aW9uczogbnVtYmVyID0gMDtcbiAgICBvdmVybGFwcGluZzogbnVtYmVyID0gMDtcblxuICAgIHRvdGFsVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGdldFRvdGFsVGVuc2lvbih2YWx1ZXM6IHtwYXJhbXM6IE11c2ljUGFyYW1zLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlOiBudW1iZXJ9KSB7XG4gICAgICAgIGNvbnN0IHtwYXJhbXMsIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2V9ID0gdmFsdWVzO1xuICAgICAgICBsZXQgdGVuc2lvbiA9IDA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5ub3RJblNjYWxlICogMTAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubW9kdWxhdGlvbjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmFsbE5vdGVzU2FtZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNob3JkUHJvZ3Jlc3Npb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5wYXJhbGxlbEZpZnRocztcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNwYWNpbmdFcnJvcjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNhZGVuY2U7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy50ZW5zaW9uaW5nSW50ZXJ2YWw7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5zZWNvbmRJbnZlcnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmxlYWRpbmdUb25lVXA7XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID4gMikge1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLmZvdXJ0aERvd25DaG9yZFByb2dyZXNzaW9uO1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keVRhcmdldDtcbiAgICAgICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlKdW1wICogMC41O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keUp1bXA7XG4gICAgICAgIH1cbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnZvaWNlRGlyZWN0aW9ucztcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm92ZXJsYXBwaW5nO1xuXG4gICAgICAgIHRoaXMudG90YWxUZW5zaW9uID0gdGVuc2lvbjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgcHJpbnQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgLy8gUHJpbnQgb25seSBwb3NpdGl2ZSB2YWx1ZXNcbiAgICAgICAgY29uc3QgdG9QcmludDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXNba2V5XSAmJiB0eXBlb2YgdGhpc1trZXldID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0b1ByaW50W2tleV0gPSAodGhpc1trZXldIGFzIHVua25vd24gYXMgbnVtYmVyKS50b0ZpeGVkKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MsIHRvUHJpbnQpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBnZXRUZW5zaW9uID0gKHZhbHVlczoge1xuICAgICAgICBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIHRvTm90ZXM6IEFycmF5PE5vdGU+LCBjdXJyZW50U2NhbGU6IFNjYWxlLFxuICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlOiBudW1iZXIsIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG51bWJlciwgaW52ZXJzaW9uTmFtZTogc3RyaW5nLCBwcmV2SW52ZXJzaW9uTmFtZTogU3RyaW5nXG4gICAgfSk6IFRlbnNpb24gPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXMsXG4gICAgICAgICAgICB0b05vdGVzLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcsXG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgIH0gPSB2YWx1ZXM7XG4gICAgLypcbiAgICAqICAgR2V0IHRoZSB0ZW5zaW9uIGJldHdlZW4gdHdvIGNob3Jkc1xuICAgICogICBAcGFyYW0gZnJvbUNob3JkOiBDaG9yZFxuICAgICogICBAcGFyYW0gdG9DaG9yZDogQ2hvcmRcbiAgICAqICAgQHJldHVybjogdGVuc2lvbiB2YWx1ZSBiZXR3ZWVuIC0xIGFuZCAxXG4gICAgKi9cbiAgICBjb25zdCB0ZW5zaW9uID0gbmV3IFRlbnNpb24oKTtcbiAgICBsZXQgd2FudGVkRnVuY3Rpb24gPSBudWxsO1xuICAgIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiUEFDXCIpIHtcbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gNSkge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcIm5vdC1kb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDQpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgIWludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiSUFDXCIpIHtcbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gNSkge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcIm5vdC1kb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDQpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIC8vIE5vdCByb290IGludmVyc2lvblxuICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIkhDXCIpIHtcbiAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPT0gNCkge1xuICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcIm5vdC1kb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJkb21pbmFudFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHByZXZDaG9yZDtcbiAgICBsZXQgcHJldlByZXZDaG9yZDtcbiAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IE1hdGgubWF4KC4uLk9iamVjdC5rZXlzKGRpdmlzaW9uZWROb3RlcykubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpKTtcbiAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZSB8IG51bGw+ID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdO1xuICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbl0gfHwgW10pKSB7XG4gICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgcHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgfVxuICAgIGNvbnN0IHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICB0bXAgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG4gICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKSkge1xuICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgIHByZXZQcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICB9XG4gICAgY29uc3QgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgIGlmICghcHJldkNob3JkKSB7XG4gICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgIH1cblxuICAgIGxldCBhbGxzYW1lID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIXBhc3NlZEZyb21Ob3Rlc1tpXSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2UGFzc2VkRnJvbU5vdGVzW2ldKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBhc3NlZEZyb21Ob3Rlc1tpXS5lcXVhbHModG9Ob3Rlc1tpXSkpIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldlBhc3NlZEZyb21Ob3Rlc1tpXS5lcXVhbHModG9Ob3Rlc1tpXSkpIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChhbGxzYW1lKSB7XG4gICAgICAgIHRlbnNpb24uYWxsTm90ZXNTYW1lID0gMTAwO1xuICAgIH1cblxuICAgIGxldCBmcm9tTm90ZXM7XG4gICAgaWYgKHBhc3NlZEZyb21Ob3Rlcy5sZW5ndGggPCA0KSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHRvTm90ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnJvbU5vdGVzID0gcGFzc2VkRnJvbU5vdGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmVzID0gZnJvbU5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuXG4gICAgLy8gSWYgdGhlIG5vdGVzIGFyZSBub3QgaW4gdGhlIGN1cnJlbnQgc2NhbGUsIGluY3JlYXNlIHRoZSB0ZW5zaW9uXG4gICAgbGV0IG5vdGVzTm90SW5TY2FsZTogQXJyYXk8bnVtYmVyPiA9IFtdXG4gICAgbGV0IG5ld1NjYWxlOiBOdWxsYWJsZTxTY2FsZT4gPSBudWxsO1xuICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTJcbiAgICBpZiAoY3VycmVudFNjYWxlKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlU2VtaXRvbmVzID0gY3VycmVudFNjYWxlLm5vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgICAgICBub3Rlc05vdEluU2NhbGUgPSB0b1NlbWl0b25lcy5maWx0ZXIoc2VtaXRvbmUgPT4gIXNjYWxlU2VtaXRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSk7XG4gICAgICAgIG5vdGVzTm90SW5TY2FsZSA9IG5vdGVzTm90SW5TY2FsZS5maWx0ZXIoc2VtaXRvbmUgPT4gc2VtaXRvbmUgIT0gbGVhZGluZ1RvbmUpO1xuICAgICAgICBpZiAobm90ZXNOb3RJblNjYWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFF1aWNrIHJldHVybiwgdGhpcyBjaG9yZCBzdWNrc1xuICAgICAgICAgICAgdGVuc2lvbi5ub3RJblNjYWxlICs9IDEwMFxuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgdG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tqXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAyKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMC41O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSA2KSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMS41O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgnc2Vjb25kJykgfHwgKHByZXZJbnZlcnNpb25OYW1lIHx8IFwiXCIpLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGZyb21TZW1pdG9uZSAtIHRvU2VtaXRvbmUpID4gMikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMixcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSxcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsXG4gICAgfVxuXG4gICAgbGV0IHBvc3NpYmxlVG9GdW5jdGlvbnMgPSB7XG4gICAgICAgICd0b25pYyc6IHRydWUsXG4gICAgICAgICdzdWItZG9taW5hbnQnOiB0cnVlLFxuICAgICAgICAnZG9taW5hbnQnOiB0cnVlLFxuICAgIH1cbiAgICBjb25zdCB0b1NjYWxlSW5kZXhlcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gc2VtaXRvbmVTY2FsZUluZGV4W25vdGUuc2VtaXRvbmVdKTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlSW5kZXggb2YgdG9TY2FsZUluZGV4ZXMpIHtcbiAgICAgICAgaWYgKHNjYWxlSW5kZXggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gZmFsc2U7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zWydzdWItZG9taW5hbnQnXSA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFbMCwgMSwgMywgNV0uaW5jbHVkZXMoc2NhbGVJbmRleCkpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnNbXCJzdWItZG9taW5hbnRcIl0gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVsxLCAzLCA0LCA2XS5pbmNsdWRlcyhzY2FsZUluZGV4KSkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghWzAsIDIsIDRdLmluY2x1ZGVzKHNjYWxlSW5kZXgpKSB7XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHBvc3NpYmxlRnJvbUZ1bmN0aW9ucyA9IHtcbiAgICAgICAgJ3RvbmljJzogdHJ1ZSxcbiAgICAgICAgJ3N1Yi1kb21pbmFudCc6IHRydWUsXG4gICAgICAgICdkb21pbmFudCc6IHRydWUsXG4gICAgfVxuICAgIGNvbnN0IGZyb21TY2FsZUluZGV4ZXMgPSBmcm9tTm90ZXMubWFwKG5vdGUgPT4gc2VtaXRvbmVTY2FsZUluZGV4W25vdGUuc2VtaXRvbmVdKTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlSW5kZXggb2YgZnJvbVNjYWxlSW5kZXhlcykge1xuICAgICAgICBpZiAoc2NhbGVJbmRleCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlRnJvbUZ1bmN0aW9ucy50b25pYyA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zc2libGVGcm9tRnVuY3Rpb25zWydzdWItZG9taW5hbnQnXSA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zc2libGVGcm9tRnVuY3Rpb25zLmRvbWluYW50ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShbMCwgMSwgMywgNV0uaW5jbHVkZXMoc2NhbGVJbmRleCkpKSB7XG4gICAgICAgICAgICBwb3NzaWJsZUZyb21GdW5jdGlvbnNbXCJzdWItZG9taW5hbnRcIl0gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShbMSwgMywgNCwgNl0uaW5jbHVkZXMoc2NhbGVJbmRleCkpKSB7XG4gICAgICAgICAgICBwb3NzaWJsZUZyb21GdW5jdGlvbnMuZG9taW5hbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShbMCwgMiwgNF0uaW5jbHVkZXMoc2NhbGVJbmRleCkpKSB7XG4gICAgICAgICAgICBwb3NzaWJsZUZyb21GdW5jdGlvbnMudG9uaWMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgaWYgKHdhbnRlZEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcInN1Yi1kb21pbmFudFwiKSB7XG4gICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnNbXCJzdWItZG9taW5hbnRcIl0pIHsvLyAmJiAhcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwiZG9taW5hbnRcIikge1xuICAgICAgICAgICAgaWYgKCFwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50KSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAod2FudGVkRnVuY3Rpb24gPT0gXCJ0b25pY1wiKSB7XG4gICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnMudG9uaWMpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcIm5vdC1kb21pbmFudFwiKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zc2libGVGcm9tRnVuY3Rpb25zLnRvbmljID09IGZhbHNlICYmIHdhbnRlZEZ1bmN0aW9uICE9IFwidG9uaWNcIiAmJiBwcmV2Q2hvcmQpIHtcbiAgICAgICAgbGV0IHByZXZJbmRleDEgPSBzZW1pdG9uZVNjYWxlSW5kZXhbcHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lXTtcbiAgICAgICAgbGV0IHByZXZJbmRleDIgPSBzZW1pdG9uZVNjYWxlSW5kZXhbcHJldkNob3JkLm5vdGVzWzFdLnNlbWl0b25lXTtcbiAgICAgICAgbGV0IHByZXZJbmRleDMgPSBzZW1pdG9uZVNjYWxlSW5kZXhbcHJldkNob3JkLm5vdGVzWzJdLnNlbWl0b25lXTtcbiAgICAgICAgbGV0IHByZXZJbmRleDQgPSBzZW1pdG9uZVNjYWxlSW5kZXhbKHByZXZDaG9yZC5ub3Rlc1szXSB8fCB7fSkuc2VtaXRvbmVdO1xuXG4gICAgICAgIC8vIENob2ljZXM6IDQgbW92ZXMgdXAsIDMgYW5kIDQgbW92ZSB1cCwgMiwgMywgYW5kIDQgbW92ZSB1cCwgMSwgMiwgMywgYW5kIDQgbW92ZSB1cFxuICAgICAgICAvLyBDaGVjayBhbGxcbiAgICAgICAgbGV0IGlzR29vZCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoaXNHb29kID09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zdCB0b1NjYWxlSW5kZXhlcyA9IHRvU2VtaXRvbmVzLm1hcChzZW1pdG9uZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbc2VtaXRvbmVdKTtcbiAgICAgICAgICAgIGxldCBhbGxvd2VkSW5kZXhlczogbnVtYmVyW107XG4gICAgICAgICAgICBpZiAocHJldkluZGV4NCkge1xuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gW3ByZXZJbmRleDEsIHByZXZJbmRleDIsIHByZXZJbmRleDMsIHByZXZJbmRleDRdXG4gICAgICAgICAgICAgICAgaWYgKHRvU2NhbGVJbmRleGVzLmV2ZXJ5KGluZGV4ID0+IGFsbG93ZWRJbmRleGVzLmluY2x1ZGVzKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxvd2VkSW5kZXhlcyA9IFtwcmV2SW5kZXgxLCAocHJldkluZGV4MiArIDEpICUgNywgKHByZXZJbmRleDMgKyAxKSAlIDcsIChwcmV2SW5kZXg0ICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxvd2VkSW5kZXhlcyA9IFsocHJldkluZGV4MSArIDEpICUgNywgKHByZXZJbmRleDIgKyAxKSAlIDcsIChwcmV2SW5kZXgzICsgMSkgJSA3LCAocHJldkluZGV4NCArIDEpICUgN11cbiAgICAgICAgICAgICAgICBpZiAodG9TY2FsZUluZGV4ZXMuZXZlcnkoaW5kZXggPT4gYWxsb3dlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgICAgICBpc0dvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsb3dlZEluZGV4ZXMgPSBbcHJldkluZGV4MSwgcHJldkluZGV4MiwgKHByZXZJbmRleDMgKyAxKSAlIDcsIChwcmV2SW5kZXg0ICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxvd2VkSW5kZXhlcyA9IFtwcmV2SW5kZXgxLCBwcmV2SW5kZXgyLCBwcmV2SW5kZXgzLCAocHJldkluZGV4NCArIDEpICUgN11cbiAgICAgICAgICAgICAgICBpZiAodG9TY2FsZUluZGV4ZXMuZXZlcnkoaW5kZXggPT4gYWxsb3dlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgICAgICBpc0dvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gW3ByZXZJbmRleDEsIHByZXZJbmRleDIsIHByZXZJbmRleDNdXG4gICAgICAgICAgICAgICAgaWYgKHRvU2NhbGVJbmRleGVzLmV2ZXJ5KGluZGV4ID0+IGFsbG93ZWRJbmRleGVzLmluY2x1ZGVzKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNHb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gW3ByZXZJbmRleDEsIChwcmV2SW5kZXgyICsgMSkgJSA3LCAocHJldkluZGV4MyArIDEpICUgN11cbiAgICAgICAgICAgICAgICBpZiAodG9TY2FsZUluZGV4ZXMuZXZlcnkoaW5kZXggPT4gYWxsb3dlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgICAgICBpc0dvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsb3dlZEluZGV4ZXMgPSBbKHByZXZJbmRleDEgKyAxKSAlIDcsIChwcmV2SW5kZXgyICsgMSkgJSA3LCAocHJldkluZGV4MyArIDEpICUgN11cbiAgICAgICAgICAgICAgICBpZiAodG9TY2FsZUluZGV4ZXMuZXZlcnkoaW5kZXggPT4gYWxsb3dlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaXNHb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFsbG93ZWRJbmRleGVzID0gW3ByZXZJbmRleDEsIHByZXZJbmRleDIsIChwcmV2SW5kZXgzICsgMSkgJSA3XVxuICAgICAgICAgICAgICAgIGlmICh0b1NjYWxlSW5kZXhlcy5ldmVyeShpbmRleCA9PiBhbGxvd2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uZm91cnRoRG93bkNob3JkUHJvZ3Jlc3Npb24gKz0gMTAwOyAgLy8gRklYTUUgc29tZXRpbWVzIG9rXG4gICAgICAgICAgICAgICAgICAgIGlzR29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNHb29kKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbGVhZGluZ1RvbmVTZW1pdG9uZSA9IGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSArIDExO1xuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmUgJSAxMiA9PSBsZWFkaW5nVG9uZVNlbWl0b25lKSB7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZXNbaV0gIT0gZnJvbUdsb2JhbFNlbWl0b25lICsgMSkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24ubGVhZGluZ1RvbmVVcCArPSAxMDtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAxIHx8IGkgPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBub3QgYXMgYmFkXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubGVhZGluZ1RvbmVVcCAtPSA3O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBsZWFkaW5nVG9uZUNvdW50ID0gMDtcbiAgICBmb3IgKGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgb2YgdG9HbG9iYWxTZW1pdG9uZXMpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVJbmRleDogbnVtYmVyID0gc2VtaXRvbmVTY2FsZUluZGV4Wyh0b0dsb2JhbFNlbWl0b25lICsgMTIpICUgMTJdO1xuICAgICAgICBpZiAoc2NhbGVJbmRleCA9PSA2KSB7XG4gICAgICAgICAgICBsZWFkaW5nVG9uZUNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxlYWRpbmdUb25lQ291bnQgPiAxKSB7XG4gICAgICAgIHRlbnNpb24uZG91YmxlTGVhZGluZ1RvbmUgKz0gMTA7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZGlyZWN0aW9uc1xuICAgIGNvbnN0IGRpcmVjdGlvbkNvdW50cyA9IHtcbiAgICAgICAgXCJ1cFwiOiAwLFxuICAgICAgICBcImRvd25cIjogMCxcbiAgICAgICAgXCJzYW1lXCI6IDAsXG4gICAgfVxuICAgIGxldCByb290QmFzc0RpcmVjdGlvbiA9IG51bGw7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICBjb25zdCBkaWZmID0gdG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZTtcbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMudXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLnNhbWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiAhPSAwICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICByb290QmFzc0RpcmVjdGlvbiA9IGRpZmYgPiAwID8gJ3VwJyA6ICdkb3duJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJvb3QgYmFzcyBtYWtlcyB1cCBmb3Igb25lIHVwL2Rvd25cbiAgICBpZiAocm9vdEJhc3NEaXJlY3Rpb24gPT0gXCJ1cFwiICYmIGRpcmVjdGlvbkNvdW50cy5kb3duID4gMCkge1xuICAgICAgICBkaXJlY3Rpb25Db3VudHMuZG93biAtPSAxO1xuICAgIH1cbiAgICBpZiAocm9vdEJhc3NEaXJlY3Rpb24gPT0gXCJkb3duXCIgJiYgZGlyZWN0aW9uQ291bnRzLnVwID4gMCkge1xuICAgICAgICBkaXJlY3Rpb25Db3VudHMudXAgLT0gMTtcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbkNvdW50cy51cCA+IDIgJiYgZGlyZWN0aW9uQ291bnRzLmRvd24gPCAxKSB7XG4gICAgICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDEwO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLmRvd24gPiAyICYmIGRpcmVjdGlvbkNvdW50cy51cCA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMTA7XG4gICAgfVxuXG4gICAgLy8gUGFyYWxsZWwgbW90aW9uIGFuZCBoaWRkZW4gZmlmdGhzXG4gICAgZm9yIChsZXQgaT0wOyBpPHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGo9aSsxOyBqPHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSA9PSB0b0dsb2JhbFNlbWl0b25lc1tpXSAmJiBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdID09IHRvR2xvYmFsU2VtaXRvbmVzW2pdKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWxGcm9tID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgaWYgKGludGVydmFsIDwgMjAgJiYgaW50ZXJ2YWwgJSAxMiA9PSA3IHx8IGludGVydmFsICUgMTIgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFBvc3NpYmx5IGEgcGFyYWxsZWwsIGNvbnRyYXJ5IG9yIGhpZGRlbiBmaWZ0aC9vY3RhdmVcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gaW50ZXJ2YWxGcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgaW50ZXJ2YWwgaXMgaGlkZGVuXG4gICAgICAgICAgICAgICAgY29uc3QgcGFydElEaXJlY3Rpb24gPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgcGFydEpEaXJlY3Rpb24gPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdIC0gdG9HbG9iYWxTZW1pdG9uZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHBhcnRKRGlyZWN0aW9uKSA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBwZXIgcGFydCBpcyBtYWtpbmcgYSBqdW1wXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0SURpcmVjdGlvbiA8IDAgJiYgcGFydEpEaXJlY3Rpb24gPCAwIHx8IHBhcnRJRGlyZWN0aW9uID4gMCAmJiBwYXJ0SkRpcmVjdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNwYWNpbmcgZXJyb3JzXG4gICAgY29uc3QgcGFydDBUb1BhcnQxID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1sxXSk7XG4gICAgY29uc3QgcGFydDFUb1BhcnQyID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMV0gLSB0b0dsb2JhbFNlbWl0b25lc1syXSk7XG4gICAgY29uc3QgcGFydDJUb1BhcnQzID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMl0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSk7XG4gICAgaWYgKHBhcnQxVG9QYXJ0MiA+IDEyIHx8IHBhcnQwVG9QYXJ0MSA+IDEyIHx8IHBhcnQyVG9QYXJ0MyA+ICgxMiArIDcpKSB7XG4gICAgICAgIHRlbnNpb24uc3BhY2luZ0Vycm9yICs9IDEwO1xuICAgIH1cblxuICAgIC8vIE92ZXJsYXBwaW5nIGVycm9yXG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgdXBwZXJQYXJ0VG9HbG9iYWxTZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ktMV07XG4gICAgICAgIGNvbnN0IGxvd2VyUGFydFRvR2xvYmFsU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpKzFdO1xuICAgICAgICBpZiAodXBwZXJQYXJ0VG9HbG9iYWxTZW1pdG9uZSAhPSB1bmRlZmluZWQgJiYgZnJvbUdsb2JhbFNlbWl0b25lID4gdXBwZXJQYXJ0VG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gVXBwZXIgcGFydCBpcyBtb3ZpbmcgbG93ZXIgdGhhbiB3aGVyZSBsb3dlciBwYXJ0IHVzZWQgdG8gYmVcbiAgICAgICAgICAgIHRlbnNpb24ub3ZlcmxhcHBpbmcgKz0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvd2VyUGFydFRvR2xvYmFsU2VtaXRvbmUgIT0gdW5kZWZpbmVkICYmIGZyb21HbG9iYWxTZW1pdG9uZSA8IGxvd2VyUGFydFRvR2xvYmFsU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIC8vIExvd2VyIHBhcnQgaXMgbW92aW5nIGhpZ2hlciB0aGFuIHdoZXJlIHVwcGVyIHBhcnQgdXNlZCB0byBiZVxuICAgICAgICAgICAgdGVuc2lvbi5vdmVybGFwcGluZyArPSAxMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lbG9keSB0ZW5zaW9uXG4gICAgLy8gQXZvaWQganVtcHMgdGhhdCBhcmUgYXVnIG9yIDd0aCBvciBoaWdoZXJcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC4yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSAxMCkgeyAgLy8gN3RoID09IDEwXG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTA7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNiB8fCBpbnRlcnZhbCA9PSA4KSAvLyB0cml0b25lIChhdWcgNHRoKSBvciBhdWcgNXRoXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA1O1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDcpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDkpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAwIHByaWltaVxuICAgIC8vIDEgcGllbmkgc2VrdW50aVxuICAgIC8vIDIgc3V1cmkgc2VrdW50aVxuICAgIC8vIDMgcGllbmkgdGVyc3NpXG4gICAgLy8gNCBzdXVyaSB0ZXJzc2lcbiAgICAvLyA1IGt2YXJ0dGlcbiAgICAvLyA2IHRyaXRvbnVzXG4gICAgLy8gNyBrdmludHRpXG4gICAgLy8gOCBwaWVuaSBzZWtzdGlcbiAgICAvLyA5IHN1dXJpIHNla3N0aVxuICAgIC8vIDEwIHBpZW5pIHNlcHRpbWlcbiAgICAvLyAxMSBzdXVyaSBzZXB0aW1pXG4gICAgLy8gMTIgb2t0YWF2aVxuXG4gICAgLy8gV2FzIHRoZXJlIGEganVtcCBiZWZvcmU/XG4gICAgaWYgKHByZXZQYXNzZWRGcm9tTm90ZXMgJiYgcHJldlBhc3NlZEZyb21Ob3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICBjb25zdCBwcmV2RnJvbUdsb2JhbFNlbWl0b25lcyA9IHByZXZQYXNzZWRGcm9tTm90ZXMubWFwKChuKSA9PiBnbG9iYWxTZW1pdG9uZShuKSk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHByZXZGcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMykge1xuICAgICAgICAgICAgICAgIC8vIFRoZXJlIHdhcyBhIGp1bXAuIFdFIE1VU1QgR08gQkFDSyFcbiAgICAgICAgICAgICAgICAvLyBCYXNpY2FsbHkgdGhlIHRvR2xvYmFsU2VtaXRvbmUgbXVzdCBiZSBiZXR3ZWVuIHRoZSBwcmV2RnJvbUdsb2JhbFNlbWl0b25lIGFuZCB0aGUgZnJvbUdsb2JhbFNlbWl0b25lXG4gICAgICAgICAgICAgICAgLy8gVU5MRVNTIHdlJ3JlIG91dGxpbmluZyBhIHRyaWFkLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd291bGQgbWVhbiB0aGF0IGFmdGVyIGEgNHRoIHVwLCB3ZSBuZWVkIHRvIGdvIHVwIGFub3RoZXIgM3JkXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldkZyb21TZW1pdG9uZSA9IHByZXZGcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbk11bHRpcGxpZXIgPSBmcm9tU2VtaXRvbmUgPiBwcmV2RnJvbVNlbWl0b25lID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRJbnRlcnZhbCA9IGRpcmVjdGlvbk11bHRpcGxpZXIgKiAodG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBtYWogdGhpcmQgdXAuIFRoYXQncyBhIHJvb3QgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtaW5vciAzcmQgdXAsIHRoZW4gcGVyZmVjdCA0dGggdXAuIFRoYXQncyBhIGZpcnN0IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWFqb3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ham9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwZXJmZWN0IDR0aCB1cCwgdGhlbiBtaW5vciAzcmQgdXAuIFRoYXQncyBhIHNlY29uZCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1ham9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGlnaGVyIHRoYW4gdGhhdCwgbm8gdHJpYWQgaXMgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgaWYgKChmcm9tU2VtaXRvbmUgPj0gcHJldkZyb21TZW1pdG9uZSAmJiB0b1NlbWl0b25lID49IGZyb21TZW1pdG9uZSkgfHwgKGZyb21TZW1pdG9uZSA8PSBwcmV2RnJvbVNlbWl0b25lICYmIHRvU2VtaXRvbmUgPD0gZnJvbVNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3QgZ29pbmYgYmFjayBkb3duL3VwLi4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludGVydmFsIDw9IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxOyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwOyAgLy8gVGVycmlibGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGJhY2sgZG93bi91cC4uLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrSW50ZXJ2YWwgPSBNYXRoLmFicyh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhY2tJbnRlcnZhbCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvaW5nIGJhY2sgdG9vIGZhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludGVydmFsIDw9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlICBpZiAoaW50ZXJ2YWwgPD0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxOyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTA7ICAvLyBUZXJyaWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IHRvR2xvYmFsU2VtaXRvbmUgLSBmcm9tR2xvYmFsU2VtaXRvbmU7XG4gICAgICAgICAgICBjb25zdCBiYXNlTm90ZSA9IHBhcmFtcy5wYXJ0c1tpXS5ub3RlIHx8IFwiRjRcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShiYXNlTm90ZSkpXG4gICAgICAgICAgICBjb25zdCBzZW1pdG9uZUxpbWl0ID0gW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmUgKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmUgKyAxMl1cblxuICAgICAgICAgICAgbGV0IHRhcmdldE5vdGUgPSBzZW1pdG9uZUxpbWl0WzFdIC0gNDtcbiAgICAgICAgICAgIHRhcmdldE5vdGUgLT0gaSAqIDI7XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXROb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChjb25zdCBkaXZpc2lvbiBpbiBkaXZpc2lvbmVkTm90ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3RlcyA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl07XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwcmV2Tm90ZSBvZiBub3Rlcy5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTZW1pdG9uZShwcmV2Tm90ZS5ub3RlKSA9PSB0YXJnZXROb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb3RlUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFyZ2V0Tm90ZVJlYWNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZSAtIHRhcmdldE5vdGUpIDwgMikge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyB0aGVyZSBhbnkgbW9yZVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0ZW5zaW9uO1xufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zLCBuZXh0R1RvbmVJblNjYWxlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc2VtaXRvbmVTY2FsZUluZGV4LCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG50eXBlIE5vbkNob3JkVG9uZSA9IHtcbiAgICBub3RlOiBOb3RlLFxuICAgIHN0cm9uZ0JlYXQ6IGJvb2xlYW4sXG4gICAgcmVwbGFjZW1lbnQ/OiBib29sZWFuLFxufVxuXG50eXBlIE5vbkNob3JkVG9uZVBhcmFtcyA9IHtcbiAgICBnVG9uZTA6IG51bWJlcixcbiAgICBnVG9uZTE6IG51bWJlcixcbiAgICBnVG9uZTI6IG51bWJlcixcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgZ1RvbmVMaW1pdHM6IG51bWJlcltdLFxufVxuXG5cbmNvbnN0IGFkZE5vdGVCZXR3ZWVuID0gKG5hYzogTm9uQ2hvcmRUb25lLCBkaXZpc2lvbjogbnVtYmVyLCBuZXh0RGl2aXNpb246IG51bWJlciwgcGFydEluZGV4OiBudW1iZXIsIGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3Rlcyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGRpdmlzaW9uRGlmZiA9IG5leHREaXZpc2lvbiAtIGRpdmlzaW9uO1xuICAgIGNvbnN0IGJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgIGlmICghYmVhdFJpY2hOb3RlIHx8ICFiZWF0UmljaE5vdGUubm90ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldlNjYWxlVG9uZXMgPSBiZWF0UmljaE5vdGUuc2NhbGUubm90ZXMubWFwKG4gPT4gbi5zZW1pdG9uZSk7XG4gICAgY29uc3QgbmV4dEJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbbmV4dERpdmlzaW9uXSB8fCBbXSkuZmlsdGVyKG5vdGUgPT4gbm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KVswXTtcbiAgICBpZiAoIW5leHRCZWF0UmljaE5vdGUgfHwgIW5leHRCZWF0UmljaE5vdGUubm90ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Tm90ZSA9IG5hYy5ub3RlO1xuICAgIGNvbnN0IHN0cm9uZ0JlYXQgPSBuYWMuc3Ryb25nQmVhdDtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG5hYy5yZXBsYWNlbWVudCB8fCBmYWxzZTtcblxuICAgIC8vIElmIHN0cm9uZyBiZWF0LCB3ZSBhZGQgbmV3Tm90ZSBCRUZPUkUgYmVhdFJpY2hOb3RlXG4gICAgLy8gT3RoZXJ3aXNlIHdlIGFkZCBuZXdOb3RlIEFGVEVSIGJlYXRSaWNoTm90ZVxuXG4gICAgaWYgKHN0cm9uZ0JlYXQpIHtcbiAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDIsXG4gICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBuZXcgdG9uZSB0byBkaXZpc2lvblxuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICAvLyBSZW1vdmUgYmVhdFJpY2hOb3RlIGZyb20gZGl2aXNpb25cbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0uZmlsdGVyKG5vdGUgPT4gbm90ZSAhPSBiZWF0UmljaE5vdGUpO1xuICAgICAgICBpZiAoIXJlcGxhY2VtZW50KSB7XG4gICAgICAgICAgICAvLyBBZGQgYmVhdFJpY2hOb3RlIHRvIGRpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMlxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChiZWF0UmljaE5vdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWRkIG5ldyB0b25lIGFsc28gdG8gZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgfVxuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuY29uc3QgcGFzc2luZ1RvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBhIG5ldyBnVG9uZSBvciBudWxsLCBiYXNlZCBvbiB3aGV0aGVyIGFkZGluZyBhIHBhc3NpbmcgdG9uZSBpcyBhIGdvb2QgaWRlYS5cbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKGdUb25lMSAtIGdUb25lMik7XG4gICAgaWYgKGRpc3RhbmNlIDwgMyB8fCBkaXN0YW5jZSA+IDQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlVG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobiA9PiBuLnNlbWl0b25lKTtcbiAgICBmb3IgKGxldCBnVG9uZT1nVG9uZTE7IGdUb25lICE9IGdUb25lMjsgZ1RvbmUgKz0gKGdUb25lMSA8IGdUb25lMiA/IDEgOiAtMSkpIHtcbiAgICAgICAgaWYgKGdUb25lID09IGdUb25lMSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBnVG9uZSAlIDEyO1xuICAgICAgICBpZiAoc2NhbGVUb25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmNvbnN0IG5laWdoYm9yVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCwgdGhlbiBzdGVwIGJhY2suIFRoaXMgaXMgb24gV2VhayBiZWF0XG4gICAgaWYgKGdUb25lMSAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHVwT3JEb3duQ2hvaWNlcyA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBbMSwgLTFdIDogWy0xLCAxXTtcbiAgICBmb3IgKGNvbnN0IHVwT3JEb3duIG9mIHVwT3JEb3duQ2hvaWNlcykge1xuICAgICAgICBjb25zdCBuZXdHdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCB1cE9yRG93biwgc2NhbGUpO1xuICAgICAgICBpZiAoIW5ld0d0b25lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3R3RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBuZXdHdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBuZXdHdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKG5ld0d0b25lIC8gMTIpLFxuICAgICAgICB9KSwgc3Ryb25nQmVhdDogZmFsc2V9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5jb25zdCBzdXNwZW5zaW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGF5IG9uIHByZXZpb3VzLCB0aGVuIHN0ZXAgRE9XTiBpbnRvIGNob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXQuXG4gICAgLy8gVXN1YWxseSBkb3R0ZWQhXG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTAgLSBnVG9uZTE7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgZG93bi5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7XG4gICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH1cbn1cblxuXG5jb25zdCByZXRhcmRhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RheSBvbiBwcmV2aW91cywgdGhlbiBzdGVwIFVQIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdFxuICAgIC8vIFVzdWFsbHkgZG90dGVkIVxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMSAtIGdUb25lMDtcbiAgICBpZiAoZGlzdGFuY2UgPCAxIHx8IGRpc3RhbmNlID4gMikge1xuICAgICAgICAvLyBNdXN0IGJlIGhhbGYgb3Igd2hvbGUgc3RlcCB1cC5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUwICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O31cblxuXG5jb25zdCBhcHBvZ2lhdHVyYSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gTGVhcCwgdGhlbiBzdGVwIGJhY2sgaW50byBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB1cE9yRG93biA9IC0xO1xuICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCBkb3duIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGFwcG9naWF0dXJhXG4gICAgaWYgKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgdXAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXBwb2dpYXR1cmFcbiAgICAgICAgdXBPckRvd24gPSAxO1xuICAgIH1cbiAgICBjb25zdCBnVG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCB1cE9yRG93biwgc2NhbGUpO1xuICAgIGlmICghZ1RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTtcbn1cblxuY29uc3QgZXNjYXBlVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBhd2F5LCB0aGVuIExlYXAgaW4gdG8gbmV4dCBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB1cE9yRG93biA9IDE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIHVwIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCBkb3duIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICAgICAgdXBPckRvd24gPSAtMTtcbiAgICB9XG4gICAgY29uc3QgZ1RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMCwgdXBPckRvd24sIHNjYWxlKTtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07XG59XG5cbmNvbnN0IGFudGljaXBhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBvciBsZWFwIGVhcmx5IGluIHRvIG5leHQgQ2hvcmQgdG9uZS4gVGhpcyBpcyBvbiB3ZWFrIGJlYXQuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTIgLSBnVG9uZTE7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDEpIHtcbiAgICAgICAgLy8gVG9vIGNsb3NlIHRvIGJlIGFuIGFudGljaXBhdGlvblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBFYXN5LiBKdXN0IG1ha2UgYSBuZXcgbm90ZSB0aGF0cyB0aGUgc2FtZSBhcyBnVG9uZTIuXG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTIgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMiAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogZmFsc2V9O1xufVxuXG5jb25zdCBuZWlnaGJvckdyb3VwID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIGF3YXksIHRoZW4gbGVhcCBpbnRvIHRoZSBcIm90aGVyIHBvc3NpYmxlXCIgbmVpZ2hib3IgdG9uZS4gVGhpcyB1c2VzIDE2dGhzICh0d28gbm90ZXMpLlxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmNvbnN0IHBlZGFsUG9pbnQgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFJlcGxhY2UgdGhlIGVudGlyZSBub3RlIHdpdGggdGhlIG5vdGUgdGhhdCBpcyBiZWZvcmUgaXQgQU5EIGFmdGVyIGl0LlxuICAgIGlmIChnVG9uZTAgIT0gZ1RvbmUyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUwID09IGdUb25lMSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgIC8vIEFscmVhZHkgZXhpc3RzXG4gICAgfVxuICAgIGlmIChnVG9uZTEgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZTEgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZSwgcmVwbGFjZW1lbnQ6IHRydWV9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBidWlsZFRvcE1lbG9keSA9IChkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcykgPT4ge1xuICAgIC8vIENvbnZlcnQgdHdvIDR0aCBub3RlcywgaWYgcG9zc2libGUsIHRvIHR3byA4dGggbm90ZXMuXG4gICAgY29uc3QgbGFzdERpdmlzaW9uID0gQkVBVF9MRU5HVEggKiBtYWluUGFyYW1zLmdldE1heEJlYXRzKCk7XG4gICAgY29uc3QgZmlyc3RQYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKDApO1xuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhmaXJzdFBhcmFtcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIOyBpICs9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgIGxldCBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0ID0gW1xuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzBdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1sxXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMl1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzNdXSxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbWFpblBhcmFtcy5jdXJyZW50Q2FkZW5jZVBhcmFtcyhpKTtcblxuICAgICAgICBjb25zdCBsYXN0QmVhdEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZCA8IDJcbiAgICAgICAgaWYgKGxhc3RCZWF0SW5DYWRlbmNlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgbGltaXRzLCBuZXcgbm90ZXMgbXVzdCBhbHNvIGJlIGJldHdlZWVuIHRoZSBvdGhlciBwYXJ0IG5vdGVzXG4gICAgICAgICAgICAvLyAoIE92ZXJsYXBwaW5nIClcbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZGl2aXNpb25lZE5vdGVzW2ldLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBkaXZpc2lvbmVkTm90ZXNbaSArIEJFQVRfTEVOR1RIXS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZ1RvbmUxID0gZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBnVG9uZTIgPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBtaW5HVG9uZSA9IE1hdGgubWluKGdUb25lMSwgZ1RvbmUyKTtcbiAgICAgICAgICAgIGNvbnN0IG1heEdUb25lID0gTWF0aC5tYXgoZ1RvbmUxLCBnVG9uZTIpO1xuICAgICAgICAgICAgaWYgKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV0pIHtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgaGlnaGVyIHBhcnQsIGl0IGNhbid0IGdvIGxvd2VyIHRoYW4gbWF4R1RvbmVcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdWzBdID0gTWF0aC5tYXgoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXVswXSwgbWF4R1RvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgbG93ZXIgcGFydCwgaXQgY2FuJ3QgZ28gaGlnaGVyIHRoYW4gbWluR1RvbmVcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdWzFdID0gTWF0aC5taW4oZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXVsxXSwgbWluR1RvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIC8vIElzIHRoaXMgYSBnb29kIHBhcnQgdG8gYWRkIGVpZ2h0aHM/XG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGRpdmlzaW9uZWROb3Rlc1tpXS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZGl2aXNpb25lZE5vdGVzW2kgKyBCRUFUX0xFTkdUSF0uZmlsdGVyKG5vdGUgPT4gbm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KVswXTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwcmV2UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzW2kgLSBCRUFUX0xFTkdUSF0gfHwgW10pLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgICAgICAgICBpZiAoIXByZXZSaWNoTm90ZSB8fCAhcHJldlJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2UmljaE5vdGUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZ1RvbmUxID0gZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBnVG9uZTIgPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBsZXQgZ1RvbmUwID0gcHJldlJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldlJpY2hOb3RlLm5vdGUpIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChnVG9uZTAgJiYgcHJldlJpY2hOb3RlLmR1cmF0aW9uICE9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgLy8gRklYTUU6IHByZXZSaWNoTm90ZSBpcyBub3QgdGhlIHByZXZpb3VzIG5vdGUuIFdlIGNhbm5vdCB1c2UgaXQgdG8gZGV0ZXJtaW5lIHRoZSBwcmV2aW91cyBub3RlLlxuICAgICAgICAgICAgICAgIGdUb25lMCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuYWNQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgZ1RvbmUwLFxuICAgICAgICAgICAgICAgIGdUb25lMSxcbiAgICAgICAgICAgICAgICBnVG9uZTIsXG4gICAgICAgICAgICAgICAgc2NhbGU6IHJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzOiBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleF0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub25DaG9yZFRvbmVDaG9pY2VGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgICAgICAgICBwYXNzaW5nVG9uZTogKCkgPT4gcGFzc2luZ1RvbmUobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBuZWlnaGJvclRvbmU6ICgpID0+IG5laWdoYm9yVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHN1c3BlbnNpb246ICgpID0+IHN1c3BlbnNpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICByZXRhcmRhdGlvbjogKCkgPT4gcmV0YXJkYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBhcHBvZ2lhdHVyYTogKCkgPT4gYXBwb2dpYXR1cmEobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBlc2NhcGVUb25lOiAoKSA9PiBlc2NhcGVUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgYW50aWNpcGF0aW9uOiAoKSA9PiBhbnRpY2lwYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBuZWlnaGJvckdyb3VwOiAoKSA9PiBuZWlnaGJvckdyb3VwKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcGVkYWxQb2ludDogKCkgPT4gcGVkYWxQb2ludChuYWNQYXJhbXMpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG5vbkNob3JkVG9uZUNob2ljZXM6IHtba2V5OiBzdHJpbmddOiBOb25DaG9yZFRvbmV9ID0ge31cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmcgPSBwYXJhbXMubm9uQ2hvcmRUb25lc1trZXldO1xuICAgICAgICAgICAgICAgIGlmICghc2V0dGluZyB8fCAhc2V0dGluZy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2UgPSBub25DaG9yZFRvbmVDaG9pY2VGdW5jc1trZXldKCk7XG4gICAgICAgICAgICAgICAgaWYgKGNob2ljZSkge1xuICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVDaG9pY2VzW2tleV0gPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFydEluZGV4ICE9IDMpIHtcbiAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVDaG9pY2VzLnBlZGFsUG9pbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbm9uQ2hvcmRUb25lID0gbnVsbDtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBub25DaG9yZFRvbmVDaG9pY2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmUgPSBub25DaG9yZFRvbmVDaG9pY2VzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbm9uQ2hvcmRUb25lKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGFkZE5vdGVCZXR3ZWVuKG5vbkNob3JkVG9uZSwgaSwgaSArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgsIGRpdmlzaW9uZWROb3Rlcyk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlLCBTZW1pdG9uZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcblxuZXhwb3J0IGNvbnN0IEJFQVRfTEVOR1RIID0gMTI7XG5cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lRGlzdGFuY2UgPSAodG9uZTE6IG51bWJlciwgdG9uZTI6IG51bWJlcikgPT4ge1xuICAgIC8vIGRpc3RhbmNlIGZyb20gMCB0byAxMSBzaG91bGQgYmUgMVxuICAgIC8vIDAgLSAxMSArIDEyID0+IDFcbiAgICAvLyAxMSAtIDAgKyAxMiA9PiAyMyA9PiAxMVxuXG4gICAgLy8gMCAtIDYgKyAxMiA9PiA2XG4gICAgLy8gNiAtIDAgKyAxMiA9PiAxOCA9PiA2XG5cbiAgICAvLyAwICsgNiAtIDMgKyA2ID0gNiAtIDkgPSAtM1xuICAgIC8vIDYgKyA2IC0gOSArIDYgPSAxMiAtIDE1ID0gMCAtIDMgPSAtM1xuICAgIC8vIDExICsgNiAtIDAgKyA2ID0gMTcgLSA2ID0gNSAtIDYgPSAtMVxuICAgIC8vIDAgKyA2IC0gMTEgKyA2ID0gNiAtIDE3ID0gNiAtIDUgPSAxXG5cbiAgICAvLyAoNiArIDYpICUgMTIgPSAwXG4gICAgLy8gKDUgKyA2KSAlIDEyID0gMTFcbiAgICAvLyBSZXN1bHQgPSAxMSEhISFcblxuICAgIHJldHVybiBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5hYnModG9uZTEgLSB0b25lMiksXG4gICAgICAgIE1hdGguYWJzKCh0b25lMSArIDYpICUgMTIgLSAodG9uZTIgKyA2KSAlIDEyKVxuICAgICk7XG59XG5cbmV4cG9ydCBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXggPSAoc2NhbGU6IFNjYWxlKTogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9PiAoe1xuICAgIFtzY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsXG4gICAgW3NjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSxcbiAgICBbc2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLFxuICAgIFtzY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsXG4gICAgW3NjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCxcbiAgICBbc2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LFxuICAgIFtzY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsXG59KVxuXG5cbmV4cG9ydCBjb25zdCBuZXh0R1RvbmVJblNjYWxlID0gKGdUb25lOiBTZW1pdG9uZSwgaW5kZXhEaWZmOiBudW1iZXIsIHNjYWxlOiBTY2FsZSk6IE51bGxhYmxlPG51bWJlcj4gPT4ge1xuICAgIGxldCBnVG9uZTEgPSBnVG9uZTtcbiAgICBjb25zdCBzY2FsZUluZGV4ZXMgPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpXG4gICAgbGV0IHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSArIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgZ1RvbmUxID0gZ1RvbmUgLSAxO1xuICAgICAgICBzY2FsZUluZGV4ID0gc2NhbGVJbmRleGVzW2dUb25lMSAlIDEyXTtcbiAgICB9XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuZXdTY2FsZUluZGV4ID0gKHNjYWxlSW5kZXggKyBpbmRleERpZmYpICUgNztcbiAgICBjb25zdCBuZXdTZW1pdG9uZSA9IHNjYWxlLm5vdGVzW25ld1NjYWxlSW5kZXhdLnNlbWl0b25lO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gc2VtaXRvbmVEaXN0YW5jZShnVG9uZTEgJSAxMiwgbmV3U2VtaXRvbmUpO1xuICAgIGNvbnN0IG5ld0d0b25lID0gZ1RvbmUxICsgKGRpc3RhbmNlICogKGluZGV4RGlmZiA+IDAgPyAxIDogLTEpKTtcblxuICAgIHJldHVybiBuZXdHdG9uZTtcbn1cblxuXG5leHBvcnQgY29uc3Qgc3RhcnRpbmdOb3RlcyA9IChwYXJhbXM6IE11c2ljUGFyYW1zKSA9PiB7ICBcbiAgICBjb25zdCBwMU5vdGUgPSBwYXJhbXMucGFydHNbMF0ubm90ZSB8fCBcIkY0XCI7XG4gICAgY29uc3QgcDJOb3RlID0gcGFyYW1zLnBhcnRzWzFdLm5vdGUgfHwgXCJDNFwiO1xuICAgIGNvbnN0IHAzTm90ZSA9IHBhcmFtcy5wYXJ0c1syXS5ub3RlIHx8IFwiQTNcIjtcbiAgICBjb25zdCBwNE5vdGUgPSBwYXJhbXMucGFydHNbM10ubm90ZSB8fCBcIkMzXCI7XG5cbiAgICBjb25zdCBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyA9IFtcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDFOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAyTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwM05vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDROb3RlKSksXG4gICAgXVxuXG4gICAgY29uc3Qgc2VtaXRvbmVMaW1pdHMgPSBbXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1swXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMF0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzFdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1syXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbM10gKyAxMiAtIDVdLFxuICAgIF1cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyxcbiAgICAgICAgc2VtaXRvbmVMaW1pdHMsXG4gICAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBnVG9uZVN0cmluZyA9IChnVG9uZTogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgIH0pLnRvU3RyaW5nKClcbn1cblxuXG5leHBvcnQgY29uc3QgYXJyYXlPcmRlckJ5ID0gZnVuY3Rpb24gKGFycmF5OiBBcnJheTxhbnk+LCBzZWxlY3RvcjogQ2FsbGFibGVGdW5jdGlvbiwgZGVzYyA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIFsuLi5hcnJheV0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBhID0gc2VsZWN0b3IoYSk7XG4gICAgICAgIGIgPSBzZWxlY3RvcihiKTtcblxuICAgICAgICBpZiAoYSA9PSBiKSByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIChkZXNjID8gYSA+IGIgOiBhIDwgYikgPyAtMSA6IDE7XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGNob3JkVGVtcGxhdGVzOiB7IFtrZXk6IHN0cmluZ106IEFycmF5PG51bWJlcj4gfSA9IHtcbiAgICBtYWo6IFswLCA0LCA3XSxcbiAgICBtaW46IFswLCAzLCA3XSxcbiAgICBkaW06IFswLCAzLCA2XSxcbiAgICBhdWc6IFswLCA0LCA4XSxcbiAgICBtYWo3OiBbMCwgNCwgNywgMTFdLFxuICAgIG1pbjc6IFswLCAzLCA3LCAxMF0sXG4gICAgZG9tNzogWzAsIDQsIDcsIDEwXSxcbiAgICBzdXMyOiBbMCwgMiwgN10sXG4gICAgc3VzNDogWzAsIDUsIDddLFxufVxuXG5cbmV4cG9ydCBjbGFzcyBDaG9yZCB7XG4gICAgcHVibGljIG5vdGVzOiBBcnJheTxOb3RlPjtcbiAgICBwdWJsaWMgcm9vdDogbnVtYmVyO1xuICAgIHB1YmxpYyBjaG9yZFR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIC8vIEZpbmQgY29ycmVjdCBTZW1pdG9uZSBrZXlcbiAgICAgICAgY29uc3Qgc2VtaXRvbmVLZXlzID0gT2JqZWN0LmtleXMoU2VtaXRvbmUpLmZpbHRlcihrZXkgPT4gKFNlbWl0b25lIGFzIGFueSlba2V5XSBhcyBudW1iZXIgPT09IHRoaXMubm90ZXNbMF0uc2VtaXRvbmUpO1xuICAgICAgICBpZiAoc2VtaXRvbmVLZXlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnRvU3RyaW5nKCkpLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VtaXRvbmVLZXkgPSBzZW1pdG9uZUtleXMuZmlsdGVyKGtleSA9PiBrZXkuaW5kZXhPZignYicpID09IC0xICYmIGtleS5pbmRleE9mKCdzJykgPT0gLTEpWzBdIHx8IHNlbWl0b25lS2V5c1swXTtcbiAgICAgICAgc2VtaXRvbmVLZXkgPSBzZW1pdG9uZUtleS5yZXBsYWNlKCdzJywgJyMnKTtcbiAgICAgICAgcmV0dXJuIHNlbWl0b25lS2V5ICsgdGhpcy5jaG9yZFR5cGU7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHNlbWl0b25lT3JOYW1lOiBudW1iZXIgfCBzdHJpbmcsIGNob3JkVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBzZW1pdG9uZTtcbiAgICAgICAgaWYgKHR5cGVvZiBzZW1pdG9uZU9yTmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgc2VtaXRvbmUgPSBzZW1pdG9uZU9yTmFtZS5tYXRjaCgvXlxcZCsvKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSBzZW1pdG9uZU9yTmFtZS5tYXRjaCgvXlxcZCsoLiopLyk7XG4gICAgICAgICAgICBpZiAoc2VtaXRvbmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBjaG9yZCBuYW1lIFwiICsgc2VtaXRvbmVPck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyc2VkVHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGNob3JkIG5hbWUgXCIgKyBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbWl0b25lID0gcGFyc2VJbnQoc2VtaXRvbmVbMF0pO1xuICAgICAgICAgICAgY2hvcmRUeXBlID0gY2hvcmRUeXBlIHx8IHBhcnNlZFR5cGVbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHNlbWl0b25lT3JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdCA9IHBhcnNlSW50KGAke3NlbWl0b25lfWApO1xuICAgICAgICB0aGlzLmNob3JkVHlwZSA9IGNob3JkVHlwZTtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBjaG9yZFRlbXBsYXRlc1tjaG9yZFR5cGVdO1xuICAgICAgICBpZiAodGVtcGxhdGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVua25vd24gY2hvcmQgdHlwZTogXCIgKyBjaG9yZFR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBub3RlIG9mIHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGVzLnB1c2gobmV3IE5vdGUoe3NlbWl0b25lOiAoc2VtaXRvbmUgKyBub3RlKSAlIDEyLCBvY3RhdmU6IDF9KSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IHR5cGUgTnVsbGFibGU8VD4gPSBUIHwgbnVsbFxuXG5leHBvcnQgY2xhc3MgTWFpbk11c2ljUGFyYW1zIHtcbiAgICBiZWF0c1BlckJhcj86IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZUNvdW50PzogbnVtYmVyID0gNDtcbiAgICBjYWRlbmNlczogQXJyYXk8TXVzaWNQYXJhbXM+ID0gW107XG4gICAgdGVzdE1vZGU/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFBhcnRpYWw8TWFpbk11c2ljUGFyYW1zPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gKHBhcmFtcyBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjdXJyZW50Q2FkZW5jZVBhcmFtcyhkaXZpc2lvbjogbnVtYmVyKTogTXVzaWNQYXJhbXMge1xuICAgICAgICBjb25zdCBiZWF0ID0gTWF0aC5mbG9vcihkaXZpc2lvbiAvIEJFQVRfTEVOR1RIKTtcbiAgICAgICAgY29uc3QgYmFyID0gTWF0aC5mbG9vcihiZWF0IC8gdGhpcy5iZWF0c1BlckJhcik7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjYWRlbmNlUGFyYW1zIG9mIHRoaXMuY2FkZW5jZXMpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gY2FkZW5jZVBhcmFtcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgICAgIGlmIChiYXIgPCBjb3VudGVyKSB7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1VudGlsQ2FkZW5jZUVuZCA9IGNvdW50ZXIgKiB0aGlzLmJlYXRzUGVyQmFyIC0gYmVhdDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxTb25nRW5kID0gdGhpcy5jYWRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmJhcnNQZXJDYWRlbmNlLCAwKSAqIHRoaXMuYmVhdHNQZXJCYXIgLSBiZWF0O1xuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNQZXJCYXIgPSB0aGlzLmJlYXRzUGVyQmFyO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWRlbmNlUGFyYW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TWF4QmVhdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNVbnRpbENhZGVuY2VFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNVbnRpbFNvbmdFbmQ6IG51bWJlciA9IDA7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG5cbiAgICBiYXNlVGVuc2lvbj86IG51bWJlciA9IDAuMztcbiAgICBiYXJzUGVyQ2FkZW5jZT86IG51bWJlciA9IDJcbiAgICB0ZW1wbz86IG51bWJlciA9IDQwO1xuICAgIGhhbGZOb3Rlcz86IGJvb2xlYW4gPSB0cnVlO1xuICAgIHNpeHRlZW50aE5vdGVzPzogbnVtYmVyID0gMC4yO1xuICAgIGVpZ2h0aE5vdGVzPzogbnVtYmVyID0gMC40O1xuICAgIG1vZHVsYXRpb25XZWlnaHQ/OiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdXZWlnaHQ/OiBudW1iZXIgPSAyO1xuICAgIHBhcnRzOiBBcnJheTx7XG4gICAgICAgIHZvaWNlOiBzdHJpbmcsXG4gICAgICAgIG5vdGU6IHN0cmluZyxcbiAgICB9PiA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdm9pY2U6IFwiNDJcIixcbiAgICAgICAgICAgIG5vdGU6IFwiQzVcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdm9pY2U6IFwiNDJcIixcbiAgICAgICAgICAgIG5vdGU6IFwiQTRcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdm9pY2U6IFwiNDJcIixcbiAgICAgICAgICAgIG5vdGU6IFwiQzRcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdm9pY2U6IFwiNDJcIixcbiAgICAgICAgICAgIG5vdGU6IFwiRTNcIixcbiAgICAgICAgfVxuICAgIF07XG4gICAgYmVhdFNldHRpbmdzOiBBcnJheTx7XG4gICAgICAgIHRlbnNpb246IG51bWJlcixcbiAgICB9PiA9IFtdO1xuICAgIGNob3JkU2V0dGluZ3M6IHtba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgIH19ID0ge1xuICAgICAgICBtYWo6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIG1pbjoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZGltOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGF1Zzoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbWFqNzoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZG9tNzoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICB9XG4gICAgc2NhbGVTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXJcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgIG1ham9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBtaW5vcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHNlbGVjdGVkQ2FkZW5jZTogc3RyaW5nID0gXCJIQ1wiO1xuICAgIG5vbkNob3JkVG9uZXM6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgcGFzc2luZ1RvbmU6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIG5laWdoYm9yVG9uZToge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHN1c3BlbnNpb246IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHJldGFyZGF0aW9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICB9LFxuICAgICAgICBhcHBvZ2lhdHVyYToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBlVG9uZToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgYW50aWNpcGF0aW9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbmVpZ2hib3JHcm91cDoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgcGVkYWxQb2ludDoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgfSxcbiAgICB9XG5cblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNdXNpY1BhcmFtcz4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IChwYXJhbXMgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQmVhdFNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQmVhdFNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBiZWF0Q291bnQgPSB0aGlzLmJlYXRzUGVyQmFyICogdGhpcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA8IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aDsgaSA8IGJlYXRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRoaXMuYmFzZVRlbnNpb25cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJlYXRTZXR0aW5ncy5sZW5ndGggPiBiZWF0Q291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuYmVhdFNldHRpbmdzID0gdGhpcy5iZWF0U2V0dGluZ3Muc2xpY2UoMCwgYmVhdENvdW50KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgdHlwZSBNdXNpY1Jlc3VsdCA9IHtcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIHNjYWxlOiBTY2FsZSxcbn1cblxuZXhwb3J0IHR5cGUgUmljaE5vdGUgPSB7XG4gICAgbm90ZTogTm90ZSxcbiAgICBkdXJhdGlvbjogbnVtYmVyLFxuICAgIGZyZXE/OiBudW1iZXIsXG4gICAgY2hvcmQ/OiBDaG9yZCxcbiAgICBwYXJ0SW5kZXg/OiBudW1iZXIsXG4gICAgc2NhbGU/OiBTY2FsZSxcbiAgICBiZWFtPzogc3RyaW5nLFxuICAgIHRpZT86IHN0cmluZyxcbiAgICB0ZW5zaW9uPzogVGVuc2lvbixcbiAgICBpbnZlcnNpb25OYW1lPzogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBEaXZpc2lvbmVkUmljaG5vdGVzID0ge1xuICAgIFtrZXk6IG51bWJlcl06IEFycmF5PFJpY2hOb3RlPixcbn1cblxuZXhwb3J0IGNvbnN0IGdsb2JhbFNlbWl0b25lID0gKG5vdGU6IE5vdGUpID0+IHtcbiAgICByZXR1cm4gbm90ZS5zZW1pdG9uZSArICgobm90ZS5vY3RhdmUpICogMTIpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0Q2xvc2VzdE9jdGF2ZSA9IChub3RlOiBOb3RlLCB0YXJnZXROb3RlOiBOdWxsYWJsZTxOb3RlPiA9IG51bGwsIHRhcmdldFNlbWl0b25lOiBOdWxsYWJsZTxudW1iZXI+ID0gbnVsbCkgPT4ge1xuICAgIC8vIFxuICAgIGxldCBzZW1pdG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuICAgIHRhcmdldFNlbWl0b25lID0gdGFyZ2V0U2VtaXRvbmUgfHwgZ2xvYmFsU2VtaXRvbmUodGFyZ2V0Tm90ZSk7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZTogXCIsIHNlbWl0b25lLCB0YXJnZXRTZW1pdG9uZSk7XG4gICAgLy8gVXNpbmcgbW9kdWxvIGhlcmUgLT4gLTcgJSAxMiA9IC03XG4gICAgLy8gLTEzICUgMTIgPSAtMVxuICAgIGlmIChzZW1pdG9uZSA9PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICByZXR1cm4gbm90ZS5vY3RhdmU7XG4gICAgfVxuICAgIGNvbnN0IGRlbHRhOiBudW1iZXIgPSB0YXJnZXRTZW1pdG9uZSA+IHNlbWl0b25lID8gMTIgOiAtMTI7XG4gICAgbGV0IHJldCA9IDA7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGNsZWFuT2N0YXZlID0gKG9jdGF2ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChvY3RhdmUsIDIpLCA2KTtcbiAgICB9XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZmluaXRlIGxvb3BcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VtaXRvbmUgKz0gZGVsdGE7XG4gICAgICAgIHJldCArPSBkZWx0YSAvIDEyOyAgLy8gSG93IG1hbnkgb2N0YXZlcyB3ZSBjaGFuZ2VkXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA+PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lIC0gMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA8PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lICsgMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlQ2lyY2xlOiB7IFtrZXk6IG51bWJlcl06IEFycmF5PG51bWJlcj4gfSA9IHt9XG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DXSA9IFtTZW1pdG9uZS5HLCBTZW1pdG9uZS5GXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR10gPSBbU2VtaXRvbmUuRCwgU2VtaXRvbmUuQ11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkRdID0gW1NlbWl0b25lLkEsIFNlbWl0b25lLkddXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BXSA9IFtTZW1pdG9uZS5FLCBTZW1pdG9uZS5EXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRV0gPSBbU2VtaXRvbmUuQiwgU2VtaXRvbmUuQV1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJdID0gW1NlbWl0b25lLkZzLCBTZW1pdG9uZS5FXVxuXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5GXSA9IFtTZW1pdG9uZS5DLCBTZW1pdG9uZS5CYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJiXSA9IFtTZW1pdG9uZS5GLCBTZW1pdG9uZS5FYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkViXSA9IFtTZW1pdG9uZS5CYiwgU2VtaXRvbmUuQWJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BYl0gPSBbU2VtaXRvbmUuRWIsIFNlbWl0b25lLkRiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRGJdID0gW1NlbWl0b25lLkFiLCBTZW1pdG9uZS5HYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkdiXSA9IFtTZW1pdG9uZS5EYiwgU2VtaXRvbmUuQ2JdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DYl0gPSBbU2VtaXRvbmUuR2IsIFNlbWl0b25lLkZiXVxuXG5cbmV4cG9ydCBjb25zdCBtYWpTY2FsZURpZmZlcmVuY2UgPSAoc2VtaXRvbmUxOiBudW1iZXIsIHNlbWl0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gR2l2ZW4gdHdvIG1ham9yIHNjYWxlcywgcmV0dXJuIGhvdyBjbG9zZWx5IHJlbGF0ZWQgdGhleSBhcmVcbiAgICAvLyAwID0gc2FtZSBzY2FsZVxuICAgIC8vIDEgPSBFLkcuIEMgYW5kIEYgb3IgQyBhbmQgR1xuICAgIGxldCBjdXJyZW50VmFsID0gbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmUxXTtcbiAgICBpZiAoc2VtaXRvbmUxID09IHNlbWl0b25lMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsLmluY2x1ZGVzKHNlbWl0b25lMikpIHtcbiAgICAgICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdDdXJyZW50VmFsID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbWl0b25lIG9mIGN1cnJlbnRWYWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3U2VtaXRvbmUgb2YgbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmVdKSB7XG4gICAgICAgICAgICAgICAgbmV3Q3VycmVudFZhbC5hZGQobmV3U2VtaXRvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRWYWwgPSBbLi4ubmV3Q3VycmVudFZhbF0gYXMgQXJyYXk8bnVtYmVyPjtcbiAgICB9XG4gICAgcmV0dXJuIDEyO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IG1ha2VNdXNpYywgYnVpbGRUYWJsZXMsIG1ha2VNZWxvZHkgfSBmcm9tIFwiLi9zcmMvY2hvcmRzXCJcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzLCBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmJ1aWxkVGFibGVzKClcblxuc2VsZi5vbm1lc3NhZ2UgPSAoZXZlbnQ6IHsgZGF0YTogeyBwYXJhbXM6IHN0cmluZywgbmV3TWVsb2R5OiB1bmRlZmluZWQgfCBib29sZWFuLCBnaXZlVXA6IHVuZGVmaW5lZCB8IGJvb2xlYW4gfSB9KSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IE1haW5NdXNpY1BhcmFtcyhKU09OLnBhcnNlKGV2ZW50LmRhdGEucGFyYW1zIHx8IFwie31cIikpO1xuXG4gICAgaWYgKGV2ZW50LmRhdGEubmV3TWVsb2R5KSB7XG4gICAgICAgIG1ha2VNZWxvZHkoKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMsIHBhcmFtcyk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWROb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSgoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcykpfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuZGF0YS5naXZlVXApIHtcbiAgICAgICAgKHNlbGYgYXMgYW55KS5naXZlVVAgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2U6IFByb21pc2U8YW55PjtcbiAgICBjb25zdCBwcm9ncmVzc0NhbGxiYWNrID0gKGN1cnJlbnRCZWF0OiBudW1iZXIsIGRpdmlzaW9uZWRSaWNoTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMpID0+IHtcbiAgICAgICAgaWYgKChzZWxmIGFzIGFueSkuZ2l2ZVVQKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJnaXZlVVBcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRpdmlzaW9uZWRSaWNoTm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByaWNoTm90ZXMgPSBkaXZpc2lvbmVkUmljaE5vdGVzW2N1cnJlbnRCZWF0ICogQkVBVF9MRU5HVEhdO1xuICAgICAgICBpZiAoY3VycmVudEJlYXQgIT0gbnVsbCAmJiByaWNoTm90ZXMgJiYgcmljaE5vdGVzWzBdICYmIHJpY2hOb3Rlc1swXS5jaG9yZCkge1xuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkOiByaWNoTm90ZXNbMF0uY2hvcmQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGl2aXNpb25lZFJpY2hOb3RlcykpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtYWtlTXVzaWMocGFyYW1zLCBwcm9ncmVzc0NhbGxiYWNrKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gcmVzdWx0LmRpdmlzaW9uZWROb3RlcztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRpdmlzaW9uZWROb3RlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMgPSBkaXZpc2lvbmVkTm90ZXM7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGl2aXNpb25lZE5vdGVzKSl9KTtcblxuXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2Vycm9yOiBlcnJ9KTtcbiAgICB9KTtcblxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==