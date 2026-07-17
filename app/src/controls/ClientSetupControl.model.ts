import {UserControl} from "vue-mvvm";

import {SettingsService} from "@contracts/settings.contract";
import {ApiService} from "@contracts/client/api.contract";

export class ClientSetupControlModel extends UserControl {
    private readonly settingsService: SettingsService;
    private readonly apiService: ApiService;

    public movieImage: string | null = this.ref(null);
    public url: string = this.ref("");
    public isChecking: boolean = this.ref(false);
    public error: string | null = this.ref("");

    public readonly allowSubmit: boolean = this.computed(() => this.url.trim().length > 11);

    public constructor() {
        super();

        this.settingsService = this.ctx.getService(SettingsService);
        this.apiService = this.ctx.getService(ApiService);
    }

    protected async mounted(): Promise<void> {
        this.movieImage = await this.settingsService.getImageVariant("movie", "svg");
    }

    public async onSubmitBtn(): Promise<void> {
        this.isChecking = true;
        this.error = null;

        try {
            let url: string = this.url;
            if (url.endsWith("/")) {
                url = url.substring(1);
            }
            const error: string | null = await this.apiService.checkApiInformation(url);
            if (error) {
                this.error = error;
                return;
            }

            this.settingsService.serverUrl = url;
            window.location.reload();
        } catch (e) {
            if (e instanceof Error) {
                this.error = `Error: ${e.message}`;
            } else {
                this.error = `Error: ${e}`;
            }
        } finally {
            this.isChecking = false;
        }
    }
}