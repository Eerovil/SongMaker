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
            tension.chordProgression += 5; // Try to avoid I64
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
                    tensionResult.inversionTension = inversionResult.rating;
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
            dim7: {
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
        this.seventhTension = 0;
        this.inversionTension = 0;
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
        tension += this.seventhTension;
        tension += this.inversionTension;
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
    // dominant 7th chord stuff
    if (newChord === null || newChord === void 0 ? void 0 : newChord.chordType.includes('7')) {
        // Never double the 7th
        const seventhSemitone = newChord.notes[3].semitone;
        const seventhCount = toSemitones.filter(semitone => semitone == seventhSemitone).length;
        if (seventhCount > 1) {
            tension.seventhTension += 10;
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
        for (let i = 0; i < 4; i++) {
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
                        if (generalDirection >= 0) {
                            tension.melodyTarget += generalDirection;
                        }
                    }
                }
                else {
                    if (globalDirection <= 0 && finalDirection <= 0) {
                        // We're goin down, not good
                        tension.melodyTarget += -1 * globalDirection;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsU0FBUztBQUM1RTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsY0FBYyxnQkFBZ0I7QUFDOUIsY0FBYyxrQkFBa0Isc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQixFQUFFLGFBQWEsR0FBRyxXQUFXO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsVUFBVSxHQUFHLGFBQWEsR0FBRywrQkFBK0I7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQ0FBZ0M7QUFDbkUsMENBQTBDLHVCQUF1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGlDQUFpQyxNQUFNLEdBQUcsUUFBUSxHQUFHLHlCQUF5QjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0M7QUFDQSx1Q0FBdUM7QUFDdkMsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0M7QUFDQSxzQ0FBc0M7QUFDdEMsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix1QkFBdUIsRUFBRSxhQUFhO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrREFBa0QsYUFBYTs7QUFFL0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JxRzBEO0FBR0Q7QUFVMUQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBbUIsRUFBVyxFQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFjO0lBQ3BDLHVCQUF1QjtJQUN2QixLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDbEIsS0FBSyxJQUFJLFFBQVEsR0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxnREFBSyxDQUFDLEVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUseURBQWMsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDO2dCQUM3RSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUNsQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO29CQUNQLEdBQUcsRUFBRSxRQUFRO29CQUNiLFlBQVksRUFBRSxTQUFTO29CQUN2QixTQUFTLEVBQUUsU0FBUztpQkFDVCxDQUFDO2FBQ25CO1NBQ0o7S0FDSjtJQUNELEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRO1FBQzlCLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDdkI7U0FDSjtLQUNKO0lBRUQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFDeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLGdEQUFLLENBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUseURBQWMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ3RGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBR00sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BTWxDLEVBR0UsRUFBRTtJQUNELE1BQU0sRUFBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDbEYsc0VBQXNFO0lBQ3RFLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7SUFFbEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxNQUFNLEtBQUssSUFBSSxzQkFBc0IsRUFBRTtRQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ0wsS0FBSztZQUNMLE9BQU8sRUFBRSxDQUFDO1NBQ2IsQ0FBQztLQUNMO0lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxzQkFBc0IsQ0FBQztJQUU1RCwrREFBK0Q7SUFDL0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QixNQUFNLFFBQVEsR0FBRyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsK0NBQVcsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDaEMsU0FBUztTQUNaO1FBQ0QsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMxRSxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUNyRCxLQUFLLE1BQU0sY0FBYyxJQUFJLEdBQUcsRUFBRTtZQUM5QixNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEYsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsMkNBQTJDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ1IsY0FBYyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsOEJBQThCO2lCQUMvRDtxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsY0FBYyxDQUFDLE9BQU8sSUFBSSxFQUFFO2lCQUMvQjtxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsY0FBYyxDQUFDLE9BQU8sSUFBSSxDQUFDO2lCQUM5QjtxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsY0FBYyxDQUFDLE9BQU8sSUFBSSxDQUFDO2lCQUM5QjtnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLGdDQUFnQyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2FBQzFIO1NBQ0o7S0FDSjtJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDO0lBRXJDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDakQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyRzhJO0FBR3hJLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLE1BQXFCLEVBQVEsRUFBRTtJQUNqRixNQUFNLEVBQ0YsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixPQUFPLEVBQ1AsUUFBUSxFQUNSLFlBQVksRUFDWiw0QkFBNEIsRUFDNUIseUJBQXlCLEVBQ3pCLGFBQWEsRUFDYixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFVBQVUsRUFDVixZQUFZLEdBQ2YsR0FBRyxNQUFNLENBQUM7SUFDZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BcUJFO0lBQ0YsTUFBTSxrQkFBa0IsR0FBa0Q7UUFDdEUsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUc7UUFDakIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDO1FBQ3JCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUN4QixDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFvQixrQkFBa0I7S0FDL0M7SUFDRCxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDMUIsSUFBSSwwQkFBMEIsR0FBRyxLQUFLLENBQUM7SUFDdkMsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFFN0IsSUFBSSw0QkFBNEIsSUFBSSxhQUFhLEVBQUU7UUFDL0MsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLEtBQUssRUFBRTtZQUNqQyxJQUFJLDRCQUE0QixJQUFJLENBQUMsRUFBRTtnQkFDbkMsY0FBYyxHQUFHLGNBQWMsQ0FBQzthQUNuQztZQUNELElBQUksNEJBQTRCLElBQUksQ0FBQyxFQUFFO2dCQUNuQyxjQUFjLEdBQUcsVUFBVSxDQUFDO2dCQUM1QiwwQkFBMEIsR0FBRyxJQUFJLENBQUM7YUFDckM7WUFDRCxJQUFJLDRCQUE0QixHQUFHLENBQUMsRUFBRTtnQkFDbEMsY0FBYyxHQUFHLE9BQU8sQ0FBQztnQkFDekIsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2FBQzNCO1lBQ0QsSUFBSSw0QkFBNEIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4RSxPQUFPLENBQUMsT0FBTyxJQUFJLG1DQUFtQyxDQUFDO2dCQUN2RCxPQUFPLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQzthQUMxQjtTQUNKO2FBQU0sSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLEtBQUssRUFBRTtZQUN4QyxJQUFJLDRCQUE0QixJQUFJLENBQUMsRUFBRTtnQkFDbkMsY0FBYyxHQUFHLGNBQWMsQ0FBQzthQUNuQztZQUNELElBQUksNEJBQTRCLElBQUksQ0FBQyxFQUFFO2dCQUNuQyxjQUFjLEdBQUcsVUFBVSxDQUFDO2FBQy9CO1lBQ0QsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xDLGNBQWMsR0FBRyxPQUFPLENBQUM7YUFDNUI7WUFDRCxJQUFJLDRCQUE0QixJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN2RSxxQkFBcUI7Z0JBQ3JCLE9BQU8sQ0FBQyxPQUFPLElBQUksK0JBQStCLENBQUM7Z0JBQ25ELE9BQU8sQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO2FBQzFCO1NBQ0o7YUFBTSxJQUFJLE1BQU0sQ0FBQyxlQUFlLElBQUksSUFBSSxFQUFFO1lBQ3ZDLElBQUksNEJBQTRCLElBQUksQ0FBQyxFQUFFO2dCQUNuQyxjQUFjLEdBQUcsY0FBYyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xDLGNBQWMsR0FBRyxVQUFVLENBQUM7YUFDL0I7U0FDSjtLQUNKO0lBRUQsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJLGFBQWEsQ0FBQztJQUNsQixJQUFJLGVBQWUsR0FBVyxFQUFFLENBQUM7SUFDakMsSUFBSSxtQkFBbUIsR0FBVyxFQUFFLENBQUM7SUFDckMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO0lBQzdCLElBQUksZUFBZSxFQUFFO1FBQ2pCLE1BQU0sY0FBYyxHQUFHLFlBQVksR0FBRywrQ0FBVyxDQUFDO1FBQ2xELElBQUksR0FBRyxHQUFpQixFQUFFLENBQUM7UUFDM0IsS0FBSyxNQUFNLFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUM1RCxtRUFBbUU7WUFDbkUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDakUsU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDOUI7UUFDRCxlQUFlLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsS0FBSyxNQUFNLFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsK0NBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQzFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ2pFLGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1NBQ2xDO1FBQ0QsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQyxLQUFLLElBQUksQ0FBQyxHQUFDLFlBQVksRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLEtBQUssTUFBTSxRQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7Z0JBQy9DLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDakMsU0FBUztpQkFDWjtnQkFDRCxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQzthQUM1RTtZQUNELElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDNUIsTUFBTTthQUNUO1NBQ0o7UUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ1osY0FBYyxHQUFHLE9BQU8sQ0FBQztTQUM1QjtLQUNKO1NBQU0sSUFBSSxpQkFBaUIsRUFBRTtRQUMxQixlQUFlLEdBQUcsaUJBQWlCLENBQUM7S0FDdkM7SUFFRCxJQUFJLFNBQVMsQ0FBQztJQUNkLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDNUIsU0FBUyxHQUFHLE9BQU8sQ0FBQztLQUN2QjtTQUFNO1FBQ0gsU0FBUyxHQUFHLGVBQWUsQ0FBQztLQUMvQjtJQUVELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkQsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsc0RBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHNEQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRSxrRUFBa0U7SUFDbEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFO0lBRXBELElBQUksMEJBQTBCLElBQUksaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLFdBQVcsRUFBRTtRQUN4RSw2REFBNkQ7UUFDN0QsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7S0FDeEI7SUFFRCxNQUFNLGtCQUFrQixHQUE4QjtRQUNsRCxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSx5QkFBeUI7S0FDakY7SUFFRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFOUUsSUFBSSxnQkFBZ0IsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0tBQ3pCO0lBRUQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEtBQVksRUFBRSxFQUFFO1FBQzFDLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQzdDLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXhELE1BQU0sbUJBQW1CLEdBQTZCO1lBQ2xELE9BQU8sRUFBRSxJQUFJO1lBQ2IsY0FBYyxFQUFFLElBQUk7WUFDcEIsVUFBVSxFQUFFLElBQUk7U0FDbkI7UUFDRCxJQUFJLGNBQWMsSUFBSSxTQUFTLEVBQUU7WUFDN0IsbUJBQW1CLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNsQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDNUMsbUJBQW1CLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN4QztRQUNELElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxTQUFTO1lBQzdDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUMvQztRQUNELElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsY0FBYztZQUNyRCxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3hDO2FBQU0sSUFBSSxjQUFjLElBQUksQ0FBQyxFQUFFO1lBQzVCLGtEQUFrRDtZQUNsRCxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDdkQsbUJBQW1CLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzthQUN4QztZQUNELE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7U0FDdEQ7UUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJO1lBQ3JDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDckM7UUFDRCxPQUFPO1lBQ0gsY0FBYztZQUNkLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNoRyxDQUFDO0lBQ04sQ0FBQztJQUVELElBQUksUUFBUSxJQUFJLFNBQVMsSUFBSSxhQUFhLEVBQUU7UUFDeEMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUMzRCxZQUFZO1lBQ1osT0FBTyxDQUFDLGdCQUFnQixJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUMvRCw4QkFBOEI7Z0JBQzlCLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxHQUFHLENBQUM7YUFDbkM7U0FDSjtRQUNELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDL0QsOENBQThDO1lBQzlDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUM7U0FDakM7S0FDSjtJQUVELElBQUksUUFBUSxFQUFFO1FBQ1YsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEQsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQyxxQ0FBcUM7WUFDckMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQzthQUNsQztTQUNKO0tBQ0o7SUFFRCxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUU7UUFDdkIsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEQsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsTUFBTSxtQkFBbUIsR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUM7UUFFNUQsTUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksWUFBWSxFQUFFO1lBQ2QsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2pCLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO2dCQUNwQyxJQUFJLEdBQUcsV0FBVyxFQUFFLElBQUksR0FBRyxXQUFXLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBQ3JELHNCQUFzQjtvQkFDdEIsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDWixNQUFNO2lCQUNUO2dCQUNELElBQUksT0FBTyxXQUFXLElBQUksUUFBUSxJQUFJLFdBQVcsQ0FBQyxtQkFBbUIsSUFBSSxXQUFXLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUM1SCxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNaLE1BQU07aUJBQ1Q7YUFDSjtZQUNELElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1AsT0FBTyxDQUFDLGdCQUFnQixJQUFJLEdBQUcsQ0FBQzthQUNuQztTQUNKO1FBRUQsSUFBSSxjQUFjLEVBQUU7WUFDaEIsSUFBSSxjQUFjLElBQUksY0FBYyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUMsc0NBQXNDO29CQUN0RixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO3dCQUMzQyxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsY0FBYyxFQUFFO3dCQUM3QyxPQUFPLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztxQkFDMUI7eUJBQU07d0JBQ0gsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBRSxjQUFjO3FCQUN4QztpQkFDSjthQUNKO1lBQ0QsSUFBSSxjQUFjLElBQUksVUFBVSxFQUFFO2dCQUM5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUMzQyxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsY0FBYyxFQUFFO29CQUM3QyxPQUFPLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztpQkFDMUI7YUFDSjtZQUNELElBQUksY0FBYyxJQUFJLE9BQU8sRUFBRTtnQkFDM0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDeEMsT0FBTyxDQUFDLE9BQU8sSUFBSSxVQUFVLGNBQWMsRUFBRTtvQkFDN0MsT0FBTyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUM7aUJBQzFCO2FBQ0o7U0FDSjtLQUNKO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2UnNCO0FBQ2E7QUFDc0U7QUFDcEQ7QUFDVDtBQUNHO0FBQ2lCO0FBRVY7QUFDYztBQUVSO0FBRzdELE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0FBQzdCLE1BQU0scUJBQXFCLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUM1QixNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUdoQyxNQUFNLE9BQU8sR0FBRyxDQUFPLEVBQVUsRUFBaUIsRUFBRTtJQUNoRCxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFPLFVBQTJCLEVBQUUsbUJBQXVDLElBQUksRUFBZ0MsRUFBRTtJQUNoSSx5QkFBeUI7SUFDekIsNERBQTREO0lBQzVELDBCQUEwQjs7SUFFMUIsaUhBQWlIO0lBRWpILDhFQUE4RTtJQUM5RSxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFMUMsSUFBSSxNQUFNLEdBQXdCLEVBQUUsQ0FBQztJQUVyQyxJQUFJLG1CQUFtQixHQUF3QyxFQUFFO0lBRWpFLEtBQUssSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxRQUFRLEdBQUcsK0NBQVcsRUFBRSxRQUFRLElBQUksK0NBQVcsRUFBRTtRQUMvRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsQ0FBQztRQUNoRCxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4RCxJQUFJLFNBQWlCLENBQUM7UUFDdEIsSUFBSSxpQkFBcUMsQ0FBQztRQUMxQyxJQUFJLFlBQStCLENBQUM7UUFDcEMsSUFBSSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxVQUFVLEVBQUU7WUFDWixTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ2YsS0FBSyxNQUFNLFFBQVEsSUFBSSxVQUFVLEVBQUU7Z0JBQy9CLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDOUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztnQkFDM0MsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7YUFDakM7U0FDSjtRQUNELG1CQUFtQjtRQUNuQixTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRXRCLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxNQUFNLDRCQUE0QixHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztRQUdqRSxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BKLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLDRCQUE0QixDQUFDLENBQUM7UUFFMUUsTUFBTSxlQUFlLEdBQUcsSUFBSSwrREFBb0IsQ0FBQyxNQUFNLENBQUM7UUFDeEQsSUFBSSxRQUFRLEdBQW9CLElBQUksQ0FBQztRQUVyQyxJQUFJLFVBQVUsR0FBaUIsRUFBRTtRQUNqQyxNQUFNLFNBQVMsR0FBd0MsRUFBRTtRQUV6RCxNQUFNLFdBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBRXBDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFckIsSUFBSSxNQUFNLENBQUMsNkJBQTZCLElBQUksQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUN4RCx5QkFBeUI7WUFDekIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLElBQUksRUFBRSxJQUFJO2dCQUNWLFFBQVEsRUFBRSwrQ0FBVztnQkFDckIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLGFBQWEsRUFBRSxpQkFBaUI7Z0JBQ2hDLE9BQU8sRUFBRSxJQUFJLDZDQUFPLEVBQUU7Z0JBQ3RCLEtBQUssRUFBRSxZQUFZO2FBQ1QsRUFBQyxDQUFDLENBQUM7WUFDakIsUUFBUSxHQUFHLElBQUksQ0FBQztTQUNuQjtRQUVELE9BQU8sQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMvRSxVQUFVLEVBQUUsQ0FBQztZQUNiLFFBQVEsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEMsTUFBTSxXQUFXLEdBQUcsSUFBSSw2Q0FBTSxFQUFFLENBQUM7WUFDakMsSUFBSSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07YUFDVDtZQUNELElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtnQkFDekIsSUFBSSxXQUFXLElBQUksQ0FBQyxFQUFFO29CQUNsQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3pFLHNCQUFzQjt3QkFDdEIsU0FBUztxQkFDWjtpQkFDSjthQUNKO1lBQ0QsSUFBSSxVQUFVLENBQUMsWUFBWSxJQUFJLFlBQVksSUFBSSxRQUFRLEVBQUU7Z0JBQ3JELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUU7b0JBQ3hCLElBQUksMERBQWtCLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDdEYsU0FBUztxQkFDWjtpQkFDSjthQUNKO1lBQ0QsSUFBSSxhQUFhLENBQUM7WUFDbEIsSUFBSSxlQUFlLENBQUM7WUFFcEIsZUFBZSxHQUFHLG9FQUFrQixDQUFDO2dCQUNqQyxjQUFjLEVBQUUsUUFBUTtnQkFDeEIsbUJBQW1CLEVBQUUsTUFBTTtnQkFDM0IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFLFFBQVEsQ0FBQyxLQUFLO2dCQUMzQixNQUFNLEVBQUUsSUFBSSw2Q0FBTSxDQUFDLFdBQVcsQ0FBQzthQUNsQyxDQUFDO1lBQ0YsSUFBSSxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxHQUFHLENBQUMsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNyRyxnREFBZ0Q7Z0JBQ2hELGVBQWUsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBcUIsQ0FBQyxDQUFDLENBQUM7YUFDeEY7WUFDRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUM3QixTQUFTO2FBQ1o7WUFDRCxhQUFhLEdBQUcsMERBQWEsQ0FBQztnQkFDMUIsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLDZDQUFNLENBQUMsV0FBVyxDQUFDO2dCQUNqRyx5QkFBeUIsRUFBRSxRQUFRLEdBQUcsV0FBVzthQUNwRCxDQUFDO1lBRUYsS0FBSyxNQUFNLGVBQWUsSUFBSSxhQUFhLEVBQUU7Z0JBQ3pDLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxnQkFBZ0IsRUFBRTtvQkFDdkMsTUFBTTtpQkFDVDtnQkFDRCxNQUFNLGVBQWUsR0FBRyxJQUFJLDZDQUFNLEVBQUUsQ0FBQztnQkFDckMsZUFBZSxDQUFDLEtBQUssR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBRSxrQ0FBa0M7Z0JBQzlFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLElBQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN6QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2xCLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO3dCQUNwQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTs0QkFDMUMsU0FBUzt5QkFDWjt3QkFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN6QyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0NBQ3hELE1BQU0sR0FBRyxLQUFLLENBQUM7Z0NBQ2YsTUFBTTs2QkFDVDt5QkFDSjt3QkFDRCxJQUFJLE1BQU0sRUFBRTs0QkFDUixNQUFNO3lCQUNUO3FCQUNKO29CQUNELElBQUksTUFBTSxFQUFFO3dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pJLFNBQVM7cUJBQ1o7aUJBQ0o7Z0JBQ0QsS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLEVBQUU7b0JBQzFDLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxnQkFBZ0IsRUFBRTt3QkFDdkMsTUFBTTtxQkFDVDtvQkFDRCxNQUFNLGFBQWEsR0FBRzt3QkFDbEIsZUFBZSxFQUFFLE1BQU07d0JBQ3ZCLFlBQVksRUFBRSxRQUFRO3dCQUN0QixPQUFPLEVBQUUsV0FBVzt3QkFDcEIsWUFBWSxFQUFFLGNBQWMsQ0FBQyxLQUFLO3dCQUNsQyw0QkFBNEI7d0JBQzVCLHlCQUF5QixFQUFFLFFBQVEsR0FBRyxXQUFXO3dCQUNqRCxNQUFNO3dCQUNOLFVBQVU7d0JBQ1YsYUFBYSxFQUFFLGVBQWUsQ0FBQyxhQUFhO3dCQUM1QyxpQkFBaUI7d0JBQ2pCLFFBQVE7cUJBQ1g7b0JBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSw2Q0FBTyxFQUFFLENBQUM7b0JBQ3BDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDO29CQUN4RCwwRUFBdUIsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3RELElBQUksYUFBYSxDQUFDLGVBQWUsQ0FBQzt3QkFDMUIsTUFBTTt3QkFDTiw0QkFBNEI7cUJBQ25DLENBQUMsR0FBRyxFQUFFLEVBQUU7d0JBQ0wsb0RBQVUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7cUJBQzVDO29CQUVELE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDMUUsYUFBYSxDQUFDLFVBQVUsSUFBSSxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQ3RGLElBQUksWUFBWSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQzVELGFBQWEsQ0FBQyxVQUFVLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7d0JBQ2pFLElBQUksZ0JBQWdCLElBQUksQ0FBQyxFQUFFOzRCQUN2QixhQUFhLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQzt5QkFDbkM7d0JBQ0QsSUFBSSxRQUFRLEdBQUcsV0FBVyxHQUFHLENBQUMsRUFBRTs0QkFDNUIsa0NBQWtDOzRCQUNsQyxhQUFhLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQzt5QkFDbkM7d0JBQ0QsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLEVBQUU7NEJBQ2xDLGdEQUFnRDs0QkFDaEQsYUFBYSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUM7eUJBQ25DO3dCQUNELElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTs0QkFDakIsc0NBQXNDOzRCQUN0QyxhQUFhLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQzt5QkFDbkM7cUJBQ0o7b0JBQ0QsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLGVBQWUsQ0FBQzt3QkFDeEMsTUFBTTt3QkFDTiw0QkFBNEI7cUJBQy9CLENBQUMsQ0FBQztvQkFFSCxJQUFJLGdCQUFnQixFQUFFO3dCQUNsQixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzVDLElBQUksTUFBTSxFQUFFOzRCQUNSLE9BQU8sTUFBTSxDQUFDO3lCQUNqQjtxQkFDSjtvQkFFRCxJQUFJLFlBQWdDLENBQUM7b0JBQ3JDLElBQUksT0FBTyxHQUFHLEVBQUUsRUFBRTt3QkFDZCw0Q0FBNEM7d0JBQzVDLG9DQUFvQzt3QkFDcEMsWUFBWSxHQUFHLDhEQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQzlDLGFBQWEsQ0FBQyxZQUFZLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQzt3QkFDbkQsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFOzRCQUNsQixhQUFhLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUM7eUJBQ3hDO3dCQUNELElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRTs0QkFDdEIsYUFBYSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO3lCQUNoRDt3QkFDRCxPQUFPLEdBQUcsYUFBYSxDQUFDLGVBQWUsQ0FBQzs0QkFDcEMsTUFBTTs0QkFDTiw0QkFBNEI7eUJBQy9CLENBQUMsQ0FBQztxQkFDTjtvQkFFRCxJQUFJLE9BQU8sR0FBRyxFQUFFLEVBQUU7d0JBQ2QsZUFBZSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7d0JBQ25DLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQzt3QkFDdkIsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUU7NEJBQ2hDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQ0FDNUUsY0FBYyxFQUFFLENBQUM7NkJBQ3BCO3lCQUNKO3dCQUNELElBQUksY0FBYyxJQUFJLHFCQUFxQixFQUFFOzRCQUN6QyxnRUFBZ0U7NEJBQ2hFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs0QkFDdEIsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7NEJBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dDQUN4QyxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ2hDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQ0FDNUUsSUFBSSxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTywwQ0FBRSxZQUFZLEtBQUksR0FBRyxDQUFDLEdBQUcsaUJBQWlCLEVBQUU7d0NBQ2pFLFVBQVUsR0FBRyxDQUFDLENBQUM7cUNBQ2xCO2lDQUNKOzZCQUNKOzRCQUNELElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtnQ0FDcEIsSUFBSSxDQUFDLGlCQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTywwQ0FBRSxZQUFZLEtBQUksR0FBRyxDQUFDLEdBQUcsT0FBTyxFQUFFO29DQUNwRSw4Q0FBOEM7b0NBQzlDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lDQUNwQzs2QkFDSjt5QkFFSjt3QkFDRCxJQUFJLGNBQWMsR0FBRyxxQkFBcUIsRUFBRTs0QkFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztnQ0FDOUMsSUFBSSxFQUFFLElBQUk7Z0NBQ1YsUUFBUSxFQUFFLCtDQUFXO2dDQUNyQixLQUFLLEVBQUUsUUFBUTtnQ0FDZixTQUFTLEVBQUUsS0FBSztnQ0FDaEIsYUFBYSxFQUFFLGVBQWUsQ0FBQyxhQUFhO2dDQUM1QyxPQUFPLEVBQUUsYUFBYTtnQ0FDdEIsS0FBSyxFQUFFLGNBQWMsQ0FBQyxLQUFLOzZCQUNqQixFQUNiLENBQUMsQ0FBQzt5QkFDTjtxQkFDSjt5QkFBTSxJQUFJLGFBQWEsQ0FBQyxZQUFZLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsZUFBZSxFQUFFO3dCQUMvRSxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQzt3QkFDOUIsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7NEJBQzlCLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0NBQ3ZDLHFCQUFxQixFQUFFLENBQUM7NkJBQzNCO3lCQUNKO3dCQUNELElBQUkscUJBQXFCLEdBQUcsb0JBQW9CLEVBQUU7NEJBQzlDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0NBQ1gsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLEdBQUcsZUFBZSxDQUFDLGFBQWE7Z0NBQ2hFLE9BQU8sRUFBRSxhQUFhOzZCQUN6QixDQUFDLENBQUM7eUJBQ047cUJBQ0o7aUJBQ0osQ0FBRSwyQkFBMkI7YUFDakMsQ0FBRSwrQkFBK0I7U0FDckMsQ0FBRSxZQUFZO1FBQ2YsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUN4QixLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtnQkFDOUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDL0Q7WUFDRCxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQiwrQ0FBK0M7WUFDL0MsSUFBSSxRQUFRLElBQUksK0NBQVcsRUFBRTtnQkFDekIsUUFBUSxJQUFJLCtDQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixvQ0FBb0M7Z0JBQ3BDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztnQkFDMUIsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsRUFBRTtvQkFDL0MsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUM5QztnQkFDRCxvREFBb0Q7Z0JBQ3BELG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hHLG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQyxDQUFDO2dCQUN0QyxtQ0FBbUM7Z0JBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxHQUFHLCtDQUFXLEVBQUUsQ0FBQyxHQUFHLFFBQVEsR0FBRywrQ0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3JFLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQjtnQkFDRCxJQUFJLG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzdFLHlGQUF5RjtvQkFDekYsbUJBQW1CLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2pELFFBQVEsSUFBSSwrQ0FBVztvQkFDdkIsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO29CQUMxQixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQyxFQUFFO3dCQUMvQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7cUJBQzlDO29CQUNELG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxHQUFHLCtDQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2hHLG1CQUFtQixDQUFDLFFBQVEsR0FBRywrQ0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNqRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQyxDQUFDO29CQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsR0FBRywrQ0FBVyxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsK0NBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNyRSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEI7aUJBQ0o7YUFDSjtpQkFBTTtnQkFDSCxnQ0FBZ0M7Z0JBQ2hDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkIsT0FBTyxNQUFNLENBQUM7YUFDakI7WUFDRCxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ2xCLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3pELElBQUksTUFBTSxFQUFFO29CQUNSLE9BQU8sTUFBTSxDQUFDO2lCQUNqQjthQUNKO1lBQ0QsU0FBUztTQUNaO1FBRUQsd0NBQXdDO1FBQ3hDLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUM7UUFDdEIsS0FBSyxNQUFNLEtBQUssSUFBSSxVQUFVLEVBQUU7WUFDNUIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBRTtnQkFDL0IsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxXQUFXLEVBQUU7b0JBQzdDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ2xCLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztpQkFDL0M7Z0JBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7YUFDeko7U0FDSjtRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDN0IsSUFBSSxxQkFBUyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxPQUFPLDBDQUFFLEdBQUcsRUFBRTtZQUM1QixrQ0FBa0M7WUFDbEMsOERBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxHQUFHLCtDQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsSUFBSSxnQkFBZ0IsRUFBRTtZQUNsQixJQUFJLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDdkMsT0FBTyxNQUFNLENBQUM7YUFDakI7U0FDSjtRQUVELGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdEI7SUFFRCxPQUFPLE1BQU07QUFDakIsQ0FBQztBQUVNLFNBQWUsU0FBUyxDQUFDLE1BQXVCLEVBQUUsbUJBQXVDLElBQUk7O1FBQ2hHLElBQUksZUFBZSxHQUF3QixFQUFFLENBQUM7UUFDOUMsZUFBZSxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekQscUZBQXFGO1FBQ3JGLDhEQUFjLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLDBDQUEwQztRQUMxQyx3Q0FBd0M7UUFHeEMsT0FBTztZQUNILGVBQWUsRUFBRSxlQUFlO1NBQ25DO0lBRUwsQ0FBQztDQUFBO0FBRU0sU0FBUyxVQUFVLENBQUMsZUFBb0MsRUFBRSxVQUEyQjtJQUN4Rix1Q0FBdUM7SUFDdkMsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRTtJQUV6QyxLQUFLLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsUUFBUSxHQUFHLCtDQUFXLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDbEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLCtDQUFXLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtTQUNqQzthQUFNLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3pDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsK0NBQVcsQ0FBQztnQkFDaEMsUUFBUSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7WUFDN0IsQ0FBQyxDQUFDO1NBQ0w7S0FFSjtJQUVELHFGQUFxRjtJQUNyRiwrQ0FBK0M7SUFDL0MsMENBQTBDO0lBQzFDLDRDQUE0QztBQUNoRCxDQUFDO0FBRXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1YTJFO0FBRWtIO0FBVzVNLE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBcUIsRUFBc0IsRUFBRTtJQUN6RTs7TUFFRTtJQUNGLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQzNFLE1BQU0sRUFBQyx1QkFBdUIsRUFBRSxjQUFjLEVBQUMsR0FBRyxxREFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUIsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7SUFDckQsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxHQUFHLCtDQUFXLENBQUM7SUFDM0QsTUFBTSxPQUFPLEdBQXVCO1FBQ2hDLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLENBQUM7UUFDVixHQUFHLEVBQUUsSUFBSTtLQUNaO0lBRUQsTUFBTSx1QkFBdUIsR0FBRyw0REFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRSxNQUFNLFlBQVksR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRSxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2YsT0FBTyxPQUFPLENBQUM7S0FDbEI7SUFFRCxNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUM7SUFDckMsTUFBTSxlQUFlLEdBQUcsZUFBZSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQUV0RSwwQ0FBMEM7SUFDMUMsSUFBSSx3QkFBd0IsR0FBRyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN4RSxJQUFJLHFCQUFxQixHQUFHLGVBQWUsQ0FBQztJQUM1QyxJQUFJLENBQUMsd0JBQXdCLEVBQUU7UUFDM0IsK0VBQStFO1FBQy9FLEtBQUssSUFBSSxDQUFDLEdBQUcsZUFBZSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksZUFBZSxHQUFHLCtDQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNFLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELElBQUksd0JBQXdCLEVBQUU7Z0JBQzFCLHFCQUFxQixHQUFHLENBQUMsQ0FBQztnQkFDMUIsTUFBTTthQUNUO1NBQ0o7S0FDSjtJQUNELElBQUksQ0FBQyx3QkFBd0IsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFO1FBQ3pFLG1DQUFtQztRQUNuQyxPQUFPLENBQUMsT0FBTyxHQUFHLGtDQUFrQyxDQUFDO1FBQ3JELE9BQU8sT0FBTyxDQUFDO0tBQ2xCO0lBRUQsTUFBTSxpQkFBaUIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUUsb0JBQW9CO0lBQ25ILE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuRCxpRkFBaUY7SUFDakYsSUFBSSx5QkFBeUIsQ0FBQztJQUM5QixJQUFJLHNCQUFzQixDQUFDO0lBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcscUJBQXFCLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0QseUJBQXlCLEdBQUcsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBSSx5QkFBeUIsRUFBRTtZQUMzQixzQkFBc0IsR0FBRyxDQUFDLENBQUM7WUFDM0IsTUFBTTtTQUNUO0tBQ0o7SUFFRCxJQUFJLENBQUMseUJBQXlCLElBQUkseUJBQXlCLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTtRQUMzRSxtQ0FBbUM7UUFDbkMsT0FBTyxDQUFDLE9BQU8sR0FBRyxrQ0FBa0MsQ0FBQztRQUNyRCxPQUFPLE9BQU8sQ0FBQztLQUNsQjtJQUVELHFHQUFxRztJQUNyRyxrQ0FBa0M7SUFFbEMsdUJBQXVCO0lBQ3ZCLHdDQUF3QztJQUN4QyxNQUFNLGdCQUFnQixHQUFHLHNEQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsc0RBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLElBQUksWUFBWSxDQUFDO0lBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsZUFBZSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNDLFlBQVksR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTTtTQUNUO0tBQ0o7SUFFRCxJQUFJLGdCQUFnQixHQUFHLENBQUMsZUFBZSxDQUFDLGVBQWUsR0FBRywrQ0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3SCxJQUFJLHNCQUFzQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxzREFBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFN0YsSUFBSSxpQkFBaUIsQ0FBQztJQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLGVBQWUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQyxpQkFBaUIsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLElBQUksaUJBQWlCLEVBQUU7WUFDbkIsTUFBTTtTQUNUO0tBQ0o7SUFFRCwyREFBMkQ7SUFDM0QsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLHNEQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFbkYsb0dBQW9HO0lBQ3BHLE1BQU0sMEJBQTBCLEdBQUcsc0JBQXNCLElBQUksa0JBQWtCLElBQUksZ0JBQWdCLENBQUM7SUFFcEcsSUFBSSxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztJQUM1QyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxJQUFJLG1CQUFtQixJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsSCxVQUFVLEVBQUUsQ0FBQztRQUFDLElBQUksVUFBVSxHQUFHLEdBQUcsRUFBRTtZQUFFLFFBQVEsQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUFFO1FBQzFGLG1CQUFtQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDLENBQUM7S0FDM0Y7SUFFRCxJQUFJLGdCQUFnQixDQUFDO0lBQ3JCLElBQUkseUJBQXlCLEVBQUU7UUFDM0IsZ0JBQWdCLEdBQUcsc0RBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzNGLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksZ0JBQWdCLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JHLFVBQVUsRUFBRSxDQUFDO1lBQUMsSUFBSSxVQUFVLEdBQUcsR0FBRyxFQUFFO2dCQUFFLFFBQVEsQ0FBQztnQkFBQyxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFBRTtZQUN6RixnQkFBZ0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzlFO0tBQ0o7SUFDRCxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtRQUNqRCxnREFBZ0Q7UUFDaEQsZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUM7UUFDdkMseUJBQXlCLEdBQUcsd0JBQXdCLENBQUM7S0FDeEQ7SUFFRCxJQUFJLDZCQUE2QixHQUFHLHVCQUF1QixDQUFDLGVBQWUsR0FBRywrQ0FBVyxDQUFDLENBQUM7SUFDM0YsSUFBSSxDQUFDLDZCQUE2QixFQUFFO1FBQ2hDLDZCQUE2QixHQUFHLHlCQUF5QixDQUFDO0tBQzdEO0lBQ0QsSUFBSSxvQkFBb0IsQ0FBQztJQUN6QixJQUFJLDZCQUE2QixFQUFFO1FBQy9CLG9CQUFvQixHQUFHLHNEQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLG9CQUFvQixJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxRyxJQUFJLFVBQVUsRUFBRSxHQUFHLEdBQUcsRUFBRTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFBRTtZQUNuRSxvQkFBb0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ25GO0tBQ0o7SUFFRCx5R0FBeUc7SUFDekcseURBQXlEO0lBRXpELHlEQUF5RDtJQUN6RCxnRUFBZ0U7SUFDaEUsNEJBQTRCO0lBRTVCLHFFQUFxRTtJQUNyRSx3RkFBd0Y7SUFFeEYsdUVBQXVFO0lBQ3ZFLG9CQUFvQjtJQUVwQiwyREFBMkQ7SUFFM0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsc0RBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkgsTUFBTSxTQUFTLEdBQXlCO1FBQ3BDLFNBQVMsRUFBRSxrQkFBa0IsSUFBSSxtQkFBbUI7UUFDcEQsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixhQUFhLEVBQUUsb0JBQW9CO1FBQ25DLEtBQUssRUFBRSxZQUFZO1FBQ25CLEtBQUssRUFBRSxLQUFLO1FBQ1osV0FBVyxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQztRQUNqQyxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUVELE1BQU0sWUFBWSxHQUFHLENBQ2pCLHdCQUF3QixDQUFDLFFBQVEsSUFBSSwrQ0FBVztRQUNoRCxDQUNJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxJQUFJLCtDQUFXLEdBQUcsQ0FBQyxJQUFJLHlCQUF5QixDQUFDLFFBQVEsSUFBSSwrQ0FBVyxHQUFHLENBQUMsQ0FBQztZQUMvRyxtQkFBbUIsSUFBSSxnQkFBZ0IsQ0FDMUMsQ0FDSjtJQUVELElBQUksWUFBWSxFQUFFO1FBQ2QsSUFBSSxtQkFBbUIsSUFBSSxnQkFBZ0IsRUFBRTtZQUN6Qyx3Q0FBd0M7WUFDeEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztZQUN6QyxPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUNELDJEQUEyRDtRQUMzRCxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBQ2hELElBQUksd0JBQXdCLENBQUMsUUFBUSxJQUFJLCtDQUFXLEdBQUcsQ0FBQyxFQUFFO1lBQ3RELFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7WUFDN0MsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDdEMsT0FBTyxDQUFDLE9BQU8sR0FBRywyQkFBMkIsbURBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLG1EQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO2dCQUNqSCxPQUFPLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztnQkFDdkIsT0FBTyxPQUFPLENBQUM7YUFDbEI7U0FDSjtRQUNELFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSTtRQUMxQixNQUFNLEdBQUcsR0FBRyx3REFBUSxDQUFDLFNBQW1DLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sT0FBTyxDQUFDLE9BQU8sR0FBRyw4QkFBK0IsU0FBUyxDQUFDLFlBQXlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsbURBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxtREFBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxtREFBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssbURBQVcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUM3TyxPQUFPLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztZQUN2QixPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUNELE1BQU0sWUFBWSxHQUFHLHNEQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLHdEQUF3RDtRQUN4RCxTQUFTO1FBQ1Qsb0xBQW9MO1FBQ3BMLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO0tBQ3pFO1NBQU0sSUFBSSx3QkFBd0IsQ0FBQyxRQUFRLElBQUksK0NBQVcsR0FBRyxDQUFDLElBQUkseUJBQXlCLENBQUMsUUFBUSxJQUFJLCtDQUFXLEdBQUcsQ0FBQyxFQUFFO1FBQ3RILHdGQUF3RjtRQUN4RixJQUFJLG1CQUFtQixJQUFJLGdCQUFnQixFQUFFO1lBQ3pDLDJEQUEyRDtZQUMzRCxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO1lBQzdDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSTtZQUMxQixNQUFNLEdBQUcsR0FBRyx3REFBUSxDQUFDLFNBQW1DLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNOLE9BQU8sQ0FBQyxPQUFPLEdBQUcsK0JBQStCLENBQUM7Z0JBQ2xELE9BQU8sQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO2dCQUN2QixPQUFPLE9BQU8sQ0FBQzthQUNsQjtZQUNELE1BQU0sWUFBWSxHQUFHLHNEQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLHdEQUF3RDtZQUN4RCxTQUFTO1lBQ1QsNEtBQTRLO1lBQzVLLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2xCLG9FQUFvRTtTQUN2RTthQUFNO1lBQ0gsZ0NBQWdDO1lBQ2hDLE9BQU8sQ0FBQyxPQUFPLEdBQUcseUNBQXlDLENBQUM7WUFDNUQsT0FBTyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUM7WUFDdkIsT0FBTyxPQUFPLENBQUM7U0FFbEI7S0FDSjtTQUFNO1FBQ0gsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLHdCQUF3QixDQUFDLFFBQVEsT0FBTywrQ0FBVyxFQUFFLENBQUM7S0FDOUU7SUFFRCxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNwQixPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaFBvQztBQUd5RDtBQWV2RixNQUFNLGFBQWEsR0FBRyxDQUFDLE1BR3pCLEVBQWdDLEVBQUU7SUFDbkMsTUFBTSxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUseUJBQXlCLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDbkYsbUVBQW1FO0lBQ25FLGdCQUFnQjtJQUVoQixNQUFNLEVBQUMsdUJBQXVCLEVBQUUsY0FBYyxFQUFDLEdBQUcscURBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV4RSwyQ0FBMkM7SUFDM0MsTUFBTSxHQUFHLEdBQWlDLEVBQUUsQ0FBQztJQUU3QyxJQUFJLHVCQUF1QixHQUFHLENBQUMsR0FBRyx1QkFBdUIsQ0FBQztJQUMxRCxJQUFJLFNBQVMsRUFBRTtRQUNYLHVCQUF1QixHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxzREFBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDekU7SUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUVELElBQUksS0FBSyxFQUFFO1FBQ1Asd0VBQXdFO1FBRXhFLFNBQVM7UUFDVCwrQ0FBK0M7UUFFL0MsMkZBQTJGO1FBQzNGLG9FQUFvRTtRQUVwRSxtREFBbUQ7UUFFbkQsb0dBQW9HO1FBQ3BHLHNEQUFzRDtRQUV0RCxNQUFNLGFBQWEsR0FBRyx3REFBZ0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUN4RixNQUFNLFdBQVcsR0FBRyxhQUFhLElBQUksQ0FBQyxJQUFJLGFBQWEsSUFBSSxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFELDBFQUEwRTtRQUUxRSxJQUFJLGNBQWMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEcsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixjQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM5STtRQUVELEtBQUssSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFLGNBQWMsR0FBRyxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUU7WUFDbkUsS0FBSyxJQUFJLGNBQWMsR0FBQyxDQUFDLEVBQUUsY0FBYyxHQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUU7Z0JBQ25GLEtBQUssSUFBSSxnQkFBZ0IsR0FBQyxDQUFDLEVBQUUsZ0JBQWdCLEdBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRTtvQkFDaEYsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU0sU0FBUyxHQUFHLGNBQWMsSUFBSSxDQUFDLENBQUM7b0JBRXRDLHdDQUF3QztvQkFDeEMsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLHlCQUF5QixHQUFHLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQy9CLFNBQVMsQ0FBQyx3REFBd0Q7eUJBQ3JFO3FCQUNKO29CQUVELE1BQU0sZUFBZSxHQUFvQjt3QkFDckMsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsTUFBTSxFQUFFLENBQUM7d0JBQ1QsYUFBYSxFQUFFLGNBQWMsQ0FBQyxjQUFjLENBQUM7cUJBQ2hELENBQUM7b0JBQ0YsSUFBSSxTQUFTLEVBQUU7d0JBQ1gsZUFBZSxDQUFDLGFBQWEsSUFBSSxZQUFZLENBQUM7cUJBQ2pEO29CQUNELGVBQWUsQ0FBQyxhQUFhLElBQUksR0FBRyxHQUFHLGdCQUFnQixDQUFDO29CQUV4RCxNQUFNLFdBQVcsR0FBRyxDQUFDLFNBQWlCLEVBQUUsSUFBVSxFQUFFLEVBQUU7d0JBQ2xELGVBQWUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSwrQ0FBSSxDQUFDOzRCQUN4QyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7NEJBQ3ZCLE1BQU0sRUFBRSxDQUFDLENBQUUsUUFBUTt5QkFDdEIsQ0FBQyxDQUFDO29CQUNQLENBQUM7b0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxXQUFXLEdBQThCLEVBQUUsQ0FBQztvQkFFaEQsMkJBQTJCO29CQUMzQixJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQzlCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3RCO3lCQUFNLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDdEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDdEI7eUJBQU0sSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUN2QyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0Qjt5QkFBTSxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3RDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3RCO29CQUVELCtCQUErQjtvQkFDL0IsSUFBSSxlQUFlLEdBQWEsRUFBRSxDQUFDO29CQUNuQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTt3QkFDekIsSUFBSSxTQUFTLElBQUksTUFBTSxFQUFFOzRCQUNyQixlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsa0JBQWtCO3lCQUNuRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxZQUFZLEVBQUU7NEJBQ2xDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7eUJBQ3BEOzZCQUFNLElBQUksU0FBUyxJQUFJLFlBQVksRUFBRTs0QkFDbEMsNkJBQTZCOzRCQUM3QixlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsa0JBQWtCO3lCQUNuRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxhQUFhLEVBQUU7NEJBQ25DLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7NEJBQ2pELE1BQU0sSUFBSSxDQUFDLENBQUM7eUJBQ2Y7NkJBQU0sSUFBSSxTQUFTLElBQUksYUFBYSxFQUFFOzRCQUNuQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsbUJBQW1CO3lCQUNwRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxRQUFRLEVBQUU7NEJBQzlCLDhCQUE4Qjs0QkFDOUIsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLGtCQUFrQjt5QkFDbkQ7cUJBQ0o7eUJBQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQ2hDLGdDQUFnQzt3QkFDaEMsSUFBSSxTQUFTLElBQUksV0FBVyxFQUFFOzRCQUMxQixlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsa0JBQWtCO3lCQUNuRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxZQUFZLEVBQUU7NEJBQ2xDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7NEJBQ2pELE1BQU0sSUFBSSxDQUFDLENBQUM7eUJBQ2Y7NkJBQU0sSUFBSSxTQUFTLElBQUksWUFBWSxFQUFFOzRCQUNsQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsa0JBQWtCO3lCQUNuRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxhQUFhLEVBQUU7NEJBQ25DLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7NEJBQ2pELE1BQU0sSUFBSSxDQUFDLENBQUM7eUJBQ2Y7NkJBQU0sSUFBSSxTQUFTLElBQUksWUFBWSxFQUFFOzRCQUNsQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsa0JBQWtCO3lCQUNuRDs2QkFBTSxJQUFJLFNBQVMsSUFBSSxhQUFhLEVBQUU7NEJBQ25DLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7NEJBQ2pELE1BQU0sSUFBSSxDQUFDLENBQUM7eUJBQ2Y7NkJBQU07NEJBQ0gsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNuRTtxQkFDSjtvQkFFRCxJQUFJLFNBQVMsRUFBRTt3QkFDWCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ3JCLHVDQUF1Qzs0QkFDdkMsU0FBUzt5QkFDWjt3QkFDRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTs0QkFDakQsa0NBQWtDOzRCQUNsQyxTQUFTO3lCQUNaO3dCQUNELGVBQWUsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCwyQ0FBMkM7d0JBQzNDLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFOzRCQUNqRCxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMzQjs2QkFBTTs0QkFDSCxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMzQjtxQkFDSjtvQkFFRCw2RUFBNkU7b0JBQzdFLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUN4QixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixxQkFBcUI7d0JBQ3JCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixvQkFBb0I7d0JBQ3BCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixxQkFBcUI7d0JBQ3JCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JB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cGFjazovLy8uL25vZGVfbW9kdWxlcy9tdXNpY3RoZW9yeWpzL2Rpc3QvbXVzaWN0aGVvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2F2YWlsYWJsZXNjYWxlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2hvcmRwcm9ncmVzc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2hvcmRzLnRzIiwid2VicGFjazovLy8uL3NyYy9mb3JjZWRtZWxvZHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ludmVyc2lvbnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL215bG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9ub25jaG9yZHRvbmVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhbmRvbWNob3Jkcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVuc2lvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3dvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLk11c2ljVGhlb3J5ID0ge30pKTtcbn0pKHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgIC8qKlxyXG4gICAgKiBOb3RlcyBzdGFydGluZyBhdCBDMCAtIHplcm8gaW5kZXggLSAxMiB0b3RhbFxyXG4gICAgKiBNYXBzIG5vdGUgbmFtZXMgdG8gc2VtaXRvbmUgdmFsdWVzIHN0YXJ0aW5nIGF0IEM9MFxyXG4gICAgKiBAZW51bVxyXG4gICAgKi9cclxuICAgdmFyIFNlbWl0b25lO1xyXG4gICAoZnVuY3Rpb24gKFNlbWl0b25lKSB7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkFcIl0gPSA5XSA9IFwiQVwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJBc1wiXSA9IDEwXSA9IFwiQXNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQmJcIl0gPSAxMF0gPSBcIkJiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkJcIl0gPSAxMV0gPSBcIkJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQnNcIl0gPSAwXSA9IFwiQnNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQ2JcIl0gPSAxMV0gPSBcIkNiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkNcIl0gPSAwXSA9IFwiQ1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJDc1wiXSA9IDFdID0gXCJDc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEYlwiXSA9IDFdID0gXCJEYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJEXCJdID0gMl0gPSBcIkRcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRHNcIl0gPSAzXSA9IFwiRHNcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRWJcIl0gPSAzXSA9IFwiRWJcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiRVwiXSA9IDRdID0gXCJFXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkVzXCJdID0gNV0gPSBcIkVzXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZiXCJdID0gNF0gPSBcIkZiXCI7XHJcbiAgICAgICBTZW1pdG9uZVtTZW1pdG9uZVtcIkZcIl0gPSA1XSA9IFwiRlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJGc1wiXSA9IDZdID0gXCJGc1wiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHYlwiXSA9IDZdID0gXCJHYlwiO1xyXG4gICAgICAgU2VtaXRvbmVbU2VtaXRvbmVbXCJHXCJdID0gN10gPSBcIkdcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiR3NcIl0gPSA4XSA9IFwiR3NcIjtcclxuICAgICAgIFNlbWl0b25lW1NlbWl0b25lW1wiQWJcIl0gPSA4XSA9IFwiQWJcIjtcclxuICAgfSkoU2VtaXRvbmUgfHwgKFNlbWl0b25lID0ge30pKTtcclxuICAgLyoqXHJcbiAgICAqIFJldHVybnMgdGhlIHdob2xlIG5vdGUgbmFtZSAoZS5nLiBDLCBELCBFLCBGLCBHLCBBLCBCKSBmb3JcclxuICAgICogdGhlIGdpdmVuIHN0cmluZ1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGdldFdob2xlVG9uZUZyb21OYW1lID0gKG5hbWUpID0+IHtcclxuICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PT0gMCB8fCBuYW1lLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBuYW1lXCIpO1xyXG4gICAgICAgY29uc3Qga2V5ID0gbmFtZVswXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgcmV0dXJuIFNlbWl0b25lW2tleV07XHJcbiAgIH07XHJcbiAgIHZhciBTZW1pdG9uZSQxID0gU2VtaXRvbmU7XG5cbiAgIC8qKlxyXG4gICAgKiBXcmFwcyBhIG51bWJlciBiZXR3ZWVuIGEgbWluIGFuZCBtYXggdmFsdWUuXHJcbiAgICAqIEBwYXJhbSB2YWx1ZSAtIHRoZSBudW1iZXIgdG8gd3JhcFxyXG4gICAgKiBAcGFyYW0gbG93ZXIgIC0gdGhlIGxvd2VyIGJvdW5kXHJcbiAgICAqIEBwYXJhbSB1cHBlciAtIHRoZSB1cHBlciBib3VuZFxyXG4gICAgKiBAcmV0dXJucyB3cmFwcGVkTnVtYmVyIC0gdGhlIHdyYXBwZWQgbnVtYmVyXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgd3JhcCA9ICh2YWx1ZSwgbG93ZXIsIHVwcGVyKSA9PiB7XHJcbiAgICAgICAvLyBjb3BpZXNcclxuICAgICAgIGxldCB2YWwgPSB2YWx1ZTtcclxuICAgICAgIGxldCBsYm91bmQgPSBsb3dlcjtcclxuICAgICAgIGxldCB1Ym91bmQgPSB1cHBlcjtcclxuICAgICAgIC8vIGlmIHRoZSBib3VuZHMgYXJlIGludmVydGVkLCBzd2FwIHRoZW0gaGVyZVxyXG4gICAgICAgaWYgKHVwcGVyIDwgbG93ZXIpIHtcclxuICAgICAgICAgICBsYm91bmQgPSB1cHBlcjtcclxuICAgICAgICAgICB1Ym91bmQgPSBsb3dlcjtcclxuICAgICAgIH1cclxuICAgICAgIC8vIHRoZSBhbW91bnQgbmVlZGVkIHRvIG1vdmUgdGhlIHJhbmdlIGFuZCB2YWx1ZSB0byB6ZXJvXHJcbiAgICAgICBjb25zdCB6ZXJvT2Zmc2V0ID0gMCAtIGxib3VuZDtcclxuICAgICAgIC8vIG9mZnNldCB0aGUgdmFsdWVzIHNvIHRoYXQgdGhlIGxvd2VyIGJvdW5kIGlzIHplcm9cclxuICAgICAgIGxib3VuZCArPSB6ZXJvT2Zmc2V0O1xyXG4gICAgICAgdWJvdW5kICs9IHplcm9PZmZzZXQ7XHJcbiAgICAgICB2YWwgKz0gemVyb09mZnNldDtcclxuICAgICAgIC8vIGNvbXB1dGUgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgdmFsdWUgd2lsbCB3cmFwXHJcbiAgICAgICBsZXQgd3JhcHMgPSBNYXRoLnRydW5jKHZhbCAvIHVib3VuZCk7XHJcbiAgICAgICAvLyBjYXNlOiAtMSAvIHVib3VuZCg+MCkgd2lsbCBlcXVhbCAwIGFsdGhvdWdoIGl0IHdyYXBzIG9uY2VcclxuICAgICAgIGlmICh3cmFwcyA9PT0gMCAmJiB2YWwgPCBsYm91bmQpXHJcbiAgICAgICAgICAgd3JhcHMgPSAtMTtcclxuICAgICAgIC8vIGNhc2U6IHVib3VuZCBhbmQgdmFsdWUgYXJlIHRoZSBzYW1lIHZhbC91Ym91bmQgPSAxIGJ1dCBhY3R1YWxseSBkb2VzbnQgd3JhcFxyXG4gICAgICAgaWYgKHdyYXBzID09PSAxICYmIHZhbCA9PT0gdWJvdW5kKVxyXG4gICAgICAgICAgIHdyYXBzID0gMDtcclxuICAgICAgIC8vIG5lZWRlZCB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIG51bSBvZiB3cmFwcyBpcyAwIG9yIDEgb3IgLTFcclxuICAgICAgIGxldCB2YWxPZmZzZXQgPSAwO1xyXG4gICAgICAgbGV0IHdyYXBPZmZzZXQgPSAwO1xyXG4gICAgICAgaWYgKHdyYXBzID49IC0xICYmIHdyYXBzIDw9IDEpXHJcbiAgICAgICAgICAgd3JhcE9mZnNldCA9IDE7XHJcbiAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYmVsb3cgdGhlIHJhbmdlXHJcbiAgICAgICBpZiAodmFsIDwgbGJvdW5kKSB7XHJcbiAgICAgICAgICAgdmFsT2Zmc2V0ID0gKHZhbCAlIHVib3VuZCkgKyB3cmFwT2Zmc2V0O1xyXG4gICAgICAgICAgIHZhbCA9IHVib3VuZCArIHZhbE9mZnNldDtcclxuICAgICAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYWJvdmUgdGhlIHJhbmdlXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlIGlmICh2YWwgPiB1Ym91bmQpIHtcclxuICAgICAgICAgICB2YWxPZmZzZXQgPSAodmFsICUgdWJvdW5kKSAtIHdyYXBPZmZzZXQ7XHJcbiAgICAgICAgICAgdmFsID0gbGJvdW5kICsgdmFsT2Zmc2V0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLy8gYWRkIHRoZSBvZmZzZXQgZnJvbSB6ZXJvIGJhY2sgdG8gdGhlIHZhbHVlXHJcbiAgICAgICB2YWwgLT0gemVyb09mZnNldDtcclxuICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgICBudW1XcmFwczogd3JhcHMsXHJcbiAgICAgICB9O1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2ltcGxlIHV0aWwgdG8gY2xhbXAgYSBudW1iZXIgdG8gYSByYW5nZVxyXG4gICAgKiBAcGFyYW0gcE51bSAtIHRoZSBudW1iZXIgdG8gY2xhbXBcclxuICAgICogQHBhcmFtIHBMb3dlciAtIHRoZSBsb3dlciBib3VuZFxyXG4gICAgKiBAcGFyYW0gcFVwcGVyIC0gdGhlIHVwcGVyIGJvdW5kXHJcbiAgICAqIEByZXR1cm5zIE51bWJlciAtIHRoZSBjbGFtcGVkIG51bWJlclxyXG4gICAgKlxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNsYW1wID0gKHBOdW0sIHBMb3dlciwgcFVwcGVyKSA9PiBNYXRoLm1heChNYXRoLm1pbihwTnVtLCBNYXRoLm1heChwTG93ZXIsIHBVcHBlcikpLCBNYXRoLm1pbihwTG93ZXIsIHBVcHBlcikpO1xuXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLy8gQ29uc3RhbnRzXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBNT0RJRklFRF9TRU1JVE9ORVMgPSBbMSwgMywgNCwgNiwgOCwgMTBdO1xyXG4gICBjb25zdCBUT05FU19NQVggPSAxMTtcclxuICAgY29uc3QgVE9ORVNfTUlOID0gMDtcclxuICAgY29uc3QgT0NUQVZFX01BWCA9IDk7XHJcbiAgIGNvbnN0IE9DVEFWRV9NSU4gPSAwO1xyXG4gICBjb25zdCBERUZBVUxUX09DVEFWRSA9IDQ7XHJcbiAgIGNvbnN0IERFRkFVTFRfU0VNSVRPTkUgPSAwO1xuXG4gICAvKipcclxuICAgICogTWFwcyBub3RlIGFsdGVyYXRpb25zIHRvICB0aGVpciByZWxhdGl2ZSBtYXRobWF0aWNhbCB2YWx1ZVxyXG4gICAgKkBlbnVtXHJcbiAgICAqL1xyXG4gICB2YXIgTW9kaWZpZXI7XHJcbiAgIChmdW5jdGlvbiAoTW9kaWZpZXIpIHtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiRkxBVFwiXSA9IC0xXSA9IFwiRkxBVFwiO1xyXG4gICAgICAgTW9kaWZpZXJbTW9kaWZpZXJbXCJOQVRVUkFMXCJdID0gMF0gPSBcIk5BVFVSQUxcIjtcclxuICAgICAgIE1vZGlmaWVyW01vZGlmaWVyW1wiU0hBUlBcIl0gPSAxXSA9IFwiU0hBUlBcIjtcclxuICAgfSkoTW9kaWZpZXIgfHwgKE1vZGlmaWVyID0ge30pKTtcclxuICAgLyoqXHJcbiAgICAqIFBhcnNlcyBtb2RpZmllciBmcm9tIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgZW51bSB2YWx1ZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlTW9kaWZpZXIgPSAobW9kaWZpZXIpID0+IHtcclxuICAgICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgICAgICBjYXNlIFwiYlwiOlxyXG4gICAgICAgICAgIGNhc2UgXCJmbGF0XCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5GTEFUO1xyXG4gICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgY2FzZSBcInNcIjpcclxuICAgICAgICAgICBjYXNlIFwic2hhcnBcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyLlNIQVJQO1xyXG4gICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBNb2RpZmllci5OQVRVUkFMO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICB2YXIgTW9kaWZpZXIkMSA9IE1vZGlmaWVyO1xuXG4gICAvLyBpbXBvcnQgeyByZWdpc3RlckluaXRpYWxpemVyIH0gZnJvbSBcIi4uL0luaXRpYWxpemVyL0luaXRpYWxpemVyXCI7XHJcbiAgIC8vIGltcG9ydCB0YWJsZSBmcm9tIFwiLi9ub3RlTG9va3VwLmpzb25cIjtcclxuICAgLy8gaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgLyoqXHJcbiAgICAqIFJlZ2V4IGZvciBtYXRjaGluZyBub3RlIG5hbWUsIG1vZGlmaWVyLCBhbmQgb2N0YXZlXHJcbiAgICAqL1xyXG4gICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgY29uc3QgbmFtZVJlZ2V4JDIgPSAvKFtBLUddKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4JDIgPSAvKCN8c3xiKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCQyID0gLyhbMC05XSspL2c7XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogYXR0ZW1wdHMgdG8gcGFyc2UgYSBub3RlIGZyb20gYSBzdHJpbmdcclxuICAgICovXHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBjb25zdCBwYXJzZU5vdGUgPSAobm90ZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBub3RlTG9va3VwKG5vdGUpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKCFzdXByZXNzV2FybmluZylcclxuICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbmVmZmVjaWVudCBub3RlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtub3RlfS4gR2V0IGEgcGVyZm9ybWFuY2UgaW5jcmVhc2UgYnkgdXNpbmcgdGhlIGZvcm1hdCBbQS1HXVsjfHN8Yl1bMC05XSBhbmQgdXNpbmcgYnVpbGRUYWJsZXMgbWV0aG9kKHNlZSBkb2N1bWVudGF0aW9uKWApO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgIGlmICghc3VwcmVzc1dhcm5pbmcpXHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5lZmZlY2llbnQgbm90ZSBzdHJpbmcgZm9ybWF0dGluZyAtICR7bm90ZX0uIEdldCBhIHBlcmZvcm1hbmNlIGluY3JlYXNlIGJ5IHVzaW5nIHRoZSBmb3JtYXQgW0EtR11bI3xzfGJdWzAtOV0gYW5kIHVzaW5nIGJ1aWxkVGFibGVzIG1ldGhvZChzZWUgZG9jdW1lbnRhdGlvbilgKTtcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgY29uc3QgbmFtZU1hdGNoID0gbm90ZS5tYXRjaChuYW1lUmVnZXgkMik/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gbm90ZS5tYXRjaChtb2RpZmllclJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgY29uc3Qgb2N0YXZlTWF0Y2ggPSBub3RlLm1hdGNoKG9jdGF2ZVJlZ2V4JDIpPy5qb2luKFwiXCIpLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzXHJcbiAgICAgICBpZiAobW9kaWZpZXJNYXRjaCkge1xyXG4gICAgICAgICAgIGlmIChtb2RpZmllck1hdGNoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29tYmluZSBhbGwgbW9kaWZpZXJzIGludG8gYW4gb2ZmZXNldCB2YWx1ZSB0byBiZSBhZGRlZCB0byB0aGUgc2VtaXRvbmVcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gbW9kaWZpZXJNYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VNb2RpZmllcihpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IHBhcnNlTW9kaWZpZXIobW9kaWZpZXJNYXRjaFswXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG9jdGF2ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW29jdGF2ZV0gPSBvY3RhdmVNYXRjaDtcclxuICAgICAgICAgICBub3RlT2N0YXZlID0gb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKG5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtub3RlTmFtZV0gPSBuYW1lTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZUlkZW5pZmllciA9IG5vdGVOYW1lO1xyXG4gICAgICAgICAgIGxldCBtb2RpZmllciA9IDA7XHJcbiAgICAgICAgICAgaWYgKG5vdGVNb2RpZmllcilcclxuICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBub3RlTW9kaWZpZXI7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRvbmUgPSB3cmFwKGdldFdob2xlVG9uZUZyb21OYW1lKG5vdGVJZGVuaWZpZXIpICsgbW9kaWZpZXIsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICBjb25zdCBzZW1pdG9uZSA9IHdyYXBwZWRUb25lLnZhbHVlO1xyXG4gICAgICAgICAgIGxldCBvY3RhdmUgPSA0O1xyXG4gICAgICAgICAgIGlmIChub3RlT2N0YXZlKVxyXG4gICAgICAgICAgICAgICBvY3RhdmUgPSBjbGFtcChwYXJzZUludChub3RlT2N0YXZlLCAxMCksIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgIH1cclxuICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBub3RlOiAke25vdGV9YCk7XHJcbiAgIH07XHJcbiAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKi9cclxuICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDQgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBub3RlVGFibGUgPSB7fTtcclxuICAgICAgIGNvbnN0IG5vdGVMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiXTtcclxuICAgICAgIGNvbnN0IG5vdGVNb2RpZmllcnMgPSBbXCJiXCIsIFwiI1wiLCBcInNcIl07XHJcbiAgICAgICBmb3IgKGNvbnN0IG5vdGVMYWJlbCBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgIG5vdGVUYWJsZVtub3RlTGFiZWxdID0gcGFyc2VOb3RlKG5vdGVMYWJlbCwgdHJ1ZSk7IC8vICdDJyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgIGZvciAobGV0IGlNb2RpZmllck91dGVyID0gMDsgaU1vZGlmaWVyT3V0ZXIgPCBub3RlTW9kaWZpZXJzLmxlbmd0aDsgKytpTW9kaWZpZXJPdXRlcikge1xyXG4gICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtub3RlTGFiZWx9JHtub3RlTW9kaWZpZXJzW2lNb2RpZmllck91dGVyXX1gO1xyXG4gICAgICAgICAgICAgICBub3RlVGFibGVba2V5XSA9IHBhcnNlTm90ZShrZXksIHRydWUpOyAvLyAnQyMnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDwgT0NUQVZFX01BWDsgKytpT2N0YXZlKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke2lPY3RhdmV9YDtcclxuICAgICAgICAgICAgICAgbm90ZVRhYmxlW2tleV0gPSBwYXJzZU5vdGUoa2V5LCB0cnVlKTsgLy8gJ0M0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICBmb3IgKGxldCBpTW9kaWZpZXIgPSAwOyBpTW9kaWZpZXIgPCBub3RlTW9kaWZpZXJzLmxlbmd0aDsgKytpTW9kaWZpZXIpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke25vdGVNb2RpZmllcnNbaU1vZGlmaWVyXX0ke2lPY3RhdmV9YDtcclxuICAgICAgICAgICAgICAgICAgIG5vdGVUYWJsZVtrZXldID0gcGFyc2VOb3RlKGtleSwgdHJ1ZSk7IC8vICdDIzQnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gbm90ZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogVGhlIGxvb2t1cCB0YWJsZVxyXG4gICAgKi9cclxuICAgbGV0IF9ub3RlTG9va3VwID0ge307XHJcbiAgIGNvbnN0IG5vdGVMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZE5vdGVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfbm90ZUxvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkTm90ZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgX25vdGVMb29rdXAgPSBjcmVhdGVUYWJsZSQ0KCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3RlTG9va3VwKTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbHQgbm90ZSB0YWJsZVwiKTtcclxuICAgICAgIHJldHVybiBfbm90ZUxvb2t1cDtcclxuICAgfTtcblxuICAgLy8gaW1wb3J0IHsgcmVnaXN0ZXJJbml0aWFsaXplciB9IGZyb20gXCIuLi9Jbml0aWFsaXplci9Jbml0aWFsaXplclwiO1xyXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZVN0cmluZ0xvb2t1cC5qc29uXCI7XHJcbiAgIGNvbnN0IFVOS05PV05fTU9ESUZJRVJfTk9URV9TVFJJTkdTID0gW1xyXG4gICAgICAgXCJDXCIsXHJcbiAgICAgICBcIkMjL0RiXCIsXHJcbiAgICAgICBcIkRcIixcclxuICAgICAgIFwiRCMvRWJcIixcclxuICAgICAgIFwiRVwiLFxyXG4gICAgICAgXCJGXCIsXHJcbiAgICAgICBcIkYjL0diXCIsXHJcbiAgICAgICBcIkdcIixcclxuICAgICAgIFwiRyMvQWJcIixcclxuICAgICAgIFwiQVwiLFxyXG4gICAgICAgXCJBIy9CYlwiLFxyXG4gICAgICAgXCJCXCIsXHJcbiAgIF07XHJcbiAgIGNvbnN0IFNIQVJQX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJDI1wiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkQjXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJGI1wiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkcjXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQSNcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBGTEFUX01PRElGSUVSX05PVEVfU1RSSU5HUyA9IFtcclxuICAgICAgIFwiQ1wiLFxyXG4gICAgICAgXCJEYlwiLFxyXG4gICAgICAgXCJEXCIsXHJcbiAgICAgICBcIkViXCIsXHJcbiAgICAgICBcIkVcIixcclxuICAgICAgIFwiRlwiLFxyXG4gICAgICAgXCJHYlwiLFxyXG4gICAgICAgXCJHXCIsXHJcbiAgICAgICBcIkFiXCIsXHJcbiAgICAgICBcIkFcIixcclxuICAgICAgIFwiQmJcIixcclxuICAgICAgIFwiQlwiLFxyXG4gICBdO1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQzID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGZvciAobGV0IGlUb25lID0gVE9ORVNfTUlOOyBpVG9uZSA8PSBUT05FU19NQVg7ICsraVRvbmUpIHtcclxuICAgICAgICAgICBmb3IgKGxldCBpUHJldiA9IFRPTkVTX01JTjsgaVByZXYgPD0gVE9ORVNfTUFYOyArK2lQcmV2KSB7XHJcbiAgICAgICAgICAgICAgIC8vIGZvciAobGV0IGlPY3RhdmUgPSBPQ1RBVkVfTUlOOyBpT2N0YXZlIDw9IE9DVEFWRV9NQVg7IGlPY3RhdmUrKykge1xyXG4gICAgICAgICAgICAgICBsZXQgbW9kaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICBpZiAoTU9ESUZJRURfU0VNSVRPTkVTLmluY2x1ZGVzKGlUb25lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgbW9kaWZpZXIgPSBcIi1cIjsgLy8gaGFzIGFuIHVua25vd24gbW9kaWZpZXJcclxuICAgICAgICAgICAgICAgICAgIC8vIGlmIGlzIGZsYXRcclxuICAgICAgICAgICAgICAgICAgIGlmICh3cmFwKGlUb25lICsgMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PSBpUHJldilcclxuICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gaXMgc2hhcnBcclxuICAgICAgICAgICAgICAgICAgIGlmICh3cmFwKGlUb25lIC0gMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PSBpUHJldilcclxuICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllciA9IFwiI1wiO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIC8vIGdldCBub3RlIG5hbWUgZnJvbSB0YWJsZVxyXG4gICAgICAgICAgICAgICB0YWJsZVtgJHtpVG9uZX0tJHtpUHJldn1gXSA9IGdldE5vdGVMYWJlbChpVG9uZSwgbW9kaWZpZXIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgIH07XHJcbiAgIGNvbnN0IGdldE5vdGVMYWJlbCA9ICh0b25lLCBtb2RpZmllcikgPT4ge1xyXG4gICAgICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICAgICAgIGNhc2UgXCIjXCI6XHJcbiAgICAgICAgICAgICAgIHJldHVybiBTSEFSUF9OT1RFX1NUUklOR1NbdG9uZV07XHJcbiAgICAgICAgICAgY2FzZSBcImJcIjpcclxuICAgICAgICAgICAgICAgcmV0dXJuIEZMQVRfTU9ESUZJRVJfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgICAgIGNhc2UgXCItXCI6XHJcbiAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgcmV0dXJuIFVOS05PV05fTU9ESUZJRVJfTk9URV9TVFJJTkdTW3RvbmVdO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICBsZXQgX25vdGVTdHJpbmdMb29rdXAgPSB7fTtcclxuICAgY29uc3Qgbm90ZVN0cmluZ0xvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkTm90ZVN0cmluZ1RhYmxlKCk7XHJcbiAgICAgICBpZiAoT2JqZWN0LmtleXMoX25vdGVTdHJpbmdMb29rdXApLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9ub3RlU3RyaW5nTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIHJlZ2lzdGVySW5pdGlhbGl6ZXIoKCkgPT4ge1xyXG4gICAvLyAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25vdGVTdHJpbmdMb29rdXAgPSBjcmVhdGVUYWJsZSgpO1xyXG4gICAvLyB9XHJcbiAgIGNvbnN0IGJ1aWxkTm90ZVN0cmluZ1RhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5rZXlzKF9ub3RlU3RyaW5nTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX25vdGVTdHJpbmdMb29rdXA7XHJcbiAgICAgICBfbm90ZVN0cmluZ0xvb2t1cCA9IGNyZWF0ZVRhYmxlJDMoKTtcclxuICAgICAgIE9iamVjdC5mcmVlemUoX25vdGVTdHJpbmdMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJOb3RlIHN0cmluZyB0YWJsZSBidWlsdC5cIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVTdHJpbmdMb29rdXA7XHJcbiAgIH07XG5cbiAgIHZhciBJRFg9MjU2LCBIRVg9W10sIFNJWkU9MjU2LCBCVUZGRVI7XG4gICB3aGlsZSAoSURYLS0pIEhFWFtJRFhdID0gKElEWCArIDI1NikudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcblxuICAgZnVuY3Rpb24gdWlkKGxlbikge1xuICAgXHR2YXIgaT0wLCB0bXA9KGxlbiB8fCAxMSk7XG4gICBcdGlmICghQlVGRkVSIHx8ICgoSURYICsgdG1wKSA+IFNJWkUqMikpIHtcbiAgIFx0XHRmb3IgKEJVRkZFUj0nJyxJRFg9MDsgaSA8IFNJWkU7IGkrKykge1xuICAgXHRcdFx0QlVGRkVSICs9IEhFWFtNYXRoLnJhbmRvbSgpICogMjU2IHwgMF07XG4gICBcdFx0fVxuICAgXHR9XG5cbiAgIFx0cmV0dXJuIEJVRkZFUi5zdWJzdHJpbmcoSURYLCBJRFgrKyArIHRtcCk7XG4gICB9XG5cbiAgIC8vIGltcG9ydCBJZGVudGlmaWFibGUgZnJvbSBcIi4uL2NvbXBvc2FibGVzL0lkZW50aWZpYWJsZVwiO1xyXG4gICAvKipcclxuICAgICogQSBub3RlIGNvbnNpc3Qgb2YgYSBzZW1pdG9uZSBhbmQgYW4gb2N0YXZlLjxicj5cclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHsgTm90ZUluaXRpYWxpemVyIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjsgLy8gdHlwZXNjcmlwdCBvbmx5IGlmIG5lZWRlZFxyXG4gICAgKiBgYGBcclxuICAgICovXHJcbiAgIGNsYXNzIE5vdGUge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHsgTm90ZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIG5ldyBub3RlIHdpdGggZGVmYXVsdCB2YWx1ZXMgc2VtaXRvbmUgMChDKSBhbmQgb2N0YXZlIDRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBuZXcgbm90ZSB1c2luZyBhbiBpbml0aWFsaXplciBvYmplY3RcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7c2VtaXRvbmU6IDQsIG9jdGF2ZTogNX0pO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIFN0cmluZyBwYXJzaW5nIHNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDogbm90ZS1uYW1lW21vZGlmaWVyXVtvY3RhdmVdXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgbmV3IG5vdGUgdXNpbmcgYSBzdHJpbmdcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZShcIkM1XCIpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc2VtaXRvbmUgPSBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlcyA9IHBhcnNlTm90ZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcz8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdmFsdWVzPy5zZW1pdG9uZSA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRoYXQgb2N0YXZlIGlzIHNldCBmaXJzdCBzbyB0aGF0XHJcbiAgICAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIHNlbWl0b25lIGNhbiBjaGFuZ2UgdGhlIG9jdGF2ZVxyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcz8ub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdmFsdWVzPy5zZW1pdG9uZSA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUgPSB0aGlzLl90b25lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogIHVuaXF1ZSBpZCBmb3IgdGhpcyBub3RlKGF1dG8gZ2VuZXJhdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pZCk7IC8vIHMyODk4c25sb2pcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzZW1pdG9uZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfdG9uZSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICBfcHJldlNlbWl0b25lID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDBcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgc2VtaXRvbmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvbmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNldHRpbmcgdGhlIHNlbWl0b25lIHdpdGggYSBudW1iZXIgb3V0c2lkZSB0aGVcclxuICAgICAgICAqIHJhbmdlIG9mIDAtMTEgd2lsbCB3cmFwIHRoZSB2YWx1ZSBhcm91bmQgYW5kXHJcbiAgICAgICAgKiBjaGFuZ2UgdGhlIG9jdGF2ZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogbm90ZS5zZW1pdG9uZSA9IDQ7Ly8gRVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDQoRSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgc2VtaXRvbmUoc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcChzZW1pdG9uZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX3ByZXZTZW1pdG9uZSA9IHRoaXMuX3RvbmU7XHJcbiAgICAgICAgICAgdGhpcy5fdG9uZSA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gdGhpcy5fb2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5vY3RhdmUpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgb2N0YXZlIGlzIGNsYW1wZWQgdG8gdGhlIHJhbmdlIFswLCA5XS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTtcclxuICAgICAgICAqIG5vdGUub2N0YXZlID0gMTA7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLm9jdGF2ZSk7IC8vIDkoYmVjYXVzZSBvZiBjbGFtcGluZylcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKG9jdGF2ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKG9jdGF2ZSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgbmV3IG5vdGUgdGhhdCBpcyBhIHNoYXJwZW5lZCB2ZXJzaW9uIG9mIHRoaXMgbm90ZS5cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuc2hhcnAoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUyLnNlbWl0b25lKTsgLy8gMShDIylcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGFycCgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KS5zaGFycGVuKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNoYXJwZW5zIHRoZSBub3RlIGluIHBsYWNlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIG5vdGUuc2hhcnBlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDEoQyMpXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoYXJwZW4oKSB7XHJcbiAgICAgICAgICAgdGhpcy5zZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmUgKyAxO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgYXR0ZW1wdHMgdG8gZGV0ZXJtaW5lIGlmIHRoZSBub3RlIGlzIHNoYXJwXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBub3RlIGlzIHNoYXJwXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc1NoYXJwKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogbm90ZS5zaGFycGVuKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmlzU2hhcnAoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc1NoYXJwKCkge1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgd2hvbGUsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXModGhpcy5zZW1pdG9uZSk7XHJcbiAgICAgICAgICAgaWYgKCFtb2RpZmllZClcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgZmxhdCwgaXQgY2FuJ3QgYmUgc2hhcnBcclxuICAgICAgICAgICBpZiAod3JhcCh0aGlzLnNlbWl0b25lICsgMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PVxyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9pcyBmbGF0XHJcbiAgICAgICAgICAgLy8gRG9lc24ndCBuZWNjZWNhcmlseSBtZWFuIGl0J3Mgc2hhcnAsIGJ1dCBpdCdzIGEgZ29vZCBndWVzcyBhdCB0aGlzIHBvaW50XHJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgZmxhdHRlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgbm90ZSB0aGF0IGlzIGEgZmxhdHRlbmVkIHZlcnNpb24gb2YgdGhpcyBub3RlLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpOyAvLyBkZWZhdWx0IHNlbWl0b25lIGlzIDAoQylcclxuICAgICAgICAqIGNvbnN0IG5vdGUyID0gbm90ZS5mbGF0KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlMi5zZW1pdG9uZSk7IC8vIDMoRWIpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZmxhdCgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICBzZW1pdG9uZTogdGhpcy5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KS5mbGF0dGVuKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEZsYXR0ZW5zIHRoZSBub3RlIGluIHBsYWNlLlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSh7c2VtaXRvbmU6IDR9KTsgLy8gIHNlbWl0b25lIGlzIDQoRSlcclxuICAgICAgICAqIG5vdGUuZmxhdHRlbigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5zZW1pdG9uZSk7IC8vIDMoRWIpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZmxhdHRlbigpIHtcclxuICAgICAgICAgICB0aGlzLnNlbWl0b25lID0gdGhpcy5zZW1pdG9uZSAtIDE7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBhdHRlbXB0cyB0byBkZXRlcm1pbmUgaWYgdGhlIG5vdGUgaXMgZmxhdFxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbm90ZSBpcyBmbGF0XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7IC8vIGRlZmF1bHQgc2VtaXRvbmUgaXMgMChDKVxyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5pc0ZsYXQoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBub3RlLmZsYXR0ZW4oKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUuaXNGbGF0KCkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaXNGbGF0KCkge1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgd2hvbGUsIGl0IGNhbid0IGJlIHNoYXJwXHJcbiAgICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBNT0RJRklFRF9TRU1JVE9ORVMuaW5jbHVkZXModGhpcy5zZW1pdG9uZSk7XHJcbiAgICAgICAgICAgaWYgKCFtb2RpZmllZClcclxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgIC8vIGlmIG5vdGUgaXMgc2hhcnAsIGl0IGNhbid0IGJlIGZsYXRcclxuICAgICAgICAgICBpZiAod3JhcCh0aGlzLnNlbWl0b25lIC0gMSwgVE9ORVNfTUlOLCBUT05FU19NQVgpLnZhbHVlID09PVxyXG4gICAgICAgICAgICAgICB0aGlzLl9wcmV2U2VtaXRvbmUpXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9pcyBzaGFycFxyXG4gICAgICAgICAgIC8vIERvZXNuJ3QgbmVjY2VjYXJpbHkgbWVhbiBpdCdzIGZsYXQsIGJ1dCBpdCdzIGEgZ29vZCBndWVzcyBhdCB0aGlzIHBvaW50XHJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhpcyBub3RlIGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBub3RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgbm90ZSA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5ldyBOb3RlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLmVxdWFscyhub3RlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5zZW1pdG9uZSA9PT0gbm90ZS5zZW1pdG9uZSAmJiB0aGlzLm9jdGF2ZSA9PT0gbm90ZS5vY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zdCBub3RlMiA9IG5vdGUuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2cobm90ZS5lcXVhbHMobm90ZTIpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvcHkoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RlKHtcclxuICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRoaXMuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdmVyc2lvbiBvZiB0aGlzIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBub3RlID0gbmV3IE5vdGUoKTsgLy8gZGVmYXVsdCBzZW1pdG9uZSBpcyAwKEMpXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhub3RlLnRvU3RyaW5nKCkpOyAvLyBDNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKlxyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlU3RyaW5nTG9va3VwKTtcclxuICAgICAgICAgICByZXR1cm4gKG5vdGVTdHJpbmdMb29rdXAoYCR7dGhpcy5fdG9uZX0tJHt0aGlzLl9wcmV2U2VtaXRvbmV9YCkgK1xyXG4gICAgICAgICAgICAgICBgJHt0aGlzLl9vY3RhdmV9YCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFN0YXRpYyBtZXRob2RzIHRvIGNyZWF0ZSB3aG9sZSBub3RlcyBlYXNpbHkuXHJcbiAgICAgICAgKiB0aGUgZGVmYXVsdCBvY3RhdmUgaXMgNFxyXG4gICAgICAgICovXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEFbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkEoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEE0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEEob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkEsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEJbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkIoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEI0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEIob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkIsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIENbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkMoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEM0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEMob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkMsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIERbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEQ0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEQob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkQsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEVbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEU0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEUob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEZbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkYoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEY0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEYob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkYsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICAqIEBwYXJhbSBvY3RhdmVcclxuICAgICAgICAqIEByZXR1cm5zIG5vdGUgc2V0IHRvIEdbb2N0YXZlXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IG5vdGUgPSBOb3RlLkcoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKG5vdGUudG9TdHJpbmcoKSk7IC8vIEc0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc3RhdGljIEcob2N0YXZlID0gNCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgTm90ZSh7XHJcbiAgICAgICAgICAgICAgIHNlbWl0b25lOiBTZW1pdG9uZSQxLkcsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgfVxuXG4gICAvKipcclxuICAgICogQ29uc3RhbnRzXHJcbiAgICAqL1xyXG4gICBjb25zdCBNSURJS0VZX1NUQVJUID0gMTI7XHJcbiAgIGNvbnN0IE5VTV9PQ1RBVkVTID0gMTA7XHJcbiAgIGNvbnN0IE5VTV9TRU1JVE9ORVMgPSAxMjtcclxuICAgLyoqXHJcbiAgICAqIENhbGN1bGF0ZXMgdGhlIG1pZGkga2V5IGZvciBhIGdpdmVuIG9jdGF2ZSBhbmQgc2VtaXRvbmUuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjYWxjTWlkaUtleSA9IChvY3RhdmUsIHNlbWl0b25lKSA9PiBNSURJS0VZX1NUQVJUICsgb2N0YXZlICogTlVNX1NFTUlUT05FUyArIHNlbWl0b25lO1xyXG4gICAvKipcclxuICAgICogQ2FsY3VsYXRlcyB0aGUgZnJlcXVlbmN5IGZvciBhIGdpdmVuIG9jdGF2ZSBhbmQgc2VtaXRvbmUgZ2l2ZW5cclxuICAgICogYSB0dW5pbmcgZm9yIGE0LlxyXG4gICAgKi9cclxuICAgY29uc3QgY2FsY0ZyZXF1ZW5jeSA9IChtaWRpS2V5LCBhNFR1bmluZykgPT4gMiAqKiAoKG1pZGlLZXkgLSA2OSkgLyAxMikgKiBhNFR1bmluZztcclxuICAgLyoqXHJcbiAgICAqIENyZWF0ZXMgYW5kIHJldHVybiBsb29rdXAgdGFibGVzIGZvciBtaWRpa2V5IGFuZCBmcmVxdWVuY3kuXHJcbiAgICAqL1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZXMgPSAoYTRUdW5pbmcgPSA0NDApID0+IHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTWFwcyBvY3RhdmUgYW5kIHNlbWl0b25lIHRvIG5vdGUgZnJlcXVlbmN5KGhlcnR6KS5cclxuICAgICAgICAqIHJlcXVpcmVzIGEga2V5IGluIHRoZSBmb3JtIG9mIGA8b2N0YXZlPi08c2VtaXRvbmU+YFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdCBmcmVxVGFibGUgPSB7fTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTWFwcyBvY3RhdmUgYW5kIHNlbWl0b25lIHRvIG1pZGkga2V5LlxyXG4gICAgICAgICogcmVxdWlyZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2YgYDxvY3RhdmU+LTxzZW1pdG9uZT5gXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0IG1pZGlUYWJsZSA9IHt9O1xyXG4gICAgICAgbGV0IGlPY3RhdmUgPSAwO1xyXG4gICAgICAgbGV0IGlTZW1pdG9uZSA9IDA7XHJcbiAgICAgICBmb3IgKGlPY3RhdmUgPSAwOyBpT2N0YXZlIDwgTlVNX09DVEFWRVM7ICsraU9jdGF2ZSkge1xyXG4gICAgICAgICAgIGZvciAoaVNlbWl0b25lID0gMDsgaVNlbWl0b25lIDwgTlVNX1NFTUlUT05FUzsgKytpU2VtaXRvbmUpIHtcclxuICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYCR7aU9jdGF2ZX0tJHtpU2VtaXRvbmV9YDtcclxuICAgICAgICAgICAgICAgY29uc3QgbWtleSA9IGNhbGNNaWRpS2V5KGlPY3RhdmUsIGlTZW1pdG9uZSk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGZyZXEgPSBjYWxjRnJlcXVlbmN5KG1rZXksIGE0VHVuaW5nKTtcclxuICAgICAgICAgICAgICAgbWlkaVRhYmxlW2tleV0gPSBta2V5O1xyXG4gICAgICAgICAgICAgICBmcmVxVGFibGVba2V5XSA9IGZyZXE7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICBmcmVxTG9va3VwOiBmcmVxVGFibGUsXHJcbiAgICAgICAgICAgbWlkaUxvb2t1cDogbWlkaVRhYmxlLFxyXG4gICAgICAgfTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIFR1bmluZyBjb21wb25lbnQgdXNlZCBieSBJbnN0cnVtZW50IGNsYXNzPGJyPlxyXG4gICAgKiBjb250YWluZXMgdGhlIGE0IHR1bmluZyAtIGRlZmF1bHQgaXMgNDQwSHo8YnI+XHJcbiAgICAqIGJ1aWxkcyBsb29rdXAgdGFibGVzIGZvciBtaWRpIGtleSBhbmQgZnJlcXVlbmN5PGJyPlxyXG4gICAgKiBiYXNlZCBvbiB0aGUgdHVuaW5nXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY2xhc3MgVHVuaW5nIHtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQ3JlYXRlcyB0aGUgb2JqZWN0IGFuZCBidWlsZHMgdGhlIGxvb2t1cCB0YWJsZXMuXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKGE0RnJlcSA9IDQ0MCkge1xyXG4gICAgICAgICAgIHRoaXMuX2E0ID0gYTRGcmVxO1xyXG4gICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZXMoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5pcXVlIGlkIGZvciB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlkID0gdWlkKCk7XHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIHJldHVybiBuZXcgVHVuaW5nKHRoaXMuX2E0KTtcclxuICAgICAgIH1cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9hNCA9PT0gb3RoZXIuX2E0O1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBhNCBUdW5pbmdcclxuICAgICAgICAqL1xyXG4gICAgICAgX2E0ID0gNDQwO1xyXG4gICAgICAgZ2V0IGE0KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9hNDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogc2V0dGluZyB0aGUgdHVuaW5nIHdpbGwgcmVidWlsZCB0aGUgbG9va3VwIHRhYmxlc1xyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgYTQodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl9hNCA9IHZhbHVlO1xyXG4gICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZXMoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbG9va3VwIHRhYmxlIGZvciBtaWRpIGtleVxyXG4gICAgICAgICovXHJcbiAgICAgICBfbWlkaUtleVRhYmxlID0ge307XHJcbiAgICAgICBtaWRpS2V5TG9va3VwKG9jdGF2ZSwgc2VtaXRvbmUpIHtcclxuICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtvY3RhdmV9LSR7c2VtaXRvbmV9YDtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbWlkaUtleVRhYmxlW2tleV07XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGxvb2t1cCB0YWJsZSBmb3IgZnJlcXVlbmN5XHJcbiAgICAgICAgKi9cclxuICAgICAgIF9mcmVxVGFibGUgPSB7fTtcclxuICAgICAgIGZyZXFMb29rdXAob2N0YXZlLCBzZW1pdG9uZSkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke29jdGF2ZX0tJHtzZW1pdG9uZX1gO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVxVGFibGVba2V5XTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQnVpbGRzIHRoZSBsb29rdXAgdGFibGVzIGZvciBtaWRpIGtleSBhbmQgZnJlcXVlbmN5XHJcbiAgICAgICAgKi9cclxuICAgICAgIGJ1aWxkVGFibGVzKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHRhYmxlcyA9IGNyZWF0ZVRhYmxlcyh0aGlzLl9hNCk7XHJcbiAgICAgICAgICAgdGhpcy5fbWlkaUtleVRhYmxlID0gdGFibGVzLm1pZGlMb29rdXA7XHJcbiAgICAgICAgICAgdGhpcy5fZnJlcVRhYmxlID0gdGFibGVzLmZyZXFMb29rdXA7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgdGhlIHR1bmluZyBhcyBhIHN0cmluZ1xyXG4gICAgICAgICovXHJcbiAgICAgICB0b1N0cmluZygpIHtcclxuICAgICAgICAgICByZXR1cm4gYFR1bmluZygke3RoaXMuX2E0fSlgO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIC8qKlxyXG4gICAgKiBJbnN0cnVtZW50IGFyZSB1c2VkIHRvIGVuY2Fwc3VsYXRlIHRoZSB0dW5pbmcgYW5kIHJldHJpZXZpbmcgb2YgbWlkaSBrZXlzXHJcbiAgICAqIGFuZCBmcmVxdWVuY2llcyBmb3Igbm90ZXNcclxuICAgICpcclxuICAgICogQGV4YW1wbGVcclxuICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgKiBpbXBvcnQgeyBJbnN0cnVtZW50IH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICovXHJcbiAgIGNsYXNzIEluc3RydW1lbnQge1xyXG4gICAgICAgdHVuaW5nO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gdHVuaW5nIEE0IGZyZXF1ZW5jeSAtIGRlZmF1bHRzIHRvIDQ0MFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpOyAvLyBkZWZhdWx0IDQ0MCB0dW5pbmdcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3RvcihhNEZyZXEgPSA0NDApIHtcclxuICAgICAgICAgICB0aGlzLnR1bmluZyA9IG5ldyBUdW5pbmcoYTRGcmVxKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgYSB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuaWQ7IC8vIHJldHVybnMgYSB1bmlxdWUgaWRcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBpbnN0YW5jZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGluc3RydW1lbnQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coaW5zdHJ1bWVudC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IEluc3RydW1lbnQodGhpcy50dW5pbmcuYTQpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcGFyYW0gb3RoZXIgdGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlXHJcbiAgICAgICAgKiBAcmV0dXJucyAgdHJ1ZSBpZiB0aGUgb3RoZXIgb2JqZWN0IGlzIGVxdWFsIHRvIHRoaXMgb25lXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gaW5zdHJ1bWVudC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LmVxdWFscyhjb3B5KSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcuZXF1YWxzKG90aGVyLnR1bmluZyk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBmcmVxdWVuY3kgb2YgdGhlIGdpdmVuIG5vdGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQoKTtcclxuICAgICAgICAqIGluc3RydW1lbnQuZ2V0RnJlcXVlbmN5KG5ldyBOb3RlKFwiQzRcIikpOyAvLyByZXR1cm5zIDI2MS42MjU1NjUzMDA1OTg2XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0RnJlcXVlbmN5KG5vdGUpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy50dW5pbmcuZnJlcUxvb2t1cChub3RlLm9jdGF2ZSwgbm90ZS5zZW1pdG9uZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBtaWRpIGtleSBvZiB0aGUgZ2l2ZW4gbm90ZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xyXG4gICAgICAgICogaW5zdHJ1bWVudC5nZXRNaWRpS2V5KG5ldyBOb3RlKFwiQzRcIikpOyAvLyByZXR1cm5zIDYwXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0TWlkaUtleShub3RlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMudHVuaW5nLm1pZGlLZXlMb29rdXAobm90ZS5vY3RhdmUsIG5vdGUuc2VtaXRvbmUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgdHVuaW5nIGFzIGEgc3RyaW5nXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhpbnN0cnVtZW50LnRvU3RyaW5nKCkpOyAvLyByZXR1cm5zIFwiSW5zdHJ1bWVudCBUdW5pbmcoNDQwKVwiXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGBJbnN0cnVtZW50IFR1bmluZygke3RoaXMudHVuaW5nLmE0fSlgO1xyXG4gICAgICAgfVxyXG4gICB9XG5cbiAgIGNvbnN0IERFRkFVTFRfU0NBTEVfVEVNUExBVEUgPSBbMCwgMiwgMiwgMSwgMiwgMiwgMl07IC8vIG1ham9yXHJcbiAgIE9iamVjdC5mcmVlemUoREVGQVVMVF9TQ0FMRV9URU1QTEFURSk7XG5cbiAgIC8qKlxyXG4gICAgKiBNYXBzIHByZWRlZmluZWQgc2NhbGVzIHRvIHRoZWlyIG5hbWVzLlxyXG4gICAgKi9cclxuICAgY29uc3QgU2NhbGVUZW1wbGF0ZXMgPSB7XHJcbiAgICAgICB3aG9sZVRvbmU6IFswLCAyLCAyLCAyLCAyLCAyLCAyXSxcclxuICAgICAgIC8vIG1ham9yXHJcbiAgICAgICBtYWpvcjogWzAsIDIsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgbWFqb3I3czRzNTogWzAsIDIsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgLy8gbW9kZXNcclxuICAgICAgIC8vIGlvbmlhbjogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbWFqb3JcclxuICAgICAgIC8vIGFlb2xpYW46IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1pbm9yXHJcbiAgICAgICBkb3JpYW46IFswLCAyLCAxLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIHBocnlnaWFuOiBbMCwgMSwgMiwgMiwgMiwgMSwgMl0sXHJcbiAgICAgICBseWRpYW46IFswLCAyLCAyLCAyLCAxLCAyLCAyXSxcclxuICAgICAgIGx5ZGlhbkRvbWluYW50OiBbMCwgMiwgMiwgMiwgMSwgMiwgMV0sXHJcbiAgICAgICAvLyBhY291c3RpYzogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgbHlkaWFuRG9taW5hbnRcclxuICAgICAgIG1peG9seWRpYW46IFswLCAyLCAyLCAxLCAyLCAyLCAxXSxcclxuICAgICAgIG1peG9seWRpYW5GbGF0NjogWzAsIDIsIDIsIDEsIDIsIDEsIDJdLFxyXG4gICAgICAgbG9jcmlhbjogWzAsIDEsIDIsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgc3VwZXJMb2NyaWFuOiBbMCwgMSwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICAvLyBtaW5vclxyXG4gICAgICAgbWlub3I6IFswLCAyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgIG1pbm9yN2I5OiBbMCwgMSwgMiwgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBtaW5vcjdiNTogWzAsIDIsIDEsIDIsIDEsIDIsIDJdLFxyXG4gICAgICAgLy8gaGFsZkRpbWluaXNoZWQ6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIG1pbm9yN2I1XHJcbiAgICAgICAvLyBoYXJtb25pY1xyXG4gICAgICAgaGFybW9uaWNNYWpvcjogWzAsIDIsIDIsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgaGFybW9uaWNNaW5vcjogWzAsIDIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAgZG91YmxlSGFybW9uaWM6IFswLCAxLCAzLCAxLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIGJ5emFudGluZTogW10sIC8vIHNldCBiZWxvdyAtIHNhbWUgYXMgZG91YmxlSGFybW9uaWNcclxuICAgICAgIC8vIG1lbG9kaWNcclxuICAgICAgIG1lbG9kaWNNaW5vckFzY2VuZGluZzogWzAsIDIsIDEsIDIsIDIsIDIsIDJdLFxyXG4gICAgICAgbWVsb2RpY01pbm9yRGVzY2VuZGluZzogWzAsIDIsIDIsIDEsIDIsIDIsIDFdLFxyXG4gICAgICAgLy8gcGVudGF0b25pY1xyXG4gICAgICAgbWFqb3JQZW50YXRvbmljOiBbMCwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBtYWpvclBlbnRhdG9uaWNCbHVlczogWzAsIDIsIDEsIDEsIDMsIDJdLFxyXG4gICAgICAgbWlub3JQZW50YXRvbmljOiBbMCwgMywgMiwgMiwgM10sXHJcbiAgICAgICBtaW5vclBlbnRhdG9uaWNCbHVlczogWzAsIDMsIDIsIDEsIDEsIDNdLFxyXG4gICAgICAgYjVQZW50YXRvbmljOiBbMCwgMywgMiwgMSwgNCwgMl0sXHJcbiAgICAgICBtaW5vcjZQZW50YXRvbmljOiBbMCwgMywgMiwgMiwgMiwgM10sXHJcbiAgICAgICAvLyBlbmlnbWF0aWNcclxuICAgICAgIGVuaWdtYXRpY01ham9yOiBbMCwgMSwgMywgMiwgMiwgMiwgMV0sXHJcbiAgICAgICBlbmlnbWF0aWNNaW5vcjogWzAsIDEsIDIsIDMsIDEsIDMsIDFdLFxyXG4gICAgICAgLy8gOFRvbmVcclxuICAgICAgIGRpbThUb25lOiBbMCwgMiwgMSwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBkb204VG9uZTogWzAsIDEsIDIsIDEsIDIsIDEsIDIsIDFdLFxyXG4gICAgICAgLy8gbmVhcG9saXRhblxyXG4gICAgICAgbmVhcG9saXRhbk1ham9yOiBbMCwgMSwgMiwgMiwgMiwgMiwgMl0sXHJcbiAgICAgICBuZWFwb2xpdGFuTWlub3I6IFswLCAxLCAyLCAyLCAyLCAxLCAzXSxcclxuICAgICAgIC8vIGh1bmdhcmlhblxyXG4gICAgICAgaHVuZ2FyaWFuTWFqb3I6IFswLCAzLCAxLCAyLCAxLCAyLCAxXSxcclxuICAgICAgIGh1bmdhcmlhbk1pbm9yOiBbMCwgMiwgMSwgMywgMSwgMSwgM10sXHJcbiAgICAgICBodW5nYXJpYW5HeXBzeTogWzAsIDEsIDMsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgLy8gc3BhbmlzaFxyXG4gICAgICAgc3BhbmlzaDogWzAsIDEsIDIsIDEsIDIsIDIsIDJdLFxyXG4gICAgICAgc3BhbmlzaDhUb25lOiBbMCwgMSwgMiwgMSwgMSwgMSwgMiwgMl0sXHJcbiAgICAgICAvLyBqZXdpc2g6IFtdLCAvLyBzZXQgYmVsb3cgLSBzYW1lIGFzIHNwYW5pc2g4VG9uZVxyXG4gICAgICAgc3BhbmlzaEd5cHN5OiBbMCwgMSwgMywgMSwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBhdWcgZG9tXHJcbiAgICAgICBhdWdtZW50ZWQ6IFswLCAzLCAxLCAzLCAxLCAzLCAxXSxcclxuICAgICAgIGRvbWluYW50U3VzcGVuZGVkOiBbMCwgMiwgMywgMiwgMiwgMSwgMl0sXHJcbiAgICAgICAvLyBiZWJvcFxyXG4gICAgICAgYmVib3BNYWpvcjogWzAsIDIsIDIsIDEsIDIsIDEsIDEsIDJdLFxyXG4gICAgICAgYmVib3BEb21pbmFudDogWzAsIDIsIDIsIDEsIDIsIDIsIDEsIDFdLFxyXG4gICAgICAgbXlzdGljOiBbMCwgMiwgMiwgMiwgMywgMl0sXHJcbiAgICAgICBvdmVydG9uZTogWzAsIDIsIDIsIDIsIDEsIDEsIDJdLFxyXG4gICAgICAgbGVhZGluZ1RvbmU6IFswLCAyLCAyLCAyLCAyLCAyLCAxXSxcclxuICAgICAgIC8vIGphcGFuZXNlXHJcbiAgICAgICBoaXJvam9zaGk6IFswLCAyLCAxLCA0LCAxXSxcclxuICAgICAgIGphcGFuZXNlQTogWzAsIDEsIDQsIDEsIDNdLFxyXG4gICAgICAgamFwYW5lc2VCOiBbMCwgMiwgMywgMSwgM10sXHJcbiAgICAgICAvLyBjdWx0dXJlc1xyXG4gICAgICAgb3JpZW50YWw6IFswLCAxLCAzLCAxLCAxLCAzLCAxXSxcclxuICAgICAgIHBlcnNpYW46IFswLCAxLCA0LCAxLCAyLCAzXSxcclxuICAgICAgIGFyYWJpYW46IFswLCAyLCAyLCAxLCAxLCAyLCAyXSxcclxuICAgICAgIGJhbGluZXNlOiBbMCwgMSwgMiwgNCwgMV0sXHJcbiAgICAgICBrdW1vaTogWzAsIDIsIDEsIDQsIDIsIDJdLFxyXG4gICAgICAgcGVsb2c6IFswLCAxLCAyLCAzLCAxLCAxXSxcclxuICAgICAgIGFsZ2VyaWFuOiBbMCwgMiwgMSwgMiwgMSwgMSwgMSwgM10sXHJcbiAgICAgICBjaGluZXNlOiBbMCwgNCwgMiwgMSwgNF0sXHJcbiAgICAgICBtb25nb2xpYW46IFswLCAyLCAyLCAzLCAyXSxcclxuICAgICAgIGVneXB0aWFuOiBbMCwgMiwgMywgMiwgM10sXHJcbiAgICAgICByb21haW5pYW46IFswLCAyLCAxLCAzLCAxLCAyLCAxXSxcclxuICAgICAgIGhpbmR1OiBbMCwgMiwgMiwgMSwgMiwgMSwgMl0sXHJcbiAgICAgICBpbnNlbjogWzAsIDEsIDQsIDIsIDNdLFxyXG4gICAgICAgaXdhdG86IFswLCAxLCA0LCAxLCA0XSxcclxuICAgICAgIHNjb3R0aXNoOiBbMCwgMiwgMywgMiwgMl0sXHJcbiAgICAgICB5bzogWzAsIDMsIDIsIDIsIDNdLFxyXG4gICAgICAgaXN0cmlhbjogWzAsIDEsIDIsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAgdWtyYW5pYW5Eb3JpYW46IFswLCAyLCAxLCAzLCAxLCAyLCAxXSxcclxuICAgICAgIHBldHJ1c2hrYTogWzAsIDEsIDMsIDIsIDEsIDNdLFxyXG4gICAgICAgYWhhdmFyYWJhOiBbMCwgMSwgMywgMSwgMiwgMSwgMl0sXHJcbiAgIH07XHJcbiAgIC8vIGR1cGxpY2F0ZXMgd2l0aCBhbGlhc2VzXHJcbiAgIFNjYWxlVGVtcGxhdGVzLmhhbGZEaW1pbmlzaGVkID0gU2NhbGVUZW1wbGF0ZXMubWlub3I3YjU7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmpld2lzaCA9IFNjYWxlVGVtcGxhdGVzLnNwYW5pc2g4VG9uZTtcclxuICAgU2NhbGVUZW1wbGF0ZXMuYnl6YW50aW5lID0gU2NhbGVUZW1wbGF0ZXMuZG91YmxlSGFybW9uaWM7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmFjb3VzdGljID0gU2NhbGVUZW1wbGF0ZXMubHlkaWFuRG9taW5hbnQ7XHJcbiAgIFNjYWxlVGVtcGxhdGVzLmFlb2xpYW4gPSBTY2FsZVRlbXBsYXRlcy5taW5vcjtcclxuICAgU2NhbGVUZW1wbGF0ZXMuaW9uaWFuID0gU2NhbGVUZW1wbGF0ZXMubWFqb3I7XHJcbiAgIE9iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKS5mb3JFYWNoKChlbGVtZW50KSA9PiBPYmplY3QuZnJlZXplKFNjYWxlVGVtcGxhdGVzW2VsZW1lbnRdKSk7XG5cbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgY29uc3QgbmFtZVJlZ2V4JDEgPSAvKFtBLUddKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBtb2RpZmllclJlZ2V4JDEgPSAvKCN8c3xiKSg/IVteKF0qXFwpKS9nO1xyXG4gICBjb25zdCBvY3RhdmVSZWdleCQxID0gLyhbMC05XSspKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IHNjYWxlTmFtZVJlZ2V4ID0gLyhcXChbYS16QS1aXXsyLH1cXCkpL2c7XHJcbiAgIC8qKlxyXG4gICAgKiBhdHRlbXB0cyB0byBwYXJzZSBhIG5vdGUgZnJvbSBhIHN0cmluZ1xyXG4gICAgKiBAcGFyYW0gc2NhbGUgLSB0aGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICAqIEBwYXJhbSBzdXByZXNzV2FybmluZyAtIHN1cHJlc3MgdGhlIHdhcm5pbmcgZm9yIGluZWZmZWNpZW5jeSBpZiB0cnVlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgcGFyc2VTY2FsZSA9IChzY2FsZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzY2FsZUxvb2t1cChzY2FsZSk7XHJcbiAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IHNjYWxlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtzY2FsZX0uIEdldCBhIHBlcmZvcm1hbmMgaW5jcmVhc2UgYnkgdXNpbmcgYSB2YWxpZCBmb3JtYXRgKTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEluZWZmZWNpZW50IHNjYWxlIHN0cmluZyBmb3JtYXR0aW5nIC0gJHtzY2FsZX0uIEdldCBhIHBlcmZvcm1hbmMgaW5jcmVhc2UgYnkgdXNpbmcgYSB2YWxpZCBmb3JtYXRgKTtcclxuICAgICAgIH1cclxuICAgICAgIGxldCBub3RlSWRlbmlmaWVyID0gXCJcIjtcclxuICAgICAgIGxldCBub3RlTW9kaWZpZXIgPSAwO1xyXG4gICAgICAgbGV0IG5vdGVPY3RhdmUgPSBcIlwiO1xyXG4gICAgICAgbGV0IHNjYWxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICBjb25zdCBuYW1lTWF0Y2ggPSBzY2FsZS5tYXRjaChuYW1lUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gc2NhbGUubWF0Y2gobW9kaWZpZXJSZWdleCQxKT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IG9jdGF2ZU1hdGNoID0gc2NhbGUubWF0Y2gob2N0YXZlUmVnZXgkMSk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVNYXRjaCA9IHNjYWxlLm1hdGNoKHNjYWxlTmFtZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVyc1xyXG4gICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gpIHtcclxuICAgICAgICAgICBpZiAobW9kaWZpZXJNYXRjaC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgYWxsIG1vZGlmaWVycyBpbnRvIGFuIG9mZmVzZXQgdmFsdWUgdG8gYmUgYWRkZWQgdG8gdGhlIHNlbWl0b25lXHJcbiAgICAgICAgICAgICAgIG5vdGVNb2RpZmllciA9IG1vZGlmaWVyTWF0Y2hcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlTW9kaWZpZXIoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBwYXJzZU1vZGlmaWVyKG1vZGlmaWVyTWF0Y2hbMF0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmIChvY3RhdmVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IFtvY3RhdmVdID0gb2N0YXZlTWF0Y2g7XHJcbiAgICAgICAgICAgbm90ZU9jdGF2ZSA9IG9jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChzY2FsZU5hbWVNYXRjaCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNOYW1lID0gc2NhbGVOYW1lTWF0Y2guam9pbihcIlwiKTtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzTmFtZSk7XHJcbiAgICAgICAgICAgc2NhbGVOYW1lID0gc05hbWU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgbGV0IHRlbXBsYXRlSW5kZXggPSAxOyAvLyBkZWZhdWx0IG1ham9yIHNjYWxlXHJcbiAgICAgICAgICAgaWYgKHNjYWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZUluZGV4ID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpLmZpbmRJbmRleCgodGVtcGxhdGUpID0+IHRlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICAgICAgICAgLmluY2x1ZGVzKHNjYWxlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xcKHxcXCkvZywgXCJcIikpKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpW3RlbXBsYXRlSW5kZXhdKTtcclxuICAgICAgICAgICBpZiAodGVtcGxhdGVJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTktOT1dOIFRFTVBMQVRFXCIsIHNjYWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgdGVtcGxhdGUgZm9yIHNjYWxlICR7c2NhbGVOYW1lfWApO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzW09iamVjdC5rZXlzKFNjYWxlVGVtcGxhdGVzKVt0ZW1wbGF0ZUluZGV4XV07XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAga2V5OiBzZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICB9O1xyXG4gICAgICAgfVxyXG4gICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFNjYWxlOiAke3NjYWxlfWApO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyBhIGxvb2t1cCB0YWJsZSBmb3IgYWxsIG5vdGVzIGZvcm1hdHRlZCBhcyBbQS1HXVsjfGJ8c11bMC05XVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZVRhYmxlJDIgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBzY2FsZVRhYmxlID0ge307XHJcbiAgICAgICBjb25zdCBub3RlTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIl07XHJcbiAgICAgICBjb25zdCBub3RlTW9kaWZpZXJzID0gW1wiYlwiLCBcIiNcIiwgXCJzXCJdO1xyXG4gICAgICAgY29uc3QgdGVtcGxhdGVzID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiB0ZW1wbGF0ZXMpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVMYWJlbCBvZiBub3RlTGV0dGVycykge1xyXG4gICAgICAgICAgICAgICAvL2V4IEEobWlub3IpXHJcbiAgICAgICAgICAgICAgIHNjYWxlVGFibGVbYCR7bm90ZUxhYmVsfSgke3RlbXBsYXRlfSlgXSA9IHBhcnNlU2NhbGUobm90ZUxhYmVsLCB0cnVlKTsgLy8gJ0MnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3QgbW9kIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke21vZH0oJHt0ZW1wbGF0ZX0pYDtcclxuICAgICAgICAgICAgICAgICAgIC8vIGV4IEEjKG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgc2NhbGVUYWJsZVtrZXldID0gcGFyc2VTY2FsZShrZXksIHRydWUpOyAvLyAnQyMnIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZm9yIChsZXQgaU9jdGF2ZSA9IE9DVEFWRV9NSU47IGlPY3RhdmUgPCBPQ1RBVkVfTUFYOyArK2lPY3RhdmUpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke2lPY3RhdmV9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBleCBBNChtaW5vcilcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0M0JyBmb3IgZXhhbXBsZVxyXG4gICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBtb2Qgb2Ygbm90ZU1vZGlmaWVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25vdGVMYWJlbH0ke21vZH0ke2lPY3RhdmV9KCR7dGVtcGxhdGV9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gZXggQSM0KG1pbm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVba2V5XSA9IHBhcnNlU2NhbGUoa2V5LCB0cnVlKTsgLy8gJ0MjNCcgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBzY2FsZVRhYmxlO1xyXG4gICB9O1xyXG4gICAvKipcclxuICAgICogY3JlYXRlcyB0aGUgbG9va3VwIHRhYmxlIGFzIHNvb24gYXMgdGhlIG1vZHVsZSBpcyBsb2FkZWRcclxuICAgICogQGludGVybmFsXHJcbiAgICAqL1xyXG4gICBsZXQgX3NjYWxlTG9va3VwID0ge307XHJcbiAgIGNvbnN0IHNjYWxlTG9va3VwID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZVRhYmxlKCk7XHJcbiAgICAgICByZXR1cm4gX3NjYWxlTG9va3VwW2tleV07XHJcbiAgIH07XHJcbiAgIC8vIGlmICh0YWJsZSAmJiBPYmplY3Qua2V5cyh0YWJsZSkubGVuZ3RoID4gMCkge1xyXG4gICAvLyAgICBfc2NhbGVMb29rdXAgPSB0YWJsZSBhcyB7IFtrZXk6IHN0cmluZ106IFNjYWxlSW5pdGlhbGl6ZXIgfTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX3NjYWxlTG9va3VwID0gY3JlYXRlVGFibGUoKTtcclxuICAgLy8gfVxyXG4gICBjb25zdCBidWlsZFNjYWxlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBpZiAoT2JqZWN0LmVudHJpZXMoX3NjYWxlTG9va3VwKS5sZW5ndGggPiAwKSByZXR1cm4gX3NjYWxlTG9va3VwO1xyXG4gICAgICAgX3NjYWxlTG9va3VwID0gY3JlYXRlVGFibGUkMigpO1xyXG4gICAgICAgLy8gT2JqZWN0LmZyZWV6ZShfc2NhbGVMb29rdXApO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBUYWJsZSBCdWlsdFwiKTtcclxuICAgICAgIHJldHVybiBfc2NhbGVMb29rdXA7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBzaGlmdHMgYW4gYXJyYXkgYnkgYSBnaXZlbiBkaXN0YW5jZVxyXG4gICAgKiBAcGFyYW0gYXJyIHRoZSBhcnJheSB0byBzaGlmdFxyXG4gICAgKiBAcGFyYW0gZGlzdGFuY2UgdGhlIGRpc3RhbmNlIHRvIHNoaWZ0XHJcbiAgICAqIEByZXR1cm5zIHRoZSBzaGlmdGVkIGFycmF5XHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2hpZnQgPSAoYXJyLCBkaXN0ID0gMSkgPT4ge1xyXG4gICAgICAgYXJyID0gWy4uLmFycl07IC8vIGNvcHlcclxuICAgICAgIGlmIChkaXN0ID4gYXJyLmxlbmd0aCB8fCBkaXN0IDwgMCAtIGFyci5sZW5ndGgpXHJcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hpZnQ6IGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiBhcnJheSBsZW5ndGhcIik7XHJcbiAgICAgICBpZiAoZGlzdCA+IDApIHtcclxuICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyLnNwbGljZShhcnIubGVuZ3RoIC0gZGlzdCwgSW5maW5pdHkpO1xyXG4gICAgICAgICAgIGFyci51bnNoaWZ0KC4uLnRlbXApO1xyXG4gICAgICAgfVxyXG4gICAgICAgaWYgKGRpc3QgPCAwKSB7XHJcbiAgICAgICAgICAgY29uc3QgdGVtcCA9IGFyci5zcGxpY2UoMCwgZGlzdCk7XHJcbiAgICAgICAgICAgYXJyLnB1c2goLi4udGVtcCk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gYXJyO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogIFNpbXBsZSB1dGlsIHRvIGxhenkgY2xvbmUgYW4gb2JqZWN0XHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2xvbmUgPSAob2JqKSA9PiB7XHJcbiAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIHNpbXBsZSB1dGlsIHRvIGxhenkgY2hlY2sgZXF1YWxpdHkgb2Ygb2JqZWN0cyBhbmQgYXJyYXlzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgaXNFcXVhbCA9IChhLCBiKSA9PiB7XHJcbiAgICAgICBjb25zdCBzdHJpbmdBID0gSlNPTi5zdHJpbmdpZnkoYSk7XHJcbiAgICAgICBjb25zdCBzdHJpbmdCID0gSlNPTi5zdHJpbmdpZnkoYik7XHJcbiAgICAgICByZXR1cm4gc3RyaW5nQSA9PT0gc3RyaW5nQjtcclxuICAgfTtcblxuICAgLy8gaW1wb3J0IHRhYmxlIGZyb20gXCIuL25vdGVTdHJpbmdMb29rdXAuanNvblwiO1xyXG4gICAvKipcclxuICAgICogV2lsbCBsb29rdXAgYSBzY2FsZSBuYW1lIGJhc2VkIG9uIHRoZSB0ZW1wbGF0ZS5cclxuICAgICogQHBhcmFtIHRlbXBsYXRlIC0gdGhlIHRlbXBsYXRlIHRvIGxvb2t1cFxyXG4gICAgKiBAcGFyYW0gc3VwcmVzc1dhcm5pbmcgLSBzdXByZXNzIHRoZSB3YXJuaW5nIGZvciBpbmVmZmVjaWVuY3kgaWYgdHJ1ZVxyXG4gICAgKiBAcmV0dXJucyB0aGUgc2NhbGUgbmFtZVxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHNjYWxlTmFtZUxvb2t1cCA9ICh0ZW1wbGF0ZSwgc3VwcmVzc1dhcm5pbmcgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuYW1lVGFibGUoSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcclxuICAgICAgICAgICBpZiAocmVzdWx0KVxyXG4gICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICBpZiAoIXN1cHJlc3NXYXJuaW5nKVxyXG4gICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoU2NhbGVUZW1wbGF0ZXMpO1xyXG4gICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcyk7XHJcbiAgICAgICBjb25zdCBzY2FsZU5hbWVzID0gW107XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICBpZiAoaXNFcXVhbCh2YWx1ZXNbaV0sIHRlbXBsYXRlKSkge1xyXG4gICAgICAgICAgICAgICBzY2FsZU5hbWVzLnB1c2goa2V5c1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleXNbaV0uc2xpY2UoMSkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGNvbnN0IHNjYWxlTmFtZXNTdHJpbmcgPSBzY2FsZU5hbWVzLmpvaW4oXCIgQUtBIFwiKTtcclxuICAgICAgIHJldHVybiBzY2FsZU5hbWVzU3RyaW5nO1xyXG4gICB9O1xyXG4gICBjb25zdCBjcmVhdGVUYWJsZSQxID0gKCkgPT4ge1xyXG4gICAgICAgY29uc3QgdGFibGUgPSB7fTtcclxuICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICB0YWJsZVtKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSldID0gc2NhbGVOYW1lTG9va3VwKHRlbXBsYXRlLCB0cnVlKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgfTtcclxuICAgbGV0IF9uYW1lVGFibGUgPSB7fTtcclxuICAgY29uc3QgbmFtZVRhYmxlID0gKGtleSkgPT4ge1xyXG4gICAgICAgLy8gYnVpbGRTY2FsZU5hbWVUYWJsZSgpO1xyXG4gICAgICAgcmV0dXJuIF9uYW1lVGFibGVba2V5XTtcclxuICAgfTtcclxuICAgLy8gaWYgKHRhYmxlICYmIE9iamVjdC5rZXlzKHRhYmxlKS5sZW5ndGggPiAwKSB7XHJcbiAgIC8vICAgIF9uYW1lVGFibGUgPSB0YWJsZTtcclxuICAgLy8gfSBlbHNlIHtcclxuICAgLy8gICAgX25hbWVUYWJsZSA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRTY2FsZU5hbWVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfbmFtZVRhYmxlKS5sZW5ndGggPiAwKSByZXR1cm4gX25hbWVUYWJsZTtcclxuICAgICAgIF9uYW1lVGFibGUgPSBjcmVhdGVUYWJsZSQxKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9uYW1lVGFibGUpO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBuYW1lIHRhYmxlIGJ1aWx0XCIpO1xyXG4gICAgICAgcmV0dXJuIF9uYW1lVGFibGU7XHJcbiAgIH07XG5cbiAgIC8qKlxyXG4gICAgKiBTY2FsZXMgY29uc2lzdCBvZiBhIGtleSh0b25pYyBvciByb290KSBhbmQgYSB0ZW1wbGF0ZShhcnJheSBvZiBpbnRlZ2VycykgdGhhdFxyXG4gICAgKiA8YnI+IHJlcHJlc2VudHMgdGhlIGludGVydmFsIG9mIHN0ZXBzIGJldHdlZW4gZWFjaCBub3RlLlxyXG4gICAgKiA8YnI+PGJyPlNjYWxlIGludGVydmFscyBhcmUgcmVwcmVzZW50ZWQgYnkgYW4gaW50ZWdlclxyXG4gICAgKiA8YnI+dGhhdCBpcyB0aGUgbnVtYmVyIG9mIHNlbWl0b25lcyBiZXR3ZWVuIGVhY2ggbm90ZS5cclxuICAgICogPGJyPjAgPSBrZXkgLSB3aWxsIGFsd2F5cyByZXByZXNlbnQgdGhlIHRvbmljXHJcbiAgICAqIDxicj4xID0gaGFsZiBzdGVwXHJcbiAgICAqIDxicj4yID0gd2hvbGUgc3RlcFxyXG4gICAgKiA8YnI+MyA9IG9uZSBhbmQgb25lIGhhbGYgc3RlcHNcclxuICAgICogPGJyPjQgPSBkb3VibGUgc3RlcFxyXG4gICAgKiA8YnI+WzAsIDIsIDIsIDEsIDIsIDIsIDJdIHJlcHJlc2VudHMgdGhlIG1ham9yIHNjYWxlXHJcbiAgICAqIDxicj48YnI+IFNjYWxlIHRlbXBsYXRlcyBtYXkgaGF2ZSBhcmJpdHJheSBsZW5ndGhzXHJcbiAgICAqXHJcbiAgICAqIFRoZSBmb2xsb3dpbmcgUHJlLWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6XHJcbiAgICAqIDx0YWJsZT5cclxuICAgICogPHRyPlxyXG4gICAgKiA8dGQ+bWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+bWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+aW9uaWFuPC90ZD5cclxuICAgICogPHRkPmRvcmlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+cGhyeWdpYW48L3RkPlxyXG4gICAgKiA8dGQ+bHlkaWFuPC90ZD5cclxuICAgICogPHRkPm1peG9seWRpYW48L3RkPlxyXG4gICAgKiA8dGQ+YWVvbGlhbjwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bG9jcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5lbmlnbWF0aWNNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5lbmlnbWF0aWNNaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjdiNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWFqb3I3czRzNTwvdGQ+XHJcbiAgICAqIDx0ZD5oYXJtb25pY01ham9yPC90ZD5cclxuICAgICogPHRkPmhhcm1vbmljTWlub3I8L3RkPlxyXG4gICAgKiA8dGQ+ZG91YmxlSGFybW9uaWM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1lbG9kaWNNaW5vckFzY2VuZGluZzwvdGQ+XHJcbiAgICAqIDx0ZD5tZWxvZGljTWlub3JEZXNjZW5kaW5nPC90ZD5cclxuICAgICogPHRkPm1ham9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5tYWpvclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bWlub3JQZW50YXRvbmljPC90ZD5cclxuICAgICogPHRkPm1pbm9yUGVudGF0b25pY0JsdWVzPC90ZD5cclxuICAgICogPHRkPmI1UGVudGF0b25pYzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5vcjZQZW50YXRvbmljPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kaW04VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5kb204VG9uZTwvdGQ+XHJcbiAgICAqIDx0ZD5uZW9wb2xpdGFuTWFqb3I8L3RkPlxyXG4gICAgKiA8dGQ+bmVvcG9saXRhbk1pbm9yPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5NYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5NaW5vcjwvdGQ+XHJcbiAgICAqIDx0ZD5odW5nYXJpYW5HeXBzeTwvdGQ+XHJcbiAgICAqIDx0ZD5zcGFuaXNoPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zcGFuaXNoOFRvbmU8L3RkPlxyXG4gICAgKiA8dGQ+c3BhbmlzaEd5cHN5PC90ZD5cclxuICAgICogPHRkPmF1Z21lbnRlZDwvdGQ+XHJcbiAgICAqIDx0ZD5kb21pbmFudFN1c3BlbmRlZDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+YmVib3BNYWpvcjwvdGQ+XHJcbiAgICAqIDx0ZD5iZWJvcERvbWluYW50PC90ZD5cclxuICAgICogPHRkPm15c3RpYzwvdGQ+XHJcbiAgICAqIDx0ZD5vdmVydG9uZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bGVhZGluZ1RvbmU8L3RkPlxyXG4gICAgKiA8dGQ+aGlyb2pvc2hpPC90ZD5cclxuICAgICogPHRkPmphcGFuZXNlQTwvdGQ+XHJcbiAgICAqIDx0ZD5qYXBhbmVzZUI8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm9yaWVudGFsPC90ZD5cclxuICAgICogPHRkPmFyYWJpYW48L3RkPlxyXG4gICAgKiA8dGQ+cGVyc2lhbjwvdGQ+XHJcbiAgICAqIDx0ZD5iYWxpbmVzZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+a3Vtb2k8L3RkPlxyXG4gICAgKiA8dGQ+cGVsb2c8L3RkPlxyXG4gICAgKiA8dGQ+YWxnZXJpYW48L3RkPlxyXG4gICAgKiA8dGQ+Y2hpbmVzZTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+bW9uZ29saWFuPC90ZD5cclxuICAgICogPHRkPmVneXB0aWFuPC90ZD5cclxuICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICogPHRkPnJvbWFuaWFuPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAqIDx0ZD5pbnNlbjwvdGQ+XHJcbiAgICAqIDx0ZD5pd2F0bzwvdGQ+XHJcbiAgICAqIDx0ZD5zY290dGlzaDwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+eW88L3RkPlxyXG4gICAgKiA8dGQ+aXN0cmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD51a3JhbmlhbkRvcmlhbjwvdGQ+XHJcbiAgICAqIDx0ZD5wZXRydXNoa2E8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmFoYXZhcmFiYTwvdGQ+XHJcbiAgICAqIDx0ZD5oYWxmRGltaW5pc2hlZDwvdGQ+XHJcbiAgICAqIDx0ZD5qZXdpc2g8L3RkPlxyXG4gICAgKiA8dGQ+Ynl6YW50aW5lPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5hY291c3RpYzwvdGQ+XHJcbiAgICAqIDwvdGFibGU+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHtTY2FsZX0gZnJvbSAnbXVzaWN0aGVvcnlqcyc7XHJcbiAgICAqIGltcG9ydCB7U2NhbGVUZW1wbGF0ZXN9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgKiBpbXBvcnQge1NjYWxlSW5pdGlhbGl6ZXJ9IGZyb20gJ211c2ljdGhlb3J5anMnOyAvLyBUeXBlU2NyaXB0IG9ubHkgaWYgbmVlZGVkXHJcbiAgICAqIGBgYFxyXG4gICAgKi9cclxuICAgY2xhc3MgU2NhbGUge1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogaW1wb3J0IHtTY2FsZSwgU2NhbGVUZW1wbGF0ZXN9IGZyb20gJ211c2ljdGhlb3J5anMnO1xyXG4gICAgICAgICpcclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBzY2FsZSB3aXRoIHRoZSBkZWZhdWx0IHRlbXBsYXRlLCBrZXkgMGYgMChDKSBhbmQgYW4gb2N0YXZlIG9mIDRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gY3JlYXRlcyBhIHNjYWxlIHdpdGggdGhlIHRlbXBsYXRlIFswLCAyLCAyLCAxLCAyLCAyLCAyXSBhbmQga2V5IDQoRSkgYW5kIG9jdGF2ZSA1XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBuZXcgU2NhbGUoe2tleTogNCwgb2N0YXZlOiA1LCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWFqb3J9KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogLy8gU3RyaW5nIHBhcnNpbmcgc2hvdWxkIGZvbGxvdyB0aGUgZm9ybWF0OiBub3RlLW5hbWVbYWx0ZXJhdGlvbl1bb2N0YXZlXVsoc2NhbGUtbmFtZSldXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgc2NhbGUgd2l0aCB0aGUgbWlub3IgdGVtcGxhdGUsIGtleSBHYiBhbmQgYW4gb2N0YXZlIG9mIDdcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMyA9IG5ldyBTY2FsZSgnR2I3KG1pbm9yKScpO1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcykge1xyXG4gICAgICAgICAgIGlmICghdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSBERUZBVUxUX1NDQUxFX1RFTVBMQVRFO1xyXG4gICAgICAgICAgICAgICB0aGlzLmtleSA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgdmFsdWVzID0gcGFyc2VTY2FsZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gWy4uLih2YWx1ZXM/LnRlbXBsYXRlID8/IERFRkFVTFRfU0NBTEVfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5rZXkgPSB2YWx1ZXMua2V5IHx8IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID0gdmFsdWVzLm9jdGF2ZSB8fCBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0aGF0IG9jdGF2ZSBpcyBzZXQgZmlyc3Qgc28gdGhhdFxyXG4gICAgICAgICAgICAgICAvLyBzZXR0aW5nIHRoZSBzZW1pdG9uZSBjYW4gY2hhbmdlIHRoZSBvY3RhdmVcclxuICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFsuLi4odmFsdWVzPy50ZW1wbGF0ZSA/PyBERUZBVUxUX1NDQUxFX1RFTVBMQVRFKV07XHJcbiAgICAgICAgICAgICAgIHRoaXMua2V5ID0gdmFsdWVzLmtleSB8fCBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgICAgICB0aGlzLm9jdGF2ZSA9IHZhbHVlcy5vY3RhdmUgfHwgREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiAgdW5pcXVlIGlkIGZvciB0aGlzIHNjYWxlKGF1dG8gZ2VuZXJhdGVkKVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5pZCk7IC8vIGRobGtqNWozMjJcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpZCA9IHVpZCgpO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzY2FsZSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gc2NhbGVcclxuICAgICAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzY2FsZSB0byBjb21wYXJlIHRvXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzY2FsZXMgYXJlIGVxdWFsXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnN0IHNjYWxlMiA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZXF1YWxzKHNjYWxlMikpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZXF1YWxzKHNjYWxlKSB7XHJcbiAgICAgICAgICAgcmV0dXJuICh0aGlzLl9rZXkgPT09IHNjYWxlLl9rZXkgJiZcclxuICAgICAgICAgICAgICAgdGhpcy5fb2N0YXZlID09PSBzY2FsZS5fb2N0YXZlICYmXHJcbiAgICAgICAgICAgICAgIGlzRXF1YWwodGhpcy5fdGVtcGxhdGUsIHNjYWxlLl90ZW1wbGF0ZSkpO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGlzIFNjYWxlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBTY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZTIgPSBzY2FsZS5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5lcXVhbHMoc2NhbGUyKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb3B5KCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmtleSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICAgICAgdGVtcGxhdGU6IGNsb25lKHRoaXMudGVtcGxhdGUpLFxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgIT09IDApXHJcbiAgICAgICAgICAgICAgIHNjYWxlLnNoaWZ0KHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgX2tleSA9IDA7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUua2V5KTsgLy8gMChzZW1pdG9uZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQga2V5KCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9rZXk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNldHRpbmcgdGhlIHNlbWl0b25lIHRvIGEgdmFsdWUgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIDExXShzZW1pdG9uZSkgd2lsbDxici8+XHJcbiAgICAgICAgKiB3cmFwIHRoZSBzZW1pdG9uZSB0byB0aGUgcmFuZ2UgWzAsIDExXSBhbmQgY2hhbmdlIHRoZSBvY3RhdmUgZGVwZW5kaW5nPGJyLz5cclxuICAgICAgICAqIG9uIGhvdyBtYW55IHRpbWVzIHRoZSBzZW1pdG9uZSBoYXMgYmVlbiB3cmFwcGVkLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS5rZXkgPSA0O1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUua2V5KTsgLy8gNFxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNldCBrZXkodmFsdWUpIHtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gd3JhcCh2YWx1ZSwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIHRoaXMub2N0YXZlID0gdGhpcy5vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHRoaXMuX2tleSA9IHdyYXBwZWQudmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG9jdGF2ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBfb2N0YXZlID0gREVGQVVMVF9PQ1RBVkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFRoZSBvY3RhdmUgaXMgY2xhbXBlZCB0byB0aGUgcmFuZ2UgWzAsIDldLlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5vY3RhdmUpOyAvLyA0XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IG9jdGF2ZSgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fb2N0YXZlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIHNjYWxlLm9jdGF2ZSA9IDU7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5vY3RhdmUpOyAvLyA1XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IG9jdGF2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgIHRoaXMuX29jdGF2ZSA9IGNsYW1wKHZhbHVlLCBPQ1RBVkVfTUlOLCBPQ1RBVkVfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdGVtcGxhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgX3RlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudGVtcGxhdGUpOyAvLyBbMCwgMiwgMiwgMSwgMiwgMiwgMl1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGNsb25lKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIGZvbGxvd2luZyBQcmUtZGVmaW5lZCB0ZW1wbGF0ZXMgYXJlIGF2YWlsYWJsZTpcclxuICAgICAgICAqIDx0YWJsZT5cclxuICAgICAgICAqIDx0cj5cclxuICAgICAgICAqIDx0ZD5tYWpvcjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWlub3I8L3RkPlxyXG4gICAgICAgICogPHRkPmlvbmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9yaWFuPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnBocnlnaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5seWRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPm1peG9seWRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmFlb2xpYW48L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bG9jcmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZW5pZ21hdGljTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmVuaWdtYXRpY01pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjdiNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tYWpvcjdzNHM1PC90ZD5cclxuICAgICAgICAqIDx0ZD5oYXJtb25pY01ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5oYXJtb25pY01pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb3VibGVIYXJtb25pYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5tZWxvZGljTWlub3JBc2NlbmRpbmc8L3RkPlxyXG4gICAgICAgICogPHRkPm1lbG9kaWNNaW5vckRlc2NlbmRpbmc8L3RkPlxyXG4gICAgICAgICogPHRkPm1ham9yUGVudGF0b25pYzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqb3JQZW50YXRvbmljQmx1ZXM8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWlub3JQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vclBlbnRhdG9uaWNCbHVlczwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YjVQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW5vcjZQZW50YXRvbmljPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRpbThUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb204VG9uZTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bmVvcG9saXRhbk1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5uZW9wb2xpdGFuTWlub3I8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+aHVuZ2FyaWFuTWFqb3I8L3RkPlxyXG4gICAgICAgICogPHRkPmh1bmdhcmlhbk1pbm9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5odW5nYXJpYW5HeXBzeTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+c3BhbmlzaDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zcGFuaXNoOFRvbmU8L3RkPlxyXG4gICAgICAgICogPHRkPnNwYW5pc2hHeXBzeTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXVnbWVudGVkPC90ZD5cclxuICAgICAgICAqIDx0ZD5kb21pbmFudFN1c3BlbmRlZDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5iZWJvcE1ham9yPC90ZD5cclxuICAgICAgICAqIDx0ZD5iZWJvcERvbWluYW50PC90ZD5cclxuICAgICAgICAqIDx0ZD5teXN0aWM8L3RkPlxyXG4gICAgICAgICogPHRkPm92ZXJ0b25lPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmxlYWRpbmdUb25lPC90ZD5cclxuICAgICAgICAqIDx0ZD5oaXJvam9zaGk8L3RkPlxyXG4gICAgICAgICogPHRkPmphcGFuZXNlQTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+amFwYW5lc2VCPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm9yaWVudGFsPC90ZD5cclxuICAgICAgICAqIDx0ZD5hcmFiaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5wZXJzaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5iYWxpbmVzZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5rdW1vaTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+cGVsb2c8L3RkPlxyXG4gICAgICAgICogPHRkPmFsZ2VyaWFuPC90ZD5cclxuICAgICAgICAqIDx0ZD5jaGluZXNlPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1vbmdvbGlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZWd5cHRpYW48L3RkPlxyXG4gICAgICAgICogPHRkPmhpbmR1PC90ZD5cclxuICAgICAgICAqIDx0ZD5yb21hbmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5oaW5kdTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aW5zZW48L3RkPlxyXG4gICAgICAgICogPHRkPml3YXRvPC90ZD5cclxuICAgICAgICAqIDx0ZD5zY290dGlzaDwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD55bzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+aXN0cmlhbjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+dWtyYW5pYW5Eb3JpYW48L3RkPlxyXG4gICAgICAgICogPHRkPnBldHJ1c2hrYTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5haGF2YXJhYmE8L3RkPlxyXG4gICAgICAgICogPHRkPmhhbGZEaW1pbmlzaGVkPC90ZD5cclxuICAgICAgICAqIDx0ZD5qZXdpc2g8L3RkPlxyXG4gICAgICAgICogPHRkPmJ5emFudGluZTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5hY291c3RpYzwvdGQ+XHJcbiAgICAgICAgKiA8L3RhYmxlPlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBzY2FsZS50ZW1wbGF0ZSA9IFswLCAyLCAyLCAxLCAyLCAyLCAyXTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnRlbXBsYXRlKTsgLy8gWzAsIDIsIDIsIDEsIDIsIDIsIDJdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBjbG9uZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbm90ZXNcclxuICAgICAgICAqIG5vdGVzIGFyZSBnZW5lcmF0ZWQgYW5kIGNhY2hlZCBhcyBuZWVkZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgX25vdGVzID0gW107XHJcbiAgICAgICBfbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHdpbGwgZ2VuZXJhdGUgdGhlIG5vdGVzIGlmIG5lZWRlZCBvciByZXR1cm4gdGhlIGNhY2hlZCBub3Rlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5ub3Rlcyk7IC8vIExpc3Qgb2Ygbm90ZXNcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgbm90ZXMoKSB7XHJcbiAgICAgICAgICAgaWYgKHRoaXMuX25vdGVzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vdGVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBnZW5lcmF0ZSBub3RlcyhpbnRlcm5hbClcclxuICAgICAgICAqIGdlbmVyYXRlcyB0aGUgbm90ZXMgZm9yIHRoaXMgc2NhbGVcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2VuZXJhdGVOb3RlcygpIHtcclxuICAgICAgICAgICAvLyB1c2UgdGhlIHRlbXBsYXRlIHVuc2hpZnRlZCBmb3Igc2ltcGxpY2l0eVxyXG4gICAgICAgICAgIGNvbnN0IHVuc2hpZnRlZFRlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIC10aGlzLl9zaGlmdGVkSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgIC8vIGlmIGFsbG93aW5nIHRoaXMgdG8gY2hhbmdlIHRoZSBvY3RhdmUgaXMgdW5kZXNpcmFibGVcclxuICAgICAgICAgICAvLyB0aGVuIG1heSBuZWVkIHRvIHByZSB3cmFwIHRoZSB0b25lIGFuZCB1c2VcclxuICAgICAgICAgICAvLyB0aGUgZmluYWwgdmFsdWVcclxuICAgICAgICAgICBjb25zdCBub3RlcyA9IFtdO1xyXG4gICAgICAgICAgIGxldCBhY2N1bXVsYXRvciA9IHRoaXMua2V5O1xyXG4gICAgICAgICAgIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdW5zaGlmdGVkVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgY29uc3QgdG9uZSA9IGludGVydmFsID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICA/IChhY2N1bXVsYXRvciA9IHRoaXMua2V5KVxyXG4gICAgICAgICAgICAgICAgICAgOiAoYWNjdW11bGF0b3IgKz0gaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICBjb25zdCBub3RlID0gbmV3IE5vdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHRvbmUsXHJcbiAgICAgICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgbm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gc2hpZnQgbm90ZXMgYmFjayB0byBvcmlnaW5hbCBwb3NpdGlvblxyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPiAwKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBub3Rlcy5zcGxpY2Uobm90ZXMubGVuZ3RoIC0gKHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCArIDEpLCBJbmZpbml0eSk7XHJcbiAgICAgICAgICAgICAgIG5vdGVzLnVuc2hpZnQoLi4udGVtcCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmICh0aGlzLl9zaGlmdGVkSW50ZXJ2YWwgPCAwKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBub3Rlcy5zcGxpY2UoMCwgdGhpcy5fc2hpZnRlZEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgbm90ZXMucHVzaCguLi50ZW1wKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXMgPSBub3RlcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG5vdGVzIGluIHRoZSBzY2FsZVxyXG4gICAgICAgICogQHBhcmFtIHByZWZlclNoYXJwS2V5cyAtIGlmIHRydWUgdGhlbiBzaGFycHMgd2lsbCBiZSBwcmVmZXJyZWQgb3ZlciBmbGF0cyB3aGVuIHNlbWl0b25lcyBjb3VsZCBiZSBlaXRoZXIgLSBleDogQmIvQSNcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgbm90ZXMgaW4gdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLm5hbWVzKTsgLy8gWydDNCcsICdENCcsICdFNCcsICdGNCcsICdHNCcsICdBNCcsICdCNCddXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0Tm90ZU5hbWVzKHByZWZlclNoYXJwS2V5ID0gdHJ1ZSkge1xyXG4gICAgICAgICAgIGNvbnN0IG5hbWVzID0gc2NhbGVOb3RlTmFtZUxvb2t1cCh0aGlzLCBwcmVmZXJTaGFycEtleSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG5hbWVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBkZWdyZWVcclxuICAgICAgICAqIHJldHVybnMgYSBub3RlIHRoYXQgcmVwcmVzZW50cyB0aGUgZ2l2ZW4gZGVncmVlXHJcbiAgICAgICAgKiBAcGFyYW0gZGVncmVlIC0gdGhlIGRlZ3JlZSB0byByZXR1cm5cclxuICAgICAgICAqIEByZXR1cm5zIGEgbm90ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIGRlZ3JlZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kZWdyZWUoMCkpOyAvLyBDNChOb3RlKVxyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUuZGVncmVlKDEpKTsgLy8gRDQoTm90ZSkgZXRjXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGVncmVlKGRlZ3JlZSkge1xyXG4gICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwKGRlZ3JlZSAtIDEgLyp6ZXJvIGluZGV4ICovLCAwLCB0aGlzLm5vdGVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLm5vdGVzW3dyYXBwZWQudmFsdWVdLmNvcHkoKTtcclxuICAgICAgICAgICBub3RlLm9jdGF2ZSA9IHRoaXMub2N0YXZlICsgd3JhcHBlZC5udW1XcmFwcztcclxuICAgICAgICAgICByZXR1cm4gbm90ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcmVsYXRpdmUgbWFqb3JcclxuICAgICAgICAqIHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWFqb3Igb2YgdGhpcyBzY2FsZSAtIHRha2VzIHRoZSAzcmQgZGVncmVlIGFzIGl0J3Mga2V5XHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIG5ldyBzY2FsZSB0aGF0IGlzIHRoZSByZWxhdGl2ZSBtYWpvciBvZiB0aGlzIHNjYWxlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnJlbGF0aXZlTWFqb3IoKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgcmVsYXRpdmVNYWpvcigpIHtcclxuICAgICAgICAgICBjb25zdCBtYWpvciA9IG5ldyBTY2FsZSh7XHJcbiAgICAgICAgICAgICAgIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlcy5tYWpvcixcclxuICAgICAgICAgICAgICAga2V5OiB0aGlzLmRlZ3JlZSgzKS5zZW1pdG9uZSxcclxuICAgICAgICAgICAgICAgb2N0YXZlOiB0aGlzLm9jdGF2ZSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgICAgICByZXR1cm4gbWFqb3I7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJlbGF0aXZlIG1pbm9yXHJcbiAgICAgICAgKiByZXR1cm5zIGEgbmV3IHNjYWxlIHRoYXQgaXMgdGhlIHJlbGF0aXZlIG1pbm9yIG9mIHRoaXMgc2NhbGUgLSB0YWtlcyB0aGUgNnRoIGRlZ3JlZSBhcyBpdCdzIGtleVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgcmVsYXRpdmUgbWlub3Igb2YgdGhpcyBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5yZWxhdGl2ZU1pbm9yKCkpOyAvLyBTY2FsZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHJlbGF0aXZlTWlub3IoKSB7XHJcbiAgICAgICAgICAgY29uc3QgbWlub3IgPSBuZXcgU2NhbGUoe1xyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXMubWlub3IsXHJcbiAgICAgICAgICAgICAgIGtleTogdGhpcy5kZWdyZWUoNikuc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogdGhpcy5vY3RhdmUsXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgcmV0dXJuIG1pbm9yO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdFxyXG4gICAgICAgICovXHJcbiAgICAgICBfc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgIF9vcmlnaW5hbFRlbXBsYXRlID0gW107XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHNoaWZ0XHJcbiAgICAgICAgKiBzaGlmdHMgdGhlIHNjYWxlIGJ5IHRoZSBnaXZlbiBudW1iZXIgb2YgZGVncmVlc1xyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHBhcmFtIHNoaWZ0IC0gdGhlIG51bWJlciBvZiBkZWdyZWVzIHRvIHNoaWZ0IHRoZSBzY2FsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBuZXcgc2NhbGUgdGhhdCBpcyB0aGUgc2hpZnRlZCBzY2FsZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5zaGlmdCgxKSk7IC8vIFNjYWxlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2hpZnQoZGVncmVlcyA9IDEpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsVGVtcGxhdGUgPSBjbG9uZSh0aGlzLl90ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gc2hpZnQodGhpcy5fdGVtcGxhdGUsIGRlZ3JlZXMpO1xyXG4gICAgICAgICAgIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCArPSBkZWdyZWVzO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBzaGlmdGVkXHJcbiAgICAgICAgKiByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcGFyYW0gZGVncmVlcyAtIHRoZSBudW1iZXIgb2YgZGVncmVlcyB0byBzaGlmdCB0aGUgc2NhbGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIG51bWJlciBvZiBkZWdyZWVzXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0ZWQoMSkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNoaWZ0ZWQoZGVncmVlcyA9IDEpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnNoaWZ0KGRlZ3JlZXMpO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogdW5zaGlmdFxyXG4gICAgICAgICogc2hpZnRzIHRoZSBvcmlnaW5hbCByb290IGJhY2sgdG8gdGhlIHJvb3QgcG9zaXRpb25cclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoaXMgc2NhbGUgYWZ0ZXIgdW5zaGlmdGluZyBpdCBiYWNrIHRvIHRoZSBvcmlnaW5hbCByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnVuc2hpZnQoKSk7XHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdW5zaGlmdCgpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fc2hpZnRlZEludGVydmFsICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcmlnaW5hbFRlbXBsYXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAvLyB0aGlzLnNoaWZ0KHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbCAqIC0xKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fc2hpZnRlZEludGVydmFsID0gMDtcclxuICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHVuc2hpZnRlZFxyXG4gICAgICAgICogcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSB3aXRoIHRoZSB0b25pYyBzaGlmdGVkIGJhY2tcclxuICAgICAgICAqIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSB3aXRoIHRoZSB0b25pYyBzaGlmdGVkIGJhY2tcclxuICAgICAgICAqIHRvIHRoZSByb290IHBvc2l0aW9uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnVuc2hpZnRlZCgpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICB1bnNoaWZ0ZWQoKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxUZW1wbGF0ZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gdGhpcy5fb3JpZ2luYWxUZW1wbGF0ZTtcclxuICAgICAgICAgICBzY2FsZS51bnNoaWZ0KCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiByZXR1cm5zIHRoZSBhbW91bnQgdGhhdCB0aGUgc2NhbGUgaGFzIHNoaWZ0ZWRcclxuICAgICAgICAqICgwIGlmIG5vdCBzaGlmdGVkKVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGFtb3VudCB0aGF0IHRoZSBzY2FsZSBoYXMgc2hpZnRlZFxyXG4gICAgICAgICogKDAgaWYgbm90IHNoaWZ0ZWQpXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0KDEpKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLnNoaWZ0ZWQoKSk7IC8vIDFcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzaGlmdGVkSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoaWZ0ZWRJbnRlcnZhbDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogU2NhbGUgbW9kZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgSW9uaWFuKG1ham9yKSBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmlvbmlhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpb25pYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmlvbmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIGEgY29weSBvZiB0aGlzIHNjYWxlIGluIHRoZSBEb3JpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5kb3JpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZG9yaWFuKCkge1xyXG4gICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICAgc2NhbGUudGVtcGxhdGUgPSBTY2FsZVRlbXBsYXRlcy5kb3JpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgUGhyeWdpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5waHJ5Z2lhbigpKTsgLy8gU2NhbGUoY29weSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBwaHJ5Z2lhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMucGhyeWdpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTHlkaWFuIG1vZGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUubHlkaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGx5ZGlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubHlkaWFuO1xyXG4gICAgICAgICAgIHJldHVybiBzY2FsZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoaXMgc2NhbGUgaW4gdGhlIE1peG9seWRpYW4gbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5taXhvbHlkaWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1peG9seWRpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLm1peG9seWRpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgQWVvbGlhbihtaW5vcikgbW9kZVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhzY2FsZS5hZW9saWFuKCkpOyAvLyBTY2FsZShjb3B5KVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGFlb2xpYW4oKSB7XHJcbiAgICAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgICBzY2FsZS50ZW1wbGF0ZSA9IFNjYWxlVGVtcGxhdGVzLmFlb2xpYW47XHJcbiAgICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzY2FsZSBpbiB0aGUgTG9jcmlhbiBtb2RlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKHNjYWxlLmxvY3JpYW4oKSk7IC8vIFNjYWxlKGNvcHkpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbG9jcmlhbigpIHtcclxuICAgICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgIHNjYWxlLnRlbXBsYXRlID0gU2NhbGVUZW1wbGF0ZXMubG9jcmlhbjtcclxuICAgICAgICAgICByZXR1cm4gc2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHJldHVybnMgc3RyaW5nIHZlcnNpb24gb2YgdGhlIHNjYWxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBzdHJpbmcgdmVyc2lvbiBvZiB0aGUgc2NhbGVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBzY2FsZSA9IG5ldyBTY2FsZSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coc2NhbGUudG9TdHJpbmcoKSk7IC8vICdDJ1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgICAgIGxldCBzY2FsZU5hbWVzID0gc2NhbGVOYW1lTG9va3VwKHRoaXMuX3RlbXBsYXRlKTtcclxuICAgICAgICAgICBpZiAoIXNjYWxlTmFtZXMpXHJcbiAgICAgICAgICAgICAgIHNjYWxlTmFtZXMgPSB0aGlzLmdldE5vdGVOYW1lcygpLmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICByZXR1cm4gYCR7U2VtaXRvbmUkMVt0aGlzLl9rZXldfSR7dGhpcy5fb2N0YXZlfSgke3NjYWxlTmFtZXN9KWA7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoqXHJcbiAgICAqIGF0dGVtcHRzIHRvIGxvb2t1cCB0aGUgbm90ZSBuYW1lIGZvciBhIHNjYWxlIGVmZmljaWVudGx5XHJcbiAgICAqIEBwYXJhbSBzY2FsZSAtIHRoZSBzY2FsZSB0byBsb29rdXBcclxuICAgICogQHBhcmFtIHByZWZlclNoYXJwS2V5IC0gaWYgdHJ1ZSwgd2lsbCBwcmVmZXIgc2hhcnAga2V5cyBvdmVyIGZsYXQga2V5c1xyXG4gICAgKiBAcmV0dXJucyB0aGUgbm90ZSBuYW1lcyBmb3IgdGhlIHNjYWxlXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3Qgc2NhbGVOb3RlTmFtZUxvb2t1cCA9IChzY2FsZSwgcHJlZmVyU2hhcnBLZXkgPSB0cnVlKSA9PiB7XHJcbiAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGNvbnN0IGtleSA9IGAke3NjYWxlLmtleX0tJHtzY2FsZS5vY3RhdmV9LSR7SlNPTi5zdHJpbmdpZnkoc2NhbGUudGVtcGxhdGUpfWA7XHJcbiAgICAgICAgICAgY29uc3Qgbm90ZXMgPSBub3Rlc0xvb2t1cChrZXkpO1xyXG4gICAgICAgICAgIGlmIChub3Rlcykge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICB9XHJcbiAgICAgICBsZXQgbm90ZXMgPSBbLi4uc2NhbGUubm90ZXNdO1xyXG4gICAgICAgbm90ZXMgPSBzaGlmdChub3RlcywgLXNjYWxlLnNoaWZ0ZWRJbnRlcnZhbCgpKTsgLy91bnNoaWZ0IGJhY2sgdG8ga2V5ID0gMCBpbmRleFxyXG4gICAgICAgY29uc3Qgbm90ZXNQYXJ0cyA9IG5vdGVzLm1hcCgobm90ZSkgPT4gbm90ZS50b1N0cmluZygpLnNwbGl0KFwiL1wiKSk7XHJcbiAgICAgICBjb25zdCBvY3RhdmVzID0gbm90ZXMubWFwKChub3RlKSA9PiBub3RlLm9jdGF2ZSk7XHJcbiAgICAgICBjb25zdCByZW1vdmFibGVzID0gW1wiQiNcIiwgXCJCc1wiLCBcIkNiXCIsIFwiRSNcIiwgXCJFc1wiLCBcIkZiXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU5hbWVzID0gW107XHJcbiAgICAgICBmb3IgKGNvbnN0IFtpLCBub3RlUGFydHNdIG9mIG5vdGVzUGFydHMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgLy9yZW1vdmUgQ2IgQiMgZXRjXHJcbiAgICAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIG5vdGVQYXJ0cykge1xyXG4gICAgICAgICAgICAgICAvLyByZW1vdmUgYW55IG51bWJlcnMgZnJvbSB0aGUgbm90ZSBuYW1lKG9jdGF2ZSlcclxuICAgICAgICAgICAgICAgLy8gcGFydC5yZXBsYWNlKC9cXGQvZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgIGlmIChyZW1vdmFibGVzLmluY2x1ZGVzKHBhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IG5vdGVOYW1lcy5pbmRleE9mKHBhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgbm90ZU5hbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYgKG5vdGVOYW1lcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgbm90ZU5hbWVzLnB1c2gocHJlZmVyU2hhcnBLZXkgPyBub3RlUGFydHNbMF0gOiBub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChub3RlUGFydHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgIG5vdGVOYW1lcy5wdXNoKG5vdGVQYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCB3aG9sZU5vdGVzID0gW1xyXG4gICAgICAgICAgICAgICBcIkFcIixcclxuICAgICAgICAgICAgICAgXCJCXCIsXHJcbiAgICAgICAgICAgICAgIFwiQ1wiLFxyXG4gICAgICAgICAgICAgICBcIkRcIixcclxuICAgICAgICAgICAgICAgXCJFXCIsXHJcbiAgICAgICAgICAgICAgIFwiRlwiLFxyXG4gICAgICAgICAgICAgICBcIkdcIixcclxuICAgICAgICAgICAgICAgXCJBXCIsXHJcbiAgICAgICAgICAgICAgIFwiQlwiLFxyXG4gICAgICAgICAgICAgICBcIkNcIixcclxuICAgICAgICAgICAgICAgXCJEXCIsXHJcbiAgICAgICAgICAgICAgIFwiRVwiLFxyXG4gICAgICAgICAgICAgICBcIkZcIixcclxuICAgICAgICAgICAgICAgXCJHXCIsXHJcbiAgICAgICAgICAgXTtcclxuICAgICAgICAgICBjb25zdCBsYXN0V2hvbGVOb3RlID0gbm90ZU5hbWVzW25vdGVOYW1lcy5sZW5ndGggLSAxXVswXTtcclxuICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSB3aG9sZU5vdGVzLmluZGV4T2YobGFzdFdob2xlTm90ZSk7XHJcbiAgICAgICAgICAgY29uc3QgbmV4dE5vdGUgPSB3aG9sZU5vdGVzW2xhc3RJbmRleCArIDFdO1xyXG4gICAgICAgICAgIGlmIChub3RlUGFydHNbMF0uaW5jbHVkZXMobmV4dE5vdGUpKSB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGhhc09jdGF2ZSA9IG5vdGVQYXJ0c1swXS5tYXRjaCgvXFxkL2cpO1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbMF0gKyAoaGFzT2N0YXZlID8gXCJcIiA6IG9jdGF2ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGNvbnN0IGhhc09jdGF2ZSA9IG5vdGVQYXJ0c1tub3RlUGFydHMubGVuZ3RoIC0gMV0ubWF0Y2goL1xcZC9nKTtcclxuICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlUGFydHNbbm90ZVBhcnRzLmxlbmd0aCAtIDFdICsgKGhhc09jdGF2ZSA/IFwiXCIgOiBvY3RhdmVzW2ldKSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBjb25zdCBzaGlmdGVkTm90ZU5hbWVzID0gc2hpZnQobm90ZU5hbWVzLCBzY2FsZS5zaGlmdGVkSW50ZXJ2YWwoKSk7XHJcbiAgICAgICByZXR1cm4gc2hpZnRlZE5vdGVOYW1lcztcclxuICAgfTtcclxuICAgLyoqXHJcbiAgICAqIGNyZWF0ZXMgYSBsb29rdXAgdGFibGUgZm9yIGFsbCBub3RlcyBmb3JtYXR0ZWQgYXMgW0EtR11bI3xifHNdWzAtOV1cclxuICAgICovXHJcbiAgIGNvbnN0IGNyZWF0ZU5vdGVzTG9va3VwVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCBzY2FsZVRhYmxlID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpdG9uZSA9IFRPTkVTX01JTjsgaXRvbmUgPCBUT05FU19NSU4gKyBPQ1RBVkVfTUFYOyBpdG9uZSsrKSB7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaW9jdGF2ZSA9IE9DVEFWRV9NSU47IGlvY3RhdmUgPD0gT0NUQVZFX01BWDsgaW9jdGF2ZSsrKSB7XHJcbiAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgT2JqZWN0LnZhbHVlcyhTY2FsZVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGl0b25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IGlvY3RhdmUsXHJcbiAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgIHNjYWxlVGFibGVbYCR7aXRvbmV9LSR7aW9jdGF2ZX0tJHtKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSl9YF0gPVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTm90ZU5hbWVMb29rdXAoc2NhbGUpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHNjYWxlVGFibGU7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIHRoZSBsb29rdXAgdGFibGUgYXMgc29vbiBhcyB0aGUgbW9kdWxlIGlzIGxvYWRlZFxyXG4gICAgKi9cclxuICAgbGV0IF9ub3Rlc0xvb2t1cCA9IHt9O1xyXG4gICBjb25zdCBub3Rlc0xvb2t1cCA9IChrZXkpID0+IHtcclxuICAgICAgIC8vIGJ1aWxkU2NhbGVOb3RlVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfbm90ZXNMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgY29uc3QgYnVpbGRTY2FsZU5vdGVUYWJsZSA9ICgpID0+IHtcclxuICAgICAgIC8vIGlmIChPYmplY3QuZW50cmllcyhfbm90ZXNMb29rdXApLmxlbmd0aCA+IDApIHJldHVybiBfbm90ZXNMb29rdXA7XHJcbiAgICAgICBfbm90ZXNMb29rdXAgPSBjcmVhdGVOb3Rlc0xvb2t1cFRhYmxlKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9ub3Rlc0xvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IHNjYWxlIG5vdGUgdGFibGVcIik7XHJcbiAgICAgICByZXR1cm4gX25vdGVzTG9va3VwO1xyXG4gICB9O1xuXG4gICAvKipcclxuICAgICogU2hvcnRjdXQgZm9yIG1vZGlmaWVyc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IGZsYXQgPSAtMTtcclxuICAgY29uc3QgZmxhdF9mbGF0ID0gLTI7XHJcbiAgIGNvbnN0IHNoYXJwID0gMTtcclxuICAgLyoqXHJcbiAgICAqIENob3JkIHRlbXBsYXRlc1xyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IENob3JkVGVtcGxhdGVzID0ge1xyXG4gICAgICAgbWFqOiBbMSwgMywgNV0sXHJcbiAgICAgICBtYWo0OiBbMSwgMywgNCwgNV0sXHJcbiAgICAgICBtYWo2OiBbMSwgMywgNSwgNl0sXHJcbiAgICAgICBtYWo2OTogWzEsIDMsIDUsIDYsIDldLFxyXG4gICAgICAgbWFqNzogWzEsIDMsIDUsIDddLFxyXG4gICAgICAgbWFqOTogWzEsIDMsIDUsIDcsIDldLFxyXG4gICAgICAgbWFqMTE6IFsxLCAzLCA1LCA3LCA5LCAxMV0sXHJcbiAgICAgICBtYWoxMzogWzEsIDMsIDUsIDcsIDksIDExLCAxM10sXHJcbiAgICAgICBtYWo3czExOiBbMSwgMywgNSwgNywgWzExLCBzaGFycF1dLFxyXG4gICAgICAgbWFqYjU6IFsxLCAzLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgbWluOiBbMSwgWzMsIGZsYXRdLCA1XSxcclxuICAgICAgIG1pbjQ6IFsxLCBbMywgZmxhdF0sIDQsIDVdLFxyXG4gICAgICAgbWluNjogWzEsIFszLCBmbGF0XSwgNSwgNl0sXHJcbiAgICAgICBtaW43OiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF1dLFxyXG4gICAgICAgbWluQWRkOTogWzEsIFszLCBmbGF0XSwgNSwgOV0sXHJcbiAgICAgICBtaW42OTogWzEsIFszLCBmbGF0XSwgNSwgNiwgOV0sXHJcbiAgICAgICBtaW45OiBbMSwgWzMsIGZsYXRdLCA1LCBbNywgZmxhdF0sIDldLFxyXG4gICAgICAgbWluMTE6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOSwgMTFdLFxyXG4gICAgICAgbWluMTM6IFsxLCBbMywgZmxhdF0sIDUsIFs3LCBmbGF0XSwgOSwgMTEsIDEzXSxcclxuICAgICAgIG1pbjdiNTogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdLCBbNywgZmxhdF1dLFxyXG4gICAgICAgZG9tNzogWzEsIDMsIDUsIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb205OiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTExOiBbMSwgMywgNSwgWzcsIGZsYXRdLCA5LCAxMV0sXHJcbiAgICAgICBkb20xMzogWzEsIDMsIDUsIFs3LCBmbGF0XSwgOSwgMTEsIDEzXSxcclxuICAgICAgIGRvbTdzNTogWzEsIDMsIFs1LCBzaGFycF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203YjU6IFsxLCAzLCBbNSwgZmxhdF0sIFs3LCBmbGF0XV0sXHJcbiAgICAgICBkb203Yjk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFs5LCBmbGF0XV0sXHJcbiAgICAgICBkb203czk6IFsxLCAzLCA1LCBbNywgZmxhdF0sIFs5LCBzaGFycF1dLFxyXG4gICAgICAgZG9tOXM1OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTliNTogWzEsIDMsIFs1LCBmbGF0XSwgWzcsIGZsYXRdLCA5XSxcclxuICAgICAgIGRvbTdzNXM5OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCBbOSwgc2hhcnBdXSxcclxuICAgICAgIGRvbTdzNWI5OiBbMSwgMywgWzUsIHNoYXJwXSwgWzcsIGZsYXRdLCBbOSwgZmxhdF1dLFxyXG4gICAgICAgZG9tN3MxMTogWzEsIDMsIDUsIFs3LCBmbGF0XSwgWzExLCBzaGFycF1dLFxyXG4gICAgICAgZGltOiBbMSwgWzMsIGZsYXRdLCBbNSwgZmxhdF1dLFxyXG4gICAgICAgZGltNzogWzEsIFszLCBmbGF0XSwgWzUsIGZsYXRdLCBbNywgZmxhdF9mbGF0XV0sXHJcbiAgICAgICBhdWc6IFsxLCAzLCBbNSwgc2hhcnBdXSxcclxuICAgICAgIHN1czI6IFsxLCAyLCA1XSxcclxuICAgICAgIHN1czQ6IFsxLCBbNCwgZmxhdF0sIDVdLFxyXG4gICAgICAgZmlmdGg6IFsxLCA1XSxcclxuICAgICAgIGI1OiBbMSwgWzUsIGZsYXRdXSxcclxuICAgICAgIHMxMTogWzEsIDUsIFsxMSwgc2hhcnBdXSxcclxuICAgfTtcclxuICAgT2JqZWN0LmtleXMoQ2hvcmRUZW1wbGF0ZXMpLmZvckVhY2goKGVsZW1lbnQpID0+IE9iamVjdC5mcmVlemUoQ2hvcmRUZW1wbGF0ZXNbZWxlbWVudF0pKTtcblxuICAgY29uc3QgREVGQVVMVF9DSE9SRF9URU1QTEFURSA9IFsxLCAzLCA1XTtcclxuICAgY29uc3QgREVGQVVMVF9TQ0FMRSA9IG5ldyBTY2FsZSgpO1xuXG4gICAvLyBpbXBvcnQgdGFibGUgZnJvbSBcIi4vbm90ZUxvb2t1cC5qc29uXCI7XHJcbiAgIC8qKlxyXG4gICAgKiBSZWdleCBmb3IgbWF0Y2hpbmcgbm90ZSBuYW1lLCBtb2RpZmllciwgYW5kIG9jdGF2ZVxyXG4gICAgKi9cclxuICAgY29uc3QgbmFtZVJlZ2V4ID0gLyhbQS1HXSkoPz1bXihdKlxcKSkvZztcclxuICAgY29uc3QgbW9kaWZpZXJSZWdleCA9IC8oI3xzfGIpKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IG9jdGF2ZVJlZ2V4ID0gLyhbMC05XSspKD89W14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IGNob3JkTmFtZVJlZ2V4ID0gLyhtaW58bWFqfGRpbXxhdWcpKD8hW14oXSpcXCkpL2c7XHJcbiAgIGNvbnN0IGFkZGl0aW9uc1JlZ2V4ID0gLyhbI3xzfGJdP1swLTldKykoPyFbXihdKlxcKSkvZztcclxuICAgLyoqXHJcbiAgICAqIEBwYXJhbSBjaG9yZCB0aGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICAqIEByZXR1cm5zIGEgdmFsaWQgQ2hvcmRJbml0aWFsaXplclxyXG4gICAgKiBAaW50ZXJuYWxcclxuICAgICovXHJcbiAgIGNvbnN0IHBhcnNlQ2hvcmQgPSAoY2hvcmQpID0+IHtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hvcmRMb29rdXAoY2hvcmQpO1xyXG4gICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgfVxyXG4gICAgICAgbGV0IG5vdGVJZGVuaWZpZXIgPSBcIlwiO1xyXG4gICAgICAgbGV0IG5vdGVNb2RpZmllciA9IDA7XHJcbiAgICAgICBsZXQgbm90ZU9jdGF2ZSA9IFwiXCI7XHJcbiAgICAgICBsZXQgY2hvcmROYW1lID0gXCJtYWpcIjtcclxuICAgICAgIGxldCBhZGRpdGlvbnMgPSBbXTtcclxuICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IGNob3JkLm1hdGNoKG5hbWVSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBtb2RpZmllck1hdGNoID0gY2hvcmQubWF0Y2gobW9kaWZpZXJSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICBjb25zdCBvY3RhdmVNYXRjaCA9IGNob3JkLm1hdGNoKG9jdGF2ZVJlZ2V4KT8uam9pbihcIlwiKS5zcGxpdChcIlwiKTtcclxuICAgICAgIGNvbnN0IGNob3JkTmFtZU1hdGNoID0gY2hvcmQubWF0Y2goY2hvcmROYW1lUmVnZXgpPy5qb2luKFwiXCIpO1xyXG4gICAgICAgY29uc3QgYWRkaXRpb25zTWF0Y2ggPSBjaG9yZC5tYXRjaChhZGRpdGlvbnNSZWdleCk/LmpvaW4oXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnNcclxuICAgICAgIGlmIChtb2RpZmllck1hdGNoKSB7XHJcbiAgICAgICAgICAgaWYgKG1vZGlmaWVyTWF0Y2gubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb21iaW5lIGFsbCBtb2RpZmllcnMgaW50byBhbiBvZmZlc2V0IHZhbHVlIHRvIGJlIGFkZGVkIHRvIHRoZSBzZW1pdG9uZVxyXG4gICAgICAgICAgICAgICBub3RlTW9kaWZpZXIgPSBtb2RpZmllck1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAubWFwKChpdGVtKSA9PiBwYXJzZU1vZGlmaWVyKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgbm90ZU1vZGlmaWVyID0gcGFyc2VNb2RpZmllcihtb2RpZmllck1hdGNoWzBdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAob2N0YXZlTWF0Y2gpIHtcclxuICAgICAgICAgICBjb25zdCBbb2N0YXZlXSA9IG9jdGF2ZU1hdGNoO1xyXG4gICAgICAgICAgIG5vdGVPY3RhdmUgPSBvY3RhdmU7XHJcbiAgICAgICB9XHJcbiAgICAgICBpZiAoY2hvcmROYW1lTWF0Y2gpIHtcclxuICAgICAgICAgICAvLyBjb25zdCBbbmFtZV0gPSBjaG9yZE5hbWVNYXRjaDtcclxuICAgICAgICAgICBjaG9yZE5hbWUgPSBjaG9yZE5hbWVNYXRjaDtcclxuICAgICAgIH1cclxuICAgICAgIGlmIChhZGRpdGlvbnNNYXRjaCkge1xyXG4gICAgICAgICAgIGFkZGl0aW9ucyA9IGFkZGl0aW9uc01hdGNoO1xyXG4gICAgICAgfVxyXG4gICAgICAgY29uc3QgaW50ZXJ2YWxzID0gW107XHJcbiAgICAgICBpZiAobmFtZU1hdGNoKSB7XHJcbiAgICAgICAgICAgY29uc3QgW25vdGVOYW1lXSA9IG5hbWVNYXRjaDtcclxuICAgICAgICAgICBub3RlSWRlbmlmaWVyID0gbm90ZU5hbWU7XHJcbiAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gMDtcclxuICAgICAgICAgICBpZiAobm90ZU1vZGlmaWVyKVxyXG4gICAgICAgICAgICAgICBtb2RpZmllciA9IG5vdGVNb2RpZmllcjtcclxuICAgICAgICAgICBjb25zdCB3cmFwcGVkVG9uZSA9IHdyYXAoZ2V0V2hvbGVUb25lRnJvbU5hbWUobm90ZUlkZW5pZmllcikgKyBtb2RpZmllciwgVE9ORVNfTUlOLCBUT05FU19NQVgpO1xyXG4gICAgICAgICAgIGNvbnN0IHNlbWl0b25lID0gd3JhcHBlZFRvbmUudmFsdWU7XHJcbiAgICAgICAgICAgbGV0IG9jdGF2ZSA9IDQ7XHJcbiAgICAgICAgICAgaWYgKG5vdGVPY3RhdmUpXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZSA9IGNsYW1wKHBhcnNlSW50KG5vdGVPY3RhdmUsIDEwKSwgT0NUQVZFX01JTiwgT0NUQVZFX01BWCk7XHJcbiAgICAgICAgICAgaW50ZXJ2YWxzLnB1c2goLi4uQ2hvcmRUZW1wbGF0ZXNbY2hvcmROYW1lXSk7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBhZGRpdGlvbiBvZiBhZGRpdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgbGV0IG1vZCA9IDA7XHJcbiAgICAgICAgICAgICAgIGlmIChhZGRpdGlvblswXSA9PT0gXCIjXCIgfHwgYWRkaXRpb25bMF0gPT09IFwic1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgYWRkaXRpb25zLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSBpZiAoYWRkaXRpb25bMF0gPT09IFwiYlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICBtb2QgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uTnVtID0gcGFyc2VJbnQoYWRkaXRpb24sIDEwKTtcclxuICAgICAgICAgICAgICAgaWYgKGludGVydmFscy5pbmNsdWRlcyhhZGRpdGlvbk51bSkpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaW50ZXJ2YWxzLmluZGV4T2YoYWRkaXRpb25OdW0pO1xyXG4gICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxzW2luZGV4XSA9IFthZGRpdGlvbk51bSwgbW9kXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIGludGVydmFscy5wdXNoKFthZGRpdGlvbk51bSwgbW9kXSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgcm9vdDogc2VtaXRvbmUsXHJcbiAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogaW50ZXJ2YWxzLFxyXG4gICAgICAgICAgIH07XHJcbiAgICAgICB9XHJcbiAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNob3JkIG5hbWVcIik7XHJcbiAgIH07XHJcbiAgIC8qKlxyXG4gICAgKiBAcmV0dXJucyBhIGxvb2t1cCB0YWJsZSBvZiBjaG9yZCBuYW1lcyBhbmQgdGhlaXIgaW5pdGlhbGl6ZXJzXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY3JlYXRlVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICBjb25zdCB0YWJsZSA9IHt9O1xyXG4gICAgICAgY29uc3Qgbm90ZUxldHRlcnMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCJdO1xyXG4gICAgICAgY29uc3Qgbm90ZU1vZGlmaWVycyA9IFtcImJcIiwgXCIjXCIsIFwic1wiXTtcclxuICAgICAgIGNvbnN0IHF1YWxpdGllcyA9IFtcIm1halwiLCBcIm1pblwiLCBcImRpbVwiLCBcImF1Z1wiLCBcInN1c1wiXTtcclxuICAgICAgIGNvbnN0IGFkZGl0aW9ucyA9IFtcclxuICAgICAgICAgICBcIlwiLFxyXG4gICAgICAgICAgIFwiMlwiLFxyXG4gICAgICAgICAgIFwiM1wiLFxyXG4gICAgICAgICAgIFwiNFwiLFxyXG4gICAgICAgICAgIFwiNVwiLFxyXG4gICAgICAgICAgIFwiNlwiLFxyXG4gICAgICAgICAgIFwiN1wiLFxyXG4gICAgICAgICAgIFwiOVwiLFxyXG4gICAgICAgICAgIFwiMTFcIixcclxuICAgICAgICAgICBcIjEzXCIsXHJcbiAgICAgICAgICAgXCJiMlwiLFxyXG4gICAgICAgICAgIFwiYjNcIixcclxuICAgICAgICAgICBcImI0XCIsXHJcbiAgICAgICAgICAgXCJiNVwiLFxyXG4gICAgICAgICAgIFwiYjZcIixcclxuICAgICAgICAgICBcImI3XCIsXHJcbiAgICAgICAgICAgXCJiOVwiLFxyXG4gICAgICAgICAgIFwiYjExXCIsXHJcbiAgICAgICAgICAgXCJiMTNcIixcclxuICAgICAgICAgICBcInMyXCIsXHJcbiAgICAgICAgICAgXCJzM1wiLFxyXG4gICAgICAgICAgIFwiczRcIixcclxuICAgICAgICAgICBcInM1XCIsXHJcbiAgICAgICAgICAgXCJzNlwiLFxyXG4gICAgICAgICAgIFwiczdcIixcclxuICAgICAgICAgICBcInM5XCIsXHJcbiAgICAgICAgICAgXCJzMTFcIixcclxuICAgICAgICAgICBcInMxM1wiLFxyXG4gICAgICAgICAgIFwiIzJcIixcclxuICAgICAgICAgICBcIiMzXCIsXHJcbiAgICAgICAgICAgXCIjNFwiLFxyXG4gICAgICAgICAgIFwiIzVcIixcclxuICAgICAgICAgICBcIiM2XCIsXHJcbiAgICAgICAgICAgXCIjN1wiLFxyXG4gICAgICAgICAgIFwiIzlcIixcclxuICAgICAgICAgICBcIiMxMVwiLFxyXG4gICAgICAgICAgIFwiIzEzXCIsXHJcbiAgICAgICAgICAgXCI3czExXCIsXHJcbiAgICAgICAgICAgXCI3IzExXCIsXHJcbiAgICAgICAgICAgXCI3YjlcIixcclxuICAgICAgICAgICBcIjcjOVwiLFxyXG4gICAgICAgICAgIFwiN2I1XCIsXHJcbiAgICAgICAgICAgXCI3IzVcIixcclxuICAgICAgICAgICBcIjdiOWI1XCIsXHJcbiAgICAgICAgICAgXCI3IzkjNVwiLFxyXG4gICAgICAgICAgIFwiN2IxM1wiLFxyXG4gICAgICAgICAgIFwiNyMxM1wiLFxyXG4gICAgICAgICAgIFwiOSM1XCIsXHJcbiAgICAgICAgICAgXCI5YjVcIixcclxuICAgICAgICAgICBcIjkjMTFcIixcclxuICAgICAgICAgICBcIjliMTFcIixcclxuICAgICAgICAgICBcIjkjMTNcIixcclxuICAgICAgICAgICBcIjliMTNcIixcclxuICAgICAgICAgICBcIjExIzVcIixcclxuICAgICAgICAgICBcIjExYjVcIixcclxuICAgICAgICAgICBcIjExIzlcIixcclxuICAgICAgICAgICBcIjExYjlcIixcclxuICAgICAgICAgICBcIjExIzEzXCIsXHJcbiAgICAgICAgICAgXCIxMWIxM1wiLFxyXG4gICAgICAgXTtcclxuICAgICAgIGZvciAoY29uc3QgcXVhbGl0eSBvZiBxdWFsaXRpZXMpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGl0aW9uIG9mIGFkZGl0aW9ucykge1xyXG4gICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGVMZXR0ZXIgb2Ygbm90ZUxldHRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAoJHtub3RlTGV0dGVyfSkke3F1YWxpdHl9JHthZGRpdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgICAgdGFibGVba2V5XSA9IHBhcnNlQ2hvcmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZU1vZGlmaWVyIG9mIG5vdGVNb2RpZmllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0ke25vdGVNb2RpZmllcn0pJHtxdWFsaXR5fSR7YWRkaXRpb259YDtcclxuICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldID0gcGFyc2VDaG9yZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBPQ1RBVkVfTUlOOyBpIDw9IE9DVEFWRV9NQVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgKCR7bm90ZUxldHRlcn0ke25vdGVNb2RpZmllcn0ke2l9KSR7cXVhbGl0eX0ke2FkZGl0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0gPSBwYXJzZUNob3JkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICB9O1xyXG4gICBsZXQgX2Nob3JkTG9va3VwID0ge307XHJcbiAgIC8qKlxyXG4gICAgKiBAcGFyYW0ga2V5IHRoZSBzdHJpbmcgdG8gbG9va3VwXHJcbiAgICAqIEByZXR1cm5zIGEgdmFsaWQgY2hvcmQgaW5pdGlhbGl6ZXJcclxuICAgICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUga2V5IGlzIG5vdCBhIHZhbGlkIGNob3JkXHJcbiAgICAqIEBpbnRlcm5hbFxyXG4gICAgKi9cclxuICAgY29uc3QgY2hvcmRMb29rdXAgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAvLyBidWlsZENob3JkVGFibGUoKTtcclxuICAgICAgIHJldHVybiBfY2hvcmRMb29rdXBba2V5XTtcclxuICAgfTtcclxuICAgLy8gcmVnaXN0ZXJJbml0aWFsaXplcigoKSA9PiB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH0pO1xyXG4gICAvLyBpZiAodGFibGUgJiYgT2JqZWN0LmtleXModGFibGUpLmxlbmd0aCA+IDApIHtcclxuICAgLy8gICAgX2Nob3JkTG9va3VwID0gdGFibGUgYXMgeyBba2V5OiBzdHJpbmddOiBDaG9yZEluaXRpYWxpemVyIH07XHJcbiAgIC8vIH0gZWxzZSB7XHJcbiAgIC8vICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgIC8vIH1cclxuICAgY29uc3QgYnVpbGRDaG9yZFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgLy8gaWYgKE9iamVjdC5lbnRyaWVzKF9jaG9yZExvb2t1cCkubGVuZ3RoID4gMCkgcmV0dXJuIF9jaG9yZExvb2t1cDtcclxuICAgICAgIF9jaG9yZExvb2t1cCA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgICAgICBPYmplY3QuZnJlZXplKF9jaG9yZExvb2t1cCk7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcImJ1aWx0IGNob3JkIHRhYmxlXCIpO1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmVudHJpZXMoX2Nob3JkTG9va3VwKS5sZW5ndGgpO1xyXG4gICAgICAgcmV0dXJuIF9jaG9yZExvb2t1cDtcclxuICAgfTtcblxuICAgLyoqXHJcbiAgICAqIENob3JkcyBjb25zaXN0IG9mIGEgcm9vdCBub3RlLCBvY3RhdmUsIGNob3JkIHRlbXBsYXRlLCBhbmQgYSBiYXNlIHNjYWxlLjxicj48YnI+XHJcbiAgICAqIFRoZSBjaG9yZCB0ZW1wbGF0ZSBpcyBhbiBhcnJheSBvZiBpbnRlZ2VycywgZWFjaCBpbnRlZ2VyIHJlcHJlc2VudGluZzxicj5cclxuICAgICogIGEgc2NhbGUgZGVncmVlIGZyb20gdGhlIGJhc2Ugc2NhbGUoZGVmYXVsdHMgdG8gbWFqb3IpLjxicj5cclxuICAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgaXMgdGhlIEksSUlJLFYgZGVub3RlZCBhcyBbMSwzLDVdPGJyPlxyXG4gICAgKiBDaG9yZEludGVydmFscyB1c2VkIGluIHRlbXBsYXRlcyBjYW4gYWxzbyBjb250YWluIGEgbW9kaWZpZXIsPGJyPlxyXG4gICAgKiBmb3IgYSBwYXJ0aWN1bGFyIHNjYWxlIGRlZ3JlZSwgc3VjaCBhcyBbMSwzLFs1LCAtMV1dPGJyPlxyXG4gICAgKiB3aGVyZSAtMSBpcyBmbGF0LCAwIGlzIG5hdHVyYWwsIGFuZCAxIGlzIHNoYXJwLjxicj5cclxuICAgICogSXQgY291bGQgYWxzbyBiZSB3cml0dGVuIGFzIFsxLDMsWzUsIG1vZGlmaWVyLmZsYXRdXTxicj5cclxuICAgICogaWYgeW91IGltcG9ydCBtb2RpZmllci5cclxuICAgICpcclxuICAgICogVGhlIGZvbGxvd2luZyBwcmVkZWZpbmVkIHRlbXBsYXRlcyBhcmUgYXZhaWxhYmxlOjxicj5cclxuICAgICogPHRhYmxlPlxyXG4gICAgKiA8dHI+XHJcbiAgICAqIDx0ZD5tYWo8L3RkPlxyXG4gICAgKiA8dGQ+bWFqNDwvdGQ+XHJcbiAgICAqIDx0ZD5tYWo2PC90ZD5cclxuICAgICogPHRkPm1hajY5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5tYWo3PC90ZD5cclxuICAgICogPHRkPm1hajk8L3RkPlxyXG4gICAgKiA8dGQ+bWFqMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWFqMTM8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1hajdzMTE8L3RkPlxyXG4gICAgKiA8dGQ+bWFqYjU8L3RkPlxyXG4gICAgKiA8dGQ+bWluPC90ZD5cclxuICAgICogPHRkPm1pbjQ8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPm1pbjY8L3RkPlxyXG4gICAgKiA8dGQ+bWluNzwvdGQ+XHJcbiAgICAqIDx0ZD5taW5BZGQ5PC90ZD5cclxuICAgICogPHRkPm1pbjY5PC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5taW45PC90ZD5cclxuICAgICogPHRkPm1pbjExPC90ZD5cclxuICAgICogPHRkPm1pbjEzPC90ZD5cclxuICAgICogPHRkPm1pbjdiNTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tNzwvdGQ+XHJcbiAgICAqIDx0ZD5kb205PC90ZD5cclxuICAgICogPHRkPmRvbTExPC90ZD5cclxuICAgICogPHRkPmRvbTEzPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5kb203czU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN2I1PC90ZD5cclxuICAgICogPHRkPmRvbTdzOTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203Yjk8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPmRvbTliNTwvdGQ+XHJcbiAgICAqIDx0ZD5kb205czU8L3RkPlxyXG4gICAgKiA8dGQ+ZG9tN3MxMTwvdGQ+XHJcbiAgICAqIDx0ZD5kb203czVzOTwvdGQ+XHJcbiAgICAqIDwvdHI+PHRyPlxyXG4gICAgKiA8dGQ+ZG9tN3M1Yjk8L3RkPlxyXG4gICAgKiA8dGQ+ZGltPC90ZD5cclxuICAgICogPHRkPmRpbTc8L3RkPlxyXG4gICAgKiA8dGQ+YXVnPC90ZD5cclxuICAgICogPC90cj48dHI+XHJcbiAgICAqIDx0ZD5zdXMyPC90ZD5cclxuICAgICogPHRkPnN1czQ8L3RkPlxyXG4gICAgKiA8dGQ+ZmlmdGg8L3RkPlxyXG4gICAgKiA8dGQ+YjU8L3RkPlxyXG4gICAgKiA8L3RyPjx0cj5cclxuICAgICogPHRkPnMxMTwvdGQ+XHJcbiAgICAqIDwvdHI+XHJcbiAgICAqIDwvdGFibGU+XHJcbiAgICAqXHJcbiAgICAqIEBleGFtcGxlXHJcbiAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICogaW1wb3J0IHsgQ2hvcmQgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xyXG4gICAgKiBpbXBvcnQge0Nob3JkVGVtcGxhdGV9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XHJcbiAgICAqIGltcG9ydCB7Q2hvcmRJbnRlcnZhbH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtNb2RpZmllcn0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICogaW1wb3J0IHtDaG9yZEluaXRpYWxpemVyfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiOy8vIFR5cGVzY3JpcHQgb25seSBpZiBuZWVkZWRcclxuICAgICogYGBgXHJcbiAgICAqL1xyXG4gICBjbGFzcyBDaG9yZCB7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBpbXBvcnQgeyBDaG9yZCwgQ2hvcmRUZW1wbGF0ZXMsIE1vZGlmaWVyIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvL2NyZWF0ZXMgYSBjaG9yZCB3aXRoIHRoZSBkZWZhdWx0KDEsMyw1KSB0ZW1wbGF0ZSwgcm9vdCBvZiBDLCBpbiB0aGUgNHRoIG9jdGF2ZVxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBjcmVhdGVzIGEgY2hvcmQgd2l0aCB0aGUgcHJlLWRlZmluZWQgZGltaW5pc2hlZCB0ZW1wbGF0ZSwgcm9vdCBvZiBFYiwgaW4gdGhlIDV0aCBvY3RhdmVcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKHtyb290OiAzLCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBDaG9yZFRlbXBsYXRlcy5kaW19KTtcclxuICAgICAgICAqXHJcbiAgICAgICAgKiAvLyBTdHJpbmcgcGFyc2luZyBzaG91bGQgZm9sbG93IHRoZSBmb3JtYXQ6IChyb290LW5vdGUtbmFtZVtzLCMsYl1bb2N0YXZlXSlbY2hvcmQtdGVtcGxhdGUtbmFtZXxbY2hvcmQtcXVhbGl0eV1bbW9kaWZpZXJzXV1cclxuICAgICAgICAqIC8vIGNyZWF0ZXMgYSBjaG9yZCBmcm9tIGEgc3RyaW5nXHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgnKEQ0KW1pbjQnKTtcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMpIHtcclxuICAgICAgICAgICBpZiAoIXZhbHVlcykge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi5ERUZBVUxUX0NIT1JEX1RFTVBMQVRFXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gREVGQVVMVF9TRU1JVE9ORTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUNob3JkKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gWy4uLihwYXJzZWQ/LnRlbXBsYXRlID8/IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSBwYXJzZWQ/Lm9jdGF2ZSA/PyBERUZBVUxUX09DVEFWRTtcclxuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gcGFyc2VkPy5yb290ID8/IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi4odmFsdWVzLnRlbXBsYXRlID8/IERFRkFVTFRfQ0hPUkRfVEVNUExBVEUpXTtcclxuICAgICAgICAgICAgICAgdGhpcy5vY3RhdmUgPSB2YWx1ZXMub2N0YXZlID8/IERFRkFVTFRfT0NUQVZFO1xyXG4gICAgICAgICAgICAgICB0aGlzLnJvb3QgPSB2YWx1ZXMucm9vdCA/PyBERUZBVUxUX1NFTUlUT05FO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9iYXNlU2NhbGUgPSBuZXcgU2NhbGUoeyBrZXk6IHRoaXMuX3Jvb3QsIG9jdGF2ZTogdGhpcy5fb2N0YXZlIH0pO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaWQpOyAvLyBoYWw4OTM0aGxsXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgaWQgPSB1aWQoKTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogcm9vdFxyXG4gICAgICAgICovXHJcbiAgICAgICBfcm9vdCA9IERFRkFVTFRfU0VNSVRPTkU7XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQucm9vdCk7IC8vIDAoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHJvb3QoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNldHRpbmcgdGhlIHJvb3QgdG8gYSB2YWx1ZSBvdXRzaWRlIG9mIHRoZSByYW5nZSBbMCwgMTFdKHNlbWl0b25lKSB3aWxsPGJyLz5cclxuICAgICAgICAqIHdyYXAgdGhlIHNlbWl0b25lIHRvIHRoZSByYW5nZSBbMCwgMTFdIGFuZCBjaGFuZ2UgdGhlIG9jdGF2ZSBkZXBlbmRpbmc8YnIvPlxyXG4gICAgICAgICogb24gaG93IG1hbnkgdGltZXMgdGhlIHNlbWl0b25lIGhhcyBiZWVuIHdyYXBwZWQuXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLnJvb3QgPSA0OyAvLyBzZXRzIHRoZSByb290IHRvIDR0aCBzZW1pdG9uZShFKVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQucm9vdCk7IC8vIDQoc2VtaXRvbmUpXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgc2V0IHJvb3QodmFsdWUpIHtcclxuICAgICAgICAgICAvLyB0aGlzLl9yb290ID0gdmFsdWU7XHJcbiAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHdyYXAodmFsdWUsIFRPTkVTX01JTiwgVE9ORVNfTUFYKTtcclxuICAgICAgICAgICB0aGlzLl9yb290ID0gd3JhcHBlZC52YWx1ZTtcclxuICAgICAgICAgICB0aGlzLl9vY3RhdmUgPSB0aGlzLl9vY3RhdmUgKyB3cmFwcGVkLm51bVdyYXBzO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBiYXNlIHNjYWxlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9iYXNlU2NhbGUgPSBERUZBVUxUX1NDQUxFO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmJhc2VTY2FsZSk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCBzY2FsZShtYWpvcilcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBnZXQgYmFzZVNjYWxlKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLl9iYXNlU2NhbGU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE5vdCBhIGxvdCBvZiBnb29kIHJlYXNvbnMgdG8gY2hhbmdlIHRoaXMgZXhjZXB0IGZvciBleHBlcmltZW50YXRpb25cclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuYmFzZVNjYWxlID0gbmV3IFNjYWxlKHsga2V5OiAzLCBvY3RhdmU6IDUsIHRlbXBsYXRlOiBbMSwgWzMsIE1vZGlmaWVyLmZsYXRdLCA1XSB9KTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmJhc2VTY2FsZSk7IC8vIHByaW50cyB0aGUgbWlub3Igc2NhbGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgYmFzZVNjYWxlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgdGhpcy5fYmFzZVNjYWxlLm9jdGF2ZSA9IHRoaXMuX29jdGF2ZTtcclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogb2N0YXZlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9vY3RhdmUgPSBERUZBVUxUX09DVEFWRTtcclxuICAgICAgIC8qKlxyXG4gICAgICAgICogVGhlIG9jdGF2ZSBpcyBjbGFtcGVkIHRvIHRoZSByYW5nZSBbMCwgOV0uXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLm9jdGF2ZSk7IC8vIDQob2N0YXZlKVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBvY3RhdmUoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuX29jdGF2ZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5vY3RhdmUgPSA1OyAvLyBzZXRzIHRoZSBvY3RhdmUgdG8gNXRoXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5vY3RhdmUpOyAvLyA1KG9jdGF2ZSlcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgb2N0YXZlKHZhbHVlKSB7XHJcbiAgICAgICAgICAgdGhpcy5fb2N0YXZlID0gY2xhbXAodmFsdWUsIE9DVEFWRV9NSU4sIE9DVEFWRV9NQVgpO1xyXG4gICAgICAgICAgIHRoaXMuX2Jhc2VTY2FsZS5vY3RhdmUgPSB0aGlzLl9vY3RhdmU7XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIHRlbXBsYXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgIF90ZW1wbGF0ZSA9IFtdO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gcHJpbnRzIHRoZSBkZWZhdWx0IHRlbXBsYXRlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgIHJldHVybiBbLi4udGhpcy5fdGVtcGxhdGVdO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBUaGUgZm9sbG93aW5nIHByZWRlZmluZWQgdGVtcGxhdGVzIGFyZSBhdmFpbGFibGU6PGJyPlxyXG4gICAgICAgICogPHRhYmxlPlxyXG4gICAgICAgICogPHRyPlxyXG4gICAgICAgICogPHRkPm1hajwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNDwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqNjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWFqNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWFqMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1hajEzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPm1hajdzMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1hamI1PC90ZD5cclxuICAgICAgICAqIDx0ZD5taW48L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjQ8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWluNjwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluQWRkOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluNjk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+bWluOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+bWluMTE8L3RkPlxyXG4gICAgICAgICogPHRkPm1pbjEzPC90ZD5cclxuICAgICAgICAqIDx0ZD5taW43YjU8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tOTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tMTE8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTEzPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPmRvbTdzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN2I1PC90ZD5cclxuICAgICAgICAqIDx0ZD5kb203czk8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTdiOTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5kb205YjU8L3RkPlxyXG4gICAgICAgICogPHRkPmRvbTlzNTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3MxMTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1czk8L3RkPlxyXG4gICAgICAgICogPC90cj48dHI+XHJcbiAgICAgICAgKiA8dGQ+ZG9tN3M1Yjk8L3RkPlxyXG4gICAgICAgICogPHRkPmRpbTwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+ZGltNzwvdGQ+XHJcbiAgICAgICAgKiA8dGQ+YXVnPC90ZD5cclxuICAgICAgICAqIDwvdHI+PHRyPlxyXG4gICAgICAgICogPHRkPnN1czI8L3RkPlxyXG4gICAgICAgICogPHRkPnN1czQ8L3RkPlxyXG4gICAgICAgICogPHRkPmZpZnRoPC90ZD5cclxuICAgICAgICAqIDx0ZD5iNTwvdGQ+XHJcbiAgICAgICAgKiA8L3RyPjx0cj5cclxuICAgICAgICAqIDx0ZD5zMTE8L3RkPlxyXG4gICAgICAgICogPC90cj5cclxuICAgICAgICAqIDwvdGFibGU+XHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLnRlbXBsYXRlID0gWzEsIFszLCBNb2RpZmllci5mbGF0XSwgNV07IC8vIHNldHMgdGhlIHRlbXBsYXRlIHRvIGEgbWlub3IgY2hvcmRcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gcHJpbnRzIHRoZSBuZXcgdGVtcGxhdGVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFsuLi52YWx1ZV07XHJcbiAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIG5vdGVzXHJcbiAgICAgICAgKiBub3RlcyBhcmUgZ2VuZXJhdGVkIGFuZCBjYWNoZWQgYXMgbmVlZGVkXHJcbiAgICAgICAgKi9cclxuICAgICAgIF9ub3RlcyA9IFtdO1xyXG4gICAgICAgX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiB3aWxsIGdlbmVyYXRlIG5vdGVzIGlmIG5lZWRlZCBvciByZXR1cm4gdGhlIGNhY2hlZCBub3Rlc1xyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5ub3Rlcyk7IC8vIHByaW50cyB0aGUgZGVmYXVsdCBub3Rlc1xyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldCBub3RlcygpIHtcclxuICAgICAgICAgICBpZiAodGhpcy5fbm90ZXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5fbm90ZXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIGdlbmVyYXRlIG5vdGVzKGludGVybmFsKVxyXG4gICAgICAgICogZ2VuZXJhdGVzIHRoZSBub3RlcyBmb3IgdGhpcyBzY2FsZVxyXG4gICAgICAgICovXHJcbiAgICAgICBnZW5lcmF0ZU5vdGVzKCkge1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzID0gW107XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBsZXQgdG9uZSA9IDA7XHJcbiAgICAgICAgICAgICAgIGxldCBtb2QgPSAwO1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIHRvbmUgPSBpbnRlcnZhbFswXTtcclxuICAgICAgICAgICAgICAgICAgIG1vZCA9IGludGVydmFsWzFdO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgdG9uZSA9IGludGVydmFsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHRvbmU7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLl9iYXNlU2NhbGUuZGVncmVlKG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5vdGVUb25lID0gbm90ZS5zZW1pdG9uZTtcclxuICAgICAgICAgICAgICAgbm90ZS5zZW1pdG9uZSA9IG5vdGVUb25lICsgbW9kO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9ub3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcy5fbm90ZXM7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBub3RlIG5hbWVzIC0+IFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGdldE5vdGVOYW1lcygpIHtcclxuICAgICAgICAgICBjb25zdCBub3RlTmFtZXMgPSBbXTtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IG5vdGUgb2YgdGhpcy5ub3Rlcykge1xyXG4gICAgICAgICAgICAgICBub3RlTmFtZXMucHVzaChub3RlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gbm90ZU5hbWVzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5jb3B5KCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5lcXVhbHMoY29weSkpOyAvLyB0cnVlXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgY29weSgpIHtcclxuICAgICAgICAgICByZXR1cm4gbmV3IENob3JkKHtcclxuICAgICAgICAgICAgICAgcm9vdDogdGhpcy5yb290LFxyXG4gICAgICAgICAgICAgICBvY3RhdmU6IHRoaXMub2N0YXZlLFxyXG4gICAgICAgICAgICAgICB0ZW1wbGF0ZTogWy4uLnRoaXMuX3RlbXBsYXRlXSxcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHBhcmFtIG90aGVyIHRoZSBvdGhlciBjaG9yZCB0byBjb21wYXJlIHRvXHJcbiAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSB0d28gY2hvcmRzIGFyZSBlcXVhbFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuY29weSgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZXF1YWxzKGNvcHkpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgICAgIHJldHVybiAodGhpcy5yb290ID09PSBvdGhlci5yb290ICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMub2N0YXZlID09PSBvdGhlci5vY3RhdmUgJiZcclxuICAgICAgICAgICAgICAgaXNFcXVhbCh0aGlzLl90ZW1wbGF0ZSwgb3RoZXIudGVtcGxhdGUpKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogbXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgbmF0cnVhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQubWlub3IoKTtcclxuICAgICAgICAqIGNob3JkLm1ham9yKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLDMsNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtYWpvcigpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaCgzKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IDM7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBuYXR1cmFsIDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLm1ham9yZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgbWFqb3JlZCgpIHtcclxuICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkubWFqb3IoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgbmF0dXJhbCAzcmRcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNYWpvcigpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzTWFqb3IoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqICBtdXRhdGVzIHRoZSBjaG9yZCBpbiBwbGFjZVxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgdGhlIGNob3JkIHdpdGggYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSxbMywtMV0sNV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBtaW5vcigpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbMywgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFszLCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDNyZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQubWlub3JlZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS50ZW1wbGF0ZSk7IC8vIFsxLFszLC0xXSw1XVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIG1pbm9yZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLm1pbm9yKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgM3JkXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzTWlub3IoKSk7IC8vIGZhbHNlXHJcbiAgICAgICAgKiBjaG9yZC5taW5vcigpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNNaW5vcigpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGlzTWlub3IoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmF1Z21lbnQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsIDMsIFs1LCBNb2RpZmllci5zaGFycF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgYXVnbWVudCgpIHtcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNSwgMV0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVbaW5kZXhdID0gWzUsIDFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnN0IGNvcHkgPSBjaG9yZC5hdWdtZW50ZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLnNoYXJwXV1cclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBhdWdtZW50ZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmF1Z21lbnQoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgc2hhcnAgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzQXVnbWVudGVkKCkpOyAvLyBmYWxzZVxyXG4gICAgICAgICogY2hvcmQuYXVnbWVudCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNBdWdtZW50ZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0F1Z21lbnRlZCgpIHtcclxuICAgICAgICAgICBmb3IgKGNvbnN0IGludGVydmFsIG9mIHRoaXMuX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSAmJiAoaW50ZXJ2YWxbMV0gPz8gMCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIE11dGF0ZXMgdGhlIGNob3JkIGluIHBsYWNlXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyB0aGUgY2hvcmQgd2l0aCBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNob3JkLmRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCAzLCBbNSwgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgZGltaW5pc2goKSB7XHJcbiAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVbaV0gPT09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gdGhpcy5fdGVtcGxhdGVbaV07XHJcbiAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnZhbFswXSA/PyAwKSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLnB1c2goWzUsIC0xXSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVtpbmRleF0gPSBbNSwgLTFdO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLl9ub3Rlc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQGNoYWluYWJsZVxyXG4gICAgICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCA1dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmRpbWluaXNoZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGRpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpLmRpbWluaXNoKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICAvKipcclxuICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNob3JkIGhhcyBhIGZsYXQgNXRoXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLmlzRGltaW5pc2hlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5pc0RpbWluaXNoZWQoKSk7IC8vIHRydWVcclxuICAgICAgICAqIGBgYFxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0RpbWluaXNoZWQoKSB7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDUgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY2hvcmQuaGFsZkRpbWluaXNoKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50ZW1wbGF0ZSk7IC8vIFsxLCBbMywgTW9kaWZpZXIuZmxhdF0sIFs1LCBNb2RpZmllci5mbGF0XSwgWzcsIE1vZGlmaWVyLmZsYXRdXVxyXG4gICAgICAgICpcclxuICAgICAgICAqL1xyXG4gICAgICAgaGFsZkRpbWluaXNoKCkge1xyXG4gICAgICAgICAgIHRoaXMubWlub3IoKTsgLy8gZ2V0IGZsYXQgM3JkXHJcbiAgICAgICAgICAgdGhpcy5kaW1pbmlzaCgpOyAvLyBnZXQgZmxhdCA1dGhcclxuICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RlbXBsYXRlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZVtpXSA9PT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB0aGlzLl90ZW1wbGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUucHVzaChbNywgLTFdKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlW2luZGV4XSA9IFs3LCAtMV07XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggYSBmbGF0IDMsNSwgYW5kIDd0aFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zdCBjb3B5ID0gY2hvcmQuaGFsZkRpbWluaXNoZWQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNvcHkudGVtcGxhdGUpOyAvLyBbMSwgMywgWzUsIE1vZGlmaWVyLmZsYXRdLCBbNywgTW9kaWZpZXIuZmxhdF1dXHJcbiAgICAgICAgKi9cclxuICAgICAgIGhhbGZEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5oYWxmRGltaW5pc2goKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hvcmQgaGFzIGEgZmxhdCAzLDUsIGFuZCA3dGhcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNIYWxmRGltaW5pc2hlZCgpKTsgLy8gZmFsc2VcclxuICAgICAgICAqIGNob3JkLmhhbGZEaW1pbmlzaCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuaXNIYWxmRGltaW5pc2hlZCgpKTsgLy8gdHJ1ZVxyXG4gICAgICAgICovXHJcbiAgICAgICBpc0hhbGZEaW1pbmlzaGVkKCkge1xyXG4gICAgICAgICAgIGxldCB0aGlyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGxldCBmaWZ0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgIGxldCBzZXZlbnRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiB0aGlzLl90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDcgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHNldmVudGggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGludGVydmFsWzBdID8/IDApID09PSA1ICYmIChpbnRlcnZhbFsxXSA/PyAwKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBmaWZ0aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoaW50ZXJ2YWxbMF0gPz8gMCkgPT09IDMgJiYgKGludGVydmFsWzFdID8/IDApID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdGhpcmQgJiYgZmlmdGggJiYgc2V2ZW50aDtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogTXV0YXRlcyB0aGUgY2hvcmQgaW4gcGxhY2VcclxuICAgICAgICAqIEBjaGFpbmFibGVcclxuICAgICAgICAqIEByZXR1cm5zIHRoZSBjaG9yZCB3aXRoIHdpdGggdGhlIGZpcnN0IG5vdGUgbW92ZWQgdG8gdGhlIGVuZCB1cCBvbmUgb2N0YXZlXHJcbiAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICogYGBgamF2YXNjcmlwdFxyXG4gICAgICAgICogY29uc3QgY2hvcmQgPSBuZXcgQ2hvcmQoKTtcclxuICAgICAgICAqIGNvbnNvbGUubG9nKGNob3JkLnRlbXBsYXRlKTsgLy8gWzEsMyw1XVxyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQuZ2V0Tm90ZU5hbWVzKCkpOyAvLyBbJ0M0JywgJ0U0JywgJ0c0J11cclxuICAgICAgICAqIGNob3JkLmludmVydCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMyw1LDFdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnRTQnLCAnRzQnLCAnQzUnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGludmVydCgpIHtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl90ZW1wbGF0ZVswXSk7XHJcbiAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5fdGVtcGxhdGVbMF0pKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlWzBdWzBdICs9IHRoaXMuX2Jhc2VTY2FsZS50ZW1wbGF0ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVswXSArPSB0aGlzLl9iYXNlU2NhbGUudGVtcGxhdGUubGVuZ3RoO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IHNoaWZ0KHRoaXMuX3RlbXBsYXRlLCB0aGlzLl90ZW1wbGF0ZS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IG5ld1RlbXBsYXRlO1xyXG4gICAgICAgICAgIHRoaXMuX25vdGVzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgfVxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBAY2hhaW5hYmxlXHJcbiAgICAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGNob3JkIHdpdGggd2l0aCB0aGUgZmlyc3Qgbm90ZSBtb3ZlZCB0byB0aGUgZW5kIHVwIG9uZSBvY3RhdmVcclxuICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICAgICAgKiBjb25zdCBjaG9yZCA9IG5ldyBDaG9yZCgpO1xyXG4gICAgICAgICogY29uc29sZS5sb2coY2hvcmQudGVtcGxhdGUpOyAvLyBbMSwzLDVdXHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC5nZXROb3RlTmFtZXMoKSk7IC8vIFsnQzQnLCAnRTQnLCAnRzQnXVxyXG4gICAgICAgICogY29uc3QgY29weSA9IGNob3JkLmludmVydGVkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjb3B5LnRlbXBsYXRlKTsgLy8gWzMsNSwxXVxyXG4gICAgICAgICogY29uc29sZS5sb2coY29weS5nZXROb3RlTmFtZXMoKSk7IC8vIFsnRTQnLCAnRzQnLCAnQzUnXVxyXG4gICAgICAgICogYGBgXHJcbiAgICAgICAgKi9cclxuICAgICAgIGludmVydGVkKCkge1xyXG4gICAgICAgICAgIHJldHVybiB0aGlzLmNvcHkoKS5pbnZlcnQoKTtcclxuICAgICAgIH1cclxuICAgICAgIC8qKlxyXG4gICAgICAgICogQHJldHVybnMgdGhlIHN0cmluZyBmb3JtIG9mIHRoZSBjaG9yZFxyXG4gICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAgICAqIGNvbnN0IGNob3JkID0gbmV3IENob3JkKCk7XHJcbiAgICAgICAgKiBjb25zb2xlLmxvZyhjaG9yZC50b1N0cmluZygpKTsgLy8gJyhDNCltYWonXHJcbiAgICAgICAgKiBgYGBcclxuICAgICAgICAqL1xyXG4gICAgICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKENob3JkVGVtcGxhdGVzKTtcclxuICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKENob3JkVGVtcGxhdGVzKS5tYXAoKHRlbXBsYXRlKSA9PiBKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpO1xyXG4gICAgICAgICAgIGNvbnN0IGluZGV4ID0gdmFsdWVzLmluZGV4T2YoSlNPTi5zdHJpbmdpZnkodGhpcy5fdGVtcGxhdGUpKTtcclxuICAgICAgICAgICBjb25zdCBwcmVmaXggPSBgKCR7U2VtaXRvbmUkMVt0aGlzLl9yb290XX0ke3RoaXMuX29jdGF2ZX0pYDtcclxuICAgICAgICAgICBjb25zdCBzdHIgPSBpbmRleCA+IC0xID8gcHJlZml4ICsga2V5c1tpbmRleF0gOiB0aGlzLmdldE5vdGVOYW1lcygpLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICB9XHJcbiAgIH1cblxuICAgLyoqXHJcbiAgICAqIEJ1aWxkcyBsb29rdXAgdGFibGVzIGZvciBtb3JlIHBlcmZvcm1hbnQgc3RyaW5nIHBhcnNpbmcuPGJyLz5cclxuICAgICogU2hvdWxkIG9ubHkob3B0aW9uYWxseSkgYmUgY2FsbGVkIG9uY2Ugc29vbiBhZnRlciB0aGUgbGlicmFyeSBpcyBsb2FkZWQgYW5kPGJyLz5cclxuICAgICogb25seSBpZiB5b3UgYXJlIHVzaW5nIHN0cmluZyBpbml0aWFsaXplcnMuXHJcbiAgICAqL1xyXG4gICBjb25zdCBidWlsZFRhYmxlcyA9ICgpID0+IHtcclxuICAgICAgIGJ1aWxkTm90ZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZE5vdGVTdHJpbmdUYWJsZSgpO1xyXG4gICAgICAgYnVpbGRTY2FsZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlTm90ZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZFNjYWxlTmFtZVRhYmxlKCk7XHJcbiAgICAgICBidWlsZENob3JkVGFibGUoKTtcclxuICAgfTtcblxuICAgZXhwb3J0cy5DaG9yZCA9IENob3JkO1xuICAgZXhwb3J0cy5DaG9yZFRlbXBsYXRlcyA9IENob3JkVGVtcGxhdGVzO1xuICAgZXhwb3J0cy5JbnN0cnVtZW50ID0gSW5zdHJ1bWVudDtcbiAgIGV4cG9ydHMuTW9kaWZpZXIgPSBNb2RpZmllciQxO1xuICAgZXhwb3J0cy5Ob3RlID0gTm90ZTtcbiAgIGV4cG9ydHMuU2NhbGUgPSBTY2FsZTtcbiAgIGV4cG9ydHMuU2NhbGVUZW1wbGF0ZXMgPSBTY2FsZVRlbXBsYXRlcztcbiAgIGV4cG9ydHMuU2VtaXRvbmUgPSBTZW1pdG9uZSQxO1xuICAgZXhwb3J0cy5idWlsZFRhYmxlcyA9IGJ1aWxkVGFibGVzO1xuXG4gICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSwgU2NhbGVUZW1wbGF0ZXMgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBEaXZpc2lvbmVkUmljaG5vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5cbnR5cGUgTGlnaHRTY2FsZSA9IHtcbiAgICBrZXk6IG51bWJlcixcbiAgICB0ZW1wbGF0ZVNsdWc6IHN0cmluZyxcbiAgICBzZW1pdG9uZXM6IG51bWJlcltdLFxufTtcblxuXG5jb25zdCBzY2FsZXNGb3JOb3RlcyA9IChub3RlczogTm90ZVtdLCBwYXJhbXM6IE11c2ljUGFyYW1zKTogU2NhbGVbXSA9PiB7XG4gICAgY29uc3Qgc2NhbGVzID0gbmV3IFNldDxMaWdodFNjYWxlPigpXG4gICAgLy8gRmlyc3QgYWRkIGFsbCBzY2FsZXNcbiAgICBmb3IgKGNvbnN0IHNjYWxlU2x1ZyBpbiBwYXJhbXMuc2NhbGVTZXR0aW5ncykge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHBhcmFtcy5zY2FsZVNldHRpbmdzW3NjYWxlU2x1Z107XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5lbmFibGVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzZW1pdG9uZT0wOyBzZW1pdG9uZSA8IDEyOyBzZW1pdG9uZSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUoe2tleTogc2VtaXRvbmUsIHRlbXBsYXRlOiBTY2FsZVRlbXBsYXRlc1tzY2FsZVNsdWddfSlcbiAgICAgICAgICAgICAgICBjb25zdCBzZW1pdG9uZXMgPSBzY2FsZS5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChzY2FsZS5rZXkgLSAxICsgMjQpICUgMTI7XG4gICAgICAgICAgICAgICAgaWYgKCFzZW1pdG9uZXMuaW5jbHVkZXMobGVhZGluZ1RvbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lcy5wdXNoKGxlYWRpbmdUb25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NhbGVzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogc2VtaXRvbmUsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlU2x1Zzogc2NhbGVTbHVnLFxuICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZXM6IHNlbWl0b25lcyxcbiAgICAgICAgICAgICAgICB9IGFzIExpZ2h0U2NhbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IG5vdGUuc2VtaXRvbmVcbiAgICAgICAgZm9yIChjb25zdCBzY2FsZSBvZiBzY2FsZXMpIHtcbiAgICAgICAgICAgIGlmICghc2NhbGUuc2VtaXRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgIHNjYWxlcy5kZWxldGUoc2NhbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIHNjYWxlcykge1xuICAgICAgICByZXQucHVzaChuZXcgU2NhbGUoe2tleTogc2NhbGUua2V5LCB0ZW1wbGF0ZTogU2NhbGVUZW1wbGF0ZXNbc2NhbGUudGVtcGxhdGVTbHVnXX0pKVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5cbmV4cG9ydCBjb25zdCBnZXRBdmFpbGFibGVTY2FsZXMgPSAodmFsdWVzOiB7XG4gICAgbGF0ZXN0RGl2aXNpb246IG51bWJlcixcbiAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzLFxuICAgIHBhcmFtczogTXVzaWNQYXJhbXMsXG4gICAgcmFuZG9tTm90ZXM6IEFycmF5PE5vdGU+LFxuICAgIGxvZ2dlcjogTG9nZ2VyLFxufSk6IEFycmF5PHtcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgdGVuc2lvbjogbnVtYmVyLFxufT4gPT4ge1xuICAgIGNvbnN0IHtsYXRlc3REaXZpc2lvbiwgZGl2aXNpb25lZFJpY2hOb3RlcywgcGFyYW1zLCByYW5kb21Ob3RlcywgbG9nZ2VyfSA9IHZhbHVlcztcbiAgICAvLyBHaXZlbiBhIG5ldyBjaG9yZCwgZmluZCBhdmFpbGFibGUgc2NhbGVzIGJhc2Ugb24gdGhlIHByZXZpb3VzIG5vdGVzXG4gICAgY29uc3QgY3VycmVudEF2YWlsYWJsZVNjYWxlcyA9IHNjYWxlc0Zvck5vdGVzKHJhbmRvbU5vdGVzLCBwYXJhbXMpXG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNjYWxlIG9mIGN1cnJlbnRBdmFpbGFibGVTY2FsZXMpIHtcbiAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgc2NhbGUsXG4gICAgICAgICAgICB0ZW5zaW9uOiAwLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxvZ2dlci5sb2coXCJjdXJyZW50QXZhaWxhYmxlU2NhbGVzXCIsIGN1cnJlbnRBdmFpbGFibGVTY2FsZXMpXG5cbiAgICAvLyBHbyBiYWNrIGEgZmV3IGNob3JkcyBhbmQgZmluZCB0aGUgc2NhbGVzIHRoYXQgYXJlIGF2YWlsYWJsZS5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgICBjb25zdCBkaXZpc2lvbiA9IGxhdGVzdERpdmlzaW9uIC0gKGkgKiBCRUFUX0xFTkdUSClcbiAgICAgICAgaWYgKCFkaXZpc2lvbmVkUmljaE5vdGVzW2RpdmlzaW9uXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm90ZXMgPSBkaXZpc2lvbmVkUmljaE5vdGVzW2RpdmlzaW9uXS5tYXAocmljaE5vdGUgPT4gcmljaE5vdGUubm90ZSlcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlU2NhbGVzID0gc2NhbGVzRm9yTm90ZXMobm90ZXMsIHBhcmFtcylcbiAgICAgICAgZm9yIChjb25zdCBwb3RlbnRpYWxTY2FsZSBvZiByZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYXZhaWxhYmxlU2NhbGVzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uZXF1YWxzKHBvdGVudGlhbFNjYWxlLnNjYWxlKSlcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIFNjYWxlIHdhc24ndCBhdmFpbGFibGUsIGluY3JlYXNlIHRlbnNpb25cbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbFNjYWxlLnRlbnNpb24gKz0gMjAgIC8vIEJhc2Ugb2YgaG93IGxvbmcgYWdvIGl0IHdhc1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbFNjYWxlLnRlbnNpb24gKz0gMTBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxTY2FsZS50ZW5zaW9uICs9IDVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxTY2FsZS50ZW5zaW9uICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmxvZyhcIlNjYWxlIFwiLCBwb3RlbnRpYWxTY2FsZS5zY2FsZS50b1N0cmluZygpLFwiIHdhc24ndCBhdmFpbGFibGUgYXQgZGl2aXNpb24gXCIsIGRpdmlzaW9uLCBcIiwgaW5jcmVhc2UgdGVuc2lvblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2dnZXIucHJpbnQoXCJBdmFpbGFibGUgc2NhbGVzXCIsIHJldClcblxuICAgIHJldHVybiByZXQuZmlsdGVyKGl0ZW0gPT4gaXRlbS50ZW5zaW9uIDwgMTApO1xufSIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IGNvbnN0IGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uID0gKHRlbnNpb246IFRlbnNpb24sIHZhbHVlczogVGVuc2lvblBhcmFtcyk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXMsXG4gICAgICAgICAgICBmcm9tTm90ZXNPdmVycmlkZSxcbiAgICAgICAgICAgIHRvTm90ZXMsXG4gICAgICAgICAgICBuZXdDaG9yZCxcbiAgICAgICAgICAgIGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UsXG4gICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nLFxuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgIHByZXZJbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgbWFpblBhcmFtcyxcbiAgICAgICAgICAgIGJlYXREaXZpc2lvbixcbiAgICAgICAgfSA9IHZhbHVlcztcbiAgICAvKlxuICAgIFxuICAgIEJhc2ljIGNpcmNsZSBvZiA1dGhzIHByb2dyZXNzaW9uOlxuXG4gICAgaWlpICAgICAgXG4gICAgdmkgICAgICAgICAoRGVjZXB0aXZlIHRvbmljKVxuICAgIGlpIDwtIElWICAgKFN1YmRvbWluYW50IGZ1bmN0aW9uKVxuICAgIFYgIC0+IHZpaSAgKERvbWluYW50IGZ1bmN0aW9uKVxuICAgIEkgICAgICAgICAgKFRvbmljIGZ1bmN0aW9uKVxuXG4gICAgQWRkaXRpb25hbGx5OlxuICAgIFYgLT4gdmkgaXMgdGhlIGRlY2VwdGl2ZSBjYWRlbmNlXG4gICAgSVYgLT4gSSBpcyB0aGUgcGxhZ2FsIGNhZGVuY2VcbiAgICBpaWkgLT4gSVYgaXMgYWxsb3dlZC5cblxuICAgIE9uY2Ugd2UgaGF2ZSBzdWJkb21pbmFudCBvciBkb21pbmFudCBjaG9yZHMsIHRoZXJlJ3Mgbm8gZ29pbmcgYmFjayB0byBpaWkgb3IgdmkuXG5cbiAgICBJIHdhbnQgdG8gY2hlY2sgcGFjaGVsYmVsIGNhbm9uIHByb2dyZXNzaW9uOlxuICAgICAgT0sgICBkZWNlcHRpdmU/ICAgbWF5YmUgc2luY2Ugbm8gZnVuY3Rpb24gICAgIE9LICAgIE9LIGlmIGl0cyBpNjQgICBPayBiZWNhdXNlIGl0cyB0b25pYy4gT0sgICBPS1xuICAgIEkgLT4gViAgICAtPiAgICAgdmkgICAgICAgICAtPiAgICAgICAgICAgICAgaWlpIC0+IElWICAgICAtPiAgICAgICAgSSAgICAgICAgIC0+ICAgICAgICBJViAgLT4gViAtPiBJXG5cbiAgICAqL1xuICAgIGNvbnN0IHByb2dyZXNzaW9uQ2hvaWNlczogeyBba2V5OiBzdHJpbmddOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgbnVsbCB9ID0ge1xuICAgICAgICAwOiBudWxsLCAgICAgICAgICAgICAgICAgIC8vIEkgY2FuIGdvIGFueXdoZXJlXG4gICAgICAgIDE6IFsnZG9taW5hbnQnLCBdLCAgICAgICAgLy8gaWkgY2FuIGdvIHRvIFYgb3IgdmlpIG9yIGRvbWluYW50XG4gICAgICAgIDI6IFs1LCAzXSwgICAgICAgICAgICAgICAgLy8gaWlpIGNhbiBnbyB0byB2aSBvciBJVlxuICAgICAgICAzOiBbMSwgMiwgJ2RvbWluYW50J10sICAgIC8vIElWIGNhbiBnbyB0byBJLCBpaSBvciBkb21pbmFudFxuICAgICAgICA0OiBbMCwgNiwgJ2RvbWluYW50JywgNV0sIC8vIFYgY2FuIGdvIHRvIEksIHZpaSBvciBkb21pbmFudCBvciB2aVxuICAgICAgICA1OiBbJ3N1Yi1kb21pbmFudCcsIDJdLCAgICAgIC8vIHZpIGNhbiBnbyB0byBpaSwgSVYsIChvciBpaWkpXG4gICAgICAgIDY6IFswXSwgICAgICAgICAgICAgICAgICAgLy8gdmlpIGNhbiBnbyB0byBJXG4gICAgfVxuICAgIGxldCB3YW50ZWRGdW5jdGlvbiA9IG51bGw7XG4gICAgbGV0IHRyeVRvR2V0TGVhZGluZ1RvbmVJblBhcnQwID0gZmFsc2U7XG4gICAgbGV0IHBhcnQwTXVzdEJlVG9uaWMgPSBmYWxzZTtcblxuICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlICYmIGludmVyc2lvbk5hbWUpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5zZWxlY3RlZENhZGVuY2UgPT0gXCJQQUNcIikge1xuICAgICAgICAgICAgaWYgKGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPD0gNSkge1xuICAgICAgICAgICAgICAgIHdhbnRlZEZ1bmN0aW9uID0gXCJzdWItZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID09IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgICAgICB0cnlUb0dldExlYWRpbmdUb25lSW5QYXJ0MCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgICAgICAgICBwYXJ0ME11c3RCZVRvbmljID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgIWludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IFwiY2FkZW5jZSBQQUM6IE5PVCByb290IGludmVyc2lvbiEgXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc2VsZWN0ZWRDYWRlbmNlID09IFwiSUFDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDUpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgd2FudGVkRnVuY3Rpb24gPSBcImRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMgJiYgaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAvLyBOb3Qgcm9vdCBpbnZlcnNpb25cbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gXCJjYWRlbmNlIElBQzogcm9vdCBpbnZlcnNpb24hIFwiO1xuICAgICAgICAgICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlbGVjdGVkQ2FkZW5jZSA9PSBcIkhDXCIpIHtcbiAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwic3ViLWRvbWluYW50XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSA8IDIpIHtcbiAgICAgICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwiZG9taW5hbnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmV2Q2hvcmQ7XG4gICAgbGV0IHByZXZQcmV2Q2hvcmQ7XG4gICAgbGV0IHBhc3NlZEZyb21Ob3RlczogTm90ZVtdID0gW107XG4gICAgbGV0IHByZXZQYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBsYXRlc3ROb3RlczogTm90ZVtdID0gW107XG4gICAgaWYgKGRpdmlzaW9uZWROb3Rlcykge1xuICAgICAgICBjb25zdCBsYXRlc3REaXZpc2lvbiA9IGJlYXREaXZpc2lvbiAtIEJFQVRfTEVOR1RIO1xuICAgICAgICBsZXQgdG1wIDogQXJyYXk8Tm90ZT4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uXSB8fCBbXSkpIHtcbiAgICAgICAgICAgIC8vIFVzZSBvcmlnaW5hbCBub3Rlcywgbm90IHRoZSBvbmVzIHRoYXQgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIE5BQ3NcbiAgICAgICAgICAgIHRtcFtyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICBwcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIChkaXZpc2lvbmVkTm90ZXNbbGF0ZXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSF0gfHwgW10pKSB7XG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldlByZXZDaG9yZCA9IHJpY2hOb3RlLmNob3JkO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQYXNzZWRGcm9tTm90ZXMgPSBbLi4udG1wXS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZm9yIChsZXQgaT1iZWF0RGl2aXNpb247IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2ldIHx8IFtdKSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXRlc3ROb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUub3JpZ2luYWxOb3RlIHx8IHJpY2hOb3RlLm5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXMuZXZlcnkoQm9vbGVhbikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcHJldkNob3JkKSB7XG4gICAgICAgICAgICB3YW50ZWRGdW5jdGlvbiA9IFwidG9uaWNcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZnJvbU5vdGVzT3ZlcnJpZGUpIHtcbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gZnJvbU5vdGVzT3ZlcnJpZGU7XG4gICAgfVxuXG4gICAgbGV0IGZyb21Ob3RlcztcbiAgICBpZiAocGFzc2VkRnJvbU5vdGVzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgZnJvbU5vdGVzID0gdG9Ob3RlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tTm90ZXMgPSBwYXNzZWRGcm9tTm90ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgdG9TZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZXMgPSBmcm9tTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG5cbiAgICAvLyBJZiB0aGUgbm90ZXMgYXJlIG5vdCBpbiB0aGUgY3VycmVudCBzY2FsZSwgaW5jcmVhc2UgdGhlIHRlbnNpb25cbiAgICBjb25zdCBsZWFkaW5nVG9uZSA9IChjdXJyZW50U2NhbGUua2V5IC0gMSArIDI0KSAlIDEyXG5cbiAgICBpZiAodHJ5VG9HZXRMZWFkaW5nVG9uZUluUGFydDAgJiYgdG9HbG9iYWxTZW1pdG9uZXNbMF0gJSAxMiAhPSBsZWFkaW5nVG9uZSkge1xuICAgICAgICAvLyBpbiBQQUMsIHdlIHdhbnQgdGhlIGxlYWRpbmcgdG9uZSBpbiBwYXJ0IDAgaW4gdGhlIGRvbWluYW50XG4gICAgICAgIHRlbnNpb24uY2FkZW5jZSArPSA1O1xuICAgIH1cblxuICAgIGNvbnN0IHNlbWl0b25lU2NhbGVJbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHtcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZV06IDAsICAvLyBDXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMV0uc2VtaXRvbmVdOiAxLCAgLy8gRFxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMiwgIC8vIEVcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1szXS5zZW1pdG9uZV06IDMsICAvLyBGXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNF0uc2VtaXRvbmVdOiA0LCAgLy8gR1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSwgIC8vIEFcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s2XS5zZW1pdG9uZV06IDYsICAvLyBIXG4gICAgICAgIFsoY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lIC0gMSArIDI0KSAlIDEyXTogNiAgLy8gRm9yY2UgYWRkIGxlYWRpbmcgdG9uZVxuICAgIH1cblxuICAgIGNvbnN0IHRvU2NhbGVJbmRleGVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBzZW1pdG9uZVNjYWxlSW5kZXhbbm90ZS5zZW1pdG9uZV0pO1xuXG4gICAgaWYgKHBhcnQwTXVzdEJlVG9uaWMgJiYgdG9TY2FsZUluZGV4ZXNbMF0gIT0gMCkge1xuICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTA7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UG9zc2libGVGdW5jdGlvbnMgPSAoY2hvcmQ6IENob3JkKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvb3RTZW1pdG9uZSA9IGNob3JkLm5vdGVzWzBdLnNlbWl0b25lO1xuICAgICAgICBjb25zdCByb290U2NhbGVJbmRleCA9IHNlbWl0b25lU2NhbGVJbmRleFtyb290U2VtaXRvbmVdO1xuXG4gICAgICAgIGNvbnN0IHBvc3NpYmxlVG9GdW5jdGlvbnM6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHtcbiAgICAgICAgICAgICd0b25pYyc6IHRydWUsXG4gICAgICAgICAgICAnc3ViLWRvbWluYW50JzogdHJ1ZSxcbiAgICAgICAgICAgICdkb21pbmFudCc6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvb3RTY2FsZUluZGV4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9ucy50b25pYyA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9uc1snc3ViLWRvbWluYW50J10gPSBmYWxzZTtcbiAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVsxLCAzXS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHsgLy8gaWksIElWXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zW1wic3ViLWRvbWluYW50XCJdID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFbMCwgNCwgNl0uaW5jbHVkZXMocm9vdFNjYWxlSW5kZXgpKSB7IC8vIFYsIHZpaSwgSTY0XG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLmRvbWluYW50ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAocm9vdFNjYWxlSW5kZXggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgSSBpcyBub3Qgc2Vjb25kIGludmVyc2lvbiwgaXQncyBub3QgZG9taW5hbnRcbiAgICAgICAgICAgIGlmICghaW52ZXJzaW9uTmFtZSB8fCAhaW52ZXJzaW9uTmFtZS5zdGFydHNXaXRoKCdzZWNvbmQnKSkge1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlVG9GdW5jdGlvbnMuZG9taW5hbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSA1OyAgLy8gVHJ5IHRvIGF2b2lkIEk2NFxuICAgICAgICB9XG4gICAgICAgIGlmICghWzBdLmluY2x1ZGVzKHJvb3RTY2FsZUluZGV4KSkgeyAvLyBJXG4gICAgICAgICAgICBwb3NzaWJsZVRvRnVuY3Rpb25zLnRvbmljID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvb3RTY2FsZUluZGV4LFxuICAgICAgICAgICAgcG9zc2libGVUb0Z1bmN0aW9uczogT2JqZWN0LmtleXMocG9zc2libGVUb0Z1bmN0aW9ucykuZmlsdGVyKGtleSA9PiBwb3NzaWJsZVRvRnVuY3Rpb25zW2tleV0pLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmIChuZXdDaG9yZCAmJiBwcmV2Q2hvcmQgJiYgcHJldlByZXZDaG9yZCkge1xuICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgPT0gcHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTYW1lIHJvb3RcbiAgICAgICAgICAgIHRlbnNpb24uY2hvcmRQcm9ncmVzc2lvbiArPSAxO1xuICAgICAgICAgICAgaWYgKG5ld0Nob3JkLm5vdGVzWzBdLnNlbWl0b25lID09IHByZXZQcmV2Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBTYW1lIHJvb3QgYXMgcHJldmlvdXMgY2hvcmRcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZSA9PSBwcmV2UHJldkNob3JkLm5vdGVzWzBdLnNlbWl0b25lKSB7XG4gICAgICAgICAgICAvLyBTYW1lIHJvb3QgYXMgcHJldmlvdXMgY2hvcmQgKERvbid0IGdvIGJhY2spXG4gICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZXdDaG9yZCkge1xuICAgICAgICBjb25zdCByb290U2VtaXRvbmUgPSBuZXdDaG9yZC5ub3Rlc1swXS5zZW1pdG9uZTtcbiAgICAgICAgY29uc3Qgcm9vdFNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXhbcm9vdFNlbWl0b25lXTtcbiAgICAgICAgaWYgKG5ld0Nob3JkLmNob3JkVHlwZS5pbmNsdWRlcygnZG9tNycpKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGFsbG93IGluZGV4IGlpIGFuZCBWIGZvciBub3cuXG4gICAgICAgICAgICBpZiAoIVsxLCA0XS5pbmNsdWRlcyhyb290U2NhbGVJbmRleCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNob3JkUHJvZ3Jlc3Npb24gKz0gMTM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmV3Q2hvcmQgJiYgcHJldkNob3JkKSB7XG4gICAgICAgIGNvbnN0IGZyb21GdW5jdGlvbnMgPSBnZXRQb3NzaWJsZUZ1bmN0aW9ucyhwcmV2Q2hvcmQpO1xuICAgICAgICBjb25zdCB0b0Z1bmN0aW9ucyA9IGdldFBvc3NpYmxlRnVuY3Rpb25zKG5ld0Nob3JkKTtcbiAgICAgICAgY29uc3QgcG9zc2libGVUb0Z1bmN0aW9ucyA9IHRvRnVuY3Rpb25zLnBvc3NpYmxlVG9GdW5jdGlvbnM7XG5cbiAgICAgICAgY29uc3QgcHJvZ3Jlc3Npb25zID0gcHJvZ3Jlc3Npb25DaG9pY2VzW2Zyb21GdW5jdGlvbnMucm9vdFNjYWxlSW5kZXhdO1xuICAgICAgICBpZiAocHJvZ3Jlc3Npb25zKSB7XG4gICAgICAgICAgICBsZXQgZ29vZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9ncmVzc2lvbiBvZiBwcm9ncmVzc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYCR7cHJvZ3Jlc3Npb259YCA9PSBgJHt0b0Z1bmN0aW9ucy5yb290U2NhbGVJbmRleH1gKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBlcmZlY3QgcHJvZ3Jlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgZ29vZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb2dyZXNzaW9uID09IFwic3RyaW5nXCIgJiYgdG9GdW5jdGlvbnMucG9zc2libGVUb0Z1bmN0aW9ucyAmJiB0b0Z1bmN0aW9ucy5wb3NzaWJsZVRvRnVuY3Rpb25zLmluY2x1ZGVzKHByb2dyZXNzaW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBnb29kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFnb29kKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jaG9yZFByb2dyZXNzaW9uICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbikge1xuICAgICAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwic3ViLWRvbWluYW50XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnMuaW5jbHVkZXMoXCJzdWItZG9taW5hbnRcIikpIHsvLyAmJiAhcG9zc2libGVUb0Z1bmN0aW9ucy5kb21pbmFudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnMuaW5jbHVkZXMoXCJkb21pbmFudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ICs9IGBXYW50ZWQgJHt3YW50ZWRGdW5jdGlvbn1gXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDU7ICAvLyBEb21pbmFudCBpc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdhbnRlZEZ1bmN0aW9uID09IFwiZG9taW5hbnRcIikge1xuICAgICAgICAgICAgICAgIGlmICghcG9zc2libGVUb0Z1bmN0aW9ucy5pbmNsdWRlcyhcImRvbWluYW50XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCArPSBgV2FudGVkICR7d2FudGVkRnVuY3Rpb259YFxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNhZGVuY2UgKz0gMTAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3YW50ZWRGdW5jdGlvbiA9PSBcInRvbmljXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBvc3NpYmxlVG9GdW5jdGlvbnMuaW5jbHVkZXMoXCJ0b25pY1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgKz0gYFdhbnRlZCAke3dhbnRlZEZ1bmN0aW9ufWBcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5jYWRlbmNlICs9IDEwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQge1xuICAgIGJ1aWxkVGFibGVzLFxuICAgIFNjYWxlLFxuICAgIE5vdGUsXG59IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9teWxvZ2dlclwiO1xuaW1wb3J0IHsgQ2hvcmQsIE51bGxhYmxlLCBEaXZpc2lvbmVkUmljaG5vdGVzLCBSaWNoTm90ZSwgQkVBVF9MRU5HVEgsIHNlbWl0b25lU2NhbGVJbmRleCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBSYW5kb21DaG9yZEdlbmVyYXRvciB9IGZyb20gXCIuL3JhbmRvbWNob3Jkc1wiO1xuaW1wb3J0IHsgZ2V0SW52ZXJzaW9ucyB9IGZyb20gXCIuL2ludmVyc2lvbnNcIjtcbmltcG9ydCB7IGdldFRlbnNpb24sIFRlbnNpb24gfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBhZGROb3RlQmV0d2VlbiwgYnVpbGRUb3BNZWxvZHkgfSBmcm9tIFwiLi9ub25jaG9yZHRvbmVzXCI7XG5pbXBvcnQgeyBhZGRIYWxmTm90ZXMgfSBmcm9tIFwiLi9oYWxmbm90ZXNcIjtcbmltcG9ydCB7IGdldEF2YWlsYWJsZVNjYWxlcyB9IGZyb20gXCIuL2F2YWlsYWJsZXNjYWxlc1wiO1xuaW1wb3J0IHsgYWRkRm9yY2VkTWVsb2R5LCBGb3JjZWRNZWxvZHlSZXN1bHQgfSBmcm9tIFwiLi9mb3JjZWRtZWxvZHlcIjtcbmltcG9ydCAqIGFzIHRpbWUgZnJvbSBcIi4vdGltZXJcIjsgXG5pbXBvcnQgeyBjaG9yZFByb2dyZXNzaW9uVGVuc2lvbiB9IGZyb20gXCIuL2Nob3JkcHJvZ3Jlc3Npb25cIjtcbmltcG9ydCB7IE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuXG5jb25zdCBHT09EX0NIT1JEX0xJTUlUID0gMjAwO1xuY29uc3QgR09PRF9DSE9SRFNfUEVSX0NIT1JEID0gMTA7XG5jb25zdCBCQURfQ0hPUkRfTElNSVQgPSA1MDA7XG5jb25zdCBCQURfQ0hPUkRTX1BFUl9DSE9SRCA9IDIwO1xuXG5cbmNvbnN0IHNsZWVwTVMgPSBhc3luYyAobXM6IG51bWJlcik6IFByb21pc2U8bnVsbD4gPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuY29uc3QgbWFrZUNob3JkcyA9IGFzeW5jIChtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpOiBQcm9taXNlPERpdmlzaW9uZWRSaWNobm90ZXM+ID0+IHtcbiAgICAvLyBnZW5lcmF0ZSBhIHByb2dyZXNzaW9uXG4gICAgLy8gVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyB0aGUgZW50aXJlIHNvbmcuXG4gICAgLy8gVGhlIGJhc2ljIGlkZWEgaXMgdGhhdCBcblxuICAgIC8vIFVudGlsIHRoZSBmaXJzdCBJQUMgb3IgUEFDLCBtZWxvZHkgYW5kIHJoeXRtIGlzIHJhbmRvbS4gKFRob3VnaCBlYWNoIGNhZGVuY2UgaGFzIGl0J3Mgb3duIG1lbG9kaWMgaGlnaCBwb2ludC4pXG5cbiAgICAvLyBUaGlzIG1lbG9keSBhbmQgcmh5dG0gaXMgcGFydGlhbGx5IHNhdmVkIGFuZCByZXBlYXRlZCBpbiB0aGUgbmV4dCBjYWRlbmNlcy5cbiAgICBjb25zdCBtYXhCZWF0cyA9IG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcblxuICAgIGxldCByZXN1bHQ6IERpdmlzaW9uZWRSaWNobm90ZXMgPSB7fTtcblxuICAgIGxldCBkaXZpc2lvbkJhbm5lZE5vdGVzOiB7W2tleTogbnVtYmVyXTogQXJyYXk8QXJyYXk8Tm90ZT4+fSA9IHt9XG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IHByZXZSZXN1bHQgPSByZXN1bHRbZGl2aXNpb24gLSBCRUFUX0xFTkdUSF07XG4gICAgICAgIGxldCBwcmV2Q2hvcmQgPSBwcmV2UmVzdWx0ID8gcHJldlJlc3VsdFswXS5jaG9yZCA6IG51bGw7XG4gICAgICAgIGxldCBwcmV2Tm90ZXM6IE5vdGVbXTtcbiAgICAgICAgbGV0IHByZXZJbnZlcnNpb25OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBjdXJyZW50U2NhbGU6IFNjYWxlIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgYmFubmVkTm90ZXNzID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbl07XG4gICAgICAgIGlmIChwcmV2UmVzdWx0KSB7XG4gICAgICAgICAgICBwcmV2Tm90ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgcHJldlJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSA9IHJpY2hOb3RlLmludmVyc2lvbk5hbWU7XG4gICAgICAgICAgICAgICAgY3VycmVudFNjYWxlID0gcmljaE5vdGUuc2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBwcmV2Tm90ZXMgPSBwcmV2Tm90ZXM7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0gbWFpblBhcmFtcy5jdXJyZW50Q2FkZW5jZVBhcmFtcyhkaXZpc2lvbik7XG4gICAgICAgIGNvbnN0IGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPSBwYXJhbXMuYmVhdHNVbnRpbENhZGVuY2VFbmQ7XG5cblxuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKFwiZGl2aXNpb25cIiwgZGl2aXNpb24sIHByZXZDaG9yZCA/IHByZXZDaG9yZC50b1N0cmluZygpIDogXCJudWxsXCIsIFwiIHNjYWxlIFwiLCBjdXJyZW50U2NhbGUgPyBjdXJyZW50U2NhbGUudG9TdHJpbmcoKSA6IFwibnVsbFwiKTtcbiAgICAgICAgY29uc3QgY3VycmVudEJlYXQgPSBNYXRoLmZsb29yKGRpdmlzaW9uIC8gQkVBVF9MRU5HVEgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2VcIiwgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSk7XG5cbiAgICAgICAgY29uc3QgcmFuZG9tR2VuZXJhdG9yID0gbmV3IFJhbmRvbUNob3JkR2VuZXJhdG9yKHBhcmFtcylcbiAgICAgICAgbGV0IG5ld0Nob3JkOiBOdWxsYWJsZTxDaG9yZD4gPSBudWxsO1xuXG4gICAgICAgIGxldCBnb29kQ2hvcmRzOiBSaWNoTm90ZVtdW10gPSBbXVxuICAgICAgICBjb25zdCBiYWRDaG9yZHM6IHt0ZW5zaW9uOiBUZW5zaW9uLCBjaG9yZDogc3RyaW5nfVtdID0gW11cblxuICAgICAgICBjb25zdCByYW5kb21Ob3RlczogQXJyYXk8Tm90ZT4gPSBbXTtcblxuICAgICAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIGxldCBza2lwTG9vcCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChwYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPT0gMSAmJiBwcmV2Tm90ZXMpIHtcbiAgICAgICAgICAgIC8vIEZvcmNlIHNhbWUgY2hvcmQgdHdpY2VcbiAgICAgICAgICAgIGdvb2RDaG9yZHMuc3BsaWNlKDAsIGdvb2RDaG9yZHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGdvb2RDaG9yZHMucHVzaChwcmV2Tm90ZXMubWFwKChub3RlLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICBub3RlOiBub3RlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBCRUFUX0xFTkdUSCxcbiAgICAgICAgICAgICAgICBjaG9yZDogbmV3Q2hvcmQsXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25OYW1lOiBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICB0ZW5zaW9uOiBuZXcgVGVuc2lvbigpLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgICAgICB9IGFzIFJpY2hOb3RlKSkpO1xuICAgICAgICAgICAgc2tpcExvb3AgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCFza2lwTG9vcCAmJiBnb29kQ2hvcmRzLmxlbmd0aCA8IChjdXJyZW50QmVhdCAhPSAwID8gR09PRF9DSE9SRF9MSU1JVCA6IDUpKSB7XG4gICAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgICBuZXdDaG9yZCA9IHJhbmRvbUdlbmVyYXRvci5nZXRDaG9yZCgpO1xuICAgICAgICAgICAgY29uc3QgY2hvcmRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucyA+IDEwMDAwMCB8fCAhbmV3Q2hvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvbyBtYW55IGl0ZXJhdGlvbnMsIGdvaW5nIGJhY2tcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFpblBhcmFtcy5mb3JjZWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJlYXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmUgIT0gMCB8fCAhbmV3Q2hvcmQudG9TdHJpbmcoKS5pbmNsdWRlcygnbWFqJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIEMgbWFqb3Igc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1haW5QYXJhbXMuZm9yY2VkQ2hvcmRzICYmIGN1cnJlbnRTY2FsZSAmJiBuZXdDaG9yZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcmNlZENob3JkTnVtID0gcGFyc2VJbnQobWFpblBhcmFtcy5mb3JjZWRDaG9yZHNbY3VycmVudEJlYXRdKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGZvcmNlZENob3JkTnVtKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtaXRvbmVTY2FsZUluZGV4KGN1cnJlbnRTY2FsZSlbbmV3Q2hvcmQubm90ZXNbMF0uc2VtaXRvbmVdICE9IChmb3JjZWRDaG9yZE51bSAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBhbGxJbnZlcnNpb25zO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZVNjYWxlcztcblxuICAgICAgICAgICAgYXZhaWxhYmxlU2NhbGVzID0gZ2V0QXZhaWxhYmxlU2NhbGVzKHtcbiAgICAgICAgICAgICAgICBsYXRlc3REaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgZGl2aXNpb25lZFJpY2hOb3RlczogcmVzdWx0LFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzOiBuZXdDaG9yZC5ub3RlcyxcbiAgICAgICAgICAgICAgICBsb2dnZXI6IG5ldyBMb2dnZXIoY2hvcmRMb2dnZXIpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2NhbGUgJiYgKG1heEJlYXRzIC0gY3VycmVudEJlYXQgPCAzIHx8IGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2UgPCAzIHx8IGN1cnJlbnRCZWF0IDwgNSkpIHtcbiAgICAgICAgICAgICAgICAvLyBEb24ndCBhbGxvdyBvdGhlciBzY2FsZXMgdGhhbiB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVTY2FsZXMgPSBhdmFpbGFibGVTY2FsZXMuZmlsdGVyKHMgPT4gcy5zY2FsZS5lcXVhbHMoY3VycmVudFNjYWxlIGFzIFNjYWxlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXZhaWxhYmxlU2NhbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGxJbnZlcnNpb25zID0gZ2V0SW52ZXJzaW9ucyh7XG4gICAgICAgICAgICAgICAgY2hvcmQ6IG5ld0Nob3JkLCBwcmV2Tm90ZXM6IHByZXZOb3RlcywgYmVhdDogY3VycmVudEJlYXQsIHBhcmFtcywgbG9nZ2VyOiBuZXcgTG9nZ2VyKGNob3JkTG9nZ2VyKSxcbiAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5Tb25nOiBtYXhCZWF0cyAtIGN1cnJlbnRCZWF0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGludmVyc2lvblJlc3VsdCBvZiBhbGxJbnZlcnNpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdvb2RDaG9yZHMubGVuZ3RoID49IEdPT0RfQ0hPUkRfTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVyc2lvbkxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICAgICAgICAgICAgICBpbnZlcnNpb25Mb2dnZXIudGl0bGUgPSBbXCJJbnZlcnNpb24gXCIsIGAke2ludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lfWBdO1xuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzLnNwbGljZSgwLCByYW5kb21Ob3Rlcy5sZW5ndGgpOyAgLy8gRW1wdHkgdGhpcyBhbmQgcmVwbGFjZSBjb250ZW50c1xuICAgICAgICAgICAgICAgIHJhbmRvbU5vdGVzLnB1c2goLi4uaW52ZXJzaW9uUmVzdWx0Lm5vdGVzKTtcbiAgICAgICAgICAgICAgICBpZiAoYmFubmVkTm90ZXNzICYmIGJhbm5lZE5vdGVzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiYW5uZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJhbm5lZE5vdGVzIG9mIGJhbm5lZE5vdGVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZE5vdGVzLmxlbmd0aCAhPSByYW5kb21Ob3Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbU5vdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmRvbU5vdGVzW2ldLnRvU3RyaW5nKCkgIT0gYmFubmVkTm90ZXNbaV0udG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhbm5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYW5uZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFubmVkIG5vdGVzXCIsIHJhbmRvbU5vdGVzLm1hcChuID0+IG4udG9TdHJpbmcoKSksIFwiYmFubmVkTm90ZXNzXCIsIGJhbm5lZE5vdGVzcy5tYXAobiA9PiBuLm1hcChuID0+IG4udG9TdHJpbmcoKSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXZhaWxhYmxlU2NhbGUgb2YgYXZhaWxhYmxlU2NhbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRzLmxlbmd0aCA+PSBHT09EX0NIT1JEX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW5zaW9uUGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF0RGl2aXNpb246IGRpdmlzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RlczogcmFuZG9tTm90ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGU6IGF2YWlsYWJsZVNjYWxlLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG1heEJlYXRzIC0gY3VycmVudEJlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2SW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblJlc3VsdCA9IG5ldyBUZW5zaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQuaW52ZXJzaW9uVGVuc2lvbiA9IGludmVyc2lvblJlc3VsdC5yYXRpbmc7XG4gICAgICAgICAgICAgICAgICAgIGNob3JkUHJvZ3Jlc3Npb25UZW5zaW9uKHRlbnNpb25SZXN1bHQsIHRlbnNpb25QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvblJlc3VsdC5nZXRUb3RhbFRlbnNpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgIH0pIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFRlbnNpb24odGVuc2lvblJlc3VsdCwgdGVuc2lvblBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGF0aW9uV2VpZ2h0ID0gcGFyc2VGbG9hdCgoYCR7cGFyYW1zLm1vZHVsYXRpb25XZWlnaHQgfHwgXCIwXCJ9YCkpXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSBhdmFpbGFibGVTY2FsZS50ZW5zaW9uIC8gTWF0aC5tYXgoMC4wMSwgbW9kdWxhdGlvbldlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2NhbGUgJiYgIWF2YWlsYWJsZVNjYWxlLnNjYWxlLmVxdWFscyhjdXJyZW50U2NhbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMSAvIE1hdGgubWF4KDAuMDEsIG1vZHVsYXRpb25XZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZHVsYXRpb25XZWlnaHQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF4QmVhdHMgLSBjdXJyZW50QmVhdCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMYXN0IDIgYmFycywgZG9uJ3QgY2hhbmdlIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5tb2R1bGF0aW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlIDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGNoYW5nZSBzY2FsZSBpbiBsYXN0IDIgYmVhdHMgb2YgY2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb25SZXN1bHQubW9kdWxhdGlvbiArPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJlYXQgPCA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgY2hhbmdlIHNjYWxlIGluIGZpcnN0IDUgYmVhdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0Lm1vZHVsYXRpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW5zaW9uID0gdGVuc2lvblJlc3VsdC5nZXRUb3RhbFRlbnNpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2l2ZVVQID0gcHJvZ3Jlc3NDYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnaXZlVVApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lbG9keVJlc3VsdDogRm9yY2VkTWVsb2R5UmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVuc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIHBvc3NpYmxlIHRvIHdvcmsgd2l0aCB0aGUgbWVsb2R5P1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgc28sIGFkZCBtZWxvZHkgbm90ZXMgYW5kIE5BQ3MuXG4gICAgICAgICAgICAgICAgICAgICAgICBtZWxvZHlSZXN1bHQgPSBhZGRGb3JjZWRNZWxvZHkodGVuc2lvblBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uUmVzdWx0LmZvcmNlZE1lbG9keSArPSBtZWxvZHlSZXN1bHQudGVuc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZWxvZHlSZXN1bHQubmFjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5uYWMgPSBtZWxvZHlSZXN1bHQubmFjO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lbG9keVJlc3VsdC5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvblJlc3VsdC5jb21tZW50ID0gbWVsb2R5UmVzdWx0LmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uID0gdGVuc2lvblJlc3VsdC5nZXRUb3RhbFRlbnNpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbkxvZ2dlci5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGhpc0Nob3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBnb29kQ2hvcmQgb2YgZ29vZENob3Jkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRbMF0uY2hvcmQgJiYgZ29vZENob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQ2hvcmRDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hvcmRDb3VudCA+PSBHT09EX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB3b3JzdCBwcmV2aW91cyBnb29kQ2hvcmQgaWYgdGhpcyBoYXMgbGVzcyB0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcnN0Q2hvcmQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JzdENob3JkVGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnb29kQ2hvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RDaG9yZCA9IGdvb2RDaG9yZHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnb29kQ2hvcmRbMF0uY2hvcmQgJiYgZ29vZENob3JkWzBdLmNob3JkLnRvU3RyaW5nKCkgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChnb29kQ2hvcmRbMF0udGVuc2lvbj8udG90YWxUZW5zaW9uIHx8IDk5OSkgPCB3b3JzdENob3JkVGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcnN0Q2hvcmQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JzdENob3JkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChnb29kQ2hvcmRzW3dvcnN0Q2hvcmRdWzBdLnRlbnNpb24/LnRvdGFsVGVuc2lvbiB8fCA5OTkpID4gdGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCByZW1vdmUgdGhhdCBpbmRleCwgYWRkIGEgbmV3IG9uZSBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZENob3Jkcy5zcGxpY2Uod29yc3RDaG9yZCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hvcmRDb3VudCA8IEdPT0RfQ0hPUkRTX1BFUl9DSE9SRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RDaG9yZHMucHVzaChyYW5kb21Ob3Rlcy5tYXAoKG5vdGUsIGluZGV4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlOiBub3RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogQkVBVF9MRU5HVEgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzaW9uTmFtZTogaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRlbnNpb25SZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBhdmFpbGFibGVTY2FsZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJpY2hOb3RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRlbnNpb25SZXN1bHQudG90YWxUZW5zaW9uIDwgMTAwICYmIGJhZENob3Jkcy5sZW5ndGggPCBCQURfQ0hPUkRfTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaG9yZENvdW50SW5CYWRDaG9yZHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiYWRDaG9yZCBvZiBiYWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFkQ2hvcmQuY2hvcmQgPT0gbmV3Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9yZENvdW50SW5CYWRDaG9yZHMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hvcmRDb3VudEluQmFkQ2hvcmRzIDwgQkFEX0NIT1JEU19QRVJfQ0hPUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRDaG9yZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3JkOiBuZXdDaG9yZC50b1N0cmluZygpICsgXCIsXCIgKyBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogdGVuc2lvblJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAgLy8gRm9yIGF2YWlsYWJsZSBzY2FsZXMgZW5kXG4gICAgICAgICAgICB9ICAvLyBGb3Igdm9pY2VsZWFkaW5nIHJlc3VsdHMgZW5kXG4gICAgICAgIH0gIC8vIFdoaWxlIGVuZFxuICAgICAgICBpZiAoZ29vZENob3Jkcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiYWRDaG9yZCBvZiBiYWRDaG9yZHMpIHtcbiAgICAgICAgICAgICAgICBiYWRDaG9yZC50ZW5zaW9uLnByaW50KFwiQmFkIGNob3JkIFwiLCBiYWRDaG9yZC5jaG9yZCwgXCIgLSBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBzbGVlcE1TKDEpO1xuICAgICAgICAgICAgLy8gR28gYmFjayB0byBwcmV2aW91cyBjaG9yZCwgYW5kIG1ha2UgaXQgYWdhaW5cbiAgICAgICAgICAgIGlmIChkaXZpc2lvbiA+PSBCRUFUX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIGRpdmlzaW9uIC09IEJFQVRfTEVOR1RIICogMjtcbiAgICAgICAgICAgICAgICAvLyBNYXJrIHRoZSBwcmV2aW91cyBjaG9yZCBhcyBiYW5uZWRcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdCYW5uZWROb3RlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3QmFubmVkTm90ZXNbbm90ZS5wYXJ0SW5kZXhdID0gbm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgdGhlIHByZXZpb3VzIGNob3JkICh3aGVyZSB3ZSBhcmUgZ29pbmcgdG8pXG4gICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSA9IGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gfHwgW107XG4gICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5wdXNoKG5ld0Jhbm5lZE5vdGVzKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBhbnkgbm90ZXMgYWZ0ZXIgdGhhdCBhbHNvXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGRpdmlzaW9uICsgQkVBVF9MRU5HVEg7IGkgPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRpdmlzaW9uQmFubmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0ubGVuZ3RoID4gMTAgJiYgcmVzdWx0W2RpdmlzaW9uXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUb28gbWFueSBiYW5zLCBnbyBiYWNrIGZ1cnRoZXIuIFJlbW92ZSB0aGVzZSBiYW5zIHNvIHRoZXkgZG9uJ3QgaGluZGVyIGxhdGVyIHByb2dyZXNzLlxuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uIC09IEJFQVRfTEVOR1RIXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Jhbm5lZE5vdGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiByZXN1bHRbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Jhbm5lZE5vdGVzW25vdGUucGFydEluZGV4XSA9IG5vdGUubm90ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkaXZpc2lvbkJhbm5lZE5vdGVzW2RpdmlzaW9uICsgQkVBVF9MRU5HVEhdID0gZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aXNpb25CYW5uZWROb3Rlc1tkaXZpc2lvbiArIEJFQVRfTEVOR1RIXS5wdXNoKG5ld0Jhbm5lZE5vdGVzKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtkaXZpc2lvbiArIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGRpdmlzaW9uICsgQkVBVF9MRU5HVEg7IGkgPCBtYXhCZWF0cyAqIEJFQVRfTEVOR1RIOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFdlIGZhaWxlZCByaWdodCBhdCB0aGUgc3RhcnQuXG4gICAgICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByYW5kb21HZW5lcmF0b3IuY2xlYW5VcCgpO1xuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnaXZlVVAgPSBwcm9ncmVzc0NhbGxiYWNrKGN1cnJlbnRCZWF0IC0gMSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZiAoZ2l2ZVVQKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaG9vc2UgdGhlIGJlc3QgY2hvcmQgZnJvbSBnb29kQ2hvcmRzXG4gICAgICAgIGxldCBiZXN0Q2hvcmQgPSBnb29kQ2hvcmRzWzBdO1xuICAgICAgICBsZXQgYmVzdFRlbnNpb24gPSA5OTk7XG4gICAgICAgIGZvciAoY29uc3QgY2hvcmQgb2YgZ29vZENob3Jkcykge1xuICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNob3JkWzBdLnRlbnNpb24udG90YWxUZW5zaW9uIDwgYmVzdFRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYmVzdENob3JkID0gY2hvcmQ7XG4gICAgICAgICAgICAgICAgICAgIGJlc3RUZW5zaW9uID0gY2hvcmRbMF0udGVuc2lvbi50b3RhbFRlbnNpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNob3JkWzBdLnRlbnNpb24ucHJpbnQoY2hvcmRbMF0uY2hvcmQgPyBjaG9yZFswXS5jaG9yZC50b1N0cmluZygpIDogXCI/Q2hvcmQ/XCIsIGNob3JkWzBdLmludmVyc2lvbk5hbWUsIFwiYmVzdCB0ZW5zaW9uOiBcIiwgYmVzdFRlbnNpb24sIFwiOiBcIiwgYmVzdENob3JkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W2RpdmlzaW9uXSA9IGJlc3RDaG9yZDtcbiAgICAgICAgaWYgKGJlc3RDaG9yZFswXT8udGVuc2lvbj8ubmFjKSB7XG4gICAgICAgICAgICAvLyBBZGQgdGhlIHJlcXVpcmVkIE5vbiBDaG9yZCBUb25lXG4gICAgICAgICAgICBhZGROb3RlQmV0d2VlbihiZXN0Q2hvcmRbMF0udGVuc2lvbi5uYWMsIGRpdmlzaW9uLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCAwLCByZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrKGN1cnJlbnRCZWF0LCByZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmRvbUdlbmVyYXRvci5jbGVhblVwKCk7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlTXVzaWMocGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2s6IE51bGxhYmxlPEZ1bmN0aW9uPiA9IG51bGwpIHtcbiAgICBsZXQgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0ge307XG4gICAgZGl2aXNpb25lZE5vdGVzID0gYXdhaXQgbWFrZUNob3JkcyhwYXJhbXMsIHByb2dyZXNzQ2FsbGJhY2spO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gICAgLy8gY29uc3QgZGl2aXNpb25lZE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzID0gbmV3Vm9pY2VMZWFkaW5nTm90ZXMoY2hvcmRzLCBwYXJhbXMpO1xuICAgIGJ1aWxkVG9wTWVsb2R5KGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKTtcbiAgICAvLyBhZGRFaWdodGhOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIHBhcmFtcylcbiAgICAvLyBhZGRIYWxmTm90ZXMoZGl2aXNpb25lZE5vdGVzLCBwYXJhbXMpXG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGRpdmlzaW9uZWROb3RlczogZGl2aXNpb25lZE5vdGVzLFxuICAgIH1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU1lbG9keShkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIG1haW5QYXJhbXM6IE1haW5NdXNpY1BhcmFtcykge1xuICAgIC8vIFJlbW92ZSBvbGQgbWVsb2R5IGFuZCBtYWtlIGEgbmV3IG9uZVxuICAgIGNvbnN0IG1heEJlYXRzID0gbWFpblBhcmFtcy5nZXRNYXhCZWF0cygpXG5cbiAgICBmb3IgKGxldCBkaXZpc2lvbiA9IDA7IGRpdmlzaW9uIDwgbWF4QmVhdHMgKiBCRUFUX0xFTkdUSDsgZGl2aXNpb24rKykge1xuICAgICAgICBjb25zdCBvbkJlYXQgPSBkaXZpc2lvbiAlIEJFQVRfTEVOR1RIID09IDA7XG4gICAgICAgIGlmICghb25CZWF0KSB7XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dID0gW11cbiAgICAgICAgfSBlbHNlIGlmIChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dICYmIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5mb3JFYWNoKHJpY2hOb3RlID0+IHtcbiAgICAgICAgICAgICAgICByaWNoTm90ZS5kdXJhdGlvbiA9IEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIHJpY2hOb3RlLnRpZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIGNvbnN0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IG5ld1ZvaWNlTGVhZGluZ05vdGVzKGNob3JkcywgcGFyYW1zKTtcbiAgICAvLyBidWlsZFRvcE1lbG9keShkaXZpc2lvbmVkTm90ZXMsIG1haW5QYXJhbXMpO1xuICAgIC8vIGFkZEVpZ2h0aE5vdGVzKGRpdmlzaW9uZWROb3RlcywgcGFyYW1zKVxuICAgIC8vIGFkZEhhbGZOb3RlcyhkaXZpc2lvbmVkTm90ZXMsIG1haW5QYXJhbXMpXG59XG5cbmV4cG9ydCB7IGJ1aWxkVGFibGVzIH0iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBhZGROb3RlQmV0d2VlbiwgZmluZE5BQ3MsIEZpbmROb25DaG9yZFRvbmVQYXJhbXMsIE5vbkNob3JkVG9uZSB9IGZyb20gXCIuL25vbmNob3JkdG9uZXNcIjtcbmltcG9ydCB7IGdldFRlbnNpb24sIFRlbnNpb24sIFRlbnNpb25QYXJhbXMgfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdldE1lbG9keU5lZWRlZFRvbmVzLCBnZXRSaWNoTm90ZSwgZ2xvYmFsU2VtaXRvbmUsIGdUb25lU3RyaW5nLCBuZXh0R1RvbmVJblNjYWxlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc2VtaXRvbmVTY2FsZUluZGV4LCBzdGFydGluZ05vdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgdHlwZSBGb3JjZWRNZWxvZHlSZXN1bHQgPSB7XG4gICAgY29tbWVudDogc3RyaW5nLFxuICAgIHRlbnNpb246IG51bWJlcixcbiAgICBuYWM6IE5vbkNob3JkVG9uZSB8IG51bGwsXG59XG5cblxuXG5leHBvcnQgY29uc3QgYWRkRm9yY2VkTWVsb2R5ID0gKHZhbHVlczogVGVuc2lvblBhcmFtcyk6IEZvcmNlZE1lbG9keVJlc3VsdCA9PiB7XG4gICAgLypcbiAgICBcbiAgICAqL1xuICAgIGNvbnN0IHsgdG9Ob3RlcywgY3VycmVudFNjYWxlLCBwYXJhbXMsIG1haW5QYXJhbXMsIGJlYXREaXZpc2lvbiB9ID0gdmFsdWVzO1xuICAgIGNvbnN0IHtzdGFydGluZ0dsb2JhbFNlbWl0b25lcywgc2VtaXRvbmVMaW1pdHN9ID0gc3RhcnRpbmdOb3RlcyhwYXJhbXMpO1xuICAgIGNvbnN0IGNob3JkID0gdmFsdWVzLm5ld0Nob3JkO1xuICAgIGNvbnN0IGRpdmlzaW9uZWROb3RlcyA9IHZhbHVlcy5kaXZpc2lvbmVkTm90ZXMgfHwge307XG4gICAgY29uc3QgbWF4RGl2aXNpb24gPSBtYWluUGFyYW1zLmdldE1heEJlYXRzKCkgKiBCRUFUX0xFTkdUSDtcbiAgICBjb25zdCB0ZW5zaW9uOiBGb3JjZWRNZWxvZHlSZXN1bHQgPSB7XG4gICAgICAgIGNvbW1lbnQ6IFwiXCIsXG4gICAgICAgIHRlbnNpb246IDAsXG4gICAgICAgIG5hYzogbnVsbCxcbiAgICB9XG5cbiAgICBjb25zdCBtZWxvZHlUb25lc0FuZER1cmF0aW9ucyA9IGdldE1lbG9keU5lZWRlZFRvbmVzKG1haW5QYXJhbXMpO1xuICAgIGNvbnN0IG1lbG9keUV4aXN0cyA9IChtYWluUGFyYW1zLmZvcmNlZE1lbG9keSB8fCBbXSkubGVuZ3RoID4gMDtcbiAgICBpZiAoIW1lbG9keUV4aXN0cykge1xuICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50RGl2aXNpb24gPSBiZWF0RGl2aXNpb247XG4gICAgY29uc3QgY2FkZW5jZURpdmlzaW9uID0gY3VycmVudERpdmlzaW9uIC0gcGFyYW1zLmNhZGVuY2VTdGFydERpdmlzaW9uO1xuXG4gICAgLy8gU3Ryb25nIGJlYXQgbm90ZSBpcyBzdXBwb3NlZCB0byBiZSB0aGlzXG4gICAgbGV0IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2NhZGVuY2VEaXZpc2lvbl07XG4gICAgbGV0IG5ld01lbG9keVRvbmVEaXZpc2lvbiA9IGNhZGVuY2VEaXZpc2lvbjtcbiAgICBpZiAoIW5ld01lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAvLyBObyBtZWxvZHkgdG9uZSBmb3IgdGhpcyBkaXZpc2lvbiwgdGhlIHByZXZpb3VzIHRvbmUgbXVzdCBiZSBsZW5ndGh5LiBVc2UgaXQuXG4gICAgICAgIGZvciAobGV0IGkgPSBjYWRlbmNlRGl2aXNpb24gLSAxOyBpID49IGNhZGVuY2VEaXZpc2lvbiAtIEJFQVRfTEVOR1RIICogMjsgaS0tKSB7XG4gICAgICAgICAgICBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBtZWxvZHlUb25lc0FuZER1cmF0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBuZXdNZWxvZHlUb25lRGl2aXNpb24gPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uIHx8IG5ld01lbG9keVRvbmVBbmREdXJhdGlvbi50b25lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBObyBtZWxvZHkgZm91bmQgYXQgYWxsLiBHaXZlIHVwLlxuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIk5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXCI7XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld01lbG9keVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzW25ld01lbG9keVRvbmVBbmREdXJhdGlvbi50b25lXS5zZW1pdG9uZSArIDEgLSAxOyAgLy8gQ29udmVydCB0byBudW1iZXJcbiAgICBjb25zdCB0b1NlbWl0b25lcyA9IHRvTm90ZXMubWFwKCh4KSA9PiB4LnNlbWl0b25lKTtcblxuICAgIC8vIENhbiB3ZSB0dXJuIHRoaXMgbm90ZSBpbnRvIGEgbm9uLWNob3JkIHRvbmU/IENoZWNrIHRoZSBwcmV2aW91cyBhbmQgbmV4dCBub3RlLlxuICAgIGxldCBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uO1xuICAgIGxldCBuZXh0TWVsb2R5VG9uZURpdmlzaW9uO1xuICAgIGZvciAobGV0IGkgPSBuZXdNZWxvZHlUb25lRGl2aXNpb24gKyAxOyBpIDw9IG1heERpdmlzaW9uOyBpKyspIHtcbiAgICAgICAgbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiA9IG1lbG9keVRvbmVzQW5kRHVyYXRpb25zW2ldO1xuICAgICAgICBpZiAobmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAgICAgbmV4dE1lbG9keVRvbmVEaXZpc2lvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbiB8fCBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIG1lbG9keSBmb3VuZCBhdCBhbGwuIEdpdmUgdXAuXG4gICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiTm8gbWVsb2R5IGZvdW5kIGF0IGFsbC4gR2l2ZSB1cC5cIjtcbiAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgfVxuXG4gICAgLy8gTGV0J3Mgbm90IGNhcmUgdGhhdCBtdWNoIGlmIHRoZSB3ZWFrIGJlYXQgbm90ZSBpcyBub3QgY29ycmVjdC4gSXQganVzdCBhZGRzIHRlbnNpb24gdG8gdGhlIHJlc3VsdC5cbiAgICAvLyBVTkxFU1MgaXQncyBpbiB0aGUgbWVsb2R5IGFsc28uXG5cbiAgICAvLyBXaGF0IE5BQyBjb3VsZCB3b3JrP1xuICAgIC8vIENvbnZlcnQgYWxsIHZhbHVlcyB0byBnbG9iYWxTZW1pdG9uZXNcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lID0gZ2xvYmFsU2VtaXRvbmUodG9Ob3Rlc1swXSlcbiAgICBjb25zdCB0b0dsb2JhbFNlbWl0b25lcyA9IHRvTm90ZXMubWFwKCh4KSA9PiBnbG9iYWxTZW1pdG9uZSh4KSk7XG4gICAgbGV0IHByZXZSaWNoTm90ZTtcbiAgICBmb3IgKGxldCBpID0gY3VycmVudERpdmlzaW9uIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgcHJldlJpY2hOb3RlID0gKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkuZmlsdGVyKHJpY2hOb3RlID0+IHJpY2hOb3RlLnBhcnRJbmRleCA9PSAwKVswXTtcbiAgICAgICAgaWYgKHByZXZSaWNoTm90ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJldkJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbY3VycmVudERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKS5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IDApWzBdO1xuICAgIGxldCBwcmV2QmVhdEdsb2JhbFNlbWl0b25lID0gcHJldkJlYXRSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZCZWF0UmljaE5vdGUubm90ZSkgOiBudWxsO1xuXG4gICAgbGV0IHByZXZQYXJ0MVJpY2hOb3RlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50RGl2aXNpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBwcmV2UGFydDFSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbaV0gfHwgW10pLmZpbHRlcihyaWNoTm90ZSA9PiByaWNoTm90ZS5wYXJ0SW5kZXggPT0gMSlbMF07XG4gICAgICAgIGlmIChwcmV2UGFydDFSaWNoTm90ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBwcmV2aW91cyBub3RlIGRvZXNuJ3QgZXhpc3QsIHRoaXMgaXMgYWN0dWFsbHkgZWFzaWVyLlxuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZSA9IHByZXZSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG5cbiAgICAvLyBUcnlpbmcgdG8gZmlndXJlIG91dCB0aGUgbWVsb2R5IGRpcmVjdGlvbi4uLiBXZSBzaG91bGQgcHV0IG9jdGF2ZXMgaW4gdGhlIGZvcmNlZCBtZWxvZHkgc3RyaW5nLi4uXG4gICAgY29uc3QgY2xvc2VzdENvcnJlY3RHVG9uZUJhc2VkT24gPSBwcmV2QmVhdEdsb2JhbFNlbWl0b25lIHx8IGZyb21HbG9iYWxTZW1pdG9uZSB8fCB0b0dsb2JhbFNlbWl0b25lO1xuXG4gICAgbGV0IGNsb3Nlc3RDb3JyZWN0R1RvbmUgPSBuZXdNZWxvZHlTZW1pdG9uZTtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgd2hpbGUgKE1hdGguYWJzKGNsb3Nlc3RDb3JyZWN0R1RvbmUgLSBjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbikgPiA2ICYmIGNsb3Nlc3RDb3JyZWN0R1RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgaXRlcmF0aW9ucysrOyBpZiAoaXRlcmF0aW9ucyA+IDEwMCkgeyBkZWJ1Z2dlcjsgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgY2xvc2VzdENvcnJlY3RHVG9uZSArPSAxMiAqIE1hdGguc2lnbihjbG9zZXN0Q29ycmVjdEdUb25lQmFzZWRPbiAtIGNsb3Nlc3RDb3JyZWN0R1RvbmUpO1xuICAgIH1cblxuICAgIGxldCBuZXh0Q29ycmVjdEd0b25lO1xuICAgIGlmIChuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIG5leHRDb3JyZWN0R3RvbmUgPSBnbG9iYWxTZW1pdG9uZShjdXJyZW50U2NhbGUubm90ZXNbbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbi50b25lXSkgJSAxMjtcbiAgICAgICAgaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHdoaWxlIChNYXRoLmFicyhuZXh0Q29ycmVjdEd0b25lIC0gY2xvc2VzdENvcnJlY3RHVG9uZSkgPiA2ICYmIG5leHRDb3JyZWN0R3RvbmUgPD0gc2VtaXRvbmVMaW1pdHNbMF1bMV0pIHtcbiAgICAgICAgICAgIGl0ZXJhdGlvbnMrKzsgaWYgKGl0ZXJhdGlvbnMgPiAxMDApIHsgZGVidWdnZXI7IHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgICAgIG5leHRDb3JyZWN0R3RvbmUgKz0gMTIgKiBNYXRoLnNpZ24oY2xvc2VzdENvcnJlY3RHVG9uZSAtIG5leHRDb3JyZWN0R3RvbmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbmV4dENvcnJlY3RHdG9uZSB8fCAhbmV4dE1lbG9keVRvbmVBbmREdXJhdGlvbikge1xuICAgICAgICAvLyBJZiBtZWxvZHkgaGFzIGVuZGVkLCB1c2UgY3VycmVudCBtZWxvZHkgdG9uZS5cbiAgICAgICAgbmV4dENvcnJlY3RHdG9uZSA9IGNsb3Nlc3RDb3JyZWN0R1RvbmU7XG4gICAgICAgIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBuZXdNZWxvZHlUb25lQW5kRHVyYXRpb247XG4gICAgfVxuXG4gICAgbGV0IG5leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uID0gbWVsb2R5VG9uZXNBbmREdXJhdGlvbnNbY2FkZW5jZURpdmlzaW9uICsgQkVBVF9MRU5HVEhdO1xuICAgIGlmICghbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24pIHtcbiAgICAgICAgbmV4dEJlYXRNZWxvZHlUb25lQW5kRHVyYXRpb24gPSBuZXh0TWVsb2R5VG9uZUFuZER1cmF0aW9uO1xuICAgIH1cbiAgICBsZXQgbmV4dEJlYXRDb3JyZWN0R1RvbmU7XG4gICAgaWYgKG5leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uKSB7XG4gICAgICAgIG5leHRCZWF0Q29ycmVjdEdUb25lID0gZ2xvYmFsU2VtaXRvbmUoY3VycmVudFNjYWxlLm5vdGVzW25leHRCZWF0TWVsb2R5VG9uZUFuZER1cmF0aW9uLnRvbmVdKSAlIDEyO1xuICAgICAgICBpdGVyYXRpb25zID0gMDtcbiAgICAgICAgd2hpbGUgKE1hdGguYWJzKG5leHRCZWF0Q29ycmVjdEdUb25lIC0gbmV4dENvcnJlY3RHdG9uZSkgPiA2ICYmIG5leHRCZWF0Q29ycmVjdEdUb25lIDw9IHNlbWl0b25lTGltaXRzWzBdWzFdKSB7XG4gICAgICAgICAgICBpZiAoaXRlcmF0aW9ucysrID4gMTAwKSB7IHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IGl0ZXJhdGlvbnNcIik7IH1cbiAgICAgICAgICAgIG5leHRCZWF0Q29ycmVjdEdUb25lICs9IDEyICogTWF0aC5zaWduKG5leHRDb3JyZWN0R3RvbmUgLSBuZXh0QmVhdENvcnJlY3RHVG9uZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSAxOiB0aGUgcHJldmlvdXMgbm90ZSwgMjogd2hhdCB0aGUgY3VycmVudCBub3RlIHNob3VsZCBiZSwgMzogd2hhdCB0aGUgbmV4dCBub3RlIHNob3VsZCBiZS5cbiAgICAvLyBCYXNlZCBvbiB0aGUgcmVxdWlyZWQgZHVyYXRpb25zLCB3ZSBoYXZlIHNvbWUgY2hvaWNlczpcblxuICAgIC8vIDEuIEJlYXQgbWVsb2R5IGlzIGEgcXVhcnRlci4gVGhpcyBpcyB0aGUgZWFzaWVzdCBjYXNlLlxuICAgIC8vIEhlcmUgd2UgY2FuIGF0IHRoZSBtb3N0IHVzZSBhIDh0aC84dGggTkFDIG9uIHRoZSBzdHJvbmcgYmVhdC5cbiAgICAvLyBUaG91Z2gsIHRlbnNpb24gaXMgYWRkZWQuXG5cbiAgICAvLyAyLiBDdXJyZW50IGJlYXQgbWVsb2R5IGlzIDh0aCBhbmQgOHRoLiBCb3RoIG5vdGVzIE1VU1QgYmUgY29ycmVjdC5cbiAgICAvLyBCYXNlIG9uIHRoZSBuZXh0IG5vdGUgd2UgY2FuIHVzZSBzb21lIE5BQ3MuIFRoaXMgaXMgd2hlcmUgdGhlIHdlYWsgYmVhdCBOQUNzIGNvbWUgaW4uXG5cbiAgICAvLyAzLiBDdXJyZW50IGJlYXQgbWVsb2R5IGlzIGEgaGFsZiBub3RlLiBXZSBjYW4gdXNlIGEgc3Ryb25nIGJlYXQgTkFDLlxuICAgIC8vIFRlbnNpb24gaXMgYWRkZWQuXG5cbiAgICAvLyBIYXJkZXIgY2FzZXMsIHN1Y2ggYXMgc3luY29wYXRpb24sIGFyZSBub3QgaGFuZGxlZC4geWV0LlxuXG4gICAgbGV0IHBhcnQxTWF4R1RvbmUgPSBNYXRoLm1heCh0b0dsb2JhbFNlbWl0b25lc1sxXSwgcHJldlBhcnQxUmljaE5vdGUgPyBnbG9iYWxTZW1pdG9uZShwcmV2UGFydDFSaWNoTm90ZS5ub3RlKSA6IDApO1xuXG4gICAgY29uc3QgbmFjUGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHtcbiAgICAgICAgZnJvbUdUb25lOiBmcm9tR2xvYmFsU2VtaXRvbmUgfHwgY2xvc2VzdENvcnJlY3RHVG9uZSxcbiAgICAgICAgdGhpc0JlYXRHVG9uZTogdG9HbG9iYWxTZW1pdG9uZSxcbiAgICAgICAgbmV4dEJlYXRHVG9uZTogbmV4dEJlYXRDb3JyZWN0R1RvbmUsXG4gICAgICAgIHNjYWxlOiBjdXJyZW50U2NhbGUsXG4gICAgICAgIGNob3JkOiBjaG9yZCxcbiAgICAgICAgZ1RvbmVMaW1pdHM6IFtwYXJ0MU1heEdUb25lLCAxMjddLCAgLy8gVE9ET1xuICAgICAgICB3YW50ZWRHVG9uZXM6IFtdLFxuICAgIH1cblxuICAgIGNvbnN0IGVlU3Ryb25nTW9kZSA9IChcbiAgICAgICAgbmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9uID09IEJFQVRfTEVOR1RIIHx8XG4gICAgICAgIChcbiAgICAgICAgICAgIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyICYmIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSAmJlxuICAgICAgICAgICAgY2xvc2VzdENvcnJlY3RHVG9uZSAhPSB0b0dsb2JhbFNlbWl0b25lXG4gICAgICAgIClcbiAgICApXG5cbiAgICBpZiAoZWVTdHJvbmdNb2RlKSB7XG4gICAgICAgIGlmIChjbG9zZXN0Q29ycmVjdEdUb25lID09IHRvR2xvYmFsU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGNvcnJlY3Qgbm90ZS4gTm8gdGVuc2lvbi5cbiAgICAgICAgICAgIHRlbnNpb24uY29tbWVudCA9IFwiQ29ycmVjdCBxdWFydGVyIG5vdGVcIjtcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkZCBhIHJpZ2h0IE5BQyBvbiB0aGUgc3Ryb25nIGJlYXQuXG4gICAgICAgIG5hY1BhcmFtcy53YW50ZWRHVG9uZXNbMF0gPSBjbG9zZXN0Q29ycmVjdEdUb25lO1xuICAgICAgICBpZiAobmV3TWVsb2R5VG9uZUFuZER1cmF0aW9uLmR1cmF0aW9uID09IEJFQVRfTEVOR1RIIC8gMikge1xuICAgICAgICAgICAgbmFjUGFyYW1zLndhbnRlZEdUb25lc1sxXSA9IG5leHRDb3JyZWN0R3RvbmU7XG4gICAgICAgICAgICBpZiAodG9HbG9iYWxTZW1pdG9uZSAhPSBuZXh0Q29ycmVjdEd0b25lKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYEluQ29ycmVjdCA4dGgvOHRoIG5vdGUsICR7Z1RvbmVTdHJpbmcodG9HbG9iYWxTZW1pdG9uZSl9ICE9ICR7Z1RvbmVTdHJpbmcobmV4dENvcnJlY3RHdG9uZSl9YDtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5hY1BhcmFtcy5zcGxpdE1vZGUgPSBcIkVFXCJcbiAgICAgICAgY29uc3QgbmFjID0gZmluZE5BQ3MobmFjUGFyYW1zIGFzIEZpbmROb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICBpZiAoIW5hYykge1xuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gYE5vIE5BQyBmb3VuZDogd2FudGVkVG9uZXM6ICR7KG5hY1BhcmFtcy53YW50ZWRHVG9uZXMgYXMgbnVtYmVyW10pLm1hcCh0b25lID0+IGdUb25lU3RyaW5nKHRvbmUpKX1gICsgYCR7Z1RvbmVTdHJpbmcobmFjUGFyYW1zLnRoaXNCZWF0R1RvbmUpfSwgJHtnVG9uZVN0cmluZyhuZXh0Q29ycmVjdEd0b25lKX0sICR7Z1RvbmVTdHJpbmcobmFjUGFyYW1zLm5leHRCZWF0R1RvbmUpfWA7XG4gICAgICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIHRlbnNpb247XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm90ZUdUb25lID0gZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpO1xuICAgICAgICAvLyBHcmVhdC4uLiBXZSBjYW4gYWRkIGEgY29ycmVjdCA4dGggb24gdGhlIHN0cm9uZyBiZWF0IVxuICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgLy8gdGVuc2lvbi5jb21tZW50ID0gYEFkZGluZyBOQUMgb24gc3Ryb25nIGJlYXQ6ICR7Z1RvbmVTdHJpbmcoZ2xvYmFsU2VtaXRvbmUobmFjLm5vdGUpKX0gdG8gZGl2aXNpb24gJHtjdXJyZW50RGl2aXNpb259LCB3YW50ZWRHdG9uZXM6ICR7bmFjUGFyYW1zLndhbnRlZEdUb25lcy5tYXAoZ1RvbmVTdHJpbmcpfWA7XG4gICAgICAgIHRlbnNpb24ubmFjID0gbmFjO1xuICAgICAgICB0ZW5zaW9uLnRlbnNpb24gKz0gNTsgLy8gTm90IHRoYXQgZ3JlYXQsIGJ1dCBpdCdzIGJldHRlciB0aGFuIG5vdGhpbmcuXG4gICAgfSBlbHNlIGlmIChuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyICYmIG5leHRNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb24gPT0gQkVBVF9MRU5HVEggLyAyKSB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgd2F5IHRvIGFkZCBhIHJpZ2h0IE5BQyBvbiB0aGUgc3Ryb25nIGJlYXQuIGFuZCBhIHJpZ2h0IG5hYyBvbiB3ZWFrIGJlYXRcbiAgICAgICAgaWYgKGNsb3Nlc3RDb3JyZWN0R1RvbmUgPT0gdG9HbG9iYWxTZW1pdG9uZSkge1xuICAgICAgICAgICAgLy8gU3Ryb25nIGJlYXQgaXMgYWxyZWFkeSBjb3JyZWN0LiBOZWVkIGEgbm90ZSBvbiB3ZWFrIGJlYXRcbiAgICAgICAgICAgIG5hY1BhcmFtcy53YW50ZWRHVG9uZXNbMV0gPSBuZXh0Q29ycmVjdEd0b25lO1xuICAgICAgICAgICAgbmFjUGFyYW1zLnNwbGl0TW9kZSA9IFwiRUVcIlxuICAgICAgICAgICAgY29uc3QgbmFjID0gZmluZE5BQ3MobmFjUGFyYW1zIGFzIEZpbmROb25DaG9yZFRvbmVQYXJhbXMpO1xuICAgICAgICAgICAgaWYgKCFuYWMpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIk5vIE5BQyBmb3VuZCBmb3IgcXVhcnRlciBub3RlXCI7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uICs9IDEwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVuc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld05vdGVHVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5hYy5ub3RlKTtcbiAgICAgICAgICAgIC8vIEdyZWF0Li4uIFdlIGNhbiBhZGQgYSBjb3JyZWN0IDh0aCBvbiB0aGUgc3Ryb25nIGJlYXQhXG4gICAgICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgICAgIC8vIHRlbnNpb24uY29tbWVudCA9IGBBZGRpbmcgd2VhayBFRSBOQUMgJHtnVG9uZVN0cmluZyhnbG9iYWxTZW1pdG9uZShuYWMubm90ZSkpfSB0byBkaXZpc2lvbiAke2N1cnJlbnREaXZpc2lvbn0sIHdhbnRlZEd0b25lczogJHtuYWNQYXJhbXMud2FudGVkR1RvbmVzLm1hcChnVG9uZVN0cmluZyl9YDtcbiAgICAgICAgICAgIHRlbnNpb24ubmFjID0gbmFjO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhYnNvbHV0ZWx5IHBlcmZlY3QsIGJvdGggbm90ZXMgYXJlIGNvcnJlY3QuIChubyB0ZW5zaW9uISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlbGwsIG5vIGNhbiBkbyB0aGVuIEkgZ3Vlc3MuXG4gICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcImNsb3Nlc3RDb3JyZWN0R1RvbmUgIT0gdG9HbG9iYWxTZW1pdG9uZVwiO1xuICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uICs9IDEwMDtcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBgJHtuZXdNZWxvZHlUb25lQW5kRHVyYXRpb24uZHVyYXRpb259ICE9ICR7QkVBVF9MRU5HVEh9YDtcbiAgICB9XG4gICAgXG4gICAgdGVuc2lvbi50ZW5zaW9uID0gMDtcbiAgICByZXR1cm4gdGVuc2lvbjtcbn0iLCJpbXBvcnQgeyBOb3RlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL215bG9nZ2VyXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIEludmVyc2lvblJlc3VsdCA9IHtcbiAgICBnVG9uZURpZmZzOiBBcnJheTxBcnJheTxudW1iZXI+PixcbiAgICBub3Rlczoge1trZXk6IG51bWJlcl06IE5vdGV9LFxuICAgIHJhdGluZzogbnVtYmVyLFxuICAgIGludmVyc2lvbk5hbWU6IHN0cmluZyxcbn1cblxuZXhwb3J0IHR5cGUgU2ltcGxlSW52ZXJzaW9uUmVzdWx0ID0ge1xuICAgIG5vdGVzOiBBcnJheTxOb3RlPixcbiAgICByYXRpbmc6IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lOiBzdHJpbmcsXG59XG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNpb25zID0gKHZhbHVlczoge1xuICAgICAgICBjaG9yZDogQ2hvcmQsIHByZXZOb3RlczogQXJyYXk8Tm90ZT4sIGJlYXQ6IG51bWJlciwgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICAgICAgbG9nZ2VyOiBMb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmc6IG51bWJlclxuICAgIH0pOiBBcnJheTxTaW1wbGVJbnZlcnNpb25SZXN1bHQ+ID0+IHtcbiAgICBjb25zdCB7Y2hvcmQsIHByZXZOb3RlcywgYmVhdCwgcGFyYW1zLCBsb2dnZXIsIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmd9ID0gdmFsdWVzO1xuICAgIC8vIFJldHVybiBOb3RlcyBpbiB0aGUgQ2hvcmQgdGhhdCBhcmUgY2xvc2VzdCB0byB0aGUgcHJldmlvdXMgbm90ZXNcbiAgICAvLyBGb3IgZWFjaCBwYXJ0XG5cbiAgICBjb25zdCB7c3RhcnRpbmdHbG9iYWxTZW1pdG9uZXMsIHNlbWl0b25lTGltaXRzfSA9IHN0YXJ0aW5nTm90ZXMocGFyYW1zKTtcblxuICAgIC8vIEFkZCBhIHJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBpbnZlcnNpb25cbiAgICBjb25zdCByZXQ6IEFycmF5PFNpbXBsZUludmVyc2lvblJlc3VsdD4gPSBbXTtcblxuICAgIGxldCBsYXN0QmVhdEdsb2JhbFNlbWl0b25lcyA9IFsuLi5zdGFydGluZ0dsb2JhbFNlbWl0b25lc11cbiAgICBpZiAocHJldk5vdGVzKSB7XG4gICAgICAgIGxhc3RCZWF0R2xvYmFsU2VtaXRvbmVzID0gcHJldk5vdGVzLm1hcChub3RlID0+IGdsb2JhbFNlbWl0b25lKG5vdGUpKTtcbiAgICB9XG5cbiAgICBpZiAoIWNob3JkKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAoY2hvcmQpIHtcbiAgICAgICAgLy8gRm9yIGVhY2ggYmVhdCwgd2UgdHJ5IHRvIGZpbmQgYSBnb29kIG1hdGNoaW5nIHNlbWl0b25lIGZvciBlYWNoIHBhcnQuXG5cbiAgICAgICAgLy8gUnVsZXM6XG4gICAgICAgIC8vIFdpdGhcdHJvb3QgcG9zaXRpb24gdHJpYWRzOiBkb3VibGUgdGhlIHJvb3QuIFxuXG4gICAgICAgIC8vIFdpdGggZmlyc3QgaW52ZXJzaW9uIHRyaWFkczogZG91YmxlIHRoZSByb290IG9yIDV0aCwgaW4gZ2VuZXJhbC4gSWYgb25lIG5lZWRzIHRvIGRvdWJsZSBcbiAgICAgICAgLy8gdGhlIDNyZCwgdGhhdCBpcyBhY2NlcHRhYmxlLCBidXQgYXZvaWQgZG91YmxpbmcgdGhlIGxlYWRpbmcgdG9uZS5cblxuICAgICAgICAvLyBXaXRoIHNlY29uZCBpbnZlcnNpb24gdHJpYWRzOiBkb3VibGUgdGhlIGZpZnRoLiBcblxuICAgICAgICAvLyBXaXRoICBzZXZlbnRoICBjaG9yZHM6ICB0aGVyZSAgaXMgIG9uZSB2b2ljZSAgZm9yICBlYWNoICBub3RlLCAgc28gIGRpc3RyaWJ1dGUgYXMgIGZpdHMuIElmICBvbmUgXG4gICAgICAgIC8vIG11c3Qgb21pdCBhIG5vdGUgZnJvbSB0aGUgY2hvcmQsIHRoZW4gb21pdCB0aGUgNXRoLlxuXG4gICAgICAgIGNvbnN0IGZpcnN0SW50ZXJ2YWwgPSBzZW1pdG9uZURpc3RhbmNlKGNob3JkLm5vdGVzWzBdLnNlbWl0b25lLCBjaG9yZC5ub3Rlc1sxXS5zZW1pdG9uZSlcbiAgICAgICAgY29uc3QgdGhpcmRJc0dvb2QgPSBmaXJzdEludGVydmFsID09IDMgfHwgZmlyc3RJbnRlcnZhbCA9PSA0O1xuICAgICAgICBsb2dnZXIubG9nKFwibm90ZXM6IFwiLCBjaG9yZC5ub3Rlcy5tYXAobiA9PiBuLnRvU3RyaW5nKCkpKTtcblxuICAgICAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGludmVyc2lvbiBhbmQgY2hvcmQgdHlwZSwgd2UncmUgZG9pbmcgZGlmZmVyZW50IHRoaW5nc1xuXG4gICAgICAgIGxldCBpbnZlcnNpb25OYW1lcyA9IFtcInJvb3RcIiwgXCJyb290LWZpZnRoXCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwiZmlyc3QtZmlmdGhcIiwgXCJzZWNvbmRcIl07XG4gICAgICAgIGxldCBjb21iaW5hdGlvbkNvdW50ID0gMyAqIDIgKiAxO1xuICAgICAgICBpZiAoY2hvcmQubm90ZXMubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgaW52ZXJzaW9uTmFtZXMgPSBbXCJyb290XCIsIFwicm9vdC1yb290XCIsIFwicm9vdC10aGlyZFwiLCBcImZpcnN0XCIsIFwiZmlyc3Qtcm9vdFwiLCBcImZpcnN0LXRoaXJkXCIsIFwic2Vjb25kXCIsIFwidGhpcmRcIiwgXCJ0aGlyZC1yb290XCIsIFwidGhpcmQtdGhpcmRcIl07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBza2lwRmlmdGhJbmRleCA9IDA7IHNraXBGaWZ0aEluZGV4IDwgMjsgc2tpcEZpZnRoSW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBpbnZlcnNpb25JbmRleD0wOyBpbnZlcnNpb25JbmRleDxpbnZlcnNpb25OYW1lcy5sZW5ndGg7IGludmVyc2lvbkluZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgY29tYmluYXRpb25JbmRleD0wOyBjb21iaW5hdGlvbkluZGV4PGNvbWJpbmF0aW9uQ291bnQ7IGNvbWJpbmF0aW9uSW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IHJhdGluZyA9IDA7XG4gICAgICAgICAgICBjb25zdCBza2lwRmlmdGggPSBza2lwRmlmdGhJbmRleCA9PSAxO1xuXG4gICAgICAgICAgICAvLyBXZSB0cnkgZWFjaCBpbnZlcnNpb24uIFdoaWNoIGlzIGJlc3Q/XG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb24gPSBpbnZlcnNpb25OYW1lc1tpbnZlcnNpb25JbmRleF07XG4gICAgICAgICAgICBpZiAoYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZyA8IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWludmVyc2lvbi5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIERvbid0IGRvIGFueXRoaW5nIGJ1dCByb290IHBvc2l0aW9uIG9uIHRoZSBsYXN0IGNob3JkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbnZlcnNpb25SZXN1bHQ6IEludmVyc2lvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZURpZmZzOiBbXSxcbiAgICAgICAgICAgICAgICBub3Rlczoge30sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiAwLFxuICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvbk5hbWVzW2ludmVyc2lvbkluZGV4XSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc2tpcEZpZnRoKSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0LmludmVyc2lvbk5hbWUgKz0gXCItc2tpcEZpZnRoXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZlcnNpb25SZXN1bHQuaW52ZXJzaW9uTmFtZSArPSBcIi1cIiArIGNvbWJpbmF0aW9uSW5kZXg7XG5cbiAgICAgICAgICAgIGNvbnN0IGFkZFBhcnROb3RlID0gKHBhcnRJbmRleDogbnVtYmVyLCBub3RlOiBOb3RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBub3RlLnNlbWl0b25lLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IDEgIC8vIGR1bW15XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlci5sb2coXCJpbnZlcnNpb246IFwiLCBpbnZlcnNpb24sIFwic2tpcEZpZnRoOiBcIiwgc2tpcEZpZnRoKTtcbiAgICAgICAgICAgIGxldCBwYXJ0VG9JbmRleDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBzZWxlY3QgYm90dG9tIG5vdGVcbiAgICAgICAgICAgIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgnZmlyc3QnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbM10gPSAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24uc3RhcnRzV2l0aCgndGhpcmQnKSkge1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzNdID0gMztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGlzdCBub3RlcyB3ZSBoYXZlIGxlZnQgb3ZlclxuICAgICAgICAgICAgbGV0IGxlZnRPdmVySW5kZXhlczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb24gPT0gXCJyb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDJdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJyb290LWZpZnRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzEsIDIsIDJdOyAgLy8gRG91YmxlIHRoZSBmaWZ0aFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3Qtcm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcnN0IC0+IFdlIGFscmVhZHkgaGF2ZSAxXG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAwLCAyXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtdGhpcmRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMSwgMl07ICAvLyBEb3VibGUgdGhlIHRoaXJkXG4gICAgICAgICAgICAgICAgICAgIHJhdGluZyArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwiZmlyc3QtZmlmdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0T3ZlckluZGV4ZXMgPSBbMCwgMiwgMl07ICAvLyBEb3VibGUgdGhlIGZpZnRoXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmQgLT4gV2UgYWxyZWFkeSBoYXZlIDJcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaG9yZC5ub3Rlcy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIExlYXZlIG91dCB0aGUgZmlmdGgsIHBvc3NpYmx5XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2lvbiA9PSBcInJvb3Qtcm9vdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgcm9vdFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW52ZXJzaW9uID09IFwicm9vdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFsxLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDNdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJmaXJzdC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAzXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJ0aGlyZC1yb290XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDAsIDFdOyAgLy8gRG91YmxlIHRoZSByb290XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnZlcnNpb24gPT0gXCJ0aGlyZC10aGlyZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IFswLCAxLCAxXTsgIC8vIERvdWJsZSB0aGUgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzID0gWzAsIDEsIDIsIDNdLmZpbHRlcihpID0+IGkgIT0gcGFydFRvSW5kZXhbM10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNraXBGaWZ0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0VG9JbmRleFszXSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaW4gc2Vjb25kIGludmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpID09IDIpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbid0IHNraXAgZmlmdGggaWYgd2UgaGF2ZSB0d29cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxlZnRPdmVySW5kZXhlcyA9IGxlZnRPdmVySW5kZXhlcy5maWx0ZXIoaSA9PiBpICE9IDIpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBlaXRoZXIgYSAwIG9yIDEgdG8gcmVwbGFjZSB0aGUgZmlmdGhcbiAgICAgICAgICAgICAgICBpZiAobGVmdE92ZXJJbmRleGVzLmZpbHRlcihpID0+IGkgPT0gMCkubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdE92ZXJJbmRleGVzLnB1c2goMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZXBlbmRpbmcgb24gY29tYmluYXRpb25JbmRleCwgd2Ugc2VsZWN0IHRoZSBub3RlcyBmb3IgcGFydEluZGV4ZXMgMCwgMSwgMlxuICAgICAgICAgICAgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlyZCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gRm91cnRoIHBlcm11dGF0aW9uXG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMF0gPSBsZWZ0T3ZlckluZGV4ZXNbMV07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMV0gPSBsZWZ0T3ZlckluZGV4ZXNbMl07XG4gICAgICAgICAgICAgICAgcGFydFRvSW5kZXhbMl0gPSBsZWZ0T3ZlckluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbWJpbmF0aW9uSW5kZXggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBGaWZ0aCBwZXJtdXRhdGlvblxuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzBdID0gbGVmdE92ZXJJbmRleGVzWzJdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzFdID0gbGVmdE92ZXJJbmRleGVzWzBdO1xuICAgICAgICAgICAgICAgIHBhcnRUb0luZGV4WzJdID0gbGVmdE92ZXJJbmRleGVzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21iaW5hdGlvbkluZGV4ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgLy8gU2l4dGggcGVybXV0YXRpb25cbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFswXSA9IGxlZnRPdmVySW5kZXhlc1syXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsxXSA9IGxlZnRPdmVySW5kZXhlc1sxXTtcbiAgICAgICAgICAgICAgICBwYXJ0VG9JbmRleFsyXSA9IGxlZnRPdmVySW5kZXhlc1swXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgcGFydEluZGV4PTA7IHBhcnRJbmRleDw0OyBwYXJ0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNpb25SZXN1bHQubm90ZXNbcGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHBhcnQgaXMgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFBhcnROb3RlKHBhcnRJbmRleCwgY2hvcmQubm90ZXNbcGFydFRvSW5kZXhbcGFydEluZGV4XV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGFzdGx5LCB3ZSBzZWxlY3QgdGhlIGxvd2VzdCBwb3NzaWJsZSBvY3RhdmUgZm9yIGVhY2ggcGFydFxuICAgICAgICAgICAgbGV0IG1pblNlbWl0b25lID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRJbmRleD0zOyBwYXJ0SW5kZXg+PTA7IHBhcnRJbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90ZSA9IGludmVyc2lvblJlc3VsdC5ub3Rlc1twYXJ0SW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBnVG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGk9MDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZ1RvbmUgPCBzZW1pdG9uZUxpbWl0c1twYXJ0SW5kZXhdWzBdIHx8IGdUb25lIDwgbWluU2VtaXRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUb28gbWFueSBpdGVyYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnVG9uZSArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzaW9uUmVzdWx0Lm5vdGVzW3BhcnRJbmRleF0gPSBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IGludmVyc2lvbnJlc3VsdCBmb3IgZWFjaCBwb3NzaWJsZSBvY3RhdmUgY29tYmluYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0ME5vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbMF0pO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBhcnQxTm90ZSA9IGdsb2JhbFNlbWl0b25lKGludmVyc2lvblJlc3VsdC5ub3Rlc1sxXSk7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUGFydDJOb3RlID0gZ2xvYmFsU2VtaXRvbmUoaW52ZXJzaW9uUmVzdWx0Lm5vdGVzWzJdKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxQYXJ0M05vdGUgPSBnbG9iYWxTZW1pdG9uZShpbnZlcnNpb25SZXN1bHQubm90ZXNbM10pO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydDBPY3RhdmU9MDsgcGFydDBPY3RhdmU8MzsgcGFydDBPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQwTm90ZSA9IGluaXRpYWxQYXJ0ME5vdGUgKyBwYXJ0ME9jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ME5vdGUgPiBzZW1pdG9uZUxpbWl0c1swXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDFPY3RhdmU9MDsgcGFydDFPY3RhdmU8MzsgcGFydDFPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0MU5vdGUgPSBpbml0aWFsUGFydDFOb3RlICsgcGFydDFPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHBhcnQwTm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQxTm90ZSA+IHNlbWl0b25lTGltaXRzWzFdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJ0Mk9jdGF2ZT0wOyBwYXJ0Mk9jdGF2ZTwzOyBwYXJ0Mk9jdGF2ZSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0Mk5vdGUgPSBpbml0aWFsUGFydDJOb3RlICsgcGFydDJPY3RhdmUgKiAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBwYXJ0MU5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0Mk5vdGUgPiBzZW1pdG9uZUxpbWl0c1syXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcGFydDNPY3RhdmU9MDsgcGFydDNPY3RhdmU8MzsgcGFydDNPY3RhdmUrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQzTm90ZSA9IGluaXRpYWxQYXJ0M05vdGUgKyBwYXJ0M09jdGF2ZSAqIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBwYXJ0Mk5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0M05vdGUgPiBzZW1pdG9uZUxpbWl0c1szXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0ME5vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDBOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IHBhcnQxTm90ZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihwYXJ0MU5vdGUgLyAxMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW1pdG9uZTogcGFydDJOb3RlICUgMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHBhcnQyTm90ZSAvIDEyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBwYXJ0M05vdGUgJSAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IocGFydDNOb3RlIC8gMTIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2lvbk5hbWU6IGludmVyc2lvblJlc3VsdC5pbnZlcnNpb25OYW1lICsgYCAke3BhcnQwT2N0YXZlfSR7cGFydDFPY3RhdmV9JHtwYXJ0Mk9jdGF2ZX0ke3BhcnQzT2N0YXZlfWAgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQwTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQxTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQyTm90ZSkgKyBcIiBcIiArIGdUb25lU3RyaW5nKHBhcnQzTm90ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZzogcmF0aW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2dnZXIucHJpbnQoXCJuZXdWb2ljZUxlYWRpbmdOb3RlczogXCIsIGNob3JkLnRvU3RyaW5nKCksIFwiIGJlYXQ6IFwiLCBiZWF0KTtcblxuICAgIC8vIFJhbmRvbWl6ZSBvcmRlciBvZiByZXRcbiAgICBmb3IgKGxldCBpPTA7IGk8cmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZXQubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgdG1wID0gcmV0W2ldO1xuICAgICAgICByZXRbaV0gPSByZXRbal07XG4gICAgICAgIHJldFtqXSA9IHRtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuIiwiY29uc3QgcHJpbnRDaGlsZE1lc3NhZ2VzID0gKGNoaWxkTG9nZ2VyOiBMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkTG9nZ2VyLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uY2hpbGQudGl0bGUpO1xuICAgICAgICBwcmludENoaWxkTWVzc2FnZXMoY2hpbGQpO1xuICAgICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgY2hpbGQubWVzc2FnZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAgIHRpdGxlOiBhbnlbXSA9IFtdO1xuICAgIG1lc3NhZ2VzOiBBcnJheTxhbnlbXT4gPSBbXTtcbiAgICBwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBjaGlsZHJlbjogTG9nZ2VyW10gPSBbXTtcbiAgICBjbGVhcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IExvZ2dlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2coLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKGFyZ3MpO1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIExldCBwYXJlbnQgaGFuZGxlIG1lXG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IGFyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi5hcmdzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCguLi50aGlzLnRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSB0b3AgbG9nZ2VyLiBQcmludCBldmVyeXRoaW5nLlxuICAgICAgICBwcmludENoaWxkTWVzc2FnZXModGhpcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4udGhpcy5tZXNzYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbiA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCAhPT0gdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhcmVkID0gdHJ1ZTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE5vdGUsIFNjYWxlIH0gZnJvbSBcIm11c2ljdGhlb3J5anNcIjtcbmltcG9ydCB7IE1haW5NdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgZ2V0VGVuc2lvbiwgVGVuc2lvbiB9IGZyb20gXCIuL3RlbnNpb25cIjtcbmltcG9ydCB7IEJFQVRfTEVOR1RILCBDaG9yZCwgRGl2aXNpb25lZFJpY2hub3RlcywgZ2V0Umh5dGhtTmVlZGVkRHVyYXRpb25zLCBnZXRSaWNoTm90ZSwgZ2xvYmFsU2VtaXRvbmUsIG5leHRHVG9uZUluU2NhbGUsIE51bGxhYmxlLCBzZW1pdG9uZURpc3RhbmNlLCBzZW1pdG9uZVNjYWxlSW5kZXgsIHN0YXJ0aW5nTm90ZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIE5vbkNob3JkVG9uZSA9IHtcbiAgICBub3RlOiBOb3RlLFxuICAgIG5vdGUyPyA6IE5vdGUsICAvLyBUaGlzIG1ha2VzIHRoZSBub3RlcyAxNnRoc1xuICAgIHN0cm9uZ0JlYXQ6IGJvb2xlYW4sXG4gICAgcmVwbGFjZW1lbnQ/OiBib29sZWFuLFxufVxuXG5leHBvcnQgdHlwZSBOb25DaG9yZFRvbmVQYXJhbXMgPSB7XG4gICAgZ1RvbmUwOiBudW1iZXIgfCBudWxsLFxuICAgIGdUb25lMTogbnVtYmVyLFxuICAgIGdUb25lMjogbnVtYmVyLFxuICAgIHdhbnRlZFRvbmU/IDogbnVtYmVyLFxuICAgIHN0cm9uZ0JlYXQ/OiBib29sZWFuLFxuICAgIGNob3JkPyA6IENob3JkLFxuICAgIHNjYWxlOiBTY2FsZSxcbiAgICBnVG9uZUxpbWl0czogbnVtYmVyW10sXG59XG5cbnR5cGUgU3BsaXRNb2RlID0gXCJFRVwiIHwgXCJTU0VcIiB8IFwiRVNTXCIgfCBcIlNTU1NcIlxuXG5leHBvcnQgdHlwZSBGaW5kTm9uQ2hvcmRUb25lUGFyYW1zID0ge1xuICAgIGZyb21HVG9uZTogbnVtYmVyLFxuICAgIHRoaXNCZWF0R1RvbmU6IG51bWJlcixcbiAgICBuZXh0QmVhdEdUb25lOiBudW1iZXIsXG4gICAgc3BsaXRNb2RlOiBTcGxpdE1vZGUsXG4gICAgd2FudGVkR1RvbmVzOiBudW1iZXJbXSwgIC8vIFByb3ZpZGUgZ3RvbmVzIGZvciBlYWNoIHdhbnRlZCBpbmRleCBvZiBzcGxpdG1vZGVcbiAgICBzY2FsZTogU2NhbGUsXG4gICAgZ1RvbmVMaW1pdHM6IG51bWJlcltdLFxuICAgIGNob3JkPzogQ2hvcmQsXG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZE5vdGVCZXR3ZWVuID0gKG5hYzogTm9uQ2hvcmRUb25lLCBkaXZpc2lvbjogbnVtYmVyLCBuZXh0RGl2aXNpb246IG51bWJlciwgcGFydEluZGV4OiBudW1iZXIsIGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3Rlcyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGRpdmlzaW9uRGlmZiA9IG5leHREaXZpc2lvbiAtIGRpdmlzaW9uO1xuICAgIGNvbnN0IGJlYXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dIHx8IFtdKS5maWx0ZXIobm90ZSA9PiBub3RlLnBhcnRJbmRleCA9PSBwYXJ0SW5kZXgpWzBdO1xuICAgIGlmICghYmVhdFJpY2hOb3RlIHx8ICFiZWF0UmljaE5vdGUubm90ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWVsZCB0byBhZGQgbm90ZSBiZXR3ZWVuXCIsIGRpdmlzaW9uLCBuZXh0RGl2aXNpb24sIHBhcnRJbmRleCwgZGl2aXNpb25lZE5vdGVzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld05vdGUgPSBuYWMubm90ZTtcbiAgICBjb25zdCBuZXdOb3RlMiA9IG5hYy5ub3RlMjtcbiAgICBjb25zdCBzdHJvbmdCZWF0ID0gbmFjLnN0cm9uZ0JlYXQ7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBuYWMucmVwbGFjZW1lbnQgfHwgZmFsc2U7XG5cbiAgICAvLyBJZiBzdHJvbmcgYmVhdCwgd2UgYWRkIG5ld05vdGUgQkVGT1JFIGJlYXRSaWNoTm90ZVxuICAgIC8vIE90aGVyd2lzZSB3ZSBhZGQgbmV3Tm90ZSBBRlRFUiBiZWF0UmljaE5vdGVcblxuICAgIGlmIChzdHJvbmdCZWF0KSB7XG4gICAgICAgIGJlYXRSaWNoTm90ZS5kdXJhdGlvbiA9IGRpdmlzaW9uRGlmZiAvIDI7XG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlID0ge1xuICAgICAgICAgICAgbm90ZTogbmV3Tm90ZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgY2hvcmQ6IGJlYXRSaWNoTm90ZS5jaG9yZCxcbiAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgbmV3IHRvbmUgdG8gZGl2aXNpb25cbiAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uXS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlKTtcbiAgICAgICAgLy8gUmVtb3ZlIGJlYXRSaWNoTm90ZSBmcm9tIGRpdmlzaW9uXG4gICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dLmZpbHRlcihub3RlID0+IG5vdGUgIT0gYmVhdFJpY2hOb3RlKTtcbiAgICAgICAgaWYgKCFyZXBsYWNlbWVudCkge1xuICAgICAgICAgICAgLy8gQWRkIGJlYXRSaWNoTm90ZSB0byBkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2goYmVhdFJpY2hOb3RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFkZCBuZXcgdG9uZSBhbHNvIHRvIGRpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMlxuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0ucHVzaChuZXdSYW5kb21SaWNoTm90ZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW5ld05vdGUyKSB7XG4gICAgICAgICAgICAvLyBhZGRpbmcgMSA4dGggbm90ZVxuICAgICAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZSA9IHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyAyLFxuICAgICAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWRkaW5nIDIgMTZ0aCBub3Rlc1xuICAgICAgICAgICAgYmVhdFJpY2hOb3RlLmR1cmF0aW9uID0gZGl2aXNpb25EaWZmIC8gMjtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdID0gZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmIC8gMl0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdSYW5kb21SaWNoTm90ZSA9IHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXdOb3RlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaXZpc2lvbkRpZmYgLyA0LFxuICAgICAgICAgICAgICAgIGNob3JkOiBiZWF0UmljaE5vdGUuY2hvcmQsXG4gICAgICAgICAgICAgICAgc2NhbGU6IGJlYXRSaWNoTm90ZS5zY2FsZSxcbiAgICAgICAgICAgICAgICBwYXJ0SW5kZXg6IHBhcnRJbmRleCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbiArIGRpdmlzaW9uRGlmZiAvIDJdLnB1c2gobmV3UmFuZG9tUmljaE5vdGUpO1xuICAgICAgICAgICAgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uICsgZGl2aXNpb25EaWZmICogMC43NV0gPSBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgKiAwLjc1XSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmRvbVJpY2hOb3RlMiA9IHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXdOb3RlMixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGl2aXNpb25EaWZmIC8gNCxcbiAgICAgICAgICAgICAgICBjaG9yZDogYmVhdFJpY2hOb3RlLmNob3JkLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBiZWF0UmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgcGFydEluZGV4OiBwYXJ0SW5kZXgsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBkaXZpc2lvbkRpZmYgKiAwLjc1XS5wdXNoKG5ld1JhbmRvbVJpY2hOb3RlMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuY29uc3QgcGFzc2luZ1RvbmUgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBSZXR1cm4gYSBuZXcgZ1RvbmUgb3IgbnVsbCwgYmFzZWQgb24gd2hldGhlciBhZGRpbmcgYSBwYXNzaW5nIHRvbmUgaXMgYSBnb29kIGlkZWEuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhnVG9uZTEgLSBnVG9uZTIpO1xuICAgIGlmIChkaXN0YW5jZSA8IDMgfHwgZGlzdGFuY2UgPiA0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZVRvbmVzID0gc2NhbGUubm90ZXMubWFwKG4gPT4gbi5zZW1pdG9uZSk7XG4gICAgZm9yIChsZXQgZ1RvbmU9Z1RvbmUxOyBnVG9uZSAhPSBnVG9uZTI7IGdUb25lICs9IChnVG9uZTEgPCBnVG9uZTIgPyAxIDogLTEpKSB7XG4gICAgICAgIGlmIChnVG9uZSA9PSBnVG9uZTEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnVG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lID4gZ1RvbmVMaW1pdHNbMV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWl0b25lID0gZ1RvbmUgJSAxMjtcbiAgICAgICAgaWYgKHNjYWxlVG9uZXMuaW5jbHVkZXMoc2VtaXRvbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgICAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5jb25zdCBhY2NlbnRlZFBhc3NpbmdUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgLy8gU2FtZSBhcyBwYXNzaW5nIHRvbmUgYnV0IG9uIHN0cm9uZyBiZWF0XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoZ1RvbmUwIC0gZ1RvbmUxKTtcbiAgICBpZiAoZGlzdGFuY2UgPCAzIHx8IGRpc3RhbmNlID4gNCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2NhbGVUb25lcyA9IHNjYWxlLm5vdGVzLm1hcChuID0+IG4uc2VtaXRvbmUpO1xuICAgIGZvciAobGV0IGdUb25lPWdUb25lMDsgZ1RvbmUgIT0gZ1RvbmUxOyBnVG9uZSArPSAoZ1RvbmUwIDwgZ1RvbmUxID8gMSA6IC0xKSkge1xuICAgICAgICBpZiAoZ1RvbmUgPT0gZ1RvbmUwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pdG9uZSA9IGdUb25lICUgMTI7XG4gICAgICAgIGlmIChzY2FsZVRvbmVzLmluY2x1ZGVzKHNlbWl0b25lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICAgICAgICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgc3Ryb25nQmVhdDogdHJ1ZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5cbmNvbnN0IG5laWdoYm9yVG9uZSA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAsIHRoZW4gc3RlcCBiYWNrLiBUaGlzIGlzIG9uIFdlYWsgYmVhdFxuICAgIGlmIChnVG9uZTEgIT0gZ1RvbmUyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZUluZGV4ID0gc2VtaXRvbmVTY2FsZUluZGV4KHNjYWxlKVtnVG9uZTEgJSAxMl07XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB1cE9yRG93bkNob2ljZXMgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gWzEsIC0xXSA6IFstMSwgMV07XG4gICAgZm9yIChjb25zdCB1cE9yRG93biBvZiB1cE9yRG93bkNob2ljZXMpIHtcbiAgICAgICAgY29uc3QgbmV3R3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgdXBPckRvd24sIHNjYWxlKTtcbiAgICAgICAgaWYgKCFuZXdHdG9uZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld0d0b25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgbmV3R3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogbmV3R3RvbmUgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihuZXdHdG9uZSAvIDEyKSxcbiAgICAgICAgfSksIHN0cm9uZ0JlYXQ6IGZhbHNlfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuY29uc3Qgc3VzcGVuc2lvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBET1dOIGludG8gY2hvcmQgdG9uZS4gVGhpcyBpcyBvbiBTdHJvbmcgYmVhdC5cbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTAgLSBnVG9uZTE7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgZG93bi5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBnVG9uZTEgdG8gZ1RvbmUwIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBzdXNwZW5zaW9uLlxuICAgIHJldHVybiB7XG4gICAgICAgIG5vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgICAgIHNlbWl0b25lOiBnVG9uZTAgJSAxMixcbiAgICAgICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTAgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH1cbn1cblxuXG5jb25zdCByZXRhcmRhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0YXkgb24gcHJldmlvdXMsIHRoZW4gc3RlcCBVUCBpbnRvIGNob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICAvLyBVc3VhbGx5IGRvdHRlZCFcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKGRpc3RhbmNlIDwgMSB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgLy8gTXVzdCBiZSBoYWxmIG9yIHdob2xlIHN0ZXAgdXAuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgZ1RvbmUxIHRvIGdUb25lMCBmb3IgdGhlIGxlbmd0aCBvZiB0aGUgc3VzcGVuc2lvbi5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlfTt9XG5cblxuY29uc3QgYXBwb2dpYXR1cmEgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7Z1RvbmUwLCBnVG9uZTEsIGdUb25lMiwgc2NhbGUsIGdUb25lTGltaXRzfSA9IHZhbHVlcztcbiAgICAvLyBMZWFwLCB0aGVuIHN0ZXAgYmFjayBpbnRvIENob3JkIHRvbmUuIFRoaXMgaXMgb24gU3Ryb25nIGJlYXRcbiAgICBpZiAoIWdUb25lMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGlzdGFuY2UgPSBnVG9uZTEgLSBnVG9uZTA7XG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA8IDMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVwT3JEb3duID0gLTE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIGRvd24gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXBwb2dpYXR1cmFcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCB1cCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBhcHBvZ2lhdHVyYVxuICAgICAgICB1cE9yRG93biA9IDE7XG4gICAgfVxuICAgIGNvbnN0IGdUb25lID0gbmV4dEdUb25lSW5TY2FsZShnVG9uZTEsIHVwT3JEb3duLCBzY2FsZSk7XG4gICAgaWYgKCFnVG9uZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGdUb25lIDwgZ1RvbmVMaW1pdHNbMF0gfHwgZ1RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgIHNlbWl0b25lOiBnVG9uZSAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHRydWV9O1xufVxuXG5jb25zdCBlc2NhcGVUb25lID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gU3RlcCBhd2F5LCB0aGVuIExlYXAgaW4gdG8gbmV4dCBDaG9yZCB0b25lLiBUaGlzIGlzIG9uIFN0cm9uZyBiZWF0XG4gICAgaWYgKCFnVG9uZTApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUxIC0gZ1RvbmUwO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB1cE9yRG93biA9IDE7XG4gICAgLy8gY29udmVydCBnVG9uZTEgdG8gYSBzdGVwIHVwIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgZ1RvbmUxIHRvIGEgc3RlcCBkb3duIGZyb20gZ1RvbmUwIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGVzY2FwZVRvbmVcbiAgICAgICAgdXBPckRvd24gPSAtMTtcbiAgICB9XG4gICAgY29uc3QgZ1RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMCwgdXBPckRvd24sIHNjYWxlKTtcbiAgICBpZiAoIWdUb25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoZ1RvbmUgPCBnVG9uZUxpbWl0c1swXSB8fCBnVG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZSAvIDEyKSxcbiAgICB9KSwgc3Ryb25nQmVhdDogdHJ1ZX07XG59XG5cbmNvbnN0IGFudGljaXBhdGlvbiA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgb3IgbGVhcCBlYXJseSBpbiB0byBuZXh0IENob3JkIHRvbmUuIFRoaXMgaXMgb24gd2VhayBiZWF0LlxuICAgIGNvbnN0IGRpc3RhbmNlID0gZ1RvbmUyIC0gZ1RvbmUxO1xuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZSkgPCAxKSB7XG4gICAgICAgIC8vIFRvbyBjbG9zZSB0byBiZSBhbiBhbnRpY2lwYXRpb25cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gRWFzeS4gSnVzdCBtYWtlIGEgbmV3IG5vdGUgdGhhdHMgdGhlIHNhbWUgYXMgZ1RvbmUyLlxuICAgIHJldHVybiB7bm90ZTogbmV3IE5vdGUoe1xuICAgICAgICBzZW1pdG9uZTogZ1RvbmUyICUgMTIsXG4gICAgICAgIG9jdGF2ZTogTWF0aC5mbG9vcihnVG9uZTIgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IGZhbHNlfTtcbn1cblxuY29uc3QgbmVpZ2hib3JHcm91cCA9ICh2YWx1ZXM6IE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtnVG9uZTAsIGdUb25lMSwgZ1RvbmUyLCBzY2FsZSwgZ1RvbmVMaW1pdHN9ID0gdmFsdWVzO1xuICAgIC8vIFN0ZXAgYXdheSwgdGhlbiBsZWFwIGludG8gdGhlIFwib3RoZXIgcG9zc2libGVcIiBuZWlnaGJvciB0b25lLiBUaGlzIHVzZXMgMTZ0aHMgKHR3byBub3RlcykuXG4gICAgLy8gV2VhayBiZWF0XG4gICAgaWYgKGdUb25lMSAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlSW5kZXggPSBzZW1pdG9uZVNjYWxlSW5kZXgoc2NhbGUpW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHVwR3RvbmUgPSBuZXh0R1RvbmVJblNjYWxlKGdUb25lMSwgMSwgc2NhbGUpO1xuICAgIGNvbnN0IGRvd25HdG9uZSA9IG5leHRHVG9uZUluU2NhbGUoZ1RvbmUxLCAtMSwgc2NhbGUpO1xuICAgIGlmICghdXBHdG9uZSB8fCAhZG93bkd0b25lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodXBHdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IHVwR3RvbmUgPiBnVG9uZUxpbWl0c1sxXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGRvd25HdG9uZSA8IGdUb25lTGltaXRzWzBdIHx8IGRvd25HdG9uZSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBub3RlOiBuZXcgTm90ZSh7XG4gICAgICAgICAgICBzZW1pdG9uZTogdXBHdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHVwR3RvbmUgLyAxMiksXG4gICAgICAgIH0pLFxuICAgICAgICBub3RlMjogbmV3IE5vdGUoe1xuICAgICAgICAgICAgc2VtaXRvbmU6IGRvd25HdG9uZSAlIDEyLFxuICAgICAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKGRvd25HdG9uZSAvIDEyKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cm9uZ0JlYXQ6IGZhbHNlXG4gICAgfTtcbn1cblxuXG5jb25zdCBwZWRhbFBvaW50ID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgY29uc3Qge2dUb25lMCwgZ1RvbmUxLCBnVG9uZTIsIHNjYWxlLCBnVG9uZUxpbWl0c30gPSB2YWx1ZXM7XG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIG5vdGUgd2l0aCB0aGUgbm90ZSB0aGF0IGlzIGJlZm9yZSBpdCBBTkQgYWZ0ZXIgaXQuXG4gICAgaWYgKGdUb25lMCAhPSBnVG9uZTIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChnVG9uZTAgPT0gZ1RvbmUxKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gQWxyZWFkeSBleGlzdHNcbiAgICB9XG4gICAgaWYgKGdUb25lMSA8IGdUb25lTGltaXRzWzBdIHx8IGdUb25lMSA+IGdUb25lTGltaXRzWzFdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IGdUb25lMCAlIDEyLFxuICAgICAgICBvY3RhdmU6IE1hdGguZmxvb3IoZ1RvbmUwIC8gMTIpLFxuICAgIH0pLCBzdHJvbmdCZWF0OiB0cnVlLCByZXBsYWNlbWVudDogdHJ1ZX07XG59XG5cblxuY29uc3QgY2hvcmROb3RlID0gKHZhbHVlczogTm9uQ2hvcmRUb25lUGFyYW1zKTogTm9uQ2hvcmRUb25lIHwgbnVsbCA9PiB7XG4gICAgLy8gSnVzdCB1c2UgYSBjaG9yZCB0b25lLiBXZWFrIE9SIHN0cm9uZyBiZWF0XG4gICAgY29uc3QgeyBnVG9uZTEsIGNob3JkIH0gPSB2YWx1ZXM7XG4gICAgbGV0IHN0cm9uZ0JlYXQgPSB2YWx1ZXMuc3Ryb25nQmVhdDtcbiAgICBpZiAoIXN0cm9uZ0JlYXQpIHtcbiAgICAgICAgc3Ryb25nQmVhdCA9IE1hdGgucmFuZG9tKCkgPiAwLjg7XG4gICAgfVxuICAgIGlmICghY2hvcmQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGxldCB3YW50ZWRUb25lID0gdmFsdWVzLndhbnRlZFRvbmU7XG4gICAgaWYgKCF3YW50ZWRUb25lKSB7XG4gICAgICAgIC8vIFJhbmRvbSBmcm9tIGNob3JkLm5vdGVzXG4gICAgICAgIGNvbnN0IG5vdGUgPSBjaG9yZC5ub3Rlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaG9yZC5ub3Rlcy5sZW5ndGgpXTtcbiAgICAgICAgd2FudGVkVG9uZSA9IG5vdGUuc2VtaXRvbmU7XG4gICAgICAgIC8vIFNlbGVjdCBjbG9zZXN0IG9jdGF2ZSB0byBnVG9uZTFcbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAoTWF0aC5hYnMod2FudGVkVG9uZSAtIGdUb25lMSkgPj0gNikge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSBpdGVyYXRpb25zXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2FudGVkVG9uZSArPSAxMjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgZ29vZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3Qgbm90ZSBvZiBjaG9yZC5ub3Rlcykge1xuICAgICAgICBpZiAobm90ZS5zZW1pdG9uZSA9PSB3YW50ZWRUb25lICUgMTIpIHtcbiAgICAgICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFnb29kKSB7XG4gICAgICAgIC8vIFdhbnRlZFRvbmUgaXMgbm90IGEgY2hvcmQgdG9uZVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge25vdGU6IG5ldyBOb3RlKHtcbiAgICAgICAgc2VtaXRvbmU6IHdhbnRlZFRvbmUgJSAxMixcbiAgICAgICAgb2N0YXZlOiBNYXRoLmZsb29yKHdhbnRlZFRvbmUgLyAxMiksXG4gICAgfSksIHN0cm9uZ0JlYXQ6IHN0cm9uZ0JlYXR9O1xufVxuXG5jb25zdCB3ZWFrQmVhdENob3JkVG9uZSAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICByZXR1cm4gY2hvcmROb3RlKHtcbiAgICAgICAgLi4udmFsdWVzLFxuICAgICAgICBzdHJvbmdCZWF0OiBmYWxzZSxcbiAgICB9KTtcbn1cblxuY29uc3Qgc3Ryb25nQmVhdENob3JkVG9uZSAgPSAodmFsdWVzOiBOb25DaG9yZFRvbmVQYXJhbXMpOiBOb25DaG9yZFRvbmUgfCBudWxsID0+IHtcbiAgICByZXR1cm4gY2hvcmROb3RlKHtcbiAgICAgICAgLi4udmFsdWVzLFxuICAgICAgICBzdHJvbmdCZWF0OiB0cnVlLFxuICAgIH0pXG59XG5cblxuZXhwb3J0IGNvbnN0IGZpbmROQUNzID0gKHZhbHVlczogRmluZE5vbkNob3JkVG9uZVBhcmFtcyk6IE5vbkNob3JkVG9uZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHtmcm9tR1RvbmUsIHRoaXNCZWF0R1RvbmUsIG5leHRCZWF0R1RvbmUsIHNwbGl0TW9kZSwgd2FudGVkR1RvbmVzLCBzY2FsZSwgZ1RvbmVMaW1pdHMsIGNob3JkfSA9IHZhbHVlcztcblxuICAgIGNvbnN0IHN0cm9uZ0JlYXRGdW5jczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHtcbiAgICAgICAgJ3N0cm9uZ0JlYXRDaG9yZFRvbmUnOiBzdHJvbmdCZWF0Q2hvcmRUb25lLFxuICAgICAgICAnYXBwb2dpYXR1cmEnOiBhcHBvZ2lhdHVyYSxcbiAgICAgICAgJ2VzY2FwZVRvbmUnOiBlc2NhcGVUb25lLFxuICAgICAgICAncGVkYWxQb2ludCc6IHBlZGFsUG9pbnQsXG4gICAgICAgICdzdXNwZW5zaW9uJzogc3VzcGVuc2lvbixcbiAgICAgICAgJ3JldGFyZGF0aW9uJzogcmV0YXJkYXRpb24sXG4gICAgICAgICdhY2NlbnRlZFBhc3NpbmdUb25lJzogYWNjZW50ZWRQYXNzaW5nVG9uZSxcbiAgICB9XG5cbiAgICBjb25zdCB3ZWFrQmVhdEZ1bmNzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge1xuICAgICAgICAnd2Vha0JlYXRDaG9yZFRvbmUnOiB3ZWFrQmVhdENob3JkVG9uZSxcbiAgICAgICAgJ2FudGljaXBhdGlvbic6IGFudGljaXBhdGlvbixcbiAgICAgICAgJ25laWdoYm9yR3JvdXAnOiBuZWlnaGJvckdyb3VwLFxuICAgICAgICAncGFzc2luZ1RvbmUnOiBwYXNzaW5nVG9uZSxcbiAgICB9XG5cbiAgICBpZiAoc3BsaXRNb2RlID09ICdFRScpIHtcbiAgICAgICAgLy8gVGhpcyBjYXNlIG9ubHkgaGFzIDIgY2hvaWNlczogc3Ryb25nIG9yIHdlYWsgYmVhdFxuICAgICAgICBsZXQgc3Ryb25nQmVhdCA9IGZhbHNlO1xuICAgICAgICAvLyBGaW5kIHRoZSB3YW50ZWQgbm90ZXNcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCBhIGNoYW5nZSBvbiBzdHJvbmcgYmVhdCBvciBvbiBzb21lIG90aGVyIGJlYXRcbiAgICAgICAgaWYgKHdhbnRlZEdUb25lc1swXSAmJiB3YW50ZWRHVG9uZXNbMF0gIT0gdGhpc0JlYXRHVG9uZSkge1xuICAgICAgICAgICAgc3Ryb25nQmVhdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cm9uZ0JlYXQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnVuY05hbWUgaW4gc3Ryb25nQmVhdEZ1bmNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IHN0cm9uZ0JlYXRGdW5jc1tmdW5jTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZnVuYyh7XG4gICAgICAgICAgICAgICAgICAgIGdUb25lMDogZnJvbUdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTE6IHRoaXNCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMjogbmV4dEJlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgd2FudGVkVG9uZTogd2FudGVkR1RvbmVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkLFxuICAgICAgICAgICAgICAgIH0gYXMgTm9uQ2hvcmRUb25lUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FudGVkR1RvbmVzWzBdIHx8IGdsb2JhbFNlbWl0b25lKHJlc3VsdC5ub3RlKSA9PSB3YW50ZWRHVG9uZXNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmNOYW1lIGluIHdlYWtCZWF0RnVuY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gd2Vha0JlYXRGdW5jc1tmdW5jTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZnVuYyh7XG4gICAgICAgICAgICAgICAgICAgIGdUb25lMDogZnJvbUdUb25lLFxuICAgICAgICAgICAgICAgICAgICBnVG9uZTE6IHRoaXNCZWF0R1RvbmUsXG4gICAgICAgICAgICAgICAgICAgIGdUb25lMjogbmV4dEJlYXRHVG9uZSxcbiAgICAgICAgICAgICAgICAgICAgd2FudGVkVG9uZTogd2FudGVkR1RvbmVzWzFdLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgIGNob3JkLFxuICAgICAgICAgICAgICAgIH0gYXMgTm9uQ2hvcmRUb25lUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FudGVkR1RvbmVzWzFdIHx8IGdsb2JhbFNlbWl0b25lKHJlc3VsdC5ub3RlKSA9PSB3YW50ZWRHVG9uZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuZXhwb3J0IGNvbnN0IGJ1aWxkVG9wTWVsb2R5ID0gKGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcywgbWFpblBhcmFtczogTWFpbk11c2ljUGFyYW1zKSA9PiB7XG4gICAgLy8gRm9sbG93IHRoZSBwcmUgZ2l2ZW4gbWVsb2R5IHJoeXRobVxuICAgIGNvbnN0IHJoeXRobU5lZWRlZER1cmF0aW9uczogeyBba2V5OiBudW1iZXJdOiBudW1iZXI7IH0gPSBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtcyk7XG5cbiAgICBjb25zdCBsYXN0RGl2aXNpb24gPSBCRUFUX0xFTkdUSCAqIG1haW5QYXJhbXMuZ2V0TWF4QmVhdHMoKTtcbiAgICBjb25zdCBmaXJzdFBhcmFtcyA9IG1haW5QYXJhbXMuY3VycmVudENhZGVuY2VQYXJhbXMoMCk7XG4gICAgY29uc3Qge3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLCBzZW1pdG9uZUxpbWl0c30gPSBzdGFydGluZ05vdGVzKGZpcnN0UGFyYW1zKTtcblxuICAgIGZvciAobGV0IGRpdmlzaW9uID0gMDsgZGl2aXNpb24gPCBsYXN0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDsgZGl2aXNpb24gKz0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgbGV0IGdUb25lTGltaXRzRm9yVGhpc0JlYXQgPSBbXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbMF1dLFxuICAgICAgICAgICAgWy4uLnNlbWl0b25lTGltaXRzWzFdXSxcbiAgICAgICAgICAgIFsuLi5zZW1pdG9uZUxpbWl0c1syXV0sXG4gICAgICAgICAgICBbLi4uc2VtaXRvbmVMaW1pdHNbM11dLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBtYWluUGFyYW1zLmN1cnJlbnRDYWRlbmNlUGFyYW1zKGRpdmlzaW9uKTtcbiAgICAgICAgY29uc3QgY2FkZW5jZURpdmlzaW9uID0gZGl2aXNpb24gLSBwYXJhbXMuYXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247XG4gICAgICAgIGNvbnN0IG5lZWRlZFJoeXRobSA9IHJoeXRobU5lZWRlZER1cmF0aW9uc1tjYWRlbmNlRGl2aXNpb25dIHx8IDEwMDtcblxuICAgICAgICBjb25zdCBsYXN0QmVhdEluQ2FkZW5jZSA9IHBhcmFtcy5iZWF0c1VudGlsQXV0aGVudGljQ2FkZW5jZUVuZCA8IDJcbiAgICAgICAgaWYgKGxhc3RCZWF0SW5DYWRlbmNlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByZXZOb3RlczogTm90ZVtdID0gW107XG4gICAgICAgIGNvbnN0IHRoaXNOb3RlczogTm90ZVtdID0gW107XG4gICAgICAgIGNvbnN0IG5leHROb3RlczogTm90ZVtdID0gW107XG4gICAgICAgIGxldCBjdXJyZW50U2NhbGU6IFNjYWxlO1xuXG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgZGl2aXNpb25lZE5vdGVzW2RpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKSB7XG4gICAgICAgICAgICBpZiAocmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIHByZXZOb3Rlc1tyaWNoTm90ZS5wYXJ0SW5kZXhdID0gcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHJpY2hOb3RlIG9mIGRpdmlzaW9uZWROb3Rlc1tkaXZpc2lvbl0gfHwgW10pIHtcbiAgICAgICAgICAgIGlmIChyaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgcHJldk5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgICAgIGlmIChyaWNoTm90ZS5zY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGUgPSByaWNoTm90ZS5zY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb24gKyBCRUFUX0xFTkdUSF0gfHwgW10pIHtcbiAgICAgICAgICAgIGlmIChyaWNoTm90ZS5ub3RlKSB7XG4gICAgICAgICAgICAgICAgbmV4dE5vdGVzW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJyZW50U2NhbGUgPSBjdXJyZW50U2NhbGU7XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIC8vIENoYW5nZSBsaW1pdHMsIG5ldyBub3RlcyBtdXN0IGFsc28gYmUgYmV0d2VlZW4gdGhlIG90aGVyIHBhcnQgbm90ZXNcbiAgICAgICAgICAgIC8vICggT3ZlcmxhcHBpbmcgKVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uLCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZ1RvbmUxID0gZ2xvYmFsU2VtaXRvbmUocmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBnVG9uZTIgPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSk7XG4gICAgICAgICAgICBjb25zdCBtaW5HVG9uZSA9IE1hdGgubWluKGdUb25lMSwgZ1RvbmUyKTtcbiAgICAgICAgICAgIGNvbnN0IG1heEdUb25lID0gTWF0aC5tYXgoZ1RvbmUxLCBnVG9uZTIpO1xuICAgICAgICAgICAgaWYgKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4IC0gMV0pIHtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgaGlnaGVyIHBhcnQsIGl0IGNhbid0IGdvIGxvd2VyIHRoYW4gbWF4R1RvbmVcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCAtIDFdWzBdID0gTWF0aC5tYXgoZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggLSAxXVswXSwgbWF4R1RvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgbG93ZXIgcGFydCwgaXQgY2FuJ3QgZ28gaGlnaGVyIHRoYW4gbWluR1RvbmVcbiAgICAgICAgICAgICAgICBnVG9uZUxpbWl0c0ZvclRoaXNCZWF0W3BhcnRJbmRleCArIDFdWzFdID0gTWF0aC5taW4oZ1RvbmVMaW1pdHNGb3JUaGlzQmVhdFtwYXJ0SW5kZXggKyAxXVsxXSwgbWluR1RvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcGFydEluZGV4ID0gMDsgcGFydEluZGV4IDwgNDsgcGFydEluZGV4KyspIHtcbiAgICAgICAgICAgIGlmIChuZWVkZWRSaHl0aG0gIT0gMiAqIEJFQVRfTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gbmVlZCBmb3IgaGFsZiBub3Rlc1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIGEgdGllIHRvIHRoZSBuZXh0IG5vdGVcbiAgICAgICAgICAgIGNvbnN0IHJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSaWNoTm90ZSA9IGdldFJpY2hOb3RlKGRpdmlzaW9uZWROb3RlcywgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4KTtcbiAgICAgICAgICAgIGlmICghcmljaE5vdGUgfHwgIXJpY2hOb3RlLm5vdGUgfHwgIW5leHRSaWNoTm90ZSB8fCAhbmV4dFJpY2hOb3RlLm5vdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnbG9iYWxTZW1pdG9uZShyaWNoTm90ZS5ub3RlKSAhPSBnbG9iYWxTZW1pdG9uZShuZXh0UmljaE5vdGUubm90ZSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpY2hOb3RlLnRpZSA9IFwic3RhcnRcIjtcbiAgICAgICAgICAgIG5leHRSaWNoTm90ZS50aWUgPSBcInN0b3BcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IDQ7IHBhcnRJbmRleCsrKSB7XG4gICAgICAgICAgICBpZiAobmVlZGVkUmh5dGhtICE9ICBCRUFUX0xFTkdUSCAvIDIpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBuZWVkIGZvciA4dGhzLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uLCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJpY2hOb3RlID0gZ2V0UmljaE5vdGUoZGl2aXNpb25lZE5vdGVzLCBkaXZpc2lvbiArIEJFQVRfTEVOR1RILCBwYXJ0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZSB8fCAhcmljaE5vdGUubm90ZSB8fCAhbmV4dFJpY2hOb3RlIHx8ICFuZXh0UmljaE5vdGUubm90ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyaWNoTm90ZS5zY2FsZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyBzY2FsZSBmb3IgcmljaE5vdGVcIiwgcmljaE5vdGUpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwcmV2UmljaE5vdGUgPSBnZXRSaWNoTm90ZShkaXZpc2lvbmVkTm90ZXMsIGRpdmlzaW9uIC0gQkVBVF9MRU5HVEgsIHBhcnRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdUb25lMSA9IGdsb2JhbFNlbWl0b25lKHJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgY29uc3QgZ1RvbmUyID0gZ2xvYmFsU2VtaXRvbmUobmV4dFJpY2hOb3RlLm5vdGUpO1xuICAgICAgICAgICAgbGV0IGdUb25lMCA9IHByZXZSaWNoTm90ZSA/IGdsb2JhbFNlbWl0b25lKHByZXZSaWNoTm90ZS5ub3RlKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoZ1RvbmUwICYmIHByZXZSaWNoTm90ZSAmJiBwcmV2UmljaE5vdGUuZHVyYXRpb24gIT0gQkVBVF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICAvLyBGSVhNRTogcHJldlJpY2hOb3RlIGlzIG5vdCB0aGUgcHJldmlvdXMgbm90ZS4gV2UgY2Fubm90IHVzZSBpdCB0byBkZXRlcm1pbmUgdGhlIHByZXZpb3VzIG5vdGUuXG4gICAgICAgICAgICAgICAgZ1RvbmUwID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5hY1BhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBnVG9uZTAsXG4gICAgICAgICAgICAgICAgZ1RvbmUxLFxuICAgICAgICAgICAgICAgIGdUb25lMixcbiAgICAgICAgICAgICAgICBzY2FsZTogcmljaE5vdGUuc2NhbGUsXG4gICAgICAgICAgICAgICAgZ1RvbmVMaW1pdHM6IGdUb25lTGltaXRzRm9yVGhpc0JlYXRbcGFydEluZGV4XSxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSB3YXkgdG8gYWQgOHRoIG5vdGVzIHRoaXMgYmVhdC5cblxuICAgICAgICAgICAgY29uc3Qgbm9uQ2hvcmRUb25lQ2hvaWNlRnVuY3M6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7XG4gICAgICAgICAgICAgICAgYXBwb2dpYXR1cmE6ICgpID0+IGFwcG9naWF0dXJhKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgbmVpZ2hib3JHcm91cDogKCkgPT4gbmVpZ2hib3JHcm91cChuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHN1c3BlbnNpb246ICgpID0+IHN1c3BlbnNpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBlc2NhcGVUb25lOiAoKSA9PiBlc2NhcGVUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgcGFzc2luZ1RvbmU6ICgpID0+IHBhc3NpbmdUb25lKG5hY1BhcmFtcyksXG4gICAgICAgICAgICAgICAgbmVpZ2hib3JUb25lOiAoKSA9PiBuZWlnaGJvclRvbmUobmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICByZXRhcmRhdGlvbjogKCkgPT4gcmV0YXJkYXRpb24obmFjUGFyYW1zKSxcbiAgICAgICAgICAgICAgICBhbnRpY2lwYXRpb246ICgpID0+IGFudGljaXBhdGlvbihuYWNQYXJhbXMpLFxuICAgICAgICAgICAgICAgIHBlZGFsUG9pbnQ6ICgpID0+IHBlZGFsUG9pbnQobmFjUGFyYW1zKSxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICAgICAgbGV0IG5vbkNob3JkVG9uZSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB1c2VkQ2hvaWNlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRpb25zID4gMTAwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSBpdGVyYXRpb25zIGluIDh0aCBub3RlIGdlbmVyYXRpb25cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IG5vbkNob3JkVG9uZUNob2ljZXM6IHtba2V5OiBzdHJpbmddOiBOb25DaG9yZFRvbmV9ID0ge31cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhub25DaG9yZFRvbmVDaG9pY2VGdW5jcykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IHBhcmFtcy5ub25DaG9yZFRvbmVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGluZyB8fCAhc2V0dGluZy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2UgPSBub25DaG9yZFRvbmVDaG9pY2VGdW5jc1trZXldKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaG9pY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZUNob2ljZXNba2V5XSA9IGNob2ljZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJ0SW5kZXggIT0gMykge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9uQ2hvcmRUb25lQ2hvaWNlcy5wZWRhbFBvaW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB1c2luZ0tleSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZhaWxhYmxlS2V5cyA9IE9iamVjdC5rZXlzKG5vbkNob3JkVG9uZUNob2ljZXMpLmZpbHRlcihrZXkgPT4gIXVzZWRDaG9pY2VzLmhhcyhrZXkpKTtcbiAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlS2V5cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG5vbkNob3JkVG9uZUNob2ljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZWRDaG9pY2VzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobm9uQ2hvcmRUb25lQ2hvaWNlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub25DaG9yZFRvbmUgPSBub25DaG9yZFRvbmVDaG9pY2VzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2luZ0tleSA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9uQ2hvcmRUb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW5vbkNob3JkVG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBwb3NzaWJsZSBub24gY2hvcmQgdG9uZVxuICAgICAgICAgICAgICAgIC8vIE5vdyB3ZSBuZWVkIHRvIGNoZWNrIHZvaWNlIGxlYWRpbmcgZnJvbSBiZWZvcmUgYW5kIGFmdGVyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9uQ2hvcmRUb25lTm90ZXM6IE5vdGVbXSA9IFsuLi50aGlzTm90ZXNdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vbkNob3JkVG9uZS5zdHJvbmdCZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vbkNob3JkVG9uZU5vdGVzW3BhcnRJbmRleF0gPSBub25DaG9yZFRvbmUubm90ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGVuc2lvblJlc3VsdCA9IG5ldyBUZW5zaW9uKCk7XG4gICAgICAgICAgICAgICAgZ2V0VGVuc2lvbih0ZW5zaW9uUmVzdWx0LCB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlOiBwcmV2Tm90ZXMsXG4gICAgICAgICAgICAgICAgICAgIGJlYXREaXZpc2lvbjogZGl2aXNpb24sXG4gICAgICAgICAgICAgICAgICAgIHRvTm90ZXM6IG5vbkNob3JkVG9uZU5vdGVzLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NhbGU6IGN1cnJlbnRTY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIG1haW5QYXJhbXM6IG1haW5QYXJhbXMsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBsZXQgdGVuc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgdGVuc2lvbiArPSB0ZW5zaW9uUmVzdWx0LmRvdWJsZUxlYWRpbmdUb25lO1xuICAgICAgICAgICAgICAgIHRlbnNpb24gKz0gdGVuc2lvblJlc3VsdC5wYXJhbGxlbEZpZnRocztcbiAgICAgICAgICAgICAgICB0ZW5zaW9uICs9IHRlbnNpb25SZXN1bHQuc3BhY2luZ0Vycm9yO1xuICAgICAgICAgICAgICAgIGlmICh0ZW5zaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVuc2lvbiB0b28gaGlnaCBmb3Igbm9uIGNob3JkIHRvbmVcIiwgdGVuc2lvbiwgbm9uQ2hvcmRUb25lLCB0ZW5zaW9uUmVzdWx0LCB1c2luZ0tleSk7XG4gICAgICAgICAgICAgICAgdXNlZENob2ljZXMuYWRkKHVzaW5nS2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFub25DaG9yZFRvbmUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYWRkTm90ZUJldHdlZW4obm9uQ2hvcmRUb25lLCBkaXZpc2lvbiwgZGl2aXNpb24gKyBCRUFUX0xFTkdUSCwgcGFydEluZGV4LCBkaXZpc2lvbmVkTm90ZXMpO1xuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IEJFQVRfTEVOR1RIIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIE1haW5NdXNpY1BhcmFtcyB7XG4gICAgYmVhdHNQZXJCYXI6IG51bWJlciA9IDQ7XG4gICAgY2FkZW5jZUNvdW50OiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VzOiBBcnJheTxNdXNpY1BhcmFtcz4gPSBbXTtcbiAgICB0ZXN0TW9kZT86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBtZWxvZHlSaHl0aG06IHN0cmluZyA9IFwiXCI7ICAvLyBoaWRkZW4gZnJvbSB1c2VyIGZvciBub3dcbiAgICBmb3JjZWRNZWxvZHk6IG51bWJlcltdOyAgLy8gaGlkZGVuIGZyb20gdXNlciBmb3Igbm93XG4gICAgZm9yY2VkQ2hvcmRzOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBQYXJ0aWFsPE1haW5NdXNpY1BhcmFtcz4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IChwYXJhbXMgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMubWVsb2R5Umh5dGhtID0gXCJRUVFRUVFRUVFRUVFRUVFRUVFRUVFRXCJcbiAgICAgICAgLy8gdGhpcy5tZWxvZHlSaHl0aG0gPSBcIkVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRVwiO1xuICAgICAgICAvLyBmb3IgKGxldCBpPTA7IGk8MjA7IGkrKykge1xuICAgICAgICAvLyAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgLy8gICAgIGlmIChyYW5kb20gPCAwLjIpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1lbG9keVJoeXRobSArPSBcIkhcIjtcbiAgICAgICAgLy8gICAgICAgICBpICs9IDE7XG4gICAgICAgIC8vICAgICB9IGVsc2UgaWYgKHJhbmRvbSA8IDAuNykge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMubWVsb2R5Umh5dGhtICs9IFwiUVwiO1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1lbG9keVJoeXRobSArPSBcIkVFXCI7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5mb3JjZWRNZWxvZHkgPSBbMCwgMSwgMiwgMywgMywgMyBdXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgIDEyIDMgNDEgMiAzNCB0d28gYmFyc1xuXG4gICAgICAgIC8vIERvIFJlIE1pIEZhIFNvIExhIFRpIERvXG4gICAgICAgIC8vIHRoaXMuZm9yY2VkTWVsb2R5ID0gXCJSUlJSUlJSUlJSUlJSUlJSUlJSUlwiO1xuICAgICAgICB0aGlzLmZvcmNlZE1lbG9keSA9IFtdO1xuICAgICAgICAvLyBsZXQgbWVsb2R5ID0gWzBdO1xuICAgICAgICAvLyBmb3IgKGxldCBpPTA7IGk8MjA7IGkrKykge1xuICAgICAgICAvLyAgICAgY29uc3QgdXBPckRvd24gPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gLTEgOiAxO1xuICAgICAgICAvLyAgICAgY29uc3QgcHJldk1lbG9keSA9IG1lbG9keVttZWxvZHkubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vICAgICBtZWxvZHkucHVzaChwcmV2TWVsb2R5ICsgKDEgKiB1cE9yRG93bikpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMuZm9yY2VkTWVsb2R5ID0gbWVsb2R5Lm1hcChtID0+IChtICsgNyAqIDEwMCkgJSA3KTtcblxuICAgICAgICAvLyBFeGFtcGxlIG1lbG9keVxuICAgICAgICAvLyBDIG1haiAtIENcbiAgICAgICAgLy8gICAgICAgICBEIHB0XG4gICAgICAgIC8vIEMgbWFqICAgRVxuICAgICAgICAvLyAgICAgICAgIEYgcHRcbiAgICAgICAgLy8gQSBtaW4gICBHIHB0XG4gICAgICAgIC8vICAgICAgICAgQVxuICAgICAgICAvLyBBIG1pbiAgIEIgcHRcbiAgICAgICAgLy8gICAgICAgICBDXG4gICAgICAgIC8vIEYgbWFqICAgQiBwdFxuICAgICAgICAvLyAgICAgICAgIEFcbiAgICAgICAgLy8gRiBtYWogICBHIHB0XG4gICAgICAgIC8vICAgICAgICAgRlxuICAgICAgICAvLyBHIG1haiAgIEUgcHRcbiAgICAgICAgLy8gICAgICAgICBEXG4gICAgICAgIC8vIEcgbWFqICAgQyBwdFxuICAgICAgICAvLyAgICAgICAgIERcbiAgICAgICAgLy8gQyBtYWogICBFXG4gICAgICAgIC8vICAgICAgICAgRiBwdFxuICAgICAgICAvLyBDIG1haiAgIEdcbiAgICAgICAgLy8gICAgICAgICBBIHB0XG4gICAgICAgIC8vIHRoaXMuZm9yY2VkQ2hvcmRzID0gXCIxMTY2NDQ1NTExNjY1NTExMTE2NjQ0NTUxMTY2NTUxMVwiXG4gICAgfVxuXG4gICAgY3VycmVudENhZGVuY2VQYXJhbXMoZGl2aXNpb246IG51bWJlcik6IE11c2ljUGFyYW1zIHtcbiAgICAgICAgY29uc3QgYmVhdCA9IE1hdGguZmxvb3IoZGl2aXNpb24gLyBCRUFUX0xFTkdUSCk7XG4gICAgICAgIGNvbnN0IGJhciA9IE1hdGguZmxvb3IoYmVhdCAvIHRoaXMuYmVhdHNQZXJCYXIpO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7ICAvLyBUaGUgYmVhdCB3ZSdyZSBhdCBpbiB0aGUgbG9vcFxuICAgICAgICBsZXQgYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjYWRlbmNlUGFyYW1zIG9mIHRoaXMuY2FkZW5jZXMpIHtcbiAgICAgICAgICAgIC8vIExvb3AgY2FkZW5jZXMgaW4gb3JkZXJzXG4gICAgICAgICAgICBjb3VudGVyICs9IGNhZGVuY2VQYXJhbXMuYmFyc1BlckNhZGVuY2U7XG4gICAgICAgICAgICBpZiAoW1wiUEFDXCIsIFwiSUFDXCJdLmluY2x1ZGVzKGNhZGVuY2VQYXJhbXMuc2VsZWN0ZWRDYWRlbmNlKSkge1xuICAgICAgICAgICAgICAgIGF1dGhlbnRpY0NhZGVuY2VTdGFydEJhciA9IGNvdW50ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmFyIDwgY291bnRlcikgeyAgLy8gV2UgaGF2ZSBwYXNzZWQgdGhlIGdpdmVuIGRpdmlzaW9uLiBUaGUgcHJldmlvdXMgY2FkZW5jZSBpcyB0aGUgb25lIHdlIHdhbnRcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kID0gY291bnRlciAqIHRoaXMuYmVhdHNQZXJCYXIgLSBiZWF0O1xuICAgICAgICAgICAgICAgIGlmIChbXCJQQUNcIiwgXCJJQUNcIl0uaW5jbHVkZXMoY2FkZW5jZVBhcmFtcy5zZWxlY3RlZENhZGVuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPSBjYWRlbmNlUGFyYW1zLmJlYXRzVW50aWxDYWRlbmNlRW5kO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbEF1dGhlbnRpY0NhZGVuY2VFbmQgPSA5OTk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhZGVuY2VQYXJhbXMuYmVhdHNVbnRpbFNvbmdFbmQgPSB0aGlzLmNhZGVuY2VzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYmFyc1BlckNhZGVuY2UsIDApICogdGhpcy5iZWF0c1BlckJhciAtIGJlYXQ7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5iZWF0c1BlckJhciA9IHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgICAgICAgICAgICAgY2FkZW5jZVBhcmFtcy5jYWRlbmNlU3RhcnREaXZpc2lvbiA9ICgoY291bnRlciAtIGNhZGVuY2VQYXJhbXMuYmFyc1BlckNhZGVuY2UpICogdGhpcy5iZWF0c1BlckJhcikgKiBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgICAgICBjYWRlbmNlUGFyYW1zLmF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uID0gYXV0aGVudGljQ2FkZW5jZVN0YXJ0QmFyICogdGhpcy5iZWF0c1BlckJhciAqIEJFQVRfTEVOR1RIO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWRlbmNlUGFyYW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhZGVuY2VzWzBdO1xuICAgIH1cblxuICAgIGdldE1heEJlYXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWRlbmNlcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmJhcnNQZXJDYWRlbmNlLCAwKSAqIHRoaXMuYmVhdHNQZXJCYXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTXVzaWNQYXJhbXMge1xuICAgIGJlYXRzVW50aWxDYWRlbmNlRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzVW50aWxBdXRoZW50aWNDYWRlbmNlRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzVW50aWxTb25nRW5kOiBudW1iZXIgPSAwO1xuICAgIGJlYXRzUGVyQmFyOiBudW1iZXIgPSA0O1xuICAgIGNhZGVuY2VTdGFydERpdmlzaW9uOiBudW1iZXIgPSAwO1xuICAgIGF1dGhlbnRpY0NhZGVuY2VTdGFydERpdmlzaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgYmFzZVRlbnNpb24/OiBudW1iZXIgPSAwLjM7XG4gICAgYmFyc1BlckNhZGVuY2U6IG51bWJlciA9IDJcbiAgICB0ZW1wbz86IG51bWJlciA9IDQwO1xuICAgIGhhbGZOb3Rlcz86IGJvb2xlYW4gPSB0cnVlO1xuICAgIHNpeHRlZW50aE5vdGVzPzogbnVtYmVyID0gMC4yO1xuICAgIGVpZ2h0aE5vdGVzPzogbnVtYmVyID0gMC40O1xuICAgIG1vZHVsYXRpb25XZWlnaHQ/OiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdXZWlnaHQ/OiBudW1iZXIgPSAyO1xuICAgIHBhcnRzOiBBcnJheTx7XG4gICAgICAgIHZvaWNlOiBzdHJpbmcsXG4gICAgICAgIG5vdGU6IHN0cmluZyxcbiAgICAgICAgdm9sdW1lOiBudW1iZXIsXG4gICAgfT4gPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDFcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkM1XCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiAxMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdm9pY2U6IFwiNDFcIixcbiAgICAgICAgICAgICAgICBub3RlOiBcIkE0XCIsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiA3LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2b2ljZTogXCI0MlwiLFxuICAgICAgICAgICAgICAgIG5vdGU6IFwiQzRcIixcbiAgICAgICAgICAgICAgICB2b2x1bWU6IDcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZvaWNlOiBcIjQzXCIsXG4gICAgICAgICAgICAgICAgbm90ZTogXCJFM1wiLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogMTAsXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgYmVhdFNldHRpbmdzOiBBcnJheTx7XG4gICAgICAgIHRlbnNpb246IG51bWJlcixcbiAgICB9PiA9IFtdO1xuICAgIGNob3JkU2V0dGluZ3M6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyLFxuICAgICAgICB9XG4gICAgfSA9IHtcbiAgICAgICAgICAgIG1hajoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpbToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGltNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hajc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb203OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWluNzoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIHNjYWxlU2V0dGluZ3M6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHdlaWdodDogbnVtYmVyXG4gICAgICAgIH1cbiAgICB9ID0ge1xuICAgICAgICAgICAgbWFqb3I6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaW5vcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICBzZWxlY3RlZENhZGVuY2U6IHN0cmluZyA9IFwiSENcIjtcbiAgICBub25DaG9yZFRvbmVzOiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICB3ZWlnaHQ6IG51bWJlcixcbiAgICAgICAgfVxuICAgIH0gPSB7XG4gICAgICAgICAgICBwYXNzaW5nVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5laWdoYm9yVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1c3BlbnNpb246IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXRhcmRhdGlvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFwcG9naWF0dXJhOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXNjYXBlVG9uZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFudGljaXBhdGlvbjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5laWdoYm9yR3JvdXA6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdlaWdodDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwZWRhbFBvaW50OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG5cblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogUGFydGlhbDxNdXNpY1BhcmFtcz4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IChwYXJhbXMgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQmVhdFNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQmVhdFNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBiZWF0Q291bnQgPSB0aGlzLmJlYXRzUGVyQmFyICogdGhpcy5iYXJzUGVyQ2FkZW5jZTtcbiAgICAgICAgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA8IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aDsgaSA8IGJlYXRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IHRoaXMuYmFzZVRlbnNpb24gfHwgMC4zLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmVhdFNldHRpbmdzLmxlbmd0aCA+IGJlYXRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5iZWF0U2V0dGluZ3MgPSB0aGlzLmJlYXRTZXR0aW5ncy5zbGljZSgwLCBiZWF0Q291bnQpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBTY2FsZSB9IGZyb20gXCJtdXNpY3RoZW9yeWpzXCI7XG5pbXBvcnQgeyBNdXNpY1BhcmFtcyB9IGZyb20gXCIuL3BhcmFtc1wiO1xuaW1wb3J0IHsgQ2hvcmQsIGNob3JkVGVtcGxhdGVzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFJhbmRvbUNob3JkR2VuZXJhdG9yIHtcbiAgICBwcml2YXRlIGNob3JkVHlwZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgYXZhaWxhYmxlQ2hvcmRzPzogQXJyYXk8c3RyaW5nPjtcbiAgICBwcml2YXRlIHVzZWRDaG9yZHM/OiBTZXQ8c3RyaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogTXVzaWNQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY2hvcmRUeXBlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNob3JkVHlwZSBpbiBwYXJhbXMuY2hvcmRTZXR0aW5ncykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5jaG9yZFNldHRpbmdzW2Nob3JkVHlwZV0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNob3JkVHlwZXMucHVzaChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hvcmRUeXBlcyA9IGNob3JkVHlwZXM7XG4gICAgICAgIHRoaXMudXNlZENob3JkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCkge1xuICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgdGhpcy51c2VkQ2hvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gKHRoaXMuYXZhaWxhYmxlQ2hvcmRzIHx8IFtdKS5maWx0ZXIoY2hvcmQgPT4gISh0aGlzLnVzZWRDaG9yZHMgfHwgbmV3IFNldCgpKS5oYXMoY2hvcmQpKTtcbiAgICAgICAgLy8gRmlyc3QgdHJ5IHRvIGFkZCB0aGUgc2ltcGxlc3QgY2hvcmRzXG4gICAgICAgIGZvciAoY29uc3Qgc2ltcGxlQ2hvcmRUeXBlIG9mIHRoaXMuY2hvcmRUeXBlcy5maWx0ZXIoY2hvcmRUeXBlID0+IFtcIm1halwiLCBcIm1pblwiXS5pbmNsdWRlcyhjaG9yZFR5cGUpKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgcmFuZG9tUm9vdD0wOyByYW5kb21Sb290PDEyOyByYW5kb21Sb290KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHNpbXBsZUNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgc2ltcGxlQ2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21UeXBlID0gdGhpcy5jaG9yZFR5cGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2hvcmRUeXBlcy5sZW5ndGgpXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVJvb3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMik7XG4gICAgICAgICAgICBpZiAoIXRoaXMudXNlZENob3Jkcy5oYXMocmFuZG9tUm9vdCArIHJhbmRvbVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVDaG9yZHMucHVzaChyYW5kb21Sb290ICsgcmFuZG9tVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGNsZWFuVXAoKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZWRDaG9yZHMpIHtcbiAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVzZWRDaG9yZHM7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmF2YWlsYWJsZUNob3JkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2hvcmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5hdmFpbGFibGVDaG9yZHMgfHwgdGhpcy5hdmFpbGFibGVDaG9yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkQXZhaWxhYmxlQ2hvcmRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbnMrKyA+IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlQ2hvcmRzICYmIHRoaXMudXNlZENob3Jkcykge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGggLSAzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9yZFR5cGUgPSB0aGlzLmF2YWlsYWJsZUNob3Jkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUNob3Jkcy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZWRDaG9yZHMuaGFzKGNob3JkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlZENob3Jkcy5hZGQoY2hvcmRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQ2hvcmRzID0gdGhpcy5hdmFpbGFibGVDaG9yZHMuZmlsdGVyKGNob3JkID0+IGNob3JkICE9PSBjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDaG9yZChjaG9yZFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWlsZEF2YWlsYWJsZUNob3JkcygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm90ZSwgU2NhbGUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgYWRkRm9yY2VkTWVsb2R5IH0gZnJvbSBcIi4vZm9yY2VkbWVsb2R5XCI7XG5pbXBvcnQgeyBOb25DaG9yZFRvbmUgfSBmcm9tIFwiLi9ub25jaG9yZHRvbmVzXCI7XG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMsIE11c2ljUGFyYW1zIH0gZnJvbSBcIi4vcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgQ2hvcmQsIERpdmlzaW9uZWRSaWNobm90ZXMsIGdsb2JhbFNlbWl0b25lLCBnVG9uZVN0cmluZywgbWFqU2NhbGVEaWZmZXJlbmNlLCBOdWxsYWJsZSwgc2VtaXRvbmVEaXN0YW5jZSwgc3RhcnRpbmdOb3RlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IGNsYXNzIFRlbnNpb24ge1xuICAgIG5vdEluU2NhbGU6IG51bWJlciA9IDA7XG4gICAgbW9kdWxhdGlvbjogbnVtYmVyID0gMDtcbiAgICBhbGxOb3Rlc1NhbWU6IG51bWJlciA9IDA7XG4gICAgY2hvcmRQcm9ncmVzc2lvbjogbnVtYmVyID0gMDtcbiAgICBrZWVwRG9taW5hbnRUb25lczogbnVtYmVyID0gMDtcbiAgICBwYXJhbGxlbEZpZnRoczogbnVtYmVyID0gMDtcbiAgICBzcGFjaW5nRXJyb3I6IG51bWJlciA9IDA7XG4gICAgY2FkZW5jZTogbnVtYmVyID0gMDtcbiAgICB0ZW5zaW9uaW5nSW50ZXJ2YWw6IG51bWJlciA9IDA7XG4gICAgc2Vjb25kSW52ZXJzaW9uOiBudW1iZXIgPSAwO1xuICAgIGRvdWJsZUxlYWRpbmdUb25lOiBudW1iZXIgPSAwO1xuICAgIGxlYWRpbmdUb25lVXA6IG51bWJlciA9IDA7XG4gICAgbWVsb2R5SnVtcDogbnVtYmVyID0gMDtcbiAgICBtZWxvZHlUYXJnZXQ6IG51bWJlciA9IDA7XG4gICAgdm9pY2VEaXJlY3Rpb25zOiBudW1iZXIgPSAwO1xuICAgIG92ZXJsYXBwaW5nOiBudW1iZXIgPSAwO1xuXG4gICAgc2V2ZW50aFRlbnNpb246IG51bWJlciA9IDA7XG5cbiAgICBpbnZlcnNpb25UZW5zaW9uOiBudW1iZXIgPSAwO1xuXG4gICAgZm9yY2VkTWVsb2R5OiBudW1iZXIgPSAwO1xuICAgIG5hYz86IE5vbkNob3JkVG9uZTtcblxuICAgIHRvdGFsVGVuc2lvbjogbnVtYmVyID0gMDtcblxuICAgIGNvbW1lbnQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBnZXRUb3RhbFRlbnNpb24odmFsdWVzOiB7cGFyYW1zOiBNdXNpY1BhcmFtcywgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZTogbnVtYmVyfSkge1xuICAgICAgICBjb25zdCB7cGFyYW1zLCBiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlfSA9IHZhbHVlcztcbiAgICAgICAgbGV0IHRlbnNpb24gPSAwO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMubm90SW5TY2FsZSAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1vZHVsYXRpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5hbGxOb3Rlc1NhbWU7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5jaG9yZFByb2dyZXNzaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMua2VlcERvbWluYW50VG9uZXM7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5wYXJhbGxlbEZpZnRocyAqIDEwMDtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNwYWNpbmdFcnJvcjtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmNhZGVuY2U7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy50ZW5zaW9uaW5nSW50ZXJ2YWw7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5zZWNvbmRJbnZlcnNpb247XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5kb3VibGVMZWFkaW5nVG9uZTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmxlYWRpbmdUb25lVXA7XG4gICAgICAgIHRlbnNpb24gKz0gdGhpcy5tZWxvZHlUYXJnZXQ7XG4gICAgICAgIGlmIChiZWF0c1VudGlsTGFzdENob3JkSW5DYWRlbmNlID4gNCkge1xuICAgICAgICAgICAgdGVuc2lvbiArPSB0aGlzLm1lbG9keUp1bXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW5zaW9uICs9IHRoaXMubWVsb2R5SnVtcDtcbiAgICAgICAgfVxuICAgICAgICB0ZW5zaW9uICs9IHRoaXMudm9pY2VEaXJlY3Rpb25zO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMub3ZlcmxhcHBpbmc7XG5cbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLmZvcmNlZE1lbG9keTtcbiAgICAgICAgdGVuc2lvbiArPSB0aGlzLnNldmVudGhUZW5zaW9uO1xuICAgICAgICB0ZW5zaW9uICs9IHRoaXMuaW52ZXJzaW9uVGVuc2lvbjtcblxuICAgICAgICB0aGlzLnRvdGFsVGVuc2lvbiA9IHRlbnNpb247XG4gICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgIH1cblxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIC8vIFByaW50IG9ubHkgcG9zaXRpdmUgdmFsdWVzXG4gICAgICAgIGNvbnN0IHRvUHJpbnQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzW2tleV0gJiYgdHlwZW9mIHRoaXNba2V5XSA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdG9QcmludFtrZXldID0gKHRoaXNba2V5XSBhcyB1bmtub3duIGFzIG51bWJlcikudG9GaXhlZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbW1lbnQsIC4uLmFyZ3MsIHRvUHJpbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4uYXJncywgdG9QcmludClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgdHlwZSBUZW5zaW9uUGFyYW1zID0ge1xuICAgIGRpdmlzaW9uZWROb3Rlcz86IERpdmlzaW9uZWRSaWNobm90ZXMsXG4gICAgYmVhdERpdmlzaW9uOiBudW1iZXIsXG4gICAgZnJvbU5vdGVzT3ZlcnJpZGU/OiBBcnJheTxOb3RlPixcbiAgICB0b05vdGVzOiBBcnJheTxOb3RlPixcbiAgICBjdXJyZW50U2NhbGU6IFNjYWxlLFxuICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJbkNhZGVuY2U/OiBudW1iZXIsXG4gICAgcGFyYW1zOiBNdXNpY1BhcmFtcyxcbiAgICBtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMsXG4gICAgYmVhdHNVbnRpbExhc3RDaG9yZEluU29uZz86IG51bWJlcixcbiAgICBpbnZlcnNpb25OYW1lPzogc3RyaW5nLFxuICAgIHByZXZJbnZlcnNpb25OYW1lPzogU3RyaW5nLFxuICAgIG5ld0Nob3JkPzogQ2hvcmQsXG59XG5cblxuZXhwb3J0IGNvbnN0IGdldFRlbnNpb24gPSAodGVuc2lvbjogVGVuc2lvbiwgdmFsdWVzOiBUZW5zaW9uUGFyYW1zKTogVGVuc2lvbiA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGRpdmlzaW9uZWROb3RlcyxcbiAgICAgICAgICAgIGZyb21Ob3Rlc092ZXJyaWRlLFxuICAgICAgICAgICAgdG9Ob3RlcyxcbiAgICAgICAgICAgIG5ld0Nob3JkLFxuICAgICAgICAgICAgY3VycmVudFNjYWxlLFxuICAgICAgICAgICAgYmVhdHNVbnRpbExhc3RDaG9yZEluQ2FkZW5jZSxcbiAgICAgICAgICAgIGJlYXRzVW50aWxMYXN0Q2hvcmRJblNvbmcsXG4gICAgICAgICAgICBpbnZlcnNpb25OYW1lLFxuICAgICAgICAgICAgcHJldkludmVyc2lvbk5hbWUsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBtYWluUGFyYW1zLFxuICAgICAgICAgICAgYmVhdERpdmlzaW9uLFxuICAgICAgICB9ID0gdmFsdWVzO1xuICAgIC8qXG4gICAgKiAgIEdldCB0aGUgdGVuc2lvbiBiZXR3ZWVuIHR3byBjaG9yZHNcbiAgICAqICAgQHBhcmFtIGZyb21DaG9yZDogQ2hvcmRcbiAgICAqICAgQHBhcmFtIHRvQ2hvcmQ6IENob3JkXG4gICAgKiAgIEByZXR1cm46IHRlbnNpb24gdmFsdWUgYmV0d2VlbiAtMSBhbmQgMVxuICAgICovXG5cbiAgICBsZXQgcHJldkNob3JkO1xuICAgIGxldCBwcmV2UHJldkNob3JkO1xuICAgIGxldCBwYXNzZWRGcm9tTm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGxldCBwcmV2UGFzc2VkRnJvbU5vdGVzOiBOb3RlW10gPSBbXTtcbiAgICBsZXQgbGF0ZXN0Tm90ZXM6IE5vdGVbXSA9IFtdO1xuICAgIGlmIChkaXZpc2lvbmVkTm90ZXMpIHtcbiAgICAgICAgY29uc3QgbGF0ZXN0RGl2aXNpb24gPSBiZWF0RGl2aXNpb24gLSBCRUFUX0xFTkdUSDtcbiAgICAgICAgbGV0IHRtcCA6IEFycmF5PE5vdGU+ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tsYXRlc3REaXZpc2lvbl0gfHwgW10pKSB7XG4gICAgICAgICAgICAvLyBVc2Ugb3JpZ2luYWwgbm90ZXMsIG5vdCB0aGUgb25lcyB0aGF0IGhhdmUgYmVlbiB0dXJuZWQgaW50byBOQUNzXG4gICAgICAgICAgICB0bXBbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgcHJldkNob3JkID0gcmljaE5vdGUuY2hvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICB0bXAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCByaWNoTm90ZSBvZiAoZGl2aXNpb25lZE5vdGVzW2xhdGVzdERpdmlzaW9uIC0gQkVBVF9MRU5HVEhdIHx8IFtdKSkge1xuICAgICAgICAgICAgdG1wW3JpY2hOb3RlLnBhcnRJbmRleF0gPSByaWNoTm90ZS5vcmlnaW5hbE5vdGUgfHwgcmljaE5vdGUubm90ZTtcbiAgICAgICAgICAgIHByZXZQcmV2Q2hvcmQgPSByaWNoTm90ZS5jaG9yZDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2UGFzc2VkRnJvbU5vdGVzID0gWy4uLnRtcF0uZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgICAgIGZvciAobGV0IGk9YmVhdERpdmlzaW9uOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmljaE5vdGUgb2YgKGRpdmlzaW9uZWROb3Rlc1tpXSB8fCBbXSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobGF0ZXN0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGF0ZXN0Tm90ZXNbcmljaE5vdGUucGFydEluZGV4XSA9IHJpY2hOb3RlLm9yaWdpbmFsTm90ZSB8fCByaWNoTm90ZS5ub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhdGVzdE5vdGVzLmZpbHRlcihub3RlID0+IG5vdGUpLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZyb21Ob3Rlc092ZXJyaWRlKSB7XG4gICAgICAgIHBhc3NlZEZyb21Ob3RlcyA9IGZyb21Ob3Rlc092ZXJyaWRlO1xuICAgIH1cblxuICAgIGxldCBhbGxzYW1lID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9Ob3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIXBhc3NlZEZyb21Ob3Rlc1tpXSkge1xuICAgICAgICAgICAgYWxsc2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2UGFzc2VkRnJvbU5vdGVzW2ldKSB7XG4gICAgICAgICAgICBhbGxzYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBhc3NlZEZyb21Ob3Rlc1tpXS5lcXVhbHModG9Ob3Rlc1tpXSkpIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldlBhc3NlZEZyb21Ob3Rlc1tpXS5lcXVhbHModG9Ob3Rlc1tpXSkpIHtcbiAgICAgICAgICAgIGFsbHNhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2Q2hvcmQgJiYgcHJldlByZXZDaG9yZCAmJiBuZXdDaG9yZCAmJiBwcmV2Q2hvcmQudG9TdHJpbmcoKSA9PSBuZXdDaG9yZC50b1N0cmluZygpICYmIHByZXZQcmV2Q2hvcmQudG9TdHJpbmcoKSA9PSBwcmV2Q2hvcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBhbGxzYW1lID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGFsbHNhbWUpIHtcbiAgICAgICAgdGVuc2lvbi5hbGxOb3Rlc1NhbWUgPSAxMDA7XG4gICAgfVxuXG4gICAgbGV0IGZyb21Ob3RlcztcbiAgICBpZiAocGFzc2VkRnJvbU5vdGVzLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgZnJvbU5vdGVzID0gdG9Ob3RlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tTm90ZXMgPSBwYXNzZWRGcm9tTm90ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgdG9TZW1pdG9uZXMgPSB0b05vdGVzLm1hcChub3RlID0+IG5vdGUuc2VtaXRvbmUpO1xuICAgIGNvbnN0IGZyb21HbG9iYWxTZW1pdG9uZXMgPSBmcm9tTm90ZXMubWFwKG5vdGUgPT4gZ2xvYmFsU2VtaXRvbmUobm90ZSkpO1xuICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmVzID0gdG9Ob3Rlcy5tYXAobm90ZSA9PiBnbG9iYWxTZW1pdG9uZShub3RlKSk7XG5cbiAgICAvLyBJZiB0aGUgbm90ZXMgYXJlIG5vdCBpbiB0aGUgY3VycmVudCBzY2FsZSwgaW5jcmVhc2UgdGhlIHRlbnNpb25cbiAgICBsZXQgbm90ZXNOb3RJblNjYWxlOiBBcnJheTxudW1iZXI+ID0gW11cbiAgICBsZXQgbmV3U2NhbGU6IE51bGxhYmxlPFNjYWxlPiA9IG51bGw7XG4gICAgY29uc3QgbGVhZGluZ1RvbmUgPSAoY3VycmVudFNjYWxlLmtleSAtIDEgKyAyNCkgJSAxMlxuXG4gICAgaWYgKGN1cnJlbnRTY2FsZSkge1xuICAgICAgICBjb25zdCBzY2FsZVNlbWl0b25lcyA9IGN1cnJlbnRTY2FsZS5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnNlbWl0b25lKTtcbiAgICAgICAgbm90ZXNOb3RJblNjYWxlID0gdG9TZW1pdG9uZXMuZmlsdGVyKHNlbWl0b25lID0+ICFzY2FsZVNlbWl0b25lcy5pbmNsdWRlcyhzZW1pdG9uZSkpO1xuICAgICAgICBub3Rlc05vdEluU2NhbGUgPSBub3Rlc05vdEluU2NhbGUuZmlsdGVyKHNlbWl0b25lID0+IHNlbWl0b25lICE9IGxlYWRpbmdUb25lKTtcbiAgICAgICAgaWYgKG5vdGVzTm90SW5TY2FsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBRdWljayByZXR1cm4sIHRoaXMgY2hvcmQgc3Vja3NcbiAgICAgICAgICAgIHRlbnNpb24ubm90SW5TY2FsZSArPSAxMDBcbiAgICAgICAgICAgIHJldHVybiB0ZW5zaW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b0dsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IHRvR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbal0pO1xuICAgICAgICAgICAgaWYgKGludGVydmFsID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi50ZW5zaW9uaW5nSW50ZXJ2YWwgKz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24udGVuc2lvbmluZ0ludGVydmFsICs9IDEuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgnc2Vjb25kJykgfHwgKHByZXZJbnZlcnNpb25OYW1lIHx8IFwiXCIpLnN0YXJ0c1dpdGgoJ3NlY29uZCcpKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tU2VtaXRvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGZyb21TZW1pdG9uZSAtIHRvU2VtaXRvbmUpID4gMikge1xuICAgICAgICAgICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbnZlcnNpb25OYW1lICYmIGludmVyc2lvbk5hbWUuc3RhcnRzV2l0aCgncm9vdCcpKSB7XG4gICAgICAgIHRlbnNpb24uc2Vjb25kSW52ZXJzaW9uIC09IDAuMTsgIC8vIFJvb3QgaW52ZXJzaW9ucyBhcmUgZ3JlYXRcbiAgICB9XG5cbiAgICBjb25zdCBzZW1pdG9uZVNjYWxlSW5kZXg6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7XG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLCAgLy8gQ1xuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzFdLnNlbWl0b25lXTogMSwgIC8vIERcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1syXS5zZW1pdG9uZV06IDIsICAvLyBFXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLCAgLy8gRlxuICAgICAgICBbY3VycmVudFNjYWxlLm5vdGVzWzRdLnNlbWl0b25lXTogNCwgIC8vIEdcbiAgICAgICAgW2N1cnJlbnRTY2FsZS5ub3Rlc1s1XS5zZW1pdG9uZV06IDUsICAvLyBBXG4gICAgICAgIFtjdXJyZW50U2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LCAgLy8gSFxuICAgICAgICBbKGN1cnJlbnRTY2FsZS5ub3Rlc1swXS5zZW1pdG9uZSAtIDEgKyAyNCkgJSAxMl06IDYgIC8vIEZvcmNlIGFkZCBsZWFkaW5nIHRvbmVcbiAgICB9XG5cbiAgICBjb25zdCBsZWFkaW5nVG9uZVNlbWl0b25lID0gY3VycmVudFNjYWxlLm5vdGVzWzBdLnNlbWl0b25lICsgMTE7XG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZnJvbUdsb2JhbFNlbWl0b25lID0gZnJvbUdsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKGZyb21HbG9iYWxTZW1pdG9uZSAlIDEyID09IGxlYWRpbmdUb25lU2VtaXRvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lc1tpXSAhPSBmcm9tR2xvYmFsU2VtaXRvbmUgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwICs9IDEwO1xuICAgICAgICAgICAgICAgIGlmIChpID09IDEgfHwgaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhcyBiYWRcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5sZWFkaW5nVG9uZVVwIC09IDc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxlYWRpbmdUb25lQ291bnQgPSAwO1xuICAgIGZvciAoY29uc3QgdG9HbG9iYWxTZW1pdG9uZSBvZiB0b0dsb2JhbFNlbWl0b25lcykge1xuICAgICAgICBjb25zdCBzY2FsZUluZGV4OiBudW1iZXIgPSBzZW1pdG9uZVNjYWxlSW5kZXhbKHRvR2xvYmFsU2VtaXRvbmUgKyAxMikgJSAxMl07XG4gICAgICAgIGlmIChzY2FsZUluZGV4ID09IDYpIHtcbiAgICAgICAgICAgIGxlYWRpbmdUb25lQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobGVhZGluZ1RvbmVDb3VudCA+IDEpIHtcbiAgICAgICAgdGVuc2lvbi5kb3VibGVMZWFkaW5nVG9uZSArPSAxMDtcbiAgICB9XG5cbiAgICAvLyBkb21pbmFudCA3dGggY2hvcmQgc3R1ZmZcbiAgICBpZiAobmV3Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgIC8vIE5ldmVyIGRvdWJsZSB0aGUgN3RoXG4gICAgICAgIGNvbnN0IHNldmVudGhTZW1pdG9uZSA9IG5ld0Nob3JkLm5vdGVzWzNdLnNlbWl0b25lO1xuICAgICAgICBjb25zdCBzZXZlbnRoQ291bnQgPSB0b1NlbWl0b25lcy5maWx0ZXIoc2VtaXRvbmUgPT4gc2VtaXRvbmUgPT0gc2V2ZW50aFNlbWl0b25lKS5sZW5ndGg7XG4gICAgICAgIGlmIChzZXZlbnRoQ291bnQgPiAxKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLnNldmVudGhUZW5zaW9uICs9IDEwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgIGlmICghbmV3Q2hvcmQ/LmNob3JkVHlwZS5pbmNsdWRlcygnNycpKSB7XG4gICAgICAgICAgICAvLyA3dGggbXVzdCByZXNvbHZlIGRvd25cbiAgICAgICAgICAgIGNvbnN0IHNldmVudGhTZW1pdG9uZSA9IHByZXZDaG9yZC5ub3Rlc1szXS5zZW1pdG9uZTtcbiAgICAgICAgICAgIGNvbnN0IHNldmVudEdUb25lID0gZnJvbUdsb2JhbFNlbWl0b25lcy5maWx0ZXIoZ1RvbmUgPT4gZ1RvbmUgJSAxMiA9PSBzZXZlbnRoU2VtaXRvbmUpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFJlc29sdmVzVG8gPSBbc2V2ZW50R1RvbmUgLSAxLCBzZXZlbnRHVG9uZSAtIDJdO1xuICAgICAgICAgICAgY29uc3Qgc2V2ZW50aFJlc29sdmVzVG9Db3VudCA9IHRvR2xvYmFsU2VtaXRvbmVzLmZpbHRlcihnVG9uZSA9PiBzZXZlbnRoUmVzb2x2ZXNUby5pbmNsdWRlcyhnVG9uZSkpLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChzZXZlbnRoUmVzb2x2ZXNUb0NvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLnNldmVudGhUZW5zaW9uICs9IDExO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZGlyZWN0aW9uc1xuICAgIGNvbnN0IGRpcmVjdGlvbkNvdW50cyA9IHtcbiAgICAgICAgXCJ1cFwiOiAwLFxuICAgICAgICBcImRvd25cIjogMCxcbiAgICAgICAgXCJzYW1lXCI6IDAsXG4gICAgfVxuICAgIGNvbnN0IHBhcnREaXJlY3Rpb24gPSBbXTtcbiAgICBsZXQgcm9vdEJhc3NEaXJlY3Rpb24gPSBudWxsO1xuICAgIGZvciAobGV0IGk9MDsgaTxmcm9tR2xvYmFsU2VtaXRvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgIGNvbnN0IHRvU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRvU2VtaXRvbmUgLSBmcm9tU2VtaXRvbmU7XG4gICAgICAgIHBhcnREaXJlY3Rpb25baV0gPSBkaWZmIDwgMCA/IFwiZG93blwiIDogZGlmZiA+IDAgPyBcInVwXCIgOiBcInNhbWVcIjtcbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25Db3VudHMudXAgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uQ291bnRzLnNhbWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlmZiAhPSAwICYmIChpbnZlcnNpb25OYW1lIHx8ICcnKS5zdGFydHNXaXRoKCdyb290JykpIHtcbiAgICAgICAgICAgIHJvb3RCYXNzRGlyZWN0aW9uID0gZGlmZiA+IDAgPyAndXAnIDogJ2Rvd24nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUm9vdCBiYXNzIG1ha2VzIHVwIGZvciBvbmUgdXAvZG93blxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcInVwXCIgJiYgZGlyZWN0aW9uQ291bnRzLmRvd24gPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy5kb3duIC09IDE7XG4gICAgfVxuICAgIGlmIChyb290QmFzc0RpcmVjdGlvbiA9PSBcImRvd25cIiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbkNvdW50cy51cCAtPSAxO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uQ291bnRzLnVwID4gMiAmJiBkaXJlY3Rpb25Db3VudHMuZG93biA8IDEpIHtcbiAgICAgICAgdGVuc2lvbi52b2ljZURpcmVjdGlvbnMgKz0gMztcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbkNvdW50cy5kb3duID4gMiAmJiBkaXJlY3Rpb25Db3VudHMudXAgPCAxKSB7XG4gICAgICAgIHRlbnNpb24udm9pY2VEaXJlY3Rpb25zICs9IDM7XG4gICAgfVxuICAgIGlmIChwYXJ0RGlyZWN0aW9uWzBdID09IHBhcnREaXJlY3Rpb25bM10gJiYgcGFydERpcmVjdGlvblswXSAhPSBcInNhbWVcIikge1xuICAgICAgICB0ZW5zaW9uLnZvaWNlRGlyZWN0aW9ucyArPSA1O1xuICAgICAgICAvLyByb290IGFuZCBzb3ByYW5vcyBtb3ZpbmcgaW4gc2FtZSBkaXJlY3Rpb25cbiAgICB9XG5cbiAgICAvLyBQYXJhbGxlbCBtb3Rpb24gYW5kIGhpZGRlbiBmaWZ0aHNcbiAgICBmb3IgKGxldCBpPTA7IGk8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8dG9HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChmcm9tR2xvYmFsU2VtaXRvbmVzW2ldID09IHRvR2xvYmFsU2VtaXRvbmVzW2ldICYmIGZyb21HbG9iYWxTZW1pdG9uZXNbal0gPT0gdG9HbG9iYWxTZW1pdG9uZXNbal0pIHtcbiAgICAgICAgICAgICAgICAvLyBQYXJ0IGkgYW5kIGogYXJlIHN0YXlpbmcgc2FtZVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRvR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsRnJvbSA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSBmcm9tR2xvYmFsU2VtaXRvbmVzW2pdKTtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8IDIwICYmIGludGVydmFsICUgMTIgPT0gNyB8fCBpbnRlcnZhbCAlIDEyID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBQb3NzaWJseSBhIHBhcmFsbGVsLCBjb250cmFyeSBvciBoaWRkZW4gZmlmdGgvb2N0YXZlXG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IGludGVydmFsRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLnBhcmFsbGVsRmlmdGhzICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHNvcHJhbm8tYmFzcyBpbnRlcnZhbCBpcyBoaWRkZW5cbiAgICAvLyBpLmUuIHBhcnRzIDAgYW5kIDMgYXJlIG1vdmluZyBpbiBzYW1lIGRpcmVjdGlvblxuICAgIC8vIEFuZCBwYXJ0IDAgaXMgbWFraW5nIGEganVtcFxuICAgIC8vIEFuZCB0aGUgcmVzdWx0aW5nIGludGVydmFsIGlzIGEgZmlmdGgvb2N0YXZlXG4gICAgY29uc3QgcGFydDBEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1swXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbMF07XG4gICAgY29uc3QgcGFydDNEaXJlY3Rpb24gPSB0b0dsb2JhbFNlbWl0b25lc1szXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbM107XG4gICAgaWYgKE1hdGguYWJzKHBhcnQwRGlyZWN0aW9uKSA+IDIpIHtcbiAgICAgICAgLy8gVXBwZXIgcGFydCBpcyBtYWtpbmcgYSBqdW1wXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnModG9HbG9iYWxTZW1pdG9uZXNbMF0gLSB0b0dsb2JhbFNlbWl0b25lc1szXSkgJSAxMjtcbiAgICAgICAgaWYgKChpbnRlcnZhbCA9PSA3IHx8IGludGVydmFsID09IDApICYmIE1hdGguc2lnbihwYXJ0MERpcmVjdGlvbikgPT0gTWF0aC5zaWduKHBhcnQzRGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgLy8gU2FtZSBkaXJlY3Rpb24gYW5kIHJlc3VsdGluZyBpbnRlcnZhbCBpcyBhIGZpZnRoL29jdGF2ZVxuICAgICAgICAgICAgdGVuc2lvbi5wYXJhbGxlbEZpZnRocyArPSAxMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpPTA7IGk8MzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvSW50ZXJ2YWxXaXRoQmFzcyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pICUgMTI7XG4gICAgICAgIGNvbnN0IGZyb21JbnRlclZhbFdpdGhCYXNzID0gTWF0aC5hYnMoZnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbM10pICUgMTI7XG4gICAgICAgIGlmIChmcm9tSW50ZXJWYWxXaXRoQmFzcyA9PSA2KSB7XG4gICAgICAgICAgICBpZiAodG9JbnRlcnZhbFdpdGhCYXNzID09IDcpIHtcbiAgICAgICAgICAgICAgICAvLyBVbmVxdWFsIGZpZnRocyAoZGltaW5pc2hlZCA1dGggdG8gcGVyZmVjdCA1dGgpIHdpdGggYmFzc1xuICAgICAgICAgICAgICAgIHRlbnNpb24ucGFyYWxsZWxGaWZ0aHMgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTcGFjaW5nIGVycm9yc1xuICAgIGNvbnN0IHBhcnQwVG9QYXJ0MSA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzBdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMV0pO1xuICAgIGNvbnN0IHBhcnQxVG9QYXJ0MiA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzFdIC0gdG9HbG9iYWxTZW1pdG9uZXNbMl0pO1xuICAgIGNvbnN0IHBhcnQyVG9QYXJ0MyA9IE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzWzJdIC0gdG9HbG9iYWxTZW1pdG9uZXNbM10pO1xuICAgIGlmIChwYXJ0MVRvUGFydDIgPiAxMiB8fCBwYXJ0MFRvUGFydDEgPiAxMiB8fCBwYXJ0MlRvUGFydDMgPiAoMTIgKyA3KSkge1xuICAgICAgICB0ZW5zaW9uLnNwYWNpbmdFcnJvciArPSA1O1xuICAgIH1cblxuICAgIC8vIE92ZXJsYXBwaW5nIGVycm9yXG4gICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbG93ZXJGcm9tR1RvbmUgPSBmcm9tR2xvYmFsU2VtaXRvbmVzW2kgKyAxXTtcbiAgICAgICAgY29uc3QgbG93ZXJUb0dUb25lID0gdG9HbG9iYWxTZW1pdG9uZXNbaSArIDFdO1xuICAgICAgICBjb25zdCB1cHBlckZyb21HVG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaSAtIDFdO1xuICAgICAgICBjb25zdCB1cHBlclRvR1RvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHRvR2xvYmFsU2VtaXRvbmUgPSB0b0dsb2JhbFNlbWl0b25lc1tpXTtcbiAgICAgICAgaWYgKHVwcGVyVG9HVG9uZSB8fCB1cHBlckZyb21HVG9uZSkge1xuICAgICAgICAgICAgaWYgKHRvR2xvYmFsU2VtaXRvbmUgPiBNYXRoLm1pbih1cHBlclRvR1RvbmUgfHwgMCwgdXBwZXJGcm9tR1RvbmUgfHwgMCkpIHtcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm92ZXJsYXBwaW5nICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlclRvR1RvbmUgfHwgbG93ZXJGcm9tR1RvbmUpIHtcbiAgICAgICAgICAgIGlmICh0b0dsb2JhbFNlbWl0b25lIDwgTWF0aC5tYXgobG93ZXJUb0dUb25lIHx8IDAsIGxvd2VyRnJvbUdUb25lIHx8IDApKSB7XG4gICAgICAgICAgICAgICAgdGVuc2lvbi5vdmVybGFwcGluZyArPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lbG9keSB0ZW5zaW9uXG4gICAgLy8gQXZvaWQganVtcHMgdGhhdCBhcmUgYXVnIG9yIDd0aCBvciBoaWdoZXJcbiAgICBmb3IgKGxldCBpPTA7IGk8ZnJvbUdsb2JhbFNlbWl0b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguYWJzKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0gLSB0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSAzKSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA+PSA1KSB7XG4gICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPj0gNykge1xuICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID49IDEwKSB7ICAvLyA3dGggPT0gMTBcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxMDA7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gNiB8fCBpbnRlcnZhbCA9PSA4KSAvLyB0cml0b25lIChhdWcgNHRoKSBvciBhdWcgNXRoXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA1O1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDcpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVydmFsID09IDkpIHtcbiAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSAyO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAwIHByaWltaVxuICAgIC8vIDEgcGllbmkgc2VrdW50aVxuICAgIC8vIDIgc3V1cmkgc2VrdW50aVxuICAgIC8vIDMgcGllbmkgdGVyc3NpXG4gICAgLy8gNCBzdXVyaSB0ZXJzc2lcbiAgICAvLyA1IGt2YXJ0dGlcbiAgICAvLyA2IHRyaXRvbnVzXG4gICAgLy8gNyBrdmludHRpXG4gICAgLy8gOCBwaWVuaSBzZWtzdGlcbiAgICAvLyA5IHN1dXJpIHNla3N0aVxuICAgIC8vIDEwIHBpZW5pIHNlcHRpbWlcbiAgICAvLyAxMSBzdXVyaSBzZXB0aW1pXG4gICAgLy8gMTIgb2t0YWF2aVxuXG4gICAgLy8gV2FzIHRoZXJlIGEganVtcCBiZWZvcmU/XG4gICAgaWYgKGxhdGVzdE5vdGVzICYmIGxhdGVzdE5vdGVzLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgIGNvbnN0IGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXMgPSBsYXRlc3ROb3Rlcy5tYXAoKG4pID0+IGdsb2JhbFNlbWl0b25lKG4pKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGZyb21HbG9iYWxTZW1pdG9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5hYnMobGF0ZXN0RnJvbUdsb2JhbFNlbWl0b25lc1tpXSAtIGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgaWYgKGludGVydmFsID49IDMpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSB3YXMgYSBqdW1wLiBXRSBNVVNUIEdPIEJBQ0shXG4gICAgICAgICAgICAgICAgLy8gQmFzaWNhbGx5IHRoZSB0b0dsb2JhbFNlbWl0b25lIG11c3QgYmUgYmV0d2VlbiB0aGUgcHJldkZyb21HbG9iYWxTZW1pdG9uZSBhbmQgdGhlIGZyb21HbG9iYWxTZW1pdG9uZVxuICAgICAgICAgICAgICAgIC8vIFVOTEVTUyB3ZSdyZSBvdXRsaW5pbmcgYSB0cmlhZC5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdvdWxkIG1lYW4gdGhhdCBhZnRlciBhIDR0aCB1cCwgd2UgbmVlZCB0byBnbyB1cCBhbm90aGVyIDNyZFxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZGcm9tU2VtaXRvbmUgPSBsYXRlc3RGcm9tR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21TZW1pdG9uZSA9IGZyb21HbG9iYWxTZW1pdG9uZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgdG9TZW1pdG9uZSA9IHRvR2xvYmFsU2VtaXRvbmVzW2ldO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbk11bHRpcGxpZXIgPSBmcm9tU2VtaXRvbmUgPiBwcmV2RnJvbVNlbWl0b25lID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRJbnRlcnZhbCA9IGRpcmVjdGlvbk11bHRpcGxpZXIgKiAodG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pbm9yIDNyZCB1cCwgdGhlbiBtYWogdGhpcmQgdXAuIFRoYXQncyBhIHJvb3QgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtaW5vciAzcmQgdXAsIHRoZW4gcGVyZmVjdCA0dGggdXAuIFRoYXQncyBhIGZpcnN0IGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW50ZXJ2YWwgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFqb3IgM3JkIHVwLCB0aGVuIG1pbm9yIDNyZCB1cC4gVGhhdCdzIGEgcm9vdCBpbnZlcnNpb24gbWFqb3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ham9yIDNyZCB1cCwgdGhlbiBwZXJmZWN0IDR0aCB1cC4gVGhhdCdzIGEgZmlyc3QgaW52ZXJzaW9uIG1pbm9yIGNob3JkIVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGludGVydmFsID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwZXJmZWN0IDR0aCB1cCwgdGhlbiBtaW5vciAzcmQgdXAuIFRoYXQncyBhIHNlY29uZCBpbnZlcnNpb24gbWlub3IgY2hvcmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmZlY3QgNHRoIHVwLCB0aGVuIG1ham9yIDNyZCB1cC4gVGhhdCdzIGEgc2Vjb25kIGludmVyc2lvbiBtYWpvciBjaG9yZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGlnaGVyIHRoYW4gdGhhdCwgbm8gdHJpYWQgaXMgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgaWYgKChmcm9tU2VtaXRvbmUgPj0gcHJldkZyb21TZW1pdG9uZSAmJiB0b1NlbWl0b25lID49IGZyb21TZW1pdG9uZSkgfHwgKGZyb21TZW1pdG9uZSA8PSBwcmV2RnJvbVNlbWl0b25lICYmIHRvU2VtaXRvbmUgPD0gZnJvbVNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3QgZ29pbmYgYmFjayBkb3duL3VwLi4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMC41O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGludGVydmFsIDw9IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA0OyAgLy8gTm90IGFzIGJhZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlKdW1wICs9IDEwMDsgIC8vIFRlcnJpYmxlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIGRvd24vdXAuLi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja0ludGVydmFsID0gTWF0aC5hYnModG9TZW1pdG9uZSAtIGZyb21TZW1pdG9uZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYWNrSW50ZXJ2YWwgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBiYWNrIHRvbyBtdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPD0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5SnVtcCArPSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keUp1bXAgKz0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJldlBhc3NlZEZyb21HVG9uZXMgPSBwcmV2UGFzc2VkRnJvbU5vdGVzID8gcHJldlBhc3NlZEZyb21Ob3Rlcy5tYXAoKG4pID0+IGdsb2JhbFNlbWl0b25lKG4pKSA6IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8NDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBnVG9uZXNGb3JUaGlzUGFydCA9IFtdO1xuICAgICAgICAgICAgaWYgKHByZXZQYXNzZWRGcm9tR1RvbmVzW2ldKSB7XG4gICAgICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaChwcmV2UGFzc2VkRnJvbUdUb25lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKGZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgaWYgKGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBnVG9uZXNGb3JUaGlzUGFydC5wdXNoKGxhdGVzdEZyb21HbG9iYWxTZW1pdG9uZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ1RvbmVzRm9yVGhpc1BhcnQucHVzaCh0b0dsb2JhbFNlbWl0b25lc1tpXSk7XG5cbiAgICAgICAgICAgIGxldCBnZW5lcmFsRGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgIC8vIEdldCBkaXJlY3Rpb25zIGJlZm9yZSBsYXRlc3Qgbm90ZXNcbiAgICAgICAgICAgIC8vIEUuZy4gaWYgdGhlIG5vdGUgdmFsdWVzIGhhdmUgYmVlbiAwLCAxLCA0LCAwXG4gICAgICAgICAgICAvLyB0aGUgZ2VuZXJhbERpcmVjdGlvbiB3b3VsZCBiZSAxICsgNCA9PSA1LCB3aGljaCBtZWFucyB0aGF0IGV2ZW4gdGhvdWdoIHRoZVxuICAgICAgICAgICAgLy8gZ2xvYmFsIGRpcmVjdGlvbiBpcyBcInNhbWVcIiwgdGhlIGdlbmVyYWwgZGlyZWN0aW9uIGlzIFwidXBcIlxuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPGdUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDI7IGorKykge1xuICAgICAgICAgICAgICAgIGdlbmVyYWxEaXJlY3Rpb24gKz0gZ1RvbmVzRm9yVGhpc1BhcnRbaisxXSAtIGdUb25lc0ZvclRoaXNQYXJ0W2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBnbG9iYWxEaXJlY3Rpb24gPSBnVG9uZXNGb3JUaGlzUGFydFtnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAxXSAtIGdUb25lc0ZvclRoaXNQYXJ0WzBdO1xuICAgICAgICAgICAgY29uc3QgZmluYWxEaXJlY3Rpb24gPSBnVG9uZXNGb3JUaGlzUGFydFtnVG9uZXNGb3JUaGlzUGFydC5sZW5ndGggLSAxXSAtIGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgdGVuc2lvbi5jb21tZW50ID0gXCJmaW5hbERpcmVjdGlvbjogXCIgKyBmaW5hbERpcmVjdGlvbiArIFwiLCBnbG9iYWxEaXJlY3Rpb246IFwiICsgZ2xvYmFsRGlyZWN0aW9uICsgXCIsIGdlbmVyYWxEaXJlY3Rpb246IFwiICsgZ2VuZXJhbERpcmVjdGlvbjtcblxuICAgICAgICAgICAgaWYgKGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdICE9IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDJdICYmIGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDFdID09IGdUb25lc0ZvclRoaXNQYXJ0W2dUb25lc0ZvclRoaXNQYXJ0Lmxlbmd0aCAtIDNdKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8gdGhlIHNhbWUgbm90ZSBhcyBiZWZvcmUuIFRoYXQncyBiYWQuXG4gICAgICAgICAgICAgICAgLy8gWmlnIHphZ2dpbmdcbiAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbmFsRGlyZWN0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbWl0b25lTGltaXQgPSBzdGFydGluZ05vdGVzKHBhcmFtcykuc2VtaXRvbmVMaW1pdHNbaV07XG5cbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Tm90ZSA9IHNlbWl0b25lTGltaXRbMV0gLSA0O1xuICAgICAgICAgICAgICAgIHRhcmdldE5vdGUgLT0gaSAqIDI7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Tm90ZVJlYWNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvbiA9IHBhcmFtcy5hdXRoZW50aWNDYWRlbmNlU3RhcnREaXZpc2lvbjtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkaXY9YmVhdERpdmlzaW9uOyBkaXY+YXV0aGVudGljQ2FkZW5jZVN0YXJ0RGl2aXNpb247IGRpdi0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdGVzID0gKGRpdmlzaW9uZWROb3RlcyB8fCB7fSlbZGl2XSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBwcmV2Tm90ZSBvZiBub3Rlcy5maWx0ZXIocmljaE5vdGUgPT4gcmljaE5vdGUucGFydEluZGV4ID09IGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsU2VtaXRvbmUocHJldk5vdGUubm90ZSkgPT0gdGFyZ2V0Tm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE5vdGVSZWFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXROb3RlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLmNvbW1lbnQgPSBcIlRhcmdldCBub3RlIHJlYWNoZWQgXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0b0dsb2JhbFNlbWl0b25lc1tpXSAtIHRhcmdldE5vdGUpIDw9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGNsb3NlIHRvIHRoZSB0YXJnZXQgbm90ZSwgbGV0J3MgTk9UIGdvIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEaXJlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVuc2lvbi5tZWxvZHlUYXJnZXQgKz0gMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvR2xvYmFsU2VtaXRvbmVzW2ldIC0gdGFyZ2V0Tm90ZSkgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY2xvc2UgdG8gdGhlIHRhcmdldCBub3RlLCBsZXQncyBOT1QgYSBsb3QgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZW5lcmFsRGlyZWN0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uLm1lbG9keVRhcmdldCArPSBnZW5lcmFsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbERpcmVjdGlvbiA8PSAwICYmIGZpbmFsRGlyZWN0aW9uIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW4gZG93biwgbm90IGdvb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb24ubWVsb2R5VGFyZ2V0ICs9IC0xICogZ2xvYmFsRGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbnNpb247XG59XG4iLCJpbXBvcnQgeyBOb3RlLCBTY2FsZSwgU2VtaXRvbmUgfSBmcm9tIFwibXVzaWN0aGVvcnlqc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbXlsb2dnZXJcIjtcbmltcG9ydCB7IE1haW5NdXNpY1BhcmFtcywgTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9wYXJhbXNcIjtcbmltcG9ydCB7IFRlbnNpb24gfSBmcm9tIFwiLi90ZW5zaW9uXCI7XG5cbmV4cG9ydCBjb25zdCBCRUFUX0xFTkdUSCA9IDEyO1xuXG50eXBlIFBpY2tOdWxsYWJsZTxUPiA9IHtcbiAgICBbUCBpbiBrZXlvZiBUIGFzIG51bGwgZXh0ZW5kcyBUW1BdID8gUCA6IG5ldmVyXTogVFtQXVxufVxuXG50eXBlIFBpY2tOb3ROdWxsYWJsZTxUPiA9IHtcbiAgICBbUCBpbiBrZXlvZiBUIGFzIG51bGwgZXh0ZW5kcyBUW1BdID8gbmV2ZXIgOiBQXTogVFtQXVxufVxuXG5leHBvcnQgdHlwZSBPcHRpb25hbE51bGxhYmxlPFQ+ID0ge1xuICAgIFtLIGluIGtleW9mIFBpY2tOdWxsYWJsZTxUPl0/OiBFeGNsdWRlPFRbS10sIG51bGw+XG59ICYge1xuICAgICAgICBbSyBpbiBrZXlvZiBQaWNrTm90TnVsbGFibGU8VD5dOiBUW0tdXG4gICAgfVxuXG5cbmV4cG9ydCBjb25zdCBzZW1pdG9uZURpc3RhbmNlID0gKHRvbmUxOiBudW1iZXIsIHRvbmUyOiBudW1iZXIpID0+IHtcbiAgICAvLyBkaXN0YW5jZSBmcm9tIDAgdG8gMTEgc2hvdWxkIGJlIDFcbiAgICAvLyAwIC0gMTEgKyAxMiA9PiAxXG4gICAgLy8gMTEgLSAwICsgMTIgPT4gMjMgPT4gMTFcblxuICAgIC8vIDAgLSA2ICsgMTIgPT4gNlxuICAgIC8vIDYgLSAwICsgMTIgPT4gMTggPT4gNlxuXG4gICAgLy8gMCArIDYgLSAzICsgNiA9IDYgLSA5ID0gLTNcbiAgICAvLyA2ICsgNiAtIDkgKyA2ID0gMTIgLSAxNSA9IDAgLSAzID0gLTNcbiAgICAvLyAxMSArIDYgLSAwICsgNiA9IDE3IC0gNiA9IDUgLSA2ID0gLTFcbiAgICAvLyAwICsgNiAtIDExICsgNiA9IDYgLSAxNyA9IDYgLSA1ID0gMVxuXG4gICAgLy8gKDYgKyA2KSAlIDEyID0gMFxuICAgIC8vICg1ICsgNikgJSAxMiA9IDExXG4gICAgLy8gUmVzdWx0ID0gMTEhISEhXG5cbiAgICByZXR1cm4gTWF0aC5taW4oXG4gICAgICAgIE1hdGguYWJzKHRvbmUxIC0gdG9uZTIpLFxuICAgICAgICBNYXRoLmFicygodG9uZTEgKyA2KSAlIDEyIC0gKHRvbmUyICsgNikgJSAxMilcbiAgICApO1xufVxuXG5leHBvcnQgY29uc3Qgc2VtaXRvbmVTY2FsZUluZGV4ID0gKHNjYWxlOiBTY2FsZSk6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPT4gKHtcbiAgICBbc2NhbGUubm90ZXNbMF0uc2VtaXRvbmVdOiAwLFxuICAgIFtzY2FsZS5ub3Rlc1sxXS5zZW1pdG9uZV06IDEsXG4gICAgW3NjYWxlLm5vdGVzWzJdLnNlbWl0b25lXTogMixcbiAgICBbc2NhbGUubm90ZXNbM10uc2VtaXRvbmVdOiAzLFxuICAgIFtzY2FsZS5ub3Rlc1s0XS5zZW1pdG9uZV06IDQsXG4gICAgW3NjYWxlLm5vdGVzWzVdLnNlbWl0b25lXTogNSxcbiAgICBbc2NhbGUubm90ZXNbNl0uc2VtaXRvbmVdOiA2LFxufSlcblxuXG5leHBvcnQgY29uc3QgbmV4dEdUb25lSW5TY2FsZSA9IChnVG9uZTogU2VtaXRvbmUsIGluZGV4RGlmZjogbnVtYmVyLCBzY2FsZTogU2NhbGUpOiBOdWxsYWJsZTxudW1iZXI+ID0+IHtcbiAgICBsZXQgZ1RvbmUxID0gZ1RvbmU7XG4gICAgY29uc3Qgc2NhbGVJbmRleGVzID0gc2VtaXRvbmVTY2FsZUluZGV4KHNjYWxlKVxuICAgIGxldCBzY2FsZUluZGV4ID0gc2NhbGVJbmRleGVzW2dUb25lMSAlIDEyXTtcbiAgICBpZiAoIXNjYWxlSW5kZXgpIHtcbiAgICAgICAgZ1RvbmUxID0gZ1RvbmUgKyAxO1xuICAgICAgICBzY2FsZUluZGV4ID0gc2NhbGVJbmRleGVzW2dUb25lMSAlIDEyXTtcbiAgICB9XG4gICAgaWYgKCFzY2FsZUluZGV4KSB7XG4gICAgICAgIGdUb25lMSA9IGdUb25lIC0gMTtcbiAgICAgICAgc2NhbGVJbmRleCA9IHNjYWxlSW5kZXhlc1tnVG9uZTEgJSAxMl07XG4gICAgfVxuICAgIGlmICghc2NhbGVJbmRleCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbmV3U2NhbGVJbmRleCA9IChzY2FsZUluZGV4ICsgaW5kZXhEaWZmKSAlIDc7XG4gICAgY29uc3QgbmV3U2VtaXRvbmUgPSBzY2FsZS5ub3Rlc1tuZXdTY2FsZUluZGV4XS5zZW1pdG9uZTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IHNlbWl0b25lRGlzdGFuY2UoZ1RvbmUxICUgMTIsIG5ld1NlbWl0b25lKTtcbiAgICBjb25zdCBuZXdHdG9uZSA9IGdUb25lMSArIChkaXN0YW5jZSAqIChpbmRleERpZmYgPiAwID8gMSA6IC0xKSk7XG5cbiAgICByZXR1cm4gbmV3R3RvbmU7XG59XG5cblxuZXhwb3J0IGNvbnN0IHN0YXJ0aW5nTm90ZXMgPSAocGFyYW1zOiBNdXNpY1BhcmFtcykgPT4ge1xuICAgIGNvbnN0IHAxTm90ZSA9IHBhcmFtcy5wYXJ0c1swXS5ub3RlIHx8IFwiRjRcIjtcbiAgICBjb25zdCBwMk5vdGUgPSBwYXJhbXMucGFydHNbMV0ubm90ZSB8fCBcIkM0XCI7XG4gICAgY29uc3QgcDNOb3RlID0gcGFyYW1zLnBhcnRzWzJdLm5vdGUgfHwgXCJBM1wiO1xuICAgIGNvbnN0IHA0Tm90ZSA9IHBhcmFtcy5wYXJ0c1szXS5ub3RlIHx8IFwiQzNcIjtcblxuICAgIGNvbnN0IHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzID0gW1xuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwMU5vdGUpKSxcbiAgICAgICAgZ2xvYmFsU2VtaXRvbmUobmV3IE5vdGUocDJOb3RlKSksXG4gICAgICAgIGdsb2JhbFNlbWl0b25lKG5ldyBOb3RlKHAzTm90ZSkpLFxuICAgICAgICBnbG9iYWxTZW1pdG9uZShuZXcgTm90ZShwNE5vdGUpKSxcbiAgICBdXG5cbiAgICBjb25zdCBzZW1pdG9uZUxpbWl0cyA9IFtcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzBdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1swXSArIDEyIC0gNV0sXG4gICAgICAgIFtzdGFydGluZ0dsb2JhbFNlbWl0b25lc1sxXSArIC0xMiwgc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMV0gKyAxMiAtIDVdLFxuICAgICAgICBbc3RhcnRpbmdHbG9iYWxTZW1pdG9uZXNbMl0gKyAtMTIsIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzJdICsgMTIgLSA1XSxcbiAgICAgICAgW3N0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzWzNdICsgLTEyLCBzdGFydGluZ0dsb2JhbFNlbWl0b25lc1szXSArIDEyIC0gNV0sXG4gICAgXVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0aW5nR2xvYmFsU2VtaXRvbmVzLFxuICAgICAgICBzZW1pdG9uZUxpbWl0cyxcbiAgICB9XG59XG5cblxuY29uc3QgbXlTZW1pdG9uZVN0cmluZ3M6IHtba2V5OiBudW1iZXJdOiBzdHJpbmd9ID0ge1xuICAgIDA6IFwiQ1wiLFxuICAgIDE6IFwiQyNcIixcbiAgICAyOiBcIkRcIixcbiAgICAzOiBcIkQjXCIsXG4gICAgNDogXCJFXCIsXG4gICAgNTogXCJGXCIsXG4gICAgNjogXCJGI1wiLFxuICAgIDc6IFwiR1wiLFxuICAgIDg6IFwiRyNcIixcbiAgICA5OiBcIkFcIixcbiAgICAxMDogXCJBI1wiLFxuICAgIDExOiBcIkJcIixcbn1cblxuXG5leHBvcnQgY29uc3QgZ1RvbmVTdHJpbmcgPSAoZ1RvbmU6IG51bWJlciB8IG51bGwpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghZ1RvbmUpIHtcbiAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgIH1cbiAgICByZXR1cm4gYCR7bXlTZW1pdG9uZVN0cmluZ3NbZ1RvbmUgJSAxMl19JHtNYXRoLmZsb29yKGdUb25lIC8gMTIpfWA7XG59XG5cblxuZXhwb3J0IGNvbnN0IGFycmF5T3JkZXJCeSA9IGZ1bmN0aW9uIChhcnJheTogQXJyYXk8YW55Piwgc2VsZWN0b3I6IENhbGxhYmxlRnVuY3Rpb24sIGRlc2MgPSBmYWxzZSkge1xuICAgIHJldHVybiBbLi4uYXJyYXldLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgYSA9IHNlbGVjdG9yKGEpO1xuICAgICAgICBiID0gc2VsZWN0b3IoYik7XG5cbiAgICAgICAgaWYgKGEgPT0gYikgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiAoZGVzYyA/IGEgPiBiIDogYSA8IGIpID8gLTEgOiAxO1xuICAgIH0pO1xufVxuXG5cbmV4cG9ydCBjb25zdCBjaG9yZFRlbXBsYXRlczogeyBba2V5OiBzdHJpbmddOiBBcnJheTxudW1iZXI+IH0gPSB7XG4gICAgbWFqOiBbMCwgNCwgN10sXG4gICAgbWluOiBbMCwgMywgN10sXG4gICAgZGltOiBbMCwgMywgNl0sXG4gICAgZGltNzogWzAsIDMsIDYsIDEwXSxcbiAgICBhdWc6IFswLCA0LCA4XSxcbiAgICBtYWo3OiBbMCwgNCwgNywgMTFdLFxuICAgIG1pbjc6IFswLCAzLCA3LCAxMF0sXG4gICAgZG9tNzogWzAsIDQsIDcsIDEwXSxcbiAgICBzdXMyOiBbMCwgMiwgN10sXG4gICAgc3VzNDogWzAsIDUsIDddLFxufVxuXG5cbmV4cG9ydCBjbGFzcyBDaG9yZCB7XG4gICAgcHVibGljIG5vdGVzOiBBcnJheTxOb3RlPjtcbiAgICBwdWJsaWMgcm9vdDogbnVtYmVyO1xuICAgIHB1YmxpYyBjaG9yZFR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIC8vIEZpbmQgY29ycmVjdCBTZW1pdG9uZSBrZXlcbiAgICAgICAgY29uc3Qgc2VtaXRvbmVLZXlzID0gT2JqZWN0LmtleXMoU2VtaXRvbmUpLmZpbHRlcihrZXkgPT4gKFNlbWl0b25lIGFzIGFueSlba2V5XSBhcyBudW1iZXIgPT09IHRoaXMubm90ZXNbMF0uc2VtaXRvbmUpO1xuICAgICAgICBpZiAoc2VtaXRvbmVLZXlzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub3Rlcy5tYXAobm90ZSA9PiBub3RlLnRvU3RyaW5nKCkpLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VtaXRvbmVLZXkgPSBzZW1pdG9uZUtleXMuZmlsdGVyKGtleSA9PiBrZXkuaW5kZXhPZignYicpID09IC0xICYmIGtleS5pbmRleE9mKCdzJykgPT0gLTEpWzBdIHx8IHNlbWl0b25lS2V5c1swXTtcbiAgICAgICAgc2VtaXRvbmVLZXkgPSBzZW1pdG9uZUtleS5yZXBsYWNlKCdzJywgJyMnKTtcbiAgICAgICAgcmV0dXJuIHNlbWl0b25lS2V5ICsgdGhpcy5jaG9yZFR5cGU7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHNlbWl0b25lT3JOYW1lOiBudW1iZXIgfCBzdHJpbmcsIGNob3JkVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBzZW1pdG9uZTtcbiAgICAgICAgaWYgKHR5cGVvZiBzZW1pdG9uZU9yTmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgc2VtaXRvbmUgPSBzZW1pdG9uZU9yTmFtZS5tYXRjaCgvXlxcZCsvKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSBzZW1pdG9uZU9yTmFtZS5tYXRjaCgvXlxcZCsoLiopLyk7XG4gICAgICAgICAgICBpZiAoc2VtaXRvbmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBjaG9yZCBuYW1lIFwiICsgc2VtaXRvbmVPck5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyc2VkVHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGNob3JkIG5hbWUgXCIgKyBzZW1pdG9uZU9yTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbWl0b25lID0gcGFyc2VJbnQoc2VtaXRvbmVbMF0pO1xuICAgICAgICAgICAgY2hvcmRUeXBlID0gY2hvcmRUeXBlIHx8IHBhcnNlZFR5cGVbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW1pdG9uZSA9IHNlbWl0b25lT3JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdCA9IHBhcnNlSW50KGAke3NlbWl0b25lfWApO1xuICAgICAgICB0aGlzLmNob3JkVHlwZSA9IGNob3JkVHlwZSB8fCBcIj9cIjtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBjaG9yZFRlbXBsYXRlc1t0aGlzLmNob3JkVHlwZV07XG4gICAgICAgIGlmICh0ZW1wbGF0ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IFwiVW5rbm93biBjaG9yZCB0eXBlOiBcIiArIGNob3JkVHlwZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vdGVzID0gW107XG4gICAgICAgIGZvciAobGV0IG5vdGUgb2YgdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMubm90ZXMucHVzaChuZXcgTm90ZSh7IHNlbWl0b25lOiAoc2VtaXRvbmUgKyBub3RlKSAlIDEyLCBvY3RhdmU6IDEgfSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCB0eXBlIE51bGxhYmxlPFQ+ID0gVCB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIE11c2ljUmVzdWx0ID0ge1xuICAgIGNob3JkOiBDaG9yZCxcbiAgICB0ZW5zaW9uOiBudW1iZXIsXG4gICAgc2NhbGU6IFNjYWxlLFxufVxuXG5leHBvcnQgdHlwZSBSaWNoTm90ZSA9IHtcbiAgICBub3RlOiBOb3RlLFxuICAgIG9yaWdpbmFsTm90ZT86IE5vdGUsXG4gICAgZHVyYXRpb246IG51bWJlcixcbiAgICBmcmVxPzogbnVtYmVyLFxuICAgIGNob3JkPzogQ2hvcmQsXG4gICAgcGFydEluZGV4OiBudW1iZXIsXG4gICAgc2NhbGU/OiBTY2FsZSxcbiAgICBiZWFtPzogc3RyaW5nLFxuICAgIHRpZT86IHN0cmluZyxcbiAgICB0ZW5zaW9uPzogVGVuc2lvbixcbiAgICBpbnZlcnNpb25OYW1lPzogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBEaXZpc2lvbmVkUmljaG5vdGVzID0ge1xuICAgIFtrZXk6IG51bWJlcl06IEFycmF5PFJpY2hOb3RlPixcbn1cblxuZXhwb3J0IGNvbnN0IGdsb2JhbFNlbWl0b25lID0gKG5vdGU6IE5vdGUpID0+IHtcbiAgICByZXR1cm4gbm90ZS5zZW1pdG9uZSArICgobm90ZS5vY3RhdmUpICogMTIpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0Q2xvc2VzdE9jdGF2ZSA9IChub3RlOiBOb3RlLCB0YXJnZXROb3RlOiBOdWxsYWJsZTxOb3RlPiA9IG51bGwsIHRhcmdldFNlbWl0b25lOiBOdWxsYWJsZTxudW1iZXI+ID0gbnVsbCkgPT4ge1xuICAgIGxldCBzZW1pdG9uZSA9IGdsb2JhbFNlbWl0b25lKG5vdGUpO1xuICAgIGlmICghdGFyZ2V0Tm90ZSAmJiAhdGFyZ2V0U2VtaXRvbmUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFyZ2V0IG5vdGUgb3Igc2VtaXRvbmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRhcmdldFNlbWl0b25lID0gdGFyZ2V0U2VtaXRvbmUgfHwgZ2xvYmFsU2VtaXRvbmUodGFyZ2V0Tm90ZSBhcyBOb3RlKTtcbiAgICBjb25zb2xlLmxvZyhcIkNsb3Nlc3Qgb2N0YXZlOiBcIiwgc2VtaXRvbmUsIHRhcmdldFNlbWl0b25lKTtcbiAgICAvLyBVc2luZyBtb2R1bG8gaGVyZSAtPiAtNyAlIDEyID0gLTdcbiAgICAvLyAtMTMgJSAxMiA9IC0xXG4gICAgaWYgKHNlbWl0b25lID09IHRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgIHJldHVybiBub3RlLm9jdGF2ZTtcbiAgICB9XG4gICAgY29uc3QgZGVsdGE6IG51bWJlciA9IHRhcmdldFNlbWl0b25lID4gc2VtaXRvbmUgPyAxMiA6IC0xMjtcbiAgICBsZXQgcmV0ID0gMDtcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3QgY2xlYW5PY3RhdmUgPSAob2N0YXZlOiBudW1iZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG9jdGF2ZSwgMiksIDYpO1xuICAgIH1cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpKys7XG4gICAgICAgIGlmIChpID4gMTAwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5maW5pdGUgbG9vcFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzZW1pdG9uZSArPSBkZWx0YTtcbiAgICAgICAgcmV0ICs9IGRlbHRhIC8gMTI7ICAvLyBIb3cgbWFueSBvY3RhdmVzIHdlIGNoYW5nZWRcbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lID49IHRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNlbWl0b25lIC0gdGFyZ2V0U2VtaXRvbmUpID4gTWF0aC5hYnMoc2VtaXRvbmUgLSAxMiAtIHRhcmdldFNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSB3ZW50IHRvbyBmYXIsIGdvIG9uZSBiYWNrXG4gICAgICAgICAgICAgICAgICAgIHJldCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3Nlc3Qgb2N0YXZlIHJlczogXCIsIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KSwgcmV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW5PY3RhdmUobm90ZS5vY3RhdmUgKyByZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbWl0b25lIDw9IHRhcmdldFNlbWl0b25lKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNlbWl0b25lIC0gdGFyZ2V0U2VtaXRvbmUpID4gTWF0aC5hYnMoc2VtaXRvbmUgKyAxMiAtIHRhcmdldFNlbWl0b25lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSB3ZW50IHRvbyBmYXIsIGdvIG9uZSBiYWNrXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3Nlc3Qgb2N0YXZlIHJlczogXCIsIGNsZWFuT2N0YXZlKG5vdGUub2N0YXZlICsgcmV0KSwgcmV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW5PY3RhdmUobm90ZS5vY3RhdmUgKyByZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgbWFqU2NhbGVDaXJjbGU6IHsgW2tleTogbnVtYmVyXTogQXJyYXk8bnVtYmVyPiB9ID0ge31cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkNdID0gW1NlbWl0b25lLkcsIFNlbWl0b25lLkZdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5HXSA9IFtTZW1pdG9uZS5ELCBTZW1pdG9uZS5DXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRF0gPSBbU2VtaXRvbmUuQSwgU2VtaXRvbmUuR11cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkFdID0gW1NlbWl0b25lLkUsIFNlbWl0b25lLkRdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5FXSA9IFtTZW1pdG9uZS5CLCBTZW1pdG9uZS5BXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQl0gPSBbU2VtaXRvbmUuRnMsIFNlbWl0b25lLkVdXG5cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkZdID0gW1NlbWl0b25lLkMsIFNlbWl0b25lLkJiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuQmJdID0gW1NlbWl0b25lLkYsIFNlbWl0b25lLkViXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuRWJdID0gW1NlbWl0b25lLkJiLCBTZW1pdG9uZS5BYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkFiXSA9IFtTZW1pdG9uZS5FYiwgU2VtaXRvbmUuRGJdXG5tYWpTY2FsZUNpcmNsZVtTZW1pdG9uZS5EYl0gPSBbU2VtaXRvbmUuQWIsIFNlbWl0b25lLkdiXVxubWFqU2NhbGVDaXJjbGVbU2VtaXRvbmUuR2JdID0gW1NlbWl0b25lLkRiLCBTZW1pdG9uZS5DYl1cbm1halNjYWxlQ2lyY2xlW1NlbWl0b25lLkNiXSA9IFtTZW1pdG9uZS5HYiwgU2VtaXRvbmUuRmJdXG5cblxuZXhwb3J0IGNvbnN0IG1halNjYWxlRGlmZmVyZW5jZSA9IChzZW1pdG9uZTE6IG51bWJlciwgc2VtaXRvbmUyOiBudW1iZXIpID0+IHtcbiAgICAvLyBHaXZlbiB0d28gbWFqb3Igc2NhbGVzLCByZXR1cm4gaG93IGNsb3NlbHkgcmVsYXRlZCB0aGV5IGFyZVxuICAgIC8vIDAgPSBzYW1lIHNjYWxlXG4gICAgLy8gMSA9IEUuRy4gQyBhbmQgRiBvciBDIGFuZCBHXG4gICAgbGV0IGN1cnJlbnRWYWwgPSBtYWpTY2FsZUNpcmNsZVtzZW1pdG9uZTFdO1xuICAgIGlmIChzZW1pdG9uZTEgPT0gc2VtaXRvbmUyKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRWYWwuaW5jbHVkZXMoc2VtaXRvbmUyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0N1cnJlbnRWYWwgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3Qgc2VtaXRvbmUgb2YgY3VycmVudFZhbCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBuZXdTZW1pdG9uZSBvZiBtYWpTY2FsZUNpcmNsZVtzZW1pdG9uZV0pIHtcbiAgICAgICAgICAgICAgICBuZXdDdXJyZW50VmFsLmFkZChuZXdTZW1pdG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFZhbCA9IFsuLi5uZXdDdXJyZW50VmFsXSBhcyBBcnJheTxudW1iZXI+O1xuICAgIH1cbiAgICByZXR1cm4gMTI7XG59XG5cbmV4cG9ydCBjb25zdCBnZXRSaWNoTm90ZSA9IChkaXZpc2lvbmVkTm90ZXM6IERpdmlzaW9uZWRSaWNobm90ZXMsIGRpdmlzaW9uOiBudW1iZXIsIHBhcnRJbmRleDogbnVtYmVyKTogUmljaE5vdGUgfCBudWxsID0+IHtcbiAgICBpZiAoZGl2aXNpb24gaW4gZGl2aXNpb25lZE5vdGVzKSB7XG4gICAgICAgIGZvciAoY29uc3Qgbm90ZSBvZiBkaXZpc2lvbmVkTm90ZXNbZGl2aXNpb25dKSB7XG4gICAgICAgICAgICBpZiAobm90ZS5wYXJ0SW5kZXggPT0gcGFydEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJoeXRobU5lZWRlZER1cmF0aW9ucyhtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpIHtcbiAgICBjb25zdCBtZWxvZHlSaHl0aG1TdHJpbmcgPSBtYWluUGFyYW1zLm1lbG9keVJoeXRobTtcbiAgICAvLyBGaWd1cmUgb3V0IHdoYXQgbmVlZHMgdG8gaGFwcGVuIGVhY2ggYmVhdCB0byBnZXQgb3VyIG1lbG9keVxuICAgIGxldCByaHl0aG1EaXZpc2lvbiA9IDA7XG4gICAgY29uc3Qgcmh5dGhtTmVlZGVkRHVyYXRpb25zOiB7IFtrZXk6IG51bWJlcl06IG51bWJlcjsgfSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVsb2R5Umh5dGhtU3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJoeXRobSA9IG1lbG9keVJoeXRobVN0cmluZ1tpXTtcbiAgICAgICAgaWYgKHJoeXRobSA9PSBcIldcIikge1xuICAgICAgICAgICAgcmh5dGhtTmVlZGVkRHVyYXRpb25zW3JoeXRobURpdmlzaW9uXSA9IEJFQVRfTEVOR1RIICogNDtcbiAgICAgICAgICAgIHJoeXRobURpdmlzaW9uICs9IEJFQVRfTEVOR1RIICogNDtcbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfSBlbHNlIGlmIChyaHl0aG0gPT0gXCJIXCIpIHtcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAqIDI7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAqIDI7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiUVwiKSB7XG4gICAgICAgICAgICByaHl0aG1OZWVkZWREdXJhdGlvbnNbcmh5dGhtRGl2aXNpb25dID0gQkVBVF9MRU5HVEg7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSDtcbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiRVwiKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGRpdmlzaW9uIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBFaWdodGhcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAvIDI7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAvIDI7XG4gICAgICAgIH0gZWxzZSBpZiAocmh5dGhtID09IFwiU1wiKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGRpdmlzaW9uIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBTaXh0ZWVudGhcbiAgICAgICAgICAgIHJoeXRobU5lZWRlZER1cmF0aW9uc1tyaHl0aG1EaXZpc2lvbl0gPSBCRUFUX0xFTkdUSCAvIDQ7XG4gICAgICAgICAgICByaHl0aG1EaXZpc2lvbiArPSBCRUFUX0xFTkdUSCAvIDQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJoeXRobU5lZWRlZER1cmF0aW9ucztcbn1cblxuXG5leHBvcnQgdHlwZSBNZWxvZHlOZWVkZWRUb25lID0ge1xuICAgIFtrZXk6IG51bWJlcl06IHtcbiAgICAgICAgdG9uZTogbnVtYmVyLFxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyLFxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZWxvZHlOZWVkZWRUb25lcyhtYWluUGFyYW1zOiBNYWluTXVzaWNQYXJhbXMpOiBNZWxvZHlOZWVkZWRUb25lIHtcbiAgICBjb25zdCByaHl0aG1OZWVkZWREdXJhdGlvbnMgPSBnZXRSaHl0aG1OZWVkZWREdXJhdGlvbnMobWFpblBhcmFtcyk7XG4gICAgY29uc3QgZm9yY2VkTWVsb2R5QXJyYXkgPSBtYWluUGFyYW1zLmZvcmNlZE1lbG9keSB8fCBcIlwiO1xuICAgIGNvbnN0IHJldDogTWVsb2R5TmVlZGVkVG9uZSA9IHt9O1xuICAgIC8vIEZpZ3VyZSBvdXQgd2hhdCBuZWVkcyB0byBoYXBwZW4gZWFjaCBiZWF0IHRvIGdldCBvdXIgbWVsb2R5XG4gICAgbGV0IGNvdW50ZXIgPSAtMTtcbiAgICBmb3IgKGNvbnN0IGRpdmlzaW9uIGluIHJoeXRobU5lZWRlZER1cmF0aW9ucykge1xuICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIGNvbnN0IGRpdmlzaW9uTnVtID0gcGFyc2VJbnQoZGl2aXNpb24pO1xuICAgICAgICByZXRbZGl2aXNpb25OdW1dID0ge1xuICAgICAgICAgICAgXCJkdXJhdGlvblwiOiByaHl0aG1OZWVkZWREdXJhdGlvbnNbZGl2aXNpb25OdW1dLFxuICAgICAgICAgICAgXCJ0b25lXCI6IGZvcmNlZE1lbG9keUFycmF5W2NvdW50ZXJdLFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBtYWtlTXVzaWMsIGJ1aWxkVGFibGVzLCBtYWtlTWVsb2R5IH0gZnJvbSBcIi4vc3JjL2Nob3Jkc1wiXG5pbXBvcnQgeyBNYWluTXVzaWNQYXJhbXMgfSBmcm9tIFwiLi9zcmMvcGFyYW1zXCI7XG5pbXBvcnQgeyBCRUFUX0xFTkdUSCwgRGl2aXNpb25lZFJpY2hub3RlcyB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5idWlsZFRhYmxlcygpXG5cbnNlbGYub25tZXNzYWdlID0gKGV2ZW50OiB7IGRhdGE6IHsgcGFyYW1zOiBzdHJpbmcsIG5ld01lbG9keTogdW5kZWZpbmVkIHwgYm9vbGVhbiwgZ2l2ZVVwOiB1bmRlZmluZWQgfCBib29sZWFuIH0gfSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiR290IG1lc3NhZ2VcIiwgZXZlbnQuZGF0YSk7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IE1haW5NdXNpY1BhcmFtcyhKU09OLnBhcnNlKGV2ZW50LmRhdGEucGFyYW1zIHx8IFwie31cIikpO1xuXG4gICAgaWYgKGV2ZW50LmRhdGEubmV3TWVsb2R5KSB7XG4gICAgICAgIG1ha2VNZWxvZHkoKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMsIHBhcmFtcyk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe2RpdmlzaW9uZWRSaWNoTm90ZXM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoKHNlbGYgYXMgYW55KS5kaXZpc2lvbmVkTm90ZXMpKX0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmRhdGEuZ2l2ZVVwKSB7XG4gICAgICAgIChzZWxmIGFzIGFueSkuZ2l2ZVVQID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGFueT47XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IChjdXJyZW50QmVhdDogbnVtYmVyLCBkaXZpc2lvbmVkUmljaE5vdGVzOiBEaXZpc2lvbmVkUmljaG5vdGVzKSA9PiB7XG4gICAgICAgIGlmICgoc2VsZiBhcyBhbnkpLmdpdmVVUCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZ2l2ZVVQXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkaXZpc2lvbmVkUmljaE5vdGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmljaE5vdGVzID0gZGl2aXNpb25lZFJpY2hOb3Rlc1tjdXJyZW50QmVhdCAqIEJFQVRfTEVOR1RIXTtcbiAgICAgICAgaWYgKGN1cnJlbnRCZWF0ICE9IG51bGwgJiYgcmljaE5vdGVzICYmIHJpY2hOb3Rlc1swXSAmJiByaWNoTm90ZXNbMF0uY2hvcmQpIHtcbiAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCZWF0LFxuICAgICAgICAgICAgICAgICAgICBjaG9yZDogcmljaE5vdGVzWzBdLmNob3JkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRpdmlzaW9uZWRSaWNoTm90ZXMpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWFrZU11c2ljKHBhcmFtcywgcHJvZ3Jlc3NDYWxsYmFjaykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpdmlzaW9uZWROb3RlczogRGl2aXNpb25lZFJpY2hub3RlcyA9IHJlc3VsdC5kaXZpc2lvbmVkTm90ZXM7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkaXZpc2lvbmVkTm90ZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIChzZWxmIGFzIGFueSkuZGl2aXNpb25lZE5vdGVzID0gZGl2aXNpb25lZE5vdGVzO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtkaXZpc2lvbmVkUmljaE5vdGVzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRpdmlzaW9uZWROb3RlcykpfSk7XG5cblxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtlcnJvcjogZXJyfSk7XG4gICAgfSk7XG5cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=