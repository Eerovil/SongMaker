import PlaybackEngine from "osmd-audio-player";
import { buildTables } from "./src/chords"
import { toXml } from "./src/musicxmlgen";
import { loadPlayer, renderMusic } from "./src/player"
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
        console.log("Giving up!")
        worker.postMessage({giveUp: true});
    }
    worker.onmessage = ({ data }) => {
        if (browser && data.divisionedRichNotes) {
            // console.log((window as any).result);
            const divisionedRichNotes = data.divisionedRichNotes;
            (window as any).loadPlayer = loadPlayer;
            let autoplay = !data.progress;
            if (autoplay) {
                const loadingEl = document.getElementById("loading");
                if (loadingEl) {
                    loadingEl.innerHTML = "Ladataan ääntä...";
                }
                const musicXML = toXml(divisionedRichNotes, params, true);
                loadPlayer(musicXML, true).then((audioPlayer) => {
                    if (loadingEl) {
                        loadingEl.innerHTML = "";
                    }
                    audioPlayer.scoreInstruments[0].Voices[0].volume = parseInt(params.cadences[0].parts[0].volume as unknown as string);
                    audioPlayer.scoreInstruments[1].Voices[0].volume = parseInt(params.cadences[0].parts[1].volume as unknown as string);
                    audioPlayer.scoreInstruments[2].Voices[0].volume = parseInt(params.cadences[0].parts[2].volume as unknown as string);
                    audioPlayer.scoreInstruments[3].Voices[0].volume = parseInt(params.cadences[0].parts[3].volume as unknown as string);
                })
            }
            if (autoplay || (!playerLoading && playerLoadTime.getTime() - (new Date()).getTime() < -1000)) {
                const sheetXML = toXml(divisionedRichNotes, params, false);
                renderMusic(sheetXML).then(() => {
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
}, 100);


(window as any).getNewMelody = (params: MainMusicParams) => {
    worker.postMessage({params: JSON.stringify(params), newMelody: true});
}