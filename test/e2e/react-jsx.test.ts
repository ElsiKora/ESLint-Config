import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatPluginName } from "../../src";

describe("React and JSX Configuration", () => {
	describe("React Components", () => {
		describe("Valid JSX Code", () => {
			it("should pass valid JSX code", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withReact: true,
				});

				const results = await eslint.lintFiles([getFixturePath("react/valid/Clean.fixture.jsx")]);
				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});
	});

	describe("React Hooks", () => {
		describe("useEffect Rules", () => {
			it("should enforce hooks rules for setState inside useEffect", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withReact: true,
					withJsx: true,
					withNext: true,
				});

				const results = await eslint.lintFiles([getFixturePath("react/invalid/no-direct-set-state-in-use-effect.fixture.jsx")]);

				expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatPluginName("@eslint-react/hooks-extra")))).toBe(true);
			});
		});
	});
});
