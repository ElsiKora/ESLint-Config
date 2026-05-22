import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utility
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

// Mock the jsx-a11y-x plugin
vi.mock("eslint-plugin-jsx-a11y-x", () => ({
	default: {
		configs: {
			recommended: {
				plugins: {
					"jsx-a11y-x": {
						rules: {
							"alt-text": {
								meta: { fixable: true },
								create: () => ({}),
							},
						},
					},
				},
				rules: {
					"jsx-a11y-x/alt-text": "error",
				},
			},
		},
	},
}));

describe("JsxConfig", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/jsx.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(2);
	});

	it("should format the jsx-a11y-x recommended config", async () => {
		const formatConfigModule = await import("@infrastructure/utility/format-config.utility");
		const module = await import("@infrastructure/config/jsx.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that formatConfig was called with the jsx-a11y-x recommended config
		expect(formatConfigModule.formatConfig).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					plugins: expect.objectContaining({
						"jsx-a11y-x": expect.any(Object),
					}),
					rules: expect.objectContaining({
						"jsx-a11y-x/alt-text": "error",
					}),
				}),
			]),
		);
	});

	it("should override explicit jsx-a11y-x rules", async () => {
		const module = await import("@infrastructure/config/jsx.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(configs[1].rules).toHaveProperty("@elsikora/jsx/no-autofocus", "off");
	});
});
