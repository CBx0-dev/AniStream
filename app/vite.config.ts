import * as path from "path";

import {defineConfig, PluginOption, UserConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import * as fs from "node:fs";

const host: string = process.env.TAURI_DEV_HOST;

function dynamicServiceResolver(applicationTarget: string): PluginOption {
    const cache: Map<string, string | null> = new Map<string, string | null>();

    return {
        name: "dynamic-service-resolver",
        resolveId(source: string): string | null {
            if (!source.startsWith("@services/")) {
                return null;
            }

            if (cache.has(source)) {
                return cache.get(source);
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
                        cache.set(source, finalPath);
                        return finalPath;
                    }
                }
            }

            cache.set(source, null);
            return null;
        }
    }
}

function virtualServiceLoader(applicationTarget: string): PluginOption {
    const virtualModuleId: string = 'virtual:services';
    const resolvedVirtualModuleId: string = '\0' + virtualModuleId;

    return {
        name: "virtual-service-loader",
        enforce: "pre",
        resolveId(id: string): string | null {
            if (id == virtualModuleId) {
                return resolvedVirtualModuleId;
            }
            return null;
        },
        load(id: string): string | null {
            if (id == resolvedVirtualModuleId) {
                // language=TypeScript
                return `
                    const s1 = import.meta.glob("/src/services/${applicationTarget}/**/*.service.ts", {eager: true, import: "default"});
                    const s2 = import.meta.glob("/src/services/shared/**/*.service.ts", {eager: true, import: "default"});
                    
                    export const services = {
                        ...s2,
                        ...s1
                    };
                `;
            }

            return null;
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
                "@contracts": path.join(__dirname, "src", "contracts"),
                "@test": path.join(__dirname, "tests")
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
        define: {
            APPLICATION_TARGET: JSON.stringify(APPLICATION_TARGET)
        }
    }
});
