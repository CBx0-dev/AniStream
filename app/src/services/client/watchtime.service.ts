import {ReadableGlobalContext} from "vue-mvvm";

import {ServiceDeclaration} from "@services/declaration";
import {ApiServiceBase} from "@services/utils/api";

import {WatchtimeService} from "@contracts/watchtime.contract";
import {ProviderService} from "@contracts/provider.contract";

import {
    TotalProgressionModel,
    WatchtimeCreateModel,
    WatchtimeDbModel,
    WatchtimeModel,
    WatchtimeUpdateModel
} from "@models/watchtime.model";

import {DefaultProvider} from "@providers/default";

import * as http from "@utils/http";

class WatchtimeServiceImpl extends ApiServiceBase implements WatchtimeService {
    private readonly providerService: ProviderService

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public async getWatchtimeOfEpisode(episodeId: number): Promise<WatchtimeModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            const watchtime: WatchtimeDbModel = await this.get<WatchtimeDbModel>(["api", provider.uniqueKey, "watchtime", episodeId, "episode"])

            return WatchtimeModel(
                watchtime.watchtime_id,
                watchtime.episode_id,
                watchtime.percentage_watched,
                watchtime.stopped_time,
                watchtime.tenant_id
            );
        } catch (e) {
            if (e instanceof http.HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async getWatchtimesOfSeries(seriesId: number): Promise<WatchtimeModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const watchTimes: WatchtimeDbModel[] = await this.get<WatchtimeDbModel[]>(["api", provider.uniqueKey, "watchtime", seriesId, "series"]);

        return watchTimes.map(watchtime => WatchtimeModel(
            watchtime.watchtime_id,
            watchtime.episode_id,
            watchtime.percentage_watched,
            watchtime.stopped_time,
            watchtime.tenant_id
        ));
    }

    public async getTotalWatchProgression(seriesId: number): Promise<number> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const total: TotalProgressionModel = await this.get<TotalProgressionModel>(["api", provider.uniqueKey, "watchtime", seriesId, "total"]);

        return total.total_progression;
    }

    public async createWatchtimeOfEpisode(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<WatchtimeModel> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const watchtime: WatchtimeDbModel = await this.post<WatchtimeDbModel, WatchtimeCreateModel>(["api", provider.uniqueKey, "watchtime"], {
            episode_id: episodeId,
            percentage_watched: percentageWatched,
            stopped_time: stoppedTime
        });

        return WatchtimeModel(
            watchtime.watchtime_id,
            watchtime.episode_id,
            watchtime.percentage_watched,
            watchtime.stopped_time,
            watchtime.tenant_id
        )
    }

    public async updateWatchtime(watchtimeId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.put<object, WatchtimeUpdateModel>(["api", provider.uniqueKey, "watchtime", watchtimeId], {
            percentage_watched: percentageWatched,
            stopped_time: stoppedTime
        });
    }

    public async updateWatchtimeWithEpisode(episodeId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.put<object, WatchtimeUpdateModel>(["api", provider.uniqueKey, "watchtime", episodeId, "episode"], {
            percentage_watched: percentageWatched,
            stopped_time: stoppedTime
        });
    }

    public async updateWatchtimesOfSeason(seasonId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.put<object, WatchtimeUpdateModel>(["api", provider.uniqueKey, "watchtime", seasonId, "season"], {
            percentage_watched: percentageWatched,
            stopped_time: stoppedTime
        });
    }

    public async updateWatchtimesOfSeries(seriesId: number, percentageWatched: number, stoppedTime: number): Promise<void> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        await this.put<object, WatchtimeUpdateModel>(["api", provider.uniqueKey, "watchtime", seriesId, "series"], {
            percentage_watched: percentageWatched,
            stopped_time: stoppedTime
        });
    }
}

export default {
    key: WatchtimeService,
    ctor: WatchtimeServiceImpl
} satisfies ServiceDeclaration<WatchtimeService>;