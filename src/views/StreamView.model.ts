import {Component, ComponentInternalInstance, getCurrentInstance} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";
import {AlertService} from "vue-mvvm/alert";

import StreamView from "@views/StreamView.vue";
import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";
import {PlayerViewModel} from "@views/PlayerView.model";

import {SeriesModel} from "@models/series.model";
import {SeasonModel} from "@models/season.model";
import {EpisodeModel} from "@models/episode.model";
import {GenreModel} from "@models/genre.model";
import {WatchtimeModel} from "@models/watchtime.model";

import {ProviderService} from "@services/provider.service";
import {I18nService} from "@services/i18n.service";
import {GenreService} from "@services/genre.service";
import {SeriesService} from "@services/series.service";
import {SeasonService} from "@services/season.service";
import {EpisodeService} from "@services/episode.service";
import {WatchtimeService} from "@services/watchtime.service";

import I18n from "@utils/i18n";

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
    private readonly watchtimeService: WatchtimeService;

    private episodes: Map<number, EpisodeModel[]> = this.ref(new Map<number, EpisodeModel[]>());
    private watchtimes: Map<number, WatchtimeModel> = this.ref(new Map<number, WatchtimeModel>);

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
        this.watchtimeService = this.ctx.getService(WatchtimeService);
    }

    protected async mounted(): Promise<void> {
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

        const watchtimes: WatchtimeModel[] = await this.watchtimeService.getWatchtimesOfSeries(this.series.series_id);
        for (const watchtime of watchtimes) {
            this.watchtimes.set(watchtime.episode_id, watchtime);
        }
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

        await this.watchtimeService.updateWatchtimesOfSeries(this.series.series_id, 0, 0);
        for (const watchtime of this.watchtimes.values()) {
            watchtime.percentage_watched = 0;
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

    public async onSeasonMarkWatchedBtn(season: SeasonModel): Promise<void> {
        await this.watchtimeService.updateWatchtimesOfSeason(season.season_id, 100, 0);
        for (const episode of this.getEpisodes(season.season_id)) {
            const watchtime: WatchtimeModel | undefined = this.watchtimes.get(episode.episode_id);
            if (!watchtime) {
                const watchtime: WatchtimeModel = await this.watchtimeService.createWatchtimeOfEpisode(episode.episode_id, 100, 0);
                this.watchtimes.set(episode.episode_id, watchtime);
                continue;
            }

            watchtime.percentage_watched = 100;
        }
    }

    public async onEpisodeMarkWatchedBtn(episode: EpisodeModel): Promise<void> {
        const watchtime: WatchtimeModel | undefined = this.watchtimes.get(episode.episode_id);
        if (!watchtime) {
            const watchtime: WatchtimeModel = await this.watchtimeService.createWatchtimeOfEpisode(episode.episode_id, 100, 0);
            this.watchtimes.set(episode.episode_id, watchtime);
            return;
        }

        await this.watchtimeService.updateWatchtimeWithEpisode(episode.episode_id, 100, watchtime.stopped_time);
        watchtime.percentage_watched = 100;
    }

    public getPopoverId(seasonId: number, episodeId?: number): string {
        if (!episodeId) {
            return `popover-${this.uid}-${seasonId}`;
        }
        return `popover-${this.uid}-${seasonId}-${episodeId}`;
    }

    public getAnchorId(seasonId: number, episodeId?: number): string {
        if (!episodeId) {
            return `--anchor-${this.uid}-${seasonId}`;
        }
        return `--anchor-${this.uid}-${seasonId}-${episodeId}`;
    }

    public isEpisodeWatched(episode: EpisodeModel): boolean {
        const watchtime: WatchtimeModel | undefined = this.watchtimes.get(episode.episode_id);
        if (!watchtime) {
            return false;
        }

        return watchtime.percentage_watched >= 80;
    }

    public isSeasonWatched(season: SeasonModel): boolean {
        const episodes: EpisodeModel[] = this.getEpisodes(season.season_id);
        for (const episode of episodes) {
            const watchtime: WatchtimeModel | undefined = this.watchtimes.get(episode.episode_id);
            if (!watchtime) {
                return false;
            }

            if (watchtime.percentage_watched < 80) {
                return false;
            }
        }

        return true;
    }
}