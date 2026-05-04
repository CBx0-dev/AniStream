import {App, Plugin} from "vue";
import {ReadableGlobalContext, ServiceKey, createMVVM, DIContainer} from "vue-mvvm";

import {ServiceTestHarness, TestBase} from "@test/utils/harness";
import {UserDbServiceMock} from "@test/mocks/standalone/user.service";
import {MetadataDbServiceMock} from "@test/mocks/standalone/metadata.service";
import {UserServiceMock} from "@test/mocks/user.service";

import {TestConfig} from "@configs/test";

import {UserDbService} from "@contracts/standalone/user.contract";
import {MetadataDbService} from "@contracts/standalone/metadata.contract";
import {UserService} from "@contracts/user.contract";


class StandaloneTestHarness implements ServiceTestHarness {
    private _container!: DIContainer;
    private _config!: TestConfig;

    public constructor() {
    }

    setUp(): void | Promise<void> {
        this._container = new DIContainer();
        this._config = new TestConfig();

        const plugin: Plugin = createMVVM(this._config, {
            context: this._container
        });

        if (!plugin.install) {
            throw new Error("Failed to setup MVVM context");
        }

        plugin.install(null as unknown as App);

        this._config.mockService(UserDbService, () => new UserDbServiceMock());
        this._config.mockService(MetadataDbService, ctx => new MetadataDbServiceMock(ctx));
        this._config.mockService(UserService, ctx => new UserServiceMock(ctx));
    }

    tearDown(): void | Promise<void> {
    }

    getService<T>(key: ServiceKey<T>): T {
        const ctx: ReadableGlobalContext = this._config.ctx;
        return ctx.getService(key) as T;
    }
}

TestBase.registerHarness("standalone", () => new StandaloneTestHarness());