export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function(this: any, ...args: Parameters<T>): ReturnType<T> | null {
        if (!inThrottle) {
            const rt: ReturnType<T> = fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
            return rt;
        }

        return null;
    }
}