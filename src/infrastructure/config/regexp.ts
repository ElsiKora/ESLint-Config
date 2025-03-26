import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import * as regexpPlugin from "eslint-plugin-regexp";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([regexpPlugin.configs["flat/recommended"]])[0],
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		},
	] as Array<Linter.Config>;
}
