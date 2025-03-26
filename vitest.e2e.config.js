// eslint-disable-next-line @elsikora/unicorn/prevent-abbreviations
import path from "node:path";

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	publicDir: false,
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	test: {
		environment: "node",
		exclude: ["node_modules/**/*"],
		globals: true,
		include: ["test/e2e/**/*.test.ts"],
		root: ".",
		testTimeout: 10_000,
		watch: false,
	},
});
