import * as http from "@utils/http";

const FILE_CODE_PATTERN = /\/[de]\/(?<code>[a-zA-Z0-9]+)/;
const PACKED_JS_PATTERN =
    /eval\(function\(p,a,c,k,e,d\)\{.*?\}\('(?<p>[^']+)',\s*(?<a>\d+),\s*(?<c>\d+),\s*'(?<k>[^']+)'\.split\('\|'\)/s;
const SOURCE_PATTERN =
    /sources\s*:\s*\[\s*\{[^}]*file:\s*['"](?<url>[^'"]+)['"]/s;
const HLS_PATTERN = /['"](?<url>https?:\/\/[^'"]+\.m3u8[^'"]*)['"]/;
const FILE_URL_PATTERN =
    /file\s*:\s*['"](?<url>https?:\/\/[^'"]+)['"]/;

function base64UrlDecode(input: string): Uint8Array {
    let s: string = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad: number = s.length % 4;
    if (pad) {
        s += "=".repeat(4 - pad);
    }

    const binary: string = atob(s);
    const bytes: Uint8Array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function extractFileCode(url: string): string | null {
    const match = FILE_CODE_PATTERN.exec(url);
    return match?.groups?.code ?? null;
}

async function decryptPayload(
    playback: any,
    keyBytes: Uint8Array,
    ivProp: string,
    payloadProp: string
): Promise<any | null> {
    const ivStr: string = playback[ivProp];
    const payloadStr: string = playback[payloadProp];

    if (!ivStr || !payloadStr) {
        return null;
    }

    const iv: Uint8Array = base64UrlDecode(ivStr);
    const ciphertext: Uint8Array = base64UrlDecode(payloadStr);

    if (ciphertext.length <= 16) {
        return null;
    }

    try {
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBytes as BufferSource,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv as BufferSource,
            },
            cryptoKey,
            ciphertext as BufferSource
        );

        const text = new TextDecoder().decode(decrypted);
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function decryptPlaybackData(playback: any): Promise<any | null> {
    const keyParts = playback?.key_parts;
    if (!Array.isArray(keyParts)) return null;

    let keyBytes = new Uint8Array();

    for (const part of keyParts) {
        if (!part) return null;
        const decoded = base64UrlDecode(part);
        const merged = new Uint8Array(keyBytes.length + decoded.length);
        merged.set(keyBytes);
        merged.set(decoded, keyBytes.length);
        keyBytes = merged;
    }

    let result = await decryptPayload(playback, keyBytes, "iv", "payload");
    if (result) return result;

    return decryptPayload(playback, keyBytes, "iv2", "payload2");
}

function extractBestSourceUrl(data: any): string | null {
    if (Array.isArray(data?.sources)) {
        let bestUrl: string | null = null;
        let bestHeight = 0;

        for (const source of data.sources) {
            const url = source?.url;
            const height = source?.height ?? 0;

            if (url && height >= bestHeight) {
                bestUrl = url;
                bestHeight = height;
            }
        }
        if (bestUrl) return bestUrl;
    }

    if (typeof data?.source === "string") return data.source;
    if (typeof data?.file === "string") return data.file;

    return null;
}

async function tryByseApi(
    embedUrl: string,
    fileCode: string
): Promise<string | null> {
    try {
        const parsed = new URL(embedUrl);
        const baseUrl = `${parsed.protocol}//${parsed.host}`;
        const apiUrl = `${baseUrl}/api/videos/${fileCode}`;

        const content: string = await http.get(apiUrl, getHeaders()).text();
        const data = JSON.parse(content);
        const playback = data?.playback;
        if (!playback) return null;

        const decrypted = await decryptPlaybackData(playback);
        if (!decrypted) return null;

        return extractBestSourceUrl(decrypted);
    } catch {
        return null;
    }
}

function decodeBaseN(token: string, radix: number): number {
    if (radix <= 10) return parseInt(token, radix);

    let result = 0;
    for (const c of token) {
        let digit = -1;

        if (c >= "0" && c <= "9") digit = c.charCodeAt(0) - 48;
        else if (c >= "a" && c <= "z") digit = c.charCodeAt(0) - 87;
        else if (c >= "A" && c <= "Z") digit = c.charCodeAt(0) - 29;

        if (digit < 0 || digit >= radix) return -1;

        result = result * radix + digit;
    }
    return result;
}

function unpackJS(
    packed: string,
    radix: number,
    keywords: string[]
): string {
    return packed.replace(/\b(\w+)\b/g, (match) => {
        const index = decodeBaseN(match, radix);
        return index >= 0 && index < keywords.length && keywords[index]
            ? keywords[index]
            : match;
    });
}

function extractUrlFromString(text: string): string | null {
    return (
        HLS_PATTERN.exec(text)?.groups?.url ??
        SOURCE_PATTERN.exec(text)?.groups?.url ??
        FILE_URL_PATTERN.exec(text)?.groups?.url ??
        null
    );
}

function tryExtractFromHtml(html: string): string | null {
    const match = PACKED_JS_PATTERN.exec(html);

    if (match?.groups) {
        const packed: string = match.groups.p;
        const radix: number = parseInt(match.groups.a);
        const keywords: string[] = match.groups.k.split("|");

        const unpacked: string = unpackJS(packed, radix, keywords);
        const url: string | null = extractUrlFromString(unpacked);
        if (url) {
            return url;
        }
    }

    return extractUrlFromString(html);
}

export function getHeaders(): [string, string][] {
    return [];
}

export async function getStream(embedUrl: string): Promise<string> {
    const fileCode: string | null = extractFileCode(embedUrl);

    if (fileCode) {
        const apiUrl: string | null = await tryByseApi(embedUrl, fileCode);
        if (apiUrl) {
            return apiUrl;
        }
    }

    const html: string = await http.get(embedUrl, getHeaders()).text();
    const url: string | null = tryExtractFromHtml(html);

    if (url) {
        return url;
    }

    throw new Error("No Filemoon video source found.");
}

export async function getPreviewImage(_embeddedURL: string): Promise<string> {
    throw "No preview image found in FileMoon page.";
}