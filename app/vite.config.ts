import * as path from "path";
import * as fs from "fs";

import {BuildEnvironmentOptions, ConfigEnv, defineConfig, PluginOption, Rolldown, UserConfig, transformWithOxc} from "vite";
import {type UserWorkspaceConfig as TestConfig} from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron";

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
                    const s1 = import.meta.glob("/src/services/${applicationTarget}/**/*.service.ts", {
                        eager: true,
                        import: "default"
                    });
                    const s2 = import.meta.glob("/src/services/shared/**/*.service.ts", {
                        eager: true,
                        import: "default"
                    });

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

function raiiTransformer(): PluginOption {
    return {
        name: "raii-transformer",
        enforce: "post",
        transform: {
            filter: {
                id: /.ts$/,
            },
            async handler(code: string, id: string): Promise<null | Rolldown.TransformResult> {
               if (!code.includes("using ")) {
                    return null;
                }

                const jsResult = await transformWithOxc(code, id, {
                    sourceType: "module"
                });
                
                const {transformAsync} = await import ("@babel/core");
                const {default: resourceMgmt} = await import("@babel/plugin-proposal-explicit-resource-management");
                
                const result = await transformAsync(jsResult.code, {
                    filename: id,
                    babelrc: false,
                    configFile: false,
                    sourceMaps: true,
                    inputSourceMap: {
                        ...jsResult.map,
                        file: id
                    },
                    plugins: [
                        resourceMgmt
                    ]
                });

                if (!result) {
                    return null;
                }

                return {
                    code: result.code,
                    map: result.map
                }
            }
        }
    }
}

function activePlugins(applicationTarget: string): PluginOption[] {
    if (applicationTarget == "worker") {
        return [
            // raiiTransformer(),
            dynamicServiceResolver(applicationTarget)
        ];
    }

    return [
        electron([
            {
                entry: "src/main.electron.ts",
                onstart(options ) {
                    options.startup();
                },
                vite: {
                    define: {
                        APPLICATION_TARGET: JSON.stringify(applicationTarget)
                    },
                    build: {
                        outDir: "dist-electron",
                        rolldownOptions: {
                            external: ["electron", /node:.*/, "better-sqlite3"]
                        }
                    }
                }
            },
            {
                entry: "src/main.preload.ts",
                onstart(options) {
                    options.reload();
                },
                vite: {
                    define: {
                        APPLICATION_TARGET: JSON.stringify(applicationTarget)
                    },
                    build: {
                        outDir: "dist-electron",
                        rolldownOptions: {
                            output: {
                                format: "es",
                                entryFileNames: "[name].mjs"
                            }
                        }
                    }
                }
            }
        ]),
        vue(),
        tailwindcss(),
        // raiiTransformer(),
        dynamicServiceResolver(applicationTarget),
        virtualServiceLoader(applicationTarget)
    ];
}

function buildEnv(applicationTarget: string): BuildEnvironmentOptions {
    if (applicationTarget != "worker") {
        return {};
    }

    return {
        lib: {
            entry: path.resolve(__dirname, "src", "worker.ts"),
            formats: ["es"],
            fileName: () => "worker.js"
        },
        assetsDir: "",
        cssCodeSplit: false,
        rolldownOptions: {
            external: [
                /^node:.*/,
                "commander",
                "ora",
                "chalk"
            ],
            input: {
                main: path.resolve(__dirname, "src", "worker.ts")
            },
            output: {
                codeSplitting: false,
                sourcemap: true,
            }
        }
    };
}

// https://vite.dev/config/
export default defineConfig(async (env: ConfigEnv): Promise<UserConfig & TestConfig> => {
    const APPLICATION_TARGET: string = process.env.APPLICATION_TARGET || "standalone";
    console.log(`ℹ️  Application Target: ${APPLICATION_TARGET}`);

    if (env.command == "serve" && APPLICATION_TARGET == "worker") {
        throw "Worker can only be build and not served";
    }

    return {
        plugins: activePlugins(APPLICATION_TARGET),
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
                "@configs": path.join(__dirname, "src", "configs"),
                "@ipc": path.join(__dirname, "src", "ipc"),
                "@AppEnv": path.join(__dirname, "src", "AppEnv.ts"),
                "@test": path.join(__dirname, "tests")
            }
        },
        build: buildEnv(APPLICATION_TARGET),
        define: {
            APPLICATION_TARGET: JSON.stringify(APPLICATION_TARGET)
        },
        optimizeDeps: {
            exclude: ["better-sqlite3"]
        },
        test: {
            globalSetup: "./tests/vitest.global-setup.ts",
            testTimeout: 60_000
        }
    }
});
