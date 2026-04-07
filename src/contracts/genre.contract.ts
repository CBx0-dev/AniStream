import {ServiceKey} from "vue-mvvm";

import type {GenreModel} from "@models/genre.model";
import type {SeriesModel} from "@models/series.model";

export interface GenreService {
    getGenreByKey(key: string): Promise<GenreModel | null>;

    insertGenre(key: string): Promise<GenreModel>;

    insertGenreToSeries(genre: GenreModel, series: SeriesModel, main_genre: boolean): Promise<void>;

    getGenres(): Promise<GenreModel[]>;

    getMainGenreOfSeries(seriesId: number): Promise<GenreModel | null>;

    getNonMainGenresOfSeries(seriesId: number): Promise<GenreModel[]>;
}

export const GenreService: ServiceKey<GenreService> = new ServiceKey<GenreService>("genre.service");