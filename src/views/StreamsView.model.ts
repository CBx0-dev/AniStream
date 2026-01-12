import { Component } from "vue";
import { ViewModel } from "vue-mvvm";
import { RouteAdapter, RouterService } from "vue-mvvm/router";

import StreamsView from "./StreamsView.vue";

import { ProviderService } from "@services/provider.service";

export class StreamsViewModel extends ViewModel {
    public static readonly component: Component = StreamsView;
    public static readonly route: RouteAdapter = {
        path: "/streams"
    }

    private readonly routerService: RouterService;
    private readonly providerService: ProviderService;

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
        this.providerService = this.ctx.getService(ProviderService);
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }
}