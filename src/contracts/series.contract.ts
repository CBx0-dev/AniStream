import {ServiceKey} from "vue-mvvm";

import type {SeriesModel} from "@models/series.model";

export interface SeriesService {
    requiresSync(): Promise<boolean>;

    existByGUID(guid: string): Promise<SeriesModel[]>;

    insertSeries(guid: string, title: string, description: string, previewImage: string | null): Promise<SeriesModel>;

    getSeriesChunk(offset: number, limit: number): Promise<SeriesModel[]>;

    getFilteredSeriesChunk(offset: number, limit: number, searchText: string, genresIds: number[]): Promise<SeriesModel[]>;

    getSeries(seriesId: number): Promise<SeriesModel | null>;

    getStartedSeries(): Promise<SeriesModel[]>;

    getSeriesByIds(seriesIds: number[]): Promise<SeriesModel[]>;
}

export const SeriesService: ServiceKey<SeriesService> = new ServiceKey<SeriesService>("series.service");