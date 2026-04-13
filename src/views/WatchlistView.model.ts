import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";
import {DialogService} from "vue-mvvm/dialog";

import WatchlistView from "@views/WatchlistView.vue";

import {DetailControlModel} from "@controls/DetailControl.model";

import {ProviderService} from "@contracts/provider.contract";
import {SeriesService} from "@contracts/series.contract";
import {WatchlistService} from "@contracts/watchlist.contract";
import {ListService} from "@contracts/list.contract";

import {SeriesModel} from "@models/series.model";
import {ListModel} from "@models/list.model";

import {DefaultProvider} from "@providers/default";

export class WatchlistViewModel extends ViewModel {
    public static readonly component: Component = WatchlistView;
    public static readonly route: RouteAdapter = {
        path: "/watchlist"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;

    private readonly providerService: ProviderService;
    private readonly seriesService: SeriesService;
    private readonly watchlistService: WatchlistService;
    private readonly listService: ListService;

    private customListHashes: Map<number, string[]> = this.ref(new Map<number, string[]>());

    public providerFolder: string | null = this.ref(null);
    public startedSeries: SeriesModel[] = this.ref([]);
    public watchlistSeries: SeriesModel[] = this.ref([]);
    public customLists: ListModel[] = this.ref([]);

    public everythingEmpty: boolean = this.computed(() => this.startedSeries.length == 0 && this.watchlistSeries.length == 0)

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);

        this.providerService = this.ctx.getService(ProviderService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.watchlistService = this.ctx.getService(WatchlistService);
        this.listService = this.ctx.getService(ListService);
    }

    protected async mounted(): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        this.providerFolder = await provider.getStorageLocation();

        this.startedSeries = await this.seriesService.getStartedSeries();

        const seriesIdsOnWatchlist: number[] = await this.watchlistService.getSeriesIds();
        this.watchlistSeries = await this.seriesService.getSeriesByIds(seriesIdsOnWatchlist);

        this.customLists = await this.listService.getLists();

        await Promise.all([this.customLists.map(async list => {
            const hashes: string[] = await this.listService.getPreviewHashes(list.list_id);
            this.customListHashes.set(list.list_id, hashes);
        })]);
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public async onCardClick(series: SeriesModel): Promise<void> {
        if (!this.providerFolder) {
            return;
        }

        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel, this.providerFolder, series);
        await dialog.openDialog();
    }

    public getCustomListPreviewHashes(list: ListModel): string[] | null {
        const hashes: string[] | undefined = this.customListHashes.get(list.list_id);
        if (!hashes) {
            return null;
        }

        return hashes;
    }
}