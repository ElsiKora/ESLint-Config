/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

// @ts-ignore
import featureSlicedPlugin from "@conarti/eslint-plugin-feature-sliced";
import tseslint from "typescript-eslint";

import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			plugins: {
				/* eslint-disable-next-line @elsikora/typescript/no-unsafe-assignment */
				[formatPluginName("@conarti/feature-sliced")]: featureSlicedPlugin,
			},
			rules: {
				[formatRuleName("@conarti/feature-sliced/absolute-relative")]: "error",
				[formatRuleName("@conarti/feature-sliced/layers-slices")]: "error",
				[formatRuleName("@conarti/feature-sliced/public-api")]: "error",
			},
		},
		{
			files: ["**/*.ts", "**/*.tsx"],
			languageOptions: {
				// @ts-ignore
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
		},
		{
			files: ["**/*.js", "**/*.jsx"],
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: "latest",
				},
			},
		},
	];
}
