import type { ESLint } from "eslint";

export type TRuleDocumentationPluginCache = Map<string, WeakMap<ESLint.Plugin, ESLint.Plugin>>;
