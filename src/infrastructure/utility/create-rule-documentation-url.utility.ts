import { createRuleDocumentationSlug } from "./create-rule-documentation-slug.utility";
import { RULE_DOCUMENTATION_BASE_URL } from "./rule-documentation-base-url.constant";

/**
 * Creates the public ElsiKora docs URL for a final ESLint rule id.
 * @param {string} ruleId - Final rule id as shown by ESLint
 * @returns {string} Public documentation URL
 */
export function createRuleDocumentationUrl(ruleId: string): string {
	return `${RULE_DOCUMENTATION_BASE_URL}/${createRuleDocumentationSlug(ruleId)}`;
}
