export interface GenreFetchModel {
    key: string;
    main: boolean;
}

export interface GenreDbModel {
    genre_id: number;
    key: string;
}

export interface GenreModel extends GenreDbModel {
    clone(): GenreModel;
}

export function GenreModel(key: string): GenreModel;
export function GenreModel(genre_id: number, key: string): GenreModel;

export function GenreModel(...args: unknown[]): GenreModel {
    if (args.length == 3) {
        args.unshift(0);
    }

    return _GenreModel(...args as [number, string]);
}

function _GenreModel(genre_id: number, key: string): GenreModel {
    const obj: GenreModel = {
        genre_id: genre_id,
        key: key,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: GenreModel): GenreModel {
    const obj: GenreModel = {
        genre_id: this.genre_id,
        key: this.key,
        clone: clone,
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}