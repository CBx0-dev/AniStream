import { Component } from "vue";
import { ViewModel } from "vue-mvvm";
import { RouteAdapter, RouterService } from "vue-mvvm/router";

import SyncView from "./SyncView.vue";

import { ProviderService } from "@services/provider.service";

export class SyncViewModel extends ViewModel {
    public static readonly component: Component = SyncView;
    public static readonly route: RouteAdapter = {
        path: "/sync"
    }

    private readonly routerService: RouterService;
    private readonly providerService: ProviderService;

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
        this.providerService = this.ctx.getService(ProviderService);
    }
}