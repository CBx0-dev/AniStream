import * as http from "@utils/http";

const HEADERS: [string, string][] = [];

/**
 * Validate and clean the LoadX URL.
 *
 * @throws Error: If URL is invalid
 */
function validateLoadXURL(url: string): string {
    if (!url || !url.trim()) {
        throw "LoadX URL cannot be empty";
    }

    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw "Invalid URL format - must start with http:// or https://";
    }

    const parsedUrl: URL = new URL(url);
    if (!parsedUrl.hostname) {
        throw "Invalid URL format - missing domain";
    }

    return url;
}

/**
 * Extract ID hash and host from LoadX URL.
 *
 * @throws Error: If URL structure is invalid
 */
function extractIdHashFromURL(url: string): [idHash: string, host: string] {
    const paresdURL: URL = new URL(url);
    const pathParts: string[] = paresdURL.pathname.split("/");
    if (pathParts.length < 3) {
        throw "Invalid LoadX URL structure - insufficient path components";
    }

    const idHash: string = pathParts[2];
    const host = paresdURL.hostname;

    if (!idHash) {
        throw "Invalid LoadX URL - missing id hash";
    }

    if (!host) {
        throw "Invalid LoadX URL - missing host";
    }

    return [idHash, host];
}

/**
 * Parse video URL from response text.
 *
 * @throws Error: If parsing fails or video URL not found
 */
function parseVideoResponse(response: string): string {
    if (!response) {
        throw "Empty response received";
    }

    const data: any = JSON.parse(response);
    const videoURL: unknown = data["videoSource"];

    if (!videoURL) {
        throw "No video source found in response";
    }

    if (typeof videoURL != "string" || !videoURL.trim()) {
        throw "Invalid video URL format;"
    }

    return videoURL.trim();
}

/**
 * Extract direct video link from LoadX embedded URL.
 *
 * @throws Error: If extraction fails
 */
export async function getStream(embeddedLoadXLink: string): Promise<string> {
    try {
        const validatedURL: string = validateLoadXURL(embeddedLoadXLink);

        const response: Response = await http.head(validatedURL, [], true);
        const [idHash, host] = extractIdHashFromURL(response.url);

        const postURL: string = `https://${host}/player/index.php?data=${idHash}&do=getVideo`;
        const apiResponse: string = await http.post(postURL, [["X-Requested-With", "XMLHttpRequest"]]);

        return parseVideoResponse(apiResponse);
    } catch (error) {
        throw "Unexpected error extracting LoadX video: " + error;
    }
}

export async function getPreviewImage(): Promise<string> {
    throw "No preview image found in LoadX page.";
}

export function getHeaders(): [string, string][] {
    return HEADERS;
}