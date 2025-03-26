import type { Linter } from "eslint";

import { formatConfig, formatPluginName } from "@infrastructure/utility";
import jsdoc from "eslint-plugin-jsdoc";

/**
 * Loads the ESLint configuration for JSDoc comments
 * @returns {Array<Linter.Config>} An array of ESLint configurations for JSDoc
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([jsdoc.configs["flat/recommended"]])[0],
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			plugins: {
				[formatPluginName("jsdoc")]: jsdoc,
			},
		},
	] as Array<Linter.Config>;
}
