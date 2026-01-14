import { Component, ComponentInternalInstance, getCurrentInstance } from "vue";
import { DialogControl } from "vue-mvvm/dialog";
import DetailControl from "@controls/DetailControl.vue";
import {SeriesModel} from "@models/series.model";

export class DetailControlModel extends DialogControl {
    public static readonly component: Component = DetailControl;

    public opened: boolean = this.ref(false);
    public uid: number = this.computed(() => {
        const instance: ComponentInternalInstance | null = getCurrentInstance();
        if (!instance) {
            return Math.round(Math.random() * 1000)
        }

        return instance.uid;
    });
    public popoverId: string = this.computed(() => `popover-${this.uid}`);
    public anchorId: string = this.computed(() => `--anchor-${this.uid}`);

    public constructor(_series: SeriesModel) {
        super();
    }

    protected onOpen(): void | Promise<void> {
        this.opened = true;
    }

    protected onClose(): void | Promise<void> {
        this.opened = false;
        this.destroy();
    }

    public onResetProgressionBtn(): void {

    }

    public onAddWatchlistBtn(): void {

    }

    public onAddListBtn(): void {
        
    }
}