import {ServiceKey} from "vue-mvvm";

import type {AuditModel} from "@models/audit.model";
import type {StatsModel} from "@models/stats.model";

export interface InformationService {
    getAudits(): Promise<AuditModel[]>;

    getStats(): Promise<StatsModel>;
}

export const InformationService: ServiceKey<InformationService> = new ServiceKey<InformationService>("information.service");