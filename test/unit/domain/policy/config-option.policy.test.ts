import { describe, expect, it } from "vitest";
import { InvalidConfigOptionError } from "@domain/error";
import { ConfigOptionPolicy } from "@domain/policy";

describe("ConfigOptionPolicy", () => {
	it("should return enabled module IDs in option declaration order", () => {
		const result = ConfigOptionPolicy.resolveEnabledModuleIds({
			withJavascript: true,
			withTypescriptStrict: true,
			withNoSecrets: true,
		});

		expect(result).toEqual(["javascript", "typescript-strict", "no-secrets"]);
	});

	it("should throw for unknown option keys", () => {
		// eslint-disable-next-line @elsikora/typescript/no-unsafe-argument
		expect(() => ConfigOptionPolicy.resolveEnabledModuleIds({ withUnknownOption: true } as never)).toThrowError(InvalidConfigOptionError);
	});
});
