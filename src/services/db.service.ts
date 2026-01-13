import Database, {QueryResult} from "@tauri-apps/plugin-sql";
import {ProviderService} from "@services/provider.service";
import {ReadableGlobalContext} from "vue-mvvm";

export class DbService {

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
            user_version: number
        }>>("PRAGMA user_version");

        let latest: DbVersion = new LATEST_VERSION();

        if (latest.version < currentVersion) {
            throw "Database version is ahead of application service version";
        }

        if (latest.version == currentVersion) {
            return;
        }

        let current: DbVersion = latest;
        const chain: DbVersion[] = [latest];
        while (current.version - 1 > currentVersion) {
            if (!current.previousVersion) {
                throw `Database migration chain is broken: Cannot find migration path from version ${currentVersion} to version ${current.version}`;
            }
            current = new current.previousVersion();
            chain.unshift(current);
        }

        await session.transaction(async (session: DbSession): Promise<void> => {
            for (const migration of chain) {
                await migration.migrate(session, provider);
            }
            await session.execute(`PRAGMA user_version = ${latest.version}`);
        });
    }
}

export class DbServiceBase {
    protected readonly provider: ProviderService;

    protected constructor(ctx: ReadableGlobalContext) {
        this.provider = ctx.getService(ProviderService);
    }
}

export class DbSession {
    private readonly handler: Database;
    private closed: boolean;

    public constructor(handler: Database) {
        this.handler = handler;
        this.closed = false;
    }


    public async query<T>(query: string, ...params: any[]): Promise<T> {
        if (this.closed) {
            throw "No DB Handler was initialized";
        }

        return await this.handler.select<T>(query, params);
    }

    public async execute(query: string, ...params: any[]): Promise<QueryResult> {
        if (this.closed) {
            throw "No DB Handler was initialized";
        }

        return await this.handler.execute(query, params);
    }

    public async transaction<T>(cb: (service: DbSession) => Promise<T>): Promise<T> {
        await this.execute("BEGIN TRANSACTION");
        try {
            const result = await cb(this);
            await this.execute("COMMIT");
            return result;
        } catch (e) {
            await this.execute("ROLLBACK");
            throw e;
        }
    }

    public async close(): Promise<void> {
        this.closed = true;
        await this.handler.close();
    }
}

// ================================================================================================================== //
//                                                     MIGRATION                                                      //
// ================================================================================================================== //

type DbVersionConstructor = new () => DbVersion;

interface DbVersion {
    previousVersion: DbVersionConstructor | null;

    version: number;

    migrate(session: DbSession, provider: string): Promise<void>;
}

class DbVersion1 implements DbVersion {
    public previousVersion: DbVersionConstructor | null = null;
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

// ================================================================================================================== //
//                                                   END MIGRATION                                                    //
// ================================================================================================================== //

const LATEST_VERSION: DbVersionConstructor = DbVersion1;