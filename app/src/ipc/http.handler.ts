import {app, ipcMain, IpcMainInvokeEvent} from "electron";
import {request as httpRequest} from "http";
import {request as httpsRequest} from "https";

import {ipc} from "@contracts/ipc/http.contract";

const transactions: Map<number, [Response, NodeJS.Timeout]> = new Map();
const transactionTimeout = 30_000;

// Simple cookie jar.
// Key = cookie name, value = cookie value.
const cookies: Map<string, string> = new Map();
const redirectCodes = new Set([301, 302, 303, 307, 308]);
const maxRedirects = 20;

function request(
    url: string,
    init: RequestInit = {},
    redirectCount = 0
): Promise<Response> {
    return new Promise((resolve, reject) => {
        const redirectMode = init.redirect ?? "follow";

        const parsed = new URL(url);
        const isHttps = parsed.protocol === "https:";

        const headers: Record<string, string> = {};

        if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(init.headers)) {
            for (const [key, value] of init.headers) {
                headers[key] = value;
            }
        } else if (init.headers) {
            Object.assign(headers, init.headers);
        }

        // Session cookies.
        if (cookies.size > 0 && !("cookie" in headers)) {
            headers.cookie = Array.from(cookies.entries())
                .map(([name, value]) => `${name}=${value}`)
                .join("; ");
        }

        const body =
            typeof init.body === "string"
                ? init.body
                : init.body instanceof Uint8Array
                    ? init.body
                    : undefined;

        const req = (isHttps ? httpsRequest : httpRequest)(
            url,
            {
                method: init.method ?? "GET",
                headers,
            },
            res => {
                const status = res.statusCode ?? 0;

                // Store cookies before doing anything with redirects.
                for (const cookie of res.headers["set-cookie"] ?? []) {
                    const [nameValue] = cookie.split(";");
                    const separator = nameValue.indexOf("=");

                    if (separator === -1) continue;

                    const name = nameValue.slice(0, separator).trim();
                    const value = nameValue.slice(separator + 1).trim();

                    if (value === "") {
                        cookies.delete(name);
                    } else {
                        cookies.set(name, value);
                    }
                }

                const isRedirect =
                    redirectCodes.has(status) &&
                    res.headers.location !== undefined;

                if (isRedirect) {
                    // manual: return the redirect response unchanged.
                    if (redirectMode === "manual") {
                        const chunks: Buffer[] = [];

                        res.on("data", chunk => {
                            chunks.push(Buffer.from(chunk));
                        });

                        res.on("end", () => {
                            resolve(new Response(Buffer.concat(chunks), {
                                status,
                                statusText: res.statusMessage,
                                headers: Object.fromEntries(
                                    Object.entries(res.headers)
                                        .filter(([, value]) => value !== undefined)
                                        .map(([key, value]) => [
                                            key,
                                            Array.isArray(value)
                                                ? value.join(", ")
                                                : String(value)
                                        ])
                                ),
                            }));
                        });

                        return;
                    }

                    // error: reject instead of following.
                    if (redirectMode === "error") {
                        res.resume();
                        reject(new Error(
                            `Redirect encountered (${status})`
                        ));
                        return;
                    }

                    // follow
                    if (redirectCount >= maxRedirects) {
                        res.resume();
                        reject(new Error("Too many redirects"));
                        return;
                    }

                    const redirectUrl = new URL(
                        res.headers.location!,
                        url
                    ).toString();

                    // Consume the redirect response.
                    res.resume();

                    let nextInit: RequestInit = {
                        ...init,
                        headers: {
                            ...headers,
                        },
                    };

                    const method = (
                        init.method ?? "GET"
                    ).toUpperCase();

                    // Fetch semantics for 301/302/303.
                    if (
                        status === 303 ||
                        ((status === 301 || status === 302) &&
                            method === "POST")
                    ) {
                        nextInit.method = "GET";
                        nextInit.body = undefined;

                        // @ts-expect-error
                        delete nextInit.headers!["content-length"];
                        // @ts-expect-error
                        delete nextInit.headers!["Content-Length"];
                    }

                    request(
                        redirectUrl,
                        nextInit,
                        redirectCount + 1
                    ).then(resolve, reject);

                    return;
                }

                // Normal response.
                const chunks: Buffer[] = [];

                res.on("data", chunk => {
                    chunks.push(Buffer.from(chunk));
                });

                res.on("end", () => {
                    const buffer = Buffer.concat(chunks);

                    resolve(new Response(buffer, {
                        status,
                        statusText: res.statusMessage,
                        headers: Object.fromEntries(
                            Object.entries(res.headers)
                                .filter(([, value]) => value !== undefined)
                                .map(([key, value]) => [
                                    key,
                                    Array.isArray(value)
                                        ? value.join(", ")
                                        : String(value)
                                ])
                        ),
                    }));
                });
            }
        );

        req.on("error", err => {
            console.log(err);
            reject(err)
        });

        if (body !== undefined) {
            req.write(body);
        }

        req.end();
    });
}

app.on("ready", () => {
    ipcMain.handle(
        ipc.REQUEST,
        async (
            _ev: IpcMainInvokeEvent,
            url: string,
            init?: RequestInit
        ): Promise<ipc.IPCResponse> => {
            const response = await request(url, init);

            let tid = transactions.size + 1;
            while (transactions.has(tid)) tid++;

            const timeout = setTimeout(() => {
                transactions.delete(tid);
            }, transactionTimeout);

            transactions.set(tid, [response, timeout]);

            return {
                tid,
                url: response.url,
                status: response.status,
                headers: Array.from(response.headers),
                type: response.type,
                ok: response.ok,
                redirected: response.redirected,
                statusText: response.statusText
            };
        }
    );

    ipcMain.handle(
        ipc.RESPONSE_JSON,
        async (
            _ev: IpcMainInvokeEvent,
            tid: number
        ): Promise<unknown> => {
            if (!transactions.has(tid))
                throw "HTTP transaction not found";

            const [response, timeout] = transactions.get(tid)!;

            clearTimeout(timeout);
            transactions.delete(tid);

            return await response.json();
        }
    );

    ipcMain.handle(
        ipc.RESPONSE_ARRAYBUFFER,
        async (
            _ev: IpcMainInvokeEvent,
            tid: number
        ): Promise<ArrayBuffer> => {
            if (!transactions.has(tid))
                throw "HTTP transaction not found";

            const [response, timeout] = transactions.get(tid)!;

            clearTimeout(timeout);
            transactions.delete(tid);

            return await response.arrayBuffer();
        }
    );
});