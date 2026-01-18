export interface EpisodeFetchModel {
    episode_number: number;
    german_title: string;
    english_title: string;
    description: string;
}

export interface EpisodeDbModel {
    episode_id: number;
    season_id: number;
    episode_number: number;
    german_title: string;
    english_title: string;
    description: string;
    percentage_watched: number;
    stopped_time: number;
}

export interface EpisodeModel extends EpisodeDbModel {
    clone(): EpisodeModel;
}

export function EpisodeModel(
    episode_id: number,
    season_id: number,
    episode_number: number,
    german_title: string,
    english_title: string,
    description: string,
    percentage_watched: number,
    stopped_time: number
): EpisodeModel;
export function EpisodeModel(
    season_id: number,
    episode_number: number,
    german_title: string,
    english_title: string,
    description: string,
    percentage_watched: number,
    stopped_time: number
): EpisodeModel;

export function EpisodeModel(...args: unknown[]): EpisodeModel {
    if (args.length == 7) {
        args.unshift(0);
    }

    return _EpisodeModel(...args as [number, number, number, string, string, string, number, number]);
}

function _EpisodeModel(
    episode_id: number,
    season_id: number,
    episode_number: number,
    german_title: string,
    english_title: string,
    description: string,
    percentage_watched: number,
    stopped_time: number
): EpisodeModel {
    const obj: EpisodeModel = {
        episode_id: episode_id,
        season_id: season_id,
        episode_number: episode_number,
        german_title: german_title,
        english_title: english_title,
        description: description,
        percentage_watched: percentage_watched,
        stopped_time: stopped_time,
        clone: clone
    }

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: EpisodeModel): EpisodeModel {
    const obj: EpisodeModel = {
        episode_id: this.episode_id,
        season_id: this.season_id,
        episode_number: this.episode_number,
        german_title: this.german_title,
        english_title: this.english_title,
        description: this.description,
        percentage_watched: this.percentage_watched,
        stopped_time: this.stopped_time,
        clone: clone
    }

    obj.clone = obj.clone.bind(obj);
    return obj;
}