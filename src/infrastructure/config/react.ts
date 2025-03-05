import type { Linter } from "eslint";

import react from "@eslint-react/eslint-plugin";
import react2 from "eslint-plugin-react";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default [
	{
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		plugins: {
			[formatPluginName("react")]: react2,
		},
	},
	{
		// @ts-ignore
		...formatConfig([react.configs.recommended])[0],
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
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		rules: {
			[formatRuleName(`${formatPluginName("@eslint-react/hooks-extra")}/no-direct-set-state-in-use-effect`)]: "error",
			[formatRuleName(`${formatPluginName("@eslint-react/naming-convention")}/context-name`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/checked-requires-onchange-or-readonly`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/default-props-match-prop-types`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/function-component-definition`)]: [
				"error",
				{
					namedComponents: "arrow-function",
					unnamedComponents: "arrow-function",
				},
			],
			[formatRuleName(`${formatPluginName("react")}/jsx-closing-bracket-location`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/jsx-curly-brace-presence`)]: [
				"error",
				{
					children: "always",
					propElementValues: "always",
					props: "always",
				},
			],
			[formatRuleName(`${formatPluginName("react")}/jsx-no-bind`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/jsx-no-undef`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/no-deprecated`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/no-invalid-html-attribute`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/no-is-mounted`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/no-this-in-sfc`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/no-typos`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/no-unescaped-entities`)]: "error",
			// eslint-disable-next-line @elsikora-typescript/naming-convention
			[formatRuleName(`${formatPluginName("react")}/prefer-stateless-function`)]: ["error", { ignorePureComponents: true }],
			[formatRuleName(`${formatPluginName("react")}/require-default-props`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/require-render-return`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/self-closing-comp`)]: "error",
			[formatRuleName(`${formatPluginName("react")}/state-in-constructor`)]: ["error", "never"],
			[formatRuleName(`${formatPluginName("react")}/style-prop-object`)]: "error",
		},
	},
	{
		files: ["**/*.jsx", "**/*.tsx"],
		rules: {
			[formatRuleName(`${formatPluginName("@eslint-react/naming-convention")}/component-name`)]: ["error", "PascalCase"],
			[formatRuleName(`${formatPluginName("@eslint-react/naming-convention")}/filename-extension`)]: ["error", { allow: "as-needed" }],
			[formatRuleName(`${formatPluginName("@eslint-react/naming-convention")}/filename`)]: "error",
			[formatRuleName(`${formatPluginName("@eslint-react/naming-convention")}/use-state`)]: "error",
		},
	},
	{
		// @ts-ignore
		...formatConfig([react.configs["recommended-type-checked"]])[0],
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				// eslint-disable-next-line @elsikora-typescript/naming-convention
				projectService: true,
			},
		},
	},
] as Array<Linter.Config>;
