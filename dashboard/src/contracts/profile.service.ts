import {ServiceKey} from "vue-mvvm";

import type {ProfileEye, ProfileModel, ProfileMouth} from "@models/profile.model";

export interface ProfileService {
    login(username: string, password: string): Promise<boolean>;

    logout(): Promise<void>;

    getProfiles(): Promise<ProfileModel[]>;

    updateProfile(
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
    ): Promise<void>;

    createProfile(
        name: string,
        backgroundColor: string,
        eye: ProfileEye,
        mouth: ProfileMouth,
        theme: string,
        local: "de" | "en",
        password: string,
        dashboardUser: boolean,
        clientUser: boolean
    ): Promise<ProfileModel>;
    
    deleteProfile(profileId: number): Promise<void>;
}

export const ProfileService: ServiceKey<ProfileService> = new ServiceKey<ProfileService>("profile.service");