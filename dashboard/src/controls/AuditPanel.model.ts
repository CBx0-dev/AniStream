import {UserControl} from "vue-mvvm";

/**
 * Kind of a sync job. Maps to the two source tables:
 * - `series`   → `sync_series_job`   (metadata sync for a whole series)
 * - `provider` → `sync_provider_job` (stream provider resolve for a single episode)
 */
export type JobKind = "series" | "provider";

/**
 * Job status as stored in the `status` integer column of the sync tables.
 */
export const JobStatus = {
    Pending: 0,
    Running: 1,
    Completed: 2,
    Failed: 3
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

/**
 * A flattened view of a row from either `sync_series_job` or `sync_provider_job`.
 */
export interface AuditJob {
    id: number;
    kind: JobKind;
    /** Human readable target (series title, or "series — SxxExx" for provider jobs). */
    target: string;
    status: JobStatus;
    started: string;
    completed: string | null;
    error: string | null;
    /** Only set for provider jobs (`sync_provider_job.expires`). */
    expires: string | null;
}

interface AuditStats {
    total: number;
    running: number;
    completed: number;
    failed: number;
}

export class AuditPanelModel extends UserControl {
    public search: string = this.ref("");
    public kindFilter: JobKind | "all" = this.ref("all");
    public statusFilter: JobStatus | "all" = this.ref("all");
    public refreshing: boolean = this.ref(false);

    public readonly pageSize: number = 8;
    public page: number = this.ref(1);

    /** The job whose error is shown in the details dialog, or `null` when closed. */
    public errorJob: AuditJob | null = this.ref<AuditJob | null>(null);
    public copied: boolean = this.ref(false);

    public constructor() {
        super();

        // Whenever the filter set changes, jump back to the first page so the
        // user never lands on an out-of-range (now empty) page.
        this.watch(
            (): string => `${this.search}|${this.kindFilter}|${this.statusFilter}`,
            (): void => {
                this.page = 1;
            }
        );
    }

    // Static placeholder data — mirrors rows of sync_series_job / sync_provider_job.
    private readonly jobs: AuditJob[] = this.readonly([
        {
            id: 5218,
            kind: "provider",
            target: "Frieren: Beyond Journey's End — S1E24",
            status: JobStatus.Completed,
            started: "2026-07-21T09:14:02Z",
            completed: "2026-07-21T09:14:37Z",
            error: null,
            expires: "2026-07-28T09:14:37Z"
        },
        {
            id: 5217,
            kind: "provider",
            target: "Frieren: Beyond Journey's End — S1E23",
            status: JobStatus.Completed,
            started: "2026-07-21T09:13:41Z",
            completed: "2026-07-21T09:14:01Z",
            error: null,
            expires: "2026-07-28T09:14:01Z"
        },
        {
            id: 4103,
            kind: "series",
            target: "Solo Leveling",
            status: JobStatus.Running,
            started: "2026-07-21T09:12:55Z",
            completed: null,
            error: null,
            expires: null
        },
        {
            id: 5216,
            kind: "provider",
            target: "Solo Leveling — S2E08",
            status: JobStatus.Running,
            started: "2026-07-21T09:12:58Z",
            completed: null,
            error: null,
            expires: null
        },
        {
            id: 5215,
            kind: "provider",
            target: "Dan Da Dan — S1E11",
            status: JobStatus.Failed,
            started: "2026-07-21T08:47:10Z",
            completed: "2026-07-21T08:47:52Z",
            error: "No provider returned a playable stream (429 Too Many Requests)",
            expires: null
        },
        {
            id: 4102,
            kind: "series",
            target: "Dan Da Dan",
            status: JobStatus.Completed,
            started: "2026-07-21T08:46:30Z",
            completed: "2026-07-21T08:47:09Z",
            error: null,
            expires: null
        },
        {
            id: 5214,
            kind: "provider",
            target: "Kaiju No. 8 — S2E03",
            status: JobStatus.Pending,
            started: "2026-07-21T09:15:12Z",
            completed: null,
            error: null,
            expires: null
        },
        {
            id: 4101,
            kind: "series",
            target: "Kaiju No. 8",
            status: JobStatus.Failed,
            started: "2026-07-20T22:03:01Z",
            completed: "2026-07-20T22:03:05Z",
            error: "System.Net.Http.HttpRequestException: The metadata source did not respond within the configured timeout of 30s.\n"
                + " ---> System.Threading.Tasks.TaskCanceledException: The operation was canceled.\n"
                + " ---> System.TimeoutException: The operation timed out.\n"
                + "   at System.Net.Http.HttpConnectionPool.ConnectToTcpHostAsync(String host, Int32 port, HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)\n"
                + "   --- End of inner exception stack trace ---\n"
                + "   at System.Net.Http.HttpConnectionPool.ConnectAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)\n"
                + "   at System.Net.Http.HttpConnectionPool.CreateHttp11ConnectionAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)\n"
                + "   at System.Net.Http.HttpConnectionPool.SendWithVersionDetectionAndRetryAsync(HttpRequestMessage request, Boolean async, Boolean doRequestAuth, CancellationToken cancellationToken)\n"
                + "   --- End of inner exception stack trace ---\n"
                + "   at AniStream.Sync.Providers.MetadataClient.FetchSeriesAsync(String guid, CancellationToken ct) in /src/AniStream.Sync/Providers/MetadataClient.cs:line 142\n"
                + "   at AniStream.Sync.Jobs.SyncSeriesJobHandler.HandleAsync(SyncSeriesJob job, CancellationToken ct) in /src/AniStream.Sync/Jobs/SyncSeriesJobHandler.cs:line 87\n"
                + "   at AniStream.Sync.Worker.SyncDispatcher.RunAsync(CancellationToken ct) in /src/AniStream.Sync/Worker/SyncDispatcher.cs:line 53",
            expires: null
        },
        {
            id: 5213,
            kind: "provider",
            target: "Oshi no Ko — S2E13",
            status: JobStatus.Completed,
            started: "2026-07-20T19:31:44Z",
            completed: "2026-07-20T19:32:19Z",
            error: null,
            expires: "2026-07-27T19:32:19Z"
        },
        {
            id: 4100,
            kind: "series",
            target: "Oshi no Ko",
            status: JobStatus.Completed,
            started: "2026-07-20T19:30:58Z",
            completed: "2026-07-20T19:31:43Z",
            error: null,
            expires: null
        },
        {
            id: 5212,
            kind: "provider",
            target: "Jujutsu Kaisen — S2E23",
            status: JobStatus.Completed,
            started: "2026-07-20T18:02:11Z",
            completed: "2026-07-20T18:02:49Z",
            error: null,
            expires: "2026-07-27T18:02:49Z"
        },
        {
            id: 5211,
            kind: "provider",
            target: "Jujutsu Kaisen — S2E22",
            status: JobStatus.Failed,
            started: "2026-07-20T18:01:30Z",
            completed: "2026-07-20T18:02:10Z",
            error: "Stream expired before download could complete",
            expires: null
        }
    ]);

    public readonly stats: AuditStats = this.computed<AuditStats>(() => ({
        total: this.jobs.length,
        running: this.jobs.filter((j: AuditJob): boolean => j.status === JobStatus.Running).length,
        completed: this.jobs.filter((j: AuditJob): boolean => j.status === JobStatus.Completed).length,
        failed: this.jobs.filter((j: AuditJob): boolean => j.status === JobStatus.Failed).length
    }));

    public readonly filtered: AuditJob[] = this.computed<AuditJob[]>(() => {
        const term: string = this.search.trim().toLowerCase();

        return this.jobs.filter((job: AuditJob): boolean => {
            if (this.kindFilter !== "all" && job.kind !== this.kindFilter) {
                return false;
            }

            if (this.statusFilter !== "all" && job.status !== this.statusFilter) {
                return false;
            }

            if (term.length > 0) {
                return job.target.toLowerCase().includes(term) || String(job.id).includes(term);
            }

            return true;
        });
    });

    public readonly pageCount: number = this.computed<number>(
        () => Math.max(1, Math.ceil(this.filtered.length / this.pageSize))
    );

    public readonly paged: AuditJob[] = this.computed<AuditJob[]>(() => {
        const start: number = (this.page - 1) * this.pageSize;
        return this.filtered.slice(start, start + this.pageSize);
    });

    public readonly rangeStart: number = this.computed<number>(
        () => (this.filtered.length === 0 ? 0 : (this.page - 1) * this.pageSize + 1)
    );

    public readonly rangeEnd: number = this.computed<number>(
        () => Math.min(this.page * this.pageSize, this.filtered.length)
    );

    public setKindFilter(kind: JobKind | "all"): void {
        this.kindFilter = kind;
    }

    public goToPage(page: number): void {
        this.page = Math.min(Math.max(1, page), this.pageCount);
    }

    public prevPage(): void {
        this.goToPage(this.page - 1);
    }

    public nextPage(): void {
        this.goToPage(this.page + 1);
    }

    public openError(job: AuditJob): void {
        this.copied = false;
        this.errorJob = job;
    }

    public closeError(): void {
        this.errorJob = null;
    }

    public async copyError(): Promise<void> {
        if (!this.errorJob?.error) {
            return;
        }

        await navigator.clipboard.writeText(this.errorJob.error);
        this.copied = true;
    }

    public async refresh(): Promise<void> {
        if (this.refreshing) {
            return;
        }

        // No data layer yet — simulate a short reload so the UI feels responsive.
        this.refreshing = true;
        await new Promise<void>((resolve): void => {
            setTimeout(resolve, 600);
        });
        this.refreshing = false;
    }

    public statusLabel(status: JobStatus): string {
        switch (status) {
            case JobStatus.Pending:
                return "Pending";
            case JobStatus.Running:
                return "Running";
            case JobStatus.Completed:
                return "Completed";
            case JobStatus.Failed:
                return "Failed";
            default:
                return "Unknown";
        }
    }

    public statusBadgeClass(status: JobStatus): string {
        switch (status) {
            case JobStatus.Pending:
                return "badge-soft badge-neutral";
            case JobStatus.Running:
                return "badge-soft badge-info";
            case JobStatus.Completed:
                return "badge-soft badge-success";
            case JobStatus.Failed:
                return "badge-soft badge-error";
            default:
                return "badge-soft";
        }
    }

    public formatDateTime(iso: string | null): string {
        if (!iso) {
            return "—";
        }

        const date: Date = new Date(iso);
        return date.toLocaleString(undefined, {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    public duration(job: AuditJob): string {
        if (!job.completed) {
            return job.status === JobStatus.Running ? "running…" : "—";
        }

        const ms: number = new Date(job.completed).getTime() - new Date(job.started).getTime();
        if (ms < 0) {
            return "—";
        }

        const seconds: number = Math.round(ms / 1000);
        if (seconds < 60) {
            return `${seconds}s`;
        }

        const minutes: number = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    }
}
