import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace("jsx-a11y", "@elsikora/jsx")),
}));

describe("JsxConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/jsx.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should configure internal jsx compatibility plugin", async () => {
		const formatPluginNameModule = await import("@infrastructure/utility/format-plugin-name.utility");
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/jsx.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});
		expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("jsx-a11y");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("jsx-a11y/no-autofocus");
		expect(configs[0].plugins).toHaveProperty("@elsikora/jsx-a11y");
		expect(configs[0].rules).toHaveProperty("@elsikora/jsx/no-autofocus", "off");
	});
});
