import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_TANSTACK_CASES: Array<IRuleBehaviorCase> = [
	createCase("tanstack", "@tanstack/query/exhaustive-deps", { withTanstack: true }, "test/e2e/fixture/tanstack/invalid/exhaustive-deps.fixture.tsx"),
	createCase("tanstack", "@tanstack/query/infinite-query-property-order", { withTanstack: true }, "test/e2e/fixture/tanstack/invalid/infinite-query-property-order.fixture.tsx"),
	createCase("tanstack", "@tanstack/query/no-rest-destructuring", { withTanstack: true }, "test/e2e/fixture/tanstack/invalid/no-rest-destructuring.fixture.tsx"),
	createCase("tanstack", "@tanstack/query/no-unstable-deps", { withTanstack: true }, "test/e2e/fixture/tanstack/invalid/no-unstable-deps.fixture.tsx"),
	createCase("tanstack", "@tanstack/query/stable-query-client", { withTanstack: true }, "test/e2e/fixture/tanstack/invalid/stable-query-client.fixture.tsx"),
	createCase("tanstack", "@tanstack/router/create-route-property-order", { withTanstack: true }, "test/e2e/fixture/tanstack/invalid/router-property-order.fixture.tsx"),
];
