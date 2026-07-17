import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import SeriesSyncStandaloneView from "@views/SeriesSyncStandaloneView.vue";
import SeriesSyncClientView from "@views/SeriesSyncClientView.vue";
import {StreamViewModel} from "@views/StreamView.model";

import {SeriesService} from "@contracts/series.contract";
import {SeasonService, SyncInformation, SyncStatus} from "@contracts/season.contract";
import {FetchService} from "@contracts/fetch.contract";
import {EpisodeService} from "@contracts/episode.contract";

import {SeriesModel} from "@models/series.model";
import {SeasonFetchModel, SeasonModel} from "@models/season.model";
import {EpisodeFetchModel, EpisodeModel} from "@models/episode.model";

import {NotImplementedError} from "@utils/error";

export class SeriesSyncViewModel extends ViewModel {
    public static readonly route = {
        path: "/streams/:series_id/sync",
        params: {
            series_id: "integer"
        }
    } satisfies RouteAdapter;

    public static get component(): Component {
        throw new NotImplementedError("get SeriesSyncViewModel.component");
    }
}

export class SeriesSyncViewStandaloneModel extends SeriesSyncViewModel {
    public static readonly component: Component = SeriesSyncStandaloneView;

    private readonly routerService: RouterService;
    private readonly fetchService: FetchService;
    private readonly seriesService: SeriesService;
    private readonly seasonService: SeasonService;
    private readonly episodeService: EpisodeService;

    public isPreLoading: boolean = this.ref(false);
    public isSyncing: boolean = this.ref(false);
    public syncProgress: number = this.ref(0);
    public syncStatus: string = this.ref("");
    public allAvailableSelected: boolean = this.ref(false);
    public allExistingSelected: boolean = this.ref(false);
    public availableSeasons: SeasonFetchModel[] = this.ref([]);
    public existingSeasons: SeasonModel[] = this.ref([]);
    public selectedSeasons: number[] = this.ref([]);
    public nonExistingSeasons: SeasonFetchModel[] = this.computed(() => this.availableSeasons.filter(season => !this.existingSeasons.find(e => e.season_number == season.season_number)));

    private series: SeriesModel | null;

