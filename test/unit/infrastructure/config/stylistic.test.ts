import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@stylistic/eslint-plugin", () => ({
	default: {
		configs: {
			recommended: {
				rules: {
					"@stylistic/indent": ["error", 2],
					"@stylistic/semi": ["error", "always"],
				},
			},
		},
	},
}));

vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => name),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name),
}));

const MODULE_PATH = "@infrastructure/config/stylistic.ts";

describe("Stylistic Config", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should include the stylistic plugin", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig();

		expect(configs[0]!.plugins).toHaveProperty("@stylistic");
	});

	it("should configure all custom rules", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig();

		// Check basic rule configuration
		expect(configs[0]!.rules).toHaveProperty("@stylistic/brace-style");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/brace-style"]).toEqual(["error", "1tbs", { allowSingleLine: false }]);

		expect(configs[0]!.rules).toHaveProperty("@stylistic/comma-spacing");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/comma-spacing"]).toBe("error");

		expect(configs[0]!.rules).toHaveProperty("@stylistic/function-call-spacing");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/function-call-spacing"]).toBe("error");

		expect(configs[0]!.rules).toHaveProperty("@stylistic/lines-between-class-members");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/lines-between-class-members"]).toBe("error");

		expect(configs[0]!.rules).toHaveProperty("@stylistic/object-curly-spacing");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/object-curly-spacing"]).toEqual(["error", "always"]);

		// Check complex padding-line-between-statements rule
		expect(configs[0]!.rules).toHaveProperty("@stylistic/padding-line-between-statements");
		// @ts-expect-error test indexing into rules map
		const pls = configs[0]!.rules["@stylistic/padding-line-between-statements"] as unknown as Array<unknown>;
		expect(Array.isArray(pls)).toBe(true);
		expect(pls.length).toBeGreaterThan(10);

		// Check remaining rules
		expect(configs[0]!.rules).toHaveProperty("@stylistic/space-before-blocks");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/space-before-blocks"]).toBe("error");

		expect(configs[0]!.rules).toHaveProperty("@stylistic/spaced-comment");
		// @ts-expect-error test indexing into rules map
		expect(configs[0]!.rules["@stylistic/spaced-comment"]).toBe("error");
	});
});
