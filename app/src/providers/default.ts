import {Provider} from "@contracts/fetch.contract";

import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";
import {GenreFetchModel} from "@models/genre.model";

import * as path from "@utils/path";

export enum EpisodeLanguage {
    DE_DUB,
    DE_SUP,
    EN_DUB,
    EN_SUP,
    UNKNOWN
}

export interface IInformationFetcher {
    getCatalog(): Promise<string[]>;

    getSeries(guid: string): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]>;

    getSeasons(series: SeriesModel): Promise<SeasonFetchModel[]>;

    getEpisodes(guid: string, seasonNumber: number): Promise<EpisodeFetchModel[]>;

    fetchProviders(guid: string, seasonNumber: number, episodeNumber: number): Promise<Provider[]>;
}


export abstract class DefaultProvider {
    public abstract get baseURL(): string;

    public abstract get uniqueKey(): string;

    public abstract get catalogURL(): string;

    protected constructor() {
    }

    public async getDatabaseFile(): Promise<string> {
        const dataDir: string = await this.getStorageLocation();

        return path.join(dataDir, "metadata.db");
    }

    public abstract streamURL(guid: string): string;

    public abstract seasonURL(guid: string, seasonNumber: number): string;

    public abstract episodeURL(guid: string, seasonNumber: number, episodeNumber: number): string;

    public abstract getStorageLocation(): Promise<string>;

    public abstract encodeLanguageNumber(id: number): EpisodeLanguage;

    public abstract getFetcher(): IInformationFetcher;

}
