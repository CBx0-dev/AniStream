import {ServiceKey} from "vue-mvvm";

import type {SeriesFetchModel, SeriesModel} from "@models/series.model";
import type {GenreFetchModel} from "@models/genre.model";
import type {SeasonFetchModel} from "@models/season.model";
import type {EpisodeFetchModel} from "@models/episode.model";

import {DefaultProvider, EpisodeLanguage} from "@providers/default";

export interface Provider {
    name: string;
    language: EpisodeLanguage;
    embeddedURL: string;
}

export interface FetchService {
    getCatalog(provider?: DefaultProvider | null): Promise<string[]>;

    getSeries(guid: string, provider?: DefaultProvider | null): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]>;

    getSeasons(series: SeriesModel, provider?: DefaultProvider | null): Promise<SeasonFetchModel[]>;

    getEpisodes(guid: string, seasonNumber: number, provider?: DefaultProvider | null): Promise<EpisodeFetchModel[]>;

    getProviders(guid: string, seasonNumber: number, episodeNumber: number, provider?: DefaultProvider | null): Promise<Provider[]>;
}

export const FetchService: ServiceKey<FetchService> = new ServiceKey<FetchService>("fetch.service");