import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { extractSubPlugin, formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import nPlugin from "eslint-plugin-n";

/**
 * Loads the ESLint configuration for Node.js
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for Node.js
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			...formatConfig([nPlugin.configs["flat/recommended"]])[0],
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			plugins: {
				[formatPluginName("n")]: nPlugin,
				[formatPluginName("n/no-unsupported-features")]: extractSubPlugin(nPlugin, "no-unsupported-feature"),
			},
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			rules: {
				[formatRuleName("n/exports-style")]: ["error", "exports"],
				[formatRuleName("n/no-missing-import")]: "off",
				[formatRuleName("n/no-process-exit")]: config.withUnicorn ? "off" : "error", // Disable the rule if the Unicorn plugin is enabled.
			},
		},
	] as Array<Linter.Config>;
}
