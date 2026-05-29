import {ReadableGlobalContext} from "vue-mvvm";

import {ApiService, PathParameter} from "@contracts/client/api.contract";

import {ServiceDeclaration} from "@services/declaration";

import * as http from "@utils/http";

export class ApiServiceImpl implements ApiService {
    public static HEADERS: [string, string][] = [["Content-Type", "application/json"]];

    public constructor(_ctx: ReadableGlobalContext) {
    }

    public async get<Response extends object>(def: PathParameter): Promise<Response> {
        const url: string = this.buildURL(def);
        return await http.get(url, ApiServiceImpl.HEADERS).json<Response>();
    }

    public async post<Response extends object, Body extends object | string | null>(def: PathParameter, body: Body): Promise<Response> {
        let data: string | undefined;

        if (body == null) {
            data = undefined;
        } else if (typeof body == "object") {
            data = JSON.stringify(body);
        } else {
            data = body;
        }

        const url: string = this.buildURL(def);
        return await http.post(url, data, ApiServiceImpl.HEADERS).json<Response>();
    }

    public async put<Response extends object, Body extends object | string>(def: PathParameter, body: Body): Promise<Response> {
        let data: string;

        if (typeof body == "object") {
            data = JSON.stringify(body);
        } else {
            data = body;
        }

        const url: string = this.buildURL(def);
        return await http.put(url, data, ApiServiceImpl.HEADERS).json<Response>();
    }

    public async delete<Response extends object>(def: PathParameter): Promise<Response> {
        const url: string = this.buildURL(def);
        return await http.delete$(url, ApiServiceImpl.HEADERS).json<Response>();
    }

    protected buildURL(def: PathParameter): string {
        if (Array.isArray(def)) {
            // TODO replace with dynamic domain config
            const base: string = "http://localhost:5000";
            const path: string = def.join("/");
            return `${base}/${path}`;
        }

        const base: string = this.buildURL(def.path);
        const query: string = Object.entries(def.query).map(([key, value]) => Array.isArray(value)
            ? value.map(value => `${key}=${value}`).join("&")
            : `${key}=${value}`
        ).join("&");

        return `${base}?${query}`;
    }
}

export default {
    key: ApiService,
    ctor: ApiServiceImpl
} satisfies ServiceDeclaration<ApiService>;