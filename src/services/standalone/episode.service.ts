import {QueryResult} from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext} from "vue-mvvm";

import {EpisodeService} from "@contracts/episode.contract";

import {ServiceDeclaration} from "@services/declaration";
import {DbServiceBase, DbSession} from "@services/utils/db";

import {EpisodeDbModel, EpisodeModel} from "@models/episode.model";

class EpisodeServiceImpl extends DbServiceBase implements EpisodeService {
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
            rows[0].description
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
            rows.description
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
            "INSERT INTO episode (season_id, episode_number, german_title, english_title, description) VALUES (?, ?, ?, ?, ?);",
            season_id,
            episode_number,
            german_title,
            english_title,
            description
        );

        return EpisodeModel(result.lastInsertId!, season_id, episode_number, german_title, english_title, description);
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

export default {
    key: EpisodeService,
    ctor: EpisodeServiceImpl
} satisfies ServiceDeclaration<EpisodeService>;
