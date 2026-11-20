/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import i18nextPlugin from "eslint-plugin-i18next";
import tseslint from "typescript-eslint";

// The plugin merges options shallowly, so each list below repeats the plugin's defaults before adding to them.
const NO_LITERAL_STRING_OPTIONS: Record<string, unknown> = {
	callees: {
		// Format strings, locales and other arguments of formatting calls are technical values.
		exclude: ["i18n(ext)?", "t", "require", "addEventListener", "removeEventListener", "postMessage", "getElementById", "dispatch", "commit", "includes", "indexOf", "endsWith", "startsWith", "format", String.raw`Intl\..+`, "toLocale(Date|Time)?String"],
	},
	"jsx-attributes": {
		// Attributes that hold technical values. Every other attribute, including JSX nested inside it, is checked.
		exclude: ["className", "styleName", "style", "type", "key", "id", "width", "height", "href", "src", "data-.*"],
	},
	mode: "jsx-only",
};

// Literal text in tests and stories renders fixtures, not product copy.
const TEST_FILES: Array<string> = ["**/*.test.*", "**/*.spec.*", "**/*.stories.*", "**/__tests__/**"];

/**
 * Loads the ESLint configuration for i18next internationalization
 * @returns {Array<Linter.Config>} An array of ESLint configurations for i18next
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			files: ["**/*.ts", "**/*.tsx"],
			languageOptions: {
				// @ts-ignore
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
			plugins: {
				[formatPluginName("i18next")]: i18nextPlugin,
			},
			rules: {
				[formatRuleName("i18next/no-literal-string")]: ["error", NO_LITERAL_STRING_OPTIONS],
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
			plugins: {
				[formatPluginName("i18next")]: i18nextPlugin,
			},
			rules: {
				[formatRuleName("i18next/no-literal-string")]: ["error", NO_LITERAL_STRING_OPTIONS],
			},
		},
		{
			files: TEST_FILES,
			rules: {
				[formatRuleName("i18next/no-literal-string")]: "off",
			},
		},
	];
}
