import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("typescript-eslint", () => ({
	default: {
		config: vi.fn((config) => [config]),
		configs: {
			recommendedTypeChecked: [{ rules: { "@typescript-eslint/no-explicit-any": "warn" } }],
			strictTypeChecked: [{ rules: { "@typescript-eslint/no-unsafe-assignment": "error" } }],
			stylisticTypeChecked: [{ rules: { "@typescript-eslint/member-delimiter-style": "error" } }],
		},
		parser: {
			parse: () => ({}),
		},
		plugin: {
			rules: {
				"explicit-function-return-type": { create: () => ({}) },
				typedef: { create: () => ({}) },
			},
		},
	},
}));

vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace("@typescript-eslint", "@elsikora/typescript")),
}));

describe("TypeScriptStrictConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array with strict TypeScript config", async () => {
		const module = await import("@infrastructure/config/typescript-strict.ts");
		const loadConfig = module.default;
		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs).toHaveLength(1);
		expect(configs[0]).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
	});

	it("should enable strict-only rules", async () => {
		const module = await import("@infrastructure/config/typescript-strict.ts");
		const loadConfig = module.default;
		const configs: Array<Linter.Config> = loadConfig({});

		expect(configs[0].rules).toHaveProperty("@elsikora/typescript/explicit-function-return-type", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/typescript/explicit-module-boundary-types", "error");
		expect(configs[0].rules).toHaveProperty("@elsikora/typescript/typedef");
	});
});
