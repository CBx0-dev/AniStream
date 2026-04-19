import {ServiceKey} from "vue-mvvm";

import {ListModel} from "@models/list.model";
import {SeriesModel} from "@models/series.model";

export interface ListService {
    getLists(): Promise<ListModel[]>;

    getList(listId: number): Promise<ListModel | null>;

    getListsOfSeries(seriesId: number): Promise<ListModel[]>;

    createList(name: string): Promise<ListModel>;

    updateList(listId: number, name: string): Promise<void>;

    deleteList(listId: number): Promise<void>;

    getSeries(listId: number): Promise<SeriesModel[]>;

    addSeriesToList(seriesId: number, listId: number): Promise<void>;

    removeSeriesFromList(seriesId: number, listId: number): Promise<void>;

    getPreviewHashes(listId: number): Promise<string[]>;
}

export const ListService: ServiceKey<ListService> = new ServiceKey<ListService>("list.service");