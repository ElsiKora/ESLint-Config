import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("eslint-plugin-package-json/configs/recommended", () => ({
  default: {
    plugins: ["package-json"],
    rules: {
      "package-json/sort-collections": "error",
      "package-json/order-properties": "error",
    },
  },
}));

vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

vi.mock("../../../../infrastructure/utility/format-rule-name.utility", () => ({
  formatRuleName: vi.fn((name) => name),
}));

const MODULE_PATH = "../../../../infrastructure/config/package-json.ts";

describe("PackageJson Config", () => {
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
    expect(configs.length).toBe(1);
  });

  it("should include the correct plugins", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(configs[0].plugins).toContain("package-json");
  });

  it("should include the correct rules", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(configs[0].rules).toHaveProperty("package-json/sort-collections");
    expect(configs[0].rules).toHaveProperty("package-json/order-properties");
    expect(configs[0].rules["package-json/order-properties"]).toBe("error");
  });

  it("should disable order-properties rule when perfectionist is enabled", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({ withPerfectionist: true });
    
    expect(configs[0].rules["package-json/order-properties"]).toBe("off");
  });
});