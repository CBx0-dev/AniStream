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
    private container!: DIContainer;
    private config!: TestConfig;

    public constructor() {
    }

    setUp(): void | Promise<void> {
        this.container = new DIContainer();
        this.config = new TestConfig();

        const plugin: Plugin = createMVVM(this.config, {
            context: this.container
        });

        if (!plugin.install) {
            throw new Error("Failed to setup MVVM context");
        }

        plugin.install(null as unknown as App);

        this.config.mockService(UserDbService, () => new UserDbServiceMock());
        this.config.mockService(MetadataDbService, ctx => new MetadataDbServiceMock(ctx));
        this.config.mockService(UserService, ctx => new UserServiceMock(ctx));
    }

    tearDown(): void | Promise<void> {
    }

    getService<T>(key: ServiceKey<T>): T {
        const ctx: ReadableGlobalContext = this.config.ctx;
        return ctx.getService<T>(key);
    }
}

TestBase.registerHarness("standalone", () => new StandaloneTestHarness());