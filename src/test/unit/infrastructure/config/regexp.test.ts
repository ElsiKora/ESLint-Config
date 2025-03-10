import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("eslint-plugin-regexp", () => ({
  configs: {
    "flat/recommended": {
      plugins: {
        regexp: {
          rules: {
            "no-empty-group": { create: () => ({}) },
            "no-empty-alternative": { create: () => ({}) },
          },
        },
      },
      rules: {
        "regexp/no-empty-group": "error",
        "regexp/no-empty-alternative": "error",
      },
    },
  },
}));

// Mock utility functions
vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

describe("RegexpConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should return an array of configs", async () => {
    const module = await import("../../../../infrastructure/config/regexp.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(1);
  });

  it("should format the regexp config with proper file patterns", async () => {
    const formatConfigModule = await import("../../../../infrastructure/utility/format-config.utility");
    const module = await import("../../../../infrastructure/config/regexp.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    // Check that formatConfig was called with the regexp config
    expect(formatConfigModule.formatConfig).toHaveBeenCalled();
    
    // Check file patterns
    expect(configs[0]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
  });
});