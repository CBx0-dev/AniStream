export interface WatchtimeDbModel {
    watchtime_id: number;
    episode_id: number;
    percentage_watched: number;
    stopped_time: number;
    tenant_id: string;
}

export interface WatchtimeModel extends WatchtimeDbModel {
    clone(): WatchtimeModel;
}


/**
 * Used for API only
 */
export interface TotalProgressionModel {
    total_progression: number;
}

/**
 * Used for API only
 */
export interface WatchtimeCreateModel {
    episode_id: number;
    percentage_watched: number;
    stopped_time: number;
}

/**
 * Used for API only
 */
export interface WatchtimeUpdateModel {
    percentage_watched: number | null;
    stopped_time: number | null;
}

export function WatchtimeModel(episode_id: number, percentage_watched: number, stopped_time: number, tenant_id: string): WatchtimeModel;
export function WatchtimeModel(watchtime_id: number, episode_id: number, percentage_watched: number, stopped_time: number, tenant_id: string): WatchtimeModel;

export function WatchtimeModel(...args: unknown[]): WatchtimeModel {
    if (args.length == 4) {
        args.unshift(0);
    }

    return _WatchtimeModel(...args as [number, number, number, number, string]);
}

function _WatchtimeModel(watchtime_id: number, episode_id: number, percentage_watched: number, stopped_time: number, tenant_id: string): WatchtimeModel {
    const obj: WatchtimeModel = {
        watchtime_id: watchtime_id,
        episode_id: episode_id,
        percentage_watched: percentage_watched,
        stopped_time: stopped_time,
        tenant_id: tenant_id,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: WatchtimeModel): WatchtimeModel {
    const obj: WatchtimeModel = {
        watchtime_id: this.watchtime_id,
        episode_id: this.episode_id,
        percentage_watched: this.percentage_watched,
        stopped_time: this.stopped_time,
        tenant_id: this.tenant_id,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}