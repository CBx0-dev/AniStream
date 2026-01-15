import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter} from "vue-mvvm/router";

import SettingsView from "@views/SettingsView.vue";

export class SettingsViewModel extends ViewModel {
    public static component: Component = SettingsView;
    public static route: RouteAdapter = {
        path: "/settings"
    }

    public constructor() {
        super();
    }

}