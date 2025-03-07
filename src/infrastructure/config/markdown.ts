import type { Linter } from "eslint";

import markdown from "@elsikora/eslint-plugin-markdown";

import { formatConfig } from "../utility/format-config.utility";

export default function loadConfig(): Array<Linter.Config> {
	return formatConfig([markdown.configs.recommended[0]]);
}
