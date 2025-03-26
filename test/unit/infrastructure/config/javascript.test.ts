import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@eslint/js", () => ({
	default: {
		configs: {
			recommended: {
				rules: {
					"no-console": "error",
					"no-unused-vars": "error",
				},
			},
		},
	},
}));

vi.mock("globals", () => ({
	default: {
		node: {
			process: true,
			module: true,
		},
	},
}));

// Mock utility
vi.mock("@infrastructure/utility/create-virtual-eslint-plugin.utility", () => ({
	createVirtualEslintPlugin: vi.fn((configs, prefix) => [
		{
			plugins: {
				[prefix]: { rules: {} },
			},
			rules: {
				[`${prefix}/no-unused-vars`]: configs[1].rules["no-unused-vars"],
			},
		},
	]),
}));

describe("JavascriptConfig", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/javascript.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should use createVirtualEslintPlugin with correct parameters", async () => {
		const createVirtualPluginModule = await import("@infrastructure/utility/create-virtual-eslint-plugin.utility");
		const module = await import("@infrastructure/config/javascript.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that createVirtualEslintPlugin was called with correct prefix
		expect(createVirtualPluginModule.createVirtualEslintPlugin).toHaveBeenCalledWith(expect.any(Array), "@elsikora/javascript");

		// Check that the configs passed include file patterns and globals
		const callArgs = vi.mocked(createVirtualPluginModule.createVirtualEslintPlugin).mock.calls[0][0];
		expect(callArgs[0]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
		expect(callArgs[0].languageOptions).toHaveProperty("globals");
		expect(callArgs[0].languageOptions.globals).toMatchObject({ process: true, module: true });
	});

	it("should disable no-unused-vars when withSonar is true", async () => {
		const createVirtualPluginModule = await import("@infrastructure/utility/create-virtual-eslint-plugin.utility");
		const module = await import("@infrastructure/config/javascript.ts");
		const loadConfig = module.default;

		// Call with withSonar: true
		loadConfig({ withSonar: true });

		// Clear previous mock calls and call again to get a fresh call
		vi.mocked(createVirtualPluginModule.createVirtualEslintPlugin).mockClear();
		loadConfig({ withSonar: true });

		// Get the configs passed to createVirtualEslintPlugin
		const callArgs = vi.mocked(createVirtualPluginModule.createVirtualEslintPlugin).mock.calls[0][0];

		// Verify that no-unused-vars is off when withSonar is true
		expect(callArgs[1].rules).toHaveProperty("no-unused-vars", "off");
	});

	it("should enable no-unused-vars when withSonar is false or undefined", async () => {
		const createVirtualPluginModule = await import("@infrastructure/utility/create-virtual-eslint-plugin.utility");
		const module = await import("@infrastructure/config/javascript.ts");
		const loadConfig = module.default;

		// Clear previous mock calls
		vi.mocked(createVirtualPluginModule.createVirtualEslintPlugin).mockClear();

		// Call with withSonar: false
		loadConfig({ withSonar: false });

		// Get the configs passed to createVirtualEslintPlugin
		const callArgs = vi.mocked(createVirtualPluginModule.createVirtualEslintPlugin).mock.calls[0][0];

		// Verify that no-unused-vars is error when withSonar is false
		expect(callArgs[1].rules).toHaveProperty("no-unused-vars", "error");
	});
});
