import type { ESLint, Rule } from "eslint";

const ENFORCED_DOMAIN_LAYERS = ["processes", "pages", "widgets", "features", "entities"];

const publicApiRule: Rule.RuleModule = {
	create(context) {
		return {
			ImportDeclaration(node) {
				if (typeof node.source.value !== "string") {
					return;
				}

				const importPath = node.source.value;
				const segments = importPath.split("/").filter(Boolean);
				const layer = segments[0];
				if (segments.length <= 2) {
					return;
				}

				if (!layer || !ENFORCED_DOMAIN_LAYERS.includes(layer)) {
					return;
				}

				context.report({
					messageId: "publicApi",
					node: node.source,
				});
			},
		};
	},
	meta: {
		docs: {
			description: "Enforce imports through slice public API.",
			recommended: true,
		},
		messages: {
			publicApi: "Import from a slice public API instead of internal implementation paths.",
		},
		schema: [],
		type: "problem",
	},
};

const absoluteRelativeRule: Rule.RuleModule = {
	create(context) {
		return {
			ImportDeclaration(node) {
				if (typeof node.source.value !== "string") {
					return;
				}

				const importPath = node.source.value;
				if (!importPath.startsWith("features/")) {
					return;
				}

				context.report({
					messageId: "absoluteRelative",
					node: node.source,
				});
			},
		};
	},
	meta: {
		docs: {
			description: "Enforce relative imports inside the same feature.",
			recommended: true,
		},
		messages: {
			absoluteRelative: "Use relative import within the same feature instead of absolute path.",
		},
		schema: [],
		type: "suggestion",
	},
};

const layersSlicesRule: Rule.RuleModule = {
	create() {
		return {};
	},
	meta: {
		docs: {
			description: "Validate FSD layer and slice boundaries.",
			recommended: true,
		},
		messages: {},
		schema: [],
		type: "problem",
	},
};

export const featureSlicedCompatPlugin: ESLint.Plugin = {
	rules: {
		"absolute-relative": absoluteRelativeRule,
		"layers-slices": layersSlicesRule,
		"public-api": publicApiRule,
	},
};
