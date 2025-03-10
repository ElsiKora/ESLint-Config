import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("eslint-plugin-storybook", () => ({
  default: {
    configs: {
      "flat/recommended": [
        {
          plugins: ["storybook"],
          rules: {
            "storybook/await-interactions": "error",
            "storybook/hierarchy-separator": "error",
          },
        },
      ],
    },
  },
}));

vi.mock("typescript-eslint", () => ({
  default: {
    parser: {
      name: "typescript-eslint-parser",
    },
  },
}));

vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

const MODULE_PATH = "../../../../infrastructure/config/storybook.ts";

describe("Storybook Config", () => {
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
    expect(configs.length).toBe(3);
  });

  it("should have the first config from the storybook plugin", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig();
    
    expect(configs[0].plugins).toContain("storybook");
    expect(configs[0].rules).toHaveProperty("storybook/await-interactions");
    expect(configs[0].rules).toHaveProperty("storybook/hierarchy-separator");
  });

  it("should configure TypeScript for TS stories files", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig();
    
    expect(configs[1].files).toEqual(["**/*.stories.@(ts|tsx)"]);
    expect(configs[1].languageOptions.parser.name).toBe("typescript-eslint-parser");
    expect(configs[1].languageOptions.parserOptions.projectService).toBe(true);
  });

  it("should configure JSX for JavaScript stories files", async () => {
    const module = await import(MODULE_PATH);
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig();
    
    expect(configs[2].files).toEqual(["**/*.stories.@(js|jsx|mjs|cjs)"]);
    expect(configs[2].languageOptions.parserOptions.ecmaFeatures.jsx).toBe(true);
    expect(configs[2].languageOptions.parserOptions.ecmaVersion).toBe("latest");
  });
});