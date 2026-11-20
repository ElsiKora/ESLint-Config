/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { ESLint, Linter } from "eslint";

import { plugin as featureSlicedPlugin } from "@conarti/eslint-plugin-feature-sliced";
import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import fsdLintPlugin from "eslint-plugin-fsd-lint";
import tseslint from "typescript-eslint";

const conartiFeatureSlicedPlugin: ESLint.Plugin = featureSlicedPlugin as unknown as ESLint.Plugin;
const fsdLint: ESLint.Plugin = fsdLintPlugin;

// Tests and stories live inside slices and are bound by the same import rules as the code they cover.
const ALL_FILES_OPTIONS: { testFilesPatterns: Array<string> } = { testFilesPatterns: [] };

/**
 * Loads the ESLint configuration for Feature-Sliced Design architecture
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for FSD
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			plugins: {
				[formatPluginName("@conarti/feature-sliced")]: conartiFeatureSlicedPlugin,
				[formatPluginName("fsd")]: fsdLint,
			},
			rules: {
				[formatRuleName("@conarti/feature-sliced/no-cross-segment-reexport")]: "error",
				[formatRuleName("fsd/forbidden-imports")]: ["error", ALL_FILES_OPTIONS],
				[formatRuleName("fsd/no-cross-slice-dependency")]: ["error", ALL_FILES_OPTIONS],
				[formatRuleName("fsd/no-public-api-sidestep")]: [
					"error",
					{
						...ALL_FILES_OPTIONS,
						// Shared has no slices: each segment, and each component or library in shared/ui and shared/lib, has its own public API.
						ignoreImportPatterns: ["^@/?shared/[^/]+$", "^@/?shared/(ui|lib)/[^/]+$"],
						publicApi: {
							allowSegmentImports: false,
							enforceForLayers: ["processes", "pages", "widgets", "features", "entities"],
							enforceShared: true,
						},
					},
				],
				[formatRuleName("fsd/no-relative-imports")]: ["error", ALL_FILES_OPTIONS],
				[formatRuleName("fsd/ordered-imports")]: config.withPerfectionist ? "off" : "error", // perfectionist/sort-imports orders FSD layers when it is enabled.
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
