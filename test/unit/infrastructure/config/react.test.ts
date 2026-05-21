import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@eslint-react/eslint-plugin", () => ({
	default: {
		configs: {
			strict: {
				plugins: {
					"@eslint-react": { rules: {} },
				},
				rules: {
					"@eslint-react/button-has-type": "error",
				},
			},
			"strict-type-checked": {
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
		expect(configs.length).toBe(5);
	});

	it("should include react settings", async () => {
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check settings for React version detection
		expect(configs[0]).toHaveProperty("settings.react.version", "detect");
	});

	it("should configure explicit @eslint-react rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");

		// Mock formatRuleName to return predictable values for our test
		vi.mocked(formatRuleNameModule.formatRuleName).mockImplementation((name) => {
			if (name === "@eslint-react/use-state") return "@eslint-react/use-state";
			if (name === "@eslint-react/dom-no-missing-button-type") return "@eslint-react/dom-no-missing-button-type";
			if (name === "@eslint-react/dom-no-string-style-prop") return "@eslint-react/dom-no-string-style-prop";
			if (name === "@eslint-react/dom-no-unknown-property") return "@eslint-react/dom-no-unknown-property";
			return name;
		});

		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check for formatRuleName usage
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalled();

		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/dom-no-missing-button-type");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/dom-no-string-style-prop");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/dom-no-unknown-property");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/use-state");
	});

	it("should include specific file patterns for different config sections", async () => {
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check JS/JSX config
		expect(configs[1]).toHaveProperty("files", ["**/*.js", "**/*.jsx"]);
		expect(configs[1].languageOptions?.parserOptions).toHaveProperty("ecmaFeatures.jsx", true);

		// Check TS/TSX config
		expect(configs[4]).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
		expect(configs[4].languageOptions).toHaveProperty("parser");
	});
});
