import type { Linter } from "eslint";

export type TConfigModule = {
	default: ((options?: any) => Array<Linter.Config>) | Array<Linter.Config>;
};
