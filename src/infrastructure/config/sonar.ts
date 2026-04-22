import type { Linter } from "eslint";

import { formatConfig, formatRuleName } from "@infrastructure/utility";
import sonarjs from "eslint-plugin-sonarjs";

const congnitiveComplexity: number = 100;
const duplicateStringThreshold: number = 10;

/**
 * Loads the ESLint configuration for SonarJS rules
 * @returns {Array<import("eslint").Linter.Config>} An array of ESLint configurations for SonarJS
 */
export default function loadConfig(): Array<Linter.Config> {
	const recommendedConfig: Linter.Config | undefined = sonarjs.configs?.recommended as Linter.Config | undefined;
	const formattedRecommendedConfig: Linter.Config = recommendedConfig ? (formatConfig([recommendedConfig])[0] ?? {}) : {};

	return [
		{
			...formattedRecommendedConfig,
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			rules: {
				[formatRuleName("sonarjs/bool-param-default")]: "error", // Require default values for boolean parameters to improve readability.
				[formatRuleName("sonarjs/cognitive-complexity")]: ["error", congnitiveComplexity], // Set a high threshold for cognitive complexity to allow complex but manageable functions.
				[formatRuleName("sonarjs/no-duplicate-string")]: ["error", { threshold: duplicateStringThreshold }], // Flag strings duplicated more than 10 times to encourage the use of constants for maintainability.
				[formatRuleName("sonarjs/no-empty-test-file")]: "off", // Prevent empty test files from being committed.
				[formatRuleName("sonarjs/todo-tag")]: "warn", // Flag to do comments to ensure they are addressed.
			},
		},
	] as Array<Linter.Config>;
}
