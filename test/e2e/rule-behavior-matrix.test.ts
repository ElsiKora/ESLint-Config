import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { formatRuleName } from "../../dist/esm/index";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import type { IRuleBehaviorCase } from "./rule-behavior-matrix/types";
import { RULE_BEHAVIOR_CASES, RULE_BEHAVIOR_SCENARIOS } from "./rule-behavior-matrix.fixture";
import { createRuleBehaviorCaseName, getMissingRuleBehaviorCases, type IMissingRuleBehaviorCase } from "./rule-behavior-matrix.helper";

describe("RuleBehaviorMatrix", () => {
	it.each(RULE_BEHAVIOR_CASES.map((ruleCase: IRuleBehaviorCase) => [createRuleBehaviorCaseName(ruleCase), ruleCase]))("%s", async (_caseName: string, ruleCase: IRuleBehaviorCase) => {
		const eslint: ESLint = await createEsLintInstance(ruleCase.options, ruleCase.config);
		const [result] = ruleCase.code ? await eslint.lintText(ruleCase.code, { filePath: ruleCase.filePath }) : await eslint.lintFiles([ruleCase.filePath]);
		const expectedRuleId: string = formatRuleName(ruleCase.ruleId);
		const hasExpectedMessage: boolean = Boolean(result?.messages.some((message) => message.ruleId === expectedRuleId));

		if (ruleCase.expectation === "reported") {
			expect(hasExpectedMessage).toBe(true);
		} else {
			expect(hasExpectedMessage).toBe(false);
		}
	});

	it("should require behavior cases for every final ESLint rule", async () => {
		const missingCases: Array<IMissingRuleBehaviorCase> = await getMissingRuleBehaviorCases(RULE_BEHAVIOR_SCENARIOS, RULE_BEHAVIOR_CASES);

		if (missingCases.length > 0) {
			throw new Error(formatMissingBehaviorCasesMessage(missingCases));
		}

		expect(missingCases).toHaveLength(0);
	});
});

function formatMissingBehaviorCasesMessage(missingCases: Array<IMissingRuleBehaviorCase>): string {
	const groupedCases: Map<string, Array<IMissingRuleBehaviorCase>> = new Map<string, Array<IMissingRuleBehaviorCase>>();

	for (const missingCase of missingCases) {
		groupedCases.set(missingCase.scenarioId, [...(groupedCases.get(missingCase.scenarioId) ?? []), missingCase]);
	}

	const sections: Array<string> = [...groupedCases.entries()].map(([scenarioId, entries]: [string, Array<IMissingRuleBehaviorCase>]) => {
		const ruleLines: Array<string> = entries.map((entry: IMissingRuleBehaviorCase) => `  - ${entry.ruleId} files=${entry.files} ignores=${entry.ignores}`);

		return [`${scenarioId}: ${entries.length} missing behavior cases`, ...ruleLines].join("\n");
	});

	return [`Missing executable ESLint behavior cases for ${missingCases.length} final rule entries.`, "Add an IRuleBehaviorCase that runs ESLint and expects the ruleId to be reported or not reported.", ...sections].join("\n\n");
}
