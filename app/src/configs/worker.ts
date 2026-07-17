import {AppShell, WritableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";

import {UnsupportedPlatformError} from "@utils/error";

const services: ServiceDeclaration<unknown>[] = Object.values(import.meta.glob("/src/services/worker/*.service.ts", {
    eager: true,
    import: "default"
}));

export class WorkerConfig implements AppShell {

    public router: AppShell.RouterConfig = {
        views: []
    }

    public alert: AppShell.AlertConfig = {}

    public get toast(): AppShell.ToastConfig {
        throw new UnsupportedPlatformError("get WorkerConfig.toast");
    }

    public constructor() {
    }

    public configureServices(ctx: WritableGlobalContext): void {
        for (const service of services) {
            ctx.registerService(service.key, ctx => new service.ctor(ctx));
        }
    }
}