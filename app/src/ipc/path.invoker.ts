import * as path from "node:path";

import {ipcRenderer} from "electron";

import {IPCDeclaration} from "@ipc/shared";

import {PathContract, ipc} from "@contracts/ipc/path.contract";

async function appDataDir(): Promise<string> {
    return await ipcRenderer.invoke(ipc.USER_DATA_DIR);
}

const module: PathContract = {
    join: path.join,
    appDataDir
}

export default {
    key: PathContract,
    module: module
} satisfies IPCDeclaration<PathContract>;