import {ReadableGlobalContext} from "vue-mvvm";

import {ApiService, PathParameter} from "@contracts/client/api.contract";
import {SettingsService} from "@contracts/settings.contract";

import {ServiceDeclaration} from "@services/declaration";

import {InformationModel} from "@models/information.model";

import * as http from "@utils/http";
import * as version from "@utils/version";
import {InvalidOperationError} from "@utils/error";

import {version as APP_VERSION} from "@/../package.json";

export class ApiServiceImpl implements ApiService {
    public static HEADERS: [string, string][] = [["Content-Type", "application/json"]];

    private readonly ctx: ReadableGlobalContext;

    private apiBase: string | null;

    public constructor(ctx: ReadableGlobalContext) {
        this.ctx = ctx;

        this.apiBase = null;
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

    public async checkApiInformation(url: string): Promise<string | null> {
        const informationUrl: string = this.buildURL(["api", "information"], url);
        const information: InformationModel = await http.get(informationUrl, ApiServiceImpl.HEADERS).json<InformationModel>();

        if (!version.isVersionInRange(APP_VERSION, information.min_version, information.max_version)) {
            return `Client is not compatible with the Server. Required ${information.min_version} >= version <= ${information.max_version}`;
        }

        return null;
    }

    protected buildURL(def: PathParameter, baseOverride: string | null = null): string {
        if (Array.isArray(def)) {
            const base: string = baseOverride ?? this.getApiUrl();
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

    private getApiUrl(): string {
        if (this.apiBase) {
            return this.apiBase;
        }

        const settingsService: SettingsService = this.ctx.getService(SettingsService);
        const url: string = settingsService.serverUrl.value
        if (!url) {
            throw new InvalidOperationError("No API URL was configured");
        }

        return this.apiBase = url;
    }
}

export default {
    key: ApiService,
    ctor: ApiServiceImpl
} satisfies ServiceDeclaration<ApiService>;