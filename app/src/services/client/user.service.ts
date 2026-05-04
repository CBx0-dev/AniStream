import {ReadableGlobalContext} from "vue-mvvm";

import {ApiServiceBase} from "@services/utils/api";
import {ServiceDeclaration} from "@services/declaration";

import {UserService} from "@contracts/user.contract";
import {SupportedLocals} from "@contracts/i18n.contract";
import {SettingsService} from "@contracts/settings.contract";

import {ProfileModel, ProfileEye, ProfileMouth} from "@models/profile.model";

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
        throw new Error("Method not implemented.");
    }

    public getProfiles(): Promise<ProfileModel[]> {
        throw new Error("Method not implemented.");
    }

    public getProfileByUUID(uuid: string): Promise<ProfileModel | null> {
        throw new Error("Method not implemented.");
    }

    public requiresProfileSetup(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public createProfile(name: string, backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth, theme: string, local: SupportedLocals): Promise<ProfileModel> {
        throw new Error("Method not implemented.");
    }

    public updateProfile(profileId: number, name: string, backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth, theme: string, local: SupportedLocals, tosAccepted: boolean, syncCatalog: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public deleteProfile(profile: ProfileModel): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public getAvatarSvg(backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth): string {
        throw new Error("Method not implemented.");
    }

    public getAvatarSvgOfProfile(profile: ProfileModel): string {
        throw new Error("Method not implemented.");
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