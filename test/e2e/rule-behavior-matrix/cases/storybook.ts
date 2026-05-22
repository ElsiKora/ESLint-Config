import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_STORYBOOK_CASES: Array<IRuleBehaviorCase> = [
	createCase("storybook", "@elsikora/storybook/await-interactions", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/await-interactions.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/context-in-play-function", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/context-in-play-function.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/default-exports", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/default-exports.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/hierarchy-separator", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/hierarchy-separator.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/no-redundant-story-name", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/no-redundant-story-name.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/no-renderer-packages", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/no-renderer-packages.fixture.stories.jsx", `import { Meta } from "@storybook/react";\nexport default { title: "Components/Button" };\nexport const Primary = {};\nconsole.log(Meta);\n`),
	createCase("storybook", "@elsikora/storybook/no-uninstalled-addons", { withStorybook: true }, ".storybook/main.js", `export default { addons: ["@storybook/addon-imaginary"] };\n`),
	createCase("storybook", "@elsikora/storybook/prefer-pascal-case", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/prefer-pascal-case.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/story-exports", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/story-exports.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/use-storybook-expect", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/use-storybook-expect.fixture.stories.jsx"),
	createCase("storybook", "@elsikora/storybook/use-storybook-testing-library", { withStorybook: true }, "test/e2e/fixture/storybook/invalid/use-storybook-testing-library.fixture.stories.js"),
];
