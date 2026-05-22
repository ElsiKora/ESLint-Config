import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_TYPEORM_CASES: Array<IRuleBehaviorCase> = [createCase("typeorm", "typeorm-typescript/enforce-column-types", { withTypeorm: true }, "test/e2e/fixture/typeorm/invalid/entity.fixture.ts"), createCase("typeorm", "typeorm-typescript/enforce-consistent-nullability", { withTypeorm: true }, "test/e2e/fixture/typeorm/invalid/entity.fixture.ts")];
