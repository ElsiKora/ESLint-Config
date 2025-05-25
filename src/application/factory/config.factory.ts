import type { IConfigOptions } from "@domain/interface";
import type { TConfigLoader, TConfigModule } from "@domain/type";
import type { Linter } from "eslint";

/**
 * Factory class for generating ESLint configurations based on provided options.
 * Maps configuration flags to their respective module loaders and dynamically imports
 * the required config modules. Handles loading failures gracefully by logging warnings
 * and returning empty configs.
 * @class ConfigFactory
 * @static
 */
export class ConfigFactory {
	static readonly OPTIONS_TO_CONFIG_MAP: Record<keyof IConfigOptions, string> = {
		withCheckFile: "check-file",
		withCss: "css",
		withFsd: "fsd",
		withI18next: "i18next",
		withJavascript: "javascript",
		withJsDoc: "jsdoc",
		withJson: "json",
		withJsx: "jsx",
		withMarkdown: "markdown",
		withNest: "nest",
		withNext: "next",
		withNode: "node",
		withNoSecrets: "no-secrets",
		withPackageJson: "package-json",
		withPerfectionist: "perfectionist",
		withPrettier: "prettier",
		withReact: "react",
		withRegexp: "regexp",
		withSonar: "sonar",
		withStorybook: "storybook",
		withStylistic: "stylistic",
		withTailwindCss: "tailwind-css",
		withTanstack: "tanstack",
		withTypeorm: "typeorm",
		withTypescript: "typescript",
		withTypescriptStrict: "typescript-strict",
		withUnicorn: "unicorn",
		withYaml: "yaml",
	};

	private static readonly CONFIG_MAPPING: Record<string, TConfigLoader> = {
		"check-file": () => import("../../infrastructure/config/check-file"),
		css: () => import("../../infrastructure/config/css"),
		fsd: () => import("../../infrastructure/config/fsd"),
		i18next: () => import("../../infrastructure/config/i18next"),
		javascript: () => import("../../infrastructure/config/javascript"),
		jsdoc: () => import("../../infrastructure/config/jsdoc"),
		json: () => import("../../infrastructure/config/json"),
		jsx: () => import("../../infrastructure/config/jsx"),
		markdown: () => import("../../infrastructure/config/markdown"),
		nest: () => import("../../infrastructure/config/nest"),
		next: () => import("../../infrastructure/config/next"),
		"no-secrets": () => import("../../infrastructure/config/no-secrets"),
		node: () => import("../../infrastructure/config/node"),
		"package-json": () => import("../../infrastructure/config/package-json"),
		perfectionist: () => import("../../infrastructure/config/perfectionist"),
		prettier: () => import("../../infrastructure/config/prettier"),
		react: () => import("../../infrastructure/config/react"),
		regexp: () => import("../../infrastructure/config/regexp"),
		sonar: () => import("../../infrastructure/config/sonar"),
		storybook: () => import("../../infrastructure/config/storybook"),
		stylistic: () => import("../../infrastructure/config/stylistic"),
		"tailwind-css": () => import("../../infrastructure/config/tailwind-css"),
		tanstack: () => import("../../infrastructure/config/tanstack"),
		typeorm: () => import("../../infrastructure/config/typeorm"),
		typescript: () => import("../../infrastructure/config/typescript"),
		"typescript-strict": () => import("../../infrastructure/config/typescript-strict"),
		unicorn: () => import("../../infrastructure/config/unicorn"),
		yaml: () => import("../../infrastructure/config/yaml"),
	};

	private static currentOptions: IConfigOptions | null = null;

	/**
	 * Creates ESLint configurations based on the provided options.
	 *
	 * This function processes the configuration options and dynamically imports
	 * the required ESLint configuration modules based on enabled features.
	 * It filters out disabled options and loads only the necessary configurations.
	 * @param {IConfigOptions} options - Configuration options that determine which ESLint rules to include
	 * @returns {Promise<Array<Linter.Config>>} A promise that resolves to an array of ESLint configurations
	 * @example
	 * // Basic usage with typescript and react
	 * const config = await ConfigFactory.createConfig({
	 *   withTypescript: true,
	 *   withReact: true
	 * });
	 * @example
	 * // Full-featured configuration for a modern web application
	 * const fullConfig = await ConfigFactory.createConfig({
	 *   withTypescript: true,
	 *   withReact: true,
	 *   withEslint: true,
	 *   withPrettier: true,
	 *   withJsDoc: true,
	 *   withStylistic: true
	 * });
	 */
	static async createConfig(options: IConfigOptions): Promise<Array<Linter.Config>> {
		this.currentOptions = options;

		const configPromises: Array<Promise<Array<Linter.Config>>> = Object.entries(options)
			.filter(([key, value]: [string, unknown]) => value === true && this.OPTIONS_TO_CONFIG_MAP[key as keyof IConfigOptions])
			// @ts-ignore
			.map(([key]: unknown) => {
				const configName: string | undefined = this.OPTIONS_TO_CONFIG_MAP[key as keyof IConfigOptions];

				return this.loadConfig(configName);
			});

		const config: Array<Awaited<Array<Linter.Config>>> = await Promise.all(configPromises);

		this.currentOptions = null;

		return config.flat();
	}

	/**
	 * Loads a specific ESLint configuration module by name
	 * @param {string} name - The name of the configuration module to load
	 * @returns {Promise<Array<Linter.Config>>} A promise that resolves to an array of ESLint configurations
	 * @private
	 */
	private static async loadConfig(name: string): Promise<Array<Linter.Config>> {
		try {
			// @ts-ignore
			const module: TConfigModule = await this.CONFIG_MAPPING[name]();

			return module.default(this.currentOptions);
		} catch (error) {
			console.warn(`Optional dependency for ${name} config is not installed:`, error);

			return [];
		}
	}
}
