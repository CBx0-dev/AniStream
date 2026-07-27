export enum AuditKind {
    Catalog,
    Series,
    Provider
}

export enum AuditStatus {
    Queued,
    Processing,
    Completed,
    Failed
}

export interface AuditModel {
    job_id: number;
    kind: AuditKind;
    job_name: string;
    provider: string;
    status: AuditStatus;
    started_at: string;
    finished_at: string | null;
    error: string | null;
    expires: string | null;
}