export type Version = string;

type ParsedVersion = [major: number, minor: number, patch: number];

function parse(version: Version): ParsedVersion {
    const match: RegExpMatchArray | null = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);

    if (!match) {
        throw new Error(`Invalid version: ${version}`);
    }

    return [
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
    ];
}

/**
 * Compare two versions.
 * Returns -1 if a < b, 0 if a === b, and 1 if a > b.
 */
export function compare(a: Version, b: Version): -1 | 0 | 1 {
    const av: ParsedVersion = parse(a);
    const bv: ParsedVersion = parse(b);

    for (let i = 0; i < 3; i++) {
        if (av[i] < bv[i]) return -1;
        if (av[i] > bv[i]) return 1;
    }

    return 0;
}

/**
 * True if a is greater than b.
 */
export function gt(a: Version, b: Version): boolean {
    return compare(a, b) > 0;
}

/**
 * True if a is greater than or equal to b.
 */
export function gte(a: Version, b: Version): boolean {
    return compare(a, b) >= 0;
}

/**
 * True if a is less than b.
 */
export function lt(a: Version, b: Version): boolean {
    return compare(a, b) < 0;
}

/**
 * True if a is less than or equal to b.
 */
export function lte(a: Version, b: Version): boolean {
    return compare(a, b) <= 0;
}

/**
 * True if two versions are equal.
 */
export function eq(a: Version, b: Version): boolean {
    return compare(a, b) === 0;
}

type Comparator = {
    operator: ">=" | "<=" | ">" | "<" | "=";
    version: Version;
};

function expandRange(range: string): Comparator[] {
    const input: string = range.trim();

    // Caret: compatible with the specified major version,
    // following npm-style SemVer rules.
    const caret: RegExpExecArray | null = /^\^(\d+\.\d+\.\d+)$/.exec(input);
    if (caret) {
        const [major, minor, patch] = parse(caret[1]);
        const upper: string =
            major > 0
                ? `${major + 1}.0.0`
                : minor > 0
                    ? `0.${minor + 1}.0`
                    : `0.0.${patch + 1}`;

        return [
            {operator: ">=", version: caret[1]},
            {operator: "<", version: upper},
        ];
    }

    // Tilde: compatible with the specified minor version.
    const tilde: RegExpMatchArray | null = /^~(\d+\.\d+\.\d+)$/.exec(input);
    if (tilde) {
        const [major, minor] = parse(tilde[1]);

        return [
            {operator: ">=", version: tilde[1]},
            {operator: "<", version: `${major}.${minor + 1}.0`},
        ];
    }

    // Wildcard-free comparator sets, e.g. >=1.2.0 <2.0.0.
    const parts: string[] = input.split(/\s+/);
    const comparators: Comparator[] = [];

    for (const part of parts) {
        const match: RegExpMatchArray | null = /^(>=|<=|>|<|=)?(\d+\.\d+\.\d+)$/.exec(part);

        if (!match) {
            throw new Error(`Invalid version range: ${range}`);
        }

        const operator = (match[1] || "=") as Comparator["operator"];
        const version: string = match[2];

        parse(version);
        comparators.push({operator, version});
    }

    return comparators;
}

/**
 * Check whether a version satisfies a range.
 *
 * Supported:
 *   1.2.3
 *   =1.2.3
 *   >1.2.3
 *   >=1.2.3
 *   <1.2.3
 *   <=1.2.3
 *   ^1.2.3
 *   ~1.2.3
 *   >=1.2.0 <2.0.0
 *
 * Multiple comparators separated by spaces are ANDed.
 */
export function satisfies(
    version: Version,
    range: string
): boolean {
    // Validate even when the range has no comparators.
    parse(version);

    return expandRange(range).every(({operator, version: target}) => {
        const result: -1 | 0 | 1 = compare(version, target);

        switch (operator) {
            case ">":
                return result > 0;
            case ">=":
                return result >= 0;
            case "<":
                return result < 0;
            case "<=":
                return result <= 0;
            case "=":
                return result === 0;
        }
    });
}
