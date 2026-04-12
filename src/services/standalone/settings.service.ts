import {ReadableGlobalContext} from "vue-mvvm";
import {readonly, ref, Ref} from "vue";

import {SettingsService} from "@contracts/settings.contract";
import {I18nService, SupportedLocals} from "@contracts/i18n.contract";
import {UserService} from "@contracts/user.contract";

import {ServiceDeclaration} from "@services/declaration";

import {ProfileModel} from "@models/profile.model";

class SettingsServiceImpl implements SettingsService {
    private static readonly IGNORE_VERSION_KEY: string = "ignore-version";
    private static readonly UPDATES_ACTIVE_KEY: string = "updates-active";
    private static readonly HEALTHZ_KEY: string = "healthz";

    private readonly i18nService: I18nService;
    private readonly userService: UserService;

    private _ignoreVersion: Ref<string> = ref("");
    private _updatesActive: Ref<boolean> = ref(false);
    private _healthz: Ref<string> = ref("");

    public get ignoreVersion(): Readonly<Ref<string>> {
        return readonly(this._ignoreVersion);
    }

    public set ignoreVersion(v: string) {
        this._ignoreVersion.value = v;
        localStorage.setItem(SettingsServiceImpl.IGNORE_VERSION_KEY, v);
    }

    public get updatesActive(): Readonly<Ref<boolean>> {
        return readonly(this._updatesActive);
    }

    public set updatesActive(v: boolean) {
        this._updatesActive.value = v;
        localStorage.setItem(SettingsServiceImpl.UPDATES_ACTIVE_KEY, v ? "true" : "false");
    }

    public get healthz(): Readonly<Ref<string>> {
        return readonly(this._healthz);
    }

    public set healthz(v: string) {
        this._healthz.value = v;
        localStorage.setItem(SettingsServiceImpl.HEALTHZ_KEY, v);
    }

    public constructor(ctx: ReadableGlobalContext) {
        this.i18nService = ctx.getService(I18nService);
        this.userService = ctx.getService(UserService);

        this.ignoreVersion = this.loadFromStorage(SettingsServiceImpl.IGNORE_VERSION_KEY, "0.0.0");
        this.updatesActive = this.loadFromStorage(SettingsServiceImpl.UPDATES_ACTIVE_KEY, "true") == "true";
        this.healthz = this.loadFromStorage(SettingsServiceImpl.HEALTHZ_KEY, "https://www.google.com/generate_204");

        this.setThemeSession(this.getDefaultTheme());
        this.setLocalSession(this.getDefaultLocal());
    }

    public async setTheme(theme: string): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        profile.theme = theme;
        this.setThemeSession(theme);
        await this.updateProfile(profile);
    }

    public setThemeSession(theme: string): void {
        document.documentElement.setAttribute("data-theme", theme);
    }

    public getDefaultTheme(): string {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "aniworld-dark"
            : "aniworld-light";
    }

    public async getTheme(): Promise<string> {
        const profile: ProfileModel | null = await this.userService.getActiveProfileOrDefault();
        if (!profile) {
            return this.getDefaultTheme();
        }

        return profile.theme;
    }

    public async setLocal(local: SupportedLocals): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        profile.lang = local;
        this.setLocalSession(local);
        await this.updateProfile(profile);
    }

    public setLocalSession(local: SupportedLocals): void {
        this.i18nService.setLocal(local);
    }

    public getDefaultLocal(): SupportedLocals {
        const lang: string = window.navigator.language;
        if (lang != "en" && lang != "de") {
            return "en";
        }

        return lang;
    }

    public async getLocal(): Promise<SupportedLocals> {
        const profile: ProfileModel | null = await this.userService.getActiveProfileOrDefault();
        if (!profile) {
            return this.getDefaultLocal();
        }

        return profile.lang;
    }

    public async setTosAccepted(value: boolean): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        profile.tos_accepted = value;
        await this.updateProfile(profile);
    }

    public async isTosAccepted(): Promise<boolean> {
        const profile: ProfileModel = await this.userService.getActiveProfile()
        return profile.tos_accepted;
    }

    public async getAutoSyncCatalog(): Promise<boolean> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        return profile.sync_catalog;
    }

    public async setAutoSyncCatalog(sync: boolean): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        profile.sync_catalog = sync;
        await this.updateProfile(profile);
    }

    public async getImageVariant(name: string, extension: string): Promise<string> {
        return `/${name}/${await this.getTheme()}.${extension}`
    }

    public async loadProfileSettings(): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        this.setLocalSession(profile.lang);
        this.setThemeSession(profile.theme);
    }

    private async updateProfile(profile: ProfileModel): Promise<void> {
        await this.userService.updateProfile(
            profile.profile_id,
            profile.name,
            profile.background_color,
            profile.eye,
            profile.mouth,
            profile.theme,
            profile.lang,
            profile.tos_accepted,
            profile.sync_catalog
        );
    }

    private loadFromStorage(key: string, defaultValue: string): string {
        return localStorage.getItem(key) ?? defaultValue;
    }
}

export default {
    key: SettingsService,
    ctor: SettingsServiceImpl
} satisfies ServiceDeclaration<SettingsService>;