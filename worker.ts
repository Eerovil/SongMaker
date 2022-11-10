import { makeMusic, buildTables, makeMelody } from "./src/chords"
import { loadPlayer } from "./src/player"
import { toXml } from "./src/musicxmlgen"
import { BEAT_LENGTH, DivisionedRichnotes, MainMusicParams, MusicParams } from "./src/utils";

buildTables()

self.onmessage = (event: { data: { params: string, newMelody: undefined | boolean, giveUp: undefined | boolean } }) => {
    const params = new MainMusicParams(JSON.parse(event.data.params || "{}"));

    if (event.data.newMelody) {
        makeMelody((self as any).divisionedNotes, params);
        console.groupCollapsed("xml");
        const scoreXML = toXml((self as any).divisionedNotes, params);
        console.groupEnd();
        
        self.postMessage({xml: scoreXML});
        return;
    }

    if (event.data.giveUp) {
        (self as any).giveUP = true;
        return;
    }

    let promise: Promise<any>;
    const progressCallback = (currentBeat: number, divisionedRichNotes: DivisionedRichnotes) => {
        if ((self as any).giveUP) {
            return "giveUP";
        }
        if (!divisionedRichNotes) {
            return;
        }
        const richNotes = divisionedRichNotes[currentBeat * BEAT_LENGTH];
        const scoreXML = toXml(divisionedRichNotes, params);
        if (currentBeat != null && richNotes && richNotes[0] && richNotes[0].chord) {
            self.postMessage({
                progress: {
                    currentBeat,
                    chord: richNotes[0].chord.toString(),
                },
                xml: scoreXML,
            });
        }
    }
    makeMusic(params, progressCallback).then((result) => {
        const divisionedNotes: DivisionedRichnotes = result.divisionedNotes;
        if (Object.keys(divisionedNotes).length === 0) {
            return;
        }
        (self as any).divisionedNotes = divisionedNotes;
        console.groupCollapsed("xml");
        const scoreXML = toXml(divisionedNotes, params);
        console.groupEnd();
        
        self.postMessage({xml: scoreXML});


    }).catch((err) => {
        console.error(err);
        self.postMessage({error: err});
    });

}