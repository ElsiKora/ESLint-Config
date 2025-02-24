import type { Linter } from "eslint";

// @ts-ignore
import typeormTypescriptRecommended from "eslint-plugin-typeorm-typescript/recommended";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format-config.utility";

export default tseslint.config({
	// @ts-ignore
	// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
	extends: [...formatConfig([typeormTypescriptRecommended])],
	rules: {
		"typeorm-typescript/enforce-column-types": "error",
		"typeorm-typescript/enforce-consistent-nullability": ["error", { specifyNullable: "always" }],
		"typeorm-typescript/enforce-relation-types": "error",
	},
}) as Array<Linter.Config>;
