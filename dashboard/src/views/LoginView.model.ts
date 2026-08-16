import {type Component, nextTick} from "vue";
import {Delegate, ViewModel} from "vue-mvvm";
import {type RouteAdapter, RouterService} from "vue-mvvm/router";

import LoginView from "@views/LoginView.vue";
import {DashboardViewModel} from "@views/DashboardView.model";

import {ProfileService} from "@contracts/profile.service";

export class LoginViewModel extends ViewModel {
    public static readonly component: Component = LoginView;
    public static readonly route: RouteAdapter = {
        path: "/"
    }

    private readonly routerService: RouterService;
    private readonly profileService: ProfileService;

    public readonly onFocus: Delegate<[number]> = new Delegate<[number]>();
    public readonly pinLength: number = 6;

    public error: string = this.ref("");   
    public isTrying: boolean = this.ref(false);
    public step: number = this.ref(0);
    public username: string = this.ref("");
    public pin: string[] = this.ref(Array(6).fill(""));

    public readonly title: string = this.computed(() => {
        if (this.step == 0) {
            return "Enter username";
        }

        return "Enter password";
    });

    public constructor() {
        super();

        this.routerService = this.ctx.getService(RouterService);
        this.profileService = this.ctx.getService(ProfileService);
    }

    public async onUsernameSubmitBtn(): Promise<void> {
        this.step++;
        await nextTick();
        await this.onFocus.invoke(0);
    }

    public async onPinInput(index: number, event: InputEvent): Promise<void> {
        if (!event.target) {
            return;
        }

        this.pin[index] = (event.target as HTMLInputElement).value.slice(-1);
        await this.onFocus.invoke(index + 1);

        if (index == this.pinLength - 1) {
            await this.onFullPinInput();
        }
    }

    public async onPinKeyDown(index: number, event: KeyboardEvent): Promise<void> {
        if (event.key == "Backspace") {
            event.preventDefault();
            this.pin[index] = "";
            await this.onFocus.invoke(index - 1);
            return;
        }

        if (event.key == "ArrowLeft") {
            event.preventDefault();
            await this.onFocus.invoke(index - 1);
        }

        if (event.key == "ArrowRight") {
            event.preventDefault();
            await this.onFocus.invoke(index + 1);
        }
    }

    public async onPinPaste(event: ClipboardEvent): Promise<void> {
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

    public async onFullPinInput(): Promise<void> {
        this.error = "";
        this.isTrying = true;
        
        if (!await this.profileService.login(this.username, this.pin.join(""))) {
            this.error = "Username or password is wrong";
            this.isTrying = false;
            return;
        }
    
        await this.routerService.navigateTo(DashboardViewModel);
        this.isTrying = false;
    }

}