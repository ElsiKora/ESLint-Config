import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatPluginName } from "../../infrastructure/utility/format-plugin-name.utility";

describe("CSS Configuration", () => {
	describe("Valid CSS Files", () => {
		it("should pass valid css file", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withCss: true,
			});

			const results = await eslint.lintFiles([getFixturePath("css/valid/clean.fixture.css")]);

			expect(results[0].messages.filter((msg) => msg.ruleId?.startsWith("@elsikora/css")).length).toBe(0);
		});
	});

	describe("CSS Style Rules", () => {
		describe("Structure Rules", () => {
			it("should enforce no empty blocks rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withCss: true,
				});
				const results = await eslint.lintFiles([getFixturePath("css/invalid/no-empty-blocks.fixture.css")]);
				expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatPluginName("css")))).toBe(true);
			});
		});
	});
});