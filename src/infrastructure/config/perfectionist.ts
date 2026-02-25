/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import perfectionist from "eslint-plugin-perfectionist";

/**
 * Loads the ESLint configuration for perfectionist (sorting imports, etc.)
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for perfectionist
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			plugins: {
				[formatPluginName("perfectionist")]: perfectionist,
			},
			rules: {
				[formatRuleName("perfectionist/sort-imports")]: config.withFsd ? "off" : "error",
			},
		},
	] as Array<Linter.Config>;
}
