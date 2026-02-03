import {fetch} from "@tauri-apps/plugin-http";

import * as Hls from "hls.js";
import {IStreamSource} from "@sources"

export class HLSTauriLoader implements Hls.Loader<Hls.LoaderContext> {
    public static activeSource: IStreamSource | null;
    public static readonly RETRIES: number = 2;

    public context: Hls.LoaderContext | null;
    private callbacks!: Hls.LoaderCallbacks<Hls.LoaderContext>;
    public stats: Hls.LoaderStats = {
        aborted: false,
        loaded: 0,
        retry: 0,
        total: 0,
        chunkCount: 0,
        bwEstimate: 0,
        loading: {
            start: 0,
            first: 0,
            end: 0
        },
        parsing: {
            start: 0,
            end: 0
        },
        buffering: {
            start: 0,
            first: 0,
            end: 0
        }
    }

    private aborted: boolean;

    public constructor(_: Hls.HlsConfig) {
        this.aborted = false;
        this.context = null;
    }

    public load(
        context: Hls.LoaderContext,
        _: Hls.LoaderConfiguration,
        callbacks: Hls.LoaderCallbacks<Hls.LoaderContext>) {
        this.context = context;
        this.callbacks = callbacks;

        const url: string = context.url;
        this.tryFetch(1, url, context);
    }

    private tryFetch(attempt: number, url: string, context: Hls.LoaderContext): void {
        this.stats.loading.start = performance.now();
        if (!HLSTauriLoader.activeSource) {
            throw "Missing source context";
        }

        const providerHeader: [string, string][] = HLSTauriLoader.activeSource.getHeaders() ?? [];
        const headers = {...context.headers ?? {}};

        for (const [key, value] of providerHeader) {
            headers[key] = value;
        }

        fetch(url, {
            method: "GET",
            headers: headers
        }).then(async response => {
            if (!response.ok) {
                if (attempt < HLSTauriLoader.RETRIES) {
                    setTimeout(() => this.tryFetch(attempt + 1, url, context), 250);
                    return;
                }

                this.callbacks.onError({
                    code: response.status,
                    text: `Failed to fetch ${url}`
                }, context, null, this.stats);
                return;
            }

            if (this.aborted) {
                return;
            }

            const responseData: string | ArrayBuffer = context.responseType == "text"
                ? await response.text()
                : await response.arrayBuffer()

            this.stats.loading.end = performance.now();
            this.stats.loaded = typeof responseData == "string" ? responseData.length : responseData.byteLength;
            this.stats.total = typeof responseData == "string" ? responseData.length : responseData.byteLength;

            const loaderResponse: Hls.LoaderResponse = {
                url,
                data: responseData
            }

            this.callbacks.onSuccess(loaderResponse, this.stats, context, null);
        }).catch(error => {
            if (this.aborted) {
                return;
            }

            if (attempt < HLSTauriLoader.RETRIES) {
                setTimeout(() => this.tryFetch(attempt + 1, url, context), 250);
                return;
            }

            this.callbacks.onError({
                code: 0,
                text: error.toString(),
            }, context, null, this.stats);
        });
    }

    public abort(): void {
        this.aborted = true;
    }

    public destroy(): void {
        this.abort();
    }
}
