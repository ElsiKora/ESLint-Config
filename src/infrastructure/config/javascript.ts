import type { Linter } from "eslint";

import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		rules: {
			"no-await-in-loop": "off", // Allow await in loops
			"no-compare-neg-zero": "error", // Disallow comparing against -0
			"no-constructor-return": "error", // Disallow returning values from constructors
			"no-duplicate-imports": "off", // Disallow duplicate module imports
			"no-inner-declarations": "error", // Disallow variable or function declarations in nested blocks
			"no-promise-executor-return": "error", // Disallow returning values from Promise executor functions
			"no-self-compare": "error", // Disallow comparisons where both sides are exactly the same
		},
	},
] as Array<Linter.Config>;
