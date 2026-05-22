/**
 * Normalizes final ESLint rule ids into documentation route namespaces.
 * @param {string} ruleId - Final ESLint rule id
 * @returns {string} Rule id normalized for documentation routing
 */
export function normalizeRuleIdForDocumentation(ruleId: string): string {
	if (ruleId.startsWith("@elsikora/")) {
		return ruleId.replace("@elsikora/", "");
	}

	if (!ruleId.includes("/")) {
		return `javascript/${ruleId}`;
	}

	return `external/${ruleId.replace(/^@/, "")}`;
}
