import {DbSession} from "@services/utils/db";
import {UserDbServiceImpl} from "@services/db/user.service";

import {DatabaseWrapper} from "@test/mocks/standalone/db";

export class UserDbServiceMock extends UserDbServiceImpl {
    private databases: Map<string, DatabaseWrapper> = new Map();

    public constructor() {
        super();

        this.databases = new Map<string, DatabaseWrapper>();
    }

    public async openDB(file: string): Promise<DbSession> {
        const existingDatabase: DatabaseWrapper | undefined = this.databases.get(file);

        if (!!existingDatabase && !existingDatabase.closed) {
            return new DbSession(existingDatabase);
        }

        const handler: DatabaseWrapper = new DatabaseWrapper();
        const session: DbSession = new DbSession(handler);

        await this.beginMigration(session);
        // await this.insertMigrationProfile(session);

        return session;
    }
    /*
    private async insertMigrationProfile(session: DbSession): Promise<void> {
        // language=SQLite
        await session.execute(`
            INSERT INTO profile (uuid, name, background_color, eye, mouth, theme, lang, tos_accepted,
                                 sync_catalog)
            VALUES ('11111111-1111-1111-1111-111111111111', 'Migration', 'FFFFFF', 'eye', 'mouth',
                    'aniworld-dark', 'en', 0, 0)
        `);
    }
    */
}
