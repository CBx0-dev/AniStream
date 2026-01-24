import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import PlayerView from "@views/PlayerView.vue";

import {SeriesModel} from "@models/series.model";
import {EpisodeModel} from "@models/episode.model";
import {SeasonModel} from "@models/season.model";

import {SeriesService} from "@services/series.service";
import {SeasonService} from "@services/season.service";
import {EpisodeService} from "@services/episode.service";

export class PlayerViewModel extends ViewModel {
    public static readonly component: Component = PlayerView;
    public static readonly route = {
        path: "/streams/:series_id/play/:season_id/:episode_id",
        params: {
            series_id: "integer",
            season_id: "integer",
            episode_id: "integer"
        }
    } satisfies RouteAdapter;

    private readonly routerService: RouterService;
    private readonly seriesService: SeriesService;
    private readonly seasonService: SeasonService;
    private readonly episodeService: EpisodeService;

    private series: SeriesModel | null = this.ref(null);
    private season: SeasonModel | null = this.ref(null);
    private episode: EpisodeModel | null = this.ref(null);

    public seriesTitle: string = this.computed(() => this.series?.title ?? "N/A");
    public seasonNumber: string = this.computed(() => this.season?.season_number.toString() ?? "N/A");
    public episodeNumber: string = this.computed(() => this.episode?.episode_number.toString() ?? "N/A");

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.seasonService = this.ctx.getService(SeasonService);
        this.episodeService = this.ctx.getService(EpisodeService);
    }

    public async mounted(): Promise<void> {
        try {
            let seriesId: number = this.routerService.params.getInteger("series_id");
            let seasonId: number = this.routerService.params.getInteger("season_id");
            let episodeId: number = this.routerService.params.getInteger("episode_id");

            this.series = await this.seriesService.getSeries(seriesId);
            if (!this.series) {
                this.routerService.navigateBack();
                return;
            }

            this.season = await this.seasonService.getSeason(seasonId);
            if (!this.season) {
                this.routerService.navigateBack();
                return;
            }

            this.episode = await this.episodeService.getEpisode(episodeId);
            if (!this.episode) {
                this.routerService.navigateBack();
                return;
            }
        } catch {
            this.routerService.navigateBack();
            return;
        }
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }
}