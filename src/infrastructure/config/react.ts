/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import react from "@eslint-react/eslint-plugin";
import react2 from "eslint-plugin-react";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
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
						jsx: true,
					},
					ecmaVersion: "latest",
				},
			},
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			rules: {
				[formatRuleName("@eslint-react/hooks-extra/no-direct-set-state-in-use-effect")]: "error",
				[formatRuleName("@eslint-react/naming-convention/context-name")]: "error",
				[formatRuleName("react/checked-requires-onchange-or-readonly")]: "error",
				[formatRuleName("react/default-props-match-prop-types")]: config.withNext ? "off" : "error",
				[formatRuleName("react/function-component-definition")]: [
					"error",
					{
						namedComponents: "arrow-function",
						unnamedComponents: "arrow-function",
					},
				],
				[formatRuleName("react/jsx-closing-bracket-location")]: "error",
				[formatRuleName("react/jsx-curly-brace-presence")]: [
					"error",
					{
						children: "always",
						propElementValues: "always",
						props: "always",
					},
				],
				[formatRuleName("react/jsx-no-bind")]: "error",
				[formatRuleName("react/jsx-no-undef")]: "error",
				[formatRuleName("react/no-deprecated")]: "error",
				[formatRuleName("react/no-invalid-html-attribute")]: "error",
				[formatRuleName("react/no-is-mounted")]: "error",
				[formatRuleName("react/no-this-in-sfc")]: "error",
				[formatRuleName("react/no-typos")]: "error",
				[formatRuleName("react/no-unescaped-entities")]: "error",
				[formatRuleName("react/prefer-stateless-function")]: ["error", { ignorePureComponents: true }],
				[formatRuleName("react/react-in-jsx-scope")]: config.withNext ? "off" : "error",
				[formatRuleName("react/require-default-props")]: "error",
				[formatRuleName("react/require-render-return")]: "error",
				[formatRuleName("react/self-closing-comp")]: "error",
				[formatRuleName("react/state-in-constructor")]: ["error", "never"],
				[formatRuleName("react/style-prop-object")]: "error",
			},
		},
		{
			files: ["**/*.jsx", "**/*.tsx"],
			rules: {
				[formatRuleName("@eslint-react/naming-convention/component-name")]: ["error", "PascalCase"],
				[formatRuleName("@eslint-react/naming-convention/filename-extension")]: ["error", { allow: "as-needed" }],
				[formatRuleName("@eslint-react/naming-convention/filename")]: config.withNext ? "off" : "error",
				[formatRuleName("@eslint-react/naming-convention/use-state")]: "error",
			},
		},
		{
			// @ts-ignore
			...formatConfig([react.configs["recommended-type-checked"]])[0],
			files: ["**/*.ts", "**/*.tsx"],
			languageOptions: {
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
		},
	] as Array<Linter.Config>;
}
