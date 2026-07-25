import {ServiceKey} from "vue-mvvm";
import type {AuditModel} from "@models/audit.model";

export interface InformationService {
    getAudits(): Promise<AuditModel[]>
}

export const InformationService: ServiceKey<InformationService> = new ServiceKey<InformationService>("information.service");