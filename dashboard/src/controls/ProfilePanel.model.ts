import {UserControl} from "vue-mvvm";

/**
 * A flattened view of a row from the `profile` table plus the two access flags
 * that gate the dashboard and the regular streaming client.
 */
export interface Profile {
    id: number;
    uuid: string;
    name: string;
    backgroundColor: string;
    eye: string;
    mouth: string;
    theme: string;
    lang: string;
    tosAccepted: boolean;
    syncCatalog: boolean;
    /** Whether the profile may sign in to this admin dashboard. */
    dashboardAccess: boolean;
    /** Whether the profile may sign in to the normal streaming client. */
    clientAccess: boolean;
}

interface SelectOption {
    value: string;
    label: string;
}

export class ProfilePanelModel extends UserControl {
    public readonly themeOptions: SelectOption[] = this.readonly([
        {value: "aniworld-light", label: "Light"},
        {value: "aniworld-dark", label: "Dark"}
    ]);

    public readonly langOptions: SelectOption[] = this.readonly([
        {value: "en", label: "English"},
        {value: "de", label: "Deutsch"}
    ]);

    public readonly eyeOptions: string[] = this.readonly(["•", "◕", "^", "˘", "o", "-"]);
    public readonly mouthOptions: string[] = this.readonly(["‿", "◡", "ω", "▽", "o", "-"]);

    public search: string = this.ref("");

    /** The draft currently being edited/created, or `null` when the editor is closed. */
    public editing: Profile | null = this.ref<Profile | null>(null);
    public isNew: boolean = this.ref(false);

    private profiles: Profile[] = this.ref<Profile[]>([
        {
            id: 1,
            uuid: "b1e7c0a2-1f3d-4a5b-9c6d-0e1f2a3b4c5d",
            name: "Administrator",
            backgroundColor: "#c4b5fd",
            eye: "•",
            mouth: "‿",
            theme: "aniworld-dark",
            lang: "en",
            tosAccepted: true,
            syncCatalog: true,
            dashboardAccess: true,
            clientAccess: true
        },
        {
            id: 2,
            uuid: "a2f8d1b3-2e4c-5b6a-8d7e-1f0a2b3c4d5e",
            name: "Christoph",
            backgroundColor: "#a7f3d0",
            eye: "◕",
            mouth: "◡",
            theme: "aniworld-dark",
            lang: "de",
            tosAccepted: true,
            syncCatalog: true,
            dashboardAccess: true,
            clientAccess: true
        },
        {
            id: 3,
            uuid: "c3a9e2c4-3f5d-6c7b-9e8f-2a1b3c4d5e6f",
            name: "Living Room",
            backgroundColor: "#fde68a",
            eye: "^",
            mouth: "ω",
            theme: "aniworld-light",
            lang: "en",
            tosAccepted: true,
            syncCatalog: false,
            dashboardAccess: false,
            clientAccess: true
        },
        {
            id: 4,
            uuid: "d4baf3d5-4a6e-7d8c-af9a-3b2c4d5e6f7a",
            name: "Mia",
            backgroundColor: "#fbcfe8",
            eye: "˘",
            mouth: "▽",
            theme: "aniworld-light",
            lang: "de",
            tosAccepted: false,
            syncCatalog: false,
            dashboardAccess: false,
            clientAccess: true
        },
        {
            id: 5,
            uuid: "e5cb04e6-5b7f-8e9d-b0ab-4c3d5e6f7a8b",
            name: "Kids",
            backgroundColor: "#bae6fd",
            eye: "o",
            mouth: "o",
            theme: "aniworld-light",
            lang: "en",
            tosAccepted: true,
            syncCatalog: false,
            dashboardAccess: false,
            clientAccess: true
        },
        {
            id: 6,
            uuid: "f6dc15f7-6c8a-9f0e-c1bc-5d4e6f7a8b9c",
            name: "Sync Bot",
            backgroundColor: "#e5e7eb",
            eye: "-",
            mouth: "-",
            theme: "aniworld-dark",
            lang: "en",
            tosAccepted: true,
            syncCatalog: true,
            dashboardAccess: true,
            clientAccess: false
        }
    ]);

    public readonly filtered: Profile[] = this.computed<Profile[]>(() => {
        const term: string = this.search.trim().toLowerCase();
        if (term.length === 0) {
            return this.profiles;
        }

        return this.profiles.filter((p: Profile): boolean => p.name.toLowerCase().includes(term));
    });

    public readonly total: number = this.computed<number>(() => this.profiles.length);
    public readonly dashboardUsers: number = this.computed<number>(
        () => this.profiles.filter((p: Profile): boolean => p.dashboardAccess).length
    );

    public themeLabel(theme: string): string {
        return this.themeOptions.find((o: SelectOption): boolean => o.value === theme)?.label ?? theme;
    }

    public langLabel(lang: string): string {
        return this.langOptions.find((o: SelectOption): boolean => o.value === lang)?.label ?? lang;
    }

    public openCreate(): void {
        this.isNew = true;
        this.editing = {
            id: this.nextId(),
            uuid: crypto.randomUUID(),
            name: "",
            backgroundColor: "#c4b5fd",
            eye: "•",
            mouth: "‿",
            theme: "aniworld-light",
            lang: "en",
            tosAccepted: false,
            syncCatalog: false,
            dashboardAccess: false,
            clientAccess: true
        };
    }

    public openEdit(profile: Profile): void {
        this.isNew = false;
        // Work on a copy so the card only updates once the user saves.
        this.editing = {...profile};
    }

    public closeEditor(): void {
        this.editing = null;
    }

    public save(): void {
        if (!this.editing || this.editing.name.trim().length === 0) {
            return;
        }

        const draft: Profile = this.editing;
        const index: number = this.profiles.findIndex((p: Profile): boolean => p.id === draft.id);

        if (index >= 0) {
            this.profiles = this.profiles.map((p: Profile): Profile => (p.id === draft.id ? draft : p));
        } else {
            this.profiles = [...this.profiles, draft];
        }

        this.editing = null;
    }

    public remove(profile: Profile): void {
        this.profiles = this.profiles.filter((p: Profile): boolean => p.id !== profile.id);
    }

    private nextId(): number {
        return this.profiles.reduce((max: number, p: Profile): number => Math.max(max, p.id), 0) + 1;
    }
}
