/* eslint-disable @elsikora/typescript/naming-convention */
import type { ESLint, Linter } from "eslint";

import { plugin as featureSlicedPlugin } from "@conarti/eslint-plugin-feature-sliced";
import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import fsdLintPlugin from "eslint-plugin-fsd-lint";
import tseslint from "typescript-eslint";

const conartiFeatureSlicedPlugin: ESLint.Plugin = featureSlicedPlugin as unknown as ESLint.Plugin;
const fsdLint: ESLint.Plugin = fsdLintPlugin;

/**
 * Loads the ESLint configuration for Feature-Sliced Design architecture
 * @returns {Array<Linter.Config>} An array of ESLint configurations for FSD
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			plugins: {
				[formatPluginName("@conarti/feature-sliced")]: conartiFeatureSlicedPlugin,
				[formatPluginName("fsd")]: fsdLint,
			},
			rules: {
				[formatRuleName("@conarti/feature-sliced/no-cross-segment-reexport")]: "error",
				[formatRuleName("fsd/forbidden-imports")]: "error",
				[formatRuleName("fsd/no-cross-slice-dependency")]: "error",
				[formatRuleName("fsd/no-global-store-imports")]: "error",
				[formatRuleName("fsd/no-public-api-sidestep")]: [
					"error",
					{
						publicApi: {
							allowSegmentImports: false,
							enforceShared: true,
						},
					},
				],
				[formatRuleName("fsd/no-relative-imports")]: "error",
				[formatRuleName("fsd/no-ui-in-business-logic")]: "error",
				[formatRuleName("fsd/ordered-imports")]: "error",
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
