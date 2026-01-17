import {Component} from "vue";
import {DialogControl} from "vue-mvvm/dialog";

import ToSControl from "@controls/ToSControl.vue";
import {Action, ActionContext} from "vue-mvvm";
import {SettingsService} from "@services/settings.service";

export class ToSControlModel extends DialogControl implements Action<void> {
    public static readonly component: Component = ToSControl;

    private readonly settingsService: SettingsService;

    private actionContext: ActionContext<void> | null;

    public opened: boolean = this.ref(false);
    public showError: boolean = this.ref(false);
    public acceptedTerms: boolean = this.ref(false);

    public constructor() {
        super();

        this.settingsService = this.ctx.getService(SettingsService);

        this.actionContext = null;
    }

    public onOpen(): void | Promise<void> {
        this.opened = true;
    }

    public onClose(): void | Promise<void> {
        this.opened = false;
        this.destroy();
    }

    public onAction(ctx: ActionContext<void>): void {
        this.actionContext = ctx;
    }

    public async onContinueBtn(): Promise<void> {
        if (!this.actionContext) {
            return;
        }

        if (!this.acceptedTerms) {
            this.showError = true;
            return;
        }

        this.settingsService.tosAccepted = true;
        this.actionContext.completeAction();
        await this.closeDialog();
    }
}