import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-check-file", () => ({
	default: {
		rules: {
			"filename-blocklist": { create: () => ({}) },
			"filename-naming-convention": { create: () => ({}) },
			"folder-naming-convention": { create: () => ({}) },
			"folder-match-with-fex": { create: () => ({}) },
			"no-index": { create: () => ({}) },
		},
	},
}));

// Mock utility functions
vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace(/^([\w-]+)\//, "@elsikora/$1/")),
}));

describe("CheckFileConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/check-file.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should configure the check-file plugin", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const module = await import("@infrastructure/config/check-file.ts");
		const loadConfig = module.default;

		loadConfig({});

		// Check plugin name formatting was called
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("check-file");
	});

	it("should include file naming convention rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/check-file.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check rule name formatting was called for key rules
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("check-file/filename-blocklist");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("check-file/filename-naming-convention");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("check-file/folder-naming-convention");

		// Check that rules are properly configured
		const config = configs[0];
		expect(config).toHaveProperty("files", ["src/**/*"]);

		// Check that rules are arrays with severity and options
		const blocklistRule = config.rules?.["@elsikora/check-file/filename-blocklist"];
		expect(Array.isArray(blocklistRule)).toBe(true);
		expect(blocklistRule[0]).toBe("error");

		const namingRule = config.rules?.["@elsikora/check-file/filename-naming-convention"];
		expect(Array.isArray(namingRule)).toBe(true);
		expect(namingRule[0]).toBe("error");
	});
});
