import {Component} from "vue";
import {ViewModel} from "vue-mvvm";
import {RouteAdapter} from "vue-mvvm/router";

import ProfileView from "@views/ProfileView.vue";

import {UserService} from "@services/user.service";
import {ProfileModel} from "@models/profile.model";

export class ProfileViewModel extends ViewModel {
    public static readonly component: Component = ProfileView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly userService: UserService;

    public showProfileSetupForm: boolean = this.ref(false);
    public profiles: ProfileModel[] = this.ref([]);

    public constructor() {
        super();

        this.userService = this.ctx.getService(UserService);
    }

    protected async mounted(): Promise<void> {
        this.showProfileSetupForm = await this.userService.requiresProfileSetup();

        if (!this.showProfileSetupForm) {
            this.profiles = await this.userService.getProfiles();
        }
    }

    public getProfilePicture(profile: ProfileModel): string {
        return this.userService.getAvatarSvgOfProfile(profile);
    }

    public onNewProfileBtn(): void {
        this.showProfileSetupForm = true;
    }
}