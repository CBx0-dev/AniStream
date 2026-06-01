import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";
import {AsyncServiceKey, ServiceKey, syncio} from "vue-mvvm";

const contractModules = import.meta.glob("@contracts/*.contract.ts", {
    eager: true
});

const contractImports: unknown[] = Object.values(contractModules).map(value => Object.values(value as Record<string, unknown>)).flat();

const contracts: Array<ServiceKey<unknown> | AsyncServiceKey<unknown>> = contractImports.filter(imp => imp instanceof ServiceKey || imp instanceof AsyncServiceKey);

class ServicesTest extends TestBase {
    private async resolveService(contract: ServiceKey<unknown> | AsyncServiceKey<unknown>): Promise<number> {
        await syncio.ensureSync(this.getService(contract));
        return 1;
    }

    private async requiredServiceImplemented(): Promise<void> {
        for (const contract of contracts) {
            await expect(this.resolveService(contract)).resolves.toBe(1);
        }
    }

    public getTests(): TestDefinition[] {
        return [
            ["RequiredServiceImplemented", this.requiredServiceImplemented]
        ];
    }
}

TestBase.register(ServicesTest);