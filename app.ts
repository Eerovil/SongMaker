import { makeMusic, buildTables, makeMelody } from "./src/chords"
import { loadPlayer } from "./src/player"
import { toXml } from "./src/musicxmlgen"
import { DivisionedRichnotes, MainMusicParams, MusicParams } from "./src/utils";


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
let params = new MainMusicParams();
if (browser) {
    params = new MainMusicParams((window as any).params);
    (window as any).params = params;
    (window as any).MusicParams = MusicParams;
}
setTimeout(() => {

let promise: Promise<any>;
if (params.testMode) {
    // promise = testFunc(params)
} else {
    const progressCallback = (currentBeat: number, richNotes: any) => {
        if (currentBeat != null) {
            const el = document.querySelectorAll(`.beatresult`)[currentBeat];
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
(window as any).getNewMelody = (params: MainMusicParams) => {
    const divisionedNotes = (window as any).divisionedNotes;
    makeMelody(divisionedNotes, params);
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
    
}
promise.then((result) => {

    const divisionedNotes: DivisionedRichnotes = result.divisionedNotes;
    if (Object.keys(divisionedNotes).length === 0) {
        if (browser) {
            window.alert("Epäonnistui");
        }
        return;
    }
    (window as any).divisionedNotes = divisionedNotes;
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
    
}).catch((err) => {
    console.error(err);
    if (browser) {
        window.alert("Virhe!");
    }
});

}, 100)