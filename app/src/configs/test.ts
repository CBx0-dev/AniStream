import {AppShell, FactoryFunction, ReadableGlobalContext, ServiceKey, WritableGlobalContext} from "vue-mvvm";

import {BaseConfig} from "@configs/base";

import ToastContainer from "@controls/ToastContainer.vue";

export class TestConfig extends BaseConfig {
    private _ctx: WritableGlobalContext | null;

    public router: AppShell.RouterConfig = {
        views: []
    }

    public alert: AppShell.AlertConfig = {
    }

    public toast: AppShell.ToastConfig = {
        container: ToastContainer
    }

    public get ctx(): ReadableGlobalContext {
        if (!this._ctx) {
            throw new Error("Context not initialized");
        }

        return this._ctx.toReadableGlobalContext();
    }

    public constructor() {
        super();

        this._ctx = null;
    }

    public mockService<T>(key: ServiceKey<T>, factory: FactoryFunction<T>): void {
        if (!this._ctx) {
            throw new Error("Context not initialized");
        }

        // @ts-expect-error
        this._ctx.mockService(key, factory);
    }

    protected afterConfigureServices(ctx: WritableGlobalContext): void {
        this._ctx = ctx;
    }
}