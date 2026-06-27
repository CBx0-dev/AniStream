import {ReadableGlobalContext} from "vue-mvvm";

import {ApiServiceBase} from "@services/utils/api";
import {ServiceDeclaration} from "@services/declaration";

import {FetchService, Provider} from "@contracts/fetch.contract";
import {ProviderService} from "@contracts/provider.contract";

import {EpisodeFetchModel, EpisodeProviderModel, type EpisodeModel} from "@models/episode.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel, type SeasonModel} from "@models/season.model";
import {SeriesFetchModel, SeriesModel} from "@models/series.model";

import {DefaultProvider} from "@providers/default";

import {UnsupportedPlatformError} from "@utils/error";
import {SyncStatus} from "@contracts/season.contract";

class FetchServiceImpl extends ApiServiceBase implements FetchService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    getCatalog(_provider?: DefaultProvider | null): Promise<string[]> {
        throw new UnsupportedPlatformError("FetchServiceImpl.getCatalog");
    }

    getSeries(_guid: string, _provider?: DefaultProvider | null): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[], previewImage: Uint8Array | null]> {
        throw new UnsupportedPlatformError("FetchServiceImpl.getSeries");
    }

    getSeasons(_series: SeriesModel, _provider?: DefaultProvider | null): Promise<SeasonFetchModel[]> {
        throw new UnsupportedPlatformError("FetchServiceImpl.getSeasons");
    }

    getEpisodes(_guid: string, _seasonNumber: number, _provider?: DefaultProvider | null): Promise<EpisodeFetchModel[]> {
        throw new UnsupportedPlatformError("FetchServiceImpl.getEpisodes");
    }

    async getProviders(_series: SeriesModel, _season: SeasonModel, episode: EpisodeModel, provider?: DefaultProvider | null): Promise<[SyncStatus, Provider[]]> {
        provider ??= await this.providerService.getProvider();

        const res: EpisodeProviderModel = await this.get(["api", provider.uniqueKey, "episodes", episode.episode_id, "providers"]);

        return [res.status, res.providers.map(provider => ({
            name: provider.name,
            language: provider.language_code,
            embeddedURL: provider.url
        }))];
    }

    async startRemoteSyncing(seriesId: number, provider: DefaultProvider | null): Promise<void> {
        provider ??= await this.providerService.getProvider();

        await this.post<object, null>(["api", provider.uniqueKey, "series", seriesId, "sync"], null);
    }
}

export default {
    key: FetchService,
    ctor: FetchServiceImpl
} satisfies ServiceDeclaration<FetchService>;