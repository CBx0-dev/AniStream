import {ServiceKey} from "vue-mvvm";

import {DbSession} from "@services/utils/db";

export interface MetadataDbService {
    openDB(file: string, provider: string): Promise<DbSession>;
}

export const MetadataDbService: ServiceKey<MetadataDbService> = new ServiceKey<MetadataDbService>("metadata.db.service");