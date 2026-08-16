import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";

import {ResourceService} from "@contracts/resource.contract";
import {ProviderService} from "@contracts/provider.contract";
import {SettingsService} from "@contracts/settings.contract";

import {DefaultProvider} from "@providers/default";

import {UnsupportedPlatformError} from "@utils/error";

class ResourceServiceImpl implements ResourceService {
    private readonly providerService: ProviderService;
    private readonly settingsService: SettingsService;

    public constructor(ctx: ReadableGlobalContext) {
        this.providerService = ctx.getService(ProviderService);
        this.settingsService = ctx.getService(SettingsService);
    }

    public async getResourceLocation(): Promise<string> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        return `${this.settingsService.serverUrl.value}/api/${provider.uniqueKey}/resources/`;
    }
    
    public async saveResource(_name: string, _data: Uint8Array): Promise<void> {
        throw new UnsupportedPlatformError("ResourceServiceImpl.saveResource");
    }
}

export default {
    key: ResourceService,
    ctor: ResourceServiceImpl
} satisfies ServiceDeclaration<ResourceService>;
