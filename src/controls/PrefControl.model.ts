import {UserControl} from "vue-mvvm";
import {ToastService} from "vue-mvvm/toast";

import {SettingsService} from "@services/settings.service";
import {I18nService} from "@services/i18n.service";
import I18n from "@utils/i18n";

export class PrefControlModel extends UserControl {
    private readonly toastService: ToastService;

    private readonly i18nService: I18nService;
    private readonly settingsService: SettingsService

    public readonly activeTheme: string = this.computed(() => this.settingsService.theme.value);
    public readonly activeLocal: string = this.computed(() => this.settingsService.lang.value);
    public readonly updatesActive: boolean = this.computed(() => this.settingsService.updatesActive.value);
    
    public healthUrl: string = this.ref("");

    public constructor() {
        super();

        this.toastService = this.ctx.getService(ToastService);

        this.i18nService = this.ctx.getService(I18nService);
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

    public async onHealthUrlChange(): Promise<void> {
        this.settingsService.healthz = this.healthUrl;
        await this.toastService.showInfo({
            type: "info",
            title: this.i18nService.get(I18n.PrefControl.updater.toastTitle),
            description: this.i18nService.get(I18n.PrefControl.updater.toastDescription),
        });
    }
}