import {UserControl} from "vue-mvvm";
import {ChangelogEntry, ChangelogService} from "@services/changelog.service";

export class ChangelogControlModel extends UserControl {
    public changelogs: ChangelogEntry[] = [];
    public activeVersion: string = this.ref("");
    public loading: boolean = this.ref(true);

    private changelogService: ChangelogService;

    public constructor() {
        super();
        this.changelogService = this.ctx.getService(ChangelogService);
    }

    public async mounted(): Promise<void> {
        this.loading = true;
        await this.changelogService.loadChangelogs();
        this.changelogs = this.changelogService.getChangelogs();

        if (this.changelogs.length > 0 && !this.activeVersion) {
            this.activeVersion = this.changelogs[0].version;
        }
        this.loading = false;
    }

    public scrollToVersion(version: string) {
        this.activeVersion = version;
        const element: HTMLElement | null = document.getElementById(`changelog-${version}`);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    }
}
