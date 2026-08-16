import type {Component} from "vue";
import {type Action, ActionContext} from "vue-mvvm";
import {DialogControl} from "vue-mvvm/dialog";
import * as dicebear from "@dicebear/core";
import {botttsNeutral} from "@dicebear/collection";

import ProfileDialog from "@controls/ProfileDialog.vue";

import {ProfileService} from "@contracts/profile.service";

import type {ProfileEye, ProfileModel, ProfileMouth} from "@models/profile.model";

export class ProfileDialogModel extends DialogControl implements Action<ProfileModel> {
    public static readonly component: Component = ProfileDialog;

    private readonly profileService: ProfileService;

    private actionCtx: ActionContext<ProfileModel> | null = null;

    private readonly existingProfile: ProfileModel | null;

    public password: string = this.ref("");
    public isOpen: boolean = this.ref(false);
    public name: string = this.ref("");
    public backgroundColor: string = this.ref("AD27B0");
    public eye: ProfileEye = this.ref("bulging");
    public mouth: ProfileMouth = this.ref("bite");
    public theme: string = this.ref("aniworld-dark");
    public local: string = this.ref("en");
    public tosAccepted: boolean = this.ref(false);
    public dashboardUser: boolean = this.ref(false);
    public clientUser: boolean = this.ref(false);

    public backgroundColorModel: string = this.computed({
        get: () => `#${this.backgroundColor}`,
        set: value => this.backgroundColor = value.substring(1)
    });

    public readonly title: string = this.computed(() => this.existingProfile ? "Create profile" : "Edit profile");

    public readonly avatar: string = this.computed(() => {
        const result: dicebear.Result = dicebear.createAvatar(botttsNeutral, {
            backgroundColor: [this.backgroundColor],
            eyes: [this.eye],
            mouth: [this.mouth]
        });

        return result.toDataUri();
    });

    public readonly isCreation: boolean = this.computed(() => !this.existingProfile);

    public readonly themes: Array<[string, string]> = this.readonly([
        ["aniworld-dark", "Aniworld Dark"],
        ["aniworld-light", "Aniworld Light"],
        ["sto-dark", "STO Dark"],
        ["sto-light", "STO Light"],
    ]);
    public readonly locals: Array<[string, string]> = this.readonly([
        ["de", "German"],
        ["en", "English"]
    ]);
    public readonly mouths: ProfileMouth[] = this.readonly([
        "bite",
        "diagram",
        "grill01",
        "grill02",
        "grill03",
        "smile01",
        "smile02",
        "square01",
        "square02"
    ]);
    public readonly eyes: ProfileEye[] = this.readonly([
        "bulging",
        "dizzy",
        "eva",
        "frame1",
        "frame2",
        "glow",
        "happy",
        "hearts",
        "robocop",
        "round",
        "roundFrame01",
        "roundFrame02",
        "sensor",
        "shade01"
    ]);

    public constructor(existingProfile: ProfileModel | null) {
        super();

        this.profileService = this.ctx.getService(ProfileService);

        this.existingProfile = existingProfile;

        if (existingProfile) {
            this.name = existingProfile.name;
            this.backgroundColor = existingProfile.background_color;
            this.eye = existingProfile.eye;
            this.mouth = existingProfile.mouth;
            this.theme = existingProfile.theme;
            this.local = existingProfile.lang;
            this.tosAccepted = existingProfile.tos_accepted;
            this.dashboardUser = existingProfile.dashboard_user;
            this.clientUser = existingProfile.client_user;
        }

    }

    protected async onOpen(): Promise<void> {
        this.isOpen = true;
    }

    protected async onClose(): Promise<void> {
        this.isOpen = false;

        if (this.actionCtx) {
            this.actionCtx.failAction("Modal was closed");
            this.actionCtx = null;
        }
    }

    public onAction(ctx: ActionContext<ProfileModel>): void | Promise<void> {
        this.actionCtx = ctx;
    }

    public async onSubmitBtn(): Promise<void> {
        if (!this.actionCtx) {
            return;
        }

        if (this.existingProfile) {
            this.existingProfile.name = this.name;
            this.existingProfile.background_color = this.backgroundColor;
            this.existingProfile.eye = this.eye;
            this.existingProfile.mouth = this.mouth;
            this.existingProfile.theme = this.theme;
            this.existingProfile.lang = this.local as "de" | "en";
            this.existingProfile.tos_accepted = this.tosAccepted;
            this.existingProfile.dashboard_user = this.dashboardUser;
            this.existingProfile.client_user = this.clientUser;

            await this.profileService.updateProfile(
                this.existingProfile.profile_id,
                this.name,
                this.backgroundColor,
                this.eye,
                this.mouth,
                this.theme,
                this.local as "de" | "en",
                this.tosAccepted,
                this.dashboardUser,
                this.clientUser
            );

            this.actionCtx.completeAction(this.existingProfile);
            this.actionCtx = null;
            return;
        }

        const profile: ProfileModel = await this.profileService.createProfile(
            this.name,
            this.backgroundColor,
            this.eye,
            this.mouth,
            this.theme,
            this.local as "de" | "en",
            this.password,
            this.dashboardUser,
            this.clientUser
        );
        this.actionCtx.completeAction(profile);
        this.actionCtx = null;
    }

}