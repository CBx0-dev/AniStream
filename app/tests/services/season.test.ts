import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {SeasonService} from "@contracts/season.contract";
import {SeriesService} from "@contracts/series.contract";

import type {SeasonModel} from "@models/season.model";
import type {SeriesModel} from "@models/series.model";

class SeasonTests extends TestBase {
    private get seasonService(): SeasonService {
        return this.getService(SeasonService);
    }

    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private async createSeason() {
        const series: SeriesModel = await this.seriesService.insertSeries("g-ep", "Episodes", "Desc", null);
        expect(series.series_id).toBe(1);

        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        expect(season.season_id).toBe(1);
        expect(season.series_id).toBe(series.series_id);
        expect(season.season_number).toBe(1);
    }

    private async getSeasons() {
        const series: SeriesModel = await this.seriesService.insertSeries("g-ep", "Episodes", "Desc", null);
        await this.seasonService.insertSeason(series.series_id, 1);

        const bySeriesId: SeasonModel[] = await this.seasonService.getSeasons(series.series_id);

        expect(bySeriesId).toHaveLength(1);
        expect(bySeriesId[0].season_id).toBe(1);
        expect(bySeriesId[0].season_number).toBe(1);
    }

    private async getSeason() {
        const series: SeriesModel = await this.seriesService.insertSeries("g-ep", "Episodes", "Desc", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);

        const byId: SeasonModel | null = await this.seasonService.getSeason(season.season_id);

        expect(byId).not.toBeNull();
        expect(byId!.season_id).toBe(season.season_id);
        expect(byId!.season_number).toBe(season.season_number);
    }

    public getTests(): TestDefinition[] {
        return [
            ["CreateSeason", this.createSeason],
            ["GetSeasons", this.getSeasons],
            ["GetSeason", this.getSeason]
        ];
    }
}

TestBase.register(SeasonTests);
