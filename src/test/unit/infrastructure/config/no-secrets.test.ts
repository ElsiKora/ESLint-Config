import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-no-secrets", () => ({
	default: {
		rules: {
			"no-pattern-match": { create: () => ({}) },
			"no-secrets": { create: () => ({}) },
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
vi.mock("../../../../infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("../../../../infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace(/^([\w-]+)\//, "@elsikora/$1/")),
}));

describe("NoSecretsConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("../../../../infrastructure/config/no-secrets.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(3);
	});

	it("should configure the no-secrets plugin", async () => {
		const formatPluginNameModule = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const module = await import("../../../../infrastructure/config/no-secrets.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("no-secrets");
	});

	it("should include pattern-matching rules for secrets detection", async () => {
		const formatRuleNameModule = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const module = await import("../../../../infrastructure/config/no-secrets.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called for both rules
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("no-secrets/no-pattern-match");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("no-secrets/no-secrets");

		// Check the pattern matching rule configuration
		const firstConfig = configs[0];
		const patternRule = firstConfig.rules?.["@elsikora/no-secrets/no-pattern-match"];
		expect(Array.isArray(patternRule)).toBe(true);
		expect(patternRule[0]).toBe("error");

		// Verify patterns object structure
		const patternOptions = patternRule[1];
		expect(patternOptions).toHaveProperty("patterns");
		expect(patternOptions.patterns).toHaveProperty("ApiKey");
		expect(patternOptions.patterns).toHaveProperty("Password");
		expect(patternOptions.patterns).toHaveProperty("SecretKey");
		expect(patternOptions.patterns).toHaveProperty("Token");
	});

	it("should include specific file patterns for different configs", async () => {
		const module = await import("../../../../infrastructure/config/no-secrets.ts");
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
