import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatPluginName } from "../../infrastructure/utility/format-plugin-name.utility";
import { formatRuleName } from "../../infrastructure/utility/format-rule-name.utility";

describe("ESLint Config E2E Tests", () => {
	describe("JavaScript Configuration", () => {
		it("should pass valid JavaScript code", async () => {
			let eslint: ESLint = await createEsLintInstance({
				withJavascript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("javascript/valid/clean.fixture.js")]);

			expect(results[0].errorCount).toBe(0);
			expect(results[0].messages).toHaveLength(0);
		});
	});

	describe("TypeScript Configuration", () => {
		it("should pass valid TypeScript code", async () => {
			let eslint: ESLint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/valid/clean.fixture.ts")]);

			expect(results[0].errorCount).toBe(0);
			expect(results[0].messages).toHaveLength(0);
		});

		it("should enforce naming conventions", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/invalid/naming-convention.fixture.ts")]);

			expect(results[0].errorCount).toBeGreaterThan(0);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@typescript-eslint/naming-convention"))).toBe(true);
		});

		it("should enforce function return types", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/invalid/explicit-function-return-type.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@typescript-eslint/explicit-function-return-type"))).toBe(true);
		});
	});

	describe("React Configuration", () => {
		it("should pass valid JSX code", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withReact: true,
			});

			const results = await eslint.lintFiles([getFixturePath("react/valid/Clean.fixture.jsx")]);
			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce hooks rules", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withReact: true,
				withJsx: true,
				withNext: true,
			});

			const results = await eslint.lintFiles([getFixturePath("react/invalid/no-direct-set-state-in-use-effect.fixture.jsx")]);

			expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatPluginName("@eslint-react/hooks-extra")))).toBe(true);
		});
	});

	describe("NestJS Configuration", () => {
		it("should pass valid NestJS controller", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
				withSonar: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/valid/clean.controller.fixture.ts")]);

			expect(results[0].messages.filter((msg) => msg.ruleId?.startsWith("@elsikora/nest/")).length).toBe(0);
		});

		it("should enforce API response decorators", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/invalid/api-method-should-specify-api-response.controller.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/2/api-method-should-specify-api-response")).toBe(true);
		});

		it("should validate controller decorators", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/invalid/controllers-should-supply-api-tags.controller.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/2/controllers-should-supply-api-tags")).toBe(true);
		});

		it("should validate controller decorators", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/invalid/decorator-array-items.module.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/1/decorator-array-items")).toBe(true);
		});
	});

	describe("CSS Configuration", () => {
		it("should pass valid css file", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withCss: true,
			});

			const results = await eslint.lintFiles([getFixturePath("css/valid/clean.fixture.css")]);

			expect(results[0].messages.filter((msg) => msg.ruleId?.startsWith("@elsikora/css")).length).toBe(0);
		});

		it("should enforce css rules", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withCss: true,
			});
			const results = await eslint.lintFiles([getFixturePath("css/invalid/no-empty-blocks.fixture.css")]);
			expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatPluginName("css")))).toBe(true);
		});
	});

	describe("Markdown Configuration", () => {
		it("should pass valid Markdown code", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withMarkdown: true,
			});

			const results = await eslint.lintFiles([getFixturePath("markdown/valid/clean.fixture.md")]);
			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce fenced code language", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withMarkdown: true,
			});

			const results = await eslint.lintFiles([getFixturePath("markdown/invalid/fenced-code-language.fixture.md")]);

			expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatRuleName("markdown/fenced-code-language")))).toBe(true);
		});
	});

	describe("JSDoc Configuration", () => {
		it("should pass valid Markdown code", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withJsDoc: true,
			});

			const results = await eslint.lintFiles([getFixturePath("jsdoc/valid/clean.fixture.js")]);
			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce check param names", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withJsDoc: true,
			});

			const results = await eslint.lintFiles([getFixturePath("jsdoc/invalid/check-param-names.fixture.js")]);

			expect(results[0].messages.some((msg) => msg.ruleId?.startsWith(formatRuleName("jsdoc/check-param-names")))).toBe(true);
		});
	});

	describe("FSD (Feature-Sliced Design) Configuration", () => {
		it("should pass valid FSD code", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withFsd: true,
				withPerfectionist: true,
			});

			const results = await eslint.lintFiles([getFixturePath("fsd/valid/clean.fixture.tsx")]);

			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce public API rules", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withFsd: true,
			});

			const results = await eslint.lintFiles([getFixturePath("fsd/invalid/public-api.fixture.tsx")]);

			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@conarti/feature-sliced/public-api"))).toBe(true);
		});
	});

	describe("TanStack Configuration", () => {
		// Проверка валидного кода для всех TanStack плагинов
		it("should pass valid code for all TanStack plugins", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTanstack: true,
			});

			let results = await eslint.lintFiles([getFixturePath("tanstack/valid/valid-query.fixture.tsx")]);
			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);

			results = await eslint.lintFiles([getFixturePath("tanstack/valid/valid-router.fixture.tsx")]);
			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce TanStack Query rules", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTanstack: true,
			});

			let results = await eslint.lintFiles([getFixturePath("tanstack/invalid/exhaustive-deps.fixture.tsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/exhaustive-deps"))).toBe(true);

			results = await eslint.lintFiles([getFixturePath("tanstack/invalid/no-rest-destructuring.fixture.tsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/no-rest-destructuring"))).toBe(true);

			results = await eslint.lintFiles([getFixturePath("tanstack/invalid/stable-query-client.fixture.tsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/stable-query-client"))).toBe(true);

			results = await eslint.lintFiles([getFixturePath("tanstack/invalid/no-unstable-deps.fixture.tsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/no-unstable-deps"))).toBe(true);

			results = await eslint.lintFiles([getFixturePath("tanstack/invalid/infinite-query-property-order.fixture.tsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/infinite-query-property-order"))).toBe(true);
		});

		it("should enforce TanStack Router rules", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTanstack: true,
			});

			const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/router-property-order.fixture.tsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/router/create-route-property-order"))).toBe(true);
		});
	});

	describe("i18next Configuration", () => {
		it("should pass valid code with proper translations", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const results = await eslint.lintFiles([getFixturePath("i18next/valid/clean.fixture.jsx")]);
			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce no-literal-string rule", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withI18next: true,
			});

			const results = await eslint.lintFiles([getFixturePath("i18next/invalid/no-translations.fixture.jsx")]);
			expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("i18next/no-literal-string"))).toBe(true);
		});
	});
});
