import {ipcMain, IpcMainInvokeEvent} from "electron";

import {ipc} from "@contracts/ipc/http.contract";

const transactions: Map<number, [Response, NodeJS.Timeout]> = new Map();
const transactionTimeout: number = 30_000;

ipcMain.handle(ipc.REQUEST, async (_ev: IpcMainInvokeEvent, url: string, init?: RequestInit): Promise<ipc.IPCResponse> => {
    console.log("Request: ", url);
    const response: Response = await fetch(url, init);

    let tid: number = transactions.size + 1;
    while (transactions.has(tid)) tid++;

    const timeout: NodeJS.Timeout = setTimeout(() => transactions.delete(tid), transactionTimeout);
    transactions.set(tid, [response, timeout]);

    return {
        tid,
        url: response.url,
        status: response.status,
        headers: Array.from(response.headers),
        type: response.type,
        ok: response.ok,
        redirected: response.redirected,
        statusText: response.statusText
    }
});

ipcMain.handle(ipc.RESPONSE_JSON, async (_ev: IpcMainInvokeEvent, tid: number): Promise<unknown> => {
    if (transactions.has(tid)) throw "HTTP transaction not found";
    
    const [response, timeout] = transactions.get(tid)!;
    
    clearTimeout(timeout);
    transactions.delete(tid);
    
    return await response.json();
});

ipcMain.handle(ipc.RESPONSE_BLOB, async (_ev: IpcMainInvokeEvent, tid: number): Promise<Blob> => {
    if (transactions.has(tid)) throw "HTTP transaction not found";

    const [response, timeout] = transactions.get(tid)!;

    clearTimeout(timeout);
    transactions.delete(tid);

    return await response.blob();
});

ipcMain.handle(ipc.RESPONSE_ARRAYBUFFER, async (_ev: IpcMainInvokeEvent, tid: number): Promise<ArrayBuffer> => {
    if (transactions.has(tid)) throw "HTTP transaction not found";

    const [response, timeout] = transactions.get(tid)!;

    clearTimeout(timeout);
    transactions.delete(tid);

    return await response.arrayBuffer();
});


