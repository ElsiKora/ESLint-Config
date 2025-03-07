import { createConfig } from "./dist/esm/index.js";

const config = {
	ignores: [
		"package-lock.json",
		"src/test",
		"rollup.test.config.js",
		"vitest.config.e2e.ts",
		"vitest.config.unit.ts",
		"yarn.lock",
		"bun.lock",
		"pnpm-lock.yaml",
		"dist",
		"bin",
		"build",
		"out",
		"www",
		"public/build",
		"_site",
		"release",
		"node_modules",
		".env",
		".env.local",
		".env.*",
		"coverage",
		".cache",
		"public",
		"static",
		"assets",
		"uploads",
		"*.png",
		"*.jpg",
		"*.jpeg",
		"*.gif",
		"*.svg",
		"*.ico",
		"*.md",
		"*.mdx",
		"tmp",
		".temp",
		"**/*.d.ts",
		"**/*.spec.ts",
		"**/*.test.ts",
		"**/*.e2e-spec.ts",
		"__tests__",
		"test",
		"tests",
		".rollup.cache",
		"nextra",
	],
};

export default [
	config,
	...(await createConfig({
		withCheckFile: true,
		withJavascript: true,
		withJson: true,
		withNode: true,
		withPackageJson: true,
		withPerfectionist: true,
		withPrettier: true,
		withRegexp: true,
		withSonar: true,
		withStylistic: true,
		withTypescript: true,
		withUnicorn: true,
		withYaml: true,
	})),
];
