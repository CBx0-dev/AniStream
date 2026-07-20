import type {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import type {RouteAdapter} from "vue-mvvm/router";

import DashboardView from "@views/DashboardView.vue";

export class DashboardViewModel extends ViewModel {
    public static readonly component: Component = DashboardView;
    public static readonly route: RouteAdapter = {
        path: "/home"
    }
}