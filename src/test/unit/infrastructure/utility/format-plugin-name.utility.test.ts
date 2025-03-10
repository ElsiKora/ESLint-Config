import { beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_PATH: string = "../../../../infrastructure/constant/utility/plugin-map.constant";

describe("FormatPluginNameUtility", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	// Basic plugin name transformation
	it("should transform simple plugin names", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"plugin-a": "renamed-a",
				"plugin-b": "renamed-b",
			},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("plugin-a")).toBe("renamed-a");
		expect(formatPluginName("plugin-b")).toBe("renamed-b");
	});

	// Handle scoped package names
	it("should correctly handle scoped plugin names", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@scope/plugin": "scoped",
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("@typescript-eslint")).toBe("typescript");
		expect(formatPluginName("@scope/plugin")).toBe("scoped");
	});

	// Plugins not in the plugin map
	it("should return unchanged plugin names when not found in plugin map", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("custom-plugin")).toBe("custom-plugin");
		expect(formatPluginName("eslint")).toBe("eslint");
	});

	// Handle longer plugin names first
	it("should prioritize longer plugin names in transformation", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
				"@typescript-eslint/special": "typescript-special",
			},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("@typescript-eslint/special")).toBe("typescript-special");
		expect(formatPluginName("@typescript-eslint")).toBe("typescript");
	});

	// Empty plugin map
	it("should handle empty plugin map", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("@typescript-eslint")).toBe("@typescript-eslint");
		expect(formatPluginName("import")).toBe("import");
	});

	// Special characters in plugin names
	it("should handle special characters in plugin names", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@special-chars": "special",
			},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("@special-chars")).toBe("special");
	});

	// Test FSD plugin transformation
	it("should transform FSD plugin name", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@conarti/feature-sliced": "@elsikora/fsd",
			},
		}));

		const module: {
			formatPluginName(pluginName: string): string;
		} = await import("../../../../infrastructure/utility/format-plugin-name.utility");
		const formatPluginName: (pluginName: string) => string = module.formatPluginName.bind(module);

		expect(formatPluginName("@conarti/feature-sliced")).toBe("@elsikora/fsd");
	});
});