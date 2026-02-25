/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import react from "@eslint-react/eslint-plugin";
import { formatConfig, formatRuleName } from "@infrastructure/utility";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for React applications
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for React
 */
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
				[formatRuleName("@eslint-react/hooks-extra/no-direct-set-state-in-use-effect")]: "error", // Disallow direct setState in useEffect
				[formatRuleName("@eslint-react/naming-convention/context-name")]: "error", // Enforce the naming of context providers
				[formatRuleName("@eslint-react/naming-convention/component-name")]: ["error", "PascalCase"], // Enforce component naming conventions
				[formatRuleName("@eslint-react/naming-convention/filename")]: "off", // Enforce filename conventions
				[formatRuleName("@eslint-react/naming-convention/use-state")]: "error", // Enforce the use of the useState hook
				[formatRuleName("@eslint-react/web-api/no-leaked-event-listener")]: "error", // Ensure event listeners are cleaned up correctly.
				[formatRuleName("@eslint-react/dom/no-void-elements-with-children")]: "error", // Disallow children on void DOM elements.
				[formatRuleName("@eslint-react/dom/no-script-url")]: config.withNext ? "off" : "error",
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
