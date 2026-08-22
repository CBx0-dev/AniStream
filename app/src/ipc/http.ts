import {HttpContract} from "@contracts/ipc/http.contract";

const http: HttpContract = ipc[HttpContract];

export const {fetch} = http;