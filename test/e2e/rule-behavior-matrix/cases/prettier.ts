import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_PRETTIER_CASES: Array<IRuleBehaviorCase> = [createCase("prettier", "@elsikora/prettier/prettier", { withPrettier: true }, "test/e2e/fixture/prettier/invalid/prettier.fixture.js", `const value = {foo: "bar"}\n`)];
