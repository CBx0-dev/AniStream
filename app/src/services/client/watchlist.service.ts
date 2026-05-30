import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";
import {ApiServiceBase} from "@services/utils/api";

import {WatchlistService} from "@contracts/watchlist.contract";
import {ProviderService} from "@contracts/provider.contract";

import {DefaultProvider} from "@providers/default";

import * as http from "@utils/http";

class WatchlistServiceImpl extends ApiServiceBase implements WatchlistService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public async getSeriesIds(): Promise<number[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        return this.get(["api", provider.uniqueKey, "watchlist", "series"]);
    }

    public async isSeriesOnWatchlist(seriesIds: number): Promise<boolean> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            await this.get(["api", provider.uniqueKey, "watchlist", "series", seriesIds]);
            return true;
        } catch (e) {
            if (e instanceof http.HTTPError && e.status == 404) {
                return false;
            }

            throw e;
        }
    }

    public async addToWatchlist(seriesId: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.post(["api", provider.uniqueKey, "watchlist", "series", seriesId], null);
    }

    public async removeFromWatchlist(seriesId: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.delete(["api", provider.uniqueKey, "watchlist", "series", seriesId]);
    }
}

export default {
    key: WatchlistService,
    ctor: WatchlistServiceImpl
} satisfies ServiceDeclaration<WatchlistService>;