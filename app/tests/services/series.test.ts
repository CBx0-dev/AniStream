import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {SeriesService} from "@contracts/series.contract";
import {GenreService} from "@contracts/genre.contract";

import type {SeriesModel} from "@models/series.model";
import type {GenreModel} from "@models/genre.model";

class SeriesTests extends TestBase {
    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private get genreService(): GenreService {
        return this.getService(GenreService);
    }

    private async createSeries() {
        const series: SeriesModel = await this.seriesService.insertSeries("a-series", "A Series", "Desc", null);
        expect(series.series_id).toBe(1);
        expect(series.title).toBe("A Series");
        expect(series.description).toBe("Desc");
        expect(series.preview_image).toBeNull();
    }

    private async getSeriesById() {
        const created: SeriesModel = await this.seriesService.insertSeries("g-a", "Alpha Show", "", null);

        const series: SeriesModel | null = await this.seriesService.getSeries(created.series_id);

        expect(series).not.toBeNull();
        expect(series!.series_id).toBe(created.series_id);
    }

    private async getSeriesByGuid() {
        const created: SeriesModel = await this.seriesService.insertSeries("g-a", "Alpha Show", "", null);

        // In JS contract we don't have GetSeries(guid), we only have getSeries(number)
        // However, we have existByGUID(guid).
        // Let's check if the .NET test actually uses GUID.
        // C# had: GetSeries(created.Guid)
        // Our contract only has getSeries(seriesId: number)
        // I will stick to what the contract offers or see if there is another way.
        // Actually, the contract might be incomplete compared to .NET, but I should only use what's there.
        
        const exists: boolean = await this.seriesService.existByGUID(created.guid);
        expect(exists).toBe(true);
    }

    private async getSeriesByIds() {
        const alpha: SeriesModel = await this.seriesService.insertSeries("g-a", "Alpha Show", "", null);
        await this.seriesService.insertSeries("g-b", "Beta Show", "", null);
        const gamma: SeriesModel = await this.seriesService.insertSeries("g-c", "Gamma", "", null);

        const series: SeriesModel[] = await this.seriesService.getSeriesByIds([alpha.series_id, gamma.series_id]);

        const titles = series.map(s => s.title).sort();
        expect(titles).toEqual(["Alpha Show", "Gamma"]);
    }

    private async getSeriesChunk() {
        const alpha: SeriesModel = await this.seriesService.insertSeries("g-a", "Alpha Show", "", null);
        await this.seriesService.insertSeries("g-b", "Beta Show", "", null);
        const gamma: SeriesModel = await this.seriesService.insertSeries("g-c", "Gamma", "", null);
        const adventure: GenreModel = await this.genreService.insertGenre("adventure");
        await this.genreService.insertGenreToSeries(adventure, alpha, true);
        await this.genreService.insertGenreToSeries(adventure, gamma, false);

        // JS contract has getFilteredSeriesChunk(offset, limit, searchText, genresIds)
        // and getSeriesChunk(offset, limit)
        const filtered: SeriesModel[] = await this.seriesService.getFilteredSeriesChunk(0, 10, "a", [adventure.genre_id]);
        const paged: SeriesModel[] = await this.seriesService.getSeriesChunk(1, 1);

        const filteredTitles = filtered.map(s => s.title).sort();
        expect(filteredTitles).toEqual(["Alpha Show", "Gamma"]);
        
        expect(paged).toHaveLength(1);
        expect(paged[0].title).toBe("Beta Show");
    }

    private async getStartedSeries() {
        const series: SeriesModel[] = await this.seriesService.getStartedSeries();
        expect(Array.isArray(series)).toBe(true);
    }

    public getTests(): TestDefinition[] {
        return [
            ["CreateSeries", this.createSeries],
            ["GetSeriesById", this.getSeriesById],
            ["GetSeriesByGuid", this.getSeriesByGuid],
            ["GetSeriesByIds", this.getSeriesByIds],
            ["GetSeriesChunk", this.getSeriesChunk],
            ["GetStartedSeries", this.getStartedSeries]
        ];
    }
}

TestBase.register(SeriesTests);
