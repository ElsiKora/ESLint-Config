import type { Linter } from "eslint";

import nPlugin from "eslint-plugin-n";

import { formatConfig, formatRuleName } from "../utility/format";

export default [
	...formatConfig([nPlugin.configs["flat/recommended"]]),
	{
		rules: {
			[formatRuleName("n/exports-style")]: ["error", "exports"],
			[formatRuleName("n/no-missing-import")]: "off",
		},
	},
] as Array<Linter.Config>;
