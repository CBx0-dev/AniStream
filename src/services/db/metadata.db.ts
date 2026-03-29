import Database from "@tauri-apps/plugin-sql";

import {DbSession, DbVersion, DbVersionConstructor} from "@services/db.service";

export class MetadataDbService {
    public constructor() {
    }

    public async openDB(file: string, provider: string): Promise<DbSession> {
        const handler: Database = await Database.load(`sqlite:${file}`);
        const session: DbSession = new DbSession(handler);

        await this.beginMigration(session, provider);

        return session;
    }

    private async beginMigration(session: DbSession, provider: string): Promise<void> {
        const [{user_version: currentVersion}] = await session.query<Array<{
            user_version: number;
        }>>("PRAGMA user_version");

        let latest: MetadataDbVersion = new LATEST_VERSION();

        if (latest.version < currentVersion) {
            throw "Database version is ahead of application service version";
        }

        if (latest.version == currentVersion) {
            return;
        }

        let current: MetadataDbVersion = latest;
        const chain: MetadataDbVersion[] = [latest];
        while (current.version - 1 > currentVersion) {
            if (!current.previousVersion) {
                throw `Database migration chain is broken: Cannot find migration path from version ${currentVersion} to version ${current.version}`;
            }
            current = new current.previousVersion();
            chain.unshift(current);
        }

        await session.transaction(async function (): Promise<void> {
            for (const migration of chain) {
                await migration.migrate(this, provider);
            }
            await session.execute(`PRAGMA user_version = ${latest.version}`);
        });
    }
}

// ================================================================================================================== //
//                                                     MIGRATION                                                      //
// ================================================================================================================== //
type MetadataDbVersion = DbVersion<[provider: string]>;
type MetadataDbVersionConstructor = DbVersionConstructor<[provider: string]> | null;

class DbVersion1 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = null;
    public version: number = 1;

    public constructor() {
    }

    public async migrate(session: DbSession, _provider: string): Promise<void> {
        await session.execute(`
PRAGMA user_version = 1;

CREATE TABLE series
(
    series_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    guid          TEXT UNIQUE NOT NULL,
    title         TEXT        NOT NULL,
    description   TEXT        NOT NULL,
    preview_image TEXT UNIQUE
);

CREATE TABLE season
(
    season_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id     INTEGER NOT NULL,
    season_number INTEGER NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);

CREATE TABLE episode
(
    episode_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id          INTEGER NOT NULL,
    episode_number     INTEGER NOT NULL,
    german_title       TEXT    NOT NULL,
    english_title      TEXT    NOT NULL,
    description        TEXT    NOT NULL,
    percentage_watched INTEGER NOT NULL,
    stopped_time       INTEGER NOT NULL,
    FOREIGN KEY (season_id) REFERENCES season (season_id) ON DELETE RESTRICT
);

CREATE TABLE genre
(
    genre_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    key          TEXT UNIQUE NOT NULL
);

CREATE TABLE genre_to_series
(
    genre_to_series_id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_id           INTEGER NOT NULL,
    series_id          INTEGER NOT NULL,
    main_genre         BOOLEAN NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE RESTRICT,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);
        `);
    }
}

class DbVersion2 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = DbVersion1;

    public version: number = 2;

    public async migrate(session: DbSession, _provider: string): Promise<void> {
        await session.execute(`
CREATE TABLE watchlist
(
    watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id    INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);
        `);
    }
}

// class DbVersion3 implements DbVersion {
//     public previousVersion: DbVersionConstructor | null = DbVersion2;
//
//     public version: number = 3;
//
//     public async migrate(session: DbSession, _provider: string): Promise<void> {
//         await session.execute(``);
//     }
// }

// ================================================================================================================== //
//                                                   END MIGRATION                                                    //
// ================================================================================================================== //

const LATEST_VERSION: Exclude<MetadataDbVersionConstructor, null> = DbVersion2;