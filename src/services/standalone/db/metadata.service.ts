import Database from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext, ServiceKey} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";
import {DbSession, DbVersion, DbVersionConstructor} from "@services/utils/db";

import {UserService} from "@contracts/user.contract";

import {ProfileModel} from "@models/profile.model";

class MetadataDbServiceImpl {
    private readonly userService: UserService;

    public constructor(ctx: ReadableGlobalContext) {
        this.userService = ctx.getService(UserService);
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

        const userService: UserService = this.userService;

        await session.transaction(async function (): Promise<void> {
            for (const migration of chain) {
                await migration.migrate(this, userService, provider);
            }
            await session.execute(`PRAGMA user_version = ${latest.version}`);
        });
    }
}

// ================================================================================================================== //
//                                                     MIGRATION                                                      //
// ================================================================================================================== //
type MetadataDbVersion = DbVersion<[userService: UserService, provider: string]>;
type MetadataDbVersionConstructor = DbVersionConstructor<[userService: UserService, provider: string]> | null;

class DbVersion1 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = null;
    public version: number = 1;

    public constructor() {
    }

    public async migrate(session: DbSession, _userService: UserService, _provider: string): Promise<void> {
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

    public async migrate(session: DbSession, _userService: UserService, _provider: string): Promise<void> {
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

class DbVersion3 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = DbVersion2;

    public version: number = 3;

    public async migrate(session: DbSession, userService: UserService, _provider: string): Promise<void> {
        const profile: ProfileModel = await userService.getMigrationProfile();

        await session.execute(`
CREATE TABLE watchlist_new
(
    watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id    INTEGER UNIQUE NOT NULL,
    tenant_id    TEXT NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);

INSERT INTO watchlist_new (watchlist_id, series_id, tenant_id)
SELECT watchlist_id, series_id, ? FROM watchlist;

DROP TABLE watchlist;

ALTER TABLE watchlist_new RENAME TO watchlist;

CREATE TABLE episode_new
(
    episode_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id          INTEGER NOT NULL,
    episode_number     INTEGER NOT NULL,
    german_title       TEXT    NOT NULL,
    english_title      TEXT    NOT NULL,
    description        TEXT    NOT NULL,
    FOREIGN KEY (season_id) REFERENCES season (season_id) ON DELETE RESTRICT
);

INSERT INTO episode_new (episode_id, season_id, episode_number, german_title, english_title, description)
SELECT episode_id, season_id, episode_number, german_title, english_title, description FROM episode;

ALTER TABLE episode RENAME TO episode_old;
ALTER TABLE episode_new RENAME TO episode;

CREATE TABLE watchtime
(
    watchtime_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id         INTEGER NOT NULL,
    percentage_watched INTEGER NOT NULL,
    stopped_time       INTEGER NOT NULL,
    tenant_id          TEXT NOT NULL,
    FOREIGN KEY (episode_id) REFERENCES episode (episode_id) ON DELETE CASCADE
);

INSERT INTO watchtime (episode_id, percentage_watched, stopped_time, tenant_id)
SELECT episode_id, percentage_watched, stopped_time, ? FROM episode_old;

DROP TABLE episode_old;
        `, profile.uuid, profile.uuid);
    }
}

// ================================================================================================================== //
//                                                   END MIGRATION                                                    //
// ================================================================================================================== //

const LATEST_VERSION: Exclude<MetadataDbVersionConstructor, null> = DbVersion3;

export type MetadataDbService = MetadataDbServiceImpl;
export const MetadataDbService: ServiceKey<MetadataDbServiceImpl> = new ServiceKey<MetadataDbServiceImpl>("metadata.db.service");

export default {
    key: MetadataDbService,
    ctor: MetadataDbServiceImpl
} satisfies ServiceDeclaration<MetadataDbServiceImpl>;