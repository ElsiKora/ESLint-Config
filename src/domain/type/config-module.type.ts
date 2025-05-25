import type { Linter } from "eslint";

export type TConfigModule = {
	default: (options?: unknown) => Array<Linter.Config>;
};
