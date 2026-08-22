import {contextBridge} from "electron/renderer";
import {IPCDeclaration} from "@ipc/shared";

const modules: Record<string, IPCDeclaration<any>> = import.meta.glob("./ipc/*.invoker.ts", {
    eager: true,
    import: "default"
});

const ipc = Object.values(modules).reduce((a: Record<string, object>, b: IPCDeclaration<any>): Record<string, object> => {
    a[b.key] = b.module;
    return a;
}, {} as Record<string, object>);

contextBridge.exposeInMainWorld("ipc", ipc);

