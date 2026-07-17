import {ServiceKey} from "vue-mvvm";

export interface WatchlistService {
    getSeriesIds(): Promise<number[]>;

    isSeriesOnWatchlist(seriesIds: number): Promise<boolean>;

    addToWatchlist(seriesId: number): Promise<void>;

    removeFromWatchlist(seriesId: number): Promise<void>;
}

export const WatchlistService: ServiceKey<WatchlistService> = new ServiceKey<WatchlistService>("watchlist.service");