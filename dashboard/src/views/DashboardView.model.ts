import type {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {type RouteAdapter, RouterService} from "vue-mvvm/router";

import DashboardView from "@views/DashboardView.vue";
import {LoginViewModel} from "@views/LoginView.model";

export type DashboardTab = "audit" | "profiles";

interface OverviewStat {
    label: string;
    value: string;
    hint: string;
    tone: string;
}

export class DashboardViewModel extends ViewModel {
    public static readonly component: Component = DashboardView;
    public static readonly route: RouteAdapter = {
        path: "/home"
    }

    private readonly routerService: RouterService;

    public activeTab: DashboardTab = this.ref<DashboardTab>("audit");

    // Static overview figures until the service layer is wired up.
    public readonly stats: OverviewStat[] = this.readonly([
        {label: "Active profiles", value: "6", hint: "3 with dashboard access", tone: "text-primary"},
        {label: "Running jobs", value: "2", hint: "syncing right now", tone: "text-info"},
        {label: "Completed today", value: "146", hint: "+18% vs. yesterday", tone: "text-success"},
        {label: "Failed jobs", value: "3", hint: "needs attention", tone: "text-error"}
    ]);

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
    }

    public setTab(tab: DashboardTab): void {
        this.activeTab = tab;
    }

    public async logout(): Promise<void> {
        await this.routerService.navigateTo(LoginViewModel);
    }
}
