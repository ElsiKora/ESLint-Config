import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utility
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

// Mock the eslint-plugin-prettier/recommended
vi.mock("eslint-plugin-prettier/recommended", () => ({
	default: {
		plugins: {
			prettier: {
				rules: {
					prettier: {
						meta: { fixable: true },
						create: () => ({}),
					},
				},
			},
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
}));

describe("PrettierConfig", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/prettier.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should include the prettier plugin and rules", async () => {
		const formatConfigModule = await import("@infrastructure/utility/format-config.utility");
		const module = await import("@infrastructure/config/prettier.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check that formatConfig was called
		expect(formatConfigModule.formatConfig).toHaveBeenCalled();

		// Check that the config includes the prettier plugin
		expect(configs[0]).toHaveProperty("plugins");
		expect(configs[0].plugins).toHaveProperty("prettier");

		// Check that the config includes prettier rules
		expect(configs[0]).toHaveProperty("rules");
		expect(configs[0].rules).toHaveProperty("prettier/prettier");
	});
});
