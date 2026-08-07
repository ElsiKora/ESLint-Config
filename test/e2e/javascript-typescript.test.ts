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

				expect(results[0].errorCount).toBe(0);
				expect(results[0].messages).toHaveLength(0);
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
			it("should allow camelCase readonly data properties and UPPER_CASE semantic constants", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTypescriptStrict: true,
				});

				const results = await eslint.lintFiles([getFixturePath("typescript/valid/readonly-property-naming.fixture.ts")]);

				expect(results[0].errorCount).toBe(0);
				expect(results[0].messages).toHaveLength(0);
			});

			it("should require UPPER_CASE static readonly properties and preserve boolean prefixes", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTypescriptStrict: true,
				});

				const results = await eslint.lintFiles([getFixturePath("typescript/invalid/readonly-property-naming.fixture.ts")]);
				const namingConventionMessages = results[0].messages.filter((message) => message.ruleId === formatRuleName("@typescript-eslint/naming-convention"));

				expect(namingConventionMessages).toEqual([
					expect.objectContaining({
						line: 2,
						message: expect.stringContaining("enabled"),
						messageId: "missingAffix",
					}),
					expect.objectContaining({
						line: 6,
						message: expect.stringContaining("retryLimit"),
						messageId: "doesNotMatchFormat",
					}),
				]);
			});

			it("should enforce function return types", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("typescript/invalid/explicit-function-return-type.fixture.ts")]);

				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@typescript-eslint/explicit-function-return-type"))).toBe(false);
			});

			it("should enforce sorted decorators", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTypescript: true,
				});

				const results = await eslint.lintFiles([getFixturePath("typescript/invalid/sort-decorators.fixture.ts")]);

				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("sort-decorators/sort-on-classes"))).toBe(true);
			});
		});
	});
});
