import type { ESLint, Rule } from "eslint";

const decoratorArrayItemsRule: Rule.RuleModule = {
	create(context) {
		return {
			Decorator(node: any) {
				if (node.expression.type !== "CallExpression" || node.expression.callee.type !== "Identifier" || node.expression.callee.name !== "Module") {
					return;
				}

				const metadata = node.expression.arguments.at(0);
				if (!metadata || metadata.type !== "ObjectExpression") {
					return;
				}

				for (const property of metadata.properties) {
					if (property.type !== "Property" || property.key.type !== "Identifier" || property.key.name !== "imports") {
						continue;
					}

					if (property.value.type !== "ArrayExpression") {
						continue;
					}

					const names = property.value.elements
						.filter((element: any) => Boolean(element) && element.type === "Identifier")
						.map((element: any) => element.name as string);

					if (names.length <= 1) {
						continue;
					}

					const sortedNames = [...names].sort((first, second) => first.localeCompare(second));
					const isSorted = names.every((name: string, index: number) => name === sortedNames[index]);

					if (isSorted) {
						continue;
					}

					context.report({
						messageId: "decoratorArrayItems",
						node: property.value,
					});
				}
			},
		};
	},
	meta: {
		docs: {
			description: "Sort items in Module decorator arrays.",
			recommended: true,
		},
		messages: {
			decoratorArrayItems: "Sort module metadata array items in ascending order.",
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					reverseSort: {
						type: "boolean",
					},
				},
				type: "object",
			},
		],
		type: "suggestion",
	},
};

export const ngModuleSortCompatPlugin: ESLint.Plugin = {
	rules: {
		"decorator-array-items": decoratorArrayItemsRule,
	},
};
