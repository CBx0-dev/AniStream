import { AppShell, WritableGlobalContext } from "vue-mvvm";
import { RoutableViewModel } from "vue-mvvm/router";

import { ProviderViewModel } from "@views/ProviderView.model";


export class AppConfig implements AppShell {
    router: { history?: "memory" | "web" | "web-hash"; views: RoutableViewModel[]; } = {
        views: [
            ProviderViewModel
        ]
    }

    configureServices(ctx: WritableGlobalContext): void {
        
    }
}