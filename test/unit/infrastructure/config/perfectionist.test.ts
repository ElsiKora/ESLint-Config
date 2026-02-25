import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("eslint-plugin-perfectionist", () => ({
	default: {
		rules: {
			"sort-imports": { create: () => ({}) },
		},
	},
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name),
}));

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => name),
}));

const MODULE_PATH = "@infrastructure/config/perfectionist.ts";

describe("Perfectionist Config", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should include the configured plugin and files pattern", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(configs[0].plugins).toHaveProperty("perfectionist");
		expect(configs[0].files).toEqual(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
	});

	it("should have different import sorting config when FSD is enabled", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const defaultConfigs = loadConfig({});
		const fsdConfigs = loadConfig({ withFsd: true });

		expect(defaultConfigs[0].rules["perfectionist/sort-imports"]).toBe("error");
		expect(fsdConfigs[0].rules["perfectionist/sort-imports"]).toBe("off");
	});
});
