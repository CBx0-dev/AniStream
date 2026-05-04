import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {EpisodeService} from "@contracts/episode.contract";
import {SeasonService} from "@contracts/season.contract";
import {SeriesService} from "@contracts/series.contract";

import type {EpisodeModel} from "@models/episode.model";
import type {SeasonModel} from "@models/season.model";
import type {SeriesModel} from "@models/series.model";

class EpisodeTests extends TestBase {
    private get episodeService(): EpisodeService {
        return this.getService(EpisodeService);
    }

    private get seasonService(): SeasonService {
        return this.getService(SeasonService);
    }

    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private async createEpisode() {
        const series: SeriesModel = await this.seriesService.insertSeries("a-series", "A Series", "Desc", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);

        const episode: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "DE", "EN", "Desc");

        expect(episode.episode_id).toBe(1);
        expect(episode.season_id).toBe(season.season_id);
        expect(episode.episode_number).toBe(1);
    }

    private async getEpisode() {
        const series: SeriesModel = await this.seriesService.insertSeries("a-series", "A Series", "Desc", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const episode: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "DE", "EN", "Desc");

        const loaded: EpisodeModel | null = await this.episodeService.getEpisode(episode.episode_id);

        expect(loaded).not.toBeNull();
        expect(loaded!.episode_id).toBe(episode.episode_id);
    }

    private async getEpisodes() {
        const series: SeriesModel = await this.seriesService.insertSeries("a-series", "A Series", "Desc", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        await this.episodeService.insertEpisode(season.season_id, 1, "DE", "EN", "Desc");

        const episodes: EpisodeModel[] = await this.episodeService.getEpisodes(season.season_id);

        expect(episodes).toHaveLength(1);
        expect(episodes[0].episode_number).toBe(1);
    }

    private async updateEpisodeMetadata() {
        const series: SeriesModel = await this.seriesService.insertSeries("a-series", "A Series", "Desc", null);
        const season: SeasonModel = await this.seasonService.insertSeason(series.series_id, 1);
        const episode: EpisodeModel = await this.episodeService.insertEpisode(season.season_id, 1, "DE", "EN", "Desc");

        await this.episodeService.updateEpisodeMetadata(episode.episode_id, "DE2", "EN2", "Desc2");

        const updated: EpisodeModel | null = await this.episodeService.getEpisode(episode.episode_id);

        expect(updated).not.toBeNull();
        expect(updated!.german_title).toBe("DE2");
        expect(updated!.english_title).toBe("EN2");
        expect(updated!.description).toBe("Desc2");
    }

    public getTests(): TestDefinition[] {
        return [
            ["CreateEpisode", this.createEpisode],
            ["GetEpisode", this.getEpisode],
            ["GetEpisodes", this.getEpisodes],
            ["UpdateEpisodeMetadata", this.updateEpisodeMetadata]
        ];
    }
}

TestBase.register(EpisodeTests);
