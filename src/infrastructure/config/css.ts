import type { Linter } from "eslint";

import css from "@elsikora/eslint-plugin-css";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([css.configs.recommended])[0],
			files: ["**/*.css"],
			language: `${formatPluginName("css")}/css`,
		},
		{
			files: ["**/*.css"],
			rules: {
				[formatRuleName("css/no-invalid-at-rules")]: "off", // Disallow at-rules that are not allowed by the config.
			},
		},
	] as Array<Linter.Config>;
}
