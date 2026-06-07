import {ServiceKey} from "vue-mvvm";

export interface ResourceService {
    getResourceLocation(): Promise<string>;
    
    saveResource(name: string, data: Uint8Array): Promise<void>;
}

export const ResourceService: ServiceKey<ResourceService> = new ServiceKey<ResourceService>("resource.service");