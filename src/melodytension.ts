import { Note } from "musictheoryjs";
import { globalSemitone, MusicParams } from "./utils";

export const melodyTension = (newNote: Note, prevNotes: Note[], params: MusicParams): number => {

    const p1Note = params.parts[0].note || "F4";
    const startingGlobalSemitone = globalSemitone(new Note(p1Note))
    const semitoneLimit = [startingGlobalSemitone + -12, startingGlobalSemitone + 12]
    const directionTensions: {[key: string]: number} = {
        "up": 0,
        "down": 0,
        "same": 0,
    }

    if (params.melodySettings) {
        if (params.melodySettings.up) {
            directionTensions.up -= params.melodySettings.up;
        }
        if (params.melodySettings.down) {
            directionTensions.down -= params.melodySettings.down;
        }
        if (params.melodySettings.same) {
            directionTensions.same -= params.melodySettings.same;
        }
    }

    const newGlobalSemitone = globalSemitone(newNote);
    let newDirection = "same";
    if (prevNotes.length > 0) {
        const prevNote = prevNotes[prevNotes.length - 1];
        const prevGlobalSemitone = globalSemitone(prevNote);
        if (newGlobalSemitone > prevGlobalSemitone + 2) {  // 2 semitones difference is considered same
            newDirection = "up";
        } else if (newGlobalSemitone < prevGlobalSemitone - 2) {
            newDirection = "down";
        }
    }

    //List the 8 last direction
    const directions = []
    const directionCounts: {[key: string]: number} = {};
    for (let i=prevNotes.length - 1; i>prevNotes.length - 9; i--) {
        if (!prevNotes[i-1] || !prevNotes[i]) {
            continue;
        }
        const note = prevNotes[i];
        const prevNote = prevNotes[i-1];
        const direction = globalSemitone(note) - globalSemitone(prevNote);
        if (direction > 0) {
            directions.push("up");
            directionCounts["up"] = (directionCounts["up"] || 0) + 1;
        } else if (direction < 0) {
            directions.push("down");
            directionCounts["down"] = (directionCounts["down"] || 0) + 1;
        } else {
            directions.push("same");
            directionCounts["same"] = (directionCounts["same"] || 0) + 1;
        }
    }
    if (directionCounts["up"] > 4) {
        directionTensions["up"] += 1;
    } else if (directionCounts["down"] > 4) {
        directionTensions["down"] += 1;
    } else if (directionCounts["same"] > 2) {
        directionTensions["same"] += 1;
        if (directionCounts["same"] > 3) {
            directionTensions["same"] += 1;
            if (directionCounts["same"] > 4) {
                directionTensions["same"] += 1;
            }
        }
    }

    // Keep going in the same direction
    if (directions.length > 0) {
        const prevDirection = directions[directions.length - 1]
        if (prevDirection != "same") {
            directionTensions[prevDirection] -= 1;
            const prevPrevDirection = directions[directions.length - 2];
            if (prevPrevDirection == prevDirection) {
                directionTensions[prevDirection] -= 1;
            }
        }
    }

    if (newGlobalSemitone < semitoneLimit[0] + 3) {
        directionTensions["down"] += 1;
        if (newGlobalSemitone < semitoneLimit[0]) {
            directionTensions["down"] += 1;
        }
    }
    if (newGlobalSemitone > semitoneLimit[1] - 3) {
        directionTensions["up"] += 1;
        if (newGlobalSemitone > semitoneLimit[1]) {
            directionTensions["up"] += 1;
        }
    }

    const ret = Math.max(-0.5, directionTensions[newDirection] * 2);

    console.groupCollapsed("melody tension: ", ret);
    console.log(directionTensions)
    console.log(directions, directionCounts)
    console.groupEnd();
    return ret;
}
