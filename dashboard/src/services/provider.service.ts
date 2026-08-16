import {ProviderService} from "@contracts/provider.service";

import type {ServiceDeclaration} from "@services/shared";

class ProviderServiceImpl implements ProviderService {
    public async getProviders(): Promise<string[]> {
        // TODO could be in future dynamic
        return ["sto", "aniworld"];
    }
    
}

export default {
    key: ProviderService,
    ctor: ProviderServiceImpl
} satisfies ServiceDeclaration<ProviderService>;