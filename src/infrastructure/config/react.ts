/* eslint-disable @elsikora/typescript/naming-convention */
import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import react from "@eslint-react/eslint-plugin";
import { formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import react2 from "eslint-plugin-react";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for React applications
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for React
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return [
		{
			settings: {
				react: {
					version: "detect",
				},
			},
		},
		{
			plugins: {
				[formatPluginName("react")]: react2,
			},
		},
		{
			// @ts-ignore
			...formatConfig([react.configs.recommended])[0],
			files: ["**/*.js", "**/*.jsx"],
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: "latest",
				},
			},
		},
		{
			files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
			rules: {
				[formatRuleName("@eslint-react/hooks-extra/no-direct-set-state-in-use-effect")]: "error", // Disallow direct setState in useEffect
				[formatRuleName("@eslint-react/naming-convention/context-name")]: "error", // Enforce the naming of context providers
				[formatRuleName("react/checked-requires-onchange-or-readonly")]: "error", // Enforce input elements using either onChange or readOnly
				[formatRuleName("react/default-props-match-prop-types")]: config.withNext ? "off" : "error", // Enforce all defaultProps have a corresponding non-required PropType
				[formatRuleName("react/function-component-definition")]: [
					"error",
					{
						namedComponents: "arrow-function",
						unnamedComponents: "arrow-function",
					},
				], // Enforce the definition of a component with arrow functions
				[formatRuleName("react/jsx-closing-bracket-location")]: "off", // Enforce the closing bracket location for JSX multiline elements
				[formatRuleName("react/jsx-curly-brace-presence")]: [
					"error",
					{
						children: "always",
						propElementValues: "always",
						props: "always",
					},
				], // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
				[formatRuleName("react/jsx-no-bind")]: "off", // Prevent usage of Function.prototype.bind and arrow functions in React component props
				[formatRuleName("react/jsx-no-undef")]: "error", // Disallow undeclared variables in JSX
				[formatRuleName("react/no-deprecated")]: "error", // Prevent usage of deprecated methods
				[formatRuleName("react/no-invalid-html-attribute")]: "error", // Disallow invalid characters in props
				[formatRuleName("react/no-is-mounted")]: "error", // Prevent usage of isMounted
				[formatRuleName("react/no-this-in-sfc")]: "error", // Prevent this from being used in stateless functional components
				[formatRuleName("react/no-typos")]: "error", // Prevent common typos
				[formatRuleName("react/no-unescaped-entities")]: "error", // Disallow unescaped entities
				[formatRuleName("react/prefer-stateless-function")]: ["error", { ignorePureComponents: true }], // Enforce stateless components to be written as a pure function
				[formatRuleName("react/react-in-jsx-scope")]: config.withNext ? "off" : "error", // Prevent missing React when using JSX
				[formatRuleName("react/require-default-props")]: "error", // Enforce a defaultProps definition for every prop that is not a required prop
				[formatRuleName("react/require-render-return")]: "error", // Enforce ES5 or ES6 class for returning value in render function
				[formatRuleName("react/self-closing-comp")]: "error", // Prevent extra closing tags for components without children
				[formatRuleName("react/state-in-constructor")]: ["error", "never"], // Enforce state initialization style
				[formatRuleName("react/style-prop-object")]: "error", // Enforce style prop value being an object
			},
		},
		{
			files: ["**/*.jsx", "**/*.tsx"],
			rules: {
				[formatRuleName("@eslint-react/naming-convention/component-name")]: ["error", "PascalCase"], // Enforce component naming conventions
				[formatRuleName("@eslint-react/naming-convention/filename-extension")]: ["error", { allow: "as-needed" }], // Enforce filename conventions
				[formatRuleName("@eslint-react/naming-convention/filename")]: config.withNext ? "off" : "error", // Enforce filename conventions
				[formatRuleName("@eslint-react/naming-convention/use-state")]: "error", // Enforce the use of the useState hook
			},
		},
		{
			// @ts-ignore
			...formatConfig([react.configs["recommended-type-checked"]])[0],
			files: ["**/*.ts", "**/*.tsx"],
			languageOptions: {
				parser: tseslint.parser,
				parserOptions: {
					projectService: true,
				},
			},
		},
	] as Array<Linter.Config>;
}
