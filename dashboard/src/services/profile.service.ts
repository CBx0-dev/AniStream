import {ProfileService} from "@contracts/profile.service";
import type {ServiceDeclaration} from "@services/shared";

class ProfileServiceImpl implements ProfileService {
    public async login(_username: string, _password: string): Promise<boolean> {
        return false;
    }
}

export default {
    key: ProfileService,
    ctor: ProfileServiceImpl
} satisfies ServiceDeclaration<ProfileService>;