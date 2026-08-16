import type {AppShell, WritableGlobalContext} from "vue-mvvm";

import {LoginViewModel} from "@views/LoginView.model";
import {DashboardViewModel} from "@views/DashboardView.model";

import {services} from "@services/loader";

export class AppConfig implements AppShell {
    public router: AppShell.RouterConfig = {
        views: [
            LoginViewModel,
            DashboardViewModel
        ]
    }
    
    
    public configureServices(ctx: WritableGlobalContext): void {
        for (const service of services) {
            ctx.registerService(service.key, ctx => new service.ctor(ctx));
        }
    }
    
}