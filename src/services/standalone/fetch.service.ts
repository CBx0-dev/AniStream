import {ReadableGlobalContext} from "vue-mvvm";

import {FetchService, Provider} from "@contracts/fetch.contract";
import {ProviderService} from "@contracts/provider.contract";

import {ServiceDeclaration} from "@services/declaration";


import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";

import {DefaultProvider, IInformationFetcher} from "@providers/default";

class FetchServiceImpl implements FetchService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        this.providerService = ctx.getService(ProviderService);
    }

    public async getCatalog(provider: DefaultProvider | null = null): Promise<string[]> {
        provider ??= await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getCatalog();
    }

    public async getSeries(guid: string, provider: DefaultProvider | null = null): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]> {
        provider ??= await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getSeries(guid);
    }

    public async getSeasons(series: SeriesModel, provider: DefaultProvider | null = null): Promise<SeasonFetchModel[]> {
        provider ??= await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getSeasons(series);
    }

    public async getEpisodes(guid: string, seasonNumber: number, provider: DefaultProvider | null = null): Promise<EpisodeFetchModel[]> {
        provider ??= await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getEpisodes(guid, seasonNumber);
    }

    public async getProviders(guid: string, seasonNumber: number, episodeNumber: number, provider: DefaultProvider | null = null): Promise<Provider[]> {
        provider ??= await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.fetchProviders(guid, seasonNumber, episodeNumber);
    }
}

export default {
    key: FetchService,
    ctor: FetchServiceImpl
} satisfies ServiceDeclaration<FetchService>;