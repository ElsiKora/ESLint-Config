import type { ESLint, Linter } from "eslint";

import PLUGIN_MAP from "../constant/utility/plugin-map.constant";

/**
 * Formats ESLint configurations by remapping plugin names and rule prefixes according to PLUGIN_MAP.
 * @param {Array<Linter.Config>} configs - Array of ESLint flat configurations to process
 * @returns {Array<Linter.Config>} Array of formatted ESLint configurations with updated plugin names and rule prefixes
 */
export function formatConfig(configs: Array<Linter.Config>): Array<Linter.Config> {
	const formattedConfigs: Array<Linter.Config> = [];

	for (const config of configs) {
		// eslint-disable-next-line @elsikora/sonar/no-unused-vars,@elsikora/typescript/naming-convention
		const { plugins: __, rules: _, ...restConfig }: Linter.Config = config;
		const newConfig: Linter.Config = { ...restConfig };

		if (config.plugins) {
			const newPlugins: Record<string, ESLint.Plugin> = {};

			for (const [oldName, newName] of getSortedPluginMapEntries()) {
				const plugin: ESLint.Plugin | undefined = config.plugins[oldName];

				if (plugin) {
					newPlugins[newName] = plugin;
				}
			}

			for (const [key, value] of Object.entries(config.plugins)) {
				if (!Object.keys(PLUGIN_MAP).includes(key)) {
					newPlugins[key] = value;
				}
			}

			newConfig.plugins = newPlugins;
		}

		if (config.rules) {
			const newRules: Partial<Linter.RulesRecord> = {};

			for (const [rule, ruleConfig] of Object.entries(config.rules)) {
				newRules[renamePrefixedName(rule) ?? rule] = ruleConfig;
			}

			newConfig.rules = newRules;
		}

		if (config.language) {
			newConfig.language = renamePrefixedName(config.language) ?? config.language;
		}

		formattedConfigs.push(newConfig);
	}

	return formattedConfigs;
}

/**
 * Returns plugin map entries sorted by longest source plugin name first.
 * @returns {Array<[string, string]>} Sorted plugin map entries
 */
function getSortedPluginMapEntries(): Array<[string, string]> {
	// eslint-disable-next-line @elsikora/unicorn/no-array-sort
	return Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length);
}

/**
 * Renames a plugin-prefixed name (a rule or a language) using the longest matching PLUGIN_MAP prefix.
 * @param {string} name - The prefixed name, for example `unicorn/no-null`
 * @returns {null | string} The renamed name, or null when no mapped prefix matches
 */
function renamePrefixedName(name: string): null | string {
	for (const [oldName, newName] of getSortedPluginMapEntries()) {
		const oldPrefix: string = `${oldName}/`;

		if (name.startsWith(oldPrefix)) {
			return `${newName}/${name.slice(oldPrefix.length)}`;
		}
	}

	return null;
}
