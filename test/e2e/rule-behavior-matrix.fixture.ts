import type { IRuleBehaviorCase } from "./rule-behavior-matrix/types";

export type { IRuleBehaviorCase, IRuleBehaviorScenario } from "./rule-behavior-matrix/types";
export { ALL_CONFIG_OPTIONS, RULE_BEHAVIOR_SCENARIOS } from "./rule-behavior-matrix/scenarios";

import { RULE_BEHAVIOR_CHECK_FILE_CASES } from "./rule-behavior-matrix/cases/check-file";
import { RULE_BEHAVIOR_CSS_CASES } from "./rule-behavior-matrix/cases/css";
import { RULE_BEHAVIOR_FSD_CASES } from "./rule-behavior-matrix/cases/fsd";
import { RULE_BEHAVIOR_I18NEXT_CASES } from "./rule-behavior-matrix/cases/i18next";
import { RULE_BEHAVIOR_JAVASCRIPT_CASES } from "./rule-behavior-matrix/cases/javascript";
import { RULE_BEHAVIOR_JSX_CASES } from "./rule-behavior-matrix/cases/jsx";
import { RULE_BEHAVIOR_JSON_CASES } from "./rule-behavior-matrix/cases/json";
import { RULE_BEHAVIOR_MARKDOWN_CASES } from "./rule-behavior-matrix/cases/markdown";
import { RULE_BEHAVIOR_JSDOC_CASES } from "./rule-behavior-matrix/cases/jsdoc";
import { RULE_BEHAVIOR_NEST_CASES } from "./rule-behavior-matrix/cases/nest";
import { RULE_BEHAVIOR_NEXT_CASES } from "./rule-behavior-matrix/cases/next";
import { RULE_BEHAVIOR_NODE_CASES } from "./rule-behavior-matrix/cases/node";
import { RULE_BEHAVIOR_NO_SECRETS_CASES } from "./rule-behavior-matrix/cases/no-secrets";
import { RULE_BEHAVIOR_PACKAGE_JSON_CASES } from "./rule-behavior-matrix/cases/package-json";
import { RULE_BEHAVIOR_PERFECTIONIST_CASES } from "./rule-behavior-matrix/cases/perfectionist";
import { RULE_BEHAVIOR_PRETTIER_CASES } from "./rule-behavior-matrix/cases/prettier";
import { RULE_BEHAVIOR_REACT_CASES } from "./rule-behavior-matrix/cases/react";
import { RULE_BEHAVIOR_REGEXP_CASES } from "./rule-behavior-matrix/cases/regexp";
import { RULE_BEHAVIOR_SONAR_CASES } from "./rule-behavior-matrix/cases/sonar";
import { RULE_BEHAVIOR_STORYBOOK_CASES } from "./rule-behavior-matrix/cases/storybook";
import { RULE_BEHAVIOR_STYLISTIC_CASES } from "./rule-behavior-matrix/cases/stylistic";
import { RULE_BEHAVIOR_TAILWIND_CSS_CASES } from "./rule-behavior-matrix/cases/tailwind-css";
import { RULE_BEHAVIOR_TYPESCRIPT_CASES } from "./rule-behavior-matrix/cases/typescript";
import { RULE_BEHAVIOR_UNICORN_CASES } from "./rule-behavior-matrix/cases/unicorn";
import { RULE_BEHAVIOR_TANSTACK_CASES } from "./rule-behavior-matrix/cases/tanstack";
import { RULE_BEHAVIOR_TYPEORM_CASES } from "./rule-behavior-matrix/cases/typeorm";
import { RULE_BEHAVIOR_YAML_CASES } from "./rule-behavior-matrix/cases/yaml";

export const RULE_BEHAVIOR_CASES: Array<IRuleBehaviorCase> = [
	...RULE_BEHAVIOR_CHECK_FILE_CASES,
	...RULE_BEHAVIOR_CSS_CASES,
	...RULE_BEHAVIOR_FSD_CASES,
	...RULE_BEHAVIOR_I18NEXT_CASES,
	...RULE_BEHAVIOR_JAVASCRIPT_CASES,
	...RULE_BEHAVIOR_JSX_CASES,
	...RULE_BEHAVIOR_JSON_CASES,
	...RULE_BEHAVIOR_MARKDOWN_CASES,
	...RULE_BEHAVIOR_JSDOC_CASES,
	...RULE_BEHAVIOR_NEST_CASES,
	...RULE_BEHAVIOR_NEXT_CASES,
	...RULE_BEHAVIOR_NODE_CASES,
	...RULE_BEHAVIOR_NO_SECRETS_CASES,
	...RULE_BEHAVIOR_PACKAGE_JSON_CASES,
	...RULE_BEHAVIOR_PERFECTIONIST_CASES,
	...RULE_BEHAVIOR_PRETTIER_CASES,
	...RULE_BEHAVIOR_REACT_CASES,
	...RULE_BEHAVIOR_REGEXP_CASES,
	...RULE_BEHAVIOR_SONAR_CASES,
	...RULE_BEHAVIOR_STORYBOOK_CASES,
	...RULE_BEHAVIOR_STYLISTIC_CASES,
	...RULE_BEHAVIOR_TAILWIND_CSS_CASES,
	...RULE_BEHAVIOR_TYPESCRIPT_CASES,
	...RULE_BEHAVIOR_UNICORN_CASES,
	...RULE_BEHAVIOR_TANSTACK_CASES,
	...RULE_BEHAVIOR_TYPEORM_CASES,
	...RULE_BEHAVIOR_YAML_CASES,
];
