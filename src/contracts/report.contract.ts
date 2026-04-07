import {ServiceKey} from "vue-mvvm";

export interface ReportService {
    handleFatalError(error: any): Promise<void>;
}

export const ReportService: ServiceKey<ReportService> = new ServiceKey<ReportService>("report.service");
