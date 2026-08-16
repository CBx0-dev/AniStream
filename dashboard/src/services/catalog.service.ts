import type {ReadableGlobalContext} from "vue-mvvm";

import {CatalogService} from "@contracts/catalog.service";
import {ProviderService} from "@contracts/provider.service";
import {ApiService} from "@contracts/api.service";

import type {ServiceDeclaration} from "@services/shared";

class CatalogServiceImpl implements CatalogService{
    private readonly apiService: ApiService;
    private readonly providerService: ProviderService;
    
    public constructor(ctx: ReadableGlobalContext) {
        this.apiService = ctx.getService(ApiService);
        this.providerService = ctx.getService(ProviderService);
    }
    
    public async requestSync(): Promise<void> {
        const providers: string[] = await this.providerService.getProviders();
        
        for (const provider of providers) {
            await this.apiService.post<{}, null>(["api", provider, "catalog"], null);
        }
    }
}

export default  {
    key: CatalogService,
    ctor: CatalogServiceImpl
} satisfies ServiceDeclaration<CatalogService>;