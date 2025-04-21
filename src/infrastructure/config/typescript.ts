import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { formatConfig, formatPluginName, formatRuleName } from "@infrastructure/utility";
import tseslint from "typescript-eslint";

/**
 * Loads the ESLint configuration for TypeScript
 * @param {IConfigOptions} config - Configuration options
 * @returns {Array<Linter.Config>} An array of ESLint configurations for TypeScript
 */
export default function loadConfig(config: IConfigOptions): Array<Linter.Config> {
	return tseslint.config({
		// @ts-ignore
		extends: [...formatConfig([...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked])],
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
			},
		},
		plugins: {
			[formatPluginName("typescript")]: tseslint.plugin,
		},
		rules: {
			[formatRuleName("@typescript-eslint/adjacent-overload-signatures")]: "error", // Require function overloads to be consecutively placed, improving readability and organization of overloaded functions.
			[formatRuleName("@typescript-eslint/array-type")]: ["error", { default: "generic" }], // Enforce using generic array type syntax (Array<type>) for consistency and clarity in type definitions.
			[formatRuleName("@typescript-eslint/ban-ts-comment")]: "off", // Disable the rule that disallows `@ts-<directive>` comments to allow for flexibility in code comments.
			[formatRuleName("@typescript-eslint/ban-tslint-comment")]: "error", // Prohibit comments that disable TSLint rules, encouraging the use of ESLint for linting TypeScript.
			[formatRuleName("@typescript-eslint/ban-types")]: "off", // Disables the rule that prevents the use of certain built-in types like `Object`, `String`, `Number`, etc., allowing their use in the codebase.
			[formatRuleName("@typescript-eslint/consistent-generic-constructors")]: "error", // Enforces the use of a consistent generic constructor style, either `new () => T` or `new <T>() => T`, to ensure consistency and readability in type definitions.
			[formatRuleName("@typescript-eslint/consistent-indexed-object-style")]: "error", // Requires a consistent style for indexed objects, either using an interface or type alias for index signatures, to enhance code clarity and maintainability.
			[formatRuleName("@typescript-eslint/consistent-type-definitions")]: "off", // Disables the rule that enforces consistent type definitions for variables, parameters, and class members, allowing for more flexibility in type definitions.
			[formatRuleName("@typescript-eslint/consistent-type-exports")]: "error", // Enforces consistent usage of type exports, promoting clarity and consistency in how types are exported from modules.
			[formatRuleName("@typescript-eslint/consistent-type-imports")]: "error", // Enforces using the `import type {}` syntax where possible for importing types, which can lead to more efficient bundling by avoiding unnecessary JavaScript execution.
			// [formatRuleName("@typescript-eslint/explicit-function-return-type")]: "error", // Requires explicit return types on functions and class methods, improving code documentation and maintainability by making the intended return type clear.
			// [formatRuleName("@typescript-eslint/explicit-module-boundary-types")]: "error", // Enforces explicit return and argument types on exported functions and classes at module boundaries, improving type safety and clarity in module interfaces.
			[formatRuleName("@typescript-eslint/interface-name-prefix")]: "off", // Disables the rule that requires interface names to be prefixed with "I", allowing more flexibility in naming interfaces according to project conventions.
			// [formatRuleName("@typescript-eslint/naming-convention")]: [
			// 	"error",
			// 	{
			// 		format: null, // Disables any format enforcement by default, allowing for flexibility unless specifically overridden.
			// 		selector: "default",
			// 	},
			// 	{
			// 		filter: {
			// 			match: false,
			// 			regex: "^match$",
			// 		},
			// 		format: null,
			// 		prefix: ["is", "should", "has", "can", "did", "will", "use", "with", "to", "was", "IS", "SHOULD", "HAS", "CAN", "DID", "WILL", "USE", "WITH", "TO", "WAS"],
			// 		selector: ["variable", "parameter", "property", "parameterProperty", "accessor", "classProperty"],
			// 		types: ["boolean"],
			// 	},
			// 	{
			// 		format: ["PascalCase", "UPPER_CASE"], // Boolean variables should be prefixed with specific keywords and can be in PascalCase or UPPER_CASE.
			// 		selector: "variable",
			// 		types: ["boolean"],
			// 	},
			// 	{
			// 		format: ["camelCase", "UPPER_CASE", "PascalCase"], // Variables and variable-like identifiers should use camelCase, UPPER_CASE, or PascalCase, providing flexibility for naming.
			// 		selector: "variableLike",
			// 	},
			// 	{
			// 		format: ["camelCase"], // Function parameters should always use camelCase.
			// 		leadingUnderscore: "allow",
			// 		selector: "parameter",
			// 	},
			// 	{
			// 		format: ["camelCase"], // Class constructor parameters that are also class properties should use camelCase.
			// 		selector: "parameterProperty",
			// 	},
			// 	{
			// 		format: ["camelCase"], // Private class members should use camelCase and not have a leading underscore.
			// 		leadingUnderscore: "forbid",
			// 		modifiers: ["private"],
			// 		selector: "memberLike",
			// 	},
			// 	{
			// 		format: ["PascalCase"], // Types, interfaces, classes, etc., should use PascalCase.
			// 		selector: "typeLike",
			// 	},
			// 	{
			// 		format: ["UPPER_CASE"], // Readonly properties should use PascalCase.
			// 		modifiers: ["readonly"],
			// 		selector: "property",
			// 	},
			// 	{
			// 		format: ["UPPER_CASE"], // Enum members should be in UPPER_CASE.
			// 		selector: "enumMember",
			// 	},
			// 	{
			// 		format: ["PascalCase"], // Enums should use PascalCase and be prefixed with 'E'.
			// 		prefix: ["E"],
			// 		selector: "enum",
			// 	},
			// 	{
			// 		format: ["StrictPascalCase"], // Interfaces should use StrictPascalCase and be prefixed with 'I'.
			// 		prefix: ["I"],
			// 		selector: "interface",
			// 	},
			// 	{
			// 		format: ["StrictPascalCase"], // Type aliases should use StrictPascalCase and be prefixed with 'T'.
			// 		prefix: ["T"],
			// 		selector: "typeAlias",
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: "^[A-Z][A-Z0-9_]*$",
			// 		},
			// 		format: ["UPPER_CASE"],
			// 		modifiers: ["const"],
			// 		selector: "variable", // Constants should be in UPPER_CASE and use camelCase for variables.
			// 	},
			// 	{
			// 		format: ["PascalCase"],
			// 		modifiers: ["abstract"],
			// 		prefix: ["Abstract"],
			// 		selector: "class", // Abstract classes should use PascalCase and be prefixed with 'Abstract'.
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: ".*Factory$",
			// 		},
			// 		format: ["PascalCase"],
			// 		selector: "class", // Classes should use PascalCase and be prefixed with 'Base'.
			// 		suffix: ["Factory"],
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: ".*Service$",
			// 		},
			// 		format: ["PascalCase"],
			// 		selector: "class", // Classes should use PascalCase and be suffixed with 'Factory'.
			// 		suffix: ["Service"],
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: ".*Component$",
			// 		},
			// 		format: ["PascalCase"],
			// 		selector: "class", // Classes should use PascalCase and be suffixed with 'Service'.
			// 		suffix: ["Component"],
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: "^use[A-Z]",
			// 		},
			// 		format: ["camelCase"],
			// 		prefix: ["use"],
			// 		selector: "function", // Functions should use camelCase and be prefixed with 'use'.
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: "^[A-Z]$",
			// 		},
			// 		format: ["PascalCase"],
			// 		selector: "typeParameter", // Type parameters should use PascalCase.
			// 	},
			// 	{
			// 		filter: {
			// 			match: true,
			// 			regex: ".*Event$",
			// 		},
			// 		format: ["PascalCase"],
			// 		selector: "property", // Event properties should use PascalCase and be suffixed with 'Event'.
			// 		suffix: ["Event"],
			// 	},
			// ],
			[formatRuleName("@typescript-eslint/no-array-delete")]: "error", // Disallow using delete on arrays because it may lead to unexpected behavior by leaving a 'hole' in the array.
			[formatRuleName("@typescript-eslint/no-base-to-string")]: "error", // Require explicit toString() method calls on objects which may not safely convert to a string, preventing runtime errors.
			[formatRuleName("@typescript-eslint/no-deprecated")]: config.withUnicorn ? "off" : "error", // Disallow the use of deprecated TypeScript features to prevent potential issues and ensure code quality.
			[formatRuleName("@typescript-eslint/no-duplicate-enum-values")]: "error", // Prevent duplicate values in enums, which can lead to confusing and hard-to-trace errors.
			[formatRuleName("@typescript-eslint/no-duplicate-type-constituents")]: "error", // Disallow duplicate type constituents in unions and intersections to maintain valid and understandable type definitions.
			[formatRuleName("@typescript-eslint/no-empty-function")]: "error", // Disallow empty functions to avoid unintentionally incomplete implementations.
			[formatRuleName("@typescript-eslint/no-empty-interface")]: "error", // Prevent the declaration of empty interfaces which can be misleading and unnecessary.
			[formatRuleName("@typescript-eslint/no-empty-object-type")]: "off", // Allow empty object types to be defined, providing flexibility for future use or debugging.
			[formatRuleName("@typescript-eslint/no-explicit-any")]: "error", // Allow the use of 'any' type to enable flexibility in cases where strict typing is excessively restrictive.
			[formatRuleName("@typescript-eslint/no-extraneous-class")]: "off", // Allow the use of classes that are not explicitly used in the codebase to enable flexibility in class definitions
			[formatRuleName("@typescript-eslint/no-floating-promises")]: "off", // Require handling of promises to avoid uncaught promise rejections and unhandled async operations.
			[formatRuleName("@typescript-eslint/no-for-in-array")]: "error", // Disallow for-in loops over arrays because they iterate over object keys, not array elements.
			[formatRuleName("@typescript-eslint/no-implied-eval")]: "error", // Disallow methods that can execute code strings, preventing potential security vulnerabilities.
			[formatRuleName("@typescript-eslint/no-import-type-side-effects")]: "error", // Prohibit imports that can have side effects when only importing types, ensuring cleaner and safer code.
			[formatRuleName("@typescript-eslint/no-inferrable-types")]: "off", // Allow explicit types to be inferred by TypeScript for cleaner and more readable code.
			[formatRuleName("@typescript-eslint/no-loop-func")]: "error", // Forbid the creation of functions within loops to prevent errors due to the use of loop variables inside closures.
			// [formatRuleName("@typescript-eslint/no-magic-numbers")]: [
			// 	"error",
			// 	{
			// 		detectObjects: true,
			// 		ignore: [0, 1, -1],
			// 		ignoreEnums: true,
			// 	},
			// ], // Disallow magic numbers to make code more readable and maintainable, with exceptions for enums and object properties.
			[formatRuleName("@typescript-eslint/no-misused-promises")]: "error", // Ensure promises are used and awaited correctly, preventing logical errors in async operations.
			[formatRuleName("@typescript-eslint/no-mixed-enums")]: "error", // Prevent enums from being mixed in nonsensical ways, ensuring that they are used as intended.
			[formatRuleName("@typescript-eslint/no-redeclare")]: "error", // Disallow redeclaration of variables to prevent confusion and potential errors from shadowed variables.
			[formatRuleName("@typescript-eslint/no-redundant-type-constituents")]: "error", // Disallow redundant types in unions or intersections to keep type definitions clear and concise.
			[formatRuleName("@typescript-eslint/no-require-imports")]: "error", // Discourage the use of require imports in favor of ES6 import syntax for consistency and better module resolution.
			[formatRuleName("@typescript-eslint/no-restricted-imports")]: "error", // Allow specifying imports to avoid, helping to keep the dependency graph valid and manageable.
			[formatRuleName("@typescript-eslint/no-unnecessary-boolean-literal-compare")]: "error", // Avoid unnecessary comparisons in boolean expressions for cleaner code.
			[formatRuleName("@typescript-eslint/no-unnecessary-condition")]: ["off", { allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true }], // Allow potentially unnecessary conditions to run, acknowledging developer intent under non-strict null checks.
			[formatRuleName("@typescript-eslint/no-unused-vars")]: "off", // Allow unused variables to be defined, providing flexibility for future use or debugging.
			[formatRuleName("@typescript-eslint/no-useless-empty-export")]: "error", // Disallow empty exports that serve no purpose and clutter the module namespace.
			[formatRuleName("@typescript-eslint/prefer-enum-initializers")]: "error", // Suggest using initializers for enums to make values explicit and clear.
			[formatRuleName("@typescript-eslint/prefer-for-of")]: "error", // Encourage the use of for-of loops for iterable objects for clarity and simplicity.
			[formatRuleName("@typescript-eslint/prefer-function-type")]: "error", // Prefer using function type literals over interfaces with call signatures for simplicity and readability.
			[formatRuleName("@typescript-eslint/prefer-includes")]: "error", // Suggest using includes method over indexOf for arrays and strings for better readability and intent.
			[formatRuleName("@typescript-eslint/prefer-literal-enum-member")]: "off", // Allow the use of enum members as literals to enable more flexible and readable code.
			[formatRuleName("@typescript-eslint/prefer-namespace-keyword")]: "error", // Recommend the use of the namespace keyword over module to declare custom TypeScript modules.
			[formatRuleName("@typescript-eslint/prefer-optional-chain")]: "error", // Encourage optional chaining for cleaner and safer access to nested object properties.
			[formatRuleName("@typescript-eslint/prefer-readonly")]: "error", // Suggest marking properties that are never reassigned after initialization as readonly.
			[formatRuleName("@typescript-eslint/prefer-string-starts-ends-with")]: "error", // Recommend using startsWith and endsWith methods over equivalent string operations for clarity.
			[formatRuleName("@typescript-eslint/require-array-sort-compare")]: "error", // Require a compare function be provided to Array.sort() when sorting non-string values for predictable sorting.
			[formatRuleName("@typescript-eslint/restrict-plus-operands")]: "error", // Ensure that operands of the plus operator are of compatible types to prevent unexpected type coercion.
			[formatRuleName("@typescript-eslint/restrict-template-expressions")]: ["error", { allowNumber: true }], // Restrict types allowed in template expressions to prevent runtime errors from unexpected type conversions.
			[formatRuleName("@typescript-eslint/return-await")]: "error", // Enforce returning await in async functions to ensure errors are caught in the try-catch block.
			[formatRuleName("@typescript-eslint/switch-exhaustiveness-check")]: "error", // Require exhaustive switch statements over union types, ensuring all possible cases are handled.
			[formatRuleName("@typescript-eslint/unbound-method")]: "off",
			// [formatRuleName("@typescript-eslint/typedef")]: [
			// 	"error",
			// 	{
			// 		arrayDestructuring: true,
			// 		arrowParameter: true,
			// 		memberVariableDeclaration: true,
			// 		objectDestructuring: true,
			// 		parameter: true,
			// 		propertyDeclaration: true,
			// 		variableDeclaration: true,
			// 		variableDeclarationIgnoreFunction: true,
			// 	},
			// ], // Enforce type definitions in various situations to ensure code clarity and maintainability. This includes variables, function parameters, and class members among others, with an exception for functions in variable declarations.
		},
	}) as Array<Linter.Config>;
}
