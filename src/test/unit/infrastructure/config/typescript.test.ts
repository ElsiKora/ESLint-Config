import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock typescript-eslint
vi.mock("typescript-eslint", () => ({
  default: {
    config: vi.fn((config) => [config]),
    configs: {
      recommendedTypeChecked: [{ rules: { "@typescript-eslint/no-explicit-any": "warn" } }],
      strictTypeChecked: [{ rules: { "@typescript-eslint/no-unsafe-assignment": "error" } }],
      stylisticTypeChecked: [{ rules: { "@typescript-eslint/member-delimiter-style": "error" } }],
    },
    parser: {
      parse: () => ({}),
    },
    plugin: {
      rules: {
        "naming-convention": { create: () => ({}) },
        "explicit-function-return-type": { create: () => ({}) },
      },
    },
  },
  config: vi.fn((config) => [config]),
  configs: {
    recommendedTypeChecked: [{ rules: { "@typescript-eslint/no-explicit-any": "warn" } }],
    strictTypeChecked: [{ rules: { "@typescript-eslint/no-unsafe-assignment": "error" } }],
    stylisticTypeChecked: [{ rules: { "@typescript-eslint/member-delimiter-style": "error" } }],
  },
  parser: {
    parse: () => ({}),
  },
  plugin: {
    rules: {
      "naming-convention": { create: () => ({}) },
      "explicit-function-return-type": { create: () => ({}) },
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

vi.mock("../../../../infrastructure/utility/format-rule-name.utility", () => ({
  formatRuleName: vi.fn((name) => name.replace("@typescript-eslint", "@elsikora/typescript")),
}));

describe("TypeScriptConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should return an array of configs", async () => {
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(1);
  });

  it("should include TypeScript configuration with appropriate file patterns", async () => {
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    const configs = loadConfig({});
    
    // Since we're mocking the return value, we just verify the file pattern is in the config
    expect(configs.length).toBeGreaterThan(0);
    expect(configs[0]).toHaveProperty("files", ["**/*.ts", "**/*.tsx"]);
    expect(configs[0].languageOptions).toHaveProperty("parser");
  });

  it("should properly extend TypeScript ESLint recommended configs", async () => {
    const formatConfigModule = await import("../../../../infrastructure/utility/format-config.utility");
    const tseslintModule = await import("typescript-eslint");
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    loadConfig({});
    
    // Check that formatConfig was called with TypeScript ESLint recommended configs
    expect(formatConfigModule.formatConfig).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ rules: { "@typescript-eslint/no-explicit-any": "warn" } }),
        expect.objectContaining({ rules: { "@typescript-eslint/no-unsafe-assignment": "error" } }),
        expect.objectContaining({ rules: { "@typescript-eslint/member-delimiter-style": "error" } }),
      ])
    );
  });

  it("should configure TypeScript plugin with properly formatted rule names", async () => {
    const formatPluginNameModule = await import("../../../../infrastructure/utility/format-plugin-name.utility");
    const formatRuleNameModule = await import("../../../../infrastructure/utility/format-rule-name.utility");
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    loadConfig({});
    
    // Check that plugin name formatting was called
    expect(formatPluginNameModule.formatPluginName).toHaveBeenCalledWith("typescript");
    
    // Check that rule name formatting was called for TypeScript rules
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@typescript-eslint/adjacent-overload-signatures");
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@typescript-eslint/array-type");
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@typescript-eslint/naming-convention");
  });

  it("should properly format rule names in configuration", async () => {
    const formatRuleNameModule = await import("../../../../infrastructure/utility/format-rule-name.utility");
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    loadConfig({});
    
    // Check rule name formatting calls
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@typescript-eslint/array-type");
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@typescript-eslint/naming-convention");
    expect(formatRuleNameModule.formatRuleName).toHaveBeenCalledWith("@typescript-eslint/explicit-function-return-type");
  });
  
  it("should disable no-deprecated rule when withUnicorn is true", async () => {
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    const configs = loadConfig({ withUnicorn: true });
    
    // Find the rule in the config
    const noDeprecatedRule = configs[0].rules["@elsikora/typescript/no-deprecated"];
    expect(noDeprecatedRule).toBe("off");
  });
  
  it("should enable no-deprecated rule when withUnicorn is false", async () => {
    const module = await import("../../../../infrastructure/config/typescript.ts");
    const loadConfig = module.default;
    
    const configs = loadConfig({ withUnicorn: false });
    
    // Find the rule in the config
    const noDeprecatedRule = configs[0].rules["@elsikora/typescript/no-deprecated"];
    expect(noDeprecatedRule).toBe("error");
  });
});