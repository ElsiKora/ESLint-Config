import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock ESLint's builtinRules
vi.mock("eslint/use-at-your-own-risk", () => ({
	builtinRules: new Map([
		["no-console", { meta: {}, create: () => ({}) }],
		["no-unused-vars", { meta: {}, create: () => ({}) }],
	]),
}));

describe("CreateVirtualEslintPluginUtility", () => {
	let createVirtualEslintPlugin: (configs: Array<Linter.Config>, prefix?: string) => Array<Linter.Config>;

	beforeEach(async () => {
		vi.resetModules();
		const module = await import("@infrastructure/utility/create-virtual-eslint-plugin.utility");
		createVirtualEslintPlugin = module.createVirtualEslintPlugin;
	});

	// Creates a virtual plugin with default prefix
	it("should create a virtual plugin with default prefix", () => {
		const configs: Array<Linter.Config> = [
			{
				rules: {
					"no-console": "error",
					"some-plugin/rule": "warn",
				},
			},
		];

		const result = createVirtualEslintPlugin(configs);

		// Should add the plugin configuration
		expect(result.length).toBe(2);
		expect(result[0].plugins).toHaveProperty("@elsikora/javascript");

		// Should have rules with prefixed names
		expect(result[1].rules).toHaveProperty("@elsikora/javascript/no-console", "error");
		expect(result[1].rules).toHaveProperty("some-plugin/rule", "warn");
	});

	// Creates a virtual plugin with custom prefix
	it("should create a virtual plugin with custom prefix", () => {
		const configs: Array<Linter.Config> = [
			{
				rules: {
					"no-console": "error",
				},
			},
		];

		const result = createVirtualEslintPlugin(configs, "@custom/prefix");

		// Should add the plugin configuration with custom prefix
		expect(result.length).toBe(2);
		expect(result[0].plugins).toHaveProperty("@custom/prefix");

		// Should have rules with custom prefix
		expect(result[1].rules).toHaveProperty("@custom/prefix/no-console", "error");
	});

	// Handles configs without rules
	it("should handle configs without rules", () => {
		const configs: Array<Linter.Config> = [
			{
				// Config without rules
				extends: ["some-config"],
			},
		];

		const result = createVirtualEslintPlugin(configs);

		// Should add the plugin configuration
		expect(result.length).toBe(2);
		expect(result[0].plugins).toHaveProperty("@elsikora/javascript");

		// Should preserve the extended config
		expect(result[1].extends).toEqual(["some-config"]);
		expect(result[1].rules).toBeUndefined();
	});

	// Preserves other config properties
	it("should preserve other config properties", () => {
		const configs: Array<Linter.Config> = [
			{
				env: { browser: true },
				parserOptions: { ecmaVersion: 2021 },
				settings: { react: { version: "detect" } },
				rules: {
					"no-console": "error",
				},
			},
		];

		const result = createVirtualEslintPlugin(configs);

		// Should preserve all properties from the original config
		expect(result[1].env).toEqual({ browser: true });
		expect(result[1].parserOptions).toEqual({ ecmaVersion: 2021 });
		expect(result[1].settings).toEqual({ react: { version: "detect" } });
	});

	// Handles multiple configs
	it("should handle multiple configs", () => {
		const configs: Array<Linter.Config> = [
			{
				rules: {
					"no-console": "error",
				},
			},
			{
				rules: {
					"no-unused-vars": "warn",
				},
			},
		];

		const result = createVirtualEslintPlugin(configs);

		// Should add the plugin configuration and transform both configs
		expect(result.length).toBe(3); // plugin + 2 configs
		expect(result[0].plugins).toHaveProperty("@elsikora/javascript");

		// First config rules should be transformed
		expect(result[1].rules).toHaveProperty("@elsikora/javascript/no-console", "error");

		// Second config rules should be transformed
		expect(result[2].rules).toHaveProperty("@elsikora/javascript/no-unused-vars", "warn");
	});

	// Only prefixes rules that exist in builtinRules
	it("should only prefix rules that exist in builtinRules", () => {
		const configs: Array<Linter.Config> = [
			{
				rules: {
					"no-console": "error", // exists in builtinRules
					"unknown-rule": "warn", // doesn't exist in builtinRules
					"some-plugin/rule": "error", // has a plugin prefix already
				},
			},
		];

		const result = createVirtualEslintPlugin(configs);

		// Should add the plugin configuration
		expect(result.length).toBe(2);

		// Should prefix only the built-in rule
		expect(result[1].rules).toHaveProperty("@elsikora/javascript/no-console", "error");
		expect(result[1].rules).toHaveProperty("unknown-rule", "warn");
		expect(result[1].rules).toHaveProperty("some-plugin/rule", "error");
	});

	// Adds all built-in rules to the virtual plugin
	it("should add all built-in rules to the virtual plugin", () => {
		const configs: Array<Linter.Config> = [];
		const result = createVirtualEslintPlugin(configs);

		// Should create the plugin with all built-in rules
		expect(result.length).toBe(1);
		expect(result[0].plugins?.["@elsikora/javascript"]).toBeDefined();
		expect(result[0].plugins?.["@elsikora/javascript"].rules).toHaveProperty("no-console");
		expect(result[0].plugins?.["@elsikora/javascript"].rules).toHaveProperty("no-unused-vars");
	});
});
