import {ReadableGlobalContext} from "vue-mvvm";

import {DbServiceBase, DbSession} from "@services/db.service";

export class WatchlistService extends DbServiceBase {
    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);
    }

    public async getSeriesIds(): Promise<number[]> {
        let session: DbSession = await this.provider.getDatabase();

        const rows: Array<{series_id: number}> = await session.query<Array<{series_id: number}>>("SELECT series_id FROM watchlist");

        return rows.map(row => row.series_id);
    }

    public async isSeriesOnWatchlist(seriesId: number): Promise<boolean> {
        let session: DbSession = await this.provider.getDatabase();

        const rows: unknown[] = await session.query<unknown[]>("SELECT series_id FROM watchlist WHERE series_id = ? LIMIT 1", seriesId);

        return rows.length == 1;
    }

    public async addToWatchlist(seriesId: number): Promise<void> {
        let session: DbSession = await this.provider.getDatabase();

        await session.execute("INSERT INTO watchlist (series_id) VALUES (?)", seriesId);
    }

    public async removeFromWatchlist(seriesId: number): Promise<void> {
        let session: DbSession = await this.provider.getDatabase();

        await session.execute("DELETE FROM watchlist WHERE series_id = ?", seriesId);
    }
}