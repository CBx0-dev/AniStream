import * as http from "@utils/http";

const LULUVDO_USER_AGENT: string = "Mozilla/5.0 (Android 15; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0";

const HEADERS: [string, string][] = [["User-Agent", LULUVDO_USER_AGENT]];


/**
 * Valdiate and clean the LuluVDO URL.
 *
 * @throws Error: If URL is invalid
 */
function validateLuluvdoURL(url: string): string {
    if (!url || !url.trim()) {
        throw "LuluVDO URL cannot be empty";
    }

    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw "Invalid URL format - must start with http:// or https://";
    }

    const parsedURL = new URL(url);
    if (!parsedURL.hostname) {
        throw "Invalid URL format - missing domain";
    }

    if (parsedURL.hostname.toLowerCase().search("luluvdo.com") == -1) {
        throw "URL must be from luluvdo.com domain";
    }

    return url;
}

/**
 * Extract LuluVDO ID from URL.
 *
 * @throws Error: If ID cannot be extracted
 */
function extractLuluvdoId(url: string): string {
    const urlParts: string[] = url.split("/");
    if (urlParts.length == 1) {
        throw "Invalid URL structure";
    }

    let luluvdoId: string = urlParts[urlParts.length - 1];
    if (!luluvdoId) {
        throw "No ID found in URL";
    }

    if (luluvdoId.search("?") != -1) {
        luluvdoId = luluvdoId.split("?")[0];
    }

    if (!luluvdoId) {
        throw "Empty ID after processing";
    }

    return luluvdoId;
}

/**
 * Build embed URL for LuluVDO.
 */
function buildEmbedURL(luluvdoId: string): string {
    return `https://luluvdo.com/dl?op=embed&file_code=${luluvdoId}&embed=1&referer=luluvdo.com&adb=0`;
}

/**
 * Build headers for LuluVDO request
 */
function buildHeaders(args: any = null): [string, string][] {
    const headers: [string, string][] = [
        ["Origin", "https://luluvdo.com"],
        ["Referer", "https://luluvdo.com/"],
        ["User-Agent", LULUVDO_USER_AGENT]
    ];

    if (args && "action" in args && args.action == "Download") {
        headers.push(["Accept-Language", "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7"]);
    }

    return headers;
}

/**
 * Extract video URL from response text.
 *
 * @throws Error: If video URL cannot be extracted
 */
export function extractVideoURL(html: string): string {
    try {
        if (!html) {
            throw "Empy HTML recieved";
        }

        const matches: RegExpExecArray[] = Array.from(html.matchAll(/file:\s*"([^"]+)"/));
        if (matches.length == 0) {
            throw "No video URL found in html";
        }

        const vidoeURL: string = matches[0][1].trim();
        if (!vidoeURL) {
            throw "Empty video URL";
        }

        return vidoeURL;
    } catch (error) {
        throw "Failed to extract vidoe URL: " + error;
    }
}

/**
 * Extract direct video link from LuluVDO embedded URL.
 *
 * @throws Error: If extraction fails
 */
export async function getStream(embeddedLuluvdoLink: string): Promise<string> {
    try {
        const validatedURL: string = validateLuluvdoURL(embeddedLuluvdoLink);
        const luluvdoId: string = extractLuluvdoId(validatedURL);
        const embedURL: string = buildEmbedURL(luluvdoId);
        const headers: [string, string][] = buildHeaders();

        const html: string = await http.get(embedURL, headers);
        return extractVideoURL(html);
    } catch (error) {
        throw "Failed to extract video from LuluVDO: " + error;
    }
}

export async function getPreviewImage(): Promise<string> {
    throw "No preview image found in LuluVDO page.";
}

export function getHeaders(): [string, string][] {
    return HEADERS;
}