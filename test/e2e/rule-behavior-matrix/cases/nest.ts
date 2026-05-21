import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_NEST_CASES: Array<IRuleBehaviorCase> = [
	createCase("nest", "nestjs-typed/api-method-should-specify-api-response", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/api-method-should-specify-api-response.controller.fixture.ts"),
	createCase("nest", "nestjs-typed/all-properties-are-whitelisted", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/all-properties-have-explicit-defined", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/api-enum-property-best-practices", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/api-property-matches-property-optionality", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/api-property-returning-array-should-set-array", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/controllers-should-supply-api-tags", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/controllers-should-supply-api-tags.controller.fixture.ts"),
	createCase("nest", "nestjs-typed/no-duplicate-decorators", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/param-decorator-name-matches-route-param", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/provided-injected-should-match-factory-parameters", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/should-specify-forbid-unknown-values", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/sort-module-metadata-arrays", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/decorator-array-items.module.fixture.ts"),
	createCase("nest", "nestjs-typed/validate-nested-of-array-should-set-each", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
	createCase("nest", "nestjs-typed/validated-non-primitive-property-needs-type-decorator", { withNest: true, withTypescript: true }, "test/e2e/fixture/nest/invalid/dto-validation.fixture.ts"),
];
