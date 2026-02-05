import {arch as getArch, platform as getPlatform} from "@tauri-apps/plugin-os";
import * as fs from "@tauri-apps/plugin-fs";
import * as path from "@tauri-apps/api/path";
import {UserControl} from "vue-mvvm";

import * as packageJSON from "@/../package.json";
import {ProviderService} from "@services/provider.service";

export class InfoControlModel extends UserControl {
    private readonly providerService: ProviderService;

    public version: string = this.computed(() => packageJSON.version);
    public platform: string = this.computed(() => `${getPlatform()} ${getArch()}`);
    public aniworldMetadataUsage: number = this.ref(0);
    public aniworldMetadataUsagePercentage: number = this.computed(() => this.aniworldMetadataUsage / this.totalUsage * 100);
    public aniworldAssetsUsage: number = this.ref(0)
    public aniworldAssetsUsagePercentage: number = this.computed(() => this.aniworldAssetsUsage / this.totalUsage * 100);
    public stoMetadataUsage: number = this.ref(0);
    public stoMetadataUsagePercentage: number = this.computed(() => this.stoMetadataUsage / this.totalUsage * 100);
    public stoAssetsUsage: number = this.ref(0);
    public stoAssetsUsagePercentage: number = this.computed(() => this.stoAssetsUsage / this.totalUsage * 100);

    public totalUsage: number = this.computed(() => this.aniworldMetadataUsage + this.aniworldAssetsUsage + this.stoMetadataUsage + this.stoAssetsUsage)

    public constructor() {
        super();

        this.providerService = this.ctx.getService(ProviderService);
    }

    public async mounted(): Promise<void> {
        this.analyzeSpaceUsage()
    }

    public async analyzeSpaceUsage(): Promise<void> {
        this.aniworldMetadataUsage = 0;
        this.aniworldAssetsUsage = 0;
        this.stoAssetsUsage = 0;
        this.stoMetadataUsage = 0;
        const [aniworldLocation, stoLocation] = await Promise.all([
            this.providerService.ANIWORLD.getStorageLocation(),
            this.providerService.STO.getStorageLocation()
        ]);

        const aniworldWalker: Promise<void> = this.walkTree(aniworldLocation, async (entry: fs.DirEntry, stat: fs.FileInfo): Promise<void> => {
            if (this.isMetadata(this.providerService.ANIWORLD.uniqueKey, entry)) {
                this.aniworldMetadataUsage += stat.size;
            } else {
                this.aniworldAssetsUsage += stat.size;
            }
        });

        const stoWalker: Promise<void> = this.walkTree(stoLocation, async (entry: fs.DirEntry, stat: fs.FileInfo): Promise<void> => {
            if (this.isMetadata(this.providerService.STO.uniqueKey, entry)) {
                this.stoMetadataUsage += stat.size;
            } else {
                this.stoAssetsUsage += stat.size;
            }
        });

        await Promise.allSettled([aniworldWalker, stoWalker]);
    }

    public round(value: number, postPoints: number): number {
        const factor: number = Math.pow(10, postPoints);
        return Math.round(value * factor) / factor;
    }

    public formatBytes(bytes: number, postPoints: number = 2): string {
        if (!Number.isFinite(bytes)) {
            return "N/A";
        }

        const units: string[] = ["B", "KB", "MB", "GB"];


        let value: number = Math.abs(bytes);
        let index: number = 0;

        while (value >= 1000 && index < units.length - 1) {
            value /= 1000;
            index++;
        }

        const rounded: number = this.round(value, postPoints);

        return `${rounded} ${units[index]}`;
    }

    private async walkTree(startFolder: string, cb: (entry: fs.DirEntry, stat: fs.FileInfo) => Promise<void>): Promise<void> {
        const entries: fs.DirEntry[] = await fs.readDir(startFolder);
        for (const entry of entries) {
            const fullPath: string = await path.join(startFolder, entry.name);

            if (entry.isDirectory) {
                await this.walkTree(fullPath, cb);
                continue;
            }

            const stat: fs.FileInfo = await fs.lstat(fullPath);
            await cb(entry, stat);
        }
    }

    private isMetadata(_providerKey: string, entry: fs.DirEntry): boolean {
        return entry.name == "metadata.db";
    }
}