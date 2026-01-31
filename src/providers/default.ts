import {path} from "@tauri-apps/api";

import {DbService, DbSession} from "@services/db.service";
import {Provider} from "@services/fetch.service";

import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";
import {GenreFetchModel} from "@models/genre.model";

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

    protected abstract get streamURLBase(): string;

    private readonly service: DbService;
    private session: DbSession | null;

    protected constructor(service: DbService) {
        this.service = service;
        this.session = null;
    }

    public async getDatabase(): Promise<DbSession> {
        if (this.session) {
            return this.session;
        }

        const dataDir: string = await this.getStorageLocation();
        const dbFile: string = await path.join(dataDir, "metadata.db");

        this.session = await this.service.openDB(dbFile, this.uniqueKey);
        return this.session;
    }

    public async closeDatabase(): Promise<void> {
        if (!this.session) {
            return;
        }

        await this.session.close();
    }

    public streamURL(guid: string): string {
        return `${this.streamURLBase}/${guid}`;
    }

    public seasonURL(guid: string, seasonNumber: number): string {
        if (seasonNumber == 0) {
            return `${this.streamURLBase}/${guid}/filme`;
        }

        return `${this.streamURLBase}/${guid}/staffel-${seasonNumber}`;
    }

    public episodeURL(guid: string, seasonNumber: number, episodeNumber: number): string {
        if (seasonNumber == 0) {
            return `${this.seasonURL(guid, seasonNumber)}/film-${episodeNumber}`;
        }

        return `${this.seasonURL(guid, seasonNumber)}/episode-${episodeNumber}`;
    }

    public abstract getStorageLocation(): Promise<string>;

    public abstract encodeLanguageNumber(id: number): EpisodeLanguage;

    public abstract getFetcher(): IInformationFetcher;

}
