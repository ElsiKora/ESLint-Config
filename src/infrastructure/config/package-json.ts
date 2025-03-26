import type { Linter } from "eslint";

import { formatConfig, formatRuleName } from "@infrastructure/utility";
import eslintPluginPackageJson from "eslint-plugin-package-json";

/**
 * Loads the ESLint configuration for package.json files
 * @returns {Array<Linter.Config>} An array of ESLint configurations for package.json
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([eslintPluginPackageJson.configs.recommended])[0],
			rules: {
				// @ts-ignore
				...formatConfig([eslintPluginPackageJson.configs.recommended])[0].rules,
				[formatRuleName("package-json/order-properties")]: "error",
			},
		},
	] as Array<Linter.Config>;
}
