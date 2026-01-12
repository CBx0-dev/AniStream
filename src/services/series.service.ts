import { ReadableGlobalContext } from "vue-mvvm";
import { ProviderService } from "./provider.service";
import {DbSession} from "@services/db.service";
import {StreamModel} from "@models/stream.model";

export class SeriesService {
    private provider: ProviderService;
    
    public constructor(ctx: ReadableGlobalContext) {
        this.provider = ctx.getService(ProviderService);
    }

    public async requiresSync(): Promise<boolean> {
        const session: DbSession = await this.provider.getDatabase();

        const [{count}] = await session.query<[{count: number}]>("SELECT COUNT(series_id) AS count FROM series LIMIT 1;");
        return count == 0;
    }

    public async getStreams(): Promise<StreamModel[]> {
        const session: DbSession = await this.provider.getDatabase();

        return session.query<StreamModel[]>("");
    }
}