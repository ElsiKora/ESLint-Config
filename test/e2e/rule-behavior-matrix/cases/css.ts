import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_CSS_CASES: Array<IRuleBehaviorCase> = [
	createCase("css", "css/no-duplicate-imports", { withCss: true }, "test/e2e/fixture/css/invalid/duplicate-imports.fixture.css", `@import "a.css";\n@import "a.css";\n`),
	createCase("css", "css/no-empty-blocks", { withCss: true }, "test/e2e/fixture/css/invalid/no-empty-blocks.fixture.css"),
	createCase("css", "css/no-invalid-properties", { withCss: true }, "test/e2e/fixture/css/invalid/invalid-property.fixture.css", `.property { colr: red; }\n`),
	createCase("css", "css/use-baseline", { withCss: true }, "test/e2e/fixture/css/invalid/use-baseline.fixture.css", `.property { view-transition-name: root; }\n`),
];
