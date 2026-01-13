import {ReadableGlobalContext} from "vue-mvvm";
import {DbServiceBase, DbSession} from "@services/db.service";
import {SeriesModel} from "@models/series.model";
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
}