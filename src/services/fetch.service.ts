import {path} from "@tauri-apps/api";
import * as fs from "@tauri-apps/plugin-fs";
import {ReadableGlobalContext} from "vue-mvvm";

import * as http from "@utils/http";
import {DefaultProvider, ProviderService} from "@services/provider.service";
import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {GenreFetchModel} from "@models/genre.model";

const FNV_OFFSET_BASIS: bigint = 0xcbf29ce484222325n;
const FNV_PRIME: bigint = 0x100000001b3n;

export class FetchService {
    private readonly providerService: ProviderService;
    private readonly parser: DOMParser;

    public constructor(ctx: ReadableGlobalContext) {
        this.providerService = ctx.getService(ProviderService);
        this.parser = new DOMParser();
    }

    public async getCatalog(): Promise<string[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const html: string = await http.get(provider.catalogURL);
        const document: Document = this.parser.parseFromString(html, "text/html");
        const seriesList: HTMLUListElement | null = document.querySelector("#seriesContainer ul");
        if (!seriesList) {
            throw "Failed to parse meta information: Failed to find series list";
        }

        const guids: string[] = [];

        for (const series of seriesList.children) {
            if (series.children.length != 1 || series.children[0].tagName != "A") {
                continue;
            }

            const seriesLink: HTMLAnchorElement = series.children[0] as HTMLAnchorElement;
            const linkParts: string[] = seriesLink.href.split("/");
            guids.push(linkParts[linkParts.length - 1]);
        }

        return guids;
    }

    public async getSeries(guid: string): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const html: string = await http.get(provider.streamURL(guid));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const informationPanel: HTMLElement | null = document.querySelector("#series");
        if (!informationPanel) {
            throw "Failed to extract meta information: Failed to find series panel";
        }

        const titleElement: HTMLElement | null = informationPanel.querySelector(".series-title h1");
        const title: string = titleElement ? titleElement.textContent ?? "N/A" : "N/A";

        const descriptionElement: HTMLElement | null = informationPanel.querySelector(".seri_des");
        const description: string = descriptionElement && descriptionElement.hasAttribute("data-full-description")
            ? descriptionElement.getAttribute("data-full-description")!
            : "N/A";

        const previewImageElement: HTMLImageElement | null = informationPanel.querySelector(".seriesCoverBox img");

        let previewImage: string | null = null;
        if (previewImageElement && previewImageElement.hasAttribute("data-src")) {
            const url: string = previewImageElement.getAttribute("data-src")!.substring(1);
            const binary: Uint8Array = await http.getBinary(`${provider.baseURL}/${url}`);
            previewImage = this.fnv1aHash(guid);

            const storageLocation: string = await provider.getStorageLocation();
            const filePath: string = await path.join(storageLocation, previewImage);
            await fs.writeFile(filePath, binary);
        }

        const genres: GenreFetchModel[] = [];
        let genreList: HTMLUListElement | null = document.querySelector(".genres ul");
        if (!genreList) {
            throw "Failed to extract genre list";
        }

        let mainGenreKey: string = genreList.getAttribute("data-main-genre") ?? "";
        for (let i: number = 0; i < genreList.children.length; i++) {
            const liElement: HTMLLIElement = genreList.children[i] as HTMLLIElement;
            const anchor: HTMLAnchorElement | null = liElement.children.item(0) as HTMLAnchorElement | null;
            if (!anchor || anchor.tagName != "A") {
                continue;
            }

            const genre: string = anchor.href.split("/").at(-1);
            genres.push({key: genre, main: genre == mainGenreKey});
        }

        const model: SeriesModel = SeriesModel(guid, title, description, previewImage);
        return [model, genres]
    }

    private fnv1aHash(input: string): string {
        let hash: bigint = FNV_OFFSET_BASIS;

        for (let i: number = 0; i < input.length; i++) {
            hash ^= BigInt(input.charCodeAt(i));
            hash = (hash * FNV_PRIME) & 0xffffffffffffffffn;
        }

        const bytes: Uint8Array = new Uint8Array(8);
        for (let i: number = 7; i >= 0; i--) {
            bytes[i] = Number(hash & 0xffn);
            hash >>= 8n;
        }

        const base64: string = btoa(String.fromCharCode(...bytes));
        return base64
            .replace(/\+/g, "-")
            .replace(/\//g, '-')
            .replace(/=+$/, "");
    }
}