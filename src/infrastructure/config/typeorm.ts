import type { Linter } from "eslint";

// @ts-ignore
import typeormTypescriptRecommended from "eslint-plugin-typeorm-typescript/recommended";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return tseslint.config({
		// @ts-ignore
		// eslint-disable-next-line @elsikora/typescript/no-unsafe-argument
		extends: [...formatConfig([typeormTypescriptRecommended])],
		rules: {
			[formatRuleName("typeorm-typescript/enforce-column-types")]: "error", // Enforce column types to ensure data integrity and consistency.
			[formatRuleName("typeorm-typescript/enforce-consistent-nullability")]: ["error", { specifyNullable: "always" }], // Enforce consistent nullability to ensure data integrity and consistency.
			[formatRuleName("typeorm-typescript/enforce-relation-types")]: "error", // Enforce relation types to ensure data integrity and consistency.
		},
	}) as Array<Linter.Config>;
}
