import {ReadableGlobalContext} from "vue-mvvm";
import {QueryResult} from "@tauri-apps/plugin-sql";

import {DbServiceBase, DbSession} from "@services/db.service";
import {UserService} from "@services/user.service";

import {SeriesDbModel, SeriesModel} from "@models/series.model";
import {ProfileModel} from "@models/profile.model";

export class SeriesService extends DbServiceBase {
    private readonly userService: UserService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.userService = ctx.getService(UserService);
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

    public async getFilteredSeriesChunk(offset: number, limit: number, searchText: string, genresIds: number[]): Promise<SeriesModel[]> {
        const filters: string[] = [];
        const params: any[] = [];

        if (searchText.length > 0) {
            searchText = `%${searchText.replace(/([%\\])/g, '\\$1')}%`;
            filters.push("lower(s.title) LIKE ? ESCAPE '\\'");
            params.push(searchText);
        }

        if (genresIds.length > 0) {
            const genreFilter: string[] = [];

            for (const genre of genresIds) {
                genreFilter.push(`gs.genre_id = ?`);
                params.push(genre);
            }

            filters.push(`(${genreFilter.join(" OR ")})`);
        }

        const session: DbSession = await this.provider.getDatabase();

        const rows: SeriesDbModel[] = await session.query<SeriesDbModel[]>(`SELECT DISTINCT s.* FROM series AS s INNER JOIN genre_to_series AS gs ON s.series_id = gs.series_id WHERE true AND ${filters.join(" AND ")} ORDER BY s.title LIMIT ? OFFSET ?`, ...params, limit, offset);
        return rows.map(row => SeriesModel(row.series_id, row.guid, row.title, row.description, row.preview_image));
    }

    public async getSeries(seriesId: number): Promise<SeriesModel | null> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: SeriesDbModel[] = await session.query<SeriesDbModel[]>(`SELECT * FROM series WHERE series_id = ? LIMIT 1`, seriesId);

        if (rows.length === 0) {
            return null;
        }

        return SeriesModel(rows[0].series_id, rows[0].guid, rows[0].title, rows[0].description, rows[0].preview_image);
    }

    public async getStartedSeries(): Promise<SeriesModel[]> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const rows: SeriesDbModel[] = await session.query<SeriesDbModel[]>(`
            SELECT DISTINCT s.*
            FROM series AS s
                     LEFT JOIN season AS se ON se.series_id = s.series_id
                     LEFT JOIN episode AS e ON e.season_id = se.season_id
                     LEFT JOIN watchtime AS wt ON wt.episode_id = e.episode_id
            WHERE wt.tenant_id = ?
              AND se.season_number != 0
              AND wt.percentage_watched > 80
        `, profile.uuid);

        return rows.map(row => SeriesModel(row.series_id, row.guid, row.title, row.description, row.preview_image));
    }

    public async getSeriesByIds(seriesIds: number[]): Promise<SeriesModel[]> {
        if (seriesIds.length == 0) {
            return [];
        }

        const session: DbSession = await this.provider.getDatabase();

        const rows: SeriesDbModel[] = await session.query<SeriesDbModel[]>("SELECT * FROM series WHERE series_id = ?" + (" OR series_id = ?".repeat(seriesIds.length - 1)), ...seriesIds);
        return rows.map(row => SeriesModel(row.series_id, row.guid, row.title, row.description, row.preview_image));
    }
}