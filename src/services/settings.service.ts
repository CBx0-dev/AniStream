import {readonly, ref, Ref} from "vue";
import {I18nService} from "@services/i18n.service";
import {ReadableGlobalContext} from "vue-mvvm";

export class SettingsService {
    private static readonly THEME_KEY: string = "theme";
    private static readonly LANG_KEY: string = "lang";

    private readonly i18nService: I18nService;

    private _theme: Ref<string> = ref("");
    private _lang: Ref<string> = ref("");

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

    public constructor(ctx: ReadableGlobalContext) {
        this.i18nService = ctx.getService(I18nService);

        this.theme = this.loadFromStorage(SettingsService.THEME_KEY, "aniworld-light");
        this.lang = this.loadFromStorage(SettingsService.LANG_KEY, "en");
    }

    private loadFromStorage(key: string, defaultValue: string): string {
        return localStorage.getItem(key) ?? defaultValue;
    }
}