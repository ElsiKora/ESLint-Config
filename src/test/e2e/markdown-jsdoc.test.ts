import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../infrastructure/utility/format-rule-name.utility";

describe("Documentation Configuration", () => {
	describe("Markdown Configuration", () => {
		describe("Valid Markdown Content", () => {
			it("should pass valid Markdown code", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withMarkdown: true,
				});

				const results = await eslint.lintFiles([getFixturePath("markdown/valid/clean.fixture.md")]);
				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});

		describe("Markdown Code Blocks", () => {
			it("should enforce fenced code language", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withMarkdown: true,
				});

				const results = await eslint.lintFiles([getFixturePath("markdown/invalid/fenced-code-language.fixture.md")]);

				expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatRuleName("markdown/fenced-code-language")))).toBe(true);
			});
		});
	});

	describe("JSDoc Configuration", () => {
		describe("Valid JSDoc Comments", () => {
			it("should pass valid JSDoc code", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withJsDoc: true,
				});

				const results = await eslint.lintFiles([getFixturePath("jsdoc/valid/clean.fixture.js")]);
				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});

		describe("JSDoc Parameters", () => {
			it("should enforce check param names", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withJsDoc: true,
				});

				const results = await eslint.lintFiles([getFixturePath("jsdoc/invalid/check-param-names.fixture.js")]);

				expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatRuleName("jsdoc/check-param-names")))).toBe(true);
			});
		});
	});
});