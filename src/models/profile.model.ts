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
    tos_accepted: string;
}

export interface ProfileModel extends Omit<ProfileDbModel, "tos_accepted"> {
    tos_accepted: boolean;
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
    tosAccepted: string
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
    tosAccepted: string
): ProfileModel;

export function ProfileModel(...args: unknown[]): ProfileModel {
    if (args.length == 8) {
        args.unshift(0);
    }

    return _ProfileModel(...args as [number, string, string, string, ProfileEye, ProfileMouth, string, string, string]);
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
    tosAccepted: string
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
        tos_accepted: tosAccepted == "true",
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