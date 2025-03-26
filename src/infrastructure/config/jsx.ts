import type { Linter } from "eslint";

import { formatConfig } from "@infrastructure/utility";
import jsx from "eslint-plugin-jsx-a11y";

export default function loadConfig(): Array<Linter.Config> {
	return [formatConfig([jsx.flatConfigs.recommended])[0]] as Array<Linter.Config>;
}
