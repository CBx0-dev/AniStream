import {QueryResult} from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext} from "vue-mvvm";

import {WatchtimeService} from "@contracts/watchtime.contract";
import {UserService} from "@contracts/user.contract";

import {ServiceDeclaration} from "@services/declaration";
import {DbServiceBase, DbSession} from "@services/utils/db";

import {WatchtimeDbModel, WatchtimeModel} from "@models/watchtime.model";
import {ProfileModel} from "@models/profile.model";

class WatchtimeServiceImpl extends DbServiceBase implements WatchtimeService {
    private readonly userService: UserService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.userService = ctx.getService(UserService);
    }

    public async getWatchtimeOfEpisode(episodeId: number): Promise<WatchtimeModel | null> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const rows: WatchtimeDbModel[] = await session.query<WatchtimeDbModel[]>("SELECT * FROM watchtime WHERE episode_id = ? AND tenant_id = ?", episodeId, profile.uuid);
        if (rows.length == 0) {
            return null;
        }

        return WatchtimeModel(
            rows[0].watchtime_id,
            rows[0].episode_id,
            rows[0].percentage_watched,
            rows[0].stopped_time,
            rows[0].tenant_id
        );
    }

    public async getWatchtimesOfSeries(seriesId: number): Promise<WatchtimeModel[]> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const rows: WatchtimeDbModel[] = await session.query<WatchtimeDbModel[]>(
            "SELECT watchtime.* FROM watchtime LEFT JOIN episode ON episode.episode_id = watchtime.episode_id LEFT JOIN season ON season.season_id = episode.season_id WHERE season.series_id = ? AND watchtime.tenant_id = ?",
            seriesId,
            profile.uuid
        );

        return rows.map(row => WatchtimeModel(
            row.watchtime_id,
            row.episode_id,
            row.percentage_watched,
            row.stopped_time,
            row.tenant_id
        ));
    }

    public async getTotalWatchProgression(seriesId: number): Promise<number> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const [{total_episodes, finished_episodes}] = await session.query<[{
            total_episodes: number,
            finished_episodes: number
        }]>(`
            SELECT COUNT(e.episode_id)              AS total_episodes,
                   COALESCE(SUM(CASE
                                    WHEN wt.tenant_id = ? AND
                                         wt.percentage_watched > 80 THEN 1
                                    ELSE 0 END), 0) AS finished_episodes
            FROM episode AS e
                     LEFT JOIN watchtime AS wt ON wt.episode_id = e.episode_id
                     LEFT JOIN season AS se ON se.season_id = e.season_id
            WHERE se.series_id = ?
              AND se.season_number > 0
        `, profile.uuid, seriesId);

        if (total_episodes == 0) {
            return 0;
        }

        return finished_episodes / total_episodes;
    }

    public async createWatchtimeOfEpisode(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<WatchtimeModel> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const result: QueryResult = await session.execute(
            "INSERT INTO watchtime (episode_id, percentage_watched, stopped_time, tenant_id) VALUES (?, ?, ?, ?)",
            episodeId,
            percentageWatched,
            stoppedTime,
            profile.uuid
        );

        return WatchtimeModel(
            result.lastInsertId!,
            episodeId,
            percentageWatched,
            stoppedTime,
            profile.uuid
        );
    }

    public async updateWatchtime(watchtimeId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        await session.execute(
            "UPDATE watchtime SET percentage_watched = ?, stopped_time = ? WHERE watchtime_id = ?",
            percentageWatched,
            stoppedTime,
            watchtimeId
        );
    }

    public async updateWatchtimeWithEpisode(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        await session.execute(
            "UPDATE watchtime SET percentage_watched = ?, stopped_time = ? WHERE episode_id = ? AND tenant_id = ?",
            percentageWatched,
            stoppedTime,
            episodeId,
            profile.uuid
        );
    }

    public async updateWatchtimesOfSeason(seasonId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        await session.execute(`
            UPDATE watchtime
            SET percentage_watched = ?,
                stopped_time       = ?
            WHERE tenant_id = ?
              AND episode_id IN (SELECT episode_id FROM episode WHERE episode.season_id = ?)
        `, percentageWatched, stoppedTime, profile.uuid, seasonId);
    }

    public async updateWatchtimesOfSeries(seriesId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        await session.execute(`
            UPDATE watchtime
            SET percentage_watched = ?,
                stopped_time       = ?
            WHERE tenant_id = ?
              AND episode_id IN (SELECT episode_id
                                 FROM episode
                                          LEFT JOIN season ON episode.season_id = season.season_id
                                 WHERE season.series_id = ?)
        `, percentageWatched, stoppedTime, profile.uuid, seriesId);
    }
}

export default {
    key: WatchtimeService,
    ctor: WatchtimeServiceImpl
} satisfies ServiceDeclaration<WatchtimeService>;