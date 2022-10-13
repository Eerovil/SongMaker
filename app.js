import { chords, buildTables, testFunc } from "./src/chords.js"

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

const getResults = () => {
    const results = chords()
    if (!results) {
        setTimeout(getResults, 1000)
    } else if (browser) {
        window.result = results.result;
        window.chords = results.chords;
        window.melody = results.melody;
    }
}
getResults();

if (browser) {
    console.log(window.result)
}
