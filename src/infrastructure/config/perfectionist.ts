/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { formatConfig, formatRuleName } from "@infrastructure/utility";
import perfectionist from "eslint-plugin-perfectionist";

/**
 * Loads the ESLint configuration for perfectionist (sorting imports, etc.)
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for perfectionist
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	// FSD layers from top to bottom, so imports read in the same order as the layer hierarchy. Only the `@/` alias marks a layer: bare names such as `entities` are npm packages.
	const fsdLayers: Array<string> = ["app", "processes", "pages", "widgets", "features", "entities", "shared"];
	const fsdLayerGroups: Array<{ elementNamePattern: string; groupName: string }> = fsdLayers.map((layer: string) => ({ elementNamePattern: `^@/${layer}(/|$)`, groupName: `fsd-${layer}` }));

	return [
		{
			...formatConfig([perfectionist.configs["recommended-alphabetical"]])[0],
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			rules: {
				[formatRuleName("perfectionist/sort-imports")]: config.withFsd
					? [
							"error",
							{
								customGroups: fsdLayerGroups,
								groups: ["builtin", "external", ...fsdLayerGroups.map(({ groupName }: { groupName: string }) => groupName), "internal", "parent", "sibling", "index", "unknown"],
								ignoreCase: true,
								newlinesBetween: 0,
								order: "asc",
								partitionByComment: false,
								partitionByNewLine: false,
								type: "alphabetical",
							},
						]
					: [
							"error",
							{
								environment: "node",
								groups: ["type-builtin", "type-import", "type-external", "type-internal", "type-parent", "type-sibling", "type-index", "builtin", "external", "internal", "parent", "sibling", "index", "style", "side-effect", "unknown"],
								ignoreCase: false,
								newlinesBetween: 1,
								order: "asc",
								sortSideEffects: true,
								specialCharacters: "keep",
								type: "alphabetical",
							},
						],
			},
		},
	] as Array<Linter.Config>;
}
