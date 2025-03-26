/* eslint-disable @elsikora/typescript/naming-convention */
import type { Linter } from "eslint";

// @ts-ignore
import nestJsTyped from "@elsikora/eslint-plugin-nestjs-typed";
import { fixupPluginRules } from "@eslint/compat";
import { formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import ngModuleSort from "eslint-plugin-ng-module-sort";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for NestJS applications
 * @returns {Array<Linter.Config>} An array of ESLint configurations for NestJS
 */
export default function loadConfig(): Array<Linter.Config> {
	return [
		{
			files: ["**/*.ts"],
			languageOptions: {
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
			plugins: {
				// eslint-disable-next-line @elsikora/typescript/no-unsafe-member-access,@elsikora/typescript/no-unsafe-argument
				[formatPluginName("nestjs-typed")]: formatConfig([nestJsTyped.plugin])[0],

				[formatPluginName("ng-module-sort")]: fixupPluginRules(ngModuleSort),
			},
			rules: {
				[formatRuleName("nestjs-typed/all-properties-are-whitelisted")]: "error",
				[formatRuleName("nestjs-typed/all-properties-have-explicit-defined")]: "error",
				[formatRuleName("nestjs-typed/api-enum-property-best-practices")]: "error",
				[formatRuleName("nestjs-typed/api-method-should-specify-api-operation")]: "off",
				[formatRuleName("nestjs-typed/api-method-should-specify-api-response")]: "error",
				[formatRuleName("nestjs-typed/api-methods-should-be-guarded")]: "off",
				[formatRuleName("nestjs-typed/api-property-matches-property-optionality")]: "error",
				[formatRuleName("nestjs-typed/api-property-returning-array-should-set-array")]: "error",
				[formatRuleName("nestjs-typed/controllers-should-supply-api-tags")]: "error",
				[formatRuleName("nestjs-typed/no-duplicate-decorators")]: "error",
				[formatRuleName("nestjs-typed/param-decorator-name-matches-route-param")]: "error",
				[formatRuleName("nestjs-typed/provided-injected-should-match-factory-parameters")]: "error",
				[formatRuleName("nestjs-typed/should-specify-forbid-unknown-values")]: "error",
				[formatRuleName("nestjs-typed/sort-module-metadata-arrays")]: "off",
				[formatRuleName("nestjs-typed/validate-nested-of-array-should-set-each")]: "error",
				[formatRuleName("nestjs-typed/validated-non-primitive-property-needs-type-decorator")]: "error",
				[formatRuleName("ng-module-sort/decorator-array-items")]: [
					"error",
					{
						reverseSort: false,
					},
				],
			},
		},
	] as Array<Linter.Config>;
}
