import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-n", () => ({
	default: {
		configs: {
			"flat/recommended": {
				plugins: {
					n: {
						rules: {
							"no-process-exit": { create: () => ({}) },
							"exports-style": { create: () => ({}) },
							"no-missing-import": { create: () => ({}) },
							"no-unsupported-features/es-builtins": { create: () => ({}) },
						},
					},
				},
				rules: {
					"n/no-process-exit": "error",
					"n/exports-style": "error",
					"n/no-missing-import": "error",
				},
			},
		},
		rules: {
			"no-process-exit": { create: () => ({}) },
			"exports-style": { create: () => ({}) },
			"no-missing-import": { create: () => ({}) },
			"no-unsupported-features/es-builtins": { create: () => ({}) },
		},
	},
}));

// Mock utility functions
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace(/^([\w-]+)\//, "@elsikora/$1/")),
}));

describe("NodeConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/node.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(2);
	});

	it("should format the Node.js plugin and configure file patterns", async () => {
		const formatConfigModule = await import("@infrastructure/utility/format-config.utility");
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/node.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check that formatConfig was called
		expect(formatConfigModule.formatConfig).toHaveBeenCalled();

		// Check that formatPluginName was called for the Node.js plugin
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("n");
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("n/no-unsupported-features");

		// Check file patterns for both configs
		expect(configs[0]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
		expect(configs[1]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
	});

	it("should format rule names and configure rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/node.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that formatRuleName was called for all rules
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("n/exports-style");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("n/no-missing-import");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("n/no-process-exit");
	});

	it("should disable no-process-exit rule when withUnicorn is true", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/node.ts");
		const loadConfig = module.default;

		// Mock the formatRuleName to return predictable values
		vi.mocked(formatRuleNameModule.formatRuleName).mockImplementation((name) => {
			if (name === "n/no-process-exit") return "@elsikora/n/no-process-exit";
			return name;
		});

		// Test with withUnicorn: true
		const configsWithUnicorn = loadConfig({ withUnicorn: true });
		const rulesWithUnicorn = configsWithUnicorn[1].rules || {};

		// Test with withUnicorn: false
		const configsWithoutUnicorn = loadConfig({ withUnicorn: false });
		const rulesWithoutUnicorn = configsWithoutUnicorn[1].rules || {};

		// Verify the rule is disabled with Unicorn and enabled without
		expect(rulesWithUnicorn["@elsikora/n/no-process-exit"]).toBe("off");
		expect(rulesWithoutUnicorn["@elsikora/n/no-process-exit"]).toBe("error");
	});

	it("should extract subplugin for no-unsupported-features", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/node.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that formatPluginName was called for the subplugin
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("n/no-unsupported-features");

		// The config should include the subplugin
		const plugins = Object.keys(loadConfig({})[0].plugins || {});
		expect(plugins).toContain("@elsikora/n/no-unsupported-features");
	});
});
