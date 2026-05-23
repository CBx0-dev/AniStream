import {ReadableGlobalContext} from "vue-mvvm";

import * as dicebear from "@dicebear/core";
import {botttsNeutral} from "@dicebear/collection";

import {ApiServiceBase} from "@services/utils/api";
import {ServiceDeclaration} from "@services/declaration";

import {UserService} from "@contracts/user.contract";
import {SupportedLocals} from "@contracts/i18n.contract";
import {SettingsService} from "@contracts/settings.contract";

import {
    ProfileCreateModel,
    ProfileDbModel,
    ProfileEye,
    ProfileModel,
    ProfileMouth,
    ProfileUpdateModel
} from "@models/profile.model";

import * as http from "@utils/http";
import {UnsupportedPlatformError} from "@utils/error";

import * as AppEnv from "@AppEnv";

export class UserServiceImpl extends ApiServiceBase implements UserService {
    private static readonly SESSION_KEY: string = "active-profile";

    private readonly ctx: ReadableGlobalContext;

    private activeProfile: ProfileModel | null = null;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.ctx = ctx;
    }

    public async getActiveProfile(): Promise<ProfileModel> {
        const profile: ProfileModel | null = await this.getActiveProfileOrDefault();
        if (profile) {
            return profile;
        }

        throw "No active profile set and no profile was registered in the cache";
    }

    public async setActiveProfile(profile: ProfileModel): Promise<void> {
        this.activeProfile = profile;
        sessionStorage.setItem(UserServiceImpl.SESSION_KEY, profile.uuid);

        // Lazy load to prevent circular dependency
        const settingsService: SettingsService = this.ctx.getService(SettingsService);
        await settingsService.loadProfileSettings();
    }

    public async getActiveProfileOrDefault(): Promise<ProfileModel | null> {
        if (this.activeProfile) {
            return this.activeProfile;
        }

        if (await this.loadCache()) {
            return this.activeProfile!;
        }

        return null;
    }

    public getMigrationProfile(): Promise<ProfileModel> {
        throw new UnsupportedPlatformError("UserServiceImpl.getMigrationProfile");
    }

    public async getProfiles(): Promise<ProfileModel[]> {
        const rows: ProfileDbModel[] = await this.get<ProfileDbModel[]>(["api", "profiles"]);

        return rows.map(row => ProfileModel(
            row.profile_id,
            row.uuid,
            row.name,
            row.background_color,
            row.eye,
            row.mouth,
            row.theme,
            row.lang,
            row.tos_accepted,
            row.sync_catalog
        ));
    }

    public async getProfileByUUID(uuid: string): Promise<ProfileModel | null> {
        try {
            const row: ProfileDbModel = await this.get<ProfileDbModel>(["api", "profiles", uuid, "uuid"]);

            return ProfileModel(
                row.profile_id,
                row.uuid,
                row.name,
                row.background_color,
                row.eye,
                row.mouth,
                row.theme,
                row.lang,
                row.tos_accepted,
                row.sync_catalog
            );
        } catch (e) {
            console.log(e);
            if (e instanceof http.HTTPError && e.status == 404) {
                return null;
            }
            throw e;
        }
    }

    public async requiresProfileSetup(): Promise<boolean> {
        return false;
    }

    public async createProfile(
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: SupportedLocals
    ): Promise<ProfileModel> {
        if (!AppEnv.isTesting) {
            throw new UnsupportedPlatformError("UserServiceImpl.createProfile");
        }

        const row: ProfileDbModel = await this.post<ProfileDbModel, ProfileCreateModel>(["api", "profiles"], {
            name,
            background_color: backgroundColor,
            eye,
            mouth,
            theme,
            lang: local
        });

        return ProfileModel(
            row.profile_id,
            row.uuid,
            row.name,
            row.background_color,
            row.eye,
            row.mouth,
            row.theme,
            row.lang,
            row.tos_accepted,
            row.sync_catalog
        );
    }

    public async updateProfile(
        profileId: number,
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: SupportedLocals,
        tosAccepted: boolean,
        _syncCatalog: boolean
    ): Promise<void> {
        await this.put<object, ProfileUpdateModel>(["api", "profiles", profileId], {
            name,
            background_color: backgroundColor,
            eye,
            mouth,
            theme,
            lang: local,
            tos_accepted: tosAccepted
        });
    }

    public deleteProfile(_profile: ProfileModel): Promise<void> {
        throw new UnsupportedPlatformError("UserServiceImpl.deleteProfile");
    }

    public getAvatarSvg(backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth): string {
        const result: dicebear.Result = dicebear.createAvatar(botttsNeutral, {
            backgroundColor: [backgroundColor],
            eyes: [eye],
            mouth: [mouth]
        });

        return result.toDataUri();
    }

    public getAvatarSvgOfProfile(profile: ProfileModel): string {
        return this.getAvatarSvg(profile.background_color, profile.eye, profile.mouth);
    }

    private async loadCache(): Promise<boolean> {
        let value: string | null = sessionStorage.getItem(UserServiceImpl.SESSION_KEY);
        if (!value) {
            return false;
        }

        this.activeProfile = await this.getProfileByUUID(value);
        if (this.activeProfile) {
            // Lazy load to prevent circilar dependency
            const settingsService: SettingsService = this.ctx.getService(SettingsService);
            await settingsService.loadProfileSettings();

            return true;
        }

        return false;
    }
}

export default {
    key: UserService,
    ctor: UserServiceImpl
} satisfies ServiceDeclaration<UserService>;