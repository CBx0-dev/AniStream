declare global {
    interface String {
        reverse(): string;

        swapCase(): string;
    }
}

String.prototype.reverse = function (): string {
    return this
        .valueOf()
        .split("")
        .reverse()
        .join("");
}

String.prototype.swapCase = function (): string {
    return this
        .valueOf()
        .split("")
        .map(char => char == char.toUpperCase()
            ? char.toLowerCase()
            : char.toUpperCase())
        .join("");
}

export {};