import * as http from "@utils/http";

const HEADERS: [string, string][] = [];

const SPEED_FILES_PATTERN: RegExp = /var _0x5opu234 = "(?<encoded_data>.*?)";/;
const SERVER_DOWN_INDICATOR: string = "<span class=\"inline-block\">Web server is down</span>";

/**
 * Validate and clean the SpeedFiles URL.
 *
 * @throws Error: If URL is invalid
 */
function validateSpeedFilesURL(url: string): string {
    if (!url || !url.trim()) {
        throw "SpeedFiles URL cannot be empty";
    }

    url = url.trim();
    if (!url.startsWith("http://") || url.startsWith("https://")) {
        throw "Invalid URL format - must start with http:// or https://";
    }

    const parsedURL: URL = new URL(url);
    if (!parsedURL.hostname) {
        throw "Invalid URL format - missing domain";
    }

    return url;
}

/**
 * Check if SpeedFiles server is down.
 */
function checkServerStatus(html: string): void {
    if (html.search(SERVER_DOWN_INDICATOR) == -1) {
        throw "THe SpeedFiles server is currently down.";
    }
}

/**
 * Extract encoded data from response text.
 *
 * @throws Error: If encoded data cannot be found
 */
function extractEncodedData(html: string): string {
    const match: RegExpMatchArray | null = html.match(SPEED_FILES_PATTERN);
    if (!match) {
        throw "Failed to extract encoded data: Pattern not found in response text";
    }

    const encodedData: string = match.groups!.encoded_data;
    if (!encodedData) {
        throw "Failed to extract encoded data: Empty encoded data found";
    }

    return encodedData;
}

/**
 * Decode SpeedFiles encoded data using their specific algorithm.
 *
 * @throws Error: If decoding fails
 */
function decodeSpeedFilesData(encodedData: string): string {
    try {
        let decoded: string = atob(encodedData);
        decoded = decoded.swapCase().reverse();
        decoded = atob(decoded).reverse();

        if (decoded.length % 2 != 0) {
            throw "Invalid hex string length";
        }

        const decoded_hex: string = decoded
            .split(/(..)/)
            .filter((_, i) => i % 2 != 0)
            .map(byte => String.fromCharCode(parseInt(byte, 16)))
            .join("");

        const shifted: string = decoded_hex
            .split("")
            .map(c => String.fromCharCode(c.charCodeAt(0) - 3))
            .join("");

        const result: string = atob(shifted.swapCase().reverse());
        if (!result) {
            throw "Decondig resulted in empty string";
        }

        return result;
    } catch (error) {
        throw "Unexpected decoding error: " + error;
    }
}

/**
 * Extract direct video link from SpeedFiles embedded URL.
 *
 * @throws Error: If extraction fails
 */
export async function getStream(embeddedSpeedFilesLink: string): Promise<string> {
    try {
        const validatedURL: string = validateSpeedFilesURL(embeddedSpeedFilesLink);

        const html: string = await http.get(validatedURL, []);
        checkServerStatus(html);

        const encodedData: string = extractEncodedData(html);
        return decodeSpeedFilesData(encodedData);
    } catch (error) {
        throw "Failed to extract video from SpeedFiles: " + error;
    }
}

export async function getPreviewImage(): Promise<string> {
    throw "No preview image found in SpeedFiles page.";
}

export function getHeaders(): [string, string][] {
    return HEADERS;
}