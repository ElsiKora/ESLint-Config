import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import js from "@eslint/js";
import { createVirtualEslintPlugin } from "@infrastructure/utility";
import globals from "globals";

/**
 * Loads the ESLint configuration for JavaScript
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for JavaScript
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		...createVirtualEslintPlugin(
			[
				{
					...js.configs.recommended,
					files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
					languageOptions: {
						globals: {
							...globals.node,
						},
					},
				},
				{
					rules: {
						"no-await-in-loop": "off",
						"no-compare-neg-zero": "error",
						"no-console": ["warn", { allow: ["warn", "error"] }],
						"no-unused-vars": config.withSonar ? "off" : "error",
					},
				},
			],
			"@elsikora/javascript",
		),
	];
}
