import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@conarti/eslint-plugin-feature-sliced", () => ({
	default: {
		rules: {
			"absolute-relative": { create: () => ({}) },
			"layers-slices": { create: () => ({}) },
			"public-api": { create: () => ({}) },
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
	formatPluginName: vi.fn((name) => `@elsikora/fsd`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace("@conarti/feature-sliced", "@elsikora/fsd")),
}));

describe("FsdConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/fsd.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(3);
	});

	it("should configure the Feature-Sliced Design plugin", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/fsd.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("@conarti/feature-sliced");
	});

	it("should include FSD linting rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/fsd.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called for all rules
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@conarti/feature-sliced/absolute-relative");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@conarti/feature-sliced/layers-slices");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@conarti/feature-sliced/public-api");

		// Check rules configuration
		const firstConfig = configs[0];
		expect(firstConfig.rules).toHaveProperty("@elsikora/fsd/absolute-relative", "error");
		expect(firstConfig.rules).toHaveProperty("@elsikora/fsd/layers-slices", "error");
		expect(firstConfig.rules).toHaveProperty("@elsikora/fsd/public-api", "error");
	});

	it("should include specific file patterns for different configs", async () => {
		const module = await import("@infrastructure/config/fsd.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check TS/TSX-specific config
		const tsConfig = configs[1];
		expect(tsConfig).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
		expect(tsConfig.languageOptions).toHaveProperty("parser");
		expect(tsConfig.languageOptions?.parserOptions).toHaveProperty("projectService", true);

		// Check JS/JSX-specific config
		const jsConfig = configs[2];
		expect(jsConfig).toHaveProperty("files", ["**/*.js", "**/*.jsx"]);
		expect(jsConfig.languageOptions?.parserOptions).toHaveProperty("ecmaFeatures.jsx", true);
		expect(jsConfig.languageOptions?.parserOptions).toHaveProperty("ecmaVersion", "latest");
	});
});
