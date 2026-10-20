import {describe, expect, it} from "vitest";
import * as version from "@utils/version";

describe("Version Range Satisfaction", () => {
    it("satisfies caret ranges", () => {
        expect(version.satisfies("1.0.0", "^1.0.0")).toBe(true);
        expect(version.satisfies("1.2.3", "^1.0.0")).toBe(true);
        expect(version.satisfies("1.9.9", "^1.0.0")).toBe(true);
        expect(version.satisfies("2.0.0", "^1.0.0")).toBe(false);
        expect(version.satisfies("0.9.9", "^1.0.0")).toBe(false);

        expect(version.satisfies("0.2.3", "^0.2.0")).toBe(true);
        expect(version.satisfies("0.3.0", "^0.2.0")).toBe(false);
    });

    it("satisfies tilde ranges", () => {
        expect(version.satisfies("1.2.0", "~1.2.0")).toBe(true);
        expect(version.satisfies("1.2.5", "~1.2.0")).toBe(true);
        expect(version.satisfies("1.3.0", "~1.2.0")).toBe(false);
        expect(version.satisfies("1.1.9", "~1.2.0")).toBe(false);
    });

    it("satisfies explicit operator ranges", () => {
        expect(version.satisfies("1.5.0", ">=1.0.0 <2.0.0")).toBe(true);
        expect(version.satisfies("2.0.0", ">=1.0.0 <2.0.0")).toBe(false);
        expect(version.satisfies("0.9.0", ">=1.0.0 <2.0.0")).toBe(false);
    });

    it("satisfies exact version ranges", () => {
        expect(version.satisfies("1.0.0", "1.0.0")).toBe(true);
        expect(version.satisfies("1.0.1", "1.0.0")).toBe(false);
    });
});
