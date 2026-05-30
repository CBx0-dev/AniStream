import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {WatchlistService} from "@contracts/watchlist.contract";
import {SeriesService} from "@contracts/series.contract";

import type {SeriesModel} from "@models/series.model";

class WatchlistTests extends TestBase {
    private get watchlistService(): WatchlistService {
        return this.getService(WatchlistService);
    }

    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private async addSeriesToWatchlist() {
        const series: SeriesModel = await this.seriesService.insertSeries("test-series", "Test Series", "Description", null);

        await this.watchlistService.addToWatchlist(series.series_id);

        const isOnList: boolean = await this.watchlistService.isSeriesOnWatchlist(series.series_id);
        expect(isOnList).toBe(true);
    }

    private async removeSeriesFromWatchlist() {
        const series: SeriesModel = await this.seriesService.insertSeries("test-series", "Test Series", "Description", null);
        await this.watchlistService.addToWatchlist(series.series_id);

        await this.watchlistService.removeFromWatchlist(series.series_id);

        const isOnList: boolean = await this.watchlistService.isSeriesOnWatchlist(series.series_id);
        expect(isOnList).toBe(false);
    }

    private async getSeriesIdsFromWatchlist() {
        const series1: SeriesModel = await this.seriesService.insertSeries("series-1", "Series 1", "", null);
        const series2: SeriesModel = await this.seriesService.insertSeries("series-2", "Series 2", "", null);

        await this.watchlistService.addToWatchlist(series1.series_id);
        await this.watchlistService.addToWatchlist(series2.series_id);

        const seriesIds: number[] = await this.watchlistService.getSeriesIds();

        expect(seriesIds).toContain(series1.series_id);
        expect(seriesIds).toContain(series2.series_id);
        expect(seriesIds.length).toBe(2);
    }

    private async isSeriesOnWatchlistReturnsFalseWhenNotAdded() {
        const series: SeriesModel = await this.seriesService.insertSeries("test-series", "Test Series", "Description", null);

        const isOnList: boolean = await this.watchlistService.isSeriesOnWatchlist(series.series_id);

        expect(isOnList).toBe(false);
    }

    public getTests(): TestDefinition[] {
        return [
            ["AddSeriesToWatchlist", this.addSeriesToWatchlist],
            ["RemoveSeriesFromWatchlist", this.removeSeriesFromWatchlist],
            ["GetSeriesIdsFromWatchlist", this.getSeriesIdsFromWatchlist],
            ["IsSeriesOnWatchlistReturnsFalseWhenNotAdded", this.isSeriesOnWatchlistReturnsFalseWhenNotAdded]
        ];
    }
}

TestBase.register(WatchlistTests);
