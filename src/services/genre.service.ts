import {ReadableGlobalContext} from "vue-mvvm";
import {GenreDbModel, GenreModel} from "@models/genre.model";
import {DbServiceBase, DbSession} from "@services/db.service";
import {SeriesModel} from "@models/series.model";
import {QueryResult} from "@tauri-apps/plugin-sql";


export class GenreService extends DbServiceBase {
    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);
    }

    public async getGenreByKey(key: string): Promise<GenreModel | null> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: GenreDbModel[] = await session.query<GenreDbModel[]>("SELECT * FROM genre WHERE key = ? LIMIT 1;", key);
        if (rows.length == 0) {
            return null;
        }

        return GenreModel(rows[0].genre_id, rows[0].key);
    }

    public async insertGenre(key: string): Promise<GenreModel> {
        const session: DbSession = await this.provider.getDatabase();

        const result: QueryResult = await session.execute("INSERT INTO genre (key) VALUES (?)", key);

        return GenreModel(result.lastInsertId!, key);
    }

    public async insertGenreToSeries(genre: GenreModel, series: SeriesModel, main_genre: boolean): Promise<void> {
        if (genre.genre_id == 0) {
            throw "Genre is not tracked, you have to insert it first";
        }

        if (series.series_id == 0) {
            throw "Genre is not tracked, you have to insert it first";
        }

        const session: DbSession = await this.provider.getDatabase();

        await session.execute("INSERT INTO genre_to_series (genre_id, series_id, main_genre) VALUES (?, ?, ?)", genre.genre_id, series.series_id, main_genre);
    }

    public async getGenres(): Promise<GenreModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: GenreDbModel[] = await session.query<GenreDbModel[]>("SELECT * FROM genre ORDER BY key");
        return rows.map(row => GenreModel(row.genre_id, row.key));
    }

    public async getMainGenreOfSeries(seriesId: number): Promise<GenreModel | null> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: GenreDbModel[] = await session.query<GenreDbModel[]>("SELECT g.* FROM genre_to_series AS gs LEFT JOIN genre AS g ON gs.genre_id = g.genre_id WHERE gs.series_id = ? AND gs.main_genre = 'true' LIMIT 1;", seriesId);
        if (rows.length == 0) {
            return null;
        }

        return GenreModel(rows[0].genre_id, rows[0].key);
    }

    public async getNonMainGenresOfSeries(seriesId: number): Promise<GenreModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        const rows: GenreDbModel[] = await session.query<GenreDbModel[]>("SELECT g.* FROM genre_to_series AS gs LEFT JOIN genre AS g ON gs.genre_id = g.genre_id WHERE gs.series_id = ? AND gs.main_genre = 'false';", seriesId);
        return rows.map(row => GenreModel(row.genre_id, row.key));
    }
}