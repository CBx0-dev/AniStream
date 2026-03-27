import {path} from "@tauri-apps/api";
import * as fs from "@tauri-apps/plugin-fs";

import {DbService} from "@services/db.service";
import {FilmpalastFetcher} from "@providers/filmpalast/fetcher";
import {DefaultProvider, EpisodeLanguage, IInformationFetcher} from "@providers/default";

export const CATALOG_ALPHA_KEYS: string[] = [
    "0-9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
]

export class FilmpalastProvider extends DefaultProvider {
    public static readonly UNIQUE_KEY: string = "filmpalast";
    private fetcher: IInformationFetcher | null;

    public readonly baseURL: string = "http://84.17.47.124";

    public get uniqueKey(): string {
        return FilmpalastProvider.UNIQUE_KEY;
    }

    public constructor(service: DbService) {
        super(service);

        this.fetcher = null;
    }

    public catalogURL(alpha: string, page: number): string {
        return `${this.baseURL}/alpha/${alpha}/${page}`;
    }

    public streamURL(guid: string): string {
        return `${this.baseURL}/stream/${guid}`;
    }

    public seasonURL(_guid: string, _seasonNumber: number): string {
        throw new NotImplementedError();
    }

    public episodeURL(_guid: string, _seasonNumber: number, _episodeNumber: number): string {
        throw new NotImplementedError();
    }

    public async getStorageLocation(): Promise<string> {
        const appDir: string = await path.appDataDir();
        const dataDir: string = await path.join(appDir, FilmpalastProvider.UNIQUE_KEY);

        if (!await fs.exists(dataDir)) {
            await fs.mkdir(dataDir, {
                recursive: true
            });
        }

        return dataDir;
    }

    public encodeLanguageNumber(_id: number): EpisodeLanguage {
        throw new NotImplementedError();
    }

    public getFetcher(): IInformationFetcher {
        if (!this.fetcher) {
            this.fetcher = new FilmpalastFetcher(this);
        }
        return this.fetcher;
    }
}