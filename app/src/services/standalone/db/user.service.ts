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

        if (latest.version < currentVersion) {
            throw "Database version is ahead of application service version";
        }

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
        // language=SQLite
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

class DbVersion2 implements UserDbVersion {
    public previousVersion: UserDbVersionConstructor = DbVersion1;
    public version: number = 2;

    public constructor() {
    }

    public async migrate(session: DbSession): Promise<void> {
        // language=SQLite
        await session.execute(`
CREATE TABLE profile_new
(
    profile_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid             TEXT UNIQUE NOT NULL,
    name             TEXT        NOT NULL,
    background_color TEXT        NOT NULL,
    eye              TEXT        NOT NULL,
    mouth            TEXT        NOT NULL,
    theme            TEXT        NOT NULL,
    lang             TEXT        NOT NULL,
    tos_accepted     BOOLEAN     NOT NULL,
    sync_catalog     BOOLEAN     NOT NULL
);

INSERT INTO profile_new (profile_id, uuid, name, background_color, eye, mouth, theme, lang, tos_accepted, sync_catalog)
SELECT profile_id, uuid, name, background_color, eye, mouth, theme, lang, tos_accepted, false FROM profile;

DROP TABLE profile;

ALTER TABLE profile_new RENAME TO profile;
        `);
    }
}

// ================================================================================================================== //
//                                                   END MIGRATION                                                    //
// ================================================================================================================== //

const LATEST_VERSION: Exclude<UserDbVersionConstructor, null> = DbVersion2;

export default {
    key: UserDbService,
    ctor: UserDbServiceImpl
} satisfies ServiceDeclaration<UserDbServiceImpl>;