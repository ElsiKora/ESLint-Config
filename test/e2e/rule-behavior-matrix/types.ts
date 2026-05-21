import type { Linter } from "eslint";
import type { IConfigOptions } from "../../../dist/esm/index";

export interface IRuleBehaviorScenario {
	id: string;
	options: IConfigOptions;
}

export interface IRuleBehaviorCase {
	code?: string;
	config?: Linter.Config;
	expectation: "reported" | "not-reported";
	filePath: string;
	options: IConfigOptions;
	ruleId: string;
	scenarioId: string;
}
