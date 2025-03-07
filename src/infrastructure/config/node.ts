import type { RuleDefinition } from "@eslint/core";
import type { ESLint, Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import nPlugin from "eslint-plugin-n";

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

function extractSubPlugin(plugin: ESLint.Plugin, subPluginName: "no-unsupported-feature"): ESLint.Plugin {
	const newPlugin: ESLint.Plugin = { ...plugin };
	const newRules: Record<string, RuleDefinition> = {};

	if (newPlugin.rules) {
		for (const key of Object.keys(newPlugin.rules)) {
			if (key.split("/").length > 1 && key.includes(subPluginName)) {
				// @ts-ignore
				newRules[key.split("/").slice(1).join("/")] = newPlugin.rules[key];
			}
		}

		newPlugin.rules = newRules;
	}

	return newPlugin;
}
