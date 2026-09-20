import {ipcRenderer} from "electron";

import {IPCDeclaration} from "@ipc/shared";

import {HttpContract, ipc} from "@contracts/ipc/http.contract";

function HttpResponse(
    tid: number,
    headers: Headers,
    ok: boolean,
    redirected: boolean,
    status: number,
    statusText: string,
    type: ResponseType,
    url: string,
    bodyUsed: boolean
): Response {

    let _bodyUsed: boolean = bodyUsed;

    return {
        headers,
        ok,
        redirected,
        status,
        statusText,
        type,
        url,
        body: null,

        get bodyUsed(): boolean {
            return _bodyUsed;
        },

        clone(): Response {
            return HttpResponse(
                tid,
                this.headers,
                this.ok,
                this.redirected,
                this.status,
                this.statusText,
                this.type,
                this.url,
                this.bodyUsed
            );
        },

        async arrayBuffer(): Promise<ArrayBuffer> {
            if (this.bodyUsed) {
                throw new TypeError("Cannot read body twice");
            }
            _bodyUsed = true;
            return await ipcRenderer.invoke(ipc.RESPONSE_ARRAYBUFFER, tid);
        },

        async blob(): Promise<Blob> {
            if (this.bodyUsed) {
                throw new TypeError("Cannot read body twice");
            }
            _bodyUsed = true;

            const buff: ArrayBuffer = await ipcRenderer.invoke(ipc.RESPONSE_ARRAYBUFFER, tid);
            return new Blob([buff], {
                type: this.headers.get("Content-Type") ?? undefined
            });
        },

        formData(): Promise<FormData> {
            throw "FormData is not supported";
        },

        async json(): Promise<any> {
            if (this.bodyUsed) {
                throw new TypeError("Cannot read body twice");
            }
            _bodyUsed = true;
            return await ipcRenderer.invoke(ipc.RESPONSE_JSON, tid);
        },

        text(): Promise<string> {
            throw "Text is not supported";
        }
    }
}

async function fetch(input: string | URL, init?: RequestInit): Promise<Response> {
    if (input instanceof URL) {
        input = input.toString();
    }

    const response: ipc.IPCResponse = await ipcRenderer.invoke(ipc.REQUEST, input, init);
    return HttpResponse(
        response.tid,
        new Headers(response.headers),
        response.ok,
        response.redirected,
        response.status,
        response.statusText,
        response.type,
        response.url,
        false
    );
}

const module: HttpContract = {
    fetch
}

export default {
    key: HttpContract,
    module: module
} satisfies IPCDeclaration<HttpContract>;