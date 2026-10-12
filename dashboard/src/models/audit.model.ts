export enum AuditKind {
    Catalog = 1,
    Series = 2,
    Provider = 4,
    All = AuditKind.Catalog | AuditKind.Series | AuditKind.Provider
}

export enum AuditStatus {
    Queued,
    Processing,
    Completed,
    Failed
}

export interface Paged<T> {
    items: T[];
    start: number;
    count: number;
    total: {
        items: number;
        running: number;
        queued: number;
        completed: number;
        failed: number;
    };
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