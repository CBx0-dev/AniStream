import {ServiceTestHarness, TestBase} from "@test/utils/harness";

class StandaloneTestHarness implements ServiceTestHarness {
    setUp(): void | Promise<void> {
    }

    tearDown(): void | Promise<void> {
    }

    getService<T>(_key: unknown): T {
        throw new Error("Method not implemented.");
    }
}

TestBase.registerHarness("standalone", () => new StandaloneTestHarness());