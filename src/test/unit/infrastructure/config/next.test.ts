import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@eslint/compat", () => ({
  fixupPluginRules: vi.fn((plugin) => plugin),
}));

vi.mock("@next/eslint-plugin-next", () => ({
  default: {
    rules: {
      "google-font-display": { create: () => ({}) },
      "no-img-element": { create: () => ({}) },
      "no-typos": { create: () => ({}) },
    },
  },
}));

vi.mock("typescript-eslint", () => ({
  default: {
    parser: {
      parse: () => ({}),
    },
  },
  parser: {
    parse: () => ({}),
  },
}));

// Mock utility functions
vi.mock("../../../../infrastructure/utility/format-plugin-name.utility", () => ({
  formatPluginName: vi.fn((name) => `@elsikora/${name.replace('@', '')}`),
}));

vi.mock("../../../../infrastructure/utility/format-rule-name.utility", () => ({
  formatRuleName: vi.fn((name) => name.replace("@next/next", "@elsikora/next")),
}));

describe("NextConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should return an array of configs", async () => {
    const module = await import("../../../../infrastructure/config/next.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(3);
  });

  it("should include JS/JSX and TS/TSX file configurations", async () => {
    const module = await import("../../../../infrastructure/config/next.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    // Check JS/JSX config
    expect(configs[0]).toHaveProperty("files", ["**/*.js", "**/*.jsx"]);
    expect(configs[0].languageOptions?.parserOptions).toHaveProperty("ecmaFeatures.jsx", true);
    expect(configs[0].languageOptions?.parserOptions).toHaveProperty("ecmaVersion", "latest");
    
    // Check TS/TSX config
    expect(configs[1]).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
    expect(configs[1].languageOptions).toHaveProperty("parser");
    expect(configs[1].languageOptions?.parserOptions).toHaveProperty("projectService", true);
  });

  it("should properly configure Next.js plugin", async () => {
    const formatPluginNameModule = await import("../../../../infrastructure/utility/format-plugin-name.utility");
    const formatRuleNameModule = await import("../../../../infrastructure/utility/format-rule-name.utility");
    const fixupCompat = await import("@eslint/compat");
    const module = await import("../../../../infrastructure/config/next.ts");
    const loadConfig = module.default;
    
    loadConfig({});
    
    // Check plugin name formatting was called
    expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("@next/next");
    
    // Check ESLint compatibility function was called
    expect(fixupCompat.fixupPluginRules).toHaveBeenCalled();
    
    // Check rule name formatting was called
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@next/next/google-font-display");
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@next/next/no-img-element");
  });

  it("should include Next.js specific rules with proper severity", async () => {
    const module = await import("../../../../infrastructure/config/next.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    // Check specific rules are present with expected severities
    expect(configs[2].rules).toHaveProperty("@elsikora/next/google-font-display", "warn");
    expect(configs[2].rules).toHaveProperty("@elsikora/next/inline-script-id", "error");
    expect(configs[2].rules).toHaveProperty("@elsikora/next/no-assign-module-variable", "error");
    expect(configs[2].rules).toHaveProperty("@elsikora/next/no-img-element", "warn");
    
    // Check if third config applies to both JS/JSX and TS/TSX files
    expect(configs[2]).toHaveProperty("files", ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]);
  });
});