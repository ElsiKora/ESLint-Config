import type { Linter } from "eslint";

import eslintPluginYml from "eslint-plugin-yml";

import { formatConfig } from "../utility/format-config.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [...formatConfig([...eslintPluginYml.configs["flat/recommended"]])] as Array<Linter.Config>;
}
