import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { ConfigFactory } from "@application/factory";

export * from "./application/factory";
export type * from "./domain/interface";
export type * from "./domain/type";
export * from "./infrastructure/utility";
export const createConfig = (options: IConfigOptions): Promise<Array<Linter.Config>> => ConfigFactory.createConfig(options);
export default createConfig;
