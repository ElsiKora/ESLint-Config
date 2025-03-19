import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utility
vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
	formatConfig: vi.fn((configs) => configs),
}));

describe("JsonConfig", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should return an array of configs", async () => {
		const module = await import("../../../../infrastructure/config/json.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		expect(Array.isArray(configs)).toBe(true);
		expect(configs.length).toBe(5);
	});

	it("should include the recommended JSON config", async () => {
		const formatConfigModule = await import("../../../../infrastructure/utility/format-config.utility");
		const module = await import("../../../../infrastructure/config/json.ts");
		const loadConfig = module.default;

		const configs: Array<Linter.Config> = loadConfig({});

		// Check that formatConfig was called
		expect(formatConfigModule.formatConfig).toHaveBeenCalled();

		// Check that the config includes rules from the JSON plugin
		expect(configs[2]).toHaveProperty("rules");
		expect(configs[2].rules).toHaveProperty("jsonc/no-bigint-literals");
	});
});
