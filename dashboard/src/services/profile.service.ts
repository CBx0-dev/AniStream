import type {ReadableGlobalContext} from "vue-mvvm";

import {ProfileService} from "@contracts/profile.service";
import {ApiService} from "@contracts/api.service";

import type {ServiceDeclaration} from "@services/shared";

import type {
    ProfileCreateModel,
    ProfileEye,
    ProfileModel,
    ProfileMouth,
    ProfileUpdateModel
} from "@models/profile.model";

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

    public async logout(): Promise<void> {
        await this.apiService.get(["api", "credentials", "logout"]);
    }

    public async getProfiles(): Promise<ProfileModel[]> {
        return await this.apiService.get<ProfileModel[]>(["api", "profiles"]);
    }

    public async updateProfile(
        profileId: number,
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: "de" | "en",
        tosAccepted: boolean,
        dashboardUser: boolean,
        clientUser: boolean
    ): Promise<void> {
        await this.apiService.put<ProfileModel, ProfileUpdateModel>(["api", "profiles", profileId], {
            name,
            background_color: backgroundColor,
            eye,
            mouth,
            theme,
            lang: local,
            tos_accepted: tosAccepted,
            dashboard_user: dashboardUser,
            client_user: clientUser
        });
    }

    public async createProfile(
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: "de" | "en",
        password: string,
        dashboardUser: boolean,
        clientUser: boolean
    ): Promise<ProfileModel> {
        return await this.apiService.post<ProfileModel, ProfileCreateModel>(["api", "profiles"], {
            name,
            background_color: backgroundColor,
            eye,
            mouth,
            theme,
            lang: local,
            password,
            dashboard_user: dashboardUser,
            client_user: clientUser
        });
    }
    
    public async deleteProfile(profileId: number): Promise<void> {
        await this.apiService.delete(["api", "profiles", profileId]);
    }
}

export default {
    key: ProfileService,
    ctor: ProfileServiceImpl
} satisfies ServiceDeclaration<ProfileService>;