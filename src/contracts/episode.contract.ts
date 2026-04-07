import {ServiceKey} from "vue-mvvm";

import type {EpisodeModel} from "@models/episode.model";

export interface EpisodeService {
    getEpisode(episodeId: number): Promise<EpisodeModel | null>;

    getEpisodes(seasonId: number): Promise<EpisodeModel[]>;

    insertEpisode(
        seasonId: number,
        episodeNumber: number,
        germanTitle: string,
        englishTitle: string,
        description: string
    ): Promise<EpisodeModel>;

    updateEpisodeMetadata(
        episodeId: number,
        germanTitle: string,
        englishTitle: string,
        description: string
    ): Promise<void>;
}

export const EpisodeService: ServiceKey<EpisodeService> = new ServiceKey<EpisodeService>("episode.service");