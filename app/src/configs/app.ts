import {App} from "vue";
import {AppShell, WritableGlobalContext} from "vue-mvvm";

import {BaseConfig} from "@configs/base";

import {ProviderViewModel} from "@views/ProviderView.model";
import {SettingsViewModel} from "@views/SettingsView.model";
import {StreamsViewModel} from "@views/StreamsView.model";
import {SyncViewModel} from "@views/SyncView.model";
import {WatchlistViewModel} from "@views/WatchlistView.model";
import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";
import {StreamViewModel} from "@views/StreamView.model";
import {PlayerViewModel} from "@views/PlayerView.model";
import {ProfileViewModel} from "@views/ProfileView.model";
import {ListViewModel} from "@views/ListView.model";

import {ConfirmControlModel} from "@controls/ConfirmControl.model";
import ToastContainer from "@controls/ToastContainer.vue";
import {InfoToastModel} from "@controls/InfoToast.model";
import {ProgressToastModel} from "@controls/ProgressToast.model";

import {ReportService} from "@contracts/report.contract";
import {SettingsService} from "@contracts/settings.contract";
import {UpdateService} from "@contracts/update.contract";

export class AppConfig extends BaseConfig {
    private app: App;

    public router: AppShell.RouterConfig = {
        views: [
            ProviderViewModel,
            SettingsViewModel,
            StreamsViewModel,
            SyncViewModel,
            WatchlistViewModel,
            SeriesSyncViewModel,
            StreamViewModel,
            PlayerViewModel,
            ProfileViewModel,
            ListViewModel
        ]
    }

    public alert: AppShell.AlertConfig = {
        confirm: ConfirmControlModel
    }

    public toast: AppShell.ToastConfig = {
        container: ToastContainer,
        info: InfoToastModel,
        progress: ProgressToastModel
    }

    public constructor(app: App) {
        super();

        this.app = app;
    }

    protected afterConfigureServices(ctx: WritableGlobalContext): void {
        // Init reporting
        const reportService: ReportService = ctx.getService(ReportService);
        this.app.config.errorHandler = async err => {
            await reportService.handleFatalError(err);
        }

        // For initializing theming etc...
        ctx.getService(SettingsService);
        ctx.getService(UpdateService);
    }
}