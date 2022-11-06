import { Note, Scale, ScaleTemplates } from "musictheoryjs"
import { Logger } from "./mylogger";
import { BEAT_LENGTH, DivisionedRichnotes, MusicParams } from "./utils"


type LightScale = {
    key: number,
    templateSlug: string,
    semitones: number[],
};


const scalesForNotes = (notes: Note[], params: MusicParams): Scale[] => {
    const scales = new Set<LightScale>()
    // First add all scales
    for (const template of params.scaleSettings) {
        if (template.enabled) {
            for (let semitone=0; semitone < 12; semitone++) {
                const scale = new Scale({key: semitone, template: ScaleTemplates[template.scaleSlug]})
                scales.add({
                    key: semitone,
                    templateSlug: template.scaleSlug,
                    semitones: scale.notes.map(note => note.semitone),
                } as LightScale)
            }
        }
    }
    for (let note of notes) {
        const semitone = note.semitone
        for (const scale of scales) {
            if (!scale.semitones.contains(semitone)) {
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

    // Go back a few chords and find the scales that are available.
    for (let i = 1; i < 4; i++) {
        const division = latestDivision - (i * BEAT_LENGTH)
        if (!divisionedRichNotes[division]) {
            continue;
        }
        const notes = divisionedRichNotes[division].map(richNote => richNote.note)
        const availableScales = scalesForNotes(notes, params)
        for (const potentialScale of ret) {
            const index = availableScales.findIndex(item => item.equals(potentialScale.scale))
            if (index == -1) {
                // Scale wasn't available, increase tension
                potentialScale.tension += 6 / i  // Base of how long ago it was
                logger.log("Scale ", potentialScale.scale.toString()," wasn't available at division ", division, ", increase tension");
            }
        }
    }
    logger.print("Available scales", ret)

    return ret;
}