    public constructor() {
        super();

        this.fetchService = this.ctx.getService(FetchService);
        this.routerService = this.ctx.getService(RouterService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.seasonService = this.ctx.getService(SeasonService);
        this.episodeService = this.ctx.getService(EpisodeService);

        this.series = null;
    }

    public async mounted(): Promise<void> {
        this.isPreLoading = true;
        this.availableSeasons.clear();
        this.existingSeasons.clear();
        this.selectedSeasons.clear();

        try {
            let seriesId: number = this.routerService.params.getInteger("series_id");
            this.series = await this.seriesService.getSeries(seriesId);
            if (!this.series) {
                this.routerService.navigateBack();
                return;
            }
        } catch {
            this.routerService.navigateBack();
            return;
        }

        await Promise.allSettled([
            this.fetchService.getSeasons(this.series).then(seasons => this.availableSeasons.push(...seasons)),
            this.seasonService.getSeasons(this.series.series_id).then(seasons => this.existingSeasons.push(...seasons))
        ]);

        this.isPreLoading = false;
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public onRowClick(seasonNumber: number, resetAvailable: boolean, resetExisting: boolean): void {
        if (resetAvailable) {
            this.allAvailableSelected = false;
        }
        if (resetExisting) {
            this.allExistingSelected = false;
        }

        let idx: number = this.selectedSeasons.findIndex(season => season == seasonNumber);

        if (idx == -1) {
            this.selectedSeasons.push(seasonNumber);
            return;
        }

        this.selectedSeasons.splice(idx, 1);
    }

    public onAllAvailableRowClick(): void {
        if (this.allAvailableSelected) {
            this.allAvailableSelected = false;

            for (const season of this.nonExistingSeasons) {
                let idx: number = this.selectedSeasons.findIndex(s => s == season.season_number);

                if (idx == -1) {
                    continue;
                }

                this.selectedSeasons.splice(idx, 1);
            }

            return;
        }

        this.allAvailableSelected = true;

        for (const season of this.nonExistingSeasons) {
            if (this.selectedSeasons.includes(season.season_number)) {
                continue;
            }

            this.selectedSeasons.push(season.season_number);
        }
    }

    public onAllExistingRowClick(): void {
        if (this.allExistingSelected) {
            this.allExistingSelected = false;

            for (const season of this.existingSeasons) {
                let idx: number = this.selectedSeasons.findIndex(s => s == season.season_number);

                if (idx == -1) {
                    continue;
                }

                this.selectedSeasons.splice(idx, 1);
            }

            return;
        }

        this.allExistingSelected = true;

        for (const season of this.existingSeasons) {
            if (this.selectedSeasons.includes(season.season_number)) {
                continue;
            }

            this.selectedSeasons.push(season.season_number);
        }
    }

    public async onStartSyncBtn(): Promise<void> {
        if (!this.series) {
            return;
        }

        this.isSyncing = true;
        this.syncProgress = 0;
        let completed: number = 0;

        for (const season of this.selectedSeasons) {
            this.syncStatus = `Syncing Season ${season == 0 ? "Filme" : season}...`;

            const existingSeason: SeasonModel | undefined = this.existingSeasons.find(s => s.season_number == season);
            const episodes: EpisodeFetchModel[] = await this.fetchService.getEpisodes(this.series.guid, season);
            if (existingSeason) {
                await this.syncExistingSeason(existingSeason, episodes);
            } else {
                await this.syncNewSeason(this.series.series_id, season, episodes);
            }

            completed++;
            this.syncProgress = (completed / this.selectedSeasons.length) * 100;
        }

        await this.routerService.replaceTo(StreamViewModel, {
            series_id: this.series.series_id
        });
    }

    private async syncExistingSeason(season: SeasonModel, episodes: EpisodeFetchModel[]): Promise<void> {
        const existingEpisodes: EpisodeModel[] = await this.episodeService.getEpisodes(season.season_id);

        for (const episode of episodes) {
            const existingEpisode: EpisodeModel | undefined = existingEpisodes.find(e => e.episode_number == episode.episode_number);
            if (existingEpisode) {
                await this.episodeService.updateEpisodeMetadata(
                    existingEpisode.episode_id,
                    episode.german_title,
                    episode.english_title,
                    episode.description
                );
                continue;
            }

            await this.episodeService.insertEpisode(
                season.season_id,
                episode.episode_number,
                episode.german_title,
                episode.english_title,
                episode.description
            );
        }
    }

    private async syncNewSeason(seriesId: number, seasonNumber: number, episodes: EpisodeFetchModel[]): Promise<void> {
        const season: SeasonModel = await this.seasonService.insertSeason(seriesId, seasonNumber);

        for (const episode of episodes) {
            await this.episodeService.insertEpisode(
                season.season_id,
                episode.episode_number,
                episode.german_title,
                episode.english_title,
                episode.description
            );
        }
    }
}

export class SeriesSyncViewClientModel extends SeriesSyncViewModel {
    public static readonly component: Component = SeriesSyncClientView;

    private readonly routerService: RouterService;

    private readonly fetchService: FetchService;
    private readonly seriesService: SeriesService;
    private readonly seasonService: SeasonService;

    private refreshInterval: NodeJS.Timeout | null = null;
    
    private series: SeriesModel | null = this.ref(null);
    private syncInformation: SyncInformation | null = this.ref(null);

    public isPreLoading: boolean = this.ref(true);

    public requiresSync: boolean = this.computed(() => !!this.syncInformation && this.syncInformation.requiresSync);
    public isQueued: boolean = this.computed(() => this.syncInformation?.status === SyncStatus.Queued);
    public isProcessing: boolean = this.computed(() => this.syncInformation?.status === SyncStatus.Processing);
    
    public canSync: boolean = this.computed(() => !this.isQueued && !this.isProcessing);
    
    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);

        this.fetchService = this.ctx.getService(FetchService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.seasonService = this.ctx.getService(SeasonService);

        this.series = null;
    }

    protected async mounted(): Promise<void> {
        this.isPreLoading = true;

        let seriesId: number | null = this.routerService.params.getIntegerOrDefault("series_id");
        if (!seriesId) {
            this.routerService.navigateBack();
            return;
        }

        this.series = await this.seriesService.getSeries(seriesId);
        if (!this.series) {
            this.routerService.navigateBack();
            return;
        }

        this.syncInformation = await this.seasonService.getSyncStatus(seriesId);

        this.isPreLoading = false;
        
        if (!this.refreshInterval) {
            this.refreshInterval = setInterval(async () => {
                if (!this.series) {
                    return;
                }
                this.syncInformation = await this.seasonService.getSyncStatus(this.series.series_id)
            }, 10_000);
            
        }
    }
    
    protected async unmounted() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);   
            this.refreshInterval = null;        
        }
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public async onSyncRequestBtn(): Promise<void> {
        if (!this.series) {
            return;
        }
        await this.fetchService.startRemoteSyncing(this.series.series_id);
        this.syncInformation = await this.seasonService.getSyncStatus(this.series.series_id);
    }
}