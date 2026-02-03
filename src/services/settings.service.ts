import {readonly, ref, Ref} from "vue";
import {I18nService} from "@services/i18n.service";
import {ReadableGlobalContext} from "vue-mvvm";

export class SettingsService {
    private static readonly THEME_KEY: string = "theme";
    private static readonly LANG_KEY: string = "lang";
    private static readonly TOS_KEY: string = "tos-accepted";

    private readonly i18nService: I18nService;

    private _theme: Ref<string> = ref("");
    private _lang: Ref<string> = ref("");
    private _tosAccepted: Ref<boolean> = ref(false);

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

    public constructor(ctx: ReadableGlobalContext) {
        this.i18nService = ctx.getService(I18nService);

        this.theme = this.loadFromStorage(SettingsService.THEME_KEY, "aniworld-light");
        this.lang = this.loadFromStorage(SettingsService.LANG_KEY, "en");
        this.tosAccepted = this.loadFromStorage(SettingsService.TOS_KEY, "false") == "true";
    }

    public getImageVariant(name: string, extension: string): string {
        return `/${name}/${this.theme.value}.${extension}`
    }

    private loadFromStorage(key: string, defaultValue: string): string {
        return localStorage.getItem(key) ?? defaultValue;
    }
}