import * as path from "path";

import {defineConfig, PluginOption, UserConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import * as fs from "node:fs";

const host = process.env.TAURI_DEV_HOST;

function dynamicServiceResolver(applicationTarget: string): PluginOption {
    return {
        name: "dynamic-service-resolver",
        enforce: "pre",

        resolveId(source: string): string | null {
            if (!source.startsWith("@services/")) {
                return null;
            }

            const relativePath: string = source.replace("@services/", "");
            const baseDir: string = path.resolve(__dirname, "src", "services");

            const destinationsToTry: string[] = [
                path.resolve(baseDir, applicationTarget, relativePath),
                path.resolve(baseDir, "shared", relativePath)
            ];
            const extensions: string[] = ["", ".ts", ".tsx", ".js", ".jsx"];

            for (const destination of destinationsToTry) {
                for (const extension of extensions) {
                    const finalPath: string = destination + extension;
                    if (fs.existsSync(finalPath) && !fs.lstatSync(finalPath).isDirectory()) {
                        return finalPath;
                    }
                }
            }

            return null;
        }
    }
}

function virtualServiceLoader(applicationTarget: string): PluginOption {
    return {
        name: "virtual-service-loader",
        resolveId(id) {
            if (id == "virtual:services") {
                return "\0virtual:services";
            }
        },
        load(id) {
            if (id == "\0virtual:services") {
                // language=TypeScript
                return `
                    export const services = import.meta.glob([
                        "/src/services/shared/**/*.service.ts",
                        "/src/services/${applicationTarget}/**/*.service.ts"
                    ], {eager: true, import: "default"});
                `;
            }
        }
    }
}

// https://vite.dev/config/
export default defineConfig(async (): Promise<UserConfig> => {
    const APPLICATION_TARGET: string = process.env.APPLICATION_TARGET || "standalone";
    console.log(`ℹ️  Application Target: ${APPLICATION_TARGET}`);

    return {
        plugins: [vue(), tailwindcss(), dynamicServiceResolver(APPLICATION_TARGET), virtualServiceLoader(APPLICATION_TARGET)],
        root: __dirname,

        resolve: {
            alias: {
                "@": path.join(__dirname, "src"),
                "@views": path.join(__dirname, "src", "views"),
                "@models": path.join(__dirname, "src", "models"),
                "@icons": path.join(__dirname, "src", "icons"),
                "@controls": path.join(__dirname, "src", "controls"),
                "@utils": path.join(__dirname, "src", "utils"),
                "@langs": path.join(__dirname, "src", "langs"),
                "@providers": path.join(__dirname, "src", "providers"),
                "@sources": path.join(__dirname, "src", "sources"),
                "@contracts": path.join(__dirname, "src", "contracts")
            }
        },

        // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
        //
        // 1. prevent Vite from obscuring rust errors
        clearScreen: false,
        // 2. tauri expects a fixed port, fail if that port is not available
        server: {
            port: 1420,
            strictPort: true,
            host: host || false,
            hmr: host
                ? {
                    protocol: "ws",
                    host,
                    port: 1421,
                }
                : undefined,
            watch: {
                // 3. tell Vite to ignore watching `src-tauri`
                ignored: ["**/src-tauri/**", "**/src/langs/**"],
            },
        },
    }
});
