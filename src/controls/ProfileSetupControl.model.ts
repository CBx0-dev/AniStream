import {Action, ActionContext, UserControl} from "vue-mvvm";

import {ProfileEye, ProfileModel, ProfileMouth} from "@models/profile.model";

import {UserService} from "@contracts/user.contract";
import {SettingsService} from "@contracts/settings.contract";
import {I18nService, SupportedLocals} from "@contracts/i18n.contract";

export class ProfileSetupControlModel extends UserControl implements Action<ProfileModel> {
    public static readonly EYES: ProfileEye[] = ["bulging", "dizzy", "eva", "frame1", "frame2", "glow", "happy", "round", "roundFrame01", "roundFrame02", "sensor", "shade01"];
    public static readonly MOUTHS: ProfileMouth[] = ["bite", "grill01", "grill02", "grill03", "smile01", "smile02", "square01", "square02"];

    private readonly userService: UserService;
    private readonly settingsService: SettingsService;
    private readonly i18nService: I18nService;

    private actionCtx: ActionContext<ProfileModel> | null = null;

    private existingProfile: ProfileModel | null = this.ref(null);

    private backgroundColorValue: string = this.computed(() => this.backgroundColor.substring(1));

    public name: string = this.ref("");
    public backgroundColor: string = this.ref("#afec9f");
    public initialBackgroundColor: string = this.ref("#afec9f")
    public eye: ProfileEye = this.ref("frame1");
    public mouth: ProfileMouth = this.ref("smile01");
    public theme: string = this.ref("aniworld-light");
    public local: SupportedLocals = this.ref("en");

    public isCreation: boolean = this.computed(() => !this.existingProfile);
    public avatarSvg: string = this.computed(() => this.userService.getAvatarSvg(this.backgroundColorValue, this.eye, this.mouth));

    public getAvatarWithEye(eye: ProfileEye): string {
        return this.userService.getAvatarSvg(this.backgroundColorValue, eye, this.mouth);
    }

    public getAvatarWithMouth(mouth: ProfileMouth): string {
        return this.userService.getAvatarSvg(this.backgroundColorValue, this.eye, mouth);
    }

    public constructor() {
        super();

        this.userService = this.ctx.getService(UserService);
        this.settingsService = this.ctx.getService(SettingsService);
        this.i18nService = this.ctx.getService(I18nService);
    }

    protected async mounted(): Promise<void> {
        this.theme = await this.settingsService.getTheme();
        this.local = await this.settingsService.getLocal();
    }

    public onAction(ctx: ActionContext<ProfileModel>): void {
        if (this.actionCtx) {
            ctx.failAction("Action is already running");
            return;
        }

        this.actionCtx = ctx;
    }

    public setEditMode(profile: ProfileModel): void {
        this.existingProfile = profile;
        this.name = profile.name;
        this.backgroundColor = `#${profile.background_color}`;
        this.initialBackgroundColor = `#${profile.background_color}`
        this.eye = profile.eye;
        this.mouth = profile.mouth;
        this.theme = profile.theme;
        this.local = profile.lang;
    }

    public async onCreateOrEditProfileBtn(): Promise<void> {
        if (!this.name || !this.actionCtx) {
            return;
        }

        if (!this.existingProfile) {
            const profile: ProfileModel = await this.userService.createProfile(
                this.name,
                this.backgroundColorValue,
                this.eye,
                this.mouth,
                this.theme,
                this.local
            );

            this.actionCtx.completeAction(profile);
            this.actionCtx = null;
            return;
        }

        await this.userService.updateProfile(
            this.existingProfile.profile_id,
            this.name,
            this.backgroundColorValue,
            this.eye,
            this.mouth,
            this.theme,
            this.local,
            this.existingProfile.tos_accepted
        );

        this.existingProfile.name = this.name;
        this.existingProfile.background_color = this.backgroundColorValue;
        this.existingProfile.eye = this.eye;
        this.existingProfile.mouth = this.mouth;
        this.existingProfile.theme = this.theme;
        this.existingProfile.lang = this.local;

        this.actionCtx.completeAction(this.existingProfile);
    }

    public onCancelBtn(): void {
        if (!this.actionCtx) {
            return;
        }
        this.actionCtx.failAction("Form was cancelled");
        this.actionCtx = null;
    }

    public onEyeItem(eye: ProfileEye): void {
        this.eye = eye;
    }

    public onMouthItem(mouth: ProfileMouth): void {
        this.mouth = mouth;
    }

    public onAniworldLightThemeBtn(): void {
        this.theme = "aniworld-light";
        this.settingsService.setThemeSession("aniworld-light");
    }

    public onAniworldDarkThemeBtn(): void {
        this.theme = "aniworld-dark";
        this.settingsService.setThemeSession("aniworld-dark");
    }

    public onStoLightThemeBtn(): void {
        this.theme = "sto-light";
        this.settingsService.setThemeSession("sto-light");
    }

    public onStoDarkThemeBtn(): void {
        this.theme = "sto-dark";
        this.settingsService.setThemeSession("sto-dark");
    }

    public onEnLocalBtn(): void {
        this.local = "en";
        this.settingsService.setLocalSession("en");
    }

    public onDeLocalBtn(): void {
        this.local = "de";
        this.settingsService.setLocalSession("de");
    }

    public i18n(key: readonly [string, readonly string[]], ...args: any[]): string {
        return this.i18nService.get(key, ...args);
    }
}
