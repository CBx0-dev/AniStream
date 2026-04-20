import * as http from "@utils/http";

const HEADERS: [string, string][] = [];

const SOURCE_LINK_PART: RegExp = /src:\s*"([^"]+)"/;

/**
 * Extract direct video link from Vidoza embed page.
 *
 * @throws Error: If no direct link is found
 * @throws Error: If the request fails
 */
export async function getStream(embeddedVidozaLink: string): Promise<string> {
    try {
        const html: string = await http.get(embeddedVidozaLink);
        if (html.search("sourcesCode:") != -1) {
            const match: RegExpMatchArray | null = html.match(SOURCE_LINK_PART);
            if (match) {
                return match[1];
            }
        }
        const parser: DOMParser = new DOMParser();
        const document: Document = parser.parseFromString(html, "text/html");
        const scripts: NodeListOf<HTMLScriptElement> = document.querySelectorAll("script");

        for (const script of scripts.values()) {
            if (script.innerText.search("sourcesCode:") != -1) {
                const match: RegExpMatchArray | null = html.match(SOURCE_LINK_PART);
                if (match) {
                    return match[1];
                }
            }
        }
    } catch (error) {
        throw "Failed to fetch Vidoza page:" + error;
    }

    throw "No direct link found in Vidoza page.";
}

export async function getPreviewImage(): Promise<never> {
    throw "No preview image found in Vidoza page.";
}

export function getHeaders(): [string,  string][] {
    return HEADERS;
}