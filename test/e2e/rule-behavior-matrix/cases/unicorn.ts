import type { IRuleBehaviorCase } from "../types";
import { createCase, createCases } from "../case-factory";

export const RULE_BEHAVIOR_UNICORN_CASES: Array<IRuleBehaviorCase> = [...createUnicornBehaviorCases()];

function createUnicornBehaviorCases(): Array<IRuleBehaviorCase> {
	const arrayCode: string = `const values = [1, 2, 3];
values.forEach((value) => console.log(value));
const found = values.filter((value) => value > 1)[0];
const hasAny = values.filter((value) => value > 1).length > 0;
const first = values[0];
const last = values[values.length - 1];
const included = values.indexOf(2) !== -1;
const joined = values.join();
const flatMapped = values.map((value) => [value]).flat();
const flattened = [[1], [2]].flat(1);
const sliced = values.slice(1, values.length);
console.log(found, hasAny, first, last, included, joined, flatMapped, flattened, sliced);
`;
	const stringCode: string = `const text = "hello world";
const part = text.substr(1, 2);
const trimmed = text.trimLeft();
const replaced = text.replace(/l/g, "L");
const escaped = "\\x41";
console.log(part, trimmed, replaced, escaped);
`;
	const errorCode: string = `try {
	throw Error();
} catch (err) {
	throw new Error();
}
`;
	const domCode: string = `const node = document.createElement("div");
document.body.appendChild(node);
document.body.removeChild(node);
document.querySelectorAll(".item")[0];
document.getElementById("app");
document.body.innerText = "Hello";
window.onresize = () => {};
`;
	const moduleCode: string = `const fs = require("fs");
const path = require("node:path");
module.exports = { fs, path };
`;
	const conditionCode: string = `const value = 1;
if (!value) {
	console.log("missing");
} else {
	console.log("found");
}
const nested = value > 0 ? "positive" : value < 0 ? "negative" : "zero";
console.log(nested);
`;
	const classCode: string = `class Utility {
	static value() {
		return 1;
	}
}
class Person {
	constructor() {
		this.name = "Ada";
	}
}
export default function () {
	return Utility.value() + new Person().name.length;
}
`;
	const promiseCode: string = `async function load(promise) {
	const value = await promise;
	return await Promise.resolve(value);
}
Promise.all([load(Promise.resolve(1))]);
`;
	const arrayMutationCode: string = `const values = [3, 2, 1];
const reversed = values.reverse();
const sorted = values.sort((left, right) => left - right);
const made = new Array(3);
const reduced = values.reduce((object, value) => ({ ...object, [value]: value }), {});
const right = values.reduceRight((object, value) => object.concat(value), []);
const spliced = values.splice(1);
const flat = values.flat(2);
console.log(reversed, sorted, made, reduced, right, spliced, flat);
`;
	const numberCode: string = `const big = BigInt(123);
const decimal = 1.0;
const separated = 1000000;
const fixed = (1.23).toFixed();
const code = "A".charCodeAt(0);
const point = String.fromCharCode(65);
console.log(big, decimal, separated, fixed, code, point);
`;
	const objectsCode: string = `function configure(options = {}) {
	const settings = {};
	settings.enabled = true;
	return options || settings;
}
const self = this;
const thing = {
	then() {
		return 1;
	},
};
console.log(configure(), self, thing);
`;
	const checksCode: string = `const values = [1, 2, 3];
const exists = values.indexOf(2) > -1;
const bad = !exists === true;
const [, , third] = values;
console.log(bad, third);
`;
	const modernCode: string = `const now = new Date().getTime();
const finite = isFinite(1);
const copy = JSON.parse(JSON.stringify({ a: 1 }));
console.log(now, finite, copy);
`;
	const preferSwitchCode: string = `function label(value) {
	if (value === 1) {
		return "one";
	} else if (value === 2) {
		return "two";
	} else if (value === 3) {
		return "three";
	}
	return "other";
}
console.log(label(1));
`;
	const additionalUnicornRuleCases: Array<[ruleId: string, filePath: string, code: string]> = [
		[
			"unicorn/consistent-assert",
			"test/e2e/fixture/unicorn/invalid/consistent-assert.fixture.js",
			`import assert from "node:assert";
assert(true);
`,
		],
		[
			"unicorn/consistent-date-clone",
			"test/e2e/fixture/unicorn/invalid/consistent-date-clone.fixture.js",
			`const original = new Date();
const cloned = new Date(original.getTime());
console.log(cloned);
`,
		],
		[
			"unicorn/consistent-empty-array-spread",
			"test/e2e/fixture/unicorn/invalid/consistent-empty-array-spread.fixture.js",
			`const enabled = true;
const values = [...(enabled ? "" : [1])];
console.log(values);
`,
		],
		[
			"unicorn/consistent-existence-index-check",
			"test/e2e/fixture/unicorn/invalid/consistent-existence-index-check.fixture.js",
			`const values = ["a"];
const index = values.indexOf("a");
if (index >= 0) {
	console.log(index);
}
`,
		],
		[
			"unicorn/consistent-function-scoping",
			"test/e2e/fixture/unicorn/invalid/consistent-function-scoping.fixture.js",
			`function outer() {
	function helper() {
		return 1;
	}

	return helper();
}

console.log(outer());
`,
		],
		["unicorn/consistent-template-literal-escape", "test/e2e/fixture/unicorn/invalid/consistent-template-literal-escape.fixture.js", "const text = `Hello $\\{name}`;\nconsole.log(text);\n"],
		[
			"unicorn/empty-brace-spaces",
			"test/e2e/fixture/unicorn/invalid/empty-brace-spaces.fixture.js",
			`const object = { };
console.log(object);
`,
		],
		[
			"unicorn/escape-case",
			"test/e2e/fixture/unicorn/invalid/escape-case.fixture.js",
			`const value = "\\x0a";
console.log(value);
`,
		],
		[
			"unicorn/expiring-todo-comments",
			"test/e2e/fixture/unicorn/invalid/expiring-todo-comments.fixture.js",
			`// TODO [2000-01-01]: remove this later
const value = 1;
console.log(value);
`,
		],
		[
			"unicorn/import-style",
			"test/e2e/fixture/unicorn/invalid/import-style.fixture.js",
			`import util from "node:util";
console.log(util);
`,
		],
		[
			"unicorn/isolated-functions",
			"test/e2e/fixture/unicorn/invalid/isolated-functions.fixture.js",
			`const outer = 1;
/* @isolated */
function isolated() {
	return outer;
}

console.log(isolated);
`,
		],
		[
			"unicorn/no-array-callback-reference",
			"test/e2e/fixture/unicorn/invalid/no-array-callback-reference.fixture.js",
			`const values = ["1", "2"];
const numbers = values.map(parseInt);
console.log(numbers);
`,
		],
		[
			"unicorn/no-await-in-promise-methods",
			"test/e2e/fixture/unicorn/invalid/no-await-in-promise-methods.fixture.js",
			`async function load(one, two) {
	return Promise.all([await one, two]);
}

console.log(load);
`,
		],
		[
			"unicorn/no-console-spaces",
			"test/e2e/fixture/unicorn/invalid/no-console-spaces.fixture.js",
			`console.log("value ", " next");
`,
		],
		[
			"unicorn/no-document-cookie",
			"test/e2e/fixture/unicorn/invalid/no-document-cookie.fixture.js",
			`globalThis.document.cookie = "name=value";
`,
		],
		[
			"unicorn/no-for-loop",
			"test/e2e/fixture/unicorn/invalid/no-for-loop.fixture.js",
			`const values = [1, 2];
for (let index = 0; index < values.length; index++) {
	console.log(values[index]);
}
`,
		],
		[
			"unicorn/no-lonely-if",
			"test/e2e/fixture/unicorn/invalid/no-lonely-if.fixture.js",
			`if (ready) {
	if (active) {
		console.log(active);
	}
}
`,
		],
		[
			"unicorn/no-new-buffer",
			"test/e2e/fixture/unicorn/invalid/no-new-buffer.fixture.js",
			`const buffer = new Buffer("value");
console.log(buffer);
`,
		],
		[
			"unicorn/no-object-as-default-parameter",
			"test/e2e/fixture/unicorn/invalid/no-object-as-default-parameter.fixture.js",
			`function configure(options = { enabled: true }) {
	return options;
}

console.log(configure);
`,
		],
		[
			"unicorn/no-typeof-undefined",
			"test/e2e/fixture/unicorn/invalid/no-typeof-undefined.fixture.js",
			`function check(value) {
	return typeof value === "undefined";
}

console.log(check);
`,
		],
		[
			"unicorn/no-unnecessary-array-splice-count",
			"test/e2e/fixture/unicorn/invalid/no-unnecessary-array-splice-count.fixture.js",
			`const values = [1, 2, 3];
values.splice(1, values.length);
`,
		],
		[
			"unicorn/no-unnecessary-await",
			"test/e2e/fixture/unicorn/invalid/no-unnecessary-await.fixture.js",
			`async function load() {
	return await 1;
}

console.log(load);
`,
		],
		[
			"unicorn/no-unnecessary-polyfills",
			"test/e2e/fixture/unicorn/polyfill-package/invalid/no-unnecessary-polyfills.fixture.js",
			`import "core-js/full/array/at";
`,
		],
		[
			"unicorn/no-unreadable-iife",
			"test/e2e/fixture/unicorn/invalid/no-unreadable-iife.fixture.js",
			`const value = (() => ({ ok: true }))();
console.log(value);
`,
		],
		[
			"unicorn/no-useless-collection-argument",
			"test/e2e/fixture/unicorn/invalid/no-useless-collection-argument.fixture.js",
			`const values = new Set([]);
console.log(values);
`,
		],
		[
			"unicorn/no-useless-error-capture-stack-trace",
			"test/e2e/fixture/unicorn/invalid/no-useless-error-capture-stack-trace.fixture.js",
			`class CustomError extends Error {
	constructor() {
		super("failed");
		Error.captureStackTrace(this, CustomError);
	}
}

console.log(CustomError);
`,
		],
		[
			"unicorn/no-useless-fallback-in-spread",
			"test/e2e/fixture/unicorn/invalid/no-useless-fallback-in-spread.fixture.js",
			`const options = { enabled: true };
const copy = { ...(options || {}) };
console.log(copy);
`,
		],
		[
			"unicorn/no-useless-iterator-to-array",
			"test/e2e/fixture/unicorn/invalid/no-useless-iterator-to-array.fixture.js",
			`const values = iterator.toArray();
const set = new Set(iterator.toArray());
console.log(values, set);
`,
		],
		[
			"unicorn/no-useless-length-check",
			"test/e2e/fixture/unicorn/invalid/no-useless-length-check.fixture.js",
			`const values = [1, 2];
const ok = values.length > 0 && values.some(Boolean);
console.log(ok);
`,
		],
		[
			"unicorn/no-useless-promise-resolve-reject",
			"test/e2e/fixture/unicorn/invalid/no-useless-promise-resolve-reject.fixture.js",
			`async function load() {
	return Promise.resolve(1);
}

console.log(load);
`,
		],
		[
			"unicorn/no-useless-switch-case",
			"test/e2e/fixture/unicorn/invalid/no-useless-switch-case.fixture.js",
			`switch (value) {
	case 1:
		;
	default:
		console.log(value);
}
`,
		],
		[
			"unicorn/number-literal-case",
			"test/e2e/fixture/unicorn/invalid/number-literal-case.fixture.js",
			`const value = 0Xab;
console.log(value);
`,
		],
		[
			"unicorn/prefer-array-flat",
			"test/e2e/fixture/unicorn/invalid/prefer-array-flat.fixture.js",
			`const values = [[1], [2]];
const flat = values.reduce((array, item) => array.concat(item), []);
console.log(flat);
`,
		],
		[
			"unicorn/prefer-blob-reading-methods",
			"test/e2e/fixture/unicorn/invalid/prefer-blob-reading-methods.fixture.js",
			`const reader = new FileReader();
reader.readAsText(blob);
`,
		],
		[
			"unicorn/prefer-classlist-toggle",
			"test/e2e/fixture/unicorn/invalid/prefer-classlist-toggle.fixture.js",
			`if (enabled) {
	element.classList.add("active");
} else {
	element.classList.remove("active");
}
`,
		],
		[
			"unicorn/prefer-default-parameters",
			"test/e2e/fixture/unicorn/invalid/prefer-default-parameters.fixture.js",
			`function greet(name) {
	name = name || "world";

	return name;
}

console.log(greet);
`,
		],
		[
			"unicorn/prefer-dom-node-dataset",
			"test/e2e/fixture/unicorn/invalid/prefer-dom-node-dataset.fixture.js",
			`const value = element.getAttribute("data-user-id");
console.log(value);
`,
		],
		[
			"unicorn/prefer-event-target",
			"test/e2e/fixture/unicorn/invalid/prefer-event-target.fixture.js",
			`import { EventEmitter } from "node:events";
class Bus extends EventEmitter {}
console.log(Bus);
`,
		],
		[
			"unicorn/prefer-keyboard-event-key",
			"test/e2e/fixture/unicorn/invalid/prefer-keyboard-event-key.fixture.js",
			`element.addEventListener("keydown", (event) => {
	if (event.keyCode === 13) {
		console.log(event);
	}
});
`,
		],
		[
			"unicorn/prefer-logical-operator-over-ternary",
			"test/e2e/fixture/unicorn/invalid/prefer-logical-operator-over-ternary.fixture.js",
			`const result = value ? value : fallback;
console.log(result);
`,
		],
		[
			"unicorn/prefer-math-min-max",
			"test/e2e/fixture/unicorn/invalid/prefer-math-min-max.fixture.js",
			`const capped = value > 10 ? 10 : value;
console.log(capped);
`,
		],
		[
			"unicorn/prefer-math-trunc",
			"test/e2e/fixture/unicorn/invalid/prefer-math-trunc.fixture.js",
			`const truncated = value | 0;
console.log(truncated);
`,
		],
		[
			"unicorn/prefer-modern-dom-apis",
			"test/e2e/fixture/unicorn/invalid/prefer-modern-dom-apis.fixture.js",
			`parent.insertBefore(child, reference);
`,
		],
		[
			"unicorn/prefer-modern-math-apis",
			"test/e2e/fixture/unicorn/invalid/prefer-modern-math-apis.fixture.js",
			`const distance = Math.sqrt(x ** 2 + y ** 2);
console.log(distance);
`,
		],
		[
			"unicorn/prefer-module",
			"test/e2e/fixture/unicorn/invalid/prefer-module.fixture.js",
			`"use strict";
const value = 1;
console.log(value);
`,
		],
		[
			"unicorn/prefer-native-coercion-functions",
			"test/e2e/fixture/unicorn/invalid/prefer-native-coercion-functions.fixture.js",
			`const strings = values.map((value) => String(value));
console.log(strings);
`,
		],
		[
			"unicorn/prefer-negative-index",
			"test/e2e/fixture/unicorn/invalid/prefer-negative-index.fixture.js",
			`const last = values.at(values.length - 1);
console.log(last);
`,
		],
		[
			"unicorn/prefer-prototype-methods",
			"test/e2e/fixture/unicorn/invalid/prefer-prototype-methods.fixture.js",
			`const has = ({}).hasOwnProperty.call(object, "name");
console.log(has);
`,
		],
		[
			"unicorn/prefer-reflect-apply",
			"test/e2e/fixture/unicorn/invalid/prefer-reflect-apply.fixture.js",
			`function run() {
	return callback.apply(null, arguments);
}

console.log(run);
`,
		],
		[
			"unicorn/prefer-regexp-test",
			"test/e2e/fixture/unicorn/invalid/prefer-regexp-test.fixture.js",
			`if ("value".match(/^v/)) {
	console.log("matched");
}
`,
		],
		[
			"unicorn/prefer-set-has",
			"test/e2e/fixture/unicorn/invalid/prefer-set-has.fixture.js",
			`const allowed = ["a", "b"];
if (allowed.includes(value)) {
	console.log(value);
}

if (allowed.includes(other)) {
	console.log(other);
}
`,
		],
		[
			"unicorn/prefer-simple-condition-first",
			"test/e2e/fixture/unicorn/invalid/prefer-simple-condition-first.fixture.js",
			`if ((value > 1 ? active : fallback) && ready) {
	console.log(value);
}
`,
		],
		[
			"unicorn/prefer-single-call",
			"test/e2e/fixture/unicorn/invalid/prefer-single-call.fixture.js",
			`values.push(1);
values.push(2);
`,
		],
		[
			"unicorn/prefer-string-raw",
			"test/e2e/fixture/unicorn/invalid/prefer-string-raw.fixture.js",
			`const file = "C:\\\\temp\\\\file";
console.log(file);
`,
		],
		[
			"unicorn/prefer-string-starts-ends-with",
			"test/e2e/fixture/unicorn/invalid/prefer-string-starts-ends-with.fixture.js",
			`if (/^prefix/.test(value)) {
	console.log(value);
}
`,
		],
		[
			"unicorn/prefer-type-error",
			"test/e2e/fixture/unicorn/invalid/prefer-type-error.fixture.js",
			`if (typeof value === "string") {
	throw new Error("bad type");
}
`,
		],
		[
			"unicorn/relative-url-style",
			"test/e2e/fixture/unicorn/invalid/relative-url-style.fixture.js",
			`const url = new URL("./asset.png", "https://example.com/app/");
console.log(url);
`,
		],
		[
			"unicorn/require-module-attributes",
			"test/e2e/fixture/unicorn/invalid/require-module-attributes.fixture.js",
			`import data from "./data.json" with {};
console.log(data);
`,
		],
		[
			"unicorn/require-module-specifiers",
			"test/e2e/fixture/unicorn/invalid/require-module-specifiers.fixture.js",
			`import {} from "./module.js";
`,
		],
		[
			"unicorn/switch-case-break-position",
			"test/e2e/fixture/unicorn/invalid/switch-case-break-position.fixture.js",
			`switch (value) {
	case 1:
		{
			console.log(value);
		}
		break;
	default:
		break;
}
`,
		],
		[
			"unicorn/template-indent",
			"test/e2e/fixture/unicorn/invalid/template-indent.fixture.js",
			`const query = sql\`
select *
from users
\`;
console.log(query);
`,
		],
		[
			"unicorn/text-encoding-identifier-case",
			"test/e2e/fixture/unicorn/invalid/text-encoding-identifier-case.fixture.js",
			`const decoder = new TextDecoder("UTF8");
console.log(decoder);
`,
		],
	];

	return [
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/array.fixture.js", ["unicorn/no-array-for-each", "unicorn/no-unnecessary-array-flat-depth", "unicorn/no-unnecessary-slice-end", "unicorn/prefer-array-find", "unicorn/prefer-array-flat-map", "unicorn/prefer-array-some", "unicorn/prefer-at", "unicorn/prefer-includes", "unicorn/require-array-join-separator"], arrayCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/string.fixture.js", ["unicorn/no-hex-escape", "unicorn/prefer-string-replace-all", "unicorn/prefer-string-slice", "unicorn/prefer-string-trim-start-end"], stringCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/error.fixture.js", ["unicorn/catch-error-name", "unicorn/error-message", "unicorn/new-for-builtins", "unicorn/prefer-optional-catch-binding", "unicorn/prevent-abbreviations", "unicorn/throw-new-error"], errorCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/dom.fixture.js", ["unicorn/prefer-add-event-listener", "unicorn/prefer-dom-node-append", "unicorn/prefer-dom-node-remove", "unicorn/prefer-dom-node-text-content", "unicorn/prefer-query-selector"], domCode),
		createCase("unicorn", "unicorn/prefer-node-protocol", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/module.fixture.js", moduleCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/condition.fixture.js", ["unicorn/no-negated-condition", "unicorn/no-nested-ternary"], conditionCode),
		createCase("unicorn", "unicorn/no-abusive-eslint-disable", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/disable.fixture.js", `/* eslint-disable */\nconst value = 1;\nconsole.log(value);\n`),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/class.fixture.js", ["unicorn/no-anonymous-default-export", "unicorn/no-static-only-class", "unicorn/prefer-class-fields"], classCode),
		createCase("unicorn", "unicorn/no-single-promise-in-promise-methods", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/promise.fixture.js", promiseCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/array-mutation.fixture.js", ["unicorn/no-array-reduce", "unicorn/no-array-reverse", "unicorn/no-array-sort", "unicorn/no-magic-array-flat-depth", "unicorn/no-new-array", "unicorn/prefer-object-from-entries", "unicorn/prefer-spread"], arrayMutationCode),
		createCase("unicorn", "unicorn/prefer-array-index-of", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/array-index-of.fixture.js", `const values = [1, 2, 3];\nif (values.findIndex((value) => value === 2) >= 0) {\n\tconsole.log("found");\n}\n`),
		createCase("unicorn", "unicorn/no-useless-spread", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/useless-spread.fixture.js", `const values = [1, 2];\nconst fallback = [...(values || [])];\nconst clone = [...values];\nconst nested = [0, ...[1, 2], 3];\nconsole.log(fallback, clone, nested);\n`),
		createCase("unicorn", "unicorn/explicit-length-check", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/length.fixture.js", `const values = [1, 2];\nif (values.length) {\n\tconsole.log(values);\n}\n`),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/number.fixture.js", ["unicorn/no-zero-fractions", "unicorn/numeric-separators-style", "unicorn/prefer-bigint-literals", "unicorn/prefer-code-point", "unicorn/require-number-to-fixed-digits-argument"], numberCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/fetch.fixture.js", ["unicorn/no-invalid-fetch-options", "unicorn/prefer-response-static-json"], `fetch("/api", { method: "GET", body: "bad" });\nnew Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });\n`),
		createCase("unicorn", "unicorn/switch-case-braces", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/switch.fixture.js", `const value = 1;\nswitch (value) {\ncase 1:\n\tconsole.log("one");\ncase 2:\n\tbreak;\ndefault:\n\tbreak;\n}\n`),
		createCase("unicorn", "unicorn/no-array-method-this-argument", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/array-this-argument.fixture.js", `const values = ["1", "2"];\nconst mapped = values.map(function (value) {\n\treturn value;\n}, {});\nconsole.log(mapped);\n`),
		createCase("unicorn", "unicorn/no-await-expression-member", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/await-member.fixture.js", `async function load(promise) {\n\tconst value = (await promise).value;\n\treturn value;\n}\nconsole.log(load(Promise.resolve({ value: 1 })));\n`),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/objects.fixture.js", ["unicorn/no-immediate-mutation", "unicorn/no-thenable", "unicorn/no-this-assignment"], objectsCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/checks.fixture.js", ["unicorn/no-negation-in-equality-check", "unicorn/no-unreadable-array-destructuring"], checksCode),
		createCase("unicorn", "unicorn/no-accessor-recursion", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/accessor.fixture.js", `class Person {\n\tget name() {\n\t\treturn this.name;\n\t}\n\tset name(value) {\n\t\tthis.name = value;\n\t}\n}\nconsole.log(new Person().name);\n`),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/imports.fixture.js", ["unicorn/no-named-default", "unicorn/prefer-export-from"], `import { default as value } from "./value.js";\nimport * as fs from "node:fs";\nexport { fs, value };\n`),
		createCase("unicorn", "unicorn/no-instanceof-builtins", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/builtin.fixture.js", `const value = [];\nconst isArray = value instanceof Array;\nconsole.log(isArray);\n`),
		createCase("unicorn", "unicorn/no-process-exit", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/process.fixture.js", `process.exit(1);\n`),
		createCase("unicorn", "unicorn/no-empty-file", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/empty.fixture.js", ` \n`),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/modern.fixture.js", ["unicorn/prefer-date-now", "unicorn/prefer-number-properties", "unicorn/prefer-structured-clone"], modernCode),
		createCase("unicorn", "unicorn/prefer-set-size", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/set-size.fixture.js", `const set = new Set([1, 2]);\nconst size = [...set].length;\nconsole.log(size);\n`),
		createCase("unicorn", "unicorn/prefer-switch", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/prefer-switch.fixture.js", preferSwitchCode),
		...createCases("unicorn", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/events.fixture.js", ["unicorn/no-invalid-remove-event-listener", "unicorn/prefer-global-this"], `window.removeEventListener("click", () => {});\nconst event = new KeyboardEvent("keydown", { keyCode: 27 });\nconsole.log(event);\n`),
		createCase("unicorn", "unicorn/no-useless-undefined", { withUnicorn: true }, "test/e2e/fixture/unicorn/invalid/undefined.fixture.js", `function noop() {\n\treturn undefined;\n}\nconst value = undefined;\nconsole.log(noop(), value);\n`),
		...additionalUnicornRuleCases.map(([ruleId, filePath, code]: [ruleId: string, filePath: string, code: string]) => createCase("unicorn", ruleId, { withUnicorn: true }, filePath, code)),
	];
}
