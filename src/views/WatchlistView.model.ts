import { Component } from "vue";
import { ViewModel } from "vue-mvvm";
import { RouteAdapter, RouterService } from "vue-mvvm/router";
import { DialogService } from "vue-mvvm/dialog";

import WatchlistView from "@views/WatchlistView.vue";
import { DetailControlModel } from "@/controls/DetailControl.model";

export class WatchlistViewModel extends ViewModel {
    public static readonly component: Component = WatchlistView;
    public static readonly route: RouteAdapter = {
        path: "/watchlist"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public async onCardClick(): Promise<void> {
        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel);
        await dialog.openDialog();
    }
}