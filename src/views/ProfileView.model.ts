import {Component, nextTick} from "vue";
import {ActionResult, ViewModel} from "vue-mvvm";
import {RouteAdapter} from "vue-mvvm/router";

import ProfileView from "@views/ProfileView.vue";

import {UserService} from "@services/user.service";

import type {ProfileModel} from "@models/profile.model";

import {ProfileSetupControlModel} from "@controls/ProfileSetupControl.model";

export class ProfileViewModel extends ViewModel {
    public static readonly component: Component = ProfileView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly userService: UserService;

    private readonly profileSetupControl: ProfileSetupControlModel | null;

    public showProfileSetupForm: boolean = this.ref(false);
    public profiles: ProfileModel[] = this.ref([]);

    public constructor() {
        super();

        this.userService = this.ctx.getService(UserService);

        this.profileSetupControl = this.getUserControl("profile-setup-control");
    }

    protected async mounted(): Promise<void> {
        this.showProfileSetupForm = await this.userService.requiresProfileSetup();

        if (!this.showProfileSetupForm) {
            this.profiles = await this.userService.getProfiles();
            return;
        }

        await nextTick();
        if (this.profileSetupControl) {
            const result: ActionResult<ProfileModel> = await this.runAction(this.profileSetupControl);
            if (!result.success) {
                throw result.error;
            }

            this.profiles.push(result.data);
            this.showProfileSetupForm = false;
        }
    }

    public getProfilePicture(profile: ProfileModel): string {
        return this.userService.getAvatarSvgOfProfile(profile);
    }

    public onNewProfileBtn(): void {
        this.showProfileSetupForm = true;
    }
}