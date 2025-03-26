import PLUGIN_MAP from "../constant/utility/plugin-map.constant";

/**
 * Formats a rule name according to mapping rules
 * @param {string} ruleName - The name of the rule to format
 * @returns {string} The formatted rule name
 */
export function formatRuleName(ruleName: string): string {
	for (const [oldName, newName] of Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length)) {
		const oldPrefix: string = `${oldName}/`;

		if (ruleName.startsWith(oldName)) {
			return ruleName.replace(oldPrefix, `${newName}/`);
		}
	}

	return ruleName;
}
