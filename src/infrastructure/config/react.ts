import type { Linter } from "eslint";

// @ts-ignore
import react from "@eslint-react/eslint-plugin";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format-config.utility";

export default [
	// @ts-ignore
	// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-argument
	...formatConfig([react.configs.all]),
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					// eslint-disable-next-line @elsikora-typescript/naming-convention
					jsx: true,
				},
				ecmaVersion: "latest",
			},
		},
		plugins: {
			// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
			react: react,
		},
	},
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				// eslint-disable-next-line @elsikora-typescript/naming-convention
				projectService: true,
			},
		},
	},
] as Array<Linter.Config>;
