import {UserControl} from "vue-mvvm";

import {SettingsService} from "@services/settings.service";

export class PrefControlModel extends UserControl {
    private readonly settingsService: SettingsService

    public readonly activeTheme: string = this.computed(() => this.settingsService.theme.value);
    public readonly activeLocal: string = this.computed(() => this.settingsService.lang.value);
    public readonly updatesActive: boolean = this.computed(() => this.settingsService.updatesActive.value);
    
    public healthUrl: string = this.ref("");

    public constructor() {
        super();

        this.settingsService = this.ctx.getService(SettingsService);

        this.healthUrl = this.settingsService.healthz.value;
    }

    public onAniworldLightThemeBtn(): void {
        this.settingsService.theme = "aniworld-light";
    }

    public onAniworldDarkThemeBtn(): void {
        this.settingsService.theme = "aniworld-dark";
    }

    public onStoLightThemeBtn(): void {
        this.settingsService.theme = "sto-light";
    }

    public onStoDarkThemeBtn(): void {
        this.settingsService.theme = "sto-dark";
    }

    public onEnLocalBtn(): void {
        this.settingsService.lang = "en";
    }

    public onDeLocalBtn(): void {
        this.settingsService.lang = "de";
    }

    public onUpdatesActiveToggle(): void {
        this.settingsService.updatesActive = !this.settingsService.updatesActive.value;
    }

    public onHealthUrlChange(): void {
        this.settingsService.healthz = this.healthUrl;
    }
}