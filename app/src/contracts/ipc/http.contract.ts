export interface HttpContract {
    fetch(input: string | URL, init?: RequestInit): Promise<Response>;    
}

export const HttpContract: string = "http";

export * as ipc from "./http.ipc";