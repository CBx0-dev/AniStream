export class UnsupportedPlatformError extends Error {
    public readonly name: string = "UnsupportedPlatformError";

    public constructor(name: string, message?: string) {
        const defaultMessage: string = `The function or method "${name}" is not supported on the current platform.`;

        super(message ?? defaultMessage);

        Object.setPrototypeOf(this, UnsupportedPlatformError.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NotImplementedError extends Error {
    public readonly name: string = "NotImplementedError";


    public constructor(name: string, message?: string) {
        const defaultMessage: string = `The function or method "${name}" is not implemented.`;

        super(message ?? defaultMessage);

        Object.setPrototypeOf(this, NotImplementedError.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class InvalidOperationError extends Error {
    public readonly name: string = "InvalidOperationError";

    public constructor(message?: string) {
        const defaultMessage: string = "Operation is not valid due to the current state of the application.";

        super(message ?? defaultMessage);

        Object.setPrototypeOf(this, InvalidOperationError.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}