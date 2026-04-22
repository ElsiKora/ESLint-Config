import type { ESLint, Linter } from "eslint";

import { extractSubPlugin, formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import eslintPluginJsonc from "eslint-plugin-jsonc";

/**
 * Loads the ESLint configuration for JSON files
 * @returns {Array<import("eslint").Linter.Config>} An array of ESLint configurations for JSON
 */
export default function loadConfig(): Array<Linter.Config> {
	const recommendedConfigs: Array<Linter.Config> = [...eslintPluginJsonc.configs["flat/recommended-with-json"]];
	const formattedRecommendedConfigs: Array<Linter.Config> = formatConfig(recommendedConfigs);
	const firstConfigIndex: number = 0;
	const secondConfigIndex: number = 1;
	const thirdConfigIndex: number = 2;
	const firstConfig: Linter.Config = formattedRecommendedConfigs[firstConfigIndex] ?? {};
	const secondConfig: Linter.Config = formattedRecommendedConfigs[secondConfigIndex] ?? {};
	const thirdConfig: Linter.Config = formattedRecommendedConfigs[thirdConfigIndex] ?? {};
	const jsoncPlugin: ESLint.Plugin | undefined = recommendedConfigs[firstConfigIndex]?.plugins?.jsonc;

	return [
		{
			...firstConfig,
			plugins: {
				...firstConfig.plugins,
				...(jsoncPlugin ? { [formatPluginName("jsonc/vue-custom-block")]: extractSubPlugin(jsoncPlugin, "vue-custom-block", "jsonc") } : {}),
			},
		},
		{
			...secondConfig,
		},
		{
			files: ["*.json", "**/*.json", "*.json5", "**/*.json5", "*.jsonc", "**/*.jsonc"],

			rules: thirdConfig.rules,
		},
		{
			files: ["*.json", "**/*.json", "*.json5", "**/*.json5", "*.jsonc", "**/*.jsonc"],
			ignores: ["**/package.json"],
			rules: {
				[formatRuleName("jsonc/no-comments")]: "off",
				[formatRuleName("jsonc/sort-keys")]: "error",
			},
		},
	] as Array<Linter.Config>;
}
