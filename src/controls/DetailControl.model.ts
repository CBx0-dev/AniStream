import { Component } from "vue";
import { DialogControl } from "vue-mvvm/dialog";
import DetailControl from "./DetailControl.vue";
import { I18nService } from "@/services/i18n.service";

export class DetailControlModel extends DialogControl {
    public static readonly component: Component = DetailControl;

    private readonly i18nService: I18nService;

    public opened: boolean = this.ref(false);

    public constructor() {
        super();
        this.i18nService = this.ctx.getService(I18nService);
    }

    protected onOpen(): void | Promise<void> {
        this.opened = true;
    }

    protected onClose(): void | Promise<void> {
        this.opened = false;
        this.destroy();
    }

    public i18n(key: readonly [string, readonly string[]]): string {
        return this.i18nService.get(key);
    }
}