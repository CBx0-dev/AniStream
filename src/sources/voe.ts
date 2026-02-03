import * as http from "@utils/http";

const HEADERS: [string, string][] = [];

const REDIRECT_PATTERN: RegExp = /https?:\/\/[^'"<>]+/;
const B64_PATTERN: RegExp = /var a168c='([^']+)'/;
const HLS_PATTERN: RegExp = /'hls': '(?<hls>[^']+)'/;

const JUNK_PARTS: string[] = ["@$", "^^", "~@", "%?", "*~", "!!", "#&"];


/**
 * Apply ROT13 cipher to alphabetic characters.
 */
function shiftLetters(inputStr: string): string {
    const result: string[] = [];
    for (const c of inputStr) {
        let code: number = c.charCodeAt(0);
        // Uppercase: A-Z
        if (code >= 65 && code <= 90) {
            code = (code - 65 + 13) % 26 + 65;
        }
        // Lowercase a-z
        else if (code >= 97 && code <= 122) {
            code = (code - 97 + 13) % 26 + 97;
        }
        result.push(String.fromCharCode(code));
    }

    return result.join("");
}

/**
 * Replace junk patterns with underscores
 */
function replaceJunk(inputStr: string): string {
    for (const part of JUNK_PARTS) {
        inputStr = inputStr.split(part).join("_");
    }

    return inputStr;
}

/**
 * Shift characters back by n positions.
 */
function shiftBack(s: string, n: number): string {
    return s
        .split('')
        .map(c => String.fromCharCode(c.charCodeAt(0) - n))
        .join('');
}

/**
 * Decode VOE encoded string through multiple transformation steps.
 *
 * @throws Error: If decoding fails at any step
 */
function decodeVOEString(encoded: string): Record<string, any> {
    try {
        const step1: string = shiftLetters(encoded);
        const step2: string = replaceJunk(step1).replace(/_/g, "");
        const step3: string = atob(step2);
        const step4: string = shiftBack(step3, 3);
        const step5: string = atob(step4.reverse());
        return JSON.parse(step5);
    } catch (e) {
        throw "Failed to decode VOE string: " + e;
    }
}

/**
 * Extract VOE source from script tag in HTML.
 * @return Video source URL or None if not found
 */
function extractVOEFromScript(html: string): string | null {
    try {
        const parser: DOMParser = new DOMParser();
        const document: Document = parser.parseFromString(html, "text/html");
        const script: Element | null = document.querySelector("script[type='application/json']");

        if (script && script.textContent) {
            const decoded = decodeVOEString(script.textContent.slice(2, -2));
            return decoded["source"];
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Extract direct video link from VOE embed page.
 *
 * @throws Error: If no direct link is found or processing fails
 * @throws Error: If the request fails
 */
export async function getStream(embeddedVOELink: string): Promise<string> {
    try {
        // Initial request to get redirect URL
        const response: string = await http.get(embeddedVOELink);

        // Find redirect URL using compiled regex
        const redirectMatch: RegExpMatchArray | null = response.match(REDIRECT_PATTERN);
        if (!redirectMatch) {
            throw "No redirect URL found in VOE response.";
        }

        const redirectURL: string = redirectMatch[0];

        // Update provider headers with referer
        const parts: string[] = redirectURL.trim().split("/");
        if (parts.length >= 3) {
            HEADERS.push(["Referer", `${parts[0]}//${parts[2]}/`]);
        }

        let html: string;

        // Follow redirect and get final HTML
        try {
            html = await http.get(redirectURL);
        } catch (e) {
            throw `Failed to follow redirect: ${e}`;
        }

        // Try multiple extractions methods
        // Method 1: Extract from script tag
        const extracted: string | null = extractVOEFromScript(html);
        if (extracted) {
            return extracted;
        }

        // Method 2: Extract from base64 encoded variable
        const b64Match: RegExpMatchArray | null = html.match(B64_PATTERN);
        if (b64Match) {
            try {
                const decoded: string = atob(b64Match[1]).reverse();
                const source: string = JSON.parse(decoded)["source"];
                if (source) {
                    return source;
                }
            } catch {}
        }

        // Method 3: Extract HLS source
        const hlsMatch: RegExpMatchArray | null = html.match(HLS_PATTERN);
        if (hlsMatch) {
            try {
                return atob(hlsMatch.groups!.hls);
            } catch {}
        }

        throw "No video source found using any extraction methods.";
    } catch (e) {
        throw `Unable to process this VOE link: ${e}
        
        Try Using a different provider for now.
        If this issue persists and hasn't been reported yet, please consider creating a new issue.`
    }
}

/**
 * Try to extract the preview image from a VOE embed page.
 *
 * @throws Error: If no redirect or image URL is found
 * @throws Error: If any request fails
 */
export async function getPreviewImage(embeddedVOELink: string): Promise<string> {
    try {
        // Initial request to get redirect URL
        const response: string = await http.get(embeddedVOELink);

        // Find redirect URL using compiled regex
        const redirectMatch: RegExpMatchArray | null = response.match(REDIRECT_PATTERN);
        if (!redirectMatch) {
            throw "No redirect URL found in VOE response.";
        }

        const redirectURL: string = redirectMatch[0];
        const imageURL: string = `${redirectURL.replace("/e/", "/cache/")}_storyboard_L2.jpg"`;

        try {
            await http.get(imageURL);
            return imageURL;
        } catch (e) {
            throw "Preview image not available or invalid: " + e;
        }
    } catch (e) {
        throw `Unable to process this VOE link: ${e}
        
        Try Using a different provider for now.
        If this issue persists and hasn't been reported yet, please consider creating a new issue.`
    }
}

export function getHeaders(): [string, string][] {
    return HEADERS;
}