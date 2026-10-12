import {ServiceKey} from "vue-mvvm";

import {type AuditModel, AuditStatus, type Paged} from "@models/audit.model";
import type {StatsModel} from "@models/stats.model";
import type {BackendUpdateInformation} from "@models/update.model";

export interface InformationService {
    getAudits(page: number, kinds: number, providers: string[], status: AuditStatus | null): Promise<Paged<AuditModel>>;

    getStats(): Promise<StatsModel>;

    getBackendUpdateInformation(): Promise<BackendUpdateInformation>;
}

export const InformationService: ServiceKey<InformationService> = new ServiceKey<InformationService>("information.service");