import type { Linter } from "eslint";

import unicorn from "eslint-plugin-unicorn";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default [
	...formatConfig([unicorn.configs.recommended]),
	{
		rules: {
			[formatRuleName("unicorn/filename-case")]: "off", // Disable filename casing rules to allow flexibility in project naming conventions.
			[formatRuleName("unicorn/no-null")]: "off", // Allow null values to be used in code, as they are a valid data type in JavaScript.
			[formatRuleName("unicorn/prefer-top-level-await")]: "off", // Allow flexibility in using top-level await, accommodating different project structures and initialization patterns.
		},
	},
] as Array<Linter.Config>;
