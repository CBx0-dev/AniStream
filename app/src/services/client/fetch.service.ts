import {ServiceDeclaration} from "@services/declaration";

import {FetchService, Provider} from "@contracts/fetch.contract";

import {EpisodeFetchModel} from "@models/episode.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel} from "@models/season.model";
import {SeriesFetchModel, SeriesModel} from "@models/series.model";

import {DefaultProvider} from "@providers/default";

import {UnsupportedPlatformError} from "@utils/error";

class FetchServiceImpl implements FetchService {
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

    getProviders(_guid: string, _seasonNumber: number, _episodeNumber: number, _provider?: DefaultProvider | null): Promise<Provider[]> {
        throw new UnsupportedPlatformError("FetchServiceImpl.getProviders");
    }
}

export default {
    key: FetchService,
    ctor: FetchServiceImpl
} satisfies ServiceDeclaration<FetchService>;