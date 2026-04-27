import {describe, test} from "vitest";
import {syncio} from "vue-mvvm";

export interface ServiceTestHarness {
    setUp(): void | Promise<void>;

    tearDown(): void | Promise<void>;

    getService<T>(key: unknown): T;
}

export type TestMethod = (this: TestBase) => Promise<void> | void;

export type TestDefinition = [
    name: string,
    method: TestMethod
];

export abstract class TestBase {
    public static harnessFactory: (() => ServiceTestHarness) | null = null;

    private harness: ServiceTestHarness;

    public constructor() {
        if (!TestBase.harnessFactory) {
            throw `No harness factory defined for target '${TestBase.applicationTarget}'`;
        }

        this.harness = TestBase.harnessFactory();
    }

    public async setUp(): Promise<void> {
        await syncio.ensureSync(this.harness.setUp());
    }

    public async tearDown(): Promise<void> {
        await syncio.ensureSync(this.harness.tearDown());
    }

    public abstract getTests(): TestDefinition[];

    protected getService<T>(key: unknown): T {
        return this.harness.getService<T>(key);
    }

    public static register<T extends TestBase>(testType: new () => T): void {
        const discoveryInstance = new testType();

        describe(`${testType.name}`, () => {
            for (const [name, method] of discoveryInstance.getTests()) {
                test(name, async () => {
                    const testInstance = new testType();

                    const boundMethod = method.bind(testInstance);

                    try {
                        await testInstance.setUp();
                        await boundMethod();
                    } finally {
                        await testInstance.tearDown();
                    }
                });
            }
        });
    }

    public static registerHarness(target: string, factory: () => ServiceTestHarness): void {
        if (target != TestBase.applicationTarget) {
            return;
        }
        TestBase.harnessFactory = factory;
    }

    private static get applicationTarget() {
        if (!process.env.APPLICATION_TARGET) {
            throw "APPLICATION_TARGET is not defined";
        }

        return process.env.APPLICATION_TARGET;
    }
}

