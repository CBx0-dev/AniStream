import {path} from "@tauri-apps/api"
import * as fs from "@tauri-apps/plugin-fs";

import {DbService} from "@services/db.service";

import {StoFetcher} from "@providers/sto/fetcher";
import {DefaultProvider, EpisodeLanguage, IInformationFetcher} from "@providers/default";

export class StoProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "sto";

    private fetcher: IInformationFetcher | null;

    public readonly baseURL: string = "http://186.2.175.5";

    public get uniqueKey(): string {
        return StoProvider.UNIQUE_KEY;
    }

    public get catalogURL(): string {
        return `${this.baseURL}/serien-alphabet`;
    }

    public constructor(service: DbService) {
        super(service);

        this.fetcher = null;
    }

    public streamURL(guid: string): string {
        return `${this.baseURL}/serie/stream/${guid}`;
    }

    public seasonURL(guid: string, seasonNumber: number): string {
        return `${this.baseURL}/serie/stream/${guid}/staffel-${seasonNumber}`;
    }

    public episodeURL(guid: string, seasonNumber: number, episodeNumber: number): string {
        return `${this.seasonURL(guid, seasonNumber)}/episode-${episodeNumber}`;
    }

    public async getStorageLocation(): Promise<string> {
        const appDir: string = await path.appDataDir();
        const dataDir: string = await path.join(appDir, "sto");

        if (!await fs.exists(dataDir)) {
            await fs.mkdir(dataDir, {
                recursive: true
            });
        }

        return dataDir;
    }

    public encodeLanguageNumber(id: number): EpisodeLanguage {
        switch (id) {
            case 1:
                return EpisodeLanguage.DE_DUB;
            case 2:
                return EpisodeLanguage.EN_DUB
            default:
                return EpisodeLanguage.UNKNOWN;
        }
    }

    public getFetcher(): IInformationFetcher {
        if (!this.fetcher) {
            this.fetcher = new StoFetcher(this);
        }
        return this.fetcher;
    }
}
