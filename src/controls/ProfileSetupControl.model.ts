import {UserControl} from "vue-mvvm";

import {ProfileEye, ProfileMouth} from "@models/profile.model";

import {UserService} from "@services/user.service";

export class ProfileSetupControlModel extends UserControl {
    public static readonly EYES: ProfileEye[] = ["bulging", "dizzy", "eva", "frame1", "frame2", "glow", "happy", "round", "roundFrame01", "roundFrame02", "sensor", "shade01"];
    public static readonly MOUTHS: ProfileMouth[] = ["bite", "grill01", "grill02", "grill03", "smile01", "smile02", "square01", "square02"];

    private readonly userService: UserService;

    private backgroundColorValue: string = this.computed(() => this.backgroundColor.substring(1));

    public name: string = this.ref("");
    public backgroundColor: string = this.ref("#afec9f");
    public eye: ProfileEye = this.ref("frame1");
    public mouth: ProfileMouth = this.ref("smile01");
    public theme: string = this.ref("aniworld-light");
    public local: string = this.ref("en");

    public avatarSvg: string = this.computed(() => this.userService.getAvatarSvg(this.backgroundColorValue, this.eye, this.mouth));

    public getAvatarWithEye(eye: ProfileEye): string {
        return this.userService.getAvatarSvg(this.backgroundColorValue, eye, this.mouth);
    }

    public getAvatarWithMouth(mouth: ProfileMouth): string {
        return this.userService.getAvatarSvg(this.backgroundColorValue, this.eye, mouth);
    }

    public constructor() {
        super();

        this.userService = this.ctx.getService(UserService);
    }

    public async onCreateProfileBtn(): Promise<void> {
        if (!this.name) {
            return;
        }

        // TODO implement
    }

    public onEyeItem(eye: ProfileEye): void {
        this.eye = eye;
    }

    public onMouthItem(mouth: ProfileMouth): void {
        this.mouth = mouth;
    }

    public onAniworldLightThemeBtn(): void {
        this.theme = "aniworld-light";
    }

    public onAniworldDarkThemeBtn(): void {
        this.theme = "aniworld-dark";

    }

    public onStoLightThemeBtn(): void {
        this.theme = "sto-light";

    }

    public onStoDarkThemeBtn(): void {
        this.theme = "sto-dark";
    }

    public onEnLocalBtn(): void {
        this.local = "en";
    }

    public onDeLocalBtn(): void {
        this.local = "de";
    }
}
