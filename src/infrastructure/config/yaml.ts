import type { Linter } from "eslint";

import { extractSubPlugin, formatConfig, formatPluginName } from "@infrastructure/utility";
import eslintPluginYml from "eslint-plugin-yml";

/**
 * Loads the ESLint configuration for YAML files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for YAML
 */
export default function loadConfig(): Array<Linter.Config> {
	const formattedConfigs: Array<Linter.Config> = formatConfig([...eslintPluginYml.configs["flat/recommended"]]);

	return [
		{
			...formattedConfigs[0],
			plugins: {
				...formattedConfigs[0]?.plugins,
				// @ts-ignore
				[formatPluginName("yml/vue-custom-block")]: extractSubPlugin(eslintPluginYml.configs["flat/recommended"][0].plugins.yml, "vue-custom-block", "yml"),
			},
		},
		...formattedConfigs.slice(1),
	] as Array<Linter.Config>;
}
