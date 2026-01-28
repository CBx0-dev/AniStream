import { Component } from "vue";
import { ViewModel } from "vue-mvvm";
import { RouteAdapter, RouterService } from "vue-mvvm/router";
import { DialogService } from "vue-mvvm/dialog";

import WatchlistView from "@views/WatchlistView.vue";

import { DetailControlModel } from "@controls/DetailControl.model";

import { SeriesService } from "@services/series.service";

import { SeriesModel } from "@/models/series.model";
import { DefaultProvider, ProviderService } from "@/services/provider.service";

export class WatchlistViewModel extends ViewModel {
    public static readonly component: Component = WatchlistView;
    public static readonly route: RouteAdapter = {
        path: "/watchlist"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;
    private readonly providerService: ProviderService;
    private readonly seriesService: SeriesService;

    public providerFolder: string | null = this.ref(null);
    public startedSeries: SeriesModel[] = this.ref([]);

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);
        this.providerService = this.ctx.getService(ProviderService);
        this.seriesService = this.ctx.getService(SeriesService);
    }

    public async mounted(): Promise<void> {
        this.startedSeries.clear();
    
        const provider: DefaultProvider = await this.providerService.getProvider();
        this.providerFolder = await provider.getStorageLocation();

        this.startedSeries.push(...await this.seriesService.getStartedSeries());
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public async onCardClick(series: SeriesModel): Promise<void> {
        if (!this.providerFolder) {
            return;
        }

        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel, this.providerFolder, series);
        await dialog.openDialog();
    }
}