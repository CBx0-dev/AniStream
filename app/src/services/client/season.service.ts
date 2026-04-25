import {ReadableGlobalContext} from "vue-mvvm";

import {ApiServiceBase} from "@services/utils/api";
import {ServiceDeclaration} from "@services/declaration";

import {SeasonService} from "@contracts/season.contract";
import {ProviderService} from "@contracts/provider.contract";

import {SeasonDbModel, SeasonModel} from "@models/season.model";

import {DefaultProvider} from "@providers/default";

import {HTTPError} from "@utils/http";

class SeasonServiceImpl extends ApiServiceBase implements SeasonService {
    private readonly providerService: ProviderService;

    public constructor(ctx: ReadableGlobalContext) {
        super(ctx);

        this.providerService = ctx.getService(ProviderService);
    }

    public requiresSync(_seriesId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async getSeason(seasonId: number): Promise<SeasonModel | null> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        try {
            const season: SeasonDbModel = await this.get<SeasonDbModel>(["api", provider.uniqueKey, "seasons", seasonId]);

            return SeasonModel(
                season.season_id,
                season.series_id,
                season.season_number
            );
        } catch (e) {
            if (e instanceof HTTPError && e.status == 404) {
                return null;
            }

            throw e;
        }
    }

    public async getSeasons(seriesId: number): Promise<SeasonModel[]> {
        const provider: DefaultProvider = await this.providerService.getProvider();

        const seasons: SeasonDbModel[] = await this.get<SeasonDbModel[]>(["api", provider.uniqueKey, "seasons", "series", seriesId]);

        return seasons.map(season => SeasonModel(
            season.season_id,
            season.series_id,
            season.season_number
        ));
    }

    public insertSeason(_seriesId: number, _seasonNumber: number): Promise<SeasonModel> {
        throw new Error("Method not implemented.");
    }
}

export default {
    key: SeasonService,
    ctor: SeasonServiceImpl
} satisfies ServiceDeclaration<SeasonService>;