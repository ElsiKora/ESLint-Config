import type { Linter } from "eslint";

import eslintPluginJsonc from "eslint-plugin-jsonc";

import { extractSubPlugin } from "../utility/extract-sub-plugin.utility";
import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[0],
			plugins: {
				...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[0].plugins,
				// @ts-ignore
				// eslint-disable-next-line @elsikora/typescript/no-unsafe-argument,@elsikora/typescript/no-unsafe-member-access
				[formatPluginName("jsonc/vue-custom-block")]: extractSubPlugin(eslintPluginJsonc.configs["flat/recommended-with-json"][0].plugins.jsonc, "vue-custom-block", "jsonc"),
			},
		},
		{
			...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-json"]])[1],
		},
		{
			files: ["*.json", "**/*.json", "*.json5", "**/*.json5", "*.jsonc", "**/*.jsonc"],
			// eslint-disable-next-line @elsikora/typescript/no-magic-numbers
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
