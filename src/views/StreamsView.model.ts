import {Component, watch, WatchHandle} from "vue";
import {ViewModel} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";
import {RouteAdapter, RouterService} from "vue-mvvm/router";
import {ProgressToastControl, ToastService} from "vue-mvvm/toast";

import StreamsView from "@views/StreamsView.vue";
import {SyncViewModel} from "@views/SyncView.model";
import {WatchlistViewModel} from "@views/WatchlistView.model";

import {DetailControlModel} from "@controls/DetailControl.model";

import {SeriesService} from "@contracts/series.contract";
import {FetchService} from "@contracts/fetch.contract";
import {I18nService} from "@contracts/i18n.contract";
import {ProviderService} from "@contracts/provider.contract";
import {GenreService} from "@contracts/genre.contract";

import {SeriesModel} from "@models/series.model";
import {GenreModel} from "@models/genre.model";

import {throttle} from "@utils/throttle";

import {DefaultProvider} from "@providers/default";

import I18n from "@utils/i18n";

export class StreamsViewModel extends ViewModel {
    public static readonly component: Component = StreamsView;
    public static readonly route: RouteAdapter = {
        path: "/streams"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;
    private readonly toastService: ToastService;
    private readonly providerService: ProviderService;
    private readonly fetchService: FetchService;
    private readonly i18nService: I18nService;
    private readonly seriesService: SeriesService;
    private readonly genreService: GenreService;

    private searchStringWatcher: WatchHandle;
    private ignoreObserverOnce: boolean;
    private readonly observer: IntersectionObserver;

    public chunkSize: number = 50;
    public series: SeriesModel[] = this.ref([]);
    public providerFolder: string | null = this.ref(null);
    public genres: GenreModel[] = this.ref([]);
    public selectedGenres: number[] = this.ref([]);
    public genreFilter: string = this.ref("default");
    public filteredGenres: GenreModel[] = this.computed(() => this.genres.filter(genre => this.selectedGenres.includes(genre.genre_id)));
    public availableGenres: GenreModel[] = this.computed(() => this.genres.filter(genre => !this.selectedGenres.includes(genre.genre_id)));
    public searchText: string = this.ref("");

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);
        this.toastService = this.ctx.getService(ToastService);
        this.providerService = this.ctx.getService(ProviderService);
        this.fetchService = this.ctx.getService(FetchService);
        this.i18nService = this.ctx.getService(I18nService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.genreService = this.ctx.getService(GenreService);

        this.searchStringWatcher = watch(() => this.searchText, throttle(async () => {
            await this.onFilterUpdate();
        }, 300));
        this.ignoreObserverOnce = false;
        this.observer = new IntersectionObserver(async entries => {
            if (entries.length == 0) {
                return;
            }

            if (!entries[0].isIntersecting) {
                return;
            }

            if (this.ignoreObserverOnce) {
                this.ignoreObserverOnce = false;
                return;
            }

            await this.loadNextChunk();
        }, {rootMargin: '0px 0px 250px 0px'});
    }

    public async mounted(): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        this.providerFolder = await provider.getStorageLocation();

        this.series.clear();
        const intersectionLine: HTMLElement | null = document.getElementById("intersectionLine");
        if (intersectionLine) {
            this.observer.observe(intersectionLine);
        }

        this.genres.push(...await this.genreService.getGenres());
        this.startSync();
    }

    public unmounted(): void {
        const intersectionLine: HTMLElement | null = document.getElementById("intersectionLine");
        if (intersectionLine) {
            this.observer.unobserve(intersectionLine);
        }
        this.searchStringWatcher.stop();
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public async onSyncBtn(): Promise<void> {
        await this.routerService.navigateTo(SyncViewModel);
    }

    public async onWatchlistBtn(): Promise<void> {
        await this.routerService.navigateTo(WatchlistViewModel);
    }

    public async onGenreFilter(genreId: number): Promise<void> {
        this.selectedGenres.push(genreId);
        this.genreFilter = "default";

        await this.onFilterUpdate();
    }

    public async onGenreFilterRemoveBtn(genreId: number): Promise<void> {
        this.selectedGenres = this.selectedGenres.filter(id => id != genreId);

        await this.onFilterUpdate();
    }

    public async onGenreFilterClearBtn(): Promise<void> {
        this.selectedGenres.clear();

        await this.onFilterUpdate();
    }

    public async onCardClick(series: SeriesModel): Promise<void> {
        if (!this.providerFolder) {
            return;
        }
        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel, this.providerFolder, series);
        await dialog.openDialog();
    }

    public i18n(key: readonly [string, readonly string[]]): string {
        return this.i18nService.get(key);
    }

    public i18nDynamic(target: any, name: string): string {
        return this.i18nService.getDynamic(target, name);
    }

    private async loadNextChunk(): Promise<void> {
        const chunk: SeriesModel[] = this.selectedGenres.length == 0 && this.searchText.length == 0
            ? await this.seriesService.getSeriesChunk(this.series.length, this.chunkSize)
            : await this.seriesService.getFilteredSeriesChunk(this.series.length, this.chunkSize, this.searchText, this.selectedGenres);
        this.series.push(...chunk);
    }

    private async onFilterUpdate(): Promise<void> {
        this.series.clear();
        this.ignoreObserverOnce = true;
        await this.loadNextChunk();
    }

    private async startSync(): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const storageKey: string = `synced-${provider.uniqueKey}`;
        if (!!sessionStorage.getItem(storageKey)) {
            return;
        }

        sessionStorage.setItem(storageKey, "true");

        const guids: string[] = await this.fetchService.getCatalog(provider);

        using toast: ProgressToastControl = await this.toastService.showProgress({
            type: "info",
            title: this.i18nService.get(I18n.StreamsView.toast.title),
            description: this.i18nService.get(I18n.StreamsView.toast.description),
            max: guids.length
        });

        for (const guid of guids) {
            toast.value++;
            if (await this.seriesService.existByGUID(guid)) {
                continue;
            }

            const [fetchedSeries, fetchedGenres] = await this.fetchService.getSeries(guid, provider);
            const series: SeriesModel = await this.seriesService.insertSeries(fetchedSeries.guid, fetchedSeries.title, fetchedSeries.description, fetchedSeries.preview_image);
            await Promise.all(fetchedGenres.map(fetchedGenre => (async () => {
                let genre: GenreModel | null = await this.genreService.getGenreByKey(fetchedGenre.key);
                if (!genre) {
                    genre = await this.genreService.insertGenre(fetchedGenre.key);
                }

                await this.genreService.insertGenreToSeries(genre, series, fetchedGenre.main)
            })()));
        }
    }
}