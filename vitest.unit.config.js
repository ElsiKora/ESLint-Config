import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
	publicDir: false,
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	test: {
		coverage: {
			all: true,
			exclude: ["**/domain/interface/**", "**/domain/type/**", "**/test/**", "**/vitest.config*.ts", "**/vitest.config*.js", "**/*.config.js", "**/nextra/**", "**/tool/**", "**/node_modules/**", "**/*.d.ts"],
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
		environment: "node",
		exclude: ["node_modules/**/*"],
		globals: true,
		include: ["src/test/unit/**/*.test.ts"],
		root: ".",
		testTimeout: 10_000,
		watch: false,
	},
});
