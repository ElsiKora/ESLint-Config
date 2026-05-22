import type { RuleDefinition } from "@eslint/core";
import type { ESLint } from "eslint";

import { applyRuleDocumentationUrl } from "./apply-rule-documentation-url.utility";

/**
 * Applies ElsiKora documentation URLs to every rule in a plugin.
 * @param {ESLint.Plugin} plugin - ESLint plugin to decorate
 * @param {string} pluginName - Final plugin name from the flat config
 * @returns {ESLint.Plugin} Plugin with decorated rule metadata
 */
export function applyPluginRuleDocumentationUrls(plugin: ESLint.Plugin, pluginName: string): ESLint.Plugin {
	if (!plugin.rules || !pluginName.startsWith("@elsikora/")) {
		return plugin;
	}

	const pluginRules: Record<string, RuleDefinition> = plugin.rules;
	const rules: Record<string, RuleDefinition> = {};

	for (const [ruleName, rule] of Object.entries(pluginRules)) {
		rules[ruleName] = applyRuleDocumentationUrl(rule, `${pluginName}/${ruleName}`);
	}

	return {
		...plugin,
		rules,
	};
}
