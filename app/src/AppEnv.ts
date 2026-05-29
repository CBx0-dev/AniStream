export const isTesting: boolean = import.meta.env.MODE === "test";
export const isDev: boolean = import.meta.env.MODE === "development";
export const isProd: boolean = !isTesting && !isDev;

export const isClientMode: boolean = APPLICATION_TARGET == "client";
export const isStandaloneMode: boolean = APPLICATION_TARGET == "standalone";