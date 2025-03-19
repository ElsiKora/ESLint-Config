import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import nPlugin from "eslint-plugin-n";

import { extractSubPlugin } from "../utility/extract-sub-plugin.utility";
import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

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
