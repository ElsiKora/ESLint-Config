import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { extractSubPlugin } from "@infrastructure/utility/extract-sub-plugin.utility";

describe("ExtractSubPluginUtility", () => {
	it("should extract only sub-plugin rules and remove parent prefix", () => {
		const plugin: ESLint.Plugin = {
			rules: {
				"jsonc/no-comments": {
					create: () => ({}),
					meta: {},
				},
				"jsonc/vue-custom-block/no-parsing-error": {
					create: () => ({}),
					meta: {},
				},
				"jsonc/vue-custom-block/sort-keys": {
					create: () => ({}),
					meta: {},
				},
			},
		};

		const result = extractSubPlugin(plugin, "vue-custom-block", "jsonc");

		expect(result.rules).toHaveProperty("no-parsing-error");
		expect(result.rules).toHaveProperty("sort-keys");
		expect(result.rules).not.toHaveProperty("no-comments");
	});

	it("should return plugin with empty rules when sub-plugin is absent", () => {
		const plugin: ESLint.Plugin = {
			rules: {
				"n/no-process-exit": {
					create: () => ({}),
					meta: {},
				},
			},
		};

		const result = extractSubPlugin(plugin, "no-unsupported-feature", "n");
		expect(result.rules).toEqual({});
	});
});
