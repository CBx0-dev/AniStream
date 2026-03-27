class NotImplementedError extends Error {
    constructor(message?: string) {
        super(message ?? "The method or operation is not implemented.");
        this.name = "NotImplementedError";

        // Fix prototype chain (important for instanceof)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

globalThis.NotImplementedError = NotImplementedError;

declare global {
    var NotImplementedError: new (message?: string) => Error;
}


export {}