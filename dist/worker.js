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
        this.melodyRhythm = "EEEEQQEEEEQQEEQEEQEEQEEQ";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLHFCQUFxQjt3QkFDckIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLG9CQUFvQjt3QkFDcEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLHFCQUFxQjt3QkFDckIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkM7eUJBQU0sSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7d0JBQy9CLG9CQUFvQjt3QkFDcEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMs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TSxLQUFLLENBQUMsRUFBRTtZQUMzQyxPQUFPO1NBQ1Y7UUFDQSxJQUFZLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBR3pGLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL211c2ljdGhlb3J5anMvZGlzdC9tdXNpY3RoZW9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXZhaWxhYmxlc2NhbGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHByb2dyZXNzaW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9jaG9yZHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZvcmNlZG1lbG9keS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ29vZHNvdW5kaW5nc2NhbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ludmVyc2lvbnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL215bG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9ub25jaG9yZHRvbmVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhbmRvbWNob3Jkcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVuc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3dvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLk11c2ljVGhlb3J5ID0ge30pKTtcbn0pKHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgIC8qKlxyXG4gICAgKiBOb3RlcyBzdGFydGluZyBhdCBDMCAtIHplcm8gaW5kZXggLSAxMiB0b3RhbFxyXG4gICAgKiBNYXBzIG5vdGUgbmFtZXMgdG8gc2VtaXRvbmUgdmFsdWVzIHN0YXJ0aW5nIGF0IEM9MFxyXG4gICAgKiBAZW51bVxyXG4gICAgKi9cclxuICAgdmFyIFNlbWl0b25lO1xyXG4gICAoZnVuY3Rpb24gKFNlbWl0b25lKSB7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFcIl0gPSA5XSA9IFwiQVwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBc1wiXSA9IDEwXSA9IFwiQXNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQmJcIl0gPSAxMF0gPSBcIkJiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJcIl0gPSAxMV0gPSBcIkJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQnNcIl0gPSAwXSA9IFwiQnNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ2JcIl0gPSAxMV0gPSBcIkNiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNcIl0gPSAwXSA9IFwiQ1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDc1wiXSA9IDFdID0gXCJDc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEYlwiXSA9IDFdID0gXCJEYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEXCJdID0gMl0gPSBcIkRcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRHNcIl0gPSAzXSA9IFwiRHNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRWJcIl0gPSAzXSA9IFwiRWJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRVwiXSA9IDRdID0gXCJFXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkVzXCJdID0gNV0gPSBcIkVzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZiXCJdID0gNF0gPSBcIkZiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZcIl0gPSA1XSA9IFwiRlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGc1wiXSA9IDZdID0gXCJGc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHYlwiXSA9IDZdID0gXCJHYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHXCJdID0gN10gPSBcIkdcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR3NcIl0gPSA4XSA9IFwiR3NcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQWJcIl0gPSA4XSA9IFwiQWJcIjtcclxuICAgfSkoU2VtaXRvbmUgfHwgKFNlbWl0b25lID0ge30pKTtcclxuICAgLyoqXHJcbiAgICAqIFJldHVybnMgdGhlIHdob2xlIG5vdGUgbmFtZSAoZS5nLiBDLCBELCBFLCBGLCBHLCBBLCBCKSBmb3JcclxuICAgICogdGhlIGdpdmVuIHN0cmluZ1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGdldFdob2xlVG9uZUZyb21OYW1lID0gKG5hbWUpID0+IHtcclxuICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PT0gMCB8fCBuYW1lLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBuYW1lXCIpO1xyXG4gICAgICAgY29uc3Qga2V5ID0gbmFtZVswXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgcmV0dXJuIFNlbWl0b25lW2tleV07XHJcbiAgIH07XHJcbiAgIHZhciBTZW1pdG9uZSQxID0gU2VtaXRvbmU7XG5cbiAgIC8qKlxyXG4gICAgKiBXcmFwcyBhIG51bWJlciBiZXR3ZWVuIGEgbWluIGFuZCBtYXggdmFsdWUuXHJcbiAgICAqIEBwYXJhbSB2YWx1ZSAtIHRoZSBudW1iZXIgdG8gd3JhcFxyXG4gICAgKiBAcGFyYW0gbG93ZXIgIC0gdGhlIGxvd2VyIGJvdW5kXHJcbiAgICAqIEBwYXJhbSB1cHBlciAtIHRoZSB1cHBlciBib3VuZFxyXG4gICAgKiBAcmV0dXJucyB3cmFwcGVkTnVtYmVyIC0gdGhlIHdyYXBwZWQgbnVtYmVyXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgd3JhcCA9ICh2YWx1ZSwgbG93ZXIsIHVwcGVyKSA9PiB7XHJcbiAgICAgICAvLyBjb3BpZXNcclxuICAgICAgIGxldCB2YWwgPSB2YWx1ZTtcclxuICAgICAgIGxldCBsYm91bmQgPSBsb3dlcjtcclxuICAgICAgIGxldCB1Ym91bmQgPSB1cHBlcjtcclxuICAgICAgIC8vIGlmIHRoZSBib3VuZHMgYXJlIGludmVydGVkLCBzd2FwIHRoZW0gaGVyZVxyXG4gICAgICAgaWYgKHVwcGVyIDwgbG93ZXIpIHtcclxuICAgICAgICAgICBsYm91bmQgPSB1cHBlcjtcclxuICAgICAgICAgICB1Ym91bmQgPSBsb3dlcjtcclxuICAgICAgIH1cclxuICAgICAgIC8vIHRoZSBhbW91bnQgbmVlZGVkIHRvIG1vdmUgdGhlIHJhbmdlIGFuZCB2YWx1ZSB0byB6ZXJvXHJcbiAgICAgICBjb25zdCB6ZXJvT2Zmc2V0ID0gMCAtIGxib3VuZDtcclxuICAgICAgIC8vIG9mZnNldCB0aGUgdmFsdWVzIHNvIHRoYXQgdGhlIGxvd2VyIGJvdW5kIGlzIHplcm9cclxuICAgICAgIGxib3VuZCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgdWJvdW5kICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICB2YWwgKz0gemVyb09mZnNldDtcclxuICAgICAgIC8vIGNvbXB1dGUgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgdmFsdWUgd2lsbCB3cmFwXHJcbiAgICAgICBsZXQgd3JhcHMgPSBNYXRoLnRydW5jKHZhbCAvIHVib3VuZCk7XHJcbiAgICAgICAvLyBjYXNlOiAtMSAvIHVib3VuZCg+MCkgd2lsbCBlcXVhbCAwIGFsdGhvdWdoIGl0IHdyYXBzIG9uY2VcclxuICAgICAgIGlmICh3cmFwcyA9PT0gMCAmJiB2YWwgPCBsYm91bmQpXHJcbiAgICAgICAgICAgd3JhcHMgPSAtMTtcclxuICAgICAgIC8vIGNhc2U6IHVib3VuZCBhbmQgdmFsdWUgYXJlIHRoZSBzYW1lIHZhbC91Ym91bmQgPSAxIGJ1dCBhY3R1YWxseSBkb2VzbnQgd3JhcFxyXG4gICAgICAgaWYgKHdyYXBzID09PSAxICYmIHZhbCA9PT0gdWJvdW5kKVxyXG4gICAgICAgICAgIHdyYXBzID0gMDtcclxuICAgICAgIC8vIG5lZWRlZCB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIG51bSBvZiB3cmFwcyBpcyAwIG9yIDEgb3IgLTFcclxuICAgICAgIGxldCB2YWxPZmZzZXQgPSAwO1xyXG4gICAgICAgbGV0IHdyYXBPZmZzZXQgPSAwO1xyXG4gICAgICAgaWYgKHdyYXBzID49IC0xICYmIHdyYXBzIDw9IDEpXHJcbiAgICAgICAgICAgd3JhcE9mZnNldCA9IDE7XHJcbiAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYmVsb3cgdGhlIHJhbmdlXHJcbiAgICAgICBpZiAodmFsIDwgbGJvdW5kKSB7XHJcbiAgICAgICAgICAgdmFsT2Zmc2V0ID0gKHZhbCAlIHVib3VuZCkgKyB3cmFwT2Zmc2V0O1xyXG4gICAgICAgICAgIHZhbCA9IHVib3VuZCArIHZhbE9mZnNldDtcclxuICAgICAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYWJvdmUgdGhlIHJhbmdlXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlIGlmICh2YWwgPiB1Ym91bmQpIHtcclxuICAgICAgICAgICB2YWxPZmZzZXQgPSAodmFsICUgdWJvdW5kKSAtIHdyYXBPZmZzZXQ7XHJcbiAgICAgICAgICAgdmFsID0gbGJvdW5kICsgdmFsT2Zmc2V0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLy8gYWRkIHRoZSBvZmZzZXQgZnJvbSB6ZXJvIGJhY2sgdG8gdGhlIHZhbHVlXHJcbiAgICAgICB2YWwgLT0gemVyb09mZnNldDtcclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgICBudW1XcmFwczogd3JhcHMsXHJcbiAgICAgICB9O1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2ltcGxlIHV0aWwgdG8gY2xhbXAgYSBudW1iZXIgdG8gYSByYW5nZVxyXG4gICAgKiBAcGFyYW0gcE51bSAtIHRoZSBudW1iZXIgdG8gY2xhbXBcclxuICAgICogQHBhcmFtIHBMb3dlciAtIHRoZSBsb3dlciBib3VuZFxyXG4gICAgKiBAcGFyYW0gcFVwcGVyIC0gdGhlIHVwcGVyIGJvdW5kXHJcbiAgICAqIEByZXR1cm5zIE51bWJlciAtIHRoZSBjbGFtcGVkIG51bWJlclxyXG4gICAgKlxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNsYW1wID0gKHBOdW0sIHBMb3dlciwgcFVwcGVyKSA9PiBNYXRoLm1heChNYXRoLm1pbihwTnVtLCBNYXRoLm1heChwTG93ZXIsIHBVcHBlcikpLCBNYXRoLm1pbihwTG93ZXIsIHBVcHBlcikpO1xuXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLy8gQ29uc3RhbnRzXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBNT0RJRklFRF9TRU1JVE9ORVMgPSBbMSwgMywgNCwgNiwgOCwgMTBdO1xyXG4gICBjb25zdCBUT05FU19NQVggPSAxMTtcclxuICAgY29uc3QgVE9ORVNfTUlOID0gMDtcclxuICAgY29uc3QgT0NUQVZFX01BWCA9IDk7XHJcbiAgIGNvbnN0IE9DVEFWRV9NSU4gPSAwO1xyXG4gICBjb25zdCBERUZBVUxUX09DVEFWRSA9IDQ7XHJcbiAgIGNvbnN0IERFRkFVTFRfU0VNSVRPTkUgPSAwO1xuXG4gICAvKipcclxuICAgICogTWFwcyBub3RlIGFsdGVyYXRpb25zIHRvICB0aGVpciByZWxhdGl2ZSBtYXRobWF0aWNhbCB2YWx1ZVxyXG4gICAgKkBlbnVtXHJcbiAgICAqL1xyXG4gICB2YXIgTW9kaWZpZXI7XHJcbiAgIChmdW5jdGlvbiAoTW9kaWZpZXIpIHtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiRkxBVFwiXSA9IC0xXSA9IFwiRkxBVFwiO1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJOQVRVUkFMXCJdID0gMF0gPSBcIk5BVFVSQUxcIjtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiU0hBUlBcIl0gPSAxXSA9IFwiU0hBUlBcIjtcclxuICAgfSkoTW9kaWZpZXIgfHwgKE1vZGlmaWVyID0ge30pKTtcclxuICAgLyoqXHJcbiAgICAqIFBhcnNlcyBtb2RpZmllciBmcm9tIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgZW51bSB2YWx1ZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlTW9kaWZpZXIgPSAobW9kaWZpZXIpID0+IHtcclxuICAgICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgICAgICBjYXNlIFwiYlwiOlxyXG4gICAgICAgICAgIGNhc2UgXCJmbGF0XCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5GTEFUO1xyXG4gICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgY2FzZSBcInNcIjpcclxuICAgICAgICAgICBjYXNlIFwic2hhcnBcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLlNIQVJQO1xyXG4gICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5OQVRVUkFMO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICB2YXIgTW9kaWZpZXIkMSA9IE1vZGlmaWVyO1xuXG4gICAvLyBpbXBvcnQgeyByZWdpc3RlckluaXRpYWxpemVyIH0gZnJvbSBcIi4uL0luaXRpYWxpemVyL0luaXRpYWxpemVyXCI7XHJcbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlTG9va3VwLmpzb25cIjtcclxuICAgLy8gaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgbmFtZVJlZ2V4JDIgPSAvKFtBLUddKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4JDIgPSAvKCN8c3xiKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCQyID0gLyhbMC05XSspL2c7XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gcGFyc2UgYSBub3RlIGZyb20gYSBzdHJpbmdcclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBwYXJzZU5vdGUgPSAobm90ZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBub3RlTG9va3VwKG5vdGUpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBub3RlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtub3RlfS4gR2V0IGEgcGVyZm9ybWFuY2UgaW5jcmVhc2UgYnkgdXNpbmcgdGhlIGZvcm1hdCBbQS1HXVsjfHN8Yl1bMC05XSBhbmQgdXNpbmcgYnVpbGRUYWJsZXMgbWV0aG9kKHNlZSBkb2N1bWVudGF0aW9uKWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgbm90ZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7bm90ZX0uIEdldCBhIHBlcmZvcm1hbmNlIGluY3JlYXNlIGJ5IHVzaW5nIHRoZSBmb3JtYXQgW0EtR11bI3xzfGJdWzAtOV0gYW5kIHVzaW5nIGJ1aWxkVGFibGVzIG1ldGhvZChzZWUgZG9jdW1lbnRhdGlvbilgKTtcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gbm90ZS5tYXRjaChuYW1lUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gbm90ZS5tYXRjaChtb2RpZmllclJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBub3RlLm1hdGNoKG9jdGF2ZVJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBub3RlOiAke25vdGV9YCk7XHJcbiAgIH07XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDQgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBub3RlVGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBmb3IgKGNvbnN0IG5vdGVMYWJlbCBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgIG5vdGVUYWJsZVtub3RlTGFiZWxdID0gcGFyc2VOb3RlKG5vdGVMYWJlbCwgdHJ1ZSk7IC8vICdDJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgIGZvciAobGV0IGlNb2RpZmllck91dGVyID0gMDsgaU1vZGlmaWVyT3V0ZXIgPCBub3RlTW9kaWZpZXJzLmxlbmd0aDsgKytpTW9kaWZpZXJPdXRlcikge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtub3RlTW9kaWZpZXJzW2lNb2RpZmllck91dGVyXX1gO1xyXG4gICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQyMnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDwgT0NUQVZFX01BWDsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke2lPY3RhdmV9YDtcclxuICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0M0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICBmb3IgKGxldCBpTW9kaWZpZXIgPSAwOyBpTW9kaWZpZXIgPCBub3RlTW9kaWZpZXJzLmxlbmd0aDsgKytpTW9kaWZpZXIpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke25vdGVNb2RpZmllcnNbaU1vZGlmaWVyXX0ke2lPY3RhdmV9YDtcclxuICAgICAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDIzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gbm90ZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogVGhlIGxvb2t1cCB0YWJsZVxyXG4gICAgKi9cclxuICAgbGV0IF9ub3RlTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZE5vdGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkTm90ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSQ0KCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3RlTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgbm90ZSB0YWJsZVwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZUxvb2t1cDtcclxuICAgfTtcblxuICAgLy8gaW1wb3J0IHsgcmVnaXN0ZXJJbml0aWFsaXplciB9IGZyb20gXCIuLi9Jbml0aWFsaXplci9Jbml0aWFsaXplclwiO1xyXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZVN0cmluZ0xvb2t1cC5qc29uXCI7XHJcbiAgIGNvbnN0IFVOS05PV05fTU9ESUZJRVJfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkMjL0RiXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRCMvRWJcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkYjL0diXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiRyMvQWJcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJBIy9CYlwiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IFNIQVJQX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJDI1wiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkQjXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJGI1wiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkcjXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQSNcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBGTEFUX01PRElGSUVSX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJEYlwiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkViXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJHYlwiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkFiXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQmJcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQzID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGZvciAobGV0IGlUb25lID0gVE9ORVNfTUlOOyBpVG9uZSA8PSBUT05FU19NQVg7ICsraVRvbmUpIHtcclxuICAgICAgICAgICBmb3IgKGxldCBpUHJldiA9IFRPTkVTX01JTjsgaVByZXYgPD0gVE9ORVNfTUFYOyArK2lQcmV2KSB7XHJcbiAgICAgICAgICAgICAgIC8vIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDw9IE9DVEFWRV9NQVg7IGlPY3RhdmUrKykge1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICBpZiAoTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKGlUb25lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcIi1cIjsgLy8gaGFzIGFuIHVua25vd24gbW9kaWZpZXJcclxuICAgICAgICAgICAgICAgICAgIC8vIGlmIGlzIGZsYXRcclxuICAgICAgICAgICAgICAgICAgIGlmICh3cmFwKGlUb25lICsgMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PSBpUHJldilcclxuICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gaXMgc2hhcnBcclxuICAgICAgICAgICAgICAgICAgIGlmICh3cmFwKGlUb25lIC0gMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PSBpUHJldilcclxuICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiI1wiO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vIGdldCBub3RlIG5hbWUgZnJvbSB0YWJsZVxyXG4gICAgICAgICAgICAgICB0YWJsZVtgJHtpVG9uZX0tJHtpUHJldn1gXSA9IGdldE5vdGVMYWJlbChpVG9uZSwgbW9kaWZpZXIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGNvbnN0IGdldE5vdGVMYWJlbCA9ICh0b25lLCBtb2RpZmllcikgPT4ge1xyXG4gICAgICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBTSEFSUF9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICAgICAgY2FzZSBcImJcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIEZMQVRfTU9ESUZJRVJfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgICAgIGNhc2UgXCItXCI6XHJcbiAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgcmV0dXJuIFVOS05PV05fTU9ESUZJRVJfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICBsZXQgX25vdGVTdHJpbmdMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZVN0cmluZ0xvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICBpZiAoT2JqZWN0LmtleXMoX25vdGVTdHJpbmdMb29rdXApLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkTm90ZVN0cmluZ1RhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5rZXlzKF9ub3RlU3RyaW5nTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX25vdGVTdHJpbmdMb29rdXA7XHJcbiAgICAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlJDMoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVTdHJpbmdMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJOb3RlIHN0cmluZyB0YWJsZSBidWlsdC5cIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVTdHJpbmdMb29rdXA7XHJcbiAgIH07XG5cbiAgIHZhciBJRFg9MjU2LCBIRVg9W10sIFNJWkU9MjU2LCBCVUZGRVI7XG4gICB3aGlsZSAoSURYLS0pIEhFWFtJRFhdID0gKElEWCArIDI1NikudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcblxuICAgZnVuY3Rpb24gdWlkKGxlbikge1xuICAgXHR2YXIgaT0wLCB0bXA9KGxlbiB8fCAxMSk7XG4gICBcdGlmICghQlVGRkVSIHx8ICgoSURYICsgdG1wKSA+IFNJWkUqMikpIHtcbiAgIFx0XHRmb3IgKEJVRkZFUj0nJyxJRFg9MDsgaSA8IFNJWkU7IGkrKykge1xuICAgXHRcdFx0QlVGRkVSICs9IEhFWFtNYXRoLnJhbmRvbSgpICogMjU2IHwgMF07XG4gICBcdFx0fVxuICAgXHR9XG5cbiAgIFx0cmV0dXJuIEJVRkZFUi5zdWJzdHJpbmcoSURYLCBJRFgrKyArIHRtcCk7XG4gICB9XG5cbiAgIC8vIGltcG9ydCBJZGVudGlmaWFibGUgZnJvbSBcIi4uL2NvbXBvc2FibGVzL0lkZW50aWZpYWJsZVwiO1xyXG4gICAvKipcclxuICAgICogQSBub3RlIGNvbnNpc3Qgb2YgYSBzZW1pdG9uZSBhbmQgYW4gb2N0YXZlLjxicj5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHsgTm90ZUluaXRpYWxpemVyIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjsgLy8gdHlwZXNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIE5vdGUge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHdpdGggZGVmYXVsdCB2YWx1ZXMgc2VtaXRvbmUgMChDKSBhbmQgb2N0YXZlIDRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB1c2luZyBhbiBpbml0aWFsaXplciBvYmplY3RcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7c2VtaXRvbmU6IDQsIG9jdGF2ZTogNX0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogbm90ZS1uYW1lW21vZGlmaWVyXVtvY3RhdmVdXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgdXNpbmcgYSBzdHJpbmdcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZShcIkM1XCIpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlcyA9IHBhcnNlTm90ZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcz8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdmFsdWVzPy5zZW1pdG9uZSA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRoYXQgb2N0YXZlIGlzIHNldCBmaXJzdCBzbyB0aGF0XHJcbiAgICAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIHNlbWl0b25lIGNhbiBjaGFuZ2UgdGhlIG9jdGF2ZVxyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcz8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdmFsdWVzPy5zZW1pdG9uZSA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIHVuaXF1ZSBpZCBmb3IgdGhpcyBub3RlKGF1dG8gZ2VuZXJhdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pZCk7IC8vIHMyODk4c25sb2pcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZW1pdG9uZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICBfcHJldlNlbWl0b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDBcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgc2VtaXRvbmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvbmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNldHRpbmcgdGhlIHNlbWl0b25lIHdpdGggYSBudW1iZXIgb3V0c2lkZSB0aGVcclxuICAgICAgICAqIHJhbmdlIG9mIDAtMTEgd2lsbCB3cmFwIHRoZSB2YWx1ZSBhcm91bmQgYW5kXHJcbiAgICAgICAgKiBjaGFuZ2UgdGhlIG9jdGF2ZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogbm90ZS5zZW1pdG9uZSA9IDQ7Ly8gRVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDQoRSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgc2VtaXRvbmUoc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcChzZW1pdG9uZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgdGhpcy5fdG9uZSA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gdGhpcy5fb2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5vY3RhdmUpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIG5vdGUub2N0YXZlID0gMTA7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLm9jdGF2ZSk7IC8vIDkoYmVjYXVzZSBvZiBjbGFtcGluZylcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKG9jdGF2ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKG9jdGF2ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIHNoYXJwZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuc2hhcnAoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUyLnNlbWl0b25lKTsgLy8gMShDIylcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGFycCgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KS5zaGFycGVuKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNoYXJwZW5zIHRoZSBub3RlIGluIHBsYWNlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIG5vdGUuc2hhcnBlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDEoQyMpXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoYXJwZW4oKSB7XHJcbiAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmUgKyAxO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgYXR0ZW1wdHMgdG8gZGV0ZXJtaW5lIGlmIHRoZSBub3RlIGlzIHNoYXJwXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBub3RlIGlzIHNoYXJwXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc1NoYXJwKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogbm90ZS5zaGFycGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzU2hhcnAoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc1NoYXJwKCkge1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgd2hvbGUsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXModGhpcy5zZW1pdG9uZSk7XHJcbiAgICAgICAgICAgaWYgKCFtb2RpZmllZClcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgZmxhdCwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBpZiAod3JhcCh0aGlzLnNlbWl0b25lICsgMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PVxyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9pcyBmbGF0XHJcbiAgICAgICAgICAgLy8gRG9lc24ndCBuZWNjZWNhcmlseSBtZWFuIGl0J3Mgc2hhcnAsIGJ1dCBpdCdzIGEgZ29vZCBndWVzcyBhdCB0aGlzIHBvaW50XHJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgZmxhdHRlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgZmxhdHRlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5mbGF0KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlMi5zZW1pdG9uZSk7IC8vIDMoRWIpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZmxhdCgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KS5mbGF0dGVuKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEZsYXR0ZW5zIHRoZSBub3RlIGluIHBsYWNlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7c2VtaXRvbmU6IDR9KTsgLy8gIHNlbWl0b25lIGlzIDQoRSlcclxuICAgICAgICAqIG5vdGUuZmxhdHRlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDMoRWIpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZmxhdHRlbigpIHtcclxuICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdGhpcy5zZW1pdG9uZSAtIDE7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBhdHRlbXB0cyB0byBkZXRlcm1pbmUgaWYgdGhlIG5vdGUgaXMgZmxhdFxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbm90ZSBpcyBmbGF0XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc0ZsYXQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBub3RlLmZsYXR0ZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNGbGF0KCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNGbGF0KCkge1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgd2hvbGUsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXModGhpcy5zZW1pdG9uZSk7XHJcbiAgICAgICAgICAgaWYgKCFtb2RpZmllZClcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgc2hhcnAsIGl0IGNhbid0IGJlIGZsYXRcclxuICAgICAgICAgICBpZiAod3JhcCh0aGlzLnNlbWl0b25lIC0gMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PVxyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9pcyBzaGFycFxyXG4gICAgICAgICAgIC8vIERvZXNuJ3QgbmVjY2VjYXJpbHkgbWVhbiBpdCdzIGZsYXQsIGJ1dCBpdCdzIGEgZ29vZCBndWVzcyBhdCB0aGlzIHBvaW50XHJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhpcyBub3RlIGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmVxdWFscyhub3RlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5zZW1pdG9uZSA9PT0gbm90ZS5zZW1pdG9uZSAmJiB0aGlzLm9jdGF2ZSA9PT0gbm90ZS5vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5lcXVhbHMobm90ZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdmVyc2lvbiBvZiB0aGlzIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBDNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKlxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlU3RyaW5nTG9va3VwKTtcclxuICAgICAgICAgICByZXR1cm4gKG5vdGVTdHJpbmdMb29rdXAoYCR7dGhpcy5fdG9uZX0tJHt0aGlzLl9wcmV2U2VtaXRvbmV9YCkgK1xyXG4gICAgICAgICAgICAgICBgJHt0aGlzLl9vY3RhdmV9YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFN0YXRpYyBtZXRob2RzIHRvIGNyZWF0ZSB3aG9sZSBub3RlcyBlYXNpbHkuXHJcbiAgICAgICAgKiB0aGUgZGVmYXVsdCBvY3RhdmUgaXMgNFxyXG4gICAgICAgICovXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEFbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkEoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEE0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEEob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkEsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEJbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkIoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEI0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEIob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkIsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIENbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkMoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEM0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEMob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkMsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIERbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEQ0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEQob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkQsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEVbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEU0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEUob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEZbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkYoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEY0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEYob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkYsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEdbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkcoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEc0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEcob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkcsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogQ29uc3RhbnRzXHJcbiAgICAqL1xyXG4gICBjb25zdCBNSURJS0VZX1NUQVJUID0gMTI7XHJcbiAgIGNvbnN0IE5VTV9PQ1RBVkVTID0gMTA7XHJcbiAgIGNvbnN0IE5VTV9TRU1JVE9ORVMgPSAxMjtcclxuICAgLyoqXHJcbiAgICAqIENhbGN1bGF0ZXMgdGhlIG1pZGkga2V5IGZvciBhIGdpdmVuIG9jdGF2ZSBhbmQgc2VtaXRvbmUuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjYWxjTWlkaUtleSA9IChvY3RhdmUsIHNlbWl0b25lKSA9PiBNSURJS0VZX1NUQVJUICsgb2N0YXZlICogTlVNX1NFTUlUT05FUyArIHNlbWl0b25lO1xyXG4gICAvKipcclxuICAgICogQ2FsY3VsYXRlcyB0aGUgZnJlcXVlbmN5IGZvciBhIGdpdmVuIG9jdGF2ZSBhbmQgc2VtaXRvbmUgZ2l2ZW5cclxuICAgICogYSB0dW5pbmcgZm9yIGE0LlxyXG4gICAgKi9cclxuICAgY29uc3QgY2FsY0ZyZXF1ZW5jeSA9IChtaWRpS2V5LCBhNFR1bmluZykgPT4gMiAqKiAoKG1pZGlLZXkgLSA2OSkgLyAxMikgKiBhNFR1bmluZztcclxuICAgLyoqXHJcbiAgICAqIENyZWF0ZXMgYW5kIHJldHVybiBsb29rdXAgdGFibGVzIGZvciBtaWRpa2V5IGFuZCBmcmVxdWVuY3kuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZXMgPSAoYTRUdW5pbmcgPSA0NDApID0+IHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTWFwcyBvY3RhdmUgYW5kIHNlbWl0b25lIHRvIG5vdGUgZnJlcXVlbmN5KGhlcnR6KS5cclxuICAgICAgICAqIHJlcXVpcmVzIGEga2V5IGluIHRoZSBmb3JtIG9mIGA8b2N0YXZlPi08c2VtaXRvbmU+YFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdCBmcmVxVGFibGUgPSB7fTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTWFwcyBvY3RhdmUgYW5kIHNlbWl0b25lIHRvIG1pZGkga2V5LlxyXG4gICAgICAgICogcmVxdWlyZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2YgYDxvY3RhdmU+LTxzZW1pdG9uZT5gXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0IG1pZGlUYWJsZSA9IHt9O1xyXG4gICAgICAgbGV0IGlPY3RhdmUgPSAwO1xyXG4gICAgICAgbGV0IGlTZW1pdG9uZSA9IDA7XHJcbiAgICAgICBmb3IgKGlPY3RhdmUgPSAwOyBpT2N0YXZlIDwgTlVNX09DVEFWRVM7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgIGZvciAoaVNlbWl0b25lID0gMDsgaVNlbWl0b25lIDwgTlVNX1NFTUlUT05FUzsgKytpU2VtaXRvbmUpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7aU9jdGF2ZX0tJHtpU2VtaXRvbmV9YDtcclxuICAgICAgICAgICAgICAgY29uc3QgbWtleSA9IGNhbGNNaWRpS2V5KGlPY3RhdmUsIGlTZW1pdG9uZSk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGZyZXEgPSBjYWxjRnJlcXVlbmN5KG1rZXksIGE0VHVuaW5nKTtcclxuICAgICAgICAgICAgICAgbWlkaVRhYmxlW2tleV0gPSBta2V5O1xyXG4gICAgICAgICAgICAgICBmcmVxVGFibGVba2V5XSA9IGZyZXE7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICBmcmVxTG9va3VwOiBmcmVxVGFibGUsXHJcbiAgICAgICAgICAgbWlkaUxvb2t1cDogbWlkaVRhYmxlLFxyXG4gICAgICAgfTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFR1bmluZyBjb21wb25lbnQgdXNlZCBieSBJbnN0cnVtZW50IGNsYXNzPGJyPlxyXG4gICAgKiBjb250YWluZXMgdGhlIGE0IHR1bmluZyAtIGRlZmF1bHQgaXMgNDQwSHo8YnI+XHJcbiAgICAqIGJ1aWxkcyBsb29rdXAgdGFibGVzIGZvciBtaWRpIGtleSBhbmQgZnJlcXVlbmN5PGJyPlxyXG4gICAgKiBiYXNlZCBvbiB0aGUgdHVuaW5nXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY2xhc3MgVHVuaW5nIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQ3JlYXRlcyB0aGUgb2JqZWN0IGFuZCBidWlsZHMgdGhlIGxvb2t1cCB0YWJsZXMuXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKGE0RnJlcSA9IDQ0MCkge1xyXG4gICAgICAgICAgIHRoaXMuX2E0ID0gYTRGcmVxO1xyXG4gICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZXMoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgVHVuaW5nKHRoaXMuX2E0KTtcclxuICAgICAgIH1cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9hNCA9PT0gb3RoZXIuX2E0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBhNCBUdW5pbmdcclxuICAgICAgICAqL1xyXG4gICAgICAgX2E0ID0gNDQwO1xyXG4gICAgICAgZ2V0IGE0KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9hNDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2V0dGluZyB0aGUgdHVuaW5nIHdpbGwgcmVidWlsZCB0aGUgbG9va3VwIHRhYmxlc1xyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgYTQodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9hNCA9IHZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZXMoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbG9va3VwIHRhYmxlIGZvciBtaWRpIGtleVxyXG4gICAgICAgICovXHJcbiAgICAgICBfbWlkaUtleVRhYmxlID0ge307XHJcbiAgICAgICBtaWRpS2V5TG9va3VwKG9jdGF2ZSwgc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtvY3RhdmV9LSR7c2VtaXRvbmV9YDtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbWlkaUtleVRhYmxlW2tleV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGxvb2t1cCB0YWJsZSBmb3IgZnJlcXVlbmN5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9mcmVxVGFibGUgPSB7fTtcclxuICAgICAgIGZyZXFMb29rdXAob2N0YXZlLCBzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke29jdGF2ZX0tJHtzZW1pdG9uZX1gO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVxVGFibGVba2V5XTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQnVpbGRzIHRoZSBsb29rdXAgdGFibGVzIGZvciBtaWRpIGtleSBhbmQgZnJlcXVlbmN5XHJcbiAgICAgICAgKi9cclxuICAgICAgIGJ1aWxkVGFibGVzKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRhYmxlcyA9IGNyZWF0ZVRhYmxlcyh0aGlzLl9hNCk7XHJcbiAgICAgICAgICAgdGhpcy5fbWlkaUtleVRhYmxlID0gdGFibGVzLm1pZGlMb29rdXA7XHJcbiAgICAgICAgICAgdGhpcy5fZnJlcVRhYmxlID0gdGFibGVzLmZyZXFMb29rdXA7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIHR1bmluZyBhcyBhIHN0cmluZ1xyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICByZXR1cm4gYFR1bmluZygke3RoaXMuX2E0fSlgO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBJbnN0cnVtZW50IGFyZSB1c2VkIHRvIGVuY2Fwc3VsYXRlIHRoZSB0dW5pbmcgYW5kIHJldHJpZXZpbmcgb2YgbWlkaSBrZXlzXHJcbiAgICAqIGFuZCBmcmVxdWVuY2llcyBmb3Igbm90ZXNcclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBJbnN0cnVtZW50IH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICovXHJcbiAgIGNsYXNzIEluc3RydW1lbnQge1xyXG4gICAgICAgdHVuaW5nO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gdHVuaW5nIEE0IGZyZXF1ZW5jeSAtIGRlZmF1bHRzIHRvIDQ0MFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpOyAvLyBkZWZhdWx0IDQ0MCB0dW5pbmdcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3RvcihhNEZyZXEgPSA0NDApIHtcclxuICAgICAgICAgICB0aGlzLnR1bmluZyA9IG5ldyBUdW5pbmcoYTRGcmVxKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgYSB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuaWQ7IC8vIHJldHVybnMgYSB1bmlxdWUgaWRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGluc3RydW1lbnQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IEluc3RydW1lbnQodGhpcy50dW5pbmcuYTQpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gb3RoZXIgdGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlXHJcbiAgICAgICAgKiBAcmV0dXJucyAgdHJ1ZSBpZiB0aGUgb3RoZXIgb2JqZWN0IGlzIGVxdWFsIHRvIHRoaXMgb25lXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gaW5zdHJ1bWVudC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcuZXF1YWxzKG90aGVyLnR1bmluZyk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBmcmVxdWVuY3kgb2YgdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuZ2V0RnJlcXVlbmN5KG5ldyBOb3RlKFwiQzRcIikpOyAvLyByZXR1cm5zIDI2MS42MjU1NjUzMDA1OTg2XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0RnJlcXVlbmN5KG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcuZnJlcUxvb2t1cChub3RlLm9jdGF2ZSwgbm90ZS5zZW1pdG9uZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBtaWRpIGtleSBvZiB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5nZXRNaWRpS2V5KG5ldyBOb3RlKFwiQzRcIikpOyAvLyByZXR1cm5zIDYwXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0TWlkaUtleShub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLm1pZGlLZXlMb29rdXAobm90ZS5vY3RhdmUsIG5vdGUuc2VtaXRvbmUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgdHVuaW5nIGFzIGEgc3RyaW5nXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LnRvU3RyaW5nKCkpOyAvLyByZXR1cm5zIFwiSW5zdHJ1bWVudCBUdW5pbmcoNDQwKVwiXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGBJbnN0cnVtZW50IFR1bmluZygke3RoaXMudHVuaW5nLmE0fSlgO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIGNvbnN0IERFRkFVTFRfU0NBTEVfVEVNUExBVEUgPSBbMCwgMiwgMiwgMSwgMiwgMiwgMl07IC8vIG1ham9yXHJcbiAgIE9iamVjdC5mcmVlemUoREVGQVVMVF9TQ0FMRV9URU1QTEFURSk7XG5cbiAgIC8qKlxyXG4gICAgKiBNYXBzIHByZWRlZmluZWQgc2NhbGVzIHRvIHRoZWlyIG5hbWVzLlxyXG4gICAgKi9cclxuICAgY29uc3QgU2NhbGVUZW1wbGF0ZXMgPSB7XHJcbiAgICAgICB3aG9sZVRvbmU6IFswLCAyLCAyLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIC8vIG1ham9yXHJcbiAgICAgICBtYWpvcjogWzAsIDIsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgbWFqb3I3czRzNTogWzAsIDIsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gbW9kZXNcclxuICAgICAgIC8vIGlvbmlhbjogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWFqb3JcclxuICAgICAgIC8vIGFlb2xpYW46IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1pbm9yXHJcbiAgICAgICBkb3JpYW46IFswLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIHBocnlnaWFuOiBbMCwgMSwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICBseWRpYW46IFswLCAyLCAyLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIGx5ZGlhbkRvbWluYW50OiBbMCwgMiwgMiwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICAvLyBhY291c3RpYzogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbHlkaWFuRG9taW5hbnRcclxuICAgICAgIG1peG9seWRpYW46IFswLCAyLCAyLCAxLCAyLCAyLCAxXSxcclxuICAgICAgIG1peG9seWRpYW5GbGF0NjogWzAsIDIsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgbG9jcmlhbjogWzAsIDEsIDIsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgc3VwZXJMb2NyaWFuOiBbMCwgMSwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICAvLyBtaW5vclxyXG4gICAgICAgbWlub3I6IFswLCAyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIG1pbm9yN2I5OiBbMCwgMSwgMiwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBtaW5vcjdiNTogWzAsIDIsIDEsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgLy8gaGFsZkRpbWluaXNoZWQ6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1pbm9yN2I1XHJcbiAgICAgICAvLyBoYXJtb25pY1xyXG4gICAgICAgaGFybW9uaWNNYWpvcjogWzAsIDIsIDIsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgaGFybW9uaWNNaW5vcjogWzAsIDIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAgZG91YmxlSGFybW9uaWM6IFswLCAxLCAzLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIGJ5emFudGluZTogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgZG91YmxlSGFybW9uaWNcclxuICAgICAgIC8vIG1lbG9kaWNcclxuICAgICAgIG1lbG9kaWNNaW5vckFzY2VuZGluZzogWzAsIDIsIDEsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgbWVsb2RpY01pbm9yRGVzY2VuZGluZzogWzAsIDIsIDIsIDEsIDIsIDIsIDFdLFxyXG4gICAgICAgLy8gcGVudGF0b25pY1xyXG4gICAgICAgbWFqb3JQZW50YXRvbmljOiBbMCwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBtYWpvclBlbnRhdG9uaWNCbHVlczogWzAsIDIsIDEsIDEsIDMsIDJdLFxyXG4gICAgICAgbWlub3JQZW50YXRvbmljOiBbMCwgMywgMiwgMiwgM10sXHJcbiAgICAgICBtaW5vclBlbnRhdG9uaWNCbHVlczogWzAsIDMsIDIsIDEsIDEsIDNdLFxyXG4gICAgICAgYjVQZW50YXRvbmljOiBbMCwgMywgMiwgMSwgNCwgMl0sXHJcbiAgICAgICBtaW5vcjZQZW50YXRvbmljOiBbMCwgMywgMiwgMiwgMiwgM10sXHJcbiAgICAgICAvLyBlbmlnbWF0aWNcclxuICAgICAgIGVuaWdtYXRpY01ham9yOiBbMCwgMSwgMywgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBlbmlnbWF0aWNNaW5vcjogWzAsIDEsIDIsIDMsIDEsIDMsIDFdLFxyXG4gICAgICAgLy8gOFRvbmVcclxuICAgICAgIGRpbThUb25lOiBbMCwgMiwgMSwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBkb204VG9uZTogWzAsIDEsIDIsIDEsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgLy8gbmVhcG9saXRhblxyXG4gICAgICAgbmVhcG9saXRhbk1ham9yOiBbMCwgMSwgMiwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICBuZWFwb2xpdGFuTWlub3I6IFswLCAxLCAyLCAyLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIGh1bmdhcmlhblxyXG4gICAgICAgaHVuZ2FyaWFuTWFqb3I6IFswLCAzLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIGh1bmdhcmlhbk1pbm9yOiBbMCwgMiwgMSwgMywgMSwgMSwgM10sXHJcbiAgICAgICBodW5nYXJpYW5HeXBzeTogWzAsIDEsIDMsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gc3BhbmlzaFxyXG4gICAgICAgc3BhbmlzaDogWzAsIDEsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgc3BhbmlzaDhUb25lOiBbMCwgMSwgMiwgMSwgMSwgMSwgMiwgMl0sXHJcbiAgICAgICAvLyBqZXdpc2g6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIHNwYW5pc2g4VG9uZVxyXG4gICAgICAgc3BhbmlzaEd5cHN5OiBbMCwgMSwgMywgMSwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBhdWcgZG9tXHJcbiAgICAgICBhdWdtZW50ZWQ6IFswLCAzLCAxLCAzLCAxLCAzLCAxXSxcclxuICAgICAgIGRvbWluYW50U3VzcGVuZGVkOiBbMCwgMiwgMywgMiwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBiZWJvcFxyXG4gICAgICAgYmVib3BNYWpvcjogWzAsIDIsIDIsIDEsIDIsIDEsIDEsIDJdLFxyXG4gICAgICAgYmVib3BEb21pbmFudDogWzAsIDIsIDIsIDEsIDIsIDIsIDEsIDFdLFxyXG4gICAgICAgbXlzdGljOiBbMCwgMiwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBvdmVydG9uZTogWzAsIDIsIDIsIDIsIDEsIDEsIDJdLFxyXG4gICAgICAgbGVhZGluZ1RvbmU6IFswLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIC8vIGphcGFuZXNlXHJcbiAgICAgICBoaXJvam9zaGk6IFswLCAyLCAxLCA0LCAxXSxcclxuICAgICAgIGphcGFuZXNlQTogWzAsIDEsIDQsIDEsIDNdLFxyXG4gICAgICAgamFwYW5lc2VCOiBbMCwgMiwgMywgMSwgM10sXHJcbiAgICAgICAvLyBjdWx0dXJlc1xyXG4gICAgICAgb3JpZW50YWw6IFswLCAxLCAzLCAxLCAxLCAzLCAxXSxcclxuICAgICAgIHBlcnNpYW46IFswLCAxLCA0LCAxLCAyLCAzXSxcclxuICAgICAgIGFyYWJpYW46IFswLCAyLCAyLCAxLCAxLCAyLCAyXSxcclxuICAgICAgIGJhbGluZXNlOiBbMCwgMSwgMiwgNCwgMV0sXHJcbiAgICAgICBrdW1vaTogWzAsIDIsIDEsIDQsIDIsIDJdLFxyXG4gICAgICAgcGVsb2c6IFswLCAxLCAyLCAzLCAxLCAxXSxcclxuICAgICAgIGFsZ2VyaWFuOiBbMCwgMiwgMSwgMiwgMSwgMSwgMSwgM10sXHJcbiAgICAgICBjaGluZXNlOiBbMCwgNCwgMiwgMSwgNF0sXHJcbiAgICAgICBtb25nb2xpYW46IFswLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIGVneXB0aWFuOiBbMCwgMiwgMywgMiwgM10sXHJcbiAgICAgICByb21haW5pYW46IFswLCAyLCAxLCAzLCAxLCAyLCAxXSxcclxuICAgICAgIGhpbmR1OiBbMCwgMiwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBpbnNlbjogWzAsIDEsIDQsIDIsIDNdLFxyXG4gICAgICAgaXdhdG86IFswLCAxLCA0LCAxLCA0XSxcclxuICAgICAgIHNjb3R0aXNoOiBbMCwgMiwgMywgMiwgMl0sXHJcbiAgICAgICB5bzogWzAsIDMsIDIsIDIsIDNdLFxyXG4gICAgICAgaXN0cmlhbjogWzAsIDEsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgdWtyYW5pYW5Eb3JpYW46IFswLCAyLCAxLCAzLCAxLCAyLCAxXSxcclxuICAgICAgIHBldHJ1c2hrYTogWzAsIDEsIDMsIDIsIDEsIDNdLFxyXG4gICAgICAgYWhhdmFyYWJhOiBbMCwgMSwgMywgMSwgMiwgMSwgMl0sXHJcbiAgIH07XHJcbiAgIC8vIGR1cGxpY2F0ZXMgd2l0aCBhbGlhc2VzXHJcbiAgIFNjYWxlVGVtcGxhdGVzLmhhbGZEaW1pbmlzaGVkID0gU2NhbGVUZW1wbGF0ZXMubWlub3I3YjU7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmpld2lzaCA9IFNjYWxlVGVtcGxhdGVzLnNwYW5pc2g4VG9uZTtcclxuICAgU2NhbGVUZW1wbGF0ZXMuYnl6YW50aW5lID0gU2NhbGVUZW1wbGF0ZXMuZG91YmxlSGFybW9uaWM7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmFjb3VzdGljID0gU2NhbGVUZW1wbGF0ZXMubHlkaWFuRG9taW5hbnQ7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmFlb2xpYW4gPSBTY2FsZVRlbXBsYXRlcy5taW5vcjtcclxuICAgU2NhbGVUZW1wbGF0ZXMuaW9uaWFuID0gU2NhbGVUZW1wbGF0ZXMubWFqb3I7XHJcbiAgIE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKS5mb3JFYWNoKChlbGVtZW50KSA9PiBPYmplY3QuZnJlZXplKFNjYWxlVGVtcGxhdGVzW2VsZW1lbnRdKSk7XG5cbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgY29uc3QgbmFtZVJlZ2V4JDEgPSAvKFtBLUddKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4JDEgPSAvKCN8c3xiKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCQxID0gLyhbMC05XSspKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IHNjYWxlTmFtZVJlZ2V4ID0gLyhcXChbYS16QS1aXXsyLH1cXCkpL2c7XHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBwYXJzZSBhIG5vdGUgZnJvbSBhIHN0cmluZ1xyXG4gICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICAqIEBwYXJhbSBzdXByZXNzV2FybmluZyAtIHN1cHJlc3MgdGhlIHdhcm5pbmcgZm9yIGluZWZmZWNpZW5jeSBpZiB0cnVlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VTY2FsZSA9IChzY2FsZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzY2FsZUxvb2t1cChzY2FsZSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IHNjYWxlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtzY2FsZX0uIEdldCBhIHBlcmZvcm1hbmMgaW5jcmVhc2UgYnkgdXNpbmcgYSB2YWxpZCBmb3JtYXRgKTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IHNjYWxlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtzY2FsZX0uIEdldCBhIHBlcmZvcm1hbmMgaW5jcmVhc2UgYnkgdXNpbmcgYSB2YWxpZCBmb3JtYXRgKTtcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgbGV0IHNjYWxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBzY2FsZS5tYXRjaChuYW1lUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gc2NhbGUubWF0Y2gobW9kaWZpZXJSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gc2NhbGUubWF0Y2gob2N0YXZlUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVNYXRjaCA9IHNjYWxlLm1hdGNoKHNjYWxlTmFtZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChzY2FsZU5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNOYW1lID0gc2NhbGVOYW1lTWF0Y2guam9pbihcIlwiKTtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzTmFtZSk7XHJcbiAgICAgICAgICAgc2NhbGVOYW1lID0gc05hbWU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgbGV0IHRlbXBsYXRlSW5kZXggPSAxOyAvLyBkZWZhdWx0IG1ham9yIHNjYWxlXHJcbiAgICAgICAgICAgaWYgKHNjYWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZUluZGV4ID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpLmZpbmRJbmRleCgodGVtcGxhdGUpID0+IHRlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICAgICAgICAgLmluY2x1ZGVzKHNjYWxlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xcKHxcXCkvZywgXCJcIikpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpW3RlbXBsYXRlSW5kZXhdKTtcclxuICAgICAgICAgICBpZiAodGVtcGxhdGVJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTktOT1dOIFRFTVBMQVRFXCIsIHNjYWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgdGVtcGxhdGUgZm9yIHNjYWxlICR7c2NhbGVOYW1lfWApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzW09iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKVt0ZW1wbGF0ZUluZGV4XV07XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAga2V5OiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFNjYWxlOiAke3NjYWxlfWApO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDIgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBzY2FsZVRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgY29uc3QgdGVtcGxhdGVzID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiB0ZW1wbGF0ZXMpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVMYWJlbCBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgICAgICAvL2V4IEEobWlub3IpXHJcbiAgICAgICAgICAgICAgIHNjYWxlVGFibGVbYCR7bm90ZUxhYmVsfSgke3RlbXBsYXRlfSlgXSA9IHBhcnNlU2NhbGUobm90ZUxhYmVsLCB0cnVlKTsgLy8gJ0MnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9kIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke21vZH0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgIC8vIGV4IEEjKG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQyMnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPCBPQ1RBVkVfTUFYOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke2lPY3RhdmV9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBleCBBNChtaW5vcilcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0M0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBtb2Qgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke21vZH0ke2lPY3RhdmV9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gZXggQSM0KG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0MjNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBzY2FsZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyB0aGUgbG9va3VwIHRhYmxlIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBpcyBsb2FkZWRcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBsZXQgX3NjYWxlTG9va3VwID0ge307XHJcbiAgIGNvbnN0IHNjYWxlTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX3NjYWxlTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfc2NhbGVMb29rdXAgPSB0YWJsZSBhcyB7IFtrZXk6IHN0cmluZ106IFNjYWxlSW5pdGlhbGl6ZXIgfTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX3NjYWxlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZFNjYWxlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX3NjYWxlTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX3NjYWxlTG9va3VwO1xyXG4gICAgICAgX3NjYWxlTG9va3VwID0gY3JlYXRlVGFibGUkMigpO1xyXG4gICAgICAgLy8gT2JqZWN0LmZyZWV6ZShfc2NhbGVMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBUYWJsZSBCdWlsdFwiKTtcclxuICAgICAgIHJldHVybiBfc2NhbGVMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBzaGlmdHMgYW4gYXJyYXkgYnkgYSBnaXZlbiBkaXN0YW5jZVxyXG4gICAgKiBAcGFyYW0gYXJyIHRoZSBhcnJheSB0byBzaGlmdFxyXG4gICAgKiBAcGFyYW0gZGlzdGFuY2UgdGhlIGRpc3RhbmNlIHRvIHNoaWZ0XHJcbiAgICAqIEByZXR1cm5zIHRoZSBzaGlmdGVkIGFycmF5XHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2hpZnQgPSAoYXJyLCBkaXN0ID0gMSkgPT4ge1xyXG4gICAgICAgYXJyID0gWy4uLmFycl07IC8vIGNvcHlcclxuICAgICAgIGlmIChkaXN0ID4gYXJyLmxlbmd0aCB8fCBkaXN0IDwgMCAtIGFyci5sZW5ndGgpXHJcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hpZnQ6IGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiBhcnJheSBsZW5ndGhcIik7XHJcbiAgICAgICBpZiAoZGlzdCA+IDApIHtcclxuICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyLnNwbGljZShhcnIubGVuZ3RoIC0gZGlzdCwgSW5maW5pdHkpO1xyXG4gICAgICAgICAgIGFyci51bnNoaWZ0KC4uLnRlbXApO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGRpc3QgPCAwKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGVtcCA9IGFyci5zcGxpY2UoMCwgZGlzdCk7XHJcbiAgICAgICAgICAgYXJyLnB1c2goLi4udGVtcCk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gYXJyO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogIFNpbXBsZSB1dGlsIHRvIGxhenkgY2xvbmUgYW4gb2JqZWN0XHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2xvbmUgPSAob2JqKSA9PiB7XHJcbiAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIHNpbXBsZSB1dGlsIHRvIGxhenkgY2hlY2sgZXF1YWxpdHkgb2Ygb2JqZWN0cyBhbmQgYXJyYXlzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgaXNFcXVhbCA9IChhLCBiKSA9PiB7XHJcbiAgICAgICBjb25zdCBzdHJpbmdBID0gSlNPTi5zdHJpbmdpZnkoYSk7XHJcbiAgICAgICBjb25zdCBzdHJpbmdCID0gSlNPTi5zdHJpbmdpZnkoYik7XHJcbiAgICAgICByZXR1cm4gc3RyaW5nQSA9PT0gc3RyaW5nQjtcclxuICAgfTtcblxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVTdHJpbmdMb29rdXAuanNvblwiO1xyXG4gICAvKipcclxuICAgICogV2lsbCBsb29rdXAgYSBzY2FsZSBuYW1lIGJhc2VkIG9uIHRoZSB0ZW1wbGF0ZS5cclxuICAgICogQHBhcmFtIHRlbXBsYXRlIC0gdGhlIHRlbXBsYXRlIHRvIGxvb2t1cFxyXG4gICAgKiBAcGFyYW0gc3VwcmVzc1dhcm5pbmcgLSBzdXByZXNzIHRoZSB3YXJuaW5nIGZvciBpbmVmZmVjaWVuY3kgaWYgdHJ1ZVxyXG4gICAgKiBAcmV0dXJucyB0aGUgc2NhbGUgbmFtZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNjYWxlTmFtZUxvb2t1cCA9ICh0ZW1wbGF0ZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuYW1lVGFibGUoSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KVxyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVzID0gW107XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICBpZiAoaXNFcXVhbCh2YWx1ZXNbaV0sIHRlbXBsYXRlKSkge1xyXG4gICAgICAgICAgICAgICBzY2FsZU5hbWVzLnB1c2goa2V5c1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleXNbaV0uc2xpY2UoMSkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZXNTdHJpbmcgPSBzY2FsZU5hbWVzLmpvaW4oXCIgQUtBIFwiKTtcclxuICAgICAgIHJldHVybiBzY2FsZU5hbWVzU3RyaW5nO1xyXG4gICB9O1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQxID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICB0YWJsZVtKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSldID0gc2NhbGVOYW1lTG9va3VwKHRlbXBsYXRlLCB0cnVlKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgbGV0IF9uYW1lVGFibGUgPSB7fTtcclxuICAgY29uc3QgbmFtZVRhYmxlID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZU5hbWVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9uYW1lVGFibGVba2V5XTtcclxuICAgfTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9uYW1lVGFibGUgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25hbWVUYWJsZSA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRTY2FsZU5hbWVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfbmFtZVRhYmxlKS5sZW5ndGggPiAwKSByZXR1cm4gX25hbWVUYWJsZTtcclxuICAgICAgIF9uYW1lVGFibGUgPSBjcmVhdGVUYWJsZSQxKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9uYW1lVGFibGUpO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBuYW1lIHRhYmxlIGJ1aWx0XCIpO1xyXG4gICAgICAgcmV0dXJuIF9uYW1lVGFibGU7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTY2FsZXMgY29uc2lzdCBvZiBhIGtleSh0b25pYyBvciByb290KSBhbmQgYSB0ZW1wbGF0ZShhcnJheSBvZiBpbnRlZ2VycykgdGhhdFxyXG4gICAgKiA8YnI+IHJlcHJlc2VudHMgdGhlIGludGVydmFsIG9mIHN0ZXBzIGJldHdlZW4gZWFjaCBub3RlLlxyXG4gICAgKiA8YnI+PGJyPlNjYWxlIGludGVydmFscyBhcmUgcmVwcmVzZW50ZWQgYnkgYW4gaW50ZWdlclxyXG4gICAgKiA8YnI+dGhhdCBpcyB0aGUgbnVtYmVyIG9mIHNlbWl0b25lcyBiZXR3ZWVuIGVhY2ggbm90ZS5cclxuICAgICogPGJyPjAgPSBrZXkgLSB3aWxsIGFsd2F5cyByZXByZXNlbnQgdGhlIHRvbmljXHJcbiAgICAqIDxicj4xID0gaGFsZiBzdGVwXHJcbiAgICAqIDxicj4yID0gd2hvbGUgc3RlcFxyXG4gICAgKiA8YnI+MyA9IG9uZSBhbmQgb25lIGhhbGYgc3RlcHNcclxuICAgICogPGJyPjQgPSBkb3VibGUgc3RlcFxyXG4gICAgKiA8YnI+WzAsIDIsIDIsIDEsIDIsIDIsIDJdIHJlcHJlc2VudHMgdGhlIG1ham9yIHNjYWxlXHJcbiAgICAqIDxicj48YnI+IFNjYWxlIHRlbXBsYXRlcyBtYXkgaGF2ZSBhcmJpdHJheSBsZW5ndGhzXHJcbiAgICAqXHJcbiAgICAqIFRoZSBmb2xsb3dpbmcgUHJlLWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6XHJcbiAgICAqIDx0YWJsZT5cclxuICAgICogPHRyPlxyXG4gICAgKiA8dGQ+bWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+aW9uaWFuPC90ZD5cclxuICAgICogPHRkPmRvcmlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+cGhyeWdpYW48L3RkPlxyXG4gICAgKiA8dGQ+bHlkaWFuPC90ZD5cclxuICAgICogPHRkPm1peG9seWRpYW48L3RkPlxyXG4gICAgKiA8dGQ+YWVvbGlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bG9jcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5lbmlnbWF0aWNNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5lbmlnbWF0aWNNaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjdiNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqb3I3czRzNTwvdGQ+XHJcbiAgICAqIDx0ZD5oYXJtb25pY01ham9yPC90ZD5cclxuICAgICogPHRkPmhhcm1vbmljTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+ZG91YmxlSGFybW9uaWM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1lbG9kaWNNaW5vckFzY2VuZGluZzwvdGQ+XHJcbiAgICAqIDx0ZD5tZWxvZGljTWlub3JEZXNjZW5kaW5nPC90ZD5cclxuICAgICogPHRkPm1ham9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWlub3JQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1pbm9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICogPHRkPmI1UGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjZQZW50YXRvbmljPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kaW04VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5kb204VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5uZW9wb2xpdGFuTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+bmVvcG9saXRhbk1pbm9yPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5NYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5NaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5HeXBzeTwvdGQ+XHJcbiAgICAqIDx0ZD5zcGFuaXNoPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zcGFuaXNoOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+c3BhbmlzaEd5cHN5PC90ZD5cclxuICAgICogPHRkPmF1Z21lbnRlZDwvdGQ+XHJcbiAgICAqIDx0ZD5kb21pbmFudFN1c3BlbmRlZDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YmVib3BNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5iZWJvcERvbWluYW50PC90ZD5cclxuICAgICogPHRkPm15c3RpYzwvdGQ+XHJcbiAgICAqIDx0ZD5vdmVydG9uZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bGVhZGluZ1RvbmU8L3RkPlxyXG4gICAgKiA8dGQ+aGlyb2pvc2hpPC90ZD5cclxuICAgICogPHRkPmphcGFuZXNlQTwvdGQ+XHJcbiAgICAqIDx0ZD5qYXBhbmVzZUI8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm9yaWVudGFsPC90ZD5cclxuICAgICogPHRkPmFyYWJpYW48L3RkPlxyXG4gICAgKiA8dGQ+cGVyc2lhbjwvdGQ+XHJcbiAgICAqIDx0ZD5iYWxpbmVzZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+a3Vtb2k8L3RkPlxyXG4gICAgKiA8dGQ+cGVsb2c8L3RkPlxyXG4gICAgKiA8dGQ+YWxnZXJpYW48L3RkPlxyXG4gICAgKiA8dGQ+Y2hpbmVzZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bW9uZ29saWFuPC90ZD5cclxuICAgICogPHRkPmVneXB0aWFuPC90ZD5cclxuICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICogPHRkPnJvbWFuaWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAqIDx0ZD5pbnNlbjwvdGQ+XHJcbiAgICAqIDx0ZD5pd2F0bzwvdGQ+XHJcbiAgICAqIDx0ZD5zY290dGlzaDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+eW88L3RkPlxyXG4gICAgKiA8dGQ+aXN0cmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD51a3JhbmlhbkRvcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5wZXRydXNoa2E8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmFoYXZhcmFiYTwvdGQ+XHJcbiAgICAqIDx0ZD5oYWxmRGltaW5pc2hlZDwvdGQ+XHJcbiAgICAqIDx0ZD5qZXdpc2g8L3RkPlxyXG4gICAgKiA8dGQ+Ynl6YW50aW5lPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5hY291c3RpYzwvdGQ+XHJcbiAgICAqIDwvdGFibGU+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHtTY2FsZX0gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAqIGltcG9ydCB7U2NhbGVUZW1wbGF0ZXN9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgKiBpbXBvcnQge1NjYWxlSW5pdGlhbGl6ZXJ9IGZyb20gJ211c2ljdGhlb3J5anMnOyAvLyBUeXBlU2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgU2NhbGUge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHtTY2FsZSwgU2NhbGVUZW1wbGF0ZXN9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSBkZWZhdWx0IHRlbXBsYXRlLCBrZXkgMGYgMChDKSBhbmQgYW4gb2N0YXZlIG9mIDRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIHRlbXBsYXRlIFswLCAyLCAyLCAxLCAyLCAyLCAyXSBhbmQga2V5IDQoRSkgYW5kIG9jdGF2ZSA1XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBuZXcgU2NhbGUoe2tleTogNCwgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3J9KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiBub3RlLW5hbWVbYWx0ZXJhdGlvbl1bb2N0YXZlXVsoc2NhbGUtbmFtZSldXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgbWlub3IgdGVtcGxhdGUsIGtleSBHYiBhbmQgYW4gb2N0YXZlIG9mIDdcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMyA9IG5ldyBTY2FsZSgnR2I3KG1pbm9yKScpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBERUZBVUxUX1NDQUxFX1RFTVBMQVRFO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgdmFsdWVzID0gcGFyc2VTY2FsZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gWy4uLih2YWx1ZXM/LnRlbXBsYXRlID8/IERFRkFVTFRfU0NBTEVfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSB2YWx1ZXMua2V5IHx8IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSB8fCBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0aGF0IG9jdGF2ZSBpcyBzZXQgZmlyc3Qgc28gdGhhdFxyXG4gICAgICAgICAgICAgICAvLyBzZXR0aW5nIHRoZSBzZW1pdG9uZSBjYW4gY2hhbmdlIHRoZSBvY3RhdmVcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFsuLi4odmFsdWVzPy50ZW1wbGF0ZSA/PyBERUZBVUxUX1NDQUxFX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gdmFsdWVzLmtleSB8fCBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgfHwgREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgdW5pcXVlIGlkIGZvciB0aGlzIHNjYWxlKGF1dG8gZ2VuZXJhdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5pZCk7IC8vIGRobGtqNWozMjJcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzY2FsZSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gc2NhbGVcclxuICAgICAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzY2FsZSB0byBjb21wYXJlIHRvXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzY2FsZXMgYXJlIGVxdWFsXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZXF1YWxzKHNjYWxlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKHNjYWxlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuICh0aGlzLl9rZXkgPT09IHNjYWxlLl9rZXkgJiZcclxuICAgICAgICAgICAgICAgdGhpcy5fb2N0YXZlID09PSBzY2FsZS5fb2N0YXZlICYmXHJcbiAgICAgICAgICAgICAgIGlzRXF1YWwodGhpcy5fdGVtcGxhdGUsIHNjYWxlLl90ZW1wbGF0ZSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGlzIFNjYWxlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBTY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBzY2FsZS5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5lcXVhbHMoc2NhbGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmtleSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IGNsb25lKHRoaXMudGVtcGxhdGUpLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgIT09IDApXHJcbiAgICAgICAgICAgICAgIHNjYWxlLnNoaWZ0KHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgX2tleSA9IDA7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUua2V5KTsgLy8gMChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQga2V5KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9rZXk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNldHRpbmcgdGhlIHNlbWl0b25lIHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIDExXShzZW1pdG9uZSkgd2lsbDxici8+XHJcbiAgICAgICAgKiB3cmFwIHRoZSBzZW1pdG9uZSB0byB0aGUgcmFuZ2UgWzAsIDExXSBhbmQgY2hhbmdlIHRoZSBvY3RhdmUgZGVwZW5kaW5nPGJyLz5cclxuICAgICAgICAqIG9uIGhvdyBtYW55IHRpbWVzIHRoZSBzZW1pdG9uZSBoYXMgYmVlbiB3cmFwcGVkLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS5rZXkgPSA0O1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUua2V5KTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBrZXkodmFsdWUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcCh2YWx1ZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMub2N0YXZlID0gdGhpcy5vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHRoaXMuX2tleSA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5vY3RhdmUpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLm9jdGF2ZSA9IDU7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5vY3RhdmUpOyAvLyA1XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKHZhbHVlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdGVtcGxhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudGVtcGxhdGUpOyAvLyBbMCwgMiwgMiwgMSwgMiwgMiwgMl1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGNsb25lKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIGZvbGxvd2luZyBQcmUtZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTpcclxuICAgICAgICAqIDx0YWJsZT5cclxuICAgICAgICAqIDx0cj5cclxuICAgICAgICAqIDx0ZD5tYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmlvbmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9yaWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnBocnlnaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5seWRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPm1peG9seWRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmFlb2xpYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bG9jcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZW5pZ21hdGljTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmVuaWdtYXRpY01pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjdiNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWpvcjdzNHM1PC90ZD5cclxuICAgICAgICAqIDx0ZD5oYXJtb25pY01ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5oYXJtb25pY01pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb3VibGVIYXJtb25pYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tZWxvZGljTWlub3JBc2NlbmRpbmc8L3RkPlxyXG4gICAgICAgICogPHRkPm1lbG9kaWNNaW5vckRlc2NlbmRpbmc8L3RkPlxyXG4gICAgICAgICogPHRkPm1ham9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWlub3JQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YjVQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjZQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRpbThUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb204VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bmVvcG9saXRhbk1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5uZW9wb2xpdGFuTWlub3I8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbk1pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5HeXBzeTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2hHeXBzeTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXVnbWVudGVkPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb21pbmFudFN1c3BlbmRlZDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5iZWJvcE1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5iZWJvcERvbWluYW50PC90ZD5cclxuICAgICAgICAqIDx0ZD5teXN0aWM8L3RkPlxyXG4gICAgICAgICogPHRkPm92ZXJ0b25lPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmxlYWRpbmdUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5oaXJvam9zaGk8L3RkPlxyXG4gICAgICAgICogPHRkPmphcGFuZXNlQTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amFwYW5lc2VCPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm9yaWVudGFsPC90ZD5cclxuICAgICAgICAqIDx0ZD5hcmFiaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZXJzaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5iYWxpbmVzZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5rdW1vaTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGVsb2c8L3RkPlxyXG4gICAgICAgICogPHRkPmFsZ2VyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5jaGluZXNlPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1vbmdvbGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZWd5cHRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICAgICAqIDx0ZD5yb21hbmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aW5zZW48L3RkPlxyXG4gICAgICAgICogPHRkPml3YXRvPC90ZD5cclxuICAgICAgICAqIDx0ZD5zY290dGlzaDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD55bzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aXN0cmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+dWtyYW5pYW5Eb3JpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnBldHJ1c2hrYTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5haGF2YXJhYmE8L3RkPlxyXG4gICAgICAgICogPHRkPmhhbGZEaW1pbmlzaGVkPC90ZD5cclxuICAgICAgICAqIDx0ZD5qZXdpc2g8L3RkPlxyXG4gICAgICAgICogPHRkPmJ5emFudGluZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5hY291c3RpYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RhYmxlPlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS50ZW1wbGF0ZSA9IFswLCAyLCAyLCAxLCAyLCAyLCAyXTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRlbXBsYXRlKTsgLy8gWzAsIDIsIDIsIDEsIDIsIDIsIDJdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBjbG9uZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbm90ZXNcclxuICAgICAgICAqIG5vdGVzIGFyZSBnZW5lcmF0ZWQgYW5kIGNhY2hlZCBhcyBuZWVkZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgX25vdGVzID0gW107XHJcbiAgICAgICBfbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHdpbGwgZ2VuZXJhdGUgdGhlIG5vdGVzIGlmIG5lZWRlZCBvciByZXR1cm4gdGhlIGNhY2hlZCBub3Rlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5ub3Rlcyk7IC8vIExpc3Qgb2Ygbm90ZXNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgbm90ZXMoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX25vdGVzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBnZW5lcmF0ZSBub3RlcyhpbnRlcm5hbClcclxuICAgICAgICAqIGdlbmVyYXRlcyB0aGUgbm90ZXMgZm9yIHRoaXMgc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2VuZXJhdGVOb3RlcygpIHtcclxuICAgICAgICAgICAvLyB1c2UgdGhlIHRlbXBsYXRlIHVuc2hpZnRlZCBmb3Igc2ltcGxpY2l0eVxyXG4gICAgICAgICAgIGNvbnN0IHVuc2hpZnRlZFRlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIC10aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgIC8vIGlmIGFsbG93aW5nIHRoaXMgdG8gY2hhbmdlIHRoZSBvY3RhdmUgaXMgdW5kZXNpcmFibGVcclxuICAgICAgICAgICAvLyB0aGVuIG1heSBuZWVkIHRvIHByZSB3cmFwIHRoZSB0b25lIGFuZCB1c2VcclxuICAgICAgICAgICAvLyB0aGUgZmluYWwgdmFsdWVcclxuICAgICAgICAgICBjb25zdCBub3RlcyA9IFtdO1xyXG4gICAgICAgICAgIGxldCBhY2N1bXVsYXRvciA9IHRoaXMua2V5O1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdW5zaGlmdGVkVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdG9uZSA9IGludGVydmFsID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICA/IChhY2N1bXVsYXRvciA9IHRoaXMua2V5KVxyXG4gICAgICAgICAgICAgICAgICAgOiAoYWNjdW11bGF0b3IgKz0gaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlID0gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRvbmUsXHJcbiAgICAgICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgbm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gc2hpZnQgbm90ZXMgYmFjayB0byBvcmlnaW5hbCBwb3NpdGlvblxyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPiAwKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBub3Rlcy5zcGxpY2Uobm90ZXMubGVuZ3RoIC0gKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCArIDEpLCBJbmZpbml0eSk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnVuc2hpZnQoLi4udGVtcCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPCAwKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBub3Rlcy5zcGxpY2UoMCwgdGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgbm90ZXMucHVzaCguLi50ZW1wKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXMgPSBub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG5vdGVzIGluIHRoZSBzY2FsZVxyXG4gICAgICAgICogQHBhcmFtIHByZWZlclNoYXJwS2V5cyAtIGlmIHRydWUgdGhlbiBzaGFycHMgd2lsbCBiZSBwcmVmZXJyZWQgb3ZlciBmbGF0cyB3aGVuIHNlbWl0b25lcyBjb3VsZCBiZSBlaXRoZXIgLSBleDogQmIvQSNcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgbm90ZXMgaW4gdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm5hbWVzKTsgLy8gWydDNCcsICdENCcsICdFNCcsICdGNCcsICdHNCcsICdBNCcsICdCNCddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0Tm90ZU5hbWVzKHByZWZlclNoYXJwS2V5ID0gdHJ1ZSkge1xyXG4gICAgICAgICAgIGNvbnN0IG5hbWVzID0gc2NhbGVOb3RlTmFtZUxvb2t1cCh0aGlzLCBwcmVmZXJTaGFycEtleSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG5hbWVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBkZWdyZWVcclxuICAgICAgICAqIHJldHVybnMgYSBub3RlIHRoYXQgcmVwcmVzZW50cyB0aGUgZ2l2ZW4gZGVncmVlXHJcbiAgICAgICAgKiBAcGFyYW0gZGVncmVlIC0gdGhlIGRlZ3JlZSB0byByZXR1cm5cclxuICAgICAgICAqIEByZXR1cm5zIGEgbm90ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGRlZ3JlZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kZWdyZWUoMCkpOyAvLyBDNChOb3RlKVxyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZGVncmVlKDEpKTsgLy8gRDQoTm90ZSkgZXRjXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGVncmVlKGRlZ3JlZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKGRlZ3JlZSAtIDEgLyp6ZXJvIGluZGV4ICovLCAwLCB0aGlzLm5vdGVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLm5vdGVzW3dyYXBwZWQudmFsdWVdLmNvcHkoKTtcclxuICAgICAgICAgICBub3RlLm9jdGF2ZSA9IHRoaXMub2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICByZXR1cm4gbm90ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmVsYXRpdmUgbWFqb3JcclxuICAgICAgICAqIHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWFqb3Igb2YgdGhpcyBzY2FsZSAtIHRha2VzIHRoZSAzcmQgZGVncmVlIGFzIGl0J3Mga2V5XHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtYWpvciBvZiB0aGlzIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnJlbGF0aXZlTWFqb3IoKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcmVsYXRpdmVNYWpvcigpIHtcclxuICAgICAgICAgICBjb25zdCBtYWpvciA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5tYWpvcixcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmRlZ3JlZSgzKS5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICByZXR1cm4gbWFqb3I7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJlbGF0aXZlIG1pbm9yXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1pbm9yIG9mIHRoaXMgc2NhbGUgLSB0YWtlcyB0aGUgNnRoIGRlZ3JlZSBhcyBpdCdzIGtleVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWlub3Igb2YgdGhpcyBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5yZWxhdGl2ZU1pbm9yKCkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHJlbGF0aXZlTWlub3IoKSB7XHJcbiAgICAgICAgICAgY29uc3QgbWlub3IgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWlub3IsXHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5kZWdyZWUoNikuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG1pbm9yO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdFxyXG4gICAgICAgICovXHJcbiAgICAgICBfc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgIF9vcmlnaW5hbFRlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0XHJcbiAgICAgICAgKiBzaGlmdHMgdGhlIHNjYWxlIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHBhcmFtIHNoaWZ0IC0gdGhlIG51bWJlciBvZiBkZWdyZWVzIHRvIHNoaWZ0IHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgc2hpZnRlZCBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnQoZGVncmVlcyA9IDEpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsVGVtcGxhdGUgPSBjbG9uZSh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIGRlZ3JlZXMpO1xyXG4gICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCArPSBkZWdyZWVzO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdGVkXHJcbiAgICAgICAgKiByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcGFyYW0gZGVncmVlcyAtIHRoZSBudW1iZXIgb2YgZGVncmVlcyB0byBzaGlmdCB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0ZWQoMSkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0ZWQoZGVncmVlcyA9IDEpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnNoaWZ0KGRlZ3JlZXMpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5zaGlmdFxyXG4gICAgICAgICogc2hpZnRzIHRoZSBvcmlnaW5hbCByb290IGJhY2sgdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoaXMgc2NhbGUgYWZ0ZXIgdW5zaGlmdGluZyBpdCBiYWNrIHRvIHRoZSBvcmlnaW5hbCByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnVuc2hpZnQoKSk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdW5zaGlmdCgpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFRlbXBsYXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvLyB0aGlzLnNoaWZ0KHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAqIC0xKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuc2hpZnRlZFxyXG4gICAgICAgICogcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSB3aXRoIHRoZSB0b25pYyBzaGlmdGVkIGJhY2tcclxuICAgICAgICAqIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSB3aXRoIHRoZSB0b25pYyBzaGlmdGVkIGJhY2tcclxuICAgICAgICAqIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnVuc2hpZnRlZCgpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB1bnNoaWZ0ZWQoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxUZW1wbGF0ZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZTtcclxuICAgICAgICAgICBzY2FsZS51bnNoaWZ0KCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSBhbW91bnQgdGhhdCB0aGUgc2NhbGUgaGFzIHNoaWZ0ZWRcclxuICAgICAgICAqICgwIGlmIG5vdCBzaGlmdGVkKVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGFtb3VudCB0aGF0IHRoZSBzY2FsZSBoYXMgc2hpZnRlZFxyXG4gICAgICAgICogKDAgaWYgbm90IHNoaWZ0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0ZWQoKSk7IC8vIDFcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdGVkSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2NhbGUgbW9kZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgSW9uaWFuKG1ham9yKSBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmlvbmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpb25pYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmlvbmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBEb3JpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kb3JpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZG9yaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5kb3JpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgUGhyeWdpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5waHJ5Z2lhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBwaHJ5Z2lhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMucGhyeWdpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTHlkaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubHlkaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGx5ZGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubHlkaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIE1peG9seWRpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5taXhvbHlkaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1peG9seWRpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLm1peG9seWRpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgQWVvbGlhbihtaW5vcikgbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5hZW9saWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGFlb2xpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmFlb2xpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTG9jcmlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmxvY3JpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbG9jcmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubG9jcmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgc3RyaW5nIHZlcnNpb24gb2YgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBzdHJpbmcgdmVyc2lvbiBvZiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudG9TdHJpbmcoKSk7IC8vICdDJ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIGxldCBzY2FsZU5hbWVzID0gc2NhbGVOYW1lTG9va3VwKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgICAgICBpZiAoIXNjYWxlTmFtZXMpXHJcbiAgICAgICAgICAgICAgIHNjYWxlTmFtZXMgPSB0aGlzLmdldE5vdGVOYW1lcygpLmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICByZXR1cm4gYCR7U2VtaXRvbmUkMVt0aGlzLl9rZXldfSR7dGhpcy5fb2N0YXZlfSgke3NjYWxlTmFtZXN9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIGxvb2t1cCB0aGUgbm90ZSBuYW1lIGZvciBhIHNjYWxlIGVmZmljaWVudGx5XHJcbiAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzY2FsZSB0byBsb29rdXBcclxuICAgICogQHBhcmFtIHByZWZlclNoYXJwS2V5IC0gaWYgdHJ1ZSwgd2lsbCBwcmVmZXIgc2hhcnAga2V5cyBvdmVyIGZsYXQga2V5c1xyXG4gICAgKiBAcmV0dXJucyB0aGUgbm90ZSBuYW1lcyBmb3IgdGhlIHNjYWxlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2NhbGVOb3RlTmFtZUxvb2t1cCA9IChzY2FsZSwgcHJlZmVyU2hhcnBLZXkgPSB0cnVlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke3NjYWxlLmtleX0tJHtzY2FsZS5vY3RhdmV9LSR7SlNPTi5zdHJpbmdpZnkoc2NhbGUudGVtcGxhdGUpfWA7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZXMgPSBub3Rlc0xvb2t1cChrZXkpO1xyXG4gICAgICAgICAgIGlmIChub3Rlcykge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZXMgPSBbLi4uc2NhbGUubm90ZXNdO1xyXG4gICAgICAgbm90ZXMgPSBzaGlmdChub3RlcywgLXNjYWxlLnNoaWZ0ZWRJbnRlcnZhbCgpKTsgLy91bnNoaWZ0IGJhY2sgdG8ga2V5ID0gMCBpbmRleFxyXG4gICAgICAgY29uc3Qgbm90ZXNQYXJ0cyA9IG5vdGVzLm1hcCgobm90ZSkgPT4gbm90ZS50b1N0cmluZygpLnNwbGl0KFwiL1wiKSk7XHJcbiAgICAgICBjb25zdCBvY3RhdmVzID0gbm90ZXMubWFwKChub3RlKSA9PiBub3RlLm9jdGF2ZSk7XHJcbiAgICAgICBjb25zdCByZW1vdmFibGVzID0gW1wiQiNcIiwgXCJCc1wiLCBcIkNiXCIsIFwiRSNcIiwgXCJFc1wiLCBcIkZiXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU5hbWVzID0gW107XHJcbiAgICAgICBmb3IgKGNvbnN0IFtpLCBub3RlUGFydHNdIG9mIG5vdGVzUGFydHMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgLy9yZW1vdmUgQ2IgQiMgZXRjXHJcbiAgICAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIG5vdGVQYXJ0cykge1xyXG4gICAgICAgICAgICAgICAvLyByZW1vdmUgYW55IG51bWJlcnMgZnJvbSB0aGUgbm90ZSBuYW1lKG9jdGF2ZSlcclxuICAgICAgICAgICAgICAgLy8gcGFydC5yZXBsYWNlKC9cXGQvZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgIGlmIChyZW1vdmFibGVzLmluY2x1ZGVzKHBhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IG5vdGVOYW1lcy5pbmRleE9mKHBhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgbm90ZU5hbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKG5vdGVOYW1lcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gocHJlZmVyU2hhcnBLZXkgPyBub3RlUGFydHNbMF0gOiBub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChub3RlUGFydHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCB3aG9sZU5vdGVzID0gW1xyXG4gICAgICAgICAgICAgICBcIkFcIixcclxuICAgICAgICAgICAgICAgXCJCXCIsXHJcbiAgICAgICAgICAgICAgIFwiQ1wiLFxyXG4gICAgICAgICAgICAgICBcIkRcIixcclxuICAgICAgICAgICAgICAgXCJFXCIsXHJcbiAgICAgICAgICAgICAgIFwiRlwiLFxyXG4gICAgICAgICAgICAgICBcIkdcIixcclxuICAgICAgICAgICAgICAgXCJBXCIsXHJcbiAgICAgICAgICAgICAgIFwiQlwiLFxyXG4gICAgICAgICAgICAgICBcIkNcIixcclxuICAgICAgICAgICAgICAgXCJEXCIsXHJcbiAgICAgICAgICAgICAgIFwiRVwiLFxyXG4gICAgICAgICAgICAgICBcIkZcIixcclxuICAgICAgICAgICAgICAgXCJHXCIsXHJcbiAgICAgICAgICAgXTtcclxuICAgICAgICAgICBjb25zdCBsYXN0V2hvbGVOb3RlID0gbm90ZU5hbWVzW25vdGVOYW1lcy5sZW5ndGggLSAxXVswXTtcclxuICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSB3aG9sZU5vdGVzLmluZGV4T2YobGFzdFdob2xlTm90ZSk7XHJcbiAgICAgICAgICAgY29uc3QgbmV4dE5vdGUgPSB3aG9sZU5vdGVzW2xhc3RJbmRleCArIDFdO1xyXG4gICAgICAgICAgIGlmIChub3RlUGFydHNbMF0uaW5jbHVkZXMobmV4dE5vdGUpKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGhhc09jdGF2ZSA9IG5vdGVQYXJ0c1swXS5tYXRjaCgvXFxkL2cpO1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbMF0gKyAoaGFzT2N0YXZlID8gXCJcIiA6IG9jdGF2ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IGhhc09jdGF2ZSA9IG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0ubWF0Y2goL1xcZC9nKTtcclxuICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdICsgKGhhc09jdGF2ZSA/IFwiXCIgOiBvY3RhdmVzW2ldKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBzaGlmdGVkTm90ZU5hbWVzID0gc2hpZnQobm90ZU5hbWVzLCBzY2FsZS5zaGlmdGVkSW50ZXJ2YWwoKSk7XHJcbiAgICAgICByZXR1cm4gc2hpZnRlZE5vdGVOYW1lcztcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZU5vdGVzTG9va3VwVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBzY2FsZVRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpdG9uZSA9IFRPTkVTX01JTjsgaXRvbmUgPCBUT05FU19NSU4gKyBPQ1RBVkVfTUFYOyBpdG9uZSsrKSB7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaW9jdGF2ZSA9IE9DVEFWRV9NSU47IGlvY3RhdmUgPD0gT0NUQVZFX01BWDsgaW9jdGF2ZSsrKSB7XHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGl0b25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IGlvY3RhdmUsXHJcbiAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVbYCR7aXRvbmV9LSR7aW9jdGF2ZX0tJHtKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSl9YF0gPVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTm90ZU5hbWVMb29rdXAoc2NhbGUpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHNjYWxlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIHRoZSBsb29rdXAgdGFibGUgYXMgc29vbiBhcyB0aGUgbW9kdWxlIGlzIGxvYWRlZFxyXG4gICAgKi9cclxuICAgbGV0IF9ub3Rlc0xvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3Rlc0xvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVOb3RlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZXNMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgY29uc3QgYnVpbGRTY2FsZU5vdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfbm90ZXNMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfbm90ZXNMb29rdXA7XHJcbiAgICAgICBfbm90ZXNMb29rdXAgPSBjcmVhdGVOb3Rlc0xvb2t1cFRhYmxlKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3Rlc0xvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IHNjYWxlIG5vdGUgdGFibGVcIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVzTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2hvcnRjdXQgZm9yIG1vZGlmaWVyc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGZsYXQgPSAtMTtcclxuICAgY29uc3QgZmxhdF9mbGF0ID0gLTI7XHJcbiAgIGNvbnN0IHNoYXJwID0gMTtcclxuICAgLyoqXHJcbiAgICAqIENob3JkIHRlbXBsYXRlc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IENob3JkVGVtcGxhdGVzID0ge1xyXG4gICAgICAgbWFqOiBbMSwgMywgNV0sXHJcbiAgICAgICBtYWo0OiBbMSwgMywgNCwgNV0sXHJcbiAgICAgICBtYWo2OiBbMSwgMywgNSwgNl0sXHJcbiAgICAgICBtYWo2OTogWzEsIDMsIDUsIDYsIDldLFxyXG4gICAgICAgbWFqNzogWzEsIDMsIDUsIDddLFxyXG4gICAgICAgbWFqOTogWzEsIDMsIDUsIDcsIDldLFxyXG4gICAgICAgbWFqMTE6IFsxLCAzLCA1LCA3LCA5LCAxMV0sXHJcbiAgICAgICBtYWoxMzogWzEsIDMsIDUsIDcsIDksIDExLCAxM10sXHJcbiAgICAgICBtYWo3czExOiBbMSwgMywgNSwgNywgWzExLCBzaGFycF1dLFxyXG4gICAgICAgbWFqYjU6IFsxLCAzLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgbWluOiBbMSwgWzMsIGZsYXRdLCA1XSxcclxuICAgICAgIG1pbjQ6IFsxLCBbMywgZmxhdF0sIDQsIDVdLFxyXG4gICAgICAgbWluNjogWzEsIFszLCBmbGF0XSwgNSwgNl0sXHJcbiAgICAgICBtaW43OiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF1dLFxyXG4gICAgICAgbWluQWRkOTogWzEsIFszLCBmbGF0XSwgNSwgOV0sXHJcbiAgICAgICBtaW42OTogWzEsIFszLCBmbGF0XSwgNSwgNiwgOV0sXHJcbiAgICAgICBtaW45OiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgbWluMTE6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOSwgMTFdLFxyXG4gICAgICAgbWluMTM6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOSwgMTEsIDEzXSxcclxuICAgICAgIG1pbjdiNTogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tNzogWzEsIDMsIDUsIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb205OiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTExOiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5LCAxMV0sXHJcbiAgICAgICBkb20xMzogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOSwgMTEsIDEzXSxcclxuICAgICAgIGRvbTdzNTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203YjU6IFsxLCAzLCBbNSwgZmxhdF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203Yjk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFs5LCBmbGF0XV0sXHJcbiAgICAgICBkb203czk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFs5LCBzaGFycF1dLFxyXG4gICAgICAgZG9tOXM1OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTliNTogWzEsIDMsIFs1LCBmbGF0XSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTdzNXM5OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCBbOSwgc2hhcnBdXSxcclxuICAgICAgIGRvbTdzNWI5OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCBbOSwgZmxhdF1dLFxyXG4gICAgICAgZG9tN3MxMTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzExLCBzaGFycF1dLFxyXG4gICAgICAgZGltOiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgZGltNzogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdLCBbNywgZmxhdF9mbGF0XV0sXHJcbiAgICAgICBhdWc6IFsxLCAzLCBbNSwgc2hhcnBdXSxcclxuICAgICAgIHN1czI6IFsxLCAyLCA1XSxcclxuICAgICAgIHN1czQ6IFsxLCBbNCwgZmxhdF0sIDVdLFxyXG4gICAgICAgZmlmdGg6IFsxLCA1XSxcclxuICAgICAgIGI1OiBbMSwgWzUsIGZsYXRdXSxcclxuICAgICAgIHMxMTogWzEsIDUsIFsxMSwgc2hhcnBdXSxcclxuICAgfTtcclxuICAgT2JqZWN0LmtleXMoQ2hvcmRUZW1wbGF0ZXMpLmZvckVhY2goKGVsZW1lbnQpID0+IE9iamVjdC5mcmVlemUoQ2hvcmRUZW1wbGF0ZXNbZWxlbWVudF0pKTtcblxuICAgY29uc3QgREVGQVVMVF9DSE9SRF9URU1QTEFURSA9IFsxLCAzLCA1XTtcclxuICAgY29uc3QgREVGQVVMVF9TQ0FMRSA9IG5ldyBTY2FsZSgpO1xuXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZUxvb2t1cC5qc29uXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgY29uc3QgbmFtZVJlZ2V4ID0gLyhbQS1HXSkoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCA9IC8oI3xzfGIpKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4ID0gLyhbMC05XSspKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IGNob3JkTmFtZVJlZ2V4ID0gLyhtaW58bWFqfGRpbXxhdWcpKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IGFkZGl0aW9uc1JlZ2V4ID0gLyhbI3xzfGJdP1swLTldKykoPyFbXihdKlxcKSkvZztcclxuICAgLyoqXHJcbiAgICAqIEBwYXJhbSBjaG9yZCB0aGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICAqIEByZXR1cm5zIGEgdmFsaWQgQ2hvcmRJbml0aWFsaXplclxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlQ2hvcmQgPSAoY2hvcmQpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hvcmRMb29rdXAoY2hvcmQpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBsZXQgY2hvcmROYW1lID0gXCJtYWpcIjtcclxuICAgICAgIGxldCBhZGRpdGlvbnMgPSBbXTtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IGNob3JkLm1hdGNoKG5hbWVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gY2hvcmQubWF0Y2gobW9kaWZpZXJSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IGNob3JkLm1hdGNoKG9jdGF2ZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IGNob3JkTmFtZU1hdGNoID0gY2hvcmQubWF0Y2goY2hvcmROYW1lUmVnZXgpPy5qb2luKFwiXCIpO1xyXG4gICAgICAgY29uc3QgYWRkaXRpb25zTWF0Y2ggPSBjaG9yZC5tYXRjaChhZGRpdGlvbnNSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoY2hvcmROYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICAvLyBjb25zdCBbbmFtZV0gPSBjaG9yZE5hbWVNYXRjaDtcclxuICAgICAgICAgICBjaG9yZE5hbWUgPSBjaG9yZE5hbWVNYXRjaDtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChhZGRpdGlvbnNNYXRjaCkge1xyXG4gICAgICAgICAgIGFkZGl0aW9ucyA9IGFkZGl0aW9uc01hdGNoO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3QgaW50ZXJ2YWxzID0gW107XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgaW50ZXJ2YWxzLnB1c2goLi4uQ2hvcmRUZW1wbGF0ZXNbY2hvcmROYW1lXSk7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBhZGRpdGlvbiBvZiBhZGRpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgbGV0IG1vZCA9IDA7XHJcbiAgICAgICAgICAgICAgIGlmIChhZGRpdGlvblswXSA9PT0gXCIjXCIgfHwgYWRkaXRpb25bMF0gPT09IFwic1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgYWRkaXRpb25zLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSBpZiAoYWRkaXRpb25bMF0gPT09IFwiYlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uTnVtID0gcGFyc2VJbnQoYWRkaXRpb24sIDEwKTtcclxuICAgICAgICAgICAgICAgaWYgKGludGVydmFscy5pbmNsdWRlcyhhZGRpdGlvbk51bSkpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaW50ZXJ2YWxzLmluZGV4T2YoYWRkaXRpb25OdW0pO1xyXG4gICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxzW2luZGV4XSA9IFthZGRpdGlvbk51bSwgbW9kXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIGludGVydmFscy5wdXNoKFthZGRpdGlvbk51bSwgbW9kXSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgcm9vdDogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogaW50ZXJ2YWxzLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNob3JkIG5hbWVcIik7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBAcmV0dXJucyBhIGxvb2t1cCB0YWJsZSBvZiBjaG9yZCBuYW1lcyBhbmQgdGhlaXIgaW5pdGlhbGl6ZXJzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGNvbnN0IHF1YWxpdGllcyA9IFtcIm1halwiLCBcIm1pblwiLCBcImRpbVwiLCBcImF1Z1wiLCBcInN1c1wiXTtcclxuICAgICAgIGNvbnN0IGFkZGl0aW9ucyA9IFtcclxuICAgICAgICAgICBcIlwiLFxyXG4gICAgICAgICAgIFwiMlwiLFxyXG4gICAgICAgICAgIFwiM1wiLFxyXG4gICAgICAgICAgIFwiNFwiLFxyXG4gICAgICAgICAgIFwiNVwiLFxyXG4gICAgICAgICAgIFwiNlwiLFxyXG4gICAgICAgICAgIFwiN1wiLFxyXG4gICAgICAgICAgIFwiOVwiLFxyXG4gICAgICAgICAgIFwiMTFcIixcclxuICAgICAgICAgICBcIjEzXCIsXHJcbiAgICAgICAgICAgXCJiMlwiLFxyXG4gICAgICAgICAgIFwiYjNcIixcclxuICAgICAgICAgICBcImI0XCIsXHJcbiAgICAgICAgICAgXCJiNVwiLFxyXG4gICAgICAgICAgIFwiYjZcIixcclxuICAgICAgICAgICBcImI3XCIsXHJcbiAgICAgICAgICAgXCJiOVwiLFxyXG4gICAgICAgICAgIFwiYjExXCIsXHJcbiAgICAgICAgICAgXCJiMTNcIixcclxuICAgICAgICAgICBcInMyXCIsXHJcbiAgICAgICAgICAgXCJzM1wiLFxyXG4gICAgICAgICAgIFwiczRcIixcclxuICAgICAgICAgICBcInM1XCIsXHJcbiAgICAgICAgICAgXCJzNlwiLFxyXG4gICAgICAgICAgIFwiczdcIixcclxuICAgICAgICAgICBcInM5XCIsXHJcbiAgICAgICAgICAgXCJzMTFcIixcclxuICAgICAgICAgICBcInMxM1wiLFxyXG4gICAgICAgICAgIFwiIzJcIixcclxuICAgICAgICAgICBcIiMzXCIsXHJcbiAgICAgICAgICAgXCIjNFwiLFxyXG4gICAgICAgICAgIFwiIzVcIixcclxuICAgICAgICAgICBcIiM2XCIsXHJcbiAgICAgICAgICAgXCIjN1wiLFxyXG4gICAgICAgICAgIFwiIzlcIixcclxuICAgICAgICAgICBcIiMxMVwiLFxyXG4gICAgICAgICAgIFwiIzEzXCIsXHJcbiAgICAgICAgICAgXCI3czExXCIsXHJcbiAgICAgICAgICAgXCI3IzExXCIsXHJcbiAgICAgICAgICAgXCI3YjlcIixcclxuICAgICAgICAgICBcIjcjOVwiLFxyXG4gICAgICAgICAgIFwiN2I1XCIsXHJcbiAgICAgICAgICAgXCI3IzVcIixcclxuICAgICAgICAgICBcIjdiOWI1XCIsXHJcbiAgICAgICAgICAgXCI3IzkjNVwiLFxyXG4gICAgICAgICAgIFwiN2IxM1wiLFxyXG4gICAgICAgICAgIFwiNyMxM1wiLFxyXG4gICAgICAgICAgIFwiOSM1XCIsXHJcbiAgICAgICAgICAgXCI5YjVcIixcclxuICAgICAgICAgICBcIjkjMTFcIixcclxuICAgICAgICAgICBcIjliMTFcIixcclxuICAgICAgICAgICBcIjkjMTNcIixcclxuICAgICAgICAgICBcIjliMTNcIixcclxuICAgICAgICAgICBcIjExIzVcIixcclxuICAgICAgICAgICBcIjExYjVcIixcclxuICAgICAgICAgICBcIjExIzlcIixcclxuICAgICAgICAgICBcIjExYjlcIixcclxuICAgICAgICAgICBcIjExIzEzXCIsXHJcbiAgICAgICAgICAgXCIxMWIxM1wiLFxyXG4gICAgICAgXTtcclxuICAgICAgIGZvciAoY29uc3QgcXVhbGl0eSBvZiBxdWFsaXRpZXMpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGl0aW9uIG9mIGFkZGl0aW9ucykge1xyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVMZXR0ZXIgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZU1vZGlmaWVyIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0ke25vdGVNb2RpZmllcn0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBPQ1RBVkVfTUlOOyBpIDw9IE9DVEFWRV9NQVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0ke25vdGVNb2RpZmllcn0ke2l9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBsZXQgX2Nob3JkTG9va3VwID0ge307XHJcbiAgIC8qKlxyXG4gICAgKiBAcGFyYW0ga2V5IHRoZSBzdHJpbmcgdG8gbG9va3VwXHJcbiAgICAqIEByZXR1cm5zIGEgdmFsaWQgY2hvcmQgaW5pdGlhbGl6ZXJcclxuICAgICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUga2V5IGlzIG5vdCBhIHZhbGlkIGNob3JkXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2hvcmRMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZENob3JkVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfY2hvcmRMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gdGFibGUgYXMgeyBba2V5OiBzdHJpbmddOiBDaG9yZEluaXRpYWxpemVyIH07XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRDaG9yZFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9jaG9yZExvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9jaG9yZExvb2t1cDtcclxuICAgICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9jaG9yZExvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IGNob3JkIHRhYmxlXCIpO1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmVudHJpZXMoX2Nob3JkTG9va3VwKS5sZW5ndGgpO1xyXG4gICAgICAgcmV0dXJuIF9jaG9yZExvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIENob3JkcyBjb25zaXN0IG9mIGEgcm9vdCBub3RlLCBvY3RhdmUsIGNob3JkIHRlbXBsYXRlLCBhbmQgYSBiYXNlIHNjYWxlLjxicj48YnI+XHJcbiAgICAqIFRoZSBjaG9yZCB0ZW1wbGF0ZSBpcyBhbiBhcnJheSBvZiBpbnRlZ2VycywgZWFjaCBpbnRlZ2VyIHJlcHJlc2VudGluZzxicj5cclxuICAgICogIGEgc2NhbGUgZGVncmVlIGZyb20gdGhlIGJhc2Ugc2NhbGUoZGVmYXVsdHMgdG8gbWFqb3IpLjxicj5cclxuICAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgaXMgdGhlIEksSUlJLFYgZGVub3RlZCBhcyBbMSwzLDVdPGJyPlxyXG4gICAgKiBDaG9yZEludGVydmFscyB1c2VkIGluIHRlbXBsYXRlcyBjYW4gYWxzbyBjb250YWluIGEgbW9kaWZpZXIsPGJyPlxyXG4gICAgKiBmb3IgYSBwYXJ0aWN1bGFyIHNjYWxlIGRlZ3JlZSwgc3VjaCBhcyBbMSwzLFs1LCAtMV1dPGJyPlxyXG4gICAgKiB3aGVyZSAtMSBpcyBmbGF0LCAwIGlzIG5hdHVyYWwsIGFuZCAxIGlzIHNoYXJwLjxicj5cclxuICAgICogSXQgY291bGQgYWxzbyBiZSB3cml0dGVuIGFzIFsxLDMsWzUsIG1vZGlmaWVyLmZsYXRdXTxicj5cclxuICAgICogaWYgeW91IGltcG9ydCBtb2RpZmllci5cclxuICAgICpcclxuICAgICogVGhlIGZvbGxvd2luZyBwcmVkZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOjxicj5cclxuICAgICogPHRhYmxlPlxyXG4gICAgKiA8dHI+XHJcbiAgICAqIDx0ZD5tYWo8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNDwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo2PC90ZD5cclxuICAgICogPHRkPm1hajY5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWo3PC90ZD5cclxuICAgICogPHRkPm1hajk8L3RkPlxyXG4gICAgKiA8dGQ+bWFqMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWFqMTM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1hajdzMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWFqYjU8L3RkPlxyXG4gICAgKiA8dGQ+bWluPC90ZD5cclxuICAgICogPHRkPm1pbjQ8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbjY8L3RkPlxyXG4gICAgKiA8dGQ+bWluNzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5BZGQ5PC90ZD5cclxuICAgICogPHRkPm1pbjY5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW45PC90ZD5cclxuICAgICogPHRkPm1pbjExPC90ZD5cclxuICAgICogPHRkPm1pbjEzPC90ZD5cclxuICAgICogPHRkPm1pbjdiNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tNzwvdGQ+XHJcbiAgICAqIDx0ZD5kb205PC90ZD5cclxuICAgICogPHRkPmRvbTExPC90ZD5cclxuICAgICogPHRkPmRvbTEzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203czU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN2I1PC90ZD5cclxuICAgICogPHRkPmRvbTdzOTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203Yjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTliNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb205czU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3MxMTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czVzOTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tN3M1Yjk8L3RkPlxyXG4gICAgKiA8dGQ+ZGltPC90ZD5cclxuICAgICogPHRkPmRpbTc8L3RkPlxyXG4gICAgKiA8dGQ+YXVnPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zdXMyPC90ZD5cclxuICAgICogPHRkPnN1czQ8L3RkPlxyXG4gICAgKiA8dGQ+ZmlmdGg8L3RkPlxyXG4gICAgKiA8dGQ+YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnMxMTwvdGQ+XHJcbiAgICAqIDwvdHI+XHJcbiAgICAqIDwvdGFibGU+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgQ2hvcmQgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkVGVtcGxhdGV9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRJbnRlcnZhbH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtNb2RpZmllcn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZEluaXRpYWxpemVyfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiOy8vIFR5cGVzY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBDaG9yZCB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQgeyBDaG9yZCwgQ2hvcmRUZW1wbGF0ZXMsIE1vZGlmaWVyIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvL2NyZWF0ZXMgYSBjaG9yZCB3aXRoIHRoZSBkZWZhdWx0KDEsMyw1KSB0ZW1wbGF0ZSwgcm9vdCBvZiBDLCBpbiB0aGUgNHRoIG9jdGF2ZVxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgY2hvcmQgd2l0aCB0aGUgcHJlLWRlZmluZWQgZGltaW5pc2hlZCB0ZW1wbGF0ZSwgcm9vdCBvZiBFYiwgaW4gdGhlIDV0aCBvY3RhdmVcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKHtyb290OiAzLCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBDaG9yZFRlbXBsYXRlcy5kaW19KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IChyb290LW5vdGUtbmFtZVtzLCMsYl1bb2N0YXZlXSlbY2hvcmQtdGVtcGxhdGUtbmFtZXxbY2hvcmQtcXVhbGl0eV1bbW9kaWZpZXJzXV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBjaG9yZCBmcm9tIGEgc3RyaW5nXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgnKEQ0KW1pbjQnKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi5ERUZBVUxUX0NIT1JEX1RFTVBMQVRFXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUNob3JkKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLihwYXJzZWQ/LnRlbXBsYXRlID8/IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBwYXJzZWQ/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gcGFyc2VkPy5yb290ID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi4odmFsdWVzLnRlbXBsYXRlID8/IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSB2YWx1ZXMucm9vdCA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUgPSBuZXcgU2NhbGUoeyBrZXk6IHRoaXMuX3Jvb3QsIG9jdGF2ZTogdGhpcy5fb2N0YXZlIH0pO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaWQpOyAvLyBoYWw4OTM0aGxsXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcm9vdFxyXG4gICAgICAgICovXHJcbiAgICAgICBfcm9vdCA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQucm9vdCk7IC8vIDAoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHJvb3QoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNldHRpbmcgdGhlIHJvb3QgdG8gYSB2YWx1ZSBvdXRzaWRlIG9mIHRoZSByYW5nZSBbMCwgMTFdKHNlbWl0b25lKSB3aWxsPGJyLz5cclxuICAgICAgICAqIHdyYXAgdGhlIHNlbWl0b25lIHRvIHRoZSByYW5nZSBbMCwgMTFdIGFuZCBjaGFuZ2UgdGhlIG9jdGF2ZSBkZXBlbmRpbmc8YnIvPlxyXG4gICAgICAgICogb24gaG93IG1hbnkgdGltZXMgdGhlIHNlbWl0b25lIGhhcyBiZWVuIHdyYXBwZWQuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLnJvb3QgPSA0OyAvLyBzZXRzIHRoZSByb290IHRvIDR0aCBzZW1pdG9uZShFKVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQucm9vdCk7IC8vIDQoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHJvb3QodmFsdWUpIHtcclxuICAgICAgICAgICAvLyB0aGlzLl9yb290ID0gdmFsdWU7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAodmFsdWUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9yb290ID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSB0aGlzLl9vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBiYXNlIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9iYXNlU2NhbGUgPSBERUZBVUxUX1NDQUxFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmJhc2VTY2FsZSk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCBzY2FsZShtYWpvcilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgYmFzZVNjYWxlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9iYXNlU2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE5vdCBhIGxvdCBvZiBnb29kIHJlYXNvbnMgdG8gY2hhbmdlIHRoaXMgZXhjZXB0IGZvciBleHBlcmltZW50YXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuYmFzZVNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiAzLCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCA1XSB9KTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmJhc2VTY2FsZSk7IC8vIHByaW50cyB0aGUgbWlub3Igc2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgYmFzZVNjYWxlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlLm9jdGF2ZSA9IHRoaXMuX29jdGF2ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm9jdGF2ZSk7IC8vIDQob2N0YXZlKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5vY3RhdmUgPSA1OyAvLyBzZXRzIHRoZSBvY3RhdmUgdG8gNXRoXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5vY3RhdmUpOyAvLyA1KG9jdGF2ZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAodmFsdWUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZS5vY3RhdmUgPSB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHRlbXBsYXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90ZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IHRlbXBsYXRlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgIHJldHVybiBbLi4udGhpcy5fdGVtcGxhdGVdO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgZm9sbG93aW5nIHByZWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6PGJyPlxyXG4gICAgICAgICogPHRhYmxlPlxyXG4gICAgICAgICogPHRyPlxyXG4gICAgICAgICogPHRkPm1hajwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajEzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1hajdzMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1hamI1PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW48L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjQ8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWluNjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluQWRkOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWluOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjEzPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW43YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tMTE8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTEzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTdzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN2I1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czk8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdiOTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb205YjU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTlzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3MxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1czk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1Yjk8L3RkPlxyXG4gICAgICAgICogPHRkPmRpbTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZGltNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXVnPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnN1czI8L3RkPlxyXG4gICAgICAgICogPHRkPnN1czQ8L3RkPlxyXG4gICAgICAgICogPHRkPmZpZnRoPC90ZD5cclxuICAgICAgICAqIDx0ZD5iNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zMTE8L3RkPlxyXG4gICAgICAgICogPC90cj5cclxuICAgICAgICAqIDwvdGFibGU+XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLnRlbXBsYXRlID0gWzEsIFszLCBNb2RpZmllci5mbGF0XSwgNV07IC8vIHNldHMgdGhlIHRlbXBsYXRlIHRvIGEgbWlub3IgY2hvcmRcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gcHJpbnRzIHRoZSBuZXcgdGVtcGxhdGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi52YWx1ZV07XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG5vdGVzXHJcbiAgICAgICAgKiBub3RlcyBhcmUgZ2VuZXJhdGVkIGFuZCBjYWNoZWQgYXMgbmVlZGVkXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9ub3RlcyA9IFtdO1xyXG4gICAgICAgX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB3aWxsIGdlbmVyYXRlIG5vdGVzIGlmIG5lZWRlZCBvciByZXR1cm4gdGhlIGNhY2hlZCBub3Rlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5ub3Rlcyk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCBub3Rlc1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBub3RlcygpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fbm90ZXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGdlbmVyYXRlIG5vdGVzKGludGVybmFsKVxyXG4gICAgICAgICogZ2VuZXJhdGVzIHRoZSBub3RlcyBmb3IgdGhpcyBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBnZW5lcmF0ZU5vdGVzKCkge1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzID0gW107XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBsZXQgdG9uZSA9IDA7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2QgPSAwO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIHRvbmUgPSBpbnRlcnZhbFswXTtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IGludGVydmFsWzFdO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgdG9uZSA9IGludGVydmFsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHRvbmU7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLl9iYXNlU2NhbGUuZGVncmVlKG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGVUb25lID0gbm90ZS5zZW1pdG9uZTtcclxuICAgICAgICAgICAgICAgbm90ZS5zZW1pdG9uZSA9IG5vdGVUb25lICsgbW9kO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBub3RlIG5hbWVzIC0+IFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE5vdGVOYW1lcygpIHtcclxuICAgICAgICAgICBjb25zdCBub3RlTmFtZXMgPSBbXTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgdGhpcy5ub3Rlcykge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gbm90ZU5hbWVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IENob3JkKHtcclxuICAgICAgICAgICAgICAgcm9vdDogdGhpcy5yb290LFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogWy4uLnRoaXMuX3RlbXBsYXRlXSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIG90aGVyIHRoZSBvdGhlciBjaG9yZCB0byBjb21wYXJlIHRvXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSB0d28gY2hvcmRzIGFyZSBlcXVhbFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiAodGhpcy5yb290ID09PSBvdGhlci5yb290ICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID09PSBvdGhlci5vY3RhdmUgJiZcclxuICAgICAgICAgICAgICAgaXNFcXVhbCh0aGlzLl90ZW1wbGF0ZSwgb3RoZXIudGVtcGxhdGUpKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgbmF0cnVhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNob3JkLm1ham9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtYWpvcigpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaCgzKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IDM7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBuYXR1cmFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLm1ham9yZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWFqb3JlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkubWFqb3IoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgbmF0dXJhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNYWpvcigpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzTWFqb3IoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBtdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSxbMywtMV0sNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaW5vcigpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbMywgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFszLCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQubWlub3JlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLFszLC0xXSw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1pbm9yZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLm1pbm9yKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWlub3IoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNaW5vcigpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzTWlub3IoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmF1Z21lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5zaGFycF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYXVnbWVudCgpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNSwgMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzUsIDFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5hdWdtZW50ZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLnNoYXJwXV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhdWdtZW50ZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmF1Z21lbnQoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzQXVnbWVudGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuYXVnbWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNBdWdtZW50ZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0F1Z21lbnRlZCgpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGltaW5pc2goKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzUsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNSwgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmRpbWluaXNoZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmRpbWluaXNoKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzRGltaW5pc2hlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0RpbWluaXNoZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0RpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIFs1LCBNb2RpZmllci5mbGF0XSwgWzcsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICpcclxuICAgICAgICAqL1xyXG4gICAgICAgaGFsZkRpbWluaXNoKCkge1xyXG4gICAgICAgICAgIHRoaXMubWlub3IoKTsgLy8gZ2V0IGZsYXQgM3JkXHJcbiAgICAgICAgICAgdGhpcy5kaW1pbmlzaCgpOyAvLyBnZXQgZmxhdCA1dGhcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNywgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs3LCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuaGFsZkRpbWluaXNoZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdLCBbNywgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKi9cclxuICAgICAgIGhhbGZEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5oYWxmRGltaW5pc2goKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNIYWxmRGltaW5pc2hlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNIYWxmRGltaW5pc2hlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0hhbGZEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIGxldCB0aGlyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGxldCBmaWZ0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGxldCBzZXZlbnRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDcgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHNldmVudGggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBmaWZ0aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcmQgJiYgZmlmdGggJiYgc2V2ZW50aDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIHdpdGggdGhlIGZpcnN0IG5vdGUgbW92ZWQgdG8gdGhlIGVuZCB1cCBvbmUgb2N0YXZlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGNob3JkLmludmVydCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMyw1LDFdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnRTQnLCAnRzQnLCAnQzUnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGludmVydCgpIHtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl90ZW1wbGF0ZVswXSk7XHJcbiAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5fdGVtcGxhdGVbMF0pKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlWzBdWzBdICs9IHRoaXMuX2Jhc2VTY2FsZS50ZW1wbGF0ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVswXSArPSB0aGlzLl9iYXNlU2NhbGUudGVtcGxhdGUubGVuZ3RoO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IG5ld1RlbXBsYXRlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggd2l0aCB0aGUgZmlyc3Qgbm90ZSBtb3ZlZCB0byB0aGUgZW5kIHVwIG9uZSBvY3RhdmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmludmVydGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzMsNSwxXVxyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS5nZXROb3RlTmFtZXMoKSk7IC8vIFsnRTQnLCAnRzQnLCAnQzUnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGludmVydGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5pbnZlcnQoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIHN0cmluZyBmb3JtIG9mIHRoZSBjaG9yZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50b1N0cmluZygpKTsgLy8gJyhDNCltYWonXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKENob3JkVGVtcGxhdGVzKTtcclxuICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKENob3JkVGVtcGxhdGVzKS5tYXAoKHRlbXBsYXRlKSA9PiBKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGNvbnN0IGluZGV4ID0gdmFsdWVzLmluZGV4T2YoSlNPTi5zdHJpbmdpZnkodGhpcy5fdGVtcGxhdGUpKTtcclxuICAgICAgICAgICBjb25zdCBwcmVmaXggPSBgKCR7U2VtaXRvbmUkMVt0aGlzLl9yb290XX0ke3RoaXMuX29jdGF2ZX0pYDtcclxuICAgICAgICAgICBjb25zdCBzdHIgPSBpbmRleCA+IC0xID8gcHJlZml4ICsga2V5c1tpbmRleF0gOiB0aGlzLmdldE5vdGVOYW1lcygpLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIEJ1aWxkcyBsb29rdXAgdGFibGVzIGZvciBtb3JlIHBlcmZvcm1hbnQgc3RyaW5nIHBhcnNpbmcuPGJyLz5cclxuICAgICogU2hvdWxkIG9ubHkob3B0aW9uYWxseSkgYmUgY2FsbGVkIG9uY2Ugc29vbiBhZnRlciB0aGUgbGlicmFyeSBpcyBsb2FkZWQgYW5kPGJyLz5cclxuICAgICogb25seSBpZiB5b3UgYXJlIHVzaW5nIHN0cmluZyBpbml0aWFsaXplcnMuXHJcbiAgICAqL1xyXG4gICBjb25zdCBidWlsZFRhYmxlcyA9ICgpID0+IHtcclxuICAgICAgIGJ1aWxkTm90ZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlTm90ZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlTmFtZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZENob3JkVGFibGUoKTtcclxuICAgfTtcblxuICAgZXhwb3J0cy5DaG9yZCA9IENob3JkO1xuICAgZXhwb3J0cy5DaG9yZFRlbXBsYXRlcyA9IENob3JkVGVtcGxhdGVzO1xuICAgZXhwb3J0cy5JbnN0cnVtZW50ID0gSW5zdHJ1bWVudDtcbiAgIGV4cG9ydHMuTW9kaWZpZXIgPSBNb2RpZmllciQxO1xuICAgZXhwb3J0cy5Ob3RlID0gTm90ZTtcbiAgIGV4cG9ydHMuU2NhbGUgPSBTY2FsZTtcbiAgIGV4cG9ydHMuU2NhbGVUZW1wbGF0ZXMgPSBTY2FsZVRlbXBsYXRlcztcbiAgIGV4cG9ydHMuU2VtaXRvbmUgPSBTZW1pdG9uZSQxO1xuICAgZXhwb3J0cy5idWlsZFRhYmxlcyA9IGJ1aWxkVGFibGVzO1xuXG4gICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSwgU2NhbGVUZW1wbGF0ZXMgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5cbnR5cGUgTGlnaHRTY2FsZSA9IHtcbiAgICBrZXk6IG51bWJlcixcbiAgICB0ZW1wbGF0ZVNsdWc6IHN0cmluZyxcbiAgICBzZW1pdG9uZXM6IG51bWJlcltdLFxufTtcblxuXG5jb25zdCBzY2FsZXNGb3JOb3RlcyA9IChub3RlczogTm90ZVtdLCBwYXJhbXM6IE11c2ljUGFyYW1zKTogU2NhbGVbXSA9PiB7XG4gICAgY29uc3Qgc2NhbGVzID0gbmV3IFNldDxMaWdodFNjYWxlPigpXG4gICAgLy8gRmlyc3QgYWRkIGFsbCBzY2FsZXNcbiAgICBmb3IgKGNvbnN0IHNjYWxlU2x1ZyBpbiBwYXJhbXMuc2NhbGVTZXR0aW5ncykge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHBhcmFtcy5zY2FsZVNldHRpbmdzW3NjYWxlU2x1Z107XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5lbmFibGVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzZW1pdG9uZT0wOyBzZW1pdG9uZSA8IDEyOyBzZW1pdG9uZSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe2tleTogc2VtaXRvbmUsIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlc1tzY2FsZVNsdWddfSlcbiAgICAgICAgICAgICAgICBjb25zdCBzZW1pdG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBsZWFkaW5nVG9uZSA9IChzY2FsZS5rZXkgLSAxICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFzZW1pdG9uZXMuaW5jbHVkZXMobGVhZGluZ1RvbmUpKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHNlbWl0b25lcy5wdXNoKGxlYWRpbmdUb25lKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgc2NhbGVzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogc2VtaXRvbmUsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlU2x1Zzogc2NhbGVTbHVnLFxuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZXM6IHNlbWl0b25lcyxcbiAgICAgICAgICAgICAgICB9IGFzIExpZ2h0U2NhbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IG5vdGUuc2VtaXRvbmVcbiAgICAgICAgZm9yIChjb25zdCBzY2FsZSBvZiBzY2FsZXMpIHtcbiAgICAgICAgICAgIGlmICghc2NhbGUuc2VtaXRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgIHNjYWxlcy5kZWxldGUoc2NhbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIHNjYWxlcykge1xuICAgICAgICByZXQucHVzaChuZXcgU2NhbGUoe2tleTogc2NhbGUua2V5LCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXNbc2NhbGUudGVtcGxhdGVTbHVnXX0pKVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5cbmV4cG9ydCBjb25zdCBnZXRBdmFpbGFibGVTY2FsZXMgPSAodmFsdWVzOiB7XG4gICAgbGF0ZXN0RGl2aXNpb246IG51bWJlcixcbiAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLFxuICAgIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgcmFuZG9tTm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIGxvZ2dlcjogTG9nZ2VyLFxufSk6IEFycmF5PHtcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxufT4gPT4ge1xuICAgIGNvbnN0IHtsYXRlc3REaXZpc2lvbiwgZGl2aXNpb25lZFJpY2hOb3RlcywgcGFyYW1zLCByYW5kb21Ob3RlcywgbG9nZ2VyfSA9IHZhbHVlcztcbiAgICAvLyBHaXZlbiBhIG5ldyBjaG9yZCwgZmluZCBhdmFpbGFibGUgc2NhbGVzIGJhc2Ugb24gdGhlIHByZXZpb3VzIG5vdGVzXG4gICAgY29uc3QgY3VycmVudEF2YWlsYWJsZVNjYWxlcyA9IHNjYWxlc0Zvck5vdGVzKHJhbmRvbU5vdGVzLCBwYXJhbXMpXG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIGN1cnJlbnRBdmFpbGFibGVTY2FsZXMpIHtcbiAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgc2NhbGUsXG4gICAgICAgICAgICB0ZW5zaW9uOiAwLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxvZ2dlci5sb2coXCJjdXJyZW50QXZhaWxhYmxlU2NhbGVzXCIsIGN1cnJlbnRBdmFpbGFibGVTY2FsZXMpXG5cbiAgICByZXR1cm4gcmV0LmZpbHRlcihpdGVtID0+IGl0ZW0udGVuc2lvbiA8IDEwKTtcbn0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSwgU2NhbGVUZW1wbGF0ZXMgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgU291cmNlTWVhc3VyZSB9IGZyb20gXCJvcGVuc2hlZXRtdXNpY2Rpc3BsYXlcIjtcbmltcG9ydCB7IFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuY29uc3QgYnVpbGRUcmlhZE9uID0gKHNlbWl0b25lOiBudW1iZXIsIHNjYWxlOiBTY2FsZSk6IENob3JkIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgc2NhbGVJbmRleCA9IHNjYWxlLm5vdGVzLmZpbmRJbmRleChub3RlID0+IG5vdGUuc2VtaXRvbmUgPT09IHNlbWl0b25lKTtcbiAgICBpZiAoIXNjYWxlSW5kZXggfHwgc2NhbGVJbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5vdGUwU2VtaXRvbmUgPSBzY2FsZS5ub3Rlc1soc2NhbGVJbmRleCArIDApICUgN10uc2VtaXRvbmU7XG4gICAgY29uc3Qgbm90ZTFTZW1pdG9uZSA9IHNjYWxlLm5vdGVzWyhzY2FsZUluZGV4ICsgMikgJSA3XS5zZW1pdG9uZTtcbiAgICBjb25zdCBub3RlMlNlbWl0b25lID0gc2NhbGUubm90ZXNbKHNjYWxlSW5kZXggKyA0KSAlIDddLnNlbWl0b25lO1xuXG4gICAgbGV0IGNob3JkVHlwZSA9ICcnO1xuICAgIGlmIChzZW1pdG9uZURpc3RhbmNlKG5vdGUwU2VtaXRvbmUsIG5vdGUxU2VtaXRvbmUpID09PSA0KSB7XG4gICAgICAgIGNob3JkVHlwZSA9ICdtYWonO1xuICAgIH0gZWxzZSBpZiAoc2VtaXRvbmVEaXN0YW5jZShub3RlMFNlbWl0b25lLCBub3RlMVNlbWl0b25lKSA9PT0gMykge1xuICAgICAgICBjaG9yZFR5cGUgPSAnbWluJztcbiAgICAgICAgaWYgKHNlbWl0b25lRGlzdGFuY2Uobm90ZTFTZW1pdG9uZSwgbm90ZTJTZW1pdG9uZSkgPT09IDMpIHtcbiAgICAgICAgICAgIGNob3JkVHlwZSA9ICdkaW0nO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghY2hvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZChub3RlMFNlbWl0b25lLCBjaG9yZFR5cGUpO1xuICAgIHJldHVybiBjaG9yZDtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgb3JpZ2luYWxTY2FsZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nLFxuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgbWFpblBhcmFtcyxcbiAgICAgICAgICAgIGJlYXREaXZpc2lvbixcbiAgICAgICAgfSA9IHZhbHVlcztcbiAgICAvKlxuICAgIFxuICAgIEJhc2ljIGNpcmNsZSBvZiA1dGhzIHByb2dyZXNzaW9uOlxuXG4gICAgaWlpICAgICAgXG4gICAgdmkgICAgICAgICAoRGVjZXB0aXZlIHRvbmljKVxuICAgIGlpIDwtIElWICAgKFN1YmRvbWluYW50IGZ1bmN0aW9uKVxuICAgIFYgIC0+IHZpaSAgKERvbWluYW50IGZ1bmN0aW9uKVxuICAgIEkgICAgICAgICAgKFRvbmljIGZ1bmN0aW9uKVxuXG4gICAgQWRkaXRpb25hbGx5OlxuICAgIFYgLT4gdmkgaXMgdGhlIGRlY2VwdGl2ZSBjYWRlbmNlXG4gICAgSVYgLT4gSSBpcyB0aGUgcGxhZ2FsIGNhZGVuY2VcbiAgICBpaWkgLT4gSVYgaXMgYWxsb3dlZC5cblxuICAgIE9uY2Ugd2UgaGF2ZSBzdWJkb21pbmFudCBvciBkb21pbmFudCBjaG9yZHMsIHRoZXJlJ3Mgbm8gZ29pbmcgYmFjayB0byBpaWkgb3IgdmkuXG5cbiAgICBJIHdhbnQgdG8gY2hlY2sgcGFjaGVsYmVsIGNhbm9uIHByb2dyZXNzaW9uOlxuICAgICAgT0sgICBkZWNlcHRpdmU/ICAgbWF5YmUgc2luY2Ugbm8gZnVuY3Rpb24gICAgIE9LICAgIE9LIGlmIGl0cyBpNjQgICBPayBiZWNhdXNlIGl0cyB0b25pYy4gT0sgICBPS1xuICAgIEkgLT4gViAgICAtPiAgICAgdmkgICAgICAgICAtPiAgICAgICAgICAgICAgaWlpIC0+IElWICAgICAtPiAgICAgICAgSSAgICAgICAgIC0+ICAgICAgICBJViAgLT4gViAtPiBJXG5cbiAgICAqL1xuICAgIGNvbnN0IHByb2dyZXNzaW9uQ2hvaWNlczogeyBba2V5OiBzdHJpbmddOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgbnVsbCB9ID0ge1xuICAgICAgICAwOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIC8vIEkgY2FuIGdvIGFueXdoZXJlXG4gICAgICAgIDE6IFsnZG9taW5hbnQnLCBdLCAgICAgICAgICAgLy8gaWkgY2FuIGdvIHRvIFYgb3IgdmlpIG9yIGRvbWluYW50XG4gICAgICAgIDI6IFs1LCAzXSwgICAgICAgICAgICAgICAgICAgLy8gaWlpIGNhbiBnbyB0byB2aSBvciBJVlxuICAgICAgICAzOiBbMSwgMiwgJ2RvbWluYW50J10sICAgICAgIC8vIElWIGNhbiBnbyB0byBJLCBpaSBvciBkb21pbmFudFxuICAgICAgICA0OiBbJ3RvbmljJywgNiwgJ2RvbWluYW50J10sIC8vLCA1XSwgLy8gViBjYW4gZ28gdG8gSSwgdmlpIG9yIGRvbWluYW50IG9yIHZpICBERUNFUFRJVkUgSVMgRElTQUJMRUQgRk9SIE5PV1xuICAgICAgICA1OiBbJ3N1Yi1kb21pbmFudCcsIDJdLCAgICAgIC8vIHZpIGNhbiBnbyB0byBpaSwgSVYsIChvciBpaWkpXG4gICAgICAgIDY6IFsndG9uaWMnXSwgICAgICAgICAgICAgICAgLy8gdmlpIGNhbiBnbyB0byBJXG4gICAgfVxuICAgIGxldCB3YW50ZWRGdW5jdGlvbjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHRyeVRvR2V0TGVhZGluZ1RvbmVJblBhcnQwID0gZmFsc2U7XG4gICAgbGV0IHBhcnQwTXVzdEJlVG9uaWMgPSBmYWxzZTtcblxuICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlICYmIGludmVyc2lvbk5hbWUpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJQQUNcIikge1xuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gNSkge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgICAgICB0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgICAgICAgICBwYXJ0ME11c3RCZVRvbmljID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgIWludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IFwiY2FkZW5jZSBQQUM6IE5PVCByb290IGludmVyc2lvbiEgXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiSUFDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDUpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAvLyBOb3Qgcm9vdCBpbnZlcnNpb25cbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gXCJjYWRlbmNlIElBQzogcm9vdCBpbnZlcnNpb24hIFwiO1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIkhDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDIpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZTY2FsZTogU2NhbGUgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgICAgIHByZXZTY2FsZSA9IHJpY2hOb3RlLnNjYWxlO1xuICAgICAgICB9XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2UHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBmb3IgKGxldCBpPWJlYXREaXZpc2lvbjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlcy5ldmVyeShCb29sZWFuKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwcmV2Q2hvcmQpIHtcbiAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJ0b25pY1wiO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmcm9tTm90ZXNPdmVycmlkZSkge1xuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBmcm9tTm90ZXNPdmVycmlkZTtcbiAgICB9XG5cbiAgICBsZXQgZnJvbU5vdGVzO1xuICAgIGlmIChwYXNzZWRGcm9tTm90ZXMubGVuZ3RoIDwgNCkge1xuICAgICAgICBmcm9tTm90ZXMgPSB0b05vdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHBhc3NlZEZyb21Ob3RlcztcbiAgICB9XG5cbiAgICBjb25zdCBnZXRQb3NzaWJsZUZ1bmN0aW9ucyA9IChjaG9yZDogQ2hvcmQsIHNjYWxlOiBTY2FsZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICAgICAgW3NjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgICAgICBbc2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICAgICAgW3NjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgICAgIFtzY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgICAgICAvLyBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb290U2VtaXRvbmUgPSBjaG9yZC5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgY29uc3Qgcm9vdFNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXhbcm9vdFNlbWl0b25lXTtcblxuICAgICAgICBjb25zdCBwb3NzaWJsZVRvRnVuY3Rpb25zOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHtcbiAgICAgICAgICAgICd0b25pYyc6IDAsXG4gICAgICAgICAgICAnc3ViLWRvbWluYW50JzogMCxcbiAgICAgICAgICAgICdkb21pbmFudCc6IDAsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvb3RTY2FsZUluZGV4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwMDtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnNbJ3N1Yi1kb21pbmFudCddID0gMTAwO1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVsxLCAzXS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHsgLy8gaWksIElWXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zW1wic3ViLWRvbWluYW50XCJdID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghWzAsIDQsIDZdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBWLCB2aWksIEk2NFxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IDEwMDtcbiAgICAgICAgfSBlbHNlIGlmIChyb290U2NhbGVJbmRleCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiBJIGlzIG5vdCBzZWNvbmQgaW52ZXJzaW9uLCBpdCdzIG5vdCBkb21pbmFudFxuICAgICAgICAgICAgaWYgKCFpbnZlcnNpb25OYW1lIHx8ICFpbnZlcnNpb25OYW1lLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSA2OyAgLy8gVHJ5IHRvIGF2b2lkIEk2NFxuICAgICAgICB9XG4gICAgICAgIGlmICghWzBdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBJXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhbid0IGhhdmUgdG9uaWMgd2l0aCBub24tc2NhbGUgbm90ZXNcbiAgICAgICAgaWYgKGNob3JkLm5vdGVzLnNvbWUobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0gPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYW50IGhhdmUgdG9uaWMgaW4gc2Vjb25kIGludmVyc2lvbi5cbiAgICAgICAgaWYgKGludmVyc2lvbk5hbWUgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IDEwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb290U2NhbGVJbmRleCxcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnM6IHBvc3NpYmxlVG9GdW5jdGlvbnMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcblxuICAgIC8vIElmIHRoZSBub3RlcyBhcmUgbm90IGluIHRoZSBjdXJyZW50IHNjYWxlLCBpbmNyZWFzZSB0aGUgdGVuc2lvblxuICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTJcblxuICAgIGlmICh0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCAmJiB0b0dsb2JhbFNlbWl0b25lc1swXSAlIDEyICE9IGxlYWRpbmdUb25lKSB7XG4gICAgICAgIC8vIGluIFBBQywgd2Ugd2FudCB0aGUgbGVhZGluZyB0b25lIGluIHBhcnQgMCBpbiB0aGUgZG9taW5hbnRcbiAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsICAvLyBEXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLCAgLy8gRVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsICAvLyBHXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LCAgLy8gQVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgLy8gWyhjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgLSAxICsgMjQpICUgMTJdOiA2ICAvLyBGb3JjZSBhZGQgbGVhZGluZyB0b25lXG4gICAgfVxuICAgIGNvbnN0IHRvU2NhbGVJbmRleGVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0pO1xuXG4gICAgaWYgKHBhcnQwTXVzdEJlVG9uaWMgJiYgdG9TY2FsZUluZGV4ZXNbMF0gIT0gMCkge1xuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gXCJwYXJ0IDAgbXVzdCBiZSB0b25pYyEgXCI7XG4gICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRDaG9yZHNUZW5zaW9uID0gKG5ld0Nob3JkOiBDaG9yZCB8IHVuZGVmaW5lZCwgcHJldkNob3JkOiBDaG9yZCB8IHVuZGVmaW5lZCwgcHJldlByZXZDaG9yZDogQ2hvcmQgfCB1bmRlZmluZWQsIGN1cnJlbnRTY2FsZTogU2NhbGUpID0+IHtcbiAgICAgICAgY29uc3QgdGVuc2lvbiA9IHtcbiAgICAgICAgICAgIGNhZGVuY2U6IDAsXG4gICAgICAgICAgICBjb21tZW50OiBcIlwiLFxuICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvbjogMCxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgICAgIC8vIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0Nob3JkICYmIHByZXZDaG9yZCAmJiBwcmV2UHJldkNob3JkKSB7XG4gICAgICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgPT0gcHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgLy8gU2FtZSByb290XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FtZSByb290IGFzIHByZXZpb3VzIGNob3JkXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBTYW1lIHJvb3QgYXMgcHJldmlvdXMgY2hvcmQgKERvbid0IGdvIGJhY2spXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3Q2hvcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3RTZW1pdG9uZSA9IG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lO1xuICAgICAgICAgICAgY29uc3Qgcm9vdFNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXhbcm9vdFNlbWl0b25lXTtcbiAgICAgICAgICAgIGlmIChuZXdDaG9yZC5jaG9yZFR5cGUuaW5jbHVkZXMoJ2RvbTcnKSkge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgYWxsb3cgaW5kZXggaWkgYW5kIFYgZm9yIG5vdy5cbiAgICAgICAgICAgICAgICBpZiAoIVsxLCA0XS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDEzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghd2FudGVkRnVuY3Rpb24gfHwgd2FudGVkRnVuY3Rpb24gIT0gJ2RvbWluYW50Jykge1xuICAgICAgICAgICAgICAgIGlmIChuZXdDaG9yZC5jaG9yZFR5cGUuaW5jbHVkZXMoJ2RvbTcnKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXdDaG9yZC5jaG9yZFR5cGUuaW5jbHVkZXMoJ2RpbTcnKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0Nob3JkICYmIHByZXZDaG9yZCkge1xuICAgICAgICAgICAgY29uc3QgZnJvbUZ1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKHByZXZDaG9yZCwgY3VycmVudFNjYWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHRvRnVuY3Rpb25zID0gZ2V0UG9zc2libGVGdW5jdGlvbnMobmV3Q2hvcmQsIGN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBjb25zdCBwb3NzaWJsZVRvRnVuY3Rpb25zID0gdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9ucztcblxuICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3Npb25zID0gcHJvZ3Jlc3Npb25DaG9pY2VzW2Zyb21GdW5jdGlvbnMucm9vdFNjYWxlSW5kZXhdO1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzaW9ucykge1xuICAgICAgICAgICAgICAgIGxldCBnb29kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGZyb21GdW5jdGlvbnMucm9vdFNjYWxlSW5kZXggPT0gdG9GdW5jdGlvbnMucm9vdFNjYWxlSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgZG9taW5hbnRUb0RvbWluYW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwcm9ncmVzc2lvbiBvZiBwcm9ncmVzc2lvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGAke3Byb2dyZXNzaW9ufWAgPT0gYCR7dG9GdW5jdGlvbnMucm9vdFNjYWxlSW5kZXh9YCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGVyZmVjdCBwcm9ncmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb2dyZXNzaW9uID09IFwic3RyaW5nXCIgJiYgdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9ucyAmJiB0b0Z1bmN0aW9ucy5wb3NzaWJsZVRvRnVuY3Rpb25zW3Byb2dyZXNzaW9uXSAhPSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnNbcHJvZ3Jlc3Npb25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzaW9uID09IFwiZG9taW5hbnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbWluYW50VG9Eb21pbmFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWdvb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDExNDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSdyZSBtb3ZpbmcgZnJvbSBcImRvbWluYW50XCIgdG8gXCJkb21pbmFudFwiLCB3ZSBuZWVkIHRvIHByZXZlbnQgXCJsZXNzZW5pbmcgdGhlIHRlbnNpb25cIlxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9taW5hbnRUb0RvbWluYW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJldkNob3JkVGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Q2hvcmRUZW5zaW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlYWRpbmdUb25lID0gKGN1cnJlbnRTY2FsZS5rZXkgLSAxICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b25pY05vdGVzID0gW2N1cnJlbnRTY2FsZS5ub3Rlc1swXSwgY3VycmVudFNjYWxlLm5vdGVzWzJdLCBjdXJyZW50U2NhbGUubm90ZXNbNF1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBub3RlIG9mIHByZXZDaG9yZC5ub3Rlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVhY2ggbm90ZSBub3QgaW4gdG9uaWMgbm90ZXMgYWRkcyB0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGVhZGluZyB0b25lIGFkZHMgbW9yZSB0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0b25pY05vdGVzLnNvbWUodG9uaWNOb3RlID0+IHRvbmljTm90ZS5zZW1pdG9uZSA9PSBub3RlLnNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2hvcmRUZW5zaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3RlLnNlbWl0b25lID09IGxlYWRpbmdUb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDaG9yZFRlbnNpb24gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgbmV3Q2hvcmQubm90ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFYWNoIG5vdGUgbm90IGluIHRvbmljIG5vdGVzIGFkZHMgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlYWRpbmcgdG9uZSBhZGRzIG1vcmUgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9uaWNOb3Rlcy5zb21lKHRvbmljTm90ZSA9PiB0b25pY05vdGUuc2VtaXRvbmUgPT0gbm90ZS5zZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2hvcmRUZW5zaW9uICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3RlLnNlbWl0b25lID09IGxlYWRpbmdUb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nob3JkVGVuc2lvbiArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdDaG9yZFRlbnNpb24gPCBwcmV2Q2hvcmRUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDE3O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9ncmVzc2lvbnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxMTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcInN1Yi1kb21pbmFudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZVRvRnVuY3Rpb25zW1wic3ViLWRvbWluYW50XCJdID09IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlVG9GdW5jdGlvbnNbXCJkb21pbmFudFwiXSA9PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gYFdhbnRlZCAke3dhbnRlZEZ1bmN0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTsgIC8vIERvbWluYW50IGlzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwiZG9taW5hbnRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVUb0Z1bmN0aW9uc1tcImRvbWluYW50XCJdID09IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IGBXYW50ZWQgJHt3YW50ZWRGdW5jdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcInRvbmljXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlVG9GdW5jdGlvbnNbXCJ0b25pY1wiXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBgV2FudGVkICR7d2FudGVkRnVuY3Rpb259YFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiUEFDXCIpIHtcbiAgICAgICAgICAgIC8vIFNpbmNlIFBBQyBpcyBzbyBoYXJkLCBsZXRzIGxvb3NlbiB1cCB0aGUgcnVsZXMgYSBiaXRcbiAgICAgICAgICAgIGlmICh0ZW5zaW9uLmNhZGVuY2UgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSA9IC0zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cbiAgICBsZXQgdGVuc2lvblJlc3VsdCA9IHtcbiAgICAgICAgY2hvcmRQcm9ncmVzc2lvbjogMTEyLFxuICAgICAgICBjYWRlbmNlOiAwLFxuICAgICAgICBjb21tZW50OiBcIlwiXG4gICAgfTtcbiAgICBsZXQgcHJldkNob3JkSXNUb25pY2l6ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmV3Q2hvcmRJc1NlY29uZGFyeURvbWluYW50ID0gZmFsc2U7XG4gICAgY29uc3QgY2FkZW5jZUlzTmVhciA9IHdhbnRlZEZ1bmN0aW9uIHx8IChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIHx8IDApIDwgNTtcbiAgICBpZiAocHJldkNob3JkICYmIHByZXZTY2FsZSkge1xuICAgICAgICBpZiAocHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSkge1xuICAgICAgICAgICAgcHJldkNob3JkSXNUb25pY2l6ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChuZXdDaG9yZCAmJiBjdXJyZW50U2NhbGUgJiYgb3JpZ2luYWxTY2FsZSkge1xuICAgICAgICAvLyBDaG9yZCBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIG5vdGUgbm90IGluIHRoZSBvcmlnaW5hbCBzY2FsZVxuICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXMuc29tZShub3RlID0+ICFvcmlnaW5hbFNjYWxlLm5vdGVzLnNvbWUoc2NhbGVOb3RlID0+IHNjYWxlTm90ZS5zZW1pdG9uZSA9PSBub3RlLnNlbWl0b25lKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nob3JkRnVuY3Rpb25zID0gZ2V0UG9zc2libGVGdW5jdGlvbnMobmV3Q2hvcmQsIGN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBpZiAobmV3Q2hvcmRGdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCA8IDEwMCB8fCBuZXdDaG9yZEZ1bmN0aW9ucy5yb290U2NhbGVJbmRleCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbmV3Q2hvcmRJc1NlY29uZGFyeURvbWluYW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcmV2U2NhbGUgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgIT0gb3JpZ2luYWxTY2FsZS50b1N0cmluZygpICYmIG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSAhPSBwcmV2U2NhbGUudG9TdHJpbmcoKSAmJiBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSAhPSBwcmV2U2NhbGUudG9TdHJpbmcoKSkge1xuICAgICAgICAvLyBDYW4ndCBtb2R1bGF0ZSBkdXJpbmcgYSBtb2R1bGF0aW9uXG4gICAgfSBlbHNlIGlmIChuZXdDaG9yZCAmJiBwcmV2U2NhbGUgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgIT0gb3JpZ2luYWxTY2FsZS50b1N0cmluZygpICYmIG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSA9PSBwcmV2U2NhbGUudG9TdHJpbmcoKSkge1xuICAgICAgICBpZiAoIWNhZGVuY2VJc05lYXIgJiYgbmV3Q2hvcmRJc1NlY29uZGFyeURvbWluYW50ICYmICFwcmV2Q2hvcmRJc1RvbmljaXplZCkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBjaG9yZCB3b3VsZCBhbGxvdyBtb3ZpbmcgdG8gYSBuZXcgc2NhbGUgdGVtcG9yYXJpbHkgKGEgZG9taW5hbnQgZnVuY3Rpb24gYXQgbW9zdClcbiAgICAgICAgICAgIC8vIFRoZSB0ZW5zaW9uIGlzIG5vdyBhY3R1YWxseSBiZXR3ZWVuIHRoZSB0b25pY2l6ZWQgY2hvcmQgYW5kIHRoZSBwcmV2aW91cyBjaG9yZCwgKmluIHRoZSBwcmV2aW91cyBzY2FsZSohXG4gICAgICAgICAgICBsZXQgaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKFsnZG9tNyddLmluY2x1ZGVzKG5ld0Nob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWZ0aERvd25Gcm9tTmV3Q2hvcmRSb290ID0gKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lIC0gNyArIDI0KSAlIDEyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkID0gYnVpbGRUcmlhZE9uKGZpZnRoRG93bkZyb21OZXdDaG9yZFJvb3QsIHByZXZTY2FsZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9uaWNpemVkQ2hvcmRJc0lPZkN1cnJlbnRTY2FsZSA9IHRvbmljaXplZENob3JkPy5ub3Rlc1swXS5zZW1pdG9uZSA9PSBjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmU7XG4gICAgICAgICAgICAgICAgaWYgKHRvbmljaXplZENob3JkICYmIHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgJiYgWydtYWonLCAnbWluJ10uaW5jbHVkZXModG9uaWNpemVkQ2hvcmQuY2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24odG9uaWNpemVkQ2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgcHJldlNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRlbnNpb24gZnJvbSB0b25pY2l6ZWQgY2hvcmRcIiwgdGVuc2lvblJlc3VsdCwgXCJ0b1wiLCB0b25pY2l6ZWRDaG9yZC50b1N0cmluZygpLCBcImZyb21cIiwgcHJldkNob3JkPy50b1N0cmluZygpLCBcImluXCIsIHByZXZTY2FsZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWhhbmRsZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoWydkaW03J10uaW5jbHVkZXMobmV3Q2hvcmQuY2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZW1pdG9uZVVwRnJvbU5ld0Nob3JkUm9vdCA9IChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSArIDEgKyAyNCkgJSAxMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9uaWNpemVkQ2hvcmQgPSBidWlsZFRyaWFkT24oc2VtaXRvbmVVcEZyb21OZXdDaG9yZFJvb3QsIHByZXZTY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgPSB0b25pY2l6ZWRDaG9yZD8ubm90ZXNbMF0uc2VtaXRvbmUgPT0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9uaWNpemVkQ2hvcmQgJiYgdG9uaWNpemVkQ2hvcmRJc0lPZkN1cnJlbnRTY2FsZSAmJiBbJ21haicsICdtaW4nXS5pbmNsdWRlcyh0b25pY2l6ZWRDaG9yZC5jaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSBnZXRDaG9yZHNUZW5zaW9uKHRvbmljaXplZENob3JkLCBwcmV2Q2hvcmQsIHByZXZQcmV2Q2hvcmQsIHByZXZTY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVGVuc2lvbiBmcm9tIHRvbmljaXplZCBjaG9yZFwiLCB0ZW5zaW9uUmVzdWx0LCBcInRvXCIsIHRvbmljaXplZENob3JkLnRvU3RyaW5nKCksIFwiZnJvbVwiLCBwcmV2Q2hvcmQ/LnRvU3RyaW5nKCksIFwiaW5cIiwgcHJldlNjYWxlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFsnbWluNyddLmluY2x1ZGVzKG5ld0Nob3JkLmNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHdvU2VtaXRvbmVzRG93bkZyb21OZXdDaG9yZFJvb3QgPSAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgLSAyICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvbmljaXplZENob3JkID0gYnVpbGRUcmlhZE9uKHR3b1NlbWl0b25lc0Rvd25Gcm9tTmV3Q2hvcmRSb290LCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b25pY2l6ZWRDaG9yZElzSU9mQ3VycmVudFNjYWxlID0gdG9uaWNpemVkQ2hvcmQ/Lm5vdGVzWzBdLnNlbWl0b25lID09IGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvbmljaXplZENob3JkICYmIHRvbmljaXplZENob3JkSXNJT2ZDdXJyZW50U2NhbGUgJiYgWydtYWonLCAnbWluJ10uaW5jbHVkZXModG9uaWNpemVkQ2hvcmQuY2hvcmRUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0ID0gZ2V0Q2hvcmRzVGVuc2lvbih0b25pY2l6ZWRDaG9yZCwgcHJldkNob3JkLCBwcmV2UHJldkNob3JkLCBwcmV2U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRlbnNpb24gZnJvbSB0b25pY2l6ZWQgY2hvcmRcIiwgdGVuc2lvblJlc3VsdCwgXCJ0b1wiLCB0b25pY2l6ZWRDaG9yZC50b1N0cmluZygpLCBcImZyb21cIiwgcHJldkNob3JkPy50b1N0cmluZygpLCBcImluXCIsIHByZXZTY2FsZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAobmV3Q2hvcmQgJiYgcHJldlNjYWxlICYmIGN1cnJlbnRTY2FsZS50b1N0cmluZygpICE9IG9yaWdpbmFsU2NhbGUudG9TdHJpbmcoKSAmJiBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA9PSBwcmV2U2NhbGUudG9TdHJpbmcoKSkge1xuICAgICAgICAvLyBJZiB3ZSBhcmUgaGVyZSwgdGhlIG1vZHVsYXRlZCBwcm9ncmVzc2lvbiBpcyBnb2luZyBvbiBzdGlsbC4gSWYgcHJldkNob3JkIGlzIGEgdG9uaWMsIHdlIGNhbid0IGFsbG93IGFueXRoaW5nIGluIHRoaXMgbmV3IHNjYWxlLlxuICAgICAgICBpZiAocHJldkNob3JkSXNUb25pY2l6ZWQgfHwgY2FkZW5jZUlzTmVhcikge1xuICAgICAgICAgICAgdGVuc2lvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBjaG9yZFByb2dyZXNzaW9uOiAxMDEsXG4gICAgICAgICAgICAgICAgY29tbWVudDogXCJUb25pY2l6ZWQgY2hvcmQgcmVhY2hlZCwgY2FuJ3QgYWxsb3cgYW55dGhpbmcgaW4gdGhpcyBuZXcgc2NhbGVcIixcbiAgICAgICAgICAgICAgICBjYWRlbmNlOiAwLFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24obmV3Q2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgcHJldlNjYWxlKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXdhbnRlZEZ1bmN0aW9uICYmIG5ld0Nob3JkICYmIHByZXZTY2FsZSAmJiBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA9PSBvcmlnaW5hbFNjYWxlLnRvU3RyaW5nKCkgJiYgY3VycmVudFNjYWxlLnRvU3RyaW5nKCkgIT0gcHJldlNjYWxlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgLy8gSWYgd2UgYXJlIGhlcmUsIHRoZSBtb2R1bGF0ZWQgcHJvZ3Jlc3Npb24gaXMgb3Zlci4gSWYgcHJldkNob3JkIGlzIGEgdG9uaWMgaW4gdGhlIHByZXZpb3VzIHNjYWxlLCB3ZSBjYW4gY29udGludWUgaW4gdGhlIG9yaWdpbmFsIHNjYWxlLlxuICAgICAgICBpZiAocHJldkNob3JkSXNUb25pY2l6ZWQgJiYgbmV3Q2hvcmQubm90ZXMuZXZlcnkobm90ZSA9PiBjdXJyZW50U2NhbGUubm90ZXMuc29tZShzY2FsZU5vdGUgPT4gc2NhbGVOb3RlLnNlbWl0b25lID09IG5vdGUuc2VtaXRvbmUpKSkge1xuICAgICAgICAgICAgdGVuc2lvblJlc3VsdCA9IGdldENob3Jkc1RlbnNpb24obmV3Q2hvcmQsIHByZXZDaG9yZCwgcHJldlByZXZDaG9yZCwgY3VycmVudFNjYWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbnNpb25SZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvbjogMTAyLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IFwiTW9kdWxhdGVkIHByb2dyZXNzaW9uIGhhcyBub3QgZW5kZWQsIGNhbid0IGFsbG93IGFueXRoaW5nIGluIHRoZSBvcmlnaW5hbCBzY2FsZVwiLFxuICAgICAgICAgICAgICAgIGNhZGVuY2U6IDAsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHdhbnRlZEZ1bmN0aW9uICYmIHByZXZTY2FsZSAmJiAocHJldlNjYWxlLnRvU3RyaW5nKCkgIT0gb3JpZ2luYWxTY2FsZS50b1N0cmluZygpKSkge1xuICAgICAgICAvLyBPaCBub2VzLCB3ZSBhcmUgaW4gYSBtb2R1bGF0ZWQgcHJvZ3Jlc3Npb24gYW5kIHRoZSBjYWRlbmNlIHN0YXJ0ZWQuIFRoaXMgd2lsbCBub3QgZG9cbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZW5zaW9uUmVzdWx0ID0gZ2V0Q2hvcmRzVGVuc2lvbihuZXdDaG9yZCwgcHJldkNob3JkLCBwcmV2UHJldkNob3JkLCBjdXJyZW50U2NhbGUpO1xuICAgIH1cbiAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gPSB0ZW5zaW9uUmVzdWx0LmNob3JkUHJvZ3Jlc3Npb247XG4gICAgdGVuc2lvbi5jb21tZW50ICs9IHRlbnNpb25SZXN1bHQuY29tbWVudDtcbiAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gdGVuc2lvblJlc3VsdC5jYWRlbmNlO1xufVxuIiwiaW1wb3J0IHtcbiAgICBidWlsZFRhYmxlcyxcbiAgICBTY2FsZSxcbiAgICBOb3RlLFxufSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IENob3JkLCBOdWxsYWJsZSwgRGl2aXNpb25lZFJpY2hub3RlcywgUmljaE5vdGUsIEJFQVRfTEVOR1RILCBzZW1pdG9uZVNjYWxlSW5kZXggfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgUmFuZG9tQ2hvcmRHZW5lcmF0b3IgfSBmcm9tIFwiLi9yYW5kb21jaG9yZHNcIjtcbmltcG9ydCB7IGdldEludmVyc2lvbnMgfSBmcm9tIFwiLi9pbnZlcnNpb25zXCI7XG5pbXBvcnQgeyBnZXRUZW5zaW9uLCBtYWtlVGVuc2lvbiwgVGVuc2lvbiwgVGVuc2lvbkVycm9yIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgYWRkTm90ZUJldHdlZW4sIGJ1aWxkVG9wTWVsb2R5IH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgYWRkSGFsZk5vdGVzIH0gZnJvbSBcIi4vaGFsZm5vdGVzXCI7XG5pbXBvcnQgeyBnZXRBdmFpbGFibGVTY2FsZXMgfSBmcm9tIFwiLi9hdmFpbGFibGVzY2FsZXNcIjtcbmltcG9ydCB7IGFkZEZvcmNlZE1lbG9keSwgRm9yY2VkTWVsb2R5UmVzdWx0IH0gZnJvbSBcIi4vZm9yY2VkbWVsb2R5XCI7XG5pbXBvcnQgKiBhcyB0aW1lIGZyb20gXCIuL3RpbWVyXCI7IFxuaW1wb3J0IHsgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24gfSBmcm9tIFwiLi9jaG9yZHByb2dyZXNzaW9uXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IGdvb2RTb3VuZGluZ1NjYWxlVGVuc2lvbiB9IGZyb20gXCIuL2dvb2Rzb3VuZGluZ3NjYWxlXCI7XG5cbmNvbnN0IEdPT0RfQ0hPUkRfTElNSVQgPSAxMDAwO1xuY29uc3QgR09PRF9DSE9SRFNfUEVSX0NIT1JEID0gMTAwO1xuY29uc3QgQkFEX0NIT1JEX0xJTUlUID0gMjAwO1xuY29uc3QgQkFEX0NIT1JEU19QRVJfQ0hPUkQgPSAxMDtcblxudHlwZSBCYWRDaG9yZCA9IHtcbiAgICB0ZW5zaW9uOiBUZW5zaW9uLCBjaG9yZDogc3RyaW5nLCBzY2FsZTogU2NhbGVcbn1cblxuY29uc3Qgc2xlZXBNUyA9IGFzeW5jIChtczogbnVtYmVyKTogUHJvbWlzZTxudWxsPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5jb25zdCBtYWtlQ2hvcmRzID0gYXN5bmMgKG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjazogTnVsbGFibGU8RnVuY3Rpb24+ID0gbnVsbCk6IFByb21pc2U8RGl2aXNpb25lZFJpY2hub3Rlcz4gPT4ge1xuICAgIC8vIGdlbmVyYXRlIGEgcHJvZ3Jlc3Npb25cbiAgICAvLyBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgZ2VuZXJhdGVzIHRoZSBlbnRpcmUgc29uZy5cbiAgICAvLyBUaGUgYmFzaWMgaWRlYSBpcyB0aGF0IFxuXG4gICAgLy8gVW50aWwgdGhlIGZpcnN0IElBQyBvciBQQUMsIG1lbG9keSBhbmQgcmh5dG0gaXMgcmFuZG9tLiAoVGhvdWdoIGVhY2ggY2FkZW5jZSBoYXMgaXQncyBvd24gbWVsb2RpYyBoaWdoIHBvaW50LilcblxuICAgIC8vIFRoaXMgbWVsb2R5IGFuZCByaHl0bSBpcyBwYXJ0aWFsbHkgc2F2ZWQgYW5kIHJlcGVhdGVkIGluIHRoZSBuZXh0IGNhZGVuY2VzLlxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpO1xuXG4gICAgbGV0IHJlc3VsdDogRGl2aXNpb25lZFJpY2hub3RlcyA9IHt9O1xuICAgIGxldCBvcmlnaW5hbFNjYWxlOiBTY2FsZTtcblxuICAgIGxldCBkaXZpc2lvbkJhbm5lZE5vdGVzOiB7W2tleTogbnVtYmVyXTogQXJyYXk8QXJyYXk8Tm90ZT4+fSA9IHt9XG4gICAgbGV0IGRpdmlzaW9uQmFuQ291bnQ6IHtba2V5OiBudW1iZXJdOiBudW1iZXJ9ID0ge31cblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBsZXQgcHJldlJlc3VsdCA9IHJlc3VsdFtkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgbGV0IHByZXZDaG9yZCA9IHByZXZSZXN1bHQgPyBwcmV2UmVzdWx0WzBdLmNob3JkIDogbnVsbDtcbiAgICAgICAgbGV0IHByZXZOb3RlczogTm90ZVtdO1xuICAgICAgICBsZXQgcHJldkludmVyc2lvbk5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGN1cnJlbnRTY2FsZTogU2NhbGUgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBiYW5uZWROb3Rlc3MgPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uXTtcbiAgICAgICAgaWYgKHByZXZSZXN1bHQpIHtcbiAgICAgICAgICAgIHByZXZOb3RlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lID0gcmljaE5vdGUuaW52ZXJzaW9uTmFtZTtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudFNjYWxlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBpZiAoIW9yaWdpbmFsU2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZSA9IGN1cnJlbnRTY2FsZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNjYWxlID0gY3VycmVudFNjYWxlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobWFpblBhcmFtcy5mb3JjZWRPcmlnaW5hbFNjYWxlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gbWFpblBhcmFtcy5mb3JjZWRPcmlnaW5hbFNjYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgb3JpZ2luYWxTY2FsZSA9IG9yaWdpbmFsU2NhbGUgYXMgU2NhbGU7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgcHJldk5vdGVzID0gcHJldk5vdGVzO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb24pO1xuICAgICAgICBjb25zdCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID0gcGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCZWF0ID0gTWF0aC5mbG9vcihkaXZpc2lvbiAvIEJFQVRfTEVOR1RIKTtcblxuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKFwiZGl2aXNpb25cIiwgZGl2aXNpb24sIFwiYmVhdFwiLCBjdXJyZW50QmVhdCwgcHJldkNob3JkID8gcHJldkNob3JkLnRvU3RyaW5nKCkgOiBcIm51bGxcIiwgXCIgc2NhbGUgXCIsIGN1cnJlbnRTY2FsZSA/IGN1cnJlbnRTY2FsZS50b1N0cmluZygpIDogXCJudWxsXCIsIHByZXZSZXN1bHQgJiYgcHJldlJlc3VsdFswXT8udGVuc2lvbiA/IHByZXZSZXN1bHRbMF0udGVuc2lvbi50b1ByaW50KCkgOiBcIlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXCIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UpO1xuXG4gICAgICAgIGNvbnN0IHJhbmRvbUdlbmVyYXRvciA9IG5ldyBSYW5kb21DaG9yZEdlbmVyYXRvcihwYXJhbXMpXG4gICAgICAgIGxldCBuZXdDaG9yZDogTnVsbGFibGU8Q2hvcmQ+ID0gbnVsbDtcblxuICAgICAgICBsZXQgZ29vZENob3JkczogUmljaE5vdGVbXVtdID0gW11cbiAgICAgICAgY29uc3QgYmFkQ2hvcmRzOiBCYWRDaG9yZFtdID0gW11cblxuICAgICAgICBjb25zdCByYW5kb21Ob3RlczogQXJyYXk8Tm90ZT4gPSBbXTtcblxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIGxldCBza2lwTG9vcCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChwYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPT0gMSAmJiBwcmV2Tm90ZXMpIHtcbiAgICAgICAgICAgIC8vIEZvcmNlIHNhbWUgY2hvcmQgdHdpY2VcbiAgICAgICAgICAgIGdvb2RDaG9yZHMuc3BsaWNlKDAsIGdvb2RDaG9yZHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGdvb2RDaG9yZHMucHVzaChwcmV2Tm90ZXMubWFwKChub3RlLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICBub3RlOiBub3RlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBCRUFUX0xFTkdUSCxcbiAgICAgICAgICAgICAgICBjaG9yZDogcHJldkNob3JkLFxuICAgICAgICAgICAgICAgIHBhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgdGVuc2lvbjogbmV3IFRlbnNpb24oKSxcbiAgICAgICAgICAgICAgICBzY2FsZTogY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IG9yaWdpbmFsU2NhbGUsXG4gICAgICAgICAgICB9IGFzIFJpY2hOb3RlKSkpO1xuICAgICAgICAgICAgc2tpcExvb3AgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCFza2lwTG9vcCAmJiBnb29kQ2hvcmRzLmxlbmd0aCA8IChjdXJyZW50QmVhdCAhPSAwID8gR09PRF9DSE9SRF9MSU1JVCA6IDUpKSB7XG4gICAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgICBuZXdDaG9yZCA9IHJhbmRvbUdlbmVyYXRvci5nZXRDaG9yZCgpO1xuICAgICAgICAgICAgY29uc3QgY2hvcmRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucyA+IDEwMDAwMCB8fCAhbmV3Q2hvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVG9vIG1hbnkgaXRlcmF0aW9uczogJHtpdGVyYXRpb25zfSwgZ29pbmcgYmFja2ApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1haW5QYXJhbXMuZm9yY2VkQ2hvcmRzICYmIG9yaWdpbmFsU2NhbGUgJiYgbmV3Q2hvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JjZWRDaG9yZE51bSA9IHBhcnNlSW50KG1haW5QYXJhbXMuZm9yY2VkQ2hvcmRzW2N1cnJlbnRCZWF0XSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihmb3JjZWRDaG9yZE51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbWl0b25lU2NhbGVJbmRleChvcmlnaW5hbFNjYWxlKVtuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZV0gIT0gKGZvcmNlZENob3JkTnVtIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGFsbEludmVyc2lvbnM7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlU2NhbGVzO1xuXG4gICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBnZXRBdmFpbGFibGVTY2FsZXMoe1xuICAgICAgICAgICAgICAgIGxhdGVzdERpdmlzaW9uOiBkaXZpc2lvbixcbiAgICAgICAgICAgICAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgcmFuZG9tTm90ZXM6IG5ld0Nob3JkLm5vdGVzLFxuICAgICAgICAgICAgICAgIGxvZ2dlcjogbmV3IExvZ2dlcihjaG9yZExvZ2dlciksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTY2FsZSAmJiAobWF4QmVhdHMgLSBjdXJyZW50QmVhdCA8IDMgfHwgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMgfHwgY3VycmVudEJlYXQgPCA1KSkge1xuICAgICAgICAgICAgICAgIC8vIERvbid0IGFsbG93IG90aGVyIHNjYWxlcyB0aGFuIHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVNjYWxlcyA9IGF2YWlsYWJsZVNjYWxlcy5maWx0ZXIocyA9PiBzLnNjYWxlLmVxdWFscyhjdXJyZW50U2NhbGUgYXMgU2NhbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdmFpbGFibGVTY2FsZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgYXZhaWxhYmxlU2NhbGUgb2YgYXZhaWxhYmxlU2NhbGVzKSB7XG4gICAgICAgICAgICAgICAgYWxsSW52ZXJzaW9ucyA9IGdldEludmVyc2lvbnMoe1xuICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsIHByZXZOb3RlczogcHJldk5vdGVzLCBiZWF0OiBjdXJyZW50QmVhdCwgcGFyYW1zLCBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBtYXhCZWF0cyAtIGN1cnJlbnRCZWF0XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGxldCBzdG9wSW52ZXJzaW9uTG9vcCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnZlcnNpb25SZXN1bHQgb2YgYWxsSW52ZXJzaW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcEludmVyc2lvbkxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA+PSBHT09EX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnZlcnNpb25Mb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIGludmVyc2lvbkxvZ2dlci50aXRsZSA9IFtcIkludmVyc2lvbiBcIiwgYCR7aW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWV9YF07XG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzLnNwbGljZSgwLCByYW5kb21Ob3Rlcy5sZW5ndGgpOyAgLy8gRW1wdHkgdGhpcyBhbmQgcmVwbGFjZSBjb250ZW50c1xuICAgICAgICAgICAgICAgICAgICByYW5kb21Ob3Rlcy5wdXNoKC4uLmludmVyc2lvblJlc3VsdC5ub3Rlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWROb3Rlc3MgJiYgYmFubmVkTm90ZXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiYW5uZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiYW5uZWROb3RlcyBvZiBiYW5uZWROb3Rlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXMubGVuZ3RoICE9IHJhbmRvbU5vdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbU5vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW5kb21Ob3Rlc1tpXS50b1N0cmluZygpICE9IGJhbm5lZE5vdGVzW2ldLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFubmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYW5uZWQgbm90ZXNcIiwgcmFuZG9tTm90ZXMubWFwKG4gPT4gbi50b1N0cmluZygpKSwgXCJiYW5uZWROb3Rlc3NcIiwgYmFubmVkTm90ZXNzLm1hcChuID0+IG4ubWFwKG4gPT4gbi50b1N0cmluZygpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA+PSBHT09EX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0RGl2aXNpb246IGRpdmlzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RlczogcmFuZG9tTm90ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZTogb3JpZ2luYWxTY2FsZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbWF4QmVhdHMgLSBjdXJyZW50QmVhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2hvcmQsXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUmVzdWx0ID0gbWFrZVRlbnNpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbnNpb247XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0LmludmVyc2lvblRlbnNpb24gPSBpbnZlcnNpb25SZXN1bHQucmF0aW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmRQcm9ncmVzc2lvblRlbnNpb24odGVuc2lvblJlc3VsdCwgdGVuc2lvblBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kU291bmRpbmdTY2FsZVRlbnNpb24odGVuc2lvblJlc3VsdCwgdGVuc2lvblBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvblJlc3VsdC5nZXRUb3RhbFRlbnNpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRUZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uID0gdGVuc2lvblJlc3VsdC5nZXRUb3RhbFRlbnNpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUZW5zaW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBObyB3b3JyaWVzLCB0aGlzIGNob3JkL3NjYWxlL2ludmVyc2lvbiBjb21iaW5hdGlvbiBpcyBqdXN0IGJhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24gPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvblJlc3VsdC5jaG9yZFByb2dyZXNzaW9uID49IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gcG9pbnQgY2hlY2tpbmcgb3RoZXIgaW52ZXJzaW9ucyBmb3IgdGhpcyBjaG9yZFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEludmVyc2lvbkxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdpdmVVUCA9IHByb2dyZXNzQ2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2l2ZVVQKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZWxvZHlSZXN1bHQ6IEZvcmNlZE1lbG9keVJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXMgdGhpcyBwb3NzaWJsZSB0byB3b3JrIHdpdGggdGhlIG1lbG9keT9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHNvLCBhZGQgbWVsb2R5IG5vdGVzIGFuZCBOQUNzLlxuICAgICAgICAgICAgICAgICAgICAgICAgbWVsb2R5UmVzdWx0ID0gYWRkRm9yY2VkTWVsb2R5KHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5mb3JjZWRNZWxvZHkgKz0gbWVsb2R5UmVzdWx0LnRlbnNpb247XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVsb2R5UmVzdWx0Lm5hYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubmFjID0gbWVsb2R5UmVzdWx0Lm5hYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZWxvZHlSZXN1bHQuY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQuY29tbWVudCA9IG1lbG9keVJlc3VsdC5jb21tZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbiA9IHRlbnNpb25SZXN1bHQuZ2V0VG90YWxUZW5zaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRoaXNDaG9yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZ29vZENob3JkIG9mIGdvb2RDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLmNob3JkICYmIGdvb2RDaG9yZFswXS5jaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0Nob3JkQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0Nob3JkQ291bnQgPj0gR09PRF9DSE9SRFNfUEVSX0NIT1JEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgd29yc3QgcHJldmlvdXMgZ29vZENob3JkIGlmIHRoaXMgaGFzIGxlc3MgdGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JzdENob3JkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yc3RDaG9yZFRlbnNpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ29vZENob3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kQ2hvcmQgPSBnb29kQ2hvcmRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ29vZENob3JkWzBdLmNob3JkICYmIGdvb2RDaG9yZFswXS5jaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZ29vZENob3JkWzBdLnRlbnNpb24/LnRvdGFsVGVuc2lvbiB8fCA5OTkpIDwgd29yc3RDaG9yZFRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JzdENob3JkID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yc3RDaG9yZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZ29vZENob3Jkc1t3b3JzdENob3JkXVswXS50ZW5zaW9uPy50b3RhbFRlbnNpb24gfHwgOTk5KSA+IHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcmVtb3ZlIHRoYXQgaW5kZXgsIGFkZCBhIG5ldyBvbmUgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RDaG9yZHMuc3BsaWNlKHdvcnN0Q2hvcmQsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0Nob3JkQ291bnQgPCBHT09EX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kQ2hvcmRzLnB1c2gocmFuZG9tTm90ZXMubWFwKChub3RlLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogbm90ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IEJFQVRfTEVOR1RILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiB0ZW5zaW9uUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogYXZhaWxhYmxlU2NhbGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IG9yaWdpbmFsU2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBSaWNoTm90ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZW5zaW9uUmVzdWx0LnRvdGFsVGVuc2lvbiA8IDEwMDAwMCAmJiBiYWRDaG9yZHMubGVuZ3RoIDwgQkFEX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hvcmRDb3VudEluQmFkQ2hvcmRzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JzdEJhZENob3JkOiBCYWRDaG9yZCB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiYWRDaG9yZCBvZiBiYWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFkQ2hvcmQuY2hvcmQuaW5jbHVkZXMobmV3Q2hvcmQudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvcmRDb3VudEluQmFkQ2hvcmRzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghd29yc3RCYWRDaG9yZCB8fCBiYWRDaG9yZC50ZW5zaW9uLnRvdGFsVGVuc2lvbiA+IHdvcnN0QmFkQ2hvcmQ/LnRlbnNpb24udG90YWxUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JzdEJhZENob3JkID0gYmFkQ2hvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hvcmRDb3VudEluQmFkQ2hvcmRzIDwgQkFEX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRDaG9yZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZC50b1N0cmluZygpICsgXCIsXCIgKyBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGVuc2lvblJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh3b3JzdEJhZENob3JkICE9IG51bGwgJiYgd29yc3RCYWRDaG9yZC50ZW5zaW9uLnRvdGFsVGVuc2lvbiA+IHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXhUb1JlcGxhY2UgPSBiYWRDaG9yZHMuZmluZEluZGV4KGIgPT4gYi5jaG9yZCA9PSB3b3JzdEJhZENob3JkLmNob3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRDaG9yZHNbaW5kZXhUb1JlcGxhY2VdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQudG9TdHJpbmcoKSArIFwiLFwiICsgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRlbnNpb25SZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAgLy8gRm9yIGF2YWlsYWJsZSBzY2FsZXMgZW5kXG4gICAgICAgICAgICB9ICAvLyBGb3Igdm9pY2VsZWFkaW5nIHJlc3VsdHMgZW5kXG4gICAgICAgIH0gIC8vIFdoaWxlIGVuZFxuICAgICAgICBsZXQgYmVzdE9mQmFkQ2hvcmRzID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBiYWRDaG9yZCBvZiBiYWRDaG9yZHMpIHtcbiAgICAgICAgICAgIGJhZENob3JkLnRlbnNpb24ucHJpbnQoXCJCYWQgY2hvcmQgXCIsIGJhZENob3JkLmNob3JkLCBcIiAtIFwiLCBiYWRDaG9yZC5zY2FsZS50b1N0cmluZygpLCBcIiAtIFwiKTtcbiAgICAgICAgICAgIGlmIChiZXN0T2ZCYWRDaG9yZHMgPT0gbnVsbCB8fCBiYWRDaG9yZC50ZW5zaW9uLnRvdGFsVGVuc2lvbiA8IGJlc3RPZkJhZENob3Jkcy50ZW5zaW9uLnRvdGFsVGVuc2lvbikge1xuICAgICAgICAgICAgICAgIGJlc3RPZkJhZENob3JkcyA9IGJhZENob3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKFxuICAgICAgICAgICAgICAgIFwiTm8gZ29vZCBjaG9yZHMgZm91bmQ6IFwiLFxuICAgICAgICAgICAgICAgICgoYmVzdE9mQmFkQ2hvcmRzICYmIGJlc3RPZkJhZENob3Jkcy50ZW5zaW9uKSA/IChbYmVzdE9mQmFkQ2hvcmRzLmNob3JkLCBiZXN0T2ZCYWRDaG9yZHMudGVuc2lvbi5jb21tZW50LCBiZXN0T2ZCYWRDaG9yZHMudGVuc2lvbi50b1ByaW50KCldKSA6IFwiXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXdhaXQgc2xlZXBNUygxKTtcbiAgICAgICAgICAgIC8vIEdvIGJhY2sgdG8gcHJldmlvdXMgY2hvcmQsIGFuZCBtYWtlIGl0IGFnYWluXG4gICAgICAgICAgICBpZiAoZGl2aXNpb24gPj0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbiAtPSBCRUFUX0xFTkdUSCAqIDI7XG4gICAgICAgICAgICAgICAgLy8gTWFyayB0aGUgcHJldmlvdXMgY2hvcmQgYXMgYmFubmVkXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3QmFubmVkTm90ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0Jhbm5lZE5vdGVzW25vdGUucGFydEluZGV4XSA9IG5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIHRoZSBwcmV2aW91cyBjaG9yZCAod2hlcmUgd2UgYXJlIGdvaW5nIHRvKVxuICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gPSBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0ucHVzaChuZXdCYW5uZWROb3Rlcyk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgYW55IG5vdGVzIGFmdGVyIHRoYXQgYWxzb1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBkaXZpc2lvbiArIEJFQVRfTEVOR1RIOyBpIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdLmxlbmd0aCA+IDEwICYmIHJlc3VsdFtkaXZpc2lvbl0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVG9vIG1hbnkgYmFucywgZ28gYmFjayBmdXJ0aGVyLiBSZW1vdmUgdGhlc2UgYmFucyBzbyB0aGV5IGRvbid0IGhpbmRlciBsYXRlciBwcm9ncmVzcy5cbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbiAtPSBCRUFUX0xFTkdUSFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdCYW5uZWROb3RlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdCYW5uZWROb3Rlc1tub3RlLnBhcnRJbmRleF0gPSBub3RlLm5vdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSA9IGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0ucHVzaChuZXdCYW5uZWROb3Rlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRpdmlzaW9uQmFuQ291bnRbZGl2aXNpb25dID0gZGl2aXNpb25CYW5Db3VudFtkaXZpc2lvbl0gfHwgMDtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSsrO1xuICAgICAgICAgICAgICAgIGlmIChkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSA+IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIHN0dWNrLiBHbyBiYWNrIDggYmVhdHMgYW5kIHRyeSBhZ2Fpbi5cbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb24gLT0gQkVBVF9MRU5HVEggKiA4O1xuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbkNvdW50W2RpdmlzaW9uXSA9IGRpdmlzaW9uQmFuQ291bnRbZGl2aXNpb25dIHx8IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkaXZpc2lvbiA8IC0xICogQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb24gPSAtMSAqIEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvbyBtYW55IGJhbnMsIGdvaW5nIGJhY2sgdG8gZGl2aXNpb24gXCIgKyBkaXZpc2lvbiArIFwiIGJhbiBjb3VudCBcIiArIGRpdmlzaW9uQmFuQ291bnRbZGl2aXNpb25dKTtcbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgdGhlIHJlc3VsdCB3aGVyZSB3ZSBhcmUgZ29pbmcgdG8gYW5kIGFueXRoaW5nIGFmdGVyIGl0XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZGl2aXNpb24gKyBCRUFUX0xFTkdUSCArIDE7IGkgPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRpdmlzaW9uQmFubmVkTm90ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBmYWlsZWQgcmlnaHQgYXQgdGhlIHN0YXJ0LlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmFuZG9tR2VuZXJhdG9yLmNsZWFuVXAoKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2l2ZVVQID0gcHJvZ3Jlc3NDYWxsYmFjayhjdXJyZW50QmVhdCAtIDEsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgaWYgKGdpdmVVUCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hvb3NlIHRoZSBiZXN0IGNob3JkIGZyb20gZ29vZENob3Jkc1xuICAgICAgICBsZXQgYmVzdENob3JkczogUmljaE5vdGVbXVtdID0gW107XG4gICAgICAgIGxldCB3b3JzdEJlc3RUZW5zaW9uOiBudW1iZXIgPSA5OTk7XG4gICAgICAgIGxldCBiZXN0VGVuc2lvbiA9IDk5OTtcbiAgICAgICAgZm9yIChjb25zdCBjaG9yZCBvZiBnb29kQ2hvcmRzKSB7XG4gICAgICAgICAgICBpZiAoY2hvcmRbMF0udGVuc2lvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hvcmRbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPCB3b3JzdEJlc3RUZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXN0Q2hvcmRzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleFRvUmVwbGFjZSA9IGJlc3RDaG9yZHMuZmluZEluZGV4KGIgPT4gYlswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbiA9PSB3b3JzdEJlc3RUZW5zaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RDaG9yZHNbaW5kZXhUb1JlcGxhY2VdID0gY2hvcmQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0Q2hvcmRzLnB1c2goY2hvcmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJlc3RUZW5zaW9uID0gY2hvcmRbMF0udGVuc2lvbi50b3RhbFRlbnNpb247XG4gICAgICAgICAgICAgICAgICAgIHdvcnN0QmVzdFRlbnNpb24gPSBiZXN0Q2hvcmRzLnJlZHVjZSgoYSwgYikgPT4gYVswXS50ZW5zaW9uLnRvdGFsVGVuc2lvbiA+IGJbMF0udGVuc2lvbi50b3RhbFRlbnNpb24gPyBhIDogYilbMF0udGVuc2lvbi50b3RhbFRlbnNpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNob3JkWzBdLnRlbnNpb24ucHJpbnQoY2hvcmRbMF0uY2hvcmQgPyBjaG9yZFswXS5jaG9yZC50b1N0cmluZygpIDogXCI/Q2hvcmQ/XCIsIGNob3JkWzBdLmludmVyc2lvbk5hbWUsIFwiYmVzdCB0ZW5zaW9uOiBcIiwgYmVzdFRlbnNpb24pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiZXN0Q2hvcmQgPSBiZXN0Q2hvcmRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJlc3RDaG9yZHMubGVuZ3RoKV07XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmVzdCBjaG9yZDogXCIsIGJlc3RDaG9yZFswXS5jaG9yZC50b1N0cmluZygpLCBiZXN0Q2hvcmRbMF0uaW52ZXJzaW9uTmFtZSwgYmVzdENob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uKTtcblxuICAgICAgICByZXN1bHRbZGl2aXNpb25dID0gYmVzdENob3JkO1xuICAgICAgICBpZiAoYmVzdENob3JkWzBdPy50ZW5zaW9uPy5uYWMpIHtcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVxdWlyZWQgTm9uIENob3JkIFRvbmVcbiAgICAgICAgICAgIGFkZE5vdGVCZXR3ZWVuKGJlc3RDaG9yZFswXS50ZW5zaW9uLm5hYywgZGl2aXNpb24sIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIDAsIHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2soY3VycmVudEJlYXQsIHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmFuZG9tR2VuZXJhdG9yLmNsZWFuVXAoKTtcbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VNdXNpYyhwYXJhbXM6IE1haW5NdXNpY1BhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjazogTnVsbGFibGU8RnVuY3Rpb24+ID0gbnVsbCkge1xuICAgIGxldCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcbiAgICBkaXZpc2lvbmVkTm90ZXMgPSBhd2FpdCBtYWtlQ2hvcmRzKHBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjayk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG5cbiAgICAvLyBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSBuZXdWb2ljZUxlYWRpbmdOb3RlcyhjaG9yZHMsIHBhcmFtcyk7XG4gICAgYnVpbGRUb3BNZWxvZHkoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIC8vIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzOiBkaXZpc2lvbmVkTm90ZXMsXG4gICAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTWVsb2R5KGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgLy8gUmVtb3ZlIG9sZCBtZWxvZHkgYW5kIG1ha2UgYSBuZXcgb25lXG4gICAgY29uc3QgbWF4QmVhdHMgPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKClcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBkaXZpc2lvbisrKSB7XG4gICAgICAgIGNvbnN0IG9uQmVhdCA9IGRpdmlzaW9uICUgQkVBVF9MRU5HVEggPT0gMDtcbiAgICAgICAgaWYgKCFvbkJlYXQpIHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBbXVxuICAgICAgICB9IGVsc2UgaWYgKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gJiYgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZvckVhY2gocmljaE5vdGUgPT4ge1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLmR1cmF0aW9uID0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICAgICAgcmljaE5vdGUudGllID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcyk7XG4gICAgLy8gYWRkRWlnaHRoTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG4gICAgLy8gYWRkSGFsZk5vdGVzKGRpdmlzaW9uZWROb3RlcywgbWFpblBhcmFtcylcbn1cblxuZXhwb3J0IHsgYnVpbGRUYWJsZXMgfSIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IGFkZE5vdGVCZXR3ZWVuLCBmaW5kTkFDcywgRmluZE5vbkNob3JkVG9uZVBhcmFtcywgTm9uQ2hvcmRUb25lIH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiwgVGVuc2lvblBhcmFtcyB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2V0TWVsb2R5TmVlZGVkVG9uZXMsIGdldFJpY2hOb3RlLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIEZvcmNlZE1lbG9keVJlc3VsdCA9IHtcbiAgICBjb21tZW50OiBzdHJpbmcsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIG5hYzogTm9uQ2hvcmRUb25lIHwgbnVsbCxcbn1cblxuXG5cbmV4cG9ydCBjb25zdCBhZGRGb3JjZWRNZWxvZHkgPSAodmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogRm9yY2VkTWVsb2R5UmVzdWx0ID0+IHtcbiAgICAvKlxuICAgIFxuICAgICovXG4gICAgY29uc3QgeyB0b05vdGVzLCBjdXJyZW50U2NhbGUsIHBhcmFtcywgbWFpblBhcmFtcywgYmVhdERpdmlzaW9uIH0gPSB2YWx1ZXM7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKHBhcmFtcyk7XG4gICAgY29uc3QgY2hvcmQgPSB2YWx1ZXMubmV3Q2hvcmQ7XG4gICAgY29uc3QgZGl2aXNpb25lZE5vdGVzID0gdmFsdWVzLmRpdmlzaW9uZWROb3RlcyB8fCB7fTtcbiAgICBjb25zdCBtYXhEaXZpc2lvbiA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKSAqIEJFQVRfTEVOR1RIO1xuICAgIGNvbnN0IHRlbnNpb246IEZvcmNlZE1lbG9keVJlc3VsdCA9IHtcbiAgICAgICAgY29tbWVudDogXCJcIixcbiAgICAgICAgdGVuc2lvbjogMCxcbiAgICAgICAgbmFjOiBudWxsLFxuICAgIH1cblxuICAgIGNvbnN0IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zID0gZ2V0TWVsb2R5TmVlZGVkVG9uZXMobWFpblBhcmFtcyk7XG4gICAgY29uc3QgbWVsb2R5RXhpc3RzID0gKG1haW5QYXJhbXMuZm9yY2VkTWVsb2R5IHx8IFtdKS5sZW5ndGggPiAwO1xuICAgIGlmICghbWVsb2R5RXhpc3RzKSB7XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cbiAgICBkZWJ1Z2dlcjtcblxuICAgIGNvbnN0IGN1cnJlbnREaXZpc2lvbiA9IGJlYXREaXZpc2lvbjtcbiAgICBjb25zdCBjYWRlbmNlRGl2aXNpb24gPSBjdXJyZW50RGl2aXNpb24gLSBwYXJhbXMuY2FkZW5jZVN0YXJ0RGl2aXNpb247XG5cbiAgICAvLyBTdHJvbmcgYmVhdCBub3RlIGlzIHN1cHBvc2VkIHRvIGJlIHRoaXNcbiAgICBsZXQgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uXTtcbiAgICBsZXQgbmV3TWVsb2R5VG9uZURpdmlzaW9uID0gY2FkZW5jZURpdmlzaW9uO1xuICAgIGlmICghbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSB0b25lIGZvciB0aGlzIGRpdmlzaW9uLCB0aGUgcHJldmlvdXMgdG9uZSBtdXN0IGJlIGxlbmd0aHkuIFVzZSBpdC5cbiAgICAgICAgZm9yIChsZXQgaSA9IGNhZGVuY2VEaXZpc2lvbiAtIDE7IGkgPj0gY2FkZW5jZURpdmlzaW9uIC0gQkVBVF9MRU5HVEggKiAyOyBpLS0pIHtcbiAgICAgICAgICAgIG5ld01lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2ldO1xuICAgICAgICAgICAgaWYgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIG5ld01lbG9keVRvbmVEaXZpc2lvbiA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24gfHwgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cIjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgY29uc3QgbmV3TWVsb2R5U2VtaXRvbmUgPSBjdXJyZW50U2NhbGUubm90ZXNbbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdLnNlbWl0b25lICsgMSAtIDE7ICAvLyBDb252ZXJ0IHRvIG51bWJlclxuICAgIGNvbnN0IHRvU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAoKHgpID0+IHguc2VtaXRvbmUpO1xuXG4gICAgLy8gQ2FuIHdlIHR1cm4gdGhpcyBub3RlIGludG8gYSBub24tY2hvcmQgdG9uZT8gQ2hlY2sgdGhlIHByZXZpb3VzIGFuZCBuZXh0IG5vdGUuXG4gICAgbGV0IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgbGV0IG5leHRNZWxvZHlUb25lRGl2aXNpb247XG4gICAgZm9yIChsZXQgaSA9IG5ld01lbG9keVRvbmVEaXZpc2lvbiArIDE7IGkgPD0gbWF4RGl2aXNpb247IGkrKykge1xuICAgICAgICBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbaV07XG4gICAgICAgIGlmIChuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgICAgICBuZXh0TWVsb2R5VG9uZURpdmlzaW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uIHx8IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24udG9uZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cbiAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJObyBtZWxvZHkgZm91bmQgYXQgYWxsLiBHaXZlIHVwLlwiO1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG5cbiAgICAvLyBMZXQncyBub3QgY2FyZSB0aGF0IG11Y2ggaWYgdGhlIHdlYWsgYmVhdCBub3RlIGlzIG5vdCBjb3JyZWN0LiBJdCBqdXN0IGFkZHMgdGVuc2lvbiB0byB0aGUgcmVzdWx0LlxuICAgIC8vIFVOTEVTUyBpdCdzIGluIHRoZSBtZWxvZHkgYWxzby5cblxuICAgIC8vIFdoYXQgTkFDIGNvdWxkIHdvcms/XG4gICAgLy8gQ29udmVydCBhbGwgdmFsdWVzIHRvIGdsb2JhbFNlbWl0b25lc1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZSh0b05vdGVzWzBdKVxuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAoKHgpID0+IGdsb2JhbFNlbWl0b25lKHgpKTtcbiAgICBsZXQgcHJldlJpY2hOb3RlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50RGl2aXNpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBwcmV2UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKS5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IDApWzBdO1xuICAgICAgICBpZiAocHJldlJpY2hOb3RlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmV2QmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tjdXJyZW50RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gMClbMF07XG4gICAgbGV0IHByZXZCZWF0R2xvYmFsU2VtaXRvbmUgPSBwcmV2QmVhdFJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldkJlYXRSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG5cbiAgICBsZXQgcHJldlBhcnQxUmljaE5vdGU7XG4gICAgZm9yIChsZXQgaSA9IGN1cnJlbnREaXZpc2lvbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHByZXZQYXJ0MVJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSAxKVswXTtcbiAgICAgICAgaWYgKHByZXZQYXJ0MVJpY2hOb3RlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHByZXZpb3VzIG5vdGUgZG9lc24ndCBleGlzdCwgdGhpcyBpcyBhY3R1YWxseSBlYXNpZXIuXG4gICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gcHJldlJpY2hOb3RlID8gZ2xvYmFsU2VtaXRvbmUocHJldlJpY2hOb3RlLm5vdGUpIDogbnVsbDtcblxuICAgIC8vIFRyeWluZyB0byBmaWd1cmUgb3V0IHRoZSBtZWxvZHkgZGlyZWN0aW9uLi4uIFdlIHNob3VsZCBwdXQgb2N0YXZlcyBpbiB0aGUgZm9yY2VkIG1lbG9keSBzdHJpbmcuLi5cbiAgICBjb25zdCBjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbiA9IHByZXZCZWF0R2xvYmFsU2VtaXRvbmUgfHwgZnJvbUdsb2JhbFNlbWl0b25lIHx8IHRvR2xvYmFsU2VtaXRvbmU7XG5cbiAgICBsZXQgY2xvc2VzdENvcnJlY3RHVG9uZSA9IG5ld01lbG9keVNlbWl0b25lO1xuICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAoTWF0aC5hYnMoY2xvc2VzdENvcnJlY3RHVG9uZSAtIGNsb3Nlc3RDb3JyZWN0R1RvbmVCYXNlZE9uKSA+IDYgJiYgY2xvc2VzdENvcnJlY3RHVG9uZSA8PSBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICBpdGVyYXRpb25zKys7IGlmIChpdGVyYXRpb25zID4gMTAwKSB7IGRlYnVnZ2VyOyAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICBjbG9zZXN0Q29ycmVjdEdUb25lICs9IDEyICogTWF0aC5zaWduKGNsb3Nlc3RDb3JyZWN0R1RvbmVCYXNlZE9uIC0gY2xvc2VzdENvcnJlY3RHVG9uZSk7XG4gICAgfVxuXG4gICAgbGV0IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgaWYgKG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dENvcnJlY3RHdG9uZSA9IGdsb2JhbFNlbWl0b25lKGN1cnJlbnRTY2FsZS5ub3Rlc1tuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdKSAlIDEyO1xuICAgICAgICBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKG5leHRDb3JyZWN0R3RvbmUgLSBjbG9zZXN0Q29ycmVjdEdUb25lKSA+IDYgJiYgbmV4dENvcnJlY3RHdG9uZSA8PSBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgaXRlcmF0aW9ucysrOyBpZiAoaXRlcmF0aW9ucyA+IDEwMCkgeyBkZWJ1Z2dlcjsgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICAgICAgbmV4dENvcnJlY3RHdG9uZSArPSAxMiAqIE1hdGguc2lnbihjbG9zZXN0Q29ycmVjdEdUb25lIC0gbmV4dENvcnJlY3RHdG9uZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXh0Q29ycmVjdEd0b25lIHx8ICFuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIC8vIElmIG1lbG9keSBoYXMgZW5kZWQsIHVzZSBjdXJyZW50IG1lbG9keSB0b25lLlxuICAgICAgICBuZXh0Q29ycmVjdEd0b25lID0gY2xvc2VzdENvcnJlY3RHVG9uZTtcbiAgICAgICAgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbjtcbiAgICB9XG5cbiAgICBsZXQgbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBtZWxvZHlUb25lc0FuZER1cmF0aW9uc1tjYWRlbmNlRGl2aXNpb24gKyBCRUFUX0xFTkdUSF07XG4gICAgaWYgKCFuZXh0QmVhdE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICBuZXh0QmVhdE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgfVxuICAgIGxldCBuZXh0QmVhdENvcnJlY3RHVG9uZTtcbiAgICBpZiAobmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dEJlYXRDb3JyZWN0R1RvbmUgPSBnbG9iYWxTZW1pdG9uZShjdXJyZW50U2NhbGUubm90ZXNbbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24udG9uZV0pICUgMTI7XG4gICAgICAgIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAoTWF0aC5hYnMobmV4dEJlYXRDb3JyZWN0R1RvbmUgLSBuZXh0Q29ycmVjdEd0b25lKSA+IDYgJiYgbmV4dEJlYXRDb3JyZWN0R1RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRpb25zKysgPiAxMDApIHsgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9uc1wiKTsgfVxuICAgICAgICAgICAgbmV4dEJlYXRDb3JyZWN0R1RvbmUgKz0gMTIgKiBNYXRoLnNpZ24obmV4dENvcnJlY3RHdG9uZSAtIG5leHRCZWF0Q29ycmVjdEdUb25lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIDE6IHRoZSBwcmV2aW91cyBub3RlLCAyOiB3aGF0IHRoZSBjdXJyZW50IG5vdGUgc2hvdWxkIGJlLCAzOiB3aGF0IHRoZSBuZXh0IG5vdGUgc2hvdWxkIGJlLlxuICAgIC8vIEJhc2VkIG9uIHRoZSByZXF1aXJlZCBkdXJhdGlvbnMsIHdlIGhhdmUgc29tZSBjaG9pY2VzOlxuXG4gICAgLy8gMS4gQmVhdCBtZWxvZHkgaXMgYSBxdWFydGVyLiBUaGlzIGlzIHRoZSBlYXNpZXN0IGNhc2UuXG4gICAgLy8gSGVyZSB3ZSBjYW4gYXQgdGhlIG1vc3QgdXNlIGEgOHRoLzh0aCBOQUMgb24gdGhlIHN0cm9uZyBiZWF0LlxuICAgIC8vIFRob3VnaCwgdGVuc2lvbiBpcyBhZGRlZC5cblxuICAgIC8vIDIuIEN1cnJlbnQgYmVhdCBtZWxvZHkgaXMgOHRoIGFuZCA4dGguIEJvdGggbm90ZXMgTVVTVCBiZSBjb3JyZWN0LlxuICAgIC8vIEJhc2Ugb24gdGhlIG5leHQgbm90ZSB3ZSBjYW4gdXNlIHNvbWUgTkFDcy4gVGhpcyBpcyB3aGVyZSB0aGUgd2VhayBiZWF0IE5BQ3MgY29tZSBpbi5cblxuICAgIC8vIDMuIEN1cnJlbnQgYmVhdCBtZWxvZHkgaXMgYSBoYWxmIG5vdGUuIFdlIGNhbiB1c2UgYSBzdHJvbmcgYmVhdCBOQUMuXG4gICAgLy8gVGVuc2lvbiBpcyBhZGRlZC5cblxuICAgIC8vIEhhcmRlciBjYXNlcywgc3VjaCBhcyBzeW5jb3BhdGlvbiwgYXJlIG5vdCBoYW5kbGVkLiB5ZXQuXG5cbiAgICBsZXQgcGFydDFNYXhHVG9uZSA9IE1hdGgubWF4KHRvR2xvYmFsU2VtaXRvbmVzWzFdLCBwcmV2UGFydDFSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZQYXJ0MVJpY2hOb3RlLm5vdGUpIDogMCk7XG5cbiAgICBjb25zdCBuYWNQYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge1xuICAgICAgICBmcm9tR1RvbmU6IGZyb21HbG9iYWxTZW1pdG9uZSB8fCBjbG9zZXN0Q29ycmVjdEdUb25lLFxuICAgICAgICB0aGlzQmVhdEdUb25lOiB0b0dsb2JhbFNlbWl0b25lLFxuICAgICAgICBuZXh0QmVhdEdUb25lOiBuZXh0QmVhdENvcnJlY3RHVG9uZSxcbiAgICAgICAgc2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgY2hvcmQ6IGNob3JkLFxuICAgICAgICBnVG9uZUxpbWl0czogW3BhcnQxTWF4R1RvbmUsIDEyN10sICAvLyBUT0RPXG4gICAgICAgIHdhbnRlZEdUb25lczogW10sXG4gICAgfVxuXG4gICAgY29uc3QgZWVTdHJvbmdNb2RlID0gKFxuICAgICAgICBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggfHxcbiAgICAgICAgKFxuICAgICAgICAgICAgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIgJiYgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIpICYmXG4gICAgICAgICAgICBjbG9zZXN0Q29ycmVjdEdUb25lICE9IHRvR2xvYmFsU2VtaXRvbmVcbiAgICAgICAgKVxuICAgIClcblxuICAgIGlmIChlZVN0cm9uZ01vZGUpIHtcbiAgICAgICAgaWYgKGNsb3Nlc3RDb3JyZWN0R1RvbmUgPT0gdG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29ycmVjdCBub3RlLiBObyB0ZW5zaW9uLlxuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJDb3JyZWN0IHF1YXJ0ZXIgbm90ZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWRkIGEgcmlnaHQgTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC5cbiAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1swXSA9IGNsb3Nlc3RDb3JyZWN0R1RvbmU7XG4gICAgICAgIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgICAgICBuYWNQYXJhbXMud2FudGVkR1RvbmVzWzFdID0gbmV4dENvcnJlY3RHdG9uZTtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lICE9IG5leHRDb3JyZWN0R3RvbmUpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgSW5Db3JyZWN0IDh0aC84dGggbm90ZSwgJHtnVG9uZVN0cmluZyh0b0dsb2JhbFNlbWl0b25lKX0gIT0gJHtnVG9uZVN0cmluZyhuZXh0Q29ycmVjdEd0b25lKX1gO1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmFjUGFyYW1zLnNwbGl0TW9kZSA9IFwiRUVcIlxuICAgICAgICBjb25zdCBuYWMgPSBmaW5kTkFDcyhuYWNQYXJhbXMgYXMgRmluZE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgIGlmICghbmFjKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgTm8gTkFDIGZvdW5kOiB3YW50ZWRUb25lczogJHsobmFjUGFyYW1zLndhbnRlZEdUb25lcyBhcyBudW1iZXJbXSkubWFwKHRvbmUgPT4gZ1RvbmVTdHJpbmcodG9uZSkpfWAgKyBgJHtnVG9uZVN0cmluZyhuYWNQYXJhbXMudGhpc0JlYXRHVG9uZSl9LCAke2dUb25lU3RyaW5nKG5leHRDb3JyZWN0R3RvbmUpfSwgJHtnVG9uZVN0cmluZyhuYWNQYXJhbXMubmV4dEJlYXRHVG9uZSl9YDtcbiAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbiArPSAxMDA7XG4gICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdOb3RlR1RvbmUgPSBnbG9iYWxTZW1pdG9uZShuYWMubm90ZSk7XG4gICAgICAgIC8vIEdyZWF0Li4uIFdlIGNhbiBhZGQgYSBjb3JyZWN0IDh0aCBvbiB0aGUgc3Ryb25nIGJlYXQhXG4gICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAvLyB0ZW5zaW9uLmNvbW1lbnQgPSBgQWRkaW5nIE5BQyBvbiBzdHJvbmcgYmVhdDogJHtnVG9uZVN0cmluZyhnbG9iYWxTZW1pdG9uZShuYWMubm90ZSkpfSB0byBkaXZpc2lvbiAke2N1cnJlbnREaXZpc2lvbn0sIHdhbnRlZEd0b25lczogJHtuYWNQYXJhbXMud2FudGVkR1RvbmVzLm1hcChnVG9uZVN0cmluZyl9YDtcbiAgICAgICAgdGVuc2lvbi5uYWMgPSBuYWM7XG4gICAgICAgIHRlbnNpb24udGVuc2lvbiArPSA1OyAvLyBOb3QgdGhhdCBncmVhdCwgYnV0IGl0J3MgYmV0dGVyIHRoYW4gbm90aGluZy5cbiAgICB9IGVsc2UgaWYgKG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIgJiYgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbiA9PSBCRUFUX0xFTkdUSCAvIDIpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWRkIGEgcmlnaHQgTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC4gYW5kIGEgcmlnaHQgbmFjIG9uIHdlYWsgYmVhdFxuICAgICAgICBpZiAoY2xvc2VzdENvcnJlY3RHVG9uZSA9PSB0b0dsb2JhbFNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTdHJvbmcgYmVhdCBpcyBhbHJlYWR5IGNvcnJlY3QuIE5lZWQgYSBub3RlIG9uIHdlYWsgYmVhdFxuICAgICAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1sxXSA9IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgICAgICAgICBuYWNQYXJhbXMuc3BsaXRNb2RlID0gXCJFRVwiXG4gICAgICAgICAgICBjb25zdCBuYWMgPSBmaW5kTkFDcyhuYWNQYXJhbXMgYXMgRmluZE5vbkNob3JkVG9uZVBhcmFtcyk7XG4gICAgICAgICAgICBpZiAoIW5hYykge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gTkFDIGZvdW5kIGZvciBxdWFydGVyIG5vdGVcIjtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3Tm90ZUdUb25lID0gZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpO1xuICAgICAgICAgICAgLy8gR3JlYXQuLi4gV2UgY2FuIGFkZCBhIGNvcnJlY3QgOHRoIG9uIHRoZSBzdHJvbmcgYmVhdCFcbiAgICAgICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAgICAgLy8gdGVuc2lvbi5jb21tZW50ID0gYEFkZGluZyB3ZWFrIEVFIE5BQyAke2dUb25lU3RyaW5nKGdsb2JhbFNlbWl0b25lKG5hYy5ub3RlKSl9IHRvIGRpdmlzaW9uICR7Y3VycmVudERpdmlzaW9ufSwgd2FudGVkR3RvbmVzOiAke25hY1BhcmFtcy53YW50ZWRHVG9uZXMubWFwKGdUb25lU3RyaW5nKX1gO1xuICAgICAgICAgICAgdGVuc2lvbi5uYWMgPSBuYWM7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGFic29sdXRlbHkgcGVyZmVjdCwgYm90aCBub3RlcyBhcmUgY29ycmVjdC4gKG5vIHRlbnNpb24hKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2VsbCwgbm8gY2FuIGRvIHRoZW4gSSBndWVzcy5cbiAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiY2xvc2VzdENvcnJlY3RHVG9uZSAhPSB0b0dsb2JhbFNlbWl0b25lXCI7XG4gICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG5cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IGAke25ld01lbG9keVRvbmVBbmREdXJhdGlvbi5kdXJhdGlvbn0gIT0gJHtCRUFUX0xFTkdUSH1gO1xuICAgIH1cbiAgICBcbiAgICB0ZW5zaW9uLnRlbnNpb24gPSAwO1xuICAgIHJldHVybiB0ZW5zaW9uO1xufSIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IGNvbnN0IGdvb2RTb3VuZGluZ1NjYWxlVGVuc2lvbiA9ICh0ZW5zaW9uOiBUZW5zaW9uLCB2YWx1ZXM6IFRlbnNpb25QYXJhbXMpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzLFxuICAgICAgICAgICAgZnJvbU5vdGVzT3ZlcnJpZGUsXG4gICAgICAgICAgICB0b05vdGVzLFxuICAgICAgICAgICAgbmV3Q2hvcmQsXG4gICAgICAgICAgICBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyxcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICBiZWF0RGl2aXNpb24sXG4gICAgICAgIH0gPSB2YWx1ZXM7XG4gICAgXG4gICAgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCwgIC8vIENcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsICAvLyBEXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMl0uc2VtaXRvbmVdOiAyLCAgLy8gRVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMywgIC8vIEZcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsICAvLyBHXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNV0uc2VtaXRvbmVdOiA1LCAgLy8gQVxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNiwgIC8vIEhcbiAgICAgICAgLy8gWyhjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmUgLSAxICsgMjQpICUgMTJdOiA2ICAvLyBGb3JjZSBhZGQgbGVhZGluZyB0b25lXG4gICAgfVxuXG4gICAgbGV0IHByZXZDaG9yZDtcbiAgICBsZXQgcHJldlByZXZDaG9yZDtcbiAgICBsZXQgcGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgcHJldlBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IGxhdGVzdE5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBpZiAoZGl2aXNpb25lZE5vdGVzKSB7XG4gICAgICAgIGNvbnN0IGxhdGVzdERpdmlzaW9uID0gYmVhdERpdmlzaW9uIC0gQkVBVF9MRU5HVEg7XG4gICAgICAgIGxldCB0bXAgOiBBcnJheTxOb3RlPiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb25dIHx8IFtdKSkge1xuICAgICAgICAgICAgLy8gVXNlIG9yaWdpbmFsIG5vdGVzLCBub3QgdGhlIG9uZXMgdGhhdCBoYXZlIGJlZW4gdHVybmVkIGludG8gTkFDc1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2UHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlBhc3NlZEZyb21Ob3RlcyA9IFsuLi50bXBdLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBmb3IgKGxldCBpPWJlYXREaXZpc2lvbjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhdGVzdE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlcy5ldmVyeShCb29sZWFuKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmcm9tTm90ZXNPdmVycmlkZSkge1xuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBmcm9tTm90ZXNPdmVycmlkZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0aGUgYmFzcywgaXMgaXQgZ291bmQgdXAgb3IgZG93biBhIHNjYWxlP1xuXG4gICAgaWYgKHByZXZQYXNzZWRGcm9tTm90ZXMpIHtcbiAgICAgICAgY29uc3QgcHJldkdsb2JhbFNlbWl0b25lcyA9IHByZXZQYXNzZWRGcm9tTm90ZXMubWFwKG4gPT4gZ2xvYmFsU2VtaXRvbmUobikpO1xuICAgICAgICBjb25zdCBmcm9tR2xvYmFsU2VtaXRvbmVzID0gcGFzc2VkRnJvbU5vdGVzLm1hcChuID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgY29uc3QgbGF0ZXN0R2xvYmFsU2VtaXRvbmVzID0gbGF0ZXN0Tm90ZXMubWFwKG4gPT4gZ2xvYmFsU2VtaXRvbmUobikpO1xuICAgICAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKG4gPT4gZ2xvYmFsU2VtaXRvbmUobikpO1xuICAgICAgICBjb25zdCBub3Rlc0J5UGFydCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8cGFzc2VkRnJvbU5vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBub3Rlc0J5UGFydFtpXSA9IFt0b0dsb2JhbFNlbWl0b25lc1tpXV07XG4gICAgICAgICAgICBpZiAobGF0ZXN0R2xvYmFsU2VtaXRvbmVzW2ldICYmIGxhdGVzdEdsb2JhbFNlbWl0b25lc1tpXSAhPT0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXSkge1xuICAgICAgICAgICAgICAgIG5vdGVzQnlQYXJ0W2ldLnB1c2gobGF0ZXN0R2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vdGVzQnlQYXJ0W2ldLnB1c2goZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAocHJldkdsb2JhbFNlbWl0b25lc1tpXSkge1xuICAgICAgICAgICAgICAgIG5vdGVzQnlQYXJ0W2ldLnB1c2gocHJldkdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHBhcnRTY2FsZUluZGV4ZXMgPSBub3Rlc0J5UGFydFtpXS5tYXAobiA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbiAlIDEyXSk7XG5cbiAgICAgICAgICAgIGxldCBnb2luZ1VwT3JEb3duQVNjYWxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAocGFydFNjYWxlSW5kZXhlc1swXSAtIHBhcnRTY2FsZUluZGV4ZXNbMV0gPT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0U2NhbGVJbmRleGVzWzFdIC0gcGFydFNjYWxlSW5kZXhlc1syXSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExhc3QgMyBub3RlcyBhcmUgZ29pbmcgdXAgYSBzY2FsZVxuICAgICAgICAgICAgICAgICAgICBnb2luZ1VwT3JEb3duQVNjYWxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFydFNjYWxlSW5kZXhlc1swXSAtIHBhcnRTY2FsZUluZGV4ZXNbMV0gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydFNjYWxlSW5kZXhlc1sxXSAtIHBhcnRTY2FsZUluZGV4ZXNbMl0gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTGFzdCAzIG5vdGVzIGFyZSBnb2luZyBkb3duIGEgc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgZ29pbmdVcE9yRG93bkFTY2FsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZ29pbmdVcE9yRG93bkFTY2FsZSkge1xuICAgICAgICAgICAgICAgIGlmIChpID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5iYXNzU2NhbGUgKz0gMztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLnNvcHJhbm9TY2FsZSArPSAzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24ub3RoZXJTY2FsZSArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZW5zaW9uLmJhc3NTY2FsZSA+IDAgJiYgdGVuc2lvbi5zb3ByYW5vU2NhbGUgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pICUgMTJcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSA0IHx8IGludGVydmFsID09IDgpIHtcbiAgICAgICAgICAgICAgICAvLyAzcmRzIGFuZCA2dGhzIGFyZSBnb29kXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5iYXNzU29wcmFub1NjYWxlICs9IDM7ICAvLyBPdmVycmlkZSBiYXNzIGFuZCBzb3ByYW5vIHNhbWUgZGlyZWN0aW9uIGFsc29cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGVuc2lvbi5vdGhlclNjYWxlID4gMCAmJiB0ZW5zaW9uLnNvcHJhbm9TY2FsZSA+IDApIHtcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMl0pICUgMTJcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSA0IHx8IGludGVydmFsID09IDgpIHtcbiAgICAgICAgICAgICAgICAvLyAzcmRzIGFuZCA2dGhzIGFyZSBnb29kXG4gICAgICAgICAgICAgICAgdGVuc2lvbi5iYXNzU29wcmFub1NjYWxlICs9IDI7ICAvLyBTYW1lIHRoaW5nIGZvciBhbHRvIG9yIHRlbm9yICsgc29wcmFub1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1swXSAtIHRvR2xvYmFsU2VtaXRvbmVzWzFdKSAlIDEyXG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNCB8fCBpbnRlcnZhbCA9PSA4KSB7XG4gICAgICAgICAgICAgICAgLy8gM3JkcyBhbmQgNnRocyBhcmUgZ29vZFxuICAgICAgICAgICAgICAgIHRlbnNpb24uYmFzc1NvcHJhbm9TY2FsZSArPSAyOyAgLy8gU2FtZSB0aGluZyBmb3IgYWx0byBvciB0ZW5vciArIHNvcHJhbm9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE5vdGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBDaG9yZCwgZ2xvYmFsU2VtaXRvbmUsIGdUb25lU3RyaW5nLCBzZW1pdG9uZURpc3RhbmNlLCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgIGdUb25lRGlmZnM6IEFycmF5PEFycmF5PG51bWJlcj4+LFxuICAgIG5vdGVzOiB7W2tleTogbnVtYmVyXTogTm90ZX0sXG4gICAgcmF0aW5nOiBudW1iZXIsXG4gICAgaW52ZXJzaW9uTmFtZTogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBTaW1wbGVJbnZlcnNpb25SZXN1bHQgPSB7XG4gICAgbm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIHJhdGluZzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU6IHN0cmluZyxcbn1cblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2lvbnMgPSAodmFsdWVzOiB7XG4gICAgICAgIGNob3JkOiBDaG9yZCwgcHJldk5vdGVzOiBBcnJheTxOb3RlPiwgYmVhdDogbnVtYmVyLCBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgICAgICBsb2dnZXI6IExvZ2dlciwgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZzogbnVtYmVyXG4gICAgfSk6IEFycmF5PFNpbXBsZUludmVyc2lvblJlc3VsdD4gPT4ge1xuICAgIGNvbnN0IHtjaG9yZCwgcHJldk5vdGVzLCBiZWF0LCBwYXJhbXMsIGxvZ2dlciwgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZ30gPSB2YWx1ZXM7XG4gICAgLy8gUmV0dXJuIE5vdGVzIGluIHRoZSBDaG9yZCB0aGF0IGFyZSBjbG9zZXN0IHRvIHRoZSBwcmV2aW91cyBub3Rlc1xuICAgIC8vIEZvciBlYWNoIHBhcnRcblxuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhwYXJhbXMpO1xuXG4gICAgLy8gQWRkIGEgcmVzdWx0IGZvciBlYWNoIHBvc3NpYmxlIGludmVyc2lvblxuICAgIGNvbnN0IHJldDogQXJyYXk8U2ltcGxlSW52ZXJzaW9uUmVzdWx0PiA9IFtdO1xuXG4gICAgbGV0IGxhc3RCZWF0R2xvYmFsU2VtaXRvbmVzID0gWy4uLnN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzXVxuICAgIGlmIChwcmV2Tm90ZXMpIHtcbiAgICAgICAgbGFzdEJlYXRHbG9iYWxTZW1pdG9uZXMgPSBwcmV2Tm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuICAgIH1cblxuICAgIGlmICghY2hvcmQpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChjaG9yZCkge1xuICAgICAgICAvLyBGb3IgZWFjaCBiZWF0LCB3ZSB0cnkgdG8gZmluZCBhIGdvb2QgbWF0Y2hpbmcgc2VtaXRvbmUgZm9yIGVhY2ggcGFydC5cblxuICAgICAgICAvLyBSdWxlczpcbiAgICAgICAgLy8gV2l0aFx0cm9vdCBwb3NpdGlvbiB0cmlhZHM6IGRvdWJsZSB0aGUgcm9vdC4gXG5cbiAgICAgICAgLy8gV2l0aCBmaXJzdCBpbnZlcnNpb24gdHJpYWRzOiBkb3VibGUgdGhlIHJvb3Qgb3IgNXRoLCBpbiBnZW5lcmFsLiBJZiBvbmUgbmVlZHMgdG8gZG91YmxlIFxuICAgICAgICAvLyB0aGUgM3JkLCB0aGF0IGlzIGFjY2VwdGFibGUsIGJ1dCBhdm9pZCBkb3VibGluZyB0aGUgbGVhZGluZyB0b25lLlxuXG4gICAgICAgIC8vIFdpdGggc2Vjb25kIGludmVyc2lvbiB0cmlhZHM6IGRvdWJsZSB0aGUgZmlmdGguIFxuXG4gICAgICAgIC8vIFdpdGggIHNldmVudGggIGNob3JkczogIHRoZXJlICBpcyAgb25lIHZvaWNlICBmb3IgIGVhY2ggIG5vdGUsICBzbyAgZGlzdHJpYnV0ZSBhcyAgZml0cy4gSWYgIG9uZSBcbiAgICAgICAgLy8gbXVzdCBvbWl0IGEgbm90ZSBmcm9tIHRoZSBjaG9yZCwgdGhlbiBvbWl0IHRoZSA1dGguXG5cbiAgICAgICAgY29uc3QgZmlyc3RJbnRlcnZhbCA9IHNlbWl0b25lRGlzdGFuY2UoY2hvcmQubm90ZXNbMF0uc2VtaXRvbmUsIGNob3JkLm5vdGVzWzFdLnNlbWl0b25lKVxuICAgICAgICBjb25zdCB0aGlyZElzR29vZCA9IGZpcnN0SW50ZXJ2YWwgPT0gMyB8fCBmaXJzdEludGVydmFsID09IDQ7XG4gICAgICAgIGxvZ2dlci5sb2coXCJub3RlczogXCIsIGNob3JkLm5vdGVzLm1hcChuID0+IG4udG9TdHJpbmcoKSkpO1xuXG4gICAgICAgIC8vIERlcGVuZGluZyBvbiB0aGUgaW52ZXJzaW9uIGFuZCBjaG9yZCB0eXBlLCB3ZSdyZSBkb2luZyBkaWZmZXJlbnQgdGhpbmdzXG5cbiAgICAgICAgbGV0IGludmVyc2lvbk5hbWVzID0gW1wicm9vdFwiLCBcInJvb3QtZmlmdGhcIiwgXCJmaXJzdC1yb290XCIsIFwiZmlyc3QtdGhpcmRcIiwgXCJmaXJzdC1maWZ0aFwiLCBcInNlY29uZFwiXTtcbiAgICAgICAgbGV0IGNvbWJpbmF0aW9uQ291bnQgPSAzICogMiAqIDE7XG4gICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJyb290LXJvb3RcIiwgXCJyb290LXRoaXJkXCIsIFwiZmlyc3RcIiwgXCJmaXJzdC1yb290XCIsIFwiZmlyc3QtdGhpcmRcIiwgXCJzZWNvbmRcIiwgXCJ0aGlyZFwiLCBcInRoaXJkLXJvb3RcIiwgXCJ0aGlyZC10aGlyZFwiXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHNraXBGaWZ0aEluZGV4ID0gMDsgc2tpcEZpZnRoSW5kZXggPCAyOyBza2lwRmlmdGhJbmRleCsrKSB7XG4gICAgICAgIGZvciAobGV0IGludmVyc2lvbkluZGV4PTA7IGludmVyc2lvbkluZGV4PGludmVyc2lvbk5hbWVzLmxlbmd0aDsgaW52ZXJzaW9uSW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBjb21iaW5hdGlvbkluZGV4PTA7IGNvbWJpbmF0aW9uSW5kZXg8Y29tYmluYXRpb25Db3VudDsgY29tYmluYXRpb25JbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgcmF0aW5nID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHNraXBGaWZ0aCA9IHNraXBGaWZ0aEluZGV4ID09IDE7XG5cbiAgICAgICAgICAgIC8vIFdlIHRyeSBlYWNoIGludmVyc2lvbi4gV2hpY2ggaXMgYmVzdD9cbiAgICAgICAgICAgIGNvbnN0IGludmVyc2lvbiA9IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XTtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nIDwgMikge1xuICAgICAgICAgICAgICAgIGlmICghaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3Jvb3QnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gRG9uJ3QgZG8gYW55dGhpbmcgYnV0IHJvb3QgcG9zaXRpb24gb24gdGhlIGxhc3QgY2hvcmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGludmVyc2lvblJlc3VsdDogSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIGdUb25lRGlmZnM6IFtdLFxuICAgICAgICAgICAgICAgIG5vdGVzOiB7fSxcbiAgICAgICAgICAgICAgICByYXRpbmc6IDAsXG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uTmFtZXNbaW52ZXJzaW9uSW5kZXhdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChza2lwRmlmdGgpIHtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArPSBcIi1za2lwRmlmdGhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICs9IFwiLVwiICsgY29tYmluYXRpb25JbmRleDtcblxuICAgICAgICAgICAgY29uc3QgYWRkUGFydE5vdGUgPSAocGFydEluZGV4OiBudW1iZXIsIG5vdGU6IE5vdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSA9IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IG5vdGUuc2VtaXRvbmUsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogMSAgLy8gZHVtbXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyLmxvZyhcImludmVyc2lvbjogXCIsIGludmVyc2lvbiwgXCJza2lwRmlmdGg6IFwiLCBza2lwRmlmdGgpO1xuICAgICAgICAgICAgbGV0IHBhcnRUb0luZGV4OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge307XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHNlbGVjdCBib3R0b20gbm90ZVxuICAgICAgICAgICAgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCdmaXJzdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFszXSA9IDI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbi5zdGFydHNXaXRoKCd0aGlyZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMaXN0IG5vdGVzIHdlIGhhdmUgbGVmdCBvdmVyXG4gICAgICAgICAgICBsZXQgbGVmdE92ZXJJbmRleGVzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKGNob3JkLm5vdGVzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvbiA9PSBcInJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMl07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcInJvb3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMSwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3QgLT4gV2UgYWxyZWFkeSBoYXZlIDFcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAyXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1maWZ0aFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAyLCAyXTsgIC8vIERvdWJsZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcInNlY29uZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlY29uZCAtPiBXZSBhbHJlYWR5IGhhdmUgMlxuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMCwgMV07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNob3JkLm5vdGVzLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgLy8gTGVhdmUgb3V0IHRoZSBmaWZ0aCwgcG9zc2libHlcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzaW9uID09IFwicm9vdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDNdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJyb290LXRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzEsIDEsIDNdOyAgLy8gRG91YmxlIHRoZSB0aGlyZFxuICAgICAgICAgICAgICAgICAgICByYXRpbmcgKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LXJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMCwgM107ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcImZpcnN0LXRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDNdOyAgLy8gRG91YmxlIHRoZSB0aGlyZFxuICAgICAgICAgICAgICAgICAgICByYXRpbmcgKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcInRoaXJkLXJvb3RcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMCwgMV07ICAvLyBEb3VibGUgdGhlIHJvb3RcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludmVyc2lvbiA9PSBcInRoaXJkLXRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDFdOyAgLy8gRG91YmxlIHRoZSB0aGlyZFxuICAgICAgICAgICAgICAgICAgICByYXRpbmcgKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMiwgM10uZmlsdGVyKGkgPT4gaSAhPSBwYXJ0VG9JbmRleFszXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2tpcEZpZnRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRUb0luZGV4WzNdID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FuJ3Qgc2tpcCBmaWZ0aCBpbiBzZWNvbmQgaW52ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgPT0gMikubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FuJ3Qgc2tpcCBmaWZ0aCBpZiB3ZSBoYXZlIHR3b1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gbGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgIT0gMik7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGVpdGhlciBhIDAgb3IgMSB0byByZXBsYWNlIHRoZSBmaWZ0aFxuICAgICAgICAgICAgICAgIGlmIChsZWZ0T3ZlckluZGV4ZXMuZmlsdGVyKGkgPT4gaSA9PSAwKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMucHVzaCgxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERlcGVuZGluZyBvbiBjb21iaW5hdGlvbkluZGV4LCB3ZSBzZWxlY3QgdGhlIG5vdGVzIGZvciBwYXJ0SW5kZXhlcyAwLCAxLCAyXG4gICAgICAgICAgICBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIEZpcnN0IHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWNvbmQgcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gMikge1xuICAgICAgICAgICAgICAgIC8vIFRoaXJkIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAvLyBGb3VydGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tYmluYXRpb25JbmRleCA9PT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIEZpZnRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDUpIHtcbiAgICAgICAgICAgICAgICAvLyBTaXh0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXg9MDsgcGFydEluZGV4PDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgcGFydCBpcyBhbHJlYWR5IHNldFxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkUGFydE5vdGUocGFydEluZGV4LCBjaG9yZC5ub3Rlc1twYXJ0VG9JbmRleFtwYXJ0SW5kZXhdXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBMYXN0bHksIHdlIHNlbGVjdCB0aGUgbG93ZXN0IHBvc3NpYmxlIG9jdGF2ZSBmb3IgZWFjaCBwYXJ0XG4gICAgICAgICAgICBsZXQgbWluU2VtaXRvbmUgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydEluZGV4PTM7IHBhcnRJbmRleD49MDsgcGFydEluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3RlID0gaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF07XG4gICAgICAgICAgICAgICAgbGV0IGdUb25lID0gZ2xvYmFsU2VtaXRvbmUobm90ZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgaT0wO1xuICAgICAgICAgICAgICAgIHdoaWxlIChnVG9uZSA8IHNlbWl0b25lTGltaXRzW3BhcnRJbmRleF1bMF0gfHwgZ1RvbmUgPCBtaW5TZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gMTAwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdUb25lICs9IDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSA9IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTWFrZSBhIGNvcHkgaW52ZXJzaW9ucmVzdWx0IGZvciBlYWNoIHBvc3NpYmxlIG9jdGF2ZSBjb21iaW5hdGlvblxuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQwTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1swXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDFOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzFdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0Mk5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMl0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQzTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1szXSk7XG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0ME9jdGF2ZT0wOyBwYXJ0ME9jdGF2ZTwzOyBwYXJ0ME9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFydDBOb3RlID0gaW5pdGlhbFBhcnQwTm90ZSArIHBhcnQwT2N0YXZlICogMTI7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnQwTm90ZSA+IHNlbWl0b25lTGltaXRzWzBdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0MU9jdGF2ZT0wOyBwYXJ0MU9jdGF2ZTwzOyBwYXJ0MU9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQxTm90ZSA9IGluaXRpYWxQYXJ0MU5vdGUgKyBwYXJ0MU9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydDFOb3RlID4gcGFydDBOb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydDFOb3RlID4gc2VtaXRvbmVMaW1pdHNbMV1bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHBhcnQyT2N0YXZlPTA7IHBhcnQyT2N0YXZlPDM7IHBhcnQyT2N0YXZlKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQyTm90ZSA9IGluaXRpYWxQYXJ0Mk5vdGUgKyBwYXJ0Mk9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQyTm90ZSA+IHBhcnQxTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQyTm90ZSA+IHNlbWl0b25lTGltaXRzWzJdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0M09jdGF2ZT0wOyBwYXJ0M09jdGF2ZTwzOyBwYXJ0M09jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydDNOb3RlID0gaW5pdGlhbFBhcnQzTm90ZSArIHBhcnQzT2N0YXZlICogMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQzTm90ZSA+IHBhcnQyTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQzTm90ZSA+IHNlbWl0b25lTGltaXRzWzNdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQwTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0ME5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDFOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQxTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0Mk5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDJOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQzTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0M05vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUgKyBgICR7cGFydDBPY3RhdmV9JHtwYXJ0MU9jdGF2ZX0ke3BhcnQyT2N0YXZlfSR7cGFydDNPY3RhdmV9YCArIFwiIFwiICsgZ1RvbmVTdHJpbmcocGFydDBOb3RlKSArIFwiIFwiICsgZ1RvbmVTdHJpbmcocGFydDFOb3RlKSArIFwiIFwiICsgZ1RvbmVTdHJpbmcocGFydDJOb3RlKSArIFwiIFwiICsgZ1RvbmVTdHJpbmcocGFydDNOb3RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nOiByYXRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxvZ2dlci5wcmludChcIm5ld1ZvaWNlTGVhZGluZ05vdGVzOiBcIiwgY2hvcmQudG9TdHJpbmcoKSwgXCIgYmVhdDogXCIsIGJlYXQpO1xuXG4gICAgLy8gUmFuZG9taXplIG9yZGVyIG9mIHJldFxuICAgIGZvciAobGV0IGk9MDsgaTxyZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJldC5sZW5ndGgpO1xuICAgICAgICBjb25zdCB0bXAgPSByZXRbaV07XG4gICAgICAgIHJldFtpXSA9IHJldFtqXTtcbiAgICAgICAgcmV0W2pdID0gdG1wO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG4iLCJjb25zdCBwcmludENoaWxkTWVzc2FnZXMgPSAoY2hpbGRMb2dnZXI6IExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRMb2dnZXIuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5jaGlsZC50aXRsZSk7XG4gICAgICAgIHByaW50Q2hpbGRNZXNzYWdlcyhjaGlsZCk7XG4gICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBjaGlsZC5tZXNzYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4ubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgdGl0bGU6IGFueVtdID0gW107XG4gICAgbWVzc2FnZXM6IEFycmF5PGFueVtdPiA9IFtdO1xuICAgIHBhcmVudDogTG9nZ2VyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGNoaWxkcmVuOiBMb2dnZXJbXSA9IFtdO1xuICAgIGNsZWFyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogTG9nZ2VyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goYXJncyk7XG4gICAgfVxuXG4gICAgcHJpbnQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgLy8gTGV0IHBhcmVudCBoYW5kbGUgbWVcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLmFyZ3MpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLnRoaXMudGl0bGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHRvcCBsb2dnZXIuIFByaW50IGV2ZXJ5dGhpbmcuXG4gICAgICAgIHByaW50Q2hpbGRNZXNzYWdlcyh0aGlzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi50aGlzLm1lc3NhZ2VzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+IGNoaWxkICE9PSB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsZWFyZWQgPSB0cnVlO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBnZXRUZW5zaW9uLCBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMsIGdldFJpY2hOb3RlLCBnbG9iYWxTZW1pdG9uZSwgbmV4dEdUb25lSW5TY2FsZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UsIHNlbWl0b25lU2NhbGVJbmRleCwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IHR5cGUgTm9uQ2hvcmRUb25lID0ge1xuICAgIG5vdGU6IE5vdGUsXG4gICAgbm90ZTI/IDogTm90ZSwgIC8vIFRoaXMgbWFrZXMgdGhlIG5vdGVzIDE2dGhzXG4gICAgc3Ryb25nQmVhdDogYm9vbGVhbixcbiAgICByZXBsYWNlbWVudD86IGJvb2xlYW4sXG59XG5cbmV4cG9ydCB0eXBlIE5vbkNob3JkVG9uZVBhcmFtcyA9IHtcbiAgICBnVG9uZTA6IG51bWJlciB8IG51bGwsXG4gICAgZ1RvbmUxOiBudW1iZXIsXG4gICAgZ1RvbmUyOiBudW1iZXIsXG4gICAgd2FudGVkVG9uZT8gOiBudW1iZXIsXG4gICAgc3Ryb25nQmVhdD86IGJvb2xlYW4sXG4gICAgY2hvcmQ/IDogQ2hvcmQsXG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIGdUb25lTGltaXRzOiBudW1iZXJbXSxcbn1cblxudHlwZSBTcGxpdE1vZGUgPSBcIkVFXCIgfCBcIlNTRVwiIHwgXCJFU1NcIiB8IFwiU1NTU1wiXG5cbmV4cG9ydCB0eXBlIEZpbmROb25DaG9yZFRvbmVQYXJhbXMgPSB7XG4gICAgZnJvbUdUb25lOiBudW1iZXIsXG4gICAgdGhpc0JlYXRHVG9uZTogbnVtYmVyLFxuICAgIG5leHRCZWF0R1RvbmU6IG51bWJlcixcbiAgICBzcGxpdE1vZGU6IFNwbGl0TW9kZSxcbiAgICB3YW50ZWRHVG9uZXM6IG51bWJlcltdLCAgLy8gUHJvdmlkZSBndG9uZXMgZm9yIGVhY2ggd2FudGVkIGluZGV4IG9mIHNwbGl0bW9kZVxuICAgIHNjYWxlOiBTY2FsZSxcbiAgICBnVG9uZUxpbWl0czogbnVtYmVyW10sXG4gICAgY2hvcmQ/OiBDaG9yZCxcbn1cblxuXG5leHBvcnQgY29uc3QgYWRkTm90ZUJldHdlZW4gPSAobmFjOiBOb25DaG9yZFRvbmUsIGRpdmlzaW9uOiBudW1iZXIsIG5leHREaXZpc2lvbjogbnVtYmVyLCBwYXJ0SW5kZXg6IG51bWJlciwgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZGl2aXNpb25EaWZmID0gbmV4dERpdmlzaW9uIC0gZGl2aXNpb247XG4gICAgY29uc3QgYmVhdFJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gfHwgW10pLmZpbHRlcihub3RlID0+IG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleClbMF07XG4gICAgaWYgKCFiZWF0UmljaE5vdGUgfHwgIWJlYXRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmFpZWxkIHRvIGFkZCBub3RlIGJldHdlZW5cIiwgZGl2aXNpb24sIG5leHREaXZpc2lvbiwgcGFydEluZGV4LCBkaXZpc2lvbmVkTm90ZXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Tm90ZSA9IG5hYy5ub3RlO1xuICAgIGNvbnN0IG5ld05vdGUyID0gbmFjLm5vdGUyO1xuICAgIGNvbnN0IHN0cm9uZ0JlYXQgPSBuYWMuc3Ryb25nQmVhdDtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG5hYy5yZXBsYWNlbWVudCB8fCBmYWxzZTtcblxuICAgIC8vIElmIHN0cm9uZyBiZWF0LCB3ZSBhZGQgbmV3Tm90ZSBCRUZPUkUgYmVhdFJpY2hOb3RlXG4gICAgLy8gT3RoZXJ3aXNlIHdlIGFkZCBuZXdOb3RlIEFGVEVSIGJlYXRSaWNoTm90ZVxuXG4gICAgaWYgKHN0cm9uZ0JlYXQpIHtcbiAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDIsXG4gICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGJlYXRSaWNoTm90ZS5vcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgdGVuc2lvbjogbmV3IFRlbnNpb24oKSxcbiAgICAgICAgICAgIHBhcnRJbmRleDogcGFydEluZGV4LFxuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBuZXcgdG9uZSB0byBkaXZpc2lvblxuICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICAvLyBSZW1vdmUgYmVhdFJpY2hOb3RlIGZyb20gZGl2aXNpb25cbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0uZmlsdGVyKG5vdGUgPT4gbm90ZSAhPSBiZWF0UmljaE5vdGUpO1xuICAgICAgICBpZiAoIXJlcGxhY2VtZW50KSB7XG4gICAgICAgICAgICAvLyBBZGQgYmVhdFJpY2hOb3RlIHRvIGRpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMlxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChiZWF0UmljaE5vdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWRkIG5ldyB0b25lIGFsc28gdG8gZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbmV3Tm90ZTIpIHtcbiAgICAgICAgICAgIC8vIGFkZGluZyAxIDh0aCBub3RlXG4gICAgICAgICAgICBiZWF0UmljaE5vdGUuZHVyYXRpb24gPSBkaXZpc2lvbkRpZmYgLyAyO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ld05vdGUsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGRpdmlzaW9uRGlmZiAvIDIsXG4gICAgICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgICAgICBzY2FsZTogYmVhdFJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGJlYXRSaWNoTm90ZS5vcmlnaW5hbFNjYWxlLFxuICAgICAgICAgICAgICAgIHRlbnNpb246IG5ldyBUZW5zaW9uKCksXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFkZGluZyAyIDE2dGggbm90ZXNcbiAgICAgICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgLyAyXSA9IGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3UmFuZG9tUmljaE5vdGUgPSB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gNCxcbiAgICAgICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZTogYmVhdFJpY2hOb3RlLm9yaWdpbmFsU2NhbGUsXG4gICAgICAgICAgICAgICAgdGVuc2lvbjogbmV3IFRlbnNpb24oKSxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmICogMC43NV0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgKiAwLjc1XSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlMiA9IHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXdOb3RlMixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gNCxcbiAgICAgICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTY2FsZTogYmVhdFJpY2hOb3RlLm9yaWdpbmFsU2NhbGUsXG4gICAgICAgICAgICAgICAgdGVuc2lvbjogbmV3IFRlbnNpb24oKSxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAqIDAuNzVdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5jb25zdCBwYXNzaW5nVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBhIG5ldyBnVG9uZSBvciBudWxsLCBiYXNlZCBvbiB3aGV0aGVyIGFkZGluZyBhIHBhc3NpbmcgdG9uZSBpcyBhIGdvb2QgaWRlYS5cbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKGdUb25lMSAtIGdUb25lMik7XG4gICAgaWYgKGRpc3RhbmNlIDwgMyB8fCBkaXN0YW5jZSA+IDQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlVG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobiA9PiBuLnNlbWl0b25lKTtcbiAgICBmb3IgKGxldCBnVG9uZT1nVG9uZTE7IGdUb25lICE9IGdUb25lMjsgZ1RvbmUgKz0gKGdUb25lMSA8IGdUb25lMiA/IDEgOiAtMSkpIHtcbiAgICAgICAgaWYgKGdUb25lID09IGdUb25lMSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaXRvbmUgPSBnVG9uZSAlIDEyO1xuICAgICAgICBpZiAoc2NhbGVUb25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmNvbnN0IGFjY2VudGVkUGFzc2luZ1RvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICAvLyBTYW1lIGFzIHBhc3NpbmcgdG9uZSBidXQgb24gc3Ryb25nIGJlYXRcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhnVG9uZTAgLSBnVG9uZTEpO1xuICAgIGlmIChkaXN0YW5jZSA8IDMgfHwgZGlzdGFuY2UgPiA0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZVRvbmVzID0gc2NhbGUubm90ZXMubWFwKG4gPT4gbi5zZW1pdG9uZSk7XG4gICAgZm9yIChsZXQgZ1RvbmU9Z1RvbmUwOyBnVG9uZSAhPSBnVG9uZTE7IGdUb25lICs9IChnVG9uZTAgPCBnVG9uZTEgPyAxIDogLTEpKSB7XG4gICAgICAgIGlmIChnVG9uZSA9PSBnVG9uZTApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gZ1RvbmUgJSAxMjtcbiAgICAgICAgaWYgKHNjYWxlVG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cblxuY29uc3QgbmVpZ2hib3JUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCwgdGhlbiBzdGVwIGJhY2suIFRoaXMgaXMgb24gV2VhayBiZWF0XG4gICAgaWYgKGdUb25lMSAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHVwT3JEb3duQ2hvaWNlcyA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBbMSwgLTFdIDogWy0xLCAxXTtcbiAgICBmb3IgKGNvbnN0IHVwT3JEb3duIG9mIHVwT3JEb3duQ2hvaWNlcykge1xuICAgICAgICBjb25zdCBuZXdHdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCB1cE9yRG93biwgc2NhbGUpO1xuICAgICAgICBpZiAoIW5ld0d0b25lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3R3RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBuZXdHdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBuZXdHdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKG5ld0d0b25lIC8gMTIpLFxuICAgICAgICB9KSwgc3Ryb25nQmVhdDogZmFsc2V9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5jb25zdCBzdXNwZW5zaW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RheSBvbiBwcmV2aW91cywgdGhlbiBzdGVwIERPV04gaW50byBjaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0LlxuICAgIC8vIFVzdWFsbHkgZG90dGVkIVxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMCAtIGdUb25lMTtcbiAgICBpZiAoZGlzdGFuY2UgPCAxIHx8IGRpc3RhbmNlID4gMikge1xuICAgICAgICAvLyBNdXN0IGJlIGhhbGYgb3Igd2hvbGUgc3RlcCBkb3duLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGdUb25lMSB0byBnVG9uZTAgZm9yIHRoZSBsZW5ndGggb2YgdGhlIHN1c3BlbnNpb24uXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbm90ZTogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMCAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cm9uZ0JlYXQ6IHRydWUsXG4gICAgfVxufVxuXG5cbmNvbnN0IHJldGFyZGF0aW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RheSBvbiBwcmV2aW91cywgdGhlbiBzdGVwIFVQIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdFxuICAgIC8vIFVzdWFsbHkgZG90dGVkIVxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMSAtIGdUb25lMDtcbiAgICBpZiAoZGlzdGFuY2UgPCAxIHx8IGRpc3RhbmNlID4gMikge1xuICAgICAgICAvLyBNdXN0IGJlIGhhbGYgb3Igd2hvbGUgc3RlcCB1cC5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUwICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O31cblxuXG5jb25zdCBhcHBvZ2lhdHVyYSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIExlYXAsIHRoZW4gc3RlcCBiYWNrIGludG8gQ2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdFxuICAgIGlmICghZ1RvbmUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdUb25lMSAtIGdUb25lMDtcbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2UpIDwgMykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgdXBPckRvd24gPSAtMTtcbiAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgZG93biBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBhcHBvZ2lhdHVyYVxuICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIHVwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGFwcG9naWF0dXJhXG4gICAgICAgIHVwT3JEb3duID0gMTtcbiAgICB9XG4gICAgY29uc3QgZ1RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgdXBPckRvd24sIHNjYWxlKTtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07XG59XG5cbmNvbnN0IGVzY2FwZVRvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBTdGVwIGF3YXksIHRoZW4gTGVhcCBpbiB0byBuZXh0IENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gMTtcbiAgICAvLyBjb252ZXJ0IGdUb25lMSB0byBhIHN0ZXAgdXAgZnJvbSBnVG9uZTAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZXNjYXBlVG9uZVxuICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZnJvbSBnVG9uZTAgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZXNjYXBlVG9uZVxuICAgICAgICB1cE9yRG93biA9IC0xO1xuICAgIH1cbiAgICBjb25zdCBnVG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUwLCB1cE9yRG93biwgc2NhbGUpO1xuICAgIGlmICghZ1RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTtcbn1cblxuY29uc3QgYW50aWNpcGF0aW9uID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBvciBsZWFwIGVhcmx5IGluIHRvIG5leHQgQ2hvcmQgdG9uZS4gVGhpcyBpcyBvbiB3ZWFrIGJlYXQuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTIgLSBnVG9uZTE7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDEpIHtcbiAgICAgICAgLy8gVG9vIGNsb3NlIHRvIGJlIGFuIGFudGljaXBhdGlvblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBFYXN5LiBKdXN0IG1ha2UgYSBuZXcgbm90ZSB0aGF0cyB0aGUgc2FtZSBhcyBnVG9uZTIuXG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZTIgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGdUb25lMiAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogZmFsc2V9O1xufVxuXG5jb25zdCBuZWlnaGJvckdyb3VwID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBhd2F5LCB0aGVuIGxlYXAgaW50byB0aGUgXCJvdGhlciBwb3NzaWJsZVwiIG5laWdoYm9yIHRvbmUuIFRoaXMgdXNlcyAxNnRocyAodHdvIG5vdGVzKS5cbiAgICAvLyBXZWFrIGJlYXRcbiAgICBpZiAoZ1RvbmUxICE9IGdUb25lMikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVJbmRleCA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlbZ1RvbmUxICUgMTJdO1xuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgdXBHdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCAxLCBzY2FsZSk7XG4gICAgY29uc3QgZG93bkd0b25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIC0xLCBzY2FsZSk7XG4gICAgaWYgKCF1cEd0b25lIHx8ICFkb3duR3RvbmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICh1cEd0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgdXBHdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZG93bkd0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZG93bkd0b25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiB1cEd0b25lICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IodXBHdG9uZSAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIG5vdGUyOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogZG93bkd0b25lICUgMTIsXG4gICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZG93bkd0b25lIC8gMTIpLFxuICAgICAgICB9KSxcbiAgICAgICAgc3Ryb25nQmVhdDogZmFsc2VcbiAgICB9O1xufVxuXG5cbmNvbnN0IHBlZGFsUG9pbnQgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBSZXBsYWNlIHRoZSBlbnRpcmUgbm90ZSB3aXRoIHRoZSBub3RlIHRoYXQgaXMgYmVmb3JlIGl0IEFORCBhZnRlciBpdC5cbiAgICBpZiAoZ1RvbmUwICE9IGdUb25lMikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lMCA9PSBnVG9uZTEpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7ICAvLyBBbHJlYWR5IGV4aXN0c1xuICAgIH1cbiAgICBpZiAoZ1RvbmUxIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUxID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUwICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWUsIHJlcGxhY2VtZW50OiB0cnVlfTtcbn1cblxuXG5jb25zdCBjaG9yZE5vdGUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICAvLyBKdXN0IHVzZSBhIGNob3JkIHRvbmUuIFdlYWsgT1Igc3Ryb25nIGJlYXRcbiAgICBjb25zdCB7IGdUb25lMSwgY2hvcmQgfSA9IHZhbHVlcztcbiAgICBsZXQgc3Ryb25nQmVhdCA9IHZhbHVlcy5zdHJvbmdCZWF0O1xuICAgIGlmICghc3Ryb25nQmVhdCkge1xuICAgICAgICBzdHJvbmdCZWF0ID0gTWF0aC5yYW5kb20oKSA+IDAuODtcbiAgICB9XG4gICAgaWYgKCFjaG9yZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IHdhbnRlZFRvbmUgPSB2YWx1ZXMud2FudGVkVG9uZTtcbiAgICBpZiAoIXdhbnRlZFRvbmUpIHtcbiAgICAgICAgLy8gUmFuZG9tIGZyb20gY2hvcmQubm90ZXNcbiAgICAgICAgY29uc3Qgbm90ZSA9IGNob3JkLm5vdGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNob3JkLm5vdGVzLmxlbmd0aCldO1xuICAgICAgICB3YW50ZWRUb25lID0gbm90ZS5zZW1pdG9uZTtcbiAgICAgICAgLy8gU2VsZWN0IGNsb3Nlc3Qgb2N0YXZlIHRvIGdUb25lMVxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlIChNYXRoLmFicyh3YW50ZWRUb25lIC0gZ1RvbmUxKSA+PSA2KSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YW50ZWRUb25lICs9IDEyO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBnb29kID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBub3RlIG9mIGNob3JkLm5vdGVzKSB7XG4gICAgICAgIGlmIChub3RlLnNlbWl0b25lID09IHdhbnRlZFRvbmUgJSAxMikge1xuICAgICAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWdvb2QpIHtcbiAgICAgICAgLy8gV2FudGVkVG9uZSBpcyBub3QgYSBjaG9yZCB0b25lXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogd2FudGVkVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3Iod2FudGVkVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogc3Ryb25nQmVhdH07XG59XG5cbmNvbnN0IHdlYWtCZWF0Q2hvcmRUb25lICA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIHJldHVybiBjaG9yZE5vdGUoe1xuICAgICAgICAuLi52YWx1ZXMsXG4gICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlLFxuICAgIH0pO1xufVxuXG5jb25zdCBzdHJvbmdCZWF0Q2hvcmRUb25lICA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIHJldHVybiBjaG9yZE5vdGUoe1xuICAgICAgICAuLi52YWx1ZXMsXG4gICAgICAgIHN0cm9uZ0JlYXQ6IHRydWUsXG4gICAgfSlcbn1cblxuXG5leHBvcnQgY29uc3QgZmluZE5BQ3MgPSAodmFsdWVzOiBGaW5kTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2Zyb21HVG9uZSwgdGhpc0JlYXRHVG9uZSwgbmV4dEJlYXRHVG9uZSwgc3BsaXRNb2RlLCB3YW50ZWRHVG9uZXMsIHNjYWxlLCBnVG9uZUxpbWl0cywgY2hvcmR9ID0gdmFsdWVzO1xuXG4gICAgY29uc3Qgc3Ryb25nQmVhdEZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAnc3Ryb25nQmVhdENob3JkVG9uZSc6IHN0cm9uZ0JlYXRDaG9yZFRvbmUsXG4gICAgICAgICdhcHBvZ2lhdHVyYSc6IGFwcG9naWF0dXJhLFxuICAgICAgICAnZXNjYXBlVG9uZSc6IGVzY2FwZVRvbmUsXG4gICAgICAgICdwZWRhbFBvaW50JzogcGVkYWxQb2ludCxcbiAgICAgICAgJ3N1c3BlbnNpb24nOiBzdXNwZW5zaW9uLFxuICAgICAgICAncmV0YXJkYXRpb24nOiByZXRhcmRhdGlvbixcbiAgICAgICAgJ2FjY2VudGVkUGFzc2luZ1RvbmUnOiBhY2NlbnRlZFBhc3NpbmdUb25lLFxuICAgIH1cblxuICAgIGNvbnN0IHdlYWtCZWF0RnVuY3M6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7XG4gICAgICAgICd3ZWFrQmVhdENob3JkVG9uZSc6IHdlYWtCZWF0Q2hvcmRUb25lLFxuICAgICAgICAnYW50aWNpcGF0aW9uJzogYW50aWNpcGF0aW9uLFxuICAgICAgICAnbmVpZ2hib3JHcm91cCc6IG5laWdoYm9yR3JvdXAsXG4gICAgICAgICdwYXNzaW5nVG9uZSc6IHBhc3NpbmdUb25lLFxuICAgIH1cblxuICAgIGlmIChzcGxpdE1vZGUgPT0gJ0VFJykge1xuICAgICAgICAvLyBUaGlzIGNhc2Ugb25seSBoYXMgMiBjaG9pY2VzOiBzdHJvbmcgb3Igd2VhayBiZWF0XG4gICAgICAgIGxldCBzdHJvbmdCZWF0ID0gZmFsc2U7XG4gICAgICAgIC8vIEZpbmQgdGhlIHdhbnRlZCBub3Rlc1xuICAgICAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIGEgY2hhbmdlIG9uIHN0cm9uZyBiZWF0IG9yIG9uIHNvbWUgb3RoZXIgYmVhdFxuICAgICAgICBpZiAod2FudGVkR1RvbmVzWzBdICYmIHdhbnRlZEdUb25lc1swXSAhPSB0aGlzQmVhdEdUb25lKSB7XG4gICAgICAgICAgICBzdHJvbmdCZWF0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3Ryb25nQmVhdCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jTmFtZSBpbiBzdHJvbmdCZWF0RnVuY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gc3Ryb25nQmVhdEZ1bmNzW2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmdW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUwOiBmcm9tR1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMTogdGhpc0JlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUyOiBuZXh0QmVhdEdUb25lLFxuICAgICAgICAgICAgICAgICAgICB3YW50ZWRUb25lOiB3YW50ZWRHVG9uZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZUxpbWl0cyxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQsXG4gICAgICAgICAgICAgICAgfSBhcyBOb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3YW50ZWRHVG9uZXNbMF0gfHwgZ2xvYmFsU2VtaXRvbmUocmVzdWx0Lm5vdGUpID09IHdhbnRlZEdUb25lc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuY05hbWUgaW4gd2Vha0JlYXRGdW5jcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSB3ZWFrQmVhdEZ1bmNzW2Z1bmNOYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmdW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUwOiBmcm9tR1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMTogdGhpc0JlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmUyOiBuZXh0QmVhdEdUb25lLFxuICAgICAgICAgICAgICAgICAgICB3YW50ZWRUb25lOiB3YW50ZWRHVG9uZXNbMV0sXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZUxpbWl0cyxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQsXG4gICAgICAgICAgICAgICAgfSBhcyBOb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3YW50ZWRHVG9uZXNbMV0gfHwgZ2xvYmFsU2VtaXRvbmUocmVzdWx0Lm5vdGUpID09IHdhbnRlZEdUb25lc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5leHBvcnQgY29uc3QgYnVpbGRUb3BNZWxvZHkgPSAoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpID0+IHtcbiAgICAvLyBGb2xsb3cgdGhlIHByZSBnaXZlbiBtZWxvZHkgcmh5dGhtXG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zOiB7IFtrZXk6IG51bWJlcl06IG51bWJlcjsgfSA9IGdldFJoeXRobU5lZWRlZER1cmF0aW9ucyhtYWluUGFyYW1zKTtcblxuICAgIGNvbnN0IGxhc3REaXZpc2lvbiA9IEJFQVRfTEVOR1RIICogbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpO1xuICAgIGNvbnN0IGZpcnN0UGFyYW1zID0gbWFpblBhcmFtcy5jdXJyZW50Q2FkZW5jZVBhcmFtcygwKTtcbiAgICBjb25zdCB7c3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsIHNlbWl0b25lTGltaXRzfSA9IHN0YXJ0aW5nTm90ZXMoZmlyc3RQYXJhbXMpO1xuXG4gICAgZm9yIChsZXQgZGl2aXNpb24gPSAwOyBkaXZpc2lvbiA8IGxhc3REaXZpc2lvbiAtIEJFQVRfTEVOR1RIOyBkaXZpc2lvbiArPSBCRUFUX0xFTkdUSCkge1xuICAgICAgICBsZXQgZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdCA9IFtcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1swXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMV1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzJdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1szXV0sXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb24pO1xuICAgICAgICBjb25zdCBjYWRlbmNlRGl2aXNpb24gPSBkaXZpc2lvbiAtIHBhcmFtcy5hdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvbjtcbiAgICAgICAgY29uc29sZS5sb2coXCJDYWRlbmNlIGRpdmlzaW9uXCIsIGNhZGVuY2VEaXZpc2lvbiwgXCJkaXZpc2lvblwiLCBkaXZpc2lvbiwgXCJhdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvblwiLCBwYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb24pO1xuICAgICAgICBjb25zdCBuZWVkZWRSaHl0aG0gPSByaHl0aG1OZWVkZWREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uXSB8fCAxMDA7XG5cbiAgICAgICAgY29uc3QgbGFzdEJlYXRJbkNhZGVuY2UgPSBwYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPCAyXG4gICAgICAgIGlmIChsYXN0QmVhdEluQ2FkZW5jZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcmV2Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgICAgICBjb25zdCB0aGlzTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgICAgICBjb25zdCBuZXh0Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgICAgICBsZXQgY3VycmVudFNjYWxlOiBTY2FsZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiAtIEJFQVRfTEVOR1RIXSB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKHJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBpZiAocmljaE5vdGUuc2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIG5leHROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY3VycmVudFNjYWxlID0gY3VycmVudFNjYWxlO1xuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgbGltaXRzLCBuZXcgbm90ZXMgbXVzdCBhbHNvIGJlIGJldHdlZWVuIHRoZSBvdGhlciBwYXJ0IG5vdGVzXG4gICAgICAgICAgICAvLyAoIE92ZXJsYXBwaW5nIClcbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGdUb25lMSA9IGdsb2JhbFNlbWl0b25lKHJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgY29uc3QgZ1RvbmUyID0gZ2xvYmFsU2VtaXRvbmUobmV4dFJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgY29uc3QgbWluR1RvbmUgPSBNYXRoLm1pbihnVG9uZTEsIGdUb25lMik7XG4gICAgICAgICAgICBjb25zdCBtYXhHVG9uZSA9IE1hdGgubWF4KGdUb25lMSwgZ1RvbmUyKTtcbiAgICAgICAgICAgIGlmIChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgLy8gTGltaXQgdGhlIGhpZ2hlciBwYXJ0LCBpdCBjYW4ndCBnbyBsb3dlciB0aGFuIG1heEdUb25lXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXVswXSA9IE1hdGgubWF4KGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV1bMF0sIG1heEdUb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdKSB7XG4gICAgICAgICAgICAgICAgLy8gTGltaXQgdGhlIGxvd2VyIHBhcnQsIGl0IGNhbid0IGdvIGhpZ2hlciB0aGFuIG1pbkdUb25lXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXVsxXSA9IE1hdGgubWluKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV1bMV0sIG1pbkdUb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICBpZiAobmVlZGVkUmh5dGhtICE9IDIgKiBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIG5lZWQgZm9yIGhhbGYgbm90ZXNcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCBhIHRpZSB0byB0aGUgbmV4dCBub3RlXG4gICAgICAgICAgICBjb25zdCByaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24sIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uICsgQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXJpY2hOb3RlIHx8ICFyaWNoTm90ZS5ub3RlIHx8ICFuZXh0UmljaE5vdGUgfHwgIW5leHRSaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSkgIT0gZ2xvYmFsU2VtaXRvbmUobmV4dFJpY2hOb3RlLm5vdGUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWNoTm90ZS50aWUgPSBcInN0YXJ0XCI7XG4gICAgICAgICAgICBuZXh0UmljaE5vdGUudGllID0gXCJzdG9wXCI7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBwYXJ0SW5kZXggPSAwOyBwYXJ0SW5kZXggPCA0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKG5lZWRlZFJoeXRobSAhPSAgQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gbmVlZCBmb3IgOHRocy5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcmljaE5vdGUuc2NhbGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gc2NhbGUgZm9yIHJpY2hOb3RlXCIsIHJpY2hOb3RlKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcHJldlJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiAtIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuXG4gICAgICAgICAgICBjb25zdCBnVG9uZTEgPSBnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGNvbnN0IGdUb25lMiA9IGdsb2JhbFNlbWl0b25lKG5leHRSaWNoTm90ZS5ub3RlKTtcbiAgICAgICAgICAgIGxldCBnVG9uZTAgPSBwcmV2UmljaE5vdGUgPyBnbG9iYWxTZW1pdG9uZShwcmV2UmljaE5vdGUubm90ZSkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGdUb25lMCAmJiBwcmV2UmljaE5vdGUgJiYgcHJldlJpY2hOb3RlLmR1cmF0aW9uICE9IEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgLy8gRklYTUU6IHByZXZSaWNoTm90ZSBpcyBub3QgdGhlIHByZXZpb3VzIG5vdGUuIFdlIGNhbm5vdCB1c2UgaXQgdG8gZGV0ZXJtaW5lIHRoZSBwcmV2aW91cyBub3RlLlxuICAgICAgICAgICAgICAgIGdUb25lMCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuYWNQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgZ1RvbmUwLFxuICAgICAgICAgICAgICAgIGdUb25lMSxcbiAgICAgICAgICAgICAgICBnVG9uZTIsXG4gICAgICAgICAgICAgICAgc2NhbGU6IHJpY2hOb3RlLnNjYWxlLFxuICAgICAgICAgICAgICAgIGdUb25lTGltaXRzOiBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleF0sXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkIDh0aCBub3RlcyB0aGlzIGJlYXQuXG5cbiAgICAgICAgICAgIGNvbnN0IG5vbkNob3JkVG9uZUNob2ljZUZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAgICAgICAgIGFwcG9naWF0dXJhOiAoKSA9PiBhcHBvZ2lhdHVyYShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yR3JvdXA6ICgpID0+IG5laWdoYm9yR3JvdXAobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBzdXNwZW5zaW9uOiAoKSA9PiBzdXNwZW5zaW9uKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgZXNjYXBlVG9uZTogKCkgPT4gZXNjYXBlVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHBhc3NpbmdUb25lOiAoKSA9PiBwYXNzaW5nVG9uZShuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5laWdoYm9yVG9uZTogKCkgPT4gbmVpZ2hib3JUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcmV0YXJkYXRpb246ICgpID0+IHJldGFyZGF0aW9uKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgYW50aWNpcGF0aW9uOiAoKSA9PiBhbnRpY2lwYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBwZWRhbFBvaW50OiAoKSA9PiBwZWRhbFBvaW50KG5hY1BhcmFtcyksXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmUgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgdXNlZENob2ljZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9ucyA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgaXRlcmF0aW9ucyBpbiA4dGggbm90ZSBnZW5lcmF0aW9uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBub25DaG9yZFRvbmVDaG9pY2VzOiB7W2tleTogc3RyaW5nXTogTm9uQ2hvcmRUb25lfSA9IHt9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmcgPSBwYXJhbXMubm9uQ2hvcmRUb25lc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmcgfHwgIXNldHRpbmcuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlID0gbm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3Nba2V5XSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hvaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVDaG9pY2VzW2tleV0gPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFydEluZGV4ICE9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vbkNob3JkVG9uZUNob2ljZXMucGVkYWxQb2ludDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdXNpbmdLZXkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZUtleXMgPSBPYmplY3Qua2V5cyhub25DaG9yZFRvbmVDaG9pY2VzKS5maWx0ZXIoa2V5ID0+ICF1c2VkQ2hvaWNlcy5oYXMoa2V5KSk7XG4gICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZUtleXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBub25DaG9yZFRvbmVDaG9pY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VkQ2hvaWNlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9uQ2hvcmRUb25lID0gbm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNpbmdLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgcG9zc2libGUgbm9uIGNob3JkIHRvbmVcbiAgICAgICAgICAgICAgICAvLyBOb3cgd2UgbmVlZCB0byBjaGVjayB2b2ljZSBsZWFkaW5nIGZyb20gYmVmb3JlIGFuZCBhZnRlclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vbkNob3JkVG9uZU5vdGVzOiBOb3RlW10gPSBbLi4udGhpc05vdGVzXTtcblxuICAgICAgICAgICAgICAgIGlmIChub25DaG9yZFRvbmUuc3Ryb25nQmVhdCkge1xuICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmVOb3Rlc1twYXJ0SW5kZXhdID0gbm9uQ2hvcmRUb25lLm5vdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbnNpb25SZXN1bHQgPSBuZXcgVGVuc2lvbigpO1xuICAgICAgICAgICAgICAgIGdldFRlbnNpb24odGVuc2lvblJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICBmcm9tTm90ZXNPdmVycmlkZTogcHJldk5vdGVzLFxuICAgICAgICAgICAgICAgICAgICBiZWF0RGl2aXNpb246IGRpdmlzaW9uLFxuICAgICAgICAgICAgICAgICAgICB0b05vdGVzOiBub25DaG9yZFRvbmVOb3RlcyxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIG1haW5QYXJhbXM6IG1haW5QYXJhbXMsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBsZXQgdGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgdGVuc2lvbiArPSB0ZW5zaW9uUmVzdWx0LmRvdWJsZUxlYWRpbmdUb25lO1xuICAgICAgICAgICAgICAgIHRlbnNpb24gKz0gdGVuc2lvblJlc3VsdC5wYXJhbGxlbEZpZnRocztcbiAgICAgICAgICAgICAgICB0ZW5zaW9uICs9IHRlbnNpb25SZXN1bHQuc3BhY2luZ0Vycm9yO1xuICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVuc2lvbiB0b28gaGlnaCBmb3Igbm9uIGNob3JkIHRvbmVcIiwgdGVuc2lvbiwgbm9uQ2hvcmRUb25lLCB0ZW5zaW9uUmVzdWx0LCB1c2luZ0tleSk7XG4gICAgICAgICAgICAgICAgdXNlZENob2ljZXMuYWRkKHVzaW5nS2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYWRkTm90ZUJldHdlZW4obm9uQ2hvcmRUb25lLCBkaXZpc2lvbiwgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4LCBkaXZpc2lvbmVkTm90ZXMpO1xuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFNjYWxlLCBTY2FsZVRlbXBsYXRlcyB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBNYWluTXVzaWNQYXJhbXMge1xuICAgIGJlYXRzUGVyQmFyOiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VDb3VudDogbnVtYmVyID0gNDtcbiAgICBjYWRlbmNlczogQXJyYXk8TXVzaWNQYXJhbXM+ID0gW107XG4gICAgdGVzdE1vZGU/OiBib29sZWFuID0gZmFsc2U7XG4gICAgbWVsb2R5Umh5dGhtOiBzdHJpbmcgPSBcIlwiOyAgLy8gaGlkZGVuIGZyb20gdXNlciBmb3Igbm93XG4gICAgZm9yY2VkTWVsb2R5OiBudW1iZXJbXSA9IFtdOyAgLy8gaGlkZGVuIGZyb20gdXNlciBmb3Igbm93XG4gICAgZm9yY2VkQ2hvcmRzOiBzdHJpbmcgPSBcIlwiO1xuICAgIGZvcmNlZE9yaWdpbmFsU2NhbGU6IFNjYWxlIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFBhcnRpYWw8TWFpbk11c2ljUGFyYW1zPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gKHBhcmFtcyBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5tZWxvZHlSaHl0aG0gPSBcIlFRUVFRUVFRUVFRUVFRUVFRUVFRUVFcIlxuICAgICAgICB0aGlzLm1lbG9keVJoeXRobSA9IFwiRUVFRVFRRUVFRVFRRUVRRUVRRUVRRUVRXCI7XG4gICAgICAgIC8vIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAvLyAgICAgaWYgKHJhbmRvbSA8IDAuMikge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiSFwiO1xuICAgICAgICAvLyAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgLy8gICAgIH0gZWxzZSBpZiAocmFuZG9tIDwgMC43KSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5tZWxvZHlSaHl0aG0gKz0gXCJRXCI7XG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiRUVcIjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLmZvcmNlZE1lbG9keSA9IFswLCAxLCAyLCAzLCAzLCAzIF1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgMTIgMyA0MSAyIDM0IHR3byBiYXJzXG5cbiAgICAgICAgLy8gRG8gUmUgTWkgRmEgU28gTGEgVGkgRG9cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBcIlJSUlJSUlJSUlJSUlJSUlJSUlJSXCI7XG4gICAgICAgIC8vIHRoaXMuZm9yY2VkTWVsb2R5ID0gW1xuICAgICAgICAvLyAgICAgMCxcbiAgICAgICAgLy8gICAgIDEsXG4gICAgICAgIC8vICAgICAyLFxuICAgICAgICAvLyAgICAgMyxcbiAgICAgICAgLy8gICAgIDQsXG4gICAgICAgIC8vICAgICA1LFxuICAgICAgICAvLyAgICAgNCxcbiAgICAgICAgLy8gICAgIDMsXG4gICAgICAgIC8vICAgICAyLFxuICAgICAgICAvLyAgICAgMSxcbiAgICAgICAgLy8gICAgIDAsXG4gICAgICAgIC8vIF07XG4gICAgICAgIC8vIGxldCBtZWxvZHkgPSBbMF07XG4gICAgICAgIC8vIGZvciAobGV0IGk9MDsgaTwyMDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBjb25zdCB1cE9yRG93biA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XG4gICAgICAgIC8vICAgICBjb25zdCBwcmV2TWVsb2R5ID0gbWVsb2R5W21lbG9keS5sZW5ndGggLSAxXTtcbiAgICAgICAgLy8gICAgIG1lbG9keS5wdXNoKHByZXZNZWxvZHkgKyAoMSAqIHVwT3JEb3duKSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBtZWxvZHkubWFwKG0gPT4gKG0gKyA3ICogMTAwKSAlIDcpO1xuXG4gICAgICAgIC8vIEV4YW1wbGUgbWVsb2R5XG4gICAgICAgIC8vIEMgbWFqIC0gQ1xuICAgICAgICAvLyAgICAgICAgIEQgcHRcbiAgICAgICAgLy8gQyBtYWogICBFXG4gICAgICAgIC8vICAgICAgICAgRiBwdFxuICAgICAgICAvLyBBIG1pbiAgIEcgcHRcbiAgICAgICAgLy8gICAgICAgICBBXG4gICAgICAgIC8vIEEgbWluICAgQiBwdFxuICAgICAgICAvLyAgICAgICAgIENcbiAgICAgICAgLy8gRiBtYWogICBCIHB0XG4gICAgICAgIC8vICAgICAgICAgQVxuICAgICAgICAvLyBGIG1haiAgIEcgcHRcbiAgICAgICAgLy8gICAgICAgICBGXG4gICAgICAgIC8vIEcgbWFqICAgRSBwdFxuICAgICAgICAvLyAgICAgICAgIERcbiAgICAgICAgLy8gRyBtYWogICBDIHB0XG4gICAgICAgIC8vICAgICAgICAgRFxuICAgICAgICAvLyBDIG1haiAgIEVcbiAgICAgICAgLy8gICAgICAgICBGIHB0XG4gICAgICAgIC8vIEMgbWFqICAgR1xuICAgICAgICAvLyAgICAgICAgIEEgcHRcbiAgICAgICAgLy8gdGhpcy5mb3JjZWRDaG9yZHMgPSBcIjM2MjUxNjY2MlwiXG4gICAgICAgIHRoaXMuZm9yY2VkT3JpZ2luYWxTY2FsZSA9IG5ldyBTY2FsZSh7IGtleTogMCwgdGVtcGxhdGU6IFNjYWxlVGVtcGxhdGVzLm1ham9yIH0pO1xuICAgIH1cblxuICAgIGN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uOiBudW1iZXIpOiBNdXNpY1BhcmFtcyB7XG4gICAgICAgIGNvbnN0IGJlYXQgPSBNYXRoLmZsb29yKGRpdmlzaW9uIC8gQkVBVF9MRU5HVEgpO1xuICAgICAgICBjb25zdCBiYXIgPSBNYXRoLmZsb29yKGJlYXQgLyB0aGlzLmJlYXRzUGVyQmFyKTtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwOyAgLy8gVGhlIGJlYXQgd2UncmUgYXQgaW4gdGhlIGxvb3BcbiAgICAgICAgbGV0IGF1dGhlbnRpY0NhZGVuY2VTdGFydEJhciA9IDA7XG4gICAgICAgIGxldCBwcmV2Q2FkZW5jZSA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChjb25zdCBjYWRlbmNlUGFyYW1zIG9mIHRoaXMuY2FkZW5jZXMpIHtcbiAgICAgICAgICAgIC8vIExvb3AgY2FkZW5jZXMgaW4gb3JkZXJcbiAgICAgICAgICAgIGlmIChbXCJQQUNcIiwgXCJJQUNcIl0uaW5jbHVkZXMocHJldkNhZGVuY2UpKSB7XG4gICAgICAgICAgICAgICAgYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyID0gY291bnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXZDYWRlbmNlID0gY2FkZW5jZVBhcmFtcy5zZWxlY3RlZENhZGVuY2U7XG4gICAgICAgICAgICBjb3VudGVyICs9IGNhZGVuY2VQYXJhbXMuYmFyc1BlckNhZGVuY2U7XG4gICAgICAgICAgICBpZiAoYmFyIDwgY291bnRlcikgeyAgLy8gV2UgaGF2ZSBwYXNzZWQgdGhlIGdpdmVuIGRpdmlzaW9uLiBUaGUgcHJldmlvdXMgY2FkZW5jZSBpcyB0aGUgb25lIHdlIHdhbnRcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kID0gY291bnRlciAqIHRoaXMuYmVhdHNQZXJCYXIgLSBiZWF0O1xuICAgICAgICAgICAgICAgIGlmIChbXCJQQUNcIiwgXCJJQUNcIl0uaW5jbHVkZXMoY2FkZW5jZVBhcmFtcy5zZWxlY3RlZENhZGVuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPSBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPSA5OTk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbFNvbmdFbmQgPSB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhciAtIGJlYXQ7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1BlckJhciA9IHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5jYWRlbmNlU3RhcnREaXZpc2lvbiA9ICgoY291bnRlciAtIGNhZGVuY2VQYXJhbXMuYmFyc1BlckNhZGVuY2UpICogdGhpcy5iZWF0c1BlckJhcikgKiBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uID0gYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyICogdGhpcy5iZWF0c1BlckJhciAqIEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWRlbmNlUGFyYW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzWzBdO1xuICAgIH1cblxuICAgIGdldE1heEJlYXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmJhcnNQZXJDYWRlbmNlLCAwKSAqIHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTXVzaWNQYXJhbXMge1xuICAgIGJlYXRzVW50aWxDYWRlbmNlRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzVW50aWxBdXRoZW50aWNDYWRlbmNlRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzVW50aWxTb25nRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzUGVyQmFyOiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VTdGFydERpdmlzaW9uOiBudW1iZXIgPSAwO1xuICAgIGF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgYmFzZVRlbnNpb24/OiBudW1iZXIgPSAwLjM7XG4gICAgYmFyc1BlckNhZGVuY2U6IG51bWJlciA9IDJcbiAgICB0ZW1wbz86IG51bWJlciA9IDMwO1xuICAgIGhhbGZOb3Rlcz86IGJvb2xlYW4gPSB0cnVlO1xuICAgIHNpeHRlZW50aE5vdGVzPzogbnVtYmVyID0gMC4yO1xuICAgIGVpZ2h0aE5vdGVzPzogbnVtYmVyID0gMC40O1xuICAgIG1vZHVsYXRpb25XZWlnaHQ/OiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdXZWlnaHQ/OiBudW1iZXIgPSAyO1xuICAgIHBhcnRzOiBBcnJheTx7XG4gICAgICAgIHZvaWNlOiBzdHJpbmcsXG4gICAgICAgIG5vdGU6IHN0cmluZyxcbiAgICAgICAgdm9sdW1lOiBudW1iZXIsXG4gICAgfT4gPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDFcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkM1XCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiAxMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDFcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkE0XCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiA3LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MlwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQzRcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZvaWNlOiBcIjQzXCIsXG4gICAgICAgICAgICAgICAgbm90ZTogXCJFM1wiLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogMTAsXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgYmVhdFNldHRpbmdzOiBBcnJheTx7XG4gICAgICAgIHRlbnNpb246IG51bWJlcixcbiAgICB9PiA9IFtdO1xuICAgIGNob3JkU2V0dGluZ3M6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgICAgIG1hajoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpbToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGltNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hajc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IC0xLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbTc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaW43OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgc2NhbGVTZXR0aW5nczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICAgICAgd2VpZ2h0OiBudW1iZXJcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgICAgICBtYWpvcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbm9yOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIHNlbGVjdGVkQ2FkZW5jZTogc3RyaW5nID0gXCJIQ1wiO1xuICAgIG5vbkNob3JkVG9uZXM6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgICAgIHBhc3NpbmdUb25lOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmVpZ2hib3JUb25lOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VzcGVuc2lvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJldGFyZGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXBwb2dpYXR1cmE6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlc2NhcGVUb25lOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW50aWNpcGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmVpZ2hib3JHcm91cDoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBlZGFsUG9pbnQ6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cblxuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBQYXJ0aWFsPE11c2ljUGFyYW1zPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gKHBhcmFtcyBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVCZWF0U2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCZWF0U2V0dGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IGJlYXRDb3VudCA9IHRoaXMuYmVhdHNQZXJCYXIgKiB0aGlzLmJhcnNQZXJDYWRlbmNlO1xuICAgICAgICBpZiAodGhpcy5iZWF0U2V0dGluZ3MubGVuZ3RoIDwgYmVhdENvdW50KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5iZWF0U2V0dGluZ3MubGVuZ3RoOyBpIDwgYmVhdENvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJlYXRTZXR0aW5ncy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGhpcy5iYXNlVGVuc2lvbiB8fCAwLjMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5iZWF0U2V0dGluZ3MubGVuZ3RoID4gYmVhdENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmJlYXRTZXR0aW5ncyA9IHRoaXMuYmVhdFNldHRpbmdzLnNsaWNlKDAsIGJlYXRDb3VudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBDaG9yZCwgY2hvcmRUZW1wbGF0ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgUmFuZG9tQ2hvcmRHZW5lcmF0b3Ige1xuICAgIHByaXZhdGUgY2hvcmRUeXBlczogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBhdmFpbGFibGVDaG9yZHM/OiBBcnJheTxzdHJpbmc+O1xuICAgIHByaXZhdGUgdXNlZENob3Jkcz86IFNldDxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBNdXNpY1BhcmFtcykge1xuICAgICAgICBjb25zdCBjaG9yZFR5cGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmRUeXBlIGluIHBhcmFtcy5jaG9yZFNldHRpbmdzKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmNob3JkU2V0dGluZ3NbY2hvcmRUeXBlXS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgY2hvcmRUeXBlcy5wdXNoKGNob3JkVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaG9yZFR5cGVzID0gY2hvcmRUeXBlcztcbiAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYnVpbGRBdmFpbGFibGVDaG9yZHMoKSB7XG4gICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMgPSAodGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgW10pLmZpbHRlcihjaG9yZCA9PiAhKHRoaXMudXNlZENob3JkcyB8fCBuZXcgU2V0KCkpLmhhcyhjaG9yZCkpO1xuICAgICAgICAvLyAvLyBGaXJzdCB0cnkgdG8gYWRkIHRoZSBzaW1wbGVzdCBjaG9yZHNcbiAgICAgICAgLy8gZm9yIChjb25zdCBzaW1wbGVDaG9yZFR5cGUgb2YgdGhpcy5jaG9yZFR5cGVzLmZpbHRlcihjaG9yZFR5cGUgPT4gW1wibWFqXCIsIFwibWluXCJdLmluY2x1ZGVzKGNob3JkVHlwZSkpKSB7XG4gICAgICAgIC8vICAgICBmb3IgKGxldCByYW5kb21Sb290PTA7IHJhbmRvbVJvb3Q8MTI7IHJhbmRvbVJvb3QrKykge1xuICAgICAgICAvLyAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKSkge1xuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3Jkcy5wdXNoKHJhbmRvbVJvb3QgKyBzaW1wbGVDaG9yZFR5cGUpO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGlmICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cblxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTAwOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVR5cGUgPSB0aGlzLmNob3JkVHlwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jaG9yZFR5cGVzLmxlbmd0aCldO1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tUm9vdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyKTtcbiAgICAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhyYW5kb21Sb290ICsgcmFuZG9tVHlwZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3Jkcy5wdXNoKHJhbmRvbVJvb3QgKyByYW5kb21UeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgY2xlYW5VcCgpIHtcbiAgICAgICAgaWYgKHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMgPSBbXTtcbiAgICAgICAgZGVsZXRlIHRoaXMudXNlZENob3JkcztcbiAgICAgICAgZGVsZXRlIHRoaXMuYXZhaWxhYmxlQ2hvcmRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDaG9yZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmF2YWlsYWJsZUNob3JkcyB8fCB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZUNob3JkcyAmJiB0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoIC0gMyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvcmRUeXBlID0gdGhpcy5hdmFpbGFibGVDaG9yZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoKV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy51c2VkQ2hvcmRzLmhhcyhjaG9yZFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZWRDaG9yZHMuYWRkKGNob3JkVHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUNob3JkcyA9IHRoaXMuYXZhaWxhYmxlQ2hvcmRzLmZpbHRlcihjaG9yZCA9PiBjaG9yZCAhPT0gY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2hvcmQoY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVpbGRBdmFpbGFibGVDaG9yZHMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IGFkZEZvcmNlZE1lbG9keSB9IGZyb20gXCIuL2ZvcmNlZG1lbG9keVwiO1xuaW1wb3J0IHsgTm9uQ2hvcmRUb25lIH0gZnJvbSBcIi4vbm9uY2hvcmR0b25lc1wiO1xuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zLCBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIENob3JkLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBnbG9iYWxTZW1pdG9uZSwgZ1RvbmVTdHJpbmcsIG1halNjYWxlRGlmZmVyZW5jZSwgTnVsbGFibGUsIHNlbWl0b25lRGlzdGFuY2UsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjbGFzcyBUZW5zaW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7fVxuXG5cbmV4cG9ydCBjbGFzcyBUZW5zaW9uIHtcbiAgICBub3RJblNjYWxlOiBudW1iZXIgPSAwO1xuICAgIG1vZHVsYXRpb246IG51bWJlciA9IDA7XG4gICAgYWxsTm90ZXNTYW1lOiBudW1iZXIgPSAwO1xuICAgIGNob3JkUHJvZ3Jlc3Npb246IG51bWJlciA9IDA7XG4gICAga2VlcERvbWluYW50VG9uZXM6IG51bWJlciA9IDA7XG4gICAgcGFyYWxsZWxGaWZ0aHM6IG51bWJlciA9IDA7XG4gICAgc3BhY2luZ0Vycm9yOiBudW1iZXIgPSAwO1xuICAgIGNhZGVuY2U6IG51bWJlciA9IDA7XG4gICAgdGVuc2lvbmluZ0ludGVydmFsOiBudW1iZXIgPSAwO1xuICAgIHNlY29uZEludmVyc2lvbjogbnVtYmVyID0gMDtcbiAgICBkb3VibGVMZWFkaW5nVG9uZTogbnVtYmVyID0gMDtcbiAgICBsZWFkaW5nVG9uZVVwOiBudW1iZXIgPSAwO1xuICAgIG1lbG9keUp1bXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5VGFyZ2V0OiBudW1iZXIgPSAwO1xuICAgIHZvaWNlRGlyZWN0aW9uczogbnVtYmVyID0gMDtcbiAgICBvdmVybGFwcGluZzogbnVtYmVyID0gMDtcblxuICAgIHNldmVudGhUZW5zaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgaW52ZXJzaW9uVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGZvcmNlZE1lbG9keTogbnVtYmVyID0gMDtcbiAgICBuYWM/OiBOb25DaG9yZFRvbmU7XG5cbiAgICBiYXNzU2NhbGU6IG51bWJlciA9IDA7XG4gICAgc29wcmFub1NjYWxlOiBudW1iZXIgPSAwO1xuICAgIG90aGVyU2NhbGU6IG51bWJlciA9IDA7XG4gICAgYmFzc1NvcHJhbm9TY2FsZTogbnVtYmVyID0gMDtcblxuICAgIHRvdGFsVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGNvbW1lbnQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBnZXRUb3RhbFRlbnNpb24odmFsdWVzPzoge3BhcmFtczogTXVzaWNQYXJhbXMsIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2U6IG51bWJlcn0pIHtcbiAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubm90SW5TY2FsZSAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1vZHVsYXRpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5hbGxOb3Rlc1NhbWU7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5jaG9yZFByb2dyZXNzaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMua2VlcERvbWluYW50VG9uZXM7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5wYXJhbGxlbEZpZnRocyAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNwYWNpbmdFcnJvcjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNhZGVuY2U7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy50ZW5zaW9uaW5nSW50ZXJ2YWw7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5zZWNvbmRJbnZlcnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmxlYWRpbmdUb25lVXA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlUYXJnZXQ7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlKdW1wO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMudm9pY2VEaXJlY3Rpb25zO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMub3ZlcmxhcHBpbmc7XG5cbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmZvcmNlZE1lbG9keTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNldmVudGhUZW5zaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuaW52ZXJzaW9uVGVuc2lvbjtcblxuICAgICAgICB0ZW5zaW9uIC09IHRoaXMuYmFzc1NjYWxlO1xuICAgICAgICB0ZW5zaW9uIC09IHRoaXMuYmFzc1NvcHJhbm9TY2FsZTtcblxuICAgICAgICB0aGlzLnRvdGFsVGVuc2lvbiA9IHRlbnNpb247XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIHRvUHJpbnQoKSB7XG4gICAgICAgIGNvbnN0IHRvUHJpbnQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmIChgJHt0aGlzW2tleV19YCAhPSBcIjBcIiAmJiB0eXBlb2YgdGhpc1trZXldID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0b1ByaW50W2tleV0gPSAodGhpc1trZXldIGFzIHVua25vd24gYXMgbnVtYmVyKS50b0ZpeGVkKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b1ByaW50O1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHRvUHJpbnQgPSB0aGlzLnRvUHJpbnQoKTtcbiAgICAgICAgLy8gUHJpbnQgb25seSBwb3NpdGl2ZSB2YWx1ZXNcbiAgICAgICAgaWYgKHRoaXMuY29tbWVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb21tZW50LCAuLi5hcmdzLCB0b1ByaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MsIHRvUHJpbnQpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBXaXRoUHJveHlDYWxsYmFjayhvYmo6IGFueSwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogYW55IHtcbiAgICByZXR1cm4gbmV3IFByb3h5KG9iaiwge1xuICAgICAgZ2V0ICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKVxuICAgICAgICAvLyB3cmFwcyBuZXN0ZWQgZGF0YSB3aXRoIFByb3h5XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gd3JhcFdpdGhQcm94eUNhbGxiYWNrKHJlc3VsdCwgY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSxcbiAgICAgIHNldCAodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAvLyBjYWxscyBjYWxsYmFjayBvbiBldmVyeSBzZXQgb3BlcmF0aW9uXG4gICAgICAgIGNhbGxiYWNrKHRhcmdldCwga2V5LCB2YWx1ZSAvKiBhbmQgd2hhdGV2ZXIgZWxzZSB5b3UgbmVlZCAqLylcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVRlbnNpb24oKTogVGVuc2lvbiB7XG4gICAgcmV0dXJuIHdyYXBXaXRoUHJveHlDYWxsYmFjayhuZXcgVGVuc2lvbigpLCAodGFyZ2V0OiBUZW5zaW9uLCBrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LmdldFRvdGFsVGVuc2lvbigpID4gMjApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW5zaW9uRXJyb3IoXCJUZW5zaW9uIHRvbyBoaWdoXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCB0eXBlIFRlbnNpb25QYXJhbXMgPSB7XG4gICAgZGl2aXNpb25lZE5vdGVzPzogRGl2aXNpb25lZFJpY2hub3RlcyxcbiAgICBiZWF0RGl2aXNpb246IG51bWJlcixcbiAgICBmcm9tTm90ZXNPdmVycmlkZT86IEFycmF5PE5vdGU+LFxuICAgIHRvTm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIGN1cnJlbnRTY2FsZTogU2NhbGUsXG4gICAgb3JpZ2luYWxTY2FsZTogU2NhbGUsXG4gICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZT86IG51bWJlcixcbiAgICBwYXJhbXM6IE11c2ljUGFyYW1zLFxuICAgIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcyxcbiAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nPzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU/OiBzdHJpbmcsXG4gICAgcHJldkludmVyc2lvbk5hbWU/OiBTdHJpbmcsXG4gICAgbmV3Q2hvcmQ/OiBDaG9yZCxcbn1cblxuXG5leHBvcnQgY29uc3QgZ2V0VGVuc2lvbiA9ICh0ZW5zaW9uOiBUZW5zaW9uLCB2YWx1ZXM6IFRlbnNpb25QYXJhbXMpOiBUZW5zaW9uID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzLFxuICAgICAgICAgICAgZnJvbU5vdGVzT3ZlcnJpZGUsXG4gICAgICAgICAgICB0b05vdGVzLFxuICAgICAgICAgICAgbmV3Q2hvcmQsXG4gICAgICAgICAgICBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyxcbiAgICAgICAgICAgIGludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgIG1haW5QYXJhbXMsXG4gICAgICAgICAgICBiZWF0RGl2aXNpb24sXG4gICAgICAgIH0gPSB2YWx1ZXM7XG4gICAgLypcbiAgICAqICAgR2V0IHRoZSB0ZW5zaW9uIGJldHdlZW4gdHdvIGNob3Jkc1xuICAgICogICBAcGFyYW0gZnJvbUNob3JkOiBDaG9yZFxuICAgICogICBAcGFyYW0gdG9DaG9yZDogQ2hvcmRcbiAgICAqICAgQHJldHVybjogdGVuc2lvbiB2YWx1ZSBiZXR3ZWVuIC0xIGFuZCAxXG4gICAgKi9cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZm9yIChsZXQgaT1iZWF0RGl2aXNpb247IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXMuZmlsdGVyKG5vdGUgPT4gbm90ZSkubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbU5vdGVzT3ZlcnJpZGUpIHtcbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gZnJvbU5vdGVzT3ZlcnJpZGU7XG4gICAgfVxuXG4gICAgbGV0IGFsbHNhbWUgPSB0cnVlO1xuICAgIGZvciAobGV0IGk9MDsgaTx0b05vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghcGFzc2VkRnJvbU5vdGVzW2ldKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZQYXNzZWRGcm9tTm90ZXNbaV0pIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFzc2VkRnJvbU5vdGVzW2ldLmVxdWFscyh0b05vdGVzW2ldKSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2UGFzc2VkRnJvbU5vdGVzW2ldLmVxdWFscyh0b05vdGVzW2ldKSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZXZDaG9yZCAmJiBwcmV2UHJldkNob3JkICYmIG5ld0Nob3JkICYmIHByZXZDaG9yZC50b1N0cmluZygpID09IG5ld0Nob3JkLnRvU3RyaW5nKCkgJiYgcHJldlByZXZDaG9yZC50b1N0cmluZygpID09IHByZXZDaG9yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGFsbHNhbWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoYWxsc2FtZSkge1xuICAgICAgICB0ZW5zaW9uLmFsbE5vdGVzU2FtZSA9IDEwMDtcbiAgICB9XG5cbiAgICBsZXQgZnJvbU5vdGVzO1xuICAgIGlmIChwYXNzZWRGcm9tTm90ZXMubGVuZ3RoIDwgNCkge1xuICAgICAgICBmcm9tTm90ZXMgPSB0b05vdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZyb21Ob3RlcyA9IHBhc3NlZEZyb21Ob3RlcztcbiAgICB9XG5cbiAgICBjb25zdCB0b1NlbWl0b25lcyA9IHRvTm90ZXMubWFwKG5vdGUgPT4gbm90ZS5zZW1pdG9uZSk7XG4gICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lcyA9IGZyb21Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG4gICAgY29uc3QgdG9HbG9iYWxTZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcblxuICAgIC8vIElmIHRoZSBub3RlcyBhcmUgbm90IGluIHRoZSBjdXJyZW50IHNjYWxlLCBpbmNyZWFzZSB0aGUgdGVuc2lvblxuICAgIGxldCBub3Rlc05vdEluU2NhbGU6IEFycmF5PG51bWJlcj4gPSBbXVxuICAgIGxldCBuZXdTY2FsZTogTnVsbGFibGU8U2NhbGU+ID0gbnVsbDtcbiAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChjdXJyZW50U2NhbGUua2V5IC0gMSArIDI0KSAlIDEyXG5cbiAgICBpZiAoY3VycmVudFNjYWxlKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlU2VtaXRvbmVzID0gY3VycmVudFNjYWxlLm5vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgICAgICBub3Rlc05vdEluU2NhbGUgPSB0b1NlbWl0b25lcy5maWx0ZXIoc2VtaXRvbmUgPT4gIXNjYWxlU2VtaXRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSk7XG4gICAgICAgIG5vdGVzTm90SW5TY2FsZSA9IG5vdGVzTm90SW5TY2FsZS5maWx0ZXIoc2VtaXRvbmUgPT4gc2VtaXRvbmUgIT0gbGVhZGluZ1RvbmUpO1xuICAgICAgICBpZiAobm90ZXNOb3RJblNjYWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFF1aWNrIHJldHVybiwgdGhpcyBjaG9yZCBzdWNrc1xuICAgICAgICAgICAgdGVuc2lvbi5ub3RJblNjYWxlICs9IDEwMFxuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgdG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tqXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb25pbmdJbnRlcnZhbCArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAyKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMC41O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSA2KSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMS41O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGludmVyc2lvbk5hbWUgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSB8fCAocHJldkludmVyc2lvbk5hbWUgfHwgXCJcIikuc3RhcnRzV2l0aCgnc2Vjb25kJykpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZnJvbVNlbWl0b25lIC0gdG9TZW1pdG9uZSkgPiAyKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5zZWNvbmRJbnZlcnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgndGhpcmQnKSB8fCAocHJldkludmVyc2lvbk5hbWUgfHwgXCJcIikuc3RhcnRzV2l0aCgndGhpcmQnKSkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhmcm9tU2VtaXRvbmUgLSB0b1NlbWl0b25lKSA+IDIpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNlY29uZEludmVyc2lvbiArPSAxMDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uIC09IDAuMTsgIC8vIFJvb3QgaW52ZXJzaW9ucyBhcmUgZ3JlYXRcbiAgICB9XG5cbiAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLCAgLy8gQ1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLCAgLy8gRlxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LCAgLy8gSFxuICAgICAgICAvLyBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICB9XG5cbiAgICBjb25zdCBsZWFkaW5nVG9uZVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lICsgMTE7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZSAlIDEyID09IGxlYWRpbmdUb25lU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSA9PSBmcm9tR2xvYmFsU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBTdGF5aW5nIGF0IHRoZSBsZWFkaW5nIHRvbmUgaXMgbm90IGJhZFxuICAgICAgICAgICAgICAgIHRlbnNpb24ubGVhZGluZ1RvbmVVcCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmUgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwICs9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEgfHwgaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhcyBiYWRcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwIC09IDc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxlYWRpbmdUb25lQ291bnQgPSAwO1xuICAgIGZvciAoY29uc3QgdG9HbG9iYWxTZW1pdG9uZSBvZiB0b0dsb2JhbFNlbWl0b25lcykge1xuICAgICAgICBjb25zdCBzY2FsZUluZGV4OiBudW1iZXIgPSBzZW1pdG9uZVNjYWxlSW5kZXhbKHRvR2xvYmFsU2VtaXRvbmUgKyAxMikgJSAxMl07XG4gICAgICAgIGlmIChzY2FsZUluZGV4ID09IDYpIHtcbiAgICAgICAgICAgIGxlYWRpbmdUb25lQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobGVhZGluZ1RvbmVDb3VudCA+IDEpIHtcbiAgICAgICAgdGVuc2lvbi5kb3VibGVMZWFkaW5nVG9uZSArPSAxMDtcbiAgICB9XG5cbiAgICAvLyBkb21pbmFudCA3dGggY2hvcmQgc3R1ZmZcbiAgICBpZiAobmV3Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgIC8vIE5ldmVyIGRvdWJsZSB0aGUgN3RoXG4gICAgICAgIGNvbnN0IHNldmVudGhTZW1pdG9uZSA9IG5ld0Nob3JkLm5vdGVzWzNdLnNlbWl0b25lO1xuICAgICAgICBjb25zdCBzZXZlbnRoQ291bnQgPSB0b1NlbWl0b25lcy5maWx0ZXIoc2VtaXRvbmUgPT4gc2VtaXRvbmUgPT0gc2V2ZW50aFNlbWl0b25lKS5sZW5ndGg7XG4gICAgICAgIGlmIChzZXZlbnRoQ291bnQgPiAxKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLnNldmVudGhUZW5zaW9uICs9IDEwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmVzW2ldICUgMTIgPT0gc2V2ZW50aFNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSkgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDd0aCBpcyBhcHByb2FjaGVkIGJ5IGxlYXAhXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uc2V2ZW50aFRlbnNpb24gKz0gMTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgIGlmICghbmV3Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgICAgICAvLyA3dGggbXVzdCByZXNvbHZlIGRvd25cbiAgICAgICAgICAgIGNvbnN0IHNldmVudGhTZW1pdG9uZSA9IHByZXZDaG9yZC5ub3Rlc1szXS5zZW1pdG9uZTtcbiAgICAgICAgICAgIGNvbnN0IHNldmVudEdUb25lID0gZnJvbUdsb2JhbFNlbWl0b25lcy5maWx0ZXIoZ1RvbmUgPT4gZ1RvbmUgJSAxMiA9PSBzZXZlbnRoU2VtaXRvbmUpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFJlc29sdmVzVG8gPSBbc2V2ZW50R1RvbmUgLSAxLCBzZXZlbnRHVG9uZSAtIDJdO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFJlc29sdmVzVG9Db3VudCA9IHRvR2xvYmFsU2VtaXRvbmVzLmZpbHRlcihnVG9uZSA9PiBzZXZlbnRoUmVzb2x2ZXNUby5pbmNsdWRlcyhnVG9uZSkpLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChzZXZlbnRoUmVzb2x2ZXNUb0NvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNldmVudGhUZW5zaW9uICs9IDExO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZGlyZWN0aW9uc1xuICAgIGNvbnN0IGRpcmVjdGlvbkNvdW50cyA9IHtcbiAgICAgICAgXCJ1cFwiOiAwLFxuICAgICAgICBcImRvd25cIjogMCxcbiAgICAgICAgXCJzYW1lXCI6IDAsXG4gICAgfVxuICAgIGNvbnN0IHBhcnREaXJlY3Rpb24gPSBbXTtcbiAgICBsZXQgcm9vdEJhc3NEaXJlY3Rpb24gPSBudWxsO1xuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRvU2VtaXRvbmUgLSBmcm9tU2VtaXRvbmU7XG4gICAgICAgIHBhcnREaXJlY3Rpb25baV0gPSBkaWZmIDwgMCA/IFwiZG93blwiIDogZGlmZiA+IDAgPyBcInVwXCIgOiBcInNhbWVcIjtcbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMudXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLnNhbWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiAhPSAwICYmIChpbnZlcnNpb25OYW1lIHx8ICcnKS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIHJvb3RCYXNzRGlyZWN0aW9uID0gZGlmZiA+IDAgPyAndXAnIDogJ2Rvd24nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUm9vdCBiYXNzIG1ha2VzIHVwIGZvciBvbmUgdXAvZG93blxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcInVwXCIgJiYgZGlyZWN0aW9uQ291bnRzLmRvd24gPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duIC09IDE7XG4gICAgfVxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcImRvd25cIiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCAtPSAxO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLnVwID4gMiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMztcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbkNvdW50cy5kb3duID4gMiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPCAxKSB7XG4gICAgICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDM7XG4gICAgfVxuICAgIC8vIGlmIChwYXJ0RGlyZWN0aW9uWzBdID09IHBhcnREaXJlY3Rpb25bM10gJiYgcGFydERpcmVjdGlvblswXSAhPSBcInNhbWVcIikge1xuICAgIC8vICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSA1O1xuICAgIC8vICAgICAvLyByb290IGFuZCBzb3ByYW5vcyBtb3ZpbmcgaW4gc2FtZSBkaXJlY3Rpb25cbiAgICAvLyB9XG5cbiAgICAvLyBQYXJhbGxlbCBtb3Rpb24gYW5kIGhpZGRlbiBmaWZ0aHNcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmVzW2ldID09IHRvR2xvYmFsU2VtaXRvbmVzW2ldICYmIGZyb21HbG9iYWxTZW1pdG9uZXNbal0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbal0pIHtcbiAgICAgICAgICAgICAgICAvLyBQYXJ0IGkgYW5kIGogYXJlIHN0YXlpbmcgc2FtZVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsRnJvbSA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8IDIwICYmIGludGVydmFsICUgMTIgPT0gNyB8fCBpbnRlcnZhbCAlIDEyID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBQb3NzaWJseSBhIHBhcmFsbGVsLCBjb250cmFyeSBvciBoaWRkZW4gZmlmdGgvb2N0YXZlXG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IGludGVydmFsRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLnBhcmFsbGVsRmlmdGhzICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHNvcHJhbm8tYmFzcyBpbnRlcnZhbCBpcyBoaWRkZW5cbiAgICAvLyBpLmUuIHBhcnRzIDAgYW5kIDMgYXJlIG1vdmluZyBpbiBzYW1lIGRpcmVjdGlvblxuICAgIC8vIEFuZCBwYXJ0IDAgaXMgbWFraW5nIGEganVtcFxuICAgIC8vIEFuZCB0aGUgcmVzdWx0aW5nIGludGVydmFsIGlzIGEgZmlmdGgvb2N0YXZlXG4gICAgY29uc3QgcGFydDBEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1swXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbMF07XG4gICAgY29uc3QgcGFydDNEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1szXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbM107XG4gICAgaWYgKE1hdGguYWJzKHBhcnQwRGlyZWN0aW9uKSA+IDIpIHtcbiAgICAgICAgLy8gVXBwZXIgcGFydCBpcyBtYWtpbmcgYSBqdW1wXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSkgJSAxMjtcbiAgICAgICAgaWYgKChpbnRlcnZhbCA9PSA3IHx8IGludGVydmFsID09IDApICYmIE1hdGguc2lnbihwYXJ0MERpcmVjdGlvbikgPT0gTWF0aC5zaWduKHBhcnQzRGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgLy8gU2FtZSBkaXJlY3Rpb24gYW5kIHJlc3VsdGluZyBpbnRlcnZhbCBpcyBhIGZpZnRoL29jdGF2ZVxuICAgICAgICAgICAgdGVuc2lvbi5wYXJhbGxlbEZpZnRocyArPSAxMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpPTA7IGk8MzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvSW50ZXJ2YWxXaXRoQmFzcyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pICUgMTI7XG4gICAgICAgIGNvbnN0IGZyb21JbnRlclZhbFdpdGhCYXNzID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbM10pICUgMTI7XG4gICAgICAgIGlmIChmcm9tSW50ZXJWYWxXaXRoQmFzcyA9PSA2KSB7XG4gICAgICAgICAgICBpZiAodG9JbnRlcnZhbFdpdGhCYXNzID09IDcpIHtcbiAgICAgICAgICAgICAgICAvLyBVbmVxdWFsIGZpZnRocyAoZGltaW5pc2hlZCA1dGggdG8gcGVyZmVjdCA1dGgpIHdpdGggYmFzc1xuICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTcGFjaW5nIGVycm9yc1xuICAgIGNvbnN0IHBhcnQwVG9QYXJ0MSA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMV0pO1xuICAgIGNvbnN0IHBhcnQxVG9QYXJ0MiA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzFdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMl0pO1xuICAgIGNvbnN0IHBhcnQyVG9QYXJ0MyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzJdIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pO1xuICAgIGlmIChwYXJ0MVRvUGFydDIgPiAxMiB8fCBwYXJ0MFRvUGFydDEgPiAxMiB8fCBwYXJ0MlRvUGFydDMgPiAoMTIgKyA3KSkge1xuICAgICAgICB0ZW5zaW9uLnNwYWNpbmdFcnJvciArPSA1O1xuICAgIH1cblxuICAgIC8vIE92ZXJsYXBwaW5nIGVycm9yXG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbG93ZXJGcm9tR1RvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2kgKyAxXTtcbiAgICAgICAgY29uc3QgbG93ZXJUb0dUb25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaSArIDFdO1xuICAgICAgICBjb25zdCB1cHBlckZyb21HVG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaSAtIDFdO1xuICAgICAgICBjb25zdCB1cHBlclRvR1RvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKHVwcGVyVG9HVG9uZSB8fCB1cHBlckZyb21HVG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmUgPiBNYXRoLm1pbih1cHBlclRvR1RvbmUgfHwgMCwgdXBwZXJGcm9tR1RvbmUgfHwgMCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlclRvR1RvbmUgfHwgbG93ZXJGcm9tR1RvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lIDwgTWF0aC5tYXgobG93ZXJUb0dUb25lIHx8IDAsIGxvd2VyRnJvbUdUb25lIHx8IDApKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5vdmVybGFwcGluZyArPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lbG9keSB0ZW5zaW9uXG4gICAgLy8gQXZvaWQganVtcHMgdGhhdCBhcmUgYXVnIG9yIDd0aCBvciBoaWdoZXJcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSAxMikge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDAuNTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSA1KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPiA3KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMTApIHsgIC8vIDd0aCA9PSAxMFxuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PSA2IHx8IGludGVydmFsID09IDgpIC8vIHRyaXRvbmUgKGF1ZyA0dGgpIG9yIGF1ZyA1dGhcbiAgICAgICAge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDcpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDkpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHppZyB6YWdnaW5cblxuICAgIC8vIDAgcHJpaW1pXG4gICAgLy8gMSBwaWVuaSBzZWt1bnRpXG4gICAgLy8gMiBzdXVyaSBzZWt1bnRpXG4gICAgLy8gMyBwaWVuaSB0ZXJzc2lcbiAgICAvLyA0IHN1dXJpIHRlcnNzaVxuICAgIC8vIDUga3ZhcnR0aVxuICAgIC8vIDYgdHJpdG9udXNcbiAgICAvLyA3IGt2aW50dGlcbiAgICAvLyA4IHBpZW5pIHNla3N0aVxuICAgIC8vIDkgc3V1cmkgc2Vrc3RpXG4gICAgLy8gMTAgcGllbmkgc2VwdGltaVxuICAgIC8vIDExIHN1dXJpIHNlcHRpbWlcbiAgICAvLyAxMiBva3RhYXZpXG5cbiAgICAvLyBXYXMgdGhlcmUgYSBqdW1wIGJlZm9yZT9cbiAgICBpZiAobGF0ZXN0Tm90ZXMgJiYgbGF0ZXN0Tm90ZXMubGVuZ3RoID09IDQpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lcyA9IGxhdGVzdE5vdGVzLm1hcCgobikgPT4gZ2xvYmFsU2VtaXRvbmUobikpO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyhsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldIC0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gMykge1xuICAgICAgICAgICAgICAgIC8vIFRoZXJlIHdhcyBhIGp1bXAuIFdFIE1VU1QgR08gQkFDSyFcbiAgICAgICAgICAgICAgICAvLyBCYXNpY2FsbHkgdGhlIHRvR2xvYmFsU2VtaXRvbmUgbXVzdCBiZSBiZXR3ZWVuIHRoZSBwcmV2RnJvbUdsb2JhbFNlbWl0b25lIGFuZCB0aGUgZnJvbUdsb2JhbFNlbWl0b25lXG4gICAgICAgICAgICAgICAgLy8gVU5MRVNTIHdlJ3JlIG91dGxpbmluZyBhIHRyaWFkLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd291bGQgbWVhbiB0aGF0IGFmdGVyIGEgNHRoIHVwLCB3ZSBuZWVkIHRvIGdvIHVwIGFub3RoZXIgM3JkXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldkZyb21TZW1pdG9uZSA9IGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbVNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b1NlbWl0b25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uTXVsdGlwbGllciA9IGZyb21TZW1pdG9uZSA+IHByZXZGcm9tU2VtaXRvbmUgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEludGVydmFsID0gZGlyZWN0aW9uTXVsdGlwbGllciAqICh0b1NlbWl0b25lIC0gZnJvbVNlbWl0b25lKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlub3IgM3JkIHVwLCB0aGVuIG1haiB0aGlyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWpvciAzcmQgdXAsIHRoZW4gbWlub3IgM3JkIHVwLiBUaGF0J3MgYSByb290IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIHBlcmZlY3QgNHRoIHVwLiBUaGF0J3MgYSBmaXJzdCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtaW5vciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyZmVjdCA0dGggdXAsIHRoZW4gbWFqb3IgM3JkIHVwLiBUaGF0J3MgYSBzZWNvbmQgaW52ZXJzaW9uIG1ham9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEhpZ2hlciB0aGFuIHRoYXQsIG5vIHRyaWFkIGlzIHBvc3NpYmxlLlxuICAgICAgICAgICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSAoaSA9PSAwIHx8IGkgPT0gMykgPyAwLjIgOiAxO1xuICAgICAgICAgICAgICAgIGlmICgoZnJvbVNlbWl0b25lID49IHByZXZGcm9tU2VtaXRvbmUgJiYgdG9TZW1pdG9uZSA+PSBmcm9tU2VtaXRvbmUpIHx8IChmcm9tU2VtaXRvbmUgPD0gcHJldkZyb21TZW1pdG9uZSAmJiB0b1NlbWl0b25lIDw9IGZyb21TZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IGdvaW5mIGJhY2sgZG93bi91cC4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDAuNSAqIG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPD0gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDIgKiBtdWx0aXBsaWVyOyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDsgIC8vIFRlcnJpYmxlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIGRvd24vdXAuLi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja0ludGVydmFsID0gTWF0aC5hYnModG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYWNrSW50ZXJ2YWwgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIHRvbyBtdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAwLjUgKiBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA8PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDIgKiBtdWx0aXBsaWVyOyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJldlBhc3NlZEZyb21HVG9uZXMgPSBwcmV2UGFzc2VkRnJvbU5vdGVzID8gcHJldlBhc3NlZEZyb21Ob3Rlcy5tYXAoKG4pID0+IGdsb2JhbFNlbWl0b25lKG4pKSA6IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8NDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBnVG9uZXNGb3JUaGlzUGFydCA9IFtdO1xuICAgICAgICAgICAgaWYgKHByZXZQYXNzZWRGcm9tR1RvbmVzW2ldKSB7XG4gICAgICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaChwcmV2UGFzc2VkRnJvbUdUb25lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgaWYgKGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV0gJiYgbGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldKSB7XG4gICAgICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaChsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdUb25lc0ZvclRoaXNQYXJ0LnB1c2godG9HbG9iYWxTZW1pdG9uZXNbaV0pO1xuXG4gICAgICAgICAgICBsZXQgZ2VuZXJhbERpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAvLyBHZXQgZGlyZWN0aW9ucyBiZWZvcmUgbGF0ZXN0IG5vdGVzXG4gICAgICAgICAgICAvLyBFLmcuIGlmIHRoZSBub3RlIHZhbHVlcyBoYXZlIGJlZW4gMCwgMSwgNCwgMFxuICAgICAgICAgICAgLy8gdGhlIGdlbmVyYWxEaXJlY3Rpb24gd291bGQgYmUgMSArIDQgPT0gNSwgd2hpY2ggbWVhbnMgdGhhdCBldmVuIHRob3VnaCB0aGVcbiAgICAgICAgICAgIC8vIGdsb2JhbCBkaXJlY3Rpb24gaXMgXCJzYW1lXCIsIHRoZSBnZW5lcmFsIGRpcmVjdGlvbiBpcyBcInVwXCJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAyOyBqKyspIHtcbiAgICAgICAgICAgICAgICBnZW5lcmFsRGlyZWN0aW9uICs9IGdUb25lc0ZvclRoaXNQYXJ0W2orMV0gLSBnVG9uZXNGb3JUaGlzUGFydFtqXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ2xvYmFsRGlyZWN0aW9uID0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMV0gLSBnVG9uZXNGb3JUaGlzUGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsRGlyZWN0aW9uID0gZ1RvbmVzRm9yVGhpc1BhcnRbZ1RvbmVzRm9yVGhpc1BhcnQubGVuZ3RoIC0gMV0gLSBnVG9uZXNGb3JUaGlzUGFydFtnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAyXTtcblxuICAgICAgICAgICAgaWYgKGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdICE9IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDJdICYmIGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdID09IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDNdKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8gdGhlIHNhbWUgbm90ZSBhcyBiZWZvcmUuIFRoYXQncyBiYWQuXG4gICAgICAgICAgICAgICAgLy8gWmlnIHphZ2dpbmdcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbmFsRGlyZWN0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbWl0b25lTGltaXQgPSBzdGFydGluZ05vdGVzKHBhcmFtcykuc2VtaXRvbmVMaW1pdHNbaV07XG5cbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Tm90ZSA9IHNlbWl0b25lTGltaXRbMV0gLSA0O1xuICAgICAgICAgICAgICAgIHRhcmdldE5vdGUgLT0gaSAqIDI7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldExvd05vdGUgPSBzZW1pdG9uZUxpbWl0WzBdICsgMTA7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TG93Tm90ZSArPSBpICogMjtcblxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXROb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRMb3dOb3RlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uID0gcGFyYW1zLmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGRpdj1iZWF0RGl2aXNpb247IGRpdj5hdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvbjsgZGl2LS0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm90ZXMgPSAoZGl2aXNpb25lZE5vdGVzIHx8IHt9KVtkaXZdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByZXZOb3RlIG9mIG5vdGVzLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTZW1pdG9uZShwcmV2Tm90ZS5ub3RlKSA+PSB0YXJnZXROb3RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm90ZVJlYWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbFNlbWl0b25lKHByZXZOb3RlLm5vdGUpIDw9IHRhcmdldExvd05vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMb3dOb3RlUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Tm90ZVJlYWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJUYXJnZXQgbm90ZSByZWFjaGVkIFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0YXJnZXROb3RlKSA8PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRGlyZWN0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRhcmdldE5vdGUpIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGNsb3NlIHRvIHRoZSB0YXJnZXQgbm90ZSwgbGV0J3MgTk9UIGEgbG90IHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2VuZXJhbERpcmVjdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gZ2VuZXJhbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERpcmVjdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSBmaW5hbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxEaXJlY3Rpb24gPD0gMCAmJiBmaW5hbERpcmVjdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBnb2luIGRvd24sIG5vdCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAtMSAqIGdsb2JhbERpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRMb3dOb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIlRhcmdldCBsb3cgbm90ZSByZWFjaGVkIFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbaV0gLSB0YXJnZXRMb3dOb3RlKSA8PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjbG9zZSB0byB0aGUgdGFyZ2V0IG5vdGUsIGxldCdzIE5PVCBnbyBkb3duXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdGFyZ2V0TG93Tm90ZSkgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY2xvc2UgdG8gdGhlIHRhcmdldCBub3RlLCBsZXQncyBOT1QgYSBsb3QgZG93blxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdlbmVyYWxEaXJlY3Rpb24gPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IC0xICogZ2VuZXJhbERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAtMSAqIGZpbmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA+PSAwICYmIGZpbmFsRGlyZWN0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXROb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW4gdXAsIG5vdCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gZ2xvYmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW5zaW9uO1xufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUsIFNlbWl0b25lIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBUZW5zaW9uIH0gZnJvbSBcIi4vdGVuc2lvblwiO1xuXG5leHBvcnQgY29uc3QgQkVBVF9MRU5HVEggPSAxMjtcblxudHlwZSBQaWNrTnVsbGFibGU8VD4gPSB7XG4gICAgW1AgaW4ga2V5b2YgVCBhcyBudWxsIGV4dGVuZHMgVFtQXSA/IFAgOiBuZXZlcl06IFRbUF1cbn1cblxudHlwZSBQaWNrTm90TnVsbGFibGU8VD4gPSB7XG4gICAgW1AgaW4ga2V5b2YgVCBhcyBudWxsIGV4dGVuZHMgVFtQXSA/IG5ldmVyIDogUF06IFRbUF1cbn1cblxuZXhwb3J0IHR5cGUgT3B0aW9uYWxOdWxsYWJsZTxUPiA9IHtcbiAgICBbSyBpbiBrZXlvZiBQaWNrTnVsbGFibGU8VD5dPzogRXhjbHVkZTxUW0tdLCBudWxsPlxufSAmIHtcbiAgICAgICAgW0sgaW4ga2V5b2YgUGlja05vdE51bGxhYmxlPFQ+XTogVFtLXVxuICAgIH1cblxuXG5leHBvcnQgY29uc3Qgc2VtaXRvbmVEaXN0YW5jZSA9ICh0b25lMTogbnVtYmVyLCB0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gZGlzdGFuY2UgZnJvbSAwIHRvIDExIHNob3VsZCBiZSAxXG4gICAgLy8gMCAtIDExICsgMTIgPT4gMVxuICAgIC8vIDExIC0gMCArIDEyID0+IDIzID0+IDExXG5cbiAgICAvLyAwIC0gNiArIDEyID0+IDZcbiAgICAvLyA2IC0gMCArIDEyID0+IDE4ID0+IDZcblxuICAgIC8vIDAgKyA2IC0gMyArIDYgPSA2IC0gOSA9IC0zXG4gICAgLy8gNiArIDYgLSA5ICsgNiA9IDEyIC0gMTUgPSAwIC0gMyA9IC0zXG4gICAgLy8gMTEgKyA2IC0gMCArIDYgPSAxNyAtIDYgPSA1IC0gNiA9IC0xXG4gICAgLy8gMCArIDYgLSAxMSArIDYgPSA2IC0gMTcgPSA2IC0gNSA9IDFcblxuICAgIC8vICg2ICsgNikgJSAxMiA9IDBcbiAgICAvLyAoNSArIDYpICUgMTIgPSAxMVxuICAgIC8vIFJlc3VsdCA9IDExISEhIVxuXG4gICAgcmV0dXJuIE1hdGgubWluKFxuICAgICAgICBNYXRoLmFicyh0b25lMSAtIHRvbmUyKSxcbiAgICAgICAgTWF0aC5hYnMoKHRvbmUxICsgNikgJSAxMiAtICh0b25lMiArIDYpICUgMTIpXG4gICAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleCA9IChzY2FsZTogU2NhbGUpOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0+ICh7XG4gICAgW3NjYWxlLm5vdGVzWzBdLnNlbWl0b25lXTogMCxcbiAgICBbc2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLFxuICAgIFtzY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsXG4gICAgW3NjYWxlLm5vdGVzWzNdLnNlbWl0b25lXTogMyxcbiAgICBbc2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LFxuICAgIFtzY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsXG4gICAgW3NjYWxlLm5vdGVzWzZdLnNlbWl0b25lXTogNixcbn0pXG5cblxuZXhwb3J0IGNvbnN0IG5leHRHVG9uZUluU2NhbGUgPSAoZ1RvbmU6IFNlbWl0b25lLCBpbmRleERpZmY6IG51bWJlciwgc2NhbGU6IFNjYWxlKTogTnVsbGFibGU8bnVtYmVyPiA9PiB7XG4gICAgbGV0IGdUb25lMSA9IGdUb25lO1xuICAgIGNvbnN0IHNjYWxlSW5kZXhlcyA9IHNlbWl0b25lU2NhbGVJbmRleChzY2FsZSlcbiAgICBsZXQgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIGdUb25lMSA9IGdUb25lICsgMTtcbiAgICAgICAgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgfVxuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICBnVG9uZTEgPSBnVG9uZSAtIDE7XG4gICAgICAgIHNjYWxlSW5kZXggPSBzY2FsZUluZGV4ZXNbZ1RvbmUxICUgMTJdO1xuICAgIH1cbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5ld1NjYWxlSW5kZXggPSAoc2NhbGVJbmRleCArIGluZGV4RGlmZikgJSA3O1xuICAgIGNvbnN0IG5ld1NlbWl0b25lID0gc2NhbGUubm90ZXNbbmV3U2NhbGVJbmRleF0uc2VtaXRvbmU7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBzZW1pdG9uZURpc3RhbmNlKGdUb25lMSAlIDEyLCBuZXdTZW1pdG9uZSk7XG4gICAgY29uc3QgbmV3R3RvbmUgPSBnVG9uZTEgKyAoZGlzdGFuY2UgKiAoaW5kZXhEaWZmID4gMCA/IDEgOiAtMSkpO1xuXG4gICAgcmV0dXJuIG5ld0d0b25lO1xufVxuXG5cbmV4cG9ydCBjb25zdCBzdGFydGluZ05vdGVzID0gKHBhcmFtczogTXVzaWNQYXJhbXMpID0+IHtcbiAgICBjb25zdCBwMU5vdGUgPSBwYXJhbXMucGFydHNbMF0ubm90ZSB8fCBcIkY0XCI7XG4gICAgY29uc3QgcDJOb3RlID0gcGFyYW1zLnBhcnRzWzFdLm5vdGUgfHwgXCJDNFwiO1xuICAgIGNvbnN0IHAzTm90ZSA9IHBhcmFtcy5wYXJ0c1syXS5ub3RlIHx8IFwiQTNcIjtcbiAgICBjb25zdCBwNE5vdGUgPSBwYXJhbXMucGFydHNbM10ubm90ZSB8fCBcIkMzXCI7XG5cbiAgICBjb25zdCBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyA9IFtcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDFOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAyTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwM05vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDROb3RlKSksXG4gICAgXVxuXG4gICAgY29uc3Qgc2VtaXRvbmVMaW1pdHMgPSBbXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1swXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMF0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzFdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1syXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbM10gKyAxMiAtIDVdLFxuICAgIF1cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydGluZ0dsb2JhbFNlbWl0b25lcyxcbiAgICAgICAgc2VtaXRvbmVMaW1pdHMsXG4gICAgfVxufVxuXG5cbmNvbnN0IG15U2VtaXRvbmVTdHJpbmdzOiB7W2tleTogbnVtYmVyXTogc3RyaW5nfSA9IHtcbiAgICAwOiBcIkNcIixcbiAgICAxOiBcIkMjXCIsXG4gICAgMjogXCJEXCIsXG4gICAgMzogXCJEI1wiLFxuICAgIDQ6IFwiRVwiLFxuICAgIDU6IFwiRlwiLFxuICAgIDY6IFwiRiNcIixcbiAgICA3OiBcIkdcIixcbiAgICA4OiBcIkcjXCIsXG4gICAgOTogXCJBXCIsXG4gICAgMTA6IFwiQSNcIixcbiAgICAxMTogXCJCXCIsXG59XG5cblxuZXhwb3J0IGNvbnN0IGdUb25lU3RyaW5nID0gKGdUb25lOiBudW1iZXIgfCBudWxsKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICB9XG4gICAgcmV0dXJuIGAke215U2VtaXRvbmVTdHJpbmdzW2dUb25lICUgMTJdfSR7TWF0aC5mbG9vcihnVG9uZSAvIDEyKX1gO1xufVxuXG5cbmV4cG9ydCBjb25zdCBhcnJheU9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXk6IEFycmF5PGFueT4sIHNlbGVjdG9yOiBDYWxsYWJsZUZ1bmN0aW9uLCBkZXNjID0gZmFsc2UpIHtcbiAgICByZXR1cm4gWy4uLmFycmF5XS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSBzZWxlY3RvcihhKTtcbiAgICAgICAgYiA9IHNlbGVjdG9yKGIpO1xuXG4gICAgICAgIGlmIChhID09IGIpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gKGRlc2MgPyBhID4gYiA6IGEgPCBiKSA/IC0xIDogMTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgY29uc3QgY2hvcmRUZW1wbGF0ZXM6IHsgW2tleTogc3RyaW5nXTogQXJyYXk8bnVtYmVyPiB9ID0ge1xuICAgIG1hajogWzAsIDQsIDddLFxuICAgIG1pbjogWzAsIDMsIDddLFxuICAgIGRpbTogWzAsIDMsIDZdLFxuICAgIGRpbTc6IFswLCAzLCA2LCAxMF0sXG4gICAgYXVnOiBbMCwgNCwgOF0sXG4gICAgbWFqNzogWzAsIDQsIDcsIDExXSxcbiAgICBtaW43OiBbMCwgMywgNywgMTBdLFxuICAgIGRvbTc6IFswLCA0LCA3LCAxMF0sXG4gICAgc3VzMjogWzAsIDIsIDddLFxuICAgIHN1czQ6IFswLCA1LCA3XSxcbn1cblxuXG5leHBvcnQgY2xhc3MgQ2hvcmQge1xuICAgIHB1YmxpYyBub3RlczogQXJyYXk8Tm90ZT47XG4gICAgcHVibGljIHJvb3Q6IG51bWJlcjtcbiAgICBwdWJsaWMgY2hvcmRUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICAvLyBGaW5kIGNvcnJlY3QgU2VtaXRvbmUga2V5XG4gICAgICAgIGNvbnN0IHNlbWl0b25lS2V5cyA9IE9iamVjdC5rZXlzKFNlbWl0b25lKS5maWx0ZXIoa2V5ID0+IChTZW1pdG9uZSBhcyBhbnkpW2tleV0gYXMgbnVtYmVyID09PSB0aGlzLm5vdGVzWzBdLnNlbWl0b25lKTtcbiAgICAgICAgaWYgKHNlbWl0b25lS2V5cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm90ZXMubWFwKG5vdGUgPT4gbm90ZS50b1N0cmluZygpKS5qb2luKFwiLCBcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbWl0b25lS2V5ID0gc2VtaXRvbmVLZXlzLmZpbHRlcihrZXkgPT4ga2V5LmluZGV4T2YoJ2InKSA9PSAtMSAmJiBrZXkuaW5kZXhPZigncycpID09IC0xKVswXSB8fCBzZW1pdG9uZUtleXNbMF07XG4gICAgICAgIHNlbWl0b25lS2V5ID0gc2VtaXRvbmVLZXkucmVwbGFjZSgncycsICcjJyk7XG4gICAgICAgIHJldHVybiBzZW1pdG9uZUtleSArIHRoaXMuY2hvcmRUeXBlO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihzZW1pdG9uZU9yTmFtZTogbnVtYmVyIHwgc3RyaW5nLCBjaG9yZFR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgc2VtaXRvbmU7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VtaXRvbmVPck5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHNlbWl0b25lID0gc2VtaXRvbmVPck5hbWUubWF0Y2goL15cXGQrLyk7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gc2VtaXRvbmVPck5hbWUubWF0Y2goL15cXGQrKC4qKS8pO1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkludmFsaWQgY2hvcmQgbmFtZSBcIiArIHNlbWl0b25lT3JOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnNlZFR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBjaG9yZCBuYW1lIFwiICsgc2VtaXRvbmVPck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHBhcnNlSW50KHNlbWl0b25lWzBdKTtcbiAgICAgICAgICAgIGNob3JkVHlwZSA9IGNob3JkVHlwZSB8fCBwYXJzZWRUeXBlWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VtaXRvbmUgPSBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QgPSBwYXJzZUludChgJHtzZW1pdG9uZX1gKTtcbiAgICAgICAgdGhpcy5jaG9yZFR5cGUgPSBjaG9yZFR5cGUgfHwgXCI/XCI7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gY2hvcmRUZW1wbGF0ZXNbdGhpcy5jaG9yZFR5cGVdO1xuICAgICAgICBpZiAodGVtcGxhdGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVua25vd24gY2hvcmQgdHlwZTogXCIgKyBjaG9yZFR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBub3RlIG9mIHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGVzLnB1c2gobmV3IE5vdGUoeyBzZW1pdG9uZTogKHNlbWl0b25lICsgbm90ZSkgJSAxMiwgb2N0YXZlOiAxIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgdHlwZSBOdWxsYWJsZTxUPiA9IFQgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBNdXNpY1Jlc3VsdCA9IHtcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxuICAgIHNjYWxlOiBTY2FsZSxcbn1cblxuZXhwb3J0IHR5cGUgUmljaE5vdGUgPSB7XG4gICAgbm90ZTogTm90ZSxcbiAgICBvcmlnaW5hbE5vdGU/OiBOb3RlLFxuICAgIGR1cmF0aW9uOiBudW1iZXIsXG4gICAgZnJlcT86IG51bWJlcixcbiAgICBjaG9yZDogQ2hvcmQsXG4gICAgcGFydEluZGV4OiBudW1iZXIsXG4gICAgc2NhbGU6IFNjYWxlLFxuICAgIG9yaWdpbmFsU2NhbGU6IFNjYWxlLFxuICAgIGJlYW0/OiBzdHJpbmcsXG4gICAgdGllPzogc3RyaW5nLFxuICAgIHRlbnNpb246IFRlbnNpb24sXG4gICAgaW52ZXJzaW9uTmFtZT86IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgRGl2aXNpb25lZFJpY2hub3RlcyA9IHtcbiAgICBba2V5OiBudW1iZXJdOiBBcnJheTxSaWNoTm90ZT4sXG59XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxTZW1pdG9uZSA9IChub3RlOiBOb3RlKSA9PiB7XG4gICAgcmV0dXJuIG5vdGUuc2VtaXRvbmUgKyAoKG5vdGUub2N0YXZlKSAqIDEyKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldENsb3Nlc3RPY3RhdmUgPSAobm90ZTogTm90ZSwgdGFyZ2V0Tm90ZTogTnVsbGFibGU8Tm90ZT4gPSBudWxsLCB0YXJnZXRTZW1pdG9uZTogTnVsbGFibGU8bnVtYmVyPiA9IG51bGwpID0+IHtcbiAgICBsZXQgc2VtaXRvbmUgPSBnbG9iYWxTZW1pdG9uZShub3RlKTtcbiAgICBpZiAoIXRhcmdldE5vdGUgJiYgIXRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRhcmdldCBub3RlIG9yIHNlbWl0b25lIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0YXJnZXRTZW1pdG9uZSA9IHRhcmdldFNlbWl0b25lIHx8IGdsb2JhbFNlbWl0b25lKHRhcmdldE5vdGUgYXMgTm90ZSk7XG4gICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZTogXCIsIHNlbWl0b25lLCB0YXJnZXRTZW1pdG9uZSk7XG4gICAgLy8gVXNpbmcgbW9kdWxvIGhlcmUgLT4gLTcgJSAxMiA9IC03XG4gICAgLy8gLTEzICUgMTIgPSAtMVxuICAgIGlmIChzZW1pdG9uZSA9PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICByZXR1cm4gbm90ZS5vY3RhdmU7XG4gICAgfVxuICAgIGNvbnN0IGRlbHRhOiBudW1iZXIgPSB0YXJnZXRTZW1pdG9uZSA+IHNlbWl0b25lID8gMTIgOiAtMTI7XG4gICAgbGV0IHJldCA9IDA7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGNsZWFuT2N0YXZlID0gKG9jdGF2ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChvY3RhdmUsIDIpLCA2KTtcbiAgICB9XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZmluaXRlIGxvb3BcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VtaXRvbmUgKz0gZGVsdGE7XG4gICAgICAgIHJldCArPSBkZWx0YSAvIDEyOyAgLy8gSG93IG1hbnkgb2N0YXZlcyB3ZSBjaGFuZ2VkXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA+PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lIC0gMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW1pdG9uZSA8PSB0YXJnZXRTZW1pdG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzZW1pdG9uZSAtIHRhcmdldFNlbWl0b25lKSA+IE1hdGguYWJzKHNlbWl0b25lICsgMTIgLSB0YXJnZXRTZW1pdG9uZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2VudCB0b28gZmFyLCBnbyBvbmUgYmFja1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zZXN0IG9jdGF2ZSByZXM6IFwiLCBjbGVhbk9jdGF2ZShub3RlLm9jdGF2ZSArIHJldCksIHJldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlQ2lyY2xlOiB7IFtrZXk6IG51bWJlcl06IEFycmF5PG51bWJlcj4gfSA9IHt9XG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DXSA9IFtTZW1pdG9uZS5HLCBTZW1pdG9uZS5GXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR10gPSBbU2VtaXRvbmUuRCwgU2VtaXRvbmUuQ11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkRdID0gW1NlbWl0b25lLkEsIFNlbWl0b25lLkddXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BXSA9IFtTZW1pdG9uZS5FLCBTZW1pdG9uZS5EXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRV0gPSBbU2VtaXRvbmUuQiwgU2VtaXRvbmUuQV1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJdID0gW1NlbWl0b25lLkZzLCBTZW1pdG9uZS5FXVxuXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5GXSA9IFtTZW1pdG9uZS5DLCBTZW1pdG9uZS5CYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkJiXSA9IFtTZW1pdG9uZS5GLCBTZW1pdG9uZS5FYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkViXSA9IFtTZW1pdG9uZS5CYiwgU2VtaXRvbmUuQWJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5BYl0gPSBbU2VtaXRvbmUuRWIsIFNlbWl0b25lLkRiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRGJdID0gW1NlbWl0b25lLkFiLCBTZW1pdG9uZS5HYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkdiXSA9IFtTZW1pdG9uZS5EYiwgU2VtaXRvbmUuQ2JdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5DYl0gPSBbU2VtaXRvbmUuR2IsIFNlbWl0b25lLkZiXVxuXG5cbmV4cG9ydCBjb25zdCBtYWpTY2FsZURpZmZlcmVuY2UgPSAoc2VtaXRvbmUxOiBudW1iZXIsIHNlbWl0b25lMjogbnVtYmVyKSA9PiB7XG4gICAgLy8gR2l2ZW4gdHdvIG1ham9yIHNjYWxlcywgcmV0dXJuIGhvdyBjbG9zZWx5IHJlbGF0ZWQgdGhleSBhcmVcbiAgICAvLyAwID0gc2FtZSBzY2FsZVxuICAgIC8vIDEgPSBFLkcuIEMgYW5kIEYgb3IgQyBhbmQgR1xuICAgIGxldCBjdXJyZW50VmFsID0gbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmUxXTtcbiAgICBpZiAoc2VtaXRvbmUxID09IHNlbWl0b25lMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50VmFsLmluY2x1ZGVzKHNlbWl0b25lMikpIHtcbiAgICAgICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdDdXJyZW50VmFsID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbWl0b25lIG9mIGN1cnJlbnRWYWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3U2VtaXRvbmUgb2YgbWFqU2NhbGVDaXJjbGVbc2VtaXRvbmVdKSB7XG4gICAgICAgICAgICAgICAgbmV3Q3VycmVudFZhbC5hZGQobmV3U2VtaXRvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRWYWwgPSBbLi4ubmV3Q3VycmVudFZhbF0gYXMgQXJyYXk8bnVtYmVyPjtcbiAgICB9XG4gICAgcmV0dXJuIDEyO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0UmljaE5vdGUgPSAoZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLCBkaXZpc2lvbjogbnVtYmVyLCBwYXJ0SW5kZXg6IG51bWJlcik6IFJpY2hOb3RlIHwgbnVsbCA9PiB7XG4gICAgaWYgKGRpdmlzaW9uIGluIGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXSkge1xuICAgICAgICAgICAgaWYgKG5vdGUucGFydEluZGV4ID09IHBhcnRJbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSB7XG4gICAgY29uc3QgbWVsb2R5Umh5dGhtU3RyaW5nID0gbWFpblBhcmFtcy5tZWxvZHlSaHl0aG07XG4gICAgLy8gRmlndXJlIG91dCB3aGF0IG5lZWRzIHRvIGhhcHBlbiBlYWNoIGJlYXQgdG8gZ2V0IG91ciBtZWxvZHlcbiAgICBsZXQgcmh5dGhtRGl2aXNpb24gPSAwO1xuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9uczogeyBba2V5OiBudW1iZXJdOiBudW1iZXI7IH0gPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lbG9keVJoeXRobVN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByaHl0aG0gPSBtZWxvZHlSaHl0aG1TdHJpbmdbaV07XG4gICAgICAgIGlmIChyaHl0aG0gPT0gXCJXXCIpIHtcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAqIDQ7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAqIDQ7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiSFwiKSB7XG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggKiAyO1xuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIlFcIikge1xuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gTm90aGluZyB0byBkb1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIkVcIikge1xuICAgICAgICAgICAgLy8gVGhpcyBkaXZpc2lvbiBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gRWlnaHRoXG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggLyAyO1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKHJoeXRobSA9PSBcIlNcIikge1xuICAgICAgICAgICAgLy8gVGhpcyBkaXZpc2lvbiBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gU2l4dGVlbnRoXG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEggLyA0O1xuICAgICAgICAgICAgcmh5dGhtRGl2aXNpb24gKz0gQkVBVF9MRU5HVEggLyA0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByaHl0aG1OZWVkZWREdXJhdGlvbnM7XG59XG5cblxuZXhwb3J0IHR5cGUgTWVsb2R5TmVlZGVkVG9uZSA9IHtcbiAgICBba2V5OiBudW1iZXJdOiB7XG4gICAgICAgIHRvbmU6IG51bWJlcixcbiAgICAgICAgZHVyYXRpb246IG51bWJlcixcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVsb2R5TmVlZGVkVG9uZXMobWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKTogTWVsb2R5TmVlZGVkVG9uZSB7XG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zID0gZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zKG1haW5QYXJhbXMpO1xuICAgIGNvbnN0IGZvcmNlZE1lbG9keUFycmF5ID0gbWFpblBhcmFtcy5mb3JjZWRNZWxvZHkgfHwgXCJcIjtcbiAgICBjb25zdCByZXQ6IE1lbG9keU5lZWRlZFRvbmUgPSB7fTtcbiAgICAvLyBGaWd1cmUgb3V0IHdoYXQgbmVlZHMgdG8gaGFwcGVuIGVhY2ggYmVhdCB0byBnZXQgb3VyIG1lbG9keVxuICAgIGxldCBjb3VudGVyID0gLTE7XG4gICAgZm9yIChjb25zdCBkaXZpc2lvbiBpbiByaHl0aG1OZWVkZWREdXJhdGlvbnMpIHtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgICBjb25zdCBkaXZpc2lvbk51bSA9IHBhcnNlSW50KGRpdmlzaW9uKTtcbiAgICAgICAgcmV0W2RpdmlzaW9uTnVtXSA9IHtcbiAgICAgICAgICAgIFwiZHVyYXRpb25cIjogcmh5dGhtTmVlZGVkRHVyYXRpb25zW2RpdmlzaW9uTnVtXSxcbiAgICAgICAgICAgIFwidG9uZVwiOiBmb3JjZWRNZWxvZHlBcnJheVtjb3VudGVyXSxcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbWFrZU11c2ljLCBidWlsZFRhYmxlcywgbWFrZU1lbG9keSB9IGZyb20gXCIuL3NyYy9jaG9yZHNcIlxuaW1wb3J0IHsgTWFpbk11c2ljUGFyYW1zIH0gZnJvbSBcIi4vc3JjL3BhcmFtc1wiO1xuaW1wb3J0IHsgQkVBVF9MRU5HVEgsIERpdmlzaW9uZWRSaWNobm90ZXMgfSBmcm9tIFwiLi9zcmMvdXRpbHNcIjtcblxuYnVpbGRUYWJsZXMoKVxuXG5zZWxmLm9ubWVzc2FnZSA9IChldmVudDogeyBkYXRhOiB7IHBhcmFtczogc3RyaW5nLCBuZXdNZWxvZHk6IHVuZGVmaW5lZCB8IGJvb2xlYW4sIGdpdmVVcDogdW5kZWZpbmVkIHwgYm9vbGVhbiB9IH0pID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCBtZXNzYWdlXCIsIGV2ZW50LmRhdGEpO1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBNYWluTXVzaWNQYXJhbXMoSlNPTi5wYXJzZShldmVudC5kYXRhLnBhcmFtcyB8fCBcInt9XCIpKTtcblxuICAgIGlmIChldmVudC5kYXRhLm5ld01lbG9keSkge1xuICAgICAgICBtYWtlTWVsb2R5KChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzKSl9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5kYXRhLmdpdmVVcCkge1xuICAgICAgICAoc2VsZiBhcyBhbnkpLmdpdmVVUCA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSAoY3VycmVudEJlYXQ6IG51bWJlciwgZGl2aXNpb25lZFJpY2hOb3RlczogRGl2aXNpb25lZFJpY2hub3RlcykgPT4ge1xuICAgICAgICBpZiAoKHNlbGYgYXMgYW55KS5naXZlVVApIHtcbiAgICAgICAgICAgIHJldHVybiBcImdpdmVVUFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGl2aXNpb25lZFJpY2hOb3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJpY2hOb3RlcyA9IGRpdmlzaW9uZWRSaWNoTm90ZXNbY3VycmVudEJlYXQgKiBCRUFUX0xFTkdUSF07XG4gICAgICAgIGlmIChjdXJyZW50QmVhdCAhPSBudWxsICYmIHJpY2hOb3RlcyAmJiByaWNoTm90ZXNbMF0gJiYgcmljaE5vdGVzWzBdLmNob3JkKSB7XG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmVhdCxcbiAgICAgICAgICAgICAgICAgICAgY2hvcmQ6IHJpY2hOb3Rlc1swXS5jaG9yZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkaXZpc2lvbmVkUmljaE5vdGVzKSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1ha2VNdXNpYyhwYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2spLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBjb25zdCBkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMgPSByZXN1bHQuZGl2aXNpb25lZE5vdGVzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGl2aXNpb25lZE5vdGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAoc2VsZiBhcyBhbnkpLmRpdmlzaW9uZWROb3RlcyA9IGRpdmlzaW9uZWROb3RlcztcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZGl2aXNpb25lZFJpY2hOb3RlczogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkaXZpc2lvbmVkTm90ZXMpKX0pO1xuXG5cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7ZXJyb3I6IGVycn0pO1xuICAgIH0pO1xuXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9