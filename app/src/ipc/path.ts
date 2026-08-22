import {PathContract} from "@contracts/ipc/path.contract";

const path: PathContract = ipc[PathContract];

export const {join, appDataDir} = path;