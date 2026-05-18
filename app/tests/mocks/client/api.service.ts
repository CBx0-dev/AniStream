import {ApiServiceImpl} from "@services/api/api.service";

import {PathParameter} from "@contracts/client/api.contract";

import * as http from "@utils/http";

export class ApiServiceMock extends ApiServiceImpl {
    public async get<Response extends object>(def: PathParameter): Promise<Response> {
        const url: string = this.buildURL(def);

        const res: globalThis.Response = await fetch(url, {
            method: "GET",
            headers: ApiServiceImpl.HEADERS
        });

        if (!res.ok) {
            throw await http.HTTPError.create(res);
        }

        return res.json();
    }

    public async post<Response extends object, Body extends object | string>(def: PathParameter, body: Body): Promise<Response> {
        let data: string;

        if (typeof body == "object") {
            data = JSON.stringify(body);
        } else {
            data = body;
        }

        const url: string = this.buildURL(def);

        const res: globalThis.Response = await fetch(url, {
            method: "POST",
            body: data,
            headers: [
                ["Content-Type", "application/json"],
                ...ApiServiceImpl.HEADERS
            ]
        });

        if (!res.ok) {
            throw await http.HTTPError.create(res);
        }

        return await res.json();
    }
}