import {path} from "@tauri-apps/api";
import * as fs from "@tauri-apps/plugin-fs";
import {ReadableGlobalContext} from "vue-mvvm";

import * as http from "@utils/http";
import {DefaultProvider, EpisodeLanguage, ProviderService} from "@services/provider.service";
import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";

const FNV_OFFSET_BASIS: bigint = 0xcbf29ce484222325n;
const FNV_PRIME: bigint = 0x100000001b3n;

export interface Provider {
    name: string;
    language: EpisodeLanguage;
    embeddedURL: string;
}

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

    public async getSeasons(series: SeriesModel): Promise<SeasonFetchModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const html: string = await http.get(provider.streamURL(series.guid));
        const document: Document = this.parser.parseFromString(html, "text/html");
        const streamPanel: HTMLElement | null = document.querySelector("#stream");
        if (!streamPanel) {
            throw "Failed to extract meta information: Failed to find stream panel";
        }

        const lists: HTMLUListElement[] = Array.from(streamPanel.querySelectorAll("ul"));
        if (lists.length != 2) {
            throw "Failed to parse meta information: Failed to find list items";
        }

        const seasons: SeasonFetchModel[] = [];

        for (let i: number = 1; i < lists[0].children.length; i++) {
            const li: HTMLLIElement = lists[0].children[i] as HTMLLIElement;
            if (li.children.length != 1 || li.children[0].tagName != "A") {
                continue;
            }

            const a: HTMLAnchorElement = li.children[0] as HTMLAnchorElement;
            const seasonNumber: number = a.innerText == "Filme"
                ? 0
                : parseInt(a.innerText);

            seasons.push({
                series_id: series.series_id,
                season_number: seasonNumber
            });
        }

        return seasons;
    }

    public async getEpisodes(guid: string, seasonNumber: number): Promise<EpisodeFetchModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const html: string = await http.get(provider.seasonURL(guid, seasonNumber));
        const document: Document = this.parser.parseFromString(html, "text/html");
        const tableBody: HTMLTableSectionElement | null = document.querySelector(`#season${seasonNumber}`);

        if (!tableBody) {
            throw "Failed to extract meta information: Failed to find episode table";
        }

        const episodes: EpisodeFetchModel[] = [];
        for (const row of tableBody.rows) {
            if (!row.hasAttribute("data-episode-season-id")) {
                continue;
            }

            const episodeNumber: number = parseInt(row.getAttribute("data-episode-season-id")!);

            const germanTitleElement: HTMLElement | null = row.querySelector(".seasonEpisodeTitle > a > strong");
            const germanTitle: string = germanTitleElement ? germanTitleElement.textContent ?? "N/A" : "N/A";

            const englishTitleElement: HTMLElement | null = row.querySelector(".seasonEpisodeTitle > a > span");
            const englishTitle: string = englishTitleElement ? englishTitleElement.textContent ?? "N/A" : "N/A";

            const description: string = await this.fetchDescription(guid, seasonNumber, episodeNumber);

            episodes.push({
                episode_number: episodeNumber,
                german_title: germanTitle.trim(),
                english_title: englishTitle.trim(),
                description: description.trim(),
            });
        }

        return episodes;
    }

    private async fetchDescription(guid: string, seasonNumber: number, episodeNumber: number): Promise<string> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const html: string = await http.get(provider.episodeURL(guid, seasonNumber, episodeNumber));
        const document: Document = this.parser.parseFromString(html, "text/html");
        const descriptionPanel: HTMLElement | null = document.querySelector("#wrapper div.hosterSiteTitle p.descriptionSpoiler");
        if (!descriptionPanel) {
            return "";
        }

        return descriptionPanel.textContent ?? "";
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

    public async fetchProviders(guid: string, seasonNumber: number, episodeNumber: number): Promise<Provider[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();
        const html: string = await http.get(provider.episodeURL(guid, seasonNumber, episodeNumber));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const row: HTMLUListElement | null = document.querySelector(".hosterSiteVideo ul.row");
        if (!row) {
            throw "Failed to extract meta information: Failed to find provider row";
        }

        const providers: Provider[] = [];
        for (const child of row.children) {
            if (!child.hasAttribute("data-link-target") || !child.hasAttribute("data-lang-key")) {
                continue;
            }

            const languageId: number = parseInt(child.getAttribute("data-lang-key")!);
            const language: EpisodeLanguage = provider.encodeLanguageNumber(languageId);
            if (language == EpisodeLanguage.UNKNOWN) {
                continue;
            }
            const embeddedPath: string = child.getAttribute("data-link-target")!;
            const embeddedURL: string = provider.baseURL + "/" + embeddedPath.substring(1);

            const providerNameElement: HTMLHeadingElement | null = child.querySelector("h4");
            if (providerNameElement == null) {
                continue;
            }

            try {
                const name: string = providerNameElement.textContent!;

                providers.push({
                    name,
                    language,
                    embeddedURL
                });
            } catch (e) {
                console.warn(e);
            }
        }

        return providers;
    }
}