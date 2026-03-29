import Database, {QueryResult} from "@tauri-apps/plugin-sql";
import {ReadableGlobalContext} from "vue-mvvm";

import {ProviderService} from "@services/provider.service";

export class DbServiceBase {
    protected readonly provider: ProviderService;

    protected constructor(ctx: ReadableGlobalContext) {
        this.provider = ctx.getService(ProviderService);
    }
}

export class DbSession {
    private readonly handler: Database;
    private closed: boolean;

    public constructor(handler: Database) {
        this.handler = handler;
        this.closed = false;
    }


    public async query<T>(query: string, ...params: any[]): Promise<T> {
        if (this.closed) {
            throw "No DB Handler was initialized";
        }

        return await this.handler.select<T>(query, params);
    }

    public async execute(query: string, ...params: any[]): Promise<QueryResult> {
        if (this.closed) {
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
        this.closed = true;
        await this.handler.close();
    }
}

export type DbVersionConstructor<T extends any[]> = new () => DbVersion<T>;

export interface DbVersion<T extends any[]> {
    previousVersion: DbVersionConstructor<T> | null;

    version: number;

    migrate(session: DbSession, ...args: T): Promise<void>;
}
