import { Component } from "vue";
import { ViewModel } from "vue-mvvm";
import { DialogService } from "vue-mvvm/dialog";
import { RouteAdapter, RouterService } from "vue-mvvm/router";

import StreamsView from "./StreamsView.vue";

import { SyncViewModel } from "./SyncView.model";
import { DetailControlModel } from "@/controls/DetailControl.model";
import {SeriesService} from "@services/series.service";
import {I18nService} from "@services/i18n.service";
import { WatchlistViewModel } from "./WatchlistView.model";

export class StreamsViewModel extends ViewModel {
    public static readonly component: Component = StreamsView;
    public static readonly route: RouteAdapter = {
        path: "/streams"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;
    private readonly i18nService: I18nService;
    private readonly seriesService: SeriesService;

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);
        this.i18nService = this.ctx.getService(I18nService);
        this.seriesService = this.ctx.getService(SeriesService);
    }

    public async mounted(): Promise<void> {
        if (await this.seriesService.requiresSync()) {
            await this.routerService.navigateTo(SyncViewModel);
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

    public async onCardClick(): Promise<void> {
        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel);
        await dialog.openDialog();
    }

    public i18n(key: readonly [string, readonly string[]]): string {
        return this.i18nService.get(key);
    }
}