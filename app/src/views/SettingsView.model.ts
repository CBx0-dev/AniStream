import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import SettingsView from "@views/SettingsView.vue";

export class SettingsViewModel extends ViewModel {
    public static component: Component = SettingsView;
    public static route: RouteAdapter = {
        path: "/settings"
    }

    private readonly routerService: RouterService;

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }
}