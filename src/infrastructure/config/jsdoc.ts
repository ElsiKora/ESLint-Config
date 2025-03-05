import type { Linter } from "eslint";

import jsdoc from "eslint-plugin-jsdoc";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";

export default [
	formatConfig([jsdoc.configs["flat/recommended"]])[0],
	{
		files: ["**/*.js"],
		plugins: {
			[formatPluginName("jsdoc")]: jsdoc,
		},
	},
] as Array<Linter.Config>;
