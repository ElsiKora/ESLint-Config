import type { Linter } from "eslint";

import { formatConfig, formatRuleName } from "@infrastructure/utility";
import sonarjs from "eslint-plugin-sonarjs";

const congnitiveComplexity: number = 100;
const duplicateStringThreshold: number = 10;

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([sonarjs.configs.recommended])[0],
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
