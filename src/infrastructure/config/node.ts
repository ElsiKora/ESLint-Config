import type { Linter } from "eslint";

import nPlugin from "eslint-plugin-n";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default [
	{
		...formatConfig([nPlugin.configs["flat/recommended"]])[0],
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
	},
	{
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		rules: {
			[formatRuleName("n/exports-style")]: ["error", "exports"],
			[formatRuleName("n/no-missing-import")]: "off",
		},
	},
] as Array<Linter.Config>;
