import {ServiceKey} from "vue-mvvm";

import type {WatchtimeModel} from "@models/watchtime.model";

export interface WatchtimeService {
    getWatchtimeOfEpisode(episodeId: number): Promise<WatchtimeModel | null>;

    getWatchtimesOfSeries(seriesId: number): Promise<WatchtimeModel[]>;

    getTotalWatchProgression(seriesId: number): Promise<number>;

    createWatchtimeOfEpisode(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<WatchtimeModel>;

    updateWatchtime(watchtimeId: number, percentageWatched: number, stoppedTime: number): Promise<void>;

    updateWatchtimeWithEpisode(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<void>;

    updateWatchtimesOfSeason(seasonId: number, percentageWatched: number, stoppedTime: number): Promise<void>;

    updateWatchtimesOfSeries(seriesId: number, percentageWatched: number, stoppedTime: number): Promise<void>;
}

export const WatchtimeService: ServiceKey<WatchtimeService> = new ServiceKey<WatchtimeService>("watchtime.service");