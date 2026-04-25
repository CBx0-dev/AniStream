import {ReadableGlobalContext} from "vue-mvvm";

import {ApiServiceBase} from "@services/utils/api";
import {ServiceDeclaration} from "@services/declaration";

import {SeriesService} from "@contracts/series.contract";
import {ProviderService} from "@contracts/provider.contract";

import {SeriesDbModel, SeriesModel} from "@/models/series.model";

import {DefaultProvider} from "@providers/default";
import {HTTPError} from "@utils/http";

interface SeriesFilterModel {
    limit: number;
    offset: number;
    genre_ids: number[] | null;
    search_text: string | null;
}

class SeriesServiceImpl extends ApiServiceBase implements SeriesService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public requiresSync(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async existByGUID(guid: string): Promise<boolean> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            await this.get(["api", provider.uniqueKey, "series", "guid", guid]);
            return true;
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return false;
            }

            throw e;
        }
    }

    public async insertSeries(_guid: string, _title: string, _description: string, _previewImage: string | null): Promise<SeriesModel> {
        throw new Error("Method not implemented.");
    }

    public async getSeriesChunk(offset: number, limit: number): Promise<SeriesModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const series: SeriesDbModel[] = await this.post<SeriesDbModel[], SeriesFilterModel>(["api", provider.uniqueKey, "series"], {
            offset: offset,
            limit: limit,
            genre_ids: null,
            search_text: null
        });

        return series.map(series => SeriesModel(
            series.series_id,
            series.guid,
            series.title,
            series.description,
            series.preview_image
        ));
    }

    public async getFilteredSeriesChunk(offset: number, limit: number, searchText: string, genresIds: number[]): Promise<SeriesModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const series: SeriesDbModel[] = await this.post<SeriesDbModel[], SeriesFilterModel>(["api", provider.uniqueKey, "series"], {
            offset: offset,
            limit: limit,
            genre_ids: genresIds,
            search_text: searchText
        });

        return series.map(series => SeriesModel(
            series.series_id,
            series.guid,
            series.title,
            series.description,
            series.preview_image
        ));
    }

    public async getSeries(seriesId: number): Promise<SeriesModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            const series: SeriesDbModel = await this.get(["api", provider.uniqueKey, "series", seriesId]);

            return SeriesModel(
                series.series_id,
                series.guid,
                series.title,
                series.description,
                series.preview_image
            );
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async getStartedSeries(): Promise<SeriesModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const series: SeriesDbModel[] = await this.get<SeriesDbModel[]>(["api", provider.uniqueKey, "series", "started"]);

        return series.map(series => SeriesModel(
            series.series_id,
            series.guid,
            series.title,
            series.description,
            series.preview_image
        ));
    }

    public async getSeriesByIds(seriesIds: number[]): Promise<SeriesModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const series: SeriesDbModel[] = await this.get<SeriesDbModel[]>({
            path: ["api", provider.uniqueKey, "series"],
            query: {
                seriesIds: seriesIds
            }
        });

        return series.map(series => SeriesModel(
            series.series_id,
            series.guid,
            series.title,
            series.description,
            series.preview_image
        ));
    }
}

export default {
    key: SeriesService,
    ctor: SeriesServiceImpl
} satisfies ServiceDeclaration<SeriesService>;