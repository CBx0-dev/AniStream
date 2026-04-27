import {ServiceTestHarness, TestBase} from "@test/utils/harness";

class ClientTestHarness implements ServiceTestHarness {
    setUp(): void | Promise<void> {
    }

    tearDown(): void | Promise<void> {
    }

    getService<T>(_key: unknown): T {
        throw new Error("Method not implemented.");
    }
}

TestBase.registerHarness("client", () => new ClientTestHarness());