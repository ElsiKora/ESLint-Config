import { existsSync } from "node:fs";
import path from "node:path";

import type { Linter } from "eslint";

import { createRuleDocumentationSlug } from "@infrastructure/utility";
// @ts-expect-error The test bundle exposes this runtime entry without a root declaration file.
import createConfig from "../../dist/esm/index";

import type { IRuleBehaviorScenario } from "./rule-behavior-matrix/types";

export interface IDocumentationRuleEntry {
	configIndex: number;
	documentationPath: string;
	files: string;
	ignores: string;
	ruleId: string;
	scenarioId: string;
	value: unknown;
}

export interface IMissingRuleDocumentationEntry {
	documentationPath: string;
	ruleId: string;
	scenarioId: string;
	value: string;
}

const DOCUMENTATION_ROOT: string = path.resolve(process.cwd(), "docs/rules");

export async function extractDocumentationRuleEntries(scenarios: Array<IRuleBehaviorScenario>): Promise<Array<IDocumentationRuleEntry>> {
	const entriesByRuleId: Map<string, IDocumentationRuleEntry> = new Map<string, IDocumentationRuleEntry>();

	for (const scenario of scenarios) {
		const configs: Array<Linter.Config> = await createConfig(scenario.options);

		for (const [configIndex, config] of configs.entries()) {
			const entries: Array<IDocumentationRuleEntry> = extractConfigRuleEntries(scenario.id, config, configIndex);

			for (const entry of entries) {
				if (!entriesByRuleId.has(entry.ruleId)) {
					entriesByRuleId.set(entry.ruleId, entry);
				}
			}
		}
	}

	return [...entriesByRuleId.values()].sort(compareDocumentationRuleEntries);
}

export async function getMissingRuleDocumentationEntries(scenarios: Array<IRuleBehaviorScenario>): Promise<Array<IMissingRuleDocumentationEntry>> {
	const entries: Array<IDocumentationRuleEntry> = await extractDocumentationRuleEntries(scenarios);

	return entries
		.filter((entry: IDocumentationRuleEntry) => !existsSync(entry.documentationPath))
		.map((entry: IDocumentationRuleEntry) => ({
			documentationPath: path.relative(process.cwd(), entry.documentationPath),
			ruleId: entry.ruleId,
			scenarioId: entry.scenarioId,
			value: JSON.stringify(entry.value),
		}))
		.sort(compareMissingRuleDocumentationEntries);
}

function compareDocumentationRuleEntries(left: IDocumentationRuleEntry, right: IDocumentationRuleEntry): number {
	return left.ruleId.localeCompare(right.ruleId) || left.scenarioId.localeCompare(right.scenarioId) || left.configIndex - right.configIndex;
}

function compareMissingRuleDocumentationEntries(left: IMissingRuleDocumentationEntry, right: IMissingRuleDocumentationEntry): number {
	return left.ruleId.localeCompare(right.ruleId) || left.scenarioId.localeCompare(right.scenarioId) || left.documentationPath.localeCompare(right.documentationPath);
}

function createRuleDocumentationPath(ruleId: string): string {
	return path.join(DOCUMENTATION_ROOT, createRuleDocumentationSlug(ruleId), "page.mdx");
}

function extractConfigRuleEntries(scenarioId: string, config: Linter.Config, configIndex: number): Array<IDocumentationRuleEntry> {
	const rules: Record<string, unknown> | undefined = config.rules as Record<string, unknown> | undefined;

	if (!rules) {
		return [];
	}

	const files: string = normalizeScope(config.files);
	const ignores: string = normalizeScope(config.ignores);

	return Object.entries(rules)
		.map(([ruleId, value]: [string, unknown]) => ({
			configIndex,
			documentationPath: createRuleDocumentationPath(ruleId),
			files,
			ignores,
			ruleId,
			scenarioId,
			value,
		}))
		.filter((entry: IDocumentationRuleEntry) => shouldDocumentRule(entry.ruleId));
}

function normalizeScope(scope: Linter.Config["files"] | Linter.Config["ignores"]): string {
	if (!scope) {
		return "<all>";
	}

	return JSON.stringify(scope);
}

function shouldDocumentRule(ruleId: string): boolean {
	return ruleId.startsWith("@elsikora/") || !ruleId.includes("/");
}
