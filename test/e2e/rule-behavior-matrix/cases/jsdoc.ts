import type { IConfigOptions } from "../../../../dist/esm/index";
import type { IRuleBehaviorCase } from "../types";
import { createCase, createCases } from "../case-factory";

export const RULE_BEHAVIOR_JSDOC_CASES: Array<IRuleBehaviorCase> = [...createJsdocBehaviorCases()];

function createJsdocBehaviorCases(): Array<IRuleBehaviorCase> {
	const options: IConfigOptions = { withJsDoc: true };
	const functionTagsCode: string = `/**
 * Uses @link incorrectly.
 * @access friend
 * @private visible
 * @version invalid-version
 * @license Not A License
 * @param [actual=1]
 * @param {String} wrong
 * @param {UnknownThing}
 * @returns {Function}
 * @throws
 * @next
 */
function bad(actual, missing) {
}
`;
	const propertyTagsCode: string = `/**
 * @typedef {object} Options
 * @property orphan.child
 * @property {string} duplicate
 * @property {number} duplicate
 * @property missingType
 * @property {boolean}
 */
const options = {};
console.log(options);
`;

	return [
		createCase("jsdoc", "jsdoc/require-jsdoc", options, "test/e2e/fixture/jsdoc/invalid/require-jsdoc.fixture.js", `function undocumented(value) {\n\treturn value;\n}\n`),
		...createCases(
			"jsdoc",
			options,
			"test/e2e/fixture/jsdoc/invalid/function-tags.fixture.js",
			[
				"jsdoc/check-access",
				"jsdoc/check-param-names",
				"jsdoc/check-tag-names",
				"jsdoc/check-types",
				"jsdoc/check-values",
				"jsdoc/empty-tags",
				"jsdoc/escape-inline-tags",
				"jsdoc/no-defaults",
				"jsdoc/no-undefined-types",
				"jsdoc/reject-function-type",
				"jsdoc/require-next-type",
				"jsdoc/require-param",
				"jsdoc/require-param-description",
				"jsdoc/require-param-name",
				"jsdoc/require-param-type",
				"jsdoc/require-returns-check",
				"jsdoc/require-returns-description",
				"jsdoc/require-throws-type",
			],
			functionTagsCode,
		),
		createCase(
			"jsdoc",
			"jsdoc/require-returns",
			options,
			"test/e2e/fixture/jsdoc/invalid/require-returns.fixture.js",
			`/**
 * Add numbers.
 * @param {number} left - Left number.
 * @param {number} right - Right number.
 */
function add(left, right) {
	return left + right;
}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/require-returns-type",
			options,
			"test/e2e/fixture/jsdoc/invalid/require-returns-type.fixture.js",
			`/**
 * Returns a value.
 * @returns Missing type.
 */
function returnsType() {
	return 1;
}
`,
		),
		...createCases("jsdoc", options, "test/e2e/fixture/jsdoc/invalid/property-tags.fixture.js", ["jsdoc/check-property-names", "jsdoc/require-property-description", "jsdoc/require-property-name", "jsdoc/require-property-type"], propertyTagsCode),
		createCase(
			"jsdoc",
			"jsdoc/require-property",
			options,
			"test/e2e/fixture/jsdoc/invalid/require-property.fixture.js",
			`/**
 * @typedef {object} EmptyOptions
 */
const emptyOptions = {};
console.log(emptyOptions);
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/require-yields",
			options,
			"test/e2e/fixture/jsdoc/invalid/require-yields.fixture.js",
			`/**
 * Generates values.
 */
function* ids() {
	yield 1;
}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/require-yields-check",
			options,
			"test/e2e/fixture/jsdoc/invalid/require-yields-check.fixture.js",
			`/**
 * Generator docs.
 * @yields {number} Missing yield.
 */
function notGenerator() {
}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/require-yields-type",
			options,
			"test/e2e/fixture/jsdoc/invalid/require-yields-type.fixture.js",
			`/**
 * Generates values.
 * @yields Missing type.
 */
function* yieldsType() {
	yield 1;
}
`,
		),
		...createCases(
			"jsdoc",
			options,
			"test/e2e/fixture/jsdoc/invalid/style.fixture.js",
			["jsdoc/check-alignment", "jsdoc/no-multi-asterisks"],
			`/**
* Misaligned.
** Too many asterisks.
* @param {number} value - Value.
*/
function style(value) {
	return value;
}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/multiline-blocks",
			options,
			"test/e2e/fixture/jsdoc/invalid/multiline-blocks.fixture.js",
			`/** Bad start.
 * More text.
 */
function multilineStart() {}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/tag-lines",
			options,
			"test/e2e/fixture/jsdoc/invalid/tag-lines.fixture.js",
			`/**
 * Has tags.
 *
 * @param {number} value - Value.
 *
 * @returns {number} Value.
 */
function tagLinesBlank(value) {
	return value;
}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/implements-on-classes",
			options,
			"test/e2e/fixture/jsdoc/invalid/implements-on-classes.fixture.js",
			`/**
 * @implements {Interface}
 */
function ordinary() {}
`,
		),
		...createCases(
			"jsdoc",
			options,
			"test/e2e/fixture/jsdoc/invalid/types.fixture.js",
			["jsdoc/reject-any-type", "jsdoc/ts-no-empty-object-type"],
			`/**
 * Type tests.
 * @param {*} anything - Anything.
 * @param {{}} empty - Empty object.
 * @param {string} valid - Valid.
 * @returns {string} Result.
 */
function typeTests(anything, empty, valid) {
	return String(anything || empty || valid);
}
`,
		),
		createCase(
			"jsdoc",
			"jsdoc/valid-types",
			options,
			"test/e2e/fixture/jsdoc/invalid/valid-types.fixture.js",
			`/**
 * Invalid type.
 * @param {Array.<} value - Broken type.
 */
function invalidType(value) {
	return value;
}
`,
		),
	];
}
