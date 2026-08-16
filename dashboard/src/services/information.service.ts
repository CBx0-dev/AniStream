import type {ReadableGlobalContext} from "vue-mvvm";

import {InformationService} from "@contracts/information.service";
import {ApiService} from "@contracts/api.service";

import type {ServiceDeclaration} from "@services/shared";

import type {AuditModel} from "@models/audit.model";
import type {StatsModel} from "@models/stats.model";

class InformationServiceImpl implements InformationService {
    private readonly apiService: ApiService;

    public constructor(ctx: ReadableGlobalContext) {
        this.apiService = ctx.getService(ApiService);
    }

    public async getAudits(): Promise<AuditModel[]> {
        return await this.apiService.get<AuditModel[]>(["api", "information", "audits"]);
    }

    public async getStats(): Promise<StatsModel> {
        return await this.apiService.get<StatsModel>(["api", "information", "stats"]);
    }
}

export default {
    key: InformationService,
    ctor: InformationServiceImpl
} satisfies ServiceDeclaration<InformationService>;

