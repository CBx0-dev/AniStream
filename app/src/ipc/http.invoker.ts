import {ipcRenderer} from "electron";

import {IPCDeclaration} from "@ipc/shared";

import {HttpContract, ipc} from "@contracts/ipc/http.contract";

class HttpResponse implements Response {
    private readonly tid: number;

    public readonly headers: Headers
    public readonly ok: boolean
    public readonly redirected: boolean
    public readonly status: number
    public readonly statusText: string
    public readonly type: ResponseType
    public readonly url: string;
    public readonly body: null;
    public bodyUsed: boolean;

    public constructor(
        tid: number, 
        headers: Headers,
        ok: boolean,
        redirected: boolean,
        status: number, 
        statusText: string,
        type: ResponseType,
        url: string,
        bodyUsed: boolean
    ) {
        this.tid = tid;
        this.headers = headers;
        this.ok = ok;
        this.redirected = redirected;
        this.status = status;
        this.statusText = statusText;
        this.type = type;
        this.url = url;
        this.body = null;
        this.bodyUsed = bodyUsed;
    }

    clone(): Response {
        return new HttpResponse(
            this.tid,
            this.headers,
            this.ok,
            this.redirected,
            this.status,
            this.statusText,
            this.type,
            this.url,
            this.bodyUsed
        );
    }

    public async arrayBuffer(): Promise<ArrayBuffer> {
        if (this.bodyUsed) {
            throw "Cannot read body twice";
        }
        this.bodyUsed = true;
        return await ipcRenderer.invoke(ipc.RESPONSE_ARRAYBUFFER, this.tid);

    }

    public async blob(): Promise<Blob> {
        if (this.bodyUsed) {
            throw "Cannot read body twice";
        }
        this.bodyUsed = true;
        return await ipcRenderer.invoke(ipc.RESPONSE_BLOB, this.tid);
    }

    formData(): Promise<FormData> {
        throw "FormData is not supported";
    }

    public async json(): Promise<any> {
        if (this.bodyUsed) {
            throw "Cannot read body twice";
        }
        this.bodyUsed = true;
        return await ipcRenderer.invoke(ipc.RESPONSE_JSON, this.tid);
    }

    text(): Promise<string> {
        throw "FormData is not supported";
    }
}

async function fetch(input: string | URL, init?: RequestInit): Promise<Response> {
    if (input instanceof URL) {
        input = input.toString();
    }

    const response: ipc.IPCResponse = await ipcRenderer.invoke(ipc.REQUEST, input, init);
    debugger;
    return new HttpResponse(
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