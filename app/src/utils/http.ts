import {fetch} from "@tauri-apps/plugin-http";

export class HTTPError extends Error {
    public readonly response: Response;
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public readonly body: any;

    private constructor(
        message: string,
        response: Response
    ) {
        super(message);
        this.name = 'HTTPError';

        this.response = response;
        this.status = response.status;
        this.statusText = response.statusText;
        this.url = response.url;
    }

    public static async create(response: Response): Promise<HTTPError> {
        let message: string = `HTTP ${response.status}: ${response.statusText} (${response.url})`;

        try {
            let body: string;
            const contentType: string | null = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                body = JSON.stringify(await response.json(), null, 4);
            } else {
                body = await response.text();
            }

            message += "\n\n" + body;
        } catch {
            // If body parsing fails, we skip appending it
        }


        return new HTTPError(message, response);
    }

    public [Symbol.toPrimitive](hint: string): string | number {
        if (hint === 'number') return this.status;
        return this.message;
    }

    public toString(): string {
        return this.message;
    }
}

class HTTPResponse {
    private readonly promise: Promise<Response>;

    public constructor(promise: Promise<Response>) {
        this.promise = promise;
    }

    public async text(): Promise<string> {
        return (await this.getResponse()).text();
    }

    public async json<T extends object>(): Promise<T> {
        return (await this.getResponse()).json();
    }

    public async arrayBuffer(): Promise<ArrayBuffer> {
        return (await this.getResponse()).arrayBuffer();
    }

    public async uint8Array(): Promise<Uint8Array> {
        return new Uint8Array(await this.arrayBuffer());
    }

    public async wait(): Promise<void> {
        await this.getResponse();
    }

    private async getResponse(): Promise<Response> {
        const response: Response = await this.promise;
        if (!response.ok) {
            throw await HTTPError.create(response);
        }

        return response;
    }
}

export function get(url: string, headers: [string, string][] = []): HTTPResponse {
    return new HTTPResponse(fetch(url, {
        method: "GET",
        headers: headers
    }));
}

export function post(url: string, body: RequestInit["body"], headers: [string, string][] = []): HTTPResponse {
    return new HTTPResponse(fetch(url, {
        method: "POST",
        body: body,
        headers: headers
    }));
}

export async function head(url: string, headers: [string, string][], followRedirect: boolean = true): Promise<Response> {
    const response: Response = await fetch(url, {
        method: "HEAD",
        headers: headers,
        redirect: followRedirect ? "follow" : undefined
    });

    if (!response.ok) {
        throw await HTTPError.create(response);
    }

    return response;
}

export async function runHealthz(healthzUrl: string): Promise<boolean> {
    try {
        await get(healthzUrl).wait();
        return true;
    } catch {
        return false;
    }
}