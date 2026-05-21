import { normalizeRuleIdForDocumentation } from "./normalize-rule-id-for-documentation.utility";

/**
 * Creates a docs route slug from a final ESLint rule id.
 * @param {string} ruleId - Final ESLint rule id
 * @returns {string} URL-safe documentation slug
 */
export function createRuleDocumentationSlug(ruleId: string): string {
	const normalizedRuleId: string = normalizeRuleIdForDocumentation(ruleId);

	return normalizedRuleId
		.split("/")
		.map((slugPart: string) => encodeURIComponent(slugPart))
		.join("/");
}
