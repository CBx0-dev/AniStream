import { AppShell, WritableGlobalContext } from "vue-mvvm";
import { RoutableViewModel } from "vue-mvvm/router";

import { ProviderViewModel } from "@views/ProviderView.model";
import { StreamsViewModel } from "@views/StreamsView.model";
import { SyncViewModel } from "@views/SyncView.model";

import { ProviderService } from "@services/provider.service";
import { SeriesService } from "@services/series.service";
import {DbService} from "@services/db.service";

export class AppConfig implements AppShell {
    router: { history?: "memory" | "web" | "web-hash"; views: RoutableViewModel[]; } = {
        views: [
            ProviderViewModel,
            StreamsViewModel,
            SyncViewModel,
        ]
    }

    configureServices(ctx: WritableGlobalContext): void {
        ctx.registerService(ProviderService, ctx => new ProviderService(ctx));
        ctx.registerService(SeriesService, ctx => new SeriesService(ctx));
        ctx.registerService(DbService, () => new DbService());
    }
}