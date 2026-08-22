import {app, ipcMain} from "electron";

import {ipc} from "@contracts/ipc/path.contract";

ipcMain.handle(ipc.USER_DATA_DIR, () => {
    return app.getPath("userData");
});

