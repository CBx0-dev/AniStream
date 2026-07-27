import {ServiceKey} from "vue-mvvm";

export interface CatalogService {
    requestSync(): Promise<void>;
}

export const CatalogService: ServiceKey<CatalogService> = new ServiceKey<CatalogService>("catalog.service");