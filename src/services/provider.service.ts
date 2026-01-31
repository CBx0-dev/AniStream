import {ReadableGlobalContext} from "vue-mvvm";

import {DbService, DbSession} from "@services/db.service";

import {DefaultProvider} from "@providers/default";
import {AniWorldProvider} from "@providers/aniworld";
import {StoProvider} from "@providers/sto";

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
