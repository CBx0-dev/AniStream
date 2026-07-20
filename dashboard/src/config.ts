import type {AppShell, WritableGlobalContext} from "vue-mvvm";

import {DashboardViewModel} from "@views/DashboardView.model.ts";

export class AppConfig implements AppShell {
    public router: AppShell.RouterConfig = {
        views: [
            DashboardViewModel
        ]
    }
    
    
    public configureServices(_ctx: WritableGlobalContext): void {
    }
    
}