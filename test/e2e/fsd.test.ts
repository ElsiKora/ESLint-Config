import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../src";

describe("FSD (Feature-Sliced Design) Configuration", () => {
	describe("Project Structure", () => {
		describe("Valid FSD Architecture", () => {
			it("should pass valid FSD code", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withFsd: true,
					withPerfectionist: true,
				});

				const results = await eslint.lintFiles([getFixturePath("fsd/valid/clean.fixture.tsx")]);

				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});
	});

	describe("Code Organization Rules", () => {
		describe("Public API Pattern", () => {
			it("should enforce public API rules", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withFsd: true,
				});

				const results = await eslint.lintFiles([getFixturePath("fsd/invalid/public-api.fixture.tsx")]);

				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@conarti/feature-sliced/public-api"))).toBe(true);
			});
		});
	});
});
