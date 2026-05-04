import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {ProviderService} from "@contracts/provider.contract";

class ProviderTests extends TestBase {
    // ProviderServiceTests in .NET uses base(false) which means it doesn't set a default provider in setUp.
    public constructor() {
        super(false);
    }

    private get providerService(): ProviderService {
        return this.getService(ProviderService);
    }

    private async rejectsGettingNotSetProvider() {
        // In JS, getProvider() returns a Promise.
        // Let's see if it throws when no provider is set.
        await expect(this.providerService.getProvider()).rejects.toThrow();
    }

    private async setActiveProvider() {
        await this.providerService.setProvider(this.providerService.STO);

        const active = await this.providerService.getProvider();
        expect(active).toBe(this.providerService.STO);
    }

    public getTests(): TestDefinition[] {
        return [
            ["RejectsGettingNotSetProvider", this.rejectsGettingNotSetProvider],
            ["SetActiveProvider", this.setActiveProvider]
        ];
    }
}

TestBase.register(ProviderTests);
