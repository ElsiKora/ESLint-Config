/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for Storybook files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for Storybook
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		// @ts-ignore
		...formatConfig(storybook.configs["flat/recommended"]),
		{
			files: ["**/*.stories.@(ts|tsx)"],
			// @ts-ignore
			languageOptions: {
				// @ts-ignore
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
		},
		{
			files: ["**/*.stories.@(js|jsx|mjs|cjs)"],
			// @ts-ignore
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
