import Database from "@tauri-apps/plugin-sql";

import {UserDbService} from "@contracts/standalone/user.contract";

import {ServiceDeclaration} from "@services/declaration";
import {DbSession, DbVersion, DbVersionConstructor} from "@services/utils/db";

export class UserDbServiceImpl implements UserDbService {
    public constructor() {
    }

    public async openDB(file: string): Promise<DbSession> {
        const handler: Database = await Database.load(`sqlite:${file}`);
        const session: DbSession = new DbSession(handler);

        await this.beginMigration(session);

        return session;
    }

    private async beginMigration(session: DbSession): Promise<void> {
        const [{user_version: currentVersion}] = await session.query<Array<{
            user_version: number;
        }>>("PRAGMA user_version");

        let latest: UserDbVersion = new LATEST_VERSION();

        if (latest.version == currentVersion) {
            return;
        }

        let current: UserDbVersion = latest;
        const chain: UserDbVersion[] = [latest];
        while (current.version - 1 > currentVersion) {
            if (!current.previousVersion) {
                throw `Database migration chain is broken: Cannot find migration path from version ${currentVersion} to version ${current.version}`;
            }
            current = new current.previousVersion();
            chain.unshift(current);
        }

        await session.transaction(async function (): Promise<void> {
            for (const migration of chain) {
                await migration.migrate(this);
            }
            await session.execute(`PRAGMA user_version = ${latest.version}`);
        });
    }
}

// ================================================================================================================== //
//                                                     MIGRATION                                                      //
// ================================================================================================================== //
type UserDbVersion = DbVersion<[]>;
type UserDbVersionConstructor = DbVersionConstructor<[]> | null;

class DbVersion1 implements UserDbVersion {
    public previousVersion: UserDbVersionConstructor = null;
    public version: number = 1;

    public constructor() {
    }

    public async migrate(session: DbSession): Promise<void> {
        await session.execute(`
PRAGMA user_version = 1;

CREATE TABLE profile
(
    profile_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid             TEXT UNIQUE NOT NULL,
    name             TEXT        NOT NULL,
    background_color TEXT        NOT NULL,
    eye              TEXT        NOT NULL,
    mouth            TEXT        NOT NULL,
    theme            TEXT        NOT NULL,
    lang             TEXT        NOT NULL,
    tos_accepted     BOOLEAN     NOT NULL
);
        `);
    }
}

// ================================================================================================================== //
//                                                   END MIGRATION                                                    //
// ================================================================================================================== //

const LATEST_VERSION: Exclude<UserDbVersionConstructor, null> = DbVersion1;

export default {
    key: UserDbService,
    ctor: UserDbServiceImpl
} satisfies ServiceDeclaration<UserDbServiceImpl>;