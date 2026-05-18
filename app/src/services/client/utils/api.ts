import {ReadableGlobalContext} from "vue-mvvm";

import {ApiService, PathParameter} from "@contracts/client/api.contract";

export class ApiServiceBase {
    private readonly apiService: ApiService;
    // protected readonly settingsService: SettingsService;

    protected constructor(ctx: ReadableGlobalContext) {
        this.apiService = ctx.getService(ApiService);
        // this.settingsService = ctx.getService(SettingsService);
    }

    protected async get<Response extends object>(def: PathParameter): Promise<Response> {
        return this.apiService.get<Response>(def);
    }

    protected async post<Response extends object, Body extends object | string>(def: PathParameter, body: Body): Promise<Response> {
        return this.apiService.post<Response, Body>(def, body);
    }

}