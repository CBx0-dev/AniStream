import type {ReadableGlobalContext} from "vue-mvvm";

import {ProfileService} from "@contracts/profile.service";
import {ApiService} from "@contracts/api.service";

import type {ServiceDeclaration} from "@services/shared";

import {HTTPError} from "@utils/http";

class ProfileServiceImpl implements ProfileService {
    private readonly apiService: ApiService;

    public constructor(ctx: ReadableGlobalContext) {
        this.apiService = ctx.getService(ApiService);
    }

    public async login(username: string, password: string): Promise<boolean> {
        try {
            await this.apiService.post(["api", "credentials", "login"], {
                "uuid": username,
                "password": password
            });

            return true;
        } catch (e) {
            if (HTTPError.isHttpError(e) && e.status == 401) {
                return false;
            }

            throw e;
        }
    }
}

export default {
    key: ProfileService,
    ctor: ProfileServiceImpl
} satisfies ServiceDeclaration<ProfileService>;