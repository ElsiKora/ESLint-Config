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
		expect(configs.length).toBe(4);
	});

	it("should include react settings and recommended config", async () => {
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check settings for React version detection
		expect(configs[0]).toHaveProperty("settings.react.version", "detect");

		// Check that recommended config is included
		expect(configs[1]).toHaveProperty("plugins");
		expect(configs[1].plugins).toHaveProperty("@eslint-react");
	});

	it("should handle conditional rules based on withNext option", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");

		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		// Call with withNext: true
		const configsWithNext: Array<Linter.Config> = loadConfig({ withNext: true });

		// Call with withNext: false
		const configsWithoutNext: Array<Linter.Config> = loadConfig({ withNext: false });

		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalled();
		expect(configsWithNext[2].rules).toHaveProperty("@elsikora/@eslint-react/dom/no-script-url", "off");
		expect(configsWithoutNext[2].rules).toHaveProperty("@elsikora/@eslint-react/dom/no-script-url", "error");

		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/naming-convention/filename");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@eslint-react/dom/no-script-url");
	});

	it("should include specific file patterns for different config sections", async () => {
		const module = await import("@infrastructure/config/react.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check JS/JSX config
		expect(configs[1]).toHaveProperty("files", ["**/*.js", "**/*.jsx"]);
		expect(configs[1].languageOptions?.parserOptions).toHaveProperty("ecmaFeatures.jsx", true);

		// Check TS/TSX config
		expect(configs[3]).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
		expect(configs[3].languageOptions).toHaveProperty("parser");
	});
});
