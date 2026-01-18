import {ReadableGlobalContext} from "vue-mvvm";

import {DbServiceBase, DbSession} from "@services/db.service";
import {EpisodeDbModel, EpisodeModel} from "@models/episode.model";
import {QueryResult} from "@tauri-apps/plugin-sql";

export class EpisodeService extends DbServiceBase {
    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);
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
}