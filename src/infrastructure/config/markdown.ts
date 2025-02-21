import type { Linter } from "eslint";
import markdown from "eslint-plugin-markdown";

// @ts-ignore
export default [
	{
		// 1. Add the plugin
		plugins: {
			markdown,
		},
	},
	{
		// 2. Enable the Markdown processor for all .md files.
		files: ["**/*.md"],
		processor: "markdown/markdown",
	},
	{
		// 3. Optionally, customize the configuration ESLint uses for ```js
		// fenced code blocks inside .md files.
		files: ["**/*.md/*.js"],
		// ...
		rules: {
			// ...
		},
	},

	// your other configs here
] as Array<Linter.Config>;
