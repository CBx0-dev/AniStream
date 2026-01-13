import {fetch} from "@tauri-apps/plugin-http";
import userAgent from "random-useragent";
// import type {
//     HlsConfig,
//     Loader,
//     LoaderCallbacks,
//     LoaderConfiguration,
//     LoaderContext,
//     LoaderResponse,
//     LoaderStats
// } from "./hls";

const userAgentIterator: Generator<string> = (function* (): Generator<string>  {
    while (true) {
        const agent: string = userAgent.getRandom();
        yield agent;
        yield agent;
        yield agent;
        yield agent;
        yield agent;
    }
})();

export function getRandomUserAgent(): string {
    return userAgentIterator.next().value;
}

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
//
// export class HLSTauriLoader implements Loader<LoaderContext> {
//     public static activeProvider: providers.SupportedProviders;
//     public static readonly RETRIES: number = 2;
//
//     public context: LoaderContext | null;
//     private callbacks!: LoaderCallbacks<LoaderContext>;
//     public stats: LoaderStats = {
//         aborted: false,
//         loaded: 0,
//         retry: 0,
//         total: 0,
//         chunkCount: 0,
//         bwEstimate: 0,
//         loading: {
//             start: 0,
//             first: 0,
//             end: 0
//         },
//         parsing: {
//             start: 0,
//             end: 0
//         },
//         buffering: {
//             start: 0,
//             first: 0,
//             end: 0
//         }
//     }
//
//     private aborted: boolean;
//
//     public constructor(_: HlsConfig) {
//         this.aborted = false;
//         this.context = null;
//     }
//
//     public load(
//         context: LoaderContext,
//         _: LoaderConfiguration,
//         callbacks: LoaderCallbacks<LoaderContext>) {
//         this.context = context;
//         this.callbacks = callbacks;
//
//         const url: string = context.url;
//         this.tryFetch(1, url, context);
//     }
//
//     private tryFetch(attempt: number, url: string, context: LoaderContext): void {
//         this.stats.loading.start = performance.now();
//         const config: BaseConfig = getConfig();
//
//         const providerHeader: [string, string][] = config.PROVIDER_HEADERS_W[HLSTauriLoader.activeProvider] ?? {};
//         const headers = {...context.headers ?? {}};
//
//         for (const [key, value] of providerHeader) {
//             headers[key] = value;
//         }
//
//         fetch(url, {
//             method: "GET",
//             headers: headers
//         }).then(async response => {
//             if (!response.ok) {
//                 if (attempt < HLSTauriLoader.RETRIES) {
//                     setTimeout(() => this.tryFetch(attempt + 1, url, context), 250);
//                     return;
//                 }
//
//                 this.callbacks.onError({
//                     code: response.status,
//                     text: `Failed to fetch ${url}`
//                 }, context, null, this.stats);
//                 return;
//             }
//
//             if (this.aborted) {
//                 return;
//             }
//
//             const responseData: string | ArrayBuffer = context.responseType == "text"
//                 ? await response.text()
//                 : await response.arrayBuffer()
//
//             this.stats.loading.end = performance.now();
//             this.stats.loaded = typeof responseData == "string" ? responseData.length : responseData.byteLength;
//             this.stats.total = typeof responseData == "string" ? responseData.length : responseData.byteLength;
//
//             const loaderResponse: LoaderResponse = {
//                 url,
//                 data: responseData
//             }
//
//             this.callbacks.onSuccess(loaderResponse, this.stats, context, null);
//         }).catch(error => {
//             if (this.aborted) {
//                 return;
//             }
//
//             if (attempt < HLSTauriLoader.RETRIES) {
//                 setTimeout(() => this.tryFetch(attempt + 1, url, context), 250);
//                 return;
//             }
//
//             this.callbacks.onError({
//                 code: 0,
//                 text: error.toString(),
//             }, context, null, this.stats);
//         });
//     }
//
//     public abort(): void {
//         this.aborted = true;
//     }
//
//     public destroy(): void {
//         this.abort();
//     }
// }