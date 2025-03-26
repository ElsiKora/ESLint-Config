import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import eslintPluginYml from "eslint-plugin-yml";

export default function loadConfig(): Array<Linter.Config> {
	return [...formatConfig([...eslintPluginYml.configs["flat/recommended"]])] as Array<Linter.Config>;
}
