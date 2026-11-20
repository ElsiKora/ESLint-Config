import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { formatPluginName, formatRuleName } from "@infrastructure/utility";
// @ts-ignore
import checkFile from "eslint-plugin-check-file";

const CAMEL_CASE: string = "+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))";
const KEBAB_CASE: string = "+([a-z])*([a-z0-9])*(-+([a-z0-9]))";

interface IFolderSyntax {
	description: string;
	patterns: Array<string>;
}

// Syntax that a preset's architecture or file-based router allows around a kebab-case folder name. Route parameters stay camelCase identifiers.
const FSD_FOLDER_SYNTAX: IFolderSyntax = {
	description: "@x",
	patterns: [String.raw`\@x`],
};

const NEXT_FOLDER_SYNTAX: IFolderSyntax = {
	description: "_private, @slot, (group), (.)intercepted, [param], [...param], [[...param]]",
	patterns: [String.raw`\_${KEBAB_CASE}`, String.raw`\@${KEBAB_CASE}`, String.raw`\(${KEBAB_CASE}\)`, String.raw`@(\(.\)|+(\(..\))|\(...\))${KEBAB_CASE}`, String.raw`\[${CAMEL_CASE}\]`, String.raw`\[...${CAMEL_CASE}\]`, String.raw`\[\[...${CAMEL_CASE}\]\]`],
};

const TANSTACK_FOLDER_SYNTAX: IFolderSyntax = {
	description: "_pathless, (group), $param",
	patterns: [String.raw`\_${KEBAB_CASE}`, String.raw`\(${KEBAB_CASE}\)`, String.raw`\$${CAMEL_CASE}`],
};

/**
 * Loads the ESLint configuration for file checking rules
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for file checking
 */
export default function loadConfig(config: IConfigOptions = {}): Array<Linter.Config> {
	const folderNaming: { errorMessage: string; pattern: string } = getFolderNaming(config);

	const configs: Array<Linter.Config> = [
		{
			files: ["src/**/*"],
			plugins: {
				[formatPluginName("check-file")]: checkFile,
			},
			rules: {
				[formatRuleName("check-file/filename-blocklist")]: [
					"error",
					{
						"**/*.enums.ts": "*.enum.ts",
						"**/*.models.ts": "*.model.ts",
						"**/*.tests.ts": "*.test.ts",
						"**/*.types.ts": "*.type.ts",
						"**/*.util.ts": "*.utility.ts",
					},
				], // Disallow specific filename patterns to enforce a consistent naming convention across the project. For example, preferring `*.enum.ts` over `*.enums.ts`.

				[formatRuleName("check-file/filename-naming-convention")]: [
					"error",
					{
						"**/class/**/*.{js,ts}": "KEBAB_CASE",
						"**/dto/**/*.{js,ts}": "KEBAB_CASE",
						"**/entity/**/*.{js,ts}": "KEBAB_CASE",
						"**/enum/**/*.{js,ts}": "KEBAB_CASE",
						"**/event/*/*.{js,ts}": "KEBAB_CASE",
						"**/filter/**/*.{js,ts}": "KEBAB_CASE",
						"**/interceptor/**/*.{js,ts}": "KEBAB_CASE",
						"**/interface/**/*.{js,ts}": "KEBAB_CASE",
						"**/middleware/**/*.{js,ts}": "KEBAB_CASE",
						"**/modules/*/*.{js,ts}": "KEBAB_CASE",
						"**/subscriber/**/*.{js,ts}": "KEBAB_CASE",
						"**/type/*/*.{js,ts}": "KEBAB_CASE",
						"**/utility/**/*.{js,ts}": "KEBAB_CASE",
						"**/validator/**/*.{js,ts}": "KEBAB_CASE",
					},
					// eslint-disable-next-line @elsikora/typescript/naming-convention
					{ ignoreMiddleExtensions: true },
				], // Enforce a specific naming convention for files in various directories, typically using KEBAB_CASE for clarity and consistency. The `ignoreMiddleExtensions` option allows ignoring file extensions in the middle of filenames, focusing on the final extension for the rule.

				[formatRuleName("check-file/folder-match-with-fex")]: [
					"error",
					{
						"*.api.{ts,js}": "**/api/**",
						"*.class.{js,jsx,ts,tsx}": "**/class/**",
						"*.dto.{js,jsx,ts,tsx}": "**/dto/**",
						"*.entity.{js,jsx,ts,tsx}": "**/entity/**",
						"*.enum.{js,jsx,ts,tsx}": "**/enum/**",
						"*.event.{js,jsx,ts,tsx}": "**/event/**",
						"*.filter.{js,jsx,ts,tsx}": "**/filter/**",
						"*.interceptor.{js,jsx,ts,tsx}": "**/interceptor/**",
						"*.interface.{js,jsx,ts,tsx}": "**/interface/**",
						"*.middleware.{js,jsx,ts,tsx}": "**/middleware/**",
						"*.subscriber.{js,jsx,ts,tsx}": "**/subscriber/**",
						"*.type.{js,jsx,ts,tsx}": "**/type/**",
						"*.utility.{js,jsx,ts,tsx}": "**/utility/**",
						"*.validator.{js,jsx,ts,tsx}": "**/validator/**",
					},
				], // Enforce a naming convention that requires files to be located in folders matching their type (e.g., API files in /api, DTOs in /dto) to ensure a clear and consistent project structure.

				[formatRuleName("check-file/folder-naming-convention")]: [
					"error",
					{
						"src/**": folderNaming.pattern,
					},
					{
						errorMessage: folderNaming.errorMessage,
					},
				], // Require all folders under the `src` directory to use kebab-case naming (e.g., `my-directory`), allowing the folder syntax of the enabled FSD, Next.js and TanStack Router presets around the name.
			},
		},
	];

	if (config.withNext) {
		configs.push({
			files: ["app/**/*"],
			plugins: {
				[formatPluginName("check-file")]: checkFile,
			},
			rules: {
				[formatRuleName("check-file/folder-naming-convention")]: [
					"error",
					{
						"app/**": folderNaming.pattern,
					},
					{
						errorMessage: folderNaming.errorMessage,
					},
				], // The Next.js App Router lives in the root `app` folder, next to `src`, and follows the same folder naming.
			},
		});
	}

	return configs;
}

/**
 * Builds the folder naming pattern and error message for the enabled presets
 * @param {IConfigOptions} config - Configuration options
 * @returns {{ errorMessage: string; pattern: string }} The folder pattern and its error message
 */
function getFolderNaming(config: IConfigOptions): { errorMessage: string; pattern: string } {
	const syntaxes: Array<IFolderSyntax> = [];

	if (config.withFsd) {
		syntaxes.push(FSD_FOLDER_SYNTAX);
	}

	if (config.withNext) {
		syntaxes.push(NEXT_FOLDER_SYNTAX);
	}

	if (config.withTanstack) {
		syntaxes.push(TANSTACK_FOLDER_SYNTAX);
	}

	if (syntaxes.length === 0) {
		return { errorMessage: 'The folder "{{ target }}" does not match the kebab-case pattern', pattern: KEBAB_CASE };
	}

	const patterns: Array<string> = [...new Set([KEBAB_CASE, ...syntaxes.flatMap((syntax: IFolderSyntax) => syntax.patterns)])];

	return {
		errorMessage: `The folder "{{ target }}" does not match the kebab-case pattern (allowed around the name: ${syntaxes.map((syntax: IFolderSyntax) => syntax.description).join(", ")})`,
		pattern: `@(${patterns.join("|")})`,
	};
}
