import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../src";

describe("i18next Configuration", () => {
	describe("Internationalization", () => {
		describe("Valid Translations", () => {
			it("should pass valid code with proper translations", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withI18next: true,
				});

				const results = await eslint.lintFiles([getFixturePath("i18next/valid/clean.fixture.jsx")]);
				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});

		describe("String Translation Rules", () => {
			it("should enforce no-literal-string rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withI18next: true,
				});

				const results = await eslint.lintFiles([getFixturePath("i18next/invalid/no-translations.fixture.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("i18next/no-literal-string"))).toBe(true);
			});
		});
	});
});
