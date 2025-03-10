import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Direct import from index.ts
import * as indexModule from "../../index";
import { ConfigFactory } from "../../application/factory/config.factory";

// Mock ConfigFactory
vi.mock("../../application/factory/config.factory", () => ({
  ConfigFactory: {
    createConfig: vi.fn().mockResolvedValue(["mocked config"]),
  },
}));

describe("Root Index", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should export createConfig function", () => {
    expect(typeof indexModule.createConfig).toBe("function");
  });

  it("should export createConfig as default export", () => {
    expect(typeof indexModule.default).toBe("function");
    expect(indexModule.default).toBe(indexModule.createConfig);
  });

  it("should call ConfigFactory.createConfig with provided options", async () => {
    const options = { withReact: true };
    await indexModule.createConfig(options);
    
    expect(ConfigFactory.createConfig).toHaveBeenCalledWith(options);
  });

  it("should return the result from ConfigFactory.createConfig", async () => {
    const result = await indexModule.createConfig({});
    
    expect(result).toEqual(["mocked config"]);
  });
});