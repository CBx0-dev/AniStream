import {ServiceKey} from "vue-mvvm";

import {DbSession} from "@services/utils/db";

export interface UserDbService {
    openDB(file: string): Promise<DbSession>;
}

export const UserDbService: ServiceKey<UserDbService> = new ServiceKey<UserDbService>("user.db.service");