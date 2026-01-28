import {Component} from "vue";
import {ConfirmControl, ConfirmOptions} from "vue-mvvm/alert";

import ConfirmControlComponent  from "@controls/ConfirmControl.vue";
import {ActionContext} from "vue-mvvm";

export class ConfirmControlModel extends ConfirmControl {
    public static readonly component: Component = ConfirmControlComponent;
    private actionContext: ActionContext<boolean> | null;
    public opened: boolean = this.ref(false);

    public title: string = this.computed(() => this.options.title);
    public description: string = this.computed(() => this.options.description);

    public constructor(options: ConfirmOptions) {
        super(options);

        this.actionContext = null;
    }

    public onOpen(): void | Promise<void> {
        this.opened = true;
    }

    public onClose(): void | Promise<void> {
        this.opened = false;
        this.destroy();
        if (this.actionContext) {
            this.actionContext.completeAction(false);
        }
    }

    public onAction(ctx: ActionContext<boolean>): void | Promise<void> {
        if (this.actionContext) {
            ctx.failAction("An action is already running");
        }

        this.actionContext = ctx;
    }

    public async onNoBtn(): Promise<void> {
        if (!this.actionContext) {
            return;
        }

        this.actionContext.completeAction(false);
        this.actionContext = null;
        await this.closeDialog();
    }

    public async onYesBtn(): Promise<void> {
        if (!this.actionContext) {
            return;
        }

        this.actionContext.completeAction(true);
        this.actionContext = null;
        await this.closeDialog();
    }
}