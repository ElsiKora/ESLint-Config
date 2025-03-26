/* eslint-disable @elsikora/typescript/no-unsafe-assignment,@elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

// @ts-ignore
import featureSlicedPlugin from "@conarti/eslint-plugin-feature-sliced";
import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for Feature-Sliced Design architecture
 * @returns {Array<Linter.Config>} An array of ESLint configurations for FSD
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			plugins: {
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
