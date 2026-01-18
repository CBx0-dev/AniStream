import {AppShell, WritableGlobalContext} from "vue-mvvm";
import {RoutableViewModel} from "vue-mvvm/router";

import {ProviderViewModel} from "@views/ProviderView.model";
import {SettingsViewModel} from "@views/SettingsView.model";
import {StreamsViewModel} from "@views/StreamsView.model";
import {SyncViewModel} from "@views/SyncView.model";
import {WatchlistViewModel} from "@views/WatchlistView.model";
import {PlayerViewModel} from "@views/PlayerView.model";

import {ProviderService} from "@services/provider.service";
import {SeriesService} from "@services/series.service";
import {SeasonService} from "@services/season.service";
import {EpisodeService} from "@services/episode.service";
import {DbService} from "@services/db.service";
import {FetchService} from "@services/fetch.service";
import {GenreService} from "@services/genre.service";
import {I18nService} from "@services/i18n.service";
import {SettingsService} from "@services/settings.service";
import {SeriesSyncViewModel} from "@views/SeriesSyncView.model";

export class AppConfig implements AppShell {
    router: { history?: "memory" | "web" | "web-hash"; views: RoutableViewModel[]; } = {
        views: [
            ProviderViewModel,
            SettingsViewModel,
            StreamsViewModel,
            SyncViewModel,
            WatchlistViewModel,
            SeriesSyncViewModel,
            PlayerViewModel
        ]
    }

    configureServices(ctx: WritableGlobalContext): void {
        ctx.registerService(I18nService, () => new I18nService());
        ctx.registerService(ProviderService, ctx => new ProviderService(ctx));
        ctx.registerService(SeriesService, ctx => new SeriesService(ctx));
        ctx.registerService(SeasonService, ctx => new SeasonService(ctx));
        ctx.registerService(EpisodeService, ctx => new EpisodeService(ctx));
        ctx.registerService(GenreService, ctx => new GenreService(ctx));
        ctx.registerService(DbService, () => new DbService());
        ctx.registerService(FetchService, ctx => new FetchService(ctx));
        ctx.registerService(SettingsService, ctx => new SettingsService(ctx));

        // For initializing theming etc...
        ctx.getService(SettingsService);
    }
}