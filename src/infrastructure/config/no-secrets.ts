/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import noSecretsPlugin from "eslint-plugin-no-secrets";
import tseslint from "typescript-eslint";

import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(_config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			plugins: {
				[formatPluginName("no-secrets")]: noSecretsPlugin,
			},
			rules: {
				[formatRuleName("no-secrets/no-pattern-match")]: [
					"error",
					{
						patterns: {
							ApiKey: /api[-_]?key/i,
							Password: /password|passwd|pwd/i,
							SecretKey: /secret[-_]?key/i,
							Token: /token|access[-_]?token/i,
						},
					},
				],

				[formatRuleName("no-secrets/no-secrets")]: [
					"error",
					{
						ignoreModules: true,
						// eslint-disable-next-line @elsikora/typescript/no-magic-numbers
						tolerance: 4,
					},
				],
			},
		},
		{
			files: ["**/*.json"],
			rules: {
				[formatRuleName("no-secrets/no-secrets")]: ["error"],
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
