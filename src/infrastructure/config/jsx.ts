import type { Linter } from "eslint";

import { jsxA11yCompatPlugin } from "@infrastructure/plugin";
import { formatPluginName, formatRuleName } from "@infrastructure/utility";

/**
 * Loads the ESLint configuration for JSX accessibility
 * @returns {Array<Linter.Config>} An array of ESLint configurations for JSX
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			files: ["*.tsx", "**/*.tsx", "*.jsx", "**/*.jsx"],
			plugins: {
				[formatPluginName("jsx-a11y")]: jsxA11yCompatPlugin,
			},
			rules: {
				[formatRuleName("jsx-a11y/no-autofocus")]: "off",
			},
		},
	] as Array<Linter.Config>;
}
