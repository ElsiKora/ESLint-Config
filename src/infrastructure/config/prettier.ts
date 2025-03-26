import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import prettier from "eslint-plugin-prettier/recommended";

/**
 * Loads the ESLint configuration for Prettier integration
 * @returns {Array<Linter.Config>} An array of ESLint configurations for Prettier
 */
export default function loadConfig(): Array<Linter.Config> {
	return [...formatConfig([prettier])] as Array<Linter.Config>;
}
