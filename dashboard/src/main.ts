import {createApp} from "vue";
import {MVVMApp, createMVVM} from "vue-mvvm";

import {AppConfig} from "./config";
import "./main.css";

createApp(MVVMApp)
    .use(createMVVM(new AppConfig()))
    .mount("#app");
