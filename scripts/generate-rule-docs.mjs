import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { ESLint } from "eslint";
import prettier from "prettier";

import createConfig, { createRuleDocumentationSlug } from "../dist/esm/index.js";

const ALL_CONFIG_OPTIONS = {
	withCheckFile: true,
	withCss: true,
	withFsd: true,
	withI18next: true,
	withJavascript: true,
	withJsDoc: true,
	withJson: true,
	withJsx: true,
	withMarkdown: true,
	withNest: true,
	withNext: true,
	withNode: true,
	withNoSecrets: true,
	withPackageJson: true,
	withPerfectionist: true,
	withPrettier: true,
	withReact: true,
	withRegexp: true,
	withSonar: true,
	withStorybook: true,
	withStylistic: true,
	withTailwindCss: true,
	withTanstack: true,
	withTypeorm: true,
	withTypescript: true,
	withTypescriptStrict: true,
	withUnicorn: true,
	withYaml: true,
};

const SCENARIOS = [
	createScenario("check-file", { withCheckFile: true }),
	createScenario("css", { withCss: true }),
	createScenario("fsd", { withFsd: true }),
	createScenario("i18next", { withI18next: true }),
	createScenario("javascript", { withJavascript: true }),
	createScenario("jsdoc", { withJsDoc: true }),
	createScenario("json", { withJson: true }),
	createScenario("jsx", { withJsx: true }),
	createScenario("markdown", { withMarkdown: true }),
	createScenario("nest", { withNest: true }),
	createScenario("next", { withNext: true }),
	createScenario("node", { withNode: true }),
	createScenario("no-secrets", { withNoSecrets: true }),
	createScenario("package-json", { withPackageJson: true }),
	createScenario("perfectionist", { withPerfectionist: true }),
	createScenario("prettier", { withPrettier: true }),
	createScenario("react", { withReact: true }),
	createScenario("regexp", { withRegexp: true }),
	createScenario("sonar", { withSonar: true }),
	createScenario("storybook", { withStorybook: true }),
	createScenario("stylistic", { withStylistic: true }),
	createScenario("tailwind-css", { withTailwindCss: true }),
	createScenario("tanstack", { withTanstack: true }),
	createScenario("typeorm", { withTypeorm: true }),
	createScenario("typescript", { withTypescript: true }),
	createScenario("typescript-strict", { withTypescriptStrict: true }),
	createScenario("unicorn", { withUnicorn: true }),
	createScenario("yaml", { withYaml: true }),
	createScenario("javascript-with-sonar", { withJavascript: true, withSonar: true }),
	createScenario("node-with-unicorn", { withNode: true, withUnicorn: true }),
	createScenario("typescript-with-unicorn", { withTypescript: true, withUnicorn: true }),
	createScenario("typescript-strict-with-unicorn", { withTypescriptStrict: true, withUnicorn: true }),
	createScenario("perfectionist-with-fsd", { withFsd: true, withPerfectionist: true }),
	createScenario("all-options", ALL_CONFIG_OPTIONS),
];

const DOCS_ROOT = path.resolve("docs");
const RULES_ROOT = path.join(DOCS_ROOT, "rules");

const EFFECTIVE_CONFIG_TARGETS = [
	createEffectiveConfigTarget("JavaScript", "src/example.js"),
	createEffectiveConfigTarget("JSX", "src/example.jsx"),
	createEffectiveConfigTarget("TypeScript", "src/example.ts"),
	createEffectiveConfigTarget("TSX", "src/example.tsx"),
	createEffectiveConfigTarget("Next pages", "pages/index.jsx"),
	createEffectiveConfigTarget("Next app", "app/page.tsx"),
	createEffectiveConfigTarget("Storybook", "src/example.stories.tsx"),
	createEffectiveConfigTarget("Package JSON", "package.json"),
	createEffectiveConfigTarget("JSON", "config.json"),
	createEffectiveConfigTarget("YAML", "config.yaml"),
	createEffectiveConfigTarget("Markdown", "README.md"),
	createEffectiveConfigTarget("CSS", "src/styles.css"),
];

const ruleEntries = await collectRuleEntries();

await rm(RULES_ROOT, { force: true, recursive: true });
await writeDocsRoot(ruleEntries);
await writeRulePages(ruleEntries);
await writeNavigation(ruleEntries);

process.stdout.write(`Generated ${ruleEntries.length} rule documentation pages.\n`);

async function collectRuleEntries() {
	const entriesByRuleId = new Map();

	for (const scenario of SCENARIOS) {
		const configs = await createConfig(scenario.options);
		const metadataByRuleId = collectRuleMetadata(configs);

		for (const [configIndex, config] of configs.entries()) {
			for (const [ruleId, value] of Object.entries(config.rules ?? {})) {
				if (!shouldDocumentRule(ruleId)) {
					continue;
				}

				const metadata = metadataByRuleId.get(ruleId);
				const entry = entriesByRuleId.get(ruleId) ?? createRuleEntry(ruleId, scenario.id, configIndex, metadata);

				entry.occurrences.push({
					configIndex,
					scenarioId: scenario.id,
					value,
				});

				entriesByRuleId.set(ruleId, entry);
			}
		}

		const eslint = new ESLint({
			baseConfig: configs,
			overrideConfigFile: true,
		});

		for (const target of EFFECTIVE_CONFIG_TARGETS) {
			const effectiveConfig = await eslint.calculateConfigForFile(target.filePath);

			if (!effectiveConfig) {
				continue;
			}

			for (const [ruleId, value] of Object.entries(effectiveConfig.rules ?? {})) {
				if (!shouldDocumentRule(ruleId)) {
					continue;
				}

				const metadata = metadataByRuleId.get(ruleId);
				const entry = entriesByRuleId.get(ruleId) ?? createRuleEntry(ruleId, scenario.id, -1, metadata);

				entry.effectiveOccurrences.push({
					filePath: target.filePath,
					scenarioId: scenario.id,
					targetId: target.id,
					value,
				});

				entriesByRuleId.set(ruleId, entry);
			}
		}
	}

	return [...entriesByRuleId.values()].sort((left, right) => left.ruleId.localeCompare(right.ruleId));
}

function collectRuleMetadata(configs) {
	const metadataByRuleId = new Map();

	for (const config of configs) {
		for (const [pluginName, plugin] of Object.entries(config.plugins ?? {})) {
			for (const [ruleName, rule] of Object.entries(plugin.rules ?? {})) {
				const ruleId = `${pluginName}/${ruleName}`;

				if (!metadataByRuleId.has(ruleId)) {
					metadataByRuleId.set(ruleId, {
						defaultOptions: rule.defaultOptions,
						deprecated: Boolean(rule.meta?.deprecated),
						description: rule.meta?.docs?.description,
						docsRecommended: rule.meta?.docs?.recommended,
						fixable: rule.meta?.fixable,
						hasSuggestions: Boolean(rule.meta?.hasSuggestions),
						schema: rule.meta?.schema,
						type: rule.meta?.type,
					});
				}
			}
		}
	}

	return metadataByRuleId;
}

function createRuleEntry(ruleId, scenarioId, configIndex, metadata = {}) {
	const slug = createRuleDocumentationSlug(ruleId);
	const segments = slug.split("/");
	const shortName = segments.at(-1) ?? ruleId;

	return {
		metadata,
		effectiveOccurrences: [],
		occurrences: [],
		primaryConfigIndex: configIndex,
		primaryScenarioId: scenarioId,
		ruleId,
		segments,
		shortName,
		slug,
	};
}

function createRuleVariableName(entry) {
	const baseName = entry.shortName
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean)
		.map((part, index) => (index === 0 ? part.toLowerCase() : capitalizeIdentifier(part.toLowerCase())))
		.join("");

	if (!baseName) {
		return "rule";
	}

	return /^\d/.test(baseName) ? `rule${capitalizeIdentifier(baseName)}` : baseName;
}

function createScenario(id, options) {
	return { id, options };
}

function createEffectiveConfigTarget(id, filePath) {
	return { filePath, id };
}

function shouldDocumentRule(ruleId) {
	return ruleId.startsWith("@elsikora/") || !ruleId.includes("/");
}

function createStatus(entry) {
	const occurrences = getStatusOccurrences(entry);
	const severities = new Set(occurrences.map((occurrence) => getRuleSeverity(occurrence.value)));

	if (severities.has("error")) {
		return { callout: "error", emoji: "🚨", label: "Error", summary: "ElsiKora reports this rule as an error in at least one preset scenario." };
	}

	if (severities.has("warn")) {
		return { callout: "warning", emoji: "⚠️", label: "Warning", summary: "ElsiKora reports this rule as a warning in at least one preset scenario." };
	}

	return { callout: "info", emoji: "🧭", label: "Disabled", summary: "ElsiKora includes this rule as an intentional disabled override in at least one preset scenario." };
}

function createDescription(entry) {
	if (typeof entry.metadata.description === "string" && entry.metadata.description.length > 0) {
		return sentenceCase(entry.metadata.description);
	}

	return createFallbackDescription(entry);
}

function createExample(entry, mode) {
	const examplePair = createExamplePair(entry);

	return mode === "bad" ? examplePair.bad : examplePair.good;
}

function createExamplePair(entry) {
	const language = getExampleLanguage(entry);
	const family = entry.segments[0];

	if (entry.ruleId === "@elsikora/javascript/no-console") {
		return {
			bad: {
				code: 'console.log("debug");\nconsole.error("unexpected failure");',
				language: "js",
			},
			good: {
				code: 'logger.info("User profile loaded");\nlogger.error("Unexpected failure", { cause: error });',
				language: "js",
			},
		};
	}

	if (entry.ruleId === "@elsikora/typescript/no-explicit-any") {
		return {
			bad: {
				code: "function parsePayload(payload: any) {\n\treturn payload.id;\n}",
				language: "ts",
			},
			good: {
				code: "interface Payload {\n\tid: string;\n}\n\nfunction parsePayload(payload: Payload): string {\n\treturn payload.id;\n}",
				language: "ts",
			},
		};
	}

	if (family === "javascript") {
		return createJavaScriptExamplePair(entry);
	}

	if (family === "typescript") {
		return createTypeScriptExamplePair(entry);
	}

	if (family === "no-secrets") {
		return createNoSecretsExamplePair(entry);
	}

	if (family === "prettier") {
		return createPrettierExamplePair();
	}

	if (family === "sonar") {
		return createSonarExamplePair(entry);
	}

	if (family === "unicorn") {
		return createUnicornExamplePair(entry);
	}

	if (family === "perfectionist") {
		return createPerfectionistExamplePair(entry);
	}

	if (family === "jsdoc") {
		return createJsdocExamplePair(entry);
	}

	if (family === "json") {
		return createJsonExamplePair(entry);
	}

	if (family === "package-json") {
		return createPackageJsonExamplePair(entry);
	}

	if (family === "css") {
		return createCssExamplePair(entry);
	}

	if (family === "tailwindcss") {
		return createTailwindExamplePair(entry);
	}

	if (family === "node") {
		return createNodeExamplePair(entry);
	}

	if (family === "typeorm") {
		return createTypeormExamplePair(entry);
	}

	if (family === "tanstack") {
		return createTanstackExamplePair(entry);
	}

	if (family === "nest") {
		return createNestExamplePair(entry);
	}

	if (family === "sort-decorators") {
		return createSortDecoratorsExamplePair(entry);
	}

	if (family === "fsd") {
		return createFsdExamplePair(entry);
	}

	if (family === "stylistic") {
		return createStylisticExamplePair(entry);
	}

	if (family === "storybook") {
		return createStorybookExamplePair(entry);
	}

	if (family === "markdown") {
		return createMarkdownExamplePair(entry);
	}

	if (family === "i18next") {
		return createI18nextExamplePair(entry);
	}

	if (family === "yaml" || family === "yml") {
		return createYamlExamplePair(entry);
	}

	if (language === "json") {
		return createJsonExamplePair(entry);
	}

	if (language === "yaml") {
		return createYamlExamplePair(entry);
	}

	if (language === "tsx") {
		return createTsxExamplePair(entry);
	}

	if (entry.ruleId.includes("naming") || entry.ruleId.includes("filename") || entry.ruleId.includes("folder")) {
		return {
			bad: {
				code: 'const Bad_Name = "value";\nexport { Bad_Name };',
				language,
			},
			good: {
				code: 'const goodName = "value";\nexport { goodName };',
				language,
			},
		};
	}

	if (entry.ruleId.includes("sort") || entry.ruleId.includes("order")) {
		return {
			bad: {
				code: 'const orderedItems = ["beta", "alpha"];\nexport { orderedItems };',
				language,
			},
			good: {
				code: 'const orderedItems = ["alpha", "beta"];\nexport { orderedItems };',
				language,
			},
		};
	}

	return {
		bad: {
			code: createGeneralBadExample(entry),
			language,
		},
		good: {
			code: createGeneralGoodExample(entry),
			language,
		},
	};
}

function createFallbackDescription(entry) {
	const family = entry.segments[0] ?? "JavaScript";
	const familyTitle = formatTitle(family);

	if (family === "prettier") {
		return "Runs Prettier as an ESLint rule so formatting differences are reported together with the rest of the preset.";
	}

	if (family === "javascript") {
		return `Documents the core ESLint \`${entry.shortName}\` rule as it appears in the ElsiKora JavaScript preset, including overrides that may change its final severity.`;
	}

	if (family === "sonar") {
		return `Documents the Sonar rule \`${entry.shortName}\`, which focuses on reliability, security, maintainability, or code-smell checks surfaced through the ElsiKora preset.`;
	}

	if (family === "unicorn") {
		return `Documents the Unicorn rule \`${entry.shortName}\`, which keeps JavaScript and TypeScript code modern, explicit, and easier to review.`;
	}

	return `Documents \`${entry.ruleId}\` in the ${familyTitle} preset, including its upstream metadata, ElsiKora defaults, and effective value after ESLint resolves overrides.`;
}

function createGeneralBadExample(entry) {
	const ruleName = entry.shortName;
	const variableName = createRuleVariableName(entry);

	if (ruleName.startsWith("no-")) {
		return `const ${variableName} = loadConfiguration();
${variableName}.enabled = false;
export { ${variableName} };`;
	}

	if (ruleName.startsWith("prefer-")) {
		return `const ${variableName}Items = items.filter((item) => item.enabled);
const ${variableName}Result = ${variableName}Items.length > 0;
export { ${variableName}Result };`;
	}

	if (/(sort|order)/.test(ruleName)) {
		return `const ${variableName}Items = ["zeta", "alpha"];
const ${variableName}Primary = ${variableName}Items[1];
const ${variableName}Secondary = ${variableName}Items[0];
export { ${variableName}Primary, ${variableName}Secondary };`;
	}

	return `const ${variableName}Payload = {
	id: source.id,
	enabled: source.enabled,
};
export { ${variableName}Payload };`;
}

