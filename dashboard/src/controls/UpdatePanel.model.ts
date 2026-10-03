import {UserControl} from "vue-mvvm";
import {InformationService} from "@contracts/information.service";
import type {BackendUpdateInformation} from "@models/update.model";

export class UpdatePanelModel extends UserControl {
    private readonly informationService: InformationService;

    public updateAvailable: boolean = this.ref(false);
    public changelogUrl: string | null = this.ref("");
    public currentVersion: string = this.ref("");
    public latestVersion: string = this.ref("");

    public constructor() {
        super();

        this.informationService = this.ctx.getService(InformationService);
    }

    protected async mounted(): Promise<void> {
        const backendInformation: BackendUpdateInformation = await this.informationService.getBackendUpdateInformation();
        if (!backendInformation.latest_version) {
            return;
        }

        if (!this.isVersionHigher(backendInformation.latest_version, backendInformation.current_version)) {
            return;
        }

        this.updateAvailable = true;
        this.currentVersion = backendInformation.current_version;
        this.latestVersion = backendInformation.latest_version;
        this.changelogUrl = backendInformation.release_notes_url;
    }

    public openChangelogUrl(): void {
        if (!this.changelogUrl) {
            return;
        }

        window.open(this.changelogUrl, "_blank");
    }

    private isVersionHigher(a: string, b: string): boolean {
        const [aMajorStr, aMinorStr, aPatchStr] = a.split(".");
        const [bMajorStr, bMinorStr, bPatchStr] = b.split(".");

        const aMajor: number = parseInt(aMajorStr);
        const aMinor: number = parseInt(aMinorStr);
        const aPatch: number = parseInt(aPatchStr);
        const bMajor: number = parseInt(bMajorStr);
        const bMinor: number = parseInt(bMinorStr);
        const bPatch: number = parseInt(bPatchStr);

        return (
            aMajor > bMajor ||
            (aMajor === bMajor && aMinor > bMinor) ||
            (aMajor === bMajor && aMinor === bMinor && aPatch > bPatch)
        )
    }
}