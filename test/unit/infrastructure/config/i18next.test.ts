import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-i18next", () => ({
	default: {
		rules: {
			"no-literal-string": { create: () => ({}) },
		},
	},
}));

vi.mock("typescript-eslint", () => ({
	default: {
		parser: {
			parse: () => ({}),
		},
	},
	parser: {
		parse: () => ({}),
	},
}));

// Mock utility functions
vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace(/^([\w-]+)\//, "@elsikora/$1/")),
}));

describe("I18nextConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/i18next.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(2);
	});

	it("should configure the i18next plugin", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/i18next.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("i18next");
	});

	it("should include i18next rules for localization", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/i18next.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("i18next/no-literal-string");

		// Check rule configuration
		const firstConfig = configs[0];
		expect(firstConfig.rules).toHaveProperty("@elsikora/i18next/no-literal-string", [
			"error",
			{
				mode: "jsx-text-only",
			},
		]);
	});

	it("should include specific file patterns for different configs", async () => {
		const module = await import("@infrastructure/config/i18next.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check TS/TSX-specific config
		const tsConfig = configs[0];
		expect(tsConfig).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
		expect(tsConfig.languageOptions).toHaveProperty("parser");
		expect(tsConfig.languageOptions?.parserOptions).toHaveProperty("projectService", true);

		// Check JS/JSX-specific config
		const jsConfig = configs[1];
		expect(jsConfig).toHaveProperty("files", ["**/*.js", "**/*.jsx"]);
		expect(jsConfig.languageOptions?.parserOptions).toHaveProperty("ecmaFeatures.jsx", true);
		expect(jsConfig.languageOptions?.parserOptions).toHaveProperty("ecmaVersion", "latest");
	});
});
