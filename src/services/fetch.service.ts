import {ReadableGlobalContext} from "vue-mvvm";

import {ProviderService} from "@services/provider.service";

import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";

import {DefaultProvider, EpisodeLanguage, IInformationFetcher} from "@providers/default";

export interface Provider {
    name: string;
    language: EpisodeLanguage;
    embeddedURL: string;
}

export class FetchService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        this.providerService = ctx.getService(ProviderService);
    }

    public async getCatalog(): Promise<string[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getCatalog();
    }

    public async getSeries(guid: string): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getSeries(guid);
    }

    public async getSeasons(series: SeriesModel): Promise<SeasonFetchModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getSeasons(series);
    }

    public async getEpisodes(guid: string, seasonNumber: number): Promise<EpisodeFetchModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.getEpisodes(guid, seasonNumber);
    }

    public async fetchProviders(guid: string, seasonNumber: number, episodeNumber: number): Promise<Provider[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const fetcher: IInformationFetcher = provider.getFetcher();

        return await fetcher.fetchProviders(guid, seasonNumber, episodeNumber);
    }
}