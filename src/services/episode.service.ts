import {ReadableGlobalContext} from "vue-mvvm";

import {DbServiceBase, DbSession} from "@services/db.service";
import {EpisodeDbModel, EpisodeModel} from "@models/episode.model";
import {QueryResult} from "@tauri-apps/plugin-sql";

export class EpisodeService extends DbServiceBase {
    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);
    }

    public async getEpisode(episodeId: number): Promise<EpisodeModel | null> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: EpisodeDbModel[] = await session.query<EpisodeDbModel[]>("SELECT * FROM episode WHERE episode_id = ?;", episodeId);

        if (rows.length == 0) {
            return null;
        }

        return EpisodeModel(
            rows[0].episode_id,
            rows[0].season_id,
            rows[0].episode_number,
            rows[0].german_title,
            rows[0].english_title,
            rows[0].description,
            rows[0].percentage_watched,
            rows[0].stopped_time
        );
    }


    public async getEpisodes(seasonId: number): Promise<EpisodeModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: EpisodeDbModel[] = await session.query<EpisodeDbModel[]>("SELECT * FROM episode WHERE season_id = ?;", seasonId);

        return rows.map(rows => EpisodeModel(rows.episode_id,
            rows.season_id,
            rows.episode_number,
            rows.german_title,
            rows.english_title,
            rows.description,
            rows.percentage_watched,
            rows.stopped_time
        ));
    }

    public async insertEpisode(
        season_id: number,
        episode_number: number,
        german_title: string,
        english_title: string,
        description: string
    ): Promise<EpisodeModel> {
        const session: DbSession = await this.provider.getDatabase();

        const result: QueryResult = await session.execute(
            "INSERT INTO episode (season_id, episode_number, german_title, english_title, description, percentage_watched, stopped_time) VALUES (?, ?, ?, ?, ?, ?, ?);",
            season_id,
            episode_number,
            german_title,
            english_title,
            description,
            0,
            0
        );

        return EpisodeModel(result.lastInsertId!, season_id, episode_number, german_title, english_title, description, 0, 0);
    }

    public async updateEpisodeMetadata(
        episode_id: number,
        german_title: string,
        english_title: string,
        description: string
    ): Promise<void> {
        const session: DbSession = await this.provider.getDatabase();

        await session.execute(
            "UPDATE episode SET german_title = ?, english_title = ?, description = ? WHERE episode_id = ?;",
            german_title,
            english_title,
            description,
            episode_id
        );
    }

    public async updateEpisodeProgression(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const session: DbSession = await this.provider.getDatabase();

        await session.execute(
            "UPDATE episode SET percentage_watched = ?, stopped_time = ? WHERE episode_id = ?;",
            percentageWatched,
            stoppedTime,
            episodeId
        );
    }
}