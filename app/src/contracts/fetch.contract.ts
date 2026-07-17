import {ServiceKey} from "vue-mvvm";

import type {SeriesFetchModel, SeriesModel} from "@models/series.model";
import type {GenreFetchModel} from "@models/genre.model";
import type {SeasonFetchModel, SeasonModel} from "@models/season.model";
import type {EpisodeFetchModel, EpisodeModel} from "@models/episode.model";

import {DefaultProvider, EpisodeLanguage} from "@providers/default";
import {SyncStatus} from "@contracts/season.contract";

export interface Provider {
    name: string;
    language: EpisodeLanguage;
    embeddedURL: string;
}

/**
 * Only used in the API
 */
export interface ProviderSync {
    
}

export interface FetchService {
    getCatalog(provider?: DefaultProvider | null): Promise<string[]>;

    getSeries(guid: string, provider?: DefaultProvider | null): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[], previewImage: Uint8Array | null]>;

    getSeasons(series: SeriesModel, provider?: DefaultProvider | null): Promise<SeasonFetchModel[]>;

    getEpisodes(guid: string, seasonNumber: number, provider?: DefaultProvider | null): Promise<EpisodeFetchModel[]>;

    getProviders(series: SeriesModel, season: SeasonModel, episode: EpisodeModel, provider?: DefaultProvider | null): Promise<[SyncStatus, Provider[]]>;
    
    startRemoteSyncing(seriesId: number, provider?: DefaultProvider | null): Promise<void>;
}

export const FetchService: ServiceKey<FetchService> = new ServiceKey<FetchService>("fetch.service");