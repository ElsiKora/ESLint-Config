import type { Linter } from "eslint";

import { formatConfig, formatRuleName } from "@infrastructure/utility";
// @ts-ignore
import tailwind from "eslint-plugin-tailwindcss";

/**
 * Loads the ESLint configuration for Tailwind CSS
 * @returns {Array<Linter.Config>} An array of ESLint configurations for Tailwind CSS
 */
export default function loadConfig(): Array<Linter.Config> {
	// Since eslint-plugin-tailwindcss 4 the recommended preset is a single flat config for Tailwind CSS 4.
	// It reads the theme from `settings.tailwindcss.cssConfigPath`, which consumers point at their main Tailwind CSS file.
	// The plugin types its config with typescript-eslint's flat config type, which differs from ESLint's own.
	const tailwindRecommendedConfig: Linter.Config = tailwind.configs.recommended as unknown as Linter.Config;

	return [
		...formatConfig([tailwindRecommendedConfig]),
		{
			rules: {
				[formatRuleName("tailwindcss/enforces-negative-arbitrary-values")]: "off",
				[formatRuleName("tailwindcss/no-custom-classname")]: "off", // Disable custom classnames to allow for flexibility in project styling.
			},
		},
	] as Array<Linter.Config>;
}
