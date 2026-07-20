import {ServiceKey} from "vue-mvvm";

export interface ProfileService {
    login(username: string, password: string): Promise<boolean>;
}

export const ProfileService: ServiceKey<ProfileService> = new ServiceKey<ProfileService>("profile.service");