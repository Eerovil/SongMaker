import { makeMusic, buildTables } from "./src/chords.ts"
import { loadPlayer } from "./src/player.ts"
import { toXml } from "./src/musicxmlgen.ts"

Array.prototype.orderBy = function (selector, desc = false) {
    return [...this].sort((a, b) => {
        a = selector(a);
        b = selector(b);

        if (a == b) return 0;
        return (desc ? a > b : a < b) ? -1 : 1;
    });
}

buildTables()
let browser = false;
try {
    if (window) {
        browser = true;
    }
} catch (err) {
    browser = false;
}
// testFunc();

makeMusic().then((result) => {

    window.chords = result.chords;
    window.melody = result.melody;
    window.scoreXML = toXml(result.chords, result.melody)
    
    if (browser) {
        console.log(window.result)
        window.loadPlayer = loadPlayer;
    }
    
})