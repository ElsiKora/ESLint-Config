import type { RuleDefinition } from "@eslint/core";

import { createRuleDocumentationUrl } from "./create-rule-documentation-url.utility";

/**
 * Applies an ElsiKora documentation URL to a single rule definition.
 * @param {RuleDefinition} rule - Rule definition to decorate
 * @param {string} ruleId - Final ESLint rule id
 * @returns {RuleDefinition} Rule definition with decorated docs metadata
 */
export function applyRuleDocumentationUrl(rule: RuleDefinition, ruleId: string): RuleDefinition {
	return {
		...rule,
		meta: {
			...rule.meta,
			docs: {
				...rule.meta?.docs,
				url: createRuleDocumentationUrl(ruleId),
			},
		},
	};
}
