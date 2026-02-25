import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

export type TConfigModule = {
	default: (options: IConfigOptions) => Array<Linter.Config>;
};
