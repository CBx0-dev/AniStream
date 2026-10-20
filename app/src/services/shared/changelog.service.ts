import {ServiceDeclaration} from "@services/declaration";
import {ChangelogService, ChangelogEntry} from "@contracts/changelog.contract";

import {MarkdownParser} from "@utils/markdown";
import * as version from "@utils/version";
import {changelogs} from "virtual:changelogs";

class ChangelogServiceImpl implements ChangelogService {
    private parser: MarkdownParser;
    private changelogs: ChangelogEntry[] = [];
    private loaded: boolean = false;

    public constructor() {
        this.parser = new MarkdownParser();
    }

    public async loadChangelogs(): Promise<void> {
        if (this.loaded) return;

        const entries: ChangelogEntry[] = [];
        for (const [path, loader] of Object.entries(changelogs)) {
            const content = await loader() as string;
            const versionMatch: RegExpMatchArray | null = path.match(/v(\d+\.\d+\.\d+)\.md$/);
            const version: string = versionMatch ? versionMatch[1] : path;

            entries.push({
                version,
                content,
                parsedContent: this.parser.parse(content)
            });
        }

        this.changelogs = entries.sort((a, b) =>
            version.compare(b.version, a.version)
        );

        this.loaded = true;
    }

    public getChangelogs(): ChangelogEntry[] {
        return this.changelogs;
    }
}

export default {
    key: ChangelogService,
    ctor: ChangelogServiceImpl
} satisfies ServiceDeclaration<ChangelogService>;