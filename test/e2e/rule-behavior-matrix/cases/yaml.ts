import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_YAML_CASES: Array<IRuleBehaviorCase> = [
	createCase("yaml", "yml/no-empty-document", { withYaml: true }, "test/e2e/fixture/yaml/invalid/no-empty-document.fixture.yaml", "---\n"),
	createCase("yaml", "yml/no-empty-key", { withYaml: true }, "test/e2e/fixture/yaml/invalid/no-empty-key.fixture.yaml", ": value\n"),
	createCase("yaml", "yml/no-empty-mapping-value", { withYaml: true }, "test/e2e/fixture/yaml/invalid/no-empty-mapping-value.fixture.yaml", "key:\n"),
	createCase("yaml", "yml/no-empty-sequence-entry", { withYaml: true }, "test/e2e/fixture/yaml/invalid/no-empty-sequence-entry.fixture.yaml", "- value\n-\n"),
	createCase("yaml", "yml/no-irregular-whitespace", { withYaml: true }, "test/e2e/fixture/yaml/invalid/no-irregular-whitespace.fixture.yaml", "key:\u00a0value\n"),
	createCase("yaml", "yml/no-tab-indent", { withYaml: true }, "test/e2e/fixture/yaml/valid/no-tab-indent.fixture.yaml", "key: value\n", "not-reported"),
	createCase("yaml", "yml/vue-custom-block/no-parsing-error", { withYaml: true }, "test/e2e/fixture/yaml/valid/no-parsing-error.fixture.yaml", "key: value\n", "not-reported"),
];
