import type { ESLint } from "eslint";
import type { IConfigOptions } from "../../src";

import { describe, expect, it } from "vitest";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../src";

const FOLDER_NAMING_RULE_ID: string = formatRuleName("check-file/folder-naming-convention");
const KEBAB_CASE_MESSAGE: string = "does not match the kebab-case pattern";
const FSD_SYNTAX: string = "@x";
const NEXT_SYNTAX: string = "_private, @slot, (group), (.)intercepted, [param], [...param], [[...param]]";
const TANSTACK_SYNTAX: string = "_pathless, (group), $param";

async function lintFolderNaming(filePath: string, options: IConfigOptions = {}): Promise<Array<string | null>> {
	const eslint: ESLint = await createEsLintInstance({ withCheckFile: true, withJavascript: true, ...options });
	const [result] = await eslint.lintText(`export const value = 1;\n`, { filePath });

	return result?.messages.filter((message) => message.ruleId === FOLDER_NAMING_RULE_ID).map((message) => message.message) ?? [];
}

describe("Check File Configuration", () => {
	describe("Folder naming convention without router or FSD presets", () => {
		it("should accept kebab-case folders", async () => {
			expect(await lintFolderNaming("src/features/auth-by-email/ui/form.js")).toEqual([]);
		});

		it.each([
			["camelCase folders", "src/badFolder/user.js", "badFolder"],
			["PascalCase folders", "src/features/Auth/index.js", "Auth"],
			["snake_case folders", "src/features/auth_form/index.js", "auth_form"],
			["underscore-prefixed folders", "src/_utils/index.js", "_utils"],
			["dollar-prefixed folders", "src/$tmp/index.js", "$tmp"],
			["bracketed folders", "src/[id]/index.js", "[id]"],
			["parenthesised folders", "src/(legacy)/index.js", "(legacy)"],
			["@-prefixed folders", "src/entities/song/@x/artist.js", "@x"],
		])("should reject %s", async (_name: string, filePath: string, folder: string) => {
			expect(await lintFolderNaming(filePath)).toEqual([`The folder "${folder}" ${KEBAB_CASE_MESSAGE}`]);
		});
	});

	describe("Folder naming convention with withFsd", () => {
		it("should accept the FSD cross-import notation", async () => {
			expect(await lintFolderNaming("src/entities/song/@x/artist.js", { withFsd: true })).toEqual([]);
		});

		it.each([
			["other @-prefixed folders", "src/entities/song/@artist/index.js", "@artist"],
			["router syntax", "src/app/blog/[slug]/page.js", "[slug]"],
		])("should reject %s", async (_name: string, filePath: string, folder: string) => {
			expect(await lintFolderNaming(filePath, { withFsd: true })).toEqual([`The folder "${folder}" ${KEBAB_CASE_MESSAGE} (allowed around the name: ${FSD_SYNTAX})`]);
		});
	});

	describe("Folder naming convention with withNext", () => {
		it.each([
			["dynamic segments", "src/app/blog/[slug]/page.js"],
			["catch-all segments", "src/app/docs/[...path]/page.js"],
			["optional catch-all segments", "src/app/shop/[[...filters]]/page.js"],
			["route groups", "src/app/(marketing)/about/page.js"],
			["kebab-case parallel route slots", "src/app/@auth-modal/default.js"],
			["private folders", "src/app/_components/header.js"],
			["same-level intercepting routes", "src/app/feed/(.)photo/page.js"],
			["one-level-up intercepting routes", "src/app/feed/(..)photo/page.js"],
			["two-levels-up intercepting routes", "src/app/feed/(..)(..)photo/page.js"],
			["root intercepting routes", "src/app/feed/(...)photo/page.js"],
			["router folders in the root app folder", "app/(marketing)/blog/[slug]/page.js"],
		])("should accept %s", async (_name: string, filePath: string) => {
			expect(await lintFolderNaming(filePath, { withNext: true })).toEqual([]);
		});

		it.each([
			["camelCase parallel route slots", "src/app/@fooBar/default.js", "@fooBar"],
			["kebab-case dynamic segments", "src/app/blog/[post-id]/page.js", "[post-id]"],
			["camelCase route groups", "src/app/(marketingPages)/about/page.js", "(marketingPages)"],
			["unknown intercepting levels", "app/feed/(....)photo/page.js", "(....)photo"],
			["camelCase folders in the root app folder", "app/userProfile/page.js", "userProfile"],
		])("should reject %s", async (_name: string, filePath: string, folder: string) => {
			expect(await lintFolderNaming(filePath, { withNext: true })).toEqual([`The folder "${folder}" ${KEBAB_CASE_MESSAGE} (allowed around the name: ${NEXT_SYNTAX})`]);
		});

		it("should still accept underscore-prefixed _app and _pages folders", async () => {
			expect(await lintFolderNaming("src/_app/providers/index.js", { withFsd: true, withNext: true })).toEqual([]);
			expect(await lintFolderNaming("src/_pages/blog-post/index.js", { withFsd: true, withNext: true })).toEqual([]);
		});
	});

	describe("Folder naming convention with withTanstack", () => {
		it.each([
			["path parameters", "src/app/routes/posts/$postId/route.js"],
			["pathless layouts", "src/app/routes/_auth/login.js"],
			["route groups", "src/app/routes/(marketing)/about.js"],
		])("should accept %s", async (_name: string, filePath: string) => {
			expect(await lintFolderNaming(filePath, { withTanstack: true })).toEqual([]);
		});

		it.each([
			["kebab-case path parameters", "src/app/routes/posts/$post-id/route.js", "$post-id"],
			["Next.js dynamic segments", "src/app/blog/[slug]/page.js", "[slug]"],
		])("should reject %s", async (_name: string, filePath: string, folder: string) => {
			expect(await lintFolderNaming(filePath, { withTanstack: true })).toEqual([`The folder "${folder}" ${KEBAB_CASE_MESSAGE} (allowed around the name: ${TANSTACK_SYNTAX})`]);
		});
	});
});
