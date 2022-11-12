import { buildTables } from "./src/chords"
import { loadPlayer } from "./src/player"
import { MainMusicParams, MusicParams } from "./src/utils";


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

let worker: Worker;
let playerLoadTime = new Date();
let playerLoading = false;
setTimeout(() => {
    // WAit for params to be parsed
    worker = new Worker('dist/worker.js');
    worker.postMessage({params: JSON.stringify(params)});
    (window as any).giveUp = () => {
        worker.postMessage({giveUp: true});
    }
    worker.onmessage = ({ data }) => {
        if (browser && data.xml) {
            // console.log((window as any).result);
            (window as any).loadPlayer = loadPlayer;
            let autoplay = !data.progress;
            if (autoplay || (!playerLoading && playerLoadTime.getTime() - (new Date()).getTime() < -1000)) {
                loadPlayer(data.xml, autoplay).then(() => {
                    playerLoading = false;
                })
                playerLoadTime = new Date();
                playerLoading = true;
            }
        }
        if (browser && data.progress) {
            const {currentBeat, chord} = data.progress;
            const el = document.querySelectorAll(`.beatresult`)[currentBeat];
            if (el && chord) {
                el.innerHTML = chord;
            }
        }
    };
}, 10);


(window as any).getNewMelody = (params: MainMusicParams) => {
    worker.postMessage({params: JSON.stringify(params), newMelody: true});
}