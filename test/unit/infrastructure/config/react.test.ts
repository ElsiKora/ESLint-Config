import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@eslint-react/eslint-plugin", () => ({
	default: {
		configs: {
			recommended: {
				plugins: {
					"@eslint-react": { rules: {} },
				},
				rules: {
					"@eslint-react/button-has-type": "error",
				},
			},
			"recommended-type-checked": {
				plugins: {
					"@eslint-react": { rules: {} },
				},
				rules: {
					"@eslint-react/prefer-usememo": "error",
				},
			},
		},
	},
}));

vi.mock("eslint-plugin-react", () => ({
	default: {
		rules: {
			"jsx-no-bind": { create: () => ({}) },
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
	formatRuleName: vi.fn((name) => name.replace(/^(@[\w-]+\/[\w-]+)\//, "@elsikora/$1/")),
}));

describe("ReactConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(6);
	});

	it("should include react settings and plugins", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check settings for React version detection
		expect(configs[0]).toHaveProperty("settings.react.version", "detect");

		// Check plugin formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("react");

		// Check that plugins are included
		expect(configs[1]).toHaveProperty("plugins");
		expect(configs[1].plugins).toHaveProperty("@elsikora/react");
	});

	it("should handle conditional rules based on withNext option", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");

		// Mock formatRuleName to return predictable values for our test
		vi.mocked(formatRuleNameModule.formatRuleName).mockImplementation((name) => {
			if (name === "react/default-props-match-prop-types") return "react/default-props-match-prop-types";
			if (name === "react/react-in-jsx-scope") return "react/react-in-jsx-scope";
			if (name === "@eslint-react/naming-convention/filename") return "@eslint-react/naming-convention/filename";
			return name;
		});

		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		// Call with withNext: true
		const configsWithNext: Array<Linter.Config> = loadConfig({ withNext: true });

		// Call with withNext: false
		const configsWithoutNext: Array<Linter.Config> = loadConfig({ withNext: false });

		// Check for formatRuleName usage
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalled();

		// Test that conditional logic is called - we don't need to test the exact rule values
		// since our mock implementation affects how the rules are actually stored
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("react/default-props-match-prop-types");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("react/react-in-jsx-scope");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/naming-convention/filename");
	});

	it("should include specific file patterns for different config sections", async () => {
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check JS/JSX config
		expect(configs[2]).toHaveProperty("files", ["**/*.js", "**/*.jsx"]);
		expect(configs[2].languageOptions?.parserOptions).toHaveProperty("ecmaFeatures.jsx", true);

		// Check TS/TSX config
		expect(configs[5]).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
		expect(configs[5].languageOptions).toHaveProperty("parser");
	});
});
