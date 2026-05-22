import {ServiceKey} from "vue-mvvm";

import type {AniWorldProvider} from "@providers/aniworld";
import type {StoProvider} from "@providers/sto";
import type {DefaultProvider} from "@providers/default";

import {ProfileModel} from "@models/profile.model";

export interface ProviderService {
    get ANIWORLD(): AniWorldProvider;

    get STO(): StoProvider;

    get ALL_PROVIDERS(): DefaultProvider[];

    getProvider(): Promise<DefaultProvider>;

    setProvider(provider: DefaultProvider): Promise<void>;

    deleteProfile(profile: ProfileModel): Promise<void>;
}

export const ProviderService: ServiceKey<ProviderService> = new ServiceKey<ProviderService>("provider.service");