function createGeneralGoodExample(entry) {
	const ruleName = entry.shortName;
	const variableName = createRuleVariableName(entry);

	if (ruleName.startsWith("no-")) {
		return `const ${variableName} = loadConfiguration();
const next${capitalizeIdentifier(variableName)} = { ...${variableName}, enabled: false };
export { next${capitalizeIdentifier(variableName)} };`;
	}

	if (ruleName.startsWith("prefer-")) {
		return `const ${variableName}Result = items.some((item) => item.enabled);
export { ${variableName}Result };`;
	}

	if (/(sort|order)/.test(ruleName)) {
		return `const ${variableName}Items = ["alpha", "zeta"];
const ${variableName}Primary = ${variableName}Items[0];
const ${variableName}Secondary = ${variableName}Items[1];
export { ${variableName}Primary, ${variableName}Secondary };`;
	}

	return `const ${variableName}Payload = normalizePayload(source);
export { ${variableName}Payload };`;
}

function createExamplePairFromCode(language, bad, good) {
	return {
		bad: {
			code: bad,
			language,
		},
		good: {
			code: good,
			language,
		},
	};
}

function createCssExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("empty-block")) {
		return createExamplePairFromCode("css", ".card {\n}", ".card {\n\tdisplay: grid;\n}");
	}

	if (ruleName.includes("duplicate-import")) {
		return createExamplePairFromCode("css", '@import "./theme.css";\n@import "./theme.css";\n\n.button {\n\tcolor: var(--accent);\n}', '@import "./theme.css";\n\n.button {\n\tcolor: var(--accent);\n}');
	}

	if (ruleName.includes("invalid-at-rule")) {
		return createExamplePairFromCode("css", "@medai (min-width: 48rem) {\n\t.card {\n\t\tdisplay: grid;\n\t}\n}", "@media (min-width: 48rem) {\n\t.card {\n\t\tdisplay: grid;\n\t}\n}");
	}

	if (ruleName.includes("invalid-properties")) {
		return createExamplePairFromCode("css", ".button {\n\tcolr: #1d4ed8;\n}", ".button {\n\tcolor: #1d4ed8;\n}");
	}

	if (ruleName.includes("baseline")) {
		return createExamplePairFromCode("css", ".dialog {\n\ttransition-behavior: allow-discrete;\n}", ".dialog {\n\tdisplay: grid;\n}");
	}

	return createExamplePairFromCode("css", ".button {\n\tcolor: rgb(255, 0, 0);\n\tmargin: 0px;\n}", ".button {\n\tcolor: #f00;\n\tmargin: 0;\n}");
}

function createJsonExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("no-comments")) {
		return createExamplePairFromCode("json", '{\n\t// Local override\n\t"enabled": true\n}', '{\n\t"enabled": true\n}');
	}

	if (ruleName.includes("no-dupe-keys")) {
		return createExamplePairFromCode("json", '{\n\t"enabled": true,\n\t"enabled": false\n}', '{\n\t"enabled": true\n}');
	}

	if (ruleName.includes("sort-keys")) {
		return createExamplePairFromCode("json", '{\n\t"version": 1,\n\t"name": "service"\n}', '{\n\t"name": "service",\n\t"version": 1\n}');
	}

	if (ruleName.includes("quote")) {
		return createExamplePairFromCode("json", "{\n\t'name': 'service'\n}", '{\n\t"name": "service"\n}');
	}

	if (ruleName.includes("valid-json-number") || ruleName.includes("nan") || ruleName.includes("infinity") || ruleName.includes("numeric")) {
		return createExamplePairFromCode("json", '{\n\t"retryDelay": Infinity\n}', '{\n\t"retryDelay": 3000\n}');
	}

	if (ruleName.includes("template") || ruleName.includes("regexp") || ruleName.includes("undefined")) {
		return createExamplePairFromCode("json", '{\n\t"pattern": /admin/,\n\t"value": undefined\n}', '{\n\t"pattern": "admin",\n\t"value": null\n}');
	}

	if (ruleName.includes("comma")) {
		return createExamplePairFromCode("json", '{\n\t"name": "service",\n}', '{\n\t"name": "service"\n}');
	}

	return createExamplePairFromCode("json", '{\n\t"enabled": true,\n\t"port": "3000"\n}', '{\n\t"enabled": true,\n\t"port": 3000\n}');
}

function createPackageJsonExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("order-properties") || ruleName.includes("sort-collections")) {
		return createExamplePairFromCode("json", '{\n\t"version": "1.0.0",\n\t"name": "example-package",\n\t"scripts": {\n\t\t"test": "vitest",\n\t\t"build": "tsc"\n\t}\n}', '{\n\t"name": "example-package",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"build": "tsc",\n\t\t"test": "vitest"\n\t}\n}');
	}

	if (ruleName.includes("unique-dependencies") || ruleName.includes("specify-peers")) {
		return createExamplePairFromCode("json", '{\n\t"dependencies": {\n\t\t"react": "^19.0.0"\n\t},\n\t"devDependencies": {\n\t\t"react": "^19.0.0"\n\t}\n}', '{\n\t"peerDependencies": {\n\t\t"react": "^19.0.0"\n\t},\n\t"devDependencies": {\n\t\t"@types/react": "^19.0.0"\n\t}\n}');
	}

	if (ruleName.startsWith("require-")) {
		const fieldName = ruleName.replace("require-", "");

		return createExamplePairFromCode("json", '{\n\t"name": "example-package"\n}', `{\n\t"name": "example-package",\n\t"${fieldName}": "TODO"\n}`);
	}

	if (ruleName.startsWith("valid-")) {
		const fieldName = ruleName.replace("valid-", "");

		return createExamplePairFromCode("json", `{\n\t"name": "example-package",\n\t"${fieldName}": 42\n}`, `{\n\t"name": "example-package",\n\t"${fieldName}": "documented-value"\n}`);
	}

	if (ruleName.includes("empty-fields")) {
		return createExamplePairFromCode("json", '{\n\t"name": "example-package",\n\t"description": ""\n}', '{\n\t"name": "example-package",\n\t"description": "Reusable ESLint preset."\n}');
	}

	if (ruleName.includes("redundant")) {
		return createExamplePairFromCode("json", '{\n\t"name": "example-package",\n\t"files": ["dist"],\n\t"publishConfig": {\n\t\t"files": ["dist"]\n\t}\n}', '{\n\t"name": "example-package",\n\t"files": ["dist"]\n}');
	}

	if (ruleName.includes("repository-shorthand")) {
		return createExamplePairFromCode("json", '{\n\t"name": "example-package",\n\t"repository": "github:org/example-package"\n}', '{\n\t"name": "example-package",\n\t"repository": {\n\t\t"type": "git",\n\t\t"url": "https://github.com/org/example-package.git"\n\t}\n}');
	}

	return createExamplePairFromCode("json", '{\n\t"name": "example-package",\n\t"version": 1\n}', '{\n\t"name": "example-package",\n\t"version": "1.0.0"\n}');
}

function createTailwindExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("classnames-order")) {
		return createExamplePairFromCode("tsx", '<div className="text-sm p-4 flex text-blue-600"></div>', '<div className="flex p-4 text-sm text-blue-600"></div>');
	}

	if (ruleName.includes("arbitrary-value")) {
		return createExamplePairFromCode("tsx", '<div className="mt-[16px] text-[#1d4ed8]"></div>', '<div className="mt-4 text-blue-700"></div>');
	}

	if (ruleName.includes("custom-classname")) {
		return createExamplePairFromCode("tsx", '<div className="cardShell flex rounded-lg"></div>', '<div className="flex rounded-lg border bg-white"></div>');
	}

	if (ruleName.includes("contradicting")) {
		return createExamplePairFromCode("tsx", '<button className="block hidden rounded"></button>', '<button className="hidden rounded"></button>');
	}

	if (ruleName.includes("shorthand")) {
		return createExamplePairFromCode("tsx", '<div className="pt-4 pr-4 pb-4 pl-4"></div>', '<div className="p-4"></div>');
	}

	if (ruleName.includes("migration")) {
		return createExamplePairFromCode("tsx", '<div className="flex-grow-0"></div>', '<div className="grow-0"></div>');
	}

	return createExamplePairFromCode("tsx", '<div className="text-sm p-4 flex text-blue-600"></div>', '<div className="flex p-4 text-sm text-blue-600"></div>');
}

function createPerfectionistExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName === "sort-classes") {
		return createExamplePairFromCode("ts", "class UserService {\n\tpublic save(): void {}\n\tprivate readonly repository: Repository;\n\tconstructor(repository: Repository) {\n\t\tthis.repository = repository;\n\t}\n}", "class UserService {\n\tprivate readonly repository: Repository;\n\tconstructor(repository: Repository) {\n\t\tthis.repository = repository;\n\t}\n\tpublic save(): void {}\n}");
	}

	if (ruleName === "sort-imports") {
		return createExamplePairFromCode("ts", 'import { z } from "zod";\nimport path from "node:path";\nimport { createUser } from "./create-user";', 'import path from "node:path";\nimport { z } from "zod";\nimport { createUser } from "./create-user";');
	}

	if (ruleName === "sort-interfaces") {
		return createExamplePairFromCode("ts", "interface UserProfile {\n\tupdatedAt: Date;\n\tid: string;\n\temail: string;\n}", "interface UserProfile {\n\temail: string;\n\tid: string;\n\tupdatedAt: Date;\n}");
	}

	if (ruleName === "sort-enums") {
		return createExamplePairFromCode("ts", 'enum Role {\n\tViewer = "viewer",\n\tAdmin = "admin",\n\tEditor = "editor",\n}', 'enum Role {\n\tAdmin = "admin",\n\tEditor = "editor",\n\tViewer = "viewer",\n}');
	}

	if (ruleName === "sort-switch-case") {
		return createExamplePairFromCode("ts", 'switch (status) {\n\tcase "ready":\n\t\treturn 200;\n\tcase "draft":\n\t\treturn 202;\n\tdefault:\n\t\treturn 500;\n}', 'switch (status) {\n\tcase "draft":\n\t\treturn 202;\n\tcase "ready":\n\t\treturn 200;\n\tdefault:\n\t\treturn 500;\n}');
	}

	if (ruleName === "sort-objects") {
		return createExamplePairFromCode("ts", 'const user = {\n\tname: "Ada",\n\tid: "user_1",\n\temail: "ada@example.com",\n};', 'const user = {\n\temail: "ada@example.com",\n\tid: "user_1",\n\tname: "Ada",\n};');
	}

	if (ruleName.includes("named-import")) {
		return createExamplePairFromCode("ts", 'import { zeta, alpha, beta } from "./schema";', 'import { alpha, beta, zeta } from "./schema";');
	}

	if (ruleName.includes("named-export")) {
		return createExamplePairFromCode("ts", 'export { zeta, alpha, beta } from "./schema";', 'export { alpha, beta, zeta } from "./schema";');
	}

	if (ruleName.includes("object-types")) {
		return createExamplePairFromCode("ts", "type UserProfile = {\n\tupdatedAt: Date;\n\tid: string;\n\temail: string;\n};", "type UserProfile = {\n\temail: string;\n\tid: string;\n\tupdatedAt: Date;\n};");
	}

	if (ruleName.includes("union") || ruleName.includes("intersection")) {
		return createExamplePairFromCode("ts", 'type Status = "ready" | "draft" | "archived";', 'type Status = "archived" | "draft" | "ready";');
	}

	if (ruleName.includes("jsx-props")) {
		return createExamplePairFromCode("tsx", '<Button variant="primary" disabled aria-label="Save" />', '<Button aria-label="Save" disabled variant="primary" />');
	}

	if (ruleName.includes("decorators")) {
		return createExamplePairFromCode("ts", '@UseGuards(AuthGuard)\n@Controller("users")\nexport class UserController {}', '@Controller("users")\n@UseGuards(AuthGuard)\nexport class UserController {}');
	}

	if (ruleName.includes("map")) {
		return createExamplePairFromCode("ts", 'const labels = new Map([\n\t["z", "Zulu"],\n\t["a", "Alpha"],\n]);', 'const labels = new Map([\n\t["a", "Alpha"],\n\t["z", "Zulu"],\n]);');
	}

	if (ruleName.includes("set") || ruleName.includes("array-includes")) {
		return createExamplePairFromCode("ts", 'const allowedRoles = ["viewer", "admin", "editor"] as const;', 'const allowedRoles = ["admin", "editor", "viewer"] as const;');
	}

	if (ruleName.includes("variable")) {
		return createExamplePairFromCode("ts", "const zebra = 2;\nconst apple = 1;\nexport { apple, zebra };", "const apple = 1;\nconst zebra = 2;\nexport { apple, zebra };");
	}

	return createExamplePairFromCode("ts", 'export { zeta } from "./zeta";\nexport { alpha } from "./alpha";', 'export { alpha } from "./alpha";\nexport { zeta } from "./zeta";');
}

function createJsdocExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("param")) {
		return createExamplePairFromCode("js", "/**\n * Formats a display name.\n * @returns {string} The display name.\n */\nfunction formatName(user) {\n\treturn user.name;\n}", "/**\n * Formats a display name.\n * @param {{ name: string }} user - User to format.\n * @returns {string} The display name.\n */\nfunction formatName(user) {\n\treturn user.name;\n}");
	}

	if (ruleName.includes("returns")) {
		return createExamplePairFromCode("js", '/**\n * Reads the current status.\n */\nfunction getStatus() {\n\treturn "ready";\n}', '/**\n * Reads the current status.\n * @returns {string} Current status.\n */\nfunction getStatus() {\n\treturn "ready";\n}');
	}

	if (ruleName.includes("throws") || ruleName.includes("rejects")) {
		return createExamplePairFromCode("js", "/**\n * Loads a user by id.\n * @param {string} id - User id.\n */\nfunction loadUser(id) {\n\tthrow new Error(`Missing user: ${id}`);\n}", "/**\n * Loads a user by id.\n * @param {string} id - User id.\n * @throws {Error} When the user cannot be found.\n */\nfunction loadUser(id) {\n\tthrow new Error(`Missing user: ${id}`);\n}");
	}

	if (ruleName.includes("yields") || ruleName.includes("next")) {
		return createExamplePairFromCode("js", "/**\n * Iterates enabled users.\n */\nfunction* enabledUsers(users) {\n\tyield* users.filter((user) => user.enabled);\n}", "/**\n * Iterates enabled users.\n * @param {Array<{ enabled: boolean }>} users - Users to inspect.\n * @yields {{ enabled: boolean }} Enabled user.\n */\nfunction* enabledUsers(users) {\n\tyield* users.filter((user) => user.enabled);\n}");
	}

	if (ruleName.includes("property")) {
		return createExamplePairFromCode("js", "/**\n * @typedef {object} UserProfile\n * @property id\n */", "/**\n * @typedef {object} UserProfile\n * @property {string} id - Stable user id.\n */");
	}

	if (ruleName.includes("example")) {
		return createExamplePairFromCode("js", "/**\n * Adds two numbers.\n * @param {number} left - Left value.\n * @param {number} right - Right value.\n * @returns {number} Sum.\n */\nfunction add(left, right) {\n\treturn left + right;\n}", "/**\n * Adds two numbers.\n * @param {number} left - Left value.\n * @param {number} right - Right value.\n * @returns {number} Sum.\n * @example\n * add(1, 2);\n */\nfunction add(left, right) {\n\treturn left + right;\n}");
	}

	if (ruleName.includes("sort-tags") || ruleName.includes("tag-lines") || ruleName.includes("check-tag") || ruleName.includes("check-values")) {
		return createExamplePairFromCode("js", "/**\n * Saves a user.\n * @returns {Promise<void>} Resolves when saved.\n * @param {User} user - User to save.\n */\nasync function saveUser(user) {\n\tawait repository.save(user);\n}", "/**\n * Saves a user.\n * @param {User} user - User to save.\n * @returns {Promise<void>} Resolves when saved.\n */\nasync function saveUser(user) {\n\tawait repository.save(user);\n}");
	}

	if (ruleName.includes("type") || ruleName.includes("typescript") || ruleName.includes("ts-")) {
		return createExamplePairFromCode("ts", "/**\n * Parses a page number.\n * @param {*} value - Unknown value.\n * @returns {*} Parsed page.\n */\nfunction parsePage(value: unknown): number {\n\treturn Number(value);\n}", "/**\n * Parses a page number.\n * @param {unknown} value - Unknown value.\n * @returns {number} Parsed page.\n */\nfunction parsePage(value: unknown): number {\n\treturn Number(value);\n}");
	}

	if (ruleName.includes("blank") || ruleName.includes("alignment") || ruleName.includes("indentation") || ruleName.includes("asterisk") || ruleName.includes("multiline")) {
		return createExamplePairFromCode("js", "/**\n*Formats a display name.\n*@param {User} user User to format.\n*/\nfunction formatName(user) {\n\treturn user.name;\n}", "/**\n * Formats a display name.\n * @param {User} user - User to format.\n * @returns {string} Display name.\n */\nfunction formatName(user) {\n\treturn user.name;\n}");
	}

	return createExamplePairFromCode("js", "/**\n * Handles the request.\n */\nfunction handleRequest(request) {\n\treturn request.id;\n}", "/**\n * Handles the request.\n * @param {{ id: string }} request - Request to handle.\n * @returns {string} Request id.\n */\nfunction handleRequest(request) {\n\treturn request.id;\n}");
}

function createNodeExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName === "hashbang") {
		return createExamplePairFromCode("js", 'console.log("Run maintenance");', '#!/usr/bin/env node\nconsole.log("Run maintenance");');
	}

	if (ruleName === "exports-style" || ruleName === "no-exports-assign") {
		return createExamplePairFromCode("js", "exports = {\n\tcreateUser,\n};", "module.exports = {\n\tcreateUser,\n};");
	}

	if (ruleName.includes("unsupported-features")) {
		return createExamplePairFromCode("js", "const groups = Object.groupBy(users, (user) => user.role);", "const groups = groupUsersByRole(users);");
	}

	if (ruleName === "process-exit-as-throw" || ruleName === "no-process-exit") {
		return createExamplePairFromCode("js", "if (!config.valid) {\n\tprocess.exit(1);\n}", 'if (!config.valid) {\n\tthrow new Error("Invalid configuration");\n}');
	}

	if (ruleName.includes("missing") || ruleName.includes("extraneous") || ruleName.includes("unpublished")) {
		return createExamplePairFromCode("js", 'import helper from "../scripts/local-helper.js";\n\nhelper();', 'import { createLogger } from "./logger.js";\n\ncreateLogger().info("ready");');
	}

	if (ruleName.includes("deprecated")) {
		return createExamplePairFromCode("js", 'import { Buffer } from "node:buffer";\n\nconst payload = new Buffer("value");', 'import { Buffer } from "node:buffer";\n\nconst payload = Buffer.from("value");');
	}

	return createExamplePairFromCode("js", 'import fs from "fs";\n\nfs.readFileSync("config.json");', 'import fs from "node:fs";\n\nfs.readFileSync("config.json");');
}

function createTypeormExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("relation")) {
		return createExamplePairFromCode("ts", "@Entity()\nclass Order {\n\t@ManyToOne(() => User)\n\tuser: string;\n}", "@Entity()\nclass Order {\n\t@ManyToOne(() => User)\n\tuser: User;\n}");
	}

	if (ruleName.includes("nullability")) {
		return createExamplePairFromCode("ts", "@Column({ nullable: true })\nname: string;", "@Column({ nullable: true })\nname: string | null;");
	}

	return createExamplePairFromCode("ts", "@Column()\ncreatedAt: Date;", '@Column({ type: "timestamptz" })\ncreatedAt: Date;');
}

function createTanstackExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("property-order")) {
		return createExamplePairFromCode("ts", 'createRoute({\n\tcomponent: UsersPage,\n\tpath: "/users",\n\tgetParentRoute: () => rootRoute,\n});', 'createRoute({\n\tgetParentRoute: () => rootRoute,\n\tpath: "/users",\n\tcomponent: UsersPage,\n});');
	}

	if (ruleName.includes("stable-query-client")) {
		return createExamplePairFromCode("tsx", "export function App() {\n\tconst queryClient = new QueryClient();\n\treturn <QueryClientProvider client={queryClient} />;\n}", "const queryClient = new QueryClient();\n\nexport function App() {\n\treturn <QueryClientProvider client={queryClient} />;\n}");
	}

	if (ruleName.includes("rest-destructuring")) {
		return createExamplePairFromCode("tsx", "const { data, ...query } = useQuery(options);", "const query = useQuery(options);\nconst data = query.data;");
	}

	if (ruleName.includes("deps") || ruleName.includes("unstable")) {
		return createExamplePairFromCode("tsx", 'useQuery({\n\tqueryKey: ["user"],\n\tqueryFn: () => fetchUser(userId),\n});', 'useQuery({\n\tqueryKey: ["user", userId],\n\tqueryFn: () => fetchUser(userId),\n});');
	}

	return createExamplePairFromCode("tsx", 'useInfiniteQuery({\n\tqueryFn: fetchProjects,\n\tqueryKey: ["projects"],\n\tinitialPageParam: 0,\n});', 'useInfiniteQuery({\n\tqueryKey: ["projects"],\n\tqueryFn: fetchProjects,\n\tinitialPageParam: 0,\n});');
}

function createNestExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("api-method")) {
		return createExamplePairFromCode("ts", '@Get(":id")\nfindOne(@Param("id") id: string) {\n\treturn this.users.findOne(id);\n}', '@ApiOperation({ summary: "Get a user" })\n@ApiOkResponse({ type: UserDto })\n@Get(":id")\nfindOne(@Param("id") id: string) {\n\treturn this.users.findOne(id);\n}');
	}

	if (ruleName.includes("guard")) {
		return createExamplePairFromCode("ts", '@Controller("users")\nexport class UserController {}', '@UseGuards(AuthGuard)\n@Controller("users")\nexport class UserController {}');
	}

	if (ruleName.includes("api-property") || ruleName.includes("enum")) {
		return createExamplePairFromCode("ts", "class CreateUserDto {\n\t@ApiProperty()\n\troles: Role[];\n}", "class CreateUserDto {\n\t@ApiProperty({ enum: Role, isArray: true })\n\troles: Role[];\n}");
	}

	if (ruleName.includes("validated") || ruleName.includes("whitelisted") || ruleName.includes("defined")) {
		return createExamplePairFromCode("ts", "class CreateUserDto {\n\t@IsString()\n\tprofile: ProfileDto;\n}", "class CreateUserDto {\n\t@ValidateNested()\n\t@Type(() => ProfileDto)\n\tprofile: ProfileDto;\n}");
	}

	if (ruleName.includes("sort-module")) {
		return createExamplePairFromCode("ts", "@Module({\n\tproviders: [UserService, AuthService],\n\tcontrollers: [UserController],\n})\nexport class UserModule {}", "@Module({\n\tcontrollers: [UserController],\n\tproviders: [AuthService, UserService],\n})\nexport class UserModule {}");
	}

	if (ruleName.includes("duplicate-decorators")) {
		return createExamplePairFromCode("ts", '@Controller("users")\n@Controller("members")\nexport class UserController {}', '@Controller("users")\nexport class UserController {}');
	}

	if (ruleName.includes("param-decorator")) {
		return createExamplePairFromCode("ts", '@Get(":userId")\nfindOne(@Param("id") userId: string) {\n\treturn this.users.findOne(userId);\n}', '@Get(":userId")\nfindOne(@Param("userId") userId: string) {\n\treturn this.users.findOne(userId);\n}');
	}

	return createExamplePairFromCode("ts", "@Controller()\nexport class UserController {}", '@ApiTags("users")\n@Controller("users")\nexport class UserController {}');
}

function createSortDecoratorsExamplePair(entry) {
	const target = entry.shortName.replace("sort-on-", "");

	if (target.includes("parameter")) {
		return createExamplePairFromCode("ts", 'class UserController {\n\tfind(@Body() body: BodyDto, @Param("id") id: string) {}\n}', 'class UserController {\n\tfind(@Param("id") id: string, @Body() body: BodyDto) {}\n}');
	}

	return createExamplePairFromCode("ts", 'class UserController {\n\t@UseGuards(AuthGuard)\n\t@Get(":id")\n\tfindOne() {}\n}', 'class UserController {\n\t@Get(":id")\n\t@UseGuards(AuthGuard)\n\tfindOne() {}\n}');
}

function createFsdExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("ordered-imports")) {
		return createExamplePairFromCode("ts", 'import { createOrder } from "@/features/order";\nimport { Button } from "@/shared/ui";\nimport { UserCard } from "@/entities/user";', 'import { Button } from "@/shared/ui";\nimport { UserCard } from "@/entities/user";\nimport { createOrder } from "@/features/order";');
	}

	if (ruleName.includes("relative") || ruleName.includes("public-api")) {
		return createExamplePairFromCode("ts", 'import { UserCard } from "../../entities/user/ui/UserCard";', 'import { UserCard } from "@/entities/user";');
	}

	if (ruleName.includes("cross") || ruleName.includes("forbidden") || ruleName.includes("global-store")) {
		return createExamplePairFromCode("ts", 'import { checkoutModel } from "@/features/checkout/model/private-model";', 'import { checkoutActions } from "@/features/checkout";');
	}

	return createExamplePairFromCode("tsx", 'import { userModel } from "@/entities/user/model";\n\nexport function PriceTag() {\n\treturn userModel.getCurrentUser();\n}', "type PriceTagProps = {\n\tvalue: string;\n};\n\nexport function PriceTag({ value }: PriceTagProps) {\n\treturn <span>{value}</span>;\n}");
}

function createI18nextExamplePair() {
	return createExamplePairFromCode("tsx", "export function SubmitButton() {\n\treturn <button>Save profile</button>;\n}", 'export function SubmitButton() {\n\treturn <button>{t("profile.save")}</button>;\n}');
}

function createMarkdownExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("empty-link")) {
		return createExamplePairFromCode("md", "[Documentation]()", "[Documentation](https://elsikora.com/docs)");
	}

	if (ruleName.includes("missing-label")) {
		return createExamplePairFromCode("md", "Read the [setup guide][setup].", "Read the [setup guide][setup].\n\n[setup]: https://elsikora.com/docs/setup");
	}

	if (ruleName.includes("invalid-label")) {
		return createExamplePairFromCode("md", "Read the [setup guide][missing].\n\n[setup]: https://elsikora.com/docs/setup", "Read the [setup guide][setup].\n\n[setup]: https://elsikora.com/docs/setup");
	}

	return createExamplePairFromCode("md", "#Guide\n\nParagraph with  trailing spaces  ", "# Guide\n\nParagraph without trailing spaces");
}

function createStorybookExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("renderer")) {
		return createExamplePairFromCode("ts", 'import { render } from "@storybook/react";\n\nexport { render };', 'import type { Meta } from "@storybook/react";\n\nexport const meta: Meta = {};');
	}

	if (ruleName.includes("uninstalled-addons")) {
		return createExamplePairFromCode("ts", 'const config = {\n\taddons: ["@storybook/addon-links", "@storybook/addon-not-installed"],\n};\n\nexport default config;', 'const config = {\n\taddons: ["@storybook/addon-links"],\n};\n\nexport default config;');
	}

	if (ruleName.includes("redundant-story-name")) {
		return createExamplePairFromCode("ts", 'export const Primary = {\n\tname: "Primary",\n};', "export const Primary = {};");
	}

	return createExamplePairFromCode("ts", "export const Primary = {\n\targs: {},\n};", 'export const Primary = {\n\targs: {\n\t\tlabel: "Save",\n\t},\n};');
}

function createStylisticExamplePair(entry) {
	if (entry.segments.includes("jsx") || entry.shortName.startsWith("jsx-")) {
		return createStylisticJsxExamplePair(entry);
	}

	const baseExample = createJavaScriptExamplePair(entry);
	const language = entry.segments.includes("ts") ? "ts" : baseExample.bad.language;

	return {
		bad: {
			code: baseExample.bad.code,
			language,
		},
		good: {
			code: baseExample.good.code,
			language,
		},
	};
}

function createYamlExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("sort")) {
		return createExamplePairFromCode("yaml", "service:\n  version: 1\n  name: api", "service:\n  name: api\n  version: 1");
	}

	if (ruleName.includes("dupe")) {
		return createExamplePairFromCode("yaml", "service:\n  enabled: true\n  enabled: false", "service:\n  enabled: true");
	}

	if (ruleName.includes("indent")) {
		return createExamplePairFromCode("yaml", "service:\n enabled: true", "service:\n  enabled: true");
	}

	return createExamplePairFromCode("yaml", "service:\n  enabled: yes\n  retries: 03", "service:\n  enabled: true\n  retries: 3");
}

