import {readonly, ref, Ref} from "vue";

export class SettingsService {
    private static readonly THEME_KEY: string = "theme";
    private _theme: Ref<string> = ref("");

    public get theme(): Readonly<Ref<string>> {
        return readonly(this._theme);
    }

    public set theme(v: string) {
        this._theme.value = v;
        localStorage.setItem(SettingsService.THEME_KEY, v);
        document.documentElement.setAttribute("data-theme", v);
    }

    public constructor() {
        this.theme = this.loadFromStorage(SettingsService.THEME_KEY, "aniworld-light");
    }

    private loadFromStorage(key: string, defaultValue: string): string {
        return localStorage.getItem(key) ?? defaultValue;
    }
}