import * as voe from "@sources/voe";
import * as vidoza from "@sources/vidoza";
import * as vidmoly from "@sources/vidmoly";
import * as speedfiles from "@sources/speedfiles";
import * as luluvdo from "@sources/luluvdo";
import * as loadx from "@sources/loadx";

export interface IStreamSource {
    getStream(embeddedURL: string): Promise<string>;

    getPreviewImage(embeddedURL: string): Promise<string>;

    getHeaders(): [string, string][];
}

export type SupportedSource = "voe" | "vidoza" | "vidmoly" | "speedfiles" | "luluvdo" | "loadx";

const supportedSources: Record<SupportedSource, IStreamSource> = {
    voe: voe,
    vidoza: vidoza,
    vidmoly: vidmoly,
    speedfiles: speedfiles,
    luluvdo: luluvdo,
    loadx: loadx
}

export function getSource(name: string | SupportedSource): IStreamSource | null {
    if (!(name in supportedSources)) {
        let key: string | null = getSourceKeyFromName(name);
        if (!key) {
            return null;
        }
        name = key;
    }

    return supportedSources[name as SupportedSource];
}

export function getSourceKeyFromName(name: string): SupportedSource | null {
    switch (name) {
        case "VOE":
            return "voe";
        case "Vidoza":
            return "vidoza";
        case "Vidmoly":
            return "vidmoly";
        case "SpeedFiles":
            return "speedfiles";
        case "LuluVDO":
            return "luluvdo";
        case "LoadX":
            return "loadx";
        default:
            return null;
    }
}