import {ProfileModel} from "@models/profile.model";

import {DefaultProvider} from "@providers/default";
import {AniWorldProvider} from "@providers/aniworld";
import {StoProvider} from "@providers/sto";

import {ServiceDeclaration} from "@services/declaration";

import {ProviderService} from "@contracts/provider.contract";

import {UnsupportedPlatformError} from "@utils/error";

import * as AppEnv from "@AppEnv";

export class ProviderServiceImpl implements ProviderService {
    private static readonly SESSION_KEY: string = "active-provider";

    private provider: DefaultProvider | null = null;

    public readonly ANIWORLD: AniWorldProvider;
    public readonly STO: StoProvider;

    public get ALL_PROVIDERS(): DefaultProvider[] {
        return [this.ANIWORLD, this.STO];
    }

    public constructor() {
        this.ANIWORLD = new AniWorldProvider();
        this.STO = new StoProvider();

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

    public async setProvider(provider: DefaultProvider): Promise<void> {
        this.provider = provider;

        if (!AppEnv.isTesting) {
            sessionStorage.setItem(ProviderServiceImpl.SESSION_KEY, provider.uniqueKey);
        }
    }

    public async deleteProfile(_profile: ProfileModel): Promise<void> {
        throw new UnsupportedPlatformError("ProviderServiceImpl.deleteProfile");
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
        if (AppEnv.isTesting) {
            return false;
        }

        let value: string | null = sessionStorage.getItem(ProviderServiceImpl.SESSION_KEY);
        if (!value) {
            return false;
        }

        this.provider = this.getProviderFromUniqueKey(value);

        return !!this.provider;
    }
}

export default {
    key: ProviderService,
    ctor: ProviderServiceImpl
} satisfies ServiceDeclaration<ProviderService>;