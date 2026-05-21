import type { Linter } from "eslint";
import type { IConfigOptions } from "../../../dist/esm/index";

import type { IRuleBehaviorCase } from "./types";

export function createCase(scenarioId: string, ruleId: string, options: IConfigOptions, filePath: string, code?: string, expectation: IRuleBehaviorCase["expectation"] = "reported", config?: Linter.Config): IRuleBehaviorCase {
	return {
		code,
		config,
		expectation,
		filePath,
		options,
		ruleId,
		scenarioId,
	};
}

export function createCases(scenarioId: string, options: IConfigOptions, filePath: string, ruleIds: Array<string>, code?: string, expectation?: IRuleBehaviorCase["expectation"]): Array<IRuleBehaviorCase> {
	return ruleIds.map((ruleId: string) => createCase(scenarioId, ruleId, options, filePath, code, expectation));
}
