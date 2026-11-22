import type { Linter } from "eslint";

import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

// eslint-plugin-tailwindcss 4 reads the Tailwind CSS 4 theme from the project's main stylesheet.
const TAILWIND_SETTINGS: Linter.Config = { settings: { tailwindcss: { cssConfigPath: "test/e2e/fixture/tailwind-css/style.css" } } };

function createTailwindCase(ruleId: string, fileName: string, className: string, expectation: IRuleBehaviorCase["expectation"] = "reported"): IRuleBehaviorCase {
	const folder: string = expectation === "reported" ? "invalid" : "valid";

	return createCase("tailwind-css", ruleId, { withNext: true, withTailwindCss: true }, `test/e2e/fixture/tailwind-css/${folder}/${fileName}.fixture.jsx`, `export const Component = () => <div className="${className}" />;\n`, expectation, TAILWIND_SETTINGS);
}

export const RULE_BEHAVIOR_TAILWIND_CSS_CASES: Array<IRuleBehaviorCase> = [
	createTailwindCase("tailwindcss/classnames-order", "classnames-order", "p-4 flex"),
	createTailwindCase("tailwindcss/enforces-canonical-classname", "enforces-canonical-classname", "w-[100%]"),
	createTailwindCase("tailwindcss/enforces-shorthand", "enforces-shorthand", "overflow-hidden text-ellipsis whitespace-nowrap"),
	createTailwindCase("tailwindcss/important-modifier-suffix", "important-modifier-suffix", "!flex"),
	createTailwindCase("tailwindcss/no-contradicting-classname", "no-contradicting-classname", "flex block"),
	createTailwindCase("tailwindcss/no-unnecessary-arbitrary-value", "no-unnecessary-arbitrary-value", "m-[8px]"),
	createTailwindCase("tailwindcss/no-unnecessary-arbitrary-value", "no-unnecessary-arbitrary-value", "flex p-4", "not-reported"),
];
