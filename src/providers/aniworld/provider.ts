import {path} from "@tauri-apps/api"
import * as fs from "@tauri-apps/plugin-fs";

import {DbService} from "@services/db.service";
import {AniWorldFetcher} from "@providers/aniworld/fetcher";
import {DefaultProvider, EpisodeLanguage, IInformationFetcher} from "@providers/default";

export class AniWorldProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "aniworld";
    private fetcher: IInformationFetcher | null;

    public readonly baseURL: string = "https://aniworld.to";

    public get uniqueKey(): string {
        return AniWorldProvider.UNIQUE_KEY;
    }

    public get catalogURL(): string {
        return `${this.baseURL}/animes-alphabet`;
    }

    public get streamURLBase(): string {
        return `${this.baseURL}/anime/stream`;
    }

    public constructor(service: DbService) {
        super(service);

        this.fetcher = null;
    }

    public async getStorageLocation(): Promise<string> {
        const appDir: string = await path.appDataDir();
        const dataDir: string = await path.join(appDir, "aniworld");

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
                return EpisodeLanguage.EN_SUP
            case 3:
                return EpisodeLanguage.DE_SUP;
            default:
                return EpisodeLanguage.UNKNOWN;
        }
    }

    public getFetcher(): IInformationFetcher {
        if (!this.fetcher) {
            this.fetcher = new AniWorldFetcher(this);
        }
        return this.fetcher;
    }
}
