import {path} from "@tauri-apps/api"
import * as fs from "@tauri-apps/plugin-fs";

import {ReadableGlobalContext} from "vue-mvvm";

import {DbService, DbSession} from "@services/db.service";

export enum EpisodeLanguage {
    DE_DUB,
    DE_SUP,
    EN_DUB,
    EN_SUP,
    UNKNOWN
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
            return `${this.seasonURL(guid,  seasonNumber)}/film-${episodeNumber}`;
        }

        return `${this.seasonURL(guid,  seasonNumber)}/episode-${episodeNumber}`;
    }

    public abstract getStorageLocation(): Promise<string>;

    public abstract encodeLanguageNumber(id: number): EpisodeLanguage;

}

export class AniWorldProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "aniworld";
    public readonly baseURL: string = "https://aniworld.to";

    public get uniqueKey(): string {
        return AniWorldProvider.UNIQUE_KEY;
    }

    public get catalogURL(): string {
        return `${this.baseURL}/animes-alphabet`;
    }

    public get streamURLBase(): string {
        return `${this.baseURL}/anime/stream`;
    }

    public constructor(service: DbService) {
        super(service);
    }

    public async getStorageLocation(): Promise<string> {
        const appDir: string = await path.appDataDir();
        const dataDir: string = await path.join(appDir, "aniworld");

        if (!await fs.exists(dataDir)) {
            await fs.mkdir(dataDir, {
                recursive: true
            });
        }


        return dataDir;
    }

    public encodeLanguageNumber(id: number): EpisodeLanguage {
        switch (id) {
            case 1:
                return EpisodeLanguage.DE_DUB;
            case 2:
                return EpisodeLanguage.EN_SUP
            case 3:
                return EpisodeLanguage.DE_SUP;
            default:
                return EpisodeLanguage.UNKNOWN;
        }
    }
}

export class StoProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "sto";
    public readonly baseURL: string = "http://186.2.175.5";

    public get uniqueKey(): string {
        return StoProvider.UNIQUE_KEY;

    }

    public get catalogURL(): string {
        return `${this.baseURL}/serien-alphabet`;
    }

    public get streamURLBase(): string {
        return `${this.baseURL}/serie/stream`;
    }

    public constructor(service: DbService) {
        super(service);
    }

    public async getStorageLocation(): Promise<string> {
        const appDir: string = await path.appDataDir();
        const dataDir: string = await path.join(appDir, "sto");

        if (!await fs.exists(dataDir)) {
            await fs.mkdir(dataDir, {
                recursive: true
            });
        }

        return dataDir;
    }

    public encodeLanguageNumber(id: number): EpisodeLanguage {
        switch (id) {
            case 1:
                return EpisodeLanguage.DE_DUB;
            case 2:
                return EpisodeLanguage.EN_DUB
            default:
                return EpisodeLanguage.UNKNOWN;
        }
    }
}

export class ProviderService {
    public readonly ANIWORLD: AniWorldProvider;
    public readonly STO: StoProvider;
    private static readonly SESSION_KEY: string = "active-provider";

    private provider: DefaultProvider | null = null;

    public constructor(ctx: ReadableGlobalContext) {
        let dbService: DbService = ctx.getService(DbService);

        this.ANIWORLD = new AniWorldProvider(dbService);
        this.STO = new StoProvider(dbService);

        this.provider = null;
    }

    public async getProvider(): Promise<DefaultProvider> {
        if (this.provider) {
            return this.provider;
        }

        if (await this.loadCache()) {
            return this.provider!;
        }

        throw "No provider set and no provider was registered in the cache";
    }

    public async getDatabase(): Promise<DbSession> {
        const provider: DefaultProvider = await this.getProvider();
        return await provider.getDatabase();
    }

    public async setProvider(provider: DefaultProvider): Promise<void> {
        if (this.provider) {
            await this.provider.closeDatabase();
        }
        this.provider = provider;

        sessionStorage.setItem(ProviderService.SESSION_KEY, provider.uniqueKey);
    }

    private getProviderFromUniqueKey(key: string): DefaultProvider | null {
        switch (key) {
            case AniWorldProvider.UNIQUE_KEY:
                return this.ANIWORLD;
            case StoProvider.UNIQUE_KEY:
                return this.STO;
        }

        return null;
    }

    private async loadCache(): Promise<boolean> {
        let value: string | null = sessionStorage.getItem(ProviderService.SESSION_KEY);
        if (!value) {
            return false;
        }

        this.provider = this.getProviderFromUniqueKey(value);

        return !!this.provider;
    }
}
