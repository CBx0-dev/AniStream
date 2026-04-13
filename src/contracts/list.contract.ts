import {ServiceKey} from "vue-mvvm";

import {ListModel} from "@models/list.model";
import {SeriesModel} from "@models/series.model";

export interface ListService {
    getLists(): Promise<ListModel[]>;

    createList(name: string): Promise<ListModel>;

    deleteList(listId: number): Promise<void>;

    getSeries(listId: number): Promise<SeriesModel[]>;

    getPreviewHashes(listId: number): Promise<string[]>;
}

export const ListService: ServiceKey<ListService> = new ServiceKey<ListService>("list.service");