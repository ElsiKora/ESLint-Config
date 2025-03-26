import type { Linter } from "eslint";

import { formatPluginName, formatRuleName } from "@infrastructure/utility";
// @ts-ignore
import typeormTypescript from "eslint-plugin-typeorm-typescript";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for TypeORM
 * @returns {Array<Linter.Config>} An array of ESLint configurations for TypeORM
 */
export default function loadConfig(): Array<Linter.Config> {
	return tseslint.config({
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			// @ts-ignore
			parser: tseslint.parser,
			parserOptions: {
				// eslint-disable-next-line @elsikora/typescript/naming-convention
				projectService: true,
			},
		},
		plugins: {
			[formatPluginName("typeorm-typescript")]: typeormTypescript,
		},
		rules: {
			[formatRuleName("typeorm-typescript/enforce-column-types")]: "error", // Enforce column types to ensure data integrity and consistency.
			[formatRuleName("typeorm-typescript/enforce-consistent-nullability")]: ["error", { specifyNullable: "always" }], // Enforce consistent nullability to ensure data integrity and consistency.
			[formatRuleName("typeorm-typescript/enforce-relation-types")]: "off", // Enforce relation types to ensure data integrity and consistency.
		},
	}) as Array<Linter.Config>;
}