function capitalizeIdentifier(value) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function createJavaScriptExamplePair(entry) {
	const ruleName = entry.shortName;

	switch (ruleName) {
		case "arrow-body-style":
			return createExamplePairFromCode("js", "const names = users.map((user) => {\n\treturn user.name;\n});\nexport { names };", "const names = users.map((user) => user.name);\nexport { names };");

		case "arrow-parens":
			return createExamplePairFromCode("js", "const names = users.map(user => user.name);\nexport { names };", "const names = users.map((user) => user.name);\nexport { names };");

		case "arrow-spacing":
			return createExamplePairFromCode("js", "const names = users.map((user)=>user.name);\nexport { names };", "const names = users.map((user) => user.name);\nexport { names };");

		case "computed-property-spacing":
			return createExamplePairFromCode("js", 'const id = user[ "id" ];\nexport { id };', 'const id = user["id"];\nexport { id };');

		case "dot-location":
			return createExamplePairFromCode("js", "const total = order\n\t.total;\nexport { total };", "const total = order.\n\ttotal;\nexport { total };");

		case "for-direction":
			return createExamplePairFromCode("js", "for (let index = 0; index < items.length; index--) {\n\tprocessItem(items[index]);\n}", "for (let index = 0; index < items.length; index++) {\n\tprocessItem(items[index]);\n}");

		case "generator-star":
			return createExamplePairFromCode("js", "function *createIds() {\n\tyield nextId();\n}\nexport { createIds };", "function* createIds() {\n\tyield nextId();\n}\nexport { createIds };");

		case "getter-return":
			return createExamplePairFromCode("js", "const account = {\n\tget id() {\n\t\taccountId;\n\t},\n};\nexport { account };", "const account = {\n\tget id() {\n\t\treturn accountId;\n\t},\n};\nexport { account };");

		case "jsx-quotes":
			return createExamplePairFromCode("tsx", 'const action = <Button label="Save" />;\nexport { action };', "const action = <Button label='Save' />;\nexport { action };");

		case "lines-around-comment":
			return createExamplePairFromCode("js", "const id = user.id;\n// Keep the cached value stable.\nconst cachedId = id;\nexport { cachedId };", "const id = user.id;\n\n// Keep the cached value stable.\nconst cachedId = id;\nexport { cachedId };");

		case "max-statements-per-line":
			return createExamplePairFromCode("js", "const id = user.id; const name = user.name;\nexport { id, name };", "const id = user.id;\nconst name = user.name;\nexport { id, name };");

		case "multiline-ternary":
			return createExamplePairFromCode("js", 'const label = isActive ? "Active" : "Inactive";\nexport { label };', 'const label = isActive\n\t? "Active"\n\t: "Inactive";\nexport { label };');

		case "new-parens":
			return createExamplePairFromCode("js", "const user = new User;\nexport { user };", "const user = new User();\nexport { user };");

		case "no-async-promise-executor":
			return createExamplePairFromCode("js", "const userPromise = new Promise(async (resolve) => {\n\tresolve(await loadUser());\n});\nexport { userPromise };", "const userPromise = loadUser();\nexport { userPromise };");

		case "no-await-in-loop":
			return createExamplePairFromCode("js", "for (const user of users) {\n\tawait sendWelcomeEmail(user);\n}", "await Promise.all(users.map((user) => sendWelcomeEmail(user)));");

		case "no-case-declarations":
			return createExamplePairFromCode("js", 'switch (status) {\n\tcase "ready":\n\t\tconst message = "Ready";\n\t\tshow(message);\n\t\tbreak;\n}', 'switch (status) {\n\tcase "ready": {\n\t\tconst message = "Ready";\n\t\tshow(message);\n\t\tbreak;\n\t}\n}');

		case "no-confusing-arrow":
			return createExamplePairFromCode("js", "const score = (isActive) => isActive ? 1 : 0;\nexport { score };", "const score = (isActive) => (isActive ? 1 : 0);\nexport { score };");

		case "no-control-regex":
			return createExamplePairFromCode("js", "const matcher = /\\x1f/;\nexport { matcher };", "const matcher = /[\\t ]/;\nexport { matcher };");

		case "no-debugger":
			return createExamplePairFromCode("js", "debugger;\nloadProfile();", 'logger.debug("Loading profile");\nloadProfile();');

		case "no-delete-var":
			return createExamplePairFromCode("js", "let cachedUser = readCachedUser();\ndelete cachedUser;", "let cachedUser = readCachedUser();\ncachedUser = undefined;");

		case "no-duplicate-case":
			return createExamplePairFromCode("js", 'switch (status) {\n\tcase "ready":\n\t\tstart();\n\t\tbreak;\n\tcase "ready":\n\t\tresume();\n\t\tbreak;\n}', 'switch (status) {\n\tcase "ready":\n\t\tstart();\n\t\tbreak;\n\tcase "paused":\n\t\tresume();\n\t\tbreak;\n}');

		case "no-empty":
			return createExamplePairFromCode("js", "if (isOptional) {\n}", "if (isOptional) {\n\tmarkOptionalPath();\n}");

		case "no-empty-function":
			return createExamplePairFromCode("js", "function handleRequest() {}\nexport { handleRequest };", "function handleRequest(request) {\n\treturn request.id;\n}\nexport { handleRequest };");

		case "no-extra-parens":
			return createExamplePairFromCode("js", "const total = (price + tax);\nexport { total };", "const total = price + tax;\nexport { total };");

		case "no-fallthrough":
			return createExamplePairFromCode("js", 'switch (status) {\n\tcase "queued":\n\t\tprepare();\n\tcase "ready":\n\t\tstart();\n}', 'switch (status) {\n\tcase "queued":\n\t\tprepare();\n\t\tbreak;\n\tcase "ready":\n\t\tstart();\n}');

		case "no-floating-decimal":
			return createExamplePairFromCode("js", "const taxRate = .2;\nexport { taxRate };", "const taxRate = 0.2;\nexport { taxRate };");

		case "no-invalid-regexp":
			return createExamplePairFromCode("js", 'const matcher = new RegExp("[");\nexport { matcher };', "const matcher = /[a-z]/;\nexport { matcher };");

		case "no-misleading-character-class":
			return createExamplePairFromCode("js", "const matcher = /[\\uD83D]/u;\nexport { matcher };", "const matcher = /\\u{1F600}/u;\nexport { matcher };");

		case "no-negated-condition":
			return createExamplePairFromCode("js", 'if (!user.active) {\n\tstatus = "inactive";\n} else {\n\tstatus = "active";\n}', 'if (user.active) {\n\tstatus = "active";\n} else {\n\tstatus = "inactive";\n}');

		case "no-nested-ternary":
			return createExamplePairFromCode("js", 'const label = isAdmin ? "Admin" : isEditor ? "Editor" : "Viewer";\nexport { label };', "const label = getRoleLabel(user);\nexport { label };");

		case "no-new-symbol":
			return createExamplePairFromCode("js", 'const id = new Symbol("id");\nexport { id };', 'const id = Symbol("id");\nexport { id };');

		case "no-obj-calls":
			return createExamplePairFromCode("js", "const value = Math();\nexport { value };", "const value = Math.max(first, second);\nexport { value };");

		case "no-redeclare":
			return createExamplePairFromCode("js", 'let status = "queued";\nlet status = "ready";\nexport { status };', 'let status = "queued";\nstatus = "ready";\nexport { status };');

		case "no-reserved-keys":
			return createExamplePairFromCode("js", "const user = { default: true };\nexport { user };", "const user = { isDefault: true };\nexport { user };");

		case "no-setter-return":
			return createExamplePairFromCode("js", "const account = {\n\tset name(value) {\n\t\treturn value.trim();\n\t},\n};\nexport { account };", "const account = {\n\tset name(value) {\n\t\tthis.normalizedName = value.trim();\n\t},\n};\nexport { account };");

		case "no-shadow-restricted-names":
			return createExamplePairFromCode("js", 'const undefined = "missing";\nexport { undefined };', 'const fallbackValue = "missing";\nexport { fallbackValue };');

		case "no-throw-literal":
			return createExamplePairFromCode("js", 'throw "Request failed";', 'throw new Error("Request failed");');

		case "no-unexpected-multiline":
			return createExamplePairFromCode("js", "const total = price + tax\n(discount || 0).toFixed(2);", "const total = price + tax;\n(discount || 0).toFixed(2);");

		case "no-unsafe-negation":
			return createExamplePairFromCode("js", "const missing = !key in user;\nexport { missing };", "const missing = !(key in user);\nexport { missing };");

		case "no-unused-expressions":
			return createExamplePairFromCode("js", "isReady && startJob;\nexport { isReady };", "if (isReady) {\n\tstartJob();\n}\nexport { isReady };");

		case "no-useless-backreference":
			return createExamplePairFromCode("js", "const matcher = /(a)\\2/;\nexport { matcher };", "const matcher = /(a)\\1/;\nexport { matcher };");

		case "no-with":
			return createExamplePairFromCode("js", "with (user) {\n\tshowProfile(name);\n}", "showProfile(user.name);");

		case "object-property-newline":
			return createExamplePairFromCode("js", 'const user = { id: "user_1", name: "Ada" };\nexport { user };', 'const user = {\n\tid: "user_1",\n\tname: "Ada",\n};\nexport { user };');

		case "prefer-promise-reject-errors":
			return createExamplePairFromCode("js", 'return Promise.reject("Request failed");', 'return Promise.reject(new Error("Request failed"));');

		case "preserve-caught-error":
			return createExamplePairFromCode("js", 'try {\n\tawait saveUser(user);\n} catch (error) {\n\tthrow new Error("Unable to save user");\n}', 'try {\n\tawait saveUser(user);\n} catch (error) {\n\tthrow new Error("Unable to save user", { cause: error });\n}');

		case "quote-props":
			return createExamplePairFromCode("js", 'const user = { "id": "user_1", "display-name": "Ada" };\nexport { user };', 'const user = { id: "user_1", "display-name": "Ada" };\nexport { user };');

		case "require-await":
			return createExamplePairFromCode("js", "async function loadUser(id) {\n\treturn userRepository.findById(id);\n}\nexport { loadUser };", "async function loadUser(id) {\n\treturn await userRepository.findById(id);\n}\nexport { loadUser };");

		case "require-yield":
			return createExamplePairFromCode("js", "function* createIds() {\n\treturn nextId();\n}\nexport { createIds };", "function* createIds() {\n\tyield nextId();\n}\nexport { createIds };");

		case "strict":
			return createExamplePairFromCode("js", "function loadUser() {\n\treturn this.user;\n}\nexport { loadUser };", '"use strict";\n\nfunction loadUser() {\n\treturn this.user;\n}\nexport { loadUser };');

		case "use-isnan":
			return createExamplePairFromCode("js", "const isInvalid = value === NaN;\nexport { isInvalid };", "const isInvalid = Number.isNaN(value);\nexport { isInvalid };");

		case "valid-typeof":
			return createExamplePairFromCode("js", 'const isString = typeof value === "strnig";\nexport { isString };', 'const isString = typeof value === "string";\nexport { isString };');

		case "wrap-iife":
			return createExamplePairFromCode("js", "const value = function () {\n\treturn createValue();\n}();\nexport { value };", "const value = (function () {\n\treturn createValue();\n})();\nexport { value };");

		case "wrap-regex":
			return createExamplePairFromCode("js", "const matches = /user/.test(input);\nexport { matches };", "const matches = (/user/).test(input);\nexport { matches };");

		default:
			break;
	}

	if (/(array-bracket|array-element)/.test(ruleName)) {
		return {
			bad: {
				code: 'const roles = [\n\t"admin", "editor", "viewer"\n];\nexport { roles };',
				language: "js",
			},
			good: {
				code: 'const roles = ["admin", "editor", "viewer"];\nexport { roles };',
				language: "js",
			},
		};
	}

	if (/(arrow|callback)/.test(ruleName)) {
		return {
			bad: {
				code: "const names = users.map(function (user) {\n\treturn user.name;\n});\nexport { names };",
				language: "js",
			},
			good: {
				code: "const names = users.map((user) => user.name);\nexport { names };",
				language: "js",
			},
		};
	}

	if (/(brace|block|curly|padded)/.test(ruleName)) {
		return {
			bad: {
				code: "if (isReady) startJob();",
				language: "js",
			},
			good: {
				code: "if (isReady) {\n\tstartJob();\n}",
				language: "js",
			},
		};
	}

	if (/(comma|semi)/.test(ruleName)) {
		return {
			bad: {
				code: 'const user = {\n\tid: "user_1",\n\tname: "Ada"\n}\nexport { user }',
				language: "js",
			},
			good: {
				code: 'const user = {\n\tid: "user_1",\n\tname: "Ada",\n};\nexport { user };',
				language: "js",
			},
		};
	}

	if (/(dot|property)/.test(ruleName)) {
		return {
			bad: {
				code: 'const city = user["address"].city;\nexport { city };',
				language: "js",
			},
			good: {
				code: "const city = user.address.city;\nexport { city };",
				language: "js",
			},
		};
	}

	if (/(empty|unused)/.test(ruleName)) {
		return {
			bad: {
				code: "const unusedUserId = request.user.id;\n\nfunction handleRequest() {}\nhandleRequest();",
				language: "js",
			},
			good: {
				code: "function handleRequest(request) {\n\treturn request.user.id;\n}\n\nexport { handleRequest };",
				language: "js",
			},
		};
	}

	if (/(eval|implied-eval|with)/.test(ruleName)) {
		return {
			bad: {
				code: 'const total = eval("price + tax");\nexport { total };',
				language: "js",
			},
			good: {
				code: "const total = price + tax;\nexport { total };",
				language: "js",
			},
		};
	}

	if (/(indent|linebreak|newline|max-len|operator|space|spacing|tabs)/.test(ruleName)) {
		return {
			bad: {
				code: "const total=items.reduce((sum,item)=>sum+item.price,0);\nexport {total};",
				language: "js",
			},
			good: {
				code: "const total = items.reduce((sum, item) => sum + item.price, 0);\nexport { total };",
				language: "js",
			},
		};
	}

	if (/(object|quote)/.test(ruleName)) {
		return {
			bad: {
				code: "const profile = { 'display-name': 'Ada', age: 36 };\nexport { profile };",
				language: "js",
			},
			good: {
				code: 'const profile = { "display-name": "Ada", age: 36 };\nexport { profile };',
				language: "js",
			},
		};
	}

	if (/(promise|await|return)/.test(ruleName)) {
		return {
			bad: {
				code: "async function loadUser(id) {\n\treturn await userRepository.findById(id);\n}\nexport { loadUser };",
				language: "js",
			},
			good: {
				code: "async function loadUser(id) {\n\treturn userRepository.findById(id);\n}\nexport { loadUser };",
				language: "js",
			},
		};
	}

	if (/(regex|regexp)/.test(ruleName)) {
		return {
			bad: {
				code: 'const matcher = new RegExp("^[a-z]+$");\nexport { matcher };',
				language: "js",
			},
			good: {
				code: "const matcher = /^[a-z]+$/;\nexport { matcher };",
				language: "js",
			},
		};
	}

	if (/(undef|assign|dupe|unreachable|constructor|super)/.test(ruleName)) {
		return {
			bad: {
				code: "const status = currentStatus;\nexport { status };",
				language: "js",
			},
			good: {
				code: 'const status = "ready";\nexport { status };',
				language: "js",
			},
		};
	}

	if (/(var|prefer-const|rest|spread)/.test(ruleName)) {
		return {
			bad: {
				code: "var userIds = Array.prototype.slice.call(arguments);\nexport { userIds };",
				language: "js",
			},
			good: {
				code: "const userIds = [...arguments];\nexport { userIds };",
				language: "js",
			},
		};
	}

	return createExamplePairFromCode("js", "const total=items.reduce((sum,item)=>sum+item.price,0);\nexport {total};", "const total = items.reduce((sum, item) => sum + item.price, 0);\nexport { total };");
}

