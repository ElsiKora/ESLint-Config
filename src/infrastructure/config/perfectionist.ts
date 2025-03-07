/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import perfectionist from "eslint-plugin-perfectionist";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([perfectionist.configs["recommended-alphabetical"]])[0],
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			rules: {
				[formatRuleName("perfectionist/sort-imports")]: [
					"error",
					{
						customGroups: {
							type: {},
							value: {},
						},
						environment: "node",
						groups: ["builtin-type", "type", "external-type", "internal-type", "parent-type", "sibling-type", "index-type", "builtin", "external", "internal", "parent", "sibling", "index", "object", "style", "side-effect", "unknown"],
						ignoreCase: false,
						newlinesBetween: "always",
						order: "asc",
						sortSideEffects: true,
						specialCharacters: "keep",
						type: "alphabetical",
					},
				],
			},
		},
	] as Array<Linter.Config>;
}
