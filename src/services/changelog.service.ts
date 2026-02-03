import {MarkdownParser} from "@utils/markdown";

// @ts-ignore
const modules: Record<string, () => Promise<string>> = import.meta.glob("/changelogs/*.md", {
    query: "?raw",
    import: "default"
});

export interface ChangelogEntry {
    version: string;
    content: string;
    parsedContent: string;
}

export class ChangelogService {
    private parser: MarkdownParser;
    private changelogs: ChangelogEntry[] = [];
    private loaded: boolean = false;

    public constructor() {
        this.parser = new MarkdownParser();
    }

    public async loadChangelogs(): Promise<void> {
        if (this.loaded) return;

        const entries: ChangelogEntry[] = [];
        for (const [path, loader] of Object.entries(modules)) {
            const content = await loader() as string;
            const versionMatch: RegExpMatchArray | null = path.match(/v(\d+\.\d+\.\d+)\.md$/);
            const version: string = versionMatch ? versionMatch[1] : path;

            entries.push({
                version,
                content,
                parsedContent: this.parser.parse(content)
            });
        }

        this.changelogs = entries.sort((a, b) => {
            return b.version.localeCompare(a.version, undefined, {numeric: true, sensitivity: 'base'});
        });

        this.loaded = true;
    }

    public getChangelogs(): ChangelogEntry[] {
        return this.changelogs;
    }
}
