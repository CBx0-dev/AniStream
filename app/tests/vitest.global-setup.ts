import {execSync, spawn} from "child_process";
import * as path from "path";

let server: ReturnType<typeof spawn> | null = null;

function resolveDotnet(): string {
    try {
        const cmd: string = process.platform === "win32" ? "where dotnet" : "which dotnet";
        return execSync(cmd).toString().trim().split("\n")[0].trim();
    } catch {
        throw new Error("dotnet not found in PATH");
    }
}

export async function setup(): Promise<void> {
    if (process.env["APPLICATION_TARGET"] != "client") {
        return;
    }

    const dotnetPath: string = resolveDotnet();

    console.log(`__dirname: ${__dirname}`);

    server = spawn(dotnetPath, ["run", "--project", "./AniStream/AniStream.csproj", "-c", "Test"], {
        cwd: path.join(__dirname, "..", "..", "server"),
        env: {
            ...process.env,
            DATABASE_DRIVER: "sqlite",
            DATABASE_METADATA_CONNECTION_STRING: "",
            DATABASE_PROFILE_CONNECTION_STRING: "",
            DATABASE_MIGRATION_PATH: path.join(__dirname, "..", "..", "migration"),
            ASSETS_PATH: ""
        },
        stdio: "inherit"
    });

    if (!await waitForPort(5000, 60, 1000)) {
        throw `Port 5000 never opened`;
    }
}

export async function teardown(): Promise<void> {
    console.log("Terminate server");
    if (server) {
        server.kill("SIGTERM");
    }
}

function waitForPort(port: number, retries: number = 20, delay: number = 1000): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
        async function attempt(remaining: number) {
            try {
                const {default: net} = await import("net");
                const socket = net.connect(port, "localhost");
                socket.on("connect", () => {
                    socket.destroy();
                    resolve(true);
                });
                socket.on("error", () => {
                    if (remaining <= 0) {
                        return resolve(false);
                    }

                    setTimeout(() => attempt(remaining - 1), delay);
                });
            } catch (e) {
                reject(e);
            }
        }

        await attempt(retries);
    });
}