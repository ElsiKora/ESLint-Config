import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@tanstack/eslint-plugin-query", () => ({
	default: {
		name: "tanstack-query-plugin",
	},
}));

vi.mock("@tanstack/eslint-plugin-router", () => ({
	default: {
		name: "tanstack-router-plugin",
	},
}));

vi.mock("typescript-eslint", () => ({
	default: {
		parser: {
			name: "typescript-eslint-parser",
		},
	},
}));

vi.mock("@infrastructure/utility/format-plugin-name.utility", () => ({
	formatPluginName: vi.fn((name) => name),
}));

vi.mock("@infrastructure/utility/format-rule-name.utility", () => ({
	formatRuleName: vi.fn((name) => name),
}));

const MODULE_PATH = "@infrastructure/config/tanstack.ts";

describe("Tanstack Config", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return an array of configs", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(4);
	});

	it("should configure tanstack/query plugin with rules", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});
		const queryConfig = configs[0];

		expect(queryConfig.plugins).toHaveProperty("@tanstack/query");
		expect(queryConfig.plugins["@tanstack/query"].name).toBe("tanstack-query-plugin");

		// Check all the query rules are configured
		expect(queryConfig.rules).toHaveProperty("@tanstack/query/exhaustive-deps");
		expect(queryConfig.rules["@tanstack/query/exhaustive-deps"]).toBe("error");

		expect(queryConfig.rules).toHaveProperty("@tanstack/query/infinite-query-property-order");
		expect(queryConfig.rules["@tanstack/query/infinite-query-property-order"]).toBe("error");

		expect(queryConfig.rules).toHaveProperty("@tanstack/query/no-rest-destructuring");
		expect(queryConfig.rules["@tanstack/query/no-rest-destructuring"]).toBe("error");

		expect(queryConfig.rules).toHaveProperty("@tanstack/query/no-unstable-deps");
		expect(queryConfig.rules["@tanstack/query/no-unstable-deps"]).toBe("error");

		expect(queryConfig.rules).toHaveProperty("@tanstack/query/stable-query-client");
		expect(queryConfig.rules["@tanstack/query/stable-query-client"]).toBe("error");
	});

	it("should configure tanstack/router plugin with rules", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});
		const routerConfig = configs[1];

		expect(routerConfig.plugins).toHaveProperty("@tanstack/router");
		expect(routerConfig.plugins["@tanstack/router"].name).toBe("tanstack-router-plugin");

		// Check the router rule is configured
		expect(routerConfig.rules).toHaveProperty("@tanstack/router/create-route-property-order");
		expect(routerConfig.rules["@tanstack/router/create-route-property-order"]).toBe("error");
	});

	it("should configure TypeScript language options for TS files", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});
		const tsConfig = configs[2];

		expect(tsConfig.files).toEqual(["**/*.ts", "**/*.tsx"]);
		expect(tsConfig.languageOptions.parser.name).toBe("typescript-eslint-parser");
		expect(tsConfig.languageOptions.parserOptions.projectService).toBe(true);
	});

	it("should configure JavaScript language options for JS files", async () => {
		const module = await import(MODULE_PATH);
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});
		const jsConfig = configs[3];

		expect(jsConfig.files).toEqual(["**/*.js", "**/*.jsx"]);
		expect(jsConfig.languageOptions.parserOptions.ecmaFeatures.jsx).toBe(true);
		expect(jsConfig.languageOptions.parserOptions.ecmaVersion).toBe("latest");
	});
});
