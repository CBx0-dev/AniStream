import * as path from "path";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            "@views": path.join(__dirname, "src", "views"),
            "@controls": path.join(__dirname, "src", "controls")
        }
    }
});
