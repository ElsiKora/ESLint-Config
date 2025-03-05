import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigFactory } from "../../../../application/factory/config.factory";
describe("ConfigFactory", () => {
    beforeEach(() => {
        vi.resetModules();
    });
    // Creates config array when valid options with true values are provided
    it("should create config array when valid options with true values are provided", async () => {
        const options = {
            withJavascript: true,
            withJson: true,
        };
        const config = await ConfigFactory.createConfig(options);
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
        expect(config.every((item) => typeof item === "object")).toBe(true);
    });
    // Handles missing or uninstalled optional dependencies gracefully
    it("should return an empty array when options contain invalid config names", async () => {
        const options = {
            withNonExistent: true,
        };
        // @ts-ignore
        const config = await ConfigFactory.createConfig(options);
        expect(Array.isArray(config)).toBe(true);
        expect(config).toHaveLength(0);
    });
    // Returns empty array when no options are provided or all options are false
    it("should return empty array when no options are provided", async () => {
        const options = {};
        const config = await ConfigFactory.createConfig(options);
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBe(0);
    });
    // Successfully imports and processes individual config modules
    it("should import and process config modules when options are set to true", async () => {
        const options = {
            withPrettier: true,
            withTailwindCss: true,
        };
        const config = await ConfigFactory.createConfig(options);
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
        expect(config.every((item) => typeof item === "object")).toBe(true);
    });
    // Correctly maps option keys to config names using OPTIONS_TO_CONFIG_MAP
    it("should map option keys to config names correctly", () => {
        const options = {
            withNode: false,
            withPrettier: true,
            withReact: true,
        };
        const configNames = Object.entries(options)
            .filter(([, isValue]) => isValue)
            .map(([key]) => ConfigFactory.OPTIONS_TO_CONFIG_MAP[key]);
        expect(configNames).toContain("prettier");
        expect(configNames).toContain("react");
        expect(configNames).not.toContain("node");
    });
    // Filters out options with false valuesIConfigOptions
    it("should return an empty array when all options are false", async () => {
        const options = {
            withJavascript: false,
            withJson: false,
            withPrettier: false,
            withReact: false,
        };
        const config = await ConfigFactory.createConfig(options);
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBe(0);
    });
    // Handles missing or uninstalled optional dependencies gracefully
    it("should return an empty array when optional dependency is missing", async () => {
        const options = {
            withTailwindCss: true,
        };
        const originalWarn = console.warn;
        console.warn = vi.fn();
        const config = await ConfigFactory.createConfig(options);
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBe(0);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Optional dependency for tailwind-css config is not installed:"), expect.any(Error));
        console.warn = originalWarn;
    });
});
