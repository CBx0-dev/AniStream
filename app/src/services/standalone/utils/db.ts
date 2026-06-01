import Database, {QueryResult} from "@tauri-apps/plugin-sql";

import {ReadableGlobalContext} from "vue-mvvm";

import {DbService} from "@contracts/standalone/db.contract";
import {ProviderService} from "@contracts/provider.contract";

import {DefaultProvider} from "@providers/default";

export class DbServiceBase {
    private readonly dbService: DbService;
    private readonly providerService: ProviderService;

    protected constructor(ctx: ReadableGlobalContext) {
        this.dbService = ctx.getService(DbService);
        this.providerService = ctx.getService(ProviderService);
    }

    protected async getDatabase(): Promise<DbSession> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        return await this.dbService.getDatabase(provider);
    }
}

export class DbSession {
    private readonly handler: Database;
    private _closed: boolean;

    public get closed(): boolean {
        return this._closed;
    }

    public constructor(handler: Database) {
        this.handler = handler;
        this._closed = false;
    }


    public async query<T>(query: string, ...params: any[]): Promise<T> {
        if (this._closed) {
            throw "No DB Handler was initialized";
        }

        return await this.handler.select<T>(query, params);
    }

    public async execute(query: string, ...params: any[]): Promise<QueryResult> {
        if (this._closed) {
            throw "No DB Handler was initialized";
        }

        return await this.handler.execute(query, params);
    }

    public async transaction<T>(cb: (this: DbSession) => Promise<T>): Promise<T> {
        await this.execute("BEGIN TRANSACTION");
        try {
            const result: T = await cb.call(this);
            await this.execute("COMMIT");
            return result;
        } catch (e) {
            await this.execute("ROLLBACK");
            throw e;
        }
    }

    public async close(): Promise<void> {
        this._closed = true;
        await this.handler.close(this.handler.path);
    }
}

export type DbVersionConstructor<T extends any[]> = new () => DbVersion<T>;

export interface DbVersion<T extends any[]> {
    previousVersion: DbVersionConstructor<T> | null;

    version: number;

    migrate(session: DbSession, ...args: T): Promise<void>;
}
