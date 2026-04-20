export interface SeasonFetchModel {
    series_id: number;
    season_number: number;
}

export interface SeasonDbModel {
    season_id: number;
    series_id: number;
    season_number: number;
}

export interface SeasonModel extends SeasonDbModel {
    clone(): SeasonModel;
}

export function SeasonModel(series_id: number, season_number: number): SeasonModel;
export function SeasonModel(season_id: number, series_id: number, season_number: number): SeasonModel;

export function SeasonModel(...args: unknown[]): SeasonModel {
    if (args.length == 2) {
        args.unshift(0);
    }

    return _SeasonModel(...args as [number, number, number]);
}

function _SeasonModel(season_id: number, series_id: number, season_number: number): SeasonModel {
    const obj: SeasonModel = {
        season_id: season_id,
        series_id: series_id,
        season_number: season_number,
        clone: clone
    }

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: SeasonModel): SeasonModel {
    const obj: SeasonModel = {
        season_id: this.season_id,
        series_id: this.series_id,
        season_number: this.season_number,
        clone: clone
    }

    obj.clone = obj.clone.bind(obj);
    return obj;
}