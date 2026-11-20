import type { ESLint, Linter } from "eslint";

import { describe, expect, it } from "vitest";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { formatRuleName } from "../../src";

const VITE_FIXTURE_ROOT: string = getFixturePath("fsd/vite");
const NEXT_FIXTURE_ROOT: string = getFixturePath("fsd/next");

function getRuleIds(result: ESLint.LintResult | undefined): Array<string | null> {
	return result?.messages.map((message) => message.ruleId) ?? [];
}

function formatMessages(results: Array<ESLint.LintResult>): Array<string> {
	return results.flatMap((result) => result.messages.map((message) => `${result.filePath}: ${message.ruleId}: ${message.message}`));
}

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

	describe("Feature-Sliced Design v2.1 compatibility", () => {
		it.each([
			["Vite-style", VITE_FIXTURE_ROOT],
			["Next.js-style", NEXT_FIXTURE_ROOT],
		])("should pass the %s FSD reference tree", async (_name: string, cwd: string) => {
			const eslint: ESLint = await createEsLintInstance({ withCheckFile: true, withFsd: true, withPerfectionist: true }, undefined, cwd);

			const results: Array<ESLint.LintResult> = await eslint.lintFiles(["**/*.js", "**/*.jsx"]);

			expect(results.length).toBeGreaterThan(0);
			expect(formatMessages(results)).toEqual([]);
		});

		it("should accept per-component and per-segment Shared public APIs", async () => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(
				`
					import { apiClient } from "@/shared/api";
					import { formatDate } from "@/shared/lib/format";
					import { Button } from "@/shared/ui/button";

					export const imports = [apiClient, Button, formatDate];
				`,
				{ filePath: `${VITE_FIXTURE_ROOT}/src/features/auth/ui/profile-form.jsx` },
			);

			expect(getRuleIds(result)).not.toContain(formatRuleName("fsd/no-public-api-sidestep"));
		});

		it.each(["@/shared/ui/button/button", "@/shared/lib/format/format-date", "@/shared/api/client"])("should report the Shared internal module %s", async (importPath: string) => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(`import * as internal from "${importPath}";\nexport const value = internal;\n`, { filePath: `${VITE_FIXTURE_ROOT}/src/features/auth/ui/profile-form.jsx` });

			expect(getRuleIds(result)).toContain(formatRuleName("fsd/no-public-api-sidestep"));
		});

		it.each([
			["Vite-style", VITE_FIXTURE_ROOT, "src/app/routes/editor-route.jsx", "@/pages/editor/ui/editor-page"],
			["Next.js-style", NEXT_FIXTURE_ROOT, "src/app/layouts/about-layout.jsx", "@/pages/about/ui/about-page"],
		])("should protect the public API of pages slices in the %s tree", async (_name: string, cwd: string, filePath: string, importPath: string) => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, cwd);

			const [result] = await eslint.lintText(`import * as page from "${importPath}";\nexport const route = page;\n`, { filePath: `${cwd}/${filePath}` });

			expect(getRuleIds(result)).toContain(formatRuleName("fsd/no-public-api-sidestep"));
		});

		it.each([
			["widgets before features", `import { Header } from "@/widgets/header";\nimport { LoginForm } from "@/features/auth";\n`],
			["features before entities", `import { LoginForm } from "@/features/auth";\nimport { UserCard } from "@/entities/user";\n`],
		])("should keep import sorting satisfiable with perfectionist for %s", async (_name: string, imports: string) => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true, withPerfectionist: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(`${imports}export const value = 1;\n`, { filePath: `${VITE_FIXTURE_ROOT}/src/pages/editor/ui/editor-toolbar.jsx` });

			expect(getRuleIds(result)).toEqual([]);
		});

		it("should sort FSD imports by layer with perfectionist", async () => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true, withPerfectionist: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(`import { UserCard } from "@/entities/user";\nimport { Header } from "@/widgets/header";\nexport const value = [Header, UserCard];\n`, { filePath: `${VITE_FIXTURE_ROOT}/src/pages/editor/ui/editor-toolbar.jsx` });

			expect(getRuleIds(result)).toEqual([formatRuleName("perfectionist/sort-imports")]);
		});

		it.each([
			["the app layer importing its own store segment", "src/app/providers/query-provider.jsx", `import { rootStore } from "@/app/store";\n`],
			["the app layer importing a store module relatively", "src/app/providers/query-provider.jsx", `import { rootStore } from "../store/root-store";\n`],
			["a slice importing its own model store", "src/entities/cart/model/cart-total.js", `import { cartStore } from "./store/cart-store";\n`],
		])("should allow %s", async (_name: string, filePath: string, imports: string) => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(`${imports}export const value = 1;\n`, { filePath: `${VITE_FIXTURE_ROOT}/${filePath}` });

			expect(getRuleIds(result)).toEqual([]);
		});

		it("should still forbid lower layers from importing the app store", async () => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(`import { rootStore } from "@/app/store";\nexport const value = rootStore;\n`, { filePath: `${VITE_FIXTURE_ROOT}/src/features/auth/model/session.js` });

			expect(getRuleIds(result)).toContain(formatRuleName("fsd/forbidden-imports"));
		});

		it("should not enable fsd-lint rules that cannot report or contradict FSD", async () => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, VITE_FIXTURE_ROOT);

			const config: Linter.Config = await eslint.calculateConfigForFile(`${VITE_FIXTURE_ROOT}/src/entities/user/model/user.js`);

			expect(Object.keys(config.rules ?? {})).not.toContain(formatRuleName("fsd/no-ui-in-business-logic"));
			expect(Object.keys(config.rules ?? {})).not.toContain(formatRuleName("fsd/no-global-store-imports"));
		});

		it.each(["login-form.test.jsx", "login-form.spec.jsx", "login-form.stories.jsx"])("should apply layer rules to %s", async (fileName: string) => {
			const eslint: ESLint = await createEsLintInstance({ withFsd: true }, undefined, VITE_FIXTURE_ROOT);

			const [result] = await eslint.lintText(`import { EditorPage } from "@/pages/editor";\nimport { createUser } from "@/entities/user/model/user";\nexport const value = [EditorPage, createUser];\n`, { filePath: `${VITE_FIXTURE_ROOT}/src/features/auth/ui/${fileName}` });

			expect(getRuleIds(result)).toContain(formatRuleName("fsd/forbidden-imports"));
			expect(getRuleIds(result)).toContain(formatRuleName("fsd/no-public-api-sidestep"));
		});
	});
});
