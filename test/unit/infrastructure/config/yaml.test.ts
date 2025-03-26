import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utility
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

// Mock the yaml plugin
vi.mock("eslint-plugin-yml", () => ({
	default: {
		configs: {
			"flat/recommended": [
				{
					plugins: {
						yml: {
							rules: {
								"key-name-casing": {
									meta: { fixable: true },
									create: () => ({}),
								},
							},
						},
					},
					rules: {
						"yml/key-name-casing": "error",
					},
				},
			],
		},
	},
}));

describe("YamlConfig", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/yaml.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should format the yaml recommended config", async () => {
		const formatConfigModule = await import("@infrastructure/utility/format-config.utility");
		const module = await import("@infrastructure/config/yaml.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that formatConfig was called with the yaml recommended config
		expect(formatConfigModule.formatConfig).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					plugins: expect.objectContaining({
						yml: expect.any(Object),
					}),
					rules: expect.objectContaining({
						"yml/key-name-casing": "error",
					}),
				}),
			]),
		);
	});
});
