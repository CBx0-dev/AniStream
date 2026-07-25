import type {Component} from "vue";
import {DialogControl} from "vue-mvvm/dialog";

import AuditErrorDialog from "@controls/AuditErrorDialog.vue";

import type {AuditModel} from "@models/audit.model";

export class AuditErrorDialogModel extends DialogControl {
    public static readonly component: Component = AuditErrorDialog;
    private readonly model: AuditModel;

    public copied: boolean = this.ref(false);
    public isOpen: boolean = this.ref(false);

    public readonly id: number = this.computed(() => this.model.job_id);
    public readonly title: string = this.computed(() => this.model.job_name);
    public readonly error: string | null = this.computed(() => this.model.error);

    public constructor(model: AuditModel) {
        super();

        this.model = model;
    }

    protected async onOpen(): Promise<void> {
        this.isOpen = true;
    }

    protected async onClose(): Promise<void> {
        this.isOpen = false;

        await new Promise(resolve => setTimeout(resolve, 200));

        this.destroy();
    }

    public async onCopyErrorBtn(): Promise<void> {
        if (!this.error) {
            return;
        }

        await navigator.clipboard.writeText(this.error);
        this.copied = true;
    }


}