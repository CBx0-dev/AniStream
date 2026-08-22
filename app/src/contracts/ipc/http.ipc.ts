import type {ResponseType} from "undici-types/fetch";

export interface IPCResponse {
    readonly tid: number;
    readonly headers: Array<[string, string]>;
    readonly ok: boolean
    readonly status: number
    readonly statusText: string
    readonly type: ResponseType
    readonly url: string
    readonly redirected: boolean

}

export const REQUEST: string = "http:request";
export const RESPONSE_JSON: string = "http:responseJSON";
export const RESPONSE_BLOB: string = "http:responseBlob";
export const RESPONSE_ARRAYBUFFER: string = "http:responseArrayBuffer";