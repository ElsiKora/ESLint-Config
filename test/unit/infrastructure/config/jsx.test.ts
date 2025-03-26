import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utility
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

// Mock the jsx-a11y plugin
vi.mock("eslint-plugin-jsx-a11y", () => ({
	default: {
		flatConfigs: {
			recommended: {
				plugins: {
					"jsx-a11y": {
						rules: {
							"alt-text": {
								meta: { fixable: true },
								create: () => ({}),
							},
						},
					},
				},
				rules: {
					"jsx-a11y/alt-text": "error",
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
		expect(configs.length).toBe(1);
	});

	it("should format the jsx-a11y recommended config", async () => {
		const formatConfigModule = await import("@infrastructure/utility/format-config.utility");
		const module = await import("@infrastructure/config/jsx.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that formatConfig was called with the jsx-a11y recommended config
		expect(formatConfigModule.formatConfig).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					plugins: expect.objectContaining({
						"jsx-a11y": expect.any(Object),
					}),
					rules: expect.objectContaining({
						"jsx-a11y/alt-text": "error",
					}),
				}),
			]),
		);
	});
});
