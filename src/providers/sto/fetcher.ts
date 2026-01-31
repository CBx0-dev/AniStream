import {path} from "@tauri-apps/api";
import * as fs from "@tauri-apps/plugin-fs";

import {Provider} from "@services/fetch.service";
import {DefaultProvider, EpisodeLanguage, IInformationFetcher} from "@providers/default";

import {SeriesFetchModel, SeriesModel} from "@models/series.model";
import {GenreFetchModel} from "@models/genre.model";
import {SeasonFetchModel} from "@models/season.model";
import {EpisodeFetchModel} from "@models/episode.model";

import * as http from "@utils/http";
import * as hash from "@utils/hash";


export class StoFetcher implements IInformationFetcher {
    private readonly provider: DefaultProvider;
    private readonly parser: DOMParser;

    public constructor(provider: DefaultProvider) {
        this.provider = provider;
        this.parser = new DOMParser();
    }

    public async getCatalog(): Promise<string[]> {
        const html: string = await http.get(this.provider.catalogURL);
        const document: Document = this.parser.parseFromString(html, "text/html");
        const seriesLists: NodeListOf<HTMLUListElement> = document.querySelectorAll("ul.series-list");
        if (seriesLists.length == 0) {
            throw "Failed to parse meta information: Failed to find series list";
        }

        const guids: string[] = [];

        for (const list of seriesLists.values()) {
            for (const item of list.children) {
                if (item.children.length != 1 || item.children[0].tagName != "A") {
                    continue;
                }
                const seriesLink: HTMLAnchorElement = item.children[0] as HTMLAnchorElement;
                const linkParts: string[] = seriesLink.href.split("/");
                guids.push(linkParts[linkParts.length - 1]);
            }

        }

        return guids;
    }

    public async getSeries(guid: string): Promise<[model: SeriesFetchModel, genres: GenreFetchModel[]]> {
        const html: string = await http.get(this.provider.streamURL(guid));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const titleElement: HTMLElement | null = document.querySelector("div.show-header-wrapper > div.container-fluid.px-2.px-md-3.px-lg-3.px-xl-4.position-relative > div.row.g-4.mb-2 > div.col-12.col-md-9.col-lg-10.text-light > h1")
        if (!titleElement) {
            throw "Cannot find title element";
        }
        const title: string = titleElement.textContent!.trim();

        const descriptionElement: HTMLElement | null = document.querySelector("span.description-text");
        const description: string = descriptionElement?.innerText.trim() ?? "N/A";
        const previewImageElement: HTMLImageElement | null = document.querySelector("body > div.show-header-wrapper > div.container-fluid.px-2.px-md-3.px-lg-3.px-xl-4.position-relative > div.row.g-4.mb-2 > div.col-3.col-md-3.col-lg-2.d-none.d-md-block > picture > img")

        let previewImage: string | null = null;
        if (previewImageElement && previewImageElement.hasAttribute("data-src")) {
            let url: string = previewImageElement.getAttribute("data-src")!;
            if (!url.startsWith("http")) {
                if (!url.startsWith("/")) {
                    url = "/" + url;
                }
                url = `${this.provider.baseURL}${url}`;
            }
            const binary: Uint8Array = await http.getBinary(url);
            previewImage = hash.fnv1a(guid);

            const storageLocation: string = await this.provider.getStorageLocation();
            const filePath: string = await path.join(storageLocation, previewImage);
            await fs.writeFile(filePath, binary);
        }

        const genres: GenreFetchModel[] = [];
        let genreList: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("body > div.show-header-wrapper > div.container-fluid.px-2.px-md-3.px-lg-3.px-xl-4.position-relative > div.row.g-4.mb-2 > div.col-12.col-md-9.col-lg-10.text-light > ul > li:nth-child(5) a");
        if (!genreList) {
            throw "Failed to extract genre list";
        }

        for (let anchorElement of genreList.values()) {
            const genre: string = anchorElement.href.split("/").at(-1);
            genres.push({key: genre, main: false});
        }

        const model: SeriesModel = SeriesModel(guid, title, description, previewImage);
        return [model, genres]
    }

    public async getSeasons(series: SeriesModel): Promise<SeasonFetchModel[]> {
        const html: string = await http.get(this.provider.streamURL(series.guid));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const seasonElements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("#season-nav > ul a")
        if (seasonElements.length == 0) {
            throw "Failed to fetch season information";
        }

        const seasons: SeasonFetchModel[] = [];

        for (let seasonElement of seasonElements.values()) {
            if (!seasonElement.hasAttribute("data-season-pill")) {
                continue;
            }
            let seasonNumber: number = parseInt(seasonElement.getAttribute("data-season-pill")!);

            seasons.push({
                series_id: series.series_id,
                season_number: seasonNumber
            });
        }

        return seasons;
    }

    public async getEpisodes(guid: string, seasonNumber: number): Promise<EpisodeFetchModel[]> {
        const html: string = await http.get(this.provider.seasonURL(guid, seasonNumber));
        const document: Document = this.parser.parseFromString(html, "text/html");
        const tableBody: HTMLTableSectionElement | null = document.querySelector(`table.episode-table`);

        if (!tableBody) {
            throw "Failed to extract meta information: Failed to find episode table";
        }

        const episodes: EpisodeFetchModel[] = [];
        for (const row of tableBody.rows) {
            if (!row.classList.contains("episode-row")) {
                continue;
            }

            if (row.children.length < 2) {
                continue;
            }

            const episodeNumber: number = parseInt((row.children.item(0)! as HTMLElement).innerText);

            const germanTitleElement: HTMLElement | null = row.children.item(1)!.querySelector("strong");
            const germanTitle: string = germanTitleElement ? germanTitleElement.title ?? "N/A" : "N/A";

            const englishTitleElement: HTMLElement | null = row.querySelector("span");
            const englishTitle: string = englishTitleElement ? englishTitleElement.title ?? "N/A" : "N/A";

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
        const html: string = await http.get(this.provider.episodeURL(guid, seasonNumber, episodeNumber));
        const document: Document = this.parser.parseFromString(html, "text/html");
        const descriptionPanel: HTMLElement | null = document.querySelector("[id^='desc-'] > div");
        if (!descriptionPanel) {
            return "";
        }

        return descriptionPanel.textContent?.trim() ?? "";
    }

    public async fetchProviders(guid: string, seasonNumber: number, episodeNumber: number): Promise<Provider[]> {
        const html: string = await http.get(this.provider.episodeURL(guid, seasonNumber, episodeNumber));
        const document: Document = this.parser.parseFromString(html, "text/html");

        const providerElements: NodeListOf<HTMLButtonElement> = document.querySelectorAll("#episode-links button");

        const providers: Provider[] = [];
        for (const providerElement of providerElements.values()) {
            if (!providerElement.hasAttribute("data-play-url") ||
                !providerElement.hasAttribute("data-language-id") ||
                !providerElement.hasAttribute("data-provider-name")) {
                continue;
            }

            const languageId: number = parseInt(providerElement.getAttribute("data-language-id")!);
            const language: EpisodeLanguage = this.provider.encodeLanguageNumber(languageId);
            if (language == EpisodeLanguage.UNKNOWN) {
                continue;
            }
            const embeddedPath: string = providerElement.getAttribute("data-play-url")!;
            const embeddedURL: string = this.provider.baseURL + embeddedPath;

            const name: string = providerElement.getAttribute("data-provider-name")!;

            providers.push({
                name,
                language,
                embeddedURL
            });
        }

        return providers;
    }
}
