import { Component } from "vue";
import { DialogControl } from "vue-mvvm/dialog";
import DetailControl from "./DetailControl.vue";

export class DetailControlModel extends DialogControl {
    public static readonly component: Component = DetailControl;

    public opened: boolean = this.ref(false);

    protected onOpen(): void | Promise<void> {
        this.opened = true;
    }

    protected onClose(): void | Promise<void> {
        this.opened = false;
        this.destroy();
    }
}