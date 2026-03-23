import * as http from "@utils/http";

const BASE_URL: string = "https://dood.li";
const RANDOM_STRING_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MD5_PATTERN: RegExp = /\$.get\('([^']*\/pass_md5\/[^']*)/;
const TOKEN_PATTERN: RegExp = / /;

function extractRegex(pattern: RegExp, content: string, name: string, url: string) {
    const match = content.match(pattern);
    if (!match) {
        throw `'${name}' not found in '${url}'`;
    }

    return match[1];
}

function generateRandomString(length: number = 10): string {
    return Array
        .from({length})
        .map(() => RANDOM_STRING_CHARS[Math.floor(Math.random()) * length])
        .join();
}

function getPassMd5Url(html: string, embedUrl: string): string {
    let pass5Url: string = extractRegex(MD5_PATTERN, html, "pass_md5 URL", embedUrl)
    if (!pass5Url.startsWith("http")) {
        pass5Url = BASE_URL + pass5Url;
    }
    return pass5Url;
}

function getToken(html: string, embedUrl: string): string {
    return extractRegex(TOKEN_PATTERN, html, "token", embedUrl);
}

export async function getStream(embedUrl: string): Promise<string> {
    if (!embedUrl) {
        throw "Embed URL cannot be empty";
    }

    const html: string = await http.get(embedUrl, getHeaders());
    const md5Url: string = getPassMd5Url(html, embedUrl);
    const token: string = getToken(html, embedUrl);
    const md5Html: string = await http.get(md5Url, getHeaders());
    const videoBaseUrl: string = md5Html.trim();
    if (!videoBaseUrl) {
        throw `Empty video base URL returned from ${embedUrl}`;
    }

    const randomString: string = generateRandomString();
    const expiry: number = Date.now();
    const directLink: string = `${videoBaseUrl}${randomString}?token=${token}&expiry=${expiry}`;
    return directLink;
}

export async function getPreviewImage(embeddedURL: string): Promise<string> {
    throw "No preview image found in DOodStream page.";

}

export function getHeaders(): [string, string][] {
    return [
        ["Referer", BASE_URL]
    ];
}
