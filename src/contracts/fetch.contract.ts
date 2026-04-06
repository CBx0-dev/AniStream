import {ServiceKey} from "vue-mvvm";

import type {SeriesFetchModel, SeriesModel} from "@models/series.model";
import type {GenreFetchModel} from "@models/genre.model";
import type {SeasonFetchModel} from "@models/season.model";
import type {EpisodeFetchModel} from "@models/episode.model";

import type {Provider} from "@services/fetch.service";

export interface FetchService {
    getCatalog(): Promise<string[]>;

    getSeries(guid: string): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]>;

    getSeasons(series: SeriesModel): Promise<SeasonFetchModel[]>;

    getEpisodes(guid: string, seasonNumber: number): Promise<EpisodeFetchModel>;

    getProviders(guid: string, seasonNumber: number, episodeNumber: number): Promise<Provider[]>;
}

export const FetchService: ServiceKey<FetchService> = new ServiceKey<FetchService>("fetch.service");