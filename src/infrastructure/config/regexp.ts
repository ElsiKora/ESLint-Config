import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import * as regexpPlugin from "eslint-plugin-regexp";

/**
 * Loads the ESLint configuration for regular expressions
 * @returns {Array<Linter.Config>} An array of ESLint configurations for RegExp
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([regexpPlugin.configs["flat/recommended"]])[0],
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		},
	] as Array<Linter.Config>;
}
