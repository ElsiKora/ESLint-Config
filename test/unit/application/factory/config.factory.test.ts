import type { IConfigOptions } from "@domain/interface";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigFactory } from "@application/factory";

vi.mock("@presentation/api", () => ({
	createConfigFromApi: vi.fn().mockResolvedValue([{ rules: {} }]),
}));

describe("ConfigFactory", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should expose option-to-module map", () => {
		expect(ConfigFactory.OPTIONS_TO_CONFIG_MAP.withJavascript).toBe("javascript");
		expect(ConfigFactory.OPTIONS_TO_CONFIG_MAP.withTypescriptStrict).toBe("typescript-strict");
		expect(ConfigFactory.OPTIONS_TO_CONFIG_MAP.withNoSecrets).toBe("no-secrets");
	});

	it("should delegate config creation to presentation API", async () => {
		const { createConfigFromApi } = await import("@presentation/api");
		const options: IConfigOptions = {
			withJavascript: true,
			withTypescript: true,
		};

		const result = await ConfigFactory.createConfig(options);

		expect(createConfigFromApi).toHaveBeenCalledWith(options);
		expect(result).toEqual([{ rules: {} }]);
	});
});
