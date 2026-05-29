import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";

import {ResourceService} from "@contracts/resource.contract";
import {ProviderService} from "@contracts/provider.contract";

import {DefaultProvider} from "@providers/default";

class ResourceServiceImpl implements ResourceService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        this.providerService = ctx.getService(ProviderService);
    }

    public async getResourceLocation(): Promise<string> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        // TODO replace with settings url
        return `http://localhost:5000/api/${provider.uniqueKey}/resources/`;
    }
}

export default {
    key: ResourceService,
    ctor: ResourceServiceImpl
} satisfies ServiceDeclaration<ResourceService>;