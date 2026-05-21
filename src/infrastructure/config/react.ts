/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import react from "@eslint-react/eslint-plugin";
import { formatConfig, formatRuleName } from "@infrastructure/utility";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for React applications
 * @param {IConfigOptions} _config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for React
 */
export default function loadConfig(_config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			settings: {
				react: {
					version: "detect",
				},
			},
		},
		{
			...formatConfig([react.configs.strict])[0],
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
				[formatRuleName("@eslint-react/dom-no-missing-button-type")]: "error", // Require explicit button types.
				[formatRuleName("@eslint-react/dom-no-string-style-prop")]: "error", // Enforce style prop values as objects.
				[formatRuleName("@eslint-react/dom-no-unknown-property")]: "error", // Disallow unknown DOM properties.
				[formatRuleName("@eslint-react/naming-convention-context-name")]: "error", // Enforce the naming of context providers
				[formatRuleName("@eslint-react/set-state-in-effect")]: "error", // Disallow direct setState in useEffect
			},
		},
		{
			files: ["**/*.jsx", "**/*.tsx"],
			rules: {
				// [formatRuleName("@eslint-react/naming-convention/filename-extension")]: ["error", { allow: "as-needed" }], // Enforce filename conventions
				[formatRuleName("@eslint-react/use-state")]: "error", // Enforce the use of the useState hook
			},
		},
		{
			...formatConfig([react.configs["strict-type-checked"]])[0],
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
