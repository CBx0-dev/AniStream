import type {ReadableGlobalContext} from "vue-mvvm";

import {InformationService} from "@contracts/information.service";
import {ApiService} from "@contracts/api.service";

import type {ServiceDeclaration} from "@services/shared";

import {type AuditModel, AuditStatus, type Paged} from "@models/audit.model";
import type {StatsModel} from "@models/stats.model";
import type {BackendUpdateInformation} from "@models/update.model";

class InformationServiceImpl implements InformationService {
    private readonly apiService: ApiService;

    public constructor(ctx: ReadableGlobalContext) {
        this.apiService = ctx.getService(ApiService);
    }

    public async getAudits(page: number, kinds: number, providers: string[], status: AuditStatus | null): Promise<Paged<AuditModel>> {
        if (page < 1 || Number.isNaN(page)) {
            throw new Error("Page must be greater than or equal to 1");
        }

        return await this.apiService.get<Paged<AuditModel>>({
            path: ["api", "information", "audits"],
            query: {
                page,
                kinds,
                providers,
                status
            }
        });
    }

    public async getBackendUpdateInformation(): Promise<BackendUpdateInformation> {
        return await this.apiService.get<BackendUpdateInformation>(["api", "information", "server"]);
    }

    public async getStats(): Promise<StatsModel> {
        return await this.apiService.get<StatsModel>(["api", "information", "stats"]);
    }
}

export default {
    key: InformationService,
    ctor: InformationServiceImpl
} satisfies ServiceDeclaration<InformationService>;

