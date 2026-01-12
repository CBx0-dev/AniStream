import { AppShell, WritableGlobalContext } from "vue-mvvm";
import { RoutableViewModel } from "vue-mvvm/router";

import { ProviderViewModel } from "@views/ProviderView.model";
import { StreamsViewModel } from "@views/StreamsView.model";

import { ProviderService } from "@services/provider.service";
import { SeriesSerivce } from "@services/series.service";

export class AppConfig implements AppShell {
    router: { history?: "memory" | "web" | "web-hash"; views: RoutableViewModel[]; } = {
        views: [
            ProviderViewModel,
            StreamsViewModel
        ]
    }

    configureServices(ctx: WritableGlobalContext): void {
        ctx.registerService(ProviderService, () => new ProviderService());
        ctx.registerService(SeriesSerivce, ctx => new SeriesSerivce(ctx));
    }
}