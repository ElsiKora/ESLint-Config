/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import tanstackRouterPlugin from "@tanstack/eslint-plugin-router";
import tseslint from "typescript-eslint";

import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(_config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			// @ts-ignore
			plugins: {
				[formatPluginName("@tanstack/query")]: tanstackQueryPlugin,
			},
			rules: {
				[formatRuleName("@tanstack/query/exhaustive-deps")]: "error",
				[formatRuleName("@tanstack/query/infinite-query-property-order")]: "error",
				[formatRuleName("@tanstack/query/no-rest-destructuring")]: "error",
				[formatRuleName("@tanstack/query/no-unstable-deps")]: "error",
				[formatRuleName("@tanstack/query/stable-query-client")]: "error",
			},
		},
		{
			// @ts-ignore
			plugins: {
				[formatPluginName("@tanstack/router")]: tanstackRouterPlugin,
			},
			rules: {
				[formatRuleName("@tanstack/router/create-route-property-order")]: "error",
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
