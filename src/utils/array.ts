declare global {
    interface Array<T> {
        at(index: number): T;
    }
}

Array.prototype.at = function<T>(index: number): T {
    if (index < 0) {
        index = this.length + index;
    }

    if (index >= this.length) {
        throw "Index is out of bounds";
    }

    return this[index];
}

export {}