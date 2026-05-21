import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@conarti/eslint-plugin-feature-sliced", () => ({
	plugin: {
		rules: {
			"absolute-relative": { create: () => ({}) },
			"import-order": { create: () => ({}) },
			"layers-slices": { create: () => ({}) },
			"no-cross-segment-reexport": { create: () => ({}) },
			"public-api": { create: () => ({}) },
		},
	},
}));

vi.mock("eslint-plugin-fsd-lint", () => ({
	default: {
		rules: {
			"forbidden-imports": { create: () => ({}) },
			"no-cross-slice-dependency": { create: () => ({}) },
			"no-global-store-imports": { create: () => ({}) },
			"no-public-api-sidestep": { create: () => ({}) },
			"no-relative-imports": { create: () => ({}) },
			"no-ui-in-business-logic": { create: () => ({}) },
			"ordered-imports": { create: () => ({}) },
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
	formatPluginName: vi.fn((name) => (name === "fsd" ? "@elsikora/fsd/1" : "@elsikora/fsd/2")),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace("fsd", "@elsikora/fsd/1").replace("@conarti/feature-sliced", "@elsikora/fsd/2")),
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
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("fsd");
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("@conarti/feature-sliced");
	});

	it("should include FSD linting rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/fsd.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called for all rules
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/forbidden-imports");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/no-cross-slice-dependency");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/no-global-store-imports");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/no-public-api-sidestep");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/no-relative-imports");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/no-ui-in-business-logic");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("fsd/ordered-imports");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@conarti/feature-sliced/no-cross-segment-reexport");

		// Check rules configuration
		const firstConfig = configs[0];
		expect(firstConfig.rules).toHaveProperty("@elsikora/fsd/1/forbidden-imports", "error");
		expect(firstConfig.rules).toHaveProperty("@elsikora/fsd/1/no-public-api-sidestep", [
			"error",
			{
				publicApi: {
					allowSegmentImports: false,
					enforceShared: true,
				},
			},
		]);
		expect(firstConfig.rules).toHaveProperty("@elsikora/fsd/2/no-cross-segment-reexport", "error");
		expect(firstConfig.rules).not.toHaveProperty("@elsikora/fsd/2/absolute-relative");
		expect(firstConfig.rules).not.toHaveProperty("@elsikora/fsd/2/import-order");
		expect(firstConfig.rules).not.toHaveProperty("@elsikora/fsd/2/layers-slices");
		expect(firstConfig.rules).not.toHaveProperty("@elsikora/fsd/2/public-api");
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
