/* eslint-disable @elsikora/typescript/naming-convention */
import type { ESLint, Linter } from "eslint";

// @ts-ignore
import nestJsTyped from "@elsikora/eslint-plugin-nestjs-typed";
import { formatPluginName, formatRuleName } from "@infrastructure/utility";
import tseslint from "typescript-eslint";

const nestJsTypedPlugin: ESLint.Plugin = nestJsTyped.plugin as unknown as ESLint.Plugin;

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
				[formatPluginName("nestjs-typed")]: nestJsTypedPlugin,
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
				[formatRuleName("nestjs-typed/sort-module-metadata-arrays")]: "error",
				[formatRuleName("nestjs-typed/validate-nested-of-array-should-set-each")]: "error",
				[formatRuleName("nestjs-typed/validated-non-primitive-property-needs-type-decorator")]: "error",
			},
		},
	] as Array<Linter.Config>;
}
