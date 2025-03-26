import type { ESLint, Linter } from "eslint";

// eslint-disable-next-line @elsikora/sonar/deprecation
import { builtinRules } from "eslint/use-at-your-own-risk";

export function createVirtualEslintPlugin(configs: Array<Linter.Config>, prefix: string = "@elsikora/javascript"): Array<Linter.Config> {
	const result: Array<Linter.Config> = [];

	const virtualPluginRules: Record<string, any> = {};

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
