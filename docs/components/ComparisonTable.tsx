import {
    icons
} from "./icons";

const LucidePcCase = icons["LucidePcCase"];
const LucideCloud = icons["LucideCloud"];
const LucideCheck = icons["LucideCheck"];
const DeviconApple = icons["DeviconApple"];
const DeviconAndroid = icons["DeviconAndroid"];
const DeviconLinux = icons["DeviconLinux"];
const DeviconWindows11 = icons["DeviconWindows11"];


export function ComparisonTable() {
    return (
        <table className="w-full border-collapse text-sm">
            <thead>
            <tr className="border-b bg-fd-muted/50">
                <th className="p-3 text-left font-medium">&nbsp;</th>
                <th className="p-3 font-medium">
                <span className="flex justify-center items-center gap-2">
                    <LucidePcCase/>
                    Standalone Mode
                </span>
                </th>
                <th className="p-3 font-medium">
                <span className="flex justify-center items-center gap-2">
                    <LucideCloud/>
                    Client & Server Mode
                </span>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Platforms
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">
                <span className="flex items-center gap-2">
                    <DeviconWindows11/>
                    Windows
                </span>
                </td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">
                <span className="flex items-center gap-2">
                    <DeviconLinux/>
                    Linux
                </span>
                </td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">
                <span className="flex items-center gap-2">
                    <DeviconApple/>
                    macOS (Intel & Apple Silicon)
                </span>
                </td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">
                <span className="flex items-center gap-2">
                    <DeviconAndroid/>
                    Android
                </span>
                </td>
                <td className="p-3"></td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        (planned)
                    </span>
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">
                <span className="flex items-center gap-2">
                    <DeviconApple/>
                    iOS
                </span>
                </td>
                <td className="p-3"></td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        (planned)
                    </span>
                </td>
            </tr>
            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Requirements
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Storage Quota</td>
                <td className="p-3">min. 1.5GB each installation</td>
                <td className="p-3 text-center">min. 1.5GB on the server</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">App Requirements</td>
                <td className="p-3" colSpan={2}>
                    <ul>
                        <li>4 GB minimum recommended; 8 GB preferred</li>
                        <li>WebView2 on Windows; WebKitGTK 4.1 on Linux; macOS 10.15 or later</li>
                        <li>64-bit System</li>
                    </ul>
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Setup time</td>
                <td className="p-3 text-center">Under 1 minute</td>
                <td className="p-3 text-center">5–10 minutes</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Setup difficult</td>
                <td className="p-3 text-center">Easy</td>
                <td className="p-3 text-center">Easy - Moderate</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Other Requirements</td>
                <td className="p-3"></td>
                <td className="p-3 text-center">
                    Linux Server with <br/> Docker or CapRover
                </td>
            </tr>

            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Data
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Storage engine</td>
                <td className="p-3 text-center">SQLite (local)</td>
                <td className="p-3 text-center">SQLite</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Data location</td>
                <td className="p-3 text-center">Your computer only</td>
                <td className="p-3 text-center">Centralized on your server</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Multi-device sync</td>
                <td className="p-3"></td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Watch history survives reinstall</td>
                <td className="p-3"></td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>

            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Accounts
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">User profiles</td>
                <td className="p-3 text-center">Multiple (local-only)</td>
                <td className="p-3 text-center">Multiple (shared)</td>
            </tr>

            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Catalog & Background Work
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Catalog scraping</td>
                <td className="p-3 text-center">Only while app is open</td>
                <td className="p-3 text-center">24/7 background worker</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Web dashboard</td>
                <td className="p-3"></td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>

            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Maintenance
                </td>
            </tr>
            <tr className="border-b">
                <td className="p-3">Updates</td>
                <td className="p-3 text-center">In-app, one click</td>
                <td className="p-3 text-center">Server + desktop app, separately</td>
            </tr>
            <tr className="border-b">
                <td className="p-3">You maintain infrastructure</td>
                <td className="p-3"></td>
                <td className="p-3">
                    <span className="flex justify-center items-center">
                        <LucideCheck/>
                    </span>
                </td>
            </tr>

            <tr>
                <td colSpan={3}
                    className="bg-fd-muted/30 p-2 px-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                    Best For
                </td>
            </tr>
            <tr>
                <td className="p-3">Ideal use case</td>
                <td className="p-3 text-center">Personal use on a single PC</td>
                <td className="p-3 text-center">Households, multi-PC setups, home servers</td>
            </tr>
            </tbody>
        </table>
    );
}