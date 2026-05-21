import type { IConfigOptions } from "../../../../dist/esm/index";
import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_PACKAGE_JSON_CASES: Array<IRuleBehaviorCase> = [...createPackageJsonBehaviorCases()];

function createPackageJsonBehaviorCases(): Array<IRuleBehaviorCase> {
	const options: IConfigOptions = { withPackageJson: true };
	const missingRequiredCode: string = createPackageJsonMissingRequiredCase();
	const invalidFieldsCode: string = createPackageJsonInvalidFieldsCase();
	const invalidScalarFieldsCode: string = createPackageJsonInvalidScalarFieldsCase();
	const missingRequiredRuleIds: Array<string> = ["package-json/require-attribution", "package-json/require-description", "package-json/require-exports", "package-json/require-files", "package-json/require-license", "package-json/require-name", "package-json/require-repository", "package-json/require-sideEffects", "package-json/require-type", "package-json/require-version"];
	const invalidFieldsRuleIds: Array<string> = [
		"package-json/no-empty-fields",
		"package-json/no-redundant-files",
		"package-json/no-redundant-publishConfig",
		"package-json/order-properties",
		"package-json/repository-shorthand",
		"package-json/sort-collections",
		"package-json/specify-peers-locally",
		"package-json/unique-dependencies",
		"package-json/valid-author",
		"package-json/valid-bin",
		"package-json/valid-browser",
		"package-json/valid-bugs",
		"package-json/valid-bundleDependencies",
		"package-json/valid-contributors",
		"package-json/valid-cpu",
		"package-json/valid-description",
		"package-json/valid-devEngines",
		"package-json/valid-directories",
		"package-json/valid-exports",
		"package-json/valid-funding",
		"package-json/valid-gypfile",
		"package-json/valid-homepage",
		"package-json/valid-keywords",
		"package-json/valid-license",
		"package-json/valid-man",
		"package-json/valid-module",
		"package-json/valid-os",
		"package-json/valid-packageManager",
		"package-json/valid-peerDependenciesMeta",
		"package-json/valid-peerDependenciesMeta-relationship",
		"package-json/valid-private",
		"package-json/valid-scripts",
		"package-json/valid-sideEffects",
		"package-json/valid-type",
		"package-json/valid-version",
		"package-json/valid-workspaces",
	];
	const invalidScalarFieldsRuleIds: Array<string> = ["package-json/valid-config", "package-json/valid-dependencies", "package-json/valid-devDependencies", "package-json/valid-engines", "package-json/valid-files", "package-json/valid-libc", "package-json/valid-main", "package-json/valid-name", "package-json/valid-optionalDependencies", "package-json/valid-peerDependencies", "package-json/valid-publishConfig", "package-json/valid-repository"];

	return [
		...missingRequiredRuleIds.map((ruleId: string) => createCase("package-json", ruleId, options, "test/e2e/fixture/package-json/invalid/missing-required/package.json", missingRequiredCode)),
		...invalidFieldsRuleIds.map((ruleId: string) => createCase("package-json", ruleId, options, "test/e2e/fixture/package-json/invalid/invalid-fields/package.json", invalidFieldsCode)),
		...invalidScalarFieldsRuleIds.map((ruleId: string) => createCase("package-json", ruleId, options, "test/e2e/fixture/package-json/invalid/invalid-scalar-fields/package.json", invalidScalarFieldsCode)),
		createCase("package-json", "package-json/valid-repository-directory", options, "test/e2e/fixture/package-json/invalid/repository-directory/package.json", createPackageJsonInvalidRepositoryDirectoryCase()),
	];
}

function createPackageJsonMissingRequiredCase(): string {
	return `${JSON.stringify({}, null, "\t")}\n`;
}

function createPackageJsonInvalidFieldsCase(): string {
	return `${JSON.stringify(
		{
			version: "bad",
			name: "sample",
			description: "",
			type: "invalid",
			license: 123,
			repository: "github:user/repo",
			sideEffects: "yes",
			exports: true,
			files: ["README.md", "lib/index.js", "lib/index.js"],
			main: "lib/index.js",
			author: 123,
			bin: 123,
			browser: 123,
			bugs: "not-a-url",
			bundleDependencies: "bad",
			config: {},
			contributors: [123],
			cpu: "x64",
			dependencies: { zed: "1.0.0", dup: "1.0.0", bad: "bad" },
			devDependencies: { dup: "1.0.0", aaa: "bad" },
			devEngines: "bad",
			directories: "bad",
			engines: { node: "bad" },
			funding: 123,
			gypfile: "yes",
			homepage: "not-a-url",
			keywords: "bad",
			libc: "glibc",
			man: 123,
			module: 123,
			optionalDependencies: { opt: "bad" },
			os: "darwin",
			packageManager: "npm@bad",
			peerDependencies: { react: "^18.0.0", peerbad: "bad" },
			peerDependenciesMeta: { missing: { optional: true }, react: { optional: "yes" } },
			private: "yes",
			publishConfig: { access: "public" },
			scripts: { test: 123, build: "echo build" },
			workspaces: "bad",
		},
		null,
		"\t",
	)}\n`;
}

function createPackageJsonInvalidScalarFieldsCase(): string {
	return `${JSON.stringify(
		{
			config: "bad",
			dependencies: "bad",
			devDependencies: "bad",
			engines: "bad",
			files: "bad",
			libc: 123,
			main: 123,
			name: "Invalid Name",
			optionalDependencies: "bad",
			peerDependencies: "bad",
			publishConfig: "bad",
			repository: 123,
		},
		null,
		"\t",
	)}\n`;
}

function createPackageJsonInvalidRepositoryDirectoryCase(): string {
	return `${JSON.stringify(
		{
			repository: {
				type: "git",
				url: "https://github.com/example/project.git",
				directory: "packages/mismatch",
			},
		},
		null,
		"\t",
	)}\n`;
}
