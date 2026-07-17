import {ServiceKey} from "vue-mvvm";

import {DbSession} from "@services/utils/db";

import {DefaultProvider} from "@providers/default";

export interface DbService {
    getDatabase(provider: DefaultProvider): Promise<DbSession>;

    closeDatabase(provider: DefaultProvider): Promise<void>;
}

export const DbService: ServiceKey<DbService> = new ServiceKey<DbService>("db.service");
