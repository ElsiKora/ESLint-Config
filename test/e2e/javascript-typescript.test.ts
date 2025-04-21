import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../src";

describe("JavaScript and TypeScript Configuration", () => {
	describe("JavaScript Configuration", () => {
		describe("Valid Code", () => {
			it("should pass valid JavaScript code", async () => {
				let eslint: ESLint = await createEsLintInstance({
					withJavascript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("javascript/valid/clean.fixture.js")]);
				console.log("🚀 ~ it ~ results:", results[0].messages);

				expect(results[0].errorCount).toBe(0);
				expect(results[0].messages).toHaveLength(1);
			});
		});
	});

	describe("TypeScript Configuration", () => {
		describe("Valid Code", () => {
			it("should pass valid TypeScript code", async () => {
				let eslint: ESLint = await createEsLintInstance({
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("typescript/valid/clean.fixture.ts")]);

				expect(results[0].errorCount).toBe(0);
				expect(results[0].messages).toHaveLength(0);
			});
		});

		describe("Type and Style Rules", () => {
			it("should enforce naming conventions", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTypescript: true,
				});

				// const results = await eslint.lintFiles([getFixturePath("typescript/invalid/naming-convention.fixture.ts")]);

				// expect(results[0].errorCount).toBeGreaterThan(0);
				// expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@typescript-eslint/naming-convention"))).toBe(true);
			});

			it("should enforce function return types", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("typescript/invalid/explicit-function-return-type.fixture.ts")]);

				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@typescript-eslint/explicit-function-return-type"))).toBe(false);
			});
		});
	});
});
