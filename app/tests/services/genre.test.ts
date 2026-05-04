import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {GenreService} from "@contracts/genre.contract";
import {SeriesService} from "@contracts/series.contract";

import type {GenreModel} from "@models/genre.model";
import type {SeriesModel} from "@models/series.model";

class GenreTests extends TestBase {
    private get genreService(): GenreService {
        return this.getService(GenreService);
    }

    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private async createGenre() {
        const genre: GenreModel = await this.genreService.insertGenre("action");

        expect(genre.genre_id).toBe(1);
        expect(genre.key).toBe("action");
    }

    private async createGenreToSeries() {
        const series: SeriesModel = await this.seriesService.insertSeries("s-1", "Series", "Description", null);
        const genre: GenreModel = await this.genreService.insertGenre("main");

        await this.genreService.insertGenreToSeries(genre, series, true);

        const mainGenre: GenreModel | null = await this.genreService.getMainGenreOfSeries(series.series_id);

        expect(mainGenre).not.toBeNull();
        expect(mainGenre!.genre_id).toBe(genre.genre_id);
    }

    private async getGenres() {
        const genre: GenreModel = await this.genreService.insertGenre("action");

        const genres: GenreModel[] = await this.genreService.getGenres();

        expect(genres).toHaveLength(1);
        expect(genres[0].genre_id).toBe(genre.genre_id);
    }

    private async getGenreById() {
        const genre: GenreModel = await this.genreService.insertGenre("action");

        const byId: GenreModel[] = await this.genreService.getGenres();

        expect(byId).toHaveLength(1);
        expect(byId[0].genre_id).toBe(genre.genre_id);
    }

    private async getGenreByKey() {
        const genre: GenreModel = await this.genreService.insertGenre("action");

        const byKey: GenreModel | null = await this.genreService.getGenreByKey(genre.key);

        expect(byKey).not.toBeNull();
        expect(byKey!.key).toBe(genre.key);
    }

    private async getMainGenreOfSeries() {
        await this.insertSeriesWithGenres();

        const mainGenre: GenreModel | null = await this.genreService.getMainGenreOfSeries(1);

        expect(mainGenre).not.toBeNull();
        expect(mainGenre!.genre_id).toBe(1);
    }

    private async getNonMainGenresOfSeries() {
        await this.insertSeriesWithGenres();

        const nonMainGenres: GenreModel[] = await this.genreService.getNonMainGenresOfSeries(1);

        expect(nonMainGenres).toHaveLength(1);
        expect(nonMainGenres[0].genre_id).toBe(2);
    }

    private async insertSeriesWithGenres() {
        const series: SeriesModel = await this.seriesService.insertSeries("s-1", "Series", "Description", null);
        const main: GenreModel = await this.genreService.insertGenre("main");
        const side: GenreModel = await this.genreService.insertGenre("side");

        await this.genreService.insertGenreToSeries(main, series, true);
        await this.genreService.insertGenreToSeries(side, series, false);

        expect(series.series_id).toBe(1);
        expect(main.genre_id).toBe(1);
        expect(side.genre_id).toBe(2);
    }

    public getTests(): TestDefinition[] {
        return [
            ["CreateGenre", this.createGenre],
            ["CreateGenreToSeries", this.createGenreToSeries],
            ["GetGenres", this.getGenres],
            ["GetGenreById", this.getGenreById],
            ["GetGenreByKey", this.getGenreByKey],
            ["GetMainGenreOfSeries", this.getMainGenreOfSeries],
            ["GetNonMainGenresOfSeries", this.getNonMainGenresOfSeries]
        ];
    }

}

TestBase.register(GenreTests);