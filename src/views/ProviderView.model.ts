import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import ProviderView from "@views/ProviderView.vue";
import {StreamsViewModel} from "@views/StreamsView.model";
import {SettingsViewModel} from "@views/SettingsView.model";
import {ProviderService} from "@services/provider.service";

export class ProviderViewModel extends ViewModel {
    public static readonly component: Component = ProviderView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly routerService: RouterService;
    private readonly providerService: ProviderService;

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.providerService = this.ctx.getService(ProviderService);
    }

    public async onAniworldBtn(): Promise<void> {
        await this.providerService.setProvider(this.providerService.ANIWORLD);
        await this.routerService.navigateTo(StreamsViewModel)
    }

    public async onStoBtn(): Promise<void> {
        await this.providerService.setProvider(this.providerService.STO);
        await this.routerService.navigateTo(StreamsViewModel);
    }

    public async onSettingsBtn(): Promise<void> {
        await this.routerService.navigateTo(SettingsViewModel);
    }
}