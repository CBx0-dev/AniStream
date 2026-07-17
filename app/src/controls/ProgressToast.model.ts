import {Component} from "vue";
import {ProgressToastControl, type ProgressToastOptions} from "vue-mvvm/toast";

import ProgressToast from "@controls/ProgressToast.vue";

export class ProgressToastModel extends ProgressToastControl {
    public static readonly component: Component = ProgressToast;

    public constructor(options: ProgressToastOptions) {
        super(options);
    }
}