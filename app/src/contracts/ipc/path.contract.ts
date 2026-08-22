export interface PathContract {
    appDataDir(): Promise<string>;
    
    join(...parts: string[]): string;
}

export const PathContract: string = "path";

export * as ipc from "./path.ipc";