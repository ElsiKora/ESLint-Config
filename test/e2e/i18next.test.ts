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

	describe("Translatable JSX attributes", () => {
		it.each([
			["placeholder", `<input placeholder="Enter your name" />`],
			["alt", `<img alt="Company logo" src="/logo.png" />`],
			["title", `<abbr title="World Health Organization">WHO</abbr>`],
			["aria-label", `<button aria-label="Close dialog" type="button" />`],
			["placeholder on a component", `<TextField placeholder="Enter your name" />`],
		])("should report an untranslated %s attribute", async (_name: string, element: string) => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const [result] = await eslint.lintText(`export function Form() {\n\treturn ${element};\n}\n`, { filePath: "src/shared/ui/form.jsx" });

			expect(result?.messages.some((msg) => msg.ruleId === formatRuleName("i18next/no-literal-string"))).toBe(true);
		});

		it.each([
			["a Suspense fallback", `<Suspense fallback={<div>Loading</div>}><Outlet /></Suspense>`],
			["a route element", `<Route element={<p>Not found</p>} path="*" />`],
			["a component slot", `<Modal footer={<Button>Cancel</Button>} />`],
		])("should report untranslated JSX nested inside %s", async (_name: string, element: string) => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const [result] = await eslint.lintText(`export function Form() {\n\treturn ${element};\n}\n`, { filePath: "src/shared/ui/form.jsx" });

			expect(result?.messages.filter((msg) => msg.ruleId === formatRuleName("i18next/no-literal-string")).map((msg) => msg.message)).toEqual([expect.stringMatching(/Loading|Not found|Cancel/)]);
		});

		it("should not report technical attributes", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const [result] = await eslint.lintText(`export function Form() {\n\treturn <TextField className="field" data-testid="email-field" href="/login" id="email" key="email-field" placeholder={t("email.placeholder")} src="/icon.svg" style={{ display: "flex" }} type="email" />;\n}\n`, { filePath: "src/shared/ui/form.jsx" });

			expect(result?.messages).toEqual([]);
		});
	});

	describe("Technical strings in JSX expressions", () => {
		it.each([
			["a date format pattern", `<time>{format(date, "dd.MM.yyyy")}</time>`],
			["an Intl locale", `<span>{new Intl.NumberFormat("en-US", { currency: "EUR", style: "currency" }).format(price)}</span>`],
			["a toLocaleDateString locale", `<span>{date.toLocaleDateString("de-DE")}</span>`],
		])("should not report %s", async (_name: string, element: string) => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const [result] = await eslint.lintText(`export function Price({ date, price }) {\n\treturn ${element};\n}\n`, { filePath: "src/shared/ui/price.jsx" });

			expect(result?.messages).toEqual([]);
		});
	});

	describe("Tests and stories", () => {
		it.each(["form.test.jsx", "form.spec.jsx", "form.stories.jsx", "__tests__/form.jsx"])("should not report literal text in %s", async (fileName: string) => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const [result] = await eslint.lintText(`export const view = render(<button title="Save changes">Save</button>);\n`, { filePath: `src/shared/ui/${fileName}` });

			expect(result?.messages.filter((msg) => msg.ruleId === formatRuleName("i18next/no-literal-string"))).toEqual([]);
		});

		it("should still report the same text in source files", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const [result] = await eslint.lintText(`export const view = render(<button title="Save changes">Save</button>);\n`, { filePath: "src/shared/ui/form.jsx" });

			expect(result?.messages.filter((msg) => msg.ruleId === formatRuleName("i18next/no-literal-string"))).toHaveLength(2);
		});
	});
});
