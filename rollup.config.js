import typescript from "@rollup/plugin-typescript";
import dtsPathAlias from "rollup-plugin-dts-path-alias";
import generatePackageJson from "rollup-plugin-generate-package-json";

const external = [
	"@next/eslint-plugin-next",
	"eslint-plugin-jsx-a11y-x",
	"@eslint/js",
	"@stylistic/eslint-plugin",
	"eslint-plugin-check-file",
	"eslint-plugin-fsd-lint",
	"eslint-plugin-jsonc",
	"@eslint/compat",
	"@elsikora/eslint-plugin-nestjs-typed",
	"@elsikora/eslint-plugin-sort-decorators",
	"typescript-eslint",
	"eslint-plugin-n",
	"eslint-plugin-package-json",
	"eslint-plugin-perfectionist",
	"eslint-plugin-prettier/recommended",
	"@eslint-react/eslint-plugin",
	"eslint-plugin-regexp",
	"eslint-plugin-sonarjs",
	"eslint-plugin-tailwindcss",
	"eslint-plugin-typeorm-typescript",
	"eslint-plugin-unicorn",
	"eslint-plugin-yml",
	"@elsikora/eslint-plugin-css",
	"eslint-plugin-jsdoc",
	"@elsikora/eslint-plugin-markdown",
	"@conarti/eslint-plugin-feature-sliced",
	"globals",
	"eslint/use-at-your-own-risk",
	"@tanstack/eslint-plugin-query",
	"@tanstack/eslint-plugin-router",
	"eslint-plugin-i18next",
	"eslint-plugin-no-secrets",
	"eslint-plugin-storybook",
];

export default [
	{
		external,
		input: "src/index.ts",
		output: {
			dir: "dist/esm",
			format: "esm",
			preserveModules: true,
			preserveModulesRoot: "src",
			sourcemap: true,
		},
		plugins: [
			dtsPathAlias(),
			typescript({
				declaration: true,
				declarationDir: "dist/esm",
				outDir: "dist/esm",
				tsconfig: "./tsconfig.build.json",
			}),
			generatePackageJson({
				baseContents: { type: "module" },
				outputFolder: "dist/esm",
			}),
		],
	},
	{
		external,
		input: "src/index.ts",
		output: {
			dir: "dist/cjs",
			exports: "named",
			format: "cjs",
			preserveModules: true,
			preserveModulesRoot: "src",
			sourcemap: true,
		},
		plugins: [
			dtsPathAlias(),
			typescript({
				declaration: true,
				declarationDir: "dist/cjs",
				outDir: "dist/cjs",
				tsconfig: "./tsconfig.build.json",
			}),
			generatePackageJson({
				baseContents: { type: "commonjs" },
				outputFolder: "dist/cjs",
			}),
		],
	},
];
