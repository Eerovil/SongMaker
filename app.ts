import { makeMusic, buildTables, DivisionedRichnotes, MusicParams, MusicResult, testFunc } from "./src/chords"
import { loadPlayer } from "./src/player"
import { toXml } from "./src/musicxmlgen"


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
console.groupCollapsed("makeMusic")
let params = {} as MusicParams;
if (browser) {
    params = (window as any).params as MusicParams;
    params.chords = (params.chords as unknown as string).split(",");
}
let promise: Promise;
if (params.testMode) {
    promise = testFunc(params)
} else {
    promise = makeMusic(params)
}
promise.then((result) => {
    console.groupEnd();

    const divisionedNotes: DivisionedRichnotes = result.divisionedNotes;
    console.groupCollapsed("xml");
    const scoreXML = toXml(divisionedNotes, params);
    console.groupEnd();
    
    if (browser) {
        // console.log((window as any).result);
        (window as any).loadPlayer = loadPlayer;
        setTimeout(() => {
            loadPlayer(scoreXML);
        }, 2000)
    }
    
})
