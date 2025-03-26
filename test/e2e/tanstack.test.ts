import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../dist/esm/index";

describe("TanStack Configuration", () => {
	describe("Valid TanStack Code", () => {
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
	});

	describe("TanStack Query", () => {
		describe("Query Hooks Rules", () => {
			it("should enforce exhaustive dependencies rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTanstack: true,
				});

				const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/exhaustive-deps.fixture.tsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/exhaustive-deps"))).toBe(true);
			});

			it("should enforce no rest destructuring rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTanstack: true,
				});

				const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/no-rest-destructuring.fixture.tsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/no-rest-destructuring"))).toBe(true);
			});
		});

		describe("Query Client Rules", () => {
			it("should enforce stable query client rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTanstack: true,
				});

				const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/stable-query-client.fixture.tsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/stable-query-client"))).toBe(true);
			});
		});

		describe("Query Dependencies", () => {
			it("should enforce no unstable dependencies rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTanstack: true,
				});

				const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/no-unstable-deps.fixture.tsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/no-unstable-deps"))).toBe(true);
			});
		});

		describe("Infinite Query", () => {
			it("should enforce infinite query property order rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTanstack: true,
				});

				const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/infinite-query-property-order.fixture.tsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/query/infinite-query-property-order"))).toBe(true);
			});
		});
	});

	describe("TanStack Router", () => {
		describe("Router Configuration", () => {
			it("should enforce create route property order rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withTanstack: true,
				});

				const results = await eslint.lintFiles([getFixturePath("tanstack/invalid/router-property-order.fixture.tsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("@tanstack/router/create-route-property-order"))).toBe(true);
			});
		});
	});
});
