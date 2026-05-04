export interface SeriesFetchModel {
    series_id: number;
    guid: string;
    title: string;
    description: string;
    preview_image: string | null;
}

export interface SeriesDbModel {
    series_id: number;
    guid: string;
    title: string;
    description: string;
    preview_image: string | null;
}

export interface SeriesModel extends SeriesDbModel {
    clone(): SeriesModel;
}

export function SeriesModel(guid: string, title: string, description: string, preview_image: string | null): SeriesModel;
export function SeriesModel(series_id: number, guid: string, title: string, description: string, preview_image: string | null): SeriesModel;
export function SeriesModel(...args: unknown[]): SeriesModel {
    if (args.length == 4) {
        args.unshift(0);
    }

    return _SeriesModel(...args as [number, string, string, string, string | null]);
}

function _SeriesModel(series_id: number, guid: string, title: string, description: string, preview_image: string | null): SeriesModel {
    const obj: SeriesModel = {
        series_id: series_id,
        guid: guid,
        title: title,
        description: description,
        preview_image: preview_image,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: SeriesModel): SeriesModel {
    const obj: SeriesModel = {
        series_id: this.series_id,
        guid: this.guid,
        title: this.title,
        description: this.description,
        preview_image: this.preview_image,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}