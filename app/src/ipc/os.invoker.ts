import * as os from "node:os";

import {IPCDeclaration} from "@ipc/shared";

import {OSContract} from "@contracts/ipc/os.contract";

const module: OSContract = {
    platform: os.platform()
}

export default {
    key: OSContract,
    module: module
} satisfies IPCDeclaration<OSContract>
