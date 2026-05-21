import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_TAILWIND_CSS_CASES: Array<IRuleBehaviorCase> = [
	createCase("tailwind-css", "tailwindcss/classnames-order", { withNext: true, withTailwindCss: true }, "test/e2e/fixture/tailwind-css/invalid/classnames-order.fixture.jsx", `export const Component = () => <div className="p-4 flex" />;\n`),
	createCase("tailwind-css", "tailwindcss/enforces-shorthand", { withNext: true, withTailwindCss: true }, "test/e2e/fixture/tailwind-css/invalid/enforces-shorthand.fixture.jsx", `export const Component = () => <div className="overflow-hidden text-ellipsis whitespace-nowrap" />;\n`),
	createCase("tailwind-css", "tailwindcss/no-unnecessary-arbitrary-value", { withNext: true, withTailwindCss: true }, "test/e2e/fixture/tailwind-css/valid/no-unnecessary-arbitrary-value.fixture.jsx", `export const Component = () => <div className="flex p-4" />;\n`, "not-reported"),
];
