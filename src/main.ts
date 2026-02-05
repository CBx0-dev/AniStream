import { App, createApp } from "vue";
import { createMVVM, MVVMApp } from "vue-mvvm";
import { AppConfig } from "@/config";

import "@utils/array";
import "@utils/string";

import "@/main.css";

const app: App = createApp(MVVMApp);

app.use(createMVVM(new AppConfig(app)));
app.mount("#app");

window.addEventListener("contextmenu", e => e.preventDefault());
