/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import i18nextPlugin from "eslint-plugin-i18next";
import tseslint from "typescript-eslint";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			files: ["**/*.ts", "**/*.tsx"],
			languageOptions: {
				// @ts-ignore
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
			plugins: {
				[formatPluginName("i18next")]: i18nextPlugin,
			},
			rules: {
				[formatRuleName("i18next/no-literal-string")]: ["error", { mode: "jsx-only" }],
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
			plugins: {
				[formatPluginName("i18next")]: i18nextPlugin,
			},
			rules: {
				[formatRuleName("i18next/no-literal-string")]: ["error", { mode: "jsx-only" }],
			},
		},
	];
}
