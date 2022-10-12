import { chords, buildTables } from "./src/chords.js"

Array.prototype.orderBy = function (selector, desc = false) {
    return [...this].sort((a, b) => {
        a = selector(a);
        b = selector(b);

        if (a == b) return 0;
        return (desc ? a > b : a < b) ? -1 : 1;
    });
}

buildTables()

const getResults = () => {
    const results = chords()
    if (!results) {
        setTimeout(getResults, 1000)
    }
}
getResults();

if (window) {
    console.log(window.result)
}