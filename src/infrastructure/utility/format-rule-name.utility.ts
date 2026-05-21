import PLUGIN_MAP from "../constant/utility/plugin-map.constant";

/**
 * Formats a rule name according to mapping rules
 * @param {string} ruleName - The name of the rule to format
 * @returns {string} The formatted rule name
 */
export function formatRuleName(ruleName: string): string {
	for (const [oldName, newName] of getSortedPluginMapEntries()) {
		const oldPrefix: string = `${oldName}/`;

		if (ruleName.startsWith(oldPrefix)) {
			return ruleName.replace(oldPrefix, `${newName}/`);
		}
	}

	return ruleName;
}

/**
 * Returns plugin map entries sorted by longest source plugin name first.
 * @returns {Array<[string, string]>} Sorted plugin map entries
 */
function getSortedPluginMapEntries(): Array<[string, string]> {
	// eslint-disable-next-line @elsikora/unicorn/no-array-sort
	return Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length);
}