function createTypeScriptExamplePair(entry) {
	const ruleName = entry.shortName;

	switch (ruleName) {
		case "await-thenable":
			return createExamplePairFromCode("ts", "async function loadCount(): Promise<number> {\n\treturn await 42;\n}\n\nexport { loadCount };", "async function loadCount(): Promise<number> {\n\treturn await countRepository.load();\n}\n\nexport { loadCount };");

		case "ban-ts-comment":
			return createExamplePairFromCode("ts", "// @ts-ignore\nconst id: string = user.id;\nexport { id };", "const id: string = String(user.id);\nexport { id };");

		case "consistent-type-definitions":
			return createExamplePairFromCode("ts", "type User = {\n\tid: string;\n};\n\nexport type { User };", "interface User {\n\tid: string;\n}\n\nexport type { User };");

		case "consistent-type-imports":
			return createExamplePairFromCode("ts", 'import { User } from "./user";\n\nconst currentUser: User = getCurrentUser();\nexport { currentUser };', 'import type { User } from "./user";\n\nconst currentUser: User = getCurrentUser();\nexport { currentUser };');

		case "naming-convention":
			return createExamplePairFromCode("ts", 'const User_Name = "Ada";\nexport { User_Name };', 'const userName = "Ada";\nexport { userName };');

		case "no-floating-promises":
			return createExamplePairFromCode("ts", "async function save(): Promise<void> {\n\tsaveUser(user);\n}\n\nexport { save };", "async function save(): Promise<void> {\n\tawait saveUser(user);\n}\n\nexport { save };");

		case "no-misused-promises":
			return createExamplePairFromCode("ts", "users.forEach(async (user) => {\n\tawait saveUser(user);\n});", "await Promise.all(users.map((user) => saveUser(user)));");

		case "no-non-null-assertion":
			return createExamplePairFromCode("ts", "const email = user.email!.toLowerCase();\nexport { email };", 'if (!user.email) {\n\tthrow new Error("User email is required");\n}\n\nconst email = user.email.toLowerCase();\nexport { email };');

		case "prefer-as-const":
			return createExamplePairFromCode("ts", 'const status = "ready" as "ready";\nexport { status };', 'const status = "ready" as const;\nexport { status };');

		case "prefer-includes":
			return createExamplePairFromCode("ts", 'const hasAdmin = roles.indexOf("admin") !== -1;\nexport { hasAdmin };', 'const hasAdmin = roles.includes("admin");\nexport { hasAdmin };');

		case "prefer-nullish-coalescing":
			return createExamplePairFromCode("ts", 'const label = input || "Untitled";\nexport { label };', 'const label = input ?? "Untitled";\nexport { label };');

		case "prefer-optional-chain":
			return createExamplePairFromCode("ts", "const city = user && user.profile && user.profile.address && user.profile.address.city;\nexport { city };", "const city = user?.profile?.address?.city;\nexport { city };");

		case "require-array-sort-compare":
			return createExamplePairFromCode("ts", "const sortedScores = scores.sort();\nexport { sortedScores };", "const sortedScores = scores.sort((left, right) => left - right);\nexport { sortedScores };");

		case "require-await":
			return createExamplePairFromCode("ts", "async function getUserName(user: User): Promise<string> {\n\treturn user.name;\n}\n\nexport { getUserName };", "async function getUserName(id: string): Promise<string> {\n\tconst user = await userRepository.findById(id);\n\treturn user.name;\n}\n\nexport { getUserName };");

		case "return-await":
			return createExamplePairFromCode("ts", 'async function loadUser(id: string): Promise<User> {\n\ttry {\n\t\treturn userRepository.findById(id);\n\t} catch (error) {\n\t\tthrow new Error("Unable to load user", { cause: error });\n\t}\n}', 'async function loadUser(id: string): Promise<User> {\n\ttry {\n\t\treturn await userRepository.findById(id);\n\t} catch (error) {\n\t\tthrow new Error("Unable to load user", { cause: error });\n\t}\n}');

		case "switch-exhaustiveness-check":
			return createExamplePairFromCode(
				"ts",
				'type Status = "queued" | "ready" | "failed";\n\nfunction label(status: Status): string {\n\tswitch (status) {\n\t\tcase "queued":\n\t\t\treturn "Queued";\n\t\tcase "ready":\n\t\t\treturn "Ready";\n\t}\n}',
				'type Status = "queued" | "ready" | "failed";\n\nfunction label(status: Status): string {\n\tswitch (status) {\n\t\tcase "queued":\n\t\t\treturn "Queued";\n\t\tcase "ready":\n\t\t\treturn "Ready";\n\t\tcase "failed":\n\t\t\treturn "Failed";\n\t}\n}',
			);

		default:
			break;
	}

	if (ruleName.startsWith("no-unsafe-")) {
		return createTypeScriptUnsafeExamplePair(ruleName);
	}

	if (/(brace-style|block-spacing|comma|func-call-spacing|indent|key-spacing|keyword-spacing|lines-around-comment|member-delimiter-style|object-curly-spacing|quotes|semi|space-|type-annotation-spacing)/.test(ruleName)) {
		return createExamplePairFromCode("ts", 'interface User{ id:string,name:string }\nconst user:User={id:"user_1",name:"Ada"}\nexport {user}', 'interface User {\n\tid: string;\n\tname: string;\n}\n\nconst user: User = { id: "user_1", name: "Ada" };\nexport { user };');
	}

	if (ruleName.startsWith("prefer-")) {
		return createTypeScriptPreferExamplePair(ruleName);
	}

	if (ruleName.startsWith("no-unnecessary-")) {
		return createExamplePairFromCode("ts", "function identity<Value extends unknown>(value: Value): Value {\n\treturn value as Value;\n}\n\nexport { identity };", "function identity<Value>(value: Value): Value {\n\treturn value;\n}\n\nexport { identity };");
	}

	if (/(array|type|interface|typedef|signature|generic|enum|namespace|import|export|declare)/.test(ruleName)) {
		return createExamplePairFromCode("ts", "type UserMap = {\n\t[key: string]: User;\n};\n\nexport type { UserMap };", "type UserMap = Record<string, User>;\n\nexport type { UserMap };");
	}

	if (/(await|promise|throw|return|template|operand|condition|boolean|void)/.test(ruleName)) {
		return createExamplePairFromCode("ts", "async function loadLabel(value: unknown): Promise<string> {\n\treturn `${value}`;\n}\n\nexport { loadLabel };", "async function loadLabel(value: string): Promise<string> {\n\treturn value;\n}\n\nexport { loadLabel };");
	}

	if (/(empty|unused|redeclare|constructor|class|method|readonly)/.test(ruleName)) {
		return createExamplePairFromCode("ts", "class UserService {\n\tconstructor(private readonly repository: UserRepository) {}\n\n\tload(id: string): Promise<User> {\n\t\treturn this.repository.findById(id);\n\t}\n}\n\nexport { UserService };", "class UserService {\n\tconstructor(private readonly repository: UserRepository) {}\n\n\tloadUser(id: string): Promise<User> {\n\t\treturn this.repository.findById(id);\n\t}\n}\n\nexport { UserService };");
	}

	return createExamplePairFromCode("ts", 'const userId = user["id"];\nexport { userId };', "const userId = user.id;\nexport { userId };");
}

function createTypeScriptPreferExamplePair(ruleName) {
	switch (ruleName) {
		case "prefer-find":
			return createExamplePairFromCode("ts", "const activeUser = users.filter((user) => user.active)[0];\nexport { activeUser };", "const activeUser = users.find((user) => user.active);\nexport { activeUser };");

		case "prefer-for-of":
			return createExamplePairFromCode("ts", "for (let index = 0; index < users.length; index++) {\n\tinvite(users[index]);\n}", "for (const user of users) {\n\tinvite(user);\n}");

		case "prefer-function-type":
			return createExamplePairFromCode("ts", "interface Formatter {\n\t(value: string): string;\n}\n\nexport type { Formatter };", "type Formatter = (value: string) => string;\n\nexport type { Formatter };");

		case "prefer-regexp-exec":
			return createExamplePairFromCode("ts", "const match = text.match(/[a-z]+/);\nexport { match };", "const match = /[a-z]+/.exec(text);\nexport { match };");

		case "prefer-string-starts-ends-with":
			return createExamplePairFromCode("ts", 'const isApiRoute = route.indexOf("/api/") === 0;\nexport { isApiRoute };', 'const isApiRoute = route.startsWith("/api/");\nexport { isApiRoute };');

		default:
			return createExamplePairFromCode("ts", "const activeUsers = users.filter((user) => user.active);\nexport { activeUsers };", "const activeUsers = users.filter(({ active }) => active);\nexport { activeUsers };");
	}
}

function createTypeScriptUnsafeExamplePair(ruleName) {
	switch (ruleName) {
		case "no-unsafe-argument":
			return createExamplePairFromCode("ts", "sendUser(JSON.parse(payload));", "const parsedUser = parseUser(payload);\nsendUser(parsedUser);");

		case "no-unsafe-assignment":
			return createExamplePairFromCode("ts", "const user: User = JSON.parse(payload);\nexport { user };", "const user = parseUser(payload);\nexport { user };");

		case "no-unsafe-call":
			return createExamplePairFromCode("ts", "const handler = JSON.parse(payload);\nhandler();", "const handler = parseHandler(payload);\nhandler();");

		case "no-unsafe-declaration-merging":
			return createExamplePairFromCode("ts", "interface User {}\nclass User {}\n\nexport { User };", "interface UserShape {}\nclass UserModel {}\n\nexport { UserModel };\nexport type { UserShape };");

		case "no-unsafe-enum-comparison":
			return createExamplePairFromCode("ts", 'enum Status {\n\tReady = "ready",\n}\n\nconst isReady = status === "ready";\nexport { isReady };', 'enum Status {\n\tReady = "ready",\n}\n\nconst isReady = status === Status.Ready;\nexport { isReady };');

		case "no-unsafe-function-type":
			return createExamplePairFromCode("ts", "let handler: Function;\nhandler = () => saveUser(user);\nexport { handler };", "let handler: () => Promise<void>;\nhandler = () => saveUser(user);\nexport { handler };");

		case "no-unsafe-member-access":
			return createExamplePairFromCode("ts", "const name = JSON.parse(payload).user.name;\nexport { name };", "const parsed = parseUserPayload(payload);\nconst name = parsed.user.name;\nexport { name };");

		case "no-unsafe-return":
			return createExamplePairFromCode("ts", "function parseUser(payload: string): User {\n\treturn JSON.parse(payload);\n}\n\nexport { parseUser };", "function parseUser(payload: string): User {\n\treturn userSchema.parse(JSON.parse(payload));\n}\n\nexport { parseUser };");

		case "no-unsafe-unary-minus":
			return createExamplePairFromCode("ts", "const offset = -value;\nexport { offset };", "const offset = -Number(value);\nexport { offset };");

		default:
			return createExamplePairFromCode("ts", "const user = JSON.parse(payload);\nexport { user };", "const user = userSchema.parse(JSON.parse(payload));\nexport { user };");
	}
}

function createNoSecretsExamplePair(entry) {
	if (entry.shortName === "no-pattern-match") {
		return {
			bad: {
				code: `const ${"Api"}Key = "checked-into-source";
const ${"Token"} = "local-debug-token";

export { ${"Api"}Key, ${"Token"} };`,
				language: "js",
			},
			good: {
				code: "const credentials = readCredentialsFromVault();\nconst sessionCredentials = await credentials.createSession();\n\nexport { sessionCredentials };",
				language: "js",
			},
		};
	}

	return {
		bad: {
			code: 'const signingSecret = "checked-into-source-secret-value";\n\nexport { signingSecret };',
			language: "js",
		},
		good: {
			code: "const signingCredentials = await secretManager.getSigningCredentials();\n\nexport { signingCredentials };",
			language: "js",
		},
	};
}

function createPrettierExamplePair() {
	return {
		bad: {
			code: "const invoiceTotal = calculateInvoiceTotal(cart.items, { includeTaxes: true });\n\nexport { invoiceTotal };",
			language: "js",
		},
		good: {
			code: "const invoiceTotal = calculateInvoiceTotal(cart.items, {\n\tincludeTaxes: true,\n});\n\nexport { invoiceTotal };",
			language: "js",
		},
	};
}

function createSonarExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("aws")) {
		return createExamplePairFromCode("ts", 'new s3.Bucket(this, "Assets", {\n\tpublicReadAccess: true,\n\tencryption: s3.BucketEncryption.UNENCRYPTED,\n});', 'new s3.Bucket(this, "Assets", {\n\tblockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,\n\tencryption: s3.BucketEncryption.S3_MANAGED,\n});');
	}

	if (/(todo|fixme|sonar-comments|commented-code)/.test(ruleName)) {
		return createExamplePairFromCode("js", "// TODO: disable billing validation before launch\nfunction validateBilling() {\n\treturn true;\n}", "function validateBilling(invoice) {\n\treturn invoice.total >= 0;\n}");
	}

	if (/(password|secret|mnemonic)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'const signingSecret = "prod-signing-secret";\nconnect({ signingSecret });', 'const signingSecret = await secrets.get("SIGNING_SECRET");\nconnect({ signingSecret });');
	}

	if (ruleName.includes("hardcoded-ip") || ruleName.includes("ip-forward")) {
		return createExamplePairFromCode("js", 'const apiHost = "10.0.0.12";\nfetch(`http://${apiHost}/health`);', "const apiHost = process.env.API_HOST;\nfetch(`https://${apiHost}/health`);");
	}

	if (/(sql|web-sql)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'db.query(`SELECT * FROM users WHERE email = "${request.query.email}"`);', 'db.query("SELECT * FROM users WHERE email = ?", [request.query.email]);');
	}

	if (/(xpath|xml-parser-xxe)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'const expression = `//user[name="${request.query.name}"]`;\ndocument.evaluate(expression, document);', 'const expression = "//user[@id=$id]";\nevaluateXPath(expression, { id: request.query.id });');
	}

	if (/(os-command|process-argv|standard-input|publicly-writable|unsafe-unzip)/.test(ruleName)) {
		return createExamplePairFromCode("js", "exec(`convert ${request.query.file} output.png`);", 'execFile("convert", [safeInputPath, "output.png"]);');
	}

	if (/(strict-transport|x-powered-by|referrer|mime|mixed-content|clear-text|cors|csrf|cookie|session|certificate|ssl|hostname|socket|post-message)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'app.use((request, response, next) => {\n\tresponse.setHeader("X-Powered-By", "Express");\n\tnext();\n});', 'app.use((request, response, next) => {\n\tresponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");\n\tresponse.setHeader("Referrer-Policy", "no-referrer");\n\tnext();\n});');
	}

	if (/(jsx|react|hook|key|table-header|alt-content|layout)/.test(ruleName)) {
		return createExamplePairFromCode("tsx", "export function UserList({ users }: Props) {\n\treturn users.map((user) => <UserCard user={user} />);\n}", "export function UserList({ users }: Props) {\n\treturn users.map((user) => <UserCard key={user.id} user={user} />);\n}");
	}

	if (/(regex|regexp|regular-expr|character-class|alternation|backreference|stateful)/.test(ruleName)) {
		return createExamplePairFromCode("js", "const matcher = /(a+)+$/;\nmatcher.test(input);", "const matcher = /^a+$/;\nmatcher.test(input);");
	}

	if (/(test|assert|done|skipped|exclusive)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'it("saves the user", () => {\n\tservice.save(user);\n});', 'it("saves the user", () => {\n\texpect(service.save(user)).toEqual(savedUser);\n});');
	}

	if (/(complexity|cognitive|cyclomatic)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'function price(order) {\n\tif (order.vip && order.region === "EU") {\n\t\treturn order.total * 0.8;\n\t}\n\n\treturn order.total;\n}', "function price(order) {\n\tconst discount = getCustomerDiscount(order.customer);\n\n\treturn applyDiscount(order.total, discount);\n}");
	}

	if (/(null|undefined|nan|number|arithmetic|convertible|ignored-return|empty|unused|dead-store)/.test(ruleName)) {
		return createExamplePairFromCode("js", "const total = Number(request.query.total);\nconst label = total.toFixed(2);", "const total = parseFiniteNumber(request.query.total);\nconst label = total.toFixed(2);");
	}

	if (/(duplicate|identical|redundant|useless|collapsible|nested|prefer|switch|boolean|return)/.test(ruleName)) {
		return createExamplePairFromCode("js", "if (user.isActive) {\n\treturn true;\n}\n\nreturn false;", "return user.isActive;");
	}

	return createExamplePairFromCode("js", "const payload = request.body;\nprocessPayload(payload);", "const payload = schema.parse(request.body);\nprocessPayload(payload);");
}

function createTsxExamplePair(entry) {
	if (hasRuleFamily(entry, "react")) {
		return createReactExamplePair(entry);
	}

	if (hasRuleFamily(entry, "next")) {
		return createNextExamplePair(entry);
	}

	if (hasRuleFamily(entry, "jsx") || isStylisticJsxRule(entry)) {
		return createJsxExamplePair(entry);
	}

	return createTsxCodeExamplePair("type Props = { value: any };\n\nexport function Badge(props: Props) {\n\treturn <span>{props.value}</span>;\n}", "type Props = { value: string };\n\nexport function Badge({ value }: Props) {\n\treturn <span>{value}</span>;\n}");
}

function createReactExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName === "rules-of-hooks") {
		return createTsxCodeExamplePair(
			`import { useEffect } from "react";

export function Notifications({ enabled }: { enabled: boolean }) {
	if (enabled) {
		useEffect(() => {
			subscribeToNotifications();
		}, []);
	}

	return <button type="button">Save preferences</button>;
}`,
			`import { useEffect } from "react";

export function Notifications({ enabled }: { enabled: boolean }) {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		return subscribeToNotifications();
	}, [enabled]);

	return <button type="button">Save preferences</button>;
}`,
		);
	}

	if (ruleName === "exhaustive-deps") {
		return createTsxCodeExamplePair(
			`import { useEffect, useState } from "react";

export function UserCard({ userId }: { userId: string }) {
	const [name, setName] = useState("");

	useEffect(() => {
		loadUser(userId).then((user) => setName(user.name));
	}, []);

	return <p>{name}</p>;
}`,
			`import { useEffect, useState } from "react";

export function UserCard({ userId }: { userId: string }) {
	const [name, setName] = useState("");

	useEffect(() => {
		loadUser(userId).then((user) => setName(user.name));
	}, [userId]);

	return <p>{name}</p>;
}`,
		);
	}

	if (ruleName === "use-state") {
		return createTsxCodeExamplePair(
			`import { useState } from "react";

export function Counter() {
	const counter = useState(0);

	return <button type="button" onClick={() => counter[1](counter[0] + 1)}>{counter[0]}</button>;
}`,
			`import { useState } from "react";

export function Counter() {
	const [count, setCount] = useState(0);

	return <button type="button" onClick={() => setCount(count + 1)}>{count}</button>;
}`,
		);
	}

	if (ruleName === "set-state-in-render") {
		return createTsxCodeExamplePair(
			`import { useState } from "react";

export function Selection({ selectedId }: { selectedId: string }) {
	const [currentId, setCurrentId] = useState("");

	if (currentId !== selectedId) {
		setCurrentId(selectedId);
	}

	return <output>{currentId}</output>;
}`,
			`export function Selection({ selectedId }: { selectedId: string }) {
	return <output>{selectedId}</output>;
}`,
		);
	}

	if (ruleName === "set-state-in-effect") {
		return createTsxCodeExamplePair(
			`import { useEffect, useState } from "react";

export function FullName({ firstName, lastName }: { firstName: string; lastName: string }) {
	const [fullName, setFullName] = useState("");

	useEffect(() => {
		setFullName(firstName + " " + lastName);
	}, [firstName, lastName]);

	return <p>{fullName}</p>;
}`,
			`export function FullName({ firstName, lastName }: { firstName: string; lastName: string }) {
	const fullName = firstName + " " + lastName;

	return <p>{fullName}</p>;
}`,
		);
	}

	if (ruleName === "no-array-index-key") {
		return createTsxCodeExamplePair(
			`export function TodoList({ todos }: { todos: Array<{ id: string; title: string }> }) {
	return (
		<ul>
			{todos.map((todo, index) => <li key={index}>{todo.title}</li>)}
		</ul>
	);
}`,
			`export function TodoList({ todos }: { todos: Array<{ id: string; title: string }> }) {
	return (
		<ul>
			{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}
		</ul>
	);
}`,
		);
	}

	if (ruleName === "no-missing-key") {
		return createTsxCodeExamplePair(
			`export function TagList({ tags }: { tags: Array<string> }) {
	return <ul>{tags.map((tag) => <li>{tag}</li>)}</ul>;
}`,
			`export function TagList({ tags }: { tags: Array<string> }) {
	return <ul>{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}`,
		);
	}

	if (ruleName === "jsx-no-key-after-spread") {
		return createTsxCodeExamplePair(
			`export function RowList({ rows }: { rows: Array<{ id: string; label: string }> }) {
	return rows.map((row) => {
		const rowProps = { children: row.label };

		return <div {...rowProps} key={row.id} />;
	});
}`,
			`export function RowList({ rows }: { rows: Array<{ id: string; label: string }> }) {
	return rows.map((row) => {
		const rowProps = { children: row.label };

		return <div key={row.id} {...rowProps} />;
	});
}`,
		);
	}

	if (ruleName === "dom-no-missing-button-type") {
		return createTsxCodeExamplePair(
			`export function SaveButton() {
	return <button onClick={saveDraft}>Save draft</button>;
}`,
			`export function SaveButton() {
	return <button type="button" onClick={saveDraft}>Save draft</button>;
}`,
		);
	}

	if (ruleName === "dom-no-dangerously-set-innerhtml" || ruleName === "dom-no-dangerously-set-innerhtml-with-children") {
		return createTsxCodeExamplePair(
			`export function ArticlePreview({ html }: { html: string }) {
	return <article dangerouslySetInnerHTML={{ __html: html }}>Preview</article>;
}`,
			`export function ArticlePreview({ title, summary }: { title: string; summary: string }) {
	return (
		<article>
			<h2>{title}</h2>
			<p>{summary}</p>
		</article>
	);
}`,
		);
	}

	if (ruleName === "dom-no-unknown-property") {
		return createTsxCodeExamplePair(
			`export function SearchField() {
	return <label for="query" class="field-label">Search</label>;
}`,
			`export function SearchField() {
	return <label htmlFor="query" className="field-label">Search</label>;
}`,
		);
	}

	if (ruleName === "no-direct-mutation-state") {
		return createTsxCodeExamplePair(
			`import { Component } from "react";

export class Counter extends Component<object, { count: number }> {
	state = { count: 0 };

	increment() {
		this.state.count += 1;
	}
}`,
			`import { Component } from "react";

export class Counter extends Component<object, { count: number }> {
	state = { count: 0 };

	increment() {
		this.setState((state) => ({ count: state.count + 1 }));
	}
}`,
		);
	}

	if (ruleName === "no-unstable-context-value") {
		return createTsxCodeExamplePair(
			`import { createContext } from "react";

const ThemeContext = createContext({ theme: "light" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return <ThemeContext.Provider value={{ theme: "dark" }}>{children}</ThemeContext.Provider>;
}`,
			`import { createContext, useMemo } from "react";

const ThemeContext = createContext({ theme: "light" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const value = useMemo(() => ({ theme: "dark" }), []);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}`,
		);
	}

	if (ruleName === "no-nested-component-definitions") {
		return createTsxCodeExamplePair(
			`export function Dashboard({ count }: { count: number }) {
	function CounterBadge() {
		return <strong>{count}</strong>;
	}

	return <CounterBadge />;
}`,
			`function CounterBadge({ count }: { count: number }) {
	return <strong>{count}</strong>;
}

export function Dashboard({ count }: { count: number }) {
	return <CounterBadge count={count} />;
}`,
		);
	}

	if (ruleName.includes("web-api-no-leaked")) {
		return createTsxCodeExamplePair(
			`import { useEffect } from "react";

export function WindowSize() {
	useEffect(() => {
		window.addEventListener("resize", reportSize);
	}, []);

	return <p>Resize the window</p>;
}`,
			`import { useEffect } from "react";

export function WindowSize() {
	useEffect(() => {
		window.addEventListener("resize", reportSize);

		return () => window.removeEventListener("resize", reportSize);
	}, []);

	return <p>Resize the window</p>;
}`,
		);
	}

	if (ruleName.includes("children")) {
		return createTsxCodeExamplePair(
			`export function Panel({ children }: { children: React.ReactNode }) {
	return <section children={children}>Fallback content</section>;
}`,
			`export function Panel({ children }: { children: React.ReactNode }) {
	return <section>{children}</section>;
}`,
		);
	}

	if (ruleName.includes("component-will") || ruleName.includes("unsafe-component") || ruleName.includes("set-state-in-component")) {
		return createTsxCodeExamplePair(
			`import { Component } from "react";

export class Profile extends Component<{ userId: string }, { loading: boolean }> {
	componentWillUpdate() {
		this.setState({ loading: true });
	}
}`,
			`import { Component } from "react";

export class Profile extends Component<{ userId: string }, { loading: boolean }> {
	componentDidUpdate(previousProps: { userId: string }) {
		if (previousProps.userId !== this.props.userId) {
			this.loadProfile();
		}
	}
}`,
		);
	}

	if (ruleName.includes("unsafe-target-blank")) {
		return createTsxCodeExamplePair(
			`export function ExternalDocsLink() {
	return <a href="https://example.com/docs" target="_blank">Open docs</a>;
}`,
			`export function ExternalDocsLink() {
	return <a href="https://example.com/docs" target="_blank" rel="noreferrer">Open docs</a>;
}`,
		);
	}

	if (ruleName.includes("iframe")) {
		return createTsxCodeExamplePair(
			`export function EmbeddedReport() {
	return <iframe src="https://reports.example.com" title="Quarterly report" />;
}`,
			`export function EmbeddedReport() {
	return <iframe src="https://reports.example.com" title="Quarterly report" sandbox="allow-scripts" />;
}`,
		);
	}

	if (ruleName.includes("script-url")) {
		return createTsxCodeExamplePair(
			`export function DeleteLink() {
	return <a href="javascript:deleteAccount()">Delete account</a>;
}`,
			`export function DeleteLink() {
	return <button type="button" onClick={deleteAccount}>Delete account</button>;
}`,
		);
	}

	if (ruleName.includes("void-elements")) {
		return createTsxCodeExamplePair(
			`export function Avatar() {
	return <img src="/avatar.png">User avatar</img>;
}`,
			`export function Avatar() {
	return <img src="/avatar.png" alt="User avatar" />;
}`,
		);
	}

	return createTsxCodeExamplePair(
		`type Props = { label: string };

export function StatusBadge(props: Props) {
	return <span className="status">{props.label}</span>;
}`,
		`type Props = { label: string };

export function StatusBadge({ label }: Props) {
	return <span className="status">{label}</span>;
}`,
	);
}

function createNextExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName === "no-img-element") {
		return createTsxCodeExamplePair(
			`export function HeroImage() {
	return <img src="/hero.jpg" alt="Product dashboard" width="1200" height="630" />;
}`,
			`import Image from "next/image";

export function HeroImage() {
	return <Image src="/hero.jpg" alt="Product dashboard" width={1200} height={630} priority />;
}`,
		);
	}

	if (ruleName === "no-html-link-for-pages") {
		return createTsxCodeExamplePair(
			`export function AccountNavigation() {
	return <a href="/account">Account</a>;
}`,
			`import Link from "next/link";

export function AccountNavigation() {
	return <Link href="/account">Account</Link>;
}`,
		);
	}

	if (ruleName.includes("script") || ruleName === "inline-script-id" || ruleName === "next-script-for-ga") {
		return createTsxCodeExamplePair(
			`import Head from "next/head";

export default function Page() {
	return (
		<Head>
			<script dangerouslySetInnerHTML={{ __html: "window.analyticsReady = true" }} />
		</Head>
	);
}`,
			`import Script from "next/script";

export default function Page() {
	return <Script id="analytics-ready" strategy="afterInteractive">{"window.analyticsReady = true"}</Script>;
}`,
		);
	}

	if (ruleName.includes("head") || ruleName.includes("document") || ruleName === "no-styled-jsx-in-document") {
		return createTsxCodeExamplePair(
			`import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head><title>Dashboard</title></Head>
				<body><Main /><NextScript /></body>
			</Html>
		);
	}
}`,
			`import Head from "next/head";

export default function DashboardPage() {
	return (
		<>
			<Head><title>Dashboard</title></Head>
			<main>Dashboard</main>
		</>
	);
}`,
		);
	}

	if (ruleName === "no-css-tags") {
		return createTsxCodeExamplePair(
			`import Head from "next/head";

export default function Page() {
	return <Head><link rel="stylesheet" href="/styles/dashboard.css" /></Head>;
}`,
			`import "../styles/dashboard.css";

export default function Page() {
	return <main className="dashboard">Dashboard</main>;
}`,
		);
	}

	if (ruleName.includes("font")) {
		return createTsxCodeExamplePair(
			`import Head from "next/head";

export default function Page() {
	return <Head><link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" /></Head>;
}`,
			`import Head from "next/head";

export default function Page() {
	return (
		<Head>
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
		</Head>
	);
}`,
		);
	}

	if (ruleName === "no-async-client-component") {
		return createTsxCodeExamplePair(
			`"use client";

export default async function DashboardWidget() {
	const data = await loadDashboardData();

	return <section>{data.title}</section>;
}`,
			`export default async function DashboardWidget() {
	const data = await loadDashboardData();

	return <section>{data.title}</section>;
}`,
		);
	}

	if (ruleName === "no-assign-module-variable") {
		return createTsxCodeExamplePair(
			`module = createNextModule();

export default function Page() {
	return <main>Home</main>;
}`,
			`const nextModule = createNextModule();

export default function Page() {
	return <main>{nextModule.name}</main>;
}`,
		);
	}

	if (ruleName === "no-typos") {
		return createTsxCodeExamplePair(
			`const nextConfig = {
	distDirr: "build",
	reactStrictMode: true,
};

export default nextConfig;`,
			`const nextConfig = {
	distDir: "build",
	reactStrictMode: true,
};

export default nextConfig;`,
		);
	}

	if (ruleName === "no-unwanted-polyfillio") {
		return createTsxCodeExamplePair(
			`import Script from "next/script";

export default function Page() {
	return <Script src="https://polyfill.io/v3/polyfill.min.js" />;
}`,
			`import Script from "next/script";

export default function Page() {
	return <Script src="/polyfills/required-browser-features.js" strategy="beforeInteractive" />;
}`,
		);
	}

	return createTsxCodeExamplePair(
		`export default function Page() {
	return <main><h1>Dashboard</h1></main>;
}`,
		`export const metadata = { title: "Dashboard" };

export default function Page() {
	return <main><h1>Dashboard</h1></main>;
}`,
	);
}

function createJsxExamplePair(entry) {
	if (isStylisticJsxRule(entry)) {
		return createStylisticJsxExamplePair(entry);
	}

	const ruleName = entry.shortName;

	if (ruleName === "alt-text") {
		return createTsxCodeExamplePair(
			`export function ProductImage() {
	return <img src="/keyboard.jpg" />;
}`,
			`export function ProductImage() {
	return <img src="/keyboard.jpg" alt="Compact mechanical keyboard" />;
}`,
		);
	}

	if (ruleName === "img-redundant-alt") {
		return createTsxCodeExamplePair(
			`export function ProductImage() {
	return <img src="/keyboard.jpg" alt="Image of a compact keyboard" />;
}`,
			`export function ProductImage() {
	return <img src="/keyboard.jpg" alt="Compact keyboard" />;
}`,
		);
	}

	if (ruleName === "media-has-caption") {
		return createTsxCodeExamplePair(
			`export function LaunchVideo() {
	return <video controls src="/launch.mp4" />;
}`,
			`export function LaunchVideo() {
	return <video controls src="/launch.mp4"><track kind="captions" src="/launch.en.vtt" label="English" /></video>;
}`,
		);
	}

	if (ruleName === "iframe-has-title") {
		return createTsxCodeExamplePair(
			`export function MapEmbed() {
	return <iframe src="https://maps.example.com/store" />;
}`,
			`export function MapEmbed() {
	return <iframe src="https://maps.example.com/store" title="Store location map" />;
}`,
		);
	}

	if (ruleName === "html-has-lang") {
		return createTsxCodeExamplePair(
			`export function DocumentShell() {
	return <html><body><main>Dashboard</main></body></html>;
}`,
			`export function DocumentShell() {
	return <html lang="en"><body><main>Dashboard</main></body></html>;
}`,
		);
	}

	if (ruleName === "heading-has-content") {
		return createTsxCodeExamplePair(
			`export function EmptySection() {
	return <h2 />;
}`,
			`export function EmptySection() {
	return <h2>Billing details</h2>;
}`,
		);
	}

	if (ruleName.includes("label") || ruleName === "control-has-associated-label") {
		return createTsxCodeExamplePair(
			`export function EmailField() {
	return <input id="email" type="email" />;
}`,
			`export function EmailField() {
	return (
		<label htmlFor="email">
			Email
			<input id="email" type="email" />
		</label>
	);
}`,
		);
	}

	if (ruleName === "autocomplete-valid") {
		return createTsxCodeExamplePair(
			`export function CheckoutForm() {
	return <input autoComplete="postal" name="postalCode" />;
}`,
			`export function CheckoutForm() {
	return <input autoComplete="postal-code" name="postalCode" />;
}`,
		);
	}

	if (ruleName.includes("aria") || ruleName.includes("role")) {
		return createTsxCodeExamplePair(
			`export function VolumeSlider() {
	return <div role="slider" aria-valuenow="loud">Volume</div>;
}`,
			`export function VolumeSlider() {
	return <div role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={60} tabIndex={0}>Volume</div>;
}`,
		);
	}

	if (ruleName.includes("anchor")) {
		return createTsxCodeExamplePair(
			`export function HelpLink() {
	return <a href="#">Click here</a>;
}`,
			`export function HelpLink() {
	return <a href="/help">Read the help center</a>;
}`,
		);
	}

	if (ruleName.includes("click") || ruleName.includes("mouse") || ruleName.includes("interactive") || ruleName.includes("static-element")) {
		return createTsxCodeExamplePair(
			`export function DismissNotice() {
	return <div onClick={dismissNotice}>Dismiss</div>;
}`,
			`export function DismissNotice() {
	return <button type="button" onClick={dismissNotice}>Dismiss</button>;
}`,
		);
	}

	if (ruleName.includes("tabindex")) {
		return createTsxCodeExamplePair(
			`export function SkipLink() {
	return <a href="#content" tabIndex={3}>Skip to content</a>;
}`,
			`export function SkipLink() {
	return <a href="#content" tabIndex={0}>Skip to content</a>;
}`,
		);
	}

	if (ruleName === "no-autofocus") {
		return createTsxCodeExamplePair(
			`export function SearchForm() {
	return <input autoFocus name="query" />;
}`,
			`export function SearchForm() {
	return <input name="query" aria-label="Search" />;
}`,
		);
	}

	if (ruleName === "no-access-key") {
		return createTsxCodeExamplePair(
			`export function SaveButton() {
	return <button accessKey="s" type="button">Save</button>;
}`,
			`export function SaveButton() {
	return <button type="button">Save</button>;
}`,
		);
	}

	if (ruleName === "no-distracting-elements") {
		return createTsxCodeExamplePair(
			`export function PromoBanner() {
	return <marquee>Sale ends tonight</marquee>;
}`,
			`export function PromoBanner() {
	return <p>Sale ends tonight</p>;
}`,
		);
	}

	if (ruleName === "scope") {
		return createTsxCodeExamplePair(
			`export function PriceTable() {
	return <table><thead><tr><th>Plan</th><th>Price</th></tr></thead></table>;
}`,
			`export function PriceTable() {
	return <table><thead><tr><th scope="col">Plan</th><th scope="col">Price</th></tr></thead></table>;
}`,
		);
	}

	return createTsxCodeExamplePair(
		`export function AccessibleAction() {
	return <div onClick={submitForm}>Submit</div>;
}`,
		`export function AccessibleAction() {
	return <button type="button" onClick={submitForm}>Submit</button>;
}`,
	);
}

function createStylisticJsxExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName.includes("indent")) {
		return createTsxCodeExamplePair(
			`export function Card() {
	return <section>
	<h2>Account</h2>
		<p>Plan details</p>
	</section>;
}`,
			`export function Card() {
	return (
		<section>
			<h2>Account</h2>
			<p>Plan details</p>
		</section>
	);
}`,
		);
	}

	if (ruleName.includes("props") || ruleName.includes("first-prop")) {
		return createTsxCodeExamplePair(
			`export function SubmitButton() {
	return <button type="button" disabled className="primary">Save</button>;
}`,
			`export function SubmitButton() {
	return (
		<button
			type="button"
			disabled
			className="primary"
		>
			Save
		</button>
	);
}`,
		);
	}

	if (ruleName.includes("curly")) {
		return createTsxCodeExamplePair(
			`export function Greeting({ name }: { name: string }) {
	return <p>{name}</p>;
}`,
			`export function Greeting({ name }: { name: string }) {
	return <p>{ name }</p>;
}`,
		);
	}

	if (ruleName.includes("equals")) {
		return createTsxCodeExamplePair(
			`export function SaveButton({ disabled }: { disabled: boolean }) {
	return <button disabled = {disabled} type = "button">Save</button>;
}`,
			`export function SaveButton({ disabled }: { disabled: boolean }) {
	return <button disabled={disabled} type="button">Save</button>;
}`,
		);
	}

	if (ruleName.includes("quotes")) {
		return createTsxCodeExamplePair(
			`export function Status() {
	return <span data-state='ready'>Ready</span>;
}`,
			`export function Status() {
	return <span data-state="ready">Ready</span>;
}`,
		);
	}

	return createTsxCodeExamplePair(
		`export function AccountCard() {
	return <section><h2>Account</h2><p>Plan details</p></section>;
}`,
		`export function AccountCard() {
	return (
		<section>
			<h2>Account</h2>
			<p>Plan details</p>
		</section>
	);
}`,
	);
}

function createTsxCodeExamplePair(badCode, goodCode) {
	return {
		bad: {
			code: badCode,
			language: "tsx",
		},
		good: {
			code: goodCode,
			language: "tsx",
		},
	};
}

function createUnicornExamplePair(entry) {
	const ruleName = entry.shortName;

	if (ruleName === "prefer-array-some") {
		return createExamplePairFromCode("js", 'const hasAdmin = users.filter((user) => user.role === "admin").length > 0;', 'const hasAdmin = users.some((user) => user.role === "admin");');
	}

	if (ruleName === "prefer-array-find") {
		return createExamplePairFromCode("js", 'const admin = users.filter((user) => user.role === "admin")[0];', 'const admin = users.find((user) => user.role === "admin");');
	}

	if (ruleName === "prefer-array-index-of") {
		return createExamplePairFromCode("js", "const selectedIndex = items.findIndex((item) => item === selectedItem);", "const selectedIndex = items.indexOf(selectedItem);");
	}

	if (ruleName === "prefer-array-flat" || ruleName === "prefer-array-flat-map") {
		return createExamplePairFromCode("js", "const permissions = roles.reduce((items, role) => items.concat(role.permissions), []);", "const permissions = roles.flatMap((role) => role.permissions);");
	}

	if (ruleName.includes("prefer-string")) {
		return createExamplePairFromCode("js", "const trimmed = value.trimLeft().trimRight();", "const trimmed = value.trimStart().trimEnd();");
	}

	if (ruleName === "throw-new-error") {
		return createExamplePairFromCode("js", 'throw "Something failed";', 'throw new Error("Something failed");');
	}

	if (ruleName === "error-message") {
		return createExamplePairFromCode("js", "throw new Error();", 'throw new Error("User profile could not be loaded");');
	}

	if (ruleName === "custom-error-definition" || ruleName === "prefer-type-error") {
		return createExamplePairFromCode("js", "class ValidationFailure extends Error {}", 'class ValidationError extends Error {\n\tname = "ValidationError";\n}');
	}

	if (/(query-selector|modern-dom|dom-node|classlist|event-target|add-event-listener)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'const button = document.getElementById("save-button");\nbutton.onclick = save;', 'const button = document.querySelector("#save-button");\nbutton.addEventListener("click", save);');
	}

	if (/(module|import|export|node-protocol)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'const fs = require("fs");\nmodule.exports = createServer;', 'import fs from "node:fs";\nexport { createServer };');
	}

	if (/(post-message|fetch)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'window.postMessage({ type: "ready" }, "*");\nfetch(url, { method: "POST", body: payload });', 'window.postMessage({ type: "ready" }, "https://app.example.com");\nfetch(url, { method: "POST", body: payload, headers: { "content-type": "application/json" } });');
	}

	if (/(filename|abbreviation)/.test(ruleName)) {
		return createExamplePairFromCode("js", "const usrCfg = loadCfg();\nexport { usrCfg };", "const userConfig = loadConfig();\nexport { userConfig };");
	}

	if (ruleName === "no-for-loop") {
		return createExamplePairFromCode("js", "const names = [];\nfor (const user of users) {\n\tnames.push(user.name);\n}", "const names = users.map((user) => user.name);");
	}

	if (ruleName === "no-document-cookie") {
		return createExamplePairFromCode("js", 'document.cookie = "session=abc";', 'await cookieStore.set({ name: "session", value: sessionId, secure: true });');
	}

	if (ruleName === "no-new-array") {
		return createExamplePairFromCode("js", 'const roles = new Array("admin", "editor");', 'const roles = ["admin", "editor"];');
	}

	if (ruleName === "no-static-only-class") {
		return createExamplePairFromCode("js", "class UserFormatter {\n\tstatic format(user) {\n\t\treturn user.name;\n\t}\n}", "function formatUser(user) {\n\treturn user.name;\n}");
	}

	if (/(switch|ternary|condition|lonely-if|negation)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'if (isReady) {\n\treturn "ready";\n} else {\n\treturn "pending";\n}', 'return isReady ? "ready" : "pending";');
	}

	if (ruleName.includes("no-array")) {
		return createExamplePairFromCode("js", "items.forEach((item) => {\n\tprocessed.push(transform(item));\n});", "const processed = items.map((item) => transform(item));");
	}

	if (ruleName.includes("no-null")) {
		return createExamplePairFromCode("js", "const selectedUser = null;", "const selectedUser = undefined;");
	}

	if (/(regexp|regex)/.test(ruleName)) {
		return createExamplePairFromCode("js", 'const matcher = new RegExp("^[0-9]+$");', "const matcher = /^\\d+$/;");
	}

	if (/(number|numeric|zero|math)/.test(ruleName)) {
		return createExamplePairFromCode("js", "const rounded = Math.floor(value / 1);", "const rounded = Math.trunc(value);");
	}

	if (/(promise|await|top-level)/.test(ruleName)) {
		return createExamplePairFromCode("js", "async function loadConfig() {\n\treturn await Promise.resolve(config);\n}", "const config = await readConfig();\nexport { config };");
	}

	return createExamplePairFromCode("js", "const copiedUser = JSON.parse(JSON.stringify(user));", "const copiedUser = structuredClone(user);");
}

