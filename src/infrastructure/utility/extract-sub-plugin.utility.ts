import type { RuleDefinition } from "@eslint/core";
import type { ESLint } from "eslint";

/**
 * Extracts a sub-plugin from a plugin object.
 * @param {ESLint.Plugin} plugin - The plugin object to extract the sub-plugin from
 * @param {string} subPluginName - The name of the sub-plugin to extract
 * @param {string} skipPluginName - The name of the plugin to skip when extracting the sub-plugin
 * @returns {ESLint.Plugin} The extracted sub-plugin object
 */
export function extractSubPlugin(plugin: ESLint.Plugin, subPluginName: string, skipPluginName?: string): ESLint.Plugin {
	const newPlugin: ESLint.Plugin = { ...plugin };
	const newRules: Record<string, RuleDefinition> = {};

	if (newPlugin.rules) {
		for (const [key, rule] of Object.entries(newPlugin.rules)) {
			let newKey: string = key;

			if (skipPluginName) newKey = newKey.replace(`${skipPluginName}/`, "");

			if (newKey.split("/").length > 1 && newKey.includes(subPluginName)) {
				newRules[newKey.split("/").slice(1).join("/")] = rule;
			}
		}

		newPlugin.rules = newRules;
	}

	return newPlugin;
}
