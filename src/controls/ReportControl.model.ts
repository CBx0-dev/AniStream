import {arch as getArch, platform as getPlatform} from "@tauri-apps/plugin-os";
import {Component} from "vue";
import {Action, ActionContext} from "vue-mvvm";
import {DialogControl} from "vue-mvvm/dialog";

import ReportControlComponent from "@controls/ReportControl.vue";

import {SettingsService} from "@services/settings.service";

import {I18nService} from "@services/i18n.service";
import I18n from "@/utils/i18n";

import * as packageJSON from "@/../package.json";

export interface ReportResult {
    send: boolean;
    message: string;
}

export class ReportControlModel extends DialogControl implements Action<ReportResult> {
    public static readonly component: Component = ReportControlComponent;
    private settingsService: SettingsService;
    private i18nService: I18nService;
    private actionContext: ActionContext<ReportResult> | null = null;

    public opened: boolean = this.ref(false);
    public title: string = this.ref("");
    public errorStack: string = this.ref("");
    public message: string = this.ref("");
    public platform: string = this.computed(() => `${getPlatform()} ${getArch()}`);
    public lang: string = this.computed(() => this.settingsService.lang.value);
    public theme: string = this.computed(() => this.settingsService.theme.value);
    public version: string = this.computed(() => packageJSON.version);
    public placeholder: string = this.computed(() => this.i18nService.get(I18n.ReportControl.placeholder));

    public constructor(title: string, error: any) {
        super();

        this.settingsService = this.ctx.getService(SettingsService);
        this.i18nService = this.ctx.getService(I18nService);
        this.title = title;
        if (error instanceof Error) {
            this.errorStack = error.stack || error.message;
        } else {
            this.errorStack = JSON.stringify(error, null, 2);
        }
    }

    public onOpen(): void {
        this.opened = true;
    }

    public onClose(): void {
        this.opened = false;

        if (this.actionContext) {
            this.actionContext.completeAction({
                send: false,
                message: ""
            });
        }

        this.destroy();
    }

    public onAction(ctx: ActionContext<ReportResult>): void {
        this.actionContext = ctx;
    }

    public async onCancel(): Promise<void> {
        if (!this.actionContext) {
            return;
        }

        this.actionContext.completeAction({
            send: false,
            message: ""
        });
        this.actionContext = null;

        await this.closeDialog();
    }

    public async onSubmit(): Promise<void> {
        if (!this.actionContext) {
            return;
        }

        this.actionContext.completeAction({
            send: true,
            message: this.message
        });
        this.actionContext = null;
        await this.closeDialog();
    }
}
