import { makeMusic, buildTables, testFunc, ScaleTemplates } from "./src/chords"
import { loadPlayer } from "./src/player"
import { toXml } from "./src/musicxmlgen"
import { DivisionedRichnotes, MusicParams } from "./src/utils";


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
let params = new MusicParams();
if (browser) {
    params = new MusicParams((window as any).params);
    (window as any).scaleTemplateChoices = Object.keys(ScaleTemplates);
    (window as any).params = params;
}
let promise: Promise<any>;
if (params.testMode) {
    promise = testFunc(params)
} else {
    const progressCallback = (currentBeat: any, richNotes: any) => {
        if (currentBeat != null) {
            const el = document.querySelector(".beatsetting:nth-child(" + (currentBeat + 1) + ")");
            if (el && richNotes[0] && richNotes[0].chord) {
                el.innerHTML += " " + richNotes[0].chord.toString();
            }
        } 
        if ((window as any).giveUP) {
            return "giveUP";
        }
    }
    promise = makeMusic(params, progressCallback);
}
promise.then((result) => {
    console.groupEnd();

    const divisionedNotes: DivisionedRichnotes = result.divisionedNotes;
    if (Object.keys(divisionedNotes).length === 0) {
        if (browser) {
            window.alert("Epäonnistui");
        }
        return;
    }
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
