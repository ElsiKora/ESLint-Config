import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@elsikora/eslint-plugin-nestjs-typed", () => ({
	default: {
		plugin: {
			rules: {
				"api-enum-property-best-practices": { create: () => ({}) },
				"controllers-should-supply-api-tags": { create: () => ({}) },
			},
		},
	},
}));

vi.mock("@eslint/compat", () => ({
	fixupPluginRules: vi.fn((plugin) => plugin),
}));

vi.mock("eslint-plugin-ng-module-sort", () => ({
	default: {
		rules: {
			"decorator-array-items": { create: () => ({}) },
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
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace(/^([\w-]+)\//, "@elsikora/$1/")),
}));

describe("NestConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/nest.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should include TypeScript configuration for NestJS", async () => {
		const module = await import("@infrastructure/config/nest.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check TypeScript configuration
		expect(configs[0]).toHaveProperty("files", ["**/*.ts"]);
		expect(configs[0].languageOptions).toHaveProperty("parser");
		expect(configs[0].languageOptions?.parserOptions).toHaveProperty("projectService", true);
	});

	it("should properly configure NestJS and Angular plugins", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const fixupCompat = await import("@eslint/compat");
		const module = await import("@infrastructure/config/nest.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("nestjs-typed");
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("ng-module-sort");

		// Check ESLint compatibility function was called
		expect(fixupCompat.fixupPluginRules).toHaveBeenCalled();
	});

	it("should include NestJS specific rules with proper formatting", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/nest.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("nestjs-typed/all-properties-are-whitelisted");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("ng-module-sort/decorator-array-items");

		// Check specific rules are present with expected values
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-method-should-specify-api-response", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-method-should-specify-api-operation", "off");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/controllers-should-supply-api-tags", "error");

		// Check array-form rule is properly configured
		expect(configs[0].rules).toHaveProperty("@elsikora/ng-module-sort/decorator-array-items");
		const decoratorRule = configs[0].rules?.["@elsikora/ng-module-sort/decorator-array-items"];
		expect(Array.isArray(decoratorRule)).toBe(true);
		expect(decoratorRule[0]).toBe("error");
		expect(decoratorRule[1]).toHaveProperty("reverseSort", false);
	});
});
