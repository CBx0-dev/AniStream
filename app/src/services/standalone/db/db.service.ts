import {ReadableGlobalContext} from "vue-mvvm";

import {DbService} from "@contracts/standalone/db.contract";
import {MetadataDbService} from "@contracts/standalone/metadata.contract";

import {DbSession} from "@services/utils/db";
import {ServiceDeclaration} from "@services/declaration";

import {DefaultProvider} from "@providers/default";

class DbServiceImpl implements DbService {
    private readonly metadataDbService: MetadataDbService;

    private readonly sessions: Map<string, DbSession>;


    public constructor(ctx: ReadableGlobalContext) {
        this.metadataDbService = ctx.getService(MetadataDbService);

        this.sessions = new Map<string, DbSession>();
    }

    public async getDatabase(provider: DefaultProvider): Promise<DbSession> {
       let session: DbSession | undefined = this.sessions.get(provider.uniqueKey);
        if (!session) {
            const dbFile: string = await provider.getDatabaseFile();

            session = await this.metadataDbService.openDB(dbFile, provider.uniqueKey);

            this.sessions.set(provider.uniqueKey, session);
        }

        return session;
    }

    public async closeDatabase(provider: DefaultProvider): Promise<void> {
        const session: DbSession | undefined = this.sessions.get(provider.uniqueKey);
        if (session) {
            await session.close();
        }
    }
}

export default {
    key: DbService,
    ctor: DbServiceImpl
} satisfies ServiceDeclaration<DbService>;