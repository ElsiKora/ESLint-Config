import type { Linter } from "eslint";

import { fixupPluginRules } from "@eslint/compat";
// @ts-ignore
import next from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default [
	{
		files: ["**/*.js", "**/*.jsx"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					// eslint-disable-next-line @elsikora-typescript/naming-convention
					jsx: true,
				},
				ecmaVersion: "latest",
			},
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				// eslint-disable-next-line @elsikora-typescript/naming-convention
				projectService: true,
			},
		},
	},
	{
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		plugins: {
			// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-sonar/no-duplicate-string
			[formatPluginName("@next/next")]: fixupPluginRules(next),
		},
		rules: {
			[formatRuleName(`${formatPluginName("@next/next")}/google-font-display`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/google-font-preconnect`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/inline-script-id`)]: "error",
			[formatRuleName(`${formatPluginName("@next/next")}/next-script-for-ga`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-assign-module-variable`)]: "error",
			[formatRuleName(`${formatPluginName("@next/next")}/no-async-client-component`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-before-interactive-script-outside-document`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-css-tags`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-document-import-in-page`)]: "error",
			[formatRuleName(`${formatPluginName("@next/next")}/no-duplicate-head`)]: "error",
			[formatRuleName(`${formatPluginName("@next/next")}/no-head-element`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-head-import-in-document`)]: "error",
			[formatRuleName(`${formatPluginName("@next/next")}/no-html-link-for-pages`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-img-element`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-page-custom-font`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-script-component-in-head`)]: "error",
			[formatRuleName(`${formatPluginName("@next/next")}/no-styled-jsx-in-document`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-sync-scripts`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-title-in-document-head`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-typos`)]: "warn",
			[formatRuleName(`${formatPluginName("@next/next")}/no-unwanted-polyfillio`)]: "warn",
		},
	},
	{
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		rules: {
			[`${formatPluginName("jsx-a11y")}/alt-text`]: "off",
			[`${formatPluginName("react")}/prop-types`]: "off",
			[`${formatPluginName("react")}/react-in-jsx-scope`]: "off",
			[formatRuleName(`${formatPluginName("@eslint-react/naming-convention")}/filename`)]: "off",
		},
	},
] as Array<Linter.Config>;
