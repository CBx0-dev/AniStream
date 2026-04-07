import {ServiceKey} from "vue-mvvm";

import type {ProfileEye, ProfileModel, ProfileMouth} from "@models/profile.model";

import type {SupportedLocals} from "@contracts/i18n.contract";

export interface UserService {
    getActiveProfile(): Promise<ProfileModel>;

    setActiveProfile(profile: ProfileModel): Promise<void>;

    getActiveProfileOrDefault(): Promise<ProfileModel | null>;

    getMigrationProfile(): Promise<ProfileModel>;

    getProfiles(): Promise<ProfileModel[]>;

    getProfileByUUID(uuid: string): Promise<ProfileModel | null>;

    requiresProfileSetup(): Promise<boolean>;

    createProfile(
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: SupportedLocals
    ): Promise<ProfileModel>;

    updateProfile(
        profileId: number,
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: SupportedLocals,
        tosAccepted: boolean
    ): Promise<void>;

    deleteProfile(profile: ProfileModel): Promise<void>;

    getAvatarSvg(backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth): string;

    getAvatarSvgOfProfile(profile: ProfileModel): string;
}

export const UserService: ServiceKey<UserService> = new ServiceKey<UserService>("user.service");