import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import eslintPluginYml from "eslint-plugin-yml";

/**
 * Loads the ESLint configuration for YAML files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for YAML
 */
export default function loadConfig(): Array<Linter.Config> {
	return [...formatConfig([...eslintPluginYml.configs["flat/recommended"]])] as Array<Linter.Config>;
}
