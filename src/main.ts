import { App, createApp } from "vue";
import { createMVVM, MVVMApp } from "vue-mvvm";
import { AppConfig } from "@/config";

import "@utils/array";
import "@/main.css";

const app: App = createApp(MVVMApp);

app.use(createMVVM(new AppConfig()));
app.mount("#app");
