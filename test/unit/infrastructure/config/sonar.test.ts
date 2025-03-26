import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("eslint-plugin-sonarjs", () => ({
	default: {
		configs: {
			recommended: {
				plugins: ["sonarjs"],
				rules: {
					"sonarjs/no-identical-functions": "error",
					"sonarjs/no-duplicate-string": "error",
					"sonarjs/cognitive-complexity": "error",
				},
			},
		},
	},
}));

vi.mock("@infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name),
}));

const MODULE_PATH = "@infrastructure/config/sonar.ts";

describe("Sonar Config", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig();

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(2);
	});

	it("should include the correct plugins and files pattern in first config", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig();

		expect(configs[0].plugins).toContain("sonarjs");
		expect(configs[0].files).toEqual(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
	});

	it("should include the correct custom rules in second config", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig();

		expect(configs[1].rules).toHaveProperty("sonarjs/bool-param-default");
		expect(configs[1].rules["sonarjs/bool-param-default"]).toBe("error");

		expect(configs[1].rules).toHaveProperty("sonarjs/cognitive-complexity");
		expect(configs[1].rules["sonarjs/cognitive-complexity"]).toEqual(["error", 100]);

		expect(configs[1].rules).toHaveProperty("sonarjs/no-duplicate-string");
		expect(configs[1].rules["sonarjs/no-duplicate-string"]).toEqual(["error", { threshold: 10 }]);

		expect(configs[1].rules).toHaveProperty("sonarjs/no-empty-test-file");
		expect(configs[1].rules["sonarjs/no-empty-test-file"]).toBe("off");
	});
});
