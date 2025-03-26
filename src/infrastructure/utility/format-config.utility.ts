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

			for (const [oldName, newName] of Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length)) {
				if (config.plugins[oldName]) {
					newPlugins[newName] = config.plugins[oldName];
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

			for (const rule of Object.keys(config.rules)) {
				let isReplaced: boolean = false;

				for (const [oldName, newName] of Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length)) {
					const oldPrefix: string = `${oldName}/`;

					if (rule.startsWith(oldPrefix) && !isReplaced) {
						const newRule: string = rule.replace(oldPrefix, `${newName}/`);
						newRules[newRule] = config.rules[rule];
						isReplaced = true;

						break;
					}
				}

				if (!isReplaced) {
					newRules[rule] = config.rules[rule];
				}
			}

			newConfig.rules = newRules;
		}

		if (config.language) {
			for (const [oldName, newName] of Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length)) {
				const oldPrefix: string = `${oldName}/`;

				if (config.language.startsWith(oldPrefix)) {
					newConfig.language = config.language.replace(oldPrefix, `${newName}/`);

					break;
				}
			}
		}

		formattedConfigs.push(newConfig);
	}

	return formattedConfigs;
}
