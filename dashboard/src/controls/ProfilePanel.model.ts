import {type ActionResult, UserControl} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";

import * as dicebear from "@dicebear/core";
import {botttsNeutral} from "@dicebear/collection";

import {ProfileService} from "@contracts/profile.service";

import type {ProfileModel} from "@models/profile.model";

import {ProfileDialogModel} from "@controls/ProfileDialog.model";

interface SelectOption {
    value: string;
    label: string;
}

export class ProfilePanelModel extends UserControl {
    private readonly dialogService: DialogService;

    private readonly profileService: ProfileService;

    public readonly themeOptions: SelectOption[] = this.readonly([
        {value: "aniworld-light", label: "Aniworld Light"},
        {value: "aniworld-dark", label: "Aniworld Dark"},
        {value: "sto-light", label: "STO Light"},
        {value: "sto-dark", label: "STO Dark"}
    ]);

    public readonly langOptions: SelectOption[] = this.readonly([
        {value: "en", label: "English"},
        {value: "de", label: "German"}
    ]);

    public search: string = this.ref("");

    private profiles: ProfileModel[] = this.ref([]);

    public readonly filtered: ProfileModel[] = this.computed(() => {
        const term: string = this.search.trim().toLowerCase();
        if (term.length === 0) {
            return this.profiles;
        }

        return this.profiles.filter(profile => profile.name.toLowerCase().includes(term));
    });

    public readonly total: number = this.computed(() => this.profiles.length);
    public readonly dashboardUsers: number = this.computed(() => this.profiles.filter(profile => profile.dashboard_user).length);

    public constructor() {
        super();

        this.dialogService = this.ctx.getService(DialogService);

        this.profileService = this.ctx.getService(ProfileService);
    }

    protected async mounted(): Promise<void> {
        this.profiles = await this.profileService.getProfiles();
    }

    public getAvatar(profile: ProfileModel): string {
        const result: dicebear.Result = dicebear.createAvatar(botttsNeutral, {
            backgroundColor: [profile.background_color],
            eyes: [profile.eye],
            mouth: [profile.mouth]
        });

        return result.toDataUri();
    }

    public getThemeLabel(theme: string): string {
        switch (theme) {
            case "aniworld-dark":
                return "Aniworld Dark";
            case "aniworld-light":
                return "Aniworld Light";
            case "sto-dark":
                return "STO Dark";
            case "sto-light":
                return "STO Light";
            default:
                return "N/A";
        }
    }

    public getLocalLabel(local: string): string {
        switch (local) {
            case "en":
                return "English";
            case "de":
                return "German";
            default:
                return "N/A";
        }
    }

    public async onCreateBtn(): Promise<void> {
        using dialog: ProfileDialogModel = this.dialogService.initDialog(ProfileDialogModel, null);

        await dialog.openDialog();
        const result: ActionResult<ProfileModel> = await this.runAction(dialog);

        await dialog.closeDialog();

        if (!result.success) {
            console.error(result.error);
            return;
        }

        this.profiles.push(result.data);
    }

    public async openEdit(profile: ProfileModel): Promise<void> {
        using dialog: ProfileDialogModel = this.dialogService.initDialog(ProfileDialogModel, profile);

        await dialog.openDialog();
        const result: ActionResult<ProfileModel> = await this.runAction(dialog);

        await dialog.closeDialog();

        if (!result.success) {
            console.error(result.error);
            return;
        }
    }

    public async onRemoveBtn(profile: ProfileModel): Promise<void> {
        profile;
    }
}
