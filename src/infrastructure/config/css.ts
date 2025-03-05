import type { Linter } from "eslint";

import css from "@elsikora/eslint-plugin-css";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";

export default [
	{
		files: ["**/*.css"],
		language: `${formatPluginName("css")}/css`,
		...formatConfig([css.configs.recommended])[0],
	},
] as Array<Linter.Config>;
