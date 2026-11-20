import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../src";

const FOLDER_NAMING_RULE_ID: string = formatRuleName("check-file/folder-naming-convention");

async function lintFolderNaming(filePath: string): Promise<Array<string | null>> {
	const eslint: ESLint = await createEsLintInstance({ withCheckFile: true, withJavascript: true });
	const [result] = await eslint.lintText(`export const value = 1;\n`, { filePath });

	return result?.messages.filter((message) => message.ruleId === FOLDER_NAMING_RULE_ID).map((message) => message.message) ?? [];
}

describe("Check File Configuration", () => {
	describe("Folder naming convention", () => {
		it.each([
			["kebab-case slices and segments", "src/features/auth-by-email/ui/form.js"],
			["FSD cross-import notation", "src/entities/song/@x/artist.js"],
			["underscore-prefixed _pages folders", "src/_pages/blog-post/index.js"],
			["underscore-prefixed _app folders", "src/_app/providers/index.js"],
			["Next.js dynamic segment", "src/app/blog/[slug]/page.js"],
			["Next.js catch-all segment", "src/app/docs/[...path]/page.js"],
			["Next.js optional catch-all segment", "src/app/shop/[[...filters]]/page.js"],
			["Next.js route group", "src/app/(marketing)/about/page.js"],
			["Next.js parallel route slot", "src/app/@modal/default.js"],
			["Next.js private folder", "src/app/_components/header.js"],
			["TanStack Router path parameter", "src/app/routes/posts/$postId/route.js"],
			["TanStack Router pathless layout", "src/app/routes/_auth/login.js"],
		])("should accept %s", async (_name: string, filePath: string) => {
			expect(await lintFolderNaming(filePath)).toEqual([]);
		});

		it.each([
			["camelCase folders", "src/badFolder/user.js", "badFolder"],
			["PascalCase folders", "src/features/Auth/index.js", "Auth"],
			["snake_case folders", "src/features/auth_form/index.js", "auth_form"],
			["camelCase inside a route group", "src/app/(marketingPages)/about/page.js", "(marketingPages)"],
		])("should reject %s", async (_name: string, filePath: string, folder: string) => {
			const messages: Array<string | null> = await lintFolderNaming(filePath);

			expect(messages).toHaveLength(1);
			expect(messages[0]).toBe(`The folder "${folder}" does not match the kebab-case pattern (FSD and router syntax such as \`_name\`, \`@x\`, \`(group)\`, \`[param]\` and \`$param\` is allowed around the name)`);
		});
	});
});
