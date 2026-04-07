import {ServiceKey} from "vue-mvvm";

import type {AniWorldProvider} from "@providers/aniworld";
import type {StoProvider} from "@providers/sto";
import type {DefaultProvider} from "@providers/default";

import type {DbSession} from "@services/utils/db";

import {ProfileModel} from "@models/profile.model";

export interface ProviderService {
    get ANIWORLD(): AniWorldProvider;
    get STO(): StoProvider;

    get ALL_PROVIDERS(): DefaultProvider[];

    getProvider(): Promise<DefaultProvider>;

    getDatabase(): Promise<DbSession>;

    setProvider(provider: DefaultProvider): Promise<void>;

    deleteProfile(profile: ProfileModel): Promise<void>;
}

export const ProviderService: ServiceKey<ProviderService> = new ServiceKey<ProviderService>("provider.service");