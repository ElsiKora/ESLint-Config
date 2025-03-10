import type { Linter } from "eslint";

// @ts-ignore
import tailwind from "eslint-plugin-tailwindcss";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default function loadConfig(): Array<Linter.Config> {
	return [
		// eslint-disable-next-line @elsikora/typescript/no-unsafe-member-access,@elsikora/typescript/no-unsafe-argument,@elsikora/typescript/no-unsafe-assignment
		...formatConfig([...tailwind.configs["flat/recommended"]]),
		{
			rules: {
				[formatRuleName("tailwindcss/no-custom-classname")]: "off", // Disable custom classnames to allow for flexibility in project styling.
			},
		},
	] as Array<Linter.Config>;
}
