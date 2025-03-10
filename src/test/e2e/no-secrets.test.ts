import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../infrastructure/utility/format-rule-name.utility";

describe("No-Secrets Configuration", () => {
	describe("Valid Code", () => {
		describe("Clean Code", () => {
			it("should pass valid code without secrets", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNoSecrets: true,
				});

				const results = await eslint.lintFiles([getFixturePath("no-secrets/valid/clean.fixture.js")]);
				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});
	});

	describe("Invalid Code", () => {
		describe("High Entropy Strings", () => {
			it("should enforce no-secrets rule for high entropy strings", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNoSecrets: true,
				});

				const results = await eslint.lintFiles([getFixturePath("no-secrets/invalid/high-entropy.fixture.js")]);

				expect(results[0].errorCount).toBeGreaterThan(0);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("no-secrets/no-secrets"))).toBe(true);
			});
		});

		describe("Pattern Matching", () => {
			it("should enforce no-pattern-match rule for sensitive information patterns", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withNoSecrets: true,
				});

				const results = await eslint.lintFiles([getFixturePath("no-secrets/invalid/pattern-match.fixture.js")]);

				expect(results[0].errorCount).toBeGreaterThan(0);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("no-secrets/no-pattern-match"))).toBe(true);
			});
		});
	});
});
