import * as fs from "@tauri-apps/plugin-fs";

import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";

import {ResourceService} from "@contracts/resource.contract";
import {ProviderService} from "@contracts/provider.contract";

import {DefaultProvider} from "@providers/default";

import * as path from "@utils/path";

class ResourceServiceImpl implements ResourceService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        this.providerService = ctx.getService(ProviderService);
    }

    public async getResourceLocation(): Promise<string> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        return await provider.getStorageLocation();
    }

    public async saveResource(name: string, data: Uint8Array): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const basePath: string = await provider.getStorageLocation();
        const fullPath: string = path.join(basePath, name);
        
        await fs.writeFile(fullPath, data);
    }
}

export default {
    key: ResourceService,
    ctor: ResourceServiceImpl
} satisfies ServiceDeclaration<ResourceService>;