import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// This is a template for testing config files.
// To test a specific config file, copy this template and modify the following:
// 1. Change the import path to the specific config file
// 2. Change the describe block name to match the config file name
// 3. Add specific test cases for the config file

/*
  The general approach for testing config files is:
  1. Mock any external dependencies (ESLint plugins, etc.)
  2. Import the config file and call its default export function
  3. Verify the returned config array has the expected structure
  4. Test different options to ensure conditional logic is covered
*/

// Mock external dependencies
vi.mock("@eslint/js", () => ({
	default: {
		configs: {
			recommended: {
				rules: {
					"some-rule": "error",
				},
			},
		},
	},
}));

// Example: Change this to the specific module path
const MODULE_PATH = "@infrastructure/config/json.ts";

describe("ConfigTemplate", () => {
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
	});

	it("should include the correct plugins", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check for expected plugins
		// Example: expect(configs.some(config => config.plugins && Object.keys(config.plugins).includes("some-plugin"))).toBe(true);
	});

	it("should include the correct rules", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check for expected rules
		// Example: expect(configs.some(config => config.rules && Object.keys(config.rules).includes("some-rule"))).toBe(true);
	});

	it("should have different config with certain options", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		// Test with different options
		const configsWithOption: Array<Linter.Config> = loadConfig({ someOption: true });

		// Check for differences when options are provided
		// Example: expect(configsWithOption).not.toEqual(loadConfig({}));
	});
});
