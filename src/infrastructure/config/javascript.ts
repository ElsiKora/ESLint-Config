import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import js from "@eslint/js";
import globals from "globals";

import { createVirtualEslintPlugin } from "../utility/create-virtual-eslint-plugin.utility";

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
						"no-unused-vars": config.withSonar ? "off" : "error",
					},
				},
			],
			"@elsikora/javascript",
		),
	];
}
