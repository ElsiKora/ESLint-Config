/* eslint-disable @elsikora/typescript/no-unsafe-member-access,@elsikora/typescript/no-magic-numbers */
import type { Linter } from "eslint";

import { extractSubPlugin, formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import eslintPluginJsonc from "eslint-plugin-jsonc";

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
				[formatRuleName("jsonc/sort-keys")]: "error",
			},
		},
	] as Array<Linter.Config>;
}
