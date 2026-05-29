import {ServiceKey} from "vue-mvvm";

export interface ResourceService {
    getResourceLocation(): Promise<string>;
}

export const ResourceService: ServiceKey<ResourceService> = new ServiceKey<ResourceService>("resource.service");