import {fetch} from "@tauri-apps/plugin-http";

export async function get(url: string, headers: [string, string][] = []): Promise<string> {
    const response: Response = await fetch(url, {
        method: "GET",
        headers: headers
    });

    if (!response.ok) {
        throw `Request failed: HTTP response status ${response.status}`;
    }

    return await response.text();
}

export async function getBinary(url: string, headers: [string, string][] = []): Promise<Uint8Array> {
    const response: Response = await fetch(url, {
        method: "GET",
        headers: headers
    });

    if (!response.ok) {
        throw `Request failed: HTTP response status ${response.status}`;
    }

    const buffer: ArrayBuffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
}

export async function head(url: string, headers: [string, string][], followRedirect: boolean = true): Promise<Response> {
    const response: Response = await fetch(url, {
        method: "HEAD",
        headers: headers,
        redirect: followRedirect ? "follow" : undefined
    });

    if (!response.ok) {
        throw `Request failed: HTTP response status ${response.status}`;
    }

    return await response;
}

export async function post(url: string, headers: [string, string][]): Promise<string> {
    const response: Response = await fetch(url, {
        method: "POST",
        headers: headers
    });

    if (!response.ok) {
        throw `Request failed: HTTP response status ${response.status}`;
    }

    return await response.text();
}
