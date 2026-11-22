import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";

it("rejects invalid input", () => {
	expect(parse("")).toThrow();
});

function parse(value: string): number {
	return Number(value);
}
