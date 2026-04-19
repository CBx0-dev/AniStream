import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";
import {RouteAdapter, RouterService} from "vue-mvvm/router";
import {AlertService} from "vue-mvvm/alert";

import ListView from "@views/ListView.vue";

import {DetailControlModel} from "@controls/DetailControl.model";

import {ListService} from "@contracts/list.contract";
import {ProviderService} from "@contracts/provider.contract";
import {I18nService} from "@contracts/i18n.contract";

import {ListModel} from "@models/list.model";
import {SeriesModel} from "@models/series.model";

import {DefaultProvider} from "@providers/default";

import I18n from "@utils/i18n";

export class ListViewModel extends ViewModel {
    public static readonly component: Component = ListView;
    public static readonly route = {
        path: "/watchlist/:id",
        params: {
            id: "integer"
        }
    } satisfies RouteAdapter;

    private routerService: RouterService;
    private dialogService: DialogService;
    private alertService: AlertService;

    private providerService: ProviderService;
    private listService: ListService;
    private i18nService: I18nService;

    private list: ListModel | null = this.ref(null);

    public providerFolder: string | null = this.ref(null);
    public series: SeriesModel[] = this.ref([]);
    public editTitle: boolean = this.ref(false);

    public title: string = this.computed({
        get: () => this.list?.name ?? "",
        set: v => {
            if (!this.list) {
                return;
            }

            this.list.name = v;
        }
    });

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);
        this.alertService = this.ctx.getService(AlertService);

        this.providerService = this.ctx.getService(ProviderService);
        this.listService = this.ctx.getService(ListService);
        this.i18nService = this.ctx.getService(I18nService);
    }

    protected async mounted(): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        this.providerFolder = await provider.getStorageLocation();

        const listId: number = this.routerService.params.getIntegerOrThrow("id");

        this.list = await this.listService.getList(listId);
        if (!this.list) {
            throw `Cannot find list with ID '${listId}'`;
        }

        this.series = await this.listService.getSeries(listId);
    }

    public onBackBtn(): void {
        this.routerService.navigateBack();
    }

    public onTitleEditBtn(): void {
        this.editTitle = true;
    }

    public async onDeleteBtn(): Promise<void> {
        if (!this.list) {
            return;
        }

        if (!await this.alertService.showConfirm({
            title: this.i18nService.get(I18n.ListView.confirm.title),
            description: this.i18nService.get(I18n.ListView.confirm.description)
        })) {
            return;
        }

        await this.listService.deleteList(this.list.list_id);
        this.routerService.navigateBack();
    }

    public async onTitleSaveBtn(): Promise<void> {
        if (!this.list) {
            return;
        }

        await this.listService.updateList(this.list.list_id, this.list.name);
        this.editTitle = false;
    }

    public async onCardClick(series: SeriesModel): Promise<void> {
        if (!this.providerFolder) {
            return;
        }

        const dialog: DetailControlModel = this.dialogService.initDialog(DetailControlModel, this.providerFolder, series);
        await dialog.openDialog();
    }
}