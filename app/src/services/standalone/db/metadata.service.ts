import Database from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext} from "vue-mvvm";

import {MetadataDbService} from "@contracts/standalone/metadata.contract";

import {ServiceDeclaration} from "@services/declaration";
import {DbSession, DbVersion, DbVersionConstructor} from "@services/utils/db";

import {UserService} from "@contracts/user.contract";

import {ProfileModel} from "@models/profile.model";

import sql1 from "../../../../../migration/standalone/metadata/1.sql?raw";
import sql2 from "../../../../../migration/standalone/metadata/2.sql?raw";
import sql3 from "../../../../../migration/standalone/metadata/3.sql?raw";
import sql4 from "../../../../../migration/standalone/metadata/4.sql?raw";

class MetadataDbServiceImpl implements MetadataDbService {
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
        // language=SQLite
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
            // language=SQLite
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
        await session.execute(sql1);
    }
}

class DbVersion2 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = DbVersion1;

    public version: number = 2;

    public async migrate(session: DbSession, _userService: UserService, _provider: string): Promise<void> {
        await session.execute(sql2);
    }
}

class DbVersion3 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = DbVersion2;

    public version: number = 3;

    public async migrate(session: DbSession, userService: UserService, _provider: string): Promise<void> {
        const profile: ProfileModel = await userService.getMigrationProfile();

        await session.execute(sql3, profile.uuid, profile.uuid);
    }
}

class DbVersion4 implements MetadataDbVersion {
    public previousVersion: MetadataDbVersionConstructor = DbVersion3;
    public version: number = 4;

    public async migrate(session: DbSession, _userService: UserService, _provider: string): Promise<void> {
        await session.execute(sql4);
    }
}

// ================================================================================================================== //
//                                                   END MIGRATION                                                    //
// ================================================================================================================== //

const LATEST_VERSION: Exclude<MetadataDbVersionConstructor, null> = DbVersion4;

export default {
    key: MetadataDbService,
    ctor: MetadataDbServiceImpl
} satisfies ServiceDeclaration<MetadataDbServiceImpl>;