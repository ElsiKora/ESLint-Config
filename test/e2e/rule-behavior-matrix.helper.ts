import type { Linter } from "eslint";

import createConfig, { formatRuleName } from "../../dist/esm/index";

import type { IRuleBehaviorCase, IRuleBehaviorScenario } from "./rule-behavior-matrix/types";

export interface IFinalRuleEntry {
	configIndex: number;
	files: string;
	ignores: string;
	ruleId: string;
	scenarioId: string;
	value: unknown;
}

export interface IMissingRuleBehaviorCase {
	files: string;
	ignores: string;
	ruleId: string;
	scenarioId: string;
}

export async function extractFinalRuleEntries(scenario: IRuleBehaviorScenario): Promise<Array<IFinalRuleEntry>> {
	const configs: Array<Linter.Config> = await createConfig(scenario.options);
	const entriesByRuleId: Map<string, IFinalRuleEntry> = new Map<string, IFinalRuleEntry>();

	for (const [configIndex, config] of configs.entries()) {
		const entries: Array<IFinalRuleEntry> = extractConfigRules(scenario.id, config, configIndex);

		for (const entry of entries) {
			entriesByRuleId.set(entry.ruleId, entry);
		}
	}

	return [...entriesByRuleId.values()].filter((entry: IFinalRuleEntry) => isEnabledRuleValue(entry.value)).sort(compareFinalRuleEntries);
}

export async function getMissingRuleBehaviorCases(scenarios: Array<IRuleBehaviorScenario>, cases: Array<IRuleBehaviorCase>): Promise<Array<IMissingRuleBehaviorCase>> {
	const coveredRuleIds: Set<string> = new Set<string>(cases.map((ruleCase: IRuleBehaviorCase) => formatRuleName(ruleCase.ruleId)));
	const entriesByRuleId: Map<string, IFinalRuleEntry> = new Map<string, IFinalRuleEntry>();

	for (const scenario of scenarios) {
		const entries: Array<IFinalRuleEntry> = await extractFinalRuleEntries(scenario);

		for (const entry of entries) {
			if (!entriesByRuleId.has(entry.ruleId)) {
				entriesByRuleId.set(entry.ruleId, entry);
			}
		}
	}

	return [...entriesByRuleId.entries()]
		.filter(([ruleId]: [string, IFinalRuleEntry]) => !coveredRuleIds.has(ruleId))
		.map(([, entry]: [string, IFinalRuleEntry]) => ({
			files: entry.files,
			ignores: entry.ignores,
			ruleId: entry.ruleId,
			scenarioId: entry.scenarioId,
		}))
		.sort(compareMissingRuleBehaviorCases);
}

export function createRuleBehaviorCaseName(ruleCase: IRuleBehaviorCase): string {
	return `${ruleCase.expectation} ${formatRuleName(ruleCase.ruleId)} in ${ruleCase.scenarioId}`;
}

function extractConfigRules(scenarioId: string, config: Linter.Config, configIndex: number): Array<IFinalRuleEntry> {
	const rules: Record<string, unknown> | undefined = config.rules as Record<string, unknown> | undefined;

	if (!rules) {
		return [];
	}

	const files: string = normalizeScope(config.files);
	const ignores: string = normalizeScope(config.ignores);

	return Object.entries(rules).map(([ruleId, value]: [string, unknown]) => ({
		configIndex,
		files,
		ignores,
		ruleId,
		scenarioId,
		value,
	}));
}

function normalizeScope(scope: Linter.Config["files"] | Linter.Config["ignores"]): string {
	if (!scope) {
		return "<all>";
	}

	return JSON.stringify(scope);
}

function compareFinalRuleEntries(left: IFinalRuleEntry, right: IFinalRuleEntry): number {
	return left.scenarioId.localeCompare(right.scenarioId) || left.configIndex - right.configIndex || left.ruleId.localeCompare(right.ruleId) || left.files.localeCompare(right.files) || left.ignores.localeCompare(right.ignores);
}

function compareMissingRuleBehaviorCases(left: IMissingRuleBehaviorCase, right: IMissingRuleBehaviorCase): number {
	return left.scenarioId.localeCompare(right.scenarioId) || left.ruleId.localeCompare(right.ruleId) || left.files.localeCompare(right.files) || left.ignores.localeCompare(right.ignores);
}

function isEnabledRuleValue(value: unknown): boolean {
	const severity: unknown = Array.isArray(value) ? value[0] : value;

	return severity !== "off" && severity !== 0;
}
