import type { Linter } from "eslint";

import jsx from "eslint-plugin-jsx-a11y";

import { formatConfig } from "../utility/format-config.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [formatConfig([jsx.flatConfigs.recommended])[0]] as Array<Linter.Config>;
}
