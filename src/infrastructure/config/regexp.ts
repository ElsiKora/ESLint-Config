import type { Linter } from "eslint";

import * as regexpPlugin from "eslint-plugin-regexp";

import { formatConfig } from "../utility/format-config.utility";

export default [
	{
		...formatConfig([regexpPlugin.configs["flat/recommended"]])[0],
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
	},
] as Array<Linter.Config>;
