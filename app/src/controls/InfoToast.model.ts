import {Component} from "vue";
import {InfoToastControl, type InfoToastOptions} from "vue-mvvm/toast";

import InfoToast from "@controls/InfoToast.vue";

export class InfoToastModel extends InfoToastControl {
    public static readonly component: Component = InfoToast;

    public constructor(options: InfoToastOptions) {
        super(options);
    }

    public async onCloseBtn(): Promise<void> {
        await this.destroy();
    }
}