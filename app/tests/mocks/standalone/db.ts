import NodeDatabase from "better-sqlite3";

import Database, {QueryResult} from "@tauri-apps/plugin-sql";

type TauriDatabase = Database;

export class DatabaseWrapper implements TauriDatabase {
    private _handler: NodeDatabase.Database;
    private _closed: boolean;

    public readonly path: string;

    public get closed(): boolean {
        return this._closed;
    }

    public constructor(path: string = ":memory:") {
        this.path = path;

        this._handler = new NodeDatabase(this.path);
        this._closed = false;
    }

    async execute(query: string, bindValues: unknown[] = []): Promise<QueryResult> {
        let startArgs: number = 0;

        let rowsAffected: number = 0;
        let lastInsertRowId: number | undefined = undefined;

        for (let sql of query.split(";")) {
            sql = sql.trim();
            if (!sql) {
                continue;
            }

            let argsAmount: number = (sql.match(/\?/g) || []).length;

            let args: unknown[];
            if (argsAmount > 0) {
                args = bindValues.slice(startArgs, startArgs + argsAmount).map(x => typeof x == "boolean"
                    ? x
                        ? "true"
                        : "false"
                    : x
                );
                startArgs += argsAmount;
            } else {
                args = [];
            }

            const stmt: NodeDatabase.Statement = this._handler.prepare(sql);
            const result: NodeDatabase.RunResult = stmt.run(...args);

            if (result.lastInsertRowid && typeof result.lastInsertRowid != "bigint") {
                lastInsertRowId = result.lastInsertRowid;
            }
            rowsAffected += result.changes;
        }

        return {
            rowsAffected: rowsAffected,
            lastInsertId: lastInsertRowId,
        }
    }

    async select<T>(query: string, bindValues: unknown[] = []): Promise<T> {
        const stmt: NodeDatabase.Statement = this._handler.prepare(query);
        const rows: unknown[] = stmt.all(...bindValues);

        return rows as T;
    }

    async close(): Promise<boolean> {
        try {
            this._handler.close();
            this._closed = true;
            return true;
        } catch (e) {
            return false;
        }
    }
}