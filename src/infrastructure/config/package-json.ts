import type { Linter } from "eslint";

import eslintPluginPackageJson from "eslint-plugin-package-json";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			...formatConfig([eslintPluginPackageJson.configs.recommended])[0],
			rules: {
				...formatConfig([eslintPluginPackageJson.configs.recommended])[0].rules,
				[formatRuleName("package-json/order-properties")]: "error",
			},
		},
	] as Array<Linter.Config>;
}
