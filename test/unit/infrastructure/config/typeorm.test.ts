import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-typeorm-typescript/recommended", () => ({
	default: {
		plugins: {
			"typeorm-typescript": {
				rules: {
					"enforce-column-types": { create: () => ({}) },
					"enforce-consistent-nullability": { create: () => ({}) },
					"enforce-relation-types": { create: () => ({}) },
				},
			},
		},
		rules: {
			"typeorm-typescript/enforce-column-types": "error",
		},
	},
}));

vi.mock("typescript-eslint", () => ({
	default: {
		config: vi.fn((config) => [config]),
		parser: {
			parse: () => ({}),
		},
	},
	config: vi.fn((config) => [config]),
	parser: {
		parse: () => ({}),
	},
}));

// Mock utility functions
vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name.replace(/^([\w-]+)\//, "@elsikora/$1/")),
}));

describe("TypeOrmConfig", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import("@infrastructure/config/typeorm.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(1);
	});

	it("should include TypeORM-specific rules", async () => {
		const formatRuleNameModule = await import("@infrastructure/utility/format-rule-name.utility");
		const module = await import("@infrastructure/config/typeorm.ts");
		const loadConfig = module.default;

		const configs = loadConfig({});

		// Check rule name formatting was called for TypeORM rules
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("typeorm-typescript/enforce-column-types");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("typeorm-typescript/enforce-consistent-nullability");
		expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("typeorm-typescript/enforce-relation-types");

		// Since we can't easily check the mock implementation details,
		// let's at least verify we get an array of configs back
		expect(Array.isArray(configs)).toBe(true);
	});
});
