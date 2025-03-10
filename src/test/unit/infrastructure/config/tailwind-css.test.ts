import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utilities
vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

vi.mock("../../../../infrastructure/utility/format-rule-name.utility", () => ({
  formatRuleName: vi.fn((name) => `@elsikora/tailwindcss/${name.split("/")[1]}`),
}));

// Mock the eslint-plugin-tailwindcss
vi.mock("eslint-plugin-tailwindcss", () => ({
  default: {
    configs: {
      "flat/recommended": [
        {
          plugins: {
            tailwindcss: {
              rules: {
                "no-custom-classname": {
                  meta: { fixable: true },
                  create: () => ({}),
                },
                "classnames-order": {
                  meta: { fixable: true },
                  create: () => ({}),
                },
              },
            },
          },
          rules: {
            "tailwindcss/no-custom-classname": "error",
            "tailwindcss/classnames-order": "error",
          },
        },
      ],
    },
  },
}));

describe("TailwindCssConfig", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return an array of configs", async () => {
    const module = await import("../../../../infrastructure/config/tailwind-css.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(2);
  });

  it("should include the tailwind plugin and rules", async () => {
    const formatConfigModule = await import("../../../../infrastructure/utility/format-config.utility");
    const formatRuleNameModule = await import("../../../../infrastructure/utility/format-rule-name.utility");
    const module = await import("../../../../infrastructure/config/tailwind-css.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    // Check that formatConfig was called
    expect(formatConfigModule.formatConfig).toHaveBeenCalled();
    
    // Check that the first config includes the tailwind plugin
    expect(configs[0]).toHaveProperty("plugins");
    expect(configs[0].plugins).toHaveProperty("tailwindcss");
    
    // Check that the first config includes tailwind rules
    expect(configs[0]).toHaveProperty("rules");
    expect(configs[0].rules).toHaveProperty("tailwindcss/no-custom-classname");
    expect(configs[0].rules).toHaveProperty("tailwindcss/classnames-order");
    
    // Check that format rule name was called for the override
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("tailwindcss/no-custom-classname");
    
    // Check that the second config disables no-custom-classname rule
    expect(configs[1]).toHaveProperty("rules");
    expect(configs[1].rules).toHaveProperty("@elsikora/tailwindcss/no-custom-classname", "off");
  });
});