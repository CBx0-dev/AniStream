import * as os from "@tauri-apps/plugin-os";

type OSPlatforms = NodeJS.Platform | os.Platform;



export const isTesting: boolean = import.meta.env.MODE === "test";
export const isDev: boolean = import.meta.env.MODE === "development";
export const isProd: boolean = !isTesting && !isDev;



export const isClientMode: boolean = APPLICATION_TARGET == "client";
export const isStandaloneMode: boolean = APPLICATION_TARGET == "standalone";
export const isWorkerMode: boolean = APPLICATION_TARGET == "worker";



export const PLATFORM: OSPlatforms = isTesting || isWorkerMode
    ? require("node:os").platform()
    : os.platform();

export const isWindows: boolean = PLATFORM === "windows" || PLATFORM === "win32" || PLATFORM === "cygwin";

export const isLinux: boolean = PLATFORM === "linux";

export const isAndroid: boolean = PLATFORM === "android";

export const isMac: boolean = PLATFORM === "darwin" || PLATFORM === "macos";

export const isIOS: boolean = PLATFORM === "ios";

export const isApple: boolean = isMac || isIOS;

export const isBSD: boolean =
    PLATFORM === "freebsd" ||
    PLATFORM === "openbsd" ||
    PLATFORM === "netbsd" ||
    PLATFORM === "dragonfly";

export const isUnixLike: boolean =
    isLinux ||
    isAndroid ||
    isMac ||
    isBSD ||
    PLATFORM === "sunos" ||
    PLATFORM === "solaris" ||
    PLATFORM === "aix" ||
    PLATFORM === "haiku";

export const isSolaris: boolean = PLATFORM === "sunos" || PLATFORM === "solaris";

export const isAIX: boolean = PLATFORM === "aix";

export const isHaiku: boolean = PLATFORM === "haiku";