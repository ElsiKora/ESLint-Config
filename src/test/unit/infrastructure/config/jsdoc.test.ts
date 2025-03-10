import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-jsdoc", () => ({
  default: {
    configs: {
      "flat/recommended": {
        plugins: {
          jsdoc: {
            rules: {
              "check-param-names": { create: () => ({}) },
              "require-jsdoc": { create: () => ({}) },
            },
          },
        },
        rules: {
          "jsdoc/check-param-names": "error",
          "jsdoc/require-jsdoc": "warn",
        },
      },
    },
    rules: {
      "check-param-names": { create: () => ({}) },
      "require-jsdoc": { create: () => ({}) },
    },
  },
}));

// Mock utility functions
vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

vi.mock("../../../../infrastructure/utility/format-plugin-name.utility", () => ({
  formatPluginName: vi.fn((name) => `@elsikora/${name}`),
}));

describe("JsdocConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should return an array of configs", async () => {
    const module = await import("../../../../infrastructure/config/jsdoc.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(2);
  });

  it("should format the JSDoc config", async () => {
    const formatConfigModule = await import("../../../../infrastructure/utility/format-config.utility");
    const module = await import("../../../../infrastructure/config/jsdoc.ts");
    const loadConfig = module.default;
    
    loadConfig({});
    
    // Check that formatConfig was called with the JSDoc config
    expect(formatConfigModule.formatConfig).toHaveBeenCalled();
  });

  it("should configure JSDoc plugin with correct file patterns", async () => {
    const formatPluginNameModule = await import("../../../../infrastructure/utility/format-plugin-name.utility");
    const module = await import("../../../../infrastructure/config/jsdoc.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    // Check that the plugin name formatting was called
    expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("jsdoc");
    
    // Check file patterns for both configs
    expect(configs[0]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
    expect(configs[1]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
    
    // Check that the second config includes the plugin
    expect(configs[1].plugins).toHaveProperty("@elsikora/jsdoc");
  });
});