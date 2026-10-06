import {check, Update} from "@tauri-apps/plugin-updater";
import {core} from "@tauri-apps/api";
import {ReadableGlobalContext} from "vue-mvvm";
import {DialogService} from "vue-mvvm/dialog";

import {UpdateService} from "@contracts/update.contract";
import {SettingsService} from "@contracts/settings.contract";

import {ServiceDeclaration} from "@services/declaration";

import {UpdateControlModel} from "@controls/UpdateControl.model";

import * as http from "@utils/http";
import * as AppEnv from "@AppEnv";

type UpdateMetadata = ConstructorParameters<typeof Update>[0];

class UpdateServiceImpl implements UpdateService {
    public static readonly CHECK_OFFSET: number = 2_000;

    private readonly ctx: ReadableGlobalContext;

    public constructor(ctx: ReadableGlobalContext) {
        this.ctx = ctx;
        setTimeout(() => this.checkForUpdates(), UpdateServiceImpl.CHECK_OFFSET);
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

    private async fetchUpdate(settingsService: SettingsService): Promise<Update | null> {
        if (!AppEnv.isClientMode) {
            return await check(); // endpoint from tauri.conf.json
        }

        const metadata: UpdateMetadata | null = await core.invoke<UpdateMetadata | null>("check_update", {
            serverUrl: settingsService.serverUrl.value
        });

        return metadata ? new Update(metadata) : null;
    }

    private async checkForUpdates(): Promise<void> {
        const dialogService: DialogService = this.ctx.getService(DialogService);
        const settingsService: SettingsService = this.ctx.getService(SettingsService);

        if (AppEnv.isClientMode && !settingsService.serverUrl.value) {
            return;
        }

        if (!settingsService.updatesActive ||
            !window.navigator.onLine ||
            !await http.runHealthz(settingsService.healthz.value)
        ) {
            return;
        }

        const update: Update | null = await this.fetchUpdate(settingsService);

        if (!update) {
            return;
        }

        if (settingsService.ignoreVersion.value == update.version) {
            return;
        }

        const updateDialog: UpdateControlModel = dialogService.initDialog(UpdateControlModel, update);
        await updateDialog.openDialog();
    }
}

export default {
    key: UpdateService,
    ctor: UpdateServiceImpl
} satisfies ServiceDeclaration<UpdateService>;