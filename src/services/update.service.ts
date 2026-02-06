import {check, Update} from "@tauri-apps/plugin-updater";
import {ReadableGlobalContext} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";

import {UpdateControlModel} from "@controls/UpdateControl.model";

export class UpdateService {
    public static readonly CHECK_OFFSET: number = 2_000;

    private readonly ctx: ReadableGlobalContext;

    public constructor(ctx: ReadableGlobalContext) {
        this.ctx = ctx;
        setTimeout(() => this.checkForUpdates(), UpdateService.CHECK_OFFSET);
    }

    public startDownloading(update: Update, onFinish: () => void | Promise<void>, onProgress: (downloadedChunkSize: number) => void | Promise<void>): Promise<number | null> {
        return new Promise<number | null>(async resolve => {
            await update.download(ev => {
                switch (ev.event) {
                    case "Started":
                        resolve(ev.data.contentLength ?? null);
                        break;
                    case "Progress":
                        onProgress(ev.data.chunkLength);
                        break;
                    case "Finished":
                        onFinish();
                        break;
                }
            });
        });
    }

    public async startInstall(update: Update): Promise<void> {
        await update.install();
    }

    private async checkForUpdates(): Promise<void> {
        const dialogService: DialogService = this.ctx.getService(DialogService);

        const update: Update | null = await check();

        if (!update) {
            return;
        }

        const updateDialog: UpdateControlModel = dialogService.initDialog(UpdateControlModel, update);
        await updateDialog.openDialog();
    }
}
