import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("eslint-plugin-unicorn", () => ({
  default: {
    configs: {
      recommended: {
        plugins: ["unicorn"],
        rules: {
          "unicorn/prefer-node-protocol": "error",
          "unicorn/filename-case": "error",
          "unicorn/no-null": "error",
          "unicorn/prefer-top-level-await": "error",
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

const MODULE_PATH = "../../../../infrastructure/config/unicorn.ts";

describe("Unicorn Config", () => {
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

  it("should include the unicorn plugin with recommended config", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig();
    
    expect(configs[0].plugins).toContain("unicorn");
    expect(configs[0].files).toEqual(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
  });

  it("should override specific rules in second config", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig();
    
    expect(configs[1].files).toEqual(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
    
    // Check that specific rules are turned off
    expect(configs[1].rules).toHaveProperty("unicorn/filename-case");
    expect(configs[1].rules["unicorn/filename-case"]).toBe("off");
    
    expect(configs[1].rules).toHaveProperty("unicorn/no-null");
    expect(configs[1].rules["unicorn/no-null"]).toBe("off");
    
    expect(configs[1].rules).toHaveProperty("unicorn/prefer-top-level-await");
    expect(configs[1].rules["unicorn/prefer-top-level-await"]).toBe("off");
  });
});