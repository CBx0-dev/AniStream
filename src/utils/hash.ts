
const FNV_OFFSET_BASIS: bigint = 0xcbf29ce484222325n;
const FNV_PRIME: bigint = 0x100000001b3n;

export function fnv1a(input: string): string {
    let hash: bigint = FNV_OFFSET_BASIS;

    for (let i: number = 0; i < input.length; i++) {
        hash ^= BigInt(input.charCodeAt(i));
        hash = (hash * FNV_PRIME) & 0xffffffffffffffffn;
    }

    const bytes: Uint8Array = new Uint8Array(8);
    for (let i: number = 7; i >= 0; i--) {
        bytes[i] = Number(hash & 0xffn);
        hash >>= 8n;
    }

    const base64: string = btoa(String.fromCharCode(...bytes));
    return base64
        .replace(/\+/g, "-")
        .replace(/\//g, '-')
        .replace(/=+$/, "");
}