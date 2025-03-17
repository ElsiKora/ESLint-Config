import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import eslintPluginPackageJson from "eslint-plugin-package-json";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		...formatConfig([eslintPluginPackageJson.configs.recommended]),
		{
			rules: {
				[formatRuleName("package-json/order-properties")]: config.withPerfectionist ? "off" : "error",
			},
		},
	] as Array<Linter.Config>;
}
