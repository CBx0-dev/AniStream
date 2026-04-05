import {ReadableGlobalContext} from "vue-mvvm";

import {DbSession} from "@services/db.service";
import {MetadataDbService} from "@services/db/metadata.db";

import {DefaultProvider} from "@providers/default";
import {AniWorldProvider} from "@providers/aniworld";
import {StoProvider} from "@providers/sto";

import {ProfileModel} from "@models/profile.model";

export class ProviderService {
    private static readonly SESSION_KEY: string = "active-provider";

    private provider: DefaultProvider | null = null;

    public readonly ANIWORLD: AniWorldProvider;
    public readonly STO: StoProvider;

    public get ALL_PROVIDERS(): DefaultProvider[] {
        return [this.ANIWORLD, this.STO];
    }

    public constructor(ctx: ReadableGlobalContext) {
        let dbService: MetadataDbService = ctx.getService(MetadataDbService);

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

    public async deleteProfile(profile: ProfileModel): Promise<void> {
        for (const provider of this.ALL_PROVIDERS) {
            const db: DbSession = await provider.getDatabase();
            // language=SQLite
            await db.execute("DELETE FROM watchlist WHERE tenant_id = ?", profile.uuid);
            // language=SQLite
            await db.execute("DELETE FROM watchtime WHERE tenant_id = ?", profile.uuid);

            await provider.closeDatabase();
        }
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
