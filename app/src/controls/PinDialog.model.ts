import {Component, nextTick} from "vue";
import {Action, ActionContext, Delegate} from "vue-mvvm";
import {DialogControl} from "vue-mvvm/dialog";

import {UserService} from "@contracts/user.contract";

import PinDialog from "@controls/PinDialog.vue";

import {ProfileModel} from "@models/profile.model";

export class PinDialogModel extends DialogControl implements Action<void> {
    public static readonly component: Component = PinDialog;

    private readonly userService: UserService;

    private readonly profile: ProfileModel;

    private actionCTX: ActionContext<void> | null = null;

    public readonly onFocus: Delegate<[number]> = new Delegate<[number]>();
    public readonly pinLength: number = 6;

    public isOpen: boolean = this.ref(false);
    public isTrying: boolean = this.ref(false);
    public failed: boolean = this.ref(false);
    public pin: string[] = this.ref(Array(6).fill(""));

    public constructor(profile: ProfileModel) {
        super();

        this.userService = this.ctx.getService(UserService);

        this.profile = profile;
    }

    protected async onOpen(): Promise<void> {
        this.isOpen = true;

        await nextTick();
        await this.onFocus.invoke(0);
    }

    protected onClose(): void {
        if (this.actionCTX) {
            this.actionCTX.failAction("Modal was closed");
            this.actionCTX = null;
        }
        this.isOpen = false;
    }

    public onAction(ctx: ActionContext<void>): void | Promise<void> {
        if (this.actionCTX) {
            ctx.failAction("A action is already running");
            return;
        }

        this.actionCTX = ctx;
    }

    public async onInput(index: number, event: InputEvent): Promise<void> {
        if (!event.target) {
            return;
        }

        this.pin[index] = (event.target as HTMLInputElement).value.slice(-1);
        await this.onFocus.invoke(index + 1);

        if (index == this.pinLength - 1) {
            await this.onFullInput();
        }
    }

    public async onKeyDown(index: number, event: KeyboardEvent): Promise<void> {
        if (event.key == "Backspace") {
            event.preventDefault();
            this.pin[index] = "";
            await this.onFocus.invoke(index - 1);
            return;
        }

        if (event.key == "ArrowLeft" && index > 0) {
            event.preventDefault();
            await this.onFocus.invoke(index - 1);
            return;
        }

        if (event.key == "ArrowRight") {
            event.preventDefault();
            await this.onFocus.invoke(index + 1);
            return;
        }
    }

    public async onPaste(event: ClipboardEvent): Promise<void> {
        event.preventDefault();

        if (!event.clipboardData) {
            return;
        }

        const text: string = event.clipboardData.getData("text").slice(0, this.pinLength);

        text.split("").forEach((c: string, i: number): void => {
            this.pin[i] = c;
        });

        const next: number = Math.min(text.length, this.pinLength - 1);
        await this.onFocus.invoke(next);
    }

    private async onFullInput(): Promise<void> {
        if (!this.actionCTX) {
            return;
        }

        const password: string = this.pin.join("");

        this.isTrying = true;
        this.failed = false;
        if (await this.userService.authenticate(this.profile, password)) {
            this.actionCTX.completeAction();
        } else {
            this.pin = Array(this.pinLength).fill("");
            this.failed = true;
        }

        this.isTrying = false;
        nextTick().then(() => this.onFocus.invoke(0))
    }
}