import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_NO_SECRETS_CASES: Array<IRuleBehaviorCase> = [createCase("no-secrets", "no-secrets/no-pattern-match", { withNoSecrets: true }, "test/e2e/fixture/no-secrets/invalid/pattern-match.fixture.js"), createCase("no-secrets", "no-secrets/no-secrets", { withNoSecrets: true }, "test/e2e/fixture/no-secrets/invalid/high-entropy.fixture.js")];
