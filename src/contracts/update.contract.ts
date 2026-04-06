import type {Update} from "@tauri-apps/plugin-updater";

import {ServiceKey} from "vue-mvvm";

export interface UpdateService {
    startDownloading(update: Update): Promise<number | null>;

    startInstall(update: Update): Promise<void>;
}

export const UpdateService: ServiceKey<UpdateService> = new ServiceKey<UpdateService>("update.service");