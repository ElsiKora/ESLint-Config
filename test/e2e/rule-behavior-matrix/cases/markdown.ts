import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_MARKDOWN_CASES: Array<IRuleBehaviorCase> = [
	createCase("markdown", "@elsikora/markdown/fenced-code-language", { withMarkdown: true }, "test/e2e/fixture/markdown/invalid/fenced-code-language.fixture.md", "```\nconst value = 1;\n```\n"),
	createCase("markdown", "@elsikora/markdown/heading-increment", { withMarkdown: true }, "test/e2e/fixture/markdown/invalid/heading-increment.fixture.md", "# Title\n\n### Skipped\n"),
	createCase("markdown", "@elsikora/markdown/no-empty-links", { withMarkdown: true }, "test/e2e/fixture/markdown/invalid/no-empty-links.fixture.md", "[empty]()\n"),
	createCase("markdown", "@elsikora/markdown/no-invalid-label-refs", { withMarkdown: true }, "test/e2e/fixture/markdown/invalid/no-invalid-label-refs.fixture.md", "[foo][ ]\n"),
	createCase("markdown", "@elsikora/markdown/no-missing-label-refs", { withMarkdown: true }, "test/e2e/fixture/markdown/invalid/no-missing-label-refs.fixture.md", "[missing][label]\n"),
];
