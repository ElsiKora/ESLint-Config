import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";

describe("NestJS Configuration", () => {
	describe("Controllers", () => {
		describe("Valid Controllers", () => {
			it("should pass valid NestJS controller", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNest: true,
					withTypescript: true,
					withSonar: true,
				});

				const results = await eslint.lintFiles([getFixturePath("nest/valid/clean.controller.fixture.ts")]);

				expect(results[0].messages.filter((msg) => msg.ruleId?.startsWith("@elsikora/nest/")).length).toBe(0);
			});
		});

		describe("Controller API Decorators", () => {
			it("should enforce API response decorators", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNest: true,
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("nest/invalid/api-method-should-specify-api-response.controller.fixture.ts")]);

				expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/2/api-method-should-specify-api-response")).toBe(true);
			});

			it("should validate controller decorators with API tags", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNest: true,
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("nest/invalid/controllers-should-supply-api-tags.controller.fixture.ts")]);

				expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/2/controllers-should-supply-api-tags")).toBe(true);
			});
		});
	});

	describe("Modules", () => {
		describe("Module Decorators", () => {
			it("should validate module decorator array items", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNest: true,
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("nest/invalid/decorator-array-items.module.fixture.ts")]);

				expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/1/decorator-array-items")).toBe(true);
			});
		});
	});
});