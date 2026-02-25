import type { ESLint, Rule } from "eslint";

const noAutofocusRule: Rule.RuleModule = {
	create(context) {
		return {
			JSXAttribute(node) {
				if (node.name.type !== "JSXIdentifier") {
					return;
				}

				if (node.name.name !== "autoFocus") {
					return;
				}

				context.report({
					messageId: "noAutofocus",
					node,
				});
			},
		};
	},
	meta: {
		docs: {
			description: "Disallow autoFocus prop for accessibility reasons.",
			recommended: true,
		},
		messages: {
			noAutofocus: "Avoid using autoFocus in JSX elements.",
		},
		schema: [],
		type: "suggestion",
	},
};

export const jsxA11yCompatPlugin: ESLint.Plugin = {
	rules: {
		"no-autofocus": noAutofocusRule,
	},
};
