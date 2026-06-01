import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {WatchtimeService} from "@contracts/watchtime.contract";
import {SeriesService} from "@contracts/series.contract";
import {SeasonService} from "@contracts/season.contract";
import {EpisodeService} from "@contracts/episode.contract";

import type {WatchtimeModel} from "@models/watchtime.model";
import type {SeriesModel} from "@models/series.model";
import type {SeasonModel} from "@models/season.model";
import type {EpisodeModel} from "@models/episode.model";

class WatchtimeTests extends TestBase {
    private get watchtimeService(): WatchtimeService {
        return this.getService(WatchtimeService);
    }

    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private get seasonService(): SeasonService {
        return this.getService(SeasonService);
    }

    private get episodeService(): EpisodeService {
        return this.getService(EpisodeService);
    }

    private async createWatchtime() {
        const series: SeriesModel = await this.seriesService.insertSeries("s1", "Series 1", "", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const episode: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "E1", "E1", "");

        const watchtime: WatchtimeModel = await this.watchtimeService.createWatchtimeOfEpisode(episode.episode_id, 50, 10.5);

        expect(watchtime.watchtime_id).not.toBe(0);
        expect(watchtime.episode_id).toBe(episode.episode_id);
        expect(watchtime.percentage_watched).toBe(50);
        expect(watchtime.stopped_time).toBe(10.5);
    }

    private async getWatchtimeOfEpisode() {
        const series: SeriesModel = await this.seriesService.insertSeries("s1", "Series 1", "", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const episode: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "E1", "E1", "");
        await this.watchtimeService.createWatchtimeOfEpisode(episode.episode_id, 75, 20.0);

        const watchtime: WatchtimeModel | null = await this.watchtimeService.getWatchtimeOfEpisode(episode.episode_id);

        expect(watchtime).not.toBeNull();
        expect(watchtime!.percentage_watched).toBe(75);
    }

    private async getWatchtimesOfSeries() {
        const series: SeriesModel = await this.seriesService.insertSeries("s1", "Series 1", "", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const ep1: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "E1", "E1", "");
        const ep2: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 2, "E2", "E2", "");

        await this.watchtimeService.createWatchtimeOfEpisode(ep1.episode_id, 100, 30.0);
        await this.watchtimeService.createWatchtimeOfEpisode(ep2.episode_id, 20, 5.0);

        const watchtimes: WatchtimeModel[] = await this.watchtimeService.getWatchtimesOfSeries(series.series_id);

        expect(watchtimes).toHaveLength(2);
    }

    private async updateWatchtime() {
        const series: SeriesModel = await this.seriesService.insertSeries("s1", "Series 1", "", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const episode: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "E1", "E1", "");
        const watchtime: WatchtimeModel = await this.watchtimeService.createWatchtimeOfEpisode(episode.episode_id, 10, 2.0);

        await this.watchtimeService.updateWatchtime(watchtime.watchtime_id, 90, 25.0);

        const updated: WatchtimeModel | null = await this.watchtimeService.getWatchtimeOfEpisode(episode.episode_id);
        expect(updated).not.toBeNull();
        expect(updated!.percentage_watched).toBe(90);
        expect(updated!.stopped_time).toBe(25.0);
    }

    private async getTotalWatchProgression() {
        const series: SeriesModel = await this.seriesService.insertSeries("s1", "Series 1", "", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const ep1: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "E1", "E1", "");
        const ep2: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 2, "E2", "E2", "");
        await this.episodeService.insertEpisode(season.season_id, 3, "E3", "E3", "");

        await this.watchtimeService.createWatchtimeOfEpisode(ep1.episode_id, 85, 100);
        await this.watchtimeService.createWatchtimeOfEpisode(ep2.episode_id, 50, 60);

        const progression: number = await this.watchtimeService.getTotalWatchProgression(series.series_id);

        expect(progression).toBe(33);
    }

    public getTests(): TestDefinition[] {
        return [
            ["CreateWatchtime", this.createWatchtime],
            ["GetWatchtimeOfEpisode", this.getWatchtimeOfEpisode],
            ["GetWatchtimesOfSeries", this.getWatchtimesOfSeries],
            ["UpdateWatchtime", this.updateWatchtime],
            ["GetTotalWatchProgression", this.getTotalWatchProgression]
        ];
    }
}

TestBase.register(WatchtimeTests);
