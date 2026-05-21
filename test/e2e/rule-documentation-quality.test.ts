import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const RULE_DOCUMENTATION_ROOT: string = path.resolve(process.cwd(), "docs/rules");
const REQUIRED_RULE_PAGE_SECTIONS: Array<string> = ["## Rule Overview", "## Rule Metadata", "## All Supported Options", "## ElsiKora Default Setting", "### Effective Result by File Type", "### Configured Entries Before ESLint Resolves Overrides", "## Examples", "## Related Reference"];
const FORBIDDEN_RULE_PAGE_PATTERNS: Array<RegExp> = [
	/\bProfileLink\b/,
	/\bcreateReadableImplementation\b/,
	/\blegacyHelper\b/,
	/\bmodernHelper\b/,
	/\breadMutableState\b/,
	/\breadStateSnapshot\b/,
	/\bcreateUpdatedState\b/,
	/\bcreatePrimaryEntry\b/,
	/\bcreateSecondaryEntry\b/,
	/\bbuildSerializableRecord\b/,
	/\boperationResult\.value\b/,
	/\bprocessUserInput\b/,
	/\bprocessValidatedInput\b/,
	/\briskyOperation\b/,
	/\bchargeCustomer\b/,
	/\bvalidateCloudResource\b/,
	/\bbucketPolicy\b/,
	/\bnormalizeRecord\b/,
	/const beta = 2;\nconst alpha = 1;/,
	/const orderedItems = \["beta", "alpha"\];/,
	/const account = \{ id: user\.id/,
	/const matchingUsers = users\.filter/,
	/const normalizedName = user\.name/,
	/Controls the `[^`]+` rule in the ElsiKora ESLint configuration\./,
	/This rule protects the codebase from patterns covered by/,
	/\bTBD\b/i,
	/\bplaceholder\b/i,
];
const JAVASCRIPT_TYPESCRIPT_FORBIDDEN_RULE_PAGE_PATTERNS: Array<RegExp> = [/\breadMutableState\b/, /\bcreateUpdatedState\b/, /\bnormalizeRecord\(source\)/, /\brecords\.filter\(\(record\) => record\.enabled\)/, /\brecords\.some\(\(record\) => record\.enabled\)/, /const \w+Payload = JSON\.stringify\(\w+Record\);/];
const FORBIDDEN_NEXT_LINK_IMPORT_PATTERN: RegExp = /from\s+["']next\/link["']/;
const NEXT_LINK_EXAMPLE_ALLOWED_PATH: string = path.join("docs", "rules", "next", "no-html-link-for-pages", "page.mdx");

interface IWeakRuleDocumentationPage {
	reasons: Array<string>;
	relativePath: string;
}

describe("RuleDocumentationQuality", () => {
	it("should not contain generated placeholders or structurally empty rule pages", () => {
		const weakPages: Array<IWeakRuleDocumentationPage> = getWeakRuleDocumentationPages();

		if (weakPages.length > 0) {
			throw new Error(formatWeakRuleDocumentationPagesMessage(weakPages));
		}

		expect(weakPages).toHaveLength(0);
	});
});

function collectRuleDocumentationPages(directoryPath: string): Array<string> {
	const entries = readdirSync(directoryPath, { withFileTypes: true });
	const pages: Array<string> = [];

	for (const entry of entries) {
		const entryPath: string = path.join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			pages.push(...collectRuleDocumentationPages(entryPath));
		} else if (entry.name === "page.mdx") {
			pages.push(entryPath);
		}
	}

	return pages;
}

function formatWeakRuleDocumentationPagesMessage(weakPages: Array<IWeakRuleDocumentationPage>): string {
	const lines: Array<string> = weakPages.flatMap((page: IWeakRuleDocumentationPage) => [`- ${page.relativePath}`, ...page.reasons.map((reason: string) => `  - ${reason}`)]);

	return [`Found ${weakPages.length} weak generated rule documentation pages.`, "Replace placeholders with rule-specific prose/examples and keep the required Nextra sections.", ...lines].join("\n");
}

function getWeakRuleDocumentationPages(): Array<IWeakRuleDocumentationPage> {
	return collectRuleDocumentationPages(RULE_DOCUMENTATION_ROOT)
		.filter(isRulePage)
		.map((pagePath: string) => {
			const content: string = readFileSync(pagePath, "utf8");
			const relativePath: string = path.relative(process.cwd(), pagePath);
			const reasons: Array<string> = [];

			for (const section of REQUIRED_RULE_PAGE_SECTIONS) {
				if (!content.includes(section)) {
					reasons.push(`missing section: ${section}`);
				}
			}

			for (const pattern of FORBIDDEN_RULE_PAGE_PATTERNS) {
				if (pattern.test(content)) {
					reasons.push(`contains forbidden placeholder pattern: ${pattern.source}`);
				}
			}

			for (const pattern of JAVASCRIPT_TYPESCRIPT_FORBIDDEN_RULE_PAGE_PATTERNS) {
				if (pattern.test(content)) {
					reasons.push(`contains forbidden generic fallback pattern: ${pattern.source}`);
				}
			}

			if (relativePath !== NEXT_LINK_EXAMPLE_ALLOWED_PATH && FORBIDDEN_NEXT_LINK_IMPORT_PATTERN.test(content)) {
				reasons.push(`contains cross-family Next link example outside ${NEXT_LINK_EXAMPLE_ALLOWED_PATH}`);
			}

			reasons.push(...getPluginFamilyFallbackReasons(relativePath, content));

			return {
				reasons,
				relativePath,
			};
		})
		.filter((page: IWeakRuleDocumentationPage) => page.reasons.length > 0)
		.sort((left: IWeakRuleDocumentationPage, right: IWeakRuleDocumentationPage) => left.relativePath.localeCompare(right.relativePath));
}

function isRulePage(pagePath: string): boolean {
	const content: string = readFileSync(pagePath, "utf8");

	return /^# `[^`]+`/m.test(content);
}

function getPluginFamilyFallbackReasons(relativePath: string, content: string): Array<string> {
	if (!isTargetedPluginFamilyRulePage(relativePath)) {
		return [];
	}

	const reasons: Array<string> = [];
	const genericFallbackPatterns: Array<RegExp> = [/const \w+Record = \{ id: source\.id, enabled: source\.enabled \};/, /const \w+Record = buildSerializableRecord\(source\);/, /\breadMutableState\(\)/, /\bcreateUpdatedState\(/, /\bcreatePrimaryEntry\(\)/, /\bcreateSecondaryEntry\(\)/, /const orderedItems = \["beta", "alpha"\];/];

	for (const pattern of genericFallbackPatterns) {
		if (pattern.test(content)) {
			reasons.push(`contains plugin generic fallback pattern: ${pattern.source}`);
		}
	}

	if (relativePath.includes(`${path.sep}jsdoc${path.sep}`) && !content.includes("/**")) {
		reasons.push("JSDoc rule example does not contain a JSDoc block");
	}

	if (relativePath.includes(`${path.sep}perfectionist${path.sep}`) && !relativePath.endsWith(`${path.sep}sort-variable-declarations${path.sep}page.mdx`) && /const beta = 2;\nconst alpha = 1;/.test(content)) {
		reasons.push("Perfectionist non-variable sort example uses variable declaration fallback");
	}

	return reasons;
}

function isTargetedPluginFamilyRulePage(relativePath: string): boolean {
	const targetedFamilies: Array<string> = ["sonar", "unicorn", "perfectionist", "jsdoc", "json", "package-json", "css", "tailwindcss", "node", "typeorm", "tanstack", "nest", "sort-decorators", "fsd", "yaml", "yml"];

	return targetedFamilies.some((family: string) => relativePath.startsWith(path.join("docs", "rules", family, path.sep)));
}
