import {DbSession} from "@services/utils/db";
import {MetadataDbServiceImpl} from "@services/db/metadata.service";

import {DatabaseWrapper} from "@test/mocks/standalone/db";
import {ReadableGlobalContext} from "vue-mvvm";

export class MetadataDbServiceMock extends MetadataDbServiceImpl {
    private databases: Map<string, DatabaseWrapper> = new Map();

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.databases = new Map<string, DatabaseWrapper>();
    }

    public async openDB(file: string, provider: string): Promise<DbSession> {
        const existingDatabase: DatabaseWrapper | undefined = this.databases.get(file);

        if (!!existingDatabase && !existingDatabase.closed) {
            return new DbSession(existingDatabase);
        }

        const handler: DatabaseWrapper = new DatabaseWrapper();
        const session: DbSession = new DbSession(handler);

        await this.beginMigration(session, provider);

        return session;
    }
}