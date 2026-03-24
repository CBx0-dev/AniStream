import {ReadableGlobalContext} from "vue-mvvm";
import {readonly, ref, Ref} from "vue";

import {I18nService} from "@services/i18n.service";

export class SettingsService {
    private static readonly THEME_KEY: string = "theme";
    private static readonly LANG_KEY: string = "lang";
    private static readonly TOS_KEY: string = "tos-accepted";
    private static readonly IGNORE_VERSION_KEY: string = "ignore-version";
    private static readonly UPDATES_ACTIVE_KEY: string = "updates-active";
    private static readonly HEALTHZ_KEY: string = "healthz";

    private readonly i18nService: I18nService;

    private _theme: Ref<string> = ref("");
    private _lang: Ref<string> = ref("");
    private _tosAccepted: Ref<boolean> = ref(false);
    private _ignoreVersion: Ref<string> = ref("");
    private _updatesActive: Ref<boolean> = ref(false);
    private _healthz: Ref<string> = ref("");

    public get theme(): Readonly<Ref<string>> {
        return readonly(this._theme);
    }

    public set theme(v: string) {
        this._theme.value = v;
        localStorage.setItem(SettingsService.THEME_KEY, v);
        document.documentElement.setAttribute("data-theme", v);
    }

    public get lang(): Readonly<Ref<string>> {
        return readonly(this._lang);
    }

    public set lang(v: string) {
        this._lang.value = v;
        localStorage.setItem(SettingsService.LANG_KEY, v);
        this.i18nService.setLocal(v);
    }

    public get tosAccepted(): Readonly<Ref<boolean>> {
        return readonly(this._tosAccepted);
    }

    public set tosAccepted(v: boolean) {
        this._tosAccepted.value = v;
        localStorage.setItem(SettingsService.TOS_KEY, v ? "true" : "false");
    }

    public get ignoreVersion(): Readonly<Ref<string>> {
        return readonly(this._ignoreVersion);
    }

    public set ignoreVersion(v: string) {
        this._ignoreVersion.value = v;
        localStorage.setItem(SettingsService.IGNORE_VERSION_KEY, v);
    }

    public get updatesActive(): Readonly<Ref<boolean>> {
        return readonly(this._updatesActive);
    }

    public set updatesActive(v: boolean) {
        this._updatesActive.value = v;
        localStorage.setItem(SettingsService.UPDATES_ACTIVE_KEY, v ? "true" : "false");
    }

    public get healthz(): Readonly<Ref<string>> {
        return readonly(this._healthz);
    }

    public set healthz(v: string) {
        this._healthz.value = v;
        localStorage.setItem(SettingsService.HEALTHZ_KEY, v);
    }

    public constructor(ctx: ReadableGlobalContext) {
        this.i18nService = ctx.getService(I18nService);

        this.theme = this.loadFromStorage(SettingsService.THEME_KEY, "aniworld-light");
        this.lang = this.loadFromStorage(SettingsService.LANG_KEY, "en");
        this.tosAccepted = this.loadFromStorage(SettingsService.TOS_KEY, "false") == "true";
        this.ignoreVersion = this.loadFromStorage(SettingsService.IGNORE_VERSION_KEY, "0.0.0");
        this.updatesActive = this.loadFromStorage(SettingsService.UPDATES_ACTIVE_KEY, "true") == "true";
        this.healthz = this.loadFromStorage(SettingsService.HEALTHZ_KEY, "https://www.google.com/generate_204");
    }

    public getImageVariant(name: string, extension: string): string {
        return `/${name}/${this.theme.value}.${extension}`
    }

    private loadFromStorage(key: string, defaultValue: string): string {
        return localStorage.getItem(key) ?? defaultValue;
    }
}