import {QueryResult} from "@tauri-apps/plugin-sql";
import {ReadableGlobalContext} from "vue-mvvm";

import {DbServiceBase, DbSession} from "@services/db.service";
import {SeasonDbModel, SeasonModel} from "@models/season.model";

export class SeasonService extends DbServiceBase {

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);
    }

    public async requiresSync(seriesId: number): Promise<boolean> {
        const session: DbSession = await this.provider.getDatabase();

        const [{count}] = await session.query<[{
            count: number
        }]>("SELECT count(season_id) AS count FROM season WHERE series_id = ?;", seriesId);

        return count == 0;
    }

    public async getSeason(seasonId: number): Promise<SeasonModel | null> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: SeasonDbModel[] = await session.query<SeasonDbModel[]>("SELECT * FROM season WHERE season_id = ?;", seasonId);
        if (rows.length == 0) {
            return null;
        }
        
        return SeasonModel(rows[0].season_id, rows[0].series_id, rows[0].season_number);
    }

    public async getSeasons(seriesId: number): Promise<SeasonModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        const seasons: SeasonDbModel[] = await session.query<SeasonDbModel[]>("SELECT * FROM season WHERE series_id = ? ORDER BY season_number;", seriesId);

        return seasons.map(season => SeasonModel(season.season_id, season.series_id, season.season_number));
    }

    public async insertSeason(seriesId: number, seasonNumber: number): Promise<SeasonModel> {
        const session: DbSession = await this.provider.getDatabase();

        const result: QueryResult = await session.execute("INSERT INTO season (series_id, season_number) VALUES (?, ?);", seriesId, seasonNumber);

        return SeasonModel(result.lastInsertId!, seriesId, seasonNumber);
    }
}