import {ServiceKey} from "vue-mvvm";

import type {AuditModel} from "@models/audit.model";
import type {StatsModel} from "@models/stats.model";
import type {BackendUpdateInformation} from "@models/update.model";

export interface InformationService {
    getAudits(): Promise<AuditModel[]>;

    getStats(): Promise<StatsModel>;

    getBackendUpdateInformation(): Promise<BackendUpdateInformation>;
}

export const InformationService: ServiceKey<InformationService> = new ServiceKey<InformationService>("information.service");