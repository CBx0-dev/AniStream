import {App, Plugin} from "vue";
import {ReadableGlobalContext, ServiceKey, createMVVM, DIContainer} from "vue-mvvm";

import {ServiceTestHarness, TestBase} from "@test/utils/harness";
import {ApiServiceMock} from "@test/mocks/client/api.service";
import {UserServiceMock} from "@test/mocks/user.service";

import {TestConfig} from "@configs/test";

import {ApiService} from "@contracts/client/api.contract";
import {UserService} from "@contracts/user.contract";

import {ApiServiceImpl} from "@services/api/api.service";
import {TestContext} from "vitest";


class ClientTestHarness implements ServiceTestHarness {
    private container!: DIContainer;
    private config!: TestConfig;

    setUp(ctx: TestContext): void | Promise<void> {
        this.container = new DIContainer();
        this.config = new TestConfig();

        const plugin: Plugin = createMVVM(this.config, {
            context: this.container
        });

        if (!plugin.install) {
            throw new Error("Failed to setup MVVM context");
        }

        plugin.install(null as unknown as App);

        this.config.mockService(ApiService, ctx => new ApiServiceMock(ctx));
        this.config.mockService(UserService, ctx => new UserServiceMock(ctx));

        ApiServiceImpl.HEADERS.push(["Testing-ID", ctx.task.id]);
    }

    tearDown(): void | Promise<void> {
    }

    getService<T>(key: ServiceKey<T>): T {
        const ctx: ReadableGlobalContext = this.config.ctx;
        return ctx.getService<T>(key);
    }
}

TestBase.registerHarness("client", () => new ClientTestHarness());