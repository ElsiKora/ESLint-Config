import type { Linter } from "eslint";

import markdown from "@elsikora/eslint-plugin-markdown";
import { formatConfig } from "@infrastructure/utility";

export default function loadConfig(): Array<Linter.Config> {
	// @ts-ignore
	return formatConfig([markdown.configs.recommended[0]]);
}
