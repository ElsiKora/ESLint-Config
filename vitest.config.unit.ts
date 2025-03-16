import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/test/unit/**/*.test.ts"],
		exclude: ["node_modules/**/*"],
		root: ".",
		watch: false,
		testTimeout: 10000,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			all: true,
			exclude: ["**/domain/interface/**", "**/domain/type/**", "**/test/**", "**/vitest.config*.ts", "**/vitest.config*.js", "**/*.config.js", "**/nextra/**", "**/tool/**", "**/node_modules/**", "**/*.d.ts"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	publicDir: false,
});
