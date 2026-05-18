import {Ref} from "vue";
import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";

import {I18nService, SupportedLocals} from "@contracts/i18n.contract";
import {SettingsService} from "@contracts/settings.contract";
import {UserService} from "@contracts/user.contract";

import {ProfileModel} from "@models/profile.model";

export class SettingsServiceImpl implements SettingsService {
    private readonly i18nService: I18nService;
    private readonly userService: UserService;

    public get ignoreVersion(): Readonly<Ref<string, string>> {
        throw new Error("Method not implemented.");
    }

    public set ignoreVersion(_v: Readonly<Ref<string, string>>) {
        throw new Error("Method not implemented.");
    }

    public get updatesActive(): Readonly<Ref<boolean, boolean>> {
        throw new Error("Method not implemented.");
    }

    public set updatesActive(_v: Readonly<Ref<boolean, boolean>>) {
        throw new Error("Method not implemented.");
    }

    public get healthz(): Readonly<Ref<string, string>> {
        throw new Error("Method not implemented.");
    }

    public set healthz(_v: Readonly<Ref<string, string>>) {
        throw new Error("Method not implemented.");
    }

    public constructor(ctx: ReadableGlobalContext) {
        this.i18nService = ctx.getService(I18nService);
        this.userService = ctx.getService(UserService);
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
        const profile: ProfileModel = await this.userService.getActiveProfile();
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
        const profile: ProfileModel = await this.userService.getActiveProfile();
        return profile.tos_accepted;
    }

    public async getAutoSyncCatalog(): Promise<boolean> {
        return false;
    }

    public setAutoSyncCatalog(_sync: boolean): Promise<void> {
        throw new Error("Option is not allowed in client applications");
    }

    public async getImageVariant(name: string, extension: string): Promise<string> {
        return `${name}/${await this.getTheme()}.${extension}`;
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