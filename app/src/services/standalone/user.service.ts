import {QueryResult} from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext} from "vue-mvvm";

import * as dicebear from "@dicebear/core";
import {botttsNeutral} from "@dicebear/collection";

import {UserService} from "@contracts/user.contract";
import {SettingsService} from "@contracts/settings.contract";
import {UserDbService} from "@contracts/standalone/user.contract";

import {ServiceDeclaration} from "@services/declaration";
import {DbSession} from "@services/utils/db";

import * as path from "@utils/path";

import * as AppEnv from "@AppEnv";

import {ProfileDbModel, ProfileEye, ProfileModel, ProfileMouth} from "@models/profile.model";

class UserServiceImpl implements UserService {
    private static readonly SESSION_KEY: string = "active-profile";

    private readonly ctx: ReadableGlobalContext;

    private activeProfile: ProfileModel | null = null;

    private _session: DbSession | null;
    private readonly dbService: UserDbService;

    public constructor(ctx: ReadableGlobalContext) {
        this.ctx = ctx;

        this._session = null;
        this.dbService = ctx.getService(UserDbService);
    }

    public async getActiveProfile(): Promise<ProfileModel> {
        const profile: ProfileModel | null = await this.getActiveProfileOrDefault();
        if (profile) {
            return profile;
        }

        throw "No active profile set and no profile wa registered in the cache";
    }

    public async setActiveProfile(profile: ProfileModel): Promise<void> {
        this.activeProfile = profile;
        sessionStorage.setItem(UserServiceImpl.SESSION_KEY, profile.uuid);

        // Lazy load to prevent circular dependency
        const settingsService: SettingsService = this.ctx.getService(SettingsService);
        await settingsService.loadProfileSettings();
    }

    public async getActiveProfileOrDefault(): Promise<ProfileModel | null> {
        if (this.activeProfile) {
            return this.activeProfile;
        }

        if (await this.loadCache()) {
            return this.activeProfile!;
        }

        return null;
    }

    public async getMigrationProfile(): Promise<ProfileModel> {
        const session: DbSession = await this.getDatabase();

        // language=SQLite
        const rows: ProfileDbModel[] = await session.query<ProfileDbModel[]>("SELECT * FROM profile ORDER BY profile_id ASC LIMIT 1");
        if (rows.length == 0) {
            throw "Could not find migration profile";
        }

        return ProfileModel(
            rows[0].profile_id,
            rows[0].uuid,
            rows[0].name,
            rows[0].background_color,
            rows[0].eye,
            rows[0].mouth,
            rows[0].theme,
            rows[0].lang,
            rows[0].tos_accepted,
            rows[0].sync_catalog
        );
    }

    public async getProfiles(): Promise<ProfileModel[]> {
        const session: DbSession = await this.getDatabase();

        const rows: ProfileDbModel[] = await session.query<ProfileDbModel[]>("SELECT * FROM profile");
        return rows.map(row => ProfileModel(
            row.profile_id,
            row.uuid,
            row.name,
            row.background_color,
            row.eye,
            row.mouth,
            row.theme,
            row.lang,
            row.tos_accepted,
            row.sync_catalog
        ));
    }

    public async getProfileByUUID(uuid: string): Promise<ProfileModel | null> {
        const session: DbSession = await this.getDatabase();

        // language=SQLite
        const rows: ProfileDbModel[] = await session.query<ProfileDbModel[]>("SELECT * FROM profile WHERE uuid = ? LIMIT 1", uuid);
        if (rows.length == 0) {
            return null;
        }

        return ProfileModel(
            rows[0].profile_id,
            rows[0].uuid,
            rows[0].name,
            rows[0].background_color,
            rows[0].eye,
            rows[0].mouth,
            rows[0].theme,
            rows[0].lang,
            rows[0].tos_accepted,
            rows[0].sync_catalog
        );
    }

    public async requiresProfileSetup(): Promise<boolean> {
        const session: DbSession = await this.getDatabase();

        const [{count}] = await session.query<[{
            count: number
        }]>("SELECT count(profile_id) AS count FROM profile");

        return count == 0;
    }

    public async createProfile(name: string, backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth, theme: string, local: string): Promise<ProfileModel> {
        const session: DbSession = await this.getDatabase();
        const uuid: string = crypto.randomUUID();

        // language=SQLite
        const result: QueryResult = await session.execute(
            "INSERT INTO profile (uuid, name, background_color, eye, mouth, theme, lang, tos_accepted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            uuid,
            name,
            backgroundColor,
            eye,
            mouth,
            theme,
            local,
            "false",
            "false"
        );

        return ProfileModel(
            result.lastInsertId!,
            uuid,
            name,
            backgroundColor,
            eye,
            mouth,
            "aniworld-light",
            "en",
            "false",
            "false"
        );
    }

    public async updateProfile(profileId: number, name: string, backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth, theme: string, local: string, tosAccepted: boolean, syncCatalog: boolean): Promise<void> {
        const session: DbSession = await this.getDatabase();

        // language=SQLite
        await session.execute(
            "UPDATE profile SET name = ?, background_color = ?, eye = ?, mouth = ?, theme = ?, lang = ?, tos_accepted = ?, sync_catalog = ? WHERE profile_id = ?",
            name,
            backgroundColor,
            eye,
            mouth,
            theme,
            local,
            tosAccepted ? "true" : "false",
            syncCatalog ? "true" : "false",
            profileId
        );
    }

    public getAvatarSvg(backgroundColor: string, eye: ProfileEye, mouth: ProfileMouth): string {
        const result: dicebear.Result = dicebear.createAvatar(botttsNeutral, {
            backgroundColor: [backgroundColor],
            eyes: [eye],
            mouth: [mouth]
        });

        return result.toDataUri()
    }

    public async deleteProfile(profile: ProfileModel): Promise<void> {
        const session: DbSession = await this.getDatabase();

        // language=SQLite
        await session.execute(
            "DELETE FROM profile WHERE uuid = ?",
            profile.uuid
        );
    }

    public getAvatarSvgOfProfile(profile: ProfileModel): string {
        return this.getAvatarSvg(profile.background_color, profile.eye, profile.mouth);
    }

    private async loadCache(): Promise<boolean> {
        let value: string | null = sessionStorage.getItem(UserServiceImpl.SESSION_KEY);
        if (!value) {
            return false;
        }

        this.activeProfile = await this.getProfileByUUID(value);
        if (this.activeProfile) {
            // Lazy load to prevent circular dependency
            const settingsService: SettingsService = this.ctx.getService(SettingsService);
            await settingsService.loadProfileSettings();

            return true;
        }

        return false;
    }

    private async getDatabase(): Promise<DbSession> {
        if (this._session) {
            return this._session;
        }

        const appDir: string = await path.appDataDir();
        const dbFile: string = path.join(appDir, "profiles.db");
        this._session = await this.dbService.openDB(dbFile);

        return this._session!;
    }
}

export default {
    key: UserService,
    ctor: UserServiceImpl
} satisfies ServiceDeclaration<UserService>;