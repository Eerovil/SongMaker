import { makeMusic, buildTables, DivisionedRichnotes  } from "./src/chords"
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
makeMusic().then((result) => {
    console.groupEnd();

    (window as any).chords = result.chords;
    (window as any).melody = result.melody;
    const divisionedNotes: DivisionedRichnotes = result.divisionedNotes;
    console.groupCollapsed("xml");
    (window as any).scoreXML = toXml(divisionedNotes);
    console.groupEnd();
    
    if (browser) {
        // console.log((window as any).result);
        (window as any).loadPlayer = loadPlayer;
    }
    
})