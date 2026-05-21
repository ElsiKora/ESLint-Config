import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../src";

describe("FSD (Feature-Sliced Design) Configuration", () => {
	it("should pass valid FSD code", async () => {
		const eslint: ESLint = await createEsLintInstance({
			withFsd: true,
		});

		const [result] = await eslint.lintText(
			`
				import { SearchForm } from "./search-form";

				export const SearchArticles = () => <SearchForm />;
			`,
			{ filePath: "src/features/search/ui/search-articles.jsx" },
		);

		expect(result.warningCount).toBe(0);
		expect(result.errorCount).toBe(0);
	});

	it("should enforce public API rules with fsd-lint only", async () => {
		const eslint: ESLint = await createEsLintInstance({
			withFsd: true,
		});

		const [result] = await eslint.lintText(
			`
				import { addCommentFormReducer } from "@entities/article/model/slice";

				export const reducer = addCommentFormReducer;
			`,
			{ filePath: "src/features/comments/ui/comment-list.jsx" },
		);

		expect(result.messages.some((msg) => msg.ruleId === formatRuleName("fsd/no-public-api-sidestep"))).toBe(true);
		expect(result.messages.some((msg) => msg.ruleId === formatRuleName("@conarti/feature-sliced/public-api"))).toBe(false);
	});

	it("should enforce cross-layer relative imports with fsd-lint only", async () => {
		const eslint: ESLint = await createEsLintInstance({
			withFsd: true,
		});

		const [result] = await eslint.lintText(
			`
				import { store } from "../../../app/store";

				export const service = store;
			`,
			{ filePath: "src/features/auth/model/service.js" },
		);

		expect(result.messages.some((msg) => msg.ruleId === formatRuleName("fsd/no-relative-imports"))).toBe(true);
		expect(result.messages.some((msg) => msg.ruleId === formatRuleName("@conarti/feature-sliced/absolute-relative"))).toBe(false);
	});

	it("should enforce cross-segment re-exports with conarti", async () => {
		const eslint: ESLint = await createEsLintInstance({
			withFsd: true,
		});

		const [result] = await eslint.lintText(
			`
				export { UserCard } from "../ui/user-card";
			`,
			{ filePath: "src/entities/user/model/index.js" },
		);

		expect(result.messages.some((msg) => msg.ruleId === formatRuleName("@conarti/feature-sliced/no-cross-segment-reexport"))).toBe(true);
	});

	it("should enforce layer boundaries with fsd-lint", async () => {
		const eslint: ESLint = await createEsLintInstance({
			withFsd: true,
		});

		const [result] = await eslint.lintText(
			`
				import { LoginPage } from "@pages/login";

				export const service = LoginPage;
			`,
			{ filePath: "src/features/auth/model/service.js" },
		);

		expect(result.messages.some((msg) => msg.ruleId === formatRuleName("fsd/forbidden-imports"))).toBe(true);
	});
});
