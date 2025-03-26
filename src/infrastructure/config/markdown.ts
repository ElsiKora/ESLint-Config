import type { Linter } from "eslint";

import markdown from "@elsikora/eslint-plugin-markdown";
import { formatConfig } from "@infrastructure/utility";

/**
 * Loads the ESLint configuration for Markdown files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for Markdown
 */
export default function loadConfig(): Array<Linter.Config> {
	// @ts-ignore
	return formatConfig([markdown.configs.recommended[0]]);
}