function createRulePage(entry) {
	const status = createStatus(entry);
	const description = createDescription(entry);
	const badExample = createExample(entry, "bad");
	const goodExample = createExample(entry, "good");
	const defaultOccurrence = getDefaultOccurrence(entry);

	return `import { Callout, Tabs } from "nextra/components";

# \`${entry.ruleId}\`

<Callout type="${status.callout}" emoji="${status.emoji}">
  **${status.label}.** ${status.summary}
</Callout>

## Rule Overview

${description}

This page describes the rule in general first, then shows the exact ElsiKora preset configuration separately.

## Rule Metadata

| Property | Value |
| --- | --- |
| Type | \`${formatInlineValue(entry.metadata.type ?? "unknown")}\` |
| Fixable | ${formatBoolean(entry.metadata.fixable)} |
| Has suggestions | ${formatBoolean(entry.metadata.hasSuggestions)} |
| Deprecated | ${formatBoolean(entry.metadata.deprecated)} |
| ESLint recommended | \`${formatInlineValue(entry.metadata.docsRecommended ?? "unknown")}\` |

## All Supported Options

${createOptionsSection(entry)}

## ElsiKora Default Setting

The default shown here is the first effective result produced by ESLint's own config resolver. Raw configured entries are listed separately so overrides from React, Next.js, Prettier, and other presets stay visible.

| Field | Value |
| --- | --- |
| Default scenario | \`${defaultOccurrence.scenarioId}\` |
| Default target | ${formatDefaultTarget(defaultOccurrence)} |
| Default severity | ${formatSeverityBadge(getRuleSeverity(defaultOccurrence.value))} |
| Default value | \`${escapeTableCell(JSON.stringify(defaultOccurrence.value))}\` |

### Effective Result by File Type

${createEffectiveValuesTable(entry)}

### Configured Entries Before ESLint Resolves Overrides

${createConfiguredValuesTable(entry)}

## Examples

<Tabs items={["❌ Avoid", "✅ Prefer"]}>
  <Tabs.Tab>

\`\`\`${badExample.language} filename="bad-example.${badExample.language}" copy
${badExample.code}
\`\`\`

  </Tabs.Tab>
  <Tabs.Tab>

\`\`\`${goodExample.language} filename="good-example.${goodExample.language}" copy
${goodExample.code}
\`\`\`

  </Tabs.Tab>
</Tabs>

## Related Reference

- **Final rule id:** \`${entry.ruleId}\`
- **Documentation route:** \`/docs/eslint-config/rules/${entry.slug}\`
`;
}

function createOptionsSection(entry) {
	if (!entry.metadata.schema || isEmptySchema(entry.metadata.schema)) {
		return "This rule does not expose configurable options through its ESLint metadata schema.";
	}

	return `The rule exposes the following ESLint option schema:

\`\`\`json filename="options-schema.json" copy
${JSON.stringify(entry.metadata.schema, null, "\t")}
\`\`\`

${createDefaultOptionsSection(entry)}`;
}

function createDefaultOptionsSection(entry) {
	if (!entry.metadata.defaultOptions) {
		return "No upstream default options are exposed in the rule metadata.";
	}

	return `Upstream default options:

\`\`\`json filename="default-options.json" copy
${JSON.stringify(entry.metadata.defaultOptions, null, "\t")}
\`\`\``;
}

function createConfiguredValuesTable(entry) {
	const rows = [...getUniqueOccurrences(entry.occurrences)].map((occurrence) => `| \`${occurrence.scenarioId}\` | ${formatSeverityBadge(getRuleSeverity(occurrence.value))} | \`${escapeTableCell(JSON.stringify(occurrence.value))}\` | \`${occurrence.configIndex}\` |`).join("\n");

	return `| Scenario | Severity | Value | Config block |
| --- | --- | --- | --- |
${rows}`;
}

function createEffectiveValuesTable(entry) {
	if (entry.effectiveOccurrences.length === 0) {
		return "This rule is configured but was not present in the representative effective configs sampled for these docs.";
	}

	const rows = [...getUniqueEffectiveOccurrences(entry.effectiveOccurrences)].map((occurrence) => `| \`${occurrence.scenarioId}\` | \`${occurrence.targetId}\` | \`${occurrence.filePath}\` | ${formatSeverityBadge(getRuleSeverity(occurrence.value))} | \`${escapeTableCell(JSON.stringify(occurrence.value))}\` |`).join("\n");

	return `| Scenario | Target | File path | Effective severity | Effective value |
| --- | --- | --- | --- | --- |
${rows}`;
}

function createRulesIndexPage(node, entries) {
	const cards = [...node.children.keys()]
		.sort((left, right) => left.localeCompare(right))
		.map((segment) => `  <Cards.Card emoji="📚" title="${escapeMdxAttribute(formatTitle(segment))}" href="/docs/eslint-config/rules/${segment}" />`)
		.join("\n");

	return `---
asIndexPage: true
---

import { Cards } from "nextra/components";

# Rules

Browse every rule that appears in the generated ElsiKora ESLint configuration, including enabled rules and intentional disabled overrides.

<Cards num={3}>
${cards}
</Cards>

## Rule Matrix

${createRuleSummaryTable(entries, "/docs/eslint-config/rules")}
`;
}

function createFamilyIndexPage(title, route, node) {
	const childEntries = collectNodeRuleEntries(node);

	const cards = [...node.children.entries()]
		.sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
		.map(([segment, child]) => `  <Cards.Card emoji="${child.rule ? "📘" : "📚"}" title="${escapeMdxAttribute(child.rule ? child.rule.shortName : formatTitle(segment))}" href="${route}/${segment}" />`)
		.join("\n");

	return `---
asIndexPage: true
---

import { Cards } from "nextra/components";

# ${title}

Rules and nested groups documented for this preset family.

<Cards num={3}>
${cards}
</Cards>

## Rule Matrix

${createRuleSummaryTable(childEntries, route)}
`;
}

function createRuleSummaryTable(entries, routePrefix) {
	if (entries.length === 0) {
		return "No rule pages are nested under this section.";
	}

	const rows = entries
		.sort((left, right) => left.ruleId.localeCompare(right.ruleId))
		.map((entry) => {
			const defaultOccurrence = getDefaultOccurrence(entry);
			const status = getRuleSeverity(defaultOccurrence.value);
			const href = `${routePrefix}/${entry.segments.slice(routePrefix.split("/").slice(4).length).join("/")}`;

			return `| [\`${entry.ruleId}\`](${href}) | ${formatSeverityBadge(status)} | ${formatBoolean(entry.metadata.fixable)} | ${formatBoolean(entry.metadata.hasSuggestions)} | \`${formatInlineValue(entry.metadata.type ?? "unknown")}\` |`;
		})
		.join("\n");

	return `| Rule | Default | Fixable | Suggestions | Type |
| --- | --- | --- | --- | --- |
${rows}`;
}

function formatSeverityBadge(severity) {
	if (severity === "error") {
		return "🚨 `error`";
	}

	if (severity === "warn") {
		return "⚠️ `warn`";
	}

	return "🧭 `off`";
}

function formatBoolean(value) {
	return value ? "✅ Yes" : "❌ No";
}

function formatInlineValue(value) {
	if (typeof value === "string") {
		return value;
	}

	return JSON.stringify(value);
}

function getDefaultOccurrence(entry) {
	const allOptionsEffectiveOccurrence = entry.effectiveOccurrences.find((occurrence) => occurrence.scenarioId === "all-options");

	return allOptionsEffectiveOccurrence ?? entry.effectiveOccurrences[0] ?? entry.occurrences[0];
}

function formatDefaultTarget(occurrence) {
	if (!occurrence.targetId) {
		return "`Configured entry`";
	}

	return `\`${occurrence.targetId}\` (\`${occurrence.filePath}\`)`;
}

function getStatusOccurrences(entry) {
	return entry.effectiveOccurrences.length > 0 ? entry.effectiveOccurrences : entry.occurrences;
}

function getUniqueOccurrences(occurrences) {
	const occurrencesByValue = new Map();

	for (const occurrence of occurrences) {
		occurrencesByValue.set(`${occurrence.scenarioId}:${JSON.stringify(occurrence.value)}:${occurrence.configIndex}`, occurrence);
	}

	return occurrencesByValue.values();
}

function getUniqueEffectiveOccurrences(occurrences) {
	const occurrencesByValue = new Map();

	for (const occurrence of occurrences) {
		occurrencesByValue.set(`${occurrence.scenarioId}:${occurrence.targetId}:${JSON.stringify(occurrence.value)}`, occurrence);
	}

	return occurrencesByValue.values();
}

function isEmptySchema(schema) {
	return (Array.isArray(schema) && schema.length === 0) || (typeof schema === "object" && Object.keys(schema).length === 0);
}

function getExampleLanguage(entry) {
	if (hasRuleFamily(entry, "json") || hasRuleFamily(entry, "package-json")) {
		return "json";
	}

	if (hasRuleFamily(entry, "yaml") || hasRuleFamily(entry, "yml")) {
		return "yaml";
	}

	if (hasRuleFamily(entry, "css") || hasRuleFamily(entry, "tailwind-css")) {
		return "css";
	}

	if (hasRuleFamily(entry, "typescript") || hasRuleFamily(entry, "typescript-strict") || hasRuleFamily(entry, "nest") || hasRuleFamily(entry, "typeorm") || entry.segments.includes("ts")) {
		return "ts";
	}

	if (hasRuleFamily(entry, "react") || hasRuleFamily(entry, "jsx") || hasRuleFamily(entry, "next") || isStylisticJsxRule(entry)) {
		return "tsx";
	}

	return "js";
}

function hasRuleFamily(entry, family) {
	return entry.segments[0] === family;
}

function isStylisticJsxRule(entry) {
	return hasRuleFamily(entry, "stylistic") && (entry.segments[1] === "jsx" || entry.shortName.startsWith("jsx-"));
}

function getRuleSeverity(value) {
	const severity = Array.isArray(value) ? value[0] : value;

	if (severity === 2 || severity === "error") {
		return "error";
	}

	if (severity === 1 || severity === "warn") {
		return "warn";
	}

	return "off";
}

function sentenceCase(value) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1).replace(/\.$/, "")}.`;
}

async function writeDocsRoot(entries) {
	await mkdir(DOCS_ROOT, { recursive: true });
	await mkdir(RULES_ROOT, { recursive: true });

	await writeGeneratedFile(
		path.join(DOCS_ROOT, "page.mdx"),
		`---
title: ESLint Config
asIndexPage: true
---

# Documentation

ElsiKora ESLint Config provides curated ESLint flat configs for JavaScript, TypeScript, React, Next.js, NestJS, and the surrounding ecosystem.

## Documentation Map

- **[Rules](/docs/eslint-config/rules)** - ${entries.length} configured rules with rationale, examples, full option schemas, and ElsiKora default values.
`,
	);

	await writeGeneratedFile(path.join(DOCS_ROOT, "_meta.js"), createMetaFileContent([["rules", "Rules"]]));
}

async function writeNavigation(entries) {
	const tree = createNavigationTree(entries);

	await writeNavigationNode(RULES_ROOT, tree, "Rules", "/docs/eslint-config/rules", entries, true);
}

function createNavigationTree(entries) {
	const root = createNavigationNode();

	for (const entry of entries) {
		let node = root;

		for (const segment of entry.segments) {
			node.children.set(segment, node.children.get(segment) ?? createNavigationNode());
			node = node.children.get(segment);
		}

		node.rule = entry;
	}

	return root;
}

function createNavigationNode() {
	return {
		children: new Map(),
		rule: null,
	};
}

async function writeNavigationNode(directoryPath, node, title, route, entries, isRoot = false) {
	await mkdir(directoryPath, { recursive: true });

	if (isRoot) {
		await writeGeneratedFile(path.join(directoryPath, "page.mdx"), createRulesIndexPage(node, entries));
	} else if (!node.rule) {
		await writeGeneratedFile(path.join(directoryPath, "page.mdx"), createFamilyIndexPage(title, route, node));
	}

	const metaEntries = [...node.children.entries()].sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

	if (metaEntries.length > 0) {
		const meta = createMetaFileContent(metaEntries.map(([key, child]) => [key, child.rule ? child.rule.shortName : formatTitle(key)]));

		await writeGeneratedFile(path.join(directoryPath, "_meta.js"), meta);
	}

	for (const [segment, child] of metaEntries) {
		await writeNavigationNode(path.join(directoryPath, segment), child, formatTitle(segment), `${route}/${segment}`, entries);
	}
}

async function writeRulePages(entries) {
	for (const entry of entries) {
		const directoryPath = path.join(RULES_ROOT, ...entry.segments);

		await mkdir(directoryPath, { recursive: true });
		await writeGeneratedFile(path.join(directoryPath, "page.mdx"), createRulePage(entry));
	}
}

async function writeGeneratedFile(filePath, content) {
	await writeFile(filePath, await formatGeneratedContent(filePath, content));
}

async function formatGeneratedContent(filePath, content) {
	const options = (await prettier.resolveConfig(filePath)) ?? {};

	return prettier.format(content, { ...options, filepath: filePath });
}

function collectNodeRuleEntries(node) {
	const entries = [];

	if (node.rule) {
		entries.push(node.rule);
	}

	for (const child of node.children.values()) {
		entries.push(...collectNodeRuleEntries(child));
	}

	return entries;
}

function escapeMdxAttribute(value) {
	return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function escapeTableCell(value) {
	return String(value).replaceAll("|", "\\|");
}

function formatTitle(value) {
	const knownTitles = {
		css: "CSS",
		fsd: "FSD",
		i18next: "i18next",
		javascript: "JavaScript",
		jsdoc: "JSDoc",
		json: "JSON",
		jsx: "JSX",
		mdx: "MDX",
		typescript: "TypeScript",
		yaml: "YAML",
		yml: "YAML",
	};

	if (knownTitles[value]) {
		return knownTitles[value];
	}

	return value
		.split("-")
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(" ");
}

function createMetaFileContent(entries) {
	const disableComment = hasPasswordLikeMetaEntry(entries) ? "/* eslint-disable @elsikora/sonar/no-hardcoded-passwords */\n" : "";
	const properties = entries.map(([key, value]) => `\t${formatMetaObjectKey(key)}: ${JSON.stringify(value)},`).join("\n");

	return `${disableComment}export default {\n${properties}\n};\n`;
}

function formatMetaObjectKey(key) {
	if (/^\d+$/.test(key) || /^[A-Za-z_$][\w$]*$/.test(key)) {
		return key;
	}

	return JSON.stringify(key);
}

function hasPasswordLikeMetaEntry(entries) {
	return entries.some(([key, value]) => `${key} ${value}`.toLowerCase().includes("password"));
}
