import { describe, expect, it } from "vitest";

import { RULE_BEHAVIOR_SCENARIOS } from "./rule-behavior-matrix.fixture";
import { getMissingRuleDocumentationEntries, type IMissingRuleDocumentationEntry } from "./rule-documentation-matrix.helper";

describe("RuleDocumentationMatrix", () => {
	it("should require documentation pages for every configured ESLint rule", async () => {
		const missingEntries: Array<IMissingRuleDocumentationEntry> = await getMissingRuleDocumentationEntries(RULE_BEHAVIOR_SCENARIOS);

		if (missingEntries.length > 0) {
			throw new Error(formatMissingRuleDocumentationEntriesMessage(missingEntries));
		}

		expect(missingEntries).toHaveLength(0);
	});
});

function formatMissingRuleDocumentationEntriesMessage(missingEntries: Array<IMissingRuleDocumentationEntry>): string {
	const groupedEntries: Map<string, Array<IMissingRuleDocumentationEntry>> = new Map<string, Array<IMissingRuleDocumentationEntry>>();

	for (const missingEntry of missingEntries) {
		const family: string = missingEntry.ruleId.replace(/^@elsikora\//, "").split("/")[0] ?? "<unknown>";

		groupedEntries.set(family, [...(groupedEntries.get(family) ?? []), missingEntry]);
	}

	const sections: Array<string> = [...groupedEntries.entries()].map(([family, entries]: [string, Array<IMissingRuleDocumentationEntry>]) => {
		const ruleLines: Array<string> = entries.map((entry: IMissingRuleDocumentationEntry) => `  - ${entry.ruleId} -> ${entry.documentationPath} value=${entry.value} scenario=${entry.scenarioId}`);

		return [`${family}: ${entries.length} missing documentation pages`, ...ruleLines].join("\n");
	});

	return [`Missing Nextra rule documentation pages for ${missingEntries.length} configured ESLint rule entries.`, "Add docs/rules/**/page.mdx files that match createRuleDocumentationSlug(ruleId).", ...sections].join("\n\n");
}
