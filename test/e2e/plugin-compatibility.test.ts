import type { IConfigOptions } from "../../src";
import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";

type TPluginSmokeCase = {
	code?: string;
	filePath?: string;
	label: string;
	lintFilesPath?: string;
	options: IConfigOptions;
};

const smokeCases: Array<TPluginSmokeCase> = [
	{
		code: "export const hello = 1;",
		filePath: "src/module/example.utility.ts",
		label: "check-file",
		options: { withCheckFile: true },
	},
	{
		code: ".a { color: red; }",
		filePath: "src/styles/example.css",
		label: "css",
		options: { withCss: true },
	},
	{
		code: "const data = { value: 1 };",
		filePath: "src/module/example.js",
		label: "javascript",
		options: { withJavascript: true },
	},
	{
		code: "/foo/.test('foo');",
		filePath: "src/module/example-regexp.js",
		label: "regexp",
		options: { withRegexp: true },
	},
	{
		code: "const value = 1;\nconsole.log(value);",
		filePath: "src/module/example-prettier.ts",
		label: "prettier",
		options: { withPrettier: true },
	},
	{
		code: "import z from 'z';\nimport a from 'a';\nconsole.log(z, a);",
		filePath: "src/module/example-perfectionist.ts",
		label: "perfectionist",
		options: { withPerfectionist: true },
	},
	{
		code: "{\"version\":\"1.0.0\",\"name\":\"pkg\"}",
		filePath: "src/module/example.json",
		label: "json",
		options: { withJson: true },
	},
	{
		code: "foo: bar",
		filePath: "src/module/example.yaml",
		label: "yaml",
		options: { withYaml: true },
	},
	{
		code: "export const Component = () => <div autoFocus />;",
		filePath: "test/e2e/fixture/react/valid/Clean.fixture.jsx",
		label: "jsx",
		options: { withJsx: true, withReact: true },
	},
	{
		code: "process.exit(1);",
		filePath: "src/module/example-node.ts",
		label: "node",
		options: { withNode: true },
	},
	{
		lintFilesPath: "test/e2e/fixture/typescript/valid/clean.fixture.ts",
		label: "typescript-strict",
		options: { withTypescriptStrict: true },
	},
	{
		lintFilesPath: "test/e2e/fixture/next/valid/clean.fixture.tsx",
		label: "next",
		options: { withNext: true },
	},
	{
		code: "const source = { a: 1, b: 2 }; console.log(source);",
		filePath: "src/module/example-sonar.ts",
		label: "sonar",
		options: { withSonar: true },
	},
	{
		code: "class Example {\n\tpublic static run(){return 1;}\n}",
		filePath: "src/module/example-stylistic.ts",
		label: "stylistic",
		options: { withStylistic: true },
	},
	{
		code: "{\"version\":\"1.0.0\",\"name\":\"pkg\"}",
		filePath: "package.json",
		label: "package-json",
		options: { withPackageJson: true },
	},
	{
		lintFilesPath: "test/e2e/fixture/typeorm/valid/clean.fixture.ts",
		label: "typeorm",
		options: { withTypeorm: true },
	},
	{
		code: "const list = [1, 2, 3]; console.log(list);",
		filePath: "src/module/example-unicorn.ts",
		label: "unicorn",
		options: { withUnicorn: true },
	},
];

describe("Plugin Compatibility Smoke Tests", () => {
	for (const smokeCase of smokeCases) {
		it(`should execute '${smokeCase.label}' plugin configuration`, async () => {
			const eslint: ESLint = await createEsLintInstance(smokeCase.options);
			const [result] = smokeCase.lintFilesPath
				? await eslint.lintFiles([smokeCase.lintFilesPath])
				: await eslint.lintText(smokeCase.code ?? "", { filePath: smokeCase.filePath ?? "src/module/default.js" });

			expect(result.fatalErrorCount).toBe(0);
		});
	}
});
