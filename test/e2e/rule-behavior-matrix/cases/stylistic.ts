import type { IConfigOptions } from "../../../../dist/esm/index";
import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_STYLISTIC_CASES: Array<IRuleBehaviorCase> = [...createStylisticBehaviorCases()];

function createStylisticBehaviorCases(): Array<IRuleBehaviorCase> {
	const options: IConfigOptions = { withStylistic: true };

	return [
		createCase("stylistic", "@stylistic/brace-style", options, "src/stylistic/invalid/brace-style.fixture.js", `if (value)\n{\n\tconsole.log(value);\n}\n`),
		createCase("stylistic", "@stylistic/comma-spacing", options, "src/stylistic/invalid/comma-spacing.fixture.js", `const value = [1,2];\n`),
		createCase("stylistic", "@stylistic/function-call-spacing", options, "src/stylistic/invalid/function-call-spacing.fixture.js", `log ();\n`),
		createCase("stylistic", "@stylistic/lines-between-class-members", options, "src/stylistic/invalid/lines-between-class-members.fixture.js", `class Example {\n\tfirst() {}\n\tsecond() {}\n}\n`),
		createCase("stylistic", "@stylistic/object-curly-spacing", options, "src/stylistic/invalid/object-curly-spacing.fixture.js", `const value = {name: "Ada"};\n`),
		createCase("stylistic", "@stylistic/padding-line-between-statements", options, "src/stylistic/invalid/padding-line-between-statements.fixture.js", `function test() {\n\tconst value = 1;\n\treturn value;\n}\n`),
		createCase("stylistic", "@stylistic/space-before-blocks", options, "src/stylistic/invalid/space-before-blocks.fixture.js", `if (value){\n\tlog(value);\n}\n`),
		createCase("stylistic", "@stylistic/spaced-comment", options, "src/stylistic/invalid/spaced-comment.fixture.js", `//comment\nconst value = 1;\n`),
	];
}
