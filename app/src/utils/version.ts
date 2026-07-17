export function compareVersion(a: string, b: string): number {
    const pa: number[] = a.split(".").map(Number);
    const pb: number[] = b.split(".").map(Number);

    for (let i: number = 0; i < 3; i++) {
        const diff: number = (pa[i] ?? 0) - (pb[i] ?? 0);
        if (diff != 0) {
            return diff;
        }
    }

    return 0;
}

export function isVersionInRange(version: string, minVersion: string, maxVersion: string): boolean {
    return (
        compareVersion(version, minVersion) >= 0 &&
        compareVersion(version, maxVersion) <= 0
    );
}