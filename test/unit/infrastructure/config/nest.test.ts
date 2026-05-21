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

	it("should properly configure NestJS plugin", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/nest.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("nestjs-typed");
	});

	it("should include NestJS specific rules with proper formatting", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/nest.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called
		const explicitRules: Array<string> = [
			"nestjs-typed/all-properties-are-whitelisted",
			"nestjs-typed/all-properties-have-explicit-defined",
			"nestjs-typed/api-enum-property-best-practices",
			"nestjs-typed/api-method-should-specify-api-operation",
			"nestjs-typed/api-method-should-specify-api-response",
			"nestjs-typed/api-methods-should-be-guarded",
			"nestjs-typed/api-property-matches-property-optionality",
			"nestjs-typed/api-property-returning-array-should-set-array",
			"nestjs-typed/controllers-should-supply-api-tags",
			"nestjs-typed/no-duplicate-decorators",
			"nestjs-typed/param-decorator-name-matches-route-param",
			"nestjs-typed/provided-injected-should-match-factory-parameters",
			"nestjs-typed/should-specify-forbid-unknown-values",
			"nestjs-typed/sort-module-metadata-arrays",
			"nestjs-typed/validate-nested-of-array-should-set-each",
			"nestjs-typed/validated-non-primitive-property-needs-type-decorator",
		];

		for (const rule of explicitRules) {
			expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith(rule);
		}

		// Check specific rules are present with expected values
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/all-properties-have-explicit-defined", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-enum-property-best-practices", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-method-should-specify-api-response", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-method-should-specify-api-operation", "off");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-methods-should-be-guarded", "off");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-property-matches-property-optionality", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/api-property-returning-array-should-set-array", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/controllers-should-supply-api-tags", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/no-duplicate-decorators", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/param-decorator-name-matches-route-param", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/provided-injected-should-match-factory-parameters", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/should-specify-forbid-unknown-values", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/sort-module-metadata-arrays", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/validate-nested-of-array-should-set-each", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/nestjs-typed/validated-non-primitive-property-needs-type-decorator", "error");
	});
});
