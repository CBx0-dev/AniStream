import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter, RouterService} from "vue-mvvm/router";
import {DialogService} from "vue-mvvm/dialog";

import WatchlistView from "@views/WatchlistView.vue";

import {DetailControlModel} from "@controls/DetailControl.model";

import {SeriesService} from "@contracts/series.contract";
import {WatchlistService} from "@contracts/watchlist.contract";
import {ListService} from "@contracts/list.contract";
import {I18nService} from "@contracts/i18n.contract";
import {ResourceService} from "@contracts/resource.contract";

import {SeriesModel} from "@models/series.model";
import {ListModel} from "@models/list.model";

import {ListViewModel} from "@views/ListView.model";

import I18n from "@utils/i18n";

export class WatchlistViewModel extends ViewModel {
    public static readonly component: Component = WatchlistView;
    public static readonly route: RouteAdapter = {
        path: "/watchlist"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;

    private readonly resourceService: ResourceService;
    private readonly seriesService: SeriesService;
    private readonly watchlistService: WatchlistService;
    private readonly listService: ListService;
    private readonly i18nService: I18nService;

    private customListHashes: Map<number, string[]> = this.ref(new Map<number, string[]>());

    public providerFolder: string | null = this.ref(null);
    public startedSeries: SeriesModel[] = this.ref([]);
    public watchlistSeries: SeriesModel[] = this.ref([]);
    public customLists: ListModel[] = this.ref([]);

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);

        this.resourceService = this.ctx.getService(ResourceService);
        this.seriesService = this.ctx.getService(SeriesService);
        this.watchlistService = this.ctx.getService(WatchlistService);
        this.listService = this.ctx.getService(ListService);
        this.i18nService = this.ctx.getService(I18nService);
    }

    protected async mounted(): Promise<void> {
        this.providerFolder = await this.resourceService.getResourceLocation();

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

    public async onSeriesCardClick(series: SeriesModel): Promise<void> {
        if (!this.providerFolder) {
            return;
        }

        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel, this.providerFolder, series);
        await dialog.openDialog();
    }

    public async onListCardClick(list: ListModel): Promise<void> {
        await this.routerService.navigateTo(ListViewModel, {
            id: list.list_id
        });
    }

    public async onListCreateCardClick(): Promise<void> {
        const name: string = this.i18nService.get(I18n.WatchlistView.personal.newList);

        const list: ListModel = await this.listService.createList(name);
        await this.onListCardClick(list);
    }

    public getCustomListPreviewHashes(list: ListModel): string[] | null {
        const hashes: string[] | undefined = this.customListHashes.get(list.list_id);
        if (!hashes) {
            return null;
        }

        return hashes;
    }
}