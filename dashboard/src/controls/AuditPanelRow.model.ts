import {UserControl} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";
import {DateTime, type Duration} from "luxon";

import {AuditErrorDialogModel} from "@controls/AuditErrorDialog.model";

import {AuditKind, type AuditModel, AuditStatus} from "@models/audit.model";

export class AuditPanelRowModel extends UserControl {
    private readonly dialogService: DialogService;

    private readonly model: AuditModel;

    public readonly kind: string = this.computed(() => {
        switch (this.model.kind) {
            case AuditKind.Catalog:
                return "Catalog";
            case AuditKind.Series:
                return "Series";
            case AuditKind.Provider:
                return "Provider";
            default:
                return "N/A";
        }
    });

    public readonly expires: string | null = this.computed(() => {
        if (!this.model.expires) {
            return null;
        }

        return DateTime.fromISO(this.model.expires).toLocaleString(DateTime.DATE_SHORT);
    });

    public readonly statusBadgeClasses: string = this.computed(() => {
        switch (this.model.status) {
            case AuditStatus.Queued:
            case AuditStatus.Processing:
                return "badge-info";
            case AuditStatus.Completed:
                return "badge-success";
            case AuditStatus.Failed:
                return "badge-error";
            default:
                return "";
        }
    });

    public readonly statusLabel: string = this.computed(() => {
        switch (this.model.status) {
            case AuditStatus.Queued:
                return "Queued";
            case AuditStatus.Processing:
                return "Running";
            case AuditStatus.Completed:
                return "Completed";
            case AuditStatus.Failed:
                return "Failed";
            default:
                return "N/A";
        }
    });

    public readonly started: string | null = this.computed(() => DateTime.fromISO(this.model.started_at).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS));

    public readonly completed: string | null = this.computed(() => {
        if (!this.model.finished_at) {
            return null;
        }

        return DateTime.fromISO(this.model.started_at).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    });

    public duration: string | null = this.computed(() => {
        if (!this.model.finished_at) {
            return null;
        }

        const start: DateTime = DateTime.fromISO(this.model.started_at);
        const finished: DateTime = DateTime.fromISO(this.model.finished_at);

        const duration: Duration = finished.diff(start);
        return duration.toFormat("m'm' s's'");
    });

    public constructor(model: AuditModel) {
        super();

        this.dialogService = this.ctx.getService(DialogService);

        this.model = model;
    }

    public async onErrorBtn(): Promise<void> {
        const dialog: AuditErrorDialogModel = this.dialogService.initDialog(AuditErrorDialogModel, this.model);
        await dialog.openDialog();
    }
}