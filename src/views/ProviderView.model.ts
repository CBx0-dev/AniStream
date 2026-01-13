import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import ProviderView from "./ProviderView.vue";
import {StreamsViewModel} from "./StreamsView.model";
import {ProviderService} from "@services/provider.service";
import {I18nService} from "@services/i18n.service";

export class ProviderViewModel extends ViewModel {
    public static readonly component: Component = ProviderView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly i18nService: I18nService;
    private readonly routerService: RouterService;
    private readonly providerService: ProviderService;

    public constructor() {
        super();

        this.i18nService = this.ctx.getService(I18nService);
        this.routerService = this.ctx.getService(RouterService);
        this.providerService = this.ctx.getService(ProviderService);
    }

    public async onAniworldBtn(): Promise<void> {
        await this.providerService.setProvider(this.providerService.ANIWORLD);
        await this.routerService.navigateTo(StreamsViewModel)
    }

    public async onStoBtn(): Promise<void> {
        await this.providerService.setProvider(this.providerService.STO);
        await this.routerService.navigateTo(StreamsViewModel)
    }

    public i18n(key: readonly [string, readonly string[]]): string {
        return this.i18nService.get(key);
    }
}