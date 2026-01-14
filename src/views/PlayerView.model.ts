import { Component } from "vue";
import { ViewModel } from "vue-mvvm";
import PlayerView from "@views/PlayerView.vue";
import { RouteAdapter, RouterService } from "vue-mvvm/router";

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

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
    }

    public mounted(): void {
        let seriesId: number;
        let seasonId: number;
        let episodeId: number;

        try {
            seriesId = this.routerService.params.getInteger("series_id");
            seasonId = this.routerService.params.getInteger("season_id");
            episodeId = this.routerService.params.getInteger("episode_id");
        } catch {
            this.routerService.navigateBack();
        }
    }
}