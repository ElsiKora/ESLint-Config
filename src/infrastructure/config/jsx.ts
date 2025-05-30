import type { Linter } from "eslint";

import { formatConfig, formatRuleName } from "@infrastructure/utility";
import jsx from "eslint-plugin-jsx-a11y";

/**
 * Loads the ESLint configuration for JSX accessibility
 * @returns {Array<Linter.Config>} An array of ESLint configurations for JSX
 */
export default function loadConfig(): Array<Linter.Config> {
	return [formatConfig([jsx.flatConfigs.recommended])[0], { files: ["*.tsx", "**/*.tsx", "*.jsx", "**/*.jsx"], rules: { [formatRuleName("jsx-a11y/no-autofocus")]: "off" } }] as Array<Linter.Config>;
}
