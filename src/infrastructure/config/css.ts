import type { Linter } from "eslint";

import css from "@elsikora/eslint-plugin-css";
import { formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";

/**
 * Loads the ESLint configuration for CSS files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for CSS
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([css.configs.recommended])[0],
			files: ["**/*.css"],

			language: `${formatPluginName("css")}/css`,
		},
		{
			files: ["**/*.css"],
			rules: {
				[formatRuleName("css/no-invalid-at-rules")]: "off", // Disallow at-rules that are not allowed by the config.

				[formatRuleName("css/require-baseline")]: "off", // Disabled because it's not useful for all projects.
			},
		},
	] as Array<Linter.Config>;
}
