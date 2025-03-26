import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@elsikora/eslint-plugin-css", () => ({
	default: {
		configs: {
			recommended: {
				plugins: {
					css: {
						rules: {
							"no-empty-blocks": { create: () => ({}) },
							"no-invalid-at-rules": { create: () => ({}) },
						},
					},
				},
				rules: {
					"css/no-empty-blocks": "error",
					"css/no-invalid-at-rules": "error",
				},
			},
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

describe("CssConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/css.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(2);
	});

	it("should format the CSS config", async () => {
		const formatConfigModule = await import("@infrastructure/utility/format-config.utility");
		const module = await import("@infrastructure/config/css.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check that formatConfig was called with the CSS config
		expect(formatConfigModule.formatConfig).toHaveBeenCalled();
	});

	it("should configure CSS plugin language and files", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/css.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check that the plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("css");

		// Check file patterns
		expect(configs[0]).toHaveProperty("files", ["**/*.css"]);
		expect(configs[1]).toHaveProperty("files", ["**/*.css"]);

		// Check language property
		expect(configs[0]).toHaveProperty("language", "@elsikora/css/css");
	});

	it("should override specific CSS rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/css.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("css/no-invalid-at-rules");

		// Check that the rules are properly configured
		expect(configs[1].rules).toHaveProperty("@elsikora/css/no-invalid-at-rules", "off");
	});
});
