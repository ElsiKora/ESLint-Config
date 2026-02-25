import type { IConfigOptions } from "@domain/interface";
import type { TConfigLoader, TConfigModule } from "@domain/type";
import type { TConfigModuleId } from "@domain/model";
import type { IConfigProvider, IConfigProviderRegistry } from "@domain/port";
import type { Linter } from "eslint";

import { ConfigProviderLoadError } from "@domain/error";
import { CONFIG_OPTION_MODULE_MAP } from "@domain/model";

type TProviderDefinition = {
	id: TConfigModuleId;
	optionKey: keyof IConfigOptions;
	requiredDependencies: Array<string>;
};

class DynamicConfigProvider implements IConfigProvider {
	constructor(
		readonly id: TConfigModuleId,
		readonly optionKey: keyof IConfigOptions,
		readonly requiredDependencies: Array<string>,
		private readonly loader: TConfigLoader,
	) {}

	isEnabled(options: IConfigOptions): boolean {
		return options[this.optionKey] === true;
	}

	async load(options: IConfigOptions): Promise<Array<Linter.Config>> {
		try {
			const module: TConfigModule = await this.loader();
			return module.default(options);
		} catch (error) {
			throw new ConfigProviderLoadError(this.id, { cause: error, requiredDependencies: this.requiredDependencies });
		}
	}
}

export class ConfigProviderRegistry implements IConfigProviderRegistry {
	private static readonly LOADER_BY_MODULE: Record<TConfigModuleId, TConfigLoader> = {
		"check-file": () => import("../config/check-file"),
		css: () => import("../config/css"),
		fsd: () => import("../config/fsd"),
		i18next: () => import("../config/i18next"),
		javascript: () => import("../config/javascript"),
		jsdoc: () => import("../config/jsdoc"),
		json: () => import("../config/json"),
		jsx: () => import("../config/jsx"),
		markdown: () => import("../config/markdown"),
		nest: () => import("../config/nest"),
		next: () => import("../config/next"),
		node: () => import("../config/node"),
		"no-secrets": () => import("../config/no-secrets"),
		"package-json": () => import("../config/package-json"),
		perfectionist: () => import("../config/perfectionist"),
		prettier: () => import("../config/prettier"),
		react: () => import("../config/react"),
		regexp: () => import("../config/regexp"),
		sonar: () => import("../config/sonar"),
		storybook: () => import("../config/storybook"),
		stylistic: () => import("../config/stylistic"),
		"tailwind-css": () => import("../config/tailwind-css"),
		tanstack: () => import("../config/tanstack"),
		typeorm: () => import("../config/typeorm"),
		typescript: () => import("../config/typescript"),
		"typescript-strict": () => import("../config/typescript-strict"),
		unicorn: () => import("../config/unicorn"),
		yaml: () => import("../config/yaml"),
	};

	private static readonly REQUIRED_DEPENDENCIES_BY_MODULE: Record<TConfigModuleId, Array<string>> = {
		"check-file": ["eslint-plugin-check-file"],
		css: ["@elsikora/eslint-plugin-css"],
		fsd: [],
		i18next: ["eslint-plugin-i18next"],
		javascript: ["@eslint/js", "globals"],
		jsdoc: ["eslint-plugin-jsdoc"],
		json: ["eslint-plugin-jsonc"],
		jsx: [],
		markdown: ["@elsikora/eslint-plugin-markdown"],
		nest: ["@elsikora/eslint-plugin-nestjs-typed", "typescript-eslint"],
		next: ["@next/eslint-plugin-next", "@eslint/compat", "typescript-eslint"],
		node: ["eslint-plugin-n"],
		"no-secrets": ["eslint-plugin-no-secrets"],
		"package-json": ["eslint-plugin-package-json"],
		perfectionist: ["eslint-plugin-perfectionist"],
		prettier: ["eslint-plugin-prettier", "eslint-config-prettier"],
		react: ["@eslint-react/eslint-plugin", "typescript-eslint"],
		regexp: ["eslint-plugin-regexp"],
		sonar: ["eslint-plugin-sonarjs"],
		storybook: ["eslint-plugin-storybook", "typescript-eslint"],
		stylistic: ["@stylistic/eslint-plugin"],
		"tailwind-css": ["eslint-plugin-tailwindcss"],
		tanstack: ["@tanstack/eslint-plugin-router", "typescript-eslint"],
		typeorm: ["eslint-plugin-typeorm-typescript", "typescript-eslint"],
		typescript: ["typescript-eslint"],
		"typescript-strict": ["typescript-eslint"],
		unicorn: ["eslint-plugin-unicorn"],
		yaml: ["eslint-plugin-yml"],
	};

	private readonly providers: Array<IConfigProvider> = this.createProviders();

	getProviders(): Array<IConfigProvider> {
		return this.providers;
	}

	private createProviders(): Array<IConfigProvider> {
		const providerDefinitions: Array<TProviderDefinition> = Object.entries(CONFIG_OPTION_MODULE_MAP).map(([optionKey, moduleId]) => ({
			id: moduleId,
			optionKey: optionKey as keyof IConfigOptions,
			requiredDependencies: ConfigProviderRegistry.REQUIRED_DEPENDENCIES_BY_MODULE[moduleId],
		}));

		return providerDefinitions.map(
			(definition) =>
				new DynamicConfigProvider(definition.id, definition.optionKey, definition.requiredDependencies, ConfigProviderRegistry.LOADER_BY_MODULE[definition.id]),
		);
	}
}
