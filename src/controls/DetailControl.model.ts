import { Component, ComponentInternalInstance, getCurrentInstance } from "vue";
import {RouterService} from "vue-mvvm/router";
import { DialogControl } from "vue-mvvm/dialog";
import {AlertService} from "vue-mvvm/alert";

import DetailControl from "@controls/DetailControl.vue";

import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";
import {StreamViewModel} from "@views/StreamView.model";

import {SeriesModel} from "@models/series.model";
import {GenreModel} from "@models/genre.model";

import {GenreService} from "@services/genre.service";
import {I18nService} from "@services/i18n.service";
import {SeriesService} from "@services/series.service";
import {SeasonService} from "@services/season.service";
import {WatchlistService} from "@services/watchlist.service";

import I18n from "@utils/i18n";

export class DetailControlModel extends DialogControl {
    public static readonly component: Component = DetailControl;

    private readonly routerService: RouterService;
    private readonly alertService: AlertService;
    private readonly seriesService: SeriesService;
    private readonly seasonService: SeasonService;
    private readonly genreService: GenreService;
    private readonly watchlistService: WatchlistService;
    private readonly i18nService: I18nService;

    public opened: boolean = this.ref(false);
    public uid: number = this.computed(() => {
        const instance: ComponentInternalInstance | null = getCurrentInstance();
        if (!instance) {
            return Math.round(Math.random() * 1000);
        }

        return instance.uid;
    });
    public popoverId: string = this.computed(() => `popover-${this.uid}`);
    public anchorId: string = this.computed(() => `--anchor-${this.uid}`);
    public providerFolder: string | null = this.ref(null)
    public seriesId: number = this.ref(0);
    public title: string = this.ref("");
    public description: string = this.ref("");
    public previewImage: string | null = this.ref(null);
    public genres: GenreModel[] = this.ref([]);
    public mainGenre: GenreModel | null = this.ref(null);
    public genreChunk: GenreModel[] = this.computed(() => this.genres.slice(0, 3));
    public genreOverflow: number = this.computed(() => this.genres.length - 3);
    public watchProgression: number = this.ref(0);
    public onWatchlist: boolean = this.ref(false);

    public constructor(providerFolder: string, series: SeriesModel) {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.alertService = this.ctx.getService(AlertService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.seasonService = this.ctx.getService(SeasonService);
        this.genreService = this.ctx.getService(GenreService);
        this.watchlistService = this.ctx.getService(WatchlistService);
        this.i18nService = this.ctx.getService(I18nService);

        this.providerFolder = providerFolder;
        this.seriesId = series.series_id;
        this.title = series.title;
        this.description = series.description;
        this.previewImage = series.preview_image;
    }

    protected async onOpen(): Promise<void> {
        this.opened = true;

        this.mainGenre = await this.genreService.getMainGenreOfSeries(this.seriesId);
        this.genres.push(...await this.genreService.getNonMainGenresOfSeries(this.seriesId));
        this.watchProgression = await this.seriesService.getTotalWatchProgression(this.seriesId);
        this.onWatchlist = await this.watchlistService.isSeriesOnWatchlist(this.seriesId);
    }

    protected onClose(): void {
        this.opened = false;
        this.destroy();
    }

    public async onWatchBtn(): Promise<void> {
        await this.closeDialog();
        if (await this.seasonService.requiresSync(this.seriesId)) {
            await this.routerService.navigateTo(SeriesSyncViewModel, {
                series_id: this.seriesId
            });
            return;
        }

    
        await this.routerService.navigateTo(StreamViewModel, {
            series_id: this.seriesId
        });
    }

    public onPopOverClicked(ev: PointerEvent): void {
        const popover: HTMLElement | null = (<HTMLElement>ev.target).closest("[popover]") as HTMLElement | null
        if (!popover) {
            return;
        }
        popover.hidePopover();
    }

    public async onResetBtn(): Promise<void> {
        const confirmResult: boolean = await this.alertService.showConfirm({
            title: "Reset progression",
            description: "Do you really want to reset your progression"
        });
        if (!confirmResult) {
            return;
        }

        await this.seriesService.resetProgression(this.seriesId);
        this.watchProgression = 0;
    }

    public async onAddWatchlistBtn(): Promise<void> {
        await this.watchlistService.addToWatchlist(this.seriesId);
        this.onWatchlist = true;
    }

    public async onRemoveWatchlistBtn(): Promise<void> {
        await this.watchlistService.removeFromWatchlist(this.seriesId);
        this.onWatchlist = false;
    }

    // public onAddListBtn(): void {
    //
    // }

    public getGenreName(key: string): string {
        return this.i18nService.getDynamic(I18n.Genres, key);
    }
}