import { Note, Scale, ScaleTemplates } from "musictheoryjs"
import { Logger } from "./mylogger";
import { MusicParams } from "./params";
import { BEAT_LENGTH, DivisionedRichnotes } from "./utils"


type LightScale = {
    key: number,
    templateSlug: string,
    semitones: number[],
};


const scalesForNotes = (notes: Note[], params: MusicParams): Scale[] => {
    const scales = new Set<LightScale>()
    // First add all scales
    for (const scaleSlug in params.scaleSettings) {
        const template = params.scaleSettings[scaleSlug];
        if (template.enabled) {
            for (let semitone=0; semitone < 12; semitone++) {
                const scale = new Scale({key: semitone, template: ScaleTemplates[scaleSlug]})
                const semitones = scale.notes.map(note => note.semitone);
                // const leadingTone = (scale.key - 1 + 24) % 12;
                // if (!semitones.includes(leadingTone)) {
                //     semitones.push(leadingTone);
                // }
                scales.add({
                    key: semitone,
                    templateSlug: scaleSlug,
                    semitones: semitones,
                } as LightScale)
            }
        }
    }
    for (let note of notes) {
        const semitone = note.semitone
        for (const scale of scales) {
            if (!scale.semitones.includes(semitone)) {
                scales.delete(scale)
            }
        }
    }

    const ret = [];
    for (const scale of scales) {
        ret.push(new Scale({key: scale.key, template: ScaleTemplates[scale.templateSlug]}))
    }
    return ret;
}


export const getAvailableScales = (values: {
    latestDivision: number,
    divisionedRichNotes: DivisionedRichnotes,
    params: MusicParams,
    randomNotes: Array<Note>,
    logger: Logger,
}): Array<{
    scale: Scale,
    tension: number,
}> => {
    const {latestDivision, divisionedRichNotes, params, randomNotes, logger} = values;
    // Given a new chord, find available scales base on the previous notes
    const currentAvailableScales = scalesForNotes(randomNotes, params)

    const ret = [];
    for (const scale of currentAvailableScales) {
        ret.push({
            scale,
            tension: 0,
        })
    }

    logger.log("currentAvailableScales", currentAvailableScales)

    return ret.filter(item => item.tension < 10);
}