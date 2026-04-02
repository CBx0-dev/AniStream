import {ReadableGlobalContext} from "vue-mvvm";

import {DbServiceBase, DbSession} from "@services/db.service";
import {UserService} from "@services/user.service";

import {ProfileModel} from "@models/profile.model";

export class WatchlistService extends DbServiceBase {
    private readonly userService: UserService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.userService = ctx.getService(UserService);
    }

    public async getSeriesIds(): Promise<number[]> {
        let profile: ProfileModel = await this.userService.getActiveProfile();
        let session: DbSession = await this.provider.getDatabase();

        const rows: Array<{series_id: number}> = await session.query<Array<{series_id: number}>>("SELECT series_id FROM watchlist WHERE tenant_id = ?", profile.uuid);

        return rows.map(row => row.series_id);
    }

    public async isSeriesOnWatchlist(seriesId: number): Promise<boolean> {
        let profile: ProfileModel = await this.userService.getActiveProfile();
        let session: DbSession = await this.provider.getDatabase();

        const rows: unknown[] = await session.query<unknown[]>("SELECT series_id FROM watchlist WHERE tenant_id = ? AND series_id = ? LIMIT 1", profile.uuid, seriesId);

        return rows.length == 1;
    }

    public async addToWatchlist(seriesId: number): Promise<void> {
        let profile: ProfileModel = await this.userService.getActiveProfile();
        let session: DbSession = await this.provider.getDatabase();

        await session.execute("INSERT INTO watchlist (series_id, tenant_id) VALUES (?, ?)", seriesId, profile.uuid);
    }

    public async removeFromWatchlist(seriesId: number): Promise<void> {
        let session: DbSession = await this.provider.getDatabase();

        await session.execute("DELETE FROM watchlist WHERE series_id = ?", seriesId);
    }
}