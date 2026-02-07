import {type Update} from "@tauri-apps/plugin-updater";
import {Component} from "vue";
import {DialogControl} from "vue-mvvm/dialog";

import UpdateControl from "@controls/UpdateControl.vue";

import {UpdateService} from "@services/update.service";
import {SettingsService} from "@services/settings.service";

import {MarkdownParser} from "@utils/markdown";

const enum UpdateState {
    PROMPT,
    DOWNLOADING,
    RESTARTING
}

export class UpdateControlModel extends DialogControl {
    public static component: Component = UpdateControl;

    private parser: MarkdownParser;
    private settingsService: SettingsService;
    private updateService: UpdateService;
    private update: Update;

    private state: UpdateState = this.ref(UpdateState.PROMPT);

    public opened: boolean = this.ref(false);
    public ignoreThisUpdate: boolean = this.ref(false);
    public total: number | null = this.ref(0);
    public downloaded: number = this.ref(0);

    public currentVersion: string = this.computed(() => this.update.currentVersion);
    public updatingVersion: string = this.computed(() => this.update.version);
    public body: string | null = this.computed(() => this.update.body ? this.parser.parse(this.update.body) : null);
    public isPromptState: boolean = this.computed(() => this.state == UpdateState.PROMPT);
    public isDownloadingState: boolean = this.computed(() => this.state == UpdateState.DOWNLOADING);
    public isRestartingState: boolean = this.computed(() => this.state == UpdateState.RESTARTING);

    public constructor(update: Update) {
        super();

        this.parser = new MarkdownParser();
        this.settingsService = this.ctx.getService(SettingsService);
        this.updateService = this.ctx.getService(UpdateService);

        this.update = update;
    }

    public onOpen(): void {
        this.opened = true;
    }

    public onClose(): void {
        this.opened = false;

        this.destroy();
    }

    public async onCancel(): Promise<void> {
        if (!this.isPromptState) {
            return;
        }

        if (this.ignoreThisUpdate) {
            this.settingsService.ignoreVersion = this.update.version;
        }

        await this.closeDialog();
    }

    public async onStart(): Promise<void> {
        this.downloaded = 0;

        this.total = await this.updateService.startDownloading(this.update, () => {
            this.state = UpdateState.RESTARTING;
        }, inc => {
            this.downloaded += inc;
        });

        this.state = UpdateState.DOWNLOADING;
    }

    public async onInstallBtn(): Promise<void> {
        await this.updateService.startInstall(this.update);
    }
}