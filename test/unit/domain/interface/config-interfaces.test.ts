import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";
import { IConfig, IConfigOptions } from "@domain/interface";
import { TConfigLoader, TConfigModule } from "@domain/type";

describe("Domain Interfaces and Types", () => {
	// Test IConfigOptions interface structure
	it("should have the correct structure for IConfigOptions", () => {
		const configOptions: IConfigOptions = {
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

		// Check if all properties are present
		expect(configOptions).toHaveProperty("withCheckFile");
		expect(configOptions).toHaveProperty("withCss");
		expect(configOptions).toHaveProperty("withFsd");
		expect(configOptions).toHaveProperty("withI18next");
		expect(configOptions).toHaveProperty("withJavascript");
		expect(configOptions).toHaveProperty("withJsDoc");
		expect(configOptions).toHaveProperty("withJson");
		expect(configOptions).toHaveProperty("withJsx");
		expect(configOptions).toHaveProperty("withMarkdown");
		expect(configOptions).toHaveProperty("withNest");
		expect(configOptions).toHaveProperty("withNext");
		expect(configOptions).toHaveProperty("withNode");
		expect(configOptions).toHaveProperty("withNoSecrets");
		expect(configOptions).toHaveProperty("withPackageJson");
		expect(configOptions).toHaveProperty("withPerfectionist");
		expect(configOptions).toHaveProperty("withPrettier");
		expect(configOptions).toHaveProperty("withReact");
		expect(configOptions).toHaveProperty("withRegexp");
		expect(configOptions).toHaveProperty("withSonar");
		expect(configOptions).toHaveProperty("withStorybook");
		expect(configOptions).toHaveProperty("withStylistic");
		expect(configOptions).toHaveProperty("withTailwindCss");
		expect(configOptions).toHaveProperty("withTanstack");
		expect(configOptions).toHaveProperty("withTypeorm");
		expect(configOptions).toHaveProperty("withTypescript");
		expect(configOptions).toHaveProperty("withUnicorn");
		expect(configOptions).toHaveProperty("withYaml");

		// Verify property types
		const propertyNames = Object.keys(configOptions);
		propertyNames.forEach((propertyName) => {
			expect(typeof configOptions[propertyName as keyof IConfigOptions]).toBe("boolean");
		});

		// Check an empty object is also valid
		const emptyOptions: IConfigOptions = {};
		expect(emptyOptions).toBeDefined();
	});

	// Test IConfig interface
	it("should have the correct structure for IConfig", async () => {
		const mockConfig: Array<Linter.Config> = [
			{
				rules: {
					"no-console": "error",
				},
			},
		];

		const config: IConfig = {
			getConfig: async () => mockConfig,
		};

		// Check if the getConfig method is present
		expect(config).toHaveProperty("getConfig");
		expect(typeof config.getConfig).toBe("function");

		// Check if the getConfig method returns the expected result
		const result = await config.getConfig();
		expect(result).toEqual(mockConfig);
	});

	// Test TConfigLoader type
	it("should have the correct structure for TConfigLoader", async () => {
		const mockConfigModule: TConfigModule = {
			default: () => [
				{
					rules: {
						"no-console": "error",
					},
				},
			],
		};

		const configLoader: TConfigLoader = async () => mockConfigModule;

		// Check if configLoader is a function
		expect(typeof configLoader).toBe("function");

		// Check if configLoader returns a Promise with the expected structure
		const result = await configLoader();
		expect(result).toHaveProperty("default");
		expect(typeof result.default).toBe("function");

		// Check if the default function returns the expected result
		const configResult = result.default();
		expect(Array.isArray(configResult)).toBe(true);
		expect(configResult[0]).toHaveProperty("rules");
	});

	// Test TConfigModule type
	it("should have the correct structure for TConfigModule", () => {
		const configModule: TConfigModule = {
			default: (options) => [
				{
					rules: {
						"no-console": options?.severity || "error",
					},
				},
			],
		};

		// Check if the default function is present
		expect(configModule).toHaveProperty("default");
		expect(typeof configModule.default).toBe("function");

		// Check if the default function returns the expected result with options
		const configWithOptions = configModule.default({ severity: "warn" });
		expect(Array.isArray(configWithOptions)).toBe(true);
		expect(configWithOptions[0].rules?.["no-console"]).toBe("warn");

		// Check if the default function returns the expected result without options
		const configWithoutOptions = configModule.default();
		expect(Array.isArray(configWithoutOptions)).toBe(true);
		expect(configWithoutOptions[0].rules?.["no-console"]).toBe("error");
	});
});
