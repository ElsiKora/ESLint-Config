import type { Linter } from "eslint";

// @ts-ignore
import tailwind from "eslint-plugin-tailwindcss";

import { formatConfig } from "../utility/format-config.utility";
import { formatPluginName } from "../utility/format-plugin-name.utility";

export default [
	// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-assignment
	...formatConfig([...tailwind.configs["flat/recommended"]]),
	{
		rules: {
			[`${formatPluginName("tailwindcss")}/no-custom-classname`]: "off",
		},
	},
] as Array<Linter.Config>;
