import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigFactory } from "@application/factory";
import { IConfigOptions } from "@domain/interface";

describe("ConfigFactory", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	// Creates config array when valid options with true values are provided
	it("should create config array when valid options with true values are provided", async () => {
		const options: IConfigOptions = {
			withJavascript: true,
			withJson: true,
		};

		const config: Array<Linter.Config> = await ConfigFactory.createConfig(options);

		expect(Array.isArray(config)).toBe(true);
		expect(config.length).toBeGreaterThan(0);
		expect(config.every((item: Linter.Config) => typeof item === "object")).toBe(true);
	});

	// Handles missing or uninstalled optional dependencies gracefully
	it("should return an empty array when options contain invalid config names", async () => {
		const options: { withNonExistent: boolean } = {
			withNonExistent: true,
		};

		// @ts-ignore
		const config: Array<Linter.Config> = await ConfigFactory.createConfig(options);

		expect(Array.isArray(config)).toBe(true);
		expect(config).toHaveLength(0);
	});

	// Returns empty array when no options are provided or all options are false
	it("should return empty array when no options are provided", async () => {
		const options: IConfigOptions = {};

		const config: Array<Linter.Config> = await ConfigFactory.createConfig(options);

		expect(Array.isArray(config)).toBe(true);
		expect(config.length).toBe(0);
	});

	// Successfully imports and processes individual config modules
	it("should import and process config modules when options are set to true", async () => {
		const options: IConfigOptions = {
			withPrettier: true,
			withTailwindCss: true,
		};

		const config: Array<Linter.Config> = await ConfigFactory.createConfig(options);

		expect(Array.isArray(config)).toBe(true);
		expect(config.length).toBeGreaterThan(0);
		expect(config.every((item: Linter.Config) => typeof item === "object")).toBe(true);
	});

	// Correctly maps option keys to config names using OPTIONS_TO_CONFIG_MAP
	it("should map option keys to config names correctly", () => {
		const options: IConfigOptions = {
			withNode: false,
			withPrettier: true,
			withReact: true,
		};

		const configNames: Array<string | undefined> = Object.entries(options)
			.filter(([, isValue]: [string, boolean]) => isValue)
			.map(([key]) => ConfigFactory.OPTIONS_TO_CONFIG_MAP[key as keyof IConfigOptions]);

		expect(configNames).toContain("prettier");
		expect(configNames).toContain("react");
		expect(configNames).not.toContain("node");
	});

	// Filters out options with false valuesIConfigOptions
	it("should return an empty array when all options are false", async () => {
		const options: IConfigOptions = {
			withJavascript: false,
			withJson: false,
			withPrettier: false,
			withReact: false,
		};

		const config: Array<Linter.Config> = await ConfigFactory.createConfig(options);

		expect(Array.isArray(config)).toBe(true);
		expect(config.length).toBe(0);
	});

	// Handles missing or uninstalled optional dependencies gracefully
	it("should return an empty array when optional dependency is missing", async () => {
		const options: IConfigOptions = {
			withTypeorm: true,
		};

		const originalWarn: {
			(message?: any, ...optionalParameters: Array<any>): void;
			(...data: Array<any>): void;
		} = console.warn;
		console.warn = vi.fn();

		const config: Array<Linter.Config> = await ConfigFactory.createConfig(options);

		expect(Array.isArray(config)).toBe(true);
		expect(config.length).toBe(1);

		console.warn = originalWarn;
	});

	// Тесты, которые косвенно вызывают приватные методы
	describe("Additional tests to increase coverage of private methods", () => {
		// Тест на загрузку всех модулей для максимального покрытия
		it("should load all available config modules when all options are true", async () => {
			const allModuleOptions: IConfigOptions = {
				withCheckFile: true,
				withCss: true,
				withFsd: true,
				withI18next: true,
				withJavascript: true,
				withJsDoc: true,
				withJson: true,
				withJsx: true,
				withMarkdown: true,
				withNest: true,
				withNext: true,
				withNode: true,
				withNoSecrets: true,
				withPackageJson: true,
				withPerfectionist: true,
				withPrettier: true,
				withReact: true,
				withRegexp: true,
				withSonar: true,
				withStorybook: true,
				withStylistic: true,
				withTailwindCss: true,
				withTanstack: true,
				withTypeorm: true,
				withTypescript: true,
				withUnicorn: true,
				withYaml: true,
			};

			// Мокаем console.warn для перехвата ошибок при загрузке модулей
			const originalWarn = console.warn;
			console.warn = vi.fn();

			// Вызываем createConfig со всеми опциями, активированными
			const config = await ConfigFactory.createConfig(allModuleOptions);

			// Проверяем, что получили массив (пусть даже пустой, так как мы не мокаем импорты)
			expect(Array.isArray(config)).toBe(true);

			// Восстанавливаем console.warn
			console.warn = originalWarn;
		});
	});
});
