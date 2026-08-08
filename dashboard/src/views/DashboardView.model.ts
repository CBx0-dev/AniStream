import type {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {type RouteAdapter, RouterService} from "vue-mvvm/router";

import DashboardView from "@views/DashboardView.vue";
import {LoginViewModel} from "@views/LoginView.model";

import {InformationService} from "@contracts/information.service";
import {ProfileService} from "@contracts/profile.service";

import type {StatsModel} from "@models/stats.model";

export enum DashboardTab {
    Audit,
    Profiles
}

export class DashboardViewModel extends ViewModel {
    public static readonly component: Component = DashboardView;
    public static readonly route: RouteAdapter = {
        path: "/home"
    }

    private readonly routerService: RouterService;
    
    private readonly informationService: InformationService;
    private readonly profileService: ProfileService;
    
    public activeTab: DashboardTab = this.ref<DashboardTab>(DashboardTab.Audit);

    public totalProfiles: number = this.ref(0);
    public totalSeries: number = this.ref(0);
    public dayJobs: number = this.ref(0);
    public dayJobsCompleted: number = this.ref(0);
    public dayJobsFailed: number = this.ref(0);

    public successRate: number = this.computed(() => this.dayJobs ? Math.round(this.dayJobsCompleted / this.dayJobs * 10000) / 100 : 100);

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);

        this.informationService = this.ctx.getService(InformationService);
        this.profileService = this.ctx.getService(ProfileService);
    }

    protected async mounted(): Promise<void> {
        const stats: StatsModel = await this.informationService.getStats();

        this.totalProfiles = stats.total_profiles;
        this.totalSeries = stats.total_series;
        this.dayJobs = stats.day_jobs;
        this.dayJobsCompleted = stats.day_jobs_completed;
        this.dayJobsFailed = stats.day_jobs_failed;
    }

    public async logout(): Promise<void> {
        await this.profileService.logout();
        await this.routerService.navigateTo(LoginViewModel);
    }
}
