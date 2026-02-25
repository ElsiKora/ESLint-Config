import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { ConfigFactory } from "@application/factory";

export * from "./application/factory";
export * from "./application/service";
export * from "./application/use-case";
export * from "./domain/error";
export type * from "./domain/interface";
export * from "./domain/model";
export type * from "./domain/port";
export * from "./domain/policy";
export type * from "./domain/type";
export * from "./infrastructure/registry";
export * from "./infrastructure/utility";
export * from "./presentation";
export const createConfig = (options: IConfigOptions): Promise<Array<Linter.Config>> => ConfigFactory.createConfig(options);
export default createConfig;
