export class UnsupportedPlatformError extends Error {
    public readonly name: string = 'UnsupportedPlatformError';

    public constructor(name: string, message?: string) {
        const defaultMessage: string = `The function or method "${name}" is not supported on the current platform.`;

        super(message ?? defaultMessage);

        Object.setPrototypeOf(this, UnsupportedPlatformError.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}