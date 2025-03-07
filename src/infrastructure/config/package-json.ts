import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";

import eslintPluginPackageJson from "eslint-plugin-package-json/configs/recommended";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			// @ts-ignore
			...formatConfig([eslintPluginPackageJson])[0],
			rules: {
				// @ts-ignore
				...formatConfig([eslintPluginPackageJson])[0].rules,
				[formatRuleName("package-json/order-properties")]: config.withPerfectionist ? "off" : "error",
			},
		},
	] as Array<Linter.Config>;
}
