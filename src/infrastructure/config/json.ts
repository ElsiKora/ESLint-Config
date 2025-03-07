import type { Linter } from "eslint";

import eslintPluginJsonc from "eslint-plugin-jsonc";

import { formatConfig } from "../utility/format-config.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-jsonc"]])[0],
		},
	] as Array<Linter.Config>;
}
