import type {botttsNeutral} from "@dicebear/collection";

export type ProfileEye = NonNullable<botttsNeutral.Options["eyes"]>[0];
export type ProfileMouth = NonNullable<botttsNeutral.Options["mouth"]>[0];

export interface ProfileDbModel {
    profile_id: number;
    uuid: string;
    name: string;
    background_color: string;
    eye: ProfileEye;
    mouth: ProfileMouth;
    theme: string;
    lang: string;
    tos_accepted: boolean;
}

export interface ProfileModel extends ProfileDbModel {
    clone(): ProfileModel;
}

export function ProfileModel(
    uuid: string,
    name: string,
    backgroundColor: string,
    eye: ProfileEye,
    mouth: ProfileMouth,
    theme: string,
    lang: string,
    tosAccepted: boolean
): ProfileModel;
export function ProfileModel(
    profile_id: number,
    uuid: string,
    name: string,
    backgroundColor: string,
    eye: ProfileEye,
    mouth: ProfileMouth,
    theme: string,
    lang: string,
    tosAccepted: boolean
): ProfileModel;

export function ProfileModel(...args: unknown[]): ProfileModel {
    if (args.length == 8) {
        args.unshift(0);
    }

    return _ProfileModel(...args as [number, string, string, string, ProfileEye, ProfileMouth, string, string, boolean]);
}

function _ProfileModel(
    profile_id: number,
    uuid: string,
    name: string,
    backgroundColor: string,
    eye: ProfileEye,
    mouth: ProfileMouth,
    theme: string,
    lang: string,
    tosAccepted: boolean
): ProfileModel {
    const obj: ProfileModel = {
        profile_id: profile_id,
        uuid: uuid,
        name: name,
        background_color: backgroundColor,
        eye: eye,
        mouth: mouth,
        theme: theme,
        lang: lang,
        tos_accepted: tosAccepted,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: ProfileModel): ProfileModel {
    const obj: ProfileModel = {
        profile_id: this.profile_id,
        uuid: this.uuid,
        name: this.name,
        background_color: this.background_color,
        eye: this.eye,
        mouth: this.mouth,
        theme: this.theme,
        lang: this.lang,
        tos_accepted: this.tos_accepted,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}