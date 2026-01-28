declare global {
    interface Array<T> {
        at(index: number): T;

        groupTo2D<K>(cb: (item: T) => K): T[][]

        clear(): void;
    }
}

Array.prototype.at = function <T>(index: number): T {
    if (index < 0) {
        index = this.length + index;
    }

    if (index >= this.length) {
        throw "Index is out of bounds";
    }

    return this[index];
}

Array.prototype.groupTo2D = function <T, K>(cb: (item: T) => K): T[][] {
    const map: Map<K, T[]> = new Map<K, T[]>();

    for (const item of this) {
        const key: K = cb(item);
        const group: T[] | undefined = map.get(key);

        if (group) {
            group.push(item);
            continue;
        }

        map.set(key, [item]);
    }

    return Array.from(map.values());
}

Array.prototype.clear = function () {
    this.length = 0;
}

export {}