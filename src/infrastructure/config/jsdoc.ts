import type { Linter } from "eslint";

import jsdoc from "eslint-plugin-jsdoc";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";

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
