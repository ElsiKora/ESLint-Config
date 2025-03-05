import type { Linter } from "eslint";

import css from "@elsikora/eslint-plugin-css";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";

export default [
	{
		...formatConfig([css.configs.recommended])[0],
		files: ["**/*.css"],
		language: `${formatPluginName("css")}/css`,
	},
	{
		files: ["**/*.css"],
		rules: {
			[`${formatPluginName("css")}/no-invalid-at-rules`]: "off",
		},
	},
] as Array<Linter.Config>;
