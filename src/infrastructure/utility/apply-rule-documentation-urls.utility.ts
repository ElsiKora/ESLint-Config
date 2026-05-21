import type { ESLint, Linter } from "eslint";

import type { TRuleDocumentationPluginCache } from "../type/rule-documentation-plugin-cache.type";

import { getPluginWithRuleDocumentationUrls } from "./get-plugin-with-rule-documentation-urls.utility";

/**
 * Applies ElsiKora documentation URLs to every plugin rule in the final ESLint config.
 * @param {Array<Linter.Config>} configs - ESLint flat configs to decorate
 * @returns {Array<Linter.Config>} Configs with decorated rule metadata
 */
export function applyRuleDocumentationUrls(configs: Array<Linter.Config>): Array<Linter.Config> {
	const pluginCache: TRuleDocumentationPluginCache = new Map<string, WeakMap<ESLint.Plugin, ESLint.Plugin>>();

	return configs.map((config: Linter.Config) => {
		if (!config.plugins) {
			return config;
		}

		const configPlugins: Record<string, ESLint.Plugin> = config.plugins;
		const plugins: Record<string, ESLint.Plugin> = {};

		for (const [pluginName, plugin] of Object.entries(configPlugins)) {
			plugins[pluginName] = getPluginWithRuleDocumentationUrls(pluginCache, plugin, pluginName);
		}

		return {
			...config,
			plugins,
		};
	});
}
