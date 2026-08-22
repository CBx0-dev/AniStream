import * as os from "@ipc/os";

export const isTesting: boolean = import.meta.env.MODE == "test";
export const isDev: boolean = import.meta.env.MODE == "development";
export const isProd: boolean = !isTesting && !isDev;

export const isClientMode: boolean = APPLICATION_TARGET == "client";
export const isStandaloneMode: boolean = APPLICATION_TARGET == "standalone";
export const isWorkerMode: boolean = APPLICATION_TARGET == "worker";

export const modeName: string = isClientMode
    ? "client"
    : isStandaloneMode
        ? "standalone"
        : isWorkerMode
            ? "worker"
            : "?";


export const PLATFORM: os.Platform = isTesting || isWorkerMode
    ? require("node:os").platform()
    : os.platform;

export const isWindows: boolean = PLATFORM == "win32" || PLATFORM == "cygwin";

export const isLinux: boolean = PLATFORM == "linux";

export const isAndroid: boolean = PLATFORM == "android";

export const isMac: boolean = PLATFORM == "darwin";

export const isApple: boolean = isMac;

export const isBSD: boolean =
    PLATFORM == "freebsd" ||
    PLATFORM == "openbsd" ||
    PLATFORM == "netbsd";

export const isUnixLike: boolean =
    isLinux ||
    isAndroid ||
    isMac ||
    isBSD ||
    PLATFORM == "sunos" ||
    PLATFORM == "aix" ||
    PLATFORM == "haiku";

export const isSolaris: boolean = PLATFORM == "sunos";

export const isAIX: boolean = PLATFORM == "aix";

export const isHaiku: boolean = PLATFORM == "haiku";