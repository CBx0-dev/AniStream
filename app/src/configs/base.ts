import {AppShell, WritableGlobalContext} from "vue-mvvm";

import {services} from "virtual:services";

export abstract class BaseConfig implements AppShell {
    public abstract get router(): AppShell.RouterConfig;
    public abstract get toast(): AppShell.ToastConfig;
    public abstract get alert(): AppShell.AlertConfig;

    public configureServices(ctx: WritableGlobalContext): void {
        for (const service of Object.values(services)) {
            ctx.registerService(service.key, ctx => new service.ctor(ctx));
        }

        this.afterConfigureServices(ctx);
    }

    protected abstract afterConfigureServices(ctx: WritableGlobalContext): void;

}