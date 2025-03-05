import type { Linter } from "eslint";

import eslintPluginJsonc from "eslint-plugin-jsonc";

import { formatConfig } from "../utility/format-config.utility";

export default [
	{
		...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-jsonc"]])[0],
	},
] as Array<Linter.Config>;
