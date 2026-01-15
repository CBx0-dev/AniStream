import {UserControl} from "vue-mvvm";

import {SettingsService} from "@services/settings.service";

export class ThemeControlModel extends UserControl {
    private readonly settingsService: SettingsService

    public activeTheme: string = this.computed(() => this.settingsService.theme.value);

    public constructor() {
        super();

        this.settingsService = this.ctx.getService(SettingsService);
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
}