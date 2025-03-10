import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("eslint-plugin-perfectionist", () => ({
  default: {
    configs: {
      "recommended-alphabetical": {
        plugins: ["perfectionist"],
        rules: {
          "perfectionist/sort-objects": "error",
          "perfectionist/sort-imports": "error",
        },
      },
    },
  },
}));

vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

vi.mock("../../../../infrastructure/utility/format-rule-name.utility", () => ({
  formatRuleName: vi.fn((name) => name),
}));

const MODULE_PATH = "../../../../infrastructure/config/perfectionist.ts";

describe("Perfectionist Config", () => {
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
    expect(configs.length).toBe(2);
  });

  it("should include the correct plugins and files pattern in first config", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(configs[0].plugins).toContain("perfectionist");
    expect(configs[0].files).toEqual(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
  });

  it("should include the correct file pattern in second config", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(configs[1].files).toEqual(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
  });

  it("should have different import sorting config when FSD is enabled", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const defaultConfigs = loadConfig({});
    const fsdConfigs = loadConfig({ withFsd: true });
    
    // Default config should have more groups
    expect(defaultConfigs[1].rules["perfectionist/sort-imports"][1].groups.length).toBeGreaterThan(
      fsdConfigs[1].rules["perfectionist/sort-imports"][1].groups.length
    );
    
    // FSD config should have internal custom groups for layer imports
    expect(fsdConfigs[1].rules["perfectionist/sort-imports"][1].customGroups.value.internal).toContain("^.*entities($|/.*$)");
    expect(fsdConfigs[1].rules["perfectionist/sort-imports"][1].customGroups.value.internal).toContain("^.*shared($|/.*$)");
    
    // Check newlinesBetween differences
    expect(defaultConfigs[1].rules["perfectionist/sort-imports"][1].newlinesBetween).toBe("always");
    expect(fsdConfigs[1].rules["perfectionist/sort-imports"][1].newlinesBetween).toBe("never");
  });
});