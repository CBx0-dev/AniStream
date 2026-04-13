import {QueryResult} from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext} from "vue-mvvm";

import {ListService} from "@contracts/list.contract";
import {UserService} from "@contracts/user.contract";

import {ServiceDeclaration} from "@services/declaration";
import {DbServiceBase, DbSession} from "@services/utils/db";

import {ListDbModel, ListModel} from "@models/list.model";
import {SeriesDbModel, SeriesModel} from "@models/series.model";
import {ProfileModel} from "@models/profile.model";

class ListServiceImpl extends DbServiceBase implements ListService {
    private readonly userService: UserService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.userService = ctx.getService(UserService);
    }

    public async getLists(): Promise<ListModel[]> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const rows: ListDbModel[] = await session.query(
            "SELECT * FROM list WHERE tenant_id = ?",
            profile.uuid
        );

        return rows.map(row => ListModel(
            row.list_id,
            row.name,
            row.tenant_id
        ));
    }

    public async createList(name: string): Promise<ListModel> {
        const profile: ProfileModel = await this.userService.getActiveProfile();
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const result: QueryResult = await session.execute(
            "INSERT INTO list (name, tenant_id) VALUES (?, ?)",
            name,
            profile.uuid
        );

        return ListModel(
            result.lastInsertId!,
            name,
            profile.uuid
        );
    }

    public async deleteList(listId: number): Promise<void> {
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        await session.execute(
            "DELETE FROM list WHERE list_id = ?",
            listId
        );
    }

    public async getSeries(listId: number): Promise<SeriesModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const rows: SeriesDbModel[] = await session.query(`
            SELECT s.*
            FROM list_to_series AS ls
                     LEFT JOIN series AS s ON ls.series_id = s.series_id
            WHERE ls.list_id = ?
        `, listId);

        return rows.map(row => SeriesModel(
            row.series_id,
            row.guid,
            row.title,
            row.description,
            row.preview_image
        ));
    }

    public async getPreviewHashes(listId: number): Promise<string[]> {
        const session: DbSession = await this.provider.getDatabase();

        // language=SQLite
        const rows: Array<{ preview_image: string }> = await session.query(`
            SELECT s.preview_image
            FROM list_to_series AS ls
                     LEFT JOIN series AS s ON ls.series_id = s.series_id AND s.preview_image IS NOT NULL
            WHERE ls.list_id = ?
            LIMIT 4
        `, listId);

        return rows.map(row => row.preview_image);
    }
}

export default {
    key: ListService,
    ctor: ListServiceImpl
} satisfies ServiceDeclaration<ListService>;