import {ServiceKey} from "vue-mvvm";

export type PathParts = Array<string | number>;
export type QueryTypes = string | number | boolean;
export type PathParameter = PathParts | RouteBuilder;

export interface RouteBuilder {
    path: PathParts;
    query: Record<string, QueryTypes | QueryTypes[]>;
}


export interface ApiService {
    get<Response extends object>(def: PathParameter): Promise<Response>;

    post<Response extends object, Body extends object | string | null>(def: PathParameter, body: Body): Promise<Response>;

    put<Response extends object, Body extends object | string>(def: PathParameter, body: Body): Promise<Response>;

    delete<Response extends object>(def: PathParameter): Promise<Response>;
}

export const ApiService: ServiceKey<ApiService> = new ServiceKey<ApiService>("api.service");