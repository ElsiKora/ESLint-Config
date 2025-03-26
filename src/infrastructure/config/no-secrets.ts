/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import noSecretsPlugin from "eslint-plugin-no-secrets";
import tseslint from "typescript-eslint";

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
							ApiKey: /(?:const|let|var)\s+API[-_]?KEY/i,
							Password: /(?:const|let|var)\s+(?:PASSWORD|PASSWD|PWD)/i,
							SecretKey: /(?:const|let|var)\s+SECRET[-_]?KEY/i,
							Token: /(?:const|let|var)\s+(?:TOKEN|ACCESS[-_]?TOKEN)/i,
						},
					},
				],

				[formatRuleName("no-secrets/no-secrets")]: [
					"error",
					{
						ignoreModules: true,
						// eslint-disable-next-line @elsikora/typescript/no-magic-numbers
						tolerance: 5,
					},
				],
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
