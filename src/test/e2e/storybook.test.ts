import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";
import { formatRuleName } from "../../infrastructure/utility/format-rule-name.utility";

describe("Storybook Configuration", () => {
	describe("General Story Files", () => {
		describe("Valid Story Files", () => {
			it("should pass valid Storybook story files", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/valid/clean.fixture.stories.jsx")]);
				expect(results[0].warningCount).toBe(0);
				expect(results[0].errorCount).toBe(0);
			});
		});
	});

	describe("Structure and Export Rules", () => {
		describe("Component Metadata", () => {
			it("should enforce default-exports rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/default-exports.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/default-exports"))).toBe(true);
			});

			it("should enforce hierarchy-separator rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/hierarchy-separator.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/hierarchy-separator"))).toBe(true);
			});
		});

		describe("Story Exports", () => {
			it("should enforce story-exports rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/story-exports.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/story-exports"))).toBe(true);
			});
		});

		describe("Naming Conventions", () => {
			it("should enforce no-redundant-story-name rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/no-redundant-story-name.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/no-redundant-story-name"))).toBe(true);
			});

			it("should enforce prefer-pascal-case rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/prefer-pascal-case.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/prefer-pascal-case"))).toBe(true);
			});
		});
	});

	describe("Interactive Testing", () => {
		describe("Play Function Rules", () => {
			it("should enforce await-interactions rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/await-interactions.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/await-interactions"))).toBe(true);
			});

			it("should enforce context-in-play-function rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/context-in-play-function.fixture.stories.jsx")]);
				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/context-in-play-function"))).toBe(true);
			});
		});

		describe("Testing Utilities", () => {
			it("should enforce use-storybook-expect rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/use-storybook-expect.fixture.stories.jsx")]);

				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/use-storybook-expect"))).toBe(true);
			});

			it("should enforce use-storybook-testing-library rule", async () => {
				const eslint: ESLint = await createEsLintInstance({
					withStorybook: true,
				});

				const results = await eslint.lintFiles([getFixturePath("storybook/invalid/use-storybook-testing-library.fixture.stories.js")]);

				expect(results[0].messages.some((msg) => msg.ruleId === formatRuleName("storybook/use-storybook-testing-library"))).toBe(true);
			});
		});
	});
});