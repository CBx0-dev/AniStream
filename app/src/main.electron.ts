import path from "node:path";
import {app, BrowserWindow} from "electron";

import.meta.glob("./ipc/*.handler.ts", {
    eager: true,
});

async function main(): Promise<void> {
    await app.whenReady();


    const win: BrowserWindow = new BrowserWindow({
        title: "AniStream",
        width: 1280,
        height: 800,
        show: false,
        webPreferences: {
            preload: path.join(import.meta.dirname, "main.preload.mjs"),
            sandbox: false,
            nodeIntegration: false,
            devTools: import.meta.env.DEV
        }
    });

    win.removeMenu();

    if (import.meta.env.DEV) {
        await win.loadURL("http://localhost:5173");
        win.webContents.openDevTools({
            mode: "detach"
        })
    } else {
        await win.loadFile("dist/index.html");
    }

    win.on("ready-to-show", () => {
        win.show();
    });

}

main();
