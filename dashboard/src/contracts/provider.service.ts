import {ServiceKey} from "vue-mvvm";

export interface ProviderService {
    getProviders(): Promise<string[]>;
}

export const ProviderService: ServiceKey<ProviderService> = new ServiceKey<ProviderService>("provider.service");