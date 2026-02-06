import {App} from "vue";
import {AppShell, WritableGlobalContext} from "vue-mvvm";

import {ProviderViewModel} from "@views/ProviderView.model";
import {SettingsViewModel} from "@views/SettingsView.model";
import {StreamsViewModel} from "@views/StreamsView.model";
import {SyncViewModel} from "@views/SyncView.model";
import {WatchlistViewModel} from "@views/WatchlistView.model";
import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";
import {StreamViewModel} from "@views/StreamView.model";
import {PlayerViewModel} from "@views/PlayerView.model";

import {ConfirmControlModel} from "@controls/ConfirmControl.model";

import {ProviderService} from "@services/provider.service";
import {SeriesService} from "@services/series.service";
import {SeasonService} from "@services/season.service";
import {EpisodeService} from "@services/episode.service";
import {DbService} from "@services/db.service";
import {FetchService} from "@services/fetch.service";
import {GenreService} from "@services/genre.service";
import {WatchlistService} from "@services/watchlist.service";
import {I18nService} from "@services/i18n.service";
import {ChangelogService} from "@services/changelog.service";
import {SettingsService} from "@services/settings.service";
import {ReportService} from "@services/report.service";
import {UpdateService} from "@services/update.service";

export class AppConfig implements AppShell {
    private app: App;

    router: AppShell.RouterConfig = {
        views: [
            ProviderViewModel,
            SettingsViewModel,
            StreamsViewModel,
            SyncViewModel,
            WatchlistViewModel,
            SeriesSyncViewModel,
            StreamViewModel,
            PlayerViewModel
        ]
    }

    alert: AppShell.AlertConfig = {
        confirm: ConfirmControlModel
    }

    public constructor(app: App) {
        this.app = app;
    }

    configureServices(ctx: WritableGlobalContext): void {
        ctx.registerService(I18nService, () => new I18nService());
        ctx.registerService(ProviderService, ctx => new ProviderService(ctx));
        ctx.registerService(SeriesService, ctx => new SeriesService(ctx));
        ctx.registerService(SeasonService, ctx => new SeasonService(ctx));
        ctx.registerService(EpisodeService, ctx => new EpisodeService(ctx));
        ctx.registerService(GenreService, ctx => new GenreService(ctx));
        ctx.registerService(WatchlistService, ctx => new WatchlistService(ctx));
        ctx.registerService(DbService, () => new DbService());
        ctx.registerService(FetchService, ctx => new FetchService(ctx));
        ctx.registerService(ChangelogService, () => new ChangelogService());
        ctx.registerService(SettingsService, ctx => new SettingsService(ctx));
        ctx.registerService(ReportService, ctx => new ReportService(ctx));
        ctx.registerService(UpdateService, ctx => new UpdateService(ctx));

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