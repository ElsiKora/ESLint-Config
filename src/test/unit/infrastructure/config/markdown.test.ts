import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the format utility
vi.mock("../../../../infrastructure/utility/format-config.utility", () => ({
  formatConfig: vi.fn((configs) => configs),
}));

// Mock the markdown plugin
vi.mock("@elsikora/eslint-plugin-markdown", () => ({
  default: {
    configs: {
      recommended: [
        {
          plugins: {
            markdown: {
              rules: {
                "fenced-code-language": {
                  meta: { fixable: true },
                  create: () => ({}),
                },
              },
            },
          },
          rules: {
            "markdown/fenced-code-language": "error",
          },
        },
      ],
    },
  },
}));

describe("MarkdownConfig", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return an array of configs", async () => {
    const module = await import("../../../../infrastructure/config/markdown.ts");
    const loadConfig = module.default;
    
    const configs: Array<Linter.Config> = loadConfig({});
    
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(1);
  });

  it("should format the markdown recommended config", async () => {
    const formatConfigModule = await import("../../../../infrastructure/utility/format-config.utility");
    const module = await import("../../../../infrastructure/config/markdown.ts");
    const loadConfig = module.default;
    
    loadConfig({});
    
    // Check that formatConfig was called with the markdown recommended config
    expect(formatConfigModule.formatConfig).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          plugins: expect.objectContaining({
            markdown: expect.any(Object),
          }),
          rules: expect.objectContaining({
            "markdown/fenced-code-language": "error",
          }),
        }),
      ])
    );
  });
});