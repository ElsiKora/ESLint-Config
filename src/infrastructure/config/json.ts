/* eslint-disable @elsikora/typescript/no-unsafe-member-access */
import type { Linter } from "eslint";

import { extractSubPlugin, formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import eslintPluginJsonc from "eslint-plugin-jsonc";

/**
 * Loads the ESLint configuration for JSON files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for JSON
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[0],
			plugins: {
				// @ts-ignore
				...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[0].plugins,
				// @ts-ignore
				// eslint-disable-next-line @elsikora/typescript/no-unsafe-argument
				[formatPluginName("jsonc/vue-custom-block")]: extractSubPlugin(eslintPluginJsonc.configs["flat/recommended-with-json"][0].plugins.jsonc, "vue-custom-block", "jsonc"),
			},
		},
		{
			...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[1],
		},
		{
			files: ["*.json", "**/*.json", "*.json5", "**/*.json5", "*.jsonc", "**/*.jsonc"],

			// @ts-ignore
			rules: formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[2].rules,
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
