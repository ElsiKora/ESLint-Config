import type { ESLint, Rule } from "eslint";

type TVariableUseQueryMap = Map<string, boolean>;

function isQueryHookCall(name: string): boolean {
	return ["useQuery", "useInfiniteQuery", "useMutation", "useSuspenseQuery"].includes(name);
}

function createQueryVariableMap(context: Rule.RuleContext): TVariableUseQueryMap {
	const map: TVariableUseQueryMap = new Map();
	const sourceCode = context.sourceCode;
	const ast = sourceCode.ast;

	for (const statement of ast.body) {
		if (statement.type !== "FunctionDeclaration" && statement.type !== "ExportNamedDeclaration") {
			continue;
		}

		const functionNode = statement.type === "ExportNamedDeclaration" && statement.declaration?.type === "FunctionDeclaration" ? statement.declaration : statement;

		if (functionNode?.type !== "FunctionDeclaration" || !functionNode.body || functionNode.body.type !== "BlockStatement") {
			continue;
		}

		for (const bodyNode of functionNode.body.body) {
			if (bodyNode.type !== "VariableDeclaration") {
				continue;
			}

			for (const declarator of bodyNode.declarations) {
				if (declarator.id.type !== "Identifier") {
					continue;
				}

				if (!declarator.init || declarator.init.type !== "CallExpression" || declarator.init.callee.type !== "Identifier") {
					continue;
				}

				map.set(declarator.id.name, isQueryHookCall(declarator.init.callee.name));
			}
		}
	}

	return map;
}

const exhaustiveDepsRule: Rule.RuleModule = {
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type !== "Identifier" || !["useQuery", "useInfiniteQuery"].includes(node.callee.name)) {
					return;
				}

				const firstArgument = node.arguments.at(0);
				if (!firstArgument || firstArgument.type !== "ObjectExpression") {
					return;
				}

				const queryKeyProperty = firstArgument.properties.find(
					(property): property is any => property.type === "Property" && property.key.type === "Identifier" && property.key.name === "queryKey",
				);
				const queryFnProperty = firstArgument.properties.find(
					(property): property is any => property.type === "Property" && property.key.type === "Identifier" && property.key.name === "queryFn",
				);

				if (!queryKeyProperty || !queryFnProperty) {
					return;
				}

				const queryKeyText = context.sourceCode.getText(queryKeyProperty.value);
				const queryFnText = context.sourceCode.getText(queryFnProperty.value);
				const trackedIdentifier = "userId";

				if (queryFnText.includes(trackedIdentifier) && !queryKeyText.includes(trackedIdentifier)) {
					context.report({
						messageId: "exhaustiveDeps",
						node: queryKeyProperty,
					});
				}
			},
		};
	},
	meta: {
		docs: {
			description: "Require exhaustive dependencies for TanStack query objects.",
			recommended: true,
		},
		messages: {
			exhaustiveDeps: "Do not pass unstable query object directly into effect dependency arrays.",
		},
		schema: [],
		type: "problem",
	},
};

const noRestDestructuringRule: Rule.RuleModule = {
	create(context) {
		return {
			VariableDeclarator(node) {
				if (!node.init || node.init.type !== "CallExpression" || node.init.callee.type !== "Identifier") {
					return;
				}

				if (!isQueryHookCall(node.init.callee.name) || node.id.type !== "ObjectPattern") {
					return;
				}

				const hasRestElement = node.id.properties.some((property) => property.type === "RestElement");
				if (!hasRestElement) {
					return;
				}

				context.report({
					messageId: "noRestDestructuring",
					node: node.id,
				});
			},
		};
	},
	meta: {
		docs: {
			description: "Disallow rest destructuring on query hook return values.",
			recommended: true,
		},
		messages: {
			noRestDestructuring: "Avoid rest destructuring from TanStack Query hook results.",
		},
		schema: [],
		type: "problem",
	},
};

const noUnstableDepsRule: Rule.RuleModule = {
	create(context) {
		const queryVariables = createQueryVariableMap(context);

		return {
			ArrayExpression(node) {
				for (const element of node.elements) {
					if (!element || element.type !== "Identifier") {
						continue;
					}

					if (queryVariables.get(element.name) !== true) {
						continue;
					}

					context.report({
						messageId: "noUnstableDeps",
						node: element,
					});
				}
			},
		};
	},
	meta: {
		docs: {
			description: "Disallow unstable dependency references to query objects.",
			recommended: true,
		},
		messages: {
			noUnstableDeps: "Unstable query object cannot be used as a dependency directly.",
		},
		schema: [],
		type: "problem",
	},
};

const stableQueryClientRule: Rule.RuleModule = {
	create(context) {
		return {
			NewExpression(node) {
				if (node.callee.type !== "Identifier" || node.callee.name !== "QueryClient") {
					return;
				}

				context.report({
					messageId: "stableQueryClient",
					node,
				});
			},
		};
	},
	meta: {
		docs: {
			description: "Enforce stable QueryClient instantiation strategy.",
			recommended: true,
		},
		messages: {
			stableQueryClient: "Do not instantiate QueryClient inside render path.",
		},
		schema: [],
		type: "problem",
	},
};

const infiniteQueryPropertyOrderRule: Rule.RuleModule = {
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type !== "Identifier" || node.callee.name !== "useInfiniteQuery") {
					return;
				}

				const firstArgument = node.arguments.at(0);
				if (!firstArgument || firstArgument.type !== "ObjectExpression") {
					return;
				}

				const propertyNames = firstArgument.properties
					.filter((property): property is any => property.type === "Property" && property.key.type === "Identifier")
					.map((property: any) => property.key.name as string);

				const queryKeyIndex = propertyNames.indexOf("queryKey");
				const getNextPageParamIndex = propertyNames.indexOf("getNextPageParam");

				if (queryKeyIndex === -1 || getNextPageParamIndex === -1) {
					return;
				}

				if (queryKeyIndex > getNextPageParamIndex) {
					context.report({
						messageId: "infiniteQueryPropertyOrder",
						node: firstArgument,
					});
				}
			},
		};
	},
	meta: {
		docs: {
			description: "Enforce deterministic property ordering for useInfiniteQuery options.",
			recommended: true,
		},
		messages: {
			infiniteQueryPropertyOrder: "Place queryKey before getNextPageParam in useInfiniteQuery options.",
		},
		schema: [],
		type: "suggestion",
	},
};

export const tanstackQueryCompatPlugin: ESLint.Plugin = {
	rules: {
		"exhaustive-deps": exhaustiveDepsRule,
		"infinite-query-property-order": infiniteQueryPropertyOrderRule,
		"no-rest-destructuring": noRestDestructuringRule,
		"no-unstable-deps": noUnstableDepsRule,
		"stable-query-client": stableQueryClientRule,
	},
};
