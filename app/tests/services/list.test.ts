import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {ListService} from "@contracts/list.contract";
import {SeriesService} from "@contracts/series.contract";

import type {ListModel} from "@models/list.model";
import type {SeriesModel} from "@models/series.model";

class ListTests extends TestBase {
    private get listService(): ListService {
        return this.getService(ListService);
    }

    private get seriesService(): SeriesService {
        return this.getService(SeriesService);
    }

    private async getLists() {
        await this.listService.createList("watchlist");
        await this.listService.createList("favorites");

        const lists: ListModel[] = await this.listService.getLists();

        expect(lists).toHaveLength(2);
        const names = lists.map(l => l.name);
        expect(names).toContain("watchlist");
        expect(names).toContain("favorites");
    }

    private async getList() {
        const created: ListModel = await this.listService.createList("watchlist");

        const list: ListModel | null = await this.listService.getList(created.list_id);

        expect(list).not.toBeNull();
        expect(list!.list_id).toBe(created.list_id);
        expect(list!.name).toBe("watchlist");
    }

    private async getListsOfSeries() {
        const series = await this.createSeries();
        const list1: ListModel = await this.listService.createList("list1");
        const list2: ListModel = await this.listService.createList("list2");

        await this.listService.addSeriesToList(series.series_id, list1.list_id);
        await this.listService.addSeriesToList(series.series_id, list2.list_id);

        const lists: ListModel[] = await this.listService.getListsOfSeries(series.series_id);

        expect(lists).toHaveLength(2);
        const names = lists.map(l => l.name);
        expect(names).toContain("list1");
        expect(names).toContain("list2");
    }

    private async createList() {
        const list: ListModel = await this.listService.createList("watchlist");

        expect(list.list_id).toBe(1);
        expect(list.name).toBe("watchlist");
    }

    private async updateList() {
        const created: ListModel = await this.listService.createList("watchlist");

        await this.listService.updateList(created.list_id, "updated");

        const fetched: ListModel | null = await this.listService.getList(created.list_id);
        expect(fetched!.name).toBe("updated");
    }

    private async updateListByModel() {
        const created: ListModel = await this.listService.createList("watchlist");

        await this.listService.updateList(created.list_id, "updated");

        const fetched: ListModel | null = await this.listService.getList(created.list_id);
        expect(fetched!.name).toBe("updated");
    }

    private async deleteList() {
        const created: ListModel = await this.listService.createList("watchlist");

        await this.listService.deleteList(created.list_id);

        const list: ListModel | null = await this.listService.getList(created.list_id);
        expect(list).toBeNull();
    }

    private async deleteListByModel() {
        const created: ListModel = await this.listService.createList("watchlist");

        await this.listService.deleteList(created.list_id);

        const list: ListModel | null = await this.listService.getList(created.list_id);
        expect(list).toBeNull();
    }

    private async getSeriesInList() {
        const list: ListModel = await this.listService.createList("watchlist");
        const series = await this.createSeries();
        await this.listService.addSeriesToList(series.series_id, list.list_id);

        const seriesInList: SeriesModel[] = await this.listService.getSeries(list.list_id);

        expect(seriesInList).toHaveLength(1);
        expect(seriesInList[0].series_id).toBe(series.series_id);
    }

    private async removeSeriesFromList() {
        const list: ListModel = await this.listService.createList("watchlist");
        const series = await this.createSeries();
        await this.listService.addSeriesToList(series.series_id, list.list_id);

        await this.listService.removeSeriesFromList(series.series_id, list.list_id);

        const seriesInList: SeriesModel[] = await this.listService.getSeries(list.list_id);
        expect(seriesInList).toHaveLength(0);
    }

    private async removeSeriesFromListByModel() {
        const list: ListModel = await this.listService.createList("watchlist");
        const series = await this.createSeries();
        await this.listService.addSeriesToList(series.series_id, list.list_id);

        await this.listService.removeSeriesFromList(series.series_id, list.list_id);

        const seriesInList: SeriesModel[] = await this.listService.getSeries(list.list_id);
        expect(seriesInList).toHaveLength(0);
    }

    private async getPreviewHashes() {
        const list: ListModel = await this.listService.createList("watchlist");
        const series = await this.createSeries();
        await this.listService.addSeriesToList(series.series_id, list.list_id);

        const images: string[] = await this.listService.getPreviewHashes(list.list_id);

        expect(images).toHaveLength(1);
        expect(images[0]).toBe("ABCDEFG");
    }

    private async getPreviewHashesByModel() {
        const list: ListModel = await this.listService.createList("watchlist");
        const series = await this.createSeries();
        await this.listService.addSeriesToList(series.series_id, list.list_id);

        const images: string[] = await this.listService.getPreviewHashes(list.list_id);

        expect(images).toHaveLength(1);
        expect(images[0]).toBe("ABCDEFG");
    }

    private async createSeries(): Promise<SeriesModel> {
        const series: SeriesModel = await this.seriesService.insertSeries("guid", "Title", "Desc", "ABCDEFG");
        expect(series.series_id).toBeGreaterThan(0);
        return series;
    }

    public getTests(): TestDefinition[] {
        return [
            ["GetLists", this.getLists],
            ["GetList", this.getList],
            ["GetListsOfSeries", this.getListsOfSeries],
            ["CreateList", this.createList],
            ["UpdateList", this.updateList],
            ["UpdateListByModel", this.updateListByModel],
            ["DeleteList", this.deleteList],
            ["DeleteListByModel", this.deleteListByModel],
            ["GetSeriesInList", this.getSeriesInList],
            ["RemoveSeriesFromList", this.removeSeriesFromList],
            ["RemoveSeriesFromListByModel", this.removeSeriesFromListByModel],
            ["GetPreviewHashes", this.getPreviewHashes],
            ["GetPreviewHashesByModel", this.getPreviewHashesByModel]
        ];
    }
}

TestBase.register(ListTests);
