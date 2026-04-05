import {Component} from "vue";
import {Action, ActionContext, ActionResult} from "vue-mvvm";
import {DialogControl} from "vue-mvvm/dialog";

import ProfileDialog from "@controls/ProfileDialog.vue";
import {ProfileSetupControlModel} from "@controls/ProfileSetupControl.model";

import {ProfileModel} from "@models/profile.model";

export class ProfileDialogModel extends DialogControl implements Action<ProfileModel> {
    public static readonly component: Component = ProfileDialog;

    private actionCTX: ActionContext<ProfileModel> | null = null;
    private profile: ProfileModel;

    private profileSetupControl: ProfileSetupControlModel | null = null;

    public isOpen: boolean = this.ref(false);

    public constructor(profile: ProfileModel) {
        super();

        this.profile = profile;
    }

    public onAction(ctx: ActionContext<ProfileModel>): void | Promise<void> {
        if (this.actionCTX) {
            ctx.failAction("A action is already running");
            return;
        }

        this.actionCTX = ctx;
    }

    protected beforeMount(): void {
        this.profileSetupControl = this.getUserControl("profile-setup-control");
    }

    protected async mounted(): Promise<void> {
        if (!this.profileSetupControl) {
            return;
        }

        this.profileSetupControl.setEditMode(this.profile);

        const result: ActionResult<ProfileModel> = await this.runAction(this.profileSetupControl);
        if (!this.actionCTX) {
            return;
        }

        if (!result.success) {
            this.actionCTX.failAction(result.error);
            this.actionCTX = null;
            return;
        }

        this.actionCTX.completeAction(result.data);
        this.actionCTX = null;
        return;
    }

    protected onOpen(): void {
        this.isOpen = true;
    }

    protected onClose(): void {
        this.isOpen = false;

        if (this.actionCTX) {
            this.actionCTX.failAction("Modal was closed");
            this.actionCTX = null;
        }
    }
}