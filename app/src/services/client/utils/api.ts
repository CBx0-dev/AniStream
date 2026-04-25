import {ReadableGlobalContext} from "vue-mvvm";

import {SettingsService} from "@contracts/settings.contract";

import * as http from "@utils/http";

export type PathParts = Array<string | number>;
export type QueryTypes = string | number | boolean;
export type PathParameter = PathParts[] | RouteBuilder;

export interface RouteBuilder {
    path: PathParts[];
    query: Record<string, QueryTypes | QueryTypes[]>;
}

export class ApiServiceBase {
    protected readonly settingsService: SettingsService;

    protected constructor(ctx: ReadableGlobalContext) {
        this.settingsService = ctx.getService(SettingsService);
    }

    protected async get<Response extends object>(def: PathParameter): Promise<Response> {
        const url: string = this.buildURL(def);
        return await http.get(url).json<Response>();
    }

    protected async post<Response extends object, Body extends RequestInit["body"]>(def: PathParameter, body: Body): Promise<Response> {
        const url: string = this.buildURL(def);
        return await http.post(url, body).json<Response>();
    }

    private buildURL(def: PathParameter): string {
        if (Array.isArray(def)) {
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