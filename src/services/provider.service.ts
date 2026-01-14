import {path} from "@tauri-apps/api"
import * as fs from "@tauri-apps/plugin-fs";
import {DbService, DbSession} from "@services/db.service";
import {ReadableGlobalContext} from "vue-mvvm";

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

    public streamURL(guid: string): string {
        return `${this.streamURLBase}/${guid}`;
    }

    public abstract getStorageLocation(): Promise<string>;

}

export class AniWorldProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "aniworld";
    public readonly baseURL: string = "https://aniworld.to";

    public get uniqueKey(): string {
        return AniWorldProvider.UNIQUE_KEY;
    }

    public get streamURLBase(): string {
        return `${this.baseURL}/anime/stream`;
    }

    public get catalogURL(): string {
        return `${this.baseURL}/animes`;
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
}

export class StoProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "sto";
    public readonly baseURL: string = "http://186.2.175.5";

    public get uniqueKey(): string {
        return StoProvider.UNIQUE_KEY;

    }

    public get catalogURL(): string {
        return `${this.baseURL}/serien`;
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
