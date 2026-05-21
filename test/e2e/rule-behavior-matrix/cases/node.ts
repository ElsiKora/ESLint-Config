import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_NODE_CASES: Array<IRuleBehaviorCase> = [...createNodeBehaviorCases()];

function createNodeBehaviorCases(): Array<IRuleBehaviorCase> {
	return [
		createCase("node", "n/exports-style", { withNode: true }, "src/node/invalid/exports-style.fixture.js", `/* global module, exports */\nmodule.exports = { value: 1 };\n`),
		createCase("node", "n/hashbang", { withNode: true }, "src/node/invalid/hashbang.fixture.js", `#!/usr/bin/env node\nconsole.log(1);\n`),
		createCase("node", "n/no-deprecated-api", { withNode: true }, "src/node/invalid/no-deprecated-api.fixture.js", `const value = new Buffer("x");\nconsole.log(value);\n`),
		createCase("node", "n/no-exports-assign", { withNode: true }, "src/node/invalid/no-exports-assign.fixture.js", `/* global exports:writable */\nexports = {};\n`),
		createCase("node", "n/no-extraneous-import", { withNode: true }, "src/node/invalid/no-extraneous-import.fixture.js", `import semver from "semver";\nconsole.log(semver);\n`),
		createCase("node", "n/no-extraneous-require", { withNode: true }, "src/node/invalid/no-extraneous-require.fixture.js", `/* global require */\nconst semver = require("semver");\nconsole.log(semver);\n`),
		createCase("node", "n/no-missing-require", { withNode: true }, "src/node/invalid/no-missing-require.fixture.js", `/* global require */\nconst missing = require("definitely-missing-package-name");\nconsole.log(missing);\n`),
		createCase("node", "n/no-process-exit", { withNode: true }, "src/node/invalid/no-process-exit.fixture.js", `process.exit(1);\n`),
		createCase("node-with-unicorn", "n/no-process-exit", { withNode: true, withUnicorn: true }, "src/node/valid/no-process-exit-with-unicorn.fixture.js", `process.exit(1);\n`, "not-reported"),
		createCase("node", "n/no-unpublished-import", { withNode: true }, "dist/esm/no-unpublished-import.fixture.js", `import config from "../../src/infrastructure/config/node.ts";\nconsole.log(config);\n`),
		createCase("node", "n/no-unpublished-require", { withNode: true }, "dist/esm/no-unpublished-require.fixture.js", `/* global require */\nconst config = require("../../src/infrastructure/config/node.ts");\nconsole.log(config);\n`),
		createCase("node", "n/no-unsupported-features/es-builtins", { withNode: true }, "src/node/invalid/no-unsupported-features-es-builtins.fixture.js", `Map.groupBy([], (value) => value);\n`),
		createCase("node", "n/no-unsupported-features/es-syntax", { withNode: true }, "src/node/invalid/no-unsupported-features-es-syntax.fixture.js", `Promise.withResolvers();\n`),
		createCase("node", "n/no-unsupported-features/node-builtins", { withNode: true }, "src/node/invalid/no-unsupported-features-node-builtins.fixture.js", `import { getCallSites } from "node:util";\nconsole.log(getCallSites);\n`),
		createCase("node", "n/process-exit-as-throw", { withNode: true }, "src/node/valid/process-exit-as-throw.fixture.js", `process.exit(1);\n`, "not-reported"),
	];
}
