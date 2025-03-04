import PLUGIN_MAP from "../constant/utility/plugin-map.constant";

function formatPluginName(pluginName: string): string {
	for (const [oldName, newName] of Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length)) {
		if (pluginName === oldName) {
			return pluginName.replace(pluginName, newName);
		}
	}

	return pluginName;
}

export { formatPluginName };
