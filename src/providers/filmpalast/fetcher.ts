import {path} from "@tauri-apps/api";
import * as fs from "@tauri-apps/plugin-fs";

import {Provider} from "@services/fetch.service";

import {IInformationFetcher} from "@providers/default";
import {CATALOG_ALPHA_KEYS, FilmpalastProvider} from "@providers/filmpalast/provider";

import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";

import * as http from "@utils/http";
import * as hash from "@utils/hash";


export class FilmpalastFetcher implements IInformationFetcher {
    private readonly provider: FilmpalastProvider;
    private readonly parser: DOMParser;

    public constructor(provider: FilmpalastProvider) {
        this.provider = provider;
        this.parser = new DOMParser();
    }

    public async getCatalog(): Promise<string[]> {
        const guids: string[] = [];
        for (const alpha of CATALOG_ALPHA_KEYS) {
            let page: number = 1;
            while (await this.getCatalogPage(alpha, page, guids)) {
                page++;
            }
        }

        return guids;
    }

    private async getCatalogPage(alpha: string, page: number, guidsRef: string[]): Promise<boolean> {
        const html: string = await http.get(this.provider.catalogURL(alpha, page));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const seriesList: NodeListOf<HTMLElement> = document.querySelectorAll("#content article");
        for (const series of seriesList) {
            const link: HTMLAnchorElement | null = series.querySelector("a");
            if (!link || !link.href) {
                continue;
            }

            const guid: string = link.href.split("/").at(-1);
            if (guidsRef.includes(guid)) {
                return false;
            }
            guidsRef.push(guid);
        }

        return true;
    }

    public async getSeries(guid: string): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]> {
        const html: string = await http.get(this.provider.streamURL(guid));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const informationPanel: HTMLElement | null = document.querySelector("#content");
        if (!informationPanel) {
            throw "Failed to extract meta information: Failed to find movie panel";
        }

        const titleElement: HTMLHeadingElement | null = informationPanel.querySelector("h2");
        const title: string = titleElement ? titleElement.textContent ?? "N/A" : "N/A";

        const descriptionElement: HTMLSpanElement | null = informationPanel.querySelector("span[itemprop=description]");
        const description: string = descriptionElement ? descriptionElement.textContent ?? "N/A" : "N/A";

        const previewImageElement: HTMLImageElement | null = informationPanel.querySelector("img.cover2");

        let previewImage: string | null = null;
        if (previewImageElement && previewImageElement.src) {
            const binary: Uint8Array = await http.getBinary(`${this.provider.baseURL}${previewImageElement.src}`);
            previewImage = hash.fnv1a(guid);

            const storageLocation: string = await this.provider.getStorageLocation();
            const filePath: string = await path.join(storageLocation, previewImage);
            await fs.writeFile(filePath, binary);
        }

        const genres: GenreFetchModel[] = [];
        const genreList: NodeListOf<HTMLAnchorElement> = informationPanel.querySelectorAll("#detail-content-list a[href*='/genre/']");
        for (const anchor of genreList) {
            if (!anchor.href) {
                continue;
            }

            const genre: string = anchor.href.split("/").at(-1);
            genres.push({
                key: genre,
                main: false
            });
        }

        const model: SeriesFetchModel = {
            guid,
            title,
            description,
            preview_image: previewImage
        }

        return [model, genres];
    }

    public async getSeasons(series: SeriesModel): Promise<SeasonFetchModel[]> {
        return [
            {
                series_id: series.series_id,
                season_number: 0
            }
        ];
    }

    public async getEpisodes(series: SeriesModel, _seasonNumber: number): Promise<EpisodeFetchModel[]> {
        return [
            {
                episode_number: 1,
                german_title: series.title,
                english_title: "N/A",
                description: series.description
            }
        ];
    }

    public async fetchProviders(_guid: string, _seasonNumber: number, _episodeNumber: number): Promise<Provider[]> {
        // TODO implement
        return [];
    }
}