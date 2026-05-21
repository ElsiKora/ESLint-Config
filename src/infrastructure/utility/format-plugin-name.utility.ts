import PLUGIN_MAP from "../constant/utility/plugin-map.constant";

/**
 * Formats a plugin name according to mapping rules
 * @param {string} pluginName - The name of the plugin to format
 * @returns {string} The formatted plugin name
 */
export function formatPluginName(pluginName: string): string {
	for (const [oldName, newName] of getSortedPluginMapEntries()) {
		if (pluginName === oldName) {
			return pluginName.replace(pluginName, newName);
		}
	}

	return pluginName;
}

/**
 * Returns plugin map entries sorted by longest source plugin name first.
 * @returns {Array<[string, string]>} Sorted plugin map entries
 */
function getSortedPluginMapEntries(): Array<[string, string]> {
	// eslint-disable-next-line @elsikora/unicorn/no-array-sort
	return Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length);
}
