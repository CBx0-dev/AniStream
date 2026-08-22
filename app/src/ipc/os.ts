import {OSContract} from "@contracts/ipc/os.contract";

const os: OSContract = ipc[OSContract];

export type Platform = NodeJS.Platform;

export const {platform} = os;