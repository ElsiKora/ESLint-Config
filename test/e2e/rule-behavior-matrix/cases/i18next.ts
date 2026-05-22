import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_I18NEXT_CASES: Array<IRuleBehaviorCase> = [createCase("i18next", "i18next/no-literal-string", { withI18next: true }, "test/e2e/fixture/i18next/invalid/no-translations.fixture.jsx")];
