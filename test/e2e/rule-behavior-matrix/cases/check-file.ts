import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_CHECK_FILE_CASES: Array<IRuleBehaviorCase> = [
	createCase("check-file", "check-file/filename-blocklist", { withCheckFile: true, withJavascript: true }, "src/user.models.ts", `export const value = 1;\n`),
	createCase("check-file", "check-file/filename-naming-convention", { withCheckFile: true, withJavascript: true }, "src/dto/UserProfile.dto.js", `export const value = 1;\n`),
	createCase("check-file", "check-file/folder-match-with-fex", { withCheckFile: true, withJavascript: true }, "src/service/user.dto.js", `export const value = 1;\n`),
	createCase("check-file", "check-file/folder-naming-convention", { withCheckFile: true, withJavascript: true }, "src/badFolder/user.utility.js", `export const value = 1;\n`),
];
