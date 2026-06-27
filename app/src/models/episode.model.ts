import {SyncStatus} from "@contracts/season.contract";
import {EpisodeLanguage} from "@providers/default";

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
}

export interface EpisodeModel extends EpisodeDbModel {
    clone(): EpisodeModel;
}

/**
 * Used for API only
 */
export interface EpisodeCreateModel {
    season_id: number;
    episode_number: number;
    german_title: string;
    english_title: string;
    description: string;
}

/**
 * Used for API only
 */
export interface EpisodeUpdateModel {
    german_title: string;
    english_title: string;
    description: string;
}

/**
 * Used for API only
 */
export interface EpisodeProviderModel {
    status: SyncStatus;
    providers: Array<{
        name: string;
        url: string;
        language_code: EpisodeLanguage;
    }>;
}

export function EpisodeModel(
    episode_id: number,
    season_id: number,
    episode_number: number,
    german_title: string,
    english_title: string,
    description: string
): EpisodeModel;
export function EpisodeModel(
    season_id: number,
    episode_number: number,
    german_title: string,
    english_title: string,
    description: string
): EpisodeModel;

export function EpisodeModel(...args: unknown[]): EpisodeModel {
    if (args.length == 5) {
        args.unshift(0);
    }

    return _EpisodeModel(...args as [number, number, number, string, string, string]);
}

function _EpisodeModel(
    episode_id: number,
    season_id: number,
    episode_number: number,
    german_title: string,
    english_title: string,
    description: string
): EpisodeModel {
    const obj: EpisodeModel = {
        episode_id: episode_id,
        season_id: season_id,
        episode_number: episode_number,
        german_title: german_title,
        english_title: english_title,
        description: description,
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
        clone: clone
    }

    obj.clone = obj.clone.bind(obj);
    return obj;
}