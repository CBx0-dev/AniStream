import {UserServiceImpl} from "@services/user.service";
import {ProfileModel} from "@models/profile.model";

export class UserServiceMock extends UserServiceImpl {
    public async getActiveProfile(): Promise<ProfileModel> {
        return ProfileModel(
            1,
            "11111111-1111-1111-1111-111111111111",
            "Migration",
            "FFFFFF",
            "eva",
            "bite",
            "aniworld-dark",
            "en",
            "true",
            "false"
        );
    }

    public async getActiveProfileOrDefault(): Promise<ProfileModel | null> {
        return ProfileModel(
            1,
            "11111111-1111-1111-1111-111111111111",
            "Migration",
            "FFFFFF",
            "eva",
            "bite",
            "aniworld-dark",
            "en",
            "true",
            "false"
        );
    }

    public async getMigrationProfile(): Promise<ProfileModel> {
        return ProfileModel(
            1,
            "11111111-1111-1111-1111-111111111111",
            "Migration",
            "FFFFFF",
            "eva",
            "bite",
            "aniworld-dark",
            "en",
            "true",
            "false"
        );

    }
}