import {Component, ComponentInternalInstance, getCurrentInstance} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";
import {AlertService} from "vue-mvvm/alert";

import StreamView from "@views/StreamView.vue";
import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";

import {SeriesModel} from "@models/series.model";
import {SeasonModel} from "@models/season.model";
import {EpisodeModel} from "@models/episode.model";
import {GenreModel} from "@models/genre.model";

import {ProviderService} from "@services/provider.service";
import {I18nService} from "@/services/i18n.service";
import {GenreService} from "@services/genre.service";
import {SeriesService} from "@services/series.service";
import {SeasonService} from "@services/season.service";
import {EpisodeService} from "@services/episode.service";

import I18n from "@utils/i18n";
import {PlayerViewModel} from "@views/PlayerView.model";

export class StreamViewModel extends ViewModel {
    public static readonly component: Component = StreamView;
    public static readonly route = {
        path: "/streams/:series_id",
        params: {
            series_id: "integer"
        }
    } satisfies RouteAdapter;

    private readonly routerService: RouterService;
    private readonly alertService: AlertService;
    private readonly providerService: ProviderService;
    private readonly i18nService: I18nService;
    private readonly genreService: GenreService;
    private readonly seriesService: SeriesService;
    private readonly seasonService: SeasonService;
    private readonly episodeService: EpisodeService;

    private episodes: Map<number, EpisodeModel[]> = this.ref(new Map<number, EpisodeModel[]>());

    public providerFolder: string | null = this.ref(null);
    public series: SeriesModel | null = this.ref(null);
    public mainGenre: GenreModel | null = this.ref(null);
    public genres: GenreModel[] = this.ref([]);
    public seasons: SeasonModel[] = this.ref([]);

    private uid: number = this.computed(() => {
        const instance: ComponentInternalInstance | null = getCurrentInstance();
        if (!instance) {
            return Math.round(Math.random() * 1000);
        }

        return instance.uid;
    });

    public previewImage: string | null = this.computed(() => this.series?.preview_image ?? null);
    public description: string = this.computed(() => this.series?.description ?? "");

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.alertService = this.ctx.getService(AlertService);
        this.providerService = this.ctx.getService(ProviderService);
        this.i18nService = this.ctx.getService(I18nService);
        this.genreService = this.ctx.getService(GenreService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.seasonService = this.ctx.getService(SeasonService);
        this.episodeService = this.ctx.getService(EpisodeService);
    }

    public async mounted(): Promise<void> {
        this.genres.clear();
        this.mainGenre = null;

        this.seasons.clear();
        this.episodes.clear();

        try {
            let seriesId: number = this.routerService.params.getInteger("series_id");
            this.series = await this.seriesService.getSeries(seriesId);
            if (!this.series) {
                this.routerService.navigateBack();
                return;
            }
        } catch {
            this.routerService.navigateBack();
            return;
        }

        this.providerFolder = await (await this.providerService.getProvider()).getStorageLocation();

        this.genres.push(...await this.genreService.getNonMainGenresOfSeries(this.series.series_id));
        this.mainGenre = await this.genreService.getMainGenreOfSeries(this.series.series_id);

        this.seasons = await this.seasonService.getSeasons(this.series.series_id);

        await Promise.allSettled(this.seasons.map(async season => {
            this.episodes.set(season.season_id, await this.episodeService.getEpisodes(season.season_id));
        }));
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public async onSyncBtn(): Promise<void> {
        if (!this.series) {
            return;
        }

        await this.routerService.navigateTo(SeriesSyncViewModel, {
            series_id: this.series.series_id
        });
    }

    public async onResetBtn(): Promise<void> {
        if (!this.series) {
            return;
        }

        const confirmResult: boolean = await this.alertService.showConfirm({
            title: "Reset progression",
            description: "Do you really want to reset your progression"
        });
        if (!confirmResult) {
            return;
        }

        await this.seriesService.resetProgression(this.series.series_id);
        for (const episode of Array.from(this.episodes.values()).flat()) {
            episode.percentage_watched = 0;
        }
    }

    public getGenreName(key: string): string {
        return this.i18nService.getDynamic(I18n.Genres, key);
    }

    public getEpisodes(seasonId: number): EpisodeModel[] {
        const episodes: EpisodeModel[] | undefined = this.episodes.get(seasonId)
        if (!episodes) {
            return [];
        }

        return episodes;
    }

    public async onEpisodeRowClick(season: SeasonModel, episode: EpisodeModel): Promise<void> {
        if (!this.series) {
            return;
        }

        await this.routerService.navigateTo(PlayerViewModel, {
            series_id: this.series.series_id,
            season_id: season.season_id,
            episode_id: episode.episode_id
        });
    }

    public onPopOverClicked(ev: PointerEvent): void {
        const popover: HTMLElement | null = (<HTMLElement>ev.target).closest("[popover]") as HTMLElement | null
        if (!popover) {
            return;
        }
        popover.hidePopover();
    }

    public async onMarkWatchedBtn(episode: EpisodeModel): Promise<void> {
        await this.episodeService.updateEpisodeProgression(episode.episode_id, 100, episode.stopped_time);
        episode.percentage_watched = 100;
    }

    public getPopoverId(episodeId: number): string {
        return `popover-${this.uid}-${episodeId}`;
    }

    public getAnchorId(episodeId: number): string {
        return `--anchor-${this.uid}-${episodeId}`;
    }
}