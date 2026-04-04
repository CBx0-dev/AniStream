import {ActionResult, UserControl} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";
import {ToastService} from "vue-mvvm/toast";

import {SettingsService} from "@services/settings.service";
import {I18nService} from "@services/i18n.service";
import {UserService} from "@services/user.service";

import I18n from "@utils/i18n";
import {ProfileModel} from "@models/profile.model";
import {ProfileDialogModel} from "@controls/ProfileDialog.model";

export class PrefControlModel extends UserControl {
    private readonly dialogService: DialogService;
    private readonly toastService: ToastService;

    private readonly i18nService: I18nService;
    private readonly settingsService: SettingsService;
    private readonly userService: UserService;

    private profile: ProfileModel | null = this.ref(null);

    public activeTheme: string = this.ref("aniworld-light");
    public activeLocal: string = this.ref("en");
    public healthUrl: string = this.ref("");


    public readonly updatesActive: boolean = this.computed(() => this.settingsService.updatesActive.value);
    public avatarSvg: string | null = this.computed(() => {
        if (!this.profile) {
            return null;
        }

        return this.userService.getAvatarSvgOfProfile(this.profile);
    });
    public readonly profileName: string = this.computed(() => this.profile?.name ?? "");

    public constructor() {
        super();

        this.dialogService = this.ctx.getService(DialogService);
        this.toastService = this.ctx.getService(ToastService);

        this.i18nService = this.ctx.getService(I18nService);
        this.settingsService = this.ctx.getService(SettingsService);
        this.userService = this.ctx.getService(UserService);

        this.healthUrl = this.settingsService.healthz.value;
    }

    protected async mounted(): Promise<void> {
        this.activeTheme = await this.settingsService.getTheme();
        this.activeLocal = await this.settingsService.getLocal();

        this.profile = await this.userService.getActiveProfile();
    }

    public async onProfileBtn(): Promise<void> {
        if (!this.profile) {
            return;
        }

        using dialog: ProfileDialogModel = this.dialogService.initDialog(ProfileDialogModel, this.profile);

        await dialog.openDialog();
        const result: ActionResult<ProfileModel> = await this.runAction(dialog);
        if (!result.success) {
            console.error(result.error);
            return;
        }

        this.profile = result.data;
    }

    public async onAniworldLightThemeBtn(): Promise<void> {
        this.activeTheme = "aniworld-light";
        await this.settingsService.setTheme("aniworld-light");
    }

    public async onAniworldDarkThemeBtn(): Promise<void> {
        this.activeTheme = "aniworld-dark";
        await this.settingsService.setTheme("aniworld-dark");
    }

    public async onStoLightThemeBtn(): Promise<void> {
        this.activeTheme = "sto-light";
        await this.settingsService.setTheme("sto-light");
    }

    public async onStoDarkThemeBtn(): Promise<void> {
        this.activeTheme = "sto-dark";
        await this.settingsService.setTheme("sto-dark");
    }

    public async onEnLocalBtn(): Promise<void> {
        this.activeLocal = "en";
        await this.settingsService.setLocal("en");
    }

    public async onDeLocalBtn(): Promise<void> {
        this.activeLocal = "de";
        await this.settingsService.setLocal("de");
    }

    public onUpdatesActiveToggle(): void {
        this.settingsService.updatesActive = !this.settingsService.updatesActive.value;
    }

    public async onHealthUrlChange(): Promise<void> {
        this.settingsService.healthz = this.healthUrl;
        await this.toastService.showInfo({
            type: "info",
            title: this.i18nService.get(I18n.PrefControl.updater.toastTitle),
            description: this.i18nService.get(I18n.PrefControl.updater.toastDescription),
        });
    }
}