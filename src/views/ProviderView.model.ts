import { Component } from "vue";

import { ViewModel } from "vue-mvvm";
import { RouteAdapter, RouterService } from "vue-mvvm/router";

import ProviderView from "./ProviderView.vue";

export class ProviderViewModel extends ViewModel {
    public static readonly component: Component = ProviderView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly routerService: RouterService;
    

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
    }
}