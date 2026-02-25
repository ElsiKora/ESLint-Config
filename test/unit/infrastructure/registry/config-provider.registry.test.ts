import { describe, expect, it } from "vitest";
import { ConfigProviderRegistry } from "@infrastructure/registry";

describe("ConfigProviderRegistry", () => {
	it("should register providers for all config options", () => {
		const registry = new ConfigProviderRegistry();
		const providers = registry.getProviders();

		expect(providers.length).toBe(28);
		expect(providers.some((provider) => provider.id === "javascript")).toBe(true);
		expect(providers.some((provider) => provider.id === "typescript-strict")).toBe(true);
		expect(providers.some((provider) => provider.id === "tanstack")).toBe(true);
	});

	it("should expose dependency metadata for providers", () => {
		const registry = new ConfigProviderRegistry();
		const provider = registry.getProviders().find((candidate) => candidate.id === "javascript");

		expect(provider).toBeDefined();
		expect(provider?.requiredDependencies).toContain("@eslint/js");
		expect(provider?.requiredDependencies).toContain("globals");
	});
});
