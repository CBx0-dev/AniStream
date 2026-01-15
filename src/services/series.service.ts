import {ReadableGlobalContext} from "vue-mvvm";
import {DbServiceBase, DbSession} from "@services/db.service";
import {SeriesDbModel, SeriesModel} from "@models/series.model";
import {QueryResult} from "@tauri-apps/plugin-sql";

export class SeriesService extends DbServiceBase {
    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);
    }

    public async requiresSync(): Promise<boolean> {
        const session: DbSession = await this.provider.getDatabase();

        const [{count}] = await session.query<[{
            count: number
        }]>("SELECT COUNT(series_id) AS count FROM series LIMIT 1;");
        return count == 0;
    }

    public async getStreams(): Promise<SeriesModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        return session.query<SeriesModel[]>("");
    }

    public async existByGUID(guid: string): Promise<boolean> {
        const session: DbSession = await this.provider.getDatabase();

        const [{count}] = await session.query<[{
            count: number
        }]>("SELECT COUNT(series_id) AS count FROM series WHERE guid = ?;", guid);

        return count == 1;
    }

    public async insertSeries(guid: string, title: string, description: string, preview_image: string | null): Promise<SeriesModel> {
        const session: DbSession = await this.provider.getDatabase();

        let result: QueryResult = await session.execute("INSERT INTO series (guid, title, description, preview_image) VALUES (?, ?, ?, ?)", guid, title, description, preview_image);

        return SeriesModel(result.lastInsertId!, guid, title, description, preview_image);
    }

    public async getSeriesChunk(offset: number, limit: number): Promise<SeriesModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        let rows: SeriesDbModel[] = await session.query<SeriesDbModel[]>("SELECT * FROM series ORDER BY title LIMIT ? OFFSET ? ;", limit, offset);

        return rows.map(row => SeriesModel(row.series_id, row.guid, row.title, row.description, row.preview_image));
    }

    public async getTotalWatchProgression(seriesId: number): Promise<number> {
        const session: DbSession = await this.provider.getDatabase();

        const [{total_episodes, finished_episodes}] = await session.query<[{
            total_episodes: number,
            finished_episodes: number
        }]>(`
SELECT COUNT(e.episode_id) AS total_episodes,
       COALESCE(
               SUM(CASE WHEN e.percentage_watched > 80 THEN 1 ELSE 0 END),
               0
       )                   AS finished_episodes
FROM series AS s
         LEFT JOIN season AS se ON s.series_id = se.series_id
         LEFT JOIN episode AS e ON se.season_id = e.season_id
WHERE s.series_id = ?
  AND se.season_number > 0;
        `, seriesId);

        // Not synced
        if (total_episodes == 0) {
            return 0;
        }

        return finished_episodes / total_episodes;
    }
}