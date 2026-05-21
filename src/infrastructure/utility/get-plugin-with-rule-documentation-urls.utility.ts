import type { ESLint } from "eslint";

import type { TRuleDocumentationPluginCache } from "../type/rule-documentation-plugin-cache.type";

import { applyPluginRuleDocumentationUrls } from "./apply-plugin-rule-documentation-urls.utility";

/**
 * Returns a cached decorated plugin while preserving plugin object identity across config blocks.
 * @param {TRuleDocumentationPluginCache} pluginCache - Cache scoped to one config formatting pass
 * @param {ESLint.Plugin} plugin - Original plugin object
 * @param {string} pluginName - Final plugin name from the flat config
 * @returns {ESLint.Plugin} Cached plugin with decorated rule metadata
 */
export function getPluginWithRuleDocumentationUrls(pluginCache: TRuleDocumentationPluginCache, plugin: ESLint.Plugin, pluginName: string): ESLint.Plugin {
	const cacheByPluginName: WeakMap<ESLint.Plugin, ESLint.Plugin> = pluginCache.get(pluginName) ?? new WeakMap<ESLint.Plugin, ESLint.Plugin>();
	const cachedPlugin: ESLint.Plugin | undefined = cacheByPluginName.get(plugin);

	if (cachedPlugin) {
		return cachedPlugin;
	}

	const pluginWithDocumentationUrls: ESLint.Plugin = applyPluginRuleDocumentationUrls(plugin, pluginName);

	cacheByPluginName.set(plugin, pluginWithDocumentationUrls);
	pluginCache.set(pluginName, cacheByPluginName);

	return pluginWithDocumentationUrls;
}
