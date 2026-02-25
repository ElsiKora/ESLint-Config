import type { IConfigOptions } from "@domain/interface";
import type { IConfigProvider, IConfigProviderRegistry } from "@domain/port";

import { describe, expect, it, vi } from "vitest";
import { ConfigMergeService, ConfigSelectionService } from "@application/service";
import { CreateEslintConfigUseCase } from "@application/use-case";
import { InvalidConfigOptionError } from "@domain/error";

function createProvider(optionKey: keyof IConfigOptions): IConfigProvider {
	return {
		id: "javascript",
		isEnabled: (options) => options[optionKey] === true,
		load: vi.fn().mockResolvedValue([{ rules: { "no-console": "warn" } }]),
		optionKey,
		requiredDependencies: [],
	};
}

describe("CreateEslintConfigUseCase", () => {
	it("should select enabled providers and merge their configs", async () => {
		const javascriptProvider = createProvider("withJavascript");
		const typescriptProvider = {
			...createProvider("withTypescript"),
			id: "typescript",
			load: vi.fn().mockResolvedValue([{ rules: { "@elsikora/typescript/array-type": "error" } }]),
		};

		const registry: IConfigProviderRegistry = {
			getProviders: () => [javascriptProvider, typescriptProvider],
		};

		const useCase = new CreateEslintConfigUseCase(new ConfigSelectionService(registry), new ConfigMergeService());
		const result = await useCase.execute({
			withJavascript: true,
			withTypescript: true,
		});

		expect(result).toHaveLength(2);
		expect(javascriptProvider.load).toHaveBeenCalledTimes(1);
		expect(typescriptProvider.load).toHaveBeenCalledTimes(1);
	});

	it("should fail fast for unknown config options", async () => {
		const registry: IConfigProviderRegistry = {
			getProviders: () => [],
		};

		const useCase = new CreateEslintConfigUseCase(new ConfigSelectionService(registry), new ConfigMergeService());
		// eslint-disable-next-line @elsikora/typescript/no-unsafe-argument
		await expect(useCase.execute({ withUnknownFlag: true } as IConfigOptions)).rejects.toBeInstanceOf(InvalidConfigOptionError);
	});
});
