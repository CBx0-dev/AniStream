import * as http from "@utils/http";

const HEADERS: [string, string][] = [["Referer", "https://vidmoly.net"]];

const FILE_LINK_PATTERN: RegExp = /file:\s*"(https?:\/\/[^"]+)"/;

/**
 * Extract direct video link from Vidmoly embed page.
 *
 * @throws Error: If no direct link is found
 * @throws Error: If the request fails
 */
export async function getStream(embeddedVidmolyLink: string): Promise<string> {
    try {
        const html: string = await http.get(embeddedVidmolyLink);

        const match: RegExpMatchArray | null = html.match(FILE_LINK_PATTERN);
        if (match) {
            return match[1];
        }
        const parser: DOMParser = new DOMParser();
        const document: Document = parser.parseFromString(html, "text/html");
        const scripts: NodeListOf<HTMLScriptElement> = document.querySelectorAll("script");

        for (const script of scripts.values()) {
            const match: RegExpMatchArray | null = script.innerText.match(FILE_LINK_PATTERN);
            if (match) {
                return match[1];
            }
        }
    } catch (error) {
        throw "Failed to fetch Vidmoly page: " + error;
    }

    throw "No direct link found in Vidmoly page";
}

/**
 * Extract preview image URL from Vidmoly embed page.
 *
 * @throws Error: If no preview image is found
 * @throws Error: If the request fails
 */
export async function getPreviewImage(embeddedVidmolyLink: string): Promise<string> {
    try {
        const html: string = await http.get(embeddedVidmolyLink);

        const match: RegExpMatchArray | null = html.match(/image\s*:\s*"([^"]+\.jpg)"/);
        if (match) {
            return match[1];
        }
    } catch (error) {
        throw "Failed to fetch Vidmoly page: " + error;
    }

    throw "No preview image found in Vidmoly page.";
}

export function getHeaders(): [string, string][] {
    return HEADERS;
}