/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import { fixupPluginRules } from "@eslint/compat";
import { formatPluginName, formatRuleName } from "@infrastructure/utility";
// @ts-ignore
import next from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for Next.js applications
 * @returns {Array<Linter.Config>} An array of ESLint configurations for Next.js
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
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
		{
			files: ["**/*.ts", "**/*.tsx"],
			languageOptions: {
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			plugins: {
				// eslint-disable-next-line @elsikora/typescript/no-unsafe-argument
				[formatPluginName("@next/next")]: fixupPluginRules(next),
			},
			rules: {
				[formatRuleName("@next/next/google-font-display")]: "warn",
				[formatRuleName("@next/next/google-font-preconnect")]: "warn",
				[formatRuleName("@next/next/inline-script-id")]: "error",
				[formatRuleName("@next/next/next-script-for-ga")]: "warn",
				[formatRuleName("@next/next/no-assign-module-variable")]: "error",
				[formatRuleName("@next/next/no-async-client-component")]: "warn",
				[formatRuleName("@next/next/no-before-interactive-script-outside-document")]: "warn",
				[formatRuleName("@next/next/no-css-tags")]: "warn",
				[formatRuleName("@next/next/no-document-import-in-page")]: "error",
				[formatRuleName("@next/next/no-duplicate-head")]: "error",
				[formatRuleName("@next/next/no-head-element")]: "warn",
				[formatRuleName("@next/next/no-head-import-in-document")]: "error",
				[formatRuleName("@next/next/no-html-link-for-pages")]: "warn",
				[formatRuleName("@next/next/no-img-element")]: "warn",
				[formatRuleName("@next/next/no-page-custom-font")]: "warn",
				[formatRuleName("@next/next/no-script-component-in-head")]: "error",
				[formatRuleName("@next/next/no-styled-jsx-in-document")]: "warn",
				[formatRuleName("@next/next/no-sync-scripts")]: "warn",
				[formatRuleName("@next/next/no-title-in-document-head")]: "warn",
				[formatRuleName("@next/next/no-typos")]: "warn",
				[formatRuleName("@next/next/no-unwanted-polyfillio")]: "warn",
			},
		},
	] as Array<Linter.Config>;
}
