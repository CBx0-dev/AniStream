import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import SyncView from "@views/SyncView.vue";
import {ProviderViewModel} from "@views/ProviderView.model";
import {SeriesService} from "@services/series.service";
import {FetchService} from "@services/fetch.service";
import {GenreModel} from "@models/genre.model";
import {GenreService} from "@services/genre.service";
import {SeriesModel} from "@models/series.model";

enum SyncViewModelPanel {
    PREPARE,
    SYNCING,
    CONTINUE
}

export class SyncViewModel extends ViewModel {
    public static readonly component: Component = SyncView;
    public static readonly route: RouteAdapter = {
        path: "/sync"
    }

    private readonly routerService: RouterService;
    private readonly fetchService: FetchService;
    private readonly seriesService: SeriesService;
    private readonly genreService: GenreService;
    private panel: SyncViewModelPanel = this.ref(SyncViewModelPanel.PREPARE);

    public isPreparing: boolean = this.computed(() => this.panel == SyncViewModelPanel.PREPARE);
    public isSyncing: boolean = this.computed(() => this.panel == SyncViewModelPanel.SYNCING);
    public isContinue: boolean = this.computed(() => this.panel == SyncViewModelPanel.CONTINUE);
    public processed: number = this.ref(1);
    public totalToProceed: number = this.ref(1);

    public constructor() {
        super();
        this.routerService = this.ctx.getService(RouterService);
        this.fetchService = this.ctx.getService(FetchService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.genreService = this.ctx.getService(GenreService);
    }

    public async onBackBtn(): Promise<void> {
        await this.routerService.navigateTo(ProviderViewModel);
    }

    public async onStartSyncingBtn(): Promise<void> {
        this.processed = 1;
        this.totalToProceed = 1;
        this.panel = SyncViewModelPanel.SYNCING;

        const guids: string[] = await this.fetchService.getCatalog();
        this.totalToProceed = guids.length;

        const workers: number = 4;
        const stream: Generator<string> = this.guidStream(guids);

        await Promise.all(Array.from({length: workers}, () => this.worker(stream)));

        this.panel = SyncViewModelPanel.CONTINUE;
    }


    public onStartWatchingBtn(): void {
        this.routerService.navigateBack();
    }

    private async worker(stream: Generator<string>): Promise<void> {
        while (true) {
            const {value: guid, done} = stream.next();
            if (done || !guid) {
                break;
            }

            try {
                if (!await this.seriesService.existByGUID(guid)) {
                    const [fetchedSeries, fetchedGenres] = await this.fetchService.getSeries(guid);
                    const series: SeriesModel = await this.seriesService.insertSeries(fetchedSeries.guid, fetchedSeries.title, fetchedSeries.description, fetchedSeries.preview_image);
                    await Promise.all(fetchedGenres.map(fetchedGenre => (async (): Promise<void> => {
                        let genre: GenreModel | null = await this.genreService.getGenreByKey(fetchedGenre.key);
                        if (!genre) {
                            genre = await this.genreService.insertGenre(fetchedGenre.key);
                        }

                        await this.genreService.insertGenreToSeries(genre, series, fetchedGenre.main)
                    })()));
                }
            } catch (e) {
                console.error(e);
            }

            this.processed++;
        }
    }

    private* guidStream(guids: string[]): Generator<string> {
        for (const guid of guids) {
            yield guid;
        }
    }
}