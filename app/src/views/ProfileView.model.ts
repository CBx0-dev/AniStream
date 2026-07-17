import {Component, nextTick} from "vue";
import {ActionResult, ViewModel} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";
import {RouteAdapter, RouterService} from "vue-mvvm/router";

import ProfileView from "@views/ProfileView.vue";
import {ProviderViewModel} from "@views/ProviderView.model";

import {SettingsService} from "@contracts/settings.contract";
import {UserService} from "@contracts/user.contract";

import type {ProfileModel} from "@models/profile.model";

import {ProfileSetupControlModel} from "@controls/ProfileSetupControl.model";
import {PinDialogModel} from "@controls/PinDialog.model";

import * as AppEnv from "@AppEnv";

export class ProfileViewModel extends ViewModel {
    public static readonly component: Component = ProfileView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly routerService: RouterService;
    private readonly dialogService: DialogService;

    private readonly settingService: SettingsService;
    private readonly userService: UserService;

    private readonly profileSetupControl: ProfileSetupControlModel | null;

    public isProfileSetupFormCancellable: boolean = this.ref(false);
    public showProfileSetupForm: boolean = this.ref(false);
    public showUrlSetupForm: boolean = this.ref(false);
    public profiles: ProfileModel[] = this.ref([]);

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.dialogService = this.ctx.getService(DialogService);

        this.settingService = this.ctx.getService(SettingsService);
        this.userService = this.ctx.getService(UserService);

        this.profileSetupControl = this.getUserControl("profile-setup-control");
    }

    protected async mounted(): Promise<void> {
        if (AppEnv.isStandaloneMode) {
            this.showProfileSetupForm = await this.userService.requiresProfileSetup();
        }

        if (AppEnv.isClientMode) {
            this.showUrlSetupForm = !this.settingService.serverUrl.value;
            if (this.showUrlSetupForm) {
                return;
            }
        }

        if (!this.showProfileSetupForm) {
            this.profiles = await this.userService.getProfiles();
            return;
        }
        this.isProfileSetupFormCancellable = false;
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

    public async onProfileItem(profile: ProfileModel): Promise<void> {
        if (AppEnv.isClientMode) {
            using dialog: PinDialogModel = this.dialogService.initDialog(PinDialogModel, profile);
            await dialog.openDialog();

            const result: ActionResult<void> = await this.runAction(dialog);

            if (!result.success) {
                return;
            }
        }

        await this.userService.setActiveProfile(profile);

        await this.routerService.navigateTo(ProviderViewModel);
    }

    public getProfilePicture(profile: ProfileModel): string {
        return this.userService.getAvatarSvgOfProfile(profile);
    }

    public async onNewProfileBtn(): Promise<void> {
        this.showProfileSetupForm = true;
        this.isProfileSetupFormCancellable = true;
        await nextTick();

        if (!this.profileSetupControl) {
            throw "Setup form is not loaded";
        }

        const result: ActionResult<ProfileModel> = await this.runAction(this.profileSetupControl);
        this.showProfileSetupForm = false;
        if (!result.success) {
            return;
        }

        this.profiles.push(result.data);
    }
}