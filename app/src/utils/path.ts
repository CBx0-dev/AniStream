import * as path from "@tauri-apps/api/path";

import * as AppEnv from "@AppEnv";

const PATH_SEPARATOR: string = AppEnv.isTesting
    ? require("path").sep
    : path.sep();

export async function appDataDir(): Promise<string> {
    if (AppEnv.isTesting) {
        return "./";
    }

    return await path.appDataDir();
}

export function join(...paths: string[]): string {
    const splitRegex: RegExp = new RegExp(`\\${PATH_SEPARATOR}`, "g");
    const parts: string[] = paths.map(part => part.split(splitRegex)).flat();

    const resultParts: string[] = [];
    for (let i: number = 0; i < parts.length; i++) {
        const part: string = parts[i];
        if (part == "") {
            continue;
        }
        if (part == "." && i > 0) {
            continue;
        }

        if (part == ".." && resultParts.length > 0) {
            resultParts.shift();
        }

        resultParts.push(part);
    }

    return resultParts.join(PATH_SEPARATOR);
}