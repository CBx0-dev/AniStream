import {ServiceKey} from "vue-mvvm";

export interface ChangelogEntry {
    version: string;
    content: string;
    parsedContent: string;
}

export interface ChangelogService {
    loadChangelogs(): Promise<void>;

    getChangelogs(): ChangelogEntry[];
}

export const ChangelogService: ServiceKey<ChangelogService> = new ServiceKey<ChangelogService>("changelog.service");
