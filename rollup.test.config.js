import typescript from "@rollup/plugin-typescript";

const external = [
	"eslint-plugin-react",
	"@next/eslint-plugin-next",
	"eslint-plugin-jsx-a11y",
	"@eslint/js",
	"@stylistic/eslint-plugin",
	"eslint-plugin-check-file",
	"eslint-plugin-jsonc",
	"@eslint/compat",
	"eslint-plugin-ng-module-sort",
	"@elsikora/eslint-plugin-nestjs-typed",
	"typescript-eslint",
	"eslint-plugin-n",
	"eslint-plugin-package-json",
	"eslint-plugin-perfectionist",
	"eslint-plugin-prettier/recommended",
	"@eslint-react/eslint-plugin",
	"eslint-plugin-regexp",
	"eslint-plugin-sonarjs",
	"eslint-plugin-tailwindcss",
	"eslint-plugin-typeorm-typescript/recommended",
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
		},
		plugins: [
			typescript({
				declaration: true,
				declarationDir: "dist/esm",
				outDir: "dist/esm",
				tsconfig: "./tsconfig.build.json",
			}),
		],
	},
];
