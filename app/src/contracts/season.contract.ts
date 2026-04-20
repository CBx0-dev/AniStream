import {ServiceKey} from "vue-mvvm";

import type {SeasonModel} from "@models/season.model";

export interface SeasonService {
    requiresSync(seriesId: number): Promise<boolean>;

    getSeason(seasonId: number): Promise<SeasonModel | null>;

    getSeasons(seriesId: number): Promise<SeasonModel[]>;

    insertSeason(seriesId: number, seasonNumber: number): Promise<SeasonModel>;
}

export const SeasonService: ServiceKey<SeasonService> = new ServiceKey<SeasonService>("season.service");