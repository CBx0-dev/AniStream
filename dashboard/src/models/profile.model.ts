import type {botttsNeutral} from "@dicebear/collection";

export type ProfileEye = NonNullable<botttsNeutral.Options["eyes"]>[0];
export type ProfileMouth = NonNullable<botttsNeutral.Options["mouth"]>[0];

export type SupportedLocals = "de" | "en";

export interface ProfileModel {
    profile_id: number;
    uuid: string;
    name: string;
    background_color: string;
    eye: ProfileEye;
    mouth: ProfileMouth;
    theme: string;
    lang: SupportedLocals;
    tos_accepted: boolean;
    dashboard_user: boolean;
    client_user: boolean;
}

export interface ProfileUpdateModel {
    name: string;
    background_color: string;
    eye: ProfileEye;
    mouth: ProfileMouth;
    theme: string;
    lang: "de" | "en";
    tos_accepted: boolean;
    dashboard_user: boolean;
    client_user: boolean;
}


export interface ProfileCreateModel {
    name: string;
    background_color: string;
    eye: ProfileEye;
    mouth: ProfileMouth;
    theme: string;
    lang: "de" | "en";
    password: string;
    dashboard_user: boolean;
    client_user: boolean;
}