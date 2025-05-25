import type { RuleDefinition } from "@eslint/core";
import type { ESLint, Linter } from "eslint";

// eslint-disable-next-line @elsikora/sonar/deprecation
import { builtinRules } from "eslint/use-at-your-own-risk";

/**
 * Creates a virtual ESLint plugin from the provided configurations
 * @param {Array<Linter.Config>} configs - The ESLint configurations to use
 * @param {string} prefix - The prefix to use for the virtual plugin
 * @returns {Array<Linter.Config>} An array of ESLint configurations with the virtual plugin
 */
export function createVirtualEslintPlugin(configs: Array<Linter.Config>, prefix: string = "@elsikora/javascript"): Array<Linter.Config> {
	const result: Array<Linter.Config> = [];

	const virtualPluginRules: Record<string, RuleDefinition> = {};

	// eslint-disable-next-line @elsikora/sonar/deprecation
	for (const [ruleName, rule] of builtinRules) {
		virtualPluginRules[ruleName] = rule;
	}

	const virtualPlugin: ESLint.Plugin = {
		rules: virtualPluginRules,
	};

	result.push({
		plugins: {
			[prefix]: virtualPlugin,
		},
	});

	for (const config of configs) {
		const newConfig: Linter.Config = { ...config };

		if (newConfig.rules) {
			const prefixedRules: Partial<Linter.RulesRecord> = {};

			for (const [ruleName, ruleValue] of Object.entries(newConfig.rules)) {
				// eslint-disable-next-line @elsikora/sonar/deprecation
				if (!ruleName.includes("/") && [...builtinRules.keys()].includes(ruleName)) {
					prefixedRules[`${prefix}/${ruleName}`] = ruleValue;
				} else {
					prefixedRules[ruleName] = ruleValue;
				}
			}

			newConfig.rules = prefixedRules;
		}

		result.push(newConfig);
	}

	return result;
}
