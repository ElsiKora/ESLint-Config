import type { Linter } from "eslint";

import prettier from "eslint-plugin-prettier/recommended";

import { formatConfig } from "../utility/format-config.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [...formatConfig([prettier])] as Array<Linter.Config>;
}
