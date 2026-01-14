import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import StreamsView from "@views/StreamsView.vue";
import {SyncViewModel} from "@views/SyncView.model";
import {WatchlistViewModel} from "@views//WatchlistView.model";
import {DetailControlModel} from "@/controls/DetailControl.model";

import {SeriesService} from "@services/series.service";
import {I18nService} from "@services/i18n.service";
import {SeriesModel} from "@models/series.model";
import {DefaultProvider, ProviderService} from "@services/provider.service";

export class StreamsViewModel extends ViewModel {
    public static readonly component: Component = StreamsView;
    public static readonly route: RouteAdapter = {
        path: "/streams"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;
    private readonly providerService: ProviderService;
    private readonly i18nService: I18nService;
    private readonly seriesService: SeriesService;

    private readonly observer: IntersectionObserver;

    public chunkSize: number = 50;
    public series: SeriesModel[] = this.ref([]);
    public providerFolder: string | null = this.ref(null);

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);
        this.providerService = this.ctx.getService(ProviderService);
        this.i18nService = this.ctx.getService(I18nService);
        this.seriesService = this.ctx.getService(SeriesService);

        this.observer = new IntersectionObserver(async entries => {
            if (entries.length == 0) {
                return;
            }

            if (entries[0].isIntersecting) {
                await this.loadNextChunk();
            }
        }, {rootMargin: '0px 0px 50px 0px'});
    }

    public async mounted(): Promise<void> {
        if (await this.seriesService.requiresSync()) {
            await this.routerService.navigateTo(SyncViewModel);
        }

        const provider: DefaultProvider = await this.providerService.getProvider();
        this.providerFolder = await provider.getStorageLocation();

        this.series.clear();
        const intersectionLine: HTMLElement | null = document.getElementById("intersectionLine");
        if (intersectionLine) {
            this.observer.observe(intersectionLine);
        }
    }

    public unmounted(): void {
        const intersectionLine: HTMLElement | null = document.getElementById("intersectionLine");
        if (intersectionLine) {
            this.observer.unobserve(intersectionLine);
        }
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

    public async onCardClick(series: SeriesModel): Promise<void> {
        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel, series);
        await dialog.openDialog();
    }

    public i18n(key: readonly [string, readonly string[]]): string {
        return this.i18nService.get(key);
    }

    private async loadNextChunk(): Promise<void> {
        const chunk: SeriesModel[] = await this.seriesService.getSeriesChunk(this.series.length, this.chunkSize);
        this.series.push(...chunk);
    }
}