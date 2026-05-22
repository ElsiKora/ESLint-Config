import type { IConfigOptions } from "../../../../dist/esm/index";
import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_PERFECTIONIST_CASES: Array<IRuleBehaviorCase> = [...createPerfectionistImportBehaviorCases()];

function createPerfectionistImportBehaviorCases(): Array<IRuleBehaviorCase> {
	const options: IConfigOptions = { withPerfectionist: true };
	const jsxOptions: IConfigOptions = { withJsx: true, withPerfectionist: true };
	const typeScriptFilePath = "test/e2e/rule-behavior-matrix.fixture.ts";
	const typeScriptOptions: IConfigOptions = { withPerfectionist: true, withTypescript: true };

	return [
		createCase("perfectionist", "perfectionist/sort-array-includes", options, "src/perfectionist/invalid/sort-array-includes.fixture.js", `const hasAlpha = ["zed", "alpha"].includes("alpha");\nconsole.log(hasAlpha);\n`),
		createCase("perfectionist", "perfectionist/sort-classes", typeScriptOptions, typeScriptFilePath, `class Example {\n\tzed() {}\n\talpha() {}\n}\nconsole.log(Example);\n`),
		createCase("perfectionist", "perfectionist/sort-decorators", typeScriptOptions, typeScriptFilePath, `function Zed() {\n\treturn () => undefined;\n}\nfunction Alpha() {\n\treturn () => undefined;\n}\n@Zed()\n@Alpha()\nclass Example {}\nconsole.log(Example);\n`),
		createCase("perfectionist", "perfectionist/sort-enums", typeScriptOptions, typeScriptFilePath, `enum Status {\n\tZed = "zed",\n\tAlpha = "alpha",\n}\nconsole.log(Status);\n`),
		createCase("perfectionist", "perfectionist/sort-export-attributes", options, "src/perfectionist/invalid/sort-export-attributes.fixture.js", `export { default } from "./data.json" with { type: "json", integrity: "sha" };\n`),
		createCase("perfectionist", "perfectionist/sort-exports", options, "src/perfectionist/invalid/sort-exports.fixture.js", `export * from "zed";\nexport * from "alpha";\n`),
		createCase("perfectionist", "perfectionist/sort-heritage-clauses", typeScriptOptions, typeScriptFilePath, `interface Example extends Zed, Alpha {\n\tvalue: string;\n}\n`),
		createCase("perfectionist", "perfectionist/sort-imports", options, "src/perfectionist/invalid/sort-imports.fixture.ts", `import z from "zod";\nimport fs from "node:fs";\nconsole.log(z, fs);\n`),
		createCase("perfectionist", "perfectionist/sort-import-attributes", options, "src/perfectionist/invalid/sort-import-attributes.fixture.ts", `import data from "./data.json" with { type: "json", integrity: "sha" };\nconsole.log(data);\n`),
		createCase("perfectionist", "perfectionist/sort-interfaces", typeScriptOptions, typeScriptFilePath, `interface Example {\n\tzed: string;\n\talpha: string;\n}\n`),
		createCase("perfectionist", "perfectionist/sort-intersection-types", typeScriptOptions, typeScriptFilePath, `type Example = Zed & Alpha;\n`),
		createCase("perfectionist", "perfectionist/sort-jsx-props", jsxOptions, "src/perfectionist/invalid/sort-jsx-props.fixture.jsx", `const element = <Component zed="z" alpha="a" />;\nconsole.log(element);\n`),
		createCase("perfectionist", "perfectionist/sort-maps", options, "src/perfectionist/invalid/sort-maps.fixture.js", `const values = new Map([["zed", 1], ["alpha", 2]]);\nconsole.log(values);\n`),
		createCase("perfectionist", "perfectionist/sort-modules", options, "src/perfectionist/invalid/sort-modules.fixture.js", `function zed() {}\nfunction alpha() {}\nconsole.log(zed, alpha);\n`),
		createCase("perfectionist", "perfectionist/sort-named-imports", options, "src/perfectionist/invalid/sort-named-imports.fixture.ts", `import { writeFile, readFile } from "node:fs/promises";\nconsole.log(writeFile, readFile);\n`),
		createCase("perfectionist", "perfectionist/sort-named-exports", options, "src/perfectionist/invalid/sort-named-exports.fixture.js", `const alpha = 1;\nconst zed = 2;\nexport { zed, alpha };\n`),
		createCase("perfectionist", "perfectionist/sort-object-types", typeScriptOptions, typeScriptFilePath, `type Example = {\n\tzed: string;\n\talpha: string;\n};\n`),
		createCase("perfectionist", "perfectionist/sort-objects", options, "src/perfectionist/invalid/sort-objects.fixture.js", `const value = { zed: 1, alpha: 2 };\nconsole.log(value);\n`),
		createCase("perfectionist", "perfectionist/sort-sets", options, "src/perfectionist/invalid/sort-sets.fixture.js", `const values = new Set(["zed", "alpha"]);\nconsole.log(values);\n`),
		createCase("perfectionist", "perfectionist/sort-switch-case", options, "src/perfectionist/invalid/sort-switch-case.fixture.js", `switch (value) {\n\tcase "zed":\n\t\tbreak;\n\tcase "alpha":\n\t\tbreak;\n}\n`),
		createCase("perfectionist", "perfectionist/sort-union-types", typeScriptOptions, typeScriptFilePath, `type Example = Zed | Alpha;\n`),
		createCase("perfectionist", "perfectionist/sort-variable-declarations", options, "src/perfectionist/invalid/sort-variable-declarations.fixture.js", `const zed = 1, alpha = 2;\nconsole.log(zed, alpha);\n`),
	];
}
