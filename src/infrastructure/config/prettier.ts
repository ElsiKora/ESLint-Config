import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import prettier from "eslint-plugin-prettier/recommended";

export default function loadConfig(): Array<Linter.Config> {
	return [...formatConfig([prettier])] as Array<Linter.Config>;
}
