import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";
import {ApiServiceBase} from "@services/utils/api";

import {ListService} from "@contracts/list.contract";
import {ProviderService} from "@contracts/provider.contract";

import {SeriesDbModel, SeriesModel} from "@models/series.model";
import {ListCreateModel, ListDbModel, ListModel} from "@models/list.model";

import {DefaultProvider} from "@providers/default";

import {HTTPError} from "@utils/http";

class ListServiceImpl extends ApiServiceBase implements ListService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public async getLists(): Promise<ListModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const lists: ListDbModel[] = await this.get<ListDbModel[]>(["api", provider.uniqueKey, "lists"]);

        return lists.map(list => ListModel(
            list.list_id,
            list.name,
            list.tenant_id
        ));
    }

    public async getList(listId: number): Promise<ListModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            const list: ListDbModel = await this.get<ListDbModel>(["api", provider.uniqueKey, "lists", listId]);

            return ListModel(
                list.list_id,
                list.name,
                list.tenant_id
            );
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async createList(name: string): Promise<ListModel> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const list: ListDbModel = await this.post<ListDbModel, ListCreateModel>(["api", provider.uniqueKey, "lists"], {
            name
        });

        return ListModel(
            list.list_id,
            list.name,
            list.tenant_id
        );
    }

    public async updateList(listId: number, name: string): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.put<ListDbModel, ListCreateModel>(["api", provider.uniqueKey, "lists", listId], {
            name
        });
    }

    public async deleteList(listId: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.delete<{}>(["api", provider.uniqueKey, "lists", listId]);
    }

    public async getListsOfSeries(seriesId: number): Promise<ListModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const lists: ListDbModel[] = await this.get<ListDbModel[]>(["api", provider.uniqueKey, "lists", "series", seriesId]);

        return lists.map(list => ListModel(
            list.list_id,
            list.name,
            list.tenant_id
        ));
    }

    public async getSeries(listId: number): Promise<SeriesModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const series: SeriesDbModel[] = await this.get<SeriesDbModel[]>(["api", provider.uniqueKey, "lists", listId, "series"]);

        return series.map(series => SeriesModel(
            series.series_id,
            series.guid,
            series.title,
            series.description,
            series.preview_image
        ));
    }

    public async addSeriesToList(seriesId: number, listId: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.post<{}, null>(["api", provider.uniqueKey, "lists", listId, "series", seriesId], null);
    }

    public async removeSeriesFromList(seriesId: number, listId: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.delete<{}>(["api", provider.uniqueKey, "lists", listId, "series", seriesId]);
    }

    public async getPreviewHashes(listId: number): Promise<string[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        return await this.get<string[]>(["api", provider.uniqueKey, "lists", listId, "preview"]);
    }
}

export default {
    key: ListService,
    ctor: ListServiceImpl
} satisfies ServiceDeclaration<ListService>